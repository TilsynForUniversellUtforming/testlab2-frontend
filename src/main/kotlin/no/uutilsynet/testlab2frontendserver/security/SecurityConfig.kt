package no.uutilsynet.testlab2frontendserver.security

import no.uutilsynet.testlab2securitylib.RoleExtractor
import no.uutilsynet.testlab2securitylib.Testlab2AuthenticationConverter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity.http
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.csrf.CookieCsrfTokenRepository
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import java.util.stream.Collectors

@Configuration
@EnableWebSecurity
class SecurityConfig {
  val rolesExtractor = RoleExtractor()

  @Bean
  @Profile("security")
  fun filterChain(http: HttpSecurity): SecurityFilterChain {
      http {
          csrf { csrfTokenRepository = CookieCsrfTokenRepository.withHttpOnlyFalse() }
          authorizeHttpRequests {
              authorize(anyRequest, authenticated)
          }
          oauth2ResourceServer {
              jwt { jwtAuthenticationConverter = Testlab2AuthenticationConverter() }
          }
          sessionManagement { sessionCreationPolicy = SessionCreationPolicy.STATELESS }
          cors { disable() }
      }

      return http.build()
  }


}
