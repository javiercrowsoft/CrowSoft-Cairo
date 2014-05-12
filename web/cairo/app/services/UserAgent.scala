package services

import play.api.mvc.RequestHeader

case class UserAgent(userAgent: String, platform: String, isMobile: Boolean)

object UserAgent {

  def parse(request: RequestHeader): UserAgent = {
    parse(request.headers.get("user-agent").getOrElse(""))
  }

  def parse(userAgent: String): UserAgent = {
    val downCaseUserAgent = userAgent.toLowerCase()
    if (downCaseUserAgent.contains("iphone"))
      UserAgent(userAgent, "iPhone", true)
    else if (downCaseUserAgent.contains("iPad"))
      UserAgent(userAgent, "iPad", true)
    else if (downCaseUserAgent.contains("android"))
      UserAgent(userAgent, "Android", true)
    else if (downCaseUserAgent.contains("blackberry"))
      UserAgent(userAgent, "Blackberry", true)
    else {
      val isMobile = downCaseUserAgent.contains("mobile")
      if (downCaseUserAgent.contains("mac"))
        UserAgent(userAgent, "Mac", isMobile)
      else if (downCaseUserAgent.contains("windows"))
        UserAgent(userAgent, "Windows", isMobile)
      else if (downCaseUserAgent.contains("linux"))
        UserAgent(userAgent, "Linux", isMobile)
      else if (downCaseUserAgent.contains("unix"))
        UserAgent(userAgent, "Unix", isMobile)
      else
        UserAgent(userAgent, "Unknown", isMobile)
    }
  }
}