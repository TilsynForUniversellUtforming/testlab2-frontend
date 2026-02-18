package no.uutilsynet.testlab2frontendserver.regelsett.dto

import no.uutilsynet.testlab2.constants.TestregelModus
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelBaseDTO

data class RegelsettDTO(
    val id: Int,
    val namn: String,
    val modus: TestregelModus,
    val standard: Boolean,
    val testregelList: List<TestregelBaseDTO>,
)
