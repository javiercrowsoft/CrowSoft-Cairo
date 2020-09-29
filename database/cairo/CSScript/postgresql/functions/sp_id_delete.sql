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
-- Function: sp_id_delete()

-- drop function sp_id_delete();

create or replace function sp_id_delete()
  returns void as
$BODY$
begin

   delete from Id where Id_Tabla not in ( 'DepositoFisico','DepositoLogico','TasaImpositiva' );
   delete from IdAsiento;
   delete from IdStock;
   delete from rptArbolRamaHoja;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_id_delete()
  owner to postgres;