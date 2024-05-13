package no.uutilsynet.testlab2frontendserver.testgrunnlag

import java.time.Instant
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.kontroll.KontrollResource
import no.uutilsynet.testlab2frontendserver.kontroll.Sideutval
import no.uutilsynet.testlab2frontendserver.krav.KravApiProperties
import no.uutilsynet.testlab2frontendserver.krav.dto.Krav
import no.uutilsynet.testlab2frontendserver.sak.NettsideDTO
import no.uutilsynet.testlab2frontendserver.sak.SakDTO
import no.uutilsynet.testlab2frontendserver.testreglar.dto.InnhaldstypeTesting
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Tema
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testobjekt
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelBaseDTO
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelDTO
import no.uutilsynet.testlab2frontendserver.testreglar.dto.toTestregelList
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestTemplate

@RequestMapping("api/v2/testgrunnlag")
@RestController
class TestgrunnlagResourceKontroll(
    val restTemplate: RestTemplate,
    testingApiProperties: TestingApiProperties,
    kravApiProperties: KravApiProperties
) {

  val logger = LoggerFactory.getLogger(TestgrunnlagResourceKontroll::class.java)
  val kontrollUrl = "${testingApiProperties.url}/kontroller/sideutvaltype"
  val testgrunnlagKontrollUrl = "${testingApiProperties.url}/testgrunnlag/kontroll"
  val testregelUrl = "${testingApiProperties.url}/v1/testreglar"
  val kravUrl = "${kravApiProperties.url}/v1/krav"

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

  @GetMapping("/{kontrollId}")
  fun getManueltTestgrunnlag(@PathVariable kontrollId: Int): ResponseEntity<Testgrunnlag> {
    runCatching {
          logger.debug("Henter testgrunnlag fra $testgrunnlagKontrollUrl/$kontrollId")

          val testregelList =
              restTemplate.getList<TestregelBaseDTO>("$testregelUrl?includeMetadata=true")
          val sidetypeList =
              restTemplate.getList<KontrollResource.SideutvalType>("$kontrollUrl/sideutvaltype")

          val testgrunnlagDTO =
              restTemplate.getForObject(
                  "$testgrunnlagKontrollUrl/$kontrollId", TestgrunnlagKontrollDTO::class.java)

          val kravList = restTemplate.getList<Krav>("$kravUrl/wcag2krav")
          val temaList = restTemplate.getList<Tema>("$testregelUrl/temaForTestreglar")
          val testobjektList =
              restTemplate.getList<Testobjekt>("$testregelUrl/testobjektForTestreglar")
          val innhaldstypeForTestingList =
              restTemplate.getList<InnhaldstypeTesting>("$testregelUrl/innhaldstypeForTesting")

          if (testgrunnlagDTO != null) {
            val testregelIdList = testgrunnlagDTO.testreglar.map { it.id }

            val testreglar =
                testregelList
                    .filterIsInstance<TestregelDTO>()
                    .filter { tr -> testregelIdList.contains(tr.id) }
                    .toTestregelList(temaList, testobjektList, innhaldstypeForTestingList, kravList)

            val loeysingList =
                testgrunnlagDTO.sideutval
                    .groupBy { it.loeysingId }
                    .map { (loeysingId, sideutvals) ->
                      SakDTO.SakLoeysingDTO(
                          loeysingId = loeysingId,
                          nettsider =
                              sideutvals.map { sideutval ->
                                NettsideDTO(
                                    type =
                                        if (!sideutval.egendefinertType.isNullOrEmpty())
                                            sideutval.egendefinertType
                                        else
                                            sidetypeList.find { it.id == sideutval.typeId }?.type
                                                ?: "",
                                    url = sideutval.url.toString(),
                                    beskrivelse = "",
                                    begrunnelse = sideutval.begrunnelse,
                                    id = sideutval.id)
                              })
                    }

            val testgrunnlag =
                Testgrunnlag(
                    testgrunnlagDTO.id,
                    testgrunnlagDTO.kontrollId,
                    testgrunnlagDTO.namn,
                    testreglar,
                    loeysingList,
                    TestgrunnlagType.OPPRINNELEG_TEST)
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

  fun TestgrunnlagKontrollDTO.toTestgrunnlagListElement(): List<TestgrunnlagListElement> {
    return sideutval.map { sideutval -> TestgrunnlagListElement(id, sideutval.loeysingId) }
  }
}
