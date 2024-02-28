package no.uutilsynet.testlab2frontendserver.maalinger.dto

import com.fasterxml.jackson.annotation.JsonInclude
import java.time.LocalDate
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelBaseDTO

@JsonInclude(JsonInclude.Include.NON_NULL)
data class MaalingDTO(
    val id: Int,
    val navn: String,
    val datoStart: LocalDate,
    val status: MaalingStatus,
    val loeysingList: List<Loeysing>?,
    val testregelList: List<TestregelBaseDTO>?,
    val crawlResultat: List<CrawlResultatDTO>?,
    val testKoeyringar: List<TestKoeyringDTO>?,
    val crawlParameters: CrawlParameters?,
)
