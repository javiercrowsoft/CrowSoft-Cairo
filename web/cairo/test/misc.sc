import models.cairo.system.database.QueryParameter
import scala.util.control.NonFatal
/*
case class InternalFilterParameter(typeName: String, value: Any)
val x = List(
  new InternalFilterParameter("int", 1),
  new InternalFilterParameter("int", 1),
  new InternalFilterParameter("string","a")
)

def printList(l: List[InternalFilterParameter]): Unit = {
  l match {
    case Nil =>
    case h :: t => printType(h); printList(t)
  }
}

def printType(t: InternalFilterParameter): Unit = {
  t match {
    case InternalFilterParameter(t: String, v: Int) => println("is int | ")
    case InternalFilterParameter(t: String, v: String) => println("is string | ")
  }
}
printList(x)
val q:Option[Int] = None
q match {
  case Some(v) => println(v)
  case None => println("was none")
}
*/

case class InternalFilter(query: String, filters: List[QueryParameter]) {
  val isEmpty = query.isEmpty
}

object InternalFilter {

  val filters = Map(
    "supplier_list_price" -> "f:supplierListPrice"
  )

  val emptyFilter = InternalFilter("", List())

  def parseDefinition(filterDefinition: String): (String, List[String]) = {
    if (filterDefinition.isEmpty) ("", List())
    else {
      val info = filterDefinition.split("[|]")
      (info(0), info(1).split("[,]").toList)
    }
  }

  /*
  *
  * a filterDefinition is a key and a list of parameters
  *
  * f:supplierListPrice|supplierId:1,documentId:1
  *
  * */
  def getFilter(filterDefinition: String): InternalFilter = {
    try {
      parseDefinition(filterDefinition) match {
        case (key, parameters) => {
          filters.getOrElse(key, "") match {
            case "f:supplierListPrice" => emptyFilter
            case _ => emptyFilter
          }
        }
      }
    }
    catch {
      case NonFatal(e) => {
        val message = s"Error when getting internalFilter. Definition: ${filterDefinition}]. Error ${e.toString}"
        throw new RuntimeException(message)
      }
    }
  }
}
