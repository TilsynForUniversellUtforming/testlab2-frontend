package no.uutilsynet.testlab2frontendserver.loeysing

import java.net.URI
import no.uutilsynet.testlab2frontendserver.common.LoeysingsregisterApiProperties
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.maalinger.dto.Loeysing
import no.uutilsynet.testlab2frontendserver.maalinger.dto.LoeysingFormElement
import no.uutilsynet.testlab2frontendserver.verksemd.Verksemd
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.getForObject

@RestController
@RequestMapping("api/v1/loeysing")
class LoeysingResource(
    val restTemplate: RestTemplate,
    loeysingsregisterApiProperties: LoeysingsregisterApiProperties
) {
  val logger: Logger = LoggerFactory.getLogger(LoeysingResource::class.java)

  val loeysingUrl = "${loeysingsregisterApiProperties.url}/v1/loeysing"
  val versksemdUrl = "${loeysingsregisterApiProperties.url}/v1/verksemd"

  data class CreateLoeysingDTO(val namn: String, val url: String, val organisasjonsnummer: String)

  data class DeleteLoeysingDTO(val loeysingIdList: List<Int>)

  @GetMapping("{id}")
  fun getLoeysing(@PathVariable id: Int): ResponseEntity<Loeysing> =
      try {
        val url = "$loeysingUrl/$id"
        val loeysing: Loeysing = restTemplate.getForObject(url)
        ResponseEntity.ok(loeysing)
      } catch (e: Error) {
        logger.error("Klarte ikkje å hente løysing med id $id", e)
        throw RuntimeException("Klarte ikkje å hente løysing")
      }

  @GetMapping("/{id}/withVerksemd")
  fun getLoeysingWithVerksemd(@PathVariable id: Int): ResponseEntity<LoeysingFormElement> {
    try {
      val url = "$loeysingUrl/$id"
      val loeysing: Loeysing = restTemplate.getForObject(url)
      val verksemd = getVerksemd(loeysing)

      return ResponseEntity.ok(
          LoeysingFormElement(
              loeysing.id, loeysing.namn, loeysing.url, loeysing.orgnummer, verksemd))
    } catch (e: Error) {
      logger.error("Klarte ikkje å hente løysing med id $id", e)
      throw RuntimeException("Klarte ikkje å hente løysing")
    }
  }

  fun getVerksemd(loeysing: Loeysing): Verksemd? {
    return loeysing.verksemdId?.let { restTemplate.getForObject<Verksemd>("$versksemdUrl/$it") }
  }

  @GetMapping
  fun getLoeysingList(
      @RequestParam("name", required = false) namn: String?,
      @RequestParam("orgnummer", required = false) orgnummer: String?
  ): ResponseEntity<Any> {
    if (namn != null && orgnummer != null) {
      return ResponseEntity.badRequest().body("Må søke med enten namn eller orgnummer")
    }
    return try {
      if (namn != null) {
        ResponseEntity.ok(restTemplate.getList<Loeysing>("$loeysingUrl?search=$namn"))
      } else if (orgnummer != null) {
        ResponseEntity.ok(restTemplate.getList<Loeysing>("$loeysingUrl?search=$orgnummer"))
      } else {
        ResponseEntity.ok(getLoeysingList())
      }
    } catch (e: Error) {
      logger.error("Klarte ikkje å hente løysingar", e)
      return ResponseEntity.internalServerError().body("Klarte ikkje å hente løysingar")
    }
  }

  private fun getLoeysingList(): List<Loeysing> {
    return restTemplate.getList<Loeysing>(loeysingUrl)
  }

  @PostMapping
  fun createLoeysing(@RequestBody dto: CreateLoeysingDTO): ResponseEntity<out Any> =
      runCatching {
            val location =
                restTemplate.postForLocation(
                    loeysingUrl,
                    mapOf(
                        "namn" to dto.namn,
                        "url" to dto.url,
                        "orgnummer" to dto.organisasjonsnummer))
                    ?: throw RuntimeException("Kunne ikkje hente location frå servaren")
            val createdLoeysing =
                restTemplate.getForObject(location, Loeysing::class.java)
                    ?: throw RuntimeException("Kunne ikkje hente løysing frå servaren")
            ResponseEntity.created(URI("/loeysing/${createdLoeysing.id}")).body(getLoeysingList())
          }
          .getOrElse {
            val feilmelding = "noko gjekk gale da eg forsøkte å lage ei ny løysing"
            logger.error(feilmelding, it)
            ResponseEntity.internalServerError().build()
          }

  @PutMapping
  fun updateLoeysing(@RequestBody loeysing: Loeysing): ResponseEntity<out Any> =
      runCatching {
            restTemplate.put(loeysingUrl, loeysing)
            ResponseEntity.ok(getLoeysingList())
          }
          .getOrElse {
            logger.error("Could not update solution", it)
            ResponseEntity.internalServerError()
                .body("noko gjekk gale då eg prøvde å endre ei løysing")
          }

  @DeleteMapping
  fun deleteLoeysingList(@RequestBody dto: DeleteLoeysingDTO): ResponseEntity<out Any> {
    for (id in dto.loeysingIdList) {
      runCatching { restTemplate.delete("$loeysingUrl/$id") }
          .getOrElse {
            logger.error("Kunne ikkje slette løysing med id $id", it)
            return when (it) {
              is HttpClientErrorException ->
                  ResponseEntity.status(it.statusCode).body(it.responseBodyAsString)
              else -> ResponseEntity.internalServerError().body(it.message)
            }
          }
    }
    return ResponseEntity.ok().body(getLoeysingList())
  }
}
