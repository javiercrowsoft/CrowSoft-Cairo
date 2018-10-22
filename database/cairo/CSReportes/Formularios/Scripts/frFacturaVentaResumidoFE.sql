USE [cairoNT]
GO
/****** Object:  StoredProcedure [dbo].[IC_NRT_frFacturaVentaResumido]    Script Date: 16/10/2018 13:00:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*

select * from facturaventa where fv_numero = 5192

IC_NRT_frFacturaVentaResumido 5192

select * from facturaventaitem where fv_id = 1093

*/

ALTER  procedure [dbo].[IC_NRT_frFacturaVentaResumido] (

	@@fv_id			int

)as

begin

-------------------------------------------------------------------------------------------------------------
--
--	VALIDACIONES FACTURA ELECTRONICA
--
-------------------------------------------------------------------------------------------------------------
if exists(select 1 from FacturaVenta fv inner join Documento doc on fv.doc_id = doc.doc_id
					where fv_id = @@fv_id
						and fv_cae = ''
						and doc_esfacturaelectronica <> 0
					)
begin
	raiserror ('@@ERROR_SP:Esta factura no posee CAE. No sera posible imprimir la factura hasta que no se obtenga el CAE.'
							, 16, 1)
	return
end

-------------------------------------------------------------------------------------------------------------
--
--	PERCEPCIONES
--
-------------------------------------------------------------------------------------------------------------

  declare @perc_ibb decimal(18,6)
  declare @perc_ibb_porc decimal(18,2)

	select @perc_ibb = fvperc_importe,
	       @perc_ibb_porc = fvperc_porcentaje
	from FacturaVentaPercepcion
	where fv_id = @@fv_id
    and perc_id in (select perc_id from Percepcion where perct_id = 6)

  declare @perc_iva decimal(18,6)
  declare @perc_iva_porc decimal(18,2)

	select @perc_iva = fvperc_importe,
	       @perc_iva_porc = fvperc_porcentaje
	from FacturaVentaPercepcion
	where fv_id = @@fv_id
    and perc_id in (select perc_id from Percepcion where perct_id = 1)
-------------------------------------------------------------------------------------------------------------
--
--	CODIGO DE BARRAS
--
-------------------------------------------------------------------------------------------------------------
	declare @cod_barra varchar(255)

	select @cod_barra = replace(emp_cuit,'-','')
			+case
				when fv.doct_id = 1 and substring(fv_nrodoc,1,1) = 'A' then '01'
				when fv.doct_id = 1 and substring(fv_nrodoc,1,1) = 'B' then '06'
				when fv.doct_id = 1 and substring(fv_nrodoc,1,1) = 'E' then '19'
				when fv.doct_id = 7 and substring(fv_nrodoc,1,1) = 'A' then '03'
				when fv.doct_id = 7 and substring(fv_nrodoc,1,1) = 'B' then '08'
				when fv.doct_id = 7 and substring(fv_nrodoc,1,1) = 'E' then '21'
				when fv.doct_id = 9 and substring(fv_nrodoc,1,1) = 'A' then '02'
				when fv.doct_id = 9 and substring(fv_nrodoc,1,1) = 'B' then '07'
				when fv.doct_id = 9 and substring(fv_nrodoc,1,1) = 'E' then '20'
			end
			+ right('0000' + convert(varchar,dbo.FEGetPuntoVta(fv.fv_id)),4)
			+ fv_cae
			+ fv_cae_vto

	from FacturaVenta fv inner join empresa emp on fv.emp_id = emp.emp_id
	where fv.fv_id = @@fv_id

	set @cod_barra = @cod_barra + convert(varchar, dbo.FEGetDigitoVerificador(@cod_barra))

-------------------------------------------------------------------------------------------------------------
--


----------------------------

declare @iva105 decimal(18,6)
declare @iva21 	decimal(18,6)
declare @desc1 	decimal(18,6)
declare @desc2 	decimal(18,6)

	select @desc1 = fv_descuento1,
				 @desc2 = fv_descuento2

	from FacturaVenta
	where fv_id = @@fv_id

	select @iva21 = sum(fvi_ivari)
	from FacturaVentaItem
	where fv_id = @@fv_id and fvi_ivariporc = 21

	select @iva21 = @iva21 - (@iva21 * @desc1/100) - ((@iva21 * @desc1/100) * @desc2/100)

	select @iva105 = sum(fvi_ivari)
	from FacturaVentaItem
	where fv_id = @@fv_id and fvi_ivariporc = 10.5

	select @iva105 = @iva105 - (@iva105 * @desc1/100) - ((@iva105 * @desc1/100) * @desc2/100)

----------------------------

declare @porc_iva decimal(18,6)
declare @coef decimal(18,6)

select @porc_iva = max(fvi_ivariporc) from FacturaVentaItem where fv_id = @@fv_id and fvi_ivariporc < 21

