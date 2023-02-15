package no.uutilsynet.testlab2frontendserver.krav

import no.uutilsynet.testlab2frontendserver.common.RestHelper.getArray
import no.uutilsynet.testlab2frontendserver.krav.dto.Krav
import no.uutilsynet.testlab2frontendserver.krav.dto.KravApi
import org.slf4j.LoggerFactory
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestClientException
import org.springframework.web.client.RestTemplate

@RestController
@RequestMapping("api/v1/krav", produces = [MediaType.APPLICATION_JSON_VALUE])
class KravResource(val restTemplate: RestTemplate, kravApiProperties: KravApiProperties) : KravApi {

  val logger = LoggerFactory.getLogger(KravResource::class.java)

  @ConfigurationProperties(prefix = "krav.api") data class KravApiProperties(val url: String)
  val kravUrl = "${kravApiProperties.url}/v1/krav"

  @GetMapping
  override fun listKrav(): List<Krav> =
      try {
        logger.info("Henter krav fra $kravUrl")
        restTemplate.getArray<Array<Krav>>(kravUrl).toList()
      } catch (e: RestClientException) {
        logger.error("Klarte ikke å hente krav", e)
        throw Error("Klarte ikke å hente krav")
      }
}
