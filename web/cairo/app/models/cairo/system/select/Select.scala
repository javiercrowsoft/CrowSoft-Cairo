package models.cairo.system.select

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import services.db.DB
import play.api.Play.current
import models.domain.CompanyUser
import play.api.Logger
import play.api.libs.json._
import scala.util.control.{NonFatal, ControlThrowable}

case class Column(name: String, columnType: String)
case class Row(id: Int, values: List[String])

case class RecordSet(rows: List[Row], columns: List[Column])

object Select {

  def get(
           user: CompanyUser,
           tableId: Int,
           filter: String,
           active: Boolean,
           useSearch: Boolean,
           internalFilter: String): RecordSet = {
    RecordSet(List(Row(1,List("Virginia","Diaz")),Row(1,List("Javier","Alvarez"))), List(Column("Nombre", "String"), Column("Apellido", "String")))
  }

  def getSqlstmt(sqlstmt: String, haveActive: Boolean, tableName: String, filter: String, likeIndex: Int): String = {
    if(sqlstmt.toLowerCase().startsWith("select")) {

      val select = getSelectClause(sqlstmt)
      val from = getFromClause(sqlstmt)
      val where = getWhereClause(sqlstmt)
      val groupBy = getGroupByClause(sqlstmt)
      val orderBy = getOrderByClause(sqlstmt)
    }
    else {

    }
  }

  def getSelectClause(sqlstmt: String): String = {

  }

  def getFromClause(sqlstmt: String): String = {

  }

  def getWhereClause(sqlstmt: String): String = {

  }

  def getGroupByClause(sqlstmt: String): String = {

  }

