package no.uutilsynet.testlab2frontendserver.testreglar.dto

import no.uutilsynet.testlab2.constants.TestregelInnholdstype
import no.uutilsynet.testlab2.constants.TestregelModus

data class TestregelBaseDTO(
    val id: Int,
    val namn: String,
    val kravId: Int,
    val modus: TestregelModus,
    val type: TestregelInnholdstype,
)
