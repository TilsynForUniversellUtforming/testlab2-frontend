package no.uutilsynet.testlab2frontendserver.resultat

import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.maalinger.dto.aggregation.AggegatedTestresultTestregel
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestTemplate

@RestController
@RequestMapping("api/v1/testresultat")
class ResultatResource(
    val restTemplate: RestTemplate,
    val testingApiProperties: TestingApiProperties
) {

  val logger = LoggerFactory.getLogger(ResultatResource::class.java)

  val testresultatUrl = "${testingApiProperties.url}/testresultat"

  @GetMapping("aggregert/{testgrunnlagId}")
  fun getTestresultatAggregert(@PathVariable testgrunnlagId: Int): List<AggegatedTestresultTestregel> {
    logger.debug("henter aggregering frå sak/maaling med id: $testgrunnlagId")
    return restTemplate.getList<AggegatedTestresultTestregel>(
        "$testresultatUrl/aggregert/$testgrunnlagId")
  }
}
