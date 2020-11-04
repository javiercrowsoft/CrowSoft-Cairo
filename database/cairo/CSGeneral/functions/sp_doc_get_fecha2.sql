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
-- Function: sp_doc_get_fecha2()

-- drop function sp_doc_get_fecha2(date, integer, integer);

create or replace
function sp_doc_get_fecha2
/*
select * from clearing
select cle_id, * from cheque
select * from feriadoitem
select * from sp_doc_get_fecha2('20150709', 2, null)
select @fecha
*/
(
  in p_fecha timestamp with time zone,
  in p_is_banco integer,
  in p_cle_id integer,
  out p_fecha2 date
)
  returns date as
$BODY$
declare
   v_fecha2 timestamp with time zone;
   v_oldDateFirst integer;
   v_dayweek smallint;
   v_dias smallint;
   v_n smallint;
begin


   -- obtengo el numero de dia de la
   -- fecha que me pasaron
   --
   v_dayweek := extract(dow from p_fecha);

   v_fecha2 := case v_dayweek
                  when 6 /*sabado*/  then dateadd('D', 2, p_fecha)
                  when 0 /*domingo*/ then dateadd('D', 1, p_fecha)
                  else p_fecha
               end;

   -- si es para un cheque
   --
   if p_is_banco <> 0 then

      loop

         if not exists ( select fei.fe_id
                            from FeriadoItem fei
                                   join Feriado fe
                                    on fe.fe_id = fe.fe_id
                                   and fe.fe_banco <> 0
                                   and fe.fe_local = 0
                            where fei.fei_fecha::date = v_fecha2 ) then
            exit;
         end if;

         v_fecha2 := dateadd('D', 1, v_fecha2);

      end loop;

      -- obtengo el dia despues de moverme por feriados
      --
      v_dayweek := extract(dow from v_fecha2);

      loop

         if v_dayweek not in ( 6, 0 ) then
            exit;
         end if;

         -- si estoy en un fin de semana
         --
         v_fecha2 := case v_dayweek
                         when 6 /*sabado*/  then dateadd('D', 2, v_fecha2)
                         when 0 /*domingo*/ then dateadd('D', 1, v_fecha2)
                         else v_fecha2
                     end;

         loop

            if not exists ( select fei.fe_id
                            from FeriadoItem fei
                            join Feriado fe
                              on fe.fe_id = fe.fe_id
                             and fe.fe_banco <> 0
                             and fe.fe_local = 0
                            where fei.fei_fecha::date = v_fecha2 ) then
               exit;
            end if;

            v_fecha2 := dateadd('D', 1, v_fecha2);

         end loop;

         -- obtengo el dia despues moverme por feriados
         --
         v_dayweek := extract(dow from v_fecha2);

      end loop;

      -- obtengo el clearing
      --
      select cle_dias
        into v_dias
      from Clearing
      where cle_id = p_cle_id;

      v_dias := coalesce(v_dias, 0);

      v_n := 1;

      loop

         if v_n > v_dias then
            exit;
         end if;

         -- agrego un dia
         --
         v_fecha2 := dateadd('D', 1, v_fecha2);

         v_dayweek := extract(dow from v_fecha2);

         v_n := v_n + 1;

         -- si es fin de semana
         --
         if v_dayweek in ( 6, 0 ) then
            v_fecha2 := case v_dayweek
                             when 6 /*sabado*/  then dateadd('D', 2, v_fecha2)
                             when 0 /*domingo*/ then dateadd('D', 1, v_fecha2)
                             else v_fecha2
                        end;
         end if;

         loop


            if not exists ( select fei.fe_id
                            from FeriadoItem fei
                            join Feriado fe
                              on fe.fe_id = fe.fe_id
                               and fe.fe_banco <> 0
                               and fe.fe_local = 0
                            where fei.fei_fecha::date = v_fecha2 ) then
               exit;
            end if;

               v_fecha2 := dateadd('D', 1, v_fecha2);

               v_dayweek := extract(dow from v_fecha2);

               -- Si es fin de semana
               --
               if v_dayweek in ( 6, 0 ) then
                  v_fecha2 := case v_dayweek
                                     when 6 /*sabado*/  then dateadd('D', 2, v_fecha2)
                                     when 0 /*domingo*/ then dateadd('D', 1, v_fecha2)
                                     else v_fecha2
                              end;
               end if;

         end loop;

      end loop;

   else

      loop

         if not exists ( select fei.fe_id
                         from FeriadoItem fei
                         join Feriado fe
                           on fe.fe_id = fe.fe_id
                            and fe.fe_laboral <> 0
                            and fe.fe_local = 0
                         where fei.fei_fecha::date = v_fecha2 ) then
            exit;
         end if;

         v_fecha2 := dateadd('D', 1, v_fecha2);

         v_dayweek := extract(dow from v_fecha2);

         -- si es fin de semana
         --
         v_fecha2 := case v_dayweek
                           when 6 /*sabado*/  then dateadd('D', 2, v_fecha2)
                           when 0 /*domingo*/ then dateadd('D', 1, v_fecha2)
                           else v_fecha2
                     end;
      end loop;

   end if;

   p_fecha2 := v_fecha2;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_get_fecha2(date, integer, integer)
  owner to postgres;