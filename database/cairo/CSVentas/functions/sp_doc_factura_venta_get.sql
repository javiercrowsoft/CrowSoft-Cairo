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
-- Function: sp_doc_factura_venta_get()

-- drop function sp_doc_factura_venta_get(integer, integer, integer);
/*
select * from sp_doc_factura_venta_get(1,1,1);
fetch all from rtn;
*/
create or replace function sp_doc_factura_venta_get
(
  in p_emp_id integer,
  in p_fv_id integer,
  in p_us_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_editable integer;
   v_edit_msg varchar(255);
   v_doc_id integer;
   v_doct_id integer;
   v_ta_mascara varchar(100);
   v_ta_propuesto smallint;
   v_DeplNombre varchar(255);
   v_DeplId integer;
   v_DepfId integer;
   v_bIvari smallint;
   v_bIvarni smallint;
   v_cli_id integer;
begin

   rtn := 'rtn';

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                             TALONARIO Y ESTADO DE EDICION                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   select cli_id,
          doc_id,
          doct_id
   into v_cli_id,
          v_doc_id,
          v_doct_id
   from FacturaVenta
   where fv_id = p_fv_id;

   select * from sp_talonario_get_propuesto(v_doc_id, v_cli_id, 0) into  v_ta_mascara, v_ta_propuesto;

   select * from sp_cliente_get_iva(v_cli_id) into v_bIvari, v_bIvarni;

   select * from sp_doc_factura_venta_editable_get(p_emp_id, p_fv_id, p_us_id) into v_editable, v_edit_msg;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                             DEPOSITO                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   /*Factura de Venta*/
   /*Nota de Debito Venta*/
   if v_doct_id = 1
     or v_doct_id = 9 then
   begin
      select dOrigen.depl_nombre,
             depl_id_origen,
             dOrigen.depf_id
      into v_DeplNombre,
           v_DeplId,
           v_DepfId
      from FacturaVenta
               join Stock
                on FacturaVenta.st_id = Stock.st_id
               left join DepositoLogico dOrigen
                on Stock.depl_id_origen = dOrigen.depl_id
      where fv_id = p_fv_id;

      v_DeplNombre := coalesce(v_DeplNombre, '');

      v_DeplId := coalesce(v_DeplId, 0);

      if v_DeplId = 0 then
      begin
         select dOrigen.depl_nombre,
                depl_id_origen,
                dOrigen.depf_id
           into v_DeplNombre,
                v_DeplId,
                v_DepfId
           from FacturaVenta
                  join RemitoVenta
                   on FacturaVenta.rv_id = RemitoVenta.rv_id
                  join Stock
                   on RemitoVenta.st_id = Stock.st_id
                  left join DepositoLogico dOrigen
                   on Stock.depl_id_origen = dOrigen.depl_id
            where fv_id = p_fv_id;

      end;
      end if;

   end;
   else
   begin
      /*Nota de Credito Venta*/
      if v_doct_id = 7 then
         select dDestino.depl_nombre,
                        depl_id_destino,
                        dDestino.depf_id
           into v_DeplNombre,
                v_DeplId,
                v_DepfId
           from FacturaVenta
                  join Stock
                   on FacturaVenta.st_id = Stock.st_id
                  left join DepositoLogico dDestino
                   on Stock.depl_id_destino = dDestino.depl_id
            where fv_id = p_fv_id;

      end if;

      v_DeplNombre := coalesce(v_DeplNombre, '');

      v_DeplId := coalesce(v_DeplId, 0);

      if v_DeplId = 0 then
      begin
         select dDestino.depl_nombre,
                depl_id_destino,
                dDestino.depf_id
           into v_DeplNombre,
                v_DeplId,
                v_DepfId
           from FacturaVenta
                  join RemitoVenta
                   on FacturaVenta.rv_id = RemitoVenta.rv_id
                  join Stock
                   on RemitoVenta.st_id = Stock.st_id
                  left join DepositoLogico dDestino
                   on Stock.depl_id_destino = dDestino.depl_id
            where fv_id = p_fv_id;

      end;
      end if;

   end;
   end if;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                             select                                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   open rtn for

      select FacturaVenta.*,
             doct_nombre,
             mon_nombre,
             Documento.doc_fv_sinpercepcion,
             cli_nombre,
             lp_nombre,
             ld_nombre,
             cpg_nombre,
             est_nombre,
             ccos_nombre,
             suc_nombre,
             doc_nombre,
             ven_nombre,
             case
                  when lgj_titulo <> '' then lgj_titulo
                  else lgj_codigo
             end lgj_codigo,
             pOrigen.pro_nombre ProOrigen,
             pDestino.pro_nombre ProDestino,
             trans_nombre,
             clis_nombre,
             v_DeplId depl_id,
             v_DeplNombre depl_nombre,
             v_DepfId depf_id,
             v_bIvari bIvaRi,
             v_bIvarni bIvaRni,
             v_editable editable,
             v_edit_msg editMsg,
             v_ta_mascara ta_mascara,
             v_ta_propuesto ta_propuesto,
             doc_muevestock,
             doc_tipofactura
        from FacturaVenta
               join Documento
                on FacturaVenta.doc_id = Documento.doc_id
               join DocumentoTipo
                on FacturaVenta.doct_id = DocumentoTipo.doct_id
               join Moneda
                on FacturaVenta.mon_id = Moneda.mon_id
               join CondicionPago
                on FacturaVenta.cpg_id = CondicionPago.cpg_id
               join Estado
                on FacturaVenta.est_id = Estado.est_id
               join Sucursal
                on FacturaVenta.suc_id = Sucursal.suc_id
               join Cliente
                on FacturaVenta.cli_id = Cliente.cli_id
               left join CentroCosto
                on FacturaVenta.ccos_id = CentroCosto.ccos_id
               left join ListaPrecio
                on FacturaVenta.lp_id = ListaPrecio.lp_id
               left join ListaDescuento
                on FacturaVenta.ld_id = ListaDescuento.ld_id
               left join Vendedor
                on FacturaVenta.ven_id = Vendedor.ven_id
               left join Legajo
                on FacturaVenta.lgj_id = Legajo.lgj_id
               left join Provincia pOrigen
                on FacturaVenta.pro_id_origen = pOrigen.pro_id
               left join Provincia pDestino
                on FacturaVenta.pro_id_destino = pDestino.pro_id
               left join Transporte
                on FacturaVenta.trans_id = Transporte.trans_id
               left join ClienteSucursal
                on FacturaVenta.clis_id = ClienteSucursal.clis_id
         where fv_id = p_fv_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_venta_get(integer, integer, integer)
  owner to postgres;