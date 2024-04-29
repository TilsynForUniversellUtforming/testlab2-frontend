package no.uutilsynet.testlab2frontendserver.verksemd

import no.uutilsynet.testlab2frontendserver.common.LoeysingsregisterApiProperties
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestTemplate

@RestController
@RequestMapping("api/v1/verksemd")
class VerksemdResource(
    val restTemplate: RestTemplate,
    loeysingsregisterApiProperties: LoeysingsregisterApiProperties
) {

  val verksemdUrl = "${loeysingsregisterApiProperties.url}/v1/verksemd"
  val logger: Logger = LoggerFactory.getLogger(VerksemdResource::class.java)

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
