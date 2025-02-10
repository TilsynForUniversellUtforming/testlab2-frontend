package no.uutilsynet.testlab2frontendserver.resultat

import java.net.URI
import java.time.LocalDate
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.maalinger.dto.aggregation.AggegatedTestresultTestregel
import no.uutilsynet.testlab2frontendserver.maalinger.dto.testresultat.TestResultat
import no.uutilsynet.testlab2frontendserver.testing.Bilde
import org.slf4j.LoggerFactory
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.UriComponentsBuilder

@RestController
@RequestMapping("api/v1/testresultat")
class ResultatResource(
    val restTemplate: RestTemplate,
    val testingApiProperties: TestingApiProperties
) {

  val logger = LoggerFactory.getLogger(ResultatResource::class.java)

  val testresultatUrl = "${testingApiProperties.url}/resultat"

  @GetMapping("aggregert/{testgrunnlagId}")
  fun getTestresultatAggregert(
      @PathVariable testgrunnlagId: Int
  ): List<AggegatedTestresultTestregel> {
    logger.debug("henter aggregering frå sak/maaling med id: $testgrunnlagId")
    return restTemplate
        .getList<AggegatedTestresultTestregel>("$testresultatUrl/aggregert/$testgrunnlagId")
        .map {
          it.copy(compliancePercent = toPercentage(it.testregelGjennomsnittlegSideSamsvarProsent))
        }
  }

  fun toPercentage(value: Float?): Int? {
    return value?.times(100)?.toInt()
  }

  @PostMapping("aggregert/{testgrunnlagId}")
  fun createTestresultatAggregert(@PathVariable testgrunnlagId: Int): ResponseEntity<Any> {
    logger.debug("genererar aggregering frå sak/maaling med id: $testgrunnlagId")
    return runCatching {
          val location =
              restTemplate.postForLocation(
                  "$testresultatUrl/aggregert/$testgrunnlagId", testgrunnlagId)
                  ?: throw RuntimeException(
                      "Feil ved oppretting av aggregert resultat for testgrunnlagId: $testgrunnlagId")
          return ResponseEntity.created(
                  URI.create("/api/v1/testresultat/aggregert/${testgrunnlagId}"))
              .body(location)
        }
        .getOrElse {
          logger.error(it.message)
          ResponseEntity.internalServerError().body(it.message)
        }
  }

  @GetMapping("list", produces = [MediaType.APPLICATION_JSON_VALUE])
  fun getListTest(): ResponseEntity<List<Resultat>> {
    val resultat = restTemplate.getList<Resultat>("$testresultatUrl/list")

    return ResponseEntity.ok(resultat)
  }

  @GetMapping("kontroll/{idKontroll}")
  fun getResultatKontroll(@PathVariable idKontroll: Int): ResponseEntity<List<Resultat>> {
    val resultatListElement =
        restTemplate.getList<Resultat>("$testresultatUrl/kontroll/$idKontroll")
    return ResponseEntity.ok(resultatListElement)
  }

  @GetMapping("kontroll/{idKontroll}/loeysing/{idLoeysing}")
  fun getResultatKontrollLoeysing(
      @PathVariable idKontroll: Int,
      @PathVariable idLoeysing: Int
  ): ResponseEntity<List<ResultatOversiktLoeysing>> {
    val resultatListElement =
        restTemplate.getList<ResultatOversiktLoeysing>(
            "$testresultatUrl/kontroll/$idKontroll/loeysing/$idLoeysing")
    return ResponseEntity.ok(resultatListElement)
  }

  @GetMapping("kontroll/{idKontroll}/loeysing/{idLoeysing}/krav/{kravId}")
  fun getDetaljertResultat(
      @PathVariable idKontroll: Int,
      @PathVariable idLoeysing: Int,
      @PathVariable kravId: Int,
  ): List<TestResultat> {
    logger.debug("Hent resultat for kontrolkId: $idLoeysing, loeysingId: $idLoeysing")
    return restTemplate
        .getList<TestResultat>(
            "$testresultatUrl/kontroll/${idKontroll}/loeysing/${idLoeysing}/krav/${kravId}")
        .map { mapBilder(it) }
  }

  @GetMapping("tema")
  fun getResultatPrTema(
      @RequestParam kontrollId: Int?,
      @RequestParam kontrollType: String?,
      @RequestParam fraDato: LocalDate?,
      @RequestParam tilDato: LocalDate?
  ): List<ResultatTema> {
    val uriComponents = uriComponentsResultat("/tema", kontrollId, kontrollType, fraDato, tilDato)

    return restTemplate.getList<ResultatTema>(uriComponents.build().toUriString())
  }

  @GetMapping("krav")
  fun getResultatPrKrav(
      @RequestParam kontrollId: Int?,
      @RequestParam kontrollType: String?,
      @RequestParam fraDato: LocalDate?,
      @RequestParam tilDato: LocalDate?
  ): List<ResultatKrav> {
    val uriComponents = uriComponentsResultat("/krav", kontrollId, kontrollType, fraDato, tilDato)

    return restTemplate.getList<ResultatKrav>(uriComponents.build().toUriString())
  }

  private fun uriComponentsResultat(
      url: String,
      kontrollId: Int?,
      kontrollType: String?,
      fraDato: LocalDate?,
      tilDato: LocalDate?
  ): UriComponentsBuilder {
    val uriComponents = UriComponentsBuilder.fromUriString(testresultatUrl)
    uriComponents.path(url)
    kontrollId?.let { uriComponents.queryParam("kontrollId", it) }
    kontrollType?.let { uriComponents.queryParam("kontrollType", it) }
    fraDato?.let { uriComponents.queryParam("fraDato", it) }
    tilDato?.let { uriComponents.queryParam("tilDato", it) }
    uriComponents.build().toUriString()
    return uriComponents
  }

  private fun mapBilder(testresultat: TestResultat): TestResultat {
    val nyeBilder = testresultat.bilder?.map { proxyUrl(it) }
    return testresultat.copy(bilder = nyeBilder)
  }

  private fun proxyUrl(bilde: Bilde): Bilde {
    return bilde.copy(
        bildeURI = extreactUri(bilde.bildeURI), thumbnailURI = extreactUri(bilde.thumbnailURI))
  }

  fun extreactUri(uri: URI): URI {
    val uriParts = uri.toString().split("/")
    val imageName = uriParts.takeLast(1).joinToString { it }

    return URI("/api/bilder/$imageName")
  }
}
