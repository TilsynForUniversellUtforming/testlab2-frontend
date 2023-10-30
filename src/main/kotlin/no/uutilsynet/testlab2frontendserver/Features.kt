package no.uutilsynet.testlab2frontendserver

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("api/v1/features")
class Features(val featuresProperties: FeaturesProperties) {
  @GetMapping
  fun list(): List<Feature> {
    return listOf(Feature("inngaaende", featuresProperties.inngaaende))
  }
}

data class Feature(val key: String, val active: Boolean)

@ConfigurationProperties(prefix = "features")
data class FeaturesProperties(val inngaaende: Boolean)
