package no.uutilsynet.testlab2frontendserver.sak

import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testregel

data class SakDTO(
    val id: Int,
    val namn: String,
    val virksomhet: String,
    val loeysingar: List<SakLoeysingDTO> = emptyList(),
    val testreglar: List<Testregel> = emptyList()
) {
  data class SakLoeysingDTO(val loeysingId: Int, val nettsider: List<NettsideDTO> = emptyList())
}
