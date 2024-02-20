package no.uutilsynet.testlab2frontendserver.testreglar

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.common.TestlabLocale
import no.uutilsynet.testlab2frontendserver.maalinger.dto.IdList
import no.uutilsynet.testlab2frontendserver.testreglar.dto.InnhaldstypeTesting
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Tema
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testobjekt
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testregel
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelInit
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelInnholdstype
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelModus
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelStatus
import org.assertj.core.api.Assertions.assertThat
import org.hamcrest.CoreMatchers
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.test.web.client.ExpectedCount
import org.springframework.test.web.client.MockRestServiceServer
import org.springframework.test.web.client.match.MockRestRequestMatchers
import org.springframework.test.web.client.response.MockRestResponseCreators
import org.springframework.web.client.RestTemplate

@RestClientTest
class TestregelResourceTest(@Autowired val restTemplate: RestTemplate) {

  @Autowired private lateinit var server: MockRestServiceServer
  private val apiUrl = "https://api.url"
  private val testregelResource = TestregelResource(restTemplate, TestingApiProperties(apiUrl))
  private val mapper =
      jacksonObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)

  @Test
  fun `skal kunne hente liste med Testregel`() {
    val json = mapper.writeValueAsString(testregelList)
    server
        .expect(
            ExpectedCount.once(),
            MockRestRequestMatchers.requestTo(CoreMatchers.startsWith(apiUrl)))
        .andExpect(MockRestRequestMatchers.method(HttpMethod.GET))
        .andRespond(MockRestResponseCreators.withSuccess(json, MediaType.APPLICATION_JSON))
    val result = testregelResource.listTestreglar()
    assertThat(result).isEqualTo(testregelList)
  }

  @Test
  fun `skal kunne lage en Testregel`() {
    val testregelList = testregelList
    val json = mapper.writeValueAsString(testregelList)
    val expectedRequestData =
        mapOf(
            "krav" to "2.4.2 Sidetitler",
            "testregelSchema" to "QW-ACT-R1",
            "name" to "HTML Page has a title")

    server
        .expect(
            ExpectedCount.once(),
            MockRestRequestMatchers.requestTo(CoreMatchers.startsWith(apiUrl)))
        .andExpect(MockRestRequestMatchers.method(HttpMethod.POST))
        .andExpect(
            MockRestRequestMatchers.content().json(mapper.writeValueAsString(expectedRequestData)))
        .andRespond(MockRestResponseCreators.withSuccess("1", MediaType.APPLICATION_JSON))

    server
        .expect(
            ExpectedCount.once(),
            MockRestRequestMatchers.requestTo(CoreMatchers.startsWith(apiUrl)))
        .andExpect(MockRestRequestMatchers.method(HttpMethod.GET))
        .andRespond(MockRestResponseCreators.withSuccess(json, MediaType.APPLICATION_JSON))

    val result =
        testregelResource.createTestregel(
            TestregelInit(
                testregelId = "QW-ACT-R1",
                namn = "test_skal_slettes_1",
                krav = "1.1.1",
                versjon = 1,
                status = TestregelStatus.publisert,
                type = TestregelInnholdstype.nett,
                modus = TestregelModus.forenklet,
                spraak = TestlabLocale.nb,
                testregelSchema = "",
                innhaldstypeTestingId = 1,
                temaId = 1,
                testobjektId = 1,
                kravTilSamsvar = ""))

    assertThat(result).isEqualTo(testregelList)
  }

  @Test
  fun `skal kunne slette en Testregel`() {
    val testregelList = testregelList
    val json = mapper.writeValueAsString(testregelList)
    val idList = IdList(listOf(1))

    for (id in idList.idList) {
      server
          .expect(
              ExpectedCount.once(), MockRestRequestMatchers.requestTo("$apiUrl/v1/testreglar/$id"))
          .andExpect(MockRestRequestMatchers.method(HttpMethod.DELETE))
          .andRespond(MockRestResponseCreators.withSuccess())
    }

    server
        .expect(
            ExpectedCount.once(),
            MockRestRequestMatchers.requestTo(CoreMatchers.startsWith(apiUrl)))
        .andExpect(MockRestRequestMatchers.method(HttpMethod.GET))
        .andRespond(MockRestResponseCreators.withSuccess(json, MediaType.APPLICATION_JSON))

    val result = testregelResource.deleteTestregelList(idList)

    assertThat(result.body).isEqualTo(testregelList)
  }

  @Test
  fun `Skal gi riktig status code hvis sletting av Testregel med HttpClientErrorException`() {
    val idList = IdList(listOf(1))

    for (id in idList.idList) {
      server
          .expect(
              ExpectedCount.once(), MockRestRequestMatchers.requestTo("$apiUrl/v1/testreglar/$id"))
          .andExpect(MockRestRequestMatchers.method(HttpMethod.DELETE))
          .andRespond(MockRestResponseCreators.withStatus(HttpStatus.NOT_FOUND))
    }

    val result = testregelResource.deleteTestregelList(idList)

    assertThat(result.statusCode).isEqualTo(HttpStatus.NOT_FOUND)
  }

  private val testregelList =
      listOf(
          Testregel(
              1,
              "QW-ACT-R1",
              1,
              "QW-ACT-R1 HTML Page has a title",
              "2.4.2 Sidetitler",
              TestregelStatus.publisert,
              "2025-01-01T10:00:00Z",
              TestregelInnholdstype.nett,
              TestregelModus.forenklet,
              TestlabLocale.nb,
              Tema(1, ""),
              Testobjekt(1, ""),
              "HTML Page has a title",
              "QW-ACT-R1",
              InnhaldstypeTesting(1, "")),
          Testregel(
              2,
              "QW-ACT-R2",
              1,
              "QW-ACT-R2 HTML page has lang attribute",
              "3.1.1 Språk på siden",
              TestregelStatus.publisert,
              "2025-01-01T10:00:00Z",
              TestregelInnholdstype.nett,
              TestregelModus.forenklet,
              TestlabLocale.nb,
              Tema(1, ""),
              Testobjekt(1, ""),
              "Språk på siden",
              "QW-ACT-R2",
              InnhaldstypeTesting(1, "")))
}
