package models.cairo.trees

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import models.Token
import services.db.DB
import play.api.Play.current
import models.domain.CompanyUser
import play.api.Logger
import play.api.libs.json._
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
    listBranches(user, treeId, "sp_arbgetramas")
  }

  def listForBranch(user: CompanyUser, id: Int): List[Branch] = {
    listBranches(user, id, "sp_arb_rama_get_ramas")
  }

  private def listBranches(user: CompanyUser, id: Int, storedProcedure: String): List[Branch] = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = s"{call $storedProcedure(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
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
          Logger.error(s"can't load tree with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
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

  def get(user: CompanyUser, id: Int): LoadedBranch = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_arbgethojas(?, ?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)
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
          Logger.error(s"can't get branch with id $id for user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def save(user: CompanyUser, treeId: Int, branch: Branch): Branch = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_arb_rama_create(?, ?, ?, ?, ?)}"
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
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def update(user: CompanyUser, branch: Branch): Branch = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_arb_rama_rename(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.user.id.getOrElse(0))
      cs.setInt(2, branch.id)
      cs.setString(3, branch.name)
      cs.registerOutParameter(4, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(4).asInstanceOf[java.sql.ResultSet]

        try {
          if (rs.next) Branch(rs.getInt("ram_id"), rs.getString("ram_nombre"), List(), List(), rs.getInt("ram_id_padre"))
          else emptyBranch
        }
        finally {
          rs.close
        }

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't rename this branch. Branch id: ${branch.id}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def load(user: CompanyUser, id: Int): Option[Branch] = {
    loadWhere(user, "ram_id = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT * FROM rama WHERE $where")
        .on(args: _*)
        .as(branchParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_arbborrarrama(?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.user.id.getOrElse(0))
      cs.setInt(2, id)

      try {
        cs.execute()
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a branch. Branch id: $id. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def paste(user: CompanyUser, idFrom: Int, idTo: Int, onlyChildren: Boolean, isCut: Boolean): Branch = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sp = if (isCut) "SP_ArbCortarRama" else "SP_ArbCopiarRama"
      val sql = s"{call $sp(?, ?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.user.id.getOrElse(0))
      cs.setInt(2, idFrom)
      cs.setInt(3, idTo)
      cs.setShort(4, (if (onlyChildren) 1 else 0).toShort)
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
          Logger.error(s"can't paste this branch. Branch id from: $idFrom - Branch id to: $idTo. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def move(user: CompanyUser, id: Int, direction: String): Branch = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sp = direction match {
        case "UP"       => "sp_arb_rama_move_up"
        case "DOWN"     => "sp_arb_rama_move_down"
        case "TOP"      => "sp_arb_rama_move_top"
        case "BOTTOM"   => "sp_arb_rama_move_bottom"
      }

      val sql = s"{call $sp(?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.user.id.getOrElse(0))
      cs.setInt(2, id)
      cs.registerOutParameter(3, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(3).asInstanceOf[java.sql.ResultSet]

        try {
          if (rs.next) Branch(rs.getInt("ram_id"), rs.getString("ram_nombre"), List(), List(), rs.getInt("ram_id_padre"))
          else emptyBranch
        }
        finally {
          rs.close
        }

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't move ${direction.toLowerCase()} this branch. Branch id: $id. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def pasteLeave(user: CompanyUser, ids: String, idTo: Int, isCut: Boolean): Branch = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sp = if (isCut) "sp_arb_hoja_paste_cut" else "sp_arb_hoja_paste_copy"
      val sql = s"{call $sp(?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.user.id.getOrElse(0))
      cs.setString(2, ids)
      cs.setInt(3, idTo)
      cs.registerOutParameter(4, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(4).asInstanceOf[java.sql.ResultSet]

        try {
          if (rs.next) Branch(rs.getInt("ram_id"), rs.getString("ram_nombre"), List(), List(), rs.getInt("ram_id_padre"))
          else emptyBranch
        }
        finally {
          rs.close
        }

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't paste these leaves. Leave ids from: $ids - Branch id to: $idTo. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def getAsJsonForFancyTree(branches: List[Branch]): JsValue = {

    implicit val branchWrites = new Writes[Branch] {
      def writes(branch: Branch) = Json.obj(
      "key" -> branch.id,
      "title" -> branch.name,
      "folder" -> true,
      "children" -> Json.toJson(writesItems(branch.items))
      )
      def writesItems(items: List[Branch]) = items.map(branch => writes(branch))
    }

    Json.toJson(branches)
  }

}