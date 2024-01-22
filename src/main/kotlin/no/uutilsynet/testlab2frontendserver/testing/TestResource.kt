package no.uutilsynet.testlab2frontendserver.testing

import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
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
      @RequestBody resultatManuellKontroll: ResultatManuellKontroll
  ): ResponseEntity<List<ResultatManuellKontroll>> =
      runCatching {
            logger.debug(
                "Lagrer nytt testresultat med loeysingId: ${resultatManuellKontroll.loeysingId}, testregelId: ${resultatManuellKontroll.testregelId}, nettsideId: ${resultatManuellKontroll.nettsideId}")
            restTemplate.put(
                "$testresultUrl/${resultatManuellKontroll.id}", resultatManuellKontroll)
            getResultatManuellKontroll(resultatManuellKontroll.sakId)
          }
          .getOrElse {
            logger.error("Kunne ikkje oppdatere testresultat", it)
            throw it
          }

  data class ResultatForSak(val resultat: List<ResultatManuellKontroll>)
}
