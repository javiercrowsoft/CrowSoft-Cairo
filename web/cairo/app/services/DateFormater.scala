package formatters.json

import play.api.libs.json.Json.toJson
import play.api.libs.json.JsValue
import play.api.libs.json.Format
import play.api.libs.json.JsResult
import play.api.libs.json.JsSuccess

import java.util.Date
import java.text.SimpleDateFormat

object DateFormatter {

  implicit object JsonDateFormatter extends Format[Date] {

    val dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss'Z'")
    val NO_DATE = new Date(1900, 1, 1)

    def writes(date: Date): JsValue = {
      toJson(dateFormat.format(date))
    }

    def reads(j: JsValue): JsResult[Date] = {
      try {
        JsSuccess(dateFormat.parse(j.as[String]))
      } catch {
        case e: Exception => JsSuccess(NO_DATE)
      }
    }

  }

}