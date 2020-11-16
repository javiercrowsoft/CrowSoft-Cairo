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
-- Function: frRetencionGanancias(integer)

-- drop function frRetencionGanancias(integer);

/*

select max(cobz_id) from cobranza;
select * from frRetencionGanancias(980);
fetch all from rtn;

*/
create or replace function frRetencionGanancias
(
 in p_opg_id integer,
 out rtn refcursor
)
 returns refcursor as
$BODY$
declare
 v_success integer;
 v_error_msg varchar(5000);

 v_count 				integer;

 v_pago_anterior	decimal(18,6);
 v_opg_total 			 decimal(18,6);

 v_emp_id 		integer;
 v_prov_id  integer;
 v_fdesde   timestamp with time zone;
 v_fhasta   timestamp with time zone;
 v_dia      integer;

 v_percepcion		decimal(18,6);

 v_emp_razonsocial varchar(255);
 v_emp_cuit        varchar(255);

begin

   rtn := 'rtn';

   --/////////////////////////////////////////////////////////////////////////////////////////////////////
   --
   --
   --	solo soportamos una retencion
   --
   --
   --/////////////////////////////////////////////////////////////////////////////////////////////////////

   select count(*) into v_count
   from OrdenPagoItem opgi
         inner join retencion ret on opgi.ret_id = ret.ret_id
         inner join RetencionTipo rett on ret.rett_id = rett.rett_id
   where opgi.opg_id = p_opg_id
     and ret_esiibb = 0
     and rett_tipo = 3;
   
   v_count := coalesce(v_count,0);
   if v_count > 1 then
   
     raise exception '@@ERROR_SP: %',
      'El sistema no puede imprimir comprobantes de retencion de ordenes de pago que tienen mas de un item de retencion de ganancias.';

   end if;
   
   --/////////////////////////////////////////////////////////////////////////////////////////////////////
   --
   --
   --	cabecera
   --
   --
   --/////////////////////////////////////////////////////////////////////////////////////////////////////

   select emp_id, opg_total, opg_fecha, prov_id
     into v_emp_id, v_opg_total, v_fhasta, v_prov_id
   from OrdenPago where opg_id = p_opg_id;

   select emp_razonsocial, emp_cuit
     into v_emp_razonsocial, v_emp_cuit
   from Empresa where emp_id = v_emp_id;
   
   --/////////////////////////////////////////////////////////////////////////////////////////////////////
   --
   --
   --	pagos en el periodo
   --
   --
   --/////////////////////////////////////////////////////////////////////////////////////////////////////
   
   v_dia := day(v_fhasta);
   
   set v_fdesde = dateadd(d,-v_dia+1,v_fhasta)
   
   declare v_aplicado decimal(18,6)
   
   select v_aplicado = sum(fcopg_importe
    - (fc_ivari  * (fcopg_importe / fc_total))
    - (fc_ivarni * (fcopg_importe / fc_total))
    )
   from FacturaCompraOrdenPago fcopg inner join FacturaCompra fc on fcopg.fc_id   = fc.fc_id
                                     inner join OrdenPago  opg   on fcopg.opg_id  = opg.opg_id
                                     inner join Documento d      on fc.doc_id     = d.doc_id
   where opg_fecha between v_fdesde and v_fhasta
     and opg.prov_id = v_prov_id
     and d.emp_id    = v_emp_id
     and opg.opg_id <> p_opg_id
   
     -- Esto no me gusta, pero no lo vamos a tocar por ahora.
     --
     -- Supuestamente es para notas de debito por cheque rechazado
     -- pero no estoy muy conforme con esta solucion,
     -- ya que si la factura contiene varios items y uno solo es
     -- exento de retenciones, no la tomo en cuenta en su totalidad
     -- y eso no esta bien.
     --
     -- Ademas, ibc es ingresos brutos categoria, y lo estamos usando
     -- para las retenciones de ganancias, asi que no esta para nada
     -- prolijo, ya veremos si lo cambiamos
     --
     and not exists(select *
                    from facturacompraitem fci inner join producto pr on fci.pr_id = pr.pr_id
                    where pr.ibc_id = 1 -- Exento
                      and fci.fc_id = fc.fc_id
    )
   
   set v_aplicado = coalesce(v_aplicado,0)
   
   -- Obtengo cuanto hay de percepciones en estas facturas
   --
   select v_percepcion = sum(fcperc_importe * (fcopg_importe / fc_total))
   
   from FacturaCompraOrdenPago fcopg inner join FacturaCompra fc 						on fcopg.fc_id   = fc.fc_id
                                     inner join OrdenPago  opg   						on fcopg.opg_id  = opg.opg_id
                                     inner join Documento d      						on fc.doc_id     = d.doc_id
                                     inner join FacturaCompraPercepcion fcp	on fc.fc_id      = fcp.fc_id
   where opg_fecha between v_fdesde and v_fhasta
     and opg.prov_id = v_prov_id
     and d.emp_id = v_emp_id
     and opg.opg_id <> p_opg_id
   
     -- Esto no me gusta, pero no lo vamos a tocar por ahora.
     --
     -- Supuestamente es para notas de debito por cheque rechazado
     -- pero no estoy muy conforme con esta solucion,
     -- ya que si la factura contiene varios items y uno solo es
     -- exento de retenciones, no la tomo en cuenta en su totalidad
     -- y eso no esta bien.
     --
     -- Ademas, ibc es ingresos brutos categoria, y lo estamos usando
     -- para las retenciones de ganancias, asi que no esta para nada
     -- prolijo, ya veremos si lo cambiamos
     --
     and not exists(select *
                    from facturacompraitem fci inner join producto pr on fci.pr_id = pr.pr_id
                    where pr.ibc_id = 1 -- Exento
                      and fci.fc_id = fc.fc_id
    )
   
   
   set v_percepcion = coalesce(v_percepcion,0)
   
   -- Los anticipos no tienen iva
   --
   declare v_anticipo decimal(18,6)
   
   select v_anticipo = sum(opg_pendiente)
   from OrdenPago c inner join Documento d on c.doc_id = d.doc_id
   where opg_fecha between v_fdesde and v_fhasta
     and prov_id  = v_prov_id
     and d.emp_id = v_emp_id
     and c.est_id <> 7
     and c.opg_id <> p_opg_id
   
   set v_anticipo = coalesce(v_anticipo,0)
   
   set v_pago_anterior  = coalesce(v_aplicado + v_anticipo - v_percepcion,0)
   set v_percepcion 		= coalesce(v_percepcion,0)
   
   --/////////////////////////////////////////////////////////////////////////////////////////////////////
   --
   --
   --	ORDEN DE PAGO
   --
   --
   --/////////////////////////////////////////////////////////////////////////////////////////////////////
   
   ------------------------------------------------------------------------------
   -- Retencion
   --
   declare v_ret_nombre   varchar(255)
    declare v_alicuota 		decimal(18,6)
    declare v_minimo       decimal(18,6)
    declare v_ret_id 			int
    declare v_ret_nrodoc		varchar(255)
    declare v_retenido_opg decimal(18,6)
       declare v_ret_importeminimo decimal(18,6)
   
   select 	v_ret_id     		= opgi.ret_id,
           v_ret_nrodoc 		= opgi_nroRetencion,
           v_retenido_opg		= opgi_importe,
           v_ret_nombre			= ret_nombre,
           v_ret_importeminimo = ret_importeminimo
   
   from OrdenPagoItem opgi
         inner join retencion ret on opgi.ret_id = ret.ret_id
         inner join RetencionTipo rett on ret.rett_id = rett.rett_id
   where opgi.opg_id = p_opg_id
     and ret_esiibb = 0
     and rett_tipo = 3
   
   ------------------------------------------------------------------------------
   -- Aplicado
   --
   set v_aplicado = 0
   
   select v_aplicado = sum(fcopg_importe
    - (fc_ivari  * (fcopg_importe / fc_total))
    - (fc_ivarni * (fcopg_importe / fc_total))
    )
   from FacturaCompraOrdenPago fcopg inner join FacturaCompra fc on fcopg.fc_id = fc.fc_id
   where fcopg.opg_id = p_opg_id
     and not exists(select *
                    from facturacompraitem fci inner join producto pr on fci.pr_id = pr.pr_id
                    where pr.ibc_id = 1 -- Exento
                      and fci.fc_id = fc.fc_id
    )
   
   -- Obtengo cuanto hay de percepciones en estas facturas
   --
   select v_percepcion = sum(fcperc_importe * (fcopg_importe / fc_total))
   
   from FacturaCompraOrdenPago fcopg inner join FacturaCompra fc 						on fcopg.fc_id   = fc.fc_id
                                     inner join FacturaCompraPercepcion fcp	on fc.fc_id      = fcp.fc_id
   where fcopg.opg_id = p_opg_id
     and not exists(select *
                    from facturacompraitem fci inner join producto pr on fci.pr_id = pr.pr_id
                    where pr.ibc_id = 1 -- Exento
                      and fci.fc_id = fc.fc_id
    )
   
   set v_percepcion = coalesce(v_percepcion,0)
   
   set v_aplicado = v_aplicado - v_percepcion + v_pago_anterior
   
   ------------------------------------------------------------------------------
   -- Minimo
   --
   select v_minimo 		= reti_importedesde,
          v_alicuota	= reti_porcentaje
   
   from RetencionItem
   where ret_id = v_ret_id
     and v_aplicado between reti_importedesde and reti_importehasta
   
   
   set v_minimo = v_minimo - v_pago_anterior
   
   declare v_resto decimal(18,6)
     if v_minimo < 0 begin
   set v_resto = v_minimo*-1
    if (v_resto * v_alicuota /100) >= v_ret_importeminimo
   set v_resto = 0
   end
    else	set v_resto = 0
   
   ------------------------------------------------------------------------------
   -- Facturas
   --
   declare v_imponible decimal(18,6)
    declare v_retenido  decimal(18,6)
    declare v_base			 decimal(18,6)
   
     declare v_facturas varchar(8000)
   set v_facturas = ''
   
   create table #t_facturas(		opg_id    int not null,
                              fc_id 		int not null,
                              neto 			decimal(18,6) not null default(0),
    imponible decimal(18,6) not null default(0),
    retencion decimal(18,6) not null default(0)
    )
   declare c_fac insensitive cursor for
    select
     fcopg.fc_id,
     fc_neto,
     sum(fcopg_importe
      - (fc_ivari  * (fcopg_importe / fc_total))
      - (fc_ivarni * (fcopg_importe / fc_total))
      - (fc_totalpercepciones * (fcopg_importe / fc_total))
      )
   
    from FacturaCompraOrdenPago fcopg inner join FacturaCompra fc on fcopg.fc_id = fc.fc_id
    where fcopg.opg_id = p_opg_id
      and not exists(select *
                     from facturacompraitem fci inner join producto pr on fci.pr_id = pr.pr_id
                     where pr.ibc_id = 1 -- Exento
                       and fci.fc_id = fc.fc_id
     )
    group by fcopg.fc_id, fc_neto
   
   declare v_fc_id		int,
        v_fc_neto	decimal(18,6)
   
    open c_fac
   
   fetch next from c_fac into v_fc_id, v_fc_neto, v_aplicado
    while v_v_fetch_status = 0
   begin
   
   if v_minimo > 0 begin
   
   set v_imponible = v_aplicado - v_minimo
   set v_minimo    = v_minimo   - v_aplicado
   
   end
    else set v_imponible = v_aplicado + v_resto
   
   set v_resto = 0
   
    if v_imponible > 0 begin
   
   set v_facturas = v_facturas +
    +char(13)+char(13)
    +'fc_id: ' + convert(varchar,v_fc_id)
    +' neto: ' + convert(varchar,v_fc_neto)
    +' imponible: ' + convert(varchar,v_imponible)
    +' retencion: ' + convert(varchar,coalesce(v_imponible*v_alicuota/100,0))
    +' aplicado: ' + convert(varchar,v_aplicado)
    +' minimo: ' + convert(varchar,v_minimo)
    +char(13)+char(13)
   
   insert into #t_facturas (opg_id, fc_id, neto, imponible, retencion)
   values  (p_opg_id, v_fc_id, v_fc_neto, v_imponible, coalesce(v_imponible*v_alicuota/100,0))
   
   end
   
   fetch next from c_fac into v_fc_id, v_fc_neto, v_aplicado
   end
   close c_fac
   deallocate c_fac
   
   select v_retenido = sum(retencion), v_base = sum(imponible)
   from #t_facturas
   
   set v_retenido = coalesce(v_retenido,0)
   
    if abs(v_retenido - v_retenido_opg)>0.01 begin
   
   set v_error_msg =
    '@@ERROR_SP:Error al generar el reporte.'
    +char(13)+char(13)
    + 'Se encontro una diferencia entre el reporte generado y la retencion que figura en al orden de pago'
    +char(13)+char(13)
    +'dif: ' + convert(varchar,convert(decimal(18,2),abs(round(v_retenido,2) - round(v_retenido_opg,2))))
    +char(13)+char(13)
    +'OP: ' + convert(varchar,convert(decimal(18,2),v_retenido_opg))
    +char(13)+char(13)
    +'RPT: ' + convert(varchar,convert(decimal(18,2),v_retenido))
    +char(13)+char(13)
    +'base: ' + convert(varchar,convert(decimal(18,2),v_base))
    +char(13)+char(13)
    +'ret_id: ' + convert(varchar,v_ret_id)
    +char(13)+char(13)
    +'ret_id: ' + convert(varchar,v_alicuota)
    +char(13)+char(13)
    +'pago anterior: ' + convert(varchar,v_pago_anterior)
    +char(13)+char(13)
    + v_facturas
   
    raiserror (v_error_msg, 16, 1) -- :) sefini
    return
   
   end
   
   --/////////////////////////////////////////////////////////////////////////////////////////////////////
   --
   --
   --	DATOS DE LA EMPRESA
   --
   --
   --/////////////////////////////////////////////////////////////////////////////////////////////////////
   
   declare v_emp_direccion varchar(2000)
   
   select v_emp_direccion = emp_calle + ' '
    + emp_callenumero + ' '
    + emp_localidad
    + '('+ emp_codpostal +')'
   from empresa
   where emp_id = v_emp_id
   
   --/////////////////////////////////////////////////////////////////////////////////////////////////////
   --
   --
   --	SELECT DE RETORNO
   --
   --
   --/////////////////////////////////////////////////////////////////////////////////////////////////////
   
   select 	1                as orden_id,
           v_emp_razonsocial as [Razon Social],
        v_emp_cuit				 as CUIT,
        v_emp_direccion	 as [Empresa direccion],
        v_ret_nrodoc			 as ret_nrodoc,
        v_ret_nombre			 as ret_nombre,
        opg_fecha,
        prov_razonsocial,
        prov_cuit,
   
        prov_calle + ' ' + prov_callenumero + ' '
             + prov_localidad + '('+ prov_codpostal +')' as direccion,
   
        pro_nombre,
   
        /* Facturas */
   
        fc_nrodoc,
        fc_fecha,
   
        tfc.imponible		as Base,
   
        case fc.doct_id
         when 2		then 'FC'
         when 8		then 'NC'
         when 10		then 'ND'
   end		as [Tipo Comp.],
   
        tfc.retencion 		as Retencion,
        v_alicuota					as alicuota,
        opg_descrip
   
    from OrdenPago opg 			inner join Proveedor prov 			on opg.prov_id 	= prov.prov_id
                inner join #t_facturas tfc      on opg.opg_id   = tfc.opg_id
                inner join FacturaCompra fc 		on tfc.fc_id 		= fc.fc_id
                left  join Provincia pro    		on prov.pro_id 	= pro.pro_id
   
    where opg.opg_id = p_opg_id
   
   end


end;
$BODY$
 language plpgsql volatile
                  cost 100;
alter function frRetencionGanancias(integer)
 owner to postgres;
