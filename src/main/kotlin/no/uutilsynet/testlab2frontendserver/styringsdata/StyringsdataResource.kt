package no.uutilsynet.testlab2frontendserver.styringsdata

import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.getForObject

@RestController
@RequestMapping("api/v1/styringsdata")
class StyringsdataResource(
    val restTemplate: RestTemplate,
    val testingApiProperties: TestingApiProperties,
) {
  private val logger: Logger = LoggerFactory.getLogger(StyringsdataResource::class.java)
  val styringsdataUrl = "${testingApiProperties.url}/styringsdata"

  @GetMapping
  fun findStyringsdataForKontroll(
      @RequestParam kontrollId: Int
  ): ResponseEntity<StyringsdataResult> =
      runCatching {
            val responseEntity =
                restTemplate.getForEntity(
                    "$styringsdataUrl?kontrollId=$kontrollId", StyringsdataResult::class.java)
            return ResponseEntity.status(responseEntity.statusCode).body(responseEntity.body)
          }
          .getOrElse {
            logger.error("Hent styringsdata feila", it)
            throw RuntimeException(it)
          }

  @GetMapping("{stryingsdataType}/{styringsdataId}")
  fun getStyringsdata(
      @PathVariable("stryingsdataType") styringsdataType: StyringsdataType,
      @PathVariable("styringsdataId") styringsdataId: Int,
  ): ResponseEntity<Styringsdata?> {
    return runCatching {
          restTemplate.getForEntity(
              "$styringsdataUrl/${styringsdataType.name}/$styringsdataId", Styringsdata::class.java)
        }
        .fold(
            { responseEntity ->
              ResponseEntity.status(responseEntity.statusCode).body(responseEntity.body)
            },
            { exception ->
              logger.error("Kunne ikkje hente styringsdata", exception)
              when (exception) {
                is HttpClientErrorException -> {
                  if (exception.statusCode == HttpStatus.NOT_FOUND) {
                    ResponseEntity.notFound().build<Styringsdata?>()
                  } else {
                    ResponseEntity.status(exception.statusCode).build<Styringsdata?>()
                  }
                }
                else ->
                    ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build<Styringsdata?>()
              }
            })
  }

  @PostMapping
  fun createStyringsdata(@RequestBody styringsdata: Styringsdata): ResponseEntity<Styringsdata> =
      runCatching {
            val styringsdataResult =
                restTemplate
                    .getForEntity(
                        "$styringsdataUrl?kontrollId=${styringsdata.kontrollId}",
                        StyringsdataResult::class.java)
                    .body

            val validated = validateStyringsdata(styringsdata, styringsdataResult)

            val location =
                restTemplate.postForLocation(styringsdataUrl, validated)
                    ?: throw IllegalStateException("Vi fikk ikkje location fra $styringsdataUrl")
            ResponseEntity.ok(restTemplate.getForObject<Styringsdata>(location))
          }
          .getOrElse {
            if (it is IllegalArgumentException) {
              return ResponseEntity.badRequest().build()
            }

            logger.error("Oppretting av styringsdata feilet", it)
            return ResponseEntity.internalServerError().build()
          }

  @PutMapping("{styringsdataId}")
  fun updateStyringsdataForLoeysing(
      @PathVariable("styringsdataId") styringsdataId: Int,
      @RequestBody styringsdata: Styringsdata
  ) =
      runCatching {
            val styringsdataType =
                if (styringsdata is Styringsdata.Loeysing) StyringsdataType.loeysing
                else StyringsdataType.kontroll

            restTemplate.put(
                "$styringsdataUrl/${styringsdataType.name}/$styringsdataId", styringsdata)
            getStyringsdata(styringsdataType, styringsdataId)
          }
          .getOrElse {
            logger.error("Endring av styringsdata feila", it)
            throw RuntimeException(it)
          }
}

data class StyringsdataResult(
    val styringsdataKontrollId: Int?,
    val styringsdataLoeysing: List<StyringsdataListElement> = emptyList()
)

private fun validateStyringsdata(
    styringsdata: Styringsdata,
    styringsdataResult: StyringsdataResult?
): Styringsdata {
  val duplicate =
      when (styringsdata) {
        is Styringsdata.Loeysing -> {
          styringsdataResult?.styringsdataLoeysing?.any {
            it.loeysingId == styringsdata.loeysingId
          } == true
        }
        is Styringsdata.Kontroll -> {
          styringsdataResult?.styringsdataKontrollId != null
        }
        else -> true
      }

  if (duplicate) {
    throw IllegalArgumentException(
        "Styringsdata for kontroll ${styringsdata.kontrollId} finnes allereie")
  }

  return styringsdata
}
