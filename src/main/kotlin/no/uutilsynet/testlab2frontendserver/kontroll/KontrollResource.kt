package no.uutilsynet.testlab2frontendserver.kontroll

import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.maalinger.dto.Loeysing
import no.uutilsynet.testlab2frontendserver.utval.UtvalResource
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestTemplate

@RestController
@RequestMapping("api/v1/kontroller")
class KontrollResource(
    val restTemplate: RestTemplate,
    val testingApiProperties: TestingApiProperties,
    val utvalResource: UtvalResource
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

  @GetMapping("{id}")
  fun getKontroll(@PathVariable id: Int): ResponseEntity<*> {
    val responseEntity =
        restTemplate.getForEntity(testingApiProperties.url + "/kontroller/$id", String::class.java)
    return ResponseEntity.status(responseEntity.statusCode).body(responseEntity.body)
  }

  @DeleteMapping("{id}")
  fun deleteKontroll(@PathVariable id: Int) =
      runCatching { restTemplate.delete(testingApiProperties.url + "/kontroller/$id") }
          .getOrElse {
            logger.error("Sletting av kontroll feilet", it)
            throw RuntimeException(it)
          }

  @PutMapping("{id}")
  fun updateKontroll(
      @PathVariable id: Int,
      @RequestBody updateKontrollBody: UpdateKontrollBody
  ): ResponseEntity<Unit> =
      runCatching {
            restTemplate.put(
                testingApiProperties.url + "/kontroller/{id}",
                mapOf(
                    "kontroll" to updateKontrollBody.kontroll,
                    "utvalId" to updateKontrollBody.utval.id),
                mapOf("id" to id))
            ResponseEntity.noContent().build<Unit>()
          }
          .getOrElse {
            logger.error("Oppdatering av kontroll feilet")
            ResponseEntity.internalServerError().build()
          }

  data class OpprettKontroll(
      val kontrolltype: String,
      val tittel: String,
      val saksbehandler: String,
      val sakstype: String,
      val arkivreferanse: String,
  )

  data class UpdateKontrollBody(val kontroll: Kontroll, val utval: UtvalResource.UtvalListItem)

  data class Kontroll(
      val id: Int,
      val kontrolltype: String,
      val tittel: String,
      val saksbehandler: String,
      val sakstype: String,
      val arkivreferanse: String,
      val loeysingar: List<Loeysing> = emptyList()
  )
}
