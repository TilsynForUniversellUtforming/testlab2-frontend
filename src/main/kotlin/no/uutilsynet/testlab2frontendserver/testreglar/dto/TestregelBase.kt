package no.uutilsynet.testlab2frontendserver.testreglar.dto

data class TestregelBase(
    val id: Int,
    val namn: String,
    val krav: String,
    val modus: TestregelModus,
)
