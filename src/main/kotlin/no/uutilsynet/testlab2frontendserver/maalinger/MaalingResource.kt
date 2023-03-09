package no.uutilsynet.testlab2frontendserver.maalinger

import java.net.URI
import java.net.URL
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.maalinger.dto.AzCrawlResponse
import no.uutilsynet.testlab2frontendserver.maalinger.dto.CrawlResultat
import no.uutilsynet.testlab2frontendserver.maalinger.dto.Loeysing
import no.uutilsynet.testlab2frontendserver.maalinger.dto.Maaling
import no.uutilsynet.testlab2frontendserver.maalinger.dto.MaalingDTO
import no.uutilsynet.testlab2frontendserver.maalinger.dto.MaalingInit
import no.uutilsynet.testlab2frontendserver.maalinger.dto.MaalingStatus
import no.uutilsynet.testlab2frontendserver.maalinger.dto.toCrawlResultat
import no.uutilsynet.testlab2frontendserver.maalinger.dto.toMaaling
import no.uutilsynet.testlab2frontendserver.maalinger.dto.toNyMaalingDTO
import org.slf4j.LoggerFactory
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.http.HttpEntity
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestClientException
import org.springframework.web.client.RestTemplate

@RestController
@RequestMapping("api/v1/maalinger")
class MaalingResource(
    val restTemplate: RestTemplate,
    val testingApiProperties: TestingApiProperties
) {
  val logger = LoggerFactory.getLogger(MaalingResource::class.java)

  @ConfigurationProperties(prefix = "testing.api") data class TestingApiProperties(val url: String)
  val maalingUrl = "${testingApiProperties.url}/v1/maalinger"

  @GetMapping
  fun list(): List<MaalingDTO> {
    return try {
      logger.info("henter målinger fra ${maalingUrl}")
      restTemplate.getList(maalingUrl)
    } catch (e: RestClientException) {
      logger.error("klarte ikke å hente målinger", e)
      throw Error("Klarte ikke å hente målinger")
    }
  }

  @GetMapping("{id}")
  fun getMaaling(@PathVariable id: Int): ResponseEntity<Maaling> {

    val maalingDTO =
        restTemplate.getForObject("${maalingUrl}/${id}", MaalingDTO::class.java)
            ?: throw RuntimeException("Klarte ikke å hente den måling fra server")

    // TODO - flytt til testing-app
    val maaling =
        if (maalingDTO.status === MaalingStatus.kvalitetssikring &&
            maalingDTO.crawlResultat != null) {
          val crawlResultat: List<CrawlResultat> =
              try {
                maalingDTO.crawlResultat.map {
                  val urlList: List<URL> =
                      it.statusUrl?.let { url ->
                        restTemplate
                            .getForObject(url.toString(), AzCrawlResponse::class.java)
                            ?.output
                      }
                          ?: emptyList()
                  it.toCrawlResultat(urlList)
                }
              } catch (e: Throwable) {
                logger.error(
                    "Måling ${maalingDTO.id} med status ${maalingDTO.status} har ingen output etter crawling")
                emptyList()
              }

          maalingDTO.toMaaling().copy(crawlResultat = crawlResultat)
        } else maalingDTO.toMaaling()
    // TODO - flytt til testing-app

    return ResponseEntity.ok(maaling)
  }

  @PostMapping
  fun createNew(@RequestBody dto: MaalingInit): ResponseEntity<out Any> =
      runCatching {
            val location =
                restTemplate.postForLocation(maalingUrl, dto.toNyMaalingDTO(), Int::class.java)
                    ?: throw RuntimeException(
                        "jeg fikk laget en ny måling, men jeg fikk ikke noen location fra serveren")
            val newMaaling =
                restTemplate.getForObject(
                    "${testingApiProperties.url}${location}", MaalingDTO::class.java)
                    ?: throw RuntimeException(
                        "jeg fikk laget en ny måling, men klarte ikke å hente den nye målingen fra serveren")
            ResponseEntity.created(URI("/maaling/${newMaaling.id}")).body(newMaaling)
          }
          .getOrElse {
            ResponseEntity.internalServerError()
                .body("noe gikk galt da jeg forsøkte å lage en ny måling: ${it.message}")
          }

  @PutMapping
  fun updateMaaling(@RequestBody maaling: MaalingDTO): ResponseEntity<out Any> =
      ResponseEntity.internalServerError().body("Endring av måling er ikke implementert")

  @PutMapping("{id}")
  fun updateStatus(@PathVariable id: Int, @RequestBody status: String): ResponseEntity<out Any> =
      runCatching {
            restTemplate.put(
                "${maalingUrl}/${id}/status",
                HttpEntity(mapOf("status" to MaalingStatus.valueOf(status))))
            getMaaling(id)
          }
          .getOrElse {
            ResponseEntity.internalServerError().body("Kunne ikke oppdatere måling ${it.message}")
          }

  @GetMapping("loeysingar")
  fun getLoesyingar(): List<Loeysing> =
      try {
        logger.info("Henter løsninger fra $testingApiProperties")
        restTemplate.getList("$maalingUrl/loeysingar")
      } catch (e: Error) {
        logger.error("klarte ikke å hente løsninger", e)
        throw Error("Klarte ikke å hente løsninger")
      }
}
