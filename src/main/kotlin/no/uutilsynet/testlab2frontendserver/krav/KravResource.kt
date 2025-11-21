package no.uutilsynet.testlab2frontendserver.krav

import no.uutilsynet.testlab2frontendserver.krav.dto.Krav
import no.uutilsynet.testlab2frontendserver.krav.dto.KravApi
import no.uutilsynet.testlab2frontendserver.krav.dto.KravInit
import no.uutilsynet.testlab2frontendserver.krav.dto.KravListItem
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestClientException
import org.springframework.web.client.RestTemplate

@RestController
@RequestMapping("api/v1/krav", produces = [MediaType.APPLICATION_JSON_VALUE])
class KravResource(
    val restTemplate: RestTemplate,
    kravApiProperties: KravApiProperties,
    val kravApiClient: KravApiClient
) : KravApi {

  val logger: Logger = LoggerFactory.getLogger(KravResource::class.java)

  val kravUrl = "${kravApiProperties.url}/v1/krav"

  @GetMapping
  override fun listKrav(): List<KravListItem> =
      try {
        logger.info("Henter krav fra $kravUrl/wcag2krav")
        kravApiClient.listKrav().map { KravListItem(it) }
      } catch (e: RestClientException) {
        logger.error("Klarte ikke å hente krav", e)
        throw Error("Klarte ikke å hente krav")
      }

  @GetMapping("/{id}")
  override fun getKrav(@PathVariable id: Int): Krav {
    restTemplate.getForObject("$kravUrl/wcag2krav/$id", Krav::class.java)?.let {
      return it
    }
        ?: throw Error("Klarte ikke å hente krav med id $id")
  }

  @PutMapping("/{id}")
  override fun updateKrav(@PathVariable id: Int, @RequestBody krav: Krav): Krav {
    restTemplate.put("$kravUrl/wcag2krav/$id", krav)
    return krav
  }

  @PostMapping
  override fun createKrav(@RequestBody krav: KravInit): Int {
    logger.info("Oppretter krav $krav")

    return runCatching {
          restTemplate.postForObject("$kravUrl/wcag2krav", krav, Int::class.java)
              ?: throw RuntimeException("Klarte ikke å opprette krav")
        }
        .fold(
            onSuccess = { it },
            onFailure = { throw RuntimeException("Klarte ikke å opprette krav", it) })
  }

  @DeleteMapping("/{id}")
  override fun deleteKrav(@PathVariable id: Int): Boolean {
    restTemplate.delete("$kravUrl/wcag2krav/$id")
    return true
  }
}
