package no.uutilsynet.testlab2frontendserver.krav

import no.uutilsynet.testlab2frontendserver.krav.dto.Krav
import no.uutilsynet.testlab2frontendserver.krav.dto.KravApi
import org.slf4j.LoggerFactory
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestClientException
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.getForObject

@RestController
@RequestMapping("api/v1/krav", produces = [MediaType.APPLICATION_JSON_VALUE])
class KravResource(val restTemplate: RestTemplate, testingApiProperties: TestingApiProperties) : KravApi {

    val logger = LoggerFactory.getLogger(KravResource::class.java)

    @ConfigurationProperties(prefix = "krav.api") data class TestingApiProperties(val url: String)
    val baseUrl = testingApiProperties.url

    @GetMapping
    override fun listKrav(): ResponseEntity<Any> =
        try {
            logger.info("henter krav fra $baseUrl")
            val responseType = object : ParameterizedTypeReference<List<Krav>>() {}
            val testreglar: List<Krav> = restTemplate.getForObject("$baseUrl/v1/krav", responseType)
            ResponseEntity.ok(testreglar)
        } catch (e: RestClientException) {
            logger.error("klarte ikke å hente krav", e)
            ResponseEntity.internalServerError().body(e.message)
        }

}