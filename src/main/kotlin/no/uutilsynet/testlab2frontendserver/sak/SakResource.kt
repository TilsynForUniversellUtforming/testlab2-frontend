package no.uutilsynet.testlab2frontendserver.sak

import java.lang.Integer.parseInt
import no.uutilsynet.testlab2frontendserver.common.LoeysingsregisterApiProperties
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.maalinger.dto.Loeysing
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.getForEntity

@RestController
@RequestMapping("api/v1/saker", produces = [MediaType.APPLICATION_JSON_VALUE])
class SakResource(
    val restTemplate: RestTemplate,
    testingApiProperties: TestingApiProperties,
    loeysingsregisterApiProperties: LoeysingsregisterApiProperties
) {

  val sakUrl = "${testingApiProperties.url}/saker"
  val loeysingUrl = "${loeysingsregisterApiProperties.url}/v1/loeysing"

  data class NySak(val namn: String, val virksomhet: String)

  val logger: Logger = LoggerFactory.getLogger(SakResource::class.java)

  @PostMapping
  fun createSak(@RequestBody nySak: NySak): ResponseEntity<Int> =
      runCatching {
            logger.debug("Lager ny sak med orgnrummer: ${nySak.virksomhet} fra $sakUrl")
            val location = restTemplate.postForLocation(sakUrl, nySak)
            if (location != null) {

              // TODO - Ordentlig metode for location
              ResponseEntity.ok(parseInt(location.path.substringAfterLast("/")))
            } else {
              throw RuntimeException("Kunne ikkje opprette sak")
            }
          }
          .getOrElse {
            logger.error("Klarte ikkje å opprette sak", it)
            throw it
          }

  @GetMapping
  fun getAlleSaker(): ResponseEntity<Any> {
    return restTemplate.getForEntity<Any>(sakUrl)
  }

  @GetMapping("/{id}")
  fun getSak(@PathVariable id: Int): ResponseEntity<Sak> {
    logger.debug("hentar sak med id: $id fra $sakUrl")

    val sakDTO = restTemplate.getForObject("$sakUrl/$id", SakDTO::class.java)

    if (sakDTO == null) {
      logger.error("Kunne ikkje hente sak med id $id frå server")
      throw RuntimeException("Klarte ikkje å hente sal")
    }

    val loeysingList = restTemplate.getList<Loeysing>(loeysingUrl)

    // TODO - Hent riktig verksemd
    val verksemd: Loeysing =
        loeysingList.find { it.orgnummer == sakDTO.virksomhet }
            ?: throw IllegalArgumentException("Verksemd finns ikkje")

    val loeysingNettsideRelation =
        sakDTO.loeysingar.map { loeysingDTO ->
          LoeysingNettsideRelation(
              loeysingList.find { loeysing -> loeysingDTO.loeysingId == loeysing.id }
                  ?: throw IllegalArgumentException("Verksemd finns ikkje"),
              loeysingDTO.nettsider.map { it.toNettsideProperties() })
        }

    return ResponseEntity.ok(Sak(verksemd = verksemd, loeysingNettsideRelation, sakDTO.testreglar))
  }

  @PutMapping("/{id}")
  fun updateSak(@PathVariable id: Int, @RequestBody sak: SakDTO): ResponseEntity<Sak> =
      runCatching {
            logger.debug("Oppdaterer sak id: $id fra $sakUrl")
            restTemplate.put("$sakUrl/$id", sak)
            getSak(id)
          }
          .getOrElse {
            logger.error("Kunne ikkje oppdatere sak med id $id")
            throw it
          }
}
