package no.uutilsynet.testlab2frontendserver.maalinger

import java.net.URI
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.maalinger.dto.CrawlParameters.Companion.validateParameters
import no.uutilsynet.testlab2frontendserver.maalinger.dto.Maaling
import no.uutilsynet.testlab2frontendserver.maalinger.dto.MaalingDTO
import no.uutilsynet.testlab2frontendserver.maalinger.dto.MaalingEdit
import no.uutilsynet.testlab2frontendserver.maalinger.dto.MaalingInit
import no.uutilsynet.testlab2frontendserver.maalinger.dto.MaalingStatus
import no.uutilsynet.testlab2frontendserver.maalinger.dto.StatusDTO
import no.uutilsynet.testlab2frontendserver.maalinger.dto.toMaaling
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
  fun listMaaling(): List<Maaling> {
    return try {
      logger.info("henter målinger fra ${maalingUrl}")
      restTemplate.getList<MaalingDTO>(maalingUrl).map { it.toMaaling() }
    } catch (e: RestClientException) {
      logger.error("klarte ikke å hente målinger", e)
      throw RuntimeException("Klarte ikke å hente målinger")
    }
  }

  @GetMapping("{id}")
  fun getMaaling(@PathVariable id: Int): ResponseEntity<Maaling> {

    val maalingDTO =
        restTemplate.getForObject("${maalingUrl}/${id}", MaalingDTO::class.java)
            ?: throw RuntimeException("Klarte ikke å hente den måling fra server")

    return ResponseEntity.ok(maalingDTO.toMaaling())
  }

  @PostMapping
  fun createNew(@RequestBody maaling: MaalingInit): ResponseEntity<out Any> =
      runCatching {
            val location =
                restTemplate.postForLocation(
                    maalingUrl,
                    maaling.copy(crawlParameters = maaling.crawlParameters.validateParameters()),
                    Int::class.java)
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
  fun updateMaaling(@RequestBody maaling: MaalingEdit): ResponseEntity<out Any> =
      runCatching {
            restTemplate.put(
                maalingUrl,
                maaling.copy(crawlParameters = maaling.crawlParameters?.validateParameters()),
                Int::class.java)
            getMaaling(maaling.id)
          }
          .getOrElse {
            ResponseEntity.internalServerError()
                .body("noe gikk galt da jeg forsøkte å endre en måling: ${it.message}")
          }

  @DeleteMapping("{id}")
  fun deleteMaalingList(@PathVariable id: Int): ResponseEntity<out Any> =
      runCatching {
            restTemplate.delete("$maalingUrl/$id")
            ResponseEntity.ok().body(listMaaling())
          }
          .getOrElse {
            ResponseEntity.internalServerError()
                .body("noe gikk galt da jeg forsøkte å slette en måling: ${it.message}")
          }

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

  @PutMapping("{id}/{loeysingId}")
  fun restartCrawlForMaalingLoeysing(
      @PathVariable id: Int,
      @PathVariable loeysingId: Int,
  ): ResponseEntity<out Any> =
      runCatching {
            restTemplate.put(
                "${maalingUrl}/${id}/status",
                StatusDTO(MaalingStatus.crawling.status, listOf(loeysingId)))
            getMaaling(id)
          }
          .getOrElse {
            ResponseEntity.internalServerError().body("Kunne ikke restarte måling ${it.message}")
          }
}
