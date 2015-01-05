/*
CrowSoft-Cairo
==============

ERP application written in Scala Play Framework and Postgresql

Copyright (C) 2012  Javier Mariano Alvarez

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

========================================================================

Created by Javier

http://www.crowsoft.com.ar

javier at crowsoft.com.ar
*/
-- Function: sp_producto_get()

-- DROP FUNCTION sp_producto_get(integer);

CREATE OR REPLACE FUNCTION sp_producto_get(
  IN p_pr_id integer ,
  OUT rtn refcursor)
  RETURNS refcursor AS
$BODY$
BEGIN

   rtn := 'rtn';

   BEGIN
      OPEN rtn FOR
         SELECT Producto.*,

                tiric.ti_nombre AS ti_name_ri_compra,
                tiriv.ti_nombre AS ti_name_ri_venta,

                tirnic.ti_nombre AS rnic,
                tirniv.ti_nombre AS rniv,

                tic.ti_nombre AS ti_name_int_compra,
                tiv.ti_nombre AS ti_name_int_venta,

                tuc.un_nombre AS un_name_compra,
                tuv.un_nombre AS un_name_venta,
                tus.un_nombre AS un_name_stock,

                tup.un_nombre AS un_name_peso,

                tcc.cueg_nombre AS cueg_name_compra,
                tcv.cueg_nombre AS cueg_name_venta,

                marc_nombre,
                ibc_nombre,
                rub_nombre,

                rti1.rubti_nombre rubti_name1,
                rti2.rubti_nombre rubti_name2,
                rti3.rubti_nombre rubti_name3,
                rti4.rubti_nombre rubti_name4,
                rti5.rubti_nombre rubti_name5,
                rti6.rubti_nombre rubti_name6,
                rti7.rubti_nombre rubti_name7,
                rti8.rubti_nombre rubti_name8,
                rti9.rubti_nombre rubti_name9,
                rti10.rubti_nombre rubti_name10,

                embl_nombre,
                egp.egp_nombre,
                efm.efm_nombre,
                tas.ta_nombre AS ta_name_kit_serie,
                tal.ta_nombre AS ta_name_kit_lote,

                ley.ley_nombre,

                ccosc.ccos_nombre AS ccos_name_compra,
                ccosv.ccos_nombre AS ccos_name_venta,

                cur.cur_nombre,

                rptcompra.rpt_nombre AS rpt_name_compra,
                rptventa.rpt_nombre AS rpt_name_venta,
                rptfactura.rpt_nombre AS rpt_name_factura,
                rptweb.rpt_nombre AS rpt_name_web,
                rptimg.rpt_nombre AS rpt_name_img,
                rptimgalt.rpt_nombre AS rpt_name_img_alt,

                ticomexgan.ti_nombre AS ti_name_comex_ganancias,
                ticomexigb.ti_nombre AS ti_name_comex_igb,
                ticomexiva.ti_nombre AS ti_name_comex_iva,
                prwebpadre.pr_nombrecompra AS pr_nombre_web_padre,

                poar.poar_nombre

           FROM Producto
                  LEFT JOIN RubroTablaItem rti1
                   ON Producto.rubti_id1 = rti1.rubti_id
                  LEFT JOIN RubroTablaItem rti2
                   ON Producto.rubti_id2 = rti2.rubti_id
                  LEFT JOIN RubroTablaItem rti3
                   ON Producto.rubti_id3 = rti3.rubti_id
                  LEFT JOIN RubroTablaItem rti4
                   ON Producto.rubti_id4 = rti4.rubti_id
                  LEFT JOIN RubroTablaItem rti5
                   ON Producto.rubti_id5 = rti5.rubti_id
                  LEFT JOIN RubroTablaItem rti6
                   ON Producto.rubti_id6 = rti6.rubti_id
                  LEFT JOIN RubroTablaItem rti7
                   ON Producto.rubti_id7 = rti7.rubti_id
                  LEFT JOIN RubroTablaItem rti8
                   ON Producto.rubti_id8 = rti8.rubti_id
                  LEFT JOIN RubroTablaItem rti9
                   ON Producto.rubti_id9 = rti9.rubti_id
                  LEFT JOIN RubroTablaItem rti10
                   ON Producto.rubti_id10 = rti10.rubti_id
                  LEFT JOIN Unidad tuv
                   ON Producto.un_id_venta = tuv.un_id
                  LEFT JOIN Unidad tuc
                   ON Producto.un_id_compra = tuc.un_id
                  LEFT JOIN Unidad tus
                   ON Producto.un_id_stock = tus.un_id
                  LEFT JOIN Unidad tup
                   ON Producto.un_id_peso = tup.un_id
                  LEFT JOIN TasaImpositiva tiric
                   ON Producto.ti_id_ivaricompra = tiric.ti_id
                  LEFT JOIN TasaImpositiva tiriv
                   ON Producto.ti_id_ivariventa = tiriv.ti_id
                  LEFT JOIN TasaImpositiva tirnic
                   ON Producto.ti_id_ivarnicompra = tirnic.ti_id
                  LEFT JOIN TasaImpositiva tirniv
                   ON Producto.ti_id_ivarniventa = tirniv.ti_id
                  LEFT JOIN TasaImpositiva tic
                   ON Producto.ti_id_internosc = tic.ti_id
                  LEFT JOIN TasaImpositiva tiv
                   ON Producto.ti_id_internosv = tiv.ti_id
                  LEFT JOIN CuentaGrupo tcv
                   ON Producto.cueg_id_venta = tcv.cueg_id
                  LEFT JOIN CuentaGrupo tcc
                   ON Producto.cueg_id_compra = tcc.cueg_id
                  LEFT JOIN IngresosBrutosCategoria
                   ON Producto.ibc_id = IngresosBrutosCategoria.ibc_id
                  LEFT JOIN Rubro
                   ON Producto.rub_id = Rubro.rub_id
                  LEFT JOIN Marca
                   ON Producto.marc_id = Marca.marc_id
                  LEFT JOIN Embalaje
                   ON Producto.embl_id = Embalaje.embl_id
                  LEFT JOIN ExpoGrupoPrecio egp
                   ON Producto.egp_id = egp.egp_id
                  LEFT JOIN ExpoFamilia efm
                   ON Producto.efm_id = efm.efm_id
                  LEFT JOIN Talonario tas
                   ON Producto.ta_id_kitSerie = tas.ta_id
                  LEFT JOIN Talonario tal
                   ON Producto.ta_id_kitLote = tal.ta_id
                  LEFT JOIN Leyenda ley
                   ON Producto.ley_id = ley.ley_id
                  LEFT JOIN CentroCosto ccosc
                   ON Producto.ccos_id_compra = ccosc.ccos_id
                  LEFT JOIN CentroCosto ccosv
                   ON Producto.ccos_id_venta = ccosv.ccos_id
                  LEFT JOIN Curso cur
                   ON Producto.cur_id = cur.cur_id
                  LEFT JOIN Reporte rptcompra
                   ON Producto.rpt_id_nombrecompra = rptcompra.rpt_id
                  LEFT JOIN Reporte rptventa
                   ON Producto.rpt_id_nombreventa = rptventa.rpt_id
                  LEFT JOIN Reporte rptfactura
                   ON Producto.rpt_id_nombrefactura = rptfactura.rpt_id
                  LEFT JOIN Reporte rptweb
                   ON Producto.rpt_id_nombreweb = rptweb.rpt_id
                  LEFT JOIN Reporte rptimg
                   ON Producto.rpt_id_nombreimg = rptimg.rpt_id
                  LEFT JOIN Reporte rptimgalt
                   ON Producto.rpt_id_nombreimgalt = rptimgalt.rpt_id
                  LEFT JOIN TasaImpositiva ticomexgan
                   ON Producto.ti_id_comex_ganancias = ticomexgan.ti_id
                  LEFT JOIN TasaImpositiva ticomexigb
                   ON Producto.ti_id_comex_igb = ticomexigb.ti_id
                  LEFT JOIN TasaImpositiva ticomexiva
                   ON Producto.ti_id_comex_iva = ticomexiva.ti_id
                  LEFT JOIN PosicionArancel poar
                   ON Producto.poar_id = poar.poar_id
                  LEFT JOIN Producto prwebpadre
                   ON Producto.pr_id_webpadre = prwebpadre.pr_id
            WHERE Producto.pr_id = p_pr_id;

   END;
END;

$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_producto_get(integer)
  OWNER TO postgres;