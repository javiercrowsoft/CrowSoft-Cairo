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
-- Function: sp_codigopostalhelp()

-- drop function sp_codigopostalhelp();

create or replace function sp_codigopostalhelp
(
  in p_emp_id integer ,
  in p_us_id integer ,
  in p_bForAbm integer ,
  in p_bFilterType integer ,
  in p_filter varchar default '' ,
  in p_check integer default 0 ,
  in ip_cpa_id integer default 0 ,
  in v_p_filter2 varchar default '',
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   p_cpa_id integer := ip_cpa_id;
   v_altura integer;
   v_n integer;
   v_s varchar(50);
   v_filter varchar(255);
   v_p_filter varchar(2000);
begin

   v_p_filter := p_filter;
   v_altura := 0;

   v_n := LENGTH(v_p_filter);

   while v_n > 0
   loop
      begin
         if SUBSTR(v_p_filter, v_n, 1) = ' ' then
         begin
            v_s := SUBSTR(v_p_filter, v_n, 50);

            if isnumeric(v_s) <> 0 then
            begin
               v_altura := to_number(v_s);

               v_p_filter := SUBSTR(v_p_filter, 1, v_n - 1);

            end;
            end if;

            v_n := 0;

         end;
         end if;

         v_n := v_n - 1;

      end;
   end loop;

   v_filter := lower(f_unaccent(v_p_filter));

   v_filter := sp_HelpGetFilter(p_bFilterType, v_filter);

   --/////////////////////////////////////////////////////////////////////////////////////
   if p_check <> 0 then
   begin
      if p_cpa_id < 0 then
      begin
         select cpa_id
           into p_cpa_id
           from CodigoPostalItem
            where cpai_id = p_cpa_id * -1;

      end;
      end if;

      open rtn for
         select cpa_id,
                cpa_codigo Nombre,
                cpa_codigo Codigo
           from CodigoPostal cpa
            where ( cpa_codigo = v_p_filter )
                    and ( cpa_id = p_cpa_id
                    or p_cpa_id = 0 )
                    and ( p_bForAbm <> 0
                    or cpa.activo <> 0 );

   end;
   else
   begin
   
      rtn := 'rtn';        
      open rtn for

         select -cpai.cpai_id cpa_id,
                cpa.cpa_codigo Codigo_Postal,
                case cpai.cpai_tipo
                    when 1 then cpai.cpai_calle
                    else cpai.cpai_localidad
                end Calle_Localidad,
                cpai.cpai_desde Desde,
                cpai.cpai_hasta Hasta,
                pro.pro_nombre Provincia
           from CodigoPostal cpa
                  join CodigoPostalItem cpai
                   on cpa.cpa_id = cpai.cpa_id
                  join Provincia pro
                   on cpa.pro_id = pro.pro_id
            where ( cpa.cpa_codigo LIKE v_filter
                    or ( lower(f_unaccent(cpai.cpai_calle)) LIKE v_filter
                    and cpai.cpai_tipo = 1 )
                    or ( lower(f_unaccent(cpai.cpai_localidad)) LIKE v_filter
                    and cpai.cpai_tipo = 2 )
                    or v_p_filter is null )
                    and ( ( cpai.cpai_desde <= v_altura
                    and cpai.cpai_hasta >= v_altura )
                    or v_altura = 0 )
                    and ( p_bForAbm <> 0
                    or cpa.activo <> 0 )
           LIMIT 50;

   end;
   end if;
        
end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_codigopostalhelp(integer, integer, integer, integer, varchar, integer, integer, varchar)
  owner to postgres;