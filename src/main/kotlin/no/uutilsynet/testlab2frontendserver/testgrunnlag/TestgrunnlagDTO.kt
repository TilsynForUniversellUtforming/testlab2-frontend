package no.uutilsynet.testlab2frontendserver.testgrunnlag

import no.uutilsynet.testlab2frontendserver.sak.SakDTO
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelDTO

data class TestgrunnlagDTO(
    val id: Int?,
    val parentId: Int,
    val namn: String,
    val testreglar: List<TestregelDTO> = emptyList(),
    val loeysing: SakDTO.SakLoeysingDTO,
    val type: TestgrunnlagType,
)
