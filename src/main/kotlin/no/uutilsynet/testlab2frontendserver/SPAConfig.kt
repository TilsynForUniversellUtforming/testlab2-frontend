package no.uutilsynet.testlab2frontendserver

import java.time.Duration
import java.util.concurrent.TimeUnit
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ClassPathResource
import org.springframework.core.io.Resource
import org.springframework.http.CacheControl
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import org.springframework.web.servlet.resource.PathResourceResolver

@Configuration
class SinglePageAppConfig : WebMvcConfigurer {

  val resolver =
      object : PathResourceResolver() {
        override fun getResource(resourcePath: String, location: Resource): Resource {
          val requestedResource = location.createRelative(resourcePath)
          return if (requestedResource.exists() && requestedResource.isReadable) {
            requestedResource
          } else ClassPathResource("/public/index.html")
        }
      }

  override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
    registry
        .setOrder(2)
        .addResourceHandler("/assets/**")
        .addResourceLocations("classpath:/public/")
        .setCachePeriod(Duration.ofDays(7).seconds.toInt())
        .resourceChain(true)
        .addResolver(resolver)

    registry
        .setOrder(3)
        .addResourceHandler("/**")
        .addResourceLocations("classpath:/public/")
        .setCacheControl(CacheControl.maxAge(0, TimeUnit.SECONDS).mustRevalidate())
        .setCacheControl(CacheControl.noCache())
        .resourceChain(true)
        .addResolver(resolver)
  }
}
