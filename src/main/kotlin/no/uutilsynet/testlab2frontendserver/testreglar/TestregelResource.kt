package no.uutilsynet.testlab2frontendserver.testreglar

import no.uutilsynet.testlab2frontendserver.testreglar.dto.Regelsett
import no.uutilsynet.testlab2frontendserver.testreglar.dto.RegelsettRequest
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testregel
import org.slf4j.LoggerFactory
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestClientException
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.exchange
import org.springframework.web.client.getForObject
import org.springframework.web.client.postForObject


@RestController
@RequestMapping("api/v1/testreglar", produces = [MediaType.APPLICATION_JSON_VALUE])
class TestregelResource(val restTemplate: RestTemplate, val testingApiProperties: TestingApiProperties): TestregelApi {
  val logger = LoggerFactory.getLogger(TestregelResource::class.java)

  @ConfigurationProperties(prefix = "testing.api") data class TestingApiProperties(val url: String)
  val testreglarUrl = "${testingApiProperties.url}/v1/testreglar"
  val regelsettUrl = "${testingApiProperties.url}/v1/testreglar/regelsett"

  @GetMapping
  override fun listTestreglar(): ResponseEntity<Any> =
    try {
      logger.info("Henter testreglar fra $testreglarUrl")
      val responseType = object : ParameterizedTypeReference<List<Testregel>>() {}
      val testreglar: List<Testregel> = restTemplate.getForObject(testreglarUrl, responseType)
      ResponseEntity.ok(testreglar)
    } catch (e: RestClientException) {
      logger.error("klarte ikke å hente testreglar", e)
      ResponseEntity.internalServerError().body(e.message)
    }

  @GetMapping("regelsett")
  override fun listRegelsett(): ResponseEntity<Any> =
    try {
      logger.info("Henter regelsett fra $regelsettUrl")
      val responseType = object : ParameterizedTypeReference<List<Regelsett>>() {}
      val regelsett: List<Regelsett> = restTemplate.getForObject(regelsettUrl, responseType)
      ResponseEntity.ok(regelsett)
    } catch (e: RestClientException) {
      logger.error("klarte ikke å hente regelsett", e)
      ResponseEntity.internalServerError().body(e.message)
    }

  @PostMapping
  override fun createTestregel(@RequestBody testregel: Testregel): ResponseEntity<Any> =
    try {
      logger.info("Lagrer nytt regelsett navn: ${testregel.kravTilSamsvar} fra $regelsettUrl")
      val responseType = object : ParameterizedTypeReference<List<Testregel>>() {}
      val testregelList: List<Testregel> = restTemplate.postForObject(testreglarUrl, testregel, responseType)
      ResponseEntity.ok(testregelList)
    } catch (e: RestClientException) {
      logger.error("klarte ikke å hente regelsett", e)
      ResponseEntity.internalServerError().body(e.message)
    }

  @PostMapping("regelsett")
  override fun createRegelsett(@RequestBody regelsettRequest: RegelsettRequest): ResponseEntity<Any> =
    try {
      logger.info("Lagrer nytt regelsett navn: ${regelsettRequest.namn} fra $regelsettUrl")
      val responseType = object : ParameterizedTypeReference<List<Regelsett>>() {}
      restTemplate.postForObject(regelsettUrl, regelsettRequest, Int::class.java)
      val regelsett: List<Regelsett> = restTemplate.getForObject(regelsettUrl, responseType)
      ResponseEntity.ok(regelsett)
    } catch (e: RestClientException) {
      logger.error("klarte ikke å lage regelsett", e)
      ResponseEntity.internalServerError().body(e.message)
    }

  @PutMapping
  override fun updateTestregel(@RequestBody testregel: Testregel): ResponseEntity<Any> =
    try {
      logger.info("Oppdaterer testregel id: ${testregel.id} fra $testreglarUrl")
      val responseType = object : ParameterizedTypeReference<List<Testregel>>() {}
      restTemplate.put(testreglarUrl, testregel, Testregel::class.java)
      val updatedTestreglar: List<Testregel> = restTemplate.getForObject(testreglarUrl, responseType)
      ResponseEntity.ok(updatedTestreglar)
    } catch (e: RestClientException) {
      logger.error("klarte ikke å oppdatere testregel", e)
      ResponseEntity.internalServerError().body(e.message)
    }

  @PutMapping("regelsett")
  override fun updateRegelsett(@RequestBody regelsett: Regelsett): ResponseEntity<Any> =
    try {
      logger.info("Oppdaterer regelsett id: ${regelsett.id} fra $regelsettUrl")
      val responseType = object : ParameterizedTypeReference<List<Regelsett>>() {}
      restTemplate.put(regelsettUrl, regelsett, Testregel::class.java)
      val updatedRegelsett: List<Regelsett> = restTemplate.getForObject(regelsettUrl, responseType)
      ResponseEntity.ok(updatedRegelsett)
    } catch (e: RestClientException) {
      logger.error("klarte ikke å oppdatere regelsett", e)
      ResponseEntity.internalServerError().body(e.message)
    }

  @DeleteMapping("{id}")
  override fun deleteTestregel(@PathVariable id: Int): ResponseEntity<Any> =
    try {
      logger.info("Sletter testregel id: $id fra $testreglarUrl")
      val responseType = object : ParameterizedTypeReference<List<Testregel>>() {}
      restTemplate.delete("$testreglarUrl/$id")
      val testreglar: List<Testregel> = restTemplate.getForObject(testreglarUrl, responseType)
      ResponseEntity.ok(testreglar)
    } catch (e: RestClientException) {
      logger.error("klarte ikke å slette testregel", e)
      ResponseEntity.internalServerError().body(e.message)
    }

  @DeleteMapping("regelsett/{id}")
  override fun deleteRegelsett(@PathVariable id: Int): ResponseEntity<Any> =
    try {
      logger.info("Sletter regelsett id: $id fra $regelsettUrl")
      val responseType = object : ParameterizedTypeReference<List<Regelsett>>() {}
      restTemplate.delete("$regelsettUrl/$id")
      val regelsett: List<Regelsett> = restTemplate.getForObject(regelsettUrl, responseType)
      ResponseEntity.ok(regelsett)
    } catch (e: RestClientException) {
      logger.error("klarte ikke å slette regelsett", e)
      ResponseEntity.internalServerError().body(e.message)
    }
}