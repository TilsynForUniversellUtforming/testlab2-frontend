package no.uutilsynet.testlab2frontendserver.resultat

import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.maalinger.dto.aggregation.AggegatedTestresultTestregel
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestTemplate

@RestController
@RequestMapping("api/v1/testresulat")
class ResultatResource(
    val restTemplate: RestTemplate,
    val testingApiProperties: TestingApiProperties
) {

  val logger = LoggerFactory.getLogger(ResultatResource::class.java)

  val testresultatUrl = "${testingApiProperties.url}/testresultat"

  @GetMapping("aggregertt/{testgrunnlagId}")
  fun getTestresultatAggregert(testgrunnlagId: Int): List<AggegatedTestresultTestregel> {
    logger.debug("henter aggregering frå sak/maaling med id: $testgrunnlagId")
    return restTemplate.getList<AggegatedTestresultTestregel>(
        "$testresultatUrl/aggregert/$testgrunnlagId")
  }
}
