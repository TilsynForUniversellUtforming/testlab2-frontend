package no.uutilsynet.testlab2frontendserver.resultat.rapport

import jakarta.servlet.http.HttpServletResponse
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import org.springframework.http.HttpStatusCode
import org.springframework.http.MediaType
import org.springframework.http.converter.ByteArrayHttpMessageConverter
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestClient
import org.springframework.web.client.RestTemplate

@RestController
@RequestMapping("api/v1/testresultat/rapport")
class RapportResource(
    val restTemplate: RestTemplate,
    val testingApiProperties: TestingApiProperties
) {

  val testresultatUrl = "${testingApiProperties.url}/rapport"

  @GetMapping("kontroll/{kontrollId}/loeysing/{loeysingId}")
  fun genererRapoort(
      @PathVariable kontrollId: Int,
      @PathVariable loeysingId: Int,
      response: HttpServletResponse
  ) {

    restTemplate.messageConverters.add(0, ByteArrayHttpMessageConverter())

    val restClient = RestClient.builder(restTemplate).build()

    response.setHeader("Content-disposition", "attachment;filename=tilsynsrapport.docx")
    response.contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    val fileResponse =
        restClient
            .get()
            .uri(testresultatUrl + "/kontroll/${kontrollId}/loeysing/${loeysingId}")
            .accept(
                MediaType.valueOf(
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
            .retrieve()
            .onStatus(HttpStatusCode::isError) { _, errorResponse ->
              throw RuntimeException("Feil ved generering av rapport")
            }
            .body(ByteArray::class.java)

    if (fileResponse != null) {
      response.outputStream.write(fileResponse)
    }
    response.outputStream.flush()
  }
}
