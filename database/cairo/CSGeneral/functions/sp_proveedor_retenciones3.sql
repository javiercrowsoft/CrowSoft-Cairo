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
-- Function: sp_proveedor_get_retenciones()

-- drop function sp_proveedor_get_retenciones(integer, integer, date);
/*
          select * from ProveedorRetencion;
          select * from sp_proveedor_get_retenciones(6,1,'20160501');
          fetch all from rtn;
*/

create or replace function sp_proveedor_get_retenciones
(
  in p_prov_id integer,
  in p_emp_id integer,
  in p_fecha date,
  out rtn refcursor
)
  returns refcursor as
$BODY$
begin   

   create temporary table tt_tmp_retencion
    (
     ret_id integer
    ) on commit drop;

   rtn := 'rtn';
   
   -------------------------------------------------------------
   -- retenciones explicitas en proveedores
   --
   if exists ( select *
               from ProveedorRetencion provret
               join Retencion ret
                 on provret.ret_id = ret.ret_id
               where provret.prov_id = p_prov_id ) then

      open rtn for

         select provret.ret_id,
                ret.ret_nombre
         from ProveedorRetencion provret
         join Retencion ret
           on provret.ret_id = ret.ret_id
         where provret.prov_id = p_prov_id
           and p_fecha between provret.provret_desde and provret.provret_hasta;

   else

      -------------------------------------------------------------
      -- retenciones por configuracion general
      --
      insert into tt_tmp_retencion
        ( ret_id )
        ( select CAST(cfg_valor as integer)
          from Configuracion
          where emp_id = p_emp_id
            and cfg_grupo = 'Tesoreria-General'
            and cfg_aspecto = 'Retencion'
            and isnumeric(cfg_valor) <> 0 );

      open rtn for

         -------------------------------------------------------------
         -- retenciones por configuracion general
         --
         select ret.ret_id,
                ret.ret_nombre
         from Retencion ret
         where exists ( select *
                        from tt_tmp_retencion
                        where ret_id = ret.ret_id );

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_proveedor_get_retenciones(integer, integer, date)
  owner to postgres;