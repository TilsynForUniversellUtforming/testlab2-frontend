package no.uutilsynet.testlab2frontendserver

import no.uutilsynet.testlab2securitylib.interceptor.BearerTokenInterceptor
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Profile
import org.springframework.http.client.ClientHttpRequestInterceptor
import org.springframework.web.client.RestTemplate

@SpringBootApplication(
    exclude = [SecurityAutoConfiguration::class],
    scanBasePackages =
        ["no.uutilsynet.testlab2frontendserver", "no.uutilsynet.testlab2securitylib"])
@ConfigurationPropertiesScan
class Testlab2FrontendServerApplication(val restTemplateBuilder: RestTemplateBuilder) {

  @Bean
  @Profile("security")
  fun restTemplateSecurity(bearerTokenInterceptor: BearerTokenInterceptor): RestTemplate {
    val interceptors: ArrayList<ClientHttpRequestInterceptor> = ArrayList()
    interceptors.add(bearerTokenInterceptor)

    return restTemplateBuilder.interceptors(interceptors).build()
  }

  @Bean
  @Profile("!security")
  fun restTemplate(): RestTemplate {

    return restTemplateBuilder.build()
  }
}

fun main(args: Array<String>) {
  runApplication<Testlab2FrontendServerApplication>(*args)
}
