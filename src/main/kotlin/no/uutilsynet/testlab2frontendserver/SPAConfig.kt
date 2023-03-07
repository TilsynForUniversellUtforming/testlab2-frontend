package no.uutilsynet.testlab2frontendserver

import jakarta.servlet.http.HttpServletRequest
import java.io.IOException
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ClassPathResource
import org.springframework.core.io.Resource
import org.springframework.util.StringUtils
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import org.springframework.web.servlet.resource.ResourceResolver
import org.springframework.web.servlet.resource.ResourceResolverChain

// https://stackoverflow.com/questions/75429187/react-route-v6-does-not-work-in-sprint-boot-app-whitelabel-error-404

@Configuration
class SinglePageAppConfig : WebMvcConfigurer {

  override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
    registry
        .addResourceHandler("/**")
        .addResourceLocations("classpath:/public/")
        .resourceChain(false)
        .addResolver(PushStateResourceResolver())
  }

  private inner class PushStateResourceResolver : ResourceResolver {
    private val index: Resource = ClassPathResource("/public/index.html")
    private val handledExtensions =
        listOf(
            "html",
            "js",
            "json",
            "csv",
            "css",
            "png",
            "svg",
            "eot",
            "ttf",
            "woff",
            "appcache",
            "jpg",
            "jpeg",
            "gif",
            "ico")
    private val ignoredPaths = listOf("api")

    override fun resolveResource(
        request: HttpServletRequest?,
        requestPath: String,
        locations: List<Resource>,
        chain: ResourceResolverChain
    ): Resource? {
      return resolve(requestPath, locations)
    }

    override fun resolveUrlPath(
        resourcePath: String,
        locations: List<Resource>,
        chain: ResourceResolverChain
    ): String? {
      return resolve(resourcePath, locations)?.let { resolvedResource ->
        try {
          resolvedResource.url.toString()
        } catch (e: IOException) {
          resolvedResource.filename
        }
      }
    }

    private fun resolve(requestPath: String, locations: List<Resource>): Resource? {
      if (requestPath in ignoredPaths) {
        return null
      }
      return if (isHandled(requestPath)) {
        locations.firstNotNullOfOrNull { loc ->
          loc.createRelative(requestPath).takeIf { it.exists() }
        }
      } else {
        index
      }
    }

    private fun isHandled(path: String): Boolean {
      val extension = StringUtils.getFilenameExtension(path)
      return handledExtensions.contains(extension)
    }
  }
}
