package no.uutilsynet.testlab2frontendserver.regelsett.dto

import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelBase
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelModus

data class Regelsett(
    override val id: Int,
    override val namn: String,
    override val modus: TestregelModus,
    override val standard: Boolean,
    val testregelList: List<TestregelBase>,
) :
    RegelsettBase(
        id,
        namn,
        modus,
        standard,
    )
