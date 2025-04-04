package no.uutilsynet.testlab2frontendserver.maalinger

import java.net.URI
import java.net.URL
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.maalinger.dto.Aggregeringstype
import no.uutilsynet.testlab2frontendserver.maalinger.dto.CrawlParameters
import no.uutilsynet.testlab2frontendserver.maalinger.dto.CrawlUrl
import no.uutilsynet.testlab2frontendserver.maalinger.dto.IdList
import no.uutilsynet.testlab2frontendserver.maalinger.dto.Maaling
import no.uutilsynet.testlab2frontendserver.maalinger.dto.MaalingDTO
import no.uutilsynet.testlab2frontendserver.maalinger.dto.MaalingEdit
import no.uutilsynet.testlab2frontendserver.maalinger.dto.MaalingStatus
import no.uutilsynet.testlab2frontendserver.maalinger.dto.RestartProcess
import no.uutilsynet.testlab2frontendserver.maalinger.dto.aggregation.AggregertResultatDTO
import no.uutilsynet.testlab2frontendserver.maalinger.dto.testresultat.TestResultat
import no.uutilsynet.testlab2frontendserver.maalinger.dto.toMaaling
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelBaseDTO
import org.slf4j.LoggerFactory
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
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
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestClientException
import org.springframework.web.client.RestClientResponseException
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
  val resultatUrl = "${testingApiProperties.url}/resultat"

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
  fun getMaaling(@PathVariable maalingId: Int): ResponseEntity<Maaling> {
    logger.debug("henter måling med id: $maalingId fra $maalingUrl")

    val maalingDTO = restTemplate.getForObject("${maalingUrl}/${maalingId}", MaalingDTO::class.java)

    if (maalingDTO == null) {
      logger.error("Kunne ikkje hente måling med id $maalingId frå server")
      throw RuntimeException("Klarte ikkje å hente måling")
    }

    val maaling =
        when (maalingDTO.status) {
          MaalingStatus.planlegging -> maalingDTO.toMaaling()
          else -> {
            val aggregatedTestresult =
                if (maalingDTO.status == MaalingStatus.testing_ferdig) {
                  getAggregering(maalingId, Aggregeringstype.testresultat)
                } else {
                  emptyList()
                }

            maalingDTO.toMaaling(getTestregelListForMaaling(maalingDTO.id), aggregatedTestresult)
          }
        }

    return ResponseEntity.ok(maaling)
  }

  @PostMapping
  fun createNew(@RequestBody requestBody: ByteArray): ResponseEntity<out Any> =
      runCatching {
            val headers = HttpHeaders()
            headers.contentType = MediaType.APPLICATION_JSON
            val entity = HttpEntity(requestBody, headers)
            val location =
                restTemplate.postForLocation(maalingUrl, entity, Int::class.java)
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
            logger.error("Kunne ikkje lage ny måling ${it.message} ${it.stackTrace}")
            if (it is RestClientResponseException) {
              logger.error(
                  "Rest error ${it.responseBodyAsString}   ${it.statusCode} ${it.statusCode}")
            }
            ResponseEntity.internalServerError()
                .body("noe gikk galt da jeg forsøkte å lage en ny måling: ${it.message}")
          }

  @GetMapping("crawlparameters/kontroll/{kontrollId}")
  fun getCrawlParametersKontrollMaaling(
      @PathVariable kontrollId: Int,
  ): ResponseEntity<CrawlParameters> {
    val maalingId =
        restTemplate.getForObject("${maalingUrl}/kontroll/${kontrollId}", Int::class.java)
    val maaling = restTemplate.getForObject("${maalingUrl}/${maalingId}", MaalingDTO::class.java)

    if (maaling == null) {
      logger.error("Finns ingen måling knytta til kontrollId $kontrollId")
      return ResponseEntity.badRequest().build()
    }

    return ResponseEntity.ok(maaling.crawlParameters)
  }

  @PutMapping("crawlparameters/kontroll/{kontrollId}")
  fun updateCrawlParametersKontrollMaaling(
      @PathVariable kontrollId: Int,
      @RequestBody crawlParameters: CrawlParameters
  ): ResponseEntity<out Any> =
      runCatching {
            val maalingId =
                restTemplate.getForObject("${maalingUrl}/kontroll/${kontrollId}", Int::class.java)
            val maaling =
                restTemplate.getForObject("${maalingUrl}/${maalingId}", MaalingDTO::class.java)
            if (maaling == null) {
              logger.error("Finns ingen måling knytta til kontrollId $kontrollId")
              return ResponseEntity.badRequest().build()
            }

            val maalingEdit =
                MaalingEdit(
                    id = maaling.id,
                    navn = maaling.navn,
                    testregelIdList = maaling.testregelList?.map { it.id } ?: emptyList(),
                    loeysingIdList = maaling.loeysingList?.map { it.id } ?: emptyList(),
                    crawlParameters = crawlParameters)

            updateMaaling(maalingEdit)
          }
          .getOrElse { ResponseEntity.internalServerError().build() }

  @PutMapping
  fun updateMaaling(@RequestBody maaling: MaalingEdit): ResponseEntity<out Any> =
      runCatching {
            restTemplate.put(maalingUrl, maaling, Int::class.java)
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
            logger.error(
                "Kunne ikkje slette målinger med id ${maalingIdList.idList.joinToString()}", it)
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
            logger.error("Kunne ikkje oppdatere status på måling $maalingId", it)
            ResponseEntity.internalServerError().body("Kunne ikkje oppdatere måling ${it.message}")
          }

  @GetMapping("{maalingId}/crawlresultat/nettsider")
  fun getCrawlResultatNettsider(
      @PathVariable maalingId: Int,
      @RequestParam(required = false) loeysingId: Int?
  ): List<CrawlUrl> =
      runCatching {
            restTemplate.getList<URL>(
                "$maalingUrl/$maalingId/crawlresultat/nettsider?loeysingId=$loeysingId")
          }
          .getOrElse {
            logger.error(
                "Kunne ikkje hente nett resultat for løysing med id $loeysingId og måling med id $maalingId",
                it)
            throw RuntimeException("Klarte ikkje å hente crawl resultat")
          }
          .map { CrawlUrl(it) }

  @GetMapping("{maalingId}/testresultat/aggregering")
  fun getAggregering(
      @PathVariable maalingId: Int,
      @RequestParam aggregeringstype: Aggregeringstype
  ): List<AggregertResultatDTO> {
    logger.debug("Henter aggregering for måling med id $maalingId")
    val url = "$maalingUrl/$maalingId/testresultat/aggregering?aggregeringstype=$aggregeringstype"
    val aggregatedType = object : ParameterizedTypeReference<List<AggregertResultatDTO>>() {}
    return runCatching {
          val map = restTemplate.exchange(url, HttpMethod.GET, null, aggregatedType).body
          map ?: throw RuntimeException("Response body for aggregering er tom")
        }
        .getOrElse {
          logger.error("Kunne ikkje hente aggregering for måling med id $maalingId", it)
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
            logger.error("Kunne ikkje starte $process(er) på nytt for måling $maalingId", it)
            ResponseEntity.internalServerError().body("Kunne ikkje starte $process(er) på nytt")
          }

  @GetMapping("{maalingId}/resultat")
  fun getTestResultatList(
      @PathVariable maalingId: Int,
      @RequestParam(required = false) loeysingId: Int?
  ): List<TestResultat> =
      runCatching {
            val url =
                if (loeysingId != null) "${resultatUrl}?maalingId=$maalingId&loeysingId=$loeysingId"
                else "${resultatUrl}?maalingId=$maalingId"
            restTemplate.getList<TestResultat>(url)
          }
          .getOrElse {
            logger.info(
                "Kunne ikkje hente testresultat for måling med id $maalingId og løysing med id $loeysingId")
            throw RuntimeException("Klarte ikkje å hente testresultat", it)
          }

  @GetMapping("kontroll/{kontrollId}")
  fun getMaalingIdFromKontrollId(@PathVariable kontrollId: Int): ResponseEntity<Int> =
      restTemplate.getForObject("${maalingUrl}/kontroll/${kontrollId}", Int::class.java)?.let {
        ResponseEntity.ok(it)
      }
          ?: ResponseEntity.badRequest().build()

  private fun getTestregelListForMaaling(maalingId: Int): List<TestregelBaseDTO> =
      runCatching {
            logger.debug("Henter testreglar for måling $maalingId")
            restTemplate.getList<TestregelBaseDTO>("$testregelUrl?maalingId=$maalingId")
          }
          .getOrElse {
            logger.error("Feila ved henting av testreglar for måling $maalingId", it)
            throw RuntimeException("Klarte ikkje å hente testreglar")
          }
}
