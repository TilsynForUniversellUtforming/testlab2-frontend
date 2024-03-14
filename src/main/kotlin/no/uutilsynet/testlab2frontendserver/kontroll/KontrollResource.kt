package no.uutilsynet.testlab2frontendserver.kontroll

import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestTemplate

@RestController
@RequestMapping("api/v1/kontroller")
class KontrollResource(
    val restTemplate: RestTemplate,
    val testingApiProperties: TestingApiProperties
) {
  private val logger: Logger = LoggerFactory.getLogger(KontrollResource::class.java)

  @PostMapping
  fun createKontroll(@RequestBody opprettKontroll: OpprettKontroll) =
      runCatching {
            val location =
                restTemplate.postForLocation(
                    testingApiProperties.url + "/kontroller", opprettKontroll)
            val kontrollId =
                location?.path?.substringAfterLast("/")?.toInt()
                    ?: throw RuntimeException(
                        "En ny kontroll ble opprettet, men vi fikk ikke noen location fra serveren.")
            mapOf("kontrollId" to kontrollId)
          }
          .getOrElse {
            logger.error("Oppretting av kontroll feilet", it)
            throw RuntimeException(it)
          }

  @DeleteMapping("{id}")
  fun deleteKontroll(@PathVariable id: Int) =
      runCatching { restTemplate.delete(testingApiProperties.url + "/kontroller/$id") }
          .getOrElse {
            logger.error("Sletting av kontroll feilet", it)
            throw RuntimeException(it)
          }

  data class OpprettKontroll(
      val kontrolltype: String,
      val tittel: String,
      val saksbehandler: String,
      val sakstype: String,
      val arkivreferanse: String,
  )
}
