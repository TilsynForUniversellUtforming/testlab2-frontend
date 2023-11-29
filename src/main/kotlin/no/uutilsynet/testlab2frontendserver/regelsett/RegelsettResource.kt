package no.uutilsynet.testlab2frontendserver.regelsett

import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.maalinger.dto.IdList
import no.uutilsynet.testlab2frontendserver.regelsett.dto.Regelsett
import no.uutilsynet.testlab2frontendserver.regelsett.dto.RegelsettBase
import no.uutilsynet.testlab2frontendserver.regelsett.dto.RegelsettCreate
import no.uutilsynet.testlab2frontendserver.regelsett.dto.RegelsettEdit
import org.slf4j.LoggerFactory
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
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

@RestController
@RequestMapping("api/v1/regelsett", produces = [MediaType.APPLICATION_JSON_VALUE])
class RegelsettResource(
    val restTemplate: RestTemplate,
    testingApiProperties: TestingApiProperties,
) {

  val logger = LoggerFactory.getLogger(RegelsettResource::class.java)

  val regelsettUrl = "${testingApiProperties.url}/v1/regelsett"

  @PostMapping
  fun createRegelsett(@RequestBody regelsett: RegelsettCreate): List<RegelsettBase> =
      runCatching {
            logger.debug("Lagrer nytt regelsett med namn: ${regelsett.namn} fra $regelsettUrl")
            restTemplate.postForEntity(regelsettUrl, regelsett, Int::class.java)
            listRegelsett(true)
          }
          .getOrElse {
            logger.error("Klarte ikkje å lage regelsett", it)
            throw it
          }

  @GetMapping
  fun listRegelsett(
      @RequestParam(required = false, defaultValue = "false") includeTestreglar: Boolean = false,
      @RequestParam(required = false, defaultValue = "false") includeInactive: Boolean = false,
  ): List<RegelsettBase> =
      runCatching {
            if (includeTestreglar) {
              restTemplate.getList<Regelsett>(
                  "$regelsettUrl?includeInactive=${includeInactive}&includeTestreglar=${includeTestreglar}")
            } else {
              restTemplate.getList<RegelsettBase>(
                  "$regelsettUrl?includeInactive=${includeInactive}")
            }
          }
          .getOrElse {
            logger.error("klarte ikke å hente målingar", it)
            throw it
          }

  @GetMapping("testreglar")
  fun listRegelsettWithTestreglar(
      @RequestParam(required = false, defaultValue = "false") includeInactive: Boolean
  ): List<Regelsett> =
      runCatching {
            restTemplate.getList<Regelsett>(
                "$regelsettUrl/testreglar?includeInactive=${includeInactive}")
          }
          .getOrElse {
            logger.error("klarte ikke å hente målingar", it)
            throw it
          }

  @GetMapping("{id}")
  fun getRegelsett(@PathVariable id: Int): ResponseEntity<Regelsett> {
    logger.debug("hentar regelsett med id: $id fra $regelsettUrl")

    val regelsett = restTemplate.getForObject("$regelsettUrl/$id", Regelsett::class.java)

    if (regelsett == null) {
      logger.error("Kunne ikkje hente regelsett med id $id frå server")
      throw RuntimeException("Klarte ikkje å hente regelsett")
    }

    return ResponseEntity.ok(regelsett)
  }

  @PutMapping
  fun updateRegelsett(@RequestBody regelsett: RegelsettEdit): List<RegelsettBase> =
      runCatching {
            logger.debug("Oppdaterer regelsett id: ${regelsett.id} fra $regelsettUrl")
            restTemplate.put(regelsettUrl, regelsett, Unit::class.java)
            listRegelsett(true)
          }
          .getOrElse {
            logger.error("Kunne ikkje oppdatere regelsett med id ${regelsett.id}")
            throw it
          }

  @DeleteMapping
  fun deleteRegelsett(@RequestBody idList: IdList): ResponseEntity<out Any> {
    for (id in idList.idList) {
      runCatching { restTemplate.delete("$regelsettUrl/$id") }
          .getOrElse { logger.error("Kunne ikkje deaktivere regelsett med id $id") }
    }
    return ResponseEntity.ok().body(listRegelsett(true))
  }
}
