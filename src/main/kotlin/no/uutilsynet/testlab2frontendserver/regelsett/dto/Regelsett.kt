package no.uutilsynet.testlab2frontendserver.regelsett.dto

import no.uutilsynet.testlab2frontendserver.krav.dto.Krav
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelBase
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelModus
import no.uutilsynet.testlab2frontendserver.testreglar.dto.toTestregelBase

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

fun RegelsettDTO.toRegelsett(kravMap: Map<Int, Krav>) =
    Regelsett(
        this.id, this.namn, this.modus, this.standard, this.testregelList.toTestregelBase(kravMap))
