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
-- Function: sp_doc_factura_compra_get_aplic()

-- drop function sp_doc_factura_compra_get_aplic(integer);
/*
select * from sp_doc_factura_compra_get_aplic(1,3,6);
fetch all from rtn;
*/
create or replace function sp_doc_factura_compra_get_aplic
(
  in p_emp_id integer,
  in p_fc_id integer,
  in p_tipo integer,
            /* 1: Vencimientos
               2: Aplicaciones ordenes de pago y Notas de credito
               3: Aplicaciones posibles (ordenes de pago y Notas de credito)
               4: Pendientes Items (Articulos)
               5: Aplicaciones Ordenes de Compra y Remitos
               6: Aplicaciones posibles (Ordenes y Remitos)
              */
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_prov_id integer;
   v_doct_id integer;
begin

   rtn := 'rtn';

   select prov_id,
          doct_id
     into v_prov_id,
          v_doct_id
   from FacturaCompra
   where fc_id = p_fc_id;

   --//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   --
   -- vencimientos
   --
   --//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

   if p_tipo = 1 then

      open rtn for
         select fcd.fcd_id,
                0 fcp_id,
                fcd.fcd_fecha fecha,
                coalesce(( select sum(fcopg_importe)
                      from FacturaCompraOrdenPago fcc
                      where fcd.fcd_id = fcc.fcd_id ), 0)
              + coalesce(( select sum(fcnc1.fcnc_importe)
                      from FacturaCompraNotaCredito fcnc1
                      where fcd.fcd_id = fcnc1.fcd_id_factura ), 0)
              + coalesce(( select sum(fcnc2.fcnc_importe)
                      from FacturaCompraNotaCredito fcnc2
                      where fcd.fcd_id = fcnc2.fcd_id_notaCredito ), 0) importe,
                fcd.fcd_pendiente pendiente
         from FacturaCompraDeuda fcd
         where fcd.fc_id = p_fc_id
         group by fcd.fcd_id,fcd.fcd_fecha,fcd.fcd_pendiente

         union

         select 0 fcd_id,
                fcp_id,
                fcp_fecha fecha,
                fcp_importe importe,
                0 pendiente
         from FacturaCompraPago
         where fc_id = p_fc_id

         order by fecha;

   else

      --////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      --
      -- aplicaciones ordenes de pago y notas de credito
      --
      --////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      if p_tipo = 2 then

         --/////////////////////////////////////////////////////////////////////////////////////////////////////////////
         --
         --  notas de credito select * from documentotipo
         --
         --/////////////////////////////////////////////////////////////////////////////////////////////////////////////
         if v_doct_id = 8 /*nota de credito compra*/ then

            open rtn for
               select fcnc.fcnc_id,
                      fcnc.fcnc_importe Aplicado,
                      fcnc.fcd_id_factura fcd_id2,
                      fcnc.fcd_id_notaCredito fcd_id,
                      fcnc.fcp_id_factura fcp_id2,
                      fcnc.fcp_id_notaCredito fcp_id,
                      fcdfc.fcd_pendiente pendiente,
                      fcnc.fc_id_factura fc_id,
                      fc.fc_nrodoc nrodoc,
                      d.doc_nombre,
                      /* para el union */
                      0 opg_id,
                      0 fcopg_id,
                      0 fcopg_importeOrigen,
                      0 fcopg_cotizacion,
                      0 opg_pendiente,
                      '' opg_nroDoc,
                      coalesce(fcdfc.fcd_fecha, fcpfc.fcp_fecha) opg_fecha
                 /* fin para el union */
               from FacturaCompraNotaCredito fcnc
               join FacturaCompra fc
                on fcnc.fc_id_factura = fc.fc_id
               left join FacturaCompraPago fcpnc
                on fcnc.fcp_id_notaCredito = fcpnc.fcp_id
               left join FacturaCompraDeuda fcdnc
                on fcnc.fcd_id_notaCredito = fcdnc.fcd_id
               left join FacturaCompraPago fcpfc
                on fcnc.fcp_id_factura = fcpfc.fcp_id
               left join FacturaCompraDeuda fcdfc
                on fcnc.fcd_id_factura = fcdfc.fcd_id
               left join Documento d
                on fc.doc_id = d.doc_id
               where fcnc.fc_id_notaCredito = p_fc_id
               order by nrodoc;

         else

            open rtn for

               --///////////////////////////////////////////////////////////////////////////////////////////////////////
               --
               --  factura y nota de debito
               --
               --///////////////////////////////////////////////////////////////////////////////////////////////////////

               select fcnc_id,
                      fcnc_importe Aplicado,
                      fcd_id_factura fcd_id,
                      fcd_id_notaCredito fcd_id2,
                      fcp_id_factura fcp_id,
                      fcp_id_notaCredito fcp_id2,
                      fcdnc.fcd_pendiente pendiente,
                      fc_id_notaCredito fc_id,
                      fc_nrodoc nrodoc,
                      doc_nombre,
                      /* para el union */
                      0 opg_id,
                      0 fcopg_id,
                      0 fcopg_importeOrigen,
                      0 fcopg_cotizacion,
                      coalesce(fcdnc.fcd_fecha, fcpnc.fcp_fecha) opg_fecha
                      /* fin para el union */
               from FacturaCompraNotaCredito fcnc
               join FacturaCompra fc
                on fcnc.fc_id_notaCredito = fc.fc_id
               left join FacturaCompraPago fcpnc
                on fcnc.fcp_id_notaCredito = fcpnc.fcp_id
               left join FacturaCompraDeuda fcdnc
                on fcnc.fcd_id_notaCredito = fcdnc.fcd_id
               left join FacturaCompraPago fcpfc
                on fcnc.fcp_id_factura = fcpfc.fcp_id
               left join FacturaCompraDeuda fcdfc
                on fcnc.fcd_id_factura = fcdfc.fcd_id
               left join Documento d
                on fc.doc_id = d.doc_id
               where fcnc.fc_id_factura = p_fc_id

               union

               select 
                      /* para el union */
                      0 fcnc_id,
                      fcopg_importe Aplicado,
                      fcc.fcd_id fcd_id,
                      0 fcd_id2,
                      fcc.fcp_id fcp_id,
                      0 fcp_id2,
                      opg_pendiente pendiente,
                      0 fc_id,
                      opg_nroDoc nrodoc,
                      doc_nombre,
                      /* fin para el union */
                      opg.opg_id,
                      fcopg_id,
                      fcopg_importeOrigen,
                      fcopg_cotizacion,
                      opg_fecha
               from FacturaCompraOrdenPago fcc
               join FacturaCompra fc
                on fcc.fc_id = fc.fc_id
               join OrdenPago opg
                on fcc.opg_id = opg.opg_id
               left join FacturaCompraDeuda fcd
                on fcc.fcd_id = fcd.fcd_id
               left join FacturaCompraPago fcp
                on fcc.fcp_id = fcp.fcp_id
               left join Documento d
                on opg.doc_id = d.doc_id
               where fc.fc_id = p_fc_id

               order by nrodoc,
                        opg_fecha;

         end if;

      else

         --/////////////////////////////////////////////////////////////////////////////////////////////////////////////
         --
         -- aplicaciones posibles (ordenes de pago y notas de credito)
         --
         --/////////////////////////////////////////////////////////////////////////////////////////////////////////////
         if p_tipo = 3 then

            --//////////////////////////////////////////////////////////////////////////////////////////////////////////
            --
            --  notas de credito
            --
            --//////////////////////////////////////////////////////////////////////////////////////////////////////////
            if v_doct_id = 8 /*nota de credito compra*/ then

               open rtn for
                  select 0 opg_id,
                         fc.fc_id,
                         fcd.fcd_id,
                         fcd.fcd_fecha Fecha,
                         d.doc_nombre,
                         fc.fc_nrodoc nroDoc,
                         fcd.fcd_pendiente Pendiente
                  from FacturaCompra fc
                  join FacturaCompraDeuda fcd
                   on fc.fc_id = fcd.fc_id
                  join Documento d
                   on fc.doc_id = d.doc_id
                  where fc.prov_id = v_prov_id
                    and fc.est_id <> 7
                    -- empresa
                    and d.emp_id = p_emp_id
                    and fc.doct_id <> 8
                    /* facturas y notas de debito */
                    and not exists ( select fcnc_id
                                     from FacturaCompraNotaCredito
                                     where fcd_id_factura = fcd.fcd_id
                                       and fc_id_notaCredito = p_fc_id )
                    and round(fcd.fcd_pendiente, 2) > 0
                  order by nroDoc,
                           fecha;


            else

               open rtn for
                  --////////////////////////////////////////////////////////////////////////////////////////////////////
                  --
                  --  factura y nota de debito
                  --
                  --////////////////////////////////////////////////////////////////////////////////////////////////////
                  select 0 opg_id,
                           fc.fc_id,
                           fcd_id,
                           fcd_fecha Fecha,
                           doc_nombre,
                           fc_nrodoc nroDoc,
                           fcd_pendiente Pendiente
                    from FacturaCompra fc
                           join FacturaCompraDeuda fcd
                            on fc.fc_id = fcd.fc_id
                           join Documento d
                            on fc.doc_id = d.doc_id
                     where fc.prov_id = v_prov_id
                             and fc.est_id <> 7
                             -- empresa
                             and d.emp_id = p_emp_id
                             and fc.doct_id = 8
                             /* notas de credito */
                             and not exists ( select fcd_id
                                              from FacturaCompraNotaCredito
                                              where fcd_id_notaCredito = fcd.fcd_id
                                                and fc_id_factura = p_fc_id )
                             and round(fcd_pendiente, 2) > 0
                  union
                  
                  select opg_id,
                         0 fc_id,
                         0 fcd_id,
                         opg_fecha Fecha,
                         doc_nombre,
                         opg_nrodoc nroDoc,
                         opg_pendiente Pendiente
                  from OrdenPago opg
                  join Documento d
                   on opg.doc_id = d.doc_id
                  where prov_id = v_prov_id
                    and opg.est_id <> 7
                    -- empresa
                    and d.emp_id = p_emp_id
                    and not exists ( select opg_id
                                     from FacturaCompraOrdenPago
                                     where opg_id = opg.opg_id
                                       and fc_id = p_fc_id )
                    and round(opg_pendiente, 2) > 0
                  order by nroDoc,
                           fecha;
            end if;


         else

            --//////////////////////////////////////////////////////////////////////////////////////////////////////////
            --
            -- pendientes items (articulos)
            --
            --//////////////////////////////////////////////////////////////////////////////////////////////////////////
            if p_tipo = 4 then

               open rtn for
                  select fci.fci_id,
                         fci.pr_id,
                         p.pr_nombreCompra,
                         fci.fci_pendiente,
                         fci.fci_cantidadARemitir - fci.fci_pendiente aplicado,
                         fci.fci_orden
                  from FacturaCompraItem fci
                           join Producto p
                            on fci.pr_id = p.pr_id
                  where fci.fc_id = p_fc_id
                  order by fci.fci_orden;

            else

               --///////////////////////////////////////////////////////////////////////////////////////////////////////
               --
               -- aplicaciones ordenes y remitos - sp_col OrdenFacturaCompra
               --
               --///////////////////////////////////////////////////////////////////////////////////////////////////////
               if p_tipo = 5 then

                  open rtn for
                     select fci.fci_id,
                            fci.pr_id,
                            oci.oc_id,
                            oci.oci_id,
                            ocfc_id,
                            0 rc_id,
                            0 rci_id,
                            0 rcfc_id,
                            ocfc_cantidad Aplicado,
                            doc_nombre,
                            oc_nrodoc nrodoc,
                            oc_fecha Fecha,
                            oci_pendienteFac Pendiente,
                            oci_orden orden
                  from FacturaCompraItem fci
                  join OrdenFacturaCompra ocfc
                   on fci.fci_id = ocfc.fci_id
                  join OrdenCompraItem oci
                   on ocfc.oci_id = oci.oci_id
                  join OrdenCompra oc
                   on oci.oc_id = oc.oc_id
                  join Documento doc
                   on oc.doc_id = doc.doc_id
                  where fci.fc_id = p_fc_id

                  union

                  select fci.fci_id,
                         fci.pr_id,
                         0 oc_id,
                         0 oci_id,
                         0 ocfc_id,
                         rci.rc_id,
                         rci.rci_id,
                         rcfc_id,
                         rcfc_cantidad Aplicado,
                         doc_nombre,
                         rc_nrodoc nrodoc,
                         rc_fecha Fecha,
                         rci_pendienteFac Pendiente,
                         rci_orden orden
                  from FacturaCompraItem fci
                  join RemitoFacturaCompra rcfc
                   on fci.fci_id = rcfc.fci_id
                  join RemitoCompraItem rci
                   on rcfc.rci_id = rci.rci_id
                  join RemitoCompra rc
                   on rci.rc_id = rc.rc_id
                  join Documento doc
                   on rc.doc_id = doc.doc_id
                  where fci.fc_id = p_fc_id

                  order by Fecha,
                           nrodoc,
                           orden;


               else

                  --////////////////////////////////////////////////////////////////////////////////////////////////////
                  --
                  -- aplicaciones posibles (ordenes y remitos)   sp_col OrdenFacturaCompra
                  --
                  --////////////////////////////////////////////////////////////////////////////////////////////////////
                  if p_tipo = 6 then

                     open rtn for
                        select oci.pr_id,
                               oci.oc_id,
                               oci_id,
                               0 rc_id,
                               0 rci_id,
                               doc_nombre,
                               oc_nrodoc nrodoc,
                               oc_fecha Fecha,
                               oci_pendienteFac Pendiente,
                               oci_orden orden
                        from FacturaCompraItem fci
                        join FacturaCompra fc
                         on fci.fc_id = fc.fc_id
                        join OrdenCompra oc
                         on fc.prov_id = oc.prov_id and oc.doct_id = 35 and oc.est_id <> 7
                        join Documento doc
                         on oc.doc_id = doc.doc_id
                        join OrdenCompraItem oci
                         on oc.oc_id = oci.oc_id and fci.pr_id = oci.pr_id
                        where fci.fc_id = p_fc_id
                          -- empresa
                          and doc.emp_id = p_emp_id
                          and oci_pendienteFac > 0
                          -- el orden compra item no tiene que estar vinculado
                          -- con ningun item de esta factura
                          --
                          and not exists ( select *
                                           from OrdenFacturaCompra ocfc
                                           join FacturaCompraItem fci
                                            on ocfc.fci_id = fci.fci_id
                                           where oci_id = oci.oci_id
                                             and fc_id = fc.fc_id )
                        union

                        select rci.pr_id,
                               0 oc_id,
                               0 oci_id,
                               rci.rc_id,
                               rci_id,
                               doc_nombre,
                               rc_nrodoc nrodoc,
                               rc_fecha Fecha,
                               rci_pendienteFac Pendiente,
                               rci_orden orden
                        from FacturaCompraItem fci
                        join FacturaCompra fc
                         on fci.fc_id = fc.fc_id
                        join RemitoCompra rc
                         on fc.prov_id = rc.prov_id and rc.doct_id = 4 and rc.est_id <> 7
                        join Documento doc
                         on rc.doc_id = doc.doc_id
                        join RemitoCompraItem rci
                         on rc.rc_id = rci.rc_id and fci.pr_id = rci.pr_id
                        where fci.fc_id = p_fc_id
                                 -- empresa
                                 and doc.emp_id = p_emp_id
                                 and rci_pendienteFac > 0
                                 -- el remito compra item no tiene que estar vinculado
                                 -- con ningun item de esta factura
                                 --
                                 and not exists ( select *
                                                  from RemitoFacturaCompra rcfc
                                                  join FacturaCompraItem fci
                                                   on rcfc.fci_id = fci.fci_id
                                                  where rci_id = rci.rci_id
                                                    and fc_id = fc.fc_id )

                        order by Fecha,
                                 nrodoc,
                                 orden;

                  end if;
               end if;
            end if;
         end if;
      end if;
   end if;
end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_compra_get_aplic(integer, integer, integer)
  owner to postgres;