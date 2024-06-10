package no.uutilsynet.testlab2frontendserver.testing

import java.net.URI
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.testing.TestResource.TestresultatForKontroll
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate

interface ITestresultatAPIClient {
  fun createTestResultat(createTestResultat: CreateTestResultat): Result<URI>

  fun getResultatForTestgrunnlag(testgrunnlagId: Int): Result<List<ResultatManuellKontroll>>
}

@Component
class TestresultatAPIClient(
    val restTemplate: RestTemplate,
    testingApiProperties: TestingApiProperties
) : ITestresultatAPIClient {
  private val testresultUrl = "${testingApiProperties.url}/testresultat"

  override fun createTestResultat(createTestResultat: CreateTestResultat): Result<URI> =
      runCatching {
        restTemplate.postForLocation(testresultUrl, createTestResultat)
            ?: throw IllegalStateException("Vi fikk ikkje location fra $testresultUrl")
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
