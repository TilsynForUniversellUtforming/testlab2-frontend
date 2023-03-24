package no.uutilsynet.testlab2frontendserver.testing

import no.uutilsynet.testlab2frontendserver.testing.dto.AzTestResult
import no.uutilsynet.testlab2frontendserver.testing.dto.AzTestResultOutput
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestTemplate

@RestController
@RequestMapping("api/v1/testing")
class TestResource(
    val restTemplate: RestTemplate,
) {
  val logger = LoggerFactory.getLogger(TestResource::class.java)

  data class AzUrl(val url: String)

  // TODO - Midlertidig API
  @PostMapping
  fun getTestResultFromUrl(@RequestBody azUrl: AzUrl): ResponseEntity<List<AzTestResultOutput>> {
    logger.info("Henter testresultat")

    // TODO - Hent resultat fra testlab og ikke azure
    val azTestResult: AzTestResult =
        restTemplate.getForObject(azUrl.url, AzTestResult::class.java)
            ?: throw RuntimeException("Finner ingen testresultat")

    return ResponseEntity.ok(azTestResult.output)
  }
}
