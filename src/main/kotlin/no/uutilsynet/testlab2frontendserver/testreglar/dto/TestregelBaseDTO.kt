package no.uutilsynet.testlab2frontendserver.testreglar.dto

data class TestregelBaseDTO(
    val id: Int,
    val namn: String,
    val kravId: Int,
    val modus: TestregelModus,
    val type: TestregelInnholdstype,
)