select @coef = case when fv_cotizacion <> 0 then 1/fv_cotizacion else 1 end from facturaventa where fv_id = @@fv_id

	select 	FacturaVenta.doct_id,
					FacturaVenta.fv_id,
					-FacturaVenta.fv_importedesc1 as fv_importedesc1,
					-FacturaVenta.fv_importedesc2 as fv_importedesc2,
					FacturaVenta.fv_ivari,
					FacturaVenta.fv_neto,
					FacturaVenta.fv_total,
					fv_cotizacion,
					fv_descrip,
					fv_fecha,
					sum(fvi_cantidad)					as fvi_cantidad,
					sum(fvi_importe)
					/sum(fvi_cantidad)        as fvi_precio,
					sum(fvi_importe)					as fvi_importe,
					sum(fvi_importeOrigen)		as fvi_importeOrigen,
					sum(fvi_ivari)						as fvi_ivari,
					sum(fvi_ivarni)						as fvi_ivarni,
					cue_nombre,
					doc_nombre,
					ccos_nombre,
					cli_nombre,
					cli_razonsocial,
					cpg_nombre,
					cli_cuit,

			case cli_catfiscal
				when 1 then 'Inscripto'
				when 2 then 'Exento'
				when 3 then 'No inscripto'
				when 4 then 'Consumidor Final'
				when 5 then 'Extranjero'
				when 6 then 'Mono Tributo'
				when 7 then 'Extranjero Iva'
				when 8 then 'No responsable'
				when 9 then 'No Responsable exento'
				when 10 then 'No categorizado'
				when 11 then 'Inscripto M'
        else 'Sin categorizar'
			end as cat_fisctal,

			case cli_catfiscal
				when 1 then 'X'
				else ''
			end as inscripto,

			case cli_catfiscal
				when 2 then 'X'
				else ''
			end as exento,

			case cli_catfiscal
				when 3 then 'X'
				else ''
			end as noinscripto,

			case cli_catfiscal
				when 4 then 'X'
				else ''
			end as consumidorfinal,

			case cli_catfiscal
				when 5 then 'X'
				else ''
			end as extranjero,

			case cli_catfiscal
				when 6 then 'X'
				else ''
			end as monotributo,

			case cli_catfiscal
				when 7 then 'X'
				else ''
			end as extranjeroiva,

			case cli_catfiscal
				when 8 then 'X'
				else ''
			end as noresponsable,

			case cli_catfiscal
				when 9 then 'X'
				else ''
			end as norespexento,

			case cli_catfiscal
				when 10 then 'X'
				else ''
			end as nocategorizado,

