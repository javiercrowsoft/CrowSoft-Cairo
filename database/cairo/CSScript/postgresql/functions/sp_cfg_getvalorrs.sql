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
﻿-- Function: sp_cfg_getvalorrs(character varying, character varying, smallint, integer)

-- drop function sp_cfg_getvalorrs(character varying, character varying, smallint, integer);

create or replace function sp_cfg_getvalorrs(in p_cfg_grupo character varying, in p_cfg_aspecto character varying, out p_cfg_valor character varying, in p_bshow smallint, in p_emp_id integer, out rtn refcursor)
  returns record as
$BODY$
begin

   select cfg_valor
     into p_cfg_valor
     from Configuracion
      where cfg_grupo = p_cfg_grupo
              and cfg_aspecto = p_cfg_aspecto
              and ( emp_id = p_emp_id
              or ( emp_id is null
              and p_emp_id is null ) );

   if p_bShow <> 0 then
      open rtn for
         select p_cfg_valor
           from DUAL ;

   end if;

end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function sp_cfg_getvalorrs(character varying, character varying, smallint, integer)
  owner to postgres;
