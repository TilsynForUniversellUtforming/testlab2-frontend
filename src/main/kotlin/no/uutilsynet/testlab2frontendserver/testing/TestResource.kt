package no.uutilsynet.testlab2frontendserver.testing

import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.core.io.ByteArrayResource
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.util.LinkedMultiValueMap
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
import org.springframework.web.client.getForObject
import org.springframework.web.multipart.MultipartFile

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
            logger.debug("Payload " + resultatManuellKontrollList.toString())

            resultatManuellKontrollList.forEach { resultatManuellKontroll ->
              logger.debug(
                  "Lagrer nytt testresultat med loeysingId: ${resultatManuellKontroll.loeysingId}, testregelId: ${resultatManuellKontroll.testregelId}, nettsideId: ${resultatManuellKontroll.nettsideId} + status: ${resultatManuellKontroll.status}")
              restTemplate.put(
                  "$testresultUrl/${resultatManuellKontroll.id}", resultatManuellKontroll)
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

  @PostMapping("/bilder", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
  fun createBilder(
      @RequestParam("bilde") bilde: MultipartFile,
      @RequestParam("resultatId") resultatId: String,
  ): ResponseEntity<Any> {

    val fileExtension = bilde.originalFilename?.substringAfterLast('.', "") ?: ""

    if (!allowedMIMETypes.contains(fileExtension)) {
      return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
          .body("Kun ${allowedMIMETypes.joinToString(",")} er lovelge typar")
    }

    // TODO - Hent indeks på bilde
    val bilder = listOf(bilde)

    val body: MultiValueMap<String, Any> =
        LinkedMultiValueMap<String, Any>().apply {
          bilder.forEach { image ->
            add(
                "bilder",
                object : ByteArrayResource(image.bytes) {
                  override fun getFilename(): String = "${resultatId}_${0}.$fileExtension"
                })
          }
        }

    val headers = HttpHeaders().apply { contentType = MediaType.MULTIPART_FORM_DATA }
    val requestEntity = HttpEntity<MultiValueMap<String, Any>>(body, headers)

    restTemplate.postForEntity(
        "$testresultUrl/bilder/${resultatId}", requestEntity, String::class.java)

    return ResponseEntity.noContent().build()
  }

  @GetMapping("/bilder/{resultatId}")
  fun getBilder(
      @PathVariable("resultatId") resultatId: Int,
      @RequestParam(required = false) thumbnail: Boolean?
  ): ResponseEntity<ByteArray> {
    val img =
        restTemplate.getForObject<ByteArray>(
            "$testresultUrl/bilder/$resultatId?thumbnail=${thumbnail ?: false}")
    return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(img)
  }

  data class ResultatForSak(val resultat: List<ResultatManuellKontroll>)

  val allowedMIMETypes = listOf("jpg", "jpeg", "png", "bmp")
}
