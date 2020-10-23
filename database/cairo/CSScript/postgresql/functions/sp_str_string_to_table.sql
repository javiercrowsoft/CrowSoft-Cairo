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
-- Function: sp_str_string_to_table()

-- drop function sp_str_string_to_table(timestamp with time zone, varchar, varchar);
/*

  select sp_str_string_to_table(CURRENT_TIMESTAMP,'',',');

*/

create or replace
function sp_str_string_to_table
(
  in p_codigo bigint,
  in p_toSearch varchar,
  in p_separator varchar default ' '
)
  returns void as
$BODY$
declare
   v_i smallint;
   v_s varchar(255);
   v_toSearch varchar(4000); 
begin

   v_toSearch := rtrim(ltrim(coalesce(p_toSearch, '')));

   while length(v_toSearch) > 0
   loop
      begin
         v_i := 1;

         while v_i <= length(v_toSearch)
           and length(v_toSearch) > 0
         loop
            begin
               v_s := substr(v_toSearch, v_i, 1);

               if v_s = p_separator then
                  exit;

               end if;

               v_i := v_i + 1;

            end;
         end loop;

         if v_s = p_separator then
         begin
            insert into TmpStringToTable
              ( tmpstr2tbl_campo, tmpstr2tbl_id )
              values ( ltrim(substr(v_toSearch, 1, v_i - 1)), p_codigo );

         end;
         else
         begin
            insert into TmpStringToTable
              ( tmpstr2tbl_campo, tmpstr2tbl_id )
              values ( ltrim(substr(v_toSearch, 1, v_i)), p_codigo );

         end;
         end if;

         v_i := v_i + 1;

         v_toSearch := ltrim(substr(v_toSearch, v_i, length(v_toSearch)));

      end;
   end loop;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_str_string_to_table(bigint, varchar, varchar)
  owner to postgres;