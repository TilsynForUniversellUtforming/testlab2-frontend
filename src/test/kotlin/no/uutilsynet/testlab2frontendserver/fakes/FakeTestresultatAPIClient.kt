package no.uutilsynet.testlab2frontendserver.fakes

import java.net.URI
import no.uutilsynet.testlab2frontendserver.testing.CreateTestResultat
import no.uutilsynet.testlab2frontendserver.testing.ITestresultatAPIClient
import no.uutilsynet.testlab2frontendserver.testing.ResultatManuellKontroll

object FakeTestresultatAPIClient : ITestresultatAPIClient {
  private val database = mutableMapOf<Int, ResultatManuellKontroll>()

  override fun createTestResultat(createTestResultat: CreateTestResultat): Result<URI> {
    val id = fakeId()
    val testResultat =
        ResultatManuellKontroll(
            id,
            createTestResultat.testgrunnlagId,
            createTestResultat.loeysingId,
            createTestResultat.testregelId,
            createTestResultat.sideutvalId,
            createTestResultat.brukar,
            null,
            null,
            null,
            emptyList(),
            null,
            ResultatManuellKontroll.Status.IkkjePaabegynt,
            null)
    database[id] = testResultat
    return Result.success(URI.create("http://localhost:8080/testresultat/$id"))
  }

  override fun getResultatForTestgrunnlag(
      testgrunnlagId: Int
  ): Result<List<ResultatManuellKontroll>> {
    val testResultatList = database.values.filter { it.testgrunnlagId == testgrunnlagId }
    return Result.success(testResultatList)
  }
}
