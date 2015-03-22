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
-- Function: sp_getrptid()

-- drop function sp_getrptid();

create or replace function sp_getrptid(out p_clienteid integer)
  returns integer as
$BODY$
declare
begin

   select id_NextId
     into p_ClienteID
     from Id
      where Id_Tabla = 'rptArbolRamaHoja'
              and id_CampoId = 'rptarb_cliente';

   if coalesce(p_ClienteID, 0) = 0 then
   begin
      insert into id
        ( id_NextId, id_Tabla, id_CampoId )
        values ( 0, 'rptArbolRamaHoja', 'rptarb_cliente' );

      p_ClienteID := 1;

   end;
   end if;

   update id
      set id_NextId = p_ClienteID + 1
      where Id_Tabla = 'rptArbolRamaHoja'
     and id_CampoId = 'rptarb_cliente';

end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function sp_getrptid()
  owner to postgres;
