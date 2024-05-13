package no.uutilsynet.testlab2frontendserver.testgrunnlag

import no.uutilsynet.testlab2frontendserver.sak.LoeysingNettsideRelation
import no.uutilsynet.testlab2frontendserver.sak.SakDTO
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testregel

data class TestgrunnlagListElement(
    val id: Int,
    val loeysingId: Int,
)

data class Testgrunnlag(
    val id: Int?,
    val parentId: Int,
    val namn: String,
    val testreglar: List<Testregel> = emptyList(),
    val loeysingar: List<SakDTO.SakLoeysingDTO> = emptyList(), // TODO - Kontrollvariant
    val type: TestgrunnlagType,
)

enum class TestgrunnlagType {
  OPPRINNELEG_TEST,
  RETEST
}

data class CreateTestgrunnlag(
    val parentId: Int,
    val namn: String,
    val type: TestgrunnlagType,
    val testreglar: List<Int>,
    val loeysing: SakDTO.SakLoeysingDTO?, // TODO - Kontrollvariant
    val loeysingNettsideRelation: LoeysingNettsideRelation
)
