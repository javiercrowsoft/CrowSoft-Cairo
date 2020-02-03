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
-- Function: dc_csc_aud_0010(integer)

-- drop function dc_csc_aud_0010(integer);

create or replace function dc_csc_aud_0010(in p_us_id integer, out rtn refcursor)
  returns refcursor as
$BODY$
declare
begin

   rtn := 'rtn';

   open rtn for
      select as_id comp_id,
             doct_id doct_id,
             as_fecha Fecha,
             as_nrodoc Comprobante
        from Asiento
         where as_fecha > CURRENT_TIMESTAMP
      union all
      select os_id comp_id,
             doct_id doct_id,
             os_fecha Fecha,
             os_nrodoc Comprobante
        from OrdenServicio
         where os_fecha > CURRENT_TIMESTAMP
                 and est_id <> 7
      union all
      select rv_id comp_id,
             doct_id doct_id,
             rv_fecha Fecha,
             rv_nrodoc Comprobante
        from RemitoVenta
         where rv_fecha > CURRENT_TIMESTAMP
                 and est_id <> 7
      union all
      select fv_id comp_id,
             doct_id doct_id,
             fv_fecha Fecha,
             fv_nrodoc Comprobante
        from FacturaVenta
         where fv_fecha > CURRENT_TIMESTAMP
                 and est_id <> 7
      union all
      select pv_id comp_id,
             doct_id doct_id,
             pv_fecha Fecha,
             pv_nrodoc Comprobante
        from PedidoVenta
         where pv_fecha > CURRENT_TIMESTAMP
                 and est_id <> 7
      union all
      select cobz_id comp_id,
             doct_id doct_id,
             cobz_fecha Fecha,
             cobz_nrodoc Comprobante
        from Cobranza
         where cobz_fecha > CURRENT_TIMESTAMP
                 and est_id <> 7
      union all
      select opg_id comp_id,
             doct_id doct_id,
             opg_fecha Fecha,
             opg_nrodoc Comprobante
        from OrdenPago
         where opg_fecha > CURRENT_TIMESTAMP
                 and est_id <> 7
      union all
      select rc_id comp_id,
             doct_id doct_id,
             rc_fecha Fecha,
             rc_nrodoc Comprobante
        from RemitoCompra
         where rc_fecha > CURRENT_TIMESTAMP
                 and est_id <> 7
      union all
      select fc_id comp_id,
             doct_id doct_id,
             fc_fecha Fecha,
             fc_nrodoc Comprobante
        from FacturaCompra
         where fc_fecha > CURRENT_TIMESTAMP
                 and est_id <> 7
      union all
      select pc_id comp_id,
             doct_id doct_id,
             pc_fecha Fecha,
             pc_nrodoc Comprobante
        from PedidoCompra
         where pc_fecha > CURRENT_TIMESTAMP
                 and est_id <> 7
      union all
      select oc_id comp_id,
             doct_id doct_id,
             oc_fecha Fecha,
             oc_nrodoc Comprobante
        from OrdenCompra
         where oc_fecha > CURRENT_TIMESTAMP
                 and est_id <> 7
      union all
      select mf_id comp_id,
             doct_id doct_id,
             mf_fecha Fecha,
             mf_nrodoc Comprobante
        from MovimientoFondo
         where mf_fecha > CURRENT_TIMESTAMP
                 and est_id <> 7
      union all
      select dbco_id comp_id,
             doct_id doct_id,
             dbco_fecha Fecha,
             dbco_nrodoc Comprobante
        from DepositoBanco
         where dbco_fecha > CURRENT_TIMESTAMP
                 and est_id <> 7
      union all
      select rs_id comp_id,
             doct_id doct_id,
             rs_fecha Fecha,
             rs_nrodoc Comprobante
        from RecuentoStock
         where rs_fecha > CURRENT_TIMESTAMP
      union all
      select ppk_id comp_id,
             doct_id doct_id,
             ppk_fecha Fecha,
             ppk_nrodoc Comprobante
        from ParteProdKit
         where ppk_fecha > CURRENT_TIMESTAMP
      union all
      select st_id comp_id,
             doct_id doct_id,
             st_fecha Fecha,
             st_nrodoc Comprobante
        from Stock
         where st_fecha > CURRENT_TIMESTAMP
      union all
      select dcup_id comp_id,
             doct_id doct_id,
             dcup_fecha Fecha,
             dcup_nrodoc Comprobante
        from DepositoCupon
         where dcup_fecha > CURRENT_TIMESTAMP
                 and est_id <> 7
      union all
      select rcup_id comp_id,
             doct_id doct_id,
             rcup_fecha Fecha,
             rcup_nrodoc Comprobante
        from ResolucionCupon
         where rcup_fecha > CURRENT_TIMESTAMP
                 and est_id <> 7
      union all
      select stcli_id comp_id,
             doct_id doct_id,
             stcli_fecha Fecha,
             stcli_nrodoc Comprobante
        from StockCliente
         where stcli_fecha > CURRENT_TIMESTAMP
      union all
      select stprov_id comp_id,
             doct_id doct_id,
             stprov_fecha Fecha,
             stprov_nrodoc Comprobante
        from StockProveedor
         where stprov_fecha > CURRENT_TIMESTAMP;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function dc_csc_aud_0010(integer)
  owner to postgres;
