package no.uutilsynet.testlab2frontendserver.maalinger

import no.uutilsynet.testlab2frontendserver.maalinger.dto.JobStatus

data class JobStatistics(
    val numPending: Int,
    val numRunning: Int,
    val numFinished: Int,
    val numError: Int,
) {
  companion object {
    fun List<JobStatus>.toJobStatistics() =
        JobStatistics(
            numPending = this.count { it == JobStatus.ikkje_starta },
            numRunning = this.count { it == JobStatus.starta },
            numFinished = this.count { it == JobStatus.ferdig },
            numError = this.count { it == JobStatus.feila })
  }
}
