package no.uutilsynet.testlab2frontendserver

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
) {

  @Bean
  fun restTemplate(): RestTemplate {
    return restTemplateBuilder.build()
  }
}

fun main(args: Array<String>) {
  runApplication<Testlab2FrontendServerApplication>(*args)
}
