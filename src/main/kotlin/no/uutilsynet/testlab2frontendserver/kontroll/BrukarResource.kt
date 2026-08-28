package no.uutilsynet.testlab2frontendserver.kontroll

import no.uutilsynet.testlab2frontendserver.common.Brukar
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import org.springframework.core.ParameterizedTypeReference
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestClient

@RestController
@RequestMapping("api/v1/users")
class BrukarResource(
    val testingApiProperties: TestingApiProperties,
) {

  @GetMapping
  fun getUsers(): List<Brukar> {
    return RestClient.create()
        .get()
        .uri(testingApiProperties.url + "/users")
        .retrieve()
        .body(object : ParameterizedTypeReference<List<Brukar>>() {})
        .orEmpty()
  }
}
