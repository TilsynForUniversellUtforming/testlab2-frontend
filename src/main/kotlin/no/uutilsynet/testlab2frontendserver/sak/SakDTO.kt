package no.uutilsynet.testlab2frontendserver.sak

import java.time.LocalDate
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelDTO

data class SakDTO(
    val id: Int,
    val namn: String,
    val virksomhet: String,
    val frist: LocalDate,
    val loeysingar: List<SakLoeysingDTO> = emptyList(),
    val testreglar: List<TestregelDTO> = emptyList()
) {
  data class SakLoeysingDTO(val loeysingId: Int, val nettsider: List<NettsideDTO> = emptyList())
}
