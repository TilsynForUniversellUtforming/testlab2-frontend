package no.uutilsynet.testlab2frontendserver

import org.slf4j.LoggerFactory
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestClientException
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.getForObject

@RestController
@RequestMapping("api/v1/maalinger")
class Maalinger(val restTemplate: RestTemplate, val testingApiProperties: TestingApiProperties) {
  val logger = LoggerFactory.getLogger(Maalinger::class.java)

  @ConfigurationProperties(prefix = "testing.api") data class TestingApiProperties(val url: String)

  @GetMapping
  fun list(): ResponseEntity<Any> {
    return try {
      val responseType = object : ParameterizedTypeReference<List<Maaling>>() {}
      val url = testingApiProperties.url
      logger.info("henter målinger fra ${url}")
      val maalinger: List<Maaling> = restTemplate.getForObject("${url}/v1/maalinger", responseType)
      ResponseEntity.ok(maalinger)
    } catch (e: RestClientException) {
      logger.error("klarte ikke å hente målinger", e)
      ResponseEntity.internalServerError().body(e.message)
    }
  }
}

data class Maaling(val id: Int, val url: String)
