package no.uutilsynet.testlab2frontendserver.utval

import java.net.URI
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.maalinger.dto.Loeysing
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.RestTemplate

@RestController
@RequestMapping("api/v1/utval")
class UtvalResource(
    val restTemplate: RestTemplate,
    val testingApiProperties: TestingApiProperties
) {
  private val logger: Logger = LoggerFactory.getLogger(UtvalResource::class.java)
  @GetMapping
  fun getUtvalList(): List<UtvalListItem> {
    val url = "${testingApiProperties.url}/v1/utval"
    return restTemplate.getList(url)
  }

  @GetMapping("/{id}")
  fun getUtval(@PathVariable id: Int): ResponseEntity<Utval> =
      runCatching {
            val url = URI("${testingApiProperties.url}/v1/utval/$id")
            restTemplate.getForObject(url, Utval::class.java)
          }
          .map { ResponseEntity.ok(it) }
          .getOrElse {
            when (it) {
              is HttpClientErrorException.NotFound -> ResponseEntity.notFound().build()
              else -> {
                logger.atError().log("Klarte ikkje å hente utval med id $id", it)
                ResponseEntity.internalServerError().build()
              }
            }
          }

  data class UtvalListItem(val id: Int, val namn: String)

  data class Utval(val id: Int, val namn: String, val loeysingar: List<Loeysing>)
}
