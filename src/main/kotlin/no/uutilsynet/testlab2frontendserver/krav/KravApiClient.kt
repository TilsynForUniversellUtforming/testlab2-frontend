package no.uutilsynet.testlab2frontendserver.krav

import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.krav.dto.Krav
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate

@Component
class KravApiClient(val restTemplate: RestTemplate, val kravApiProperties: KravApiProperties) {

  private val logger = org.slf4j.LoggerFactory.getLogger(KravApiClient::class.java)

  val kravUrl = "${kravApiProperties.url}/v1/krav"

  fun listKrav(): List<Krav> {
    logger.debug("Henter kravliste fra $kravUrl/wcag2krav")
    return restTemplate.getList<Krav>("$kravUrl/wcag2krav")
  }

  fun getKrav(id: Int): Krav {
    logger.debug("Henter krav med id $id fra $kravUrl/wcag2krav")
    return restTemplate.getForObject("$kravUrl/wcag2krav/$id", Krav::class.java)
        ?: throw RuntimeException("Klarte ikke å hente krav med id $id")
  }
}
