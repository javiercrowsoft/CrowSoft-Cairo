package models.cairo.system.select

import java.sql.{Connection, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import services.db.DB
import play.api.Play.current
import models.domain.CompanyUser
import play.api.Logger
import play.api.libs.json._
import scala.util.control.NonFatal
import models.cairo.system.database.{ParsedTable, Table, DBHelper}

case class Column(name: String, columnType: String)
case class Row(id: Int, values: List[String])
case class RecordSet(rows: List[Row], columns: List[Column])

object Select {

  /*
  * returns a RecordSet as the result of executing a query on database
  * defined in the table dictionary. the query can have two filters
  * on from the user and one from the system
  * the system filter is defined in InternalFilter class
  * because the call is made from the client browser we doesn't accept
  * any sql concatenation
  * the system filter is a filter key and a list of parameters
  * the query defined in the table dictionary can be an stored procedure
  * or a simple select
  * if the query is an stored procedure it follows this interface:
  *
  * sp_table_name_select (
                @@emp_id          int,
                @@us_id           int,
                @@bForAbm         tinyint,
                @@filterType      tinyint,
                @@filter 					varchar(255)  = '',
                @@check  					smallint 			= 0,
                @@id              int           = 0,
                @@filter2         varchar(255)  = ''
              )
  *
  * the first four parameters are macros (@@emp_id, @@us_id, @@bForAbm, @@filterType)
  * the filter parameter is the user filter
  * the filter2 parameter is the system filter
  * the check parameter indicates that the stored procedure must check that the id and the name
  * of code match
  *
  * if the query is a simple select there could be one or more columns which will be compare against
  * the user filter. the internalFilter can have additional filters - look at class InternalFilter
  * for more details
  *
  * the useSearch parameter indicates that instead of use the selectStatement the searchStatement
  * must be used
  *
  * there are a customer versions of selectStatement which override the system version. this allows
  * to customize the select with the requirements of every customer
  *
  * */
  def get(
           user: CompanyUser,
           tableId: Int,
           filter: String,
           active: Boolean,
           useSearch: Boolean,
           internalFilter: String,
           like: Int): RecordSet = {

    Table.load(user, tableId) match {
      case Some(table) => {
        val parsedTable = ParsedTable(user.userId, user.cairoCompanyId, table)
        executeSelect(
          parsedTable.selectStatement,
          table.hasActive,
          active,
          table.name,
          filter,
          InternalFilter.getFilter(user,internalFilter),
          like,
          createRecordSet(user, tableId, table.name))
      }
      case None => throw new RuntimeException(s"There is not table definition for tableId: ${tableId}")
    }
  }

  private def executeSelect(
                  sqlSelectDefinition: String,
                  hasActive: Boolean,
                  useActive: Boolean,
                  tableName: String,
                  filter: String,
                  internalFilter: InternalFilter,
                  like: Int,
                  createRecordSet: (String, String, InternalFilter, Int, Boolean) => RecordSet): RecordSet = {

    /*
    * sqlSelectDefinition can contain a query or an stored procedure
    *
    * when sqlSelectDefinition is a query it contains the query and a list of columns used to create the filter
    * this columns are added to the where clause
    *
    * for example:
    *
    *   "select pr_id, pr_codigo, pr_nombreVenta from producto where pr_sevende <> 0|pr_nombreVenta:string, pr_descrip:string, pr_peso:number"
    *
    * this statement will be split in two main parts using the character pipe |
    *
    * the first part is the query
    * the second part is the list of columns used to create the filter
    * this list is called THE FILTER DEFINITION
    *
    * a column definition is a tuple consisting on a column name and a type
    *
    * the character colon is used to split a column definition
    * and the character comma is used to split the filter list
    *
    * */
    def parseDefinition(sqlSelectDefinition: String): (String, List[Column]) = {
      val info = sqlSelectDefinition.split("[|]")
      try {
        val sqlstmt = info(0)
        def getColumn(columnDef: String): Column = {
          val info = columnDef.split("[:]")
          Column(info(0), info(1))
        }
        def getColumns(columnsDefinition: List[String]): List[Column] = columnsDefinition match {
          case Nil => List()
          case columnDef :: tail => getColumn(columnDef) :: getColumns(tail)
        }
        (sqlstmt, getColumns(info(1).split("[,]").toList))
      }
      catch {
        case NonFatal(e) => {
          val message = s"Error when parsing sqlstmt for table ${tableName}. Definition: ${sqlSelectDefinition}]. Error ${e.toString}"
          Logger.error(message)
          throw new RuntimeException(message)
        }
      }
    }

    def filterForColumn(column: Column, operator: String): String = {
      column.name + (if(column.columnType == "number") "::varchar " else " ") + operator + " ? "
    }

    def applyFilter(filter: String, columns: List[Column], operator: String): String = {
      if(filter.isEmpty) ""
      else {
        if(columns.length == 0) ""
        else "(" + columns.map(filterForColumn(_, operator)).mkString(" or ") + ")"
      }
    }

    def getFilter(condition: String, operator: String): String = {
      if(condition.isEmpty) ""
      else s" ${operator} ${condition}"
    }

    def getWhere(where: String, conditions: String, activeFilter: String, internalFilter: String): String = {
      val wc = if(where.isEmpty) s" where ${conditions}" else where + getFilter(conditions, "and")
      val wca = if(wc.isEmpty) s" where ${activeFilter}" else wc + getFilter(activeFilter, "and")
      (if(wca.isEmpty) s" where ${internalFilter}" else wca + getFilter(internalFilter, "and")) + " "
    }

    def getTop(top: Int): String = {
      if(top > 0) " limit " + top.toString
      else " limit 300" // TODO: this should be set in global and database configuration
    }

    def getInternalFilter(): String = {
      if(internalFilter.isEmpty) ""
      else s"(${internalFilter.query})"
    }

    def applyLike(filter: String): String = {
      like match {
        case 1 => s"$filter%"
        case 3 => filter.replaceAll("[*]", "%")
        case 4 => s"%$filter"
        case _ => s"%$filter%" // 2 is default => %filter%
      }
    }

    parseDefinition(sqlSelectDefinition) match {
      case (sql, columns) => {
        val sqlstmt = sql.toLowerCase()
        if (sqlstmt.startsWith("select")) {
          val select = DBHelper.removeTopClause(DBHelper.getSelectClause(sqlstmt))
          val from = DBHelper.getFromClause(sqlstmt)
          val where = DBHelper.getWhereClause(sqlstmt)
          val groupBy = DBHelper.getGroupByClause(sqlstmt)
          val orderBy = DBHelper.getOrderByClause(sqlstmt)
          val top = DBHelper.getTopValue(sqlstmt)
          val conditions = applyFilter(filter, columns, " like ")
          val activeFilter = if(hasActive && useActive) s"(${tableName}.activo <> 0)" else ""
          val statement = select +
                          from +
                          getWhere(where, conditions, activeFilter, getInternalFilter()) +
                          groupBy +
                          orderBy +
                          getTop(top)
          createRecordSet(statement, applyLike(filter), internalFilter, columns.length, false)
        }
        else {
          /*
          * when the query is an stored procedure it has to follow this conventions:
          *
          * - Macros can be declared: @@emp_id, @@us_id, @@bForABM, @@filterType

          * - the parameters must be: filter, check, id, filter2
          *
          * for example:
          *
              create procedure sp_CodigoPostalHelp (
                @@emp_id          int,
                @@us_id           int,
                @@bForAbm         tinyint,
                @@filterType      tinyint,
                @@filter 					varchar(255)  = '',
                @@check  					smallint 			= 0,
                @@cpa_id          int           = 0,
                @@filter2         varchar(255)  = ''
              )

              for the above declaration the sqlstmt will be

              "sp_CodigoPostalHelp @@emp_id,@@us_id,@@bForAbm,@@filterType,"

              @@emp_id and @@us_id will be processed by ParsedTable

              @@bForAbm and @@filterType will be processed here

              filter will be passed here

              after filter "0, 0" will be passed as @@check and @@cpa_id (which is id)

              then internalFilter will be passed

              the last parameter is the returned cursor

          * */

          def processMacros(statement: String): String = {
            statement
              .replaceAll("[@][@]bforabm", if(useActive) "1" else "0")
              .replaceAll("[@][@]filtertype", like.toString())
          }
          val function = processMacros(sqlstmt) + "?, 0, 0, ?, ?"
          createRecordSet(function, filter, internalFilter, 1, true)
        }
      }
    }
  }

  private def createRecordSet(user: CompanyUser, tableId: Int, table: String)
                             (sqlstmt: String, filter: String, internalFilter: InternalFilter, paramCount: Int,
                              isFunction: Boolean): RecordSet = {
    if(isFunction) executeStoredProcedure(user, tableId, table)(sqlstmt, filter, internalFilter, paramCount)
    else executeQuery(user, tableId, table)(sqlstmt, filter, internalFilter, paramCount)
  }

  private def executeStoredProcedure(user: CompanyUser, tableId: Int, table: String)
                                    (sqlstmt: String, filter: String, internalFilter: InternalFilter,
                                     paramCount: Int): RecordSet = {

    Logger.debug(sqlstmt)

    DB.withTransaction(user.database.database) { implicit connection =>

      val cs = connection.prepareCall(sqlstmt)

      for (index <- 1 to paramCount) {
        cs.setString(index, filter)
      }

      // internalFilter must be the last input parameter
      //
      if(!internalFilter.isEmpty) cs.setString(paramCount + 1, internalFilter.query)

      val cursorParamIndex = paramCount + (if(internalFilter.isEmpty) 1 else 2)

      cs.registerOutParameter(cursorParamIndex, Types.OTHER)

      try {

        cs.execute()
        createRows(cs.getObject(cursorParamIndex).asInstanceOf[java.sql.ResultSet])

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get list for table ${table} id ${tableId}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  private def executeQuery(user: CompanyUser, tableId: Int, table: String)
                          (sqlstmt: String, filter: String, internalFilter: InternalFilter, paramCount: Int): RecordSet = {

    Logger.debug(sqlstmt)

    DB.withTransaction(user.database.database) { implicit connection =>

      val ps = connection.prepareStatement(sqlstmt)

      for (index <- 1 to paramCount) {
        ps.setString(index, filter)
      }

      // internalFilter must be the last input parameter
      //
      if(!internalFilter.isEmpty) DBHelper.applyParameters(ps, paramCount, internalFilter.filters)

      try {

        createRows(ps.executeQuery())

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get list for table ${table} id ${tableId}. Error ${e.toString}")
          throw e
        }
      } finally {
        ps.close
      }
    }
  }

  private def createRows(rs: ResultSet): RecordSet = {
    try {
      lazy val metaData = rs.getMetaData()
      lazy val columnIndex = 2.to(metaData.getColumnCount()).toList

      def createRow(): Row = {
        Row(rs.getInt(1), DBHelper.getValues(rs, metaData, columnIndex))
      }

      def createColumns(): List[Column] = {
        val columns = for {
          i <- columnIndex
        } yield {
          Column(metaData.getColumnName(i), metaData.getColumnTypeName(i))
        }
        columns
      }

      def fillList(): List[Row] = {
        if (rs.next()) {
          createRow() :: fillList()
        }
        else {
          List()
        }
      }

      if (rs.next) {
        RecordSet(createRow() :: fillList(), createColumns())
      }
      else {
        RecordSet(List(), List())
      }

    } finally {
      rs.close
    }
  }

}