package no.uutilsynet.testlab2frontendserver.regelsett.dto

import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelType

data class RegelsettCreate(
    val namn: String,
    val type: TestregelType,
    val standard: Boolean,
    val testregelIdList: List<Int>,
)
