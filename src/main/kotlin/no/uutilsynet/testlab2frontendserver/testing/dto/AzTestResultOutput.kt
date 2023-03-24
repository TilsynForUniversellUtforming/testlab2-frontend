package no.uutilsynet.testlab2frontendserver.testing.dto

import java.net.URL

data class AzTestResultOutput(
    val side: URL,
    val suksesskriterium: List<String>,
    val elementResultat: String,
    val testregelId: String,
    val elementOmtale: List<ElementOmtale>
)
