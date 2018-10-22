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
-- Function: FEGetPuntoVta(character varying)

-- drop function FEGetPuntoVta(character varying);

/*

select FEGetPuntoVta (611)

sp_Cfg_SetValor 'Contabilidad-General', 'Punto Venta FE', 1, 1

*/


create or replace function FEGetPuntoVta(
   in p_fv_id integer
)
returns integer as
$BODY$
declare
	v_doc_id integer;
	v_emp_id integer;
	v_cfg_valor varchar;
	v_cfg_clave varchar;
	v_puntoVta integer;
begin

   select doc_id into v_doc_id from facturaVenta where fv_id = p_fv_id;

   select emp_id into v_emp_id from documento where doc_id = v_doc_id;

   v_cfg_clave := 'Punto Venta FE';

   select cfg_valor into v_cfg_valor
   from 	configuracion
   where cfg_grupo   = 'Contabilidad-General'
     and cfg_aspecto = v_cfg_clave
     and (emp_id = v_emp_id or (emp_id is null and v_emp_id is null));

   v_puntoVta := 0;

   if isnumeric(v_cfg_valor) <> 0 then

      v_puntoVta := to_number(v_cfg_valor);

   end if;

   return v_puntoVta;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function FEGetPuntoVta(integer)
  owner to postgres;
