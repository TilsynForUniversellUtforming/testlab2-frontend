package no.uutilsynet.testlab2frontendserver.testing

import com.fasterxml.jackson.annotation.JsonProperty
import no.uutilsynet.testlab2.constants.Kontrolltype
import no.uutilsynet.testlab2.constants.Loeysingstype
import no.uutilsynet.testlab2.constants.TestgrunnlagType
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestClient
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.toEntity

@RestController
@RequestMapping("/testoverview")
class TestoverviewController(
    val restTemplate: RestTemplate,
    testingApiProperties: TestingApiProperties
) {

  private val restClient = RestClient.create(restTemplate)
  private val testresultUrl = testingApiProperties.url

  @GetMapping("/kontroll/{kontrollId}")
  fun getTestOverview(@PathVariable kontrollId: Int): List<TestingStatus> {
    val response =
        restClient
            .get()
            .uri("${testresultUrl}/testoverview/kontroll/$kontrollId")
            .retrieve()
            .toEntity<List<TestingStatus>>()

    check(response.statusCode == HttpStatus.OK) {
      "Feil ved henting av testoverview for kontrollId $kontrollId, status code: ${response.statusCode}"
    }
    return checkNotNull(response.body) {
        "Tom respons ved henting av testoverview for kontrollId $kontrollId"
    }
  }
}

data class TestingStatus(
    val loeysingId: Int,
    val loeysingNamn: String,
    val loeysingstype: Loeysingstype,
    val kontrollType: Kontrolltype,
    val testgrunnlagType: TestgrunnlagType,
    val styringsdataId: Int?,
    val styringdataStatus: StyringsdataStatus,
    val status: ManuellTestStatus,
    val kanSlette: Boolean,
    val kanReteste: Boolean,
    val teststatistics: TestStatusCount
)

enum class ManuellTestStatus {
  FERDIG,
  DEAKTIVERT,
  UNDER_ARBEID,
  IKKJE_STARTA
}

data class TestStatusCount(
    val loeysingId: Int,
    val testgrunnlagId: Int,
    val total: Int,
    val ferdig: Int,
    val underArbeid: Int,
    val ikkjeStarta: Int,
    val percentagePerSide: Double,
    val percentagePerInnholdstype: Double
)

enum class StyringsdataStatus {
    @JsonProperty("bot") BOT,
    @JsonProperty("paalegg") PAALEG,
    @JsonProperty("klage") KLAGE,
    @JsonProperty("ingen-reaksjon-brukt") INGEN_REAKSJON_BRUKT
}
