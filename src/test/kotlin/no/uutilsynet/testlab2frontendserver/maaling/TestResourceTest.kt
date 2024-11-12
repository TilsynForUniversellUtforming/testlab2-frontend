package no.uutilsynet.testlab2frontendserver.maaling

import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.maalinger.MaalingResource
import no.uutilsynet.testlab2securitylib.interceptor.BearerTokenInterceptor
import org.hamcrest.CoreMatchers
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.client.AutoConfigureWebClient
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.client.ExpectedCount
import org.springframework.test.web.client.MockRestServiceServer
import org.springframework.test.web.client.match.MockRestRequestMatchers
import org.springframework.test.web.client.response.MockRestResponseCreators
import org.springframework.web.client.RestTemplate

@RestClientTest
@AutoConfigureWebClient(registerRestTemplate = true)
class TestResourceTest(@Autowired val restTemplate: RestTemplate) {
  @Autowired private lateinit var server: MockRestServiceServer
  @MockBean lateinit var bearerTokenInterceptor: BearerTokenInterceptor

  @BeforeEach
  fun setup() {
    restTemplate.interceptors.clear()
  }

  @Test
  @DisplayName(
      "når vi får en respons som mangler elementOmtale, så skal det parses som et TestResultat")
  fun getTestResultatListTest() {
    val jsonSuccess =
        """
      [{
        "elementResultat": "samsvar",
        "elementUtfall": "The test target has a unique `id` attribute.",
        "side": "https://www.sokndal.kommune.no/aktuelt/se-programmet-for-sokndalsdagene.8048.aspx",
        "sideNivaa": 2,
        "suksesskriterium": [
            "4.1.1"
        ],
        "testVartUtfoert": "2023-06-02T08:50:48",
        "testregelId": 1,
        "testregelNoekkel": "QW-ACT-R18"
    }]
    """
            .trimIndent()
    server
        .expect(
            ExpectedCount.once(),
            MockRestRequestMatchers.requestTo(CoreMatchers.containsString("resultat?maalingId=1")))
        .andRespond(MockRestResponseCreators.withSuccess(jsonSuccess, MediaType.APPLICATION_JSON))

    val maalingResource = MaalingResource(restTemplate, TestingApiProperties("https://testing.api"))
    val result = maalingResource.getTestResultatList(1, null)
    assertThat(result.size, equalTo(1))
  }
}
