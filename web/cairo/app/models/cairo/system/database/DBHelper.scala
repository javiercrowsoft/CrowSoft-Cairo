package models.cairo.system.database

import java.sql.{ResultSet, ResultSetMetaData, PreparedStatement, Types, Date, CallableStatement, SQLException}

import anorm._
import models.domain.CompanyUser
import play.api.Logger
import services.db.DB
import services.G
import play.api.Play.current
import scala.util.control.NonFatal

case class QueryParameter(value: Any)

case class SaveResult(success: Boolean, id: Int)

object DBHelper {

  val NoId = 0

  val CREATED_AT = "creado"
  val UPDATED_AT = "modificado"
  val UPDATED_BY = "modifico"
  val ACTIVE = "activo"

  def getSelectClause(sqlstmt: String): String = {
    val i = sqlstmt.indexOf("from")
    if(i == -1) sqlstmt
    else sqlstmt.substring(0, i)
  }

  def removeTopClause(sqlstmt: String): String = {
    val s = sqlstmt.substring(6).trim()
    if(s.length > 5 && s.substring(0, 4) == "top ") {
      val t = s.substring(4).trim()
      val i = t.indexOf(" ")
      sqlstmt.substring(0,6) + (if(i > 0) t.substring(i) else "") + " "
    }
    else sqlstmt
  }

  private def getUntil(sqlstmt: String, clauses: List[String]): String = clauses match {
    case Nil => sqlstmt
    case clause :: tail => {
      val j = sqlstmt.indexOf(clause)
      if (j >= 0) sqlstmt.substring(0, j)
      else getUntil(sqlstmt, tail)
    }
  }

  def getFromClause(sqlstmt: String): String = {
    val i = sqlstmt.indexOf("from")
    if(i == -1) ""
    else getUntil(sqlstmt.substring(i), List("where", "group by", "order by"))
  }

  def getWhereClause(sqlstmt: String): String = {
    val i = sqlstmt.indexOf("where")
    if(i == -1) ""
    else getUntil(sqlstmt.substring(i), List("group by", "order by"))
  }

  def getGroupByClause(sqlstmt: String): String = {
    val i = sqlstmt.indexOf("group by")
    if(i == -1) ""
    else getUntil(sqlstmt.substring(i), List("order by"))
  }

  def getOrderByClause(sqlstmt: String): String = {
    val i = sqlstmt.indexOf("order by")
    if(i == -1) ""
    else sqlstmt.substring(i)
  }

  def getTopValue(sqlstmt: String): Int = {
    val s = sqlstmt.substring(6).trim()
    if(s.length > 5 && s.substring(0, 4) == "top ") {
      val t = s.substring(4).trim()
      val i = t.indexOf(" ")
      if(i > 0) t.substring(0, i).toInt
      else t.toInt
    }
    else -1
  }

  def getValues(rs: ResultSet, metaData: ResultSetMetaData, columnIndex: List[Int]): List[String] = {
    for {
      i <- columnIndex
    } yield {
      getValue(rs, metaData, i) match {
        case Some(v) => v.toString()
        case None => ""
      }
    }
  }

  def getValue(rs: ResultSet, metaData: ResultSetMetaData, i: Int): Option[Any] = {
    val value = metaData.getColumnTypeName(i).toLowerCase match {
      case "integer" => rs.getInt(i)
      case "int2" => rs.getInt(i)
      case "int4" => rs.getLong(i)
      case "smallint" => rs.getInt(i)
      case "biginteger" => rs.getLong(i)
      case "serial" => rs.getLong(i)
      case "bigserial" => rs.getLong(i)
      case "decimal" => rs.getBigDecimal(i)
      case "real" => rs.getBigDecimal(i)
      case "timestamp" => rs.getDate(i)
      case "date" => rs.getDate(i)
      case "time" => rs.getTime(i)
      case "character" => rs.getString(i)
      case "char" => rs.getString(i)
      case "varchar" => rs.getString(i)
      case "text" => rs.getString(i)
      case "character varying" => rs.getString(i)
      case other => s"unclassified type: $other val:${rs.getObject(i).toString}"
    }
    Option(value)
  }

  def applyParameters(ps: PreparedStatement, parameters: List[QueryParameter]): Unit = {
    applyParameters(ps, 1, parameters)
  }

  def applyParameters(ps: PreparedStatement, index: Int, parameters: List[QueryParameter]): Unit = parameters match {
    case Nil =>
    case h :: t => {
      applyParameter(ps, index, h)
      applyParameters(ps, index + 1, t)
    }
  }

  private def applyParameter(ps: PreparedStatement, index: Int, param: QueryParameter): Unit = param match {
    case QueryParameter(filter: Int) => ps.setInt(index, filter)
    case QueryParameter(filter: String) => ps.setString(index, filter)
    case QueryParameter(filter: Float) => ps.setFloat(index, filter)
    case QueryParameter(filter: Date) => ps.setDate(index, filter)
  }

