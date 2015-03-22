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
-- Function: sp_leng_get_text()

-- drop function sp_leng_get_text();

create or replace function sp_leng_get_text
(
  in p_code varchar,
  in p_us_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_leng_id integer;
   v_rtn varchar(5000);
begin

   v_rtn := '';

   select cfg_valor::integer
     into v_leng_id
     from Configuracion
      where cfg_grupo = 'Usuario-Config'
        and cfg_aspecto = 'Lenguaje Gral_' || p_us_id::varchar;

   if coalesce(v_leng_id, 0) = 0 then
   begin
      select cfg_valor::integer
        into v_leng_id
        from Configuracion
         where cfg_grupo = 'general'
           and cfg_aspecto = 'lenguaje';

   end;
   end if;

   if coalesce(v_leng_id, 0) = 0 then
      v_leng_id := 1;-- CrowSoft default language (Castellano)
   end if;

   if coalesce(v_leng_id, 0) <> 0 then
   begin

      select lengi_texto
        into v_rtn
        from LenguajeItem
         where leng_id = v_leng_id
           and lengi_codigo = p_code;

      -- Si no lo encuentro veo si el lenguaje tiene un lenguaje padre
      if coalesce(v_rtn, '') = '' then
      begin
         -- Busco el lenguaje tiene un lenguaje padre
         select leng_id_padre
           into v_leng_id
           from Lenguaje
            where leng_id = v_leng_id;

         -- Si hay un lenguaje padre le pido que me traiga el texto
         if coalesce(v_leng_id, 0) <> 0 then
         begin
            v_rtn := sp_leng_get_text_aux(p_code, v_leng_id);

         end;
         end if;

      end;
      end if;

   end;
   end if;

   rtn := 'rtn';

   open rtn for select v_rtn;

end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function sp_leng_get_text(varchar, integer)
  owner to postgres;