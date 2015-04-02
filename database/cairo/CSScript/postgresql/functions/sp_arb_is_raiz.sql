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
-- Function: sp_arbisraiz(integer)

-- drop function sp_arbisraiz(integer);

create or replace function sp_arbisraiz(in p_ram_id integer, out p_israiz smallint)
  returns smallint as
$BODY$
declare
   v_temp integer := 0;
begin

   begin
      select count(*) into v_temp
      from Rama
         where ram_id = p_ram_id
                 and ram_id_padre = 0;
   exception
      when others then
         null;
         raise info 'puto';
   end;

   -- Verifico que se trate de una raiz
   if v_temp = 1 then
      p_IsRaiz := 1::smallint;

   else
      p_IsRaiz := 0::smallint;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_arbisraiz(integer)
  owner to postgres;
