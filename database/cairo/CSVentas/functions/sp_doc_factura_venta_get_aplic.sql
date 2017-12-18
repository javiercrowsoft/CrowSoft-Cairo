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
-- Function: sp_doc_factura_venta_get_aplic()

-- drop function sp_doc_factura_venta_get_aplic(integer);
/*
select * from sp_doc_factura_venta_get_aplic(1,3,6);
fetch all from rtn;
*/
create or replace function sp_doc_factura_venta_get_aplic
(
  in p_emp_id integer,
  in p_fc_id integer,
  in p_tipo integer,
            /* 1: Vencimientos
               2: Aplicaciones Cobranzas y Notas de credito
               3: Aplicaciones posibles (Cobranzas y Notas de credito)
               4: Pendientes Items (Articulos)
               5: Aplicaciones Pedidos de Venta y Remitos
               6: Aplicaciones posibles (Pedidos y Remitos)
              */
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_cli_id integer;
   v_doct_id integer;
begin

   rtn := 'rtn';

   select cli_id,
          doct_id
     into v_cli_id,
          v_doct_id
   from FacturaVenta
   where fv_id = p_fv_id;

   --//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   --
   -- vencimientos
   --
   --//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

   if p_tipo = 1 then

      open rtn for
         select fvd.fvd_id,
                0 fvp_id,
                fvd.fvd_fecha fecha,
                coalesce(( select sum(fvcobz_importe)
                      from FacturaVentaCobranza fvc
                      where fvd.fvd_id = fvc.fvd_id ), 0)
              + coalesce(( select sum(fvnc1.fvnc_importe)
                      from FacturaVentaNotaCredito fvnc1
                      where fvd.fvd_id = fvnc1.fvd_id_factura ), 0)
              + coalesce(( select sum(fvnc2.fvnc_importe)
                      from FacturaVentaNotaCredito fvnc2
                      where fvd.fvd_id = fvnc2.fvd_id_notaCredito ), 0) importe,
                fvd.fvd_pendiente pendiente
         from FacturaVentaDeuda fvd
         where fvd.fv_id = p_fv_id
         group by fvd.fvd_id,fvd.fvd_fecha,fvd.fvd_pendiente

         union

         select 0 fvd_id,
                fvp_id,
                fvp_fecha fecha,
                fvp_importe importe,
                0 pendiente
         from FacturaVentaPago
         where fv_id = p_fv_id

         order by fecha;

   else

      --////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      --
      -- aplicaciones cobranzas y notas de credito
      --
      --////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      if p_tipo = 2 then

         --/////////////////////////////////////////////////////////////////////////////////////////////////////////////
         --
         --  notas de credito select * from documentotipo
         --
         --/////////////////////////////////////////////////////////////////////////////////////////////////////////////
         if v_doct_id = 7 /*nota de credito venta*/ then

            open rtn for
               select fvnc.fvnc_id,
                      fvnc.fvnc_importe Aplicado,
                      fvnc.fvd_id_factura fvd_id2,
                      fvnc.fvd_id_notaCredito fvd_id,
                      fvnc.fvp_id_factura fvp_id2,
                      fvnc.fvp_id_notaCredito fvp_id,
                      fvdfv.fvd_pendiente pendiente,
                      fvnc.fv_id_factura fv_id,
                      fv.fv_nrodoc nrodoc,
                      d.doc_nombre,
                      /* para el union */
                      0 cobz_id,
                      0 fvcobz_id,
                      0 fvcobz_importeOrigen,
                      0 fvcobz_cotizacion,
                      0 cobz_pendiente,
                      '' cobz_nroDoc,
                      coalesce(fvdfv.fvd_fecha, fvpfv.fvp_fecha) cobz_fecha
                 /* fin para el union */
               from FacturaVentaNotaCredito fvnc
               join FacturaVenta fv
                on fvnc.fv_id_factura = fv.fv_id
               left join FacturaVentaPago fvpnc
                on fvnc.fvp_id_notaCredito = fvpnc.fvp_id
               left join FacturaVentaDeuda fvdnc
                on fvnc.fvd_id_notaCredito = fvdnc.fvd_id
               left join FacturaVentaPago fvpfv
                on fvnc.fvp_id_factura = fvpfv.fvp_id
               left join FacturaVentaDeuda fvdfv
                on fvnc.fvd_id_factura = fvdfv.fvd_id
               left join Documento d
                on fv.doc_id = d.doc_id
               where fvnc.fv_id_notaCredito = p_fv_id
               order by nrodoc;

         else

            open rtn for

               --///////////////////////////////////////////////////////////////////////////////////////////////////////
               --
               --  factura y nota de debito
               --
               --///////////////////////////////////////////////////////////////////////////////////////////////////////

               select fvnc_id,
                      fvnc_importe Aplicado,
                      fvd_id_factura fvd_id,
                      fvd_id_notaCredito fvd_id2,
                      fvp_id_factura fvp_id,
                      fvp_id_notaCredito fvp_id2,
                      fvdnc.fvd_pendiente pendiente,
                      fv_id_notaCredito fv_id,
                      fv_nrodoc nrodoc,
                      doc_nombre,
                      /* para el union */
                      0 cobz_id,
                      0 fvcobz_id,
                      0 fvcobz_importeOrigen,
                      0 fvcobz_cotizacion,
                      coalesce(fvdnc.fvd_fecha, fvpnc.fvp_fecha) cobz_fecha
                      /* fin para el union */
               from FacturaVentaNotaCredito fvnc
               join FacturaVenta fv
                on fvnc.fv_id_notaCredito = fv.fv_id
               left join FacturaVentaPago fvpnc
                on fvnc.fvp_id_notaCredito = fvpnc.fvp_id
               left join FacturaVentaDeuda fvdnc
                on fvnc.fvd_id_notaCredito = fvdnc.fvd_id
               left join FacturaVentaPago fvpfv
                on fvnc.fvp_id_factura = fvpfv.fvp_id
               left join FacturaVentaDeuda fvdfv
                on fvnc.fvd_id_factura = fvdfv.fvd_id
               left join Documento d
                on fv.doc_id = d.doc_id
               where fvnc.fv_id_factura = p_fv_id

               union

               select
                      /* para el union */
                      0 fvnc_id,
                      fvcobz_importe Aplicado,
                      fvc.fvd_id fvd_id,
                      0 fvd_id2,
                      fvc.fvp_id fvp_id,
                      0 fvp_id2,
                      cobz_pendiente pendiente,
                      0 fv_id,
                      cobz_nroDoc nrodoc,
                      doc_nombre,
                      /* fin para el union */
                      cobz.cobz_id,
                      fvcobz_id,
                      fvcobz_importeOrigen,
                      fvcobz_cotizacion,
                      cobz_fecha
               from FacturaVentaCobranza fvc
               join FacturaVenta fv
                on fvc.fv_id = fv.fv_id
               join Cobranza cobz
                on fvc.cobz_id = cobz.cobz_id
               left join FacturaVentaDeuda fvd
                on fvc.fvd_id = fvd.fvd_id
               left join FacturaVentaPago fvp
                on fvc.fvp_id = fvp.fvp_id
               left join Documento d
                on cobz.doc_id = d.doc_id
               where fv.fv_id = p_fv_id

               order by nrodoc,
                        cobz_fecha;

         end if;

      else

         --/////////////////////////////////////////////////////////////////////////////////////////////////////////////
         --
         -- aplicaciones posibles (cobranzas y notas de credito)
         --
         --/////////////////////////////////////////////////////////////////////////////////////////////////////////////
         if p_tipo = 3 then

            --//////////////////////////////////////////////////////////////////////////////////////////////////////////
            --
            --  notas de credito
            --
            --//////////////////////////////////////////////////////////////////////////////////////////////////////////
            if v_doct_id = 7 /*nota de credito venta*/ then

               open rtn for
                  select 0 cobz_id,
                         fv.fv_id,
                         fvd.fvd_id,
                         fvd.fvd_fecha Fecha,
                         d.doc_nombre,
                         fv.fv_nrodoc nroDoc,
                         fvd.fvd_pendiente Pendiente
                  from FacturaVenta fv
                  join FacturaVentaDeuda fvd
                   on fv.fv_id = fvd.fv_id
                  join Documento d
                   on fv.doc_id = d.doc_id
                  where fv.cli_id = v_cli_id
                    and fv.est_id <> 7
                    -- empresa
                    and d.emp_id = p_emp_id
                    and fv.doct_id <> 7
                    /* facturas y notas de debito */
                    and not exists ( select fvnc_id
                                     from FacturaVentaNotaCredito
                                     where fvd_id_factura = fvd.fvd_id
                                       and fv_id_notaCredito = p_fv_id )
                    and round(fvd.fvd_pendiente, 2) > 0
                  order by nroDoc,
                           fecha;


            else

               open rtn for
                  --////////////////////////////////////////////////////////////////////////////////////////////////////
                  --
                  --  factura y nota de debito
                  --
                  --////////////////////////////////////////////////////////////////////////////////////////////////////
                  select 0 cobz_id,
                           fv.fv_id,
                           fvd_id,
                           fvd_fecha Fecha,
                           doc_nombre,
                           fv_nrodoc nroDoc,
                           fvd_pendiente Pendiente
                    from FacturaVenta fv
                           join FacturaVentaDeuda fvd
                            on fv.fv_id = fvd.fv_id
                           join Documento d
                            on fv.doc_id = d.doc_id
                     where fv.cli_id = v_cli_id
                             and fv.est_id <> 7
                             -- empresa
                             and d.emp_id = p_emp_id
                             and fv.doct_id = 7
                             /* notas de credito */
                             and not exists ( select fvd_id
                                              from FacturaVentaNotaCredito
                                              where fvd_id_notaCredito = fvd.fvd_id
                                                and fv_id_factura = p_fv_id )
                             and round(fvd_pendiente, 2) > 0
                  union

                  select cobz_id,
                         0 fv_id,
                         0 fvd_id,
                         cobz_fecha Fecha,
                         doc_nombre,
                         cobz_nrodoc nroDoc,
                         cobz_pendiente Pendiente
                  from Cobranza cobz
                  join Documento d
                   on cobz.doc_id = d.doc_id
                  where cli_id = v_cli_id
                    and cobz.est_id <> 7
                    -- empresa
                    and d.emp_id = p_emp_id
                    and not exists ( select cobz_id
                                     from FacturaVentaCobranza
                                     where cobz_id = cobz.cobz_id
                                       and fv_id = p_fv_id )
                    and round(cobz_pendiente, 2) > 0
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
                  select fvi.fvi_id,
                         fvi.pr_id,
                         p.pr_nombreVenta,
                         fvi.fvi_pendiente,
                         fvi.fvi_cantidadARemitir - fvi.fvi_pendiente aplicado,
                         fvi.fvi_orden
                  from FacturaVentaItem fvi
                           join Producto p
                            on fvi.pr_id = p.pr_id
                  where fvi.fv_id = p_fv_id
                  order by fvi.fvi_orden;

            else

               --///////////////////////////////////////////////////////////////////////////////////////////////////////
               --
               -- aplicaciones pedidos y remitos - sp_col PedidoFacturaVenta
               --
               --///////////////////////////////////////////////////////////////////////////////////////////////////////
               if p_tipo = 5 then

                  open rtn for
                     select fvi.fvi_id,
                            fvi.pr_id,
                            pvi.pv_id,
                            pvi.pvi_id,
                            pvfv_id,
                            0 rv_id,
                            0 rvi_id,
                            0 rvfv_id,
                            pvfv_cantidad Aplicado,
                            doc_nombre,
                            pv_nrodoc nrodoc,
                            pv_fecha Fecha,
                            pvi_pendienteFac Pendiente,
                            pvi_orden orden
                  from FacturaVentaItem fvi
                  join PedidoFacturaVenta pvfv
                   on fvi.fvi_id = pvfv.fvi_id
                  join PedidoVentaItem pvi
                   on pvfv.pvi_id = pvi.pvi_id
                  join OrdenVenta oc
                   on pvi.pv_id = pv.pv_id
                  join Documento doc
                   on pv.doc_id = doc.doc_id
                  where fvi.fv_id = p_fv_id

                  union

                  select fvi.fvi_id,
                         fvi.pr_id,
                         0 pv_id,
                         0 pvi_id,
                         0 pvfv_id,
                         rvi.rv_id,
                         rvi.rvi_id,
                         rvfv_id,
                         rvfv_cantidad Aplicado,
                         doc_nombre,
                         rv_nrodoc nrodoc,
                         rv_fecha Fecha,
                         rvi_pendienteFac Pendiente,
                         rvi_orden orden
                  from FacturaVentaItem fvi
                  join RemitoFacturaVenta rvfv
                   on fvi.fvi_id = rvfv.fvi_id
                  join RemitoVentaItem rvi
                   on rvfv.rvi_id = rvi.rvi_id
                  join RemitoVenta rv
                   on rvi.rv_id = rv.rv_id
                  join Documento doc
                   on rv.doc_id = doc.doc_id
                  where fvi.fv_id = p_fv_id

                  order by Fecha,
                           nrodoc,
                           orden;


               else

                  --////////////////////////////////////////////////////////////////////////////////////////////////////
                  --
                  -- aplicaciones posibles (pedidos y remitos)   sp_col PedidoFacturaVenta
                  --
                  --////////////////////////////////////////////////////////////////////////////////////////////////////
                  if p_tipo = 6 then

                     open rtn for
                        select pvi.pr_id,
                               pvi.pv_id,
                               pvi_id,
                               0 rv_id,
                               0 rvi_id,
                               doc_nombre,
                               pv_nrodoc nrodoc,
                               pv_fecha Fecha,
                               pvi_pendienteFac Pendiente,
                               pvi_orden orden
                        from FacturaVentaItem fvi
                        join FacturaVenta fv
                         on fvi.fv_id = fv.fv_id
                        join OrdenVenta oc
                         on fv.cli_id = pv.cli_id and pv.doct_id = 5 and pv.est_id <> 7
                        join Documento doc
                         on pv.doc_id = doc.doc_id
                        join PedidoVentaItem pvi
                         on pv.pv_id = pvi.pv_id and fvi.pr_id = pvi.pr_id
                        where fvi.fv_id = p_fv_id
                          -- empresa
                          and doc.emp_id = p_emp_id
                          and pvi_pendienteFac > 0
                          -- el pedido de venta item no tiene que estar vinculado
                          -- con ningun item de esta factura
                          --
                          and not exists ( select *
                                           from PedidoFacturaVenta pvfv
                                           join FacturaVentaItem fvi
                                            on pvfv.fvi_id = fvi.fvi_id
                                           where pvi_id = pvi.pvi_id
                                             and fv_id = fv.fv_id )
                        union

                        select rvi.pr_id,
                               0 pv_id,
                               0 pvi_id,
                               rvi.rv_id,
                               rvi_id,
                               doc_nombre,
                               rv_nrodoc nrodoc,
                               rv_fecha Fecha,
                               rvi_pendienteFac Pendiente,
                               rvi_orden orden
                        from FacturaVentaItem fvi
                        join FacturaVenta fv
                         on fvi.fv_id = fv.fv_id
                        join RemitoVenta rv
                         on fv.cli_id = rv.cli_id and rv.doct_id = 3 and rv.est_id <> 7
                        join Documento doc
                         on rv.doc_id = doc.doc_id
                        join RemitoVentaItem rvi
                         on rv.rv_id = rvi.rv_id and fvi.pr_id = rvi.pr_id
                        where fvi.fv_id = p_fv_id
                                 -- empresa
                                 and doc.emp_id = p_emp_id
                                 and rvi_pendienteFac > 0
                                 -- el remito venta item no tiene que estar vinculado
                                 -- con ningun item de esta factura
                                 --
                                 and not exists ( select *
                                                  from RemitoFacturaVenta rvfv
                                                  join FacturaVentaItem fvi
                                                   on rvfv.fvi_id = fvi.fvi_id
                                                  where rvi_id = rvi.rvi_id
                                                    and fv_id = fv.fv_id )

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
alter function sp_doc_factura_venta_get_aplic(integer, integer, integer)
  owner to postgres;