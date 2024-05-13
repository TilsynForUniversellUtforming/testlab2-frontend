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
    val id: Int,
    val namnLoeysing: String,
    val score: Double,
    val testType: TestgrunnlagType,
    val talElementSamsvar: Int,
    val talElementBrot: Int,
    val testar: String,
    val progresjon: Int = 0,
)

data class ResultatListElement(
    val id: Int,
    val namnLoeysing: String,
    val score: Int,
    val testType: TestgrunnlagType,
    val resultatId: Int,
    val namnKontroll: String,
    val kontrollType: KontrollType,
    val dato: LocalDate,
    val talElementSamsvar: Int,
    val talElementBrot: Int,
    val testar: String,
)

enum class KontrollType {
  @JsonProperty("inngaaende-kontroll") InngaaendeKontroll,
  @JsonProperty("forenkla-kontroll") ForenklaKontroll
}

enum class TestgrunnlagType {
  OPPRINNELEG_TEST,
  RETEST
}
