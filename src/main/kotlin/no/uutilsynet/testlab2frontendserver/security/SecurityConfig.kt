package no.uutilsynet.testlab2frontendserver.security

import no.uutilsynet.testlab2securitylib.Testlab2AuthenticationConverter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.csrf.CookieCsrfTokenRepository

@Configuration
@EnableWebSecurity
class SecurityConfig {

  @Bean
  @Profile("security")
  fun filterChain(http: HttpSecurity): SecurityFilterChain {
    http {
      csrf { csrfTokenRepository = CookieCsrfTokenRepository.withHttpOnlyFalse() }
      authorizeHttpRequests {  authorize(anyRequest, hasAuthority("brukar subscriber")) }
      oauth2ResourceServer {
        jwt { jwtAuthenticationConverter = Testlab2AuthenticationConverter() }
      }
      sessionManagement { sessionCreationPolicy = SessionCreationPolicy.STATELESS }
      cors { disable() }
    }

    return http.build()
  }
}
