package no.uutilsynet.testlab2frontendserver.maalinger

import java.net.URI
import java.net.URL
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.maalinger.dto.Loeysing
import no.uutilsynet.testlab2frontendserver.maalinger.dto.Maaling
import no.uutilsynet.testlab2frontendserver.maalinger.dto.NewMaalingDTO
import org.slf4j.LoggerFactory
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestClientException
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.getForObject

@RestController
@RequestMapping("api/v1/maalinger")
class MaalingResource(
    val restTemplate: RestTemplate,
    val testingApiProperties: TestingApiProperties
) {
  val logger = LoggerFactory.getLogger(MaalingResource::class.java)

  @ConfigurationProperties(prefix = "testing.api") data class TestingApiProperties(val url: String)
  val maalingUrl = "${testingApiProperties.url}/v1/maalinger"

  @GetMapping
  fun list(): List<Maaling> {
    return try {
      logger.info("henter målinger fra ${maalingUrl}")
      restTemplate.getList(maalingUrl)
    } catch (e: RestClientException) {
      logger.error("klarte ikke å hente målinger", e)
      throw Error("Klarte ikke å hente målinger")
    }
  }

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
              restTemplate.getForObject(
                  "${testingApiProperties.url}${location}", Maaling::class.java)
                  ?: throw RuntimeException(
                      "jeg fikk laget en ny måling, men klarte ikke å hente den nye målingen fra serveren")
          ResponseEntity.created(URI("/maaling/${newMaaling.id}")).build<Any>()
        }
        .getOrElse {
          ResponseEntity.internalServerError()
              .body("noe gikk galt da jeg forsøkte å lage en ny måling: ${it.message}")
        }
  }

  @GetMapping("loeysingar")
  fun getLoesyingar(): List<Loeysing> =
      try {
        logger.info("Henter løsninger fra $testingApiProperties")
        restTemplate.getList("$maalingUrl/loeysingar")
      } catch (e: Error) {
        logger.error("klarte ikke å hente løsninger", e)
        throw Error("Klarte ikke å hente løsninger")
      }
}
