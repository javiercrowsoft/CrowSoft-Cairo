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
-- Function: sp_producto_get_proveedores()

-- drop function sp_producto_get_proveedores(integer);

create or replace function sp_producto_get_proveedores
(
  in p_pr_id integer ,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   -- Obtengo que precio es el preferido en ListaPrecioConfig
   --
   v_lp_id_top integer;
   v_orden numeric(3,0);
   v_tran_id integer;
begin

    --------------------------------------------------------------------
    
    create TEMP table t_producto_proveedor
    (
      prov_id integer,
      lp_id integer,
      lpi_id integer,
      lpi_precio decimal(18,6),
      lpi_top integer,
      lpi_fecha date,
      tran_id integer  not null
    ) on commit drop;
    
    v_tran_id := nextval('t_producto_proveedor_seq');
    
    --------------------------------------------------------------------
   
   insert into t_producto_proveedor
     ( prov_id, lp_id, lpi_id, lpi_precio, lpi_top, lpi_fecha, tran_id )
     ( select DISTINCT lpprov.prov_id,
                       lpi.lp_id,
                       lpi.lpi_id,
                       lpi.lpi_precio,
                       0,
                       lpi.lpi_fecha,
                       v_tran_id
       from ListaPrecioItem lpi
              left join ListaPrecioProveedor lpprov
               on lpi.lp_id = lpprov.lp_id
          where lpi.pr_id = p_pr_id );

   select min(lpc_orden)
     into v_orden
     from ListaPrecioConfig
      where pr_id = p_pr_id
              and lp_id in ( select lp_id
                             from t_producto_proveedor  );

   select lp_id
     into v_lp_id_top
     from ListaPrecioConfig
      where pr_id = p_pr_id
              and lpc_orden = v_orden;

   update t_producto_proveedor
      set lpi_top = 1
      where tran_id = v_tran_id and lp_id = v_lp_id_top;

   rtn := 'rtn';

   open rtn for
      ----------------------------------------------------------------------------------------------
      select prprov.prprov_id,
                     prprov.prprov_codigo,
                     prprov.prprov_codigobarra,
                     prprov.prprov_fabricante,
                     prprov.prprov_nombre,
                     prprov.activo,
                     prprov.creado,
                     prprov.modificado,
                     prprov.modifico,
                     prprov.pa_id,
                     prprov.pr_id,
                     prov.prov_id,
                     prov_nombre,
                     pa_nombre,
                     lp_nombre,
                     t.lp_id,
                     t.lpi_id,
                     t.lpi_precio,
                     t.lpi_fecha,
                     t.lpi_top
        from ProductoProveedor prprov
               left join Proveedor prov
                on prprov.prov_id = prov.prov_id
               left join Pais pa
                on prprov.pa_id = pa.pa_id
               left join t_producto_proveedor t
                on prprov.prov_id = t.prov_id
                  and t.tran_id = v_tran_id
               left join ListaPrecio lp
                on t.lp_id = lp.lp_id
         where prprov.pr_id = p_pr_id
      union all
      select -1 prprov_id,-- Si es un registro virtual lo identifico con un -1

             prprov.prprov_codigo,
             prprov.prprov_codigobarra,
             prprov.prprov_fabricante,
             prprov.prprov_nombre,
             prprov.activo,
             prprov.creado,
             prprov.modificado,
             prprov.modifico,
             prprov.pa_id,
             prprov.pr_id,
             prov.prov_id,
             prov_nombre,
             pa_nombre,
             lp_nombre,
             t.lp_id,
             t.lpi_id,
             t.lpi_precio,
             t.lpi_fecha,
             t.lpi_top

        from t_producto_proveedor t
               left join ProductoProveedor prprov
                on 1 = 2
               left join Proveedor prov
                on t.prov_id = prov.prov_id
               left join Pais pa
                on 1 = 2
               left join ListaPrecio lp
                on t.lp_id = lp.lp_id

        where t.tran_id = v_tran_id
           and not exists ( select *
                            from ProductoProveedor
                               where pr_id = p_pr_id
                                       and prov_id = t.prov_id )
        order by prov_nombre;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_producto_get_proveedores(integer)
  owner to postgres;