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
-- Function: dc_csc_seg_0010()

-- drop function dc_csc_seg_0010();

/*
select * from dc_csc_seg_0010(1,'1');
fetch all from rtn;
*/

create or replace function dc_csc_seg_0010
(
 in p_us_id integer,
 in p_us_id_usuario varchar,
 out rtn refcursor
)
 returns refcursor as
$BODY$
declare
   v_us_id_usuario integer;
   v_ram_id_Usuario integer;
   v_clienteID integer;
   v_IsRaiz smallint;
begin

   select * from sp_ArbConvertId(p_us_id_usuario) into v_us_id_usuario, v_ram_id_Usuario;
   select * from sp_GetRptId() into v_clienteID;

   if v_ram_id_Usuario <> 0 then
      --	exec sp_ArbGetGroups @ram_id_Usuario, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Usuario) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_Usuario, v_clienteID);
      else
         v_ram_id_Usuario := 0;
      end if;
   end if;

   rtn := 'rtn';

   open rtn for
   select
          Permiso.per_id,
          Permiso.pre_id,
          us_nombre Usuario,
          '' Rol,
          pre_nombre Prestacion,
          pre_grupo Grupo_1,
          pre_grupo1 Grupo_2,
          pre_grupo2 Grupo_3,
          pre_grupo3 Grupo_4,
          pre_grupo4 Grupo_5,
          pre_grupo5 Grupo_6,
          CAST('' as varchar(255)) Observaciones
   from Permiso
   join Prestacion on Permiso.pre_id = Prestacion.pre_id
   join Usuario on Permiso.us_id = Usuario.us_id
   where ( Usuario.us_id = v_us_id_usuario or v_us_id_usuario = 0 )
     and ( ( exists ( select rptarb_hojaid
                      from rptArbolRamaHoja
                      where rptarb_cliente = v_clienteID
                        and tbl_id = 3-- tbl_id de Usuario
                        and rptarb_hojaid = Usuario.us_id ) )
            or ( v_ram_id_Usuario = 0 ) )

   union ALL

   select
          null as per_id,
          Permiso.pre_id,
          us_nombre Usuario,
          rol_nombre Rol,
          pre_nombre Prestacion,
          pre_grupo Grupo_1,
          pre_grupo1 Grupo_2,
          pre_grupo2 Grupo_3,
          pre_grupo3 Grupo_4,
          pre_grupo4 Grupo_5,
          pre_grupo5 Grupo_6,
          CAST('' as varchar(255)) Observaciones
   from Permiso
   join Prestacion on Permiso.pre_id = Prestacion.pre_id
   join Rol on Permiso.rol_id = Rol.rol_id
   join UsuarioRol on Rol.rol_id = UsuarioRol.rol_id
   join Usuario on UsuarioRol.us_id = Usuario.us_id
   where ( Usuario.us_id = v_us_id_usuario or v_us_id_usuario = 0 )
     and ( ( exists ( select rptarb_hojaid
                      from rptArbolRamaHoja
                      where rptarb_cliente = v_clienteID
                        and tbl_id = 3-- tbl_id de Usuario
                        and rptarb_hojaid = Usuario.us_id ) )
            or ( v_ram_id_Usuario = 0 ) )
   order by Usuario,
            Grupo_1,
            Grupo_1,
            Grupo_2,
            Grupo_3,
            Grupo_4,
            Grupo_5;

 end;
$BODY$
 language plpgsql volatile
                  cost 100;
alter function dc_csc_seg_0010(integer, varchar)
 owner to postgres;