package no.uutilsynet.testlab2frontendserver

import java.net.MalformedURLException
import java.net.URI
import java.net.URL
import org.slf4j.LoggerFactory
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
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
      logger.error("jeg klarte ikke å hente målinger", e)
      ResponseEntity.internalServerError().body(e.message)
    }
  }

  data class NewMaalingDTO(val url: String)

  @PostMapping
  fun createNew(@RequestBody dto: NewMaalingDTO): ResponseEntity<Any> {
    try {
      val validatedUrl = URL(dto.url)
      val location =
          restTemplate.postForLocation(
              "${testingApiProperties.url}/v1/maalinger", mapOf("url" to validatedUrl.toString()))
      if (location == null) {
        logger.error("jeg fikk laget en ny måling, men jeg fikk ikke noen location fra serveren")
        return ResponseEntity.internalServerError().body("mangler location")
      }

      val newMaaling =
          restTemplate.getForObject("${testingApiProperties.url}${location}", Maaling::class.java)
      if (newMaaling != null) {
        val id = newMaaling.id
        return ResponseEntity.created(URI("/maaling/${id}")).build()
      } else {
        logger.error(
            "jeg fikk laget en ny måling, men klarte ikke å hente den nye målingen fra serveren")
        return ResponseEntity.internalServerError().build()
      }
    } catch (e: MalformedURLException) {
      return ResponseEntity.badRequest().body("'${dto.url}' er ikke en gyldig url")
    } catch (e: RestClientException) {
      logger.error("jeg klarte ikke å lage en ny måling", e)
      return ResponseEntity.internalServerError().body(e.message)
    }
  }
}

data class Maaling(val id: Int, val url: String)
