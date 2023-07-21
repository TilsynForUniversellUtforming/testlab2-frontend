package no.uutilsynet.testlab2frontendserver.testing

import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.testing.dto.testresultat.TestResultat
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestTemplate

@RestController
@RequestMapping("api/v1/testing")
class TestResource(val restTemplate: RestTemplate, testingApiProperties: TestingApiProperties) {
  val logger: Logger = LoggerFactory.getLogger(TestResource::class.java)

  val maalingUrl = "${testingApiProperties.url}/v1/maalinger"

  @GetMapping("{id}/resultat")
  fun getTestResultatList(
      @PathVariable id: Int,
      @RequestParam(required = false) loeysingId: Int?
  ): List<TestResultat> =
      runCatching {
            val url =
                if (loeysingId != null) "$maalingUrl/$id/testresultat?loeysingId=$loeysingId"
                else "$maalingUrl/$id/testresultat"
            restTemplate.getList<TestResultat>(url)
          }
          .getOrElse {
            logger.info(
                "Kunne ikkje hente testresultat for måling med id $id og løysing med id $loeysingId")
            throw RuntimeException("Klarte ikkje å hente testresultat", it)
          }
}
