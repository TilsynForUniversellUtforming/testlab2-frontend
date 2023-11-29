package no.uutilsynet.testlab2frontendserver.regelsett.dto

import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelType

data class RegelsettEdit(
    override val id: Int,
    override val namn: String,
    override val type: TestregelType,
    override val standard: Boolean,
    val testregelIdList: List<Int>,
) :
    RegelsettBase(
        id,
        namn,
        type,
        standard,
    )
