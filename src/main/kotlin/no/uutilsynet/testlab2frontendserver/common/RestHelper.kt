package no.uutilsynet.testlab2frontendserver.common

import org.springframework.core.ParameterizedTypeReference
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.getForEntity

object RestHelper {
  inline fun <reified T : Any> typeRef(): ParameterizedTypeReference<T> =
      object : ParameterizedTypeReference<T>() {}

  inline fun <reified T : Any> RestTemplate.getList(url: String): List<T> =
      (getForEntity<Array<T>>(url, typeRef<Array<T>>()).body ?: emptyArray()).toList()
}
