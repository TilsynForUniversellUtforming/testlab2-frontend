package no.uutilsynet.testlab2frontendserver.testreglar.dto

import com.fasterxml.jackson.annotation.JsonInclude
import no.uutilsynet.testlab2frontendserver.common.TestlabLocale

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Testregel(
    val id: Int,
    val testregelId: String,
    val versjon: Int,
    val namn: String,
    val krav: String,
    val status: TestregelStatus,
    val datoSistEndra: String,
    val type: TestregelInnholdstype,
    val modus: TestregelModus,
    val spraak: TestlabLocale,
    val tema: Tema?,
    val testobjekt: Testobjekt?,
    val kravTilSamsvar: String?,
    val testregelSchema: String,
    val innhaldstypeTesting: InnhaldstypeTesting?
)

fun TestregelDTO.toTestregel(
    temaList: List<Tema>,
    testobjektList: List<Testobjekt>,
    innhaldstypeTestingList: List<InnhaldstypeTesting>
): Testregel =
    Testregel(
        id = this.id,
        testregelId = this.testregelId,
        versjon = this.versjon,
        namn = this.namn,
        krav = this.krav,
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