  def getOrderByClause(sqlstmt: String): String = {

  }

/*
Private Function GetItems(ByVal sqlstmt As String, _
                          ByVal bHaveActive As Boolean, _
                          ByVal tblName As String, _
                          ByVal filter As String, _
                          ByVal iLike As Long) As Boolean
  Dim rs As ADODB.Recordset
  Dim bNoSort As Boolean

  If Not m_Form Is Nothing Then
    m_Form.HaveTop = False
  End If

  If InStr(1, sqlstmt, "select", vbTextCompare) > 0 Then

    bNoSort = False

    Dim sSelect  As String
    Dim sFrom    As String
    Dim sWhere   As String
    Dim sGroupBy As String
    Dim sOrder   As String
    Dim strTop   As String

    sSelect = gDB.GetSelect(sqlstmt)
    sFrom = gDB.GetFrom(sqlstmt)
    sWhere = gDB.GetWhere(sqlstmt)
    sGroupBy = gDB.GetGroup(sqlstmt)
    sOrder = gDB.GetOrder(sqlstmt)

    If Not m_Form Is Nothing Then

      If m_FieldsToFilter = vbNullString Then pGetFieldsToFilter sSelect, sFrom

      strTop = " " & sSelect
      strTop = Replace(strTop, " select ", "")
      strTop = Left$(Trim(strTop), 4)
      If LCase(strTop) = "top " Then
        m_Form.HaveTop = True
      End If
    End If

    ' Habria que agregar el filtro al sqlstmt
    If LenB(Trim(filter)) Or LenB(Trim(m_Filter)) Or LenB(Trim(m_FieldValueProcess)) Or bHaveActive Then

      filter = pGetFilter(filter, iLike)

      If LenB(Trim(filter)) Then
        If LenB(Trim(sWhere)) Then
          sWhere = sWhere & " and (" & filter & ")"
        Else
          sWhere = " where (" & filter & ")"
        End If
      End If

      If LenB(Trim(m_Filter)) Then
        If LenB(Trim(sWhere)) Then
          sWhere = sWhere & " and (" & m_Filter & ")"
        Else
          sWhere = " where (" & m_Filter & ")"
        End If
      End If

      If bHaveActive And Not m_bForAbm Then
        If LenB(Trim(sWhere)) Then
          sWhere = sWhere & " and (" & tblName & ".activo <> 0)"
        Else
          sWhere = " where (" & tblName & ".activo <> 0)"
        End If
      End If

      If LenB(Trim(m_FieldValueProcess)) Then
        sSelect = sSelect & "," & m_FieldValueProcess
      End If

      sqlstmt = sSelect & " " & sFrom & " " & sWhere & " " & sGroupBy & " " & sOrder
    End If

  Else

    If InStr(1, LCase(sqlstmt), "@@no_sort") <> 0 Then
      sqlstmt = Replace(LCase(sqlstmt), "@@no_sort", vbNullString)
      bNoSort = True
    Else
      bNoSort = False
    End If

    m_Form.HaveTop = True
    sqlstmt = sqlstmt & " " & gDB.sqlString(filter) & ",0,0"

    sqlstmt = Replace(LCase(sqlstmt), "@@bforabm", IIf(m_bForAbm, 1, 0))
    sqlstmt = Replace(LCase(sqlstmt), "@@bfiltertype", iLike)

    If LenB(Trim(m_Filter)) Then
      Dim Filter2 As String
      Filter2 = m_Filter
      If Right$(Trim$(Filter2), 1) <> "'" Then Filter2 = "'" & Filter2 & "'"
      sqlstmt = sqlstmt & "," & Filter2
    End If

    If TypeOf m_Form Is fHelp Then

      Dim F As fHelp
      Set F = m_Form

      If F.IsKeyFilterHelp Then

        If LenB(Trim(m_Filter)) Then
          sqlstmt = sqlstmt & "," & F.prch_id
        Else
          sqlstmt = sqlstmt & ",''," & F.prch_id
        End If

      End If
    End If
  End If

  GetItems = gDB.OpenRs(sqlstmt, rs, csRsKeySet, csLockReadOnly, , "GetItems - Para " + m_DiccTabla.Name + "\n" + sqlstmt, "cHelp")

  If bNoSort = False Then
    RsSort rs, 1
  End If

  Set m_Form.rs = rs

End Function

Private Function pGetFilter(ByVal toSearch As String, ByVal iLike As Long) As String
  Dim numberFilter As String
  Dim filter As String

  filter = toSearch

  If filter = vbNullString Then Exit Function
  If m_FieldsToFilter = vbNullString And m_FieldsToFilterInt = vbNullString Then Exit Function
  If Not IsNumeric(filter) And m_FieldsToFilter = vbNullString Then Exit Function

  filter = gDB.sqlString(filter)
  filter = Mid(filter, 2)

  If Len(filter) < 1 Then Exit Function
  filter = Mid(filter, 1, Len(filter) - 1)

  Select Case iLike

    Case 1

      filter = filter & "%"

    Case 3

      filter = Replace(filter, "*", "%")

    Case 4

      filter = "%" & filter

    Case 5

        ' nada que hacer@@filter

    ' Default
    ' case 2 then '%' + @@filter + '%'
    Case Else

      filter = "%" & filter & "%"

  End Select

  If IsNumeric(toSearch) Then
    numberFilter = Replace(m_FieldsToFilterInt, _
                      "|", _
                      " like '" & filter & "') " & vbCrLf & "or (" _
                      )
  End If

  filter = Replace(m_FieldsToFilter, "|", " like '" & filter & "') " & vbCrLf & "or (") & numberFilter

  If Len(filter) < 6 Then Exit Function
  filter = Mid(filter, 1, Len(filter) - 5)

  pGetFilter = "(" & filter
End Function

Private Sub pGetFieldsToFilter(ByVal sSelect As String, _
                               ByVal sFrom As String)

  Dim rs        As ADODB.Recordset
  Dim sqlstmt   As String
  Dim fld       As ADODB.Field

  sqlstmt = sSelect & sFrom & " where 1 = 2"

  If Not gDB.OpenRs(sqlstmt, rs) Then Exit Sub

  m_FieldsToFilter = vbNullString
  m_FieldsToFilterInt = vbNullString

  For Each fld In rs.Fields
    Select Case fld.Type
      Case adVarChar
        m_FieldsToFilter = m_FieldsToFilter & pGetRealName(fld.Name, sSelect) & "|"
      Case adInteger, adDecimal, adDouble, adNumeric
        m_FieldsToFilterInt = m_FieldsToFilterInt & "convert(varchar(20)," & pGetRealName(fld.Name, sSelect) & ")|"
    End Select
  Next
End Sub

Private Function pGetRealName(ByVal ColAlias As String, ByVal sSelect As String) As String
  Dim i As Long
  Dim n As Long
  Dim ColAlias2 As String

  ' Le quito el select
  '
  sSelect = Trim$(sSelect)
  sSelect = Trim$(Mid$(sSelect, 7))

  ' Le quito el top
  '
  If LCase$(Left$(sSelect, 4)) = "top " Then
    sSelect = Trim$(Mid$(sSelect, 5))
    i = InStr(1, sSelect, " ")
    sSelect = Mid$(sSelect, i + 1)
  End If

  ' Le quito los espacios
  '
  sSelect = Replace$(sSelect, " ", "")
  ColAlias = Replace$(ColAlias, " ", "")

  ' Busco casos tipo:  select Nombre = pr_nombrecompra, .....
  '
  ColAlias2 = ColAlias & "="
  n = InStr(1, sSelect, ColAlias2, vbTextCompare)
  If n > 0 Then
    n = n + Len(ColAlias2)
    i = InStr(n, sSelect, ",")
    If i = 0 Then i = Len(sSelect) + 1
    ColAlias = Mid$(sSelect, n, i - n)

  Else
    ' Busco casos tipo:  select pr_nombrecompra as Nombre, .....
    '
    ColAlias2 = "as" & ColAlias
    n = InStr(1, sSelect, ColAlias2, vbTextCompare)
    If n > 0 Then
      i = pGetBeginBlock(n, sSelect, C_StrColon, True) + 1
      If i = 0 Then i = 1
      ColAlias = Mid$(sSelect, i, n - i)
    Else
      ' Busco casos tipo:  select pr_nombrecompra as [Nombre], .....
      '
      ColAlias2 = "as[" & ColAlias
      n = InStr(1, sSelect, ColAlias2, vbTextCompare)
      If n > 0 Then
        i = pGetBeginBlock(n, sSelect, C_StrColon, True) + 1
        If i = 0 Then i = 1
        ColAlias = Mid$(sSelect, i, n - i)
      End If
    End If
  End If
  pGetRealName = ColAlias
End Function

Private Function pGetBeginBlock(ByVal nStart As Long, ByVal sSelect As String, _
                                ByVal sSep As String, ByVal ToBack As Boolean) As Long
  Dim i     As Long
  Dim Max   As Long

  i = nStart
  nStart = 0

  If ToBack Then
    Do While i > 0
      If Mid(sSelect, i, 1) = sSep Then
        nStart = i
        Exit Do
      End If
      i = i - 1
    Loop
  Else
    Max = Len(sSelect) + 1
    Do While i < Max
      If Mid(sSelect, i, 1) = sSep Then
        nStart = i
        Exit Do
      End If
      i = i + 1
    Loop
  End If

  pGetBeginBlock = nStart
End Function
*/

}