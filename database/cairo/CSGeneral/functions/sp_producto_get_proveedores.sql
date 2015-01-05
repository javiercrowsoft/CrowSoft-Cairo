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
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
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

-- DROP FUNCTION sp_producto_get_proveedores(integer);

CREATE OR REPLACE FUNCTION sp_producto_get_proveedores(
  IN p_pr_id integer ,
  OUT rtn refcursor)
  RETURNS refcursor AS
$BODY$
DECLARE
   -- Obtengo que precio es el preferido en ListaPrecioConfig
   --
   v_lp_id_top integer;
   v_orden numeric(3,0);
   v_tran_id integer;
BEGIN

    --------------------------------------------------------------------
    
    CREATE TEMP TABLE t_producto_proveedor
    (
      prov_id integer,
      lp_id integer,
      lpi_id integer,
      lpi_precio decimal(18,6),
      lpi_top numeric(3,0),
      lpi_fecha date,
      tran_id integer  NOT NULL
    ) on commit drop;
    
    v_tran_id := nextval('t_producto_proveedor_seq');
    
    --------------------------------------------------------------------
   
   INSERT INTO t_producto_proveedor
     ( prov_id, lp_id, lpi_id, lpi_precio, lpi_top, lpi_fecha, tran_id )
     ( SELECT DISTINCT lpprov.prov_id,
                       lpi.lp_id,
                       lpi.lpi_id,
                       lpi.lpi_precio,
                       0,
                       lpi.lpi_fecha,
                       v_tran_id
       FROM ListaPrecioItem lpi
              LEFT JOIN ListaPrecioProveedor lpprov
               ON lpi.lp_id = lpprov.lp_id
          WHERE lpi.pr_id = p_pr_id );

   SELECT MIN(lpc_orden)
     INTO v_orden
     FROM ListaPrecioConfig
      WHERE pr_id = p_pr_id
              AND lp_id IN ( SELECT lp_id
                             FROM t_producto_proveedor  );

   SELECT lp_id
     INTO v_lp_id_top
     FROM ListaPrecioConfig
      WHERE pr_id = p_pr_id
              AND lpc_orden = v_orden;

   UPDATE t_producto_proveedor
      SET lpi_top = 1
      WHERE tran_id = v_tran_id AND lp_id = v_lp_id_top;

   rtn := 'rtn';

   OPEN rtn FOR
      ----------------------------------------------------------------------------------------------
      SELECT prprov.prprov_id,
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
        FROM ProductoProveedor prprov
               LEFT JOIN Proveedor prov
                ON prprov.prov_id = prov.prov_id
               LEFT JOIN Pais pa
                ON prprov.pa_id = pa.pa_id
               LEFT JOIN t_producto_proveedor t
                ON prprov.prov_id = t.prov_id
                  AND t.tran_id = v_tran_id
               LEFT JOIN ListaPrecio lp
                ON t.lp_id = lp.lp_id
         WHERE prprov.pr_id = p_pr_id
      UNION ALL
      SELECT -1 prprov_id,-- Si es un registro virtual lo identifico con un -1

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

        FROM t_producto_proveedor t
               LEFT JOIN ProductoProveedor prprov
                ON 1 = 2
               LEFT JOIN Proveedor prov
                ON t.prov_id = prov.prov_id
               LEFT JOIN Pais pa
                ON 1 = 2
               LEFT JOIN ListaPrecio lp
                ON t.lp_id = lp.lp_id

        WHERE t.tran_id = v_tran_id
           AND NOT EXISTS ( SELECT *
                            FROM ProductoProveedor
                               WHERE pr_id = p_pr_id
                                       AND prov_id = t.prov_id )
        ORDER BY prov_nombre;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_producto_get_proveedores(integer)
  OWNER TO postgres;