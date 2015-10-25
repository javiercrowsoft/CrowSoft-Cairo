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
-- Function: sp_producto_get()

-- drop function sp_cliente_get(integer);

create or replace function sp_cliente_get
(
  in p_cli_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
begin

   rtn := 'rtn';

   open rtn for
      select Cliente.*,
             pro_nombre,
             zon_nombre,
             cpg_nombre,
             lp_nombre,
             ld_nombre,
             ven_nombre,
             trans_nombre,
             clict.clict_nombre,
             proy.proy_nombre,
             cli2.cli_nombre cli_nombrePadre,
             cli3.cli_nombre referido,
             cpa.cpa_codigo,
             fp.fp_nombre,
             us.us_nombre,
             us.activo us_activo
        from Cliente
               left join Provincia
                on Cliente.pro_id = Provincia.pro_id
               left join Zona
                on Cliente.zon_id = Zona.zon_id
               left join CondicionPago
                on Cliente.cpg_id = CondicionPago.cpg_id
               left join ListaPrecio
                on Cliente.lp_id = ListaPrecio.lp_id
               left join ListaDescuento
                on Cliente.ld_id = ListaDescuento.ld_id
               left join Vendedor
                on Cliente.ven_id = Vendedor.ven_id
               left join Transporte
                on Cliente.trans_id = Transporte.trans_id
               left join Cliente cli2
                on Cliente.cli_id_padre = cli2.cli_id
               left join Usuario us
                on Cliente.us_id = us.us_id
               left join ClienteContactoTipo clict
                on Cliente.clict_id = clict.clict_id
               left join Cliente cli3
                on Cliente.cli_id_referido = cli3.cli_id
               left join Proyecto proy
                on Cliente.proy_id = proy.proy_id
               left join CodigoPostal cpa
                on Cliente.cpa_id = cpa.cpa_id
               left join FormaPago fp
                on Cliente.fp_id = fp.fp_id
         where Cliente.cli_id = p_cli_id;

end;

$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_cliente_get(integer)
  owner to postgres;