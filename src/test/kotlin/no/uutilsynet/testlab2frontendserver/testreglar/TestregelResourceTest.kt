package no.uutilsynet.testlab2frontendserver.testreglar

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.maalinger.dto.IdList
import no.uutilsynet.testlab2frontendserver.testreglar.dto.CreateTestregelDTO
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Regelsett
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testregel
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelType
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
  fun `skal kunne hente liste med Regelsett`() {
    val regelsettList =
        listOf(Regelsett(1, "Standard regelsett", TestregelType.forenklet, testregelList))
    val json = mapper.writeValueAsString(testregelList)
    server
        .expect(
            ExpectedCount.once(),
            MockRestRequestMatchers.requestTo(CoreMatchers.startsWith(apiUrl)))
        .andExpect(MockRestRequestMatchers.method(HttpMethod.GET))
        .andRespond(MockRestResponseCreators.withSuccess(json, MediaType.APPLICATION_JSON))
    val result = testregelResource.listRegelsett()
    assertThat(result).isEqualTo(regelsettList)
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
            CreateTestregelDTO(
                "2.4.2 Sidetitler", "QW-ACT-R1", "HTML Page has a title", TestregelType.forenklet))

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
              1, "HTML Page has a title", "QW-ACT-R1", "2.4.2 Sidetitler", TestregelType.forenklet),
          Testregel(
              2,
              "Link has accessible name",
              "QW-ACT-R12",
              "4.1.2 Navn, rolle, verdi",
              TestregelType.forenklet))
}
