package no.uutilsynet.testlab2frontendserver.krav

import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.krav.dto.Krav
import no.uutilsynet.testlab2frontendserver.krav.dto.KravApi
import org.slf4j.LoggerFactory
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestClientException
import org.springframework.web.client.RestTemplate

@RestController
@RequestMapping("api/v1/krav", produces = [MediaType.APPLICATION_JSON_VALUE])
class KravResource(val restTemplate: RestTemplate, kravApiProperties: KravApiProperties) : KravApi {

  val logger = LoggerFactory.getLogger(KravResource::class.java)

  val kravUrl = "${kravApiProperties.url}/v1/krav"

  @GetMapping
  override fun listKrav(): List<Krav> =
      try {
        logger.info("Henter krav fra $kravUrl/wcag2krav")
        restTemplate.getList("$kravUrl/wcag2krav")
      } catch (e: RestClientException) {
        logger.error("Klarte ikke å hente krav", e)
        throw Error("Klarte ikke å hente krav")
      }

  @GetMapping("/{id}")
  override fun getKrav(@PathVariable id: Int): Krav {
    println("Henter krav med id $id")
    restTemplate.getForObject("$kravUrl/wcag2krav/$id", Krav::class.java)?.let {
      return it
    }
        ?: throw Error("Klarte ikke å hente krav med id $id")
  }
}
