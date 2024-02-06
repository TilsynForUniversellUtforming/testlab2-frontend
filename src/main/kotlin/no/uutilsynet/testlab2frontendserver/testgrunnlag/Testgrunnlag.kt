package no.uutilsynet.testlab2frontendserver.testgrunnlag

import no.uutilsynet.testlab2frontendserver.sak.LoeysingNettsideRelation
import no.uutilsynet.testlab2frontendserver.sak.SakDTO
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testregel

data class Testgrunnlag(
    val id: Int?,
    val parentId: Int,
    val namn: String,
    val testreglar: List<Testregel> = emptyList(),
    val loeysing: SakDTO.SakLoeysingDTO,
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
    val loeysing: SakDTO.SakLoeysingDTO?,
    val loeysingNettsideRelation: LoeysingNettsideRelation
)
