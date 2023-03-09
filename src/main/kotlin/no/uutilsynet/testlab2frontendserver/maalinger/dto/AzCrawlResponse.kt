package no.uutilsynet.testlab2frontendserver.maalinger.dto

import com.fasterxml.jackson.annotation.JsonInclude
import java.net.URL

@JsonInclude(JsonInclude.Include.NON_NULL) data class AzCrawlResponse(val output: List<URL>?)
