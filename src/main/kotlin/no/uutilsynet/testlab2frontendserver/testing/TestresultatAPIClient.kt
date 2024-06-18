package no.uutilsynet.testlab2frontendserver.testing

import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.testing.TestResource.TestresultatForKontroll
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.getForObject

interface ITestresultatAPIClient {
  fun createTestResultat(createTestResultat: CreateTestResultat): Result<ResultatManuellKontroll>

  fun getResultatForTestgrunnlag(testgrunnlagId: Int): Result<List<ResultatManuellKontroll>>
}

@Component
class TestresultatAPIClient(
    val restTemplate: RestTemplate,
    testingApiProperties: TestingApiProperties
) : ITestresultatAPIClient {
  private val testresultUrl = "${testingApiProperties.url}/testresultat"

  override fun createTestResultat(
      createTestResultat: CreateTestResultat
  ): Result<ResultatManuellKontroll> = runCatching {
    val location =
        restTemplate.postForLocation(testresultUrl, createTestResultat)
            ?: throw IllegalStateException("Vi fikk ikkje location fra $testresultUrl")
    restTemplate.getForObject(location)
  }

  override fun getResultatForTestgrunnlag(
      testgrunnlagId: Int
  ): Result<List<ResultatManuellKontroll>> = runCatching {
    val testResults: TestresultatForKontroll? =
        restTemplate.getForObject(
            "$testresultUrl?testgrunnlagId=$testgrunnlagId", TestresultatForKontroll::class.java)
    if (testResults != null) {
      return Result.success(testResults.resultat)
    } else {
      throw RuntimeException(
          "Vi klarte ikkje å hente testresultat for testgrunnlag $testgrunnlagId")
    }
  }
}