--				case
--					when sum(fvi_importe) <> 0 and sum(fvi_importeorigen) <> 0 then  sum(fvi_importeorigen) / sum(fvi_importe)
--          else  1
--      	end
@coef			as coef,

			cli_calle as calle,

			cli_callenumero + ' ' +
			case when cli_piso <> '' then '- piso ' + cli_piso else '' end  + ' ' +
			cli_depto  as direccion,
      cli_localidad +
			case when cli_codpostal <> '' then '-(' + cli_codpostal +')' else '' end 	as cli_localidad,
      lgj_codigo,
      pr_nombreventa,
      mon_signo,
      fv_nrodoc,

			sum (
				case cli_catfiscal
					when 1 then       fvi_precio -- 'Inscripto'
					when 2 then       fvi_precio + (fvi_precio * fvi_ivariporc/100) -- 'Exento'
					when 3 then       fvi_precio -- 'No inscripto'
					when 4 then       fvi_precio + (fvi_precio * fvi_ivariporc/100) -- 'Consumidor Final' sp_col facturaventaitem
					when 5 then       fvi_precio -- 'Extranjero'
					when 6 then       fvi_precio + (fvi_precio * fvi_ivariporc/100) -- 'Mono Tributo'
					when 7 then       fvi_precio + (fvi_precio * fvi_ivariporc/100) -- 'Extranjero Iva'
					when 8 then       fvi_precio + (fvi_precio * fvi_ivariporc/100) -- 'No responsable'
					when 9 then       fvi_precio + (fvi_precio * fvi_ivariporc/100) -- 'No Responsable exento'
					when 10 then      fvi_precio + (fvi_precio * fvi_ivariporc/100) -- 'No categorizado'
	        else              fvi_precio + (fvi_precio * fvi_ivariporc/100) -- 'Sin categorizar'
				end
					)
				/
				sum(fvi_cantidad) as precio,

			sum (
				case cli_catfiscal
					when 1 then       fvi_neto     -- 'Inscripto'
					when 2 then       fvi_importe  -- 'Exento'
					when 3 then       fvi_neto     -- 'No inscripto'
					when 4 then       fvi_importe  -- 'Consumidor Final' sp_col facturaventaitem
					when 5 then       fvi_neto     -- 'Extranjero'
					when 6 then       fvi_importe  -- 'Mono Tributo'
					when 7 then       fvi_importe  -- 'Extranjero Iva'
					when 8 then       fvi_importe  -- 'No responsable'
					when 9 then       fvi_importe  -- 'No Responsable exento'
					when 10 then      fvi_importe  -- 'No categorizado'
	        else              fvi_importe  -- 'Sin categorizar'
				end
					) as importe,

			case cli_catfiscal
				when 1 then       1 -- 'Inscripto'
				when 2 then       0 -- 'Exento'
				when 3 then       1 -- 'No inscripto'
				when 4 then       0 -- 'Consumidor Final' sp_col facturaventaitem
				when 5 then       1 -- 'Extranjero'
				when 6 then       0 -- 'Mono Tributo'
				when 7 then       0 -- 'Extranjero Iva'
				when 8 then       0 -- 'No responsable'
				when 9 then       0 -- 'No Responsable exento'
				when 10 then      0 -- 'No categorizado'
        else              0 -- 'Sin categorizar'
			end as bShowIva,

    @porc_iva as porc_iva,

     isnull(@iva21,0)     as iva21,
     isnull(@iva105,0)     as iva105,


			fv_cae as cae,
			fv_cae_vto as cae_vto,
			--'0005-' + right('00000000'+fv_cae_nrodoc,8) as cae_nrodoc,
			substring(fv_nrodoc,3,100) as cae_nrodoc,
			substring(fv_nrodoc,1,1) as cae_letra,
			/*FACTURA A: Cod 01
				FACTURA B: Cod 06
				NOTA DEB A: Cod 02
				NOTA DEB B: Cod 07
				NOTA CRED A: Cod 03
				NOTA CRED B: Cod 08*/
			case
				when facturaventa.doct_id = 1 and substring(fv_nrodoc,1,1) = 'A' then 'Cod 01'
				when facturaventa.doct_id = 1 and substring(fv_nrodoc,1,1) = 'B' then 'Cod 06'
				when facturaventa.doct_id = 7 and substring(fv_nrodoc,1,1) = 'A' then 'Cod 03'
				when facturaventa.doct_id = 7 and substring(fv_nrodoc,1,1) = 'B' then 'Cod 08'
				when facturaventa.doct_id = 9 and substring(fv_nrodoc,1,1) = 'A' then 'Cod 02'
				when facturaventa.doct_id = 9 and substring(fv_nrodoc,1,1) = 'B' then 'Cod 07'
			end as codigo_letra,
			@cod_barra as cod_barra,
      isnull(@perc_ibb,0) as perc_ibb,
      case when isnull(@perc_ibb_porc,0) <> 0 then 'P.IIBB CF ' + convert(varchar, @perc_ibb_porc) + '%'
           else ''
      end as perc_ibb_porc,
      isnull(@perc_iva,0) as perc_iva,
      case when isnull(@perc_iva_porc,0) <> 0 then 'P. IVA RG 2126 ' + convert(varchar, @perc_iva_porc) + '%'
           else ''
      end as perc_iva_porc

  from FacturaVenta inner join FacturaVentaItem on FacturaVenta.fv_id = FacturaVentaItem.fv_id
               inner join Cuenta        on FacturaVentaItem.cue_id		= Cuenta.cue_id
               inner join Documento     on FacturaVenta.doc_id        = Documento.doc_id
               inner join Cliente       on FacturaVenta.cli_id        = Cliente.cli_id
               inner join CondicionPago on FacturaVenta.cpg_id        = CondicionPago.cpg_id
               inner join Producto      on FacturaVentaItem.pr_id     = Producto.pr_id
               inner join Moneda        on FacturaVenta.mon_id        = Moneda.mon_id
               left join  Legajo        on FacturaVenta.lgj_id        = Legajo.lgj_id
							 left join  CentroCosto on FacturaVentaItem.ccos_id     = CentroCosto.ccos_id
	where FacturaVenta.fv_id = @@fv_id

	group by
					FacturaVenta.doct_id,
					FacturaVenta.fv_id,
					fv_cotizacion,
					fv_descrip,
					fv_fecha,
					FacturaVenta.fv_importedesc1,
					FacturaVenta.fv_importedesc2,
					FacturaVenta.fv_ivari,
					FacturaVenta.fv_neto,
					FacturaVenta.fv_total,
					cue_nombre,
					doc_nombre,
					ccos_nombre,
					cli_nombre,
					cli_razonsocial,
					cpg_nombre,
					cli_cuit,
          mon_signo,
          fv_nrodoc,
					cli_catfiscal,
					cli_calle,
					cli_callenumero + ' ' +
			case when cli_piso <> '' then '- piso ' + cli_piso else '' end  + ' ' +
			cli_depto,
		      cli_localidad +
			case when cli_codpostal <> '' then '-(' + cli_codpostal +')' else '' end,
		      lgj_codigo,
      		pr_nombreventa,
      		pr_codigobarra,
          fv_cae, fv_cae_vto



  order by pr_codigobarra

end
