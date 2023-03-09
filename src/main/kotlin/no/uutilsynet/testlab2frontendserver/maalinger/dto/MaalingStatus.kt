package no.uutilsynet.testlab2frontendserver.maalinger.dto

enum class MaalingStatus(val status: String) {
  planlegging("planlegging"),
  crawling("crawling"),
  kvalitetssikring("kvalitetssikring"),
}
