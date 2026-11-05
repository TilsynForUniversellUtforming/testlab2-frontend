package no.uutilsynet.testlab2frontendserver.common


import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ProblemDetail
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.validation.FieldError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import tools.jackson.databind.DatabindException
import tools.jackson.databind.exc.InvalidFormatException
import tools.jackson.databind.exc.UnrecognizedPropertyException

@RestControllerAdvice
class RestControllerAdvice {
  private val logger = LoggerFactory.getLogger(javaClass)

  @ExceptionHandler(MethodArgumentNotValidException::class)
  fun handleMethodArgumentNotValid(
      ex: MethodArgumentNotValidException
  ): ResponseEntity<ProblemDetail> {
    val errors =
        ex.bindingResult.fieldErrors.joinToString("; ") { fieldError ->
          fieldError.toCleanMessage()
        }
    val problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST)
    problem.title = "Ugyldig forespørsel"
    problem.detail = errors.ifBlank { "Request body inneholder ugyldige felter." }

    return ResponseEntity.badRequest().body(problem)
  }

  @ExceptionHandler(HttpMessageNotReadableException::class)
  fun handleHttpMessageNotReadable(
      ex: HttpMessageNotReadableException
  ): ResponseEntity<ProblemDetail> {
      val detail =
        when (val cause = ex.mostSpecificCause) {
          is UnrecognizedPropertyException -> "Ukjent felt '${cause.propertyName}' i request body."
          is DatabindException -> {
            val field =
                cause.path.joinToString(".") { reference ->

                  reference.propertyName ?: reference.index.toString()

                }
            val fieldMessage =  cause.pathReference

            "Felt '$field' har ugyldig eller manglende verdi."
          }
//          is DatabindException ->
//              "Request body er ugyldig eller mangler felter. ${cause.cause ?: "Kontroller formatet."}"
          else -> "Request body er ugyldig eller mangler felter."
        }

    logger.warn("Invalid request body: {}", ex.message)

    val problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST)
    problem.title = "Ugyldig JSON"
    problem.detail = detail

    return ResponseEntity.badRequest().body(problem)
  }

  @ExceptionHandler(IllegalArgumentException::class)
  fun handleIllegalArgument(ex: IllegalArgumentException): ResponseEntity<ProblemDetail> {
    val problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST)
    problem.title = "Ugyldig verdi"
    problem.detail = ex.message ?: "Ugyldig input."
    return ResponseEntity.badRequest().body(problem)
  }

  private fun FieldError.toCleanMessage(): String {
    val field = this.field
    val message = this.defaultMessage ?: "Ugyldig verdi"
    return "$field: $message"
  }
}
