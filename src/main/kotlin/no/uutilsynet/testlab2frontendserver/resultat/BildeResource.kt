package no.uutilsynet.testlab2frontendserver.resultat

import java.net.HttpURLConnection
import java.net.Proxy
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import org.springframework.core.io.InputStreamResource
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.util.UriComponentsBuilder

@RestController
@RequestMapping("api/bilder")
class BildeResource(val testingApiProperties: TestingApiProperties) {

  @GetMapping()
  fun getBilde(@RequestParam bildesti: String): ResponseEntity<InputStreamResource> {
    val bildeUrl =
        UriComponentsBuilder.fromUriString("${testingApiProperties.url}/bilder/sti")
            .queryParam("bildesti", bildesti)
            .build()
            .toUri()
            .toURL()


    val filename = bildesti.split("/").last()

    val connection = bildeUrl.openConnection(Proxy.NO_PROXY) as HttpURLConnection

    val contentType: String = connection.contentType ?: "image/jpeg"
    val mediaType = MediaType.parseMediaType(contentType)
    val headers = HttpHeaders()
    headers["Content-Disposition"] = "inline; filename=\"$filename\""
    if (testingApiProperties.key.isNotEmpty()) {
      connection.setRequestProperty(testingApiProperties.headerName, testingApiProperties.key)
      headers[testingApiProperties.headerName] = testingApiProperties.key
    }

    return ResponseEntity.ok()
        .headers(headers)
        .contentType(mediaType)
        .body(InputStreamResource(connection.inputStream))
  }
}
