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
-- Function: sp_doc_pedido_venta_get()

-- drop function sp_doc_pedido_venta_get(integer, integer, integer);
/*
select * from sp_doc_pedido_venta_get(1,1,1);
fetch all from rtn;
*/
create or replace function sp_doc_pedido_venta_get
(
  in p_emp_id integer,
  in p_pv_id integer,
  in p_us_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_editable integer;
   v_edit_msg varchar(255);
   v_doc_id integer;
   v_ta_mascara varchar(100);
   v_ta_propuesto smallint;
   v_bIvari smallint;
   v_bIvarni smallint;
   v_cli_id integer;
   v_ram_id_stock varchar(50);
   v_RamaStock varchar(50);
   v_ram_id integer;
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
          doc_id
   into v_cli_id,
          v_doc_id
   from PedidoVenta
   where pv_id = p_pv_id;

   select * from sp_talonario_get_propuesto(v_doc_id, v_cli_id, 0) into  v_ta_mascara, v_ta_propuesto;

   select * from sp_cliente_get_iva(v_cli_id) into v_bIvari, v_bIvarni;

   select * from sp_doc_pedido_venta_editable_get(p_emp_id, p_pv_id, p_us_id) into v_editable, v_edit_msg;


   select ram_id_stock
     into v_ram_id_stock
   from PedidoVenta
   where pv_id = p_pv_id;

   if coalesce(v_ram_id_stock, '') <> '' then
      if substr(v_ram_id_stock, 1, 1) = 'N' then
         v_ram_id := CAST(substr(v_ram_id_stock, 2, 50) as integer);

         select ram_nombre
           into v_RamaStock
         from Rama
         where ram_id = v_ram_id;

      else
         if isnumeric(v_ram_id_stock) <> 0 then
            select depl_nombre
              into v_RamaStock
            from DepositoLogico
            where depl_id = CAST(v_ram_id_stock as integer);

         end if;
      end if;
   end if;

   v_RamaStock := coalesce(v_RamaStock, '');

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                             select                                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   open rtn for

      select pv.*,
             doct_nombre,
             doc.mon_id,
             mon_nombre,

             case 
               when doc_pv_desde_prv <> 0 then 1 
               else 0 
             end doc_tipopedido,
             
             v_RamaStock RamaStock,
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

             pOrigen.pro_nombre  ProOrigen,
             pDestino.pro_nombre ProDestino,

             trans_nombre,
             chof.chof_nombre,
             cam.cam_patente,

             case semi.cam_essemi
                when 0 then semi.cam_patentesemi
                else semi.cam_patente
             end cam_patentesemi,

             clis_nombre,

             v_bIvari    bIvaRi,
             v_bIvarni   bIvaRni,

             v_editable  editable,
             v_edit_msg  editMsg,

             v_ta_propuesto ta_propuesto,
             v_ta_mascara   ta_mascara

      from PedidoVenta pv
             join Documento doc
              on pv.doc_id = doc.doc_id
             join DocumentoTipo
              on pv.doct_id = DocumentoTipo.doct_id
             join Moneda mon
              on doc.mon_id = mon.mon_id
             join CondicionPago
              on pv.cpg_id = CondicionPago.cpg_id
             join Estado
              on pv.est_id = Estado.est_id
             join Sucursal
              on pv.suc_id = Sucursal.suc_id
             join Cliente
              on pv.cli_id = Cliente.cli_id
             left join CentroCosto
              on pv.ccos_id = CentroCosto.ccos_id
             left join ListaPrecio
              on pv.lp_id = ListaPrecio.lp_id
             left join ListaDescuento
              on pv.ld_id = ListaDescuento.ld_id
             left join Vendedor
              on pv.ven_id = Vendedor.ven_id
             left join Legajo
              on pv.lgj_id = Legajo.lgj_id
             left join Provincia pOrigen
              on pv.pro_id_origen = pOrigen.pro_id
             left join Provincia pDestino
              on pv.pro_id_destino = pDestino.pro_id
             left join Transporte
              on pv.trans_id = Transporte.trans_id
             left join Chofer chof
              on pv.chof_id = chof.chof_id
             left join Camion cam
              on pv.cam_id = cam.cam_id
             left join Camion semi
              on pv.cam_id_semi = semi.cam_id
             left join ClienteSucursal
              on pv.clis_id = ClienteSucursal.clis_id
       where pv_id = p_pv_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_pedido_venta_get(integer, integer, integer)
  owner to postgres;