package no.uutilsynet.testlab2frontendserver.kontroll

import java.net.URI
import java.time.Instant
import kotlin.properties.Delegates
import no.uutilsynet.testlab2frontendserver.common.Brukar
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.fakes.*
import no.uutilsynet.testlab2frontendserver.resultat.TestgrunnlagType
import no.uutilsynet.testlab2frontendserver.testing.*
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.client.RestTemplate

class KontrollResourceTest {
  private var kontrollResource: KontrollResource by Delegates.notNull()
  private var kontrollId: Int by Delegates.notNull()
  private var testResource: TestResource by Delegates.notNull()

  @BeforeEach
  fun setUp() {
    // Mocker disse avhengighetene, siden det ikke finnes noen kers for dem. De brukes ikke i
    // testen. Hvis de skal brukes senere, er det bedre om vi lager fakes for dem.
    val mockRestTemplate = Mockito.mock(RestTemplate::class.java)
    val mockTestingApiProperties = Mockito.mock(TestingApiProperties::class.java)
    val mockBildeService = Mockito.mock(BildeService::class.java)

    kontrollResource =
        KontrollResource(
            FakeTestgrunnlagAPIClient,
            FakeTestresultatAPIClient,
            mockRestTemplate,
            mockTestingApiProperties)
    kontrollId = fakeId()
    testResource =
        TestResource(
            FakeTestresultatAPIClient, mockRestTemplate, mockTestingApiProperties, mockBildeService)
  }

  @Test
  fun `vi kan slette et testgrunnlag, hvis den ikke er startet`() {
    val nyttTestgrunnlag =
        TestgrunnlagAPIClient.NyttTestgrunnlag(
            kontrollId = kontrollId,
            namn = testgrunnlagNamne,
            type = TestgrunnlagType.RETEST,
            sideutval = emptyList(),
            testregelIdList = emptyList(),
        )
    val testgrunnlag = kontrollResource.nyttTestgrunnlag(kontrollId, nyttTestgrunnlag).body!!
    val response = kontrollResource.slettTestgrunnlag(kontrollId, testgrunnlag.id)

    assertThat(response.statusCode).isEqualTo(HttpStatus.NO_CONTENT)
  }

  @Test
  fun `vi får ikke lov til å slette et testgrunnlag, hvis testen har startet`() {
    val loeysingId = fakeId()
    val testregelId = fakeId()
    val sideutvalId = fakeId()

    val nyttTestgrunnlag =
        TestgrunnlagAPIClient.NyttTestgrunnlag(
            kontrollId = kontrollId,
            namn = testgrunnlagNamne,
            type = TestgrunnlagType.RETEST,
            sideutval =
                listOf(
                    Sideutval(
                        loeysingId, fakeId(), siteutvalNamn, URI(dummyUrl), null, sideutvalId)),
            testregelIdList = listOf(testregelId),
        )
    val testgrunnlag = kontrollResource.nyttTestgrunnlag(kontrollId, nyttTestgrunnlag).body
    val testgrunnlagId = testgrunnlag?.id!!

    val createTestResultat =
        CreateTestResultat(
            testgrunnlagId = testgrunnlagId,
            loeysingId = loeysingId,
            testregelId = testregelId,
            sideutvalId = sideutvalId,
            brukar = Brukar(emailAddress, brukarNamn),
            elementOmtale = null,
            elementResultat = null,
            elementUtfall = null,
            testVartUtfoert = null,
            kommentar = null)
    val testResult = testResource.createTestResultat(createTestResultat)

    testResource.updateResultatManuellKontroll(
        listOf(
            testResult.copy(
                kommentar = "Ferdig",
                elementOmtale = elementOmtale,
                elementResultat = ElementResultat.brot,
                elementUtfall = elementUtfall,
                testVartUtfoert = Instant.now(),
                status = ResultatManuellKontroll.Status.Ferdig)))

    val deleteResponse = kontrollResource.slettTestgrunnlag(kontrollId, testgrunnlagId)
    assertThat(deleteResponse.statusCode).isEqualTo(HttpStatus.FORBIDDEN)
  }

  @Test
  fun `vi kan reteste et testgrunnlag, hvis den er ferdig`() {
    val loeysingId = fakeId()
    val testregelId = fakeId()
    val sideutvalId = fakeId()
    val nyttTestgrunnlag =
        TestgrunnlagAPIClient.NyttTestgrunnlag(
            kontrollId = kontrollId,
            namn = testgrunnlagNamne,
            type = TestgrunnlagType.RETEST,
            sideutval =
                listOf(
                    Sideutval(
                        loeysingId, fakeId(), "Eit sideutval", URI(dummyUrl), null, sideutvalId)),
            testregelIdList = listOf(testregelId),
        )
    val testgrunnlag = kontrollResource.nyttTestgrunnlag(kontrollId, nyttTestgrunnlag).body
    val testgrunnlagId = testgrunnlag?.id!!

    val createTestResultat =
        CreateTestResultat(
            testgrunnlagId = testgrunnlagId,
            loeysingId = loeysingId,
            testregelId = testregelId,
            sideutvalId = sideutvalId,
            brukar = Brukar(emailAddress, brukarNamn),
            elementOmtale = null,
            elementResultat = null,
            elementUtfall = null,
            testVartUtfoert = null,
            kommentar = null)

    val testResult = testResource.createTestResultat(createTestResultat)

    testResource.updateResultatManuellKontroll(
        listOf(
            testResult.copy(
                kommentar = "Ferdig",
                elementOmtale = elementOmtale,
                elementResultat = ElementResultat.brot,
                elementUtfall = elementUtfall,
                testVartUtfoert = Instant.now(),
                status = ResultatManuellKontroll.Status.Ferdig)))

    val retestResponse: ResponseEntity<KontrollResource.TestgrunnlagDTO> =
        kontrollResource.createRetest(kontrollId, Retest(testgrunnlagId, loeysingId))

    assertThat(retestResponse.statusCode).isEqualTo(HttpStatus.OK)
  }

  @Test
  fun `vi får ikke lov til å slette et testgrunnlag, hvis ikkje alle testresultat er ferdig`() {
    val loeysingId = fakeId()
    val testregelId = fakeId()
    val sideutvalId = fakeId()
    val nyttTestgrunnlag =
        TestgrunnlagAPIClient.NyttTestgrunnlag(
            kontrollId = kontrollId,
            namn = "Eit testgrunnlag",
            type = TestgrunnlagType.RETEST,
            sideutval =
                listOf(
                    Sideutval(
                        loeysingId, fakeId(), "Eit sideutval", URI(dummyUrl), null, sideutvalId)),
            testregelIdList = listOf(testregelId),
        )
    val testgrunnlag = kontrollResource.nyttTestgrunnlag(kontrollId, nyttTestgrunnlag).body
    val testgrunnlagId = testgrunnlag?.id!!

    val createTestResultat =
        CreateTestResultat(
            testgrunnlagId = testgrunnlagId,
            loeysingId = loeysingId,
            testregelId = testregelId,
            sideutvalId = sideutvalId,
            brukar = Brukar(emailAddress, brukarNamn),
            elementOmtale = null,
            elementResultat = null,
            elementUtfall = null,
            testVartUtfoert = null,
            kommentar = null)

    // Status ikkje starta
    testResource.createTestResultat(createTestResultat)

    val retestResponse =
        kontrollResource.createRetest(kontrollId, Retest(testgrunnlagId, loeysingId))

    assertThat(retestResponse.statusCode).isEqualTo(HttpStatus.FORBIDDEN)
  }
}
