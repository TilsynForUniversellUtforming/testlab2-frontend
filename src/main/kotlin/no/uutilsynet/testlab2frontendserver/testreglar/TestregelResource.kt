package no.uutilsynet.testlab2frontendserver.testreglar

import no.uutilsynet.testlab2frontendserver.testreglar.dto.Regelsett
import no.uutilsynet.testlab2frontendserver.testreglar.dto.RegelsettRequest
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testregel
import org.slf4j.LoggerFactory
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestClientException
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.getForObject
import org.springframework.web.client.postForObject


@RestController
@RequestMapping("api/v1/testreglar", produces = [MediaType.APPLICATION_JSON_VALUE])
class TestregelResource(val restTemplate: RestTemplate, val testingApiProperties: TestingApiProperties): TestregelApi {
    val logger = LoggerFactory.getLogger(TestregelResource::class.java)

    @ConfigurationProperties(prefix = "testing.api") data class TestingApiProperties(val url: String)
    val baseUrl = testingApiProperties.url

    @GetMapping
    override fun listTestreglar(): ResponseEntity<Any> =
        try {
            val responseType = object : ParameterizedTypeReference<List<Testregel>>() {}
            logger.info("henter testreglar fra $baseUrl")
            val testreglar: List<Testregel> = restTemplate.getForObject("$baseUrl/v1/testreglar", responseType)
            ResponseEntity.ok(testreglar)
        } catch (e: RestClientException) {
            logger.error("klarte ikke å hente testreglar", e)
            ResponseEntity.internalServerError().body(e.message)
        }

    @GetMapping("regelsett")
    override fun listRegelsett(): ResponseEntity<Any> =
        try {
            val responseType = object : ParameterizedTypeReference<List<Regelsett>>() {}
            logger.info("henter regelsett fra $baseUrl")
            val regelsett: List<Regelsett> = restTemplate.getForObject("$baseUrl/v1/testreglar/regelsett", responseType)
            ResponseEntity.ok(regelsett)
        } catch (e: RestClientException) {
            logger.error("klarte ikke å hente regelsett", e)
            ResponseEntity.internalServerError().body(e.message)
        }

    override fun createTestregel(testregel: Testregel): ResponseEntity<Any> {
        TODO("Not yet implemented")
    }

    @PostMapping("regelsett")
    override fun createRegelsett(@RequestBody regelsettRequest: RegelsettRequest): ResponseEntity<Any> =
        try {
            val responseType = object : ParameterizedTypeReference<List<Regelsett>>() {}
            val regelsett: List<Regelsett> = restTemplate.postForObject("${testingApiProperties.url}/v1/testreglar/regelsett", regelsettRequest, responseType)
            ResponseEntity.ok(regelsett)
        } catch (e: RestClientException) {
            logger.error("klarte ikke å hente regelsett", e)
            ResponseEntity.internalServerError().body(e.message)
        }

    override fun updateTestregel(testregel: Testregel): ResponseEntity<Any> {
        TODO("Not yet implemented")
    }

    override fun updateRegelsett(regelsett: Regelsett): ResponseEntity<Any> {
        TODO("Not yet implemented")
    }

    @DeleteMapping("{id}")
    override fun deleteTestregel(@PathVariable id: Int): ResponseEntity<Any> =
        try {
            val responseType = object : ParameterizedTypeReference<List<Testregel>>() {}
            logger.info("Sletter testregel $id fra $baseUrl")
            restTemplate.delete("$baseUrl/v1/testreglar/$id")
            val testreglar: List<Testregel> = restTemplate.getForObject("$baseUrl/v1/testreglar", responseType)
            ResponseEntity.ok(testreglar)
        } catch (e: RestClientException) {
            logger.error("klarte ikke å slette testregel", e)
            ResponseEntity.internalServerError().body(e.message)
        }

    @DeleteMapping("regelsett/{id}")
    override fun deleteRegelsett(@PathVariable id: Int): ResponseEntity<Any> =
        try {
            val responseType = object : ParameterizedTypeReference<List<Regelsett>>() {}
            logger.info("Sletter regelsett $id fra $baseUrl")
            restTemplate.delete("$baseUrl/v1/testreglar/regelsett/$id")
            val regelsett: List<Regelsett> = restTemplate.getForObject("$baseUrl/v1/testreglar/regelsett", responseType)
            ResponseEntity.ok(regelsett)
        } catch (e: RestClientException) {
            logger.error("klarte ikke å slette regelsett", e)
            ResponseEntity.internalServerError().body(e.message)
        }
}