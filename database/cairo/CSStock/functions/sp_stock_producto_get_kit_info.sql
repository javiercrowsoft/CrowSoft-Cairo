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
-- Function: sp_stock_producto_get_kit_info()

-- drop function sp_stock_producto_get_kit_info(integer, integer, integer, integer, integer, integer, integer, integer, integer, integer, integer, integer);
/*
select * from sp_doc_factura_venta_get(1,1,1);
fetch all from rtn;
*/
create or replace function sp_stock_producto_get_kit_info
(
  in p_pr_id integer,
  in p_bCreateTable integer default 1,
  in p_bSoloStockXItem integer default 0,          -- la recursividad se detiene en aquellos kits que no controlan stock por item
  in p_bSetPrIdKit integer default 0,              -- para aquellos items que tambien son kits les asigna el pr_id_kit
                                                   -- solo en el primer nivel es decir que deben producirse los kits que componen
                                                   -- a este kit
  in p_cantidad integer default 1,
  in p_bPPK integer default 0,                     -- cuando estoy armando el kit, no quiero que me exija que los componentes
                                                   -- esten asociados al kit, por que en ese caso no puedo armar el kit
  in ip_prfk_id integer default 0,                 -- la formula a usar
  in p_bExpandKit integer default 0,               -- cuando es cero, si el Kit es resumido, este sp no devuelve los items,
                                                   -- sino que solo devuelve el pr_id del kit, para simular un kit que esta
                                                   -- compuesto unicamente por un item, y de esta forma el kit sera manejado
                                                   -- por todo el resto del codigo como un producto mas.
                                                   --
                                                   -- por ahora el unico que llama a este sp con @@bExpandKit <> 0 es el
                                                   -- parte de produccion para poder consumir los items del kit.
                                                   --
                                                   -- esto SOLO se aplica a los kits que son RESUMIDOS
                                                   --
                                                   -- ademas solo se aplica al primer nivel del Kit, es decir que si tenemos
                                                   -- el kit A compuesto por 10 componentes y uno de ellos es un kit (el B),
                                                   -- este sp devolvera solo 10 componentes, no desagrega los componentes del
                                                   -- Kit B
  in p_bExpandKitAllLevels integer default 0,      -- expande al kit en todos sus niveles, es decir que recorre todos los items,
                                                   -- solo es llamado por ahora por dc_csc_stk_0180 y dc_csc_ven_0350
  in p_bGetFomulaFromTableAux integer default 0,   -- esta tabla contiene hasta diez formulas de kits que deben ser utilizadas
                                                   -- para obtener la lista de insumos del kit
                                                   -- solo es llamado por ahora por dc_csc_prd_0020
  in p_bSetPrIdSubKit integer default 0,           -- identifica cada item con el subkit al que pertence
                                                   -- solo es llamado por ahora por dc_csc_prd_0020
  in p_bAddPrIdKitToTable integer default 0,       -- agrega el pr_id del kit dentro de la tabla #KitItemsSerie

  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
        p_prfk_id integer := ip_prfk_id;

        v_bLlevaNroSerie smallint;  -- si es un kit la cosa se pone mas complicada ya que hay que fijarse
                                    -- si las componentes del kit llevan stock y numero de serie

        v_Unidad varchar(255);
        v_nivel integer;
        v_prk_cantidad decimal(18,6);
        v_pr_id_item integer;
        v_pr_kitResumido smallint;
        v_bExpandKit smallint;      -- para poder incluirlo en el reporte de necesidad de compra
        v_cantidad_kit integer;
begin

   v_bExpandKit := p_bExpandKit;

   if p_bExpandKitAllLevels <> 0 then
      v_bExpandKit := 1;
   end if;

   if p_prfk_id is null then

      if p_bGetFomulaFromTableAux <> 0 then

         select t.prfk_id
           into p_prfk_id
         from tt_FormulasKit t
         join ProductoFormulaKit prfk
           on t.prfk_id = prfk.prfk_id
         where prfk.pr_id = p_pr_id;

      end if;

      if p_prfk_id is null then

         select prfk_id
           into p_prfk_id
         from ProductoFormulaKit
         where pr_id = p_pr_id
           and prfk_default <> 0;

      end if;

   end if;

   -- solo se crea la tabla en la primera llamada
   --
   if p_bCreateTable <> 0 then

         create temporary table tt_FormulasKit (prfk_id integer) on commit drop;

   end if;

   select pr_kitResumido
     into v_pr_kitResumido
   from Producto
   where pr_id = p_pr_id;

   if v_bExpandKit = 0 and v_pr_kitResumido <> 0 then

      insert into tt_kit_item_serie ( pr_id, cantidad, prk_id ) values ( p_pr_id, 1, 0 );

   else

      -- si solo quiere los componentes de kits que controlan stock por item, y este kit no controla stock por item,
      -- (son aquellos que debe ser fabricados previamente), solo agrego este producto y listo
      --
      if exists ( select pr_id
                  from Producto
                  where pr_id = p_pr_id
                    and pr_kitStkItem = 0
                    and p_bSoloStockXItem <> 0 ) then

         insert into tt_kit_item_serie( pr_id, cantidad, prk_id ) values ( p_pr_id, p_cantidad, 0 );

      else


         -- agrego los items de este kit
         --
         select max(nivel)
           into v_nivel
         from tt_KitItems ;

         v_nivel := coalesce(v_nivel, 0) + 1;

         -- agrego todos los items de este kit que son kit
         --
         insert into tt_KitItems
           ( pr_id, nivel )
           ( select k.pr_id_item,
                    v_nivel
             from ProductoKit k
             join Producto p
               on k.pr_id_item = p.pr_id
             where k.prfk_id = p_prfk_id
               and p.pr_eskit <> 0 );

         -- agrego todos los items de este Kit que no sean kit
         --
         insert into tt_kit_item_serie
           ( pr_id, cantidad, prk_id )
           ( select k.pr_id_item,
                    k.prk_cantidad * p_cantidad,
                    k.prk_id
             from ProductoKit k
             join Producto p
               on k.pr_id_item = p.pr_id
             where k.prfk_id = p_prfk_id
               and ( p.pr_eskit = 0 or ( p.pr_kitStkItem = 0 and p_bSoloStockXItem <> 0 )));

         -- actualizo el pr_id_kit para definir a que kit pertenecen estos insumos
         --
         if p_bSetPrIdSubKit <> 0 then

            update tt_kit_item_serie set pr_id_kit = p_pr_id where pr_id_kit is null;

         else

            if p_bSetPrIdKit <> 0 then

               update tt_kit_item_serie set pr_id_kit = 0; -- para diferenciarlos de los Items de Kits

            end if;

         end if;

         loop

            if not exists ( select *
                            from tt_KitItems
                            where nivel = v_nivel ) then
               exit;

            end if;

            select min(pr_id)
              into v_pr_id_item
            from tt_KitItems
            where nivel = v_nivel;

            -- solo los que son kit
            --
            if exists ( select *
                        from Producto
                        where pr_id = v_pr_id_item
                          and pr_eskit <> 0
                          and ( pr_kitStkItem <> 0 or p_bSoloStockXItem = 0 ) ) then

               select prk_cantidad
                 into v_prk_cantidad
               from ProductoKit
               where prfk_id = p_prfk_id
                 and pr_id_item = v_pr_id_item;

               v_prk_cantidad := v_prk_cantidad * p_cantidad;

               select sp_stock_producto_get_kit_info(
                            v_pr_id_item,       --@@pr_id
                            0,                  --@@bCreateTable
                            p_bSoloStockXItem,
                            0,                  --@@bSetPrIdKit
                            v_prk_cantidad,
                            0,                  --@@bPPK
                            null,               --@@prfk_id
                            0,                  --@@bExpandKit
                            p_bExpandKitAllLevels,
                            p_bGetFomulaFromTableAux,
                            p_bSetPrIdSubKit,
                            p_bAddPrIdKitToTable) into rtn;

            end if;

            -- identifico a que kit pertenecen estos items
            -- observen que cuando se utiliza @@bSetPrIdKit todos los insumos
            -- quedan asociados con al primer nivel de sub kits
            --
            if p_bSetPrIdKit <> 0 then

               update tt_kit_item_serie
                  set pr_id_kit = v_pr_id_item
               where pr_id_kit is null;

            end if;

            -- este ya lo procese asi que lo borro
            --
            delete from tt_KitItems where pr_id = v_pr_id_item;

            if p_bAddPrIdKitToTable <> 0 then

               select prk_cantidad * p_cantidad
                 into v_cantidad_kit
               from ProductoKit k
               where k.prfk_id = p_prfk_id
                 and pr_id_item = v_pr_id_item;

               insert into tt_kit_item_serie( pr_id, cantidad, prk_id, pr_id_kit, nivel )
                    values ( v_pr_id_item, v_cantidad_kit, 0, p_pr_id, v_nivel );

            end if;

         end loop;

         -- pongo en null para que no se confunda el 0 con un id de producto y
         -- fallen otros sp que llaman a este y luego utilizan el pr_id_kit para
         -- insertarlo en alguna tabla, como es el caso de sp_DocParteProdKitSaveItemKit
         --
         if p_bSetPrIdKit <> 0 then

            update tt_kit_item_serie
               set pr_id_kit = null
            where pr_id_kit = 0;

         end if;

      end if;

      -- solo si no estoy produciendo el kit
      --
      if p_bSetPrIdKit <> 0 and p_bPPK = 0 and p_bSetPrIdSubKit = 0 then

         if exists ( select *
                     from Producto
                     where pr_id = p_pr_id
                       and pr_eskit <> 0
                       and pr_kitStkItem = 0 ) then

            update tt_kit_item_serie set pr_id_kit = p_pr_id;

         end if;

      end if;

   end if;

   -- solo la primera llamada devuelve datos
   --
   if p_bCreateTable <> 0 then

      if p_bSetPrIdKit <> 0 then

         open rtn for
            select k.pr_id,
                   p.pr_nombrecompra,
                   p.pr_llevanroserie,
                   k.pr_id_kit,
                   sum(cantidad) cantidad
            from tt_kit_item_serie k
            join Producto p
              on k.pr_id = p.pr_id
            group by k.pr_id,p.pr_nombrecompra,p.pr_llevanroserie,k.pr_id_kit;

      else

         open rtn for
            select k.pr_id,
                   p.pr_nombrecompra,
                   p.pr_llevanroserie,
                   sum(cantidad) cantidad
            from tt_kit_item_serie k
            join Producto p
              on k.pr_id = p.pr_id
            group by k.pr_id,p.pr_nombrecompra,p.pr_llevanroserie;

      end if;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_stock_producto_get_kit_info(integer, integer, integer, integer, integer, integer, integer, integer, integer, integer, integer, integer)
  owner to postgres;