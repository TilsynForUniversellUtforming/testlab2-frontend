package no.uutilsynet.testlab2frontendserver.security

import java.time.Clock
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Profile
import org.springframework.http.HttpRequest
import org.springframework.http.client.ClientHttpRequestExecution
import org.springframework.http.client.ClientHttpRequestInterceptor
import org.springframework.http.client.ClientHttpResponse
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.security.oauth2.core.AbstractOAuth2Token
import org.springframework.stereotype.Component

@Component
@Profile("oidcclient")
class TokenRelayInterceptor(
    val clientService: OAuth2AuthorizedClientService,
    val clientManager: OAuth2AuthorizedClientManager
) : ClientHttpRequestInterceptor {

  private val logger: Logger = LoggerFactory.getLogger(TokenRelayInterceptor::class.java)
  private val clock = Clock.systemDefaultZone()

  override fun intercept(
      request: HttpRequest,
      bytes: ByteArray,
      execution: ClientHttpRequestExecution
  ): ClientHttpResponse {
    val authentication: Authentication = SecurityContextHolder.getContext().authentication

    return if (authentication is OAuth2AuthenticationToken) {
      runCatching {
            val clientRegistrationId = authentication.authorizedClientRegistrationId
            var client = loadClient(clientRegistrationId, authentication)

            client = handleExpiredToken(client, authentication)

            request.headers.setBearerAuth(client.accessToken.tokenValue)
            execution.execute(request, bytes)
          }
          .getOrElse {
            logger.error("Error in TokenRelayInterceptor", it)
            SecurityContextHolder.getContext().authentication = null
            SecurityContextHolder.clearContext()
            execution.execute(request, bytes)
          }
    } else {
      return execution.execute(request, bytes)
    }
  }

  private fun loadClient(
      clientRegistrationId: String?,
      authentication: OAuth2AuthenticationToken
  ): OAuth2AuthorizedClient =
      clientService.loadAuthorizedClient<OAuth2AuthorizedClient>(
          clientRegistrationId, authentication.name)
          ?: throw RuntimeException("Client not found")

  private fun hasTokenExpired(token: AbstractOAuth2Token): Boolean {
    return clock.instant().isAfter(token.expiresAt?.minusSeconds(10) ?: return false)
  }

  private fun handleExpiredToken(
      client: OAuth2AuthorizedClient?,
      authentication: OAuth2AuthenticationToken
  ): OAuth2AuthorizedClient {
    if (hasTokenExpired(
        client!!.accessToken)) { // access_token expired - re-authorize to get a fresh access_token
      return reauthorize(authentication).getOrThrow()
    }
    return client
  }

  private fun reauthorize(oauthToken: OAuth2AuthenticationToken): Result<OAuth2AuthorizedClient> {
    return runCatching {
      logger.info("reauthorize")
      val clientRegistrationId = oauthToken.authorizedClientRegistrationId
      val authzRequest =
          OAuth2AuthorizeRequest.withClientRegistrationId(clientRegistrationId)
              .principal(oauthToken)
              .build()
      val reauthorizedClient =
          clientManager.authorize(authzRequest) // re-authorize with refresh_token
      if (reauthorizedClient != null) {
        clientService.saveAuthorizedClient(reauthorizedClient, oauthToken)
      }
      reauthorizedClient ?: throw RuntimeException("Re-authorization failed")
    }
  }
}
