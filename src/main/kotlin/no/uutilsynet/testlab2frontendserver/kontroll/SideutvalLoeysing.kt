package no.uutilsynet.testlab2frontendserver.kontroll

import no.uutilsynet.testlab2frontendserver.testreglar.dto.InnhaldstypeTesting

data class InnhaldstypeKontroll(
    override val id: Int,
    override val innhaldstype: String,
    val egendefinertType: String? = null,
) : InnhaldstypeTesting(id, innhaldstype)

data class Side(val begrunnelse: String, val url: String)

data class Sideutval(val type: InnhaldstypeKontroll, val sideBegrunnelseList: List<Side>)

data class SideutvalLoeysing(val loeysingId: Int, val sideUtval: List<Sideutval>)
