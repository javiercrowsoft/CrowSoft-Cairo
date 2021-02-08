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
-- Function: sp_doc_move()

-- drop function sp_doc_move(integer, integer, integer, integer, integer, integer);

create or replace function sp_doc_move
(
 in p_emp_id integer,
 in p_us_id integer,
 in p_doct_id integer,
 in p_doc_id integer,
 in p_comp_id integer,
 in p_moveTo integer,
 out p_comp_id_to_move integer
)
 returns integer as
$BODY$
declare
begin

 p_comp_id_to_move := 0;

 if p_doct_id in (2,8,10) then

  select * from sp_doc_factura_compra_move(p_doct_id, p_doc_id, p_comp_id, p_moveTo) into p_comp_id_to_move;

 end if;

end;
$BODY$
 language plpgsql volatile
                  cost 100;
alter function sp_doc_move(integer, integer, integer, integer, integer, integer)
 owner to postgres;