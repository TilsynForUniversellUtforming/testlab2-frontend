package no.uutilsynet.testlab2frontendserver.maalinger

import java.net.URI
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.maalinger.dto.CrawlParameters.Companion.validateParameters
import no.uutilsynet.testlab2frontendserver.maalinger.dto.CrawlResultat
import no.uutilsynet.testlab2frontendserver.maalinger.dto.CrawlResultatDTO
import no.uutilsynet.testlab2frontendserver.maalinger.dto.IdList
import no.uutilsynet.testlab2frontendserver.maalinger.dto.Maaling
import no.uutilsynet.testlab2frontendserver.maalinger.dto.MaalingDTO
import no.uutilsynet.testlab2frontendserver.maalinger.dto.MaalingEdit
import no.uutilsynet.testlab2frontendserver.maalinger.dto.MaalingInit
import no.uutilsynet.testlab2frontendserver.maalinger.dto.MaalingStatus
import no.uutilsynet.testlab2frontendserver.maalinger.dto.RestartProcess
import no.uutilsynet.testlab2frontendserver.maalinger.dto.toCrawlResultat
import no.uutilsynet.testlab2frontendserver.maalinger.dto.toMaaling
import no.uutilsynet.testlab2frontendserver.testing.dto.aggregation.AggregertResultatDTO
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testregel
import org.slf4j.LoggerFactory
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

  val maalingUrl = "${testingApiProperties.url}/v1/maalinger"
  val testregelUrl = "${testingApiProperties.url}/v1/testreglar"

  @GetMapping
  fun listMaaling(): List<Maaling> {
    return try {
      logger.debug("henter målingar fra $maalingUrl")
      restTemplate.getList<MaalingDTO>(maalingUrl).map { it.toMaaling() }
    } catch (e: RestClientException) {
      logger.error("klarte ikke å hente målingar", e)
      throw RuntimeException("Klarte ikkje å hente målingar")
    }
  }

  @GetMapping("{maalingId}")
  fun getMaaling(
      @PathVariable maalingId: Int,
      @RequestParam(required = false) aggregated: Boolean? = false
  ): ResponseEntity<Maaling> {
    logger.debug("henter måling med id: $maalingId fra $maalingUrl")

    val maalingDTO = restTemplate.getForObject("${maalingUrl}/${maalingId}", MaalingDTO::class.java)

    if (maalingDTO == null) {
      logger.error("Kunne ikkje hente måling med id $maalingId frå server")
      throw RuntimeException("Klarte ikke å hente den måling fra server")
    }

    val maaling =
        when (maalingDTO.status) {
          MaalingStatus.planlegging -> maalingDTO.toMaaling()
          else -> {
            val crawlResultat = getCrawlResultatList(maalingDTO.id)

            val aggregatedTestresult =
                if (aggregated != null) {

                  when (maalingDTO.status) {
                    MaalingStatus.testing,
                    MaalingStatus.testing_ferdig -> {
                      getAggregering(maalingDTO.id)
                    }
                    else -> emptyList()
                  }
                } else {
                  emptyList()
                }

            maalingDTO.toMaaling(
                crawlResultat, getTestregelListForMaaling(maalingDTO.id), aggregatedTestresult)
          }
        }

    return ResponseEntity.ok(maaling)
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

  @DeleteMapping
  fun deleteMaalingList(@RequestBody maalingIdList: IdList): ResponseEntity<out Any> =
      runCatching {
            for (id in maalingIdList.idList) {
              logger.info("Slettar måling med id $id")
              restTemplate.delete("$maalingUrl/$id")
            }
            ResponseEntity.ok().body(listMaaling())
          }
          .getOrElse {
            ResponseEntity.internalServerError()
                .body("noe gikk galt da jeg forsøkte å slette en måling: ${it.message}")
          }

  @PutMapping("{maalingId}")
  fun updateStatus(
      @PathVariable maalingId: Int,
      @RequestBody status: String
  ): ResponseEntity<out Any> =
      runCatching {
            restTemplate.put(
                "${maalingUrl}/${maalingId}/status",
                HttpEntity(mapOf("status" to MaalingStatus.valueOf(status))))
            getMaaling(maalingId)
          }
          .getOrElse {
            ResponseEntity.internalServerError().body("Kunne ikkje oppdatere måling ${it.message}")
          }

  @GetMapping("{maalingId}/crawlresultat")
  fun getCrawlResultatList(
      @PathVariable id: Int,
  ): List<CrawlResultat> =
      runCatching {
            restTemplate.getList<CrawlResultatDTO>("$maalingUrl/$id/crawlresultat").map {
              it.toCrawlResultat()
            }
          }
          .getOrElse {
            logger.error("Kunne ikkje hente crawl resultat for måling med id $id")
            throw RuntimeException("Klarte ikkje å hente crawl resultat")
          }

  @GetMapping("{maalingId}/testresultat/aggregering")
  fun getAggregering(
      @PathVariable maalingId: Int,
  ): List<AggregertResultatDTO> {
    logger.debug("Henter aggregering for måling med id $maalingId")
    val url = "$maalingUrl/$maalingId/testresultat/aggregering"
    return runCatching { restTemplate.getList<AggregertResultatDTO>(url) }
        .getOrElse {
          logger.error("Kunne ikkje hente aggregering for måling med id $maalingId")
          throw RuntimeException("Klarte ikkje å hente aggregering", it)
        }
  }

  @PutMapping("{maalingId}/restart")
  fun restartCrawlForMaalingLoeysing(
      @PathVariable maalingId: Int,
      @RequestParam process: RestartProcess,
      @RequestBody loeysingIdList: IdList,
  ): ResponseEntity<out Any> =
      runCatching {
            val status =
                if (process == RestartProcess.crawling) MaalingStatus.crawling.status
                else MaalingStatus.testing.status

            restTemplate.put(
                "${maalingUrl}/${maalingId}/status",
                HttpEntity(mapOf("status" to status, "loeysingIdList" to loeysingIdList.idList)))
            getMaaling(maalingId)
          }
          .getOrElse {
            ResponseEntity.internalServerError().body("Kunne ikkje starte $process(er) på nytt")
          }

  private fun getTestregelListForMaaling(maalingId: Int): List<Testregel> =
      runCatching {
            logger.debug("Henter testreglar for måling $maalingId")
            restTemplate.getList<Testregel>("$testregelUrl?maalingId=$maalingId")
          }
          .getOrElse {
            logger.error("Feila ved henting av testreglar for måling $maalingId", it)
            throw RuntimeException("Klarte ikkje å hente testreglar")
          }
}
