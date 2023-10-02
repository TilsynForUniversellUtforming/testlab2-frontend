package no.uutilsynet.testlab2frontendserver

import no.uutilsynet.testlab2frontendserver.common.RestTemplateHeaderModifierInterceptor
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.context.annotation.Bean
import org.springframework.web.client.RestTemplate

@SpringBootApplication(exclude = [SecurityAutoConfiguration::class])
@ConfigurationPropertiesScan
class Testlab2FrontendServerApplication(
    val restTemplateBuilder: RestTemplateBuilder,
    val restTemplateHeaderModifierInterceptor: RestTemplateHeaderModifierInterceptor
) {

  @Bean
  fun restTemplate(): RestTemplate {
    return restTemplateBuilder.interceptors(restTemplateHeaderModifierInterceptor).build()
  }
}

fun main(args: Array<String>) {
  runApplication<Testlab2FrontendServerApplication>(*args)
}
