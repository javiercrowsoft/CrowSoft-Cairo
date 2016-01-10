package models.cairo.modules.general

case class ComplexSetting(id: String, name: String)
case class Setting(key: String, group: String, value: Any, empId: Int, filter: String)

object Setting {

  def apply(key: String, group: String, value: Any, empId: Int) = {
    new Setting(key, group, value, empId, "")
  }
}

case class SettingData(key: String, group: String, value: String, empId: Option[Int], filter: String)
case class SettingFilter(key: String, group: String, empId: String)