package no.uutilsynet.testlab2frontendserver.regelsett

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.krav.KravApiProperties
import no.uutilsynet.testlab2frontendserver.regelsett.dto.RegelsettBase
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelModus
import org.assertj.core.api.Assertions.assertThat
import org.hamcrest.CoreMatchers
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.client.AutoConfigureWebClient
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.test.web.client.ExpectedCount
import org.springframework.test.web.client.MockRestServiceServer
import org.springframework.test.web.client.match.MockRestRequestMatchers
import org.springframework.test.web.client.response.MockRestResponseCreators
import org.springframework.web.client.RestTemplate

@RestClientTest
@AutoConfigureWebClient(registerRestTemplate = true)
class RegelsettResourceTest(@Autowired val restTemplate: RestTemplate) {

  @Autowired private lateinit var server: MockRestServiceServer
  private val mapper =
      jacksonObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)

  private val apiUrl = "https://api.url"
  private val regelsettResource =
      RegelsettResource(
          restTemplate, TestingApiProperties(apiUrl), KravApiProperties("$apiUrl/krav"))

  @BeforeEach
  fun setup() {
    restTemplate.interceptors.clear()
  }

  @Test
  fun `skal kunne hente liste med Regelsett`() {
    val json = mapper.writeValueAsString(regelsettList)
    server
        .expect(
            ExpectedCount.once(),
            MockRestRequestMatchers.requestTo(CoreMatchers.startsWith(apiUrl)))
        .andExpect(MockRestRequestMatchers.method(HttpMethod.GET))
        .andRespond(MockRestResponseCreators.withSuccess(json, MediaType.APPLICATION_JSON))
    val result = regelsettResource.listRegelsett(false)
    assertThat(result[0].id).isEqualTo(1)
  }

  private val regelsettList =
      listOf(
          RegelsettBase(
              id = 1,
              namn = "Standard regelsett",
              modus = TestregelModus.automatisk,
              standard = false,
          ))
}
