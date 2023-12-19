package no.uutilsynet.testlab2frontendserver

import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import java.io.IOException
import java.util.function.Supplier
import java.util.stream.Collectors
import no.uutilsynet.testlab2securitylib.RoleExtractor
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter
import org.springframework.security.web.csrf.*
import org.springframework.util.StringUtils
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.OncePerRequestFilter

@Configuration
@EnableWebSecurity
class SecurityConfig {
  val rolesExtractor = RoleExtractor()

  @Bean
  open fun filterChain(http: HttpSecurity): SecurityFilterChain {
    http {
      csrf {
        csrfTokenRepository = CookieCsrfTokenRepository.withHttpOnlyFalse()
        csrfTokenRequestHandler = SpaCsrfTokenRequestHandler()
      }
      authorizeHttpRequests {
        authorize("/actuator/**", permitAll)
        authorize(anyRequest, hasAuthority("brukar subscriber"))
      }
      oauth2Login { userInfoEndpoint { userAuthoritiesMapper = userAuthoritiesMapper() } }
    }
    http.addFilterAfter(CsrfCookieFilter(), BasicAuthenticationFilter::class.java)

    return http.build()
  }

  @Bean
  fun corsConfigurationSource(): CorsConfigurationSource {
    val configuration = CorsConfiguration()
    configuration.allowedOrigins =
        listOf(
            "https://user.difi.no",
            "https://test-testlab.uutilsynet.no",
            "https://beta-testlab.uutilsynet.no")
    configuration.allowCredentials = true
    val source = UrlBasedCorsConfigurationSource()
    source.registerCorsConfiguration("/**", configuration)
    return source
  }

  private fun userAuthoritiesMapper(): GrantedAuthoritiesMapper =
      GrantedAuthoritiesMapper { authorities: Collection<GrantedAuthority> ->
        val roles: Set<GrantedAuthority> =
            authorities
                .stream()
                .filter { grantedAuthority -> grantedAuthority is OidcUserAuthority }
                .map { grantedAuthority ->
                  rolesExtractor.extractRoleFromClaims(grantedAuthority as OidcUserAuthority)
                }
                .collect(Collectors.toList())
                .flatten()
                .toSet()

        roles
      }
}

class SpaCsrfTokenRequestHandler : CsrfTokenRequestAttributeHandler() {
  private val delegate: CsrfTokenRequestHandler = XorCsrfTokenRequestAttributeHandler()

  override fun handle(
      request: HttpServletRequest,
      response: HttpServletResponse,
      csrfToken: Supplier<CsrfToken>
  ) {
    /*
     * Always use XorCsrfTokenRequestAttributeHandler to provide BREACH protection of
     * the CsrfToken when it is rendered in the response body.
     */
    delegate.handle(request, response, csrfToken)
  }

  override fun resolveCsrfTokenValue(request: HttpServletRequest, csrfToken: CsrfToken): String {
    /*
     * If the request contains a request header, use CsrfTokenRequestAttributeHandler
     * to resolve the CsrfToken. This applies when a single-page application includes
     * the header value automatically, which was obtained via a cookie containing the
     * raw CsrfToken.
     */
    return if (StringUtils.hasText(request.getHeader(csrfToken.headerName))) {
      super.resolveCsrfTokenValue(request, csrfToken)
    } else {
      /*
       * In all other cases (e.g. if the request contains a request parameter), use
       * XorCsrfTokenRequestAttributeHandler to resolve the CsrfToken. This applies
       * when a server-side rendered form includes the _csrf request parameter as a
       * hidden input.
       */
      delegate.resolveCsrfTokenValue(request, csrfToken)
    }
  }
}

class CsrfCookieFilter : OncePerRequestFilter() {

  @Throws(ServletException::class, IOException::class)
  override fun doFilterInternal(
      request: HttpServletRequest,
      response: HttpServletResponse,
      filterChain: FilterChain
  ) {
    val csrfToken = request.getAttribute("_csrf") as CsrfToken
    // Render the token value to a cookie by causing the deferred token to be loaded
    csrfToken.token
    filterChain.doFilter(request, response)
  }
}
