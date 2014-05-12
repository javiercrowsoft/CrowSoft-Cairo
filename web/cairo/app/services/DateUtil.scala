package services

import java.util.Calendar
import java.util.Date
import java.text.SimpleDateFormat

case class DateUtil(date: Date) {

  def plusDays(days: Int): Date = {
    DateUtil.plusDays(this, days)
  }

}

object DateUtil {

  def formattedCurrentTime : String = {
    val today = Calendar.getInstance.getTime
    val curTimeFormat = new SimpleDateFormat("MMM d, yyyy hh:mm aaa z") // April 30, 2014 at 01:31pm ART
    curTimeFormat.format(today)
  }

  def currentTime : Date = {
    Calendar.getInstance.getTime
  }

  def plusDays(dateUtil: DateUtil, days: Int): Date = {
    val cal = Calendar.getInstance
    cal.setTime(dateUtil.date)
    cal.add(Calendar.DAY_OF_MONTH, days)
    cal.getTime
  }

  def plusDays(date: Date, days: Int): Date = {
    plusDays(DateUtil(date), days)
  }

}