package no.uutilsynet.testlab2frontendserver

import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import java.io.IOException
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
import org.springframework.security.web.csrf.*
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
      csrf { csrfTokenRepository = CookieCsrfTokenRepository.withHttpOnlyFalse() }
      authorizeHttpRequests { authorize(anyRequest, hasAuthority("brukar subscriber")) }
      oauth2Login { userInfoEndpoint { userAuthoritiesMapper = userAuthoritiesMapper() } }
      cors { configurationSource = corsConfigurationSource() }
    }
    //   http.addFilterAfter(CsrfCookieFilter(), BasicAuthenticationFilter::class.java)

    return http.build()
  }

  @Bean
  fun corsConfigurationSource(): CorsConfigurationSource {
    val configuration = CorsConfiguration()
    configuration.allowedOrigins =
        listOf(
            "https://user.difi.no",
            "https://test-testlab.uutilsynet.no",
            "https://beta-testlab.uutilsynet.no",
            "http://localhost")
    configuration.allowCredentials = true
    configuration.allowedMethods =
        listOf("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH")
    configuration.allowedHeaders = listOf("*")
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
