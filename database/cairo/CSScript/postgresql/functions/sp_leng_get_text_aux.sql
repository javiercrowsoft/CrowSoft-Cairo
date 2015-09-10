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
-- Function: sp_leng_get_text_aux()

-- drop function sp_leng_get_text_aux();

create or replace function sp_leng_get_text_aux
(
  in p_code varchar default null,
  in p_leng_id integer default null
) returns varchar as
$BODY$
declare
   v_leng_id integer;
   v_rtn varchar(5000);
begin

   v_leng_id := p_leng_id;

   select lengi_texto
     into v_rtn
     from LenguajeItem
      where leng_id = v_leng_id
              and lengi_codigo = p_code;

   -- if this language doesn't contain a definition for this code
   -- and the language is not the main language ( Spanish )
   -- we use the parent language
   --
   if coalesce(v_rtn, '') = '' and v_leng_id <> 1 then

      select leng_id_padre
        into v_leng_id
        from Lenguaje
         where leng_id = v_leng_id;

      -- if the language doesn't have a parent
      -- we use 1 which is ( Spanish )
      --
      v_leng_id := coalesce(v_leng_id, 1);

      v_rtn := sp_leng_get_text_aux(p_code, v_leng_id);

   end if;

   return v_rtn;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_leng_get_text_aux(varchar, integer)
  owner to postgres;