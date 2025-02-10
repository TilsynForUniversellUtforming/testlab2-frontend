package no.uutilsynet.testlab2frontendserver.resultat


import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import java.net.HttpURLConnection
import java.net.Proxy
import java.net.URI
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

    val testApiBase = testingApiProperties.url.split("/").dropLast(1).joinToString("/")

    @GetMapping("/{bilde}")
    fun getBilde(@PathVariable bilde: String): ResponseEntity<InputStreamResource> {
        val bildeUrl = URI("$testApiBase/bilder/sti/$bilde").toURL()

        val connection = bildeUrl.openConnection(Proxy.NO_PROXY) as HttpURLConnection

        val contentType: String = connection.contentType ?: "image/jpeg"
        val mediaType = MediaType.parseMediaType(contentType)
        val headers = HttpHeaders()
        headers["Content-Disposition"] = "inline; filename=\"$bilde\""

        return ResponseEntity.ok()
            .headers(headers)
            .contentType(mediaType)
            .body(InputStreamResource(connection.inputStream))
    }
}