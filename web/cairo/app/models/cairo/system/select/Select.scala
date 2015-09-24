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
case class Row(id: String, values: List[String])
case class RecordSet(rows: List[Row], columns: List[Column])

object Select {

  /*
  * returns a RecordSet as the result of executing a query on database
  * defined in the table dictionary. the query can have two filters
  * on from the user and one from the system
  * the system filter is defined in InternalFilter class
  * because the call is made from the client browser we don't accept
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

    def executeSelect(
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
          if(info.length == 1) (sqlstmt, List())
          else (sqlstmt, getColumns(info(1).split("[,]").toList))
        }
        catch {
          case NonFatal(e) => {
            val message = s"Error when parsing sqlstmt for table ${tableName}. Definition: ${sqlSelectDefinition}]. Error ${e.toString}"
            Logger.error(message)
            throw new RuntimeException(message)
          }
        }
      }

      def getTop(top: Int): String = {
        if(top > 0) " limit " + top.toString
        else " limit 300" // TODO: this should be set in global and database configuration
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
          if(sqlstmt.startsWith("select")) {
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
              getWhere(where, conditions, activeFilter, getInternalFilter(internalFilter)) +
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
                .replaceAll("[@][@]bforabm", if(useActive) "0" else "1")
                .replaceAll("[@][@]filtertype", like.toString())
            }
            val function = processMacros(sqlstmt) + " ?, 0, ?, ?, ?"
            createRecordSet(function, filter, internalFilter, 1, true)
          }
        }
      }
    }

    def createRecordSet(user: CompanyUser, tableId: Int, table: String)
                       (sqlstmt: String, filter: String, internalFilter: InternalFilter, paramCount: Int, isFunction: Boolean): RecordSet = {
      Logger.debug(s"table: ${table} tableId: ${tableId} filter: ${filter} isFunction: ${isFunction} internalFilter:${internalFilter.toString()}")
      if(isFunction) executeStoredProcedure(user, tableId, table, getCallStatement(sqlstmt), filter.toLowerCase(), 0, internalFilter)
      else executeQuery(user, tableId, table, sqlstmt, filter.toLowerCase(), internalFilter, paramCount)
    }

    def getFilter = {
      if(filter == "**") "%" else filter
    }

    Table.load(user, tableId) match {
      case Some(table) => {
        val parsedTable = ParsedTable(user.userId, user.cairoCompanyId, table)
        executeSelect(
          parsedTable.selectStatement,
          table.hasActive,
          active,
          table.realName,
          getFilter,
          InternalFilter.getFilter(user, internalFilter),
          like,
          createRecordSet(user, tableId, table.name))
      }
      case None => throw new RuntimeException(s"There is not table definition for tableId: ${tableId}")
    }

  }


  /*
  * returns a RecordSet as the result of executing a query on database
  * defined in the table dictionary
  *
  * the query can have one internal filter defined in InternalFilter class
  * because the call is made from the client browser we don't accept
  * any sql concatenation
  * the system filter is a filter key and a list of parameters
  *
  * the query defined in the table dictionary can be an stored procedure
  * or a simple select. if the query is stored procedure it will handle the
  * validation
  *
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
  * if the query is a simple select a validation query will be created using the definition of the
  * table. this query will ensure the text and id are related. if the text is empty this function will
  * return an empty RecordSet. if the text is not an empty string the query will search
  * for a row in the table which code or name column is equals to the text parameter.
  *
  * the query will look like:
  *
  *    select doc_id from documento
  *    where
  *         (  doc_codigo = 'Factura de Venta en Pesos'
  *         or doc_nombre = 'Factura de Venta en Pesos'
  *         )
  *    and activo <> 0
  *    and emp_id = 1
  *
  * the above sentence is created using the definition of the table found in the dictionary (the table Tabla in the database)
  *
  * if the definition of the table in the dictionary states that the table has an is_active column the
  * query will have a condition like " and activo <> 0 " as in this example
  *
  * the last condition in the where clause ( and emp_id = 1 ) in this example is defined not in the dictionary but in the
  * internalFilter parameter
  *
  * the internalFilter can have additional filters - look at class InternalFilter
  * for more details
  *
  * there are a customer versions of selectStatement which override the system version. this allows
  * to customize the select with the requirements of every customer
  *
  * ///////////////////////////
  *   BRANCH SELECTION
  * ///////////////////////////
  *
  * there is an especial case of validation which handles the selection of a branch instead of o a row
  *
  * the majority of the master tables are classified using the tree structure defined in the tables Arbol-Rama-Hoja
  * in the database
  *
  * there are some cases when selecting a row from a master table allows the user to chose a branch too. it is very
  * useful in the parametrization of reports where the user can choose a set of rows through selecting a branch
  *
  * in Cairo there is not use for this concept of " please list me the balance for customers which code filed is
  * in the range 10000 to 90000 " that kind of filter is nonsense.
  *
  * in Cairo the rows of a master table should be classified in a tree hierarchy. the table can be classified
  * by different criteria. every criterion have its own tree
  *
  * for example the customer table can be classified by region by one tree and by salesman by other tree
  *
  * this allow the report to have less parameters. instead of have a parameter for region and other for salesman
  * it only need to have one parameter for customer.
  *
  * other example will be a balance customer report which has a region parameter which allows you to select more than
  * one region so instead of selecting one state/province from the south of the country you can select all regions/province
  * in the south
  *
  * */
  def validate(
               user: CompanyUser,
               tableId: Int,
               text: String,
               textId: String,
               active: Boolean,
               internalFilter: String): RecordSet = {

    val NODE_PREFIX = "N"

    def executeSelect(
                       sqlSelectDefinition: String,
                       table: Table,
                       useActive: Boolean,
                       text: String,
                       nodeOrTextId: String,
                       internalFilter: InternalFilter,
                       createRecordSet: (String, String, Int, InternalFilter, Int, Boolean) => RecordSet): RecordSet = {

    /*
    * sqlSelectDefinition can contain a query or an stored procedure
    */

      def getNodeId = {
        if(nodeOrTextId.startsWith(NODE_PREFIX)) {
          nodeOrTextId.substring(1).toInt
        }
        else {
          0
        }
      }

      def getId = {
        if(nodeOrTextId.startsWith(NODE_PREFIX)) {
          0
        }
        else {
          if(nodeOrTextId.isEmpty) 0 else nodeOrTextId.toInt
        }
      }

      val nodeId = getNodeId
      val id = getId

      def parseDefinition(sqlSelectDefinition: String): (String, List[Column]) = {
        val info = sqlSelectDefinition.split("[|]")
        try {
          (info(0), List())
        }
        catch {
          case NonFatal(e) => {
            val message = s"Error when parsing sqlstmt for table ${table.name}. Definition: ${sqlSelectDefinition}]. Error ${e.toString}"
            Logger.error(message)
            throw new RuntimeException(message)
          }
        }
      }

      val hasCodeColumn = (!table.codeColumn.isEmpty && table.codeColumn != table.nameColumn)

      def getColumns = {
        if(hasCodeColumn) {
          List(Column(table.nameColumn, "string"), Column(table.codeColumn, "string"))
        }
        else {
          List(Column(table.nameColumn, "string"))
        }
      }

      def getCodeColumn = {
        if(hasCodeColumn) s", ${table.codeColumn}" else ""
      }

      def getSqlstmt(sqlstmt: String) = {
        if(table.selectStatement.isEmpty && table.customerSelectStatement.isEmpty) {
          val select = s"select ${table.idColumn}, ${table.nameColumn}${getCodeColumn} from ${table.realName}"
          val where = if(table.whereStatement.isEmpty) "" else s" where (${table.whereStatement})"
          select + where
        }
        else {
          sqlstmt
        }
      }

      // if it is a branch
      //
      if(nodeId != 0) {
        val statement =
          s"""
             |select 'N' || ram_id::varchar, ram_nombre
             |from rama
             |inner join arbol on rama.arb_id = arbol.arb_id
             |where arbol.tbl_id = ${tableId} and ram_id = ${nodeId}
           """.stripMargin
        createRecordSet(statement, text, 0, internalFilter, 0, false)
      }
      // if it is a row
      //
      else {
        parseDefinition(sqlSelectDefinition) match {
          case (sql, columns) => {
            val sqlstmt = sql.toLowerCase()
            if(sqlstmt.startsWith("select")) {
              val columns = getColumns
              val activeFilter = if(table.hasActive) s"(${table.realName}.activo <> 0)" else ""
              val conditions = applyFilter(text, columns, " = ")
              val sql = getSqlstmt(sqlstmt)
              val select = DBHelper.removeTopClause(DBHelper.getSelectClause(sql))
              val from = DBHelper.getFromClause(sql)
              val where = DBHelper.getWhereClause(sql)
              val groupBy = DBHelper.getGroupByClause(sql)
              val orderBy = DBHelper.getOrderByClause(sql)

              val statement = select +
                from +
                getWhere(where, conditions, activeFilter, getInternalFilter(internalFilter)) +
                groupBy +
                orderBy
              createRecordSet(statement, text, 0, internalFilter, columns.length, false)
            }
            else {
              /*
            * when the query is a stored procedure it has to follow this conventions:
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
                  .replaceAll("[@][@]bforabm", if(useActive) "0" else "1")
                  .replaceAll("[@][@]filtertype", "0")
              }
              val function = processMacros(sqlstmt) + " ?, 1, ?, ?, ?"
              createRecordSet(function, text, id, internalFilter, 1, true)
            }
          }
        }
      }
    }

    def createRecordSet(user: CompanyUser, tableId: Int, table: String)
                       (sqlstmt: String, text: String, id: Int, internalFilter: InternalFilter, paramCount: Int, isFunction: Boolean): RecordSet = {
      Logger.debug(s"table: ${table} tableId: ${tableId} text: ${text} id: ${id} isFunction: ${isFunction} internalFilter:${internalFilter.toString()}")
      if(isFunction) executeStoredProcedure(user, tableId, table, getCallStatement(sqlstmt), text.toLowerCase(), id, internalFilter)
      else executeQuery(user, tableId, table, sqlstmt, text.toLowerCase(), internalFilter, paramCount)
    }

    Table.load(user, tableId) match {
      case Some(table) => {
        val parsedTable = ParsedTable(user.userId, user.cairoCompanyId, table)
        executeSelect(
          parsedTable.selectStatement,
          table,
          active,
          text,
          textId,
          InternalFilter.getFilter(user, internalFilter),
          createRecordSet(user, tableId, table.name))
      }
      case None => throw new RuntimeException(s"There is not table definition for tableId: ${tableId}")
    }
  }

  private def filterForColumn(column: Column, operator: String): String = {
    val columnName = {
      if(column.columnType == "number") s"${column.name}::varchar "
      else s"lower(f_unaccent(${column.name})) "
    }
    columnName + operator + " lower(f_unaccent(?)) "
  }

  private def applyFilter(filter: String, columns: List[Column], operator: String): String = {
    if(filter.isEmpty) ""
    else {
      if(columns.length == 0) ""
      else "(" + columns.map(filterForColumn(_, operator)).mkString(" or ") + ")"
    }
  }

  private def getFilter(condition: String, operator: String): String = {
    if(condition.isEmpty) ""
    else s" ${operator} ${condition}"
  }

  private def getWhere(where: String, conditions: String, activeFilter: String, internalFilter: String): String = {
    val wc = if(where.isEmpty) s" where ${conditions}" else where + getFilter(conditions, "and")
    val wca = if(wc.isEmpty) s" where ${activeFilter}" else wc + getFilter(activeFilter, "and")
    (if(wca.isEmpty) s" where ${internalFilter}" else wca + getFilter(internalFilter, "and")) + " "
  }

  private def getInternalFilter(internalFilter: InternalFilter): String = {
    if(internalFilter.isEmpty) ""
    else s"(${internalFilter.query})"
  }

  private def getCallStatement(sqlstmt: String): String = {
    val firstSpace = sqlstmt.indexOf(" ")
    val function = sqlstmt.substring(0, firstSpace)
    val params = sqlstmt.substring(firstSpace)
    s"{call $function($params)}"
  }

  private def executeStoredProcedure(
                                      user: CompanyUser,
                                      tableId: Int,
                                      table: String,
                                      sqlstmt: String,
                                      filter: String,
                                      id: Int,
                                      internalFilter: InternalFilter): RecordSet = {

    Logger.debug(sqlstmt)

    DB.withTransaction(user.database.database) { implicit connection =>

      val cs = connection.prepareCall(sqlstmt)

      cs.setString(1, filter)
      cs.setInt(2, id)
      cs.setString(3, internalFilter.query)
      cs.registerOutParameter(4, Types.OTHER)

      try {

        cs.execute()
        createRows(cs.getObject(4).asInstanceOf[java.sql.ResultSet])

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

  private def executeQuery(
                            user: CompanyUser,
                            tableId: Int,
                            table: String,
                            sqlstmt: String,
                            filter: String,
                            internalFilter: InternalFilter,
                            paramCount: Int): RecordSet = {

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

      def getId(): String = {
        DBHelper.getValue(rs, metaData, 1).getOrElse("0").toString
      }

      def createRow(): Row = {
        Row(getId, DBHelper.getValues(rs, metaData, columnIndex))
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
        if(rs.next()) {
          createRow() :: fillList()
        }
        else {
          List()
        }
      }

      if(rs.next) {
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