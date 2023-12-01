package no.uutilsynet.testlab2frontendserver.common

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.web.client.RestTemplateCustomizer
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate

@Component
class CustomRestTemplateCustomizer : RestTemplateCustomizer {

  @Autowired
  lateinit var restTemplateHeaderModifierInterceptor: RestTemplateHeaderModifierInterceptor

  override fun customize(restTemplate: RestTemplate?) {
    restTemplate?.interceptors?.add(restTemplateHeaderModifierInterceptor)
  }
}
