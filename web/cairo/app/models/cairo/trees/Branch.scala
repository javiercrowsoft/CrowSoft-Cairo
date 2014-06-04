package models.cairo.trees

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import services.db.DB
import play.api.Play.current
import models.domain.CompanyUser
import play.api.Logger

case class Branch(id: Int, name: String, leaves: List[Leave], items: List[Branch], fatherId: Int)
case class FancyTreeBranch(title: String, key: String, folder: Boolean, children: List[FancyTreeBranch])

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

}