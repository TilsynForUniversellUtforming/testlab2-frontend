package no.uutilsynet.testlab2frontendserver.testreglar

import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.maalinger.dto.IdList
import no.uutilsynet.testlab2frontendserver.testreglar.dto.InnhaldstypeTesting
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Tema
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testobjekt
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testregel
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelBase
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelDTO
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelInit
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
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.RestTemplate

@RestController
@RequestMapping("api/v1/testreglar", produces = [MediaType.APPLICATION_JSON_VALUE])
class TestregelResource(
    val restTemplate: RestTemplate,
    testingApiProperties: TestingApiProperties,
) {
  val logger = LoggerFactory.getLogger(TestregelResource::class.java)

  val testregelUrl = "${testingApiProperties.url}/v1/testreglar"

  @GetMapping("{id}")
  fun getTestregel(@PathVariable id: Int): ResponseEntity<Testregel> =
      runCatching {
            val testregelDTO =
                restTemplate.getForObject("$testregelUrl/$id", TestregelDTO::class.java)
            val temaList = restTemplate.getList<Tema>("$testregelUrl/temaForTestreglar")
            val testobjektList =
                restTemplate.getList<Testobjekt>("$testregelUrl/testobjektForTestreglar")
            val innhaldstypeForTestingList =
                restTemplate.getList<InnhaldstypeTesting>("$testregelUrl/innhaldstypeForTesting")
            ResponseEntity.ok(
                testregelDTO?.toTestregel(temaList, testobjektList, innhaldstypeForTestingList))
          }
          .getOrElse {
            logger.error("Kunne ikkje hente testregel", it)
            throw it
          }

  @GetMapping
  fun listTestreglar(
      @RequestParam(required = false) includeMetadata: Boolean = false
  ): List<TestregelBase> =
      try {
        logger.debug("Henter testreglar fra $testregelUrl")
        val url = if (includeMetadata) "$testregelUrl?includeMetadata=true" else testregelUrl
        restTemplate.getList<TestregelBase>(url)
      } catch (e: Error) {
        logger.error("klarte ikke å hente testreglar", e)
        throw Error("Klarte ikke å hente testreglar")
      }

  @PostMapping
  fun createTestregel(@RequestBody testregel: TestregelInit): List<TestregelBase> =
      try {
        logger.debug("Lagrer ny testregel med navn: ${testregel.namn} fra $testregelUrl")
        val testregelList = restTemplate.getList<TestregelDTO>("$testregelUrl?includeMetadata=true")
        if (testregelList.any { it.testregelSchema == testregel.testregelSchema }) {
          throw IllegalArgumentException("Duplikat skjema for testregel")
        }
        restTemplate.postForEntity(testregelUrl, testregel, Int::class.java)
        listTestreglar()
      } catch (e: IllegalArgumentException) {
        logger.error("Duplikat skjema for testregel", e)
        throw e
      } catch (e: Error) {
        logger.error("Klarte ikke å lage testregel", e)
        throw Error("Klarte ikke å lage testregel")
      }

  @PutMapping
  fun updateTestregel(@RequestBody testregel: TestregelInit): List<TestregelBase> =
      try {
        logger.debug("Oppdaterer testregel id: ${testregel.id} fra $testregelUrl")
        val testregelList = restTemplate.getList<TestregelDTO>("$testregelUrl?includeMetadata=true")
        if (testregelList.any {
          it.testregelSchema == testregel.testregelSchema && it.id != testregel.id
        }) {
          throw IllegalArgumentException("Duplikat skjema for testregel")
        }
        restTemplate.put(testregelUrl, testregel, Testregel::class.java)
        listTestreglar()
      } catch (e: IllegalArgumentException) {
        logger.error("Duplikat skjema for testregel", e)
        throw e
      } catch (e: Error) {
        logger.error("Klarte ikke å oppdatere testregel", e)
        throw Error("Klarte ikke å oppdatere testregel")
      }

  @DeleteMapping
  fun deleteTestregelList(@RequestBody idList: IdList): ResponseEntity<out Any> {
    for (id in idList.idList) {
      runCatching { restTemplate.delete("$testregelUrl/$id") }
          .getOrElse {
            logger.error("Kunne ikkje slette testregel med id $id", it)
            return when (it) {
              is HttpClientErrorException ->
                  ResponseEntity.status(it.statusCode).body(it.responseBodyAsString)
              else -> ResponseEntity.internalServerError().body(it.message)
            }
          }
    }
    return ResponseEntity.ok().body(listTestreglar())
  }

  @GetMapping("innhaldstypeForTesting")
  fun getInnhaldstypeForTesting(): List<InnhaldstypeTesting> =
      try {
        logger.debug("Henter innhaldstype for testing fra $testregelUrl")
        restTemplate.getList<InnhaldstypeTesting>("$testregelUrl/innhaldstypeForTesting")
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
        restTemplate.getList<Testobjekt>("$testregelUrl/testobjektForTestreglar")
      } catch (e: Error) {
        logger.error("klarte ikke å hente testobjekt", e)
        throw Error("Klarte ikke å hente testobjekt")
      }
}
