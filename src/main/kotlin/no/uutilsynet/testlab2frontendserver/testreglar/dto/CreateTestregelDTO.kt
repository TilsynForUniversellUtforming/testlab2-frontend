package no.uutilsynet.testlab2frontendserver.testreglar.dto

data class CreateTestregelDTO(
    val krav: String,
    val testregelSchema: String,
    val name: String,
    val type: TestregelType,
)
