package no.uutilsynet.testlab2frontendserver.testreglar

import no.uutilsynet.testlab2frontendserver.common.RestHelper.getArray
import no.uutilsynet.testlab2frontendserver.krav.dto.Krav
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Regelsett
import no.uutilsynet.testlab2frontendserver.testreglar.dto.RegelsettRequest
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testregel
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelDTO
import org.slf4j.LoggerFactory
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestTemplate

@RestController
@RequestMapping("api/v1/testreglar", produces = [MediaType.APPLICATION_JSON_VALUE])
class TestregelResource(
    val restTemplate: RestTemplate,
    val testregelService: TestregelService,
    testingApiProperties: TestingApiProperties,
    kravApiProperties: KravApiProperties
) : TestregelApi {
  val logger = LoggerFactory.getLogger(TestregelResource::class.java)

  @ConfigurationProperties(prefix = "testing.api") data class TestingApiProperties(val url: String)
  val testreglarUrl = "${testingApiProperties.url}/v1/testreglar"
  val regelsettUrl = "${testingApiProperties.url}/v1/testreglar/regelsett"

  @ConfigurationProperties(prefix = "krav.api") data class KravApiProperties(val url: String)
  val kravUrl = "${kravApiProperties.url}/v1/krav"

  @GetMapping
  override fun listTestreglar(): List<Testregel> =
      try {
        logger.info("Henter testreglar fra $testreglarUrl")
        val testregelDTOlist = restTemplate.getArray<Array<TestregelDTO>>(testreglarUrl).toList()
        val kravlist = restTemplate.getArray<Array<Krav>>(kravUrl).toList()

        testregelService.getTestregelList(testregelDTOlist, kravlist)
      } catch (e: Error) {
        logger.error("klarte ikke å hente testreglar", e)
        throw Error("Klarte ikke å hente testreglar")
      }

  @GetMapping("regelsett")
  override fun listRegelsett(): List<Regelsett> =
      try {
        logger.info("Henter regelsett fra $regelsettUrl")
        restTemplate.getArray<Array<Regelsett>>(regelsettUrl).toList()
      } catch (e: Error) {
        logger.error("klarte ikke å hente regelsett", e)
        throw Error("Klarte ikke å hente regelsett")
      }

  @PostMapping
  override fun createTestregel(@RequestBody testregel: TestregelDTO): List<Testregel> =
      try {
        logger.info("Lagrer nytt testregel navn: ${testregel.kravTilSamsvar} fra $testreglarUrl")
        restTemplate.postForEntity(testreglarUrl, testregel, Int::class.java)
        listTestreglar()
      } catch (e: Error) {
        logger.error("Klarte ikke å lage testregel", e)
        throw Error("Klarte ikke å lage testregel")
      }

  @PostMapping("regelsett")
  override fun createRegelsett(@RequestBody regelsettRequest: RegelsettRequest): List<Regelsett> =
      try {
        logger.info("Lagrer nytt regelsett navn: ${regelsettRequest.namn} fra $regelsettUrl")
        restTemplate.postForEntity(regelsettUrl, regelsettRequest, Int::class.java)
        listRegelsett()
      } catch (e: Error) {
        logger.error("Klarte ikke å lage regelsett", e)
        throw Error("Klarte ikke å lage regelsett")
      }

  @PutMapping
  override fun updateTestregel(@RequestBody testregel: TestregelDTO): List<Testregel> =
      try {
        logger.info("Oppdaterer testregel id: ${testregel.id} fra $testreglarUrl")
        restTemplate.put(testreglarUrl, testregel, Testregel::class.java)
        listTestreglar()
      } catch (e: Error) {
        logger.error("Klarte ikke å oppdatere testregel", e)
        throw Error("Klarte ikke å oppdatere testregel")
      }

  @PutMapping("regelsett")
  override fun updateRegelsett(@RequestBody regelsett: Regelsett): List<Regelsett> =
      try {
        logger.info("Oppdaterer regelsett id: ${regelsett.id} fra $regelsettUrl")
        restTemplate.put(regelsettUrl, regelsett, Regelsett::class.java)
        listRegelsett()
      } catch (e: Error) {
        logger.error("Klarte ikke å oppdatere regelsett", e)
        throw Error("Klarte ikke å oppdatere regelsett")
      }

  @DeleteMapping("{id}")
  override fun deleteTestregel(@PathVariable id: Int): List<Testregel> =
      try {
        logger.info("Sletter testregel id: $id fra $testreglarUrl")
        restTemplate.delete("$testreglarUrl/$id")
        listTestreglar()
      } catch (e: Error) {
        logger.error("Klarte ikke å slette testregel", e)
        throw Error("Klarte ikke å slette testregel")
      }

  @DeleteMapping("regelsett/{id}")
  override fun deleteRegelsett(@PathVariable id: Int): List<Regelsett> =
      try {
        logger.info("Sletter regelsett id: $id fra $regelsettUrl")
        restTemplate.delete("$regelsettUrl/$id")
        listRegelsett()
      } catch (e: Error) {
        logger.error("Klarte ikke å slette regelsett", e)
        throw Error("Klarte ikke å slette regelsett")
      }
}
