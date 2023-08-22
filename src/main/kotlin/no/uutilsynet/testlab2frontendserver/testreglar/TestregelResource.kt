package no.uutilsynet.testlab2frontendserver.testreglar

import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.maalinger.dto.IdList
import no.uutilsynet.testlab2frontendserver.testreglar.dto.CreateTestregelDTO
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Regelsett
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testregel
import org.slf4j.LoggerFactory
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
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

  @GetMapping
  fun listTestreglar(): List<Testregel> =
      try {
        logger.debug("Henter testreglar fra $testregelUrl")
        restTemplate.getList<Testregel>(testregelUrl)
      } catch (e: Error) {
        logger.error("klarte ikke å hente testreglar", e)
        throw Error("Klarte ikke å hente testreglar")
      }

  @GetMapping("regelsett")
  fun listRegelsett(): List<Regelsett> =
      runCatching {
            val testreglar = listTestreglar().filter { it.id <= 35 }
            listOf(Regelsett(1, "Standard regelsett", testreglar))
          }
          .getOrElse {
            logger.error("Kunne ikkje hente regelsett", it)
            throw Error("Kunne ikkje hente regelsett")
          }

  @PostMapping
  fun createTestregel(@RequestBody testregel: CreateTestregelDTO): List<Testregel> =
      try {
        logger.debug("Lagrer ny testregel med navn: ${testregel.kravTilSamsvar} fra $testregelUrl")
        restTemplate.postForEntity(testregelUrl, testregel, Int::class.java)
        listTestreglar()
      } catch (e: Error) {
        logger.error("Klarte ikke å lage testregel", e)
        throw Error("Klarte ikke å lage testregel")
      }

  @PutMapping
  fun updateTestregel(@RequestBody testregel: Testregel): List<Testregel> =
      try {
        logger.debug("Oppdaterer testregel id: ${testregel.id} fra $testregelUrl")
        restTemplate.put(testregelUrl, testregel, Testregel::class.java)
        listTestreglar()
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
}
