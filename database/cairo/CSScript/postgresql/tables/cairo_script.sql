alter DATABASE postgres set timezone to 'UTC';

esto esta a proposito para que de un error asi confirmamos que el timezone e sel correcto antes
de crear la base

create table Vuelo (
	vue_id int not null,
	vue_nombre varchar(100) not null,
	vue_codigo varchar(15) not null,
	vue_descrip varchar(255) not null CONSTRAINT DF_Vuelo_vue_descrip  default (''),
	creado timestamptz not null CONSTRAINT DF_Vuelo_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Vuelo_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Vuelo_activo  default (1),
 CONSTRAINT PK_Vuelo PRIMARY KEY  
(
	vue_id 
) 
) 
;

;
/****** Object:  Table HojaRutaCobranzaTipo    Script Date: 07/30/2012 17:13:39 ******/

;

;

;
create table HojaRutaCobranzaTipo(
	hrct_id int not null,
	hrct_nombre varchar(255) not null,
	hrct_codigo varchar(50) not null,
 CONSTRAINT PK_HojaRutaCobranzaTipo PRIMARY KEY  
(
	hrct_id 
) 
) 
;

;
/****** Object:  Table ParteProdKitTMP    Script Date: 07/30/2012 17:20:42 ******/

;

;

;
create table ParteProdKitTMP(
	ppkTMP_id int not null,
	ppk_id int not null,
	ppk_numero int not null,
	ppk_nrodoc varchar(50) not null CONSTRAINT DF_ParteProdKitTMP_ppk_nrodoc  default (''),
	ppk_descrip varchar(5000) not null CONSTRAINT DF_ParteProdKitTMP_ppk_descrip  default (''),
	ppk_fecha timestamptz not null CONSTRAINT DF_ParteProdKitTMP_ppk_fecha  default (getdate()),
	depl_id int not null,
	suc_id int not null,
	lgj_id int null,
	doc_id int not null,
	doct_id int not null,
	creado timestamptz not null CONSTRAINT DF_ParteProdKitTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ParteProdKitTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ParteProdKitTMP PRIMARY KEY  
(
	ppkTMP_id 
) 
) 
;

;
/****** Object:  Table CobranzaTMP    Script Date: 07/30/2012 17:05:56 ******/

;

;

;
create table CobranzaTMP(
	fvTMP_id int not null CONSTRAINT DF_CobranzaTMP_fvTMP_id  default (0),
	cobzTMP_id int not null,
	cobz_id int not null,
	cobz_numero int not null,
	cobz_nrodoc varchar(50) not null CONSTRAINT DF_CobranzaTMP_cobz_nrodoc  default (''),
	cobz_descrip varchar(5000) not null CONSTRAINT DF_CobranzaTMP_cobz_descrip  default (''),
	cobz_fecha timestamptz not null CONSTRAINT DF_CobranzaTMP_cobz_fecha  default (getdate()),
	cobz_neto decimal(18, 6) not null CONSTRAINT DF_CobranzaTMP_cobz_neto  default (0),
	cobz_otros decimal(18, 6) not null CONSTRAINT DF_CobranzaTMP_cobz_otros  default (0),
	cobz_total decimal(18, 6) not null CONSTRAINT DF_CobranzaTMP_cobz_total  default (0),
	cobz_pendiente decimal(18, 6) not null CONSTRAINT DF_CobranzaTMP_cobz_pendiente  default (0),
	cobz_cotizacion decimal(18, 6) not null CONSTRAINT DF_CobranzaTMP_cobz_cotizacion  default (0),
	cobz_grabarAsiento smallint not null CONSTRAINT DF_CobranzaTMP_cobz_grabarAsiento  default (0),
	cobz_firmado int not null CONSTRAINT DF_CobranzaTMP_cobz_firmado  default (0),
	cobz_hojaruta smallint not null CONSTRAINT DF_CobranzaTMP_cobz_hojaruta  default (0),
	est_id int not null,
	suc_id int not null,
	cli_id int not null,
	doc_id int not null,
	cob_id int null,
	ccos_id int null,
	lgj_id int null,
	creado timestamptz not null CONSTRAINT DF_CobranzaTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_CobranzaTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_CobranzaTMP PRIMARY KEY  
(
	cobzTMP_id 
) 
) 
;

;
/****** Object:  Table AjusteInflacionIndice    Script Date: 07/30/2012 17:02:42 ******/

;

;
create table AjusteInflacionIndice(
	ajii_id int not null,
	ajii_fecha timestamptz not null,
	ajii_indice decimal(18, 6) not null,
	creado timestamptz not null CONSTRAINT DF_AjusteInflacionIndice_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_AjusteInflacionIndice_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_AjusteInflacionIndice PRIMARY KEY  
(
	ajii_id 
) 
) 
;
/****** Object:  Table FacturaVentaPercepcionTMP    Script Date: 07/30/2012 17:12:46 ******/

;

;

;
create table FacturaVentaPercepcionTMP(
	fvTMP_id int not null,
	fvpercTMP_id int not null,
	fvperc_id int not null,
	fvperc_orden smallint not null CONSTRAINT DF_FacturaVentaPercepcionTMP_fvperc_orden  default (0),
	fvperc_base decimal(18, 6) not null CONSTRAINT DF_FacturaVentaPercepcionTMP_fvperc_base  default (0),
	fvperc_porcentaje decimal(18, 6) not null CONSTRAINT DF_FacturaVentaPercepcionTMP_fvperc_porcentaje  default (0),
	fvperc_importe decimal(18, 6) not null CONSTRAINT DF_FacturaVentaPercepcionTMP_fvperc_importe  default (0),
	fvperc_origen decimal(18, 6) not null CONSTRAINT DF_FacturaVentaPercepcionTMP_fvperc_origen  default (0),
	fvperc_descrip varchar(255) not null CONSTRAINT DF_FacturaVentaPercepcionTMP_fvperc_descrip  default (''),
	perc_id int not null,
	ccos_id int null,
 CONSTRAINT PK_FacturaVentaPercepcionTMP PRIMARY KEY  
(
	fvpercTMP_id 
) 
) 
;

;
/****** Object:  Table FacturaVentaCajeroLog    Script Date: 07/30/2012 17:12:12 ******/

;

;
create table FacturaVentaCajeroLog(
	fvcj_id int not null,
	fv_id int not null,
	fvcj_ctacte smallint not null CONSTRAINT DF_FacturaVentaCajeroLog_fvcj_ctacte  default (0),
	cj_id int not null,
 CONSTRAINT PK_FacturaVentaCajeroLog PRIMARY KEY  
(
	fvcj_id 
) 
) 
;
/****** Object:  Table AsientoTMP    Script Date: 07/30/2012 17:03:32 ******/

;

;

;
create table AsientoTMP(
	asTMP_id int not null,
	as_id int not null,
	as_numero int not null,
	as_nrodoc varchar(50) not null CONSTRAINT DF_AsientoTMP_as_nrodoc  default (''),
	as_descrip varchar(5000) not null CONSTRAINT DF_AsientoTMP_as_descrip  default (''),
	as_fecha timestamptz not null CONSTRAINT DF_AsientoTMP_as_fecha  default (getdate()),
	doc_id int not null,
	doct_id int not null,
	creado timestamptz not null CONSTRAINT DF_AsientoTMP_creado_1  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_AsientoTMP_modificado_1  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_AsientoTMP PRIMARY KEY  
(
	asTMP_id 
) 
) 
;

;
/****** Object:  Table OrdenProdKitTMP    Script Date: 07/30/2012 17:18:49 ******/

;

;

;
create table OrdenProdKitTMP(
	opkTMP_id int not null,
	opk_id int not null,
	opk_numero int not null,
	opk_nrodoc varchar(50) not null CONSTRAINT DF_OrdenProdKitTMP_opk_nrodoc  default (''),
	opk_descrip varchar(5000) not null CONSTRAINT DF_OrdenProdKitTMP_opk_descrip  default (''),
	opk_fecha timestamptz not null CONSTRAINT DF_OrdenProdKitTMP_opk_fecha  default (getdate()),
	depl_id int not null,
	suc_id int not null,
	lgj_id int null,
	doc_id int not null,
	doct_id int not null,
	creado timestamptz not null CONSTRAINT DF_OrdenProdKitTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_OrdenProdKitTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_OrdenProdKitTMP PRIMARY KEY  
(
	opkTMP_id 
) 
) 
;

;
/****** Object:  Table CategoriaFiscalGanancias    Script Date: 07/30/2012 17:04:30 ******/

;

;

;
create table CategoriaFiscalGanancias(
	catfg_id int not null,
	catfg_nombre varchar(255) not null,
	catfg_codigo varchar(15) not null,
 CONSTRAINT PK_CategoriaFiscalGanancias PRIMARY KEY  
(
	catfg_id 
) 
) 
;

;
/****** Object:  Table RemitoVentaTMP    Script Date: 07/30/2012 17:29:00 ******/

;

;

;
create table RemitoVentaTMP(
	rvTMP_id int not null,
	rv_id int not null,
	rv_numero int not null,
	rv_nrodoc varchar(50) not null CONSTRAINT DF_RemitoVentaTMP_rv_nrodoc  default (''),
	rv_descrip varchar(5000) not null CONSTRAINT DF_RemitoVentaTMP_rv_descrip  default (''),
	rv_fecha timestamptz not null CONSTRAINT DF_RemitoVentaTMP_rv_fecha  default (getdate()),
	rv_fechaentrega timestamptz not null CONSTRAINT DF_RemitoVentaTMP_rv_fechaentrega  default (getdate()),
	rv_neto decimal(18, 6) not null CONSTRAINT DF_RemitoVentaTMP_rv_neto  default (0),
	rv_ivari decimal(18, 6) not null CONSTRAINT DF_RemitoVentaTMP_rv_ivari  default (0),
	rv_ivarni decimal(18, 6) not null CONSTRAINT DF_RemitoVentaTMP_rv_ivarni  default (0),
	rv_subtotal decimal(18, 6) not null CONSTRAINT DF_RemitoVentaTMP_rv_subtotal  default (0),
	rv_total decimal(18, 6) not null CONSTRAINT DF_RemitoVentaTMP_rv_total  default (0),
	rv_descuento1 decimal(18, 6) not null CONSTRAINT DF_RemitoVentaTMP_rv_descuento1  default (0),
	rv_descuento2 decimal(18, 6) not null CONSTRAINT DF_RemitoVentaTMP_rv_descuento2  default (0),
	rv_importedesc1 decimal(18, 6) not null CONSTRAINT DF_RemitoVentaTMP_rv_importedesc1  default (0),
	rv_importedesc2 decimal(18, 6) not null CONSTRAINT DF_RemitoVentaTMP_rv_importedesc2  default (0),
	rv_cotizacion decimal(18, 6) not null CONSTRAINT DF_RemitoVentaTMP_rv_cotizacion  default (0),
	rv_retiro varchar(255) not null CONSTRAINT DF_RemitoVentaTMP_rv_retiro  default (''),
	rv_guia varchar(255) not null CONSTRAINT DF_RemitoVentaTMP_rv_guia  default (''),
	rv_destinatario varchar(1000) not null CONSTRAINT DF_RemitoVentaTMP_rv_destinatario  default (''),
	rv_ordencompra varchar(255) not null CONSTRAINT DF_RemitoVentaTMP_rv_ordencompra  default (''),
	est_id int not null,
	suc_id int not null,
	cli_id int not null,
	doc_id int not null,
	lp_id int null,
	ld_id int null,
	lgj_id int null,
	cpg_id int null,
	ccos_id int null,
	ven_id int null,
	st_id int null,
	depl_id int null,
	depl_id_temp int null,
	pro_id_origen int null,
	pro_id_destino int null,
	trans_id int null,
	clis_id int null,
	chof_id int null,
	cam_id int null,
	cam_id_semi int null,
	creado timestamptz not null CONSTRAINT DF_RemitoVentaTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_RemitoVentaTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_RemitoVentaTMP PRIMARY KEY  
(
	rvTMP_id 
) 
) 
;

;
/****** Object:  Table ManifiestoCargaTMP    Script Date: 07/30/2012 17:16:52 ******/

;

;

;
create table ManifiestoCargaTMP(
	mfcTMP_id int not null,
	mfc_id int not null,
	mfc_numero int not null,
	mfc_nrodoc varchar(20) not null CONSTRAINT DF_ManifiestoCargaTMP_mfc_nrodoc  default (''),
	mfc_fecha timestamptz not null CONSTRAINT DF_ManifiestoCargaTMP_mfc_fecha  default (getdate()),
	mfc_fechadoc timestamptz not null CONSTRAINT DF_ManifiestoCargaTMP_mfc_fechadoc  default (getdate()),
	mfc_horapartida timestamptz not null,
	mfc_pendiente decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaTMP_mfc_pendiente  default (0),
	mfc_chasis varchar(100) not null CONSTRAINT DF_ManifiestoCargaTMP_mfc_chasis  default (''),
	mfc_acoplado varchar(100) not null CONSTRAINT DF_ManifiestoCargaTMP_mfc_acoplado  default (''),
	mfc_descrip varchar(255) not null CONSTRAINT DF_ManifiestoCargaTMP_mfc_descrip  default (''),
	mfc_firmado int not null CONSTRAINT DF_ManifiestoCargaTMP_mfc_firmado  default (0),
	mfc_cantidad decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaTMP_mfc_cantidad  default (0),
	mfc_total decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaTMP_mfc_total  default (0),
	est_id int not null,
	suc_id int not null,
	doc_id int not null,
	doct_id int not null,
	cli_id int not null,
	ccos_id int null,
	cmarc_id int null,
	pue_id_origen int null,
	pue_id_destino int null,
	depl_id_origen int null,
	depl_id_destino int null,
	barc_id int null,
	trans_id int null,
	chof_id int null,
	creado timestamptz not null CONSTRAINT DF_ManifiestoCargaTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ManifiestoCargaTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ManifiestoCargaTMP PRIMARY KEY  
(
	mfcTMP_id 
) 
) 
;

;
/****** Object:  Table EstadoCivil    Script Date: 07/30/2012 17:10:33 ******/

;

;

;
create table EstadoCivil(
	estc_id int not null,
	estc_nombre varchar(255) not null CONSTRAINT DF_AABA_EstadoCivil_estc_nombre  default (''),
	estc_codigo varchar(15) not null,
 CONSTRAINT PK_AABA_EstadoCivil PRIMARY KEY  
(
	estc_id 
) 
) 
;

;
/****** Object:  Table CategoriaFiscalIngBrutos    Script Date: 07/30/2012 17:04:31 ******/

;

;

;
create table CategoriaFiscalIngBrutos(
	catfib_id int not null,
	catfib_nombre varchar(255) not null,
	catfib_codigo varchar(15) not null,
 CONSTRAINT PK_CategoriaFiscalIngBrutos PRIMARY KEY  
(
	catfib_id 
) 
) 
;

;
/****** Object:  Table AlarmaItemTipo    Script Date: 07/30/2012 17:03:00 ******/

;

;

;
create table AlarmaItemTipo(
	alit_id int not null,
	alit_nombre varchar(100) not null,
	alit_codigo varchar(15) not null,
	alit_descrip varchar(255) not null CONSTRAINT DF_AlarmaItemTipo_alt_descrip  default (''),
	creado timestamptz not null CONSTRAINT DF_AlarmaItemTipo_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_AlarmaItemTipo_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_AlarmaItemTipo PRIMARY KEY  
(
	alit_id 
) 
) 
;

;
/****** Object:  Table IngresosBrutosJurisdiccion    Script Date: 07/30/2012 17:14:57 ******/

;

;

;
create table IngresosBrutosJurisdiccion(
	igbj_id int not null,
	igbj_nombre varchar(255) not null,
	igbj_codigo varchar(15) not null,
 CONSTRAINT PK_IngresosBrutosJurisdiccion PRIMARY KEY  
(
	igbj_id 
) 
) 
;

;
/****** Object:  Table PresupuestoEnvioTMP    Script Date: 07/30/2012 17:24:30 ******/

;

;

;
create table PresupuestoEnvioTMP(
	preeTMP_id int not null,
	pree_id int not null,
	pree_numero int not null,
	pree_nrodoc varchar(50) not null CONSTRAINT DF_PresupuestoEnvioTMP_pree_nrodoc  default (''),
	pree_descrip varchar(5000) not null CONSTRAINT DF_PresupuestoEnvioTMP_pree_descrip  default (''),
	pree_fecha timestamptz not null CONSTRAINT DF_PresupuestoEnvioTMP_pree_fecha  default (getdate()),
	pree_fechaentrega timestamptz not null CONSTRAINT DF_PresupuestoEnvioTMP_pree_fechaentrega  default (getdate()),
	pree_neto decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioTMP_pree_neto  default (0),
	pree_ivari decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioTMP_pree_ivari  default (0),
	pree_ivarni decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioTMP_pree_ivarni  default (0),
	pree_subtotal decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioTMP_pree_subtotal  default (0),
	pree_total decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioTMP_pree_total  default (0),
	pree_pendiente decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioTMP_pree_pendiente  default (0),
	pree_firmado int not null CONSTRAINT DF_PresupuestoEnvioTMP_pree_firmado  default (0),
	pree_descuento1 decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioTMP_pree_descuento1  default (0),
	pree_descuento2 decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioTMP_pree_descuento2  default (0),
	pree_importedesc1 decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioTMP_pree_importedesc1  default (0),
	pree_importedesc2 decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioTMP_pree_importedesc2  default (0),
	est_id int not null,
	suc_id int not null,
	cli_id int not null,
	doc_id int not null,
	doct_id int not null,
	cpg_id int not null,
	ccos_id int null,
	ven_id int null,
	creado timestamptz not null CONSTRAINT DF_PresupuestoEnvioTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_PresupuestoEnvioTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_PresupuestoEnvioTMP PRIMARY KEY  
(
	preeTMP_id 
) 
) 
;

;
/****** Object:  Table TrabajoImpresion    Script Date: 07/30/2012 17:31:48 ******/

;

;

;
create table TrabajoImpresion(
	timp_id int not null,
	timp_creado timestamptz not null CONSTRAINT DF_TrabajoImpresion_timp_creado  default (getdate()),
	timp_pc varchar(255) not null CONSTRAINT DF_TrabajoImpresion_timp_pc  default (''),
	timp_estado smallint not null CONSTRAINT DF_TrabajoImpresion_timp_estado  default ((1)),
	timp_sendByEmail smallint not null CONSTRAINT DF_TrabajoImpresion_timp_sendByEmail  default ((0)),
	timp_emailAddress varchar(1000) not null CONSTRAINT DF_TrabajoImpresion_timp_emailAddress  default (''),
	timp_emailSubject varchar(1000) not null CONSTRAINT DF_TrabajoImpresion_timp_emailSubject  default (''),
	timp_emailBody varchar(5000) not null CONSTRAINT DF_TrabajoImpresion_timp_emailBody  default (''),
	tbl_id int null,
	doc_id int null,
	id int null CONSTRAINT DF_TrabajoImpresion_id  default ((0)),
	us_id int null,
	emp_id int null,
	creado timestamptz not null CONSTRAINT DF_TrabajoImpresion_creado  default (getdate()),
 CONSTRAINT PK_TrabajoImpresion PRIMARY KEY  
(
	timp_id 
) 
) 
;

;
;

;

;
create table IngresosBrutosTipo(
	igbt_id int not null,
	igbt_nombre varchar(50) not null,
	igbt_codigo varchar(50) not null,
 CONSTRAINT PK_TipoIngresosBrutos PRIMARY KEY  
(
	igbt_id 
) 
) 
;

;
/****** Object:  Table IncidenteApertura    Script Date: 07/30/2012 17:14:41 ******/

;

;

;
create table IncidenteApertura(
	inca_id int not null,
	inca_nombre varchar(50) not null,
	inca_codigo varchar(15) not null,
 CONSTRAINT PK_IncidenteApertura PRIMARY KEY  
(
	inca_id 
) 
) 
;

;
/****** Object:  Table RecuentoStockTMP    Script Date: 07/30/2012 17:27:36 ******/

;

;

;
create table RecuentoStockTMP(
	rsTMP_id int not null,
	rs_id int not null,
	rs_numero int not null,
	rs_nrodoc varchar(50) not null CONSTRAINT DF_RecuentoStockTMP_rs_nrodoc  default (''),
	rs_descrip varchar(5000) not null CONSTRAINT DF_RecuentoStockTMP_rs_descrip  default (''),
	rs_fecha timestamptz not null CONSTRAINT DF_RecuentoStockTMP_rs_fecha  default (getdate()),
	depl_id int not null,
	suc_id int not null,
	lgj_id int null,
	doc_id int not null,
	doct_id int not null,
	creado timestamptz not null CONSTRAINT DF_RecuentoStockTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_RecuentoStockTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_RecuentoStockTMP PRIMARY KEY  
(
	rsTMP_id 
) 
) 
;

;
/****** Object:  Table FacturaCompraNotaCreditoTMP    Script Date: 07/30/2012 17:11:28 ******/

;

;
create table FacturaCompraNotaCreditoTMP(
	fcTMP_id int not null,
	fcncTMP_id int not null,
	fcnc_id int not null,
	fcnc_importe decimal(18, 6) not null CONSTRAINT DF_FacturaCompraNotaCreditoTMP_fcnc_importe  default (0),
	fc_id_factura int not null,
	fc_id_notacredito int not null,
	fcd_id_factura int null,
	fcp_id_factura int null,
	fcd_id_notacredito int null,
	fcp_id_notacredito int null,
 CONSTRAINT PK_FacturaCompraNotaCreditoTMP PRIMARY KEY  
(
	fcncTMP_id 
) 
) 
;
/****** Object:  Table Prestacion    Script Date: 07/30/2012 17:23:24 ******/

;

;

;
create table Prestacion(
	pre_id int not null,
	pre_nombre varchar(255) not null,
	pre_grupo varchar(255) not null CONSTRAINT DF_Prestacion_pre_grupo  default (''),
	pre_grupo1 varchar(255) not null CONSTRAINT DF_Prestacion_pre_grupo1  default (''),
	pre_grupo2 varchar(255) not null CONSTRAINT DF_Prestacion_pre_grupo2  default (''),
	pre_grupo3 varchar(255) not null CONSTRAINT DF_Prestacion_pre_grupo3  default (''),
	pre_grupo4 varchar(255) not null CONSTRAINT DF_Prestacion_pre_grupo4  default (''),
	pre_grupo5 varchar(255) not null CONSTRAINT DF_Prestacion_pre_grupo5  default (''),
	pre_nombreesc varchar(255) not null CONSTRAINT DF_Prestacion_pre_nombreesc  default (''),
	pre_grupoesc varchar(255) not null CONSTRAINT DF_Prestacion_pre_grupoesc  default (''),
	sysm_id int null,
	creado timestamptz not null CONSTRAINT DF_Prestacion_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Prestacion_modificado  default (getdate()),
	activo smallint not null CONSTRAINT DF_Prestacion_activo  default (1),
	sysm_id_security int null,
 CONSTRAINT PK_Prestacion PRIMARY KEY  
(
	pre_id 
) 
) 
;

;
/****** Object:  Table FRETSolicitudParticular    Script Date: 07/30/2012 17:13:09 ******/

;

;

;
create table FRETSolicitudParticular(
	fretsp_id int not null,
	fretsp_fecha timestamptz not null CONSTRAINT DF_FRETSolicitudParticular_fretsp_fecha  default (getdate()),
	cli_id int not null,
	prov_id int not null,
	fretspi_id int not null,
	fretsp_solicita varchar(500) not null CONSTRAINT DF_FRETSolicitudParticular_fretsp_texto  default (''),
	fretsp_reg1 char(10) null,
	fretsp_reg2 char(10) null,
	fretsp_motivo varchar(250) null,
	fretsp_reg3 char(10) null,
 CONSTRAINT PK_FRETSolicitudParticular PRIMARY KEY  
(
	fretsp_id 
) 
) 
;

;
/****** Object:  Table LiquidacionTMP    Script Date: 07/30/2012 17:15:53 ******/

;

;

;
create table LiquidacionTMP(
	liqTMP_id int not null,
	liq_id int not null,
	liq_numero int not null,
	liq_nrodoc varchar(50) not null CONSTRAINT DF_LiquidacionTMP_liq_nrodoc  default (''),
	liq_descrip varchar(5000) not null CONSTRAINT DF_LiquidacionTMP_liq_descrip  default (''),
	liq_fecha timestamptz not null CONSTRAINT DF_LiquidacionTMP_liq_fecha  default (getdate()),
	liq_fechadesde timestamptz not null CONSTRAINT DF_LiquidacionTMP_liq_fechadesde  default ('19000101'),
	liq_fechahasta timestamptz not null CONSTRAINT DF_LiquidacionTMP_liq_fechahasta  default ('19000101'),
	liq_periodo varchar(100) not null CONSTRAINT DF_LiquidacionTMP_liq_periodo  default (''),
	liq_neto decimal(18, 6) not null CONSTRAINT DF_LiquidacionTMP_liq_neto  default (0),
	liq_impuesto decimal(18, 6) not null CONSTRAINT DF_LiquidacionTMP_liq_impuesto  default (0),
	liq_total decimal(18, 6) not null CONSTRAINT DF_LiquidacionTMP_liq_total  default (0),
	liq_totalorigen decimal(18, 6) not null CONSTRAINT DF_LiquidacionTMP_liq_totalorigen  default (0),
	liq_firmado int not null CONSTRAINT DF_LiquidacionTMP_liq_firmado  default (0),
	liq_grabarasiento smallint not null CONSTRAINT DF_LiquidacionTMP_liq_grabarasiento  default (0),
	liq_cotizacion decimal(18, 6) not null CONSTRAINT DF_LiquidacionTMP_liq_cotizacion  default (0),
	est_id int not null,
	suc_id int not null,
	doc_id int not null,
	ccos_id int null,
	as_id int null,
	lgj_id int null,
	liqp_id int not null,
	creado timestamptz not null CONSTRAINT DF_LiquidacionTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_LiquidacionTMP_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null CONSTRAINT DF_LiquidacionTMP_impreso  default (0),
 CONSTRAINT PK_LiquidacionTMP PRIMARY KEY  
(
	liqTMP_id 
) 
) 
;

;
/****** Object:  Table ListaDocumentoParametro    Script Date: 07/30/2012 17:16:04 ******/

;

;

;
create table ListaDocumentoParametro(
	ldp_valor varchar(255) not null CONSTRAINT DF_ListaDocumentoParametro_ldp_valor  default (''),
	pre_id int not null CONSTRAINT DF_ListaDocumentoParametro_pre_id  default (0),
	us_id int not null CONSTRAINT DF_ListaDocumentoParametro_us_id  default (0),
	ldp_id smallint not null,
	emp_id int not null CONSTRAINT DF_ListaDocumentoParametro_emp_id  default (0),
	ldp_orden smallint not null CONSTRAINT DF_ListaDocumentoParametro_ldp_orden  default (0),
 CONSTRAINT PK_ListaDocumentoParametro PRIMARY KEY  
(
	pre_id,
	us_id,
	ldp_id,
	emp_id 
) 
) 
;

;
/****** Object:  Table EquipoTipoFalla    Script Date: 07/30/2012 17:10:26 ******/

;

;

;
create table EquipoTipoFalla(
	etf_id int not null,
	etf_nombre varchar(255) not null,
	etf_codigo varchar(15) not null,
	etf_descrip varchar(5000) not null,
	modificado timestamptz not null CONSTRAINT DF_EquipoTipoFalla_modificado  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_EquipoTipoFalla_creado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_EquipoTipoFalla PRIMARY KEY  
(
	etf_id 
) 
) 
;

;
/****** Object:  Table FacturaVenta    Script Date: 07/30/2012 17:12:09 ******/

;

;

;
create table FacturaVenta(
	fv_id int not null,
	fv_numero int not null,
	fv_nrodoc varchar(50) not null CONSTRAINT DF_FacturaVenta_fv_nrodoc  default (''),
	fv_cae varchar(50) not null CONSTRAINT DF_FacturaVenta_fv_cae  default (''),
	fv_cae_nrodoc varchar(50) not null CONSTRAINT DF_FacturaVenta_fv_cae_nrodoc  default (''),
	fv_cae_vto varchar(50) not null CONSTRAINT DF_FacturaVenta_fv_cae_vto  default (''),
	fv_descrip varchar(5000) not null CONSTRAINT DF_FacturaVenta_fv_descrip  default (''),
	fv_fecha timestamptz not null CONSTRAINT DF_FacturaVenta_fv_fecha  default (getdate()),
	fv_fechaentrega timestamptz not null CONSTRAINT DF_FacturaVenta_fv_fechaentrega  default (getdate()),
	fv_fechaVto timestamptz not null CONSTRAINT DF_FacturaVenta_fv_fechaVto  default ('19000101'),
	fv_fechaIva timestamptz not null CONSTRAINT DF_FacturaVenta_fv_fechaIva  default (getdate()),
	fv_neto decimal(18, 6) not null CONSTRAINT DF_FacturaVenta_fv_neto  default (0),
	fv_ivari decimal(18, 6) not null CONSTRAINT DF_FacturaVenta_fv_impuesto  default (0),
	fv_ivarni decimal(18, 6) not null CONSTRAINT DF_FacturaVenta_fv_ivarni  default (0),
	fv_internos decimal(18, 6) not null CONSTRAINT DF_FacturaVenta_fc_internos  default (0),
	fv_subtotal decimal(18, 6) not null CONSTRAINT DF_FacturaVenta_fv_subtotal  default (0),
	fv_totalpercepciones decimal(18, 6) not null CONSTRAINT DF_FacturaVenta_fc_totalpercepciones  default (0),
	fv_total decimal(18, 6) not null CONSTRAINT DF_FacturaVenta_fv_total  default (0),
	fv_totalorigen decimal(18, 6) not null CONSTRAINT DF_FacturaVenta_fv_totalorigen  default (0),
	fv_totalcomercial decimal(18, 6) not null CONSTRAINT DF_FacturaVenta_fv_totalcomercial  default (0),
	fv_pendiente decimal(18, 6) not null CONSTRAINT DF_FacturaVenta_fv_pendiente  default (0),
	fv_firmado int not null CONSTRAINT DF_FacturaVenta_fv_firmado  default (0),
	fv_descuento1 decimal(18, 6) not null CONSTRAINT DF_FacturaVenta_fv_descuento  default (0),
	fv_descuento2 decimal(18, 6) not null CONSTRAINT DF_FacturaVenta_fv_descuento2  default (0),
	fv_importedesc1 decimal(18, 6) not null CONSTRAINT DF_FacturaVenta_fv_importedesc1  default (0),
	fv_importedesc2 decimal(18, 6) not null CONSTRAINT DF_FacturaVenta_fv_importedesc2  default (0),
	fv_grabarasiento smallint not null CONSTRAINT DF_FacturaVenta_fv_grabarasiento  default (0),
	fv_cotizacion decimal(18, 6) not null CONSTRAINT DF_FacturaVenta_fv_cotizacion  default (0),
	fv_cai varchar(100) not null CONSTRAINT DF_FacturaVenta_fv_cai  default (''),
	fv_ordencompra varchar(255) not null CONSTRAINT DF_FacturaVenta_fv_ordencompra  default (''),
	mon_id int not null,
	est_id int not null,
	suc_id int not null,
	cli_id int not null,
	doc_id int not null,
	doct_id int not null,
	lp_id int null,
	ld_id int null,
	cpg_id int not null,
	ccos_id int null,
	ven_id int null,
	as_id int null,
	lgj_id int null,
	pro_id_origen int null,
	pro_id_destino int null,
	trans_id int null,
	rv_id int null,
	st_id int null,
	emp_id int not null,
	clis_id int null,
	mcj_id int null,
	creado timestamptz not null CONSTRAINT DF_FacturaVenta_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_FacturaVenta_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null CONSTRAINT DF__FacturaVe__impre__7CEF9223  default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_FacturaVenta PRIMARY KEY  
(
	fv_id 
),
 CONSTRAINT IX_FacturaVenta UNIQUE  
(
	fv_numero 
),
 CONSTRAINT IX_FacturaVentaNroDoc UNIQUE  
(
	emp_id,
	fv_nrodoc,
	doct_id 
) 
) 
;

;
/****** Object:  Table DepositoBancoAsiento    Script Date: 07/30/2012 17:08:06 ******/

;

;
create table DepositoBancoAsiento(
	dbco_id int not null,
	dbco_fecha timestamptz not null,
 CONSTRAINT PK_DepositoBancoAsiento PRIMARY KEY  
(
	dbco_id 
) 
) 
;
/****** Object:  Table PercepcionCategoriaFiscal    Script Date: 07/30/2012 17:22:30 ******/

;

;
create table PercepcionCategoriaFiscal(
	perccatf_id int not null,
	perc_id int not null,
	catf_id int not null,
	perccatf_base smallint not null,
 CONSTRAINT PK_PercepcionCategoriaFiscal PRIMARY KEY  
(
	perccatf_id 
) 
) 
;
/****** Object:  Table PedidoVentaTMP    Script Date: 07/30/2012 17:22:26 ******/

;

;

;
create table PedidoVentaTMP(
	pvTMP_id int not null,
	pv_id int not null,
	pv_numero int not null,
	pv_nrodoc varchar(50) not null CONSTRAINT DF_PedidoVentaTMP_pv_nrodoc  default (''),
	pv_descrip varchar(5000) not null CONSTRAINT DF_PedidoVentaTMP_pv_descrip  default (''),
	pv_fecha timestamptz not null CONSTRAINT DF_PedidoVentaTMP_pv_fecha  default (getdate()),
	pv_fechaentrega timestamptz not null CONSTRAINT DF_PedidoVentaTMP_pv_fechaentrega  default (getdate()),
	pv_subtotal decimal(18, 6) not null CONSTRAINT DF_PedidoVentaTMP_pv_subtotal  default (0),
	pv_neto decimal(18, 6) not null CONSTRAINT DF_PedidoVentaTMP_pv_neto  default (0),
	pv_ivari decimal(18, 6) not null CONSTRAINT DF_PedidoVentaTMP_pv_impuesto  default (0),
	pv_ivarni decimal(18, 6) not null CONSTRAINT DF_PedidoVentaTMP_pv_ivarni  default (0),
	pv_total decimal(18, 6) not null CONSTRAINT DF_PedidoVentaTMP_pv_total  default (0),
	pv_descuento1 decimal(18, 6) not null CONSTRAINT DF_PedidoVentaTMP_pv_descuento1  default (0),
	pv_descuento2 decimal(18, 6) not null CONSTRAINT DF_PedidoVentaTMP_pv_descuento2  default (0),
	pv_importedesc1 decimal(18, 6) not null CONSTRAINT DF_PedidoVentaTMP_pv_descuento11  default (0),
	pv_importedesc2 decimal(18, 6) not null CONSTRAINT DF_PedidoVentaTMP_pv_descuento21  default (0),
	pv_destinatario varchar(1000) not null CONSTRAINT DF_PedidoVentaTMP_pv_destinatario  default (''),
	pv_ordencompra varchar(255) not null CONSTRAINT DF_PedidoVentaTMP_pv_ordencompra  default (''),
	est_id int not null,
	suc_id int not null,
	cli_id int not null,
	doc_id int not null,
	lp_id int null,
	ld_id int null,
	cpg_id int not null,
	ccos_id int null,
	ven_id int null,
	lgj_id int null,
	pro_id_origen int null,
	pro_id_destino int null,
	trans_id int null,
	chof_id int null,
	cam_id int null,
	cam_id_semi int null,
	ram_id_stock varchar(50) null CONSTRAINT DF_PedidoVentaTMP_ram_id_stock  default (''),
	clis_id int null,
	creado timestamptz not null CONSTRAINT DF_PedidoVentaTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_PedidoVentaTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_PedidoVentaTMP PRIMARY KEY  
(
	pvTMP_id 
) 
) 
;

;
/****** Object:  Table PercepcionProvincia    Script Date: 07/30/2012 17:22:34 ******/

;

;
create table PercepcionProvincia(
	percpro_id int not null,
	perc_id int not null,
	pro_id int not null,
 CONSTRAINT PK_PercepcionProvincia PRIMARY KEY  
(
	percpro_id 
) 
) 
;
/****** Object:  Table FacturaVentaNotaCreditoTMP    Script Date: 07/30/2012 17:12:40 ******/

;

;
create table FacturaVentaNotaCreditoTMP(
	fvTMP_id int not null,
	fvncTMP_id int not null,
	fvnc_id int not null,
	fvnc_importe decimal(18, 6) not null CONSTRAINT DF_FacturaVentaNotaCreditoTMP_fvnc_importe  default (0),
	fv_id_factura int not null,
	fv_id_notacredito int not null,
	fvd_id_factura int null,
	fvp_id_factura int null,
	fvd_id_notacredito int null,
	fvp_id_notacredito int null,
 CONSTRAINT PK_FacturaVentaNotaCreditoTMP PRIMARY KEY  
(
	fvncTMP_id 
) 
) 
;
/****** Object:  Table LiquidacionItemBorradoTMP    Script Date: 07/30/2012 17:15:38 ******/

;

;
create table LiquidacionItemBorradoTMP(
	liqTMP_id int not null,
	liqibTMP_id int not null,
	liq_id int not null,
	liqi_id int not null,
 CONSTRAINT PK_LiquidacionItemBorradoTMP PRIMARY KEY  
(
	liqibTMP_id 
) 
) 
;
/****** Object:  Table PercepcionEmpresa    Script Date: 07/30/2012 17:22:31 ******/

;

;
create table PercepcionEmpresa(
	percemp_id int not null,
	perc_id int not null,
	emp_id int not null,
 CONSTRAINT PK_PercepcionEmpresa PRIMARY KEY  
(
	percemp_id 
) 
) 
;
/****** Object:  Table CatalogoWebCategoriaItemLink    Script Date: 07/30/2012 17:04:24 ******/

;

;
create table CatalogoWebCategoriaItemLink(
	catw_id int not null,
	catwci_id int not null,
 CONSTRAINT PK_CatalogoWebCategoriaItemLink PRIMARY KEY  
(
	catw_id,
	catwci_id 
) 
) 
;
/****** Object:  Table LiquidacionExcepcion    Script Date: 07/30/2012 17:15:29 ******/

;

;

;
create table LiquidacionExcepcion(
	liq_id int not null,
	liqe_id int not null,
	liqe_descrip varchar(5000) not null CONSTRAINT DF_LiquidacionExcepcion_liqe_descrip  default (''),
	liqe_orden smallint not null,
	em_id int not null,
	liqfi_id int not null,
	ccos_id int null,
 CONSTRAINT PK_LiquidacionExcepcion PRIMARY KEY  
(
	liqe_id 
) 
) 
;

;
/****** Object:  Table PresupuestoCompraTMP    Script Date: 07/30/2012 17:23:49 ******/

;

;

;
create table PresupuestoCompraTMP(
	prcTMP_id int not null,
	prc_id int not null,
	prc_numero int not null,
	prc_nrodoc varchar(50) not null CONSTRAINT DF_PresupuestoCompraTMP_prc_nrodoc  default (''),
	prc_descrip varchar(5000) not null CONSTRAINT DF_PresupuestoCompraTMP_prc_descrip  default (''),
	prc_fecha timestamptz not null CONSTRAINT DF_PresupuestoCompraTMP_prc_fecha  default (getdate()),
	prc_fechaentrega timestamptz not null CONSTRAINT DF_PresupuestoCompraTMP_prc_fechaentrega  default (getdate()),
	prc_subtotal decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraTMP_prc_subtotal  default (0),
	prc_neto decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraTMP_prc_neto  default (0),
	prc_ivari decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraTMP_prc_impuesto  default (0),
	prc_ivarni decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraTMP_prc_ivarni  default (0),
	prc_total decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraTMP_prc_total  default (0),
	prc_descuento1 decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraTMP_prc_descuento1  default (0),
	prc_descuento2 decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraTMP_prc_descuento2  default (0),
	prc_importedesc1 decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraTMP_prc_descuento11  default (0),
	prc_importedesc2 decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraTMP_prc_descuento21  default (0),
	est_id int not null,
	suc_id int not null,
	prov_id int not null,
	doc_id int not null,
	doct_id int not null,
	lp_id int null,
	ld_id int null,
	cpg_id int not null,
	ccos_id int null,
	us_id int null,
	lgj_id int null,
	creado timestamptz not null CONSTRAINT DF_PresupuestoCompraTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_PresupuestoCompraTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_PresupuestoCompraTMP PRIMARY KEY  
(
	prcTMP_id 
) 
) 
;

;
/****** Object:  Table CotizacionOrdenCompraTMP    Script Date: 07/30/2012 17:07:29 ******/

;

;
create table CotizacionOrdenCompraTMP(
	cotTMP_id int not null CONSTRAINT DF_CotizacionOrdenCompraTMP_cotTMP_id  default (0),
	ocTMP_id int not null CONSTRAINT DF_CotizacionOrdenCompraTMP_ocTMP_id  default (0),
	cotocTMP_id int not null,
	cotoc_id int not null,
	cotoc_cantidad decimal(18, 6) not null CONSTRAINT DF_CotizacionOrdenCompraTMP_cotoc_cantidad  default (0),
	coti_id int not null,
	oci_id int not null,
 CONSTRAINT PK_CotizacionOrdenCompraTMP PRIMARY KEY  
(
	cotocTMP_id 
) 
) 
;
/****** Object:  Table ProductoTag    Script Date: 07/30/2012 17:26:30 ******/

;

;

;
create table ProductoTag(
	pr_id int not null,
	prt_id int not null,
	prt_texto varchar(1000) not null,
	prt_pendienteweb smallint not null CONSTRAINT DF_ProductoTag_prt_pendienteweb  default (0),
	prt_expoweb smallint not null CONSTRAINT DF_ProductoTag_prt_expoweb  default (50),
	prt_expocairo smallint not null CONSTRAINT DF_ProductoTag_prt_expocairo  default (50),
	pr_id_tag int null,
 CONSTRAINT PK_ProductoTag PRIMARY KEY  
(
	prt_id 
) 
) 
;

;
/****** Object:  Table RetencionCategoriaFiscal    Script Date: 07/30/2012 17:29:28 ******/

;

;
create table RetencionCategoriaFiscal(
	retcatf_id int not null,
	ret_id int not null,
	catf_id int not null,
	retcatf_base smallint not null,
 CONSTRAINT PK_RetencionCategoriaFiscal PRIMARY KEY  
(
	retcatf_id 
) 
) 
;
/****** Object:  Table RemitoFacturaCompraTMP    Script Date: 07/30/2012 17:28:19 ******/

;

;
create table RemitoFacturaCompraTMP(
	fcTMP_id int not null CONSTRAINT DF_RemitoFacturaCompraTMP_fcTMP_id  default (0),
	rcTMP_id int not null CONSTRAINT DF_RemitoFacturaCompraTMP_rcTMP_id  default (0),
	rcfcTMP_id int not null,
	rcfc_id int not null,
	rcfc_cantidad decimal(18, 6) not null CONSTRAINT DF_RemitoCompraFacturaTMP_rcfc_cantidad  default (0),
	rci_id int not null,
	fci_id int not null,
 CONSTRAINT PK_RemitoCompraFacturaTMP PRIMARY KEY  
(
	rcfcTMP_id 
) 
) 
;
/****** Object:  Table RetencionProvincia    Script Date: 07/30/2012 17:29:31 ******/

;

;
create table RetencionProvincia(
	retpro_id int not null,
	ret_id int not null,
	pro_id int not null,
 CONSTRAINT PK_RetencionProvincia PRIMARY KEY  
(
	retpro_id 
) 
) 
;
/****** Object:  Table FacturaCompraPercepcionTMP    Script Date: 07/30/2012 17:11:45 ******/

;

;

;
create table FacturaCompraPercepcionTMP(
	fcTMP_id int not null,
	fcpercTMP_id int not null,
	fcperc_id int not null,
	fcperc_orden smallint not null CONSTRAINT DF_FacturaCompraPercepcionTMP_fcperc_orden  default (0),
	fcperc_base decimal(18, 6) not null CONSTRAINT DF_FacturaCompraPercepcionTMP_fcperc_base  default (0),
	fcperc_porcentaje decimal(18, 6) not null CONSTRAINT DF_FacturaCompraPercepcionTMP_fcperc_porcentaje  default (0),
	fcperc_importe decimal(18, 6) not null CONSTRAINT DF_FacturaCompraPercepcionTMP_fcperc_importe  default (0),
	fcperc_origen decimal(18, 6) not null CONSTRAINT DF_FacturaCompraPercepcionTMP_fcperc_origen  default (0),
	fcperc_descrip varchar(255) not null CONSTRAINT DF_FacturaCompraPercepcionTMP_fcperc_descrip  default (''),
	perc_id int not null,
	ccos_id int null,
 CONSTRAINT PK_FacturaCompraPercepcionTMP PRIMARY KEY  
(
	fcpercTMP_id 
) 
) 
;

;
/****** Object:  Table LiquidacionExcepcionBorradoTMP    Script Date: 07/30/2012 17:15:29 ******/

;

;
create table LiquidacionExcepcionBorradoTMP(
	liqTMP_id int not null,
	liqebTMP_id int not null,
	liq_id int not null,
	liqe_id int not null,
 CONSTRAINT PK_LiquidacionExcepcionBorradoTMP PRIMARY KEY  
(
	liqebTMP_id 
) 
) 
;
/****** Object:  Table sysModulo    Script Date: 07/30/2012 17:30:42 ******/

;

;

;
create table sysModulo(
	sysm_objetoinicializacion varchar(255) not null,
	sysm_objetoedicion varchar(255) not null,
	sysm_id int not null,
	sysm_orden int not null,
	pre_id int not null CONSTRAINT DF_sysModulo_pre_id  default (0),
	modificado timestamptz not null default (getdate()),
 CONSTRAINT PK_sysModulo PRIMARY KEY  
(
	sysm_id 
) 
) 
;

;
/****** Object:  Table EquipoDetalle    Script Date: 07/30/2012 17:10:23 ******/

;

;

;
create table EquipoDetalle(
	ed_id int not null,
	ed_nombre varchar(100) not null,
	ed_codigo varchar(15) not null,
	ed_descrip varchar(255) not null,
	rub_id int not null,
	modificado timestamptz not null CONSTRAINT DF_EquipoDetalle_modificado  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_EquipoDetalle_creado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_EquipoDetalle_activo  default (1),
 CONSTRAINT PK_EquipoDetalle PRIMARY KEY  
(
	ed_id 
) 
) 
;

;
/****** Object:  Table Auditoria    Script Date: 07/30/2012 17:03:32 ******/

;

;
create table Auditoria(
	aud_id int not null,
	aud_fecha timestamptz not null CONSTRAINT DF_Auditoria_aud_fecha  default (getdate()),
	aud_fin timestamptz not null CONSTRAINT DF_Auditoria_aud_fin  default ('19000101'),
 CONSTRAINT PK_Auditoria PRIMARY KEY  
(
	aud_id 
) 
) 
;
/****** Object:  Table webArticuloEstado    Script Date: 07/30/2012 17:32:19 ******/

;

;

;
create table webArticuloEstado(
	warte_id int not null,
	warte_nombre varchar(255) not null,
 CONSTRAINT PK_webArticuloEstado PRIMARY KEY  
(
	warte_id 
) 
) 
;

;
/****** Object:  Table webArticuloTipo    Script Date: 07/30/2012 17:32:19 ******/

;

;

;
create table webArticuloTipo(
	wartt_id int not null,
	wartt_nombre varchar(50) not null,
 CONSTRAINT PKwebArticuloTipo PRIMARY KEY  
(
	wartt_id 
) 
) 
;

;
/****** Object:  Table CotizacionPresupuestoCompraTMP    Script Date: 07/30/2012 17:07:31 ******/

;

;
create table CotizacionPresupuestoCompraTMP(
	cotTMP_id int not null CONSTRAINT DF_CotizacionPresupuestoCompraTMP_cotTMP_id  default (0),
	prcTMP_id int not null CONSTRAINT DF_CotizacionPresupuestoCompraTMP_prcTMP_id  default (0),
	cotprcTMP_id int not null,
	cotprc_id int not null,
	cotprc_cantidad decimal(18, 6) not null CONSTRAINT DF_CotizacionPresupuestoCompraTMP_cotprc_cantidad  default (0),
	coti_id int not null,
	prci_id int not null,
 CONSTRAINT PK_CotizacionPresupuestoCompraTMP PRIMARY KEY  
(
	cotprcTMP_id 
) 
) 
;
/****** Object:  Table LiquidacionExcepcionTMP    Script Date: 07/30/2012 17:15:31 ******/

;

;

;
create table LiquidacionExcepcionTMP(
	liqTMP_id int not null,
	liqeTMP_id int not null,
	liqe_id int not null,
	liqe_descrip varchar(5000) not null CONSTRAINT DF_LiquidacionExcepcionTMP_liqe_descrip  default (''),
	liqe_orden smallint not null,
	em_id int not null,
	liqfi_id int not null,
	ccos_id int null,
 CONSTRAINT PK_LiquidacionExcepcionTMP PRIMARY KEY  
(
	liqeTMP_id 
) 
) 
;

;
/****** Object:  Table sysModuloTCP    Script Date: 07/30/2012 17:30:43 ******/

;

;

;
create table sysModuloTCP(
	syst_objetoinicializacion varchar(255) not null,
	syst_objetoedicion varchar(255) not null,
	syst_id int not null,
	syst_orden int not null,
 CONSTRAINT PK_sysModuloTCP PRIMARY KEY  
(
	syst_id 
) 
) 
;

;
/****** Object:  Table CatalogoWebCategoria    Script Date: 07/30/2012 17:04:21 ******/

;

;

;
create table CatalogoWebCategoria(
	catwc_id int not null,
	catwc_nombre varchar(100) not null,
	catwc_codigo varchar(15) not null,
	catwc_descrip varchar(255) not null,
	creado timestamptz not null CONSTRAINT DF_CatalogoWebCategoria_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_CatalogoWebCategoria_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_CatalogoWebCategoria_activo  default (1),
 CONSTRAINT PK_CatalogoWebCategoria PRIMARY KEY  
(
	catwc_id 
) 
) 
;

;
/****** Object:  Table HoraFacturaVentaTMP    Script Date: 07/30/2012 17:13:51 ******/

;

;
create table HoraFacturaVentaTMP(
	fvTMP_id int not null CONSTRAINT DF_HoraFacturaVentaTMP_fvTMP_id  default (0),
	horaTMP_id int not null CONSTRAINT DF_HoraFacturaVentaTMP_horaTMP_id  default (0),
	horafvTMP_id int not null,
	horafv_id int not null,
	horafv_cantidad decimal(18, 6) not null CONSTRAINT DF_HoraFacturaVentaTMP_horafv_cantidad  default (0),
	hora_id int not null,
	fvi_id int not null,
 CONSTRAINT PK_HoraFacturaVentaTMP PRIMARY KEY  
(
	horafvTMP_id 
) 
) 
;
/****** Object:  Table ProductoWebImage    Script Date: 07/30/2012 17:26:31 ******/

;

;

;
create table ProductoWebImage(
	pr_id int not null,
	prwi_id int not null,
	prwi_archivo varchar(255) not null,
	prwi_alt varchar(255) not null CONSTRAINT DF_ProductoWebImage_prwi_alt  default (''),
	prwi_tipo smallint not null,
	prwi_posicion smallint not null CONSTRAINT DF_ProductoWebImage_prwi_posicion  default (0),
 CONSTRAINT PK_ProductoWebImage PRIMARY KEY  
(
	prwi_id 
) 
) 
;

;
/****** Object:  Table OrdenRemitoVentaTMP    Script Date: 07/30/2012 17:18:54 ******/

;

;
create table OrdenRemitoVentaTMP(
	osTMP_id int not null CONSTRAINT DF_OrdenRemitoVentaTMP_osTMP_id  default (0),
	rvTMP_id int not null CONSTRAINT DF_OrdenRemitoVentaTMP_rvTMP_id  default (0),
	osrvTMP_id int not null,
	osrv_id int not null,
	osrv_cantidad decimal(18, 6) not null CONSTRAINT DF_OrdenRemitoVentaTMP_osrv_cantidad  default (0),
	osi_id int not null,
	rvi_id int not null,
 CONSTRAINT PK_OrdenRemitoVentaTMP PRIMARY KEY  
(
	osrvTMP_id 
) 
) 
;
/****** Object:  Table StockTMP    Script Date: 07/30/2012 17:30:36 ******/

;

;

;
create table StockTMP(
	stTMP_id int not null,
	st_id int not null,
	st_numero int not null,
	st_nrodoc varchar(50) not null CONSTRAINT DF_StockTMP_st_nrodoc  default (''),
	st_descrip varchar(5000) not null CONSTRAINT DF_StockTMP_st_descrip  default (''),
	st_fecha timestamptz not null CONSTRAINT DF_StockTMP_st_fecha  default (getdate()),
	depl_id_origen int not null,
	depl_id_destino int not null,
	suc_id int not null,
	lgj_id int null,
	doc_id int not null,
	doct_id int not null,
	creado timestamptz not null CONSTRAINT DF_StockTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_StockTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_StockTMP PRIMARY KEY  
(
	stTMP_id 
) 
) 
;

;
/****** Object:  Table AuditoriaGrupo    Script Date: 07/30/2012 17:03:33 ******/

;

;

;
create table AuditoriaGrupo(
	audg_id int not null,
	audg_nombre varchar(255) not null,
 CONSTRAINT PK_AuditoriaGrupo PRIMARY KEY  
(
	audg_id 
) 
) 
;

;
/****** Object:  Table ListaPrecioPrecio    Script Date: 07/30/2012 17:16:23 ******/

;

;
create table ListaPrecioPrecio(
	lp_id int not null,
	pr_id int not null,
	lpp_precio decimal(18, 6) not null,
	modificado timestamptz not null CONSTRAINT DF_ListaPrecioPrecio_modificado  default (getdate()),
 CONSTRAINT PK_ListaPrecioPrecio PRIMARY KEY  
(
	lp_id,
	pr_id 
) 
) 
;
/****** Object:  Table AlarmaMailResult    Script Date: 07/30/2012 17:03:05 ******/

;

;
create table AlarmaMailResult(
	alm_id int not null,
	almr_id SERIAL not null,
	almr_id_mail int not null,
	almr_fecha timestamptz not null CONSTRAINT DF_AlarmaMailResult_almr_fecha  default (getdate()),
 CONSTRAINT PK_AlarmaMailResult PRIMARY KEY  
(
	almr_id 
) 
) 
;
/****** Object:  Table rptArbolRamaHoja    Script Date: 07/30/2012 17:29:37 ******/

;

;
create table rptArbolRamaHoja(
	rptarb_cliente int not null,
	rptarb_hojaid int not null,
	tbl_id int not null,
	ram_id int not null CONSTRAINT DF_rptArbolRamaHoja_ram_id  default (0),
 CONSTRAINT PK_rtpArbolRamaHoja PRIMARY KEY  
(
	rptarb_cliente,
	rptarb_hojaid,
	tbl_id,
	ram_id 
) 
) 
;
/****** Object:  Table TmpStringToTable    Script Date: 07/30/2012 17:31:45 ******/

;

;

;
create table TmpStringToTable(
	tmpstr2tbl_campo varchar(5000) null,
	tmpstr2tbl_id timestamptz not null
) 
;

;
/****** Object:  Table CodigoPostal    Script Date: 07/30/2012 17:05:58 ******/

;

;

;
create table CodigoPostal(
	cpa_id int not null,
	cpa_codigo varchar(50) not null CONSTRAINT DF_CodigoPostal_cpa_codigo  default (''),
	cpa_descrip varchar(255) not null CONSTRAINT DF_CodigoPostal_cpa_descrip  default (''),
	pro_id int not null,
	creado timestamptz not null CONSTRAINT DF_CodigoPostal_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_CodigoPostal_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_CodigoPostal_activo  default (1),
 CONSTRAINT PK_CodigoPostal PRIMARY KEY  
(
	cpa_id 
) 
) 
;

;
/****** Object:  Table LiquidacionAsiento    Script Date: 07/30/2012 17:15:20 ******/

;

;
create table LiquidacionAsiento(
	liq_id int not null,
	liq_fecha timestamptz not null,
 CONSTRAINT PK_LiquidacionAsiento PRIMARY KEY  
(
	liq_id 
) 
) 
;
/****** Object:  Table LiquidacionConceptoAdmTMP    Script Date: 07/30/2012 17:15:27 ******/

;

;

;
create table LiquidacionConceptoAdmTMP(
	liqTMP_id int not null,
	liqcaTMP_id int not null,
	liqca_id int not null,
	liqca_importe decimal(18, 6) not null CONSTRAINT DF_LiquidacionCodigoAdmTMP_liqca_importe  default (0),
	liqca_descrip varchar(5000) not null CONSTRAINT DF_LiquidacionCodigoAdmTMP_liqca_descrip  default (''),
	liqca_orden smallint not null,
	em_id int not null,
	liqfi_id int not null,
	ccos_id int null,
 CONSTRAINT PK_LiquidacionCodigoAdmTMP PRIMARY KEY  
(
	liqcaTMP_id 
) 
) 
;

;
/****** Object:  Table ReglaLiquidacion    Script Date: 07/30/2012 17:27:38 ******/

;

;

;
create table ReglaLiquidacion(
	rel_id int not null,
	rel_nombre varchar(100) not null,
	rel_codigo varchar(15) not null,
	rel_descrip varchar(255) not null CONSTRAINT DF_ReglaLiquidacion_rel_descripcion  default (''),
	creado timestamptz not null CONSTRAINT DF_ReglaLiquidacion_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ReglaLiquidacion_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_ReglaLiquidacion_activo  default (1),
 CONSTRAINT PK_ReglaLiquidacion PRIMARY KEY  
(
	rel_id 
) 
) 
;

;
/****** Object:  Table CategoriaFiscal    Script Date: 07/30/2012 17:04:29 ******/

;

;

;
create table CategoriaFiscal(
	catf_id int not null,
	catf_codigo varchar(15) not null,
	catf_nombre varchar(255) not null,
 CONSTRAINT PK_CategoriaFiscal PRIMARY KEY  
(
	catf_id 
) 
) 
;

;
/****** Object:  Table AlarmaMail    Script Date: 07/30/2012 17:03:03 ******/

;

;

;
create table AlarmaMail(
	alm_id int not null,
	alm_nombre varchar(255) not null,
	alm_scriptmails varchar(255) not null CONSTRAINT DF_AlarmaMail_alm_scriptmails  default (''),
	alm_scriptresult varchar(255) not null CONSTRAINT DF_AlarmaMail_alm_scriptresult  default (''),
	alm_object varchar(255) not null CONSTRAINT DF_AlarmaMail_alm_object  default (''),
	alm_frecuencia int not null CONSTRAINT DF_AlarmaMail_alm_frecuencia  default (30),
	alm_mails varchar(5000) not null CONSTRAINT DF_AlarmaMail_alm_mails  default (''),
	alm_nextrun timestamptz not null CONSTRAINT DF_AlarmaMail_alm_nextrun  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_AlarmaMail_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_AlarmaMail_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_AlarmaMail_activo  default (1),
 CONSTRAINT PK_AlarmaMail PRIMARY KEY  
(
	alm_id 
) 
) 
;

;
/****** Object:  Table SRV_AfipCuit    Script Date: 07/30/2012 17:29:58 ******/

;

;

;
create table SRV_AfipCuit(
	safipc_id int not null,
	safipc_cuit varchar(50) not null,
	safipc_folder varchar(255) not null,
	safipc_pendiente smallint not null,
	safipc_success smallint not null,
	safipc_error varchar(255) not null,
	creado timestamptz not null CONSTRAINT DF_SRV_AfipCuit_creado  default (getdate()),
 CONSTRAINT PK_SRV_AfipCuit PRIMARY KEY  
(
	safipc_id 
) 
) 
;

;
/****** Object:  Table DepositoCuponAsiento    Script Date: 07/30/2012 17:08:23 ******/

;

;
create table DepositoCuponAsiento(
	dcup_id int not null,
	dcup_fecha timestamptz not null,
 CONSTRAINT PK_DepositoCuponAsiento PRIMARY KEY  
(
	dcup_id 
) 
) 
;
/****** Object:  Table RemitoCompraItemSerieBTMP    Script Date: 07/30/2012 17:27:56 ******/

;

;
create table RemitoCompraItemSerieBTMP(
	rcTMP_id int not null,
	rcisbTMP_id int not null,
	prns_id int not null CONSTRAINT DF_RemitoCompraItemSerieBTMP_prns_id  default (0),
 CONSTRAINT PK_RemitoCompraItemSerieBTMP PRIMARY KEY  
(
	rcisbTMP_id 
) 
) 
;
/****** Object:  Table LiquidacionConceptoAdmBorradoTMP    Script Date: 07/30/2012 17:15:25 ******/

;

;
create table LiquidacionConceptoAdmBorradoTMP(
	liqTMP_id int not null,
	liqcabTMP_id int not null,
	liq_id int not null,
	liqca_id int not null,
 CONSTRAINT PK_LiquidacionConceptoAdmBorradoTMP PRIMARY KEY  
(
	liqcabTMP_id 
) 
) 
;
/****** Object:  Table CatalogoWeb    Script Date: 07/30/2012 17:04:19 ******/

;

;

;
create table CatalogoWeb(
	catw_id int not null,
	catw_nombre varchar(100) not null,
	catw_codigo varchar(15) not null,
	catw_descrip varchar(255) not null CONSTRAINT DF_CatalogoWeb_catw_descrip  default (''),
	catw_updateaddress varchar(1000) not null CONSTRAINT DF_CatalogoWeb_catw_updateaddress  default (''),
	catw_updateuser varchar(100) not null CONSTRAINT DF_CatalogoWeb_catw_updateuser  default (''),
	catw_updatepwd varchar(255) not null CONSTRAINT DF_CatalogoWeb_catw_updatepwd  default (''),
	catw_ftpaddress varchar(1000) not null CONSTRAINT DF_CatalogoWeb_catw_ftpaddress  default (''),
	catw_ftpuser varchar(100) not null CONSTRAINT DF_CatalogoWeb_catw_ftpuser  default (''),
	catw_ftppwd varchar(1000) not null CONSTRAINT DF_CatalogoWeb_catw_ftppwd  default (''),
	catw_folderimage varchar(50) not null CONSTRAINT DF_CatalogoWeb_catw_folderimage  default (''),
	catw_cscart smallint not null CONSTRAINT DF_CatalogoWeb_catw_cscart  default (0),
	activo smallint not null CONSTRAINT DF_CatalogoWeb_activo  default (1),
	creado timestamptz not null CONSTRAINT DF_CatalogoWeb_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_CatalogoWeb_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_CatalogoWeb PRIMARY KEY  
(
	catw_id 
) 
) 
;

;
/****** Object:  Table CDRom    Script Date: 07/30/2012 17:04:33 ******/

;

;

;
create table CDRom(
	cd_id int not null,
	cd_codigo varchar(15) not null,
	cd_nombre varchar(100) not null,
	cd_descrip varchar(255) not null CONSTRAINT DF_CDRom_cd_descrip  default (''),
	creado timestamptz not null CONSTRAINT DF_CDRom_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_CDRom_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_CDRom_activo  default (1),
 CONSTRAINT PK_CDRom PRIMARY KEY  
(
	cd_id 
) 
) 
;

;
/****** Object:  Table FacturaVentaTMP    Script Date: 07/30/2012 17:12:57 ******/

;

;

;
create table FacturaVentaTMP(
	cobzTMP_id int not null CONSTRAINT DF_FacturaVentaTMP_cobzTMP_id  default (0),
	fvTMP_id int not null,
	fv_id int not null,
	fv_numero int not null,
	fv_nrodoc varchar(50) not null CONSTRAINT DF_FacturaVentaTMP_fv_nrodoc  default (''),
	fv_descrip varchar(5000) not null CONSTRAINT DF_FacturaVentaTMP_fv_descrip  default (''),
	fv_fecha timestamptz not null CONSTRAINT DF_FacturaVentaTMP_fv_fecha  default (getdate()),
	fv_fechaentrega timestamptz not null CONSTRAINT DF_FacturaVentaTMP_fv_fechaentrega  default (getdate()),
	fv_fechaVto timestamptz not null CONSTRAINT DF_FacturaVentaTMP_fv_fechaVto  default ('19000101'),
	fv_fechaIva timestamptz not null CONSTRAINT DF_FacturaVentaTMP_fv_fechaIva  default (getdate()),
	fv_neto decimal(18, 6) not null CONSTRAINT DF_FacturaVentaTMP_fv_neto  default (0),
	fv_ivari decimal(18, 6) not null CONSTRAINT DF_FacturaVentaTMP_fv_impuesto  default (0),
	fv_ivarni decimal(18, 6) not null CONSTRAINT DF_FacturaVentaTMP_fv_ivarni  default (0),
	fv_internos decimal(18, 6) not null CONSTRAINT DF_FacturaVentaTMP_fv_internos  default (0),
	fv_subtotal decimal(18, 6) not null CONSTRAINT DF_FacturaVentaTMP_fv_subtotal  default (0),
	fv_totalpercepciones decimal(18, 6) not null CONSTRAINT DF_FacturaVentaTMP_fc_totalpercepciones  default (0),
	fv_total decimal(18, 6) not null CONSTRAINT DF_FacturaVentaTMP_fv_total  default (0),
	fv_totalorigen decimal(18, 6) not null CONSTRAINT DF_FacturaVentaTMP_fv_totalorigen  default (0),
	fv_pendiente decimal(18, 6) not null CONSTRAINT DF_FacturaVentaTMP_fv_pendiente  default (0),
	fv_firmado int not null CONSTRAINT DF_FacturaVentaTMP_fv_firmado  default (0),
	fv_descuento1 decimal(18, 6) not null CONSTRAINT DF_FacturaVentaTMP_fv_descuento  default (0),
	fv_descuento2 decimal(18, 6) not null CONSTRAINT DF_FacturaVentaTMP_fv_descuento2  default (0),
	fv_importedesc1 decimal(18, 6) not null CONSTRAINT DF_FacturaVentaTMP_fv_importedesc1  default (0),
	fv_importedesc2 decimal(18, 6) not null CONSTRAINT DF_FacturaVentaTMP_fv_importedesc2  default (0),
	fv_grabarasiento smallint not null CONSTRAINT DF_FacturaVentaTMP_fv_grabarasiento  default (0),
	fv_cotizacion decimal(18, 6) not null CONSTRAINT DF_FacturaVentaTMP_fv_cotizacion  default (0),
	fv_cai varchar(100) not null CONSTRAINT DF_FacturaVentaTMP_fv_cai  default (''),
	fv_ordencompra varchar(255) not null CONSTRAINT DF_FacturaVentaTMP_fv_ordencompra  default (''),
	rv_nrodoc varchar(50) not null CONSTRAINT DF_FacturaVentaTMP_rv_nrodoc  default (''),
	est_id int not null,
	suc_id int not null,
	cli_id int not null,
	doc_id int not null,
	lp_id int null,
	ld_id int null,
	cpg_id int not null,
	ccos_id int null,
	ven_id int null,
	as_id int null,
	lgj_id int null,
	pro_id_origen int null,
	pro_id_destino int null,
	trans_id int null,
	rv_id int null,
	st_id int null,
	depl_id int null,
	clis_id int null,
	cj_id int null,
	creado timestamptz not null CONSTRAINT DF_FacturaVentaTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_FacturaVentaTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_FacturaVentaTMP PRIMARY KEY  
(
	fvTMP_id 
) 
) 
;

;
/****** Object:  Table PresupuestoPedidoVentaTMP    Script Date: 07/30/2012 17:24:33 ******/

;

;
create table PresupuestoPedidoVentaTMP(
	prvTMP_id int not null CONSTRAINT DF_PresupuestoPedidoVentaTMP_prvTMP_id  default (0),
	pvTMP_id int not null CONSTRAINT DF_PresupuestoPedidoVentaTMP_pvTMP_id  default (0),
	prvpvTMP_id int not null,
	prvpv_id int not null,
	prvpv_cantidad decimal(18, 6) not null CONSTRAINT DF_PresupuestoPedidoVentaTMP_prvpv_cantidad  default (0),
	prvi_id int not null,
	pvi_id int not null,
 CONSTRAINT PK_PresupuestoPedidoVentaTMP PRIMARY KEY  
(
	prvpvTMP_id 
) 
) 
;
/****** Object:  Table DepositoCuponTMP    Script Date: 07/30/2012 17:08:31 ******/

;

;

;
create table DepositoCuponTMP(
	dcupTMP_id int not null,
	dcup_id int not null,
	dcup_numero int not null,
	dcup_nrodoc varchar(50) not null CONSTRAINT DF_DepositoCuponTMP_dcup_nrodoc_1  default (''),
	dcup_descrip varchar(5000) not null CONSTRAINT DF_DepositoCuponTMP_dcup_descrip_1  default (''),
	dcup_fecha timestamptz not null CONSTRAINT DF_DepositoCuponTMP_dcup_fecha_1  default (getdate()),
	dcup_total decimal(18, 6) not null CONSTRAINT DF_DepositoCuponTMP_dcup_total_1  default (0),
	dcup_firmado int not null CONSTRAINT DF_DepositoCuponTMP_dcup_firmado_1  default (0),
	dcup_grabarasiento smallint not null CONSTRAINT DF_DepositoCuponTMP_dcup_grabarasiento_1  default (0),
	est_id int not null,
	suc_id int not null,
	doc_id int not null,
	as_id int null,
	lgj_id int null,
	creado timestamptz not null CONSTRAINT DF_DepositoCuponTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_DepositoCuponTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_DepositoCuponTMP PRIMARY KEY  
(
	dcupTMP_id 
) 
) 
;

;
/****** Object:  Table OrdenPagoTMP    Script Date: 07/30/2012 17:18:37 ******/

;

;

;
create table OrdenPagoTMP(
	fcTMP_id int not null CONSTRAINT DF_OrdenPagoTMP_fcTMP_id  default (0),
	opgTMP_id int not null,
	opg_id int not null,
	opg_numero int not null,
	opg_nrodoc varchar(50) not null CONSTRAINT DF_OrdenPagoTMP_opg_nrodoc  default (''),
	opg_descrip varchar(5000) not null CONSTRAINT DF_OrdenPagoTMP_opg_descrip  default (''),
	opg_fecha timestamptz not null CONSTRAINT DF_OrdenPagoTMP_opg_fecha  default (getdate()),
	opg_neto decimal(18, 6) not null CONSTRAINT DF_OrdenPagoTMP_opg_neto  default (0),
	opg_otros decimal(18, 6) not null CONSTRAINT DF_OrdenPagoTMP_opg_otros  default (0),
	opg_total decimal(18, 6) not null CONSTRAINT DF_OrdenPagoTMP_opg_total  default (0),
	opg_pendiente decimal(18, 6) not null CONSTRAINT DF_OrdenPagoTMP_opg_pendiente  default (0),
	opg_cotizacion decimal(18, 6) not null CONSTRAINT DF_OrdenPagoTMP_opg_cotizacion  default (0),
	opg_grabarAsiento smallint not null CONSTRAINT DF_OrdenPagoTMP_opg_grabarAsiento  default (0),
	opg_firmado int not null CONSTRAINT DF_OrdenPagoTMP_opg_firmado  default (0),
	est_id int not null,
	suc_id int not null,
	prov_id int not null,
	doc_id int not null,
	ccos_id int null,
	lgj_id int null,
	oc_id int null,
	creado timestamptz not null CONSTRAINT DF_OrdenPagoTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_OrdenPagoTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_OrdenPagoTMP PRIMARY KEY  
(
	opgTMP_id 
) 
) 
;

;
/****** Object:  Table ListaPrecioMarcado    Script Date: 07/30/2012 17:16:21 ******/

;

;

;
create table ListaPrecioMarcado(
	lpm_id int not null,
	lpm_nombre varchar(100) not null,
	lpm_codigo varchar(15) not null,
	lpm_descrip varchar(50) not null CONSTRAINT DF_ListaPrecioMarcado_lpm_descrip  default (''),
	lpm_base decimal(18, 6) not null,
	lpm_porcentaje decimal(18, 6) not null,
	lpm_salto decimal(18, 6) not null,
	lpm_decremento decimal(18, 6) not null,
	lpm_porcminimo decimal(18, 6) not null,
	lpm_porcmaximo decimal(18, 6) not null,
	lpm_montominimo decimal(18, 6) not null,
	mon_id int not null,
	modificado timestamptz not null CONSTRAINT DF_ListaPrecioMarcado_modificado  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_ListaPrecioMarcado_creado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_ListaPrecioMarcado_activo  default (1),
 CONSTRAINT PK_ListaPrecioMarcado PRIMARY KEY  
(
	lpm_id 
) 
) 
;

;
/****** Object:  Table Tarifario    Script Date: 07/30/2012 17:31:24 ******/

;

;

;
create table Tarifario(
	tf_id int not null,
	tf_nombre varchar(100) not null,
	tf_codigo varchar(15) not null,
	tf_descrip varchar(255) not null CONSTRAINT DF_Tarifario_tf_descrip  default (''),
	ciu_id int null,
	creado timestamptz not null CONSTRAINT DF_Tarifario_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Tarifario_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Tarifario_activo  default (1),
 CONSTRAINT PK_Tarifario PRIMARY KEY  
(
	tf_id 
) 
) 
;

;
/****** Object:  Table AuditoriaNivel    Script Date: 07/30/2012 17:03:35 ******/

;

;

;
create table AuditoriaNivel(
	audn_id int not null,
	audn_nombre varchar(255) not null,
 CONSTRAINT PK_AuditoriaNivel PRIMARY KEY  
(
	audn_id 
) 
) 
;

;
/****** Object:  Table ComunidadInternetPregunta    Script Date: 07/30/2012 17:06:25 ******/

;

;

;
create table ComunidadInternetPregunta(
	cmip_id int not null,
	cmip_preguntaid varchar(255) not null,
	cmip_nick varchar(255) not null,
	cmip_pregunta varchar(4000) not null,
	cmip_respuesta varchar(4000) not null,
	cmip_descrip varchar(5000) not null CONSTRAINT DF_ComunidadInternetPregunta_cmip_descrip  default (''),
	cmip_fecha timestamptz not null,
	cmip_fecha_respuesta timestamptz not null,
	cmip_articuloid varchar(50) not null,
	cmip_articulo varchar(2000) not null CONSTRAINT DF_ComunidadInternetPregunta_cmip_articulo  default (''),
	cmi_id int not null,
	us_id_respondio int null,
	creado timestamptz not null CONSTRAINT DF_ComunidadInternetPregunta_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ComunidadInternetPregunta_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ComunidadInternetPregunta PRIMARY KEY  
(
	cmip_id 
) 
) 
;

;
/****** Object:  Table PedidoDevolucionVentaTMP    Script Date: 07/30/2012 17:21:42 ******/

;

;
create table PedidoDevolucionVentaTMP(
	pvTMP_id int not null,
	pvdvTMP_id int not null,
	pvdv_id int not null,
	pvdv_cantidad decimal(18, 6) not null CONSTRAINT DF_PedidoDevolucionVenta_pvdv_cantidad  default (0),
	pvi_id_pedido int not null,
	pvi_id_devolucion int not null,
 CONSTRAINT PK_PedidoDevolucionVenta PRIMARY KEY  
(
	pvdvTMP_id 
) 
) 
;
/****** Object:  Table LiquidacionCodigoTipo    Script Date: 07/30/2012 17:15:22 ******/

;

;

;
create table LiquidacionCodigoTipo(
	liqct_id int not null,
	liqct_nombre varchar(100) not null,
	liqct_codigo varchar(15) not null,
	liqct_descrip varchar(255) not null,
	modificado timestamptz not null CONSTRAINT DF_LiquidacionCodigoTipo_modificado  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_LiquidacionCodigoTipo_creado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_LiquidacionCodigoTipo_activo  default (1),
 CONSTRAINT PK_LiquidacionCodigoTipo PRIMARY KEY  
(
	liqct_id 
) 
) 
;

;
/****** Object:  Table BancoConciliacion    Script Date: 07/30/2012 17:03:48 ******/

;

;

;
create table BancoConciliacion(
	bcoc_id int not null,
	bcoc_numero int not null,
	bcoc_fecha timestamptz not null,
	bcoc_fechaDesde timestamptz not null,
	bcoc_fechaHasta timestamptz not null,
	bcoc_saldoInicialCont decimal(18, 6) not null,
	bcoc_saldoCont decimal(18, 6) not null,
	bcoc_saldoInicialBco decimal(18, 6) not null,
	bcoc_conciliadoBco decimal(18, 6) not null,
	bcoc_saldoBco decimal(18, 6) not null,
	bcoc_saldoInicialRech decimal(18, 6) not null,
	bcoc_rechazado decimal(18, 6) not null,
	bcoc_saldoRech decimal(18, 6) not null,
	bcoc_saldoInicialPendiente decimal(18, 6) not null,
	bcoc_pendiente decimal(18, 6) not null,
	bcoc_saldoPendiente decimal(18, 6) not null,
	bcoc_fechacheque smallint not null,
	bcoc_verpendientes smallint not null,
	bcoc_descrip varchar(5000) not null,
	cue_id int not null,
	creado timestamptz not null CONSTRAINT DF_BancoConciliacion_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_BancoConciliacion_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_BancoConciliacion PRIMARY KEY  
(
	bcoc_id 
) 
) 
;

;
/****** Object:  Table MovimientoFondoTMP    Script Date: 07/30/2012 17:17:35 ******/

;

;

;
create table MovimientoFondoTMP(
	rendTMP_id int not null CONSTRAINT DF_MovimientoFondoTMP_rendTMP_id  default (0),
	mfTMP_id int not null,
	mf_id int not null,
	mf_numero int not null,
	mf_nrodoc varchar(50) not null CONSTRAINT DF_MovimientoFondoTMP_mf_nrodoc  default (''),
	mf_descrip varchar(5000) not null CONSTRAINT DF_MovimientoFondoTMP_mf_descrip  default (''),
	mf_fecha timestamptz not null CONSTRAINT DF_MovimientoFondoTMP_mf_fecha  default (getdate()),
	mf_total decimal(18, 6) not null CONSTRAINT DF_MovimientoFondoTMP_mf_total  default (0),
	mf_totalorigen decimal(18, 6) not null CONSTRAINT DF_MovimientoFondoTMP_mf_totalorigen  default (0),
	mf_pendiente decimal(18, 6) not null CONSTRAINT DF_MovimientoFondoTMP_mf_pendiente  default (0),
	mf_firmado int not null CONSTRAINT DF_MovimientoFondoTMP_mf_firmado  default (0),
	mf_grabarasiento smallint not null CONSTRAINT DF_MovimientoFondoTMP_mf_grabarasiento  default (0),
	mf_cotizacion decimal(18, 6) not null CONSTRAINT DF_MovimientoFondoTMP_mf_cotizacion  default (0),
	est_id int not null,
	suc_id int not null,
	cli_id int null,
	doc_id int not null,
	ccos_id int null,
	us_id int null,
	as_id int null,
	lgj_id int null,
	creado timestamptz not null CONSTRAINT DF_MovimientoFondoTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_MovimientoFondoTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_MovimientoFondoTMP PRIMARY KEY  
(
	mfTMP_id 
) 
) 
;

;
/****** Object:  Table FacturaVentaAsiento    Script Date: 07/30/2012 17:12:10 ******/

;

;
create table FacturaVentaAsiento(
	fv_id int not null,
	fv_fecha timestamptz not null,
 CONSTRAINT PK_FacturaVentaAsiento PRIMARY KEY  
(
	fv_id 
) 
) 
;
/****** Object:  Table RubroTabla    Script Date: 07/30/2012 17:29:46 ******/

;

;

;
create table RubroTabla(
	rubt_id int not null,
	rubt_nombre varchar(255) not null,
	rubt_codigo varchar(50) not null,
	rubt_descrip varchar(255) not null CONSTRAINT DF_RubroTabla_rubt_descrip  default (''),
	creado timestamptz not null CONSTRAINT DF_RubroTabla_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_RubroTabla_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_RubroTabla_activo  default (1),
 CONSTRAINT PK_RubroTabla PRIMARY KEY  
(
	rubt_id 
) 
) 
;

;
/****** Object:  Table LiquidacionItemCodigoTMP    Script Date: 07/30/2012 17:15:41 ******/

;

;
create table LiquidacionItemCodigoTMP(
	liqcTMP_id int not null,
	liqi_id int not null,
	liqfi_id int not null,
	liqic_importe decimal(18, 6) not null CONSTRAINT DF_LiquidacionItemCodigoTMP_liqic_importe  default (0),
	liqic_unidades decimal(18, 6) not null CONSTRAINT DF_LiquidacionItemCodigoTMP_liqic_unidades  default (0),
 CONSTRAINT PK_LiquidacionItemCodigoTMP PRIMARY KEY  
(
	liqcTMP_id,
	liqi_id,
	liqfi_id 
) 
) 
;
/****** Object:  Table RamaConfig    Script Date: 07/30/2012 17:27:20 ******/

;

;

;
create table RamaConfig(
	ramc_aspecto varchar(150) not null,
	ramc_valor varchar(1500) not null CONSTRAINT DF_RamaConfig_ramc_valor  default (''),
	ram_id int not null,
 CONSTRAINT PK_RamaConfig PRIMARY KEY  
(
	ramc_aspecto 
) 
) 
;

;
/****** Object:  Table FacturaCompraAsiento    Script Date: 07/30/2012 17:10:59 ******/

;

;
create table FacturaCompraAsiento(
	fc_id int not null,
	fc_fecha timestamptz not null,
 CONSTRAINT PK_FacturaCompraAsiento PRIMARY KEY  
(
	fc_id 
) 
) 
;
/****** Object:  Table CobranzaAsiento    Script Date: 07/30/2012 17:05:38 ******/

;

;
create table CobranzaAsiento(
	cobz_id int not null,
	cobz_fecha timestamptz not null,
 CONSTRAINT PK_CobranzaAsiento PRIMARY KEY  
(
	cobz_id 
) 
) 
;
/****** Object:  Table formaPago    Script Date: 07/30/2012 17:13:07 ******/

;

;

;
create table formaPago(
	fp_id int not null,
	fp_nombre varchar(100) not null,
	fp_codigo varchar(15) not null,
	fp_descrip varchar(255) not null CONSTRAINT DF_FormaPago_fp_descrip  default (''),
	fp_lunes smallint not null,
	fp_martes smallint not null,
	fp_miercoles smallint not null,
	fp_jueves smallint not null,
	fp_viernes smallint not null,
	fp_sabado smallint not null,
	fp_domingo smallint not null,
	creado timestamptz not null CONSTRAINT DF_FormaPago_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_FormaPago_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_FormaPago_activo  default (1),
 CONSTRAINT PK_FormaPago PRIMARY KEY  
(
	fp_id 
) 
) 
;

;
/****** Object:  Table ArbolVista    Script Date: 07/30/2012 17:03:18 ******/

;

;

;
create table ArbolVista(
	arb_id int not null,
	arbv_id int not null,
	arbv_nombre varchar(100) not null,
	arbv_descrip varchar(255) not null CONSTRAINT DF_ArbolVista_arbv_descrip  default (''),
 CONSTRAINT PK_ArbolVista PRIMARY KEY  
(
	arbv_id 
) 
) 
;

;
/****** Object:  Table FacturaCompraTMP    Script Date: 07/30/2012 17:11:55 ******/

;

;

;
create table FacturaCompraTMP(
	opgTMP_id int not null CONSTRAINT DF_FacturaCompraTMP_opgTMP_id  default (0),
	fcTMP_id int not null,
	fc_id int not null,
	fc_numero int not null,
	fc_nrodoc varchar(50) not null CONSTRAINT DF_FacturaCompraTMP_fc_nrodoc  default (''),
	fc_descrip varchar(5000) not null CONSTRAINT DF_FacturaCompraTMP_fc_descrip  default (''),
	fc_fecha timestamptz not null CONSTRAINT DF_FacturaCompraTMP_fc_fecha  default (getdate()),
	fc_fechaentrega timestamptz not null CONSTRAINT DF_FacturaCompraTMP_fc_fechaentrega  default (getdate()),
	fc_fechaVto timestamptz not null CONSTRAINT DF_FacturaCompraTMP_fc_fechaVto  default ('19000101'),
	fc_fechaIva timestamptz not null CONSTRAINT DF_FacturaCompraTMP_fc_fechaIva  default (getdate()),
	fc_neto decimal(18, 6) not null CONSTRAINT DF_FacturaCompraTMP_fc_neto  default (0),
	fc_ivari decimal(18, 6) not null CONSTRAINT DF_FacturaCompraTMP_fc_impuesto  default (0),
	fc_ivarni decimal(18, 6) not null CONSTRAINT DF_FacturaCompraTMP_fc_ivarni  default (0),
	fc_internos decimal(18, 6) not null CONSTRAINT DF_FacturaCompraTMP_fc_internos  default (0),
	fc_subtotal decimal(18, 6) not null CONSTRAINT DF_FacturaCompraTMP_fc_subtotal  default (0),
	fc_totalotros decimal(18, 6) not null CONSTRAINT DF_FacturaCompraTMP_fc_totalotros  default (0),
	fc_totalpercepciones decimal(18, 6) not null CONSTRAINT DF_FacturaCompraTMP_fc_totalpercepciones  default (0),
	fc_total decimal(18, 6) not null CONSTRAINT DF_FacturaCompraTMP_fc_total  default (0),
	fc_totalorigen decimal(18, 6) not null CONSTRAINT DF_FacturaCompraTMP_fc_totalorigen  default (0),
	fc_pendiente decimal(18, 6) not null CONSTRAINT DF_FacturaCompraTMP_fc_pendiente  default (0),
	fc_firmado int not null CONSTRAINT DF_FacturaCompraTMP_fc_firmado  default (0),
	fc_descuento1 decimal(18, 6) not null CONSTRAINT DF_FacturaCompraTMP_fc_descuento  default (0),
	fc_descuento2 decimal(18, 6) not null CONSTRAINT DF_FacturaCompraTMP_fc_descuento2  default (0),
	fc_importedesc1 decimal(18, 6) not null CONSTRAINT DF_FacturaCompraTMP_fc_importedesc1  default (0),
	fc_importedesc2 decimal(18, 6) not null CONSTRAINT DF_FacturaCompraTMP_fc_importedesc2  default (0),
	fc_grabarasiento smallint not null CONSTRAINT DF_FacturaCompraTMP_fc_grabarasiento  default (0),
	fc_cotizacion decimal(18, 6) not null CONSTRAINT DF_FacturaCompraTMP_fc_cotizacion  default (0),
	fc_cotizacionprov decimal(18, 6) not null CONSTRAINT DF_FacturaCompraTMP_fc_cotizacionprov  default (0),
	fc_cai varchar(100) not null CONSTRAINT DF_FacturaCompraTMP_fc_cai  default (''),
	fc_tipocomprobante smallint not null CONSTRAINT DF_FacturaCompraTMP_fc_tipocomprobante  default (1),
	est_id int not null,
	suc_id int not null,
	prov_id int not null,
	doc_id int not null,
	lp_id int null,
	ld_id int null,
	cpg_id int not null,
	ccos_id int null,
	as_id int null,
	lgj_id int null,
	pro_id_origen int null,
	pro_id_destino int null,
	rc_id int null,
	st_id int null,
	depl_id int null,
	creado timestamptz not null CONSTRAINT DF_FacturaCompraTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_FacturaCompraTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_FacturaCompraTMP PRIMARY KEY  
(
	fcTMP_id 
) 
) 
;

;
/****** Object:  Table PedidoPackingListTMP    Script Date: 07/30/2012 17:21:51 ******/

;

;
create table PedidoPackingListTMP(
	pklstTMP_id int not null CONSTRAINT DF_PedidoPackingListTMP_pklstTMP_id  default (0),
	pvTMP_id int not null CONSTRAINT DF_PedidoPackingListTMP_pvTMP_id  default (0),
	pvpklstTMP_id int not null,
	pvpklst_id int not null,
	pvpklst_cantidad decimal(18, 6) not null CONSTRAINT DF_PedidoPackingListTMP_pvpklst_cantidad  default (0),
	pvi_id int not null,
	pklsti_id int not null,
 CONSTRAINT PK_PedidoPackingListTMP PRIMARY KEY  
(
	pvpklstTMP_id 
) 
) 
;
/****** Object:  Table Chequera    Script Date: 07/30/2012 17:04:51 ******/

;

;

;
create table Chequera(
	chq_id int not null,
	cue_id int not null,
	chq_codigo varchar(100) not null,
	chq_descrip varchar(255) not null CONSTRAINT DF_Chequera_chq_descripcion  default (''),
	chq_numerodesde int not null CONSTRAINT DF_Chequera_chq_numerodesde  default (0),
	chq_numerohasta int not null CONSTRAINT DF_Chequera_chq_numerohasta  default (0),
	chq_ultimonumero int not null,
	chq_default smallint not null,
	creado timestamptz not null CONSTRAINT DF_Chequera_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Chequera_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Chequera_activo  default (1),
 CONSTRAINT PK_Chequera PRIMARY KEY  
(
	chq_id 
) 
) 
;

;
/****** Object:  Table StockClienteTMP    Script Date: 07/30/2012 17:30:12 ******/

;

;

;
create table StockClienteTMP(
	stcliTMP_id int not null,
	stcli_numero int not null,
	stcli_nrodoc varchar(50) not null CONSTRAINT DF_StockClienteTMP_stcli_nrodoc  default (''),
	stcli_descrip varchar(5000) not null CONSTRAINT DF_StockClienteTMP_stcli_descrip  default (''),
	stcli_fecha timestamptz not null CONSTRAINT DF_StockClienteTMP_stcli_fecha  default (getdate()),
	stcli_id int not null,
	cli_id int null,
	depl_id_origen int not null,
	depl_id_destino int not null,
	suc_id int not null,
	lgj_id int null,
	doc_id int not null,
	doct_id int not null,
	creado timestamptz not null CONSTRAINT DF_StockClienteTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_StockClienteTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_StockClienteTMP PRIMARY KEY  
(
	stcliTMP_id 
) 
) 
;

;
/****** Object:  Table PedidoRemitoVentaTMP    Script Date: 07/30/2012 17:21:54 ******/

;

;
create table PedidoRemitoVentaTMP(
	pvTMP_id int not null CONSTRAINT DF_PedidoRemitoVentaTMP_pvTMP_id  default (0),
	rvTMP_id int not null CONSTRAINT DF_PedidoRemitoVentaTMP_rvTMP_id  default (0),
	pvrvTMP_id int not null,
	pvrv_id int not null,
	pvrv_cantidad decimal(18, 6) not null CONSTRAINT DF_PedidoRemitoVentaTMP_pvrv_cantidad  default (0),
	pvi_id int not null,
	rvi_id int not null,
 CONSTRAINT PK_PedidoRemitoVentaTMP PRIMARY KEY  
(
	pvrvTMP_id 
) 
) 
;
/****** Object:  Table PedidoCompraTMP    Script Date: 07/30/2012 17:21:34 ******/

;

;

;
create table PedidoCompraTMP(
	pcTMP_id int not null,
	pc_id int not null,
	pc_numero int not null,
	pc_nrodoc varchar(50) not null CONSTRAINT DF_PedidoCompraTMP_pc_nrodoc  default (''),
	pc_descrip varchar(5000) not null CONSTRAINT DF_PedidoCompraTMP_pc_descrip  default (''),
	pc_fecha timestamptz not null CONSTRAINT DF_PedidoCompraTMP_pc_fecha  default (getdate()),
	pc_fechaentrega timestamptz not null CONSTRAINT DF_PedidoCompraTMP_pc_fechaentrega  default (getdate()),
	pc_subtotal decimal(18, 6) not null CONSTRAINT DF_PedidoCompraTMP_pc_subtotal  default (0),
	pc_neto decimal(18, 6) not null CONSTRAINT DF_PedidoCompraTMP_pc_neto  default (0),
	pc_ivari decimal(18, 6) not null CONSTRAINT DF_PedidoCompraTMP_pc_impuesto  default (0),
	pc_ivarni decimal(18, 6) not null CONSTRAINT DF_PedidoCompraTMP_pc_ivarni  default (0),
	pc_total decimal(18, 6) not null CONSTRAINT DF_PedidoCompraTMP_pc_total  default (0),
	us_id int not null,
	est_id int not null,
	suc_id int not null,
	doc_id int not null,
	lp_id int null,
	ccos_id int null,
	lgj_id int null,
	creado timestamptz not null CONSTRAINT DF_PedidoCompraTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_PedidoCompraTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_PedidoCompraTMP PRIMARY KEY  
(
	pcTMP_id 
) 
) 
;

;
/****** Object:  Table OrdenCompra    Script Date: 07/30/2012 17:17:49 ******/

;

;

;
create table OrdenCompra(
	oc_id int not null,
	oc_numero int not null,
	oc_nrodoc varchar(50) not null CONSTRAINT DF_OrdenCompra_prsp_nrodoc  default (''),
	oc_descrip varchar(5000) not null CONSTRAINT DF_OrdenCompra_prsp_descrip  default (''),
	oc_fecha timestamptz not null CONSTRAINT DF_OrdenCompra_prsp_fecha  default (getdate()),
	oc_fechaentrega timestamptz not null CONSTRAINT DF_OrdenCompra_prsp_fechaentrega  default (getdate()),
	oc_neto decimal(18, 6) not null CONSTRAINT DF_OrdenCompra_prsp_neto  default (0),
	oc_ivari decimal(18, 6) not null CONSTRAINT DF_OrdenCompra_prsp_ivari  default (0),
	oc_ivarni decimal(18, 6) not null CONSTRAINT DF_OrdenCompra_prsp_ivarni  default (0),
	oc_total decimal(18, 6) not null CONSTRAINT DF_OrdenCompra_prsp_total  default (0),
	oc_subtotal decimal(18, 6) not null CONSTRAINT DF_OrdenCompra_oc_subtotal  default (0),
	oc_pendiente decimal(18, 6) not null CONSTRAINT DF_OrdenCompra_oc_pendiente  default (0),
	oc_descuento1 decimal(18, 6) not null CONSTRAINT DF_OrdenCompra_oc_descuento1  default (0),
	oc_descuento2 decimal(18, 6) not null CONSTRAINT DF_OrdenCompra_oc_descuento2  default (0),
	oc_importedesc1 decimal(18, 6) not null CONSTRAINT DF_OrdenCompra_oc_importedesc1  default (0),
	oc_importedesc2 decimal(18, 6) not null CONSTRAINT DF_OrdenCompra_oc_importedesc2  default (0),
	oc_firmado int not null CONSTRAINT DF_OrdenCompra_oc_firmado  default (0),
	oc_ordencompra varchar(50) not null CONSTRAINT DF_OrdenCompra_oc_ordencompra  default (''),
	oc_presupuesto varchar(50) not null CONSTRAINT DF_OrdenCompra_oc_presupuesto  default (''),
	oc_maquina varchar(255) not null CONSTRAINT DF_OrdenCompra_oc_maquina  default (''),
	oc_maquinanro varchar(50) not null CONSTRAINT DF_OrdenCompra_oc_maquinanro  default (''),
	oc_maquinamodelo varchar(50) not null CONSTRAINT DF_OrdenCompra_oc_maquinamodelo  default (''),
	oc_fleteaereo smallint not null CONSTRAINT DF_OrdenCompra_oc_fleteaereo  default (0),
	oc_fletemaritimo smallint not null CONSTRAINT DF_OrdenCompra_oc_fletemaritimo  default (0),
	oc_fletecorreo smallint not null CONSTRAINT DF_OrdenCompra_oc_fletecorreo  default (0),
	oc_fletecamion smallint not null CONSTRAINT DF_OrdenCompra_oc_fletecamion  default (0),
	oc_fleteotros smallint not null CONSTRAINT DF_OrdenCompra_oc_fleteotros  default (0),
	est_id int not null,
	ccos_id int null,
	suc_id int not null,
	prov_id int not null,
	cli_id int null,
	emp_id int not null,
	doc_id int not null,
	doct_id int not null,
	lp_id int null,
	ld_id int null,
	cpg_id int not null,
	lgj_id int null,
	creado timestamptz not null CONSTRAINT DF_OrdenCompra_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_OrdenCompra_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null CONSTRAINT DF__OrdenComp__impre__12DED342  default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_OrdenCompra PRIMARY KEY  
(
	oc_id 
),
 CONSTRAINT IX_OrdenCompra UNIQUE  
(
	oc_numero 
),
 CONSTRAINT IX_OrdenCompraNroDoc UNIQUE  
(
	emp_id,
	oc_nrodoc 
) 
) 
;

;
/****** Object:  Table Tabla    Script Date: 07/30/2012 17:30:49 ******/

;

;

;
create table Tabla(
	tbl_id int not null,
	tbl_nombre varchar(100) not null CONSTRAINT DF_Tabla_tbl_nombre  default (''),
	tbl_nombrefisico varchar(50) not null CONSTRAINT DF_Tabla_tbl_nombrefisico  default (''),
	tbl_campoId varchar(50) not null CONSTRAINT DF_Tabla_tbl_campoId  default (''),
	tbl_campocodigo varchar(50) not null CONSTRAINT DF_Tabla_tbl_campoAlias  default (''),
	tbl_sqlHelp varchar(5000) not null CONSTRAINT DF_Tabla_tbl_sqlHelp  default (''),
	tbl_sqlSearch varchar(5000) not null CONSTRAINT DF_Tabla_tbl_sqlSearch  default (''),
	tbl_tieneArbol smallint not null CONSTRAINT DF_Tabla_tbl_tieneArbol  default (0),
	tbl_tieneActivo smallint not null CONSTRAINT DF_Tabla_tbl_tieneActivo  default (1),
	tbl_campoNombre varchar(50) not null CONSTRAINT DF_Tabla_tbl_campoNombre  default (''),
	tbl_camposInView varchar(5000) not null CONSTRAINT DF_Tabla_tbl_camposInView  default (''),
	tbl_where varchar(255) not null CONSTRAINT DF_Tabla_tbl_where  default (''),
	tbl_helptop smallint not null CONSTRAINT DF_Tabla_tbl_helptop  default (0),
	tbl_objectEdit varchar(255) not null CONSTRAINT DF_Tabla_tbl_objectEdit  default (''),
	tbl_objectAbm varchar(255) not null CONSTRAINT DF_Tabla_tbl_objectAbm  default (''),
	tbl_spInfo varchar(255) not null CONSTRAINT DF_Tabla_tbl_spInfo  default (''),
	tbl_sqlHelpWeb varchar(1000) not null CONSTRAINT DF_Tabla_tbl_sqlHelpWeb  default (''),
	modificado timestamptz not null CONSTRAINT DF__tabla__modificad__4F73AB8D  default (getdate()),
	tbl_sqlHelpCliente varchar(5000) not null CONSTRAINT DF_Tabla_tbl_sqlHelp1  default (''),
	tbl_camposInViewCliente varchar(5000) not null CONSTRAINT DF_Tabla_tbl_camposInView1  default (''),
	pre_id int null,
 CONSTRAINT PK_Tabla PRIMARY KEY  
(
	tbl_id 
) 
) 
;

;
/****** Object:  Table ARBA_Deudores    Script Date: 07/30/2012 17:03:16 ******/

;

;

;
create table ARBA_Deudores(
	ARBAD_archivo varchar(50) not null,
	ARBAD_cuit varchar(50) not null,
	ARBAD_deuda decimal(18, 6) not null,
	ARBAD_nombre varchar(255) not null,
 CONSTRAINT PK_ARBA_Deudores PRIMARY KEY  
(
	ARBAD_cuit 
) 
) 
;

;
/****** Object:  Table DepartamentoTipo    Script Date: 07/30/2012 17:08:00 ******/

;

;

;
create table DepartamentoTipo(
	dptot_id int not null,
	dptot_nombre varchar(255) not null,
	dptot_codigo varchar(15) not null,
 CONSTRAINT PK_DepartamentoTipo PRIMARY KEY  
(
	dptot_id 
) 
) 
;

;
/****** Object:  Table AlarmaMailStock    Script Date: 07/30/2012 17:03:08 ******/

;

;
create table AlarmaMailStock(
	almst_id int  not null,
	almr_id_mail int not null,
	almst_fecha timestamptz not null,
	pr_id int not null,
	depl_id int null,
	depf_id int null,
 CONSTRAINT PK_AlarmaMailStock PRIMARY KEY  
(
	almst_id 
) 
) 
;
/****** Object:  Table webSeccion    Script Date: 07/30/2012 17:32:22 ******/

;

;

;
create table webSeccion(
	ws_id int not null,
	ws_nombre varchar(255) not null,
	creado timestamptz not null CONSTRAINT DF_webSeccion_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_webSeccion_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_webSeccion_activo  default (1),
 CONSTRAINT PK_webSeccion PRIMARY KEY  
(
	ws_id 
) 
) 
;

;
/****** Object:  Table InformeOrders    Script Date: 07/30/2012 17:14:50 ******/

;

;

;
create table InformeOrders(
	inf_id int not null,
	winfo_id int not null,
	winfo_nombre varchar(100) not null,
	creado timestamptz not null CONSTRAINT DF_InformeOrders_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_InformeOrders_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_InformeOrders PRIMARY KEY  
(
	winfo_id 
) 
) 
;

;
/****** Object:  Table InformeGroups    Script Date: 07/30/2012 17:14:47 ******/

;

;

;
create table InformeGroups(
	inf_id int not null,
	winfg_id int not null,
	winfg_nombre varchar(100) not null,
	winfg_pordefecto smallint not null CONSTRAINT DF_InformeGroups_winfg_pordefecto  default (0),
	creado timestamptz not null CONSTRAINT DF_InformeGroups_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_InformeGroups_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_InformeGroups PRIMARY KEY  
(
	winfg_id 
) 
) 
;

;
/****** Object:  Table EmpleadoFamiliaTipo    Script Date: 07/30/2012 17:09:45 ******/

;

;

;
create table EmpleadoFamiliaTipo(
	emft_id int not null,
	emft_nombre varchar(100) not null,
	emft_codigo varchar(15) not null,
 CONSTRAINT PK_EmpleadoFamiliaTipo PRIMARY KEY  
(
	emft_id 
) 
) 
;

;
/****** Object:  Table StockProveedorTMP    Script Date: 07/30/2012 17:30:32 ******/

;

;

;
create table StockProveedorTMP(
	stprovTMP_id int not null,
	stprov_numero int not null,
	stprov_nrodoc varchar(50) not null CONSTRAINT DF_StockProveedorTMP_stprov_nrodoc  default (''),
	stprov_descrip varchar(5000) not null CONSTRAINT DF_StockProveedorTMP_stprov_descrip  default (''),
	stprov_fecha timestamptz not null CONSTRAINT DF_StockProveedorTMP_stprov_fecha  default (getdate()),
	stprov_id int not null,
	prov_id int null,
	depl_id_origen int not null,
	depl_id_destino int not null,
	suc_id int not null,
	lgj_id int null,
	doc_id int not null,
	doct_id int not null,
	creado timestamptz not null CONSTRAINT DF_StockProveedorTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_StockProveedorTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_StockProveedorTMP PRIMARY KEY  
(
	stprovTMP_id 
) 
) 
;

;
/****** Object:  Table PedidoFacturaVentaTMP    Script Date: 07/30/2012 17:21:45 ******/

;

;
create table PedidoFacturaVentaTMP(
	pvTMP_id int not null CONSTRAINT DF_PedidoFacturaVentaTMP_pvTMP_id  default (0),
	fvTMP_id int not null CONSTRAINT DF_PedidoFacturaVentaTMP_fvTMP_id  default (0),
	rvTMP_id int not null CONSTRAINT DF_PedidoFacturaVentaTMP_rvTMP_id  default (0),
	pvfvTMP_id int not null,
	pvfv_id int not null,
	pvfv_cantidad decimal(18, 6) not null CONSTRAINT DF_PedidoFacturaVentaTMP_pvfv_cantidad  default (0),
	pvi_id int not null,
	fvi_id int not null,
 CONSTRAINT PK_PedidoFacturaVentaTMP PRIMARY KEY  
(
	pvfvTMP_id 
) 
) 
;
/****** Object:  Table Escala    Script Date: 07/30/2012 17:10:28 ******/

;

;

;
create table Escala(
	esc_id int not null,
	esc_nombre varchar(100) not null,
	esc_codigo varchar(15) not null,
	creado timestamptz not null CONSTRAINT DF_Escala_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Escala_modificado  default (getdate()),
	modifico int not null CONSTRAINT DF_Escala_modifico  default (0),
	activo smallint not null CONSTRAINT DF_Escala_activo  default (1),
 CONSTRAINT PK_Escala PRIMARY KEY  
(
	esc_id 
) 
) 
;

;
/****** Object:  Table ProductoNumeroSerieServicio    Script Date: 07/30/2012 17:26:16 ******/

;

;

;
create table ProductoNumeroSerieServicio(
	prnss_id int not null,
	prns_codigo4 varchar(255) not null CONSTRAINT DF_ProductoNumeroSerieServicio_prns_codigo4  default (''),
	prns_codigo5 varchar(255) not null CONSTRAINT DF_ProductoNumeroSerieServicio_prns_codigo5  default (''),
	prns_codigo6 varchar(255) not null CONSTRAINT DF_ProductoNumeroSerieServicio_prns_codigo6  default (''),
	prns_codigo7 varchar(255) not null CONSTRAINT DF_ProductoNumeroSerieServicio_prns_codigo7  default (''),
	prns_id_reemplazo int null,
	os_id int null,
	prp_id int null,
	stprov_id int null,
	cli_id int null,
	cont_id int null,
	prov_id int null,
	etf_id int null,
	tar_id_activa int null,
	rv_id int null,
 CONSTRAINT PK_ProductoNumeroSerieServicio PRIMARY KEY  
(
	prnss_id 
) 
) 
;

;
/****** Object:  Table AvisoTipo    Script Date: 07/30/2012 17:03:41 ******/

;

;

;
create table AvisoTipo(
	avt_id int not null,
	avt_nombre varchar(255) not null,
	avt_objetoEdicion varchar(255) not null CONSTRAINT DF_AvisoTipo_avt_objetoEdicion  default (''),
	avt_objetoInit varchar(255) not null CONSTRAINT DF_AvisoTipo_avt_objetoInit  default (''),
	avt_spinfo varchar(100) not null CONSTRAINT DF_AvisoTipo_avt_columnaNombre  default (''),
 CONSTRAINT PK_AvisoTipo PRIMARY KEY  
(
	avt_id 
) 
) 
;

;
/****** Object:  Table PresupuestoVentaTMP    Script Date: 07/30/2012 17:25:00 ******/

;

;

;
create table PresupuestoVentaTMP(
	prvTMP_id int not null,
	prv_id int not null,
	prv_numero int not null,
	prv_nrodoc varchar(50) not null CONSTRAINT DF_PresupuestoVentaTMP_prv_nrodoc  default (''),
	prv_descrip varchar(5000) not null CONSTRAINT DF_PresupuestoVentaTMP_prv_descrip  default (''),
	prv_fecha timestamptz not null CONSTRAINT DF_PresupuestoVentaTMP_prv_fecha  default (getdate()),
	prv_fechaentrega timestamptz not null CONSTRAINT DF_PresupuestoVentaTMP_prv_fechaentrega  default (getdate()),
	prv_subtotal decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaTMP_prv_subtotal  default (0),
	prv_neto decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaTMP_prv_neto  default (0),
	prv_ivari decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaTMP_prv_impuesto  default (0),
	prv_ivarni decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaTMP_prv_ivarni  default (0),
	prv_total decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaTMP_prv_total  default (0),
	prv_descuento1 decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaTMP_prv_descuento1  default (0),
	prv_descuento2 decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaTMP_prv_descuento2  default (0),
	prv_importedesc1 decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaTMP_prv_descuento11  default (0),
	prv_importedesc2 decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaTMP_prv_descuento21  default (0),
	est_id int not null,
	suc_id int not null,
	cli_id int not null,
	doc_id int not null,
	lp_id int null,
	ld_id int null,
	cpg_id int not null,
	ccos_id int null,
	ven_id int null,
	lgj_id int null,
	pro_id_origen int null,
	pro_id_destino int null,
	trans_id int null,
	clis_id int null,
	prov_id int null,
	cont_id int null,
	creado timestamptz not null CONSTRAINT DF_PresupuestoVentaTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_PresupuestoVentaTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_PresupuestoVentaTMP PRIMARY KEY  
(
	prvTMP_id 
) 
) 
;

;
/****** Object:  Table Encuesta    Script Date: 07/30/2012 17:10:15 ******/

;

;

;
create table Encuesta(
	ec_id int not null,
	ec_nombre varchar(255) not null,
	ec_FechaDesde timestamptz not null CONSTRAINT DF_Encuesta_ec_FechaDesde  default (getdate()),
	ec_FechaHasta timestamptz not null CONSTRAINT DF_Encuesta_ec_FechaHasta  default (getdate()),
	ec_anonimo smallint not null CONSTRAINT DF_Encuesta_ec_permiteAnonimo  default (0),
	ec_descrip varchar(255) not null CONSTRAINT DF_Encuesta_ec_descrip  default (''),
	modificado timestamptz not null CONSTRAINT DF_Encuesta_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Encuesta_activo  default (1),
	creado timestamptz not null CONSTRAINT DF_Encuesta_creado  default (getdate()),
 CONSTRAINT PK_Encuesta PRIMARY KEY  
(
	ec_id 
) 
) 
;

;
/****** Object:  Table CashFlow    Script Date: 07/30/2012 17:04:12 ******/

;

;

;
create table CashFlow(
	cf_id int not null,
	cf_nombre varchar(255) not null,
	cf_fecha timestamptz not null,
	cf_descrip varchar(5000) not null,
	cf_fechadesde timestamptz not null,
	cf_fechahasta timestamptz not null,
	cf_fechacheque smallint not null,
	cf_fv smallint not null,
	cf_rv smallint not null,
	cf_pv smallint not null,
	cf_fc smallint not null,
	cf_rc smallint not null,
	cf_oc smallint not null,
	cue_id int null,
	creado timestamptz not null CONSTRAINT DF_CashFlow_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_CashFlow_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_CashFlow PRIMARY KEY  
(
	cf_id 
) 
) 
;

;
/****** Object:  Table Zona    Script Date: 07/30/2012 17:32:24 ******/

;

;

;
create table Zona(
	zon_id int not null,
	zon_nombre varchar(100) not null,
	zon_descrip varchar(255) not null CONSTRAINT DF_Zona_zon_descrip  default (''),
	zon_codigo varchar(15) not null,
	zon_precio decimal(18, 6) not null CONSTRAINT DF_Zona_zon_precio  default (0),
	pr_id int null,
	creado timestamptz not null CONSTRAINT DF_Zona_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Zona_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Zona_activo  default (0),
 CONSTRAINT PK_Zona PRIMARY KEY  
(
	zon_id 
) 
) 
;

;
/****** Object:  Table Mail    Script Date: 07/30/2012 17:16:27 ******/

;

;

;
create table Mail(
	mail_id int not null,
	mail_nombre varchar(100) not null,
	mail_codigo varchar(15) not null,
	mail_descrip varchar(255) not null CONSTRAINT DF_Mail_mail_descrip  default (''),
	mail_emailTo varchar(1000) not null,
	mail_emailCc varchar(1000) not null CONSTRAINT DF_Mail_mail_emailCc  default (''),
	mail_tipo smallint not null,
	activo smallint not null CONSTRAINT DF_Mail_activo  default (1),
	creado timestamptz not null CONSTRAINT DF_Mail_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Mail_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_Mail PRIMARY KEY  
(
	mail_id 
) 
) 
;

;
/****** Object:  Table IdAsiento    Script Date: 07/30/2012 17:13:53 ******/

;

;

;
create table IdAsiento(
	Id_Tabla varchar(50) not null,
	Id_NextId int not null,
	Id_CampoId varchar(50) not null,
	Id_Rango int not null CONSTRAINT DF_IdAsiento_Id_Rango  default (0)
) 
;

;
/****** Object:  Table OrdenServicioTMP    Script Date: 07/30/2012 17:19:35 ******/

;

;

;
create table OrdenServicioTMP(
	osTMP_id int not null,
	os_id int not null,
	os_numero int not null,
	os_nrodoc varchar(50) not null CONSTRAINT DF_OrdenServicioTMP_os_nrodoc  default (''),
	os_descrip varchar(5000) not null CONSTRAINT DF_OrdenServicioTMP_os_descrip  default (''),
	os_fecha timestamptz not null CONSTRAINT DF_OrdenServicioTMP_os_fecha  default (getdate()),
	os_hora smallint not null CONSTRAINT DF_OrdenServicioTMP_os_hora  default (0),
	os_fechaentrega timestamptz not null CONSTRAINT DF_OrdenServicioTMP_os_fechaentrega  default (getdate()),
	os_neto decimal(18, 6) not null CONSTRAINT DF_OrdenServicioTMP_os_neto  default (0),
	os_ivari decimal(18, 6) not null CONSTRAINT DF_OrdenServicioTMP_os_ivari  default (0),
	os_ivarni decimal(18, 6) not null CONSTRAINT DF_OrdenServicioTMP_os_ivarni  default (0),
	os_subtotal decimal(18, 6) not null CONSTRAINT DF_OrdenServicioTMP_os_subtotal  default (0),
	os_total decimal(18, 6) not null CONSTRAINT DF_OrdenServicioTMP_os_total  default (0),
	os_descuento1 decimal(18, 6) not null CONSTRAINT DF_OrdenServicioTMP_os_descuento1  default (0),
	os_descuento2 decimal(18, 6) not null CONSTRAINT DF_OrdenServicioTMP_os_descuento2  default (0),
	os_importedesc1 decimal(18, 6) not null CONSTRAINT DF_OrdenServicioTMP_os_importedesc1  default (0),
	os_importedesc2 decimal(18, 6) not null CONSTRAINT DF_OrdenServicioTMP_os_importedesc2  default (0),
	os_cotizacion decimal(18, 6) not null CONSTRAINT DF_OrdenServicioTMP_os_cotizacion  default (0),
	est_id int not null,
	suc_id int not null,
	cli_id int not null,
	clis_id int null,
	cont_id int null,
	doc_id int not null,
	proy_id int null,
	lp_id int null,
	ld_id int null,
	lgj_id int null,
	cpg_id int null,
	ccos_id int null,
	st_id int null,
	us_id_tecnico int null,
	depl_id int null,
	prio_id int null,
	inct_id int null,
	inca_id int null,
	zon_id int null,
	creado timestamptz not null CONSTRAINT DF_OrdenServicioTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_OrdenServicioTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_OrdenServicioTMP PRIMARY KEY  
(
	osTMP_id 
) 
) 
;

;
/****** Object:  Table CentroCosto    Script Date: 07/30/2012 17:04:40 ******/

;

;

;
create table CentroCosto(
	ccos_id int not null,
	ccos_nombre varchar(100) not null,
	ccos_codigo varchar(15) not null,
	ccos_descrip varchar(255) not null CONSTRAINT DF_CentroCosto_ccos_descripcion  default (''),
	ccos_compra smallint not null CONSTRAINT DF_CentroCosto_ccos_compra  default (0),
	ccos_venta smallint not null CONSTRAINT DF_CentroCosto_ccos_venta  default (0),
	ccos_id_padre int null,
	creado timestamptz not null CONSTRAINT DF_CentroCosto_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_CentroCosto_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_CentroCosto_activo  default (1),
 CONSTRAINT PK_CentroCosto PRIMARY KEY  
(
	ccos_id 
) 
) 
;

;
/****** Object:  Table OrdenFacturaCompra    Script Date: 07/30/2012 17:18:12 ******/

;

;
create table OrdenFacturaCompra(
	ocfc_id int not null,
	ocfc_cantidad decimal(18, 6) not null CONSTRAINT DF_OrdenFacturaCompra_ocfc_cantidad  default (0),
	oci_id int not null,
	fci_id int not null,
 CONSTRAINT PK_OrdenFacturaCompra PRIMARY KEY  
(
	ocfc_id 
) 
) 
;
/****** Object:  Table IdStock    Script Date: 07/30/2012 17:13:56 ******/

;

;

;
create table IdStock(
	Id_Tabla varchar(50) not null,
	Id_NextId int not null,
	Id_CampoId varchar(50) not null,
	Id_Rango int not null CONSTRAINT DF_IdStock_Id_Rango  default (0)
) 
;

;
/****** Object:  Table CatalogoWebProductoTag    Script Date: 07/30/2012 17:04:28 ******/

;

;
create table CatalogoWebProductoTag(
	catw_id int not null,
	prt_id int not null,
 CONSTRAINT PK_CatalogoWebProductoTag PRIMARY KEY  
(
	catw_id,
	prt_id 
) 
) 
;
/****** Object:  Table OrdenFacturaCompraTMP    Script Date: 07/30/2012 17:18:13 ******/

;

;
create table OrdenFacturaCompraTMP(
	ocTMP_id int not null CONSTRAINT DF_OrdenFacturaCompraTMP_ocTMP_id  default (0),
	fcTMP_id int not null CONSTRAINT DF_OrdenFacturaCompraTMP_fcTMP_id  default (0),
	ocfcTMP_id int not null,
	ocfc_id int not null,
	ocfc_cantidad decimal(18, 6) not null CONSTRAINT DF_OrdenFacturaCompraTMP_ocfc_cantidad  default (0),
	oci_id int not null,
	fci_id int not null,
 CONSTRAINT PK_OrdenFacturaCompraTMP PRIMARY KEY  
(
	ocfcTMP_id 
) 
) 
;
/****** Object:  Table PermisoEmbarqueTMP    Script Date: 07/30/2012 17:22:56 ******/

;

;

;
create table PermisoEmbarqueTMP(
	pembTMP_id int not null,
	pemb_id int not null,
	pemb_numero int not null,
	pemb_nrodoc varchar(100) not null CONSTRAINT DF_PermisoEmbarqueTMP_pemb_nrodoc  default (''),
	pemb_descrip varchar(255) not null CONSTRAINT DF_PermisoEmbarqueTMP_pemb_descrip  default (''),
	pemb_fecha timestamptz not null,
	pemb_cotizacion decimal(18, 6) not null CONSTRAINT DF_PermisoEmbarqueTMP_pemb_cotizacion  default (0),
	pemb_total decimal(18, 6) not null CONSTRAINT DF_PermisoEmbarqueTMP_pemb_total  default (0),
	pemb_totalorigen decimal(18, 6) not null CONSTRAINT DF_PermisoEmbarqueTMP_pemb_totalorigen  default (0),
	pemb_firmado int not null CONSTRAINT DF_PermisoEmbarqueTMP_pemb_firmado  default (0),
	pemb_pendiente decimal(18, 6) not null CONSTRAINT DF_PermisoEmbarqueTMP_pemb_pendiente  default (0),
	est_id int not null,
	suc_id int not null,
	doc_id int not null,
	doct_id int not null,
	emb_id int not null,
	bco_id int not null,
	adu_id int not null,
	lp_id int null,
	lgj_id int null,
	ccos_id int null,
	creado timestamptz not null CONSTRAINT DF_PermisoEmbarqueTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_PermisoEmbarqueTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_PermisoEmbarqueTMP PRIMARY KEY  
(
	pembTMP_id 
) 
) 
;

;
/****** Object:  Table DocumentoGrupo    Script Date: 07/30/2012 17:09:07 ******/

;

;

;
create table DocumentoGrupo(
	docg_id int not null,
	docg_nombre varchar(100) not null,
	docg_codigo varchar(15) not null,
	docg_descrip varchar(255) not null,
	creado timestamptz not null CONSTRAINT DF_DocumentoGrupo_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_DocumentoGrupo_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_DocumentoGrupo_activo  default (1),
 CONSTRAINT PK_DocumentoGrupo PRIMARY KEY  
(
	docg_id 
) 
) 
;

;
/****** Object:  Table OrdenRemitoCompraTMP    Script Date: 07/30/2012 17:18:52 ******/

;

;
create table OrdenRemitoCompraTMP(
	ocTMP_id int not null CONSTRAINT DF_OrdenRemitoCompraTMP_ocTMP_id  default (0),
	rcTMP_id int not null CONSTRAINT DF_OrdenRemitoCompraTMP_rcTMP_id  default (0),
	ocrcTMP_id int not null,
	ocrc_id int not null,
	ocrc_cantidad decimal(18, 6) not null CONSTRAINT DF_OrdenRemitoCompraTMP_ocrc_cantidad  default (0),
	oci_id int not null,
	rci_id int not null,
 CONSTRAINT PK_OrdenRemitoCompraTMP PRIMARY KEY  
(
	ocrcTMP_id 
) 
) 
;
/****** Object:  Table EjercicioAsientoResumen    Script Date: 07/30/2012 17:09:13 ******/

;

;

;
create table EjercicioAsientoResumen(
	ejc_id int not null,
	ejcas_id int not null,
	ejcas_fecha timestamptz not null,
	ejcas_nrodoc varchar(50) not null,
	ejcas_tipo smallint not null,
 CONSTRAINT PK_EjercicioAsientoResumen PRIMARY KEY  
(
	ejcas_id 
) 
) 
;

;
/****** Object:  Table NivelEstudio    Script Date: 07/30/2012 17:17:37 ******/

;

;

;
create table NivelEstudio(
	nive_id int not null,
	nive_nombre varchar(100) not null,
	nive_codigo varchar(15) not null,
	nive_descrip varchar(255) not null CONSTRAINT DF_NivelEstudio_nive_descrip  default (''),
	creado timestamptz not null CONSTRAINT DF_NivelEstudio_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_NivelEstudio_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_NivelEstudio_activo  default (1),
 CONSTRAINT PK_NivelEstudio PRIMARY KEY  
(
	nive_id 
) 
) 
;

;
/****** Object:  Table LiquidacionItem    Script Date: 07/30/2012 17:15:37 ******/

;

;

;
create table LiquidacionItem(
	liq_id int not null,
	liqi_id int not null,
	liqi_importe decimal(18, 6) not null CONSTRAINT DF_LiquidacionItem_liqi_importe  default (0),
	liqi_importeorigen decimal(18, 6) not null CONSTRAINT DF_LiquidacionItem_liqi_importeorigen  default (0),
	liqi_impuesto decimal(18, 6) not null CONSTRAINT DF_LiquidacionItem_liqi_impuesto  default (0),
	liqi_descrip varchar(5000) not null CONSTRAINT DF_LiquidacionItem_liqi_descrip  default (''),
	liqi_orden smallint not null,
	liqi_nrodoc varchar(50) not null CONSTRAINT DF_LiquidacionItem_liqi_nrodoc  default (''),
	em_id int not null,
 CONSTRAINT PK_LiquidacionItem PRIMARY KEY  
(
	liqi_id 
) 
) 
;

;
/****** Object:  Table ImportacionTempTMP    Script Date: 07/30/2012 17:14:40 ******/

;

;

;
create table ImportacionTempTMP(
	imptTMP_id int not null,
	impt_id int not null,
	impt_numero int not null,
	impt_nrodoc varchar(50) not null CONSTRAINT DF_ImportacionTempTMP_impt_nrodoc  default (''),
	impt_despachonro varchar(50) not null CONSTRAINT DF_ImportacionTempTMP_impt_despachonro  default (''),
	impt_descrip varchar(5000) not null CONSTRAINT DF_ImportacionTempTMP_impt_descrip  default (''),
	impt_fecha timestamptz not null CONSTRAINT DF_ImportacionTempTMP_impt_fecha  default (getdate()),
	impt_fechaentrega timestamptz not null CONSTRAINT DF_ImportacionTempTMP_impt_fechaentrega  default (getdate()),
	impt_fechaoficial timestamptz not null CONSTRAINT DF_ImportacionTempTMP_impt_fechaoficial  default (getdate()),
	impt_neto decimal(18, 6) not null CONSTRAINT DF_ImportacionTempTMP_impt_neto  default (0),
	impt_ivari decimal(18, 6) not null CONSTRAINT DF_ImportacionTempTMP_impt_ivari  default (0),
	impt_ivarni decimal(18, 6) not null CONSTRAINT DF_ImportacionTempTMP_impt_ivarni  default (0),
	impt_subtotal decimal(18, 6) not null CONSTRAINT DF_ImportacionTempTMP_impt_subtotal  default (0),
	impt_total decimal(18, 6) not null CONSTRAINT DF_ImportacionTempTMP_impt_total  default (0),
	impt_descuento1 decimal(18, 6) not null CONSTRAINT DF_ImportacionTempTMP_impt_descuento1  default (0),
	impt_descuento2 decimal(18, 6) not null CONSTRAINT DF_ImportacionTempTMP_impt_descuento2  default (0),
	impt_importedesc1 decimal(18, 6) not null CONSTRAINT DF_ImportacionTempTMP_impt_importedesc1  default (0),
	impt_importedesc2 decimal(18, 6) not null CONSTRAINT DF_ImportacionTempTMP_impt_importedesc2  default (0),
	impt_seguro decimal(18, 6) not null CONSTRAINT DF_ImportacionTempTMP_impt_seguro  default (0),
	impt_flete decimal(18, 6) not null CONSTRAINT DF_ImportacionTempTMP_impt_flete  default (0),
	est_id int not null,
	suc_id int not null,
	prov_id int not null,
	doc_id int not null,
	doct_id int not null,
	lp_id int null,
	ld_id int null,
	lgj_id int null,
	cpg_id int null,
	ccos_id int null,
	st_id int null,
	depl_id int null,
	creado timestamptz not null CONSTRAINT DF_ImportacionTempTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ImportacionTempTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ImportacionTempTMP PRIMARY KEY  
(
	imptTMP_id 
) 
) 
;

;
/****** Object:  Table PackingListTMP    Script Date: 07/30/2012 17:20:11 ******/

;

;

;
create table PackingListTMP(
	pklstTMP_id int not null,
	pklst_id int not null,
	pklst_numero int not null,
	pklst_nrodoc varchar(20) not null CONSTRAINT DF_PackingListTMP_pklst_nrodoc  default (''),
	pklst_fecha timestamptz not null CONSTRAINT DF_PackingListTMP_pklst_fecha  default (getdate()),
	pklst_fechaentrega timestamptz not null CONSTRAINT DF_PackingListTMP_pklst_fechaentrega  default (getdate()),
	pklst_cantidad int not null CONSTRAINT DF_PackingListTMP_pklst_cantidad  default (0),
	pklst_pallets int not null CONSTRAINT DF_PackingListTMP_pklst_pallet  default (0),
	pklst_pendiente decimal(18, 6) not null CONSTRAINT DF_PackingListTMP_pklst_pendiente  default (0),
	pklst_descrip varchar(255) not null CONSTRAINT DF_PackingListTMP_pklst_descrip  default (''),
	pklst_marca varchar(255) not null CONSTRAINT DF_PackingListTMP_pklst_marca  default (''),
	pklst_firmado int not null CONSTRAINT DF_PackingListTMP_pklst_firmado  default (0),
	pklst_neto decimal(18, 6) not null CONSTRAINT DF_PackingListTMP_pklst_neto  default (0),
	pklst_ivari decimal(18, 6) not null CONSTRAINT DF_PackingListTMP_pklst_ivari  default (0),
	pklst_ivarni decimal(18, 6) not null CONSTRAINT DF_PackingListTMP_pklst_ivarni  default (0),
	pklst_subtotal decimal(18, 6) not null CONSTRAINT DF_PackingListTMP_pklst_subtotal  default (0),
	pklst_total decimal(18, 6) not null CONSTRAINT DF_PackingListTMP_pklst_total  default (0),
	pklst_descuento1 decimal(18, 6) not null CONSTRAINT DF_PackingListTMP_pklst_descuento1  default (0),
	pklst_descuento2 decimal(18, 6) not null CONSTRAINT DF_PackingListTMP_pklst_descuento2  default (0),
	pklst_importedesc1 decimal(18, 6) not null CONSTRAINT DF_PackingListTMP_pklst_importedesc1  default (0),
	pklst_importedesc2 decimal(18, 6) not null CONSTRAINT DF_PackingListTMP_pklst_importedesc2  default (0),
	est_id int not null,
	suc_id int not null,
	doc_id int not null,
	ccos_id int null,
	cli_id int not null,
	barc_id int null,
	pue_id_origen int null,
	pue_id_destino int null,
	lp_id int null,
	ld_id int null,
	lgj_id int null,
	cpg_id int null,
	creado timestamptz not null CONSTRAINT DF_PackingListTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_PackingListTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_PackingListTMP PRIMARY KEY  
(
	pklstTMP_id 
) 
) 
;

;
/****** Object:  Table ParteReparacionTMP    Script Date: 07/30/2012 17:21:13 ******/

;

;

;
create table ParteReparacionTMP(
	prpTMP_id int not null,
	prp_id int not null,
	prp_numero int not null,
	prp_nrodoc varchar(50) not null CONSTRAINT DF_ParteReparacionTMP_prp_nrodoc  default (''),
	prp_descrip varchar(5000) not null CONSTRAINT DF_ParteReparacionTMP_prp_descrip  default (''),
	prp_fecha timestamptz not null CONSTRAINT DF_ParteReparacionTMP_prp_fecha  default (getdate()),
	prp_fechaentrega timestamptz not null CONSTRAINT DF_ParteReparacionTMP_prp_fechaentrega  default (getdate()),
	prp_neto decimal(18, 6) not null CONSTRAINT DF_ParteReparacionTMP_prp_neto  default (0),
	prp_ivari decimal(18, 6) not null CONSTRAINT DF_ParteReparacionTMP_prp_ivari  default (0),
	prp_ivarni decimal(18, 6) not null CONSTRAINT DF_ParteReparacionTMP_prp_ivarni  default (0),
	prp_subtotal decimal(18, 6) not null CONSTRAINT DF_ParteReparacionTMP_prp_subtotal  default (0),
	prp_total decimal(18, 6) not null CONSTRAINT DF_ParteReparacionTMP_prp_total  default (0),
	prp_descuento1 decimal(18, 6) not null CONSTRAINT DF_ParteReparacionTMP_prp_descuento1  default (0),
	prp_descuento2 decimal(18, 6) not null CONSTRAINT DF_ParteReparacionTMP_prp_descuento2  default (0),
	prp_importedesc1 decimal(18, 6) not null CONSTRAINT DF_ParteReparacionTMP_prp_importedesc1  default (0),
	prp_importedesc2 decimal(18, 6) not null CONSTRAINT DF_ParteReparacionTMP_prp_importedesc2  default (0),
	prp_cotizacion decimal(18, 6) not null CONSTRAINT DF_ParteReparacionTMP_prp_cotizacion  default (0),
	prp_tipo smallint not null CONSTRAINT DF_ParteReparacionTMP_prp_tipo  default (1),
	prp_estado smallint not null CONSTRAINT DF_ParteReparacionTMP_prp_aprobado  default (1),
	est_id int not null,
	suc_id int not null,
	cli_id int not null,
	doc_id int not null,
	prns_id int not null,
	lp_id int null,
	ld_id int null,
	lgj_id int null,
	cpg_id int null,
	ccos_id int null,
	st_id int null,
	depl_id int null,
	us_id int null,
	clis_id int null,
	cont_id int null,
	creado timestamptz not null CONSTRAINT DF_ParteReparacionTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ParteReparacionTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ParteReparacionTMP PRIMARY KEY  
(
	prpTMP_id 
) 
) 
;

;
/****** Object:  Table Estado    Script Date: 07/30/2012 17:10:32 ******/

;

;

;
create table Estado(
	est_id int not null,
	est_nombre varchar(100) not null CONSTRAINT DF_Estado_est_nombre  default (''),
	est_codigo varchar(50) not null CONSTRAINT DF_Estado_est_alias  default (''),
	est_descrip varchar(100) not null CONSTRAINT DF_Estado_est_descrip  default (''),
	creado timestamptz not null,
	modificado timestamptz not null,
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Estado_activo  default (1),
 CONSTRAINT PK_Estado PRIMARY KEY  
(
	est_id 
) 
) 
;

;
/****** Object:  Table ImportacionIDTipo    Script Date: 07/30/2012 17:14:00 ******/

;

;

;
create table ImportacionIDTipo(
	impidt_id int not null,
	impidt_nombre varchar(255) not null,
 CONSTRAINT PK_ImportacionIDTipo PRIMARY KEY  
(
	impidt_id 
) 
) 
;

;
/****** Object:  Table FacturaElectronica    Script Date: 07/30/2012 17:11:56 ******/

;

;
create table FacturaElectronica(
	fvfe_id int not null,
	fv_id int not null,
	creado timestamptz not null CONSTRAINT DF_FacturaElectronica_creado  default (getdate()),
	fvfe_rechazado smallint not null default (0),
	fvfe_procesado smallint not null default (0),
 CONSTRAINT PK_FacturaElectronica PRIMARY KEY  
(
	fvfe_id 
) 
) 
;
/****** Object:  Table Profesion    Script Date: 07/30/2012 17:26:33 ******/

;

;

;
create table Profesion(
	profe_id int not null,
	profe_nombre varchar(100) not null,
	profe_codigo varchar(15) not null,
	profe_descrip varchar(255) not null CONSTRAINT DF_Profesion_profe_descrip  default (''),
	creado timestamptz not null CONSTRAINT DF_Profesion_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Profesion_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Profesion_activo  default (1),
 CONSTRAINT PK_Profesion PRIMARY KEY  
(
	profe_id 
) 
) 
;

;
/****** Object:  Table EmpleadoART    Script Date: 07/30/2012 17:09:37 ******/

;

;

;
create table EmpleadoART(
	ema_id int not null,
	ema_nombre varchar(100) not null,
	ema_codigo varchar(15) not null,
	ema_descrip varchar(5000) not null,
	creado timestamptz not null CONSTRAINT DF_EmpleadoAseguradora_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_EmpleadoAseguradora_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_EmpleadoAseguradora_activo  default (1),
 CONSTRAINT PK_EmpleadoAseguradora PRIMARY KEY  
(
	ema_id 
) 
) 
;

;
/****** Object:  Table PedidoOrdenCompraTMP    Script Date: 07/30/2012 17:21:48 ******/

;

;
create table PedidoOrdenCompraTMP(
	pcTMP_id int not null CONSTRAINT DF_PedidoOrdenCompraTMP_pcTMP_id  default (0),
	ocTMP_id int not null CONSTRAINT DF_PedidoOrdenCompraTMP_ocTMP_id  default (0),
	pcocTMP_id int not null,
	pcoc_id int not null,
	pcoc_cantidad decimal(18, 6) not null CONSTRAINT DF_PedidoOrdenCompraTMP_pcoc_cantidad  default (0),
	pci_id int not null,
	oci_id int not null,
 CONSTRAINT PK_PedidoOrdenCompraTMP PRIMARY KEY  
(
	pcocTMP_id 
) 
) 
;
/****** Object:  Table Clearing    Script Date: 07/30/2012 17:05:01 ******/

;

;

;
create table Clearing(
	cle_id int not null,
	cle_nombre varchar(100) not null,
	cle_codigo varchar(15) not null,
	cle_descrip varchar(255) not null CONSTRAINT DF_Clearing_cle_descripcion  default (''),
	cle_dias int not null,
	creado timestamptz not null CONSTRAINT DF_Clearing_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Clearing_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Clearing_activo  default (1),
 CONSTRAINT PK_Clearing PRIMARY KEY  
(
	cle_id 
) 
) 
;

;
/****** Object:  Table sysModuloUser    Script Date: 07/30/2012 17:30:44 ******/

;

;
create table sysModuloUser(
	us_id int not null,
	sysm_id int not null,
 CONSTRAINT PK_sysModuloUser PRIMARY KEY  
(
	us_id,
	sysm_id 
) 
) 
;
/****** Object:  Table ProductoHelpConfig    Script Date: 07/30/2012 17:25:56 ******/

;

;

;
create table ProductoHelpConfig(
	prhc_id int not null,
	prhc_nombre varchar(100) not null CONSTRAINT DF_ProductoHelpConfig_prhc_nombre  default (''),
	prhc_tecla varchar(255) not null,
	prhc_atributo_indice smallint not null,
	prhc_valor_codigo varchar(255) not null,
	prhc_descrip varchar(255) not null CONSTRAINT DF_ProductoHelpConfig_prhc_descrip  default (''),
	prhc_default smallint not null CONSTRAINT DF_ProductoHelpConfig_prhc_default  default (0),
	prhc_defaultsrv smallint not null CONSTRAINT DF_ProductoHelpConfig_prhc_defaultsrv  default (0),
	prhc_defaultprp smallint not null CONSTRAINT DF_ProductoHelpConfig_prhc_defaultprp  default (0),
	prhc_defaultprns smallint not null CONSTRAINT DF_ProductoHelpConfig_prhc_defaultprns  default (0),
	modificado timestamptz not null CONSTRAINT DF_ProductoHelpConfig_modificado  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_ProductoHelpConfig_creado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_ProductoHelpConfig_activo  default (1),
 CONSTRAINT PK_ProductoHelpConfig PRIMARY KEY  
(
	prhc_id 
) 
) 
;

;
/****** Object:  Table DepositoBancoTMP    Script Date: 07/30/2012 17:08:18 ******/

;

;

;
create table DepositoBancoTMP(
	dbcoTMP_id int not null,
	dbco_id int not null,
	dbco_numero int not null,
	dbco_nrodoc varchar(50) not null CONSTRAINT DF_DepositoBancoTMP_dbco_nrodoc_1  default (''),
	dbco_descrip varchar(5000) not null CONSTRAINT DF_DepositoBancoTMP_dbco_descrip_1  default (''),
	dbco_fecha timestamptz not null CONSTRAINT DF_DepositoBancoTMP_dbco_fecha_1  default (getdate()),
	dbco_cotizacion decimal(18, 6) not null CONSTRAINT DF_DepositoBancoTMP_dbco_cotizacion_1  default (0),
	dbco_total decimal(18, 6) not null CONSTRAINT DF_DepositoBancoTMP_dbco_total_1  default (0),
	dbco_totalorigen decimal(18, 6) not null CONSTRAINT DF_DepositoBancoTMP_dbco_totalorigen_1  default (0),
	dbco_firmado int not null CONSTRAINT DF_DepositoBancoTMP_dbco_firmado_1  default (0),
	dbco_grabarasiento smallint not null CONSTRAINT DF_DepositoBancoTMP_dbco_grabarasiento_1  default (0),
	est_id int not null,
	suc_id int not null,
	doc_id int not null,
	bco_id int not null,
	cue_id int not null,
	as_id int null,
	lgj_id int null,
	creado timestamptz not null CONSTRAINT DF_DepositoBancoTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_DepositoBancoTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_DepositoBancoTMP PRIMARY KEY  
(
	dbcoTMP_id 
) 
) 
;

;
/****** Object:  Table LiquidacionItemTMP    Script Date: 07/30/2012 17:15:44 ******/

;

;

;
create table LiquidacionItemTMP(
	liqTMP_id int not null,
	liqiTMP_id int not null,
	liqi_id int not null,
	liqi_importe decimal(18, 6) not null CONSTRAINT DF_LiquidacionItemTMP_liqi_importe  default (0),
	liqi_importeorigen decimal(18, 6) not null CONSTRAINT DF_LiquidacionItemTMP_liqi_importeorigen  default (0),
	liqi_impuesto decimal(18, 6) not null CONSTRAINT DF_LiquidacionItemTMP_liqi_impuesto  default (0),
	liqi_descrip varchar(5000) not null CONSTRAINT DF_LiquidacionItemTMP_liqi_descrip  default (''),
	liqi_orden smallint not null,
	liqi_nrodoc varchar(50) not null CONSTRAINT DF_LiquidacionItemTMP_liqi_nrodoc  default (''),
	em_id int not null,
 CONSTRAINT PK_LiquidacionItemTMP PRIMARY KEY  
(
	liqiTMP_id 
) 
) 
;

;
/****** Object:  Table EmpleadoEspecialidad    Script Date: 07/30/2012 17:09:42 ******/

;

;

;
create table EmpleadoEspecialidad(
	eme_id int not null,
	eme_nombre varchar(100) not null,
	eme_codigo varchar(15) not null,
	eme_descrip varchar(5000) not null,
	creado timestamptz not null CONSTRAINT DF_EmpleadoEspecialidad_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_EmpleadoEspecialidad_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_EmpleadoEspecialidad_activo  default (1),
 CONSTRAINT PK_EmpleadoEspecialidad PRIMARY KEY  
(
	eme_id 
) 
) 
;

;
/****** Object:  Table IncidenteTipo    Script Date: 07/30/2012 17:14:41 ******/

;

;

;
create table IncidenteTipo(
	inct_id int not null,
	inct_nombre varchar(50) not null,
	inct_codigo varchar(15) not null,
 CONSTRAINT PK_IncidenteTipo PRIMARY KEY  
(
	inct_id 
) 
) 
;

;
/****** Object:  Table OrdenPagoAsiento    Script Date: 07/30/2012 17:18:20 ******/

;

;
create table OrdenPagoAsiento(
	opg_id int not null,
	opg_fecha timestamptz not null,
 CONSTRAINT PK_OrdenPagoAsiento PRIMARY KEY  
(
	opg_id 
) 
) 
;
/****** Object:  Table ProductoBOMItemTipo    Script Date: 07/30/2012 17:25:39 ******/

;

;

;
create table ProductoBOMItemTipo(
	pbmit_id int not null,
	pbmit_nombre varchar(50) not null,
	pbmit_codigo varchar(15) not null,
 CONSTRAINT PK_ProductoBOMItemTipo PRIMARY KEY  
(
	pbmit_id 
) 
) 
;

;
/****** Object:  Table ManifiestoPackingListTMP    Script Date: 07/30/2012 17:16:55 ******/

;

;
create table ManifiestoPackingListTMP(
	pklstTMP_id int not null CONSTRAINT DF_ManifiestoPackingListTMP_pklstTMP_id  default (0),
	mfcTMP_id int not null CONSTRAINT DF_ManifiestoPackingListTMP_mfcTMP_id  default (0),
	mfcpklstTMP_id int not null,
	mfcpklst_id int not null,
	mfcpklst_cantidad decimal(18, 6) not null CONSTRAINT DF_ManifiestoPackingListTMP_mfcpklst_cantidad  default (0),
	mfci_id int not null,
	pklsti_id int not null,
 CONSTRAINT PK_ManifiestoPackingListTMP PRIMARY KEY  
(
	mfcpklstTMP_id 
) 
) 
;
/****** Object:  Table ResolucionCuponAsiento    Script Date: 07/30/2012 17:29:13 ******/

;

;
create table ResolucionCuponAsiento(
	rcup_id int not null,
	rcup_fecha timestamptz not null,
 CONSTRAINT PK_ResolucionCuponAsiento PRIMARY KEY  
(
	rcup_id 
) 
) 
;
/****** Object:  Table Id    Script Date: 07/30/2012 17:13:52 ******/

;

;

;
create table Id(
	Id_Tabla varchar(50) not null,
	Id_NextId int not null,
	Id_CampoId varchar(50) not null,
	Id_Rango int not null CONSTRAINT DF_Id_Id_Rango  default (0)
) 
;

;
/****** Object:  Table Sindicato    Script Date: 07/30/2012 17:29:50 ******/

;

;

;
create table Sindicato(
	sind_id int not null,
	sind_nombre varchar(100) not null,
	sind_codigo varchar(15) not null,
	sind_descrip varchar(255) not null,
	creado timestamptz not null CONSTRAINT DF_Sindicato_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Sindicato_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Sindicato_activo  default (1),
 CONSTRAINT PK_Sindicato PRIMARY KEY  
(
	sind_id 
) 
) 
;

;
/****** Object:  Table FacturaElectronicaConsulta    Script Date: 07/30/2012 17:11:57 ******/

;

;

;
create table FacturaElectronicaConsulta(
	fvfec_id int not null,
	fvfec_ptovta smallint not null,
	fvfec_cuit varchar(50) not null,
	fvfec_numero int not null,
	fvfec_tipdoc smallint not null,
	fvfec_respuesta varchar(8000) not null CONSTRAINT DF_FacturaElectronicaConsulta_fvfec_respuesta  default (''),
 CONSTRAINT PK_FacturaElectronicaConsulta PRIMARY KEY  
(
	fvfec_id 
) 
) 
;

;
/****** Object:  Table FechaControlAcceso    Script Date: 07/30/2012 17:13:00 ******/

;

;

;
create table FechaControlAcceso(
	fca_id int not null,
	fca_nombre varchar(100) not null CONSTRAINT DF_FechaControlAcceso_fca_nombre  default (''),
	fca_codigo varchar(15) not null CONSTRAINT DF_FechaControlAcceso_fca_alias  default (''),
	fca_fechadesde timestamptz not null CONSTRAINT DF_FechaControlAcceso_fca_fecha  default (getdate()),
	fca_fechahasta timestamptz not null CONSTRAINT DF_FechaControlAcceso_fca_fecha1  default (getdate()),
	activo smallint not null CONSTRAINT DF_FechaControlAcceso_activo  default (1),
	creado timestamptz not null CONSTRAINT DF_FechaControlAcceso_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_FechaControlAcceso_modificado  default (getdate()),
	modifico int not null CONSTRAINT DF_FechaControlAcceso_modifico  default (0),
 CONSTRAINT PK_FechaControlAcceso PRIMARY KEY  
(
	fca_id 
) 
) 
;

;
/****** Object:  Table MovimientoFondoAsiento    Script Date: 07/30/2012 17:17:21 ******/

;

;
create table MovimientoFondoAsiento(
	mf_id int not null,
	mf_fecha timestamptz not null,
 CONSTRAINT PK_MovimientoFondoAsiento PRIMARY KEY  
(
	mf_id 
) 
) 
;
/****** Object:  Table CotizacionCompraTMP    Script Date: 07/30/2012 17:07:26 ******/

;

;

;
create table CotizacionCompraTMP(
	cotTMP_id int not null,
	cot_id int not null,
	cot_numero int not null,
	cot_nrodoc varchar(50) not null CONSTRAINT DF_CotizacionCompraTMP_cot_nrodoc  default (''),
	cot_descrip varchar(5000) not null CONSTRAINT DF_CotizacionCompraTMP_cot_descrip  default (''),
	cot_fecha timestamptz not null CONSTRAINT DF_CotizacionCompraTMP_cot_fecha  default (getdate()),
	cot_fechaentrega timestamptz not null CONSTRAINT DF_CotizacionCompraTMP_cot_fechaentrega  default (getdate()),
	cot_subtotal decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraTMP_cot_subtotal  default (0),
	cot_neto decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraTMP_cot_neto  default (0),
	cot_ivari decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraTMP_cot_impuesto  default (0),
	cot_ivarni decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraTMP_cot_ivarni  default (0),
	cot_total decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraTMP_cot_total  default (0),
	est_id int not null,
	suc_id int not null,
	doc_id int not null,
	doct_id int not null,
	lp_id int null,
	cpg_id int not null,
	ccos_id int null,
	us_id int null,
	lgj_id int null,
	creado timestamptz not null CONSTRAINT DF_CotizacionCompraTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_CotizacionCompraTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_CotizacionCompraTMP PRIMARY KEY  
(
	cotTMP_id 
) 
) 
;

;
/****** Object:  Table ProductoNumeroSerieHistoria    Script Date: 07/30/2012 17:26:13 ******/

;

;

;
create table ProductoNumeroSerieHistoria(
	prnsh_id int not null,
	prns_id int not null,
	prns_codigo2 varchar(100) not null CONSTRAINT DF_ProductoNumeroSerieHistoria_prns_codigo2  default (''),
	prns_codigo3 varchar(100) not null CONSTRAINT DF_ProductoNumeroSerieHistoria_prns_codigo3  default (''),
	prns_codigo4 varchar(255) not null CONSTRAINT DF_ProductoNumeroSerieHistoria_prns_codigo4  default (''),
	prns_codigo5 varchar(255) not null CONSTRAINT DF_ProductoNumeroSerieHistoria_prns_codigo5  default (''),
	prns_codigo6 varchar(255) not null CONSTRAINT DF_ProductoNumeroSerieHistoria_prns_codigo6  default (''),
	prns_codigo7 varchar(255) not null CONSTRAINT DF_ProductoNumeroSerieHistoria_prns_codigo7  default (''),
	prns_fechavto timestamptz not null CONSTRAINT DF_ProductoNumeroSerieHistoria_prns_fechavto  default (getdate()),
	prns_descrip varchar(255) not null CONSTRAINT DF_ProductoNumeroSerieHistoria_prns_descrip  default (''),
	tar_id int null,
	tar_id_activa int null,
	os_id int null,
	prp_id int null,
	stprov_id int null,
	cli_id int null,
	cont_id int null,
	prov_id int null,
	etf_id int null,
	tar_id_activa1 int null,
	rv_id int null,
	creado timestamptz not null CONSTRAINT DF_ProductoNumeroSerieHistoria_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ProductoNumeroSerieHistoria_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ProductoNumeroSerieHistoria PRIMARY KEY  
(
	prnsh_id 
) 
) 
;

;
/****** Object:  Table PresupuestoDevolucionVentaTMP    Script Date: 07/30/2012 17:23:54 ******/

;

;
create table PresupuestoDevolucionVentaTMP(
	prvTMP_id int not null,
	prvdvTMP_id int not null,
	prvdv_id int not null,
	prvdv_cantidad decimal(18, 6) not null CONSTRAINT DF_PresupuestoDevolucionVenta_prvdv_cantidad  default (0),
	prvi_id_Presupuesto int not null,
	prvi_id_devolucion int not null,
 CONSTRAINT PK_PresupuestoDevolucionVenta PRIMARY KEY  
(
	prvdvTMP_id 
) 
) 
;
/****** Object:  Table RemitoFacturaVentaTMP    Script Date: 07/30/2012 17:28:22 ******/

;

;
create table RemitoFacturaVentaTMP(
	fvTMP_id int not null CONSTRAINT DF_RemitoFacturaVentaTMP_fvTMP_id  default (0),
	rvTMP_id int not null CONSTRAINT DF_RemitoFacturaVentaTMP_rvTMP_id  default (0),
	rvfvTMP_id int not null,
	rvfv_id int not null,
	rvfv_cantidad decimal(18, 6) not null CONSTRAINT DF_RemitoVentaFacturaTMP_rvfv_cantidad  default (0),
	rvi_id int not null CONSTRAINT DF_RemitoFacturaVentaTMP_rvi_id  default (0),
	fvi_id int not null CONSTRAINT DF_RemitoFacturaVentaTMP_fvi_id  default (0),
 CONSTRAINT PK_RemitoVentaFacturaTMP PRIMARY KEY  
(
	rvfvTMP_id 
) 
) 
;
/****** Object:  Table ResolucionCuponTMP    Script Date: 07/30/2012 17:29:23 ******/

;

;

;
create table ResolucionCuponTMP(
	rcupTMP_id int not null,
	rcup_id int not null,
	rcup_numero int not null,
	rcup_nrodoc varchar(50) not null CONSTRAINT DF_ResolucionCuponTMP_rcup_nrodoc_1  default (''),
	rcup_descrip varchar(5000) not null CONSTRAINT DF_ResolucionCuponTMP_rcup_descrip_1  default (''),
	rcup_fecha timestamptz not null CONSTRAINT DF_ResolucionCuponTMP_rcup_fecha_1  default (getdate()),
	rcup_total decimal(18, 6) not null CONSTRAINT DF_ResolucionCuponTMP_rcup_total_1  default (0),
	rcup_firmado int not null CONSTRAINT DF_ResolucionCuponTMP_rcup_firmado_1  default (0),
	rcup_grabarasiento smallint not null CONSTRAINT DF_ResolucionCuponTMP_rcup_grabarasiento_1  default (0),
	est_id int not null,
	suc_id int not null,
	doc_id int not null,
	as_id int null,
	lgj_id int null,
	creado timestamptz not null CONSTRAINT DF_ResolucionCuponTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ResolucionCuponTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ResolucionCuponTMP PRIMARY KEY  
(
	rcupTMP_id 
) 
) 
;

;
/****** Object:  Table HistoriaOperacion    Script Date: 07/30/2012 17:13:28 ******/

;

;

;
create table HistoriaOperacion(
	hsto_id int not null,
	tbl_id int not null,
	hsto_nombre varchar(5000) not null,
 CONSTRAINT PK_HistoriaOperacion PRIMARY KEY  
(
	hsto_id,
	tbl_id 
) 
) 
;

;
/****** Object:  Table RemitoCompraTMP    Script Date: 07/30/2012 17:28:11 ******/

;

;

;
create table RemitoCompraTMP(
	rcTMP_id int not null,
	rc_id int not null,
	rc_numero int not null,
	rc_nrodoc varchar(50) not null CONSTRAINT DF_RemitoCompraTMP_rc_nrodoc  default (''),
	rc_descrip varchar(5000) not null CONSTRAINT DF_RemitoCompraTMP_rc_descrip  default (''),
	rc_fecha timestamptz not null CONSTRAINT DF_RemitoCompraTMP_rc_fecha  default (getdate()),
	rc_fechaentrega timestamptz not null CONSTRAINT DF_RemitoCompraTMP_rc_fechaentrega  default (getdate()),
	rc_neto decimal(18, 6) not null CONSTRAINT DF_RemitoCompraTMP_rc_neto  default (0),
	rc_ivari decimal(18, 6) not null CONSTRAINT DF_RemitoCompraTMP_rc_ivari  default (0),
	rc_ivarni decimal(18, 6) not null CONSTRAINT DF_RemitoCompraTMP_rc_ivarni  default (0),
	rc_subtotal decimal(18, 6) not null CONSTRAINT DF_RemitoCompraTMP_rc_subtotal  default (0),
	rc_total decimal(18, 6) not null CONSTRAINT DF_RemitoCompraTMP_rc_total  default (0),
	rc_descuento1 decimal(18, 6) not null CONSTRAINT DF_RemitoCompraTMP_rc_descuento1  default (0),
	rc_descuento2 decimal(18, 6) not null CONSTRAINT DF_RemitoCompraTMP_rc_descuento2  default (0),
	rc_importedesc1 decimal(18, 6) not null CONSTRAINT DF_RemitoCompraTMP_rc_importedesc1  default (0),
	rc_importedesc2 decimal(18, 6) not null CONSTRAINT DF_RemitoCompraTMP_rc_importedesc2  default (0),
	rc_cotizacion decimal(18, 6) not null CONSTRAINT DF_RemitoCompraTMP_rc_cotizacion  default (0),
	est_id int not null,
	suc_id int not null,
	prov_id int not null,
	doc_id int not null,
	lp_id int null,
	ld_id int null,
	lgj_id int null,
	cpg_id int null,
	ccos_id int null,
	st_id int null,
	depl_id int null,
	creado timestamptz not null CONSTRAINT DF_RemitoCompraTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_RemitoCompraTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_RemitoCompraTMP PRIMARY KEY  
(
	rcTMP_id 
) 
) 
;

;
/****** Object:  Table ProductoNumeroSerieAsinc    Script Date: 07/30/2012 17:26:08 ******/

;

;
create table ProductoNumeroSerieAsinc(
	prnsa_id int  not null,
	prns_id int not null,
	st_id int not null,
	prnsa_restar smallint not null,
 CONSTRAINT PK_ProductoNumeroSerieAsinc PRIMARY KEY  
(
	prnsa_id 
) 
) 
;
/****** Object:  Table AjusteInflacionItemTipo    Script Date: 07/30/2012 17:02:44 ******/

;

;

;
create table AjusteInflacionItemTipo(
	ajit_id int not null,
	ajit_nombre varchar(255) not null CONSTRAINT DF_AjusteInflacionItemTipo_ajit_nombre  default (''),
	ajit_codigo varchar(15) not null CONSTRAINT DF_AjusteInflacionItemTipo_ajit_codigo  default (''),
 CONSTRAINT PK_AjusteInflacionItemTipo PRIMARY KEY  
(
	ajit_id 
) 
) 
;

;
/****** Object:  Table OrdenCompraTMP    Script Date: 07/30/2012 17:18:08 ******/

;

;

;
create table OrdenCompraTMP(
	ocTMP_id int not null,
	oc_id int not null,
	oc_numero int not null,
	oc_nrodoc varchar(50) not null CONSTRAINT DF_OrdenCompraTMP_oc_nrodoc  default (''),
	oc_descrip varchar(5000) not null CONSTRAINT DF_OrdenCompraTMP_oc_descrip  default (''),
	oc_fecha timestamptz not null CONSTRAINT DF_OrdenCompraTMP_oc_fecha  default (getdate()),
	oc_fechaentrega timestamptz not null CONSTRAINT DF_OrdenCompraTMP_oc_fechaentrega  default (getdate()),
	oc_subtotal decimal(18, 6) not null CONSTRAINT DF_OrdenCompraTMP_oc_subtotal  default (0),
	oc_neto decimal(18, 6) not null CONSTRAINT DF_OrdenCompraTMP_oc_neto  default (0),
	oc_ivari decimal(18, 6) not null CONSTRAINT DF_OrdenCompraTMP_oc_impuesto  default (0),
	oc_ivarni decimal(18, 6) not null CONSTRAINT DF_OrdenCompraTMP_oc_ivarni  default (0),
	oc_total decimal(18, 6) not null CONSTRAINT DF_OrdenCompraTMP_oc_total  default (0),
	oc_descuento1 decimal(18, 6) not null CONSTRAINT DF_OrdenCompraTMP_oc_descuento1  default (0),
	oc_descuento2 decimal(18, 6) not null CONSTRAINT DF_OrdenCompraTMP_oc_descuento2  default (0),
	oc_importedesc1 decimal(18, 6) not null CONSTRAINT DF_OrdenCompraTMP_oc_descuento11  default (0),
	oc_importedesc2 decimal(18, 6) not null CONSTRAINT DF_OrdenCompraTMP_oc_descuento21  default (0),
	oc_ordencompra varchar(50) not null CONSTRAINT DF_OrdenCompraTMP_oc_ordencompra  default (''),
	oc_presupuesto varchar(50) not null CONSTRAINT DF_OrdenCompraTMP_oc_presupuesto  default (''),
	oc_maquina varchar(255) not null CONSTRAINT DF_OrdenCompraTMP_oc_maquina  default (''),
	oc_maquinanro varchar(50) not null CONSTRAINT DF_OrdenCompraTMP_oc_maquinanro  default (''),
	oc_maquinamodelo varchar(50) not null CONSTRAINT DF_OrdenCompraTMP_oc_maquinamodelo  default (''),
	oc_fleteaereo smallint not null CONSTRAINT DF_OrdenCompraTMP_oc_fleteaereo  default (0),
	oc_fletemaritimo smallint not null CONSTRAINT DF_OrdenCompraTMP_oc_fletemaritimo  default (0),
	oc_fletecorreo smallint not null CONSTRAINT DF_OrdenCompraTMP_oc_fletecorreo  default (0),
	oc_fletecamion smallint not null CONSTRAINT DF_OrdenCompraTMP_oc_fletecamion  default (0),
	oc_fleteotros smallint not null CONSTRAINT DF_OrdenCompraTMP_oc_fleteotros  default (0),
	est_id int not null,
	suc_id int not null,
	prov_id int not null,
	cli_id int null,
	doc_id int not null,
	lp_id int null,
	ld_id int null,
	cpg_id int not null,
	ccos_id int null,
	lgj_id int null,
	creado timestamptz not null CONSTRAINT DF_OrdenCompraTMP_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_OrdenCompraTMP_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_OrdenCompraTMP PRIMARY KEY  
(
	ocTMP_id 
) 
) 
;

;
/****** Object:  Table PedidoCotizacionCompraTMP    Script Date: 07/30/2012 17:21:37 ******/

;

;
create table PedidoCotizacionCompraTMP(
	pcTMP_id int not null CONSTRAINT DF_PedidoCotizacionCompraTMP_pcTMP_id  default (0),
	cotTMP_id int not null CONSTRAINT DF_PedidoCotizacionCompraTMP_cotTMP_id  default (0),
	pccotTMP_id int not null,
	pccot_id int not null,
	pccot_cantidad decimal(18, 6) not null CONSTRAINT DF_PedidoCotizacionCompraTMP_pccot_cantidad  default (0),
	pci_id int not null,
	coti_id int not null,
 CONSTRAINT PK_PedidoCotizacionCompraTMP PRIMARY KEY  
(
	pccotTMP_id 
) 
) 
;
/****** Object:  Table PedidoRemitoVenta    Script Date: 07/30/2012 17:21:52 ******/

;

;
create table PedidoRemitoVenta(
	pvrv_id int not null,
	pvrv_cantidad decimal(18, 6) not null CONSTRAINT DF_PedidoRemitoVenta_pvrv_cantidad  default (0),
	pvi_id int not null,
	rvi_id int not null,
 CONSTRAINT PK_PedidoRemitoVenta PRIMARY KEY  
(
	pvrv_id 
) 
) 
;
/****** Object:  Table PickingListPedidoItem    Script Date: 07/30/2012 17:23:18 ******/

;

;

;
create table PickingListPedidoItem(
	pv_id int not null,
	pkl_id int not null,
	pklpv_id int not null,
	pklpvi_id int not null,
	pklpvi_orden smallint not null,
	pklpvi_cantidad decimal(18, 6) not null CONSTRAINT DF_PickingListPedidoItem_pklpvi_cantidad  default (0),
	pklpvi_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_PickingListPedidoItem_pklpvi_cantidadaremitir  default (0),
	pklpvi_pendiente decimal(18, 6) not null CONSTRAINT DF_PickingListPedidoItem_pklpvi_pendiente  default (0),
	pklpvi_descrip varchar(5000) not null CONSTRAINT DF_PickingListPedidoItem_pklpvi_descrip  default (''),
	pvi_id int not null,
 CONSTRAINT PK_PickingListPedidoItem PRIMARY KEY  
(
	pklpvi_id 
) 
) 
;

;
/****** Object:  Table PedidoDevolucionVenta    Script Date: 07/30/2012 17:21:41 ******/

;

;
create table PedidoDevolucionVenta(
	pvdv_id int not null,
	pvdv_cantidad decimal(18, 6) not null CONSTRAINT DF_PedidoDevolucionVenta_pvdv_cantidad_1  default (0),
	pvi_id_pedido int not null,
	pvi_id_devolucion int not null,
 CONSTRAINT PK_PedidoDevolucionVenta_1 PRIMARY KEY  
(
	pvdv_id 
) 
) 
;
/****** Object:  Table PresupuestoPedidoVenta    Script Date: 07/30/2012 17:24:31 ******/

;

;
create table PresupuestoPedidoVenta(
	prvpv_id int not null,
	prvpv_cantidad decimal(18, 6) not null CONSTRAINT DF_PresupuestoPedidoVenta_prvpv_cantidad  default (0),
	prvi_id int not null,
	pvi_id int not null,
 CONSTRAINT PK_PresupuestoPedidoVenta PRIMARY KEY  
(
	prvpv_id 
) 
) 
;
/****** Object:  Table PedidoFacturaVenta    Script Date: 07/30/2012 17:21:43 ******/

;

;
create table PedidoFacturaVenta(
	pvfv_id int not null,
	pvfv_cantidad decimal(18, 6) not null CONSTRAINT DF_PedidoFacturaVenta_pvfv_cantidad  default (0),
	pvi_id int not null,
	fvi_id int not null,
 CONSTRAINT PK_PedidoFacturaVenta PRIMARY KEY  
(
	pvfv_id 
) 
) 
;
/****** Object:  Table PedidoPackingList    Script Date: 07/30/2012 17:21:49 ******/

;

;
create table PedidoPackingList(
	pvpklst_id int not null,
	pvpklst_cantidad decimal(18, 6) not null CONSTRAINT DF_PedidoPackingList_pvpklst_cantidad  default (0),
	pvi_id int not null,
	pklsti_id int not null,
 CONSTRAINT PK_PedidoPackingList PRIMARY KEY  
(
	pvpklst_id 
) 
) 
;
/****** Object:  Table Legajo    Script Date: 07/30/2012 17:15:03 ******/

;

;

;
create table Legajo(
	lgj_id int not null,
	lgj_titulo varchar(255) not null CONSTRAINT DF_Legajo_lgj_titulo  default (''),
	lgj_codigo varchar(50) not null,
	lgj_descrip varchar(255) not null CONSTRAINT DF_Legajo_lgj_descrip  default (''),
	lgj_fecha timestamptz not null CONSTRAINT DF_Legajo_lgj_fecha  default (getdate()),
	lgj_ata varchar(50) not null CONSTRAINT DF_Legajo_lgj_ata  default (''),
	lgj_hawbbl varchar(50) not null CONSTRAINT DF_Legajo_lgj_hawbbl  default (''),
	lgj_etd varchar(50) not null CONSTRAINT DF_Legajo_lgj_etd  default (''),
	lgj_eta varchar(50) not null CONSTRAINT DF_Legajo_lgj_eta  default (''),
	lgj_mawbbl varchar(50) not null CONSTRAINT DF_Legajo_lgj_mawbbl  default (''),
	lgj_fob varchar(50) not null CONSTRAINT DF_Legajo_lgj_fob  default (''),
	lgj_giro varchar(50) not null CONSTRAINT DF_Legajo_lgj_giro  default (''),
	lgj_flete varchar(50) not null CONSTRAINT DF_Legajo_lgj_flete  default (''),
	lgjt_id int not null,
	est_id int not null,
	cli_id int null,
	mon_id int null,
	trans_id int null,
	barc_id int null,
	vue_id int null,
	pue_id int null,
	modificado timestamptz not null CONSTRAINT DF_Legajo_modificado_1  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_Legajo_creado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Legajo_activo  default (1),
 CONSTRAINT PK_Legajo PRIMARY KEY  
(
	lgj_id 
) 
) 
;

;
/****** Object:  Table RecuentoStockItem    Script Date: 07/30/2012 17:27:28 ******/

;

;

;
create table RecuentoStockItem(
	rs_id int not null,
	rsi_id int not null,
	rsi_orden smallint not null,
	rsi_cantidadstock decimal(18, 6) not null CONSTRAINT DF_RecuentoStockItem_rsi_cantidadstock  default (0),
	rsi_cantidad decimal(18, 6) not null CONSTRAINT DF_RecuentoStockItem_rsi_cantidad  default (0),
	rsi_ajuste decimal(18, 6) not null CONSTRAINT DF_RecuentoStockItem_rsi_ajuste  default (0),
	rsi_descrip varchar(5000) not null CONSTRAINT DF_RecuentoStockItem_rsi_descrip  default (''),
	pr_id int not null,
	depl_id int not null,
	stl_id int null,
 CONSTRAINT PK_RecuentoStockItem PRIMARY KEY  
(
	rsi_id 
) 
) 
;

;
/****** Object:  Table Alsa    Script Date: 07/30/2012 17:03:11 ******/

;

;

;
create table Alsa(
	alsa_id int not null,
	alsa_codigo varchar(15) not null,
	alsa_descrip varchar(255) not null CONSTRAINT DF_Alsa_alsa_descrip  default (''),
	alsa_tipoMadera smallint not null CONSTRAINT DF_Alsa_alsa_tipoMadera  default (0),
	alsa_tipoCamara smallint not null CONSTRAINT DF_Alsa_alsa_tipoCamara  default (0),
	alsa_tipoAlsa smallint not null CONSTRAINT DF_Alsa_alsa_tipoAlsa  default (0),
	colm_id int null,
	creado timestamptz not null CONSTRAINT DF_Alsa_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Alsa_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Alsa_activo  default (1),
 CONSTRAINT PK_Alsa PRIMARY KEY  
(
	alsa_id 
) 
) 
;

;
/****** Object:  Table Reina    Script Date: 07/30/2012 17:27:40 ******/

;

;

;
create table Reina(
	reina_id int not null,
	reina_codigo varchar(15) not null,
	reina_descrip varchar(255) not null CONSTRAINT DF_Reina_reina_descrip  default (''),
	reina_nacimiento timestamptz not null,
	reina_calidad smallint not null,
	colm_id int null,
	prov_id int null,
	creado timestamptz not null CONSTRAINT DF_Reina_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Reina_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Reina_activo  default (1),
 CONSTRAINT PK_Reina PRIMARY KEY  
(
	reina_id 
) 
) 
;

;
/****** Object:  Table HojaRutaItem    Script Date: 07/30/2012 17:13:44 ******/

;

;

;
create table HojaRutaItem(
	hr_id int not null,
	hri_id int not null,
	hri_orden smallint not null,
	hri_descrip varchar(5000) not null CONSTRAINT DF_HojaRutaItem_hri_descrip  default (''),
	hri_importe decimal(18, 6) not null CONSTRAINT DF_HojaRutaItem_hri_importe  default (0),
	hri_acobrar decimal(18, 6) not null CONSTRAINT DF_HojaRutaItem_hri_acobrar  default (0),
	hri_cobrado decimal(18, 6) not null CONSTRAINT DF_HojaRutaItem_hri_cobrado  default (0),
	hri_efectivo decimal(18, 6) not null CONSTRAINT DF_HojaRutaItem_hri_cheques3  default (0),
	hri_tickets decimal(18, 6) not null CONSTRAINT DF_HojaRutaItem_hri_cheques2  default (0),
	hri_tarjeta decimal(18, 6) not null CONSTRAINT DF_HojaRutaItem_hri_cheques1  default (0),
	hri_cheques decimal(18, 6) not null CONSTRAINT DF_HojaRutaItem_hri_cheques  default (0),
	hri_anulado decimal(18, 6) not null CONSTRAINT DF_HojaRutaItem_hri_anulada  default (0),
	hri_retenciones decimal(18, 6) not null CONSTRAINT DF_HojaRutaItem_hri_retenciones  default (0),
	hri_notascredito decimal(18, 6) not null CONSTRAINT DF_HojaRutaItem_hri_notascredito  default (0),
	hri_otros decimal(18, 6) not null CONSTRAINT DF_HojaRutaItem_hri_otros  default (0),
	est_id int not null,
	cont_id int null,
	fv_id int null,
	rv_id int null,
	os_id int null,
	ptd_id int null,
	hrct_id int null,
 CONSTRAINT PK_HojaRutaItem PRIMARY KEY  
(
	hri_id 
) 
) 
;

;
/****** Object:  Table ParteProdKitItem    Script Date: 07/30/2012 17:20:30 ******/

;

;

;
create table ParteProdKitItem(
	ppk_id int not null,
	ppki_id int not null,
	ppki_orden smallint not null,
	ppki_cantidadstock decimal(18, 6) not null CONSTRAINT DF_ParteProdKitItem_ppki_cantidadstock  default (0),
	ppki_cantidad decimal(18, 6) not null CONSTRAINT DF_ParteProdKitItem_ppki_cantidad  default (0),
	ppki_descrip varchar(5000) not null CONSTRAINT DF_ParteProdKitItem_ppki_descrip  default (''),
	pr_id int not null,
	depl_id int not null,
	stl_id int null,
	prfk_id int not null,
 CONSTRAINT PK_ParteProdKitItem PRIMARY KEY  
(
	ppki_id 
) 
) 
;

;
/****** Object:  Table ProductoNumeroSerie    Script Date: 07/30/2012 17:26:06 ******/

;

;

;
create table ProductoNumeroSerie(
	prns_id int not null,
	prns_codigo varchar(100) not null,
	prns_codigo2 varchar(100) not null CONSTRAINT DF_ProductoNumeroSerie_prns_codigo2  default (''),
	prns_codigo3 varchar(100) not null CONSTRAINT DF_ProductoNumeroSerie_prns_codigo3  default (''),
	prns_descrip varchar(255) not null CONSTRAINT DF_ProductoNumeroSerie_prns_descrip  default (''),
	prns_fechavto timestamptz not null CONSTRAINT DF_ProductoNumeroSerie_prns_fechavto  default (getdate()),
	prns_id_historia int null,
	pr_id int not null,
	depl_id int not null,
	pr_id_kit int null,
	cli_id int null,
	prov_id int null,
	doc_id_salida int null,
	doct_id_salida int null,
	doc_id_ingreso int null,
	doct_id_ingreso int null,
	ppk_id int null,
	stl_id int null,
	prsk_id int null,
	tar_id int null,
	creado timestamptz not null CONSTRAINT DF_ProductoNumeroSerie_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ProductoNumeroSerie_modificado  default (getdate()),
	modifico int not null,
	st_id int not null CONSTRAINT DF__producton__st_id__1DB2FE1E  default (0),
 CONSTRAINT PK_ProductoNumeroSerie PRIMARY KEY  
(
	prns_id 
) 
) 
;

;
/****** Object:  Table LiquidacionConceptoAdm    Script Date: 07/30/2012 17:15:24 ******/

;

;

;
create table LiquidacionConceptoAdm(
	liq_id int not null,
	liqca_id int not null,
	liqca_importe decimal(18, 6) not null CONSTRAINT DF_LiquidacionConceptoAdm_liqca_importe  default (0),
	liqca_descrip varchar(5000) not null CONSTRAINT DF_LiquidacionConceptoAdm_liqca_descrip  default (''),
	liqca_orden smallint not null,
	em_id int not null,
	liqfi_id int not null,
	ccos_id int null,
 CONSTRAINT PK_LiquidacionConceptoAdm PRIMARY KEY  
(
	liqca_id 
) 
) 
;

;
/****** Object:  Table LiquidacionItemCodigo    Script Date: 07/30/2012 17:15:40 ******/

;

;

;
create table LiquidacionItemCodigo(
	liq_id int not null,
	liqi_id int not null,
	liqfi_id int not null,
	liqic_id int  not null,
	liqic_importe decimal(18, 6) not null CONSTRAINT DF_LiquidacionItemCodigo_liqic_importe  default (0),
	liqic_unidades decimal(18, 6) not null CONSTRAINT DF_LiquidacionItemCodigo_liqic_unidades  default (0),
	liqic_descrip varchar(1000) not null CONSTRAINT DF_LiquidacionItemCodigo_liqic_descrip  default (''),
 CONSTRAINT PK_LiquidacionItemCodigo PRIMARY KEY  
(
	liqic_id 
) 
) 
;

;
/****** Object:  Table TarifarioCalle    Script Date: 07/30/2012 17:31:26 ******/

;

;
create table TarifarioCalle(
	tfcalle_id int not null,
	calle_id int not null,
	tf_id int not null,
 CONSTRAINT PK_TarifarioCalle PRIMARY KEY  
(
	tfcalle_id 
) 
) 
;
/****** Object:  Table TarifarioParalela    Script Date: 07/30/2012 17:31:27 ******/

;

;
create table TarifarioParalela(
	tfp_id int not null,
	tfp_alturabase int not null CONSTRAINT DF_TarifarioParalela_tfp_alturabase  default (0),
	tfp_alturadesde int not null CONSTRAINT DF_TarifarioParalela_tfp_alturadesde  default (0),
	tfcalle_id int not null,
	calle_id int not null,
	tf_id int not null,
 CONSTRAINT PK_TarifarioParalela PRIMARY KEY  
(
	tfp_id 
) 
) 
;
/****** Object:  Table CalleAltura    Script Date: 07/30/2012 17:04:06 ******/

;

;

;
create table CalleAltura(
	callea_id int not null,
	callea_desde int not null,
	callea_hasta int not null,
	callea_guiafilcar varchar(50) not null CONSTRAINT DF_CalleAltura_calle_guiafilcar  default (''),
	callea_sentido smallint not null CONSTRAINT DF_CalleAltura_calle_sentido  default (0),
	calle_id int not null,
 CONSTRAINT PK_CalleAltura PRIMARY KEY  
(
	callea_id 
) 
) 
;

;
/****** Object:  Table Curso    Script Date: 07/30/2012 17:07:44 ******/

;

;

;
create table Curso(
	cur_id int not null,
	cur_nombre varchar(100) not null,
	cur_codigo varchar(15) not null,
	cur_descrip varchar(255) not null CONSTRAINT DF_Curso_cur_descrip  default (''),
	cur_desde timestamptz not null CONSTRAINT DF_Curso_cur_desde  default ('19000101'),
	cur_hasta timestamptz not null CONSTRAINT DF_Curso_cur_hasta  default ('19000101'),
	mat_id int not null,
	prof_id int null,
	prof_id_ayudante1 int null,
	prof_id_ayudante2 int null,
	prof_id_ayudante3 int null,
	prof_id_ayudante4 int null,
	prof_id_ayudante5 int null,
	creado timestamptz not null CONSTRAINT DF_Curso_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Curso_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Curso_activo  default (1),
 CONSTRAINT PK_Curso PRIMARY KEY  
(
	cur_id 
) 
) 
;

;
/****** Object:  Table ProductoSerieKitTMP    Script Date: 07/30/2012 17:26:28 ******/

;

;

;
create table ProductoSerieKitTMP(
	ppkTMP_id int not null,
	ppkiTMP_id int not null,
	prskTMP_id int not null,
	pr_id int not null,
	prsk_id int not null,
	prns_id int null,
	prns_codigo varchar(100) not null CONSTRAINT DF_ProductoSerieKitTMP_prns_codigo  default (''),
	prfk_id int not null,
	stl_id int null,
	stl_codigo varchar(50) not null,
 CONSTRAINT PK_ProductoSerieKitTMP PRIMARY KEY  
(
	prskTMP_id 
) 
) 
;

;
/****** Object:  Table ParteProdKitItemATMP    Script Date: 07/30/2012 17:20:34 ******/

;

;
create table ParteProdKitItemATMP(
	ppkTMP_id int not null,
	ppkiTMP_id int not null,
	ppkiaTMP_id int not null,
	ppkia_cantidad decimal(18, 6) not null CONSTRAINT DF_ParteProdKitItemATMP_ppkia_cantidad  default (0),
	pr_id int not null,
	prk_id int not null,
 CONSTRAINT PK_ParteProdKitItemATMP PRIMARY KEY  
(
	ppkiaTMP_id 
) 
) 
;
/****** Object:  Table ParteProdKitItemSerieTMP    Script Date: 07/30/2012 17:20:37 ******/

;

;

;
create table ParteProdKitItemSerieTMP(
	ppkTMP_id int not null,
	ppkiTMP_id int not null,
	ppki_id int not null CONSTRAINT DF_ParteProdKitSerieTMP_ppki_id  default (0),
	ppkisTMP_id int not null,
	ppkis_orden smallint not null CONSTRAINT DF_ParteProdKitSerieTMP_ppkis_orden  default (0),
	prns_codigo varchar(100) not null CONSTRAINT DF_ParteProdKitSerieTMP_prns_codigo  default (''),
	prns_descrip varchar(255) not null CONSTRAINT DF_ParteProdKitSerieTMP_prns_descrip  default (''),
	prns_fechavto timestamptz not null CONSTRAINT DF_ParteProdKitSerieTMP_prns_fechavto  default (getdate()),
	pr_id int not null,
	prns_id int not null CONSTRAINT DF_ParteProdKitSerieTMP_prns_id  default (0),
	pr_id_item int not null,
	pr_id_kit int null,
 CONSTRAINT PK_ParteProdKitSerieTMP PRIMARY KEY  
(
	ppkisTMP_id 
) 
) 
;

;
/****** Object:  Table ProductoSerieKitItemTMP    Script Date: 07/30/2012 17:26:26 ******/

;

;
create table ProductoSerieKitItemTMP(
	ppkTMP_id int not null,
	ppkiTMP_id int not null,
	prskTMP_id int not null,
	prskiTMP_id int not null,
	prski_cantidad decimal(18, 6) not null CONSTRAINT DF_ProductoSerieKitItemTMP_prski_cantidad  default (0),
	prk_id int not null,
	pr_id int not null,
	prns_id int null,
	stl_id int null,
 CONSTRAINT PK_ProductoSerieKitItemTMP PRIMARY KEY  
(
	prskiTMP_id 
) 
) 
;
/****** Object:  Table ParteProdKitItemBorradoTMP    Script Date: 07/30/2012 17:20:35 ******/

;

;
create table ParteProdKitItemBorradoTMP(
	ppkTMP_id int not null,
	ppkibTMP_id int not null,
	ppk_id int not null,
	ppki_id int not null,
 CONSTRAINT PK_ParteProdKitItemBorradoTMP PRIMARY KEY  
(
	ppkibTMP_id 
) 
) 
;
/****** Object:  Table ProductoSerieKitBorradoTMP    Script Date: 07/30/2012 17:26:22 ******/

;

;
create table ProductoSerieKitBorradoTMP(
	ppkTMP_id int not null,
	prskbTMP_id int not null,
	ppk_id int not null,
	prsk_id int not null,
 CONSTRAINT PK_ProductoSerieKitBorradoTMP PRIMARY KEY  
(
	prskbTMP_id 
) 
) 
;
/****** Object:  Table ParteProdKitItemTMP    Script Date: 07/30/2012 17:20:39 ******/

;

;

;
create table ParteProdKitItemTMP(
	ppkTMP_id int not null,
	ppkiTMP_id int not null,
	ppki_id int not null,
	ppki_orden smallint not null,
	ppki_cantidad decimal(18, 6) not null CONSTRAINT DF_ParteProdKitItemTMP_ppki_cantidad  default (0),
	ppki_descrip varchar(5000) not null CONSTRAINT DF_ParteProdKitItemTMP_ppki_descrip  default (''),
	pr_id int not null,
	depl_id int not null,
	prfk_id int null,
 CONSTRAINT PK_ParteProdKitItemTMP PRIMARY KEY  
(
	ppkiTMP_id 
) 
) 
;

;
/****** Object:  Table OrdenServicio    Script Date: 07/30/2012 17:19:04 ******/

;

;

;
create table OrdenServicio(
	os_id int not null,
	os_numero int not null,
	os_nrodoc varchar(50) not null CONSTRAINT DF_OrdenServicio_os_nrodoc  default (''),
	os_descrip varchar(5000) not null CONSTRAINT DF_OrdenServicio_os_descrip  default (''),
	os_fecha timestamptz not null CONSTRAINT DF_OrdenServicio_os_fecha  default (getdate()),
	os_hora smallint not null CONSTRAINT DF_OrdenServicio_os_hora  default (0),
	os_fechaentrega timestamptz not null CONSTRAINT DF_OrdenServicio_pc_fechaentrega  default (getdate()),
	os_neto decimal(18, 6) not null CONSTRAINT DF_OrdenServicio_pc_neto  default (0),
	os_ivari decimal(18, 6) not null CONSTRAINT DF_OrdenServicio_pc_ivari  default (0),
	os_ivarni decimal(18, 6) not null CONSTRAINT DF_OrdenServicio_pc_ivarni  default (0),
	os_total decimal(18, 6) not null CONSTRAINT DF_OrdenServicio_pc_total  default (0),
	os_subtotal decimal(18, 6) not null CONSTRAINT DF_OrdenServicio_pc_subtotal  default (0),
	os_pendiente decimal(18, 6) not null CONSTRAINT DF_OrdenServicio_pc_pendiente  default (0),
	os_descuento1 decimal(18, 6) not null CONSTRAINT DF_OrdenServicio_pc_descuento1  default (0),
	os_descuento2 decimal(18, 6) not null CONSTRAINT DF_OrdenServicio_pc_descuento2  default (0),
	os_importedesc1 decimal(18, 6) not null CONSTRAINT DF_OrdenServicio_pc_importedesc1  default (0),
	os_importedesc2 decimal(18, 6) not null CONSTRAINT DF_OrdenServicio_pc_importedesc2  default (0),
	os_firmado int not null CONSTRAINT DF_OrdenServicio_pc_firmado  default (0),
	os_cotizacion decimal(18, 6) not null CONSTRAINT DF_OrdenServicio_fc_cotizacion  default (0),
	est_id int not null,
	ccos_id int null,
	emp_id int not null,
	suc_id int not null,
	cli_id int not null,
	clis_id int null,
	cont_id int null,
	doc_id int not null,
	doct_id int not null,
	proy_id int null,
	lp_id int null,
	ld_id int null,
	lgj_id int null,
	cpg_id int null,
	st_id int null,
	tar_id int null,
	us_id_tecnico int null,
	prio_id int null,
	inct_id int null,
	inca_id int null,
	zon_id int null,
	creado timestamptz not null CONSTRAINT DF_OrdenServicio_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_OrdenServicio_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null default (0),
	impid_id int null,
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_OrdenServicio PRIMARY KEY  
(
	os_id 
),
 CONSTRAINT IX_OrdenServicio UNIQUE  
(
	os_numero 
),
 CONSTRAINT IX_OrdenServicioNroDoc UNIQUE  
(
	emp_id,
	os_nrodoc 
) 
) 
;

;
/****** Object:  Table PackingList    Script Date: 07/30/2012 17:19:43 ******/

;

;

;
create table PackingList(
	pklst_id int not null,
	pklst_numero int not null,
	pklst_nrodoc varchar(20) not null CONSTRAINT DF_PackingList_pklst_nrodoc  default (''),
	pklst_fecha timestamptz not null CONSTRAINT DF_PackingList_pklst_fecha  default (getdate()),
	pklst_fechaentrega timestamptz not null CONSTRAINT DF_PackingList_pklst_fechadoc  default (getdate()),
	pklst_cantidad int not null CONSTRAINT DF_PackingList_pklst_cantidad  default (0),
	pklst_pallets int not null CONSTRAINT DF_PackingList_pklst_pallets  default (0),
	pklst_pendiente decimal(18, 6) not null CONSTRAINT DF_PackingList_pklst_pendiente  default (0),
	pklst_descrip varchar(255) not null CONSTRAINT DF_PackingList_pklst_descrip  default (''),
	pklst_marca varchar(255) not null CONSTRAINT DF_PackingList_pklst_marca  default (''),
	pklst_firmado int not null CONSTRAINT DF_PackingList_pklst_firmado  default (0),
	pklst_neto decimal(18, 6) not null CONSTRAINT DF_PackingList_rv_neto  default (0),
	pklst_ivari decimal(18, 6) not null CONSTRAINT DF_PackingList_rv_ivari  default (0),
	pklst_ivarni decimal(18, 6) not null CONSTRAINT DF_PackingList_rv_ivarni  default (0),
	pklst_subtotal decimal(18, 6) not null CONSTRAINT DF_PackingList_rv_subtotal  default (0),
	pklst_total decimal(18, 6) not null CONSTRAINT DF_PackingList_rv_total  default (0),
	pklst_descuento1 decimal(18, 6) not null CONSTRAINT DF_PackingList_rv_descuento1  default (0),
	pklst_descuento2 decimal(18, 6) not null CONSTRAINT DF_PackingList_rv_descuento2  default (0),
	pklst_importedesc1 decimal(18, 6) not null CONSTRAINT DF_PackingList_rv_importedesc1  default (0),
	pklst_importedesc2 decimal(18, 6) not null CONSTRAINT DF_PackingList_rv_importedesc2  default (0),
	est_id int not null,
	suc_id int not null,
	doc_id int not null,
	doct_id int not null,
	ccos_id int null,
	cli_id int not null,
	barc_id int null,
	pue_id_origen int null,
	pue_id_destino int null,
	lp_id int null,
	ld_id int null,
	lgj_id int null,
	cpg_id int null,
	creado timestamptz not null CONSTRAINT DF_PackingList_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_PackingList_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_PackingList PRIMARY KEY  
(
	pklst_id 
) 
) 
;

;
/****** Object:  Table ImportacionTemp    Script Date: 07/30/2012 17:14:16 ******/

;

;

;
create table ImportacionTemp(
	impt_id int not null,
	impt_numero int not null,
	impt_nrodoc varchar(50) not null CONSTRAINT DF_ImportacionTemp_impt_nrodoc  default (''),
	impt_despachonro varchar(50) not null CONSTRAINT DF_ImportacionTemp_impt_despachonro  default (''),
	impt_descrip varchar(5000) not null CONSTRAINT DF_ImportacionTemp_impt_descrip  default (''),
	impt_fecha timestamptz not null CONSTRAINT DF_ImportacionTemp_impt_fecha  default (getdate()),
	impt_fechaentrega timestamptz not null CONSTRAINT DF_ImportacionTemp_pc_fechaentrega  default (getdate()),
	impt_fechaoficial timestamptz not null CONSTRAINT DF_ImportacionTemp_impt_fechaoficial  default (getdate()),
	impt_neto decimal(18, 6) not null CONSTRAINT DF_ImportacionTemp_pc_neto  default (0),
	impt_ivari decimal(18, 6) not null CONSTRAINT DF_ImportacionTemp_pc_ivari  default (0),
	impt_ivarni decimal(18, 6) not null CONSTRAINT DF_ImportacionTemp_pc_ivarni  default (0),
	impt_total decimal(18, 6) not null CONSTRAINT DF_ImportacionTemp_pc_total  default (0),
	impt_subtotal decimal(18, 6) not null CONSTRAINT DF_ImportacionTemp_pc_subtotal  default (0),
	impt_descuento1 decimal(18, 6) not null CONSTRAINT DF_ImportacionTemp_pc_descuento1  default (0),
	impt_descuento2 decimal(18, 6) not null CONSTRAINT DF_ImportacionTemp_pc_descuento2  default (0),
	impt_importedesc1 decimal(18, 6) not null CONSTRAINT DF_ImportacionTemp_pc_importedesc1  default (0),
	impt_importedesc2 decimal(18, 6) not null CONSTRAINT DF_ImportacionTemp_pc_importedesc2  default (0),
	impt_firmado int not null CONSTRAINT DF_ImportacionTemp_pc_firmado  default (0),
	impt_seguro decimal(18, 6) not null CONSTRAINT DF_ImportacionTemp_impt_seguro  default (0),
	impt_flete decimal(18, 6) not null CONSTRAINT DF_ImportacionTemp_impt_flete  default (0),
	est_id int not null,
	ccos_id int null,
	suc_id int not null,
	prov_id int not null,
	doc_id int not null,
	doct_id int not null,
	lp_id int null,
	ld_id int null,
	lgj_id int null,
	cpg_id int null,
	st_id int null,
	creado timestamptz not null CONSTRAINT DF_ImportacionTemp_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ImportacionTemp_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_ImportacionTemp PRIMARY KEY  
(
	impt_id 
) 
) 
;

;
/****** Object:  Table ListaDescuentoCliente    Script Date: 07/30/2012 17:15:58 ******/

;

;
create table ListaDescuentoCliente(
	ldcli_id int not null,
	ld_id int not null,
	cli_id int not null,
	creado timestamptz not null CONSTRAINT DF_ListaDescuentoCliente_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ListaDescuentoCliente_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ListaDescuentoCliente PRIMARY KEY  
(
	ldcli_id 
) 
) 
;
/****** Object:  Table Cliente    Script Date: 07/30/2012 17:05:14 ******/

;

;

;
create table Cliente(
	cli_id int not null,
	cli_nombre varchar(255) not null,
	cli_codigo varchar(255) not null,
	cli_contacto varchar(100) not null CONSTRAINT DF_Cliente_cli_contacto  default (''),
	cli_descrip varchar(255) not null CONSTRAINT DF_Cliente_cli_descrip  default (''),
	cli_razonsocial varchar(255) not null CONSTRAINT DF_Cliente_prov_razonsocial  default (''),
	cli_cuit varchar(50) not null CONSTRAINT DF_Cliente_prov_cuit  default (''),
	cli_cuitexterior varchar(100) not null CONSTRAINT DF_Cliente_cli_cuitexterior  default (''),
	cli_ingresosbrutos varchar(20) not null CONSTRAINT DF_Cliente_prov_ingresosbrutos  default (''),
	cli_catfiscal smallint not null CONSTRAINT DF_Cliente_prov_catfiscal  default (1),
	cli_chequeorden varchar(100) not null CONSTRAINT DF_Cliente_prov_chequeorden  default (''),
	cli_codpostal varchar(50) not null CONSTRAINT DF_Cliente_prov_codpostal  default (''),
	cli_localidad varchar(100) not null CONSTRAINT DF_Cliente_cli_localidad  default (''),
	cli_calle varchar(100) not null CONSTRAINT DF_Cliente_prov_calle  default (''),
	cli_callenumero varchar(100) not null CONSTRAINT DF_Cliente_prov_callenumero  default ('s/n'),
	cli_piso varchar(100) not null CONSTRAINT DF_Cliente_prov_piso  default ('PB'),
	cli_depto varchar(100) not null CONSTRAINT DF_Cliente_prov_depto  default (''),
	cli_tel varchar(100) not null CONSTRAINT DF_Cliente_prov_tel  default (''),
	cli_fax varchar(100) not null CONSTRAINT DF_Cliente_prov_fax  default (''),
	cli_email varchar(100) not null CONSTRAINT DF_Cliente_prov_email  default (''),
	cli_web varchar(100) not null CONSTRAINT DF_Cliente_prov_web  default (''),
	cli_creditoctacte decimal(18, 6) not null CONSTRAINT DF_Cliente_cli_creditoctacte  default (0),
	cli_creditototal decimal(18, 6) not null CONSTRAINT DF_Cliente_cli_creditototal  default (0),
	cli_creditoactivo smallint not null CONSTRAINT DF_Cliente_cli_creditoactivo  default (1),
	cli_deudapedido decimal(18, 6) not null CONSTRAINT DF_Cliente_cli_deudapedido  default (0),
	cli_deudaorden decimal(18, 6) not null CONSTRAINT DF_Cliente_cli_deudaorden  default (0),
	cli_deudaremito decimal(18, 6) not null CONSTRAINT DF_Cliente_cli_duedaRemito  default (0),
	cli_deudapackinglist decimal(18, 6) not null CONSTRAINT DF_Cliente_cli_deudapackinglist  default (0),
	cli_deudamanifiesto decimal(18, 6) not null CONSTRAINT DF__Cliente__cli_deu__389EFA16  default (0),
	cli_deudactacte decimal(18, 6) not null CONSTRAINT DF_Cliente_cli_deudactacte  default (0),
	cli_deudadoc decimal(18, 6) not null CONSTRAINT DF_Cliente_cli_deudadoc  default (0),
	cli_deudatotal decimal(18, 6) not null CONSTRAINT DF_Cliente_cli_deudatotal  default (0),
	cli_yahoo varchar(50) not null CONSTRAINT DF_Cliente_cli_yahoo  default (''),
	cli_messanger varchar(100) not null CONSTRAINT DF_Cliente_cli_messanger  default (''),
	cli_exigeTransporte smallint not null CONSTRAINT DF_Cliente_cli_exigeTransporte  default (0),
	cli_id_padre int null,
	cli_pciaTransporte smallint not null CONSTRAINT DF_Cliente_cli_pciaTransporte_1  default (0),
	cli_exigeProvincia smallint not null CONSTRAINT DF_Cliente_cli_exigeProvincia  default (0),
	cli_esprospecto smallint not null CONSTRAINT DF_Cliente_cli_esprospecto  default (0),
	cli_horario_m_desde timestamptz not null CONSTRAINT DF_Cliente_cli_horario_m_desde  default ('19000101'),
	cli_horario_m_hasta timestamptz not null CONSTRAINT DF_Cliente_cli_horario_m_hasta  default ('19000101'),
	cli_horario_t_desde timestamptz not null CONSTRAINT DF_Cliente_cli_horario_t_desde  default ('19000101'),
	cli_horario_t_hasta timestamptz not null CONSTRAINT DF_Cliente_cli_horario_t_hasta  default ('19000101'),
	cli_codigocomunidad varchar(100) not null CONSTRAINT DF_Cliente_cli_codigocomunidad  default (''),
	us_id int null,
	pro_id int null,
	zon_id int null,
	cpg_id int null,
	lp_id int null,
	ld_id int null,
	ven_id int null,
	trans_id int null,
	clict_id int null,
	proy_id int null,
	cli_id_referido int null,
	cpa_id int null,
	fp_id int null,
	creado timestamptz not null CONSTRAINT DF_Cliente_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Cliente_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Cliente_activo  default (1),
 CONSTRAINT PK_Cliente PRIMARY KEY  
(
	cli_id 
) 
) 
;

;
;
--, @value=N'', @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'table',@level1name=N'Cliente', @level2type=N'COLUMN',@level2name=N'cli_ingresosbrutos'
;
/****** Object:  Table ListaDescuentoProveedor    Script Date: 07/30/2012 17:16:02 ******/

;

;
create table ListaDescuentoProveedor(
	ldprov_id int not null,
	ld_id int not null,
	prov_id int not null,
	creado timestamptz not null CONSTRAINT DF_ListaDescuentoProveedor_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ListaDescuentoProveedor_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ListaDescuentoProveedor PRIMARY KEY  
(
	ldprov_id 
) 
) 
;
/****** Object:  Table RemitoCompra    Script Date: 07/30/2012 17:27:48 ******/

;

;

;
create table RemitoCompra(
	rc_id int not null,
	rc_numero int not null,
	rc_nrodoc varchar(50) not null CONSTRAINT DF_RemitoCompra_rc_nrodoc  default (''),
	rc_descrip varchar(5000) not null CONSTRAINT DF_RemitoCompra_rc_descrip  default (''),
	rc_fecha timestamptz not null CONSTRAINT DF_RemitoCompra_rc_fecha  default (getdate()),
	rc_fechaentrega timestamptz not null CONSTRAINT DF_RemitoCompra_pc_fechaentrega  default (getdate()),
	rc_neto decimal(18, 6) not null CONSTRAINT DF_RemitoCompra_pc_neto  default (0),
	rc_ivari decimal(18, 6) not null CONSTRAINT DF_RemitoCompra_pc_ivari  default (0),
	rc_ivarni decimal(18, 6) not null CONSTRAINT DF_RemitoCompra_pc_ivarni  default (0),
	rc_total decimal(18, 6) not null CONSTRAINT DF_RemitoCompra_pc_total  default (0),
	rc_subtotal decimal(18, 6) not null CONSTRAINT DF_RemitoCompra_pc_subtotal  default (0),
	rc_pendiente decimal(18, 6) not null CONSTRAINT DF_RemitoCompra_pc_pendiente  default (0),
	rc_descuento1 decimal(18, 6) not null CONSTRAINT DF_RemitoCompra_pc_descuento1  default (0),
	rc_descuento2 decimal(18, 6) not null CONSTRAINT DF_RemitoCompra_pc_descuento2  default (0),
	rc_importedesc1 decimal(18, 6) not null CONSTRAINT DF_RemitoCompra_pc_importedesc1  default (0),
	rc_importedesc2 decimal(18, 6) not null CONSTRAINT DF_RemitoCompra_pc_importedesc2  default (0),
	rc_firmado int not null CONSTRAINT DF_RemitoCompra_pc_firmado  default (0),
	rc_cotizacion decimal(18, 6) not null CONSTRAINT DF_RemitoCompra_fc_cotizacion  default (0),
	est_id int not null,
	ccos_id int null,
	suc_id int not null,
	prov_id int not null,
	doc_id int not null,
	doct_id int not null,
	lp_id int null,
	ld_id int null,
	lgj_id int null,
	cpg_id int null,
	st_id int null,
	creado timestamptz not null CONSTRAINT DF_RemitoCompra_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_RemitoCompra_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_RemitoCompra PRIMARY KEY  
(
	rc_id 
),
 CONSTRAINT IX_RemitoCompra UNIQUE  
(
	rc_numero 
),
 CONSTRAINT IX_RemitoCompraNroDoc UNIQUE  
(
	rc_nrodoc,
	prov_id 
) 
) 
;

;
/****** Object:  Table ListaDescuentoItem    Script Date: 07/30/2012 17:16:00 ******/

;

;
create table ListaDescuentoItem(
	ld_id int not null,
	ldi_id int not null,
	ldi_importe decimal(18, 6) not null CONSTRAINT DF_ListaDescuentoItem_ldi_precio  default (0),
	ldi_porcentaje decimal(18, 6) not null CONSTRAINT DF_ListaDescuentoItem_ldi_porcentaje  default (0),
	pr_id int not null,
	activo smallint not null CONSTRAINT DF_ListaDescuentoItem_activo  default (1),
	creado timestamptz not null CONSTRAINT DF_ListaDescuentoItem_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ListaDescuentoItem_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ListaDescuentoItem PRIMARY KEY  
(
	ldi_id 
) 
) 
;
/****** Object:  Table PedidoVenta    Script Date: 07/30/2012 17:22:03 ******/

;

;

;
create table PedidoVenta(
	pv_id int not null,
	pv_numero int not null,
	pv_nrodoc varchar(50) not null CONSTRAINT DF_PedidoVenta_pv_nrodoc  default (''),
	pv_descrip varchar(5000) not null CONSTRAINT DF_PedidoVenta_pv_descrip  default (''),
	pv_fecha timestamptz not null CONSTRAINT DF_PedidoVenta_pv_fecha  default (getdate()),
	pv_fechaentrega timestamptz not null CONSTRAINT DF_PedidoVenta_pv_fechaentrega  default (getdate()),
	pv_neto decimal(18, 6) not null CONSTRAINT DF_PedidoVenta_pv_neto  default (0),
	pv_ivari decimal(18, 6) not null CONSTRAINT DF_PedidoVenta_pv_impuesto  default (0),
	pv_ivarni decimal(18, 6) not null CONSTRAINT DF_PedidoVenta_pv_ivarni  default (0),
	pv_subtotal decimal(18, 6) not null CONSTRAINT DF_PedidoVenta_pv_subtotal  default (0),
	pv_total decimal(18, 6) not null CONSTRAINT DF_PedidoVenta_pv_total  default (0),
	pv_pendiente decimal(18, 6) not null CONSTRAINT DF_PedidoVenta_pv_pendiente  default (0),
	pv_firmado int not null CONSTRAINT DF_PedidoVenta_pv_firmado  default (0),
	pv_descuento1 decimal(18, 6) not null CONSTRAINT DF_PedidoVenta_pv_descuento  default (0),
	pv_descuento2 decimal(18, 6) not null CONSTRAINT DF_PedidoVenta_pv_descuento2  default (0),
	pv_importedesc1 decimal(18, 6) not null CONSTRAINT DF_PedidoVenta_pv_importedesc1  default (0),
	pv_importedesc2 decimal(18, 6) not null CONSTRAINT DF_PedidoVenta_pv_importedesc2  default (0),
	pv_destinatario varchar(1000) not null CONSTRAINT DF_PedidoVenta_rv_destinatario  default (''),
	pv_ordencompra varchar(255) not null CONSTRAINT DF_PedidoVenta_pv_ordencompra  default (''),
	pv_cvxi_calificado smallint not null CONSTRAINT DF_PedidoVenta_pv_cvxi_calificado  default (0),
	est_id int not null,
	suc_id int not null,
	cli_id int not null,
	emp_id int not null,
	doc_id int not null,
	doct_id int not null,
	lp_id int null,
	ld_id int null,
	cpg_id int not null,
	ccos_id int null,
	ven_id int null,
	lgj_id int null,
	pro_id_origen int null,
	pro_id_destino int null,
	trans_id int null,
	chof_id int null,
	cam_id int null,
	cam_id_semi int null,
	ram_id_stock varchar(50) not null CONSTRAINT DF_PedidoVenta_ram_id_stock  default (''),
	clis_id int null,
	creado timestamptz not null CONSTRAINT DF_PedidoVenta_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_PedidoVenta_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null CONSTRAINT DF__PedidoVen__impre__00C02307  default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_PedidoVenta PRIMARY KEY  
(
	pv_id 
),
 CONSTRAINT IX_PedidoVenta UNIQUE  
(
	pv_numero 
),
 CONSTRAINT IX_PedidoVentaNroDoc UNIQUE  
(
	emp_id,
	pv_nrodoc 
) 
) 
;

;
/****** Object:  Table RemitoVenta    Script Date: 07/30/2012 17:28:33 ******/

;

;

;
create table RemitoVenta(
	rv_id int not null,
	rv_numero int not null,
	rv_nrodoc varchar(50) not null CONSTRAINT DF_RemitoVenta_pv_nrodoc  default (''),
	rv_descrip varchar(5000) not null CONSTRAINT DF_RemitoVenta_pv_descrip  default (''),
	rv_fecha timestamptz not null CONSTRAINT DF_RemitoVenta_pv_fecha  default (getdate()),
	rv_fechaentrega timestamptz not null CONSTRAINT DF_RemitoVenta_pv_fechaentrega  default (getdate()),
	rv_neto decimal(18, 6) not null CONSTRAINT DF_RemitoVenta_pv_neto  default (0),
	rv_ivari decimal(18, 6) not null CONSTRAINT DF_RemitoVenta_pv_ivari  default (0),
	rv_ivarni decimal(18, 6) not null CONSTRAINT DF_RemitoVenta_pv_ivarni  default (0),
	rv_subtotal decimal(18, 6) not null CONSTRAINT DF_RemitoVenta_pv_subtotal  default (0),
	rv_total decimal(18, 6) not null CONSTRAINT DF_RemitoVenta_pv_total  default (0),
	rv_pendiente decimal(18, 6) not null CONSTRAINT DF_RemitoVenta_pv_pendiente  default (0),
	rv_firmado int not null CONSTRAINT DF_RemitoVenta_pv_firmado  default (0),
	rv_descuento1 decimal(18, 6) not null CONSTRAINT DF_RemitoVenta_pv_descuento1  default (0),
	rv_descuento2 decimal(18, 6) not null CONSTRAINT DF_RemitoVenta_pv_descuento2  default (0),
	rv_importedesc1 decimal(18, 6) not null CONSTRAINT DF_RemitoVenta_pv_importedesc1  default (0),
	rv_importedesc2 decimal(18, 6) not null CONSTRAINT DF_RemitoVenta_pv_importedesc2  default (0),
	rv_cotizacion decimal(18, 6) not null CONSTRAINT DF_RemitoVenta_rv_cotizacion  default (0),
	rv_retiro varchar(255) not null CONSTRAINT DF_RemitoVenta_rv_retiro  default (''),
	rv_guia varchar(255) not null CONSTRAINT DF_RemitoVenta_rv_guia  default (''),
	rv_destinatario varchar(1000) not null CONSTRAINT DF_RemitoVenta_rv_destinatario  default (''),
	rv_ordencompra varchar(255) not null CONSTRAINT DF_RemitoVenta_rv_ordencompra  default (''),
	est_id int not null,
	suc_id int not null,
	cli_id int not null,
	emp_id int not null,
	doc_id int not null,
	doct_id int not null,
	lp_id int null,
	ld_id int null,
	lgj_id int null,
	cpg_id int null,
	ccos_id int null,
	ven_id int null,
	pro_id_origen int null,
	pro_id_destino int null,
	trans_id int null,
	st_id int null,
	st_id_consumo int null,
	st_id_consumoTemp int null,
	st_id_producido int null,
	clis_id int null,
	impid_id int null,
	chof_id int null,
	cam_id int null,
	cam_id_semi int null,
	creado timestamptz not null CONSTRAINT DF_RemitoVenta_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_RemitoVenta_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null CONSTRAINT DF__RemitoVen__impre__7ED7DA95  default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_RemitoVenta PRIMARY KEY  
(
	rv_id 
),
 CONSTRAINT IX_RemitoVentaNroDocEmpresa UNIQUE  
(
	emp_id,
	rv_nrodoc 
),
 CONSTRAINT IX_RemitoVentaNumero UNIQUE  
(
	rv_numero 
) 
) 
;

;
/****** Object:  Table Proveedor    Script Date: 07/30/2012 17:26:46 ******/

;

;

;
create table Proveedor(
	prov_id int not null,
	prov_nombre varchar(255) not null,
	prov_codigo varchar(20) not null,
	prov_descrip varchar(255) not null CONSTRAINT DF_Proveedor_prov_descrip  default (''),
	prov_contacto varchar(5000) null CONSTRAINT DF_Proveedor_prov_contacto  default (''),
	prov_razonsocial varchar(255) not null CONSTRAINT DF_Proveedor_prov_razonsocial  default (''),
	prov_cuit varchar(20) not null CONSTRAINT DF_Proveedor_prov_cuit  default (''),
	prov_ingresosbrutos varchar(20) not null CONSTRAINT DF_Proveedor_prov_ingresosbrutos  default (''),
	prov_catfiscal smallint not null CONSTRAINT DF_Proveedor_prov_catfiscal  default (1),
	prov_chequeorden varchar(100) not null CONSTRAINT DF_Proveedor_prov_chequeorden  default (''),
	prov_codpostal varchar(50) not null CONSTRAINT DF_Proveedor_prov_codpostal  default (''),
	prov_localidad varchar(100) not null,
	prov_calle varchar(100) not null CONSTRAINT DF_Proveedor_prov_calle  default (''),
	prov_callenumero varchar(100) not null CONSTRAINT DF_Proveedor_prov_callenumero  default ('s/n'),
	prov_piso varchar(100) not null CONSTRAINT DF_Proveedor_prov_piso  default ('PB'),
	prov_depto varchar(100) not null CONSTRAINT DF_Proveedor_prov_depto  default (''),
	prov_tel varchar(100) not null CONSTRAINT DF_Proveedor_prov_tel  default (''),
	prov_fax varchar(100) not null CONSTRAINT DF_Proveedor_prov_fax  default (''),
	prov_email varchar(100) not null CONSTRAINT DF_Proveedor_prov_email  default (''),
	prov_web varchar(100) not null CONSTRAINT DF_Proveedor_prov_web  default (''),
	prov_creditoctacte decimal(18, 6) not null CONSTRAINT DF_Proveedor_cli_creditoctacte  default (0),
	prov_creditototal decimal(18, 6) not null CONSTRAINT DF_Proveedor_cli_creditototal  default (0),
	prov_creditoactivo smallint not null CONSTRAINT DF_Proveedor_cli_creditoactivo  default (1),
	prov_deudaorden decimal(18, 6) not null CONSTRAINT DF_Proveedor_cli_deudapedido  default (0),
	prov_deudaremito decimal(18, 6) not null CONSTRAINT DF_Proveedor_cli_deudaRemito  default (0),
	prov_deudactacte decimal(18, 6) not null CONSTRAINT DF_Proveedor_cli_deudactacte  default (0),
	prov_deudadoc decimal(18, 6) not null CONSTRAINT DF_Proveedor_prov_deudadoc  default (0),
	prov_deudatotal decimal(18, 6) not null CONSTRAINT DF_Proveedor_cli_deudatotal  default (0),
	prov_imprimeticket smallint not null CONSTRAINT DF_Proveedor_prov_imprimeticket  default (0),
	prov_banco varchar(255) not null CONSTRAINT DF_Proveedor_prov_banco  default (''),
	prov_nroctabanco varchar(255) not null CONSTRAINT DF_Proveedor_prov_nroctabanco  default (''),
	prov_cbu varchar(255) not null CONSTRAINT DF_Proveedor_prov_cbu  default (''),
	prov_nrocliente varchar(255) not null CONSTRAINT DF_Proveedor_prov_nrocliente  default (''),
	prov_horario_m_desde timestamptz not null CONSTRAINT DF_Proveedor_cli_horario_m_desde  default ('19000101'),
	prov_horario_m_hasta timestamptz not null CONSTRAINT DF_Proveedor_cli_horario_m_hasta  default ('19000101'),
	prov_horario_t_desde timestamptz not null CONSTRAINT DF_Proveedor_cli_horario_t_desde  default ('19000101'),
	prov_horario_t_hasta timestamptz not null CONSTRAINT DF_Proveedor_cli_horario_t_hasta  default ('19000101'),
	us_id int null,
	pro_id int null,
	zon_id int null,
	cpg_id int null,
	lp_id int null,
	ld_id int null,
	creado timestamptz not null CONSTRAINT DF_Proveedor_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Proveedor_modificado  default (getdate()),
	modifico int not null CONSTRAINT DF_Proveedor_modifico  default (0),
	activo smallint not null CONSTRAINT DF_Proveedor_activo  default (1),
 CONSTRAINT PK_Proveedor PRIMARY KEY  
(
	prov_id 
) 
) 
;

;
--, @value=N'', @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'table',@level1name=N'Proveedor', @level2type=N'COLUMN',@level2name=N'prov_cuit'
;
--, @value=N'', @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'table',@level1name=N'Proveedor', @level2type=N'COLUMN',@level2name=N'prov_ingresosbrutos'
;
/****** Object:  Table ParteReparacion    Script Date: 07/30/2012 17:20:51 ******/

;

;

;
create table ParteReparacion(
	prp_id int not null,
	prp_numero int not null,
	prp_nrodoc varchar(50) not null CONSTRAINT DF_ParteReparacion_prp_nrodoc  default (''),
	prp_descrip varchar(5000) not null CONSTRAINT DF_ParteReparacion_prp_descrip  default (''),
	prp_fecha timestamptz not null CONSTRAINT DF_ParteReparacion_prp_fecha  default (getdate()),
	prp_fechaentrega timestamptz not null CONSTRAINT DF_ParteReparacion_prp_fechaentrega  default (getdate()),
	prp_neto decimal(18, 6) not null CONSTRAINT DF_ParteReparacion_prp_neto  default (0),
	prp_ivari decimal(18, 6) not null CONSTRAINT DF_ParteReparacion_prp_ivari  default (0),
	prp_ivarni decimal(18, 6) not null CONSTRAINT DF_ParteReparacion_prp_ivarni  default (0),
	prp_subtotal decimal(18, 6) not null CONSTRAINT DF_ParteReparacion_prp_subtotal  default (0),
	prp_total decimal(18, 6) not null CONSTRAINT DF_ParteReparacion_prp_total  default (0),
	prp_descuento1 decimal(18, 6) not null CONSTRAINT DF_ParteReparacion_prp_descuento1  default (0),
	prp_descuento2 decimal(18, 6) not null CONSTRAINT DF_ParteReparacion_prp_descuento2  default (0),
	prp_importedesc1 decimal(18, 6) not null CONSTRAINT DF_ParteReparacion_prp_importedesc1  default (0),
	prp_importedesc2 decimal(18, 6) not null CONSTRAINT DF_ParteReparacion_prp_importedesc2  default (0),
	prp_cotizacion decimal(18, 6) not null CONSTRAINT DF_ParteReparacion_prp_cotizacion  default (0),
	prp_tipo smallint not null CONSTRAINT DF_ParteReparacion_prp_tipo  default (1),
	prp_estado smallint not null CONSTRAINT DF_ParteReparacion_prp_aprobado  default (1),
	est_id int not null,
	suc_id int not null,
	cli_id int not null,
	emp_id int not null,
	doc_id int not null,
	doct_id int not null,
	prns_id int not null,
	lp_id int null,
	ld_id int null,
	lgj_id int null,
	cpg_id int null,
	ccos_id int null,
	us_id int null,
	st_id int null,
	clis_id int null,
	cont_id int null,
	os_id int null,
	creado timestamptz not null CONSTRAINT DF_ParteReparacion_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ParteReparacion_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_ParteReparacion PRIMARY KEY  
(
	prp_id 
),
 CONSTRAINT IX_ParteReparacionNroDocEmpresa UNIQUE  
(
	emp_id,
	prp_nrodoc 
),
 CONSTRAINT IX_ParteReparacionNumero UNIQUE  
(
	prp_numero 
) 
) 
;

;
/****** Object:  Table PresupuestoCompra    Script Date: 07/30/2012 17:23:31 ******/

;

;

;
create table PresupuestoCompra(
	prc_id int not null,
	prc_numero int not null,
	prc_nrodoc varchar(50) not null CONSTRAINT DF_PresupuestoCompra_prc_nrodoc  default (''),
	prc_descrip varchar(5000) not null CONSTRAINT DF_PresupuestoCompra_prc_descrip  default (''),
	prc_fecha timestamptz not null CONSTRAINT DF_PresupuestoCompra_prc_fecha  default (getdate()),
	prc_fechaentrega timestamptz not null CONSTRAINT DF_PresupuestoCompra_prc_fechaentrega  default (getdate()),
	prc_neto decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompra_prc_neto  default (0),
	prc_ivari decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompra_prc_impuesto  default (0),
	prc_ivarni decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompra_prc_ivarni  default (0),
	prc_subtotal decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompra_prc_subtotal  default (0),
	prc_total decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompra_prc_total  default (0),
	prc_pendiente decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompra_prc_pendiente  default (0),
	prc_firmado int not null CONSTRAINT DF_PresupuestoCompra_prc_firmado  default (0),
	prc_descuento1 decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompra_prc_descuento  default (0),
	prc_descuento2 decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompra_prc_descuento2  default (0),
	prc_importedesc1 decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompra_prc_importedesc1  default (0),
	prc_importedesc2 decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompra_prc_importedesc2  default (0),
	est_id int not null,
	suc_id int not null,
	prov_id int not null,
	doc_id int not null,
	doct_id int not null,
	lp_id int null,
	ld_id int null,
	cpg_id int not null,
	ccos_id int null,
	us_id int null,
	lgj_id int null,
	creado timestamptz not null CONSTRAINT DF_PresupuestoCompra_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_PresupuestoCompra_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_PresupuestoCompra PRIMARY KEY  
(
	prc_id 
) 
) 
;

;
/****** Object:  Table ComunidadInternet    Script Date: 07/30/2012 17:06:07 ******/

;

;

;
create table ComunidadInternet(
	cmi_id int not null,
	cmi_nombre varchar(255) not null,
	cmi_codigo varchar(50) not null,
	cmi_descrip varchar(255) not null CONSTRAINT DF_ComunidadInternet_cmi_descrip  default (''),
	pr_id int not null,
	doc_id int not null,
	suc_id int not null,
	ld_id int null,
	lp_id int null,
	depl_id int null,
	creado timestamptz not null CONSTRAINT DF_ComunidadInternet_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ComunidadInternet_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_ComunidadInternet_activo  default (1),
 CONSTRAINT PK_ComunidadInternet PRIMARY KEY  
(
	cmi_id 
) 
) 
;

;
/****** Object:  Table PresupuestoVenta    Script Date: 07/30/2012 17:24:41 ******/

;

;

;
create table PresupuestoVenta(
	prv_id int not null,
	prv_numero int not null,
	prv_nrodoc varchar(50) not null CONSTRAINT DF_PresupuestoVenta_prv_nrodoc  default (''),
	prv_descrip varchar(5000) not null CONSTRAINT DF_PresupuestoVenta_prv_descrip  default (''),
	prv_fecha timestamptz not null CONSTRAINT DF_PresupuestoVenta_prv_fecha  default (getdate()),
	prv_fechaentrega timestamptz not null CONSTRAINT DF_PresupuestoVenta_prv_fechaentrega  default (getdate()),
	prv_neto decimal(18, 6) not null CONSTRAINT DF_PresupuestoVenta_prv_neto  default (0),
	prv_ivari decimal(18, 6) not null CONSTRAINT DF_PresupuestoVenta_prv_impuesto  default (0),
	prv_ivarni decimal(18, 6) not null CONSTRAINT DF_PresupuestoVenta_prv_ivarni  default (0),
	prv_subtotal decimal(18, 6) not null CONSTRAINT DF_PresupuestoVenta_prv_subtotal  default (0),
	prv_total decimal(18, 6) not null CONSTRAINT DF_PresupuestoVenta_prv_total  default (0),
	prv_pendiente decimal(18, 6) not null CONSTRAINT DF_PresupuestoVenta_prv_pendiente  default (0),
	prv_firmado int not null CONSTRAINT DF_PresupuestoVenta_prv_firmado  default (0),
	prv_descuento1 decimal(18, 6) not null CONSTRAINT DF_PresupuestoVenta_prv_descuento  default (0),
	prv_descuento2 decimal(18, 6) not null CONSTRAINT DF_PresupuestoVenta_prv_descuento2  default (0),
	prv_importedesc1 decimal(18, 6) not null CONSTRAINT DF_PresupuestoVenta_prv_importedesc1  default (0),
	prv_importedesc2 decimal(18, 6) not null CONSTRAINT DF_PresupuestoVenta_prv_importedesc2  default (0),
	est_id int not null,
	suc_id int not null,
	cli_id int not null,
	emp_id int not null,
	doc_id int not null,
	doct_id int not null,
	lp_id int null,
	ld_id int null,
	cpg_id int not null,
	ccos_id int null,
	ven_id int null,
	lgj_id int null,
	pro_id_origen int null,
	pro_id_destino int null,
	trans_id int null,
	clis_id int null,
	prov_id int null,
	cont_id int null,
	creado timestamptz not null CONSTRAINT DF_PresupuestoVenta_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_PresupuestoVenta_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null CONSTRAINT DF__Presupues__impre__02A86B79  default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_PresupuestoVenta PRIMARY KEY  
(
	prv_id 
),
 CONSTRAINT IX_PresupuestoVentaNroDoc UNIQUE  
(
	emp_id,
	prv_nrodoc 
) 
) 
;

;
/****** Object:  Table FacturaCompra    Script Date: 07/30/2012 17:10:57 ******/

;

;

;
create table FacturaCompra(
	fc_id int not null,
	fc_numero int not null,
	fc_nrodoc varchar(50) not null CONSTRAINT DF_FacturaCompra_fc_nrodoc  default (''),
	fc_descrip varchar(5000) not null CONSTRAINT DF_FacturaCompra_fc_descrip  default (''),
	fc_fecha timestamptz not null CONSTRAINT DF_FacturaCompra_fc_fecha  default (getdate()),
	fc_fechaentrega timestamptz not null CONSTRAINT DF_FacturaCompra_fc_fechaentrega  default (getdate()),
	fc_fechaVto timestamptz not null CONSTRAINT DF_FacturaCompra_fc_fechaVto  default ('19000101'),
	fc_fechaIva timestamptz not null CONSTRAINT DF_FacturaCompra_fc_fechaIva  default (getdate()),
	fc_neto decimal(18, 6) not null CONSTRAINT DF_FacturaCompra_fc_neto  default (0),
	fc_ivari decimal(18, 6) not null CONSTRAINT DF_FacturaCompra_fc_impuesto  default (0),
	fc_ivarni decimal(18, 6) not null CONSTRAINT DF_FacturaCompra_fc_ivarni  default (0),
	fc_internos decimal(18, 6) not null CONSTRAINT DF_FacturaCompra_fc_internos  default (0),
	fc_subtotal decimal(18, 6) not null CONSTRAINT DF_FacturaCompra_fc_subtotal  default (0),
	fc_totalotros decimal(18, 6) not null CONSTRAINT DF_FacturaCompra_fc_totalotros  default (0),
	fc_totalpercepciones decimal(18, 6) not null CONSTRAINT DF_FacturaCompra_fc_totalpercepciones  default (0),
	fc_total decimal(18, 6) not null CONSTRAINT DF_FacturaCompra_fc_total  default (0),
	fc_totalorigen decimal(18, 6) not null CONSTRAINT DF_FacturaCompra_fc_totalorigen  default (0),
	fc_totalcomercial decimal(18, 6) not null CONSTRAINT DF_FacturaCompra_fc_totalcomercial  default (0),
	fc_pendiente decimal(18, 6) not null CONSTRAINT DF_FacturaCompra_fc_pendiente  default (0),
	fc_firmado int not null CONSTRAINT DF_FacturaCompra_fc_firmado  default (0),
	fc_descuento1 decimal(18, 6) not null CONSTRAINT DF_FacturaCompra_fc_descuento  default (0),
	fc_descuento2 decimal(18, 6) not null CONSTRAINT DF_FacturaCompra_fc_descuento2  default (0),
	fc_importedesc1 decimal(18, 6) not null CONSTRAINT DF_FacturaCompra_fc_importedesc1  default (0),
	fc_importedesc2 decimal(18, 6) not null CONSTRAINT DF_FacturaCompra_fc_importedesc2  default (0),
	fc_grabarasiento smallint not null CONSTRAINT DF_FacturaCompra_fc_grabarasiento  default (0),
	fc_cotizacion decimal(18, 6) not null CONSTRAINT DF_FacturaCompra_fc_cotizacion  default (0),
	fc_cotizacionprov decimal(18, 6) not null CONSTRAINT DF_FacturaCompra_fc_cotizacionprov  default (0),
	fc_cai varchar(100) not null CONSTRAINT DF_FacturaCompra_fc_cai  default (''),
	fc_tipocomprobante smallint not null CONSTRAINT DF_FacturaCompra_fc_tipocomprobante  default (1),
	mon_id int not null,
	est_id int not null,
	suc_id int not null,
	prov_id int not null,
	doc_id int not null,
	doct_id int not null,
	lp_id int null,
	ld_id int null,
	cpg_id int not null,
	ccos_id int null,
	as_id int null,
	lgj_id int null,
	pro_id_origen int null,
	pro_id_destino int null,
	rc_id int null,
	st_id int null,
	opg_id int null,
	creado timestamptz not null CONSTRAINT DF_FacturaCompra_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_FacturaCompra_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null CONSTRAINT DF__FacturaCo__impre__7DE3B65C  default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_FacturaCompra PRIMARY KEY  
(
	fc_id 
),
 CONSTRAINT IX_FacturaCompra UNIQUE  
(
	fc_numero 
),
 CONSTRAINT IX_FacturaCompraNroDoc UNIQUE  
(
	fc_nrodoc,
	prov_id,
	doct_id 
) 
) 
;

;
/****** Object:  Table CobranzaItem    Script Date: 07/30/2012 17:05:42 ******/

;

;

;
create table CobranzaItem(
	cobz_id int not null,
	cobzi_id int not null,
	cobzi_orden smallint not null CONSTRAINT DF_CobranzaItem_cobzi_orden  default (0),
	cobzi_otroTipo smallint not null CONSTRAINT DF_CobranzaItem_cobzi_otroTipo  default (0),
	cobzi_importe decimal(18, 6) not null CONSTRAINT DF_CobranzaItem_cobzi_importe  default (0),
	cobzi_importeOrigen decimal(18, 6) not null CONSTRAINT DF_CobranzaItem_cobzi_importeOrigen  default (0),
	cobzi_descrip varchar(255) not null CONSTRAINT DF_CobranzaItem_cobzi_descrip  default (''),
	cobzi_porcRetencion decimal(18, 6) not null CONSTRAINT DF_CobranzaItem_cobzi_porcRetencion  default (0),
	cobzi_fechaRetencion timestamptz not null CONSTRAINT DF_CobranzaItem_cobzi_fechaRetencion  default (getdate()),
	cobzi_nroRetencion varchar(100) not null CONSTRAINT DF_CobranzaItem_cobzi_nroRetencion  default (''),
	cobzi_tipo smallint not null CONSTRAINT DF_CobranzaItem_cobzi_tipo  default (0),
	cobzi_tarjetaTipo smallint not null CONSTRAINT DF_CobranzaItem_cobzi_tarjetaTipo  default (1),
	cheq_id int null,
	cue_id int null,
	tjcc_id int null,
	ccos_id int null,
	ret_id int null,
	fv_id_ret int null,
 CONSTRAINT PK_CobranzaItem PRIMARY KEY  
(
	cobzi_id 
) 
) 
;

;
/****** Object:  Table AjusteInflacionItem    Script Date: 07/30/2012 17:02:43 ******/

;

;
create table AjusteInflacionItem(
	aje_id int not null,
	aji_id int not null,
	cue_id int not null,
	ajit_id int not null,
 CONSTRAINT PK_AjusteInflacionItem PRIMARY KEY  
(
	aji_id 
) 
) 
;
/****** Object:  Table MovimientoFondoItem    Script Date: 07/30/2012 17:17:24 ******/

;

;

;
create table MovimientoFondoItem(
	mf_id int not null,
	mfi_id int not null,
	mfi_orden smallint not null,
	mfi_descrip varchar(5000) not null CONSTRAINT DF_MovimientoFondoItem_mfi_descrip  default (''),
	mfi_importe decimal(18, 6) not null CONSTRAINT DF_MovimientoFondoItem_mfi_importe  default (0),
	mfi_importeorigen decimal(18, 6) not null CONSTRAINT DF_MovimientoFondoItem_mf_importeorigen  default (0),
	mfi_tipo smallint not null CONSTRAINT DF_MovimientoFondoItem_opgi_tipo  default (0),
	ccos_id int null,
	cue_id_debe int not null,
	cue_id_haber int not null,
	chq_id int null,
	cheq_id int null,
	cle_id int null,
	mfi_importeorigenhaber decimal(18, 6) not null default (0),
 CONSTRAINT PK_MovimientoFondoItem PRIMARY KEY  
(
	mfi_id 
) 
) 
;

;
/****** Object:  Table OrdenPagoItem    Script Date: 07/30/2012 17:18:24 ******/

;

;

;
create table OrdenPagoItem(
	opg_id int not null,
	opgi_id int not null,
	opgi_orden smallint not null CONSTRAINT DF_OrdenPagoItem_opgi_orden  default (0),
	opgi_otroTipo smallint not null CONSTRAINT DF_OrdenPagoItem_opgi_otroTipo  default (0),
	opgi_importe decimal(18, 6) not null CONSTRAINT DF_OrdenPagoItem_opgi_importe  default (0),
	opgi_importeOrigen decimal(18, 6) not null CONSTRAINT DF_OrdenPagoItem_opgi_importeOrigen  default (0),
	opgi_descrip varchar(255) not null CONSTRAINT DF_OrdenPagoItem_opgi_descrip  default (''),
	opgi_porcRetencion decimal(18, 6) not null CONSTRAINT DF_OrdenPagoItem_opgi_porcRetencion  default (0),
	opgi_fechaRetencion timestamptz not null CONSTRAINT DF_OrdenPagoItem_opgi_fechaRetencion  default (getdate()),
	opgi_nroRetencion varchar(100) not null CONSTRAINT DF_OrdenPagoItem_opgi_nroRetencion  default (''),
	opgi_tipo smallint not null CONSTRAINT DF_OrdenPagoItem_opgi_tipo  default (0),
	chq_id int null,
	cheq_id int null,
	cue_id int null,
	ccos_id int null,
	ret_id int null,
	fc_id_ret int null,
 CONSTRAINT PK_OrdenPagoItem PRIMARY KEY  
(
	opgi_id 
) 
) 
;

;
/****** Object:  Table FacturaCompraItem    Script Date: 07/30/2012 17:11:07 ******/

;

;

;
create table FacturaCompraItem(
	fc_id int not null,
	fci_id int not null,
	fci_orden smallint not null,
	fci_cantidad decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItem_fci_cantidad  default (0),
	fci_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItem_fci_cantidadaremitir  default (0),
	fci_pendiente decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItem_fci_pendiente_1  default (0),
	fci_descrip varchar(5000) not null CONSTRAINT DF_FacturaCompraItem_fci_descrip  default (''),
	fci_precio decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItem_fci_precio  default (0),
	fci_precioUsr decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItem_fci_precioUsr  default (0),
	fci_precioLista decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItem_fci_precioLista  default (0),
	fci_descuento varchar(100) not null CONSTRAINT DF_FacturaCompraItem_fci_descuento  default (''),
	fci_neto decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItem_fc_neto  default (0),
	fci_ivari decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItem_fci_ivari  default (0),
	fci_ivarni decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItem_fci_ivarni  default (0),
	fci_ivariporc decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItem_fci_ivariporc  default (0),
	fci_ivarniporc decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItem_fci_ivarniporc  default (0),
	fci_internosporc decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItem_fci_internosporc  default (0),
	fci_internos decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItem_fci_internos  default (0),
	fci_importe decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItem_fci_importe  default (0),
	fci_importeorigen decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItem_fc_importeorigen  default (0),
	pr_id int not null,
	ccos_id int null,
	cue_id int not null,
	cue_id_ivari int null,
	cue_id_ivarni int null,
	to_id int not null,
	stl_id int null,
 CONSTRAINT PK_FacturaCompraItem PRIMARY KEY  
(
	fci_id 
) 
) 
;

;
/****** Object:  Table PercepcionTipo    Script Date: 07/30/2012 17:22:36 ******/

;

;

;
create table PercepcionTipo(
	perct_id int not null,
	perct_nombre varchar(100) not null,
	perct_codigo varchar(15) not null,
	perct_descrip varchar(255) not null CONSTRAINT DF_PercepcionTipo_perct_descrip  default (''),
	perct_generasicore smallint not null,
	perct_codigosicore varchar(50) not null CONSTRAINT DF_PercepcionTipo_perct_codigosicore  default (''),
	cue_id int not null,
	creado timestamptz not null CONSTRAINT DF_PercepcionTipo_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_PercepcionTipo_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_PercepcionTipo_activo  default (1),
 CONSTRAINT PK_PercepcionTipo PRIMARY KEY  
(
	perct_id 
) 
) 
;

;
/****** Object:  Table TasaImpositiva    Script Date: 07/30/2012 17:31:40 ******/

;

;

;
create table TasaImpositiva(
	ti_id int not null,
	ti_nombre varchar(100) not null,
	ti_codigo varchar(15) not null,
	ti_porcentaje decimal(18, 4) not null,
	ti_codigodgi1 varchar(10) not null CONSTRAINT DF_TasaImpositiva_ti_codigodgi1  default (''),
	ti_codigodgi2 varchar(10) not null CONSTRAINT DF_TasaImpositiva_ti_codigodgi11  default (''),
	ti_tipo smallint not null CONSTRAINT DF_TasaImpositiva_ti_tipo  default (0),
	cue_id int not null,
	creado timestamptz not null CONSTRAINT DF_TasaImpositiva_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_TasaImpositiva_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_TasaImpositiva_activo  default (1),
 CONSTRAINT PK_TasaImpositiva PRIMARY KEY  
(
	ti_id 
) 
) 
;

;
/****** Object:  Table CuentaGrupo    Script Date: 07/30/2012 17:07:40 ******/

;

;

;
create table CuentaGrupo(
	cueg_id int not null,
	cueg_nombre varchar(100) not null,
	cueg_codigo varchar(15) not null,
	cueg_descrip varchar(255) not null CONSTRAINT DF_CuentaGrupo_cueg_descrip  default (''),
	cueg_tipo smallint not null CONSTRAINT DF_CuentaGrupo_cueg_tipo  default (0),
	cue_id int null,
	creado timestamptz not null CONSTRAINT DF_CuentaGrupo_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_CuentaGrupo_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_CuentaGrupo_activo  default (1),
 CONSTRAINT PK_CuentaGrupo PRIMARY KEY  
(
	cueg_id 
) 
) 
;

;
/****** Object:  Table MovimientoCajaItem    Script Date: 07/30/2012 17:17:12 ******/

;

;

;
create table MovimientoCajaItem(
	mcj_id int not null,
	mcji_id int not null,
	mcji_orden smallint not null,
	mcji_descrip varchar(5000) not null CONSTRAINT DF_MovimientoCajaItem_mcji_descrip  default (''),
	mcji_importe decimal(18, 6) not null CONSTRAINT DF_MovimientoCajaItem_mcji_debe  default (0),
	mcji_cotizacion decimal(18, 6) not null CONSTRAINT DF_MovimientoCajaItem_mcji_cotizacion  default (0),
	mcji_origen decimal(18, 6) not null CONSTRAINT DF_MovimientoCajaItem_mcji_origen  default (0),
	mon_id int not null,
	cue_id_trabajo int not null,
	cue_id_fondos int not null,
	ccos_id int null,
	cheq_id int null,
 CONSTRAINT PK_MovimientoCajaItem PRIMARY KEY  
(
	mcji_id 
) 
) 
;

;
/****** Object:  Table DepositoBancoItem    Script Date: 07/30/2012 17:08:09 ******/

;

;

;
create table DepositoBancoItem(
	dbco_id int not null,
	dbcoi_id int not null,
	dbcoi_orden smallint not null,
	dbcoi_importe decimal(18, 6) not null CONSTRAINT DF_DepositoBancoItem_dbcoi_importe  default (0),
	dbcoi_importeorigen decimal(18, 6) not null CONSTRAINT DF_DepositoBancoItem_dbcoi_importeorigen  default (0),
	dbcoi_descrip varchar(5000) not null CONSTRAINT DF_DepositoBancoItem_dbcoi_descrip  default (''),
	dbcoi_tipo smallint not null CONSTRAINT DF_DepositoBancoItem_dbcoi_tipo  default (0),
	cue_id int null,
	cheq_id int null,
	chq_id int null,
 CONSTRAINT PK_DepositoBancoItem PRIMARY KEY  
(
	dbcoi_id 
) 
) 
;

;
/****** Object:  Table ClienteCuentaGrupo    Script Date: 07/30/2012 17:05:21 ******/

;

;
create table ClienteCuentaGrupo(
	cli_id int not null,
	cueg_id int not null,
	clicueg_id int not null,
	cue_id int not null,
	creado timestamptz not null CONSTRAINT DF_ClienteCuentaGrupo_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ClienteCuentaGrupo_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ClienteCuentaGrupo PRIMARY KEY  
(
	clicueg_id 
) 
) 
;
/****** Object:  Table AsientoItem    Script Date: 07/30/2012 17:03:25 ******/

;

;

;
create table AsientoItem(
	as_id int not null,
	asi_id int not null,
	asi_orden smallint not null,
	asi_descrip varchar(5000) not null CONSTRAINT DF_AsientoItem_asi_descrip  default (''),
	asi_debe decimal(18, 6) not null CONSTRAINT DF_AsientoItem_asi_importe  default (0),
	asi_haber decimal(18, 6) not null CONSTRAINT DF_AsientoItem_asi_haber  default (0),
	asi_origen decimal(18, 6) not null CONSTRAINT DF_AsientoItem_asi_origen  default (0),
	asi_tipo smallint not null CONSTRAINT DF_AsientoItem_asi_tipo  default (0),
	asi_conciliado smallint not null CONSTRAINT DF_AsientoItem_asi_conciliado  default (1),
	mon_id int not null,
	cue_id int not null,
	ccos_id int null,
	cheq_id int null,
 CONSTRAINT PK_AsientoItem PRIMARY KEY  
(
	asi_id 
) 
) 
;

;
/****** Object:  Table FacturaCompraOtro    Script Date: 07/30/2012 17:11:34 ******/

;

;

;
create table FacturaCompraOtro(
	fc_id int not null,
	fcot_id int not null,
	fcot_orden smallint not null CONSTRAINT DF_FacturaCompraOtro_fcot_orden  default (0),
	fcot_debe decimal(18, 6) not null CONSTRAINT DF_FacturaCompraOtro_fcot_debe  default (0),
	fcot_haber decimal(18, 6) not null CONSTRAINT DF_FacturaCompraOtro_fcot_haber  default (0),
	fcot_origen decimal(18, 6) not null CONSTRAINT DF_FacturaCompraOtro_fcot_origen  default (0),
	fcot_descrip varchar(255) not null CONSTRAINT DF_FacturaCompraOtro_fcot_descrip  default (''),
	cue_id int not null,
	ccos_id int null,
 CONSTRAINT PK_FacturaCompraOtro PRIMARY KEY  
(
	fcot_id 
) 
) 
;

;
/****** Object:  Table TarjetaCredito    Script Date: 07/30/2012 17:31:31 ******/

;

;

;
create table TarjetaCredito(
	tjc_id int not null,
	tjc_nombre varchar(100) not null,
	tjc_codigo varchar(15) not null,
	tjc_descrip varchar(255) not null CONSTRAINT DF_TarjetaCredito_tjc_descrip  default (''),
	tjc_comision decimal(18, 6) not null CONSTRAINT DF_TarjetaCredito_tjc_comision  default (0),
	emp_id int not null,
	cue_id_encartera int not null,
	cue_id_banco int not null,
	cue_id_presentado int not null,
	cue_id_rechazo int not null,
	cue_id_comision int not null,
	creado timestamptz not null CONSTRAINT DF_TarjetaCredito_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_TarjetaCredito_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_TarjetaCredito_activo  default (1),
 CONSTRAINT PK_TarjetaCredito PRIMARY KEY  
(
	tjc_id 
) 
) 
;

;
/****** Object:  Table CashFlowParam    Script Date: 07/30/2012 17:04:15 ******/

;

;
create table CashFlowParam(
	cf_id int not null,
	cfp_id int not null,
	bco_id int null,
	cli_id int null,
	prov_id int null,
	cue_id int null,
 CONSTRAINT PK_CashFlowParam PRIMARY KEY  
(
	cfp_id 
) 
) 
;
/****** Object:  Table TipoOperacionCuentaGrupo    Script Date: 07/30/2012 17:31:44 ******/

;

;
create table TipoOperacionCuentaGrupo(
	to_id int not null,
	cueg_id int not null,
	tocueg_id int not null,
	cue_id int not null,
	creado timestamptz not null CONSTRAINT DF_TipoOperacionCuentaGrupo_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_TipoOperacionCuentaGrupo_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_TipoOperacionCuentaGrupo PRIMARY KEY  
(
	tocueg_id 
) 
) 
;
/****** Object:  Table EjercicioContable    Script Date: 07/30/2012 17:09:17 ******/

;

;

;
create table EjercicioContable(
	ejc_id int not null,
	ejc_nombre varchar(255) not null,
	ejc_codigo varchar(15) not null,
	ejc_fechaini timestamptz not null,
	ejc_fechafin timestamptz not null,
	ejc_descrip varchar(255) not null CONSTRAINT DF_EjercicioContable_ej_descrip  default (''),
	as_id_apertura int null,
	as_id_cierrepatrimonial int null,
	as_id_cierreresultados int null,
	emp_id varchar(50) not null CONSTRAINT DF_EjercicioContable_emp_id  default (''),
	cico_id varchar(50) not null CONSTRAINT DF_EjercicioContable_cico_id  default (''),
	cue_id_resultado int null,
	doc_id int not null,
	creado timestamptz not null CONSTRAINT DF_EjercicioContable_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_EjercicioContable_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_EjercicioContable PRIMARY KEY  
(
	ejc_id 
) 
) 
;

;
/****** Object:  Table AjusteInflacion    Script Date: 07/30/2012 17:02:40 ******/

;

;

;
create table AjusteInflacion(
	aje_id int not null,
	aje_nombre varchar(255) not null,
	aje_codigo varchar(15) not null,
	aje_descrip varchar(255) not null CONSTRAINT DF_AjusteInflacion_aje_descrip  default (''),
	aje_metodo smallint not null CONSTRAINT DF_AjusteInflacion_aje_metodo  default (1),
	aje_agrupaccos smallint not null CONSTRAINT DF_AjusteInflacion_aje_agrupactc  default (0),
	aje_incluirsinccos smallint not null CONSTRAINT DF_AjusteInflacion_aje_incluirsinctc  default (0),
	cue_id_patrimonial int not null,
	cue_id_resultados int not null,
	ccos_id varchar(50) not null CONSTRAINT DF_AjusteInflacion_ccos_id  default (''),
	creado timestamptz not null CONSTRAINT DF_AjusteInflacion_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_AjusteInflacion_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_AjusteInflacion_activo  default (1),
 CONSTRAINT PK_AjusteInflacion PRIMARY KEY  
(
	aje_id 
) 
) 
;

;
/****** Object:  Table ProveedorCuentaGrupo    Script Date: 07/30/2012 17:26:54 ******/

;

;
create table ProveedorCuentaGrupo(
	prov_id int not null,
	cueg_id int not null,
	provcueg_id int not null,
	cue_id int not null,
	creado timestamptz not null CONSTRAINT DF_ProveedorCuentaGrupo_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ProveedorCuentaGrupo_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ProveedorCuentaGrupo PRIMARY KEY  
(
	provcueg_id 
) 
) 
;
/****** Object:  Table VentaModo    Script Date: 07/30/2012 17:32:12 ******/

;

;

;
create table VentaModo(
	vm_id int not null,
	vm_nombre varchar(100) not null,
	vm_codigo varchar(15) not null,
	vm_descrip varchar(255) not null CONSTRAINT DF_VentaModo_vm_descrip  default (''),
	vm_ctacte smallint not null,
	vm_pv smallint not null CONSTRAINT DF_VentaModo_vm_pv  default (0),
	vm_os smallint not null CONSTRAINT DF_VentaModo_vm_os  default (0),
	vm_cmvxi smallint not null CONSTRAINT DF_VentaModo_vm_cmvxi  default (0),
	vm_cobz smallint not null CONSTRAINT DF_VentaModo_vm_cobz  default (0),
	cue_id int not null,
	creado timestamptz not null CONSTRAINT DF_VentaModo_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_VentaModo_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_VentaModo_activo  default (1),
 CONSTRAINT PK_VentaModo PRIMARY KEY  
(
	vm_id 
) 
) 
;

;
/****** Object:  Table ResolucionCuponItem    Script Date: 07/30/2012 17:29:15 ******/

;

;

;
create table ResolucionCuponItem(
	rcup_id int not null,
	rcupi_id int not null,
	rcupi_orden smallint not null,
	rcupi_cuota smallint not null CONSTRAINT DF_ResolucionCuponItem_rcupi_cuota  default (0),
	rcupi_comision decimal(18, 6) not null CONSTRAINT DF_ResolucionCuponItem_rcupi_interes  default (0),
	rcupi_importe decimal(18, 6) not null CONSTRAINT DF_ResolucionCuponItem_rcupi_importe  default (0),
	rcupi_importeorigen decimal(18, 6) not null CONSTRAINT DF_ResolucionCuponItem_rcupi_importeorigen  default (0),
	rcupi_descrip varchar(5000) not null CONSTRAINT DF_ResolucionCuponItem_rcupi_descrip  default (''),
	rcupi_rechazado smallint not null CONSTRAINT DF_ResolucionCuponItem_rcupi_rechazado  default (0),
	cue_id int null,
	tjcc_id int null,
 CONSTRAINT PK_ResolucionCuponItem PRIMARY KEY  
(
	rcupi_id 
) 
) 
;

;
/****** Object:  Table FacturaVentaItem    Script Date: 07/30/2012 17:12:24 ******/

;

;

;
create table FacturaVentaItem(
	fv_id int not null,
	fvi_id int not null,
	fvi_orden smallint not null,
	fvi_cantidad decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItem_fvi_cantidad  default (0),
	fvi_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItem_fvi_cantidadaremitir  default (0),
	fvi_pendiente decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItem_fvi_pendiente_1  default (0),
	fvi_pendientepklst decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItem_fvi_pendientepk  default (0),
	fvi_descrip varchar(5000) not null CONSTRAINT DF_FacturaVentaItem_fvi_descrip  default (''),
	fvi_precio decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItem_fvi_precio  default (0),
	fvi_precioUsr decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItem_fvi_precioUsr  default (0),
	fvi_precioLista decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItem_fvi_precioLista  default (0),
	fvi_descuento varchar(100) not null CONSTRAINT DF_FacturaVentaItem_fvi_descuento  default (''),
	fvi_neto decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItem_fv_neto  default (0),
	fvi_ivari decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItem_fvi_ivari  default (0),
	fvi_ivarni decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItem_fvi_ivarni  default (0),
	fvi_ivariporc decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItem_fvi_ivariporc  default (0),
	fvi_ivarniporc decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItem_fvi_ivarniporc  default (0),
	fvi_internosporc decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItem_fci_internosporc  default (0),
	fvi_internos decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItem_fci_internos  default (0),
	fvi_importe decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItem_fvi_importe  default (0),
	fvi_importeorigen decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItem_fv_importeorigen  default (0),
	fvi_nostock smallint not null CONSTRAINT DF_FacturaVentaItem_fvi_nostock  default (0),
	pr_id int not null,
	ccos_id int null,
	cue_id int not null,
	cue_id_ivari int null,
	cue_id_ivarni int null,
	to_id int not null,
	stl_id int null,
 CONSTRAINT PK_FacturaVentaItem PRIMARY KEY  
(
	fvi_id 
) 
) 
;

;
/****** Object:  Table CajaCuenta    Script Date: 07/30/2012 17:03:58 ******/

;

;
create table CajaCuenta(
	cj_id int not null,
	cjc_id int not null,
	cue_id_trabajo int not null,
	cue_id_fondos int not null,
 CONSTRAINT PK_CajaCuenta PRIMARY KEY  
(
	cjc_id 
) 
) 
;
/****** Object:  Table Cheque    Script Date: 07/30/2012 17:04:47 ******/

;

;

;
create table Cheque(
	cheq_id int not null,
	cheq_numero int not null CONSTRAINT DF_Cheque_cheq_numero  default (0),
	cheq_numerodoc varchar(100) not null CONSTRAINT DF_Cheque_cheq_numerodoc  default (''),
	cheq_importe decimal(18, 6) not null CONSTRAINT DF_Cheque_cheq_importe  default (0),
	cheq_importeOrigen decimal(18, 6) not null CONSTRAINT DF_Cheque_cheq_importeOrigen  default (0),
	cheq_tipo smallint not null,
	cheq_fechacobro timestamptz not null CONSTRAINT DF_Cheque_cheq_fechacobro  default (getdate()),
	cheq_fechaVto timestamptz not null,
	cheq_fecha2 timestamptz not null CONSTRAINT DF_Cheque_cheq_fecha2  default (getdate()),
	cheq_descrip varchar(255) not null CONSTRAINT DF_Cheque_cheq_descrip  default (''),
	cheq_anulado smallint not null CONSTRAINT DF_Cheque_cheq_anulado  default (0),
	cheq_fv_importe decimal(18, 6) not null CONSTRAINT DF_Cheque_cheq_fv_importe  default (0),
	cheq_fechaRechazo timestamptz not null CONSTRAINT DF_Cheque_cheq_fechaRechazo  default ('19000101'),
	cheq_rechazado smallint not null CONSTRAINT DF_Cheque_cheq_rechazado  default (0),
	cheq_fc_importe1 decimal(18, 6) not null CONSTRAINT DF_Cheque_cheq_fc_importe1  default (0),
	cheq_fc_importe2 decimal(18, 6) not null CONSTRAINT DF_Cheque_cheq_fc_importe11  default (0),
	cheq_cacheproc timestamptz not null CONSTRAINT DF_Cheque_cheq_cacheproc  default ('19000101'),
	cheq_propio smallint not null CONSTRAINT DF_Cheque_cheq_propio  default (0),
	cheq_sucursal varchar(255) not null CONSTRAINT DF_Cheque_cheq_sucursal  default (''),
	cobz_id int null,
	opg_id int null,
	dbco_id int null,
	cle_id int not null,
	chq_id int null,
	bco_id int not null,
	cli_id int null,
	prov_id int null,
	mon_id int not null,
	cue_id int null,
	mf_id int null,
	emp_id int not null,
	fc_id_nd1 int null,
	fc_id_nd2 int null,
	fv_id_nd int null,
 CONSTRAINT PK_Cheque PRIMARY KEY  
(
	cheq_id 
),
 CONSTRAINT IX_Cheque UNIQUE  
(
	emp_id,
	bco_id,
	cheq_numerodoc 
) 
) 
;

;
/****** Object:  Table RetencionTipo    Script Date: 07/30/2012 17:29:33 ******/

;

;

;
create table RetencionTipo(
	rett_id int not null,
	rett_nombre varchar(100) not null,
	rett_codigo varchar(15) not null,
	rett_descrip varchar(255) not null CONSTRAINT DF_RetencionTipo_rett_descrip  default (''),
	rett_generasicore smallint not null,
	rett_codigosicore varchar(50) not null CONSTRAINT DF_RetencionTipo_rett_codigosicore  default (''),
	rett_tipo smallint not null,
	cue_id int not null,
	creado timestamptz not null CONSTRAINT DF_RetencionTipo_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_RetencionTipo_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_RetencionTipo_activo  default (1),
 CONSTRAINT PK_RetencionTipo PRIMARY KEY  
(
	rett_id 
) 
) 
;

;
/****** Object:  Table DepositoCuponItem    Script Date: 07/30/2012 17:08:25 ******/

;

;

;
create table DepositoCuponItem(
	dcup_id int not null,
	dcupi_id int not null,
	dcupi_orden smallint not null,
	dcupi_importe decimal(18, 6) not null CONSTRAINT DF_DepositoCuponItem_dcupi_importe  default (0),
	dcupi_importeorigen decimal(18, 6) not null CONSTRAINT DF_DepositoCuponItem_dcupi_importeorigen  default (0),
	dcupi_descrip varchar(5000) not null CONSTRAINT DF_DepositoCuponItem_dcupi_descrip  default (''),
	cue_id int null,
	tjcc_id int null,
 CONSTRAINT PK_DepositoCuponItem PRIMARY KEY  
(
	dcupi_id 
) 
) 
;

;
/****** Object:  Table TarjetaCreditoCuota    Script Date: 07/30/2012 17:31:33 ******/

;

;
create table TarjetaCreditoCuota(
	tjc_id int not null,
	tjccu_id int not null,
	tjccu_cantidad smallint not null CONSTRAINT DF_TarjetaCreditoCuota_tjccu_cantidad  default (0),
	tjccu_comision decimal(18, 6) not null CONSTRAINT DF_TarjetaCreditoCuota_tjccu_comision  default (0),
	creado timestamptz not null CONSTRAINT DF_TarjetaCreditoCuota_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_TarjetaCreditoCuota_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_TarjetaCreditoCuota PRIMARY KEY  
(
	tjccu_id 
) 
) 
;
/****** Object:  Table TarjetaCreditoCupon    Script Date: 07/30/2012 17:31:37 ******/

;

;

;
create table TarjetaCreditoCupon(
	tjc_id int not null,
	tjcc_id int not null,
	tjcc_numero int not null CONSTRAINT DF_TarjetaCreditoCupon_tjcc_numero  default (0),
	tjcc_numerodoc varchar(100) not null CONSTRAINT DF_TarjetaCreditoCupon_tjcc_numerodoc  default (''),
	tjcc_descrip varchar(255) not null CONSTRAINT DF_TarjetaCreditoCupon_tjcc_descrip  default (''),
	tjcc_fechavto timestamptz not null CONSTRAINT DF_TarjetaCreditoCupon_tjcc_fechavto  default (getdate()),
	tjcc_nroTarjeta varchar(100) not null,
	tjcc_nroAutorizacion varchar(100) not null CONSTRAINT DF_TarjetaCreditoCupon_tjcc_nroAutorizacion  default (''),
	tjcc_titular varchar(255) not null,
	tjcc_importe decimal(18, 6) not null CONSTRAINT DF_TarjetaCreditoCupon_tjcc_importe  default (0),
	tjcc_importeOrigen decimal(18, 6) not null CONSTRAINT DF_TarjetaCreditoCupon_tjcc_importeOrigen  default (0),
	tjcc_pendiente decimal(18, 6) not null CONSTRAINT DF_TarjetaCreditoCupon_tjcc_pendiente  default (0),
	cli_id int not null,
	cue_id int not null,
	cobz_id int not null,
	mon_id int not null,
	tjccu_id int not null,
 CONSTRAINT PK_TarjetaCreditoCupon PRIMARY KEY  
(
	tjcc_id 
) 
) 
;

;
/****** Object:  Table CobranzaItemBorradoTMP    Script Date: 07/30/2012 17:05:44 ******/

;

;
create table CobranzaItemBorradoTMP(
	cobzTMP_id int not null,
	cobzibTMP_id int not null,
	cobz_id int not null,
	cobzi_id int not null,
 CONSTRAINT PK_CobranzaItemBorradoTMP PRIMARY KEY  
(
	cobzibTMP_id 
) 
) 
;
/****** Object:  Table CobranzaItemTMP    Script Date: 07/30/2012 17:05:51 ******/

;

;

;
create table CobranzaItemTMP(
	cobzTMP_id int not null,
	cobziTMP_id int not null,
	cobzi_id int not null,
	cobzi_orden smallint not null CONSTRAINT DF_CobranzaItemTMP_cobzi_orden  default (0),
	cobzi_otroTipo smallint not null CONSTRAINT DF_CobranzaItemTMP_cobzi_otroTipo  default (0),
	cobzi_importe decimal(18, 6) not null CONSTRAINT DF_CobranzaItemTMP_cobzi_importe  default (0),
	cobzi_importeOrigen decimal(18, 6) not null CONSTRAINT DF_CobranzaItemTMP_cobzi_importeOrigen  default (0),
	cobzi_descrip varchar(255) not null CONSTRAINT DF_CobranzaItemTMP_cobzi_descrip  default (''),
	cobzi_porcRetencion decimal(18, 6) not null CONSTRAINT DF_CobranzaItemTMP_cobzi_porcRetencion  default (0),
	cobzi_fechaRetencion timestamptz not null CONSTRAINT DF_CobranzaItemTMP_cobzi_fechaRetencion  default (getdate()),
	cobzi_nroRetencion varchar(100) not null CONSTRAINT DF_CobranzaItemTMP_cobzi_nroRetencion  default (''),
	cobzi_tipo smallint not null CONSTRAINT DF_CobranzaItemTMP_cobzi_tipo  default (0),
	cobzi_tarjetaTipo smallint not null CONSTRAINT DF_CobranzaItemTMP_cobzi_tarjetaTipo  default (1),
	cobziTMP_cheque varchar(50) not null CONSTRAINT DF_CobranzaItemTMP_cobziTMP_cheqe  default (''),
	cobziTMP_cupon varchar(50) not null CONSTRAINT DF_CobranzaItemTMP_cobziTMP_cupon  default (''),
	cobziTMP_fechaCobro timestamptz not null CONSTRAINT DF_CobranzaItemTMP_cobziTMP_fechaVto1  default (getdate()),
	cobziTMP_fechaVto timestamptz not null CONSTRAINT DF_CobranzaItemTMP_cobziTMP_fechaVto  default (getdate()),
	cobziTMP_titular varchar(255) not null CONSTRAINT DF_CobranzaItemTMP_cobziTMP_titular  default (''),
	cobziTMP_autorizacion varchar(50) not null CONSTRAINT DF_CobranzaItemTMP_cobziTMP_autorizacion  default (''),
	cobziTMP_nroTarjeta varchar(50) not null CONSTRAINT DF_CobranzaItemTMP_cobziTMP_nroTarjeta  default (''),
	cobziTMP_propio smallint not null CONSTRAINT DF_CobranzaItemTMP_cobziTMP_propio  default (0),
	cobziTMP_sucursal varchar(255) not null CONSTRAINT DF_CobranzaItemTMP_cobziTMP_sucursal  default (''),
	cheq_id int null,
	cue_id int null,
	tjcc_id int null,
	ccos_id int null,
	tjc_id int null,
	bco_id int null,
	cle_id int null,
	mon_id int null,
	tjccu_id int null,
	ret_id int null,
	fv_id_ret int null,
 CONSTRAINT PK_CobranzaItemTMP PRIMARY KEY  
(
	cobziTMP_id 
) 
) 
;

;
/****** Object:  Table FacturaVentaCobranzaTMP    Script Date: 07/30/2012 17:12:16 ******/

;

;
create table FacturaVentaCobranzaTMP(
	cobzTMP_id int not null,
	fvcobzTMP_id int not null,
	fvcobz_id int not null,
	fvcobz_importe decimal(18, 6) not null CONSTRAINT DF_FacturaVentaCobranzaTMP_fvcob_importe  default (0),
	fvcobz_importeOrigen decimal(18, 6) not null CONSTRAINT DF_FacturaVentaCobranzaTMP_fvcobz_importeOrigen  default (0),
	fvcobz_cotizacion decimal(18, 6) not null CONSTRAINT DF_FacturaVentaCobranzaTMP_fvcobz_cotizacion  default (0),
	fv_id int not null,
	fvd_id int null,
	fvp_id int null,
	cobz_id int not null,
 CONSTRAINT PK_FacturaVentaCobranzaTMP PRIMARY KEY  
(
	fvcobzTMP_id 
) 
) 
;
/****** Object:  Table ImportacionTempItemSerieTMP    Script Date: 07/30/2012 17:14:27 ******/

;

;

;
create table ImportacionTempItemSerieTMP(
	imptTMP_id int not null,
	imptiTMP_id int not null,
	impti_id int not null CONSTRAINT DF_ImportacionTempItemSerieTMP_impti_id  default (0),
	imptisTMP_id int not null,
	rcis_orden smallint not null CONSTRAINT DF_ImportacionTempItemSerieTMP_rcis_orden  default (0),
	prns_codigo varchar(100) not null CONSTRAINT DF_ImportacionTempItemSerieTMP_prns_codigo  default (''),
	prns_descrip varchar(255) not null CONSTRAINT DF_ImportacionTempItemSerieTMP_prns_descrip  default (''),
	prns_fechavto timestamptz not null CONSTRAINT DF_ImportacionTempItemSerieTMP_prns_fechavto  default (getdate()),
	pr_id int not null,
	prns_id int not null CONSTRAINT DF_ImportacionTempItemSerieTMP_prns_id  default (0),
 CONSTRAINT PK_ImportacionTempItemSerieTMP PRIMARY KEY  
(
	imptisTMP_id 
) 
) 
;

;
/****** Object:  Table AFIPParametro    Script Date: 07/30/2012 17:02:31 ******/

;

;

;
create table AFIPParametro(
	afparam_id int not null,
	afparam_nombre varchar(100) not null,
	afparam_descrip varchar(255) not null CONSTRAINT DF_AFIPParametro_afparam_descrip  default (''),
	afparam_tipo smallint not null,
	afparam_subTipo smallint not null CONSTRAINT DF_AFIPParametro_afparam_subTipo  default (0),
	afparam_tablaHelp int not null CONSTRAINT DF_AFIPParametro_afparam_tablaHelp  default (0),
	afparam_valor varchar(5000) not null CONSTRAINT DF_AFIPParametro_afparam_valor  default (''),
	afparam_avanzado smallint not null CONSTRAINT DF_AFIPParametro_afparam_avanzado  default (0),
	afesq_id int not null,
	creado timestamptz not null CONSTRAINT DF_AFIPParametro_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_AFIPParametro_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_AFIPParametro_activo  default (1),
 CONSTRAINT PK_AFIPParametro PRIMARY KEY  
(
	afparam_id 
) 
) 
;

;
/****** Object:  Table AFIPArchivo    Script Date: 07/30/2012 17:02:22 ******/

;

;

;
create table AFIPArchivo(
	afarch_id int not null,
	afarch_nombre varchar(100) not null,
	afarch_descrip varchar(255) not null CONSTRAINT DF_AFIPArchivo_afarch_descrip  default (''),
	afarch_separadorRegistro varchar(5) not null CONSTRAINT DF_AFIPArchivo_afarch_separadorRegistro  default (''),
	afarch_objetoentrada varchar(255) not null,
	afesq_id int not null,
	creado timestamptz not null CONSTRAINT DF_AFIPArchivo_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_AFIPArchivo_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_AFIPArchivo_activo  default (1),
 CONSTRAINT PK_AFIPArchivo PRIMARY KEY  
(
	afarch_id 
) 
) 
;

;
/****** Object:  Table OrdenRemitoVenta    Script Date: 07/30/2012 17:18:53 ******/

;

;
create table OrdenRemitoVenta(
	osrv_id int not null,
	osrv_cantidad decimal(18, 6) not null CONSTRAINT DF_OrdenRemitoVenta_osrv_cantidad  default (0),
	osi_id int not null,
	rvi_id int not null,
 CONSTRAINT PK_OrdenRemitoVenta PRIMARY KEY  
(
	osrv_id 
) 
) 
;
/****** Object:  Table RemitoDevolucionVenta    Script Date: 07/30/2012 17:28:15 ******/

;

;
create table RemitoDevolucionVenta(
	rvdv_id int not null,
	rvdv_cantidad decimal(18, 6) not null CONSTRAINT DF_RemitoDevolucionVenta_rvrd_cantidad  default (0),
	rvi_id_remito int not null,
	rvi_id_devolucion int not null,
 CONSTRAINT PK_RemitoDevolucionVenta PRIMARY KEY  
(
	rvdv_id 
) 
) 
;
/****** Object:  Table RemitoFacturaVenta    Script Date: 07/30/2012 17:28:20 ******/

;

;
create table RemitoFacturaVenta(
	rvfv_id int not null,
	rvfv_cantidad decimal(18, 6) not null CONSTRAINT DF_RemitoFacturaVenta_rvfv_cantidad  default (0),
	rvi_id int not null,
	fvi_id int not null,
 CONSTRAINT PK_RemitoFacturaVenta PRIMARY KEY  
(
	rvfv_id 
) 
) 
;
/****** Object:  Table ManifiestoCarga    Script Date: 07/30/2012 17:16:34 ******/

;

;

;
create table ManifiestoCarga(
	mfc_id int not null,
	mfc_numero int not null,
	mfc_nrodoc varchar(20) not null CONSTRAINT DF_ManifiestoCarga_mfc_nrodoc  default (''),
	mfc_fecha timestamptz not null CONSTRAINT DF_ManifiestoCarga_mfc_fecha  default (getdate()),
	mfc_fechadoc timestamptz not null CONSTRAINT DF_ManifiestoCarga_mfc_fechaRegistracion  default (getdate()),
	mfc_horapartida timestamptz not null,
	mfc_pendiente decimal(18, 6) not null CONSTRAINT DF_ManifiestoCarga_mfc_pendiente  default (0),
	mfc_chasis varchar(100) not null CONSTRAINT DF_ManifiestoCarga_mfc_chasis  default (''),
	mfc_acoplado varchar(100) not null CONSTRAINT DF_ManifiestoCarga_mfc_acoplado  default (''),
	mfc_descrip varchar(255) not null CONSTRAINT DF_ManifiestoCarga_mfc_descrip  default (''),
	mfc_firmado int not null CONSTRAINT DF_ManifiestoCarga_mfc_firmado  default (0),
	mfc_cantidad decimal(18, 6) not null CONSTRAINT DF_ManifiestoCarga_mfc_cantidad  default (0),
	mfc_total decimal(18, 6) not null CONSTRAINT DF_ManifiestoCarga_mfc_total  default (0),
	est_id int not null,
	suc_id int not null,
	doc_id int not null,
	doct_id int not null,
	cli_id int not null,
	ccos_id int null,
	cmarc_id int null,
	pue_id_origen int null,
	pue_id_destino int null,
	depl_id_origen int null,
	depl_id_destino int null,
	barc_id int null,
	trans_id int null,
	chof_id int null,
	creado timestamptz not null CONSTRAINT DF_ManifiestoCarga_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ManifiestoCarga_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_ManifiestoCarga PRIMARY KEY  
(
	mfc_id 
) 
) 
;

;
/****** Object:  Table Ciudad    Script Date: 07/30/2012 17:04:59 ******/

;

;

;
create table Ciudad(
	ciu_id int not null,
	ciu_nombre varchar(100) not null,
	ciu_codigo varchar(15) not null,
	ciu_descrip varchar(255) not null CONSTRAINT DF_Ciudad_ciu_descrip  default (''),
	pro_id int not null,
	creado timestamptz not null CONSTRAINT DF_Ciudad_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Ciudad_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Ciudad_activo  default (1),
 CONSTRAINT PK_Ciudad PRIMARY KEY  
(
	ciu_id 
) 
) 
;

;
/****** Object:  Table Persona    Script Date: 07/30/2012 17:23:06 ******/

;

;

;
create table Persona(
	prs_id int not null,
	prs_apellido varchar(100) not null CONSTRAINT DF_Persona_prs_apellido  default (''),
	prs_nombre varchar(100) not null CONSTRAINT DF_Persona_prs_nombre  default (''),
	prs_codigo varchar(100) not null,
	prs_documento varchar(50) not null CONSTRAINT DF_Persona_prs_documento  default (''),
	prs_descrip varchar(255) not null CONSTRAINT DF_Persona_prs_descrip  default (''),
	prs_interno varchar(50) not null CONSTRAINT DF_Persona_prs_interno  default (''),
	prs_telTrab varchar(50) not null CONSTRAINT DF_Persona_prs_tel  default (''),
	prs_telCasa varchar(50) not null CONSTRAINT DF_Persona_prs_telCasa  default (''),
	prs_celular varchar(50) not null CONSTRAINT DF_Persona_prs_celular  default (''),
	prs_email varchar(50) not null CONSTRAINT DF_Persona_prs_email  default (''),
	prs_web varchar(255) not null CONSTRAINT DF_Persona_prs_web  default (''),
	prs_cargo varchar(100) not null CONSTRAINT DF_Persona_prs_cargo  default (''),
	prs_codpostal varchar(50) not null CONSTRAINT DF_Persona_cli_codpostal  default (''),
	prs_localidad varchar(100) not null CONSTRAINT DF_Persona_cli_localidad  default (''),
	prs_calle varchar(100) not null CONSTRAINT DF_Persona_cli_calle  default (''),
	prs_callenumero varchar(100) not null CONSTRAINT DF_Persona_cli_callenumero  default ('s/n'),
	prs_piso varchar(100) not null CONSTRAINT DF_Persona_cli_piso  default ('PB'),
	prs_depto varchar(100) not null CONSTRAINT DF_Persona_cli_depto  default (''),
	prs_fechaNac timestamptz not null CONSTRAINT DF_Persona_prs_fechaNac  default (to_date('19000101', 'yyyymmdd')),
	prs_sexo smallint not null CONSTRAINT DF_Persona_prs_sexo  default (0),
	prs_icq varchar(255) not null CONSTRAINT DF__persona__prs_icq__7BD3B2BD  default (''),
	prs_idnextel varchar(255) not null CONSTRAINT DF__persona__prs_idn__7CC7D6F6  default (''),
	prs_messenger varchar(255) not null CONSTRAINT DF__persona__prs_mes__7DBBFB2F  default (''),
	prs_aniversario timestamptz not null CONSTRAINT DF__persona__prs_ani__7EB01F68  default (to_date('19000101', 'yyyymmdd')),
	prs_titulo varchar(255) not null CONSTRAINT DF__persona__prs_tit__7ADF8E84  default (''),
	prs_esempleado smallint not null CONSTRAINT DF_Persona_prs_esempleado  default (0),
	prsdt_id int null,
	pro_id int null,
	cli_id int null,
	prov_id int null,
	dpto_id int null,
	suc_id int null,
	creado timestamptz not null CONSTRAINT DF_Persona_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Persona_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Persona_activo  default (1),
	prs_ApellidoCasado varchar(255) not null CONSTRAINT DF__persona__prs_Ape__79EB6A4B  default (''),
	estc_id int null,
	pa_id int null,
	nive_id int null,
	profe_id int null,
 CONSTRAINT PK_Persona PRIMARY KEY  
(
	prs_id 
) 
) 
;

;
/****** Object:  Table Empleado    Script Date: 07/30/2012 17:09:34 ******/

;

;

;
create table Empleado(
	em_id int not null,
	em_apellido varchar(255) not null CONSTRAINT DF_Empleado_em_apellido  default (''),
	em_nombre varchar(255) not null CONSTRAINT DF_Empleado_em_nombre  default (''),
	em_codigo varchar(15) not null,
	em_legajo varchar(50) not null CONSTRAINT DF_Empleado_em_legajo  default (''),
	em_ingreso timestamptz not null CONSTRAINT DF_Empleado_em_ingreso  default ('19000101'),
	em_egreso timestamptz not null CONSTRAINT DF_Empleado_em_egreso  default ('19000101'),
	em_cuil varchar(20) not null CONSTRAINT DF_Empleado_em_cuil  default (''),
	em_dni varchar(20) not null CONSTRAINT DF_Empleado_em_dni  default (''),
	em_fechanacimiento timestamptz not null CONSTRAINT DF_Empleado_em_fechanacimiento  default ('19000101'),
	em_codpostal varchar(50) not null CONSTRAINT DF_Empleado_cli_codpostal  default (''),
	em_localidad varchar(100) not null CONSTRAINT DF_Empleado_cli_localidad  default (''),
	em_calle varchar(100) not null CONSTRAINT DF_Empleado_cli_calle  default (''),
	em_callenumero varchar(100) not null CONSTRAINT DF_Empleado_cli_callenumero  default ('s/n'),
	em_piso varchar(100) not null CONSTRAINT DF_Empleado_cli_piso  default ('PB'),
	em_depto varchar(100) not null CONSTRAINT DF_Empleado_cli_depto  default (''),
	em_tel varchar(100) not null CONSTRAINT DF_Empleado_cli_tel  default (''),
	em_email varchar(100) not null CONSTRAINT DF_Empleado_em_email  default (''),
	em_libreta varchar(20) not null CONSTRAINT DF_Empleado_em_libreta  default (''),
	em_tipoLiquidacion smallint not null CONSTRAINT DF_Empleado_em_tipoLiquidacion  default (1),
	em_ctaBanco varchar(20) not null CONSTRAINT DF_Empleado_em_ctaBanco  default (''),
	em_fdoDesempleo varchar(20) not null CONSTRAINT DF_Empleado_em_fdoDesempleo  default (''),
	em_obraSocial varchar(20) not null CONSTRAINT DF_Empleado_em_obraSocial  default (''),
	em_banelco smallint not null CONSTRAINT DF_Empleado_em_banelco  default (0),
	em_preocupacional smallint not null CONSTRAINT DF_Empleado_em_preocupacional  default (0),
	em_lugarNacimiento varchar(255) not null CONSTRAINT DF_Empleado_em_lugarNacimiento  default (''),
	em_descrip varchar(1000) not null CONSTRAINT DF_Empleado_em_descrip  default (''),
	estc_id int not null,
	sind_id int null,
	sindco_id int null,
	sindca_id int null,
	ema_id int null,
	eme_id int not null,
	pro_id int not null,
	pa_id int not null,
	creado timestamptz not null CONSTRAINT DF_Empleado_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Empleado_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Empleado_activo  default (1),
 CONSTRAINT PK_Empleado PRIMARY KEY  
(
	em_id 
) 
) 
;

;
/****** Object:  Table Feriado    Script Date: 07/30/2012 17:13:03 ******/

;

;

;
create table Feriado(
	fe_id int not null,
	fe_nombre varchar(100) not null,
	fe_codigo varchar(15) not null,
	fe_descrip varchar(100) not null CONSTRAINT DF_FeriadoBancario_fb_descrip  default (''),
	fe_dia smallint not null,
	fe_mes smallint not null,
	fe_anio smallint not null,
	fe_banco smallint not null,
	fe_laboral smallint not null,
	fe_local smallint not null,
	pa_id int null,
	pro_id int null,
	fe_recurrente smallint not null,
	creado timestamptz not null CONSTRAINT DF_FeriadoBancario_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_FeriadoBancario_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_FeriadoBancario PRIMARY KEY  
(
	fe_id 
) 
) 
;

;
/****** Object:  Table CodigoPostalItem    Script Date: 07/30/2012 17:06:00 ******/

;

;

;
create table CodigoPostalItem(
	cpa_id int not null,
	cpai_id int not null,
	cpai_calle varchar(1000) not null CONSTRAINT DF_CodigoPostalItem_cpa_calle  default (''),
	cpai_desde int not null CONSTRAINT DF_CodigoPostalItem_cpa_desde  default (0),
	cpai_hasta int not null CONSTRAINT DF_CodigoPostalItem_cpa_hasta  default (0),
	cpai_tipo smallint not null CONSTRAINT DF_CodigoPostalItem_cpai_tipo  default (1),
	cpai_localidad varchar(1000) not null CONSTRAINT DF_CodigoPostalItem_cpai_localidad  default (''),
	pro_id int not null,
 CONSTRAINT PK_CodigoPostalItem PRIMARY KEY  
(
	cpai_id 
) 
) 
;

;
/****** Object:  Table Contacto    Script Date: 07/30/2012 17:07:01 ******/

;

;

;
create table Contacto(
	agn_id int not null CONSTRAINT DF_Contacto_agn_id  default (1),
	cont_id int not null,
	cont_apellido varchar(100) not null CONSTRAINT DF_Contacto_cont_apellido  default (''),
	cont_nombre varchar(100) not null CONSTRAINT DF_Contacto_cont_nombre  default (''),
	cont_codigo varchar(20) not null,
	cont_documento varchar(50) not null CONSTRAINT DF_Contacto_cont_documento  default (''),
	cont_descrip varchar(5000) null CONSTRAINT DF_Contacto_cont_descrip  default (''),
	cont_tratamiento varchar(10) not null CONSTRAINT DF_Contacto_cont_tratamiento  default (''),
	cont_fax varchar(100) not null CONSTRAINT DF_Contacto_cont_fax  default (''),
	cont_tel varchar(100) not null CONSTRAINT DF_Contacto_cont_tel  default (''),
	cont_celular varchar(100) not null CONSTRAINT DF_Contacto_cont_celular  default (''),
	cont_email varchar(100) not null CONSTRAINT DF_Contacto_cont_email  default (''),
	cont_cargo varchar(100) not null CONSTRAINT DF_Contacto_cont_cargo  default (''),
	cont_direccion varchar(255) not null CONSTRAINT DF_Contacto_cont_direccion  default (''),
	cont_tipo smallint not null CONSTRAINT DF_Contacto_cont_tipo  default (0),
	cont_fechanac timestamptz not null CONSTRAINT DF_Contacto_cont_fechanac  default (getdate()),
	cont_categoria varchar(150) not null CONSTRAINT DF_Contacto_cont_categoria  default (''),
	cont_cliente varchar(255) not null CONSTRAINT DF_Contacto_cont_cliente  default (''),
	cont_proveedor varchar(255) not null CONSTRAINT DF_Contacto_cont_proveedor  default (''),
	cont_codpostal varchar(50) not null CONSTRAINT DF_Contacto_cont_codpostal  default (''),
	cont_ciudad varchar(255) not null CONSTRAINT DF_Contacto_cont_ciudad  default (''),
	cont_provincia varchar(255) not null CONSTRAINT DF_Contacto_cont_provincia  default (''),
	us_id int null,
	cli_id int null,
	prov_id int null,
	ciu_id int null,
	pro_id int null,
	pa_id int null,
	creado timestamptz not null CONSTRAINT DF_Contacto_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Contacto_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Contacto_activo  default (1),
 CONSTRAINT PK_Contacto PRIMARY KEY  
(
	cont_id 
) 
) 
;

;
/****** Object:  Table Transporte    Script Date: 07/30/2012 17:31:55 ******/

;

;

;
create table Transporte(
	trans_id int not null,
	trans_nombre varchar(100) not null CONSTRAINT DF_DespachoTransporte_detra_nombre  default (''),
	trans_codigo varchar(15) not null CONSTRAINT DF_DespachoTransporte_detra_alias  default (''),
	trans_descrip varchar(255) not null CONSTRAINT DF_Transporte_trans_descrip  default (''),
	trans_telefono varchar(50) not null CONSTRAINT DF_Transporte_trans_tefono  default (''),
	trans_direccion varchar(50) not null CONSTRAINT DF_Transporte_trans_direccion  default (''),
	trans_mail varchar(255) not null CONSTRAINT DF_Transporte_trans_mail  default (''),
	trans_web varchar(255) not null CONSTRAINT DF_Transporte_trans_web  default (''),
	trans_horario_m_desde timestamptz not null CONSTRAINT DF_Transporte_cli_horario_m_desde  default ('19000101'),
	trans_horario_m_hasta timestamptz not null CONSTRAINT DF_Transporte_cli_horario_m_hasta  default ('19000101'),
	trans_horario_t_desde timestamptz not null CONSTRAINT DF_Transporte_cli_horario_t_desde  default ('19000101'),
	trans_horario_t_hasta timestamptz not null CONSTRAINT DF_Transporte_cli_horario_t_hasta  default ('19000101'),
	prov_id int null,
	pro_id int null,
	creado timestamptz not null CONSTRAINT DF_DespachoTransporte_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_DespachoTransporte_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_DespachoTransporte_activo  default (1),
 CONSTRAINT PK_Transporte PRIMARY KEY  
(
	trans_id 
) 
) 
;

;
/****** Object:  Table ClienteSucursal    Script Date: 07/30/2012 17:05:28 ******/

;

;

;
create table ClienteSucursal(
	clis_id int not null,
	clis_nombre varchar(255) not null,
	clis_codigo varchar(15) not null,
	cli_id int not null,
	clis_descrip varchar(255) not null CONSTRAINT DF_ClienteSucursal_cli_descrip  default (''),
	clis_localidad varchar(100) not null CONSTRAINT DF_ClienteSucursal_clis_localidad  default (''),
	clis_codpostal varchar(50) not null CONSTRAINT DF_ClienteSucursal_clis_codpostal  default (''),
	clis_calle varchar(100) not null CONSTRAINT DF_ClienteSucursal_cli_calle  default (''),
	clis_callenumero varchar(10) not null CONSTRAINT DF_ClienteSucursal_cli_callenumero  default ('s/n'),
	clis_piso varchar(20) not null CONSTRAINT DF_ClienteSucursal_cli_piso  default ('PB'),
	clis_depto varchar(20) not null CONSTRAINT DF_ClienteSucursal_cli_depto  default (''),
	clis_tel varchar(100) not null CONSTRAINT DF_ClienteSucursal_cli_tel  default (''),
	clis_fax varchar(50) not null CONSTRAINT DF_ClienteSucursal_cli_fax  default (''),
	clis_email varchar(100) not null CONSTRAINT DF_ClienteSucursal_cli_email  default (''),
	clis_contacto varchar(255) not null CONSTRAINT DF_ClienteSucursal_clis_contacto  default (''),
	zon_id int null,
	pro_id int null,
	pa_id int null,
	creado timestamptz not null CONSTRAINT DF_ClienteSucursal_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ClienteSucursal_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ClienteSucursal PRIMARY KEY  
(
	clis_id 
) 
) 
;

;
/****** Object:  Table Permiso    Script Date: 07/30/2012 17:22:38 ******/

;

;
create table Permiso(
	per_id int not null,
	per_id_padre int null,
	pre_id int not null,
	us_id int null,
	rol_id int null,
	modificado timestamptz not null CONSTRAINT DF_Permiso_modificado  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_Permiso_creado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_Permiso PRIMARY KEY  
(
	per_id 
) 
) 
;
/****** Object:  Table UsuarioRol    Script Date: 07/30/2012 17:32:07 ******/

;

;
create table UsuarioRol(
	rol_id int not null,
	us_id int not null,
	creado timestamptz not null CONSTRAINT DF_UsuarioRol_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_UsuarioRol_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_UsuarioRol PRIMARY KEY  
(
	rol_id,
	us_id 
) 
) 
;
/****** Object:  Table Garantia    Script Date: 07/30/2012 17:13:12 ******/

;

;

;
create table Garantia(
	gar_id int not null,
	gar_codigo varchar(15) not null,
	gar_nropoliza varchar(50) not null,
	gar_codigoaduana varchar(50) not null,
	gar_fecha timestamptz not null CONSTRAINT DF_Garantia_gar_fecha  default (getdate()),
	gar_fechainicio timestamptz not null,
	gar_fechavto timestamptz not null CONSTRAINT DF_Garantia_gar_fechavto  default (getdate()),
	gar_descrip varchar(255) not null CONSTRAINT DF_Garantia_gar_descrip  default (''),
	gar_monto decimal(18, 6) not null CONSTRAINT DF_Garantia_gar_monto  default (0),
	gar_cuota decimal(18, 6) not null CONSTRAINT DF_Garantia_gar_cuota  default (0),
	gar_diavtocuota smallint not null CONSTRAINT DF_Garantia_gar_diavtocuota  default (0),
	prov_id int not null,
	mon_id int not null,
	creado timestamptz not null CONSTRAINT DF_Garantia_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Garantia_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_Garantia PRIMARY KEY  
(
	gar_id 
) 
) 
;

;
/****** Object:  Table MovimientoFondo    Script Date: 07/30/2012 17:17:20 ******/

;

;

;
create table MovimientoFondo(
	mf_id int not null,
	mf_numero int not null,
	mf_nrodoc varchar(50) not null CONSTRAINT DF_MovimientoFondo_mf_nrodoc  default (''),
	mf_descrip varchar(5000) not null CONSTRAINT DF_MovimientoFondo_mf_descrip  default (''),
	mf_fecha timestamptz not null CONSTRAINT DF_MovimientoFondo_mf_fecha  default (getdate()),
	mf_total decimal(18, 6) not null CONSTRAINT DF_MovimientoFondo_mf_total  default (0),
	mf_totalorigen decimal(18, 6) not null CONSTRAINT DF_MovimientoFondo_mf_totalorigen  default (0),
	mf_pendiente decimal(18, 6) not null CONSTRAINT DF_MovimientoFondo_mf_pendiente  default (0),
	mf_firmado int not null CONSTRAINT DF_MovimientoFondo_mf_firmado  default (0),
	mf_grabarasiento smallint not null CONSTRAINT DF_MovimientoFondo_mf_grabarasiento  default (0),
	mf_cotizacion decimal(18, 6) not null CONSTRAINT DF_MovimientoFondo_mf_cotizacion  default (0),
	mon_id int not null,
	est_id int not null,
	suc_id int not null,
	cli_id int null,
	doc_id int not null,
	doct_id int not null,
	ccos_id int null,
	us_id int null,
	as_id int null,
	lgj_id int null,
	creado timestamptz not null CONSTRAINT DF_MovimientoFondo_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_MovimientoFondo_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_MovimientoFondo PRIMARY KEY  
(
	mf_id 
) 
) 
;

;
/****** Object:  Table Documento    Script Date: 07/30/2012 17:08:59 ******/

;

;

;
create table Documento(
	doc_id int not null,
	doc_nombre varchar(100) not null,
	doc_codigo varchar(15) not null,
	doc_descrip varchar(5000) not null CONSTRAINT DF_Documento_doc_descrip  default (''),
	doc_llevaFirma smallint not null CONSTRAINT DF_Documento_doc_llevaFirma  default (0),
	doc_llevaFirmaCredito smallint not null CONSTRAINT DF_Documento_doc_llevaFirmaCredito  default (0),
	doc_llevaFirmaPrint0 smallint not null CONSTRAINT DF_Documento_doc_llevaFirmaPrint0  default (0),
	doc_id_asiento int null,
	doc_muevestock smallint not null CONSTRAINT DF_Documento_doc_generaremito  default (0),
	doc_id_stock int null,
	doc_generaremito smallint not null CONSTRAINT DF_Documento_doc_generaremito_1  default (0),
	doc_id_remito int null,
	doc_rv_desde_pv smallint not null CONSTRAINT DF_Documento_doc_rv_desdepv  default (0),
	doc_rv_desde_os smallint not null CONSTRAINT DF_Documento_doc_rv_desde_os  default (0),
	doc_rc_desde_oc smallint not null CONSTRAINT DF__documento__doc_r__53921C1D  default (0),
	doc_rv_bom smallint not null CONSTRAINT DF_Documento_doc_rv_descargaTemp  default (0),
	doc_pv_desde_prv smallint not null CONSTRAINT DF_Documento_doc_pv_desde_prv  default (0),
	doc_tipofactura smallint not null CONSTRAINT DF_Documento_doc_factipo  default (0),
	doc_tipopackinglist smallint not null CONSTRAINT DF_Documento_doc_tipopackinglist  default (0),
	doc_tipoordencompra smallint not null CONSTRAINT DF_Documento_doc_tipoordencompra  default (0),
	doc_st_consumo smallint not null CONSTRAINT DF_Documento_doc_st_consumo  default (0),
	doc_rc_despachoimpo smallint not null CONSTRAINT DF_Documento_doc_rc_despachoimpo  default (0),
	doc_fv_sinpercepcion smallint not null CONSTRAINT DF_Documento_doc_fv_sinpercepcion  default (0),
	doc_editarimpresos smallint not null CONSTRAINT DF_Documento_doc_editarimpresos  default (0),
	doc_esresumenbco smallint not null CONSTRAINT DF_Documento_doc_esresumenbco  default (0),
	doc_escreditobanco smallint not null CONSTRAINT DF_Documento_doc_escreditobanco_1  default (0),
	doc_esventaaccion smallint not null CONSTRAINT DF_Documento_doc_esventaaccion_1  default (0),
	doc_esventacheque smallint not null CONSTRAINT DF_Documento_doc_esventacheque_1  default (0),
	doc_escobchequesgr smallint not null CONSTRAINT DF_Documento_doc_escobchequesgr_1  default (0),
	doc_escobcaidasgr smallint not null CONSTRAINT DF_Documento_doc_escobcaidasgr_1  default (0),
	doc_esasientoplantilla smallint not null CONSTRAINT DF_Documento_doc_esasientoplantilla  default (0),
	doc_asientoresumido smallint not null CONSTRAINT DF_Documento_doc_asientoresumido  default (0),
	doc_object_edit varchar(255) not null CONSTRAINT DF_Documento_doc_os_object  default (''),
	doc_esfacturaelectronica smallint not null CONSTRAINT DF_Documento_doc_facturaelectronica  default (0),
	doct_id int not null,
	docg_id int null,
	cico_id int null,
	fca_id int null,
	ta_id int null,
	ta_id_final int null,
	ta_id_inscripto int null,
	ta_id_externo int null,
	ta_id_inscriptom int null,
	ta_id_haberes int null,
	mon_id int null,
	cueg_id int null,
	emp_id int not null,
	pre_id_new int null,
	pre_id_edit int null,
	pre_id_delete int null,
	pre_id_list int null,
	pre_id_anular int null,
	pre_id_desanular int null,
	pre_id_aplicar int null,
	pre_id_print int null,
	creado timestamptz not null CONSTRAINT DF_Documento_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Documento_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Documento_activo  default (1),
 CONSTRAINT PK_Documento PRIMARY KEY  
(
	doc_id 
) 
) 
;

;
/****** Object:  Table Cuenta    Script Date: 07/30/2012 17:07:36 ******/

;

;

;
create table Cuenta(
	cue_id int not null,
	cue_nombre varchar(100) not null,
	cue_codigo varchar(15) not null,
	cue_descrip varchar(255) not null CONSTRAINT DF_Cuenta_cue_descrip  default (''),
	cue_identificacionexterna varchar(50) not null CONSTRAINT DF_Cuenta_cue_identificacionexterna  default (''),
	cue_llevacentrocosto smallint not null CONSTRAINT DF__Cuenta__cue_llev__5748DA5E  default (0),
	cue_producto smallint not null CONSTRAINT DF_Cuenta_cue_producto  default (0),
	cue_escajasucursal smallint not null CONSTRAINT DF_Cuenta_cue_escajasucursal  default (0),
	cue_codigorpt varchar(50) not null CONSTRAINT DF_Cuenta_cue_codigorpt  default (''),
	cue_esefectivo smallint not null CONSTRAINT DF_Cuenta_cue_esefectivo  default (0),
	cue_esticket smallint not null CONSTRAINT DF_Cuenta_cue_esticket  default (0),
	cuec_id_libroiva int null,
	cuec_id int not null,
	emp_id int null,
	bco_id int null,
	mon_id int not null,
	activo smallint not null CONSTRAINT DF__Cuenta__activo__583CFE97  default (0),
	creado timestamptz not null CONSTRAINT DF__Cuenta__creado__593122D0  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF__Cuenta__modifica__5A254709  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_Cuenta PRIMARY KEY  
(
	cue_id 
) 
) 
;

;
/****** Object:  Table ListaDescuento    Script Date: 07/30/2012 17:15:56 ******/

;

;

;
create table ListaDescuento(
	ld_id int not null,
	ld_nombre varchar(100) not null,
	ld_codigo varchar(50) not null,
	ld_descrip varchar(255) not null CONSTRAINT DF_ListaDescuento_ld_descrip  default (''),
	ld_id_padre int null,
	ld_fechadesde timestamptz not null CONSTRAINT DF_ListaDescuento_lp_fechadesde  default (getdate()),
	ld_fechahasta timestamptz not null CONSTRAINT DF_ListaDescuento_lp_fechahasta  default ('29991231'),
	ld_porcentaje decimal(18, 6) not null CONSTRAINT DF_ListaDescuento_ld_porcentaje  default (0),
	ld_tipo smallint not null CONSTRAINT DF_ListaDescuento_ld_tipo  default (0),
	mon_id int not null,
	activo smallint not null CONSTRAINT DF_ListaDescuento_activo  default (1),
	creado timestamptz not null CONSTRAINT DF_ListaDescuento_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ListaDescuento_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ListaDescuento PRIMARY KEY  
(
	ld_id 
) 
) 
;

;
/****** Object:  Table Liquidacion    Script Date: 07/30/2012 17:15:19 ******/

;

;

;
create table Liquidacion(
	liq_id int not null,
	liq_numero int not null,
	liq_nrodoc varchar(50) not null CONSTRAINT DF_Liquidacion_liq_nrodoc  default (''),
	liq_descrip varchar(5000) not null CONSTRAINT DF_Liquidacion_liq_descrip  default (''),
	liq_fecha timestamptz not null CONSTRAINT DF_Liquidacion_liq_fecha  default (getdate()),
	liq_fechadesde timestamptz not null CONSTRAINT DF_Liquidacion_liq_fechadesde  default ('19000101'),
	liq_fechahasta timestamptz not null CONSTRAINT DF_Liquidacion_liq_fechahasta  default ('19000101'),
	liq_periodo varchar(100) not null CONSTRAINT DF_Liquidacion_liq_periodo  default (''),
	liq_neto decimal(18, 6) not null CONSTRAINT DF_Liquidacion_liq_neto  default (0),
	liq_impuesto decimal(18, 6) not null CONSTRAINT DF_Liquidacion_liq_impuesto  default (0),
	liq_total decimal(18, 6) not null CONSTRAINT DF_Liquidacion_liq_total  default (0),
	liq_totalorigen decimal(18, 6) not null CONSTRAINT DF_Liquidacion_liq_totalorigen  default (0),
	liq_firmado int not null CONSTRAINT DF_Liquidacion_liq_firmado  default (0),
	liq_grabarasiento smallint not null CONSTRAINT DF_Liquidacion_liq_grabarasiento  default (0),
	liq_cotizacion decimal(18, 6) not null CONSTRAINT DF_Liquidacion_liq_cotizacion  default (0),
	mon_id int not null,
	est_id int not null,
	suc_id int not null,
	doc_id int not null,
	doct_id int not null,
	ccos_id int null,
	as_id int null,
	lgj_id int null,
	liqp_id int not null,
	creado timestamptz not null CONSTRAINT DF_Liquidacion_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Liquidacion_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null CONSTRAINT DF_Liquidacion_impreso  default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_Liquidacion PRIMARY KEY  
(
	liq_id 
) 
) 
;

;
/****** Object:  Table PermisoEmbarque    Script Date: 07/30/2012 17:22:44 ******/

;

;

;
create table PermisoEmbarque(
	pemb_id int not null,
	pemb_numero int not null,
	pemb_nrodoc varchar(100) not null CONSTRAINT DF_PermisoEmbarque_pemb_nrodoc  default (''),
	pemb_descrip varchar(255) not null CONSTRAINT DF_PermisoEmbarque_pemb_descrip  default (''),
	pemb_fecha timestamptz not null,
	pemb_cotizacion decimal(18, 6) not null CONSTRAINT DF_PermisoEmbarque_pemb_cotizacion  default (0),
	pemb_total decimal(18, 6) not null CONSTRAINT DF_PermisoEmbarque_pemb_total  default (0),
	pemb_totalorigen decimal(18, 6) not null CONSTRAINT DF_PermisoEmbarque_fv_totalorigen  default (0),
	pemb_firmado int not null CONSTRAINT DF_PermisoEmbarque_pemb_firmado  default (0),
	pemb_pendiente decimal(18, 6) not null CONSTRAINT DF_PermisoEmbarque_pemb_pendiente  default (0),
	mon_id int not null,
	est_id int not null,
	suc_id int not null,
	doc_id int not null,
	doct_id int not null,
	emb_id int not null,
	bco_id int not null,
	adu_id int not null,
	lp_id int null,
	lgj_id int null,
	ccos_id int null,
	creado timestamptz not null CONSTRAINT DF_PermisoEmbarque_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_PermisoEmbarque_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT pk_PermisoemBarque PRIMARY KEY  
(
	pemb_id 
) 
) 
;

;
/****** Object:  Table ListaPrecio    Script Date: 07/30/2012 17:16:08 ******/

;

;

;
create table ListaPrecio(
	lp_id int not null,
	lp_nombre varchar(100) not null,
	lp_codigo varchar(15) not null,
	lp_descrip varchar(255) not null CONSTRAINT df_listaprecio_lp_descrip  default (''),
	lp_fechadesde timestamptz not null CONSTRAINT df_listaprecio_lp_fechadesde  default (getdate()),
	lp_fechahasta timestamptz not null CONSTRAINT df_listaprecio_lp_fechahasta  default ('29991231'),
	lp_default smallint not null,
	lp_id_padre int null,
	lp_porcentaje decimal(18, 6) not null CONSTRAINT DF_ListaPrecio_lp_porcentaje  default (0),
	lp_tipo smallint not null CONSTRAINT DF_ListaPrecio_lp_tipo  default (0),
	lp_autoXcompra smallint not null CONSTRAINT DF_ListaPrecio_lp_autoXcompra  default (0),
	lp_nofiltrarpr smallint not null CONSTRAINT DF_ListaPrecio_lp_nofiltrarpr  default (0),
	lp_encache smallint not null CONSTRAINT DF_ListaPrecio_lp_encache  default (0),
	mon_id int not null,
	activo smallint not null CONSTRAINT df_listaprecio_activo  default (1),
	creado timestamptz not null CONSTRAINT df_listaprecio_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT df_listaprecio_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT pk_listaprecio PRIMARY KEY  
(
	lp_id 
) 
) 
;

;
/****** Object:  Table Gasto    Script Date: 07/30/2012 17:13:16 ******/

;

;

;
create table Gasto(
	gto_id int not null,
	gto_nombre varchar(100) not null,
	gto_codigo varchar(15) not null,
	gto_descrip varchar(255) not null,
	gto_tipo smallint not null,
	gto_fijo decimal(18, 6) not null CONSTRAINT DF_Gasto_gto_fijo  default (0),
	gto_minimo decimal(18, 6) not null CONSTRAINT DF_Gasto_gto_minimo  default (0),
	gto_porcentaje decimal(18, 6) not null CONSTRAINT DF_Gasto_gto_porcentaje  default (0),
	gto_importe decimal(18, 6) not null CONSTRAINT DF_Gasto_gto_importe  default (0),
	mon_id int not null,
	ti_id int null,
	creado timestamptz not null CONSTRAINT DF_Gasto_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Gasto_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Gasto_activo  default (1),
 CONSTRAINT PK_Gasto PRIMARY KEY  
(
	gto_id 
) 
) 
;

;
/****** Object:  Table MonedaItem    Script Date: 07/30/2012 17:17:05 ******/

;

;
create table MonedaItem(
	moni_id int not null,
	moni_precio decimal(18, 6) not null CONSTRAINT DF_MonedaItem_moni_precio  default (0),
	moni_fecha timestamptz not null CONSTRAINT DF_MonedaItem_moni_fecha  default (getdate()),
	mon_id int not null,
	creado timestamptz not null CONSTRAINT DF_MonedaItem_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_MonedaItem_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_MonedaItem PRIMARY KEY  
(
	moni_id 
) 
) 
;
/****** Object:  Table DespachoImpCalculo    Script Date: 07/30/2012 17:08:42 ******/

;

;

;
create table DespachoImpCalculo(
	dic_id int not null,
	dic_numero int not null,
	dic_fecha timestamptz not null,
	dic_tipo smallint not null,
	dic_titulo varchar(255) not null,
	dic_descrip varchar(5000) not null CONSTRAINT DF_DespachoImpoCalculo_dic_descrip  default (''),
	dic_via varchar(255) not null CONSTRAINT DF_DespachoImpoCalculo_dic_via  default (''),
	dic_viaempresa varchar(255) not null CONSTRAINT DF_DespachoImpoCalculo_dic_viaempresa  default (''),
	dic_factura varchar(50) not null CONSTRAINT DF_DespachoImpoCalculo_dic_factura  default (''),
	dic_cambio1 decimal(18, 6) not null,
	dic_cambio2 decimal(18, 6) not null,
	dic_pase decimal(18, 6) not null,
	dic_totalgtos decimal(18, 6) not null,
	dic_porcfob decimal(18, 6) not null,
	dic_var decimal(18, 6) not null,
	dic_porcfobfinal decimal(18, 6) not null,
	dic_total decimal(18, 6) not null,
	dic_totalorigen decimal(18, 6) not null,
	rc_id int not null,
	mon_id1 int not null,
	mon_id2 int null,
	creado timestamptz not null CONSTRAINT DF_DespachoImpoCalculo_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_DespachoImpoCalculo_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_DespachoImpoCalculo PRIMARY KEY  
(
	dic_id 
) 
) 
;

;
/****** Object:  Table Producto    Script Date: 07/30/2012 17:25:24 ******/

;

;

;
create table Producto(
	pr_id int not null,
	pr_nombrecompra varchar(255) not null,
	pr_nombreventa varchar(255) not null,
	pr_codigo varchar(100) not null,
	pr_codigobarra varchar(255) not null CONSTRAINT DF_Producto_prprov_codigobarra  default (''),
	pr_codigobarranombre varchar(255) not null CONSTRAINT DF_Producto_pr_codigobarranombre  default (''),
	activo smallint not null CONSTRAINT DF_Producto_activo  default (1),
	pr_descripventa varchar(2000) not null CONSTRAINT DF_Producto_pro_descripventa  default (''),
	pr_descripcompra varchar(2000) not null CONSTRAINT DF_Producto_pro_descripcompra  default (''),
	un_id_compra int null,
	un_id_venta int null,
	un_id_stock int null,
	pr_ventacompra real not null CONSTRAINT DF_Producto_pr_relacioncompraventa  default (1),
	pr_ventastock real not null CONSTRAINT DF_Producto_pr_ventastock  default (1),
	pr_stockcompra real not null CONSTRAINT DF_Producto_pr_comprastock  default (1),
	pr_llevastock smallint not null CONSTRAINT DF_Producto_pr_llevastock  default (0),
	pr_esrepuesto smallint not null CONSTRAINT DF_Producto_pr_esrepuesto  default (0),
	pr_secompra smallint not null CONSTRAINT DF_Producto_pr_secompra  default (0),
	pr_sevende smallint not null CONSTRAINT DF_Producto_pr_sevende  default (0),
	pr_eskit smallint not null CONSTRAINT DF_Producto_pr_eskit  default (0),
	pr_kitStkItem smallint not null CONSTRAINT DF__producto__pr_kit__0EF2D90D  default (0),
	pr_kitResumido smallint not null CONSTRAINT DF_Producto_pr_kitResumido  default (0),
	pr_kitIdentidad smallint not null CONSTRAINT DF_Producto_pr_kitIdentidad  default (0),
	pr_kitIdentidadXItem smallint not null CONSTRAINT DF_Producto_pr_kitIdentidadXItem  default (0),
	pr_kitLote smallint not null CONSTRAINT DF_Producto_pr_kitLote  default (0),
	pr_kitLoteXItem smallint not null CONSTRAINT DF_Producto_pr_kitLoteXItem  default (0),
	pr_eslista smallint not null CONSTRAINT DF_Producto_pr_eslista  default (0),
	pr_kitItems decimal(18, 6) not null CONSTRAINT DF_Producto_pr_kitItems  default (0),
	pr_dinerario smallint not null CONSTRAINT DF_Producto_pr_dinerario  default (0),
	marc_id int null,
	ti_id_ivaricompra int null,
	ti_id_ivarnicompra int null,
	ti_id_ivariventa int null,
	ti_id_ivarniventa int null,
	ti_id_internosv int null,
	ti_id_internosc int null,
	pr_porcinternoc real not null CONSTRAINT DF_Producto_pr_porcinterno  default (0),
	pr_porcinternov real not null CONSTRAINT DF_Producto_pr_porcinternoc1  default (0),
	ibc_id int null,
	cueg_id_venta int null,
	cueg_id_compra int null,
	pr_x smallint not null CONSTRAINT DF_Producto_pr_x  default (0),
	pr_y smallint not null CONSTRAINT DF_Producto_pr_y  default (0),
	pr_z smallint not null CONSTRAINT DF_Producto_pr_z  default (0),
	pr_tienehijo smallint not null CONSTRAINT DF_Producto_pr_tienehijo  default (0),
	pr_id_padre int null,
	pr_editarpreciohijo smallint not null CONSTRAINT DF_Producto_pr_editarpreciohijo  default (0),
	pr_permiteedicion smallint not null CONSTRAINT DF_Producto_pr_permiteedicion  default (0),
	pr_borrado smallint not null CONSTRAINT DF_Producto_pr_borrado  default (0),
	pr_stockminimo real not null CONSTRAINT DF_Producto_pr_stockminimo  default (0),
	pr_stockmaximo real not null CONSTRAINT DF_Producto_pr_stockmaximo  default (0),
	pr_codigoexterno varchar(30) not null CONSTRAINT DF_Producto_pr_codigoexterno  default (''),
	pr_reposicion real not null CONSTRAINT DF_Producto_pr_reposicion  default (0),
	pr_pesototal decimal(18, 6) not null CONSTRAINT DF_Producto_pr_pesototal  default (0),
	pr_pesoneto decimal(18, 6) not null CONSTRAINT DF_Producto_pr_peso  default (0),
	pr_cantxcajaexpo int not null CONSTRAINT DF_Producto_pr_cantxcajaexpo  default (0),
	pr_fleteExpo smallint not null CONSTRAINT DF_Producto_pr_fleteExpo  default (0),
	pr_llevanroserie smallint not null CONSTRAINT DF_Producto_pr_llevanroserie_1  default (0),
	pr_llevanrolote smallint not null CONSTRAINT DF_Producto_pr_llevanrolote_1  default (0),
	pr_lotefifo smallint not null CONSTRAINT DF_Producto_pr_lotefifo  default (0),
	pr_seproduce smallint not null CONSTRAINT DF_Producto_pr_seproduce  default (0),
	pr_nombrefactura varchar(255) not null CONSTRAINT DF_Producto_pr_descripfactura  default (''),
	pr_nombreweb varchar(255) not null CONSTRAINT DF_Producto_pr_nombreweb  default (''),
	pr_aliasweb varchar(255) not null CONSTRAINT DF_Producto_pr_aliasweb  default (''),
	pr_codigohtml varchar(5000) not null CONSTRAINT DF_Producto_pr_codigohtml  default (''),
	pr_codigohtmldetalle varchar(5000) not null CONSTRAINT DF_Producto_pr_codigohtml1  default (''),
	pr_activoweb smallint not null CONSTRAINT DF_Producto_pr_activoweb  default (0),
	pr_noredondeo smallint not null CONSTRAINT DF_Producto_pr_noredondeo  default (0),
	pr_expoweb smallint not null CONSTRAINT DF_Producto_pr_expoweb  default (50),
	pr_expocairo smallint not null CONSTRAINT DF_Producto_pr_expocairo  default (50),
	pr_ventawebmaxima decimal(18, 6) not null CONSTRAINT DF_Producto_pr_ventaWebMaxima  default (99999),
	pr_webimagefolder varchar(255) not null CONSTRAINT DF_Producto_pr_webimagefolder  default (''),
	pr_webimageupdate smallint not null CONSTRAINT DF_Producto_pr_webimageupdate  default (0),
	pr_esplantilla smallint not null CONSTRAINT DF_Producto_pr_esplantilla  default (0),
	pr_id_webpadre int null,
	ley_id int null,
	un_id_peso int null,
	rub_id int null,
	rubti_id1 int null,
	rubti_id2 int null,
	rubti_id3 int null,
	rubti_id4 int null,
	rubti_id5 int null,
	rubti_id6 int null,
	rubti_id7 int null,
	rubti_id8 int null,
	rubti_id9 int null,
	rubti_id10 int null,
	embl_id int null,
	egp_id int null,
	efm_id int null,
	ta_id_kitSerie int null,
	ta_id_kitLote int null,
	ccos_id_compra int null,
	ccos_id_venta int null,
	cur_id int null,
	creado timestamptz not null CONSTRAINT DF_Producto_creado  default (getdate()),
	modifico int not null,
	modificado timestamptz not null CONSTRAINT DF_Producto_modificado  default (getdate()),
	rpt_id_nombrecompra int null,
	rpt_id_nombreventa int null,
	rpt_id_nombrefactura int null,
	rpt_id_nombreweb int null,
	rpt_id_nombreimgalt int null,
	rpt_id_nombreimg int null,
	poar_id int null,
	ti_id_comex_ganancias int null,
	ti_id_comex_igb int null,
	ti_id_comex_iva int null,
 CONSTRAINT PK_Producto PRIMARY KEY  
(
	pr_id 
) 
) 
;

;
--, @value=N'', @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'table',@level1name=N'Producto', @level2type=N'COLUMN',@level2name=N'pr_llevanroserie'
;
/****** Object:  Table Retencion    Script Date: 07/30/2012 17:29:27 ******/

;

;

;
create table Retencion(
	rett_id int not null,
	ret_id int not null,
	ret_nombre varchar(100) not null CONSTRAINT DF_Retenciones_ret_nombre  default (''),
	ret_codigo varchar(15) not null CONSTRAINT DF_Retenciones_ret_alias  default (''),
	ret_importeminimo decimal(18, 6) not null CONSTRAINT DF_Retencion_ret_importeminimo  default (0),
	ret_regimensicore varchar(50) not null CONSTRAINT DF_Retencion_ret_regimensicore  default (''),
	ret_acumulapor smallint not null CONSTRAINT DF_Retencion_ret_acumulapor  default (0),
	ret_tipoMinimo smallint not null CONSTRAINT DF_Retencion_ret_tipoMinimo  default (1),
	ret_descrip varchar(255) not null CONSTRAINT DF_Retencion_ret_descrip  default (''),
	ret_esiibb smallint not null CONSTRAINT DF_Retencion_ret_esiibb  default (0),
	ta_id int null,
	ibc_id int null,
	creado timestamptz not null CONSTRAINT DF_Retenciones_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Retenciones_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Retencion_activo  default (0),
 CONSTRAINT PK_Retenciones PRIMARY KEY  
(
	ret_id 
) 
) 
;

;
/****** Object:  Table Stock    Script Date: 07/30/2012 17:30:02 ******/

;

;

;
create table Stock(
	st_id int not null,
	st_numero int not null,
	st_nrodoc varchar(50) not null CONSTRAINT DF_Stock_st_nrodoc  default (''),
	st_descrip varchar(5000) not null CONSTRAINT DF_Stock_st_descrip  default (''),
	st_fecha timestamptz not null CONSTRAINT DF_Stock_st_fecha  default (getdate()),
	st_doc_cliente varchar(5000) not null CONSTRAINT DF_Stock_as_doc_cliente  default (''),
	depl_id_origen int not null,
	depl_id_destino int not null,
	suc_id int not null,
	lgj_id int null,
	doc_id int not null,
	doct_id int not null,
	doct_id_cliente int null,
	id_cliente int not null CONSTRAINT DF_Stock_id_cliente  default (0),
	creado timestamptz not null CONSTRAINT DF_Stock_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Stock_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_Stock PRIMARY KEY  
(
	st_id 
) 
) 
;

;
/****** Object:  Table StockCliente    Script Date: 07/30/2012 17:30:08 ******/

;

;

;
create table StockCliente(
	stcli_id int not null,
	stcli_numero int not null,
	stcli_nrodoc varchar(50) not null CONSTRAINT DF_StockCliente_stcli_nrodoc  default (''),
	stcli_descrip varchar(5000) not null CONSTRAINT DF_StockCliente_stcli_descrip  default (''),
	stcli_fecha timestamptz not null CONSTRAINT DF_StockCliente_stcli_fecha  default (getdate()),
	st_id int null,
	cli_id int not null,
	depl_id_origen int not null,
	depl_id_destino int not null,
	suc_id int not null,
	lgj_id int null,
	doc_id int not null,
	doct_id int not null,
	creado timestamptz not null CONSTRAINT DF_StockCliente_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_StockCliente_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_StockCliente PRIMARY KEY  
(
	stcli_id 
) 
) 
;

;
/****** Object:  Table StockCache    Script Date: 07/30/2012 17:30:04 ******/

;

;
create table StockCache(
	stc_id int  not null,
	stc_cantidad decimal(18, 6) not null CONSTRAINT DF_StockCache_stc_cantidad  default (0),
	pr_id int not null,
	depl_id int not null,
	prns_id int null,
	pr_id_kit int null,
	stl_id int null,
 CONSTRAINT PK_StockCache PRIMARY KEY  
(
	stc_id 
) 
) 
;
/****** Object:  Table ParteProdKit    Script Date: 07/30/2012 17:20:28 ******/

;

;

;
create table ParteProdKit(
	ppk_id int not null,
	ppk_numero int not null,
	ppk_nrodoc varchar(50) not null CONSTRAINT DF_ParteProdKit_ppk_nrodoc  default (''),
	ppk_descrip varchar(5000) not null CONSTRAINT DF_ParteProdKit_ppk_descrip  default (''),
	ppk_fecha timestamptz not null CONSTRAINT DF_ParteProdKit_ppk_fecha  default (getdate()),
	depl_id int not null,
	st_id1 int null,
	st_id2 int null,
	suc_id int not null,
	lgj_id int null,
	doc_id int not null,
	doct_id int not null,
	creado timestamptz not null CONSTRAINT DF_ParteProdKit_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ParteProdKit_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_ParteProdKit PRIMARY KEY  
(
	ppk_id 
) 
) 
;

;
/****** Object:  Table RecuentoStock    Script Date: 07/30/2012 17:27:25 ******/

;

;

;
create table RecuentoStock(
	rs_id int not null,
	rs_numero int not null,
	rs_nrodoc varchar(50) not null CONSTRAINT DF_RecuentoStock_rs_nrodoc  default (''),
	rs_descrip varchar(5000) not null CONSTRAINT DF_RecuentoStock_rs_descrip  default (''),
	rs_fecha timestamptz not null CONSTRAINT DF_RecuentoStock_rs_fecha  default (getdate()),
	depl_id int not null,
	st_id1 int null,
	st_id2 int null,
	suc_id int not null,
	lgj_id int null,
	doc_id int not null,
	doct_id int not null,
	creado timestamptz not null CONSTRAINT DF_RecuentoStock_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_RecuentoStock_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_RecuentoStock PRIMARY KEY  
(
	rs_id 
) 
) 
;

;
/****** Object:  Table StockProveedor    Script Date: 07/30/2012 17:30:28 ******/

;

;

;
create table StockProveedor(
	stprov_id int not null,
	stprov_numero int not null,
	stprov_nrodoc varchar(50) not null CONSTRAINT DF_StockProveedor_stprov_nrodoc  default (''),
	stprov_descrip varchar(5000) not null CONSTRAINT DF_StockProveedor_stprov_descrip  default (''),
	stprov_fecha timestamptz not null CONSTRAINT DF_StockProveedor_stprov_fecha  default (getdate()),
	st_id int null,
	prov_id int null,
	depl_id_origen int not null,
	depl_id_destino int not null,
	suc_id int not null,
	lgj_id int null,
	doc_id int not null,
	doct_id int not null,
	creado timestamptz not null CONSTRAINT DF_StockProveedor_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_StockProveedor_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_StockProveedor PRIMARY KEY  
(
	stprov_id 
) 
) 
;

;
/****** Object:  Table OrdenProdKit    Script Date: 07/30/2012 17:18:40 ******/

;

;

;
create table OrdenProdKit(
	opk_id int not null,
	opk_numero int not null,
	opk_nrodoc varchar(50) not null CONSTRAINT DF_OrdenProdKit_opk_nrodoc  default (''),
	opk_descrip varchar(5000) not null CONSTRAINT DF_OrdenProdKit_opk_descrip  default (''),
	opk_fecha timestamptz not null CONSTRAINT DF_OrdenProdKit_opk_fecha  default (getdate()),
	depl_id int not null,
	suc_id int not null,
	lgj_id int null,
	doc_id int not null,
	doct_id int not null,
	creado timestamptz not null CONSTRAINT DF_OrdenProdKit_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_OrdenProdKit_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null CONSTRAINT DF__OrdenProd__impre__10026697  default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_OrdenProdKit PRIMARY KEY  
(
	opk_id 
) 
) 
;

;
/****** Object:  Table ProductoDepositoEntrega    Script Date: 07/30/2012 17:25:45 ******/

;

;
create table ProductoDepositoEntrega(
	prent_id int  not null,
	pr_id int not null,
	depl_id int not null,
	suc_id int not null,
	emp_id int not null,
	prov_id int null,
 CONSTRAINT PK_ProductoDepositoEntrega PRIMARY KEY  
(
	prent_id 
) 
) 
;
/****** Object:  Table StockItem    Script Date: 07/30/2012 17:30:15 ******/

;

;

;
create table StockItem(
	st_id int not null,
	sti_id int not null,
	sti_orden int not null CONSTRAINT DF_StockItem_sti_orden  default (0),
	sti_ingreso decimal(18, 6) not null CONSTRAINT DF_StockItem_sti_ingreso  default (0),
	sti_salida decimal(18, 6) not null CONSTRAINT DF_StockItem_sti_salida  default (0),
	sti_descrip varchar(255) not null CONSTRAINT DF_StockItem_sti_descrip  default (''),
	sti_grupo int not null CONSTRAINT DF_StockItem_sti_grupo_1  default (0),
	pr_id int not null,
	depl_id int not null,
	prns_id int null,
	stik_id int null,
	pr_id_kit int null,
	stl_id int null,
	prsk_id int null,
 CONSTRAINT PK_StockItem PRIMARY KEY  
(
	sti_id 
) 
) 
;

;
/****** Object:  Table ProductoDepositoLogico    Script Date: 07/30/2012 17:25:50 ******/

;

;
create table ProductoDepositoLogico(
	prdepl_id int not null,
	pr_id int not null,
	depl_id int not null,
	prdepl_x smallint not null CONSTRAINT DF_ProductoDepositoLogico_prdepl_x  default (0),
	prdepl_y smallint not null CONSTRAINT DF_ProductoDepositoLogico_prdepl_y  default (0),
	prdepl_z smallint not null CONSTRAINT DF_ProductoDepositoLogico_prdepl_z  default (0),
	prdepl_stockminimo real not null CONSTRAINT DF_ProductoDepositoLogico_prdepl_stockminimo  default (0),
	prdepl_stockmaximo real not null CONSTRAINT DF_ProductoDepositoLogico_prdepl_stockmaximo  default (0),
	prdepl_reposicion real not null CONSTRAINT DF_ProductoDepositoLogico_prdepl_reposicion  default (0),
 CONSTRAINT PK_ProductoDepositoLogico PRIMARY KEY  
(
	prdepl_id 
) 
) 
;
/****** Object:  Table UsuarioDepositoLogico    Script Date: 07/30/2012 17:32:03 ******/

;

;
create table UsuarioDepositoLogico(
	usdepl_id int not null,
	us_id int not null,
	depl_id int not null,
 CONSTRAINT PK_UsuarioDepositoLogico PRIMARY KEY  
(
	usdepl_id 
) 
) 
;
/****** Object:  Table PresupuestoEnvioGasto    Script Date: 07/30/2012 17:24:05 ******/

;

;

;
create table PresupuestoEnvioGasto(
	pree_id int not null,
	preeg_id int not null,
	preeg_orden smallint not null,
	preeg_cantidad decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioGasto_preeg_cantidad  default (0),
	preeg_pendiente decimal(18, 0) not null CONSTRAINT DF_PresupuestoEnvioGasto_preeg_pendiente  default (0),
	preeg_descrip varchar(5000) not null CONSTRAINT DF_PresupuestoEnvioGasto_preeg_descrip  default (''),
	preeg_precio decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioGasto_preeg_precio  default (0),
	preeg_precioTarifa decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioGasto_preeg_precioTarifa  default (0),
	preeg_neto decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioGasto_pree_neto  default (0),
	preeg_ivari decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioGasto_preeg_ivari  default (0),
	preeg_ivarni decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioGasto_preeg_ivarni  default (0),
	preeg_ivariporc decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioGasto_preeg_ivariporc  default (0),
	preeg_ivarniporc decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioGasto_preeg_ivarniporc  default (0),
	preeg_importe decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioGasto_preeg_importe  default (0),
	pr_id int not null,
	trans_id int null,
	trfg_id int null,
	gto_id int not null,
	ccos_id int null,
 CONSTRAINT PK_PresupuestoEnvioGasto PRIMARY KEY  
(
	preeg_id 
) 
) 
;

;
/****** Object:  Table PresupuestoEnvioItem    Script Date: 07/30/2012 17:24:16 ******/

;

;

;
create table PresupuestoEnvioItem(
	pree_id int not null,
	preei_id int not null,
	preei_orden smallint not null,
	preei_cantidad decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItem_preei_cantidad  default (0),
	preei_volumen decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItem_preei_volumen  default (0),
	preei_kilos decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItem_preei_kilos  default (0),
	preei_minimo decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItem_preei_minimo  default (0),
	preei_pendiente decimal(18, 0) not null CONSTRAINT DF_PresupuestoEnvioItem_preei_pendiente  default (0),
	preei_descrip varchar(5000) not null CONSTRAINT DF_PresupuestoEnvioItem_preei_descrip  default (''),
	preei_precio decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItem_preei_precio  default (0),
	preei_precioTarifa decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItem_preei_precioLista  default (0),
	preei_neto decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItem_pree_neto  default (0),
	preei_ivari decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItem_preei_ivari  default (0),
	preei_ivarni decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItem_preei_ivarni  default (0),
	preei_ivariporc decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItem_preei_ivariporc  default (0),
	preei_ivarniporc decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItem_preei_ivarniporc  default (0),
	preei_importe decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItem_preei_importe  default (0),
	pr_id int not null,
	pue_id_origen int not null,
	pue_id_destino int not null,
	trans_id int not null,
	trfi_id int not null,
	ccos_id int null,
 CONSTRAINT PK_PresupuestoEnvioItem PRIMARY KEY  
(
	preei_id 
) 
) 
;

;
/****** Object:  Table ProductoBOMItemA    Script Date: 07/30/2012 17:25:38 ******/

;

;
create table ProductoBOMItemA(
	pbmi_id int not null,
	pbmia_id int not null,
	pr_id int not null,
 CONSTRAINT PK_ProductoBOMItemA PRIMARY KEY  
(
	pbmia_id 
) 
) 
;
/****** Object:  Table ComunidadInternetRespuesta    Script Date: 07/30/2012 17:06:31 ******/

;

;

;
create table ComunidadInternetRespuesta(
	cmir_id int not null,
	cmir_body text not null CONSTRAINT DF_ComunidadInternetRespuesta_cmir_body  default (''),
	cmir_to varchar(2000) not null CONSTRAINT DF_ComunidadInternetRespuesta_cmir_to  default (''),
	cmir_subject varchar(2000) not null CONSTRAINT DF_ComunidadInternetRespuesta_cmir_subject  default (''),
	cmir_from varchar(255) not null CONSTRAINT DF_ComunidadInternetRespuesta_cmir_from  default (''),
	cmie_id int null,
	cmi_id int null,
	cmia_id int null,
	idm_id int null,
	creado timestamptz not null CONSTRAINT DF_ComunidadInternetRespuesta_creado  default (getdate()),
 CONSTRAINT PK_ComunidadInternetRespuesta PRIMARY KEY  
(
	cmir_id 
) 
) 
;

;
/****** Object:  Table ComunidadInternetTexto    Script Date: 07/30/2012 17:06:38 ******/

;

;

;
create table ComunidadInternetTexto(
	cmit_id int not null,
	cmit_nombre varchar(100) not null,
	cmit_codigo varchar(15) not null,
	cmit_descrip varchar(255) not null CONSTRAINT DF_ComunidadInternetTexto_cmit_descrip  default (''),
	idm_id int null,
	cmi_id int null,
	cmia_id int null,
	cmiea_id int null,
	creado timestamptz not null CONSTRAINT DF_ComunidadInternetTexto_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ComunidadInternetTexto_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_ComunidadInternetTexto_activo  default (1),
 CONSTRAINT PK_ComunidadInternetTexto_1 PRIMARY KEY  
(
	cmit_id 
) 
) 
;

;
/****** Object:  Table ComunidadInternetRespuestaPlantilla    Script Date: 07/30/2012 17:06:34 ******/

;

;

;
create table ComunidadInternetRespuestaPlantilla(
	cmirp_id int not null,
	cmirp_nombre varchar(50) not null,
	cmirp_codigo varchar(50) not null,
	cmirp_texto varchar(5000) not null,
	cmirp_descrip varchar(255) not null CONSTRAINT DF_ComunidadInternetRespuestaPlantilla_cmirp_descrip  default (''),
	cmirp_from varchar(255) not null CONSTRAINT DF_ComunidadInternetRespuestaPlantilla_cmirp_from  default (''),
	cmirp_subject varchar(255) not null CONSTRAINT DF_ComunidadInternetRespuestaPlantilla_cmirp_subject  default (''),
	cmia_id int null,
	cmi_id int null,
	idm_id int null,
	pr_id int null,
	rub_id int null,
	marc_id int null,
	creado timestamptz not null CONSTRAINT DF_ComunidadInternetRespuestaPlantilla_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ComunidadInternetRespuestaPlantilla_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_ComunidadInternetRespuestaPlantilla_activo  default (1),
 CONSTRAINT PK_ComunidadInternetRespuestaPlantilla PRIMARY KEY  
(
	cmirp_id 
) 
) 
;

;
/****** Object:  Table ProductoBOMElaborado    Script Date: 07/30/2012 17:25:34 ******/

;

;
create table ProductoBOMElaborado(
	pbm_id int not null,
	pbme_id int not null,
	pbme_cantidad decimal(18, 6) not null CONSTRAINT DF_ProductoBOMElaborado_pbme_cantidad  default (0),
	pbme_canttipo smallint not null CONSTRAINT DF_ProductoBOMElaborado_pbme_canttipo  default (0),
	pbme_varpos decimal(18, 6) not null CONSTRAINT DF_ProductoBOMElaborado_pbme_varpos  default (0),
	pbme_varneg decimal(18, 6) not null CONSTRAINT DF_ProductoBOMElaborado_pbme_varneg  default (0),
	pbme_vartipo smallint not null CONSTRAINT DF_ProductoBOMElaborado_pbme_vartipo  default (0),
	pr_id int not null,
 CONSTRAINT PK_ProductoBOMElaborado PRIMARY KEY  
(
	pbme_id 
) 
) 
;
/****** Object:  Table ProductoBOMItem    Script Date: 07/30/2012 17:25:36 ******/

;

;
create table ProductoBOMItem(
	pbm_id int not null,
	pbmi_id int not null,
	pbmi_cantidad decimal(18, 6) not null CONSTRAINT DF_ProductoBOMItem_pbmi_cantidad  default (0),
	pbmi_merma decimal(18, 6) not null CONSTRAINT DF_ProductoBOMItem_pbmi_merma  default (0),
	pbmi_varpos decimal(18, 6) not null CONSTRAINT DF_ProductoBOMItem_pbmi_varpos  default (0),
	pbmi_varneg decimal(18, 6) not null CONSTRAINT DF_ProductoBOMItem_pbmi_varneg  default (0),
	pbmi_vartipo smallint not null CONSTRAINT DF_ProductoBOMItem_pbmi_vartipo  default (0),
	pbmi_esBase smallint not null CONSTRAINT DF_ProductoBOMItem_pbmi_esBase  default (0),
	pbmi_temp smallint not null CONSTRAINT DF_ProductoBOMItem_pbmi_temp  default (0),
	pbmit_id int not null,
	pr_id int null,
 CONSTRAINT PK_ProductoBOMItem PRIMARY KEY  
(
	pbmi_id 
) 
) 
;
/****** Object:  Table OrdenProdKitItem    Script Date: 07/30/2012 17:18:43 ******/

;

;

;
create table OrdenProdKitItem(
	opk_id int not null,
	opki_id int not null,
	opki_orden smallint not null,
	opki_cantidadstock decimal(18, 6) not null CONSTRAINT DF_OrdenProdKitItem_opki_cantidadstock  default (0),
	opki_cantidad decimal(18, 6) not null CONSTRAINT DF_OrdenProdKitItem_opki_cantidad  default (0),
	opki_descrip varchar(5000) not null CONSTRAINT DF_OrdenProdKitItem_opki_descrip  default (''),
	pr_id int not null,
	prfk_id int not null,
 CONSTRAINT PK_OrdenProdKitItem PRIMARY KEY  
(
	opki_id 
) 
) 
;

;
/****** Object:  Table Rubro    Script Date: 07/30/2012 17:29:42 ******/

;

;

;
create table Rubro(
	rub_id int not null,
	rub_nombre varchar(100) not null CONSTRAINT DF_Rubro_rub_nombre  default (''),
	rub_codigo varchar(15) not null,
	rub_descrip varchar(255) not null CONSTRAINT DF_Rubro_rub_descrip  default (''),
	rub_escriterio smallint not null CONSTRAINT DF_Rubro_rub_escriterio  default (0),
	rubt_id1 int null,
	rubt_id2 int null,
	rubt_id3 int null,
	rubt_id4 int null,
	rubt_id5 int null,
	rubt_id6 int null,
	rubt_id7 int null,
	rubt_id8 int null,
	rubt_id9 int null,
	rubt_id10 int null,
	rubti_id1 int null,
	rubti_id2 int null,
	rubti_id3 int null,
	rubti_id4 int null,
	rubti_id5 int null,
	rubti_id6 int null,
	rubti_id7 int null,
	rubti_id8 int null,
	rubti_id9 int null,
	rubti_id10 int null,
	creado timestamptz not null CONSTRAINT DF_Rubro_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Rubro_modificado  default (getdate()),
	modifico int not null CONSTRAINT DF_Rubro_modifico  default (0),
	activo smallint not null CONSTRAINT DF_Rubro_activo  default (1),
 CONSTRAINT PK_Rubro PRIMARY KEY  
(
	rub_id 
) 
) 
;

;
/****** Object:  Table EmpleadoPresentismo    Script Date: 07/30/2012 17:09:52 ******/

;

;

;
create table EmpleadoPresentismo(
	em_id int not null,
	empe_id int not null,
	empr_id int not null,
	empr_desde timestamptz not null,
	empr_hasta timestamptz not null,
	empr_tipo smallint not null,
	empr_faltatipo smallint not null,
	empr_aviso smallint not null,
	empr_descrip varchar(5000) not null CONSTRAINT DF_EmpleadoPresentismo_empr_descrip  default (''),
	ccos_id int null,
 CONSTRAINT PK_EmpleadoPresentismo PRIMARY KEY  
(
	empr_id 
) 
) 
;

;
/****** Object:  Table EmpleadoSemana    Script Date: 07/30/2012 17:09:54 ******/

;

;
create table EmpleadoSemana(
	empe_id int not null,
	ems_id int not null,
	ems_fecha timestamptz not null,
	ems_horas decimal(18, 6) not null,
	ems_desde timestamptz not null CONSTRAINT DF_EmpleadoSemana_ems_desde  default ('19000101'),
	ems_hasta timestamptz not null CONSTRAINT DF_EmpleadoSemana_ems_hasta  default ('19000101'),
	ccos_id int not null,
 CONSTRAINT PK_EmpleadoSemana PRIMARY KEY  
(
	ems_id 
) 
) 
;
/****** Object:  Table EmpleadoHoras    Script Date: 07/30/2012 17:09:47 ******/

;

;
create table EmpleadoHoras(
	empe_id int not null,
	emh_id int not null,
	em_id int not null,
	emh_fecha timestamptz not null,
	emh_horas decimal(18, 6) not null,
	emh_desde timestamptz not null CONSTRAINT DF_EmpleadoHoras_emh_desde  default ('19000101'),
	emh_hasta timestamptz not null CONSTRAINT DF_EmpleadoHoras_emh_hasta  default ('19000101'),
	east_id int null,
	ccos_id int not null,
 CONSTRAINT PK_EmpleadoHoras PRIMARY KEY  
(
	emh_id 
) 
) 
;
/****** Object:  Table Alarma    Script Date: 07/30/2012 17:02:49 ******/

;

;

;
create table Alarma(
	al_id int not null,
	al_nombre varchar(255) not null,
	al_codigo varchar(15) not null,
	al_descrip varchar(255) not null,
	al_diatipo smallint not null,
	al_llegadaestado1 smallint not null CONSTRAINT DF_Alarma_al_llegadaestado1  default (0),
	al_llegadaestado2 smallint not null CONSTRAINT DF_Alarma_al_llegadaestado2  default (0),
	al_resolucionestado1 smallint not null CONSTRAINT DF_Alarma_al_resolucionestado1  default (0),
	al_resolucionestado2 smallint not null CONSTRAINT DF_Alarma_al_resolucionestado2  default (0),
	al_llegadaestadoT1 smallint not null CONSTRAINT DF_Alarma_al_llegadaestado11  default (0),
	al_llegadaestadoT2 smallint not null CONSTRAINT DF_Alarma_al_llegadaestado21  default (0),
	al_resolucionestadoT1 smallint not null CONSTRAINT DF_Alarma_al_resolucionestado11  default (0),
	al_resolucionestadoT2 smallint not null CONSTRAINT DF_Alarma_al_resolucionestado21  default (0),
	al_horasxdia decimal(18, 6) not null CONSTRAINT DF_Alarma_al_horasxdia  default (0),
	cli_id int null,
	clis_id int null,
	proy_id int null,
	rub_id int null,
	creado timestamptz not null CONSTRAINT DF_Alarma_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Alarma_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Alarma_activo  default (1),
 CONSTRAINT PK_Alarma PRIMARY KEY  
(
	al_id 
) 
) 
;

;
/****** Object:  Table AsientoItemBorradoTMP    Script Date: 07/30/2012 17:03:27 ******/

;

;
create table AsientoItemBorradoTMP(
	asTMP_id int not null,
	asibTMP_id int not null,
	as_id int not null,
	asi_id int not null,
 CONSTRAINT PK_AsientoItemBorradoTMP PRIMARY KEY  
(
	asibTMP_id 
) 
) 
;
/****** Object:  Table AsientoItemTMP    Script Date: 07/30/2012 17:03:29 ******/

;

;

;
create table AsientoItemTMP(
	asTMP_id int not null,
	asiTMP_id int not null,
	asi_id int not null,
	asi_orden smallint not null,
	asi_descrip varchar(5000) not null CONSTRAINT DF_AsientoItemTMP_asi_descrip_1  default (''),
	asi_debe decimal(18, 6) not null CONSTRAINT DF_AsientoItemTMP_asi_debe  default (0),
	asi_haber decimal(18, 6) not null CONSTRAINT DF_AsientoItemTMP_asi_haber  default (0),
	asi_origen decimal(18, 6) not null CONSTRAINT DF_AsientoItemTMP_asi_origen  default (0),
	cue_id int not null,
	ccos_id int null,
 CONSTRAINT PK_AsientoItemTMP PRIMARY KEY  
(
	asiTMP_id 
) 
) 
;

;
/****** Object:  Table CursoItem    Script Date: 07/30/2012 17:07:50 ******/

;

;
create table CursoItem(
	cur_id int not null,
	curi_id int not null,
	curi_calificacion smallint not null CONSTRAINT DF_CursoItem_curi_calificacion  default (0),
	alum_id int not null,
	prof_id int null,
	est_id int not null,
	fv_id int null,
 CONSTRAINT PK_CursoItem PRIMARY KEY  
(
	curi_id 
) 
) 
;
/****** Object:  Table Alumno    Script Date: 07/30/2012 17:03:15 ******/

;

;

;
create table Alumno(
	alum_id int not null,
	alum_codigo varchar(50) not null,
	alum_legajo varchar(255) not null CONSTRAINT DF_Alumno_alum_legajo  default (''),
	alum_fechaingreso timestamptz not null CONSTRAINT DF_Alumno_alum_fechaingreso  default ('19000101'),
	alum_descrip varchar(5000) not null CONSTRAINT DF_Alumno_alum_descrip  default (''),
	alum_esprospecto smallint not null CONSTRAINT DF_Alumno_alum_esprospecto  default (0),
	prs_id int not null,
	prof_id int null,
	clict_id int null,
	alum_id_referido int null,
	proy_id int null,
	creado timestamptz not null CONSTRAINT DF_Alumno_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Alumno_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Alumno_activo  default (1),
 CONSTRAINT PK_Alumno PRIMARY KEY  
(
	alum_id 
) 
) 
;

;
/****** Object:  Table OrdenProdKitItemBorradoTMP    Script Date: 07/30/2012 17:18:44 ******/

;

;
create table OrdenProdKitItemBorradoTMP(
	opkTMP_id int not null,
	opkibTMP_id int not null,
	opk_id int not null,
	opki_id int not null,
 CONSTRAINT PK_OrdenProdKitItemBorradoTMP PRIMARY KEY  
(
	opkibTMP_id 
) 
) 
;
/****** Object:  Table OrdenProdKitItemTMP    Script Date: 07/30/2012 17:18:46 ******/

;

;

;
create table OrdenProdKitItemTMP(
	opkTMP_id int not null,
	opkiTMP_id int not null,
	opki_id int not null,
	opki_orden smallint not null,
	opki_cantidad decimal(18, 6) not null CONSTRAINT DF_OrdenProdKitItemTMP_opki_cantidad  default (0),
	opki_descrip varchar(5000) not null CONSTRAINT DF_OrdenProdKitItemTMP_opki_descrip  default (''),
	pr_id int not null,
	depl_id int not null,
	prfk_id int null,
 CONSTRAINT PK_OrdenProdKitItemTMP PRIMARY KEY  
(
	opkiTMP_id 
) 
) 
;

;
/****** Object:  Table PickingListPedido    Script Date: 07/30/2012 17:23:15 ******/

;

;

;
create table PickingListPedido(
	pkl_id int not null,
	pklpv_id int not null,
	pklpv_orden smallint not null,
	pklpv_descrip varchar(5000) not null CONSTRAINT DF_PickingListPedido_pklpv_descrip  default (''),
	est_id int not null,
	pv_id int null,
 CONSTRAINT PK_PickingListPedido PRIMARY KEY  
(
	pklpv_id 
) 
) 
;

;
/****** Object:  Table RemitoVentaItemBorradoTMP    Script Date: 07/30/2012 17:28:41 ******/

;

;
create table RemitoVentaItemBorradoTMP(
	rvTMP_id int not null,
	rvibTMP_id int not null,
	rv_id int not null,
	rvi_id int not null,
 CONSTRAINT PK_RemitoVentaBorradoTMP PRIMARY KEY  
(
	rvibTMP_id 
) 
) 
;
/****** Object:  Table RemitoVentaItemSerieTMP    Script Date: 07/30/2012 17:28:45 ******/

;

;

;
create table RemitoVentaItemSerieTMP(
	rvTMP_id int not null,
	rviTMP_id int not null,
	rvi_id int not null CONSTRAINT DF_RemitoVentaSerieTMP_rvi_id  default (0),
	rvisTMP_id int not null,
	rvis_orden int not null CONSTRAINT DF_RemitoVentaSerieTMP_rvis_orden  default (0),
	prns_codigo varchar(100) not null CONSTRAINT DF_RemitoVentaSerieTMP_prns_codigo  default (''),
	prns_descrip varchar(255) not null CONSTRAINT DF_RemitoVentaSerieTMP_prns_descrip  default (''),
	prns_fechavto timestamptz not null CONSTRAINT DF_RemitoVentaSerieTMP_prns_fechavto  default (getdate()),
	pr_id int not null,
	prns_id int not null CONSTRAINT DF_RemitoVentaSerieTMP_prns_id  default (0),
	pr_id_item int null,
 CONSTRAINT PK_RemitoVentaItemSerieTMP PRIMARY KEY  
(
	rvisTMP_id 
) 
) 
;

;
/****** Object:  Table RemitoVentaItemInsumoTMP    Script Date: 07/30/2012 17:28:43 ******/

;

;
create table RemitoVentaItemInsumoTMP(
	rvTMP_id int not null,
	rviTMP_id int not null,
	rviiTMP_id int not null,
	rviiTMP_cantidad decimal(18, 6) not null,
	rviiTMP_cantidadAux decimal(18, 6) not null,
	rviiTMP_temp smallint not null,
	pr_id int not null,
 CONSTRAINT PK_RemitoVentaItemBOMTMP PRIMARY KEY  
(
	rviiTMP_id 
) 
) 
;
/****** Object:  Table RemitoVentaItemTMP    Script Date: 07/30/2012 17:28:51 ******/

;

;

;
create table RemitoVentaItemTMP(
	rvTMP_id int not null,
	rviTMP_id int not null,
	rvi_id int not null,
	rvi_orden smallint not null,
	rvi_cantidad decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItemTMP_rvi_cantidad  default (0),
	rvi_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItemTMP_rvi_cantidadaremitir  default (0),
	rvi_pendiente decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItemTMP_rvi_pendiente  default (0),
	rvi_pendientefac decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItemTMP_rvi_pendientefac  default (0),
	rvi_descrip varchar(5000) not null CONSTRAINT DF_RemitoVentaItemTMP_rvi_descrip  default (''),
	rvi_precio decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItemTMP_rvi_precio  default (0),
	rvi_precioUsr decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItemTMP_rvi_precioUsr  default (0),
	rvi_precioLista decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItemTMP_rvi_precioLista  default (0),
	rvi_descuento varchar(100) not null CONSTRAINT DF_RemitoVentaItemTMP_rvi_descuento  default (''),
	rvi_neto decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItemTMP_rvi_neto  default (0),
	rvi_ivari decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItemTMP_rvi_ivari  default (0),
	rvi_ivarni decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItemTMP_rvi_ivarni  default (0),
	rvi_ivariporc decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItemTMP_rvi_ivariporc  default (0),
	rvi_ivarniporc decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItemTMP_rvi_ivarniporc  default (0),
	rvi_importe decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItemTMP_rvi_importe  default (0),
	rvi_importCodigo varchar(255) not null CONSTRAINT DF__RemitoVen__rvi_i__093C61BC  default (''),
	pr_id int not null,
	ccos_id int null,
	stl_id int null,
 CONSTRAINT PK_RemitoVentaItemTMP PRIMARY KEY  
(
	rviTMP_id 
) 
) 
;

;
/****** Object:  Table RemitoDevolucionVentaTMP    Script Date: 07/30/2012 17:28:16 ******/

;

;
create table RemitoDevolucionVentaTMP(
	rvTMP_id int not null,
	rvdvTMP_id int not null,
	rvdv_id int not null,
	rvdv_cantidad decimal(18, 6) not null CONSTRAINT DF_RemitoDevolucionVentaTMP_rvrd_cantidad  default (0),
	rvi_id_remito int not null,
	rvi_id_devolucion int not null,
 CONSTRAINT PK_RemitoDevolucionVentaTMP PRIMARY KEY  
(
	rvdvTMP_id 
) 
) 
;
/****** Object:  Table OrdenPago    Script Date: 07/30/2012 17:18:20 ******/

;

;

;
create table OrdenPago(
	opg_id int not null,
	opg_numero int not null,
	opg_nrodoc varchar(50) not null CONSTRAINT DF_OrdenPago_opg_nrodoc  default (''),
	opg_descrip varchar(5000) not null CONSTRAINT DF_OrdenPago_opg_descrip  default (''),
	opg_fecha timestamptz not null CONSTRAINT DF_OrdenPago_opg_fecha  default (getdate()),
	opg_neto decimal(18, 6) not null CONSTRAINT DF_OrdenPago_opg_neto  default (0),
	opg_otros decimal(18, 6) not null CONSTRAINT DF_OrdenPago_opg_otros  default (0),
	opg_total decimal(18, 6) not null CONSTRAINT DF_OrdenPago_opg_total  default (0),
	opg_pendiente decimal(18, 6) not null CONSTRAINT DF_OrdenPago_opg_pendiente  default (0),
	opg_cotizacion decimal(18, 6) not null CONSTRAINT DF_OrdenPago_opg_cotizacion  default (0),
	opg_grabarAsiento smallint not null CONSTRAINT DF_OrdenPago_opg_grabarAsiento  default (0),
	opg_firmado int not null CONSTRAINT DF_OrdenPago_fc_firmado  default (0),
	est_id int not null,
	suc_id int not null,
	prov_id int not null,
	emp_id int not null,
	doc_id int not null,
	doct_id int not null,
	ccos_id int null,
	lgj_id int null,
	as_id int null,
	fc_id int null,
	oc_id int null,
	creado timestamptz not null CONSTRAINT DF_OrdenPago_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_OrdenPago_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null CONSTRAINT DF__OrdenPago__impre__076D2096  default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_OrdenPago PRIMARY KEY  
(
	opg_id 
),
 CONSTRAINT IX_OrdenPago UNIQUE  
(
	opg_numero 
),
 CONSTRAINT IX_OrdenPagoNroDoc UNIQUE  
(
	emp_id,
	opg_nrodoc 
) 
) 
;

;
/****** Object:  Table Configuracion    Script Date: 07/30/2012 17:06:52 ******/

;

;

;
create table Configuracion(
	cfg_id int  not null,
	cfg_grupo varchar(60) not null,
	cfg_aspecto varchar(60) not null,
	cfg_valor varchar(5000) not null,
	emp_id int null,
	creado timestamptz not null CONSTRAINT DF_Configuracion_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Configuracion_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_Configuracion PRIMARY KEY  
(
	cfg_id 
) 
) 
;

;
/****** Object:  Table EmpresaClienteDeuda    Script Date: 07/30/2012 17:10:06 ******/

;

;
create table EmpresaClienteDeuda(
	empclid_id int not null,
	emp_id int not null,
	cli_id int not null,
	empclid_creditoctacte decimal(18, 6) not null CONSTRAINT DF_EmpresaClienteDeuda_empclid_creditoctacte  default (0),
	empclid_creditototal decimal(18, 6) not null CONSTRAINT DF_EmpresaClienteDeuda_empclid_creditototal  default (0),
	empclid_creditoactivo smallint not null CONSTRAINT DF_EmpresaClienteDeuda_empclid_creditoactivo  default (1),
	empclid_deudapedido decimal(18, 6) not null CONSTRAINT DF_EmpresaClienteDeuda_empcldi_deudapedido  default (0),
	empclid_deudaorden decimal(18, 6) not null CONSTRAINT DF_EmpresaClienteDeuda_empclid_deudaorden  default (0),
	empclid_deudaremito decimal(18, 6) not null CONSTRAINT DF_EmpresaClienteDeuda_empclid_deudaremito  default (0),
	empclid_deudapackinglist decimal(18, 6) not null CONSTRAINT DF_EmpresaClienteDeuda_empclid_deudapackinglist  default (0),
	empclid_deudamanifiesto decimal(18, 6) not null CONSTRAINT DF_EmpresaClienteDeuda_empclid_deudamanifiesto  default (0),
	empclid_deudactacte decimal(18, 6) not null CONSTRAINT DF_EmpresaClienteDeuda_empclid_deudactacte  default (0),
	empclid_deudadoc decimal(18, 6) not null CONSTRAINT DF_EmpresaClienteDeuda_empclid_deudadoc  default (0),
	empclid_deudatotal decimal(18, 6) not null CONSTRAINT DF_EmpresaClienteDeuda_empclid_deudatotal  default (0),
 CONSTRAINT PK_EmpresaClienteDeuda PRIMARY KEY  
(
	empclid_id 
) 
) 
;
/****** Object:  Table ClienteCacheCredito    Script Date: 07/30/2012 17:05:17 ******/

;

;
create table ClienteCacheCredito(
	cli_id int not null,
	doct_id int not null,
	id int not null,
	clicc_importe decimal(18, 6) not null CONSTRAINT DF_ClienteCacheCredito_clicc_importe  default (0),
	emp_id int not null,
 CONSTRAINT PK_ClienteCacheCredito PRIMARY KEY  
(
	cli_id,
	doct_id,
	id 
) 
) 
;
/****** Object:  Table DepositoLogico    Script Date: 07/30/2012 17:08:37 ******/

;

;

;
create table DepositoLogico(
	depl_id int not null,
	depf_id int not null,
	depl_nombre varchar(100) not null,
	depl_codigo varchar(30) not null,
	depl_descrip varchar(255) not null CONSTRAINT DF_DepositoLogico_depl_descripcion  default (''),
	depl_esTemp smallint not null CONSTRAINT DF_DepositoLogico_depl_esTemp  default (0),
	prov_id int null,
	cli_id int null,
	emp_id int null,
	creado timestamptz not null CONSTRAINT DF_DepositoLogico_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_DepositoLogico_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_DepositoLogico_activo  default (1),
 CONSTRAINT PK_DepositoLogico PRIMARY KEY  
(
	depl_id 
) 
) 
;

;
/****** Object:  Table EmpresaCliente    Script Date: 07/30/2012 17:10:02 ******/

;

;
create table EmpresaCliente(
	empcli_id int not null,
	emp_id int not null,
	cli_id int not null,
	activo smallint not null CONSTRAINT DF_EmpresaCliente_activo  default (0),
	creado timestamptz not null CONSTRAINT DF_EmpresaCliente_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_EmpresaCliente_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_EmpresaCliente PRIMARY KEY  
(
	empcli_id 
) 
) 
;
/****** Object:  Table EjercicioContableEmpresa    Script Date: 07/30/2012 17:09:18 ******/

;

;
create table EjercicioContableEmpresa(
	ejc_id int not null,
	emp_id int not null,
 CONSTRAINT PK_EjercicioContableEmpresa PRIMARY KEY  
(
	ejc_id,
	emp_id 
) 
) 
;
/****** Object:  Table EmpresaUsuario    Script Date: 07/30/2012 17:10:12 ******/

;

;
create table EmpresaUsuario(
	empus_id int not null,
	emp_id int not null,
	us_id int not null,
	activo smallint not null CONSTRAINT DF_EmpresaUsuario_activo  default (0),
	creado timestamptz not null CONSTRAINT DF_EmpresaUsuario_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_EmpresaUsuario_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_EmpresaUsuario PRIMARY KEY  
(
	empus_id 
) 
) 
;
/****** Object:  Table Caja    Script Date: 07/30/2012 17:03:55 ******/

;

;

;
create table Caja(
	cj_id int not null,
	cj_nombre varchar(100) not null CONSTRAINT DF_Caja_cj_nombre  default (''),
	cj_codigo varchar(15) not null,
	cj_descrip varchar(255) not null CONSTRAINT DF_Caja_cj_descrip  default (''),
	cj_hojaruta smallint not null CONSTRAINT DF_Caja_cj_hojaruta  default (0),
	suc_id int not null,
	emp_id int not null,
	doc_id int not null,
	creado timestamptz not null CONSTRAINT DF_Caja_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Caja_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Caja_activo  default (1),
 CONSTRAINT PK_Caja PRIMARY KEY  
(
	cj_id 
) 
) 
;

;
/****** Object:  Table EmpresaProveedorDeuda    Script Date: 07/30/2012 17:10:10 ******/

;

;
create table EmpresaProveedorDeuda(
	empprovd_id int not null,
	emp_id int not null,
	prov_id int not null,
	empprovd_creditoctacte decimal(18, 6) not null CONSTRAINT DF_EmpresaProveedorDeuda_empprov_creditoctacte  default (0),
	empprovd_creditototal decimal(18, 6) not null CONSTRAINT DF_EmpresaProveedorDeuda_empprov_creditototal  default (0),
	empprovd_creditoactivo smallint not null CONSTRAINT DF_EmpresaProveedorDeuda_empprov_creditoactivo  default (1),
	empprovd_deudaorden decimal(18, 6) not null CONSTRAINT DF_EmpresaProveedorDeuda_empprov_deudaorden  default (0),
	empprovd_deudaremito decimal(18, 6) not null CONSTRAINT DF_EmpresaProveedorDeuda_empprov_deudaremito  default (0),
	empprovd_deudactacte decimal(18, 6) not null CONSTRAINT DF_EmpresaProveedorDeuda_empprov_deudactacte  default (0),
	empprovd_deudadoc decimal(18, 6) not null CONSTRAINT DF_EmpresaProveedorDeuda_empprov_deudadoc  default (0),
	empprovd_deudatotal decimal(18, 6) not null CONSTRAINT DF_EmpresaProveedorDeuda_empprov_deudatotal  default (0),
 CONSTRAINT PK_EmpresaProveedorDeuda PRIMARY KEY  
(
	empprovd_id 
) 
) 
;
/****** Object:  Table Departamento    Script Date: 07/30/2012 17:07:56 ******/

;

;

;
create table Departamento(
	dpto_id int not null,
	dpto_nombre varchar(100) not null,
	dpto_codigo varchar(50) not null,
	dpto_descrip varchar(255) not null CONSTRAINT DF_Departamento_dpto_descrip  default (''),
	dpto_id_padre int null,
	dptot_id int not null CONSTRAINT DF_Departamento_dptot_id  default (1),
	emp_id int not null,
	pre_id_vernoticias int null,
	pre_id_editarnoticias int null,
	pre_id_vertareas int null,
	pre_id_asignartareas int null,
	pre_id_verdocumentos int null,
	pre_id_agregardocumentos int null,
	pre_id_borrardocumentos int null,
	pre_id_editardocumentos int null,
	modificado timestamptz not null CONSTRAINT DF_Departamento_modificado  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_Departamento_creado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Departamento_activo  default (1),
 CONSTRAINT PK_Departamento PRIMARY KEY  
(
	dpto_id 
) 
) 
;

;
/****** Object:  Table EmpresaProveedor    Script Date: 07/30/2012 17:10:07 ******/

;

;
create table EmpresaProveedor(
	empprov_id int not null,
	emp_id int not null,
	prov_id int not null,
	activo smallint not null CONSTRAINT DF_EmpresaProveedor_activo  default (0),
	creado timestamptz not null CONSTRAINT DF_EmpresaProveedor_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_EmpresaProveedor_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_EmpresaProveedor PRIMARY KEY  
(
	empprov_id 
) 
) 
;
/****** Object:  Table Talonario    Script Date: 07/30/2012 17:30:58 ******/

;

;

;
create table Talonario(
	ta_id int not null,
	ta_nombre varchar(100) not null,
	ta_codigo varchar(15) not null,
	ta_descrip varchar(255) not null CONSTRAINT DF_Talonario_ta_descrip  default (''),
	ta_ultimonro int not null CONSTRAINT DF_Talonario_ta_ultimonro  default ((0)),
	ta_tipo smallint not null CONSTRAINT DF_Talonario_ta_tipo  default ((0)),
	ta_mascara varchar(20) not null,
	ta_cai varchar(100) not null CONSTRAINT DF_Talonario_ta_cai  default (''),
	ta_puntovta smallint not null CONSTRAINT DF_Talonario_ta_puntovta  default ((0)),
	ta_tipoafip smallint not null CONSTRAINT DF_Talonario_ta_tipoafip  default ((0)),
	emp_id int null,
	creado timestamptz not null CONSTRAINT DF_Talonario_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Talonario_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Talonario_activo  default ((1)),
 CONSTRAINT PK_Talonario PRIMARY KEY  
(
	ta_id 
) 
) 
;

;
/****** Object:  Table ProveedorCacheCredito    Script Date: 07/30/2012 17:26:48 ******/

;

;
create table ProveedorCacheCredito(
	prov_id int not null,
	doct_id int not null,
	id int not null,
	provcc_importe decimal(18, 6) not null CONSTRAINT DF_ProveedorCacheCredito_provc_importe  default (0),
	emp_id int not null,
 CONSTRAINT PK_ProveedorCacheCredito PRIMARY KEY  
(
	prov_id,
	doct_id,
	id 
) 
) 
;
/****** Object:  Table ManifiestoCargaItemTMP    Script Date: 07/30/2012 17:16:46 ******/

;

;

;
create table ManifiestoCargaItemTMP(
	mfcTMP_id int not null,
	mfciTMP_id int not null,
	mfci_id int not null,
	mfci_orden smallint not null,
	mfci_cantidad decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_cantidad  default (0),
	mfci_pendiente decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_pendiente  default (0),
	mfci_pallets int not null,
	mfci_nropallet varchar(100) not null,
	mfci_descrip varchar(255) not null CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_descrip  default (''),
	mfci_precio decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_precio  default (0),
	mfci_precioUsr decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_precioUsr  default (0),
	mfci_precioLista decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_precioLista  default (0),
	mfci_descuento varchar(100) not null CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_descuento  default (''),
	mfci_ivari decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_ivari  default (0),
	mfci_ivarni decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_ivarni  default (0),
	mfci_ivariporc decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_ivariporc  default (0),
	mfci_ivarniporc decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_ivarniporc  default (0),
	mfci_importe decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_importe  default (0),
	pr_id int not null,
	ccos_id int null,
 CONSTRAINT PK_ManifiestoCargaItemTMP PRIMARY KEY  
(
	mfciTMP_id 
) 
) 
;

;
/****** Object:  Table ManifiestoCargaItemBorradoTMP    Script Date: 07/30/2012 17:16:41 ******/

;

;
create table ManifiestoCargaItemBorradoTMP(
	mfcTMP_id int not null,
	mfcibTMP_id int not null,
	mfc_id int not null,
	mfci_id int not null,
 CONSTRAINT PK_ManifiestoCargaItemBorradoTMP PRIMARY KEY  
(
	mfcibTMP_id 
) 
) 
;
/****** Object:  Table PresupuestoEnvioGastoTMP    Script Date: 07/30/2012 17:24:11 ******/

;

;

;
create table PresupuestoEnvioGastoTMP(
	preegTMP_id int not null,
	preeTMP_id int not null,
	preeg_id int not null,
	preeg_orden smallint not null,
	preeg_cantidad decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioGastoTMP_preeg_cantidad_1  default (0),
	preeg_pendiente decimal(18, 0) not null CONSTRAINT DF_PresupuestoEnvioGastoTMP_preeg_pendiente_1  default (0),
	preeg_descrip varchar(5000) not null CONSTRAINT DF_PresupuestoEnvioGastoTMP_preeg_descrip_1  default (''),
	preeg_precio decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioGastoTMP_preeg_precio_1  default (0),
	preeg_precioTarifa decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioGastoTMP_preeg_precioTarifa_1  default (0),
	preeg_neto decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioGastoTMP_preeg_neto_1  default (0),
	preeg_ivari decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioGastoTMP_preeg_ivari_1  default (0),
	preeg_ivarni decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioGastoTMP_preeg_ivarni_1  default (0),
	preeg_ivariporc decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioGastoTMP_preeg_ivariporc_1  default (0),
	preeg_ivarniporc decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioGastoTMP_preeg_ivarniporc_1  default (0),
	preeg_importe decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioGastoTMP_preeg_importe_1  default (0),
	pr_id int not null,
	trans_id int null,
	trfg_id int null,
	gto_id int not null,
	ccos_id int null,
 CONSTRAINT PK_PresupuestoEnvioGastoTMP PRIMARY KEY  
(
	preegTMP_id 
) 
) 
;

;
/****** Object:  Table PresupuestoEnvioItemTMP    Script Date: 07/30/2012 17:24:23 ******/

;

;

;
create table PresupuestoEnvioItemTMP(
	preeiTMP_id int not null,
	preeTMP_id int not null,
	preei_id int not null,
	preei_orden smallint not null,
	preei_cantidad decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_cantidad_1  default (0),
	preei_volumen decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_volumen_1  default (0),
	preei_kilos decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_kilos  default (0),
	preei_minimo decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_minimo  default (0),
	preei_pendiente decimal(18, 0) not null CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_pendiente_1  default (0),
	preei_descrip varchar(5000) not null CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_descrip_1  default (''),
	preei_precio decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_precio_1  default (0),
	preei_precioTarifa decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_precioTarifa_1  default (0),
	preei_neto decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_neto_1  default (0),
	preei_ivari decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_ivari_1  default (0),
	preei_ivarni decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_ivarni_1  default (0),
	preei_ivariporc decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_ivariporc_1  default (0),
	preei_ivarniporc decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_ivarniporc_1  default (0),
	preei_importe decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_importe_1  default (0),
	pr_id int not null,
	pue_id_origen int not null,
	pue_id_destino int not null,
	trans_id int not null,
	trfi_id int not null,
	ccos_id int null,
 CONSTRAINT PK_PresupuestoEnvioItemTMP PRIMARY KEY  
(
	preeiTMP_id 
) 
) 
;

;
/****** Object:  Table PresupuestoEnvioGastoBorradoTMP    Script Date: 07/30/2012 17:24:07 ******/

;

;
create table PresupuestoEnvioGastoBorradoTMP(
	preeTMP_id int not null,
	preegbTMP_id int not null,
	pree_id int not null,
	preeg_id int not null,
 CONSTRAINT PK_PresupuestoEnvioGastoBorradoTMP PRIMARY KEY  
(
	preegbTMP_id 
) 
) 
;
/****** Object:  Table PresupuestoEnvioItemBorradoTMP    Script Date: 07/30/2012 17:24:18 ******/

;

;
create table PresupuestoEnvioItemBorradoTMP(
	preeTMP_id int not null,
	preeibTMP_id int not null,
	pree_id int not null,
	preei_id int not null,
 CONSTRAINT PK_PresupestoEnvioItemBorradoTMP PRIMARY KEY  
(
	preeibTMP_id 
) 
) 
;
/****** Object:  Table ParteDiario    Script Date: 07/30/2012 17:20:20 ******/

;

;

;
create table ParteDiario(
	ptd_id int not null,
	ptd_numero int not null,
	ptd_titulo varchar(255) null CONSTRAINT DF_ParteDiario_ptd_titulo  default (''),
	ptd_descrip varchar(5000) not null CONSTRAINT DF_ParteDiario_tar_descrip  default (''),
	ptd_fechaini timestamptz not null CONSTRAINT DF_ParteDiario_tar_fechaini  default (getdate()),
	ptd_fechafin timestamptz not null CONSTRAINT DF_ParteDiario_tar_fechafin  default (getdate()),
	ptd_alarma timestamptz not null CONSTRAINT DF_ParteDiario_tar_alarma  default (getdate()),
	ptd_cumplida smallint not null CONSTRAINT DF_ParteDiario_tar_cumplida  default (0),
	ptd_recurrente smallint not null CONSTRAINT DF_ParteDiario_ptd_recurrente  default (0),
	ptd_listausuariosId varchar(255) not null CONSTRAINT DF_ParteDiario_ptd_listausuariosId  default (''),
	ptd_publico smallint not null CONSTRAINT DF_ParteDiario_ptd_publico  default (0),
	ptd_horaini timestamptz not null CONSTRAINT DF_ParteDiario_ptd_horaini  default (getdate()),
	ptd_horafin timestamptz not null CONSTRAINT DF_ParteDiario_ptd_horafin  default (getdate()),
	ptd_vtoaviso smallint not null CONSTRAINT DF_ParteDiario_ptd_vtoaviso  default (0),
	ptd_vtocumplido smallint not null CONSTRAINT DF_ParteDiario_ptd_vtocumplido  default (1),
	ptdt_id int not null CONSTRAINT DF_ParteDiario_ptdt_id  default (1),
	ptd_id_padre int null,
	ptd_privado smallint not null CONSTRAINT DF_ParteDiario_ptd_privado  default (0),
	us_id_responsable int null,
	us_id_asignador int null,
	cont_id int null,
	tarest_id int null,
	prio_id int null,
	lgj_id int null,
	cli_id int null,
	prov_id int null,
	dpto_id int null,
	ven_id int null,
	suc_id int null,
	doct_id int null,
	doc_id int null,
	prns_id int null,
	modificado timestamptz not null CONSTRAINT DF_ParteDiario_modificado  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_ParteDiario_creado  default (getdate()),
	modifico int not null,
	tar_id int null,
	alum_id int null,
 CONSTRAINT PK_ParteDiario PRIMARY KEY  
(
	ptd_id 
) 
) 
;

;
/****** Object:  Table Tarea    Script Date: 07/30/2012 17:31:07 ******/

;

;

;
create table Tarea(
	tar_id int not null,
	tar_id_padre int null,
	tar_numero varchar(20) not null CONSTRAINT DF_Tarea_tar_numero  default (''),
	tar_nombre varchar(255) not null CONSTRAINT DF_Tarea_tar_nombre  default (''),
	tar_descrip varchar(7000) not null CONSTRAINT DF_Tarea_tar_descrip  default (''),
	tar_fechaini timestamptz not null CONSTRAINT DF_Tarea_tar_fechaini  default (getdate()),
	tar_fechafin timestamptz not null CONSTRAINT DF_Tarea_tar_fechafin  default (getdate()),
	tar_alarma timestamptz not null CONSTRAINT DF_Tarea_tar_alarma  default (getdate()),
	tar_estado1 timestamptz not null CONSTRAINT DF_Tarea_tar_estado2  default (getdate()),
	tar_estado2 timestamptz not null CONSTRAINT DF_Tarea_tar_estado2_1  default (getdate()),
	tar_horaini smallint not null CONSTRAINT DF_Tarea_tar_horaini  default (0),
	tar_fechahoraini timestamptz not null CONSTRAINT DF_Tarea_tar_fechahoraini  default (getdate()),
	tar_fechahorafin timestamptz not null CONSTRAINT DF_Tarea_tar_fechahorafin  default (getdate()),
	tar_finalizada smallint not null CONSTRAINT DF_Tarea_tar_finalizada  default (0),
	tar_cumplida smallint not null CONSTRAINT DF_Tarea_tar_cumplida  default (0),
	tar_rechazada smallint not null CONSTRAINT DF_Tarea_tar_rechazada  default (0),
	tar_aprobada smallint not null CONSTRAINT DF_Tarea_tar_aprobada  default (0),
	tar_terminada timestamptz not null CONSTRAINT DF_Tarea_tar_terminada  default (getdate()),
	tar_facturable smallint not null CONSTRAINT DF_Tarea_tar_facturable  default (1),
	tar_plantilla smallint not null CONSTRAINT DF_Tarea_tar_plantilla  default (0),
	tar_opcional smallint not null CONSTRAINT DF_Tarea_tar_opcional  default (0),
	rub_id int null,
	us_id_responsable int null,
	us_id_asignador int null,
	us_id_alta int not null,
	cont_id int null,
	tarest_id int null,
	prio_id int null,
	proy_id int not null,
	proyi_id int null,
	obje_id int null,
	cli_id int null,
	clis_id int null,
	dpto_id int null,
	prns_id int null,
	os_id int null,
	alit_id int null,
	ali_id int null,
	modificado timestamptz not null CONSTRAINT DF_Tarea_modificado  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_Tarea_creado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Tarea_activo  default (1),
 CONSTRAINT PK_Tarea PRIMARY KEY  
(
	tar_id 
) 
) 
;

;
/****** Object:  Table ProyectoTareaEstado    Script Date: 07/30/2012 17:27:15 ******/

;

;
create table ProyectoTareaEstado(
	proyest_id int not null,
	proy_id int not null,
	tarest_id int not null,
	creado timestamptz not null CONSTRAINT DF_ProyectoTareaEstado_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ProyectoTareaEstado_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_ProyectoTareaEstado_activo  default (1),
 CONSTRAINT PK_ProyectoTareaEstado PRIMARY KEY  
(
	proyest_id 
) 
) 
;
/****** Object:  Table OrdenServicioItem    Script Date: 07/30/2012 17:19:12 ******/

;

;

;
create table OrdenServicioItem(
	os_id int not null,
	osi_id int not null,
	osi_orden smallint not null,
	osi_cantidad decimal(18, 6) not null CONSTRAINT DF_OrdenServicioItem_pvi_cantidad  default (0),
	osi_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_OrdenServicioItem_pvi_cantidadaremitir  default (0),
	osi_pendiente decimal(18, 0) not null CONSTRAINT DF_OrdenServicioItem_pvi_pendiente  default (0),
	osi_descrip varchar(5000) not null CONSTRAINT DF_OrdenServicioItem_pvi_descrip  default (''),
	osi_precio decimal(18, 6) not null CONSTRAINT DF_OrdenServicioItem_pvi_precio  default (0),
	osi_precioUsr decimal(18, 6) not null CONSTRAINT DF_OrdenServicioItem_pvi_precioUsr  default (0),
	osi_precioLista decimal(18, 6) not null CONSTRAINT DF_OrdenServicioItem_pvi_precioLista  default (0),
	osi_descuento varchar(100) not null CONSTRAINT DF_OrdenServicioItem_pvi_descuento  default (''),
	osi_neto decimal(18, 6) not null CONSTRAINT DF_OrdenServicioItem_pvi_neto  default (0),
	osi_ivari decimal(18, 6) not null CONSTRAINT DF_OrdenServicioItem_pvi_ivari  default (0),
	osi_ivarni decimal(18, 6) not null CONSTRAINT DF_OrdenServicioItem_pvi_ivarni  default (0),
	osi_ivariporc decimal(18, 6) not null CONSTRAINT DF_OrdenServicioItem_pvi_ivariporc  default (0),
	osi_ivarniporc decimal(18, 6) not null CONSTRAINT DF_OrdenServicioItem_pvi_ivarniporc  default (0),
	osi_importe decimal(18, 6) not null CONSTRAINT DF_OrdenServicioItem_pvi_importe  default (0),
	osi_importCodigo varchar(255) not null CONSTRAINT DF__ordenserv__osi_i__17A78112  default (0),
	pr_id int not null,
	ccos_id int null,
	stl_id int null,
	tar_id int null,
	cont_id int null,
	etf_id int null,
 CONSTRAINT PK_OrdenServicioItem PRIMARY KEY  
(
	osi_id 
) 
) 
;

;
/****** Object:  Table PedidoVentaItem    Script Date: 07/30/2012 17:22:10 ******/

;

;

;
create table PedidoVentaItem(
	pv_id int not null,
	pvi_id int not null,
	pvi_orden smallint not null,
	pvi_cantidad decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItem_pvi_cantidad  default (0),
	pvi_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItem_pvi_cantidadaremitir  default (0),
	pvi_pendiente decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItem_pvi_pendiente  default (0),
	pvi_pendientepklst decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItem_pvi_pendientepklst  default (0),
	pvi_pendienteprv decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItem_pvi_pendienteprv  default (0),
	pvi_descrip varchar(5000) not null CONSTRAINT DF_PedidoVentaItem_pvi_descrip  default (''),
	pvi_precio decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItem_pvi_precio  default (0),
	pvi_precioUsr decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItem_pvi_precioUsr  default (0),
	pvi_precioLista decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItem_pvi_precioLista  default (0),
	pvi_descuento varchar(100) not null CONSTRAINT DF_PedidoVentaItem_pvi_descuento  default (''),
	pvi_neto decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItem_pv_neto  default (0),
	pvi_ivari decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItem_pvi_ivari  default (0),
	pvi_ivarni decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItem_pvi_ivarni  default (0),
	pvi_ivariporc decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItem_pvi_ivariporc  default (0),
	pvi_ivarniporc decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItem_pvi_ivarniporc  default (0),
	pvi_importe decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItem_pvi_importe  default (0),
	pvi_codigocomunidad varchar(255) not null CONSTRAINT DF_PedidoVentaItem_pvi_codigocomunidad  default (''),
	pr_id int not null,
	ccos_id int null,
 CONSTRAINT PK_PedidoVentaItem PRIMARY KEY  
(
	pvi_id 
) 
) 
;

;
/****** Object:  Table ComunidadInternetMail    Script Date: 07/30/2012 17:06:21 ******/

;

;

;
create table ComunidadInternetMail(
	cmie_id int not null,
	cmie_account varchar(255) not null,
	cmie_mailid varchar(50) not null,
	cmie_fromname varchar(1000) not null,
	cmie_fromaddress varchar(1000) not null,
	cmie_to varchar(255) not null,
	cmie_subject varchar(2000) not null,
	cmie_body_html text not null,
	cmie_body_plain text not null,
	cmie_body_mime text not null,
	cmie_subject_mime varchar(2000) not null,
	cmie_header_mime text not null,
	cmie_body_updated smallint not null CONSTRAINT DF_ComunidadInternetMail_cmie_body_updated  default (0),
	cmie_date timestamptz not null CONSTRAINT DF_ComunidadInternetMail_cmie_date  default ('19000101'),
	cmi_id int null,
	cmiea_id int not null,
	cli_id int null,
	est_id int not null CONSTRAINT DF_ComunidadInternetMail_est_id  default (1),
	pv_id int null,
	creado timestamptz not null CONSTRAINT DF_ComunidadInternetMail_creado  default (getdate()),
 CONSTRAINT PK_ComunidadInternetMail PRIMARY KEY  
(
	cmie_id 
) 
)  
;

;
/****** Object:  Table PedidoVentaItemStock    Script Date: 07/30/2012 17:22:13 ******/

;

;
create table PedidoVentaItemStock(
	pv_id int not null,
	pvist_id int not null,
	pvi_pendiente decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItemStock_pvi_pendiente  default (0),
	pr_id int not null,
	pr_id_kit int null,
	pr_id_kitpadre int null,
 CONSTRAINT PK_PedidoVentaItemStock PRIMARY KEY  
(
	pvist_id 
) 
) 
;
/****** Object:  Table Hora    Script Date: 07/30/2012 17:13:48 ******/

;

;

;
create table Hora(
	hora_id int not null,
	hora_titulo varchar(255) not null CONSTRAINT DF_Hora_hora_titulo  default (''),
	hora_descrip varchar(7000) not null CONSTRAINT DF_Hora_hora_descrip  default (''),
	hora_fecha timestamptz not null,
	hora_desde timestamptz not null,
	hora_hasta timestamptz not null,
	hora_horas smallint not null CONSTRAINT DF_Hora_hora_horas  default (0),
	hora_minutos smallint not null CONSTRAINT DF_Hora_hora_minutos  default (0),
	hora_pendiente decimal(18, 6) not null CONSTRAINT DF_Hora_hora_pendiente  default (0),
	hora_facturable smallint not null CONSTRAINT DF_Hora_hora_facturable  default (0),
	cli_id int not null,
	proy_id int not null,
	proyi_id int not null,
	obje_id int not null,
	us_id int not null,
	tar_id int null,
	creado timestamptz not null CONSTRAINT DF_Hora_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Hora_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_Hora PRIMARY KEY  
(
	hora_id 
) 
) 
;

;
/****** Object:  Table AlarmaItem    Script Date: 07/30/2012 17:02:58 ******/

;

;

;
create table AlarmaItem(
	al_id int not null,
	ali_id int not null,
	ali_nombre varchar(255) not null,
	ali_tiempo smallint not null,
	ali_tiempotipo smallint not null,
	ali_tiempodesde smallint not null CONSTRAINT DF_AlarmaItem_ali_tiempodesde  default (1),
	ali_secuencia smallint not null,
	ali_obligatorioremito smallint not null,
	ali_obligatoriofactura smallint not null,
	ali_alarma1 smallint not null,
	ali_alarmatipo1 smallint not null,
	ali_alarma2 smallint not null,
	ali_alarmatipo2 smallint not null,
	ali_tipo smallint not null CONSTRAINT DF_AlarmaItem_ali_pasopresupuesto  default (1),
	ali_laboral smallint not null CONSTRAINT DF_AlarmaItem_ali_laboral  default (1),
	alit_id int not null,
	dpto_id int null,
	mail_id_inicio int null,
	mail_id_alarma1 int null,
	mail_id_alarma2 int null,
	mail_id_finalizado int null,
	mail_id_vencido int null,
 CONSTRAINT PK_AlarmaItem PRIMARY KEY  
(
	ali_id 
) 
) 
;

;
/****** Object:  Table TrabajoImpresionItem    Script Date: 07/30/2012 17:31:50 ******/

;

;

;
create table TrabajoImpresionItem(
	timp_id int not null,
	timpi_id int not null,
	timpi_rptname varchar(1000) not null CONSTRAINT DF_TrabajoImpresionItem_timp_rptname  default (''),
	timpi_rptfile varchar(500) not null CONSTRAINT DF_TrabajoImpresionItem_timp_rptfile  default (''),
	timpi_action smallint not null CONSTRAINT DF_TrabajoImpresionItem_timp_action  default (0),
	timpi_copies smallint not null CONSTRAINT DF_TrabajoImpresionItem_timp_copies  default (0),
	timpi_strobject varchar(255) not null CONSTRAINT DF_TrabajoImpresionItem_timp_strobject  default (''),
	creado timestamptz not null CONSTRAINT DF_TrabajoImpresionItem_creado  default (getdate()),
 CONSTRAINT PK_TrabajoImpresionItem PRIMARY KEY  
(
	timpi_id 
) 
) 
;

;
/****** Object:  Table ImportacionLog    Script Date: 07/30/2012 17:14:04 ******/

;

;

;
create table ImportacionLog(
	impl_id int not null,
	impl_fecha timestamptz not null CONSTRAINT DF_ImportacionLog_impl_fecha  default (getdate()),
	impl_descrip varchar(5000) not null CONSTRAINT DF_ImportacionLog_impl_descrip  default (''),
	impl_severidad smallint not null CONSTRAINT DF_ImportacionLog_impl_severidad  default (0),
	impp_id int not null,
 CONSTRAINT PK_ImportacionLog PRIMARY KEY  
(
	impl_id 
) 
) 
;

;
/****** Object:  Table ImportacionProcesoItem    Script Date: 07/30/2012 17:14:08 ******/

;

;

;
create table ImportacionProcesoItem(
	impp_id int not null,
	imppi_id int not null,
	imppi_objeto varchar(255) not null,
	imppi_params varchar(5000) not null CONSTRAINT DF_ImportacionProcesoItem_imppi_params  default (''),
	imppi_ultimaimportacion timestamptz not null CONSTRAINT DF_ImportacionProcesoItem_imppi_ultimaimportacion  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ImportacionProcesoItem_modificado  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_ImportacionProcesoItem_creado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ImportacionProcesoItem PRIMARY KEY  
(
	imppi_id 
) 
) 
;

;
/****** Object:  Table Chofer    Script Date: 07/30/2012 17:04:54 ******/

;

;

;
create table Chofer(
	chof_id int not null,
	chof_nombre varchar(100) not null,
	chof_codigo varchar(15) not null,
	chof_descrip varchar(255) not null CONSTRAINT DF_Chofer_chof_descrip  default (''),
	chof_tipodni smallint not null CONSTRAINT DF_Chofer_chof_tipodni  default (0),
	chof_dni int not null CONSTRAINT DF_Chofer_chof_dni  default (0),
	chof_fechadenacimiento timestamptz not null,
	chof_direccion varchar(255) not null CONSTRAINT DF_Chofer_chof_direccion  default (''),
	chof_telefono varchar(50) not null CONSTRAINT DF_Chofer_chof_telefono  default (''),
	trans_id int null,
	cam_id int null,
	creado timestamptz not null CONSTRAINT DF_Chofer_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Chofer_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Chofer_activo  default (1),
 CONSTRAINT PK_Chofer PRIMARY KEY  
(
	chof_id 
) 
) 
;

;
/****** Object:  Table Tarifa    Script Date: 07/30/2012 17:31:13 ******/

;

;

;
create table Tarifa(
	trf_id int not null,
	trf_nombre varchar(100) not null,
	trf_codigo varchar(15) not null,
	trf_fechaDesde timestamptz not null CONSTRAINT DF_Tarifa_trf_fechaDesde  default (getdate()),
	trf_fechaHasta timestamptz not null CONSTRAINT DF_Tarifa_trf_fechaHasta  default (getdate()),
	trf_descrip varchar(255) not null,
	trf_tipo smallint not null CONSTRAINT DF_Tarifa_trf_tipo_1  default (0),
	trans_id int not null,
	mon_id int not null,
	creado timestamptz not null CONSTRAINT DF_Tarifa_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Tarifa_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Tarifa_activo  default (1),
 CONSTRAINT PK_Tarifa PRIMARY KEY  
(
	trf_id 
) 
) 
;

;
/****** Object:  Table Camion    Script Date: 07/30/2012 17:04:09 ******/

;

;

;
create table Camion(
	cam_id int not null,
	cam_codigo varchar(15) not null,
	cam_descrip varchar(255) not null CONSTRAINT DF_camion_cam_descrip  default (''),
	cam_patente varchar(20) not null,
	cam_patentesemi varchar(20) not null,
	cam_tara int not null,
	cam_essemi smallint not null CONSTRAINT DF_Camion_cam_eschasis  default (0),
	trans_id int null,
	chof_id int null,
	creado timestamptz not null CONSTRAINT DF_camion_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_camion_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Camion_activo  default (1),
 CONSTRAINT PK_camion PRIMARY KEY  
(
	cam_id 
) 
) 
;

;
/****** Object:  Table DocumentoImpresora    Script Date: 07/30/2012 17:09:10 ******/

;

;

;
create table DocumentoImpresora(
	doci_id int not null,
	doc_id int null,
	ta_id int null,
	doci_pc varchar(255) not null CONSTRAINT DF_DocumentoImpresora_doci_pc  default (''),
	doci_impresora varchar(255) not null CONSTRAINT DF_DocumentoImpresora_doci_impresora  default (''),
	doci_bandeja varchar(255) not null CONSTRAINT DF_DocumentoImpresora_doci_bandeja  default (''),
	doci_printbyservice smallint not null CONSTRAINT DF_DocumentoImpresora_doci_printbyservice  default (0),
	creado timestamptz not null CONSTRAINT DF_DocumentoImpresora_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_DocumentoImpresora_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_DocumentoImpresora PRIMARY KEY  
(
	doci_id 
) 
) 
;

;
/****** Object:  Table ResolucionCupon    Script Date: 07/30/2012 17:29:12 ******/

;

;

;
create table ResolucionCupon(
	rcup_id int not null,
	rcup_numero int not null,
	rcup_nrodoc varchar(50) not null CONSTRAINT DF_ResolucionCupon_rcup_nrodoc  default (''),
	rcup_descrip varchar(5000) not null CONSTRAINT DF_ResolucionCupon_rcup_descrip  default (''),
	rcup_fecha timestamptz not null CONSTRAINT DF_ResolucionCupon_rcup_fecha  default (getdate()),
	rcup_total decimal(18, 6) not null CONSTRAINT DF_ResolucionCupon_rcup_total  default (0),
	rcup_firmado int not null CONSTRAINT DF_ResolucionCupon_mf_firmado  default (0),
	rcup_grabarasiento smallint not null CONSTRAINT DF_ResolucionCupon_mf_grabarasiento  default (0),
	est_id int not null,
	suc_id int not null,
	doc_id int not null,
	doct_id int not null,
	as_id int null,
	lgj_id int null,
	creado timestamptz not null CONSTRAINT DF_ResolucionCupon_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ResolucionCupon_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_ResolucionCupon PRIMARY KEY  
(
	rcup_id 
) 
) 
;

;
/****** Object:  Table CotizacionCompra    Script Date: 07/30/2012 17:07:10 ******/

;

;

;
create table CotizacionCompra(
	cot_id int not null,
	cot_numero int not null,
	cot_nrodoc varchar(50) not null CONSTRAINT DF_CotizacionCompra_cot_nrodoc  default (''),
	cot_descrip varchar(5000) not null CONSTRAINT DF_CotizacionCompra_cot_descrip  default (''),
	cot_fecha timestamptz not null CONSTRAINT DF_CotizacionCompra_cot_fecha  default (getdate()),
	cot_fechaentrega timestamptz not null CONSTRAINT DF_CotizacionCompra_cot_fechaentrega  default (getdate()),
	cot_neto decimal(18, 6) not null CONSTRAINT DF_CotizacionCompra_cot_neto  default (0),
	cot_ivari decimal(18, 6) not null CONSTRAINT DF_CotizacionCompra_cot_impuesto  default (0),
	cot_ivarni decimal(18, 6) not null CONSTRAINT DF_CotizacionCompra_cot_ivarni  default (0),
	cot_subtotal decimal(18, 6) not null CONSTRAINT DF_CotizacionCompra_cot_subtotal  default (0),
	cot_total decimal(18, 6) not null CONSTRAINT DF_CotizacionCompra_cot_total  default (0),
	cot_pendiente decimal(18, 6) not null CONSTRAINT DF_CotizacionCompra_cot_pendiente  default (0),
	cot_firmado int not null CONSTRAINT DF_CotizacionCompra_cot_firmado  default (0),
	est_id int not null,
	suc_id int not null,
	doc_id int not null,
	doct_id int not null,
	lp_id int null,
	cpg_id int not null,
	ccos_id int null,
	us_id int null,
	lgj_id int null,
	creado timestamptz not null CONSTRAINT DF_CotizacionCompra_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_CotizacionCompra_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_CotizacionCompra PRIMARY KEY  
(
	cot_id 
) 
) 
;

;
/****** Object:  Table ReporteFormulario    Script Date: 07/30/2012 17:29:05 ******/

;

;

;
create table ReporteFormulario(
	rptf_id int not null,
	rptf_nombre varchar(255) not null,
	rptf_csrfile varchar(255) not null,
	rptf_tipo smallint not null,
	rptf_sugerido smallint not null,
	rptf_sugeridoemail smallint not null CONSTRAINT DF_ReporteFormulario_rptf_sugeridoemail  default (0),
	rptf_copias smallint not null,
	rptf_docImprimirEnAlta smallint not null,
	rptf_object varchar(255) not null CONSTRAINT DF_ReporteFormulario_rptf_object  default (''),
	tbl_id int null,
	doc_id int null,
	creado timestamptz not null CONSTRAINT DF_ReporteFormulario_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ReporteFormulario_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_ReporteFormulario_activo  default (1),
 CONSTRAINT PK_ReporteFormulario PRIMARY KEY  
(
	rptf_id 
) 
) 
;

;
/****** Object:  Table PresupuestoEnvio    Script Date: 07/30/2012 17:24:01 ******/

;

;

;
create table PresupuestoEnvio(
	pree_id int not null,
	pree_numero int not null,
	pree_nrodoc varchar(50) not null CONSTRAINT DF_PresupuestoEnvio_pree_nrodoc  default (''),
	pree_descrip varchar(5000) not null CONSTRAINT DF_PresupuestoEnvio_pree_descrip  default (''),
	pree_fecha timestamptz not null CONSTRAINT DF_PresupuestoEnvio_pree_fecha  default (getdate()),
	pree_fechaentrega timestamptz not null CONSTRAINT DF_PresupuestoEnvio_pree_fechaentrega  default (getdate()),
	pree_neto decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvio_pree_neto  default (0),
	pree_ivari decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvio_pree_impuesto  default (0),
	pree_ivarni decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvio_pree_ivarni  default (0),
	pree_subtotal decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvio_pree_subtotal  default (0),
	pree_total decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvio_pree_total  default (0),
	pree_pendiente decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvio_pree_pendiente  default (0),
	pree_firmado int not null CONSTRAINT DF_PresupuestoEnvio_pree_firmado  default (0),
	pree_descuento1 decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvio_pree_descuento  default (0),
	pree_descuento2 decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvio_pree_descuento2  default (0),
	pree_importedesc1 decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvio_pree_importedesc1  default (0),
	pree_importedesc2 decimal(18, 6) not null CONSTRAINT DF_PresupuestoEnvio_pree_importedesc2  default (0),
	est_id int not null,
	suc_id int not null,
	cli_id int not null,
	doc_id int not null,
	doct_id int not null,
	cpg_id int not null,
	ccos_id int null,
	ven_id int null,
	creado timestamptz not null CONSTRAINT DF_PresupuestoEnvio_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_PresupuestoEnvio_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_PresupuestoEnvio PRIMARY KEY  
(
	pree_id 
) 
) 
;

;
/****** Object:  Table DocumentoFirma    Script Date: 07/30/2012 17:09:05 ******/

;

;
create table DocumentoFirma(
	docfr_id int not null,
	doc_id int not null,
	us_id int not null,
	creado timestamptz not null CONSTRAINT DF_DocumentoFirma_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_DocumentoFirma_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_DocumentoFirma PRIMARY KEY  
(
	docfr_id 
) 
) 
;
/****** Object:  Table DepositoBanco    Script Date: 07/30/2012 17:08:05 ******/

;

;

;
create table DepositoBanco(
	dbco_id int not null,
	dbco_numero int not null,
	dbco_nrodoc varchar(50) not null CONSTRAINT DF_DepositoBanco_dbco_nrodoc  default (''),
	dbco_descrip varchar(5000) not null CONSTRAINT DF_DepositoBanco_dbco_descrip  default (''),
	dbco_fecha timestamptz not null CONSTRAINT DF_DepositoBanco_dbco_fecha  default (getdate()),
	dbco_cotizacion decimal(18, 6) not null CONSTRAINT DF_DepositoBanco_cobz_cotizacion  default (0),
	dbco_total decimal(18, 6) not null CONSTRAINT DF_DepositoBanco_dbco_total  default (0),
	dbco_totalorigen decimal(18, 6) not null CONSTRAINT DF_DepositoBanco_dbco_totalorigen  default (0),
	dbco_firmado int not null CONSTRAINT DF_DepositoBanco_mf_firmado  default (0),
	dbco_grabarasiento smallint not null CONSTRAINT DF_DepositoBanco_mf_grabarasiento  default (0),
	est_id int not null,
	suc_id int not null,
	doc_id int not null,
	doct_id int not null,
	bco_id int not null,
	cue_id int not null,
	as_id int null,
	lgj_id int null,
	creado timestamptz not null CONSTRAINT DF_DepositoBanco_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_DepositoBanco_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_DepositoBanco PRIMARY KEY  
(
	dbco_id 
) 
) 
;

;
/****** Object:  Table CondicionPago    Script Date: 07/30/2012 17:06:49 ******/

;

;

;
create table CondicionPago(
	cpg_id int not null,
	cpg_nombre varchar(100) not null,
	cpg_codigo varchar(15) not null,
	cpg_descrip varchar(255) not null CONSTRAINT DF_CondicionPago_cpg_descrip  default (''),
	cpg_escontado smallint not null CONSTRAINT DF_CondicionPago_cpg_escontado  default (0),
	cpg_eslibre smallint not null CONSTRAINT DF_CondicionPago_cpg_eslibre  default (0),
	cpg_asientoXVto smallint not null CONSTRAINT DF_CondicionPago_cpg_asientoXVto  default (0),
	cpg_tipo smallint not null CONSTRAINT DF_CondicionPago_cpg_tipo  default (1),
	cueg_id int null,
	doc_id int null,
	activo smallint not null CONSTRAINT DF_CondicionPago_activo  default (0),
	creado timestamptz not null CONSTRAINT DF_CondicionPago_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_CondicionPago_modificado  default (getdate()),
	modifico int not null CONSTRAINT DF_CondicionPago_modifico  default (1),
 CONSTRAINT PK_CondicionPago PRIMARY KEY  
(
	cpg_id 
) 
) 
;

;
/****** Object:  Table Asiento    Script Date: 07/30/2012 17:03:22 ******/

;

;

;
create table Asiento(
	as_id int not null,
	as_numero int not null,
	as_nrodoc varchar(50) not null CONSTRAINT DF_Asiento_as_nrodoc  default (''),
	as_nrodocld varchar(50) not null CONSTRAINT DF_Asiento_as_nrodocld  default (''),
	as_descrip varchar(5000) not null CONSTRAINT DF_Asiento_as_descrip  default (''),
	as_fecha timestamptz not null CONSTRAINT DF_Asiento_as_fecha  default (getdate()),
	as_doc_cliente varchar(5000) not null CONSTRAINT DF_Asiento_as_doc_cliente  default (''),
	doc_id int not null,
	doct_id int not null,
	doct_id_cliente int null,
	doc_id_cliente int null,
	id_cliente int not null CONSTRAINT DF_Asiento_id_cliente  default (0),
	creado timestamptz not null CONSTRAINT DF_Asiento_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Asiento_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_Asiento PRIMARY KEY  
(
	as_id 
) 
) 
;

;
/****** Object:  Table DepositoCupon    Script Date: 07/30/2012 17:08:22 ******/

;

;

;
create table DepositoCupon(
	dcup_id int not null,
	dcup_numero int not null,
	dcup_nrodoc varchar(50) not null CONSTRAINT DF_DepositoCupon_dcup_nrodoc  default (''),
	dcup_descrip varchar(5000) not null CONSTRAINT DF_DepositoCupon_dcup_descrip  default (''),
	dcup_fecha timestamptz not null CONSTRAINT DF_DepositoCupon_dcup_fecha  default (getdate()),
	dcup_total decimal(18, 6) not null CONSTRAINT DF_DepositoCupon_dcup_total  default (0),
	dcup_firmado int not null CONSTRAINT DF_DepositoCupon_mf_firmado  default (0),
	dcup_grabarasiento smallint not null CONSTRAINT DF_DepositoCupon_mf_grabarasiento  default (0),
	est_id int not null,
	suc_id int not null,
	doc_id int not null,
	doct_id int not null,
	as_id int null,
	lgj_id int null,
	creado timestamptz not null CONSTRAINT DF_DepositoCupon_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_DepositoCupon_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_DepositoCupon PRIMARY KEY  
(
	dcup_id 
) 
) 
;

;
/****** Object:  Table PedidoCompra    Script Date: 07/30/2012 17:21:19 ******/

;

;

;
create table PedidoCompra(
	pc_id int not null,
	pc_numero int not null,
	pc_nrodoc varchar(50) not null CONSTRAINT DF_PedidoCompra_prsp_nrodoc  default (''),
	pc_descrip varchar(5000) not null CONSTRAINT DF_PedidoCompra_prsp_descrip  default (''),
	pc_fecha timestamptz not null CONSTRAINT DF_PedidoCompra_prsp_fecha  default (getdate()),
	pc_fechaentrega timestamptz not null CONSTRAINT DF_PedidoCompra_prsp_fechaentrega  default (getdate()),
	pc_neto decimal(18, 6) not null CONSTRAINT DF_PedidoCompra_prsp_neto  default (0),
	pc_ivari decimal(18, 6) not null CONSTRAINT DF_PedidoCompra_prsp_ivari  default (0),
	pc_ivarni decimal(18, 6) not null CONSTRAINT DF_PedidoCompra_prsp_ivarni  default (0),
	pc_total decimal(18, 6) not null CONSTRAINT DF_PedidoCompra_prsp_total  default (0),
	pc_subtotal decimal(18, 6) not null CONSTRAINT DF_PedidoCompra_pv_subtotal  default (0),
	pc_pendiente decimal(18, 6) not null CONSTRAINT DF_PedidoCompra_pv_pendiente  default (0),
	pc_firmado int not null CONSTRAINT DF_PedidoCompra_pv_firmado  default (0),
	us_id int not null,
	est_id int not null,
	ccos_id int null,
	suc_id int not null,
	doc_id int not null,
	doct_id int not null,
	lp_id int null,
	lgj_id int null,
	creado timestamptz not null CONSTRAINT DF_PedidoCompra_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_PedidoCompra_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_PedidoCompra PRIMARY KEY  
(
	pc_id 
),
 CONSTRAINT IX_PedidoCompra UNIQUE  
(
	pc_numero 
) 
) 
;

;
/****** Object:  Table FacturaVentaCobranza    Script Date: 07/30/2012 17:12:14 ******/

;

;
create table FacturaVentaCobranza(
	fvcobz_id int not null,
	fvcobz_importe decimal(18, 6) not null CONSTRAINT DF_FacturaVentaCobranza_fvcob_importe  default (0),
	fvcobz_importeOrigen decimal(18, 6) not null CONSTRAINT DF_FacturaVentaCobranza_fvcobz_importe1  default (0),
	fvcobz_cotizacion decimal(18, 6) not null CONSTRAINT DF_FacturaVentaCobranza_fvcobz_cotizacion  default (0),
	fv_id int not null,
	fvd_id int null,
	fvp_id int null,
	cobz_id int not null,
 CONSTRAINT PK_FacturaVentaCobranza PRIMARY KEY  
(
	fvcobz_id 
) 
) 
;
/****** Object:  Table AFIPCampo    Script Date: 07/30/2012 17:02:26 ******/

;

;

;
create table AFIPCampo(
	afcampo_id int not null,
	afcampo_nombre varchar(255) not null CONSTRAINT DF_AFIPCampo_afcampo_nombre  default (''),
	afcampo_descrip varchar(255) not null CONSTRAINT DF_AFIPCampo_afcampo_descrip  default (''),
	afcampo_formatoFecha varchar(50) not null CONSTRAINT DF_AFIPCampo_afcampo_formatoFecha  default (''),
	afcampo_tipo smallint not null,
	afcampo_posicion smallint not null,
	afcampo_relleno varchar(1) not null CONSTRAINT DF_AFIPCampo_afcampo_relleno  default (''),
	afcampo_separadorDecimal varchar(1) not null CONSTRAINT DF_AFIPCampo_afcampo_separadorDecimal  default (''),
	afcampo_cantDigitosEnteros smallint not null,
	afcampo_cantDigitosDecimales smallint not null,
	afcampo_largo smallint not null,
	afcampo_alineacion smallint not null,
	afcampo_columna varchar(100) not null,
	afreg_id int not null,
	creado timestamptz not null CONSTRAINT DF_AFIPCampo_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_AFIPCampo_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_AFIPCampo_activo  default (1),
 CONSTRAINT PK_AFIPCampo PRIMARY KEY  
(
	afcampo_id 
) 
) 
;

;
/****** Object:  Table RecuentoStockItemTMP    Script Date: 07/30/2012 17:27:33 ******/

;

;

;
create table RecuentoStockItemTMP(
	rsTMP_id int not null,
	rsiTMP_id int not null,
	rsi_id int not null,
	rsi_orden smallint not null,
	rsi_cantidad decimal(18, 6) not null CONSTRAINT DF_RecuentoStockItemTMP_rsi_cantidad  default (0),
	rsi_descrip varchar(5000) not null CONSTRAINT DF_RecuentoStockItemTMP_rsi_descrip  default (''),
	pr_id int not null,
	depl_id int not null,
	stl_id int null,
	stl_codigo varchar(50) not null CONSTRAINT DF_RecuentoStockItemTMP_stl_codigo  default (''),
 CONSTRAINT PK_RecuentoStockItemTMP PRIMARY KEY  
(
	rsiTMP_id 
) 
) 
;

;
/****** Object:  Table RecuentoStockItemSerieTMP    Script Date: 07/30/2012 17:27:31 ******/

;

;

;
create table RecuentoStockItemSerieTMP(
	rsTMP_id int not null,
	rsiTMP_id int not null,
	rsi_id int not null CONSTRAINT DF_RecuentoStockItemSerieTMP_rsi_id  default (0),
	rsisTMP_id int not null,
	rsis_orden smallint not null CONSTRAINT DF_RecuentoStockItemSerieTMP_rsis_orden  default (0),
	prns_codigo varchar(100) not null CONSTRAINT DF_RecuentoStockItemSerieTMP_prns_codigo  default (''),
	prns_descrip varchar(255) not null CONSTRAINT DF_RecuentoStockItemSerieTMP_prns_descrip  default (''),
	prns_fechavto timestamptz not null CONSTRAINT DF_RecuentoStockItemSerieTMP_prns_fechavto  default (getdate()),
	pr_id int not null,
	prns_id int not null CONSTRAINT DF_RecuentoStockItemSerieTMP_prns_id  default (0),
	pr_id_item int null,
 CONSTRAINT PK_RecuentoStockItemSerieTMP PRIMARY KEY  
(
	rsisTMP_id 
) 
) 
;

;
/****** Object:  Table ExpoPackingList    Script Date: 07/30/2012 17:10:45 ******/

;

;

;
create table ExpoPackingList(
	epklst_id int not null,
	epklst_texto varchar(5000) not null CONSTRAINT DF_ExpoPackingList_epklst_texto  default (''),
	epklst_codigo varchar(255) not null CONSTRAINT DF_ExpoPackingList_epklst_codigo  default (''),
	epklst_unidad varchar(255) not null CONSTRAINT DF_ExpoPackingList_epklst_unidad  default (''),
	epklst_posarancel varchar(255) not null CONSTRAINT DF_ExpoPackingList_epklst_posarancel  default (''),
	epklst_titulo varchar(255) not null CONSTRAINT DF_ExpoPackingList_epklst_titulo  default (''),
	pklst_id int not null CONSTRAINT DF_ExpoPackingList_pklst_id  default (0),
	idm_id int null,
	egp_id int null,
	modifico int not null,
	creado timestamptz not null CONSTRAINT DF_ExpoPackingList_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ExpoPackingList_modificado  default (getdate()),
 CONSTRAINT PK_ExpoPackingList PRIMARY KEY  
(
	epklst_id 
) 
) 
;

;
/****** Object:  Table ExpoFacturaVenta    Script Date: 07/30/2012 17:10:35 ******/

;

;

;
create table ExpoFacturaVenta(
	efv_id int not null,
	efv_texto varchar(5000) not null CONSTRAINT DF_ExpoFacturaVenta_efv_texto  default (''),
	efv_codigo varchar(255) not null CONSTRAINT DF_ExpoFacturaVenta_efv_codigo  default (''),
	efv_unidad varchar(255) not null CONSTRAINT DF_ExpoFacturaVenta_efv_unidad  default (''),
	efv_posarancel varchar(255) not null CONSTRAINT DF_ExpoFacturaVenta_efv_posarancel  default (''),
	efv_titulo varchar(255) not null CONSTRAINT DF_ExpoFacturaVenta_efv_titulo  default (''),
	fv_id int not null CONSTRAINT DF_ExpoFacturaVenta_fv_id  default (0),
	idm_id int null,
	egp_id int null,
	modifico int not null,
	creado timestamptz not null CONSTRAINT DF_ExpoFacturaVenta_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ExpoFacturaVenta_modificado  default (getdate()),
 CONSTRAINT PK_ExpoFacturaVenta PRIMARY KEY  
(
	efv_id 
) 
) 
;

;
/****** Object:  Table Leyenda    Script Date: 07/30/2012 17:15:13 ******/

;

;

;
create table Leyenda(
	ley_id int not null,
	ley_nombre varchar(100) not null,
	ley_codigo varchar(255) not null,
	ley_descrip varchar(255) not null CONSTRAINT DF_Leyenda_ley_descripcion  default (''),
	ley_texto text not null,
	idm_id int null,
	activo smallint not null CONSTRAINT DF_Leyenda_activo  default (1),
	creado timestamptz not null CONSTRAINT DF_Leyenda_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Leyenda_mofidicado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_Leyenda PRIMARY KEY  
(
	ley_id 
) 
)  
;

;
/****** Object:  Table Cobranza    Script Date: 07/30/2012 17:05:37 ******/

;

;

;
create table Cobranza(
	cobz_id int not null,
	cobz_numero int not null,
	cobz_nrodoc varchar(50) not null CONSTRAINT DF_Cobranza_cobz_nrodoc  default (''),
	cobz_descrip varchar(5000) not null CONSTRAINT DF_Cobranza_cobz_descrip  default (''),
	cobz_fecha timestamptz not null CONSTRAINT DF_Cobranza_cobz_fecha  default (getdate()),
	cobz_neto decimal(18, 6) not null CONSTRAINT DF_Cobranza_cobz_neto  default (0),
	cobz_otros decimal(18, 6) not null CONSTRAINT DF_Cobranza_cobz_otros  default (0),
	cobz_total decimal(18, 6) not null CONSTRAINT DF_Cobranza_cobz_total  default (0),
	cobz_pendiente decimal(18, 6) not null CONSTRAINT DF_Cobranza_cobz_pendiente  default (0),
	cobz_cotizacion decimal(18, 6) not null CONSTRAINT DF_Cobranza_cobz_cotizacion  default (0),
	cobz_grabarAsiento smallint not null CONSTRAINT DF_Cobranza_cobz_grabarAsiento  default (0),
	cobz_firmado int not null CONSTRAINT DF_Cobranza_fv_firmado  default (0),
	cobz_hojaruta smallint not null CONSTRAINT DF_Cobranza_cobz_hojaruta  default (0),
	est_id int not null,
	suc_id int not null,
	cli_id int not null,
	emp_id int not null,
	doc_id int not null,
	doct_id int not null,
	cob_id int null,
	ccos_id int null,
	lgj_id int null,
	as_id int null,
	mcj_id int null,
	creado timestamptz not null CONSTRAINT DF_Cobranza_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Cobranza_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null CONSTRAINT DF__Cobranza__impres__0490B3EB  default (0),
	emailenviado smallint not null default ((0)),
 CONSTRAINT PK_Cobranza PRIMARY KEY  
(
	cobz_id 
),
 CONSTRAINT IX_Cobranza UNIQUE  
(
	cobz_numero 
),
 CONSTRAINT IX_CobranzaNroDoc UNIQUE  
(
	emp_id,
	cobz_nrodoc 
) 
) 
;

;
/****** Object:  Table Informe    Script Date: 07/30/2012 17:14:45 ******/

;

;

;
create table Informe(
	inf_id int not null,
	inf_nombre varchar(255) not null,
	inf_codigo varchar(15) not null,
	inf_descrip varchar(1000) not null CONSTRAINT DF_Informe_inf_descrip  default (''),
	inf_storedprocedure varchar(50) not null,
	inf_reporte varchar(255) not null CONSTRAINT DF_Informe_inf_reporte  default (''),
	inf_presentaciondefault smallint not null CONSTRAINT DF_Informe_inf_presentaciondefault  default (1),
	inf_modulo varchar(255) not null,
	inf_tipo smallint not null CONSTRAINT DF_Informe_inf_tipo  default (1),
	inf_propietario smallint not null,
	inf_colocultas smallint not null CONSTRAINT DF_Informe_inf_colocultas  default (0),
	inf_checkbox varchar(100) not null CONSTRAINT DF_Informe_inf_checkbox  default (''),
	inf_totalesgrales smallint not null CONSTRAINT DF_Informe_inf_totalesgrales  default (0),
	inf_connstr varchar(1000) not null CONSTRAINT DF_Informe_inf_connstr  default (''),
	pre_id int null,
	creado timestamptz not null CONSTRAINT DF_Informe_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Informe_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Informe_activo  default (1),
 CONSTRAINT PK_Informe PRIMARY KEY  
(
	inf_id 
) 
) 
;

;
/****** Object:  Table Proyecto    Script Date: 07/30/2012 17:27:06 ******/

;

;

;
create table Proyecto(
	proy_id int not null,
	proy_nombre varchar(100) not null,
	proy_codigo varchar(15) not null,
	proy_descrip varchar(255) not null CONSTRAINT DF_Proyecto_proy_descrip  default (''),
	proy_desde timestamptz not null CONSTRAINT DF_Proyecto_proy_desde  default (getdate()),
	proy_hasta timestamptz not null CONSTRAINT DF_Proyecto_proy_hasta  default ('29991231'),
	proy_id_padre int null,
	proy_llevaAprobacion smallint not null CONSTRAINT DF_Proyecto_proy_llevaAprobacion  default (0),
	proy_fileSize smallint not null CONSTRAINT DF_Proyecto_proy_fileSize  default (1),
	proy_publico smallint not null CONSTRAINT DF_Proyecto_proy_publico  default (0),
	prov_id int null,
	cli_id int null,
	pr_id int null,
	ta_id int null,
	us_id_alta int not null,
	pre_id_listTarea int null,
	pre_id_editTarea int null,
	pre_id_delTarea int null,
	pre_id_addTarea int null,
	pre_id_editTareaP int null,
	pre_id_delTareaP int null,
	pre_id_listTareaD int null,
	pre_id_editTareaD int null,
	pre_id_delTareaD int null,
	pre_id_listHoraD int null,
	pre_id_listHora int null,
	pre_id_editHora int null,
	pre_id_delHora int null,
	pre_id_editHoraP int null,
	pre_id_delHoraP int null,
	pre_id_addHora int null,
	pre_id_tomarTarea int null,
	pre_id_asignarTarea int null,
	pre_id_aprobarTarea int null,
	creado timestamptz not null CONSTRAINT DF_Proyecto_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Proyecto_modificado  default (getdate()),
	modifico int not null CONSTRAINT DF_Proyecto_modifico  default (1),
	activo smallint not null CONSTRAINT DF_Proyecto_activo  default (1),
 CONSTRAINT PK_Proyecto PRIMARY KEY  
(
	proy_id 
) 
) 
;

;
/****** Object:  Table Agenda    Script Date: 07/30/2012 17:02:36 ******/

;

;

;
create table Agenda(
	agn_id int not null,
	agn_nombre varchar(255) not null,
	agn_codigo varchar(100) not null,
	agn_descrip varchar(255) not null CONSTRAINT DF_Agenda_agn_descrip  default (''),
	pre_id_agregar int null,
	pre_id_editar int null,
	pre_id_borrar int null,
	pre_id_listar int null,
	pre_id_propietario int null,
	creado timestamptz not null CONSTRAINT DF_Agenda_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Agenda_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Agenda_activo  default (1),
 CONSTRAINT PK_Agenda PRIMARY KEY  
(
	agn_id 
) 
) 
;

;
/****** Object:  Table InformeSumaries    Script Date: 07/30/2012 17:14:55 ******/

;

;

;
create table InformeSumaries(
	inf_id int not null,
	winfs_id int not null,
	winfs_nombre varchar(100) not null,
	winfs_operacion varchar(50) not null,
	creado timestamptz not null CONSTRAINT DF_InformeSumaries_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_InformeSumaries_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_InformeSumaries PRIMARY KEY  
(
	winfs_id 
) 
) 
;

;
/****** Object:  Table InformeHiperlinks    Script Date: 07/30/2012 17:14:49 ******/

;

;

;
create table InformeHiperlinks(
	inf_id int not null,
	winfh_id int not null,
	winfh_nombre varchar(255) not null,
	winfh_columna varchar(100) not null,
	winfh_url varchar(1000) not null,
	creado timestamptz not null CONSTRAINT DF_InformeHiperlinks_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_InformeHiperlinks_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_InformeHiperlinks PRIMARY KEY  
(
	winfh_id 
) 
) 
;

;
/****** Object:  Table InformeParametro    Script Date: 07/30/2012 17:14:53 ******/

;

;

;
create table InformeParametro(
	infp_id int not null,
	infp_nombre varchar(255) not null,
	infp_orden smallint not null,
	infp_tipo smallint not null,
	infp_default varchar(500) not null,
	infp_visible smallint not null,
	infp_sqlstmt varchar(2000) not null,
	inf_id int not null,
	tbl_id int null,
	creado timestamptz not null CONSTRAINT DF_InformeParametro_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_InformeParametro_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_InformeParametro PRIMARY KEY  
(
	infp_id 
) 
) 
;

;
/****** Object:  Table Reporte    Script Date: 07/30/2012 17:29:02 ******/

;

;

;
create table Reporte(
	rpt_id int not null,
	rpt_nombre varchar(255) null,
	rpt_descrip varchar(1000) not null,
	inf_id int not null,
	us_id int null,
	modificado timestamptz not null CONSTRAINT DF_Reporte_modificado  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_Reporte_creado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Reporte_activo  default (1),
 CONSTRAINT PK_Reporte PRIMARY KEY  
(
	rpt_id 
) 
) 
;

;
/****** Object:  Table FacturaCompraOrdenPago    Script Date: 07/30/2012 17:11:29 ******/

;

;
create table FacturaCompraOrdenPago(
	fcopg_id int not null,
	fcopg_importe decimal(18, 6) not null CONSTRAINT DF_FacturaCompraOrdenPago_fcopg_importe  default (0),
	fcopg_importeOrigen decimal(18, 6) not null CONSTRAINT DF_FacturaCompraOrdenPago_fcopg_importeOrigen  default (0),
	fcopg_cotizacion decimal(18, 6) not null CONSTRAINT DF_FacturaCompraOrdenPago_fcopg_cotizacion  default (0),
	fc_id int not null,
	fcd_id int null,
	fcp_id int null,
	opg_id int not null,
 CONSTRAINT PK_FacturaCompraOrdenPago PRIMARY KEY  
(
	fcopg_id 
) 
) 
;
/****** Object:  Table FacturaCompraNotaCredito    Script Date: 07/30/2012 17:11:25 ******/

;

;
create table FacturaCompraNotaCredito(
	fcnc_id int not null,
	fcnc_importe decimal(18, 6) not null CONSTRAINT DF_FacturaCompraNotaCredito_fcnc_importe  default (0),
	fc_id_factura int not null,
	fc_id_notacredito int not null,
	fcd_id_factura int null,
	fcp_id_factura int null,
	fcd_id_notacredito int null,
	fcp_id_notacredito int null,
 CONSTRAINT PK_FacturaCompraNotaCredito PRIMARY KEY  
(
	fcnc_id 
) 
) 
;
/****** Object:  Table ImportacionItem    Script Date: 07/30/2012 17:14:02 ******/

;

;

;
create table ImportacionItem(
	imp_id int not null,
	impi_id int not null,
	impi_campoOrigen varchar(255) not null,
	impi_campoDestino varchar(255) not null,
	impi_default varchar(255) not null CONSTRAINT DF_ImportacionItem_impi_default  default (''),
	modificado timestamptz not null CONSTRAINT DF_ImportacionItem_modificado  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_ImportacionItem_creado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ImportacionItem PRIMARY KEY  
(
	impi_id 
) 
) 
;

;
/****** Object:  Table FacturaVentaNotaCredito    Script Date: 07/30/2012 17:12:37 ******/

;

;
create table FacturaVentaNotaCredito(
	fvnc_id int not null,
	fvnc_importe decimal(18, 6) not null CONSTRAINT DF_FacturaVentaNotaCredito_fvnc_importe  default (0),
	fv_id_factura int not null,
	fv_id_notacredito int not null,
	fvd_id_factura int null,
	fvp_id_factura int null,
	fvd_id_notacredito int null,
	fvp_id_notacredito int null,
 CONSTRAINT PK_FacturaVentaNotaCredito PRIMARY KEY  
(
	fvnc_id 
) 
) 
;
/****** Object:  Table FacturaVentaPercepcion    Script Date: 07/30/2012 17:12:43 ******/

;

;

;
create table FacturaVentaPercepcion(
	fv_id int not null,
	fvperc_id int not null,
	fvperc_orden smallint not null CONSTRAINT DF_FacturaVentaPercepcion_fvperc_orden  default (0),
	fvperc_base decimal(18, 6) not null CONSTRAINT DF_FacturaVentaPercepcion_fvperc_base  default (0),
	fvperc_porcentaje decimal(18, 6) not null CONSTRAINT DF_FacturaVentaPercepcion_fvperc_porcentaje  default (0),
	fvperc_importe decimal(18, 6) not null CONSTRAINT DF_FacturaVentaPercepcion_fvperc_importe  default (0),
	fvperc_origen decimal(18, 6) not null CONSTRAINT DF_FacturaVentaPercepcion_fvperc_origen  default (0),
	fvperc_descrip varchar(255) not null CONSTRAINT DF_FacturaVentaPercepcion_fvperc_descrip  default (''),
	perc_id int not null,
	ccos_id int null
) 
;

;
/****** Object:  Table HojaRuta    Script Date: 07/30/2012 17:13:37 ******/

;

;

;
create table HojaRuta(
	hr_id int not null,
	hr_numero int not null CONSTRAINT DF_HojaRuta_hr_numero  default (0),
	hr_nrodoc varchar(50) not null CONSTRAINT DF_HojaRuta_pv_nrodoc  default (''),
	hr_descrip varchar(5000) not null CONSTRAINT DF_HojaRuta_pv_descrip  default (''),
	hr_fecha timestamptz not null CONSTRAINT DF_HojaRuta_pv_fecha  default (getdate()),
	hr_fechaentrega timestamptz not null CONSTRAINT DF_HojaRuta_pv_fechaentrega  default (getdate()),
	hr_neto decimal(18, 6) not null CONSTRAINT DF_HojaRuta_pv_neto  default (0),
	hr_ivari decimal(18, 6) not null CONSTRAINT DF_HojaRuta_pv_ivari  default (0),
	hr_subtotal decimal(18, 6) not null CONSTRAINT DF_HojaRuta_pv_subtotal  default (0),
	hr_total decimal(18, 6) not null CONSTRAINT DF_HojaRuta_pv_total  default (0),
	hr_pendiente decimal(18, 6) not null CONSTRAINT DF_HojaRuta_pv_pendiente  default (0),
	hr_firmado int not null CONSTRAINT DF_HojaRuta_pv_firmado  default (0),
	hr_recibidoefectivo decimal(18, 6) not null CONSTRAINT DF_HojaRuta_hr_recibidoefectivo  default (0),
	hr_recibidocheque decimal(18, 6) not null CONSTRAINT DF_HojaRuta_hr_recibidocheque  default (0),
	hr_recibidocantcheque smallint not null CONSTRAINT DF_HojaRuta_hr_recibidocantcheque  default (0),
	hr_recibidodescrip varchar(1000) not null CONSTRAINT DF_HojaRuta_hr_recibidodescrip  default (''),
	hr_cumplida smallint not null CONSTRAINT DF_HojaRuta_hr_cumplida  default (0),
	hr_faltante decimal(18, 6) not null CONSTRAINT DF_HojaRuta_hr_faltante  default (0),
	hr_sobrante decimal(18, 6) not null CONSTRAINT DF_HojaRuta_hr_sobrante  default (0),
	hr_porctickets decimal(18, 6) not null CONSTRAINT DF_HojaRuta_hr_porctickets  default (0),
	est_id int not null,
	suc_id int not null,
	chof_id int null,
	cam_id int null,
	cam_id_semi int null,
	prs_id int null,
	fv_id_faltante int null,
	mf_id_sobrante int null,
	mf_id_tickets int null,
	creado timestamptz not null CONSTRAINT DF_HojaRuta_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_HojaRuta_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null CONSTRAINT DF_HojaRuta_impreso  default (0),
 CONSTRAINT PK_HojaRuta PRIMARY KEY  
(
	hr_id 
) 
) 
;

;
/****** Object:  Table FacturaVentaPago    Script Date: 07/30/2012 17:12:41 ******/

;

;
create table FacturaVentaPago(
	fvp_id int not null,
	fvp_fecha timestamptz not null,
	fvp_importe decimal(18, 6) not null CONSTRAINT DF_FacturaVentaPago_fvp_importe  default (0),
	fv_id int not null,
 CONSTRAINT PK_FacturaVentaPago PRIMARY KEY  
(
	fvp_id 
) 
) 
;
/****** Object:  Table FacturaVentaDeuda    Script Date: 07/30/2012 17:12:18 ******/

;

;
create table FacturaVentaDeuda(
	fvd_id int not null,
	fvd_fecha timestamptz not null,
	fvd_fecha2 timestamptz not null CONSTRAINT DF_FacturaVentaDeuda_fvd_fecha2  default (getdate()),
	fvd_importe decimal(18, 6) not null CONSTRAINT DF_FacturaVentaDeuda_fvd_importe  default (0),
	fvd_pendiente decimal(18, 6) not null CONSTRAINT DF_FacturaVentaDeuda_fvd_pendiente  default (0),
	fv_id int not null,
 CONSTRAINT PK_FacturaVentaDeuda PRIMARY KEY  
(
	fvd_id 
) 
) 
;
/****** Object:  Table FacturaVentaCajero    Script Date: 07/30/2012 17:12:11 ******/

;

;
create table FacturaVentaCajero(
	fvcj_id int not null,
	fv_id int not null,
	fvcj_ctacte smallint not null CONSTRAINT DF_FacturaVentaCajero_fvcj_ctacte  default (0),
	cj_id int not null,
 CONSTRAINT PK_FacturaVentaCajero PRIMARY KEY  
(
	fvcj_id 
) 
) 
;
/****** Object:  Table CursoClase    Script Date: 07/30/2012 17:07:47 ******/

;

;
create table CursoClase(
	cur_id int not null,
	curc_id int not null,
	curc_fecha timestamptz not null,
	curc_desde timestamptz not null CONSTRAINT DF_CursoClase_curc_desde  default ('19000101'),
	curc_hasta timestamptz not null CONSTRAINT DF_CursoClase_curc_hasta  default ('19000101'),
	curc_horas timestamptz not null CONSTRAINT DF_CursoClase_curc_horas  default ('19000101'),
	aula_id int null,
 CONSTRAINT PK_CursoClase PRIMARY KEY  
(
	curc_id 
) 
) 
;
/****** Object:  Table CursoExamen    Script Date: 07/30/2012 17:07:48 ******/

;

;
create table CursoExamen(
	cur_id int not null,
	cure_id int not null,
	cure_fecha timestamptz not null,
	cure_desde timestamptz not null CONSTRAINT DF_CursoExamen_cure_desde  default ('19000101'),
	cure_hasta timestamptz not null CONSTRAINT DF_CursoExamen_cure_hasta  default ('19000101'),
	cure_horas timestamptz not null CONSTRAINT DF_CursoExamen_cure_horas  default ('19000101'),
	aula_id int null,
 CONSTRAINT PK_CursoExamen PRIMARY KEY  
(
	cure_id 
) 
) 
;
/****** Object:  Table Embalaje    Script Date: 07/30/2012 17:09:22 ******/

;

;

;
create table Embalaje(
	embl_id int not null,
	embl_nombre varchar(255) not null,
	embl_codigo varchar(50) not null,
	embl_descrip varchar(255) not null CONSTRAINT DF_Embalaje_embl_descrip  default (''),
	embl_capacidad decimal(18, 6) not null CONSTRAINT DF_Embalaje_embl_capacidad  default (0),
	embl_alto decimal(18, 6) not null CONSTRAINT DF_Embalaje_embl_alto  default (0),
	embl_ancho decimal(18, 6) not null CONSTRAINT DF_Embalaje_embl_ancho  default (0),
	embl_largo decimal(18, 6) not null CONSTRAINT DF_Embalaje_embl_largo  default (0),
	embl_tara decimal(18, 6) not null CONSTRAINT DF_Embalaje_embl_tara  default (0),
	un_id int null,
	pr_id_stock int null,
	creado timestamptz not null CONSTRAINT DF_Embalaje_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Embalaje_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Embalaje_activo  default (1),
 CONSTRAINT PK_Embalaje PRIMARY KEY  
(
	embl_id 
) 
) 
;

;
/****** Object:  Table Usuario    Script Date: 07/30/2012 17:32:00 ******/

;

;

;
create table Usuario(
	us_id int not null,
	us_nombre varchar(50) not null,
	us_clave varchar(16) not null CONSTRAINT DF_Usuario_us_clave  default (''),
	us_descrip varchar(255) not null CONSTRAINT DF_Usuario_us_descrip  default (''),
	us_externo smallint not null CONSTRAINT DF_Usuario_us_externo  default (0),
	us_empresaEx smallint not null CONSTRAINT DF_Usuario_us_empresaEx  default (0),
	us_empxdpto smallint not null CONSTRAINT DF_Usuario_us_empxdpto  default (0),
	us_deposito smallint not null CONSTRAINT DF_Usuario_us_deposito  default (0),
	modificado timestamptz not null CONSTRAINT DF_Usuario_modificado  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_Usuario_creado  default (getdate()),
	activo smallint not null CONSTRAINT DF_Usuario_activo  default (1),
	modifico int not null CONSTRAINT DF_Usuario_us_id_usuario  default (1),
	prs_id int null,
	suc_id int null,
 CONSTRAINT PK_Usuarios PRIMARY KEY  
(
	us_id 
) 
) 
;

;
/****** Object:  Table PickingList    Script Date: 07/30/2012 17:23:14 ******/

;

;

;
create table PickingList(
	pkl_id int not null,
	pkl_numero int not null CONSTRAINT DF_PickingList_pkl_numero  default (0),
	pkl_nrodoc varchar(50) not null CONSTRAINT DF_PickingList_pv_nrodoc  default (''),
	pkl_descrip varchar(5000) not null CONSTRAINT DF_PickingList_pv_descrip  default (''),
	pkl_fecha timestamptz not null CONSTRAINT DF_PickingList_pv_fecha  default (getdate()),
	pkl_fechaentrega timestamptz not null CONSTRAINT DF_PickingList_pv_fechaentrega  default (getdate()),
	pkl_neto decimal(18, 6) not null CONSTRAINT DF_PickingList_pv_neto  default (0),
	pkl_ivari decimal(18, 6) not null CONSTRAINT DF_PickingList_pv_ivari  default (0),
	pkl_subtotal decimal(18, 6) not null CONSTRAINT DF_PickingList_pv_subtotal  default (0),
	pkl_total decimal(18, 6) not null CONSTRAINT DF_PickingList_pv_total  default (0),
	pkl_pendiente decimal(18, 6) not null CONSTRAINT DF_PickingList_pv_pendiente  default (0),
	pkl_firmado int not null CONSTRAINT DF_PickingList_pv_firmado  default (0),
	pkl_recibidodescrip varchar(1000) not null CONSTRAINT DF_PickingList_pkl_recibidodescrip  default (''),
	pkl_cumplido smallint not null CONSTRAINT DF_PickingList_pkl_cumplido  default (0),
	pkl_fechadesde timestamptz not null CONSTRAINT DF_PickingList_pkl_fechadesde  default (getdate()),
	pkl_fechahasta timestamptz not null CONSTRAINT DF_PickingList_pkl_fechahasta  default (getdate()),
	ven_id varchar(50) not null CONSTRAINT DF_PickingList_ven_id  default (''),
	zon_id varchar(50) not null CONSTRAINT DF_PickingList_zon_id  default (''),
	est_id int not null,
	suc_id int not null,
	creado timestamptz not null CONSTRAINT DF_PickingList_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_PickingList_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null CONSTRAINT DF_PickingList_impreso  default (0),
 CONSTRAINT PK_PickingList PRIMARY KEY  
(
	pkl_id 
) 
) 
;

;
/****** Object:  Table ProductoSerieKit    Script Date: 07/30/2012 17:26:21 ******/

;

;
create table ProductoSerieKit(
	ppki_id int not null,
	prsk_id int not null,
	pr_id int not null,
	prns_id int not null,
	prfk_id int not null,
	stl_id int null,
	ppki_id_desarme int null,
	creado timestamptz not null CONSTRAINT DF_ProductoSerieKit_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ProductoSerieKit_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ProductoSerieKit PRIMARY KEY  
(
	prsk_id 
) 
) 
;
/****** Object:  Table OrdenServicioSerie    Script Date: 07/30/2012 17:19:25 ******/

;

;

;
create table OrdenServicioSerie(
	os_id int not null,
	oss_id int not null,
	oss_valor varchar(50) not null,
	prns_id int not null,
	edi_id int not null,
 CONSTRAINT PK_OrdenServicioSerie PRIMARY KEY  
(
	oss_id 
) 
) 
;

;
/****** Object:  Table ProductoSerieKitItem    Script Date: 07/30/2012 17:26:24 ******/

;

;
create table ProductoSerieKitItem(
	prsk_id int not null,
	prski_id int not null,
	prski_cantidad decimal(18, 6) not null CONSTRAINT DF_ProductoSerieKitItem_prskiTMP_cantidad  default (0),
	prk_id int not null,
	pr_id int not null,
	prns_id int null,
	stl_id int null,
 CONSTRAINT PK_ProductoSerieKitItem PRIMARY KEY  
(
	prski_id 
) 
) 
;
/****** Object:  Table ParteReparacionItem    Script Date: 07/30/2012 17:20:57 ******/

;

;

;
create table ParteReparacionItem(
	prp_id int not null,
	prpi_id int not null,
	prpi_orden smallint not null,
	prpi_cantidad decimal(18, 6) not null CONSTRAINT DF_ParteReparacionItem_prpi_cantidad  default (0),
	prpi_descrip varchar(5000) not null CONSTRAINT DF_ParteReparacionItem_prpi_descrip  default (''),
	prpi_precio decimal(18, 6) not null CONSTRAINT DF_ParteReparacionItem_prpi_precio  default (0),
	prpi_precioUsr decimal(18, 6) not null CONSTRAINT DF_ParteReparacionItem_prpi_precioUsr  default (0),
	prpi_precioLista decimal(18, 6) not null CONSTRAINT DF_ParteReparacionItem_prpi_precioLista  default (0),
	prpi_descuento varchar(100) not null CONSTRAINT DF_ParteReparacionItem_prpi_descuento  default (''),
	prpi_neto decimal(18, 6) not null CONSTRAINT DF_ParteReparacionItem_prpi_neto  default (0),
	prpi_ivari decimal(18, 6) not null CONSTRAINT DF_ParteReparacionItem_prpi_ivari  default (0),
	prpi_ivarni decimal(18, 6) not null CONSTRAINT DF_ParteReparacionItem_prpi_ivarni  default (0),
	prpi_ivariporc decimal(18, 6) not null CONSTRAINT DF_ParteReparacionItem_prpi_ivariporc  default (0),
	prpi_ivarniporc decimal(18, 6) not null CONSTRAINT DF_ParteReparacionItem_prpi_ivarniporc  default (0),
	prpi_importe decimal(18, 6) not null CONSTRAINT DF_ParteReparacionItem_prpi_importe  default (0),
	pr_id int not null,
	ccos_id int null,
	stl_id int null,
 CONSTRAINT PK_ParteReparacionItem PRIMARY KEY  
(
	prpi_id 
) 
) 
;

;
/****** Object:  Table ComunidadInternetVenta    Script Date: 07/30/2012 17:06:45 ******/

;

;

;
create table ComunidadInternetVenta(
	cmiv_id int not null,
	cmiv_ventaid varchar(255) not null CONSTRAINT DF_ComunidadInternetVenta_cmiv_vantaid  default (''),
	cmiv_nick varchar(255) not null CONSTRAINT DF_ComunidadInternetVenta_cmiv_nick  default (''),
	cmiv_nombre varchar(255) not null CONSTRAINT DF_ComunidadInternetVenta_cmiv_nombre  default (''),
	cmiv_apellido varchar(255) not null CONSTRAINT DF_ComunidadInternetVenta_cmiv_apellido  default (''),
	cmiv_articulo varchar(1000) not null CONSTRAINT DF_ComunidadInternetVenta_cmic_articulo  default (''),
	cmiv_articuloId varchar(50) not null CONSTRAINT DF_ComunidadInternetVenta_cmiv_articuloId  default (''),
	cmiv_preciostr varchar(50) not null,
	cmiv_cantidadstr varchar(50) not null,
	cmiv_precio decimal(18, 6) not null CONSTRAINT DF_ComunidadInternetVenta_cmiv_precio  default (0),
	cmiv_cantidad decimal(18, 6) not null CONSTRAINT DF_ComunidadInternetVenta_cmiv_cantidad  default (0),
	cmiv_email varchar(255) not null CONSTRAINT DF_ComunidadInternetVenta_cmiv_email  default (''),
	cmiv_telefono varchar(255) not null CONSTRAINT DF_ComunidadInternetVenta_cmiv_telefono  default (''),
	cmiv_localidad varchar(255) not null CONSTRAINT DF_ComunidadInternetVenta_cmiv_localidad  default (''),
	cmiv_provincia varchar(255) not null CONSTRAINT DF_ComunidadInternetVenta_cmiv_provincia  default (''),
	cmiv_fecha timestamptz not null CONSTRAINT DF_ComunidadInternetVenta_cmiv_fecha  default ('19000101'),
	cmi_id int not null,
	cli_id int null,
	pr_id int null,
	pv_id int null,
	cmie_id int null,
	creado timestamptz not null CONSTRAINT DF_ComunidadInternetVenta_creado  default (getdate()),
 CONSTRAINT PK_ComunidadInternetVenta PRIMARY KEY  
(
	cmiv_id 
) 
) 
;

;
/****** Object:  Table ComunidadInternetMailItem    Script Date: 07/30/2012 17:06:22 ******/

;

;

;
create table ComunidadInternetMailItem(
	cmiei_id int not null,
	cmiei_valor varchar(5000) not null,
	cmiei_valorhtml varchar(5000) not null,
	cmiei_texto varchar(1000) not null,
	cmiti_id int not null,
	cmie_id int not null,
 CONSTRAINT PK_ComunidadInternetMailItem PRIMARY KEY  
(
	cmiei_id 
) 
) 
;

;
/****** Object:  Table RemitoDevolucionCompra    Script Date: 07/30/2012 17:28:12 ******/

;

;
create table RemitoDevolucionCompra(
	rcdc_id int not null,
	rcdc_cantidad decimal(18, 6) not null CONSTRAINT DF_RemitoDevolucionCompra_rvrd_cantidad  default (0),
	rci_id_remito int not null,
	rci_id_devolucion int not null,
 CONSTRAINT PK_RemitoDevolucionCompra PRIMARY KEY  
(
	rcdc_id 
) 
) 
;
/****** Object:  Table OrdenRemitoCompra    Script Date: 07/30/2012 17:18:50 ******/

;

;
create table OrdenRemitoCompra(
	ocrc_id int not null,
	ocrc_cantidad decimal(18, 6) not null CONSTRAINT DF_OrdenRemitoCompra_ocrc_cantidad  default (0),
	oci_id int not null,
	rci_id int not null,
 CONSTRAINT PK_OrdenRemitoCompra PRIMARY KEY  
(
	ocrc_id 
) 
) 
;
/****** Object:  Table RemitoFacturaCompra    Script Date: 07/30/2012 17:28:17 ******/

;

;
create table RemitoFacturaCompra(
	rcfc_id int not null,
	rcfc_cantidad decimal(18, 6) not null CONSTRAINT DF_RemitoFacturaCompra_rcfc_cantidad  default (0),
	rci_id int not null,
	fci_id int not null,
 CONSTRAINT PK_RemitoFacturaCompra PRIMARY KEY  
(
	rcfc_id 
) 
) 
;
/****** Object:  Table PedidoVentaItemTMP    Script Date: 07/30/2012 17:22:18 ******/

;

;

;
create table PedidoVentaItemTMP(
	pvTMP_id int not null,
	pviTMP_id int not null,
	pvi_id int not null,
	pvi_orden smallint not null,
	pvi_cantidad decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItemTMP_pvi_cantidad  default (0),
	pvi_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItemTMP_pvi_cantidadaremitir  default (0),
	pvi_pendiente decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItemTMP_pvi_pendiente  default (0),
	pvi_pendientepklst decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItemTMP_pvi_pendientepklst  default (0),
	pvi_pendienteprv decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItemTMP_pvi_pendienteprv  default (0),
	pvi_descrip varchar(5000) not null CONSTRAINT DF_PedidoVentaItemTMP_pvi_descrip  default (''),
	pvi_precio decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItemTMP_pvi_precio  default (0),
	pvi_precioUsr decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItemTMP_pvi_precioUsr  default (0),
	pvi_precioLista decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItemTMP_pvi_precioLista  default (0),
	pvi_descuento varchar(100) not null CONSTRAINT DF_PedidoVentaItemTMP_pvi_descuento  default (''),
	pvi_neto decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItemTMP_pv_neto  default (0),
	pvi_ivari decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItemTMP_pvi_ivari  default (0),
	pvi_ivarni decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItemTMP_pvi_ivarni  default (0),
	pvi_ivariporc decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItemTMP_pvi_ivariporc  default (0),
	pvi_ivarniporc decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItemTMP_pvi_ivarniporc  default (0),
	pvi_importe decimal(18, 6) not null CONSTRAINT DF_PedidoVentaItemTMP_pvi_importe  default (0),
	pr_id int not null,
	ccos_id int null,
 CONSTRAINT PK_PedidoVentaItemTMP PRIMARY KEY  
(
	pviTMP_id 
) 
) 
;

;
/****** Object:  Table PedidoVentaItemBorradoTMP    Script Date: 07/30/2012 17:22:11 ******/

;

;
create table PedidoVentaItemBorradoTMP(
	pvTMP_id int not null,
	pvibTMP_id int not null,
	pv_id int not null,
	pvi_id int not null,
 CONSTRAINT PK_PedidoVentaItemBorradoTMP PRIMARY KEY  
(
	pvibTMP_id 
) 
) 
;
/****** Object:  Table Hoja    Script Date: 07/30/2012 17:13:30 ******/

;

;
create table Hoja(
	hoja_id int not null,
	id int not null,
	modificado timestamptz not null CONSTRAINT DF_Hoja_modificado  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_Hoja_creado  default (getdate()),
	modifico int not null,
	ram_id int not null,
	arb_id int not null,
 CONSTRAINT PK_Hoja PRIMARY KEY  
(
	hoja_id,
	ram_id 
) 
) 
;
/****** Object:  Table Rama    Script Date: 07/30/2012 17:27:19 ******/

;

;

;
create table Rama(
	arb_id int not null,
	ram_id int not null,
	ram_nombre varchar(255) not null,
	ram_id_padre int not null CONSTRAINT DF_Rama_ram_id_Padre  default (0),
	ram_orden smallint not null CONSTRAINT DF_Rama_ram_orden  default (0),
	modificado timestamptz not null CONSTRAINT DF_Rama_modificado  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_Rama_creado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_Rama PRIMARY KEY  
(
	ram_id 
) 
) 
;

;
/****** Object:  Table PosicionArancel    Script Date: 07/30/2012 17:23:20 ******/

;

;

;
create table PosicionArancel(
	poar_id int not null,
	poar_nombre varchar(255) not null,
	poar_codigo varchar(15) not null,
	poar_descrip varchar(255) not null CONSTRAINT DF_PosicionArancel_poar_descrip  default (''),
	ti_id_estadistica int not null,
	ti_id_derechos int not null,
	creado timestamptz not null CONSTRAINT DF_PosicionArancel_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_PosicionArancel_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_PosicionArancel_activo  default (1),
 CONSTRAINT PK_PosicionArancel PRIMARY KEY  
(
	poar_id 
) 
) 
;

;
/****** Object:  Table PresupuestoCompraItem    Script Date: 07/30/2012 17:23:37 ******/

;

;

;
create table PresupuestoCompraItem(
	prc_id int not null,
	prci_id int not null,
	prci_orden smallint not null,
	prci_cantidad decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItem_prci_cantidad  default (0),
	prci_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItem_prci_cantidadaremitir  default (0),
	prci_pendiente decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItem_prci_pendiente  default (0),
	prci_descrip varchar(5000) not null CONSTRAINT DF_PresupuestoCompraItem_prci_descrip  default (''),
	prci_precio decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItem_prci_precio  default (0),
	prci_precioUsr decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItem_prci_precioUsr  default (0),
	prci_precioLista decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItem_prci_precioLista  default (0),
	prci_descuento varchar(100) not null CONSTRAINT DF_PresupuestoCompraItem_prci_descuento  default (''),
	prci_neto decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItem_prc_neto  default (0),
	prci_ivari decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItem_prci_ivari  default (0),
	prci_ivarni decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItem_prci_ivarni  default (0),
	prci_ivariporc decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItem_prci_ivariporc  default (0),
	prci_ivarniporc decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItem_prci_ivarniporc  default (0),
	prci_importe decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItem_prci_importe  default (0),
	pr_id int not null,
	ccos_id int null,
 CONSTRAINT PK_PresupuestoCompraItem PRIMARY KEY  
(
	prci_id 
) 
) 
;

;
/****** Object:  Table Percepcion    Script Date: 07/30/2012 17:22:29 ******/

;

;

;
create table Percepcion(
	perct_id int not null,
	perc_id int not null,
	perc_nombre varchar(100) not null CONSTRAINT DF_Percepciones_perc_nombre  default (''),
	perc_codigo varchar(15) not null CONSTRAINT DF_Percepciones_perc_alias  default (''),
	perc_importeminimo decimal(18, 6) not null CONSTRAINT DF_Percepcion_perc_importeminimo  default (0),
	perc_regimensicore varchar(50) not null CONSTRAINT DF_Percepcion_perc_regimensicore  default (''),
	perc_descrip varchar(255) not null CONSTRAINT DF_Percepcion_perc_descrip  default (''),
	perc_esiibb smallint not null CONSTRAINT DF_Percepcion_perc_esiibb  default (0),
	ta_id int null,
	creado timestamptz not null CONSTRAINT DF_Percepciones_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Percepciones_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Percepcion_activo  default (0),
 CONSTRAINT PK_Percepciones PRIMARY KEY  
(
	perc_id 
) 
) 
;

;
/****** Object:  Table webArticuloUsuario    Script Date: 07/30/2012 17:32:20 ******/

;

;
create table webArticuloUsuario(
	wartus_id int not null,
	us_id int not null,
	wart_id int not null,
 CONSTRAINT PK_webArticuloUsuario PRIMARY KEY  
(
	wartus_id 
) 
) 
;
/****** Object:  Table CotizacionPresupuestoCompra    Script Date: 07/30/2012 17:07:30 ******/

;

;
create table CotizacionPresupuestoCompra(
	cotprc_id int not null,
	cotprc_cantidad decimal(18, 6) not null CONSTRAINT DF_CotizacionPresupuestoCompra_cotprc_cantidad  default (0),
	coti_id int not null,
	prci_id int not null,
 CONSTRAINT PK_CotizacionPresupuestoCompra PRIMARY KEY  
(
	cotprc_id 
) 
) 
;
/****** Object:  Table PresupuestoDevolucionCompra    Script Date: 07/30/2012 17:23:50 ******/

;

;
create table PresupuestoDevolucionCompra(
	prcdc_id int not null,
	prcdc_cantidad decimal(18, 6) not null CONSTRAINT DF_PresupuestoDevolucionCompra_prvdv_cantidad  default (0),
	prci_id_Presupuesto int not null,
	prci_id_devolucion int not null,
 CONSTRAINT PK_PresupuestoDevolucionCompra PRIMARY KEY  
(
	prcdc_id 
) 
) 
;
/****** Object:  Table PresupuestoCompraItemTMP    Script Date: 07/30/2012 17:23:43 ******/

;

;

;
create table PresupuestoCompraItemTMP(
	prcTMP_id int not null,
	prciTMP_id int not null,
	prci_id int not null,
	prci_orden smallint not null,
	prci_cantidad decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItemTMP_prci_cantidad  default (0),
	prci_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItemTMP_prci_cantidadaremitir  default (0),
	prci_pendiente decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItemTMP_prci_pendiente  default (0),
	prci_descrip varchar(5000) not null CONSTRAINT DF_PresupuestoCompraItemTMP_prci_descrip  default (''),
	prci_precio decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItemTMP_prci_precio  default (0),
	prci_precioUsr decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItemTMP_prci_precioUsr  default (0),
	prci_precioLista decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItemTMP_prci_precioLista  default (0),
	prci_descuento varchar(100) not null CONSTRAINT DF_PresupuestoCompraItemTMP_prci_descuento  default (''),
	prci_neto decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItemTMP_prc_neto  default (0),
	prci_ivari decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItemTMP_prci_ivari  default (0),
	prci_ivarni decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItemTMP_prci_ivarni  default (0),
	prci_ivariporc decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItemTMP_prci_ivariporc  default (0),
	prci_ivarniporc decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItemTMP_prci_ivarniporc  default (0),
	prci_importe decimal(18, 6) not null CONSTRAINT DF_PresupuestoCompraItemTMP_prci_importe  default (0),
	pr_id int not null,
	ccos_id int null,
 CONSTRAINT PK_PresupuestoCompraItemTMP PRIMARY KEY  
(
	prciTMP_id 
) 
) 
;

;
/****** Object:  Table PresupuestoCompraItemBorradoTMP    Script Date: 07/30/2012 17:23:38 ******/

;

;
create table PresupuestoCompraItemBorradoTMP(
	prcTMP_id int not null,
	prcibTMP_id int not null,
	prc_id int not null,
	prci_id int not null,
 CONSTRAINT PK_PresupuestoCompraItemBorradoTMP PRIMARY KEY  
(
	prcibTMP_id 
) 
) 
;
/****** Object:  Table PresupuestoDevolucionCompraTMP    Script Date: 07/30/2012 17:23:51 ******/

;

;
create table PresupuestoDevolucionCompraTMP(
	prcTMP_id int not null,
	prcdcTMP_id int not null,
	prcdc_id int not null,
	prcdc_cantidad decimal(18, 6) not null CONSTRAINT DF_PresupuestoDevolucionCompraTMP_prvdv_cantidad  default (0),
	prci_id_Presupuesto int not null,
	prci_id_devolucion int not null,
 CONSTRAINT PK_PresupuestoDevolucionCompraTMP PRIMARY KEY  
(
	prcdcTMP_id 
) 
) 
;
/****** Object:  Table ComunidadInternetProducto    Script Date: 07/30/2012 17:06:28 ******/

;

;

;
create table ComunidadInternetProducto(
	cmi_id int not null,
	cmipr_id int not null,
	cmipr_codigo varchar(255) not null CONSTRAINT DF_ComunidadInternetProducto_cmipr_codigo  default (''),
	cmipr_nombre varchar(1000) not null CONSTRAINT DF_ComunidadInternetProducto_cmipr_nombre  default (''),
	cmipr_disponible varchar(50) not null CONSTRAINT DF_ComunidadInternetProducto_cmipr_disponible  default (''),
	cmipr_finaliza varchar(50) not null CONSTRAINT DF_ComunidadInternetProducto_cmipr_finaliza  default (''),
	cmipr_ofertas varchar(50) not null CONSTRAINT DF_ComunidadInternetProducto_cmipr_ofertas  default (''),
	cmipr_visitas varchar(50) not null CONSTRAINT DF_ComunidadInternetProducto_cmipr_visitas  default (''),
	cmipr_ventas varchar(50) not null CONSTRAINT DF_ComunidadInternetProducto_cmipr_ventas  default (''),
	cmipr_reposicion decimal(18, 6) not null CONSTRAINT DF_ComunidadInternetProducto_cmipr_reposicion  default (0),
	pr_id int null,
	creado timestamptz not null CONSTRAINT DF__Comunidad__cread__4D647345  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF__Comunidad__modif__4E58977E  default (getdate()),
 CONSTRAINT PK_ComunidadInternetProducto PRIMARY KEY  
(
	cmipr_id 
) 
) 
;

;
/****** Object:  Table ProductoComunidadInternet    Script Date: 07/30/2012 17:25:43 ******/

;

;

;
create table ProductoComunidadInternet(
	pr_id int not null,
	cmi_id int not null,
	prcmi_id int not null,
	prcmi_codigo varchar(255) not null,
	prcmi_descrip varchar(1000) not null CONSTRAINT DF_ProductoComunidadInternet_prcmi_descrip  default (''),
	prcmi_fechaalta timestamptz not null CONSTRAINT DF_ProductoComunidadInternet_prcmi_fechaalta  default ('19000101'),
	prcmi_fechavto timestamptz not null CONSTRAINT DF_ProductoComunidadInternet_prcmi_fechavto  default ('19000101'),
	prcmi_precio decimal(18, 6) not null CONSTRAINT DF_ProductoComunidadInternet_prcmi_precio  default (0),
	creado timestamptz not null CONSTRAINT DF_ProductoComunidadInternet_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ProductoComunidadInternet_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ProductoComunidadInternet PRIMARY KEY  
(
	prcmi_id 
) 
) 
;

;
/****** Object:  Table ComunidadInternetCobro    Script Date: 07/30/2012 17:06:14 ******/

;

;

;
create table ComunidadInternetCobro(
	cmic_id int not null,
	cmic_cobroid varchar(50) not null CONSTRAINT DF_ComunidadInternetCobro_cmic_cobroid  default (''),
	cmic_nick varchar(255) not null CONSTRAINT DF_ComunidadInternetCobro_cmic_nick  default (''),
	cmic_articulo varchar(1000) not null CONSTRAINT DF_ComunidadInternetCobro_cmic_articulo  default (''),
	cmic_articuloid varchar(255) not null CONSTRAINT DF_ComunidadInternetCobro_cmic_codigoarticulo  default (''),
	cmic_estado varchar(255) not null CONSTRAINT DF_ComunidadInternetCobro_cmic_estado  default (''),
	cmic_cobrado varchar(50) not null CONSTRAINT DF_ComunidadInternetCobro_cmic_cobrado  default (''),
	cmic_fechastr varchar(50) not null CONSTRAINT DF_ComunidadInternetCobro_cmic_fechastr  default (''),
	cmic_fecha timestamptz not null CONSTRAINT DF_ComunidadInternetCobro_cmic_fecha  default ('19000101'),
	cmic_descrip varchar(5000) not null CONSTRAINT DF_ComunidadInternetCobro_cmic_descrip  default (''),
	cmi_id int not null,
	cli_id int null,
	pr_id int null,
	pv_id int null,
	creado timestamptz not null CONSTRAINT DF_ComunidadInternetCobro_creado  default (getdate()),
 CONSTRAINT PK_ComunidadInternetCobro PRIMARY KEY  
(
	cmic_id 
) 
) 
;

;
/****** Object:  Table ComunidadInternetAplicacion    Script Date: 07/30/2012 17:06:10 ******/

;

;

;
create table ComunidadInternetAplicacion(
	cmia_id int not null,
	cmia_nombre varchar(255) not null,
	cmia_codigo varchar(50) not null,
	cmia_activexobject varchar(255) not null,
	cmia_descrip varchar(5000) not null CONSTRAINT DF_ComunidadInternetAplicacion_cmia_descrip  default (''),
	cmi_id int null,
	creado timestamptz not null CONSTRAINT DF_ComunidadInternetAplicacion_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ComunidadInternetAplicacion_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_ComunidadInternetAplicacion_activo  default (1),
 CONSTRAINT PK_ComunidadInternetAplicacion PRIMARY KEY  
(
	cmia_id 
) 
) 
;

;
/****** Object:  Table LiquidacionPlantillaItem    Script Date: 07/30/2012 17:15:47 ******/

;

;
create table LiquidacionPlantillaItem(
	liqp_id int not null,
	liqpi_id int not null,
	em_id int not null,
	liqf_id int not null,
 CONSTRAINT PK_LiquidacionPlantillaItem PRIMARY KEY  
(
	liqpi_id 
) 
) 
;
/****** Object:  Table Embarque    Script Date: 07/30/2012 17:09:25 ******/

;

;

;
create table Embarque(
	emb_id int not null,
	emb_nombre varchar(255) not null,
	emb_codigo varchar(270) not null,
	emb_descrip varchar(1000) not null CONSTRAINT DF_Embarque_embq_descrip  default (''),
	emb_fecha timestamptz not null,
	barc_id int not null,
	pue_id_origen int not null,
	pue_id_destino int not null,
	creado timestamptz not null CONSTRAINT DF_Embarque_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Embarque_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Embarque_activo  default (1),
 CONSTRAINT PK_Embarque PRIMARY KEY  
(
	emb_id 
) 
) 
;

;
/****** Object:  Table TarifaItem    Script Date: 07/30/2012 17:31:21 ******/

;

;
create table TarifaItem(
	trfi_id int not null,
	trfi_minimo int not null,
	trfi_menos45 decimal(18, 6) not null CONSTRAINT DF_TarifaItem_trfi_menos45  default (0),
	trfi_mas45 decimal(18, 6) not null CONSTRAINT DF_TarifaItem_trfi_mas45  default (0),
	trfi_mas100 decimal(18, 6) not null CONSTRAINT DF_TarifaItem_trfi_mas100  default (0),
	trfi_mas300 decimal(18, 6) not null CONSTRAINT DF_TarifaItem_trfi_mas300  default (0),
	trfi_mas500 decimal(18, 6) not null CONSTRAINT DF_TarifaItem_trfi_mas500  default (0),
	trfi_mas1000 decimal(18, 6) not null CONSTRAINT DF_TarifaItem_trfi_mas1000  default (0),
	trfi_lunes smallint not null CONSTRAINT DF_TarifaItem_trfi_lunes  default (0),
	trfi_martes smallint not null CONSTRAINT DF_TarifaItem_trfi_lunes1  default (0),
	trfi_miercoles smallint not null CONSTRAINT DF_TarifaItem_trfi_lunes2  default (0),
	trfi_jueves smallint not null CONSTRAINT DF_TarifaItem_trfi_lunes3  default (0),
	trfi_viernes smallint not null CONSTRAINT DF_TarifaItem_trfi_lunes4  default (0),
	trfi_sabado smallint not null CONSTRAINT DF_TarifaItem_trfi_lunes21  default (0),
	trfi_domingo smallint not null CONSTRAINT DF_TarifaItem_trfi_lunes31  default (0),
	pue_id_destino int not null,
	pue_id_origen int not null,
	trf_id int not null,
	creado timestamptz not null CONSTRAINT DF_TarifaItem_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_TarifaItem_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_TarifaItem_activo  default (1),
 CONSTRAINT PK_TarifaItem PRIMARY KEY  
(
	trfi_id 
) 
) 
;
/****** Object:  Table FeriadoItem    Script Date: 07/30/2012 17:13:04 ******/

;

;
create table FeriadoItem(
	fe_id int not null,
	fei_id int not null,
	fei_fecha timestamptz not null,
 CONSTRAINT PK_FeriadoItem PRIMARY KEY  
(
	fei_id 
) 
) 
;
/****** Object:  Table OrdenServicioItemSerieTMP    Script Date: 07/30/2012 17:19:18 ******/

;

;

;
create table OrdenServicioItemSerieTMP(
	osTMP_id int not null,
	osiTMP_id int not null,
	osi_id int not null CONSTRAINT DF_OrdenServicioItemSerieTMP_osi_id  default (0),
	osisTMP_id int not null,
	osis_orden smallint not null CONSTRAINT DF_OrdenServicioItemSerieTMP_osis_orden  default (0),
	prns_codigo varchar(100) not null CONSTRAINT DF_OrdenServicioItemSerieTMP_prns_codigo  default (''),
	prns_codigo2 varchar(100) not null CONSTRAINT DF_OrdenServicioItemSerieTMP_prns_codigo2  default (''),
	prns_codigo3 varchar(100) not null CONSTRAINT DF_OrdenServicioItemSerieTMP_prns_codigo1  default (''),
	prns_descrip varchar(255) not null CONSTRAINT DF_OrdenServicioItemSerieTMP_prns_descrip  default (''),
	prns_fechavto timestamptz not null CONSTRAINT DF_OrdenServicioItemSerieTMP_prns_fechavto  default (getdate()),
	pr_id int not null,
	prns_id int not null CONSTRAINT DF_OrdenServicioItemSerieTMP_prns_id  default (0),
	stl_codigo varchar(50) not null CONSTRAINT DF_OrdenServicioItemSerieTMP_stl_codigo  default (''),
	stl_id int null,
 CONSTRAINT PK_OrdenServicioItemSerieTMP PRIMARY KEY  
(
	osisTMP_id 
) 
) 
;

;
/****** Object:  Table RemitoVentaItem    Script Date: 07/30/2012 17:28:40 ******/

;

;

;
create table RemitoVentaItem(
	rv_id int not null,
	rvi_id int not null,
	rvi_orden smallint not null,
	rvi_cantidad decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItem_pvi_cantidad  default (0),
	rvi_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItem_pvi_cantidadaremitir  default (0),
	rvi_pendiente decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItem_pvi_pendiente  default (0),
	rvi_pendientefac decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItem_rvi_pendientefac  default (0),
	rvi_descrip varchar(5000) not null CONSTRAINT DF_RemitoVentaItem_pvi_descrip  default (''),
	rvi_precio decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItem_pvi_precio  default (0),
	rvi_precioUsr decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItem_pvi_precioUsr  default (0),
	rvi_precioLista decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItem_pvi_precioLista  default (0),
	rvi_descuento varchar(100) not null CONSTRAINT DF_RemitoVentaItem_pvi_descuento  default (''),
	rvi_neto decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItem_pvi_neto  default (0),
	rvi_ivari decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItem_pvi_ivari  default (0),
	rvi_ivarni decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItem_pvi_ivarni  default (0),
	rvi_ivariporc decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItem_pvi_ivariporc  default (0),
	rvi_ivarniporc decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItem_pvi_ivarniporc  default (0),
	rvi_importe decimal(18, 6) not null CONSTRAINT DF_RemitoVentaItem_pvi_importe  default (0),
	rvi_importCodigo varchar(255) not null CONSTRAINT DF__RemitoVen__rvi_i__0A3085F5  default (''),
	pr_id int not null,
	ccos_id int null,
	stl_id int null,
 CONSTRAINT PK_RemitoVentaItem PRIMARY KEY  
(
	rvi_id 
) 
) 
;

;
/****** Object:  Table ImportacionTempGarantia    Script Date: 07/30/2012 17:14:17 ******/

;

;
create table ImportacionTempGarantia(
	impt_id int not null,
	imptg_id int not null,
	imptg_orden smallint not null,
	gar_id int not null,
 CONSTRAINT PK_ImportacionTempGarantia PRIMARY KEY  
(
	imptg_id 
) 
) 
;
/****** Object:  Table EquipoDetalleItem    Script Date: 07/30/2012 17:10:25 ******/

;

;

;
create table EquipoDetalleItem(
	ed_id int not null,
	edi_id int not null,
	edi_nombre varchar(255) not null,
	edi_orden smallint not null,
	edi_tipo smallint not null,
	edi_sqlstmt varchar(2000) not null,
	edi_default varchar(255) not null CONSTRAINT DF_EquipoDetalleItem_edi_default  default (''),
	tbl_id int null,
 CONSTRAINT PK_EquipoDetalleItem PRIMARY KEY  
(
	edi_id 
) 
) 
;

;
/****** Object:  Table AuditoriaItem    Script Date: 07/30/2012 17:03:35 ******/

;

;

;
create table AuditoriaItem(
	aud_id int not null,
	audi_id int not null,
	audi_descrip varchar(5000) not null CONSTRAINT DF_AuditoriaItem_audi_descrip  default (''),
	audn_id int not null,
	audg_id int null,
	doct_id int null,
	comp_id int null,
 CONSTRAINT PK_AuditoriaItem PRIMARY KEY  
(
	audi_id 
) 
) 
;

;
/****** Object:  Table webArticulo    Script Date: 07/30/2012 17:32:18 ******/

;

;

;
create table webArticulo(
	wart_id int not null,
	wartt_id int not null,
	warte_id int not null,
	wart_titulo varchar(100) not null CONSTRAINT DF_webArticulo_wart_titulo  default (''),
	wart_copete varchar(5000) not null CONSTRAINT DF_webArticulo_wart_copete  default (''),
	wart_texto text not null,
	wart_fecha timestamptz not null CONSTRAINT DF_webArticulo_wart_fecha  default (getdate()),
	wart_fechavto timestamptz not null CONSTRAINT DF_webArticulo_wart_fechavto  default (getdate()),
	wart_origen varchar(1000) not null CONSTRAINT DF_webArticulo_wart_origen  default (''),
	wart_origenurl varchar(1000) not null CONSTRAINT DF_webArticulo_wart_origenurl  default (''),
	wart_imagen varchar(1000) not null CONSTRAINT DF_webArticulo_wart_imagen  default (''),
	us_id int not null,
	creado timestamptz not null CONSTRAINT DF_webArticulo_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_webArticulo_modificado  default (getdate()),
	activo smallint not null CONSTRAINT DF_webArticulo_activo  default (1),
 CONSTRAINT PK_webArticulo PRIMARY KEY  
(
	wart_id 
) 
)  
;

;
/****** Object:  Table SindicatoConvenioCategoria    Script Date: 07/30/2012 17:29:56 ******/

;

;
create table SindicatoConvenioCategoria(
	sindcc_id int not null,
	sindcc_importe decimal(18, 6) not null,
	sindcc_tipo smallint not null,
	sindcc_horaXmes smallint not null CONSTRAINT DF_SindicatoConvenioCategoria_sindcc_horaXmes  default (0),
	sindcc_diaXmes smallint not null CONSTRAINT DF_SindicatoConvenioCategoria_sindcc_diaXmes  default (0),
	sindcc_desde timestamptz not null CONSTRAINT DF_SindicatoConvenioCategoria_sindcc_desde1  default ('19000101'),
	sindcc_hasta timestamptz not null CONSTRAINT DF_SindicatoConvenioCategoria_sindcc_desde  default ('19000101'),
	sind_id int not null,
	sindco_id int not null,
	sindca_id int not null,
 CONSTRAINT PK_SindicatoConvenioCategoria PRIMARY KEY  
(
	sindcc_id 
) 
) 
;
/****** Object:  Table ProyectoPrecio    Script Date: 07/30/2012 17:27:13 ******/

;

;
create table ProyectoPrecio(
	proy_id int not null,
	proyp_id int not null,
	proyp_precio decimal(18, 6) not null CONSTRAINT DF_ProyectoPrecio_proyp_importe  default (0),
	us_id int not null,
	pr_id int null,
	creado timestamptz not null CONSTRAINT DF_ProyectoPrecio_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ProyectoPrecio_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ProyectoPrecio PRIMARY KEY  
(
	proyp_id 
) 
) 
;
/****** Object:  Table Objetivo    Script Date: 07/30/2012 17:17:39 ******/

;

;

;
create table Objetivo(
	obje_id int not null,
	obje_nombre varchar(100) not null,
	obje_codigo varchar(15) not null,
	obje_descrip varchar(255) not null CONSTRAINT DF_Objetivo_obje_descrip  default (''),
	proy_id int not null,
	creado timestamptz not null CONSTRAINT DF_Objetivo_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Objetivo_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Objetivo_activo  default (1),
 CONSTRAINT PK_Objetivo PRIMARY KEY  
(
	obje_id 
) 
) 
;

;
/****** Object:  Table ProyectoItem    Script Date: 07/30/2012 17:27:11 ******/

;

;

;
create table ProyectoItem(
	proyi_id int not null,
	proyi_nombre varchar(100) not null,
	proyi_codigo varchar(15) not null,
	proyi_descrip varchar(255) not null CONSTRAINT DF_ProyectoItem_proyi_descrip  default (''),
	proy_id int not null,
	creado timestamptz not null CONSTRAINT DF_ProyectoItem_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ProyectoItem_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_ProyectoItem_activo  default (1),
 CONSTRAINT PK_ProyectoItem PRIMARY KEY  
(
	proyi_id 
) 
) 
;

;
/****** Object:  Table LiquidacionFormulaItem    Script Date: 07/30/2012 17:15:35 ******/

;

;

;
create table LiquidacionFormulaItem(
	liqf_id int not null,
	liqfi_id int not null,
	liqfi_nombre varchar(100) not null,
	liqfi_codigo varchar(15) not null,
	liqfi_descrip varchar(1000) not null CONSTRAINT DF_LiquidacionFormulaItem_liqfi_descrip  default (''),
	liqfi_nombrerecibo varchar(100) not null CONSTRAINT DF_LiquidacionFormulaItem_liqfi_nombrerecibo  default (''),
	liqfi_formula varchar(5000) not null CONSTRAINT DF_LiquidacionFormulaItem_liqfi_formula  default (''),
	liqct_id int not null,
 CONSTRAINT PK_LiquidacionFormulaItem PRIMARY KEY  
(
	liqfi_id 
) 
) 
;

;
/****** Object:  Table CatalogoWebCategoriaItem    Script Date: 07/30/2012 17:04:23 ******/

;

;
create table CatalogoWebCategoriaItem(
	catwc_id int not null,
	catwci_id int not null,
	catwci_posicion smallint not null CONSTRAINT DF_CatalogoWebCategoriaItem_catwci_posicion  default (0),
	catwci_activo smallint not null CONSTRAINT DF_CatalogoWebCategoriaItem_catwci_activo  default (1),
	pr_id int not null,
	activo smallint not null CONSTRAINT DF_CatalogoWebCategoriaItem_activo  default (1),
	creado timestamptz not null CONSTRAINT DF_CatalogoWebCategoriaItem_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_CatalogoWebCategoriaItem_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_CatalogoWebCategoriaItem PRIMARY KEY  
(
	catwci_id 
) 
) 
;
/****** Object:  Table StockItemTMP    Script Date: 07/30/2012 17:30:21 ******/

;

;

;
create table StockItemTMP(
	stTMP_id int not null,
	stiTMP_id int not null,
	sti_id int not null,
	sti_orden int not null CONSTRAINT DF_StockItemTMP_sti_orden  default (0),
	sti_ingreso decimal(18, 6) not null CONSTRAINT DF_StockItemTMP_sti_ingreso  default (0),
	sti_salida decimal(18, 6) not null CONSTRAINT DF_StockItemTMP_sti_salida  default (0),
	sti_descrip varchar(255) not null CONSTRAINT DF_StockItemTMP_sti_descrip  default (''),
	sti_grupo int not null CONSTRAINT DF_StockItemTMP_sti_grupo  default (0),
	pr_id int not null,
	depl_id int not null,
	prns_descrip varchar(255) not null CONSTRAINT DF_StockItemTMP_prns_descrip  default (''),
	prns_fechavto timestamptz not null CONSTRAINT DF_StockItemTMP_prns_fechavto  default (getdate()),
	prns_id int null,
	pr_id_kit int null,
	stik_orden int not null CONSTRAINT DF_StockItemTMP_stik_orden  default (0),
	stik_cantidad int not null CONSTRAINT DF_StockItemTMP_stik_cantidad  default (0),
	stl_id int null,
 CONSTRAINT PK_StockItemTMP PRIMARY KEY  
(
	stiTMP_id 
) 
) 
;

;
--, @value=N'', @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'table',@level1name=N'StockItemTMP', @level2type=N'COLUMN',@level2name=N'sti_descrip'
;
/****** Object:  Table CatalogoWebProductoImage    Script Date: 07/30/2012 17:04:27 ******/

;

;
create table CatalogoWebProductoImage(
	catw_id int not null,
	prwi_id int not null,
 CONSTRAINT PK_CatalogoWebProductoImage PRIMARY KEY  
(
	catw_id,
	prwi_id 
) 
) 
;
/****** Object:  Table CatalogoWebProductoImageLink    Script Date: 07/30/2012 17:04:28 ******/

;

;
create table CatalogoWebProductoImageLink(
	catw_id int not null,
	prwi_id int not null,
 CONSTRAINT PK_CatalogoWebProductoImageLink PRIMARY KEY  
(
	catw_id,
	prwi_id 
) 
) 
;
/****** Object:  Table ProveedorCentroCosto    Script Date: 07/30/2012 17:26:52 ******/

;

;
create table ProveedorCentroCosto(
	provccos_id int not null,
	prov_id int not null,
	ccos_id int not null,
	pr_id int null,
 CONSTRAINT PK_ProveedorCentroCosto PRIMARY KEY  
(
	provccos_id 
) 
) 
;
/****** Object:  Table ProveedorRetencion    Script Date: 07/30/2012 17:26:56 ******/

;

;
create table ProveedorRetencion(
	prov_id int not null,
	provret_id int not null,
	ret_id int not null,
	provret_desde timestamptz not null CONSTRAINT DF_ProveedorRetencion_provret_desde  default ('19000101'),
	provret_hasta timestamptz not null CONSTRAINT DF_ProveedorRetencion_provret_hasta  default ('21000101'),
	creado timestamptz not null CONSTRAINT DF_ProveedorPercepcion_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ProveedorPercepcion_modificado  default (getdate()),
	modifico int not null,
	provret_generadoporproceso smallint not null default (0),
 CONSTRAINT PK_ProveedorRetencion PRIMARY KEY  
(
	provret_id 
) 
) 
;
/****** Object:  Table ListaPrecioProveedor    Script Date: 07/30/2012 17:16:24 ******/

;

;
create table ListaPrecioProveedor(
	lpprov_id int not null,
	lp_id int not null,
	prov_id int not null,
	creado timestamptz not null CONSTRAINT DF_ListaPrecioProveedor_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ListaPrecioProveedor_modificado  default (getdate()),
	modifico int not null,
PRIMARY KEY  
(
	lpprov_id 
) 
) 
;
/****** Object:  Table ProveedorCAI    Script Date: 07/30/2012 17:26:51 ******/

;

;

;
create table ProveedorCAI(
	provc_id int not null,
	provc_numero varchar(255) not null,
	provc_descrip varchar(255) not null CONSTRAINT DF_ProveedorCAI_provc_descrip  default (''),
	provc_fechavto timestamptz not null,
	prov_id int not null,
	provc_sucursal varchar(255) not null CONSTRAINT DF_ProveedorCAI_provc_sucursal  default (''),
	creado timestamptz not null CONSTRAINT DF_ProveedorCAI_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ProveedorCAI_modificado  default (getdate()),
	modifico int not null CONSTRAINT DF_ProveedorCAI_modifico  default (0),
	activo smallint not null CONSTRAINT DF_ProveedorCAI_activo  default (1),
 CONSTRAINT PK_ProveedorCAI PRIMARY KEY  
(
	provc_id 
) 
) 
;

;
/****** Object:  Table UsuarioEmpresa    Script Date: 07/30/2012 17:32:05 ******/

;

;
create table UsuarioEmpresa(
	usemp_id int not null,
	us_id int not null,
	prov_id int null,
	cli_id int null,
	modificado timestamptz not null CONSTRAINT DF_UsuarioEmpresa_modificado  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_UsuarioEmpresa_creado  default (getdate()),
	activo smallint not null CONSTRAINT DF_UsuarioEmpresa_activo  default (1),
	modifico int not null CONSTRAINT DF_UsuarioEmpresa_modifico  default (1),
 CONSTRAINT PK_UsuarioEmpresa PRIMARY KEY  
(
	usemp_id 
) 
) 
;
/****** Object:  Table DepartamentoProveedor    Script Date: 07/30/2012 17:07:59 ******/

;

;
create table DepartamentoProveedor(
	dptoprov_id int not null,
	prov_id int not null,
	dpto_id int not null,
 CONSTRAINT PK_DepartamentoProveedor PRIMARY KEY  
(
	dptoprov_id 
) 
) 
;
/****** Object:  Table ProductoProveedor    Script Date: 07/30/2012 17:26:19 ******/

;

;

;
create table ProductoProveedor(
	prprov_id int not null,
	prprov_fabricante smallint not null CONSTRAINT DF__productop__prpro__12BC75AC  default (0),
	prprov_nombre varchar(255) not null CONSTRAINT DF_ProductoProveedor_prprov_nombre  default (''),
	prprov_codigo varchar(50) not null CONSTRAINT DF_ProductoProveedor_prprov_codigo  default (''),
	prprov_codigobarra varchar(255) not null CONSTRAINT DF_ProductoProveedor_prprov_codigobarra  default (''),
	pr_id int not null,
	prov_id int not null,
	pa_id int null,
	creado timestamptz not null CONSTRAINT DF_ProductoProveedor_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ProductoProveedor_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_ProductoProveedor_activo  default (1),
 CONSTRAINT PK_ProductoProveedor PRIMARY KEY  
(
	prprov_id 
) 
) 
;

;
/****** Object:  Table StockItemKit    Script Date: 07/30/2012 17:30:17 ******/

;

;
create table StockItemKit(
	stik_id int not null,
	stik_cantidad int not null CONSTRAINT DF_StockItemKit_stik_cantidad  default (0),
	stik_llevanroserie smallint not null CONSTRAINT DF_StockItemKit_stik_llevanroserie  default (0),
	pr_id int not null,
	st_id int not null,
 CONSTRAINT PK_StockItemKit PRIMARY KEY  
(
	stik_id 
) 
) 
;
/****** Object:  Table RetencionItem    Script Date: 07/30/2012 17:29:30 ******/

;

;
create table RetencionItem(
	ret_id int not null,
	reti_id int not null,
	reti_importedesde decimal(18, 6) not null,
	reti_importehasta decimal(18, 6) not null,
	reti_porcentaje decimal(18, 6) not null,
	reti_importefijo decimal(18, 6) not null,
	creado timestamptz not null CONSTRAINT DF_RetencionItem_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_RetencionItem_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_RetencionItem PRIMARY KEY  
(
	reti_id 
) 
) 
;
/****** Object:  Table ListaPrecioItem    Script Date: 07/30/2012 17:16:16 ******/

;

;
create table ListaPrecioItem(
	lp_id int not null,
	lpi_id int not null,
	lpi_precio decimal(18, 6) not null CONSTRAINT DF_ListaPrecioItem_lpi_precio  default (0),
	lpi_porcentaje decimal(18, 6) not null CONSTRAINT DF_ListaPrecioItem_lpi_porcentaje  default (0),
	lpi_fecha timestamptz not null CONSTRAINT DF_ListaPrecioItem_lpi_fecha  default ('19000101'),
	lpi_preciolista decimal(18, 6) not null CONSTRAINT DF_ListaPrecioItem_lpi_preciolista  default (0),
	lpi_fechalista timestamptz not null CONSTRAINT DF_ListaPrecioItem_lpi_fechalista  default ('19000101'),
	lpi_precioh1 decimal(18, 6) not null CONSTRAINT DF_ListaPrecioItem_lpi_precioh1  default (0),
	lpi_fechah1 timestamptz not null CONSTRAINT DF_ListaPrecioItem_lpi_fechah1  default ('19000101'),
	lpi_precioh2 decimal(18, 6) not null CONSTRAINT DF_ListaPrecioItem_lpi_precioh11  default (0),
	lpi_fechah2 timestamptz not null CONSTRAINT DF_ListaPrecioItem_lpi_fechah11  default ('19000101'),
	lpi_precioh3 decimal(18, 6) not null CONSTRAINT DF_ListaPrecioItem_lpi_precioh12  default (0),
	lpi_fechah3 timestamptz not null CONSTRAINT DF_ListaPrecioItem_lpi_fechah12  default ('19000101'),
	lpi_precioh4 decimal(18, 6) not null CONSTRAINT DF_ListaPrecioItem_lpi_precioh13  default (0),
	lpi_fechah4 timestamptz not null CONSTRAINT DF_ListaPrecioItem_lpi_fechah13  default ('19000101'),
	lpi_precioh5 decimal(18, 6) not null CONSTRAINT DF_ListaPrecioItem_lpi_precioh14  default (0),
	lpi_fechah5 timestamptz not null CONSTRAINT DF_ListaPrecioItem_lpi_fechah14  default ('19000101'),
	pr_id int not null,
	lpm_id int null,
	activo smallint not null CONSTRAINT DF_ListaPrecioItem_activo  default (1),
	creado timestamptz not null CONSTRAINT DF_ListaPrecioItem_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ListaPrecioItem_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ListaPrecioItem PRIMARY KEY  
(
	lpi_id 
) 
) 
;
/****** Object:  Table ListaPrecioCliente    Script Date: 07/30/2012 17:16:09 ******/

;

;
create table ListaPrecioCliente(
	lpcli_id int not null,
	lp_id int not null,
	cli_id int not null,
	creado timestamptz not null CONSTRAINT DF_ListaPrecioCliente_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ListaPrecioCliente_modificado  default (getdate()),
	modifico int not null,
PRIMARY KEY  
(
	lpcli_id 
) 
) 
;
/****** Object:  Table ListaPrecioConfig    Script Date: 07/30/2012 17:16:10 ******/

;

;
create table ListaPrecioConfig(
	lpc_id int not null,
	lpc_orden smallint not null,
	pr_id int not null,
	lp_id int not null,
 CONSTRAINT PK_ListaPrecioConfig PRIMARY KEY  
(
	lpc_id 
) 
) 
;
/****** Object:  Table ListaPrecioLista    Script Date: 07/30/2012 17:16:18 ******/

;

;
create table ListaPrecioLista(
	lpl_id int not null,
	lpl_porcentaje decimal(18, 6) not null CONSTRAINT DF_ListaPrecioLista_lpl_porcentaje  default (0),
	lp_id_padre int not null,
	lp_id int not null,
	lpm_id int null,
	creado timestamptz not null CONSTRAINT DF_ListaPrecioLista_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ListaPrecioLista_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ListaPrecioLista PRIMARY KEY  
(
	lpl_id 
) 
) 
;
/****** Object:  Table MovimientoCajaMovimiento    Script Date: 07/30/2012 17:17:14 ******/

;

;

;
create table MovimientoCajaMovimiento(
	mcj_id int not null,
	mcjm_id int not null,
	mcjm_orden smallint not null,
	mcjm_descrip varchar(5000) not null CONSTRAINT DF_MovimientoCajaMovimiento_mcjm_descrip  default (''),
	mcjm_importe decimal(18, 6) not null CONSTRAINT DF_MovimientoCajaMovimiento_mcjm_importe  default (0),
	as_id int not null,
 CONSTRAINT PK_MovimientoCajaMovimiento PRIMARY KEY  
(
	mcjm_id 
) 
) 
;

;
/****** Object:  Table ComunidadInternetTextoItem    Script Date: 07/30/2012 17:06:41 ******/

;

;

;
create table ComunidadInternetTextoItem(
	cmit_id int not null,
	cmiti_id int not null,
	cmiti_nombre varchar(255) not null,
	cmiti_codigo varchar(50) not null,
	cmiti_texto varchar(1000) not null,
	cmiti_tienevalor smallint not null CONSTRAINT DF_ComunidadInternetTexto_cmit_tienevalor  default (0),
	cmiti_delimitador varchar(50) not null CONSTRAINT DF_ComunidadInternetTexto_cmit_delimitador  default (''),
	cmiti_codigomacro varchar(50) not null CONSTRAINT DF_ComunidadInternetTexto_cmit_codigomacro  default (''),
	cmiti_booleano smallint not null CONSTRAINT DF_ComunidadInternetTexto_cmit_booleano  default (0),
	cmiti_id_padre int null,
	cmiti_orden smallint not null CONSTRAINT DF_ComunidadInternetTextoItem_cmti_id_orden  default (0),
 CONSTRAINT PK_ComunidadInternetTexto PRIMARY KEY  
(
	cmiti_id 
) 
) 
;

;
/****** Object:  Table Cobrador    Script Date: 07/30/2012 17:05:31 ******/

;

;

;
create table Cobrador(
	cob_id int not null,
	rel_id int not null,
	cob_nombre varchar(100) not null,
	cob_codigo varchar(15) not null,
	cob_descrip varchar(255) not null CONSTRAINT DF_Cobrador_cob_descripcion  default (''),
	cob_comision real not null,
	creado timestamptz not null CONSTRAINT DF_Cobrador_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Cobrador_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Cobrador_activo  default (1),
 CONSTRAINT PK_Cobrador PRIMARY KEY  
(
	cob_id 
) 
) 
;

;
/****** Object:  Table FacturaCompraItemSerieTMP    Script Date: 07/30/2012 17:11:12 ******/

;

;

;
create table FacturaCompraItemSerieTMP(
	fcTMP_id int not null,
	fciTMP_id int not null,
	fci_id int not null CONSTRAINT DF_FacturaCompraItemSerieTMP_fci_id  default (0),
	fcisTMP_id int not null,
	fcis_orden smallint not null CONSTRAINT DF_FacturaCompraItemSerieTMP_fcis_orden  default (0),
	prns_codigo varchar(100) not null CONSTRAINT DF_FacturaCompraItemSerieTMP_prns_codigo  default (''),
	prns_descrip varchar(255) not null CONSTRAINT DF_FacturaCompraItemSerieTMP_prns_descrip  default (''),
	prns_fechavto timestamptz not null CONSTRAINT DF_FacturaCompraItemSerieTMP_prns_fechavto  default (getdate()),
	pr_id int not null,
	prns_id int not null CONSTRAINT DF_FacturaCompraItemSerieTMP_prns_id  default (0),
	stl_codigo varchar(50) not null CONSTRAINT DF_FacturaCompraItemSerieTMP_stl_codigo  default (''),
	stl_id int null,
 CONSTRAINT PK_FacturaCompraItemSerieTMP PRIMARY KEY  
(
	fcisTMP_id 
) 
) 
;

;
/****** Object:  Table CatalogoWebItem    Script Date: 07/30/2012 17:04:26 ******/

;

;
create table CatalogoWebItem(
	catw_id int not null,
	catwi_id int not null,
	catwi_activo smallint not null CONSTRAINT DF_CatalogoWebItem_catwi_activo  default (1),
	catwi_pendiente smallint not null CONSTRAINT DF_CatalogoWebItem_catwi_pendiente  default (0),
	pr_id int not null,
	activo smallint not null CONSTRAINT DF_CatalogoWebItem_activo  default (1),
	creado timestamptz not null CONSTRAINT DF_CatalogoWebItem_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_CatalogoWebItem_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_CatalogoWebItem PRIMARY KEY  
(
	catwi_id 
) 
) 
;
/****** Object:  Table DepositoCuponItemTMP    Script Date: 07/30/2012 17:08:28 ******/

;

;

;
create table DepositoCuponItemTMP(
	dcupTMP_id int not null,
	dcupiTMP_id int not null,
	dcupi_id int not null CONSTRAINT DF_DepositoCuponItemTMP_dcupi_id  default (0),
	dcupi_orden smallint not null,
	dcupi_importe decimal(18, 6) not null CONSTRAINT DF_DepositoCuponItemTMP_dcupi_importe  default (0),
	dcupi_importeorigen decimal(18, 6) not null CONSTRAINT DF_DepositoCuponItemTMP_dcupi_importeorigen  default (0),
	dcupi_descrip varchar(5000) not null CONSTRAINT DF_DepositoCuponItemTMP_dcupi_descrip  default (''),
	cue_id int null,
	tjcc_id int null,
 CONSTRAINT PK_DepositoCuponItemTMP PRIMARY KEY  
(
	dcupiTMP_id 
) 
) 
;

;
/****** Object:  Table DepositoCuponItemBorradoTMP    Script Date: 07/30/2012 17:08:26 ******/

;

;
create table DepositoCuponItemBorradoTMP(
	dcupTMP_id int not null,
	dcupibTMP_id int not null,
	dcup_id int not null,
	dcupi_id int not null,
 CONSTRAINT PK_DepositoCuponItemBorradoTMP PRIMARY KEY  
(
	dcupibTMP_id 
) 
) 
;
/****** Object:  Table ParteReparacionItemSerieTMP    Script Date: 07/30/2012 17:21:01 ******/

;

;

;
create table ParteReparacionItemSerieTMP(
	prpTMP_id int not null,
	prpiTMP_id int not null,
	prpi_id int not null CONSTRAINT DF_ParteReparacionSerieTMP_prpi_id  default (0),
	prpisTMP_id int not null,
	prpis_orden smallint not null CONSTRAINT DF_ParteReparacionSerieTMP_prpis_orden  default (0),
	prns_codigo varchar(100) not null CONSTRAINT DF_ParteReparacionSerieTMP_prns_codigo  default (''),
	prns_descrip varchar(255) not null CONSTRAINT DF_ParteReparacionSerieTMP_prns_descrip  default (''),
	prns_fechavto timestamptz not null CONSTRAINT DF_ParteReparacionSerieTMP_prns_fechavto  default (getdate()),
	pr_id int not null,
	prns_id int not null CONSTRAINT DF_ParteReparacionSerieTMP_prns_id  default (0),
	pr_id_item int null,
 CONSTRAINT PK_ParteReparacionItemSerieTMP PRIMARY KEY  
(
	prpisTMP_id 
) 
) 
;

;
/****** Object:  Table CDRomArchivo    Script Date: 07/30/2012 17:04:35 ******/

;

;

;
create table CDRomArchivo(
	cda_id int not null,
	cda_nombre varchar(255) not null,
	cda_tipo varchar(50) not null CONSTRAINT DF_CDRomArchivo_cda_tipo  default (''),
	cda_path varchar(500) not null,
	cd_id int not null,
	cdc_id int not null,
	creado timestamptz not null CONSTRAINT DF_CDRomArchivo_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_CDRomArchivo_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_CDRomArchivo_activo  default (1),
 CONSTRAINT PK_CDRomArchivo PRIMARY KEY  
(
	cda_id 
) 
) 
;

;
/****** Object:  Table CDRomCarpeta    Script Date: 07/30/2012 17:04:37 ******/

;

;

;
create table CDRomCarpeta(
	cdc_id int not null,
	cdc_nombre varchar(255) not null,
	cdc_id_padre int null,
	cdc_path varchar(500) not null,
	cd_id int not null,
	creado timestamptz not null CONSTRAINT DF_CDRomCarpeta_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_CDRomCarpeta_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_CDRomCarpeta_activo  default (1),
 CONSTRAINT PK_CDRomCarpeta PRIMARY KEY  
(
	cdc_id 
) 
) 
;

;
/****** Object:  Table FacturaVentaItemTMP    Script Date: 07/30/2012 17:12:35 ******/

;

;

;
create table FacturaVentaItemTMP(
	fvTMP_id int not null,
	fviTMP_id int not null,
	fvi_id int not null,
	fvi_orden smallint not null,
	fvi_cantidad decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItemTMP_fvi_cantidad  default (0),
	fvi_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItemTMP_fvi_cantidadaremitir  default (0),
	fvi_pendiente decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItemTMP_fvi_pendiente_1  default (0),
	fvi_pendientepklst decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItemTMP_fvi_pendientepklst  default (0),
	fvi_descrip varchar(5000) not null CONSTRAINT DF_FacturaVentaItemTMP_fvi_descrip  default (''),
	fvi_precio decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItemTMP_fvi_precio  default (0),
	fvi_precioUsr decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItemTMP_fvi_precioUsr  default (0),
	fvi_precioLista decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItemTMP_fvi_precioLista  default (0),
	fvi_descuento varchar(100) not null CONSTRAINT DF_FacturaVentaItemTMP_fvi_descuento  default (''),
	fvi_neto decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItemTMP_fv_neto  default (0),
	fvi_ivari decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItemTMP_fvi_ivari  default (0),
	fvi_ivarni decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItemTMP_fvi_ivarni  default (0),
	fvi_ivariporc decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItemTMP_fvi_ivariporc  default (0),
	fvi_ivarniporc decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItemTMP_fvi_ivarniporc  default (0),
	fvi_internosporc decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItemTMP_fvi_internosporc  default (0),
	fvi_internos decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItemTMP_fvi_internos  default (0),
	fvi_importe decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItemTMP_fvi_importe  default (0),
	fvi_importeorigen decimal(18, 6) not null CONSTRAINT DF_FacturaVentaItemTMP_fvi_importe1  default (0),
	fvi_nostock smallint not null CONSTRAINT DF_FacturaVentaItemTMP_fvi_nostock  default (0),
	pr_id int not null,
	ccos_id int null,
	cue_id int not null,
	cue_id_ivari int null,
	cue_id_ivarni int null,
	to_id int not null CONSTRAINT DF__FacturaVe__to_id__7F1C63F7  default (1),
	stl_id int null,
 CONSTRAINT PK_FacturaVentaItemTMP PRIMARY KEY  
(
	fviTMP_id 
) 
) 
;

;
/****** Object:  Table FacturaVentaItemSerieTMP    Script Date: 07/30/2012 17:12:29 ******/

;

;

;
create table FacturaVentaItemSerieTMP(
	fvTMP_id int not null,
	fviTMP_id int not null,
	fvi_id int not null CONSTRAINT DF_FacturaVentaItemSerieTMP_fvi_id  default (0),
	fvisTMP_id int not null,
	fvis_orden smallint not null CONSTRAINT DF_FacturaVentaItemSerieTMP_fvis_orden  default (0),
	prns_codigo varchar(100) not null CONSTRAINT DF_FacturaVentaItemSerieTMP_prns_codigo  default (''),
	prns_descrip varchar(255) not null CONSTRAINT DF_FacturaVentaItemSerieTMP_prns_descrip  default (''),
	prns_fechavto timestamptz not null CONSTRAINT DF_FacturaVentaItemSerieTMP_prns_fechavto  default (getdate()),
	pr_id int not null,
	prns_id int not null CONSTRAINT DF_FacturaVentaItemSerieTMP_prns_id  default (0),
	pr_id_item int null,
 CONSTRAINT PK_FacturaVentaItemSerieTMP PRIMARY KEY  
(
	fvisTMP_id 
) 
) 
;

;
/****** Object:  Table FacturaVentaPercepcionBorradoTMP    Script Date: 07/30/2012 17:12:44 ******/

;

;
create table FacturaVentaPercepcionBorradoTMP(
	fvTMP_id int not null,
	fvpercbTMP_id int not null,
	fv_id int not null,
	fvperc_id int not null,
 CONSTRAINT PK_FacturaVentaPercepcionBorradoTMP PRIMARY KEY  
(
	fvpercbTMP_id 
) 
) 
;
/****** Object:  Table FacturaVentaItemBorradoTMP    Script Date: 07/30/2012 17:12:26 ******/

;

;
create table FacturaVentaItemBorradoTMP(
	fvTMP_id int not null,
	fvibTMP_id int not null,
	fv_id int not null,
	fvi_id int not null,
 CONSTRAINT PK_FacturaVentaItemBorradoTMP PRIMARY KEY  
(
	fvibTMP_id 
) 
) 
;
/****** Object:  Table RemitoCompraItem    Script Date: 07/30/2012 17:27:54 ******/

;

;

;
create table RemitoCompraItem(
	rc_id int not null,
	rci_id int not null,
	rci_orden smallint not null,
	rci_cantidad decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItem_pvi_cantidad  default (0),
	rci_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItem_pvi_cantidadaremitir  default (0),
	rci_pendiente decimal(18, 6) null CONSTRAINT DF_RemitoCompraItem_pvi_pendiente  default (0),
	rci_pendientefac decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItem_rvi_pendientefac  default (0),
	rci_descrip varchar(5000) not null CONSTRAINT DF_RemitoCompraItem_pvi_descrip  default (''),
	rci_precio decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItem_pvi_precio  default (0),
	rci_precioUsr decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItem_pvi_precioUsr  default (0),
	rci_precioLista decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItem_pvi_precioLista  default (0),
	rci_descuento varchar(100) not null CONSTRAINT DF_RemitoCompraItem_pvi_descuento  default (''),
	rci_neto decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItem_pvi_neto  default (0),
	rci_ivari decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItem_pvi_ivari  default (0),
	rci_ivarni decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItem_pvi_ivarni  default (0),
	rci_ivariporc decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItem_pvi_ivariporc  default (0),
	rci_ivarniporc decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItem_pvi_ivarniporc  default (0),
	rci_importe decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItem_pvi_importe  default (0),
	rci_costo decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItem_rci_costo  default (0),
	pr_id int not null,
	ccos_id int null,
	stl_id int null,
 CONSTRAINT PK_RemitoCompraItem PRIMARY KEY  
(
	rci_id 
) 
) 
;

;
/****** Object:  Table ImportacionTempItem    Script Date: 07/30/2012 17:14:24 ******/

;

;

;
create table ImportacionTempItem(
	impt_id int not null,
	impti_id int not null,
	impti_orden smallint not null,
	impti_cantidad decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItem_pvi_cantidad  default (0),
	impti_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItem_pvi_cantidadaremitir  default (0),
	impti_descrip varchar(5000) not null CONSTRAINT DF_ImportacionTempItem_pvi_descrip  default (''),
	impti_precio decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItem_pvi_precio  default (0),
	impti_precioUsr decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItem_pvi_precioUsr  default (0),
	impti_precioLista decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItem_pvi_precioLista  default (0),
	impti_descuento varchar(100) not null CONSTRAINT DF_ImportacionTempItem_pvi_descuento  default (''),
	impti_neto decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItem_pvi_neto  default (0),
	impti_ivari decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItem_pvi_ivari  default (0),
	impti_ivarni decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItem_pvi_ivarni  default (0),
	impti_ivariporc decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItem_pvi_ivariporc  default (0),
	impti_ivarniporc decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItem_pvi_ivarniporc  default (0),
	impti_importe decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItem_pvi_importe  default (0),
	impti_seguro decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItem_impti_seguro  default (0),
	impti_flete decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItem_impti_flete  default (0),
	pr_id int not null,
	ccos_id int null,
	stl_id int null,
 CONSTRAINT PK_ImportacionTempItem PRIMARY KEY  
(
	impti_id 
) 
) 
;

;
/****** Object:  Table ManifiestoPackingList    Script Date: 07/30/2012 17:16:53 ******/

;

;
create table ManifiestoPackingList(
	mfcpklst_id int not null,
	mfcpklst_cantidad decimal(18, 6) not null CONSTRAINT DF_ManifiestoPackingList_mfcpklst_cantidad  default (0),
	mfci_id int not null,
	pklsti_id int not null,
 CONSTRAINT PK_ManifiestoPackingList PRIMARY KEY  
(
	mfcpklst_id 
) 
) 
;
/****** Object:  Table PackingListFacturaVenta    Script Date: 07/30/2012 17:19:48 ******/

;

;
create table PackingListFacturaVenta(
	pklstfv_id int not null,
	pklstfv_cantidad decimal(18, 6) not null CONSTRAINT DF_PackingListFacturaVenta_pklstfv_cantidad  default (0),
	pklsti_id int not null,
	fvi_id int not null,
 CONSTRAINT PK_PackingListFacturaVenta PRIMARY KEY  
(
	pklstfv_id 
) 
) 
;
/****** Object:  Table PackingListFacturaVentaTMP    Script Date: 07/30/2012 17:19:49 ******/

;

;
create table PackingListFacturaVentaTMP(
	fvTMP_id int not null CONSTRAINT DF_PackingListFacturaVentaTMP_fvTMP_id  default (0),
	pklstTMP_id int not null CONSTRAINT DF_PackingListFacturaVentaTMP_pklstTMP_id  default (0),
	pklstfvTMP_id int not null,
	pklstfv_id int not null,
	pklstfv_cantidad decimal(18, 6) not null CONSTRAINT DF_PackingListFacturaVentaTMP_pklstfv_cantidad  default (0),
	pklsti_id int not null,
	fvi_id int not null,
 CONSTRAINT PK_PackingListFacturaVentaTMP PRIMARY KEY  
(
	pklstfvTMP_id 
) 
) 
;
/****** Object:  Table PackingListDevolucion    Script Date: 07/30/2012 17:19:45 ******/

;

;
create table PackingListDevolucion(
	pklstdv_id int not null,
	pklstdv_cantidad decimal(18, 6) not null CONSTRAINT DF_PackingListDevolucion_pklstdv_cantidad  default (0),
	pklsti_id_pklst int not null,
	pklsti_id_devolucion int not null,
 CONSTRAINT PK_PackingListDevolucion PRIMARY KEY  
(
	pklstdv_id 
) 
) 
;
/****** Object:  Table FacturaCompraOrdenPagoTMP    Script Date: 07/30/2012 17:11:32 ******/

;

;
create table FacturaCompraOrdenPagoTMP(
	opgTMP_id int not null,
	fcopgTMP_id int not null,
	fcopg_id int not null,
	fcopg_importe decimal(18, 6) not null CONSTRAINT DF_FacturaCompraOrdenPagoTMP_fcopg_importe  default (0),
	fcopg_importeOrigen decimal(18, 6) not null CONSTRAINT DF_FacturaCompraOrdenPagoTMP_fcopg_importeOrigen  default (0),
	fcopg_cotizacion decimal(18, 6) not null CONSTRAINT DF_FacturaCompraOrdenPagoTMP_fcopg_cotizacion  default (0),
	fc_id int not null,
	fcd_id int null,
	fcp_id int null,
	opg_id int not null,
 CONSTRAINT PK_FacturaCompraOrdenPagoTMP PRIMARY KEY  
(
	fcopgTMP_id 
) 
) 
;
/****** Object:  Table OrdenPagoItemTMP    Script Date: 07/30/2012 17:18:32 ******/

;

;

;
create table OrdenPagoItemTMP(
	opgTMP_id int not null,
	opgiTMP_id int not null,
	opgi_id int not null,
	opgi_orden smallint not null CONSTRAINT DF_OrdenPagoItemTMP_opgi_orden  default (0),
	opgi_otroTipo smallint not null CONSTRAINT DF_OrdenPagoItemTMP_opgi_otroTipo  default (0),
	opgi_importe decimal(18, 6) not null CONSTRAINT DF_OrdenPagoItemTMP_opgi_importe  default (0),
	opgi_importeOrigen decimal(18, 6) not null CONSTRAINT DF_OrdenPagoItemTMP_opgi_importeOrigen  default (0),
	opgi_descrip varchar(255) not null CONSTRAINT DF_OrdenPagoItemTMP_opgi_descrip  default (''),
	opgi_porcRetencion decimal(18, 6) not null CONSTRAINT DF_OrdenPagoItemTMP_opgi_porcRetencion  default (0),
	opgi_fechaRetencion timestamptz not null CONSTRAINT DF_OrdenPagoItemTMP_opgi_fechaRetencion  default (getdate()),
	opgi_nroRetencion varchar(100) not null CONSTRAINT DF_OrdenPagoItemTMP_opgi_nroRetencion  default (''),
	opgi_tipo smallint not null CONSTRAINT DF_OrdenPagoItemTMP_opgi_tipo  default (0),
	opgiTMP_cheque varchar(50) not null CONSTRAINT DF_OrdenPagoItemTMP_opgiTMP_cheqe  default (''),
	opgiTMP_cupon varchar(50) not null CONSTRAINT DF_OrdenPagoItemTMP_opgiTMP_cupon  default (''),
	opgiTMP_fechaCobro timestamptz not null CONSTRAINT DF_OrdenPagoItemTMP_opgiTMP_fechaCobro  default (getdate()),
	opgiTMP_fechaVto timestamptz not null CONSTRAINT DF_OrdenPagoItemTMP_opgiTMP_fechaVto  default (getdate()),
	opgiTMP_titular varchar(255) not null CONSTRAINT DF_OrdenPagoItemTMP_opgiTMP_titular  default (''),
	opgiTMP_autorizacion varchar(50) not null CONSTRAINT DF_OrdenPagoItemTMP_opgiTMP_autorizacion  default (''),
	opgiTMP_nroTarjeta varchar(50) not null CONSTRAINT DF_OrdenPagoItemTMP_opgiTMP_nroTarjeta  default (''),
	chq_id int null,
	cheq_id int null,
	cue_id int null,
	ccos_id int null,
	bco_id int null,
	cle_id int null,
	mon_id int null,
	ret_id int null,
	fc_id_ret int null,
 CONSTRAINT PK_OrdenPagoItemTMP PRIMARY KEY  
(
	opgiTMP_id 
) 
) 
;

;
/****** Object:  Table OrdenPagoItemBorradoTMP    Script Date: 07/30/2012 17:18:26 ******/

;

;
create table OrdenPagoItemBorradoTMP(
	opgTMP_id int not null,
	opgibTMP_id int not null,
	opg_id int not null,
	opgi_id int not null,
 CONSTRAINT PK_OrdenPagoItemBorradoTMP PRIMARY KEY  
(
	opgibTMP_id 
) 
) 
;
/****** Object:  Table TarifarioAltura    Script Date: 07/30/2012 17:31:25 ******/

;

;
create table TarifarioAltura(
	tfa_id int not null,
	tfa_desde int not null,
	tfa_hasta int not null,
	tf_id int not null,
	tfcalle_id int not null,
	zon_id int not null,
 CONSTRAINT PK_TarifaAltura PRIMARY KEY  
(
	tfa_id 
) 
) 
;
/****** Object:  Table BancoConciliacionItem    Script Date: 07/30/2012 17:03:51 ******/

;

;

;
create table BancoConciliacionItem(
	bcoci_id int not null,
	bcoc_id int not null,
	bcoci_debe decimal(18, 6) not null,
	bcoci_haber decimal(18, 6) not null,
	bcoci_fecha timestamptz not null,
	bcoci_estado smallint not null,
	bcoci_descrip varchar(5000) not null,
	bcoci_saldocont decimal(18, 6) not null CONSTRAINT DF_BancoConciliacionItem_bcoci_saldocont  default (0),
	bcoci_saldobco decimal(18, 6) not null CONSTRAINT DF_BancoConciliacionItem_bcoci_saldobco  default (0),
	asi_id int not null,
	doct_id int null,
	comp_id int null,
 CONSTRAINT PK_BancoConciliacionItem PRIMARY KEY  
(
	bcoci_id 
) 
) 
;

;
/****** Object:  Table MovimientoFondoItemBorradoTMP    Script Date: 07/30/2012 17:17:26 ******/

;

;
create table MovimientoFondoItemBorradoTMP(
	mfTMP_id int not null,
	mfibTMP_id int not null,
	mf_id int not null,
	mfi_id int not null,
 CONSTRAINT PK_MovimientoFondoItemBorradoTMP PRIMARY KEY  
(
	mfibTMP_id 
) 
) 
;
/****** Object:  Table MovimientoFondoItemTMP    Script Date: 07/30/2012 17:17:30 ******/

;

;

;
create table MovimientoFondoItemTMP(
	mfTMP_id int not null,
	mfiTMP_id int not null,
	mfi_id int not null,
	mfi_orden smallint not null,
	mfi_descrip varchar(5000) not null CONSTRAINT DF_MovimientoFondoItemTMP_mfi_descrip  default (''),
	mfi_importe decimal(18, 6) not null CONSTRAINT DF_MovimientoFondoItemTMP_mfi_importe  default (0),
	mfi_importeorigen decimal(18, 6) not null CONSTRAINT DF_MovimientoFondoItemTMP_mfi_importeOrigen  default (0),
	mfi_tipo smallint not null CONSTRAINT DF_MovimientoFondoItemTMP_mfi_tipo  default (0),
	mfiTMP_cheque varchar(50) not null CONSTRAINT DF_MovimientoFondoItemTMP_opgiTMP_cheque  default (''),
	mfiTMP_fechaCobro timestamptz not null CONSTRAINT DF_MovimientoFondoItemTMP_opgiTMP_fechaCobro  default (getdate()),
	mfiTMP_fechaVto timestamptz not null CONSTRAINT DF_MovimientoFondoItemTMP_opgiTMP_fechaVto  default (getdate()),
	ccos_id int null,
	cue_id_debe int not null,
	cue_id_haber int not null,
	chq_id int null,
	cheq_id int null,
	cle_id int null,
	mon_id int null,
	bco_id int null,
	mfi_importeorigenhaber decimal(18, 6) not null default (0),
 CONSTRAINT PK_MovimientoFondoItemTMP PRIMARY KEY  
(
	mfiTMP_id 
) 
) 
;

;
/****** Object:  Table RubroTablaItem    Script Date: 07/30/2012 17:29:48 ******/

;

;

;
create table RubroTablaItem(
	rubti_id int not null,
	rubt_id int not null,
	rubti_nombre varchar(255) not null,
	rubti_codigo varchar(50) not null,
	rubti_descrip varchar(255) not null CONSTRAINT DF_RubroTablaItem_rubti_descrip  default (''),
	creado timestamptz not null CONSTRAINT DF_RubroTablaItem_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_RubroTablaItem_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_RubroTablaItem PRIMARY KEY  
(
	rubti_id 
) 
) 
;

;
/****** Object:  Table EjercicioContableCircuitoContable    Script Date: 07/30/2012 17:09:18 ******/

;

;
create table EjercicioContableCircuitoContable(
	ejc_id int not null,
	cico_id int not null,
 CONSTRAINT PK_EjercicioContableCircuitoContable PRIMARY KEY  
(
	ejc_id,
	cico_id 
) 
) 
;
/****** Object:  Table PedidoCompraItem    Script Date: 07/30/2012 17:21:24 ******/

;

;

;
create table PedidoCompraItem(
	pc_id int not null,
	pci_id int not null,
	pci_orden smallint not null,
	pci_cantidad decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItem_pci_cantidad  default (0),
	pci_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItem_pci_cantidadaremitir  default (0),
	pci_pendiente decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItem_pci_pendiente  default (0),
	pci_descrip varchar(5000) not null CONSTRAINT DF_PedidoCompraItem_pci_descrip  default (''),
	pci_precio decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItem_pci_precio  default (0),
	pci_precioUsr decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItem_pci_precioUsr  default (0),
	pci_precioLista decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItem_pci_precioLista  default (0),
	pci_neto decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItem_pci_neto  default (0),
	pci_ivari decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItem_pci_ivari  default (0),
	pci_ivarni decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItem_pci_ivarni  default (0),
	pci_importe decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItem_pci_importe  default (0),
	pci_ivariporc decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItem_pci_ivariporc  default (0),
	pci_ivarniporc decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItem_pci_ivarniporc  default (0),
	pr_id int not null,
	us_id int null,
	ccos_id int null,
 CONSTRAINT PK_PedidoCompraItem PRIMARY KEY  
(
	pci_id 
) 
) 
;

;
/****** Object:  Table CondicionPagoItem    Script Date: 07/30/2012 17:06:50 ******/

;

;
create table CondicionPagoItem(
	cpgi_id int not null,
	cpg_id int not null,
	cpgi_dias smallint not null CONSTRAINT DF_CondicionPagoItem_cpgi_dias  default (0),
	cpgi_porcentaje decimal(18, 4) not null CONSTRAINT DF_CondicionPagoItem_cpgi_porcentaje  default (0),
 CONSTRAINT PK_CondicionPagoItem PRIMARY KEY  
(
	cpgi_id 
) 
) 
;
/****** Object:  Table PackingListItem    Script Date: 07/30/2012 17:19:55 ******/

;

;

;
create table PackingListItem(
	pklst_id int not null,
	pklsti_id int not null,
	pklsti_orden smallint not null,
	pklsti_cantidad decimal(18, 6) not null CONSTRAINT DF_PackingListItem_pklsti_cantidad  default (0),
	pklsti_pendiente decimal(18, 6) not null CONSTRAINT DF_PackingListItem_pklsti_pendiente  default (0),
	pklsti_pendientefac decimal(18, 6) not null CONSTRAINT DF_PackingListItem_pklsti_pendientefac  default (0),
	pklsti_pallets int not null,
	pklsti_seguro decimal(18, 6) not null CONSTRAINT DF_PackingListItem_pklsti_seguro  default (0),
	pklsti_descrip varchar(255) not null CONSTRAINT DF_PackingListItem_pklsti_descrip  default (''),
	pklsti_precio decimal(18, 6) not null CONSTRAINT DF_PackingListItem_rvi_precio  default (0),
	pklsti_precioUsr decimal(18, 6) not null CONSTRAINT DF_PackingListItem_rvi_precioUsr  default (0),
	pklsti_precioLista decimal(18, 6) not null CONSTRAINT DF_PackingListItem_rvi_precioLista  default (0),
	pklsti_descuento varchar(100) not null CONSTRAINT DF_PackingListItem_rvi_descuento  default (''),
	pklsti_neto decimal(18, 6) not null CONSTRAINT DF_PackingListItem_rvi_neto  default (0),
	pklsti_ivari decimal(18, 6) not null CONSTRAINT DF_PackingListItem_rvi_ivari  default (0),
	pklsti_ivarni decimal(18, 6) not null CONSTRAINT DF_PackingListItem_rvi_ivarni  default (0),
	pklsti_ivariporc decimal(18, 6) not null CONSTRAINT DF_PackingListItem_rvi_ivariporc  default (0),
	pklsti_ivarniporc decimal(18, 6) not null CONSTRAINT DF_PackingListItem_rvi_ivarniporc  default (0),
	pklsti_importe decimal(18, 6) not null CONSTRAINT DF_PackingListItem_rvi_importe  default (0),
	pklsti_cajadesde smallint not null CONSTRAINT DF_PackingListItem_pklsti_cajadesde  default (0),
	pklsti_cajahasta smallint not null CONSTRAINT DF_PackingListItem_pklsti_cajahasta  default (0),
	pklsti_pesoneto decimal(18, 6) not null CONSTRAINT DF_PackingListItem_pklsti_pesoneto  default (0),
	pklsti_pesototal decimal(18, 6) not null CONSTRAINT DF_PackingListItem_pklsti_pesototal  default (0),
	pklsti_grupoexpo varchar(100) not null CONSTRAINT DF_PackingListItem_pklsti_grupoexpo  default (''),
	ccos_id int null,
	pr_id int not null,
 CONSTRAINT PK_PackingListItem PRIMARY KEY  
(
	pklsti_id 
) 
) 
;

;
/****** Object:  Table MovimientoCaja    Script Date: 07/30/2012 17:17:09 ******/

;

;

;
create table MovimientoCaja(
	mcj_id int not null,
	mcj_numero int not null CONSTRAINT DF_MovimientoCaja_mcj_numero  default (0),
	mcj_nrodoc varchar(50) not null CONSTRAINT DF_MovimientoCaja_mcj_nrodoc  default (''),
	mcj_descrip varchar(5000) not null CONSTRAINT DF_MovimientoCaja_mcj_descrip  default (''),
	mcj_fecha timestamptz not null CONSTRAINT DF_MovimientoCaja_mcj_fecha  default (getdate()),
	mcj_hora timestamptz not null CONSTRAINT DF_MovimientoCaja_mcj_hora  default ('19000101'),
	mcj_tipo smallint not null CONSTRAINT DF_MovimientoCaja_mcj_tipo  default (0),
	mcj_cerrada smallint not null CONSTRAINT DF_MovimientoCaja_mcj_cerrada  default (0),
	cj_id int not null,
	us_id_cajero int not null,
	as_id int null,
	creado timestamptz not null CONSTRAINT DF_MovimientoCaja_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_MovimientoCaja_modificado  default (getdate()),
	modifico int not null,
	impreso smallint not null CONSTRAINT DF_MovimientoCaja_impreso  default (0),
 CONSTRAINT PK_MovimientoCaja PRIMARY KEY  
(
	mcj_id 
) 
) 
;

;
/****** Object:  Table PedidoCotizacionCompra    Script Date: 07/30/2012 17:21:35 ******/

;

;
create table PedidoCotizacionCompra(
	pccot_id int not null,
	pccot_cantidad decimal(18, 6) not null CONSTRAINT DF_PedidoCotizacionCompra_pccot_cantidad  default (0),
	pci_id int not null,
	coti_id int not null,
 CONSTRAINT PK_PedidoCotizacionCompra PRIMARY KEY  
(
	pccot_id 
) 
) 
;
/****** Object:  Table CotizacionOrdenCompra    Script Date: 07/30/2012 17:07:27 ******/

;

;
create table CotizacionOrdenCompra(
	cotoc_id int not null,
	cotoc_cantidad decimal(18, 6) not null CONSTRAINT DF_CotizacionOrdenCompra_cotoc_cantidad  default (0),
	coti_id int not null,
	oci_id int not null,
 CONSTRAINT PK_CotizacionOrdenCompra PRIMARY KEY  
(
	cotoc_id 
) 
) 
;
/****** Object:  Table EncuestaPreguntaItem    Script Date: 07/30/2012 17:10:19 ******/

;

;

;
create table EncuestaPreguntaItem(
	ecp_id int not null,
	ecpi_id int not null,
	ecpi_texto varchar(255) not null,
	ecpi_llevaInfo smallint not null CONSTRAINT DF_EncuestaPreguntaItem_ecpi_llevaInfo  default (0),
	ecpi_orden smallint not null CONSTRAINT DF_EncuestaPreguntaItem_ecpi_orden  default (0),
 CONSTRAINT PK_EncuestaPreguntaItem PRIMARY KEY  
(
	ecpi_id 
) 
) 
;

;
/****** Object:  Table CursoItemAsistencia    Script Date: 07/30/2012 17:07:51 ******/

;

;
create table CursoItemAsistencia(
	curi_id int not null,
	curia_id int not null,
	curc_id int not null,
 CONSTRAINT PK_CursoItemAsistencia PRIMARY KEY  
(
	curia_id 
) 
) 
;
/****** Object:  Table CursoItemCalificacion    Script Date: 07/30/2012 17:07:52 ******/

;

;
create table CursoItemCalificacion(
	curi_id int not null,
	curic_id int not null,
	curic_calificacion decimal(18, 6) not null CONSTRAINT DF_CursoItemCalificacion_curic_calificacion  default (0),
	cure_id int not null,
 CONSTRAINT PK_CursoItemCalificacion PRIMARY KEY  
(
	curic_id 
) 
) 
;
/****** Object:  Table StockLote    Script Date: 07/30/2012 17:30:24 ******/

;

;

;
create table StockLote(
	stl_id int not null,
	stl_codigo varchar(50) not null,
	stl_nroLote varchar(50) not null,
	stl_fecha timestamptz not null CONSTRAINT DF_StockLote_stl_fecha  default (getdate()),
	stl_fechaVto timestamptz not null CONSTRAINT DF_StockLote_stl_fechaVto  default ('19000101'),
	stl_descrip varchar(255) not null CONSTRAINT DF_StockLote_stl_descrip  default (''),
	stl_id_padre int null,
	pr_id int not null,
	pa_id int null,
	creado timestamptz not null CONSTRAINT DF_StockLote_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_StockLote_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_StockLote PRIMARY KEY  
(
	stl_id 
) 
) 
;

;
/****** Object:  Table Aduana    Script Date: 07/30/2012 17:02:19 ******/

;

;

;
create table Aduana(
	adu_id int not null,
	adu_nombre varchar(100) not null,
	adu_codigo varchar(15) not null,
	adu_descrip varchar(255) not null CONSTRAINT DF_Aduana_adu_descrip  default (''),
	pa_id int not null,
	creado timestamptz not null CONSTRAINT DF_Aduana_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Aduana_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Aduana_activo  default (1),
 CONSTRAINT PK_Aduana PRIMARY KEY  
(
	adu_id 
) 
) 
;

;
/****** Object:  Table ExpoGrupoPrecioPosAran    Script Date: 07/30/2012 17:10:42 ******/

;

;

;
create table ExpoGrupoPrecioPosAran(
	egppa_id int not null,
	egp_id int not null,
	egppa_posicion varchar(255) not null CONSTRAINT DF_ExpoGrupoPrecioPosAran_egppa_posicion  default (''),
	pa_id int not null,
 CONSTRAINT PK_ExpoGrupoPrecioPosAran PRIMARY KEY  
(
	egppa_id 
) 
) 
;

;
/****** Object:  Table Provincia    Script Date: 07/30/2012 17:26:58 ******/

;

;

;
create table Provincia(
	pro_id int not null,
	pro_nombre varchar(100) not null,
	pro_codigo varchar(15) not null,
	pro_descrip varchar(255) not null CONSTRAINT DF_Provincia_pro_descrip  default (''),
	pa_id int not null,
	modificado timestamptz not null CONSTRAINT DF_Provincia_modificado  default (getdate()),
	modifico int not null,
	creado timestamptz not null CONSTRAINT DF_Provincia_creado  default (getdate()),
	activo smallint not null CONSTRAINT DF_Provincia_activo  default (1),
 CONSTRAINT PK_Provincia PRIMARY KEY  
(
	pro_id 
) 
) 
;

;
/****** Object:  Table RamaVista    Script Date: 07/30/2012 17:27:21 ******/

;

;
create table RamaVista(
	arbv_id int not null,
	ram_id int not null,
	ramv_id int not null,
	ramv_estado smallint not null CONSTRAINT DF_RamaVista_ramv_estado  default (0),
 CONSTRAINT PK_RamaVista PRIMARY KEY  
(
	ramv_id 
) 
) 
;
/****** Object:  Table HoraFacturaVenta    Script Date: 07/30/2012 17:13:50 ******/

;

;
create table HoraFacturaVenta(
	horafv_id int not null,
	horafv_cantidad decimal(18, 6) not null CONSTRAINT DF_HoraFacturaVenta_horafv_cantidad  default (0),
	hora_id int not null,
	fvi_id int not null,
 CONSTRAINT PK_HoraFacturaVenta PRIMARY KEY  
(
	horafv_id 
) 
) 
;
/****** Object:  Table RemitoCompraItemSerieTMP    Script Date: 07/30/2012 17:27:59 ******/

;

;

;
create table RemitoCompraItemSerieTMP(
	rcTMP_id int not null,
	rciTMP_id int not null,
	rci_id int not null CONSTRAINT DF_RemitoCompraItemSerieTMP_rci_id  default (0),
	rcisTMP_id int not null,
	rcis_orden smallint not null CONSTRAINT DF_RemitoCompraItemSerieTMP_rcis_orden  default (0),
	prns_codigo varchar(100) not null CONSTRAINT DF_RemitoCompraItemSerieTMP_prns_codigo  default (''),
	prns_descrip varchar(255) not null CONSTRAINT DF_RemitoCompraItemSerieTMP_prns_descrip  default (''),
	prns_fechavto timestamptz not null CONSTRAINT DF_RemitoCompraItemSerieTMP_prns_fechavto  default (getdate()),
	pr_id int not null,
	prns_id int not null CONSTRAINT DF_RemitoCompraItemSerieTMP_prns_id  default (0),
	stl_codigo varchar(50) not null CONSTRAINT DF_RemitoCompraItemSerieTMP_stl_codigo  default (''),
	stl_id int null,
 CONSTRAINT PK_RemitoCompraItemSerieTMP PRIMARY KEY  
(
	rcisTMP_id 
) 
) 
;

;
/****** Object:  Table PermisoEmbarqueItem    Script Date: 07/30/2012 17:22:48 ******/

;

;

;
create table PermisoEmbarqueItem(
	pemb_id int not null,
	pembi_id int not null,
	pembi_orden smallint not null,
	pembi_cantidad decimal(18, 6) not null,
	pembi_pendiente decimal(18, 6) not null CONSTRAINT DF_PermisoEmbarqueItem_pembi_pendiente  default (0),
	pembi_foborigen decimal(18, 6) not null CONSTRAINT DF_PermisoEmbarqueItem_pembi_foborigen  default (0),
	pembi_fobtotalorigen decimal(18, 6) not null CONSTRAINT DF_PermisoEmbarqueItem_pembi_fobtotalorigen  default (0),
	pembi_fob decimal(18, 6) not null,
	pembi_fobtotal decimal(18, 6) not null,
	pembi_descrip varchar(255) not null CONSTRAINT DF_PermisoEmbarqueItem_pembi_descrip  default (''),
	pr_id int not null,
 CONSTRAINT PK_PermisoEmbarqueItem PRIMARY KEY  
(
	pembi_id 
) 
) 
;

;
/****** Object:  Table LenguajeItem    Script Date: 07/30/2012 17:15:10 ******/

;

;

;
create table LenguajeItem(
	lengi_id int not null,
	lengi_codigo varchar(255) not null,
	leng_id int not null,
	lengi_texto varchar(5000) not null CONSTRAINT DF_LenguajeItem_lengi_texto  default (''),
	creado timestamptz not null CONSTRAINT DF_LenguajeItem_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_LenguajeItem_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_LenguajeItem_activo  default (1),
 CONSTRAINT PK_LenguajeItem PRIMARY KEY  
(
	lengi_id 
) 
) 
;

;
/****** Object:  Table ClienteContactoTipo    Script Date: 07/30/2012 17:05:19 ******/

;

;

;
create table ClienteContactoTipo(
	clict_id int not null,
	clict_nombre varchar(100) not null,
	clict_codigo varchar(15) not null,
	clict_descrip varchar(255) not null CONSTRAINT DF_ClienteContactoTipo_clitc_descrip  default (''),
	creado timestamptz not null CONSTRAINT DF_ClienteContactoTipo_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ClienteContactoTipo_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_ClienteContactoTipo_activo  default (1),
 CONSTRAINT PK_ClienteContactoTipo PRIMARY KEY  
(
	clict_id 
) 
) 
;

;
/****** Object:  Table CircuitoContable    Script Date: 07/30/2012 17:04:56 ******/

;

;

;
create table CircuitoContable(
	cico_id int not null,
	cico_nombre varchar(100) not null,
	cico_codigo varchar(15) not null,
	cico_descrip varchar(255) not null CONSTRAINT DF_CircuitoContable_cico_descrip  default (''),
	creado timestamptz not null CONSTRAINT DF_CircuitoContable_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_CircuitoContable_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_CircuitoContable_activo  default (1),
 CONSTRAINT PK_CircuitoContable PRIMARY KEY  
(
	cico_id 
) 
) 
;

;
/****** Object:  Table Lenguaje    Script Date: 07/30/2012 17:15:08 ******/

;

;

;
create table Lenguaje(
	leng_id int not null,
	leng_nombre varchar(100) not null,
	leng_codigo varchar(15) not null,
	leng_descrip varchar(255) not null CONSTRAINT DF_Lenguaje_leng_descrip  default (''),
	leng_id_padre int null,
	creado timestamptz not null CONSTRAINT DF_Lenguaje_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Lenguaje_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Lenguaje_activo  default (1),
 CONSTRAINT PK_Lenguaje PRIMARY KEY  
(
	leng_id 
) 
) 
;

;
/****** Object:  Table UsuarioDepartamento    Script Date: 07/30/2012 17:32:02 ******/

;

;
create table UsuarioDepartamento(
	usdpto_id int not null,
	us_id int not null,
	dpto_id int not null,
	modificado timestamptz not null CONSTRAINT DF_UsuarioDepartamento_modificado  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_UsuarioDepartamento_creado  default (getdate()),
	activo smallint not null CONSTRAINT DF_UsuarioDepartamento_activo  default (1),
	modifico int not null CONSTRAINT DF_UsuarioDepartamento_modifico  default (1),
 CONSTRAINT PK_UsuarioDepartamento PRIMARY KEY  
(
	usdpto_id 
) 
) 
;
/****** Object:  Table GridView    Script Date: 07/30/2012 17:13:18 ******/

;

;

;
create table GridView(
	grid_name varchar(255) not null CONSTRAINT DF_GridView_grid_name  default (''),
	rpt_id int null,
	grdv_id int not null,
	grdv_nombre varchar(255) not null CONSTRAINT DF_GridView_grdv_nombre  default (''),
	grdv_default smallint not null CONSTRAINT DF_GridView_grdv_default  default (0),
	grdv_publica smallint not null,
	grdv_autowidth smallint not null CONSTRAINT DF_GridView_grdv_autowidth  default (0),
	us_id int not null,
 CONSTRAINT PK_GridView PRIMARY KEY  
(
	grdv_id 
) 
) 
;

;
/****** Object:  Table Pais    Script Date: 07/30/2012 17:20:13 ******/

;

;

;
create table Pais(
	pa_id int not null,
	pa_nombre varchar(100) not null,
	pa_codigo varchar(15) not null,
	pa_descrip varchar(255) not null CONSTRAINT DF_Pais_pa_descrip  default (''),
	creado timestamptz not null CONSTRAINT DF_Pais_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Pais_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Pais_activo  default (1),
 CONSTRAINT PK_Pais PRIMARY KEY  
(
	pa_id 
) 
) 
;

;
/****** Object:  Table CajaCajero    Script Date: 07/30/2012 17:03:56 ******/

;

;
create table CajaCajero(
	cj_id int not null,
	cjcj_id int not null,
	us_id int not null,
 CONSTRAINT PK_CajaCajero PRIMARY KEY  
(
	cjcj_id 
) 
) 
;
/****** Object:  Table Prioridad    Script Date: 07/30/2012 17:25:01 ******/

;

;

;
create table Prioridad(
	prio_id int not null,
	prio_nombre varchar(100) not null CONSTRAINT DF_Prioridad_prio_nombre  default (''),
	prio_codigo varchar(15) not null CONSTRAINT DF_Prioridad_prio_alias  default (''),
	modificado timestamptz not null CONSTRAINT DF_Prioridad_modificado  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_Prioridad_creado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Prioridad_activo  default (1),
 CONSTRAINT PK_Prioridad PRIMARY KEY  
(
	prio_id 
) 
) 
;

;
/****** Object:  Table DepositoFisico    Script Date: 07/30/2012 17:08:34 ******/

;

;

;
create table DepositoFisico(
	depf_id int not null,
	depf_nombre varchar(100) not null,
	depf_codigo varchar(30) not null,
	depf_descrip varchar(255) not null CONSTRAINT DF_DepositoFisico_depf_descripcion  default (''),
	depf_tel varchar(100) not null CONSTRAINT DF_DepositoFisico_depf_tel  default (''),
	depf_dir varchar(255) not null CONSTRAINT DF_DepositoFisico_depf_dir  default (''),
	creado timestamptz not null CONSTRAINT DF_DepositoFisico_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_DepositoFisico_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_DepositoFisico_activo  default (1),
 CONSTRAINT PK_DepositoFisico PRIMARY KEY  
(
	depf_id 
) 
) 
;

;
/****** Object:  Table EncuestaRespuesta    Script Date: 07/30/2012 17:10:20 ******/

;

;

;
create table EncuestaRespuesta(
	ecr_id int not null,
	ecpi_id int not null,
	ecr_infoAdicional varchar(255) not null,
	us_id int not null,
	creado timestamptz not null CONSTRAINT DF_EncuestaRespuesta_creado  default (getdate()),
 CONSTRAINT PK_EncuestaRespuesta PRIMARY KEY  
(
	ecr_id 
) 
) 
;

;
/****** Object:  Table TarifaGasto    Script Date: 07/30/2012 17:31:16 ******/

;

;
create table TarifaGasto(
	trfg_id int not null,
	trfg_fijo decimal(18, 6) not null CONSTRAINT DF_TarifaGasto_trfg_fijo  default (0),
	trfg_minimo decimal(18, 6) not null CONSTRAINT DF_TarifaGasto_trfg_minimo  default (0),
	trfg_importe decimal(18, 6) not null CONSTRAINT DF_TarifaGasto_trfg_porcentaje  default (0),
	gto_id int not null,
	trf_id int not null,
	creado timestamptz not null CONSTRAINT DF_TarifaGasto_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_TarifaGasto_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_TarifaGasto_activo  default (1),
 CONSTRAINT PK_TarifaGasto PRIMARY KEY  
(
	trfg_id 
) 
) 
;
/****** Object:  Table ProductoKit    Script Date: 07/30/2012 17:25:58 ******/

;

;
create table ProductoKit(
	prfk_id int not null,
	prk_id int not null,
	prk_cantidad decimal(18, 6) not null CONSTRAINT DF_ProductoKit_prk_cantidad  default (0),
	prk_variable smallint not null CONSTRAINT DF_ProductoKit_prk_variable  default (0),
	pr_id_item int not null,
	creado timestamptz not null CONSTRAINT DF_ProductoKit_creado  default (getdate()),
	modifico int not null,
	modificado timestamptz not null CONSTRAINT DF_ProductoKit_modificado  default (getdate()),
 CONSTRAINT PK_ProductoKit PRIMARY KEY  
(
	prk_id 
) 
) 
;
/****** Object:  Table StockValor    Script Date: 07/30/2012 17:30:37 ******/

;

;

;
create table StockValor(
	stv_id int not null,
	stv_fecha timestamptz not null default (getdate()),
	stv_numero int not null,
	stv_descrip varchar(5000) not null default (''),
	stv_descrip2 varchar(5000) not null default (''),
	creado timestamptz not null default (getdate()),
	modificado timestamptz not null default (getdate()),
	modifico int not null,
 CONSTRAINT stv_id_PK PRIMARY KEY  
(
	stv_id 
) 
) 
;

;
/****** Object:  Table TipoOperacion    Script Date: 07/30/2012 17:31:43 ******/

;

;

;
create table TipoOperacion(
	to_id int not null,
	to_nombre varchar(100) not null,
	to_codigo varchar(15) not null,
	to_generadeuda smallint not null CONSTRAINT DF_TipoOperacion_to_generadeuda  default (1),
	to_descrip varchar(255) not null CONSTRAINT DF_TipoOperacion_to_descrip  default (''),
	creado timestamptz not null CONSTRAINT DF_TipoOperacion_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_TipoOperacion_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_TipoOperacion_activo  default (1),
 CONSTRAINT PK_TipoOperacion PRIMARY KEY  
(
	to_id 
) 
) 
;

;
/****** Object:  Table ImportacionID    Script Date: 07/30/2012 17:14:00 ******/

;

;

;
create table ImportacionID(
	impid_id int not null,
	impid_fecha timestamptz not null CONSTRAINT DF_ImportacionID_impid_fecha  default (getdate()),
	impid_descrip varchar(5000) not null default (''),
	impidt_id int not null,
	us_id int not null,
 CONSTRAINT PK_ImportacionID PRIMARY KEY  
(
	impid_id 
) 
) 
;

;
/****** Object:  Table Especie    Script Date: 07/30/2012 17:10:30 ******/

;

;

;
create table Especie(
	esp_id int not null,
	esp_nombre varchar(100) not null,
	esp_codigo varchar(15) not null,
	esp_descrip varchar(255) not null CONSTRAINT DF_Especie_esp_descrip  default (''),
	creado timestamptz not null CONSTRAINT DF_Especie_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Especie_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Especie_activo  default (1),
 CONSTRAINT PK_Especie PRIMARY KEY  
(
	esp_id 
) 
) 
;

;
/****** Object:  Table ExpoFamilia    Script Date: 07/30/2012 17:10:38 ******/

;

;

;
create table ExpoFamilia(
	efm_id int not null,
	efm_nombre varchar(100) not null,
	efm_codigo varchar(15) not null,
	creado timestamptz not null CONSTRAINT DF_ExpoFamilia_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ExpoFamilia_modificado  default (getdate()),
	modifico int not null CONSTRAINT DF_ExpoFamilia_modifico  default (0),
	activo smallint not null CONSTRAINT DF_ExpoFamilia_activo  default (1),
 CONSTRAINT PK_ExpoFamilia PRIMARY KEY  
(
	efm_id 
) 
) 
;

;
/****** Object:  Table ExpoGrupoPrecio    Script Date: 07/30/2012 17:10:40 ******/

;

;

;
create table ExpoGrupoPrecio(
	egp_id int not null,
	egp_nombre varchar(100) not null,
	egp_codigo varchar(15) not null,
	egp_posarancel varchar(50) not null CONSTRAINT DF_ExpoGrupoPrecio_egp_posarancel  default (''),
	creado timestamptz not null CONSTRAINT DF_ExpoGrupoPrecio_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ExpoGrupoPrecio_modificado  default (getdate()),
	modifico int not null CONSTRAINT DF_ExpoGrupoPrecio_modifico  default (0),
	activo smallint not null CONSTRAINT DF_ExpoGrupoPrecio_activo  default (1),
 CONSTRAINT PK_ExpoGrupoPrecio PRIMARY KEY  
(
	egp_id 
) 
) 
;

;
/****** Object:  Table Aviso    Script Date: 07/30/2012 17:03:40 ******/

;

;

;
create table Aviso(
	av_id int not null,
	av_descrip varchar(255) not null CONSTRAINT DF_Aviso_av_descrip  default (''),
	id varchar(255) not null CONSTRAINT DF_Aviso_id  default (''),
	av_leido smallint not null CONSTRAINT DF_Aviso_av_leido  default (0),
	avt_id int not null,
	us_id int not null,
	creado timestamptz not null CONSTRAINT DF_Aviso_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Aviso_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Aviso_activo  default (1),
 CONSTRAINT PK_Aviso PRIMARY KEY  
(
	av_id 
) 
) 
;

;
/****** Object:  Table Banco    Script Date: 07/30/2012 17:03:44 ******/

;

;

;
create table Banco(
	bco_id int not null,
	bco_nombre varchar(100) not null,
	bco_codigo varchar(15) not null,
	bco_contacto varchar(500) not null CONSTRAINT DF_Banco_bco_contacto  default (''),
	bco_telefono varchar(255) not null CONSTRAINT DF_Banco_bco_telefono  default (''),
	bco_direccion varchar(255) not null CONSTRAINT DF_Banco_bco_direccion  default (''),
	bco_web varchar(255) not null CONSTRAINT DF_Banco_bco_web  default (''),
	bco_mail varchar(255) not null CONSTRAINT DF_Banco_bco_mail  default (''),
	creado timestamptz not null CONSTRAINT DF_Banco_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Banco_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Banco_activo  default (1),
 CONSTRAINT PK_Banco PRIMARY KEY  
(
	bco_id 
) 
) 
;

;
/****** Object:  Table ParteDiarioTipo    Script Date: 07/30/2012 17:20:24 ******/

;

;

;
create table ParteDiarioTipo(
	ptdt_id int not null,
	ptdt_nombre varchar(100) not null,
	ptdt_codigo varchar(15) not null,
	ptdt_descrip varchar(255) not null CONSTRAINT DF_ParteDiarioTipo_ptdt_descrip  default (''),
	modificado timestamptz not null CONSTRAINT DF_ParteDiarioTipo_modificado  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_ParteDiarioTipo_creado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_ParteDiarioTipo_activo  default (1),
 CONSTRAINT PK_ParteDiarioTipo PRIMARY KEY  
(
	ptdt_id 
) 
) 
;

;
/****** Object:  Table PersonaDocumentoTipo    Script Date: 07/30/2012 17:23:08 ******/

;

;

;
create table PersonaDocumentoTipo(
	prsdt_id int not null,
	prsdt_nombre varchar(100) not null,
	prsdt_codigo varchar(15) not null,
	prsdt_descrip varchar(255) not null CONSTRAINT DF_PersonaDocumentoTipo_prsdt_descrip  default (''),
	creado timestamptz not null CONSTRAINT DF_PersonaDocumentoTipo_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_PersonaDocumentoTipo_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_PersonaDocumentoTipo_activo  default (1),
 CONSTRAINT PK_PersonaDocumentoTipo PRIMARY KEY  
(
	prsdt_id 
) 
) 
;

;
/****** Object:  Table ConfiguracionCalibradora    Script Date: 07/30/2012 17:06:54 ******/

;

;

;
create table ConfiguracionCalibradora(
	calibc_id int not null,
	calibc_nombre varchar(100) not null,
	calibc_descrip varchar(255) not null CONSTRAINT DF_CalibradoraC_calibc_descrip  default (''),
	calibc_codigo varchar(15) not null,
	creado timestamptz not null CONSTRAINT DF_CalibradoraC_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_CalibradoraC_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_CalibradoraC_activo  default (1),
 CONSTRAINT PK_CalibradoraC PRIMARY KEY  
(
	calibc_id 
) 
) 
;

;
/****** Object:  Table Arbol    Script Date: 07/30/2012 17:03:17 ******/

;

;

;
create table Arbol(
	arb_id int not null,
	arb_nombre varchar(100) not null,
	modificado timestamptz not null CONSTRAINT DF_Arbol_modificado  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_Arbol_creado  default (getdate()),
	tbl_Id int not null,
	modifico int not null,
 CONSTRAINT PK_Arbol PRIMARY KEY  
(
	arb_id 
) 
) 
;

;
/****** Object:  Table Aula    Script Date: 07/30/2012 17:03:37 ******/

;

;

;
create table Aula(
	aula_id int not null,
	aula_nombre varchar(100) not null,
	aula_codigo varchar(15) not null,
	aula_descrip varchar(255) not null CONSTRAINT DF_Aula_aula_descrip  default (''),
	creado timestamptz not null CONSTRAINT DF_Aula_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Aula_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Aula_activo  default (1),
 CONSTRAINT PK_Aula PRIMARY KEY  
(
	aula_id 
) 
) 
;

;
/****** Object:  Table Unidad    Script Date: 07/30/2012 17:31:56 ******/

;

;

;
create table Unidad(
	un_id int not null,
	un_nombre varchar(100) not null,
	un_codigo varchar(15) not null,
	creado timestamptz not null CONSTRAINT DF_Unidad_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Unidad_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Unidad_activo  default (1),
 CONSTRAINT PK_Unidad PRIMARY KEY  
(
	un_id 
) 
) 
;

;
/****** Object:  Table Sucursal    Script Date: 07/30/2012 17:30:41 ******/

;

;

;
create table Sucursal(
	suc_id int not null,
	suc_nombre varchar(100) not null,
	suc_codigo varchar(15) not null,
	suc_descrip varchar(255) not null CONSTRAINT DF_Sucursal_suc_descrip  default (''),
	suc_numero int not null CONSTRAINT DF_Sucursal_suc_numero  default (0),
	creado timestamptz not null CONSTRAINT DF_Sucursal_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Sucursal_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Sucursal_activo  default (1),
 CONSTRAINT PK_Sucursal PRIMARY KEY  
(
	suc_id 
),
 CONSTRAINT IX_SucursalNumero UNIQUE  
(
	suc_numero 
) 
) 
;

;
/****** Object:  Table Vendedor    Script Date: 07/30/2012 17:32:09 ******/

;

;

;
create table Vendedor(
	ven_id int not null,
	ven_nombre varchar(100) not null,
	ven_codigo varchar(15) not null,
	ven_descrip varchar(255) not null CONSTRAINT DF_Vendedor_ven_descrip  default (''),
	us_id int null,
	activo smallint not null CONSTRAINT DF__Vendedor__activo__24BD5A91  default (1),
	creado timestamptz not null CONSTRAINT DF__Vendedor__creado__25B17ECA  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF__Vendedor__modifi__26A5A303  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_Vendedor PRIMARY KEY  
(
	ven_id 
) 
) 
;

;
/****** Object:  Table Importacion    Script Date: 07/30/2012 17:13:58 ******/

;

;

;
create table Importacion(
	imp_id int not null,
	imp_origenTabla varchar(255) not null CONSTRAINT DF_Importacion_imp_origenTabla  default (''),
	imp_origenSqlstmt varchar(255) not null CONSTRAINT DF_Importacion_imp_origenSqlstmt  default (''),
	imp_origenPath varchar(500) not null CONSTRAINT DF_Importacion_imp_origenPath  default (''),
	imp_destinoTabla varchar(255) not null CONSTRAINT DF_Importacion_imp_destinoTabla  default (''),
	imp_nombre varchar(100) not null,
	imp_descrip varchar(255) not null CONSTRAINT DF_Importacion_imp_descrip  default (''),
	creado timestamptz not null CONSTRAINT DF_Importacion_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Importacion_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_Importacion PRIMARY KEY  
(
	imp_id 
) 
) 
;

;
/****** Object:  Table Calibradora    Script Date: 07/30/2012 17:04:00 ******/

;

;

;
create table Calibradora(
	calib_id int not null,
	calib_nombre varchar(100) not null,
	calib_descrip varchar(255) not null CONSTRAINT DF_Calibradora_calib_descrip  default (''),
	calib_codigo varchar(15) not null,
	creado timestamptz not null CONSTRAINT DF_Calibradora_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Calibradora_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Calibradora_activo  default (1),
 CONSTRAINT PK_Calibradora PRIMARY KEY  
(
	calib_id 
) 
) 
;

;
/****** Object:  Table ComunidadInternetEmailAccount    Script Date: 07/30/2012 17:06:17 ******/

;

;

;
create table ComunidadInternetEmailAccount(
	cmiea_id int not null,
	cmiea_nombre varchar(255) not null,
	cmiea_codigo varchar(50) not null CONSTRAINT DF_ComunidadInternetEmailAccount_cmiea_codigo  default (''),
	cmiea_email_server varchar(1000) not null,
	cmiea_email_user varchar(255) not null,
	cmiea_email_pwd varchar(255) not null,
	cmiea_server varchar(255) not null,
	cmiea_user varchar(50) not null,
	cmiea_pwd varchar(50) not null,
	creado timestamptz not null CONSTRAINT DF_ComunidadInternetEmailAccount_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ComunidadInternetEmailAccount_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_ComunidadInternetEmailAccount_activo  default (1),
 CONSTRAINT PK_ComunidadInternetEmailAccount PRIMARY KEY  
(
	cmiea_id 
) 
) 
;

;
/****** Object:  Table Marca    Script Date: 07/30/2012 17:16:59 ******/

;

;

;
create table Marca(
	marc_id int not null,
	marc_nombre varchar(100) not null,
	marc_codigo varchar(15) not null,
	marc_descrip varchar(255) not null CONSTRAINT DF_Marca_marc_descrip  default (''),
	marc_textoweb varchar(5000) not null CONSTRAINT DF_Marca_marc_textoweb  default (''),
	creado timestamptz not null CONSTRAINT DF_Marca_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Marca_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Marca_activo  default (1),
 CONSTRAINT PK_Marca PRIMARY KEY  
(
	marc_id 
) 
) 
;

;
/****** Object:  Table Puerto    Script Date: 07/30/2012 17:27:17 ******/

;

;

;
create table Puerto(
	pue_id int not null,
	pue_nombre varchar(100) not null,
	pue_codigo varchar(15) not null,
	pue_descrip varchar(255) not null CONSTRAINT DF_Puerto_pue_descrip  default (''),
	ciu_id int not null,
	creado timestamptz not null CONSTRAINT DF_Puerto_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Puerto_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Puerto_activo  default (1),
 CONSTRAINT PK_Puerto PRIMARY KEY  
(
	pue_id 
) 
) 
;

;
/****** Object:  Table Barco    Script Date: 07/30/2012 17:03:52 ******/

;

;

;
create table Barco(
	barc_id int not null,
	barc_nombre varchar(100) not null,
	barc_codigo varchar(15) not null,
	barc_descrip varchar(255) not null CONSTRAINT DF_Barco_barc_descrip  default (''),
	creado timestamptz not null CONSTRAINT DF_Barco_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Barco_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Barco_activo  default (1),
 CONSTRAINT PK_Barco PRIMARY KEY  
(
	barc_id 
) 
) 
;

;
/****** Object:  Table LiquidacionPlantilla    Script Date: 07/30/2012 17:15:46 ******/

;

;

;
create table LiquidacionPlantilla(
	liqp_id int not null,
	liqp_nombre varchar(100) not null,
	liqp_codigo varchar(15) not null,
	liqp_descrip varchar(255) not null,
	creado timestamptz not null CONSTRAINT DF_PlantillaLiquidacion_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_PlantillaLiquidacion_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_PlantillaLiquidacion_activo  default (1),
 CONSTRAINT PK_PlantillaLiquidacion PRIMARY KEY  
(
	liqp_id 
) 
) 
;

;
/****** Object:  Table EmpleadoAsistenciaTipo    Script Date: 07/30/2012 17:09:39 ******/

;

;

;
create table EmpleadoAsistenciaTipo(
	east_id int not null,
	east_nombre varchar(100) not null,
	east_codigo varchar(15) not null,
	east_descrip varchar(255) not null,
	creado timestamptz not null CONSTRAINT DF_EmpleadoAsistencia_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_EmpleadoAsistencia_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_EmpleadoAsistencia_activo  default (1),
 CONSTRAINT PK_EmpleadoAsistencia PRIMARY KEY  
(
	east_id 
) 
) 
;

;
/****** Object:  Table DocumentoTipo    Script Date: 07/30/2012 17:09:12 ******/

;

;

;
create table DocumentoTipo(
	doct_id int not null,
	doct_nombre varchar(100) not null,
	doct_codigo varchar(15) not null,
	doct_grupo varchar(255) not null CONSTRAINT DF_DocumentoTipo_doct_grupo_1  default (''),
	doct_object varchar(255) not null CONSTRAINT DF_DocumentoTipo_doct_object  default (''),
	pre_id int not null CONSTRAINT DF_DocumentoTipo_pre_id  default (0),
	creado timestamptz not null CONSTRAINT DF_DocumentoTipo_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_DocumentoTipo_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_DocumentoTipo_activo  default (1),
 CONSTRAINT PK_DocumentoTipo PRIMARY KEY  
(
	doct_id 
) 
) 
;

;
/****** Object:  Table LiquidacionFormula    Script Date: 07/30/2012 17:15:33 ******/

;

;

;
create table LiquidacionFormula(
	liqf_id int not null,
	liqf_nombre varchar(100) not null,
	liqf_codigo varchar(15) not null,
	liqf_descrip varchar(255) not null,
	liqf_formula varchar(7000) not null CONSTRAINT DF_LiquidacionFormula_liqf_formula  default (''),
	creado timestamptz not null CONSTRAINT DF_LiquidacionFormula_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_LiquidacionFormula_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_LiquidacionFormula_activo  default (1),
 CONSTRAINT PK_LiquidacionFormula PRIMARY KEY  
(
	liqf_id 
) 
) 
;

;
/****** Object:  Table Maquina    Script Date: 07/30/2012 17:16:57 ******/

;

;

;
create table Maquina(
	maq_id int not null,
	maq_nombre varchar(100) not null,
	maq_codigo varchar(15) not null,
	maq_descrip varchar(255) not null CONSTRAINT DF_Maquina_maq_descrip  default (''),
	creado timestamptz not null CONSTRAINT DF_maquina_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_maquina_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_maquina_activo  default (1),
 CONSTRAINT PK_maquina PRIMARY KEY  
(
	maq_id 
) 
) 
;

;
/****** Object:  Table CuentaCategoria    Script Date: 07/30/2012 17:07:38 ******/

;

;

;
create table CuentaCategoria(
	cuec_id int not null,
	cuec_nombre varchar(100) not null,
	cuec_codigo varchar(15) not null,
	creado timestamptz not null CONSTRAINT DF_CuentaCategoria2_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_CuentaCategoria2_modificado  default (getdate()),
	modifico int not null,
	cuec_tipo smallint not null CONSTRAINT DF__cuentacat__cuec___7C8F6DA6  default (0),
 CONSTRAINT PK_CuentaCategoria PRIMARY KEY  
(
	cuec_id 
) 
) 
;

;
/****** Object:  Table Calidad    Script Date: 07/30/2012 17:04:02 ******/

;

;

;
create table Calidad(
	calid_id int not null,
	calid_nombre varchar(100) not null,
	calid_codigo varchar(15) not null,
	calid_descrip varchar(255) not null CONSTRAINT DF_Calidad_calid_descrip  default (''),
	creado timestamptz not null CONSTRAINT DF_Calidad_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Calidad_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Calidad_activo  default (1),
 CONSTRAINT PK_Calidad PRIMARY KEY  
(
	calid_id 
) 
) 
;

;
/****** Object:  Table Colmena    Script Date: 07/30/2012 17:06:04 ******/

;

;

;
create table Colmena(
	colm_id int not null,
	colm_codigo varchar(15) not null,
	colm_descrip varchar(255) not null,
	colm_poblacion smallint not null CONSTRAINT DF_Colmena_colm_poblacion  default (0),
	colm_alimento smallint not null CONSTRAINT DF_Colmena_colm_alimento  default (0),
	colm_criaHuevo smallint not null CONSTRAINT DF_Colmena_colm_criaHuevo  default (0),
	colm_criaAbierta smallint not null CONSTRAINT DF_Colmena_colm_criaAbierta  default (0),
	colm_criaOperculada smallint not null CONSTRAINT DF_Colmena_colm_criaOperculada  default (0),
	colm_zanganera smallint not null CONSTRAINT DF_Colmena_colm_zanganera  default (0),
	colm_fechaAlta timestamptz not null CONSTRAINT DF_Colmena_colm_fechaAlta  default (getdate()),
	colm_tipo smallint not null CONSTRAINT DF_Colmena_colm_tipo  default (0),
	creado timestamptz not null CONSTRAINT DF_Colmena_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Colmena_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Colmena_activo  default (1),
 CONSTRAINT PK_Colmena PRIMARY KEY  
(
	colm_id 
) 
) 
;

;
/****** Object:  Table Materia    Script Date: 07/30/2012 17:17:01 ******/

;

;

;
create table Materia(
	mat_id int not null,
	mat_nombre varchar(100) not null,
	mat_codigo varchar(15) not null,
	mat_descrip varchar(255) not null CONSTRAINT DF_Materia_mat_descrip  default (''),
	creado timestamptz not null CONSTRAINT DF_Materia_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Materia_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Materia_activo  default (1),
 CONSTRAINT PK_Materia PRIMARY KEY  
(
	mat_id 
) 
) 
;

;
/****** Object:  Table Historia    Script Date: 07/30/2012 17:13:27 ******/

;

;

;
create table Historia(
	hst_id int  not null,
	hst_operacion smallint not null CONSTRAINT DF__Historia__hst_op__053F51A1  default (0),
	hst_descrip varchar(7500) null CONSTRAINT DF_Historia_hst_descrip  default (''),
	tbl_id int not null,
	id int not null,
	modifico int not null,
	modificado timestamptz not null CONSTRAINT DF_Historia_modificado  default (getdate()),
 CONSTRAINT PK_Historia PRIMARY KEY  
(
	hst_id 
) 
) 
;

;
/****** Object:  Table Rol    Script Date: 07/30/2012 17:29:35 ******/

;

;

;
create table Rol(
	rol_id int not null,
	rol_nombre varchar(100) not null,
	rol_descrip varchar(255) not null CONSTRAINT DF_Rol_rol_descrip  default (''),
	modificado timestamptz not null CONSTRAINT DF_Rol_modificado  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_Rol_creado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Rol_activo  default (1),
 CONSTRAINT PK_Rol PRIMARY KEY  
(
	rol_id 
) 
) 
;

;
/****** Object:  Table AFIPEsquema    Script Date: 07/30/2012 17:02:28 ******/

;

;

;
create table AFIPEsquema(
	afesq_id int not null,
	afesq_nombre varchar(100) not null,
	afesq_codigo varchar(15) not null,
	afesq_descrip varchar(255) not null CONSTRAINT DF_AFIPEsquema_afesq_descrip  default (''),
	afesq_objetodll varchar(255) not null CONSTRAINT DF_AFIPEsquema_afesq_objetodll  default (''),
	creado timestamptz not null CONSTRAINT DF_AFIPEsquema_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_AFIPEsquema_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_AFIPEsquema_activo  default (1),
 CONSTRAINT PK_AFIPEsquema PRIMARY KEY  
(
	afesq_id 
) 
) 
;

;
/****** Object:  Table ContraMarca    Script Date: 07/30/2012 17:07:04 ******/

;

;

;
create table ContraMarca(
	cmarc_id int not null,
	cmarc_nombre varchar(100) not null,
	cmarc_codigo varchar(15) not null,
	cmarc_descrip varchar(255) not null CONSTRAINT DF_ContraMarca_cmarc_descrip  default (''),
	creado timestamptz not null CONSTRAINT DF_ContraMarca_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ContraMarca_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_ContraMarca_activo  default (1),
 CONSTRAINT PK_ContraMarca PRIMARY KEY  
(
	cmarc_id 
) 
) 
;

;
/****** Object:  Table Moneda    Script Date: 07/30/2012 17:17:04 ******/

;

;

;
create table Moneda(
	mon_id int not null,
	mon_nombre varchar(100) not null,
	mon_codigo varchar(15) not null,
	mon_signo varchar(5) not null,
	mon_legal smallint not null CONSTRAINT DF_Moneda_mon_legal  default (0),
	mon_codigodgi1 varchar(255) not null CONSTRAINT DF_Moneda_ti_codigodgi1  default (''),
	mon_codigodgi2 varchar(255) not null CONSTRAINT DF_Moneda_ti_codigodgi2  default (''),
	activo smallint not null CONSTRAINT DF_Moneda_activo  default (1),
	modifico int not null,
	creado timestamptz not null CONSTRAINT DF_Moneda_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Moneda_modificado  default (getdate()),
 CONSTRAINT PK_Moneda PRIMARY KEY  
(
	mon_id 
) 
) 
;

;
/****** Object:  Table IngresosBrutosCategoria    Script Date: 07/30/2012 17:14:56 ******/

;

;

;
create table IngresosBrutosCategoria(
	ibc_id int not null,
	ibc_nombre varchar(100) not null,
	ibc_codigo varchar(15) not null,
	ibc_descrip varchar(255) not null CONSTRAINT DF_IngresosBrutosCategoria_ibc_descripcion  default (''),
	creado timestamptz not null CONSTRAINT DF_IngresosBrutosCategoria_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_IngresosBrutosCategoria_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_IngresosBrutosCategoria PRIMARY KEY  
(
	ibc_id 
) 
) 
;

;
/****** Object:  Table DocumentoDigital    Script Date: 07/30/2012 17:09:04 ******/

;

;

;
create table DocumentoDigital(
	dd_id int not null,
	dd_nombre varchar(255) not null,
	dd_codigo varchar(255) null,
	dd_formato varchar(10) not null,
	dd_fileName varchar(255) not null,
	dd_path varchar(255) not null,
	dd_file bytea null,
	dd_clientTable varchar(100) not null,
	dd_clientTableId int not null,
	dd_modificado timestamptz not null CONSTRAINT DF_DocumentoDigital_dd_modificado  default (getdate()),
	dd_comprimido smallint not null CONSTRAINT DF_DocumentoDigital_dd_comprimido  default (0),
	creado timestamptz not null CONSTRAINT DF_DocumentoDigital_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_DocumentoDigital_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_DocumentoDigital PRIMARY KEY  
(
	dd_id 
) 
) 
;

;
/****** Object:  Table ProductoBOM    Script Date: 07/30/2012 17:25:32 ******/

;

;

;
create table ProductoBOM(
	pbm_id int not null,
	pbm_nombre varchar(100) not null,
	pbm_codigo varchar(50) not null,
	pbm_descrip varchar(255) not null CONSTRAINT DF_ProductoBOM_bom_descrip  default (''),
	pbm_fechaAuto timestamptz not null CONSTRAINT DF_ProductoBOM_bom_fechaAuto  default ('19000101'),
	pbm_merma decimal(18, 6) not null CONSTRAINT DF_ProductoBOM_pbm_merma  default (0),
	pbm_varpos decimal(18, 6) not null CONSTRAINT DF_ProductoBOM_pbm_varpos  default (0),
	pbm_varneg decimal(18, 6) not null CONSTRAINT DF_ProductoBOM_pbm_varneg  default (0),
	pbm_vartipo smallint not null CONSTRAINT DF_ProductoBOM_pbm_vartipo  default (0),
	pbm_default smallint not null CONSTRAINT DF_ProductoBOM_pbm_default  default (0),
	creado timestamptz not null CONSTRAINT DF_ProductoBOM_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ProductoBOM_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_ProductoBOM_activo  default (1),
 CONSTRAINT PK_ProductoBOM PRIMARY KEY  
(
	pbm_id 
) 
) 
;

;
/****** Object:  Table ImportacionProceso    Script Date: 07/30/2012 17:14:06 ******/

;

;

;
create table ImportacionProceso(
	impp_id int not null,
	impp_nombre varchar(100) not null,
	impp_codigo varchar(15) not null,
	impp_descrip varchar(255) not null CONSTRAINT DF_ImportacionProceso_impp_descrip  default (''),
	creado timestamptz not null CONSTRAINT DF_ImportacionProceso_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ImportacionProceso_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_ImportacionProceso_activo  default (1),
 CONSTRAINT PK_ImportacionProceso PRIMARY KEY  
(
	impp_id 
) 
) 
;

;
/****** Object:  Table TareaEstado    Script Date: 07/30/2012 17:31:11 ******/

;

;

;
create table TareaEstado(
	tarest_id int not null,
	tarest_nombre varchar(100) not null CONSTRAINT DF_TareaEstado_tarest_nombre  default (''),
	tarest_codigo varchar(15) not null CONSTRAINT DF_TareaEstado_tarest_alias  default (''),
	tarest_default smallint not null CONSTRAINT DF_TareaEstado_tarest_default  default (0),
	creado timestamptz not null CONSTRAINT DF_TareaEstado_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_TareaEstado_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_TareaEstado_activo  default (1),
 CONSTRAINT PK_TareaEstado PRIMARY KEY  
(
	tarest_id 
) 
) 
;

;
/****** Object:  Table Idioma    Script Date: 07/30/2012 17:13:55 ******/

;

;

;
create table Idioma(
	idm_id int not null,
	idm_nombre varchar(100) not null,
	idm_codigo varchar(15) not null,
	creado timestamptz not null CONSTRAINT DF_Idioma_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Idioma_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Idioma_activo  default (1),
 CONSTRAINT PK_Idioma PRIMARY KEY  
(
	idm_id 
) 
) 
;

;
/****** Object:  Table AFIPRegistro    Script Date: 07/30/2012 17:02:34 ******/

;

;

;
create table AFIPRegistro(
	afreg_id int not null,
	afreg_nombre varchar(100) not null,
	afreg_descrip varchar(255) not null CONSTRAINT DF_AFIPRegistro_afreg_descrip  default (''),
	afreg_objetoproceso varchar(255) not null,
	afarch_id int not null,
	creado timestamptz not null CONSTRAINT DF_AFIPRegistro_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_AFIPRegistro_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_AFIPRegistro_activo  default (1),
 CONSTRAINT PK_AFIPRegistro PRIMARY KEY  
(
	afreg_id 
) 
) 
;

;
/****** Object:  Table EmpleadoPeriodo    Script Date: 07/30/2012 17:09:50 ******/

;

;

;
create table EmpleadoPeriodo(
	empe_id int not null,
	empe_numero int not null CONSTRAINT DF_EmpleadoPeriodo_empe_numero  default (0),
	empe_fecha timestamptz not null,
	empe_desde timestamptz not null,
	empe_hasta timestamptz not null,
	empe_tipo smallint not null,
	empe_descrip varchar(5000) not null CONSTRAINT DF_EmpleadoPeriodo_empe_descrip  default (''),
	cico_id int null,
	ccos_id int null,
	creado timestamptz not null CONSTRAINT DF_EmpleadoPeriodo_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_EmpleadoPeriodo_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_EmpleadoPeriodo PRIMARY KEY  
(
	empe_id 
) 
) 
;

;
/****** Object:  Table Profesor    Script Date: 07/30/2012 17:26:36 ******/

;

;

;
create table Profesor(
	prof_id int not null,
	prof_codigo varchar(50) not null,
	prof_legajo varchar(255) not null CONSTRAINT DF_Profesor_prof_legajo  default (''),
	prof_fechaingreso timestamptz not null CONSTRAINT DF_Profesor_prof_fechaingreso  default ('19000101'),
	prof_descrip varchar(5000) not null CONSTRAINT DF_Profesor_prof_descrip  default (''),
	prs_id int not null,
	creado timestamptz not null CONSTRAINT DF_Profesor_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Profesor_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Profesor_activo  default (1),
 CONSTRAINT PK_Profesor PRIMARY KEY  
(
	prof_id 
) 
) 
;

;
/****** Object:  Table Empresa    Script Date: 07/30/2012 17:10:00 ******/

;

;

;
create table Empresa(
	emp_id int not null,
	emp_nombre varchar(255) not null,
	emp_codigo varchar(15) not null,
	emp_codigobarra varchar(255) not null CONSTRAINT DF_Empresa_emp_codigobarra  default (''),
	emp_descrip varchar(255) not null CONSTRAINT DF_Empresa_emp_descrip  default (''),
	emp_razonsocial varchar(255) not null CONSTRAINT DF_Empresa_prov_razonsocial  default (''),
	emp_cuit varchar(50) not null CONSTRAINT DF_Empresa_prov_cuit  default (''),
	emp_ingresosbrutos varchar(20) not null CONSTRAINT DF_Empresa_prov_ingresosbrutos  default (''),
	emp_catfiscal smallint not null CONSTRAINT DF_Empresa_prov_catfiscal  default (1),
	emp_chequeorden varchar(100) not null CONSTRAINT DF_Empresa_prov_chequeorden  default (''),
	emp_codpostal varchar(50) not null CONSTRAINT DF_Empresa_prov_codpostal  default (''),
	emp_localidad varchar(100) not null CONSTRAINT DF_Empresa_emp_localidad  default (''),
	emp_calle varchar(100) not null CONSTRAINT DF_Empresa_prov_calle  default (''),
	emp_callenumero varchar(100) not null CONSTRAINT DF_Empresa_prov_callenumero  default ('s/n'),
	emp_piso varchar(100) not null CONSTRAINT DF_Empresa_prov_piso  default ('PB'),
	emp_depto varchar(100) not null CONSTRAINT DF_Empresa_prov_depto  default (''),
	emp_tel varchar(100) not null CONSTRAINT DF_Empresa_prov_tel  default (''),
	emp_fax varchar(100) not null CONSTRAINT DF_Empresa_prov_fax  default (''),
	emp_email varchar(100) not null CONSTRAINT DF_Empresa_prov_email  default (''),
	emp_web varchar(100) not null CONSTRAINT DF_Empresa_prov_web  default (''),
	emp_essucursal smallint not null CONSTRAINT DF_Empresa_emp_escasacentral  default (0),
	creado timestamptz not null CONSTRAINT DF_Empresa_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Empresa_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Empresa_activo  default (1),
 CONSTRAINT PK_Empresa PRIMARY KEY  
(
	emp_id 
) 
) 
;

;
/****** Object:  Table LegajoTipo    Script Date: 07/30/2012 17:15:06 ******/

;

;

;
create table LegajoTipo(
	lgjt_id int not null,
	lgjt_nombre varchar(100) not null,
	lgjt_codigo varchar(15) not null,
	lgjt_descrip varchar(255) not null,
	modificado timestamptz not null CONSTRAINT DF_LegajoTipo_modificado  default (getdate()),
	creado timestamptz not null CONSTRAINT DF_LegajoTipo_creado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_LegajoTipo_activo  default (1),
 CONSTRAINT PK_LegajoTipo PRIMARY KEY  
(
	lgjt_id 
) 
) 
;

;
/****** Object:  Table FacturaCompraOtroTMP    Script Date: 07/30/2012 17:11:38 ******/

;

;

;
create table FacturaCompraOtroTMP(
	fcTMP_id int not null,
	fcotTMP_id int not null,
	fcot_id int not null,
	fcot_orden smallint not null CONSTRAINT DF_FacturaCompraOtroTMP_fcot_orden  default (0),
	fcot_debe decimal(18, 6) not null CONSTRAINT DF_FacturaCompraOtroTMP_fcot_debe  default (0),
	fcot_haber decimal(18, 6) not null CONSTRAINT DF_FacturaCompraOtroTMP_fcot_haber  default (0),
	fcot_origen decimal(18, 6) not null CONSTRAINT DF_FacturaCompraOtroTMP_fcot_origen  default (0),
	fcot_descrip varchar(255) not null CONSTRAINT DF_FacturaCompraOtroTMP_fcot_descrip  default (''),
	cue_id int not null,
	ccos_id int null,
 CONSTRAINT PK_FacturaCompraOtroTMP PRIMARY KEY  
(
	fcotTMP_id 
) 
) 
;

;
/****** Object:  Table FacturaCompraPercepcionBorradoTMP    Script Date: 07/30/2012 17:11:42 ******/

;

;
create table FacturaCompraPercepcionBorradoTMP(
	fcTMP_id int not null,
	fcpercbTMP_id int not null,
	fc_id int not null,
	fcperc_id int not null,
 CONSTRAINT PK_FacturaCompraPercepcionBorradoTMP PRIMARY KEY  
(
	fcpercbTMP_id 
) 
) 
;
/****** Object:  Table FacturaCompraOtroBorradoTMP    Script Date: 07/30/2012 17:11:35 ******/

;

;
create table FacturaCompraOtroBorradoTMP(
	fcTMP_id int not null,
	fcotbTMP_id int not null,
	fc_id int not null,
	fcot_id int not null,
 CONSTRAINT PK_FacturaCompraOtroBorradoTMP PRIMARY KEY  
(
	fcotbTMP_id 
) 
) 
;
/****** Object:  Table FacturaCompraItemSerieBTMP    Script Date: 07/30/2012 17:11:09 ******/

;

;
create table FacturaCompraItemSerieBTMP(
	fcTMP_id int not null,
	fcisbTMP_id int not null,
	prns_id int not null CONSTRAINT DF_FacturaCompraItemSerieBTMP_prns_id  default (0),
 CONSTRAINT PK_FacturaCompraItemSerieBTMP PRIMARY KEY  
(
	fcisbTMP_id 
) 
) 
;
/****** Object:  Table FacturaCompraItemBorradoTMP    Script Date: 07/30/2012 17:11:08 ******/

;

;
create table FacturaCompraItemBorradoTMP(
	fcTMP_id int not null,
	fcibTMP_id int not null,
	fc_id int not null,
	fci_id int not null,
 CONSTRAINT PK_FacturaCompraItemBorradoTMP PRIMARY KEY  
(
	fcibTMP_id 
) 
) 
;
/****** Object:  Table FacturaCompraLegajoBorradoTMP    Script Date: 07/30/2012 17:11:21 ******/

;

;
create table FacturaCompraLegajoBorradoTMP(
	fcTMP_id int not null,
	fclgjbTMP_id int not null,
	fc_id int not null,
	fclgj_id int not null,
 CONSTRAINT PK_FacturaCompraLegajoBorradoTMP PRIMARY KEY  
(
	fclgjbTMP_id 
) 
) 
;
/****** Object:  Table FacturaCompraItemTMP    Script Date: 07/30/2012 17:11:18 ******/

;

;

;
create table FacturaCompraItemTMP(
	fcTMP_id int not null,
	fciTMP_id int not null,
	fci_id int not null,
	fci_orden smallint not null,
	fci_cantidad decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItemTMP_fci_cantidad  default (0),
	fci_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItemTMP_fci_cantidadaremitir  default (0),
	fci_pendiente decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItemTMP_fci_pendiente_1  default (0),
	fci_descrip varchar(5000) not null CONSTRAINT DF_FacturaCompraItemTMP_fci_descrip  default (''),
	fci_precio decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItemTMP_fci_precio  default (0),
	fci_precioUsr decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItemTMP_fci_precioUsr  default (0),
	fci_precioLista decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItemTMP_fci_precioLista  default (0),
	fci_descuento varchar(100) not null CONSTRAINT DF_FacturaCompraItemTMP_fci_descuento  default (''),
	fci_neto decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItemTMP_fc_neto  default (0),
	fci_ivari decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItemTMP_fci_ivari  default (0),
	fci_ivarni decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItemTMP_fci_ivarni  default (0),
	fci_ivariporc decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItemTMP_fci_ivariporc  default (0),
	fci_ivarniporc decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItemTMP_fci_ivarniporc  default (0),
	fci_internosporc decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItemTMP_fci_internosporc  default (0),
	fci_internos decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItemTMP_fci_internos  default (0),
	fci_importe decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItemTMP_fci_importe  default (0),
	fci_importeorigen decimal(18, 6) not null CONSTRAINT DF_FacturaCompraItemTMP_fci_importe1  default (0),
	pr_id int not null,
	ccos_id int null,
	cue_id int not null,
	cue_id_ivari int null,
	cue_id_ivarni int null,
	to_id int not null CONSTRAINT DF__FacturaCo__to_id__0104AC69  default (1),
	stl_codigo varchar(50) not null CONSTRAINT DF_FacturaCompraItemTMP_stl_codigo  default (''),
	stl_id int null,
 CONSTRAINT PK_FacturaCompraItemTMP PRIMARY KEY  
(
	fciTMP_id 
) 
) 
;

;
/****** Object:  Table FacturaCompraLegajoTMP    Script Date: 07/30/2012 17:11:23 ******/

;

;

;
create table FacturaCompraLegajoTMP(
	fcTMP_id int not null,
	fclgjTMP_id int not null,
	fclgj_id int not null,
	fclgj_orden smallint not null,
	fclgj_importe decimal(18, 6) not null CONSTRAINT DF_FacturaCompraLegajoTMP_fcljg_importe  default (0),
	fclgj_importeorigen decimal(18, 6) not null CONSTRAINT DF_FacturaCompraLegajoTMP_fclgj_importe1  default (0),
	fclgj_descrip varchar(255) not null CONSTRAINT DF_FacturaCompraLegajoTMP_fcljg_descrip  default (''),
	lgj_id int not null,
 CONSTRAINT PK_FacturaCompraLegajoTMP PRIMARY KEY  
(
	fclgjTMP_id 
) 
) 
;

;
/****** Object:  Table ClientePercepcion    Script Date: 07/30/2012 17:05:23 ******/

;

;
create table ClientePercepcion(
	cli_id int not null,
	cliperc_id int not null,
	perc_id int not null,
	cliperc_desde timestamptz not null CONSTRAINT DF_ClientePercepcion_cliperc_desde  default ('19000101'),
	cliperc_hasta timestamptz not null CONSTRAINT DF_ClientePercepcion_cliperc_hasta  default ('21000101'),
	creado timestamptz not null CONSTRAINT DF_ClienteRetencion_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ClienteRetencion_modificado  default (getdate()),
	modifico int not null,
	cliperc_generadoporproceso smallint not null default (0),
 CONSTRAINT PK_ClientePercepcion PRIMARY KEY  
(
	cliperc_id 
) 
) 
;
/****** Object:  Table ProductoCliente    Script Date: 07/30/2012 17:25:41 ******/

;

;

;
create table ProductoCliente(
	prcli_id int not null,
	prcli_nombre varchar(255) not null CONSTRAINT DF_ProductoCliente_prcli_nombre  default (''),
	prcli_codigo varchar(50) not null CONSTRAINT DF_ProductoCliente_prcli_codigo  default (''),
	prcli_codigobarra varchar(255) not null CONSTRAINT DF_ProductoCliente_prcli_codigobarra  default (''),
	pr_id int not null,
	cli_id int not null,
	creado timestamptz not null CONSTRAINT DF_ProductoCliente_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ProductoCliente_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ProductoCliente PRIMARY KEY  
(
	prcli_id 
) 
) 
;

;
/****** Object:  Table DepartamentoCliente    Script Date: 07/30/2012 17:07:58 ******/

;

;
create table DepartamentoCliente(
	dptocli_id int not null,
	cli_id int not null,
	dpto_id int not null,
 CONSTRAINT PK_DepartamentoCliente PRIMARY KEY  
(
	dptocli_id 
) 
) 
;
/****** Object:  Table PresupuestoDevolucionVenta    Script Date: 07/30/2012 17:23:52 ******/

;

;
create table PresupuestoDevolucionVenta(
	prvdv_id int not null,
	prvdv_cantidad decimal(18, 6) not null CONSTRAINT DF_PresupuestoDevolucionVenta_prvdv_cantidad_1  default (0),
	prvi_id_Presupuesto int not null,
	prvi_id_devolucion int not null,
 CONSTRAINT PK_PresupuestoDevolucionVenta_1 PRIMARY KEY  
(
	prvdv_id 
) 
) 
;
/****** Object:  Table GridViewFormula    Script Date: 07/30/2012 17:13:24 ******/

;

;

;
create table GridViewFormula(
	grdv_id int not null,
	grdvf_id int not null,
	grdvf_columna varchar(255) not null,
	grdvf_formula smallint not null,
	grdvf_indice smallint not null,
 CONSTRAINT PK_GridViewFormula PRIMARY KEY  
(
	grdvf_id 
) 
) 
;

;
/****** Object:  Table GridViewColumn    Script Date: 07/30/2012 17:13:19 ******/

;

;

;
create table GridViewColumn(
	grdv_id int not null,
	grdvc_id int not null,
	grdvc_nombre varchar(255) not null,
	grdvc_visible int not null,
	grdvc_width smallint not null,
	grdvc_index smallint not null,
 CONSTRAINT PK_GridViewColumn PRIMARY KEY  
(
	grdvc_id 
) 
) 
;

;
/****** Object:  Table GridViewFormato    Script Date: 07/30/2012 17:13:23 ******/

;

;

;
create table GridViewFormato(
	grdv_id int not null,
	grdvfc_id int not null,
	grdvfc_columna varchar(255) not null,
	grdvfc_columna2 varchar(255) not null CONSTRAINT DF_GridViewFormato_grdvfc_columna2  default (''),
	grdvfc_operador smallint not null,
	grdvfc_valor varchar(1000) not null,
	grdvfc_bgColor int not null,
	grdvfc_fColor int not null,
	grdvfc_fontName varchar(255) not null,
	grdvfc_fontSize decimal(9, 2) not null,
	grdvfc_fontStyle smallint not null,
 CONSTRAINT PK_GridViewFormat PRIMARY KEY  
(
	grdvfc_id 
) 
) 
;

;
/****** Object:  Table GridViewGrupo    Script Date: 07/30/2012 17:13:25 ******/

;

;

;
create table GridViewGrupo(
	grdv_id int not null,
	grdvg_id int not null,
	grdvg_columna varchar(255) not null,
	grdvg_indice smallint not null,
	grdvg_orden smallint not null,
 CONSTRAINT PK_GridViewGrupo PRIMARY KEY  
(
	grdvg_id 
) 
) 
;

;
/****** Object:  Table GridViewFiltro    Script Date: 07/30/2012 17:13:21 ******/

;

;

;
create table GridViewFiltro(
	grdv_id int not null,
	grdvfi_id int not null,
	grdvfi_columna varchar(255) not null,
	grdvfi_columna2 varchar(255) not null CONSTRAINT DF_GridViewFiltro_grdvfc_columna2  default (''),
	grdvfi_operador smallint not null,
	grdvfi_valor varchar(1000) not null,
 CONSTRAINT PK_GridViewFiltro PRIMARY KEY  
(
	grdvfi_id 
) 
) 
;

;
/****** Object:  Table PedidoCompraItemTMP    Script Date: 07/30/2012 17:21:30 ******/

;

;

;
create table PedidoCompraItemTMP(
	pcTMP_id int not null,
	pciTMP_id int not null,
	pci_id int not null,
	pci_orden smallint not null,
	pci_cantidad decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItemTMP_pci_cantidad  default (0),
	pci_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItemTMP_pci_cantidadaremitir  default (0),
	pci_pendiente decimal(18, 0) not null CONSTRAINT DF_PedidoCompraItemTMP_pci_pendiente  default (0),
	pci_descrip varchar(5000) not null CONSTRAINT DF_PedidoCompraItemTMP_pci_descrip  default (''),
	pci_precio decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItemTMP_pci_precio  default (0),
	pci_precioUsr decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItemTMP_pci_precioUsr  default (0),
	pci_precioLista decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItemTMP_pci_precioLista  default (0),
	pci_neto decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItemTMP_pc_neto  default (0),
	pci_ivari decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItemTMP_pci_ivari  default (0),
	pci_ivarni decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItemTMP_pci_ivarni  default (0),
	pci_ivariporc decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItemTMP_pci_ivariporc  default (0),
	pci_ivarniporc decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItemTMP_pci_ivarniporc  default (0),
	pci_importe decimal(18, 6) not null CONSTRAINT DF_PedidoCompraItemTMP_pci_importe  default (0),
	pr_id int not null,
	us_id int null,
	ccos_id int null,
 CONSTRAINT PK_PedidoCompraItemTMP PRIMARY KEY  
(
	pciTMP_id 
) 
) 
;

;
/****** Object:  Table PedidoDevolucionCompraTMP    Script Date: 07/30/2012 17:21:40 ******/

;

;
create table PedidoDevolucionCompraTMP(
	pcTMP_id int not null,
	pcdcTMP_id int not null,
	pcdc_id int not null,
	pcdc_cantidad decimal(18, 6) not null CONSTRAINT DF_PedidoDevolucionCompraTMP_pvdv_cantidad  default (0),
	pci_id_pedido int not null,
	pci_id_devolucion int not null,
 CONSTRAINT PK_PedidoDevolucionCompraTMP PRIMARY KEY  
(
	pcdcTMP_id 
) 
) 
;
/****** Object:  Table PedidoCompraItemBorradoTMP    Script Date: 07/30/2012 17:21:25 ******/

;

;
create table PedidoCompraItemBorradoTMP(
	pcTMP_id int not null,
	pcibTMP_id int not null,
	pc_id int not null,
	pci_id int not null,
 CONSTRAINT PK_PedidoCompraItemBorradoTMP PRIMARY KEY  
(
	pcibTMP_id 
) 
) 
;
/****** Object:  Table OrdenCompraItem    Script Date: 07/30/2012 17:17:54 ******/

;

;

;
create table OrdenCompraItem(
	oc_id int not null,
	oci_id int not null,
	oci_orden smallint not null,
	oci_cantidad decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItem_oci_cantidad  default (0),
	oci_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItem_oci_cantidadaremitir  default (0),
	oci_pendiente decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItem_oci_pendiente  default (0),
	oci_pendientefac decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItem_oci_pendientefac  default (0),
	oci_descrip varchar(5000) not null CONSTRAINT DF_OrdenCompraItem_oci_descrip  default (''),
	oci_precio decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItem_oci_precio  default (0),
	oci_precioUsr decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItem_oci_precioUsr  default (0),
	oci_precioLista decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItem_oci_precioLista  default (0),
	oci_descuento varchar(100) not null CONSTRAINT DF_OrdenCompraItem_oci_descuento  default (''),
	oci_neto decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItem_oci_neto  default (0),
	oci_ivari decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItem_oci_ivari  default (0),
	oci_ivarni decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItem_oci_ivarni  default (0),
	oci_importe decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItem_oci_importe  default (0),
	oci_ivariporc decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItem_oci_ivariporc  default (0),
	oci_ivarniporc decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItem_oci_ivarniporc  default (0),
	pr_id int not null,
	ccos_id int null,
 CONSTRAINT PK_OrdenCompraItem PRIMARY KEY  
(
	oci_id 
) 
) 
;

;
/****** Object:  Table TablaItem    Script Date: 07/30/2012 17:30:54 ******/

;

;

;
create table TablaItem(
	tbl_id int not null,
	tbli_id int not null,
	tbli_nombre varchar(255) not null,
	tbli_nombrefisico varchar(255) not null,
	tbli_tipo smallint not null,
	tbli_subtipo smallint not null CONSTRAINT DF_TablaItem_tbli_subtipo  default (0),
	tbli_orden smallint not null CONSTRAINT DF_TablaItem_tbli_orden  default (0),
	tbl_id_help int null,
	tbli_helptype smallint not null CONSTRAINT DF_TablaItem_tbli_helptype  default (0),
	tbli_filtro varchar(255) not null CONSTRAINT DF_TablaItem_tbli_filtro  default (''),
	tbli_defaultvalue varchar(255) not null CONSTRAINT DF_TablaItem_tbli_defaultvalue  default (''),
	tbli_minvalue varchar(255) not null CONSTRAINT DF_TablaItem_tbli_minvalue  default (''),
	tbli_maxvalue varchar(255) not null CONSTRAINT DF_TablaItem_tbli_maxvalue  default (''),
	tbli_textalign smallint not null CONSTRAINT DF_TablaItem_tbli_textalign  default (0),
	tbli_textmask varchar(255) not null CONSTRAINT DF_TablaItem_tbli_textmask  default (''),
	tbli_format varchar(255) not null CONSTRAINT DF_TablaItem_tbli_format  default (''),
	tbli_width smallint not null CONSTRAINT DF_TablaItem_tbli_width  default (0),
	tbli_height smallint not null CONSTRAINT DF_TablaItem_tbli_height  default (0),
	tbli_top smallint not null CONSTRAINT DF_TablaItem_tbli_top  default (0),
	tbli_left smallint not null CONSTRAINT DF_TablaItem_tbli_left  default (0),
	tbli_noshowbutton smallint not null CONSTRAINT DF_TablaItem_tbli_noshowbutton  default (0),
	tbli_sqlstmt varchar(5000) not null CONSTRAINT DF_TablaItem_tbli_sqlstmt  default (''),
 CONSTRAINT PK_TablaItem PRIMARY KEY  
(
	tbli_id 
) 
) 
;

;
/****** Object:  Table EncuestaWebSeccion    Script Date: 07/30/2012 17:10:21 ******/

;

;
create table EncuestaWebSeccion(
	ec_id int not null,
	ws_id int not null,
	ecws_id int not null,
 CONSTRAINT PK_EncuestaWebSeccion PRIMARY KEY  
(
	ecws_id 
) 
) 
;
/****** Object:  Table EncuestaDepartamento    Script Date: 07/30/2012 17:10:16 ******/

;

;
create table EncuestaDepartamento(
	ec_id int not null,
	dpto_id int not null,
	ecdpto_id int not null,
 CONSTRAINT PK_EncuestaDepartamento PRIMARY KEY  
(
	ecdpto_id 
) 
) 
;
/****** Object:  Table EmpleadoFamilia    Script Date: 07/30/2012 17:09:44 ******/

;

;

;
create table EmpleadoFamilia(
	emf_id int not null,
	emf_nombre varchar(255) not null,
	emf_apellido varchar(255) not null,
	emf_dni varchar(20) not null,
	emf_fechanacimiento timestamptz not null CONSTRAINT DF_EmpleadoFamilia_emf_fechanacimiento  default (to_date('19000101','yyyymmdd')),
	emf_descrip varchar(1000) not null CONSTRAINT DF_EmpleadoFamilia_emf_descrip  default (''),
	em_id int not null,
	emft_id int not null,
 CONSTRAINT PK_EmpleadoFamilia PRIMARY KEY  
(
	emf_id 
) 
) 
;

;
/****** Object:  Table EmpleadoCentroCosto    Script Date: 07/30/2012 17:09:40 ******/

;

;
create table EmpleadoCentroCosto(
	emccos_id int not null,
	emccos_desde timestamptz not null,
	emccos_hasta timestamptz not null,
	ccos_id int not null,
	em_id int not null,
 CONSTRAINT PK_CentroCostoEmpleado PRIMARY KEY  
(
	emccos_id 
) 
) 
;
/****** Object:  Table ProductoDepositoFisico    Script Date: 07/30/2012 17:25:47 ******/

;

;
create table ProductoDepositoFisico(
	prdepf_id int not null,
	pr_id int not null,
	depf_id int not null,
	prdepf_x smallint not null CONSTRAINT DF_ProductoDepositoFisico_prdepf_x  default (0),
	prdepf_y smallint not null CONSTRAINT DF_ProductoDepositoFisico_prdepf_y  default (0),
	prdepf_z smallint not null CONSTRAINT DF_ProductoDepositoFisico_prdepf_z  default (0),
	prdepf_stockminimo real not null CONSTRAINT DF_ProductoDepositoFisico_prdepf_stockminimo  default (0),
	prdepf_stockmaximo real not null CONSTRAINT DF_ProductoDepositoFisico_prdepf_stockmaximo  default (0),
	prdepf_reposicion real not null CONSTRAINT DF_ProductoDepositoFisico_prdepf_reposicion  default (0),
 CONSTRAINT PK_ProductoDepositoFisico PRIMARY KEY  
(
	prdepf_id 
) 
) 
;
/****** Object:  Table PresupuestoVentaItemBorradoTMP    Script Date: 07/30/2012 17:24:48 ******/

;

;
create table PresupuestoVentaItemBorradoTMP(
	prvTMP_id int not null,
	prvibTMP_id int not null,
	prv_id int not null,
	prvi_id int not null,
 CONSTRAINT PK_PresupuestoVentaItemBorradoTMP PRIMARY KEY  
(
	prvibTMP_id 
) 
) 
;
/****** Object:  Table PresupuestoVentaItemTMP    Script Date: 07/30/2012 17:24:52 ******/

;

;

;
create table PresupuestoVentaItemTMP(
	prvTMP_id int not null,
	prviTMP_id int not null,
	prvi_id int not null,
	prvi_orden smallint not null,
	prvi_cantidad decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_cantidad  default (0),
	prvi_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_cantidadaremitir  default (0),
	prvi_pendiente decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_pendiente  default (0),
	prvi_descrip varchar(5000) not null CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_descrip  default (''),
	prvi_precio decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_precio  default (0),
	prvi_precioUsr decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_precioUsr  default (0),
	prvi_precioLista decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_precioLista  default (0),
	prvi_descuento varchar(100) not null CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_descuento  default (''),
	prvi_neto decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItemTMP_prv_neto  default (0),
	prvi_ivari decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_ivari  default (0),
	prvi_ivarni decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_ivarni  default (0),
	prvi_ivariporc decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_ivariporc  default (0),
	prvi_ivarniporc decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_ivarniporc  default (0),
	prvi_importe decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_importe  default (0),
	pr_id int not null,
	ccos_id int null,
 CONSTRAINT PK_PresupuestoVentaItemTMP PRIMARY KEY  
(
	prviTMP_id 
) 
) 
;

;
/****** Object:  Table EncuestaPregunta    Script Date: 07/30/2012 17:10:17 ******/

;

;

;
create table EncuestaPregunta(
	ec_id int not null,
	ecp_id int not null,
	ecp_texto varchar(255) not null CONSTRAINT DF_EncuestaPregunta_ecp_texto  default (''),
	ecp_multiple smallint not null CONSTRAINT DF_EncuestaPregunta_ecp_multiple  default (0),
	ecp_orden smallint not null CONSTRAINT DF_EncuestaPregunta_ecp_orden  default (0),
 CONSTRAINT PK_EncuestaPregunta PRIMARY KEY  
(
	ecp_id 
) 
) 
;

;
/****** Object:  Table CashFlowItem    Script Date: 07/30/2012 17:04:14 ******/

;

;
create table CashFlowItem(
	cf_id int not null,
	cfi_id int not null,
	cfi_fecha timestamptz not null,
	cfi_importe decimal(18, 6) not null,
	cfi_excluir smallint not null,
	cfi_tipo smallint not null CONSTRAINT DF_CashFlowItem_cfi_tipo  default (0),
	doct_id int not null,
	comp_id int not null,
 CONSTRAINT PK_CashFlowItem PRIMARY KEY  
(
	cfi_id 
) 
) 
;
/****** Object:  Table MailItem    Script Date: 07/30/2012 17:16:28 ******/

;

;

;
create table MailItem(
	mail_id int not null,
	maili_id int not null,
	maili_email varchar(1000) not null,
	maili_tiempo smallint not null,
	maili_tiempotipo smallint not null,
 CONSTRAINT PK_MailItem PRIMARY KEY  
(
	maili_id 
) 
) 
;

;
/****** Object:  Table PercepcionItem    Script Date: 07/30/2012 17:22:33 ******/

;

;
create table PercepcionItem(
	perc_id int not null,
	perci_id int not null,
	perci_importedesde decimal(18, 6) not null,
	perci_importehasta decimal(18, 6) not null,
	perci_porcentaje decimal(18, 6) not null,
	perci_importefijo decimal(18, 6) not null,
	creado timestamptz not null CONSTRAINT DF_PercepcionItem_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_PercepcionItem_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_PercepcionItem PRIMARY KEY  
(
	perci_id 
) 
) 
;
/****** Object:  Table OrdenServicioSerieTMP    Script Date: 07/30/2012 17:19:27 ******/

;

;

;
create table OrdenServicioSerieTMP(
	osTMP_id int not null,
	ossTMP_id int not null,
	oss_valor varchar(50) not null,
	prns_id int not null,
	edi_id int not null,
 CONSTRAINT PK_OrdenServicioSerieTMP PRIMARY KEY  
(
	ossTMP_id 
) 
) 
;

;
/****** Object:  Table OrdenServicioItemBorradoTMP    Script Date: 07/30/2012 17:19:14 ******/

;

;
create table OrdenServicioItemBorradoTMP(
	osTMP_id int not null,
	osibTMP_id int not null,
	os_id int not null,
	osi_id int not null,
 CONSTRAINT PK_OrdenServicioItemBorradoTMP PRIMARY KEY  
(
	osibTMP_id 
) 
) 
;
/****** Object:  Table OrdenServicioItemSerieBTMP    Script Date: 07/30/2012 17:19:15 ******/

;

;
create table OrdenServicioItemSerieBTMP(
	osTMP_id int not null,
	osisbTMP_id int not null,
	prns_id int not null CONSTRAINT DF_OrdenServicioItemSerieBTMP_prns_id  default (0),
 CONSTRAINT PK_OrdenServicioItemSerieBTMP PRIMARY KEY  
(
	osisbTMP_id 
) 
) 
;
/****** Object:  Table OrdenServicioItemTMP    Script Date: 07/30/2012 17:19:24 ******/

;

;

;
create table OrdenServicioItemTMP(
	osTMP_id int not null,
	osiTMP_id int not null,
	osi_id int not null,
	osi_orden smallint not null,
	osi_cantidad decimal(18, 6) not null CONSTRAINT DF_OrdenServicioItemTMP_osi_cantidad  default (0),
	osi_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_OrdenServicioItemTMP_osi_cantidadaremitir  default (0),
	osi_pendiente decimal(18, 0) not null CONSTRAINT DF_OrdenServicioItemTMP_osi_pendiente  default (0),
	osi_descrip varchar(5000) not null CONSTRAINT DF_OrdenServicioItemTMP_osi_descrip  default (''),
	osi_precio decimal(18, 6) not null CONSTRAINT DF_OrdenServicioItemTMP_osi_precio  default (0),
	osi_precioUsr decimal(18, 6) not null CONSTRAINT DF_OrdenServicioItemTMP_osi_precioUsr  default (0),
	osi_precioLista decimal(18, 6) not null CONSTRAINT DF_OrdenServicioItemTMP_osi_precioLista  default (0),
	osi_descuento varchar(100) not null CONSTRAINT DF_OrdenServicioItemTMP_osi_descuento  default (''),
	osi_neto decimal(18, 6) not null CONSTRAINT DF_OrdenServicioItemTMP_osi_neto  default (0),
	osi_ivari decimal(18, 6) not null CONSTRAINT DF_OrdenServicioItemTMP_osi_ivari  default (0),
	osi_ivarni decimal(18, 6) not null CONSTRAINT DF_OrdenServicioItemTMP_osi_ivarni  default (0),
	osi_ivariporc decimal(18, 6) not null CONSTRAINT DF_OrdenServicioItemTMP_osi_ivariporc  default (0),
	osi_ivarniporc decimal(18, 6) not null CONSTRAINT DF_OrdenServicioItemTMP_osi_ivarniporc  default (0),
	osi_importe decimal(18, 6) not null CONSTRAINT DF_OrdenServicioItemTMP_osi_importe  default (0),
	osi_importCodigo varchar(255) not null CONSTRAINT DF__ordenserv__osi_i__30732EDC  default (0),
	pr_id int not null,
	ccos_id int null,
	stl_codigo varchar(50) not null CONSTRAINT DF_OrdenServicioItemTMP_stl_codigo  default (''),
	stl_id int null,
	tar_id int null,
	cont_id int null,
	etf_id int null,
 CONSTRAINT PK_OrdenServicioItemTMP PRIMARY KEY  
(
	osiTMP_id 
) 
) 
;

;
/****** Object:  Table OrdenServicioAlarmaTMP    Script Date: 07/30/2012 17:19:07 ******/

;

;
create table OrdenServicioAlarmaTMP(
	osTMP_id int not null,
	osalTMP_id int not null,
	ali_id int not null,
 CONSTRAINT PK_OrdenServicioAlarmaTMP PRIMARY KEY  
(
	osalTMP_id 
) 
) 
;
/****** Object:  Table ManifiestoCargaItem    Script Date: 07/30/2012 17:16:40 ******/

;

;

;
create table ManifiestoCargaItem(
	mfc_id int not null,
	mfci_id int not null,
	mfci_orden smallint not null,
	mfci_cantidad decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaItem_mfci_cantidad  default (0),
	mfci_pendiente decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaItem_mfci_pendiente  default (0),
	mfci_pallets int not null,
	mfci_nropallet varchar(100) not null,
	mfci_descrip varchar(255) not null CONSTRAINT DF_ManifiestoCargaItem_mfci_descrip  default (''),
	mfci_precio decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaItem_pklsti_precio  default (0),
	mfci_precioUsr decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaItem_pklsti_precioUsr  default (0),
	mfci_precioLista decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaItem_pklsti_precioLista  default (0),
	mfci_descuento varchar(100) not null CONSTRAINT DF_ManifiestoCargaItem_pklsti_descuento  default (''),
	mfci_ivari decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaItem_pklsti_ivari  default (0),
	mfci_ivarni decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaItem_pklsti_ivarni  default (0),
	mfci_ivariporc decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaItem_pklsti_ivariporc  default (0),
	mfci_ivarniporc decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaItem_pklsti_ivarniporc  default (0),
	mfci_importe decimal(18, 6) not null CONSTRAINT DF_ManifiestoCargaItem_pklsti_importe  default (0),
	pr_id int not null,
	ccos_id int null,
 CONSTRAINT PK_ManifiestoCargaItem PRIMARY KEY  
(
	mfci_id 
) 
) 
;

;
/****** Object:  Table PresupuestoVentaItem    Script Date: 07/30/2012 17:24:47 ******/

;

;

;
create table PresupuestoVentaItem(
	prv_id int not null,
	prvi_id int not null,
	prvi_orden smallint not null,
	prvi_cantidad decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItem_prvi_cantidad  default (0),
	prvi_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItem_prvi_cantidadaremitir  default (0),
	prvi_pendiente decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItem_prvi_pendiente  default (0),
	prvi_descrip varchar(5000) not null CONSTRAINT DF_PresupuestoVentaItem_prvi_descrip  default (''),
	prvi_precio decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItem_prvi_precio  default (0),
	prvi_precioUsr decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItem_prvi_precioUsr  default (0),
	prvi_precioLista decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItem_prvi_precioLista  default (0),
	prvi_descuento varchar(100) not null CONSTRAINT DF_PresupuestoVentaItem_prvi_descuento  default (''),
	prvi_neto decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItem_prv_neto  default (0),
	prvi_ivari decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItem_prvi_ivari  default (0),
	prvi_ivarni decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItem_prvi_ivarni  default (0),
	prvi_ivariporc decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItem_prvi_ivariporc  default (0),
	prvi_ivarniporc decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItem_prvi_ivarniporc  default (0),
	prvi_importe decimal(18, 6) not null CONSTRAINT DF_PresupuestoVentaItem_prvi_importe  default (0),
	pr_id int not null,
	ccos_id int null,
 CONSTRAINT PK_PresupuestoVentaItem PRIMARY KEY  
(
	prvi_id 
) 
) 
;

;
/****** Object:  Table CotizacionCompraItem    Script Date: 07/30/2012 17:07:15 ******/

;

;

;
create table CotizacionCompraItem(
	cot_id int not null,
	coti_id int not null,
	coti_orden smallint not null,
	coti_cantidad decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItem_coti_cantidad  default (0),
	coti_pendiente decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItem_coti_pendiente  default (0),
	coti_pendienteOc decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItem_coti_pendienteOc  default (0),
	coti_descrip varchar(5000) not null CONSTRAINT DF_CotizacionCompraItem_coti_descrip  default (''),
	coti_precio decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItem_coti_precio  default (0),
	coti_precioUsr decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItem_coti_precioUsr  default (0),
	coti_precioLista decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItem_coti_precioLista  default (0),
	coti_descuento varchar(100) not null CONSTRAINT DF_CotizacionCompraItem_coti_descuento  default (''),
	coti_neto decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItem_cot_neto  default (0),
	coti_ivari decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItem_coti_ivari  default (0),
	coti_ivarni decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItem_coti_ivarni  default (0),
	coti_ivariporc decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItem_coti_ivariporc  default (0),
	coti_ivarniporc decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItem_coti_ivarniporc  default (0),
	coti_importe decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItem_coti_importe  default (0),
	pr_id int not null,
	ccos_id int null,
 CONSTRAINT PK_CotizacionCompraItem PRIMARY KEY  
(
	coti_id 
) 
) 
;

;
/****** Object:  Table FacturaCompraPercepcion    Script Date: 07/30/2012 17:11:41 ******/

;

;

;
create table FacturaCompraPercepcion(
	fc_id int not null,
	fcperc_id int not null,
	fcperc_orden smallint not null CONSTRAINT DF_FacturaCompraPercepcion_fcperc_orden  default (0),
	fcperc_base decimal(18, 6) not null CONSTRAINT DF_FacturaCompraPercepcion_fcperc_base  default (0),
	fcperc_porcentaje decimal(18, 6) not null CONSTRAINT DF_FacturaCompraPercepcion_fcperc_porcentaje  default (0),
	fcperc_importe decimal(18, 6) not null CONSTRAINT DF_FacturaCompraPercepcion_fcperc_importe  default (0),
	fcperc_origen decimal(18, 6) not null CONSTRAINT DF_FacturaCompraPercepcion_fcperc_origen  default (0),
	fcperc_descrip varchar(255) not null CONSTRAINT DF_FacturaCompraPercepcion_fcperc_descrip  default (''),
	perc_id int not null,
	ccos_id int null
) 
;

;
/****** Object:  Table ExpoGrupoPrecioIdioma    Script Date: 07/30/2012 17:10:41 ******/

;

;

;
create table ExpoGrupoPrecioIdioma(
	egp_id int not null,
	egpidm_id int not null,
	egpidm_texto varchar(5000) not null CONSTRAINT DF_ExpoGrupoPrecioIdioma_lpi_precio  default (0),
	idm_id int not null,
	activo smallint not null CONSTRAINT DF_ExpoGrupoPrecioIdioma_activo  default (1),
	creado timestamptz not null CONSTRAINT DF_ExpoGrupoPrecioIdioma_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ExpoGrupoPrecioIdioma_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ExpoGrupoPrecioIdioma PRIMARY KEY  
(
	egpidm_id 
) 
) 
;

;
/****** Object:  Table ParteProdKitItemA    Script Date: 07/30/2012 17:20:32 ******/

;

;
create table ParteProdKitItemA(
	ppki_id int not null,
	ppkia_id int not null,
	ppkia_cantidad decimal(18, 6) not null CONSTRAINT DF_ParteProdKitItemA_ppkia_cantidad  default (0),
	pr_id int not null,
	prk_id int not null,
 CONSTRAINT PK_ParteProdKitItemA PRIMARY KEY  
(
	ppkia_id 
) 
) 
;
/****** Object:  Table ProductoLeyenda    Script Date: 07/30/2012 17:26:01 ******/

;

;

;
create table ProductoLeyenda(
	pr_id int not null,
	prl_id int not null,
	prl_nombre varchar(100) not null,
	prl_texto varchar(5000) not null,
	prl_tag varchar(50) not null CONSTRAINT DF_ProductoLeyenda_prl_tag  default (''),
	prl_orden varchar(50) not null CONSTRAINT DF_ProductoLeyenda_prl_orden  default (''),
	creado timestamptz not null CONSTRAINT DF_ProductoLeyenda_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ProductoLeyenda_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ProductoLeyenda PRIMARY KEY  
(
	prl_id 
) 
) 
;

;
/****** Object:  Table ProductoKitItemA    Script Date: 07/30/2012 17:25:59 ******/

;

;
create table ProductoKitItemA(
	prka_id int not null,
	prk_id int not null,
	pr_id int not null,
	activo smallint not null CONSTRAINT DF_ProductoKitItemA_activo  default (1),
 CONSTRAINT PK_ProductoKitItemA PRIMARY KEY  
(
	prka_id 
) 
) 
;
/****** Object:  Table ProductoFormulaKit    Script Date: 07/30/2012 17:25:52 ******/

;

;

;
create table ProductoFormulaKit(
	prfk_id int not null,
	prfk_nombre varchar(255) not null,
	prfk_codigo varchar(15) not null,
	prfk_default smallint not null CONSTRAINT DF_ProductoFormulaKit_prfk_default  default (0),
	prfk_descrip varchar(2000) not null CONSTRAINT DF_ProductoFormulaKit_pr_descripventa  default (''),
	pr_id int not null,
	pr_id_serie int null,
	pr_id_lote int null,
	activo smallint not null CONSTRAINT DF_ProductoFormulaKit_activo  default (1),
	creado timestamptz not null CONSTRAINT DF_ProductoFormulaKit_creado  default (getdate()),
	modifico int not null,
	modificado timestamptz not null CONSTRAINT DF_ProductoFormulaKit_modificado  default (getdate()),
 CONSTRAINT PK_ProductoFormulaKit PRIMARY KEY  
(
	prfk_id 
) 
) 
;

;
/****** Object:  Table StockValorItem    Script Date: 07/30/2012 17:30:39 ******/

;

;
create table StockValorItem(
	stv_id int not null,
	stvi_id int not null,
	stvi_cantidad decimal(18, 6) not null,
	stvi_costo decimal(18, 6) not null,
	pr_id int not null,
 CONSTRAINT stvi_id_PK PRIMARY KEY  
(
	stvi_id 
) 
) 
;
/****** Object:  Table AlarmaDiaMes    Script Date: 07/30/2012 17:02:50 ******/

;

;
create table AlarmaDiaMes(
	al_id int not null,
	aldm_id int not null,
	aldm_dia smallint not null,
	aldm_desdehora smallint not null,
	aldm_desdeminuto smallint not null,
	aldm_hastahora smallint not null,
	aldm_hastaminuto smallint not null,
	aldm_activo smallint not null,
 CONSTRAINT PK_AlarmaDiaMes PRIMARY KEY  
(
	aldm_id 
) 
) 
;
/****** Object:  Table AlarmaDiaSemana    Script Date: 07/30/2012 17:02:52 ******/

;

;
create table AlarmaDiaSemana(
	al_id int not null,
	alds_id int not null,
	alds_dia smallint not null,
	alds_desdehora smallint not null,
	alds_desdeminuto smallint not null,
	alds_hastahora smallint not null,
	alds_hastaminuto smallint not null,
	alds_activo smallint not null,
 CONSTRAINT PK_AlarmaDiaSemana PRIMARY KEY  
(
	alds_id 
) 
) 
;
/****** Object:  Table AlarmaFecha    Script Date: 07/30/2012 17:02:54 ******/

;

;
create table AlarmaFecha(
	al_id int not null,
	alf_id int not null,
	alf_fecha timestamptz not null,
	alf_desdehora smallint not null,
	alf_desdeminuto smallint not null,
	alf_hastahora smallint not null,
	alf_hastaminuto smallint not null,
 CONSTRAINT PK_AlarmaFecha PRIMARY KEY  
(
	alf_id 
) 
) 
;
/****** Object:  Table Calle    Script Date: 07/30/2012 17:04:04 ******/

;

;

;
create table Calle(
	calle_id int not null,
	calle_nombre varchar(255) not null,
	calle_codigo varchar(15) not null,
	calle_descrip varchar(255) not null CONSTRAINT DF_Calle_calle_descrip  default (''),
	calle_localidad varchar(255) not null CONSTRAINT DF_Calle_calle_localidad  default (''),
	ciu_id int not null,
	creado timestamptz not null CONSTRAINT DF_Calle_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_Calle_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_Calle_activo  default (1),
 CONSTRAINT PK_Calle PRIMARY KEY  
(
	calle_id 
) 
) 
;

;
/****** Object:  Table PermisoEmbarqueItemBorradoTMP    Script Date: 07/30/2012 17:22:49 ******/

;

;
create table PermisoEmbarqueItemBorradoTMP(
	pembTMP_id int not null,
	pembibTMP_id int not null,
	pemb_id int not null,
	pembi_id int not null,
 CONSTRAINT PK_PermisoEmbarqueItemBorradoTMP PRIMARY KEY  
(
	pembibTMP_id 
) 
) 
;
/****** Object:  Table PermisoEmbarqueItemTMP    Script Date: 07/30/2012 17:22:51 ******/

;

;

;
create table PermisoEmbarqueItemTMP(
	pembTMP_id int not null,
	pembiTMP_id int not null,
	pembi_id int not null,
	pembi_orden smallint not null,
	pembi_cantidad decimal(18, 6) not null,
	pembi_pendiente decimal(18, 6) not null CONSTRAINT DF_PermisoEmbarqueItemTMP_pembi_pendiente  default (0),
	pembi_foborigen decimal(18, 6) not null CONSTRAINT DF_PermisoEmbarqueItemTMP_pembi_foborigen  default (0),
	pembi_fobtotalorigen decimal(18, 6) not null CONSTRAINT DF_PermisoEmbarqueItemTMP_pembi_fobtotalorigen  default (0),
	pembi_fob decimal(18, 6) not null,
	pembi_fobtotal decimal(18, 6) not null,
	pembi_descrip varchar(255) not null CONSTRAINT DF_PermisoEmbarqueItemTMP_pembi_descrip  default (''),
	pr_id int not null,
 CONSTRAINT PK_PermisoEmbarqueItemTMP PRIMARY KEY  
(
	pembiTMP_id 
) 
) 
;

;
/****** Object:  Table ImportacionTempGarantiaTMP    Script Date: 07/30/2012 17:14:19 ******/

;

;
create table ImportacionTempGarantiaTMP(
	imptTMP_id int not null,
	imptgTMP_id int not null,
	imptg_id int not null CONSTRAINT DF_ImportacionTempGarantiaTMP_imptg_id  default (0),
	imptg_orden smallint not null,
	gar_id int not null,
 CONSTRAINT PK_ImportacionTempGarantiaTMP PRIMARY KEY  
(
	imptgTMP_id 
) 
) 
;
/****** Object:  Table ImportacionTempItemTMP    Script Date: 07/30/2012 17:14:32 ******/

;

;

;
create table ImportacionTempItemTMP(
	imptTMP_id int not null,
	imptiTMP_id int not null,
	impti_id int not null,
	impti_orden smallint not null,
	impti_cantidad decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItemTMP_impti_cantidad  default (0),
	impti_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItemTMP_impti_cantidadaremitir  default (0),
	impti_descrip varchar(5000) not null CONSTRAINT DF_ImportacionTempItemTMP_impti_descrip  default (''),
	impti_precio decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItemTMP_impti_precio  default (0),
	impti_precioUsr decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItemTMP_impti_precioUsr  default (0),
	impti_precioLista decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItemTMP_impti_precioLista  default (0),
	impti_descuento varchar(100) not null CONSTRAINT DF_ImportacionTempItemTMP_impti_descuento  default (''),
	impti_neto decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItemTMP_impti_neto  default (0),
	impti_ivari decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItemTMP_impti_ivari  default (0),
	impti_ivarni decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItemTMP_impti_ivarni  default (0),
	impti_ivariporc decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItemTMP_impti_ivariporc  default (0),
	impti_ivarniporc decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItemTMP_impti_ivarniporc  default (0),
	impti_importe decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItemTMP_impti_importe  default (0),
	impti_seguro decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItemTMP_impti_seguro  default (0),
	impti_flete decimal(18, 6) not null CONSTRAINT DF_ImportacionTempItemTMP_impti_flete  default (0),
	pr_id int not null,
	ccos_id int null,
 CONSTRAINT PK_ImportacionTempItemTMP PRIMARY KEY  
(
	imptiTMP_id 
) 
) 
;

;
/****** Object:  Table ImportacionTempItemBorradoTMP    Script Date: 07/30/2012 17:14:25 ******/

;

;
create table ImportacionTempItemBorradoTMP(
	imptTMP_id int not null,
	imptibTMP_id int not null,
	impt_id int not null,
	impti_id int not null,
 CONSTRAINT PK_ImportacionTempItemBorradoTMP PRIMARY KEY  
(
	imptibTMP_id 
) 
) 
;
/****** Object:  Table PackingListItemTMP    Script Date: 07/30/2012 17:20:03 ******/

;

;

;
create table PackingListItemTMP(
	pklstTMP_id int not null,
	pklstiTMP_id int not null,
	pklsti_id int not null,
	pklsti_orden smallint not null,
	pklsti_cantidad decimal(18, 6) not null CONSTRAINT DF_PackingListItemTMP_pklsti_cantidad  default (0),
	pklsti_pendiente decimal(18, 6) not null CONSTRAINT DF_PackingListItemTMP_pklsti_pendiente  default (0),
	pklsti_pendientefac decimal(18, 6) not null CONSTRAINT DF_PackingListItemTMP_pklsti_pendientefac  default (0),
	pklsti_pallets int not null,
	pklsti_seguro decimal(18, 6) not null CONSTRAINT DF_PackingListItemTMP_pklsti_seguro  default (0),
	pklsti_descrip varchar(255) not null CONSTRAINT DF_PackingListItemTMP_pklsti_descrip  default (''),
	pklsti_precio decimal(18, 6) not null CONSTRAINT DF_PackingListItemTMP_pklsti_precio  default (0),
	pklsti_precioUsr decimal(18, 6) not null CONSTRAINT DF_PackingListItemTMP_pklsti_precioUsr  default (0),
	pklsti_precioLista decimal(18, 6) not null CONSTRAINT DF_PackingListItemTMP_pklsti_precioLista  default (0),
	pklsti_descuento varchar(100) not null CONSTRAINT DF_PackingListItemTMP_pklsti_descuento  default (''),
	pklsti_neto decimal(18, 6) not null CONSTRAINT DF_PackingListItemTMP_pklsti_neto  default (0),
	pklsti_ivari decimal(18, 6) not null CONSTRAINT DF_PackingListItemTMP_pklsti_ivari  default (0),
	pklsti_ivarni decimal(18, 6) not null CONSTRAINT DF_PackingListItemTMP_pklsti_ivarni  default (0),
	pklsti_ivariporc decimal(18, 6) not null CONSTRAINT DF_PackingListItemTMP_pklsti_ivariporc  default (0),
	pklsti_ivarniporc decimal(18, 6) not null CONSTRAINT DF_PackingListItemTMP_pklsti_ivarniporc  default (0),
	pklsti_importe decimal(18, 6) not null CONSTRAINT DF_PackingListItemTMP_pklsti_importe  default (0),
	pklsti_cajadesde smallint not null CONSTRAINT DF_PackingListItemTMP_pklsti_cajadesde  default (0),
	pklsti_cajahasta smallint not null CONSTRAINT DF_PackingListItemTMP_pklsti_cajahasta  default (0),
	pklsti_pesoneto decimal(18, 6) not null CONSTRAINT DF_PackingListItemTMP_pklsti_pesoneto  default (0),
	pklsti_pesototal decimal(18, 6) not null CONSTRAINT DF_PackingListItemTMP_pklsti_pesototal  default (0),
	pklsti_grupoexpo varchar(100) not null CONSTRAINT DF_PackingListItemTMP_pklsti_grupoexpo  default (''),
	ccos_id int null,
	pr_id int not null,
 CONSTRAINT PK_PackingListItemTMP PRIMARY KEY  
(
	pklstiTMP_id 
) 
) 
;

;
/****** Object:  Table PackingListDevolucionTMP    Script Date: 07/30/2012 17:19:47 ******/

;

;
create table PackingListDevolucionTMP(
	pklstTMP_id int not null,
	pklstdvTMP_id int not null,
	pklstdv_id int not null,
	pklstdv_cantidad decimal(18, 6) not null CONSTRAINT DF_PackingListDevolucionTMP_pklstdv_cantidad  default (0),
	pklsti_id_pklst int not null,
	pklsti_id_devolucion int not null,
 CONSTRAINT PK_PackingListDevolucionTMP PRIMARY KEY  
(
	pklstdvTMP_id 
) 
) 
;
/****** Object:  Table PackingListItemBorradoTMP    Script Date: 07/30/2012 17:19:57 ******/

;

;
create table PackingListItemBorradoTMP(
	pklstTMP_id int not null,
	pklstibTMP_id int not null,
	pklst_id int not null,
	pklsti_id int not null,
 CONSTRAINT PK_PackingListItemBorradoTMP PRIMARY KEY  
(
	pklstibTMP_id 
) 
) 
;
/****** Object:  Table ReporteParametro    Script Date: 07/30/2012 17:29:07 ******/

;

;

;
create table ReporteParametro(
	rptp_id int not null,
	rptp_valor varchar(255) not null,
	rptp_visible smallint not null CONSTRAINT DF_ReporteParametro_rptp_visible  default (0),
	rpt_id int not null,
	infp_id int not null,
	creado timestamptz not null CONSTRAINT DF_ReporteParametro_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_ReporteParametro_modificado  default (getdate()),
	modifico int not null,
 CONSTRAINT PK_ReporteParametro PRIMARY KEY  
(
	rptp_id 
) 
) 
;

;
/****** Object:  Table ParteReparacionItemTMP    Script Date: 07/30/2012 17:21:05 ******/

;

;

;
create table ParteReparacionItemTMP(
	prpTMP_id int not null,
	prpiTMP_id int not null,
	prpi_id int not null,
	prpi_orden smallint not null,
	prpi_cantidad decimal(18, 6) not null CONSTRAINT DF_ParteReparacionItemTMP_prpi_cantidad  default (0),
	prpi_descrip varchar(5000) not null CONSTRAINT DF_ParteReparacionItemTMP_prpi_descrip  default (''),
	prpi_precio decimal(18, 6) not null CONSTRAINT DF_ParteReparacionItemTMP_prpi_precio  default (0),
	prpi_precioUsr decimal(18, 6) not null CONSTRAINT DF_ParteReparacionItemTMP_prpi_precioUsr  default (0),
	prpi_precioLista decimal(18, 6) not null CONSTRAINT DF_ParteReparacionItemTMP_prpi_precioLista  default (0),
	prpi_descuento varchar(100) not null CONSTRAINT DF_ParteReparacionItemTMP_prpi_descuento  default (''),
	prpi_neto decimal(18, 6) not null CONSTRAINT DF_ParteReparacionItemTMP_prpi_neto  default (0),
	prpi_ivari decimal(18, 6) not null CONSTRAINT DF_ParteReparacionItemTMP_prpi_ivari  default (0),
	prpi_ivarni decimal(18, 6) not null CONSTRAINT DF_ParteReparacionItemTMP_prpi_ivarni  default (0),
	prpi_ivariporc decimal(18, 6) not null CONSTRAINT DF_ParteReparacionItemTMP_prpi_ivariporc  default (0),
	prpi_ivarniporc decimal(18, 6) not null CONSTRAINT DF_ParteReparacionItemTMP_prpi_ivarniporc  default (0),
	prpi_importe decimal(18, 6) not null CONSTRAINT DF_ParteReparacionItemTMP_prpi_importe  default (0),
	pr_id int not null,
	ccos_id int null,
	stl_id int null,
 CONSTRAINT PK_ParteReparacionItemTMP PRIMARY KEY  
(
	prpiTMP_id 
) 
) 
;

;
/****** Object:  Table ParteReparacionItemBorradoTMP    Script Date: 07/30/2012 17:20:58 ******/

;

;
create table ParteReparacionItemBorradoTMP(
	prpTMP_id int not null,
	prpibTMP_id int not null,
	prp_id int not null,
	prpi_id int not null,
 CONSTRAINT PK_ParteReparacionBorradoTMP PRIMARY KEY  
(
	prpibTMP_id 
) 
) 
;
/****** Object:  Table FacturaCompraLegajo    Script Date: 07/30/2012 17:11:20 ******/

;

;

;
create table FacturaCompraLegajo(
	fc_id int not null,
	fclgj_id int not null,
	fclgj_orden smallint not null,
	fclgj_importe decimal(18, 6) not null CONSTRAINT DF_FacturaCompraLegajo_fcljg_importe  default (0),
	fclgj_importeorigen decimal(18, 6) not null CONSTRAINT DF_FacturaCompraLegajo_fclgj_importe1  default (0),
	fclgj_descrip varchar(255) not null CONSTRAINT DF_FacturaCompraLegajo_fcljg_descrip  default (''),
	lgj_id int not null,
 CONSTRAINT PK_FacturaCompraLegajo PRIMARY KEY  
(
	fclgj_id 
) 
) 
;

;
/****** Object:  Table DepositoBancoItemBorradoTMP    Script Date: 07/30/2012 17:08:10 ******/

;

;
create table DepositoBancoItemBorradoTMP(
	dbcoTMP_id int not null,
	dbcoibTMP_id int not null,
	dbco_id int not null,
	dbcoi_id int not null,
 CONSTRAINT PK_DepositoBancoItemBorradoTMP PRIMARY KEY  
(
	dbcoibTMP_id 
) 
) 
;
/****** Object:  Table DepositoBancoItemTMP    Script Date: 07/30/2012 17:08:13 ******/

;

;

;
create table DepositoBancoItemTMP(
	dbcoTMP_id int not null,
	dbcoiTMP_id int not null,
	dbcoi_id int not null CONSTRAINT DF_DepositoBancoItemTMP_dbcoi_id  default (0),
	dbcoi_orden smallint not null,
	dbcoi_importe decimal(18, 6) not null CONSTRAINT DF_DepositoBancoItemTMP_dbcoi_importe  default (0),
	dbcoi_importeorigen decimal(18, 6) not null CONSTRAINT DF_DepositoBancoItemTMP_dbcoi_importeorigen  default (0),
	dbcoi_descrip varchar(5000) not null CONSTRAINT DF_DepositoBancoItemTMP_dbcoi_descrip  default (''),
	dbcoi_tipo smallint not null CONSTRAINT DF_DepositoBancoItemTMP_dbcoi_tipo  default (0),
	dbcoiTMP_cheque varchar(50) not null CONSTRAINT DF_DepositoBancoItemTMP_dbcoiTMP_cheque  default (''),
	dbcoiTMP_fechacobro timestamptz not null CONSTRAINT DF_DepositoBancoItemTMP_dbcoiTMP_fechacobro  default (getdate()),
	dbcoiTMP_fechavto timestamptz not null CONSTRAINT DF_DepositoBancoItemTMP_dbcoiTMP_fechavto  default (getdate()),
	cue_id int null,
	cheq_id int null,
	cle_id int null,
	chq_id int null,
 CONSTRAINT PK_DepositoBancoItemTMP PRIMARY KEY  
(
	dbcoiTMP_id 
) 
) 
;

;
/****** Object:  Table DespachoImpCalculoItem    Script Date: 07/30/2012 17:08:44 ******/

;

;

;
create table DespachoImpCalculoItem(
	dic_id int not null,
	dici_id int not null,
	dici_codigo int not null,
	dici_valor decimal(18, 6) not null CONSTRAINT DF_DespachoImpCalculoItem_dici_valor  default (0),
	dici_importe decimal(18, 6) not null,
	dici_porc varchar(50) not null CONSTRAINT DF_DespachoImpCalculoItem_dici_porc  default (0),
	dici_descrip varchar(255) not null CONSTRAINT DF_DespachoImpCalculoItem_dici_descrip  default (''),
 CONSTRAINT PK_DespachoImpCalculoItem PRIMARY KEY  
(
	dici_id 
) 
) 
;

;
/****** Object:  Table DespachoImpCalculoPosicionArancel    Script Date: 07/30/2012 17:08:46 ******/

;

;
create table DespachoImpCalculoPosicionArancel(
	dic_id int not null,
	dicp_id int not null,
	dicp_derechos decimal(18, 6) not null CONSTRAINT DF_DespachoImpPosicionArancel_dicp_derechos  default (0),
	dicp_estadisticas decimal(18, 6) not null CONSTRAINT DF_DespachoImpPosicionArancel_dicp_estadisticas  default (0),
	dicp_iva decimal(18, 6) not null CONSTRAINT DF_DespachoImpPosicionArancel_dicp_iva  default (0),
	dicp_iva3431 decimal(18, 6) not null CONSTRAINT DF_DespachoImpPosicionArancel_dicp_iva3431  default (0),
	dicp_ganancias decimal(18, 6) not null CONSTRAINT DF_DespachoImpPosicionArancel_dicp_ganancias  default (0),
	dicp_igb decimal(18, 6) not null CONSTRAINT DF_DespachoImpPosicionArancel_dicp_igb  default (0),
	dicp_gastoenvio decimal(18, 6) not null CONSTRAINT DF_DespachoImpPosicionArancel_dicp_gastoenvio  default (0),
	poar_id int not null,
 CONSTRAINT PK_DespachoImpPosicionArancel PRIMARY KEY  
(
	dicp_id 
) 
) 
;
/****** Object:  Table SindicatoCategoria    Script Date: 07/30/2012 17:29:52 ******/

;

;

;
create table SindicatoCategoria(
	sindca_id int not null,
	sind_id int not null,
	sindca_nombre varchar(100) not null,
	sindca_codigo varchar(50) not null,
	sindca_descrip varchar(255) not null,
	creado timestamptz not null CONSTRAINT DF_SindicatoCategoria_creado  default (getdate()),
	modificado timestamptz not null CONSTRAINT DF_SindicatoCategoria_modificado  default (getdate()),
	modifico int not null,
	activo smallint not null CONSTRAINT DF_SindicatoCategoria_activo  default (1),
 CONSTRAINT PK_SindicatoCategoria PRIMARY KEY  
(
	sindca_id 
) 
) 
;

;
/****** Object:  Table SindicatoConvenio    Script Date: 07/30/2012 17:29:54 ******/

;

;

;
create table SindicatoConvenio(
	sindco_id int not null,
	sind_id int not null,
	sindco_nombre varchar(100) null,
	sindco_codigo varchar(15) null,
	sindco_descrip varchar(255) null,
	creado timestamptz null CONSTRAINT DF_SindicatoConvenio_creado  default (getdate()),
	modificado timestamptz null CONSTRAINT DF_SindicatoConvenio_modificado  default (getdate()),
	modifico int null,
	activo smallint null CONSTRAINT DF_SindicatoConvenio_activo  default (1),
 CONSTRAINT PK_SindicatoConvenio PRIMARY KEY  
(
	sindco_id 
) 
) 
;

;
/****** Object:  Table CotizacionCompraItemBorradoTMP    Script Date: 07/30/2012 17:07:16 ******/

;

;
create table CotizacionCompraItemBorradoTMP(
	cotTMP_id int not null,
	cotibTMP_id int not null,
	cot_id int not null,
	coti_id int not null,
 CONSTRAINT PK_CotizacionCompraItemBorradoTMP PRIMARY KEY  
(
	cotibTMP_id 
) 
) 
;
/****** Object:  Table CotizacionCompraItemTMP    Script Date: 07/30/2012 17:07:21 ******/

;

;

;
create table CotizacionCompraItemTMP(
	cotTMP_id int not null,
	cotiTMP_id int not null,
	coti_id int not null,
	coti_orden smallint not null,
	coti_cantidad decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItemTMP_coti_cantidad  default (0),
	coti_pendiente decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItemTMP_coti_pendiente  default (0),
	coti_pendienteOc decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItemTMP_coti_pendienteOc  default (0),
	coti_descrip varchar(5000) not null CONSTRAINT DF_CotizacionCompraItemTMP_coti_descrip  default (''),
	coti_precio decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItemTMP_coti_precio  default (0),
	coti_precioUsr decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItemTMP_coti_precioUsr  default (0),
	coti_precioLista decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItemTMP_coti_precioLista  default (0),
	coti_descuento varchar(100) not null CONSTRAINT DF_CotizacionCompraItemTMP_coti_descuento  default (''),
	coti_neto decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItemTMP_cot_neto  default (0),
	coti_ivari decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItemTMP_coti_ivari  default (0),
	coti_ivarni decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItemTMP_coti_ivarni  default (0),
	coti_ivariporc decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItemTMP_coti_ivariporc  default (0),
	coti_ivarniporc decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItemTMP_coti_ivarniporc  default (0),
	coti_importe decimal(18, 6) not null CONSTRAINT DF_CotizacionCompraItemTMP_coti_importe  default (0),
	pr_id int not null,
	ccos_id int null,
 CONSTRAINT PK_CotizacionCompraItemTMP PRIMARY KEY  
(
	cotiTMP_id 
) 
) 
;

;
/****** Object:  Table PedidoDevolucionCompra    Script Date: 07/30/2012 17:21:38 ******/

;

;
create table PedidoDevolucionCompra(
	pcdc_id int not null,
	pcdc_cantidad decimal(18, 6) not null CONSTRAINT DF_PedidoDevolucionCompra_pvdv_cantidad  default (0),
	pci_id_pedido int not null,
	pci_id_devolucion int not null,
 CONSTRAINT PK_PedidoDevolucionCompra PRIMARY KEY  
(
	pcdc_id 
) 
) 
;
/****** Object:  Table PedidoOrdenCompra    Script Date: 07/30/2012 17:21:46 ******/

;

;
create table PedidoOrdenCompra(
	pcoc_id int not null,
	pcoc_cantidad decimal(18, 6) not null CONSTRAINT DF_PedidoOrdenCompra_pcoc_cantidad  default (0),
	pci_id int not null,
	oci_id int not null,
 CONSTRAINT PK_PedidoOrdenCompra PRIMARY KEY  
(
	pcoc_id 
) 
) 
;
/****** Object:  Table ResolucionCuponItemTMP    Script Date: 07/30/2012 17:29:19 ******/

;

;

;
create table ResolucionCuponItemTMP(
	rcupTMP_id int not null,
	rcupiTMP_id int not null,
	rcupi_id int not null CONSTRAINT DF_ResolucionCuponItemTMP_rcupi_id  default (0),
	rcupi_orden smallint not null,
	rcupi_cuota smallint not null CONSTRAINT DF_ResolucionCuponItemTMP_rcupi_cuota  default (0),
	rcupi_comision decimal(18, 6) not null CONSTRAINT DF_ResolucionCuponItemTMP_rcupi_comision  default (0),
	rcupi_importe decimal(18, 6) not null CONSTRAINT DF_ResolucionCuponItemTMP_rcupi_importe  default (0),
	rcupi_importeorigen decimal(18, 6) not null CONSTRAINT DF_ResolucionCuponItemTMP_rcupi_importeorigen  default (0),
	rcupi_descrip varchar(5000) not null CONSTRAINT DF_ResolucionCuponItemTMP_rcupi_descrip  default (''),
	rcupi_rechazado smallint not null CONSTRAINT DF_ResolucionCuponItemTMP_rcupi_rechazado  default (0),
	cue_id int null,
	tjcc_id int null,
 CONSTRAINT PK_ResolucionCuponItemTMP PRIMARY KEY  
(
	rcupiTMP_id 
) 
) 
;

;
/****** Object:  Table ResolucionCuponItemBorradoTMP    Script Date: 07/30/2012 17:29:17 ******/

;

;
create table ResolucionCuponItemBorradoTMP(
	rcupTMP_id int not null,
	rcupibTMP_id int not null,
	rcup_id int not null,
	rcupi_id int not null,
 CONSTRAINT PK_ResolucionCuponItemBorradoTMP PRIMARY KEY  
(
	rcupibTMP_id 
) 
) 
;
/****** Object:  Table RemitoCompraItemTMP    Script Date: 07/30/2012 17:28:05 ******/

;

;

;
create table RemitoCompraItemTMP(
	rcTMP_id int not null,
	rciTMP_id int not null,
	rci_id int not null,
	rci_orden smallint not null,
	rci_cantidad decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItemTMP_rci_cantidad  default (0),
	rci_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItemTMP_rci_cantidadaremitir  default (0),
	rci_pendiente decimal(18, 6) null CONSTRAINT DF_RemitoCompraItemTMP_rci_pendiente  default (0),
	rci_pendientefac decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItemTMP_rci_pendientefac  default (0),
	rci_descrip varchar(5000) not null CONSTRAINT DF_RemitoCompraItemTMP_rci_descrip  default (''),
	rci_precio decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItemTMP_rci_precio  default (0),
	rci_precioUsr decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItemTMP_rci_precioUsr  default (0),
	rci_precioLista decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItemTMP_rci_precioLista  default (0),
	rci_descuento varchar(100) not null CONSTRAINT DF_RemitoCompraItemTMP_rci_descuento  default (''),
	rci_neto decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItemTMP_rci_neto  default (0),
	rci_ivari decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItemTMP_rci_ivari  default (0),
	rci_ivarni decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItemTMP_rci_ivarni  default (0),
	rci_ivariporc decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItemTMP_rci_ivariporc  default (0),
	rci_ivarniporc decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItemTMP_rci_ivarniporc  default (0),
	rci_importe decimal(18, 6) not null CONSTRAINT DF_RemitoCompraItemTMP_rci_importe  default (0),
	pr_id int not null,
	ccos_id int null,
	stl_codigo varchar(50) not null CONSTRAINT DF_RemitoCompraItemTMP_stl_codigo  default (''),
	stl_id int null,
 CONSTRAINT PK_RemitoCompraItemTMP PRIMARY KEY  
(
	rciTMP_id 
) 
) 
;

;
/****** Object:  Table RemitoCompraItemBorradoTMP    Script Date: 07/30/2012 17:27:55 ******/

;

;
create table RemitoCompraItemBorradoTMP(
	rcTMP_id int not null,
	rcibTMP_id int not null,
	rc_id int not null,
	rci_id int not null,
 CONSTRAINT PK_RemitoCompraItemBorradoTMP PRIMARY KEY  
(
	rcibTMP_id 
) 
) 
;
/****** Object:  Table RemitoDevolucionCompraTMP    Script Date: 07/30/2012 17:28:14 ******/

;

;
create table RemitoDevolucionCompraTMP(
	rcTMP_id int not null,
	rcdcTMP_id int not null,
	rcdc_id int not null,
	rcdc_cantidad decimal(18, 6) not null CONSTRAINT DF_RemitoDevolucionCompraTMP_rvrd_cantidad  default (0),
	rci_id_remito int not null,
	rci_id_devolucion int not null,
 CONSTRAINT PK_RemitoDevolucionCompraTMP PRIMARY KEY  
(
	rcdcTMP_id 
) 
) 
;
/****** Object:  Table OrdenDevolucionCompra    Script Date: 07/30/2012 17:18:09 ******/

;

;
create table OrdenDevolucionCompra(
	ocdc_id int not null,
	ocdc_cantidad decimal(18, 6) not null CONSTRAINT DF_OrdenDevolucionCompra_ocdc_cantidad  default (0),
	oci_id_Orden int not null,
	oci_id_devolucion int not null,
 CONSTRAINT PK_OrdenDevolucionCompra PRIMARY KEY  
(
	ocdc_id 
) 
) 
;
/****** Object:  Table OrdenDevolucionCompraTMP    Script Date: 07/30/2012 17:18:11 ******/

;

;
create table OrdenDevolucionCompraTMP(
	ocTMP_id int not null,
	ocdcTMP_id int not null,
	ocdc_id int not null,
	ocdc_cantidad decimal(18, 6) not null CONSTRAINT DF_OrdenDevolucionCompraTMP_ocdc_cantidad  default (0),
	oci_id_Orden int not null,
	oci_id_devolucion int not null,
 CONSTRAINT PK_OrdenDevolucionCompraTMP PRIMARY KEY  
(
	ocdcTMP_id 
) 
) 
;
/****** Object:  Table OrdenCompraItemTMP    Script Date: 07/30/2012 17:18:00 ******/

;

;

;
create table OrdenCompraItemTMP(
	ocTMP_id int not null,
	ociTMP_id int not null,
	oci_id int not null,
	oci_orden smallint not null,
	oci_cantidad decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItemTMP_oci_cantidad  default (0),
	oci_cantidadaremitir decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItemTMP_oci_cantidadaremitir  default (0),
	oci_pendiente decimal(18, 0) not null CONSTRAINT DF_OrdenCompraItemTMP_oci_pendiente  default (0),
	oci_pendientefac decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItemTMP_oci_pendientefac  default (0),
	oci_descrip varchar(5000) not null CONSTRAINT DF_OrdenCompraItemTMP_oci_descrip  default (''),
	oci_precio decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItemTMP_oci_precio  default (0),
	oci_precioUsr decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItemTMP_oci_precioUsr  default (0),
	oci_precioLista decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItemTMP_oci_precioLista  default (0),
	oci_descuento varchar(100) not null CONSTRAINT DF_OrdenCompraItemTMP_oci_descuento  default (''),
	oci_neto decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItemTMP_oc_neto  default (0),
	oci_ivari decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItemTMP_oci_ivari  default (0),
	oci_ivarni decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItemTMP_oci_ivarni  default (0),
	oci_ivariporc decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItemTMP_oci_ivariporc  default (0),
	oci_ivarniporc decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItemTMP_oci_ivarniporc  default (0),
	oci_importe decimal(18, 6) not null CONSTRAINT DF_OrdenCompraItemTMP_oci_importe  default (0),
	pr_id int not null,
	ccos_id int null,
 CONSTRAINT PK_OrdenCompraItemTMP PRIMARY KEY  
(
	ociTMP_id 
) 
) 
;

;
/****** Object:  Table OrdenCompraItemBorradoTMP    Script Date: 07/30/2012 17:17:55 ******/

;

;
create table OrdenCompraItemBorradoTMP(
	ocTMP_id int not null,
	ocibTMP_id int not null,
	oc_id int not null,
	oci_id int not null,
 CONSTRAINT PK_OrdenCompraItemBorradoTMP PRIMARY KEY  
(
	ocibTMP_id 
) 
) 
;
/****** Object:  Table FacturaCompraPago    Script Date: 07/30/2012 17:11:39 ******/

;

;
create table FacturaCompraPago(
	fcp_id int not null,
	fcp_fecha timestamptz not null,
	fcp_importe decimal(18, 6) not null CONSTRAINT DF_FacturaCompraPago_fcp_importe  default (0),
	fc_id int not null,
 CONSTRAINT PK_FacturaCompraPago PRIMARY KEY  
(
	fcp_id 
) 
) 
;
/****** Object:  Table FacturaCompraDeuda    Script Date: 07/30/2012 17:11:01 ******/

;

;
create table FacturaCompraDeuda(
	fcd_id int not null,
	fcd_fecha timestamptz not null,
	fcd_fecha2 timestamptz not null CONSTRAINT DF_FacturaCompraDeuda_fcd_fecha2  default (getdate()),
	fcd_importe decimal(18, 6) not null CONSTRAINT DF_FacturaCompraDeuda_fcd_importe  default (0),
	fcd_pendiente decimal(18, 6) not null CONSTRAINT DF_FacturaCompraDeuda_fcd_pendiente  default (0),
	fc_id int not null,
 CONSTRAINT PK_FacturaCompraDeuda PRIMARY KEY  
(
	fcd_id 
) 
) 
;
/****** Object:  foreignKey FK_Aduana_Pais    Script Date: 07/30/2012 17:02:19 ******/
alter table Aduana   ADD  CONSTRAINT FK_Aduana_Pais forEIGN KEY(pa_id)
REFERENCES Pais (pa_id)
;
;
/****** Object:  foreignKey FK_Aduana_Usuario    Script Date: 07/30/2012 17:02:19 ******/
alter table Aduana  ADD  CONSTRAINT FK_Aduana_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;

;
/****** Object:  foreignKey FK_AFIPArchivo_AFIPEsquema    Script Date: 07/30/2012 17:02:22 ******/
alter table AFIPArchivo  ADD  CONSTRAINT FK_AFIPArchivo_AFIPEsquema forEIGN KEY(afesq_id)
REFERENCES AFIPEsquema (afesq_id)
;
;
/****** Object:  foreignKey FK_AFIPArchivo_Usuario    Script Date: 07/30/2012 17:02:22 ******/
alter table AFIPArchivo  ADD  CONSTRAINT FK_AFIPArchivo_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
;
/****** Object:  foreignKey FK_AFIPCampo_AFIPRegistro    Script Date: 07/30/2012 17:02:26 ******/
alter table AFIPCampo  ADD  CONSTRAINT FK_AFIPCampo_AFIPRegistro forEIGN KEY(afreg_id)
REFERENCES AFIPRegistro (afreg_id)
;

;
/****** Object:  foreignKey FK_AFIPCampo_Usuario    Script Date: 07/30/2012 17:02:26 ******/
alter table AFIPCampo  ADD  CONSTRAINT FK_AFIPCampo_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;

;
/****** Object:  foreignKey FK_AFIPEsquema_Usuario    Script Date: 07/30/2012 17:02:28 ******/
alter table AFIPEsquema  ADD  CONSTRAINT FK_AFIPEsquema_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;

;
/****** Object:  foreignKey FK_AFIPParametro_AFIPEsquema    Script Date: 07/30/2012 17:02:31 ******/
alter table AFIPParametro  ADD  CONSTRAINT FK_AFIPParametro_AFIPEsquema forEIGN KEY(afesq_id)
REFERENCES AFIPEsquema (afesq_id)
;

;
/****** Object:  foreignKey FK_AFIPParametro_Usuario    Script Date: 07/30/2012 17:02:31 ******/
alter table AFIPParametro  ADD  CONSTRAINT FK_AFIPParametro_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_AFIPParametro_Usuario
;
/****** Object:  foreignKey FK_AFIPRegistro_AFIPArchivo    Script Date: 07/30/2012 17:02:34 ******/
alter table AFIPRegistro  ADD  CONSTRAINT FK_AFIPRegistro_AFIPArchivo forEIGN KEY(afarch_id)
REFERENCES AFIPArchivo (afarch_id)
;

;
/****** Object:  foreignKey FK_AFIPRegistro_Usuario    Script Date: 07/30/2012 17:02:34 ******/
alter table AFIPRegistro  ADD  CONSTRAINT FK_AFIPRegistro_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;

;
/****** Object:  foreignKey FK_Agenda_PrestacionAgregar    Script Date: 07/30/2012 17:02:37 ******/
alter table Agenda  ADD  CONSTRAINT FK_Agenda_PrestacionAgregar forEIGN KEY(pre_id_agregar)
REFERENCES Prestacion (pre_id)
;

;
/****** Object:  foreignKey FK_Agenda_PrestacionBorrar    Script Date: 07/30/2012 17:02:37 ******/
alter table Agenda  ADD  CONSTRAINT FK_Agenda_PrestacionBorrar forEIGN KEY(pre_id_borrar)
REFERENCES Prestacion (pre_id)
;

;
/****** Object:  foreignKey FK_Agenda_PrestacionEditar    Script Date: 07/30/2012 17:02:37 ******/
alter table Agenda  ADD  CONSTRAINT FK_Agenda_PrestacionEditar forEIGN KEY(pre_id_editar)
REFERENCES Prestacion (pre_id)
;

;
/****** Object:  foreignKey FK_Agenda_PrestacionListar    Script Date: 07/30/2012 17:02:37 ******/
alter table Agenda  ADD  CONSTRAINT FK_Agenda_PrestacionListar forEIGN KEY(pre_id_listar)
REFERENCES Prestacion (pre_id)
;

;
/****** Object:  foreignKey FK_Agenda_PrestacionPropietario    Script Date: 07/30/2012 17:02:37 ******/
alter table Agenda  ADD  CONSTRAINT FK_Agenda_PrestacionPropietario forEIGN KEY(pre_id_propietario)
REFERENCES Prestacion (pre_id)
;

;
/****** Object:  foreignKey FK_Agenda_Usuario    Script Date: 07/30/2012 17:02:37 ******/
alter table Agenda  ADD  CONSTRAINT FK_Agenda_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;

;
/****** Object:  foreignKey FK_AjusteInflacion_Cuenta    Script Date: 07/30/2012 17:02:40 ******/
alter table AjusteInflacion  ADD  CONSTRAINT FK_AjusteInflacion_Cuenta forEIGN KEY(cue_id_patrimonial)
REFERENCES Cuenta (cue_id)
;

;
/****** Object:  foreignKey FK_AjusteInflacion_Cuenta1    Script Date: 07/30/2012 17:02:40 ******/
alter table AjusteInflacion  ADD  CONSTRAINT FK_AjusteInflacion_Cuenta1 forEIGN KEY(cue_id_resultados)
REFERENCES Cuenta (cue_id)
;

;
/****** Object:  foreignKey FK_AjusteInflacionItem_AjusteInflacion    Script Date: 07/30/2012 17:02:43 ******/
alter table AjusteInflacionItem  ADD  CONSTRAINT FK_AjusteInflacionItem_AjusteInflacion forEIGN KEY(aje_id)
REFERENCES AjusteInflacion (aje_id)
;

;
/****** Object:  foreignKey FK_AjusteInflacionItem_AjusteInflacionItemTipo    Script Date: 07/30/2012 17:02:43 ******/
alter table AjusteInflacionItem  ADD  CONSTRAINT FK_AjusteInflacionItem_AjusteInflacionItemTipo forEIGN KEY(ajit_id)
REFERENCES AjusteInflacionItemTipo (ajit_id)
;
-- FK_AjusteInflacionItem_AjusteInflacionItemTipo
;
/****** Object:  foreignKey FK_AjusteInflacionItem_Cuenta    Script Date: 07/30/2012 17:02:43 ******/
alter table AjusteInflacionItem  ADD  CONSTRAINT FK_AjusteInflacionItem_Cuenta forEIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_AjusteInflacionItem_Cuenta
;
/****** Object:  foreignKey FK_Alarma_Cliente    Script Date: 07/30/2012 17:02:49 ******/
alter table Alarma  ADD  CONSTRAINT FK_Alarma_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_Alarma_Cliente
;
/****** Object:  foreignKey FK_Alarma_ClienteSucursal    Script Date: 07/30/2012 17:02:49 ******/
alter table Alarma  ADD  CONSTRAINT FK_Alarma_ClienteSucursal forEIGN KEY(clis_id)
REFERENCES ClienteSucursal (clis_id)
;
-- FK_Alarma_ClienteSucursal
;
/****** Object:  foreignKey FK_Alarma_Proyecto    Script Date: 07/30/2012 17:02:49 ******/
alter table Alarma  ADD  CONSTRAINT FK_Alarma_Proyecto forEIGN KEY(proy_id)
REFERENCES Proyecto (proy_id)
;
-- FK_Alarma_Proyecto
;
/****** Object:  foreignKey FK_Alarma_Rubro    Script Date: 07/30/2012 17:02:49 ******/
alter table Alarma  ADD  CONSTRAINT FK_Alarma_Rubro forEIGN KEY(rub_id)
REFERENCES Rubro (rub_id)
;
-- FK_Alarma_Rubro
;
/****** Object:  foreignKey FK_Alarma_Usuario    Script Date: 07/30/2012 17:02:49 ******/
alter table Alarma  ADD  CONSTRAINT FK_Alarma_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Alarma_Usuario
;
/****** Object:  foreignKey FK_AlarmaDiaMes_Alarma    Script Date: 07/30/2012 17:02:51 ******/
alter table AlarmaDiaMes  ADD  CONSTRAINT FK_AlarmaDiaMes_Alarma forEIGN KEY(al_id)
REFERENCES Alarma (al_id)
;
-- FK_AlarmaDiaMes_Alarma
;
/****** Object:  foreignKey FK_AlarmaDiaSemana_Alarma    Script Date: 07/30/2012 17:02:52 ******/
alter table AlarmaDiaSemana  ADD  CONSTRAINT FK_AlarmaDiaSemana_Alarma forEIGN KEY(al_id)
REFERENCES Alarma (al_id)
;
-- FK_AlarmaDiaSemana_Alarma
;
/****** Object:  foreignKey FK_AlarmaFecha_Alarma    Script Date: 07/30/2012 17:02:54 ******/
alter table AlarmaFecha  ADD  CONSTRAINT FK_AlarmaFecha_Alarma forEIGN KEY(al_id)
REFERENCES Alarma (al_id)
;
-- FK_AlarmaFecha_Alarma
;
/****** Object:  foreignKey FK_AlarmaItem_Alarma    Script Date: 07/30/2012 17:02:58 ******/
alter table AlarmaItem  ADD  CONSTRAINT FK_AlarmaItem_Alarma forEIGN KEY(al_id)
REFERENCES Alarma (al_id)
;
-- FK_AlarmaItem_Alarma
;
/****** Object:  foreignKey FK_AlarmaItem_AlarmaItemTipo    Script Date: 07/30/2012 17:02:58 ******/
alter table AlarmaItem  ADD  CONSTRAINT FK_AlarmaItem_AlarmaItemTipo forEIGN KEY(alit_id)
REFERENCES AlarmaItemTipo (alit_id)
;
-- FK_AlarmaItem_AlarmaItemTipo
;
/****** Object:  foreignKey FK_AlarmaItem_Departamento    Script Date: 07/30/2012 17:02:58 ******/
alter table AlarmaItem  ADD  CONSTRAINT FK_AlarmaItem_Departamento forEIGN KEY(dpto_id)
REFERENCES Departamento (dpto_id)
;
-- FK_AlarmaItem_Departamento
;
/****** Object:  foreignKey FK_Alsa_Colmena    Script Date: 07/30/2012 17:03:11 ******/
alter table Alsa  ADD  CONSTRAINT FK_Alsa_Colmena forEIGN KEY(colm_id)
REFERENCES Colmena (colm_id)
;
-- FK_Alsa_Colmena
;
/****** Object:  foreignKey FK_Alsa_Usuario    Script Date: 07/30/2012 17:03:11 ******/
alter table Alsa  ADD  CONSTRAINT FK_Alsa_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Alsa_Usuario
;
/****** Object:  foreignKey FK_Alumno_Alumno    Script Date: 07/30/2012 17:03:15 ******/
alter table Alumno  ADD  CONSTRAINT FK_Alumno_Alumno forEIGN KEY(alum_id)
REFERENCES Alumno (alum_id)
;
-- FK_Alumno_Alumno
;
/****** Object:  foreignKey FK_Alumno_ClienteContactoTipo    Script Date: 07/30/2012 17:03:15 ******/
alter table Alumno  ADD  CONSTRAINT FK_Alumno_ClienteContactoTipo forEIGN KEY(clict_id)
REFERENCES ClienteContactoTipo (clict_id)
;
-- FK_Alumno_ClienteContactoTipo
;
/****** Object:  foreignKey FK_Alumno_Profesor    Script Date: 07/30/2012 17:03:15 ******/
alter table Alumno  ADD  CONSTRAINT FK_Alumno_Profesor forEIGN KEY(prof_id)
REFERENCES Profesor (prof_id)
;
-- FK_Alumno_Profesor
;
/****** Object:  foreignKey FK_Alumno_Proyecto    Script Date: 07/30/2012 17:03:15 ******/
alter table Alumno  ADD  CONSTRAINT FK_Alumno_Proyecto forEIGN KEY(proy_id)
REFERENCES Proyecto (proy_id)
;
-- FK_Alumno_Proyecto
;
/****** Object:  foreignKey FK_Alumno_Usuario    Script Date: 07/30/2012 17:03:15 ******/
alter table Alumno  ADD  CONSTRAINT FK_Alumno_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Alumno_Usuario
;
/****** Object:  foreignKey FK_Arbol_Tabla    Script Date: 07/30/2012 17:03:17 ******/
alter table Arbol  ADD  CONSTRAINT FK_Arbol_Tabla forEIGN KEY(tbl_Id)
REFERENCES Tabla (tbl_id)
;
-- FK_Arbol_Tabla
;
/****** Object:  foreignKey FK_Arbol_Usuario    Script Date: 07/30/2012 17:03:17 ******/
alter table Arbol  ADD  CONSTRAINT FK_Arbol_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Arbol_Usuario
;
/****** Object:  foreignKey FK_Asiento_Documento    Script Date: 07/30/2012 17:03:22 ******/
alter table Asiento  ADD  CONSTRAINT FK_Asiento_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_Asiento_Documento
;
/****** Object:  foreignKey FK_Asiento_DocumentoTipo    Script Date: 07/30/2012 17:03:22 ******/
alter table Asiento  ADD  CONSTRAINT FK_Asiento_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_Asiento_DocumentoTipo
;
/****** Object:  foreignKey FK_Asiento_DocumentoTipoCliente    Script Date: 07/30/2012 17:03:22 ******/
alter table Asiento  ADD  CONSTRAINT FK_Asiento_DocumentoTipoCliente forEIGN KEY(doct_id_cliente)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_Asiento_DocumentoTipoCliente
;
/****** Object:  foreignKey FK_Asiento_Usuario    Script Date: 07/30/2012 17:03:23 ******/
alter table Asiento  ADD  CONSTRAINT FK_Asiento_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Asiento_Usuario
;
/****** Object:  foreignKey FK_AsientoItem_Asiento    Script Date: 07/30/2012 17:03:26 ******/
alter table AsientoItem  ADD  CONSTRAINT FK_AsientoItem_Asiento forEIGN KEY(as_id)
REFERENCES Asiento (as_id)
;
-- FK_AsientoItem_Asiento
;
/****** Object:  foreignKey FK_AsientoItem_CentroCosto    Script Date: 07/30/2012 17:03:26 ******/
alter table AsientoItem  ADD  CONSTRAINT FK_AsientoItem_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_AsientoItem_CentroCosto
;
/****** Object:  foreignKey FK_AsientoItem_Cheque    Script Date: 07/30/2012 17:03:26 ******/
alter table AsientoItem  ADD  CONSTRAINT FK_AsientoItem_Cheque forEIGN KEY(cheq_id)
REFERENCES Cheque (cheq_id)
;
-- FK_AsientoItem_Cheque
;
/****** Object:  foreignKey FK_AsientoItem_Cuenta    Script Date: 07/30/2012 17:03:26 ******/
alter table AsientoItem  ADD  CONSTRAINT FK_AsientoItem_Cuenta forEIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_AsientoItem_Cuenta
;
/****** Object:  foreignKey FK_AsientoItem_Moneda    Script Date: 07/30/2012 17:03:26 ******/
alter table AsientoItem  ADD  CONSTRAINT FK_AsientoItem_Moneda forEIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_AsientoItem_Moneda
;
/****** Object:  foreignKey FK_AsientoItemBorradoTMP_AsientoTMP    Script Date: 07/30/2012 17:03:27 ******/
alter table AsientoItemBorradoTMP  ADD  CONSTRAINT FK_AsientoItemBorradoTMP_AsientoTMP forEIGN KEY(asTMP_id)
REFERENCES AsientoTMP (asTMP_id)
;
-- FK_AsientoItemBorradoTMP_AsientoTMP
;
/****** Object:  foreignKey FK_AsientoItemTMP_AsientoTMP    Script Date: 07/30/2012 17:03:29 ******/
alter table AsientoItemTMP  ADD  CONSTRAINT FK_AsientoItemTMP_AsientoTMP forEIGN KEY(asTMP_id)
REFERENCES AsientoTMP (asTMP_id)
;
-- FK_AsientoItemTMP_AsientoTMP
;
/****** Object:  foreignKey FK_AuditoriaItem_Auditoria    Script Date: 07/30/2012 17:03:35 ******/
alter table AuditoriaItem  ADD  CONSTRAINT FK_AuditoriaItem_Auditoria forEIGN KEY(aud_id)
REFERENCES Auditoria (aud_id)
;
-- FK_AuditoriaItem_Auditoria
;
/****** Object:  foreignKey FK_AuditoriaItem_AuditoriaGrupo    Script Date: 07/30/2012 17:03:35 ******/
alter table AuditoriaItem  ADD  CONSTRAINT FK_AuditoriaItem_AuditoriaGrupo forEIGN KEY(audg_id)
REFERENCES AuditoriaGrupo (audg_id)
;
-- FK_AuditoriaItem_AuditoriaGrupo
;
/****** Object:  foreignKey FK_AuditoriaItem_AuditoriaNivel    Script Date: 07/30/2012 17:03:35 ******/
alter table AuditoriaItem  ADD  CONSTRAINT FK_AuditoriaItem_AuditoriaNivel forEIGN KEY(audn_id)
REFERENCES AuditoriaNivel (audn_id)
;
-- FK_AuditoriaItem_AuditoriaNivel
;
/****** Object:  foreignKey FK_Aula_Usuario    Script Date: 07/30/2012 17:03:37 ******/
alter table Aula  ADD  CONSTRAINT FK_Aula_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Aula_Usuario
;
/****** Object:  foreignKey FK_Aviso_AvisoTipo    Script Date: 07/30/2012 17:03:40 ******/
alter table Aviso  ADD  CONSTRAINT FK_Aviso_AvisoTipo forEIGN KEY(avt_id)
REFERENCES AvisoTipo (avt_id)
;
-- FK_Aviso_AvisoTipo
;
/****** Object:  foreignKey FK_Aviso_Modifico    Script Date: 07/30/2012 17:03:40 ******/
alter table Aviso  ADD  CONSTRAINT FK_Aviso_Modifico forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Aviso_Modifico
;
/****** Object:  foreignKey FK_Aviso_Usuario    Script Date: 07/30/2012 17:03:40 ******/
alter table Aviso  ADD  CONSTRAINT FK_Aviso_Usuario forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_Aviso_Usuario
;
/****** Object:  foreignKey FK_Banco_Usuario    Script Date: 07/30/2012 17:03:44 ******/
alter table Banco  ADD  CONSTRAINT FK_Banco_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Banco_Usuario
;
/****** Object:  foreignKey FK_BancoConciliacionItem_BancoConciliacion    Script Date: 07/30/2012 17:03:51 ******/
alter table BancoConciliacionItem  ADD  CONSTRAINT FK_BancoConciliacionItem_BancoConciliacion forEIGN KEY(bcoc_id)
REFERENCES BancoConciliacion (bcoc_id)
;
-- FK_BancoConciliacionItem_BancoConciliacion
;
/****** Object:  foreignKey FK_Barco_Usuario    Script Date: 07/30/2012 17:03:53 ******/
alter table Barco  ADD  CONSTRAINT FK_Barco_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Barco_Usuario
;
/****** Object:  foreignKey FK_Caja_Documento    Script Date: 07/30/2012 17:03:55 ******/
alter table Caja  ADD  CONSTRAINT FK_Caja_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_Caja_Documento
;
/****** Object:  foreignKey FK_Caja_Empresa    Script Date: 07/30/2012 17:03:56 ******/
alter table Caja  ADD  CONSTRAINT FK_Caja_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_Caja_Empresa
;
/****** Object:  foreignKey FK_Caja_Sucursal    Script Date: 07/30/2012 17:03:56 ******/
alter table Caja  ADD  CONSTRAINT FK_Caja_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_Caja_Sucursal
;
/****** Object:  foreignKey FK_Caja_Usuario    Script Date: 07/30/2012 17:03:56 ******/
alter table Caja  ADD  CONSTRAINT FK_Caja_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Caja_Usuario
;
/****** Object:  foreignKey FK_CajaCajero_Caja    Script Date: 07/30/2012 17:03:57 ******/
alter table CajaCajero  ADD  CONSTRAINT FK_CajaCajero_Caja forEIGN KEY(cj_id)
REFERENCES Caja (cj_id)
;
-- FK_CajaCajero_Caja
;
/****** Object:  foreignKey FK_CajaCajero_Usuario    Script Date: 07/30/2012 17:03:57 ******/
alter table CajaCajero  ADD  CONSTRAINT FK_CajaCajero_Usuario forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_CajaCajero_Usuario
;
/****** Object:  foreignKey FK_CajaCuenta_Caja    Script Date: 07/30/2012 17:03:58 ******/
alter table CajaCuenta  ADD  CONSTRAINT FK_CajaCuenta_Caja forEIGN KEY(cj_id)
REFERENCES Caja (cj_id)
;
-- FK_CajaCuenta_Caja
;
/****** Object:  foreignKey FK_CajaCuenta_CuentaFondos    Script Date: 07/30/2012 17:03:58 ******/
alter table CajaCuenta  ADD  CONSTRAINT FK_CajaCuenta_CuentaFondos forEIGN KEY(cue_id_fondos)
REFERENCES Cuenta (cue_id)
;
-- FK_CajaCuenta_CuentaFondos
;
/****** Object:  foreignKey FK_CajaCuenta_CuentaTrabajo    Script Date: 07/30/2012 17:03:58 ******/
alter table CajaCuenta  ADD  CONSTRAINT FK_CajaCuenta_CuentaTrabajo forEIGN KEY(cue_id_trabajo)
REFERENCES Cuenta (cue_id)
;
-- FK_CajaCuenta_CuentaTrabajo
;
/****** Object:  foreignKey FK_Calibradora_Usuario    Script Date: 07/30/2012 17:04:00 ******/
alter table Calibradora  ADD  CONSTRAINT FK_Calibradora_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Calibradora_Usuario
;
/****** Object:  foreignKey FK_Calidad_Usuario    Script Date: 07/30/2012 17:04:02 ******/
alter table Calidad  ADD  CONSTRAINT FK_Calidad_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Calidad_Usuario
;
/****** Object:  foreignKey FK_Calle_Ciudad    Script Date: 07/30/2012 17:04:04 ******/
alter table Calle  ADD  CONSTRAINT FK_Calle_Ciudad forEIGN KEY(ciu_id)
REFERENCES Ciudad (ciu_id)
;
-- FK_Calle_Ciudad
;
/****** Object:  foreignKey FK_CalleAltura_Calle    Script Date: 07/30/2012 17:04:06 ******/
alter table CalleAltura  ADD  CONSTRAINT FK_CalleAltura_Calle forEIGN KEY(calle_id)
REFERENCES Calle (calle_id)
;
-- FK_CalleAltura_Calle
;
/****** Object:  foreignKey FK_Camion_Chofer    Script Date: 07/30/2012 17:04:09 ******/
alter table Camion  ADD  CONSTRAINT FK_Camion_Chofer forEIGN KEY(chof_id)
REFERENCES Chofer (chof_id)
;
-- FK_Camion_Chofer
;
/****** Object:  foreignKey FK_Camion_Transporte    Script Date: 07/30/2012 17:04:09 ******/
alter table Camion  ADD  CONSTRAINT FK_Camion_Transporte forEIGN KEY(trans_id)
REFERENCES Transporte (trans_id)
;
-- FK_Camion_Transporte
;
/****** Object:  foreignKey FK_camion_Usuario    Script Date: 07/30/2012 17:04:09 ******/
alter table Camion  ADD  CONSTRAINT FK_camion_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_camion_Usuario
;
/****** Object:  foreignKey FK_CashFlowItem_CashFlow    Script Date: 07/30/2012 17:04:14 ******/
alter table CashFlowItem  ADD  CONSTRAINT FK_CashFlowItem_CashFlow forEIGN KEY(cf_id)
REFERENCES CashFlow (cf_id)
;
-- FK_CashFlowItem_CashFlow
;
/****** Object:  foreignKey FK_CashFlowParam_Banco    Script Date: 07/30/2012 17:04:15 ******/
alter table CashFlowParam  ADD  CONSTRAINT FK_CashFlowParam_Banco forEIGN KEY(bco_id)
REFERENCES Banco (bco_id)
;
-- FK_CashFlowParam_Banco
;
/****** Object:  foreignKey FK_CashFlowParam_CashFlow    Script Date: 07/30/2012 17:04:15 ******/
alter table CashFlowParam  ADD  CONSTRAINT FK_CashFlowParam_CashFlow forEIGN KEY(cf_id)
REFERENCES CashFlow (cf_id)
;
-- FK_CashFlowParam_CashFlow
;
/****** Object:  foreignKey FK_CashFlowParam_Cliente    Script Date: 07/30/2012 17:04:15 ******/
alter table CashFlowParam  ADD  CONSTRAINT FK_CashFlowParam_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_CashFlowParam_Cliente
;
/****** Object:  foreignKey FK_CashFlowParam_Cuenta    Script Date: 07/30/2012 17:04:16 ******/
alter table CashFlowParam  ADD  CONSTRAINT FK_CashFlowParam_Cuenta forEIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_CashFlowParam_Cuenta
;
/****** Object:  foreignKey FK_CashFlowParam_Proveedor    Script Date: 07/30/2012 17:04:16 ******/
alter table CashFlowParam  ADD  CONSTRAINT FK_CashFlowParam_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_CashFlowParam_Proveedor
;
/****** Object:  foreignKey FK_CatalogoWebCategoriaItem_CatalogoWebCategoria    Script Date: 07/30/2012 17:04:23 ******/
alter table CatalogoWebCategoriaItem  ADD  CONSTRAINT FK_CatalogoWebCategoriaItem_CatalogoWebCategoria forEIGN KEY(catwc_id)
REFERENCES CatalogoWebCategoria (catwc_id)
;
-- FK_CatalogoWebCategoriaItem_CatalogoWebCategoria
;
/****** Object:  foreignKey FK_CatalogoWebCategoriaItem_Producto    Script Date: 07/30/2012 17:04:23 ******/
alter table CatalogoWebCategoriaItem  ADD  CONSTRAINT FK_CatalogoWebCategoriaItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_CatalogoWebCategoriaItem_Producto
;
/****** Object:  foreignKey FK_CatalogoWebItem_CatalogoWeb    Script Date: 07/30/2012 17:04:26 ******/
alter table CatalogoWebItem  ADD  CONSTRAINT FK_CatalogoWebItem_CatalogoWeb forEIGN KEY(catw_id)
REFERENCES CatalogoWeb (catw_id)
;
-- FK_CatalogoWebItem_CatalogoWeb
;
/****** Object:  foreignKey FK_CatalogoWebItem_Producto    Script Date: 07/30/2012 17:04:26 ******/
alter table CatalogoWebItem  ADD  CONSTRAINT FK_CatalogoWebItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_CatalogoWebItem_Producto
;
/****** Object:  foreignKey FK_CatalogoWebProductoImage_CatalogoWeb    Script Date: 07/30/2012 17:04:27 ******/
alter table CatalogoWebProductoImage  ADD  CONSTRAINT FK_CatalogoWebProductoImage_CatalogoWeb forEIGN KEY(catw_id)
REFERENCES CatalogoWeb (catw_id)
;
-- FK_CatalogoWebProductoImage_CatalogoWeb
;
/****** Object:  foreignKey FK_CatalogoWebProductoImage_ProductoWebImage    Script Date: 07/30/2012 17:04:27 ******/
alter table CatalogoWebProductoImage  ADD  CONSTRAINT FK_CatalogoWebProductoImage_ProductoWebImage forEIGN KEY(prwi_id)
REFERENCES ProductoWebImage (prwi_id)
;
-- FK_CatalogoWebProductoImage_ProductoWebImage
;
/****** Object:  foreignKey FK_CatalogoWebProductoImageLink_CatalogoWeb    Script Date: 07/30/2012 17:04:28 ******/
alter table CatalogoWebProductoImageLink  ADD  CONSTRAINT FK_CatalogoWebProductoImageLink_CatalogoWeb forEIGN KEY(catw_id)
REFERENCES CatalogoWeb (catw_id)
;
-- FK_CatalogoWebProductoImageLink_CatalogoWeb
;
/****** Object:  foreignKey FK_CatalogoWebProductoImageLink_ProductoWebImage    Script Date: 07/30/2012 17:04:28 ******/
alter table CatalogoWebProductoImageLink  ADD  CONSTRAINT FK_CatalogoWebProductoImageLink_ProductoWebImage forEIGN KEY(prwi_id)
REFERENCES ProductoWebImage (prwi_id)
;
-- FK_CatalogoWebProductoImageLink_ProductoWebImage
;
/****** Object:  foreignKey FK_CDRomArchivo_CDRom    Script Date: 07/30/2012 17:04:35 ******/
alter table CDRomArchivo  ADD  CONSTRAINT FK_CDRomArchivo_CDRom forEIGN KEY(cd_id)
REFERENCES CDRom (cd_id)
;
-- FK_CDRomArchivo_CDRom
;
/****** Object:  foreignKey FK_CDRomArchivo_CDRomCarpeta    Script Date: 07/30/2012 17:04:35 ******/
alter table CDRomArchivo  ADD  CONSTRAINT FK_CDRomArchivo_CDRomCarpeta forEIGN KEY(cdc_id)
REFERENCES CDRomCarpeta (cdc_id)
;
-- FK_CDRomArchivo_CDRomCarpeta
;
/****** Object:  foreignKey FK_CDRomCarpeta_CDRom    Script Date: 07/30/2012 17:04:37 ******/
alter table CDRomCarpeta  ADD  CONSTRAINT FK_CDRomCarpeta_CDRom forEIGN KEY(cd_id)
REFERENCES CDRom (cd_id)
;
-- FK_CDRomCarpeta_CDRom
;
/****** Object:  foreignKey FK_CentroCosto_CentroCosto    Script Date: 07/30/2012 17:04:40 ******/
alter table CentroCosto  ADD  CONSTRAINT FK_CentroCosto_CentroCosto forEIGN KEY(ccos_id_padre)
REFERENCES CentroCosto (ccos_id)
;
-- FK_CentroCosto_CentroCosto
;
/****** Object:  foreignKey FK_Cheque_Banco    Script Date: 07/30/2012 17:04:47 ******/
alter table Cheque  ADD  CONSTRAINT FK_Cheque_Banco forEIGN KEY(bco_id)
REFERENCES Banco (bco_id)
;
-- FK_Cheque_Banco
;
/****** Object:  foreignKey FK_Cheque_Chequera    Script Date: 07/30/2012 17:04:47 ******/
alter table Cheque  ADD  CONSTRAINT FK_Cheque_Chequera forEIGN KEY(chq_id)
REFERENCES Chequera (chq_id)
;
-- FK_Cheque_Chequera
;
/****** Object:  foreignKey FK_Cheque_Clearing    Script Date: 07/30/2012 17:04:47 ******/
alter table Cheque  ADD  CONSTRAINT FK_Cheque_Clearing forEIGN KEY(cle_id)
REFERENCES Clearing (cle_id)
;
-- FK_Cheque_Clearing
;
/****** Object:  foreignKey FK_Cheque_Cliente    Script Date: 07/30/2012 17:04:47 ******/
alter table Cheque  ADD  CONSTRAINT FK_Cheque_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_Cheque_Cliente
;
/****** Object:  foreignKey FK_Cheque_Cobranza    Script Date: 07/30/2012 17:04:47 ******/
alter table Cheque  ADD  CONSTRAINT FK_Cheque_Cobranza forEIGN KEY(cobz_id)
REFERENCES Cobranza (cobz_id)
;
-- FK_Cheque_Cobranza
;
/****** Object:  foreignKey FK_Cheque_Cuenta    Script Date: 07/30/2012 17:04:48 ******/
alter table Cheque  ADD  CONSTRAINT FK_Cheque_Cuenta forEIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_Cheque_Cuenta
;
/****** Object:  foreignKey FK_Cheque_DepositoBanco    Script Date: 07/30/2012 17:04:48 ******/
alter table Cheque  ADD  CONSTRAINT FK_Cheque_DepositoBanco forEIGN KEY(dbco_id)
REFERENCES DepositoBanco (dbco_id)
;
-- FK_Cheque_DepositoBanco
;
/****** Object:  foreignKey FK_Cheque_Empresa    Script Date: 07/30/2012 17:04:48 ******/
alter table Cheque  ADD  CONSTRAINT FK_Cheque_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_Cheque_Empresa
;
/****** Object:  foreignKey FK_Cheque_FacturaCompraND1    Script Date: 07/30/2012 17:04:48 ******/
alter table Cheque  ADD  CONSTRAINT FK_Cheque_FacturaCompraND1 forEIGN KEY(fc_id_nd1)
REFERENCES FacturaCompra (fc_id)
;
-- FK_Cheque_FacturaCompraND1
;
/****** Object:  foreignKey FK_Cheque_FacturaCompraND2    Script Date: 07/30/2012 17:04:48 ******/
alter table Cheque  ADD  CONSTRAINT FK_Cheque_FacturaCompraND2 forEIGN KEY(fc_id_nd2)
REFERENCES FacturaCompra (fc_id)
;
-- FK_Cheque_FacturaCompraND2
;
/****** Object:  foreignKey FK_Cheque_FacturaVentaND    Script Date: 07/30/2012 17:04:48 ******/
alter table Cheque  ADD  CONSTRAINT FK_Cheque_FacturaVentaND forEIGN KEY(fv_id_nd)
REFERENCES FacturaVenta (fv_id)
;
-- FK_Cheque_FacturaVentaND
;
/****** Object:  foreignKey FK_Cheque_Moneda    Script Date: 07/30/2012 17:04:48 ******/
alter table Cheque  ADD  CONSTRAINT FK_Cheque_Moneda forEIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_Cheque_Moneda
;
/****** Object:  foreignKey FK_Cheque_MovimientoFondo    Script Date: 07/30/2012 17:04:48 ******/
alter table Cheque  ADD  CONSTRAINT FK_Cheque_MovimientoFondo forEIGN KEY(mf_id)
REFERENCES MovimientoFondo (mf_id)
;
-- FK_Cheque_MovimientoFondo
;
/****** Object:  foreignKey FK_Cheque_Proveedor    Script Date: 07/30/2012 17:04:48 ******/
alter table Cheque  ADD  CONSTRAINT FK_Cheque_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_Cheque_Proveedor
;
/****** Object:  foreignKey FK_Chofer_Camion    Script Date: 07/30/2012 17:04:54 ******/
alter table Chofer  ADD  CONSTRAINT FK_Chofer_Camion forEIGN KEY(cam_id)
REFERENCES Camion (cam_id)
;
-- FK_Chofer_Camion
;
/****** Object:  foreignKey FK_Chofer_Transporte    Script Date: 07/30/2012 17:04:54 ******/
alter table Chofer  ADD  CONSTRAINT FK_Chofer_Transporte forEIGN KEY(trans_id)
REFERENCES Transporte (trans_id)
;
-- FK_Chofer_Transporte
;
/****** Object:  foreignKey FK_Chofer_Usuario    Script Date: 07/30/2012 17:04:54 ******/
alter table Chofer  ADD  CONSTRAINT FK_Chofer_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Chofer_Usuario
;
/****** Object:  foreignKey FK_CircuitoContable_Usuario    Script Date: 07/30/2012 17:04:57 ******/
alter table CircuitoContable  ADD  CONSTRAINT FK_CircuitoContable_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_CircuitoContable_Usuario
;
/****** Object:  foreignKey FK_Ciudad_Provincia1    Script Date: 07/30/2012 17:04:59 ******/
alter table Ciudad  ADD  CONSTRAINT FK_Ciudad_Provincia1 forEIGN KEY(pro_id)
REFERENCES Provincia (pro_id)
;
-- FK_Ciudad_Provincia1
;
/****** Object:  foreignKey FK_Ciudad_Usuario    Script Date: 07/30/2012 17:04:59 ******/
alter table Ciudad  ADD  CONSTRAINT FK_Ciudad_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Ciudad_Usuario
;
/****** Object:  foreignKey FK_Cliente_Cliente    Script Date: 07/30/2012 17:05:15 ******/
alter table Cliente  ADD  CONSTRAINT FK_Cliente_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_Cliente_Cliente
;
/****** Object:  foreignKey FK_Cliente_ClienteContactoTipo    Script Date: 07/30/2012 17:05:15 ******/
alter table Cliente  ADD  CONSTRAINT FK_Cliente_ClienteContactoTipo forEIGN KEY(clict_id)
REFERENCES ClienteContactoTipo (clict_id)
;
-- FK_Cliente_ClienteContactoTipo
;
/****** Object:  foreignKey FK_Cliente_ClienteReferido    Script Date: 07/30/2012 17:05:15 ******/
alter table Cliente  ADD  CONSTRAINT FK_Cliente_ClienteReferido forEIGN KEY(cli_id_referido)
REFERENCES Cliente (cli_id)
;
-- FK_Cliente_ClienteReferido
;
/****** Object:  foreignKey FK_Cliente_CondicionPago    Script Date: 07/30/2012 17:05:15 ******/
alter table Cliente  ADD  CONSTRAINT FK_Cliente_CondicionPago forEIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_Cliente_CondicionPago
;
/****** Object:  foreignKey FK_Cliente_FormaPago    Script Date: 07/30/2012 17:05:15 ******/
alter table Cliente  ADD  CONSTRAINT FK_Cliente_FormaPago forEIGN KEY(fp_id)
REFERENCES formaPago (fp_id)
;
-- FK_Cliente_FormaPago
;
/****** Object:  foreignKey FK_Cliente_ListaDescuento    Script Date: 07/30/2012 17:05:15 ******/
alter table Cliente  ADD  CONSTRAINT FK_Cliente_ListaDescuento forEIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_Cliente_ListaDescuento
;
/****** Object:  foreignKey FK_Cliente_ListaPrecio    Script Date: 07/30/2012 17:05:15 ******/
alter table Cliente  ADD  CONSTRAINT FK_Cliente_ListaPrecio forEIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_Cliente_ListaPrecio
;
/****** Object:  foreignKey FK_Cliente_Provincia    Script Date: 07/30/2012 17:05:15 ******/
alter table Cliente  ADD  CONSTRAINT FK_Cliente_Provincia forEIGN KEY(pro_id)
REFERENCES Provincia (pro_id)
;
-- FK_Cliente_Provincia
;
/****** Object:  foreignKey FK_Cliente_Proyecto    Script Date: 07/30/2012 17:05:15 ******/
alter table Cliente  ADD  CONSTRAINT FK_Cliente_Proyecto forEIGN KEY(proy_id)
REFERENCES Proyecto (proy_id)
;
-- FK_Cliente_Proyecto
;
/****** Object:  foreignKey FK_Cliente_Transporte    Script Date: 07/30/2012 17:05:15 ******/
alter table Cliente  ADD  CONSTRAINT FK_Cliente_Transporte forEIGN KEY(trans_id)
REFERENCES Transporte (trans_id)
;
-- FK_Cliente_Transporte
;
/****** Object:  foreignKey FK_Cliente_Usuario    Script Date: 07/30/2012 17:05:16 ******/
alter table Cliente  ADD  CONSTRAINT FK_Cliente_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Cliente_Usuario
;
/****** Object:  foreignKey FK_Cliente_Usuario1    Script Date: 07/30/2012 17:05:16 ******/
alter table Cliente  ADD  CONSTRAINT FK_Cliente_Usuario1 forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_Cliente_Usuario1
;
/****** Object:  foreignKey FK_Cliente_Vendedor    Script Date: 07/30/2012 17:05:16 ******/
alter table Cliente  ADD  CONSTRAINT FK_Cliente_Vendedor forEIGN KEY(ven_id)
REFERENCES Vendedor (ven_id)
;
-- FK_Cliente_Vendedor
;
/****** Object:  foreignKey FK_Cliente_Zona    Script Date: 07/30/2012 17:05:16 ******/
alter table Cliente  ADD  CONSTRAINT FK_Cliente_Zona forEIGN KEY(zon_id)
REFERENCES Zona (zon_id)
;
-- FK_Cliente_Zona
;
/****** Object:  foreignKey FK_ClienteCacheCredito_Cliente    Script Date: 07/30/2012 17:05:17 ******/
alter table ClienteCacheCredito  ADD  CONSTRAINT FK_ClienteCacheCredito_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_ClienteCacheCredito_Cliente
;
/****** Object:  foreignKey FK_ClienteCacheCredito_Empresa    Script Date: 07/30/2012 17:05:17 ******/
alter table ClienteCacheCredito  ADD  CONSTRAINT FK_ClienteCacheCredito_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_ClienteCacheCredito_Empresa
;
/****** Object:  foreignKey FK_ClienteContactoTipo_Usuario    Script Date: 07/30/2012 17:05:19 ******/
alter table ClienteContactoTipo  ADD  CONSTRAINT FK_ClienteContactoTipo_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ClienteContactoTipo_Usuario
;
/****** Object:  foreignKey FK_ClienteCuentaGrupo_Cliente    Script Date: 07/30/2012 17:05:21 ******/
alter table ClienteCuentaGrupo  ADD  CONSTRAINT FK_ClienteCuentaGrupo_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_ClienteCuentaGrupo_Cliente
;
/****** Object:  foreignKey FK_ClienteCuentaGrupo_Cuenta    Script Date: 07/30/2012 17:05:21 ******/
alter table ClienteCuentaGrupo  ADD  CONSTRAINT FK_ClienteCuentaGrupo_Cuenta forEIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_ClienteCuentaGrupo_Cuenta
;
/****** Object:  foreignKey FK_ClienteCuentaGrupo_CuentaGrupo    Script Date: 07/30/2012 17:05:21 ******/
alter table ClienteCuentaGrupo  ADD  CONSTRAINT FK_ClienteCuentaGrupo_CuentaGrupo forEIGN KEY(cueg_id)
REFERENCES CuentaGrupo (cueg_id)
;
-- FK_ClienteCuentaGrupo_CuentaGrupo
;
/****** Object:  foreignKey FK_ClienteCuentaGrupo_Usuario    Script Date: 07/30/2012 17:05:21 ******/
alter table ClienteCuentaGrupo  ADD  CONSTRAINT FK_ClienteCuentaGrupo_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ClienteCuentaGrupo_Usuario
;
/****** Object:  foreignKey FK_ClientePercepcion_Percepcion    Script Date: 07/30/2012 17:05:23 ******/
alter table ClientePercepcion  ADD  CONSTRAINT FK_ClientePercepcion_Percepcion forEIGN KEY(perc_id)
REFERENCES Percepcion (perc_id)
;
-- FK_ClientePercepcion_Percepcion
;
/****** Object:  foreignKey FK_ClienteRetencion_Cliente    Script Date: 07/30/2012 17:05:23 ******/
alter table ClientePercepcion  ADD  CONSTRAINT FK_ClienteRetencion_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_ClienteRetencion_Cliente
;
/****** Object:  foreignKey FK__ClienteSucursal_Usuario    Script Date: 07/30/2012 17:05:28 ******/
alter table ClienteSucursal  ADD  CONSTRAINT FK__ClienteSucursal_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK__ClienteSucursal_Usuario
;
/****** Object:  foreignKey FK_ClienteSucursal_Pais    Script Date: 07/30/2012 17:05:28 ******/
alter table ClienteSucursal  ADD  CONSTRAINT FK_ClienteSucursal_Pais forEIGN KEY(pa_id)
REFERENCES Pais (pa_id)
;
-- FK_ClienteSucursal_Pais
;
/****** Object:  foreignKey FK_ClienteSucursal_Provincia    Script Date: 07/30/2012 17:05:29 ******/
alter table ClienteSucursal  ADD  CONSTRAINT FK_ClienteSucursal_Provincia forEIGN KEY(pro_id)
REFERENCES Provincia (pro_id)
;
-- FK_ClienteSucursal_Provincia
;
/****** Object:  foreignKey FK_ClienteSucursal_Zona    Script Date: 07/30/2012 17:05:29 ******/
alter table ClienteSucursal  ADD  CONSTRAINT FK_ClienteSucursal_Zona forEIGN KEY(zon_id)
REFERENCES Zona (zon_id)
;
-- FK_ClienteSucursal_Zona
;
/****** Object:  foreignKey FK_Cobrador_ReglaLiquidacion    Script Date: 07/30/2012 17:05:31 ******/
alter table Cobrador  ADD  CONSTRAINT FK_Cobrador_ReglaLiquidacion forEIGN KEY(rel_id)
REFERENCES ReglaLiquidacion (rel_id)
;
-- FK_Cobrador_ReglaLiquidacion
;
/****** Object:  foreignKey FK_Cobranza_Asiento    Script Date: 07/30/2012 17:05:37 ******/
alter table Cobranza  ADD  CONSTRAINT FK_Cobranza_Asiento forEIGN KEY(as_id)
REFERENCES Asiento (as_id)
;
-- FK_Cobranza_Asiento
;
/****** Object:  foreignKey FK_Cobranza_CentroCosto    Script Date: 07/30/2012 17:05:38 ******/
alter table Cobranza  ADD  CONSTRAINT FK_Cobranza_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_Cobranza_CentroCosto
;
/****** Object:  foreignKey FK_Cobranza_Cobrador    Script Date: 07/30/2012 17:05:38 ******/
alter table Cobranza  ADD  CONSTRAINT FK_Cobranza_Cobrador forEIGN KEY(cob_id)
REFERENCES Cobrador (cob_id)
;
-- FK_Cobranza_Cobrador
;
/****** Object:  foreignKey FK_Cobranza_Legajo    Script Date: 07/30/2012 17:05:38 ******/
alter table Cobranza  ADD  CONSTRAINT FK_Cobranza_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_Cobranza_Legajo
;
/****** Object:  foreignKey FK_CobranzaItem_CentroCosto    Script Date: 07/30/2012 17:05:42 ******/
alter table CobranzaItem  ADD  CONSTRAINT FK_CobranzaItem_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_CobranzaItem_CentroCosto
;
/****** Object:  foreignKey FK_CobranzaItem_Cheque    Script Date: 07/30/2012 17:05:42 ******/
alter table CobranzaItem  ADD  CONSTRAINT FK_CobranzaItem_Cheque forEIGN KEY(cheq_id)
REFERENCES Cheque (cheq_id)
;
-- FK_CobranzaItem_Cheque
;
/****** Object:  foreignKey FK_CobranzaItem_Cobranza    Script Date: 07/30/2012 17:05:43 ******/
alter table CobranzaItem  ADD  CONSTRAINT FK_CobranzaItem_Cobranza forEIGN KEY(cobz_id)
REFERENCES Cobranza (cobz_id)
;
-- FK_CobranzaItem_Cobranza
;
/****** Object:  foreignKey FK_CobranzaItem_Cuenta    Script Date: 07/30/2012 17:05:43 ******/
alter table CobranzaItem  ADD  CONSTRAINT FK_CobranzaItem_Cuenta forEIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_CobranzaItem_Cuenta
;
/****** Object:  foreignKey FK_CobranzaItem_Retencion    Script Date: 07/30/2012 17:05:43 ******/
alter table CobranzaItem  ADD  CONSTRAINT FK_CobranzaItem_Retencion forEIGN KEY(ret_id)
REFERENCES Retencion (ret_id)
;
-- FK_CobranzaItem_Retencion
;
/****** Object:  foreignKey FK_CobranzaItem_TarjetaCreditoCupon    Script Date: 07/30/2012 17:05:43 ******/
alter table CobranzaItem  ADD  CONSTRAINT FK_CobranzaItem_TarjetaCreditoCupon forEIGN KEY(tjcc_id)
REFERENCES TarjetaCreditoCupon (tjcc_id)
;
-- FK_CobranzaItem_TarjetaCreditoCupon
;
/****** Object:  foreignKey FK_CobranzaItemBorradoTMP_CobranzaTMP    Script Date: 07/30/2012 17:05:44 ******/
alter table CobranzaItemBorradoTMP  ADD  CONSTRAINT FK_CobranzaItemBorradoTMP_CobranzaTMP forEIGN KEY(cobzTMP_id)
REFERENCES CobranzaTMP (cobzTMP_id)
;
-- FK_CobranzaItemBorradoTMP_CobranzaTMP
;
/****** Object:  foreignKey FK_CobranzaItemTMP_CobranzaTMP    Script Date: 07/30/2012 17:05:51 ******/
alter table CobranzaItemTMP  ADD  CONSTRAINT FK_CobranzaItemTMP_CobranzaTMP forEIGN KEY(cobzTMP_id)
REFERENCES CobranzaTMP (cobzTMP_id)
;
-- FK_CobranzaItemTMP_CobranzaTMP
;
/****** Object:  foreignKey FK_CodigoPostalItem_CodigoPostal    Script Date: 07/30/2012 17:06:00 ******/
alter table CodigoPostalItem  ADD  CONSTRAINT FK_CodigoPostalItem_CodigoPostal forEIGN KEY(cpa_id)
REFERENCES CodigoPostal (cpa_id)
;
-- FK_CodigoPostalItem_CodigoPostal
;
/****** Object:  foreignKey FK_CodigoPostalItem_Provincia    Script Date: 07/30/2012 17:06:00 ******/
alter table CodigoPostalItem  ADD  CONSTRAINT FK_CodigoPostalItem_Provincia forEIGN KEY(pro_id)
REFERENCES Provincia (pro_id)
;
-- FK_CodigoPostalItem_Provincia
;
/****** Object:  foreignKey FK_Colmena_Usuario    Script Date: 07/30/2012 17:06:04 ******/
alter table Colmena  ADD  CONSTRAINT FK_Colmena_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Colmena_Usuario
;
/****** Object:  foreignKey FK_ComunidadInternet_DepositoLogico    Script Date: 07/30/2012 17:06:07 ******/
alter table ComunidadInternet  ADD  CONSTRAINT FK_ComunidadInternet_DepositoLogico forEIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_ComunidadInternet_DepositoLogico
;
/****** Object:  foreignKey FK_ComunidadInternet_Documento    Script Date: 07/30/2012 17:06:07 ******/
alter table ComunidadInternet  ADD  CONSTRAINT FK_ComunidadInternet_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_ComunidadInternet_Documento
;
/****** Object:  foreignKey FK_ComunidadInternet_ListaDescuento    Script Date: 07/30/2012 17:06:08 ******/
alter table ComunidadInternet  ADD  CONSTRAINT FK_ComunidadInternet_ListaDescuento forEIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_ComunidadInternet_ListaDescuento
;
/****** Object:  foreignKey FK_ComunidadInternet_ListaPrecio    Script Date: 07/30/2012 17:06:08 ******/
alter table ComunidadInternet  ADD  CONSTRAINT FK_ComunidadInternet_ListaPrecio forEIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_ComunidadInternet_ListaPrecio
;
/****** Object:  foreignKey FK_ComunidadInternet_Producto    Script Date: 07/30/2012 17:06:08 ******/
alter table ComunidadInternet  ADD  CONSTRAINT FK_ComunidadInternet_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ComunidadInternet_Producto
;
/****** Object:  foreignKey FK_ComunidadInternet_Sucursal    Script Date: 07/30/2012 17:06:08 ******/
alter table ComunidadInternet  ADD  CONSTRAINT FK_ComunidadInternet_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_ComunidadInternet_Sucursal
;
/****** Object:  foreignKey FK_ComunidadInternet_Usuario    Script Date: 07/30/2012 17:06:08 ******/
alter table ComunidadInternet  ADD  CONSTRAINT FK_ComunidadInternet_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ComunidadInternet_Usuario
;
/****** Object:  foreignKey FK_ComunidadInternetAplicacion_ComunidadInternet    Script Date: 07/30/2012 17:06:10 ******/
alter table ComunidadInternetAplicacion  ADD  CONSTRAINT FK_ComunidadInternetAplicacion_ComunidadInternet forEIGN KEY(cmia_id)
REFERENCES ComunidadInternet (cmi_id)
;
-- FK_ComunidadInternetAplicacion_ComunidadInternet
;
/****** Object:  foreignKey FK_ComunidadInternetAplicacion_Usuario    Script Date: 07/30/2012 17:06:10 ******/
alter table ComunidadInternetAplicacion  ADD  CONSTRAINT FK_ComunidadInternetAplicacion_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ComunidadInternetAplicacion_Usuario
;
/****** Object:  foreignKey FK_ComunidadInternetCobro_Cliente    Script Date: 07/30/2012 17:06:14 ******/
alter table ComunidadInternetCobro  ADD  CONSTRAINT FK_ComunidadInternetCobro_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_ComunidadInternetCobro_Cliente
;
/****** Object:  foreignKey FK_ComunidadInternetCobro_ComunidadInternet    Script Date: 07/30/2012 17:06:14 ******/
alter table ComunidadInternetCobro  ADD  CONSTRAINT FK_ComunidadInternetCobro_ComunidadInternet forEIGN KEY(cmi_id)
REFERENCES ComunidadInternet (cmi_id)
;
-- FK_ComunidadInternetCobro_ComunidadInternet
;
/****** Object:  foreignKey FK_ComunidadInternetCobro_Producto    Script Date: 07/30/2012 17:06:14 ******/
alter table ComunidadInternetCobro  ADD  CONSTRAINT FK_ComunidadInternetCobro_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ComunidadInternetCobro_Producto
;
/****** Object:  foreignKey FK_ComunidadInternetEmailAccount_Usuario    Script Date: 07/30/2012 17:06:17 ******/
alter table ComunidadInternetEmailAccount  ADD  CONSTRAINT FK_ComunidadInternetEmailAccount_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ComunidadInternetEmailAccount_Usuario
;
/****** Object:  foreignKey FK_ComunidadInternetMail_Cliente    Script Date: 07/30/2012 17:06:21 ******/
alter table ComunidadInternetMail  ADD  CONSTRAINT FK_ComunidadInternetMail_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_ComunidadInternetMail_Cliente
;
/****** Object:  foreignKey FK_ComunidadInternetMail_ComunidadInternet    Script Date: 07/30/2012 17:06:21 ******/
alter table ComunidadInternetMail  ADD  CONSTRAINT FK_ComunidadInternetMail_ComunidadInternet forEIGN KEY(cmi_id)
REFERENCES ComunidadInternet (cmi_id)
;
-- FK_ComunidadInternetMail_ComunidadInternet
;
/****** Object:  foreignKey FK_ComunidadInternetMail_Estado    Script Date: 07/30/2012 17:06:21 ******/
alter table ComunidadInternetMail  ADD  CONSTRAINT FK_ComunidadInternetMail_Estado forEIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_ComunidadInternetMail_Estado
;
/****** Object:  foreignKey FK_ComunidadInternetMail_PedidoVenta    Script Date: 07/30/2012 17:06:21 ******/
alter table ComunidadInternetMail  ADD  CONSTRAINT FK_ComunidadInternetMail_PedidoVenta forEIGN KEY(pv_id)
REFERENCES PedidoVenta (pv_id)
;
-- FK_ComunidadInternetMail_PedidoVenta
;
/****** Object:  foreignKey FK_ComunidadInternetMailItem_ComunidadInternetMail    Script Date: 07/30/2012 17:06:22 ******/
alter table ComunidadInternetMailItem  ADD  CONSTRAINT FK_ComunidadInternetMailItem_ComunidadInternetMail forEIGN KEY(cmie_id)
REFERENCES ComunidadInternetMail (cmie_id)
;
-- FK_ComunidadInternetMailItem_ComunidadInternetMail
;
/****** Object:  foreignKey FK_ComunidadInternetMailItem_ComunidadInternetTexto    Script Date: 07/30/2012 17:06:22 ******/
alter table ComunidadInternetMailItem  ADD  CONSTRAINT FK_ComunidadInternetMailItem_ComunidadInternetTexto forEIGN KEY(cmiti_id)
REFERENCES ComunidadInternetTextoItem (cmiti_id)
;
-- FK_ComunidadInternetMailItem_ComunidadInternetTexto
;
/****** Object:  foreignKey FK_ComunidadInternetProducto_ComunidadInternet    Script Date: 07/30/2012 17:06:29 ******/
alter table ComunidadInternetProducto  ADD  CONSTRAINT FK_ComunidadInternetProducto_ComunidadInternet forEIGN KEY(cmi_id)
REFERENCES ComunidadInternet (cmi_id)
;
-- FK_ComunidadInternetProducto_ComunidadInternet
;
/****** Object:  foreignKey FK_ComunidadInternetRespuesta_ComunidadInternet    Script Date: 07/30/2012 17:06:31 ******/
alter table ComunidadInternetRespuesta  ADD  CONSTRAINT FK_ComunidadInternetRespuesta_ComunidadInternet forEIGN KEY(cmi_id)
REFERENCES ComunidadInternet (cmi_id)
;
-- FK_ComunidadInternetRespuesta_ComunidadInternet
;
/****** Object:  foreignKey FK_ComunidadInternetRespuesta_ComunidadInternetAplicacion    Script Date: 07/30/2012 17:06:31 ******/
alter table ComunidadInternetRespuesta  ADD  CONSTRAINT FK_ComunidadInternetRespuesta_ComunidadInternetAplicacion forEIGN KEY(cmia_id)
REFERENCES ComunidadInternetAplicacion (cmia_id)
;
-- FK_ComunidadInternetRespuesta_ComunidadInternetAplicacion
;
/****** Object:  foreignKey FK_ComunidadInternetRespuesta_ComunidadInternetMail    Script Date: 07/30/2012 17:06:31 ******/
alter table ComunidadInternetRespuesta  ADD  CONSTRAINT FK_ComunidadInternetRespuesta_ComunidadInternetMail forEIGN KEY(cmie_id)
REFERENCES ComunidadInternetMail (cmie_id)
;
-- FK_ComunidadInternetRespuesta_ComunidadInternetMail
;
/****** Object:  foreignKey FK_ComunidadInternetRespuestaPlantilla_ComunidadInternet    Script Date: 07/30/2012 17:06:35 ******/
alter table ComunidadInternetRespuestaPlantilla  ADD  CONSTRAINT FK_ComunidadInternetRespuestaPlantilla_ComunidadInternet forEIGN KEY(cmi_id)
REFERENCES ComunidadInternet (cmi_id)
;
-- FK_ComunidadInternetRespuestaPlantilla_ComunidadInternet
;
/****** Object:  foreignKey FK_ComunidadInternetRespuestaPlantilla_ComunidadInternetAplicacion    Script Date: 07/30/2012 17:06:35 ******/
alter table ComunidadInternetRespuestaPlantilla  ADD  CONSTRAINT FK_ComunidadInternetRespuestaPlantilla_ComunidadInternetAplicac forEIGN KEY(cmia_id)
REFERENCES ComunidadInternetAplicacion (cmia_id)
;
-- FK_ComunidadInternetRespuestaPlantilla_ComunidadInternetAplicacion
;
/****** Object:  foreignKey FK_ComunidadInternetRespuestaPlantilla_Idioma    Script Date: 07/30/2012 17:06:35 ******/
alter table ComunidadInternetRespuestaPlantilla  ADD  CONSTRAINT FK_ComunidadInternetRespuestaPlantilla_Idioma forEIGN KEY(idm_id)
REFERENCES Idioma (idm_id)
;
-- FK_ComunidadInternetRespuestaPlantilla_Idioma
;
/****** Object:  foreignKey FK_ComunidadInternetRespuestaPlantilla_Marca    Script Date: 07/30/2012 17:06:35 ******/
alter table ComunidadInternetRespuestaPlantilla  ADD  CONSTRAINT FK_ComunidadInternetRespuestaPlantilla_Marca forEIGN KEY(marc_id)
REFERENCES Marca (marc_id)
;
-- FK_ComunidadInternetRespuestaPlantilla_Marca
;
/****** Object:  foreignKey FK_ComunidadInternetRespuestaPlantilla_Producto    Script Date: 07/30/2012 17:06:35 ******/
alter table ComunidadInternetRespuestaPlantilla  ADD  CONSTRAINT FK_ComunidadInternetRespuestaPlantilla_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ComunidadInternetRespuestaPlantilla_Producto
;
/****** Object:  foreignKey FK_ComunidadInternetRespuestaPlantilla_Rubro    Script Date: 07/30/2012 17:06:35 ******/
alter table ComunidadInternetRespuestaPlantilla  ADD  CONSTRAINT FK_ComunidadInternetRespuestaPlantilla_Rubro forEIGN KEY(rub_id)
REFERENCES Rubro (rub_id)
;
-- FK_ComunidadInternetRespuestaPlantilla_Rubro
;
/****** Object:  foreignKey FK_ComunidadInternetRespuestaPlantilla_Usuario    Script Date: 07/30/2012 17:06:35 ******/
alter table ComunidadInternetRespuestaPlantilla  ADD  CONSTRAINT FK_ComunidadInternetRespuestaPlantilla_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ComunidadInternetRespuestaPlantilla_Usuario
;
/****** Object:  foreignKey FK_ComunidadInternetTexto_ComunidadInternet1    Script Date: 07/30/2012 17:06:38 ******/
alter table ComunidadInternetTexto  ADD  CONSTRAINT FK_ComunidadInternetTexto_ComunidadInternet1 forEIGN KEY(cmi_id)
REFERENCES ComunidadInternet (cmi_id)
;
-- FK_ComunidadInternetTexto_ComunidadInternet1
;
/****** Object:  foreignKey FK_ComunidadInternetTexto_ComunidadInternetAplicacion1    Script Date: 07/30/2012 17:06:38 ******/
alter table ComunidadInternetTexto  ADD  CONSTRAINT FK_ComunidadInternetTexto_ComunidadInternetAplicacion1 forEIGN KEY(cmia_id)
REFERENCES ComunidadInternetAplicacion (cmia_id)
;
-- FK_ComunidadInternetTexto_ComunidadInternetAplicacion1
;
/****** Object:  foreignKey FK_ComunidadInternetTexto_ComunidadInternetEmailAccount    Script Date: 07/30/2012 17:06:38 ******/
alter table ComunidadInternetTexto  ADD  CONSTRAINT FK_ComunidadInternetTexto_ComunidadInternetEmailAccount forEIGN KEY(cmiea_id)
REFERENCES ComunidadInternetEmailAccount (cmiea_id)
;
-- FK_ComunidadInternetTexto_ComunidadInternetEmailAccount
;
/****** Object:  foreignKey FK_ComunidadInternetTexto_Idioma    Script Date: 07/30/2012 17:06:38 ******/
alter table ComunidadInternetTexto  ADD  CONSTRAINT FK_ComunidadInternetTexto_Idioma forEIGN KEY(idm_id)
REFERENCES Idioma (idm_id)
;
-- FK_ComunidadInternetTexto_Idioma
;
/****** Object:  foreignKey FK_ComunidadInternetTexto_Padre    Script Date: 07/30/2012 17:06:41 ******/
alter table ComunidadInternetTextoItem  ADD  CONSTRAINT FK_ComunidadInternetTexto_Padre forEIGN KEY(cmiti_id)
REFERENCES ComunidadInternetTextoItem (cmiti_id)
;
-- FK_ComunidadInternetTexto_Padre
;
/****** Object:  foreignKey FK_ComunidadInternetTextoItem_ComunidadInternetTexto    Script Date: 07/30/2012 17:06:41 ******/
alter table ComunidadInternetTextoItem  ADD  CONSTRAINT FK_ComunidadInternetTextoItem_ComunidadInternetTexto forEIGN KEY(cmit_id)
REFERENCES ComunidadInternetTexto (cmit_id)
;
-- FK_ComunidadInternetTextoItem_ComunidadInternetTexto
;
/****** Object:  foreignKey FK_ComunidadInternetVenta_ComunidadInternet    Script Date: 07/30/2012 17:06:46 ******/
alter table ComunidadInternetVenta  ADD  CONSTRAINT FK_ComunidadInternetVenta_ComunidadInternet forEIGN KEY(cmi_id)
REFERENCES ComunidadInternet (cmi_id)
;
-- FK_ComunidadInternetVenta_ComunidadInternet
;
/****** Object:  foreignKey FK_ComunidadInternetVenta_ComunidadInternetMail    Script Date: 07/30/2012 17:06:46 ******/
alter table ComunidadInternetVenta  ADD  CONSTRAINT FK_ComunidadInternetVenta_ComunidadInternetMail forEIGN KEY(cmie_id)
REFERENCES ComunidadInternetMail (cmie_id)
;
-- FK_ComunidadInternetVenta_ComunidadInternetMail
;
/****** Object:  foreignKey FK_CondicionPago_CuentaGrupo    Script Date: 07/30/2012 17:06:49 ******/
alter table CondicionPago  ADD  CONSTRAINT FK_CondicionPago_CuentaGrupo forEIGN KEY(cueg_id)
REFERENCES CuentaGrupo (cueg_id)
;
-- FK_CondicionPago_CuentaGrupo
;
/****** Object:  foreignKey FK_CondicionPago_Documento    Script Date: 07/30/2012 17:06:49 ******/
alter table CondicionPago  ADD  CONSTRAINT FK_CondicionPago_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_CondicionPago_Documento
;
/****** Object:  foreignKey FK_CondicionPago_Usuario    Script Date: 07/30/2012 17:06:49 ******/
alter table CondicionPago  ADD  CONSTRAINT FK_CondicionPago_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_CondicionPago_Usuario
;
/****** Object:  foreignKey FK_CondicionPagoItem_CondicionPago    Script Date: 07/30/2012 17:06:50 ******/
alter table CondicionPagoItem  ADD  CONSTRAINT FK_CondicionPagoItem_CondicionPago forEIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_CondicionPagoItem_CondicionPago
;
/****** Object:  foreignKey FK_Configuracion_Empresa    Script Date: 07/30/2012 17:06:52 ******/
alter table Configuracion  ADD  CONSTRAINT FK_Configuracion_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_Configuracion_Empresa
;
/****** Object:  foreignKey FK_CalibradoraC_Usuario1    Script Date: 07/30/2012 17:06:54 ******/
alter table ConfiguracionCalibradora  ADD  CONSTRAINT FK_CalibradoraC_Usuario1 forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_CalibradoraC_Usuario1
;
/****** Object:  foreignKey FK_Contacto_Agenda    Script Date: 07/30/2012 17:07:02 ******/
alter table Contacto  ADD  CONSTRAINT FK_Contacto_Agenda forEIGN KEY(agn_id)
REFERENCES Agenda (agn_id)
;
-- FK_Contacto_Agenda
;
/****** Object:  foreignKey FK_Contacto_Ciudad    Script Date: 07/30/2012 17:07:02 ******/
alter table Contacto  ADD  CONSTRAINT FK_Contacto_Ciudad forEIGN KEY(ciu_id)
REFERENCES Ciudad (ciu_id)
;
-- FK_Contacto_Ciudad
;
/****** Object:  foreignKey FK_Contacto_Cliente    Script Date: 07/30/2012 17:07:02 ******/
alter table Contacto  ADD  CONSTRAINT FK_Contacto_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_Contacto_Cliente
;
/****** Object:  foreignKey FK_Contacto_Proveedor    Script Date: 07/30/2012 17:07:02 ******/
alter table Contacto  ADD  CONSTRAINT FK_Contacto_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_Contacto_Proveedor
;
/****** Object:  foreignKey FK_Contacto_Provincia    Script Date: 07/30/2012 17:07:02 ******/
alter table Contacto  ADD  CONSTRAINT FK_Contacto_Provincia forEIGN KEY(pro_id)
REFERENCES Provincia (pro_id)
;
-- FK_Contacto_Provincia
;
/****** Object:  foreignKey FK_Contacto_Usuario    Script Date: 07/30/2012 17:07:02 ******/
alter table Contacto  ADD  CONSTRAINT FK_Contacto_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Contacto_Usuario
;
/****** Object:  foreignKey FK_Contacto_Usuario1    Script Date: 07/30/2012 17:07:02 ******/
alter table Contacto  ADD  CONSTRAINT FK_Contacto_Usuario1 forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_Contacto_Usuario1
;
/****** Object:  foreignKey FK_ContraMarca_Usuario    Script Date: 07/30/2012 17:07:04 ******/
alter table ContraMarca  ADD  CONSTRAINT FK_ContraMarca_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ContraMarca_Usuario
;
/****** Object:  foreignKey FK_CotizacionCompra_CentroCosto    Script Date: 07/30/2012 17:07:10 ******/
alter table CotizacionCompra  ADD  CONSTRAINT FK_CotizacionCompra_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_CotizacionCompra_CentroCosto
;
/****** Object:  foreignKey FK_CotizacionCompra_CondicionPago    Script Date: 07/30/2012 17:07:10 ******/
alter table CotizacionCompra  ADD  CONSTRAINT FK_CotizacionCompra_CondicionPago forEIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_CotizacionCompra_CondicionPago
;
/****** Object:  foreignKey FK_CotizacionCompra_Documento    Script Date: 07/30/2012 17:07:10 ******/
alter table CotizacionCompra  ADD  CONSTRAINT FK_CotizacionCompra_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_CotizacionCompra_Documento
;
/****** Object:  foreignKey FK_CotizacionCompra_DocumentoTipo    Script Date: 07/30/2012 17:07:10 ******/
alter table CotizacionCompra  ADD  CONSTRAINT FK_CotizacionCompra_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_CotizacionCompra_DocumentoTipo
;
/****** Object:  foreignKey FK_CotizacionCompra_Legajo    Script Date: 07/30/2012 17:07:10 ******/
alter table CotizacionCompra  ADD  CONSTRAINT FK_CotizacionCompra_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_CotizacionCompra_Legajo
;
/****** Object:  foreignKey FK_CotizacionCompra_ListaPrecio    Script Date: 07/30/2012 17:07:11 ******/
alter table CotizacionCompra  ADD  CONSTRAINT FK_CotizacionCompra_ListaPrecio forEIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_CotizacionCompra_ListaPrecio
;
/****** Object:  foreignKey FK_CotizacionCompra_UsSolicito    Script Date: 07/30/2012 17:07:11 ******/
alter table CotizacionCompra  ADD  CONSTRAINT FK_CotizacionCompra_UsSolicito forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_CotizacionCompra_UsSolicito
;
/****** Object:  foreignKey FK_CotizacionCompra_Usuario    Script Date: 07/30/2012 17:07:11 ******/
alter table CotizacionCompra  ADD  CONSTRAINT FK_CotizacionCompra_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_CotizacionCompra_Usuario
;
/****** Object:  foreignKey FK_CotizacionCompraItem_CentroCosto    Script Date: 07/30/2012 17:07:15 ******/
alter table CotizacionCompraItem  ADD  CONSTRAINT FK_CotizacionCompraItem_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_CotizacionCompraItem_CentroCosto
;
/****** Object:  foreignKey FK_CotizacionCompraItem_CotizacionCompra    Script Date: 07/30/2012 17:07:15 ******/
alter table CotizacionCompraItem  ADD  CONSTRAINT FK_CotizacionCompraItem_CotizacionCompra forEIGN KEY(cot_id)
REFERENCES CotizacionCompra (cot_id)
;
-- FK_CotizacionCompraItem_CotizacionCompra
;
/****** Object:  foreignKey FK_CotizacionCompraItem_Producto    Script Date: 07/30/2012 17:07:15 ******/
alter table CotizacionCompraItem  ADD  CONSTRAINT FK_CotizacionCompraItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_CotizacionCompraItem_Producto
;
/****** Object:  foreignKey FK_CotizacionCompraItemBorradoTMP_CotizacionCompraTMP    Script Date: 07/30/2012 17:07:16 ******/
alter table CotizacionCompraItemBorradoTMP  ADD  CONSTRAINT FK_CotizacionCompraItemBorradoTMP_CotizacionCompraTMP forEIGN KEY(cotTMP_id)
REFERENCES CotizacionCompraTMP (cotTMP_id)
;
-- FK_CotizacionCompraItemBorradoTMP_CotizacionCompraTMP
;
/****** Object:  foreignKey FK_CotizacionCompraItemTMP_CotizacionCompraTMP    Script Date: 07/30/2012 17:07:21 ******/
alter table CotizacionCompraItemTMP  ADD  CONSTRAINT FK_CotizacionCompraItemTMP_CotizacionCompraTMP forEIGN KEY(cotTMP_id)
REFERENCES CotizacionCompraTMP (cotTMP_id)
;
-- FK_CotizacionCompraItemTMP_CotizacionCompraTMP
;
/****** Object:  foreignKey FK_CotizacionOrdenCompra_CotizacionCompraItem    Script Date: 07/30/2012 17:07:27 ******/
alter table CotizacionOrdenCompra  ADD  CONSTRAINT FK_CotizacionOrdenCompra_CotizacionCompraItem forEIGN KEY(coti_id)
REFERENCES CotizacionCompraItem (coti_id)
;
-- FK_CotizacionOrdenCompra_CotizacionCompraItem
;
/****** Object:  foreignKey FK_CotizacionOrdenCompra_OrdenCompraItem    Script Date: 07/30/2012 17:07:27 ******/
alter table CotizacionOrdenCompra  ADD  CONSTRAINT FK_CotizacionOrdenCompra_OrdenCompraItem forEIGN KEY(oci_id)
REFERENCES OrdenCompraItem (oci_id)
;
-- FK_CotizacionOrdenCompra_OrdenCompraItem
;
/****** Object:  foreignKey FK_CotizacionPresupuestoCompra_CotizacionCompraItem    Script Date: 07/30/2012 17:07:30 ******/
alter table CotizacionPresupuestoCompra  ADD  CONSTRAINT FK_CotizacionPresupuestoCompra_CotizacionCompraItem forEIGN KEY(coti_id)
REFERENCES CotizacionCompraItem (coti_id)
;
-- FK_CotizacionPresupuestoCompra_CotizacionCompraItem
;
/****** Object:  foreignKey FK_CotizacionPresupuestoCompra_PresupuestoCompraItem    Script Date: 07/30/2012 17:07:30 ******/
alter table CotizacionPresupuestoCompra  ADD  CONSTRAINT FK_CotizacionPresupuestoCompra_PresupuestoCompraItem forEIGN KEY(prci_id)
REFERENCES PresupuestoCompraItem (prci_id)
;
-- FK_CotizacionPresupuestoCompra_PresupuestoCompraItem
;
/****** Object:  foreignKey CuentaCategoria_Cuenta_LibroIva    Script Date: 07/30/2012 17:07:36 ******/
alter table Cuenta  ADD  CONSTRAINT CuentaCategoria_Cuenta_LibroIva forEIGN KEY(cuec_id_libroiva)
REFERENCES CuentaCategoria (cuec_id)
;
-- CuentaCategoria_Cuenta_LibroIva
;
/****** Object:  foreignKey FK_Cuenta_Banco    Script Date: 07/30/2012 17:07:36 ******/
alter table Cuenta  ADD  CONSTRAINT FK_Cuenta_Banco forEIGN KEY(bco_id)
REFERENCES Banco (bco_id)
;
-- FK_Cuenta_Banco
;
/****** Object:  foreignKey FK_Cuenta_CuentaCategoria    Script Date: 07/30/2012 17:07:36 ******/
alter table Cuenta  ADD  CONSTRAINT FK_Cuenta_CuentaCategoria forEIGN KEY(cuec_id)
REFERENCES CuentaCategoria (cuec_id)
;
-- FK_Cuenta_CuentaCategoria
;
/****** Object:  foreignKey FK_Cuenta_Empresa    Script Date: 07/30/2012 17:07:36 ******/
alter table Cuenta  ADD  CONSTRAINT FK_Cuenta_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_Cuenta_Empresa
;
/****** Object:  foreignKey FK_Cuenta_Moneda    Script Date: 07/30/2012 17:07:36 ******/
alter table Cuenta  ADD  CONSTRAINT FK_Cuenta_Moneda forEIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_Cuenta_Moneda
;
/****** Object:  foreignKey FK_Cuenta_Usuario    Script Date: 07/30/2012 17:07:36 ******/
alter table Cuenta  ADD  CONSTRAINT FK_Cuenta_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Cuenta_Usuario
;
/****** Object:  foreignKey FK_CuentaCategoria_Usuario    Script Date: 07/30/2012 17:07:38 ******/
alter table CuentaCategoria  ADD  CONSTRAINT FK_CuentaCategoria_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_CuentaCategoria_Usuario
;
/****** Object:  foreignKey FK_CuentaGrupo_Cuenta    Script Date: 07/30/2012 17:07:41 ******/
alter table CuentaGrupo  ADD  CONSTRAINT FK_CuentaGrupo_Cuenta forEIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_CuentaGrupo_Cuenta
;
/****** Object:  foreignKey FK_CuentaGrupo_Usuario    Script Date: 07/30/2012 17:07:41 ******/
alter table CuentaGrupo  ADD  CONSTRAINT FK_CuentaGrupo_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_CuentaGrupo_Usuario
;
/****** Object:  foreignKey FK_Curso_Materia    Script Date: 07/30/2012 17:07:44 ******/
alter table Curso  ADD  CONSTRAINT FK_Curso_Materia forEIGN KEY(mat_id)
REFERENCES Materia (mat_id)
;
-- FK_Curso_Materia
;
/****** Object:  foreignKey FK_Curso_Profesor    Script Date: 07/30/2012 17:07:44 ******/
alter table Curso  ADD  CONSTRAINT FK_Curso_Profesor forEIGN KEY(prof_id)
REFERENCES Profesor (prof_id)
;
-- FK_Curso_Profesor
;
/****** Object:  foreignKey FK_Curso_ProfesorAyudante1    Script Date: 07/30/2012 17:07:45 ******/
alter table Curso  ADD  CONSTRAINT FK_Curso_ProfesorAyudante1 forEIGN KEY(prof_id_ayudante1)
REFERENCES Profesor (prof_id)
;
-- FK_Curso_ProfesorAyudante1
;
/****** Object:  foreignKey FK_Curso_ProfesorAyudante2    Script Date: 07/30/2012 17:07:45 ******/
alter table Curso  ADD  CONSTRAINT FK_Curso_ProfesorAyudante2 forEIGN KEY(prof_id_ayudante2)
REFERENCES Profesor (prof_id)
;
-- FK_Curso_ProfesorAyudante2
;
/****** Object:  foreignKey FK_Curso_ProfesorAyudante3    Script Date: 07/30/2012 17:07:45 ******/
alter table Curso  ADD  CONSTRAINT FK_Curso_ProfesorAyudante3 forEIGN KEY(prof_id_ayudante3)
REFERENCES Profesor (prof_id)
;
-- FK_Curso_ProfesorAyudante3
;
/****** Object:  foreignKey FK_Curso_ProfesorAyudante4    Script Date: 07/30/2012 17:07:45 ******/
alter table Curso  ADD  CONSTRAINT FK_Curso_ProfesorAyudante4 forEIGN KEY(prof_id_ayudante4)
REFERENCES Profesor (prof_id)
;
-- FK_Curso_ProfesorAyudante4
;
/****** Object:  foreignKey FK_Curso_ProfesorAyudante5    Script Date: 07/30/2012 17:07:45 ******/
alter table Curso  ADD  CONSTRAINT FK_Curso_ProfesorAyudante5 forEIGN KEY(prof_id_ayudante5)
REFERENCES Profesor (prof_id)
;
-- FK_Curso_ProfesorAyudante5
;
/****** Object:  foreignKey FK_CursoClase_Aula    Script Date: 07/30/2012 17:07:47 ******/
alter table CursoClase  ADD  CONSTRAINT FK_CursoClase_Aula forEIGN KEY(aula_id)
REFERENCES Aula (aula_id)
;
-- FK_CursoClase_Aula
;
/****** Object:  foreignKey FK_CursoClase_Curso    Script Date: 07/30/2012 17:07:47 ******/
alter table CursoClase  ADD  CONSTRAINT FK_CursoClase_Curso forEIGN KEY(cur_id)
REFERENCES Curso (cur_id)
;
-- FK_CursoClase_Curso
;
/****** Object:  foreignKey FK_CursoExamen_Aula    Script Date: 07/30/2012 17:07:48 ******/
alter table CursoExamen  ADD  CONSTRAINT FK_CursoExamen_Aula forEIGN KEY(aula_id)
REFERENCES Aula (aula_id)
;
-- FK_CursoExamen_Aula
;
/****** Object:  foreignKey FK_CursoExamen_Curso    Script Date: 07/30/2012 17:07:49 ******/
alter table CursoExamen  ADD  CONSTRAINT FK_CursoExamen_Curso forEIGN KEY(cur_id)
REFERENCES Curso (cur_id)
;
-- FK_CursoExamen_Curso
;
/****** Object:  foreignKey FK_CursoItem_Alumno    Script Date: 07/30/2012 17:07:50 ******/
alter table CursoItem  ADD  CONSTRAINT FK_CursoItem_Alumno forEIGN KEY(alum_id)
REFERENCES Alumno (alum_id)
;
-- FK_CursoItem_Alumno
;
/****** Object:  foreignKey FK_CursoItem_Curso    Script Date: 07/30/2012 17:07:50 ******/
alter table CursoItem  ADD  CONSTRAINT FK_CursoItem_Curso forEIGN KEY(cur_id)
REFERENCES Curso (cur_id)
;
-- FK_CursoItem_Curso
;
/****** Object:  foreignKey FK_CursoItem_Estado    Script Date: 07/30/2012 17:07:50 ******/
alter table CursoItem  ADD  CONSTRAINT FK_CursoItem_Estado forEIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_CursoItem_Estado
;
/****** Object:  foreignKey FK_CursoItem_Profesor    Script Date: 07/30/2012 17:07:50 ******/
alter table CursoItem  ADD  CONSTRAINT FK_CursoItem_Profesor forEIGN KEY(prof_id)
REFERENCES Profesor (prof_id)
;
-- FK_CursoItem_Profesor
;
/****** Object:  foreignKey FK_CursoItemAsistencia_CursoClase    Script Date: 07/30/2012 17:07:51 ******/
alter table CursoItemAsistencia  ADD  CONSTRAINT FK_CursoItemAsistencia_CursoClase forEIGN KEY(curc_id)
REFERENCES CursoClase (curc_id)
;
-- FK_CursoItemAsistencia_CursoClase
;
/****** Object:  foreignKey FK_CursoItemAsistencia_CursoItem    Script Date: 07/30/2012 17:07:51 ******/
alter table CursoItemAsistencia  ADD  CONSTRAINT FK_CursoItemAsistencia_CursoItem forEIGN KEY(curi_id)
REFERENCES CursoItem (curi_id)
;
-- FK_CursoItemAsistencia_CursoItem
;
/****** Object:  foreignKey FK_CursoItemCalificacion_CursoExamen    Script Date: 07/30/2012 17:07:52 ******/
alter table CursoItemCalificacion  ADD  CONSTRAINT FK_CursoItemCalificacion_CursoExamen forEIGN KEY(cure_id)
REFERENCES CursoExamen (cure_id)
;
-- FK_CursoItemCalificacion_CursoExamen
;
/****** Object:  foreignKey FK_CursoItemCalificacion_CursoItem    Script Date: 07/30/2012 17:07:53 ******/
alter table CursoItemCalificacion  ADD  CONSTRAINT FK_CursoItemCalificacion_CursoItem forEIGN KEY(curi_id)
REFERENCES CursoItem (curi_id)
;
-- FK_CursoItemCalificacion_CursoItem
;
/****** Object:  foreignKey FK_Departamento_DepartamentoTipo    Script Date: 07/30/2012 17:07:56 ******/
alter table Departamento  ADD  CONSTRAINT FK_Departamento_DepartamentoTipo forEIGN KEY(dptot_id)
REFERENCES DepartamentoTipo (dptot_id)
;
-- FK_Departamento_DepartamentoTipo
;
/****** Object:  foreignKey FK_Departamento_Empresa    Script Date: 07/30/2012 17:07:56 ******/
alter table Departamento  ADD  CONSTRAINT FK_Departamento_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_Departamento_Empresa
;
/****** Object:  foreignKey FK_Departamento_PrestacionAddDoc    Script Date: 07/30/2012 17:07:57 ******/
alter table Departamento  ADD  CONSTRAINT FK_Departamento_PrestacionAddDoc forEIGN KEY(pre_id_agregardocumentos)
REFERENCES Prestacion (pre_id)
;
-- FK_Departamento_PrestacionAddDoc
;
/****** Object:  foreignKey FK_Departamento_Prestacionasignartareas    Script Date: 07/30/2012 17:07:57 ******/
alter table Departamento  ADD  CONSTRAINT FK_Departamento_Prestacionasignartareas forEIGN KEY(pre_id_asignartareas)
REFERENCES Prestacion (pre_id)
;
-- FK_Departamento_Prestacionasignartareas
;
/****** Object:  foreignKey FK_Departamento_PrestacionDelDoc    Script Date: 07/30/2012 17:07:57 ******/
alter table Departamento  ADD  CONSTRAINT FK_Departamento_PrestacionDelDoc forEIGN KEY(pre_id_borrardocumentos)
REFERENCES Prestacion (pre_id)
;
-- FK_Departamento_PrestacionDelDoc
;
/****** Object:  foreignKey FK_Departamento_Prestacioneditarnoticias    Script Date: 07/30/2012 17:07:57 ******/
alter table Departamento  ADD  CONSTRAINT FK_Departamento_Prestacioneditarnoticias forEIGN KEY(pre_id_editarnoticias)
REFERENCES Prestacion (pre_id)
;
-- FK_Departamento_Prestacioneditarnoticias
;
/****** Object:  foreignKey FK_Departamento_PrestacionEditDoc    Script Date: 07/30/2012 17:07:57 ******/
alter table Departamento  ADD  CONSTRAINT FK_Departamento_PrestacionEditDoc forEIGN KEY(pre_id_editardocumentos)
REFERENCES Prestacion (pre_id)
;
-- FK_Departamento_PrestacionEditDoc
;
/****** Object:  foreignKey FK_Departamento_PrestacionVerDoc    Script Date: 07/30/2012 17:07:57 ******/
alter table Departamento  ADD  CONSTRAINT FK_Departamento_PrestacionVerDoc forEIGN KEY(pre_id_verdocumentos)
REFERENCES Prestacion (pre_id)
;
-- FK_Departamento_PrestacionVerDoc
;
/****** Object:  foreignKey FK_Departamento_Prestacionvernoticias    Script Date: 07/30/2012 17:07:57 ******/
alter table Departamento  ADD  CONSTRAINT FK_Departamento_Prestacionvernoticias forEIGN KEY(pre_id_vernoticias)
REFERENCES Prestacion (pre_id)
;
-- FK_Departamento_Prestacionvernoticias
;
/****** Object:  foreignKey FK_Departamento_Prestacionvertareas    Script Date: 07/30/2012 17:07:57 ******/
alter table Departamento  ADD  CONSTRAINT FK_Departamento_Prestacionvertareas forEIGN KEY(pre_id_vertareas)
REFERENCES Prestacion (pre_id)
;
-- FK_Departamento_Prestacionvertareas
;
/****** Object:  foreignKey FK_Departamento_Usuario    Script Date: 07/30/2012 17:07:57 ******/
alter table Departamento  ADD  CONSTRAINT FK_Departamento_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Departamento_Usuario
;
/****** Object:  foreignKey FK_DepartamentoCliente_Cliente    Script Date: 07/30/2012 17:07:58 ******/
alter table DepartamentoCliente  ADD  CONSTRAINT FK_DepartamentoCliente_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_DepartamentoCliente_Cliente
;
/****** Object:  foreignKey FK_DepartamentoCliente_Departamento    Script Date: 07/30/2012 17:07:58 ******/
alter table DepartamentoCliente  ADD  CONSTRAINT FK_DepartamentoCliente_Departamento forEIGN KEY(dpto_id)
REFERENCES Departamento (dpto_id)
;
-- FK_DepartamentoCliente_Departamento
;
/****** Object:  foreignKey FK_DepartamentoProveedor_Departamento    Script Date: 07/30/2012 17:07:59 ******/
alter table DepartamentoProveedor  ADD  CONSTRAINT FK_DepartamentoProveedor_Departamento forEIGN KEY(dpto_id)
REFERENCES Departamento (dpto_id)
;
-- FK_DepartamentoProveedor_Departamento
;
/****** Object:  foreignKey FK_DepartamentoProveedor_Proveedor    Script Date: 07/30/2012 17:07:59 ******/
alter table DepartamentoProveedor  ADD  CONSTRAINT FK_DepartamentoProveedor_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_DepartamentoProveedor_Proveedor
;
/****** Object:  foreignKey FK_DepositoBanco_Asiento    Script Date: 07/30/2012 17:08:05 ******/
alter table DepositoBanco  ADD  CONSTRAINT FK_DepositoBanco_Asiento forEIGN KEY(as_id)
REFERENCES Asiento (as_id)
;
-- FK_DepositoBanco_Asiento
;
/****** Object:  foreignKey FK_DepositoBanco_Banco    Script Date: 07/30/2012 17:08:05 ******/
alter table DepositoBanco  ADD  CONSTRAINT FK_DepositoBanco_Banco forEIGN KEY(bco_id)
REFERENCES Banco (bco_id)
;
-- FK_DepositoBanco_Banco
;
/****** Object:  foreignKey FK_DepositoBanco_Documento    Script Date: 07/30/2012 17:08:05 ******/
alter table DepositoBanco  ADD  CONSTRAINT FK_DepositoBanco_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_DepositoBanco_Documento
;
/****** Object:  foreignKey FK_DepositoBanco_DocumentoTipo    Script Date: 07/30/2012 17:08:06 ******/
alter table DepositoBanco  ADD  CONSTRAINT FK_DepositoBanco_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_DepositoBanco_DocumentoTipo
;
/****** Object:  foreignKey FK_DepositoBanco_Estado    Script Date: 07/30/2012 17:08:06 ******/
alter table DepositoBanco  ADD  CONSTRAINT FK_DepositoBanco_Estado forEIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_DepositoBanco_Estado
;
/****** Object:  foreignKey FK_DepositoBanco_Legajo    Script Date: 07/30/2012 17:08:06 ******/
alter table DepositoBanco  ADD  CONSTRAINT FK_DepositoBanco_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_DepositoBanco_Legajo
;
/****** Object:  foreignKey FK_DepositoBanco_Sucursal    Script Date: 07/30/2012 17:08:06 ******/
alter table DepositoBanco  ADD  CONSTRAINT FK_DepositoBanco_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_DepositoBanco_Sucursal
;
/****** Object:  foreignKey FK_DepositoBancoItem_Cheque    Script Date: 07/30/2012 17:08:09 ******/
alter table DepositoBancoItem  ADD  CONSTRAINT FK_DepositoBancoItem_Cheque forEIGN KEY(cheq_id)
REFERENCES Cheque (cheq_id)
;
-- FK_DepositoBancoItem_Cheque
;
/****** Object:  foreignKey FK_DepositoBancoItem_Chequera    Script Date: 07/30/2012 17:08:09 ******/
alter table DepositoBancoItem  ADD  CONSTRAINT FK_DepositoBancoItem_Chequera forEIGN KEY(chq_id)
REFERENCES Chequera (chq_id)
;
-- FK_DepositoBancoItem_Chequera
;
/****** Object:  foreignKey FK_DepositoBancoItem_Cuenta    Script Date: 07/30/2012 17:08:09 ******/
alter table DepositoBancoItem  ADD  CONSTRAINT FK_DepositoBancoItem_Cuenta forEIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_DepositoBancoItem_Cuenta
;
/****** Object:  foreignKey FK_DepositoBancoItem_DepositoBanco    Script Date: 07/30/2012 17:08:09 ******/
alter table DepositoBancoItem  ADD  CONSTRAINT FK_DepositoBancoItem_DepositoBanco forEIGN KEY(dbco_id)
REFERENCES DepositoBanco (dbco_id)
;
-- FK_DepositoBancoItem_DepositoBanco
;
/****** Object:  foreignKey FK_DepositoBancoItemBorradoTMP_DepositoBancoTMP    Script Date: 07/30/2012 17:08:10 ******/
alter table DepositoBancoItemBorradoTMP  ADD  CONSTRAINT FK_DepositoBancoItemBorradoTMP_DepositoBancoTMP forEIGN KEY(dbcoTMP_id)
REFERENCES DepositoBancoTMP (dbcoTMP_id)
;
-- FK_DepositoBancoItemBorradoTMP_DepositoBancoTMP
;
/****** Object:  foreignKey FK_DepositoBancoItemTMP_DepositoBancoTMP    Script Date: 07/30/2012 17:08:13 ******/
alter table DepositoBancoItemTMP  ADD  CONSTRAINT FK_DepositoBancoItemTMP_DepositoBancoTMP forEIGN KEY(dbcoTMP_id)
REFERENCES DepositoBancoTMP (dbcoTMP_id)
;
-- FK_DepositoBancoItemTMP_DepositoBancoTMP
;
/****** Object:  foreignKey FK_DepositoCupon_Asiento    Script Date: 07/30/2012 17:08:22 ******/
alter table DepositoCupon  ADD  CONSTRAINT FK_DepositoCupon_Asiento forEIGN KEY(as_id)
REFERENCES Asiento (as_id)
;
-- FK_DepositoCupon_Asiento
;
/****** Object:  foreignKey FK_DepositoCupon_Documento    Script Date: 07/30/2012 17:08:22 ******/
alter table DepositoCupon  ADD  CONSTRAINT FK_DepositoCupon_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_DepositoCupon_Documento
;
/****** Object:  foreignKey FK_DepositoCupon_DocumentoTipo    Script Date: 07/30/2012 17:08:22 ******/
alter table DepositoCupon  ADD  CONSTRAINT FK_DepositoCupon_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_DepositoCupon_DocumentoTipo
;
/****** Object:  foreignKey FK_DepositoCupon_Estado    Script Date: 07/30/2012 17:08:22 ******/
alter table DepositoCupon  ADD  CONSTRAINT FK_DepositoCupon_Estado forEIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_DepositoCupon_Estado
;
/****** Object:  foreignKey FK_DepositoCupon_Legajo    Script Date: 07/30/2012 17:08:22 ******/
alter table DepositoCupon  ADD  CONSTRAINT FK_DepositoCupon_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_DepositoCupon_Legajo
;
/****** Object:  foreignKey FK_DepositoCupon_Sucursal    Script Date: 07/30/2012 17:08:22 ******/
alter table DepositoCupon  ADD  CONSTRAINT FK_DepositoCupon_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_DepositoCupon_Sucursal
;
/****** Object:  foreignKey FK_DepositoCuponItem_Cuenta    Script Date: 07/30/2012 17:08:25 ******/
alter table DepositoCuponItem  ADD  CONSTRAINT FK_DepositoCuponItem_Cuenta forEIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_DepositoCuponItem_Cuenta
;
/****** Object:  foreignKey FK_DepositoCuponItem_DepositoCupon    Script Date: 07/30/2012 17:08:25 ******/
alter table DepositoCuponItem  ADD  CONSTRAINT FK_DepositoCuponItem_DepositoCupon forEIGN KEY(dcup_id)
REFERENCES DepositoCupon (dcup_id)
;
-- FK_DepositoCuponItem_DepositoCupon
;
/****** Object:  foreignKey FK_DepositoCuponItem_TarjetaCreditoCupon    Script Date: 07/30/2012 17:08:25 ******/
alter table DepositoCuponItem  ADD  CONSTRAINT FK_DepositoCuponItem_TarjetaCreditoCupon forEIGN KEY(tjcc_id)
REFERENCES TarjetaCreditoCupon (tjcc_id)
;
-- FK_DepositoCuponItem_TarjetaCreditoCupon
;
/****** Object:  foreignKey FK_DepositoCuponItemBorradoTMP_DepositoCuponTMP    Script Date: 07/30/2012 17:08:26 ******/
alter table DepositoCuponItemBorradoTMP  ADD  CONSTRAINT FK_DepositoCuponItemBorradoTMP_DepositoCuponTMP forEIGN KEY(dcupTMP_id)
REFERENCES DepositoCuponTMP (dcupTMP_id)
;
-- FK_DepositoCuponItemBorradoTMP_DepositoCuponTMP
;
/****** Object:  foreignKey FK_DepositoCuponItemTMP_DepositoCuponTMP    Script Date: 07/30/2012 17:08:28 ******/
alter table DepositoCuponItemTMP  ADD  CONSTRAINT FK_DepositoCuponItemTMP_DepositoCuponTMP forEIGN KEY(dcupTMP_id)
REFERENCES DepositoCuponTMP (dcupTMP_id)
;
-- FK_DepositoCuponItemTMP_DepositoCuponTMP
;
/****** Object:  foreignKey FK_DepositoFisico_Usuario    Script Date: 07/30/2012 17:08:34 ******/
alter table DepositoFisico  ADD  CONSTRAINT FK_DepositoFisico_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_DepositoFisico_Usuario
;
/****** Object:  foreignKey FK_DepositoLogico_Cliente    Script Date: 07/30/2012 17:08:37 ******/
alter table DepositoLogico  ADD  CONSTRAINT FK_DepositoLogico_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_DepositoLogico_Cliente
;
/****** Object:  foreignKey FK_DepositoLogico_DepositoFisico    Script Date: 07/30/2012 17:08:37 ******/
alter table DepositoLogico  ADD  CONSTRAINT FK_DepositoLogico_DepositoFisico forEIGN KEY(depf_id)
REFERENCES DepositoFisico (depf_id)
;
-- FK_DepositoLogico_DepositoFisico
;
/****** Object:  foreignKey FK_DepositoLogico_Empresa    Script Date: 07/30/2012 17:08:37 ******/
alter table DepositoLogico  ADD  CONSTRAINT FK_DepositoLogico_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_DepositoLogico_Empresa
;
/****** Object:  foreignKey FK_DepositoLogico_Proveedor    Script Date: 07/30/2012 17:08:37 ******/
alter table DepositoLogico  ADD  CONSTRAINT FK_DepositoLogico_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_DepositoLogico_Proveedor
;
/****** Object:  foreignKey FK_DepositoLogico_Usuario    Script Date: 07/30/2012 17:08:37 ******/
alter table DepositoLogico  ADD  CONSTRAINT FK_DepositoLogico_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_DepositoLogico_Usuario
;
/****** Object:  foreignKey FK_DespachoImpCalculo_Moneda1    Script Date: 07/30/2012 17:08:42 ******/
alter table DespachoImpCalculo  ADD  CONSTRAINT FK_DespachoImpCalculo_Moneda1 forEIGN KEY(mon_id1)
REFERENCES Moneda (mon_id)
;
-- FK_DespachoImpCalculo_Moneda1
;
/****** Object:  foreignKey FK_DespachoImpCalculo_Moneda2    Script Date: 07/30/2012 17:08:42 ******/
alter table DespachoImpCalculo  ADD  CONSTRAINT FK_DespachoImpCalculo_Moneda2 forEIGN KEY(mon_id2)
REFERENCES Moneda (mon_id)
;
-- FK_DespachoImpCalculo_Moneda2
;
/****** Object:  foreignKey FK_DespachoImpCalculo_Usuario    Script Date: 07/30/2012 17:08:42 ******/
alter table DespachoImpCalculo  ADD  CONSTRAINT FK_DespachoImpCalculo_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_DespachoImpCalculo_Usuario
;
/****** Object:  foreignKey FK_DespachoImpCalculoItem_DespachoImpCalculo    Script Date: 07/30/2012 17:08:44 ******/
alter table DespachoImpCalculoItem  ADD  CONSTRAINT FK_DespachoImpCalculoItem_DespachoImpCalculo forEIGN KEY(dic_id)
REFERENCES DespachoImpCalculo (dic_id)
;
-- FK_DespachoImpCalculoItem_DespachoImpCalculo
;
/****** Object:  foreignKey FK_DespachoImpPosicionArancel_DespachoImpCalculo    Script Date: 07/30/2012 17:08:46 ******/
alter table DespachoImpCalculoPosicionArancel  ADD  CONSTRAINT FK_DespachoImpPosicionArancel_DespachoImpCalculo forEIGN KEY(dic_id)
REFERENCES DespachoImpCalculo (dic_id)
;
-- FK_DespachoImpPosicionArancel_DespachoImpCalculo
;
/****** Object:  foreignKey FK_Documento_CircuitoContable    Script Date: 07/30/2012 17:08:59 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_CircuitoContable forEIGN KEY(cico_id)
REFERENCES CircuitoContable (cico_id)
;
-- FK_Documento_CircuitoContable
;
/****** Object:  foreignKey FK_Documento_CuentaGrupo    Script Date: 07/30/2012 17:08:59 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_CuentaGrupo forEIGN KEY(cueg_id)
REFERENCES CuentaGrupo (cueg_id)
;
-- FK_Documento_CuentaGrupo
;
/****** Object:  foreignKey FK_Documento_DocumentoAsiento    Script Date: 07/30/2012 17:08:59 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_DocumentoAsiento forEIGN KEY(doc_id_asiento)
REFERENCES Documento (doc_id)
;
-- FK_Documento_DocumentoAsiento
;
/****** Object:  foreignKey FK_Documento_DocumentoRemito    Script Date: 07/30/2012 17:08:59 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_DocumentoRemito forEIGN KEY(doc_id_remito)
REFERENCES Documento (doc_id)
;
-- FK_Documento_DocumentoRemito
;
/****** Object:  foreignKey FK_Documento_DocumentoStock    Script Date: 07/30/2012 17:08:59 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_DocumentoStock forEIGN KEY(doc_id_stock)
REFERENCES Documento (doc_id)
;
-- FK_Documento_DocumentoStock
;
/****** Object:  foreignKey FK_Documento_DocumentoTipo    Script Date: 07/30/2012 17:08:59 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_Documento_DocumentoTipo
;
/****** Object:  foreignKey FK_Documento_Empresa    Script Date: 07/30/2012 17:08:59 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_Documento_Empresa
;
/****** Object:  foreignKey FK_Documento_FechaControlAcceso    Script Date: 07/30/2012 17:08:59 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_FechaControlAcceso forEIGN KEY(fca_id)
REFERENCES FechaControlAcceso (fca_id)
;
-- FK_Documento_FechaControlAcceso
;
/****** Object:  foreignKey FK_Documento_Moneda    Script Date: 07/30/2012 17:08:59 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_Moneda forEIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_Documento_Moneda
;
/****** Object:  foreignKey FK_Documento_Prestacion    Script Date: 07/30/2012 17:09:00 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_Prestacion forEIGN KEY(pre_id_print)
REFERENCES Prestacion (pre_id)
;
-- FK_Documento_Prestacion
;
/****** Object:  foreignKey FK_Documento_PrestacionAnular    Script Date: 07/30/2012 17:09:00 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_PrestacionAnular forEIGN KEY(pre_id_anular)
REFERENCES Prestacion (pre_id)
;
-- FK_Documento_PrestacionAnular
;
/****** Object:  foreignKey FK_Documento_PrestacionAplicar    Script Date: 07/30/2012 17:09:00 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_PrestacionAplicar forEIGN KEY(pre_id_aplicar)
REFERENCES Prestacion (pre_id)
;
-- FK_Documento_PrestacionAplicar
;
/****** Object:  foreignKey FK_Documento_PrestacionDelete    Script Date: 07/30/2012 17:09:00 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_PrestacionDelete forEIGN KEY(pre_id_delete)
REFERENCES Prestacion (pre_id)
;
-- FK_Documento_PrestacionDelete
;
/****** Object:  foreignKey FK_Documento_PrestacionDesAnular    Script Date: 07/30/2012 17:09:00 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_PrestacionDesAnular forEIGN KEY(pre_id_desanular)
REFERENCES Prestacion (pre_id)
;
-- FK_Documento_PrestacionDesAnular
;
/****** Object:  foreignKey FK_Documento_PrestacionEdit    Script Date: 07/30/2012 17:09:00 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_PrestacionEdit forEIGN KEY(pre_id_edit)
REFERENCES Prestacion (pre_id)
;
-- FK_Documento_PrestacionEdit
;
/****** Object:  foreignKey FK_Documento_PrestacionList    Script Date: 07/30/2012 17:09:00 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_PrestacionList forEIGN KEY(pre_id_list)
REFERENCES Prestacion (pre_id)
;
-- FK_Documento_PrestacionList
;
/****** Object:  foreignKey FK_Documento_PrestacionNew    Script Date: 07/30/2012 17:09:00 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_PrestacionNew forEIGN KEY(pre_id_new)
REFERENCES Prestacion (pre_id)
;
-- FK_Documento_PrestacionNew
;
/****** Object:  foreignKey FK_Documento_Talonario    Script Date: 07/30/2012 17:09:00 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_Talonario forEIGN KEY(ta_id)
REFERENCES Talonario (ta_id)
;
-- FK_Documento_Talonario
;
/****** Object:  foreignKey FK_Documento_Talonario1    Script Date: 07/30/2012 17:09:00 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_Talonario1 forEIGN KEY(ta_id_inscriptom)
REFERENCES Talonario (ta_id)
;
-- FK_Documento_Talonario1
;
/****** Object:  foreignKey FK_Documento_TalonarioExterno    Script Date: 07/30/2012 17:09:01 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_TalonarioExterno forEIGN KEY(ta_id_externo)
REFERENCES Talonario (ta_id)
;
-- FK_Documento_TalonarioExterno
;
/****** Object:  foreignKey FK_Documento_TalonarioFinal    Script Date: 07/30/2012 17:09:01 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_TalonarioFinal forEIGN KEY(ta_id_final)
REFERENCES Talonario (ta_id)
;
-- FK_Documento_TalonarioFinal
;
/****** Object:  foreignKey FK_Documento_TalonarioHaberes    Script Date: 07/30/2012 17:09:01 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_TalonarioHaberes forEIGN KEY(ta_id_haberes)
REFERENCES Talonario (ta_id)
;
-- FK_Documento_TalonarioHaberes
;
/****** Object:  foreignKey FK_Documento_TalonarioInscripto    Script Date: 07/30/2012 17:09:01 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_TalonarioInscripto forEIGN KEY(ta_id_inscripto)
REFERENCES Talonario (ta_id)
;
-- FK_Documento_TalonarioInscripto
;
/****** Object:  foreignKey FK_Documento_Usuario    Script Date: 07/30/2012 17:09:01 ******/
alter table Documento  ADD  CONSTRAINT FK_Documento_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Documento_Usuario
;
/****** Object:  foreignKey FK_DocumentoDigital_Usuario    Script Date: 07/30/2012 17:09:04 ******/
alter table DocumentoDigital  ADD  CONSTRAINT FK_DocumentoDigital_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_DocumentoDigital_Usuario
;
/****** Object:  foreignKey FK_DocumentoFirma_Documento    Script Date: 07/30/2012 17:09:06 ******/
alter table DocumentoFirma  ADD  CONSTRAINT FK_DocumentoFirma_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_DocumentoFirma_Documento
;
/****** Object:  foreignKey FK_DocumentoFirma_Usuario    Script Date: 07/30/2012 17:09:06 ******/
alter table DocumentoFirma  ADD  CONSTRAINT FK_DocumentoFirma_Usuario forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_DocumentoFirma_Usuario
;
/****** Object:  foreignKey FK_DocumentoImpresora_Documento    Script Date: 07/30/2012 17:09:10 ******/
alter table DocumentoImpresora  ADD  CONSTRAINT FK_DocumentoImpresora_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_DocumentoImpresora_Documento
;
/****** Object:  foreignKey FK_DocumentoImpresora_Talonario    Script Date: 07/30/2012 17:09:10 ******/
alter table DocumentoImpresora  ADD  CONSTRAINT FK_DocumentoImpresora_Talonario forEIGN KEY(ta_id)
REFERENCES Talonario (ta_id)
;
-- FK_DocumentoImpresora_Talonario
;
/****** Object:  foreignKey FK_DocumentoTipo_Usuario    Script Date: 07/30/2012 17:09:12 ******/
alter table DocumentoTipo  ADD  CONSTRAINT FK_DocumentoTipo_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_DocumentoTipo_Usuario
;
/****** Object:  foreignKey FK_EjercicioContable_Asiento    Script Date: 07/30/2012 17:09:17 ******/
alter table EjercicioContable  ADD  CONSTRAINT FK_EjercicioContable_Asiento forEIGN KEY(as_id_apertura)
REFERENCES Asiento (as_id)
;
-- FK_EjercicioContable_Asiento
;
/****** Object:  foreignKey FK_EjercicioContable_Asiento1    Script Date: 07/30/2012 17:09:17 ******/
alter table EjercicioContable  ADD  CONSTRAINT FK_EjercicioContable_Asiento1 forEIGN KEY(as_id_cierrepatrimonial)
REFERENCES Asiento (as_id)
;
-- FK_EjercicioContable_Asiento1
;
/****** Object:  foreignKey FK_EjercicioContable_Asiento2    Script Date: 07/30/2012 17:09:17 ******/
alter table EjercicioContable  ADD  CONSTRAINT FK_EjercicioContable_Asiento2 forEIGN KEY(as_id_cierreresultados)
REFERENCES Asiento (as_id)
;
-- FK_EjercicioContable_Asiento2
;
/****** Object:  foreignKey FK_EjercicioContable_Cuenta    Script Date: 07/30/2012 17:09:17 ******/
alter table EjercicioContable  ADD  CONSTRAINT FK_EjercicioContable_Cuenta forEIGN KEY(cue_id_resultado)
REFERENCES Cuenta (cue_id)
;
-- FK_EjercicioContable_Cuenta
;
/****** Object:  foreignKey FK_EjercicioContableCircuitoContable_CircuitoContable    Script Date: 07/30/2012 17:09:18 ******/
alter table EjercicioContableCircuitoContable  ADD  CONSTRAINT FK_EjercicioContableCircuitoContable_CircuitoContable forEIGN KEY(cico_id)
REFERENCES CircuitoContable (cico_id)
;
-- FK_EjercicioContableCircuitoContable_CircuitoContable
;
/****** Object:  foreignKey FK_EjercicioContableCircuitoContable_EjercicioContable    Script Date: 07/30/2012 17:09:18 ******/
alter table EjercicioContableCircuitoContable  ADD  CONSTRAINT FK_EjercicioContableCircuitoContable_EjercicioContable forEIGN KEY(ejc_id)
REFERENCES EjercicioContable (ejc_id)
;
-- FK_EjercicioContableCircuitoContable_EjercicioContable
;
/****** Object:  foreignKey FK_EjercicioContableEmpresa_EjercicioContable    Script Date: 07/30/2012 17:09:18 ******/
alter table EjercicioContableEmpresa  ADD  CONSTRAINT FK_EjercicioContableEmpresa_EjercicioContable forEIGN KEY(ejc_id)
REFERENCES EjercicioContable (ejc_id)
;
-- FK_EjercicioContableEmpresa_EjercicioContable
;
/****** Object:  foreignKey FK_EjercicioContableEmpresa_Empresa    Script Date: 07/30/2012 17:09:19 ******/
alter table EjercicioContableEmpresa  ADD  CONSTRAINT FK_EjercicioContableEmpresa_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_EjercicioContableEmpresa_Empresa
;
/****** Object:  foreignKey FK_Embalaje_Producto    Script Date: 07/30/2012 17:09:22 ******/
alter table Embalaje  ADD  CONSTRAINT FK_Embalaje_Producto forEIGN KEY(pr_id_stock)
REFERENCES Producto (pr_id)
;
-- FK_Embalaje_Producto
;
/****** Object:  foreignKey FK_Embalaje_Unidad    Script Date: 07/30/2012 17:09:22 ******/
alter table Embalaje  ADD  CONSTRAINT FK_Embalaje_Unidad forEIGN KEY(un_id)
REFERENCES Unidad (un_id)
;
-- FK_Embalaje_Unidad
;
/****** Object:  foreignKey FK_Embarque_Barco    Script Date: 07/30/2012 17:09:25 ******/
alter table Embarque  ADD  CONSTRAINT FK_Embarque_Barco forEIGN KEY(barc_id)
REFERENCES Barco (barc_id)
;
-- FK_Embarque_Barco
;
/****** Object:  foreignKey FK_Embarque_PuertoDestino    Script Date: 07/30/2012 17:09:25 ******/
alter table Embarque  ADD  CONSTRAINT FK_Embarque_PuertoDestino forEIGN KEY(pue_id_destino)
REFERENCES Puerto (pue_id)
;
-- FK_Embarque_PuertoDestino
;
/****** Object:  foreignKey FK_Embarque_PuertoOrigen    Script Date: 07/30/2012 17:09:25 ******/
alter table Embarque  ADD  CONSTRAINT FK_Embarque_PuertoOrigen forEIGN KEY(pue_id_origen)
REFERENCES Puerto (pue_id)
;
-- FK_Embarque_PuertoOrigen
;
/****** Object:  foreignKey FK_Embarque_Usuario    Script Date: 07/30/2012 17:09:25 ******/
alter table Embarque  ADD  CONSTRAINT FK_Embarque_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Embarque_Usuario
;
/****** Object:  foreignKey FK_Empleado_Empleado    Script Date: 07/30/2012 17:09:34 ******/
alter table Empleado  ADD  CONSTRAINT FK_Empleado_Empleado forEIGN KEY(em_id)
REFERENCES Empleado (em_id)
;
-- FK_Empleado_Empleado
;
/****** Object:  foreignKey FK_Empleado_EmpleadoAseguradora    Script Date: 07/30/2012 17:09:34 ******/
alter table Empleado  ADD  CONSTRAINT FK_Empleado_EmpleadoAseguradora forEIGN KEY(ema_id)
REFERENCES EmpleadoART (ema_id)
;
-- FK_Empleado_EmpleadoAseguradora
;
/****** Object:  foreignKey FK_Empleado_EmpleadoEspecialidad    Script Date: 07/30/2012 17:09:34 ******/
alter table Empleado  ADD  CONSTRAINT FK_Empleado_EmpleadoEspecialidad forEIGN KEY(eme_id)
REFERENCES EmpleadoEspecialidad (eme_id)
;
-- FK_Empleado_EmpleadoEspecialidad
;
/****** Object:  foreignKey FK_Empleado_EstadoCivil    Script Date: 07/30/2012 17:09:34 ******/
alter table Empleado  ADD  CONSTRAINT FK_Empleado_EstadoCivil forEIGN KEY(estc_id)
REFERENCES EstadoCivil (estc_id)
;
-- FK_Empleado_EstadoCivil
;
/****** Object:  foreignKey FK_Empleado_Pais    Script Date: 07/30/2012 17:09:35 ******/
alter table Empleado  ADD  CONSTRAINT FK_Empleado_Pais forEIGN KEY(pa_id)
REFERENCES Pais (pa_id)
;
-- FK_Empleado_Pais
;
/****** Object:  foreignKey FK_Empleado_Provincia    Script Date: 07/30/2012 17:09:35 ******/
alter table Empleado  ADD  CONSTRAINT FK_Empleado_Provincia forEIGN KEY(pro_id)
REFERENCES Provincia (pro_id)
;
-- FK_Empleado_Provincia
;
/****** Object:  foreignKey FK_Empleado_Sindicato    Script Date: 07/30/2012 17:09:35 ******/
alter table Empleado  ADD  CONSTRAINT FK_Empleado_Sindicato forEIGN KEY(sind_id)
REFERENCES Sindicato (sind_id)
;
-- FK_Empleado_Sindicato
;
/****** Object:  foreignKey FK_Empleado_SindicatoCategoria    Script Date: 07/30/2012 17:09:35 ******/
alter table Empleado  ADD  CONSTRAINT FK_Empleado_SindicatoCategoria forEIGN KEY(sindca_id)
REFERENCES SindicatoCategoria (sindca_id)
;
-- FK_Empleado_SindicatoCategoria
;
/****** Object:  foreignKey FK_Empleado_SindicatoConvenio    Script Date: 07/30/2012 17:09:35 ******/
alter table Empleado  ADD  CONSTRAINT FK_Empleado_SindicatoConvenio forEIGN KEY(sindco_id)
REFERENCES SindicatoConvenio (sindco_id)
;
-- FK_Empleado_SindicatoConvenio
;
/****** Object:  foreignKey FK_EmpleadoAsistencia_Usuario    Script Date: 07/30/2012 17:09:39 ******/
alter table EmpleadoAsistenciaTipo  ADD  CONSTRAINT FK_EmpleadoAsistencia_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_EmpleadoAsistencia_Usuario
;
/****** Object:  foreignKey FK_CentroCostoEmpleado_CentroCosto    Script Date: 07/30/2012 17:09:40 ******/
alter table EmpleadoCentroCosto  ADD  CONSTRAINT FK_CentroCostoEmpleado_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_CentroCostoEmpleado_CentroCosto
;
/****** Object:  foreignKey FK_CentroCostoEmpleado_Empleado    Script Date: 07/30/2012 17:09:40 ******/
alter table EmpleadoCentroCosto  ADD  CONSTRAINT FK_CentroCostoEmpleado_Empleado forEIGN KEY(em_id)
REFERENCES Empleado (em_id)
;
-- FK_CentroCostoEmpleado_Empleado
;
/****** Object:  foreignKey FK_EmpleadoFamilia_Empleado    Script Date: 07/30/2012 17:09:44 ******/
alter table EmpleadoFamilia  ADD  CONSTRAINT FK_EmpleadoFamilia_Empleado forEIGN KEY(em_id)
REFERENCES Empleado (em_id)
;
-- FK_EmpleadoFamilia_Empleado
;
/****** Object:  foreignKey FK_EmpleadoFamilia_EmpleadoFamiliaTipo    Script Date: 07/30/2012 17:09:44 ******/
alter table EmpleadoFamilia  ADD  CONSTRAINT FK_EmpleadoFamilia_EmpleadoFamiliaTipo forEIGN KEY(emft_id)
REFERENCES EmpleadoFamiliaTipo (emft_id)
;
-- FK_EmpleadoFamilia_EmpleadoFamiliaTipo
;
/****** Object:  foreignKey FK_EmpleadoHoras_CentroCosto    Script Date: 07/30/2012 17:09:47 ******/
alter table EmpleadoHoras  ADD  CONSTRAINT FK_EmpleadoHoras_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_EmpleadoHoras_CentroCosto
;
/****** Object:  foreignKey FK_EmpleadoHoras_Empleado    Script Date: 07/30/2012 17:09:47 ******/
alter table EmpleadoHoras  ADD  CONSTRAINT FK_EmpleadoHoras_Empleado forEIGN KEY(em_id)
REFERENCES Empleado (em_id)
;
-- FK_EmpleadoHoras_Empleado
;
/****** Object:  foreignKey FK_EmpleadoHoras_EmpleadoAsistencia    Script Date: 07/30/2012 17:09:47 ******/
alter table EmpleadoHoras  ADD  CONSTRAINT FK_EmpleadoHoras_EmpleadoAsistencia forEIGN KEY(east_id)
REFERENCES EmpleadoAsistenciaTipo (east_id)
;
-- FK_EmpleadoHoras_EmpleadoAsistencia
;
/****** Object:  foreignKey FK_EmpleadoHoras_EmpleadoPeriodo    Script Date: 07/30/2012 17:09:47 ******/
alter table EmpleadoHoras  ADD  CONSTRAINT FK_EmpleadoHoras_EmpleadoPeriodo forEIGN KEY(empe_id)
REFERENCES EmpleadoPeriodo (empe_id)
;
-- FK_EmpleadoHoras_EmpleadoPeriodo
;
/****** Object:  foreignKey FK_EmpleadoPeriodo_CentroCosto    Script Date: 07/30/2012 17:09:50 ******/
alter table EmpleadoPeriodo  ADD  CONSTRAINT FK_EmpleadoPeriodo_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_EmpleadoPeriodo_CentroCosto
;
/****** Object:  foreignKey FK_EmpleadoPeriodo_Usuario    Script Date: 07/30/2012 17:09:50 ******/
alter table EmpleadoPeriodo  ADD  CONSTRAINT FK_EmpleadoPeriodo_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_EmpleadoPeriodo_Usuario
;
/****** Object:  foreignKey FK_EmpleadoPresentismo_CentroCosto    Script Date: 07/30/2012 17:09:52 ******/
alter table EmpleadoPresentismo  ADD  CONSTRAINT FK_EmpleadoPresentismo_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_EmpleadoPresentismo_CentroCosto
;
/****** Object:  foreignKey FK_EmpleadoPresentismo_Empleado    Script Date: 07/30/2012 17:09:52 ******/
alter table EmpleadoPresentismo  ADD  CONSTRAINT FK_EmpleadoPresentismo_Empleado forEIGN KEY(em_id)
REFERENCES Empleado (em_id)
;
-- FK_EmpleadoPresentismo_Empleado
;
/****** Object:  foreignKey FK_EmpleadoPresentismo_EmpleadoPeriodo    Script Date: 07/30/2012 17:09:52 ******/
alter table EmpleadoPresentismo  ADD  CONSTRAINT FK_EmpleadoPresentismo_EmpleadoPeriodo forEIGN KEY(empe_id)
REFERENCES EmpleadoPeriodo (empe_id)
;
-- FK_EmpleadoPresentismo_EmpleadoPeriodo
;
/****** Object:  foreignKey FK_EmpleadoSemana_CentroCosto    Script Date: 07/30/2012 17:09:54 ******/
alter table EmpleadoSemana  ADD  CONSTRAINT FK_EmpleadoSemana_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_EmpleadoSemana_CentroCosto
;
/****** Object:  foreignKey FK_EmpleadoSemana_EmpleadoPeriodo    Script Date: 07/30/2012 17:09:54 ******/
alter table EmpleadoSemana  ADD  CONSTRAINT FK_EmpleadoSemana_EmpleadoPeriodo forEIGN KEY(empe_id)
REFERENCES EmpleadoPeriodo (empe_id)
;
-- FK_EmpleadoSemana_EmpleadoPeriodo
;
/****** Object:  foreignKey FK_Empresa_Usuario    Script Date: 07/30/2012 17:10:00 ******/
alter table Empresa  ADD  CONSTRAINT FK_Empresa_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Empresa_Usuario
;
/****** Object:  foreignKey FK_EmpresaCliente_Cliente    Script Date: 07/30/2012 17:10:02 ******/
alter table EmpresaCliente  ADD  CONSTRAINT FK_EmpresaCliente_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_EmpresaCliente_Cliente
;
/****** Object:  foreignKey FK_EmpresaCliente_Empresa    Script Date: 07/30/2012 17:10:02 ******/
alter table EmpresaCliente  ADD  CONSTRAINT FK_EmpresaCliente_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_EmpresaCliente_Empresa
;
/****** Object:  foreignKey FK_EmpresaCliente_Usuario    Script Date: 07/30/2012 17:10:02 ******/
alter table EmpresaCliente  ADD  CONSTRAINT FK_EmpresaCliente_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_EmpresaCliente_Usuario
;
/****** Object:  foreignKey FK_EmpresaClienteDeuda_Cliente    Script Date: 07/30/2012 17:10:06 ******/
alter table EmpresaClienteDeuda  ADD  CONSTRAINT FK_EmpresaClienteDeuda_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_EmpresaClienteDeuda_Cliente
;
/****** Object:  foreignKey FK_EmpresaClienteDeuda_Empresa    Script Date: 07/30/2012 17:10:06 ******/
alter table EmpresaClienteDeuda  ADD  CONSTRAINT FK_EmpresaClienteDeuda_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_EmpresaClienteDeuda_Empresa
;
/****** Object:  foreignKey FK_EmpresaProveedor_Empresa    Script Date: 07/30/2012 17:10:08 ******/
alter table EmpresaProveedor  ADD  CONSTRAINT FK_EmpresaProveedor_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_EmpresaProveedor_Empresa
;
/****** Object:  foreignKey FK_EmpresaProveedor_Proveedor    Script Date: 07/30/2012 17:10:08 ******/
alter table EmpresaProveedor  ADD  CONSTRAINT FK_EmpresaProveedor_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_EmpresaProveedor_Proveedor
;
/****** Object:  foreignKey FK_EmpresaProveedor_Usuario    Script Date: 07/30/2012 17:10:08 ******/
alter table EmpresaProveedor  ADD  CONSTRAINT FK_EmpresaProveedor_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_EmpresaProveedor_Usuario
;
/****** Object:  foreignKey FK_EmpresaProveedorDeuda_Empresa    Script Date: 07/30/2012 17:10:11 ******/
alter table EmpresaProveedorDeuda  ADD  CONSTRAINT FK_EmpresaProveedorDeuda_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_EmpresaProveedorDeuda_Empresa
;
/****** Object:  foreignKey FK_EmpresaProveedorDeuda_Proveedor    Script Date: 07/30/2012 17:10:11 ******/
alter table EmpresaProveedorDeuda  ADD  CONSTRAINT FK_EmpresaProveedorDeuda_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_EmpresaProveedorDeuda_Proveedor
;
/****** Object:  foreignKey FK_EmpresaUsuario_Empresa    Script Date: 07/30/2012 17:10:12 ******/
alter table EmpresaUsuario  ADD  CONSTRAINT FK_EmpresaUsuario_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_EmpresaUsuario_Empresa
;
/****** Object:  foreignKey FK_EmpresaUsuario_Modifico    Script Date: 07/30/2012 17:10:12 ******/
alter table EmpresaUsuario  ADD  CONSTRAINT FK_EmpresaUsuario_Modifico forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_EmpresaUsuario_Modifico
;
/****** Object:  foreignKey FK_EmpresaUsuario_Usuario    Script Date: 07/30/2012 17:10:13 ******/
alter table EmpresaUsuario  ADD  CONSTRAINT FK_EmpresaUsuario_Usuario forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_EmpresaUsuario_Usuario
;
/****** Object:  foreignKey FK_EncuestaDepartamento_Departamento    Script Date: 07/30/2012 17:10:16 ******/
alter table EncuestaDepartamento  ADD  CONSTRAINT FK_EncuestaDepartamento_Departamento forEIGN KEY(dpto_id)
REFERENCES Departamento (dpto_id)
;
-- FK_EncuestaDepartamento_Departamento
;
/****** Object:  foreignKey FK_EncuestaDepartamento_Encuesta    Script Date: 07/30/2012 17:10:16 ******/
alter table EncuestaDepartamento  ADD  CONSTRAINT FK_EncuestaDepartamento_Encuesta forEIGN KEY(ec_id)
REFERENCES Encuesta (ec_id)
;
-- FK_EncuestaDepartamento_Encuesta
;
/****** Object:  foreignKey FK_EncuestaPregunta_Encuesta    Script Date: 07/30/2012 17:10:17 ******/
alter table EncuestaPregunta  ADD  CONSTRAINT FK_EncuestaPregunta_Encuesta forEIGN KEY(ec_id)
REFERENCES Encuesta (ec_id)
;
-- FK_EncuestaPregunta_Encuesta
;
/****** Object:  foreignKey FK_EncuestaPreguntaItem_EncuestaPregunta    Script Date: 07/30/2012 17:10:19 ******/
alter table EncuestaPreguntaItem  ADD  CONSTRAINT FK_EncuestaPreguntaItem_EncuestaPregunta forEIGN KEY(ecp_id)
REFERENCES EncuestaPregunta (ecp_id)
;
-- FK_EncuestaPreguntaItem_EncuestaPregunta
;
/****** Object:  foreignKey FK_EncuestaRespuesta_EncuestaPreguntaItem    Script Date: 07/30/2012 17:10:20 ******/
alter table EncuestaRespuesta  ADD  CONSTRAINT FK_EncuestaRespuesta_EncuestaPreguntaItem forEIGN KEY(ecpi_id)
REFERENCES EncuestaPreguntaItem (ecpi_id)
;
-- FK_EncuestaRespuesta_EncuestaPreguntaItem
;
/****** Object:  foreignKey FK_EncuestaRespuesta_Usuario    Script Date: 07/30/2012 17:10:20 ******/
alter table EncuestaRespuesta  ADD  CONSTRAINT FK_EncuestaRespuesta_Usuario forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_EncuestaRespuesta_Usuario
;
/****** Object:  foreignKey FK_EncuestaWebSeccion_Encuesta    Script Date: 07/30/2012 17:10:21 ******/
alter table EncuestaWebSeccion  ADD  CONSTRAINT FK_EncuestaWebSeccion_Encuesta forEIGN KEY(ec_id)
REFERENCES Encuesta (ec_id)
;
-- FK_EncuestaWebSeccion_Encuesta
;
/****** Object:  foreignKey FK_EncuestaWebSeccion_webSeccion    Script Date: 07/30/2012 17:10:21 ******/
alter table EncuestaWebSeccion  ADD  CONSTRAINT FK_EncuestaWebSeccion_webSeccion forEIGN KEY(ws_id)
REFERENCES webSeccion (ws_id)
;
-- FK_EncuestaWebSeccion_webSeccion
;
/****** Object:  foreignKey FK_EquipoDetalleItem_EquipoDetalle    Script Date: 07/30/2012 17:10:25 ******/
alter table EquipoDetalleItem  ADD  CONSTRAINT FK_EquipoDetalleItem_EquipoDetalle forEIGN KEY(ed_id)
REFERENCES EquipoDetalle (ed_id)
;
-- FK_EquipoDetalleItem_EquipoDetalle
;
/****** Object:  foreignKey FK_Especie_Usuario    Script Date: 07/30/2012 17:10:30 ******/
alter table Especie  ADD  CONSTRAINT FK_Especie_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Especie_Usuario
;
/****** Object:  foreignKey FK_ExpoFacturaVenta_ExpoGrupoPrecio    Script Date: 07/30/2012 17:10:36 ******/
alter table ExpoFacturaVenta  ADD  CONSTRAINT FK_ExpoFacturaVenta_ExpoGrupoPrecio forEIGN KEY(egp_id)
REFERENCES ExpoGrupoPrecio (egp_id)
;
-- FK_ExpoFacturaVenta_ExpoGrupoPrecio
;
/****** Object:  foreignKey FK_ExpoFacturaVenta_FacturaVenta    Script Date: 07/30/2012 17:10:36 ******/
alter table ExpoFacturaVenta  ADD  CONSTRAINT FK_ExpoFacturaVenta_FacturaVenta forEIGN KEY(fv_id)
REFERENCES FacturaVenta (fv_id)
;
-- FK_ExpoFacturaVenta_FacturaVenta
;
/****** Object:  foreignKey FK_ExpoFacturaVenta_Idioma    Script Date: 07/30/2012 17:10:36 ******/
alter table ExpoFacturaVenta  ADD  CONSTRAINT FK_ExpoFacturaVenta_Idioma forEIGN KEY(idm_id)
REFERENCES Idioma (idm_id)
;
-- FK_ExpoFacturaVenta_Idioma
;
/****** Object:  foreignKey FK_ExpoFacturaVenta_Usuario    Script Date: 07/30/2012 17:10:36 ******/
alter table ExpoFacturaVenta  ADD  CONSTRAINT FK_ExpoFacturaVenta_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ExpoFacturaVenta_Usuario
;
/****** Object:  foreignKey FK_ExpoFamilia_Usuario    Script Date: 07/30/2012 17:10:38 ******/
alter table ExpoFamilia  ADD  CONSTRAINT FK_ExpoFamilia_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ExpoFamilia_Usuario
;
/****** Object:  foreignKey FK_ExpoGrupoPrecio_Usuario    Script Date: 07/30/2012 17:10:40 ******/
alter table ExpoGrupoPrecio  ADD  CONSTRAINT FK_ExpoGrupoPrecio_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ExpoGrupoPrecio_Usuario
;
/****** Object:  foreignKey FK_ExpoGrupoPrecioIdioma_ExpoGrupoPrecio    Script Date: 07/30/2012 17:10:41 ******/
alter table ExpoGrupoPrecioIdioma  ADD  CONSTRAINT FK_ExpoGrupoPrecioIdioma_ExpoGrupoPrecio forEIGN KEY(egp_id)
REFERENCES ExpoGrupoPrecio (egp_id)
;
-- FK_ExpoGrupoPrecioIdioma_ExpoGrupoPrecio
;
/****** Object:  foreignKey FK_ExpoGrupoPrecioPosAran_ExpoGrupoPrecio    Script Date: 07/30/2012 17:10:43 ******/
alter table ExpoGrupoPrecioPosAran  ADD  CONSTRAINT FK_ExpoGrupoPrecioPosAran_ExpoGrupoPrecio forEIGN KEY(egp_id)
REFERENCES ExpoGrupoPrecio (egp_id)
;
-- FK_ExpoGrupoPrecioPosAran_ExpoGrupoPrecio
;
/****** Object:  foreignKey FK_ExpoGrupoPrecioPosAran_Pais    Script Date: 07/30/2012 17:10:43 ******/
alter table ExpoGrupoPrecioPosAran  ADD  CONSTRAINT FK_ExpoGrupoPrecioPosAran_Pais forEIGN KEY(pa_id)
REFERENCES Pais (pa_id)
;
-- FK_ExpoGrupoPrecioPosAran_Pais
;
/****** Object:  foreignKey FK_ExpoPackingList_ExpoGrupoPrecio    Script Date: 07/30/2012 17:10:46 ******/
alter table ExpoPackingList  ADD  CONSTRAINT FK_ExpoPackingList_ExpoGrupoPrecio forEIGN KEY(egp_id)
REFERENCES ExpoGrupoPrecio (egp_id)
;
-- FK_ExpoPackingList_ExpoGrupoPrecio
;
/****** Object:  foreignKey FK_ExpoPackingList_Idioma    Script Date: 07/30/2012 17:10:46 ******/
alter table ExpoPackingList  ADD  CONSTRAINT FK_ExpoPackingList_Idioma forEIGN KEY(idm_id)
REFERENCES Idioma (idm_id)
;
-- FK_ExpoPackingList_Idioma
;
/****** Object:  foreignKey FK_ExpoPackingList_PackingList    Script Date: 07/30/2012 17:10:46 ******/
alter table ExpoPackingList  ADD  CONSTRAINT FK_ExpoPackingList_PackingList forEIGN KEY(pklst_id)
REFERENCES PackingList (pklst_id)
;
-- FK_ExpoPackingList_PackingList
;
/****** Object:  foreignKey FK_ExpoPackingList_Usuario    Script Date: 07/30/2012 17:10:46 ******/
alter table ExpoPackingList  ADD  CONSTRAINT FK_ExpoPackingList_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ExpoPackingList_Usuario
;
/****** Object:  foreignKey FK_FacturaCompra_Asiento    Script Date: 07/30/2012 17:10:57 ******/
alter table FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_Asiento forEIGN KEY(as_id)
REFERENCES Asiento (as_id)
;
-- FK_FacturaCompra_Asiento
;
/****** Object:  foreignKey FK_FacturaCompra_CentroCosto    Script Date: 07/30/2012 17:10:57 ******/
alter table FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_FacturaCompra_CentroCosto
;
/****** Object:  foreignKey FK_FacturaCompra_CondicionPago    Script Date: 07/30/2012 17:10:57 ******/
alter table FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_CondicionPago forEIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_FacturaCompra_CondicionPago
;
/****** Object:  foreignKey FK_FacturaCompra_Documento    Script Date: 07/30/2012 17:10:57 ******/
alter table FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_FacturaCompra_Documento
;
/****** Object:  foreignKey FK_FacturaCompra_DocumentoTipo    Script Date: 07/30/2012 17:10:57 ******/
alter table FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_FacturaCompra_DocumentoTipo
;
/****** Object:  foreignKey FK_FacturaCompra_Legajo    Script Date: 07/30/2012 17:10:58 ******/
alter table FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_FacturaCompra_Legajo
;
/****** Object:  foreignKey FK_FacturaCompra_ListaDescuento    Script Date: 07/30/2012 17:10:58 ******/
alter table FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_ListaDescuento forEIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_FacturaCompra_ListaDescuento
;
/****** Object:  foreignKey FK_FacturaCompra_ListaPrecio    Script Date: 07/30/2012 17:10:58 ******/
alter table FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_ListaPrecio forEIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_FacturaCompra_ListaPrecio
;
/****** Object:  foreignKey FK_FacturaCompra_Moneda    Script Date: 07/30/2012 17:10:58 ******/
alter table FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_Moneda forEIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_FacturaCompra_Moneda
;
/****** Object:  foreignKey FK_FacturaCompra_OrdenPago    Script Date: 07/30/2012 17:10:58 ******/
alter table FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_OrdenPago forEIGN KEY(opg_id)
REFERENCES OrdenPago (opg_id)
;
-- FK_FacturaCompra_OrdenPago
;
/****** Object:  foreignKey FK_FacturaCompra_Proveedor    Script Date: 07/30/2012 17:10:58 ******/
alter table FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_FacturaCompra_Proveedor
;
/****** Object:  foreignKey FK_FacturaCompra_ProvinciaDestino    Script Date: 07/30/2012 17:10:58 ******/
alter table FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_ProvinciaDestino forEIGN KEY(pro_id_destino)
REFERENCES Provincia (pro_id)
;
-- FK_FacturaCompra_ProvinciaDestino
;
/****** Object:  foreignKey FK_FacturaCompra_ProvinciaOrigen    Script Date: 07/30/2012 17:10:58 ******/
alter table FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_ProvinciaOrigen forEIGN KEY(pro_id_origen)
REFERENCES Provincia (pro_id)
;
-- FK_FacturaCompra_ProvinciaOrigen
;
/****** Object:  foreignKey FK_FacturaCompra_RemitoCompra    Script Date: 07/30/2012 17:10:58 ******/
alter table FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_RemitoCompra forEIGN KEY(rc_id)
REFERENCES RemitoCompra (rc_id)
;
-- FK_FacturaCompra_RemitoCompra
;
/****** Object:  foreignKey FK_FacturaCompra_Stock    Script Date: 07/30/2012 17:10:58 ******/
alter table FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_Stock forEIGN KEY(st_id)
REFERENCES Stock (st_id)
;
-- FK_FacturaCompra_Stock
;
/****** Object:  foreignKey FK_FacturaCompra_Usuario    Script Date: 07/30/2012 17:10:59 ******/
alter table FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_FacturaCompra_Usuario
;
/****** Object:  foreignKey FK_FacturaCompraDeuda_FacturaCompra    Script Date: 07/30/2012 17:11:01 ******/
alter table FacturaCompraDeuda  ADD  CONSTRAINT FK_FacturaCompraDeuda_FacturaCompra forEIGN KEY(fc_id)
REFERENCES FacturaCompra (fc_id)
;
-- FK_FacturaCompraDeuda_FacturaCompra
;
/****** Object:  foreignKey FK_FacturaCompraItem_CentroCosto    Script Date: 07/30/2012 17:11:07 ******/
alter table FacturaCompraItem  ADD  CONSTRAINT FK_FacturaCompraItem_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_FacturaCompraItem_CentroCosto
;
/****** Object:  foreignKey FK_FacturaCompraItem_Cuenta    Script Date: 07/30/2012 17:11:07 ******/
alter table FacturaCompraItem  ADD  CONSTRAINT FK_FacturaCompraItem_Cuenta forEIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_FacturaCompraItem_Cuenta
;
/****** Object:  foreignKey FK_FacturaCompraItem_CuentaIvaRI    Script Date: 07/30/2012 17:11:07 ******/
alter table FacturaCompraItem  ADD  CONSTRAINT FK_FacturaCompraItem_CuentaIvaRI forEIGN KEY(cue_id_ivari)
REFERENCES Cuenta (cue_id)
;
-- FK_FacturaCompraItem_CuentaIvaRI
;
/****** Object:  foreignKey FK_FacturaCompraItem_CuentaIvaRNI    Script Date: 07/30/2012 17:11:07 ******/
alter table FacturaCompraItem  ADD  CONSTRAINT FK_FacturaCompraItem_CuentaIvaRNI forEIGN KEY(cue_id_ivarni)
REFERENCES Cuenta (cue_id)
;
-- FK_FacturaCompraItem_CuentaIvaRNI
;
/****** Object:  foreignKey FK_FacturaCompraItem_FacturaCompra    Script Date: 07/30/2012 17:11:07 ******/
alter table FacturaCompraItem  ADD  CONSTRAINT FK_FacturaCompraItem_FacturaCompra forEIGN KEY(fc_id)
REFERENCES FacturaCompra (fc_id)
;
-- FK_FacturaCompraItem_FacturaCompra
;
/****** Object:  foreignKey FK_FacturaCompraItem_Producto    Script Date: 07/30/2012 17:11:07 ******/
alter table FacturaCompraItem  ADD  CONSTRAINT FK_FacturaCompraItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_FacturaCompraItem_Producto
;
/****** Object:  foreignKey FK_FacturaCompraItem_StockLote    Script Date: 07/30/2012 17:11:07 ******/
alter table FacturaCompraItem  ADD  CONSTRAINT FK_FacturaCompraItem_StockLote forEIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_FacturaCompraItem_StockLote
;
/****** Object:  foreignKey FK_FacturaCompraItem_TipoOperacion    Script Date: 07/30/2012 17:11:07 ******/
alter table FacturaCompraItem  ADD  CONSTRAINT FK_FacturaCompraItem_TipoOperacion forEIGN KEY(to_id)
REFERENCES TipoOperacion (to_id)
;
-- FK_FacturaCompraItem_TipoOperacion
;
/****** Object:  foreignKey FK_FacturaCompraItemBorradoTMP_FacturaCompraTMP    Script Date: 07/30/2012 17:11:08 ******/
alter table FacturaCompraItemBorradoTMP  ADD  CONSTRAINT FK_FacturaCompraItemBorradoTMP_FacturaCompraTMP forEIGN KEY(fcTMP_id)
REFERENCES FacturaCompraTMP (fcTMP_id)
;
-- FK_FacturaCompraItemBorradoTMP_FacturaCompraTMP
;
/****** Object:  foreignKey FK_FacturaCompraItemSerieBTMP_FacturaCompraTMP    Script Date: 07/30/2012 17:11:09 ******/
alter table FacturaCompraItemSerieBTMP  ADD  CONSTRAINT FK_FacturaCompraItemSerieBTMP_FacturaCompraTMP forEIGN KEY(fcTMP_id)
REFERENCES FacturaCompraTMP (fcTMP_id)
;
-- FK_FacturaCompraItemSerieBTMP_FacturaCompraTMP
;
/****** Object:  foreignKey FK_FacturaCompraItemSerieTMP_FacturaCompraItemTMP    Script Date: 07/30/2012 17:11:12 ******/
alter table FacturaCompraItemSerieTMP  ADD  CONSTRAINT FK_FacturaCompraItemSerieTMP_FacturaCompraItemTMP forEIGN KEY(fciTMP_id)
REFERENCES FacturaCompraItemTMP (fciTMP_id)
;
-- FK_FacturaCompraItemSerieTMP_FacturaCompraItemTMP
;
/****** Object:  foreignKey FK_FacturaCompraItemSerieTMP_FacturaCompraTMP    Script Date: 07/30/2012 17:11:12 ******/
alter table FacturaCompraItemSerieTMP  ADD  CONSTRAINT FK_FacturaCompraItemSerieTMP_FacturaCompraTMP forEIGN KEY(fcTMP_id)
REFERENCES FacturaCompraTMP (fcTMP_id)
;
-- FK_FacturaCompraItemSerieTMP_FacturaCompraTMP
;
/****** Object:  foreignKey FK_FacturaCompraItemTMP_FacturaCompraTMP    Script Date: 07/30/2012 17:11:19 ******/
alter table FacturaCompraItemTMP  ADD  CONSTRAINT FK_FacturaCompraItemTMP_FacturaCompraTMP forEIGN KEY(fcTMP_id)
REFERENCES FacturaCompraTMP (fcTMP_id)
;
-- FK_FacturaCompraItemTMP_FacturaCompraTMP
;
/****** Object:  foreignKey FK_FacturaCompraLegajo_FacturaCompra    Script Date: 07/30/2012 17:11:20 ******/
alter table FacturaCompraLegajo  ADD  CONSTRAINT FK_FacturaCompraLegajo_FacturaCompra forEIGN KEY(fc_id)
REFERENCES FacturaCompra (fc_id)
;
-- FK_FacturaCompraLegajo_FacturaCompra
;
/****** Object:  foreignKey FK_FacturaCompraLegajo_Legajo    Script Date: 07/30/2012 17:11:20 ******/
alter table FacturaCompraLegajo  ADD  CONSTRAINT FK_FacturaCompraLegajo_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_FacturaCompraLegajo_Legajo
;
/****** Object:  foreignKey FK_FacturaCompraLegajoBorradoTMP_FacturaCompraTMP    Script Date: 07/30/2012 17:11:21 ******/
alter table FacturaCompraLegajoBorradoTMP  ADD  CONSTRAINT FK_FacturaCompraLegajoBorradoTMP_FacturaCompraTMP forEIGN KEY(fcTMP_id)
REFERENCES FacturaCompraTMP (fcTMP_id)
;
-- FK_FacturaCompraLegajoBorradoTMP_FacturaCompraTMP
;
/****** Object:  foreignKey FK_FacturaCompraLegajoTMP_FacturaCompraTMP    Script Date: 07/30/2012 17:11:23 ******/
alter table FacturaCompraLegajoTMP  ADD  CONSTRAINT FK_FacturaCompraLegajoTMP_FacturaCompraTMP forEIGN KEY(fcTMP_id)
REFERENCES FacturaCompraTMP (fcTMP_id)
;
-- FK_FacturaCompraLegajoTMP_FacturaCompraTMP
;
/****** Object:  foreignKey FK_FacturaCompraNotaCredito_DeudaFactura    Script Date: 07/30/2012 17:11:25 ******/
alter table FacturaCompraNotaCredito  ADD  CONSTRAINT FK_FacturaCompraNotaCredito_DeudaFactura forEIGN KEY(fcd_id_factura)
REFERENCES FacturaCompraDeuda (fcd_id)
;
-- FK_FacturaCompraNotaCredito_DeudaFactura
;
/****** Object:  foreignKey FK_FacturaCompraNotaCredito_DeudaNotaCredito    Script Date: 07/30/2012 17:11:25 ******/
alter table FacturaCompraNotaCredito  ADD  CONSTRAINT FK_FacturaCompraNotaCredito_DeudaNotaCredito forEIGN KEY(fcd_id_notacredito)
REFERENCES FacturaCompraDeuda (fcd_id)
;
-- FK_FacturaCompraNotaCredito_DeudaNotaCredito
;
/****** Object:  foreignKey FK_FacturaCompraNotaCredito_FacturaCompra    Script Date: 07/30/2012 17:11:25 ******/
alter table FacturaCompraNotaCredito  ADD  CONSTRAINT FK_FacturaCompraNotaCredito_FacturaCompra forEIGN KEY(fc_id_factura)
REFERENCES FacturaCompra (fc_id)
;
-- FK_FacturaCompraNotaCredito_FacturaCompra
;
/****** Object:  foreignKey FK_FacturaCompraNotaCredito_NotaCredito    Script Date: 07/30/2012 17:11:26 ******/
alter table FacturaCompraNotaCredito  ADD  CONSTRAINT FK_FacturaCompraNotaCredito_NotaCredito forEIGN KEY(fc_id_notacredito)
REFERENCES FacturaCompra (fc_id)
;
-- FK_FacturaCompraNotaCredito_NotaCredito
;
/****** Object:  foreignKey FK_FacturaCompraNotaCredito_PagoFactura    Script Date: 07/30/2012 17:11:26 ******/
alter table FacturaCompraNotaCredito  ADD  CONSTRAINT FK_FacturaCompraNotaCredito_PagoFactura forEIGN KEY(fcp_id_factura)
REFERENCES FacturaCompraPago (fcp_id)
;
-- FK_FacturaCompraNotaCredito_PagoFactura
;
/****** Object:  foreignKey FK_FacturaCompraNotaCredito_PagoNotaCredito    Script Date: 07/30/2012 17:11:26 ******/
alter table FacturaCompraNotaCredito  ADD  CONSTRAINT FK_FacturaCompraNotaCredito_PagoNotaCredito forEIGN KEY(fcp_id_notacredito)
REFERENCES FacturaCompraPago (fcp_id)
;
-- FK_FacturaCompraNotaCredito_PagoNotaCredito
;
/****** Object:  foreignKey FK_FacturaCompraOrdenPago_FacturaCompra    Script Date: 07/30/2012 17:11:30 ******/
alter table FacturaCompraOrdenPago  ADD  CONSTRAINT FK_FacturaCompraOrdenPago_FacturaCompra forEIGN KEY(fc_id)
REFERENCES FacturaCompra (fc_id)
;
-- FK_FacturaCompraOrdenPago_FacturaCompra
;
/****** Object:  foreignKey FK_FacturaCompraOrdenPago_FacturaCompraDeuda    Script Date: 07/30/2012 17:11:30 ******/
alter table FacturaCompraOrdenPago  ADD  CONSTRAINT FK_FacturaCompraOrdenPago_FacturaCompraDeuda forEIGN KEY(fcd_id)
REFERENCES FacturaCompraDeuda (fcd_id)
;
-- FK_FacturaCompraOrdenPago_FacturaCompraDeuda
;
/****** Object:  foreignKey FK_FacturaCompraOrdenPago_FacturaCompraPago    Script Date: 07/30/2012 17:11:30 ******/
alter table FacturaCompraOrdenPago  ADD  CONSTRAINT FK_FacturaCompraOrdenPago_FacturaCompraPago forEIGN KEY(fcp_id)
REFERENCES FacturaCompraPago (fcp_id)
;
-- FK_FacturaCompraOrdenPago_FacturaCompraPago
;
/****** Object:  foreignKey FK_FacturaCompraOrdenPago_OrdenPago    Script Date: 07/30/2012 17:11:30 ******/
alter table FacturaCompraOrdenPago  ADD  CONSTRAINT FK_FacturaCompraOrdenPago_OrdenPago forEIGN KEY(opg_id)
REFERENCES OrdenPago (opg_id)
;
-- FK_FacturaCompraOrdenPago_OrdenPago
;
/****** Object:  foreignKey FK_FacturaCompraOrdenPagoTMP_OrdenPagoTMP    Script Date: 07/30/2012 17:11:32 ******/
alter table FacturaCompraOrdenPagoTMP  ADD  CONSTRAINT FK_FacturaCompraOrdenPagoTMP_OrdenPagoTMP forEIGN KEY(opgTMP_id)
REFERENCES OrdenPagoTMP (opgTMP_id)
;
-- FK_FacturaCompraOrdenPagoTMP_OrdenPagoTMP
;
/****** Object:  foreignKey FK_FacturaCompraOtro_CentroCosto    Script Date: 07/30/2012 17:11:34 ******/
alter table FacturaCompraOtro  ADD  CONSTRAINT FK_FacturaCompraOtro_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_FacturaCompraOtro_CentroCosto
;
/****** Object:  foreignKey FK_FacturaCompraOtro_Cuenta    Script Date: 07/30/2012 17:11:34 ******/
alter table FacturaCompraOtro  ADD  CONSTRAINT FK_FacturaCompraOtro_Cuenta forEIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_FacturaCompraOtro_Cuenta
;
/****** Object:  foreignKey FK_FacturaCompraOtro_FacturaCompra    Script Date: 07/30/2012 17:11:34 ******/
alter table FacturaCompraOtro  ADD  CONSTRAINT FK_FacturaCompraOtro_FacturaCompra forEIGN KEY(fc_id)
REFERENCES FacturaCompra (fc_id)
;
-- FK_FacturaCompraOtro_FacturaCompra
;
/****** Object:  foreignKey FK_FacturaCompraOtroBorradoTMP_FacturaCompraTMP    Script Date: 07/30/2012 17:11:35 ******/
alter table FacturaCompraOtroBorradoTMP  ADD  CONSTRAINT FK_FacturaCompraOtroBorradoTMP_FacturaCompraTMP forEIGN KEY(fcTMP_id)
REFERENCES FacturaCompraTMP (fcTMP_id)
;
-- FK_FacturaCompraOtroBorradoTMP_FacturaCompraTMP
;
/****** Object:  foreignKey FK_FacturaCompraOtroTMP_FacturaCompraTMP    Script Date: 07/30/2012 17:11:38 ******/
alter table FacturaCompraOtroTMP  ADD  CONSTRAINT FK_FacturaCompraOtroTMP_FacturaCompraTMP forEIGN KEY(fcTMP_id)
REFERENCES FacturaCompraTMP (fcTMP_id)
;
-- FK_FacturaCompraOtroTMP_FacturaCompraTMP
;
/****** Object:  foreignKey FK_FacturaCompraPago_FacturaCompra    Script Date: 07/30/2012 17:11:39 ******/
alter table FacturaCompraPago  ADD  CONSTRAINT FK_FacturaCompraPago_FacturaCompra forEIGN KEY(fc_id)
REFERENCES FacturaCompra (fc_id)
;
-- FK_FacturaCompraPago_FacturaCompra
;
/****** Object:  foreignKey FK_FacturaCompraPercepcion_CentroCosto    Script Date: 07/30/2012 17:11:41 ******/
alter table FacturaCompraPercepcion  ADD  CONSTRAINT FK_FacturaCompraPercepcion_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_FacturaCompraPercepcion_CentroCosto
;
/****** Object:  foreignKey FK_FacturaCompraPercepcion_FacturaCompra    Script Date: 07/30/2012 17:11:41 ******/
alter table FacturaCompraPercepcion  ADD  CONSTRAINT FK_FacturaCompraPercepcion_FacturaCompra forEIGN KEY(fc_id)
REFERENCES FacturaCompra (fc_id)
;
-- FK_FacturaCompraPercepcion_FacturaCompra
;
/****** Object:  foreignKey FK_FacturaCompraPercepcionBorradoTMP_FacturaCompraTMP    Script Date: 07/30/2012 17:11:42 ******/
alter table FacturaCompraPercepcionBorradoTMP  ADD  CONSTRAINT FK_FacturaCompraPercepcionBorradoTMP_FacturaCompraTMP forEIGN KEY(fcTMP_id)
REFERENCES FacturaCompraTMP (fcTMP_id)
;
-- FK_FacturaCompraPercepcionBorradoTMP_FacturaCompraTMP
;
/****** Object:  foreignKey FK_FacturaVentaCajero_FacturaVenta    Script Date: 07/30/2012 17:12:11 ******/
alter table FacturaVentaCajero  ADD  CONSTRAINT FK_FacturaVentaCajero_FacturaVenta forEIGN KEY(fv_id)
REFERENCES FacturaVenta (fv_id)
;
-- FK_FacturaVentaCajero_FacturaVenta
;
/****** Object:  foreignKey FK_FacturaVentaCobranza_Cobranza    Script Date: 07/30/2012 17:12:14 ******/
alter table FacturaVentaCobranza  ADD  CONSTRAINT FK_FacturaVentaCobranza_Cobranza forEIGN KEY(cobz_id)
REFERENCES Cobranza (cobz_id)
;
-- FK_FacturaVentaCobranza_Cobranza
;
/****** Object:  foreignKey FK_FacturaVentaCobranza_FacturaVenta    Script Date: 07/30/2012 17:12:14 ******/
alter table FacturaVentaCobranza  ADD  CONSTRAINT FK_FacturaVentaCobranza_FacturaVenta forEIGN KEY(fv_id)
REFERENCES FacturaVenta (fv_id)
;
-- FK_FacturaVentaCobranza_FacturaVenta
;
/****** Object:  foreignKey FK_FacturaVentaCobranza_FacturaVentaDeuda    Script Date: 07/30/2012 17:12:14 ******/
alter table FacturaVentaCobranza  ADD  CONSTRAINT FK_FacturaVentaCobranza_FacturaVentaDeuda forEIGN KEY(fvd_id)
REFERENCES FacturaVentaDeuda (fvd_id)
;
-- FK_FacturaVentaCobranza_FacturaVentaDeuda
;
/****** Object:  foreignKey FK_FacturaVentaCobranza_FacturaVentaPago    Script Date: 07/30/2012 17:12:14 ******/
alter table FacturaVentaCobranza  ADD  CONSTRAINT FK_FacturaVentaCobranza_FacturaVentaPago forEIGN KEY(fvp_id)
REFERENCES FacturaVentaPago (fvp_id)
;
-- FK_FacturaVentaCobranza_FacturaVentaPago
;
/****** Object:  foreignKey FK_FacturaVentaCobranzaTMP_CobranzaTMP    Script Date: 07/30/2012 17:12:16 ******/
alter table FacturaVentaCobranzaTMP  ADD  CONSTRAINT FK_FacturaVentaCobranzaTMP_CobranzaTMP forEIGN KEY(cobzTMP_id)
REFERENCES CobranzaTMP (cobzTMP_id)
;
-- FK_FacturaVentaCobranzaTMP_CobranzaTMP
;
/****** Object:  foreignKey FK_FacturaVentaDeuda_FacturaVenta    Script Date: 07/30/2012 17:12:18 ******/
alter table FacturaVentaDeuda  ADD  CONSTRAINT FK_FacturaVentaDeuda_FacturaVenta forEIGN KEY(fv_id)
REFERENCES FacturaVenta (fv_id)
;
-- FK_FacturaVentaDeuda_FacturaVenta
;
/****** Object:  foreignKey FK_FacturaVentaItem_CentroCosto    Script Date: 07/30/2012 17:12:24 ******/
alter table FacturaVentaItem  ADD  CONSTRAINT FK_FacturaVentaItem_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_FacturaVentaItem_CentroCosto
;
/****** Object:  foreignKey FK_FacturaVentaItem_Cuenta    Script Date: 07/30/2012 17:12:24 ******/
alter table FacturaVentaItem  ADD  CONSTRAINT FK_FacturaVentaItem_Cuenta forEIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_FacturaVentaItem_Cuenta
;
/****** Object:  foreignKey FK_FacturaVentaItem_CuentaIvaRI    Script Date: 07/30/2012 17:12:24 ******/
alter table FacturaVentaItem  ADD  CONSTRAINT FK_FacturaVentaItem_CuentaIvaRI forEIGN KEY(cue_id_ivari)
REFERENCES Cuenta (cue_id)
;
-- FK_FacturaVentaItem_CuentaIvaRI
;
/****** Object:  foreignKey FK_FacturaVentaItem_CuentaIvaRNI    Script Date: 07/30/2012 17:12:25 ******/
alter table FacturaVentaItem  ADD  CONSTRAINT FK_FacturaVentaItem_CuentaIvaRNI forEIGN KEY(cue_id_ivarni)
REFERENCES Cuenta (cue_id)
;
-- FK_FacturaVentaItem_CuentaIvaRNI
;
/****** Object:  foreignKey FK_FacturaVentaItem_FacturaVenta    Script Date: 07/30/2012 17:12:25 ******/
alter table FacturaVentaItem  ADD  CONSTRAINT FK_FacturaVentaItem_FacturaVenta forEIGN KEY(fv_id)
REFERENCES FacturaVenta (fv_id)
;
-- FK_FacturaVentaItem_FacturaVenta
;
/****** Object:  foreignKey FK_FacturaVentaItem_Producto    Script Date: 07/30/2012 17:12:25 ******/
alter table FacturaVentaItem  ADD  CONSTRAINT FK_FacturaVentaItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_FacturaVentaItem_Producto
;
/****** Object:  foreignKey FK_FacturaVentaItem_StockLote    Script Date: 07/30/2012 17:12:25 ******/
alter table FacturaVentaItem  ADD  CONSTRAINT FK_FacturaVentaItem_StockLote forEIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_FacturaVentaItem_StockLote
;
/****** Object:  foreignKey FK_FacturaVentaItem_TipoOperacion    Script Date: 07/30/2012 17:12:25 ******/
alter table FacturaVentaItem  ADD  CONSTRAINT FK_FacturaVentaItem_TipoOperacion forEIGN KEY(to_id)
REFERENCES TipoOperacion (to_id)
;
-- FK_FacturaVentaItem_TipoOperacion
;
/****** Object:  foreignKey FK_FacturaVentaItemBorradoTMP_FacturaVentaTMP    Script Date: 07/30/2012 17:12:26 ******/
alter table FacturaVentaItemBorradoTMP  ADD  CONSTRAINT FK_FacturaVentaItemBorradoTMP_FacturaVentaTMP forEIGN KEY(fvTMP_id)
REFERENCES FacturaVentaTMP (fvTMP_id)
;
-- FK_FacturaVentaItemBorradoTMP_FacturaVentaTMP
;
/****** Object:  foreignKey FK_FacturaVentaItemSerieTMP_FacturaVentaItemTMP    Script Date: 07/30/2012 17:12:29 ******/
alter table FacturaVentaItemSerieTMP  ADD  CONSTRAINT FK_FacturaVentaItemSerieTMP_FacturaVentaItemTMP forEIGN KEY(fviTMP_id)
REFERENCES FacturaVentaItemTMP (fviTMP_id)
;
-- FK_FacturaVentaItemSerieTMP_FacturaVentaItemTMP
;
/****** Object:  foreignKey FK_FacturaVentaItemSerieTMP_FacturaVentaTMP    Script Date: 07/30/2012 17:12:29 ******/
alter table FacturaVentaItemSerieTMP  ADD  CONSTRAINT FK_FacturaVentaItemSerieTMP_FacturaVentaTMP forEIGN KEY(fvTMP_id)
REFERENCES FacturaVentaTMP (fvTMP_id)
;
-- FK_FacturaVentaItemSerieTMP_FacturaVentaTMP
;
/****** Object:  foreignKey FK_FacturaVentaItemTMP_FacturaVentaTMP    Script Date: 07/30/2012 17:12:35 ******/
alter table FacturaVentaItemTMP  ADD  CONSTRAINT FK_FacturaVentaItemTMP_FacturaVentaTMP forEIGN KEY(fvTMP_id)
REFERENCES FacturaVentaTMP (fvTMP_id)
;
-- FK_FacturaVentaItemTMP_FacturaVentaTMP
;
/****** Object:  foreignKey FK_FacturaVentaNotaCredito_DeudaFactura    Script Date: 07/30/2012 17:12:37 ******/
alter table FacturaVentaNotaCredito  ADD  CONSTRAINT FK_FacturaVentaNotaCredito_DeudaFactura forEIGN KEY(fvd_id_factura)
REFERENCES FacturaVentaDeuda (fvd_id)
;
-- FK_FacturaVentaNotaCredito_DeudaFactura
;
/****** Object:  foreignKey FK_FacturaVentaNotaCredito_DeudaNotaCredito    Script Date: 07/30/2012 17:12:37 ******/
alter table FacturaVentaNotaCredito  ADD  CONSTRAINT FK_FacturaVentaNotaCredito_DeudaNotaCredito forEIGN KEY(fvd_id_notacredito)
REFERENCES FacturaVentaDeuda (fvd_id)
;
-- FK_FacturaVentaNotaCredito_DeudaNotaCredito
;
/****** Object:  foreignKey FK_FacturaVentaNotaCredito_FacturaVenta    Script Date: 07/30/2012 17:12:37 ******/
alter table FacturaVentaNotaCredito  ADD  CONSTRAINT FK_FacturaVentaNotaCredito_FacturaVenta forEIGN KEY(fv_id_factura)
REFERENCES FacturaVenta (fv_id)
;
-- FK_FacturaVentaNotaCredito_FacturaVenta
;
/****** Object:  foreignKey FK_FacturaVentaNotaCredito_NotaCredito    Script Date: 07/30/2012 17:12:37 ******/
alter table FacturaVentaNotaCredito  ADD  CONSTRAINT FK_FacturaVentaNotaCredito_NotaCredito forEIGN KEY(fv_id_notacredito)
REFERENCES FacturaVenta (fv_id)
;
-- FK_FacturaVentaNotaCredito_NotaCredito
;
/****** Object:  foreignKey FK_FacturaVentaNotaCredito_PagoFactura    Script Date: 07/30/2012 17:12:38 ******/
alter table FacturaVentaNotaCredito  ADD  CONSTRAINT FK_FacturaVentaNotaCredito_PagoFactura forEIGN KEY(fvp_id_factura)
REFERENCES FacturaVentaPago (fvp_id)
;
-- FK_FacturaVentaNotaCredito_PagoFactura
;
/****** Object:  foreignKey FK_FacturaVentaNotaCredito_PagoNotaCredito    Script Date: 07/30/2012 17:12:38 ******/
alter table FacturaVentaNotaCredito  ADD  CONSTRAINT FK_FacturaVentaNotaCredito_PagoNotaCredito forEIGN KEY(fvp_id_notacredito)
REFERENCES FacturaVentaPago (fvp_id)
;
-- FK_FacturaVentaNotaCredito_PagoNotaCredito
;
/****** Object:  foreignKey FK_FacturaVentaPago_FacturaVenta    Script Date: 07/30/2012 17:12:41 ******/
alter table FacturaVentaPago  ADD  CONSTRAINT FK_FacturaVentaPago_FacturaVenta forEIGN KEY(fv_id)
REFERENCES FacturaVenta (fv_id)
;
-- FK_FacturaVentaPago_FacturaVenta
;
/****** Object:  foreignKey FK_FacturaVentaPercepcion_CentroCosto    Script Date: 07/30/2012 17:12:43 ******/
alter table FacturaVentaPercepcion  ADD  CONSTRAINT FK_FacturaVentaPercepcion_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_FacturaVentaPercepcion_CentroCosto
;
/****** Object:  foreignKey FK_FacturaVentaPercepcion_FacturaVenta    Script Date: 07/30/2012 17:12:43 ******/
alter table FacturaVentaPercepcion  ADD  CONSTRAINT FK_FacturaVentaPercepcion_FacturaVenta forEIGN KEY(fv_id)
REFERENCES FacturaVenta (fv_id)
;
-- FK_FacturaVentaPercepcion_FacturaVenta
;
/****** Object:  foreignKey FK_FacturaVentaPercepcionBorradoTMP_FacturaVentaTMP    Script Date: 07/30/2012 17:12:44 ******/
alter table FacturaVentaPercepcionBorradoTMP  ADD  CONSTRAINT FK_FacturaVentaPercepcionBorradoTMP_FacturaVentaTMP forEIGN KEY(fvTMP_id)
REFERENCES FacturaVentaTMP (fvTMP_id)
;
-- FK_FacturaVentaPercepcionBorradoTMP_FacturaVentaTMP
;
/****** Object:  foreignKey FK_Feriado_Pais    Script Date: 07/30/2012 17:13:03 ******/
alter table Feriado  ADD  CONSTRAINT FK_Feriado_Pais forEIGN KEY(pa_id)
REFERENCES Pais (pa_id)
;
-- FK_Feriado_Pais
;
/****** Object:  foreignKey FK_Feriado_Provincia    Script Date: 07/30/2012 17:13:03 ******/
alter table Feriado  ADD  CONSTRAINT FK_Feriado_Provincia forEIGN KEY(pro_id)
REFERENCES Provincia (pro_id)
;
-- FK_Feriado_Provincia
;
/****** Object:  foreignKey FK_FeriadoItem_Feriado    Script Date: 07/30/2012 17:13:04 ******/
alter table FeriadoItem  ADD  CONSTRAINT FK_FeriadoItem_Feriado forEIGN KEY(fe_id)
REFERENCES Feriado (fe_id)
;
-- FK_FeriadoItem_Feriado
;
/****** Object:  foreignKey FK_Garantia_Moneda    Script Date: 07/30/2012 17:13:13 ******/
alter table Garantia  ADD  CONSTRAINT FK_Garantia_Moneda forEIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_Garantia_Moneda
;
/****** Object:  foreignKey FK_Garantia_Proveedor    Script Date: 07/30/2012 17:13:13 ******/
alter table Garantia  ADD  CONSTRAINT FK_Garantia_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_Garantia_Proveedor
;
/****** Object:  foreignKey FK_Gasto_Moneda    Script Date: 07/30/2012 17:13:16 ******/
alter table Gasto  ADD  CONSTRAINT FK_Gasto_Moneda forEIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_Gasto_Moneda
;
/****** Object:  foreignKey FK_Gasto_TasaImpositiva    Script Date: 07/30/2012 17:13:16 ******/
alter table Gasto  ADD  CONSTRAINT FK_Gasto_TasaImpositiva forEIGN KEY(ti_id)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_Gasto_TasaImpositiva
;
/****** Object:  foreignKey FK_Gasto_Usuario    Script Date: 07/30/2012 17:13:16 ******/
alter table Gasto  ADD  CONSTRAINT FK_Gasto_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Gasto_Usuario
;
/****** Object:  foreignKey FK_GridView_Reporte    Script Date: 07/30/2012 17:13:18 ******/
alter table GridView  ADD  CONSTRAINT FK_GridView_Reporte forEIGN KEY(rpt_id)
REFERENCES Reporte (rpt_id)
;
-- FK_GridView_Reporte
;
/****** Object:  foreignKey FK_GridView_Usuario    Script Date: 07/30/2012 17:13:18 ******/
alter table GridView  ADD  CONSTRAINT FK_GridView_Usuario forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_GridView_Usuario
;
/****** Object:  foreignKey FK_GridViewColumn_GridView    Script Date: 07/30/2012 17:13:20 ******/
alter table GridViewColumn  ADD  CONSTRAINT FK_GridViewColumn_GridView forEIGN KEY(grdv_id)
REFERENCES GridView (grdv_id)
;
-- FK_GridViewColumn_GridView
;
/****** Object:  foreignKey FK_GridViewFiltro_GridView    Script Date: 07/30/2012 17:13:21 ******/
alter table GridViewFiltro  ADD  CONSTRAINT FK_GridViewFiltro_GridView forEIGN KEY(grdv_id)
REFERENCES GridView (grdv_id)
;
-- FK_GridViewFiltro_GridView
;
/****** Object:  foreignKey FK_GridViewFormato_GridView    Script Date: 07/30/2012 17:13:23 ******/
alter table GridViewFormato  ADD  CONSTRAINT FK_GridViewFormato_GridView forEIGN KEY(grdv_id)
REFERENCES GridView (grdv_id)
;
-- FK_GridViewFormato_GridView
;
/****** Object:  foreignKey FK_GridViewFormula_GridView    Script Date: 07/30/2012 17:13:24 ******/
alter table GridViewFormula  ADD  CONSTRAINT FK_GridViewFormula_GridView forEIGN KEY(grdv_id)
REFERENCES GridView (grdv_id)
;
-- FK_GridViewFormula_GridView
;
/****** Object:  foreignKey FK_GridViewGrupo_GridView    Script Date: 07/30/2012 17:13:26 ******/
alter table GridViewGrupo  ADD  CONSTRAINT FK_GridViewGrupo_GridView forEIGN KEY(grdv_id)
REFERENCES GridView (grdv_id)
;
-- FK_GridViewGrupo_GridView
;
/****** Object:  foreignKey FK_Historia_Tabla    Script Date: 07/30/2012 17:13:27 ******/
alter table Historia  ADD  CONSTRAINT FK_Historia_Tabla forEIGN KEY(tbl_id)
REFERENCES Tabla (tbl_id)
;
-- FK_Historia_Tabla
;
/****** Object:  foreignKey FK_Historia_Usuario    Script Date: 07/30/2012 17:13:27 ******/
alter table Historia  ADD  CONSTRAINT FK_Historia_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Historia_Usuario
;
/****** Object:  foreignKey FK_Hoja_Arbol    Script Date: 07/30/2012 17:13:30 ******/
alter table Hoja  ADD  CONSTRAINT FK_Hoja_Arbol forEIGN KEY(arb_id)
REFERENCES Arbol (arb_id)
;
-- FK_Hoja_Arbol
;
/****** Object:  foreignKey FK_Hoja_Rama    Script Date: 07/30/2012 17:13:30 ******/
alter table Hoja  ADD  CONSTRAINT FK_Hoja_Rama forEIGN KEY(ram_id)
REFERENCES Rama (ram_id)
;
-- FK_Hoja_Rama
;
/****** Object:  foreignKey FK_Hoja_Usuario    Script Date: 07/30/2012 17:13:30 ******/
alter table Hoja  ADD  CONSTRAINT FK_Hoja_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Hoja_Usuario
;
/****** Object:  foreignKey FK_HojaRuta_Camion    Script Date: 07/30/2012 17:13:37 ******/
alter table HojaRuta  ADD  CONSTRAINT FK_HojaRuta_Camion forEIGN KEY(cam_id)
REFERENCES Camion (cam_id)
;
-- FK_HojaRuta_Camion
;
/****** Object:  foreignKey FK_HojaRuta_Camion1    Script Date: 07/30/2012 17:13:37 ******/
alter table HojaRuta  ADD  CONSTRAINT FK_HojaRuta_Camion1 forEIGN KEY(cam_id_semi)
REFERENCES Camion (cam_id)
;
-- FK_HojaRuta_Camion1
;
/****** Object:  foreignKey FK_HojaRuta_Chofer    Script Date: 07/30/2012 17:13:37 ******/
alter table HojaRuta  ADD  CONSTRAINT FK_HojaRuta_Chofer forEIGN KEY(chof_id)
REFERENCES Chofer (chof_id)
;
-- FK_HojaRuta_Chofer
;
/****** Object:  foreignKey FK_HojaRuta_Estado    Script Date: 07/30/2012 17:13:38 ******/
alter table HojaRuta  ADD  CONSTRAINT FK_HojaRuta_Estado forEIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_HojaRuta_Estado
;
/****** Object:  foreignKey FK_HojaRuta_FacturaVenta    Script Date: 07/30/2012 17:13:38 ******/
alter table HojaRuta  ADD  CONSTRAINT FK_HojaRuta_FacturaVenta forEIGN KEY(fv_id_faltante)
REFERENCES FacturaVenta (fv_id)
;
-- FK_HojaRuta_FacturaVenta
;
/****** Object:  foreignKey FK_HojaRuta_MovimientoFondo    Script Date: 07/30/2012 17:13:38 ******/
alter table HojaRuta  ADD  CONSTRAINT FK_HojaRuta_MovimientoFondo forEIGN KEY(mf_id_tickets)
REFERENCES MovimientoFondo (mf_id)
;
-- FK_HojaRuta_MovimientoFondo
;
/****** Object:  foreignKey FK_HojaRuta_MovimientoFondoSobrante    Script Date: 07/30/2012 17:13:38 ******/
alter table HojaRuta  ADD  CONSTRAINT FK_HojaRuta_MovimientoFondoSobrante forEIGN KEY(mf_id_sobrante)
REFERENCES MovimientoFondo (mf_id)
;
-- FK_HojaRuta_MovimientoFondoSobrante
;
/****** Object:  foreignKey FK_HojaRuta_Sucursal    Script Date: 07/30/2012 17:13:38 ******/
alter table HojaRuta  ADD  CONSTRAINT FK_HojaRuta_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_HojaRuta_Sucursal
;
/****** Object:  foreignKey FK_HojaRutaItem_FacturaVenta    Script Date: 07/30/2012 17:13:44 ******/
alter table HojaRutaItem  ADD  CONSTRAINT FK_HojaRutaItem_FacturaVenta forEIGN KEY(fv_id)
REFERENCES FacturaVenta (fv_id)
;
-- FK_HojaRutaItem_FacturaVenta
;
/****** Object:  foreignKey FK_HojaRutaItem_HojaRuta    Script Date: 07/30/2012 17:13:44 ******/
alter table HojaRutaItem  ADD  CONSTRAINT FK_HojaRutaItem_HojaRuta forEIGN KEY(hr_id)
REFERENCES HojaRuta (hr_id)
;
-- FK_HojaRutaItem_HojaRuta
;
/****** Object:  foreignKey FK_HojaRutaItem_HojaRutaCobranzaTipo    Script Date: 07/30/2012 17:13:44 ******/
alter table HojaRutaItem  ADD  CONSTRAINT FK_HojaRutaItem_HojaRutaCobranzaTipo forEIGN KEY(hrct_id)
REFERENCES HojaRutaCobranzaTipo (hrct_id)
;
-- FK_HojaRutaItem_HojaRutaCobranzaTipo
;
/****** Object:  foreignKey FK_HojaRutaItem_OrdenServicio    Script Date: 07/30/2012 17:13:44 ******/
alter table HojaRutaItem  ADD  CONSTRAINT FK_HojaRutaItem_OrdenServicio forEIGN KEY(os_id)
REFERENCES OrdenServicio (os_id)
;
-- FK_HojaRutaItem_OrdenServicio
;
/****** Object:  foreignKey FK_HojaRutaItem_ParteDiario    Script Date: 07/30/2012 17:13:44 ******/
alter table HojaRutaItem  ADD  CONSTRAINT FK_HojaRutaItem_ParteDiario forEIGN KEY(ptd_id)
REFERENCES ParteDiario (ptd_id)
;
-- FK_HojaRutaItem_ParteDiario
;
/****** Object:  foreignKey FK_HojaRutaItem_RemitoVenta    Script Date: 07/30/2012 17:13:44 ******/
alter table HojaRutaItem  ADD  CONSTRAINT FK_HojaRutaItem_RemitoVenta forEIGN KEY(rv_id)
REFERENCES RemitoVenta (rv_id)
;
-- FK_HojaRutaItem_RemitoVenta
;
/****** Object:  foreignKey FK_Hora_Cliente    Script Date: 07/30/2012 17:13:48 ******/
alter table Hora  ADD  CONSTRAINT FK_Hora_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_Hora_Cliente
;
/****** Object:  foreignKey FK_Hora_Objetivo    Script Date: 07/30/2012 17:13:48 ******/
alter table Hora  ADD  CONSTRAINT FK_Hora_Objetivo forEIGN KEY(obje_id)
REFERENCES Objetivo (obje_id)
;
-- FK_Hora_Objetivo
;
/****** Object:  foreignKey FK_Hora_Proyecto    Script Date: 07/30/2012 17:13:48 ******/
alter table Hora  ADD  CONSTRAINT FK_Hora_Proyecto forEIGN KEY(proy_id)
REFERENCES Proyecto (proy_id)
;
-- FK_Hora_Proyecto
;
/****** Object:  foreignKey FK_Hora_ProyectoItem    Script Date: 07/30/2012 17:13:48 ******/
alter table Hora  ADD  CONSTRAINT FK_Hora_ProyectoItem forEIGN KEY(proyi_id)
REFERENCES ProyectoItem (proyi_id)
;
-- FK_Hora_ProyectoItem
;
/****** Object:  foreignKey FK_Hora_Tarea    Script Date: 07/30/2012 17:13:48 ******/
alter table Hora  ADD  CONSTRAINT FK_Hora_Tarea forEIGN KEY(tar_id)
REFERENCES Tarea (tar_id)
;
-- FK_Hora_Tarea
;
/****** Object:  foreignKey FK_Hora_Usuario    Script Date: 07/30/2012 17:13:49 ******/
alter table Hora  ADD  CONSTRAINT FK_Hora_Usuario forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_Hora_Usuario
;
/****** Object:  foreignKey FK_HoraFacturaVenta_FacturaVentaItem    Script Date: 07/30/2012 17:13:50 ******/
alter table HoraFacturaVenta  ADD  CONSTRAINT FK_HoraFacturaVenta_FacturaVentaItem forEIGN KEY(fvi_id)
REFERENCES FacturaVentaItem (fvi_id)
;
-- FK_HoraFacturaVenta_FacturaVentaItem
;
/****** Object:  foreignKey FK_HoraFacturaVenta_Hora    Script Date: 07/30/2012 17:13:50 ******/
alter table HoraFacturaVenta  ADD  CONSTRAINT FK_HoraFacturaVenta_Hora forEIGN KEY(hora_id)
REFERENCES Hora (hora_id)
;
-- FK_HoraFacturaVenta_Hora
;
/****** Object:  foreignKey FK_Idioma_Usuario    Script Date: 07/30/2012 17:13:55 ******/
alter table Idioma  ADD  CONSTRAINT FK_Idioma_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Idioma_Usuario
;
/****** Object:  foreignKey FK_Importacion_Usuario    Script Date: 07/30/2012 17:13:58 ******/
alter table Importacion  ADD  CONSTRAINT FK_Importacion_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Importacion_Usuario
;
/****** Object:  foreignKey FK_ImportacionID_ImportacionIDTipo    Script Date: 07/30/2012 17:14:00 ******/
alter table ImportacionID  ADD  CONSTRAINT FK_ImportacionID_ImportacionIDTipo forEIGN KEY(impidt_id)
REFERENCES ImportacionIDTipo (impidt_id)
;
-- FK_ImportacionID_ImportacionIDTipo
;
/****** Object:  foreignKey FK_ImportacionID_Usuario    Script Date: 07/30/2012 17:14:00 ******/
alter table ImportacionID  ADD  CONSTRAINT FK_ImportacionID_Usuario forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_ImportacionID_Usuario
;
/****** Object:  foreignKey FK_ImportacionItem_Importacion    Script Date: 07/30/2012 17:14:02 ******/
alter table ImportacionItem  ADD  CONSTRAINT FK_ImportacionItem_Importacion forEIGN KEY(imp_id)
REFERENCES Importacion (imp_id)
;
-- FK_ImportacionItem_Importacion
;
/****** Object:  foreignKey FK_ImportacionItem_Usuario    Script Date: 07/30/2012 17:14:02 ******/
alter table ImportacionItem  ADD  CONSTRAINT FK_ImportacionItem_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ImportacionItem_Usuario
;
/****** Object:  foreignKey FK_ImportacionLog_ImportacionProceso    Script Date: 07/30/2012 17:14:04 ******/
alter table ImportacionLog  ADD  CONSTRAINT FK_ImportacionLog_ImportacionProceso forEIGN KEY(impp_id)
REFERENCES ImportacionProceso (impp_id)
;
-- FK_ImportacionLog_ImportacionProceso
;
/****** Object:  foreignKey FK_ImportacionProceso_Usuario    Script Date: 07/30/2012 17:14:06 ******/
alter table ImportacionProceso  ADD  CONSTRAINT FK_ImportacionProceso_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ImportacionProceso_Usuario
;
/****** Object:  foreignKey FK_ImportacionProcesoItem_ImportacionProceso    Script Date: 07/30/2012 17:14:08 ******/
alter table ImportacionProcesoItem  ADD  CONSTRAINT FK_ImportacionProcesoItem_ImportacionProceso forEIGN KEY(impp_id)
REFERENCES ImportacionProceso (impp_id)
;
-- FK_ImportacionProcesoItem_ImportacionProceso
;
/****** Object:  foreignKey FK_ImportacionProcesoItem_Usuario    Script Date: 07/30/2012 17:14:08 ******/
alter table ImportacionProcesoItem  ADD  CONSTRAINT FK_ImportacionProcesoItem_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ImportacionProcesoItem_Usuario
;
/****** Object:  foreignKey FK_ImportacionTemp_CentroCosto    Script Date: 07/30/2012 17:14:16 ******/
alter table ImportacionTemp  ADD  CONSTRAINT FK_ImportacionTemp_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_ImportacionTemp_CentroCosto
;
/****** Object:  foreignKey FK_ImportacionTemp_CondicionPago    Script Date: 07/30/2012 17:14:16 ******/
alter table ImportacionTemp  ADD  CONSTRAINT FK_ImportacionTemp_CondicionPago forEIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_ImportacionTemp_CondicionPago
;
/****** Object:  foreignKey FK_ImportacionTemp_Documento    Script Date: 07/30/2012 17:14:16 ******/
alter table ImportacionTemp  ADD  CONSTRAINT FK_ImportacionTemp_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_ImportacionTemp_Documento
;
/****** Object:  foreignKey FK_ImportacionTemp_DocumentoTipo    Script Date: 07/30/2012 17:14:16 ******/
alter table ImportacionTemp  ADD  CONSTRAINT FK_ImportacionTemp_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_ImportacionTemp_DocumentoTipo
;
/****** Object:  foreignKey FK_ImportacionTemp_Estado    Script Date: 07/30/2012 17:14:16 ******/
alter table ImportacionTemp  ADD  CONSTRAINT FK_ImportacionTemp_Estado forEIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_ImportacionTemp_Estado
;
/****** Object:  foreignKey FK_ImportacionTemp_ListaDescuento    Script Date: 07/30/2012 17:14:16 ******/
alter table ImportacionTemp  ADD  CONSTRAINT FK_ImportacionTemp_ListaDescuento forEIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_ImportacionTemp_ListaDescuento
;
/****** Object:  foreignKey FK_ImportacionTemp_ListaPrecio    Script Date: 07/30/2012 17:14:16 ******/
alter table ImportacionTemp  ADD  CONSTRAINT FK_ImportacionTemp_ListaPrecio forEIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_ImportacionTemp_ListaPrecio
;
/****** Object:  foreignKey FK_ImportacionTemp_Proveedor    Script Date: 07/30/2012 17:14:16 ******/
alter table ImportacionTemp  ADD  CONSTRAINT FK_ImportacionTemp_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_ImportacionTemp_Proveedor
;
/****** Object:  foreignKey FK_ImportacionTemp_Stock    Script Date: 07/30/2012 17:14:16 ******/
alter table ImportacionTemp  ADD  CONSTRAINT FK_ImportacionTemp_Stock forEIGN KEY(st_id)
REFERENCES Stock (st_id)
;
-- FK_ImportacionTemp_Stock
;
/****** Object:  foreignKey FK_ImportacionTemp_Sucursal    Script Date: 07/30/2012 17:14:17 ******/
alter table ImportacionTemp  ADD  CONSTRAINT FK_ImportacionTemp_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_ImportacionTemp_Sucursal
;
/****** Object:  foreignKey FK_ImportacionTempGarantia_Garantia    Script Date: 07/30/2012 17:14:18 ******/
alter table ImportacionTempGarantia  ADD  CONSTRAINT FK_ImportacionTempGarantia_Garantia forEIGN KEY(gar_id)
REFERENCES Garantia (gar_id)
;
-- FK_ImportacionTempGarantia_Garantia
;
/****** Object:  foreignKey FK_ImportacionTempGarantia_ImportacionTemp    Script Date: 07/30/2012 17:14:18 ******/
alter table ImportacionTempGarantia  ADD  CONSTRAINT FK_ImportacionTempGarantia_ImportacionTemp forEIGN KEY(impt_id)
REFERENCES ImportacionTemp (impt_id)
;
-- FK_ImportacionTempGarantia_ImportacionTemp
;
/****** Object:  foreignKey FK_ImportacionTempGarantiaTMP_ImportacionTempTMP    Script Date: 07/30/2012 17:14:19 ******/
alter table ImportacionTempGarantiaTMP  ADD  CONSTRAINT FK_ImportacionTempGarantiaTMP_ImportacionTempTMP forEIGN KEY(imptTMP_id)
REFERENCES ImportacionTempTMP (imptTMP_id)
;
-- FK_ImportacionTempGarantiaTMP_ImportacionTempTMP
;
/****** Object:  foreignKey FK_ImportacionTempItem_CentroCosto    Script Date: 07/30/2012 17:14:24 ******/
alter table ImportacionTempItem  ADD  CONSTRAINT FK_ImportacionTempItem_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_ImportacionTempItem_CentroCosto
;
/****** Object:  foreignKey FK_ImportacionTempItem_ImportacionTemp    Script Date: 07/30/2012 17:14:24 ******/
alter table ImportacionTempItem  ADD  CONSTRAINT FK_ImportacionTempItem_ImportacionTemp forEIGN KEY(impt_id)
REFERENCES ImportacionTemp (impt_id)
;
-- FK_ImportacionTempItem_ImportacionTemp
;
/****** Object:  foreignKey FK_ImportacionTempItem_Producto    Script Date: 07/30/2012 17:14:24 ******/
alter table ImportacionTempItem  ADD  CONSTRAINT FK_ImportacionTempItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ImportacionTempItem_Producto
;
/****** Object:  foreignKey FK_ImportacionTempItem_StockLote    Script Date: 07/30/2012 17:14:24 ******/
alter table ImportacionTempItem  ADD  CONSTRAINT FK_ImportacionTempItem_StockLote forEIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_ImportacionTempItem_StockLote
;
/****** Object:  foreignKey FK_ImportacionTempItemBorradoTMP_ImportacionTempTMP    Script Date: 07/30/2012 17:14:25 ******/
alter table ImportacionTempItemBorradoTMP  ADD  CONSTRAINT FK_ImportacionTempItemBorradoTMP_ImportacionTempTMP forEIGN KEY(imptTMP_id)
REFERENCES ImportacionTempTMP (imptTMP_id)
;
-- FK_ImportacionTempItemBorradoTMP_ImportacionTempTMP
;
/****** Object:  foreignKey FK_ImportacionTempItemSerieTMP_ImportacionTempItemTMP    Script Date: 07/30/2012 17:14:27 ******/
alter table ImportacionTempItemSerieTMP  ADD  CONSTRAINT FK_ImportacionTempItemSerieTMP_ImportacionTempItemTMP forEIGN KEY(imptiTMP_id)
REFERENCES ImportacionTempItemTMP (imptiTMP_id)
;
-- FK_ImportacionTempItemSerieTMP_ImportacionTempItemTMP
;
/****** Object:  foreignKey FK_ImportacionTempItemSerieTMP_ImportacionTempTMP    Script Date: 07/30/2012 17:14:28 ******/
alter table ImportacionTempItemSerieTMP  ADD  CONSTRAINT FK_ImportacionTempItemSerieTMP_ImportacionTempTMP forEIGN KEY(imptTMP_id)
REFERENCES ImportacionTempTMP (imptTMP_id)
;
-- FK_ImportacionTempItemSerieTMP_ImportacionTempTMP
;
/****** Object:  foreignKey FK_ImportacionTempItemTMP_ImportacionTempTMP    Script Date: 07/30/2012 17:14:32 ******/
alter table ImportacionTempItemTMP  ADD  CONSTRAINT FK_ImportacionTempItemTMP_ImportacionTempTMP forEIGN KEY(imptTMP_id)
REFERENCES ImportacionTempTMP (imptTMP_id)
;
-- FK_ImportacionTempItemTMP_ImportacionTempTMP
;
/****** Object:  foreignKey FK_Informe_Prestacion    Script Date: 07/30/2012 17:14:46 ******/
alter table Informe  ADD  CONSTRAINT FK_Informe_Prestacion forEIGN KEY(pre_id)
REFERENCES Prestacion (pre_id)
;
-- FK_Informe_Prestacion
;
/****** Object:  foreignKey FK_Informe_Usuario    Script Date: 07/30/2012 17:14:46 ******/
alter table Informe  ADD  CONSTRAINT FK_Informe_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Informe_Usuario
;
/****** Object:  foreignKey FK_InformeHiperlinks_Informe    Script Date: 07/30/2012 17:14:49 ******/
alter table InformeHiperlinks  ADD  CONSTRAINT FK_InformeHiperlinks_Informe forEIGN KEY(inf_id)
REFERENCES Informe (inf_id)
;
-- FK_InformeHiperlinks_Informe
;
/****** Object:  foreignKey FK_InformeParametro_Informe    Script Date: 07/30/2012 17:14:53 ******/
alter table InformeParametro  ADD  CONSTRAINT FK_InformeParametro_Informe forEIGN KEY(inf_id)
REFERENCES Informe (inf_id)
;
-- FK_InformeParametro_Informe
;
/****** Object:  foreignKey FK_InformeParametro_Usuario    Script Date: 07/30/2012 17:14:53 ******/
alter table InformeParametro  ADD  CONSTRAINT FK_InformeParametro_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_InformeParametro_Usuario
;
/****** Object:  foreignKey FK_InformeSumaries_Informe    Script Date: 07/30/2012 17:14:55 ******/
alter table InformeSumaries  ADD  CONSTRAINT FK_InformeSumaries_Informe forEIGN KEY(inf_id)
REFERENCES Informe (inf_id)
;
-- FK_InformeSumaries_Informe
;
/****** Object:  foreignKey FK_IngresosBrutosCategoria_Usuario    Script Date: 07/30/2012 17:14:57 ******/
alter table IngresosBrutosCategoria  ADD  CONSTRAINT FK_IngresosBrutosCategoria_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_IngresosBrutosCategoria_Usuario
;
/****** Object:  foreignKey FK_Legajo_Barco    Script Date: 07/30/2012 17:15:04 ******/
alter table Legajo  ADD  CONSTRAINT FK_Legajo_Barco forEIGN KEY(barc_id)
REFERENCES Barco (barc_id)
;
-- FK_Legajo_Barco
;
/****** Object:  foreignKey FK_Legajo_Cliente    Script Date: 07/30/2012 17:15:04 ******/
alter table Legajo  ADD  CONSTRAINT FK_Legajo_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_Legajo_Cliente
;
/****** Object:  foreignKey FK_Legajo_Estado    Script Date: 07/30/2012 17:15:04 ******/
alter table Legajo  ADD  CONSTRAINT FK_Legajo_Estado forEIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_Legajo_Estado
;
/****** Object:  foreignKey FK_Legajo_LegajoTipo    Script Date: 07/30/2012 17:15:04 ******/
alter table Legajo  ADD  CONSTRAINT FK_Legajo_LegajoTipo forEIGN KEY(lgjt_id)
REFERENCES LegajoTipo (lgjt_id)
;
-- FK_Legajo_LegajoTipo
;
/****** Object:  foreignKey FK_Legajo_Moneda    Script Date: 07/30/2012 17:15:04 ******/
alter table Legajo  ADD  CONSTRAINT FK_Legajo_Moneda forEIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_Legajo_Moneda
;
/****** Object:  foreignKey FK_Legajo_Puerto    Script Date: 07/30/2012 17:15:04 ******/
alter table Legajo  ADD  CONSTRAINT FK_Legajo_Puerto forEIGN KEY(pue_id)
REFERENCES Puerto (pue_id)
;
-- FK_Legajo_Puerto
;
/****** Object:  foreignKey FK_Legajo_Transporte    Script Date: 07/30/2012 17:15:04 ******/
alter table Legajo  ADD  CONSTRAINT FK_Legajo_Transporte forEIGN KEY(trans_id)
REFERENCES Transporte (trans_id)
;
-- FK_Legajo_Transporte
;
/****** Object:  foreignKey FK_Legajo_Vuelo    Script Date: 07/30/2012 17:15:04 ******/
alter table Legajo  ADD  CONSTRAINT FK_Legajo_Vuelo forEIGN KEY(vue_id)
REFERENCES Vuelo (vue_id)
;
-- FK_Legajo_Vuelo
;
/****** Object:  foreignKey FK_LegajoTipo_Usuario    Script Date: 07/30/2012 17:15:06 ******/
alter table LegajoTipo  ADD  CONSTRAINT FK_LegajoTipo_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_LegajoTipo_Usuario
;
/****** Object:  foreignKey FK_Lenguaje_Lenguaje    Script Date: 07/30/2012 17:15:08 ******/
alter table Lenguaje  ADD  CONSTRAINT FK_Lenguaje_Lenguaje forEIGN KEY(leng_id_padre)
REFERENCES Lenguaje (leng_id)
;
-- FK_Lenguaje_Lenguaje
;
/****** Object:  foreignKey FK_Lenguaje_Usuario    Script Date: 07/30/2012 17:15:08 ******/
alter table Lenguaje  ADD  CONSTRAINT FK_Lenguaje_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Lenguaje_Usuario
;
/****** Object:  foreignKey FK_LenguajeItem_Lenguaje    Script Date: 07/30/2012 17:15:10 ******/
alter table LenguajeItem  ADD  CONSTRAINT FK_LenguajeItem_Lenguaje forEIGN KEY(leng_id)
REFERENCES Lenguaje (leng_id)
;
-- FK_LenguajeItem_Lenguaje
;
/****** Object:  foreignKey FK_Leyenda_Idioma    Script Date: 07/30/2012 17:15:13 ******/
alter table Leyenda  ADD  CONSTRAINT FK_Leyenda_Idioma forEIGN KEY(idm_id)
REFERENCES Idioma (idm_id)
;
-- FK_Leyenda_Idioma
;
/****** Object:  foreignKey FK_Leyenda_Usuario    Script Date: 07/30/2012 17:15:13 ******/
alter table Leyenda  ADD  CONSTRAINT FK_Leyenda_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Leyenda_Usuario
;
/****** Object:  foreignKey FK_Liquidacion_Asiento    Script Date: 07/30/2012 17:15:19 ******/
alter table Liquidacion  ADD  CONSTRAINT FK_Liquidacion_Asiento forEIGN KEY(as_id)
REFERENCES Asiento (as_id)
;
-- FK_Liquidacion_Asiento
;
/****** Object:  foreignKey FK_Liquidacion_CentroCosto    Script Date: 07/30/2012 17:15:19 ******/
alter table Liquidacion  ADD  CONSTRAINT FK_Liquidacion_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_Liquidacion_CentroCosto
;
/****** Object:  foreignKey FK_Liquidacion_Documento    Script Date: 07/30/2012 17:15:19 ******/
alter table Liquidacion  ADD  CONSTRAINT FK_Liquidacion_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_Liquidacion_Documento
;
/****** Object:  foreignKey FK_Liquidacion_DocumentoTipo    Script Date: 07/30/2012 17:15:19 ******/
alter table Liquidacion  ADD  CONSTRAINT FK_Liquidacion_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_Liquidacion_DocumentoTipo
;
/****** Object:  foreignKey FK_Liquidacion_Estado    Script Date: 07/30/2012 17:15:19 ******/
alter table Liquidacion  ADD  CONSTRAINT FK_Liquidacion_Estado forEIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_Liquidacion_Estado
;
/****** Object:  foreignKey FK_Liquidacion_Legajo    Script Date: 07/30/2012 17:15:20 ******/
alter table Liquidacion  ADD  CONSTRAINT FK_Liquidacion_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_Liquidacion_Legajo
;
/****** Object:  foreignKey FK_Liquidacion_LiquidacionPlantilla    Script Date: 07/30/2012 17:15:20 ******/
alter table Liquidacion  ADD  CONSTRAINT FK_Liquidacion_LiquidacionPlantilla forEIGN KEY(liqp_id)
REFERENCES LiquidacionPlantilla (liqp_id)
;
-- FK_Liquidacion_LiquidacionPlantilla
;
/****** Object:  foreignKey FK_Liquidacion_Moneda    Script Date: 07/30/2012 17:15:20 ******/
alter table Liquidacion  ADD  CONSTRAINT FK_Liquidacion_Moneda forEIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_Liquidacion_Moneda
;
/****** Object:  foreignKey FK_Liquidacion_Sucursal    Script Date: 07/30/2012 17:15:20 ******/
alter table Liquidacion  ADD  CONSTRAINT FK_Liquidacion_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_Liquidacion_Sucursal
;
/****** Object:  foreignKey FK_Liquidacion_Usuario    Script Date: 07/30/2012 17:15:20 ******/
alter table Liquidacion  ADD  CONSTRAINT FK_Liquidacion_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Liquidacion_Usuario
;
/****** Object:  foreignKey FK_LiquidacionConceptoAdm_CentroCosto    Script Date: 07/30/2012 17:15:24 ******/
alter table LiquidacionConceptoAdm  ADD  CONSTRAINT FK_LiquidacionConceptoAdm_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_LiquidacionConceptoAdm_CentroCosto
;
/****** Object:  foreignKey FK_LiquidacionConceptoAdm_Liquidacion    Script Date: 07/30/2012 17:15:24 ******/
alter table LiquidacionConceptoAdm  ADD  CONSTRAINT FK_LiquidacionConceptoAdm_Liquidacion forEIGN KEY(liq_id)
REFERENCES Liquidacion (liq_id)
;
-- FK_LiquidacionConceptoAdm_Liquidacion
;
/****** Object:  foreignKey FK_LiquidacionConceptoAdm_LiquidacionFormulaItem    Script Date: 07/30/2012 17:15:24 ******/
alter table LiquidacionConceptoAdm  ADD  CONSTRAINT FK_LiquidacionConceptoAdm_LiquidacionFormulaItem forEIGN KEY(liqfi_id)
REFERENCES LiquidacionFormulaItem (liqfi_id)
;
-- FK_LiquidacionConceptoAdm_LiquidacionFormulaItem
;
/****** Object:  foreignKey FK_LiquidacionFormula_Usuario    Script Date: 07/30/2012 17:15:33 ******/
alter table LiquidacionFormula  ADD  CONSTRAINT FK_LiquidacionFormula_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_LiquidacionFormula_Usuario
;
/****** Object:  foreignKey FK_LiquidacionFormulaItem_LiquidacionCodigoTipo    Script Date: 07/30/2012 17:15:35 ******/
alter table LiquidacionFormulaItem  ADD  CONSTRAINT FK_LiquidacionFormulaItem_LiquidacionCodigoTipo forEIGN KEY(liqct_id)
REFERENCES LiquidacionCodigoTipo (liqct_id)
;
-- FK_LiquidacionFormulaItem_LiquidacionCodigoTipo
;
/****** Object:  foreignKey FK_LiquidacionFormulaItem_LiquidacionFormula    Script Date: 07/30/2012 17:15:35 ******/
alter table LiquidacionFormulaItem  ADD  CONSTRAINT FK_LiquidacionFormulaItem_LiquidacionFormula forEIGN KEY(liqf_id)
REFERENCES LiquidacionFormula (liqf_id)
;
-- FK_LiquidacionFormulaItem_LiquidacionFormula
;
/****** Object:  foreignKey FK_LiquidacionItemCodigo_Liquidacion    Script Date: 07/30/2012 17:15:40 ******/
alter table LiquidacionItemCodigo  ADD  CONSTRAINT FK_LiquidacionItemCodigo_Liquidacion forEIGN KEY(liq_id)
REFERENCES Liquidacion (liq_id)
;
-- FK_LiquidacionItemCodigo_Liquidacion
;
/****** Object:  foreignKey FK_LiquidacionItemCodigo_LiquidacionFormulaItem    Script Date: 07/30/2012 17:15:40 ******/
alter table LiquidacionItemCodigo  ADD  CONSTRAINT FK_LiquidacionItemCodigo_LiquidacionFormulaItem forEIGN KEY(liqfi_id)
REFERENCES LiquidacionFormulaItem (liqfi_id)
;
-- FK_LiquidacionItemCodigo_LiquidacionFormulaItem
;
/****** Object:  foreignKey FK_LiquidacionItemCodigo_LiquidacionItem    Script Date: 07/30/2012 17:15:40 ******/
alter table LiquidacionItemCodigo  ADD  CONSTRAINT FK_LiquidacionItemCodigo_LiquidacionItem forEIGN KEY(liqi_id)
REFERENCES LiquidacionItem (liqi_id)
;
-- FK_LiquidacionItemCodigo_LiquidacionItem
;
/****** Object:  foreignKey FK_PlantillaLiquidacion_Usuario    Script Date: 07/30/2012 17:15:46 ******/
alter table LiquidacionPlantilla  ADD  CONSTRAINT FK_PlantillaLiquidacion_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_PlantillaLiquidacion_Usuario
;
/****** Object:  foreignKey FK_LiquidacionPlantillaItem_LiquidacionPlantilla    Script Date: 07/30/2012 17:15:47 ******/
alter table LiquidacionPlantillaItem  ADD  CONSTRAINT FK_LiquidacionPlantillaItem_LiquidacionPlantilla forEIGN KEY(liqp_id)
REFERENCES LiquidacionPlantilla (liqp_id)
;
-- FK_LiquidacionPlantillaItem_LiquidacionPlantilla
;
/****** Object:  foreignKey FK_ListaDescuento_ListaDescuento    Script Date: 07/30/2012 17:15:56 ******/
alter table ListaDescuento  ADD  CONSTRAINT FK_ListaDescuento_ListaDescuento forEIGN KEY(ld_id_padre)
REFERENCES ListaDescuento (ld_id)
;
-- FK_ListaDescuento_ListaDescuento
;
/****** Object:  foreignKey FK_ListaDescuento_Moneda    Script Date: 07/30/2012 17:15:56 ******/
alter table ListaDescuento  ADD  CONSTRAINT FK_ListaDescuento_Moneda forEIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_ListaDescuento_Moneda
;
/****** Object:  foreignKey FK_ListaDescuento_Usuario    Script Date: 07/30/2012 17:15:56 ******/
alter table ListaDescuento  ADD  CONSTRAINT FK_ListaDescuento_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ListaDescuento_Usuario
;
/****** Object:  foreignKey FK_ListaDescuentoCliente_Cliente    Script Date: 07/30/2012 17:15:58 ******/
alter table ListaDescuentoCliente  ADD  CONSTRAINT FK_ListaDescuentoCliente_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_ListaDescuentoCliente_Cliente
;
/****** Object:  foreignKey FK_ListaDescuentoCliente_ListaDescuento    Script Date: 07/30/2012 17:15:58 ******/
alter table ListaDescuentoCliente  ADD  CONSTRAINT FK_ListaDescuentoCliente_ListaDescuento forEIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_ListaDescuentoCliente_ListaDescuento
;
/****** Object:  foreignKey FK_ListaDescuentoItem_ListaDescuento    Script Date: 07/30/2012 17:16:00 ******/
alter table ListaDescuentoItem  ADD  CONSTRAINT FK_ListaDescuentoItem_ListaDescuento forEIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_ListaDescuentoItem_ListaDescuento
;
/****** Object:  foreignKey FK_ListaDescuentoItem_Producto    Script Date: 07/30/2012 17:16:00 ******/
alter table ListaDescuentoItem  ADD  CONSTRAINT FK_ListaDescuentoItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ListaDescuentoItem_Producto
;
/****** Object:  foreignKey FK_ListaDescuentoItem_Usuario    Script Date: 07/30/2012 17:16:00 ******/
alter table ListaDescuentoItem  ADD  CONSTRAINT FK_ListaDescuentoItem_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ListaDescuentoItem_Usuario
;
/****** Object:  foreignKey FK_ListaDescuentoProveedor_ListaDescuento    Script Date: 07/30/2012 17:16:02 ******/
alter table ListaDescuentoProveedor  ADD  CONSTRAINT FK_ListaDescuentoProveedor_ListaDescuento forEIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_ListaDescuentoProveedor_ListaDescuento
;
/****** Object:  foreignKey FK_ListaDescuentoProveedor_Proveedor    Script Date: 07/30/2012 17:16:02 ******/
alter table ListaDescuentoProveedor  ADD  CONSTRAINT FK_ListaDescuentoProveedor_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_ListaDescuentoProveedor_Proveedor
;
/****** Object:  foreignKey FK_ListaPrecio_ListaPrecio    Script Date: 07/30/2012 17:16:08 ******/
alter table ListaPrecio  ADD  CONSTRAINT FK_ListaPrecio_ListaPrecio forEIGN KEY(lp_id_padre)
REFERENCES ListaPrecio (lp_id)
;
-- FK_ListaPrecio_ListaPrecio
;
/****** Object:  foreignKey FK_ListaPrecio_Moneda    Script Date: 07/30/2012 17:16:08 ******/
alter table ListaPrecio  ADD  CONSTRAINT FK_ListaPrecio_Moneda forEIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_ListaPrecio_Moneda
;
/****** Object:  foreignKey FK_ListaPrecio_Usuario    Script Date: 07/30/2012 17:16:08 ******/
alter table ListaPrecio  ADD  CONSTRAINT FK_ListaPrecio_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ListaPrecio_Usuario
;
/****** Object:  foreignKey FK__ListaPrec__cli_i__56F49FFA    Script Date: 07/30/2012 17:16:09 ******/
alter table ListaPrecioCliente  ADD  CONSTRAINT FK__ListaPrec__cli_i__56F49FFA forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK__ListaPrec__cli_i__56F49FFA
;
/****** Object:  foreignKey FK__ListaPrec__lp_id__57E8C433    Script Date: 07/30/2012 17:16:09 ******/
alter table ListaPrecioCliente  ADD  CONSTRAINT FK__ListaPrec__lp_id__57E8C433 forEIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK__ListaPrec__lp_id__57E8C433
;
/****** Object:  foreignKey FK_ListaPrecioConfig_ListaPrecio    Script Date: 07/30/2012 17:16:10 ******/
alter table ListaPrecioConfig  ADD  CONSTRAINT FK_ListaPrecioConfig_ListaPrecio forEIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_ListaPrecioConfig_ListaPrecio
;
/****** Object:  foreignKey FK_ListaPrecioConfig_Producto    Script Date: 07/30/2012 17:16:10 ******/
alter table ListaPrecioConfig  ADD  CONSTRAINT FK_ListaPrecioConfig_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ListaPrecioConfig_Producto
;
/****** Object:  foreignKey FK_ListaPrecioItem_ListaPrecio    Script Date: 07/30/2012 17:16:16 ******/
alter table ListaPrecioItem  ADD  CONSTRAINT FK_ListaPrecioItem_ListaPrecio forEIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_ListaPrecioItem_ListaPrecio
;
/****** Object:  foreignKey FK_ListaPrecioItem_ListaPrecioMarcado    Script Date: 07/30/2012 17:16:16 ******/
alter table ListaPrecioItem  ADD  CONSTRAINT FK_ListaPrecioItem_ListaPrecioMarcado forEIGN KEY(lpm_id)
REFERENCES ListaPrecioMarcado (lpm_id)
;
-- FK_ListaPrecioItem_ListaPrecioMarcado
;
/****** Object:  foreignKey FK_ListaPrecioItem_Producto    Script Date: 07/30/2012 17:16:16 ******/
alter table ListaPrecioItem  ADD  CONSTRAINT FK_ListaPrecioItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ListaPrecioItem_Producto
;
/****** Object:  foreignKey FK_ListaPrecioItem_Usuario    Script Date: 07/30/2012 17:16:16 ******/
alter table ListaPrecioItem  ADD  CONSTRAINT FK_ListaPrecioItem_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ListaPrecioItem_Usuario
;
/****** Object:  foreignKey FK_ListaPrecioLista_ListaPrecio    Script Date: 07/30/2012 17:16:18 ******/
alter table ListaPrecioLista  ADD  CONSTRAINT FK_ListaPrecioLista_ListaPrecio forEIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_ListaPrecioLista_ListaPrecio
;
/****** Object:  foreignKey FK_ListaPrecioLista_ListaPrecioMarcado    Script Date: 07/30/2012 17:16:18 ******/
alter table ListaPrecioLista  ADD  CONSTRAINT FK_ListaPrecioLista_ListaPrecioMarcado forEIGN KEY(lpm_id)
REFERENCES ListaPrecioMarcado (lpm_id)
;
-- FK_ListaPrecioLista_ListaPrecioMarcado
;
/****** Object:  foreignKey FK_ListaPrecioLista_ListaPrecioPadre    Script Date: 07/30/2012 17:16:18 ******/
alter table ListaPrecioLista  ADD  CONSTRAINT FK_ListaPrecioLista_ListaPrecioPadre forEIGN KEY(lp_id_padre)
REFERENCES ListaPrecio (lp_id)
;
-- FK_ListaPrecioLista_ListaPrecioPadre
;
/****** Object:  foreignKey FK_ListaPrecioLista_Usuario    Script Date: 07/30/2012 17:16:18 ******/
alter table ListaPrecioLista  ADD  CONSTRAINT FK_ListaPrecioLista_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ListaPrecioLista_Usuario
;
/****** Object:  foreignKey FK__ListaPrec__lp_id__54D74D5E    Script Date: 07/30/2012 17:16:24 ******/
alter table ListaPrecioProveedor  ADD  CONSTRAINT FK__ListaPrec__lp_id__54D74D5E forEIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK__ListaPrec__lp_id__54D74D5E
;
/****** Object:  foreignKey FK_ListaPrec_Proveedor    Script Date: 07/30/2012 17:16:24 ******/
alter table ListaPrecioProveedor  ADD  CONSTRAINT FK_ListaPrec_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_ListaPrec_Proveedor
;
/****** Object:  foreignKey FK_MailItem_Mail    Script Date: 07/30/2012 17:16:28 ******/
alter table MailItem  ADD  CONSTRAINT FK_MailItem_Mail forEIGN KEY(mail_id)
REFERENCES Mail (mail_id)
;
-- FK_MailItem_Mail
;
/****** Object:  foreignKey FK_ManifiestoCarga_Barco    Script Date: 07/30/2012 17:16:34 ******/
alter table ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_Barco forEIGN KEY(barc_id)
REFERENCES Barco (barc_id)
;
-- FK_ManifiestoCarga_Barco
;
/****** Object:  foreignKey FK_ManifiestoCarga_CentroCosto    Script Date: 07/30/2012 17:16:34 ******/
alter table ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_ManifiestoCarga_CentroCosto
;
/****** Object:  foreignKey FK_ManifiestoCarga_Chofer    Script Date: 07/30/2012 17:16:35 ******/
alter table ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_Chofer forEIGN KEY(chof_id)
REFERENCES Chofer (chof_id)
;
-- FK_ManifiestoCarga_Chofer
;
/****** Object:  foreignKey FK_ManifiestoCarga_Cliente    Script Date: 07/30/2012 17:16:35 ******/
alter table ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_ManifiestoCarga_Cliente
;
/****** Object:  foreignKey FK_ManifiestoCarga_ContraMarca    Script Date: 07/30/2012 17:16:35 ******/
alter table ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_ContraMarca forEIGN KEY(cmarc_id)
REFERENCES ContraMarca (cmarc_id)
;
-- FK_ManifiestoCarga_ContraMarca
;
/****** Object:  foreignKey FK_ManifiestoCarga_DepositoLogicoDestino    Script Date: 07/30/2012 17:16:35 ******/
alter table ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_DepositoLogicoDestino forEIGN KEY(depl_id_destino)
REFERENCES DepositoLogico (depl_id)
;
-- FK_ManifiestoCarga_DepositoLogicoDestino
;
/****** Object:  foreignKey FK_ManifiestoCarga_DepositoLogicoOrigen    Script Date: 07/30/2012 17:16:35 ******/
alter table ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_DepositoLogicoOrigen forEIGN KEY(depl_id_origen)
REFERENCES DepositoLogico (depl_id)
;
-- FK_ManifiestoCarga_DepositoLogicoOrigen
;
/****** Object:  foreignKey FK_ManifiestoCarga_Documento    Script Date: 07/30/2012 17:16:35 ******/
alter table ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_ManifiestoCarga_Documento
;
/****** Object:  foreignKey FK_ManifiestoCarga_DocumentoTipo    Script Date: 07/30/2012 17:16:35 ******/
alter table ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_ManifiestoCarga_DocumentoTipo
;
/****** Object:  foreignKey FK_ManifiestoCarga_Estado    Script Date: 07/30/2012 17:16:35 ******/
alter table ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_Estado forEIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_ManifiestoCarga_Estado
;
/****** Object:  foreignKey FK_ManifiestoCarga_PuertoDestino    Script Date: 07/30/2012 17:16:35 ******/
alter table ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_PuertoDestino forEIGN KEY(pue_id_destino)
REFERENCES Puerto (pue_id)
;
-- FK_ManifiestoCarga_PuertoDestino
;
/****** Object:  foreignKey FK_ManifiestoCarga_PuertoOrigen    Script Date: 07/30/2012 17:16:35 ******/
alter table ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_PuertoOrigen forEIGN KEY(pue_id_origen)
REFERENCES Puerto (pue_id)
;
-- FK_ManifiestoCarga_PuertoOrigen
;
/****** Object:  foreignKey FK_ManifiestoCarga_Sucursal    Script Date: 07/30/2012 17:16:36 ******/
alter table ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_ManifiestoCarga_Sucursal
;
/****** Object:  foreignKey FK_ManifiestoCarga_Transporte    Script Date: 07/30/2012 17:16:36 ******/
alter table ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_Transporte forEIGN KEY(trans_id)
REFERENCES Transporte (trans_id)
;
-- FK_ManifiestoCarga_Transporte
;
/****** Object:  foreignKey FK_ManifiestoCargaItem_CentroCosto    Script Date: 07/30/2012 17:16:40 ******/
alter table ManifiestoCargaItem  ADD  CONSTRAINT FK_ManifiestoCargaItem_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_ManifiestoCargaItem_CentroCosto
;
/****** Object:  foreignKey FK_ManifiestoCargaItem_ManifiestoCarga    Script Date: 07/30/2012 17:16:40 ******/
alter table ManifiestoCargaItem  ADD  CONSTRAINT FK_ManifiestoCargaItem_ManifiestoCarga forEIGN KEY(mfc_id)
REFERENCES ManifiestoCarga (mfc_id)
;
-- FK_ManifiestoCargaItem_ManifiestoCarga
;
/****** Object:  foreignKey FK_ManifiestoCargaItem_Producto    Script Date: 07/30/2012 17:16:40 ******/
alter table ManifiestoCargaItem  ADD  CONSTRAINT FK_ManifiestoCargaItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ManifiestoCargaItem_Producto
;
/****** Object:  foreignKey FK_ManifiestoCargaItemBorradoTMP_ManifiestoCargaTMP    Script Date: 07/30/2012 17:16:41 ******/
alter table ManifiestoCargaItemBorradoTMP  ADD  CONSTRAINT FK_ManifiestoCargaItemBorradoTMP_ManifiestoCargaTMP forEIGN KEY(mfcTMP_id)
REFERENCES ManifiestoCargaTMP (mfcTMP_id)
;
-- FK_ManifiestoCargaItemBorradoTMP_ManifiestoCargaTMP
;
/****** Object:  foreignKey FK_ManifiestoCargaItemTMP_ManifiestoCargaTMP    Script Date: 07/30/2012 17:16:46 ******/
alter table ManifiestoCargaItemTMP  ADD  CONSTRAINT FK_ManifiestoCargaItemTMP_ManifiestoCargaTMP forEIGN KEY(mfcTMP_id)
REFERENCES ManifiestoCargaTMP (mfcTMP_id)
;
-- FK_ManifiestoCargaItemTMP_ManifiestoCargaTMP
;
/****** Object:  foreignKey FK_ManifiestoPackingList_ManifiestoCargaItem    Script Date: 07/30/2012 17:16:53 ******/
alter table ManifiestoPackingList  ADD  CONSTRAINT FK_ManifiestoPackingList_ManifiestoCargaItem forEIGN KEY(pklsti_id)
REFERENCES ManifiestoCargaItem (mfci_id)
;
-- FK_ManifiestoPackingList_ManifiestoCargaItem
;
/****** Object:  foreignKey FK_ManifiestoPackingList_PackingListItem    Script Date: 07/30/2012 17:16:53 ******/
alter table ManifiestoPackingList  ADD  CONSTRAINT FK_ManifiestoPackingList_PackingListItem forEIGN KEY(pklsti_id)
REFERENCES PackingListItem (pklsti_id)
;
-- FK_ManifiestoPackingList_PackingListItem
;
/****** Object:  foreignKey FK_maquina_Usuario    Script Date: 07/30/2012 17:16:57 ******/
alter table Maquina  ADD  CONSTRAINT FK_maquina_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_maquina_Usuario
;
/****** Object:  foreignKey FK_Marca_Usuario    Script Date: 07/30/2012 17:16:59 ******/
alter table Marca  ADD  CONSTRAINT FK_Marca_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Marca_Usuario
;
/****** Object:  foreignKey FK_Materia_Usuario    Script Date: 07/30/2012 17:17:01 ******/
alter table Materia  ADD  CONSTRAINT FK_Materia_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Materia_Usuario
;
/****** Object:  foreignKey FK_Moneda_Usuario    Script Date: 07/30/2012 17:17:04 ******/
alter table Moneda  ADD  CONSTRAINT FK_Moneda_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Moneda_Usuario
;
/****** Object:  foreignKey FK_MonedaItem_Moneda    Script Date: 07/30/2012 17:17:06 ******/
alter table MonedaItem  ADD  CONSTRAINT FK_MonedaItem_Moneda forEIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_MonedaItem_Moneda
;
/****** Object:  foreignKey FK_MonedaItem_Usuario    Script Date: 07/30/2012 17:17:06 ******/
alter table MonedaItem  ADD  CONSTRAINT FK_MonedaItem_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_MonedaItem_Usuario
;
/****** Object:  foreignKey FK_MovimientoCaja_Asiento    Script Date: 07/30/2012 17:17:09 ******/
alter table MovimientoCaja  ADD  CONSTRAINT FK_MovimientoCaja_Asiento forEIGN KEY(as_id)
REFERENCES Asiento (as_id)
;
-- FK_MovimientoCaja_Asiento
;
/****** Object:  foreignKey FK_MovimientoCaja_Caja    Script Date: 07/30/2012 17:17:09 ******/
alter table MovimientoCaja  ADD  CONSTRAINT FK_MovimientoCaja_Caja forEIGN KEY(cj_id)
REFERENCES Caja (cj_id)
;
-- FK_MovimientoCaja_Caja
;
/****** Object:  foreignKey FK_MovimientoCaja_Usuario    Script Date: 07/30/2012 17:17:09 ******/
alter table MovimientoCaja  ADD  CONSTRAINT FK_MovimientoCaja_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_MovimientoCaja_Usuario
;
/****** Object:  foreignKey FK_MovimientoCaja_UsuarioCajero    Script Date: 07/30/2012 17:17:09 ******/
alter table MovimientoCaja  ADD  CONSTRAINT FK_MovimientoCaja_UsuarioCajero forEIGN KEY(us_id_cajero)
REFERENCES Usuario (us_id)
;
-- FK_MovimientoCaja_UsuarioCajero
;
/****** Object:  foreignKey FK_MovimientoCajaItem_CentroCosto    Script Date: 07/30/2012 17:17:12 ******/
alter table MovimientoCajaItem  ADD  CONSTRAINT FK_MovimientoCajaItem_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_MovimientoCajaItem_CentroCosto
;
/****** Object:  foreignKey FK_MovimientoCajaItem_Cheque    Script Date: 07/30/2012 17:17:12 ******/
alter table MovimientoCajaItem  ADD  CONSTRAINT FK_MovimientoCajaItem_Cheque forEIGN KEY(cheq_id)
REFERENCES Cheque (cheq_id)
;
-- FK_MovimientoCajaItem_Cheque
;
/****** Object:  foreignKey FK_MovimientoCajaItem_Cuenta    Script Date: 07/30/2012 17:17:12 ******/
alter table MovimientoCajaItem  ADD  CONSTRAINT FK_MovimientoCajaItem_Cuenta forEIGN KEY(cue_id_trabajo)
REFERENCES Cuenta (cue_id)
;
-- FK_MovimientoCajaItem_Cuenta
;
/****** Object:  foreignKey FK_MovimientoCajaItem_Moneda    Script Date: 07/30/2012 17:17:12 ******/
alter table MovimientoCajaItem  ADD  CONSTRAINT FK_MovimientoCajaItem_Moneda forEIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_MovimientoCajaItem_Moneda
;
/****** Object:  foreignKey FK_MovimientoCajaItem_MovimientoCaja    Script Date: 07/30/2012 17:17:12 ******/
alter table MovimientoCajaItem  ADD  CONSTRAINT FK_MovimientoCajaItem_MovimientoCaja forEIGN KEY(mcj_id)
REFERENCES MovimientoCaja (mcj_id)
;
-- FK_MovimientoCajaItem_MovimientoCaja
;
/****** Object:  foreignKey FK_MovimientoCajaMovimiento_Asiento    Script Date: 07/30/2012 17:17:14 ******/
alter table MovimientoCajaMovimiento  ADD  CONSTRAINT FK_MovimientoCajaMovimiento_Asiento forEIGN KEY(as_id)
REFERENCES Asiento (as_id)
;
-- FK_MovimientoCajaMovimiento_Asiento
;
/****** Object:  foreignKey FK_MovimientoCajaMovimiento_MovimientoCaja    Script Date: 07/30/2012 17:17:14 ******/
alter table MovimientoCajaMovimiento  ADD  CONSTRAINT FK_MovimientoCajaMovimiento_MovimientoCaja forEIGN KEY(mcj_id)
REFERENCES MovimientoCaja (mcj_id)
;
-- FK_MovimientoCajaMovimiento_MovimientoCaja
;
/****** Object:  foreignKey FK_MovimientoFondo_Asiento    Script Date: 07/30/2012 17:17:20 ******/
alter table MovimientoFondo  ADD  CONSTRAINT FK_MovimientoFondo_Asiento forEIGN KEY(as_id)
REFERENCES Asiento (as_id)
;
-- FK_MovimientoFondo_Asiento
;
/****** Object:  foreignKey FK_MovimientoFondo_CentroCosto    Script Date: 07/30/2012 17:17:20 ******/
alter table MovimientoFondo  ADD  CONSTRAINT FK_MovimientoFondo_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_MovimientoFondo_CentroCosto
;
/****** Object:  foreignKey FK_MovimientoFondo_Cliente    Script Date: 07/30/2012 17:17:20 ******/
alter table MovimientoFondo  ADD  CONSTRAINT FK_MovimientoFondo_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_MovimientoFondo_Cliente
;
/****** Object:  foreignKey FK_MovimientoFondo_Documento    Script Date: 07/30/2012 17:17:20 ******/
alter table MovimientoFondo  ADD  CONSTRAINT FK_MovimientoFondo_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_MovimientoFondo_Documento
;
/****** Object:  foreignKey FK_MovimientoFondo_DocumentoTipo    Script Date: 07/30/2012 17:17:20 ******/
alter table MovimientoFondo  ADD  CONSTRAINT FK_MovimientoFondo_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_MovimientoFondo_DocumentoTipo
;
/****** Object:  foreignKey FK_MovimientoFondo_Legajo    Script Date: 07/30/2012 17:17:20 ******/
alter table MovimientoFondo  ADD  CONSTRAINT FK_MovimientoFondo_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_MovimientoFondo_Legajo
;
/****** Object:  foreignKey FK_MovimientoFondo_Moneda    Script Date: 07/30/2012 17:17:20 ******/
alter table MovimientoFondo  ADD  CONSTRAINT FK_MovimientoFondo_Moneda forEIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_MovimientoFondo_Moneda
;
/****** Object:  foreignKey FK_MovimientoFondo_UsResponsable    Script Date: 07/30/2012 17:17:20 ******/
alter table MovimientoFondo  ADD  CONSTRAINT FK_MovimientoFondo_UsResponsable forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_MovimientoFondo_UsResponsable
;
/****** Object:  foreignKey FK_MovimientoFondo_Usuario    Script Date: 07/30/2012 17:17:21 ******/
alter table MovimientoFondo  ADD  CONSTRAINT FK_MovimientoFondo_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_MovimientoFondo_Usuario
;
/****** Object:  foreignKey FK_MovimientoFondoItem_CentroCosto    Script Date: 07/30/2012 17:17:24 ******/
alter table MovimientoFondoItem  ADD  CONSTRAINT FK_MovimientoFondoItem_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_MovimientoFondoItem_CentroCosto
;
/****** Object:  foreignKey FK_MovimientoFondoItem_Cheque    Script Date: 07/30/2012 17:17:24 ******/
alter table MovimientoFondoItem  ADD  CONSTRAINT FK_MovimientoFondoItem_Cheque forEIGN KEY(cheq_id)
REFERENCES Cheque (cheq_id)
;
-- FK_MovimientoFondoItem_Cheque
;
/****** Object:  foreignKey FK_MovimientoFondoItem_Chequera    Script Date: 07/30/2012 17:17:24 ******/
alter table MovimientoFondoItem  ADD  CONSTRAINT FK_MovimientoFondoItem_Chequera forEIGN KEY(chq_id)
REFERENCES Chequera (chq_id)
;
-- FK_MovimientoFondoItem_Chequera
;
/****** Object:  foreignKey FK_MovimientoFondoItem_Clearing    Script Date: 07/30/2012 17:17:25 ******/
alter table MovimientoFondoItem  ADD  CONSTRAINT FK_MovimientoFondoItem_Clearing forEIGN KEY(cle_id)
REFERENCES Clearing (cle_id)
;
-- FK_MovimientoFondoItem_Clearing
;
/****** Object:  foreignKey FK_MovimientoFondoItem_Cuenta    Script Date: 07/30/2012 17:17:25 ******/
alter table MovimientoFondoItem  ADD  CONSTRAINT FK_MovimientoFondoItem_Cuenta forEIGN KEY(cue_id_debe)
REFERENCES Cuenta (cue_id)
;
-- FK_MovimientoFondoItem_Cuenta
;
/****** Object:  foreignKey FK_MovimientoFondoItem_MovimientoFondo    Script Date: 07/30/2012 17:17:25 ******/
alter table MovimientoFondoItem  ADD  CONSTRAINT FK_MovimientoFondoItem_MovimientoFondo forEIGN KEY(mf_id)
REFERENCES MovimientoFondo (mf_id)
;
-- FK_MovimientoFondoItem_MovimientoFondo
;
/****** Object:  foreignKey FK_MovimientoFondoItemBorradoTMP_MovimientoFondoTMP    Script Date: 07/30/2012 17:17:26 ******/
alter table MovimientoFondoItemBorradoTMP  ADD  CONSTRAINT FK_MovimientoFondoItemBorradoTMP_MovimientoFondoTMP forEIGN KEY(mfTMP_id)
REFERENCES MovimientoFondoTMP (mfTMP_id)
;
-- FK_MovimientoFondoItemBorradoTMP_MovimientoFondoTMP
;
/****** Object:  foreignKey FK_MovimientoFondoItemTMP_MovimientoFondoTMP    Script Date: 07/30/2012 17:17:30 ******/
alter table MovimientoFondoItemTMP  ADD  CONSTRAINT FK_MovimientoFondoItemTMP_MovimientoFondoTMP forEIGN KEY(mfTMP_id)
REFERENCES MovimientoFondoTMP (mfTMP_id)
;
-- FK_MovimientoFondoItemTMP_MovimientoFondoTMP
;
/****** Object:  foreignKey FK_Objetivo_Proyecto    Script Date: 07/30/2012 17:17:39 ******/
alter table Objetivo  ADD  CONSTRAINT FK_Objetivo_Proyecto forEIGN KEY(proy_id)
REFERENCES Proyecto (proy_id)
;
-- FK_Objetivo_Proyecto
;
/****** Object:  foreignKey FK_Objetivo_Usuario    Script Date: 07/30/2012 17:17:39 ******/
alter table Objetivo  ADD  CONSTRAINT FK_Objetivo_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Objetivo_Usuario
;
/****** Object:  foreignKey FK_OrdenCompraItem_OrdenCompra    Script Date: 07/30/2012 17:17:54 ******/
alter table OrdenCompraItem  ADD  CONSTRAINT FK_OrdenCompraItem_OrdenCompra forEIGN KEY(oc_id)
REFERENCES OrdenCompra (oc_id)
;
-- FK_OrdenCompraItem_OrdenCompra
;
/****** Object:  foreignKey FK_OrdenCompraItem_Producto    Script Date: 07/30/2012 17:17:54 ******/
alter table OrdenCompraItem  ADD  CONSTRAINT FK_OrdenCompraItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_OrdenCompraItem_Producto
;
/****** Object:  foreignKey FK_OrdenCompraItemBorradoTMP_OrdenCompraTMP    Script Date: 07/30/2012 17:17:55 ******/
alter table OrdenCompraItemBorradoTMP  ADD  CONSTRAINT FK_OrdenCompraItemBorradoTMP_OrdenCompraTMP forEIGN KEY(ocTMP_id)
REFERENCES OrdenCompraTMP (ocTMP_id)
;
-- FK_OrdenCompraItemBorradoTMP_OrdenCompraTMP
;
/****** Object:  foreignKey FK_OrdenCompraItemTMP_OrdenCompraTMP    Script Date: 07/30/2012 17:18:00 ******/
alter table OrdenCompraItemTMP  ADD  CONSTRAINT FK_OrdenCompraItemTMP_OrdenCompraTMP forEIGN KEY(ocTMP_id)
REFERENCES OrdenCompraTMP (ocTMP_id)
;
-- FK_OrdenCompraItemTMP_OrdenCompraTMP
;
/****** Object:  foreignKey FK_OrdenDevolucionCompra_OrdenCompraItemDevolucion    Script Date: 07/30/2012 17:18:09 ******/
alter table OrdenDevolucionCompra  ADD  CONSTRAINT FK_OrdenDevolucionCompra_OrdenCompraItemDevolucion forEIGN KEY(oci_id_devolucion)
REFERENCES OrdenCompraItem (oci_id)
;
-- FK_OrdenDevolucionCompra_OrdenCompraItemDevolucion
;
/****** Object:  foreignKey FK_OrdenDevolucionCompra_OrdenCompraItemOrden    Script Date: 07/30/2012 17:18:09 ******/
alter table OrdenDevolucionCompra  ADD  CONSTRAINT FK_OrdenDevolucionCompra_OrdenCompraItemOrden forEIGN KEY(oci_id_Orden)
REFERENCES OrdenCompraItem (oci_id)
;
-- FK_OrdenDevolucionCompra_OrdenCompraItemOrden
;
/****** Object:  foreignKey FK_OrdenDevolucionCompraTMP_OrdenCompraTMP    Script Date: 07/30/2012 17:18:11 ******/
alter table OrdenDevolucionCompraTMP  ADD  CONSTRAINT FK_OrdenDevolucionCompraTMP_OrdenCompraTMP forEIGN KEY(ocTMP_id)
REFERENCES OrdenCompraTMP (ocTMP_id)
;
-- FK_OrdenDevolucionCompraTMP_OrdenCompraTMP
;
/****** Object:  foreignKey FK_OrdenPago_Empresa    Script Date: 07/30/2012 17:18:20 ******/
alter table OrdenPago  ADD  CONSTRAINT FK_OrdenPago_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_OrdenPago_Empresa
;
/****** Object:  foreignKey FK_OrdenPago_FacturaCompra    Script Date: 07/30/2012 17:18:20 ******/
alter table OrdenPago  ADD  CONSTRAINT FK_OrdenPago_FacturaCompra forEIGN KEY(fc_id)
REFERENCES FacturaCompra (fc_id)
;
-- FK_OrdenPago_FacturaCompra
;
/****** Object:  foreignKey FK_OrdenPago_OrdenCompra    Script Date: 07/30/2012 17:18:20 ******/
alter table OrdenPago  ADD  CONSTRAINT FK_OrdenPago_OrdenCompra forEIGN KEY(oc_id)
REFERENCES OrdenCompra (oc_id)
;
-- FK_OrdenPago_OrdenCompra
;
/****** Object:  foreignKey FK_OrdenPagoItem_CentroCosto    Script Date: 07/30/2012 17:18:24 ******/
alter table OrdenPagoItem  ADD  CONSTRAINT FK_OrdenPagoItem_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_OrdenPagoItem_CentroCosto
;
/****** Object:  foreignKey FK_OrdenPagoItem_Cheque    Script Date: 07/30/2012 17:18:24 ******/
alter table OrdenPagoItem  ADD  CONSTRAINT FK_OrdenPagoItem_Cheque forEIGN KEY(cheq_id)
REFERENCES Cheque (cheq_id)
;
-- FK_OrdenPagoItem_Cheque
;
/****** Object:  foreignKey FK_OrdenPagoItem_Chequera    Script Date: 07/30/2012 17:18:24 ******/
alter table OrdenPagoItem  ADD  CONSTRAINT FK_OrdenPagoItem_Chequera forEIGN KEY(chq_id)
REFERENCES Chequera (chq_id)
;
-- FK_OrdenPagoItem_Chequera
;
/****** Object:  foreignKey FK_OrdenPagoItem_Cuenta    Script Date: 07/30/2012 17:18:25 ******/
alter table OrdenPagoItem  ADD  CONSTRAINT FK_OrdenPagoItem_Cuenta forEIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_OrdenPagoItem_Cuenta
;
/****** Object:  foreignKey FK_OrdenPagoItem_OrdenPago    Script Date: 07/30/2012 17:18:25 ******/
alter table OrdenPagoItem  ADD  CONSTRAINT FK_OrdenPagoItem_OrdenPago forEIGN KEY(opg_id)
REFERENCES OrdenPago (opg_id)
;
-- FK_OrdenPagoItem_OrdenPago
;
/****** Object:  foreignKey FK_OrdenPagoItem_Retencion    Script Date: 07/30/2012 17:18:25 ******/
alter table OrdenPagoItem  ADD  CONSTRAINT FK_OrdenPagoItem_Retencion forEIGN KEY(ret_id)
REFERENCES Retencion (ret_id)
;
-- FK_OrdenPagoItem_Retencion
;
/****** Object:  foreignKey FK_OrdenPagoItemBorradoTMP_OrdenPagoTMP    Script Date: 07/30/2012 17:18:26 ******/
alter table OrdenPagoItemBorradoTMP  ADD  CONSTRAINT FK_OrdenPagoItemBorradoTMP_OrdenPagoTMP forEIGN KEY(opgTMP_id)
REFERENCES OrdenPagoTMP (opgTMP_id)
;
-- FK_OrdenPagoItemBorradoTMP_OrdenPagoTMP
;
/****** Object:  foreignKey FK_OrdenPagoItemTMP_OrdenPagoTMP    Script Date: 07/30/2012 17:18:32 ******/
alter table OrdenPagoItemTMP  ADD  CONSTRAINT FK_OrdenPagoItemTMP_OrdenPagoTMP forEIGN KEY(opgTMP_id)
REFERENCES OrdenPagoTMP (opgTMP_id)
;
-- FK_OrdenPagoItemTMP_OrdenPagoTMP
;
/****** Object:  foreignKey FK_OrdenProdKit_DepositoLogico    Script Date: 07/30/2012 17:18:40 ******/
alter table OrdenProdKit  ADD  CONSTRAINT FK_OrdenProdKit_DepositoLogico forEIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_OrdenProdKit_DepositoLogico
;
/****** Object:  foreignKey FK_OrdenProdKit_Documento    Script Date: 07/30/2012 17:18:41 ******/
alter table OrdenProdKit  ADD  CONSTRAINT FK_OrdenProdKit_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_OrdenProdKit_Documento
;
/****** Object:  foreignKey FK_OrdenProdKit_DocumentoTipo    Script Date: 07/30/2012 17:18:41 ******/
alter table OrdenProdKit  ADD  CONSTRAINT FK_OrdenProdKit_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_OrdenProdKit_DocumentoTipo
;
/****** Object:  foreignKey FK_OrdenProdKit_Legajo    Script Date: 07/30/2012 17:18:41 ******/
alter table OrdenProdKit  ADD  CONSTRAINT FK_OrdenProdKit_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_OrdenProdKit_Legajo
;
/****** Object:  foreignKey FK_OrdenProdKit_Sucursal    Script Date: 07/30/2012 17:18:41 ******/
alter table OrdenProdKit  ADD  CONSTRAINT FK_OrdenProdKit_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_OrdenProdKit_Sucursal
;
/****** Object:  foreignKey FK_OrdenProdKitItem_OrdenProdKit    Script Date: 07/30/2012 17:18:43 ******/
alter table OrdenProdKitItem  ADD  CONSTRAINT FK_OrdenProdKitItem_OrdenProdKit forEIGN KEY(opk_id)
REFERENCES OrdenProdKit (opk_id)
;
-- FK_OrdenProdKitItem_OrdenProdKit
;
/****** Object:  foreignKey FK_OrdenProdKitItem_Producto    Script Date: 07/30/2012 17:18:43 ******/
alter table OrdenProdKitItem  ADD  CONSTRAINT FK_OrdenProdKitItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_OrdenProdKitItem_Producto
;
/****** Object:  foreignKey FK_OrdenProdKitItem_ProductoFormulaKit    Script Date: 07/30/2012 17:18:43 ******/
alter table OrdenProdKitItem  ADD  CONSTRAINT FK_OrdenProdKitItem_ProductoFormulaKit forEIGN KEY(prfk_id)
REFERENCES ProductoFormulaKit (prfk_id)
;
-- FK_OrdenProdKitItem_ProductoFormulaKit
;
/****** Object:  foreignKey FK_OrdenProdKitItemBorradoTMP_OrdenProdKitTMP    Script Date: 07/30/2012 17:18:44 ******/
alter table OrdenProdKitItemBorradoTMP  ADD  CONSTRAINT FK_OrdenProdKitItemBorradoTMP_OrdenProdKitTMP forEIGN KEY(opkTMP_id)
REFERENCES OrdenProdKitTMP (opkTMP_id)
;
-- FK_OrdenProdKitItemBorradoTMP_OrdenProdKitTMP
;
/****** Object:  foreignKey FK_OrdenProdKitItemTMP_OrdenProdKitTMP    Script Date: 07/30/2012 17:18:46 ******/
alter table OrdenProdKitItemTMP  ADD  CONSTRAINT FK_OrdenProdKitItemTMP_OrdenProdKitTMP forEIGN KEY(opkTMP_id)
REFERENCES OrdenProdKitTMP (opkTMP_id)
;
-- FK_OrdenProdKitItemTMP_OrdenProdKitTMP
;
/****** Object:  foreignKey FK_OrdenRemitoCompra_OrdenCompraItem    Script Date: 07/30/2012 17:18:50 ******/
alter table OrdenRemitoCompra  ADD  CONSTRAINT FK_OrdenRemitoCompra_OrdenCompraItem forEIGN KEY(oci_id)
REFERENCES OrdenCompraItem (oci_id)
;
-- FK_OrdenRemitoCompra_OrdenCompraItem
;
/****** Object:  foreignKey FK_OrdenRemitoCompra_RemitoCompraItem    Script Date: 07/30/2012 17:18:50 ******/
alter table OrdenRemitoCompra  ADD  CONSTRAINT FK_OrdenRemitoCompra_RemitoCompraItem forEIGN KEY(rci_id)
REFERENCES RemitoCompraItem (rci_id)
;
-- FK_OrdenRemitoCompra_RemitoCompraItem
;
/****** Object:  foreignKey FK_OrdenRemitoVenta_OrdenServicioItem    Script Date: 07/30/2012 17:18:53 ******/
alter table OrdenRemitoVenta  ADD  CONSTRAINT FK_OrdenRemitoVenta_OrdenServicioItem forEIGN KEY(osi_id)
REFERENCES OrdenServicioItem (osi_id)
;
-- FK_OrdenRemitoVenta_OrdenServicioItem
;
/****** Object:  foreignKey FK_OrdenRemitoVenta_RemitoVentaItem    Script Date: 07/30/2012 17:18:53 ******/
alter table OrdenRemitoVenta  ADD  CONSTRAINT FK_OrdenRemitoVenta_RemitoVentaItem forEIGN KEY(rvi_id)
REFERENCES RemitoVentaItem (rvi_id)
;
-- FK_OrdenRemitoVenta_RemitoVentaItem
;
/****** Object:  foreignKey FK_OrdenServicio_CentroCosto    Script Date: 07/30/2012 17:19:04 ******/
alter table OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_OrdenServicio_CentroCosto
;
/****** Object:  foreignKey FK_OrdenServicio_Cliente    Script Date: 07/30/2012 17:19:04 ******/
alter table OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_OrdenServicio_Cliente
;
/****** Object:  foreignKey FK_OrdenServicio_ClienteSucursal    Script Date: 07/30/2012 17:19:04 ******/
alter table OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_ClienteSucursal forEIGN KEY(clis_id)
REFERENCES ClienteSucursal (clis_id)
;
-- FK_OrdenServicio_ClienteSucursal
;
/****** Object:  foreignKey FK_OrdenServicio_CondicionPago    Script Date: 07/30/2012 17:19:04 ******/
alter table OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_CondicionPago forEIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_OrdenServicio_CondicionPago
;
/****** Object:  foreignKey FK_OrdenServicio_Contacto    Script Date: 07/30/2012 17:19:05 ******/
alter table OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_Contacto forEIGN KEY(cont_id)
REFERENCES Contacto (cont_id)
;
-- FK_OrdenServicio_Contacto
;
/****** Object:  foreignKey FK_OrdenServicio_Documento    Script Date: 07/30/2012 17:19:05 ******/
alter table OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_OrdenServicio_Documento
;
/****** Object:  foreignKey FK_OrdenServicio_DocumentoTipo    Script Date: 07/30/2012 17:19:05 ******/
alter table OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_OrdenServicio_DocumentoTipo
;
/****** Object:  foreignKey FK_OrdenServicio_Empresa    Script Date: 07/30/2012 17:19:05 ******/
alter table OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_OrdenServicio_Empresa
;
/****** Object:  foreignKey FK_OrdenServicio_Estado    Script Date: 07/30/2012 17:19:05 ******/
alter table OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_Estado forEIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_OrdenServicio_Estado
;
/****** Object:  foreignKey FK_OrdenServicio_ImportacionID    Script Date: 07/30/2012 17:19:05 ******/
alter table OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_ImportacionID forEIGN KEY(impid_id)
REFERENCES ImportacionID (impid_id)
;
-- FK_OrdenServicio_ImportacionID
;
/****** Object:  foreignKey FK_OrdenServicio_IncidenteApertura    Script Date: 07/30/2012 17:19:05 ******/
alter table OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_IncidenteApertura forEIGN KEY(inca_id)
REFERENCES IncidenteApertura (inca_id)
;
-- FK_OrdenServicio_IncidenteApertura
;
/****** Object:  foreignKey FK_OrdenServicio_IncidenteTipo    Script Date: 07/30/2012 17:19:05 ******/
alter table OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_IncidenteTipo forEIGN KEY(inct_id)
REFERENCES IncidenteTipo (inct_id)
;
-- FK_OrdenServicio_IncidenteTipo
;
/****** Object:  foreignKey FK_OrdenServicio_ListaDescuento    Script Date: 07/30/2012 17:19:05 ******/
alter table OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_ListaDescuento forEIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_OrdenServicio_ListaDescuento
;
/****** Object:  foreignKey FK_OrdenServicio_ListaPrecio    Script Date: 07/30/2012 17:19:05 ******/
alter table OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_ListaPrecio forEIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_OrdenServicio_ListaPrecio
;
/****** Object:  foreignKey FK_OrdenServicio_Prioridad    Script Date: 07/30/2012 17:19:06 ******/
alter table OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_Prioridad forEIGN KEY(prio_id)
REFERENCES Prioridad (prio_id)
;
-- FK_OrdenServicio_Prioridad
;
/****** Object:  foreignKey FK_OrdenServicio_Proyecto    Script Date: 07/30/2012 17:19:06 ******/
alter table OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_Proyecto forEIGN KEY(proy_id)
REFERENCES Proyecto (proy_id)
;
-- FK_OrdenServicio_Proyecto
;
/****** Object:  foreignKey FK_OrdenServicio_Stock    Script Date: 07/30/2012 17:19:06 ******/
alter table OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_Stock forEIGN KEY(st_id)
REFERENCES Stock (st_id)
;
-- FK_OrdenServicio_Stock
;
/****** Object:  foreignKey FK_OrdenServicio_Sucursal    Script Date: 07/30/2012 17:19:06 ******/
alter table OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_OrdenServicio_Sucursal
;
/****** Object:  foreignKey FK_OrdenServicio_Tarea    Script Date: 07/30/2012 17:19:06 ******/
alter table OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_Tarea forEIGN KEY(tar_id)
REFERENCES Tarea (tar_id)
;
-- FK_OrdenServicio_Tarea
;
/****** Object:  foreignKey FK_OrdenServicio_Zona    Script Date: 07/30/2012 17:19:06 ******/
alter table OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_Zona forEIGN KEY(zon_id)
REFERENCES Zona (zon_id)
;
-- FK_OrdenServicio_Zona
;
/****** Object:  foreignKey FK_OrdenServicioAlarmaTMP_OrdenServicioTMP    Script Date: 07/30/2012 17:19:07 ******/
alter table OrdenServicioAlarmaTMP  ADD  CONSTRAINT FK_OrdenServicioAlarmaTMP_OrdenServicioTMP forEIGN KEY(osTMP_id)
REFERENCES OrdenServicioTMP (osTMP_id)
;
-- FK_OrdenServicioAlarmaTMP_OrdenServicioTMP
;
/****** Object:  foreignKey FK_OrdenServicioItem_CentroCosto    Script Date: 07/30/2012 17:19:12 ******/
alter table OrdenServicioItem  ADD  CONSTRAINT FK_OrdenServicioItem_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_OrdenServicioItem_CentroCosto
;
/****** Object:  foreignKey FK_OrdenServicioItem_Contacto    Script Date: 07/30/2012 17:19:12 ******/
alter table OrdenServicioItem  ADD  CONSTRAINT FK_OrdenServicioItem_Contacto forEIGN KEY(cont_id)
REFERENCES Contacto (cont_id)
;
-- FK_OrdenServicioItem_Contacto
;
/****** Object:  foreignKey FK_OrdenServicioItem_EquipoTipoFalla    Script Date: 07/30/2012 17:19:12 ******/
alter table OrdenServicioItem  ADD  CONSTRAINT FK_OrdenServicioItem_EquipoTipoFalla forEIGN KEY(etf_id)
REFERENCES EquipoTipoFalla (etf_id)
;
-- FK_OrdenServicioItem_EquipoTipoFalla
;
/****** Object:  foreignKey FK_OrdenServicioItem_OrdenServicio    Script Date: 07/30/2012 17:19:13 ******/
alter table OrdenServicioItem  ADD  CONSTRAINT FK_OrdenServicioItem_OrdenServicio forEIGN KEY(os_id)
REFERENCES OrdenServicio (os_id)
;
-- FK_OrdenServicioItem_OrdenServicio
;
/****** Object:  foreignKey FK_OrdenServicioItem_Producto    Script Date: 07/30/2012 17:19:13 ******/
alter table OrdenServicioItem  ADD  CONSTRAINT FK_OrdenServicioItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_OrdenServicioItem_Producto
;
/****** Object:  foreignKey FK_OrdenServicioItem_StockLote    Script Date: 07/30/2012 17:19:13 ******/
alter table OrdenServicioItem  ADD  CONSTRAINT FK_OrdenServicioItem_StockLote forEIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_OrdenServicioItem_StockLote
;
/****** Object:  foreignKey FK_OrdenServicioItem_Tarea    Script Date: 07/30/2012 17:19:13 ******/
alter table OrdenServicioItem  ADD  CONSTRAINT FK_OrdenServicioItem_Tarea forEIGN KEY(tar_id)
REFERENCES Tarea (tar_id)
;
-- FK_OrdenServicioItem_Tarea
;
/****** Object:  foreignKey FK_OrdenServicioItemBorradoTMP_OrdenServicioTMP    Script Date: 07/30/2012 17:19:14 ******/
alter table OrdenServicioItemBorradoTMP  ADD  CONSTRAINT FK_OrdenServicioItemBorradoTMP_OrdenServicioTMP forEIGN KEY(osTMP_id)
REFERENCES OrdenServicioTMP (osTMP_id)
;
-- FK_OrdenServicioItemBorradoTMP_OrdenServicioTMP
;
/****** Object:  foreignKey FK_OrdenServicioItemSerieBTMP_OrdenServicioTMP    Script Date: 07/30/2012 17:19:15 ******/
alter table OrdenServicioItemSerieBTMP  ADD  CONSTRAINT FK_OrdenServicioItemSerieBTMP_OrdenServicioTMP forEIGN KEY(osTMP_id)
REFERENCES OrdenServicioTMP (osTMP_id)
;
-- FK_OrdenServicioItemSerieBTMP_OrdenServicioTMP
;
/****** Object:  foreignKey FK_OrdenServicioItemSerieTMP_OrdenServicioItemTMP    Script Date: 07/30/2012 17:19:18 ******/
alter table OrdenServicioItemSerieTMP  ADD  CONSTRAINT FK_OrdenServicioItemSerieTMP_OrdenServicioItemTMP forEIGN KEY(osiTMP_id)
REFERENCES OrdenServicioItemTMP (osiTMP_id)
;
-- FK_OrdenServicioItemSerieTMP_OrdenServicioItemTMP
;
/****** Object:  foreignKey FK_OrdenServicioItemSerieTMP_OrdenServicioTMP    Script Date: 07/30/2012 17:19:18 ******/
alter table OrdenServicioItemSerieTMP  ADD  CONSTRAINT FK_OrdenServicioItemSerieTMP_OrdenServicioTMP forEIGN KEY(osTMP_id)
REFERENCES OrdenServicioTMP (osTMP_id)
;
-- FK_OrdenServicioItemSerieTMP_OrdenServicioTMP
;
/****** Object:  foreignKey FK_OrdenServicioItemTMP_OrdenServicioTMP    Script Date: 07/30/2012 17:19:24 ******/
alter table OrdenServicioItemTMP  ADD  CONSTRAINT FK_OrdenServicioItemTMP_OrdenServicioTMP forEIGN KEY(osTMP_id)
REFERENCES OrdenServicioTMP (osTMP_id)
;
-- FK_OrdenServicioItemTMP_OrdenServicioTMP
;
/****** Object:  foreignKey FK_OrdenServicioSerie_EquipoDetalleItem    Script Date: 07/30/2012 17:19:25 ******/
alter table OrdenServicioSerie  ADD  CONSTRAINT FK_OrdenServicioSerie_EquipoDetalleItem forEIGN KEY(edi_id)
REFERENCES EquipoDetalleItem (edi_id)
;
-- FK_OrdenServicioSerie_EquipoDetalleItem
;
/****** Object:  foreignKey FK_OrdenServicioSerie_OrdenServicio    Script Date: 07/30/2012 17:19:25 ******/
alter table OrdenServicioSerie  ADD  CONSTRAINT FK_OrdenServicioSerie_OrdenServicio forEIGN KEY(os_id)
REFERENCES OrdenServicio (os_id)
;
-- FK_OrdenServicioSerie_OrdenServicio
;
/****** Object:  foreignKey FK_OrdenServicioSerie_ProductoNumeroSerie    Script Date: 07/30/2012 17:19:25 ******/
alter table OrdenServicioSerie  ADD  CONSTRAINT FK_OrdenServicioSerie_ProductoNumeroSerie forEIGN KEY(prns_id)
REFERENCES ProductoNumeroSerie (prns_id)
;
-- FK_OrdenServicioSerie_ProductoNumeroSerie
;
/****** Object:  foreignKey FK_OrdenServicioSerieTMP_OrdenServicio    Script Date: 07/30/2012 17:19:27 ******/
alter table OrdenServicioSerieTMP  ADD  CONSTRAINT FK_OrdenServicioSerieTMP_OrdenServicio forEIGN KEY(osTMP_id)
REFERENCES OrdenServicioTMP (osTMP_id)
;
-- FK_OrdenServicioSerieTMP_OrdenServicio
;
/****** Object:  foreignKey FK_PackingList_Barco    Script Date: 07/30/2012 17:19:43 ******/
alter table PackingList  ADD  CONSTRAINT FK_PackingList_Barco forEIGN KEY(barc_id)
REFERENCES Barco (barc_id)
;
-- FK_PackingList_Barco
;
/****** Object:  foreignKey FK_PackingList_CentroCosto    Script Date: 07/30/2012 17:19:43 ******/
alter table PackingList  ADD  CONSTRAINT FK_PackingList_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PackingList_CentroCosto
;
/****** Object:  foreignKey FK_PackingList_Cliente    Script Date: 07/30/2012 17:19:43 ******/
alter table PackingList  ADD  CONSTRAINT FK_PackingList_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_PackingList_Cliente
;
/****** Object:  foreignKey FK_PackingList_CondicionPago    Script Date: 07/30/2012 17:19:43 ******/
alter table PackingList  ADD  CONSTRAINT FK_PackingList_CondicionPago forEIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_PackingList_CondicionPago
;
/****** Object:  foreignKey FK_PackingList_Documento    Script Date: 07/30/2012 17:19:43 ******/
alter table PackingList  ADD  CONSTRAINT FK_PackingList_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_PackingList_Documento
;
/****** Object:  foreignKey FK_PackingList_DocumentoTipo    Script Date: 07/30/2012 17:19:43 ******/
alter table PackingList  ADD  CONSTRAINT FK_PackingList_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_PackingList_DocumentoTipo
;
/****** Object:  foreignKey FK_PackingList_Estado    Script Date: 07/30/2012 17:19:43 ******/
alter table PackingList  ADD  CONSTRAINT FK_PackingList_Estado forEIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_PackingList_Estado
;
/****** Object:  foreignKey FK_PackingList_Legajo    Script Date: 07/30/2012 17:19:44 ******/
alter table PackingList  ADD  CONSTRAINT FK_PackingList_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_PackingList_Legajo
;
/****** Object:  foreignKey FK_PackingList_ListaDescuento    Script Date: 07/30/2012 17:19:44 ******/
alter table PackingList  ADD  CONSTRAINT FK_PackingList_ListaDescuento forEIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_PackingList_ListaDescuento
;
/****** Object:  foreignKey FK_PackingList_ListaPrecio    Script Date: 07/30/2012 17:19:44 ******/
alter table PackingList  ADD  CONSTRAINT FK_PackingList_ListaPrecio forEIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_PackingList_ListaPrecio
;
/****** Object:  foreignKey FK_PackingList_PuertoDestino    Script Date: 07/30/2012 17:19:44 ******/
alter table PackingList  ADD  CONSTRAINT FK_PackingList_PuertoDestino forEIGN KEY(pue_id_destino)
REFERENCES Puerto (pue_id)
;
-- FK_PackingList_PuertoDestino
;
/****** Object:  foreignKey FK_PackingList_PuertoOrigen    Script Date: 07/30/2012 17:19:44 ******/
alter table PackingList  ADD  CONSTRAINT FK_PackingList_PuertoOrigen forEIGN KEY(pue_id_origen)
REFERENCES Puerto (pue_id)
;
-- FK_PackingList_PuertoOrigen
;
/****** Object:  foreignKey FK_PackingList_Sucursal    Script Date: 07/30/2012 17:19:44 ******/
alter table PackingList  ADD  CONSTRAINT FK_PackingList_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_PackingList_Sucursal
;
/****** Object:  foreignKey FK_PackingListDevolucion_DevolucionItem    Script Date: 07/30/2012 17:19:45 ******/
alter table PackingListDevolucion  ADD  CONSTRAINT FK_PackingListDevolucion_DevolucionItem forEIGN KEY(pklsti_id_devolucion)
REFERENCES PackingListItem (pklsti_id)
;
-- FK_PackingListDevolucion_DevolucionItem
;
/****** Object:  foreignKey FK_PackingListDevolucion_PackingListItem    Script Date: 07/30/2012 17:19:45 ******/
alter table PackingListDevolucion  ADD  CONSTRAINT FK_PackingListDevolucion_PackingListItem forEIGN KEY(pklsti_id_pklst)
REFERENCES PackingListItem (pklsti_id)
;
-- FK_PackingListDevolucion_PackingListItem
;
/****** Object:  foreignKey FK_PackingListDevolucionTMP_PackingListTMP    Script Date: 07/30/2012 17:19:47 ******/
alter table PackingListDevolucionTMP  ADD  CONSTRAINT FK_PackingListDevolucionTMP_PackingListTMP forEIGN KEY(pklstTMP_id)
REFERENCES PackingListTMP (pklstTMP_id)
;
-- FK_PackingListDevolucionTMP_PackingListTMP
;
/****** Object:  foreignKey FK_PackingListFacturaVenta_FacturaVentaItem    Script Date: 07/30/2012 17:19:48 ******/
alter table PackingListFacturaVenta  ADD  CONSTRAINT FK_PackingListFacturaVenta_FacturaVentaItem forEIGN KEY(fvi_id)
REFERENCES FacturaVentaItem (fvi_id)
;
-- FK_PackingListFacturaVenta_FacturaVentaItem
;
/****** Object:  foreignKey FK_PackingListFacturaVenta_PackingListItem    Script Date: 07/30/2012 17:19:48 ******/
alter table PackingListFacturaVenta  ADD  CONSTRAINT FK_PackingListFacturaVenta_PackingListItem forEIGN KEY(pklsti_id)
REFERENCES PackingListItem (pklsti_id)
;
-- FK_PackingListFacturaVenta_PackingListItem
;
/****** Object:  foreignKey FK_PackingListFacturaVentaTMP_PackingListItem    Script Date: 07/30/2012 17:19:50 ******/
alter table PackingListFacturaVentaTMP  ADD  CONSTRAINT FK_PackingListFacturaVentaTMP_PackingListItem forEIGN KEY(pklsti_id)
REFERENCES PackingListItem (pklsti_id)
;
-- FK_PackingListFacturaVentaTMP_PackingListItem
;
/****** Object:  foreignKey FK_PackingListItem_CentroCosto    Script Date: 07/30/2012 17:19:56 ******/
alter table PackingListItem  ADD  CONSTRAINT FK_PackingListItem_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PackingListItem_CentroCosto
;
/****** Object:  foreignKey FK_PackingListItem_PackingList    Script Date: 07/30/2012 17:19:56 ******/
alter table PackingListItem  ADD  CONSTRAINT FK_PackingListItem_PackingList forEIGN KEY(pklst_id)
REFERENCES PackingList (pklst_id)
;
-- FK_PackingListItem_PackingList
;
/****** Object:  foreignKey FK_PackingListItem_Producto    Script Date: 07/30/2012 17:19:56 ******/
alter table PackingListItem  ADD  CONSTRAINT FK_PackingListItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_PackingListItem_Producto
;
/****** Object:  foreignKey FK_PackingListItemBorradoTMP_PackingListTMP    Script Date: 07/30/2012 17:19:57 ******/
alter table PackingListItemBorradoTMP  ADD  CONSTRAINT FK_PackingListItemBorradoTMP_PackingListTMP forEIGN KEY(pklstTMP_id)
REFERENCES PackingListTMP (pklstTMP_id)
;
-- FK_PackingListItemBorradoTMP_PackingListTMP
;
/****** Object:  foreignKey FK_PackingListItemTMP_PackingListTMP    Script Date: 07/30/2012 17:20:03 ******/
alter table PackingListItemTMP  ADD  CONSTRAINT FK_PackingListItemTMP_PackingListTMP forEIGN KEY(pklstTMP_id)
REFERENCES PackingListTMP (pklstTMP_id)
;
-- FK_PackingListItemTMP_PackingListTMP
;
/****** Object:  foreignKey FK_Pais_Usuario    Script Date: 07/30/2012 17:20:13 ******/
alter table Pais  ADD  CONSTRAINT FK_Pais_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Pais_Usuario
;
/****** Object:  foreignKey FK_ParteDiario_Alumno    Script Date: 07/30/2012 17:20:21 ******/
alter table ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Alumno forEIGN KEY(alum_id)
REFERENCES Alumno (alum_id)
;
-- FK_ParteDiario_Alumno
;
/****** Object:  foreignKey FK_ParteDiario_Cliente    Script Date: 07/30/2012 17:20:21 ******/
alter table ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_ParteDiario_Cliente
;
/****** Object:  foreignKey FK_ParteDiario_Contacto    Script Date: 07/30/2012 17:20:21 ******/
alter table ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Contacto forEIGN KEY(cont_id)
REFERENCES Contacto (cont_id)
;
-- FK_ParteDiario_Contacto
;
/****** Object:  foreignKey FK_ParteDiario_Departamento    Script Date: 07/30/2012 17:20:21 ******/
alter table ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Departamento forEIGN KEY(dpto_id)
REFERENCES Departamento (dpto_id)
;
-- FK_ParteDiario_Departamento
;
/****** Object:  foreignKey FK_ParteDiario_Legajo    Script Date: 07/30/2012 17:20:21 ******/
alter table ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_ParteDiario_Legajo
;
/****** Object:  foreignKey FK_ParteDiario_ParteDiario    Script Date: 07/30/2012 17:20:21 ******/
alter table ParteDiario  ADD  CONSTRAINT FK_ParteDiario_ParteDiario forEIGN KEY(ptd_id_padre)
REFERENCES ParteDiario (ptd_id)
;
-- FK_ParteDiario_ParteDiario
;
/****** Object:  foreignKey FK_ParteDiario_ParteDiarioTipo    Script Date: 07/30/2012 17:20:21 ******/
alter table ParteDiario  ADD  CONSTRAINT FK_ParteDiario_ParteDiarioTipo forEIGN KEY(ptdt_id)
REFERENCES ParteDiarioTipo (ptdt_id)
;
-- FK_ParteDiario_ParteDiarioTipo
;
/****** Object:  foreignKey FK_ParteDiario_Prioridad    Script Date: 07/30/2012 17:20:21 ******/
alter table ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Prioridad forEIGN KEY(prio_id)
REFERENCES Prioridad (prio_id)
;
-- FK_ParteDiario_Prioridad
;
/****** Object:  foreignKey FK_ParteDiario_ProductoNumeroSerie    Script Date: 07/30/2012 17:20:21 ******/
alter table ParteDiario  ADD  CONSTRAINT FK_ParteDiario_ProductoNumeroSerie forEIGN KEY(prns_id)
REFERENCES ProductoNumeroSerie (prns_id)
;
-- FK_ParteDiario_ProductoNumeroSerie
;
/****** Object:  foreignKey FK_ParteDiario_Proveedor    Script Date: 07/30/2012 17:20:21 ******/
alter table ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_ParteDiario_Proveedor
;
/****** Object:  foreignKey FK_ParteDiario_Sucursal    Script Date: 07/30/2012 17:20:21 ******/
alter table ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_ParteDiario_Sucursal
;
/****** Object:  foreignKey FK_ParteDiario_TareaEstado    Script Date: 07/30/2012 17:20:22 ******/
alter table ParteDiario  ADD  CONSTRAINT FK_ParteDiario_TareaEstado forEIGN KEY(tarest_id)
REFERENCES TareaEstado (tarest_id)
;
-- FK_ParteDiario_TareaEstado
;
/****** Object:  foreignKey FK_ParteDiario_Usuario    Script Date: 07/30/2012 17:20:22 ******/
alter table ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ParteDiario_Usuario
;
/****** Object:  foreignKey FK_ParteDiario_Usuario1    Script Date: 07/30/2012 17:20:22 ******/
alter table ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Usuario1 forEIGN KEY(us_id_responsable)
REFERENCES Usuario (us_id)
;
-- FK_ParteDiario_Usuario1
;
/****** Object:  foreignKey FK_ParteDiario_Usuario2    Script Date: 07/30/2012 17:20:22 ******/
alter table ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Usuario2 forEIGN KEY(us_id_asignador)
REFERENCES Usuario (us_id)
;
-- FK_ParteDiario_Usuario2
;
/****** Object:  foreignKey FK_ParteDiario_Vendedor    Script Date: 07/30/2012 17:20:22 ******/
alter table ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Vendedor forEIGN KEY(ven_id)
REFERENCES Vendedor (ven_id)
;
-- FK_ParteDiario_Vendedor
;
/****** Object:  foreignKey FK_ParteDiarioTipo_Usuario    Script Date: 07/30/2012 17:20:24 ******/
alter table ParteDiarioTipo  ADD  CONSTRAINT FK_ParteDiarioTipo_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ParteDiarioTipo_Usuario
;
/****** Object:  foreignKey FK_ParteProdKit_DepositoLogico    Script Date: 07/30/2012 17:20:28 ******/
alter table ParteProdKit  ADD  CONSTRAINT FK_ParteProdKit_DepositoLogico forEIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_ParteProdKit_DepositoLogico
;
/****** Object:  foreignKey FK_ParteProdKit_Documento    Script Date: 07/30/2012 17:20:28 ******/
alter table ParteProdKit  ADD  CONSTRAINT FK_ParteProdKit_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_ParteProdKit_Documento
;
/****** Object:  foreignKey FK_ParteProdKit_DocumentoTipo    Script Date: 07/30/2012 17:20:28 ******/
alter table ParteProdKit  ADD  CONSTRAINT FK_ParteProdKit_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_ParteProdKit_DocumentoTipo
;
/****** Object:  foreignKey FK_ParteProdKit_Legajo    Script Date: 07/30/2012 17:20:28 ******/
alter table ParteProdKit  ADD  CONSTRAINT FK_ParteProdKit_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_ParteProdKit_Legajo
;
/****** Object:  foreignKey FK_ParteProdKit_StockIngreso    Script Date: 07/30/2012 17:20:28 ******/
alter table ParteProdKit  ADD  CONSTRAINT FK_ParteProdKit_StockIngreso forEIGN KEY(st_id1)
REFERENCES Stock (st_id)
;
-- FK_ParteProdKit_StockIngreso
;
/****** Object:  foreignKey FK_ParteProdKit_StockSalida    Script Date: 07/30/2012 17:20:28 ******/
alter table ParteProdKit  ADD  CONSTRAINT FK_ParteProdKit_StockSalida forEIGN KEY(st_id2)
REFERENCES Stock (st_id)
;
-- FK_ParteProdKit_StockSalida
;
/****** Object:  foreignKey FK_ParteProdKit_Sucursal    Script Date: 07/30/2012 17:20:28 ******/
alter table ParteProdKit  ADD  CONSTRAINT FK_ParteProdKit_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_ParteProdKit_Sucursal
;
/****** Object:  foreignKey FK_ParteProdKitItem_DepositoLogico    Script Date: 07/30/2012 17:20:30 ******/
alter table ParteProdKitItem  ADD  CONSTRAINT FK_ParteProdKitItem_DepositoLogico forEIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_ParteProdKitItem_DepositoLogico
;
/****** Object:  foreignKey FK_ParteProdKitItem_ParteProdKit    Script Date: 07/30/2012 17:20:31 ******/
alter table ParteProdKitItem  ADD  CONSTRAINT FK_ParteProdKitItem_ParteProdKit forEIGN KEY(ppk_id)
REFERENCES ParteProdKit (ppk_id)
;
-- FK_ParteProdKitItem_ParteProdKit
;
/****** Object:  foreignKey FK_ParteProdKitItem_Producto    Script Date: 07/30/2012 17:20:31 ******/
alter table ParteProdKitItem  ADD  CONSTRAINT FK_ParteProdKitItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ParteProdKitItem_Producto
;
/****** Object:  foreignKey FK_ParteProdKitItem_ProductoFormulaKit    Script Date: 07/30/2012 17:20:31 ******/
alter table ParteProdKitItem  ADD  CONSTRAINT FK_ParteProdKitItem_ProductoFormulaKit forEIGN KEY(prfk_id)
REFERENCES ProductoFormulaKit (prfk_id)
;
-- FK_ParteProdKitItem_ProductoFormulaKit
;
/****** Object:  foreignKey FK_ParteProdKitItem_StockLote    Script Date: 07/30/2012 17:20:31 ******/
alter table ParteProdKitItem  ADD  CONSTRAINT FK_ParteProdKitItem_StockLote forEIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_ParteProdKitItem_StockLote
;
/****** Object:  foreignKey FK_ParteProdKitItemA_ParteProdKitItem    Script Date: 07/30/2012 17:20:32 ******/
alter table ParteProdKitItemA  ADD  CONSTRAINT FK_ParteProdKitItemA_ParteProdKitItem forEIGN KEY(ppki_id)
REFERENCES ParteProdKitItem (ppki_id)
;
-- FK_ParteProdKitItemA_ParteProdKitItem
;
/****** Object:  foreignKey FK_ParteProdKitItemA_Producto    Script Date: 07/30/2012 17:20:32 ******/
alter table ParteProdKitItemA  ADD  CONSTRAINT FK_ParteProdKitItemA_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ParteProdKitItemA_Producto
;
/****** Object:  foreignKey FK_ParteProdKitItemATMP_ParteProdKitItemTMP    Script Date: 07/30/2012 17:20:34 ******/
alter table ParteProdKitItemATMP  ADD  CONSTRAINT FK_ParteProdKitItemATMP_ParteProdKitItemTMP forEIGN KEY(ppkiTMP_id)
REFERENCES ParteProdKitItemTMP (ppkiTMP_id)
;
-- FK_ParteProdKitItemATMP_ParteProdKitItemTMP
;
/****** Object:  foreignKey FK_ParteProdKitItemATMP_ParteProdKitTMP    Script Date: 07/30/2012 17:20:34 ******/
alter table ParteProdKitItemATMP  ADD  CONSTRAINT FK_ParteProdKitItemATMP_ParteProdKitTMP forEIGN KEY(ppkTMP_id)
REFERENCES ParteProdKitTMP (ppkTMP_id)
;
-- FK_ParteProdKitItemATMP_ParteProdKitTMP
;
/****** Object:  foreignKey FK_ParteProdKitItemBorradoTMP_ParteProdKitTMP    Script Date: 07/30/2012 17:20:35 ******/
alter table ParteProdKitItemBorradoTMP  ADD  CONSTRAINT FK_ParteProdKitItemBorradoTMP_ParteProdKitTMP forEIGN KEY(ppkTMP_id)
REFERENCES ParteProdKitTMP (ppkTMP_id)
;
-- FK_ParteProdKitItemBorradoTMP_ParteProdKitTMP
;
/****** Object:  foreignKey FK_ParteProdKitSerieTMP_ParteProdKitItemTMP    Script Date: 07/30/2012 17:20:38 ******/
alter table ParteProdKitItemSerieTMP  ADD  CONSTRAINT FK_ParteProdKitSerieTMP_ParteProdKitItemTMP forEIGN KEY(ppkiTMP_id)
REFERENCES ParteProdKitItemTMP (ppkiTMP_id)
;
-- FK_ParteProdKitSerieTMP_ParteProdKitItemTMP
;
/****** Object:  foreignKey FK_ParteProdKitSerieTMP_ParteProdKitTMP    Script Date: 07/30/2012 17:20:38 ******/
alter table ParteProdKitItemSerieTMP  ADD  CONSTRAINT FK_ParteProdKitSerieTMP_ParteProdKitTMP forEIGN KEY(ppkTMP_id)
REFERENCES ParteProdKitTMP (ppkTMP_id)
;
-- FK_ParteProdKitSerieTMP_ParteProdKitTMP
;
/****** Object:  foreignKey FK_ParteProdKitItemTMP_ParteProdKitTMP    Script Date: 07/30/2012 17:20:40 ******/
alter table ParteProdKitItemTMP  ADD  CONSTRAINT FK_ParteProdKitItemTMP_ParteProdKitTMP forEIGN KEY(ppkTMP_id)
REFERENCES ParteProdKitTMP (ppkTMP_id)
;
-- FK_ParteProdKitItemTMP_ParteProdKitTMP
;
/****** Object:  foreignKey FK_ParteReparacion_CentroCosto    Script Date: 07/30/2012 17:20:51 ******/
alter table ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_ParteReparacion_CentroCosto
;
/****** Object:  foreignKey FK_ParteReparacion_Cliente    Script Date: 07/30/2012 17:20:51 ******/
alter table ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_ParteReparacion_Cliente
;
/****** Object:  foreignKey FK_ParteReparacion_ClienteSucursal    Script Date: 07/30/2012 17:20:51 ******/
alter table ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_ClienteSucursal forEIGN KEY(clis_id)
REFERENCES ClienteSucursal (clis_id)
;
-- FK_ParteReparacion_ClienteSucursal
;
/****** Object:  foreignKey FK_ParteReparacion_CondicionPago    Script Date: 07/30/2012 17:20:51 ******/
alter table ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_CondicionPago forEIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_ParteReparacion_CondicionPago
;
/****** Object:  foreignKey FK_ParteReparacion_Documento    Script Date: 07/30/2012 17:20:52 ******/
alter table ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_ParteReparacion_Documento
;
/****** Object:  foreignKey FK_ParteReparacion_DocumentoTipo    Script Date: 07/30/2012 17:20:52 ******/
alter table ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_ParteReparacion_DocumentoTipo
;
/****** Object:  foreignKey FK_ParteReparacion_Empresa    Script Date: 07/30/2012 17:20:52 ******/
alter table ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_ParteReparacion_Empresa
;
/****** Object:  foreignKey FK_ParteReparacion_Estado    Script Date: 07/30/2012 17:20:52 ******/
alter table ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_Estado forEIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_ParteReparacion_Estado
;
/****** Object:  foreignKey FK_ParteReparacion_Legajo    Script Date: 07/30/2012 17:20:52 ******/
alter table ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_ParteReparacion_Legajo
;
/****** Object:  foreignKey FK_ParteReparacion_ListaDescuento    Script Date: 07/30/2012 17:20:52 ******/
alter table ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_ListaDescuento forEIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_ParteReparacion_ListaDescuento
;
/****** Object:  foreignKey FK_ParteReparacion_ListaPrecio    Script Date: 07/30/2012 17:20:52 ******/
alter table ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_ListaPrecio forEIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_ParteReparacion_ListaPrecio
;
/****** Object:  foreignKey FK_ParteReparacion_OrdenServicio    Script Date: 07/30/2012 17:20:52 ******/
alter table ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_OrdenServicio forEIGN KEY(os_id)
REFERENCES OrdenServicio (os_id)
;
-- FK_ParteReparacion_OrdenServicio
;
/****** Object:  foreignKey FK_ParteReparacion_ProductoNumeroSerie    Script Date: 07/30/2012 17:20:52 ******/
alter table ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_ProductoNumeroSerie forEIGN KEY(prns_id)
REFERENCES ProductoNumeroSerie (prns_id)
;
-- FK_ParteReparacion_ProductoNumeroSerie
;
/****** Object:  foreignKey FK_ParteReparacion_Stock    Script Date: 07/30/2012 17:20:53 ******/
alter table ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_Stock forEIGN KEY(st_id)
REFERENCES Stock (st_id)
;
-- FK_ParteReparacion_Stock
;
/****** Object:  foreignKey FK_ParteReparacion_Sucursal    Script Date: 07/30/2012 17:20:53 ******/
alter table ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_ParteReparacion_Sucursal
;
/****** Object:  foreignKey FK_ParteReparacion_Usuario    Script Date: 07/30/2012 17:20:53 ******/
alter table ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_Usuario forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_ParteReparacion_Usuario
;
/****** Object:  foreignKey FK_ParteReparacionItem_CentroCosto    Script Date: 07/30/2012 17:20:57 ******/
alter table ParteReparacionItem  ADD  CONSTRAINT FK_ParteReparacionItem_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_ParteReparacionItem_CentroCosto
;
/****** Object:  foreignKey FK_ParteReparacionItem_ParteReparacion    Script Date: 07/30/2012 17:20:57 ******/
alter table ParteReparacionItem  ADD  CONSTRAINT FK_ParteReparacionItem_ParteReparacion forEIGN KEY(prp_id)
REFERENCES ParteReparacion (prp_id)
;
-- FK_ParteReparacionItem_ParteReparacion
;
/****** Object:  foreignKey FK_ParteReparacionItem_Producto    Script Date: 07/30/2012 17:20:57 ******/
alter table ParteReparacionItem  ADD  CONSTRAINT FK_ParteReparacionItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ParteReparacionItem_Producto
;
/****** Object:  foreignKey FK_ParteReparacionItem_StockLote    Script Date: 07/30/2012 17:20:57 ******/
alter table ParteReparacionItem  ADD  CONSTRAINT FK_ParteReparacionItem_StockLote forEIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_ParteReparacionItem_StockLote
;
/****** Object:  foreignKey FK_ParteReparacionItemBorradoTMP_ParteReparacionTMP    Script Date: 07/30/2012 17:20:58 ******/
alter table ParteReparacionItemBorradoTMP  ADD  CONSTRAINT FK_ParteReparacionItemBorradoTMP_ParteReparacionTMP forEIGN KEY(prpTMP_id)
REFERENCES ParteReparacionTMP (prpTMP_id)
;
-- FK_ParteReparacionItemBorradoTMP_ParteReparacionTMP
;
/****** Object:  foreignKey FK_ParteReparacionItemSerieTMP_ParteReparacionItemTMP    Script Date: 07/30/2012 17:21:01 ******/
alter table ParteReparacionItemSerieTMP  ADD  CONSTRAINT FK_ParteReparacionItemSerieTMP_ParteReparacionItemTMP forEIGN KEY(prpiTMP_id)
REFERENCES ParteReparacionItemTMP (prpiTMP_id)
;
-- FK_ParteReparacionItemSerieTMP_ParteReparacionItemTMP
;
/****** Object:  foreignKey FK_ParteReparacionItemSerieTMP_ParteReparacionTMP    Script Date: 07/30/2012 17:21:01 ******/
alter table ParteReparacionItemSerieTMP  ADD  CONSTRAINT FK_ParteReparacionItemSerieTMP_ParteReparacionTMP forEIGN KEY(prpTMP_id)
REFERENCES ParteReparacionTMP (prpTMP_id)
;
-- FK_ParteReparacionItemSerieTMP_ParteReparacionTMP
;
/****** Object:  foreignKey FK_ParteReparacionItemTMP_ParteReparacionTMP    Script Date: 07/30/2012 17:21:05 ******/
alter table ParteReparacionItemTMP  ADD  CONSTRAINT FK_ParteReparacionItemTMP_ParteReparacionTMP forEIGN KEY(prpTMP_id)
REFERENCES ParteReparacionTMP (prpTMP_id)
;
-- FK_ParteReparacionItemTMP_ParteReparacionTMP
;
/****** Object:  foreignKey FK_PedidoCompra_CentroCosto    Script Date: 07/30/2012 17:21:19 ******/
alter table PedidoCompra  ADD  CONSTRAINT FK_PedidoCompra_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PedidoCompra_CentroCosto
;
/****** Object:  foreignKey FK_PedidoCompra_Documento    Script Date: 07/30/2012 17:21:19 ******/
alter table PedidoCompra  ADD  CONSTRAINT FK_PedidoCompra_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_PedidoCompra_Documento
;
/****** Object:  foreignKey FK_PedidoCompra_DocumentoTipo    Script Date: 07/30/2012 17:21:19 ******/
alter table PedidoCompra  ADD  CONSTRAINT FK_PedidoCompra_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_PedidoCompra_DocumentoTipo
;
/****** Object:  foreignKey FK_PedidoCompra_Estado    Script Date: 07/30/2012 17:21:19 ******/
alter table PedidoCompra  ADD  CONSTRAINT FK_PedidoCompra_Estado forEIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_PedidoCompra_Estado
;
/****** Object:  foreignKey FK_PedidoCompra_Legajo    Script Date: 07/30/2012 17:21:19 ******/
alter table PedidoCompra  ADD  CONSTRAINT FK_PedidoCompra_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_PedidoCompra_Legajo
;
/****** Object:  foreignKey FK_PedidoCompra_ListaPrecio    Script Date: 07/30/2012 17:21:19 ******/
alter table PedidoCompra  ADD  CONSTRAINT FK_PedidoCompra_ListaPrecio forEIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_PedidoCompra_ListaPrecio
;
/****** Object:  foreignKey FK_PedidoCompra_Sucursal    Script Date: 07/30/2012 17:21:20 ******/
alter table PedidoCompra  ADD  CONSTRAINT FK_PedidoCompra_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_PedidoCompra_Sucursal
;
/****** Object:  foreignKey FK_PedidoCompra_Usuario    Script Date: 07/30/2012 17:21:20 ******/
alter table PedidoCompra  ADD  CONSTRAINT FK_PedidoCompra_Usuario forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_PedidoCompra_Usuario
;
/****** Object:  foreignKey FK_PedidoCompraItem_PedidoCompra    Script Date: 07/30/2012 17:21:24 ******/
alter table PedidoCompraItem  ADD  CONSTRAINT FK_PedidoCompraItem_PedidoCompra forEIGN KEY(pc_id)
REFERENCES PedidoCompra (pc_id)
;
-- FK_PedidoCompraItem_PedidoCompra
;
/****** Object:  foreignKey FK_PedidoCompraItem_Producto    Script Date: 07/30/2012 17:21:24 ******/
alter table PedidoCompraItem  ADD  CONSTRAINT FK_PedidoCompraItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_PedidoCompraItem_Producto
;
/****** Object:  foreignKey FK_PedidoCompraItem_Usuario    Script Date: 07/30/2012 17:21:24 ******/
alter table PedidoCompraItem  ADD  CONSTRAINT FK_PedidoCompraItem_Usuario forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_PedidoCompraItem_Usuario
;
/****** Object:  foreignKey FK_PedidoCompraItemBorradoTMP_PedidoCompraTMP    Script Date: 07/30/2012 17:21:25 ******/
alter table PedidoCompraItemBorradoTMP  ADD  CONSTRAINT FK_PedidoCompraItemBorradoTMP_PedidoCompraTMP forEIGN KEY(pcTMP_id)
REFERENCES PedidoCompraTMP (pcTMP_id)
;
-- FK_PedidoCompraItemBorradoTMP_PedidoCompraTMP
;
/****** Object:  foreignKey FK_PedidoCompraItemTMP_PedidoCompraTMP    Script Date: 07/30/2012 17:21:30 ******/
alter table PedidoCompraItemTMP  ADD  CONSTRAINT FK_PedidoCompraItemTMP_PedidoCompraTMP forEIGN KEY(pcTMP_id)
REFERENCES PedidoCompraTMP (pcTMP_id)
;
-- FK_PedidoCompraItemTMP_PedidoCompraTMP
;
/****** Object:  foreignKey FK_PedidoCotizacionCompra_CotizacionCompraItem    Script Date: 07/30/2012 17:21:35 ******/
alter table PedidoCotizacionCompra  ADD  CONSTRAINT FK_PedidoCotizacionCompra_CotizacionCompraItem forEIGN KEY(coti_id)
REFERENCES CotizacionCompraItem (coti_id)
;
-- FK_PedidoCotizacionCompra_CotizacionCompraItem
;
/****** Object:  foreignKey FK_PedidoCotizacionCompra_PedidoCompraItem    Script Date: 07/30/2012 17:21:35 ******/
alter table PedidoCotizacionCompra  ADD  CONSTRAINT FK_PedidoCotizacionCompra_PedidoCompraItem forEIGN KEY(pci_id)
REFERENCES PedidoCompraItem (pci_id)
;
-- FK_PedidoCotizacionCompra_PedidoCompraItem
;
/****** Object:  foreignKey FK_PedidoDevolucionCompra_PedidoCompraItemDevolucion    Script Date: 07/30/2012 17:21:38 ******/
alter table PedidoDevolucionCompra  ADD  CONSTRAINT FK_PedidoDevolucionCompra_PedidoCompraItemDevolucion forEIGN KEY(pci_id_devolucion)
REFERENCES PedidoCompraItem (pci_id)
;
-- FK_PedidoDevolucionCompra_PedidoCompraItemDevolucion
;
/****** Object:  foreignKey FK_PedidoDevolucionCompra_PedidoCompraItemPedido    Script Date: 07/30/2012 17:21:38 ******/
alter table PedidoDevolucionCompra  ADD  CONSTRAINT FK_PedidoDevolucionCompra_PedidoCompraItemPedido forEIGN KEY(pci_id_pedido)
REFERENCES PedidoCompraItem (pci_id)
;
-- FK_PedidoDevolucionCompra_PedidoCompraItemPedido
;
/****** Object:  foreignKey FK_PedidoDevolucionCompraTMP_PedidoCompraTMP    Script Date: 07/30/2012 17:21:40 ******/
alter table PedidoDevolucionCompraTMP  ADD  CONSTRAINT FK_PedidoDevolucionCompraTMP_PedidoCompraTMP forEIGN KEY(pcTMP_id)
REFERENCES PedidoCompraTMP (pcTMP_id)
;
-- FK_PedidoDevolucionCompraTMP_PedidoCompraTMP
;
/****** Object:  foreignKey FK_PedidoDevolucionVenta_PedidoVentaItemDevolucion    Script Date: 07/30/2012 17:21:41 ******/
alter table PedidoDevolucionVenta  ADD  CONSTRAINT FK_PedidoDevolucionVenta_PedidoVentaItemDevolucion forEIGN KEY(pvi_id_devolucion)
REFERENCES PedidoVentaItem (pvi_id)
;
-- FK_PedidoDevolucionVenta_PedidoVentaItemDevolucion
;
/****** Object:  foreignKey FK_PedidoDevolucionVenta_PedidoVentaItemPedido    Script Date: 07/30/2012 17:21:41 ******/
alter table PedidoDevolucionVenta  ADD  CONSTRAINT FK_PedidoDevolucionVenta_PedidoVentaItemPedido forEIGN KEY(pvi_id_pedido)
REFERENCES PedidoVentaItem (pvi_id)
;
-- FK_PedidoDevolucionVenta_PedidoVentaItemPedido
;
/****** Object:  foreignKey FK_PedidoFacturaVenta_FacturaVentaItem    Script Date: 07/30/2012 17:21:43 ******/
alter table PedidoFacturaVenta  ADD  CONSTRAINT FK_PedidoFacturaVenta_FacturaVentaItem forEIGN KEY(fvi_id)
REFERENCES FacturaVentaItem (fvi_id)
;
-- FK_PedidoFacturaVenta_FacturaVentaItem
;
/****** Object:  foreignKey FK_PedidoFacturaVenta_PedidoVentaItem    Script Date: 07/30/2012 17:21:43 ******/
alter table PedidoFacturaVenta  ADD  CONSTRAINT FK_PedidoFacturaVenta_PedidoVentaItem forEIGN KEY(pvi_id)
REFERENCES PedidoVentaItem (pvi_id)
;
-- FK_PedidoFacturaVenta_PedidoVentaItem
;
/****** Object:  foreignKey FK_PedidoOrdenCompra_OrdenCompraItem    Script Date: 07/30/2012 17:21:46 ******/
alter table PedidoOrdenCompra  ADD  CONSTRAINT FK_PedidoOrdenCompra_OrdenCompraItem forEIGN KEY(oci_id)
REFERENCES OrdenCompraItem (oci_id)
;
-- FK_PedidoOrdenCompra_OrdenCompraItem
;
/****** Object:  foreignKey FK_PedidoOrdenCompra_PedidoCompraItem    Script Date: 07/30/2012 17:21:46 ******/
alter table PedidoOrdenCompra  ADD  CONSTRAINT FK_PedidoOrdenCompra_PedidoCompraItem forEIGN KEY(pci_id)
REFERENCES PedidoCompraItem (pci_id)
;
-- FK_PedidoOrdenCompra_PedidoCompraItem
;
/****** Object:  foreignKey FK_PedidoPackingList_PackingListItem    Script Date: 07/30/2012 17:21:49 ******/
alter table PedidoPackingList  ADD  CONSTRAINT FK_PedidoPackingList_PackingListItem forEIGN KEY(pklsti_id)
REFERENCES PackingListItem (pklsti_id)
;
-- FK_PedidoPackingList_PackingListItem
;
/****** Object:  foreignKey FK_PedidoPackingList_PedidoVentaItem    Script Date: 07/30/2012 17:21:49 ******/
alter table PedidoPackingList  ADD  CONSTRAINT FK_PedidoPackingList_PedidoVentaItem forEIGN KEY(pvi_id)
REFERENCES PedidoVentaItem (pvi_id)
;
-- FK_PedidoPackingList_PedidoVentaItem
;
/****** Object:  foreignKey FK_PedidoRemitoVenta_PedidoVentaItem    Script Date: 07/30/2012 17:21:52 ******/
alter table PedidoRemitoVenta  ADD  CONSTRAINT FK_PedidoRemitoVenta_PedidoVentaItem forEIGN KEY(pvi_id)
REFERENCES PedidoVentaItem (pvi_id)
;
-- FK_PedidoRemitoVenta_PedidoVentaItem
;
/****** Object:  foreignKey FK_PedidoRemitoVenta_RemitoVentaItem    Script Date: 07/30/2012 17:21:52 ******/
alter table PedidoRemitoVenta  ADD  CONSTRAINT FK_PedidoRemitoVenta_RemitoVentaItem forEIGN KEY(rvi_id)
REFERENCES RemitoVentaItem (rvi_id)
;
-- FK_PedidoRemitoVenta_RemitoVentaItem
;
/****** Object:  foreignKey FK_PedidoVenta_CentroCosto    Script Date: 07/30/2012 17:22:03 ******/
alter table PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PedidoVenta_CentroCosto
;
/****** Object:  foreignKey FK_PedidoVenta_Cliente    Script Date: 07/30/2012 17:22:04 ******/
alter table PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_PedidoVenta_Cliente
;
/****** Object:  foreignKey FK_PedidoVenta_ClienteSucursal    Script Date: 07/30/2012 17:22:04 ******/
alter table PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_ClienteSucursal forEIGN KEY(clis_id)
REFERENCES ClienteSucursal (clis_id)
;
-- FK_PedidoVenta_ClienteSucursal
;
/****** Object:  foreignKey FK_PedidoVenta_CondicionPago    Script Date: 07/30/2012 17:22:04 ******/
alter table PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_CondicionPago forEIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_PedidoVenta_CondicionPago
;
/****** Object:  foreignKey FK_PedidoVenta_Documento    Script Date: 07/30/2012 17:22:04 ******/
alter table PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_PedidoVenta_Documento
;
/****** Object:  foreignKey FK_PedidoVenta_DocumentoTipo    Script Date: 07/30/2012 17:22:04 ******/
alter table PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_PedidoVenta_DocumentoTipo
;
/****** Object:  foreignKey FK_PedidoVenta_Empresa    Script Date: 07/30/2012 17:22:04 ******/
alter table PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_PedidoVenta_Empresa
;
/****** Object:  foreignKey FK_PedidoVenta_Legajo    Script Date: 07/30/2012 17:22:04 ******/
alter table PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_PedidoVenta_Legajo
;
/****** Object:  foreignKey FK_PedidoVenta_ListaDescuento    Script Date: 07/30/2012 17:22:04 ******/
alter table PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_ListaDescuento forEIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_PedidoVenta_ListaDescuento
;
/****** Object:  foreignKey FK_PedidoVenta_ListaPrecio    Script Date: 07/30/2012 17:22:04 ******/
alter table PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_ListaPrecio forEIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_PedidoVenta_ListaPrecio
;
/****** Object:  foreignKey FK_PedidoVenta_Provincia    Script Date: 07/30/2012 17:22:04 ******/
alter table PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_Provincia forEIGN KEY(pro_id_origen)
REFERENCES Provincia (pro_id)
;
-- FK_PedidoVenta_Provincia
;
/****** Object:  foreignKey FK_PedidoVenta_Provincia1    Script Date: 07/30/2012 17:22:04 ******/
alter table PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_Provincia1 forEIGN KEY(pro_id_destino)
REFERENCES Provincia (pro_id)
;
-- FK_PedidoVenta_Provincia1
;
/****** Object:  foreignKey FK_PedidoVenta_Transporte    Script Date: 07/30/2012 17:22:05 ******/
alter table PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_Transporte forEIGN KEY(trans_id)
REFERENCES Transporte (trans_id)
;
-- FK_PedidoVenta_Transporte
;
/****** Object:  foreignKey FK_PedidoVenta_Usuario    Script Date: 07/30/2012 17:22:05 ******/
alter table PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_PedidoVenta_Usuario
;
/****** Object:  foreignKey FK_PedidoVenta_Vendedor    Script Date: 07/30/2012 17:22:05 ******/
alter table PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_Vendedor forEIGN KEY(ven_id)
REFERENCES Vendedor (ven_id)
;
-- FK_PedidoVenta_Vendedor
;
/****** Object:  foreignKey FK_PedidoVentaItem_CentroCosto    Script Date: 07/30/2012 17:22:10 ******/
alter table PedidoVentaItem  ADD  CONSTRAINT FK_PedidoVentaItem_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PedidoVentaItem_CentroCosto
;
/****** Object:  foreignKey FK_PedidoVentaItem_PedidoVenta    Script Date: 07/30/2012 17:22:10 ******/
alter table PedidoVentaItem  ADD  CONSTRAINT FK_PedidoVentaItem_PedidoVenta forEIGN KEY(pv_id)
REFERENCES PedidoVenta (pv_id)
;
-- FK_PedidoVentaItem_PedidoVenta
;
/****** Object:  foreignKey FK_PedidoVentaItem_Producto    Script Date: 07/30/2012 17:22:10 ******/
alter table PedidoVentaItem  ADD  CONSTRAINT FK_PedidoVentaItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_PedidoVentaItem_Producto
;
/****** Object:  foreignKey FK_PedidoVentaItemBorradoTMP_PedidoVentaTMP    Script Date: 07/30/2012 17:22:11 ******/
alter table PedidoVentaItemBorradoTMP  ADD  CONSTRAINT FK_PedidoVentaItemBorradoTMP_PedidoVentaTMP forEIGN KEY(pvTMP_id)
REFERENCES PedidoVentaTMP (pvTMP_id)
;
-- FK_PedidoVentaItemBorradoTMP_PedidoVentaTMP
;
/****** Object:  foreignKey FK_PedidoVentaItemStock_PedidoVenta    Script Date: 07/30/2012 17:22:13 ******/
alter table PedidoVentaItemStock  ADD  CONSTRAINT FK_PedidoVentaItemStock_PedidoVenta forEIGN KEY(pv_id)
REFERENCES PedidoVenta (pv_id)
;
-- FK_PedidoVentaItemStock_PedidoVenta
;
/****** Object:  foreignKey FK_PedidoVentaItemStock_Producto    Script Date: 07/30/2012 17:22:13 ******/
alter table PedidoVentaItemStock  ADD  CONSTRAINT FK_PedidoVentaItemStock_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_PedidoVentaItemStock_Producto
;
/****** Object:  foreignKey FK_PedidoVentaItemStock_ProductoKit    Script Date: 07/30/2012 17:22:13 ******/
alter table PedidoVentaItemStock  ADD  CONSTRAINT FK_PedidoVentaItemStock_ProductoKit forEIGN KEY(pr_id_kit)
REFERENCES Producto (pr_id)
;
-- FK_PedidoVentaItemStock_ProductoKit
;
/****** Object:  foreignKey FK_PedidoVentaItemStock_ProductoKitPadre    Script Date: 07/30/2012 17:22:13 ******/
alter table PedidoVentaItemStock  ADD  CONSTRAINT FK_PedidoVentaItemStock_ProductoKitPadre forEIGN KEY(pr_id_kitpadre)
REFERENCES Producto (pr_id)
;
-- FK_PedidoVentaItemStock_ProductoKitPadre
;
/****** Object:  foreignKey FK_PedidoVentaItemTMP_PedidoVentaTMP    Script Date: 07/30/2012 17:22:18 ******/
alter table PedidoVentaItemTMP  ADD  CONSTRAINT FK_PedidoVentaItemTMP_PedidoVentaTMP forEIGN KEY(pvTMP_id)
REFERENCES PedidoVentaTMP (pvTMP_id)
;
-- FK_PedidoVentaItemTMP_PedidoVentaTMP
;
/****** Object:  foreignKey FK_Percepcion_PercepcionTipo    Script Date: 07/30/2012 17:22:29 ******/
alter table Percepcion  ADD  CONSTRAINT FK_Percepcion_PercepcionTipo forEIGN KEY(perct_id)
REFERENCES PercepcionTipo (perct_id)
;
-- FK_Percepcion_PercepcionTipo
;
/****** Object:  foreignKey FK_Percepcion_Talonario    Script Date: 07/30/2012 17:22:29 ******/
alter table Percepcion  ADD  CONSTRAINT FK_Percepcion_Talonario forEIGN KEY(ta_id)
REFERENCES Talonario (ta_id)
;
-- FK_Percepcion_Talonario
;
/****** Object:  foreignKey FK_Percepcion_Usuario    Script Date: 07/30/2012 17:22:29 ******/
alter table Percepcion  ADD  CONSTRAINT FK_Percepcion_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Percepcion_Usuario
;
/****** Object:  foreignKey FK_PercepcionItem_Percepcion    Script Date: 07/30/2012 17:22:33 ******/
alter table PercepcionItem  ADD  CONSTRAINT FK_PercepcionItem_Percepcion forEIGN KEY(perc_id)
REFERENCES Percepcion (perc_id)
;
-- FK_PercepcionItem_Percepcion
;
/****** Object:  foreignKey FK_PercepcionTipo_Cuenta    Script Date: 07/30/2012 17:22:36 ******/
alter table PercepcionTipo  ADD  CONSTRAINT FK_PercepcionTipo_Cuenta forEIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_PercepcionTipo_Cuenta
;
/****** Object:  foreignKey FK_PercepcionTipo_Usuario    Script Date: 07/30/2012 17:22:36 ******/
alter table PercepcionTipo  ADD  CONSTRAINT FK_PercepcionTipo_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_PercepcionTipo_Usuario
;
/****** Object:  foreignKey FK_Permiso_Permiso    Script Date: 07/30/2012 17:22:38 ******/
alter table Permiso  ADD  CONSTRAINT FK_Permiso_Permiso forEIGN KEY(per_id_padre)
REFERENCES Permiso (per_id)
;
-- FK_Permiso_Permiso
;
/****** Object:  foreignKey FK_Permiso_Prestacion    Script Date: 07/30/2012 17:22:38 ******/
alter table Permiso  ADD  CONSTRAINT FK_Permiso_Prestacion forEIGN KEY(pre_id)
REFERENCES Prestacion (pre_id)
;
-- FK_Permiso_Prestacion
;
/****** Object:  foreignKey FK_Permiso_Rol    Script Date: 07/30/2012 17:22:38 ******/
alter table Permiso  ADD  CONSTRAINT FK_Permiso_Rol forEIGN KEY(rol_id)
REFERENCES Rol (rol_id)
;
-- FK_Permiso_Rol
;
/****** Object:  foreignKey FK_Permiso_Usuario    Script Date: 07/30/2012 17:22:39 ******/
alter table Permiso  ADD  CONSTRAINT FK_Permiso_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Permiso_Usuario
;
/****** Object:  foreignKey FK_PermisoEmbarque_Aduana    Script Date: 07/30/2012 17:22:44 ******/
alter table PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_Aduana forEIGN KEY(adu_id)
REFERENCES Aduana (adu_id)
;
-- FK_PermisoEmbarque_Aduana
;
/****** Object:  foreignKey FK_PermisoEmbarque_Banco    Script Date: 07/30/2012 17:22:44 ******/
alter table PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_Banco forEIGN KEY(bco_id)
REFERENCES Banco (bco_id)
;
-- FK_PermisoEmbarque_Banco
;
/****** Object:  foreignKey FK_PermisoEmbarque_CentroCosto    Script Date: 07/30/2012 17:22:44 ******/
alter table PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PermisoEmbarque_CentroCosto
;
/****** Object:  foreignKey FK_PermisoEmbarque_Documento    Script Date: 07/30/2012 17:22:44 ******/
alter table PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_PermisoEmbarque_Documento
;
/****** Object:  foreignKey FK_PermisoEmbarque_DocumentoTipo    Script Date: 07/30/2012 17:22:44 ******/
alter table PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_PermisoEmbarque_DocumentoTipo
;
/****** Object:  foreignKey FK_PermisoEmbarque_Embarque    Script Date: 07/30/2012 17:22:45 ******/
alter table PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_Embarque forEIGN KEY(emb_id)
REFERENCES Embarque (emb_id)
;
-- FK_PermisoEmbarque_Embarque
;
/****** Object:  foreignKey FK_PermisoEmbarque_Estado    Script Date: 07/30/2012 17:22:45 ******/
alter table PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_Estado forEIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_PermisoEmbarque_Estado
;
/****** Object:  foreignKey FK_PermisoEmbarque_Legajo    Script Date: 07/30/2012 17:22:45 ******/
alter table PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_PermisoEmbarque_Legajo
;
/****** Object:  foreignKey FK_PermisoEmbarque_ListaPrecio    Script Date: 07/30/2012 17:22:45 ******/
alter table PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_ListaPrecio forEIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_PermisoEmbarque_ListaPrecio
;
/****** Object:  foreignKey FK_PermisoEmbarque_Moneda    Script Date: 07/30/2012 17:22:45 ******/
alter table PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_Moneda forEIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_PermisoEmbarque_Moneda
;
/****** Object:  foreignKey FK_PermisoEmbarque_Sucursal    Script Date: 07/30/2012 17:22:45 ******/
alter table PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_PermisoEmbarque_Sucursal
;
/****** Object:  foreignKey FK_PermisoEmbarque_Usuario    Script Date: 07/30/2012 17:22:45 ******/
alter table PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_PermisoEmbarque_Usuario
;
/****** Object:  foreignKey FK_PermisoEmbarqueItem_PermisoEmbarque    Script Date: 07/30/2012 17:22:48 ******/
alter table PermisoEmbarqueItem  ADD  CONSTRAINT FK_PermisoEmbarqueItem_PermisoEmbarque forEIGN KEY(pemb_id)
REFERENCES PermisoEmbarque (pemb_id)
;
-- FK_PermisoEmbarqueItem_PermisoEmbarque
;
/****** Object:  foreignKey FK_PermisoEmbarqueItem_Producto    Script Date: 07/30/2012 17:22:48 ******/
alter table PermisoEmbarqueItem  ADD  CONSTRAINT FK_PermisoEmbarqueItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_PermisoEmbarqueItem_Producto
;
/****** Object:  foreignKey FK_PermisoEmbarqueItemBorradoTMP_PermisoEmbarqueTMP    Script Date: 07/30/2012 17:22:49 ******/
alter table PermisoEmbarqueItemBorradoTMP  ADD  CONSTRAINT FK_PermisoEmbarqueItemBorradoTMP_PermisoEmbarqueTMP forEIGN KEY(pembTMP_id)
REFERENCES PermisoEmbarqueTMP (pembTMP_id)
;
-- FK_PermisoEmbarqueItemBorradoTMP_PermisoEmbarqueTMP
;
/****** Object:  foreignKey FK_PermisoEmbarqueItemTMP_PermisoEmbarqueTMP    Script Date: 07/30/2012 17:22:51 ******/
alter table PermisoEmbarqueItemTMP  ADD  CONSTRAINT FK_PermisoEmbarqueItemTMP_PermisoEmbarqueTMP forEIGN KEY(pembTMP_id)
REFERENCES PermisoEmbarqueTMP (pembTMP_id)
;
-- FK_PermisoEmbarqueItemTMP_PermisoEmbarqueTMP
;
/****** Object:  foreignKey FK_Persona_Cliente    Script Date: 07/30/2012 17:23:06 ******/
alter table Persona  ADD  CONSTRAINT FK_Persona_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_Persona_Cliente
;
/****** Object:  foreignKey FK_Persona_Departamento    Script Date: 07/30/2012 17:23:06 ******/
alter table Persona  ADD  CONSTRAINT FK_Persona_Departamento forEIGN KEY(dpto_id)
REFERENCES Departamento (dpto_id)
;
-- FK_Persona_Departamento
;
/****** Object:  foreignKey FK_Persona_PersonaDocumentoTipo    Script Date: 07/30/2012 17:23:06 ******/
alter table Persona  ADD  CONSTRAINT FK_Persona_PersonaDocumentoTipo forEIGN KEY(prsdt_id)
REFERENCES PersonaDocumentoTipo (prsdt_id)
;
-- FK_Persona_PersonaDocumentoTipo
;
/****** Object:  foreignKey FK_Persona_Proveedor    Script Date: 07/30/2012 17:23:06 ******/
alter table Persona  ADD  CONSTRAINT FK_Persona_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_Persona_Proveedor
;
/****** Object:  foreignKey FK_Persona_Provincia    Script Date: 07/30/2012 17:23:06 ******/
alter table Persona  ADD  CONSTRAINT FK_Persona_Provincia forEIGN KEY(pro_id)
REFERENCES Provincia (pro_id)
;
-- FK_Persona_Provincia
;
/****** Object:  foreignKey FK_Persona_Sucursal    Script Date: 07/30/2012 17:23:06 ******/
alter table Persona  ADD  CONSTRAINT FK_Persona_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_Persona_Sucursal
;
/****** Object:  foreignKey FK_Persona_Usuario    Script Date: 07/30/2012 17:23:06 ******/
alter table Persona  ADD  CONSTRAINT FK_Persona_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Persona_Usuario
;
/****** Object:  foreignKey FK_PersonaDocumentoTipo_Usuario    Script Date: 07/30/2012 17:23:08 ******/
alter table PersonaDocumentoTipo  ADD  CONSTRAINT FK_PersonaDocumentoTipo_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_PersonaDocumentoTipo_Usuario
;
/****** Object:  foreignKey FK_PickingList_Estado    Script Date: 07/30/2012 17:23:14 ******/
alter table PickingList  ADD  CONSTRAINT FK_PickingList_Estado forEIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_PickingList_Estado
;
/****** Object:  foreignKey FK_PickingList_Sucursal    Script Date: 07/30/2012 17:23:14 ******/
alter table PickingList  ADD  CONSTRAINT FK_PickingList_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_PickingList_Sucursal
;
/****** Object:  foreignKey FK_PickingListPedido_PedidoVenta    Script Date: 07/30/2012 17:23:15 ******/
alter table PickingListPedido  ADD  CONSTRAINT FK_PickingListPedido_PedidoVenta forEIGN KEY(pv_id)
REFERENCES PedidoVenta (pv_id)
;
-- FK_PickingListPedido_PedidoVenta
;
/****** Object:  foreignKey FK_PickingListPedido_PickingList    Script Date: 07/30/2012 17:23:16 ******/
alter table PickingListPedido  ADD  CONSTRAINT FK_PickingListPedido_PickingList forEIGN KEY(pkl_id)
REFERENCES PickingList (pkl_id)
;
-- FK_PickingListPedido_PickingList
;
/****** Object:  foreignKey FK_PickingListPedidoItem_PedidoVenta    Script Date: 07/30/2012 17:23:18 ******/
alter table PickingListPedidoItem  ADD  CONSTRAINT FK_PickingListPedidoItem_PedidoVenta forEIGN KEY(pv_id)
REFERENCES PedidoVenta (pv_id)
;
-- FK_PickingListPedidoItem_PedidoVenta
;
/****** Object:  foreignKey FK_PickingListPedidoItem_PedidoVentaItem    Script Date: 07/30/2012 17:23:18 ******/
alter table PickingListPedidoItem  ADD  CONSTRAINT FK_PickingListPedidoItem_PedidoVentaItem forEIGN KEY(pvi_id)
REFERENCES PedidoVentaItem (pvi_id)
;
-- FK_PickingListPedidoItem_PedidoVentaItem
;
/****** Object:  foreignKey FK_PickingListPedidoItem_PickingList    Script Date: 07/30/2012 17:23:18 ******/
alter table PickingListPedidoItem  ADD  CONSTRAINT FK_PickingListPedidoItem_PickingList forEIGN KEY(pkl_id)
REFERENCES PickingList (pkl_id)
;
-- FK_PickingListPedidoItem_PickingList
;
/****** Object:  foreignKey FK_PickingListPedidoItem_PickingListPedido    Script Date: 07/30/2012 17:23:18 ******/
alter table PickingListPedidoItem  ADD  CONSTRAINT FK_PickingListPedidoItem_PickingListPedido forEIGN KEY(pklpv_id)
REFERENCES PickingListPedido (pklpv_id)
;
-- FK_PickingListPedidoItem_PickingListPedido
;
/****** Object:  foreignKey FK_PosicionArancel_TasaImpositivaDerechos    Script Date: 07/30/2012 17:23:20 ******/
alter table PosicionArancel  ADD  CONSTRAINT FK_PosicionArancel_TasaImpositivaDerechos forEIGN KEY(ti_id_derechos)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_PosicionArancel_TasaImpositivaDerechos
;
/****** Object:  foreignKey FK_PosicionArancel_TasaImpositivaEstadistica    Script Date: 07/30/2012 17:23:21 ******/
alter table PosicionArancel  ADD  CONSTRAINT FK_PosicionArancel_TasaImpositivaEstadistica forEIGN KEY(ti_id_estadistica)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_PosicionArancel_TasaImpositivaEstadistica
;
/****** Object:  foreignKey FK_PosicionArancel_Usuario    Script Date: 07/30/2012 17:23:21 ******/
alter table PosicionArancel  ADD  CONSTRAINT FK_PosicionArancel_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_PosicionArancel_Usuario
;
/****** Object:  foreignKey FK_PresupuestoCompra_CentroCosto    Script Date: 07/30/2012 17:23:31 ******/
alter table PresupuestoCompra  ADD  CONSTRAINT FK_PresupuestoCompra_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PresupuestoCompra_CentroCosto
;
/****** Object:  foreignKey FK_PresupuestoCompra_CondicionPago    Script Date: 07/30/2012 17:23:31 ******/
alter table PresupuestoCompra  ADD  CONSTRAINT FK_PresupuestoCompra_CondicionPago forEIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_PresupuestoCompra_CondicionPago
;
/****** Object:  foreignKey FK_PresupuestoCompra_Documento    Script Date: 07/30/2012 17:23:31 ******/
alter table PresupuestoCompra  ADD  CONSTRAINT FK_PresupuestoCompra_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_PresupuestoCompra_Documento
;
/****** Object:  foreignKey FK_PresupuestoCompra_DocumentoTipo    Script Date: 07/30/2012 17:23:32 ******/
alter table PresupuestoCompra  ADD  CONSTRAINT FK_PresupuestoCompra_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_PresupuestoCompra_DocumentoTipo
;
/****** Object:  foreignKey FK_PresupuestoCompra_Legajo    Script Date: 07/30/2012 17:23:32 ******/
alter table PresupuestoCompra  ADD  CONSTRAINT FK_PresupuestoCompra_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_PresupuestoCompra_Legajo
;
/****** Object:  foreignKey FK_PresupuestoCompra_ListaDescuento    Script Date: 07/30/2012 17:23:32 ******/
alter table PresupuestoCompra  ADD  CONSTRAINT FK_PresupuestoCompra_ListaDescuento forEIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_PresupuestoCompra_ListaDescuento
;
/****** Object:  foreignKey FK_PresupuestoCompra_ListaPrecio    Script Date: 07/30/2012 17:23:32 ******/
alter table PresupuestoCompra  ADD  CONSTRAINT FK_PresupuestoCompra_ListaPrecio forEIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_PresupuestoCompra_ListaPrecio
;
/****** Object:  foreignKey FK_PresupuestoCompra_Proveedor    Script Date: 07/30/2012 17:23:32 ******/
alter table PresupuestoCompra  ADD  CONSTRAINT FK_PresupuestoCompra_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_PresupuestoCompra_Proveedor
;
/****** Object:  foreignKey FK_PresupuestoCompra_UsSolicito    Script Date: 07/30/2012 17:23:32 ******/
alter table PresupuestoCompra  ADD  CONSTRAINT FK_PresupuestoCompra_UsSolicito forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_PresupuestoCompra_UsSolicito
;
/****** Object:  foreignKey FK_PresupuestoCompra_Usuario    Script Date: 07/30/2012 17:23:32 ******/
alter table PresupuestoCompra  ADD  CONSTRAINT FK_PresupuestoCompra_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_PresupuestoCompra_Usuario
;
/****** Object:  foreignKey FK_PresupuestoCompraItem_CentroCosto    Script Date: 07/30/2012 17:23:37 ******/
alter table PresupuestoCompraItem  ADD  CONSTRAINT FK_PresupuestoCompraItem_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PresupuestoCompraItem_CentroCosto
;
/****** Object:  foreignKey FK_PresupuestoCompraItem_PresupuestoCompra    Script Date: 07/30/2012 17:23:37 ******/
alter table PresupuestoCompraItem  ADD  CONSTRAINT FK_PresupuestoCompraItem_PresupuestoCompra forEIGN KEY(prc_id)
REFERENCES PresupuestoCompra (prc_id)
;
-- FK_PresupuestoCompraItem_PresupuestoCompra
;
/****** Object:  foreignKey FK_PresupuestoCompraItem_Producto    Script Date: 07/30/2012 17:23:37 ******/
alter table PresupuestoCompraItem  ADD  CONSTRAINT FK_PresupuestoCompraItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_PresupuestoCompraItem_Producto
;
/****** Object:  foreignKey FK_PresupuestoCompraItemBorradoTMP_PresupuestoCompraTMP    Script Date: 07/30/2012 17:23:38 ******/
alter table PresupuestoCompraItemBorradoTMP  ADD  CONSTRAINT FK_PresupuestoCompraItemBorradoTMP_PresupuestoCompraTMP forEIGN KEY(prcTMP_id)
REFERENCES PresupuestoCompraTMP (prcTMP_id)
;
-- FK_PresupuestoCompraItemBorradoTMP_PresupuestoCompraTMP
;
/****** Object:  foreignKey FK_PresupuestoCompraItemTMP_PresupuestoCompraTMP    Script Date: 07/30/2012 17:23:43 ******/
alter table PresupuestoCompraItemTMP  ADD  CONSTRAINT FK_PresupuestoCompraItemTMP_PresupuestoCompraTMP forEIGN KEY(prcTMP_id)
REFERENCES PresupuestoCompraTMP (prcTMP_id)
;
-- FK_PresupuestoCompraItemTMP_PresupuestoCompraTMP
;
/****** Object:  foreignKey FK_PresupuestoDevolucionCompra_PresupuestoCompraItemDevolucion    Script Date: 07/30/2012 17:23:50 ******/
alter table PresupuestoDevolucionCompra  ADD  CONSTRAINT FK_PresupuestoDevolucionCompra_PresupuestoCompraItemDevolucion forEIGN KEY(prci_id_devolucion)
REFERENCES PresupuestoCompraItem (prci_id)
;
-- FK_PresupuestoDevolucionCompra_PresupuestoCompraItemDevolucion
;
/****** Object:  foreignKey FK_PresupuestoDevolucionCompra_PresupuestoCompraItemPresupuesto    Script Date: 07/30/2012 17:23:50 ******/
alter table PresupuestoDevolucionCompra  ADD  CONSTRAINT FK_PresupuestoDevolucionCompra_PresupuestoCompraItemPresupuesto forEIGN KEY(prci_id_Presupuesto)
REFERENCES PresupuestoCompraItem (prci_id)
;
-- FK_PresupuestoDevolucionCompra_PresupuestoCompraItemPresupuesto
;
/****** Object:  foreignKey FK_PresupuestoDevolucionCompraTMP_PresupuestoCompraTMP    Script Date: 07/30/2012 17:23:51 ******/
alter table PresupuestoDevolucionCompraTMP  ADD  CONSTRAINT FK_PresupuestoDevolucionCompraTMP_PresupuestoCompraTMP forEIGN KEY(prcTMP_id)
REFERENCES PresupuestoCompraTMP (prcTMP_id)
;
-- FK_PresupuestoDevolucionCompraTMP_PresupuestoCompraTMP
;
/****** Object:  foreignKey FK_PresupuestoDevolucionVenta_PresupuestoVentaItemDevolucion    Script Date: 07/30/2012 17:23:53 ******/
alter table PresupuestoDevolucionVenta  ADD  CONSTRAINT FK_PresupuestoDevolucionVenta_PresupuestoVentaItemDevolucion forEIGN KEY(prvi_id_devolucion)
REFERENCES PresupuestoVentaItem (prvi_id)
;
-- FK_PresupuestoDevolucionVenta_PresupuestoVentaItemDevolucion
;
/****** Object:  foreignKey FK_PresupuestoDevolucionVenta_PresupuestoVentaItemPresupuesto    Script Date: 07/30/2012 17:23:53 ******/
alter table PresupuestoDevolucionVenta  ADD  CONSTRAINT FK_PresupuestoDevolucionVenta_PresupuestoVentaItemPresupuesto forEIGN KEY(prvi_id_Presupuesto)
REFERENCES PresupuestoVentaItem (prvi_id)
;
-- FK_PresupuestoDevolucionVenta_PresupuestoVentaItemPresupuesto
;
/****** Object:  foreignKey FK_PresupuestoEnvio_CentroCosto    Script Date: 07/30/2012 17:24:01 ******/
alter table PresupuestoEnvio  ADD  CONSTRAINT FK_PresupuestoEnvio_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PresupuestoEnvio_CentroCosto
;
/****** Object:  foreignKey FK_PresupuestoEnvio_Cliente    Script Date: 07/30/2012 17:24:01 ******/
alter table PresupuestoEnvio  ADD  CONSTRAINT FK_PresupuestoEnvio_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_PresupuestoEnvio_Cliente
;
/****** Object:  foreignKey FK_PresupuestoEnvio_CondicionPago    Script Date: 07/30/2012 17:24:01 ******/
alter table PresupuestoEnvio  ADD  CONSTRAINT FK_PresupuestoEnvio_CondicionPago forEIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_PresupuestoEnvio_CondicionPago
;
/****** Object:  foreignKey FK_PresupuestoEnvio_Documento    Script Date: 07/30/2012 17:24:01 ******/
alter table PresupuestoEnvio  ADD  CONSTRAINT FK_PresupuestoEnvio_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_PresupuestoEnvio_Documento
;
/****** Object:  foreignKey FK_PresupuestoEnvio_DocumentoTipo    Script Date: 07/30/2012 17:24:01 ******/
alter table PresupuestoEnvio  ADD  CONSTRAINT FK_PresupuestoEnvio_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_PresupuestoEnvio_DocumentoTipo
;
/****** Object:  foreignKey FK_PresupuestoEnvio_Usuario    Script Date: 07/30/2012 17:24:01 ******/
alter table PresupuestoEnvio  ADD  CONSTRAINT FK_PresupuestoEnvio_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_PresupuestoEnvio_Usuario
;
/****** Object:  foreignKey FK_PresupuestoEnvio_Vendedor    Script Date: 07/30/2012 17:24:01 ******/
alter table PresupuestoEnvio  ADD  CONSTRAINT FK_PresupuestoEnvio_Vendedor forEIGN KEY(ven_id)
REFERENCES Vendedor (ven_id)
;
-- FK_PresupuestoEnvio_Vendedor
;
/****** Object:  foreignKey FK_PresupuestoEnvioGasto_CentroCosto    Script Date: 07/30/2012 17:24:06 ******/
alter table PresupuestoEnvioGasto  ADD  CONSTRAINT FK_PresupuestoEnvioGasto_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PresupuestoEnvioGasto_CentroCosto
;
/****** Object:  foreignKey FK_PresupuestoEnvioGasto_Gasto    Script Date: 07/30/2012 17:24:06 ******/
alter table PresupuestoEnvioGasto  ADD  CONSTRAINT FK_PresupuestoEnvioGasto_Gasto forEIGN KEY(gto_id)
REFERENCES Gasto (gto_id)
;
-- FK_PresupuestoEnvioGasto_Gasto
;
/****** Object:  foreignKey FK_PresupuestoEnvioGasto_PresupuestoEnvio    Script Date: 07/30/2012 17:24:06 ******/
alter table PresupuestoEnvioGasto  ADD  CONSTRAINT FK_PresupuestoEnvioGasto_PresupuestoEnvio forEIGN KEY(pree_id)
REFERENCES PresupuestoEnvio (pree_id)
;
-- FK_PresupuestoEnvioGasto_PresupuestoEnvio
;
/****** Object:  foreignKey FK_PresupuestoEnvioGasto_Producto    Script Date: 07/30/2012 17:24:06 ******/
alter table PresupuestoEnvioGasto  ADD  CONSTRAINT FK_PresupuestoEnvioGasto_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_PresupuestoEnvioGasto_Producto
;
/****** Object:  foreignKey FK_PresupuestoEnvioGasto_TarifaGasto    Script Date: 07/30/2012 17:24:06 ******/
alter table PresupuestoEnvioGasto  ADD  CONSTRAINT FK_PresupuestoEnvioGasto_TarifaGasto forEIGN KEY(trfg_id)
REFERENCES TarifaGasto (trfg_id)
;
-- FK_PresupuestoEnvioGasto_TarifaGasto
;
/****** Object:  foreignKey FK_PresupuestoEnvioGastoBorradoTMP_PresupuestoEnvioTMP    Script Date: 07/30/2012 17:24:07 ******/
alter table PresupuestoEnvioGastoBorradoTMP  ADD  CONSTRAINT FK_PresupuestoEnvioGastoBorradoTMP_PresupuestoEnvioTMP forEIGN KEY(preeTMP_id)
REFERENCES PresupuestoEnvioTMP (preeTMP_id)
;
-- FK_PresupuestoEnvioGastoBorradoTMP_PresupuestoEnvioTMP
;
/****** Object:  foreignKey FK_PresupuestoEnvioGastoTMP_PresupuestoEnvioTMP    Script Date: 07/30/2012 17:24:11 ******/
alter table PresupuestoEnvioGastoTMP  ADD  CONSTRAINT FK_PresupuestoEnvioGastoTMP_PresupuestoEnvioTMP forEIGN KEY(preeTMP_id)
REFERENCES PresupuestoEnvioTMP (preeTMP_id)
;
-- FK_PresupuestoEnvioGastoTMP_PresupuestoEnvioTMP
;
/****** Object:  foreignKey FK_PresupuestoEnvioItem_CentroCosto    Script Date: 07/30/2012 17:24:17 ******/
alter table PresupuestoEnvioItem  ADD  CONSTRAINT FK_PresupuestoEnvioItem_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PresupuestoEnvioItem_CentroCosto
;
/****** Object:  foreignKey FK_PresupuestoEnvioItem_Destino    Script Date: 07/30/2012 17:24:17 ******/
alter table PresupuestoEnvioItem  ADD  CONSTRAINT FK_PresupuestoEnvioItem_Destino forEIGN KEY(pue_id_destino)
REFERENCES Puerto (pue_id)
;
-- FK_PresupuestoEnvioItem_Destino
;
/****** Object:  foreignKey FK_PresupuestoEnvioItem_Origen    Script Date: 07/30/2012 17:24:17 ******/
alter table PresupuestoEnvioItem  ADD  CONSTRAINT FK_PresupuestoEnvioItem_Origen forEIGN KEY(pue_id_origen)
REFERENCES Puerto (pue_id)
;
-- FK_PresupuestoEnvioItem_Origen
;
/****** Object:  foreignKey FK_PresupuestoEnvioItem_PresupuestoEnvio    Script Date: 07/30/2012 17:24:17 ******/
alter table PresupuestoEnvioItem  ADD  CONSTRAINT FK_PresupuestoEnvioItem_PresupuestoEnvio forEIGN KEY(pree_id)
REFERENCES PresupuestoEnvio (pree_id)
;
-- FK_PresupuestoEnvioItem_PresupuestoEnvio
;
/****** Object:  foreignKey FK_PresupuestoEnvioItem_Producto    Script Date: 07/30/2012 17:24:17 ******/
alter table PresupuestoEnvioItem  ADD  CONSTRAINT FK_PresupuestoEnvioItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_PresupuestoEnvioItem_Producto
;
/****** Object:  foreignKey FK_PresupuestoEnvioItem_TarifaItem    Script Date: 07/30/2012 17:24:17 ******/
alter table PresupuestoEnvioItem  ADD  CONSTRAINT FK_PresupuestoEnvioItem_TarifaItem forEIGN KEY(trfi_id)
REFERENCES TarifaItem (trfi_id)
;
-- FK_PresupuestoEnvioItem_TarifaItem
;
/****** Object:  foreignKey FK_PresupuestoEnvioItem_Transporte    Script Date: 07/30/2012 17:24:17 ******/
alter table PresupuestoEnvioItem  ADD  CONSTRAINT FK_PresupuestoEnvioItem_Transporte forEIGN KEY(trans_id)
REFERENCES Transporte (trans_id)
;
-- FK_PresupuestoEnvioItem_Transporte
;
/****** Object:  foreignKey FK_PresupuestoEnvioItemBorradoTMP_PresupuestoEnvioTMP    Script Date: 07/30/2012 17:24:18 ******/
alter table PresupuestoEnvioItemBorradoTMP  ADD  CONSTRAINT FK_PresupuestoEnvioItemBorradoTMP_PresupuestoEnvioTMP forEIGN KEY(preeTMP_id)
REFERENCES PresupuestoEnvioTMP (preeTMP_id)
;
-- FK_PresupuestoEnvioItemBorradoTMP_PresupuestoEnvioTMP
;
/****** Object:  foreignKey FK_PresupuestoEnvioItemTMP_PresupuestoEnvioTMP    Script Date: 07/30/2012 17:24:24 ******/
alter table PresupuestoEnvioItemTMP  ADD  CONSTRAINT FK_PresupuestoEnvioItemTMP_PresupuestoEnvioTMP forEIGN KEY(preeTMP_id)
REFERENCES PresupuestoEnvioTMP (preeTMP_id)
;
-- FK_PresupuestoEnvioItemTMP_PresupuestoEnvioTMP
;
/****** Object:  foreignKey FK_PresupuestoPedidoVenta_PedidoVentaItem    Script Date: 07/30/2012 17:24:31 ******/
alter table PresupuestoPedidoVenta  ADD  CONSTRAINT FK_PresupuestoPedidoVenta_PedidoVentaItem forEIGN KEY(pvi_id)
REFERENCES PedidoVentaItem (pvi_id)
;
-- FK_PresupuestoPedidoVenta_PedidoVentaItem
;
/****** Object:  foreignKey FK_PresupuestoPedidoVenta_PresupuestoVentaItem    Script Date: 07/30/2012 17:24:31 ******/
alter table PresupuestoPedidoVenta  ADD  CONSTRAINT FK_PresupuestoPedidoVenta_PresupuestoVentaItem forEIGN KEY(prvi_id)
REFERENCES PresupuestoVentaItem (prvi_id)
;
-- FK_PresupuestoPedidoVenta_PresupuestoVentaItem
;
/****** Object:  foreignKey FK_PresupuestoVenta_CentroCosto    Script Date: 07/30/2012 17:24:41 ******/
alter table PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PresupuestoVenta_CentroCosto
;
/****** Object:  foreignKey FK_PresupuestoVenta_Cliente    Script Date: 07/30/2012 17:24:41 ******/
alter table PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_PresupuestoVenta_Cliente
;
/****** Object:  foreignKey FK_PresupuestoVenta_ClienteSucursal    Script Date: 07/30/2012 17:24:41 ******/
alter table PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_ClienteSucursal forEIGN KEY(clis_id)
REFERENCES ClienteSucursal (clis_id)
;
-- FK_PresupuestoVenta_ClienteSucursal
;
/****** Object:  foreignKey FK_PresupuestoVenta_CondicionPago    Script Date: 07/30/2012 17:24:41 ******/
alter table PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_CondicionPago forEIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_PresupuestoVenta_CondicionPago
;
/****** Object:  foreignKey FK_PresupuestoVenta_Documento    Script Date: 07/30/2012 17:24:41 ******/
alter table PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_PresupuestoVenta_Documento
;
/****** Object:  foreignKey FK_PresupuestoVenta_DocumentoTipo    Script Date: 07/30/2012 17:24:41 ******/
alter table PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_PresupuestoVenta_DocumentoTipo
;
/****** Object:  foreignKey FK_PresupuestoVenta_Empresa    Script Date: 07/30/2012 17:24:42 ******/
alter table PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_PresupuestoVenta_Empresa
;
/****** Object:  foreignKey FK_PresupuestoVenta_Legajo    Script Date: 07/30/2012 17:24:42 ******/
alter table PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_PresupuestoVenta_Legajo
;
/****** Object:  foreignKey FK_PresupuestoVenta_ListaDescuento    Script Date: 07/30/2012 17:24:42 ******/
alter table PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_ListaDescuento forEIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_PresupuestoVenta_ListaDescuento
;
/****** Object:  foreignKey FK_PresupuestoVenta_ListaPrecio    Script Date: 07/30/2012 17:24:42 ******/
alter table PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_ListaPrecio forEIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_PresupuestoVenta_ListaPrecio
;
/****** Object:  foreignKey FK_PresupuestoVenta_ProvinciaDestino    Script Date: 07/30/2012 17:24:42 ******/
alter table PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_ProvinciaDestino forEIGN KEY(pro_id_destino)
REFERENCES Provincia (pro_id)
;
-- FK_PresupuestoVenta_ProvinciaDestino
;
/****** Object:  foreignKey FK_PresupuestoVenta_ProvinciaOrigen    Script Date: 07/30/2012 17:24:42 ******/
alter table PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_ProvinciaOrigen forEIGN KEY(pro_id_origen)
REFERENCES Provincia (pro_id)
;
-- FK_PresupuestoVenta_ProvinciaOrigen
;
/****** Object:  foreignKey FK_PresupuestoVenta_Transporte    Script Date: 07/30/2012 17:24:42 ******/
alter table PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_Transporte forEIGN KEY(trans_id)
REFERENCES Transporte (trans_id)
;
-- FK_PresupuestoVenta_Transporte
;
/****** Object:  foreignKey FK_PresupuestoVenta_Usuario    Script Date: 07/30/2012 17:24:42 ******/
alter table PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_PresupuestoVenta_Usuario
;
/****** Object:  foreignKey FK_PresupuestoVenta_Vendedor    Script Date: 07/30/2012 17:24:42 ******/
alter table PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_Vendedor forEIGN KEY(ven_id)
REFERENCES Vendedor (ven_id)
;
-- FK_PresupuestoVenta_Vendedor
;
/****** Object:  foreignKey FK_PresupuestoVentaItem_CentroCosto    Script Date: 07/30/2012 17:24:47 ******/
alter table PresupuestoVentaItem  ADD  CONSTRAINT FK_PresupuestoVentaItem_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PresupuestoVentaItem_CentroCosto
;
/****** Object:  foreignKey FK_PresupuestoVentaItem_PresupuestoVenta    Script Date: 07/30/2012 17:24:47 ******/
alter table PresupuestoVentaItem  ADD  CONSTRAINT FK_PresupuestoVentaItem_PresupuestoVenta forEIGN KEY(prv_id)
REFERENCES PresupuestoVenta (prv_id)
;
-- FK_PresupuestoVentaItem_PresupuestoVenta
;
/****** Object:  foreignKey FK_PresupuestoVentaItem_Producto    Script Date: 07/30/2012 17:24:47 ******/
alter table PresupuestoVentaItem  ADD  CONSTRAINT FK_PresupuestoVentaItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_PresupuestoVentaItem_Producto
;
/****** Object:  foreignKey FK_PresupuestoVentaItemBorradoTMP_PresupuestoVentaTMP    Script Date: 07/30/2012 17:24:48 ******/
alter table PresupuestoVentaItemBorradoTMP  ADD  CONSTRAINT FK_PresupuestoVentaItemBorradoTMP_PresupuestoVentaTMP forEIGN KEY(prvTMP_id)
REFERENCES PresupuestoVentaTMP (prvTMP_id)
;
-- FK_PresupuestoVentaItemBorradoTMP_PresupuestoVentaTMP
;
/****** Object:  foreignKey FK_PresupuestoVentaItemTMP_PresupuestoVentaTMP    Script Date: 07/30/2012 17:24:53 ******/
alter table PresupuestoVentaItemTMP  ADD  CONSTRAINT FK_PresupuestoVentaItemTMP_PresupuestoVentaTMP forEIGN KEY(prvTMP_id)
REFERENCES PresupuestoVentaTMP (prvTMP_id)
;
-- FK_PresupuestoVentaItemTMP_PresupuestoVentaTMP
;
/****** Object:  foreignKey FK_Prioridad_Usuario    Script Date: 07/30/2012 17:25:01 ******/
alter table Prioridad  ADD  CONSTRAINT FK_Prioridad_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Prioridad_Usuario
;
/****** Object:  foreignKey FK_Producto_CentroCostoCompra    Script Date: 07/30/2012 17:25:24 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_CentroCostoCompra forEIGN KEY(ccos_id_compra)
REFERENCES CentroCosto (ccos_id)
;
-- FK_Producto_CentroCostoCompra
;
/****** Object:  foreignKey FK_Producto_CentroCostoVenta    Script Date: 07/30/2012 17:25:24 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_CentroCostoVenta forEIGN KEY(ccos_id_venta)
REFERENCES CentroCosto (ccos_id)
;
-- FK_Producto_CentroCostoVenta
;
/****** Object:  foreignKey FK_Producto_CuentaGrupoCompra    Script Date: 07/30/2012 17:25:24 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_CuentaGrupoCompra forEIGN KEY(cueg_id_compra)
REFERENCES CuentaGrupo (cueg_id)
;
-- FK_Producto_CuentaGrupoCompra
;
/****** Object:  foreignKey FK_Producto_CuentaGrupoVenta    Script Date: 07/30/2012 17:25:24 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_CuentaGrupoVenta forEIGN KEY(cueg_id_venta)
REFERENCES CuentaGrupo (cueg_id)
;
-- FK_Producto_CuentaGrupoVenta
;
/****** Object:  foreignKey FK_Producto_Curso    Script Date: 07/30/2012 17:25:24 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_Curso forEIGN KEY(cur_id)
REFERENCES Curso (cur_id)
;
-- FK_Producto_Curso
;
/****** Object:  foreignKey FK_Producto_Embalaje    Script Date: 07/30/2012 17:25:25 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_Embalaje forEIGN KEY(embl_id)
REFERENCES Embalaje (embl_id)
;
-- FK_Producto_Embalaje
;
/****** Object:  foreignKey FK_Producto_ExpoFamilia    Script Date: 07/30/2012 17:25:25 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_ExpoFamilia forEIGN KEY(efm_id)
REFERENCES ExpoFamilia (efm_id)
;
-- FK_Producto_ExpoFamilia
;
/****** Object:  foreignKey FK_Producto_ExpoGrupoPrecio    Script Date: 07/30/2012 17:25:25 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_ExpoGrupoPrecio forEIGN KEY(egp_id)
REFERENCES ExpoGrupoPrecio (egp_id)
;
-- FK_Producto_ExpoGrupoPrecio
;
/****** Object:  foreignKey FK_Producto_IngresosBrutosCategoria    Script Date: 07/30/2012 17:25:25 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_IngresosBrutosCategoria forEIGN KEY(ibc_id)
REFERENCES IngresosBrutosCategoria (ibc_id)
;
-- FK_Producto_IngresosBrutosCategoria
;
/****** Object:  foreignKey FK_Producto_Marca    Script Date: 07/30/2012 17:25:25 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_Marca forEIGN KEY(marc_id)
REFERENCES Marca (marc_id)
;
-- FK_Producto_Marca
;
/****** Object:  foreignKey FK_Producto_Producto    Script Date: 07/30/2012 17:25:25 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_Producto forEIGN KEY(pr_id_webpadre)
REFERENCES Producto (pr_id)
;
-- FK_Producto_Producto
;
/****** Object:  foreignKey FK_Producto_ReporteNombreCompra    Script Date: 07/30/2012 17:25:25 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_ReporteNombreCompra forEIGN KEY(rpt_id_nombrecompra)
REFERENCES Reporte (rpt_id)
;
-- FK_Producto_ReporteNombreCompra
;
/****** Object:  foreignKey FK_Producto_ReporteNombreFactura    Script Date: 07/30/2012 17:25:25 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_ReporteNombreFactura forEIGN KEY(rpt_id_nombrefactura)
REFERENCES Reporte (rpt_id)
;
-- FK_Producto_ReporteNombreFactura
;
/****** Object:  foreignKey FK_Producto_ReporteNombreImg    Script Date: 07/30/2012 17:25:25 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_ReporteNombreImg forEIGN KEY(rpt_id_nombreimg)
REFERENCES Reporte (rpt_id)
;
-- FK_Producto_ReporteNombreImg
;
/****** Object:  foreignKey FK_Producto_ReporteNombreImgAlt    Script Date: 07/30/2012 17:25:26 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_ReporteNombreImgAlt forEIGN KEY(rpt_id_nombreimgalt)
REFERENCES Reporte (rpt_id)
;
-- FK_Producto_ReporteNombreImgAlt
;
/****** Object:  foreignKey FK_Producto_ReporteNombreVenta    Script Date: 07/30/2012 17:25:26 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_ReporteNombreVenta forEIGN KEY(rpt_id_nombreventa)
REFERENCES Reporte (rpt_id)
;
-- FK_Producto_ReporteNombreVenta
;
/****** Object:  foreignKey FK_Producto_ReporteNombreWeb    Script Date: 07/30/2012 17:25:26 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_ReporteNombreWeb forEIGN KEY(rpt_id_nombreweb)
REFERENCES Reporte (rpt_id)
;
-- FK_Producto_ReporteNombreWeb
;
/****** Object:  foreignKey FK_Producto_Rubro1    Script Date: 07/30/2012 17:25:26 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_Rubro1 forEIGN KEY(rub_id)
REFERENCES Rubro (rub_id)
;
-- FK_Producto_Rubro1
;
/****** Object:  foreignKey FK_Producto_RubroTablaItem    Script Date: 07/30/2012 17:25:26 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_RubroTablaItem forEIGN KEY(rubti_id1)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Producto_RubroTablaItem
;
/****** Object:  foreignKey FK_Producto_RubroTablaItem1    Script Date: 07/30/2012 17:25:26 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_RubroTablaItem1 forEIGN KEY(rubti_id2)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Producto_RubroTablaItem1
;
/****** Object:  foreignKey FK_Producto_RubroTablaItem2    Script Date: 07/30/2012 17:25:26 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_RubroTablaItem2 forEIGN KEY(rubti_id3)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Producto_RubroTablaItem2
;
/****** Object:  foreignKey FK_Producto_RubroTablaItem3    Script Date: 07/30/2012 17:25:26 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_RubroTablaItem3 forEIGN KEY(rubti_id4)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Producto_RubroTablaItem3
;
/****** Object:  foreignKey FK_Producto_RubroTablaItem4    Script Date: 07/30/2012 17:25:26 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_RubroTablaItem4 forEIGN KEY(rubti_id5)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Producto_RubroTablaItem4
;
/****** Object:  foreignKey FK_Producto_RubroTablaItem5    Script Date: 07/30/2012 17:25:27 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_RubroTablaItem5 forEIGN KEY(rubti_id6)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Producto_RubroTablaItem5
;
/****** Object:  foreignKey FK_Producto_RubroTablaItem6    Script Date: 07/30/2012 17:25:27 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_RubroTablaItem6 forEIGN KEY(rubti_id7)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Producto_RubroTablaItem6
;
/****** Object:  foreignKey FK_Producto_RubroTablaItem7    Script Date: 07/30/2012 17:25:27 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_RubroTablaItem7 forEIGN KEY(rubti_id8)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Producto_RubroTablaItem7
;
/****** Object:  foreignKey FK_Producto_RubroTablaItem8    Script Date: 07/30/2012 17:25:27 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_RubroTablaItem8 forEIGN KEY(rubti_id9)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Producto_RubroTablaItem8
;
/****** Object:  foreignKey FK_Producto_RubroTablaItem9    Script Date: 07/30/2012 17:25:27 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_RubroTablaItem9 forEIGN KEY(rubti_id10)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Producto_RubroTablaItem9
;
/****** Object:  foreignKey FK_Producto_Talonario_Lote    Script Date: 07/30/2012 17:25:27 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_Talonario_Lote forEIGN KEY(ta_id_kitLote)
REFERENCES Talonario (ta_id)
;
-- FK_Producto_Talonario_Lote
;
/****** Object:  foreignKey FK_Producto_Talonario_Serie    Script Date: 07/30/2012 17:25:27 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_Talonario_Serie forEIGN KEY(ta_id_kitSerie)
REFERENCES Talonario (ta_id)
;
-- FK_Producto_Talonario_Serie
;
/****** Object:  foreignKey FK_Producto_TasaImpositivaComexGanancias    Script Date: 07/30/2012 17:25:27 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_TasaImpositivaComexGanancias forEIGN KEY(ti_id_comex_ganancias)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_Producto_TasaImpositivaComexGanancias
;
/****** Object:  foreignKey FK_Producto_TasaImpositivaComexIGB    Script Date: 07/30/2012 17:25:27 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_TasaImpositivaComexIGB forEIGN KEY(ti_id_comex_igb)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_Producto_TasaImpositivaComexIGB
;
/****** Object:  foreignKey FK_Producto_TasaImpositivaInternosC    Script Date: 07/30/2012 17:25:27 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_TasaImpositivaInternosC forEIGN KEY(ti_id_internosc)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_Producto_TasaImpositivaInternosC
;
/****** Object:  foreignKey FK_Producto_TasaImpositivaInternosV    Script Date: 07/30/2012 17:25:27 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_TasaImpositivaInternosV forEIGN KEY(ti_id_internosv)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_Producto_TasaImpositivaInternosV
;
/****** Object:  foreignKey FK_Producto_TasaImpositivaIvaComex    Script Date: 07/30/2012 17:25:28 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_TasaImpositivaIvaComex forEIGN KEY(ti_id_comex_iva)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_Producto_TasaImpositivaIvaComex
;
/****** Object:  foreignKey FK_Producto_TasaImpositivaRICompra    Script Date: 07/30/2012 17:25:28 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_TasaImpositivaRICompra forEIGN KEY(ti_id_ivaricompra)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_Producto_TasaImpositivaRICompra
;
/****** Object:  foreignKey FK_Producto_TasaImpositivaRIVenta    Script Date: 07/30/2012 17:25:28 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_TasaImpositivaRIVenta forEIGN KEY(ti_id_ivariventa)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_Producto_TasaImpositivaRIVenta
;
/****** Object:  foreignKey FK_Producto_TasaImpositivaRNICompra    Script Date: 07/30/2012 17:25:28 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_TasaImpositivaRNICompra forEIGN KEY(ti_id_ivarnicompra)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_Producto_TasaImpositivaRNICompra
;
/****** Object:  foreignKey FK_Producto_TasaImpositivaRNIVenta    Script Date: 07/30/2012 17:25:28 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_TasaImpositivaRNIVenta forEIGN KEY(ti_id_ivarniventa)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_Producto_TasaImpositivaRNIVenta
;
/****** Object:  foreignKey FK_Producto_UnCompra    Script Date: 07/30/2012 17:25:28 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_UnCompra forEIGN KEY(un_id_compra)
REFERENCES Unidad (un_id)
;
-- FK_Producto_UnCompra
;
/****** Object:  foreignKey FK_Producto_UnidadPeso    Script Date: 07/30/2012 17:25:28 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_UnidadPeso forEIGN KEY(un_id_peso)
REFERENCES Unidad (un_id)
;
-- FK_Producto_UnidadPeso
;
/****** Object:  foreignKey FK_Producto_UnStock    Script Date: 07/30/2012 17:25:28 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_UnStock forEIGN KEY(un_id_stock)
REFERENCES Unidad (un_id)
;
-- FK_Producto_UnStock
;
/****** Object:  foreignKey FK_Producto_UnVenta    Script Date: 07/30/2012 17:25:28 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_UnVenta forEIGN KEY(un_id_venta)
REFERENCES Unidad (un_id)
;
-- FK_Producto_UnVenta
;
/****** Object:  foreignKey FK_Producto_Usuario    Script Date: 07/30/2012 17:25:28 ******/
alter table Producto  ADD  CONSTRAINT FK_Producto_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Producto_Usuario
;
/****** Object:  foreignKey FK_ProductoBOM_Usuario    Script Date: 07/30/2012 17:25:32 ******/
alter table ProductoBOM  ADD  CONSTRAINT FK_ProductoBOM_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ProductoBOM_Usuario
;
/****** Object:  foreignKey FK_ProductoBOMElaborado_Producto    Script Date: 07/30/2012 17:25:34 ******/
alter table ProductoBOMElaborado  ADD  CONSTRAINT FK_ProductoBOMElaborado_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoBOMElaborado_Producto
;
/****** Object:  foreignKey FK_ProductoBOMElaborado_ProductoBOM    Script Date: 07/30/2012 17:25:34 ******/
alter table ProductoBOMElaborado  ADD  CONSTRAINT FK_ProductoBOMElaborado_ProductoBOM forEIGN KEY(pbm_id)
REFERENCES ProductoBOM (pbm_id)
;
-- FK_ProductoBOMElaborado_ProductoBOM
;
/****** Object:  foreignKey FK_ProductoBOMItem_Producto    Script Date: 07/30/2012 17:25:37 ******/
alter table ProductoBOMItem  ADD  CONSTRAINT FK_ProductoBOMItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoBOMItem_Producto
;
/****** Object:  foreignKey FK_ProductoBOMItem_ProductoBOM    Script Date: 07/30/2012 17:25:37 ******/
alter table ProductoBOMItem  ADD  CONSTRAINT FK_ProductoBOMItem_ProductoBOM forEIGN KEY(pbm_id)
REFERENCES ProductoBOM (pbm_id)
;
-- FK_ProductoBOMItem_ProductoBOM
;
/****** Object:  foreignKey FK_ProductoBOMItem_ProductoBOMItemTipo    Script Date: 07/30/2012 17:25:37 ******/
alter table ProductoBOMItem  ADD  CONSTRAINT FK_ProductoBOMItem_ProductoBOMItemTipo forEIGN KEY(pbmit_id)
REFERENCES ProductoBOMItemTipo (pbmit_id)
;
-- FK_ProductoBOMItem_ProductoBOMItemTipo
;
/****** Object:  foreignKey FK_ProductoBOMItemA_Producto    Script Date: 07/30/2012 17:25:38 ******/
alter table ProductoBOMItemA  ADD  CONSTRAINT FK_ProductoBOMItemA_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoBOMItemA_Producto
;
/****** Object:  foreignKey FK_ProductoBOMItemA_ProductoBOMItem    Script Date: 07/30/2012 17:25:38 ******/
alter table ProductoBOMItemA  ADD  CONSTRAINT FK_ProductoBOMItemA_ProductoBOMItem forEIGN KEY(pbmi_id)
REFERENCES ProductoBOMItem (pbmi_id)
;
-- FK_ProductoBOMItemA_ProductoBOMItem
;
/****** Object:  foreignKey FK_ProductoCliente_Cliente    Script Date: 07/30/2012 17:25:41 ******/
alter table ProductoCliente  ADD  CONSTRAINT FK_ProductoCliente_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_ProductoCliente_Cliente
;
/****** Object:  foreignKey FK_ProductoCliente_Producto    Script Date: 07/30/2012 17:25:41 ******/
alter table ProductoCliente  ADD  CONSTRAINT FK_ProductoCliente_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoCliente_Producto
;
/****** Object:  foreignKey FK_ProductoComunidadInternet_ComunidadInternet    Script Date: 07/30/2012 17:25:43 ******/
alter table ProductoComunidadInternet  ADD  CONSTRAINT FK_ProductoComunidadInternet_ComunidadInternet forEIGN KEY(cmi_id)
REFERENCES ComunidadInternet (cmi_id)
;
-- FK_ProductoComunidadInternet_ComunidadInternet
;
/****** Object:  foreignKey FK_ProductoComunidadInternet_Producto    Script Date: 07/30/2012 17:25:43 ******/
alter table ProductoComunidadInternet  ADD  CONSTRAINT FK_ProductoComunidadInternet_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoComunidadInternet_Producto
;
/****** Object:  foreignKey FK_ProductoDepositoEntrega_DepositoLogico    Script Date: 07/30/2012 17:25:45 ******/
alter table ProductoDepositoEntrega  ADD  CONSTRAINT FK_ProductoDepositoEntrega_DepositoLogico forEIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_ProductoDepositoEntrega_DepositoLogico
;
/****** Object:  foreignKey FK_ProductoDepositoEntrega_Empresa    Script Date: 07/30/2012 17:25:45 ******/
alter table ProductoDepositoEntrega  ADD  CONSTRAINT FK_ProductoDepositoEntrega_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_ProductoDepositoEntrega_Empresa
;
/****** Object:  foreignKey FK_ProductoDepositoEntrega_Producto    Script Date: 07/30/2012 17:25:45 ******/
alter table ProductoDepositoEntrega  ADD  CONSTRAINT FK_ProductoDepositoEntrega_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoDepositoEntrega_Producto
;
/****** Object:  foreignKey FK_ProductoDepositoEntrega_Sucursal    Script Date: 07/30/2012 17:25:45 ******/
alter table ProductoDepositoEntrega  ADD  CONSTRAINT FK_ProductoDepositoEntrega_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_ProductoDepositoEntrega_Sucursal
;
/****** Object:  foreignKey FK_ProductoDepositoFisico_DepositoFisico    Script Date: 07/30/2012 17:25:47 ******/
alter table ProductoDepositoFisico  ADD  CONSTRAINT FK_ProductoDepositoFisico_DepositoFisico forEIGN KEY(depf_id)
REFERENCES DepositoFisico (depf_id)
;
-- FK_ProductoDepositoFisico_DepositoFisico
;
/****** Object:  foreignKey FK_ProductoDepositoFisico_Producto    Script Date: 07/30/2012 17:25:48 ******/
alter table ProductoDepositoFisico  ADD  CONSTRAINT FK_ProductoDepositoFisico_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoDepositoFisico_Producto
;
/****** Object:  foreignKey FK_ProductoDepositoLogico_DepositoLogico    Script Date: 07/30/2012 17:25:50 ******/
alter table ProductoDepositoLogico  ADD  CONSTRAINT FK_ProductoDepositoLogico_DepositoLogico forEIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_ProductoDepositoLogico_DepositoLogico
;
/****** Object:  foreignKey FK_ProductoDepositoLogico_Producto    Script Date: 07/30/2012 17:25:50 ******/
alter table ProductoDepositoLogico  ADD  CONSTRAINT FK_ProductoDepositoLogico_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoDepositoLogico_Producto
;
/****** Object:  foreignKey FK_ProductoFormulaKit_Producto    Script Date: 07/30/2012 17:25:53 ******/
alter table ProductoFormulaKit  ADD  CONSTRAINT FK_ProductoFormulaKit_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoFormulaKit_Producto
;
/****** Object:  foreignKey FK_ProductoFormulaKit_ProductoLote    Script Date: 07/30/2012 17:25:53 ******/
alter table ProductoFormulaKit  ADD  CONSTRAINT FK_ProductoFormulaKit_ProductoLote forEIGN KEY(pr_id_lote)
REFERENCES Producto (pr_id)
;
-- FK_ProductoFormulaKit_ProductoLote
;
/****** Object:  foreignKey FK_ProductoFormulaKit_ProductoSerie    Script Date: 07/30/2012 17:25:53 ******/
alter table ProductoFormulaKit  ADD  CONSTRAINT FK_ProductoFormulaKit_ProductoSerie forEIGN KEY(pr_id_serie)
REFERENCES Producto (pr_id)
;
-- FK_ProductoFormulaKit_ProductoSerie
;
/****** Object:  foreignKey FK_ProductoKit_ProductoFormulaKit    Script Date: 07/30/2012 17:25:58 ******/
alter table ProductoKit  ADD  CONSTRAINT FK_ProductoKit_ProductoFormulaKit forEIGN KEY(prfk_id)
REFERENCES ProductoFormulaKit (prfk_id)
;
-- FK_ProductoKit_ProductoFormulaKit
;
/****** Object:  foreignKey FK_ProductoKit_ProductoItem    Script Date: 07/30/2012 17:25:58 ******/
alter table ProductoKit  ADD  CONSTRAINT FK_ProductoKit_ProductoItem forEIGN KEY(pr_id_item)
REFERENCES Producto (pr_id)
;
-- FK_ProductoKit_ProductoItem
;
/****** Object:  foreignKey FK_ProductoKit_Usuario    Script Date: 07/30/2012 17:25:58 ******/
alter table ProductoKit  ADD  CONSTRAINT FK_ProductoKit_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ProductoKit_Usuario
;
/****** Object:  foreignKey FK_ProductoKitItemA_Producto    Script Date: 07/30/2012 17:25:59 ******/
alter table ProductoKitItemA  ADD  CONSTRAINT FK_ProductoKitItemA_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoKitItemA_Producto
;
/****** Object:  foreignKey FK_ProductoKitItemA_ProductoKit    Script Date: 07/30/2012 17:25:59 ******/
alter table ProductoKitItemA  ADD  CONSTRAINT FK_ProductoKitItemA_ProductoKit forEIGN KEY(prk_id)
REFERENCES ProductoKit (prk_id)
;
-- FK_ProductoKitItemA_ProductoKit
;
/****** Object:  foreignKey FK_ProductoLeyenda_Producto    Script Date: 07/30/2012 17:26:01 ******/
alter table ProductoLeyenda  ADD  CONSTRAINT FK_ProductoLeyenda_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoLeyenda_Producto
;
/****** Object:  foreignKey FK_ProductoNumeroSerie_Cliente    Script Date: 07/30/2012 17:26:06 ******/
alter table ProductoNumeroSerie  ADD  CONSTRAINT FK_ProductoNumeroSerie_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_ProductoNumeroSerie_Cliente
;
/****** Object:  foreignKey FK_ProductoNumeroSerie_DepositoLogico    Script Date: 07/30/2012 17:26:06 ******/
alter table ProductoNumeroSerie  ADD  CONSTRAINT FK_ProductoNumeroSerie_DepositoLogico forEIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_ProductoNumeroSerie_DepositoLogico
;
/****** Object:  foreignKey FK_ProductoNumeroSerie_ParteProdKit    Script Date: 07/30/2012 17:26:07 ******/
alter table ProductoNumeroSerie  ADD  CONSTRAINT FK_ProductoNumeroSerie_ParteProdKit forEIGN KEY(ppk_id)
REFERENCES ParteProdKit (ppk_id)
;
-- FK_ProductoNumeroSerie_ParteProdKit
;
/****** Object:  foreignKey FK_ProductoNumeroSerie_Producto    Script Date: 07/30/2012 17:26:07 ******/
alter table ProductoNumeroSerie  ADD  CONSTRAINT FK_ProductoNumeroSerie_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoNumeroSerie_Producto
;
/****** Object:  foreignKey FK_ProductoNumeroSerie_Producto1    Script Date: 07/30/2012 17:26:07 ******/
alter table ProductoNumeroSerie  ADD  CONSTRAINT FK_ProductoNumeroSerie_Producto1 forEIGN KEY(pr_id_kit)
REFERENCES Producto (pr_id)
;
-- FK_ProductoNumeroSerie_Producto1
;
/****** Object:  foreignKey FK_ProductoNumeroSerie_ProductoNumeroSerie    Script Date: 07/30/2012 17:26:07 ******/
alter table ProductoNumeroSerie  ADD  CONSTRAINT FK_ProductoNumeroSerie_ProductoNumeroSerie forEIGN KEY(prns_id_historia)
REFERENCES ProductoNumeroSerie (prns_id)
;
-- FK_ProductoNumeroSerie_ProductoNumeroSerie
;
/****** Object:  foreignKey FK_ProductoNumeroSerie_ProductoSerieKit    Script Date: 07/30/2012 17:26:07 ******/
alter table ProductoNumeroSerie  ADD  CONSTRAINT FK_ProductoNumeroSerie_ProductoSerieKit forEIGN KEY(prsk_id)
REFERENCES ProductoSerieKit (prsk_id)
;
-- FK_ProductoNumeroSerie_ProductoSerieKit
;
/****** Object:  foreignKey FK_ProductoNumeroSerie_Proveedor    Script Date: 07/30/2012 17:26:07 ******/
alter table ProductoNumeroSerie  ADD  CONSTRAINT FK_ProductoNumeroSerie_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_ProductoNumeroSerie_Proveedor
;
/****** Object:  foreignKey FK_ProductoNumeroSerie_StockLote    Script Date: 07/30/2012 17:26:07 ******/
alter table ProductoNumeroSerie  ADD  CONSTRAINT FK_ProductoNumeroSerie_StockLote forEIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_ProductoNumeroSerie_StockLote
;
/****** Object:  foreignKey FK_ProductoNumeroSerie_Tarea    Script Date: 07/30/2012 17:26:07 ******/
alter table ProductoNumeroSerie  ADD  CONSTRAINT FK_ProductoNumeroSerie_Tarea forEIGN KEY(tar_id)
REFERENCES Tarea (tar_id)
;
-- FK_ProductoNumeroSerie_Tarea
;
/****** Object:  foreignKey FK_ProductoNumeroSerie_Usuario    Script Date: 07/30/2012 17:26:07 ******/
alter table ProductoNumeroSerie  ADD  CONSTRAINT FK_ProductoNumeroSerie_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ProductoNumeroSerie_Usuario
;
/****** Object:  foreignKey FK__ProductoProveedor_Pais    Script Date: 07/30/2012 17:26:19 ******/
alter table ProductoProveedor  ADD  CONSTRAINT FK__ProductoProveedor_Pais forEIGN KEY(pa_id)
REFERENCES Pais (pa_id)
;
-- FK__ProductoProveedor_Pais
;
/****** Object:  foreignKey FK_ProductoProveedor_Producto    Script Date: 07/30/2012 17:26:19 ******/
alter table ProductoProveedor  ADD  CONSTRAINT FK_ProductoProveedor_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoProveedor_Producto
;
/****** Object:  foreignKey FK_ProductoProveedor_Proveedor    Script Date: 07/30/2012 17:26:19 ******/
alter table ProductoProveedor  ADD  CONSTRAINT FK_ProductoProveedor_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_ProductoProveedor_Proveedor
;
/****** Object:  foreignKey FK_ProductoProveedor_Usuario    Script Date: 07/30/2012 17:26:19 ******/
alter table ProductoProveedor  ADD  CONSTRAINT FK_ProductoProveedor_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ProductoProveedor_Usuario
;
/****** Object:  foreignKey FK_ProductoSerieKit_ParteProdKitItem    Script Date: 07/30/2012 17:26:21 ******/
alter table ProductoSerieKit  ADD  CONSTRAINT FK_ProductoSerieKit_ParteProdKitItem forEIGN KEY(ppki_id)
REFERENCES ParteProdKitItem (ppki_id)
;
-- FK_ProductoSerieKit_ParteProdKitItem
;
/****** Object:  foreignKey FK_ProductoSerieKit_ParteProdKitItem1    Script Date: 07/30/2012 17:26:21 ******/
alter table ProductoSerieKit  ADD  CONSTRAINT FK_ProductoSerieKit_ParteProdKitItem1 forEIGN KEY(ppki_id_desarme)
REFERENCES ParteProdKitItem (ppki_id)
;
-- FK_ProductoSerieKit_ParteProdKitItem1
;
/****** Object:  foreignKey FK_ProductoSerieKit_ProductoFormulaKit    Script Date: 07/30/2012 17:26:21 ******/
alter table ProductoSerieKit  ADD  CONSTRAINT FK_ProductoSerieKit_ProductoFormulaKit forEIGN KEY(prfk_id)
REFERENCES ProductoFormulaKit (prfk_id)
;
-- FK_ProductoSerieKit_ProductoFormulaKit
;
/****** Object:  foreignKey FK_ProductoSerieKit_ProductoNumeroSerie    Script Date: 07/30/2012 17:26:21 ******/
alter table ProductoSerieKit  ADD  CONSTRAINT FK_ProductoSerieKit_ProductoNumeroSerie forEIGN KEY(prns_id)
REFERENCES ProductoNumeroSerie (prns_id)
;
-- FK_ProductoSerieKit_ProductoNumeroSerie
;
/****** Object:  foreignKey FK_ProductoSerieKit_StockLote    Script Date: 07/30/2012 17:26:21 ******/
alter table ProductoSerieKit  ADD  CONSTRAINT FK_ProductoSerieKit_StockLote forEIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_ProductoSerieKit_StockLote
;
/****** Object:  foreignKey FK_ProductoSerieKitBorradoTMP_ParteProdKitTMP    Script Date: 07/30/2012 17:26:22 ******/
alter table ProductoSerieKitBorradoTMP  ADD  CONSTRAINT FK_ProductoSerieKitBorradoTMP_ParteProdKitTMP forEIGN KEY(ppkTMP_id)
REFERENCES ParteProdKitTMP (ppkTMP_id)
;
-- FK_ProductoSerieKitBorradoTMP_ParteProdKitTMP
;
/****** Object:  foreignKey FK_ProductoSerieKitItem_ProductoKit    Script Date: 07/30/2012 17:26:24 ******/
alter table ProductoSerieKitItem  ADD  CONSTRAINT FK_ProductoSerieKitItem_ProductoKit forEIGN KEY(prk_id)
REFERENCES ProductoKit (prk_id)
;
-- FK_ProductoSerieKitItem_ProductoKit
;
/****** Object:  foreignKey FK_ProductoSerieKitItem_ProductoNumeroSerie    Script Date: 07/30/2012 17:26:24 ******/
alter table ProductoSerieKitItem  ADD  CONSTRAINT FK_ProductoSerieKitItem_ProductoNumeroSerie forEIGN KEY(prns_id)
REFERENCES ProductoNumeroSerie (prns_id)
;
-- FK_ProductoSerieKitItem_ProductoNumeroSerie
;
/****** Object:  foreignKey FK_ProductoSerieKitItem_ProductoSerieKit    Script Date: 07/30/2012 17:26:24 ******/
alter table ProductoSerieKitItem  ADD  CONSTRAINT FK_ProductoSerieKitItem_ProductoSerieKit forEIGN KEY(prsk_id)
REFERENCES ProductoSerieKit (prsk_id)
;
-- FK_ProductoSerieKitItem_ProductoSerieKit
;
/****** Object:  foreignKey FK_ProductoSerieKitItem_StockLote    Script Date: 07/30/2012 17:26:24 ******/
alter table ProductoSerieKitItem  ADD  CONSTRAINT FK_ProductoSerieKitItem_StockLote forEIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_ProductoSerieKitItem_StockLote
;
/****** Object:  foreignKey FK_ProductoSerieKitItemTMP_ParteProdKitItemTMP    Script Date: 07/30/2012 17:26:26 ******/
alter table ProductoSerieKitItemTMP  ADD  CONSTRAINT FK_ProductoSerieKitItemTMP_ParteProdKitItemTMP forEIGN KEY(ppkiTMP_id)
REFERENCES ParteProdKitItemTMP (ppkiTMP_id)
;
-- FK_ProductoSerieKitItemTMP_ParteProdKitItemTMP
;
/****** Object:  foreignKey FK_ProductoSerieKitItemTMP_ParteProdKitTMP    Script Date: 07/30/2012 17:26:26 ******/
alter table ProductoSerieKitItemTMP  ADD  CONSTRAINT FK_ProductoSerieKitItemTMP_ParteProdKitTMP forEIGN KEY(ppkTMP_id)
REFERENCES ParteProdKitTMP (ppkTMP_id)
;
-- FK_ProductoSerieKitItemTMP_ParteProdKitTMP
;
/****** Object:  foreignKey FK_ProductoSerieKitItemTMP_ProductoSerieKitTMP    Script Date: 07/30/2012 17:26:26 ******/
alter table ProductoSerieKitItemTMP  ADD  CONSTRAINT FK_ProductoSerieKitItemTMP_ProductoSerieKitTMP forEIGN KEY(prskTMP_id)
REFERENCES ProductoSerieKitTMP (prskTMP_id)
;
-- FK_ProductoSerieKitItemTMP_ProductoSerieKitTMP
;
/****** Object:  foreignKey FK_ProductoSerieKitTMP_ParteProdKitItemTMP    Script Date: 07/30/2012 17:26:28 ******/
alter table ProductoSerieKitTMP  ADD  CONSTRAINT FK_ProductoSerieKitTMP_ParteProdKitItemTMP forEIGN KEY(ppkiTMP_id)
REFERENCES ParteProdKitItemTMP (ppkiTMP_id)
;
-- FK_ProductoSerieKitTMP_ParteProdKitItemTMP
;
/****** Object:  foreignKey FK_ProductoSerieKitTMP_ParteProdKitTMP    Script Date: 07/30/2012 17:26:29 ******/
alter table ProductoSerieKitTMP  ADD  CONSTRAINT FK_ProductoSerieKitTMP_ParteProdKitTMP forEIGN KEY(ppkTMP_id)
REFERENCES ParteProdKitTMP (ppkTMP_id)
;
-- FK_ProductoSerieKitTMP_ParteProdKitTMP
;
/****** Object:  foreignKey FK_Profesor_Usuario    Script Date: 07/30/2012 17:26:36 ******/
alter table Profesor  ADD  CONSTRAINT FK_Profesor_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Profesor_Usuario
;
/****** Object:  foreignKey FK_Proveedor_CondicionPago    Script Date: 07/30/2012 17:26:46 ******/
alter table Proveedor  ADD  CONSTRAINT FK_Proveedor_CondicionPago forEIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_Proveedor_CondicionPago
;
/****** Object:  foreignKey FK_Proveedor_ListaDescuento    Script Date: 07/30/2012 17:26:47 ******/
alter table Proveedor  ADD  CONSTRAINT FK_Proveedor_ListaDescuento forEIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_Proveedor_ListaDescuento
;
/****** Object:  foreignKey FK_Proveedor_ListaPrecio    Script Date: 07/30/2012 17:26:47 ******/
alter table Proveedor  ADD  CONSTRAINT FK_Proveedor_ListaPrecio forEIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_Proveedor_ListaPrecio
;
/****** Object:  foreignKey FK_Proveedor_Provincia    Script Date: 07/30/2012 17:26:47 ******/
alter table Proveedor  ADD  CONSTRAINT FK_Proveedor_Provincia forEIGN KEY(pro_id)
REFERENCES Provincia (pro_id)
;
-- FK_Proveedor_Provincia
;
/****** Object:  foreignKey FK_Proveedor_Usuario    Script Date: 07/30/2012 17:26:47 ******/
alter table Proveedor  ADD  CONSTRAINT FK_Proveedor_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Proveedor_Usuario
;
/****** Object:  foreignKey FK_Proveedor_Usuario1    Script Date: 07/30/2012 17:26:47 ******/
alter table Proveedor  ADD  CONSTRAINT FK_Proveedor_Usuario1 forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_Proveedor_Usuario1
;
/****** Object:  foreignKey FK_Proveedor_Zona    Script Date: 07/30/2012 17:26:47 ******/
alter table Proveedor  ADD  CONSTRAINT FK_Proveedor_Zona forEIGN KEY(zon_id)
REFERENCES Zona (zon_id)
;
-- FK_Proveedor_Zona
;
/****** Object:  foreignKey FK_ProveedorCacheCredito_Empresa    Script Date: 07/30/2012 17:26:48 ******/
alter table ProveedorCacheCredito  ADD  CONSTRAINT FK_ProveedorCacheCredito_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_ProveedorCacheCredito_Empresa
;
/****** Object:  foreignKey FK_ProveedorCacheCredito_Proveedor    Script Date: 07/30/2012 17:26:48 ******/
alter table ProveedorCacheCredito  ADD  CONSTRAINT FK_ProveedorCacheCredito_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_ProveedorCacheCredito_Proveedor
;
/****** Object:  foreignKey FK_ProveedorCAI_Proveedor    Script Date: 07/30/2012 17:26:51 ******/
alter table ProveedorCAI  ADD  CONSTRAINT FK_ProveedorCAI_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_ProveedorCAI_Proveedor
;
/****** Object:  foreignKey FK_ProveedorCAI_Usuario    Script Date: 07/30/2012 17:26:51 ******/
alter table ProveedorCAI  ADD  CONSTRAINT FK_ProveedorCAI_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ProveedorCAI_Usuario
;
/****** Object:  foreignKey FK_ProveedorCentroCosto_CentroCosto    Script Date: 07/30/2012 17:26:52 ******/
alter table ProveedorCentroCosto  ADD  CONSTRAINT FK_ProveedorCentroCosto_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_ProveedorCentroCosto_CentroCosto
;
/****** Object:  foreignKey FK_ProveedorCentroCosto_Producto    Script Date: 07/30/2012 17:26:52 ******/
alter table ProveedorCentroCosto  ADD  CONSTRAINT FK_ProveedorCentroCosto_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProveedorCentroCosto_Producto
;
/****** Object:  foreignKey FK_ProveedorCentroCosto_Proveedor    Script Date: 07/30/2012 17:26:52 ******/
alter table ProveedorCentroCosto  ADD  CONSTRAINT FK_ProveedorCentroCosto_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_ProveedorCentroCosto_Proveedor
;
/****** Object:  foreignKey FK_ProveedorCuentaGrupo_Cuenta    Script Date: 07/30/2012 17:26:54 ******/
alter table ProveedorCuentaGrupo  ADD  CONSTRAINT FK_ProveedorCuentaGrupo_Cuenta forEIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_ProveedorCuentaGrupo_Cuenta
;
/****** Object:  foreignKey FK_ProveedorCuentaGrupo_CuentaGrupo    Script Date: 07/30/2012 17:26:54 ******/
alter table ProveedorCuentaGrupo  ADD  CONSTRAINT FK_ProveedorCuentaGrupo_CuentaGrupo forEIGN KEY(cueg_id)
REFERENCES CuentaGrupo (cueg_id)
;
-- FK_ProveedorCuentaGrupo_CuentaGrupo
;
/****** Object:  foreignKey FK_ProveedorCuentaGrupo_Proveedor    Script Date: 07/30/2012 17:26:54 ******/
alter table ProveedorCuentaGrupo  ADD  CONSTRAINT FK_ProveedorCuentaGrupo_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_ProveedorCuentaGrupo_Proveedor
;
/****** Object:  foreignKey FK_ProveedorCuentaGrupo_Usuario    Script Date: 07/30/2012 17:26:54 ******/
alter table ProveedorCuentaGrupo  ADD  CONSTRAINT FK_ProveedorCuentaGrupo_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ProveedorCuentaGrupo_Usuario
;
/****** Object:  foreignKey FK_ProveedorPercepcion_Proveedor    Script Date: 07/30/2012 17:26:56 ******/
alter table ProveedorRetencion  ADD  CONSTRAINT FK_ProveedorPercepcion_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_ProveedorPercepcion_Proveedor
;
/****** Object:  foreignKey FK_ProveedorRetencion_Retencion    Script Date: 07/30/2012 17:26:56 ******/
alter table ProveedorRetencion  ADD  CONSTRAINT FK_ProveedorRetencion_Retencion forEIGN KEY(ret_id)
REFERENCES Retencion (ret_id)
;
-- FK_ProveedorRetencion_Retencion
;
/****** Object:  foreignKey FK_Provincia_Pais    Script Date: 07/30/2012 17:26:59 ******/
alter table Provincia  ADD  CONSTRAINT FK_Provincia_Pais forEIGN KEY(pa_id)
REFERENCES Pais (pa_id)
;
-- FK_Provincia_Pais
;
/****** Object:  foreignKey FK_Provincia_Usuario    Script Date: 07/30/2012 17:26:59 ******/
alter table Provincia  ADD  CONSTRAINT FK_Provincia_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Provincia_Usuario
;
/****** Object:  foreignKey FK_Proyecto_Cliente    Script Date: 07/30/2012 17:27:06 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_Proyecto_Cliente
;
/****** Object:  foreignKey FK_Proyecto_PrestacionAddHora    Script Date: 07/30/2012 17:27:06 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionAddHora forEIGN KEY(pre_id_addHora)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionAddHora
;
/****** Object:  foreignKey FK_Proyecto_PrestacionAddTarea    Script Date: 07/30/2012 17:27:06 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionAddTarea forEIGN KEY(pre_id_addTarea)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionAddTarea
;
/****** Object:  foreignKey FK_Proyecto_PrestacionAprobarTarea    Script Date: 07/30/2012 17:27:06 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionAprobarTarea forEIGN KEY(pre_id_aprobarTarea)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionAprobarTarea
;
/****** Object:  foreignKey FK_Proyecto_PrestacionAsignarTarea    Script Date: 07/30/2012 17:27:06 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionAsignarTarea forEIGN KEY(pre_id_asignarTarea)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionAsignarTarea
;
/****** Object:  foreignKey FK_Proyecto_PrestacionDelHora    Script Date: 07/30/2012 17:27:07 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionDelHora forEIGN KEY(pre_id_delHora)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionDelHora
;
/****** Object:  foreignKey FK_Proyecto_PrestacionDelHoraP    Script Date: 07/30/2012 17:27:07 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionDelHoraP forEIGN KEY(pre_id_delHoraP)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionDelHoraP
;
/****** Object:  foreignKey FK_Proyecto_PrestacionDelTarea    Script Date: 07/30/2012 17:27:07 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionDelTarea forEIGN KEY(pre_id_delTarea)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionDelTarea
;
/****** Object:  foreignKey FK_Proyecto_PrestacionDelTareaD    Script Date: 07/30/2012 17:27:07 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionDelTareaD forEIGN KEY(pre_id_delTareaD)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionDelTareaD
;
/****** Object:  foreignKey FK_Proyecto_PrestacionDelTareaP    Script Date: 07/30/2012 17:27:07 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionDelTareaP forEIGN KEY(pre_id_delTareaP)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionDelTareaP
;
/****** Object:  foreignKey FK_Proyecto_PrestacionEditHora    Script Date: 07/30/2012 17:27:07 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionEditHora forEIGN KEY(pre_id_editHora)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionEditHora
;
/****** Object:  foreignKey FK_Proyecto_PrestacionEditHoraP    Script Date: 07/30/2012 17:27:07 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionEditHoraP forEIGN KEY(pre_id_editHoraP)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionEditHoraP
;
/****** Object:  foreignKey FK_Proyecto_PrestacionEditTarea    Script Date: 07/30/2012 17:27:07 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionEditTarea forEIGN KEY(pre_id_editTarea)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionEditTarea
;
/****** Object:  foreignKey FK_Proyecto_PrestacionEditTareaD    Script Date: 07/30/2012 17:27:08 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionEditTareaD forEIGN KEY(pre_id_editTareaD)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionEditTareaD
;
/****** Object:  foreignKey FK_Proyecto_PrestacionEditTareaP    Script Date: 07/30/2012 17:27:08 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionEditTareaP forEIGN KEY(pre_id_editTareaP)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionEditTareaP
;
/****** Object:  foreignKey FK_Proyecto_PrestacionListHora    Script Date: 07/30/2012 17:27:08 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionListHora forEIGN KEY(pre_id_listHora)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionListHora
;
/****** Object:  foreignKey FK_Proyecto_PrestacionListHoraD    Script Date: 07/30/2012 17:27:08 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionListHoraD forEIGN KEY(pre_id_listHoraD)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionListHoraD
;
/****** Object:  foreignKey FK_Proyecto_PrestacionListTarea    Script Date: 07/30/2012 17:27:08 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionListTarea forEIGN KEY(pre_id_listTarea)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionListTarea
;
/****** Object:  foreignKey FK_Proyecto_PrestacionListTareaD    Script Date: 07/30/2012 17:27:08 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionListTareaD forEIGN KEY(pre_id_listTareaD)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionListTareaD
;
/****** Object:  foreignKey FK_Proyecto_PrestacionTomarTarea    Script Date: 07/30/2012 17:27:08 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionTomarTarea forEIGN KEY(pre_id_tomarTarea)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionTomarTarea
;
/****** Object:  foreignKey FK_Proyecto_Producto    Script Date: 07/30/2012 17:27:08 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_Proyecto_Producto
;
/****** Object:  foreignKey FK_Proyecto_Proveedor    Script Date: 07/30/2012 17:27:08 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_Proyecto_Proveedor
;
/****** Object:  foreignKey FK_Proyecto_Proyecto    Script Date: 07/30/2012 17:27:08 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_Proyecto forEIGN KEY(proy_id_padre)
REFERENCES Proyecto (proy_id)
;
-- FK_Proyecto_Proyecto
;
/****** Object:  foreignKey FK_Proyecto_Talonario    Script Date: 07/30/2012 17:27:08 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_Talonario forEIGN KEY(ta_id)
REFERENCES Talonario (ta_id)
;
-- FK_Proyecto_Talonario
;
/****** Object:  foreignKey FK_Proyecto_Usuario    Script Date: 07/30/2012 17:27:09 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Proyecto_Usuario
;
/****** Object:  foreignKey FK_Proyecto_Usuario1    Script Date: 07/30/2012 17:27:09 ******/
alter table Proyecto  ADD  CONSTRAINT FK_Proyecto_Usuario1 forEIGN KEY(us_id_alta)
REFERENCES Usuario (us_id)
;
-- FK_Proyecto_Usuario1
;
/****** Object:  foreignKey FK_ProyectoItem_Proyecto    Script Date: 07/30/2012 17:27:11 ******/
alter table ProyectoItem  ADD  CONSTRAINT FK_ProyectoItem_Proyecto forEIGN KEY(proy_id)
REFERENCES Proyecto (proy_id)
;
-- FK_ProyectoItem_Proyecto
;
/****** Object:  foreignKey FK_ProyectoItem_Usuario    Script Date: 07/30/2012 17:27:11 ******/
alter table ProyectoItem  ADD  CONSTRAINT FK_ProyectoItem_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ProyectoItem_Usuario
;
/****** Object:  foreignKey FK_ProyectoPrecio_Producto    Script Date: 07/30/2012 17:27:13 ******/
alter table ProyectoPrecio  ADD  CONSTRAINT FK_ProyectoPrecio_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProyectoPrecio_Producto
;
/****** Object:  foreignKey FK_ProyectoPrecio_Proyecto    Script Date: 07/30/2012 17:27:13 ******/
alter table ProyectoPrecio  ADD  CONSTRAINT FK_ProyectoPrecio_Proyecto forEIGN KEY(proy_id)
REFERENCES Proyecto (proy_id)
;
-- FK_ProyectoPrecio_Proyecto
;
/****** Object:  foreignKey FK_ProyectoPrecio_Usuario    Script Date: 07/30/2012 17:27:13 ******/
alter table ProyectoPrecio  ADD  CONSTRAINT FK_ProyectoPrecio_Usuario forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_ProyectoPrecio_Usuario
;
/****** Object:  foreignKey FK_ProyectoPrecio_UsuarioModifico    Script Date: 07/30/2012 17:27:13 ******/
alter table ProyectoPrecio  ADD  CONSTRAINT FK_ProyectoPrecio_UsuarioModifico forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ProyectoPrecio_UsuarioModifico
;
/****** Object:  foreignKey FK_ProyectoTareaEstado_Proyecto    Script Date: 07/30/2012 17:27:15 ******/
alter table ProyectoTareaEstado  ADD  CONSTRAINT FK_ProyectoTareaEstado_Proyecto forEIGN KEY(proy_id)
REFERENCES Proyecto (proy_id)
;
-- FK_ProyectoTareaEstado_Proyecto
;
/****** Object:  foreignKey FK_ProyectoTareaEstado_TareaEstado    Script Date: 07/30/2012 17:27:15 ******/
alter table ProyectoTareaEstado  ADD  CONSTRAINT FK_ProyectoTareaEstado_TareaEstado forEIGN KEY(tarest_id)
REFERENCES TareaEstado (tarest_id)
;
-- FK_ProyectoTareaEstado_TareaEstado
;
/****** Object:  foreignKey FK_ProyectoTareaEstado_Usuario    Script Date: 07/30/2012 17:27:15 ******/
alter table ProyectoTareaEstado  ADD  CONSTRAINT FK_ProyectoTareaEstado_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ProyectoTareaEstado_Usuario
;
/****** Object:  foreignKey FK_Puerto_Ciudad    Script Date: 07/30/2012 17:27:17 ******/
alter table Puerto  ADD  CONSTRAINT FK_Puerto_Ciudad forEIGN KEY(ciu_id)
REFERENCES Ciudad (ciu_id)
;
-- FK_Puerto_Ciudad
;
/****** Object:  foreignKey FK_Puerto_Usuario    Script Date: 07/30/2012 17:27:17 ******/
alter table Puerto  ADD  CONSTRAINT FK_Puerto_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Puerto_Usuario
;
/****** Object:  foreignKey FK_Rama_Arbol    Script Date: 07/30/2012 17:27:19 ******/
alter table Rama  ADD  CONSTRAINT FK_Rama_Arbol forEIGN KEY(arb_id)
REFERENCES Arbol (arb_id)
;
-- FK_Rama_Arbol
;
/****** Object:  foreignKey FK_Rama_Rama    Script Date: 07/30/2012 17:27:19 ******/
alter table Rama  ADD  CONSTRAINT FK_Rama_Rama forEIGN KEY(ram_id_padre)
REFERENCES Rama (ram_id)
;
-- FK_Rama_Rama
;
/****** Object:  foreignKey FK_Rama_Usuario    Script Date: 07/30/2012 17:27:19 ******/
alter table Rama  ADD  CONSTRAINT FK_Rama_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Rama_Usuario
;
/****** Object:  foreignKey FK_RamaVista_ArbolVista    Script Date: 07/30/2012 17:27:21 ******/
alter table RamaVista  ADD  CONSTRAINT FK_RamaVista_ArbolVista forEIGN KEY(arbv_id)
REFERENCES ArbolVista (arbv_id)
;
-- FK_RamaVista_ArbolVista
;
/****** Object:  foreignKey FK_RecuentoStock_DepositoLogico    Script Date: 07/30/2012 17:27:25 ******/
alter table RecuentoStock  ADD  CONSTRAINT FK_RecuentoStock_DepositoLogico forEIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_RecuentoStock_DepositoLogico
;
/****** Object:  foreignKey FK_RecuentoStock_Documento    Script Date: 07/30/2012 17:27:25 ******/
alter table RecuentoStock  ADD  CONSTRAINT FK_RecuentoStock_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_RecuentoStock_Documento
;
/****** Object:  foreignKey FK_RecuentoStock_DocumentoTipo    Script Date: 07/30/2012 17:27:25 ******/
alter table RecuentoStock  ADD  CONSTRAINT FK_RecuentoStock_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_RecuentoStock_DocumentoTipo
;
/****** Object:  foreignKey FK_RecuentoStock_Legajo    Script Date: 07/30/2012 17:27:25 ******/
alter table RecuentoStock  ADD  CONSTRAINT FK_RecuentoStock_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_RecuentoStock_Legajo
;
/****** Object:  foreignKey FK_RecuentoStock_StockIngreso    Script Date: 07/30/2012 17:27:25 ******/
alter table RecuentoStock  ADD  CONSTRAINT FK_RecuentoStock_StockIngreso forEIGN KEY(st_id1)
REFERENCES Stock (st_id)
;
-- FK_RecuentoStock_StockIngreso
;
/****** Object:  foreignKey FK_RecuentoStock_StockSalida    Script Date: 07/30/2012 17:27:25 ******/
alter table RecuentoStock  ADD  CONSTRAINT FK_RecuentoStock_StockSalida forEIGN KEY(st_id2)
REFERENCES Stock (st_id)
;
-- FK_RecuentoStock_StockSalida
;
/****** Object:  foreignKey FK_RecuentoStock_Sucursal    Script Date: 07/30/2012 17:27:26 ******/
alter table RecuentoStock  ADD  CONSTRAINT FK_RecuentoStock_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_RecuentoStock_Sucursal
;
/****** Object:  foreignKey FK_RecuentoStockItem_DepositoLogico    Script Date: 07/30/2012 17:27:28 ******/
alter table RecuentoStockItem  ADD  CONSTRAINT FK_RecuentoStockItem_DepositoLogico forEIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_RecuentoStockItem_DepositoLogico
;
/****** Object:  foreignKey FK_RecuentoStockItem_Producto    Script Date: 07/30/2012 17:27:28 ******/
alter table RecuentoStockItem  ADD  CONSTRAINT FK_RecuentoStockItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_RecuentoStockItem_Producto
;
/****** Object:  foreignKey FK_RecuentoStockItem_RecuentoStock    Script Date: 07/30/2012 17:27:28 ******/
alter table RecuentoStockItem  ADD  CONSTRAINT FK_RecuentoStockItem_RecuentoStock forEIGN KEY(rs_id)
REFERENCES RecuentoStock (rs_id)
;
-- FK_RecuentoStockItem_RecuentoStock
;
/****** Object:  foreignKey FK_RecuentoStockItem_StockLote    Script Date: 07/30/2012 17:27:28 ******/
alter table RecuentoStockItem  ADD  CONSTRAINT FK_RecuentoStockItem_StockLote forEIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_RecuentoStockItem_StockLote
;
/****** Object:  foreignKey FK_RecuentoStockItemSerieTMP_RecuentoStockItemTMP    Script Date: 07/30/2012 17:27:31 ******/
alter table RecuentoStockItemSerieTMP  ADD  CONSTRAINT FK_RecuentoStockItemSerieTMP_RecuentoStockItemTMP forEIGN KEY(rsiTMP_id)
REFERENCES RecuentoStockItemTMP (rsiTMP_id)
;
-- FK_RecuentoStockItemSerieTMP_RecuentoStockItemTMP
;
/****** Object:  foreignKey FK_RecuentoStockItemSerieTMP_RecuentoStockTMP    Script Date: 07/30/2012 17:27:31 ******/
alter table RecuentoStockItemSerieTMP  ADD  CONSTRAINT FK_RecuentoStockItemSerieTMP_RecuentoStockTMP forEIGN KEY(rsTMP_id)
REFERENCES RecuentoStockTMP (rsTMP_id)
;
-- FK_RecuentoStockItemSerieTMP_RecuentoStockTMP
;
/****** Object:  foreignKey FK_RecuentoStockItemTMP_RecuentoStockTMP    Script Date: 07/30/2012 17:27:33 ******/
alter table RecuentoStockItemTMP  ADD  CONSTRAINT FK_RecuentoStockItemTMP_RecuentoStockTMP forEIGN KEY(rsTMP_id)
REFERENCES RecuentoStockTMP (rsTMP_id)
;
-- FK_RecuentoStockItemTMP_RecuentoStockTMP
;
/****** Object:  foreignKey FK_Reina_Colmena    Script Date: 07/30/2012 17:27:40 ******/
alter table Reina  ADD  CONSTRAINT FK_Reina_Colmena forEIGN KEY(colm_id)
REFERENCES Colmena (colm_id)
;
-- FK_Reina_Colmena
;
/****** Object:  foreignKey FK_Reina_Proveedor    Script Date: 07/30/2012 17:27:40 ******/
alter table Reina  ADD  CONSTRAINT FK_Reina_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_Reina_Proveedor
;
/****** Object:  foreignKey FK_Reina_Usuario    Script Date: 07/30/2012 17:27:41 ******/
alter table Reina  ADD  CONSTRAINT FK_Reina_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Reina_Usuario
;
/****** Object:  foreignKey FK_RemitoCompra_CentroCosto    Script Date: 07/30/2012 17:27:48 ******/
alter table RemitoCompra  ADD  CONSTRAINT FK_RemitoCompra_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_RemitoCompra_CentroCosto
;
/****** Object:  foreignKey FK_RemitoCompra_CondicionPago    Script Date: 07/30/2012 17:27:48 ******/
alter table RemitoCompra  ADD  CONSTRAINT FK_RemitoCompra_CondicionPago forEIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_RemitoCompra_CondicionPago
;
/****** Object:  foreignKey FK_RemitoCompra_Documento    Script Date: 07/30/2012 17:27:48 ******/
alter table RemitoCompra  ADD  CONSTRAINT FK_RemitoCompra_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_RemitoCompra_Documento
;
/****** Object:  foreignKey FK_RemitoCompra_DocumentoTipo    Script Date: 07/30/2012 17:27:49 ******/
alter table RemitoCompra  ADD  CONSTRAINT FK_RemitoCompra_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_RemitoCompra_DocumentoTipo
;
/****** Object:  foreignKey FK_RemitoCompra_Estado    Script Date: 07/30/2012 17:27:49 ******/
alter table RemitoCompra  ADD  CONSTRAINT FK_RemitoCompra_Estado forEIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_RemitoCompra_Estado
;
/****** Object:  foreignKey FK_RemitoCompra_ListaDescuento    Script Date: 07/30/2012 17:27:49 ******/
alter table RemitoCompra  ADD  CONSTRAINT FK_RemitoCompra_ListaDescuento forEIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_RemitoCompra_ListaDescuento
;
/****** Object:  foreignKey FK_RemitoCompra_ListaPrecio    Script Date: 07/30/2012 17:27:49 ******/
alter table RemitoCompra  ADD  CONSTRAINT FK_RemitoCompra_ListaPrecio forEIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_RemitoCompra_ListaPrecio
;
/****** Object:  foreignKey FK_RemitoCompra_Proveedor    Script Date: 07/30/2012 17:27:49 ******/
alter table RemitoCompra  ADD  CONSTRAINT FK_RemitoCompra_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_RemitoCompra_Proveedor
;
/****** Object:  foreignKey FK_RemitoCompra_Stock    Script Date: 07/30/2012 17:27:49 ******/
alter table RemitoCompra  ADD  CONSTRAINT FK_RemitoCompra_Stock forEIGN KEY(st_id)
REFERENCES Stock (st_id)
;
-- FK_RemitoCompra_Stock
;
/****** Object:  foreignKey FK_RemitoCompra_Sucursal    Script Date: 07/30/2012 17:27:49 ******/
alter table RemitoCompra  ADD  CONSTRAINT FK_RemitoCompra_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_RemitoCompra_Sucursal
;
/****** Object:  foreignKey FK_RemitoCompraItem_CentroCosto    Script Date: 07/30/2012 17:27:54 ******/
alter table RemitoCompraItem  ADD  CONSTRAINT FK_RemitoCompraItem_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_RemitoCompraItem_CentroCosto
;
/****** Object:  foreignKey FK_RemitoCompraItem_Producto    Script Date: 07/30/2012 17:27:54 ******/
alter table RemitoCompraItem  ADD  CONSTRAINT FK_RemitoCompraItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_RemitoCompraItem_Producto
;
/****** Object:  foreignKey FK_RemitoCompraItem_RemitoCompra    Script Date: 07/30/2012 17:27:54 ******/
alter table RemitoCompraItem  ADD  CONSTRAINT FK_RemitoCompraItem_RemitoCompra forEIGN KEY(rc_id)
REFERENCES RemitoCompra (rc_id)
;
-- FK_RemitoCompraItem_RemitoCompra
;
/****** Object:  foreignKey FK_RemitoCompraItem_StockLote    Script Date: 07/30/2012 17:27:54 ******/
alter table RemitoCompraItem  ADD  CONSTRAINT FK_RemitoCompraItem_StockLote forEIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_RemitoCompraItem_StockLote
;
/****** Object:  foreignKey FK_RemitoCompraItemBorradoTMP_RemitoCompraTMP    Script Date: 07/30/2012 17:27:55 ******/
alter table RemitoCompraItemBorradoTMP  ADD  CONSTRAINT FK_RemitoCompraItemBorradoTMP_RemitoCompraTMP forEIGN KEY(rcTMP_id)
REFERENCES RemitoCompraTMP (rcTMP_id)
;
-- FK_RemitoCompraItemBorradoTMP_RemitoCompraTMP
;
/****** Object:  foreignKey FK_RemitoCompraItemSerieTMP_RemitoCompraItemTMP    Script Date: 07/30/2012 17:27:59 ******/
alter table RemitoCompraItemSerieTMP  ADD  CONSTRAINT FK_RemitoCompraItemSerieTMP_RemitoCompraItemTMP forEIGN KEY(rciTMP_id)
REFERENCES RemitoCompraItemTMP (rciTMP_id)
;
-- FK_RemitoCompraItemSerieTMP_RemitoCompraItemTMP
;
/****** Object:  foreignKey FK_RemitoCompraItemSerieTMP_RemitoCompraTMP    Script Date: 07/30/2012 17:27:59 ******/
alter table RemitoCompraItemSerieTMP  ADD  CONSTRAINT FK_RemitoCompraItemSerieTMP_RemitoCompraTMP forEIGN KEY(rcTMP_id)
REFERENCES RemitoCompraTMP (rcTMP_id)
;
-- FK_RemitoCompraItemSerieTMP_RemitoCompraTMP
;
/****** Object:  foreignKey FK_RemitoCompraItemTMP_RemitoCompraTMP    Script Date: 07/30/2012 17:28:05 ******/
alter table RemitoCompraItemTMP  ADD  CONSTRAINT FK_RemitoCompraItemTMP_RemitoCompraTMP forEIGN KEY(rcTMP_id)
REFERENCES RemitoCompraTMP (rcTMP_id)
;
-- FK_RemitoCompraItemTMP_RemitoCompraTMP
;
/****** Object:  foreignKey FK_RemitoDevolucionCompra_DevolucionCompraItem    Script Date: 07/30/2012 17:28:12 ******/
alter table RemitoDevolucionCompra  ADD  CONSTRAINT FK_RemitoDevolucionCompra_DevolucionCompraItem forEIGN KEY(rci_id_devolucion)
REFERENCES RemitoCompraItem (rci_id)
;
-- FK_RemitoDevolucionCompra_DevolucionCompraItem
;
/****** Object:  foreignKey FK_RemitoDevolucionCompra_RemitoCompraItem    Script Date: 07/30/2012 17:28:12 ******/
alter table RemitoDevolucionCompra  ADD  CONSTRAINT FK_RemitoDevolucionCompra_RemitoCompraItem forEIGN KEY(rci_id_remito)
REFERENCES RemitoCompraItem (rci_id)
;
-- FK_RemitoDevolucionCompra_RemitoCompraItem
;
/****** Object:  foreignKey FK_RemitoDevolucionCompraTMP_RemitoCompraTMP    Script Date: 07/30/2012 17:28:14 ******/
alter table RemitoDevolucionCompraTMP  ADD  CONSTRAINT FK_RemitoDevolucionCompraTMP_RemitoCompraTMP forEIGN KEY(rcTMP_id)
REFERENCES RemitoCompraTMP (rcTMP_id)
;
-- FK_RemitoDevolucionCompraTMP_RemitoCompraTMP
;
/****** Object:  foreignKey FK_RemitoDevolucionVenta_DevolucionVentaItem    Script Date: 07/30/2012 17:28:15 ******/
alter table RemitoDevolucionVenta  ADD  CONSTRAINT FK_RemitoDevolucionVenta_DevolucionVentaItem forEIGN KEY(rvi_id_devolucion)
REFERENCES RemitoVentaItem (rvi_id)
;
-- FK_RemitoDevolucionVenta_DevolucionVentaItem
;
/****** Object:  foreignKey FK_RemitoDevolucionVenta_RemitoVentaItem    Script Date: 07/30/2012 17:28:15 ******/
alter table RemitoDevolucionVenta  ADD  CONSTRAINT FK_RemitoDevolucionVenta_RemitoVentaItem forEIGN KEY(rvi_id_remito)
REFERENCES RemitoVentaItem (rvi_id)
;
-- FK_RemitoDevolucionVenta_RemitoVentaItem
;
/****** Object:  foreignKey FK_RemitoDevolucionVentaTMP_RemitoVentaTMP    Script Date: 07/30/2012 17:28:16 ******/
alter table RemitoDevolucionVentaTMP  ADD  CONSTRAINT FK_RemitoDevolucionVentaTMP_RemitoVentaTMP forEIGN KEY(rvTMP_id)
REFERENCES RemitoVentaTMP (rvTMP_id)
;
-- FK_RemitoDevolucionVentaTMP_RemitoVentaTMP
;
/****** Object:  foreignKey FK_RemitoFacturaCompra_FacturaCompraItem    Script Date: 07/30/2012 17:28:17 ******/
alter table RemitoFacturaCompra  ADD  CONSTRAINT FK_RemitoFacturaCompra_FacturaCompraItem forEIGN KEY(fci_id)
REFERENCES FacturaCompraItem (fci_id)
;
-- FK_RemitoFacturaCompra_FacturaCompraItem
;
/****** Object:  foreignKey FK_RemitoFacturaCompra_RemitoCompraItem    Script Date: 07/30/2012 17:28:17 ******/
alter table RemitoFacturaCompra  ADD  CONSTRAINT FK_RemitoFacturaCompra_RemitoCompraItem forEIGN KEY(rci_id)
REFERENCES RemitoCompraItem (rci_id)
;
-- FK_RemitoFacturaCompra_RemitoCompraItem
;
/****** Object:  foreignKey FK_RemitoFacturaVenta_FacturaVentaItem    Script Date: 07/30/2012 17:28:20 ******/
alter table RemitoFacturaVenta  ADD  CONSTRAINT FK_RemitoFacturaVenta_FacturaVentaItem forEIGN KEY(fvi_id)
REFERENCES FacturaVentaItem (fvi_id)
;
-- FK_RemitoFacturaVenta_FacturaVentaItem
;
/****** Object:  foreignKey FK_RemitoFacturaVenta_RemitoVentaItem    Script Date: 07/30/2012 17:28:20 ******/
alter table RemitoFacturaVenta  ADD  CONSTRAINT FK_RemitoFacturaVenta_RemitoVentaItem forEIGN KEY(rvi_id)
REFERENCES RemitoVentaItem (rvi_id)
;
-- FK_RemitoFacturaVenta_RemitoVentaItem
;
/****** Object:  foreignKey FK_RemitoVenta_Camion    Script Date: 07/30/2012 17:28:33 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Camion forEIGN KEY(cam_id)
REFERENCES Camion (cam_id)
;
-- FK_RemitoVenta_Camion
;
/****** Object:  foreignKey FK_RemitoVenta_Camion1    Script Date: 07/30/2012 17:28:33 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Camion1 forEIGN KEY(cam_id_semi)
REFERENCES Camion (cam_id)
;
-- FK_RemitoVenta_Camion1
;
/****** Object:  foreignKey FK_RemitoVenta_CentroCosto    Script Date: 07/30/2012 17:28:33 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_RemitoVenta_CentroCosto
;
/****** Object:  foreignKey FK_RemitoVenta_Chofer    Script Date: 07/30/2012 17:28:33 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Chofer forEIGN KEY(chof_id)
REFERENCES Chofer (chof_id)
;
-- FK_RemitoVenta_Chofer
;
/****** Object:  foreignKey FK_RemitoVenta_Cliente    Script Date: 07/30/2012 17:28:33 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_RemitoVenta_Cliente
;
/****** Object:  foreignKey FK_RemitoVenta_ClienteSucursal    Script Date: 07/30/2012 17:28:33 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_ClienteSucursal forEIGN KEY(clis_id)
REFERENCES ClienteSucursal (clis_id)
;
-- FK_RemitoVenta_ClienteSucursal
;
/****** Object:  foreignKey FK_RemitoVenta_CondicionPago    Script Date: 07/30/2012 17:28:33 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_CondicionPago forEIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_RemitoVenta_CondicionPago
;
/****** Object:  foreignKey FK_RemitoVenta_Documento    Script Date: 07/30/2012 17:28:33 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_RemitoVenta_Documento
;
/****** Object:  foreignKey FK_RemitoVenta_DocumentoTipo    Script Date: 07/30/2012 17:28:34 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_RemitoVenta_DocumentoTipo
;
/****** Object:  foreignKey FK_RemitoVenta_Empresa    Script Date: 07/30/2012 17:28:34 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_RemitoVenta_Empresa
;
/****** Object:  foreignKey FK_RemitoVenta_Estado    Script Date: 07/30/2012 17:28:34 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Estado forEIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_RemitoVenta_Estado
;
/****** Object:  foreignKey FK_RemitoVenta_ImportacionID    Script Date: 07/30/2012 17:28:34 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_ImportacionID forEIGN KEY(impid_id)
REFERENCES ImportacionID (impid_id)
;
-- FK_RemitoVenta_ImportacionID
;
/****** Object:  foreignKey FK_RemitoVenta_Legajo    Script Date: 07/30/2012 17:28:34 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_RemitoVenta_Legajo
;
/****** Object:  foreignKey FK_RemitoVenta_ListaDescuento    Script Date: 07/30/2012 17:28:34 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_ListaDescuento forEIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_RemitoVenta_ListaDescuento
;
/****** Object:  foreignKey FK_RemitoVenta_ListaPrecio    Script Date: 07/30/2012 17:28:34 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_ListaPrecio forEIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_RemitoVenta_ListaPrecio
;
/****** Object:  foreignKey FK_RemitoVenta_ProvinciaDestino    Script Date: 07/30/2012 17:28:34 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_ProvinciaDestino forEIGN KEY(pro_id_destino)
REFERENCES Provincia (pro_id)
;
-- FK_RemitoVenta_ProvinciaDestino
;
/****** Object:  foreignKey FK_RemitoVenta_ProvinciaOrigen    Script Date: 07/30/2012 17:28:34 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_ProvinciaOrigen forEIGN KEY(pro_id_origen)
REFERENCES Provincia (pro_id)
;
-- FK_RemitoVenta_ProvinciaOrigen
;
/****** Object:  foreignKey FK_RemitoVenta_Stock    Script Date: 07/30/2012 17:28:34 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Stock forEIGN KEY(st_id)
REFERENCES Stock (st_id)
;
-- FK_RemitoVenta_Stock
;
/****** Object:  foreignKey FK_RemitoVenta_Stock1    Script Date: 07/30/2012 17:28:35 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Stock1 forEIGN KEY(st_id_producido)
REFERENCES Stock (st_id)
;
-- FK_RemitoVenta_Stock1
;
/****** Object:  foreignKey FK_RemitoVenta_StockConsumo    Script Date: 07/30/2012 17:28:35 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_StockConsumo forEIGN KEY(st_id_consumo)
REFERENCES Stock (st_id)
;
-- FK_RemitoVenta_StockConsumo
;
/****** Object:  foreignKey FK_RemitoVenta_StockConsumoTemp    Script Date: 07/30/2012 17:28:35 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_StockConsumoTemp forEIGN KEY(st_id_consumoTemp)
REFERENCES Stock (st_id)
;
-- FK_RemitoVenta_StockConsumoTemp
;
/****** Object:  foreignKey FK_RemitoVenta_Sucursal    Script Date: 07/30/2012 17:28:35 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_RemitoVenta_Sucursal
;
/****** Object:  foreignKey FK_RemitoVenta_Transporte    Script Date: 07/30/2012 17:28:35 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Transporte forEIGN KEY(trans_id)
REFERENCES Transporte (trans_id)
;
-- FK_RemitoVenta_Transporte
;
/****** Object:  foreignKey FK_RemitoVenta_Vendedor    Script Date: 07/30/2012 17:28:35 ******/
alter table RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Vendedor forEIGN KEY(ven_id)
REFERENCES Vendedor (ven_id)
;
-- FK_RemitoVenta_Vendedor
;
/****** Object:  foreignKey FK_RemitoVentaItem_CentroCosto    Script Date: 07/30/2012 17:28:40 ******/
alter table RemitoVentaItem  ADD  CONSTRAINT FK_RemitoVentaItem_CentroCosto forEIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_RemitoVentaItem_CentroCosto
;
/****** Object:  foreignKey FK_RemitoVentaItem_Producto    Script Date: 07/30/2012 17:28:40 ******/
alter table RemitoVentaItem  ADD  CONSTRAINT FK_RemitoVentaItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_RemitoVentaItem_Producto
;
/****** Object:  foreignKey FK_RemitoVentaItem_RemitoVenta    Script Date: 07/30/2012 17:28:40 ******/
alter table RemitoVentaItem  ADD  CONSTRAINT FK_RemitoVentaItem_RemitoVenta forEIGN KEY(rv_id)
REFERENCES RemitoVenta (rv_id)
;
-- FK_RemitoVentaItem_RemitoVenta
;
/****** Object:  foreignKey FK_RemitoVentaItem_StockLote    Script Date: 07/30/2012 17:28:40 ******/
alter table RemitoVentaItem  ADD  CONSTRAINT FK_RemitoVentaItem_StockLote forEIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_RemitoVentaItem_StockLote
;
/****** Object:  foreignKey FK_RemitoVentaItemBorradoTMP_RemitoVentaTMP    Script Date: 07/30/2012 17:28:41 ******/
alter table RemitoVentaItemBorradoTMP  ADD  CONSTRAINT FK_RemitoVentaItemBorradoTMP_RemitoVentaTMP forEIGN KEY(rvTMP_id)
REFERENCES RemitoVentaTMP (rvTMP_id)
;
-- FK_RemitoVentaItemBorradoTMP_RemitoVentaTMP
;
/****** Object:  foreignKey FK_RemitoVentaItemInsumoTMP_RemitoVentaItemTMP    Script Date: 07/30/2012 17:28:43 ******/
alter table RemitoVentaItemInsumoTMP  ADD  CONSTRAINT FK_RemitoVentaItemInsumoTMP_RemitoVentaItemTMP forEIGN KEY(rviTMP_id)
REFERENCES RemitoVentaItemTMP (rviTMP_id)
;
-- FK_RemitoVentaItemInsumoTMP_RemitoVentaItemTMP
;
/****** Object:  foreignKey FK_RemitoVentaItemInsumoTMP_RemitoVentaTMP    Script Date: 07/30/2012 17:28:43 ******/
alter table RemitoVentaItemInsumoTMP  ADD  CONSTRAINT FK_RemitoVentaItemInsumoTMP_RemitoVentaTMP forEIGN KEY(rvTMP_id)
REFERENCES RemitoVentaTMP (rvTMP_id)
;
-- FK_RemitoVentaItemInsumoTMP_RemitoVentaTMP
;
/****** Object:  foreignKey FK_RemitoVentaItemSerieTMP_RemitoVentaItemTMP    Script Date: 07/30/2012 17:28:46 ******/
alter table RemitoVentaItemSerieTMP  ADD  CONSTRAINT FK_RemitoVentaItemSerieTMP_RemitoVentaItemTMP forEIGN KEY(rviTMP_id)
REFERENCES RemitoVentaItemTMP (rviTMP_id)
;
-- FK_RemitoVentaItemSerieTMP_RemitoVentaItemTMP
;
/****** Object:  foreignKey FK_RemitoVentaItemSerieTMP_RemitoVentaTMP    Script Date: 07/30/2012 17:28:46 ******/
alter table RemitoVentaItemSerieTMP  ADD  CONSTRAINT FK_RemitoVentaItemSerieTMP_RemitoVentaTMP forEIGN KEY(rvTMP_id)
REFERENCES RemitoVentaTMP (rvTMP_id)
;
-- FK_RemitoVentaItemSerieTMP_RemitoVentaTMP
;
/****** Object:  foreignKey FK_RemitoVentaItemTMP_RemitoVentaTMP    Script Date: 07/30/2012 17:28:51 ******/
alter table RemitoVentaItemTMP  ADD  CONSTRAINT FK_RemitoVentaItemTMP_RemitoVentaTMP forEIGN KEY(rvTMP_id)
REFERENCES RemitoVentaTMP (rvTMP_id)
;
-- FK_RemitoVentaItemTMP_RemitoVentaTMP
;
/****** Object:  foreignKey FK_Reporte_Informe    Script Date: 07/30/2012 17:29:02 ******/
alter table Reporte  ADD  CONSTRAINT FK_Reporte_Informe forEIGN KEY(inf_id)
REFERENCES Informe (inf_id)
;
-- FK_Reporte_Informe
;
/****** Object:  foreignKey FK_Reporte_Usuario    Script Date: 07/30/2012 17:29:02 ******/
alter table Reporte  ADD  CONSTRAINT FK_Reporte_Usuario forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_Reporte_Usuario
;
/****** Object:  foreignKey FK_Reporte_Usuario1    Script Date: 07/30/2012 17:29:02 ******/
alter table Reporte  ADD  CONSTRAINT FK_Reporte_Usuario1 forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Reporte_Usuario1
;
/****** Object:  foreignKey FK_ReporteFormulario_Documento    Script Date: 07/30/2012 17:29:05 ******/
alter table ReporteFormulario  ADD  CONSTRAINT FK_ReporteFormulario_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_ReporteFormulario_Documento
;
/****** Object:  foreignKey FK_ReporteFormulario_Tabla    Script Date: 07/30/2012 17:29:06 ******/
alter table ReporteFormulario  ADD  CONSTRAINT FK_ReporteFormulario_Tabla forEIGN KEY(tbl_id)
REFERENCES Tabla (tbl_id)
;
-- FK_ReporteFormulario_Tabla
;
/****** Object:  foreignKey FK_ReporteFormulario_Usuario    Script Date: 07/30/2012 17:29:06 ******/
alter table ReporteFormulario  ADD  CONSTRAINT FK_ReporteFormulario_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ReporteFormulario_Usuario
;
/****** Object:  foreignKey FK_ReporteParametro_InformeParametro    Script Date: 07/30/2012 17:29:08 ******/
alter table ReporteParametro  ADD  CONSTRAINT FK_ReporteParametro_InformeParametro forEIGN KEY(infp_id)
REFERENCES InformeParametro (infp_id)
;
-- FK_ReporteParametro_InformeParametro
;
/****** Object:  foreignKey FK_ReporteParametro_Reporte    Script Date: 07/30/2012 17:29:08 ******/
alter table ReporteParametro  ADD  CONSTRAINT FK_ReporteParametro_Reporte forEIGN KEY(rpt_id)
REFERENCES Reporte (rpt_id)
;
-- FK_ReporteParametro_Reporte
;
/****** Object:  foreignKey FK_ResolucionCupon_Asiento    Script Date: 07/30/2012 17:29:12 ******/
alter table ResolucionCupon  ADD  CONSTRAINT FK_ResolucionCupon_Asiento forEIGN KEY(as_id)
REFERENCES Asiento (as_id)
;
-- FK_ResolucionCupon_Asiento
;
/****** Object:  foreignKey FK_ResolucionCupon_Documento    Script Date: 07/30/2012 17:29:12 ******/
alter table ResolucionCupon  ADD  CONSTRAINT FK_ResolucionCupon_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_ResolucionCupon_Documento
;
/****** Object:  foreignKey FK_ResolucionCupon_DocumentoTipo    Script Date: 07/30/2012 17:29:12 ******/
alter table ResolucionCupon  ADD  CONSTRAINT FK_ResolucionCupon_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_ResolucionCupon_DocumentoTipo
;
/****** Object:  foreignKey FK_ResolucionCupon_Estado    Script Date: 07/30/2012 17:29:12 ******/
alter table ResolucionCupon  ADD  CONSTRAINT FK_ResolucionCupon_Estado forEIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_ResolucionCupon_Estado
;
/****** Object:  foreignKey FK_ResolucionCupon_Legajo    Script Date: 07/30/2012 17:29:12 ******/
alter table ResolucionCupon  ADD  CONSTRAINT FK_ResolucionCupon_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_ResolucionCupon_Legajo
;
/****** Object:  foreignKey FK_ResolucionCupon_Sucursal    Script Date: 07/30/2012 17:29:12 ******/
alter table ResolucionCupon  ADD  CONSTRAINT FK_ResolucionCupon_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_ResolucionCupon_Sucursal
;
/****** Object:  foreignKey FK_ResolucionCuponItem_Cuenta    Script Date: 07/30/2012 17:29:15 ******/
alter table ResolucionCuponItem  ADD  CONSTRAINT FK_ResolucionCuponItem_Cuenta forEIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_ResolucionCuponItem_Cuenta
;
/****** Object:  foreignKey FK_ResolucionCuponItem_ResolucionCupon    Script Date: 07/30/2012 17:29:16 ******/
alter table ResolucionCuponItem  ADD  CONSTRAINT FK_ResolucionCuponItem_ResolucionCupon forEIGN KEY(rcup_id)
REFERENCES ResolucionCupon (rcup_id)
;
-- FK_ResolucionCuponItem_ResolucionCupon
;
/****** Object:  foreignKey FK_ResolucionCuponItem_TarjetaCreditoCupon    Script Date: 07/30/2012 17:29:16 ******/
alter table ResolucionCuponItem  ADD  CONSTRAINT FK_ResolucionCuponItem_TarjetaCreditoCupon forEIGN KEY(tjcc_id)
REFERENCES TarjetaCreditoCupon (tjcc_id)
;
-- FK_ResolucionCuponItem_TarjetaCreditoCupon
;
/****** Object:  foreignKey FK_ResolucionCuponItemBorradoTMP_ResolucionCuponTMP    Script Date: 07/30/2012 17:29:17 ******/
alter table ResolucionCuponItemBorradoTMP  ADD  CONSTRAINT FK_ResolucionCuponItemBorradoTMP_ResolucionCuponTMP forEIGN KEY(rcupTMP_id)
REFERENCES ResolucionCuponTMP (rcupTMP_id)
;
-- FK_ResolucionCuponItemBorradoTMP_ResolucionCuponTMP
;
/****** Object:  foreignKey FK_ResolucionCuponItemTMP_ResolucionCuponTMP    Script Date: 07/30/2012 17:29:19 ******/
alter table ResolucionCuponItemTMP  ADD  CONSTRAINT FK_ResolucionCuponItemTMP_ResolucionCuponTMP forEIGN KEY(rcupTMP_id)
REFERENCES ResolucionCuponTMP (rcupTMP_id)
;
-- FK_ResolucionCuponItemTMP_ResolucionCuponTMP
;
/****** Object:  foreignKey FK_Retencion_IngresosBrutosCategoria    Script Date: 07/30/2012 17:29:27 ******/
alter table Retencion  ADD  CONSTRAINT FK_Retencion_IngresosBrutosCategoria forEIGN KEY(ibc_id)
REFERENCES IngresosBrutosCategoria (ibc_id)
;
-- FK_Retencion_IngresosBrutosCategoria
;
/****** Object:  foreignKey FK_Retencion_RetencionTipo    Script Date: 07/30/2012 17:29:27 ******/
alter table Retencion  ADD  CONSTRAINT FK_Retencion_RetencionTipo forEIGN KEY(rett_id)
REFERENCES RetencionTipo (rett_id)
;
-- FK_Retencion_RetencionTipo
;
/****** Object:  foreignKey FK_Retencion_Talonario    Script Date: 07/30/2012 17:29:27 ******/
alter table Retencion  ADD  CONSTRAINT FK_Retencion_Talonario forEIGN KEY(ta_id)
REFERENCES Talonario (ta_id)
;
-- FK_Retencion_Talonario
;
/****** Object:  foreignKey FK_Retencion_Usuario    Script Date: 07/30/2012 17:29:27 ******/
alter table Retencion  ADD  CONSTRAINT FK_Retencion_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Retencion_Usuario
;
/****** Object:  foreignKey FK_RetencionItem_Retencion    Script Date: 07/30/2012 17:29:30 ******/
alter table RetencionItem  ADD  CONSTRAINT FK_RetencionItem_Retencion forEIGN KEY(ret_id)
REFERENCES Retencion (ret_id)
;
-- FK_RetencionItem_Retencion
;
/****** Object:  foreignKey FK_RetencionTipo_Cuenta    Script Date: 07/30/2012 17:29:34 ******/
alter table RetencionTipo  ADD  CONSTRAINT FK_RetencionTipo_Cuenta forEIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_RetencionTipo_Cuenta
;
/****** Object:  foreignKey FK_RetencionTipo_Usuario    Script Date: 07/30/2012 17:29:34 ******/
alter table RetencionTipo  ADD  CONSTRAINT FK_RetencionTipo_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_RetencionTipo_Usuario
;
/****** Object:  foreignKey FK_Rol_Usuario    Script Date: 07/30/2012 17:29:35 ******/
alter table Rol  ADD  CONSTRAINT FK_Rol_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Rol_Usuario
;
/****** Object:  foreignKey FK_Rubro_RubroTabla    Script Date: 07/30/2012 17:29:42 ******/
alter table Rubro  ADD  CONSTRAINT FK_Rubro_RubroTabla forEIGN KEY(rubt_id1)
REFERENCES RubroTabla (rubt_id)
;
-- FK_Rubro_RubroTabla
;
/****** Object:  foreignKey FK_Rubro_RubroTabla1    Script Date: 07/30/2012 17:29:42 ******/
alter table Rubro  ADD  CONSTRAINT FK_Rubro_RubroTabla1 forEIGN KEY(rubt_id2)
REFERENCES RubroTabla (rubt_id)
;
-- FK_Rubro_RubroTabla1
;
/****** Object:  foreignKey FK_Rubro_RubroTabla2    Script Date: 07/30/2012 17:29:43 ******/
alter table Rubro  ADD  CONSTRAINT FK_Rubro_RubroTabla2 forEIGN KEY(rubt_id3)
REFERENCES RubroTabla (rubt_id)
;
-- FK_Rubro_RubroTabla2
;
/****** Object:  foreignKey FK_Rubro_RubroTabla3    Script Date: 07/30/2012 17:29:43 ******/
alter table Rubro  ADD  CONSTRAINT FK_Rubro_RubroTabla3 forEIGN KEY(rubt_id4)
REFERENCES RubroTabla (rubt_id)
;
-- FK_Rubro_RubroTabla3
;
/****** Object:  foreignKey FK_Rubro_RubroTabla4    Script Date: 07/30/2012 17:29:43 ******/
alter table Rubro  ADD  CONSTRAINT FK_Rubro_RubroTabla4 forEIGN KEY(rubt_id5)
REFERENCES RubroTabla (rubt_id)
;
-- FK_Rubro_RubroTabla4
;
/****** Object:  foreignKey FK_Rubro_RubroTabla5    Script Date: 07/30/2012 17:29:43 ******/
alter table Rubro  ADD  CONSTRAINT FK_Rubro_RubroTabla5 forEIGN KEY(rubt_id6)
REFERENCES RubroTabla (rubt_id)
;
-- FK_Rubro_RubroTabla5
;
/****** Object:  foreignKey FK_Rubro_RubroTabla6    Script Date: 07/30/2012 17:29:43 ******/
alter table Rubro  ADD  CONSTRAINT FK_Rubro_RubroTabla6 forEIGN KEY(rubt_id7)
REFERENCES RubroTabla (rubt_id)
;
-- FK_Rubro_RubroTabla6
;
/****** Object:  foreignKey FK_Rubro_RubroTabla7    Script Date: 07/30/2012 17:29:43 ******/
alter table Rubro  ADD  CONSTRAINT FK_Rubro_RubroTabla7 forEIGN KEY(rubt_id8)
REFERENCES RubroTabla (rubt_id)
;
-- FK_Rubro_RubroTabla7
;
/****** Object:  foreignKey FK_Rubro_RubroTabla8    Script Date: 07/30/2012 17:29:43 ******/
alter table Rubro  ADD  CONSTRAINT FK_Rubro_RubroTabla8 forEIGN KEY(rubt_id9)
REFERENCES RubroTabla (rubt_id)
;
-- FK_Rubro_RubroTabla8
;
/****** Object:  foreignKey FK_Rubro_RubroTabla9    Script Date: 07/30/2012 17:29:43 ******/
alter table Rubro  ADD  CONSTRAINT FK_Rubro_RubroTabla9 forEIGN KEY(rubt_id10)
REFERENCES RubroTabla (rubt_id)
;
-- FK_Rubro_RubroTabla9
;
/****** Object:  foreignKey FK_Rubro_RubroTablaItem    Script Date: 07/30/2012 17:29:43 ******/
alter table Rubro  ADD  CONSTRAINT FK_Rubro_RubroTablaItem forEIGN KEY(rubti_id1)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Rubro_RubroTablaItem
;
/****** Object:  foreignKey FK_Rubro_RubroTablaItem1    Script Date: 07/30/2012 17:29:43 ******/
alter table Rubro  ADD  CONSTRAINT FK_Rubro_RubroTablaItem1 forEIGN KEY(rubti_id2)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Rubro_RubroTablaItem1
;
/****** Object:  foreignKey FK_Rubro_RubroTablaItem2    Script Date: 07/30/2012 17:29:44 ******/
alter table Rubro  ADD  CONSTRAINT FK_Rubro_RubroTablaItem2 forEIGN KEY(rubti_id3)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Rubro_RubroTablaItem2
;
/****** Object:  foreignKey FK_Rubro_RubroTablaItem3    Script Date: 07/30/2012 17:29:44 ******/
alter table Rubro  ADD  CONSTRAINT FK_Rubro_RubroTablaItem3 forEIGN KEY(rubti_id4)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Rubro_RubroTablaItem3
;
/****** Object:  foreignKey FK_Rubro_RubroTablaItem4    Script Date: 07/30/2012 17:29:44 ******/
alter table Rubro  ADD  CONSTRAINT FK_Rubro_RubroTablaItem4 forEIGN KEY(rubti_id5)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Rubro_RubroTablaItem4
;
/****** Object:  foreignKey FK_Rubro_RubroTablaItem5    Script Date: 07/30/2012 17:29:44 ******/
alter table Rubro  ADD  CONSTRAINT FK_Rubro_RubroTablaItem5 forEIGN KEY(rubti_id6)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Rubro_RubroTablaItem5
;
/****** Object:  foreignKey FK_Rubro_RubroTablaItem6    Script Date: 07/30/2012 17:29:44 ******/
alter table Rubro  ADD  CONSTRAINT FK_Rubro_RubroTablaItem6 forEIGN KEY(rubti_id7)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Rubro_RubroTablaItem6
;
/****** Object:  foreignKey FK_Rubro_RubroTablaItem7    Script Date: 07/30/2012 17:29:44 ******/
alter table Rubro  ADD  CONSTRAINT FK_Rubro_RubroTablaItem7 forEIGN KEY(rubti_id8)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Rubro_RubroTablaItem7
;
/****** Object:  foreignKey FK_Rubro_RubroTablaItem8    Script Date: 07/30/2012 17:29:44 ******/
alter table Rubro  ADD  CONSTRAINT FK_Rubro_RubroTablaItem8 forEIGN KEY(rubti_id9)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Rubro_RubroTablaItem8
;
/****** Object:  foreignKey FK_Rubro_RubroTablaItem9    Script Date: 07/30/2012 17:29:44 ******/
alter table Rubro  ADD  CONSTRAINT FK_Rubro_RubroTablaItem9 forEIGN KEY(rubti_id10)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Rubro_RubroTablaItem9
;
/****** Object:  foreignKey FK_Rubro_Usuario    Script Date: 07/30/2012 17:29:44 ******/
alter table Rubro  ADD  CONSTRAINT FK_Rubro_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Rubro_Usuario
;
/****** Object:  foreignKey FK_RubroTablaItem_RubroTabla    Script Date: 07/30/2012 17:29:48 ******/
alter table RubroTablaItem  ADD  CONSTRAINT FK_RubroTablaItem_RubroTabla forEIGN KEY(rubt_id)
REFERENCES RubroTabla (rubt_id)
;
-- FK_RubroTablaItem_RubroTabla
;
/****** Object:  foreignKey FK_SindicatoCategoria_Sindicato    Script Date: 07/30/2012 17:29:52 ******/
alter table SindicatoCategoria  ADD  CONSTRAINT FK_SindicatoCategoria_Sindicato forEIGN KEY(sind_id)
REFERENCES Sindicato (sind_id)
;
-- FK_SindicatoCategoria_Sindicato
;
/****** Object:  foreignKey FK_SindicatoConvenio_Sindicato    Script Date: 07/30/2012 17:29:54 ******/
alter table SindicatoConvenio  ADD  CONSTRAINT FK_SindicatoConvenio_Sindicato forEIGN KEY(sind_id)
REFERENCES Sindicato (sind_id)
;
-- FK_SindicatoConvenio_Sindicato
;
/****** Object:  foreignKey FK_SindicatoConvenioCategoria_Sindicato    Script Date: 07/30/2012 17:29:56 ******/
alter table SindicatoConvenioCategoria  ADD  CONSTRAINT FK_SindicatoConvenioCategoria_Sindicato forEIGN KEY(sind_id)
REFERENCES Sindicato (sind_id)
;
-- FK_SindicatoConvenioCategoria_Sindicato
;
/****** Object:  foreignKey FK_SindicatoConvenioCategoria_SindicatoCategoria    Script Date: 07/30/2012 17:29:56 ******/
alter table SindicatoConvenioCategoria  ADD  CONSTRAINT FK_SindicatoConvenioCategoria_SindicatoCategoria forEIGN KEY(sindca_id)
REFERENCES SindicatoCategoria (sindca_id)
;
-- FK_SindicatoConvenioCategoria_SindicatoCategoria
;
/****** Object:  foreignKey FK_SindicatoConvenioCategoria_SindicatoConvenio    Script Date: 07/30/2012 17:29:56 ******/
alter table SindicatoConvenioCategoria  ADD  CONSTRAINT FK_SindicatoConvenioCategoria_SindicatoConvenio forEIGN KEY(sindco_id)
REFERENCES SindicatoConvenio (sindco_id)
;
-- FK_SindicatoConvenioCategoria_SindicatoConvenio
;
/****** Object:  foreignKey FK_Stock_DepositoLogicoDestino    Script Date: 07/30/2012 17:30:02 ******/
alter table Stock  ADD  CONSTRAINT FK_Stock_DepositoLogicoDestino forEIGN KEY(depl_id_destino)
REFERENCES DepositoLogico (depl_id)
;
-- FK_Stock_DepositoLogicoDestino
;
/****** Object:  foreignKey FK_Stock_DepositoLogicoOrigen    Script Date: 07/30/2012 17:30:02 ******/
alter table Stock  ADD  CONSTRAINT FK_Stock_DepositoLogicoOrigen forEIGN KEY(depl_id_origen)
REFERENCES DepositoLogico (depl_id)
;
-- FK_Stock_DepositoLogicoOrigen
;
/****** Object:  foreignKey FK_Stock_Documento    Script Date: 07/30/2012 17:30:02 ******/
alter table Stock  ADD  CONSTRAINT FK_Stock_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_Stock_Documento
;
/****** Object:  foreignKey FK_Stock_DocumentoTipo    Script Date: 07/30/2012 17:30:03 ******/
alter table Stock  ADD  CONSTRAINT FK_Stock_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_Stock_DocumentoTipo
;
/****** Object:  foreignKey FK_Stock_Legajo    Script Date: 07/30/2012 17:30:03 ******/
alter table Stock  ADD  CONSTRAINT FK_Stock_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_Stock_Legajo
;
/****** Object:  foreignKey FK_Stock_Sucursal    Script Date: 07/30/2012 17:30:03 ******/
alter table Stock  ADD  CONSTRAINT FK_Stock_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_Stock_Sucursal
;
/****** Object:  foreignKey FK_StockCache_DepositoLogico    Script Date: 07/30/2012 17:30:04 ******/
alter table StockCache  ADD  CONSTRAINT FK_StockCache_DepositoLogico forEIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_StockCache_DepositoLogico
;
/****** Object:  foreignKey FK_StockCache_Producto    Script Date: 07/30/2012 17:30:04 ******/
alter table StockCache  ADD  CONSTRAINT FK_StockCache_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_StockCache_Producto
;
/****** Object:  foreignKey FK_StockCache_ProductoNumeroSerie    Script Date: 07/30/2012 17:30:05 ******/
alter table StockCache  ADD  CONSTRAINT FK_StockCache_ProductoNumeroSerie forEIGN KEY(prns_id)
REFERENCES ProductoNumeroSerie (prns_id)
;
-- FK_StockCache_ProductoNumeroSerie
;
/****** Object:  foreignKey FK_StockCache_StockLote    Script Date: 07/30/2012 17:30:05 ******/
alter table StockCache  ADD  CONSTRAINT FK_StockCache_StockLote forEIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_StockCache_StockLote
;
/****** Object:  foreignKey FK_StockCliente_Cliente    Script Date: 07/30/2012 17:30:08 ******/
alter table StockCliente  ADD  CONSTRAINT FK_StockCliente_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_StockCliente_Cliente
;
/****** Object:  foreignKey FK_StockCliente_DepositoLogicoDestino    Script Date: 07/30/2012 17:30:09 ******/
alter table StockCliente  ADD  CONSTRAINT FK_StockCliente_DepositoLogicoDestino forEIGN KEY(depl_id_destino)
REFERENCES DepositoLogico (depl_id)
;
-- FK_StockCliente_DepositoLogicoDestino
;
/****** Object:  foreignKey FK_StockCliente_DepositoLogicoOrigen    Script Date: 07/30/2012 17:30:09 ******/
alter table StockCliente  ADD  CONSTRAINT FK_StockCliente_DepositoLogicoOrigen forEIGN KEY(depl_id_origen)
REFERENCES DepositoLogico (depl_id)
;
-- FK_StockCliente_DepositoLogicoOrigen
;
/****** Object:  foreignKey FK_StockCliente_Documento    Script Date: 07/30/2012 17:30:09 ******/
alter table StockCliente  ADD  CONSTRAINT FK_StockCliente_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_StockCliente_Documento
;
/****** Object:  foreignKey FK_StockCliente_DocumentoTipo    Script Date: 07/30/2012 17:30:09 ******/
alter table StockCliente  ADD  CONSTRAINT FK_StockCliente_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_StockCliente_DocumentoTipo
;
/****** Object:  foreignKey FK_StockCliente_Legajo    Script Date: 07/30/2012 17:30:09 ******/
alter table StockCliente  ADD  CONSTRAINT FK_StockCliente_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_StockCliente_Legajo
;
/****** Object:  foreignKey FK_StockCliente_Stock    Script Date: 07/30/2012 17:30:09 ******/
alter table StockCliente  ADD  CONSTRAINT FK_StockCliente_Stock forEIGN KEY(st_id)
REFERENCES Stock (st_id)
;
-- FK_StockCliente_Stock
;
/****** Object:  foreignKey FK_StockCliente_Sucursal    Script Date: 07/30/2012 17:30:09 ******/
alter table StockCliente  ADD  CONSTRAINT FK_StockCliente_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_StockCliente_Sucursal
;
/****** Object:  foreignKey FK_StockItem_DepositoLogico    Script Date: 07/30/2012 17:30:16 ******/
alter table StockItem  ADD  CONSTRAINT FK_StockItem_DepositoLogico forEIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_StockItem_DepositoLogico
;
/****** Object:  foreignKey FK_StockItem_Producto    Script Date: 07/30/2012 17:30:16 ******/
alter table StockItem  ADD  CONSTRAINT FK_StockItem_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_StockItem_Producto
;
/****** Object:  foreignKey FK_StockItem_ProductoKit    Script Date: 07/30/2012 17:30:16 ******/
alter table StockItem  ADD  CONSTRAINT FK_StockItem_ProductoKit forEIGN KEY(pr_id_kit)
REFERENCES Producto (pr_id)
;
-- FK_StockItem_ProductoKit
;
/****** Object:  foreignKey FK_StockItem_ProductoNumeroSerie    Script Date: 07/30/2012 17:30:16 ******/
alter table StockItem  ADD  CONSTRAINT FK_StockItem_ProductoNumeroSerie forEIGN KEY(prns_id)
REFERENCES ProductoNumeroSerie (prns_id)
;
-- FK_StockItem_ProductoNumeroSerie
;
/****** Object:  foreignKey FK_StockItem_ProductoSerieKit    Script Date: 07/30/2012 17:30:16 ******/
alter table StockItem  ADD  CONSTRAINT FK_StockItem_ProductoSerieKit forEIGN KEY(prsk_id)
REFERENCES ProductoSerieKit (prsk_id)
;
-- FK_StockItem_ProductoSerieKit
;
/****** Object:  foreignKey FK_StockItem_Stock    Script Date: 07/30/2012 17:30:16 ******/
alter table StockItem  ADD  CONSTRAINT FK_StockItem_Stock forEIGN KEY(st_id)
REFERENCES Stock (st_id)
;
-- FK_StockItem_Stock
;
/****** Object:  foreignKey FK_StockItem_StockItemKit    Script Date: 07/30/2012 17:30:16 ******/
alter table StockItem  ADD  CONSTRAINT FK_StockItem_StockItemKit forEIGN KEY(stik_id)
REFERENCES StockItemKit (stik_id)
;
-- FK_StockItem_StockItemKit
;
/****** Object:  foreignKey FK_StockItem_StockLote    Script Date: 07/30/2012 17:30:16 ******/
alter table StockItem  ADD  CONSTRAINT FK_StockItem_StockLote forEIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_StockItem_StockLote
;
/****** Object:  foreignKey FK_StockItemKit_Producto    Script Date: 07/30/2012 17:30:18 ******/
alter table StockItemKit  ADD  CONSTRAINT FK_StockItemKit_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_StockItemKit_Producto
;
/****** Object:  foreignKey FK_StockItemKit_Stock    Script Date: 07/30/2012 17:30:18 ******/
alter table StockItemKit  ADD  CONSTRAINT FK_StockItemKit_Stock forEIGN KEY(st_id)
REFERENCES Stock (st_id)
;
-- FK_StockItemKit_Stock
;
/****** Object:  foreignKey FK_StockItemTMP_StockTMP    Script Date: 07/30/2012 17:30:21 ******/
alter table StockItemTMP  ADD  CONSTRAINT FK_StockItemTMP_StockTMP forEIGN KEY(stTMP_id)
REFERENCES StockTMP (stTMP_id)
;
-- FK_StockItemTMP_StockTMP
;
/****** Object:  foreignKey FK_StockLote_Pais    Script Date: 07/30/2012 17:30:24 ******/
alter table StockLote  ADD  CONSTRAINT FK_StockLote_Pais forEIGN KEY(pa_id)
REFERENCES Pais (pa_id)
;
-- FK_StockLote_Pais
;
/****** Object:  foreignKey FK_StockLote_Producto    Script Date: 07/30/2012 17:30:24 ******/
alter table StockLote  ADD  CONSTRAINT FK_StockLote_Producto forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_StockLote_Producto
;
/****** Object:  foreignKey FK_StockLote_StockLote    Script Date: 07/30/2012 17:30:24 ******/
alter table StockLote  ADD  CONSTRAINT FK_StockLote_StockLote forEIGN KEY(stl_id_padre)
REFERENCES StockLote (stl_id)
;
-- FK_StockLote_StockLote
;
/****** Object:  foreignKey FK_StockLote_Usuario    Script Date: 07/30/2012 17:30:25 ******/
alter table StockLote  ADD  CONSTRAINT FK_StockLote_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_StockLote_Usuario
;
/****** Object:  foreignKey FK_StockProveedor_DepositoLogicoDestino    Script Date: 07/30/2012 17:30:28 ******/
alter table StockProveedor  ADD  CONSTRAINT FK_StockProveedor_DepositoLogicoDestino forEIGN KEY(depl_id_destino)
REFERENCES DepositoLogico (depl_id)
;
-- FK_StockProveedor_DepositoLogicoDestino
;
/****** Object:  foreignKey FK_StockProveedor_DepositoLogicoOrigen    Script Date: 07/30/2012 17:30:28 ******/
alter table StockProveedor  ADD  CONSTRAINT FK_StockProveedor_DepositoLogicoOrigen forEIGN KEY(depl_id_origen)
REFERENCES DepositoLogico (depl_id)
;
-- FK_StockProveedor_DepositoLogicoOrigen
;
/****** Object:  foreignKey FK_StockProveedor_Documento    Script Date: 07/30/2012 17:30:29 ******/
alter table StockProveedor  ADD  CONSTRAINT FK_StockProveedor_Documento forEIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_StockProveedor_Documento
;
/****** Object:  foreignKey FK_StockProveedor_DocumentoTipo    Script Date: 07/30/2012 17:30:29 ******/
alter table StockProveedor  ADD  CONSTRAINT FK_StockProveedor_DocumentoTipo forEIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_StockProveedor_DocumentoTipo
;
/****** Object:  foreignKey FK_StockProveedor_Legajo    Script Date: 07/30/2012 17:30:29 ******/
alter table StockProveedor  ADD  CONSTRAINT FK_StockProveedor_Legajo forEIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_StockProveedor_Legajo
;
/****** Object:  foreignKey FK_StockProveedor_Proveedor    Script Date: 07/30/2012 17:30:29 ******/
alter table StockProveedor  ADD  CONSTRAINT FK_StockProveedor_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_StockProveedor_Proveedor
;
/****** Object:  foreignKey FK_StockProveedor_Stock    Script Date: 07/30/2012 17:30:29 ******/
alter table StockProveedor  ADD  CONSTRAINT FK_StockProveedor_Stock forEIGN KEY(st_id)
REFERENCES Stock (st_id)
;
-- FK_StockProveedor_Stock
;
/****** Object:  foreignKey FK_StockProveedor_Sucursal    Script Date: 07/30/2012 17:30:29 ******/
alter table StockProveedor  ADD  CONSTRAINT FK_StockProveedor_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_StockProveedor_Sucursal
;
/****** Object:  foreignKey StockValorModifico_FK    Script Date: 07/30/2012 17:30:38 ******/
alter table StockValor  ADD  CONSTRAINT StockValorModifico_FK forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- StockValorModifico_FK
;
/****** Object:  foreignKey StockValorItem_Producto_FK    Script Date: 07/30/2012 17:30:39 ******/
alter table StockValorItem  ADD  CONSTRAINT StockValorItem_Producto_FK forEIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- StockValorItem_Producto_FK
;
/****** Object:  foreignKey stockValorItem_StockValor_FK    Script Date: 07/30/2012 17:30:39 ******/
alter table StockValorItem  ADD  CONSTRAINT stockValorItem_StockValor_FK forEIGN KEY(stv_id)
REFERENCES StockValor (stv_id)
;
-- stockValorItem_StockValor_FK
;
/****** Object:  foreignKey FK_Sucursal_Usuario    Script Date: 07/30/2012 17:30:41 ******/
alter table Sucursal  ADD  CONSTRAINT FK_Sucursal_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Sucursal_Usuario
;
/****** Object:  foreignKey FK_TablaItem_Tabla    Script Date: 07/30/2012 17:30:54 ******/
alter table TablaItem  ADD  CONSTRAINT FK_TablaItem_Tabla forEIGN KEY(tbl_id)
REFERENCES Tabla (tbl_id)
;
-- FK_TablaItem_Tabla
;
/****** Object:  foreignKey FK_TablaItem_TablaHelp    Script Date: 07/30/2012 17:30:54 ******/
alter table TablaItem  ADD  CONSTRAINT FK_TablaItem_TablaHelp forEIGN KEY(tbl_id_help)
REFERENCES Tabla (tbl_id)
;
-- FK_TablaItem_TablaHelp
;
/****** Object:  foreignKey FK_Talonario_Empresa    Script Date: 07/30/2012 17:30:58 ******/
alter table Talonario  ADD  CONSTRAINT FK_Talonario_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_Talonario_Empresa
;
/****** Object:  foreignKey FK_Talonario_Usuario    Script Date: 07/30/2012 17:30:58 ******/
alter table Talonario  ADD  CONSTRAINT FK_Talonario_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Talonario_Usuario
;
/****** Object:  foreignKey FK_Tarea_AlarmaItem    Script Date: 07/30/2012 17:31:07 ******/
alter table Tarea  ADD  CONSTRAINT FK_Tarea_AlarmaItem forEIGN KEY(ali_id)
REFERENCES AlarmaItem (ali_id)
;
-- FK_Tarea_AlarmaItem
;
/****** Object:  foreignKey FK_Tarea_AlarmaItemTipo    Script Date: 07/30/2012 17:31:07 ******/
alter table Tarea  ADD  CONSTRAINT FK_Tarea_AlarmaItemTipo forEIGN KEY(alit_id)
REFERENCES AlarmaItemTipo (alit_id)
;
-- FK_Tarea_AlarmaItemTipo
;
/****** Object:  foreignKey FK_Tarea_Cliente    Script Date: 07/30/2012 17:31:07 ******/
alter table Tarea  ADD  CONSTRAINT FK_Tarea_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_Tarea_Cliente
;
/****** Object:  foreignKey FK_Tarea_Contacto    Script Date: 07/30/2012 17:31:07 ******/
alter table Tarea  ADD  CONSTRAINT FK_Tarea_Contacto forEIGN KEY(cont_id)
REFERENCES Contacto (cont_id)
;
-- FK_Tarea_Contacto
;
/****** Object:  foreignKey FK_Tarea_Departamento    Script Date: 07/30/2012 17:31:07 ******/
alter table Tarea  ADD  CONSTRAINT FK_Tarea_Departamento forEIGN KEY(dpto_id)
REFERENCES Departamento (dpto_id)
;
-- FK_Tarea_Departamento
;
/****** Object:  foreignKey FK_Tarea_Objetivo    Script Date: 07/30/2012 17:31:07 ******/
alter table Tarea  ADD  CONSTRAINT FK_Tarea_Objetivo forEIGN KEY(obje_id)
REFERENCES Objetivo (obje_id)
;
-- FK_Tarea_Objetivo
;
/****** Object:  foreignKey FK_Tarea_OrdenServicio    Script Date: 07/30/2012 17:31:08 ******/
alter table Tarea  ADD  CONSTRAINT FK_Tarea_OrdenServicio forEIGN KEY(os_id)
REFERENCES OrdenServicio (os_id)
;
-- FK_Tarea_OrdenServicio
;
/****** Object:  foreignKey FK_Tarea_Prioridad    Script Date: 07/30/2012 17:31:08 ******/
alter table Tarea  ADD  CONSTRAINT FK_Tarea_Prioridad forEIGN KEY(prio_id)
REFERENCES Prioridad (prio_id)
;
-- FK_Tarea_Prioridad
;
/****** Object:  foreignKey FK_Tarea_ProductoNumeroSerie    Script Date: 07/30/2012 17:31:08 ******/
alter table Tarea  ADD  CONSTRAINT FK_Tarea_ProductoNumeroSerie forEIGN KEY(prns_id)
REFERENCES ProductoNumeroSerie (prns_id)
;
-- FK_Tarea_ProductoNumeroSerie
;
/****** Object:  foreignKey FK_Tarea_Proyecto    Script Date: 07/30/2012 17:31:08 ******/
alter table Tarea  ADD  CONSTRAINT FK_Tarea_Proyecto forEIGN KEY(proy_id)
REFERENCES Proyecto (proy_id)
;
-- FK_Tarea_Proyecto
;
/****** Object:  foreignKey FK_Tarea_ProyectoItem    Script Date: 07/30/2012 17:31:08 ******/
alter table Tarea  ADD  CONSTRAINT FK_Tarea_ProyectoItem forEIGN KEY(proyi_id)
REFERENCES ProyectoItem (proyi_id)
;
-- FK_Tarea_ProyectoItem
;
/****** Object:  foreignKey FK_Tarea_Rubro    Script Date: 07/30/2012 17:31:08 ******/
alter table Tarea  ADD  CONSTRAINT FK_Tarea_Rubro forEIGN KEY(rub_id)
REFERENCES Rubro (rub_id)
;
-- FK_Tarea_Rubro
;
/****** Object:  foreignKey FK_Tarea_Tarea    Script Date: 07/30/2012 17:31:08 ******/
alter table Tarea  ADD  CONSTRAINT FK_Tarea_Tarea forEIGN KEY(tar_id_padre)
REFERENCES Tarea (tar_id)
;
-- FK_Tarea_Tarea
;
/****** Object:  foreignKey FK_Tarea_TareaEstado    Script Date: 07/30/2012 17:31:08 ******/
alter table Tarea  ADD  CONSTRAINT FK_Tarea_TareaEstado forEIGN KEY(tarest_id)
REFERENCES TareaEstado (tarest_id)
;
-- FK_Tarea_TareaEstado
;
/****** Object:  foreignKey FK_Tarea_Usuario    Script Date: 07/30/2012 17:31:08 ******/
alter table Tarea  ADD  CONSTRAINT FK_Tarea_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Tarea_Usuario
;
/****** Object:  foreignKey FK_Tarea_Usuario1    Script Date: 07/30/2012 17:31:08 ******/
alter table Tarea  ADD  CONSTRAINT FK_Tarea_Usuario1 forEIGN KEY(us_id_responsable)
REFERENCES Usuario (us_id)
;
-- FK_Tarea_Usuario1
;
/****** Object:  foreignKey FK_Tarea_Usuario2    Script Date: 07/30/2012 17:31:09 ******/
alter table Tarea  ADD  CONSTRAINT FK_Tarea_Usuario2 forEIGN KEY(us_id_asignador)
REFERENCES Usuario (us_id)
;
-- FK_Tarea_Usuario2
;
/****** Object:  foreignKey FK_Tarea_UsuarioAlta    Script Date: 07/30/2012 17:31:09 ******/
alter table Tarea  ADD  CONSTRAINT FK_Tarea_UsuarioAlta forEIGN KEY(us_id_alta)
REFERENCES Usuario (us_id)
;
-- FK_Tarea_UsuarioAlta
;
/****** Object:  foreignKey FK_TareaEstado_Usuario    Script Date: 07/30/2012 17:31:11 ******/
alter table TareaEstado  ADD  CONSTRAINT FK_TareaEstado_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_TareaEstado_Usuario
;
/****** Object:  foreignKey FK_Tarifa_Usuario    Script Date: 07/30/2012 17:31:14 ******/
alter table Tarifa  ADD  CONSTRAINT FK_Tarifa_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Tarifa_Usuario
;
/****** Object:  foreignKey FK_TarifaTransporte    Script Date: 07/30/2012 17:31:14 ******/
alter table Tarifa  ADD  CONSTRAINT FK_TarifaTransporte forEIGN KEY(trans_id)
REFERENCES Transporte (trans_id)
;
-- FK_TarifaTransporte
;
/****** Object:  foreignKey FK_TarifaGasto_Gasto    Script Date: 07/30/2012 17:31:16 ******/
alter table TarifaGasto  ADD  CONSTRAINT FK_TarifaGasto_Gasto forEIGN KEY(gto_id)
REFERENCES Gasto (gto_id)
;
-- FK_TarifaGasto_Gasto
;
/****** Object:  foreignKey FK_TarifaGasto_Tarifa    Script Date: 07/30/2012 17:31:16 ******/
alter table TarifaGasto  ADD  CONSTRAINT FK_TarifaGasto_Tarifa forEIGN KEY(trf_id)
REFERENCES Tarifa (trf_id)
;
-- FK_TarifaGasto_Tarifa
;
/****** Object:  foreignKey FK_TarifaGasto_Usuario    Script Date: 07/30/2012 17:31:16 ******/
alter table TarifaGasto  ADD  CONSTRAINT FK_TarifaGasto_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_TarifaGasto_Usuario
;
/****** Object:  foreignKey FK_TarifaItem_Usuario    Script Date: 07/30/2012 17:31:21 ******/
alter table TarifaItem  ADD  CONSTRAINT FK_TarifaItem_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_TarifaItem_Usuario
;
/****** Object:  foreignKey FK_TarifaItemPuertoDestino    Script Date: 07/30/2012 17:31:21 ******/
alter table TarifaItem  ADD  CONSTRAINT FK_TarifaItemPuertoDestino forEIGN KEY(pue_id_destino)
REFERENCES Puerto (pue_id)
;
-- FK_TarifaItemPuertoDestino
;
/****** Object:  foreignKey FK_TarifaItemPuertoOrigen    Script Date: 07/30/2012 17:31:22 ******/
alter table TarifaItem  ADD  CONSTRAINT FK_TarifaItemPuertoOrigen forEIGN KEY(pue_id_origen)
REFERENCES Puerto (pue_id)
;
-- FK_TarifaItemPuertoOrigen
;
/****** Object:  foreignKey FK_TarifaItemTarifa    Script Date: 07/30/2012 17:31:22 ******/
alter table TarifaItem  ADD  CONSTRAINT FK_TarifaItemTarifa forEIGN KEY(trf_id)
REFERENCES Tarifa (trf_id)
;
-- FK_TarifaItemTarifa
;
/****** Object:  foreignKey FK_TarifarioAltura_Tarifario    Script Date: 07/30/2012 17:31:25 ******/
alter table TarifarioAltura  ADD  CONSTRAINT FK_TarifarioAltura_Tarifario forEIGN KEY(tf_id)
REFERENCES Tarifario (tf_id)
;
-- FK_TarifarioAltura_Tarifario
;
/****** Object:  foreignKey FK_TarifarioAltura_Zona    Script Date: 07/30/2012 17:31:25 ******/
alter table TarifarioAltura  ADD  CONSTRAINT FK_TarifarioAltura_Zona forEIGN KEY(zon_id)
REFERENCES Zona (zon_id)
;
-- FK_TarifarioAltura_Zona
;
/****** Object:  foreignKey FK_TarifarioCalle_Calle    Script Date: 07/30/2012 17:31:26 ******/
alter table TarifarioCalle  ADD  CONSTRAINT FK_TarifarioCalle_Calle forEIGN KEY(calle_id)
REFERENCES Calle (calle_id)
;
-- FK_TarifarioCalle_Calle
;
/****** Object:  foreignKey FK_TarifarioCalle_Tarifario    Script Date: 07/30/2012 17:31:26 ******/
alter table TarifarioCalle  ADD  CONSTRAINT FK_TarifarioCalle_Tarifario forEIGN KEY(tf_id)
REFERENCES Tarifario (tf_id)
;
-- FK_TarifarioCalle_Tarifario
;
/****** Object:  foreignKey FK_TarifarioParalela_Calle    Script Date: 07/30/2012 17:31:28 ******/
alter table TarifarioParalela  ADD  CONSTRAINT FK_TarifarioParalela_Calle forEIGN KEY(calle_id)
REFERENCES Calle (calle_id)
;
-- FK_TarifarioParalela_Calle
;
/****** Object:  foreignKey FK_TarifarioParalela_Tarifario    Script Date: 07/30/2012 17:31:28 ******/
alter table TarifarioParalela  ADD  CONSTRAINT FK_TarifarioParalela_Tarifario forEIGN KEY(tf_id)
REFERENCES Tarifario (tf_id)
;
-- FK_TarifarioParalela_Tarifario
;
/****** Object:  foreignKey FK_TarifarioParalela_TarifarioCalle    Script Date: 07/30/2012 17:31:28 ******/
alter table TarifarioParalela  ADD  CONSTRAINT FK_TarifarioParalela_TarifarioCalle forEIGN KEY(tfcalle_id)
REFERENCES TarifarioCalle (tfcalle_id)
;
-- FK_TarifarioParalela_TarifarioCalle
;
/****** Object:  foreignKey FK_TarjetaCredito_CuentaBanco    Script Date: 07/30/2012 17:31:31 ******/
alter table TarjetaCredito  ADD  CONSTRAINT FK_TarjetaCredito_CuentaBanco forEIGN KEY(cue_id_banco)
REFERENCES Cuenta (cue_id)
;
-- FK_TarjetaCredito_CuentaBanco
;
/****** Object:  foreignKey FK_TarjetaCredito_CuentaComision    Script Date: 07/30/2012 17:31:31 ******/
alter table TarjetaCredito  ADD  CONSTRAINT FK_TarjetaCredito_CuentaComision forEIGN KEY(cue_id_comision)
REFERENCES Cuenta (cue_id)
;
-- FK_TarjetaCredito_CuentaComision
;
/****** Object:  foreignKey FK_TarjetaCredito_CuentaEnCartera    Script Date: 07/30/2012 17:31:31 ******/
alter table TarjetaCredito  ADD  CONSTRAINT FK_TarjetaCredito_CuentaEnCartera forEIGN KEY(cue_id_encartera)
REFERENCES Cuenta (cue_id)
;
-- FK_TarjetaCredito_CuentaEnCartera
;
/****** Object:  foreignKey FK_TarjetaCredito_CuentaPresentado    Script Date: 07/30/2012 17:31:31 ******/
alter table TarjetaCredito  ADD  CONSTRAINT FK_TarjetaCredito_CuentaPresentado forEIGN KEY(cue_id_presentado)
REFERENCES Cuenta (cue_id)
;
-- FK_TarjetaCredito_CuentaPresentado
;
/****** Object:  foreignKey FK_TarjetaCredito_CuentaRechazo    Script Date: 07/30/2012 17:31:31 ******/
alter table TarjetaCredito  ADD  CONSTRAINT FK_TarjetaCredito_CuentaRechazo forEIGN KEY(cue_id_rechazo)
REFERENCES Cuenta (cue_id)
;
-- FK_TarjetaCredito_CuentaRechazo
;
/****** Object:  foreignKey FK_TarjetaCredito_Empresa    Script Date: 07/30/2012 17:31:32 ******/
alter table TarjetaCredito  ADD  CONSTRAINT FK_TarjetaCredito_Empresa forEIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_TarjetaCredito_Empresa
;
/****** Object:  foreignKey FK_TarjetaCredito_Usuario    Script Date: 07/30/2012 17:31:32 ******/
alter table TarjetaCredito  ADD  CONSTRAINT FK_TarjetaCredito_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_TarjetaCredito_Usuario
;
/****** Object:  foreignKey FK_TarjetaCreditoCuota_TarjetaCredito    Script Date: 07/30/2012 17:31:33 ******/
alter table TarjetaCreditoCuota  ADD  CONSTRAINT FK_TarjetaCreditoCuota_TarjetaCredito forEIGN KEY(tjc_id)
REFERENCES TarjetaCredito (tjc_id)
;
-- FK_TarjetaCreditoCuota_TarjetaCredito
;
/****** Object:  foreignKey FK_TarjetaCreditoCuota_Usuario    Script Date: 07/30/2012 17:31:34 ******/
alter table TarjetaCreditoCuota  ADD  CONSTRAINT FK_TarjetaCreditoCuota_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_TarjetaCreditoCuota_Usuario
;
/****** Object:  foreignKey FK_TarjetaCreditoCupon_Cliente    Script Date: 07/30/2012 17:31:37 ******/
alter table TarjetaCreditoCupon  ADD  CONSTRAINT FK_TarjetaCreditoCupon_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_TarjetaCreditoCupon_Cliente
;
/****** Object:  foreignKey FK_TarjetaCreditoCupon_Cobranza    Script Date: 07/30/2012 17:31:37 ******/
alter table TarjetaCreditoCupon  ADD  CONSTRAINT FK_TarjetaCreditoCupon_Cobranza forEIGN KEY(cobz_id)
REFERENCES Cobranza (cobz_id)
;
-- FK_TarjetaCreditoCupon_Cobranza
;
/****** Object:  foreignKey FK_TarjetaCreditoCupon_Moneda    Script Date: 07/30/2012 17:31:38 ******/
alter table TarjetaCreditoCupon  ADD  CONSTRAINT FK_TarjetaCreditoCupon_Moneda forEIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_TarjetaCreditoCupon_Moneda
;
/****** Object:  foreignKey FK_TarjetaCreditoCupon_TarjetaCredito    Script Date: 07/30/2012 17:31:38 ******/
alter table TarjetaCreditoCupon  ADD  CONSTRAINT FK_TarjetaCreditoCupon_TarjetaCredito forEIGN KEY(tjc_id)
REFERENCES TarjetaCredito (tjc_id)
;
-- FK_TarjetaCreditoCupon_TarjetaCredito
;
/****** Object:  foreignKey FK_TarjetaCreditoCupon_TarjetaCreditoCuota    Script Date: 07/30/2012 17:31:38 ******/
alter table TarjetaCreditoCupon  ADD  CONSTRAINT FK_TarjetaCreditoCupon_TarjetaCreditoCuota forEIGN KEY(tjccu_id)
REFERENCES TarjetaCreditoCuota (tjccu_id)
;
-- FK_TarjetaCreditoCupon_TarjetaCreditoCuota
;
/****** Object:  foreignKey FK_TasaImpositiva_Cuenta    Script Date: 07/30/2012 17:31:40 ******/
alter table TasaImpositiva  ADD  CONSTRAINT FK_TasaImpositiva_Cuenta forEIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_TasaImpositiva_Cuenta
;
/****** Object:  foreignKey FK_TasaImpositiva_Usuario    Script Date: 07/30/2012 17:31:41 ******/
alter table TasaImpositiva  ADD  CONSTRAINT FK_TasaImpositiva_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_TasaImpositiva_Usuario
;
/****** Object:  foreignKey FK_TipoOperacion_Usuario    Script Date: 07/30/2012 17:31:43 ******/
alter table TipoOperacion  ADD  CONSTRAINT FK_TipoOperacion_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_TipoOperacion_Usuario
;
/****** Object:  foreignKey FK_TipoOperacionCuentaGrupo_Cuenta    Script Date: 07/30/2012 17:31:44 ******/
alter table TipoOperacionCuentaGrupo  ADD  CONSTRAINT FK_TipoOperacionCuentaGrupo_Cuenta forEIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_TipoOperacionCuentaGrupo_Cuenta
;
/****** Object:  foreignKey FK_TipoOperacionCuentaGrupo_CuentaGrupo    Script Date: 07/30/2012 17:31:44 ******/
alter table TipoOperacionCuentaGrupo  ADD  CONSTRAINT FK_TipoOperacionCuentaGrupo_CuentaGrupo forEIGN KEY(cueg_id)
REFERENCES CuentaGrupo (cueg_id)
;
-- FK_TipoOperacionCuentaGrupo_CuentaGrupo
;
/****** Object:  foreignKey FK_TipoOperacionCuentaGrupo_TipoOperacion    Script Date: 07/30/2012 17:31:45 ******/
alter table TipoOperacionCuentaGrupo  ADD  CONSTRAINT FK_TipoOperacionCuentaGrupo_TipoOperacion forEIGN KEY(to_id)
REFERENCES TipoOperacion (to_id)
;
-- FK_TipoOperacionCuentaGrupo_TipoOperacion
;
/****** Object:  foreignKey FK_TipoOperacionCuentaGrupo_Usuario    Script Date: 07/30/2012 17:31:45 ******/
alter table TipoOperacionCuentaGrupo  ADD  CONSTRAINT FK_TipoOperacionCuentaGrupo_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_TipoOperacionCuentaGrupo_Usuario
;
/****** Object:  foreignKey FK_TrabajoImpresionItem_TrabajoImpresion    Script Date: 07/30/2012 17:31:50 ******/
alter table TrabajoImpresionItem  ADD  CONSTRAINT FK_TrabajoImpresionItem_TrabajoImpresion forEIGN KEY(timp_id)
REFERENCES TrabajoImpresion (timp_id)
;
-- FK_TrabajoImpresionItem_TrabajoImpresion
;
/****** Object:  foreignKey FK_Transporte_Proveedor    Script Date: 07/30/2012 17:31:55 ******/
alter table Transporte  ADD  CONSTRAINT FK_Transporte_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_Transporte_Proveedor
;
/****** Object:  foreignKey FK_Transporte_Provincia    Script Date: 07/30/2012 17:31:55 ******/
alter table Transporte  ADD  CONSTRAINT FK_Transporte_Provincia forEIGN KEY(pro_id)
REFERENCES Provincia (pro_id)
;
-- FK_Transporte_Provincia
;
/****** Object:  foreignKey FK_Unidad_Usuario    Script Date: 07/30/2012 17:31:57 ******/
alter table Unidad  ADD  CONSTRAINT FK_Unidad_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Unidad_Usuario
;
/****** Object:  foreignKey FK_Usuario_Persona    Script Date: 07/30/2012 17:32:00 ******/
alter table Usuario  ADD  CONSTRAINT FK_Usuario_Persona forEIGN KEY(prs_id)
REFERENCES Persona (prs_id)
;
-- FK_Usuario_Persona
;
/****** Object:  foreignKey FK_Usuario_Sucursal    Script Date: 07/30/2012 17:32:00 ******/
alter table Usuario  ADD  CONSTRAINT FK_Usuario_Sucursal forEIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_Usuario_Sucursal
;
/****** Object:  foreignKey FK_Usuario_Usuario    Script Date: 07/30/2012 17:32:00 ******/
alter table Usuario  ADD  CONSTRAINT FK_Usuario_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Usuario_Usuario
;
/****** Object:  foreignKey FK_UsuarioDepartamento_Departamento    Script Date: 07/30/2012 17:32:02 ******/
alter table UsuarioDepartamento  ADD  CONSTRAINT FK_UsuarioDepartamento_Departamento forEIGN KEY(dpto_id)
REFERENCES Departamento (dpto_id)
;
-- FK_UsuarioDepartamento_Departamento
;
/****** Object:  foreignKey FK_UsuarioDepartamento_Usuario    Script Date: 07/30/2012 17:32:02 ******/
alter table UsuarioDepartamento  ADD  CONSTRAINT FK_UsuarioDepartamento_Usuario forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_UsuarioDepartamento_Usuario
;
/****** Object:  foreignKey FK_UsuarioDepartamento_UsuarioModifico    Script Date: 07/30/2012 17:32:02 ******/
alter table UsuarioDepartamento  ADD  CONSTRAINT FK_UsuarioDepartamento_UsuarioModifico forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_UsuarioDepartamento_UsuarioModifico
;
/****** Object:  foreignKey FK_UsuarioDepositoLogico_DepositoLogico    Script Date: 07/30/2012 17:32:03 ******/
alter table UsuarioDepositoLogico  ADD  CONSTRAINT FK_UsuarioDepositoLogico_DepositoLogico forEIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_UsuarioDepositoLogico_DepositoLogico
;
/****** Object:  foreignKey FK_UsuarioDepositoLogico_Usuario    Script Date: 07/30/2012 17:32:03 ******/
alter table UsuarioDepositoLogico  ADD  CONSTRAINT FK_UsuarioDepositoLogico_Usuario forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_UsuarioDepositoLogico_Usuario
;
/****** Object:  foreignKey FK_UsuarioEmpresa_Cliente    Script Date: 07/30/2012 17:32:05 ******/
alter table UsuarioEmpresa  ADD  CONSTRAINT FK_UsuarioEmpresa_Cliente forEIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_UsuarioEmpresa_Cliente
;
/****** Object:  foreignKey FK_UsuarioEmpresa_Modifico    Script Date: 07/30/2012 17:32:05 ******/
alter table UsuarioEmpresa  ADD  CONSTRAINT FK_UsuarioEmpresa_Modifico forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_UsuarioEmpresa_Modifico
;
/****** Object:  foreignKey FK_UsuarioEmpresa_Proveedor    Script Date: 07/30/2012 17:32:05 ******/
alter table UsuarioEmpresa  ADD  CONSTRAINT FK_UsuarioEmpresa_Proveedor forEIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_UsuarioEmpresa_Proveedor
;
/****** Object:  foreignKey FK_UsuarioEmpresa_Usuario    Script Date: 07/30/2012 17:32:05 ******/
alter table UsuarioEmpresa  ADD  CONSTRAINT FK_UsuarioEmpresa_Usuario forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_UsuarioEmpresa_Usuario
;
/****** Object:  foreignKey FK_UsuarioRol_Rol    Script Date: 07/30/2012 17:32:07 ******/
alter table UsuarioRol  ADD  CONSTRAINT FK_UsuarioRol_Rol forEIGN KEY(rol_id)
REFERENCES Rol (rol_id)
;
-- FK_UsuarioRol_Rol
;
/****** Object:  foreignKey FK_UsuarioRol_Usuario    Script Date: 07/30/2012 17:32:07 ******/
alter table UsuarioRol  ADD  CONSTRAINT FK_UsuarioRol_Usuario forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_UsuarioRol_Usuario
;
/****** Object:  foreignKey FK_Vendedor_Modifico    Script Date: 07/30/2012 17:32:09 ******/
alter table Vendedor  ADD  CONSTRAINT FK_Vendedor_Modifico forEIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Vendedor_Modifico
;
/****** Object:  foreignKey FK_Vendedor_Usuario    Script Date: 07/30/2012 17:32:09 ******/
alter table Vendedor  ADD  CONSTRAINT FK_Vendedor_Usuario forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_Vendedor_Usuario
;
/****** Object:  foreignKey FK_VentaModo_Cuenta    Script Date: 07/30/2012 17:32:12 ******/
alter table VentaModo  ADD  CONSTRAINT FK_VentaModo_Cuenta forEIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_VentaModo_Cuenta
;
/****** Object:  foreignKey FK_webArticulo_Usuario    Script Date: 07/30/2012 17:32:18 ******/
alter table webArticulo  ADD  CONSTRAINT FK_webArticulo_Usuario forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_webArticulo_Usuario
;
/****** Object:  foreignKey FK_webArticulo_webArticuloEstado    Script Date: 07/30/2012 17:32:18 ******/
alter table webArticulo  ADD  CONSTRAINT FK_webArticulo_webArticuloEstado forEIGN KEY(warte_id)
REFERENCES webArticuloEstado (warte_id)
;
-- FK_webArticulo_webArticuloEstado
;
/****** Object:  foreignKey FK_webArticulo_webArticuloTipo    Script Date: 07/30/2012 17:32:18 ******/
alter table webArticulo  ADD  CONSTRAINT FK_webArticulo_webArticuloTipo forEIGN KEY(wartt_id)
REFERENCES webArticuloTipo (wartt_id)
;
-- FK_webArticulo_webArticuloTipo
;
/****** Object:  foreignKey FK_webArticuloUsuario_Usuario    Script Date: 07/30/2012 17:32:20 ******/
alter table webArticuloUsuario  ADD  CONSTRAINT FK_webArticuloUsuario_Usuario forEIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_webArticuloUsuario_Usuario
;
/****** Object:  foreignKey FK_webArticuloUsuario_webArticulo    Script Date: 07/30/2012 17:32:20 ******/
alter table webArticuloUsuario  ADD  CONSTRAINT FK_webArticuloUsuario_webArticulo forEIGN KEY(wart_id)
REFERENCES webArticulo (wart_id)
;
-- FK_webArticuloUsuario_webArticulo
;

/* WARNING: Check if this script creates the sequence automaticlay because of the use of the serial type in column me_id
create SEQUENCE sysmenu_me_id_seq;

    update: THIS WORKS the sequence is created automatically
*/

create table sysmenu
(
  me_id serial not null,
  me_text character varying(1000) not null default ''::character varying,
  me_key character varying(100) not null default ''::character varying,
  pre_id integer,
  me_father character varying(1000) not null default ''::character varying,
  me_position integer,
  me_is_last smallint,
  me_is_separator smallint,
  me_have_separator smallint,
  me_is_main_menu smallint,
  me_is_popup_menu smallint,
  me_object_handler character varying(255) not null default ''::character varying,
  me_package character varying(255) not null default ''::character varying,
  me_file_path character varying(255) not null default ''::character varying,
  me_id_father integer,
  me_action character varying(255) not null default ''::character varying,
  me_path character varying(1000) not null default ''::character varying,
  me_action2 character varying(255) not null default ''::character varying,
  me_path2 character varying(1000) not null default ''::character varying,
  CONSTRAINT sysmenu_pkey PRIMARY KEY (me_id)
)
WITH (
  OIDS=FALSE
);
alter table sysmenu
  owner to postgres;
  
/* create SEQUENCE syslanguage_sysl_id_seq; */
  
create table syslanguage
(
    sysl_id serial not null,
    leng_id integer not null,
    sysl_code character varying(255) not null,
    sysl_text character varying(5000) not null,
    CONSTRAINT syslanguage_pkey PRIMARY KEY (sysl_id),
    CONSTRAINT syslanguage_language_fk forEIGN KEY (leng_id)
        REFERENCES lenguaje (leng_id) MATCH SIMPLE
        on update NO ACTION on delete NO ACTION
)
WITH (
OIDS=FALSE
);
alter table syslanguage
owner to postgres;
