package no.uutilsynet.testlab2frontendserver.testreglar

import no.uutilsynet.testlab2frontendserver.testreglar.dto.Regelsett
import no.uutilsynet.testlab2frontendserver.testreglar.dto.RegelsettRequest
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testregel
import org.springframework.http.ResponseEntity

interface TestregelApi {
    fun listTestreglar(): List<Testregel>
    fun listRegelsett(): List<Regelsett>
    fun createTestregel(testregel: Testregel): List<Testregel>
    fun createRegelsett(regelsettRequest: RegelsettRequest): List<Regelsett>
    fun updateTestregel(testregel: Testregel): List<Testregel>
    fun updateRegelsett(regelsett: Regelsett): List<Regelsett>
    fun deleteTestregel(id: Int): List<Testregel>
    fun deleteRegelsett(id: Int): List<Regelsett>
}
