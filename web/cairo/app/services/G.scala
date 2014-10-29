package services

object G {

  def padLeft(s: String, n: Int, c: String): String = {
    val z = n - s.length
    if(z > 0) String.format("%1$" + z + "s", "").replace(" ", c) + s
    else s
  }
}