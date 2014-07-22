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
