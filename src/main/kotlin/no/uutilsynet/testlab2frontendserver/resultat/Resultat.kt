package no.uutilsynet.testlab2frontendserver.resultat

import com.fasterxml.jackson.annotation.JsonProperty
import java.time.LocalDate

data class Resultat(
    val id: Int,
    val namn: String,
    val type: KontrollType,
    val testType: TestgrunnlagType,
    val dato: LocalDate,
    val loeysingar: List<LoeysingResultat>,
    val publisert: Boolean,
    val subRows: List<LoeysingResultat>?
)

data class LoeysingResultat(
    val loeysingId: Int,
    val loeysingNamn: String,
    val verksemdNamn: String,
    val score: Double,
    val testType: TestgrunnlagType,
    val talTestaElement: Int?,
    val talElementSamsvar: Int,
    val talElementBrot: Int,
    val testar: List<String>,
    val progresjon: Int = 0,
)

data class ResultatOversiktLoeysing(
    val loeysingId: Int,
    val loeysingNamn: String,
    val typeKontroll: String,
    val kontrollNamn: String,
    val testar: List<String>,
    val score: Double?,
    val kravId: Int,
    val kravTittel: String,
    val talTestaElement: Int?,
    val talElementBrot: Int,
    val talElementSamsvar: Int,
)

data class ResultatTema(
    val temaNamn: String,
    val score: Int,
    val talTestaElement: Int,
    val talElementBrot: Int,
    val talElementSamsvar: Int,
    val talIkkjeTestbar: Int,
    val talIkkjeForekomst: Int,
)

data class ResultatKrav(
    val suksesskriterium: String,
    val score: Int,
    val talTestaElement: Int,
    val talElementBrot: Int,
    val talElementSamsvar: Int,
    val talElementVarsel: Int,
    val talElementIkkjeForekomst: Int,
)

enum class KontrollType {
  @JsonProperty("inngaaende-kontroll") InngaaendeKontroll,
  @JsonProperty("forenkla-kontroll") ForenklaKontroll,
  @JsonProperty("tilsyn") Tilsyn,
  @JsonProperty("statusmaaling") Statusmaaling,
  @JsonProperty("uttalesak") Uttalesak,
}

enum class TestgrunnlagType {
  OPPRINNELEG_TEST,
  RETEST
}
