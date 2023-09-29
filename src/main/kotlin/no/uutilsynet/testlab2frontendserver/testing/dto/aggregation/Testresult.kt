package no.uutilsynet.testlab2frontendserver.testing.dto.aggregation

import com.fasterxml.jackson.annotation.JsonInclude
import java.time.LocalDate
import no.uutilsynet.testlab2frontendserver.maalinger.dto.Framgang
import no.uutilsynet.testlab2frontendserver.maalinger.dto.JobStatus
import no.uutilsynet.testlab2frontendserver.maalinger.dto.Loeysing

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Testresult(
    val loeysing: Loeysing,
    val tilstand: JobStatus,
    val sistOppdatert: LocalDate,
    val framgang: Framgang?,
    val aggregatedResultList: List<AggegatedTestresultTestregel>?,
    val compliancePercent: Int?,
    val antalSider: Int?,
)
