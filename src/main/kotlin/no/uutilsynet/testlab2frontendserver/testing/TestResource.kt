package no.uutilsynet.testlab2frontendserver.testing

import java.time.Instant
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.core.io.ByteArrayResource
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MimeTypeUtils
import org.springframework.util.MultiValueMap
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestTemplate
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("api/v1/testing")
class TestResource(val restTemplate: RestTemplate, testingApiProperties: TestingApiProperties) {
  val logger: Logger = LoggerFactory.getLogger(TestResource::class.java)

  val testresultUrl = "${testingApiProperties.url}/testresultat"
  val bildeUrl = "${testingApiProperties.url}/bilder"

  @GetMapping("{testgrunnlagId}")
  fun getResultatManuellKontroll(
      @PathVariable testgrunnlagId: Int
  ): ResponseEntity<List<ResultatManuellKontroll>> =
      runCatching {
            val testResults: TestresultatForKontroll? =
                restTemplate.getForObject(
                    "$testresultUrl?testgrunnlagId=$testgrunnlagId",
                    TestresultatForKontroll::class.java)
            if (testResults != null) {
              return ResponseEntity.ok(testResults.resultat)
            } else {
              throw IllegalArgumentException("Feil ved henting av testresultat")
            }
          }
          .getOrElse {
            logger.error("Kunne ikkje hente testresultat for testgrunnlag $testgrunnlagId")
            throw it
          }

  @PostMapping
  fun createTestResultat(
      @RequestBody createTestResultat: CreateTestResultat
  ): ResponseEntity<List<ResultatManuellKontroll>> =
      runCatching {
            logger.debug(
                "Lagrer nytt testresultat med loeysingId: ${createTestResultat.loeysingId}, testregelId: ${createTestResultat.testregelId}, sideutalId: ${createTestResultat.sideutvalId}")
            restTemplate.postForEntity(testresultUrl, createTestResultat, Int::class.java)
            getResultatManuellKontroll(createTestResultat.testgrunnlagId)
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
            val missingKommentar =
                resultatManuellKontrollList.any { resultatManuellKontroll ->
                  resultatManuellKontroll.elementOmtale == "Side" &&
                      resultatManuellKontroll.kommentar.isNullOrBlank()
                }
            if (missingKommentar) {
              throw IllegalArgumentException(
                  "Kan ikkje oppdatere test med elementOmtale 'Side' uten kommentar")
            }
            resultatManuellKontrollList.forEach { resultatManuellKontroll ->
              logger.debug(
                  "Lagrer nytt testresultat med loeysingId: {}, testregelId: {}, sideutvalId: {} + status: {}",
                  resultatManuellKontroll.loeysingId,
                  resultatManuellKontroll.testregelId,
                  resultatManuellKontroll.sideutvalId,
                  resultatManuellKontroll.status)
              val resultatCopy = resultatManuellKontroll.copy(testVartUtfoert = Instant.now())
              restTemplate.put("$testresultUrl/${resultatManuellKontroll.id}", resultatCopy)
            }

            getResultatManuellKontroll(resultatManuellKontrollList.first().testgrunnlagId)
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
            getResultatManuellKontroll(resultatManuellKontroll.testgrunnlagId)
          }
          .getOrElse {
            logger.error("Kunne ikkje slette testresultat", it)
            throw it
          }

  @PostMapping("/bilder", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
  fun createBilder(
      @RequestParam("bilde") bilde: MultipartFile,
      @RequestParam("resultatId") resultatId: Int,
      @RequestParam("includeBilder", required = false) includeBilder: Boolean = false,
  ): ResponseEntity<List<Bilde>> {

    val allowedMIMETypes =
        listOf(MimeTypeUtils.IMAGE_JPEG_VALUE, MimeTypeUtils.IMAGE_PNG_VALUE, "image/bmp")

    if (bilde.originalFilename == null || !allowedMIMETypes.contains(bilde.contentType)) {
      return ResponseEntity.badRequest().build()
    }

    val bilder = listOf(bilde)

    val body: MultiValueMap<String, Any> =
        LinkedMultiValueMap<String, Any>().apply {
          bilder.forEach { bilde ->
            add(
                "bilder",
                object : ByteArrayResource(bilde.bytes) {
                  override fun getFilename(): String = bilde.originalFilename?.lowercase()!!
                })
          }
        }

    val headers = HttpHeaders().apply { contentType = MediaType.MULTIPART_FORM_DATA }
    val requestEntity = HttpEntity<MultiValueMap<String, Any>>(body, headers)
    try {
      restTemplate.postForEntity("$bildeUrl/${resultatId}", requestEntity, String::class.java)
    } catch (e: Error) {
      return ResponseEntity.badRequest().build()
    }

    if (includeBilder) {
      return getBilder(resultatId)
    }
    return ResponseEntity.noContent().build()
  }

  @GetMapping("/bilder/{resultatId}")
  fun getBilder(
      @PathVariable("resultatId") resultatId: Int,
  ): ResponseEntity<List<Bilde>> =
      ResponseEntity.ok(restTemplate.getList<Bilde>("$bildeUrl/$resultatId"))

  @DeleteMapping("/bilder/{testresultatId}/{bildeId}")
  fun deleteBilde(
      @PathVariable testresultatId: Int,
      @PathVariable bildeId: Int
  ): ResponseEntity<List<Bilde>> =
      runCatching {
            restTemplate.delete("$bildeUrl/$testresultatId/$bildeId")
            return getBilder(testresultatId)
          }
          .getOrElse {
            logger.error("Kunne ikkje slette bilde", it)
            return ResponseEntity.internalServerError().build()
          }

  data class TestresultatForKontroll(val resultat: List<ResultatManuellKontroll>)
}
