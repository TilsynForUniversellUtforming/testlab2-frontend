package no.uutilsynet.testlab2frontendserver.verksemd

import no.uutilsynet.testlab2frontendserver.common.LoeysingsregisterApiProperties
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.getForObject

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

  @GetMapping("{id}")
  fun getVerksemd(@PathVariable id: Int): ResponseEntity<Verksemd> =
      try {
        val url = "$verksemdUrl/$id"
        val verksemd: Verksemd = restTemplate.getForObject(url)
        ResponseEntity.ok(verksemd)
      } catch (e: Error) {
        logger.error("Klarte ikkje å hente verksemd med id $id", e)
        throw RuntimeException("Klarte ikkje å hente verksemd")
      }

  @GetMapping
  fun getVerksemder(): List<Verksemd> {
    return restTemplate.getList(verksemdUrl)
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
