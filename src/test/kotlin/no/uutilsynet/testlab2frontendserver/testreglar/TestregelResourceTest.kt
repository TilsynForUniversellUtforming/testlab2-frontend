package no.uutilsynet.testlab2frontendserver.testreglar

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import java.time.Instant
import no.uutilsynet.testlab2.constants.KravStatus
import no.uutilsynet.testlab2.constants.WcagPrinsipp
import no.uutilsynet.testlab2.constants.WcagRetninglinje
import no.uutilsynet.testlab2frontendserver.common.BearerTokenInterceptor
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.common.TestlabLocale
import no.uutilsynet.testlab2frontendserver.krav.KravApiProperties
import no.uutilsynet.testlab2frontendserver.krav.dto.Krav
import no.uutilsynet.testlab2frontendserver.krav.dto.WcagSamsvarsnivaa
import no.uutilsynet.testlab2frontendserver.maalinger.dto.IdList
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelBase
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelDTO
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelInit
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelInnholdstype
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelModus
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelStatus
import org.assertj.core.api.Assertions.assertThat
import org.hamcrest.CoreMatchers
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.client.ExpectedCount
import org.springframework.test.web.client.MockRestServiceServer
import org.springframework.test.web.client.match.MockRestRequestMatchers
import org.springframework.test.web.client.response.MockRestResponseCreators
import org.springframework.web.client.RestTemplate

@RestClientTest
class TestregelResourceTest(@Autowired val restTemplate: RestTemplate) {

  @Autowired private lateinit var server: MockRestServiceServer
  @MockitoBean lateinit var bearerTokenInterceptor: BearerTokenInterceptor
  private val testregelApiUrl = "https://api.url/testregel"
  private val kravApiUrl = "https://api.url/krav"

  private val testregelResource =
      TestregelResource(
          restTemplate, TestingApiProperties(testregelApiUrl), KravApiProperties(kravApiUrl))
  private val mapper =
      jacksonObjectMapper()
          .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
          .registerModule(JavaTimeModule())

  @BeforeEach
  fun setup() {
    restTemplate.interceptors.clear()
  }

  @Test
  fun `skal kunne hente liste med Testregel`() {
    val testregelDTOListJson = mapper.writeValueAsString(testregelDTOList)
    val kravListJson = mapper.writeValueAsString(listOf(krav))

    server
        .expect(
            ExpectedCount.once(),
            MockRestRequestMatchers.requestTo(CoreMatchers.startsWith(kravApiUrl)))
        .andExpect(MockRestRequestMatchers.method(HttpMethod.GET))
        .andRespond(MockRestResponseCreators.withSuccess(kravListJson, MediaType.APPLICATION_JSON))

    server
        .expect(
            ExpectedCount.once(),
            MockRestRequestMatchers.requestTo(CoreMatchers.startsWith(testregelApiUrl)))
        .andExpect(MockRestRequestMatchers.method(HttpMethod.GET))
        .andRespond(
            MockRestResponseCreators.withSuccess(testregelDTOListJson, MediaType.APPLICATION_JSON))

    val result = testregelResource.listTestreglar()
    assertThat(result).usingRecursiveComparison().isEqualTo(testregelList)
  }

  @Test
  fun `skal kunne lage en Testregel`() {
    val testregelList = testregelList
    val testregelDTOListJsonBefore = mapper.writeValueAsString(listOf(testregelDTOList[1]))
    val testregelDTOListJsonAfter = mapper.writeValueAsString(testregelDTOList)
    val kravListJson = mapper.writeValueAsString(listOf(krav))

    val expectedRequestData =
        mapOf(
            "testregelId" to "QW-ACT-R1",
            "namn" to "QW-ACT-R1 HTML Page has a title",
            "kravId" to 1,
            "versjon" to 1,
            "status" to TestregelStatus.publisert.value,
            "type" to TestregelInnholdstype.nett.value,
            "modus" to TestregelModus.automatisk.value,
            "spraak" to TestlabLocale.nb.value,
            "testregelSchema" to "QW-ACT-R1",
            "innhaldstypeTesting" to 1,
            "tema" to 1,
            "testobjekt" to 1,
            "kravTilSamsvar" to "")

    server
        .expect(
            ExpectedCount.once(),
            MockRestRequestMatchers.requestTo(CoreMatchers.startsWith(testregelApiUrl)))
        .andExpect(MockRestRequestMatchers.method(HttpMethod.GET))
        .andRespond(
            MockRestResponseCreators.withSuccess(
                testregelDTOListJsonBefore, MediaType.APPLICATION_JSON))

    server
        .expect(
            ExpectedCount.once(),
            MockRestRequestMatchers.requestTo(CoreMatchers.startsWith(testregelApiUrl)))
        .andExpect(MockRestRequestMatchers.method(HttpMethod.POST))
        .andExpect(
            MockRestRequestMatchers.content().json(mapper.writeValueAsString(expectedRequestData)))
        .andRespond(MockRestResponseCreators.withSuccess("1", MediaType.APPLICATION_JSON))

    server
        .expect(
            ExpectedCount.once(),
            MockRestRequestMatchers.requestTo(CoreMatchers.startsWith(kravApiUrl)))
        .andExpect(MockRestRequestMatchers.method(HttpMethod.GET))
        .andRespond(MockRestResponseCreators.withSuccess(kravListJson, MediaType.APPLICATION_JSON))

    server
        .expect(
            ExpectedCount.once(),
            MockRestRequestMatchers.requestTo(CoreMatchers.startsWith(testregelApiUrl)))
        .andExpect(MockRestRequestMatchers.method(HttpMethod.GET))
        .andRespond(
            MockRestResponseCreators.withSuccess(
                testregelDTOListJsonAfter, MediaType.APPLICATION_JSON))

    val result =
        testregelResource.createTestregel(
            TestregelInit(
                testregelId = "QW-ACT-R1",
                namn = "QW-ACT-R1 HTML Page has a title",
                kravId = 1,
                versjon = 1,
                status = TestregelStatus.publisert,
                type = TestregelInnholdstype.nett,
                modus = TestregelModus.automatisk,
                spraak = TestlabLocale.nb,
                testregelSchema = "QW-ACT-R1",
                innhaldstypeTesting = 1,
                tema = 1,
                testobjekt = 1,
                kravTilSamsvar = ""))

    assertThat(result).usingRecursiveComparison().isEqualTo(testregelList)
  }

