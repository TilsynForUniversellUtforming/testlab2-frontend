package no.uutilsynet.testlab2frontendserver.common

import no.uutilsynet.testlab2frontendserver.security.TokenRelayInterceptor
import org.springframework.boot.restclient.RestTemplateBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.http.client.ClientHttpRequestInterceptor
import org.springframework.web.client.RestClient
import org.springframework.web.client.RestTemplate

@Configuration
class RestClientConfig {

  @Bean
  @Profile("!security")
  fun restClient(
      builder: RestClient.Builder,
  ): RestClient {
    return builder.build()
  }

  @Bean
  @Profile("security")
  fun restClientSecurity(
      builder: RestClient.Builder,
      tokenRelayInterceptor: TokenRelayInterceptor,
  ): RestClient {
    val clientBuilder = builder.requestInterceptor(tokenRelayInterceptor)
    return clientBuilder.build()
  }
}
