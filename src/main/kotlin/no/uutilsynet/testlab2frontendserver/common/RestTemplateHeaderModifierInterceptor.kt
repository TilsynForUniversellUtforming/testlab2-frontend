package no.uutilsynet.testlab2frontendserver.common

import org.springframework.http.HttpRequest
import org.springframework.http.client.ClientHttpRequestExecution
import org.springframework.http.client.ClientHttpRequestInterceptor
import org.springframework.http.client.ClientHttpResponse
import org.springframework.stereotype.Service

@Service
class RestTemplateHeaderModifierInterceptor(val securityHelper: SecurityHelper) :
    ClientHttpRequestInterceptor {

  override fun intercept(
      request: HttpRequest,
      body: ByteArray,
      execution: ClientHttpRequestExecution
  ): ClientHttpResponse {
    val accessToken = securityHelper.getAccessToken()
    request.headers.set("Authorization", "Bearer " + accessToken)
    return execution.execute(request, body)
  }
}
