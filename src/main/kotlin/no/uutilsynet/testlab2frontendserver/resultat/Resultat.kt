package no.uutilsynet.testlab2frontendserver.resultat

import com.fasterxml.jackson.annotation.JsonProperty
import java.time.LocalDate

data class Resultat(
    val id: Int,
    val namn: String,
    val type: KontrollType,
    val dato: LocalDate,
    val loeysingar: List<LoeysingResultat>,
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
    val score: Double,
    val kravId: Int,
    val kravTittel: String,
    val talTestaElement: Int?,
    val talElementBrot: Int,
    val talElementSamsvar: Int,
)

enum class KontrollType {
  @JsonProperty("inngaaende-kontroll") InngaaendeKontroll,
  @JsonProperty("forenkla-kontroll") ForenklaKontroll
}

enum class TestgrunnlagType {
  OPPRINNELEG_TEST,
  RETEST
}
