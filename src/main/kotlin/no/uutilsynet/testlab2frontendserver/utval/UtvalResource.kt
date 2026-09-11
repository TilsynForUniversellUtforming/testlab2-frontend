package no.uutilsynet.testlab2frontendserver.utval

import java.net.URI
import java.time.Instant
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.maalinger.dto.Loeysing
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
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.RestTemplate

@RestController
@RequestMapping("api/v1/utval")
class UtvalResource(
    val restTemplate: RestTemplate,
    val testingApiProperties: TestingApiProperties
) {
  private val logger: Logger = LoggerFactory.getLogger(UtvalResource::class.java)

  @GetMapping
  fun getUtvalList(): List<UtvalListItem> {
    val url = "${testingApiProperties.url}/v1/utval"
    return restTemplate.getList(url)
  }

  @GetMapping("/{id}")
  fun getUtval(@PathVariable id: Int): ResponseEntity<Utval> =
      fetchUtval(id)
          .map { ResponseEntity.ok(it) }
          .getOrElse {
            when (it) {
              is HttpClientErrorException.NotFound -> ResponseEntity.notFound().build()
              else -> {
                logger.error("Klarte ikkje å hente utval med id $id", it)
                ResponseEntity.internalServerError().build()
              }
            }
          }

    @DeleteMapping("/{id}")
    fun deleteUtval(@PathVariable id: Int): ResponseEntity<Void> {
        val url = "${testingApiProperties.url}/v1/utval/$id"
        return try {
            restTemplate.delete(url)
            ResponseEntity.noContent().build()
        } catch (e: HttpClientErrorException.NotFound) {
            logger.error("Klarte ikkje å slette utval med id $id: ${e.message}")
            ResponseEntity.notFound().build()
        } catch (e: IllegalArgumentException) {
            logger.error("Klarte ikkje å slette utval med id $id", e)
            ResponseEntity.internalServerError().build()
        }
    }

    @PutMapping("/{id}")
    fun updateUtval(@PathVariable id: Int, @RequestBody utval: Utval): ResponseEntity<Utval> {
        val url = "${testingApiProperties.url}/v1/utval/$id"
        return try {
            restTemplate.put(url, utval)
            ResponseEntity.ok(utval)
        } catch (e: HttpClientErrorException.NotFound) {
            logger.error("Klarte ikkje å oppdatere utval med id $id: ${e.message}")
            ResponseEntity.notFound().build()
        } catch (e: IllegalArgumentException) {
            logger.error("Klarte ikkje å oppdatere utval med id $id", e)
            ResponseEntity.internalServerError().build()
        }
    }

    @PostMapping("")
    fun createUtval(@RequestBody utval: Utval): ResponseEntity<Utval> {
        val url = "${testingApiProperties.url}/v1/utval"
        return try {
            val createdUtval = restTemplate.postForObject(url, utval, Utval::class.java)
            ResponseEntity.status(201).body(createdUtval)
        } catch (e: IllegalArgumentException) {
            logger.error("Klarte ikkje å opprette utval", e)
            ResponseEntity.internalServerError().build()
        }
    }

  private fun fetchUtval(id: Int): Result<Utval> = runCatching {
    val url = URI("${testingApiProperties.url}/v1/utval/$id")
    restTemplate.getForObject(url, Utval::class.java)!!
  }

  data class UtvalListItem(val id: Int, val namn: String, val oppretta: Instant)

  data class Utval(
      val id: Int,
      val namn: String,
      val loeysingar: List<Loeysing>,
      val oppretta: Instant
  )
}
