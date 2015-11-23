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
-- Function: sp_cliente_get_cuit_info()

-- drop function sp_cliente_get_cuit_info(varchar);

create or replace function sp_cliente_get_cuit_info
(
  in p_Cuit varchar,
  
  out p_cli_id integer,
  out p_cli_code varchar,
  out p_cli_razonsocial varchar
)
  returns record as
$BODY$
begin

   if   substr(p_cuit, 1, 2) = '55'
     or substr(p_cuit, 1, 2) = '50'
     or p_cuit = '00-00000000-0'
     or p_cuit = 'cuit' then

      select cli_razonsocial,
             cli_code,
             cli_id
        into p_cli_id,
             p_cli_code,
             p_cli_razonsocial                
      from Cliente
      where 1 = 2;


   else
      select cli_razonsocial,
             cli_code,
             cli_id
        into p_cli_id,
             p_cli_code,
             p_cli_razonsocial                
      from Cliente
      where cli_cuit = p_Cuit;

   end if;
   
   p_cli_id := coalesce(p_cli_id, 0);
   p_cli_code := coalesce(p_cli_code, '');
   p_cli_razonsocial := coalesce(p_cli_razonsocial, '');   

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_cliente_get_cuit_info(varchar)
  owner to postgres;