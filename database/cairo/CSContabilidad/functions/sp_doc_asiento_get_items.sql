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
-- Function: sp_doc_asiento_get_items()

-- drop function sp_doc_asiento_get_items(integer);
/*
select * from sp_doc_asiento_get_items(1);
fetch all from rtn;
fetch all from rtn_serie;
*/
create or replace function sp_doc_asiento_get_items
/*
sp_DocAsientoGetItems 1
*/
(
  in p_as_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
begin

   rtn := 'rtn';

   open rtn for
      select AsientoItem.*,
          cue_nombre,
          ccos.ccos_nombre
      from AsientoItem
      join Cuenta
        on AsientoItem.cue_id = Cuenta.cue_id
      left join CentroCosto ccos
        on AsientoItem.ccos_id = ccos.ccos_id
      where as_id = p_as_id
      order by asi_orden;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_asiento_get_items(integer)
  owner to postgres;