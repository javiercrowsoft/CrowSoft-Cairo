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
-- Function: sp_doc_factura_compra_get_items()

-- DROP FUNCTION sp_doc_factura_compra_get_items(integer);
/*
select * from sp_doc_factura_compra_get_items(1);
fetch all from rtn;
fetch all from rtn_serie;
*/
CREATE OR REPLACE FUNCTION sp_doc_factura_compra_get_items
(
  IN p_fc_id integer,
  OUT rtn refcursor,
  OUT rtn_serie refcursor
)
  RETURNS record AS
$BODY$
BEGIN

   rtn := 'rtn';

   OPEN rtn FOR
      SELECT fci.*,
             pr_nombreCompra,
             pr_llevanroserie,
             pr_llevanrolote,
             pr_porcinternoc,
             tri.ti_porcentaje iva_ri_porcentaje,
             trni.ti_porcentaje iva_rni_porcentaje,
             tint.ti_porcentaje internos_porcentaje,
             ccos.ccos_nombre,
             un_nombre,
             to_nombre,
             stl.stl_codigo
      FROM FacturaCompraItem fci
       JOIN Producto
        ON fci.pr_id = Producto.pr_id
       JOIN Unidad
        ON Producto.un_id_compra = Unidad.un_id
       JOIN TipoOperacion
        ON fci.to_id = TipoOperacion.to_id
       LEFT JOIN TasaImpositiva tri
        ON Producto.ti_id_ivaricompra = tri.ti_id
       LEFT JOIN TasaImpositiva trni
        ON Producto.ti_id_ivarnicompra = trni.ti_id
       LEFT JOIN TasaImpositiva tint
        ON Producto.ti_id_internosc = tint.ti_id
       LEFT JOIN CentroCosto ccos
        ON fci.ccos_id = ccos.ccos_id
       LEFT JOIN StockLote stl
        ON fci.stl_id = stl.stl_id
      WHERE fci.fc_id = p_fc_id
      ORDER BY fci.fci_orden;

--///////////////////////////////////////////////////////////////////////////////////////////////////
--
--  NUMEROS DE SERIE
--
--///////////////////////////////////////////////////////////////////////////////////////////////////

   rtn_serie := 'rtn_serie';

   OPEN rtn_serie FOR
      SELECT prns.prns_id,
             prns.prns_codigo,
             prns.prns_descrip,
             prns.prns_fechavto,
             fci.fci_id
      FROM ProductoNumeroSerie prns
       JOIN StockItem sti
        ON prns.prns_id = sti.prns_id
       JOIN FacturaCompraItem fci
        ON sti.sti_grupo = fci.fci_id
       JOIN FacturaCompra fc
        ON fci.fc_id = fc.fc_id
      WHERE fci.fc_id = p_fc_id AND sti.st_id = fc.st_id
      GROUP BY prns.prns_id,prns.prns_codigo,prns.prns_descrip,prns.prns_fechavto,fci.fci_id
      ORDER BY fci.fci_id;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_doc_factura_compra_get_items(integer)
  OWNER TO postgres;