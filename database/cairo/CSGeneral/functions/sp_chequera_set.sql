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
-- Function: sp_chequera_set()

-- drop function sp_chequera_set();

/*
 select * from Chequera
 exec sp_chequera_set 2,'x-0001-0002405'
*/

create or replace
function sp_chequera_set
(
  in p_chq_id integer,
  in p_chq_numero varchar
)
  returns void as
$BODY$
declare
   v_numero integer;
   v_c varchar(1);
   v_n smallint;
   v_ultimoNumero integer;
begin

   v_n := length(p_chq_numero);
   v_c := substr(p_chq_numero, v_n, 1);

   while instr('1234567890', v_c) <> 0
   loop

      v_n := v_n - 1;

      exit when v_n <= 0;

      v_c := substr(p_chq_numero, v_n, 1);

   end loop;

   v_n := v_n + 1;

   v_numero := to_number(substr(p_chq_numero, v_n, length(p_chq_numero)));

   select chq_ultimoNumero
     into v_ultimoNumero
   from Chequera
   where chq_id = p_chq_id;

   if v_ultimoNumero < v_numero then

      update Chequera
         set chq_ultimoNumero = v_numero
      where chq_id = p_chq_id;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_chequera_set(integer, varchar)
  owner to postgres;