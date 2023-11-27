package no.uutilsynet.testlab2frontendserver.testreglar.dto

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Testregel(
    val id: Int,
    val name: String,
    val testregelSchema: String,
    val krav: String,
    val type: TestregelType,
)
