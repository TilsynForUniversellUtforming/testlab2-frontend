package no.uutilsynet.testlab2frontendserver.loeysing

import java.net.URI
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.maalinger.dto.Loeysing
import no.uutilsynet.testlab2frontendserver.maalinger.dto.MaalingDTO
import org.slf4j.LoggerFactory
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

  val logger = LoggerFactory.getLogger(LoeysingResource::class.java)

  val loeysingUrl = "${testingApiProperties.url}/v1/loeysing"
  val maalingUrl = "${testingApiProperties.url}/v1/maalinger"

  data class CreateLoeysingDTO(
      val namn: String,
      val url: String,
  )

  data class DeleteLoeysingDTO(val loeysingIdList: List<Int>)

  @GetMapping("{id}")
  fun getLoeysing(@PathVariable id: Int): ResponseEntity<Loeysing> =
      try {
        val url = "$loeysingUrl/$id"
        restTemplate.getForObject(url)
      } catch (e: Error) {
        logger.error("Klarte ikkje å hente løysing med id $id", e)
        throw RuntimeException("Klarte ikkje å hente løysing")
      }

  @GetMapping
  fun getLoeysingList(): List<Loeysing> =
      try {
        restTemplate.getList(loeysingUrl)
      } catch (e: Error) {
        logger.error("Klarte ikkje å hente løysingar", e)
        throw RuntimeException("Klarte ikkje å hente løysingar")
      }

  @PostMapping
  fun createLoeysing(@RequestBody dto: CreateLoeysingDTO): ResponseEntity<out Any> =
      runCatching {
            val location =
                restTemplate.postForLocation(loeysingUrl, dto, Int::class.java)
                    ?: throw RuntimeException("Kunne ikkje hente location frå servaren")
            val createdLoeysing =
                restTemplate.getForObject(
                    "${testingApiProperties.url}${location}", Loeysing::class.java)
                    ?: throw RuntimeException("Kunne ikkje hente løysing frå servaren")
            ResponseEntity.created(URI("/loeysing/${createdLoeysing.id}")).body(getLoeysingList())
          }
          .getOrElse {
            ResponseEntity.internalServerError()
                .body("noko gikk gjekk da eg forsøkte å lage ei ny løysing")
          }

  @PutMapping
  fun updateLoeysing(@RequestBody loeysing: Loeysing): ResponseEntity<out Any> =
      runCatching {
            restTemplate.put(loeysingUrl, loeysing, Int::class.java)
            ResponseEntity.ok(getLoeysingList())
          }
          .getOrElse {
            logger.error("Could not update solution", it)
            ResponseEntity.internalServerError()
                .body("noko gjekk gale då eg prøvde å endre ei løysing")
          }

  @DeleteMapping
  fun deleteLoeysingList(@RequestBody dto: DeleteLoeysingDTO): ResponseEntity<out Any> =
      runCatching {
            val maalingList =
                restTemplate.getList<MaalingDTO>(maalingUrl).filterNot {
                  it.loeysingList != null &&
                      it.loeysingList.any { l -> dto.loeysingIdList.contains(l.id) }
                }

            if (maalingList.isEmpty()) {
              for (id in dto.loeysingIdList) {
                restTemplate.delete("$loeysingUrl/$id")
              }
              ResponseEntity.ok().body(getLoeysingList())
            } else {
              ResponseEntity.badRequest()
                  .body(
                      "Løysing blir brukt i følgjande målingar: ${maalingList.joinToString(",") { it.navn }}")
            }
          }
          .getOrElse {
            ResponseEntity.internalServerError()
                .body("noe gikk galt da jeg forsøkte å slette ei løysing: ${it.message}")
          }
}
