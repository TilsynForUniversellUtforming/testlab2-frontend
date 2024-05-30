package no.uutilsynet.testlab2frontendserver.testreglar.dto

import com.fasterxml.jackson.annotation.JsonInclude
import no.uutilsynet.testlab2frontendserver.common.TestlabLocale
import no.uutilsynet.testlab2frontendserver.krav.dto.Krav

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Testregel(
    override val id: Int,
    val testregelId: String,
    val versjon: Int,
    override val namn: String,
    override val krav: Krav,
    val status: TestregelStatus,
    val datoSistEndra: String,
    override val type: TestregelInnholdstype,
    override val modus: TestregelModus,
    val spraak: TestlabLocale,
    val tema: Tema?,
    val testobjekt: Testobjekt?,
    val kravTilSamsvar: String?,
    val testregelSchema: String,
    val innhaldstypeTesting: InnhaldstypeTesting?
) : TestregelBase(id, namn, krav, modus, type)

fun TestregelDTO.toTestregel(
    temaList: List<Tema>,
    testobjektList: List<Testobjekt>,
    innhaldstypeTestingList: List<InnhaldstypeTesting>,
    krav: Krav
): Testregel =
    Testregel(
        id = this.id,
        testregelId = this.testregelId,
        versjon = this.versjon,
        namn = this.namn,
        krav = krav,
        status = this.status,
        datoSistEndra = this.datoSistEndra.toString(),
        type = this.type,
        modus = this.modus,
        spraak = this.spraak,
        tema = temaList.find { tema -> tema.id == this.tema },
        testobjekt = testobjektList.find { testobjekt -> testobjekt.id == this.testobjekt },
        kravTilSamsvar = this.kravTilSamsvar,
        testregelSchema = this.testregelSchema,
        innhaldstypeTesting =
            innhaldstypeTestingList.find { innhaldstypeTesting ->
              innhaldstypeTesting.id == this.innhaldstypeTesting
            },
    )

fun List<TestregelDTO>.toTestregelList(
    temaList: List<Tema>,
    testobjektList: List<Testobjekt>,
    innhaldstypeTestingList: List<InnhaldstypeTesting>,
    kravList: List<Krav>
): List<Testregel> {
  val temaMap: Map<Int, Tema> = temaList.associateBy { it.id }
  val testobjektMap: Map<Int, Testobjekt> = testobjektList.associateBy { it.id }
  val innhaldstypeTestingMap: Map<Int, InnhaldstypeTesting> =
      innhaldstypeTestingList.associateBy { it.id }
  val kravMap: Map<Int, Krav> = kravList.associateBy { it.id }

  return this.map { testregelDTO ->
    Testregel(
        id = testregelDTO.id,
        testregelId = testregelDTO.testregelId,
        versjon = testregelDTO.versjon,
        namn = testregelDTO.namn,
        krav = kravMap[testregelDTO.kravId] ?: throw IllegalArgumentException("Krav finns ikkje"),
        status = testregelDTO.status,
        datoSistEndra = testregelDTO.datoSistEndra.toString(),
        type = testregelDTO.type,
        modus = testregelDTO.modus,
        spraak = testregelDTO.spraak,
        tema = testregelDTO.tema?.let { temaMap[it] },
        testobjekt = testregelDTO.testobjekt?.let { testobjektMap[it] },
        kravTilSamsvar = testregelDTO.kravTilSamsvar,
        testregelSchema = testregelDTO.testregelSchema,
        innhaldstypeTesting = testregelDTO.innhaldstypeTesting?.let { innhaldstypeTestingMap[it] })
  }
}
