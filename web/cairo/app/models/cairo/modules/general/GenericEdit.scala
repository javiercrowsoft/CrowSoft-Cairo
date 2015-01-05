package models.cairo.modules.general

case class AdditionalFields(
                             id: Int,
                             name: String,
                             realName: String,
                             fieldType: Int,
                             subType: Int,
                             order: Int,
                             selectType: Int,
                             filter: String,
                             defaultValue: String,
                             minValue: Double,
                             maxValue: Double,
                             textAlign: Int,
                             textMask: String,
                             format: String,
                             width: Int,
                             height: Int,
                             top: Int,
                             left: Int,
                             noShowButton: Boolean,
                             sqlstmt: String,
                             selectId: Int
                             )