package no.uutilsynet.testlab2frontendserver.regelsett.dto

import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testregel
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelType

data class Regelsett(
    override val id: Int,
    override val namn: String,
    override val type: TestregelType,
    override val standard: Boolean,
    val testregelList: List<Testregel>,
) :
    RegelsettBase(
        id,
        namn,
        type,
        standard,
    )
