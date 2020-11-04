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
-- Function: sp_lp_get_precioMarcado()

-- drop function sp_lp_get_precioMarcado(integer, integer, integer, varchar, integer, integer, varchar);
/*
          select * from listapreciomarcado
          select * from sp_lp_get_precioMarcado(1,1);
*/
create or replace function sp_lp_get_precioMarcado
(
  in p_lpm_id integer,
  in p_mon_id integer,
  out p_precio decimal(18,6)
)
  returns decimal(18,6) as
$BODY$
declare
   v_mon_default smallint;
   v_cotiz decimal(18,6);
   v_cotiz2 decimal(18,6);
   v_saltos decimal(18,6);
   v_precio2 decimal(18,6);
   v_lpm_base decimal(18,6);
   v_lpm_porcentaje decimal(18,6);
   v_lpm_salto decimal(18,6);
   v_lpm_decremento decimal(18,6);
   v_lpm_porcminimo decimal(18,6);
   v_lpm_porcmaximo decimal(18,6);
   v_lpm_montominimo decimal(18,6);
   v_mon_id_marcado integer;
   v_lpm_activo smallint;
   v_fecha timestamp with time zone;
begin

   v_fecha := CURRENT_TIMESTAMP;

   select lpm_base,
          lpm_porcentaje,
          lpm_salto,
          lpm_decremento,
          lpm_porcminimo,
          lpm_porcmaximo,
          lpm_montominimo,
          mon_id,
          activo
     into v_lpm_base,
          v_lpm_porcentaje,
          v_lpm_salto,
          v_lpm_decremento,
          v_lpm_porcminimo,
          v_lpm_porcmaximo,
          v_lpm_montominimo,
          v_mon_id_marcado,
          v_lpm_activo
   from ListaPrecioMarcado
   where lpm_id = p_lpm_id;

   -- Solo operamos si hay salto
   --
   if v_lpm_salto > 0 and v_lpm_activo <> 0 then

      --------------------------------------------------------------------------------
      -- Tratamiento de Monedas entre Listas
      --
      --
      -- Si la moneda de la lista es distinta
      -- a la del marcado de la base (es decir a la del precio)
      --
      if p_mon_id <> v_mon_id_marcado then

         -- Si la moneda de la lista es la moneda default
         --
         select mon_legal
           into v_mon_default
         from Moneda
         where mon_id = p_mon_id;

         -- Voy a tener que pasar a pesos el precio
         -- de la base ya que encontre un precio en dolares u otra moneda
         -- distinta a pesos (obvio el ejemplo es pa Argentina che)
         --
         if v_mon_default <> 0 then

            -- Obtengo la cotizacion de la lista base
            --
            select sp_moneda_get_cotizacion(v_mon_id_marcado, v_fecha) into v_cotiz;

            -- Paso a Pesos el precio (sigo en argentino pue)
            --
            v_lpm_montominimo := v_lpm_montominimo * v_cotiz;

            v_lpm_base := v_lpm_base * v_cotiz;

         -- Ahora bien si la moneda de la lista no es la moneda default
         -- (pesos pa los argentinos {quien sabe por cuanto tiempo no :) })
         --
         else

            -- Veamos si la lista base esta en pesos
            --
            select mon_legal
              into v_mon_default
            from Moneda
            where mon_id = v_mon_id_marcado;

            if v_mon_default <> 0 then

               -- Ok la base esta en pesos asi que obtengo la cotizacion de la lista
               -- para la que se me pidio el precio
               --
               select sp_moneda_get_cotizacion(p_mon_id, v_fecha) into v_cotiz;

               -- Si hay cotizacion, divido el precio y guala, tengo
               -- el precio expresado en dolares o yerbas similares
               --
               if v_cotiz <> 0 then

                  v_lpm_montominimo := v_lpm_montominimo / v_cotiz;
                  v_lpm_base := v_lpm_base / v_cotiz;

               else

                  v_lpm_montominimo := 0;-- :( sin cotizacion no hay precio
                  v_lpm_base := 0;

               end if;

            else

               -- Ok, al chango se le ocurrio comprar en dolares y vender en reales
               -- entonces paso los dolares a pesos y luego los pesos a reales y listo
               --
               select sp_moneda_get_cotizacion(v_mon_id_marcado, v_fecha) into v_cotiz;
               select sp_moneda_get_cotizacion(p_mon_id, v_fecha) into v_cotiz2;

               v_lpm_montominimo := v_lpm_montominimo * v_cotiz;
               v_lpm_base := v_lpm_base * v_cotiz;

               -- Si hay cotizacion, divido el precio y guala, tengo
               -- el precio expresado en dolares o yerbas similares
               --
               if v_cotiz2 <> 0 then

                  v_lpm_montominimo := v_lpm_montominimo / v_cotiz2;
                  v_lpm_base := v_lpm_base / v_cotiz2;

               else

                  v_lpm_montominimo := 0;-- :( sin cotizacion no hay precio
                  v_lpm_base := 0;

               end if;
            end if;
         end if;
      end if;

      --
      -- FIN Tratamiento de Monedas entre Listas
      --------------------------------------------------------------------------------

      -- Obtenemos y aplicamos el porcentaje
      --
      v_saltos := (p_precio - v_lpm_base) / v_lpm_salto;

      v_lpm_porcentaje := v_lpm_porcentaje - (v_lpm_decremento * v_saltos);

      if v_lpm_porcentaje < v_lpm_porcminimo then

         v_lpm_porcentaje := v_lpm_porcminimo;

      end if;

      v_precio2 := p_precio * (1 + v_lpm_porcentaje / 100);

      -- Monto Minimo y Porcentaje Maximo
      --
      if (v_precio2 - p_precio) < v_lpm_montominimo then

         v_precio2 := p_precio + v_lpm_montominimo;

      end if;

      if (((v_precio2 / p_precio) - 1) * 100) > v_lpm_porcmaximo then

         v_precio2 := p_precio * (1 + v_lpm_porcmaximo / 100);

      end if;

      -- Finalmente devolvemos el precio
      --
      p_precio := v_precio2;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_lp_get_precioMarcado(integer, integer)
  owner to postgres;