package no.uutilsynet.testlab2frontendserver.maalinger

import no.uutilsynet.testlab2frontendserver.maalinger.dto.JobStatus

data class JobStatistics(
    val numPerforming: Int,
    val numFinished: Int,
    val numError: Int,
) {
  companion object {
    fun List<JobStatus>.toJobStatistics() =
        JobStatistics(
            numPerforming = this.count { it == JobStatus.ikke_ferdig },
            numFinished = this.count { it == JobStatus.ferdig },
            numError = this.count { it == JobStatus.feilet })
  }
}
