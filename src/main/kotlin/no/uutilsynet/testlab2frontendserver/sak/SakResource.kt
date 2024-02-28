package no.uutilsynet.testlab2frontendserver.sak

import java.lang.Integer.parseInt
import java.time.LocalDate
import no.uutilsynet.testlab2frontendserver.common.LoeysingsregisterApiProperties
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.krav.KravApiProperties
import no.uutilsynet.testlab2frontendserver.krav.dto.Krav
import no.uutilsynet.testlab2frontendserver.maalinger.dto.Loeysing
import no.uutilsynet.testlab2frontendserver.testreglar.dto.InnhaldstypeTesting
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Tema
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testobjekt
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelDTO
import no.uutilsynet.testlab2frontendserver.testreglar.dto.toTestregel
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

@RestController
@RequestMapping("api/v1/saker", produces = [MediaType.APPLICATION_JSON_VALUE])
class SakResource(
    val restTemplate: RestTemplate,
    testingApiProperties: TestingApiProperties,
    loeysingsregisterApiProperties: LoeysingsregisterApiProperties,
    kravApiProperties: KravApiProperties
) {

  val sakUrl = "${testingApiProperties.url}/saker"
  val loeysingUrl = "${loeysingsregisterApiProperties.url}/v1/loeysing"
  val testregelUrl = "${testingApiProperties.url}/v1/testreglar"
  val kravUrl = "${kravApiProperties.url}/v1/krav"

  data class NySak(val namn: String, val virksomhet: String, val frist: LocalDate)

  val logger: Logger = LoggerFactory.getLogger(SakResource::class.java)

  @PostMapping
  fun createSak(@RequestBody nySak: NySak): ResponseEntity<Int> =
      runCatching {
            logger.debug("Lager ny sak: {} fra {}", nySak, sakUrl)
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
  fun getAlleSaker(): List<Sak.ListeElement> {
    return restTemplate.getList<Sak.ListeElement>(sakUrl)
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

    val testregelList = restTemplate.getList<TestregelDTO>("$testregelUrl?includeMetadata=true")
    val temaList = restTemplate.getList<Tema>("$testregelUrl/temaForTestreglar")
    val testobjektList = restTemplate.getList<Testobjekt>("$testregelUrl/testobjektForTestreglar")
    val innhaldstypeForTestingList =
        restTemplate.getList<InnhaldstypeTesting>("$testregelUrl/innhaldstypeForTesting")
    val krav = restTemplate.getList<Krav>("$kravUrl/wcag2krav")

    val testreglar =
        sakDTO.testreglar.map { sakTr ->
          testregelList
              .find { it.id == sakTr.id }
              ?.toTestregel(
                  temaList,
                  testobjektList,
                  innhaldstypeForTestingList,
                  krav.find { krav -> krav.id == sakTr.kravId }
                      ?: throw RuntimeException("Testregel har krav som ikkje finns"))
              ?: throw RuntimeException("Sak har testregel som ikkje finns")
        }

    return ResponseEntity.ok(Sak(verksemd = verksemd, loeysingNettsideRelation, testreglar))
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
