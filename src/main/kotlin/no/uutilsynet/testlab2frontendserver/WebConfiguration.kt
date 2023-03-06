package no.uutilsynet.testlab2frontendserver

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfiguration : WebMvcConfigurer {
  override fun addViewControllers(registry: ViewControllerRegistry) {
    registry.addViewController("/{spring:\\w+}").setViewName("forward:/")
    registry.addViewController("/**/{spring:\\w+}").setViewName("forward:/")
    registry
        .addViewController("/{spring:\\w+}/**{spring:?!(\\.tsx|\\.ts|\\.scss)$}")
        .setViewName("forward:/")
  }
}
