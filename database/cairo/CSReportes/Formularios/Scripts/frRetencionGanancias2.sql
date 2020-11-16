USE [cairoSDI]
GO
/****** Object:  StoredProcedure [dbo].[frRetencionGanancias2]    Script Date: 11/16/2020 11:22:00 AM ******/
SET ANSI_NULLS ON
 GO
SET QUOTED_IDENTIFIER ON
 GO

ALTER procedure [dbo].[frRetencionGanancias2] (

 @@opg_id			int

 )as

begin

set nocount on

--/////////////////////////////////////////////////////////////////////////////////////////////////////
--
--
--	SOLO SOPORTAMOS UNA RETENCION
--
--
--/////////////////////////////////////////////////////////////////////////////////////////////////////

declare @count 				int
	declare @error_msg 		varchar(500)

select @count = count(*)
from OrdenPagoItem opgi inner join retencion ret on opgi.ret_id = ret.ret_id
where opgi.opg_id = @@opg_id
  and ret_esiibb = 0

set @count = isnull(@count,0)
 if @count > 1 begin

set @error_msg =
 '@@ERROR_SP:El sistema no puede imprimir comprobantes de retencion de ordenes de pago que tienen mas de un item de retencion de ganancias.'
 raiserror (@error_msg, 16, 1) -- :) sefini
 return

end

--/////////////////////////////////////////////////////////////////////////////////////////////////////
--
--
--	CABECERA
--
--
--/////////////////////////////////////////////////////////////////////////////////////////////////////

-- Cabecera
--
declare @pago_anterior	decimal(18,6)
	declare @opg_total 			decimal(18,6)

	declare @emp_id 		int
	declare @prov_id  	int

	declare @fdesde 			datetime
	declare @fhasta 			datetime
	declare @dia      		int
	declare @percepcion		decimal(18,6)

select  @emp_id    	= emp_id,
        @opg_total	= opg_total,
        @fhasta  		= opg_fecha,
        @prov_id 		=	prov_id

from OrdenPago where opg_id = @@opg_id

declare @emp_razonsocial varchar(255)
	declare @emp_cuit        varchar(255)

select  @emp_razonsocial 	= emp_razonsocial,
        @emp_cuit 				= emp_cuit

from Empresa where emp_id = @emp_id

--/////////////////////////////////////////////////////////////////////////////////////////////////////
--
--
--	PAGOS EN EL PERIODO
--
--
--/////////////////////////////////////////////////////////////////////////////////////////////////////

set @dia = day(@fhasta)
set @fdesde = dateadd(DAY,-@dia+1,@fhasta)
set @fhasta = dateadd(MONTH,1,@fhasta)
set @fhasta = dateadd(DAY,-@dia,@fhasta)

declare @aplicado decimal(18,6)

select @aplicado = sum(fcopg_importe
 - (fc_ivari  * (fcopg_importe / fc_total))
 - (fc_ivarni * (fcopg_importe / fc_total))
 )
from FacturaCompraOrdenPago fcopg inner join FacturaCompra fc on fcopg.fc_id   = fc.fc_id
                                  inner join OrdenPago  opg   on fcopg.opg_id  = opg.opg_id
                                  inner join Documento d      on fc.doc_id     = d.doc_id
where opg_fecha between @fdesde and @fhasta
  and opg.prov_id = @prov_id
  and d.emp_id    = @emp_id
  and opg.opg_id <> @@opg_id

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

set @aplicado = IsNull(@aplicado,0)

-- Obtengo cuanto hay de percepciones en estas facturas
--
select @percepcion = sum(fcperc_importe * (fcopg_importe / fc_total))

from FacturaCompraOrdenPago fcopg inner join FacturaCompra fc 						on fcopg.fc_id   = fc.fc_id
                                  inner join OrdenPago  opg   						on fcopg.opg_id  = opg.opg_id
                                  inner join Documento d      						on fc.doc_id     = d.doc_id
                                  inner join FacturaCompraPercepcion fcp	on fc.fc_id      = fcp.fc_id
