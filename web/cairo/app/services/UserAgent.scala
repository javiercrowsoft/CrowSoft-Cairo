package services

case class UserAgent(platform: String, isMobile: Boolean)

object UserAgent {

  def parse(http_user_agent: String): UserAgent = {
    val downcase_http_user_agent = http_user_agent.toLowerCase()
    if (downcase_http_user_agent.contains("iphone"))
      UserAgent("iPhone", true)
    else if (downcase_http_user_agent.contains("iPad"))
      UserAgent("iPad", true)
    else if (downcase_http_user_agent.contains("android"))
      UserAgent("Android", true)
    else if (downcase_http_user_agent.contains("blackberry"))
      UserAgent("Blackberry", true)
    else {
      val isMobile = downcase_http_user_agent.contains("mobile")
      if (downcase_http_user_agent.contains("mac"))
        UserAgent("Mac", isMobile)
      else if (downcase_http_user_agent.contains("windows"))
        UserAgent("Windows", isMobile)
      else if (downcase_http_user_agent.contains("linux"))
        UserAgent("Linux", isMobile)
      else if (downcase_http_user_agent.contains("unix"))
        UserAgent("Unix", isMobile)
      else
        UserAgent("Unknown", isMobile)
    }
  }
}