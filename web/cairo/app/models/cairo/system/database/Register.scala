package models.cairo.system.database

import anorm._
import models.domain.CompanyUser
import services.DateUtil

case class FieldType(value: Int) {
  override def equals(o: Any) = o match {
    case that: FieldType => that.value == this.value
    case _ => false
  }

}

object FieldType {

  val integer = FieldType(2)
  val double = FieldType(5)
  val currency = FieldType(6)
  val text = FieldType(200)
  val id = FieldType(-1)
  val taxId = FieldType(-100)
  val boolean = FieldType(-200)
  val single = FieldType(-300)
  val variant = FieldType(-400)
  val long = FieldType(-500)
  val date = FieldType(-600)
  val dateOrNull = FieldType(-700)

}

case class Field(name: String, value: Any, fieldType: FieldType)

case class Register(
                     table: String,
                     fieldId: String,
                     id: Int,
                     useIdentity:  Boolean,
                     hasTimestamp: Boolean,
                     hasUpdatedBy: Boolean,
                     fields: List[Field])

case class SqlStatement(sqlstmt: String, parameters: Seq[(scala.Any, anorm.ParameterValue[_])])

object Register {

  def getSqlSave(user: CompanyUser, register: Register, useInsert: Boolean, newId: Int): SqlStatement = {
    def getFields = {
      def getFieldsWithTimestamp = register.hasTimestamp match {
        case true => {
          val currentTime = DateUtil.currentTime
          val fields = Field(DBHelper.UPDATED_AT, currentTime, FieldType.date) :: register.fields
          if(register.id == DBHelper.NoId)
            Field(DBHelper.CREATED_AT, currentTime, FieldType.date) :: fields
          else
            fields
        }
        case false => register.fields
      }
      def getFieldsWithUpdatedBy(fields: List[Field]) = register.hasUpdatedBy match {
        case true => Field(DBHelper.UPDATED_BY, user.userId, FieldType.id) :: fields
        case false => fields
      }
      getFieldsWithUpdatedBy(getFieldsWithTimestamp)
    }
    useInsert match {
      case true => getSqlInsert(register, getFields, newId)
      case false => getSqlUpdate(register, getFields)
    }
  }

  def getParameters(fields: List[Field]): List[(scala.Any, anorm.ParameterValue[_])] = fields match {
    case Nil => List()
    case h :: t => getParameter(h) :: getParameters(t)
  }

  def getParameter(field: Field): (scala.Any, anorm.ParameterValue[_]) = {
    (field.name, toParameterValue(field.value))
  }

  def getSqlInsert(register: Register, fields: List[Field], newId: Int): SqlStatement = {
    def getSqlstmt = {
      val columns = fields.map( _.name ).toString()
      val values = fields.map( f => s"${f.name}" ).toString()
      s"INSERT INTO ${register.table} ($columns) VALUES ($values)"
    }
    SqlStatement(getSqlstmt, (register.fieldId, toParameterValue(newId)) :: getParameters(register.fields))
  }

  def getSqlUpdate(register: Register, fields: List[Field]): SqlStatement = {
    def getSqlstmt = {
      val values = fields.map( f => s"${f.name} = {${f.name}}" ).toString()
      s"UPDATE ${register.table} SET $values WHERE ${register.fieldId} = {${register.fieldId}}"
    }
    SqlStatement(getSqlstmt, (register.fieldId, toParameterValue(register.id)) :: getParameters(register.fields))
  }

  def getSqlDelete(register: Register): SqlStatement = {
    def getSqlstmt(fields: List[Field]) = {
      val values = fields.map( f => s"${f.name} = {${f.name}}" ).toString()
      s"DELETE FROM ${register.table} WHERE ${register.fieldId} = {${register.fieldId}}"
    }
    SqlStatement(getSqlstmt(register.fields), List((register.fieldId, toParameterValue(register.id))))
  }

}