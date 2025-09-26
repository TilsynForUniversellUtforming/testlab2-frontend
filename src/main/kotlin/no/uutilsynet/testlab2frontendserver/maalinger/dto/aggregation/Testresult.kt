package no.uutilsynet.testlab2frontendserver.maalinger.dto.aggregation

import com.fasterxml.jackson.annotation.JsonInclude
import no.uutilsynet.testlab2frontendserver.maalinger.dto.Framgang
import no.uutilsynet.testlab2frontendserver.maalinger.dto.JobStatus
import no.uutilsynet.testlab2frontendserver.maalinger.dto.LoeysingVerksemd
import java.time.LocalDate

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Testresult(
    val loeysing: LoeysingVerksemd,
    val tilstand: JobStatus,
    val sistOppdatert: LocalDate,
    val framgang: Framgang?,
    val aggregatedResultList: List<AggegatedTestresultTestregel>?,
    val compliancePercent: Int?,
    val antalSider: Int?,
)
