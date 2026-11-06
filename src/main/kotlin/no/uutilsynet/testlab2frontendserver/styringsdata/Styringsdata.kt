package no.uutilsynet.testlab2frontendserver.styringsdata

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.Instant
import java.time.LocalDate

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(Styringsdata.Kontroll::class, name = "kontroll"),
    JsonSubTypes.Type(Styringsdata.Loeysing::class, name = "loeysing"))
sealed class Styringsdata {
  abstract val id: Int?
  abstract val kontrollId: Int
  abstract val ansvarleg: String
  abstract val oppretta: LocalDate?
  abstract val frist: LocalDate?
  abstract val sistLagra: Instant?

  data class Loeysing(
      @field:NotNull override val id: Int?,
      @field:NotNull override val kontrollId: Int,
      @field:NotBlank override val ansvarleg: String,
      @field:NotNull override val oppretta: LocalDate,
      @field:NotNull override val frist: LocalDate,
      override val sistLagra: Instant?,
      @field:NotNull val loeysingId: Int,
      @field:NotNull val reaksjon: Reaksjonstype,
      @field:NotNull val paaleggReaksjon: Reaksjonstype,
      @field:NotNull val paaleggKlageReaksjon: Reaksjonstype,
      @field:NotNull val botReaksjon: Reaksjonstype,
      @field:NotNull val botKlageReaksjon: Reaksjonstype,
      @field:Valid val paalegg: Paalegg?,
      @field:Valid val paaleggKlage: Klage?,
      @field:Valid val bot: Bot?,
      @field:Valid val botKlage: Klage?,
  ) : Styringsdata() {
    data class Paalegg(
        val id: Int?,
        @field:NotNull val vedtakDato: LocalDate,
        val frist: LocalDate?,
    )

    data class Klage(
        val id: Int?,
        @field:NotNull val klageMottattDato: LocalDate,
        val klageAvgjortDato: LocalDate?,
        val resultatKlageTilsyn: ResultatKlage?,
        val klageDatoDepartement: LocalDate?,
        val resultatKlageDepartement: ResultatKlage?
    )

    data class Bot(
        val id: Int?,
        @field:NotNull val beloepDag: Int,
        @field:NotNull val oekingEtterDager: Int,
        @field:NotNull val oekningType: BotOekningType,
        @field:NotNull val oekingSats: Int,
        @field:NotNull val vedtakDato: LocalDate,
        @field:NotNull val startDato: LocalDate,
        val sluttDato: LocalDate?,
        val kommentar: String?,
    )

    enum class BotOekningType {
      @JsonProperty("kroner") kroner,
      @JsonProperty("prosent") prosent,
      @JsonProperty("ikkje-relevant") ikkjeRelevant
    }

    enum class ResultatKlage {
      @JsonProperty("stadfesta") stadfesta,
      @JsonProperty("delvis-omgjort") delvisOmgjort,
      @JsonProperty("omgjort") omgjort,
      @JsonProperty("oppheva") oppheva,
    }
  }

  data class Kontroll(
      override val id: Int?,
      override val kontrollId: Int,
      override val ansvarleg: String,
      override val oppretta: LocalDate?,
      override val frist: LocalDate?,
      override val sistLagra: Instant?,
      val varselSendtDato: LocalDate?,
      val status: StyringsdataKontrollStatus?,
      val foerebelsRapportSendtDato: LocalDate?,
      val svarFoerebelsRapportDato: LocalDate?,
      val endeligRapportDato: LocalDate?,
      val kontrollAvsluttaDato: LocalDate?,
      val rapportPublisertDato: LocalDate?,
  ) : Styringsdata() {
    enum class StyringsdataKontrollStatus {
      @JsonProperty("planlagt") planlagt,
      @JsonProperty("paagar") paagar,
      @JsonProperty("avslutta") avslutta,
      @JsonProperty("ikkje-aktuell") ikkjeAktuell,
      @JsonProperty("forsinka") forsinka,
    }
  }
}

enum class StyringsdataType {
  kontroll,
  loeysing,
}

enum class Klagetype {
  paalegg,
  bot
}

enum class Reaksjonstype {
  @JsonProperty("reaksjon") reaksjon,
  @JsonProperty("ingen-reaksjon") ingenReaksjon
}

data class StyringsdataListElement(
    override val id: Int,
    override val kontrollId: Int,
    override val ansvarleg: String,
    override val oppretta: LocalDate,
    override val frist: LocalDate,
    override val sistLagra: Instant,
    val loeysingId: Int,
    val reaksjon: Reaksjonstype,
    val paaleggReaksjon: Reaksjonstype,
    val paaleggKlageReaksjon: Reaksjonstype,
    val botReaksjon: Reaksjonstype,
    val botKlageReaksjon: Reaksjonstype,
    val paaleggId: Int?,
    val paaleggKlageId: Int?,
    val botId: Int?,
    val botKlageId: Int?,
) : Styringsdata() {
  val isPaalegg: Boolean
    get() = paaleggReaksjon == Reaksjonstype.reaksjon

  val isBot: Boolean
    get() = botReaksjon == Reaksjonstype.reaksjon
}
