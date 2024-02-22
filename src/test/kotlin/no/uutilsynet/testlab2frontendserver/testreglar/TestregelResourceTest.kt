package no.uutilsynet.testlab2frontendserver.testreglar

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import java.time.Instant
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.common.TestlabLocale
import no.uutilsynet.testlab2frontendserver.maalinger.dto.IdList
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelBase
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelDTO
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelInit
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelInnholdstype
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelModus
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelStatus
import org.assertj.core.api.Assertions.assertThat
import org.hamcrest.CoreMatchers
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest
import org.springframework.http.HttpMethod
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
      jacksonObjectMapper()
          .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
          .registerModule(JavaTimeModule())

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
    val testregelListJson = mapper.writeValueAsString(testregelList)
    val testregelDTOListJson = mapper.writeValueAsString(listOf(testregelDTOList[1]))
    val expectedRequestData =
        mapOf(
            "testregelId" to "QW-ACT-R1",
            "namn" to "QW-ACT-R1 HTML Page has a title",
            "krav" to "1.1.1",
            "versjon" to 1,
            "status" to TestregelStatus.publisert.value,
            "type" to TestregelInnholdstype.nett.value,
            "modus" to TestregelModus.forenklet.value,
            "spraak" to TestlabLocale.nb.value,
            "testregelSchema" to "QW-ACT-R1",
            "innhaldstypeTesting" to 1,
            "tema" to 1,
            "testobjekt" to 1,
            "kravTilSamsvar" to "")

    server
        .expect(
            ExpectedCount.once(),
            MockRestRequestMatchers.requestTo(CoreMatchers.startsWith(apiUrl)))
        .andExpect(MockRestRequestMatchers.method(HttpMethod.GET))
        .andRespond(
            MockRestResponseCreators.withSuccess(testregelDTOListJson, MediaType.APPLICATION_JSON))

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
        .andRespond(
            MockRestResponseCreators.withSuccess(testregelListJson, MediaType.APPLICATION_JSON))

    val result =
        testregelResource.createTestregel(
            TestregelInit(
                testregelId = "QW-ACT-R1",
                namn = "QW-ACT-R1 HTML Page has a title",
                krav = "1.1.1",
                versjon = 1,
                status = TestregelStatus.publisert,
                type = TestregelInnholdstype.nett,
                modus = TestregelModus.forenklet,
                spraak = TestlabLocale.nb,
                testregelSchema = "QW-ACT-R1",
                innhaldstypeTesting = 1,
                tema = 1,
                testobjekt = 1,
                kravTilSamsvar = ""))

    assertThat(result).isEqualTo(testregelList)
  }

  @Test
  fun `skal ikke kunne lage en Testregel med duplikat skjema`() {
    val testregelDTOListJson = mapper.writeValueAsString(testregelDTOList)

    server
        .expect(
            ExpectedCount.once(),
            MockRestRequestMatchers.requestTo(CoreMatchers.startsWith(apiUrl)))
        .andExpect(MockRestRequestMatchers.method(HttpMethod.GET))
        .andRespond(
            MockRestResponseCreators.withSuccess(testregelDTOListJson, MediaType.APPLICATION_JSON))

    assertThrows<IllegalArgumentException> {
      testregelResource.createTestregel(
          TestregelInit(
              testregelId = "QW-ACT-R1",
              namn = "QW-ACT-R1 HTML Page has a title",
              krav = "1.1.1",
              versjon = 1,
              status = TestregelStatus.publisert,
              type = TestregelInnholdstype.nett,
              modus = TestregelModus.forenklet,
              spraak = TestlabLocale.nb,
              testregelSchema = "QW-ACT-R1",
              innhaldstypeTesting = 1,
              tema = 1,
              testobjekt = 1,
              kravTilSamsvar = ""))
    }
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

  private val testregelDTOList =
      listOf(
          TestregelDTO(
              1,
              "QW-ACT-R1",
              1,
              "QW-ACT-R1 HTML Page has a title",
              "2.4.2 Sidetitler",
              TestregelStatus.publisert,
              Instant.now(),
              TestregelInnholdstype.nett,
              TestregelModus.forenklet,
              TestlabLocale.nb,
              1,
              1,
              "HTML Page has a title",
              "QW-ACT-R1",
              1),
          TestregelDTO(
              2,
              "QW-ACT-R2",
              1,
              "QW-ACT-R2 HTML page has lang attribute",
              "3.1.1 Språk på siden",
              TestregelStatus.publisert,
              Instant.now(),
              TestregelInnholdstype.nett,
              TestregelModus.forenklet,
              TestlabLocale.nb,
              1,
              1,
              "Språk på siden",
              "QW-ACT-R2",
              1))

  private val testregelList =
      listOf(
          TestregelBase(
              1,
              "QW-ACT-R1 HTML Page has a title",
              "2.4.2 Sidetitler",
              TestregelModus.forenklet,
          ),
          TestregelBase(
              2,
              "QW-ACT-R2 HTML page has lang attribute",
              "3.1.1 Språk på siden",
              TestregelModus.forenklet))
}
