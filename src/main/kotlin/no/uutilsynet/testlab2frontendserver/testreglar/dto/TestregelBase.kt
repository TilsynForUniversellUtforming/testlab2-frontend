package no.uutilsynet.testlab2frontendserver.testreglar.dto

import no.uutilsynet.testlab2frontendserver.krav.dto.Krav

open class TestregelBase(
    open val id: Int,
    open val namn: String,
    open val krav: Krav?,
    open val modus: TestregelModus,
    open val type: TestregelInnholdstype,
)

fun List<TestregelBaseDTO>.toTestregelBase(kravMap: Map<Int, Krav>) =
    this.map { TestregelBase(it.id, it.namn, kravMap[it.kravId], it.modus, it.type) }
