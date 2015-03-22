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
-- Function: sp_producto_get_cue_id()

-- drop function sp_producto_get_cue_id(integer, integer, integer);

create or replace function sp_producto_get_cue_id
/*
	select * from cliente
	select * from Producto
	select * from cuenta where cue_id = 129
	select * from sp_producto_get_cue_id(6,null,12);
*/
(
  in p_cli_id integer,
  in p_prov_id integer,
  in p_pr_id integer,
  out p_cue_id integer
)
  returns integer as
$BODY$
declare
    v_cue_id integer;
begin

    if p_cli_id is not null then
    
        -- Obtengo la cuenta de ventas
        --
        select ClienteCuentaGrupo.cue_id
        into v_cue_id
        from ClienteCuentaGrupo
        join Producto
          on ClienteCuentaGrupo.cueg_id = Producto.cueg_id_venta
        where cli_id = p_cli_id
          and pr_id = p_pr_id;

        -- Saco la cuenta de CuentaGrupo
        --
        if v_cue_id is null then

           select CuentaGrupo.cue_id
           into v_cue_id
           from CuentaGrupo
           join Producto
            on CuentaGrupo.cueg_id = Producto.cueg_id_venta
           where Producto.pr_id = p_pr_id;

        end if;
    
    else

        -- Obtengo la cuenta de compras
        --
        select ProveedorCuentaGrupo.cue_id
        into v_cue_id
        from ProveedorCuentaGrupo
        join Producto
          on ProveedorCuentaGrupo.cueg_id = Producto.cueg_id_compra
        where prov_id = p_prov_id
          and pr_id = p_pr_id;

        -- Saco la cuenta de CuentaGrupo
        --
        if v_cue_id is null then

           select CuentaGrupo.cue_id
           into v_cue_id
           from CuentaGrupo
           join Producto
            on CuentaGrupo.cueg_id = Producto.cueg_id_compra
           where Producto.pr_id = p_pr_id;

        end if;
    
    end if;
    
    p_cue_id := v_cue_id;

end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function sp_producto_get_cue_id(integer, integer, integer)
  owner to postgres;