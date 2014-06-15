package models.cairo.trees

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import models.Token
import services.db.DB
import play.api.Play.current
import models.domain.CompanyUser
import play.api.Logger

import scala.util.control.{NonFatal, ControlThrowable}

case class Branch(id: Int, name: String, leaves: List[Leave], items: List[Branch], fatherId: Int)

case class BranchColumn(name: String, columnType: String)
case class LoadedBranch(leaves: List[Leave], columns: List[BranchColumn])

object Branch {

  lazy val emptyBranch = Branch(0, "", List(), List(), 0)

  private val branchParser: RowParser[Branch] = {
      SqlParser.get[Int]("ram_id") ~
      SqlParser.get[String]("ram_nombre") ~
      SqlParser.get[Int]("ram_id_padre") map {
      case ram_id ~ ram_nombre ~ ram_id_padre =>
        Branch(ram_id, ram_nombre, List(), List(), ram_id_padre)
    }
  }

  def listForTree(user: CompanyUser, treeId: Int): List[Branch] = {
    val sql = "{call sp_arbgetramas(?, ?)}";
    val connection = DB.getConnection(user.database.database, false)
    val cs = connection.prepareCall(sql)

    cs.setInt(1, treeId)
    cs.registerOutParameter(2, Types.OTHER)

    try {
      cs.execute()

      val rs = cs.getObject(2).asInstanceOf[java.sql.ResultSet]

      try {
        def fillList(): List[Branch] = {
          if (rs.next()) {
            Branch(rs.getInt("ram_id"), rs.getString("ram_nombre"), List(), List(), rs.getInt("ram_id_padre")) :: fillList()
          }
          else {
            List()
          }
        }
        fillList()

      } finally {
        rs.close
      }
    } catch {
      case NonFatal(e) => {
        Logger.error(s"can't load tree with id $treeId for user ${user.toString}. Error ${e.toString}")
        throw e
      }
    } finally {
      cs.close
      connection.commit
      connection.close
    }
  }

  def createTree(branches: List[Branch]): List[Branch] = {
    def createBranch(branch: Branch, items: List[Branch]): Branch = {
      Branch(branch.id, branch.name, branch.leaves, createItems(branch.id, items), branch.fatherId)
    }

    def createItems(fatherId: Int, items: List[Branch]): List[Branch] = items match {
      case Nil => List()
      case h :: t => {
        if(h.fatherId == fatherId) createBranch(h, t) :: createItems(fatherId, t)
        else createItems(fatherId, t)
      }
    }

    List(createBranch(branches.head, branches.tail))
  }

  def get(user: CompanyUser, branchId: Int): LoadedBranch = {
    val sql = "{call sp_arbgethojas(?, ?, ?, ?, ?)}";
    val connection = DB.getConnection(user.database.database, false)
    val cs = connection.prepareCall(sql)

    cs.setInt(1, branchId)
    cs.setInt(2, 0)
    cs.setString(3, "")
    cs.setInt(4, 3000)
    cs.registerOutParameter(5, Types.OTHER)

    try {
      cs.execute()

      val rs = cs.getObject(5).asInstanceOf[java.sql.ResultSet]

      try {
        lazy val metaData = rs.getMetaData()
        lazy val columnIndex = 3.to(metaData.getColumnCount()).toList

        def createLeave(): Leave = {
          def getValues(): List[String] = {
            for {
              i <- columnIndex
            } yield {
              metaData.getColumnTypeName(i).toLowerCase match {
                case "integer" => rs.getInt(i).toString
                case "int2" => rs.getInt(i).toString
                case "smallint" => rs.getInt(i).toString
                case "biginteger" => rs.getLong(i).toString
                case "serial" => rs.getLong(i).toString
                case "bigserial" => rs.getLong(i).toString
                case "decimal" => rs.getBigDecimal(i).toString
                case "real" => rs.getBigDecimal(i).toString
                case "timestamp" => rs.getDate(i).toString
                case "date" => rs.getDate(i).toString
                case "time" => rs.getTime(i).toString
                case "character" => rs.getString(i)
                case "char" => rs.getString(i)
                case "varchar" => rs.getString(i)
                case "text" => rs.getString(i)
                case "character varying" => rs.getString(i)
                case other => s"unclassified type: $other val:${rs.getObject(i).toString}"
              }
            }
          }
          Leave(rs.getInt(1), rs.getInt(2), getValues())
        }

        def createColumns(): List[BranchColumn] = {
          val columns = for {
            i <- columnIndex
          } yield {
            BranchColumn(metaData.getColumnName(i), metaData.getColumnTypeName(i))
          }
          columns
        }

        def fillList(): List[Leave] = {
          if (rs.next()) {
            createLeave() :: fillList()
          }
          else {
            List()
          }
        }

        if (rs.next) {
          LoadedBranch(createLeave() :: fillList(), createColumns())
        }
        else {
          LoadedBranch(List(), List())
        }

      } finally {
        rs.close
      }
    } catch {
      case NonFatal(e) => {
        Logger.error(s"can't get branch with id $branchId for user ${user.toString}. Error ${e.toString}")
        throw e
      }
    } finally {
      cs.close
      connection.commit
      connection.close
    }
  }

  def save(user: CompanyUser, treeId: Int, branch: Branch): Branch = {
    val sql = "{call sp_arb_rama_create(?, ?, ?, ?, ?)}";
    val connection = DB.getConnection(user.database.database, false)
    val cs = connection.prepareCall(sql)

    cs.setInt(1, user.user.id.getOrElse(0))
    cs.setInt(2, treeId)
    cs.setInt(3, branch.fatherId)
    cs.setString(4, branch.name)
    cs.registerOutParameter(5, Types.OTHER)

    try {
      cs.execute()

      val rs = cs.getObject(5).asInstanceOf[java.sql.ResultSet]

      try {
        if (rs.next) Branch(rs.getInt("ram_id"), rs.getString("ram_nombre"), List(), List(), rs.getInt("ram_id_padre"))
        else emptyBranch
      }
      finally {
        rs.close
      }

    } catch {
      case NonFatal(e) => {
        Logger.error(s"can't save a branch. Branch id: ${branch.id}. Error ${e.toString}")
        emptyBranch
      }
    } finally {
      cs.close
      connection.commit
      connection.close
    }

  }

  def update(user: CompanyUser, branch: Branch): Branch = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL("""
          UPDATE rama SET
          ram_nombre = {name}
          WHERE ram_id = {id}
          """).on(
          'id -> branch.id,
          'name -> branch.name
        ).executeUpdate
    }
    load(user, branch.id).getOrElse(emptyBranch)
  }

  def load(user: CompanyUser, id: Int): Option[Branch] = {
    loadWhere(user, "branch_id = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT * FROM rama WHERE $where")
        .on(args: _*)
        .as(branchParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, branchId: Int): Boolean = {
    val sql = "{call sp_arbborrarrama(?, ?)}";
    val connection = DB.getConnection(user.database.database, false)
    val cs = connection.prepareCall(sql)

    cs.setInt(1, user.user.id.getOrElse(0))
    cs.setInt(2, branchId)

    try {
      cs.execute()
      true
    } catch {
      case NonFatal(e) => {
        Logger.error(s"can't delete a branch. Branch id: $branchId. Error ${e.toString}")
        false
      }
    } finally {
      cs.close
      connection.commit
      connection.close
    }
  }

}