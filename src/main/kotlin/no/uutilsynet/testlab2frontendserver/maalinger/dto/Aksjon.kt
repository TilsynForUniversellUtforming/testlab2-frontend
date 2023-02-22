package no.uutilsynet.testlab2frontendserver.maalinger.dto

import com.fasterxml.jackson.annotation.JsonInclude

enum class Metode {
  PUT
}

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Aksjon(val metode: Metode, val data: Map<String, String>)
