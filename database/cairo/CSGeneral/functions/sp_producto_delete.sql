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
-- Function: sp_producto_delete()

-- drop function sp_producto_delete(integer);

create or replace function sp_producto_delete
(
  in p_pr_id integer
)
  returns void as
$BODY$
begin

      delete from ProductoCliente where pr_id = p_pr_id;
      delete from ProductoProveedor where pr_id = p_pr_id;

      delete from ProductoKitItemA
      where prk_id in ( select prk_id
                        from ProductoKit
                        where prfk_id in ( select prfk_id
                                           from ProductoFormulaKit
                                           where pr_id = p_pr_id ) );

      delete from ProductoKit
      where prfk_id in ( select prfk_id
                         from ProductoFormulaKit
                          where pr_id = p_pr_id );

      delete from ProductoFormulaKit where pr_id = p_pr_id;
      delete from ProductoDepositoFisico where pr_id = p_pr_id;
      delete from ProductoDepositoLogico where pr_id = p_pr_id;
      delete from ProductoTag where pr_id = p_pr_id;
      delete from ListaPrecioItem where pr_id = p_pr_id;
      delete from ListaDescuentoItem where pr_id = p_pr_id;
      delete from StockCache where pr_id = p_pr_id;
      delete from Producto where pr_id = p_pr_id;

exception
   when others then

     raise exception 'Ha ocurrido un error al borrar el producto. sp_producto_delete. %. %.',
                      sqlstate, sqlerrm;

end;

$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_producto_delete(integer)
  owner to postgres;