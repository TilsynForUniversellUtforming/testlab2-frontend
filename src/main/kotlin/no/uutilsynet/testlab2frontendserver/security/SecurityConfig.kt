package no.uutilsynet.testlab2frontendserver.security

import java.util.stream.Collectors
import no.uutilsynet.testlab2securitylib.RoleExtractor
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.csrf.CookieCsrfTokenRepository
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
class SecurityConfig {
  val rolesExtractor = RoleExtractor()

  @Bean
  @Profile("security")
  fun filterChain(
      http: HttpSecurity,
      corsConfiguration: UrlBasedCorsConfigurationSource
  ): SecurityFilterChain {
    http {
      csrf { csrfTokenRepository = CookieCsrfTokenRepository.withHttpOnlyFalse() }
      authorizeHttpRequests { authorize(anyRequest, hasAuthority("brukar subscriber")) }
      oauth2Login { userInfoEndpoint { userAuthoritiesMapper = userAuthoritiesMapper() } }
      cors { configurationSource = corsConfiguration }
      sessionManagement { sessionCreationPolicy = SessionCreationPolicy.ALWAYS }
    }

    return http.build()
  }

  @Bean
  @Profile("!security")
  fun openFilterChain(http: HttpSecurity): SecurityFilterChain {
    http {
      authorizeHttpRequests { authorize(anyRequest, permitAll) }
      cors {}
      csrf { disable() }
    }
    return http.build()
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
