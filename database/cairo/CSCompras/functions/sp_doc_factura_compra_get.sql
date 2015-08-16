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
-- Function: sp_doc_factura_compra_get()

-- drop function sp_doc_factura_compra_get(integer, integer, integer);
/*
select * from sp_doc_factura_compra_get(1,1,1);
fetch all from rtn;
*/
create or replace function sp_doc_factura_compra_get
(
  in p_emp_id integer,
  in p_fc_id integer,
  in p_us_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_editable smallint;
   v_edit_msg varchar(255);
   v_doc_id integer;
   v_doct_id integer;
   v_ta_mascara varchar(100);
   v_ta_propuesto smallint;
   v_DeplNombre varchar(255);
   v_DeplId integer;
   v_bIvari smallint;
   v_bIvarni smallint;
   v_prov_id integer;
begin

   rtn := 'rtn';

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                             TALONARIO Y ESTADO DE EDICION                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

   select prov_id,
          doc_id,
          doct_id
   into v_prov_id,
          v_doc_id,
          v_doct_id
   from FacturaCompra
   where fc_id = p_fc_id;

   select * from sp_talonario_get_propuesto(v_doc_id, 0, v_prov_id) into v_ta_mascara, v_ta_propuesto;

   select * from sp_proveedor_get_iva(v_prov_id, 0::smallint) into v_bIvari, v_bIvarni;

   select * from sp_doc_factura_compra_editable_get(p_emp_id, p_fc_id, p_us_id) into v_editable, v_edit_msg;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                             DEPOSITO                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
    /*Factura de Compra*/
    /*Nota de Debito Compra*/
   if v_doct_id = 2
     or v_doct_id = 10 then
   begin
      select dDestino.depl_nombre,
             depl_id_destino
      into v_DeplNombre,
           v_DeplId
      from FacturaCompra
               join Stock
                on FacturaCompra.st_id = Stock.st_id
               left join DepositoLogico dDestino
                on Stock.depl_id_destino = dDestino.depl_id
      where fc_id = p_fc_id;

      v_DeplNombre := coalesce(v_DeplNombre, '');

      v_DeplId := coalesce(v_DeplId, 0);

      if v_DeplId = 0 then
      begin
         select dDestino.depl_nombre,
                depl_id_destino
           into v_DeplNombre,
                v_DeplId
           from FacturaCompra
                  join RemitoCompra
                   on FacturaCompra.rc_id = RemitoCompra.rc_id
                  join Stock
                   on RemitoCompra.st_id = Stock.st_id
                  left join DepositoLogico dDestino
                   on Stock.depl_id_destino = dDestino.depl_id
            where fc_id = p_fc_id;

      end;
      end if;

   end;
   else
   begin
      /*Nota de Credito Compra*/
      if v_doct_id = 8 then
         select dOrigen.depl_nombre,
                        depl_id_origen
           into v_DeplNombre,
                v_DeplId
           from FacturaCompra
                  join Stock
                   on FacturaCompra.st_id = Stock.st_id
                  left join DepositoLogico dOrigen
                   on Stock.depl_id_origen = dOrigen.depl_id
            where fc_id = p_fc_id;

      end if;

      v_DeplNombre := coalesce(v_DeplNombre, '');

      v_DeplId := coalesce(v_DeplId, 0);

      if v_DeplId = 0 then
      begin
         select dOrigen.depl_nombre,
                depl_id_origen
           into v_DeplNombre,
                v_DeplId
           from FacturaCompra
                  join RemitoCompra
                   on FacturaCompra.rc_id = RemitoCompra.rc_id
                  join Stock
                   on RemitoCompra.st_id = Stock.st_id
                  left join DepositoLogico dOrigen
                   on Stock.depl_id_origen = dOrigen.depl_id
            where fc_id = p_fc_id;

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

      select FacturaCompra.*,
             doct_nombre,
             mon_nombre,
             prov_nombre,
             lp_nombre,
             ld_nombre,
             cpg_nombre,
             est_nombre,
             ccos_nombre,
             suc_nombre,
             doc_nombre,
             case
                  when lgj_titulo <> '' then lgj_titulo
                  else lgj_codigo
             end lgj_codigo,
             pOrigen.pro_nombre ProOrigen,
             pDestino.pro_nombre ProDestino,
             v_DeplId depl_id,
             v_DeplNombre depl_nombre,
             v_bIvari bIvaRi,
             v_bIvarni bIvaRni,
             v_editable editable,
             v_edit_msg editMsg,
             v_ta_mascara ta_mascara,
             v_ta_propuesto ta_propuesto,
             doc_muevestock,
             doc_tipofactura
        from FacturaCompra
               join Documento
                on FacturaCompra.doc_id = Documento.doc_id
               join DocumentoTipo
                on FacturaCompra.doct_id = DocumentoTipo.doct_id
               join Moneda
                on FacturaCompra.mon_id = Moneda.mon_id
               join CondicionPago
                on FacturaCompra.cpg_id = CondicionPago.cpg_id
               join Estado
                on FacturaCompra.est_id = Estado.est_id
               join Sucursal
                on FacturaCompra.suc_id = Sucursal.suc_id
               join Proveedor
                on FacturaCompra.prov_id = Proveedor.prov_id
               left join CentroCosto
                on FacturaCompra.ccos_id = CentroCosto.ccos_id
               left join ListaPrecio
                on FacturaCompra.lp_id = ListaPrecio.lp_id
               left join ListaDescuento
                on FacturaCompra.ld_id = ListaDescuento.ld_id
               left join Legajo
                on FacturaCompra.lgj_id = Legajo.lgj_id
               left join Provincia pOrigen
                on FacturaCompra.pro_id_origen = pOrigen.pro_id
               left join Provincia pDestino
                on FacturaCompra.pro_id_destino = pDestino.pro_id
         where fc_id = p_fc_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_compra_get(integer, integer, integer)
  owner to postgres;