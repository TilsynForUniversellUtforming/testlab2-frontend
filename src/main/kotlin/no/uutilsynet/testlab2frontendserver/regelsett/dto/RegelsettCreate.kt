package no.uutilsynet.testlab2frontendserver.regelsett.dto

import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelModus

data class RegelsettCreate(
    val namn: String,
    val type: TestregelModus,
    val standard: Boolean,
    val testregelIdList: List<Int>,
)
