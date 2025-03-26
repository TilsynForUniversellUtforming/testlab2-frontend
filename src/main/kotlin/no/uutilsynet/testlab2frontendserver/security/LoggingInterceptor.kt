package no.uutilsynet.testlab2frontendserver.security

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpRequest
import org.springframework.http.client.ClientHttpRequestExecution
import org.springframework.http.client.ClientHttpRequestInterceptor
import org.springframework.http.client.ClientHttpResponse

class LoggingInterceptor : ClientHttpRequestInterceptor {

  private val logger: Logger = LoggerFactory.getLogger(LoggingInterceptor::class.java)

  override fun intercept(
      request: HttpRequest,
      body: ByteArray,
      execution: ClientHttpRequestExecution
  ): ClientHttpResponse {
    traceRequest(request)
    val response = execution.execute(request, body)
    traceResponse(response)
    return response
  }

  private fun traceRequest(request: HttpRequest) {
    logger.debug(
        "Request: {} to {} with headers {}  with attributes {}}",
        request.method,
        request.uri,
        request.headers,
        request.attributes)
  }

  private fun traceResponse(response: ClientHttpResponse) {
    logger.debug(
        "Response: {} {} with headers {}",
        response.statusCode,
        response.statusText,
        response.headers,
    )
  }
}
