package no.uutilsynet.testlab2frontendserver.testreglar.dto

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Testregel(
    val id: Int,
    val krav: String,
    val testregelNoekkel: String,
    val kravTilSamsvar: String,
)
