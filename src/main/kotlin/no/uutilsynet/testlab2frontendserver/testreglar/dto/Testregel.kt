package no.uutilsynet.testlab2frontendserver.testreglar.dto

data class Testregel(
    val id: Int,
    val kravId: Int?,
    val referanseAct: String?,
    val kravTilSamsvar: String,
    val type: String,
    val status: String,
    val kravTittel: String?
)
