package no.uutilsynet.testlab2frontendserver.kontroll

import java.time.Instant
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.resultat.TestgrunnlagType
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelDTO
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestTemplate

typealias Orgnummer = String

data class KontrollListItem(
    val id: Int,
    val tittel: String,
    val saksbehandler: String,
    val sakstype: String,
    val arkivreferanse: String,
    val kontrolltype: String,
    val virksomheter: List<Orgnummer>
)

@RestController
@RequestMapping("api/v1/kontroller")
class KontrollResource(
    val restTemplate: RestTemplate,
    val testingApiProperties: TestingApiProperties,
) {
  private val logger: Logger = LoggerFactory.getLogger(KontrollResource::class.java)

  @GetMapping
  fun getKontroller(): List<KontrollListItem> {
    return runCatching {
          restTemplate.getList<KontrollListItem>(testingApiProperties.url + "/kontroller")
        }
        .getOrElse {
          logger.error("Henting av alle kontroller feilet", it)
          throw RuntimeException(it)
        }
  }

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
      @RequestBody kontrollUpdate: KontrollUpdate
  ): ResponseEntity<Unit> =
      runCatching {
            restTemplate.put(
                testingApiProperties.url + "/kontroller/{id}", kontrollUpdate, mapOf("id" to id))
            ResponseEntity.noContent().build<Unit>()
          }
          .getOrElse {
            logger.error("Oppdatering av kontroll feilet")
            ResponseEntity.internalServerError().build()
          }

  @GetMapping("sideutvaltype")
  fun getSideutvalType(): List<SideutvalType> =
      try {
        restTemplate.getList<SideutvalType>("${testingApiProperties.url}/kontroller/sideutvaltype")
      } catch (e: Error) {
        logger.error("klarte ikke å hente sideutvaltyper", e)
        throw Error("Klarte ikke å hente sideutvaltyper")
      }

  @GetMapping("{kontrollId}/testgrunnlag")
  fun testgrunnlagForKontroll(@PathVariable kontrollId: Int): List<TestgrunnlagDTO> {
    return runCatching {
          restTemplate.getList<TestgrunnlagDTO>(
              "${testingApiProperties.url}/testgrunnlag/kontroll/list/$kontrollId")
        }
        .getOrElse {
          logger.error("Klarte ikke å hente testgrunnlag for kontroll $kontrollId")
          throw it
        }
  }

  @PostMapping("{kontrollId}/testgrunnlag")
  fun nyttTestgrunnlag(
      @PathVariable kontrollId: Int,
      @RequestBody nyttTestgrunnlag: NyttTestgrunnlag
  ): ResponseEntity<Unit> {
    return runCatching {
          val location =
              restTemplate.postForLocation(
                  "${testingApiProperties.url}/testgrunnlag/kontroll", nyttTestgrunnlag)
          ResponseEntity.created(location!!).build<Unit>()
        }
        .getOrElse {
          logger.error("Klarte ikke å lage et nytt testgrunnlag")
          throw it
        }
  }

  data class SideutvalType(
      val id: Int,
      val type: String,
  )

  data class OpprettKontroll(
      val kontrolltype: String,
      val tittel: String,
      val saksbehandler: String,
      val sakstype: String,
      val arkivreferanse: String,
  )

  data class TestgrunnlagDTO(
      val id: Int,
      val kontrollId: Int,
      val namn: String,
      val testreglar: List<TestregelDTO> = emptyList(),
      val sideutval: List<Sideutval> = emptyList(),
      val type: TestgrunnlagType,
      val datoOppretta: Instant
  )

  data class NyttTestgrunnlag(
      val kontrollId: Int,
      val namn: String,
      val type: TestgrunnlagType,
      val sideutval: List<Sideutval>,
      val testregelIdList: List<Int>
  )
}
