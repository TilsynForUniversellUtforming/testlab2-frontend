package no.uutilsynet.testlab2frontendserver.kontroll

import java.time.Instant
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.maalinger.dto.testresultat.TestStatus
import no.uutilsynet.testlab2frontendserver.resultat.TestgrunnlagType
import no.uutilsynet.testlab2frontendserver.testing.ITestresultatAPIClient
import no.uutilsynet.testlab2frontendserver.testing.ResultatManuellKontroll
import no.uutilsynet.testlab2frontendserver.testing.Retest
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelDTO
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
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
    val virksomheter: List<Orgnummer>,
    val styringsdataId: Int?
)

@RestController
@RequestMapping("api/v1/kontroller")
class KontrollResource(
    val testgrunnlagAPIClient: ITestgrunnlagAPIClient,
    val testresultatAPIClient: ITestresultatAPIClient,
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
    return testgrunnlagAPIClient
        .getTestgrunnlag(kontrollId)
        .fold(
            { it },
            {
              logger.error("Klarte ikkje å henta testgrunnlag for kontroll $kontrollId: $it")
              throw it
            })
  }

  @PostMapping("{kontrollId}/testgrunnlag")
  fun nyttTestgrunnlag(
      @PathVariable kontrollId: Int,
      @RequestBody nyttTestgrunnlag: TestgrunnlagAPIClient.NyttTestgrunnlag
  ): ResponseEntity<TestgrunnlagDTO> {
    return testgrunnlagAPIClient
        .createTestgrunnlag(nyttTestgrunnlag)
        .fold(
            { ResponseEntity.ok(it) },
            {
              logger.error("Klarte ikkje å opprette testgrunnlag: $it")
              ResponseEntity.internalServerError().build()
            })
  }

  @PostMapping("{kontrollId}/testgrunnlag/retest")
  fun createRetest(
      @PathVariable kontrollId: Int,
      @RequestBody retest: Retest
  ): ResponseEntity<TestgrunnlagDTO> =
      runCatching {
            val (originalTestgrunnlagId, loeysingId) = retest

            logger.debug(
                "Oppretter retest for løysing $loeysingId i kontroll $kontrollId med opprinnelig testgrunnlag $originalTestgrunnlagId")

            val resultat =
                testresultatAPIClient
                    .getResultatForTestgrunnlag(originalTestgrunnlagId)
                    .getOrThrow()
          check(!okToRetest(resultat))
          val testgrunnlagDTO = testgrunnlagAPIClient.createRetest(retest).getOrThrow()
          ResponseEntity.ok(testgrunnlagDTO)
          }
          .getOrElse { throwable ->
            when (throwable) {
              is IllegalArgumentException ->
                  ResponseEntity.badRequest().build<TestgrunnlagDTO?>().also {
                    logger.warn(throwable.message)
                  }
              is IllegalStateException ->
                  ResponseEntity.status(HttpStatus.FORBIDDEN).build<TestgrunnlagDTO?>().also {
                    logger.warn(throwable.message)
                  }
              else ->
                  ResponseEntity.internalServerError().build<TestgrunnlagDTO?>().also {
                    logger.error("Klarte ikkje å starte retest: ${throwable.message}")
                  }
            }
          }

  @DeleteMapping("{kontrollId}/testgrunnlag/{testgrunnlagId}")
  fun slettTestgrunnlag(
      @PathVariable kontrollId: Int,
      @PathVariable testgrunnlagId: Int
  ): ResponseEntity<Unit> {
    return testresultatAPIClient
        .getResultatForTestgrunnlag(testgrunnlagId)
        .mapCatching { resultat ->
            check(!okToDelete(resultat))
            testgrunnlagAPIClient.deleteTestgrunnlag(testgrunnlagId)
        }
        .fold(
            { ResponseEntity.noContent().build() },
            { throwable ->
              when (throwable) {
                is IllegalArgumentException ->
                    ResponseEntity.badRequest().build<Unit?>().also {
                      logger.warn(throwable.message)
                    }
                is IllegalStateException ->
                    ResponseEntity.status(HttpStatus.FORBIDDEN).build<Unit?>().also {
                      logger.warn(throwable.message)
                    }
                else ->
                    ResponseEntity.internalServerError().build<Unit?>().also {
                      logger.error("Klarte ikkje å slette testgrunnlag: $it")
                    }
              }
            })
  }

  @GetMapping("/test-status/{kontrollId}")
  fun getTestStatus(
      @PathVariable kontrollId: Int,
  ): ResponseEntity<TestStatus> {
    val responseEntity =
        restTemplate.getForEntity(
            testingApiProperties.url + "/kontroller/test-status/$kontrollId",
            TestStatus::class.java)
    return ResponseEntity.status(responseEntity.statusCode).body(responseEntity.body)
  }

    @GetMapping("/testmetadata/{kontrollId}")
    fun getTestingMetadata(
        @PathVariable kontrollId: Int,
    ): ResponseEntity<KontrollTestingMetadata> {
      val responseEntity =
          restTemplate.getForEntity(
              testingApiProperties.url + "/kontroller/testmetadata/$kontrollId",
              KontrollTestingMetadata::class.java)
      return ResponseEntity.status(responseEntity.statusCode).body(responseEntity.body)
    }

  private fun okToDelete(resultat: List<ResultatManuellKontroll>): Boolean {
    return resultat.all { it.status == ResultatManuellKontroll.Status.IkkjePaabegynt }
  }

  private fun okToRetest(resultat: List<ResultatManuellKontroll>): Boolean {
    return resultat.all { it.status == ResultatManuellKontroll.Status.Ferdig }
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
}
