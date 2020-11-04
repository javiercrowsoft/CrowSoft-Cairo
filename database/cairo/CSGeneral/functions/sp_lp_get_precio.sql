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
-- Function: sp_lp_get_precio()

-- drop function sp_lp_get_precio(integer, integer, integer, integer, integer, integer, integer, integer);

create or replace function sp_lp_get_precio
/*
          select * from listapreciolista where lp_id_padre = 5
          select pr_id,* from listaprecioitem where lp_id = 49
          select * from listaprecio where lp_id in (5,49,31)
          select * from listaprecioitem where pr_id = 19
          select * from sp_lp_get_precio(49,19)
*/
(
  in p_lp_id integer,
  in p_pr_id integer,

  /*
    this function is recursive
    all the parameters below must be
    provided only by a recursive call
    NONE external call to this function
    can use this parameters
  */

  in p_createTable integer default 1,
  in p_lp_id_padre integer default 0,
  in p_n integer default 0,
  in p_noUseCache integer default 0,
  in ip_lp_id_lpc integer default 0,
  in p_isForCompra integer default 0,
  out p_precio decimal(18,6)
)
  returns decimal(18,6) as
$BODY$
declare
   p_lp_id_lpc integer := ip_lp_id_lpc; -- Este Id de lista de precios
   v_lpi_porcentaje decimal(18,6);
   v_lp_porcglobal decimal(18,6);
   v_precio decimal(18,6);
   v_lp_id integer;
   v_mon_id integer;
   v_mon_id_base integer;
   v_mon_default smallint;
   v_lp_porcentaje decimal(18,6);
   v_lp_enCache smallint;
   v_cfg_valor varchar(5000);
   v_cotiz decimal(18,6);
   v_cotiz2 decimal(18,6);

   v_lpm_id integer; -- lpm_id mencionado en la solapa precios de una lista hija

   v_lpm_id_lista integer; -- lmp_id mencionado en la solapa general de una lista hija

   v_lpm_id_precio integer; -- lpm_id mencionado en la solapa precios de la misma lista

   -- que estoy procesando
   v_fecha timestamp with time zone;

   -- Si es la primera llamada a la lista
   -- analizo el uso de ListaPrecioConfig
   --
   v_checkListaPrecioConfig smallint;

   v_isForCompra integer;
   v_n integer;
   v_createTable integer;
