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
-- Function: sp_cliente_validate_cuit()

-- drop function sp_cliente_validate_cuit(integer);

-- select cli_id, cli_cuit from cliente where cli_cuit <> ''
-- select sp_cliente_validate_cuit(1)

create or replace function sp_cliente_validate_cuit
(
  in p_cli_id integer,
  out p_is_valid integer
)
  returns integer as
$BODY$
declare
   v_cli_catfiscal integer;
   v_cli_cuit varchar;

   v_cfg_valor varchar(255);
   
   csCatFInscripto integer := 1;
   csCatFExento integer := 2;
   csCatFNoInscripto integer := 3;
   csCatFConsumidorFinal integer := 4;
   csCatFExtranjero integer := 5;
   csCatFMonoTributo integer := 6;
   csCatFExtranjeroIva integer := 7;
   csCatFNoResponsable integer := 8;
   csCatFNoResponsableExento integer := 9;
   csCatFNoCategorizado integer := 10;
   csCatFInscriptoM integer := 11;
begin

   select cli_catfiscal, cli_cuit
     into v_cli_catfiscal, v_cli_cuit
   from cliente 
   where cli_id = p_cli_id;

   p_is_valid := 1;

   if v_cli_catfiscal not in (csCatFConsumidorFinal, csCatFExento, csCatFExtranjero, csCatFNoCategorizado) then

      if v_cli_cuit = '' then

         p_is_valid := 0;

      else

         select sp_cfg_getValor('Contabilidad-General', 'Clave Fiscal') into v_cfg_valor;

         v_cfg_valor := coalesce(v_cfg_valor, '0');

         if to_number(v_cfg_valor) = 1 /* CUIT */ then

             select sp_cuit_validate(v_cli_cuit) into p_is_valid;

         else

             select sp_rut_validate(v_cli_cuit) into p_is_valid;

         end if;

      end if;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_cliente_validate_cuit(integer)
  owner to postgres;