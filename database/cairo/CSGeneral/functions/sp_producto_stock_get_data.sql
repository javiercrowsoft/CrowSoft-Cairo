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
-- Function: sp_producto_stock_get_data()

-- drop function sp_producto_stock_get_data(integer, integer, integer);

create or replace function sp_producto_stock_get_data
/*
          select * from producto where pr_llevastock <> 0;
          select * from proveedor;
          select * from sp_producto_stock_get_data(4, null, 1);
          fetch all from rtn;
*/
(
  in p_pr_id integer,
  in p_cli_id integer,
  in p_prov_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_cue_id_compra integer;
   v_cue_id_venta integer;
begin

   select * from sp_producto_get_cue_id(
                       p_cli_id,
                       null,
                       p_pr_id)
                       into v_cue_id_venta;

   select * from sp_producto_get_cue_id(
                       null,
                       p_prov_id,
                       p_pr_id)
                       into v_cue_id_compra;

   rtn := 'rtn';

   -- Si es un kit la cosa se pone mas complicada ya que hay que fijarse
   -- si las componentes del kit llevan stock y numero de serie
   --
   if exists ( select pr_id
               from Producto
               where pr_id = p_pr_id
                 and pr_eskit <> 0 ) then
       declare
          v_bLlevaNroSerie smallint;
          v_unidad varchar(255);
          -- Esto lo hacemos asi, por que si bien solo puede
          -- haber una formula por defecto esta regla esta impuesta
          -- por codigo y no por el motor y en consecuencia puede fallar :)
          v_prfk_id integer;
       begin

          select * from sp_producto_kit_lleva_serie(p_pr_id) into v_bLlevaNroSerie;

          select max(prfk_id)
          into v_prfk_id
          from ProductoFormulaKit
          where pr_id = p_pr_id
            and prfk_default <> 0;

          open rtn for
             SELECT
                uns.un_nombre un_name_stock,-- La unidad de los kits es de ventas
                unv.un_nombre un_name_venta,
                unc.un_nombre un_name_compra,
                v_bLlevaNroSerie pr_llevanroserie,
                prfk.pr_llevanrolote,
                prfk.pr_lotefifo,
                prfk.pr_eskit,
                prfk.rub_id,
                v_cue_id_compra cue_id_compra,
                v_cue_id_venta cue_id_venta,
                prfk.prfk_id,
                prfk.prfk_nombre,
                prfk.pr_kitResumido,
                prfk.pr_kitIdentidad,
                case
                    when exists (
                            select pka.prka_id
                            from ProductoKitItemA pka
                            join ProductoKit pk
                              on pka.prk_id = pk.prk_id
                             and pka.prfk_id = prfk.prfk_id ) then 1
                    else 0
                end tiene_alternativas,
                prfk.ccos_id_compra,
                prfk.ccos_id_venta,
                ccosc.ccos_nombre ccos_name_compra,
                ccosv.ccos_nombre ccos_name_venta

             from Producto
             left join Unidad uns
               on Producto.un_id_stock = uns.un_id
             left join Unidad unv
               on Producto.un_id_venta = unv.un_id
             left join Unidad unc
               on Producto.un_id_compra = unc.un_id
             left join ProductoFormulaKit prfk
               on Producto.pr_id = prfk.pr_id
              and prfk.prfk_id = v_prfk_id
             left join CentroCosto ccosc
               on Producto.ccos_id_compra = ccosc.ccos_id
             left join CentroCosto ccosv
               on Producto.ccos_id_venta = ccosv.ccos_id
             where Producto.pr_id = p_pr_id;

       end;
   else

      open rtn for
         select uns.un_nombre un_name_stock,
                unv.un_nombre un_name_venta,
                unc.un_nombre un_name_compra,
                pr_llevanroserie,
                pr_llevanrolote,
                pr_lotefifo,
                pr_eskit,
                rub_id,
                v_cue_id_compra cue_id_compra,
                v_cue_id_venta cue_id_venta,
                ccos_id_compra,
                ccos_id_venta,
                ccosc.ccos_nombre ccos_name_compra,
                ccosv.ccos_nombre ccos_name_venta
           from Producto
           left join Unidad uns
             on Producto.un_id_stock = uns.un_id
           left join Unidad unv
             on Producto.un_id_venta = unv.un_id
           left join Unidad unc
             on Producto.un_id_compra = unc.un_id
           left join CentroCosto ccosc
             on Producto.ccos_id_compra = ccosc.ccos_id
           left join CentroCosto ccosv
             on Producto.ccos_id_venta = ccosv.ccos_id
           where pr_id = p_pr_id;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_producto_stock_get_data(integer, integer, integer)
  owner to postgres;