where opg_fecha between @fdesde and @fhasta
  and opg.prov_id = @prov_id
  and d.emp_id = @emp_id
  and opg.opg_id <> @@opg_id

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


set @percepcion = IsNull(@percepcion,0)

-- Los anticipos no tienen iva
--
declare @anticipo decimal(18,6)

select @anticipo = sum(opg_pendiente)
from OrdenPago c inner join Documento d on c.doc_id = d.doc_id
where opg_fecha between @fdesde and @fhasta
  and prov_id  = @prov_id
  and d.emp_id = @emp_id
  and c.est_id <> 7
  and c.opg_id <> @@opg_id

set @anticipo = IsNull(@anticipo,0)

set @pago_anterior  = IsNull(@aplicado + @anticipo - @percepcion,0)
set @percepcion 		= IsNull(@percepcion,0)

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
declare @ret_nombre   varchar(255)
	declare @alicuota 		decimal(18,6)
	declare @minimo       decimal(18,6)
	declare @ret_id 			int
	declare @ret_nrodoc		varchar(255)
	declare @retenido_opg decimal(18,6)

select 	@ret_id     		= opgi.ret_id,
        @ret_nrodoc 		= opgi_nroRetencion,
        @retenido_opg		= opgi_importe,
        @ret_nombre			= ret_nombre

from OrdenPagoItem opgi inner join retencion ret on opgi.ret_id = ret.ret_id
where opgi.opg_id = @@opg_id
  and ret_esiibb = 0

------------------------------------------------------------------------------
-- Aplicado
--
set @aplicado = 0

select @aplicado = sum(fcopg_importe
 - (fc_ivari  * (fcopg_importe / fc_total))
 - (fc_ivarni * (fcopg_importe / fc_total))
 )
from FacturaCompraOrdenPago fcopg inner join FacturaCompra fc on fcopg.fc_id = fc.fc_id
where fcopg.opg_id = @@opg_id
  and not exists(select *
                 from facturacompraitem fci inner join producto pr on fci.pr_id = pr.pr_id
                 where pr.ibc_id = 1 -- Exento
                   and fci.fc_id = fc.fc_id
 )

-- Obtengo cuanto hay de percepciones en estas facturas
--
select @percepcion = sum(fcperc_importe * (fcopg_importe / fc_total))

from FacturaCompraOrdenPago fcopg inner join FacturaCompra fc 						on fcopg.fc_id   = fc.fc_id
                                  inner join FacturaCompraPercepcion fcp	on fc.fc_id      = fcp.fc_id
where fcopg.opg_id = @@opg_id
  and not exists(select *
                 from facturacompraitem fci inner join producto pr on fci.pr_id = pr.pr_id
                 where pr.ibc_id = 1 -- Exento
                   and fci.fc_id = fc.fc_id
 )

set @percepcion = IsNull(@percepcion,0)

set @aplicado = @aplicado - @percepcion + @pago_anterior

------------------------------------------------------------------------------
-- Minimo
--
select @minimo 		= reti_importedesde,
       @alicuota	= reti_porcentaje

from RetencionItem
where ret_id = @ret_id
  and @aplicado between reti_importedesde and reti_importehasta


set @minimo = @minimo - @pago_anterior

------------------------------------------------------------------------------
-- Facturas
--
declare @imponible decimal(18,6)
	declare @retenido  decimal(18,6)
	declare @base			 decimal(18,6)

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
 where fcopg.opg_id = @@opg_id
   and not exists(select *
                  from facturacompraitem fci inner join producto pr on fci.pr_id = pr.pr_id
                  where pr.ibc_id = 1 -- Exento
                    and fci.fc_id = fc.fc_id
  )
 group by fcopg.fc_id, fc_neto

declare @fc_id		int,
					@fc_neto	decimal(18,6)

	open c_fac

