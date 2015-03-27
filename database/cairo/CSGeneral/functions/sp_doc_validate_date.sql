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
-- Function: sp_doc_validate_date()

-- drop function sp_doc_validate_date(integer, date);

create or replace function sp_doc_validate_date
/*
          select * from documento
          select * from sp_doc_validate_date(13,'20050430 20:00:00')
*/
(
  in p_doc_id integer,
  in p_fecha date,
  out p_is_valid integer,
  out p_range varchar
)
  returns record as
$BODY$
declare
  v_rango varchar(255);
begin

      if exists ( select fca.fca_id
                  from FechaControlAcceso fca
                  join Documento doc
                    on fca.fca_id = doc.fca_id
                  where doc.doc_id = p_doc_id
                     and p_fecha between fca.fca_fechadesde and fca.fca_fechahasta ) then

         p_is_valid := 1;
         p_range := '';

      else

         select 'Desde el ' || fca.fca_fechadesde::varchar || ' hasta el ' || fca.fca_fechahasta::varchar || ' inclusive.'
           into v_rango
         from FechaControlAcceso fca
         join Documento doc
           on fca.fca_id = doc.fca_id
         where doc.doc_id = p_doc_id;

         p_is_valid := 0;
         p_range := v_rango;

      end if;
end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function sp_doc_validate_date(integer, date)
  owner to postgres;