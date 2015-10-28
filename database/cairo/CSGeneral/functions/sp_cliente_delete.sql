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
-- Function: sp_cliente_delete()

-- drop function sp_cliente_delete(integer, integer);

create or replace function sp_cliente_delete
(
  in p_cli_id integer,
  in p_delContacto integer default 0
)
  returns void as
$BODY$
begin

   if p_delContacto <> 0 then

      delete from Contacto where cli_id = p_cli_id;

   else

      update Contacto set cli_id = null where cli_id = p_cli_id;

   end if;

   delete from ClienteCacheCredito where cli_id = p_cli_id;
   delete from ClientePercepcion where cli_id = p_cli_id;
   delete from EmpresaCliente where cli_id = p_cli_id;
   delete from ClienteCuentaGrupo where cli_id = p_cli_id;
   delete from ClienteSucursal where cli_id = p_cli_id;
   delete from ListaDescuentoCliente where cli_id = p_cli_id;
   delete from ListaPrecioCliente where cli_id = p_cli_id;
   delete from EmpresaClienteDeuda where cli_id = p_cli_id;
   delete from Cliente where cli_id = p_cli_id;

   return;

exception
   when others then

     raise exception 'Ha ocurrido un error al borrar el cliente. sp_cliente_delete. %. %.',
                      sqlstate, sqlerrm;

end;

$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_cliente_delete(integer, integer)
  owner to postgres;