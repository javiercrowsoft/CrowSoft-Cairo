package models.cairo.trees

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import services.db.DB
import play.api.Play.current
import models.domain.CompanyUser
import play.api.Logger

case class Branch(id: Int, name: String, leaves: List[Leave], items: List[Branch], fatherId: Int)

case class BranchColumn(name: String, columnType: String)
case class LoadedBranch(leaves: List[Leave], columns: List[BranchColumn])

object Branch {

  def listForTree(user: CompanyUser, treeId: Int): List[Branch] = {
    val sql = "{call sp_arbgetramas(?, ?)}";
    val connection = DB.getConnection(user.database.database, false)
    val cs = connection.prepareCall(sql)

    cs.setInt(1, treeId)
    cs.registerOutParameter(2, Types.OTHER)

    cs.execute()

    val rs = cs.getObject(2).asInstanceOf [java.sql.ResultSet]
    def fillList(): List[Branch] = {
      if (rs.next()) {
        Branch(rs.getInt("ram_id"), rs.getString("ram_nombre"), List(), List(), rs.getInt("ram_id_padre")) :: fillList()
      }
      else {
        rs.close
        cs.close
        connection.commit
        connection.close
        List()
      }
    }
    fillList()
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

    cs.execute()

    val rs = cs.getObject(5).asInstanceOf [java.sql.ResultSet]

    lazy val metaData = rs.getMetaData()
    lazy val columnIndex = 3.to(metaData.getColumnCount()).toList.reverse

    def createLeave(): Leave = {
      def getValues(): List[String] = {
        for {
          i <- columnIndex
        } yield {
          metaData.getColumnTypeName(i).toLowerCase match {
            case "integer"    => rs.getInt(i).toString
            case "int2"       => rs.getInt(i).toString
            case "smallint"   => rs.getInt(i).toString
            case "biginteger" => rs.getLong(i).toString
            case "serial"     => rs.getLong(i).toString
            case "bigserial"  => rs.getLong(i).toString
            case "decimal"    => rs.getBigDecimal(i).toString
            case "real"       => rs.getBigDecimal(i).toString
            case "timestamp"  => rs.getDate(i).toString
            case "date"       => rs.getDate(i).toString
            case "time"       => rs.getTime(i).toString
            case "character"  => rs.getString(i)
            case "char"       => rs.getString(i)
            case "varchar"    => rs.getString(i)
            case "character varying" => rs.getString(i)
            case other => s"unclassified type: $other val:${rs.getObject(i).toString}"
          }
        }
      }
      Leave(rs.getInt(1), rs.getInt(2), getValues())
    }

    def createColumns(): List[BranchColumn] = {
      for {
        i <- columnIndex
      } yield {
        BranchColumn(metaData.getColumnName(i), metaData.getColumnTypeName(i))
      }
    }

    def fillList(): List[Leave] = {
      if (rs.next()) {
        createLeave() :: fillList()
      }
      else {
        rs.close
        cs.close
        connection.commit
        connection.close
        List()
      }
    }

    if(rs.next) {
      LoadedBranch(createLeave() :: fillList(), createColumns())
    }
    else {
      LoadedBranch(List(), List())
    }

  }

}