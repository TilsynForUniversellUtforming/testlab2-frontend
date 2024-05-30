package no.uutilsynet.testlab2frontendserver.regelsett.dto

import no.uutilsynet.testlab2frontendserver.krav.dto.Krav
import no.uutilsynet.testlab2frontendserver.testreglar.dto.RegelsettInnholdstype
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
    ) {
  init {
    if (testregelList.isEmpty()) {
      throw IllegalStateException("Testregelliste kan ikkje væra tom")
    }
  }

  val type: RegelsettInnholdstype
    get() {
      val types = testregelList.map { it.type.value }.toSet()
      return if (types.size > 1) RegelsettInnholdstype.kombinasjon
      else RegelsettInnholdstype.valueOf(types.first())
    }
}

fun RegelsettDTO.toRegelsett(kravMap: Map<Int, Krav>) =
    Regelsett(
        this.id, this.namn, this.modus, this.standard, this.testregelList.toTestregelBase(kravMap))
