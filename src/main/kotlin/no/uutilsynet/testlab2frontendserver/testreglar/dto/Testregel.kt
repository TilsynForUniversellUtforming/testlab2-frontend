package no.uutilsynet.testlab2frontendserver.testreglar.dto

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Testregel(
    val id: Int,
    val kravId: Int?,
    val referanseAct: String?,
    val kravTilSamsvar: String,
    val type: String,
    val status: String,
    val kravTittel: String?
)
