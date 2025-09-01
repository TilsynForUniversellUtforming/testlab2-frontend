package no.uutilsynet.testlab2frontendserver.testreglar

import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.krav.KravApiClient
import no.uutilsynet.testlab2frontendserver.krav.KravApiProperties
import no.uutilsynet.testlab2frontendserver.krav.dto.Krav
import no.uutilsynet.testlab2frontendserver.maalinger.dto.IdList
import no.uutilsynet.testlab2frontendserver.testreglar.dto.InnhaldstypeTesting
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Tema
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testobjekt
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testregel
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelBase
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelDTO
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelInit
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelModus
import no.uutilsynet.testlab2frontendserver.testreglar.dto.toTestregel
import org.slf4j.LoggerFactory
import org.springframework.http.MediaType
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
import org.springframework.web.client.RestTemplate

private const val DUPLIKAT_SKJEMA_FOR_TESTREGEL = "Duplikat skjema for testregel"

@RestController
@RequestMapping("api/v1/testreglar", produces = [MediaType.APPLICATION_JSON_VALUE])
class TestregelResource(
    val restTemplate: RestTemplate,
    testingApiProperties: TestingApiProperties,
    kravApiProperties: KravApiProperties,
    val testregelApiClient: TestregelApiClient,
    val kravApiClient: KravApiClient
) {
  val logger = LoggerFactory.getLogger(TestregelResource::class.java)

  val testregelUrl = "${testingApiProperties.url}/v1/testreglar"
  val kravUrl = "${kravApiProperties.url}/v1/krav"

  @GetMapping("{id}")
  fun getTestregel(@PathVariable id: Int): ResponseEntity<Testregel> =
      runCatching {
            val testregelDTO =
                restTemplate.getForObject("$testregelUrl/$id", TestregelDTO::class.java)
            val temaList = testregelApiClient.getTemaForTestreglar()
            val testobjektList = testregelApiClient.getTestobjektForTesting()
            val innhaldstypeForTestingList = testregelApiClient.getInnhaldstypeForTestingList()
            val krav = getKrav(testregelDTO?.kravId)
            ResponseEntity.ok(
                testregelDTO?.toTestregel(
                    temaList, testobjektList, innhaldstypeForTestingList, krav))
          }
          .getOrElse {
            logger.error("Kunne ikkje hente testregel", it)
            throw it
          }

  fun getKrav(kravId: Int?): Krav {
    requireNotNull(kravId) { "KravId kan ikkje vere null" }
    return kravApiClient.getKrav(kravId)
  }

  @GetMapping
  fun listTestreglar(
      @RequestParam(required = false) includeMetadata: Boolean = false
  ): List<TestregelBase> =
      try {
        logger.debug("Henter testreglar fra $testregelUrl")
        testregelApiClient.getTestregelList()
      } catch (e: Error) {
        logger.error("klarte ikke å hente testreglar", e)
        throw Error("Klarte ikke å hente testreglar")
      }

  @PostMapping
  fun createTestregel(@RequestBody testregel: TestregelInit): List<TestregelBase> =
      try {
        logger.debug("Lagrer ny testregel med navn: ${testregel.namn} fra $testregelUrl")
        validateDuplicatSchema(testregel)
        validateNotSemiAutomatic(testregel)
        restTemplate.postForEntity(testregelUrl, testregel, Int::class.java)
        listTestreglar()
      } catch (e: IllegalArgumentException) {
        logger.error(DUPLIKAT_SKJEMA_FOR_TESTREGEL, e)
        throw e
      } catch (e: Error) {
        logger.error("Klarte ikke å lage testregel", e)
        throw Error("Klarte ikke å lage testregel")
      }

  private fun validateNotSemiAutomatic(testregel: TestregelInit) {
    require(testregel.modus != TestregelModus.semiAutomatisk) { "Det er ikkje støtte for semi-automatiske testreglar" }
  }

  private fun validateDuplicatSchema(testregel: TestregelInit) {
    val testregelList = getTestregelList()
    require(!testregelList.any { it.testregelSchema == testregel.testregelSchema }) { DUPLIKAT_SKJEMA_FOR_TESTREGEL }
  }

  @PutMapping
  fun updateTestregel(@RequestBody testregel: TestregelInit): List<TestregelBase> =
      try {
          logger.debug("Oppdaterer testregel id: {} fra {}", testregel.id, testregelUrl)
        validateDuplicatSchema(testregel)
        restTemplate.put(testregelUrl, testregel, Testregel::class.java)
        listTestreglar()
      } catch (e: IllegalArgumentException) {
        logger.error(DUPLIKAT_SKJEMA_FOR_TESTREGEL, e)
        throw Error(DUPLIKAT_SKJEMA_FOR_TESTREGEL)
      } catch (e: Error) {
        logger.error("Klarte ikke å oppdatere testregel", e)
        throw Error("Klarte ikke å oppdatere testregel")
      }

  private fun getTestregelList() = testregelApiClient.getTestregelListWithMetadata()

  @DeleteMapping
  fun deleteTestregelList(@RequestBody idList: IdList): ResponseEntity<out Any> {
    for (id in idList.idList) {
      runCatching { restTemplate.delete("$testregelUrl/$id") }
          .getOrElse {
            logger.error("Kunne ikkje slette testregel med id $id", it)
            throw Error("Kunne ikkje slette testregel")
          }
    }
    return ResponseEntity.ok().body(listTestreglar())
  }

  @GetMapping("innhaldstypeForTesting")
  fun getInnhaldstypeForTesting(): List<InnhaldstypeTesting> =
      try {
        logger.debug("Henter innhaldstype for testing fra $testregelUrl")
        testregelApiClient.getInnhaldstypeForTestingList()
      } catch (e: Error) {
        logger.error("klarte ikke å hente innhaldstype for testing", e)
        throw Error("Klarte ikke å hente innhaldstype for testing")
      }

  @GetMapping("temaForTestreglar")
  fun getTemaForTesreglar(): List<Tema> =
      try {
        logger.debug("Henter tema fra $testregelUrl")
        restTemplate.getList<Tema>("$testregelUrl/temaForTestreglar")
      } catch (e: Error) {
        logger.error("klarte ikke å hente tema", e)
        throw Error("Klarte ikke å hente tema")
      }

  @GetMapping("testobjektForTestreglar")
  fun getTestobjektForTestreglar(): List<Testobjekt> =
      try {
        logger.debug("Henter testobjekt fra $testregelUrl")
        testregelApiClient.getTestobjektForTesting()
      } catch (e: Error) {
        logger.error("klarte ikke å hente testobjekt", e)
        throw Error("Klarte ikke å hente testobjekt")
      }

    @GetMapping("krav/{kravId}")
  fun getKrav(@PathVariable kravId: Int): Krav =
      try {
        restTemplate.getForObject("$kravUrl/wcag2krav/$kravId", Krav::class.java)
            ?: throw NoSuchElementException("Krav med id $kravId finns ikkje")
      } catch (e: Error) {
        logger.error("Klarte ikkje hente krav med id $kravId", e)
        throw Error("Klarte ikkje hente krav med id $kravId", e)
      }
}
