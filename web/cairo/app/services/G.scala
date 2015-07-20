package services

import scala.util.control.NonFatal

object G {

  def padLeft(s: String, n: Int, c: String): String = {
    val z = n - s.length
    if(z > 0) String.format("%1$" + z + "s", "").replace(" ", c) + s
    else s
  }

  def getIntOrZero(value: String): Int = {
    try {
      value.toInt
    } catch {
      case NonFatal(e) => {
        0
      }
    }
  }
}