fetch next from c_fac into @fc_id, @fc_neto, @aplicado
	while @@fetch_status = 0
begin

if @minimo > 0 begin

set @imponible = @aplicado - @minimo
set @minimo    = @minimo   - @aplicado

end
 else set @imponible = @aplicado

 if @imponible > 0 begin

insert into #t_facturas (opg_id, fc_id, neto, imponible, retencion)
values  (@@opg_id, @fc_id, @fc_neto, @imponible, isnull(@imponible*@alicuota/100,0))

end

fetch next from c_fac into @fc_id, @fc_neto, @aplicado
end
close c_fac
deallocate c_fac

select @retenido = sum(retencion), @base = sum(imponible)
from #t_facturas

set @retenido = isnull(@retenido,0)

 if abs(@retenido - @retenido_opg)>0.01 begin

-- Veo si la retencion tiene indicada una factura explicitamente
--
if not exists(select *
									from OrdenPagoItem opgi inner join retencion ret on opgi.ret_id = ret.ret_id
									where opgi.opg_id = @@opg_id
										and ret_esiibb = 0
										and fc_id_ret is null
									)
		begin

delete #t_facturas

insert into #t_facturas (opg_id, fc_id, neto, imponible, retencion)
select  @@opg_id,
        fc_id,
        fc_neto,
        opgi_importe / (opgi_porcRetencion / 100),
        opgi_importe
from OrdenPagoItem opgi inner join retencion ret on opgi.ret_id = ret.ret_id
                        inner join FacturaCompra fc on opgi.fc_id_ret = fc.fc_id
where opgi.opg_id = @@opg_id
  and ret_esiibb = 0
  and fc_id_ret is not null

end else begin

set @error_msg =
 '@@ERROR_SP:El sistema fallo al generar el reporte de retencion de ganancias.'
 +char(13)+char(13)
 + 'Se encontro una diferencia entre el reporte generado y la retencion que figura en al orden de pago'
 +char(13)+char(13)
 +'dif: ' + convert(varchar,convert(decimal(18,2),abs(round(@retenido,2) - round(@retenido_opg,2))))
 +char(13)+char(13)
 +'OP: ' + convert(varchar,convert(decimal(18,2),@retenido_opg))
 +char(13)+char(13)
 +'RPT: ' + convert(varchar,convert(decimal(18,2),@retenido))
 +char(13)+char(13)
 +'base: ' + convert(varchar,convert(decimal(18,2),@base))

 raiserror (@error_msg, 16, 1) -- :) sefini
 return

end

end

--/////////////////////////////////////////////////////////////////////////////////////////////////////
--
--
--	DATOS DE LA EMPRESA
--
--
--/////////////////////////////////////////////////////////////////////////////////////////////////////

declare @emp_direccion varchar(2000)

select @emp_direccion = emp_calle + ' '
 + emp_callenumero + ' '
 + emp_localidad
 + '('+ emp_codpostal +')'
from empresa
where emp_id = @emp_id

--/////////////////////////////////////////////////////////////////////////////////////////////////////
--
--
--	SELECT DE RETORNO
--
--
--/////////////////////////////////////////////////////////////////////////////////////////////////////

select 	1                as orden_id,
        @emp_razonsocial as [Razon Social],
					@emp_cuit				 as CUIT,
					@emp_direccion	 as [Empresa direccion],
					@ret_nrodoc			 as ret_nrodoc,
					@ret_nombre			 as ret_nombre,
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
					@alicuota					as alicuota,
					opg_descrip

	from OrdenPago opg 			inner join Proveedor prov 			on opg.prov_id 	= prov.prov_id
													inner join #t_facturas tfc      on opg.opg_id   = tfc.opg_id
													inner join FacturaCompra fc 		on tfc.fc_id 		= fc.fc_id
													left  join Provincia pro    		on prov.pro_id 	= pro.pro_id

	where opg.opg_id = @@opg_id

end