begin

   v_isForCompra := p_isForCompra;
   v_n := p_n;
   v_createTable := p_createTable;

   select mon_id,
          lp_porcentaje,
          lp_encache
     into v_mon_id,
          v_lp_porcentaje,
          v_lp_enCache
   from ListaPrecio
   where lp_id = p_lp_id
     and activo <> 0;

   v_fecha := CURRENT_TIMESTAMP;

   if v_n = 0 then
      v_checkListaPrecioConfig := 1;
   else
      v_checkListaPrecioConfig := 0;
   end if;

   -- Si es la primera llamada compruebo si se trata de una lista de compras
   --
   if v_n = 0 then

      if exists ( select *
                  from ListaPrecio
                  where lp_id = p_lp_id
                    and lp_tipo = 2 ) then

         v_isForCompra := 1;
      end if;
   end if;

   v_n := v_n + 1;

   -- Si la lista no existe devuelvo precio 0
   --
   if p_lp_id is null then

      v_precio := 0;

   else

      -- Si la lista no existe devuelvo precio 0
      --
      if not exists ( select lp_id
                      from ListaPrecio
                      where lp_id = p_lp_id
                        and activo <> 0 ) then
         v_precio := 0;

      else
       declare
         v_fromCache smallint;
       begin
         v_fromCache := 0;

         if p_noUseCache = 0 then
            if v_lp_enCache <> 0 then
             declare
               v_cacheActivo integer;
             begin

               select sp_cfg_getValor('Ventas-General', 'Utilizar Cache de Precios') into v_cfg_valor;

               if isnumeric(v_cfg_valor) = 0 then
                  v_cacheActivo := 0;
               else
                  v_cacheActivo := to_number(v_cfg_valor);
               end if;

               if v_cacheActivo <> 0 then
                  v_fromCache := 1;

                  select coalesce(lpp_precio, 0)
                    into v_precio
                  from ListaPrecioPrecio
                  where pr_id = p_pr_id
                    and lp_id = p_lp_id;

               end if;

             end;
            end if;
         end if;

         if v_fromCache = 0 then

            -- Si es la primera llamada a la lista
            -- analizo el uso de ListaPrecioConfig
            --
            if v_checkListaPrecioConfig <> 0 then

               -- Solo si la lista principal no tiene un precio fijo
               --
               if not exists ( select *
                               from ListaPrecioItem
                               where lp_id = p_lp_id
                                 and pr_id = p_pr_id ) then

                  -- Si existen listas definidas para este producto
                  --
                  if exists ( select * from ListaPrecioConfig where pr_id = p_pr_id ) then

                     -- Si existen precios en las listas definidas para este producto
                     --
                     if exists ( select *
                                 from ListaPrecioItem lpi
                                 where pr_id = p_pr_id
                                   and exists ( select *
                                                from ListaPrecioConfig
                                                where pr_id = p_pr_id
                                                  and lp_id = lpi.lp_id )) then
                      declare
                        -- Cargo en una temporal todas las listas
                        -- (la principal y todo sus ancestros)
                        --
                        v_k integer := 1;
                      begin

                        create temporary table tt_listas_padre
                        (
                          lp_id integer,
                          k integer
                        ) on commit drop;

                        -- La lista principal
                        --
                        insert into tt_listas_padre( lp_id, k ) values ( p_lp_id, 0 );

                        -- La lista padre de la principal (viejo esquema)
                        --
                        insert into tt_listas_padre( lp_id, k )
                          ( select lp_id_padre,
                                   v_k
                            from ListaPrecio
                            where lp_id = p_lp_id
                              and lp_id_padre is not null );

                        -- Las listas padre de la principal (nuevo viejo esquema)
                        --
                        insert into tt_listas_padre( lp_id, k )
                          ( select lp_id_padre,
                                   v_k
                            from ListaPrecioLista lp
                            where lp_id = p_lp_id
                              and lp_id_padre is not null
                              and not exists ( select *
                                               from tt_listas_padre
                                               where lp_id = lp.lp_id_padre ));

                        loop

                            if not exists ( select *
                                            from ListaPrecioLista lp
                                            join tt_listas_padre p
                                              on lp.lp_id = p.lp_id
                                             and p.k = v_k ) then
                               exit;
                            end if;

                            -- La lista padre de los padres (viejo esquema)
                            --
                            insert into tt_listas_padre( lp_id, k )
                            ( select lp.lp_id_padre,
                                     v_k + 1
                              from ListaPrecio lp
                              join tt_listas_padre p
                                on lp.lp_id = p.lp_id
                               and p.k = v_k
                              where lp.lp_id_padre is not null
                                and not exists ( select *
                                                 from tt_listas_padre
                                                 where lp_id = lp.lp_id_padre ));

                            -- Las listas padre de los padres (nuevo viejo esquema)
                            --
                            insert into tt_listas_padre( lp_id, k )
                            ( select lp.lp_id_padre,
                                     v_k + 1
                              from ListaPrecioLista lp
                              join tt_listas_padre p
                                on lp.lp_id = p.lp_id
                               and p.k = v_k
                              where lp.lp_id_padre is not null
                                and not exists ( select *
                                                 from tt_listas_padre
                                                 where lp_id = lp.lp_id_padre ));

                            v_k := v_k + 1;

                        end loop;

                        -- Cargo en una temporal todas las listas
                        -- (la principal y todo sus ancestros)
                        --
                        -- Ahora verifico que almenos una de estas listas
                        -- asociadas al producto en ListaPrecioConfig
                        -- tambien este asociada a la lista principal
                        -- o a uno de sus ancestros
                        --
                        -- Si existen precios en las listas definidas para este producto
                        --

                        if exists ( select 1
                                    from ListaPrecioItem lpi
                                    where pr_id = p_pr_id
                                      and exists ( select 1
                                                   from ListaPrecioConfig lpc
                                                   join tt_listas_padre p
                                                      on lpc.lp_id = p.lp_id
                                                   where lpc.pr_id = p_pr_id
                                                     and lpc.lp_id = lpi.lp_id )) then
                         declare
                           v_lpc_orden integer;
                         begin
                           select min(lpc.lpc_orden)
                             into v_lpc_orden
                           from ListaPrecioConfig lpc
                           join tt_listas_padre p
                             on lpc.lp_id = p.lp_id
                           where lpc.pr_id = p_pr_id
                             and exists ( select *
                                          from ListaPrecioItem lpi
                                          where pr_id = p_pr_id
                                            and lp_id = lpc.lp_id );

                           select lp_id
                             into p_lp_id_lpc
                           from ListaPrecioConfig i
                           where pr_id = p_pr_id
                             and lpc_orden = v_lpc_orden;

                           p_lp_id_lpc := coalesce(p_lp_id_lpc, 0);

                         end;
                        end if;

                      end;
                     end if;

                  end if;

               end if;
            end if;

            -- Busco un precio en esta lista
            --
            select lpi_precio, lpm_id
              into v_precio, v_lpm_id_precio
            from ListaPrecioItem
            where lp_id = p_lp_id
              and pr_id = p_pr_id
              and ( lp_id = p_lp_id_lpc or p_lp_id_lpc = 0 );

            -- Si tengo una lista de marcado
            --
            if coalesce(v_precio, 0) <> 0
               and v_lpm_id_precio is not null
               and v_isForCompra = 0
            then

               select sp_lp_get_precio_marcado(v_lpm_id_precio, v_mon_id) into v_precio;

            end if;

            -- Sino hay precio
            --
            if coalesce(v_precio, 0) = 0 then
               -- Si es la primear llamada creo las tablas
               --
               if v_createTable <> 0 then

                    create temporary table tt_precios
                    (
                      lpi_precio decimal(18,6),
                      lpi_porcentaje decimal(18,6),
                      lp_id_padre integer,
                      lp_id integer,
                      lpm_id integer
                    ) on commit drop;

                    create temporary table tt_listas
                    (
                      lp_id integer  not null,
                      lp_porcglobal decimal(18,6),
                      N integer,
                      mon_id integer,
                      lpm_id integer
                    ) on commit drop;

                  v_createTable := 0;
               end if;

               -- inserto el porcentaje si lo hay
               -- sobre este articulo
               --
               insert into tt_precios( lpi_precio, lpi_porcentaje, lp_id_padre, lp_id, lpm_id )
                 ( select 0,
                          lpi_porcentaje,
                          p_lp_id_padre,
                          p_lp_id,
                          lpm_id
                   from ListaPrecioItem
                   where lp_id = p_lp_id
                     and pr_id = p_pr_id );

               -------------------------------------------------------------------------------
               -- inserto todas las listas bases de esta lista
               --
               -- viejo esquema
               --
               insert into tt_listas( lp_id, lp_porcglobal, N, mon_id )
                 ( select lp_id,
                          v_lp_porcentaje,
                          v_n,
                          mon_id
                   from ListaPrecio lp
                   where exists ( select *
                                  from ListaPrecio
                                  where lp_id = p_lp_id
                                    and lp_id_padre = lp.lp_id )
                     and activo <> 0 );

               -- nuevo esquema
               --
               insert into tt_listas( lp_id, lp_porcglobal, N, mon_id, lpm_id )
                 ( select lpl.lp_id_padre,
                          lpl.lpl_porcentaje,
                          v_n,
                          lp.mon_id,
                          lpl.lpm_id
                   from ListaPrecioLista lpl
                   join ListaPrecio lp
                     on lpl.lp_id_padre = lp.lp_id
                   where lpl.lp_id = p_lp_id
                     and lp.activo <> 0 );

               loop

                 if not exists ( select * from tt_listas where n = v_n ) then
                   exit;
                 end if;

                 v_lpm_id := null;
                 v_lpm_id_lista := null;
                 v_mon_id_base := null;
                 v_lpi_porcentaje := 0;
                 v_lp_porcglobal := 0;

                 -- Obtengo la primera lista base
                 --
                 select min(lp_id) into v_lp_id from tt_listas where n = v_n;

                 -- obtengo el porcentaje global y el porcentaje sobre articulo para esta lista base
                 --
                 select lpi_porcentaje, lpm_id
                   into v_lpi_porcentaje, v_lpm_id
                 from tt_precios
                 where lp_id = p_lp_id;

                 select lp_porcglobal, mon_id, lpm_id
                   into v_lp_porcglobal, v_mon_id_base, v_lpm_id_lista
                 from tt_listas
                 where lp_id = v_lp_id;

                 -- La saco de la bolsa de listas pendientes
                 --
                 delete from tt_listas where lp_id = v_lp_id;

                 select sp_lp_get_precio(
                              v_lp_id,
                              p_pr_id,
                              0,
                              p_lp_id,
                              v_n,
                              p_noUseCache,
                              p_lp_id_lpc,
                              v_isForCompra)
                 into v_precio;

                 -- Si tengo un precio
                 --
                 if v_precio <> 0 then
                    -- Le aplico los porcentajes
                    --
                    v_precio := v_precio
                                + (v_precio * coalesce(v_lp_porcglobal, 0) / 100)
                                + (v_precio * coalesce(v_lpi_porcentaje, 0) / 100);

                    -- Si tengo una lista de marcado sobre el articulo
                    --
                    if v_lpm_id is not null then

                       select sp_lp_get_precio_marcado(v_lpm_id, v_mon_id_base) into v_precio;

                    end if;

                    -- Si tengo una lista de marcado sobre la lista
                    --
                    if v_lpm_id_lista is not null then

                       select sp_lp_get_precio_marcado(v_lpm_id_lista, v_mon_id_base) into v_precio;

                    end if;

                    -- Si la moneda de la lista es distinta
                    -- a la de la base (es decir a la del precio)
                    --
                    if v_mon_id <> v_mon_id_base then

                       -- Si la moneda de la lista es la moneda default
                       --
                       select mon_legal
                         into v_mon_default
                       from Moneda
                       where mon_id = v_mon_id;

                       -- Voy a tener que pasar a pesos el precio
                       -- de la base ya que encontre un precio en dolares u otra moneda
                       -- distinta a pesos (obvio el ejemplo es pa Argentina che)
                       --
                       if v_mon_default <> 0 then

                          -- Obtengo la cotizacion de la lista base
                          --
                          select sp_moneda_get_cotizacion(v_mon_id_base, v_fecha) into v_cotiz;

                          -- Paso a Pesos el precio (sigo en argentino pue)
                          --
                          v_precio := v_precio * v_cotiz;

                       -- Ahora bien si la moneda de la lista no es la moneda default
                       -- (pesos pa los argentinos {quien sabe por cuanto tiempo no :) })
                       --
                       else

                          -- Veamos si la lista base esta en pesos
                          --
                          select mon_legal
                            into v_mon_default
                          from Moneda
                          where mon_id = v_mon_id_base;

                          if v_mon_default <> 0 then

                             -- Ok la base esta en pesos asi que obtengo la cotizacion de la lista
                             -- para la que se me pidio el precio
                             --
                             select sp_moneda_get_cotizacion(v_mon_id, v_fecha) into v_cotiz;

                             -- Si hay cotizacion, divido el precio y guala, tengo
                             -- el precio expresado en dolares o yerbas similares
                             --
                             if v_cotiz <> 0 then

                                v_precio := v_precio / v_cotiz;

                             else

                                v_precio := 0;-- :( sin cotizacion no hay precio

                             end if;

                          else

                             -- Ok, al chango se le ocurrio comprar en dolares y vender en reales
                             -- entonces paso los dolares a pesos y luego los pesos a reales y listo
                             --
                             select sp_moneda_get_cotizacion(v_mon_id_base, v_fecha) into v_cotiz;

                             select sp_moneda_get_cotizacion(v_mon_id, v_fecha) into v_cotiz2;

                             v_precio := v_precio * v_cotiz;

                             -- Si hay cotizacion, divido el precio y guala, tengo
                             -- el precio expresado en dolares o yerbas similares
                             --
                             if v_cotiz2 <> 0 then

                                v_precio := v_precio / v_cotiz2;

                             else

                                v_precio := 0;-- :( sin cotizacion no hay precio

                             end if;

                          end if;

                       end if;

                    end if;

                    if not exists(select 1 from tt_precios where lp_id = v_lp_id) then

                       insert into tt_precios( lpi_precio, lpi_porcentaje, lp_id_padre, lp_id, lpm_id )
                                      values ( v_precio, 0, p_lp_id, 0, 0 );

                    else
                       -- Aplico al precio de la lista base el porcentaje global y el porcentaje sobre articulo
                       --
                       update tt_precios set lpi_precio = v_precio where lp_id = v_lp_id;

                    end if;

                 end if;
               end loop;

               -----------------------------------------------------------------------------------------
               -- while

               -- Si no encontre precios en esta lista devuelvo 0
               --
               if not exists( select 1 from tt_precios where lpi_precio <> 0) then

                  v_precio := 0;

               else

                  select min(lpi_precio)
                    into v_precio
                  from tt_precios
                  where lp_id_padre = p_lp_id
                    and lpi_precio > 0;

               end if;

            end if;

            --if IsNull(@precio,0) = 0 begin
            -- Ahora aplico las condiciones de redondeo de la lista
            -- solo si estoy en la primera llamada
            --
            if v_n = 1 and v_precio <> 0 then
             declare
               v_pr_noredondeo smallint;
             begin
               select pr_noredondeo
                 into v_pr_noredondeo
               from Producto
               where pr_id = p_pr_id;

               if v_pr_noredondeo = 0 then
                declare
                  v_bRedondear integer;
                begin

                  -- Veo si hay que redondear
                  --
                  select sp_cfg_getValor('Ventas-General', 'Redondear Decimales en Precios') into v_cfg_valor;

                  if isnumeric(v_cfg_valor) = 0 then
                     v_bRedondear := 0;
                  else
                     v_bRedondear := to_number(v_cfg_valor);
                  end if;

                  if v_bRedondear <> 0 and v_isForCompra = 0 then
                   declare
                     v_decimales integer;
                     v_precio_entero integer;
                   begin
                     -- Obtengo la cantidad de decimales
                     --
                     select sp_cfg_getValor('Ventas-General', 'Decimales en Precios') into v_cfg_valor;

                     if isnumeric(v_cfg_valor) <> 0 then
                        v_decimales := to_number(v_cfg_valor);
                     else
                        v_decimales := 0;
                     end if;

                     v_precio := round(v_precio, v_decimales);

                     v_precio_entero := v_precio;

                     -- Solo si el precio es entero
                     --
                     if v_precio_entero = v_precio then
                      declare
                        v_centavos decimal(18,6);
                      begin

                        -- Veo cuantos centavos le quiere restar
                        -- a los importes enteros
                        --
                        select sp_cfg_getValor('Ventas-General', 'Restar a precios enteros') into v_cfg_valor;

                        if isnumeric(v_cfg_valor) <> 0 then
                           v_centavos := to_number(v_cfg_valor);
                        else
                           v_centavos := 0;
                        end if;

                        if v_centavos <> 0 then

                           v_precio := v_precio - v_centavos;

                        end if;

                      end;
                     end if;

                   end;
                  end if;

                end;
               end if;

             end;
            end if;

         end if;

       end;
      end if;

   end if;

   p_precio := coalesce(v_precio, 0);

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_lp_get_precio(integer, integer, integer, integer, integer, integer, integer, integer)
  owner to postgres;