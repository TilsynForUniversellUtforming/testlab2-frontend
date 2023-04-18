package no.uutilsynet.testlab2frontendserver.loeysing

import java.net.URI
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.maalinger.MaalingResource
import no.uutilsynet.testlab2frontendserver.maalinger.dto.Loeysing
import org.slf4j.LoggerFactory
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.getForObject

@RestController
@RequestMapping("api/v1/loeysing")
class LoeysingResource(
    val restTemplate: RestTemplate,
    val testingApiProperties: TestingApiProperties
) {

  val logger = LoggerFactory.getLogger(MaalingResource::class.java)

  @ConfigurationProperties(prefix = "testing.api") data class TestingApiProperties(val url: String)
  val loeysingUrl = "${testingApiProperties.url}/v1/loeysing"

  data class CreateLoeysingDTO(
      val namn: String,
      val url: String,
  )

  data class DeleteLoeysingDTO(val loeysingIdList: List<Int>)

  @GetMapping("{id}")
  fun getLoeysing(@PathVariable id: Int): ResponseEntity<Loeysing> =
      try {
        logger.info("Henter løsning fra $testingApiProperties")
        val url = "$loeysingUrl/$id"
        restTemplate.getForObject(url)
      } catch (e: Error) {
        logger.error("klarte ikke å hente løsninger", e)
        throw RuntimeException("Klarte ikke å hente løsninger")
      }

  @GetMapping
  fun getLoeysingList(): List<Loeysing> =
      try {
        logger.info("Henter løsninger fra $testingApiProperties")
        restTemplate.getList(loeysingUrl)
      } catch (e: Error) {
        logger.error("klarte ikke å hente løsninger", e)
        throw RuntimeException("Klarte ikke å hente løsninger")
      }

  @PostMapping
  fun createLoeysing(@RequestBody dto: CreateLoeysingDTO): ResponseEntity<out Any> =
      runCatching {
            val location =
                restTemplate.postForLocation(loeysingUrl, dto, Int::class.java)
                    ?: throw RuntimeException("Kunne ikkje hente location fra servaren")
            val createdLoeysing =
                restTemplate.getForObject(
                    "${testingApiProperties.url}${location}", Loeysing::class.java)
                    ?: throw RuntimeException("Kunne ikkje hente løysing fra servaren")
            ResponseEntity.created(URI("/loeysing/${createdLoeysing.id}")).body(getLoeysingList())
          }
          .getOrElse {
            ResponseEntity.internalServerError()
                .body("noe gikk galt da eg forsøkte å lage en ny løysing: ${it.message}")
          }

  @PutMapping
  fun updateLoeysing(@RequestBody loeysing: Loeysing): ResponseEntity<out Any> =
      runCatching {
            restTemplate.put(loeysingUrl, loeysing, Int::class.java)
            ResponseEntity.ok(getLoeysingList())
          }
          .getOrElse {
            logger.error("klarte ikke å oppdatere løsninger", it)
            ResponseEntity.internalServerError()
                .body("noe gikk galt da jeg forsøkte å endre en måling: ${it.message}")
          }

  @DeleteMapping
  fun deleteLoeysingList(@RequestBody dto: DeleteLoeysingDTO): ResponseEntity<out Any> =
      runCatching {
            for (id in dto.loeysingIdList) {
              restTemplate.delete("$loeysingUrl/$id")
            }
            ResponseEntity.ok().body(getLoeysingList())
          }
          .getOrElse {
            ResponseEntity.internalServerError()
                .body("noe gikk galt da jeg forsøkte å slette en måling: ${it.message}")
          }
}
