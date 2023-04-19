package no.uutilsynet.testlab2frontendserver

import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.http.HttpHeaders
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping
class IndexController {
  val logger = LoggerFactory.getLogger(IndexController::class.java)

  @GetMapping
  fun getIndex(response: HttpServletResponse) {
    logger.info("Setter no-cache på index.html")
    response.setHeader(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, max-age=0, must-revalidate")
  }
}
