package no.uutilsynet.testlab2frontendserver.verksemd

import no.uutilsynet.testlab2frontendserver.common.LoeysingsregisterApiProperties
import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestTemplate

@RestController
@RequestMapping("api/v1/verksemd")
class VerksemdResource(
    val restTemplate: RestTemplate,
    loeysingsregisterApiProperties: LoeysingsregisterApiProperties
) {

  val verksemdUrlUrl = "${loeysingsregisterApiProperties.url}/v1/verksemd"

  @GetMapping
  fun getVerksemder(): List<Verksemd> {
    return restTemplate.getList(verksemdUrlUrl)
  }
}
