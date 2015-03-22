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
-- Function: alr_dc_csc_ven_0010_r(integer)

-- drop function alr_dc_csc_ven_0010_r(integer);

create or replace function alr_dc_csc_ven_0010_r(p_almr_id_mail integer)
  returns void as
$BODY$
declare
   v_alm_id integer;
begin

   v_alm_id := 1;

   insert into AlarmaMailResult
     ( alm_id, almr_id_mail )
     values ( v_alm_id, p_almr_id_mail );

end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function alr_dc_csc_ven_0010_r(integer)
  owner to postgres;
