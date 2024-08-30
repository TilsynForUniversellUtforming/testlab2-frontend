package no.uutilsynet.testlab2frontendserver.kontroll

import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.resultat.TestgrunnlagType
import no.uutilsynet.testlab2frontendserver.testing.Retest
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate

interface ITestgrunnlagAPIClient {
  fun createTestgrunnlag(
      nyttTestgrunnlag: TestgrunnlagAPIClient.NyttTestgrunnlag
  ): Result<KontrollResource.TestgrunnlagDTO>

  fun createRetest(retest: Retest): Result<KontrollResource.TestgrunnlagDTO>

  fun getTestgrunnlag(kontrollId: Int): Result<List<KontrollResource.TestgrunnlagDTO>>

  fun deleteTestgrunnlag(testgrunnlagId: Int): Result<Unit>
}

@Component
class TestgrunnlagAPIClient(
    val restTemplate: RestTemplate,
    val testingApiProperties: TestingApiProperties
) : ITestgrunnlagAPIClient {
  private val logger: Logger = LoggerFactory.getLogger(this::class.java)

  override fun createTestgrunnlag(
      nyttTestgrunnlag: NyttTestgrunnlag
  ): Result<KontrollResource.TestgrunnlagDTO> {
    logger.info(
        "Lagar nytt testgrunnlag med type ${nyttTestgrunnlag.type} for kontroll ${nyttTestgrunnlag.kontrollId}")
    return runCatching {
      val location =
          restTemplate.postForLocation(
              "${testingApiProperties.url}/testgrunnlag/kontroll", nyttTestgrunnlag)
              ?: throw IllegalStateException(
                  "Vi fikk ikkje location for det nye testgrunnlaget fra serveren")
      restTemplate.getForObject(location, KontrollResource.TestgrunnlagDTO::class.java)
          ?: throw IllegalStateException(
              "Vi forsøkte å hente det nye testgrunnlaget, men det finst ikkje.")
    }
  }

  override fun createRetest(retest: Retest): Result<KontrollResource.TestgrunnlagDTO> =
      runCatching {
        val location =
            restTemplate.postForLocation(
                "${testingApiProperties.url}/testgrunnlag/kontroll/retest", retest)
                ?: throw IllegalStateException("Vi fikk ikkje location fra $testingApiProperties")
        restTemplate.getForObject(location, KontrollResource.TestgrunnlagDTO::class.java)
            ?: throw IllegalStateException(
                "Vi forsøkte å hente det nye testgrunnlaget, men det finst ikkje.")
      }

  override fun getTestgrunnlag(kontrollId: Int): Result<List<KontrollResource.TestgrunnlagDTO>> {
    logger.info("Hentar testgrunnlag for kontroll $kontrollId")
    return runCatching {
      restTemplate.getList<KontrollResource.TestgrunnlagDTO>(
          "${testingApiProperties.url}/testgrunnlag/kontroll/list/$kontrollId")
    }
  }

  override fun deleteTestgrunnlag(testgrunnlagId: Int): Result<Unit> {
    logger.info("Sletter testgrunnlag med id $testgrunnlagId")
    return runCatching {
      restTemplate.delete("${testingApiProperties.url}/testgrunnlag/kontroll/$testgrunnlagId")
    }
  }

  data class NyttTestgrunnlag(
      val kontrollId: Int,
      val namn: String,
      val type: TestgrunnlagType,
      val sideutval: List<Sideutval>,
      val testregelIdList: List<Int>
  )
}