  def getIntValue(user: CompanyUser, sqlstmt: String, filters: List[QueryParameter], noDataFoundValue: Any): Option[Int] = {
    getValue(user, sqlstmt, filters, noDataFoundValue) match {
      case Some(v) => Option(v.asInstanceOf[Int])
      case None => None
    }
  }

  def getIntValue(user: CompanyUser, sqlstmt: String, filters: List[QueryParameter]): Int = {
    getValue(user, sqlstmt, filters, 0) match {
      case Some(v) => v.asInstanceOf[Int]
      case None => 0
    }
  }

  def getValue(user: CompanyUser, sqlstmt: String, filters: List[QueryParameter], noDataFoundValue: Any): Option[Any] = {

    Logger.debug(sqlstmt)

    DB.withTransaction(user.database.database) { implicit connection =>

      val ps = connection.prepareStatement(sqlstmt)

      applyParameters(ps, filters)

      try {

        val rs = ps.executeQuery()

        try {

          if (rs.next) {
            getValue(rs, rs.getMetaData(), 1)
          }
          else {
            Option(noDataFoundValue)
          }

        } finally {
          rs.close
        }
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't execute statement ${sqlstmt}. Error ${e.toString}")
          throw e
        }
      } finally {
        ps.close
      }
    }
  }

  def getNewId(user: CompanyUser, table: String, fieldId: String): Int = {
    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = s"{call SP_DBGetNewId(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setString(1, table)
      cs.setString(2, fieldId)
      cs.registerOutParameter(3, Types.INTEGER)
      cs.setInt(4, 0)

      try {

        cs.execute()
        cs.getInt(3)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"failed to execute getNewId . Table: $table - Field Id: $fieldId. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def save(user: CompanyUser, register: Register, isNew: Boolean): SaveResult = {
    saveEx(user, register, isNew, "")
  }

  def saveEx(user: CompanyUser, register: Register, isNew: Boolean, fieldCode: String): SaveResult = {

    def update(s: SqlStatement) = {
      Logger.debug(s"in DBHelper.saveEx - update: ${s.sqlstmt}")
      DB.withConnection(user.database.database) { implicit connection =>
        SQL(s.sqlstmt).on(s.parameters: _*).executeUpdate
      }
      register.id
    }

    //
    // only used when register.useIdentity == true
    //
    def insert(s: SqlStatement) = {
      Logger.debug(s"in DBHelper.saveEx - insert: ${s.sqlstmt}")
      DB.withConnection(user.database.database) { implicit connection =>
        SQL(s.sqlstmt).on(s.parameters: _*).executeInsert().map(id => id.toInt).getOrElse(throw new RuntimeException(s"Error when inserting ${register.table}"))
      }
    }

    def getId(isNewRecord: Boolean) = {
      if(isNewRecord && !register.useIdentity && !register.fieldId.isEmpty) {
        getNewId(user, register.table, register.fieldId)
      }
      else NoId
    }

    def updateCode(newId: Int) = {
      def getField(f: Field) = {
        val GET_CODE_FROM_ID = "'(@@get_code_from_id@@)'"
        if(f.name == fieldCode && f.value == GET_CODE_FROM_ID) {
          val id = (if(newId != NoId) newId else register.id).toString()
          val value = G.padLeft(id, 5, "0")
          Field(f.name, value, f.fieldType)
        }
        else f
      }
      def getFields(fields: List[Field]): List[Field] = fields match {
        case Nil => List()
        case h :: t => getField(h) :: getFields(t)
      }
      Register(
        register.table,
        register.fieldId,
        register.id,
        register.useIdentity,
        register.hasTimestamp,
        register.hasUpdatedBy,
        getFields(register.fields))
    }

    val isNewRecord = register.id == NoId
    val newId = getId(isNewRecord)
    val useInsert = (if(isNewRecord) true else isNew)

    Logger.debug(s"in DBHelper.saveEx: isNewRecord ${isNewRecord}. useInsert ${useInsert}. isNew ${isNew}")

    val r = if(fieldCode.isEmpty) register else updateCode(newId)

    val s = Register.getSqlSave(user, r, useInsert, newId)
    val execute = if(useInsert && register.useIdentity) insert _ else update _

    try {

      val id = execute(s)
      SaveResult(true, id)

    }
    catch {
      case NonFatal(e) => {

        Logger.error(s"failed to execute saveEx: ${r.toString}. Error ${e.toString}")
        SaveResult(false, NoId)

      }
    }
  }

  def delete(user: CompanyUser, register: Register) = {
    DB.withConnection(user.database.database) { implicit connection =>
      val s = Register.getSqlDelete(register)
      SQL(s.sqlstmt).on(s.parameters: _*).executeUpdate
    }
  }

}