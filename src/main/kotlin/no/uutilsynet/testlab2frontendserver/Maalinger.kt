package no.uutilsynet.testlab2frontendserver

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

  data class NewMaalingDTO(val navn: String, val url: String)

  fun validateURL(s: String): Result<URL> {
    return runCatching { URL(s) }
  }

  fun validateNavn(s: String): Result<String> = runCatching {
    if (s == "") {
      throw IllegalArgumentException("navn er tomt")
    } else {
      s
    }
  }

  @PostMapping
  fun createNew(@RequestBody dto: NewMaalingDTO): ResponseEntity<Any> {
    return runCatching {
        val validatedURL = validateURL(dto.url).getOrThrow()
        val validatedNavn = validateNavn(dto.navn).getOrThrow()
        val location =
          restTemplate.postForLocation(
            "${testingApiProperties.url}/v1/maalinger",
            mapOf("navn" to validatedNavn, "url" to validatedURL.toString()))
            ?: throw RuntimeException(
              "jeg fikk laget en ny måling, men jeg fikk ikke noen location fra serveren")
        val newMaaling =
          restTemplate.getForObject("${testingApiProperties.url}${location}", Maaling::class.java)
            ?: throw RuntimeException(
              "jeg fikk laget en ny måling, men klarte ikke å hente den nye målingen fra serveren")
        ResponseEntity.created(URI("/maaling/${newMaaling.id}")).build<Any>()
      }
      .getOrElse {
        ResponseEntity.internalServerError()
          .body("noe gikk galt da jeg forsøkte å lage en ny måling: ${it.message}")
      }
  }

  data class Maaling(val id: Int, val url: String)
}