  @Test
  fun `skal ikke kunne lage en Testregel med duplikat skjema`() {
    val testregelDTOListJson = mapper.writeValueAsString(testregelDTOList)

    server
        .expect(
            ExpectedCount.once(),
            MockRestRequestMatchers.requestTo(CoreMatchers.startsWith(testregelApiUrl)))
        .andExpect(MockRestRequestMatchers.method(HttpMethod.GET))
        .andRespond(
            MockRestResponseCreators.withSuccess(testregelDTOListJson, MediaType.APPLICATION_JSON))

    assertThrows<IllegalArgumentException> {
      testregelResource.createTestregel(
          TestregelInit(
              testregelId = "QW-ACT-R1",
              namn = "QW-ACT-R1 HTML Page has a title",
              kravId = 1,
              versjon = 1,
              status = TestregelStatus.publisert,
              type = TestregelInnholdstype.nett,
              modus = TestregelModus.automatisk,
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
    val json = mapper.writeValueAsString(testregelDTOList)
    val kravListJson = mapper.writeValueAsString(listOf(krav))

    val idList = IdList(listOf(1))

    for (id in idList.idList) {
      server
          .expect(
              ExpectedCount.once(),
              MockRestRequestMatchers.requestTo("$testregelApiUrl/v1/testreglar/$id"))
          .andExpect(MockRestRequestMatchers.method(HttpMethod.DELETE))
          .andRespond(MockRestResponseCreators.withSuccess())
    }

    server
        .expect(
            ExpectedCount.once(),
            MockRestRequestMatchers.requestTo(CoreMatchers.startsWith(kravApiUrl)))
        .andExpect(MockRestRequestMatchers.method(HttpMethod.GET))
        .andRespond(MockRestResponseCreators.withSuccess(kravListJson, MediaType.APPLICATION_JSON))

    server
        .expect(
            ExpectedCount.once(),
            MockRestRequestMatchers.requestTo(CoreMatchers.startsWith(testregelApiUrl)))
        .andExpect(MockRestRequestMatchers.method(HttpMethod.GET))
        .andRespond(MockRestResponseCreators.withSuccess(json, MediaType.APPLICATION_JSON))

    val result = testregelResource.deleteTestregelList(idList)

    assertThat(result.body).usingRecursiveComparison().isEqualTo(testregelList)
  }

  private val testregelDTOList =
      listOf(
          TestregelDTO(
              1,
              "QW-ACT-R1",
              1,
              "QW-ACT-R1 HTML Page has a title",
              1,
              TestregelStatus.publisert,
              Instant.now(),
              TestregelInnholdstype.nett,
              TestregelModus.automatisk,
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
              1,
              TestregelStatus.publisert,
              Instant.now(),
              TestregelInnholdstype.nett,
              TestregelModus.automatisk,
              TestlabLocale.nb,
              1,
              1,
              "Språk på siden",
              "QW-ACT-R2",
              1))

  private val krav =
      Krav(
          1,
          "1.1.1 Ikke-tekstlig innhold,Gjeldande",
          KravStatus.gjeldande,
          "Innhald",
          false,
          false,
          false,
          "https://www.uutilsynet.no/wcag-standarden/111-ikke-tekstlig-innhold-niva/87",
          WcagPrinsipp.mulig_aa_oppfatte,
          WcagRetninglinje.tidsbasert_media,
          "1.1.1",
          WcagSamsvarsnivaa.A)

  private val testregelList =
      listOf(
          TestregelBase(
              1,
              "QW-ACT-R1 HTML Page has a title",
              krav,
              TestregelModus.automatisk,
              TestregelInnholdstype.nett),
          TestregelBase(
              2,
              "QW-ACT-R2 HTML page has lang attribute",
              krav,
              TestregelModus.automatisk,
              TestregelInnholdstype.nett))
}
