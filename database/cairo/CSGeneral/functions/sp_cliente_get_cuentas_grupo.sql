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
-- Function: sp_cliente_get_cuentas_grupo()

-- drop function sp_cliente_get_cuentas_grupo(integer);
/*
          select * from clientecuentagrupo;
          select * from sp_cliente_get_cuentas_grupo(3);
          fetch all from rtn;
*/

create or replace function sp_cliente_get_cuentas_grupo
(
  in p_cli_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$

begin   

   rtn := 'rtn';

   open rtn for

      select
             clicueg_id,
             clicueg.cueg_id,
             clicueg.cue_id,
             cueg_nombre,
             cue_nombre
      from ClienteCuentaGrupo clicueg
      inner join CuentaGrupo cueg on clicueg.cueg_id = cueg.cueg_id
      inner join Cuenta cue on clicueg.cue_id = cue.cue_id
      where clicueg.cli_id = p_cli_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_cliente_get_cuentas_grupo(integer)
  owner to postgres;