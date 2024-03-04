package no.uutilsynet.testlab2frontendserver.testing

import java.time.Instant
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestTemplate

@RestController
@RequestMapping("api/v1/testing")
class TestResource(val restTemplate: RestTemplate, testingApiProperties: TestingApiProperties) {
  val logger: Logger = LoggerFactory.getLogger(TestResource::class.java)

  val testresultUrl = "${testingApiProperties.url}/testresultat"

  @GetMapping("{sakId}")
  fun getResultatManuellKontroll(
      @PathVariable sakId: Int
  ): ResponseEntity<List<ResultatManuellKontroll>> =
      runCatching {
            val testResults: ResultatForSak? =
                restTemplate.getForObject("$testresultUrl?sakId=$sakId", ResultatForSak::class.java)
            if (testResults != null) {
              return ResponseEntity.ok(testResults.resultat)
            } else {
              throw IllegalArgumentException("Feil ved henting av testresultat")
            }
          }
          .getOrElse {
            logger.error("Kunne ikkje hente testresultat for sak $sakId")
            throw it
          }

  @PostMapping
  fun createTestResultat(
      @RequestBody createTestResultat: CreateTestResultat
  ): ResponseEntity<List<ResultatManuellKontroll>> =
      runCatching {
            logger.debug(
                "Lagrer nytt testresultat med loeysingId: ${createTestResultat.loeysingId}, testregelId: ${createTestResultat.testregelId}, nettsideId: ${createTestResultat.nettsideId}")
            restTemplate.postForEntity(testresultUrl, createTestResultat, Int::class.java)
            getResultatManuellKontroll(createTestResultat.sakId)
          }
          .getOrElse {
            logger.error("Kunne ikkje opprette testresultat", it)
            throw it
          }

  @PutMapping
  fun updateResultatManuellKontroll(
      @RequestBody resultatManuellKontrollList: List<ResultatManuellKontroll>
  ): ResponseEntity<List<ResultatManuellKontroll>> =
      runCatching {
            resultatManuellKontrollList.forEach { resultatManuellKontroll ->
              logger.debug(
                  "Lagrer nytt testresultat med loeysingId: ${resultatManuellKontroll.loeysingId}, testregelId: ${resultatManuellKontroll.testregelId}, nettsideId: ${resultatManuellKontroll.nettsideId} + status: ${resultatManuellKontroll.status}")
                val resultatCopy = resultatManuellKontroll.copy(testVartUtfoert = Instant.now())
              restTemplate.put(
                  "$testresultUrl/${resultatManuellKontroll.id}", resultatCopy)
            }

            getResultatManuellKontroll(resultatManuellKontrollList.first().sakId)
          }
          .getOrElse {
            logger.error("Kunne ikkje oppdatere testresultat", it)
            throw it
          }

  @DeleteMapping
  fun deleteResultatManuellKontroll(
      @RequestBody resultatManuellKontroll: ResultatManuellKontroll
  ): ResponseEntity<List<ResultatManuellKontroll>> =
      runCatching {
            logger.debug("Sletter testresultat med id: ${resultatManuellKontroll.id}")
            restTemplate.delete("$testresultUrl/${resultatManuellKontroll.id}")
            getResultatManuellKontroll(resultatManuellKontroll.sakId)
          }
          .getOrElse {
            logger.error("Kunne ikkje slette testresultat", it)
            throw it
          }

  data class ResultatForSak(val resultat: List<ResultatManuellKontroll>)
}
