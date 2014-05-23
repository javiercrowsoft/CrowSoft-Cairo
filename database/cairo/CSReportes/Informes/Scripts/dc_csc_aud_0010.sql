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
-- Function: dc_csc_aud_0010(integer)

-- DROP FUNCTION dc_csc_aud_0010(integer);

CREATE OR REPLACE FUNCTION dc_csc_aud_0010(IN p_us_id integer, OUT rtn refcursor)
  RETURNS refcursor AS
$BODY$
DECLARE
BEGIN

   rtn := 'rtn';

   OPEN rtn FOR
      SELECT as_id comp_id,
             doct_id doct_id,
             as_fecha Fecha,
             as_nrodoc Comprobante
        FROM Asiento
         WHERE as_fecha > CURRENT_TIMESTAMP
      UNION ALL
      SELECT os_id comp_id,
             doct_id doct_id,
             os_fecha Fecha,
             os_nrodoc Comprobante
        FROM OrdenServicio
         WHERE os_fecha > CURRENT_TIMESTAMP
                 AND est_id <> 7
      UNION ALL
      SELECT rv_id comp_id,
             doct_id doct_id,
             rv_fecha Fecha,
             rv_nrodoc Comprobante
        FROM RemitoVenta
         WHERE rv_fecha > CURRENT_TIMESTAMP
                 AND est_id <> 7
      UNION ALL
      SELECT fv_id comp_id,
             doct_id doct_id,
             fv_fecha Fecha,
             fv_nrodoc Comprobante
        FROM FacturaVenta
         WHERE fv_fecha > CURRENT_TIMESTAMP
                 AND est_id <> 7
      UNION ALL
      SELECT pv_id comp_id,
             doct_id doct_id,
             pv_fecha Fecha,
             pv_nrodoc Comprobante
        FROM PedidoVenta
         WHERE pv_fecha > CURRENT_TIMESTAMP
                 AND est_id <> 7
      UNION ALL
      SELECT cobz_id comp_id,
             doct_id doct_id,
             cobz_fecha Fecha,
             cobz_nrodoc Comprobante
        FROM Cobranza
         WHERE cobz_fecha > CURRENT_TIMESTAMP
                 AND est_id <> 7
      UNION ALL
      SELECT opg_id comp_id,
             doct_id doct_id,
             opg_fecha Fecha,
             opg_nrodoc Comprobante
        FROM OrdenPago
         WHERE opg_fecha > CURRENT_TIMESTAMP
                 AND est_id <> 7
      UNION ALL
      SELECT rc_id comp_id,
             doct_id doct_id,
             rc_fecha Fecha,
             rc_nrodoc Comprobante
        FROM RemitoCompra
         WHERE rc_fecha > CURRENT_TIMESTAMP
                 AND est_id <> 7
      UNION ALL
      SELECT fc_id comp_id,
             doct_id doct_id,
             fc_fecha Fecha,
             fc_nrodoc Comprobante
        FROM FacturaCompra
         WHERE fc_fecha > CURRENT_TIMESTAMP
                 AND est_id <> 7
      UNION ALL
      SELECT pc_id comp_id,
             doct_id doct_id,
             pc_fecha Fecha,
             pc_nrodoc Comprobante
        FROM PedidoCompra
         WHERE pc_fecha > CURRENT_TIMESTAMP
                 AND est_id <> 7
      UNION ALL
      SELECT oc_id comp_id,
             doct_id doct_id,
             oc_fecha Fecha,
             oc_nrodoc Comprobante
        FROM OrdenCompra
         WHERE oc_fecha > CURRENT_TIMESTAMP
                 AND est_id <> 7
      UNION ALL
      SELECT mf_id comp_id,
             doct_id doct_id,
             mf_fecha Fecha,
             mf_nrodoc Comprobante
        FROM MovimientoFondo
         WHERE mf_fecha > CURRENT_TIMESTAMP
                 AND est_id <> 7
      UNION ALL
      SELECT dbco_id comp_id,
             doct_id doct_id,
             dbco_fecha Fecha,
             dbco_nrodoc Comprobante
        FROM DepositoBanco
         WHERE dbco_fecha > CURRENT_TIMESTAMP
                 AND est_id <> 7
      UNION ALL
      SELECT rs_id comp_id,
             doct_id doct_id,
             rs_fecha Fecha,
             rs_nrodoc Comprobante
        FROM RecuentoStock
         WHERE rs_fecha > CURRENT_TIMESTAMP
      UNION ALL
      SELECT ppk_id comp_id,
             doct_id doct_id,
             ppk_fecha Fecha,
             ppk_nrodoc Comprobante
        FROM ParteProdKit
         WHERE ppk_fecha > CURRENT_TIMESTAMP
      UNION ALL
      SELECT st_id comp_id,
             doct_id doct_id,
             st_fecha Fecha,
             st_nrodoc Comprobante
        FROM Stock
         WHERE st_fecha > CURRENT_TIMESTAMP
      UNION ALL
      SELECT dcup_id comp_id,
             doct_id doct_id,
             dcup_fecha Fecha,
             dcup_nrodoc Comprobante
        FROM DepositoCupon
         WHERE dcup_fecha > CURRENT_TIMESTAMP
                 AND est_id <> 7
      UNION ALL
      SELECT rcup_id comp_id,
             doct_id doct_id,
             rcup_fecha Fecha,
             rcup_nrodoc Comprobante
        FROM ResolucionCupon
         WHERE rcup_fecha > CURRENT_TIMESTAMP
                 AND est_id <> 7
      UNION ALL
      SELECT stcli_id comp_id,
             doct_id doct_id,
             stcli_fecha Fecha,
             stcli_nrodoc Comprobante
        FROM StockCliente
         WHERE stcli_fecha > CURRENT_TIMESTAMP
      UNION ALL
      SELECT stprov_id comp_id,
             doct_id doct_id,
             stprov_fecha Fecha,
             stprov_nrodoc Comprobante
        FROM StockProveedor
         WHERE stprov_fecha > CURRENT_TIMESTAMP;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION dc_csc_aud_0010(integer)
  OWNER TO postgres;
