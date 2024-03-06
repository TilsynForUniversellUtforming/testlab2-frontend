package no.uutilsynet.testlab2frontendserver.testgrunnlag

import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.krav.KravApiProperties
import no.uutilsynet.testlab2frontendserver.krav.dto.Krav
import no.uutilsynet.testlab2frontendserver.sak.NettsideDTO
import no.uutilsynet.testlab2frontendserver.sak.SakDTO
import no.uutilsynet.testlab2frontendserver.testreglar.dto.InnhaldstypeTesting
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Tema
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testobjekt
import no.uutilsynet.testlab2frontendserver.testreglar.dto.toTestregel
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestTemplate

@RequestMapping("api/v1/testgrunnlag")
@RestController
class TestgrunnlagResource(
    val restTemplate: RestTemplate,
    testingApiProperties: TestingApiProperties,
    kravApiProperties: KravApiProperties
) {

  val logger = LoggerFactory.getLogger(TestgrunnlagResource::class.java)
  val testgrunnlagUrl = testingApiProperties.url + "/testgrunnlag"
  val testregelUrl = "${testingApiProperties.url}/v1/testreglar"
  val kravUrl = "${kravApiProperties.url}/v1/krav"

  @PostMapping
  fun createManueltTestgrunnlag(
      @RequestBody testgrunnlag: CreateTestgrunnlag
  ): ResponseEntity<Testgrunnlag> {

    runCatching {
          val nyttTestgrunnlag = createTestgrunnlag(testgrunnlag)

          val location = restTemplate.postForLocation(testgrunnlagUrl, nyttTestgrunnlag)
          val id = location?.path?.substringAfterLast("/")
          if (location != null && id != null) {
            return getManueltTestgrunnlag(id.toInt())
          } else {
            throw RuntimeException("Kunne ikkje opprette testgrunnlag")
          }
        }
        .getOrElse {
          logger.error("Feil ved oppretting av testgrunnlag", it)
          throw it
        }
  }

  private fun createTestgrunnlag(testgrunnlag: CreateTestgrunnlag): CreateTestgrunnlag {
    val nyttTestgrunnlag =
        testgrunnlag.copy(
            loeysing =
                SakDTO.SakLoeysingDTO(
                    testgrunnlag.loeysingNettsideRelation.loeysing.id,
                    testgrunnlag.loeysingNettsideRelation.properties.map {
                      NettsideDTO(it.type, it.url, it.description ?: "", it.reason, it.id)
                    }))
    return nyttTestgrunnlag
  }

  @GetMapping("/{id}")
  fun getManueltTestgrunnlag(@PathVariable id: Int): ResponseEntity<Testgrunnlag> {
    runCatching {
          logger.debug("Henter testgrunnlag fra $testgrunnlagUrl/$id")

          val temaList = restTemplate.getList<Tema>("$testregelUrl/temaForTestreglar")
          val testobjektList =
              restTemplate.getList<Testobjekt>("$testregelUrl/testobjektForTestreglar")
          val innhaldstypeForTestingList =
              restTemplate.getList<InnhaldstypeTesting>("$testregelUrl/innhaldstypeForTesting")
          val krav = restTemplate.getList<Krav>("$kravUrl/wcag2krav")

          val testgrunnlagDTO =
              restTemplate.getForObject("$testgrunnlagUrl/$id", TestgrunnlagDTO::class.java)
          if (testgrunnlagDTO != null) {
            val testreglar =
                testgrunnlagDTO.testreglar.map {
                  it.toTestregel(
                      temaList,
                      testobjektList,
                      innhaldstypeForTestingList,
                      krav.find { krav -> krav.id == it.kravId }
                          ?: throw RuntimeException("Testregel har krav som ikkje finns"))
                }
            val testgrunnlag =
                Testgrunnlag(
                    testgrunnlagDTO.id,
                    testgrunnlagDTO.parentId,
                    testgrunnlagDTO.namn,
                    testreglar,
                    testgrunnlagDTO.loeysing,
                    testgrunnlagDTO.type)
            return ResponseEntity.ok(testgrunnlag)
          } else {
            throw IllegalArgumentException("Feil ved henting av testgrunnlag")
          }
        }
        .getOrElse {
          logger.error("Kunne ikkje hente testgrunnlag", it)
          throw it
        }
  }
}
