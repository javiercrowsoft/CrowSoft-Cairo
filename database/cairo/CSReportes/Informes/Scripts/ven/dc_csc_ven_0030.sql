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
-- Function: dc_csc_ven_0030()

-- drop function dc_csc_ven_0030(integer, timestamp with time zone, timestamp with time zone, varchar, varchar, varchar, varchar);

/*
select * from dc_csc_ven_0030(1,'2010-09-30','2020-09-30','0','0','0','0');
fetch all from rtn;
*/

create or replace function dc_csc_ven_0030
(
  in p_us_id integer,
  in p_Fini timestamp with time zone,
  in p_Ffin timestamp with time zone,

  in p_cico_id varchar,
  in p_pr_id varchar,
  in p_doc_id varchar,
  in p_emp_id varchar,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_pr_id integer;
   v_emp_id integer;
   v_cico_id integer;
   v_doc_id integer;
   v_ram_id_producto integer;
   v_ram_id_Empresa integer;
   v_ram_id_circuitoContable integer;
   v_ram_id_documento integer;
   v_clienteID integer;
   v_IsRaiz smallint;
begin

   select * from sp_ArbConvertId(p_pr_id) into v_pr_id, v_ram_id_producto;
   select * from sp_ArbConvertId(p_doc_id) into v_doc_id, v_ram_id_documento;
   select * from sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_Empresa;
   select * from sp_ArbConvertId(p_cico_id) into v_cico_id, v_ram_id_circuitoContable;

   select * from  sp_GetRptId() into v_clienteID;

   if v_ram_id_producto <> 0 then
      --	exec sp_ArbGetGroups @ram_id_producto, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_producto) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_producto, v_clienteID);
      else
         v_ram_id_producto := 0;
     end if;
   end if;

   if v_ram_id_Empresa <> 0 then
      --	exec sp_ArbGetGroups @ram_id_Empresa, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Empresa) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_Empresa, v_clienteID);
      else
         v_ram_id_Empresa := 0;
      end if;
   end if;

   if v_ram_id_circuitoContable <> 0 then
      --	exec sp_ArbGetGroups @ram_id_circuitoContable, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_circuitoContable) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_circuitoContable, v_clienteID);
      else
         v_ram_id_circuitoContable := 0;
      end if;
   end if;

   if v_ram_id_documento <> 0 then
      --	exec sp_ArbGetGroups @ram_id_documento, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_documento) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_documento, v_clienteID);
      else
            v_ram_id_documento := 0;
      end if;
   end if;

   rtn := 'rtn';

   open rtn for

      --////////////////////////////////////////////////////////////////////////
      -- entre fechas
      select
         1 Orden,
         pr_nombrecompra producto,
         sum(case doc.doct_id
                when 7 then - (fvi_neto - (fvi_neto * fv_descuento1 / 100) - ((fvi_neto - (fvi_neto * fv_descuento1 / 100)) * fv_descuento2 / 100))
                else          (fvi_neto - (fvi_neto * fv_descuento1 / 100) - ((fvi_neto - (fvi_neto * fv_descuento1 / 100)) * fv_descuento2 / 100))
             end) ventas_neto,
         sum(case doc.doct_id
                when 7 then -(fvi_importe - (fvi_importe * fv_descuento1 / 100) - ((fvi_importe - (fvi_importe * fv_descuento1 / 100)) * fv_descuento2 / 100))
                else         (fvi_importe - (fvi_importe * fv_descuento1 / 100) - ((fvi_importe - (fvi_importe * fv_descuento1 / 100)) * fv_descuento2 / 100))
             end) ventas,
         0 compras_neto,
         0 compras,
         sum(case doc.doct_id
                when 7 then -((fvi_ivari + fvi_ivarni) - ((fvi_ivari + fvi_ivarni) * fv_descuento1 / 100) - (((fvi_ivari + fvi_ivarni) - ((fvi_ivari + fvi_ivarni) * fv_descuento1 / 100)) * fv_descuento2 / 100))
                else         ((fvi_ivari + fvi_ivarni) - ((fvi_ivari + fvi_ivarni) * fv_descuento1 / 100) - (((fvi_ivari + fvi_ivarni) - ((fvi_ivari + fvi_ivarni) * fv_descuento1 / 100)) * fv_descuento2 / 100))
             end) ivaventas,
         0 ivacompras,
         sum(case doc.doct_id
                when 7 then -fvi_cantidad
                else fvi_cantidad
             end) cant_ventas,
         0 cant_compras
   from Producto pr
   join FacturaVentaItem fvi on pr.pr_id = fvi.pr_id
   join FacturaVenta fv on fvi.fv_id = fv.fv_id
   join Documento doc on fv.doc_id = doc.doc_id
   join Empresa emp on doc.emp_id = emp.emp_id
   where fv_fecha >= p_Fini
     and fv_fecha <= p_Ffin
     and fv.est_id <> 7 -- todas menos anuladas
     and ( exists ( select *
                    from EmpresaUsuario
                    where emp_id = doc.emp_id
                      and us_id = p_us_id )
          or ( p_us_id = 1 ) )
     and ( fv.doc_id = v_doc_id or v_doc_id = 0 )
     and ( pr.pr_id = v_pr_id or v_pr_id = 0 )
     and ( doc.cico_id = v_cico_id or v_cico_id = 0 )
     and ( emp.emp_id = v_emp_id or v_emp_id = 0 )

     and ( ( exists ( select rptarb_hojaid
                      from rptArbolRamaHoja
                      where rptarb_cliente = v_clienteID
                        and tbl_id = 30
                        and rptarb_hojaid = fvi.pr_id ) )
             or ( v_ram_id_producto = 0 ) )
     and ( ( exists ( select rptarb_hojaid
                      from rptArbolRamaHoja
                      where rptarb_cliente = v_clienteID
                        and tbl_id = 1016
                        and rptarb_hojaid = doc.cico_id ) )
             or ( v_ram_id_circuitoContable = 0 ) )
     and ( ( exists ( select rptarb_hojaid
                      from rptArbolRamaHoja
                      where rptarb_cliente = v_clienteID
                        and tbl_id = 1018
                        and rptarb_hojaid = doc.emp_id ) )
             or ( v_ram_id_Empresa = 0 ) )
     and ( ( exists ( select rptarb_hojaid
                      from rptArbolRamaHoja
                      where rptarb_cliente = v_clienteID
                        and tbl_id = 4001
                        and rptarb_hojaid = fv.doc_id ) )
             or ( v_ram_id_documento = 0 ) )
   group by pr_nombrecompra
   union all
   select
      2 Orden,
      pr_nombrecompra producto,
      0 ventas_neto,
      0 ventas,
      sum(case doc.doct_id
             when 8 then -(fci_neto - (fci_neto * fc_descuento1 / 100) - ((fci_neto - (fci_neto * fc_descuento1 / 100)) * fc_descuento2 / 100))
             else         (fci_neto - (fci_neto * fc_descuento1 / 100) - ((fci_neto - (fci_neto * fc_descuento1 / 100)) * fc_descuento2 / 100))
          end) compras_neto,
      sum(case doc.doct_id
             when 8 then -(fci_importe - (fci_importe * fc_descuento1 / 100) - ((fci_importe - (fci_importe * fc_descuento1 / 100)) * fc_descuento2 / 100))
             else         (fci_importe - (fci_importe * fc_descuento1 / 100) - ((fci_importe - (fci_importe * fc_descuento1 / 100)) * fc_descuento2 / 100))
          end) compras,
      0 ivaventas,
      sum(case doc.doct_id
             when 8 then -((fci_ivari + fci_ivarni) - ((fci_ivari + fci_ivarni) * fc_descuento1 / 100) - (((fci_ivari + fci_ivarni) - ((fci_ivari + fci_ivarni) * fc_descuento1 / 100)) * fc_descuento2 / 100))
             else         ((fci_ivari + fci_ivarni) - ((fci_ivari + fci_ivarni) * fc_descuento1 / 100) - (((fci_ivari + fci_ivarni) - ((fci_ivari + fci_ivarni) * fc_descuento1 / 100)) * fc_descuento2 / 100))
          end) ivacompras,
      0 cant_ventas,
      sum(case doc.doct_id
             when 8 then -fci_cantidad
             else fci_cantidad
          end) cant_compras
   from Producto pr
   join FacturaCompraItem fci on pr.pr_id = fci.pr_id
   join FacturaCompra fc on fci.fc_id = fc.fc_id
   join Documento doc on fc.doc_id = doc.doc_id
   join Empresa emp on doc.emp_id = emp.emp_id
   where fc_fecha >= p_Fini
     and fc_fecha <= p_Ffin
     and fc.est_id <> 7 -- todas menos anuladas

     and ( exists ( select *
                    from EmpresaUsuario
                    where emp_id = doc.emp_id
                      and us_id = p_us_id )
           or ( p_us_id = 1 ) )
     and ( pr.pr_id = v_pr_id or v_pr_id = 0 )
     and ( fc.doc_id = v_doc_id or v_doc_id = 0 )
     and ( doc.cico_id = v_cico_id or v_cico_id = 0 )
     and ( emp.emp_id = v_emp_id or v_emp_id = 0 )

     and ( ( exists ( select rptarb_hojaid
                      from rptArbolRamaHoja
                      where rptarb_cliente = v_clienteID
                        and tbl_id = 30
                        and rptarb_hojaid = fci.pr_id ) )
             or ( v_ram_id_producto = 0 ) )
     and ( ( exists ( select rptarb_hojaid
                      from rptArbolRamaHoja
                      where rptarb_cliente = v_clienteID
                        and tbl_id = 1016
                        and rptarb_hojaid = doc.cico_id ) )
             or ( v_ram_id_circuitoContable = 0 ) )
     and ( ( exists ( select rptarb_hojaid
                      from rptArbolRamaHoja
                      where rptarb_cliente = v_clienteID
                        and tbl_id = 1018
                        and rptarb_hojaid = doc.emp_id ) )
             or ( v_ram_id_Empresa = 0 ) )
     and ( ( exists ( select rptarb_hojaid
                      from rptArbolRamaHoja
                      where rptarb_cliente = v_clienteID
                        and tbl_id = 4001
                        and rptarb_hojaid = fc.doc_id ) )
             or ( v_ram_id_documento = 0 ) )
   group by pr_nombrecompra
   order by orden, producto;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function dc_csc_ven_0030(integer, timestamp with time zone, timestamp with time zone, varchar, varchar, varchar, varchar)
  owner to postgres;