package no.uutilsynet.testlab2frontendserver.kontroll

import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.resultat.TestgrunnlagType
import no.uutilsynet.testlab2frontendserver.testing.Retest
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.body
import org.springframework.web.client.getForObject

interface ITestgrunnlagAPIClient {
  fun createTestgrunnlag(
      nyttTestgrunnlag: TestgrunnlagAPIClient.NyttTestgrunnlag
  ): Result<KontrollResource.TestgrunnlagDTO>

  fun createRetest(retest: Retest): Result<KontrollResource.TestgrunnlagDTO>

  fun getTestgrunnlag(kontrollId: Int): Result<List<KontrollResource.TestgrunnlagDTO>>

  fun deleteTestgrunnlag(testgrunnlagId: Int): Result<Unit>

  fun getTestgrunnlagByUser(): Result<List<KontrollResource.TestgrunnlagDTO>>
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
      check(location != null) { "Vi fikk ikkje location for det nye testgrunnlaget fra serveren" }

      val nyttTestgrunnlag =
          restTemplate.getForObject<KontrollResource.TestgrunnlagDTO>(location)
      check(nyttTestgrunnlag != null) {
        "Vi forsøkte å hente det nye testgrunnlaget, men det finst ikkje."
      }
      nyttTestgrunnlag
    }
  }

  override fun createRetest(retest: Retest): Result<KontrollResource.TestgrunnlagDTO> =
      runCatching {
        val location =
            restTemplate.postForLocation(
                "${testingApiProperties.url}/testgrunnlag/kontroll/retest", retest)
        check(location != null) { "Vi fikk ikkje location fra $testingApiProperties" }
        val nyttTestgrunnlag =
            restTemplate.getForObject(location, KontrollResource.TestgrunnlagDTO::class.java)
        check(nyttTestgrunnlag != null) {
          "Vi forsøkte å hente det nye testgrunnlaget, men det finst ikkje."
        }
        nyttTestgrunnlag
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

    override fun getTestgrunnlagByUser(): Result<List<KontrollResource.TestgrunnlagDTO>> {
        val restClient = RestClient.builder().build()
        val url = "${testingApiProperties.url}/testgrunnlag/kontroll/byUser"
        return runCatching {
            restClient.get()
                .uri(url)
                .retrieve()
                .body<List<KontrollResource.TestgrunnlagDTO>>()
                ?: emptyList()
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
