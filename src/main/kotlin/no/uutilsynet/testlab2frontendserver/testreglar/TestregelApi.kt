package no.uutilsynet.testlab2frontendserver.testreglar

import no.uutilsynet.testlab2frontendserver.testreglar.dto.Regelsett
import no.uutilsynet.testlab2frontendserver.testreglar.dto.RegelsettRequest
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testregel
import org.springframework.http.ResponseEntity

interface TestregelApi {
    fun listTestreglar(): ResponseEntity<Any>
    fun listRegelsett(): ResponseEntity<Any>
    fun createTestregel(testregel: Testregel): ResponseEntity<Any>
    fun createRegelsett(regelsettRequest: RegelsettRequest): ResponseEntity<Any>
    fun updateTestregel(testregel: Testregel): ResponseEntity<Any>
    fun updateRegelsett(regelsett: Regelsett): ResponseEntity<Any>
    fun deleteTestregel(id: Int): ResponseEntity<Any>
    fun deleteRegelsett(id: Int): ResponseEntity<Any>
}
