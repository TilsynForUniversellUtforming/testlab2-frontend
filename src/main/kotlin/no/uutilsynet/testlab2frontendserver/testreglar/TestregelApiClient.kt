package no.uutilsynet.testlab2frontendserver.testreglar

import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.testreglar.dto.*
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate

@Component
class TestregelApiClient(
    val restTemplate: RestTemplate,
    testingApiProperties: TestingApiProperties
) {

  val testregelUrl = "${testingApiProperties.url}/v1/testreglar"

  fun getInnhaldstypeForTestingList() =
      restTemplate.getList<InnhaldstypeTesting>("$testregelUrl/innhaldstypeForTesting")

  fun getTemaForTestreglar() = restTemplate.getList<Tema>("$testregelUrl/temaForTestreglar")

  fun getTestobjektForTesting() =
      restTemplate.getList<Testobjekt>("$testregelUrl/testobjektForTestreglar")

  fun getTestregelListWithMetadata() =
      restTemplate.getList<TestregelDTO>("$testregelUrl?includeMetadata=true")

  fun getTestregelList(): List<Testregel> =
      restTemplate.getList<Testregel>("$testregelUrl/aggregates")

  fun getTestregel(id: Int): TestregelDTO {
    kotlin
        .runCatching { restTemplate.getForObject("$testregelUrl/$id", TestregelDTO::class.java) }
        .getOrElse { throw RuntimeException("Feil ved henting av testregel med id $id", it) }
        ?.let {
          return it
        }
        ?: throw NoSuchElementException("Fant ikkje testregel med id $id")
  }

  fun getTestregelAggregate(id: Int): Testregel {
    kotlin
        .runCatching {
          restTemplate.getForObject("$testregelUrl/aggregates/$id", Testregel::class.java)
        }
        .getOrElse { throw RuntimeException("Feil ved henting av testregel med id $id", it) }
        ?.let {
          return it
        }
        ?: throw NoSuchElementException("Fant ikkje testregel med id $id")
  }
}
