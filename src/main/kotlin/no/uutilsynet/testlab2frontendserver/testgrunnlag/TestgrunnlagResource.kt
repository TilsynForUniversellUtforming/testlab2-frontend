package no.uutilsynet.testlab2frontendserver.testgrunnlag

import java.time.Instant
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.kontroll.Sideutval
import no.uutilsynet.testlab2frontendserver.resultat.TestgrunnlagType
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelDTO
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestTemplate

@RequestMapping("api/v2/testgrunnlag")
@RestController
class TestgrunnlagResource(
    val restTemplate: RestTemplate,
    testingApiProperties: TestingApiProperties,
) {

  val logger = LoggerFactory.getLogger(TestgrunnlagResource::class.java)
  val testgrunnlagKontrollUrl = "${testingApiProperties.url}/testgrunnlag/kontroll"

  data class TestgrunnlagKontrollDTO(
      val id: Int,
      val kontrollId: Int,
      val namn: String,
      val testreglar: List<TestregelDTO> = emptyList(),
      val sideutval: List<Sideutval> = emptyList(),
      val type: TestgrunnlagType,
      val datoOppretta: Instant
  )

  @GetMapping("list/{kontrollId}")
  fun listTestgrunnlagForKontroll(
      @PathVariable kontrollId: Int
  ): ResponseEntity<List<TestgrunnlagListElement>> =
      runCatching {
            ResponseEntity.ok(
                restTemplate
                    .getList<TestgrunnlagKontrollDTO>("$testgrunnlagKontrollUrl/list/$kontrollId")
                    .map { it.toTestgrunnlagListElement() }
                    .flatten())
          }
          .getOrElse {
            logger.error("Kunne ikkje hente testgrunnlag", it)
            throw it
          }

  fun TestgrunnlagKontrollDTO.toTestgrunnlagListElement(): List<TestgrunnlagListElement> =
      sideutval.map { sideutval -> TestgrunnlagListElement(id, sideutval.loeysingId) }
}
