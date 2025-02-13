package no.uutilsynet.testlab2frontendserver.resultat

import java.net.HttpURLConnection
import java.net.Proxy
import java.net.URI
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import org.springframework.core.io.InputStreamResource
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("api/bilder")
class BildeResource(val testingApiProperties: TestingApiProperties) {

  @GetMapping("/{bilde}")
  fun getBilde(@PathVariable bilde: String): ResponseEntity<InputStreamResource> {
    val bildeUrl = URI("${testingApiProperties.url}/bilder/sti/$bilde").toURL()

    val connection = bildeUrl.openConnection(Proxy.NO_PROXY) as HttpURLConnection
    connection.setRequestProperty(testingApiProperties.headerName, testingApiProperties.key)

    val contentType: String = connection.contentType ?: "image/jpeg"
    val mediaType = MediaType.parseMediaType(contentType)
    val headers = HttpHeaders()
    headers["Content-Disposition"] = "inline; filename=\"$bilde\""
    headers[testingApiProperties.headerName] = testingApiProperties.key

    return ResponseEntity.ok()
        .headers(headers)
        .contentType(mediaType)
        .body(InputStreamResource(connection.inputStream))
  }
}
