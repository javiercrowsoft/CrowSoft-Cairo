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
-- Function: sp_sys_language_update()

-- drop function sp_sys_language_update();

create or replace function sp_sys_language_update()
  returns void as
$BODY$
declare
   cur refcursor;
   v_row record;
begin

   set TRANSACTION READ WRITE;

   delete from sysLanguage;

   open cur for select leng_id from lenguaje;
   loop
          fetch cur into v_row;
          exit when not found;

          perform sp_sys_language_update(v_row.leng_id);
          
   end loop;
   close cur;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_sys_language_update()
  owner to postgres;


-- Function: sp_sys_language_update(int)

-- drop function sp_sys_language_update(int);

create or replace function sp_sys_language_update(in p_leng_id integer)
  returns void as
$BODY$
declare
   cur refcursor;
   v_row record;
   v_text varchar(5000);
begin

   set TRANSACTION READ WRITE;

   open cur for select distinct(lengi_codigo) from lenguajeItem;
   loop
          fetch cur into v_row;
          exit when not found;

          v_text := sp_leng_get_text_aux(v_row.lengi_codigo, p_leng_id);

          if v_text <> '' then

            insert into sysLanguage (leng_id, sysl_code, sysl_text) values(p_leng_id, v_row.lengi_codigo, v_text);
          else
            raise notice 'CODE not found: %', v_row.lengi_codigo;
          end if;

   end loop;
   close cur;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_sys_language_update()
  owner to postgres;
