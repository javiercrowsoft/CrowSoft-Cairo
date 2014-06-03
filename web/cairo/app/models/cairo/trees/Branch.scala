package models.cairo.trees

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import services.db.DB
import play.api.Play.current
import models.domain.CompanyUser
import play.api.Logger

case class Branch(id: Int, name: String, leaves: List[Leave], items: List[Branch], fatherId: Int)

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

    def findFatherOrCreate(branch: Branch, items: List[Branch]): Branch = {
      val item = findBranch(branch.fatherId, items)
      if(item != null) item else Branch(branch.fatherId, "", List(), List(), 0)
    }

    def findBranchOr(branch: Branch, items: List[Branch]): Branch = {
      val item = findBranch(branch.id, items)
      if(item != null) item else branch
    }

    def findBranch(id: Int, items: List[Branch]): Branch = items match {
      case Nil => null
      case h :: t => if(h.id == id) h else findBranch(id, t)
    }

    def replaceBranch(branch: Branch, items: List[Branch]): List[Branch] = items match {
      case Nil => List(branch)
      case h :: t => {
        if(h.id == branch.id) branch :: t
        else h :: replaceBranch(branch, t)
      }
    }

    def removeBranch(branch: Branch, items: List[Branch]): List[Branch] = items match {
      case Nil => List()
      case h :: t => {
        if(h.id == branch.id) t
        else h :: removeBranch(branch, t)
      }
    }

    def updateBranch(branch: Branch, items: List[Branch]): List[Branch] = items match {
      case Nil => List()
      case h :: t => {
        if(h.id == branch.id) Branch(branch.id, branch.name, branch.leaves, h.items, branch.fatherId) :: t
        else h :: updateBranch(branch, t)
      }
    }

    def createBranch(items: List[Branch], newItems: List[Branch]): List[Branch] = items match {
      case Nil => newItems
      case h :: t => {
        if (h.fatherId == 0) {
          updateBranch(h, newItems)
        }
        else {
          val updatedItems = updateBranch(h, newItems)
          val branch = findBranchOr(h, updatedItems)
          val father = findFatherOrCreate(branch, updatedItems)
          val newFather = Branch(father.id, father.name, father.leaves, branch :: father.items, father.fatherId)
          createBranch(t, replaceBranch(newFather, removeBranch(branch, updatedItems)))
        }
      }
    }

    createBranch(branches, List())

  }

}