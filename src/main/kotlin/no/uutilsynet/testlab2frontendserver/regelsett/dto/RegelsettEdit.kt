package no.uutilsynet.testlab2frontendserver.regelsett.dto

import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelModus

data class RegelsettEdit(
    override val id: Int,
    override val namn: String,
    override val modus: TestregelModus,
    override val standard: Boolean,
    val testregelIdList: List<Int>,
) :
    RegelsettBase(
        id,
        namn,
        modus,
        standard,
    )
