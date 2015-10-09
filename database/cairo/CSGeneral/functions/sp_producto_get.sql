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
MERCHANTABILITY or FITNESS for A PARTICULAR PURPOSE.  See the
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

-- drop function sp_producto_get(integer);

create or replace function sp_producto_get
(
  in p_pr_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
begin

   rtn := 'rtn';

   begin
      open rtn for
         select Producto.*,

                tiric.ti_nombre as ti_name_ri_compra,
                tiriv.ti_nombre as ti_name_ri_venta,

                tirnic.ti_nombre as rnic,
                tirniv.ti_nombre as rniv,

                tic.ti_nombre as ti_name_int_compra,
                tiv.ti_nombre as ti_name_int_venta,

                tuc.un_nombre as un_name_compra,
                tuv.un_nombre as un_name_venta,
                tus.un_nombre as un_name_stock,

                tup.un_nombre as un_name_peso,

                tcc.cueg_nombre as cueg_name_compra,
                tcv.cueg_nombre as cueg_name_venta,

                marc_nombre,
                ibc_nombre,
                rub_nombre,

                Rubro.rubt_id1,
                Rubro.rubt_id2,
                Rubro.rubt_id3,
                Rubro.rubt_id4,
                Rubro.rubt_id5,
                Rubro.rubt_id6,
                Rubro.rubt_id7,
                Rubro.rubt_id8,
                Rubro.rubt_id9,
                Rubro.rubt_id10,

                rt1.rubt_nombre rubt_name1,
                rt2.rubt_nombre rubt_name2,
                rt3.rubt_nombre rubt_name3,
                rt4.rubt_nombre rubt_name4,
                rt5.rubt_nombre rubt_name5,
                rt6.rubt_nombre rubt_name6,
                rt7.rubt_nombre rubt_name7,
                rt8.rubt_nombre rubt_name8,
                rt9.rubt_nombre rubt_name9,
                rt10.rubt_nombre rubt_name10,

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
                tas.ta_nombre as ta_name_kit_serie,
                tal.ta_nombre as ta_name_kit_lote,

                ley.ley_nombre,

                ccosc.ccos_nombre as ccos_name_compra,
                ccosv.ccos_nombre as ccos_name_venta,

                cur.cur_nombre,

                rptcompra.rpt_nombre as rpt_name_compra,
                rptventa.rpt_nombre as rpt_name_venta,
                rptfactura.rpt_nombre as rpt_name_factura,
                rptweb.rpt_nombre as rpt_name_web,
                rptimg.rpt_nombre as rpt_name_img,
                rptimgalt.rpt_nombre as rpt_name_img_alt,

                ticomexgan.ti_nombre as ti_name_comex_ganancias,
                ticomexigb.ti_nombre as ti_name_comex_igb,
                ticomexiva.ti_nombre as ti_name_comex_iva,
                prwebpadre.pr_nombrecompra as pr_nombre_web_padre,

                poar.poar_nombre

           from Producto
                  left join RubroTablaItem rti1
                   on Producto.rubti_id1 = rti1.rubti_id
                  left join RubroTablaItem rti2
                   on Producto.rubti_id2 = rti2.rubti_id
                  left join RubroTablaItem rti3
                   on Producto.rubti_id3 = rti3.rubti_id
                  left join RubroTablaItem rti4
                   on Producto.rubti_id4 = rti4.rubti_id
                  left join RubroTablaItem rti5
                   on Producto.rubti_id5 = rti5.rubti_id
                  left join RubroTablaItem rti6
                   on Producto.rubti_id6 = rti6.rubti_id
                  left join RubroTablaItem rti7
                   on Producto.rubti_id7 = rti7.rubti_id
                  left join RubroTablaItem rti8
                   on Producto.rubti_id8 = rti8.rubti_id
                  left join RubroTablaItem rti9
                   on Producto.rubti_id9 = rti9.rubti_id
                  left join RubroTablaItem rti10
                   on Producto.rubti_id10 = rti10.rubti_id
                  left join Unidad tuv
                   on Producto.un_id_venta = tuv.un_id
                  left join Unidad tuc
                   on Producto.un_id_compra = tuc.un_id
                  left join Unidad tus
                   on Producto.un_id_stock = tus.un_id
                  left join Unidad tup
                   on Producto.un_id_peso = tup.un_id
                  left join TasaImpositiva tiric
                   on Producto.ti_id_ivaricompra = tiric.ti_id
                  left join TasaImpositiva tiriv
                   on Producto.ti_id_ivariventa = tiriv.ti_id
                  left join TasaImpositiva tirnic
                   on Producto.ti_id_ivarnicompra = tirnic.ti_id
                  left join TasaImpositiva tirniv
                   on Producto.ti_id_ivarniventa = tirniv.ti_id
                  left join TasaImpositiva tic
                   on Producto.ti_id_internosc = tic.ti_id
                  left join TasaImpositiva tiv
                   on Producto.ti_id_internosv = tiv.ti_id
                  left join CuentaGrupo tcv
                   on Producto.cueg_id_venta = tcv.cueg_id
                  left join CuentaGrupo tcc
                   on Producto.cueg_id_compra = tcc.cueg_id
                  left join IngresosBrutosCategoria
                   on Producto.ibc_id = IngresosBrutosCategoria.ibc_id
                  left join Rubro
                   on Producto.rub_id = Rubro.rub_id
                  left join Marca
                   on Producto.marc_id = Marca.marc_id
                  left join Embalaje
                   on Producto.embl_id = Embalaje.embl_id
                  left join ExpoGrupoPrecio egp
                   on Producto.egp_id = egp.egp_id
                  left join ExpoFamilia efm
                   on Producto.efm_id = efm.efm_id
                  left join Talonario tas
                   on Producto.ta_id_kitSerie = tas.ta_id
                  left join Talonario tal
                   on Producto.ta_id_kitLote = tal.ta_id
                  left join Leyenda ley
                   on Producto.ley_id = ley.ley_id
                  left join CentroCosto ccosc
                   on Producto.ccos_id_compra = ccosc.ccos_id
                  left join CentroCosto ccosv
                   on Producto.ccos_id_venta = ccosv.ccos_id
                  left join Curso cur
                   on Producto.cur_id = cur.cur_id
                  left join Reporte rptcompra
                   on Producto.rpt_id_nombrecompra = rptcompra.rpt_id
                  left join Reporte rptventa
                   on Producto.rpt_id_nombreventa = rptventa.rpt_id
                  left join Reporte rptfactura
                   on Producto.rpt_id_nombrefactura = rptfactura.rpt_id
                  left join Reporte rptweb
                   on Producto.rpt_id_nombreweb = rptweb.rpt_id
                  left join Reporte rptimg
                   on Producto.rpt_id_nombreimg = rptimg.rpt_id
                  left join Reporte rptimgalt
                   on Producto.rpt_id_nombreimgalt = rptimgalt.rpt_id
                  left join TasaImpositiva ticomexgan
                   on Producto.ti_id_comex_ganancias = ticomexgan.ti_id
                  left join TasaImpositiva ticomexigb
                   on Producto.ti_id_comex_igb = ticomexigb.ti_id
                  left join TasaImpositiva ticomexiva
                   on Producto.ti_id_comex_iva = ticomexiva.ti_id
                  left join PosicionArancel poar
                   on Producto.poar_id = poar.poar_id
                  left join Producto prwebpadre
                   on Producto.pr_id_webpadre = prwebpadre.pr_id

               -- rubro
                  left join RubroTabla rt1
                   on Rubro.rubt_id1 = rt1.rubt_id
                  left join RubroTabla rt2
                   on Rubro.rubt_id2 = rt2.rubt_id
                  left join RubroTabla rt3
                   on Rubro.rubt_id3 = rt3.rubt_id
                  left join RubroTabla rt4
                   on Rubro.rubt_id4 = rt4.rubt_id
                  left join RubroTabla rt5
                   on Rubro.rubt_id5 = rt5.rubt_id
                  left join RubroTabla rt6
                   on Rubro.rubt_id6 = rt6.rubt_id
                  left join RubroTabla rt7
                   on Rubro.rubt_id7 = rt7.rubt_id
                  left join RubroTabla rt8
                   on Rubro.rubt_id8 = rt8.rubt_id
                  left join RubroTabla rt9
                   on Rubro.rubt_id9 = rt9.rubt_id
                  left join RubroTabla rt10
                   on Rubro.rubt_id10 = rt10.rubt_id

            where Producto.pr_id = p_pr_id;

   end;
end;

$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_producto_get(integer)
  owner to postgres;