package no.uutilsynet.testlab2frontendserver.resultat.rapport

import jakarta.servlet.http.HttpServletResponse
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import org.springframework.http.HttpStatusCode
import org.springframework.http.MediaType
import org.springframework.http.client.ClientHttpResponse
import org.springframework.http.converter.ByteArrayHttpMessageConverter
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestClient
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.body

@RestController
@RequestMapping("api/v1/testresultat/rapport")
class RapportResource(
    val restTemplate: RestTemplate,
    final val testingApiProperties: TestingApiProperties,
    val restClient: RestClient
) {

  val testresultatUrl = "${testingApiProperties.url}/rapport"
  val eksternResultatUrl = "${testingApiProperties.url}/ekstern/tester"

  @GetMapping("kontroll/{kontrollId}/loeysing/{loeysingId}")
  fun genererRapoort(
      @PathVariable kontrollId: Int,
      @PathVariable loeysingId: Int,
      response: HttpServletResponse
  ) {

    restTemplate.messageConverters.add(0, ByteArrayHttpMessageConverter())

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
            .onStatus(HttpStatusCode::isError) { _, _,
              ->
              throw IllegalStateException("Feil ved generering av rapport")
            }
            .body<ByteArray>()

    if (fileResponse != null) {
      response.outputStream.write(fileResponse)
    }
    response.outputStream.flush()
  }
  @PutMapping("publiser/kontroll/{kontrollId}")
  fun publiserResultat(@PathVariable kontrollId: Int) {
    restClient
        .put()
        .uri(eksternResultatUrl + "/publiser/kontroll/${kontrollId}")
        .retrieve()
        .onStatus(HttpStatusCode::isError) { _, response: ClientHttpResponse,
          ->
          throw IllegalStateException("Feil ved publisering av resultat ${response.statusText}")
        }
        .toBodilessEntity()
  }
}
