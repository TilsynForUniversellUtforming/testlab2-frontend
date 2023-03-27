package no.uutilsynet.testlab2frontendserver.maalinger.dto

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class StatusDTO(val status: String, val loeysingIdList: List<Int>?)
