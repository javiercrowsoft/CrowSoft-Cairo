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
-- Function: sp_moneda_get_cotizacion()

-- drop function sp_moneda_get_cotizacion(integer, timestamp with time zone);
-- select * from monedaitem
-- select sp_moneda_get_cotizacion(3,'20041231', 0::smallint);
create or replace function sp_moneda_get_cotizacion
(
  in p_mon_id integer,
  in p_fecha timestamp with time zone,
  out p_cotiz decimal(18,6)
)
  returns decimal as
$BODY$
declare
      v_cfg_valor varchar(5000);
begin


   if not exists ( select mon_id
                   from Moneda
                   where mon_id = p_mon_id
                     and mon_legal <> 0 ) then

      select sp_cfg_getValor('General', 'Decimales Cotización') into v_cfg_valor;

      v_cfg_valor := coalesce(v_cfg_valor, '3');

      if isnumeric(v_cfg_valor) = 0 then
         v_cfg_valor := '3';
      end if;

      select *
        into p_cotiz
      from ( select moni_precio
             from MonedaItem
             where mon_id = p_mon_id
               and moni_fecha <= p_fecha
             order by moni_fecha desc ) t
      limit 1;

   end if;

   p_cotiz := coalesce(p_cotiz, 0);

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_moneda_get_cotizacion(integer, timestamp with time zone)
  owner to postgres;