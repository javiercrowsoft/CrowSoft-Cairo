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
-- Function: sp_doc_asiento_validate()

-- drop function sp_doc_asiento_validate(integer);

create or replace function sp_doc_asiento_validate
(
  in p_as_id integer,
  out p_error integer,
  out p_error_msg varchar
)
  returns record as
$BODY$
declare
   v_debe decimal(18,6);
   v_haber decimal(18,6);
   v_strDebe varchar(255);
   v_strHaber varchar(255);

   v_asi_id integer;
   v_dif decimal(18,6);
begin

   select sum(asi_debe),
          sum(asi_haber)
     into v_debe,
          v_haber
   from AsientoItem
   where as_id = p_as_id;

   v_debe := round(coalesce(v_debe, 0), 2);
   v_haber := round(coalesce(v_haber, 0), 2);

   if v_debe <> v_haber then

      v_strDebe := sqlserver_utilities.convert_('varchar', v_debe, 1);
      v_strHaber := sqlserver_utilities.convert_('varchar', v_haber, 1);
      v_strDebe := substr(v_strDebe, 1, length(v_strDebe) - 4);
      v_strHaber := substr(v_strHaber, 1, length(v_strHaber) - 4);

      p_error := 1;
      p_error_msg := '@@ERROR_SP:El asiento no balancea:;;  Debe : ' || v_strDebe || ';  Haber: ' || v_strHaber || ';;';

   else

      update asientoitem
         set asi_debe = round(asi_debe, 2),
             asi_haber = round(asi_haber, 2)
      where as_id = p_as_id;

      select sum(asi.asi_debe) - sum(asi.asi_haber)
        into v_dif
      from Asiento ast
      join AsientoItem asi
        on ast.as_id = asi.as_id
      group by ast.as_id;

      if v_dif <> 0 then

         if v_dif < 0 then
            select min(asi_id)
              into v_asi_id
            from AsientoItem
            where as_id = p_as_id
              and asi_debe <> 0;

         else
            select min(asi_id)
              into v_asi_id
            from AsientoItem
            where as_id = p_as_id
              and asi_haber <> 0;

         end if;

         if v_asi_id is not null then

            if v_dif < 0 then

               update asientoitem
                  set asi_debe = asi_debe + abs(v_dif)
               where asi_id = v_asi_id;

            else

               update asientoitem
                  set asi_haber = asi_haber + abs(v_dif)
               where asi_id = v_asi_id;

            end if;

         end if;

      end if;

      delete from asientoitem
      where asi_debe = 0
        and asi_haber = 0
        and as_id = p_as_id;

      update asientoitem
         set asi_debe = abs(asi_haber),
             asi_haber = 0
      where asi_haber < 0
        and asi_debe = 0
        and as_id = p_as_id;

      update asientoitem
         set asi_haber = abs(asi_debe),
             asi_debe = 0
      where asi_debe < 0
        and asi_haber = 0
        and as_id = p_as_id;

      p_error := 0;

   end if;

end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function sp_doc_asiento_validate(integer)
  owner to postgres;