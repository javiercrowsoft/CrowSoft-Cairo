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
-- Function: sp_historia_update()

-- drop function sp_historia_update(integer, integer, integer, integer, varchar);

create or replace function sp_historia_update
(
  in p_tbl_id integer,
  in p_id integer,
  in p_modifico integer,
  in p_hst_operacion integer,
  in p_hst_descrip varchar default ''
)
  returns void as
$BODY$
begin

   if not exists ( select *
                   from Usuario
                   where us_id = p_modifico ) then
      return;

   end if;

   insert into Historia( tbl_id, id, modifico, hst_operacion, hst_descrip )
     values ( p_tbl_id, coalesce(p_id, 0), p_modifico, p_hst_operacion, coalesce(p_hst_descrip, '') );

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_historia_update(integer, integer, integer, integer, varchar)
  owner to postgres;
