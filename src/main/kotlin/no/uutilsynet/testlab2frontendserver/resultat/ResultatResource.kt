package no.uutilsynet.testlab2frontendserver.resultat

import java.net.URI
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.maalinger.dto.aggregation.AggegatedTestresultTestregel
import no.uutilsynet.testlab2frontendserver.maalinger.dto.testresultat.TestResultat
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestTemplate

@RestController
@RequestMapping("api/v1/testresultat")
class ResultatResource(
    val restTemplate: RestTemplate,
    val testingApiProperties: TestingApiProperties
) {

  val logger = LoggerFactory.getLogger(ResultatResource::class.java)

  val testresultatUrl = "${testingApiProperties.url}/resultat"

  @GetMapping("aggregert/{testgrunnlagId}")
  fun getTestresultatAggregert(
      @PathVariable testgrunnlagId: Int
  ): List<AggegatedTestresultTestregel> {
    logger.debug("henter aggregering frå sak/maaling med id: $testgrunnlagId")
    return restTemplate
        .getList<AggegatedTestresultTestregel>("$testresultatUrl/aggregert/$testgrunnlagId")
        .map {
          it.copy(compliancePercent = toPercentage(it.testregelGjennomsnittlegSideSamsvarProsent))
        }
  }

  fun toPercentage(value: Float?): Int {
    return value?.times(100)?.toInt() ?: 0
  }

  @PostMapping("aggregert/{testgrunnlagId}")
  fun createTestresultatAggregert(@PathVariable testgrunnlagId: Int): ResponseEntity<Any> {
    logger.debug("genererar aggregering frå sak/maaling med id: $testgrunnlagId")
    return runCatching {
          val location =
              restTemplate.postForLocation(
                  "$testresultatUrl/aggregert/$testgrunnlagId", testgrunnlagId)
                  ?: throw RuntimeException(
                      "Feil ved oppretting av aggregert resultat for testgrunnlagId: $testgrunnlagId")
          return ResponseEntity.created(
                  URI.create("/api/v1/testresultat/aggregert/${testgrunnlagId}"))
              .body(location)
        }
        .getOrElse {
          logger.error(it.message)
          ResponseEntity.internalServerError().body(it.message)
        }
  }

  @GetMapping("resultat")
  fun getDetaljertResultat(
      @RequestParam sakId: Int?,
      @RequestParam maalingId: Int?,
      @RequestParam testregelNoekkel: String?
  ): List<TestResultat> {
    logger.debug("Hent resultat for sakId: $sakId, maalingId: $maalingId")
    return when {
      sakId != null ->
          restTemplate.getList<TestResultat>(
              "$testresultatUrl?testgrunnlagId=$sakId&testregelNoekkel=$testregelNoekkel")
      maalingId != null ->
          restTemplate.getList<TestResultat>("$testresultatUrl?maalingId=$maalingId")
      else -> return emptyList()
    }
  }
}
