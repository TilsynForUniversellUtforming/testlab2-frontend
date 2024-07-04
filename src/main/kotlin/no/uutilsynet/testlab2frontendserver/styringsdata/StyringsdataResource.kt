package no.uutilsynet.testlab2frontendserver.styringsdata

import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
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
    testingApiProperties: TestingApiProperties,
) {
  private val logger: Logger = LoggerFactory.getLogger(StyringsdataResource::class.java)
  val styringsdataUrl = "${testingApiProperties.url}/styringsdata"

  @GetMapping
  fun getStyringsdata(@RequestParam("kontrollId") kontrollId: Int): List<StyringsdataListElement> =
      runCatching {
            restTemplate.getList<StyringsdataListElement>("$styringsdataUrl?kontrollId=$kontrollId")
          }
          .getOrElse {
            logger.error("Hent styringsdata feila", it)
            throw RuntimeException(it)
          }

  @GetMapping("{styringsdataId}")
  fun getStyringsdataForLoeysing(
      @PathVariable("styringsdataId") styringsdataId: Int,
  ): ResponseEntity<Styringsdata?> {
    return runCatching {
          restTemplate.getForEntity("$styringsdataUrl/$styringsdataId", Styringsdata::class.java)
        }
        .fold(
            { responseEntity ->
              ResponseEntity.status(responseEntity.statusCode).body(responseEntity.body)
            },
            { exception ->
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
  fun createStyringsdataForLoeysing(@RequestBody styringsdata: Styringsdata): Styringsdata =
      runCatching {
            val location =
                restTemplate.postForLocation(styringsdataUrl, styringsdata)
                    ?: throw IllegalStateException("Vi fikk ikkje location fra $styringsdataUrl")
            restTemplate.getForObject<Styringsdata>(location)
          }
          .getOrElse {
            logger.error("Oppretting av kontroll feilet", it)
            throw RuntimeException(it)
          }

  @PutMapping("{styringsdataId}")
  fun updateStyringsdataForLoeysing(
      @PathVariable("styringsdataId") styringsdataId: Int,
      @RequestBody styringsdata: Styringsdata
  ) = runCatching { restTemplate.put("$styringsdataUrl/$styringsdataId", styringsdata) }
}
