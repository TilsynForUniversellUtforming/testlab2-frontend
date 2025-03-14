package no.uutilsynet.testlab2frontendserver.common

import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("api/v1/error")
class ErrorController {

  val logger = LoggerFactory.getLogger(ErrorController::class.java)

  @PostMapping()
  fun postErrors(@RequestBody error: String) {
    logger.error("Frontend error: $error")
  }
}
