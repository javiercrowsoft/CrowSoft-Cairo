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
-- Function: sp_proveedor_get_next_number()

-- drop function sp_proveedor_get_next_number(integer, integer);

/*

          select * from documento where doct_id = 8;
          select * from proveedor;
          select * from sp_proveedor_get_next_number(1, 169);

*/

create or replace function sp_proveedor_get_next_number
(
  in p_prov_id integer,
  in p_doc_id integer default null ,
  out p_number integer,
  out p_mask varchar,
  out p_enabled integer
)
  returns record as
$BODY$
declare
    v_ta_id integer;
begin

    select sp_proveedor_get_talonario(p_prov_id, p_doc_id) into v_ta_id;

    if v_ta_id is not null then

        select ta_ultimonro, ta_mascara, ta_tipo
          into p_number, p_mask, p_enabled
        from talonario
        where ta_id = v_ta_id;

    end if;

    p_number := coalesce(p_number, 0) + 1;
    p_mask := coalesce(p_mask, '');
    p_enabled := coalesce(p_enabled, 0);

    if(p_enabled != 1 /* suggested */) then

        p_enabled := 0;

    end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_proveedor_get_next_number(integer, integer)
  owner to postgres;