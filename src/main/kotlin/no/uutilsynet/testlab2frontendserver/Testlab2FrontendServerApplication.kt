package no.uutilsynet.testlab2frontendserver

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication
import org.springframework.boot.security.autoconfigure.SecurityAutoConfiguration

@SpringBootApplication(
    exclude = [SecurityAutoConfiguration::class],
    scanBasePackages =
        ["no.uutilsynet.testlab2frontendserver", "no.uutilsynet.testlab2securitylib"])
@ConfigurationPropertiesScan
class Testlab2FrontendServerApplication

fun main(args: Array<String>) {
  runApplication<Testlab2FrontendServerApplication>(*args)
}
