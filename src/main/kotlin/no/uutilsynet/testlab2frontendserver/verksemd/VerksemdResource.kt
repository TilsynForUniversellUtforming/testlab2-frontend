package no.uutilsynet.testlab2frontendserver.verksemd

import no.uutilsynet.testlab2frontendserver.common.LoeysingsregisterApiProperties
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import org.slf4j.Logger
import org.slf4j.LoggerFactory
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
@RequestMapping("api/v1/verksemd")
class VerksemdResource(
    val restTemplate: RestTemplate,
    loeysingsregisterApiProperties: LoeysingsregisterApiProperties
) {

  val verksemdUrl = "${loeysingsregisterApiProperties.url}/v1/verksemd"
  val logger: Logger = LoggerFactory.getLogger(VerksemdResource::class.java)

  @GetMapping("list")
  fun findVerksemder(
      @RequestParam("name", required = false) namn: String?,
      @RequestParam("orgnummer", required = false) orgnummer: String?
  ): ResponseEntity<Any> {
    if (namn != null && orgnummer != null) {
      return ResponseEntity.badRequest().body("Må søke med enten namn eller orgnummer")
    }
    return try {
      if (namn != null) {
        ResponseEntity.ok(restTemplate.getList<Verksemd>("$verksemdUrl/list?search=$namn"))
      } else if (orgnummer != null) {
        ResponseEntity.ok(restTemplate.getList<Verksemd>("$verksemdUrl/list?search=$orgnummer"))
      } else {
        ResponseEntity.ok(getVerksemder())
      }
    } catch (e: Error) {
      logger.error("Klarte ikkje å hente verksemder", e)
      return ResponseEntity.internalServerError().body("Klarte ikkje å hente verksemder")
    }
  }

  @GetMapping
  fun getVerksemder(
      @RequestParam("idList", required = false) idList: List<Int>? = null
  ): List<Verksemd> {
    val verksemdList = restTemplate.getList<Verksemd>(verksemdUrl)
    if (idList != null) {
      return verksemdList.filter { v -> idList.contains(v.id) }
    }
    return verksemdList
  }

  @GetMapping("/{id}")
  fun getVerksemd(@PathVariable id: Int): ResponseEntity<out Any> {
    val verksemd = restTemplate.getForObject("$verksemdUrl/$id", Verksemd::class.java)
    return if (verksemd != null) ResponseEntity.ok(verksemd) else ResponseEntity.notFound().build()
  }

  @PutMapping
  fun updateVerksemd(@RequestBody verksemd: Verksemd): ResponseEntity<out Any> {
    return runCatching {
          restTemplate.put(verksemdUrl + "/${verksemd.id}", verksemd)
          ResponseEntity.ok(getVerksemder())
        }
        .getOrElse {
          logger.error("Klarte ikkje å oppdatere verksemd", it)
          ResponseEntity.internalServerError().body(it.message)
        }
  }

  @DeleteMapping
  fun deleteVerksemd(@RequestBody id: Int): ResponseEntity<out Any> {
    return runCatching {
          restTemplate.delete(verksemdUrl + "/${id}")
          ResponseEntity.ok(getVerksemder())
        }
        .getOrElse {
          logger.error("Klarte ikkje å slette verksemd", it)
          ResponseEntity.internalServerError().body(it.message)
        }
  }

  @PostMapping
  fun createVerksemd(@RequestBody verksemdInit: NyVerksemdBase): ResponseEntity<out Any> {
    return runCatching {
          val nyVerksemd =
              restTemplate.postForObject(verksemdUrl, verksemdInit, Verksemd::class.java)
          ResponseEntity.ok(nyVerksemd)
        }
        .getOrElse {
          logger.error("Klarte ikkje å opprette verksemd")
          ResponseEntity.internalServerError().body(it.message)
        }
  }
}

data class NyVerksemdBase(val organisasjonsnummer: String)
