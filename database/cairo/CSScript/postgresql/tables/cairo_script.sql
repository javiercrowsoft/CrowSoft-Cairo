ALTER DATABASE postgres SET timezone TO 'UTC';

esto esta a proposito para que de un error asi confirmamos que el timezone e sel correcto antes
de crear la base

CREATE TABLE Vuelo (
	vue_id int NOT NULL,
	vue_nombre varchar(100) NOT NULL,
	vue_codigo varchar(15) NOT NULL,
	vue_descrip varchar(255) NOT NULL CONSTRAINT DF_Vuelo_vue_descrip  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_Vuelo_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Vuelo_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Vuelo_activo  DEFAULT (1),
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
CREATE TABLE HojaRutaCobranzaTipo(
	hrct_id int NOT NULL,
	hrct_nombre varchar(255) NOT NULL,
	hrct_codigo varchar(50) NOT NULL,
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
CREATE TABLE ParteProdKitTMP(
	ppkTMP_id int NOT NULL,
	ppk_id int NOT NULL,
	ppk_numero int NOT NULL,
	ppk_nrodoc varchar(50) NOT NULL CONSTRAINT DF_ParteProdKitTMP_ppk_nrodoc  DEFAULT (''),
	ppk_descrip varchar(5000) NOT NULL CONSTRAINT DF_ParteProdKitTMP_ppk_descrip  DEFAULT (''),
	ppk_fecha timestamptz NOT NULL CONSTRAINT DF_ParteProdKitTMP_ppk_fecha  DEFAULT (getdate()),
	depl_id int NOT NULL,
	suc_id int NOT NULL,
	lgj_id int NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ParteProdKitTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ParteProdKitTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE CobranzaTMP(
	fvTMP_id int NOT NULL CONSTRAINT DF_CobranzaTMP_fvTMP_id  DEFAULT (0),
	cobzTMP_id int NOT NULL,
	cobz_id int NOT NULL,
	cobz_numero int NOT NULL,
	cobz_nrodoc varchar(50) NOT NULL CONSTRAINT DF_CobranzaTMP_cobz_nrodoc  DEFAULT (''),
	cobz_descrip varchar(5000) NOT NULL CONSTRAINT DF_CobranzaTMP_cobz_descrip  DEFAULT (''),
	cobz_fecha timestamptz NOT NULL CONSTRAINT DF_CobranzaTMP_cobz_fecha  DEFAULT (getdate()),
	cobz_neto decimal(18, 6) NOT NULL CONSTRAINT DF_CobranzaTMP_cobz_neto  DEFAULT (0),
	cobz_otros decimal(18, 6) NOT NULL CONSTRAINT DF_CobranzaTMP_cobz_otros  DEFAULT (0),
	cobz_total decimal(18, 6) NOT NULL CONSTRAINT DF_CobranzaTMP_cobz_total  DEFAULT (0),
	cobz_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_CobranzaTMP_cobz_pendiente  DEFAULT (0),
	cobz_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_CobranzaTMP_cobz_cotizacion  DEFAULT (0),
	cobz_grabarAsiento smallint NOT NULL CONSTRAINT DF_CobranzaTMP_cobz_grabarAsiento  DEFAULT (0),
	cobz_firmado int NOT NULL CONSTRAINT DF_CobranzaTMP_cobz_firmado  DEFAULT (0),
	cobz_hojaruta smallint NOT NULL CONSTRAINT DF_CobranzaTMP_cobz_hojaruta  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	cli_id int NOT NULL,
	doc_id int NOT NULL,
	cob_id int NULL,
	ccos_id int NULL,
	lgj_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_CobranzaTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_CobranzaTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE AjusteInflacionIndice(
	ajii_id int NOT NULL,
	ajii_fecha timestamptz NOT NULL,
	ajii_indice decimal(18, 6) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_AjusteInflacionIndice_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_AjusteInflacionIndice_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE FacturaVentaPercepcionTMP(
	fvTMP_id int NOT NULL,
	fvpercTMP_id int NOT NULL,
	fvperc_id int NOT NULL,
	fvperc_orden smallint NOT NULL CONSTRAINT DF_FacturaVentaPercepcionTMP_fvperc_orden  DEFAULT (0),
	fvperc_base decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaPercepcionTMP_fvperc_base  DEFAULT (0),
	fvperc_porcentaje decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaPercepcionTMP_fvperc_porcentaje  DEFAULT (0),
	fvperc_importe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaPercepcionTMP_fvperc_importe  DEFAULT (0),
	fvperc_origen decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaPercepcionTMP_fvperc_origen  DEFAULT (0),
	fvperc_descrip varchar(255) NOT NULL CONSTRAINT DF_FacturaVentaPercepcionTMP_fvperc_descrip  DEFAULT (''),
	perc_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE FacturaVentaCajeroLog(
	fvcj_id int NOT NULL,
	fv_id int NOT NULL,
	fvcj_ctacte smallint NOT NULL CONSTRAINT DF_FacturaVentaCajeroLog_fvcj_ctacte  DEFAULT (0),
	cj_id int NOT NULL,
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
CREATE TABLE AsientoTMP(
	asTMP_id int NOT NULL,
	as_id int NOT NULL,
	as_numero int NOT NULL,
	as_nrodoc varchar(50) NOT NULL CONSTRAINT DF_AsientoTMP_as_nrodoc  DEFAULT (''),
	as_descrip varchar(5000) NOT NULL CONSTRAINT DF_AsientoTMP_as_descrip  DEFAULT (''),
	as_fecha timestamptz NOT NULL CONSTRAINT DF_AsientoTMP_as_fecha  DEFAULT (getdate()),
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_AsientoTMP_creado_1  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_AsientoTMP_modificado_1  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE OrdenProdKitTMP(
	opkTMP_id int NOT NULL,
	opk_id int NOT NULL,
	opk_numero int NOT NULL,
	opk_nrodoc varchar(50) NOT NULL CONSTRAINT DF_OrdenProdKitTMP_opk_nrodoc  DEFAULT (''),
	opk_descrip varchar(5000) NOT NULL CONSTRAINT DF_OrdenProdKitTMP_opk_descrip  DEFAULT (''),
	opk_fecha timestamptz NOT NULL CONSTRAINT DF_OrdenProdKitTMP_opk_fecha  DEFAULT (getdate()),
	depl_id int NOT NULL,
	suc_id int NOT NULL,
	lgj_id int NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_OrdenProdKitTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_OrdenProdKitTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE CategoriaFiscalGanancias(
	catfg_id int NOT NULL,
	catfg_nombre varchar(255) NOT NULL,
	catfg_codigo varchar(15) NOT NULL,
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
CREATE TABLE RemitoVentaTMP(
	rvTMP_id int NOT NULL,
	rv_id int NOT NULL,
	rv_numero int NOT NULL,
	rv_nrodoc varchar(50) NOT NULL CONSTRAINT DF_RemitoVentaTMP_rv_nrodoc  DEFAULT (''),
	rv_descrip varchar(5000) NOT NULL CONSTRAINT DF_RemitoVentaTMP_rv_descrip  DEFAULT (''),
	rv_fecha timestamptz NOT NULL CONSTRAINT DF_RemitoVentaTMP_rv_fecha  DEFAULT (getdate()),
	rv_fechaentrega timestamptz NOT NULL CONSTRAINT DF_RemitoVentaTMP_rv_fechaentrega  DEFAULT (getdate()),
	rv_neto decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaTMP_rv_neto  DEFAULT (0),
	rv_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaTMP_rv_ivari  DEFAULT (0),
	rv_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaTMP_rv_ivarni  DEFAULT (0),
	rv_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaTMP_rv_subtotal  DEFAULT (0),
	rv_total decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaTMP_rv_total  DEFAULT (0),
	rv_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaTMP_rv_descuento1  DEFAULT (0),
	rv_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaTMP_rv_descuento2  DEFAULT (0),
	rv_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaTMP_rv_importedesc1  DEFAULT (0),
	rv_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaTMP_rv_importedesc2  DEFAULT (0),
	rv_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaTMP_rv_cotizacion  DEFAULT (0),
	rv_retiro varchar(255) NOT NULL CONSTRAINT DF_RemitoVentaTMP_rv_retiro  DEFAULT (''),
	rv_guia varchar(255) NOT NULL CONSTRAINT DF_RemitoVentaTMP_rv_guia  DEFAULT (''),
	rv_destinatario varchar(1000) NOT NULL CONSTRAINT DF_RemitoVentaTMP_rv_destinatario  DEFAULT (''),
	rv_ordencompra varchar(255) NOT NULL CONSTRAINT DF_RemitoVentaTMP_rv_ordencompra  DEFAULT (''),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	cli_id int NOT NULL,
	doc_id int NOT NULL,
	lp_id int NULL,
	ld_id int NULL,
	lgj_id int NULL,
	cpg_id int NULL,
	ccos_id int NULL,
	ven_id int NULL,
	st_id int NULL,
	depl_id int NULL,
	depl_id_temp int NULL,
	pro_id_origen int NULL,
	pro_id_destino int NULL,
	trans_id int NULL,
	clis_id int NULL,
	chof_id int NULL,
	cam_id int NULL,
	cam_id_semi int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_RemitoVentaTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_RemitoVentaTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE ManifiestoCargaTMP(
	mfcTMP_id int NOT NULL,
	mfc_id int NOT NULL,
	mfc_numero int NOT NULL,
	mfc_nrodoc varchar(20) NOT NULL CONSTRAINT DF_ManifiestoCargaTMP_mfc_nrodoc  DEFAULT (''),
	mfc_fecha timestamptz NOT NULL CONSTRAINT DF_ManifiestoCargaTMP_mfc_fecha  DEFAULT (getdate()),
	mfc_fechadoc timestamptz NOT NULL CONSTRAINT DF_ManifiestoCargaTMP_mfc_fechadoc  DEFAULT (getdate()),
	mfc_horapartida timestamptz NOT NULL,
	mfc_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaTMP_mfc_pendiente  DEFAULT (0),
	mfc_chasis varchar(100) NOT NULL CONSTRAINT DF_ManifiestoCargaTMP_mfc_chasis  DEFAULT (''),
	mfc_acoplado varchar(100) NOT NULL CONSTRAINT DF_ManifiestoCargaTMP_mfc_acoplado  DEFAULT (''),
	mfc_descrip varchar(255) NOT NULL CONSTRAINT DF_ManifiestoCargaTMP_mfc_descrip  DEFAULT (''),
	mfc_firmado int NOT NULL CONSTRAINT DF_ManifiestoCargaTMP_mfc_firmado  DEFAULT (0),
	mfc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaTMP_mfc_cantidad  DEFAULT (0),
	mfc_total decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaTMP_mfc_total  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	cli_id int NOT NULL,
	ccos_id int NULL,
	cmarc_id int NULL,
	pue_id_origen int NULL,
	pue_id_destino int NULL,
	depl_id_origen int NULL,
	depl_id_destino int NULL,
	barc_id int NULL,
	trans_id int NULL,
	chof_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ManifiestoCargaTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ManifiestoCargaTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE EstadoCivil(
	estc_id int NOT NULL,
	estc_nombre varchar(255) NOT NULL CONSTRAINT DF_AABA_EstadoCivil_estc_nombre  DEFAULT (''),
	estc_codigo varchar(15) NOT NULL,
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
CREATE TABLE CategoriaFiscalIngBrutos(
	catfib_id int NOT NULL,
	catfib_nombre varchar(255) NOT NULL,
	catfib_codigo varchar(15) NOT NULL,
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
CREATE TABLE AlarmaItemTipo(
	alit_id int NOT NULL,
	alit_nombre varchar(100) NOT NULL,
	alit_codigo varchar(15) NOT NULL,
	alit_descrip varchar(255) NOT NULL CONSTRAINT DF_AlarmaItemTipo_alt_descrip  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_AlarmaItemTipo_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_AlarmaItemTipo_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE IngresosBrutosJurisdiccion(
	igbj_id int NOT NULL,
	igbj_nombre varchar(255) NOT NULL,
	igbj_codigo varchar(15) NOT NULL,
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
CREATE TABLE PresupuestoEnvioTMP(
	preeTMP_id int NOT NULL,
	pree_id int NOT NULL,
	pree_numero int NOT NULL,
	pree_nrodoc varchar(50) NOT NULL CONSTRAINT DF_PresupuestoEnvioTMP_pree_nrodoc  DEFAULT (''),
	pree_descrip varchar(5000) NOT NULL CONSTRAINT DF_PresupuestoEnvioTMP_pree_descrip  DEFAULT (''),
	pree_fecha timestamptz NOT NULL CONSTRAINT DF_PresupuestoEnvioTMP_pree_fecha  DEFAULT (getdate()),
	pree_fechaentrega timestamptz NOT NULL CONSTRAINT DF_PresupuestoEnvioTMP_pree_fechaentrega  DEFAULT (getdate()),
	pree_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioTMP_pree_neto  DEFAULT (0),
	pree_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioTMP_pree_ivari  DEFAULT (0),
	pree_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioTMP_pree_ivarni  DEFAULT (0),
	pree_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioTMP_pree_subtotal  DEFAULT (0),
	pree_total decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioTMP_pree_total  DEFAULT (0),
	pree_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioTMP_pree_pendiente  DEFAULT (0),
	pree_firmado int NOT NULL CONSTRAINT DF_PresupuestoEnvioTMP_pree_firmado  DEFAULT (0),
	pree_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioTMP_pree_descuento1  DEFAULT (0),
	pree_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioTMP_pree_descuento2  DEFAULT (0),
	pree_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioTMP_pree_importedesc1  DEFAULT (0),
	pree_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioTMP_pree_importedesc2  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	cli_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	cpg_id int NOT NULL,
	ccos_id int NULL,
	ven_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_PresupuestoEnvioTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_PresupuestoEnvioTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE TrabajoImpresion(
	timp_id int NOT NULL,
	timp_creado timestamptz NOT NULL CONSTRAINT DF_TrabajoImpresion_timp_creado  DEFAULT (getdate()),
	timp_pc varchar(255) NOT NULL CONSTRAINT DF_TrabajoImpresion_timp_pc  DEFAULT (''),
	timp_estado smallint NOT NULL CONSTRAINT DF_TrabajoImpresion_timp_estado  DEFAULT ((1)),
	timp_sendByEmail smallint NOT NULL CONSTRAINT DF_TrabajoImpresion_timp_sendByEmail  DEFAULT ((0)),
	timp_emailAddress varchar(1000) NOT NULL CONSTRAINT DF_TrabajoImpresion_timp_emailAddress  DEFAULT (''),
	timp_emailSubject varchar(1000) NOT NULL CONSTRAINT DF_TrabajoImpresion_timp_emailSubject  DEFAULT (''),
	timp_emailBody varchar(5000) NOT NULL CONSTRAINT DF_TrabajoImpresion_timp_emailBody  DEFAULT (''),
	tbl_id int NULL,
	doc_id int NULL,
	id int NULL CONSTRAINT DF_TrabajoImpresion_id  DEFAULT ((0)),
	us_id int NULL,
	emp_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_TrabajoImpresion_creado  DEFAULT (getdate()),
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
CREATE TABLE IngresosBrutosTipo(
	igbt_id int NOT NULL,
	igbt_nombre varchar(50) NOT NULL,
	igbt_codigo varchar(50) NOT NULL,
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
CREATE TABLE IncidenteApertura(
	inca_id int NOT NULL,
	inca_nombre varchar(50) NOT NULL,
	inca_codigo varchar(15) NOT NULL,
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
CREATE TABLE RecuentoStockTMP(
	rsTMP_id int NOT NULL,
	rs_id int NOT NULL,
	rs_numero int NOT NULL,
	rs_nrodoc varchar(50) NOT NULL CONSTRAINT DF_RecuentoStockTMP_rs_nrodoc  DEFAULT (''),
	rs_descrip varchar(5000) NOT NULL CONSTRAINT DF_RecuentoStockTMP_rs_descrip  DEFAULT (''),
	rs_fecha timestamptz NOT NULL CONSTRAINT DF_RecuentoStockTMP_rs_fecha  DEFAULT (getdate()),
	depl_id int NOT NULL,
	suc_id int NOT NULL,
	lgj_id int NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_RecuentoStockTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_RecuentoStockTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE FacturaCompraNotaCreditoTMP(
	fcTMP_id int NOT NULL,
	fcncTMP_id int NOT NULL,
	fcnc_id int NOT NULL,
	fcnc_importe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraNotaCreditoTMP_fcnc_importe  DEFAULT (0),
	fc_id_factura int NOT NULL,
	fc_id_notacredito int NOT NULL,
	fcd_id_factura int NULL,
	fcp_id_factura int NULL,
	fcd_id_notacredito int NULL,
	fcp_id_notacredito int NULL,
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
CREATE TABLE Prestacion(
	pre_id int NOT NULL,
	pre_nombre varchar(255) NOT NULL,
	pre_grupo varchar(255) NOT NULL CONSTRAINT DF_Prestacion_pre_grupo  DEFAULT (''),
	pre_grupo1 varchar(255) NOT NULL CONSTRAINT DF_Prestacion_pre_grupo1  DEFAULT (''),
	pre_grupo2 varchar(255) NOT NULL CONSTRAINT DF_Prestacion_pre_grupo2  DEFAULT (''),
	pre_grupo3 varchar(255) NOT NULL CONSTRAINT DF_Prestacion_pre_grupo3  DEFAULT (''),
	pre_grupo4 varchar(255) NOT NULL CONSTRAINT DF_Prestacion_pre_grupo4  DEFAULT (''),
	pre_grupo5 varchar(255) NOT NULL CONSTRAINT DF_Prestacion_pre_grupo5  DEFAULT (''),
	pre_nombreesc varchar(255) NOT NULL CONSTRAINT DF_Prestacion_pre_nombreesc  DEFAULT (''),
	pre_grupoesc varchar(255) NOT NULL CONSTRAINT DF_Prestacion_pre_grupoesc  DEFAULT (''),
	sysm_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Prestacion_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Prestacion_modificado  DEFAULT (getdate()),
	activo smallint NOT NULL CONSTRAINT DF_Prestacion_activo  DEFAULT (1),
	sysm_id_security int NULL,
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
CREATE TABLE FRETSolicitudParticular(
	fretsp_id int NOT NULL,
	fretsp_fecha timestamptz NOT NULL CONSTRAINT DF_FRETSolicitudParticular_fretsp_fecha  DEFAULT (getdate()),
	cli_id int NOT NULL,
	prov_id int NOT NULL,
	fretspi_id int NOT NULL,
	fretsp_solicita varchar(500) NOT NULL CONSTRAINT DF_FRETSolicitudParticular_fretsp_texto  DEFAULT (''),
	fretsp_reg1 char(10) NULL,
	fretsp_reg2 char(10) NULL,
	fretsp_motivo varchar(250) NULL,
	fretsp_reg3 char(10) NULL,
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
CREATE TABLE LiquidacionTMP(
	liqTMP_id int NOT NULL,
	liq_id int NOT NULL,
	liq_numero int NOT NULL,
	liq_nrodoc varchar(50) NOT NULL CONSTRAINT DF_LiquidacionTMP_liq_nrodoc  DEFAULT (''),
	liq_descrip varchar(5000) NOT NULL CONSTRAINT DF_LiquidacionTMP_liq_descrip  DEFAULT (''),
	liq_fecha timestamptz NOT NULL CONSTRAINT DF_LiquidacionTMP_liq_fecha  DEFAULT (getdate()),
	liq_fechadesde timestamptz NOT NULL CONSTRAINT DF_LiquidacionTMP_liq_fechadesde  DEFAULT ('19000101'),
	liq_fechahasta timestamptz NOT NULL CONSTRAINT DF_LiquidacionTMP_liq_fechahasta  DEFAULT ('19000101'),
	liq_periodo varchar(100) NOT NULL CONSTRAINT DF_LiquidacionTMP_liq_periodo  DEFAULT (''),
	liq_neto decimal(18, 6) NOT NULL CONSTRAINT DF_LiquidacionTMP_liq_neto  DEFAULT (0),
	liq_impuesto decimal(18, 6) NOT NULL CONSTRAINT DF_LiquidacionTMP_liq_impuesto  DEFAULT (0),
	liq_total decimal(18, 6) NOT NULL CONSTRAINT DF_LiquidacionTMP_liq_total  DEFAULT (0),
	liq_totalorigen decimal(18, 6) NOT NULL CONSTRAINT DF_LiquidacionTMP_liq_totalorigen  DEFAULT (0),
	liq_firmado int NOT NULL CONSTRAINT DF_LiquidacionTMP_liq_firmado  DEFAULT (0),
	liq_grabarasiento smallint NOT NULL CONSTRAINT DF_LiquidacionTMP_liq_grabarasiento  DEFAULT (0),
	liq_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_LiquidacionTMP_liq_cotizacion  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	doc_id int NOT NULL,
	ccos_id int NULL,
	as_id int NULL,
	lgj_id int NULL,
	liqp_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_LiquidacionTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_LiquidacionTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL CONSTRAINT DF_LiquidacionTMP_impreso  DEFAULT (0),
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
CREATE TABLE ListaDocumentoParametro(
	ldp_valor varchar(255) NOT NULL CONSTRAINT DF_ListaDocumentoParametro_ldp_valor  DEFAULT (''),
	pre_id int NOT NULL CONSTRAINT DF_ListaDocumentoParametro_pre_id  DEFAULT (0),
	us_id int NOT NULL CONSTRAINT DF_ListaDocumentoParametro_us_id  DEFAULT (0),
	ldp_id smallint NOT NULL,
	emp_id int NOT NULL CONSTRAINT DF_ListaDocumentoParametro_emp_id  DEFAULT (0),
	ldp_orden smallint NOT NULL CONSTRAINT DF_ListaDocumentoParametro_ldp_orden  DEFAULT (0),
 CONSTRAINT PK_ListaDocumentoParametro PRIMARY KEY  
(
	pre_id ,
	us_id ,
	ldp_id ,
	emp_id 
) 
) 
;

;
/****** Object:  Table EquipoTipoFalla    Script Date: 07/30/2012 17:10:26 ******/

;

;

;
CREATE TABLE EquipoTipoFalla(
	etf_id int NOT NULL,
	etf_nombre varchar(255) NOT NULL,
	etf_codigo varchar(15) NOT NULL,
	etf_descrip varchar(5000) NOT NULL,
	modificado timestamptz NOT NULL CONSTRAINT DF_EquipoTipoFalla_modificado  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_EquipoTipoFalla_creado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE FacturaVenta(
	fv_id int NOT NULL,
	fv_numero int NOT NULL,
	fv_nrodoc varchar(50) NOT NULL CONSTRAINT DF_FacturaVenta_fv_nrodoc  DEFAULT (''),
	fv_cae varchar(50) NOT NULL CONSTRAINT DF_FacturaVenta_fv_cae  DEFAULT (''),
	fv_cae_nrodoc varchar(50) NOT NULL CONSTRAINT DF_FacturaVenta_fv_cae_nrodoc  DEFAULT (''),
	fv_cae_vto varchar(50) NOT NULL CONSTRAINT DF_FacturaVenta_fv_cae_vto  DEFAULT (''),
	fv_descrip varchar(5000) NOT NULL CONSTRAINT DF_FacturaVenta_fv_descrip  DEFAULT (''),
	fv_fecha timestamptz NOT NULL CONSTRAINT DF_FacturaVenta_fv_fecha  DEFAULT (getdate()),
	fv_fechaentrega timestamptz NOT NULL CONSTRAINT DF_FacturaVenta_fv_fechaentrega  DEFAULT (getdate()),
	fv_fechaVto timestamptz NOT NULL CONSTRAINT DF_FacturaVenta_fv_fechaVto  DEFAULT ('19000101'),
	fv_fechaIva timestamptz NOT NULL CONSTRAINT DF_FacturaVenta_fv_fechaIva  DEFAULT (getdate()),
	fv_neto decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVenta_fv_neto  DEFAULT (0),
	fv_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVenta_fv_impuesto  DEFAULT (0),
	fv_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVenta_fv_ivarni  DEFAULT (0),
	fv_internos decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVenta_fc_internos  DEFAULT (0),
	fv_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVenta_fv_subtotal  DEFAULT (0),
	fv_totalpercepciones decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVenta_fc_totalpercepciones  DEFAULT (0),
	fv_total decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVenta_fv_total  DEFAULT (0),
	fv_totalorigen decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVenta_fv_totalorigen  DEFAULT (0),
	fv_totalcomercial decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVenta_fv_totalcomercial  DEFAULT (0),
	fv_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVenta_fv_pendiente  DEFAULT (0),
	fv_firmado int NOT NULL CONSTRAINT DF_FacturaVenta_fv_firmado  DEFAULT (0),
	fv_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVenta_fv_descuento  DEFAULT (0),
	fv_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVenta_fv_descuento2  DEFAULT (0),
	fv_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVenta_fv_importedesc1  DEFAULT (0),
	fv_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVenta_fv_importedesc2  DEFAULT (0),
	fv_grabarasiento smallint NOT NULL CONSTRAINT DF_FacturaVenta_fv_grabarasiento  DEFAULT (0),
	fv_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVenta_fv_cotizacion  DEFAULT (0),
	fv_cai varchar(100) NOT NULL CONSTRAINT DF_FacturaVenta_fv_cai  DEFAULT (''),
	fv_ordencompra varchar(255) NOT NULL CONSTRAINT DF_FacturaVenta_fv_ordencompra  DEFAULT (''),
	mon_id int NOT NULL,
	est_id int NOT NULL,
	suc_id int NOT NULL,
	cli_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	lp_id int NULL,
	ld_id int NULL,
	cpg_id int NOT NULL,
	ccos_id int NULL,
	ven_id int NULL,
	as_id int NULL,
	lgj_id int NULL,
	pro_id_origen int NULL,
	pro_id_destino int NULL,
	trans_id int NULL,
	rv_id int NULL,
	st_id int NULL,
	emp_id int NOT NULL,
	clis_id int NULL,
	mcj_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_FacturaVenta_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_FacturaVenta_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL CONSTRAINT DF__FacturaVe__impre__7CEF9223  DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
 CONSTRAINT PK_FacturaVenta PRIMARY KEY  
(
	fv_id 
) ,
 CONSTRAINT IX_FacturaVenta UNIQUE  
(
	fv_numero 
) ,
 CONSTRAINT IX_FacturaVentaNroDoc UNIQUE  
(
	emp_id ,
	fv_nrodoc ,
	doct_id 
) 
) 
;

;
/****** Object:  Table DepositoBancoAsiento    Script Date: 07/30/2012 17:08:06 ******/

;

;
CREATE TABLE DepositoBancoAsiento(
	dbco_id int NOT NULL,
	dbco_fecha timestamptz NOT NULL,
 CONSTRAINT PK_DepositoBancoAsiento PRIMARY KEY  
(
	dbco_id 
) 
) 
;
/****** Object:  Table PercepcionCategoriaFiscal    Script Date: 07/30/2012 17:22:30 ******/

;

;
CREATE TABLE PercepcionCategoriaFiscal(
	perccatf_id int NOT NULL,
	perc_id int NOT NULL,
	catf_id int NOT NULL,
	perccatf_base smallint NOT NULL,
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
CREATE TABLE PedidoVentaTMP(
	pvTMP_id int NOT NULL,
	pv_id int NOT NULL,
	pv_numero int NOT NULL,
	pv_nrodoc varchar(50) NOT NULL CONSTRAINT DF_PedidoVentaTMP_pv_nrodoc  DEFAULT (''),
	pv_descrip varchar(5000) NOT NULL CONSTRAINT DF_PedidoVentaTMP_pv_descrip  DEFAULT (''),
	pv_fecha timestamptz NOT NULL CONSTRAINT DF_PedidoVentaTMP_pv_fecha  DEFAULT (getdate()),
	pv_fechaentrega timestamptz NOT NULL CONSTRAINT DF_PedidoVentaTMP_pv_fechaentrega  DEFAULT (getdate()),
	pv_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaTMP_pv_subtotal  DEFAULT (0),
	pv_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaTMP_pv_neto  DEFAULT (0),
	pv_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaTMP_pv_impuesto  DEFAULT (0),
	pv_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaTMP_pv_ivarni  DEFAULT (0),
	pv_total decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaTMP_pv_total  DEFAULT (0),
	pv_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaTMP_pv_descuento1  DEFAULT (0),
	pv_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaTMP_pv_descuento2  DEFAULT (0),
	pv_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaTMP_pv_descuento11  DEFAULT (0),
	pv_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaTMP_pv_descuento21  DEFAULT (0),
	pv_destinatario varchar(1000) NOT NULL CONSTRAINT DF_PedidoVentaTMP_pv_destinatario  DEFAULT (''),
	pv_ordencompra varchar(255) NOT NULL CONSTRAINT DF_PedidoVentaTMP_pv_ordencompra  DEFAULT (''),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	cli_id int NOT NULL,
	doc_id int NOT NULL,
	lp_id int NULL,
	ld_id int NULL,
	cpg_id int NOT NULL,
	ccos_id int NULL,
	ven_id int NULL,
	lgj_id int NULL,
	pro_id_origen int NULL,
	pro_id_destino int NULL,
	trans_id int NULL,
	chof_id int NULL,
	cam_id int NULL,
	cam_id_semi int NULL,
	ram_id_stock varchar(50) NULL CONSTRAINT DF_PedidoVentaTMP_ram_id_stock  DEFAULT (''),
	clis_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_PedidoVentaTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_PedidoVentaTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE PercepcionProvincia(
	percpro_id int NOT NULL,
	perc_id int NOT NULL,
	pro_id int NOT NULL,
 CONSTRAINT PK_PercepcionProvincia PRIMARY KEY  
(
	percpro_id 
) 
) 
;
/****** Object:  Table FacturaVentaNotaCreditoTMP    Script Date: 07/30/2012 17:12:40 ******/

;

;
CREATE TABLE FacturaVentaNotaCreditoTMP(
	fvTMP_id int NOT NULL,
	fvncTMP_id int NOT NULL,
	fvnc_id int NOT NULL,
	fvnc_importe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaNotaCreditoTMP_fvnc_importe  DEFAULT (0),
	fv_id_factura int NOT NULL,
	fv_id_notacredito int NOT NULL,
	fvd_id_factura int NULL,
	fvp_id_factura int NULL,
	fvd_id_notacredito int NULL,
	fvp_id_notacredito int NULL,
 CONSTRAINT PK_FacturaVentaNotaCreditoTMP PRIMARY KEY  
(
	fvncTMP_id 
) 
) 
;
/****** Object:  Table LiquidacionItemBorradoTMP    Script Date: 07/30/2012 17:15:38 ******/

;

;
CREATE TABLE LiquidacionItemBorradoTMP(
	liqTMP_id int NOT NULL,
	liqibTMP_id int NOT NULL,
	liq_id int NOT NULL,
	liqi_id int NOT NULL,
 CONSTRAINT PK_LiquidacionItemBorradoTMP PRIMARY KEY  
(
	liqibTMP_id 
) 
) 
;
/****** Object:  Table PercepcionEmpresa    Script Date: 07/30/2012 17:22:31 ******/

;

;
CREATE TABLE PercepcionEmpresa(
	percemp_id int NOT NULL,
	perc_id int NOT NULL,
	emp_id int NOT NULL,
 CONSTRAINT PK_PercepcionEmpresa PRIMARY KEY  
(
	percemp_id 
) 
) 
;
/****** Object:  Table CatalogoWebCategoriaItemLink    Script Date: 07/30/2012 17:04:24 ******/

;

;
CREATE TABLE CatalogoWebCategoriaItemLink(
	catw_id int NOT NULL,
	catwci_id int NOT NULL,
 CONSTRAINT PK_CatalogoWebCategoriaItemLink PRIMARY KEY  
(
	catw_id ,
	catwci_id 
) 
) 
;
/****** Object:  Table LiquidacionExcepcion    Script Date: 07/30/2012 17:15:29 ******/

;

;

;
CREATE TABLE LiquidacionExcepcion(
	liq_id int NOT NULL,
	liqe_id int NOT NULL,
	liqe_descrip varchar(5000) NOT NULL CONSTRAINT DF_LiquidacionExcepcion_liqe_descrip  DEFAULT (''),
	liqe_orden smallint NOT NULL,
	em_id int NOT NULL,
	liqfi_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE PresupuestoCompraTMP(
	prcTMP_id int NOT NULL,
	prc_id int NOT NULL,
	prc_numero int NOT NULL,
	prc_nrodoc varchar(50) NOT NULL CONSTRAINT DF_PresupuestoCompraTMP_prc_nrodoc  DEFAULT (''),
	prc_descrip varchar(5000) NOT NULL CONSTRAINT DF_PresupuestoCompraTMP_prc_descrip  DEFAULT (''),
	prc_fecha timestamptz NOT NULL CONSTRAINT DF_PresupuestoCompraTMP_prc_fecha  DEFAULT (getdate()),
	prc_fechaentrega timestamptz NOT NULL CONSTRAINT DF_PresupuestoCompraTMP_prc_fechaentrega  DEFAULT (getdate()),
	prc_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraTMP_prc_subtotal  DEFAULT (0),
	prc_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraTMP_prc_neto  DEFAULT (0),
	prc_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraTMP_prc_impuesto  DEFAULT (0),
	prc_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraTMP_prc_ivarni  DEFAULT (0),
	prc_total decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraTMP_prc_total  DEFAULT (0),
	prc_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraTMP_prc_descuento1  DEFAULT (0),
	prc_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraTMP_prc_descuento2  DEFAULT (0),
	prc_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraTMP_prc_descuento11  DEFAULT (0),
	prc_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraTMP_prc_descuento21  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	prov_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	lp_id int NULL,
	ld_id int NULL,
	cpg_id int NOT NULL,
	ccos_id int NULL,
	us_id int NULL,
	lgj_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_PresupuestoCompraTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_PresupuestoCompraTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE CotizacionOrdenCompraTMP(
	cotTMP_id int NOT NULL CONSTRAINT DF_CotizacionOrdenCompraTMP_cotTMP_id  DEFAULT (0),
	ocTMP_id int NOT NULL CONSTRAINT DF_CotizacionOrdenCompraTMP_ocTMP_id  DEFAULT (0),
	cotocTMP_id int NOT NULL,
	cotoc_id int NOT NULL,
	cotoc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionOrdenCompraTMP_cotoc_cantidad  DEFAULT (0),
	coti_id int NOT NULL,
	oci_id int NOT NULL,
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
CREATE TABLE ProductoTag(
	pr_id int NOT NULL,
	prt_id int NOT NULL,
	prt_texto varchar(1000) NOT NULL,
	prt_pendienteweb smallint NOT NULL CONSTRAINT DF_ProductoTag_prt_pendienteweb  DEFAULT (0),
	prt_expoweb smallint NOT NULL CONSTRAINT DF_ProductoTag_prt_expoweb  DEFAULT (50),
	prt_expocairo smallint NOT NULL CONSTRAINT DF_ProductoTag_prt_expocairo  DEFAULT (50),
	pr_id_tag int NULL,
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
CREATE TABLE RetencionCategoriaFiscal(
	retcatf_id int NOT NULL,
	ret_id int NOT NULL,
	catf_id int NOT NULL,
	retcatf_base smallint NOT NULL,
 CONSTRAINT PK_RetencionCategoriaFiscal PRIMARY KEY  
(
	retcatf_id 
) 
) 
;
/****** Object:  Table RemitoFacturaCompraTMP    Script Date: 07/30/2012 17:28:19 ******/

;

;
CREATE TABLE RemitoFacturaCompraTMP(
	fcTMP_id int NOT NULL CONSTRAINT DF_RemitoFacturaCompraTMP_fcTMP_id  DEFAULT (0),
	rcTMP_id int NOT NULL CONSTRAINT DF_RemitoFacturaCompraTMP_rcTMP_id  DEFAULT (0),
	rcfcTMP_id int NOT NULL,
	rcfc_id int NOT NULL,
	rcfc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraFacturaTMP_rcfc_cantidad  DEFAULT (0),
	rci_id int NOT NULL,
	fci_id int NOT NULL,
 CONSTRAINT PK_RemitoCompraFacturaTMP PRIMARY KEY  
(
	rcfcTMP_id 
) 
) 
;
/****** Object:  Table RetencionProvincia    Script Date: 07/30/2012 17:29:31 ******/

;

;
CREATE TABLE RetencionProvincia(
	retpro_id int NOT NULL,
	ret_id int NOT NULL,
	pro_id int NOT NULL,
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
CREATE TABLE FacturaCompraPercepcionTMP(
	fcTMP_id int NOT NULL,
	fcpercTMP_id int NOT NULL,
	fcperc_id int NOT NULL,
	fcperc_orden smallint NOT NULL CONSTRAINT DF_FacturaCompraPercepcionTMP_fcperc_orden  DEFAULT (0),
	fcperc_base decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraPercepcionTMP_fcperc_base  DEFAULT (0),
	fcperc_porcentaje decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraPercepcionTMP_fcperc_porcentaje  DEFAULT (0),
	fcperc_importe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraPercepcionTMP_fcperc_importe  DEFAULT (0),
	fcperc_origen decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraPercepcionTMP_fcperc_origen  DEFAULT (0),
	fcperc_descrip varchar(255) NOT NULL CONSTRAINT DF_FacturaCompraPercepcionTMP_fcperc_descrip  DEFAULT (''),
	perc_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE LiquidacionExcepcionBorradoTMP(
	liqTMP_id int NOT NULL,
	liqebTMP_id int NOT NULL,
	liq_id int NOT NULL,
	liqe_id int NOT NULL,
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
CREATE TABLE sysModulo(
	sysm_objetoinicializacion varchar(255) NOT NULL,
	sysm_objetoedicion varchar(255) NOT NULL,
	sysm_id int NOT NULL,
	sysm_orden int NOT NULL,
	pre_id int NOT NULL CONSTRAINT DF_sysModulo_pre_id  DEFAULT (0),
	modificado timestamptz NOT NULL DEFAULT (getdate()),
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
CREATE TABLE EquipoDetalle(
	ed_id int NOT NULL,
	ed_nombre varchar(100) NOT NULL,
	ed_codigo varchar(15) NOT NULL,
	ed_descrip varchar(255) NOT NULL,
	rub_id int NOT NULL,
	modificado timestamptz NOT NULL CONSTRAINT DF_EquipoDetalle_modificado  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_EquipoDetalle_creado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_EquipoDetalle_activo  DEFAULT (1),
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
CREATE TABLE Auditoria(
	aud_id int NOT NULL,
	aud_fecha timestamptz NOT NULL CONSTRAINT DF_Auditoria_aud_fecha  DEFAULT (getdate()),
	aud_fin timestamptz NOT NULL CONSTRAINT DF_Auditoria_aud_fin  DEFAULT ('19000101'),
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
CREATE TABLE webArticuloEstado(
	warte_id int NOT NULL,
	warte_nombre varchar(255) NOT NULL,
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
CREATE TABLE webArticuloTipo(
	wartt_id int NOT NULL,
	wartt_nombre varchar(50) NOT NULL,
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
CREATE TABLE CotizacionPresupuestoCompraTMP(
	cotTMP_id int NOT NULL CONSTRAINT DF_CotizacionPresupuestoCompraTMP_cotTMP_id  DEFAULT (0),
	prcTMP_id int NOT NULL CONSTRAINT DF_CotizacionPresupuestoCompraTMP_prcTMP_id  DEFAULT (0),
	cotprcTMP_id int NOT NULL,
	cotprc_id int NOT NULL,
	cotprc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionPresupuestoCompraTMP_cotprc_cantidad  DEFAULT (0),
	coti_id int NOT NULL,
	prci_id int NOT NULL,
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
CREATE TABLE LiquidacionExcepcionTMP(
	liqTMP_id int NOT NULL,
	liqeTMP_id int NOT NULL,
	liqe_id int NOT NULL,
	liqe_descrip varchar(5000) NOT NULL CONSTRAINT DF_LiquidacionExcepcionTMP_liqe_descrip  DEFAULT (''),
	liqe_orden smallint NOT NULL,
	em_id int NOT NULL,
	liqfi_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE sysModuloTCP(
	syst_objetoinicializacion varchar(255) NOT NULL,
	syst_objetoedicion varchar(255) NOT NULL,
	syst_id int NOT NULL,
	syst_orden int NOT NULL,
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
CREATE TABLE CatalogoWebCategoria(
	catwc_id int NOT NULL,
	catwc_nombre varchar(100) NOT NULL,
	catwc_codigo varchar(15) NOT NULL,
	catwc_descrip varchar(255) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_CatalogoWebCategoria_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_CatalogoWebCategoria_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_CatalogoWebCategoria_activo  DEFAULT (1),
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
CREATE TABLE HoraFacturaVentaTMP(
	fvTMP_id int NOT NULL CONSTRAINT DF_HoraFacturaVentaTMP_fvTMP_id  DEFAULT (0),
	horaTMP_id int NOT NULL CONSTRAINT DF_HoraFacturaVentaTMP_horaTMP_id  DEFAULT (0),
	horafvTMP_id int NOT NULL,
	horafv_id int NOT NULL,
	horafv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_HoraFacturaVentaTMP_horafv_cantidad  DEFAULT (0),
	hora_id int NOT NULL,
	fvi_id int NOT NULL,
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
CREATE TABLE ProductoWebImage(
	pr_id int NOT NULL,
	prwi_id int NOT NULL,
	prwi_archivo varchar(255) NOT NULL,
	prwi_alt varchar(255) NOT NULL CONSTRAINT DF_ProductoWebImage_prwi_alt  DEFAULT (''),
	prwi_tipo smallint NOT NULL,
	prwi_posicion smallint NOT NULL CONSTRAINT DF_ProductoWebImage_prwi_posicion  DEFAULT (0),
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
CREATE TABLE OrdenRemitoVentaTMP(
	osTMP_id int NOT NULL CONSTRAINT DF_OrdenRemitoVentaTMP_osTMP_id  DEFAULT (0),
	rvTMP_id int NOT NULL CONSTRAINT DF_OrdenRemitoVentaTMP_rvTMP_id  DEFAULT (0),
	osrvTMP_id int NOT NULL,
	osrv_id int NOT NULL,
	osrv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenRemitoVentaTMP_osrv_cantidad  DEFAULT (0),
	osi_id int NOT NULL,
	rvi_id int NOT NULL,
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
CREATE TABLE StockTMP(
	stTMP_id int NOT NULL,
	st_id int NOT NULL,
	st_numero int NOT NULL,
	st_nrodoc varchar(50) NOT NULL CONSTRAINT DF_StockTMP_st_nrodoc  DEFAULT (''),
	st_descrip varchar(5000) NOT NULL CONSTRAINT DF_StockTMP_st_descrip  DEFAULT (''),
	st_fecha timestamptz NOT NULL CONSTRAINT DF_StockTMP_st_fecha  DEFAULT (getdate()),
	depl_id_origen int NOT NULL,
	depl_id_destino int NOT NULL,
	suc_id int NOT NULL,
	lgj_id int NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_StockTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_StockTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE AuditoriaGrupo(
	audg_id int NOT NULL,
	audg_nombre varchar(255) NOT NULL,
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
CREATE TABLE ListaPrecioPrecio(
	lp_id int NOT NULL,
	pr_id int NOT NULL,
	lpp_precio decimal(18, 6) NOT NULL,
	modificado timestamptz NOT NULL CONSTRAINT DF_ListaPrecioPrecio_modificado  DEFAULT (getdate()),
 CONSTRAINT PK_ListaPrecioPrecio PRIMARY KEY  
(
	lp_id ,
	pr_id 
) 
) 
;
/****** Object:  Table AlarmaMailResult    Script Date: 07/30/2012 17:03:05 ******/

;

;
CREATE TABLE AlarmaMailResult(
	alm_id int NOT NULL,
	almr_id SERIAL NOT NULL,
	almr_id_mail int NOT NULL,
	almr_fecha timestamptz NOT NULL CONSTRAINT DF_AlarmaMailResult_almr_fecha  DEFAULT (getdate()),
 CONSTRAINT PK_AlarmaMailResult PRIMARY KEY  
(
	almr_id 
) 
) 
;
/****** Object:  Table rptArbolRamaHoja    Script Date: 07/30/2012 17:29:37 ******/

;

;
CREATE TABLE rptArbolRamaHoja(
	rptarb_cliente int NOT NULL,
	rptarb_hojaid int NOT NULL,
	tbl_id int NOT NULL,
	ram_id int NOT NULL CONSTRAINT DF_rptArbolRamaHoja_ram_id  DEFAULT (0),
 CONSTRAINT PK_rtpArbolRamaHoja PRIMARY KEY  
(
	rptarb_cliente ,
	rptarb_hojaid ,
	tbl_id ,
	ram_id 
) 
) 
;
/****** Object:  Table TmpStringToTable    Script Date: 07/30/2012 17:31:45 ******/

;

;

;
CREATE TABLE TmpStringToTable(
	tmpstr2tbl_campo varchar(5000) NULL,
	tmpstr2tbl_id timestamptz NOT NULL
) 
;

;
/****** Object:  Table CodigoPostal    Script Date: 07/30/2012 17:05:58 ******/

;

;

;
CREATE TABLE CodigoPostal(
	cpa_id int NOT NULL,
	cpa_codigo varchar(50) NOT NULL CONSTRAINT DF_CodigoPostal_cpa_codigo  DEFAULT (''),
	cpa_descrip varchar(255) NOT NULL CONSTRAINT DF_CodigoPostal_cpa_descrip  DEFAULT (''),
	pro_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_CodigoPostal_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_CodigoPostal_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_CodigoPostal_activo  DEFAULT (1),
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
CREATE TABLE LiquidacionAsiento(
	liq_id int NOT NULL,
	liq_fecha timestamptz NOT NULL,
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
CREATE TABLE LiquidacionConceptoAdmTMP(
	liqTMP_id int NOT NULL,
	liqcaTMP_id int NOT NULL,
	liqca_id int NOT NULL,
	liqca_importe decimal(18, 6) NOT NULL CONSTRAINT DF_LiquidacionCodigoAdmTMP_liqca_importe  DEFAULT (0),
	liqca_descrip varchar(5000) NOT NULL CONSTRAINT DF_LiquidacionCodigoAdmTMP_liqca_descrip  DEFAULT (''),
	liqca_orden smallint NOT NULL,
	em_id int NOT NULL,
	liqfi_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE ReglaLiquidacion(
	rel_id int NOT NULL,
	rel_nombre varchar(100) NOT NULL,
	rel_codigo varchar(15) NOT NULL,
	rel_descrip varchar(255) NOT NULL CONSTRAINT DF_ReglaLiquidacion_rel_descripcion  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_ReglaLiquidacion_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ReglaLiquidacion_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_ReglaLiquidacion_activo  DEFAULT (1),
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
CREATE TABLE CategoriaFiscal(
	catf_id int NOT NULL,
	catf_codigo varchar(15) NOT NULL,
	catf_nombre varchar(255) NOT NULL,
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
CREATE TABLE AlarmaMail(
	alm_id int NOT NULL,
	alm_nombre varchar(255) NOT NULL,
	alm_scriptmails varchar(255) NOT NULL CONSTRAINT DF_AlarmaMail_alm_scriptmails  DEFAULT (''),
	alm_scriptresult varchar(255) NOT NULL CONSTRAINT DF_AlarmaMail_alm_scriptresult  DEFAULT (''),
	alm_object varchar(255) NOT NULL CONSTRAINT DF_AlarmaMail_alm_object  DEFAULT (''),
	alm_frecuencia int NOT NULL CONSTRAINT DF_AlarmaMail_alm_frecuencia  DEFAULT (30),
	alm_mails varchar(5000) NOT NULL CONSTRAINT DF_AlarmaMail_alm_mails  DEFAULT (''),
	alm_nextrun timestamptz NOT NULL CONSTRAINT DF_AlarmaMail_alm_nextrun  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_AlarmaMail_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_AlarmaMail_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_AlarmaMail_activo  DEFAULT (1),
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
CREATE TABLE SRV_AfipCuit(
	safipc_id int NOT NULL,
	safipc_cuit varchar(50) NOT NULL,
	safipc_folder varchar(255) NOT NULL,
	safipc_pendiente smallint NOT NULL,
	safipc_success smallint NOT NULL,
	safipc_error varchar(255) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_SRV_AfipCuit_creado  DEFAULT (getdate()),
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
CREATE TABLE DepositoCuponAsiento(
	dcup_id int NOT NULL,
	dcup_fecha timestamptz NOT NULL,
 CONSTRAINT PK_DepositoCuponAsiento PRIMARY KEY  
(
	dcup_id 
) 
) 
;
/****** Object:  Table RemitoCompraItemSerieBTMP    Script Date: 07/30/2012 17:27:56 ******/

;

;
CREATE TABLE RemitoCompraItemSerieBTMP(
	rcTMP_id int NOT NULL,
	rcisbTMP_id int NOT NULL,
	prns_id int NOT NULL CONSTRAINT DF_RemitoCompraItemSerieBTMP_prns_id  DEFAULT (0),
 CONSTRAINT PK_RemitoCompraItemSerieBTMP PRIMARY KEY  
(
	rcisbTMP_id 
) 
) 
;
/****** Object:  Table LiquidacionConceptoAdmBorradoTMP    Script Date: 07/30/2012 17:15:25 ******/

;

;
CREATE TABLE LiquidacionConceptoAdmBorradoTMP(
	liqTMP_id int NOT NULL,
	liqcabTMP_id int NOT NULL,
	liq_id int NOT NULL,
	liqca_id int NOT NULL,
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
CREATE TABLE CatalogoWeb(
	catw_id int NOT NULL,
	catw_nombre varchar(100) NOT NULL,
	catw_codigo varchar(15) NOT NULL,
	catw_descrip varchar(255) NOT NULL CONSTRAINT DF_CatalogoWeb_catw_descrip  DEFAULT (''),
	catw_updateaddress varchar(1000) NOT NULL CONSTRAINT DF_CatalogoWeb_catw_updateaddress  DEFAULT (''),
	catw_updateuser varchar(100) NOT NULL CONSTRAINT DF_CatalogoWeb_catw_updateuser  DEFAULT (''),
	catw_updatepwd varchar(255) NOT NULL CONSTRAINT DF_CatalogoWeb_catw_updatepwd  DEFAULT (''),
	catw_ftpaddress varchar(1000) NOT NULL CONSTRAINT DF_CatalogoWeb_catw_ftpaddress  DEFAULT (''),
	catw_ftpuser varchar(100) NOT NULL CONSTRAINT DF_CatalogoWeb_catw_ftpuser  DEFAULT (''),
	catw_ftppwd varchar(1000) NOT NULL CONSTRAINT DF_CatalogoWeb_catw_ftppwd  DEFAULT (''),
	catw_folderimage varchar(50) NOT NULL CONSTRAINT DF_CatalogoWeb_catw_folderimage  DEFAULT (''),
	catw_cscart smallint NOT NULL CONSTRAINT DF_CatalogoWeb_catw_cscart  DEFAULT (0),
	activo smallint NOT NULL CONSTRAINT DF_CatalogoWeb_activo  DEFAULT (1),
	creado timestamptz NOT NULL CONSTRAINT DF_CatalogoWeb_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_CatalogoWeb_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE CDRom(
	cd_id int NOT NULL,
	cd_codigo varchar(15) NOT NULL,
	cd_nombre varchar(100) NOT NULL,
	cd_descrip varchar(255) NOT NULL CONSTRAINT DF_CDRom_cd_descrip  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_CDRom_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_CDRom_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_CDRom_activo  DEFAULT (1),
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
CREATE TABLE FacturaVentaTMP(
	cobzTMP_id int NOT NULL CONSTRAINT DF_FacturaVentaTMP_cobzTMP_id  DEFAULT (0),
	fvTMP_id int NOT NULL,
	fv_id int NOT NULL,
	fv_numero int NOT NULL,
	fv_nrodoc varchar(50) NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_nrodoc  DEFAULT (''),
	fv_descrip varchar(5000) NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_descrip  DEFAULT (''),
	fv_fecha timestamptz NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_fecha  DEFAULT (getdate()),
	fv_fechaentrega timestamptz NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_fechaentrega  DEFAULT (getdate()),
	fv_fechaVto timestamptz NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_fechaVto  DEFAULT ('19000101'),
	fv_fechaIva timestamptz NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_fechaIva  DEFAULT (getdate()),
	fv_neto decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_neto  DEFAULT (0),
	fv_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_impuesto  DEFAULT (0),
	fv_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_ivarni  DEFAULT (0),
	fv_internos decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_internos  DEFAULT (0),
	fv_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_subtotal  DEFAULT (0),
	fv_totalpercepciones decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaTMP_fc_totalpercepciones  DEFAULT (0),
	fv_total decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_total  DEFAULT (0),
	fv_totalorigen decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_totalorigen  DEFAULT (0),
	fv_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_pendiente  DEFAULT (0),
	fv_firmado int NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_firmado  DEFAULT (0),
	fv_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_descuento  DEFAULT (0),
	fv_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_descuento2  DEFAULT (0),
	fv_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_importedesc1  DEFAULT (0),
	fv_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_importedesc2  DEFAULT (0),
	fv_grabarasiento smallint NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_grabarasiento  DEFAULT (0),
	fv_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_cotizacion  DEFAULT (0),
	fv_cai varchar(100) NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_cai  DEFAULT (''),
	fv_ordencompra varchar(255) NOT NULL CONSTRAINT DF_FacturaVentaTMP_fv_ordencompra  DEFAULT (''),
	rv_nrodoc varchar(50) NOT NULL CONSTRAINT DF_FacturaVentaTMP_rv_nrodoc  DEFAULT (''),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	cli_id int NOT NULL,
	doc_id int NOT NULL,
	lp_id int NULL,
	ld_id int NULL,
	cpg_id int NOT NULL,
	ccos_id int NULL,
	ven_id int NULL,
	as_id int NULL,
	lgj_id int NULL,
	pro_id_origen int NULL,
	pro_id_destino int NULL,
	trans_id int NULL,
	rv_id int NULL,
	st_id int NULL,
	depl_id int NULL,
	clis_id int NULL,
	cj_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_FacturaVentaTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_FacturaVentaTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE PresupuestoPedidoVentaTMP(
	prvTMP_id int NOT NULL CONSTRAINT DF_PresupuestoPedidoVentaTMP_prvTMP_id  DEFAULT (0),
	pvTMP_id int NOT NULL CONSTRAINT DF_PresupuestoPedidoVentaTMP_pvTMP_id  DEFAULT (0),
	prvpvTMP_id int NOT NULL,
	prvpv_id int NOT NULL,
	prvpv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoPedidoVentaTMP_prvpv_cantidad  DEFAULT (0),
	prvi_id int NOT NULL,
	pvi_id int NOT NULL,
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
CREATE TABLE DepositoCuponTMP(
	dcupTMP_id int NOT NULL,
	dcup_id int NOT NULL,
	dcup_numero int NOT NULL,
	dcup_nrodoc varchar(50) NOT NULL CONSTRAINT DF_DepositoCuponTMP_dcup_nrodoc_1  DEFAULT (''),
	dcup_descrip varchar(5000) NOT NULL CONSTRAINT DF_DepositoCuponTMP_dcup_descrip_1  DEFAULT (''),
	dcup_fecha timestamptz NOT NULL CONSTRAINT DF_DepositoCuponTMP_dcup_fecha_1  DEFAULT (getdate()),
	dcup_total decimal(18, 6) NOT NULL CONSTRAINT DF_DepositoCuponTMP_dcup_total_1  DEFAULT (0),
	dcup_firmado int NOT NULL CONSTRAINT DF_DepositoCuponTMP_dcup_firmado_1  DEFAULT (0),
	dcup_grabarasiento smallint NOT NULL CONSTRAINT DF_DepositoCuponTMP_dcup_grabarasiento_1  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	doc_id int NOT NULL,
	as_id int NULL,
	lgj_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_DepositoCuponTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_DepositoCuponTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE OrdenPagoTMP(
	fcTMP_id int NOT NULL CONSTRAINT DF_OrdenPagoTMP_fcTMP_id  DEFAULT (0),
	opgTMP_id int NOT NULL,
	opg_id int NOT NULL,
	opg_numero int NOT NULL,
	opg_nrodoc varchar(50) NOT NULL CONSTRAINT DF_OrdenPagoTMP_opg_nrodoc  DEFAULT (''),
	opg_descrip varchar(5000) NOT NULL CONSTRAINT DF_OrdenPagoTMP_opg_descrip  DEFAULT (''),
	opg_fecha timestamptz NOT NULL CONSTRAINT DF_OrdenPagoTMP_opg_fecha  DEFAULT (getdate()),
	opg_neto decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenPagoTMP_opg_neto  DEFAULT (0),
	opg_otros decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenPagoTMP_opg_otros  DEFAULT (0),
	opg_total decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenPagoTMP_opg_total  DEFAULT (0),
	opg_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenPagoTMP_opg_pendiente  DEFAULT (0),
	opg_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenPagoTMP_opg_cotizacion  DEFAULT (0),
	opg_grabarAsiento smallint NOT NULL CONSTRAINT DF_OrdenPagoTMP_opg_grabarAsiento  DEFAULT (0),
	opg_firmado int NOT NULL CONSTRAINT DF_OrdenPagoTMP_opg_firmado  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	prov_id int NOT NULL,
	doc_id int NOT NULL,
	ccos_id int NULL,
	lgj_id int NULL,
	oc_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_OrdenPagoTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_OrdenPagoTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE ListaPrecioMarcado(
	lpm_id int NOT NULL,
	lpm_nombre varchar(100) NOT NULL,
	lpm_codigo varchar(15) NOT NULL,
	lpm_descrip varchar(50) NOT NULL CONSTRAINT DF_ListaPrecioMarcado_lpm_descrip  DEFAULT (''),
	lpm_base decimal(18, 6) NOT NULL,
	lpm_porcentaje decimal(18, 6) NOT NULL,
	lpm_salto decimal(18, 6) NOT NULL,
	lpm_decremento decimal(18, 6) NOT NULL,
	lpm_porcminimo decimal(18, 6) NOT NULL,
	lpm_porcmaximo decimal(18, 6) NOT NULL,
	lpm_montominimo decimal(18, 6) NOT NULL,
	mon_id int NOT NULL,
	modificado timestamptz NOT NULL CONSTRAINT DF_ListaPrecioMarcado_modificado  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_ListaPrecioMarcado_creado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_ListaPrecioMarcado_activo  DEFAULT (1),
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
CREATE TABLE Tarifario(
	tf_id int NOT NULL,
	tf_nombre varchar(100) NOT NULL,
	tf_codigo varchar(15) NOT NULL,
	tf_descrip varchar(255) NOT NULL CONSTRAINT DF_Tarifario_tf_descrip  DEFAULT (''),
	ciu_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Tarifario_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Tarifario_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Tarifario_activo  DEFAULT (1),
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
CREATE TABLE AuditoriaNivel(
	audn_id int NOT NULL,
	audn_nombre varchar(255) NOT NULL,
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
CREATE TABLE ComunidadInternetPregunta(
	cmip_id int NOT NULL,
	cmip_preguntaid varchar(255) NOT NULL,
	cmip_nick varchar(255) NOT NULL,
	cmip_pregunta varchar(4000) NOT NULL,
	cmip_respuesta varchar(4000) NOT NULL,
	cmip_descrip varchar(5000) NOT NULL CONSTRAINT DF_ComunidadInternetPregunta_cmip_descrip  DEFAULT (''),
	cmip_fecha timestamptz NOT NULL,
	cmip_fecha_respuesta timestamptz NOT NULL,
	cmip_articuloid varchar(50) NOT NULL,
	cmip_articulo varchar(2000) NOT NULL CONSTRAINT DF_ComunidadInternetPregunta_cmip_articulo  DEFAULT (''),
	cmi_id int NOT NULL,
	us_id_respondio int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ComunidadInternetPregunta_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ComunidadInternetPregunta_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE PedidoDevolucionVentaTMP(
	pvTMP_id int NOT NULL,
	pvdvTMP_id int NOT NULL,
	pvdv_id int NOT NULL,
	pvdv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoDevolucionVenta_pvdv_cantidad  DEFAULT (0),
	pvi_id_pedido int NOT NULL,
	pvi_id_devolucion int NOT NULL,
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
CREATE TABLE LiquidacionCodigoTipo(
	liqct_id int NOT NULL,
	liqct_nombre varchar(100) NOT NULL,
	liqct_codigo varchar(15) NOT NULL,
	liqct_descrip varchar(255) NOT NULL,
	modificado timestamptz NOT NULL CONSTRAINT DF_LiquidacionCodigoTipo_modificado  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_LiquidacionCodigoTipo_creado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_LiquidacionCodigoTipo_activo  DEFAULT (1),
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
CREATE TABLE BancoConciliacion(
	bcoc_id int NOT NULL,
	bcoc_numero int NOT NULL,
	bcoc_fecha timestamptz NOT NULL,
	bcoc_fechaDesde timestamptz NOT NULL,
	bcoc_fechaHasta timestamptz NOT NULL,
	bcoc_saldoInicialCont decimal(18, 6) NOT NULL,
	bcoc_saldoCont decimal(18, 6) NOT NULL,
	bcoc_saldoInicialBco decimal(18, 6) NOT NULL,
	bcoc_conciliadoBco decimal(18, 6) NOT NULL,
	bcoc_saldoBco decimal(18, 6) NOT NULL,
	bcoc_saldoInicialRech decimal(18, 6) NOT NULL,
	bcoc_rechazado decimal(18, 6) NOT NULL,
	bcoc_saldoRech decimal(18, 6) NOT NULL,
	bcoc_saldoInicialPendiente decimal(18, 6) NOT NULL,
	bcoc_pendiente decimal(18, 6) NOT NULL,
	bcoc_saldoPendiente decimal(18, 6) NOT NULL,
	bcoc_fechacheque smallint NOT NULL,
	bcoc_verpendientes smallint NOT NULL,
	bcoc_descrip varchar(5000) NOT NULL,
	cue_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_BancoConciliacion_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_BancoConciliacion_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE MovimientoFondoTMP(
	rendTMP_id int NOT NULL CONSTRAINT DF_MovimientoFondoTMP_rendTMP_id  DEFAULT (0),
	mfTMP_id int NOT NULL,
	mf_id int NOT NULL,
	mf_numero int NOT NULL,
	mf_nrodoc varchar(50) NOT NULL CONSTRAINT DF_MovimientoFondoTMP_mf_nrodoc  DEFAULT (''),
	mf_descrip varchar(5000) NOT NULL CONSTRAINT DF_MovimientoFondoTMP_mf_descrip  DEFAULT (''),
	mf_fecha timestamptz NOT NULL CONSTRAINT DF_MovimientoFondoTMP_mf_fecha  DEFAULT (getdate()),
	mf_total decimal(18, 6) NOT NULL CONSTRAINT DF_MovimientoFondoTMP_mf_total  DEFAULT (0),
	mf_totalorigen decimal(18, 6) NOT NULL CONSTRAINT DF_MovimientoFondoTMP_mf_totalorigen  DEFAULT (0),
	mf_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_MovimientoFondoTMP_mf_pendiente  DEFAULT (0),
	mf_firmado int NOT NULL CONSTRAINT DF_MovimientoFondoTMP_mf_firmado  DEFAULT (0),
	mf_grabarasiento smallint NOT NULL CONSTRAINT DF_MovimientoFondoTMP_mf_grabarasiento  DEFAULT (0),
	mf_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_MovimientoFondoTMP_mf_cotizacion  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	cli_id int NULL,
	doc_id int NOT NULL,
	ccos_id int NULL,
	us_id int NULL,
	as_id int NULL,
	lgj_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_MovimientoFondoTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_MovimientoFondoTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE FacturaVentaAsiento(
	fv_id int NOT NULL,
	fv_fecha timestamptz NOT NULL,
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
CREATE TABLE RubroTabla(
	rubt_id int NOT NULL,
	rubt_nombre varchar(255) NOT NULL,
	rubt_codigo varchar(50) NOT NULL,
	rubt_descrip varchar(255) NOT NULL CONSTRAINT DF_RubroTabla_rubt_descrip  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_RubroTabla_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_RubroTabla_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_RubroTabla_activo  DEFAULT (1),
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
CREATE TABLE LiquidacionItemCodigoTMP(
	liqcTMP_id int NOT NULL,
	liqi_id int NOT NULL,
	liqfi_id int NOT NULL,
	liqic_importe decimal(18, 6) NOT NULL CONSTRAINT DF_LiquidacionItemCodigoTMP_liqic_importe  DEFAULT (0),
	liqic_unidades decimal(18, 6) NOT NULL CONSTRAINT DF_LiquidacionItemCodigoTMP_liqic_unidades  DEFAULT (0),
 CONSTRAINT PK_LiquidacionItemCodigoTMP PRIMARY KEY  
(
	liqcTMP_id ,
	liqi_id ,
	liqfi_id 
) 
) 
;
/****** Object:  Table RamaConfig    Script Date: 07/30/2012 17:27:20 ******/

;

;

;
CREATE TABLE RamaConfig(
	ramc_aspecto varchar(150) NOT NULL,
	ramc_valor varchar(1500) NOT NULL CONSTRAINT DF_RamaConfig_ramc_valor  DEFAULT (''),
	ram_id int NOT NULL,
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
CREATE TABLE FacturaCompraAsiento(
	fc_id int NOT NULL,
	fc_fecha timestamptz NOT NULL,
 CONSTRAINT PK_FacturaCompraAsiento PRIMARY KEY  
(
	fc_id 
) 
) 
;
/****** Object:  Table CobranzaAsiento    Script Date: 07/30/2012 17:05:38 ******/

;

;
CREATE TABLE CobranzaAsiento(
	cobz_id int NOT NULL,
	cobz_fecha timestamptz NOT NULL,
 CONSTRAINT PK_CobranzaAsiento PRIMARY KEY  
(
	cobz_id 
) 
) 
;
/****** Object:  Table FormaPago    Script Date: 07/30/2012 17:13:07 ******/

;

;

;
CREATE TABLE FormaPago(
	fp_id int NOT NULL,
	fp_nombre varchar(100) NOT NULL,
	fp_codigo varchar(15) NOT NULL,
	fp_descrip varchar(255) NOT NULL CONSTRAINT DF_FormaPago_fp_descrip  DEFAULT (''),
	fp_lunes smallint NOT NULL,
	fp_martes smallint NOT NULL,
	fp_miercoles smallint NOT NULL,
	fp_jueves smallint NOT NULL,
	fp_viernes smallint NOT NULL,
	fp_sabado smallint NOT NULL,
	fp_domingo smallint NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_FormaPago_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_FormaPago_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_FormaPago_activo  DEFAULT (1),
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
CREATE TABLE ArbolVista(
	arb_id int NOT NULL,
	arbv_id int NOT NULL,
	arbv_nombre varchar(100) NOT NULL,
	arbv_descrip varchar(255) NOT NULL CONSTRAINT DF_ArbolVista_arbv_descrip  DEFAULT (''),
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
CREATE TABLE FacturaCompraTMP(
	opgTMP_id int NOT NULL CONSTRAINT DF_FacturaCompraTMP_opgTMP_id  DEFAULT (0),
	fcTMP_id int NOT NULL,
	fc_id int NOT NULL,
	fc_numero int NOT NULL,
	fc_nrodoc varchar(50) NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_nrodoc  DEFAULT (''),
	fc_descrip varchar(5000) NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_descrip  DEFAULT (''),
	fc_fecha timestamptz NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_fecha  DEFAULT (getdate()),
	fc_fechaentrega timestamptz NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_fechaentrega  DEFAULT (getdate()),
	fc_fechaVto timestamptz NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_fechaVto  DEFAULT ('19000101'),
	fc_fechaIva timestamptz NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_fechaIva  DEFAULT (getdate()),
	fc_neto decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_neto  DEFAULT (0),
	fc_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_impuesto  DEFAULT (0),
	fc_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_ivarni  DEFAULT (0),
	fc_internos decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_internos  DEFAULT (0),
	fc_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_subtotal  DEFAULT (0),
	fc_totalotros decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_totalotros  DEFAULT (0),
	fc_totalpercepciones decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_totalpercepciones  DEFAULT (0),
	fc_total decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_total  DEFAULT (0),
	fc_totalorigen decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_totalorigen  DEFAULT (0),
	fc_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_pendiente  DEFAULT (0),
	fc_firmado int NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_firmado  DEFAULT (0),
	fc_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_descuento  DEFAULT (0),
	fc_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_descuento2  DEFAULT (0),
	fc_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_importedesc1  DEFAULT (0),
	fc_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_importedesc2  DEFAULT (0),
	fc_grabarasiento smallint NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_grabarasiento  DEFAULT (0),
	fc_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_cotizacion  DEFAULT (0),
	fc_cotizacionprov decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_cotizacionprov  DEFAULT (0),
	fc_cai varchar(100) NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_cai  DEFAULT (''),
	fc_tipocomprobante smallint NOT NULL CONSTRAINT DF_FacturaCompraTMP_fc_tipocomprobante  DEFAULT (1),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	prov_id int NOT NULL,
	doc_id int NOT NULL,
	lp_id int NULL,
	ld_id int NULL,
	cpg_id int NOT NULL,
	ccos_id int NULL,
	as_id int NULL,
	lgj_id int NULL,
	pro_id_origen int NULL,
	pro_id_destino int NULL,
	rc_id int NULL,
	st_id int NULL,
	depl_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_FacturaCompraTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_FacturaCompraTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE PedidoPackingListTMP(
	pklstTMP_id int NOT NULL CONSTRAINT DF_PedidoPackingListTMP_pklstTMP_id  DEFAULT (0),
	pvTMP_id int NOT NULL CONSTRAINT DF_PedidoPackingListTMP_pvTMP_id  DEFAULT (0),
	pvpklstTMP_id int NOT NULL,
	pvpklst_id int NOT NULL,
	pvpklst_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoPackingListTMP_pvpklst_cantidad  DEFAULT (0),
	pvi_id int NOT NULL,
	pklsti_id int NOT NULL,
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
CREATE TABLE Chequera(
	chq_id int NOT NULL,
	cue_id int NOT NULL,
	chq_codigo varchar(100) NOT NULL,
	chq_descrip varchar(255) NOT NULL CONSTRAINT DF_Chequera_chq_descripcion  DEFAULT (''),
	chq_numerodesde int NOT NULL CONSTRAINT DF_Chequera_chq_numerodesde  DEFAULT (0),
	chq_numerohasta int NOT NULL CONSTRAINT DF_Chequera_chq_numerohasta  DEFAULT (0),
	chq_ultimonumero int NOT NULL,
	chq_default smallint NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Chequera_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Chequera_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Chequera_activo  DEFAULT (1),
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
CREATE TABLE StockClienteTMP(
	stcliTMP_id int NOT NULL,
	stcli_numero int NOT NULL,
	stcli_nrodoc varchar(50) NOT NULL CONSTRAINT DF_StockClienteTMP_stcli_nrodoc  DEFAULT (''),
	stcli_descrip varchar(5000) NOT NULL CONSTRAINT DF_StockClienteTMP_stcli_descrip  DEFAULT (''),
	stcli_fecha timestamptz NOT NULL CONSTRAINT DF_StockClienteTMP_stcli_fecha  DEFAULT (getdate()),
	stcli_id int NOT NULL,
	cli_id int NULL,
	depl_id_origen int NOT NULL,
	depl_id_destino int NOT NULL,
	suc_id int NOT NULL,
	lgj_id int NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_StockClienteTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_StockClienteTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE PedidoRemitoVentaTMP(
	pvTMP_id int NOT NULL CONSTRAINT DF_PedidoRemitoVentaTMP_pvTMP_id  DEFAULT (0),
	rvTMP_id int NOT NULL CONSTRAINT DF_PedidoRemitoVentaTMP_rvTMP_id  DEFAULT (0),
	pvrvTMP_id int NOT NULL,
	pvrv_id int NOT NULL,
	pvrv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoRemitoVentaTMP_pvrv_cantidad  DEFAULT (0),
	pvi_id int NOT NULL,
	rvi_id int NOT NULL,
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
CREATE TABLE PedidoCompraTMP(
	pcTMP_id int NOT NULL,
	pc_id int NOT NULL,
	pc_numero int NOT NULL,
	pc_nrodoc varchar(50) NOT NULL CONSTRAINT DF_PedidoCompraTMP_pc_nrodoc  DEFAULT (''),
	pc_descrip varchar(5000) NOT NULL CONSTRAINT DF_PedidoCompraTMP_pc_descrip  DEFAULT (''),
	pc_fecha timestamptz NOT NULL CONSTRAINT DF_PedidoCompraTMP_pc_fecha  DEFAULT (getdate()),
	pc_fechaentrega timestamptz NOT NULL CONSTRAINT DF_PedidoCompraTMP_pc_fechaentrega  DEFAULT (getdate()),
	pc_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraTMP_pc_subtotal  DEFAULT (0),
	pc_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraTMP_pc_neto  DEFAULT (0),
	pc_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraTMP_pc_impuesto  DEFAULT (0),
	pc_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraTMP_pc_ivarni  DEFAULT (0),
	pc_total decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraTMP_pc_total  DEFAULT (0),
	us_id int NOT NULL,
	est_id int NOT NULL,
	suc_id int NOT NULL,
	doc_id int NOT NULL,
	lp_id int NULL,
	ccos_id int NULL,
	lgj_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_PedidoCompraTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_PedidoCompraTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE OrdenCompra(
	oc_id int NOT NULL,
	oc_numero int NOT NULL,
	oc_nrodoc varchar(50) NOT NULL CONSTRAINT DF_OrdenCompra_prsp_nrodoc  DEFAULT (''),
	oc_descrip varchar(5000) NOT NULL CONSTRAINT DF_OrdenCompra_prsp_descrip  DEFAULT (''),
	oc_fecha timestamptz NOT NULL CONSTRAINT DF_OrdenCompra_prsp_fecha  DEFAULT (getdate()),
	oc_fechaentrega timestamptz NOT NULL CONSTRAINT DF_OrdenCompra_prsp_fechaentrega  DEFAULT (getdate()),
	oc_neto decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompra_prsp_neto  DEFAULT (0),
	oc_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompra_prsp_ivari  DEFAULT (0),
	oc_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompra_prsp_ivarni  DEFAULT (0),
	oc_total decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompra_prsp_total  DEFAULT (0),
	oc_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompra_oc_subtotal  DEFAULT (0),
	oc_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompra_oc_pendiente  DEFAULT (0),
	oc_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompra_oc_descuento1  DEFAULT (0),
	oc_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompra_oc_descuento2  DEFAULT (0),
	oc_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompra_oc_importedesc1  DEFAULT (0),
	oc_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompra_oc_importedesc2  DEFAULT (0),
	oc_firmado int NOT NULL CONSTRAINT DF_OrdenCompra_oc_firmado  DEFAULT (0),
	oc_ordencompra varchar(50) NOT NULL CONSTRAINT DF_OrdenCompra_oc_ordencompra  DEFAULT (''),
	oc_presupuesto varchar(50) NOT NULL CONSTRAINT DF_OrdenCompra_oc_presupuesto  DEFAULT (''),
	oc_maquina varchar(255) NOT NULL CONSTRAINT DF_OrdenCompra_oc_maquina  DEFAULT (''),
	oc_maquinanro varchar(50) NOT NULL CONSTRAINT DF_OrdenCompra_oc_maquinanro  DEFAULT (''),
	oc_maquinamodelo varchar(50) NOT NULL CONSTRAINT DF_OrdenCompra_oc_maquinamodelo  DEFAULT (''),
	oc_fleteaereo smallint NOT NULL CONSTRAINT DF_OrdenCompra_oc_fleteaereo  DEFAULT (0),
	oc_fletemaritimo smallint NOT NULL CONSTRAINT DF_OrdenCompra_oc_fletemaritimo  DEFAULT (0),
	oc_fletecorreo smallint NOT NULL CONSTRAINT DF_OrdenCompra_oc_fletecorreo  DEFAULT (0),
	oc_fletecamion smallint NOT NULL CONSTRAINT DF_OrdenCompra_oc_fletecamion  DEFAULT (0),
	oc_fleteotros smallint NOT NULL CONSTRAINT DF_OrdenCompra_oc_fleteotros  DEFAULT (0),
	est_id int NOT NULL,
	ccos_id int NULL,
	suc_id int NOT NULL,
	prov_id int NOT NULL,
	cli_id int NULL,
	emp_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	lp_id int NULL,
	ld_id int NULL,
	cpg_id int NOT NULL,
	lgj_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_OrdenCompra_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_OrdenCompra_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL CONSTRAINT DF__OrdenComp__impre__12DED342  DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
 CONSTRAINT PK_OrdenCompra PRIMARY KEY  
(
	oc_id 
) ,
 CONSTRAINT IX_OrdenCompra UNIQUE  
(
	oc_numero 
) ,
 CONSTRAINT IX_OrdenCompraNroDoc UNIQUE  
(
	emp_id ,
	oc_nrodoc 
) 
) 
;

;
/****** Object:  Table Tabla    Script Date: 07/30/2012 17:30:49 ******/

;

;

;
CREATE TABLE Tabla(
	tbl_id int NOT NULL,
	tbl_nombre varchar(100) NOT NULL CONSTRAINT DF_Tabla_tbl_nombre  DEFAULT (''),
	tbl_nombrefisico varchar(50) NOT NULL CONSTRAINT DF_Tabla_tbl_nombrefisico  DEFAULT (''),
	tbl_campoId varchar(50) NOT NULL CONSTRAINT DF_Tabla_tbl_campoId  DEFAULT (''),
	tbl_campocodigo varchar(50) NOT NULL CONSTRAINT DF_Tabla_tbl_campoAlias  DEFAULT (''),
	tbl_sqlHelp varchar(5000) NOT NULL CONSTRAINT DF_Tabla_tbl_sqlHelp  DEFAULT (''),
	tbl_sqlSearch varchar(5000) NOT NULL CONSTRAINT DF_Tabla_tbl_sqlSearch  DEFAULT (''),
	tbl_tieneArbol smallint NOT NULL CONSTRAINT DF_Tabla_tbl_tieneArbol  DEFAULT (0),
	tbl_tieneActivo smallint NOT NULL CONSTRAINT DF_Tabla_tbl_tieneActivo  DEFAULT (1),
	tbl_campoNombre varchar(50) NOT NULL CONSTRAINT DF_Tabla_tbl_campoNombre  DEFAULT (''),
	tbl_camposInView varchar(5000) NOT NULL CONSTRAINT DF_Tabla_tbl_camposInView  DEFAULT (''),
	tbl_where varchar(255) NOT NULL CONSTRAINT DF_Tabla_tbl_where  DEFAULT (''),
	tbl_helptop smallint NOT NULL CONSTRAINT DF_Tabla_tbl_helptop  DEFAULT (0),
	tbl_objectEdit varchar(255) NOT NULL CONSTRAINT DF_Tabla_tbl_objectEdit  DEFAULT (''),
	tbl_objectAbm varchar(255) NOT NULL CONSTRAINT DF_Tabla_tbl_objectAbm  DEFAULT (''),
	tbl_spInfo varchar(255) NOT NULL CONSTRAINT DF_Tabla_tbl_spInfo  DEFAULT (''),
	tbl_sqlHelpWeb varchar(1000) NOT NULL CONSTRAINT DF_Tabla_tbl_sqlHelpWeb  DEFAULT (''),
	modificado timestamptz NOT NULL CONSTRAINT DF__tabla__modificad__4F73AB8D  DEFAULT (getdate()),
	tbl_sqlHelpCliente varchar(5000) NOT NULL CONSTRAINT DF_Tabla_tbl_sqlHelp1  DEFAULT (''),
	tbl_camposInViewCliente varchar(5000) NOT NULL CONSTRAINT DF_Tabla_tbl_camposInView1  DEFAULT (''),
	pre_id int NULL,
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
CREATE TABLE ARBA_Deudores(
	ARBAD_archivo varchar(50) NOT NULL,
	ARBAD_cuit varchar(50) NOT NULL,
	ARBAD_deuda decimal(18, 6) NOT NULL,
	ARBAD_nombre varchar(255) NOT NULL,
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
CREATE TABLE DepartamentoTipo(
	dptot_id int NOT NULL,
	dptot_nombre varchar(255) NOT NULL,
	dptot_codigo varchar(15) NOT NULL,
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
CREATE TABLE AlarmaMailStock(
	almst_id int  NOT NULL,
	almr_id_mail int NOT NULL,
	almst_fecha timestamptz NOT NULL,
	pr_id int NOT NULL,
	depl_id int NULL,
	depf_id int NULL,
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
CREATE TABLE webSeccion(
	ws_id int NOT NULL,
	ws_nombre varchar(255) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_webSeccion_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_webSeccion_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_webSeccion_activo  DEFAULT (1),
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
CREATE TABLE InformeOrders(
	inf_id int NOT NULL,
	winfo_id int NOT NULL,
	winfo_nombre varchar(100) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_InformeOrders_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_InformeOrders_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE InformeGroups(
	inf_id int NOT NULL,
	winfg_id int NOT NULL,
	winfg_nombre varchar(100) NOT NULL,
	winfg_pordefecto smallint NOT NULL CONSTRAINT DF_InformeGroups_winfg_pordefecto  DEFAULT (0),
	creado timestamptz NOT NULL CONSTRAINT DF_InformeGroups_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_InformeGroups_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE EmpleadoFamiliaTipo(
	emft_id int NOT NULL,
	emft_nombre varchar(100) NOT NULL,
	emft_codigo varchar(15) NOT NULL,
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
CREATE TABLE StockProveedorTMP(
	stprovTMP_id int NOT NULL,
	stprov_numero int NOT NULL,
	stprov_nrodoc varchar(50) NOT NULL CONSTRAINT DF_StockProveedorTMP_stprov_nrodoc  DEFAULT (''),
	stprov_descrip varchar(5000) NOT NULL CONSTRAINT DF_StockProveedorTMP_stprov_descrip  DEFAULT (''),
	stprov_fecha timestamptz NOT NULL CONSTRAINT DF_StockProveedorTMP_stprov_fecha  DEFAULT (getdate()),
	stprov_id int NOT NULL,
	prov_id int NULL,
	depl_id_origen int NOT NULL,
	depl_id_destino int NOT NULL,
	suc_id int NOT NULL,
	lgj_id int NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_StockProveedorTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_StockProveedorTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE PedidoFacturaVentaTMP(
	pvTMP_id int NOT NULL CONSTRAINT DF_PedidoFacturaVentaTMP_pvTMP_id  DEFAULT (0),
	fvTMP_id int NOT NULL CONSTRAINT DF_PedidoFacturaVentaTMP_fvTMP_id  DEFAULT (0),
	rvTMP_id int NOT NULL CONSTRAINT DF_PedidoFacturaVentaTMP_rvTMP_id  DEFAULT (0),
	pvfvTMP_id int NOT NULL,
	pvfv_id int NOT NULL,
	pvfv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoFacturaVentaTMP_pvfv_cantidad  DEFAULT (0),
	pvi_id int NOT NULL,
	fvi_id int NOT NULL,
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
CREATE TABLE Escala(
	esc_id int NOT NULL,
	esc_nombre varchar(100) NOT NULL,
	esc_codigo varchar(15) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Escala_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Escala_modificado  DEFAULT (getdate()),
	modifico int NOT NULL CONSTRAINT DF_Escala_modifico  DEFAULT (0),
	activo smallint NOT NULL CONSTRAINT DF_Escala_activo  DEFAULT (1),
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
CREATE TABLE ProductoNumeroSerieServicio(
	prnss_id int NOT NULL,
	prns_codigo4 varchar(255) NOT NULL CONSTRAINT DF_ProductoNumeroSerieServicio_prns_codigo4  DEFAULT (''),
	prns_codigo5 varchar(255) NOT NULL CONSTRAINT DF_ProductoNumeroSerieServicio_prns_codigo5  DEFAULT (''),
	prns_codigo6 varchar(255) NOT NULL CONSTRAINT DF_ProductoNumeroSerieServicio_prns_codigo6  DEFAULT (''),
	prns_codigo7 varchar(255) NOT NULL CONSTRAINT DF_ProductoNumeroSerieServicio_prns_codigo7  DEFAULT (''),
	prns_id_reemplazo int NULL,
	os_id int NULL,
	prp_id int NULL,
	stprov_id int NULL,
	cli_id int NULL,
	cont_id int NULL,
	prov_id int NULL,
	etf_id int NULL,
	tar_id_activa int NULL,
	rv_id int NULL,
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
CREATE TABLE AvisoTipo(
	avt_id int NOT NULL,
	avt_nombre varchar(255) NOT NULL,
	avt_objetoEdicion varchar(255) NOT NULL CONSTRAINT DF_AvisoTipo_avt_objetoEdicion  DEFAULT (''),
	avt_objetoInit varchar(255) NOT NULL CONSTRAINT DF_AvisoTipo_avt_objetoInit  DEFAULT (''),
	avt_spinfo varchar(100) NOT NULL CONSTRAINT DF_AvisoTipo_avt_columnaNombre  DEFAULT (''),
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
CREATE TABLE PresupuestoVentaTMP(
	prvTMP_id int NOT NULL,
	prv_id int NOT NULL,
	prv_numero int NOT NULL,
	prv_nrodoc varchar(50) NOT NULL CONSTRAINT DF_PresupuestoVentaTMP_prv_nrodoc  DEFAULT (''),
	prv_descrip varchar(5000) NOT NULL CONSTRAINT DF_PresupuestoVentaTMP_prv_descrip  DEFAULT (''),
	prv_fecha timestamptz NOT NULL CONSTRAINT DF_PresupuestoVentaTMP_prv_fecha  DEFAULT (getdate()),
	prv_fechaentrega timestamptz NOT NULL CONSTRAINT DF_PresupuestoVentaTMP_prv_fechaentrega  DEFAULT (getdate()),
	prv_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaTMP_prv_subtotal  DEFAULT (0),
	prv_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaTMP_prv_neto  DEFAULT (0),
	prv_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaTMP_prv_impuesto  DEFAULT (0),
	prv_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaTMP_prv_ivarni  DEFAULT (0),
	prv_total decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaTMP_prv_total  DEFAULT (0),
	prv_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaTMP_prv_descuento1  DEFAULT (0),
	prv_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaTMP_prv_descuento2  DEFAULT (0),
	prv_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaTMP_prv_descuento11  DEFAULT (0),
	prv_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaTMP_prv_descuento21  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	cli_id int NOT NULL,
	doc_id int NOT NULL,
	lp_id int NULL,
	ld_id int NULL,
	cpg_id int NOT NULL,
	ccos_id int NULL,
	ven_id int NULL,
	lgj_id int NULL,
	pro_id_origen int NULL,
	pro_id_destino int NULL,
	trans_id int NULL,
	clis_id int NULL,
	prov_id int NULL,
	cont_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_PresupuestoVentaTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_PresupuestoVentaTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE Encuesta(
	ec_id int NOT NULL,
	ec_nombre varchar(255) NOT NULL,
	ec_FechaDesde timestamptz NOT NULL CONSTRAINT DF_Encuesta_ec_FechaDesde  DEFAULT (getdate()),
	ec_FechaHasta timestamptz NOT NULL CONSTRAINT DF_Encuesta_ec_FechaHasta  DEFAULT (getdate()),
	ec_anonimo smallint NOT NULL CONSTRAINT DF_Encuesta_ec_permiteAnonimo  DEFAULT (0),
	ec_descrip varchar(255) NOT NULL CONSTRAINT DF_Encuesta_ec_descrip  DEFAULT (''),
	modificado timestamptz NOT NULL CONSTRAINT DF_Encuesta_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Encuesta_activo  DEFAULT (1),
	creado timestamptz NOT NULL CONSTRAINT DF_Encuesta_creado  DEFAULT (getdate()),
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
CREATE TABLE CashFlow(
	cf_id int NOT NULL,
	cf_nombre varchar(255) NOT NULL,
	cf_fecha timestamptz NOT NULL,
	cf_descrip varchar(5000) NOT NULL,
	cf_fechadesde timestamptz NOT NULL,
	cf_fechahasta timestamptz NOT NULL,
	cf_fechacheque smallint NOT NULL,
	cf_fv smallint NOT NULL,
	cf_rv smallint NOT NULL,
	cf_pv smallint NOT NULL,
	cf_fc smallint NOT NULL,
	cf_rc smallint NOT NULL,
	cf_oc smallint NOT NULL,
	cue_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_CashFlow_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_CashFlow_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE Zona(
	zon_id int NOT NULL,
	zon_nombre varchar(100) NOT NULL,
	zon_descrip varchar(255) NOT NULL CONSTRAINT DF_Zona_zon_descrip  DEFAULT (''),
	zon_codigo varchar(15) NOT NULL,
	zon_precio decimal(18, 6) NOT NULL CONSTRAINT DF_Zona_zon_precio  DEFAULT (0),
	pr_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Zona_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Zona_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Zona_activo  DEFAULT (0),
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
CREATE TABLE Mail(
	mail_id int NOT NULL,
	mail_nombre varchar(100) NOT NULL,
	mail_codigo varchar(15) NOT NULL,
	mail_descrip varchar(255) NOT NULL CONSTRAINT DF_Mail_mail_descrip  DEFAULT (''),
	mail_emailTo varchar(1000) NOT NULL,
	mail_emailCc varchar(1000) NOT NULL CONSTRAINT DF_Mail_mail_emailCc  DEFAULT (''),
	mail_tipo smallint NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Mail_activo  DEFAULT (1),
	creado timestamptz NOT NULL CONSTRAINT DF_Mail_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Mail_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE IdAsiento(
	Id_Tabla varchar(50) NOT NULL,
	Id_NextId int NOT NULL,
	Id_CampoId varchar(50) NOT NULL,
	Id_Rango int NOT NULL CONSTRAINT DF_IdAsiento_Id_Rango  DEFAULT (0)
) 
;

;
/****** Object:  Table OrdenServicioTMP    Script Date: 07/30/2012 17:19:35 ******/

;

;

;
CREATE TABLE OrdenServicioTMP(
	osTMP_id int NOT NULL,
	os_id int NOT NULL,
	os_numero int NOT NULL,
	os_nrodoc varchar(50) NOT NULL CONSTRAINT DF_OrdenServicioTMP_os_nrodoc  DEFAULT (''),
	os_descrip varchar(5000) NOT NULL CONSTRAINT DF_OrdenServicioTMP_os_descrip  DEFAULT (''),
	os_fecha timestamptz NOT NULL CONSTRAINT DF_OrdenServicioTMP_os_fecha  DEFAULT (getdate()),
	os_hora smallint NOT NULL CONSTRAINT DF_OrdenServicioTMP_os_hora  DEFAULT (0),
	os_fechaentrega timestamptz NOT NULL CONSTRAINT DF_OrdenServicioTMP_os_fechaentrega  DEFAULT (getdate()),
	os_neto decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioTMP_os_neto  DEFAULT (0),
	os_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioTMP_os_ivari  DEFAULT (0),
	os_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioTMP_os_ivarni  DEFAULT (0),
	os_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioTMP_os_subtotal  DEFAULT (0),
	os_total decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioTMP_os_total  DEFAULT (0),
	os_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioTMP_os_descuento1  DEFAULT (0),
	os_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioTMP_os_descuento2  DEFAULT (0),
	os_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioTMP_os_importedesc1  DEFAULT (0),
	os_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioTMP_os_importedesc2  DEFAULT (0),
	os_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioTMP_os_cotizacion  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	cli_id int NOT NULL,
	clis_id int NULL,
	cont_id int NULL,
	doc_id int NOT NULL,
	proy_id int NULL,
	lp_id int NULL,
	ld_id int NULL,
	lgj_id int NULL,
	cpg_id int NULL,
	ccos_id int NULL,
	st_id int NULL,
	us_id_tecnico int NULL,
	depl_id int NULL,
	prio_id int NULL,
	inct_id int NULL,
	inca_id int NULL,
	zon_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_OrdenServicioTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_OrdenServicioTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE CentroCosto(
	ccos_id int NOT NULL,
	ccos_nombre varchar(100) NOT NULL,
	ccos_codigo varchar(15) NOT NULL,
	ccos_descrip varchar(255) NOT NULL CONSTRAINT DF_CentroCosto_ccos_descripcion  DEFAULT (''),
	ccos_compra smallint NOT NULL CONSTRAINT DF_CentroCosto_ccos_compra  DEFAULT (0),
	ccos_venta smallint NOT NULL CONSTRAINT DF_CentroCosto_ccos_venta  DEFAULT (0),
	ccos_id_padre int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_CentroCosto_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_CentroCosto_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_CentroCosto_activo  DEFAULT (1),
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
CREATE TABLE OrdenFacturaCompra(
	ocfc_id int NOT NULL,
	ocfc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenFacturaCompra_ocfc_cantidad  DEFAULT (0),
	oci_id int NOT NULL,
	fci_id int NOT NULL,
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
CREATE TABLE IdStock(
	Id_Tabla varchar(50) NOT NULL,
	Id_NextId int NOT NULL,
	Id_CampoId varchar(50) NOT NULL,
	Id_Rango int NOT NULL CONSTRAINT DF_IdStock_Id_Rango  DEFAULT (0)
) 
;

;
/****** Object:  Table CatalogoWebProductoTag    Script Date: 07/30/2012 17:04:28 ******/

;

;
CREATE TABLE CatalogoWebProductoTag(
	catw_id int NOT NULL,
	prt_id int NOT NULL,
 CONSTRAINT PK_CatalogoWebProductoTag PRIMARY KEY  
(
	catw_id ,
	prt_id 
) 
) 
;
/****** Object:  Table OrdenFacturaCompraTMP    Script Date: 07/30/2012 17:18:13 ******/

;

;
CREATE TABLE OrdenFacturaCompraTMP(
	ocTMP_id int NOT NULL CONSTRAINT DF_OrdenFacturaCompraTMP_ocTMP_id  DEFAULT (0),
	fcTMP_id int NOT NULL CONSTRAINT DF_OrdenFacturaCompraTMP_fcTMP_id  DEFAULT (0),
	ocfcTMP_id int NOT NULL,
	ocfc_id int NOT NULL,
	ocfc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenFacturaCompraTMP_ocfc_cantidad  DEFAULT (0),
	oci_id int NOT NULL,
	fci_id int NOT NULL,
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
CREATE TABLE PermisoEmbarqueTMP(
	pembTMP_id int NOT NULL,
	pemb_id int NOT NULL,
	pemb_numero int NOT NULL,
	pemb_nrodoc varchar(100) NOT NULL CONSTRAINT DF_PermisoEmbarqueTMP_pemb_nrodoc  DEFAULT (''),
	pemb_descrip varchar(255) NOT NULL CONSTRAINT DF_PermisoEmbarqueTMP_pemb_descrip  DEFAULT (''),
	pemb_fecha timestamptz NOT NULL,
	pemb_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_PermisoEmbarqueTMP_pemb_cotizacion  DEFAULT (0),
	pemb_total decimal(18, 6) NOT NULL CONSTRAINT DF_PermisoEmbarqueTMP_pemb_total  DEFAULT (0),
	pemb_totalorigen decimal(18, 6) NOT NULL CONSTRAINT DF_PermisoEmbarqueTMP_pemb_totalorigen  DEFAULT (0),
	pemb_firmado int NOT NULL CONSTRAINT DF_PermisoEmbarqueTMP_pemb_firmado  DEFAULT (0),
	pemb_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PermisoEmbarqueTMP_pemb_pendiente  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	emb_id int NOT NULL,
	bco_id int NOT NULL,
	adu_id int NOT NULL,
	lp_id int NULL,
	lgj_id int NULL,
	ccos_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_PermisoEmbarqueTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_PermisoEmbarqueTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE DocumentoGrupo(
	docg_id int NOT NULL,
	docg_nombre varchar(100) NOT NULL,
	docg_codigo varchar(15) NOT NULL,
	docg_descrip varchar(255) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_DocumentoGrupo_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_DocumentoGrupo_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_DocumentoGrupo_activo  DEFAULT (1),
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
CREATE TABLE OrdenRemitoCompraTMP(
	ocTMP_id int NOT NULL CONSTRAINT DF_OrdenRemitoCompraTMP_ocTMP_id  DEFAULT (0),
	rcTMP_id int NOT NULL CONSTRAINT DF_OrdenRemitoCompraTMP_rcTMP_id  DEFAULT (0),
	ocrcTMP_id int NOT NULL,
	ocrc_id int NOT NULL,
	ocrc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenRemitoCompraTMP_ocrc_cantidad  DEFAULT (0),
	oci_id int NOT NULL,
	rci_id int NOT NULL,
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
CREATE TABLE EjercicioAsientoResumen(
	ejc_id int NOT NULL,
	ejcas_id int NOT NULL,
	ejcas_fecha timestamptz NOT NULL,
	ejcas_nrodoc varchar(50) NOT NULL,
	ejcas_tipo smallint NOT NULL,
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
CREATE TABLE NivelEstudio(
	nive_id int NOT NULL,
	nive_nombre varchar(100) NOT NULL,
	nive_codigo varchar(15) NOT NULL,
	nive_descrip varchar(255) NOT NULL CONSTRAINT DF_NivelEstudio_nive_descrip  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_NivelEstudio_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_NivelEstudio_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_NivelEstudio_activo  DEFAULT (1),
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
CREATE TABLE LiquidacionItem(
	liq_id int NOT NULL,
	liqi_id int NOT NULL,
	liqi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_LiquidacionItem_liqi_importe  DEFAULT (0),
	liqi_importeorigen decimal(18, 6) NOT NULL CONSTRAINT DF_LiquidacionItem_liqi_importeorigen  DEFAULT (0),
	liqi_impuesto decimal(18, 6) NOT NULL CONSTRAINT DF_LiquidacionItem_liqi_impuesto  DEFAULT (0),
	liqi_descrip varchar(5000) NOT NULL CONSTRAINT DF_LiquidacionItem_liqi_descrip  DEFAULT (''),
	liqi_orden smallint NOT NULL,
	liqi_nrodoc varchar(50) NOT NULL CONSTRAINT DF_LiquidacionItem_liqi_nrodoc  DEFAULT (''),
	em_id int NOT NULL,
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
CREATE TABLE ImportacionTempTMP(
	imptTMP_id int NOT NULL,
	impt_id int NOT NULL,
	impt_numero int NOT NULL,
	impt_nrodoc varchar(50) NOT NULL CONSTRAINT DF_ImportacionTempTMP_impt_nrodoc  DEFAULT (''),
	impt_despachonro varchar(50) NOT NULL CONSTRAINT DF_ImportacionTempTMP_impt_despachonro  DEFAULT (''),
	impt_descrip varchar(5000) NOT NULL CONSTRAINT DF_ImportacionTempTMP_impt_descrip  DEFAULT (''),
	impt_fecha timestamptz NOT NULL CONSTRAINT DF_ImportacionTempTMP_impt_fecha  DEFAULT (getdate()),
	impt_fechaentrega timestamptz NOT NULL CONSTRAINT DF_ImportacionTempTMP_impt_fechaentrega  DEFAULT (getdate()),
	impt_fechaoficial timestamptz NOT NULL CONSTRAINT DF_ImportacionTempTMP_impt_fechaoficial  DEFAULT (getdate()),
	impt_neto decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempTMP_impt_neto  DEFAULT (0),
	impt_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempTMP_impt_ivari  DEFAULT (0),
	impt_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempTMP_impt_ivarni  DEFAULT (0),
	impt_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempTMP_impt_subtotal  DEFAULT (0),
	impt_total decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempTMP_impt_total  DEFAULT (0),
	impt_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempTMP_impt_descuento1  DEFAULT (0),
	impt_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempTMP_impt_descuento2  DEFAULT (0),
	impt_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempTMP_impt_importedesc1  DEFAULT (0),
	impt_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempTMP_impt_importedesc2  DEFAULT (0),
	impt_seguro decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempTMP_impt_seguro  DEFAULT (0),
	impt_flete decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempTMP_impt_flete  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	prov_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	lp_id int NULL,
	ld_id int NULL,
	lgj_id int NULL,
	cpg_id int NULL,
	ccos_id int NULL,
	st_id int NULL,
	depl_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ImportacionTempTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ImportacionTempTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE PackingListTMP(
	pklstTMP_id int NOT NULL,
	pklst_id int NOT NULL,
	pklst_numero int NOT NULL,
	pklst_nrodoc varchar(20) NOT NULL CONSTRAINT DF_PackingListTMP_pklst_nrodoc  DEFAULT (''),
	pklst_fecha timestamptz NOT NULL CONSTRAINT DF_PackingListTMP_pklst_fecha  DEFAULT (getdate()),
	pklst_fechaentrega timestamptz NOT NULL CONSTRAINT DF_PackingListTMP_pklst_fechaentrega  DEFAULT (getdate()),
	pklst_cantidad int NOT NULL CONSTRAINT DF_PackingListTMP_pklst_cantidad  DEFAULT (0),
	pklst_pallets int NOT NULL CONSTRAINT DF_PackingListTMP_pklst_pallet  DEFAULT (0),
	pklst_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListTMP_pklst_pendiente  DEFAULT (0),
	pklst_descrip varchar(255) NOT NULL CONSTRAINT DF_PackingListTMP_pklst_descrip  DEFAULT (''),
	pklst_marca varchar(255) NOT NULL CONSTRAINT DF_PackingListTMP_pklst_marca  DEFAULT (''),
	pklst_firmado int NOT NULL CONSTRAINT DF_PackingListTMP_pklst_firmado  DEFAULT (0),
	pklst_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListTMP_pklst_neto  DEFAULT (0),
	pklst_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListTMP_pklst_ivari  DEFAULT (0),
	pklst_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListTMP_pklst_ivarni  DEFAULT (0),
	pklst_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListTMP_pklst_subtotal  DEFAULT (0),
	pklst_total decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListTMP_pklst_total  DEFAULT (0),
	pklst_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListTMP_pklst_descuento1  DEFAULT (0),
	pklst_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListTMP_pklst_descuento2  DEFAULT (0),
	pklst_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListTMP_pklst_importedesc1  DEFAULT (0),
	pklst_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListTMP_pklst_importedesc2  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	doc_id int NOT NULL,
	ccos_id int NULL,
	cli_id int NOT NULL,
	barc_id int NULL,
	pue_id_origen int NULL,
	pue_id_destino int NULL,
	lp_id int NULL,
	ld_id int NULL,
	lgj_id int NULL,
	cpg_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_PackingListTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_PackingListTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE ParteReparacionTMP(
	prpTMP_id int NOT NULL,
	prp_id int NOT NULL,
	prp_numero int NOT NULL,
	prp_nrodoc varchar(50) NOT NULL CONSTRAINT DF_ParteReparacionTMP_prp_nrodoc  DEFAULT (''),
	prp_descrip varchar(5000) NOT NULL CONSTRAINT DF_ParteReparacionTMP_prp_descrip  DEFAULT (''),
	prp_fecha timestamptz NOT NULL CONSTRAINT DF_ParteReparacionTMP_prp_fecha  DEFAULT (getdate()),
	prp_fechaentrega timestamptz NOT NULL CONSTRAINT DF_ParteReparacionTMP_prp_fechaentrega  DEFAULT (getdate()),
	prp_neto decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionTMP_prp_neto  DEFAULT (0),
	prp_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionTMP_prp_ivari  DEFAULT (0),
	prp_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionTMP_prp_ivarni  DEFAULT (0),
	prp_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionTMP_prp_subtotal  DEFAULT (0),
	prp_total decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionTMP_prp_total  DEFAULT (0),
	prp_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionTMP_prp_descuento1  DEFAULT (0),
	prp_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionTMP_prp_descuento2  DEFAULT (0),
	prp_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionTMP_prp_importedesc1  DEFAULT (0),
	prp_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionTMP_prp_importedesc2  DEFAULT (0),
	prp_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionTMP_prp_cotizacion  DEFAULT (0),
	prp_tipo smallint NOT NULL CONSTRAINT DF_ParteReparacionTMP_prp_tipo  DEFAULT (1),
	prp_estado smallint NOT NULL CONSTRAINT DF_ParteReparacionTMP_prp_aprobado  DEFAULT (1),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	cli_id int NOT NULL,
	doc_id int NOT NULL,
	prns_id int NOT NULL,
	lp_id int NULL,
	ld_id int NULL,
	lgj_id int NULL,
	cpg_id int NULL,
	ccos_id int NULL,
	st_id int NULL,
	depl_id int NULL,
	us_id int NULL,
	clis_id int NULL,
	cont_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ParteReparacionTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ParteReparacionTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE Estado(
	est_id int NOT NULL,
	est_nombre varchar(100) NOT NULL CONSTRAINT DF_Estado_est_nombre  DEFAULT (''),
	est_codigo varchar(50) NOT NULL CONSTRAINT DF_Estado_est_alias  DEFAULT (''),
	est_descrip varchar(100) NOT NULL CONSTRAINT DF_Estado_est_descrip  DEFAULT (''),
	creado timestamptz NOT NULL,
	modificado timestamptz NOT NULL,
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Estado_activo  DEFAULT (1),
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
CREATE TABLE ImportacionIDTipo(
	impidt_id int NOT NULL,
	impidt_nombre varchar(255) NOT NULL,
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
CREATE TABLE FacturaElectronica(
	fvfe_id int NOT NULL,
	fv_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_FacturaElectronica_creado  DEFAULT (getdate()),
	fvfe_rechazado smallint NOT NULL DEFAULT (0),
	fvfe_procesado smallint NOT NULL DEFAULT (0),
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
CREATE TABLE Profesion(
	profe_id int NOT NULL,
	profe_nombre varchar(100) NOT NULL,
	profe_codigo varchar(15) NOT NULL,
	profe_descrip varchar(255) NOT NULL CONSTRAINT DF_Profesion_profe_descrip  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_Profesion_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Profesion_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Profesion_activo  DEFAULT (1),
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
CREATE TABLE EmpleadoART(
	ema_id int NOT NULL,
	ema_nombre varchar(100) NOT NULL,
	ema_codigo varchar(15) NOT NULL,
	ema_descrip varchar(5000) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_EmpleadoAseguradora_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_EmpleadoAseguradora_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_EmpleadoAseguradora_activo  DEFAULT (1),
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
CREATE TABLE PedidoOrdenCompraTMP(
	pcTMP_id int NOT NULL CONSTRAINT DF_PedidoOrdenCompraTMP_pcTMP_id  DEFAULT (0),
	ocTMP_id int NOT NULL CONSTRAINT DF_PedidoOrdenCompraTMP_ocTMP_id  DEFAULT (0),
	pcocTMP_id int NOT NULL,
	pcoc_id int NOT NULL,
	pcoc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoOrdenCompraTMP_pcoc_cantidad  DEFAULT (0),
	pci_id int NOT NULL,
	oci_id int NOT NULL,
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
CREATE TABLE Clearing(
	cle_id int NOT NULL,
	cle_nombre varchar(100) NOT NULL,
	cle_codigo varchar(15) NOT NULL,
	cle_descrip varchar(255) NOT NULL CONSTRAINT DF_Clearing_cle_descripcion  DEFAULT (''),
	cle_dias int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Clearing_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Clearing_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Clearing_activo  DEFAULT (1),
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
CREATE TABLE sysModuloUser(
	us_id int NOT NULL,
	sysm_id int NOT NULL,
 CONSTRAINT PK_sysModuloUser PRIMARY KEY  
(
	us_id ,
	sysm_id 
) 
) 
;
/****** Object:  Table ProductoHelpConfig    Script Date: 07/30/2012 17:25:56 ******/

;

;

;
CREATE TABLE ProductoHelpConfig(
	prhc_id int NOT NULL,
	prhc_nombre varchar(100) NOT NULL CONSTRAINT DF_ProductoHelpConfig_prhc_nombre  DEFAULT (''),
	prhc_tecla varchar(255) NOT NULL,
	prhc_atributo_indice smallint NOT NULL,
	prhc_valor_codigo varchar(255) NOT NULL,
	prhc_descrip varchar(255) NOT NULL CONSTRAINT DF_ProductoHelpConfig_prhc_descrip  DEFAULT (''),
	prhc_default smallint NOT NULL CONSTRAINT DF_ProductoHelpConfig_prhc_default  DEFAULT (0),
	prhc_defaultsrv smallint NOT NULL CONSTRAINT DF_ProductoHelpConfig_prhc_defaultsrv  DEFAULT (0),
	prhc_defaultprp smallint NOT NULL CONSTRAINT DF_ProductoHelpConfig_prhc_defaultprp  DEFAULT (0),
	prhc_defaultprns smallint NOT NULL CONSTRAINT DF_ProductoHelpConfig_prhc_defaultprns  DEFAULT (0),
	modificado timestamptz NOT NULL CONSTRAINT DF_ProductoHelpConfig_modificado  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_ProductoHelpConfig_creado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_ProductoHelpConfig_activo  DEFAULT (1),
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
CREATE TABLE DepositoBancoTMP(
	dbcoTMP_id int NOT NULL,
	dbco_id int NOT NULL,
	dbco_numero int NOT NULL,
	dbco_nrodoc varchar(50) NOT NULL CONSTRAINT DF_DepositoBancoTMP_dbco_nrodoc_1  DEFAULT (''),
	dbco_descrip varchar(5000) NOT NULL CONSTRAINT DF_DepositoBancoTMP_dbco_descrip_1  DEFAULT (''),
	dbco_fecha timestamptz NOT NULL CONSTRAINT DF_DepositoBancoTMP_dbco_fecha_1  DEFAULT (getdate()),
	dbco_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_DepositoBancoTMP_dbco_cotizacion_1  DEFAULT (0),
	dbco_total decimal(18, 6) NOT NULL CONSTRAINT DF_DepositoBancoTMP_dbco_total_1  DEFAULT (0),
	dbco_totalorigen decimal(18, 6) NOT NULL CONSTRAINT DF_DepositoBancoTMP_dbco_totalorigen_1  DEFAULT (0),
	dbco_firmado int NOT NULL CONSTRAINT DF_DepositoBancoTMP_dbco_firmado_1  DEFAULT (0),
	dbco_grabarasiento smallint NOT NULL CONSTRAINT DF_DepositoBancoTMP_dbco_grabarasiento_1  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	doc_id int NOT NULL,
	bco_id int NOT NULL,
	cue_id int NOT NULL,
	as_id int NULL,
	lgj_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_DepositoBancoTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_DepositoBancoTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE LiquidacionItemTMP(
	liqTMP_id int NOT NULL,
	liqiTMP_id int NOT NULL,
	liqi_id int NOT NULL,
	liqi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_LiquidacionItemTMP_liqi_importe  DEFAULT (0),
	liqi_importeorigen decimal(18, 6) NOT NULL CONSTRAINT DF_LiquidacionItemTMP_liqi_importeorigen  DEFAULT (0),
	liqi_impuesto decimal(18, 6) NOT NULL CONSTRAINT DF_LiquidacionItemTMP_liqi_impuesto  DEFAULT (0),
	liqi_descrip varchar(5000) NOT NULL CONSTRAINT DF_LiquidacionItemTMP_liqi_descrip  DEFAULT (''),
	liqi_orden smallint NOT NULL,
	liqi_nrodoc varchar(50) NOT NULL CONSTRAINT DF_LiquidacionItemTMP_liqi_nrodoc  DEFAULT (''),
	em_id int NOT NULL,
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
CREATE TABLE EmpleadoEspecialidad(
	eme_id int NOT NULL,
	eme_nombre varchar(100) NOT NULL,
	eme_codigo varchar(15) NOT NULL,
	eme_descrip varchar(5000) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_EmpleadoEspecialidad_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_EmpleadoEspecialidad_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_EmpleadoEspecialidad_activo  DEFAULT (1),
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
CREATE TABLE IncidenteTipo(
	inct_id int NOT NULL,
	inct_nombre varchar(50) NOT NULL,
	inct_codigo varchar(15) NOT NULL,
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
CREATE TABLE OrdenPagoAsiento(
	opg_id int NOT NULL,
	opg_fecha timestamptz NOT NULL,
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
CREATE TABLE ProductoBOMItemTipo(
	pbmit_id int NOT NULL,
	pbmit_nombre varchar(50) NOT NULL,
	pbmit_codigo varchar(15) NOT NULL,
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
CREATE TABLE ManifiestoPackingListTMP(
	pklstTMP_id int NOT NULL CONSTRAINT DF_ManifiestoPackingListTMP_pklstTMP_id  DEFAULT (0),
	mfcTMP_id int NOT NULL CONSTRAINT DF_ManifiestoPackingListTMP_mfcTMP_id  DEFAULT (0),
	mfcpklstTMP_id int NOT NULL,
	mfcpklst_id int NOT NULL,
	mfcpklst_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoPackingListTMP_mfcpklst_cantidad  DEFAULT (0),
	mfci_id int NOT NULL,
	pklsti_id int NOT NULL,
 CONSTRAINT PK_ManifiestoPackingListTMP PRIMARY KEY  
(
	mfcpklstTMP_id 
) 
) 
;
/****** Object:  Table ResolucionCuponAsiento    Script Date: 07/30/2012 17:29:13 ******/

;

;
CREATE TABLE ResolucionCuponAsiento(
	rcup_id int NOT NULL,
	rcup_fecha timestamptz NOT NULL,
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
CREATE TABLE Id(
	Id_Tabla varchar(50) NOT NULL,
	Id_NextId int NOT NULL,
	Id_CampoId varchar(50) NOT NULL,
	Id_Rango int NOT NULL CONSTRAINT DF_Id_Id_Rango  DEFAULT (0)
) 
;

;
/****** Object:  Table Sindicato    Script Date: 07/30/2012 17:29:50 ******/

;

;

;
CREATE TABLE Sindicato(
	sind_id int NOT NULL,
	sind_nombre varchar(100) NOT NULL,
	sind_codigo varchar(15) NOT NULL,
	sind_descrip varchar(255) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Sindicato_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Sindicato_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Sindicato_activo  DEFAULT (1),
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
CREATE TABLE FacturaElectronicaConsulta(
	fvfec_id int NOT NULL,
	fvfec_ptovta smallint NOT NULL,
	fvfec_cuit varchar(50) NOT NULL,
	fvfec_numero int NOT NULL,
	fvfec_tipdoc smallint NOT NULL,
	fvfec_respuesta varchar(8000) NOT NULL CONSTRAINT DF_FacturaElectronicaConsulta_fvfec_respuesta  DEFAULT (''),
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
CREATE TABLE FechaControlAcceso(
	fca_id int NOT NULL,
	fca_nombre varchar(100) NOT NULL CONSTRAINT DF_FechaControlAcceso_fca_nombre  DEFAULT (''),
	fca_codigo varchar(15) NOT NULL CONSTRAINT DF_FechaControlAcceso_fca_alias  DEFAULT (''),
	fca_fechadesde timestamptz NOT NULL CONSTRAINT DF_FechaControlAcceso_fca_fecha  DEFAULT (getdate()),
	fca_fechahasta timestamptz NOT NULL CONSTRAINT DF_FechaControlAcceso_fca_fecha1  DEFAULT (getdate()),
	activo smallint NOT NULL CONSTRAINT DF_FechaControlAcceso_activo  DEFAULT (1),
	creado timestamptz NOT NULL CONSTRAINT DF_FechaControlAcceso_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_FechaControlAcceso_modificado  DEFAULT (getdate()),
	modifico int NOT NULL CONSTRAINT DF_FechaControlAcceso_modifico  DEFAULT (0),
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
CREATE TABLE MovimientoFondoAsiento(
	mf_id int NOT NULL,
	mf_fecha timestamptz NOT NULL,
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
CREATE TABLE CotizacionCompraTMP(
	cotTMP_id int NOT NULL,
	cot_id int NOT NULL,
	cot_numero int NOT NULL,
	cot_nrodoc varchar(50) NOT NULL CONSTRAINT DF_CotizacionCompraTMP_cot_nrodoc  DEFAULT (''),
	cot_descrip varchar(5000) NOT NULL CONSTRAINT DF_CotizacionCompraTMP_cot_descrip  DEFAULT (''),
	cot_fecha timestamptz NOT NULL CONSTRAINT DF_CotizacionCompraTMP_cot_fecha  DEFAULT (getdate()),
	cot_fechaentrega timestamptz NOT NULL CONSTRAINT DF_CotizacionCompraTMP_cot_fechaentrega  DEFAULT (getdate()),
	cot_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraTMP_cot_subtotal  DEFAULT (0),
	cot_neto decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraTMP_cot_neto  DEFAULT (0),
	cot_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraTMP_cot_impuesto  DEFAULT (0),
	cot_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraTMP_cot_ivarni  DEFAULT (0),
	cot_total decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraTMP_cot_total  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	lp_id int NULL,
	cpg_id int NOT NULL,
	ccos_id int NULL,
	us_id int NULL,
	lgj_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_CotizacionCompraTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_CotizacionCompraTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE ProductoNumeroSerieHistoria(
	prnsh_id int NOT NULL,
	prns_id int NOT NULL,
	prns_codigo2 varchar(100) NOT NULL CONSTRAINT DF_ProductoNumeroSerieHistoria_prns_codigo2  DEFAULT (''),
	prns_codigo3 varchar(100) NOT NULL CONSTRAINT DF_ProductoNumeroSerieHistoria_prns_codigo3  DEFAULT (''),
	prns_codigo4 varchar(255) NOT NULL CONSTRAINT DF_ProductoNumeroSerieHistoria_prns_codigo4  DEFAULT (''),
	prns_codigo5 varchar(255) NOT NULL CONSTRAINT DF_ProductoNumeroSerieHistoria_prns_codigo5  DEFAULT (''),
	prns_codigo6 varchar(255) NOT NULL CONSTRAINT DF_ProductoNumeroSerieHistoria_prns_codigo6  DEFAULT (''),
	prns_codigo7 varchar(255) NOT NULL CONSTRAINT DF_ProductoNumeroSerieHistoria_prns_codigo7  DEFAULT (''),
	prns_fechavto timestamptz NOT NULL CONSTRAINT DF_ProductoNumeroSerieHistoria_prns_fechavto  DEFAULT (getdate()),
	prns_descrip varchar(255) NOT NULL CONSTRAINT DF_ProductoNumeroSerieHistoria_prns_descrip  DEFAULT (''),
	tar_id int NULL,
	tar_id_activa int NULL,
	os_id int NULL,
	prp_id int NULL,
	stprov_id int NULL,
	cli_id int NULL,
	cont_id int NULL,
	prov_id int NULL,
	etf_id int NULL,
	tar_id_activa1 int NULL,
	rv_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ProductoNumeroSerieHistoria_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ProductoNumeroSerieHistoria_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE PresupuestoDevolucionVentaTMP(
	prvTMP_id int NOT NULL,
	prvdvTMP_id int NOT NULL,
	prvdv_id int NOT NULL,
	prvdv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoDevolucionVenta_prvdv_cantidad  DEFAULT (0),
	prvi_id_Presupuesto int NOT NULL,
	prvi_id_devolucion int NOT NULL,
 CONSTRAINT PK_PresupuestoDevolucionVenta PRIMARY KEY  
(
	prvdvTMP_id 
) 
) 
;
/****** Object:  Table RemitoFacturaVentaTMP    Script Date: 07/30/2012 17:28:22 ******/

;

;
CREATE TABLE RemitoFacturaVentaTMP(
	fvTMP_id int NOT NULL CONSTRAINT DF_RemitoFacturaVentaTMP_fvTMP_id  DEFAULT (0),
	rvTMP_id int NOT NULL CONSTRAINT DF_RemitoFacturaVentaTMP_rvTMP_id  DEFAULT (0),
	rvfvTMP_id int NOT NULL,
	rvfv_id int NOT NULL,
	rvfv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaFacturaTMP_rvfv_cantidad  DEFAULT (0),
	rvi_id int NOT NULL CONSTRAINT DF_RemitoFacturaVentaTMP_rvi_id  DEFAULT (0),
	fvi_id int NOT NULL CONSTRAINT DF_RemitoFacturaVentaTMP_fvi_id  DEFAULT (0),
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
CREATE TABLE ResolucionCuponTMP(
	rcupTMP_id int NOT NULL,
	rcup_id int NOT NULL,
	rcup_numero int NOT NULL,
	rcup_nrodoc varchar(50) NOT NULL CONSTRAINT DF_ResolucionCuponTMP_rcup_nrodoc_1  DEFAULT (''),
	rcup_descrip varchar(5000) NOT NULL CONSTRAINT DF_ResolucionCuponTMP_rcup_descrip_1  DEFAULT (''),
	rcup_fecha timestamptz NOT NULL CONSTRAINT DF_ResolucionCuponTMP_rcup_fecha_1  DEFAULT (getdate()),
	rcup_total decimal(18, 6) NOT NULL CONSTRAINT DF_ResolucionCuponTMP_rcup_total_1  DEFAULT (0),
	rcup_firmado int NOT NULL CONSTRAINT DF_ResolucionCuponTMP_rcup_firmado_1  DEFAULT (0),
	rcup_grabarasiento smallint NOT NULL CONSTRAINT DF_ResolucionCuponTMP_rcup_grabarasiento_1  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	doc_id int NOT NULL,
	as_id int NULL,
	lgj_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ResolucionCuponTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ResolucionCuponTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE HistoriaOperacion(
	hsto_id int NOT NULL,
	tbl_id int NOT NULL,
	hsto_nombre varchar(5000) NOT NULL,
 CONSTRAINT PK_HistoriaOperacion PRIMARY KEY  
(
	hsto_id ,
	tbl_id 
) 
) 
;

;
/****** Object:  Table RemitoCompraTMP    Script Date: 07/30/2012 17:28:11 ******/

;

;

;
CREATE TABLE RemitoCompraTMP(
	rcTMP_id int NOT NULL,
	rc_id int NOT NULL,
	rc_numero int NOT NULL,
	rc_nrodoc varchar(50) NOT NULL CONSTRAINT DF_RemitoCompraTMP_rc_nrodoc  DEFAULT (''),
	rc_descrip varchar(5000) NOT NULL CONSTRAINT DF_RemitoCompraTMP_rc_descrip  DEFAULT (''),
	rc_fecha timestamptz NOT NULL CONSTRAINT DF_RemitoCompraTMP_rc_fecha  DEFAULT (getdate()),
	rc_fechaentrega timestamptz NOT NULL CONSTRAINT DF_RemitoCompraTMP_rc_fechaentrega  DEFAULT (getdate()),
	rc_neto decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraTMP_rc_neto  DEFAULT (0),
	rc_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraTMP_rc_ivari  DEFAULT (0),
	rc_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraTMP_rc_ivarni  DEFAULT (0),
	rc_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraTMP_rc_subtotal  DEFAULT (0),
	rc_total decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraTMP_rc_total  DEFAULT (0),
	rc_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraTMP_rc_descuento1  DEFAULT (0),
	rc_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraTMP_rc_descuento2  DEFAULT (0),
	rc_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraTMP_rc_importedesc1  DEFAULT (0),
	rc_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraTMP_rc_importedesc2  DEFAULT (0),
	rc_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraTMP_rc_cotizacion  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	prov_id int NOT NULL,
	doc_id int NOT NULL,
	lp_id int NULL,
	ld_id int NULL,
	lgj_id int NULL,
	cpg_id int NULL,
	ccos_id int NULL,
	st_id int NULL,
	depl_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_RemitoCompraTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_RemitoCompraTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE ProductoNumeroSerieAsinc(
	prnsa_id int  NOT NULL,
	prns_id int NOT NULL,
	st_id int NOT NULL,
	prnsa_restar smallint NOT NULL,
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
CREATE TABLE AjusteInflacionItemTipo(
	ajit_id int NOT NULL,
	ajit_nombre varchar(255) NOT NULL CONSTRAINT DF_AjusteInflacionItemTipo_ajit_nombre  DEFAULT (''),
	ajit_codigo varchar(15) NOT NULL CONSTRAINT DF_AjusteInflacionItemTipo_ajit_codigo  DEFAULT (''),
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
CREATE TABLE OrdenCompraTMP(
	ocTMP_id int NOT NULL,
	oc_id int NOT NULL,
	oc_numero int NOT NULL,
	oc_nrodoc varchar(50) NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_nrodoc  DEFAULT (''),
	oc_descrip varchar(5000) NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_descrip  DEFAULT (''),
	oc_fecha timestamptz NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_fecha  DEFAULT (getdate()),
	oc_fechaentrega timestamptz NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_fechaentrega  DEFAULT (getdate()),
	oc_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_subtotal  DEFAULT (0),
	oc_neto decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_neto  DEFAULT (0),
	oc_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_impuesto  DEFAULT (0),
	oc_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_ivarni  DEFAULT (0),
	oc_total decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_total  DEFAULT (0),
	oc_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_descuento1  DEFAULT (0),
	oc_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_descuento2  DEFAULT (0),
	oc_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_descuento11  DEFAULT (0),
	oc_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_descuento21  DEFAULT (0),
	oc_ordencompra varchar(50) NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_ordencompra  DEFAULT (''),
	oc_presupuesto varchar(50) NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_presupuesto  DEFAULT (''),
	oc_maquina varchar(255) NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_maquina  DEFAULT (''),
	oc_maquinanro varchar(50) NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_maquinanro  DEFAULT (''),
	oc_maquinamodelo varchar(50) NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_maquinamodelo  DEFAULT (''),
	oc_fleteaereo smallint NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_fleteaereo  DEFAULT (0),
	oc_fletemaritimo smallint NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_fletemaritimo  DEFAULT (0),
	oc_fletecorreo smallint NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_fletecorreo  DEFAULT (0),
	oc_fletecamion smallint NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_fletecamion  DEFAULT (0),
	oc_fleteotros smallint NOT NULL CONSTRAINT DF_OrdenCompraTMP_oc_fleteotros  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	prov_id int NOT NULL,
	cli_id int NULL,
	doc_id int NOT NULL,
	lp_id int NULL,
	ld_id int NULL,
	cpg_id int NOT NULL,
	ccos_id int NULL,
	lgj_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_OrdenCompraTMP_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_OrdenCompraTMP_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE PedidoCotizacionCompraTMP(
	pcTMP_id int NOT NULL CONSTRAINT DF_PedidoCotizacionCompraTMP_pcTMP_id  DEFAULT (0),
	cotTMP_id int NOT NULL CONSTRAINT DF_PedidoCotizacionCompraTMP_cotTMP_id  DEFAULT (0),
	pccotTMP_id int NOT NULL,
	pccot_id int NOT NULL,
	pccot_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCotizacionCompraTMP_pccot_cantidad  DEFAULT (0),
	pci_id int NOT NULL,
	coti_id int NOT NULL,
 CONSTRAINT PK_PedidoCotizacionCompraTMP PRIMARY KEY  
(
	pccotTMP_id 
) 
) 
;
/****** Object:  Table PedidoRemitoVenta    Script Date: 07/30/2012 17:21:52 ******/

;

;
CREATE TABLE PedidoRemitoVenta(
	pvrv_id int NOT NULL,
	pvrv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoRemitoVenta_pvrv_cantidad  DEFAULT (0),
	pvi_id int NOT NULL,
	rvi_id int NOT NULL,
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
CREATE TABLE PickingListPedidoItem(
	pv_id int NOT NULL,
	pkl_id int NOT NULL,
	pklpv_id int NOT NULL,
	pklpvi_id int NOT NULL,
	pklpvi_orden smallint NOT NULL,
	pklpvi_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PickingListPedidoItem_pklpvi_cantidad  DEFAULT (0),
	pklpvi_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_PickingListPedidoItem_pklpvi_cantidadaremitir  DEFAULT (0),
	pklpvi_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PickingListPedidoItem_pklpvi_pendiente  DEFAULT (0),
	pklpvi_descrip varchar(5000) NOT NULL CONSTRAINT DF_PickingListPedidoItem_pklpvi_descrip  DEFAULT (''),
	pvi_id int NOT NULL,
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
CREATE TABLE PedidoDevolucionVenta(
	pvdv_id int NOT NULL,
	pvdv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoDevolucionVenta_pvdv_cantidad_1  DEFAULT (0),
	pvi_id_pedido int NOT NULL,
	pvi_id_devolucion int NOT NULL,
 CONSTRAINT PK_PedidoDevolucionVenta_1 PRIMARY KEY  
(
	pvdv_id 
) 
) 
;
/****** Object:  Table PresupuestoPedidoVenta    Script Date: 07/30/2012 17:24:31 ******/

;

;
CREATE TABLE PresupuestoPedidoVenta(
	prvpv_id int NOT NULL,
	prvpv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoPedidoVenta_prvpv_cantidad  DEFAULT (0),
	prvi_id int NOT NULL,
	pvi_id int NOT NULL,
 CONSTRAINT PK_PresupuestoPedidoVenta PRIMARY KEY  
(
	prvpv_id 
) 
) 
;
/****** Object:  Table PedidoFacturaVenta    Script Date: 07/30/2012 17:21:43 ******/

;

;
CREATE TABLE PedidoFacturaVenta(
	pvfv_id int NOT NULL,
	pvfv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoFacturaVenta_pvfv_cantidad  DEFAULT (0),
	pvi_id int NOT NULL,
	fvi_id int NOT NULL,
 CONSTRAINT PK_PedidoFacturaVenta PRIMARY KEY  
(
	pvfv_id 
) 
) 
;
/****** Object:  Table PedidoPackingList    Script Date: 07/30/2012 17:21:49 ******/

;

;
CREATE TABLE PedidoPackingList(
	pvpklst_id int NOT NULL,
	pvpklst_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoPackingList_pvpklst_cantidad  DEFAULT (0),
	pvi_id int NOT NULL,
	pklsti_id int NOT NULL,
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
CREATE TABLE Legajo(
	lgj_id int NOT NULL,
	lgj_titulo varchar(255) NOT NULL CONSTRAINT DF_Legajo_lgj_titulo  DEFAULT (''),
	lgj_codigo varchar(50) NOT NULL,
	lgj_descrip varchar(255) NOT NULL CONSTRAINT DF_Legajo_lgj_descrip  DEFAULT (''),
	lgj_fecha timestamptz NOT NULL CONSTRAINT DF_Legajo_lgj_fecha  DEFAULT (getdate()),
	lgj_ata varchar(50) NOT NULL CONSTRAINT DF_Legajo_lgj_ata  DEFAULT (''),
	lgj_hawbbl varchar(50) NOT NULL CONSTRAINT DF_Legajo_lgj_hawbbl  DEFAULT (''),
	lgj_etd varchar(50) NOT NULL CONSTRAINT DF_Legajo_lgj_etd  DEFAULT (''),
	lgj_eta varchar(50) NOT NULL CONSTRAINT DF_Legajo_lgj_eta  DEFAULT (''),
	lgj_mawbbl varchar(50) NOT NULL CONSTRAINT DF_Legajo_lgj_mawbbl  DEFAULT (''),
	lgj_fob varchar(50) NOT NULL CONSTRAINT DF_Legajo_lgj_fob  DEFAULT (''),
	lgj_giro varchar(50) NOT NULL CONSTRAINT DF_Legajo_lgj_giro  DEFAULT (''),
	lgj_flete varchar(50) NOT NULL CONSTRAINT DF_Legajo_lgj_flete  DEFAULT (''),
	lgjt_id int NOT NULL,
	est_id int NOT NULL,
	cli_id int NULL,
	mon_id int NULL,
	trans_id int NULL,
	barc_id int NULL,
	vue_id int NULL,
	pue_id int NULL,
	modificado timestamptz NOT NULL CONSTRAINT DF_Legajo_modificado_1  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_Legajo_creado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Legajo_activo  DEFAULT (1),
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
CREATE TABLE RecuentoStockItem(
	rs_id int NOT NULL,
	rsi_id int NOT NULL,
	rsi_orden smallint NOT NULL,
	rsi_cantidadstock decimal(18, 6) NOT NULL CONSTRAINT DF_RecuentoStockItem_rsi_cantidadstock  DEFAULT (0),
	rsi_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_RecuentoStockItem_rsi_cantidad  DEFAULT (0),
	rsi_ajuste decimal(18, 6) NOT NULL CONSTRAINT DF_RecuentoStockItem_rsi_ajuste  DEFAULT (0),
	rsi_descrip varchar(5000) NOT NULL CONSTRAINT DF_RecuentoStockItem_rsi_descrip  DEFAULT (''),
	pr_id int NOT NULL,
	depl_id int NOT NULL,
	stl_id int NULL,
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
CREATE TABLE Alsa(
	alsa_id int NOT NULL,
	alsa_codigo varchar(15) NOT NULL,
	alsa_descrip varchar(255) NOT NULL CONSTRAINT DF_Alsa_alsa_descrip  DEFAULT (''),
	alsa_tipoMadera smallint NOT NULL CONSTRAINT DF_Alsa_alsa_tipoMadera  DEFAULT (0),
	alsa_tipoCamara smallint NOT NULL CONSTRAINT DF_Alsa_alsa_tipoCamara  DEFAULT (0),
	alsa_tipoAlsa smallint NOT NULL CONSTRAINT DF_Alsa_alsa_tipoAlsa  DEFAULT (0),
	colm_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Alsa_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Alsa_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Alsa_activo  DEFAULT (1),
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
CREATE TABLE Reina(
	reina_id int NOT NULL,
	reina_codigo varchar(15) NOT NULL,
	reina_descrip varchar(255) NOT NULL CONSTRAINT DF_Reina_reina_descrip  DEFAULT (''),
	reina_nacimiento timestamptz NOT NULL,
	reina_calidad smallint NOT NULL,
	colm_id int NULL,
	prov_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Reina_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Reina_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Reina_activo  DEFAULT (1),
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
CREATE TABLE HojaRutaItem(
	hr_id int NOT NULL,
	hri_id int NOT NULL,
	hri_orden smallint NOT NULL,
	hri_descrip varchar(5000) NOT NULL CONSTRAINT DF_HojaRutaItem_hri_descrip  DEFAULT (''),
	hri_importe decimal(18, 6) NOT NULL CONSTRAINT DF_HojaRutaItem_hri_importe  DEFAULT (0),
	hri_acobrar decimal(18, 6) NOT NULL CONSTRAINT DF_HojaRutaItem_hri_acobrar  DEFAULT (0),
	hri_cobrado decimal(18, 6) NOT NULL CONSTRAINT DF_HojaRutaItem_hri_cobrado  DEFAULT (0),
	hri_efectivo decimal(18, 6) NOT NULL CONSTRAINT DF_HojaRutaItem_hri_cheques3  DEFAULT (0),
	hri_tickets decimal(18, 6) NOT NULL CONSTRAINT DF_HojaRutaItem_hri_cheques2  DEFAULT (0),
	hri_tarjeta decimal(18, 6) NOT NULL CONSTRAINT DF_HojaRutaItem_hri_cheques1  DEFAULT (0),
	hri_cheques decimal(18, 6) NOT NULL CONSTRAINT DF_HojaRutaItem_hri_cheques  DEFAULT (0),
	hri_anulado decimal(18, 6) NOT NULL CONSTRAINT DF_HojaRutaItem_hri_anulada  DEFAULT (0),
	hri_retenciones decimal(18, 6) NOT NULL CONSTRAINT DF_HojaRutaItem_hri_retenciones  DEFAULT (0),
	hri_notascredito decimal(18, 6) NOT NULL CONSTRAINT DF_HojaRutaItem_hri_notascredito  DEFAULT (0),
	hri_otros decimal(18, 6) NOT NULL CONSTRAINT DF_HojaRutaItem_hri_otros  DEFAULT (0),
	est_id int NOT NULL,
	cont_id int NULL,
	fv_id int NULL,
	rv_id int NULL,
	os_id int NULL,
	ptd_id int NULL,
	hrct_id int NULL,
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
CREATE TABLE ParteProdKitItem(
	ppk_id int NOT NULL,
	ppki_id int NOT NULL,
	ppki_orden smallint NOT NULL,
	ppki_cantidadstock decimal(18, 6) NOT NULL CONSTRAINT DF_ParteProdKitItem_ppki_cantidadstock  DEFAULT (0),
	ppki_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_ParteProdKitItem_ppki_cantidad  DEFAULT (0),
	ppki_descrip varchar(5000) NOT NULL CONSTRAINT DF_ParteProdKitItem_ppki_descrip  DEFAULT (''),
	pr_id int NOT NULL,
	depl_id int NOT NULL,
	stl_id int NULL,
	prfk_id int NOT NULL,
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
CREATE TABLE ProductoNumeroSerie(
	prns_id int NOT NULL,
	prns_codigo varchar(100) NOT NULL,
	prns_codigo2 varchar(100) NOT NULL CONSTRAINT DF_ProductoNumeroSerie_prns_codigo2  DEFAULT (''),
	prns_codigo3 varchar(100) NOT NULL CONSTRAINT DF_ProductoNumeroSerie_prns_codigo3  DEFAULT (''),
	prns_descrip varchar(255) NOT NULL CONSTRAINT DF_ProductoNumeroSerie_prns_descrip  DEFAULT (''),
	prns_fechavto timestamptz NOT NULL CONSTRAINT DF_ProductoNumeroSerie_prns_fechavto  DEFAULT (getdate()),
	prns_id_historia int NULL,
	pr_id int NOT NULL,
	depl_id int NOT NULL,
	pr_id_kit int NULL,
	cli_id int NULL,
	prov_id int NULL,
	doc_id_salida int NULL,
	doct_id_salida int NULL,
	doc_id_ingreso int NULL,
	doct_id_ingreso int NULL,
	ppk_id int NULL,
	stl_id int NULL,
	prsk_id int NULL,
	tar_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ProductoNumeroSerie_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ProductoNumeroSerie_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	st_id int NOT NULL CONSTRAINT DF__producton__st_id__1DB2FE1E  DEFAULT (0),
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
CREATE TABLE LiquidacionConceptoAdm(
	liq_id int NOT NULL,
	liqca_id int NOT NULL,
	liqca_importe decimal(18, 6) NOT NULL CONSTRAINT DF_LiquidacionConceptoAdm_liqca_importe  DEFAULT (0),
	liqca_descrip varchar(5000) NOT NULL CONSTRAINT DF_LiquidacionConceptoAdm_liqca_descrip  DEFAULT (''),
	liqca_orden smallint NOT NULL,
	em_id int NOT NULL,
	liqfi_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE LiquidacionItemCodigo(
	liq_id int NOT NULL,
	liqi_id int NOT NULL,
	liqfi_id int NOT NULL,
	liqic_id int  NOT NULL,
	liqic_importe decimal(18, 6) NOT NULL CONSTRAINT DF_LiquidacionItemCodigo_liqic_importe  DEFAULT (0),
	liqic_unidades decimal(18, 6) NOT NULL CONSTRAINT DF_LiquidacionItemCodigo_liqic_unidades  DEFAULT (0),
	liqic_descrip varchar(1000) NOT NULL CONSTRAINT DF_LiquidacionItemCodigo_liqic_descrip  DEFAULT (''),
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
CREATE TABLE TarifarioCalle(
	tfcalle_id int NOT NULL,
	calle_id int NOT NULL,
	tf_id int NOT NULL,
 CONSTRAINT PK_TarifarioCalle PRIMARY KEY  
(
	tfcalle_id 
) 
) 
;
/****** Object:  Table TarifarioParalela    Script Date: 07/30/2012 17:31:27 ******/

;

;
CREATE TABLE TarifarioParalela(
	tfp_id int NOT NULL,
	tfp_alturabase int NOT NULL CONSTRAINT DF_TarifarioParalela_tfp_alturabase  DEFAULT (0),
	tfp_alturadesde int NOT NULL CONSTRAINT DF_TarifarioParalela_tfp_alturadesde  DEFAULT (0),
	tfcalle_id int NOT NULL,
	calle_id int NOT NULL,
	tf_id int NOT NULL,
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
CREATE TABLE CalleAltura(
	callea_id int NOT NULL,
	callea_desde int NOT NULL,
	callea_hasta int NOT NULL,
	callea_guiafilcar varchar(50) NOT NULL CONSTRAINT DF_CalleAltura_calle_guiafilcar  DEFAULT (''),
	callea_sentido smallint NOT NULL CONSTRAINT DF_CalleAltura_calle_sentido  DEFAULT (0),
	calle_id int NOT NULL,
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
CREATE TABLE Curso(
	cur_id int NOT NULL,
	cur_nombre varchar(100) NOT NULL,
	cur_codigo varchar(15) NOT NULL,
	cur_descrip varchar(255) NOT NULL CONSTRAINT DF_Curso_cur_descrip  DEFAULT (''),
	cur_desde timestamptz NOT NULL CONSTRAINT DF_Curso_cur_desde  DEFAULT ('19000101'),
	cur_hasta timestamptz NOT NULL CONSTRAINT DF_Curso_cur_hasta  DEFAULT ('19000101'),
	mat_id int NOT NULL,
	prof_id int NULL,
	prof_id_ayudante1 int NULL,
	prof_id_ayudante2 int NULL,
	prof_id_ayudante3 int NULL,
	prof_id_ayudante4 int NULL,
	prof_id_ayudante5 int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Curso_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Curso_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Curso_activo  DEFAULT (1),
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
CREATE TABLE ProductoSerieKitTMP(
	ppkTMP_id int NOT NULL,
	ppkiTMP_id int NOT NULL,
	prskTMP_id int NOT NULL,
	pr_id int NOT NULL,
	prsk_id int NOT NULL,
	prns_id int NULL,
	prns_codigo varchar(100) NOT NULL CONSTRAINT DF_ProductoSerieKitTMP_prns_codigo  DEFAULT (''),
	prfk_id int NOT NULL,
	stl_id int NULL,
	stl_codigo varchar(50) NOT NULL,
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
CREATE TABLE ParteProdKitItemATMP(
	ppkTMP_id int NOT NULL,
	ppkiTMP_id int NOT NULL,
	ppkiaTMP_id int NOT NULL,
	ppkia_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_ParteProdKitItemATMP_ppkia_cantidad  DEFAULT (0),
	pr_id int NOT NULL,
	prk_id int NOT NULL,
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
CREATE TABLE ParteProdKitItemSerieTMP(
	ppkTMP_id int NOT NULL,
	ppkiTMP_id int NOT NULL,
	ppki_id int NOT NULL CONSTRAINT DF_ParteProdKitSerieTMP_ppki_id  DEFAULT (0),
	ppkisTMP_id int NOT NULL,
	ppkis_orden smallint NOT NULL CONSTRAINT DF_ParteProdKitSerieTMP_ppkis_orden  DEFAULT (0),
	prns_codigo varchar(100) NOT NULL CONSTRAINT DF_ParteProdKitSerieTMP_prns_codigo  DEFAULT (''),
	prns_descrip varchar(255) NOT NULL CONSTRAINT DF_ParteProdKitSerieTMP_prns_descrip  DEFAULT (''),
	prns_fechavto timestamptz NOT NULL CONSTRAINT DF_ParteProdKitSerieTMP_prns_fechavto  DEFAULT (getdate()),
	pr_id int NOT NULL,
	prns_id int NOT NULL CONSTRAINT DF_ParteProdKitSerieTMP_prns_id  DEFAULT (0),
	pr_id_item int NOT NULL,
	pr_id_kit int NULL,
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
CREATE TABLE ProductoSerieKitItemTMP(
	ppkTMP_id int NOT NULL,
	ppkiTMP_id int NOT NULL,
	prskTMP_id int NOT NULL,
	prskiTMP_id int NOT NULL,
	prski_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_ProductoSerieKitItemTMP_prski_cantidad  DEFAULT (0),
	prk_id int NOT NULL,
	pr_id int NOT NULL,
	prns_id int NULL,
	stl_id int NULL,
 CONSTRAINT PK_ProductoSerieKitItemTMP PRIMARY KEY  
(
	prskiTMP_id 
) 
) 
;
/****** Object:  Table ParteProdKitItemBorradoTMP    Script Date: 07/30/2012 17:20:35 ******/

;

;
CREATE TABLE ParteProdKitItemBorradoTMP(
	ppkTMP_id int NOT NULL,
	ppkibTMP_id int NOT NULL,
	ppk_id int NOT NULL,
	ppki_id int NOT NULL,
 CONSTRAINT PK_ParteProdKitItemBorradoTMP PRIMARY KEY  
(
	ppkibTMP_id 
) 
) 
;
/****** Object:  Table ProductoSerieKitBorradoTMP    Script Date: 07/30/2012 17:26:22 ******/

;

;
CREATE TABLE ProductoSerieKitBorradoTMP(
	ppkTMP_id int NOT NULL,
	prskbTMP_id int NOT NULL,
	ppk_id int NOT NULL,
	prsk_id int NOT NULL,
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
CREATE TABLE ParteProdKitItemTMP(
	ppkTMP_id int NOT NULL,
	ppkiTMP_id int NOT NULL,
	ppki_id int NOT NULL,
	ppki_orden smallint NOT NULL,
	ppki_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_ParteProdKitItemTMP_ppki_cantidad  DEFAULT (0),
	ppki_descrip varchar(5000) NOT NULL CONSTRAINT DF_ParteProdKitItemTMP_ppki_descrip  DEFAULT (''),
	pr_id int NOT NULL,
	depl_id int NOT NULL,
	prfk_id int NULL,
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
CREATE TABLE OrdenServicio(
	os_id int NOT NULL,
	os_numero int NOT NULL,
	os_nrodoc varchar(50) NOT NULL CONSTRAINT DF_OrdenServicio_os_nrodoc  DEFAULT (''),
	os_descrip varchar(5000) NOT NULL CONSTRAINT DF_OrdenServicio_os_descrip  DEFAULT (''),
	os_fecha timestamptz NOT NULL CONSTRAINT DF_OrdenServicio_os_fecha  DEFAULT (getdate()),
	os_hora smallint NOT NULL CONSTRAINT DF_OrdenServicio_os_hora  DEFAULT (0),
	os_fechaentrega timestamptz NOT NULL CONSTRAINT DF_OrdenServicio_pc_fechaentrega  DEFAULT (getdate()),
	os_neto decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicio_pc_neto  DEFAULT (0),
	os_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicio_pc_ivari  DEFAULT (0),
	os_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicio_pc_ivarni  DEFAULT (0),
	os_total decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicio_pc_total  DEFAULT (0),
	os_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicio_pc_subtotal  DEFAULT (0),
	os_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicio_pc_pendiente  DEFAULT (0),
	os_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicio_pc_descuento1  DEFAULT (0),
	os_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicio_pc_descuento2  DEFAULT (0),
	os_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicio_pc_importedesc1  DEFAULT (0),
	os_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicio_pc_importedesc2  DEFAULT (0),
	os_firmado int NOT NULL CONSTRAINT DF_OrdenServicio_pc_firmado  DEFAULT (0),
	os_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicio_fc_cotizacion  DEFAULT (0),
	est_id int NOT NULL,
	ccos_id int NULL,
	emp_id int NOT NULL,
	suc_id int NOT NULL,
	cli_id int NOT NULL,
	clis_id int NULL,
	cont_id int NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	proy_id int NULL,
	lp_id int NULL,
	ld_id int NULL,
	lgj_id int NULL,
	cpg_id int NULL,
	st_id int NULL,
	tar_id int NULL,
	us_id_tecnico int NULL,
	prio_id int NULL,
	inct_id int NULL,
	inca_id int NULL,
	zon_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_OrdenServicio_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_OrdenServicio_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL DEFAULT (0),
	impid_id int NULL,
	emailenviado smallint NOT NULL DEFAULT ((0)),
 CONSTRAINT PK_OrdenServicio PRIMARY KEY  
(
	os_id 
) ,
 CONSTRAINT IX_OrdenServicio UNIQUE  
(
	os_numero 
) ,
 CONSTRAINT IX_OrdenServicioNroDoc UNIQUE  
(
	emp_id ,
	os_nrodoc 
) 
) 
;

;
/****** Object:  Table PackingList    Script Date: 07/30/2012 17:19:43 ******/

;

;

;
CREATE TABLE PackingList(
	pklst_id int NOT NULL,
	pklst_numero int NOT NULL,
	pklst_nrodoc varchar(20) NOT NULL CONSTRAINT DF_PackingList_pklst_nrodoc  DEFAULT (''),
	pklst_fecha timestamptz NOT NULL CONSTRAINT DF_PackingList_pklst_fecha  DEFAULT (getdate()),
	pklst_fechaentrega timestamptz NOT NULL CONSTRAINT DF_PackingList_pklst_fechadoc  DEFAULT (getdate()),
	pklst_cantidad int NOT NULL CONSTRAINT DF_PackingList_pklst_cantidad  DEFAULT (0),
	pklst_pallets int NOT NULL CONSTRAINT DF_PackingList_pklst_pallets  DEFAULT (0),
	pklst_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PackingList_pklst_pendiente  DEFAULT (0),
	pklst_descrip varchar(255) NOT NULL CONSTRAINT DF_PackingList_pklst_descrip  DEFAULT (''),
	pklst_marca varchar(255) NOT NULL CONSTRAINT DF_PackingList_pklst_marca  DEFAULT (''),
	pklst_firmado int NOT NULL CONSTRAINT DF_PackingList_pklst_firmado  DEFAULT (0),
	pklst_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PackingList_rv_neto  DEFAULT (0),
	pklst_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PackingList_rv_ivari  DEFAULT (0),
	pklst_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PackingList_rv_ivarni  DEFAULT (0),
	pklst_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_PackingList_rv_subtotal  DEFAULT (0),
	pklst_total decimal(18, 6) NOT NULL CONSTRAINT DF_PackingList_rv_total  DEFAULT (0),
	pklst_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_PackingList_rv_descuento1  DEFAULT (0),
	pklst_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_PackingList_rv_descuento2  DEFAULT (0),
	pklst_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_PackingList_rv_importedesc1  DEFAULT (0),
	pklst_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_PackingList_rv_importedesc2  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	ccos_id int NULL,
	cli_id int NOT NULL,
	barc_id int NULL,
	pue_id_origen int NULL,
	pue_id_destino int NULL,
	lp_id int NULL,
	ld_id int NULL,
	lgj_id int NULL,
	cpg_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_PackingList_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_PackingList_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
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
CREATE TABLE ImportacionTemp(
	impt_id int NOT NULL,
	impt_numero int NOT NULL,
	impt_nrodoc varchar(50) NOT NULL CONSTRAINT DF_ImportacionTemp_impt_nrodoc  DEFAULT (''),
	impt_despachonro varchar(50) NOT NULL CONSTRAINT DF_ImportacionTemp_impt_despachonro  DEFAULT (''),
	impt_descrip varchar(5000) NOT NULL CONSTRAINT DF_ImportacionTemp_impt_descrip  DEFAULT (''),
	impt_fecha timestamptz NOT NULL CONSTRAINT DF_ImportacionTemp_impt_fecha  DEFAULT (getdate()),
	impt_fechaentrega timestamptz NOT NULL CONSTRAINT DF_ImportacionTemp_pc_fechaentrega  DEFAULT (getdate()),
	impt_fechaoficial timestamptz NOT NULL CONSTRAINT DF_ImportacionTemp_impt_fechaoficial  DEFAULT (getdate()),
	impt_neto decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTemp_pc_neto  DEFAULT (0),
	impt_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTemp_pc_ivari  DEFAULT (0),
	impt_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTemp_pc_ivarni  DEFAULT (0),
	impt_total decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTemp_pc_total  DEFAULT (0),
	impt_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTemp_pc_subtotal  DEFAULT (0),
	impt_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTemp_pc_descuento1  DEFAULT (0),
	impt_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTemp_pc_descuento2  DEFAULT (0),
	impt_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTemp_pc_importedesc1  DEFAULT (0),
	impt_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTemp_pc_importedesc2  DEFAULT (0),
	impt_firmado int NOT NULL CONSTRAINT DF_ImportacionTemp_pc_firmado  DEFAULT (0),
	impt_seguro decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTemp_impt_seguro  DEFAULT (0),
	impt_flete decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTemp_impt_flete  DEFAULT (0),
	est_id int NOT NULL,
	ccos_id int NULL,
	suc_id int NOT NULL,
	prov_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	lp_id int NULL,
	ld_id int NULL,
	lgj_id int NULL,
	cpg_id int NULL,
	st_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ImportacionTemp_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ImportacionTemp_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
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
CREATE TABLE ListaDescuentoCliente(
	ldcli_id int NOT NULL,
	ld_id int NOT NULL,
	cli_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ListaDescuentoCliente_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ListaDescuentoCliente_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE Cliente(
	cli_id int NOT NULL,
	cli_nombre varchar(255) NOT NULL,
	cli_codigo varchar(255) NOT NULL,
	cli_contacto varchar(100) NOT NULL CONSTRAINT DF_Cliente_cli_contacto  DEFAULT (''),
	cli_descrip varchar(255) NOT NULL CONSTRAINT DF_Cliente_cli_descrip  DEFAULT (''),
	cli_razonsocial varchar(255) NOT NULL CONSTRAINT DF_Cliente_prov_razonsocial  DEFAULT (''),
	cli_cuit varchar(50) NOT NULL CONSTRAINT DF_Cliente_prov_cuit  DEFAULT (''),
	cli_cuitexterior varchar(100) NOT NULL CONSTRAINT DF_Cliente_cli_cuitexterior  DEFAULT (''),
	cli_ingresosbrutos varchar(20) NOT NULL CONSTRAINT DF_Cliente_prov_ingresosbrutos  DEFAULT (''),
	cli_catfiscal smallint NOT NULL CONSTRAINT DF_Cliente_prov_catfiscal  DEFAULT (1),
	cli_chequeorden varchar(100) NOT NULL CONSTRAINT DF_Cliente_prov_chequeorden  DEFAULT (''),
	cli_codpostal varchar(50) NOT NULL CONSTRAINT DF_Cliente_prov_codpostal  DEFAULT (''),
	cli_localidad varchar(100) NOT NULL CONSTRAINT DF_Cliente_cli_localidad  DEFAULT (''),
	cli_calle varchar(100) NOT NULL CONSTRAINT DF_Cliente_prov_calle  DEFAULT (''),
	cli_callenumero varchar(100) NOT NULL CONSTRAINT DF_Cliente_prov_callenumero  DEFAULT ('s/n'),
	cli_piso varchar(100) NOT NULL CONSTRAINT DF_Cliente_prov_piso  DEFAULT ('PB'),
	cli_depto varchar(100) NOT NULL CONSTRAINT DF_Cliente_prov_depto  DEFAULT (''),
	cli_tel varchar(100) NOT NULL CONSTRAINT DF_Cliente_prov_tel  DEFAULT (''),
	cli_fax varchar(100) NOT NULL CONSTRAINT DF_Cliente_prov_fax  DEFAULT (''),
	cli_email varchar(100) NOT NULL CONSTRAINT DF_Cliente_prov_email  DEFAULT (''),
	cli_web varchar(100) NOT NULL CONSTRAINT DF_Cliente_prov_web  DEFAULT (''),
	cli_creditoctacte decimal(18, 6) NOT NULL CONSTRAINT DF_Cliente_cli_creditoctacte  DEFAULT (0),
	cli_creditototal decimal(18, 6) NOT NULL CONSTRAINT DF_Cliente_cli_creditototal  DEFAULT (0),
	cli_creditoactivo smallint NOT NULL CONSTRAINT DF_Cliente_cli_creditoactivo  DEFAULT (1),
	cli_deudapedido decimal(18, 6) NOT NULL CONSTRAINT DF_Cliente_cli_deudapedido  DEFAULT (0),
	cli_deudaorden decimal(18, 6) NOT NULL CONSTRAINT DF_Cliente_cli_deudaorden  DEFAULT (0),
	cli_deudaremito decimal(18, 6) NOT NULL CONSTRAINT DF_Cliente_cli_duedaRemito  DEFAULT (0),
	cli_deudapackinglist decimal(18, 6) NOT NULL CONSTRAINT DF_Cliente_cli_deudapackinglist  DEFAULT (0),
	cli_deudamanifiesto decimal(18, 6) NOT NULL CONSTRAINT DF__Cliente__cli_deu__389EFA16  DEFAULT (0),
	cli_deudactacte decimal(18, 6) NOT NULL CONSTRAINT DF_Cliente_cli_deudactacte  DEFAULT (0),
	cli_deudadoc decimal(18, 6) NOT NULL CONSTRAINT DF_Cliente_cli_deudadoc  DEFAULT (0),
	cli_deudatotal decimal(18, 6) NOT NULL CONSTRAINT DF_Cliente_cli_deudatotal  DEFAULT (0),
	cli_yahoo varchar(50) NOT NULL CONSTRAINT DF_Cliente_cli_yahoo  DEFAULT (''),
	cli_messanger varchar(100) NOT NULL CONSTRAINT DF_Cliente_cli_messanger  DEFAULT (''),
	cli_exigeTransporte smallint NOT NULL CONSTRAINT DF_Cliente_cli_exigeTransporte  DEFAULT (0),
	cli_id_padre int NULL,
	cli_pciaTransporte smallint NOT NULL CONSTRAINT DF_Cliente_cli_pciaTransporte_1  DEFAULT (0),
	cli_exigeProvincia smallint NOT NULL CONSTRAINT DF_Cliente_cli_exigeProvincia  DEFAULT (0),
	cli_esprospecto smallint NOT NULL CONSTRAINT DF_Cliente_cli_esprospecto  DEFAULT (0),
	cli_horario_m_desde timestamptz NOT NULL CONSTRAINT DF_Cliente_cli_horario_m_desde  DEFAULT ('19000101'),
	cli_horario_m_hasta timestamptz NOT NULL CONSTRAINT DF_Cliente_cli_horario_m_hasta  DEFAULT ('19000101'),
	cli_horario_t_desde timestamptz NOT NULL CONSTRAINT DF_Cliente_cli_horario_t_desde  DEFAULT ('19000101'),
	cli_horario_t_hasta timestamptz NOT NULL CONSTRAINT DF_Cliente_cli_horario_t_hasta  DEFAULT ('19000101'),
	cli_codigocomunidad varchar(100) NOT NULL CONSTRAINT DF_Cliente_cli_codigocomunidad  DEFAULT (''),
	us_id int NULL,
	pro_id int NULL,
	zon_id int NULL,
	cpg_id int NULL,
	lp_id int NULL,
	ld_id int NULL,
	ven_id int NULL,
	trans_id int NULL,
	clict_id int NULL,
	proy_id int NULL,
	cli_id_referido int NULL,
	cpa_id int NULL,
	fp_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Cliente_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Cliente_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Cliente_activo  DEFAULT (1),
 CONSTRAINT PK_Cliente PRIMARY KEY  
(
	cli_id 
) 
) 
;

;
;
--, @value=N'' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Cliente', @level2type=N'COLUMN',@level2name=N'cli_ingresosbrutos'
;
/****** Object:  Table ListaDescuentoProveedor    Script Date: 07/30/2012 17:16:02 ******/

;

;
CREATE TABLE ListaDescuentoProveedor(
	ldprov_id int NOT NULL,
	ld_id int NOT NULL,
	prov_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ListaDescuentoProveedor_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ListaDescuentoProveedor_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE RemitoCompra(
	rc_id int NOT NULL,
	rc_numero int NOT NULL,
	rc_nrodoc varchar(50) NOT NULL CONSTRAINT DF_RemitoCompra_rc_nrodoc  DEFAULT (''),
	rc_descrip varchar(5000) NOT NULL CONSTRAINT DF_RemitoCompra_rc_descrip  DEFAULT (''),
	rc_fecha timestamptz NOT NULL CONSTRAINT DF_RemitoCompra_rc_fecha  DEFAULT (getdate()),
	rc_fechaentrega timestamptz NOT NULL CONSTRAINT DF_RemitoCompra_pc_fechaentrega  DEFAULT (getdate()),
	rc_neto decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompra_pc_neto  DEFAULT (0),
	rc_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompra_pc_ivari  DEFAULT (0),
	rc_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompra_pc_ivarni  DEFAULT (0),
	rc_total decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompra_pc_total  DEFAULT (0),
	rc_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompra_pc_subtotal  DEFAULT (0),
	rc_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompra_pc_pendiente  DEFAULT (0),
	rc_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompra_pc_descuento1  DEFAULT (0),
	rc_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompra_pc_descuento2  DEFAULT (0),
	rc_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompra_pc_importedesc1  DEFAULT (0),
	rc_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompra_pc_importedesc2  DEFAULT (0),
	rc_firmado int NOT NULL CONSTRAINT DF_RemitoCompra_pc_firmado  DEFAULT (0),
	rc_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompra_fc_cotizacion  DEFAULT (0),
	est_id int NOT NULL,
	ccos_id int NULL,
	suc_id int NOT NULL,
	prov_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	lp_id int NULL,
	ld_id int NULL,
	lgj_id int NULL,
	cpg_id int NULL,
	st_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_RemitoCompra_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_RemitoCompra_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
 CONSTRAINT PK_RemitoCompra PRIMARY KEY  
(
	rc_id 
) ,
 CONSTRAINT IX_RemitoCompra UNIQUE  
(
	rc_numero 
) ,
 CONSTRAINT IX_RemitoCompraNroDoc UNIQUE  
(
	rc_nrodoc ,
	prov_id 
) 
) 
;

;
/****** Object:  Table ListaDescuentoItem    Script Date: 07/30/2012 17:16:00 ******/

;

;
CREATE TABLE ListaDescuentoItem(
	ld_id int NOT NULL,
	ldi_id int NOT NULL,
	ldi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_ListaDescuentoItem_ldi_precio  DEFAULT (0),
	ldi_porcentaje decimal(18, 6) NOT NULL CONSTRAINT DF_ListaDescuentoItem_ldi_porcentaje  DEFAULT (0),
	pr_id int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_ListaDescuentoItem_activo  DEFAULT (1),
	creado timestamptz NOT NULL CONSTRAINT DF_ListaDescuentoItem_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ListaDescuentoItem_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE PedidoVenta(
	pv_id int NOT NULL,
	pv_numero int NOT NULL,
	pv_nrodoc varchar(50) NOT NULL CONSTRAINT DF_PedidoVenta_pv_nrodoc  DEFAULT (''),
	pv_descrip varchar(5000) NOT NULL CONSTRAINT DF_PedidoVenta_pv_descrip  DEFAULT (''),
	pv_fecha timestamptz NOT NULL CONSTRAINT DF_PedidoVenta_pv_fecha  DEFAULT (getdate()),
	pv_fechaentrega timestamptz NOT NULL CONSTRAINT DF_PedidoVenta_pv_fechaentrega  DEFAULT (getdate()),
	pv_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVenta_pv_neto  DEFAULT (0),
	pv_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVenta_pv_impuesto  DEFAULT (0),
	pv_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVenta_pv_ivarni  DEFAULT (0),
	pv_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVenta_pv_subtotal  DEFAULT (0),
	pv_total decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVenta_pv_total  DEFAULT (0),
	pv_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVenta_pv_pendiente  DEFAULT (0),
	pv_firmado int NOT NULL CONSTRAINT DF_PedidoVenta_pv_firmado  DEFAULT (0),
	pv_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVenta_pv_descuento  DEFAULT (0),
	pv_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVenta_pv_descuento2  DEFAULT (0),
	pv_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVenta_pv_importedesc1  DEFAULT (0),
	pv_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVenta_pv_importedesc2  DEFAULT (0),
	pv_destinatario varchar(1000) NOT NULL CONSTRAINT DF_PedidoVenta_rv_destinatario  DEFAULT (''),
	pv_ordencompra varchar(255) NOT NULL CONSTRAINT DF_PedidoVenta_pv_ordencompra  DEFAULT (''),
	pv_cvxi_calificado smallint NOT NULL CONSTRAINT DF_PedidoVenta_pv_cvxi_calificado  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	cli_id int NOT NULL,
	emp_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	lp_id int NULL,
	ld_id int NULL,
	cpg_id int NOT NULL,
	ccos_id int NULL,
	ven_id int NULL,
	lgj_id int NULL,
	pro_id_origen int NULL,
	pro_id_destino int NULL,
	trans_id int NULL,
	chof_id int NULL,
	cam_id int NULL,
	cam_id_semi int NULL,
	ram_id_stock varchar(50) NOT NULL CONSTRAINT DF_PedidoVenta_ram_id_stock  DEFAULT (''),
	clis_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_PedidoVenta_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_PedidoVenta_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL CONSTRAINT DF__PedidoVen__impre__00C02307  DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
 CONSTRAINT PK_PedidoVenta PRIMARY KEY  
(
	pv_id 
) ,
 CONSTRAINT IX_PedidoVenta UNIQUE  
(
	pv_numero 
) ,
 CONSTRAINT IX_PedidoVentaNroDoc UNIQUE  
(
	emp_id ,
	pv_nrodoc 
) 
) 
;

;
/****** Object:  Table RemitoVenta    Script Date: 07/30/2012 17:28:33 ******/

;

;

;
CREATE TABLE RemitoVenta(
	rv_id int NOT NULL,
	rv_numero int NOT NULL,
	rv_nrodoc varchar(50) NOT NULL CONSTRAINT DF_RemitoVenta_pv_nrodoc  DEFAULT (''),
	rv_descrip varchar(5000) NOT NULL CONSTRAINT DF_RemitoVenta_pv_descrip  DEFAULT (''),
	rv_fecha timestamptz NOT NULL CONSTRAINT DF_RemitoVenta_pv_fecha  DEFAULT (getdate()),
	rv_fechaentrega timestamptz NOT NULL CONSTRAINT DF_RemitoVenta_pv_fechaentrega  DEFAULT (getdate()),
	rv_neto decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVenta_pv_neto  DEFAULT (0),
	rv_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVenta_pv_ivari  DEFAULT (0),
	rv_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVenta_pv_ivarni  DEFAULT (0),
	rv_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVenta_pv_subtotal  DEFAULT (0),
	rv_total decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVenta_pv_total  DEFAULT (0),
	rv_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVenta_pv_pendiente  DEFAULT (0),
	rv_firmado int NOT NULL CONSTRAINT DF_RemitoVenta_pv_firmado  DEFAULT (0),
	rv_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVenta_pv_descuento1  DEFAULT (0),
	rv_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVenta_pv_descuento2  DEFAULT (0),
	rv_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVenta_pv_importedesc1  DEFAULT (0),
	rv_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVenta_pv_importedesc2  DEFAULT (0),
	rv_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVenta_rv_cotizacion  DEFAULT (0),
	rv_retiro varchar(255) NOT NULL CONSTRAINT DF_RemitoVenta_rv_retiro  DEFAULT (''),
	rv_guia varchar(255) NOT NULL CONSTRAINT DF_RemitoVenta_rv_guia  DEFAULT (''),
	rv_destinatario varchar(1000) NOT NULL CONSTRAINT DF_RemitoVenta_rv_destinatario  DEFAULT (''),
	rv_ordencompra varchar(255) NOT NULL CONSTRAINT DF_RemitoVenta_rv_ordencompra  DEFAULT (''),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	cli_id int NOT NULL,
	emp_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	lp_id int NULL,
	ld_id int NULL,
	lgj_id int NULL,
	cpg_id int NULL,
	ccos_id int NULL,
	ven_id int NULL,
	pro_id_origen int NULL,
	pro_id_destino int NULL,
	trans_id int NULL,
	st_id int NULL,
	st_id_consumo int NULL,
	st_id_consumoTemp int NULL,
	st_id_producido int NULL,
	clis_id int NULL,
	impid_id int NULL,
	chof_id int NULL,
	cam_id int NULL,
	cam_id_semi int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_RemitoVenta_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_RemitoVenta_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL CONSTRAINT DF__RemitoVen__impre__7ED7DA95  DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
 CONSTRAINT PK_RemitoVenta PRIMARY KEY  
(
	rv_id 
) ,
 CONSTRAINT IX_RemitoVentaNroDocEmpresa UNIQUE  
(
	emp_id ,
	rv_nrodoc 
) ,
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
CREATE TABLE Proveedor(
	prov_id int NOT NULL,
	prov_nombre varchar(255) NOT NULL,
	prov_codigo varchar(20) NOT NULL,
	prov_descrip varchar(255) NOT NULL CONSTRAINT DF_Proveedor_prov_descrip  DEFAULT (''),
	prov_contacto varchar(5000) NULL CONSTRAINT DF_Proveedor_prov_contacto  DEFAULT (''),
	prov_razonsocial varchar(255) NOT NULL CONSTRAINT DF_Proveedor_prov_razonsocial  DEFAULT (''),
	prov_cuit varchar(20) NOT NULL CONSTRAINT DF_Proveedor_prov_cuit  DEFAULT (''),
	prov_ingresosbrutos varchar(20) NOT NULL CONSTRAINT DF_Proveedor_prov_ingresosbrutos  DEFAULT (''),
	prov_catfiscal smallint NOT NULL CONSTRAINT DF_Proveedor_prov_catfiscal  DEFAULT (1),
	prov_chequeorden varchar(100) NOT NULL CONSTRAINT DF_Proveedor_prov_chequeorden  DEFAULT (''),
	prov_codpostal varchar(50) NOT NULL CONSTRAINT DF_Proveedor_prov_codpostal  DEFAULT (''),
	prov_localidad varchar(100) NOT NULL,
	prov_calle varchar(100) NOT NULL CONSTRAINT DF_Proveedor_prov_calle  DEFAULT (''),
	prov_callenumero varchar(100) NOT NULL CONSTRAINT DF_Proveedor_prov_callenumero  DEFAULT ('s/n'),
	prov_piso varchar(100) NOT NULL CONSTRAINT DF_Proveedor_prov_piso  DEFAULT ('PB'),
	prov_depto varchar(100) NOT NULL CONSTRAINT DF_Proveedor_prov_depto  DEFAULT (''),
	prov_tel varchar(100) NOT NULL CONSTRAINT DF_Proveedor_prov_tel  DEFAULT (''),
	prov_fax varchar(100) NOT NULL CONSTRAINT DF_Proveedor_prov_fax  DEFAULT (''),
	prov_email varchar(100) NOT NULL CONSTRAINT DF_Proveedor_prov_email  DEFAULT (''),
	prov_web varchar(100) NOT NULL CONSTRAINT DF_Proveedor_prov_web  DEFAULT (''),
	prov_creditoctacte decimal(18, 6) NOT NULL CONSTRAINT DF_Proveedor_cli_creditoctacte  DEFAULT (0),
	prov_creditototal decimal(18, 6) NOT NULL CONSTRAINT DF_Proveedor_cli_creditototal  DEFAULT (0),
	prov_creditoactivo smallint NOT NULL CONSTRAINT DF_Proveedor_cli_creditoactivo  DEFAULT (1),
	prov_deudaorden decimal(18, 6) NOT NULL CONSTRAINT DF_Proveedor_cli_deudapedido  DEFAULT (0),
	prov_deudaremito decimal(18, 6) NOT NULL CONSTRAINT DF_Proveedor_cli_deudaRemito  DEFAULT (0),
	prov_deudactacte decimal(18, 6) NOT NULL CONSTRAINT DF_Proveedor_cli_deudactacte  DEFAULT (0),
	prov_deudadoc decimal(18, 6) NOT NULL CONSTRAINT DF_Proveedor_prov_deudadoc  DEFAULT (0),
	prov_deudatotal decimal(18, 6) NOT NULL CONSTRAINT DF_Proveedor_cli_deudatotal  DEFAULT (0),
	prov_imprimeticket smallint NOT NULL CONSTRAINT DF_Proveedor_prov_imprimeticket  DEFAULT (0),
	prov_banco varchar(255) NOT NULL CONSTRAINT DF_Proveedor_prov_banco  DEFAULT (''),
	prov_nroctabanco varchar(255) NOT NULL CONSTRAINT DF_Proveedor_prov_nroctabanco  DEFAULT (''),
	prov_cbu varchar(255) NOT NULL CONSTRAINT DF_Proveedor_prov_cbu  DEFAULT (''),
	prov_nrocliente varchar(255) NOT NULL CONSTRAINT DF_Proveedor_prov_nrocliente  DEFAULT (''),
	prov_horario_m_desde timestamptz NOT NULL CONSTRAINT DF_Proveedor_cli_horario_m_desde  DEFAULT ('19000101'),
	prov_horario_m_hasta timestamptz NOT NULL CONSTRAINT DF_Proveedor_cli_horario_m_hasta  DEFAULT ('19000101'),
	prov_horario_t_desde timestamptz NOT NULL CONSTRAINT DF_Proveedor_cli_horario_t_desde  DEFAULT ('19000101'),
	prov_horario_t_hasta timestamptz NOT NULL CONSTRAINT DF_Proveedor_cli_horario_t_hasta  DEFAULT ('19000101'),
	us_id int NULL,
	pro_id int NULL,
	zon_id int NULL,
	cpg_id int NULL,
	lp_id int NULL,
	ld_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Proveedor_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Proveedor_modificado  DEFAULT (getdate()),
	modifico int NOT NULL CONSTRAINT DF_Proveedor_modifico  DEFAULT (0),
	activo smallint NOT NULL CONSTRAINT DF_Proveedor_activo  DEFAULT (1),
 CONSTRAINT PK_Proveedor PRIMARY KEY  
(
	prov_id 
) 
) 
;

;
--, @value=N'' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Proveedor', @level2type=N'COLUMN',@level2name=N'prov_cuit'
;
--, @value=N'' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Proveedor', @level2type=N'COLUMN',@level2name=N'prov_ingresosbrutos'
;
/****** Object:  Table ParteReparacion    Script Date: 07/30/2012 17:20:51 ******/

;

;

;
CREATE TABLE ParteReparacion(
	prp_id int NOT NULL,
	prp_numero int NOT NULL,
	prp_nrodoc varchar(50) NOT NULL CONSTRAINT DF_ParteReparacion_prp_nrodoc  DEFAULT (''),
	prp_descrip varchar(5000) NOT NULL CONSTRAINT DF_ParteReparacion_prp_descrip  DEFAULT (''),
	prp_fecha timestamptz NOT NULL CONSTRAINT DF_ParteReparacion_prp_fecha  DEFAULT (getdate()),
	prp_fechaentrega timestamptz NOT NULL CONSTRAINT DF_ParteReparacion_prp_fechaentrega  DEFAULT (getdate()),
	prp_neto decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacion_prp_neto  DEFAULT (0),
	prp_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacion_prp_ivari  DEFAULT (0),
	prp_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacion_prp_ivarni  DEFAULT (0),
	prp_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacion_prp_subtotal  DEFAULT (0),
	prp_total decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacion_prp_total  DEFAULT (0),
	prp_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacion_prp_descuento1  DEFAULT (0),
	prp_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacion_prp_descuento2  DEFAULT (0),
	prp_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacion_prp_importedesc1  DEFAULT (0),
	prp_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacion_prp_importedesc2  DEFAULT (0),
	prp_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacion_prp_cotizacion  DEFAULT (0),
	prp_tipo smallint NOT NULL CONSTRAINT DF_ParteReparacion_prp_tipo  DEFAULT (1),
	prp_estado smallint NOT NULL CONSTRAINT DF_ParteReparacion_prp_aprobado  DEFAULT (1),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	cli_id int NOT NULL,
	emp_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	prns_id int NOT NULL,
	lp_id int NULL,
	ld_id int NULL,
	lgj_id int NULL,
	cpg_id int NULL,
	ccos_id int NULL,
	us_id int NULL,
	st_id int NULL,
	clis_id int NULL,
	cont_id int NULL,
	os_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ParteReparacion_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ParteReparacion_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
 CONSTRAINT PK_ParteReparacion PRIMARY KEY  
(
	prp_id 
) ,
 CONSTRAINT IX_ParteReparacionNroDocEmpresa UNIQUE  
(
	emp_id ,
	prp_nrodoc 
) ,
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
CREATE TABLE PresupuestoCompra(
	prc_id int NOT NULL,
	prc_numero int NOT NULL,
	prc_nrodoc varchar(50) NOT NULL CONSTRAINT DF_PresupuestoCompra_prc_nrodoc  DEFAULT (''),
	prc_descrip varchar(5000) NOT NULL CONSTRAINT DF_PresupuestoCompra_prc_descrip  DEFAULT (''),
	prc_fecha timestamptz NOT NULL CONSTRAINT DF_PresupuestoCompra_prc_fecha  DEFAULT (getdate()),
	prc_fechaentrega timestamptz NOT NULL CONSTRAINT DF_PresupuestoCompra_prc_fechaentrega  DEFAULT (getdate()),
	prc_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompra_prc_neto  DEFAULT (0),
	prc_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompra_prc_impuesto  DEFAULT (0),
	prc_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompra_prc_ivarni  DEFAULT (0),
	prc_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompra_prc_subtotal  DEFAULT (0),
	prc_total decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompra_prc_total  DEFAULT (0),
	prc_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompra_prc_pendiente  DEFAULT (0),
	prc_firmado int NOT NULL CONSTRAINT DF_PresupuestoCompra_prc_firmado  DEFAULT (0),
	prc_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompra_prc_descuento  DEFAULT (0),
	prc_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompra_prc_descuento2  DEFAULT (0),
	prc_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompra_prc_importedesc1  DEFAULT (0),
	prc_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompra_prc_importedesc2  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	prov_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	lp_id int NULL,
	ld_id int NULL,
	cpg_id int NOT NULL,
	ccos_id int NULL,
	us_id int NULL,
	lgj_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_PresupuestoCompra_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_PresupuestoCompra_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
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
CREATE TABLE ComunidadInternet(
	cmi_id int NOT NULL,
	cmi_nombre varchar(255) NOT NULL,
	cmi_codigo varchar(50) NOT NULL,
	cmi_descrip varchar(255) NOT NULL CONSTRAINT DF_ComunidadInternet_cmi_descrip  DEFAULT (''),
	pr_id int NOT NULL,
	doc_id int NOT NULL,
	suc_id int NOT NULL,
	ld_id int NULL,
	lp_id int NULL,
	depl_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ComunidadInternet_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ComunidadInternet_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_ComunidadInternet_activo  DEFAULT (1),
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
CREATE TABLE PresupuestoVenta(
	prv_id int NOT NULL,
	prv_numero int NOT NULL,
	prv_nrodoc varchar(50) NOT NULL CONSTRAINT DF_PresupuestoVenta_prv_nrodoc  DEFAULT (''),
	prv_descrip varchar(5000) NOT NULL CONSTRAINT DF_PresupuestoVenta_prv_descrip  DEFAULT (''),
	prv_fecha timestamptz NOT NULL CONSTRAINT DF_PresupuestoVenta_prv_fecha  DEFAULT (getdate()),
	prv_fechaentrega timestamptz NOT NULL CONSTRAINT DF_PresupuestoVenta_prv_fechaentrega  DEFAULT (getdate()),
	prv_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVenta_prv_neto  DEFAULT (0),
	prv_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVenta_prv_impuesto  DEFAULT (0),
	prv_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVenta_prv_ivarni  DEFAULT (0),
	prv_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVenta_prv_subtotal  DEFAULT (0),
	prv_total decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVenta_prv_total  DEFAULT (0),
	prv_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVenta_prv_pendiente  DEFAULT (0),
	prv_firmado int NOT NULL CONSTRAINT DF_PresupuestoVenta_prv_firmado  DEFAULT (0),
	prv_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVenta_prv_descuento  DEFAULT (0),
	prv_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVenta_prv_descuento2  DEFAULT (0),
	prv_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVenta_prv_importedesc1  DEFAULT (0),
	prv_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVenta_prv_importedesc2  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	cli_id int NOT NULL,
	emp_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	lp_id int NULL,
	ld_id int NULL,
	cpg_id int NOT NULL,
	ccos_id int NULL,
	ven_id int NULL,
	lgj_id int NULL,
	pro_id_origen int NULL,
	pro_id_destino int NULL,
	trans_id int NULL,
	clis_id int NULL,
	prov_id int NULL,
	cont_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_PresupuestoVenta_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_PresupuestoVenta_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL CONSTRAINT DF__Presupues__impre__02A86B79  DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
 CONSTRAINT PK_PresupuestoVenta PRIMARY KEY  
(
	prv_id 
) ,
 CONSTRAINT IX_PresupuestoVentaNroDoc UNIQUE  
(
	emp_id ,
	prv_nrodoc 
) 
) 
;

;
/****** Object:  Table FacturaCompra    Script Date: 07/30/2012 17:10:57 ******/

;

;

;
CREATE TABLE FacturaCompra(
	fc_id int NOT NULL,
	fc_numero int NOT NULL,
	fc_nrodoc varchar(50) NOT NULL CONSTRAINT DF_FacturaCompra_fc_nrodoc  DEFAULT (''),
	fc_descrip varchar(5000) NOT NULL CONSTRAINT DF_FacturaCompra_fc_descrip  DEFAULT (''),
	fc_fecha timestamptz NOT NULL CONSTRAINT DF_FacturaCompra_fc_fecha  DEFAULT (getdate()),
	fc_fechaentrega timestamptz NOT NULL CONSTRAINT DF_FacturaCompra_fc_fechaentrega  DEFAULT (getdate()),
	fc_fechaVto timestamptz NOT NULL CONSTRAINT DF_FacturaCompra_fc_fechaVto  DEFAULT ('19000101'),
	fc_fechaIva timestamptz NOT NULL CONSTRAINT DF_FacturaCompra_fc_fechaIva  DEFAULT (getdate()),
	fc_neto decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompra_fc_neto  DEFAULT (0),
	fc_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompra_fc_impuesto  DEFAULT (0),
	fc_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompra_fc_ivarni  DEFAULT (0),
	fc_internos decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompra_fc_internos  DEFAULT (0),
	fc_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompra_fc_subtotal  DEFAULT (0),
	fc_totalotros decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompra_fc_totalotros  DEFAULT (0),
	fc_totalpercepciones decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompra_fc_totalpercepciones  DEFAULT (0),
	fc_total decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompra_fc_total  DEFAULT (0),
	fc_totalorigen decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompra_fc_totalorigen  DEFAULT (0),
	fc_totalcomercial decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompra_fc_totalcomercial  DEFAULT (0),
	fc_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompra_fc_pendiente  DEFAULT (0),
	fc_firmado int NOT NULL CONSTRAINT DF_FacturaCompra_fc_firmado  DEFAULT (0),
	fc_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompra_fc_descuento  DEFAULT (0),
	fc_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompra_fc_descuento2  DEFAULT (0),
	fc_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompra_fc_importedesc1  DEFAULT (0),
	fc_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompra_fc_importedesc2  DEFAULT (0),
	fc_grabarasiento smallint NOT NULL CONSTRAINT DF_FacturaCompra_fc_grabarasiento  DEFAULT (0),
	fc_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompra_fc_cotizacion  DEFAULT (0),
	fc_cotizacionprov decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompra_fc_cotizacionprov  DEFAULT (0),
	fc_cai varchar(100) NOT NULL CONSTRAINT DF_FacturaCompra_fc_cai  DEFAULT (''),
	fc_tipocomprobante smallint NOT NULL CONSTRAINT DF_FacturaCompra_fc_tipocomprobante  DEFAULT (1),
	mon_id int NOT NULL,
	est_id int NOT NULL,
	suc_id int NOT NULL,
	prov_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	lp_id int NULL,
	ld_id int NULL,
	cpg_id int NOT NULL,
	ccos_id int NULL,
	as_id int NULL,
	lgj_id int NULL,
	pro_id_origen int NULL,
	pro_id_destino int NULL,
	rc_id int NULL,
	st_id int NULL,
	opg_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_FacturaCompra_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_FacturaCompra_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL CONSTRAINT DF__FacturaCo__impre__7DE3B65C  DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
 CONSTRAINT PK_FacturaCompra PRIMARY KEY  
(
	fc_id 
) ,
 CONSTRAINT IX_FacturaCompra UNIQUE  
(
	fc_numero 
) ,
 CONSTRAINT IX_FacturaCompraNroDoc UNIQUE  
(
	fc_nrodoc ,
	prov_id ,
	doct_id 
) 
) 
;

;
/****** Object:  Table CobranzaItem    Script Date: 07/30/2012 17:05:42 ******/

;

;

;
CREATE TABLE CobranzaItem(
	cobz_id int NOT NULL,
	cobzi_id int NOT NULL,
	cobzi_orden smallint NOT NULL CONSTRAINT DF_CobranzaItem_cobzi_orden  DEFAULT (0),
	cobzi_otroTipo smallint NOT NULL CONSTRAINT DF_CobranzaItem_cobzi_otroTipo  DEFAULT (0),
	cobzi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_CobranzaItem_cobzi_importe  DEFAULT (0),
	cobzi_importeOrigen decimal(18, 6) NOT NULL CONSTRAINT DF_CobranzaItem_cobzi_importeOrigen  DEFAULT (0),
	cobzi_descrip varchar(255) NOT NULL CONSTRAINT DF_CobranzaItem_cobzi_descrip  DEFAULT (''),
	cobzi_porcRetencion decimal(18, 6) NOT NULL CONSTRAINT DF_CobranzaItem_cobzi_porcRetencion  DEFAULT (0),
	cobzi_fechaRetencion timestamptz NOT NULL CONSTRAINT DF_CobranzaItem_cobzi_fechaRetencion  DEFAULT (getdate()),
	cobzi_nroRetencion varchar(100) NOT NULL CONSTRAINT DF_CobranzaItem_cobzi_nroRetencion  DEFAULT (''),
	cobzi_tipo smallint NOT NULL CONSTRAINT DF_CobranzaItem_cobzi_tipo  DEFAULT (0),
	cobzi_tarjetaTipo smallint NOT NULL CONSTRAINT DF_CobranzaItem_cobzi_tarjetaTipo  DEFAULT (1),
	cheq_id int NULL,
	cue_id int NULL,
	tjcc_id int NULL,
	ccos_id int NULL,
	ret_id int NULL,
	fv_id_ret int NULL,
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
CREATE TABLE AjusteInflacionItem(
	aje_id int NOT NULL,
	aji_id int NOT NULL,
	cue_id int NOT NULL,
	ajit_id int NOT NULL,
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
CREATE TABLE MovimientoFondoItem(
	mf_id int NOT NULL,
	mfi_id int NOT NULL,
	mfi_orden smallint NOT NULL,
	mfi_descrip varchar(5000) NOT NULL CONSTRAINT DF_MovimientoFondoItem_mfi_descrip  DEFAULT (''),
	mfi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_MovimientoFondoItem_mfi_importe  DEFAULT (0),
	mfi_importeorigen decimal(18, 6) NOT NULL CONSTRAINT DF_MovimientoFondoItem_mf_importeorigen  DEFAULT (0),
	mfi_tipo smallint NOT NULL CONSTRAINT DF_MovimientoFondoItem_opgi_tipo  DEFAULT (0),
	ccos_id int NULL,
	cue_id_debe int NOT NULL,
	cue_id_haber int NOT NULL,
	chq_id int NULL,
	cheq_id int NULL,
	cle_id int NULL,
	mfi_importeorigenhaber decimal(18, 6) NOT NULL DEFAULT (0),
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
CREATE TABLE OrdenPagoItem(
	opg_id int NOT NULL,
	opgi_id int NOT NULL,
	opgi_orden smallint NOT NULL CONSTRAINT DF_OrdenPagoItem_opgi_orden  DEFAULT (0),
	opgi_otroTipo smallint NOT NULL CONSTRAINT DF_OrdenPagoItem_opgi_otroTipo  DEFAULT (0),
	opgi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenPagoItem_opgi_importe  DEFAULT (0),
	opgi_importeOrigen decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenPagoItem_opgi_importeOrigen  DEFAULT (0),
	opgi_descrip varchar(255) NOT NULL CONSTRAINT DF_OrdenPagoItem_opgi_descrip  DEFAULT (''),
	opgi_porcRetencion decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenPagoItem_opgi_porcRetencion  DEFAULT (0),
	opgi_fechaRetencion timestamptz NOT NULL CONSTRAINT DF_OrdenPagoItem_opgi_fechaRetencion  DEFAULT (getdate()),
	opgi_nroRetencion varchar(100) NOT NULL CONSTRAINT DF_OrdenPagoItem_opgi_nroRetencion  DEFAULT (''),
	opgi_tipo smallint NOT NULL CONSTRAINT DF_OrdenPagoItem_opgi_tipo  DEFAULT (0),
	chq_id int NULL,
	cheq_id int NULL,
	cue_id int NULL,
	ccos_id int NULL,
	ret_id int NULL,
	fc_id_ret int NULL,
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
CREATE TABLE FacturaCompraItem(
	fc_id int NOT NULL,
	fci_id int NOT NULL,
	fci_orden smallint NOT NULL,
	fci_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItem_fci_cantidad  DEFAULT (0),
	fci_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItem_fci_cantidadaremitir  DEFAULT (0),
	fci_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItem_fci_pendiente_1  DEFAULT (0),
	fci_descrip varchar(5000) NOT NULL CONSTRAINT DF_FacturaCompraItem_fci_descrip  DEFAULT (''),
	fci_precio decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItem_fci_precio  DEFAULT (0),
	fci_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItem_fci_precioUsr  DEFAULT (0),
	fci_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItem_fci_precioLista  DEFAULT (0),
	fci_descuento varchar(100) NOT NULL CONSTRAINT DF_FacturaCompraItem_fci_descuento  DEFAULT (''),
	fci_neto decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItem_fc_neto  DEFAULT (0),
	fci_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItem_fci_ivari  DEFAULT (0),
	fci_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItem_fci_ivarni  DEFAULT (0),
	fci_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItem_fci_ivariporc  DEFAULT (0),
	fci_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItem_fci_ivarniporc  DEFAULT (0),
	fci_internosporc decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItem_fci_internosporc  DEFAULT (0),
	fci_internos decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItem_fci_internos  DEFAULT (0),
	fci_importe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItem_fci_importe  DEFAULT (0),
	fci_importeorigen decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItem_fc_importeorigen  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
	cue_id int NOT NULL,
	cue_id_ivari int NULL,
	cue_id_ivarni int NULL,
	to_id int NOT NULL,
	stl_id int NULL,
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
CREATE TABLE PercepcionTipo(
	perct_id int NOT NULL,
	perct_nombre varchar(100) NOT NULL,
	perct_codigo varchar(15) NOT NULL,
	perct_descrip varchar(255) NOT NULL CONSTRAINT DF_PercepcionTipo_perct_descrip  DEFAULT (''),
	perct_generasicore smallint NOT NULL,
	perct_codigosicore varchar(50) NOT NULL CONSTRAINT DF_PercepcionTipo_perct_codigosicore  DEFAULT (''),
	cue_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_PercepcionTipo_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_PercepcionTipo_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_PercepcionTipo_activo  DEFAULT (1),
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
CREATE TABLE TasaImpositiva(
	ti_id int NOT NULL,
	ti_nombre varchar(100) NOT NULL,
	ti_codigo varchar(15) NOT NULL,
	ti_porcentaje decimal(18, 4) NOT NULL,
	ti_codigodgi1 varchar(10) NOT NULL CONSTRAINT DF_TasaImpositiva_ti_codigodgi1  DEFAULT (''),
	ti_codigodgi2 varchar(10) NOT NULL CONSTRAINT DF_TasaImpositiva_ti_codigodgi11  DEFAULT (''),
	ti_tipo smallint NOT NULL CONSTRAINT DF_TasaImpositiva_ti_tipo  DEFAULT (0),
	cue_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_TasaImpositiva_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_TasaImpositiva_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_TasaImpositiva_activo  DEFAULT (1),
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
CREATE TABLE CuentaGrupo(
	cueg_id int NOT NULL,
	cueg_nombre varchar(100) NOT NULL,
	cueg_codigo varchar(15) NOT NULL,
	cueg_descrip varchar(255) NOT NULL CONSTRAINT DF_CuentaGrupo_cueg_descrip  DEFAULT (''),
	cueg_tipo smallint NOT NULL CONSTRAINT DF_CuentaGrupo_cueg_tipo  DEFAULT (0),
	cue_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_CuentaGrupo_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_CuentaGrupo_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_CuentaGrupo_activo  DEFAULT (1),
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
CREATE TABLE MovimientoCajaItem(
	mcj_id int NOT NULL,
	mcji_id int NOT NULL,
	mcji_orden smallint NOT NULL,
	mcji_descrip varchar(5000) NOT NULL CONSTRAINT DF_MovimientoCajaItem_mcji_descrip  DEFAULT (''),
	mcji_importe decimal(18, 6) NOT NULL CONSTRAINT DF_MovimientoCajaItem_mcji_debe  DEFAULT (0),
	mcji_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_MovimientoCajaItem_mcji_cotizacion  DEFAULT (0),
	mcji_origen decimal(18, 6) NOT NULL CONSTRAINT DF_MovimientoCajaItem_mcji_origen  DEFAULT (0),
	mon_id int NOT NULL,
	cue_id_trabajo int NOT NULL,
	cue_id_fondos int NOT NULL,
	ccos_id int NULL,
	cheq_id int NULL,
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
CREATE TABLE DepositoBancoItem(
	dbco_id int NOT NULL,
	dbcoi_id int NOT NULL,
	dbcoi_orden smallint NOT NULL,
	dbcoi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_DepositoBancoItem_dbcoi_importe  DEFAULT (0),
	dbcoi_importeorigen decimal(18, 6) NOT NULL CONSTRAINT DF_DepositoBancoItem_dbcoi_importeorigen  DEFAULT (0),
	dbcoi_descrip varchar(5000) NOT NULL CONSTRAINT DF_DepositoBancoItem_dbcoi_descrip  DEFAULT (''),
	dbcoi_tipo smallint NOT NULL CONSTRAINT DF_DepositoBancoItem_dbcoi_tipo  DEFAULT (0),
	cue_id int NULL,
	cheq_id int NULL,
	chq_id int NULL,
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
CREATE TABLE ClienteCuentaGrupo(
	cli_id int NOT NULL,
	cueg_id int NOT NULL,
	clicueg_id int NOT NULL,
	cue_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ClienteCuentaGrupo_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ClienteCuentaGrupo_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE AsientoItem(
	as_id int NOT NULL,
	asi_id int NOT NULL,
	asi_orden smallint NOT NULL,
	asi_descrip varchar(5000) NOT NULL CONSTRAINT DF_AsientoItem_asi_descrip  DEFAULT (''),
	asi_debe decimal(18, 6) NOT NULL CONSTRAINT DF_AsientoItem_asi_importe  DEFAULT (0),
	asi_haber decimal(18, 6) NOT NULL CONSTRAINT DF_AsientoItem_asi_haber  DEFAULT (0),
	asi_origen decimal(18, 6) NOT NULL CONSTRAINT DF_AsientoItem_asi_origen  DEFAULT (0),
	asi_tipo smallint NOT NULL CONSTRAINT DF_AsientoItem_asi_tipo  DEFAULT (0),
	asi_conciliado smallint NOT NULL CONSTRAINT DF_AsientoItem_asi_conciliado  DEFAULT (1),
	mon_id int NOT NULL,
	cue_id int NOT NULL,
	ccos_id int NULL,
	cheq_id int NULL,
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
CREATE TABLE FacturaCompraOtro(
	fc_id int NOT NULL,
	fcot_id int NOT NULL,
	fcot_orden smallint NOT NULL CONSTRAINT DF_FacturaCompraOtro_fcot_orden  DEFAULT (0),
	fcot_debe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraOtro_fcot_debe  DEFAULT (0),
	fcot_haber decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraOtro_fcot_haber  DEFAULT (0),
	fcot_origen decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraOtro_fcot_origen  DEFAULT (0),
	fcot_descrip varchar(255) NOT NULL CONSTRAINT DF_FacturaCompraOtro_fcot_descrip  DEFAULT (''),
	cue_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE TarjetaCredito(
	tjc_id int NOT NULL,
	tjc_nombre varchar(100) NOT NULL,
	tjc_codigo varchar(15) NOT NULL,
	tjc_descrip varchar(255) NOT NULL CONSTRAINT DF_TarjetaCredito_tjc_descrip  DEFAULT (''),
	tjc_comision decimal(18, 6) NOT NULL CONSTRAINT DF_TarjetaCredito_tjc_comision  DEFAULT (0),
	emp_id int NOT NULL,
	cue_id_encartera int NOT NULL,
	cue_id_banco int NOT NULL,
	cue_id_presentado int NOT NULL,
	cue_id_rechazo int NOT NULL,
	cue_id_comision int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_TarjetaCredito_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_TarjetaCredito_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_TarjetaCredito_activo  DEFAULT (1),
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
CREATE TABLE CashFlowParam(
	cf_id int NOT NULL,
	cfp_id int NOT NULL,
	bco_id int NULL,
	cli_id int NULL,
	prov_id int NULL,
	cue_id int NULL,
 CONSTRAINT PK_CashFlowParam PRIMARY KEY  
(
	cfp_id 
) 
) 
;
/****** Object:  Table TipoOperacionCuentaGrupo    Script Date: 07/30/2012 17:31:44 ******/

;

;
CREATE TABLE TipoOperacionCuentaGrupo(
	to_id int NOT NULL,
	cueg_id int NOT NULL,
	tocueg_id int NOT NULL,
	cue_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_TipoOperacionCuentaGrupo_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_TipoOperacionCuentaGrupo_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE EjercicioContable(
	ejc_id int NOT NULL,
	ejc_nombre varchar(255) NOT NULL,
	ejc_codigo varchar(15) NOT NULL,
	ejc_fechaini timestamptz NOT NULL,
	ejc_fechafin timestamptz NOT NULL,
	ejc_descrip varchar(255) NOT NULL CONSTRAINT DF_EjercicioContable_ej_descrip  DEFAULT (''),
	as_id_apertura int NULL,
	as_id_cierrepatrimonial int NULL,
	as_id_cierreresultados int NULL,
	emp_id varchar(50) NOT NULL CONSTRAINT DF_EjercicioContable_emp_id  DEFAULT (''),
	cico_id varchar(50) NOT NULL CONSTRAINT DF_EjercicioContable_cico_id  DEFAULT (''),
	cue_id_resultado int NULL,
	doc_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_EjercicioContable_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_EjercicioContable_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE AjusteInflacion(
	aje_id int NOT NULL,
	aje_nombre varchar(255) NOT NULL,
	aje_codigo varchar(15) NOT NULL,
	aje_descrip varchar(255) NOT NULL CONSTRAINT DF_AjusteInflacion_aje_descrip  DEFAULT (''),
	aje_metodo smallint NOT NULL CONSTRAINT DF_AjusteInflacion_aje_metodo  DEFAULT (1),
	aje_agrupaccos smallint NOT NULL CONSTRAINT DF_AjusteInflacion_aje_agrupactc  DEFAULT (0),
	aje_incluirsinccos smallint NOT NULL CONSTRAINT DF_AjusteInflacion_aje_incluirsinctc  DEFAULT (0),
	cue_id_patrimonial int NOT NULL,
	cue_id_resultados int NOT NULL,
	ccos_id varchar(50) NOT NULL CONSTRAINT DF_AjusteInflacion_ccos_id  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_AjusteInflacion_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_AjusteInflacion_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_AjusteInflacion_activo  DEFAULT (1),
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
CREATE TABLE ProveedorCuentaGrupo(
	prov_id int NOT NULL,
	cueg_id int NOT NULL,
	provcueg_id int NOT NULL,
	cue_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ProveedorCuentaGrupo_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ProveedorCuentaGrupo_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE VentaModo(
	vm_id int NOT NULL,
	vm_nombre varchar(100) NOT NULL,
	vm_codigo varchar(15) NOT NULL,
	vm_descrip varchar(255) NOT NULL CONSTRAINT DF_VentaModo_vm_descrip  DEFAULT (''),
	vm_ctacte smallint NOT NULL,
	vm_pv smallint NOT NULL CONSTRAINT DF_VentaModo_vm_pv  DEFAULT (0),
	vm_os smallint NOT NULL CONSTRAINT DF_VentaModo_vm_os  DEFAULT (0),
	vm_cmvxi smallint NOT NULL CONSTRAINT DF_VentaModo_vm_cmvxi  DEFAULT (0),
	vm_cobz smallint NOT NULL CONSTRAINT DF_VentaModo_vm_cobz  DEFAULT (0),
	cue_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_VentaModo_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_VentaModo_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_VentaModo_activo  DEFAULT (1),
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
CREATE TABLE ResolucionCuponItem(
	rcup_id int NOT NULL,
	rcupi_id int NOT NULL,
	rcupi_orden smallint NOT NULL,
	rcupi_cuota smallint NOT NULL CONSTRAINT DF_ResolucionCuponItem_rcupi_cuota  DEFAULT (0),
	rcupi_comision decimal(18, 6) NOT NULL CONSTRAINT DF_ResolucionCuponItem_rcupi_interes  DEFAULT (0),
	rcupi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_ResolucionCuponItem_rcupi_importe  DEFAULT (0),
	rcupi_importeorigen decimal(18, 6) NOT NULL CONSTRAINT DF_ResolucionCuponItem_rcupi_importeorigen  DEFAULT (0),
	rcupi_descrip varchar(5000) NOT NULL CONSTRAINT DF_ResolucionCuponItem_rcupi_descrip  DEFAULT (''),
	rcupi_rechazado smallint NOT NULL CONSTRAINT DF_ResolucionCuponItem_rcupi_rechazado  DEFAULT (0),
	cue_id int NULL,
	tjcc_id int NULL,
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
CREATE TABLE FacturaVentaItem(
	fv_id int NOT NULL,
	fvi_id int NOT NULL,
	fvi_orden smallint NOT NULL,
	fvi_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItem_fvi_cantidad  DEFAULT (0),
	fvi_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItem_fvi_cantidadaremitir  DEFAULT (0),
	fvi_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItem_fvi_pendiente_1  DEFAULT (0),
	fvi_pendientepklst decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItem_fvi_pendientepk  DEFAULT (0),
	fvi_descrip varchar(5000) NOT NULL CONSTRAINT DF_FacturaVentaItem_fvi_descrip  DEFAULT (''),
	fvi_precio decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItem_fvi_precio  DEFAULT (0),
	fvi_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItem_fvi_precioUsr  DEFAULT (0),
	fvi_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItem_fvi_precioLista  DEFAULT (0),
	fvi_descuento varchar(100) NOT NULL CONSTRAINT DF_FacturaVentaItem_fvi_descuento  DEFAULT (''),
	fvi_neto decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItem_fv_neto  DEFAULT (0),
	fvi_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItem_fvi_ivari  DEFAULT (0),
	fvi_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItem_fvi_ivarni  DEFAULT (0),
	fvi_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItem_fvi_ivariporc  DEFAULT (0),
	fvi_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItem_fvi_ivarniporc  DEFAULT (0),
	fvi_internosporc decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItem_fci_internosporc  DEFAULT (0),
	fvi_internos decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItem_fci_internos  DEFAULT (0),
	fvi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItem_fvi_importe  DEFAULT (0),
	fvi_importeorigen decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItem_fv_importeorigen  DEFAULT (0),
	fvi_nostock smallint NOT NULL CONSTRAINT DF_FacturaVentaItem_fvi_nostock  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
	cue_id int NOT NULL,
	cue_id_ivari int NULL,
	cue_id_ivarni int NULL,
	to_id int NOT NULL,
	stl_id int NULL,
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
CREATE TABLE CajaCuenta(
	cj_id int NOT NULL,
	cjc_id int NOT NULL,
	cue_id_trabajo int NOT NULL,
	cue_id_fondos int NOT NULL,
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
CREATE TABLE Cheque(
	cheq_id int NOT NULL,
	cheq_numero int NOT NULL CONSTRAINT DF_Cheque_cheq_numero  DEFAULT (0),
	cheq_numerodoc varchar(100) NOT NULL CONSTRAINT DF_Cheque_cheq_numerodoc  DEFAULT (''),
	cheq_importe decimal(18, 6) NOT NULL CONSTRAINT DF_Cheque_cheq_importe  DEFAULT (0),
	cheq_importeOrigen decimal(18, 6) NOT NULL CONSTRAINT DF_Cheque_cheq_importeOrigen  DEFAULT (0),
	cheq_tipo smallint NOT NULL,
	cheq_fechacobro timestamptz NOT NULL CONSTRAINT DF_Cheque_cheq_fechacobro  DEFAULT (getdate()),
	cheq_fechaVto timestamptz NOT NULL,
	cheq_fecha2 timestamptz NOT NULL CONSTRAINT DF_Cheque_cheq_fecha2  DEFAULT (getdate()),
	cheq_descrip varchar(255) NOT NULL CONSTRAINT DF_Cheque_cheq_descrip  DEFAULT (''),
	cheq_anulado smallint NOT NULL CONSTRAINT DF_Cheque_cheq_anulado  DEFAULT (0),
	cheq_fv_importe decimal(18, 6) NOT NULL CONSTRAINT DF_Cheque_cheq_fv_importe  DEFAULT (0),
	cheq_fechaRechazo timestamptz NOT NULL CONSTRAINT DF_Cheque_cheq_fechaRechazo  DEFAULT ('19000101'),
	cheq_rechazado smallint NOT NULL CONSTRAINT DF_Cheque_cheq_rechazado  DEFAULT (0),
	cheq_fc_importe1 decimal(18, 6) NOT NULL CONSTRAINT DF_Cheque_cheq_fc_importe1  DEFAULT (0),
	cheq_fc_importe2 decimal(18, 6) NOT NULL CONSTRAINT DF_Cheque_cheq_fc_importe11  DEFAULT (0),
	cheq_cacheproc timestamptz NOT NULL CONSTRAINT DF_Cheque_cheq_cacheproc  DEFAULT ('19000101'),
	cheq_propio smallint NOT NULL CONSTRAINT DF_Cheque_cheq_propio  DEFAULT (0),
	cheq_sucursal varchar(255) NOT NULL CONSTRAINT DF_Cheque_cheq_sucursal  DEFAULT (''),
	cobz_id int NULL,
	opg_id int NULL,
	dbco_id int NULL,
	cle_id int NOT NULL,
	chq_id int NULL,
	bco_id int NOT NULL,
	cli_id int NULL,
	prov_id int NULL,
	mon_id int NOT NULL,
	cue_id int NULL,
	mf_id int NULL,
	emp_id int NOT NULL,
	fc_id_nd1 int NULL,
	fc_id_nd2 int NULL,
	fv_id_nd int NULL,
 CONSTRAINT PK_Cheque PRIMARY KEY  
(
	cheq_id 
) ,
 CONSTRAINT IX_Cheque UNIQUE  
(
	emp_id ,
	bco_id ,
	cheq_numerodoc 
) 
) 
;

;
/****** Object:  Table RetencionTipo    Script Date: 07/30/2012 17:29:33 ******/

;

;

;
CREATE TABLE RetencionTipo(
	rett_id int NOT NULL,
	rett_nombre varchar(100) NOT NULL,
	rett_codigo varchar(15) NOT NULL,
	rett_descrip varchar(255) NOT NULL CONSTRAINT DF_RetencionTipo_rett_descrip  DEFAULT (''),
	rett_generasicore smallint NOT NULL,
	rett_codigosicore varchar(50) NOT NULL CONSTRAINT DF_RetencionTipo_rett_codigosicore  DEFAULT (''),
	rett_tipo smallint NOT NULL,
	cue_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_RetencionTipo_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_RetencionTipo_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_RetencionTipo_activo  DEFAULT (1),
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
CREATE TABLE DepositoCuponItem(
	dcup_id int NOT NULL,
	dcupi_id int NOT NULL,
	dcupi_orden smallint NOT NULL,
	dcupi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_DepositoCuponItem_dcupi_importe  DEFAULT (0),
	dcupi_importeorigen decimal(18, 6) NOT NULL CONSTRAINT DF_DepositoCuponItem_dcupi_importeorigen  DEFAULT (0),
	dcupi_descrip varchar(5000) NOT NULL CONSTRAINT DF_DepositoCuponItem_dcupi_descrip  DEFAULT (''),
	cue_id int NULL,
	tjcc_id int NULL,
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
CREATE TABLE TarjetaCreditoCuota(
	tjc_id int NOT NULL,
	tjccu_id int NOT NULL,
	tjccu_cantidad smallint NOT NULL CONSTRAINT DF_TarjetaCreditoCuota_tjccu_cantidad  DEFAULT (0),
	tjccu_comision decimal(18, 6) NOT NULL CONSTRAINT DF_TarjetaCreditoCuota_tjccu_comision  DEFAULT (0),
	creado timestamptz NOT NULL CONSTRAINT DF_TarjetaCreditoCuota_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_TarjetaCreditoCuota_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE TarjetaCreditoCupon(
	tjc_id int NOT NULL,
	tjcc_id int NOT NULL,
	tjcc_numero int NOT NULL CONSTRAINT DF_TarjetaCreditoCupon_tjcc_numero  DEFAULT (0),
	tjcc_numerodoc varchar(100) NOT NULL CONSTRAINT DF_TarjetaCreditoCupon_tjcc_numerodoc  DEFAULT (''),
	tjcc_descrip varchar(255) NOT NULL CONSTRAINT DF_TarjetaCreditoCupon_tjcc_descrip  DEFAULT (''),
	tjcc_fechavto timestamptz NOT NULL CONSTRAINT DF_TarjetaCreditoCupon_tjcc_fechavto  DEFAULT (getdate()),
	tjcc_nroTarjeta varchar(100) NOT NULL,
	tjcc_nroAutorizacion varchar(100) NOT NULL CONSTRAINT DF_TarjetaCreditoCupon_tjcc_nroAutorizacion  DEFAULT (''),
	tjcc_titular varchar(255) NOT NULL,
	tjcc_importe decimal(18, 6) NOT NULL CONSTRAINT DF_TarjetaCreditoCupon_tjcc_importe  DEFAULT (0),
	tjcc_importeOrigen decimal(18, 6) NOT NULL CONSTRAINT DF_TarjetaCreditoCupon_tjcc_importeOrigen  DEFAULT (0),
	tjcc_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_TarjetaCreditoCupon_tjcc_pendiente  DEFAULT (0),
	cli_id int NOT NULL,
	cue_id int NOT NULL,
	cobz_id int NOT NULL,
	mon_id int NOT NULL,
	tjccu_id int NOT NULL,
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
CREATE TABLE CobranzaItemBorradoTMP(
	cobzTMP_id int NOT NULL,
	cobzibTMP_id int NOT NULL,
	cobz_id int NOT NULL,
	cobzi_id int NOT NULL,
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
CREATE TABLE CobranzaItemTMP(
	cobzTMP_id int NOT NULL,
	cobziTMP_id int NOT NULL,
	cobzi_id int NOT NULL,
	cobzi_orden smallint NOT NULL CONSTRAINT DF_CobranzaItemTMP_cobzi_orden  DEFAULT (0),
	cobzi_otroTipo smallint NOT NULL CONSTRAINT DF_CobranzaItemTMP_cobzi_otroTipo  DEFAULT (0),
	cobzi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_CobranzaItemTMP_cobzi_importe  DEFAULT (0),
	cobzi_importeOrigen decimal(18, 6) NOT NULL CONSTRAINT DF_CobranzaItemTMP_cobzi_importeOrigen  DEFAULT (0),
	cobzi_descrip varchar(255) NOT NULL CONSTRAINT DF_CobranzaItemTMP_cobzi_descrip  DEFAULT (''),
	cobzi_porcRetencion decimal(18, 6) NOT NULL CONSTRAINT DF_CobranzaItemTMP_cobzi_porcRetencion  DEFAULT (0),
	cobzi_fechaRetencion timestamptz NOT NULL CONSTRAINT DF_CobranzaItemTMP_cobzi_fechaRetencion  DEFAULT (getdate()),
	cobzi_nroRetencion varchar(100) NOT NULL CONSTRAINT DF_CobranzaItemTMP_cobzi_nroRetencion  DEFAULT (''),
	cobzi_tipo smallint NOT NULL CONSTRAINT DF_CobranzaItemTMP_cobzi_tipo  DEFAULT (0),
	cobzi_tarjetaTipo smallint NOT NULL CONSTRAINT DF_CobranzaItemTMP_cobzi_tarjetaTipo  DEFAULT (1),
	cobziTMP_cheque varchar(50) NOT NULL CONSTRAINT DF_CobranzaItemTMP_cobziTMP_cheqe  DEFAULT (''),
	cobziTMP_cupon varchar(50) NOT NULL CONSTRAINT DF_CobranzaItemTMP_cobziTMP_cupon  DEFAULT (''),
	cobziTMP_fechaCobro timestamptz NOT NULL CONSTRAINT DF_CobranzaItemTMP_cobziTMP_fechaVto1  DEFAULT (getdate()),
	cobziTMP_fechaVto timestamptz NOT NULL CONSTRAINT DF_CobranzaItemTMP_cobziTMP_fechaVto  DEFAULT (getdate()),
	cobziTMP_titular varchar(255) NOT NULL CONSTRAINT DF_CobranzaItemTMP_cobziTMP_titular  DEFAULT (''),
	cobziTMP_autorizacion varchar(50) NOT NULL CONSTRAINT DF_CobranzaItemTMP_cobziTMP_autorizacion  DEFAULT (''),
	cobziTMP_nroTarjeta varchar(50) NOT NULL CONSTRAINT DF_CobranzaItemTMP_cobziTMP_nroTarjeta  DEFAULT (''),
	cobziTMP_propio smallint NOT NULL CONSTRAINT DF_CobranzaItemTMP_cobziTMP_propio  DEFAULT (0),
	cobziTMP_sucursal varchar(255) NOT NULL CONSTRAINT DF_CobranzaItemTMP_cobziTMP_sucursal  DEFAULT (''),
	cheq_id int NULL,
	cue_id int NULL,
	tjcc_id int NULL,
	ccos_id int NULL,
	tjc_id int NULL,
	bco_id int NULL,
	cle_id int NULL,
	mon_id int NULL,
	tjccu_id int NULL,
	ret_id int NULL,
	fv_id_ret int NULL,
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
CREATE TABLE FacturaVentaCobranzaTMP(
	cobzTMP_id int NOT NULL,
	fvcobzTMP_id int NOT NULL,
	fvcobz_id int NOT NULL,
	fvcobz_importe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaCobranzaTMP_fvcob_importe  DEFAULT (0),
	fvcobz_importeOrigen decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaCobranzaTMP_fvcobz_importeOrigen  DEFAULT (0),
	fvcobz_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaCobranzaTMP_fvcobz_cotizacion  DEFAULT (0),
	fv_id int NOT NULL,
	fvd_id int NULL,
	fvp_id int NULL,
	cobz_id int NOT NULL,
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
CREATE TABLE ImportacionTempItemSerieTMP(
	imptTMP_id int NOT NULL,
	imptiTMP_id int NOT NULL,
	impti_id int NOT NULL CONSTRAINT DF_ImportacionTempItemSerieTMP_impti_id  DEFAULT (0),
	imptisTMP_id int NOT NULL,
	rcis_orden smallint NOT NULL CONSTRAINT DF_ImportacionTempItemSerieTMP_rcis_orden  DEFAULT (0),
	prns_codigo varchar(100) NOT NULL CONSTRAINT DF_ImportacionTempItemSerieTMP_prns_codigo  DEFAULT (''),
	prns_descrip varchar(255) NOT NULL CONSTRAINT DF_ImportacionTempItemSerieTMP_prns_descrip  DEFAULT (''),
	prns_fechavto timestamptz NOT NULL CONSTRAINT DF_ImportacionTempItemSerieTMP_prns_fechavto  DEFAULT (getdate()),
	pr_id int NOT NULL,
	prns_id int NOT NULL CONSTRAINT DF_ImportacionTempItemSerieTMP_prns_id  DEFAULT (0),
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
CREATE TABLE AFIPParametro(
	afparam_id int NOT NULL,
	afparam_nombre varchar(100) NOT NULL,
	afparam_descrip varchar(255) NOT NULL CONSTRAINT DF_AFIPParametro_afparam_descrip  DEFAULT (''),
	afparam_tipo smallint NOT NULL,
	afparam_subTipo smallint NOT NULL CONSTRAINT DF_AFIPParametro_afparam_subTipo  DEFAULT (0),
	afparam_tablaHelp int NOT NULL CONSTRAINT DF_AFIPParametro_afparam_tablaHelp  DEFAULT (0),
	afparam_valor varchar(5000) NOT NULL CONSTRAINT DF_AFIPParametro_afparam_valor  DEFAULT (''),
	afparam_avanzado smallint NOT NULL CONSTRAINT DF_AFIPParametro_afparam_avanzado  DEFAULT (0),
	afesq_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_AFIPParametro_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_AFIPParametro_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_AFIPParametro_activo  DEFAULT (1),
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
CREATE TABLE AFIPArchivo(
	afarch_id int NOT NULL,
	afarch_nombre varchar(100) NOT NULL,
	afarch_descrip varchar(255) NOT NULL CONSTRAINT DF_AFIPArchivo_afarch_descrip  DEFAULT (''),
	afarch_separadorRegistro varchar(5) NOT NULL CONSTRAINT DF_AFIPArchivo_afarch_separadorRegistro  DEFAULT (''),
	afarch_objetoentrada varchar(255) NOT NULL,
	afesq_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_AFIPArchivo_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_AFIPArchivo_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_AFIPArchivo_activo  DEFAULT (1),
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
CREATE TABLE OrdenRemitoVenta(
	osrv_id int NOT NULL,
	osrv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenRemitoVenta_osrv_cantidad  DEFAULT (0),
	osi_id int NOT NULL,
	rvi_id int NOT NULL,
 CONSTRAINT PK_OrdenRemitoVenta PRIMARY KEY  
(
	osrv_id 
) 
) 
;
/****** Object:  Table RemitoDevolucionVenta    Script Date: 07/30/2012 17:28:15 ******/

;

;
CREATE TABLE RemitoDevolucionVenta(
	rvdv_id int NOT NULL,
	rvdv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoDevolucionVenta_rvrd_cantidad  DEFAULT (0),
	rvi_id_remito int NOT NULL,
	rvi_id_devolucion int NOT NULL,
 CONSTRAINT PK_RemitoDevolucionVenta PRIMARY KEY  
(
	rvdv_id 
) 
) 
;
/****** Object:  Table RemitoFacturaVenta    Script Date: 07/30/2012 17:28:20 ******/

;

;
CREATE TABLE RemitoFacturaVenta(
	rvfv_id int NOT NULL,
	rvfv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoFacturaVenta_rvfv_cantidad  DEFAULT (0),
	rvi_id int NOT NULL,
	fvi_id int NOT NULL,
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
CREATE TABLE ManifiestoCarga(
	mfc_id int NOT NULL,
	mfc_numero int NOT NULL,
	mfc_nrodoc varchar(20) NOT NULL CONSTRAINT DF_ManifiestoCarga_mfc_nrodoc  DEFAULT (''),
	mfc_fecha timestamptz NOT NULL CONSTRAINT DF_ManifiestoCarga_mfc_fecha  DEFAULT (getdate()),
	mfc_fechadoc timestamptz NOT NULL CONSTRAINT DF_ManifiestoCarga_mfc_fechaRegistracion  DEFAULT (getdate()),
	mfc_horapartida timestamptz NOT NULL,
	mfc_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCarga_mfc_pendiente  DEFAULT (0),
	mfc_chasis varchar(100) NOT NULL CONSTRAINT DF_ManifiestoCarga_mfc_chasis  DEFAULT (''),
	mfc_acoplado varchar(100) NOT NULL CONSTRAINT DF_ManifiestoCarga_mfc_acoplado  DEFAULT (''),
	mfc_descrip varchar(255) NOT NULL CONSTRAINT DF_ManifiestoCarga_mfc_descrip  DEFAULT (''),
	mfc_firmado int NOT NULL CONSTRAINT DF_ManifiestoCarga_mfc_firmado  DEFAULT (0),
	mfc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCarga_mfc_cantidad  DEFAULT (0),
	mfc_total decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCarga_mfc_total  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	cli_id int NOT NULL,
	ccos_id int NULL,
	cmarc_id int NULL,
	pue_id_origen int NULL,
	pue_id_destino int NULL,
	depl_id_origen int NULL,
	depl_id_destino int NULL,
	barc_id int NULL,
	trans_id int NULL,
	chof_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ManifiestoCarga_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ManifiestoCarga_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
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
CREATE TABLE Ciudad(
	ciu_id int NOT NULL,
	ciu_nombre varchar(100) NOT NULL,
	ciu_codigo varchar(15) NOT NULL,
	ciu_descrip varchar(255) NOT NULL CONSTRAINT DF_Ciudad_ciu_descrip  DEFAULT (''),
	pro_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Ciudad_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Ciudad_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Ciudad_activo  DEFAULT (1),
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
CREATE TABLE Persona(
	prs_id int NOT NULL,
	prs_apellido varchar(100) NOT NULL CONSTRAINT DF_Persona_prs_apellido  DEFAULT (''),
	prs_nombre varchar(100) NOT NULL CONSTRAINT DF_Persona_prs_nombre  DEFAULT (''),
	prs_codigo varchar(100) NOT NULL,
	prs_documento varchar(50) NOT NULL CONSTRAINT DF_Persona_prs_documento  DEFAULT (''),
	prs_descrip varchar(255) NOT NULL CONSTRAINT DF_Persona_prs_descrip  DEFAULT (''),
	prs_interno varchar(50) NOT NULL CONSTRAINT DF_Persona_prs_interno  DEFAULT (''),
	prs_telTrab varchar(50) NOT NULL CONSTRAINT DF_Persona_prs_tel  DEFAULT (''),
	prs_telCasa varchar(50) NOT NULL CONSTRAINT DF_Persona_prs_telCasa  DEFAULT (''),
	prs_celular varchar(50) NOT NULL CONSTRAINT DF_Persona_prs_celular  DEFAULT (''),
	prs_email varchar(50) NOT NULL CONSTRAINT DF_Persona_prs_email  DEFAULT (''),
	prs_web varchar(255) NOT NULL CONSTRAINT DF_Persona_prs_web  DEFAULT (''),
	prs_cargo varchar(100) NOT NULL CONSTRAINT DF_Persona_prs_cargo  DEFAULT (''),
	prs_codpostal varchar(50) NOT NULL CONSTRAINT DF_Persona_cli_codpostal  DEFAULT (''),
	prs_localidad varchar(100) NOT NULL CONSTRAINT DF_Persona_cli_localidad  DEFAULT (''),
	prs_calle varchar(100) NOT NULL CONSTRAINT DF_Persona_cli_calle  DEFAULT (''),
	prs_callenumero varchar(100) NOT NULL CONSTRAINT DF_Persona_cli_callenumero  DEFAULT ('s/n'),
	prs_piso varchar(100) NOT NULL CONSTRAINT DF_Persona_cli_piso  DEFAULT ('PB'),
	prs_depto varchar(100) NOT NULL CONSTRAINT DF_Persona_cli_depto  DEFAULT (''),
	prs_fechaNac timestamptz NOT NULL CONSTRAINT DF_Persona_prs_fechaNac  DEFAULT (to_date('19000101', 'yyyymmdd')),
	prs_sexo smallint NOT NULL CONSTRAINT DF_Persona_prs_sexo  DEFAULT (0),
	prs_icq varchar(255) NOT NULL CONSTRAINT DF__persona__prs_icq__7BD3B2BD  DEFAULT (''),
	prs_idnextel varchar(255) NOT NULL CONSTRAINT DF__persona__prs_idn__7CC7D6F6  DEFAULT (''),
	prs_messenger varchar(255) NOT NULL CONSTRAINT DF__persona__prs_mes__7DBBFB2F  DEFAULT (''),
	prs_aniversario timestamptz NOT NULL CONSTRAINT DF__persona__prs_ani__7EB01F68  DEFAULT (to_date('19000101', 'yyyymmdd')),
	prs_titulo varchar(255) NOT NULL CONSTRAINT DF__persona__prs_tit__7ADF8E84  DEFAULT (''),
	prs_esempleado smallint NOT NULL CONSTRAINT DF_Persona_prs_esempleado  DEFAULT (0),
	prsdt_id int NULL,
	pro_id int NULL,
	cli_id int NULL,
	prov_id int NULL,
	dpto_id int NULL,
	suc_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Persona_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Persona_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Persona_activo  DEFAULT (1),
	prs_ApellidoCasado varchar(255) NOT NULL CONSTRAINT DF__persona__prs_Ape__79EB6A4B  DEFAULT (''),
	estc_id int NULL,
	pa_id int NULL,
	nive_id int NULL,
	profe_id int NULL,
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
CREATE TABLE Empleado(
	em_id int NOT NULL,
	em_apellido varchar(255) NOT NULL CONSTRAINT DF_Empleado_em_apellido  DEFAULT (''),
	em_nombre varchar(255) NOT NULL CONSTRAINT DF_Empleado_em_nombre  DEFAULT (''),
	em_codigo varchar(15) NOT NULL,
	em_legajo varchar(50) NOT NULL CONSTRAINT DF_Empleado_em_legajo  DEFAULT (''),
	em_ingreso timestamptz NOT NULL CONSTRAINT DF_Empleado_em_ingreso  DEFAULT ('19000101'),
	em_egreso timestamptz NOT NULL CONSTRAINT DF_Empleado_em_egreso  DEFAULT ('19000101'),
	em_cuil varchar(20) NOT NULL CONSTRAINT DF_Empleado_em_cuil  DEFAULT (''),
	em_dni varchar(20) NOT NULL CONSTRAINT DF_Empleado_em_dni  DEFAULT (''),
	em_fechanacimiento timestamptz NOT NULL CONSTRAINT DF_Empleado_em_fechanacimiento  DEFAULT ('19000101'),
	em_codpostal varchar(50) NOT NULL CONSTRAINT DF_Empleado_cli_codpostal  DEFAULT (''),
	em_localidad varchar(100) NOT NULL CONSTRAINT DF_Empleado_cli_localidad  DEFAULT (''),
	em_calle varchar(100) NOT NULL CONSTRAINT DF_Empleado_cli_calle  DEFAULT (''),
	em_callenumero varchar(100) NOT NULL CONSTRAINT DF_Empleado_cli_callenumero  DEFAULT ('s/n'),
	em_piso varchar(100) NOT NULL CONSTRAINT DF_Empleado_cli_piso  DEFAULT ('PB'),
	em_depto varchar(100) NOT NULL CONSTRAINT DF_Empleado_cli_depto  DEFAULT (''),
	em_tel varchar(100) NOT NULL CONSTRAINT DF_Empleado_cli_tel  DEFAULT (''),
	em_email varchar(100) NOT NULL CONSTRAINT DF_Empleado_em_email  DEFAULT (''),
	em_libreta varchar(20) NOT NULL CONSTRAINT DF_Empleado_em_libreta  DEFAULT (''),
	em_tipoLiquidacion smallint NOT NULL CONSTRAINT DF_Empleado_em_tipoLiquidacion  DEFAULT (1),
	em_ctaBanco varchar(20) NOT NULL CONSTRAINT DF_Empleado_em_ctaBanco  DEFAULT (''),
	em_fdoDesempleo varchar(20) NOT NULL CONSTRAINT DF_Empleado_em_fdoDesempleo  DEFAULT (''),
	em_obraSocial varchar(20) NOT NULL CONSTRAINT DF_Empleado_em_obraSocial  DEFAULT (''),
	em_banelco smallint NOT NULL CONSTRAINT DF_Empleado_em_banelco  DEFAULT (0),
	em_preocupacional smallint NOT NULL CONSTRAINT DF_Empleado_em_preocupacional  DEFAULT (0),
	em_lugarNacimiento varchar(255) NOT NULL CONSTRAINT DF_Empleado_em_lugarNacimiento  DEFAULT (''),
	em_descrip varchar(1000) NOT NULL CONSTRAINT DF_Empleado_em_descrip  DEFAULT (''),
	estc_id int NOT NULL,
	sind_id int NULL,
	sindco_id int NULL,
	sindca_id int NULL,
	ema_id int NULL,
	eme_id int NOT NULL,
	pro_id int NOT NULL,
	pa_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Empleado_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Empleado_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Empleado_activo  DEFAULT (1),
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
CREATE TABLE Feriado(
	fe_id int NOT NULL,
	fe_nombre varchar(100) NOT NULL,
	fe_codigo varchar(15) NOT NULL,
	fe_descrip varchar(100) NOT NULL CONSTRAINT DF_FeriadoBancario_fb_descrip  DEFAULT (''),
	fe_dia smallint NOT NULL,
	fe_mes smallint NOT NULL,
	fe_anio smallint NOT NULL,
	fe_banco smallint NOT NULL,
	fe_laboral smallint NOT NULL,
	fe_local smallint NOT NULL,
	pa_id int NULL,
	pro_id int NULL,
	fe_recurrente smallint NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_FeriadoBancario_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_FeriadoBancario_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE CodigoPostalItem(
	cpa_id int NOT NULL,
	cpai_id int NOT NULL,
	cpai_calle varchar(1000) NOT NULL CONSTRAINT DF_CodigoPostalItem_cpa_calle  DEFAULT (''),
	cpai_desde int NOT NULL CONSTRAINT DF_CodigoPostalItem_cpa_desde  DEFAULT (0),
	cpai_hasta int NOT NULL CONSTRAINT DF_CodigoPostalItem_cpa_hasta  DEFAULT (0),
	cpai_tipo smallint NOT NULL CONSTRAINT DF_CodigoPostalItem_cpai_tipo  DEFAULT (1),
	cpai_localidad varchar(1000) NOT NULL CONSTRAINT DF_CodigoPostalItem_cpai_localidad  DEFAULT (''),
	pro_id int NOT NULL,
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
CREATE TABLE Contacto(
	agn_id int NOT NULL CONSTRAINT DF_Contacto_agn_id  DEFAULT (1),
	cont_id int NOT NULL,
	cont_apellido varchar(100) NOT NULL CONSTRAINT DF_Contacto_cont_apellido  DEFAULT (''),
	cont_nombre varchar(100) NOT NULL CONSTRAINT DF_Contacto_cont_nombre  DEFAULT (''),
	cont_codigo varchar(20) NOT NULL,
	cont_documento varchar(50) NOT NULL CONSTRAINT DF_Contacto_cont_documento  DEFAULT (''),
	cont_descrip varchar(5000) NULL CONSTRAINT DF_Contacto_cont_descrip  DEFAULT (''),
	cont_tratamiento varchar(10) NOT NULL CONSTRAINT DF_Contacto_cont_tratamiento  DEFAULT (''),
	cont_fax varchar(100) NOT NULL CONSTRAINT DF_Contacto_cont_fax  DEFAULT (''),
	cont_tel varchar(100) NOT NULL CONSTRAINT DF_Contacto_cont_tel  DEFAULT (''),
	cont_celular varchar(100) NOT NULL CONSTRAINT DF_Contacto_cont_celular  DEFAULT (''),
	cont_email varchar(100) NOT NULL CONSTRAINT DF_Contacto_cont_email  DEFAULT (''),
	cont_cargo varchar(100) NOT NULL CONSTRAINT DF_Contacto_cont_cargo  DEFAULT (''),
	cont_direccion varchar(255) NOT NULL CONSTRAINT DF_Contacto_cont_direccion  DEFAULT (''),
	cont_tipo smallint NOT NULL CONSTRAINT DF_Contacto_cont_tipo  DEFAULT (0),
	cont_fechanac timestamptz NOT NULL CONSTRAINT DF_Contacto_cont_fechanac  DEFAULT (getdate()),
	cont_categoria varchar(150) NOT NULL CONSTRAINT DF_Contacto_cont_categoria  DEFAULT (''),
	cont_cliente varchar(255) NOT NULL CONSTRAINT DF_Contacto_cont_cliente  DEFAULT (''),
	cont_proveedor varchar(255) NOT NULL CONSTRAINT DF_Contacto_cont_proveedor  DEFAULT (''),
	cont_codpostal varchar(50) NOT NULL CONSTRAINT DF_Contacto_cont_codpostal  DEFAULT (''),
	cont_ciudad varchar(255) NOT NULL CONSTRAINT DF_Contacto_cont_ciudad  DEFAULT (''),
	cont_provincia varchar(255) NOT NULL CONSTRAINT DF_Contacto_cont_provincia  DEFAULT (''),
	us_id int NULL,
	cli_id int NULL,
	prov_id int NULL,
	ciu_id int NULL,
	pro_id int NULL,
	pa_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Contacto_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Contacto_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Contacto_activo  DEFAULT (1),
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
CREATE TABLE Transporte(
	trans_id int NOT NULL,
	trans_nombre varchar(100) NOT NULL CONSTRAINT DF_DespachoTransporte_detra_nombre  DEFAULT (''),
	trans_codigo varchar(15) NOT NULL CONSTRAINT DF_DespachoTransporte_detra_alias  DEFAULT (''),
	trans_descrip varchar(255) NOT NULL CONSTRAINT DF_Transporte_trans_descrip  DEFAULT (''),
	trans_telefono varchar(50) NOT NULL CONSTRAINT DF_Transporte_trans_tefono  DEFAULT (''),
	trans_direccion varchar(50) NOT NULL CONSTRAINT DF_Transporte_trans_direccion  DEFAULT (''),
	trans_mail varchar(255) NOT NULL CONSTRAINT DF_Transporte_trans_mail  DEFAULT (''),
	trans_web varchar(255) NOT NULL CONSTRAINT DF_Transporte_trans_web  DEFAULT (''),
	trans_horario_m_desde timestamptz NOT NULL CONSTRAINT DF_Transporte_cli_horario_m_desde  DEFAULT ('19000101'),
	trans_horario_m_hasta timestamptz NOT NULL CONSTRAINT DF_Transporte_cli_horario_m_hasta  DEFAULT ('19000101'),
	trans_horario_t_desde timestamptz NOT NULL CONSTRAINT DF_Transporte_cli_horario_t_desde  DEFAULT ('19000101'),
	trans_horario_t_hasta timestamptz NOT NULL CONSTRAINT DF_Transporte_cli_horario_t_hasta  DEFAULT ('19000101'),
	prov_id int NULL,
	pro_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_DespachoTransporte_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_DespachoTransporte_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_DespachoTransporte_activo  DEFAULT (1),
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
CREATE TABLE ClienteSucursal(
	clis_id int NOT NULL,
	clis_nombre varchar(255) NOT NULL,
	clis_codigo varchar(15) NOT NULL,
	cli_id int NOT NULL,
	clis_descrip varchar(255) NOT NULL CONSTRAINT DF_ClienteSucursal_cli_descrip  DEFAULT (''),
	clis_localidad varchar(100) NOT NULL CONSTRAINT DF_ClienteSucursal_clis_localidad  DEFAULT (''),
	clis_codpostal varchar(50) NOT NULL CONSTRAINT DF_ClienteSucursal_clis_codpostal  DEFAULT (''),
	clis_calle varchar(100) NOT NULL CONSTRAINT DF_ClienteSucursal_cli_calle  DEFAULT (''),
	clis_callenumero varchar(10) NOT NULL CONSTRAINT DF_ClienteSucursal_cli_callenumero  DEFAULT ('s/n'),
	clis_piso varchar(20) NOT NULL CONSTRAINT DF_ClienteSucursal_cli_piso  DEFAULT ('PB'),
	clis_depto varchar(20) NOT NULL CONSTRAINT DF_ClienteSucursal_cli_depto  DEFAULT (''),
	clis_tel varchar(100) NOT NULL CONSTRAINT DF_ClienteSucursal_cli_tel  DEFAULT (''),
	clis_fax varchar(50) NOT NULL CONSTRAINT DF_ClienteSucursal_cli_fax  DEFAULT (''),
	clis_email varchar(100) NOT NULL CONSTRAINT DF_ClienteSucursal_cli_email  DEFAULT (''),
	clis_contacto varchar(255) NOT NULL CONSTRAINT DF_ClienteSucursal_clis_contacto  DEFAULT (''),
	zon_id int NULL,
	pro_id int NULL,
	pa_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ClienteSucursal_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ClienteSucursal_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE Permiso(
	per_id int NOT NULL,
	per_id_padre int NULL,
	pre_id int NOT NULL,
	us_id int NULL,
	rol_id int NULL,
	modificado timestamptz NOT NULL CONSTRAINT DF_Permiso_modificado  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_Permiso_creado  DEFAULT (getdate()),
	modifico int NOT NULL,
 CONSTRAINT PK_Permiso PRIMARY KEY  
(
	per_id 
) 
) 
;
/****** Object:  Table UsuarioRol    Script Date: 07/30/2012 17:32:07 ******/

;

;
CREATE TABLE UsuarioRol(
	rol_id int NOT NULL,
	us_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_UsuarioRol_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_UsuarioRol_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
 CONSTRAINT PK_UsuarioRol PRIMARY KEY  
(
	rol_id ,
	us_id 
) 
) 
;
/****** Object:  Table Garantia    Script Date: 07/30/2012 17:13:12 ******/

;

;

;
CREATE TABLE Garantia(
	gar_id int NOT NULL,
	gar_codigo varchar(15) NOT NULL,
	gar_nropoliza varchar(50) NOT NULL,
	gar_codigoaduana varchar(50) NOT NULL,
	gar_fecha timestamptz NOT NULL CONSTRAINT DF_Garantia_gar_fecha  DEFAULT (getdate()),
	gar_fechainicio timestamptz NOT NULL,
	gar_fechavto timestamptz NOT NULL CONSTRAINT DF_Garantia_gar_fechavto  DEFAULT (getdate()),
	gar_descrip varchar(255) NOT NULL CONSTRAINT DF_Garantia_gar_descrip  DEFAULT (''),
	gar_monto decimal(18, 6) NOT NULL CONSTRAINT DF_Garantia_gar_monto  DEFAULT (0),
	gar_cuota decimal(18, 6) NOT NULL CONSTRAINT DF_Garantia_gar_cuota  DEFAULT (0),
	gar_diavtocuota smallint NOT NULL CONSTRAINT DF_Garantia_gar_diavtocuota  DEFAULT (0),
	prov_id int NOT NULL,
	mon_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Garantia_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Garantia_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE MovimientoFondo(
	mf_id int NOT NULL,
	mf_numero int NOT NULL,
	mf_nrodoc varchar(50) NOT NULL CONSTRAINT DF_MovimientoFondo_mf_nrodoc  DEFAULT (''),
	mf_descrip varchar(5000) NOT NULL CONSTRAINT DF_MovimientoFondo_mf_descrip  DEFAULT (''),
	mf_fecha timestamptz NOT NULL CONSTRAINT DF_MovimientoFondo_mf_fecha  DEFAULT (getdate()),
	mf_total decimal(18, 6) NOT NULL CONSTRAINT DF_MovimientoFondo_mf_total  DEFAULT (0),
	mf_totalorigen decimal(18, 6) NOT NULL CONSTRAINT DF_MovimientoFondo_mf_totalorigen  DEFAULT (0),
	mf_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_MovimientoFondo_mf_pendiente  DEFAULT (0),
	mf_firmado int NOT NULL CONSTRAINT DF_MovimientoFondo_mf_firmado  DEFAULT (0),
	mf_grabarasiento smallint NOT NULL CONSTRAINT DF_MovimientoFondo_mf_grabarasiento  DEFAULT (0),
	mf_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_MovimientoFondo_mf_cotizacion  DEFAULT (0),
	mon_id int NOT NULL,
	est_id int NOT NULL,
	suc_id int NOT NULL,
	cli_id int NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	ccos_id int NULL,
	us_id int NULL,
	as_id int NULL,
	lgj_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_MovimientoFondo_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_MovimientoFondo_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
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
CREATE TABLE Documento(
	doc_id int NOT NULL,
	doc_nombre varchar(100) NOT NULL,
	doc_codigo varchar(15) NOT NULL,
	doc_descrip varchar(5000) NOT NULL CONSTRAINT DF_Documento_doc_descrip  DEFAULT (''),
	doc_llevaFirma smallint NOT NULL CONSTRAINT DF_Documento_doc_llevaFirma  DEFAULT (0),
	doc_llevaFirmaCredito smallint NOT NULL CONSTRAINT DF_Documento_doc_llevaFirmaCredito  DEFAULT (0),
	doc_llevaFirmaPrint0 smallint NOT NULL CONSTRAINT DF_Documento_doc_llevaFirmaPrint0  DEFAULT (0),
	doc_id_asiento int NULL,
	doc_muevestock smallint NOT NULL CONSTRAINT DF_Documento_doc_generaremito  DEFAULT (0),
	doc_id_stock int NULL,
	doc_generaremito smallint NOT NULL CONSTRAINT DF_Documento_doc_generaremito_1  DEFAULT (0),
	doc_id_remito int NULL,
	doc_rv_desde_pv smallint NOT NULL CONSTRAINT DF_Documento_doc_rv_desdepv  DEFAULT (0),
	doc_rv_desde_os smallint NOT NULL CONSTRAINT DF_Documento_doc_rv_desde_os  DEFAULT (0),
	doc_rc_desde_oc smallint NOT NULL CONSTRAINT DF__documento__doc_r__53921C1D  DEFAULT (0),
	doc_rv_bom smallint NOT NULL CONSTRAINT DF_Documento_doc_rv_descargaTemp  DEFAULT (0),
	doc_pv_desde_prv smallint NOT NULL CONSTRAINT DF_Documento_doc_pv_desde_prv  DEFAULT (0),
	doc_tipofactura smallint NOT NULL CONSTRAINT DF_Documento_doc_factipo  DEFAULT (0),
	doc_tipopackinglist smallint NOT NULL CONSTRAINT DF_Documento_doc_tipopackinglist  DEFAULT (0),
	doc_tipoordencompra smallint NOT NULL CONSTRAINT DF_Documento_doc_tipoordencompra  DEFAULT (0),
	doc_st_consumo smallint NOT NULL CONSTRAINT DF_Documento_doc_st_consumo  DEFAULT (0),
	doc_rc_despachoimpo smallint NOT NULL CONSTRAINT DF_Documento_doc_rc_despachoimpo  DEFAULT (0),
	doc_fv_sinpercepcion smallint NOT NULL CONSTRAINT DF_Documento_doc_fv_sinpercepcion  DEFAULT (0),
	doc_editarimpresos smallint NOT NULL CONSTRAINT DF_Documento_doc_editarimpresos  DEFAULT (0),
	doc_esresumenbco smallint NOT NULL CONSTRAINT DF_Documento_doc_esresumenbco  DEFAULT (0),
	doc_escreditobanco smallint NOT NULL CONSTRAINT DF_Documento_doc_escreditobanco_1  DEFAULT (0),
	doc_esventaaccion smallint NOT NULL CONSTRAINT DF_Documento_doc_esventaaccion_1  DEFAULT (0),
	doc_esventacheque smallint NOT NULL CONSTRAINT DF_Documento_doc_esventacheque_1  DEFAULT (0),
	doc_escobchequesgr smallint NOT NULL CONSTRAINT DF_Documento_doc_escobchequesgr_1  DEFAULT (0),
	doc_escobcaidasgr smallint NOT NULL CONSTRAINT DF_Documento_doc_escobcaidasgr_1  DEFAULT (0),
	doc_esasientoplantilla smallint NOT NULL CONSTRAINT DF_Documento_doc_esasientoplantilla  DEFAULT (0),
	doc_asientoresumido smallint NOT NULL CONSTRAINT DF_Documento_doc_asientoresumido  DEFAULT (0),
	doc_object_edit varchar(255) NOT NULL CONSTRAINT DF_Documento_doc_os_object  DEFAULT (''),
	doc_esfacturaelectronica smallint NOT NULL CONSTRAINT DF_Documento_doc_facturaelectronica  DEFAULT (0),
	doct_id int NOT NULL,
	docg_id int NULL,
	cico_id int NULL,
	fca_id int NULL,
	ta_id int NULL,
	ta_id_final int NULL,
	ta_id_inscripto int NULL,
	ta_id_externo int NULL,
	ta_id_inscriptom int NULL,
	ta_id_haberes int NULL,
	mon_id int NULL,
	cueg_id int NULL,
	emp_id int NOT NULL,
	pre_id_new int NULL,
	pre_id_edit int NULL,
	pre_id_delete int NULL,
	pre_id_list int NULL,
	pre_id_anular int NULL,
	pre_id_desanular int NULL,
	pre_id_aplicar int NULL,
	pre_id_print int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Documento_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Documento_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Documento_activo  DEFAULT (1),
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
CREATE TABLE Cuenta(
	cue_id int NOT NULL,
	cue_nombre varchar(100) NOT NULL,
	cue_codigo varchar(15) NOT NULL,
	cue_descrip varchar(255) NOT NULL CONSTRAINT DF_Cuenta_cue_descrip  DEFAULT (''),
	cue_identificacionexterna varchar(50) NOT NULL CONSTRAINT DF_Cuenta_cue_identificacionexterna  DEFAULT (''),
	cue_llevacentrocosto smallint NOT NULL CONSTRAINT DF__Cuenta__cue_llev__5748DA5E  DEFAULT (0),
	cue_producto smallint NOT NULL CONSTRAINT DF_Cuenta_cue_producto  DEFAULT (0),
	cue_escajasucursal smallint NOT NULL CONSTRAINT DF_Cuenta_cue_escajasucursal  DEFAULT (0),
	cue_codigorpt varchar(50) NOT NULL CONSTRAINT DF_Cuenta_cue_codigorpt  DEFAULT (''),
	cue_esefectivo smallint NOT NULL CONSTRAINT DF_Cuenta_cue_esefectivo  DEFAULT (0),
	cue_esticket smallint NOT NULL CONSTRAINT DF_Cuenta_cue_esticket  DEFAULT (0),
	cuec_id_libroiva int NULL,
	cuec_id int NOT NULL,
	emp_id int NULL,
	bco_id int NULL,
	mon_id int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF__Cuenta__activo__583CFE97  DEFAULT (0),
	creado timestamptz NOT NULL CONSTRAINT DF__Cuenta__creado__593122D0  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF__Cuenta__modifica__5A254709  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE ListaDescuento(
	ld_id int NOT NULL,
	ld_nombre varchar(100) NOT NULL,
	ld_codigo varchar(50) NOT NULL,
	ld_descrip varchar(255) NOT NULL CONSTRAINT DF_ListaDescuento_ld_descrip  DEFAULT (''),
	ld_id_padre int NULL,
	ld_fechadesde timestamptz NOT NULL CONSTRAINT DF_ListaDescuento_lp_fechadesde  DEFAULT (getdate()),
	ld_fechahasta timestamptz NOT NULL CONSTRAINT DF_ListaDescuento_lp_fechahasta  DEFAULT ('29991231'),
	ld_porcentaje decimal(18, 6) NOT NULL CONSTRAINT DF_ListaDescuento_ld_porcentaje  DEFAULT (0),
	ld_tipo smallint NOT NULL CONSTRAINT DF_ListaDescuento_ld_tipo  DEFAULT (0),
	mon_id int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_ListaDescuento_activo  DEFAULT (1),
	creado timestamptz NOT NULL CONSTRAINT DF_ListaDescuento_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ListaDescuento_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE Liquidacion(
	liq_id int NOT NULL,
	liq_numero int NOT NULL,
	liq_nrodoc varchar(50) NOT NULL CONSTRAINT DF_Liquidacion_liq_nrodoc  DEFAULT (''),
	liq_descrip varchar(5000) NOT NULL CONSTRAINT DF_Liquidacion_liq_descrip  DEFAULT (''),
	liq_fecha timestamptz NOT NULL CONSTRAINT DF_Liquidacion_liq_fecha  DEFAULT (getdate()),
	liq_fechadesde timestamptz NOT NULL CONSTRAINT DF_Liquidacion_liq_fechadesde  DEFAULT ('19000101'),
	liq_fechahasta timestamptz NOT NULL CONSTRAINT DF_Liquidacion_liq_fechahasta  DEFAULT ('19000101'),
	liq_periodo varchar(100) NOT NULL CONSTRAINT DF_Liquidacion_liq_periodo  DEFAULT (''),
	liq_neto decimal(18, 6) NOT NULL CONSTRAINT DF_Liquidacion_liq_neto  DEFAULT (0),
	liq_impuesto decimal(18, 6) NOT NULL CONSTRAINT DF_Liquidacion_liq_impuesto  DEFAULT (0),
	liq_total decimal(18, 6) NOT NULL CONSTRAINT DF_Liquidacion_liq_total  DEFAULT (0),
	liq_totalorigen decimal(18, 6) NOT NULL CONSTRAINT DF_Liquidacion_liq_totalorigen  DEFAULT (0),
	liq_firmado int NOT NULL CONSTRAINT DF_Liquidacion_liq_firmado  DEFAULT (0),
	liq_grabarasiento smallint NOT NULL CONSTRAINT DF_Liquidacion_liq_grabarasiento  DEFAULT (0),
	liq_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_Liquidacion_liq_cotizacion  DEFAULT (0),
	mon_id int NOT NULL,
	est_id int NOT NULL,
	suc_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	ccos_id int NULL,
	as_id int NULL,
	lgj_id int NULL,
	liqp_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Liquidacion_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Liquidacion_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL CONSTRAINT DF_Liquidacion_impreso  DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
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
CREATE TABLE PermisoEmbarque(
	pemb_id int NOT NULL,
	pemb_numero int NOT NULL,
	pemb_nrodoc varchar(100) NOT NULL CONSTRAINT DF_PermisoEmbarque_pemb_nrodoc  DEFAULT (''),
	pemb_descrip varchar(255) NOT NULL CONSTRAINT DF_PermisoEmbarque_pemb_descrip  DEFAULT (''),
	pemb_fecha timestamptz NOT NULL,
	pemb_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_PermisoEmbarque_pemb_cotizacion  DEFAULT (0),
	pemb_total decimal(18, 6) NOT NULL CONSTRAINT DF_PermisoEmbarque_pemb_total  DEFAULT (0),
	pemb_totalorigen decimal(18, 6) NOT NULL CONSTRAINT DF_PermisoEmbarque_fv_totalorigen  DEFAULT (0),
	pemb_firmado int NOT NULL CONSTRAINT DF_PermisoEmbarque_pemb_firmado  DEFAULT (0),
	pemb_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PermisoEmbarque_pemb_pendiente  DEFAULT (0),
	mon_id int NOT NULL,
	est_id int NOT NULL,
	suc_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	emb_id int NOT NULL,
	bco_id int NOT NULL,
	adu_id int NOT NULL,
	lp_id int NULL,
	lgj_id int NULL,
	ccos_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_PermisoEmbarque_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_PermisoEmbarque_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
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
CREATE TABLE ListaPrecio(
	lp_id int NOT NULL,
	lp_nombre varchar(100) NOT NULL,
	lp_codigo varchar(15) NOT NULL,
	lp_descrip varchar(255) NOT NULL CONSTRAINT df_listaprecio_lp_descrip  DEFAULT (''),
	lp_fechadesde timestamptz NOT NULL CONSTRAINT df_listaprecio_lp_fechadesde  DEFAULT (getdate()),
	lp_fechahasta timestamptz NOT NULL CONSTRAINT df_listaprecio_lp_fechahasta  DEFAULT ('29991231'),
	lp_default smallint NOT NULL,
	lp_id_padre int NULL,
	lp_porcentaje decimal(18, 6) NOT NULL CONSTRAINT DF_ListaPrecio_lp_porcentaje  DEFAULT (0),
	lp_tipo smallint NOT NULL CONSTRAINT DF_ListaPrecio_lp_tipo  DEFAULT (0),
	lp_autoXcompra smallint NOT NULL CONSTRAINT DF_ListaPrecio_lp_autoXcompra  DEFAULT (0),
	lp_nofiltrarpr smallint NOT NULL CONSTRAINT DF_ListaPrecio_lp_nofiltrarpr  DEFAULT (0),
	lp_encache smallint NOT NULL CONSTRAINT DF_ListaPrecio_lp_encache  DEFAULT (0),
	mon_id int NOT NULL,
	activo smallint NOT NULL CONSTRAINT df_listaprecio_activo  DEFAULT (1),
	creado timestamptz NOT NULL CONSTRAINT df_listaprecio_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT df_listaprecio_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE Gasto(
	gto_id int NOT NULL,
	gto_nombre varchar(100) NOT NULL,
	gto_codigo varchar(15) NOT NULL,
	gto_descrip varchar(255) NOT NULL,
	gto_tipo smallint NOT NULL,
	gto_fijo decimal(18, 6) NOT NULL CONSTRAINT DF_Gasto_gto_fijo  DEFAULT (0),
	gto_minimo decimal(18, 6) NOT NULL CONSTRAINT DF_Gasto_gto_minimo  DEFAULT (0),
	gto_porcentaje decimal(18, 6) NOT NULL CONSTRAINT DF_Gasto_gto_porcentaje  DEFAULT (0),
	gto_importe decimal(18, 6) NOT NULL CONSTRAINT DF_Gasto_gto_importe  DEFAULT (0),
	mon_id int NOT NULL,
	ti_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Gasto_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Gasto_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Gasto_activo  DEFAULT (1),
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
CREATE TABLE MonedaItem(
	moni_id int NOT NULL,
	moni_precio decimal(18, 6) NOT NULL CONSTRAINT DF_MonedaItem_moni_precio  DEFAULT (0),
	moni_fecha timestamptz NOT NULL CONSTRAINT DF_MonedaItem_moni_fecha  DEFAULT (getdate()),
	mon_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_MonedaItem_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_MonedaItem_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE DespachoImpCalculo(
	dic_id int NOT NULL,
	dic_numero int NOT NULL,
	dic_fecha timestamptz NOT NULL,
	dic_tipo smallint NOT NULL,
	dic_titulo varchar(255) NOT NULL,
	dic_descrip varchar(5000) NOT NULL CONSTRAINT DF_DespachoImpoCalculo_dic_descrip  DEFAULT (''),
	dic_via varchar(255) NOT NULL CONSTRAINT DF_DespachoImpoCalculo_dic_via  DEFAULT (''),
	dic_viaempresa varchar(255) NOT NULL CONSTRAINT DF_DespachoImpoCalculo_dic_viaempresa  DEFAULT (''),
	dic_factura varchar(50) NOT NULL CONSTRAINT DF_DespachoImpoCalculo_dic_factura  DEFAULT (''),
	dic_cambio1 decimal(18, 6) NOT NULL,
	dic_cambio2 decimal(18, 6) NOT NULL,
	dic_pase decimal(18, 6) NOT NULL,
	dic_totalgtos decimal(18, 6) NOT NULL,
	dic_porcfob decimal(18, 6) NOT NULL,
	dic_var decimal(18, 6) NOT NULL,
	dic_porcfobfinal decimal(18, 6) NOT NULL,
	dic_total decimal(18, 6) NOT NULL,
	dic_totalorigen decimal(18, 6) NOT NULL,
	rc_id int NOT NULL,
	mon_id1 int NOT NULL,
	mon_id2 int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_DespachoImpoCalculo_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_DespachoImpoCalculo_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE Producto(
	pr_id int NOT NULL,
	pr_nombrecompra varchar(255) NOT NULL,
	pr_nombreventa varchar(255) NOT NULL,
	pr_codigo varchar(100) NOT NULL,
	pr_codigobarra varchar(255) NOT NULL CONSTRAINT DF_Producto_prprov_codigobarra  DEFAULT (''),
	pr_codigobarranombre varchar(255) NOT NULL CONSTRAINT DF_Producto_pr_codigobarranombre  DEFAULT (''),
	activo smallint NOT NULL CONSTRAINT DF_Producto_activo  DEFAULT (1),
	pr_descripventa varchar(2000) NOT NULL CONSTRAINT DF_Producto_pro_descripventa  DEFAULT (''),
	pr_descripcompra varchar(2000) NOT NULL CONSTRAINT DF_Producto_pro_descripcompra  DEFAULT (''),
	un_id_compra int NULL,
	un_id_venta int NULL,
	un_id_stock int NULL,
	pr_ventacompra real NOT NULL CONSTRAINT DF_Producto_pr_relacioncompraventa  DEFAULT (1),
	pr_ventastock real NOT NULL CONSTRAINT DF_Producto_pr_ventastock  DEFAULT (1),
	pr_stockcompra real NOT NULL CONSTRAINT DF_Producto_pr_comprastock  DEFAULT (1),
	pr_llevastock smallint NOT NULL CONSTRAINT DF_Producto_pr_llevastock  DEFAULT (0),
	pr_esrepuesto smallint NOT NULL CONSTRAINT DF_Producto_pr_esrepuesto  DEFAULT (0),
	pr_secompra smallint NOT NULL CONSTRAINT DF_Producto_pr_secompra  DEFAULT (0),
	pr_sevende smallint NOT NULL CONSTRAINT DF_Producto_pr_sevende  DEFAULT (0),
	pr_eskit smallint NOT NULL CONSTRAINT DF_Producto_pr_eskit  DEFAULT (0),
	pr_kitStkItem smallint NOT NULL CONSTRAINT DF__producto__pr_kit__0EF2D90D  DEFAULT (0),
	pr_kitResumido smallint NOT NULL CONSTRAINT DF_Producto_pr_kitResumido  DEFAULT (0),
	pr_kitIdentidad smallint NOT NULL CONSTRAINT DF_Producto_pr_kitIdentidad  DEFAULT (0),
	pr_kitIdentidadXItem smallint NOT NULL CONSTRAINT DF_Producto_pr_kitIdentidadXItem  DEFAULT (0),
	pr_kitLote smallint NOT NULL CONSTRAINT DF_Producto_pr_kitLote  DEFAULT (0),
	pr_kitLoteXItem smallint NOT NULL CONSTRAINT DF_Producto_pr_kitLoteXItem  DEFAULT (0),
	pr_eslista smallint NOT NULL CONSTRAINT DF_Producto_pr_eslista  DEFAULT (0),
	pr_kitItems decimal(18, 6) NOT NULL CONSTRAINT DF_Producto_pr_kitItems  DEFAULT (0),
	pr_dinerario smallint NOT NULL CONSTRAINT DF_Producto_pr_dinerario  DEFAULT (0),
	marc_id int NULL,
	ti_id_ivaricompra int NULL,
	ti_id_ivarnicompra int NULL,
	ti_id_ivariventa int NULL,
	ti_id_ivarniventa int NULL,
	ti_id_internosv int NULL,
	ti_id_internosc int NULL,
	pr_porcinternoc real NOT NULL CONSTRAINT DF_Producto_pr_porcinterno  DEFAULT (0),
	pr_porcinternov real NOT NULL CONSTRAINT DF_Producto_pr_porcinternoc1  DEFAULT (0),
	ibc_id int NULL,
	cueg_id_venta int NULL,
	cueg_id_compra int NULL,
	pr_x smallint NOT NULL CONSTRAINT DF_Producto_pr_x  DEFAULT (0),
	pr_y smallint NOT NULL CONSTRAINT DF_Producto_pr_y  DEFAULT (0),
	pr_z smallint NOT NULL CONSTRAINT DF_Producto_pr_z  DEFAULT (0),
	pr_tienehijo smallint NOT NULL CONSTRAINT DF_Producto_pr_tienehijo  DEFAULT (0),
	pr_id_padre int NULL,
	pr_editarpreciohijo smallint NOT NULL CONSTRAINT DF_Producto_pr_editarpreciohijo  DEFAULT (0),
	pr_permiteedicion smallint NOT NULL CONSTRAINT DF_Producto_pr_permiteedicion  DEFAULT (0),
	pr_borrado smallint NOT NULL CONSTRAINT DF_Producto_pr_borrado  DEFAULT (0),
	pr_stockminimo real NOT NULL CONSTRAINT DF_Producto_pr_stockminimo  DEFAULT (0),
	pr_stockmaximo real NOT NULL CONSTRAINT DF_Producto_pr_stockmaximo  DEFAULT (0),
	pr_codigoexterno varchar(30) NOT NULL CONSTRAINT DF_Producto_pr_codigoexterno  DEFAULT (''),
	pr_reposicion real NOT NULL CONSTRAINT DF_Producto_pr_reposicion  DEFAULT (0),
	pr_pesototal decimal(18, 6) NOT NULL CONSTRAINT DF_Producto_pr_pesototal  DEFAULT (0),
	pr_pesoneto decimal(18, 6) NOT NULL CONSTRAINT DF_Producto_pr_peso  DEFAULT (0),
	pr_cantxcajaexpo int NOT NULL CONSTRAINT DF_Producto_pr_cantxcajaexpo  DEFAULT (0),
	pr_fleteExpo smallint NOT NULL CONSTRAINT DF_Producto_pr_fleteExpo  DEFAULT (0),
	pr_llevanroserie smallint NOT NULL CONSTRAINT DF_Producto_pr_llevanroserie_1  DEFAULT (0),
	pr_llevanrolote smallint NOT NULL CONSTRAINT DF_Producto_pr_llevanrolote_1  DEFAULT (0),
	pr_lotefifo smallint NOT NULL CONSTRAINT DF_Producto_pr_lotefifo  DEFAULT (0),
	pr_seproduce smallint NOT NULL CONSTRAINT DF_Producto_pr_seproduce  DEFAULT (0),
	pr_nombrefactura varchar(255) NOT NULL CONSTRAINT DF_Producto_pr_descripfactura  DEFAULT (''),
	pr_nombreweb varchar(255) NOT NULL CONSTRAINT DF_Producto_pr_nombreweb  DEFAULT (''),
	pr_aliasweb varchar(255) NOT NULL CONSTRAINT DF_Producto_pr_aliasweb  DEFAULT (''),
	pr_codigohtml varchar(5000) NOT NULL CONSTRAINT DF_Producto_pr_codigohtml  DEFAULT (''),
	pr_codigohtmldetalle varchar(5000) NOT NULL CONSTRAINT DF_Producto_pr_codigohtml1  DEFAULT (''),
	pr_activoweb smallint NOT NULL CONSTRAINT DF_Producto_pr_activoweb  DEFAULT (0),
	pr_noredondeo smallint NOT NULL CONSTRAINT DF_Producto_pr_noredondeo  DEFAULT (0),
	pr_expoweb smallint NOT NULL CONSTRAINT DF_Producto_pr_expoweb  DEFAULT (50),
	pr_expocairo smallint NOT NULL CONSTRAINT DF_Producto_pr_expocairo  DEFAULT (50),
	pr_ventawebmaxima decimal(18, 6) NOT NULL CONSTRAINT DF_Producto_pr_ventaWebMaxima  DEFAULT (99999),
	pr_webimagefolder varchar(255) NOT NULL CONSTRAINT DF_Producto_pr_webimagefolder  DEFAULT (''),
	pr_webimageupdate smallint NOT NULL CONSTRAINT DF_Producto_pr_webimageupdate  DEFAULT (0),
	pr_esplantilla smallint NOT NULL CONSTRAINT DF_Producto_pr_esplantilla  DEFAULT (0),
	pr_id_webpadre int NULL,
	ley_id int NULL,
	un_id_peso int NULL,
	rub_id int NULL,
	rubti_id1 int NULL,
	rubti_id2 int NULL,
	rubti_id3 int NULL,
	rubti_id4 int NULL,
	rubti_id5 int NULL,
	rubti_id6 int NULL,
	rubti_id7 int NULL,
	rubti_id8 int NULL,
	rubti_id9 int NULL,
	rubti_id10 int NULL,
	embl_id int NULL,
	egp_id int NULL,
	efm_id int NULL,
	ta_id_kitSerie int NULL,
	ta_id_kitLote int NULL,
	ccos_id_compra int NULL,
	ccos_id_venta int NULL,
	cur_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Producto_creado  DEFAULT (getdate()),
	modifico int NOT NULL,
	modificado timestamptz NOT NULL CONSTRAINT DF_Producto_modificado  DEFAULT (getdate()),
	rpt_id_nombrecompra int NULL,
	rpt_id_nombreventa int NULL,
	rpt_id_nombrefactura int NULL,
	rpt_id_nombreweb int NULL,
	rpt_id_nombreimgalt int NULL,
	rpt_id_nombreimg int NULL,
	poar_id int NULL,
	ti_id_comex_ganancias int NULL,
	ti_id_comex_igb int NULL,
	ti_id_comex_iva int NULL,
 CONSTRAINT PK_Producto PRIMARY KEY  
(
	pr_id 
) 
) 
;

;
--, @value=N'' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Producto', @level2type=N'COLUMN',@level2name=N'pr_llevanroserie'
;
/****** Object:  Table Retencion    Script Date: 07/30/2012 17:29:27 ******/

;

;

;
CREATE TABLE Retencion(
	rett_id int NOT NULL,
	ret_id int NOT NULL,
	ret_nombre varchar(100) NOT NULL CONSTRAINT DF_Retenciones_ret_nombre  DEFAULT (''),
	ret_codigo varchar(15) NOT NULL CONSTRAINT DF_Retenciones_ret_alias  DEFAULT (''),
	ret_importeminimo decimal(18, 6) NOT NULL CONSTRAINT DF_Retencion_ret_importeminimo  DEFAULT (0),
	ret_regimensicore varchar(50) NOT NULL CONSTRAINT DF_Retencion_ret_regimensicore  DEFAULT (''),
	ret_acumulapor smallint NOT NULL CONSTRAINT DF_Retencion_ret_acumulapor  DEFAULT (0),
	ret_tipoMinimo smallint NOT NULL CONSTRAINT DF_Retencion_ret_tipoMinimo  DEFAULT (1),
	ret_descrip varchar(255) NOT NULL CONSTRAINT DF_Retencion_ret_descrip  DEFAULT (''),
	ret_esiibb smallint NOT NULL CONSTRAINT DF_Retencion_ret_esiibb  DEFAULT (0),
	ta_id int NULL,
	ibc_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Retenciones_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Retenciones_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Retencion_activo  DEFAULT (0),
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
CREATE TABLE Stock(
	st_id int NOT NULL,
	st_numero int NOT NULL,
	st_nrodoc varchar(50) NOT NULL CONSTRAINT DF_Stock_st_nrodoc  DEFAULT (''),
	st_descrip varchar(5000) NOT NULL CONSTRAINT DF_Stock_st_descrip  DEFAULT (''),
	st_fecha timestamptz NOT NULL CONSTRAINT DF_Stock_st_fecha  DEFAULT (getdate()),
	st_doc_cliente varchar(5000) NOT NULL CONSTRAINT DF_Stock_as_doc_cliente  DEFAULT (''),
	depl_id_origen int NOT NULL,
	depl_id_destino int NOT NULL,
	suc_id int NOT NULL,
	lgj_id int NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	doct_id_cliente int NULL,
	id_cliente int NOT NULL CONSTRAINT DF_Stock_id_cliente  DEFAULT (0),
	creado timestamptz NOT NULL CONSTRAINT DF_Stock_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Stock_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
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
CREATE TABLE StockCliente(
	stcli_id int NOT NULL,
	stcli_numero int NOT NULL,
	stcli_nrodoc varchar(50) NOT NULL CONSTRAINT DF_StockCliente_stcli_nrodoc  DEFAULT (''),
	stcli_descrip varchar(5000) NOT NULL CONSTRAINT DF_StockCliente_stcli_descrip  DEFAULT (''),
	stcli_fecha timestamptz NOT NULL CONSTRAINT DF_StockCliente_stcli_fecha  DEFAULT (getdate()),
	st_id int NULL,
	cli_id int NOT NULL,
	depl_id_origen int NOT NULL,
	depl_id_destino int NOT NULL,
	suc_id int NOT NULL,
	lgj_id int NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_StockCliente_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_StockCliente_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
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
CREATE TABLE StockCache(
	stc_id int  NOT NULL,
	stc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_StockCache_stc_cantidad  DEFAULT (0),
	pr_id int NOT NULL,
	depl_id int NOT NULL,
	prns_id int NULL,
	pr_id_kit int NULL,
	stl_id int NULL,
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
CREATE TABLE ParteProdKit(
	ppk_id int NOT NULL,
	ppk_numero int NOT NULL,
	ppk_nrodoc varchar(50) NOT NULL CONSTRAINT DF_ParteProdKit_ppk_nrodoc  DEFAULT (''),
	ppk_descrip varchar(5000) NOT NULL CONSTRAINT DF_ParteProdKit_ppk_descrip  DEFAULT (''),
	ppk_fecha timestamptz NOT NULL CONSTRAINT DF_ParteProdKit_ppk_fecha  DEFAULT (getdate()),
	depl_id int NOT NULL,
	st_id1 int NULL,
	st_id2 int NULL,
	suc_id int NOT NULL,
	lgj_id int NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ParteProdKit_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ParteProdKit_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
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
CREATE TABLE RecuentoStock(
	rs_id int NOT NULL,
	rs_numero int NOT NULL,
	rs_nrodoc varchar(50) NOT NULL CONSTRAINT DF_RecuentoStock_rs_nrodoc  DEFAULT (''),
	rs_descrip varchar(5000) NOT NULL CONSTRAINT DF_RecuentoStock_rs_descrip  DEFAULT (''),
	rs_fecha timestamptz NOT NULL CONSTRAINT DF_RecuentoStock_rs_fecha  DEFAULT (getdate()),
	depl_id int NOT NULL,
	st_id1 int NULL,
	st_id2 int NULL,
	suc_id int NOT NULL,
	lgj_id int NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_RecuentoStock_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_RecuentoStock_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
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
CREATE TABLE StockProveedor(
	stprov_id int NOT NULL,
	stprov_numero int NOT NULL,
	stprov_nrodoc varchar(50) NOT NULL CONSTRAINT DF_StockProveedor_stprov_nrodoc  DEFAULT (''),
	stprov_descrip varchar(5000) NOT NULL CONSTRAINT DF_StockProveedor_stprov_descrip  DEFAULT (''),
	stprov_fecha timestamptz NOT NULL CONSTRAINT DF_StockProveedor_stprov_fecha  DEFAULT (getdate()),
	st_id int NULL,
	prov_id int NULL,
	depl_id_origen int NOT NULL,
	depl_id_destino int NOT NULL,
	suc_id int NOT NULL,
	lgj_id int NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_StockProveedor_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_StockProveedor_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
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
CREATE TABLE OrdenProdKit(
	opk_id int NOT NULL,
	opk_numero int NOT NULL,
	opk_nrodoc varchar(50) NOT NULL CONSTRAINT DF_OrdenProdKit_opk_nrodoc  DEFAULT (''),
	opk_descrip varchar(5000) NOT NULL CONSTRAINT DF_OrdenProdKit_opk_descrip  DEFAULT (''),
	opk_fecha timestamptz NOT NULL CONSTRAINT DF_OrdenProdKit_opk_fecha  DEFAULT (getdate()),
	depl_id int NOT NULL,
	suc_id int NOT NULL,
	lgj_id int NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_OrdenProdKit_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_OrdenProdKit_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL CONSTRAINT DF__OrdenProd__impre__10026697  DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
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
CREATE TABLE ProductoDepositoEntrega(
	prent_id int  NOT NULL,
	pr_id int NOT NULL,
	depl_id int NOT NULL,
	suc_id int NOT NULL,
	emp_id int NOT NULL,
	prov_id int NULL,
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
CREATE TABLE StockItem(
	st_id int NOT NULL,
	sti_id int NOT NULL,
	sti_orden int NOT NULL CONSTRAINT DF_StockItem_sti_orden  DEFAULT (0),
	sti_ingreso decimal(18, 6) NOT NULL CONSTRAINT DF_StockItem_sti_ingreso  DEFAULT (0),
	sti_salida decimal(18, 6) NOT NULL CONSTRAINT DF_StockItem_sti_salida  DEFAULT (0),
	sti_descrip varchar(255) NOT NULL CONSTRAINT DF_StockItem_sti_descrip  DEFAULT (''),
	sti_grupo int NOT NULL CONSTRAINT DF_StockItem_sti_grupo_1  DEFAULT (0),
	pr_id int NOT NULL,
	depl_id int NOT NULL,
	prns_id int NULL,
	stik_id int NULL,
	pr_id_kit int NULL,
	stl_id int NULL,
	prsk_id int NULL,
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
CREATE TABLE ProductoDepositoLogico(
	prdepl_id int NOT NULL,
	pr_id int NOT NULL,
	depl_id int NOT NULL,
	prdepl_x smallint NOT NULL CONSTRAINT DF_ProductoDepositoLogico_prdepl_x  DEFAULT (0),
	prdepl_y smallint NOT NULL CONSTRAINT DF_ProductoDepositoLogico_prdepl_y  DEFAULT (0),
	prdepl_z smallint NOT NULL CONSTRAINT DF_ProductoDepositoLogico_prdepl_z  DEFAULT (0),
	prdepl_stockminimo real NOT NULL CONSTRAINT DF_ProductoDepositoLogico_prdepl_stockminimo  DEFAULT (0),
	prdepl_stockmaximo real NOT NULL CONSTRAINT DF_ProductoDepositoLogico_prdepl_stockmaximo  DEFAULT (0),
	prdepl_reposicion real NOT NULL CONSTRAINT DF_ProductoDepositoLogico_prdepl_reposicion  DEFAULT (0),
 CONSTRAINT PK_ProductoDepositoLogico PRIMARY KEY  
(
	prdepl_id 
) 
) 
;
/****** Object:  Table UsuarioDepositoLogico    Script Date: 07/30/2012 17:32:03 ******/

;

;
CREATE TABLE UsuarioDepositoLogico(
	usdepl_id int NOT NULL,
	us_id int NOT NULL,
	depl_id int NOT NULL,
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
CREATE TABLE PresupuestoEnvioGasto(
	pree_id int NOT NULL,
	preeg_id int NOT NULL,
	preeg_orden smallint NOT NULL,
	preeg_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioGasto_preeg_cantidad  DEFAULT (0),
	preeg_pendiente decimal(18, 0) NOT NULL CONSTRAINT DF_PresupuestoEnvioGasto_preeg_pendiente  DEFAULT (0),
	preeg_descrip varchar(5000) NOT NULL CONSTRAINT DF_PresupuestoEnvioGasto_preeg_descrip  DEFAULT (''),
	preeg_precio decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioGasto_preeg_precio  DEFAULT (0),
	preeg_precioTarifa decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioGasto_preeg_precioTarifa  DEFAULT (0),
	preeg_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioGasto_pree_neto  DEFAULT (0),
	preeg_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioGasto_preeg_ivari  DEFAULT (0),
	preeg_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioGasto_preeg_ivarni  DEFAULT (0),
	preeg_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioGasto_preeg_ivariporc  DEFAULT (0),
	preeg_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioGasto_preeg_ivarniporc  DEFAULT (0),
	preeg_importe decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioGasto_preeg_importe  DEFAULT (0),
	pr_id int NOT NULL,
	trans_id int NULL,
	trfg_id int NULL,
	gto_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE PresupuestoEnvioItem(
	pree_id int NOT NULL,
	preei_id int NOT NULL,
	preei_orden smallint NOT NULL,
	preei_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItem_preei_cantidad  DEFAULT (0),
	preei_volumen decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItem_preei_volumen  DEFAULT (0),
	preei_kilos decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItem_preei_kilos  DEFAULT (0),
	preei_minimo decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItem_preei_minimo  DEFAULT (0),
	preei_pendiente decimal(18, 0) NOT NULL CONSTRAINT DF_PresupuestoEnvioItem_preei_pendiente  DEFAULT (0),
	preei_descrip varchar(5000) NOT NULL CONSTRAINT DF_PresupuestoEnvioItem_preei_descrip  DEFAULT (''),
	preei_precio decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItem_preei_precio  DEFAULT (0),
	preei_precioTarifa decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItem_preei_precioLista  DEFAULT (0),
	preei_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItem_pree_neto  DEFAULT (0),
	preei_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItem_preei_ivari  DEFAULT (0),
	preei_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItem_preei_ivarni  DEFAULT (0),
	preei_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItem_preei_ivariporc  DEFAULT (0),
	preei_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItem_preei_ivarniporc  DEFAULT (0),
	preei_importe decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItem_preei_importe  DEFAULT (0),
	pr_id int NOT NULL,
	pue_id_origen int NOT NULL,
	pue_id_destino int NOT NULL,
	trans_id int NOT NULL,
	trfi_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE ProductoBOMItemA(
	pbmi_id int NOT NULL,
	pbmia_id int NOT NULL,
	pr_id int NOT NULL,
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
CREATE TABLE ComunidadInternetRespuesta(
	cmir_id int NOT NULL,
	cmir_body text NOT NULL CONSTRAINT DF_ComunidadInternetRespuesta_cmir_body  DEFAULT (''),
	cmir_to varchar(2000) NOT NULL CONSTRAINT DF_ComunidadInternetRespuesta_cmir_to  DEFAULT (''),
	cmir_subject varchar(2000) NOT NULL CONSTRAINT DF_ComunidadInternetRespuesta_cmir_subject  DEFAULT (''),
	cmir_from varchar(255) NOT NULL CONSTRAINT DF_ComunidadInternetRespuesta_cmir_from  DEFAULT (''),
	cmie_id int NULL,
	cmi_id int NULL,
	cmia_id int NULL,
	idm_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ComunidadInternetRespuesta_creado  DEFAULT (getdate()),
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
CREATE TABLE ComunidadInternetTexto(
	cmit_id int NOT NULL,
	cmit_nombre varchar(100) NOT NULL,
	cmit_codigo varchar(15) NOT NULL,
	cmit_descrip varchar(255) NOT NULL CONSTRAINT DF_ComunidadInternetTexto_cmit_descrip  DEFAULT (''),
	idm_id int NULL,
	cmi_id int NULL,
	cmia_id int NULL,
	cmiea_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ComunidadInternetTexto_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ComunidadInternetTexto_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_ComunidadInternetTexto_activo  DEFAULT (1),
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
CREATE TABLE ComunidadInternetRespuestaPlantilla(
	cmirp_id int NOT NULL,
	cmirp_nombre varchar(50) NOT NULL,
	cmirp_codigo varchar(50) NOT NULL,
	cmirp_texto varchar(5000) NOT NULL,
	cmirp_descrip varchar(255) NOT NULL CONSTRAINT DF_ComunidadInternetRespuestaPlantilla_cmirp_descrip  DEFAULT (''),
	cmirp_from varchar(255) NOT NULL CONSTRAINT DF_ComunidadInternetRespuestaPlantilla_cmirp_from  DEFAULT (''),
	cmirp_subject varchar(255) NOT NULL CONSTRAINT DF_ComunidadInternetRespuestaPlantilla_cmirp_subject  DEFAULT (''),
	cmia_id int NULL,
	cmi_id int NULL,
	idm_id int NULL,
	pr_id int NULL,
	rub_id int NULL,
	marc_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ComunidadInternetRespuestaPlantilla_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ComunidadInternetRespuestaPlantilla_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_ComunidadInternetRespuestaPlantilla_activo  DEFAULT (1),
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
CREATE TABLE ProductoBOMElaborado(
	pbm_id int NOT NULL,
	pbme_id int NOT NULL,
	pbme_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_ProductoBOMElaborado_pbme_cantidad  DEFAULT (0),
	pbme_canttipo smallint NOT NULL CONSTRAINT DF_ProductoBOMElaborado_pbme_canttipo  DEFAULT (0),
	pbme_varpos decimal(18, 6) NOT NULL CONSTRAINT DF_ProductoBOMElaborado_pbme_varpos  DEFAULT (0),
	pbme_varneg decimal(18, 6) NOT NULL CONSTRAINT DF_ProductoBOMElaborado_pbme_varneg  DEFAULT (0),
	pbme_vartipo smallint NOT NULL CONSTRAINT DF_ProductoBOMElaborado_pbme_vartipo  DEFAULT (0),
	pr_id int NOT NULL,
 CONSTRAINT PK_ProductoBOMElaborado PRIMARY KEY  
(
	pbme_id 
) 
) 
;
/****** Object:  Table ProductoBOMItem    Script Date: 07/30/2012 17:25:36 ******/

;

;
CREATE TABLE ProductoBOMItem(
	pbm_id int NOT NULL,
	pbmi_id int NOT NULL,
	pbmi_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_ProductoBOMItem_pbmi_cantidad  DEFAULT (0),
	pbmi_merma decimal(18, 6) NOT NULL CONSTRAINT DF_ProductoBOMItem_pbmi_merma  DEFAULT (0),
	pbmi_varpos decimal(18, 6) NOT NULL CONSTRAINT DF_ProductoBOMItem_pbmi_varpos  DEFAULT (0),
	pbmi_varneg decimal(18, 6) NOT NULL CONSTRAINT DF_ProductoBOMItem_pbmi_varneg  DEFAULT (0),
	pbmi_vartipo smallint NOT NULL CONSTRAINT DF_ProductoBOMItem_pbmi_vartipo  DEFAULT (0),
	pbmi_esBase smallint NOT NULL CONSTRAINT DF_ProductoBOMItem_pbmi_esBase  DEFAULT (0),
	pbmi_temp smallint NOT NULL CONSTRAINT DF_ProductoBOMItem_pbmi_temp  DEFAULT (0),
	pbmit_id int NOT NULL,
	pr_id int NULL,
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
CREATE TABLE OrdenProdKitItem(
	opk_id int NOT NULL,
	opki_id int NOT NULL,
	opki_orden smallint NOT NULL,
	opki_cantidadstock decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenProdKitItem_opki_cantidadstock  DEFAULT (0),
	opki_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenProdKitItem_opki_cantidad  DEFAULT (0),
	opki_descrip varchar(5000) NOT NULL CONSTRAINT DF_OrdenProdKitItem_opki_descrip  DEFAULT (''),
	pr_id int NOT NULL,
	prfk_id int NOT NULL,
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
CREATE TABLE Rubro(
	rub_id int NOT NULL,
	rub_nombre varchar(100) NOT NULL CONSTRAINT DF_Rubro_rub_nombre  DEFAULT (''),
	rub_codigo varchar(15) NOT NULL,
	rub_descrip varchar(255) NOT NULL CONSTRAINT DF_Rubro_rub_descrip  DEFAULT (''),
	rub_escriterio smallint NOT NULL CONSTRAINT DF_Rubro_rub_escriterio  DEFAULT (0),
	rubt_id1 int NULL,
	rubt_id2 int NULL,
	rubt_id3 int NULL,
	rubt_id4 int NULL,
	rubt_id5 int NULL,
	rubt_id6 int NULL,
	rubt_id7 int NULL,
	rubt_id8 int NULL,
	rubt_id9 int NULL,
	rubt_id10 int NULL,
	rubti_id1 int NULL,
	rubti_id2 int NULL,
	rubti_id3 int NULL,
	rubti_id4 int NULL,
	rubti_id5 int NULL,
	rubti_id6 int NULL,
	rubti_id7 int NULL,
	rubti_id8 int NULL,
	rubti_id9 int NULL,
	rubti_id10 int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Rubro_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Rubro_modificado  DEFAULT (getdate()),
	modifico int NOT NULL CONSTRAINT DF_Rubro_modifico  DEFAULT (0),
	activo smallint NOT NULL CONSTRAINT DF_Rubro_activo  DEFAULT (1),
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
CREATE TABLE EmpleadoPresentismo(
	em_id int NOT NULL,
	empe_id int NOT NULL,
	empr_id int NOT NULL,
	empr_desde timestamptz NOT NULL,
	empr_hasta timestamptz NOT NULL,
	empr_tipo smallint NOT NULL,
	empr_faltatipo smallint NOT NULL,
	empr_aviso smallint NOT NULL,
	empr_descrip varchar(5000) NOT NULL CONSTRAINT DF_EmpleadoPresentismo_empr_descrip  DEFAULT (''),
	ccos_id int NULL,
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
CREATE TABLE EmpleadoSemana(
	empe_id int NOT NULL,
	ems_id int NOT NULL,
	ems_fecha timestamptz NOT NULL,
	ems_horas decimal(18, 6) NOT NULL,
	ems_desde timestamptz NOT NULL CONSTRAINT DF_EmpleadoSemana_ems_desde  DEFAULT ('19000101'),
	ems_hasta timestamptz NOT NULL CONSTRAINT DF_EmpleadoSemana_ems_hasta  DEFAULT ('19000101'),
	ccos_id int NOT NULL,
 CONSTRAINT PK_EmpleadoSemana PRIMARY KEY  
(
	ems_id 
) 
) 
;
/****** Object:  Table EmpleadoHoras    Script Date: 07/30/2012 17:09:47 ******/

;

;
CREATE TABLE EmpleadoHoras(
	empe_id int NOT NULL,
	emh_id int NOT NULL,
	em_id int NOT NULL,
	emh_fecha timestamptz NOT NULL,
	emh_horas decimal(18, 6) NOT NULL,
	emh_desde timestamptz NOT NULL CONSTRAINT DF_EmpleadoHoras_emh_desde  DEFAULT ('19000101'),
	emh_hasta timestamptz NOT NULL CONSTRAINT DF_EmpleadoHoras_emh_hasta  DEFAULT ('19000101'),
	east_id int NULL,
	ccos_id int NOT NULL,
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
CREATE TABLE Alarma(
	al_id int NOT NULL,
	al_nombre varchar(255) NOT NULL,
	al_codigo varchar(15) NOT NULL,
	al_descrip varchar(255) NOT NULL,
	al_diatipo smallint NOT NULL,
	al_llegadaestado1 smallint NOT NULL CONSTRAINT DF_Alarma_al_llegadaestado1  DEFAULT (0),
	al_llegadaestado2 smallint NOT NULL CONSTRAINT DF_Alarma_al_llegadaestado2  DEFAULT (0),
	al_resolucionestado1 smallint NOT NULL CONSTRAINT DF_Alarma_al_resolucionestado1  DEFAULT (0),
	al_resolucionestado2 smallint NOT NULL CONSTRAINT DF_Alarma_al_resolucionestado2  DEFAULT (0),
	al_llegadaestadoT1 smallint NOT NULL CONSTRAINT DF_Alarma_al_llegadaestado11  DEFAULT (0),
	al_llegadaestadoT2 smallint NOT NULL CONSTRAINT DF_Alarma_al_llegadaestado21  DEFAULT (0),
	al_resolucionestadoT1 smallint NOT NULL CONSTRAINT DF_Alarma_al_resolucionestado11  DEFAULT (0),
	al_resolucionestadoT2 smallint NOT NULL CONSTRAINT DF_Alarma_al_resolucionestado21  DEFAULT (0),
	al_horasxdia decimal(18, 6) NOT NULL CONSTRAINT DF_Alarma_al_horasxdia  DEFAULT (0),
	cli_id int NULL,
	clis_id int NULL,
	proy_id int NULL,
	rub_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Alarma_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Alarma_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Alarma_activo  DEFAULT (1),
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
CREATE TABLE AsientoItemBorradoTMP(
	asTMP_id int NOT NULL,
	asibTMP_id int NOT NULL,
	as_id int NOT NULL,
	asi_id int NOT NULL,
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
CREATE TABLE AsientoItemTMP(
	asTMP_id int NOT NULL,
	asiTMP_id int NOT NULL,
	asi_id int NOT NULL,
	asi_orden smallint NOT NULL,
	asi_descrip varchar(5000) NOT NULL CONSTRAINT DF_AsientoItemTMP_asi_descrip_1  DEFAULT (''),
	asi_debe decimal(18, 6) NOT NULL CONSTRAINT DF_AsientoItemTMP_asi_debe  DEFAULT (0),
	asi_haber decimal(18, 6) NOT NULL CONSTRAINT DF_AsientoItemTMP_asi_haber  DEFAULT (0),
	asi_origen decimal(18, 6) NOT NULL CONSTRAINT DF_AsientoItemTMP_asi_origen  DEFAULT (0),
	cue_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE CursoItem(
	cur_id int NOT NULL,
	curi_id int NOT NULL,
	curi_calificacion smallint NOT NULL CONSTRAINT DF_CursoItem_curi_calificacion  DEFAULT (0),
	alum_id int NOT NULL,
	prof_id int NULL,
	est_id int NOT NULL,
	fv_id int NULL,
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
CREATE TABLE Alumno(
	alum_id int NOT NULL,
	alum_codigo varchar(50) NOT NULL,
	alum_legajo varchar(255) NOT NULL CONSTRAINT DF_Alumno_alum_legajo  DEFAULT (''),
	alum_fechaingreso timestamptz NOT NULL CONSTRAINT DF_Alumno_alum_fechaingreso  DEFAULT ('19000101'),
	alum_descrip varchar(5000) NOT NULL CONSTRAINT DF_Alumno_alum_descrip  DEFAULT (''),
	alum_esprospecto smallint NOT NULL CONSTRAINT DF_Alumno_alum_esprospecto  DEFAULT (0),
	prs_id int NOT NULL,
	prof_id int NULL,
	clict_id int NULL,
	alum_id_referido int NULL,
	proy_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Alumno_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Alumno_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Alumno_activo  DEFAULT (1),
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
CREATE TABLE OrdenProdKitItemBorradoTMP(
	opkTMP_id int NOT NULL,
	opkibTMP_id int NOT NULL,
	opk_id int NOT NULL,
	opki_id int NOT NULL,
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
CREATE TABLE OrdenProdKitItemTMP(
	opkTMP_id int NOT NULL,
	opkiTMP_id int NOT NULL,
	opki_id int NOT NULL,
	opki_orden smallint NOT NULL,
	opki_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenProdKitItemTMP_opki_cantidad  DEFAULT (0),
	opki_descrip varchar(5000) NOT NULL CONSTRAINT DF_OrdenProdKitItemTMP_opki_descrip  DEFAULT (''),
	pr_id int NOT NULL,
	depl_id int NOT NULL,
	prfk_id int NULL,
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
CREATE TABLE PickingListPedido(
	pkl_id int NOT NULL,
	pklpv_id int NOT NULL,
	pklpv_orden smallint NOT NULL,
	pklpv_descrip varchar(5000) NOT NULL CONSTRAINT DF_PickingListPedido_pklpv_descrip  DEFAULT (''),
	est_id int NOT NULL,
	pv_id int NULL,
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
CREATE TABLE RemitoVentaItemBorradoTMP(
	rvTMP_id int NOT NULL,
	rvibTMP_id int NOT NULL,
	rv_id int NOT NULL,
	rvi_id int NOT NULL,
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
CREATE TABLE RemitoVentaItemSerieTMP(
	rvTMP_id int NOT NULL,
	rviTMP_id int NOT NULL,
	rvi_id int NOT NULL CONSTRAINT DF_RemitoVentaSerieTMP_rvi_id  DEFAULT (0),
	rvisTMP_id int NOT NULL,
	rvis_orden int NOT NULL CONSTRAINT DF_RemitoVentaSerieTMP_rvis_orden  DEFAULT (0),
	prns_codigo varchar(100) NOT NULL CONSTRAINT DF_RemitoVentaSerieTMP_prns_codigo  DEFAULT (''),
	prns_descrip varchar(255) NOT NULL CONSTRAINT DF_RemitoVentaSerieTMP_prns_descrip  DEFAULT (''),
	prns_fechavto timestamptz NOT NULL CONSTRAINT DF_RemitoVentaSerieTMP_prns_fechavto  DEFAULT (getdate()),
	pr_id int NOT NULL,
	prns_id int NOT NULL CONSTRAINT DF_RemitoVentaSerieTMP_prns_id  DEFAULT (0),
	pr_id_item int NULL,
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
CREATE TABLE RemitoVentaItemInsumoTMP(
	rvTMP_id int NOT NULL,
	rviTMP_id int NOT NULL,
	rviiTMP_id int NOT NULL,
	rviiTMP_cantidad decimal(18, 6) NOT NULL,
	rviiTMP_cantidadAux decimal(18, 6) NOT NULL,
	rviiTMP_temp smallint NOT NULL,
	pr_id int NOT NULL,
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
CREATE TABLE RemitoVentaItemTMP(
	rvTMP_id int NOT NULL,
	rviTMP_id int NOT NULL,
	rvi_id int NOT NULL,
	rvi_orden smallint NOT NULL,
	rvi_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItemTMP_rvi_cantidad  DEFAULT (0),
	rvi_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItemTMP_rvi_cantidadaremitir  DEFAULT (0),
	rvi_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItemTMP_rvi_pendiente  DEFAULT (0),
	rvi_pendientefac decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItemTMP_rvi_pendientefac  DEFAULT (0),
	rvi_descrip varchar(5000) NOT NULL CONSTRAINT DF_RemitoVentaItemTMP_rvi_descrip  DEFAULT (''),
	rvi_precio decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItemTMP_rvi_precio  DEFAULT (0),
	rvi_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItemTMP_rvi_precioUsr  DEFAULT (0),
	rvi_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItemTMP_rvi_precioLista  DEFAULT (0),
	rvi_descuento varchar(100) NOT NULL CONSTRAINT DF_RemitoVentaItemTMP_rvi_descuento  DEFAULT (''),
	rvi_neto decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItemTMP_rvi_neto  DEFAULT (0),
	rvi_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItemTMP_rvi_ivari  DEFAULT (0),
	rvi_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItemTMP_rvi_ivarni  DEFAULT (0),
	rvi_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItemTMP_rvi_ivariporc  DEFAULT (0),
	rvi_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItemTMP_rvi_ivarniporc  DEFAULT (0),
	rvi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItemTMP_rvi_importe  DEFAULT (0),
	rvi_importCodigo varchar(255) NOT NULL CONSTRAINT DF__RemitoVen__rvi_i__093C61BC  DEFAULT (''),
	pr_id int NOT NULL,
	ccos_id int NULL,
	stl_id int NULL,
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
CREATE TABLE RemitoDevolucionVentaTMP(
	rvTMP_id int NOT NULL,
	rvdvTMP_id int NOT NULL,
	rvdv_id int NOT NULL,
	rvdv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoDevolucionVentaTMP_rvrd_cantidad  DEFAULT (0),
	rvi_id_remito int NOT NULL,
	rvi_id_devolucion int NOT NULL,
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
CREATE TABLE OrdenPago(
	opg_id int NOT NULL,
	opg_numero int NOT NULL,
	opg_nrodoc varchar(50) NOT NULL CONSTRAINT DF_OrdenPago_opg_nrodoc  DEFAULT (''),
	opg_descrip varchar(5000) NOT NULL CONSTRAINT DF_OrdenPago_opg_descrip  DEFAULT (''),
	opg_fecha timestamptz NOT NULL CONSTRAINT DF_OrdenPago_opg_fecha  DEFAULT (getdate()),
	opg_neto decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenPago_opg_neto  DEFAULT (0),
	opg_otros decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenPago_opg_otros  DEFAULT (0),
	opg_total decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenPago_opg_total  DEFAULT (0),
	opg_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenPago_opg_pendiente  DEFAULT (0),
	opg_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenPago_opg_cotizacion  DEFAULT (0),
	opg_grabarAsiento smallint NOT NULL CONSTRAINT DF_OrdenPago_opg_grabarAsiento  DEFAULT (0),
	opg_firmado int NOT NULL CONSTRAINT DF_OrdenPago_fc_firmado  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	prov_id int NOT NULL,
	emp_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	ccos_id int NULL,
	lgj_id int NULL,
	as_id int NULL,
	fc_id int NULL,
	oc_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_OrdenPago_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_OrdenPago_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL CONSTRAINT DF__OrdenPago__impre__076D2096  DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
 CONSTRAINT PK_OrdenPago PRIMARY KEY  
(
	opg_id 
) ,
 CONSTRAINT IX_OrdenPago UNIQUE  
(
	opg_numero 
) ,
 CONSTRAINT IX_OrdenPagoNroDoc UNIQUE  
(
	emp_id ,
	opg_nrodoc 
) 
) 
;

;
/****** Object:  Table Configuracion    Script Date: 07/30/2012 17:06:52 ******/

;

;

;
CREATE TABLE Configuracion(
	cfg_id int  NOT NULL,
	cfg_grupo varchar(60) NOT NULL,
	cfg_aspecto varchar(60) NOT NULL,
	cfg_valor varchar(5000) NOT NULL,
	emp_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Configuracion_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Configuracion_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE EmpresaClienteDeuda(
	empclid_id int NOT NULL,
	emp_id int NOT NULL,
	cli_id int NOT NULL,
	empclid_creditoctacte decimal(18, 6) NOT NULL CONSTRAINT DF_EmpresaClienteDeuda_empclid_creditoctacte  DEFAULT (0),
	empclid_creditototal decimal(18, 6) NOT NULL CONSTRAINT DF_EmpresaClienteDeuda_empclid_creditototal  DEFAULT (0),
	empclid_creditoactivo smallint NOT NULL CONSTRAINT DF_EmpresaClienteDeuda_empclid_creditoactivo  DEFAULT (1),
	empclid_deudapedido decimal(18, 6) NOT NULL CONSTRAINT DF_EmpresaClienteDeuda_empcldi_deudapedido  DEFAULT (0),
	empclid_deudaorden decimal(18, 6) NOT NULL CONSTRAINT DF_EmpresaClienteDeuda_empclid_deudaorden  DEFAULT (0),
	empclid_deudaremito decimal(18, 6) NOT NULL CONSTRAINT DF_EmpresaClienteDeuda_empclid_deudaremito  DEFAULT (0),
	empclid_deudapackinglist decimal(18, 6) NOT NULL CONSTRAINT DF_EmpresaClienteDeuda_empclid_deudapackinglist  DEFAULT (0),
	empclid_deudamanifiesto decimal(18, 6) NOT NULL CONSTRAINT DF_EmpresaClienteDeuda_empclid_deudamanifiesto  DEFAULT (0),
	empclid_deudactacte decimal(18, 6) NOT NULL CONSTRAINT DF_EmpresaClienteDeuda_empclid_deudactacte  DEFAULT (0),
	empclid_deudadoc decimal(18, 6) NOT NULL CONSTRAINT DF_EmpresaClienteDeuda_empclid_deudadoc  DEFAULT (0),
	empclid_deudatotal decimal(18, 6) NOT NULL CONSTRAINT DF_EmpresaClienteDeuda_empclid_deudatotal  DEFAULT (0),
 CONSTRAINT PK_EmpresaClienteDeuda PRIMARY KEY  
(
	empclid_id 
) 
) 
;
/****** Object:  Table ClienteCacheCredito    Script Date: 07/30/2012 17:05:17 ******/

;

;
CREATE TABLE ClienteCacheCredito(
	cli_id int NOT NULL,
	doct_id int NOT NULL,
	id int NOT NULL,
	clicc_importe decimal(18, 6) NOT NULL CONSTRAINT DF_ClienteCacheCredito_clicc_importe  DEFAULT (0),
	emp_id int NOT NULL,
 CONSTRAINT PK_ClienteCacheCredito PRIMARY KEY  
(
	cli_id ,
	doct_id ,
	id 
) 
) 
;
/****** Object:  Table DepositoLogico    Script Date: 07/30/2012 17:08:37 ******/

;

;

;
CREATE TABLE DepositoLogico(
	depl_id int NOT NULL,
	depf_id int NOT NULL,
	depl_nombre varchar(100) NOT NULL,
	depl_codigo varchar(30) NOT NULL,
	depl_descrip varchar(255) NOT NULL CONSTRAINT DF_DepositoLogico_depl_descripcion  DEFAULT (''),
	depl_esTemp smallint NOT NULL CONSTRAINT DF_DepositoLogico_depl_esTemp  DEFAULT (0),
	prov_id int NULL,
	cli_id int NULL,
	emp_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_DepositoLogico_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_DepositoLogico_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_DepositoLogico_activo  DEFAULT (1),
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
CREATE TABLE EmpresaCliente(
	empcli_id int NOT NULL,
	emp_id int NOT NULL,
	cli_id int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_EmpresaCliente_activo  DEFAULT (0),
	creado timestamptz NOT NULL CONSTRAINT DF_EmpresaCliente_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_EmpresaCliente_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
 CONSTRAINT PK_EmpresaCliente PRIMARY KEY  
(
	empcli_id 
) 
) 
;
/****** Object:  Table EjercicioContableEmpresa    Script Date: 07/30/2012 17:09:18 ******/

;

;
CREATE TABLE EjercicioContableEmpresa(
	ejc_id int NOT NULL,
	emp_id int NOT NULL,
 CONSTRAINT PK_EjercicioContableEmpresa PRIMARY KEY  
(
	ejc_id ,
	emp_id 
) 
) 
;
/****** Object:  Table EmpresaUsuario    Script Date: 07/30/2012 17:10:12 ******/

;

;
CREATE TABLE EmpresaUsuario(
	empus_id int NOT NULL,
	emp_id int NOT NULL,
	us_id int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_EmpresaUsuario_activo  DEFAULT (0),
	creado timestamptz NOT NULL CONSTRAINT DF_EmpresaUsuario_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_EmpresaUsuario_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE Caja(
	cj_id int NOT NULL,
	cj_nombre varchar(100) NOT NULL CONSTRAINT DF_Caja_cj_nombre  DEFAULT (''),
	cj_codigo varchar(15) NOT NULL,
	cj_descrip varchar(255) NOT NULL CONSTRAINT DF_Caja_cj_descrip  DEFAULT (''),
	cj_hojaruta smallint NOT NULL CONSTRAINT DF_Caja_cj_hojaruta  DEFAULT (0),
	suc_id int NOT NULL,
	emp_id int NOT NULL,
	doc_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Caja_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Caja_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Caja_activo  DEFAULT (1),
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
CREATE TABLE EmpresaProveedorDeuda(
	empprovd_id int NOT NULL,
	emp_id int NOT NULL,
	prov_id int NOT NULL,
	empprovd_creditoctacte decimal(18, 6) NOT NULL CONSTRAINT DF_EmpresaProveedorDeuda_empprov_creditoctacte  DEFAULT (0),
	empprovd_creditototal decimal(18, 6) NOT NULL CONSTRAINT DF_EmpresaProveedorDeuda_empprov_creditototal  DEFAULT (0),
	empprovd_creditoactivo smallint NOT NULL CONSTRAINT DF_EmpresaProveedorDeuda_empprov_creditoactivo  DEFAULT (1),
	empprovd_deudaorden decimal(18, 6) NOT NULL CONSTRAINT DF_EmpresaProveedorDeuda_empprov_deudaorden  DEFAULT (0),
	empprovd_deudaremito decimal(18, 6) NOT NULL CONSTRAINT DF_EmpresaProveedorDeuda_empprov_deudaremito  DEFAULT (0),
	empprovd_deudactacte decimal(18, 6) NOT NULL CONSTRAINT DF_EmpresaProveedorDeuda_empprov_deudactacte  DEFAULT (0),
	empprovd_deudadoc decimal(18, 6) NOT NULL CONSTRAINT DF_EmpresaProveedorDeuda_empprov_deudadoc  DEFAULT (0),
	empprovd_deudatotal decimal(18, 6) NOT NULL CONSTRAINT DF_EmpresaProveedorDeuda_empprov_deudatotal  DEFAULT (0),
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
CREATE TABLE Departamento(
	dpto_id int NOT NULL,
	dpto_nombre varchar(100) NOT NULL,
	dpto_codigo varchar(50) NOT NULL,
	dpto_descrip varchar(255) NOT NULL CONSTRAINT DF_Departamento_dpto_descrip  DEFAULT (''),
	dpto_id_padre int NULL,
	dptot_id int NOT NULL CONSTRAINT DF_Departamento_dptot_id  DEFAULT (1),
	emp_id int NOT NULL,
	pre_id_vernoticias int NULL,
	pre_id_editarnoticias int NULL,
	pre_id_vertareas int NULL,
	pre_id_asignartareas int NULL,
	pre_id_verdocumentos int NULL,
	pre_id_agregardocumentos int NULL,
	pre_id_borrardocumentos int NULL,
	pre_id_editardocumentos int NULL,
	modificado timestamptz NOT NULL CONSTRAINT DF_Departamento_modificado  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_Departamento_creado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Departamento_activo  DEFAULT (1),
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
CREATE TABLE EmpresaProveedor(
	empprov_id int NOT NULL,
	emp_id int NOT NULL,
	prov_id int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_EmpresaProveedor_activo  DEFAULT (0),
	creado timestamptz NOT NULL CONSTRAINT DF_EmpresaProveedor_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_EmpresaProveedor_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE Talonario(
	ta_id int NOT NULL,
	ta_nombre varchar(100) NOT NULL,
	ta_codigo varchar(15) NOT NULL,
	ta_descrip varchar(255) NOT NULL CONSTRAINT DF_Talonario_ta_descrip  DEFAULT (''),
	ta_ultimonro int NOT NULL CONSTRAINT DF_Talonario_ta_ultimonro  DEFAULT ((0)),
	ta_tipo smallint NOT NULL CONSTRAINT DF_Talonario_ta_tipo  DEFAULT ((0)),
	ta_mascara varchar(20) NOT NULL,
	ta_cai varchar(100) NOT NULL CONSTRAINT DF_Talonario_ta_cai  DEFAULT (''),
	ta_puntovta smallint NOT NULL CONSTRAINT DF_Talonario_ta_puntovta  DEFAULT ((0)),
	ta_tipoafip smallint NOT NULL CONSTRAINT DF_Talonario_ta_tipoafip  DEFAULT ((0)),
	emp_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Talonario_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Talonario_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Talonario_activo  DEFAULT ((1)),
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
CREATE TABLE ProveedorCacheCredito(
	prov_id int NOT NULL,
	doct_id int NOT NULL,
	id int NOT NULL,
	provcc_importe decimal(18, 6) NOT NULL CONSTRAINT DF_ProveedorCacheCredito_provc_importe  DEFAULT (0),
	emp_id int NOT NULL,
 CONSTRAINT PK_ProveedorCacheCredito PRIMARY KEY  
(
	prov_id ,
	doct_id ,
	id 
) 
) 
;
/****** Object:  Table ManifiestoCargaItemTMP    Script Date: 07/30/2012 17:16:46 ******/

;

;

;
CREATE TABLE ManifiestoCargaItemTMP(
	mfcTMP_id int NOT NULL,
	mfciTMP_id int NOT NULL,
	mfci_id int NOT NULL,
	mfci_orden smallint NOT NULL,
	mfci_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_cantidad  DEFAULT (0),
	mfci_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_pendiente  DEFAULT (0),
	mfci_pallets int NOT NULL,
	mfci_nropallet varchar(100) NOT NULL,
	mfci_descrip varchar(255) NOT NULL CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_descrip  DEFAULT (''),
	mfci_precio decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_precio  DEFAULT (0),
	mfci_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_precioUsr  DEFAULT (0),
	mfci_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_precioLista  DEFAULT (0),
	mfci_descuento varchar(100) NOT NULL CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_descuento  DEFAULT (''),
	mfci_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_ivari  DEFAULT (0),
	mfci_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_ivarni  DEFAULT (0),
	mfci_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_ivariporc  DEFAULT (0),
	mfci_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_ivarniporc  DEFAULT (0),
	mfci_importe decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaItemTMP_mfci_importe  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE ManifiestoCargaItemBorradoTMP(
	mfcTMP_id int NOT NULL,
	mfcibTMP_id int NOT NULL,
	mfc_id int NOT NULL,
	mfci_id int NOT NULL,
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
CREATE TABLE PresupuestoEnvioGastoTMP(
	preegTMP_id int NOT NULL,
	preeTMP_id int NOT NULL,
	preeg_id int NOT NULL,
	preeg_orden smallint NOT NULL,
	preeg_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioGastoTMP_preeg_cantidad_1  DEFAULT (0),
	preeg_pendiente decimal(18, 0) NOT NULL CONSTRAINT DF_PresupuestoEnvioGastoTMP_preeg_pendiente_1  DEFAULT (0),
	preeg_descrip varchar(5000) NOT NULL CONSTRAINT DF_PresupuestoEnvioGastoTMP_preeg_descrip_1  DEFAULT (''),
	preeg_precio decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioGastoTMP_preeg_precio_1  DEFAULT (0),
	preeg_precioTarifa decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioGastoTMP_preeg_precioTarifa_1  DEFAULT (0),
	preeg_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioGastoTMP_preeg_neto_1  DEFAULT (0),
	preeg_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioGastoTMP_preeg_ivari_1  DEFAULT (0),
	preeg_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioGastoTMP_preeg_ivarni_1  DEFAULT (0),
	preeg_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioGastoTMP_preeg_ivariporc_1  DEFAULT (0),
	preeg_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioGastoTMP_preeg_ivarniporc_1  DEFAULT (0),
	preeg_importe decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioGastoTMP_preeg_importe_1  DEFAULT (0),
	pr_id int NOT NULL,
	trans_id int NULL,
	trfg_id int NULL,
	gto_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE PresupuestoEnvioItemTMP(
	preeiTMP_id int NOT NULL,
	preeTMP_id int NOT NULL,
	preei_id int NOT NULL,
	preei_orden smallint NOT NULL,
	preei_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_cantidad_1  DEFAULT (0),
	preei_volumen decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_volumen_1  DEFAULT (0),
	preei_kilos decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_kilos  DEFAULT (0),
	preei_minimo decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_minimo  DEFAULT (0),
	preei_pendiente decimal(18, 0) NOT NULL CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_pendiente_1  DEFAULT (0),
	preei_descrip varchar(5000) NOT NULL CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_descrip_1  DEFAULT (''),
	preei_precio decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_precio_1  DEFAULT (0),
	preei_precioTarifa decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_precioTarifa_1  DEFAULT (0),
	preei_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_neto_1  DEFAULT (0),
	preei_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_ivari_1  DEFAULT (0),
	preei_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_ivarni_1  DEFAULT (0),
	preei_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_ivariporc_1  DEFAULT (0),
	preei_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_ivarniporc_1  DEFAULT (0),
	preei_importe decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvioItemTMP_preei_importe_1  DEFAULT (0),
	pr_id int NOT NULL,
	pue_id_origen int NOT NULL,
	pue_id_destino int NOT NULL,
	trans_id int NOT NULL,
	trfi_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE PresupuestoEnvioGastoBorradoTMP(
	preeTMP_id int NOT NULL,
	preegbTMP_id int NOT NULL,
	pree_id int NOT NULL,
	preeg_id int NOT NULL,
 CONSTRAINT PK_PresupuestoEnvioGastoBorradoTMP PRIMARY KEY  
(
	preegbTMP_id 
) 
) 
;
/****** Object:  Table PresupuestoEnvioItemBorradoTMP    Script Date: 07/30/2012 17:24:18 ******/

;

;
CREATE TABLE PresupuestoEnvioItemBorradoTMP(
	preeTMP_id int NOT NULL,
	preeibTMP_id int NOT NULL,
	pree_id int NOT NULL,
	preei_id int NOT NULL,
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
CREATE TABLE ParteDiario(
	ptd_id int NOT NULL,
	ptd_numero int NOT NULL,
	ptd_titulo varchar(255) NULL CONSTRAINT DF_ParteDiario_ptd_titulo  DEFAULT (''),
	ptd_descrip varchar(5000) NOT NULL CONSTRAINT DF_ParteDiario_tar_descrip  DEFAULT (''),
	ptd_fechaini timestamptz NOT NULL CONSTRAINT DF_ParteDiario_tar_fechaini  DEFAULT (getdate()),
	ptd_fechafin timestamptz NOT NULL CONSTRAINT DF_ParteDiario_tar_fechafin  DEFAULT (getdate()),
	ptd_alarma timestamptz NOT NULL CONSTRAINT DF_ParteDiario_tar_alarma  DEFAULT (getdate()),
	ptd_cumplida smallint NOT NULL CONSTRAINT DF_ParteDiario_tar_cumplida  DEFAULT (0),
	ptd_recurrente smallint NOT NULL CONSTRAINT DF_ParteDiario_ptd_recurrente  DEFAULT (0),
	ptd_listausuariosId varchar(255) NOT NULL CONSTRAINT DF_ParteDiario_ptd_listausuariosId  DEFAULT (''),
	ptd_publico smallint NOT NULL CONSTRAINT DF_ParteDiario_ptd_publico  DEFAULT (0),
	ptd_horaini timestamptz NOT NULL CONSTRAINT DF_ParteDiario_ptd_horaini  DEFAULT (getdate()),
	ptd_horafin timestamptz NOT NULL CONSTRAINT DF_ParteDiario_ptd_horafin  DEFAULT (getdate()),
	ptd_vtoaviso smallint NOT NULL CONSTRAINT DF_ParteDiario_ptd_vtoaviso  DEFAULT (0),
	ptd_vtocumplido smallint NOT NULL CONSTRAINT DF_ParteDiario_ptd_vtocumplido  DEFAULT (1),
	ptdt_id int NOT NULL CONSTRAINT DF_ParteDiario_ptdt_id  DEFAULT (1),
	ptd_id_padre int NULL,
	ptd_privado smallint NOT NULL CONSTRAINT DF_ParteDiario_ptd_privado  DEFAULT (0),
	us_id_responsable int NULL,
	us_id_asignador int NULL,
	cont_id int NULL,
	tarest_id int NULL,
	prio_id int NULL,
	lgj_id int NULL,
	cli_id int NULL,
	prov_id int NULL,
	dpto_id int NULL,
	ven_id int NULL,
	suc_id int NULL,
	doct_id int NULL,
	doc_id int NULL,
	prns_id int NULL,
	modificado timestamptz NOT NULL CONSTRAINT DF_ParteDiario_modificado  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_ParteDiario_creado  DEFAULT (getdate()),
	modifico int NOT NULL,
	tar_id int NULL,
	alum_id int NULL,
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
CREATE TABLE Tarea(
	tar_id int NOT NULL,
	tar_id_padre int NULL,
	tar_numero varchar(20) NOT NULL CONSTRAINT DF_Tarea_tar_numero  DEFAULT (''),
	tar_nombre varchar(255) NOT NULL CONSTRAINT DF_Tarea_tar_nombre  DEFAULT (''),
	tar_descrip varchar(7000) NOT NULL CONSTRAINT DF_Tarea_tar_descrip  DEFAULT (''),
	tar_fechaini timestamptz NOT NULL CONSTRAINT DF_Tarea_tar_fechaini  DEFAULT (getdate()),
	tar_fechafin timestamptz NOT NULL CONSTRAINT DF_Tarea_tar_fechafin  DEFAULT (getdate()),
	tar_alarma timestamptz NOT NULL CONSTRAINT DF_Tarea_tar_alarma  DEFAULT (getdate()),
	tar_estado1 timestamptz NOT NULL CONSTRAINT DF_Tarea_tar_estado2  DEFAULT (getdate()),
	tar_estado2 timestamptz NOT NULL CONSTRAINT DF_Tarea_tar_estado2_1  DEFAULT (getdate()),
	tar_horaini smallint NOT NULL CONSTRAINT DF_Tarea_tar_horaini  DEFAULT (0),
	tar_fechahoraini timestamptz NOT NULL CONSTRAINT DF_Tarea_tar_fechahoraini  DEFAULT (getdate()),
	tar_fechahorafin timestamptz NOT NULL CONSTRAINT DF_Tarea_tar_fechahorafin  DEFAULT (getdate()),
	tar_finalizada smallint NOT NULL CONSTRAINT DF_Tarea_tar_finalizada  DEFAULT (0),
	tar_cumplida smallint NOT NULL CONSTRAINT DF_Tarea_tar_cumplida  DEFAULT (0),
	tar_rechazada smallint NOT NULL CONSTRAINT DF_Tarea_tar_rechazada  DEFAULT (0),
	tar_aprobada smallint NOT NULL CONSTRAINT DF_Tarea_tar_aprobada  DEFAULT (0),
	tar_terminada timestamptz NOT NULL CONSTRAINT DF_Tarea_tar_terminada  DEFAULT (getdate()),
	tar_facturable smallint NOT NULL CONSTRAINT DF_Tarea_tar_facturable  DEFAULT (1),
	tar_plantilla smallint NOT NULL CONSTRAINT DF_Tarea_tar_plantilla  DEFAULT (0),
	tar_opcional smallint NOT NULL CONSTRAINT DF_Tarea_tar_opcional  DEFAULT (0),
	rub_id int NULL,
	us_id_responsable int NULL,
	us_id_asignador int NULL,
	us_id_alta int NOT NULL,
	cont_id int NULL,
	tarest_id int NULL,
	prio_id int NULL,
	proy_id int NOT NULL,
	proyi_id int NULL,
	obje_id int NULL,
	cli_id int NULL,
	clis_id int NULL,
	dpto_id int NULL,
	prns_id int NULL,
	os_id int NULL,
	alit_id int NULL,
	ali_id int NULL,
	modificado timestamptz NOT NULL CONSTRAINT DF_Tarea_modificado  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_Tarea_creado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Tarea_activo  DEFAULT (1),
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
CREATE TABLE ProyectoTareaEstado(
	proyest_id int NOT NULL,
	proy_id int NOT NULL,
	tarest_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ProyectoTareaEstado_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ProyectoTareaEstado_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_ProyectoTareaEstado_activo  DEFAULT (1),
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
CREATE TABLE OrdenServicioItem(
	os_id int NOT NULL,
	osi_id int NOT NULL,
	osi_orden smallint NOT NULL,
	osi_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioItem_pvi_cantidad  DEFAULT (0),
	osi_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioItem_pvi_cantidadaremitir  DEFAULT (0),
	osi_pendiente decimal(18, 0) NOT NULL CONSTRAINT DF_OrdenServicioItem_pvi_pendiente  DEFAULT (0),
	osi_descrip varchar(5000) NOT NULL CONSTRAINT DF_OrdenServicioItem_pvi_descrip  DEFAULT (''),
	osi_precio decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioItem_pvi_precio  DEFAULT (0),
	osi_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioItem_pvi_precioUsr  DEFAULT (0),
	osi_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioItem_pvi_precioLista  DEFAULT (0),
	osi_descuento varchar(100) NOT NULL CONSTRAINT DF_OrdenServicioItem_pvi_descuento  DEFAULT (''),
	osi_neto decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioItem_pvi_neto  DEFAULT (0),
	osi_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioItem_pvi_ivari  DEFAULT (0),
	osi_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioItem_pvi_ivarni  DEFAULT (0),
	osi_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioItem_pvi_ivariporc  DEFAULT (0),
	osi_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioItem_pvi_ivarniporc  DEFAULT (0),
	osi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioItem_pvi_importe  DEFAULT (0),
	osi_importCodigo varchar(255) NOT NULL CONSTRAINT DF__ordenserv__osi_i__17A78112  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
	stl_id int NULL,
	tar_id int NULL,
	cont_id int NULL,
	etf_id int NULL,
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
CREATE TABLE PedidoVentaItem(
	pv_id int NOT NULL,
	pvi_id int NOT NULL,
	pvi_orden smallint NOT NULL,
	pvi_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItem_pvi_cantidad  DEFAULT (0),
	pvi_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItem_pvi_cantidadaremitir  DEFAULT (0),
	pvi_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItem_pvi_pendiente  DEFAULT (0),
	pvi_pendientepklst decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItem_pvi_pendientepklst  DEFAULT (0),
	pvi_pendienteprv decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItem_pvi_pendienteprv  DEFAULT (0),
	pvi_descrip varchar(5000) NOT NULL CONSTRAINT DF_PedidoVentaItem_pvi_descrip  DEFAULT (''),
	pvi_precio decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItem_pvi_precio  DEFAULT (0),
	pvi_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItem_pvi_precioUsr  DEFAULT (0),
	pvi_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItem_pvi_precioLista  DEFAULT (0),
	pvi_descuento varchar(100) NOT NULL CONSTRAINT DF_PedidoVentaItem_pvi_descuento  DEFAULT (''),
	pvi_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItem_pv_neto  DEFAULT (0),
	pvi_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItem_pvi_ivari  DEFAULT (0),
	pvi_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItem_pvi_ivarni  DEFAULT (0),
	pvi_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItem_pvi_ivariporc  DEFAULT (0),
	pvi_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItem_pvi_ivarniporc  DEFAULT (0),
	pvi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItem_pvi_importe  DEFAULT (0),
	pvi_codigocomunidad varchar(255) NOT NULL CONSTRAINT DF_PedidoVentaItem_pvi_codigocomunidad  DEFAULT (''),
	pr_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE ComunidadInternetMail(
	cmie_id int NOT NULL,
	cmie_account varchar(255) NOT NULL,
	cmie_mailid varchar(50) NOT NULL,
	cmie_fromname varchar(1000) NOT NULL,
	cmie_fromaddress varchar(1000) NOT NULL,
	cmie_to varchar(255) NOT NULL,
	cmie_subject varchar(2000) NOT NULL,
	cmie_body_html text NOT NULL,
	cmie_body_plain text NOT NULL,
	cmie_body_mime text NOT NULL,
	cmie_subject_mime varchar(2000) NOT NULL,
	cmie_header_mime text NOT NULL,
	cmie_body_updated smallint NOT NULL CONSTRAINT DF_ComunidadInternetMail_cmie_body_updated  DEFAULT (0),
	cmie_date timestamptz NOT NULL CONSTRAINT DF_ComunidadInternetMail_cmie_date  DEFAULT ('19000101'),
	cmi_id int NULL,
	cmiea_id int NOT NULL,
	cli_id int NULL,
	est_id int NOT NULL CONSTRAINT DF_ComunidadInternetMail_est_id  DEFAULT (1),
	pv_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ComunidadInternetMail_creado  DEFAULT (getdate()),
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
CREATE TABLE PedidoVentaItemStock(
	pv_id int NOT NULL,
	pvist_id int NOT NULL,
	pvi_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItemStock_pvi_pendiente  DEFAULT (0),
	pr_id int NOT NULL,
	pr_id_kit int NULL,
	pr_id_kitpadre int NULL,
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
CREATE TABLE Hora(
	hora_id int NOT NULL,
	hora_titulo varchar(255) NOT NULL CONSTRAINT DF_Hora_hora_titulo  DEFAULT (''),
	hora_descrip varchar(7000) NOT NULL CONSTRAINT DF_Hora_hora_descrip  DEFAULT (''),
	hora_fecha timestamptz NOT NULL,
	hora_desde timestamptz NOT NULL,
	hora_hasta timestamptz NOT NULL,
	hora_horas smallint NOT NULL CONSTRAINT DF_Hora_hora_horas  DEFAULT (0),
	hora_minutos smallint NOT NULL CONSTRAINT DF_Hora_hora_minutos  DEFAULT (0),
	hora_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_Hora_hora_pendiente  DEFAULT (0),
	hora_facturable smallint NOT NULL CONSTRAINT DF_Hora_hora_facturable  DEFAULT (0),
	cli_id int NOT NULL,
	proy_id int NOT NULL,
	proyi_id int NOT NULL,
	obje_id int NOT NULL,
	us_id int NOT NULL,
	tar_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Hora_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Hora_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE AlarmaItem(
	al_id int NOT NULL,
	ali_id int NOT NULL,
	ali_nombre varchar(255) NOT NULL,
	ali_tiempo smallint NOT NULL,
	ali_tiempotipo smallint NOT NULL,
	ali_tiempodesde smallint NOT NULL CONSTRAINT DF_AlarmaItem_ali_tiempodesde  DEFAULT (1),
	ali_secuencia smallint NOT NULL,
	ali_obligatorioremito smallint NOT NULL,
	ali_obligatoriofactura smallint NOT NULL,
	ali_alarma1 smallint NOT NULL,
	ali_alarmatipo1 smallint NOT NULL,
	ali_alarma2 smallint NOT NULL,
	ali_alarmatipo2 smallint NOT NULL,
	ali_tipo smallint NOT NULL CONSTRAINT DF_AlarmaItem_ali_pasopresupuesto  DEFAULT (1),
	ali_laboral smallint NOT NULL CONSTRAINT DF_AlarmaItem_ali_laboral  DEFAULT (1),
	alit_id int NOT NULL,
	dpto_id int NULL,
	mail_id_inicio int NULL,
	mail_id_alarma1 int NULL,
	mail_id_alarma2 int NULL,
	mail_id_finalizado int NULL,
	mail_id_vencido int NULL,
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
CREATE TABLE TrabajoImpresionItem(
	timp_id int NOT NULL,
	timpi_id int NOT NULL,
	timpi_rptname varchar(1000) NOT NULL CONSTRAINT DF_TrabajoImpresionItem_timp_rptname  DEFAULT (''),
	timpi_rptfile varchar(500) NOT NULL CONSTRAINT DF_TrabajoImpresionItem_timp_rptfile  DEFAULT (''),
	timpi_action smallint NOT NULL CONSTRAINT DF_TrabajoImpresionItem_timp_action  DEFAULT (0),
	timpi_copies smallint NOT NULL CONSTRAINT DF_TrabajoImpresionItem_timp_copies  DEFAULT (0),
	timpi_strobject varchar(255) NOT NULL CONSTRAINT DF_TrabajoImpresionItem_timp_strobject  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_TrabajoImpresionItem_creado  DEFAULT (getdate()),
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
CREATE TABLE ImportacionLog(
	impl_id int NOT NULL,
	impl_fecha timestamptz NOT NULL CONSTRAINT DF_ImportacionLog_impl_fecha  DEFAULT (getdate()),
	impl_descrip varchar(5000) NOT NULL CONSTRAINT DF_ImportacionLog_impl_descrip  DEFAULT (''),
	impl_severidad smallint NOT NULL CONSTRAINT DF_ImportacionLog_impl_severidad  DEFAULT (0),
	impp_id int NOT NULL,
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
CREATE TABLE ImportacionProcesoItem(
	impp_id int NOT NULL,
	imppi_id int NOT NULL,
	imppi_objeto varchar(255) NOT NULL,
	imppi_params varchar(5000) NOT NULL CONSTRAINT DF_ImportacionProcesoItem_imppi_params  DEFAULT (''),
	imppi_ultimaimportacion timestamptz NOT NULL CONSTRAINT DF_ImportacionProcesoItem_imppi_ultimaimportacion  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ImportacionProcesoItem_modificado  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_ImportacionProcesoItem_creado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE Chofer(
	chof_id int NOT NULL,
	chof_nombre varchar(100) NOT NULL,
	chof_codigo varchar(15) NOT NULL,
	chof_descrip varchar(255) NOT NULL CONSTRAINT DF_Chofer_chof_descrip  DEFAULT (''),
	chof_tipodni smallint NOT NULL CONSTRAINT DF_Chofer_chof_tipodni  DEFAULT (0),
	chof_dni int NOT NULL CONSTRAINT DF_Chofer_chof_dni  DEFAULT (0),
	chof_fechadenacimiento timestamptz NOT NULL,
	chof_direccion varchar(255) NOT NULL CONSTRAINT DF_Chofer_chof_direccion  DEFAULT (''),
	chof_telefono varchar(50) NOT NULL CONSTRAINT DF_Chofer_chof_telefono  DEFAULT (''),
	trans_id int NULL,
	cam_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Chofer_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Chofer_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Chofer_activo  DEFAULT (1),
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
CREATE TABLE Tarifa(
	trf_id int NOT NULL,
	trf_nombre varchar(100) NOT NULL,
	trf_codigo varchar(15) NOT NULL,
	trf_fechaDesde timestamptz NOT NULL CONSTRAINT DF_Tarifa_trf_fechaDesde  DEFAULT (getdate()),
	trf_fechaHasta timestamptz NOT NULL CONSTRAINT DF_Tarifa_trf_fechaHasta  DEFAULT (getdate()),
	trf_descrip varchar(255) NOT NULL,
	trf_tipo smallint NOT NULL CONSTRAINT DF_Tarifa_trf_tipo_1  DEFAULT (0),
	trans_id int NOT NULL,
	mon_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Tarifa_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Tarifa_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Tarifa_activo  DEFAULT (1),
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
CREATE TABLE Camion(
	cam_id int NOT NULL,
	cam_codigo varchar(15) NOT NULL,
	cam_descrip varchar(255) NOT NULL CONSTRAINT DF_camion_cam_descrip  DEFAULT (''),
	cam_patente varchar(20) NOT NULL,
	cam_patentesemi varchar(20) NOT NULL,
	cam_tara int NOT NULL,
	cam_essemi smallint NOT NULL CONSTRAINT DF_Camion_cam_eschasis  DEFAULT (0),
	trans_id int NULL,
	chof_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_camion_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_camion_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Camion_activo  DEFAULT (1),
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
CREATE TABLE DocumentoImpresora(
	doci_id int NOT NULL,
	doc_id int NULL,
	ta_id int NULL,
	doci_pc varchar(255) NOT NULL CONSTRAINT DF_DocumentoImpresora_doci_pc  DEFAULT (''),
	doci_impresora varchar(255) NOT NULL CONSTRAINT DF_DocumentoImpresora_doci_impresora  DEFAULT (''),
	doci_bandeja varchar(255) NOT NULL CONSTRAINT DF_DocumentoImpresora_doci_bandeja  DEFAULT (''),
	doci_printbyservice smallint NOT NULL CONSTRAINT DF_DocumentoImpresora_doci_printbyservice  DEFAULT (0),
	creado timestamptz NOT NULL CONSTRAINT DF_DocumentoImpresora_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_DocumentoImpresora_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE ResolucionCupon(
	rcup_id int NOT NULL,
	rcup_numero int NOT NULL,
	rcup_nrodoc varchar(50) NOT NULL CONSTRAINT DF_ResolucionCupon_rcup_nrodoc  DEFAULT (''),
	rcup_descrip varchar(5000) NOT NULL CONSTRAINT DF_ResolucionCupon_rcup_descrip  DEFAULT (''),
	rcup_fecha timestamptz NOT NULL CONSTRAINT DF_ResolucionCupon_rcup_fecha  DEFAULT (getdate()),
	rcup_total decimal(18, 6) NOT NULL CONSTRAINT DF_ResolucionCupon_rcup_total  DEFAULT (0),
	rcup_firmado int NOT NULL CONSTRAINT DF_ResolucionCupon_mf_firmado  DEFAULT (0),
	rcup_grabarasiento smallint NOT NULL CONSTRAINT DF_ResolucionCupon_mf_grabarasiento  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	as_id int NULL,
	lgj_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ResolucionCupon_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ResolucionCupon_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
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
CREATE TABLE CotizacionCompra(
	cot_id int NOT NULL,
	cot_numero int NOT NULL,
	cot_nrodoc varchar(50) NOT NULL CONSTRAINT DF_CotizacionCompra_cot_nrodoc  DEFAULT (''),
	cot_descrip varchar(5000) NOT NULL CONSTRAINT DF_CotizacionCompra_cot_descrip  DEFAULT (''),
	cot_fecha timestamptz NOT NULL CONSTRAINT DF_CotizacionCompra_cot_fecha  DEFAULT (getdate()),
	cot_fechaentrega timestamptz NOT NULL CONSTRAINT DF_CotizacionCompra_cot_fechaentrega  DEFAULT (getdate()),
	cot_neto decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompra_cot_neto  DEFAULT (0),
	cot_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompra_cot_impuesto  DEFAULT (0),
	cot_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompra_cot_ivarni  DEFAULT (0),
	cot_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompra_cot_subtotal  DEFAULT (0),
	cot_total decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompra_cot_total  DEFAULT (0),
	cot_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompra_cot_pendiente  DEFAULT (0),
	cot_firmado int NOT NULL CONSTRAINT DF_CotizacionCompra_cot_firmado  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	lp_id int NULL,
	cpg_id int NOT NULL,
	ccos_id int NULL,
	us_id int NULL,
	lgj_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_CotizacionCompra_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_CotizacionCompra_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
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
CREATE TABLE ReporteFormulario(
	rptf_id int NOT NULL,
	rptf_nombre varchar(255) NOT NULL,
	rptf_csrfile varchar(255) NOT NULL,
	rptf_tipo smallint NOT NULL,
	rptf_sugerido smallint NOT NULL,
	rptf_sugeridoemail smallint NOT NULL CONSTRAINT DF_ReporteFormulario_rptf_sugeridoemail  DEFAULT (0),
	rptf_copias smallint NOT NULL,
	rptf_docImprimirEnAlta smallint NOT NULL,
	rptf_object varchar(255) NOT NULL CONSTRAINT DF_ReporteFormulario_rptf_object  DEFAULT (''),
	tbl_id int NULL,
	doc_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ReporteFormulario_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ReporteFormulario_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_ReporteFormulario_activo  DEFAULT (1),
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
CREATE TABLE PresupuestoEnvio(
	pree_id int NOT NULL,
	pree_numero int NOT NULL,
	pree_nrodoc varchar(50) NOT NULL CONSTRAINT DF_PresupuestoEnvio_pree_nrodoc  DEFAULT (''),
	pree_descrip varchar(5000) NOT NULL CONSTRAINT DF_PresupuestoEnvio_pree_descrip  DEFAULT (''),
	pree_fecha timestamptz NOT NULL CONSTRAINT DF_PresupuestoEnvio_pree_fecha  DEFAULT (getdate()),
	pree_fechaentrega timestamptz NOT NULL CONSTRAINT DF_PresupuestoEnvio_pree_fechaentrega  DEFAULT (getdate()),
	pree_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvio_pree_neto  DEFAULT (0),
	pree_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvio_pree_impuesto  DEFAULT (0),
	pree_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvio_pree_ivarni  DEFAULT (0),
	pree_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvio_pree_subtotal  DEFAULT (0),
	pree_total decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvio_pree_total  DEFAULT (0),
	pree_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvio_pree_pendiente  DEFAULT (0),
	pree_firmado int NOT NULL CONSTRAINT DF_PresupuestoEnvio_pree_firmado  DEFAULT (0),
	pree_descuento1 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvio_pree_descuento  DEFAULT (0),
	pree_descuento2 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvio_pree_descuento2  DEFAULT (0),
	pree_importedesc1 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvio_pree_importedesc1  DEFAULT (0),
	pree_importedesc2 decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoEnvio_pree_importedesc2  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	cli_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	cpg_id int NOT NULL,
	ccos_id int NULL,
	ven_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_PresupuestoEnvio_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_PresupuestoEnvio_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
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
CREATE TABLE DocumentoFirma(
	docfr_id int NOT NULL,
	doc_id int NOT NULL,
	us_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_DocumentoFirma_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_DocumentoFirma_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE DepositoBanco(
	dbco_id int NOT NULL,
	dbco_numero int NOT NULL,
	dbco_nrodoc varchar(50) NOT NULL CONSTRAINT DF_DepositoBanco_dbco_nrodoc  DEFAULT (''),
	dbco_descrip varchar(5000) NOT NULL CONSTRAINT DF_DepositoBanco_dbco_descrip  DEFAULT (''),
	dbco_fecha timestamptz NOT NULL CONSTRAINT DF_DepositoBanco_dbco_fecha  DEFAULT (getdate()),
	dbco_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_DepositoBanco_cobz_cotizacion  DEFAULT (0),
	dbco_total decimal(18, 6) NOT NULL CONSTRAINT DF_DepositoBanco_dbco_total  DEFAULT (0),
	dbco_totalorigen decimal(18, 6) NOT NULL CONSTRAINT DF_DepositoBanco_dbco_totalorigen  DEFAULT (0),
	dbco_firmado int NOT NULL CONSTRAINT DF_DepositoBanco_mf_firmado  DEFAULT (0),
	dbco_grabarasiento smallint NOT NULL CONSTRAINT DF_DepositoBanco_mf_grabarasiento  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	bco_id int NOT NULL,
	cue_id int NOT NULL,
	as_id int NULL,
	lgj_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_DepositoBanco_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_DepositoBanco_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
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
CREATE TABLE CondicionPago(
	cpg_id int NOT NULL,
	cpg_nombre varchar(100) NOT NULL,
	cpg_codigo varchar(15) NOT NULL,
	cpg_descrip varchar(255) NOT NULL CONSTRAINT DF_CondicionPago_cpg_descrip  DEFAULT (''),
	cpg_escontado smallint NOT NULL CONSTRAINT DF_CondicionPago_cpg_escontado  DEFAULT (0),
	cpg_eslibre smallint NOT NULL CONSTRAINT DF_CondicionPago_cpg_eslibre  DEFAULT (0),
	cpg_asientoXVto smallint NOT NULL CONSTRAINT DF_CondicionPago_cpg_asientoXVto  DEFAULT (0),
	cpg_tipo smallint NOT NULL CONSTRAINT DF_CondicionPago_cpg_tipo  DEFAULT (1),
	cueg_id int NULL,
	doc_id int NULL,
	activo smallint NOT NULL CONSTRAINT DF_CondicionPago_activo  DEFAULT (0),
	creado timestamptz NOT NULL CONSTRAINT DF_CondicionPago_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_CondicionPago_modificado  DEFAULT (getdate()),
	modifico int NOT NULL CONSTRAINT DF_CondicionPago_modifico  DEFAULT (1),
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
CREATE TABLE Asiento(
	as_id int NOT NULL,
	as_numero int NOT NULL,
	as_nrodoc varchar(50) NOT NULL CONSTRAINT DF_Asiento_as_nrodoc  DEFAULT (''),
	as_nrodocld varchar(50) NOT NULL CONSTRAINT DF_Asiento_as_nrodocld  DEFAULT (''),
	as_descrip varchar(5000) NOT NULL CONSTRAINT DF_Asiento_as_descrip  DEFAULT (''),
	as_fecha timestamptz NOT NULL CONSTRAINT DF_Asiento_as_fecha  DEFAULT (getdate()),
	as_doc_cliente varchar(5000) NOT NULL CONSTRAINT DF_Asiento_as_doc_cliente  DEFAULT (''),
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	doct_id_cliente int NULL,
	doc_id_cliente int NULL,
	id_cliente int NOT NULL CONSTRAINT DF_Asiento_id_cliente  DEFAULT (0),
	creado timestamptz NOT NULL CONSTRAINT DF_Asiento_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Asiento_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
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
CREATE TABLE DepositoCupon(
	dcup_id int NOT NULL,
	dcup_numero int NOT NULL,
	dcup_nrodoc varchar(50) NOT NULL CONSTRAINT DF_DepositoCupon_dcup_nrodoc  DEFAULT (''),
	dcup_descrip varchar(5000) NOT NULL CONSTRAINT DF_DepositoCupon_dcup_descrip  DEFAULT (''),
	dcup_fecha timestamptz NOT NULL CONSTRAINT DF_DepositoCupon_dcup_fecha  DEFAULT (getdate()),
	dcup_total decimal(18, 6) NOT NULL CONSTRAINT DF_DepositoCupon_dcup_total  DEFAULT (0),
	dcup_firmado int NOT NULL CONSTRAINT DF_DepositoCupon_mf_firmado  DEFAULT (0),
	dcup_grabarasiento smallint NOT NULL CONSTRAINT DF_DepositoCupon_mf_grabarasiento  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	as_id int NULL,
	lgj_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_DepositoCupon_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_DepositoCupon_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
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
CREATE TABLE PedidoCompra(
	pc_id int NOT NULL,
	pc_numero int NOT NULL,
	pc_nrodoc varchar(50) NOT NULL CONSTRAINT DF_PedidoCompra_prsp_nrodoc  DEFAULT (''),
	pc_descrip varchar(5000) NOT NULL CONSTRAINT DF_PedidoCompra_prsp_descrip  DEFAULT (''),
	pc_fecha timestamptz NOT NULL CONSTRAINT DF_PedidoCompra_prsp_fecha  DEFAULT (getdate()),
	pc_fechaentrega timestamptz NOT NULL CONSTRAINT DF_PedidoCompra_prsp_fechaentrega  DEFAULT (getdate()),
	pc_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompra_prsp_neto  DEFAULT (0),
	pc_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompra_prsp_ivari  DEFAULT (0),
	pc_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompra_prsp_ivarni  DEFAULT (0),
	pc_total decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompra_prsp_total  DEFAULT (0),
	pc_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompra_pv_subtotal  DEFAULT (0),
	pc_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompra_pv_pendiente  DEFAULT (0),
	pc_firmado int NOT NULL CONSTRAINT DF_PedidoCompra_pv_firmado  DEFAULT (0),
	us_id int NOT NULL,
	est_id int NOT NULL,
	ccos_id int NULL,
	suc_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	lp_id int NULL,
	lgj_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_PedidoCompra_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_PedidoCompra_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
 CONSTRAINT PK_PedidoCompra PRIMARY KEY  
(
	pc_id 
) ,
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
CREATE TABLE FacturaVentaCobranza(
	fvcobz_id int NOT NULL,
	fvcobz_importe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaCobranza_fvcob_importe  DEFAULT (0),
	fvcobz_importeOrigen decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaCobranza_fvcobz_importe1  DEFAULT (0),
	fvcobz_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaCobranza_fvcobz_cotizacion  DEFAULT (0),
	fv_id int NOT NULL,
	fvd_id int NULL,
	fvp_id int NULL,
	cobz_id int NOT NULL,
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
CREATE TABLE AFIPCampo(
	afcampo_id int NOT NULL,
	afcampo_nombre varchar(255) NOT NULL CONSTRAINT DF_AFIPCampo_afcampo_nombre  DEFAULT (''),
	afcampo_descrip varchar(255) NOT NULL CONSTRAINT DF_AFIPCampo_afcampo_descrip  DEFAULT (''),
	afcampo_formatoFecha varchar(50) NOT NULL CONSTRAINT DF_AFIPCampo_afcampo_formatoFecha  DEFAULT (''),
	afcampo_tipo smallint NOT NULL,
	afcampo_posicion smallint NOT NULL,
	afcampo_relleno varchar(1) NOT NULL CONSTRAINT DF_AFIPCampo_afcampo_relleno  DEFAULT (''),
	afcampo_separadorDecimal varchar(1) NOT NULL CONSTRAINT DF_AFIPCampo_afcampo_separadorDecimal  DEFAULT (''),
	afcampo_cantDigitosEnteros smallint NOT NULL,
	afcampo_cantDigitosDecimales smallint NOT NULL,
	afcampo_largo smallint NOT NULL,
	afcampo_alineacion smallint NOT NULL,
	afcampo_columna varchar(100) NOT NULL,
	afreg_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_AFIPCampo_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_AFIPCampo_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_AFIPCampo_activo  DEFAULT (1),
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
CREATE TABLE RecuentoStockItemTMP(
	rsTMP_id int NOT NULL,
	rsiTMP_id int NOT NULL,
	rsi_id int NOT NULL,
	rsi_orden smallint NOT NULL,
	rsi_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_RecuentoStockItemTMP_rsi_cantidad  DEFAULT (0),
	rsi_descrip varchar(5000) NOT NULL CONSTRAINT DF_RecuentoStockItemTMP_rsi_descrip  DEFAULT (''),
	pr_id int NOT NULL,
	depl_id int NOT NULL,
	stl_id int NULL,
	stl_codigo varchar(50) NOT NULL CONSTRAINT DF_RecuentoStockItemTMP_stl_codigo  DEFAULT (''),
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
CREATE TABLE RecuentoStockItemSerieTMP(
	rsTMP_id int NOT NULL,
	rsiTMP_id int NOT NULL,
	rsi_id int NOT NULL CONSTRAINT DF_RecuentoStockItemSerieTMP_rsi_id  DEFAULT (0),
	rsisTMP_id int NOT NULL,
	rsis_orden smallint NOT NULL CONSTRAINT DF_RecuentoStockItemSerieTMP_rsis_orden  DEFAULT (0),
	prns_codigo varchar(100) NOT NULL CONSTRAINT DF_RecuentoStockItemSerieTMP_prns_codigo  DEFAULT (''),
	prns_descrip varchar(255) NOT NULL CONSTRAINT DF_RecuentoStockItemSerieTMP_prns_descrip  DEFAULT (''),
	prns_fechavto timestamptz NOT NULL CONSTRAINT DF_RecuentoStockItemSerieTMP_prns_fechavto  DEFAULT (getdate()),
	pr_id int NOT NULL,
	prns_id int NOT NULL CONSTRAINT DF_RecuentoStockItemSerieTMP_prns_id  DEFAULT (0),
	pr_id_item int NULL,
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
CREATE TABLE ExpoPackingList(
	epklst_id int NOT NULL,
	epklst_texto varchar(5000) NOT NULL CONSTRAINT DF_ExpoPackingList_epklst_texto  DEFAULT (''),
	epklst_codigo varchar(255) NOT NULL CONSTRAINT DF_ExpoPackingList_epklst_codigo  DEFAULT (''),
	epklst_unidad varchar(255) NOT NULL CONSTRAINT DF_ExpoPackingList_epklst_unidad  DEFAULT (''),
	epklst_posarancel varchar(255) NOT NULL CONSTRAINT DF_ExpoPackingList_epklst_posarancel  DEFAULT (''),
	epklst_titulo varchar(255) NOT NULL CONSTRAINT DF_ExpoPackingList_epklst_titulo  DEFAULT (''),
	pklst_id int NOT NULL CONSTRAINT DF_ExpoPackingList_pklst_id  DEFAULT (0),
	idm_id int NULL,
	egp_id int NULL,
	modifico int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ExpoPackingList_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ExpoPackingList_modificado  DEFAULT (getdate()),
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
CREATE TABLE ExpoFacturaVenta(
	efv_id int NOT NULL,
	efv_texto varchar(5000) NOT NULL CONSTRAINT DF_ExpoFacturaVenta_efv_texto  DEFAULT (''),
	efv_codigo varchar(255) NOT NULL CONSTRAINT DF_ExpoFacturaVenta_efv_codigo  DEFAULT (''),
	efv_unidad varchar(255) NOT NULL CONSTRAINT DF_ExpoFacturaVenta_efv_unidad  DEFAULT (''),
	efv_posarancel varchar(255) NOT NULL CONSTRAINT DF_ExpoFacturaVenta_efv_posarancel  DEFAULT (''),
	efv_titulo varchar(255) NOT NULL CONSTRAINT DF_ExpoFacturaVenta_efv_titulo  DEFAULT (''),
	fv_id int NOT NULL CONSTRAINT DF_ExpoFacturaVenta_fv_id  DEFAULT (0),
	idm_id int NULL,
	egp_id int NULL,
	modifico int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ExpoFacturaVenta_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ExpoFacturaVenta_modificado  DEFAULT (getdate()),
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
CREATE TABLE Leyenda(
	ley_id int NOT NULL,
	ley_nombre varchar(100) NOT NULL,
	ley_codigo varchar(255) NOT NULL,
	ley_descrip varchar(255) NOT NULL CONSTRAINT DF_Leyenda_ley_descripcion  DEFAULT (''),
	ley_texto text NOT NULL,
	idm_id int NULL,
	activo smallint NOT NULL CONSTRAINT DF_Leyenda_activo  DEFAULT (1),
	creado timestamptz NOT NULL CONSTRAINT DF_Leyenda_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Leyenda_mofidicado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE Cobranza(
	cobz_id int NOT NULL,
	cobz_numero int NOT NULL,
	cobz_nrodoc varchar(50) NOT NULL CONSTRAINT DF_Cobranza_cobz_nrodoc  DEFAULT (''),
	cobz_descrip varchar(5000) NOT NULL CONSTRAINT DF_Cobranza_cobz_descrip  DEFAULT (''),
	cobz_fecha timestamptz NOT NULL CONSTRAINT DF_Cobranza_cobz_fecha  DEFAULT (getdate()),
	cobz_neto decimal(18, 6) NOT NULL CONSTRAINT DF_Cobranza_cobz_neto  DEFAULT (0),
	cobz_otros decimal(18, 6) NOT NULL CONSTRAINT DF_Cobranza_cobz_otros  DEFAULT (0),
	cobz_total decimal(18, 6) NOT NULL CONSTRAINT DF_Cobranza_cobz_total  DEFAULT (0),
	cobz_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_Cobranza_cobz_pendiente  DEFAULT (0),
	cobz_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_Cobranza_cobz_cotizacion  DEFAULT (0),
	cobz_grabarAsiento smallint NOT NULL CONSTRAINT DF_Cobranza_cobz_grabarAsiento  DEFAULT (0),
	cobz_firmado int NOT NULL CONSTRAINT DF_Cobranza_fv_firmado  DEFAULT (0),
	cobz_hojaruta smallint NOT NULL CONSTRAINT DF_Cobranza_cobz_hojaruta  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	cli_id int NOT NULL,
	emp_id int NOT NULL,
	doc_id int NOT NULL,
	doct_id int NOT NULL,
	cob_id int NULL,
	ccos_id int NULL,
	lgj_id int NULL,
	as_id int NULL,
	mcj_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Cobranza_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Cobranza_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL CONSTRAINT DF__Cobranza__impres__0490B3EB  DEFAULT (0),
	emailenviado smallint NOT NULL DEFAULT ((0)),
 CONSTRAINT PK_Cobranza PRIMARY KEY  
(
	cobz_id 
) ,
 CONSTRAINT IX_Cobranza UNIQUE  
(
	cobz_numero 
) ,
 CONSTRAINT IX_CobranzaNroDoc UNIQUE  
(
	emp_id ,
	cobz_nrodoc 
) 
) 
;

;
/****** Object:  Table Informe    Script Date: 07/30/2012 17:14:45 ******/

;

;

;
CREATE TABLE Informe(
	inf_id int NOT NULL,
	inf_nombre varchar(255) NOT NULL,
	inf_codigo varchar(15) NOT NULL,
	inf_descrip varchar(1000) NOT NULL CONSTRAINT DF_Informe_inf_descrip  DEFAULT (''),
	inf_storedprocedure varchar(50) NOT NULL,
	inf_reporte varchar(255) NOT NULL CONSTRAINT DF_Informe_inf_reporte  DEFAULT (''),
	inf_presentaciondefault smallint NOT NULL CONSTRAINT DF_Informe_inf_presentaciondefault  DEFAULT (1),
	inf_modulo varchar(255) NOT NULL,
	inf_tipo smallint NOT NULL CONSTRAINT DF_Informe_inf_tipo  DEFAULT (1),
	inf_propietario smallint NOT NULL,
	inf_colocultas smallint NOT NULL CONSTRAINT DF_Informe_inf_colocultas  DEFAULT (0),
	inf_checkbox varchar(100) NOT NULL CONSTRAINT DF_Informe_inf_checkbox  DEFAULT (''),
	inf_totalesgrales smallint NOT NULL CONSTRAINT DF_Informe_inf_totalesgrales  DEFAULT (0),
	inf_connstr varchar(1000) NOT NULL CONSTRAINT DF_Informe_inf_connstr  DEFAULT (''),
	pre_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Informe_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Informe_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Informe_activo  DEFAULT (1),
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
CREATE TABLE Proyecto(
	proy_id int NOT NULL,
	proy_nombre varchar(100) NOT NULL,
	proy_codigo varchar(15) NOT NULL,
	proy_descrip varchar(255) NOT NULL CONSTRAINT DF_Proyecto_proy_descrip  DEFAULT (''),
	proy_desde timestamptz NOT NULL CONSTRAINT DF_Proyecto_proy_desde  DEFAULT (getdate()),
	proy_hasta timestamptz NOT NULL CONSTRAINT DF_Proyecto_proy_hasta  DEFAULT ('29991231'),
	proy_id_padre int NULL,
	proy_llevaAprobacion smallint NOT NULL CONSTRAINT DF_Proyecto_proy_llevaAprobacion  DEFAULT (0),
	proy_fileSize smallint NOT NULL CONSTRAINT DF_Proyecto_proy_fileSize  DEFAULT (1),
	proy_publico smallint NOT NULL CONSTRAINT DF_Proyecto_proy_publico  DEFAULT (0),
	prov_id int NULL,
	cli_id int NULL,
	pr_id int NULL,
	ta_id int NULL,
	us_id_alta int NOT NULL,
	pre_id_listTarea int NULL,
	pre_id_editTarea int NULL,
	pre_id_delTarea int NULL,
	pre_id_addTarea int NULL,
	pre_id_editTareaP int NULL,
	pre_id_delTareaP int NULL,
	pre_id_listTareaD int NULL,
	pre_id_editTareaD int NULL,
	pre_id_delTareaD int NULL,
	pre_id_listHoraD int NULL,
	pre_id_listHora int NULL,
	pre_id_editHora int NULL,
	pre_id_delHora int NULL,
	pre_id_editHoraP int NULL,
	pre_id_delHoraP int NULL,
	pre_id_addHora int NULL,
	pre_id_tomarTarea int NULL,
	pre_id_asignarTarea int NULL,
	pre_id_aprobarTarea int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Proyecto_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Proyecto_modificado  DEFAULT (getdate()),
	modifico int NOT NULL CONSTRAINT DF_Proyecto_modifico  DEFAULT (1),
	activo smallint NOT NULL CONSTRAINT DF_Proyecto_activo  DEFAULT (1),
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
CREATE TABLE Agenda(
	agn_id int NOT NULL,
	agn_nombre varchar(255) NOT NULL,
	agn_codigo varchar(100) NOT NULL,
	agn_descrip varchar(255) NOT NULL CONSTRAINT DF_Agenda_agn_descrip  DEFAULT (''),
	pre_id_agregar int NULL,
	pre_id_editar int NULL,
	pre_id_borrar int NULL,
	pre_id_listar int NULL,
	pre_id_propietario int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Agenda_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Agenda_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Agenda_activo  DEFAULT (1),
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
CREATE TABLE InformeSumaries(
	inf_id int NOT NULL,
	winfs_id int NOT NULL,
	winfs_nombre varchar(100) NOT NULL,
	winfs_operacion varchar(50) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_InformeSumaries_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_InformeSumaries_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE InformeHiperlinks(
	inf_id int NOT NULL,
	winfh_id int NOT NULL,
	winfh_nombre varchar(255) NOT NULL,
	winfh_columna varchar(100) NOT NULL,
	winfh_url varchar(1000) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_InformeHiperlinks_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_InformeHiperlinks_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE InformeParametro(
	infp_id int NOT NULL,
	infp_nombre varchar(255) NOT NULL,
	infp_orden smallint NOT NULL,
	infp_tipo smallint NOT NULL,
	infp_default varchar(500) NOT NULL,
	infp_visible smallint NOT NULL,
	infp_sqlstmt varchar(2000) NOT NULL,
	inf_id int NOT NULL,
	tbl_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_InformeParametro_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_InformeParametro_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE Reporte(
	rpt_id int NOT NULL,
	rpt_nombre varchar(255) NULL,
	rpt_descrip varchar(1000) NOT NULL,
	inf_id int NOT NULL,
	us_id int NULL,
	modificado timestamptz NOT NULL CONSTRAINT DF_Reporte_modificado  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_Reporte_creado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Reporte_activo  DEFAULT (1),
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
CREATE TABLE FacturaCompraOrdenPago(
	fcopg_id int NOT NULL,
	fcopg_importe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraOrdenPago_fcopg_importe  DEFAULT (0),
	fcopg_importeOrigen decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraOrdenPago_fcopg_importeOrigen  DEFAULT (0),
	fcopg_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraOrdenPago_fcopg_cotizacion  DEFAULT (0),
	fc_id int NOT NULL,
	fcd_id int NULL,
	fcp_id int NULL,
	opg_id int NOT NULL,
 CONSTRAINT PK_FacturaCompraOrdenPago PRIMARY KEY  
(
	fcopg_id 
) 
) 
;
/****** Object:  Table FacturaCompraNotaCredito    Script Date: 07/30/2012 17:11:25 ******/

;

;
CREATE TABLE FacturaCompraNotaCredito(
	fcnc_id int NOT NULL,
	fcnc_importe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraNotaCredito_fcnc_importe  DEFAULT (0),
	fc_id_factura int NOT NULL,
	fc_id_notacredito int NOT NULL,
	fcd_id_factura int NULL,
	fcp_id_factura int NULL,
	fcd_id_notacredito int NULL,
	fcp_id_notacredito int NULL,
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
CREATE TABLE ImportacionItem(
	imp_id int NOT NULL,
	impi_id int NOT NULL,
	impi_campoOrigen varchar(255) NOT NULL,
	impi_campoDestino varchar(255) NOT NULL,
	impi_default varchar(255) NOT NULL CONSTRAINT DF_ImportacionItem_impi_default  DEFAULT (''),
	modificado timestamptz NOT NULL CONSTRAINT DF_ImportacionItem_modificado  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_ImportacionItem_creado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE FacturaVentaNotaCredito(
	fvnc_id int NOT NULL,
	fvnc_importe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaNotaCredito_fvnc_importe  DEFAULT (0),
	fv_id_factura int NOT NULL,
	fv_id_notacredito int NOT NULL,
	fvd_id_factura int NULL,
	fvp_id_factura int NULL,
	fvd_id_notacredito int NULL,
	fvp_id_notacredito int NULL,
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
CREATE TABLE FacturaVentaPercepcion(
	fv_id int NOT NULL,
	fvperc_id int NOT NULL,
	fvperc_orden smallint NOT NULL CONSTRAINT DF_FacturaVentaPercepcion_fvperc_orden  DEFAULT (0),
	fvperc_base decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaPercepcion_fvperc_base  DEFAULT (0),
	fvperc_porcentaje decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaPercepcion_fvperc_porcentaje  DEFAULT (0),
	fvperc_importe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaPercepcion_fvperc_importe  DEFAULT (0),
	fvperc_origen decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaPercepcion_fvperc_origen  DEFAULT (0),
	fvperc_descrip varchar(255) NOT NULL CONSTRAINT DF_FacturaVentaPercepcion_fvperc_descrip  DEFAULT (''),
	perc_id int NOT NULL,
	ccos_id int NULL
) 
;

;
/****** Object:  Table HojaRuta    Script Date: 07/30/2012 17:13:37 ******/

;

;

;
CREATE TABLE HojaRuta(
	hr_id int NOT NULL,
	hr_numero int NOT NULL CONSTRAINT DF_HojaRuta_hr_numero  DEFAULT (0),
	hr_nrodoc varchar(50) NOT NULL CONSTRAINT DF_HojaRuta_pv_nrodoc  DEFAULT (''),
	hr_descrip varchar(5000) NOT NULL CONSTRAINT DF_HojaRuta_pv_descrip  DEFAULT (''),
	hr_fecha timestamptz NOT NULL CONSTRAINT DF_HojaRuta_pv_fecha  DEFAULT (getdate()),
	hr_fechaentrega timestamptz NOT NULL CONSTRAINT DF_HojaRuta_pv_fechaentrega  DEFAULT (getdate()),
	hr_neto decimal(18, 6) NOT NULL CONSTRAINT DF_HojaRuta_pv_neto  DEFAULT (0),
	hr_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_HojaRuta_pv_ivari  DEFAULT (0),
	hr_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_HojaRuta_pv_subtotal  DEFAULT (0),
	hr_total decimal(18, 6) NOT NULL CONSTRAINT DF_HojaRuta_pv_total  DEFAULT (0),
	hr_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_HojaRuta_pv_pendiente  DEFAULT (0),
	hr_firmado int NOT NULL CONSTRAINT DF_HojaRuta_pv_firmado  DEFAULT (0),
	hr_recibidoefectivo decimal(18, 6) NOT NULL CONSTRAINT DF_HojaRuta_hr_recibidoefectivo  DEFAULT (0),
	hr_recibidocheque decimal(18, 6) NOT NULL CONSTRAINT DF_HojaRuta_hr_recibidocheque  DEFAULT (0),
	hr_recibidocantcheque smallint NOT NULL CONSTRAINT DF_HojaRuta_hr_recibidocantcheque  DEFAULT (0),
	hr_recibidodescrip varchar(1000) NOT NULL CONSTRAINT DF_HojaRuta_hr_recibidodescrip  DEFAULT (''),
	hr_cumplida smallint NOT NULL CONSTRAINT DF_HojaRuta_hr_cumplida  DEFAULT (0),
	hr_faltante decimal(18, 6) NOT NULL CONSTRAINT DF_HojaRuta_hr_faltante  DEFAULT (0),
	hr_sobrante decimal(18, 6) NOT NULL CONSTRAINT DF_HojaRuta_hr_sobrante  DEFAULT (0),
	hr_porctickets decimal(18, 6) NOT NULL CONSTRAINT DF_HojaRuta_hr_porctickets  DEFAULT (0),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	chof_id int NULL,
	cam_id int NULL,
	cam_id_semi int NULL,
	prs_id int NULL,
	fv_id_faltante int NULL,
	mf_id_sobrante int NULL,
	mf_id_tickets int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_HojaRuta_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_HojaRuta_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL CONSTRAINT DF_HojaRuta_impreso  DEFAULT (0),
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
CREATE TABLE FacturaVentaPago(
	fvp_id int NOT NULL,
	fvp_fecha timestamptz NOT NULL,
	fvp_importe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaPago_fvp_importe  DEFAULT (0),
	fv_id int NOT NULL,
 CONSTRAINT PK_FacturaVentaPago PRIMARY KEY  
(
	fvp_id 
) 
) 
;
/****** Object:  Table FacturaVentaDeuda    Script Date: 07/30/2012 17:12:18 ******/

;

;
CREATE TABLE FacturaVentaDeuda(
	fvd_id int NOT NULL,
	fvd_fecha timestamptz NOT NULL,
	fvd_fecha2 timestamptz NOT NULL CONSTRAINT DF_FacturaVentaDeuda_fvd_fecha2  DEFAULT (getdate()),
	fvd_importe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaDeuda_fvd_importe  DEFAULT (0),
	fvd_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaDeuda_fvd_pendiente  DEFAULT (0),
	fv_id int NOT NULL,
 CONSTRAINT PK_FacturaVentaDeuda PRIMARY KEY  
(
	fvd_id 
) 
) 
;
/****** Object:  Table FacturaVentaCajero    Script Date: 07/30/2012 17:12:11 ******/

;

;
CREATE TABLE FacturaVentaCajero(
	fvcj_id int NOT NULL,
	fv_id int NOT NULL,
	fvcj_ctacte smallint NOT NULL CONSTRAINT DF_FacturaVentaCajero_fvcj_ctacte  DEFAULT (0),
	cj_id int NOT NULL,
 CONSTRAINT PK_FacturaVentaCajero PRIMARY KEY  
(
	fvcj_id 
) 
) 
;
/****** Object:  Table CursoClase    Script Date: 07/30/2012 17:07:47 ******/

;

;
CREATE TABLE CursoClase(
	cur_id int NOT NULL,
	curc_id int NOT NULL,
	curc_fecha timestamptz NOT NULL,
	curc_desde timestamptz NOT NULL CONSTRAINT DF_CursoClase_curc_desde  DEFAULT ('19000101'),
	curc_hasta timestamptz NOT NULL CONSTRAINT DF_CursoClase_curc_hasta  DEFAULT ('19000101'),
	curc_horas timestamptz NOT NULL CONSTRAINT DF_CursoClase_curc_horas  DEFAULT ('19000101'),
	aula_id int NULL,
 CONSTRAINT PK_CursoClase PRIMARY KEY  
(
	curc_id 
) 
) 
;
/****** Object:  Table CursoExamen    Script Date: 07/30/2012 17:07:48 ******/

;

;
CREATE TABLE CursoExamen(
	cur_id int NOT NULL,
	cure_id int NOT NULL,
	cure_fecha timestamptz NOT NULL,
	cure_desde timestamptz NOT NULL CONSTRAINT DF_CursoExamen_cure_desde  DEFAULT ('19000101'),
	cure_hasta timestamptz NOT NULL CONSTRAINT DF_CursoExamen_cure_hasta  DEFAULT ('19000101'),
	cure_horas timestamptz NOT NULL CONSTRAINT DF_CursoExamen_cure_horas  DEFAULT ('19000101'),
	aula_id int NULL,
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
CREATE TABLE Embalaje(
	embl_id int NOT NULL,
	embl_nombre varchar(255) NOT NULL,
	embl_codigo varchar(50) NOT NULL,
	embl_descrip varchar(255) NOT NULL CONSTRAINT DF_Embalaje_embl_descrip  DEFAULT (''),
	embl_capacidad decimal(18, 6) NOT NULL CONSTRAINT DF_Embalaje_embl_capacidad  DEFAULT (0),
	embl_alto decimal(18, 6) NOT NULL CONSTRAINT DF_Embalaje_embl_alto  DEFAULT (0),
	embl_ancho decimal(18, 6) NOT NULL CONSTRAINT DF_Embalaje_embl_ancho  DEFAULT (0),
	embl_largo decimal(18, 6) NOT NULL CONSTRAINT DF_Embalaje_embl_largo  DEFAULT (0),
	embl_tara decimal(18, 6) NOT NULL CONSTRAINT DF_Embalaje_embl_tara  DEFAULT (0),
	un_id int NULL,
	pr_id_stock int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Embalaje_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Embalaje_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Embalaje_activo  DEFAULT (1),
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
CREATE TABLE Usuario(
	us_id int NOT NULL,
	us_nombre varchar(50) NOT NULL,
	us_clave varchar(16) NOT NULL CONSTRAINT DF_Usuario_us_clave  DEFAULT (''),
	us_descrip varchar(255) NOT NULL CONSTRAINT DF_Usuario_us_descrip  DEFAULT (''),
	us_externo smallint NOT NULL CONSTRAINT DF_Usuario_us_externo  DEFAULT (0),
	us_empresaEx smallint NOT NULL CONSTRAINT DF_Usuario_us_empresaEx  DEFAULT (0),
	us_empxdpto smallint NOT NULL CONSTRAINT DF_Usuario_us_empxdpto  DEFAULT (0),
	us_deposito smallint NOT NULL CONSTRAINT DF_Usuario_us_deposito  DEFAULT (0),
	modificado timestamptz NOT NULL CONSTRAINT DF_Usuario_modificado  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_Usuario_creado  DEFAULT (getdate()),
	activo smallint NOT NULL CONSTRAINT DF_Usuario_activo  DEFAULT (1),
	modifico int NOT NULL CONSTRAINT DF_Usuario_us_id_usuario  DEFAULT (1),
	prs_id int NULL,
	suc_id int NULL,
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
CREATE TABLE PickingList(
	pkl_id int NOT NULL,
	pkl_numero int NOT NULL CONSTRAINT DF_PickingList_pkl_numero  DEFAULT (0),
	pkl_nrodoc varchar(50) NOT NULL CONSTRAINT DF_PickingList_pv_nrodoc  DEFAULT (''),
	pkl_descrip varchar(5000) NOT NULL CONSTRAINT DF_PickingList_pv_descrip  DEFAULT (''),
	pkl_fecha timestamptz NOT NULL CONSTRAINT DF_PickingList_pv_fecha  DEFAULT (getdate()),
	pkl_fechaentrega timestamptz NOT NULL CONSTRAINT DF_PickingList_pv_fechaentrega  DEFAULT (getdate()),
	pkl_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PickingList_pv_neto  DEFAULT (0),
	pkl_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PickingList_pv_ivari  DEFAULT (0),
	pkl_subtotal decimal(18, 6) NOT NULL CONSTRAINT DF_PickingList_pv_subtotal  DEFAULT (0),
	pkl_total decimal(18, 6) NOT NULL CONSTRAINT DF_PickingList_pv_total  DEFAULT (0),
	pkl_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PickingList_pv_pendiente  DEFAULT (0),
	pkl_firmado int NOT NULL CONSTRAINT DF_PickingList_pv_firmado  DEFAULT (0),
	pkl_recibidodescrip varchar(1000) NOT NULL CONSTRAINT DF_PickingList_pkl_recibidodescrip  DEFAULT (''),
	pkl_cumplido smallint NOT NULL CONSTRAINT DF_PickingList_pkl_cumplido  DEFAULT (0),
	pkl_fechadesde timestamptz NOT NULL CONSTRAINT DF_PickingList_pkl_fechadesde  DEFAULT (getdate()),
	pkl_fechahasta timestamptz NOT NULL CONSTRAINT DF_PickingList_pkl_fechahasta  DEFAULT (getdate()),
	ven_id varchar(50) NOT NULL CONSTRAINT DF_PickingList_ven_id  DEFAULT (''),
	zon_id varchar(50) NOT NULL CONSTRAINT DF_PickingList_zon_id  DEFAULT (''),
	est_id int NOT NULL,
	suc_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_PickingList_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_PickingList_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL CONSTRAINT DF_PickingList_impreso  DEFAULT (0),
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
CREATE TABLE ProductoSerieKit(
	ppki_id int NOT NULL,
	prsk_id int NOT NULL,
	pr_id int NOT NULL,
	prns_id int NOT NULL,
	prfk_id int NOT NULL,
	stl_id int NULL,
	ppki_id_desarme int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ProductoSerieKit_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ProductoSerieKit_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE OrdenServicioSerie(
	os_id int NOT NULL,
	oss_id int NOT NULL,
	oss_valor varchar(50) NOT NULL,
	prns_id int NOT NULL,
	edi_id int NOT NULL,
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
CREATE TABLE ProductoSerieKitItem(
	prsk_id int NOT NULL,
	prski_id int NOT NULL,
	prski_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_ProductoSerieKitItem_prskiTMP_cantidad  DEFAULT (0),
	prk_id int NOT NULL,
	pr_id int NOT NULL,
	prns_id int NULL,
	stl_id int NULL,
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
CREATE TABLE ParteReparacionItem(
	prp_id int NOT NULL,
	prpi_id int NOT NULL,
	prpi_orden smallint NOT NULL,
	prpi_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionItem_prpi_cantidad  DEFAULT (0),
	prpi_descrip varchar(5000) NOT NULL CONSTRAINT DF_ParteReparacionItem_prpi_descrip  DEFAULT (''),
	prpi_precio decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionItem_prpi_precio  DEFAULT (0),
	prpi_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionItem_prpi_precioUsr  DEFAULT (0),
	prpi_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionItem_prpi_precioLista  DEFAULT (0),
	prpi_descuento varchar(100) NOT NULL CONSTRAINT DF_ParteReparacionItem_prpi_descuento  DEFAULT (''),
	prpi_neto decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionItem_prpi_neto  DEFAULT (0),
	prpi_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionItem_prpi_ivari  DEFAULT (0),
	prpi_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionItem_prpi_ivarni  DEFAULT (0),
	prpi_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionItem_prpi_ivariporc  DEFAULT (0),
	prpi_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionItem_prpi_ivarniporc  DEFAULT (0),
	prpi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionItem_prpi_importe  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
	stl_id int NULL,
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
CREATE TABLE ComunidadInternetVenta(
	cmiv_id int NOT NULL,
	cmiv_ventaid varchar(255) NOT NULL CONSTRAINT DF_ComunidadInternetVenta_cmiv_vantaid  DEFAULT (''),
	cmiv_nick varchar(255) NOT NULL CONSTRAINT DF_ComunidadInternetVenta_cmiv_nick  DEFAULT (''),
	cmiv_nombre varchar(255) NOT NULL CONSTRAINT DF_ComunidadInternetVenta_cmiv_nombre  DEFAULT (''),
	cmiv_apellido varchar(255) NOT NULL CONSTRAINT DF_ComunidadInternetVenta_cmiv_apellido  DEFAULT (''),
	cmiv_articulo varchar(1000) NOT NULL CONSTRAINT DF_ComunidadInternetVenta_cmic_articulo  DEFAULT (''),
	cmiv_articuloId varchar(50) NOT NULL CONSTRAINT DF_ComunidadInternetVenta_cmiv_articuloId  DEFAULT (''),
	cmiv_preciostr varchar(50) NOT NULL,
	cmiv_cantidadstr varchar(50) NOT NULL,
	cmiv_precio decimal(18, 6) NOT NULL CONSTRAINT DF_ComunidadInternetVenta_cmiv_precio  DEFAULT (0),
	cmiv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_ComunidadInternetVenta_cmiv_cantidad  DEFAULT (0),
	cmiv_email varchar(255) NOT NULL CONSTRAINT DF_ComunidadInternetVenta_cmiv_email  DEFAULT (''),
	cmiv_telefono varchar(255) NOT NULL CONSTRAINT DF_ComunidadInternetVenta_cmiv_telefono  DEFAULT (''),
	cmiv_localidad varchar(255) NOT NULL CONSTRAINT DF_ComunidadInternetVenta_cmiv_localidad  DEFAULT (''),
	cmiv_provincia varchar(255) NOT NULL CONSTRAINT DF_ComunidadInternetVenta_cmiv_provincia  DEFAULT (''),
	cmiv_fecha timestamptz NOT NULL CONSTRAINT DF_ComunidadInternetVenta_cmiv_fecha  DEFAULT ('19000101'),
	cmi_id int NOT NULL,
	cli_id int NULL,
	pr_id int NULL,
	pv_id int NULL,
	cmie_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ComunidadInternetVenta_creado  DEFAULT (getdate()),
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
CREATE TABLE ComunidadInternetMailItem(
	cmiei_id int NOT NULL,
	cmiei_valor varchar(5000) NOT NULL,
	cmiei_valorhtml varchar(5000) NOT NULL,
	cmiei_texto varchar(1000) NOT NULL,
	cmiti_id int NOT NULL,
	cmie_id int NOT NULL,
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
CREATE TABLE RemitoDevolucionCompra(
	rcdc_id int NOT NULL,
	rcdc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoDevolucionCompra_rvrd_cantidad  DEFAULT (0),
	rci_id_remito int NOT NULL,
	rci_id_devolucion int NOT NULL,
 CONSTRAINT PK_RemitoDevolucionCompra PRIMARY KEY  
(
	rcdc_id 
) 
) 
;
/****** Object:  Table OrdenRemitoCompra    Script Date: 07/30/2012 17:18:50 ******/

;

;
CREATE TABLE OrdenRemitoCompra(
	ocrc_id int NOT NULL,
	ocrc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenRemitoCompra_ocrc_cantidad  DEFAULT (0),
	oci_id int NOT NULL,
	rci_id int NOT NULL,
 CONSTRAINT PK_OrdenRemitoCompra PRIMARY KEY  
(
	ocrc_id 
) 
) 
;
/****** Object:  Table RemitoFacturaCompra    Script Date: 07/30/2012 17:28:17 ******/

;

;
CREATE TABLE RemitoFacturaCompra(
	rcfc_id int NOT NULL,
	rcfc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoFacturaCompra_rcfc_cantidad  DEFAULT (0),
	rci_id int NOT NULL,
	fci_id int NOT NULL,
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
CREATE TABLE PedidoVentaItemTMP(
	pvTMP_id int NOT NULL,
	pviTMP_id int NOT NULL,
	pvi_id int NOT NULL,
	pvi_orden smallint NOT NULL,
	pvi_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItemTMP_pvi_cantidad  DEFAULT (0),
	pvi_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItemTMP_pvi_cantidadaremitir  DEFAULT (0),
	pvi_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItemTMP_pvi_pendiente  DEFAULT (0),
	pvi_pendientepklst decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItemTMP_pvi_pendientepklst  DEFAULT (0),
	pvi_pendienteprv decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItemTMP_pvi_pendienteprv  DEFAULT (0),
	pvi_descrip varchar(5000) NOT NULL CONSTRAINT DF_PedidoVentaItemTMP_pvi_descrip  DEFAULT (''),
	pvi_precio decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItemTMP_pvi_precio  DEFAULT (0),
	pvi_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItemTMP_pvi_precioUsr  DEFAULT (0),
	pvi_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItemTMP_pvi_precioLista  DEFAULT (0),
	pvi_descuento varchar(100) NOT NULL CONSTRAINT DF_PedidoVentaItemTMP_pvi_descuento  DEFAULT (''),
	pvi_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItemTMP_pv_neto  DEFAULT (0),
	pvi_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItemTMP_pvi_ivari  DEFAULT (0),
	pvi_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItemTMP_pvi_ivarni  DEFAULT (0),
	pvi_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItemTMP_pvi_ivariporc  DEFAULT (0),
	pvi_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItemTMP_pvi_ivarniporc  DEFAULT (0),
	pvi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoVentaItemTMP_pvi_importe  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE PedidoVentaItemBorradoTMP(
	pvTMP_id int NOT NULL,
	pvibTMP_id int NOT NULL,
	pv_id int NOT NULL,
	pvi_id int NOT NULL,
 CONSTRAINT PK_PedidoVentaItemBorradoTMP PRIMARY KEY  
(
	pvibTMP_id 
) 
) 
;
/****** Object:  Table Hoja    Script Date: 07/30/2012 17:13:30 ******/

;

;
CREATE TABLE Hoja(
	hoja_id int NOT NULL,
	id int NOT NULL,
	modificado timestamptz NOT NULL CONSTRAINT DF_Hoja_modificado  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_Hoja_creado  DEFAULT (getdate()),
	modifico int NOT NULL,
	ram_id int NOT NULL,
	arb_id int NOT NULL,
 CONSTRAINT PK_Hoja PRIMARY KEY  
(
	hoja_id ,
	ram_id 
) 
) 
;
/****** Object:  Table Rama    Script Date: 07/30/2012 17:27:19 ******/

;

;

;
CREATE TABLE Rama(
	arb_id int NOT NULL,
	ram_id int NOT NULL,
	ram_nombre varchar(255) NOT NULL,
	ram_id_padre int NOT NULL CONSTRAINT DF_Rama_ram_id_Padre  DEFAULT (0),
	ram_orden smallint NOT NULL CONSTRAINT DF_Rama_ram_orden  DEFAULT (0),
	modificado timestamptz NOT NULL CONSTRAINT DF_Rama_modificado  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_Rama_creado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE PosicionArancel(
	poar_id int NOT NULL,
	poar_nombre varchar(255) NOT NULL,
	poar_codigo varchar(15) NOT NULL,
	poar_descrip varchar(255) NOT NULL CONSTRAINT DF_PosicionArancel_poar_descrip  DEFAULT (''),
	ti_id_estadistica int NOT NULL,
	ti_id_derechos int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_PosicionArancel_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_PosicionArancel_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_PosicionArancel_activo  DEFAULT (1),
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
CREATE TABLE PresupuestoCompraItem(
	prc_id int NOT NULL,
	prci_id int NOT NULL,
	prci_orden smallint NOT NULL,
	prci_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItem_prci_cantidad  DEFAULT (0),
	prci_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItem_prci_cantidadaremitir  DEFAULT (0),
	prci_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItem_prci_pendiente  DEFAULT (0),
	prci_descrip varchar(5000) NOT NULL CONSTRAINT DF_PresupuestoCompraItem_prci_descrip  DEFAULT (''),
	prci_precio decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItem_prci_precio  DEFAULT (0),
	prci_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItem_prci_precioUsr  DEFAULT (0),
	prci_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItem_prci_precioLista  DEFAULT (0),
	prci_descuento varchar(100) NOT NULL CONSTRAINT DF_PresupuestoCompraItem_prci_descuento  DEFAULT (''),
	prci_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItem_prc_neto  DEFAULT (0),
	prci_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItem_prci_ivari  DEFAULT (0),
	prci_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItem_prci_ivarni  DEFAULT (0),
	prci_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItem_prci_ivariporc  DEFAULT (0),
	prci_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItem_prci_ivarniporc  DEFAULT (0),
	prci_importe decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItem_prci_importe  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE Percepcion(
	perct_id int NOT NULL,
	perc_id int NOT NULL,
	perc_nombre varchar(100) NOT NULL CONSTRAINT DF_Percepciones_perc_nombre  DEFAULT (''),
	perc_codigo varchar(15) NOT NULL CONSTRAINT DF_Percepciones_perc_alias  DEFAULT (''),
	perc_importeminimo decimal(18, 6) NOT NULL CONSTRAINT DF_Percepcion_perc_importeminimo  DEFAULT (0),
	perc_regimensicore varchar(50) NOT NULL CONSTRAINT DF_Percepcion_perc_regimensicore  DEFAULT (''),
	perc_descrip varchar(255) NOT NULL CONSTRAINT DF_Percepcion_perc_descrip  DEFAULT (''),
	perc_esiibb smallint NOT NULL CONSTRAINT DF_Percepcion_perc_esiibb  DEFAULT (0),
	ta_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Percepciones_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Percepciones_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Percepcion_activo  DEFAULT (0),
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
CREATE TABLE webArticuloUsuario(
	wartus_id int NOT NULL,
	us_id int NOT NULL,
	wart_id int NOT NULL,
 CONSTRAINT PK_webArticuloUsuario PRIMARY KEY  
(
	wartus_id 
) 
) 
;
/****** Object:  Table CotizacionPresupuestoCompra    Script Date: 07/30/2012 17:07:30 ******/

;

;
CREATE TABLE CotizacionPresupuestoCompra(
	cotprc_id int NOT NULL,
	cotprc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionPresupuestoCompra_cotprc_cantidad  DEFAULT (0),
	coti_id int NOT NULL,
	prci_id int NOT NULL,
 CONSTRAINT PK_CotizacionPresupuestoCompra PRIMARY KEY  
(
	cotprc_id 
) 
) 
;
/****** Object:  Table PresupuestoDevolucionCompra    Script Date: 07/30/2012 17:23:50 ******/

;

;
CREATE TABLE PresupuestoDevolucionCompra(
	prcdc_id int NOT NULL,
	prcdc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoDevolucionCompra_prvdv_cantidad  DEFAULT (0),
	prci_id_Presupuesto int NOT NULL,
	prci_id_devolucion int NOT NULL,
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
CREATE TABLE PresupuestoCompraItemTMP(
	prcTMP_id int NOT NULL,
	prciTMP_id int NOT NULL,
	prci_id int NOT NULL,
	prci_orden smallint NOT NULL,
	prci_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItemTMP_prci_cantidad  DEFAULT (0),
	prci_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItemTMP_prci_cantidadaremitir  DEFAULT (0),
	prci_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItemTMP_prci_pendiente  DEFAULT (0),
	prci_descrip varchar(5000) NOT NULL CONSTRAINT DF_PresupuestoCompraItemTMP_prci_descrip  DEFAULT (''),
	prci_precio decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItemTMP_prci_precio  DEFAULT (0),
	prci_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItemTMP_prci_precioUsr  DEFAULT (0),
	prci_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItemTMP_prci_precioLista  DEFAULT (0),
	prci_descuento varchar(100) NOT NULL CONSTRAINT DF_PresupuestoCompraItemTMP_prci_descuento  DEFAULT (''),
	prci_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItemTMP_prc_neto  DEFAULT (0),
	prci_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItemTMP_prci_ivari  DEFAULT (0),
	prci_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItemTMP_prci_ivarni  DEFAULT (0),
	prci_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItemTMP_prci_ivariporc  DEFAULT (0),
	prci_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItemTMP_prci_ivarniporc  DEFAULT (0),
	prci_importe decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoCompraItemTMP_prci_importe  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE PresupuestoCompraItemBorradoTMP(
	prcTMP_id int NOT NULL,
	prcibTMP_id int NOT NULL,
	prc_id int NOT NULL,
	prci_id int NOT NULL,
 CONSTRAINT PK_PresupuestoCompraItemBorradoTMP PRIMARY KEY  
(
	prcibTMP_id 
) 
) 
;
/****** Object:  Table PresupuestoDevolucionCompraTMP    Script Date: 07/30/2012 17:23:51 ******/

;

;
CREATE TABLE PresupuestoDevolucionCompraTMP(
	prcTMP_id int NOT NULL,
	prcdcTMP_id int NOT NULL,
	prcdc_id int NOT NULL,
	prcdc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoDevolucionCompraTMP_prvdv_cantidad  DEFAULT (0),
	prci_id_Presupuesto int NOT NULL,
	prci_id_devolucion int NOT NULL,
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
CREATE TABLE ComunidadInternetProducto(
	cmi_id int NOT NULL,
	cmipr_id int NOT NULL,
	cmipr_codigo varchar(255) NOT NULL CONSTRAINT DF_ComunidadInternetProducto_cmipr_codigo  DEFAULT (''),
	cmipr_nombre varchar(1000) NOT NULL CONSTRAINT DF_ComunidadInternetProducto_cmipr_nombre  DEFAULT (''),
	cmipr_disponible varchar(50) NOT NULL CONSTRAINT DF_ComunidadInternetProducto_cmipr_disponible  DEFAULT (''),
	cmipr_finaliza varchar(50) NOT NULL CONSTRAINT DF_ComunidadInternetProducto_cmipr_finaliza  DEFAULT (''),
	cmipr_ofertas varchar(50) NOT NULL CONSTRAINT DF_ComunidadInternetProducto_cmipr_ofertas  DEFAULT (''),
	cmipr_visitas varchar(50) NOT NULL CONSTRAINT DF_ComunidadInternetProducto_cmipr_visitas  DEFAULT (''),
	cmipr_ventas varchar(50) NOT NULL CONSTRAINT DF_ComunidadInternetProducto_cmipr_ventas  DEFAULT (''),
	cmipr_reposicion decimal(18, 6) NOT NULL CONSTRAINT DF_ComunidadInternetProducto_cmipr_reposicion  DEFAULT (0),
	pr_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF__Comunidad__cread__4D647345  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF__Comunidad__modif__4E58977E  DEFAULT (getdate()),
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
CREATE TABLE ProductoComunidadInternet(
	pr_id int NOT NULL,
	cmi_id int NOT NULL,
	prcmi_id int NOT NULL,
	prcmi_codigo varchar(255) NOT NULL,
	prcmi_descrip varchar(1000) NOT NULL CONSTRAINT DF_ProductoComunidadInternet_prcmi_descrip  DEFAULT (''),
	prcmi_fechaalta timestamptz NOT NULL CONSTRAINT DF_ProductoComunidadInternet_prcmi_fechaalta  DEFAULT ('19000101'),
	prcmi_fechavto timestamptz NOT NULL CONSTRAINT DF_ProductoComunidadInternet_prcmi_fechavto  DEFAULT ('19000101'),
	prcmi_precio decimal(18, 6) NOT NULL CONSTRAINT DF_ProductoComunidadInternet_prcmi_precio  DEFAULT (0),
	creado timestamptz NOT NULL CONSTRAINT DF_ProductoComunidadInternet_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ProductoComunidadInternet_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE ComunidadInternetCobro(
	cmic_id int NOT NULL,
	cmic_cobroid varchar(50) NOT NULL CONSTRAINT DF_ComunidadInternetCobro_cmic_cobroid  DEFAULT (''),
	cmic_nick varchar(255) NOT NULL CONSTRAINT DF_ComunidadInternetCobro_cmic_nick  DEFAULT (''),
	cmic_articulo varchar(1000) NOT NULL CONSTRAINT DF_ComunidadInternetCobro_cmic_articulo  DEFAULT (''),
	cmic_articuloid varchar(255) NOT NULL CONSTRAINT DF_ComunidadInternetCobro_cmic_codigoarticulo  DEFAULT (''),
	cmic_estado varchar(255) NOT NULL CONSTRAINT DF_ComunidadInternetCobro_cmic_estado  DEFAULT (''),
	cmic_cobrado varchar(50) NOT NULL CONSTRAINT DF_ComunidadInternetCobro_cmic_cobrado  DEFAULT (''),
	cmic_fechastr varchar(50) NOT NULL CONSTRAINT DF_ComunidadInternetCobro_cmic_fechastr  DEFAULT (''),
	cmic_fecha timestamptz NOT NULL CONSTRAINT DF_ComunidadInternetCobro_cmic_fecha  DEFAULT ('19000101'),
	cmic_descrip varchar(5000) NOT NULL CONSTRAINT DF_ComunidadInternetCobro_cmic_descrip  DEFAULT (''),
	cmi_id int NOT NULL,
	cli_id int NULL,
	pr_id int NULL,
	pv_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ComunidadInternetCobro_creado  DEFAULT (getdate()),
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
CREATE TABLE ComunidadInternetAplicacion(
	cmia_id int NOT NULL,
	cmia_nombre varchar(255) NOT NULL,
	cmia_codigo varchar(50) NOT NULL,
	cmia_activexobject varchar(255) NOT NULL,
	cmia_descrip varchar(5000) NOT NULL CONSTRAINT DF_ComunidadInternetAplicacion_cmia_descrip  DEFAULT (''),
	cmi_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ComunidadInternetAplicacion_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ComunidadInternetAplicacion_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_ComunidadInternetAplicacion_activo  DEFAULT (1),
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
CREATE TABLE LiquidacionPlantillaItem(
	liqp_id int NOT NULL,
	liqpi_id int NOT NULL,
	em_id int NOT NULL,
	liqf_id int NOT NULL,
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
CREATE TABLE Embarque(
	emb_id int NOT NULL,
	emb_nombre varchar(255) NOT NULL,
	emb_codigo varchar(270) NOT NULL,
	emb_descrip varchar(1000) NOT NULL CONSTRAINT DF_Embarque_embq_descrip  DEFAULT (''),
	emb_fecha timestamptz NOT NULL,
	barc_id int NOT NULL,
	pue_id_origen int NOT NULL,
	pue_id_destino int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Embarque_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Embarque_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Embarque_activo  DEFAULT (1),
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
CREATE TABLE TarifaItem(
	trfi_id int NOT NULL,
	trfi_minimo int NOT NULL,
	trfi_menos45 decimal(18, 6) NOT NULL CONSTRAINT DF_TarifaItem_trfi_menos45  DEFAULT (0),
	trfi_mas45 decimal(18, 6) NOT NULL CONSTRAINT DF_TarifaItem_trfi_mas45  DEFAULT (0),
	trfi_mas100 decimal(18, 6) NOT NULL CONSTRAINT DF_TarifaItem_trfi_mas100  DEFAULT (0),
	trfi_mas300 decimal(18, 6) NOT NULL CONSTRAINT DF_TarifaItem_trfi_mas300  DEFAULT (0),
	trfi_mas500 decimal(18, 6) NOT NULL CONSTRAINT DF_TarifaItem_trfi_mas500  DEFAULT (0),
	trfi_mas1000 decimal(18, 6) NOT NULL CONSTRAINT DF_TarifaItem_trfi_mas1000  DEFAULT (0),
	trfi_lunes smallint NOT NULL CONSTRAINT DF_TarifaItem_trfi_lunes  DEFAULT (0),
	trfi_martes smallint NOT NULL CONSTRAINT DF_TarifaItem_trfi_lunes1  DEFAULT (0),
	trfi_miercoles smallint NOT NULL CONSTRAINT DF_TarifaItem_trfi_lunes2  DEFAULT (0),
	trfi_jueves smallint NOT NULL CONSTRAINT DF_TarifaItem_trfi_lunes3  DEFAULT (0),
	trfi_viernes smallint NOT NULL CONSTRAINT DF_TarifaItem_trfi_lunes4  DEFAULT (0),
	trfi_sabado smallint NOT NULL CONSTRAINT DF_TarifaItem_trfi_lunes21  DEFAULT (0),
	trfi_domingo smallint NOT NULL CONSTRAINT DF_TarifaItem_trfi_lunes31  DEFAULT (0),
	pue_id_destino int NOT NULL,
	pue_id_origen int NOT NULL,
	trf_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_TarifaItem_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_TarifaItem_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_TarifaItem_activo  DEFAULT (1),
 CONSTRAINT PK_TarifaItem PRIMARY KEY  
(
	trfi_id 
) 
) 
;
/****** Object:  Table FeriadoItem    Script Date: 07/30/2012 17:13:04 ******/

;

;
CREATE TABLE FeriadoItem(
	fe_id int NOT NULL,
	fei_id int NOT NULL,
	fei_fecha timestamptz NOT NULL,
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
CREATE TABLE OrdenServicioItemSerieTMP(
	osTMP_id int NOT NULL,
	osiTMP_id int NOT NULL,
	osi_id int NOT NULL CONSTRAINT DF_OrdenServicioItemSerieTMP_osi_id  DEFAULT (0),
	osisTMP_id int NOT NULL,
	osis_orden smallint NOT NULL CONSTRAINT DF_OrdenServicioItemSerieTMP_osis_orden  DEFAULT (0),
	prns_codigo varchar(100) NOT NULL CONSTRAINT DF_OrdenServicioItemSerieTMP_prns_codigo  DEFAULT (''),
	prns_codigo2 varchar(100) NOT NULL CONSTRAINT DF_OrdenServicioItemSerieTMP_prns_codigo2  DEFAULT (''),
	prns_codigo3 varchar(100) NOT NULL CONSTRAINT DF_OrdenServicioItemSerieTMP_prns_codigo1  DEFAULT (''),
	prns_descrip varchar(255) NOT NULL CONSTRAINT DF_OrdenServicioItemSerieTMP_prns_descrip  DEFAULT (''),
	prns_fechavto timestamptz NOT NULL CONSTRAINT DF_OrdenServicioItemSerieTMP_prns_fechavto  DEFAULT (getdate()),
	pr_id int NOT NULL,
	prns_id int NOT NULL CONSTRAINT DF_OrdenServicioItemSerieTMP_prns_id  DEFAULT (0),
	stl_codigo varchar(50) NOT NULL CONSTRAINT DF_OrdenServicioItemSerieTMP_stl_codigo  DEFAULT (''),
	stl_id int NULL,
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
CREATE TABLE RemitoVentaItem(
	rv_id int NOT NULL,
	rvi_id int NOT NULL,
	rvi_orden smallint NOT NULL,
	rvi_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItem_pvi_cantidad  DEFAULT (0),
	rvi_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItem_pvi_cantidadaremitir  DEFAULT (0),
	rvi_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItem_pvi_pendiente  DEFAULT (0),
	rvi_pendientefac decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItem_rvi_pendientefac  DEFAULT (0),
	rvi_descrip varchar(5000) NOT NULL CONSTRAINT DF_RemitoVentaItem_pvi_descrip  DEFAULT (''),
	rvi_precio decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItem_pvi_precio  DEFAULT (0),
	rvi_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItem_pvi_precioUsr  DEFAULT (0),
	rvi_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItem_pvi_precioLista  DEFAULT (0),
	rvi_descuento varchar(100) NOT NULL CONSTRAINT DF_RemitoVentaItem_pvi_descuento  DEFAULT (''),
	rvi_neto decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItem_pvi_neto  DEFAULT (0),
	rvi_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItem_pvi_ivari  DEFAULT (0),
	rvi_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItem_pvi_ivarni  DEFAULT (0),
	rvi_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItem_pvi_ivariporc  DEFAULT (0),
	rvi_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItem_pvi_ivarniporc  DEFAULT (0),
	rvi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoVentaItem_pvi_importe  DEFAULT (0),
	rvi_importCodigo varchar(255) NOT NULL CONSTRAINT DF__RemitoVen__rvi_i__0A3085F5  DEFAULT (''),
	pr_id int NOT NULL,
	ccos_id int NULL,
	stl_id int NULL,
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
CREATE TABLE ImportacionTempGarantia(
	impt_id int NOT NULL,
	imptg_id int NOT NULL,
	imptg_orden smallint NOT NULL,
	gar_id int NOT NULL,
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
CREATE TABLE EquipoDetalleItem(
	ed_id int NOT NULL,
	edi_id int NOT NULL,
	edi_nombre varchar(255) NOT NULL,
	edi_orden smallint NOT NULL,
	edi_tipo smallint NOT NULL,
	edi_sqlstmt varchar(2000) NOT NULL,
	edi_default varchar(255) NOT NULL CONSTRAINT DF_EquipoDetalleItem_edi_default  DEFAULT (''),
	tbl_id int NULL,
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
CREATE TABLE AuditoriaItem(
	aud_id int NOT NULL,
	audi_id int NOT NULL,
	audi_descrip varchar(5000) NOT NULL CONSTRAINT DF_AuditoriaItem_audi_descrip  DEFAULT (''),
	audn_id int NOT NULL,
	audg_id int NULL,
	doct_id int NULL,
	comp_id int NULL,
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
CREATE TABLE webArticulo(
	wart_id int NOT NULL,
	wartt_id int NOT NULL,
	warte_id int NOT NULL,
	wart_titulo varchar(100) NOT NULL CONSTRAINT DF_webArticulo_wart_titulo  DEFAULT (''),
	wart_copete varchar(5000) NOT NULL CONSTRAINT DF_webArticulo_wart_copete  DEFAULT (''),
	wart_texto text NOT NULL,
	wart_fecha timestamptz NOT NULL CONSTRAINT DF_webArticulo_wart_fecha  DEFAULT (getdate()),
	wart_fechavto timestamptz NOT NULL CONSTRAINT DF_webArticulo_wart_fechavto  DEFAULT (getdate()),
	wart_origen varchar(1000) NOT NULL CONSTRAINT DF_webArticulo_wart_origen  DEFAULT (''),
	wart_origenurl varchar(1000) NOT NULL CONSTRAINT DF_webArticulo_wart_origenurl  DEFAULT (''),
	wart_imagen varchar(1000) NOT NULL CONSTRAINT DF_webArticulo_wart_imagen  DEFAULT (''),
	us_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_webArticulo_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_webArticulo_modificado  DEFAULT (getdate()),
	activo smallint NOT NULL CONSTRAINT DF_webArticulo_activo  DEFAULT (1),
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
CREATE TABLE SindicatoConvenioCategoria(
	sindcc_id int NOT NULL,
	sindcc_importe decimal(18, 6) NOT NULL,
	sindcc_tipo smallint NOT NULL,
	sindcc_horaXmes smallint NOT NULL CONSTRAINT DF_SindicatoConvenioCategoria_sindcc_horaXmes  DEFAULT (0),
	sindcc_diaXmes smallint NOT NULL CONSTRAINT DF_SindicatoConvenioCategoria_sindcc_diaXmes  DEFAULT (0),
	sindcc_desde timestamptz NOT NULL CONSTRAINT DF_SindicatoConvenioCategoria_sindcc_desde1  DEFAULT ('19000101'),
	sindcc_hasta timestamptz NOT NULL CONSTRAINT DF_SindicatoConvenioCategoria_sindcc_desde  DEFAULT ('19000101'),
	sind_id int NOT NULL,
	sindco_id int NOT NULL,
	sindca_id int NOT NULL,
 CONSTRAINT PK_SindicatoConvenioCategoria PRIMARY KEY  
(
	sindcc_id 
) 
) 
;
/****** Object:  Table ProyectoPrecio    Script Date: 07/30/2012 17:27:13 ******/

;

;
CREATE TABLE ProyectoPrecio(
	proy_id int NOT NULL,
	proyp_id int NOT NULL,
	proyp_precio decimal(18, 6) NOT NULL CONSTRAINT DF_ProyectoPrecio_proyp_importe  DEFAULT (0),
	us_id int NOT NULL,
	pr_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ProyectoPrecio_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ProyectoPrecio_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE Objetivo(
	obje_id int NOT NULL,
	obje_nombre varchar(100) NOT NULL,
	obje_codigo varchar(15) NOT NULL,
	obje_descrip varchar(255) NOT NULL CONSTRAINT DF_Objetivo_obje_descrip  DEFAULT (''),
	proy_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Objetivo_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Objetivo_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Objetivo_activo  DEFAULT (1),
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
CREATE TABLE ProyectoItem(
	proyi_id int NOT NULL,
	proyi_nombre varchar(100) NOT NULL,
	proyi_codigo varchar(15) NOT NULL,
	proyi_descrip varchar(255) NOT NULL CONSTRAINT DF_ProyectoItem_proyi_descrip  DEFAULT (''),
	proy_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ProyectoItem_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ProyectoItem_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_ProyectoItem_activo  DEFAULT (1),
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
CREATE TABLE LiquidacionFormulaItem(
	liqf_id int NOT NULL,
	liqfi_id int NOT NULL,
	liqfi_nombre varchar(100) NOT NULL,
	liqfi_codigo varchar(15) NOT NULL,
	liqfi_descrip varchar(1000) NOT NULL CONSTRAINT DF_LiquidacionFormulaItem_liqfi_descrip  DEFAULT (''),
	liqfi_nombrerecibo varchar(100) NOT NULL CONSTRAINT DF_LiquidacionFormulaItem_liqfi_nombrerecibo  DEFAULT (''),
	liqfi_formula varchar(5000) NOT NULL CONSTRAINT DF_LiquidacionFormulaItem_liqfi_formula  DEFAULT (''),
	liqct_id int NOT NULL,
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
CREATE TABLE CatalogoWebCategoriaItem(
	catwc_id int NOT NULL,
	catwci_id int NOT NULL,
	catwci_posicion smallint NOT NULL CONSTRAINT DF_CatalogoWebCategoriaItem_catwci_posicion  DEFAULT (0),
	catwci_activo smallint NOT NULL CONSTRAINT DF_CatalogoWebCategoriaItem_catwci_activo  DEFAULT (1),
	pr_id int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_CatalogoWebCategoriaItem_activo  DEFAULT (1),
	creado timestamptz NOT NULL CONSTRAINT DF_CatalogoWebCategoriaItem_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_CatalogoWebCategoriaItem_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE StockItemTMP(
	stTMP_id int NOT NULL,
	stiTMP_id int NOT NULL,
	sti_id int NOT NULL,
	sti_orden int NOT NULL CONSTRAINT DF_StockItemTMP_sti_orden  DEFAULT (0),
	sti_ingreso decimal(18, 6) NOT NULL CONSTRAINT DF_StockItemTMP_sti_ingreso  DEFAULT (0),
	sti_salida decimal(18, 6) NOT NULL CONSTRAINT DF_StockItemTMP_sti_salida  DEFAULT (0),
	sti_descrip varchar(255) NOT NULL CONSTRAINT DF_StockItemTMP_sti_descrip  DEFAULT (''),
	sti_grupo int NOT NULL CONSTRAINT DF_StockItemTMP_sti_grupo  DEFAULT (0),
	pr_id int NOT NULL,
	depl_id int NOT NULL,
	prns_descrip varchar(255) NOT NULL CONSTRAINT DF_StockItemTMP_prns_descrip  DEFAULT (''),
	prns_fechavto timestamptz NOT NULL CONSTRAINT DF_StockItemTMP_prns_fechavto  DEFAULT (getdate()),
	prns_id int NULL,
	pr_id_kit int NULL,
	stik_orden int NOT NULL CONSTRAINT DF_StockItemTMP_stik_orden  DEFAULT (0),
	stik_cantidad int NOT NULL CONSTRAINT DF_StockItemTMP_stik_cantidad  DEFAULT (0),
	stl_id int NULL,
 CONSTRAINT PK_StockItemTMP PRIMARY KEY  
(
	stiTMP_id 
) 
) 
;

;
--, @value=N'' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'StockItemTMP', @level2type=N'COLUMN',@level2name=N'sti_descrip'
;
/****** Object:  Table CatalogoWebProductoImage    Script Date: 07/30/2012 17:04:27 ******/

;

;
CREATE TABLE CatalogoWebProductoImage(
	catw_id int NOT NULL,
	prwi_id int NOT NULL,
 CONSTRAINT PK_CatalogoWebProductoImage PRIMARY KEY  
(
	catw_id ,
	prwi_id 
) 
) 
;
/****** Object:  Table CatalogoWebProductoImageLink    Script Date: 07/30/2012 17:04:28 ******/

;

;
CREATE TABLE CatalogoWebProductoImageLink(
	catw_id int NOT NULL,
	prwi_id int NOT NULL,
 CONSTRAINT PK_CatalogoWebProductoImageLink PRIMARY KEY  
(
	catw_id ,
	prwi_id 
) 
) 
;
/****** Object:  Table ProveedorCentroCosto    Script Date: 07/30/2012 17:26:52 ******/

;

;
CREATE TABLE ProveedorCentroCosto(
	provccos_id int NOT NULL,
	prov_id int NOT NULL,
	ccos_id int NOT NULL,
	pr_id int NULL,
 CONSTRAINT PK_ProveedorCentroCosto PRIMARY KEY  
(
	provccos_id 
) 
) 
;
/****** Object:  Table ProveedorRetencion    Script Date: 07/30/2012 17:26:56 ******/

;

;
CREATE TABLE ProveedorRetencion(
	prov_id int NOT NULL,
	provret_id int NOT NULL,
	ret_id int NOT NULL,
	provret_desde timestamptz NOT NULL CONSTRAINT DF_ProveedorRetencion_provret_desde  DEFAULT ('19000101'),
	provret_hasta timestamptz NOT NULL CONSTRAINT DF_ProveedorRetencion_provret_hasta  DEFAULT ('21000101'),
	creado timestamptz NOT NULL CONSTRAINT DF_ProveedorPercepcion_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ProveedorPercepcion_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	provret_generadoporproceso smallint NOT NULL DEFAULT (0),
 CONSTRAINT PK_ProveedorRetencion PRIMARY KEY  
(
	provret_id 
) 
) 
;
/****** Object:  Table ListaPrecioProveedor    Script Date: 07/30/2012 17:16:24 ******/

;

;
CREATE TABLE ListaPrecioProveedor(
	lpprov_id int NOT NULL,
	lp_id int NOT NULL,
	prov_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ListaPrecioProveedor_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ListaPrecioProveedor_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE ProveedorCAI(
	provc_id int NOT NULL,
	provc_numero varchar(255) NOT NULL,
	provc_descrip varchar(255) NOT NULL CONSTRAINT DF_ProveedorCAI_provc_descrip  DEFAULT (''),
	provc_fechavto timestamptz NOT NULL,
	prov_id int NOT NULL,
	provc_sucursal varchar(255) NOT NULL CONSTRAINT DF_ProveedorCAI_provc_sucursal  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_ProveedorCAI_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ProveedorCAI_modificado  DEFAULT (getdate()),
	modifico int NOT NULL CONSTRAINT DF_ProveedorCAI_modifico  DEFAULT (0),
	activo smallint NOT NULL CONSTRAINT DF_ProveedorCAI_activo  DEFAULT (1),
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
CREATE TABLE UsuarioEmpresa(
	usemp_id int NOT NULL,
	us_id int NOT NULL,
	prov_id int NULL,
	cli_id int NULL,
	modificado timestamptz NOT NULL CONSTRAINT DF_UsuarioEmpresa_modificado  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_UsuarioEmpresa_creado  DEFAULT (getdate()),
	activo smallint NOT NULL CONSTRAINT DF_UsuarioEmpresa_activo  DEFAULT (1),
	modifico int NOT NULL CONSTRAINT DF_UsuarioEmpresa_modifico  DEFAULT (1),
 CONSTRAINT PK_UsuarioEmpresa PRIMARY KEY  
(
	usemp_id 
) 
) 
;
/****** Object:  Table DepartamentoProveedor    Script Date: 07/30/2012 17:07:59 ******/

;

;
CREATE TABLE DepartamentoProveedor(
	dptoprov_id int NOT NULL,
	prov_id int NOT NULL,
	dpto_id int NOT NULL,
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
CREATE TABLE ProductoProveedor(
	prprov_id int NOT NULL,
	prprov_fabricante smallint NOT NULL CONSTRAINT DF__productop__prpro__12BC75AC  DEFAULT (0),
	prprov_nombre varchar(255) NOT NULL CONSTRAINT DF_ProductoProveedor_prprov_nombre  DEFAULT (''),
	prprov_codigo varchar(50) NOT NULL CONSTRAINT DF_ProductoProveedor_prprov_codigo  DEFAULT (''),
	prprov_codigobarra varchar(255) NOT NULL CONSTRAINT DF_ProductoProveedor_prprov_codigobarra  DEFAULT (''),
	pr_id int NOT NULL,
	prov_id int NOT NULL,
	pa_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ProductoProveedor_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ProductoProveedor_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_ProductoProveedor_activo  DEFAULT (1),
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
CREATE TABLE StockItemKit(
	stik_id int NOT NULL,
	stik_cantidad int NOT NULL CONSTRAINT DF_StockItemKit_stik_cantidad  DEFAULT (0),
	stik_llevanroserie smallint NOT NULL CONSTRAINT DF_StockItemKit_stik_llevanroserie  DEFAULT (0),
	pr_id int NOT NULL,
	st_id int NOT NULL,
 CONSTRAINT PK_StockItemKit PRIMARY KEY  
(
	stik_id 
) 
) 
;
/****** Object:  Table RetencionItem    Script Date: 07/30/2012 17:29:30 ******/

;

;
CREATE TABLE RetencionItem(
	ret_id int NOT NULL,
	reti_id int NOT NULL,
	reti_importedesde decimal(18, 6) NOT NULL,
	reti_importehasta decimal(18, 6) NOT NULL,
	reti_porcentaje decimal(18, 6) NOT NULL,
	reti_importefijo decimal(18, 6) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_RetencionItem_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_RetencionItem_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
 CONSTRAINT PK_RetencionItem PRIMARY KEY  
(
	reti_id 
) 
) 
;
/****** Object:  Table ListaPrecioItem    Script Date: 07/30/2012 17:16:16 ******/

;

;
CREATE TABLE ListaPrecioItem(
	lp_id int NOT NULL,
	lpi_id int NOT NULL,
	lpi_precio decimal(18, 6) NOT NULL CONSTRAINT DF_ListaPrecioItem_lpi_precio  DEFAULT (0),
	lpi_porcentaje decimal(18, 6) NOT NULL CONSTRAINT DF_ListaPrecioItem_lpi_porcentaje  DEFAULT (0),
	lpi_fecha timestamptz NOT NULL CONSTRAINT DF_ListaPrecioItem_lpi_fecha  DEFAULT ('19000101'),
	lpi_preciolista decimal(18, 6) NOT NULL CONSTRAINT DF_ListaPrecioItem_lpi_preciolista  DEFAULT (0),
	lpi_fechalista timestamptz NOT NULL CONSTRAINT DF_ListaPrecioItem_lpi_fechalista  DEFAULT ('19000101'),
	lpi_precioh1 decimal(18, 6) NOT NULL CONSTRAINT DF_ListaPrecioItem_lpi_precioh1  DEFAULT (0),
	lpi_fechah1 timestamptz NOT NULL CONSTRAINT DF_ListaPrecioItem_lpi_fechah1  DEFAULT ('19000101'),
	lpi_precioh2 decimal(18, 6) NOT NULL CONSTRAINT DF_ListaPrecioItem_lpi_precioh11  DEFAULT (0),
	lpi_fechah2 timestamptz NOT NULL CONSTRAINT DF_ListaPrecioItem_lpi_fechah11  DEFAULT ('19000101'),
	lpi_precioh3 decimal(18, 6) NOT NULL CONSTRAINT DF_ListaPrecioItem_lpi_precioh12  DEFAULT (0),
	lpi_fechah3 timestamptz NOT NULL CONSTRAINT DF_ListaPrecioItem_lpi_fechah12  DEFAULT ('19000101'),
	lpi_precioh4 decimal(18, 6) NOT NULL CONSTRAINT DF_ListaPrecioItem_lpi_precioh13  DEFAULT (0),
	lpi_fechah4 timestamptz NOT NULL CONSTRAINT DF_ListaPrecioItem_lpi_fechah13  DEFAULT ('19000101'),
	lpi_precioh5 decimal(18, 6) NOT NULL CONSTRAINT DF_ListaPrecioItem_lpi_precioh14  DEFAULT (0),
	lpi_fechah5 timestamptz NOT NULL CONSTRAINT DF_ListaPrecioItem_lpi_fechah14  DEFAULT ('19000101'),
	pr_id int NOT NULL,
	lpm_id int NULL,
	activo smallint NOT NULL CONSTRAINT DF_ListaPrecioItem_activo  DEFAULT (1),
	creado timestamptz NOT NULL CONSTRAINT DF_ListaPrecioItem_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ListaPrecioItem_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
 CONSTRAINT PK_ListaPrecioItem PRIMARY KEY  
(
	lpi_id 
) 
) 
;
/****** Object:  Table ListaPrecioCliente    Script Date: 07/30/2012 17:16:09 ******/

;

;
CREATE TABLE ListaPrecioCliente(
	lpcli_id int NOT NULL,
	lp_id int NOT NULL,
	cli_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ListaPrecioCliente_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ListaPrecioCliente_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
PRIMARY KEY  
(
	lpcli_id 
) 
) 
;
/****** Object:  Table ListaPrecioConfig    Script Date: 07/30/2012 17:16:10 ******/

;

;
CREATE TABLE ListaPrecioConfig(
	lpc_id int NOT NULL,
	lpc_orden smallint NOT NULL,
	pr_id int NOT NULL,
	lp_id int NOT NULL,
 CONSTRAINT PK_ListaPrecioConfig PRIMARY KEY  
(
	lpc_id 
) 
) 
;
/****** Object:  Table ListaPrecioLista    Script Date: 07/30/2012 17:16:18 ******/

;

;
CREATE TABLE ListaPrecioLista(
	lpl_id int NOT NULL,
	lpl_porcentaje decimal(18, 6) NOT NULL CONSTRAINT DF_ListaPrecioLista_lpl_porcentaje  DEFAULT (0),
	lp_id_padre int NOT NULL,
	lp_id int NOT NULL,
	lpm_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ListaPrecioLista_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ListaPrecioLista_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE MovimientoCajaMovimiento(
	mcj_id int NOT NULL,
	mcjm_id int NOT NULL,
	mcjm_orden smallint NOT NULL,
	mcjm_descrip varchar(5000) NOT NULL CONSTRAINT DF_MovimientoCajaMovimiento_mcjm_descrip  DEFAULT (''),
	mcjm_importe decimal(18, 6) NOT NULL CONSTRAINT DF_MovimientoCajaMovimiento_mcjm_importe  DEFAULT (0),
	as_id int NOT NULL,
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
CREATE TABLE ComunidadInternetTextoItem(
	cmit_id int NOT NULL,
	cmiti_id int NOT NULL,
	cmiti_nombre varchar(255) NOT NULL,
	cmiti_codigo varchar(50) NOT NULL,
	cmiti_texto varchar(1000) NOT NULL,
	cmiti_tienevalor smallint NOT NULL CONSTRAINT DF_ComunidadInternetTexto_cmit_tienevalor  DEFAULT (0),
	cmiti_delimitador varchar(50) NOT NULL CONSTRAINT DF_ComunidadInternetTexto_cmit_delimitador  DEFAULT (''),
	cmiti_codigomacro varchar(50) NOT NULL CONSTRAINT DF_ComunidadInternetTexto_cmit_codigomacro  DEFAULT (''),
	cmiti_booleano smallint NOT NULL CONSTRAINT DF_ComunidadInternetTexto_cmit_booleano  DEFAULT (0),
	cmiti_id_padre int NULL,
	cmiti_orden smallint NOT NULL CONSTRAINT DF_ComunidadInternetTextoItem_cmti_id_orden  DEFAULT (0),
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
CREATE TABLE Cobrador(
	cob_id int NOT NULL,
	rel_id int NOT NULL,
	cob_nombre varchar(100) NOT NULL,
	cob_codigo varchar(15) NOT NULL,
	cob_descrip varchar(255) NOT NULL CONSTRAINT DF_Cobrador_cob_descripcion  DEFAULT (''),
	cob_comision real NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Cobrador_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Cobrador_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Cobrador_activo  DEFAULT (1),
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
CREATE TABLE FacturaCompraItemSerieTMP(
	fcTMP_id int NOT NULL,
	fciTMP_id int NOT NULL,
	fci_id int NOT NULL CONSTRAINT DF_FacturaCompraItemSerieTMP_fci_id  DEFAULT (0),
	fcisTMP_id int NOT NULL,
	fcis_orden smallint NOT NULL CONSTRAINT DF_FacturaCompraItemSerieTMP_fcis_orden  DEFAULT (0),
	prns_codigo varchar(100) NOT NULL CONSTRAINT DF_FacturaCompraItemSerieTMP_prns_codigo  DEFAULT (''),
	prns_descrip varchar(255) NOT NULL CONSTRAINT DF_FacturaCompraItemSerieTMP_prns_descrip  DEFAULT (''),
	prns_fechavto timestamptz NOT NULL CONSTRAINT DF_FacturaCompraItemSerieTMP_prns_fechavto  DEFAULT (getdate()),
	pr_id int NOT NULL,
	prns_id int NOT NULL CONSTRAINT DF_FacturaCompraItemSerieTMP_prns_id  DEFAULT (0),
	stl_codigo varchar(50) NOT NULL CONSTRAINT DF_FacturaCompraItemSerieTMP_stl_codigo  DEFAULT (''),
	stl_id int NULL,
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
CREATE TABLE CatalogoWebItem(
	catw_id int NOT NULL,
	catwi_id int NOT NULL,
	catwi_activo smallint NOT NULL CONSTRAINT DF_CatalogoWebItem_catwi_activo  DEFAULT (1),
	catwi_pendiente smallint NOT NULL CONSTRAINT DF_CatalogoWebItem_catwi_pendiente  DEFAULT (0),
	pr_id int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_CatalogoWebItem_activo  DEFAULT (1),
	creado timestamptz NOT NULL CONSTRAINT DF_CatalogoWebItem_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_CatalogoWebItem_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE DepositoCuponItemTMP(
	dcupTMP_id int NOT NULL,
	dcupiTMP_id int NOT NULL,
	dcupi_id int NOT NULL CONSTRAINT DF_DepositoCuponItemTMP_dcupi_id  DEFAULT (0),
	dcupi_orden smallint NOT NULL,
	dcupi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_DepositoCuponItemTMP_dcupi_importe  DEFAULT (0),
	dcupi_importeorigen decimal(18, 6) NOT NULL CONSTRAINT DF_DepositoCuponItemTMP_dcupi_importeorigen  DEFAULT (0),
	dcupi_descrip varchar(5000) NOT NULL CONSTRAINT DF_DepositoCuponItemTMP_dcupi_descrip  DEFAULT (''),
	cue_id int NULL,
	tjcc_id int NULL,
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
CREATE TABLE DepositoCuponItemBorradoTMP(
	dcupTMP_id int NOT NULL,
	dcupibTMP_id int NOT NULL,
	dcup_id int NOT NULL,
	dcupi_id int NOT NULL,
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
CREATE TABLE ParteReparacionItemSerieTMP(
	prpTMP_id int NOT NULL,
	prpiTMP_id int NOT NULL,
	prpi_id int NOT NULL CONSTRAINT DF_ParteReparacionSerieTMP_prpi_id  DEFAULT (0),
	prpisTMP_id int NOT NULL,
	prpis_orden smallint NOT NULL CONSTRAINT DF_ParteReparacionSerieTMP_prpis_orden  DEFAULT (0),
	prns_codigo varchar(100) NOT NULL CONSTRAINT DF_ParteReparacionSerieTMP_prns_codigo  DEFAULT (''),
	prns_descrip varchar(255) NOT NULL CONSTRAINT DF_ParteReparacionSerieTMP_prns_descrip  DEFAULT (''),
	prns_fechavto timestamptz NOT NULL CONSTRAINT DF_ParteReparacionSerieTMP_prns_fechavto  DEFAULT (getdate()),
	pr_id int NOT NULL,
	prns_id int NOT NULL CONSTRAINT DF_ParteReparacionSerieTMP_prns_id  DEFAULT (0),
	pr_id_item int NULL,
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
CREATE TABLE CDRomArchivo(
	cda_id int NOT NULL,
	cda_nombre varchar(255) NOT NULL,
	cda_tipo varchar(50) NOT NULL CONSTRAINT DF_CDRomArchivo_cda_tipo  DEFAULT (''),
	cda_path varchar(500) NOT NULL,
	cd_id int NOT NULL,
	cdc_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_CDRomArchivo_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_CDRomArchivo_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_CDRomArchivo_activo  DEFAULT (1),
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
CREATE TABLE CDRomCarpeta(
	cdc_id int NOT NULL,
	cdc_nombre varchar(255) NOT NULL,
	cdc_id_padre int NULL,
	cdc_path varchar(500) NOT NULL,
	cd_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_CDRomCarpeta_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_CDRomCarpeta_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_CDRomCarpeta_activo  DEFAULT (1),
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
CREATE TABLE FacturaVentaItemTMP(
	fvTMP_id int NOT NULL,
	fviTMP_id int NOT NULL,
	fvi_id int NOT NULL,
	fvi_orden smallint NOT NULL,
	fvi_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItemTMP_fvi_cantidad  DEFAULT (0),
	fvi_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItemTMP_fvi_cantidadaremitir  DEFAULT (0),
	fvi_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItemTMP_fvi_pendiente_1  DEFAULT (0),
	fvi_pendientepklst decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItemTMP_fvi_pendientepklst  DEFAULT (0),
	fvi_descrip varchar(5000) NOT NULL CONSTRAINT DF_FacturaVentaItemTMP_fvi_descrip  DEFAULT (''),
	fvi_precio decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItemTMP_fvi_precio  DEFAULT (0),
	fvi_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItemTMP_fvi_precioUsr  DEFAULT (0),
	fvi_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItemTMP_fvi_precioLista  DEFAULT (0),
	fvi_descuento varchar(100) NOT NULL CONSTRAINT DF_FacturaVentaItemTMP_fvi_descuento  DEFAULT (''),
	fvi_neto decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItemTMP_fv_neto  DEFAULT (0),
	fvi_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItemTMP_fvi_ivari  DEFAULT (0),
	fvi_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItemTMP_fvi_ivarni  DEFAULT (0),
	fvi_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItemTMP_fvi_ivariporc  DEFAULT (0),
	fvi_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItemTMP_fvi_ivarniporc  DEFAULT (0),
	fvi_internosporc decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItemTMP_fvi_internosporc  DEFAULT (0),
	fvi_internos decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItemTMP_fvi_internos  DEFAULT (0),
	fvi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItemTMP_fvi_importe  DEFAULT (0),
	fvi_importeorigen decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaVentaItemTMP_fvi_importe1  DEFAULT (0),
	fvi_nostock smallint NOT NULL CONSTRAINT DF_FacturaVentaItemTMP_fvi_nostock  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
	cue_id int NOT NULL,
	cue_id_ivari int NULL,
	cue_id_ivarni int NULL,
	to_id int NOT NULL CONSTRAINT DF__FacturaVe__to_id__7F1C63F7  DEFAULT (1),
	stl_id int NULL,
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
CREATE TABLE FacturaVentaItemSerieTMP(
	fvTMP_id int NOT NULL,
	fviTMP_id int NOT NULL,
	fvi_id int NOT NULL CONSTRAINT DF_FacturaVentaItemSerieTMP_fvi_id  DEFAULT (0),
	fvisTMP_id int NOT NULL,
	fvis_orden smallint NOT NULL CONSTRAINT DF_FacturaVentaItemSerieTMP_fvis_orden  DEFAULT (0),
	prns_codigo varchar(100) NOT NULL CONSTRAINT DF_FacturaVentaItemSerieTMP_prns_codigo  DEFAULT (''),
	prns_descrip varchar(255) NOT NULL CONSTRAINT DF_FacturaVentaItemSerieTMP_prns_descrip  DEFAULT (''),
	prns_fechavto timestamptz NOT NULL CONSTRAINT DF_FacturaVentaItemSerieTMP_prns_fechavto  DEFAULT (getdate()),
	pr_id int NOT NULL,
	prns_id int NOT NULL CONSTRAINT DF_FacturaVentaItemSerieTMP_prns_id  DEFAULT (0),
	pr_id_item int NULL,
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
CREATE TABLE FacturaVentaPercepcionBorradoTMP(
	fvTMP_id int NOT NULL,
	fvpercbTMP_id int NOT NULL,
	fv_id int NOT NULL,
	fvperc_id int NOT NULL,
 CONSTRAINT PK_FacturaVentaPercepcionBorradoTMP PRIMARY KEY  
(
	fvpercbTMP_id 
) 
) 
;
/****** Object:  Table FacturaVentaItemBorradoTMP    Script Date: 07/30/2012 17:12:26 ******/

;

;
CREATE TABLE FacturaVentaItemBorradoTMP(
	fvTMP_id int NOT NULL,
	fvibTMP_id int NOT NULL,
	fv_id int NOT NULL,
	fvi_id int NOT NULL,
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
CREATE TABLE RemitoCompraItem(
	rc_id int NOT NULL,
	rci_id int NOT NULL,
	rci_orden smallint NOT NULL,
	rci_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItem_pvi_cantidad  DEFAULT (0),
	rci_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItem_pvi_cantidadaremitir  DEFAULT (0),
	rci_pendiente decimal(18, 6) NULL CONSTRAINT DF_RemitoCompraItem_pvi_pendiente  DEFAULT (0),
	rci_pendientefac decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItem_rvi_pendientefac  DEFAULT (0),
	rci_descrip varchar(5000) NOT NULL CONSTRAINT DF_RemitoCompraItem_pvi_descrip  DEFAULT (''),
	rci_precio decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItem_pvi_precio  DEFAULT (0),
	rci_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItem_pvi_precioUsr  DEFAULT (0),
	rci_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItem_pvi_precioLista  DEFAULT (0),
	rci_descuento varchar(100) NOT NULL CONSTRAINT DF_RemitoCompraItem_pvi_descuento  DEFAULT (''),
	rci_neto decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItem_pvi_neto  DEFAULT (0),
	rci_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItem_pvi_ivari  DEFAULT (0),
	rci_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItem_pvi_ivarni  DEFAULT (0),
	rci_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItem_pvi_ivariporc  DEFAULT (0),
	rci_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItem_pvi_ivarniporc  DEFAULT (0),
	rci_importe decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItem_pvi_importe  DEFAULT (0),
	rci_costo decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItem_rci_costo  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
	stl_id int NULL,
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
CREATE TABLE ImportacionTempItem(
	impt_id int NOT NULL,
	impti_id int NOT NULL,
	impti_orden smallint NOT NULL,
	impti_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItem_pvi_cantidad  DEFAULT (0),
	impti_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItem_pvi_cantidadaremitir  DEFAULT (0),
	impti_descrip varchar(5000) NOT NULL CONSTRAINT DF_ImportacionTempItem_pvi_descrip  DEFAULT (''),
	impti_precio decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItem_pvi_precio  DEFAULT (0),
	impti_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItem_pvi_precioUsr  DEFAULT (0),
	impti_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItem_pvi_precioLista  DEFAULT (0),
	impti_descuento varchar(100) NOT NULL CONSTRAINT DF_ImportacionTempItem_pvi_descuento  DEFAULT (''),
	impti_neto decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItem_pvi_neto  DEFAULT (0),
	impti_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItem_pvi_ivari  DEFAULT (0),
	impti_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItem_pvi_ivarni  DEFAULT (0),
	impti_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItem_pvi_ivariporc  DEFAULT (0),
	impti_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItem_pvi_ivarniporc  DEFAULT (0),
	impti_importe decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItem_pvi_importe  DEFAULT (0),
	impti_seguro decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItem_impti_seguro  DEFAULT (0),
	impti_flete decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItem_impti_flete  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
	stl_id int NULL,
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
CREATE TABLE ManifiestoPackingList(
	mfcpklst_id int NOT NULL,
	mfcpklst_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoPackingList_mfcpklst_cantidad  DEFAULT (0),
	mfci_id int NOT NULL,
	pklsti_id int NOT NULL,
 CONSTRAINT PK_ManifiestoPackingList PRIMARY KEY  
(
	mfcpklst_id 
) 
) 
;
/****** Object:  Table PackingListFacturaVenta    Script Date: 07/30/2012 17:19:48 ******/

;

;
CREATE TABLE PackingListFacturaVenta(
	pklstfv_id int NOT NULL,
	pklstfv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListFacturaVenta_pklstfv_cantidad  DEFAULT (0),
	pklsti_id int NOT NULL,
	fvi_id int NOT NULL,
 CONSTRAINT PK_PackingListFacturaVenta PRIMARY KEY  
(
	pklstfv_id 
) 
) 
;
/****** Object:  Table PackingListFacturaVentaTMP    Script Date: 07/30/2012 17:19:49 ******/

;

;
CREATE TABLE PackingListFacturaVentaTMP(
	fvTMP_id int NOT NULL CONSTRAINT DF_PackingListFacturaVentaTMP_fvTMP_id  DEFAULT (0),
	pklstTMP_id int NOT NULL CONSTRAINT DF_PackingListFacturaVentaTMP_pklstTMP_id  DEFAULT (0),
	pklstfvTMP_id int NOT NULL,
	pklstfv_id int NOT NULL,
	pklstfv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListFacturaVentaTMP_pklstfv_cantidad  DEFAULT (0),
	pklsti_id int NOT NULL,
	fvi_id int NOT NULL,
 CONSTRAINT PK_PackingListFacturaVentaTMP PRIMARY KEY  
(
	pklstfvTMP_id 
) 
) 
;
/****** Object:  Table PackingListDevolucion    Script Date: 07/30/2012 17:19:45 ******/

;

;
CREATE TABLE PackingListDevolucion(
	pklstdv_id int NOT NULL,
	pklstdv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListDevolucion_pklstdv_cantidad  DEFAULT (0),
	pklsti_id_pklst int NOT NULL,
	pklsti_id_devolucion int NOT NULL,
 CONSTRAINT PK_PackingListDevolucion PRIMARY KEY  
(
	pklstdv_id 
) 
) 
;
/****** Object:  Table FacturaCompraOrdenPagoTMP    Script Date: 07/30/2012 17:11:32 ******/

;

;
CREATE TABLE FacturaCompraOrdenPagoTMP(
	opgTMP_id int NOT NULL,
	fcopgTMP_id int NOT NULL,
	fcopg_id int NOT NULL,
	fcopg_importe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraOrdenPagoTMP_fcopg_importe  DEFAULT (0),
	fcopg_importeOrigen decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraOrdenPagoTMP_fcopg_importeOrigen  DEFAULT (0),
	fcopg_cotizacion decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraOrdenPagoTMP_fcopg_cotizacion  DEFAULT (0),
	fc_id int NOT NULL,
	fcd_id int NULL,
	fcp_id int NULL,
	opg_id int NOT NULL,
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
CREATE TABLE OrdenPagoItemTMP(
	opgTMP_id int NOT NULL,
	opgiTMP_id int NOT NULL,
	opgi_id int NOT NULL,
	opgi_orden smallint NOT NULL CONSTRAINT DF_OrdenPagoItemTMP_opgi_orden  DEFAULT (0),
	opgi_otroTipo smallint NOT NULL CONSTRAINT DF_OrdenPagoItemTMP_opgi_otroTipo  DEFAULT (0),
	opgi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenPagoItemTMP_opgi_importe  DEFAULT (0),
	opgi_importeOrigen decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenPagoItemTMP_opgi_importeOrigen  DEFAULT (0),
	opgi_descrip varchar(255) NOT NULL CONSTRAINT DF_OrdenPagoItemTMP_opgi_descrip  DEFAULT (''),
	opgi_porcRetencion decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenPagoItemTMP_opgi_porcRetencion  DEFAULT (0),
	opgi_fechaRetencion timestamptz NOT NULL CONSTRAINT DF_OrdenPagoItemTMP_opgi_fechaRetencion  DEFAULT (getdate()),
	opgi_nroRetencion varchar(100) NOT NULL CONSTRAINT DF_OrdenPagoItemTMP_opgi_nroRetencion  DEFAULT (''),
	opgi_tipo smallint NOT NULL CONSTRAINT DF_OrdenPagoItemTMP_opgi_tipo  DEFAULT (0),
	opgiTMP_cheque varchar(50) NOT NULL CONSTRAINT DF_OrdenPagoItemTMP_opgiTMP_cheqe  DEFAULT (''),
	opgiTMP_cupon varchar(50) NOT NULL CONSTRAINT DF_OrdenPagoItemTMP_opgiTMP_cupon  DEFAULT (''),
	opgiTMP_fechaCobro timestamptz NOT NULL CONSTRAINT DF_OrdenPagoItemTMP_opgiTMP_fechaCobro  DEFAULT (getdate()),
	opgiTMP_fechaVto timestamptz NOT NULL CONSTRAINT DF_OrdenPagoItemTMP_opgiTMP_fechaVto  DEFAULT (getdate()),
	opgiTMP_titular varchar(255) NOT NULL CONSTRAINT DF_OrdenPagoItemTMP_opgiTMP_titular  DEFAULT (''),
	opgiTMP_autorizacion varchar(50) NOT NULL CONSTRAINT DF_OrdenPagoItemTMP_opgiTMP_autorizacion  DEFAULT (''),
	opgiTMP_nroTarjeta varchar(50) NOT NULL CONSTRAINT DF_OrdenPagoItemTMP_opgiTMP_nroTarjeta  DEFAULT (''),
	chq_id int NULL,
	cheq_id int NULL,
	cue_id int NULL,
	ccos_id int NULL,
	bco_id int NULL,
	cle_id int NULL,
	mon_id int NULL,
	ret_id int NULL,
	fc_id_ret int NULL,
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
CREATE TABLE OrdenPagoItemBorradoTMP(
	opgTMP_id int NOT NULL,
	opgibTMP_id int NOT NULL,
	opg_id int NOT NULL,
	opgi_id int NOT NULL,
 CONSTRAINT PK_OrdenPagoItemBorradoTMP PRIMARY KEY  
(
	opgibTMP_id 
) 
) 
;
/****** Object:  Table TarifarioAltura    Script Date: 07/30/2012 17:31:25 ******/

;

;
CREATE TABLE TarifarioAltura(
	tfa_id int NOT NULL,
	tfa_desde int NOT NULL,
	tfa_hasta int NOT NULL,
	tf_id int NOT NULL,
	tfcalle_id int NOT NULL,
	zon_id int NOT NULL,
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
CREATE TABLE BancoConciliacionItem(
	bcoci_id int NOT NULL,
	bcoc_id int NOT NULL,
	bcoci_debe decimal(18, 6) NOT NULL,
	bcoci_haber decimal(18, 6) NOT NULL,
	bcoci_fecha timestamptz NOT NULL,
	bcoci_estado smallint NOT NULL,
	bcoci_descrip varchar(5000) NOT NULL,
	bcoci_saldocont decimal(18, 6) NOT NULL CONSTRAINT DF_BancoConciliacionItem_bcoci_saldocont  DEFAULT (0),
	bcoci_saldobco decimal(18, 6) NOT NULL CONSTRAINT DF_BancoConciliacionItem_bcoci_saldobco  DEFAULT (0),
	asi_id int NOT NULL,
	doct_id int NULL,
	comp_id int NULL,
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
CREATE TABLE MovimientoFondoItemBorradoTMP(
	mfTMP_id int NOT NULL,
	mfibTMP_id int NOT NULL,
	mf_id int NOT NULL,
	mfi_id int NOT NULL,
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
CREATE TABLE MovimientoFondoItemTMP(
	mfTMP_id int NOT NULL,
	mfiTMP_id int NOT NULL,
	mfi_id int NOT NULL,
	mfi_orden smallint NOT NULL,
	mfi_descrip varchar(5000) NOT NULL CONSTRAINT DF_MovimientoFondoItemTMP_mfi_descrip  DEFAULT (''),
	mfi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_MovimientoFondoItemTMP_mfi_importe  DEFAULT (0),
	mfi_importeorigen decimal(18, 6) NOT NULL CONSTRAINT DF_MovimientoFondoItemTMP_mfi_importeOrigen  DEFAULT (0),
	mfi_tipo smallint NOT NULL CONSTRAINT DF_MovimientoFondoItemTMP_mfi_tipo  DEFAULT (0),
	mfiTMP_cheque varchar(50) NOT NULL CONSTRAINT DF_MovimientoFondoItemTMP_opgiTMP_cheque  DEFAULT (''),
	mfiTMP_fechaCobro timestamptz NOT NULL CONSTRAINT DF_MovimientoFondoItemTMP_opgiTMP_fechaCobro  DEFAULT (getdate()),
	mfiTMP_fechaVto timestamptz NOT NULL CONSTRAINT DF_MovimientoFondoItemTMP_opgiTMP_fechaVto  DEFAULT (getdate()),
	ccos_id int NULL,
	cue_id_debe int NOT NULL,
	cue_id_haber int NOT NULL,
	chq_id int NULL,
	cheq_id int NULL,
	cle_id int NULL,
	mon_id int NULL,
	bco_id int NULL,
	mfi_importeorigenhaber decimal(18, 6) NOT NULL DEFAULT (0),
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
CREATE TABLE RubroTablaItem(
	rubti_id int NOT NULL,
	rubt_id int NOT NULL,
	rubti_nombre varchar(255) NOT NULL,
	rubti_codigo varchar(50) NOT NULL,
	rubti_descrip varchar(255) NOT NULL CONSTRAINT DF_RubroTablaItem_rubti_descrip  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_RubroTablaItem_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_RubroTablaItem_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE EjercicioContableCircuitoContable(
	ejc_id int NOT NULL,
	cico_id int NOT NULL,
 CONSTRAINT PK_EjercicioContableCircuitoContable PRIMARY KEY  
(
	ejc_id ,
	cico_id 
) 
) 
;
/****** Object:  Table PedidoCompraItem    Script Date: 07/30/2012 17:21:24 ******/

;

;

;
CREATE TABLE PedidoCompraItem(
	pc_id int NOT NULL,
	pci_id int NOT NULL,
	pci_orden smallint NOT NULL,
	pci_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItem_pci_cantidad  DEFAULT (0),
	pci_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItem_pci_cantidadaremitir  DEFAULT (0),
	pci_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItem_pci_pendiente  DEFAULT (0),
	pci_descrip varchar(5000) NOT NULL CONSTRAINT DF_PedidoCompraItem_pci_descrip  DEFAULT (''),
	pci_precio decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItem_pci_precio  DEFAULT (0),
	pci_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItem_pci_precioUsr  DEFAULT (0),
	pci_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItem_pci_precioLista  DEFAULT (0),
	pci_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItem_pci_neto  DEFAULT (0),
	pci_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItem_pci_ivari  DEFAULT (0),
	pci_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItem_pci_ivarni  DEFAULT (0),
	pci_importe decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItem_pci_importe  DEFAULT (0),
	pci_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItem_pci_ivariporc  DEFAULT (0),
	pci_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItem_pci_ivarniporc  DEFAULT (0),
	pr_id int NOT NULL,
	us_id int NULL,
	ccos_id int NULL,
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
CREATE TABLE CondicionPagoItem(
	cpgi_id int NOT NULL,
	cpg_id int NOT NULL,
	cpgi_dias smallint NOT NULL CONSTRAINT DF_CondicionPagoItem_cpgi_dias  DEFAULT (0),
	cpgi_porcentaje decimal(18, 4) NOT NULL CONSTRAINT DF_CondicionPagoItem_cpgi_porcentaje  DEFAULT (0),
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
CREATE TABLE PackingListItem(
	pklst_id int NOT NULL,
	pklsti_id int NOT NULL,
	pklsti_orden smallint NOT NULL,
	pklsti_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItem_pklsti_cantidad  DEFAULT (0),
	pklsti_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItem_pklsti_pendiente  DEFAULT (0),
	pklsti_pendientefac decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItem_pklsti_pendientefac  DEFAULT (0),
	pklsti_pallets int NOT NULL,
	pklsti_seguro decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItem_pklsti_seguro  DEFAULT (0),
	pklsti_descrip varchar(255) NOT NULL CONSTRAINT DF_PackingListItem_pklsti_descrip  DEFAULT (''),
	pklsti_precio decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItem_rvi_precio  DEFAULT (0),
	pklsti_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItem_rvi_precioUsr  DEFAULT (0),
	pklsti_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItem_rvi_precioLista  DEFAULT (0),
	pklsti_descuento varchar(100) NOT NULL CONSTRAINT DF_PackingListItem_rvi_descuento  DEFAULT (''),
	pklsti_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItem_rvi_neto  DEFAULT (0),
	pklsti_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItem_rvi_ivari  DEFAULT (0),
	pklsti_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItem_rvi_ivarni  DEFAULT (0),
	pklsti_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItem_rvi_ivariporc  DEFAULT (0),
	pklsti_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItem_rvi_ivarniporc  DEFAULT (0),
	pklsti_importe decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItem_rvi_importe  DEFAULT (0),
	pklsti_cajadesde smallint NOT NULL CONSTRAINT DF_PackingListItem_pklsti_cajadesde  DEFAULT (0),
	pklsti_cajahasta smallint NOT NULL CONSTRAINT DF_PackingListItem_pklsti_cajahasta  DEFAULT (0),
	pklsti_pesoneto decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItem_pklsti_pesoneto  DEFAULT (0),
	pklsti_pesototal decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItem_pklsti_pesototal  DEFAULT (0),
	pklsti_grupoexpo varchar(100) NOT NULL CONSTRAINT DF_PackingListItem_pklsti_grupoexpo  DEFAULT (''),
	ccos_id int NULL,
	pr_id int NOT NULL,
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
CREATE TABLE MovimientoCaja(
	mcj_id int NOT NULL,
	mcj_numero int NOT NULL CONSTRAINT DF_MovimientoCaja_mcj_numero  DEFAULT (0),
	mcj_nrodoc varchar(50) NOT NULL CONSTRAINT DF_MovimientoCaja_mcj_nrodoc  DEFAULT (''),
	mcj_descrip varchar(5000) NOT NULL CONSTRAINT DF_MovimientoCaja_mcj_descrip  DEFAULT (''),
	mcj_fecha timestamptz NOT NULL CONSTRAINT DF_MovimientoCaja_mcj_fecha  DEFAULT (getdate()),
	mcj_hora timestamptz NOT NULL CONSTRAINT DF_MovimientoCaja_mcj_hora  DEFAULT ('19000101'),
	mcj_tipo smallint NOT NULL CONSTRAINT DF_MovimientoCaja_mcj_tipo  DEFAULT (0),
	mcj_cerrada smallint NOT NULL CONSTRAINT DF_MovimientoCaja_mcj_cerrada  DEFAULT (0),
	cj_id int NOT NULL,
	us_id_cajero int NOT NULL,
	as_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_MovimientoCaja_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_MovimientoCaja_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	impreso smallint NOT NULL CONSTRAINT DF_MovimientoCaja_impreso  DEFAULT (0),
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
CREATE TABLE PedidoCotizacionCompra(
	pccot_id int NOT NULL,
	pccot_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCotizacionCompra_pccot_cantidad  DEFAULT (0),
	pci_id int NOT NULL,
	coti_id int NOT NULL,
 CONSTRAINT PK_PedidoCotizacionCompra PRIMARY KEY  
(
	pccot_id 
) 
) 
;
/****** Object:  Table CotizacionOrdenCompra    Script Date: 07/30/2012 17:07:27 ******/

;

;
CREATE TABLE CotizacionOrdenCompra(
	cotoc_id int NOT NULL,
	cotoc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionOrdenCompra_cotoc_cantidad  DEFAULT (0),
	coti_id int NOT NULL,
	oci_id int NOT NULL,
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
CREATE TABLE EncuestaPreguntaItem(
	ecp_id int NOT NULL,
	ecpi_id int NOT NULL,
	ecpi_texto varchar(255) NOT NULL,
	ecpi_llevaInfo smallint NOT NULL CONSTRAINT DF_EncuestaPreguntaItem_ecpi_llevaInfo  DEFAULT (0),
	ecpi_orden smallint NOT NULL CONSTRAINT DF_EncuestaPreguntaItem_ecpi_orden  DEFAULT (0),
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
CREATE TABLE CursoItemAsistencia(
	curi_id int NOT NULL,
	curia_id int NOT NULL,
	curc_id int NOT NULL,
 CONSTRAINT PK_CursoItemAsistencia PRIMARY KEY  
(
	curia_id 
) 
) 
;
/****** Object:  Table CursoItemCalificacion    Script Date: 07/30/2012 17:07:52 ******/

;

;
CREATE TABLE CursoItemCalificacion(
	curi_id int NOT NULL,
	curic_id int NOT NULL,
	curic_calificacion decimal(18, 6) NOT NULL CONSTRAINT DF_CursoItemCalificacion_curic_calificacion  DEFAULT (0),
	cure_id int NOT NULL,
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
CREATE TABLE StockLote(
	stl_id int NOT NULL,
	stl_codigo varchar(50) NOT NULL,
	stl_nroLote varchar(50) NOT NULL,
	stl_fecha timestamptz NOT NULL CONSTRAINT DF_StockLote_stl_fecha  DEFAULT (getdate()),
	stl_fechaVto timestamptz NOT NULL CONSTRAINT DF_StockLote_stl_fechaVto  DEFAULT ('19000101'),
	stl_descrip varchar(255) NOT NULL CONSTRAINT DF_StockLote_stl_descrip  DEFAULT (''),
	stl_id_padre int NULL,
	pr_id int NOT NULL,
	pa_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_StockLote_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_StockLote_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE Aduana(
	adu_id int NOT NULL,
	adu_nombre varchar(100) NOT NULL,
	adu_codigo varchar(15) NOT NULL,
	adu_descrip varchar(255) NOT NULL CONSTRAINT DF_Aduana_adu_descrip  DEFAULT (''),
	pa_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Aduana_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Aduana_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Aduana_activo  DEFAULT (1),
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
CREATE TABLE ExpoGrupoPrecioPosAran(
	egppa_id int NOT NULL,
	egp_id int NOT NULL,
	egppa_posicion varchar(255) NOT NULL CONSTRAINT DF_ExpoGrupoPrecioPosAran_egppa_posicion  DEFAULT (''),
	pa_id int NOT NULL,
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
CREATE TABLE Provincia(
	pro_id int NOT NULL,
	pro_nombre varchar(100) NOT NULL,
	pro_codigo varchar(15) NOT NULL,
	pro_descrip varchar(255) NOT NULL CONSTRAINT DF_Provincia_pro_descrip  DEFAULT (''),
	pa_id int NOT NULL,
	modificado timestamptz NOT NULL CONSTRAINT DF_Provincia_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Provincia_creado  DEFAULT (getdate()),
	activo smallint NOT NULL CONSTRAINT DF_Provincia_activo  DEFAULT (1),
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
CREATE TABLE RamaVista(
	arbv_id int NOT NULL,
	ram_id int NOT NULL,
	ramv_id int NOT NULL,
	ramv_estado smallint NOT NULL CONSTRAINT DF_RamaVista_ramv_estado  DEFAULT (0),
 CONSTRAINT PK_RamaVista PRIMARY KEY  
(
	ramv_id 
) 
) 
;
/****** Object:  Table HoraFacturaVenta    Script Date: 07/30/2012 17:13:50 ******/

;

;
CREATE TABLE HoraFacturaVenta(
	horafv_id int NOT NULL,
	horafv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_HoraFacturaVenta_horafv_cantidad  DEFAULT (0),
	hora_id int NOT NULL,
	fvi_id int NOT NULL,
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
CREATE TABLE RemitoCompraItemSerieTMP(
	rcTMP_id int NOT NULL,
	rciTMP_id int NOT NULL,
	rci_id int NOT NULL CONSTRAINT DF_RemitoCompraItemSerieTMP_rci_id  DEFAULT (0),
	rcisTMP_id int NOT NULL,
	rcis_orden smallint NOT NULL CONSTRAINT DF_RemitoCompraItemSerieTMP_rcis_orden  DEFAULT (0),
	prns_codigo varchar(100) NOT NULL CONSTRAINT DF_RemitoCompraItemSerieTMP_prns_codigo  DEFAULT (''),
	prns_descrip varchar(255) NOT NULL CONSTRAINT DF_RemitoCompraItemSerieTMP_prns_descrip  DEFAULT (''),
	prns_fechavto timestamptz NOT NULL CONSTRAINT DF_RemitoCompraItemSerieTMP_prns_fechavto  DEFAULT (getdate()),
	pr_id int NOT NULL,
	prns_id int NOT NULL CONSTRAINT DF_RemitoCompraItemSerieTMP_prns_id  DEFAULT (0),
	stl_codigo varchar(50) NOT NULL CONSTRAINT DF_RemitoCompraItemSerieTMP_stl_codigo  DEFAULT (''),
	stl_id int NULL,
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
CREATE TABLE PermisoEmbarqueItem(
	pemb_id int NOT NULL,
	pembi_id int NOT NULL,
	pembi_orden smallint NOT NULL,
	pembi_cantidad decimal(18, 6) NOT NULL,
	pembi_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PermisoEmbarqueItem_pembi_pendiente  DEFAULT (0),
	pembi_foborigen decimal(18, 6) NOT NULL CONSTRAINT DF_PermisoEmbarqueItem_pembi_foborigen  DEFAULT (0),
	pembi_fobtotalorigen decimal(18, 6) NOT NULL CONSTRAINT DF_PermisoEmbarqueItem_pembi_fobtotalorigen  DEFAULT (0),
	pembi_fob decimal(18, 6) NOT NULL,
	pembi_fobtotal decimal(18, 6) NOT NULL,
	pembi_descrip varchar(255) NOT NULL CONSTRAINT DF_PermisoEmbarqueItem_pembi_descrip  DEFAULT (''),
	pr_id int NOT NULL,
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
CREATE TABLE LenguajeItem(
	lengi_id int NOT NULL,
	lengi_codigo varchar(255) NOT NULL,
	leng_id int NOT NULL,
	lengi_texto varchar(5000) NOT NULL CONSTRAINT DF_LenguajeItem_lengi_texto  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_LenguajeItem_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_LenguajeItem_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_LenguajeItem_activo  DEFAULT (1),
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
CREATE TABLE ClienteContactoTipo(
	clict_id int NOT NULL,
	clict_nombre varchar(100) NOT NULL,
	clict_codigo varchar(15) NOT NULL,
	clict_descrip varchar(255) NOT NULL CONSTRAINT DF_ClienteContactoTipo_clitc_descrip  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_ClienteContactoTipo_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ClienteContactoTipo_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_ClienteContactoTipo_activo  DEFAULT (1),
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
CREATE TABLE CircuitoContable(
	cico_id int NOT NULL,
	cico_nombre varchar(100) NOT NULL,
	cico_codigo varchar(15) NOT NULL,
	cico_descrip varchar(255) NOT NULL CONSTRAINT DF_CircuitoContable_cico_descrip  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_CircuitoContable_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_CircuitoContable_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_CircuitoContable_activo  DEFAULT (1),
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
CREATE TABLE Lenguaje(
	leng_id int NOT NULL,
	leng_nombre varchar(100) NOT NULL,
	leng_codigo varchar(15) NOT NULL,
	leng_descrip varchar(255) NOT NULL CONSTRAINT DF_Lenguaje_leng_descrip  DEFAULT (''),
	leng_id_padre int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Lenguaje_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Lenguaje_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Lenguaje_activo  DEFAULT (1),
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
CREATE TABLE UsuarioDepartamento(
	usdpto_id int NOT NULL,
	us_id int NOT NULL,
	dpto_id int NOT NULL,
	modificado timestamptz NOT NULL CONSTRAINT DF_UsuarioDepartamento_modificado  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_UsuarioDepartamento_creado  DEFAULT (getdate()),
	activo smallint NOT NULL CONSTRAINT DF_UsuarioDepartamento_activo  DEFAULT (1),
	modifico int NOT NULL CONSTRAINT DF_UsuarioDepartamento_modifico  DEFAULT (1),
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
CREATE TABLE GridView(
	grid_name varchar(255) NOT NULL CONSTRAINT DF_GridView_grid_name  DEFAULT (''),
	rpt_id int NULL,
	grdv_id int NOT NULL,
	grdv_nombre varchar(255) NOT NULL CONSTRAINT DF_GridView_grdv_nombre  DEFAULT (''),
	grdv_default smallint NOT NULL CONSTRAINT DF_GridView_grdv_default  DEFAULT (0),
	grdv_publica smallint NOT NULL,
	grdv_autowidth smallint NOT NULL CONSTRAINT DF_GridView_grdv_autowidth  DEFAULT (0),
	us_id int NOT NULL,
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
CREATE TABLE Pais(
	pa_id int NOT NULL,
	pa_nombre varchar(100) NOT NULL,
	pa_codigo varchar(15) NOT NULL,
	pa_descrip varchar(255) NOT NULL CONSTRAINT DF_Pais_pa_descrip  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_Pais_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Pais_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Pais_activo  DEFAULT (1),
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
CREATE TABLE CajaCajero(
	cj_id int NOT NULL,
	cjcj_id int NOT NULL,
	us_id int NOT NULL,
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
CREATE TABLE Prioridad(
	prio_id int NOT NULL,
	prio_nombre varchar(100) NOT NULL CONSTRAINT DF_Prioridad_prio_nombre  DEFAULT (''),
	prio_codigo varchar(15) NOT NULL CONSTRAINT DF_Prioridad_prio_alias  DEFAULT (''),
	modificado timestamptz NOT NULL CONSTRAINT DF_Prioridad_modificado  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_Prioridad_creado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Prioridad_activo  DEFAULT (1),
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
CREATE TABLE DepositoFisico(
	depf_id int NOT NULL,
	depf_nombre varchar(100) NOT NULL,
	depf_codigo varchar(30) NOT NULL,
	depf_descrip varchar(255) NOT NULL CONSTRAINT DF_DepositoFisico_depf_descripcion  DEFAULT (''),
	depf_tel varchar(100) NOT NULL CONSTRAINT DF_DepositoFisico_depf_tel  DEFAULT (''),
	depf_dir varchar(255) NOT NULL CONSTRAINT DF_DepositoFisico_depf_dir  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_DepositoFisico_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_DepositoFisico_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_DepositoFisico_activo  DEFAULT (1),
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
CREATE TABLE EncuestaRespuesta(
	ecr_id int NOT NULL,
	ecpi_id int NOT NULL,
	ecr_infoAdicional varchar(255) NOT NULL,
	us_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_EncuestaRespuesta_creado  DEFAULT (getdate()),
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
CREATE TABLE TarifaGasto(
	trfg_id int NOT NULL,
	trfg_fijo decimal(18, 6) NOT NULL CONSTRAINT DF_TarifaGasto_trfg_fijo  DEFAULT (0),
	trfg_minimo decimal(18, 6) NOT NULL CONSTRAINT DF_TarifaGasto_trfg_minimo  DEFAULT (0),
	trfg_importe decimal(18, 6) NOT NULL CONSTRAINT DF_TarifaGasto_trfg_porcentaje  DEFAULT (0),
	gto_id int NOT NULL,
	trf_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_TarifaGasto_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_TarifaGasto_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_TarifaGasto_activo  DEFAULT (1),
 CONSTRAINT PK_TarifaGasto PRIMARY KEY  
(
	trfg_id 
) 
) 
;
/****** Object:  Table ProductoKit    Script Date: 07/30/2012 17:25:58 ******/

;

;
CREATE TABLE ProductoKit(
	prfk_id int NOT NULL,
	prk_id int NOT NULL,
	prk_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_ProductoKit_prk_cantidad  DEFAULT (0),
	prk_variable smallint NOT NULL CONSTRAINT DF_ProductoKit_prk_variable  DEFAULT (0),
	pr_id_item int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ProductoKit_creado  DEFAULT (getdate()),
	modifico int NOT NULL,
	modificado timestamptz NOT NULL CONSTRAINT DF_ProductoKit_modificado  DEFAULT (getdate()),
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
CREATE TABLE StockValor(
	stv_id int NOT NULL,
	stv_fecha timestamptz NOT NULL DEFAULT (getdate()),
	stv_numero int NOT NULL,
	stv_descrip varchar(5000) NOT NULL DEFAULT (''),
	stv_descrip2 varchar(5000) NOT NULL DEFAULT (''),
	creado timestamptz NOT NULL DEFAULT (getdate()),
	modificado timestamptz NOT NULL DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE TipoOperacion(
	to_id int NOT NULL,
	to_nombre varchar(100) NOT NULL,
	to_codigo varchar(15) NOT NULL,
	to_generadeuda smallint NOT NULL CONSTRAINT DF_TipoOperacion_to_generadeuda  DEFAULT (1),
	to_descrip varchar(255) NOT NULL CONSTRAINT DF_TipoOperacion_to_descrip  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_TipoOperacion_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_TipoOperacion_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_TipoOperacion_activo  DEFAULT (1),
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
CREATE TABLE ImportacionID(
	impid_id int NOT NULL,
	impid_fecha timestamptz NOT NULL CONSTRAINT DF_ImportacionID_impid_fecha  DEFAULT (getdate()),
	impid_descrip varchar(5000) NOT NULL DEFAULT (''),
	impidt_id int NOT NULL,
	us_id int NOT NULL,
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
CREATE TABLE Especie(
	esp_id int NOT NULL,
	esp_nombre varchar(100) NOT NULL,
	esp_codigo varchar(15) NOT NULL,
	esp_descrip varchar(255) NOT NULL CONSTRAINT DF_Especie_esp_descrip  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_Especie_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Especie_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Especie_activo  DEFAULT (1),
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
CREATE TABLE ExpoFamilia(
	efm_id int NOT NULL,
	efm_nombre varchar(100) NOT NULL,
	efm_codigo varchar(15) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ExpoFamilia_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ExpoFamilia_modificado  DEFAULT (getdate()),
	modifico int NOT NULL CONSTRAINT DF_ExpoFamilia_modifico  DEFAULT (0),
	activo smallint NOT NULL CONSTRAINT DF_ExpoFamilia_activo  DEFAULT (1),
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
CREATE TABLE ExpoGrupoPrecio(
	egp_id int NOT NULL,
	egp_nombre varchar(100) NOT NULL,
	egp_codigo varchar(15) NOT NULL,
	egp_posarancel varchar(50) NOT NULL CONSTRAINT DF_ExpoGrupoPrecio_egp_posarancel  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_ExpoGrupoPrecio_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ExpoGrupoPrecio_modificado  DEFAULT (getdate()),
	modifico int NOT NULL CONSTRAINT DF_ExpoGrupoPrecio_modifico  DEFAULT (0),
	activo smallint NOT NULL CONSTRAINT DF_ExpoGrupoPrecio_activo  DEFAULT (1),
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
CREATE TABLE Aviso(
	av_id int NOT NULL,
	av_descrip varchar(255) NOT NULL CONSTRAINT DF_Aviso_av_descrip  DEFAULT (''),
	id varchar(255) NOT NULL CONSTRAINT DF_Aviso_id  DEFAULT (''),
	av_leido smallint NOT NULL CONSTRAINT DF_Aviso_av_leido  DEFAULT (0),
	avt_id int NOT NULL,
	us_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Aviso_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Aviso_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Aviso_activo  DEFAULT (1),
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
CREATE TABLE Banco(
	bco_id int NOT NULL,
	bco_nombre varchar(100) NOT NULL,
	bco_codigo varchar(15) NOT NULL,
	bco_contacto varchar(500) NOT NULL CONSTRAINT DF_Banco_bco_contacto  DEFAULT (''),
	bco_telefono varchar(255) NOT NULL CONSTRAINT DF_Banco_bco_telefono  DEFAULT (''),
	bco_direccion varchar(255) NOT NULL CONSTRAINT DF_Banco_bco_direccion  DEFAULT (''),
	bco_web varchar(255) NOT NULL CONSTRAINT DF_Banco_bco_web  DEFAULT (''),
	bco_mail varchar(255) NOT NULL CONSTRAINT DF_Banco_bco_mail  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_Banco_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Banco_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Banco_activo  DEFAULT (1),
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
CREATE TABLE ParteDiarioTipo(
	ptdt_id int NOT NULL,
	ptdt_nombre varchar(100) NOT NULL,
	ptdt_codigo varchar(15) NOT NULL,
	ptdt_descrip varchar(255) NOT NULL CONSTRAINT DF_ParteDiarioTipo_ptdt_descrip  DEFAULT (''),
	modificado timestamptz NOT NULL CONSTRAINT DF_ParteDiarioTipo_modificado  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_ParteDiarioTipo_creado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_ParteDiarioTipo_activo  DEFAULT (1),
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
CREATE TABLE PersonaDocumentoTipo(
	prsdt_id int NOT NULL,
	prsdt_nombre varchar(100) NOT NULL,
	prsdt_codigo varchar(15) NOT NULL,
	prsdt_descrip varchar(255) NOT NULL CONSTRAINT DF_PersonaDocumentoTipo_prsdt_descrip  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_PersonaDocumentoTipo_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_PersonaDocumentoTipo_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_PersonaDocumentoTipo_activo  DEFAULT (1),
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
CREATE TABLE ConfiguracionCalibradora(
	calibc_id int NOT NULL,
	calibc_nombre varchar(100) NOT NULL,
	calibc_descrip varchar(255) NOT NULL CONSTRAINT DF_CalibradoraC_calibc_descrip  DEFAULT (''),
	calibc_codigo varchar(15) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_CalibradoraC_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_CalibradoraC_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_CalibradoraC_activo  DEFAULT (1),
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
CREATE TABLE Arbol(
	arb_id int NOT NULL,
	arb_nombre varchar(100) NOT NULL,
	modificado timestamptz NOT NULL CONSTRAINT DF_Arbol_modificado  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_Arbol_creado  DEFAULT (getdate()),
	tbl_Id int NOT NULL,
	modifico int NOT NULL,
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
CREATE TABLE Aula(
	aula_id int NOT NULL,
	aula_nombre varchar(100) NOT NULL,
	aula_codigo varchar(15) NOT NULL,
	aula_descrip varchar(255) NOT NULL CONSTRAINT DF_Aula_aula_descrip  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_Aula_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Aula_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Aula_activo  DEFAULT (1),
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
CREATE TABLE Unidad(
	un_id int NOT NULL,
	un_nombre varchar(100) NOT NULL,
	un_codigo varchar(15) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Unidad_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Unidad_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Unidad_activo  DEFAULT (1),
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
CREATE TABLE Sucursal(
	suc_id int NOT NULL,
	suc_nombre varchar(100) NOT NULL,
	suc_codigo varchar(15) NOT NULL,
	suc_descrip varchar(255) NOT NULL CONSTRAINT DF_Sucursal_suc_descrip  DEFAULT (''),
	suc_numero int NOT NULL CONSTRAINT DF_Sucursal_suc_numero  DEFAULT (0),
	creado timestamptz NOT NULL CONSTRAINT DF_Sucursal_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Sucursal_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Sucursal_activo  DEFAULT (1),
 CONSTRAINT PK_Sucursal PRIMARY KEY  
(
	suc_id 
) ,
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
CREATE TABLE Vendedor(
	ven_id int NOT NULL,
	ven_nombre varchar(100) NOT NULL,
	ven_codigo varchar(15) NOT NULL,
	ven_descrip varchar(255) NOT NULL CONSTRAINT DF_Vendedor_ven_descrip  DEFAULT (''),
	us_id int NULL,
	activo smallint NOT NULL CONSTRAINT DF__Vendedor__activo__24BD5A91  DEFAULT (1),
	creado timestamptz NOT NULL CONSTRAINT DF__Vendedor__creado__25B17ECA  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF__Vendedor__modifi__26A5A303  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE Importacion(
	imp_id int NOT NULL,
	imp_origenTabla varchar(255) NOT NULL CONSTRAINT DF_Importacion_imp_origenTabla  DEFAULT (''),
	imp_origenSqlstmt varchar(255) NOT NULL CONSTRAINT DF_Importacion_imp_origenSqlstmt  DEFAULT (''),
	imp_origenPath varchar(500) NOT NULL CONSTRAINT DF_Importacion_imp_origenPath  DEFAULT (''),
	imp_destinoTabla varchar(255) NOT NULL CONSTRAINT DF_Importacion_imp_destinoTabla  DEFAULT (''),
	imp_nombre varchar(100) NOT NULL,
	imp_descrip varchar(255) NOT NULL CONSTRAINT DF_Importacion_imp_descrip  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_Importacion_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Importacion_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE Calibradora(
	calib_id int NOT NULL,
	calib_nombre varchar(100) NOT NULL,
	calib_descrip varchar(255) NOT NULL CONSTRAINT DF_Calibradora_calib_descrip  DEFAULT (''),
	calib_codigo varchar(15) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Calibradora_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Calibradora_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Calibradora_activo  DEFAULT (1),
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
CREATE TABLE ComunidadInternetEmailAccount(
	cmiea_id int NOT NULL,
	cmiea_nombre varchar(255) NOT NULL,
	cmiea_codigo varchar(50) NOT NULL CONSTRAINT DF_ComunidadInternetEmailAccount_cmiea_codigo  DEFAULT (''),
	cmiea_email_server varchar(1000) NOT NULL,
	cmiea_email_user varchar(255) NOT NULL,
	cmiea_email_pwd varchar(255) NOT NULL,
	cmiea_server varchar(255) NOT NULL,
	cmiea_user varchar(50) NOT NULL,
	cmiea_pwd varchar(50) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ComunidadInternetEmailAccount_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ComunidadInternetEmailAccount_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_ComunidadInternetEmailAccount_activo  DEFAULT (1),
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
CREATE TABLE Marca(
	marc_id int NOT NULL,
	marc_nombre varchar(100) NOT NULL,
	marc_codigo varchar(15) NOT NULL,
	marc_descrip varchar(255) NOT NULL CONSTRAINT DF_Marca_marc_descrip  DEFAULT (''),
	marc_textoweb varchar(5000) NOT NULL CONSTRAINT DF_Marca_marc_textoweb  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_Marca_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Marca_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Marca_activo  DEFAULT (1),
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
CREATE TABLE Puerto(
	pue_id int NOT NULL,
	pue_nombre varchar(100) NOT NULL,
	pue_codigo varchar(15) NOT NULL,
	pue_descrip varchar(255) NOT NULL CONSTRAINT DF_Puerto_pue_descrip  DEFAULT (''),
	ciu_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Puerto_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Puerto_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Puerto_activo  DEFAULT (1),
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
CREATE TABLE Barco(
	barc_id int NOT NULL,
	barc_nombre varchar(100) NOT NULL,
	barc_codigo varchar(15) NOT NULL,
	barc_descrip varchar(255) NOT NULL CONSTRAINT DF_Barco_barc_descrip  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_Barco_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Barco_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Barco_activo  DEFAULT (1),
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
CREATE TABLE LiquidacionPlantilla(
	liqp_id int NOT NULL,
	liqp_nombre varchar(100) NOT NULL,
	liqp_codigo varchar(15) NOT NULL,
	liqp_descrip varchar(255) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_PlantillaLiquidacion_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_PlantillaLiquidacion_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_PlantillaLiquidacion_activo  DEFAULT (1),
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
CREATE TABLE EmpleadoAsistenciaTipo(
	east_id int NOT NULL,
	east_nombre varchar(100) NOT NULL,
	east_codigo varchar(15) NOT NULL,
	east_descrip varchar(255) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_EmpleadoAsistencia_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_EmpleadoAsistencia_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_EmpleadoAsistencia_activo  DEFAULT (1),
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
CREATE TABLE DocumentoTipo(
	doct_id int NOT NULL,
	doct_nombre varchar(100) NOT NULL,
	doct_codigo varchar(15) NOT NULL,
	doct_grupo varchar(255) NOT NULL CONSTRAINT DF_DocumentoTipo_doct_grupo_1  DEFAULT (''),
	doct_object varchar(255) NOT NULL CONSTRAINT DF_DocumentoTipo_doct_object  DEFAULT (''),
	pre_id int NOT NULL CONSTRAINT DF_DocumentoTipo_pre_id  DEFAULT (0),
	creado timestamptz NOT NULL CONSTRAINT DF_DocumentoTipo_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_DocumentoTipo_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_DocumentoTipo_activo  DEFAULT (1),
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
CREATE TABLE LiquidacionFormula(
	liqf_id int NOT NULL,
	liqf_nombre varchar(100) NOT NULL,
	liqf_codigo varchar(15) NOT NULL,
	liqf_descrip varchar(255) NOT NULL,
	liqf_formula varchar(7000) NOT NULL CONSTRAINT DF_LiquidacionFormula_liqf_formula  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_LiquidacionFormula_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_LiquidacionFormula_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_LiquidacionFormula_activo  DEFAULT (1),
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
CREATE TABLE Maquina(
	maq_id int NOT NULL,
	maq_nombre varchar(100) NOT NULL,
	maq_codigo varchar(15) NOT NULL,
	maq_descrip varchar(255) NOT NULL CONSTRAINT DF_Maquina_maq_descrip  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_maquina_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_maquina_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_maquina_activo  DEFAULT (1),
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
CREATE TABLE CuentaCategoria(
	cuec_id int NOT NULL,
	cuec_nombre varchar(100) NOT NULL,
	cuec_codigo varchar(15) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_CuentaCategoria2_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_CuentaCategoria2_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	cuec_tipo smallint NOT NULL CONSTRAINT DF__cuentacat__cuec___7C8F6DA6  DEFAULT (0),
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
CREATE TABLE Calidad(
	calid_id int NOT NULL,
	calid_nombre varchar(100) NOT NULL,
	calid_codigo varchar(15) NOT NULL,
	calid_descrip varchar(255) NOT NULL CONSTRAINT DF_Calidad_calid_descrip  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_Calidad_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Calidad_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Calidad_activo  DEFAULT (1),
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
CREATE TABLE Colmena(
	colm_id int NOT NULL,
	colm_codigo varchar(15) NOT NULL,
	colm_descrip varchar(255) NOT NULL,
	colm_poblacion smallint NOT NULL CONSTRAINT DF_Colmena_colm_poblacion  DEFAULT (0),
	colm_alimento smallint NOT NULL CONSTRAINT DF_Colmena_colm_alimento  DEFAULT (0),
	colm_criaHuevo smallint NOT NULL CONSTRAINT DF_Colmena_colm_criaHuevo  DEFAULT (0),
	colm_criaAbierta smallint NOT NULL CONSTRAINT DF_Colmena_colm_criaAbierta  DEFAULT (0),
	colm_criaOperculada smallint NOT NULL CONSTRAINT DF_Colmena_colm_criaOperculada  DEFAULT (0),
	colm_zanganera smallint NOT NULL CONSTRAINT DF_Colmena_colm_zanganera  DEFAULT (0),
	colm_fechaAlta timestamptz NOT NULL CONSTRAINT DF_Colmena_colm_fechaAlta  DEFAULT (getdate()),
	colm_tipo smallint NOT NULL CONSTRAINT DF_Colmena_colm_tipo  DEFAULT (0),
	creado timestamptz NOT NULL CONSTRAINT DF_Colmena_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Colmena_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Colmena_activo  DEFAULT (1),
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
CREATE TABLE Materia(
	mat_id int NOT NULL,
	mat_nombre varchar(100) NOT NULL,
	mat_codigo varchar(15) NOT NULL,
	mat_descrip varchar(255) NOT NULL CONSTRAINT DF_Materia_mat_descrip  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_Materia_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Materia_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Materia_activo  DEFAULT (1),
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
CREATE TABLE Historia(
	hst_id int  NOT NULL,
	hst_operacion smallint NOT NULL CONSTRAINT DF__Historia__hst_op__053F51A1  DEFAULT (0),
	hst_descrip varchar(7500) NULL CONSTRAINT DF_Historia_hst_descrip  DEFAULT (''),
	tbl_id int NOT NULL,
	id int NOT NULL,
	modifico int NOT NULL,
	modificado timestamptz NOT NULL CONSTRAINT DF_Historia_modificado  DEFAULT (getdate()),
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
CREATE TABLE Rol(
	rol_id int NOT NULL,
	rol_nombre varchar(100) NOT NULL,
	rol_descrip varchar(255) NOT NULL CONSTRAINT DF_Rol_rol_descrip  DEFAULT (''),
	modificado timestamptz NOT NULL CONSTRAINT DF_Rol_modificado  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_Rol_creado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Rol_activo  DEFAULT (1),
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
CREATE TABLE AFIPEsquema(
	afesq_id int NOT NULL,
	afesq_nombre varchar(100) NOT NULL,
	afesq_codigo varchar(15) NOT NULL,
	afesq_descrip varchar(255) NOT NULL CONSTRAINT DF_AFIPEsquema_afesq_descrip  DEFAULT (''),
	afesq_objetodll varchar(255) NOT NULL CONSTRAINT DF_AFIPEsquema_afesq_objetodll  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_AFIPEsquema_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_AFIPEsquema_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_AFIPEsquema_activo  DEFAULT (1),
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
CREATE TABLE ContraMarca(
	cmarc_id int NOT NULL,
	cmarc_nombre varchar(100) NOT NULL,
	cmarc_codigo varchar(15) NOT NULL,
	cmarc_descrip varchar(255) NOT NULL CONSTRAINT DF_ContraMarca_cmarc_descrip  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_ContraMarca_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ContraMarca_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_ContraMarca_activo  DEFAULT (1),
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
CREATE TABLE Moneda(
	mon_id int NOT NULL,
	mon_nombre varchar(100) NOT NULL,
	mon_codigo varchar(15) NOT NULL,
	mon_signo varchar(5) NOT NULL,
	mon_legal smallint NOT NULL CONSTRAINT DF_Moneda_mon_legal  DEFAULT (0),
	mon_codigodgi1 varchar(255) NOT NULL CONSTRAINT DF_Moneda_ti_codigodgi1  DEFAULT (''),
	mon_codigodgi2 varchar(255) NOT NULL CONSTRAINT DF_Moneda_ti_codigodgi2  DEFAULT (''),
	activo smallint NOT NULL CONSTRAINT DF_Moneda_activo  DEFAULT (1),
	modifico int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Moneda_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Moneda_modificado  DEFAULT (getdate()),
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
CREATE TABLE IngresosBrutosCategoria(
	ibc_id int NOT NULL,
	ibc_nombre varchar(100) NOT NULL,
	ibc_codigo varchar(15) NOT NULL,
	ibc_descrip varchar(255) NOT NULL CONSTRAINT DF_IngresosBrutosCategoria_ibc_descripcion  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_IngresosBrutosCategoria_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_IngresosBrutosCategoria_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE DocumentoDigital(
	dd_id int NOT NULL,
	dd_nombre varchar(255) NOT NULL,
	dd_codigo varchar(255) NULL,
	dd_formato varchar(10) NOT NULL,
	dd_fileName varchar(255) NOT NULL,
	dd_path varchar(255) NOT NULL,
	dd_file bytea NULL,
	dd_clientTable varchar(100) NOT NULL,
	dd_clientTableId int NOT NULL,
	dd_modificado timestamptz NOT NULL CONSTRAINT DF_DocumentoDigital_dd_modificado  DEFAULT (getdate()),
	dd_comprimido smallint NOT NULL CONSTRAINT DF_DocumentoDigital_dd_comprimido  DEFAULT (0),
	creado timestamptz NOT NULL CONSTRAINT DF_DocumentoDigital_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_DocumentoDigital_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE ProductoBOM(
	pbm_id int NOT NULL,
	pbm_nombre varchar(100) NOT NULL,
	pbm_codigo varchar(50) NOT NULL,
	pbm_descrip varchar(255) NOT NULL CONSTRAINT DF_ProductoBOM_bom_descrip  DEFAULT (''),
	pbm_fechaAuto timestamptz NOT NULL CONSTRAINT DF_ProductoBOM_bom_fechaAuto  DEFAULT ('19000101'),
	pbm_merma decimal(18, 6) NOT NULL CONSTRAINT DF_ProductoBOM_pbm_merma  DEFAULT (0),
	pbm_varpos decimal(18, 6) NOT NULL CONSTRAINT DF_ProductoBOM_pbm_varpos  DEFAULT (0),
	pbm_varneg decimal(18, 6) NOT NULL CONSTRAINT DF_ProductoBOM_pbm_varneg  DEFAULT (0),
	pbm_vartipo smallint NOT NULL CONSTRAINT DF_ProductoBOM_pbm_vartipo  DEFAULT (0),
	pbm_default smallint NOT NULL CONSTRAINT DF_ProductoBOM_pbm_default  DEFAULT (0),
	creado timestamptz NOT NULL CONSTRAINT DF_ProductoBOM_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ProductoBOM_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_ProductoBOM_activo  DEFAULT (1),
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
CREATE TABLE ImportacionProceso(
	impp_id int NOT NULL,
	impp_nombre varchar(100) NOT NULL,
	impp_codigo varchar(15) NOT NULL,
	impp_descrip varchar(255) NOT NULL CONSTRAINT DF_ImportacionProceso_impp_descrip  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_ImportacionProceso_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ImportacionProceso_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_ImportacionProceso_activo  DEFAULT (1),
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
CREATE TABLE TareaEstado(
	tarest_id int NOT NULL,
	tarest_nombre varchar(100) NOT NULL CONSTRAINT DF_TareaEstado_tarest_nombre  DEFAULT (''),
	tarest_codigo varchar(15) NOT NULL CONSTRAINT DF_TareaEstado_tarest_alias  DEFAULT (''),
	tarest_default smallint NOT NULL CONSTRAINT DF_TareaEstado_tarest_default  DEFAULT (0),
	creado timestamptz NOT NULL CONSTRAINT DF_TareaEstado_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_TareaEstado_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_TareaEstado_activo  DEFAULT (1),
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
CREATE TABLE Idioma(
	idm_id int NOT NULL,
	idm_nombre varchar(100) NOT NULL,
	idm_codigo varchar(15) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Idioma_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Idioma_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Idioma_activo  DEFAULT (1),
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
CREATE TABLE AFIPRegistro(
	afreg_id int NOT NULL,
	afreg_nombre varchar(100) NOT NULL,
	afreg_descrip varchar(255) NOT NULL CONSTRAINT DF_AFIPRegistro_afreg_descrip  DEFAULT (''),
	afreg_objetoproceso varchar(255) NOT NULL,
	afarch_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_AFIPRegistro_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_AFIPRegistro_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_AFIPRegistro_activo  DEFAULT (1),
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
CREATE TABLE EmpleadoPeriodo(
	empe_id int NOT NULL,
	empe_numero int NOT NULL CONSTRAINT DF_EmpleadoPeriodo_empe_numero  DEFAULT (0),
	empe_fecha timestamptz NOT NULL,
	empe_desde timestamptz NOT NULL,
	empe_hasta timestamptz NOT NULL,
	empe_tipo smallint NOT NULL,
	empe_descrip varchar(5000) NOT NULL CONSTRAINT DF_EmpleadoPeriodo_empe_descrip  DEFAULT (''),
	cico_id int NULL,
	ccos_id int NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_EmpleadoPeriodo_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_EmpleadoPeriodo_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE Profesor(
	prof_id int NOT NULL,
	prof_codigo varchar(50) NOT NULL,
	prof_legajo varchar(255) NOT NULL CONSTRAINT DF_Profesor_prof_legajo  DEFAULT (''),
	prof_fechaingreso timestamptz NOT NULL CONSTRAINT DF_Profesor_prof_fechaingreso  DEFAULT ('19000101'),
	prof_descrip varchar(5000) NOT NULL CONSTRAINT DF_Profesor_prof_descrip  DEFAULT (''),
	prs_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Profesor_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Profesor_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Profesor_activo  DEFAULT (1),
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
CREATE TABLE Empresa(
	emp_id int NOT NULL,
	emp_nombre varchar(255) NOT NULL,
	emp_codigo varchar(15) NOT NULL,
	emp_codigobarra varchar(255) NOT NULL CONSTRAINT DF_Empresa_emp_codigobarra  DEFAULT (''),
	emp_descrip varchar(255) NOT NULL CONSTRAINT DF_Empresa_emp_descrip  DEFAULT (''),
	emp_razonsocial varchar(255) NOT NULL CONSTRAINT DF_Empresa_prov_razonsocial  DEFAULT (''),
	emp_cuit varchar(50) NOT NULL CONSTRAINT DF_Empresa_prov_cuit  DEFAULT (''),
	emp_ingresosbrutos varchar(20) NOT NULL CONSTRAINT DF_Empresa_prov_ingresosbrutos  DEFAULT (''),
	emp_catfiscal smallint NOT NULL CONSTRAINT DF_Empresa_prov_catfiscal  DEFAULT (1),
	emp_chequeorden varchar(100) NOT NULL CONSTRAINT DF_Empresa_prov_chequeorden  DEFAULT (''),
	emp_codpostal varchar(50) NOT NULL CONSTRAINT DF_Empresa_prov_codpostal  DEFAULT (''),
	emp_localidad varchar(100) NOT NULL CONSTRAINT DF_Empresa_emp_localidad  DEFAULT (''),
	emp_calle varchar(100) NOT NULL CONSTRAINT DF_Empresa_prov_calle  DEFAULT (''),
	emp_callenumero varchar(100) NOT NULL CONSTRAINT DF_Empresa_prov_callenumero  DEFAULT ('s/n'),
	emp_piso varchar(100) NOT NULL CONSTRAINT DF_Empresa_prov_piso  DEFAULT ('PB'),
	emp_depto varchar(100) NOT NULL CONSTRAINT DF_Empresa_prov_depto  DEFAULT (''),
	emp_tel varchar(100) NOT NULL CONSTRAINT DF_Empresa_prov_tel  DEFAULT (''),
	emp_fax varchar(100) NOT NULL CONSTRAINT DF_Empresa_prov_fax  DEFAULT (''),
	emp_email varchar(100) NOT NULL CONSTRAINT DF_Empresa_prov_email  DEFAULT (''),
	emp_web varchar(100) NOT NULL CONSTRAINT DF_Empresa_prov_web  DEFAULT (''),
	emp_essucursal smallint NOT NULL CONSTRAINT DF_Empresa_emp_escasacentral  DEFAULT (0),
	creado timestamptz NOT NULL CONSTRAINT DF_Empresa_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Empresa_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Empresa_activo  DEFAULT (1),
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
CREATE TABLE LegajoTipo(
	lgjt_id int NOT NULL,
	lgjt_nombre varchar(100) NOT NULL,
	lgjt_codigo varchar(15) NOT NULL,
	lgjt_descrip varchar(255) NOT NULL,
	modificado timestamptz NOT NULL CONSTRAINT DF_LegajoTipo_modificado  DEFAULT (getdate()),
	creado timestamptz NOT NULL CONSTRAINT DF_LegajoTipo_creado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_LegajoTipo_activo  DEFAULT (1),
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
CREATE TABLE FacturaCompraOtroTMP(
	fcTMP_id int NOT NULL,
	fcotTMP_id int NOT NULL,
	fcot_id int NOT NULL,
	fcot_orden smallint NOT NULL CONSTRAINT DF_FacturaCompraOtroTMP_fcot_orden  DEFAULT (0),
	fcot_debe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraOtroTMP_fcot_debe  DEFAULT (0),
	fcot_haber decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraOtroTMP_fcot_haber  DEFAULT (0),
	fcot_origen decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraOtroTMP_fcot_origen  DEFAULT (0),
	fcot_descrip varchar(255) NOT NULL CONSTRAINT DF_FacturaCompraOtroTMP_fcot_descrip  DEFAULT (''),
	cue_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE FacturaCompraPercepcionBorradoTMP(
	fcTMP_id int NOT NULL,
	fcpercbTMP_id int NOT NULL,
	fc_id int NOT NULL,
	fcperc_id int NOT NULL,
 CONSTRAINT PK_FacturaCompraPercepcionBorradoTMP PRIMARY KEY  
(
	fcpercbTMP_id 
) 
) 
;
/****** Object:  Table FacturaCompraOtroBorradoTMP    Script Date: 07/30/2012 17:11:35 ******/

;

;
CREATE TABLE FacturaCompraOtroBorradoTMP(
	fcTMP_id int NOT NULL,
	fcotbTMP_id int NOT NULL,
	fc_id int NOT NULL,
	fcot_id int NOT NULL,
 CONSTRAINT PK_FacturaCompraOtroBorradoTMP PRIMARY KEY  
(
	fcotbTMP_id 
) 
) 
;
/****** Object:  Table FacturaCompraItemSerieBTMP    Script Date: 07/30/2012 17:11:09 ******/

;

;
CREATE TABLE FacturaCompraItemSerieBTMP(
	fcTMP_id int NOT NULL,
	fcisbTMP_id int NOT NULL,
	prns_id int NOT NULL CONSTRAINT DF_FacturaCompraItemSerieBTMP_prns_id  DEFAULT (0),
 CONSTRAINT PK_FacturaCompraItemSerieBTMP PRIMARY KEY  
(
	fcisbTMP_id 
) 
) 
;
/****** Object:  Table FacturaCompraItemBorradoTMP    Script Date: 07/30/2012 17:11:08 ******/

;

;
CREATE TABLE FacturaCompraItemBorradoTMP(
	fcTMP_id int NOT NULL,
	fcibTMP_id int NOT NULL,
	fc_id int NOT NULL,
	fci_id int NOT NULL,
 CONSTRAINT PK_FacturaCompraItemBorradoTMP PRIMARY KEY  
(
	fcibTMP_id 
) 
) 
;
/****** Object:  Table FacturaCompraLegajoBorradoTMP    Script Date: 07/30/2012 17:11:21 ******/

;

;
CREATE TABLE FacturaCompraLegajoBorradoTMP(
	fcTMP_id int NOT NULL,
	fclgjbTMP_id int NOT NULL,
	fc_id int NOT NULL,
	fclgj_id int NOT NULL,
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
CREATE TABLE FacturaCompraItemTMP(
	fcTMP_id int NOT NULL,
	fciTMP_id int NOT NULL,
	fci_id int NOT NULL,
	fci_orden smallint NOT NULL,
	fci_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItemTMP_fci_cantidad  DEFAULT (0),
	fci_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItemTMP_fci_cantidadaremitir  DEFAULT (0),
	fci_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItemTMP_fci_pendiente_1  DEFAULT (0),
	fci_descrip varchar(5000) NOT NULL CONSTRAINT DF_FacturaCompraItemTMP_fci_descrip  DEFAULT (''),
	fci_precio decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItemTMP_fci_precio  DEFAULT (0),
	fci_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItemTMP_fci_precioUsr  DEFAULT (0),
	fci_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItemTMP_fci_precioLista  DEFAULT (0),
	fci_descuento varchar(100) NOT NULL CONSTRAINT DF_FacturaCompraItemTMP_fci_descuento  DEFAULT (''),
	fci_neto decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItemTMP_fc_neto  DEFAULT (0),
	fci_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItemTMP_fci_ivari  DEFAULT (0),
	fci_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItemTMP_fci_ivarni  DEFAULT (0),
	fci_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItemTMP_fci_ivariporc  DEFAULT (0),
	fci_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItemTMP_fci_ivarniporc  DEFAULT (0),
	fci_internosporc decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItemTMP_fci_internosporc  DEFAULT (0),
	fci_internos decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItemTMP_fci_internos  DEFAULT (0),
	fci_importe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItemTMP_fci_importe  DEFAULT (0),
	fci_importeorigen decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraItemTMP_fci_importe1  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
	cue_id int NOT NULL,
	cue_id_ivari int NULL,
	cue_id_ivarni int NULL,
	to_id int NOT NULL CONSTRAINT DF__FacturaCo__to_id__0104AC69  DEFAULT (1),
	stl_codigo varchar(50) NOT NULL CONSTRAINT DF_FacturaCompraItemTMP_stl_codigo  DEFAULT (''),
	stl_id int NULL,
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
CREATE TABLE FacturaCompraLegajoTMP(
	fcTMP_id int NOT NULL,
	fclgjTMP_id int NOT NULL,
	fclgj_id int NOT NULL,
	fclgj_orden smallint NOT NULL,
	fclgj_importe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraLegajoTMP_fcljg_importe  DEFAULT (0),
	fclgj_importeorigen decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraLegajoTMP_fclgj_importe1  DEFAULT (0),
	fclgj_descrip varchar(255) NOT NULL CONSTRAINT DF_FacturaCompraLegajoTMP_fcljg_descrip  DEFAULT (''),
	lgj_id int NOT NULL,
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
CREATE TABLE ClientePercepcion(
	cli_id int NOT NULL,
	cliperc_id int NOT NULL,
	perc_id int NOT NULL,
	cliperc_desde timestamptz NOT NULL CONSTRAINT DF_ClientePercepcion_cliperc_desde  DEFAULT ('19000101'),
	cliperc_hasta timestamptz NOT NULL CONSTRAINT DF_ClientePercepcion_cliperc_hasta  DEFAULT ('21000101'),
	creado timestamptz NOT NULL CONSTRAINT DF_ClienteRetencion_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ClienteRetencion_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	cliperc_generadoporproceso smallint NOT NULL DEFAULT (0),
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
CREATE TABLE ProductoCliente(
	prcli_id int NOT NULL,
	prcli_nombre varchar(255) NOT NULL CONSTRAINT DF_ProductoCliente_prcli_nombre  DEFAULT (''),
	prcli_codigo varchar(50) NOT NULL CONSTRAINT DF_ProductoCliente_prcli_codigo  DEFAULT (''),
	prcli_codigobarra varchar(255) NOT NULL CONSTRAINT DF_ProductoCliente_prcli_codigobarra  DEFAULT (''),
	pr_id int NOT NULL,
	cli_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ProductoCliente_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ProductoCliente_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE DepartamentoCliente(
	dptocli_id int NOT NULL,
	cli_id int NOT NULL,
	dpto_id int NOT NULL,
 CONSTRAINT PK_DepartamentoCliente PRIMARY KEY  
(
	dptocli_id 
) 
) 
;
/****** Object:  Table PresupuestoDevolucionVenta    Script Date: 07/30/2012 17:23:52 ******/

;

;
CREATE TABLE PresupuestoDevolucionVenta(
	prvdv_id int NOT NULL,
	prvdv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoDevolucionVenta_prvdv_cantidad_1  DEFAULT (0),
	prvi_id_Presupuesto int NOT NULL,
	prvi_id_devolucion int NOT NULL,
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
CREATE TABLE GridViewFormula(
	grdv_id int NOT NULL,
	grdvf_id int NOT NULL,
	grdvf_columna varchar(255) NOT NULL,
	grdvf_formula smallint NOT NULL,
	grdvf_indice smallint NOT NULL,
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
CREATE TABLE GridViewColumn(
	grdv_id int NOT NULL,
	grdvc_id int NOT NULL,
	grdvc_nombre varchar(255) NOT NULL,
	grdvc_visible int NOT NULL,
	grdvc_width smallint NOT NULL,
	grdvc_index smallint NOT NULL,
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
CREATE TABLE GridViewFormato(
	grdv_id int NOT NULL,
	grdvfc_id int NOT NULL,
	grdvfc_columna varchar(255) NOT NULL,
	grdvfc_columna2 varchar(255) NOT NULL CONSTRAINT DF_GridViewFormato_grdvfc_columna2  DEFAULT (''),
	grdvfc_operador smallint NOT NULL,
	grdvfc_valor varchar(1000) NOT NULL,
	grdvfc_bgColor int NOT NULL,
	grdvfc_fColor int NOT NULL,
	grdvfc_fontName varchar(255) NOT NULL,
	grdvfc_fontSize decimal(9, 2) NOT NULL,
	grdvfc_fontStyle smallint NOT NULL,
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
CREATE TABLE GridViewGrupo(
	grdv_id int NOT NULL,
	grdvg_id int NOT NULL,
	grdvg_columna varchar(255) NOT NULL,
	grdvg_indice smallint NOT NULL,
	grdvg_orden smallint NOT NULL,
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
CREATE TABLE GridViewFiltro(
	grdv_id int NOT NULL,
	grdvfi_id int NOT NULL,
	grdvfi_columna varchar(255) NOT NULL,
	grdvfi_columna2 varchar(255) NOT NULL CONSTRAINT DF_GridViewFiltro_grdvfc_columna2  DEFAULT (''),
	grdvfi_operador smallint NOT NULL,
	grdvfi_valor varchar(1000) NOT NULL,
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
CREATE TABLE PedidoCompraItemTMP(
	pcTMP_id int NOT NULL,
	pciTMP_id int NOT NULL,
	pci_id int NOT NULL,
	pci_orden smallint NOT NULL,
	pci_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItemTMP_pci_cantidad  DEFAULT (0),
	pci_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItemTMP_pci_cantidadaremitir  DEFAULT (0),
	pci_pendiente decimal(18, 0) NOT NULL CONSTRAINT DF_PedidoCompraItemTMP_pci_pendiente  DEFAULT (0),
	pci_descrip varchar(5000) NOT NULL CONSTRAINT DF_PedidoCompraItemTMP_pci_descrip  DEFAULT (''),
	pci_precio decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItemTMP_pci_precio  DEFAULT (0),
	pci_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItemTMP_pci_precioUsr  DEFAULT (0),
	pci_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItemTMP_pci_precioLista  DEFAULT (0),
	pci_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItemTMP_pc_neto  DEFAULT (0),
	pci_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItemTMP_pci_ivari  DEFAULT (0),
	pci_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItemTMP_pci_ivarni  DEFAULT (0),
	pci_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItemTMP_pci_ivariporc  DEFAULT (0),
	pci_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItemTMP_pci_ivarniporc  DEFAULT (0),
	pci_importe decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoCompraItemTMP_pci_importe  DEFAULT (0),
	pr_id int NOT NULL,
	us_id int NULL,
	ccos_id int NULL,
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
CREATE TABLE PedidoDevolucionCompraTMP(
	pcTMP_id int NOT NULL,
	pcdcTMP_id int NOT NULL,
	pcdc_id int NOT NULL,
	pcdc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoDevolucionCompraTMP_pvdv_cantidad  DEFAULT (0),
	pci_id_pedido int NOT NULL,
	pci_id_devolucion int NOT NULL,
 CONSTRAINT PK_PedidoDevolucionCompraTMP PRIMARY KEY  
(
	pcdcTMP_id 
) 
) 
;
/****** Object:  Table PedidoCompraItemBorradoTMP    Script Date: 07/30/2012 17:21:25 ******/

;

;
CREATE TABLE PedidoCompraItemBorradoTMP(
	pcTMP_id int NOT NULL,
	pcibTMP_id int NOT NULL,
	pc_id int NOT NULL,
	pci_id int NOT NULL,
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
CREATE TABLE OrdenCompraItem(
	oc_id int NOT NULL,
	oci_id int NOT NULL,
	oci_orden smallint NOT NULL,
	oci_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItem_oci_cantidad  DEFAULT (0),
	oci_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItem_oci_cantidadaremitir  DEFAULT (0),
	oci_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItem_oci_pendiente  DEFAULT (0),
	oci_pendientefac decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItem_oci_pendientefac  DEFAULT (0),
	oci_descrip varchar(5000) NOT NULL CONSTRAINT DF_OrdenCompraItem_oci_descrip  DEFAULT (''),
	oci_precio decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItem_oci_precio  DEFAULT (0),
	oci_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItem_oci_precioUsr  DEFAULT (0),
	oci_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItem_oci_precioLista  DEFAULT (0),
	oci_descuento varchar(100) NOT NULL CONSTRAINT DF_OrdenCompraItem_oci_descuento  DEFAULT (''),
	oci_neto decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItem_oci_neto  DEFAULT (0),
	oci_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItem_oci_ivari  DEFAULT (0),
	oci_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItem_oci_ivarni  DEFAULT (0),
	oci_importe decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItem_oci_importe  DEFAULT (0),
	oci_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItem_oci_ivariporc  DEFAULT (0),
	oci_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItem_oci_ivarniporc  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE TablaItem(
	tbl_id int NOT NULL,
	tbli_id int NOT NULL,
	tbli_nombre varchar(255) NOT NULL,
	tbli_nombrefisico varchar(255) NOT NULL,
	tbli_tipo smallint NOT NULL,
	tbli_subtipo smallint NOT NULL CONSTRAINT DF_TablaItem_tbli_subtipo  DEFAULT (0),
	tbli_orden smallint NOT NULL CONSTRAINT DF_TablaItem_tbli_orden  DEFAULT (0),
	tbl_id_help int NULL,
	tbli_helptype smallint NOT NULL CONSTRAINT DF_TablaItem_tbli_helptype  DEFAULT (0),
	tbli_filtro varchar(255) NOT NULL CONSTRAINT DF_TablaItem_tbli_filtro  DEFAULT (''),
	tbli_defaultvalue varchar(255) NOT NULL CONSTRAINT DF_TablaItem_tbli_defaultvalue  DEFAULT (''),
	tbli_minvalue varchar(255) NOT NULL CONSTRAINT DF_TablaItem_tbli_minvalue  DEFAULT (''),
	tbli_maxvalue varchar(255) NOT NULL CONSTRAINT DF_TablaItem_tbli_maxvalue  DEFAULT (''),
	tbli_textalign smallint NOT NULL CONSTRAINT DF_TablaItem_tbli_textalign  DEFAULT (0),
	tbli_textmask varchar(255) NOT NULL CONSTRAINT DF_TablaItem_tbli_textmask  DEFAULT (''),
	tbli_format varchar(255) NOT NULL CONSTRAINT DF_TablaItem_tbli_format  DEFAULT (''),
	tbli_width smallint NOT NULL CONSTRAINT DF_TablaItem_tbli_width  DEFAULT (0),
	tbli_height smallint NOT NULL CONSTRAINT DF_TablaItem_tbli_height  DEFAULT (0),
	tbli_top smallint NOT NULL CONSTRAINT DF_TablaItem_tbli_top  DEFAULT (0),
	tbli_left smallint NOT NULL CONSTRAINT DF_TablaItem_tbli_left  DEFAULT (0),
	tbli_noshowbutton smallint NOT NULL CONSTRAINT DF_TablaItem_tbli_noshowbutton  DEFAULT (0),
	tbli_sqlstmt varchar(5000) NOT NULL CONSTRAINT DF_TablaItem_tbli_sqlstmt  DEFAULT (''),
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
CREATE TABLE EncuestaWebSeccion(
	ec_id int NOT NULL,
	ws_id int NOT NULL,
	ecws_id int NOT NULL,
 CONSTRAINT PK_EncuestaWebSeccion PRIMARY KEY  
(
	ecws_id 
) 
) 
;
/****** Object:  Table EncuestaDepartamento    Script Date: 07/30/2012 17:10:16 ******/

;

;
CREATE TABLE EncuestaDepartamento(
	ec_id int NOT NULL,
	dpto_id int NOT NULL,
	ecdpto_id int NOT NULL,
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
CREATE TABLE EmpleadoFamilia(
	emf_id int NOT NULL,
	emf_nombre varchar(255) NOT NULL,
	emf_apellido varchar(255) NOT NULL,
	emf_dni varchar(20) NOT NULL,
	emf_fechanacimiento timestamptz NOT NULL CONSTRAINT DF_EmpleadoFamilia_emf_fechanacimiento  DEFAULT (to_date('19000101','yyyymmdd')),
	emf_descrip varchar(1000) NOT NULL CONSTRAINT DF_EmpleadoFamilia_emf_descrip  DEFAULT (''),
	em_id int NOT NULL,
	emft_id int NOT NULL,
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
CREATE TABLE EmpleadoCentroCosto(
	emccos_id int NOT NULL,
	emccos_desde timestamptz NOT NULL,
	emccos_hasta timestamptz NOT NULL,
	ccos_id int NOT NULL,
	em_id int NOT NULL,
 CONSTRAINT PK_CentroCostoEmpleado PRIMARY KEY  
(
	emccos_id 
) 
) 
;
/****** Object:  Table ProductoDepositoFisico    Script Date: 07/30/2012 17:25:47 ******/

;

;
CREATE TABLE ProductoDepositoFisico(
	prdepf_id int NOT NULL,
	pr_id int NOT NULL,
	depf_id int NOT NULL,
	prdepf_x smallint NOT NULL CONSTRAINT DF_ProductoDepositoFisico_prdepf_x  DEFAULT (0),
	prdepf_y smallint NOT NULL CONSTRAINT DF_ProductoDepositoFisico_prdepf_y  DEFAULT (0),
	prdepf_z smallint NOT NULL CONSTRAINT DF_ProductoDepositoFisico_prdepf_z  DEFAULT (0),
	prdepf_stockminimo real NOT NULL CONSTRAINT DF_ProductoDepositoFisico_prdepf_stockminimo  DEFAULT (0),
	prdepf_stockmaximo real NOT NULL CONSTRAINT DF_ProductoDepositoFisico_prdepf_stockmaximo  DEFAULT (0),
	prdepf_reposicion real NOT NULL CONSTRAINT DF_ProductoDepositoFisico_prdepf_reposicion  DEFAULT (0),
 CONSTRAINT PK_ProductoDepositoFisico PRIMARY KEY  
(
	prdepf_id 
) 
) 
;
/****** Object:  Table PresupuestoVentaItemBorradoTMP    Script Date: 07/30/2012 17:24:48 ******/

;

;
CREATE TABLE PresupuestoVentaItemBorradoTMP(
	prvTMP_id int NOT NULL,
	prvibTMP_id int NOT NULL,
	prv_id int NOT NULL,
	prvi_id int NOT NULL,
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
CREATE TABLE PresupuestoVentaItemTMP(
	prvTMP_id int NOT NULL,
	prviTMP_id int NOT NULL,
	prvi_id int NOT NULL,
	prvi_orden smallint NOT NULL,
	prvi_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_cantidad  DEFAULT (0),
	prvi_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_cantidadaremitir  DEFAULT (0),
	prvi_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_pendiente  DEFAULT (0),
	prvi_descrip varchar(5000) NOT NULL CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_descrip  DEFAULT (''),
	prvi_precio decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_precio  DEFAULT (0),
	prvi_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_precioUsr  DEFAULT (0),
	prvi_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_precioLista  DEFAULT (0),
	prvi_descuento varchar(100) NOT NULL CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_descuento  DEFAULT (''),
	prvi_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItemTMP_prv_neto  DEFAULT (0),
	prvi_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_ivari  DEFAULT (0),
	prvi_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_ivarni  DEFAULT (0),
	prvi_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_ivariporc  DEFAULT (0),
	prvi_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_ivarniporc  DEFAULT (0),
	prvi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItemTMP_prvi_importe  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE EncuestaPregunta(
	ec_id int NOT NULL,
	ecp_id int NOT NULL,
	ecp_texto varchar(255) NOT NULL CONSTRAINT DF_EncuestaPregunta_ecp_texto  DEFAULT (''),
	ecp_multiple smallint NOT NULL CONSTRAINT DF_EncuestaPregunta_ecp_multiple  DEFAULT (0),
	ecp_orden smallint NOT NULL CONSTRAINT DF_EncuestaPregunta_ecp_orden  DEFAULT (0),
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
CREATE TABLE CashFlowItem(
	cf_id int NOT NULL,
	cfi_id int NOT NULL,
	cfi_fecha timestamptz NOT NULL,
	cfi_importe decimal(18, 6) NOT NULL,
	cfi_excluir smallint NOT NULL,
	cfi_tipo smallint NOT NULL CONSTRAINT DF_CashFlowItem_cfi_tipo  DEFAULT (0),
	doct_id int NOT NULL,
	comp_id int NOT NULL,
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
CREATE TABLE MailItem(
	mail_id int NOT NULL,
	maili_id int NOT NULL,
	maili_email varchar(1000) NOT NULL,
	maili_tiempo smallint NOT NULL,
	maili_tiempotipo smallint NOT NULL,
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
CREATE TABLE PercepcionItem(
	perc_id int NOT NULL,
	perci_id int NOT NULL,
	perci_importedesde decimal(18, 6) NOT NULL,
	perci_importehasta decimal(18, 6) NOT NULL,
	perci_porcentaje decimal(18, 6) NOT NULL,
	perci_importefijo decimal(18, 6) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_PercepcionItem_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_PercepcionItem_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE OrdenServicioSerieTMP(
	osTMP_id int NOT NULL,
	ossTMP_id int NOT NULL,
	oss_valor varchar(50) NOT NULL,
	prns_id int NOT NULL,
	edi_id int NOT NULL,
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
CREATE TABLE OrdenServicioItemBorradoTMP(
	osTMP_id int NOT NULL,
	osibTMP_id int NOT NULL,
	os_id int NOT NULL,
	osi_id int NOT NULL,
 CONSTRAINT PK_OrdenServicioItemBorradoTMP PRIMARY KEY  
(
	osibTMP_id 
) 
) 
;
/****** Object:  Table OrdenServicioItemSerieBTMP    Script Date: 07/30/2012 17:19:15 ******/

;

;
CREATE TABLE OrdenServicioItemSerieBTMP(
	osTMP_id int NOT NULL,
	osisbTMP_id int NOT NULL,
	prns_id int NOT NULL CONSTRAINT DF_OrdenServicioItemSerieBTMP_prns_id  DEFAULT (0),
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
CREATE TABLE OrdenServicioItemTMP(
	osTMP_id int NOT NULL,
	osiTMP_id int NOT NULL,
	osi_id int NOT NULL,
	osi_orden smallint NOT NULL,
	osi_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioItemTMP_osi_cantidad  DEFAULT (0),
	osi_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioItemTMP_osi_cantidadaremitir  DEFAULT (0),
	osi_pendiente decimal(18, 0) NOT NULL CONSTRAINT DF_OrdenServicioItemTMP_osi_pendiente  DEFAULT (0),
	osi_descrip varchar(5000) NOT NULL CONSTRAINT DF_OrdenServicioItemTMP_osi_descrip  DEFAULT (''),
	osi_precio decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioItemTMP_osi_precio  DEFAULT (0),
	osi_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioItemTMP_osi_precioUsr  DEFAULT (0),
	osi_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioItemTMP_osi_precioLista  DEFAULT (0),
	osi_descuento varchar(100) NOT NULL CONSTRAINT DF_OrdenServicioItemTMP_osi_descuento  DEFAULT (''),
	osi_neto decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioItemTMP_osi_neto  DEFAULT (0),
	osi_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioItemTMP_osi_ivari  DEFAULT (0),
	osi_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioItemTMP_osi_ivarni  DEFAULT (0),
	osi_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioItemTMP_osi_ivariporc  DEFAULT (0),
	osi_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioItemTMP_osi_ivarniporc  DEFAULT (0),
	osi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenServicioItemTMP_osi_importe  DEFAULT (0),
	osi_importCodigo varchar(255) NOT NULL CONSTRAINT DF__ordenserv__osi_i__30732EDC  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
	stl_codigo varchar(50) NOT NULL CONSTRAINT DF_OrdenServicioItemTMP_stl_codigo  DEFAULT (''),
	stl_id int NULL,
	tar_id int NULL,
	cont_id int NULL,
	etf_id int NULL,
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
CREATE TABLE OrdenServicioAlarmaTMP(
	osTMP_id int NOT NULL,
	osalTMP_id int NOT NULL,
	ali_id int NOT NULL,
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
CREATE TABLE ManifiestoCargaItem(
	mfc_id int NOT NULL,
	mfci_id int NOT NULL,
	mfci_orden smallint NOT NULL,
	mfci_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaItem_mfci_cantidad  DEFAULT (0),
	mfci_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaItem_mfci_pendiente  DEFAULT (0),
	mfci_pallets int NOT NULL,
	mfci_nropallet varchar(100) NOT NULL,
	mfci_descrip varchar(255) NOT NULL CONSTRAINT DF_ManifiestoCargaItem_mfci_descrip  DEFAULT (''),
	mfci_precio decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaItem_pklsti_precio  DEFAULT (0),
	mfci_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaItem_pklsti_precioUsr  DEFAULT (0),
	mfci_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaItem_pklsti_precioLista  DEFAULT (0),
	mfci_descuento varchar(100) NOT NULL CONSTRAINT DF_ManifiestoCargaItem_pklsti_descuento  DEFAULT (''),
	mfci_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaItem_pklsti_ivari  DEFAULT (0),
	mfci_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaItem_pklsti_ivarni  DEFAULT (0),
	mfci_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaItem_pklsti_ivariporc  DEFAULT (0),
	mfci_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaItem_pklsti_ivarniporc  DEFAULT (0),
	mfci_importe decimal(18, 6) NOT NULL CONSTRAINT DF_ManifiestoCargaItem_pklsti_importe  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE PresupuestoVentaItem(
	prv_id int NOT NULL,
	prvi_id int NOT NULL,
	prvi_orden smallint NOT NULL,
	prvi_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItem_prvi_cantidad  DEFAULT (0),
	prvi_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItem_prvi_cantidadaremitir  DEFAULT (0),
	prvi_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItem_prvi_pendiente  DEFAULT (0),
	prvi_descrip varchar(5000) NOT NULL CONSTRAINT DF_PresupuestoVentaItem_prvi_descrip  DEFAULT (''),
	prvi_precio decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItem_prvi_precio  DEFAULT (0),
	prvi_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItem_prvi_precioUsr  DEFAULT (0),
	prvi_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItem_prvi_precioLista  DEFAULT (0),
	prvi_descuento varchar(100) NOT NULL CONSTRAINT DF_PresupuestoVentaItem_prvi_descuento  DEFAULT (''),
	prvi_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItem_prv_neto  DEFAULT (0),
	prvi_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItem_prvi_ivari  DEFAULT (0),
	prvi_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItem_prvi_ivarni  DEFAULT (0),
	prvi_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItem_prvi_ivariporc  DEFAULT (0),
	prvi_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItem_prvi_ivarniporc  DEFAULT (0),
	prvi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_PresupuestoVentaItem_prvi_importe  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE CotizacionCompraItem(
	cot_id int NOT NULL,
	coti_id int NOT NULL,
	coti_orden smallint NOT NULL,
	coti_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItem_coti_cantidad  DEFAULT (0),
	coti_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItem_coti_pendiente  DEFAULT (0),
	coti_pendienteOc decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItem_coti_pendienteOc  DEFAULT (0),
	coti_descrip varchar(5000) NOT NULL CONSTRAINT DF_CotizacionCompraItem_coti_descrip  DEFAULT (''),
	coti_precio decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItem_coti_precio  DEFAULT (0),
	coti_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItem_coti_precioUsr  DEFAULT (0),
	coti_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItem_coti_precioLista  DEFAULT (0),
	coti_descuento varchar(100) NOT NULL CONSTRAINT DF_CotizacionCompraItem_coti_descuento  DEFAULT (''),
	coti_neto decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItem_cot_neto  DEFAULT (0),
	coti_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItem_coti_ivari  DEFAULT (0),
	coti_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItem_coti_ivarni  DEFAULT (0),
	coti_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItem_coti_ivariporc  DEFAULT (0),
	coti_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItem_coti_ivarniporc  DEFAULT (0),
	coti_importe decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItem_coti_importe  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE FacturaCompraPercepcion(
	fc_id int NOT NULL,
	fcperc_id int NOT NULL,
	fcperc_orden smallint NOT NULL CONSTRAINT DF_FacturaCompraPercepcion_fcperc_orden  DEFAULT (0),
	fcperc_base decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraPercepcion_fcperc_base  DEFAULT (0),
	fcperc_porcentaje decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraPercepcion_fcperc_porcentaje  DEFAULT (0),
	fcperc_importe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraPercepcion_fcperc_importe  DEFAULT (0),
	fcperc_origen decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraPercepcion_fcperc_origen  DEFAULT (0),
	fcperc_descrip varchar(255) NOT NULL CONSTRAINT DF_FacturaCompraPercepcion_fcperc_descrip  DEFAULT (''),
	perc_id int NOT NULL,
	ccos_id int NULL
) 
;

;
/****** Object:  Table ExpoGrupoPrecioIdioma    Script Date: 07/30/2012 17:10:41 ******/

;

;

;
CREATE TABLE ExpoGrupoPrecioIdioma(
	egp_id int NOT NULL,
	egpidm_id int NOT NULL,
	egpidm_texto varchar(5000) NOT NULL CONSTRAINT DF_ExpoGrupoPrecioIdioma_lpi_precio  DEFAULT (0),
	idm_id int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_ExpoGrupoPrecioIdioma_activo  DEFAULT (1),
	creado timestamptz NOT NULL CONSTRAINT DF_ExpoGrupoPrecioIdioma_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ExpoGrupoPrecioIdioma_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE ParteProdKitItemA(
	ppki_id int NOT NULL,
	ppkia_id int NOT NULL,
	ppkia_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_ParteProdKitItemA_ppkia_cantidad  DEFAULT (0),
	pr_id int NOT NULL,
	prk_id int NOT NULL,
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
CREATE TABLE ProductoLeyenda(
	pr_id int NOT NULL,
	prl_id int NOT NULL,
	prl_nombre varchar(100) NOT NULL,
	prl_texto varchar(5000) NOT NULL,
	prl_tag varchar(50) NOT NULL CONSTRAINT DF_ProductoLeyenda_prl_tag  DEFAULT (''),
	prl_orden varchar(50) NOT NULL CONSTRAINT DF_ProductoLeyenda_prl_orden  DEFAULT (''),
	creado timestamptz NOT NULL CONSTRAINT DF_ProductoLeyenda_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ProductoLeyenda_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE ProductoKitItemA(
	prka_id int NOT NULL,
	prk_id int NOT NULL,
	pr_id int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_ProductoKitItemA_activo  DEFAULT (1),
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
CREATE TABLE ProductoFormulaKit(
	prfk_id int NOT NULL,
	prfk_nombre varchar(255) NOT NULL,
	prfk_codigo varchar(15) NOT NULL,
	prfk_default smallint NOT NULL CONSTRAINT DF_ProductoFormulaKit_prfk_default  DEFAULT (0),
	prfk_descrip varchar(2000) NOT NULL CONSTRAINT DF_ProductoFormulaKit_pr_descripventa  DEFAULT (''),
	pr_id int NOT NULL,
	pr_id_serie int NULL,
	pr_id_lote int NULL,
	activo smallint NOT NULL CONSTRAINT DF_ProductoFormulaKit_activo  DEFAULT (1),
	creado timestamptz NOT NULL CONSTRAINT DF_ProductoFormulaKit_creado  DEFAULT (getdate()),
	modifico int NOT NULL,
	modificado timestamptz NOT NULL CONSTRAINT DF_ProductoFormulaKit_modificado  DEFAULT (getdate()),
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
CREATE TABLE StockValorItem(
	stv_id int NOT NULL,
	stvi_id int NOT NULL,
	stvi_cantidad decimal(18, 6) NOT NULL,
	stvi_costo decimal(18, 6) NOT NULL,
	pr_id int NOT NULL,
 CONSTRAINT stvi_id_PK PRIMARY KEY  
(
	stvi_id 
) 
) 
;
/****** Object:  Table AlarmaDiaMes    Script Date: 07/30/2012 17:02:50 ******/

;

;
CREATE TABLE AlarmaDiaMes(
	al_id int NOT NULL,
	aldm_id int NOT NULL,
	aldm_dia smallint NOT NULL,
	aldm_desdehora smallint NOT NULL,
	aldm_desdeminuto smallint NOT NULL,
	aldm_hastahora smallint NOT NULL,
	aldm_hastaminuto smallint NOT NULL,
	aldm_activo smallint NOT NULL,
 CONSTRAINT PK_AlarmaDiaMes PRIMARY KEY  
(
	aldm_id 
) 
) 
;
/****** Object:  Table AlarmaDiaSemana    Script Date: 07/30/2012 17:02:52 ******/

;

;
CREATE TABLE AlarmaDiaSemana(
	al_id int NOT NULL,
	alds_id int NOT NULL,
	alds_dia smallint NOT NULL,
	alds_desdehora smallint NOT NULL,
	alds_desdeminuto smallint NOT NULL,
	alds_hastahora smallint NOT NULL,
	alds_hastaminuto smallint NOT NULL,
	alds_activo smallint NOT NULL,
 CONSTRAINT PK_AlarmaDiaSemana PRIMARY KEY  
(
	alds_id 
) 
) 
;
/****** Object:  Table AlarmaFecha    Script Date: 07/30/2012 17:02:54 ******/

;

;
CREATE TABLE AlarmaFecha(
	al_id int NOT NULL,
	alf_id int NOT NULL,
	alf_fecha timestamptz NOT NULL,
	alf_desdehora smallint NOT NULL,
	alf_desdeminuto smallint NOT NULL,
	alf_hastahora smallint NOT NULL,
	alf_hastaminuto smallint NOT NULL,
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
CREATE TABLE Calle(
	calle_id int NOT NULL,
	calle_nombre varchar(255) NOT NULL,
	calle_codigo varchar(15) NOT NULL,
	calle_descrip varchar(255) NOT NULL CONSTRAINT DF_Calle_calle_descrip  DEFAULT (''),
	calle_localidad varchar(255) NOT NULL CONSTRAINT DF_Calle_calle_localidad  DEFAULT (''),
	ciu_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_Calle_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_Calle_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_Calle_activo  DEFAULT (1),
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
CREATE TABLE PermisoEmbarqueItemBorradoTMP(
	pembTMP_id int NOT NULL,
	pembibTMP_id int NOT NULL,
	pemb_id int NOT NULL,
	pembi_id int NOT NULL,
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
CREATE TABLE PermisoEmbarqueItemTMP(
	pembTMP_id int NOT NULL,
	pembiTMP_id int NOT NULL,
	pembi_id int NOT NULL,
	pembi_orden smallint NOT NULL,
	pembi_cantidad decimal(18, 6) NOT NULL,
	pembi_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PermisoEmbarqueItemTMP_pembi_pendiente  DEFAULT (0),
	pembi_foborigen decimal(18, 6) NOT NULL CONSTRAINT DF_PermisoEmbarqueItemTMP_pembi_foborigen  DEFAULT (0),
	pembi_fobtotalorigen decimal(18, 6) NOT NULL CONSTRAINT DF_PermisoEmbarqueItemTMP_pembi_fobtotalorigen  DEFAULT (0),
	pembi_fob decimal(18, 6) NOT NULL,
	pembi_fobtotal decimal(18, 6) NOT NULL,
	pembi_descrip varchar(255) NOT NULL CONSTRAINT DF_PermisoEmbarqueItemTMP_pembi_descrip  DEFAULT (''),
	pr_id int NOT NULL,
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
CREATE TABLE ImportacionTempGarantiaTMP(
	imptTMP_id int NOT NULL,
	imptgTMP_id int NOT NULL,
	imptg_id int NOT NULL CONSTRAINT DF_ImportacionTempGarantiaTMP_imptg_id  DEFAULT (0),
	imptg_orden smallint NOT NULL,
	gar_id int NOT NULL,
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
CREATE TABLE ImportacionTempItemTMP(
	imptTMP_id int NOT NULL,
	imptiTMP_id int NOT NULL,
	impti_id int NOT NULL,
	impti_orden smallint NOT NULL,
	impti_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItemTMP_impti_cantidad  DEFAULT (0),
	impti_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItemTMP_impti_cantidadaremitir  DEFAULT (0),
	impti_descrip varchar(5000) NOT NULL CONSTRAINT DF_ImportacionTempItemTMP_impti_descrip  DEFAULT (''),
	impti_precio decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItemTMP_impti_precio  DEFAULT (0),
	impti_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItemTMP_impti_precioUsr  DEFAULT (0),
	impti_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItemTMP_impti_precioLista  DEFAULT (0),
	impti_descuento varchar(100) NOT NULL CONSTRAINT DF_ImportacionTempItemTMP_impti_descuento  DEFAULT (''),
	impti_neto decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItemTMP_impti_neto  DEFAULT (0),
	impti_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItemTMP_impti_ivari  DEFAULT (0),
	impti_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItemTMP_impti_ivarni  DEFAULT (0),
	impti_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItemTMP_impti_ivariporc  DEFAULT (0),
	impti_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItemTMP_impti_ivarniporc  DEFAULT (0),
	impti_importe decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItemTMP_impti_importe  DEFAULT (0),
	impti_seguro decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItemTMP_impti_seguro  DEFAULT (0),
	impti_flete decimal(18, 6) NOT NULL CONSTRAINT DF_ImportacionTempItemTMP_impti_flete  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE ImportacionTempItemBorradoTMP(
	imptTMP_id int NOT NULL,
	imptibTMP_id int NOT NULL,
	impt_id int NOT NULL,
	impti_id int NOT NULL,
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
CREATE TABLE PackingListItemTMP(
	pklstTMP_id int NOT NULL,
	pklstiTMP_id int NOT NULL,
	pklsti_id int NOT NULL,
	pklsti_orden smallint NOT NULL,
	pklsti_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItemTMP_pklsti_cantidad  DEFAULT (0),
	pklsti_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItemTMP_pklsti_pendiente  DEFAULT (0),
	pklsti_pendientefac decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItemTMP_pklsti_pendientefac  DEFAULT (0),
	pklsti_pallets int NOT NULL,
	pklsti_seguro decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItemTMP_pklsti_seguro  DEFAULT (0),
	pklsti_descrip varchar(255) NOT NULL CONSTRAINT DF_PackingListItemTMP_pklsti_descrip  DEFAULT (''),
	pklsti_precio decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItemTMP_pklsti_precio  DEFAULT (0),
	pklsti_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItemTMP_pklsti_precioUsr  DEFAULT (0),
	pklsti_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItemTMP_pklsti_precioLista  DEFAULT (0),
	pklsti_descuento varchar(100) NOT NULL CONSTRAINT DF_PackingListItemTMP_pklsti_descuento  DEFAULT (''),
	pklsti_neto decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItemTMP_pklsti_neto  DEFAULT (0),
	pklsti_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItemTMP_pklsti_ivari  DEFAULT (0),
	pklsti_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItemTMP_pklsti_ivarni  DEFAULT (0),
	pklsti_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItemTMP_pklsti_ivariporc  DEFAULT (0),
	pklsti_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItemTMP_pklsti_ivarniporc  DEFAULT (0),
	pklsti_importe decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItemTMP_pklsti_importe  DEFAULT (0),
	pklsti_cajadesde smallint NOT NULL CONSTRAINT DF_PackingListItemTMP_pklsti_cajadesde  DEFAULT (0),
	pklsti_cajahasta smallint NOT NULL CONSTRAINT DF_PackingListItemTMP_pklsti_cajahasta  DEFAULT (0),
	pklsti_pesoneto decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItemTMP_pklsti_pesoneto  DEFAULT (0),
	pklsti_pesototal decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListItemTMP_pklsti_pesototal  DEFAULT (0),
	pklsti_grupoexpo varchar(100) NOT NULL CONSTRAINT DF_PackingListItemTMP_pklsti_grupoexpo  DEFAULT (''),
	ccos_id int NULL,
	pr_id int NOT NULL,
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
CREATE TABLE PackingListDevolucionTMP(
	pklstTMP_id int NOT NULL,
	pklstdvTMP_id int NOT NULL,
	pklstdv_id int NOT NULL,
	pklstdv_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PackingListDevolucionTMP_pklstdv_cantidad  DEFAULT (0),
	pklsti_id_pklst int NOT NULL,
	pklsti_id_devolucion int NOT NULL,
 CONSTRAINT PK_PackingListDevolucionTMP PRIMARY KEY  
(
	pklstdvTMP_id 
) 
) 
;
/****** Object:  Table PackingListItemBorradoTMP    Script Date: 07/30/2012 17:19:57 ******/

;

;
CREATE TABLE PackingListItemBorradoTMP(
	pklstTMP_id int NOT NULL,
	pklstibTMP_id int NOT NULL,
	pklst_id int NOT NULL,
	pklsti_id int NOT NULL,
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
CREATE TABLE ReporteParametro(
	rptp_id int NOT NULL,
	rptp_valor varchar(255) NOT NULL,
	rptp_visible smallint NOT NULL CONSTRAINT DF_ReporteParametro_rptp_visible  DEFAULT (0),
	rpt_id int NOT NULL,
	infp_id int NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_ReporteParametro_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_ReporteParametro_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
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
CREATE TABLE ParteReparacionItemTMP(
	prpTMP_id int NOT NULL,
	prpiTMP_id int NOT NULL,
	prpi_id int NOT NULL,
	prpi_orden smallint NOT NULL,
	prpi_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionItemTMP_prpi_cantidad  DEFAULT (0),
	prpi_descrip varchar(5000) NOT NULL CONSTRAINT DF_ParteReparacionItemTMP_prpi_descrip  DEFAULT (''),
	prpi_precio decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionItemTMP_prpi_precio  DEFAULT (0),
	prpi_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionItemTMP_prpi_precioUsr  DEFAULT (0),
	prpi_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionItemTMP_prpi_precioLista  DEFAULT (0),
	prpi_descuento varchar(100) NOT NULL CONSTRAINT DF_ParteReparacionItemTMP_prpi_descuento  DEFAULT (''),
	prpi_neto decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionItemTMP_prpi_neto  DEFAULT (0),
	prpi_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionItemTMP_prpi_ivari  DEFAULT (0),
	prpi_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionItemTMP_prpi_ivarni  DEFAULT (0),
	prpi_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionItemTMP_prpi_ivariporc  DEFAULT (0),
	prpi_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionItemTMP_prpi_ivarniporc  DEFAULT (0),
	prpi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_ParteReparacionItemTMP_prpi_importe  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
	stl_id int NULL,
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
CREATE TABLE ParteReparacionItemBorradoTMP(
	prpTMP_id int NOT NULL,
	prpibTMP_id int NOT NULL,
	prp_id int NOT NULL,
	prpi_id int NOT NULL,
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
CREATE TABLE FacturaCompraLegajo(
	fc_id int NOT NULL,
	fclgj_id int NOT NULL,
	fclgj_orden smallint NOT NULL,
	fclgj_importe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraLegajo_fcljg_importe  DEFAULT (0),
	fclgj_importeorigen decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraLegajo_fclgj_importe1  DEFAULT (0),
	fclgj_descrip varchar(255) NOT NULL CONSTRAINT DF_FacturaCompraLegajo_fcljg_descrip  DEFAULT (''),
	lgj_id int NOT NULL,
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
CREATE TABLE DepositoBancoItemBorradoTMP(
	dbcoTMP_id int NOT NULL,
	dbcoibTMP_id int NOT NULL,
	dbco_id int NOT NULL,
	dbcoi_id int NOT NULL,
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
CREATE TABLE DepositoBancoItemTMP(
	dbcoTMP_id int NOT NULL,
	dbcoiTMP_id int NOT NULL,
	dbcoi_id int NOT NULL CONSTRAINT DF_DepositoBancoItemTMP_dbcoi_id  DEFAULT (0),
	dbcoi_orden smallint NOT NULL,
	dbcoi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_DepositoBancoItemTMP_dbcoi_importe  DEFAULT (0),
	dbcoi_importeorigen decimal(18, 6) NOT NULL CONSTRAINT DF_DepositoBancoItemTMP_dbcoi_importeorigen  DEFAULT (0),
	dbcoi_descrip varchar(5000) NOT NULL CONSTRAINT DF_DepositoBancoItemTMP_dbcoi_descrip  DEFAULT (''),
	dbcoi_tipo smallint NOT NULL CONSTRAINT DF_DepositoBancoItemTMP_dbcoi_tipo  DEFAULT (0),
	dbcoiTMP_cheque varchar(50) NOT NULL CONSTRAINT DF_DepositoBancoItemTMP_dbcoiTMP_cheque  DEFAULT (''),
	dbcoiTMP_fechacobro timestamptz NOT NULL CONSTRAINT DF_DepositoBancoItemTMP_dbcoiTMP_fechacobro  DEFAULT (getdate()),
	dbcoiTMP_fechavto timestamptz NOT NULL CONSTRAINT DF_DepositoBancoItemTMP_dbcoiTMP_fechavto  DEFAULT (getdate()),
	cue_id int NULL,
	cheq_id int NULL,
	cle_id int NULL,
	chq_id int NULL,
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
CREATE TABLE DespachoImpCalculoItem(
	dic_id int NOT NULL,
	dici_id int NOT NULL,
	dici_codigo int NOT NULL,
	dici_valor decimal(18, 6) NOT NULL CONSTRAINT DF_DespachoImpCalculoItem_dici_valor  DEFAULT (0),
	dici_importe decimal(18, 6) NOT NULL,
	dici_porc varchar(50) NOT NULL CONSTRAINT DF_DespachoImpCalculoItem_dici_porc  DEFAULT (0),
	dici_descrip varchar(255) NOT NULL CONSTRAINT DF_DespachoImpCalculoItem_dici_descrip  DEFAULT (''),
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
CREATE TABLE DespachoImpCalculoPosicionArancel(
	dic_id int NOT NULL,
	dicp_id int NOT NULL,
	dicp_derechos decimal(18, 6) NOT NULL CONSTRAINT DF_DespachoImpPosicionArancel_dicp_derechos  DEFAULT (0),
	dicp_estadisticas decimal(18, 6) NOT NULL CONSTRAINT DF_DespachoImpPosicionArancel_dicp_estadisticas  DEFAULT (0),
	dicp_iva decimal(18, 6) NOT NULL CONSTRAINT DF_DespachoImpPosicionArancel_dicp_iva  DEFAULT (0),
	dicp_iva3431 decimal(18, 6) NOT NULL CONSTRAINT DF_DespachoImpPosicionArancel_dicp_iva3431  DEFAULT (0),
	dicp_ganancias decimal(18, 6) NOT NULL CONSTRAINT DF_DespachoImpPosicionArancel_dicp_ganancias  DEFAULT (0),
	dicp_igb decimal(18, 6) NOT NULL CONSTRAINT DF_DespachoImpPosicionArancel_dicp_igb  DEFAULT (0),
	dicp_gastoenvio decimal(18, 6) NOT NULL CONSTRAINT DF_DespachoImpPosicionArancel_dicp_gastoenvio  DEFAULT (0),
	poar_id int NOT NULL,
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
CREATE TABLE SindicatoCategoria(
	sindca_id int NOT NULL,
	sind_id int NOT NULL,
	sindca_nombre varchar(100) NOT NULL,
	sindca_codigo varchar(50) NOT NULL,
	sindca_descrip varchar(255) NOT NULL,
	creado timestamptz NOT NULL CONSTRAINT DF_SindicatoCategoria_creado  DEFAULT (getdate()),
	modificado timestamptz NOT NULL CONSTRAINT DF_SindicatoCategoria_modificado  DEFAULT (getdate()),
	modifico int NOT NULL,
	activo smallint NOT NULL CONSTRAINT DF_SindicatoCategoria_activo  DEFAULT (1),
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
CREATE TABLE SindicatoConvenio(
	sindco_id int NOT NULL,
	sind_id int NOT NULL,
	sindco_nombre varchar(100) NULL,
	sindco_codigo varchar(15) NULL,
	sindco_descrip varchar(255) NULL,
	creado timestamptz NULL CONSTRAINT DF_SindicatoConvenio_creado  DEFAULT (getdate()),
	modificado timestamptz NULL CONSTRAINT DF_SindicatoConvenio_modificado  DEFAULT (getdate()),
	modifico int NULL,
	activo smallint NULL CONSTRAINT DF_SindicatoConvenio_activo  DEFAULT (1),
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
CREATE TABLE CotizacionCompraItemBorradoTMP(
	cotTMP_id int NOT NULL,
	cotibTMP_id int NOT NULL,
	cot_id int NOT NULL,
	coti_id int NOT NULL,
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
CREATE TABLE CotizacionCompraItemTMP(
	cotTMP_id int NOT NULL,
	cotiTMP_id int NOT NULL,
	coti_id int NOT NULL,
	coti_orden smallint NOT NULL,
	coti_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItemTMP_coti_cantidad  DEFAULT (0),
	coti_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItemTMP_coti_pendiente  DEFAULT (0),
	coti_pendienteOc decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItemTMP_coti_pendienteOc  DEFAULT (0),
	coti_descrip varchar(5000) NOT NULL CONSTRAINT DF_CotizacionCompraItemTMP_coti_descrip  DEFAULT (''),
	coti_precio decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItemTMP_coti_precio  DEFAULT (0),
	coti_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItemTMP_coti_precioUsr  DEFAULT (0),
	coti_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItemTMP_coti_precioLista  DEFAULT (0),
	coti_descuento varchar(100) NOT NULL CONSTRAINT DF_CotizacionCompraItemTMP_coti_descuento  DEFAULT (''),
	coti_neto decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItemTMP_cot_neto  DEFAULT (0),
	coti_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItemTMP_coti_ivari  DEFAULT (0),
	coti_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItemTMP_coti_ivarni  DEFAULT (0),
	coti_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItemTMP_coti_ivariporc  DEFAULT (0),
	coti_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItemTMP_coti_ivarniporc  DEFAULT (0),
	coti_importe decimal(18, 6) NOT NULL CONSTRAINT DF_CotizacionCompraItemTMP_coti_importe  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE PedidoDevolucionCompra(
	pcdc_id int NOT NULL,
	pcdc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoDevolucionCompra_pvdv_cantidad  DEFAULT (0),
	pci_id_pedido int NOT NULL,
	pci_id_devolucion int NOT NULL,
 CONSTRAINT PK_PedidoDevolucionCompra PRIMARY KEY  
(
	pcdc_id 
) 
) 
;
/****** Object:  Table PedidoOrdenCompra    Script Date: 07/30/2012 17:21:46 ******/

;

;
CREATE TABLE PedidoOrdenCompra(
	pcoc_id int NOT NULL,
	pcoc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_PedidoOrdenCompra_pcoc_cantidad  DEFAULT (0),
	pci_id int NOT NULL,
	oci_id int NOT NULL,
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
CREATE TABLE ResolucionCuponItemTMP(
	rcupTMP_id int NOT NULL,
	rcupiTMP_id int NOT NULL,
	rcupi_id int NOT NULL CONSTRAINT DF_ResolucionCuponItemTMP_rcupi_id  DEFAULT (0),
	rcupi_orden smallint NOT NULL,
	rcupi_cuota smallint NOT NULL CONSTRAINT DF_ResolucionCuponItemTMP_rcupi_cuota  DEFAULT (0),
	rcupi_comision decimal(18, 6) NOT NULL CONSTRAINT DF_ResolucionCuponItemTMP_rcupi_comision  DEFAULT (0),
	rcupi_importe decimal(18, 6) NOT NULL CONSTRAINT DF_ResolucionCuponItemTMP_rcupi_importe  DEFAULT (0),
	rcupi_importeorigen decimal(18, 6) NOT NULL CONSTRAINT DF_ResolucionCuponItemTMP_rcupi_importeorigen  DEFAULT (0),
	rcupi_descrip varchar(5000) NOT NULL CONSTRAINT DF_ResolucionCuponItemTMP_rcupi_descrip  DEFAULT (''),
	rcupi_rechazado smallint NOT NULL CONSTRAINT DF_ResolucionCuponItemTMP_rcupi_rechazado  DEFAULT (0),
	cue_id int NULL,
	tjcc_id int NULL,
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
CREATE TABLE ResolucionCuponItemBorradoTMP(
	rcupTMP_id int NOT NULL,
	rcupibTMP_id int NOT NULL,
	rcup_id int NOT NULL,
	rcupi_id int NOT NULL,
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
CREATE TABLE RemitoCompraItemTMP(
	rcTMP_id int NOT NULL,
	rciTMP_id int NOT NULL,
	rci_id int NOT NULL,
	rci_orden smallint NOT NULL,
	rci_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItemTMP_rci_cantidad  DEFAULT (0),
	rci_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItemTMP_rci_cantidadaremitir  DEFAULT (0),
	rci_pendiente decimal(18, 6) NULL CONSTRAINT DF_RemitoCompraItemTMP_rci_pendiente  DEFAULT (0),
	rci_pendientefac decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItemTMP_rci_pendientefac  DEFAULT (0),
	rci_descrip varchar(5000) NOT NULL CONSTRAINT DF_RemitoCompraItemTMP_rci_descrip  DEFAULT (''),
	rci_precio decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItemTMP_rci_precio  DEFAULT (0),
	rci_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItemTMP_rci_precioUsr  DEFAULT (0),
	rci_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItemTMP_rci_precioLista  DEFAULT (0),
	rci_descuento varchar(100) NOT NULL CONSTRAINT DF_RemitoCompraItemTMP_rci_descuento  DEFAULT (''),
	rci_neto decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItemTMP_rci_neto  DEFAULT (0),
	rci_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItemTMP_rci_ivari  DEFAULT (0),
	rci_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItemTMP_rci_ivarni  DEFAULT (0),
	rci_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItemTMP_rci_ivariporc  DEFAULT (0),
	rci_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItemTMP_rci_ivarniporc  DEFAULT (0),
	rci_importe decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoCompraItemTMP_rci_importe  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
	stl_codigo varchar(50) NOT NULL CONSTRAINT DF_RemitoCompraItemTMP_stl_codigo  DEFAULT (''),
	stl_id int NULL,
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
CREATE TABLE RemitoCompraItemBorradoTMP(
	rcTMP_id int NOT NULL,
	rcibTMP_id int NOT NULL,
	rc_id int NOT NULL,
	rci_id int NOT NULL,
 CONSTRAINT PK_RemitoCompraItemBorradoTMP PRIMARY KEY  
(
	rcibTMP_id 
) 
) 
;
/****** Object:  Table RemitoDevolucionCompraTMP    Script Date: 07/30/2012 17:28:14 ******/

;

;
CREATE TABLE RemitoDevolucionCompraTMP(
	rcTMP_id int NOT NULL,
	rcdcTMP_id int NOT NULL,
	rcdc_id int NOT NULL,
	rcdc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_RemitoDevolucionCompraTMP_rvrd_cantidad  DEFAULT (0),
	rci_id_remito int NOT NULL,
	rci_id_devolucion int NOT NULL,
 CONSTRAINT PK_RemitoDevolucionCompraTMP PRIMARY KEY  
(
	rcdcTMP_id 
) 
) 
;
/****** Object:  Table OrdenDevolucionCompra    Script Date: 07/30/2012 17:18:09 ******/

;

;
CREATE TABLE OrdenDevolucionCompra(
	ocdc_id int NOT NULL,
	ocdc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenDevolucionCompra_ocdc_cantidad  DEFAULT (0),
	oci_id_Orden int NOT NULL,
	oci_id_devolucion int NOT NULL,
 CONSTRAINT PK_OrdenDevolucionCompra PRIMARY KEY  
(
	ocdc_id 
) 
) 
;
/****** Object:  Table OrdenDevolucionCompraTMP    Script Date: 07/30/2012 17:18:11 ******/

;

;
CREATE TABLE OrdenDevolucionCompraTMP(
	ocTMP_id int NOT NULL,
	ocdcTMP_id int NOT NULL,
	ocdc_id int NOT NULL,
	ocdc_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenDevolucionCompraTMP_ocdc_cantidad  DEFAULT (0),
	oci_id_Orden int NOT NULL,
	oci_id_devolucion int NOT NULL,
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
CREATE TABLE OrdenCompraItemTMP(
	ocTMP_id int NOT NULL,
	ociTMP_id int NOT NULL,
	oci_id int NOT NULL,
	oci_orden smallint NOT NULL,
	oci_cantidad decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItemTMP_oci_cantidad  DEFAULT (0),
	oci_cantidadaremitir decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItemTMP_oci_cantidadaremitir  DEFAULT (0),
	oci_pendiente decimal(18, 0) NOT NULL CONSTRAINT DF_OrdenCompraItemTMP_oci_pendiente  DEFAULT (0),
	oci_pendientefac decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItemTMP_oci_pendientefac  DEFAULT (0),
	oci_descrip varchar(5000) NOT NULL CONSTRAINT DF_OrdenCompraItemTMP_oci_descrip  DEFAULT (''),
	oci_precio decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItemTMP_oci_precio  DEFAULT (0),
	oci_precioUsr decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItemTMP_oci_precioUsr  DEFAULT (0),
	oci_precioLista decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItemTMP_oci_precioLista  DEFAULT (0),
	oci_descuento varchar(100) NOT NULL CONSTRAINT DF_OrdenCompraItemTMP_oci_descuento  DEFAULT (''),
	oci_neto decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItemTMP_oc_neto  DEFAULT (0),
	oci_ivari decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItemTMP_oci_ivari  DEFAULT (0),
	oci_ivarni decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItemTMP_oci_ivarni  DEFAULT (0),
	oci_ivariporc decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItemTMP_oci_ivariporc  DEFAULT (0),
	oci_ivarniporc decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItemTMP_oci_ivarniporc  DEFAULT (0),
	oci_importe decimal(18, 6) NOT NULL CONSTRAINT DF_OrdenCompraItemTMP_oci_importe  DEFAULT (0),
	pr_id int NOT NULL,
	ccos_id int NULL,
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
CREATE TABLE OrdenCompraItemBorradoTMP(
	ocTMP_id int NOT NULL,
	ocibTMP_id int NOT NULL,
	oc_id int NOT NULL,
	oci_id int NOT NULL,
 CONSTRAINT PK_OrdenCompraItemBorradoTMP PRIMARY KEY  
(
	ocibTMP_id 
) 
) 
;
/****** Object:  Table FacturaCompraPago    Script Date: 07/30/2012 17:11:39 ******/

;

;
CREATE TABLE FacturaCompraPago(
	fcp_id int NOT NULL,
	fcp_fecha timestamptz NOT NULL,
	fcp_importe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraPago_fcp_importe  DEFAULT (0),
	fc_id int NOT NULL,
 CONSTRAINT PK_FacturaCompraPago PRIMARY KEY  
(
	fcp_id 
) 
) 
;
/****** Object:  Table FacturaCompraDeuda    Script Date: 07/30/2012 17:11:01 ******/

;

;
CREATE TABLE FacturaCompraDeuda(
	fcd_id int NOT NULL,
	fcd_fecha timestamptz NOT NULL,
	fcd_fecha2 timestamptz NOT NULL CONSTRAINT DF_FacturaCompraDeuda_fcd_fecha2  DEFAULT (getdate()),
	fcd_importe decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraDeuda_fcd_importe  DEFAULT (0),
	fcd_pendiente decimal(18, 6) NOT NULL CONSTRAINT DF_FacturaCompraDeuda_fcd_pendiente  DEFAULT (0),
	fc_id int NOT NULL,
 CONSTRAINT PK_FacturaCompraDeuda PRIMARY KEY  
(
	fcd_id 
) 
) 
;
/****** Object:  ForeignKey FK_Aduana_Pais    Script Date: 07/30/2012 17:02:19 ******/
ALTER TABLE Aduana   ADD  CONSTRAINT FK_Aduana_Pais FOREIGN KEY(pa_id)
REFERENCES Pais (pa_id)
;
;
/****** Object:  ForeignKey FK_Aduana_Usuario    Script Date: 07/30/2012 17:02:19 ******/
ALTER TABLE Aduana  ADD  CONSTRAINT FK_Aduana_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;

;
/****** Object:  ForeignKey FK_AFIPArchivo_AFIPEsquema    Script Date: 07/30/2012 17:02:22 ******/
ALTER TABLE AFIPArchivo  ADD  CONSTRAINT FK_AFIPArchivo_AFIPEsquema FOREIGN KEY(afesq_id)
REFERENCES AFIPEsquema (afesq_id)
;
;
/****** Object:  ForeignKey FK_AFIPArchivo_Usuario    Script Date: 07/30/2012 17:02:22 ******/
ALTER TABLE AFIPArchivo  ADD  CONSTRAINT FK_AFIPArchivo_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
;
/****** Object:  ForeignKey FK_AFIPCampo_AFIPRegistro    Script Date: 07/30/2012 17:02:26 ******/
ALTER TABLE AFIPCampo  ADD  CONSTRAINT FK_AFIPCampo_AFIPRegistro FOREIGN KEY(afreg_id)
REFERENCES AFIPRegistro (afreg_id)
;

;
/****** Object:  ForeignKey FK_AFIPCampo_Usuario    Script Date: 07/30/2012 17:02:26 ******/
ALTER TABLE AFIPCampo  ADD  CONSTRAINT FK_AFIPCampo_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;

;
/****** Object:  ForeignKey FK_AFIPEsquema_Usuario    Script Date: 07/30/2012 17:02:28 ******/
ALTER TABLE AFIPEsquema  ADD  CONSTRAINT FK_AFIPEsquema_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;

;
/****** Object:  ForeignKey FK_AFIPParametro_AFIPEsquema    Script Date: 07/30/2012 17:02:31 ******/
ALTER TABLE AFIPParametro  ADD  CONSTRAINT FK_AFIPParametro_AFIPEsquema FOREIGN KEY(afesq_id)
REFERENCES AFIPEsquema (afesq_id)
;

;
/****** Object:  ForeignKey FK_AFIPParametro_Usuario    Script Date: 07/30/2012 17:02:31 ******/
ALTER TABLE AFIPParametro  ADD  CONSTRAINT FK_AFIPParametro_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_AFIPParametro_Usuario
;
/****** Object:  ForeignKey FK_AFIPRegistro_AFIPArchivo    Script Date: 07/30/2012 17:02:34 ******/
ALTER TABLE AFIPRegistro  ADD  CONSTRAINT FK_AFIPRegistro_AFIPArchivo FOREIGN KEY(afarch_id)
REFERENCES AFIPArchivo (afarch_id)
;

;
/****** Object:  ForeignKey FK_AFIPRegistro_Usuario    Script Date: 07/30/2012 17:02:34 ******/
ALTER TABLE AFIPRegistro  ADD  CONSTRAINT FK_AFIPRegistro_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;

;
/****** Object:  ForeignKey FK_Agenda_PrestacionAgregar    Script Date: 07/30/2012 17:02:37 ******/
ALTER TABLE Agenda  ADD  CONSTRAINT FK_Agenda_PrestacionAgregar FOREIGN KEY(pre_id_agregar)
REFERENCES Prestacion (pre_id)
;

;
/****** Object:  ForeignKey FK_Agenda_PrestacionBorrar    Script Date: 07/30/2012 17:02:37 ******/
ALTER TABLE Agenda  ADD  CONSTRAINT FK_Agenda_PrestacionBorrar FOREIGN KEY(pre_id_borrar)
REFERENCES Prestacion (pre_id)
;

;
/****** Object:  ForeignKey FK_Agenda_PrestacionEditar    Script Date: 07/30/2012 17:02:37 ******/
ALTER TABLE Agenda  ADD  CONSTRAINT FK_Agenda_PrestacionEditar FOREIGN KEY(pre_id_editar)
REFERENCES Prestacion (pre_id)
;

;
/****** Object:  ForeignKey FK_Agenda_PrestacionListar    Script Date: 07/30/2012 17:02:37 ******/
ALTER TABLE Agenda  ADD  CONSTRAINT FK_Agenda_PrestacionListar FOREIGN KEY(pre_id_listar)
REFERENCES Prestacion (pre_id)
;

;
/****** Object:  ForeignKey FK_Agenda_PrestacionPropietario    Script Date: 07/30/2012 17:02:37 ******/
ALTER TABLE Agenda  ADD  CONSTRAINT FK_Agenda_PrestacionPropietario FOREIGN KEY(pre_id_propietario)
REFERENCES Prestacion (pre_id)
;

;
/****** Object:  ForeignKey FK_Agenda_Usuario    Script Date: 07/30/2012 17:02:37 ******/
ALTER TABLE Agenda  ADD  CONSTRAINT FK_Agenda_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;

;
/****** Object:  ForeignKey FK_AjusteInflacion_Cuenta    Script Date: 07/30/2012 17:02:40 ******/
ALTER TABLE AjusteInflacion  ADD  CONSTRAINT FK_AjusteInflacion_Cuenta FOREIGN KEY(cue_id_patrimonial)
REFERENCES Cuenta (cue_id)
;

;
/****** Object:  ForeignKey FK_AjusteInflacion_Cuenta1    Script Date: 07/30/2012 17:02:40 ******/
ALTER TABLE AjusteInflacion  ADD  CONSTRAINT FK_AjusteInflacion_Cuenta1 FOREIGN KEY(cue_id_resultados)
REFERENCES Cuenta (cue_id)
;

;
/****** Object:  ForeignKey FK_AjusteInflacionItem_AjusteInflacion    Script Date: 07/30/2012 17:02:43 ******/
ALTER TABLE AjusteInflacionItem  ADD  CONSTRAINT FK_AjusteInflacionItem_AjusteInflacion FOREIGN KEY(aje_id)
REFERENCES AjusteInflacion (aje_id)
;

;
/****** Object:  ForeignKey FK_AjusteInflacionItem_AjusteInflacionItemTipo    Script Date: 07/30/2012 17:02:43 ******/
ALTER TABLE AjusteInflacionItem  ADD  CONSTRAINT FK_AjusteInflacionItem_AjusteInflacionItemTipo FOREIGN KEY(ajit_id)
REFERENCES AjusteInflacionItemTipo (ajit_id)
;
-- FK_AjusteInflacionItem_AjusteInflacionItemTipo
;
/****** Object:  ForeignKey FK_AjusteInflacionItem_Cuenta    Script Date: 07/30/2012 17:02:43 ******/
ALTER TABLE AjusteInflacionItem  ADD  CONSTRAINT FK_AjusteInflacionItem_Cuenta FOREIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_AjusteInflacionItem_Cuenta
;
/****** Object:  ForeignKey FK_Alarma_Cliente    Script Date: 07/30/2012 17:02:49 ******/
ALTER TABLE Alarma  ADD  CONSTRAINT FK_Alarma_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_Alarma_Cliente
;
/****** Object:  ForeignKey FK_Alarma_ClienteSucursal    Script Date: 07/30/2012 17:02:49 ******/
ALTER TABLE Alarma  ADD  CONSTRAINT FK_Alarma_ClienteSucursal FOREIGN KEY(clis_id)
REFERENCES ClienteSucursal (clis_id)
;
-- FK_Alarma_ClienteSucursal
;
/****** Object:  ForeignKey FK_Alarma_Proyecto    Script Date: 07/30/2012 17:02:49 ******/
ALTER TABLE Alarma  ADD  CONSTRAINT FK_Alarma_Proyecto FOREIGN KEY(proy_id)
REFERENCES Proyecto (proy_id)
;
-- FK_Alarma_Proyecto
;
/****** Object:  ForeignKey FK_Alarma_Rubro    Script Date: 07/30/2012 17:02:49 ******/
ALTER TABLE Alarma  ADD  CONSTRAINT FK_Alarma_Rubro FOREIGN KEY(rub_id)
REFERENCES Rubro (rub_id)
;
-- FK_Alarma_Rubro
;
/****** Object:  ForeignKey FK_Alarma_Usuario    Script Date: 07/30/2012 17:02:49 ******/
ALTER TABLE Alarma  ADD  CONSTRAINT FK_Alarma_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Alarma_Usuario
;
/****** Object:  ForeignKey FK_AlarmaDiaMes_Alarma    Script Date: 07/30/2012 17:02:51 ******/
ALTER TABLE AlarmaDiaMes  ADD  CONSTRAINT FK_AlarmaDiaMes_Alarma FOREIGN KEY(al_id)
REFERENCES Alarma (al_id)
;
-- FK_AlarmaDiaMes_Alarma
;
/****** Object:  ForeignKey FK_AlarmaDiaSemana_Alarma    Script Date: 07/30/2012 17:02:52 ******/
ALTER TABLE AlarmaDiaSemana  ADD  CONSTRAINT FK_AlarmaDiaSemana_Alarma FOREIGN KEY(al_id)
REFERENCES Alarma (al_id)
;
-- FK_AlarmaDiaSemana_Alarma
;
/****** Object:  ForeignKey FK_AlarmaFecha_Alarma    Script Date: 07/30/2012 17:02:54 ******/
ALTER TABLE AlarmaFecha  ADD  CONSTRAINT FK_AlarmaFecha_Alarma FOREIGN KEY(al_id)
REFERENCES Alarma (al_id)
;
-- FK_AlarmaFecha_Alarma
;
/****** Object:  ForeignKey FK_AlarmaItem_Alarma    Script Date: 07/30/2012 17:02:58 ******/
ALTER TABLE AlarmaItem  ADD  CONSTRAINT FK_AlarmaItem_Alarma FOREIGN KEY(al_id)
REFERENCES Alarma (al_id)
;
-- FK_AlarmaItem_Alarma
;
/****** Object:  ForeignKey FK_AlarmaItem_AlarmaItemTipo    Script Date: 07/30/2012 17:02:58 ******/
ALTER TABLE AlarmaItem  ADD  CONSTRAINT FK_AlarmaItem_AlarmaItemTipo FOREIGN KEY(alit_id)
REFERENCES AlarmaItemTipo (alit_id)
;
-- FK_AlarmaItem_AlarmaItemTipo
;
/****** Object:  ForeignKey FK_AlarmaItem_Departamento    Script Date: 07/30/2012 17:02:58 ******/
ALTER TABLE AlarmaItem  ADD  CONSTRAINT FK_AlarmaItem_Departamento FOREIGN KEY(dpto_id)
REFERENCES Departamento (dpto_id)
;
-- FK_AlarmaItem_Departamento
;
/****** Object:  ForeignKey FK_Alsa_Colmena    Script Date: 07/30/2012 17:03:11 ******/
ALTER TABLE Alsa  ADD  CONSTRAINT FK_Alsa_Colmena FOREIGN KEY(colm_id)
REFERENCES Colmena (colm_id)
;
-- FK_Alsa_Colmena
;
/****** Object:  ForeignKey FK_Alsa_Usuario    Script Date: 07/30/2012 17:03:11 ******/
ALTER TABLE Alsa  ADD  CONSTRAINT FK_Alsa_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Alsa_Usuario
;
/****** Object:  ForeignKey FK_Alumno_Alumno    Script Date: 07/30/2012 17:03:15 ******/
ALTER TABLE Alumno  ADD  CONSTRAINT FK_Alumno_Alumno FOREIGN KEY(alum_id)
REFERENCES Alumno (alum_id)
;
-- FK_Alumno_Alumno
;
/****** Object:  ForeignKey FK_Alumno_ClienteContactoTipo    Script Date: 07/30/2012 17:03:15 ******/
ALTER TABLE Alumno  ADD  CONSTRAINT FK_Alumno_ClienteContactoTipo FOREIGN KEY(clict_id)
REFERENCES ClienteContactoTipo (clict_id)
;
-- FK_Alumno_ClienteContactoTipo
;
/****** Object:  ForeignKey FK_Alumno_Profesor    Script Date: 07/30/2012 17:03:15 ******/
ALTER TABLE Alumno  ADD  CONSTRAINT FK_Alumno_Profesor FOREIGN KEY(prof_id)
REFERENCES Profesor (prof_id)
;
-- FK_Alumno_Profesor
;
/****** Object:  ForeignKey FK_Alumno_Proyecto    Script Date: 07/30/2012 17:03:15 ******/
ALTER TABLE Alumno  ADD  CONSTRAINT FK_Alumno_Proyecto FOREIGN KEY(proy_id)
REFERENCES Proyecto (proy_id)
;
-- FK_Alumno_Proyecto
;
/****** Object:  ForeignKey FK_Alumno_Usuario    Script Date: 07/30/2012 17:03:15 ******/
ALTER TABLE Alumno  ADD  CONSTRAINT FK_Alumno_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Alumno_Usuario
;
/****** Object:  ForeignKey FK_Arbol_Tabla    Script Date: 07/30/2012 17:03:17 ******/
ALTER TABLE Arbol  ADD  CONSTRAINT FK_Arbol_Tabla FOREIGN KEY(tbl_Id)
REFERENCES Tabla (tbl_id)
;
-- FK_Arbol_Tabla
;
/****** Object:  ForeignKey FK_Arbol_Usuario    Script Date: 07/30/2012 17:03:17 ******/
ALTER TABLE Arbol  ADD  CONSTRAINT FK_Arbol_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Arbol_Usuario
;
/****** Object:  ForeignKey FK_Asiento_Documento    Script Date: 07/30/2012 17:03:22 ******/
ALTER TABLE Asiento  ADD  CONSTRAINT FK_Asiento_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_Asiento_Documento
;
/****** Object:  ForeignKey FK_Asiento_DocumentoTipo    Script Date: 07/30/2012 17:03:22 ******/
ALTER TABLE Asiento  ADD  CONSTRAINT FK_Asiento_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_Asiento_DocumentoTipo
;
/****** Object:  ForeignKey FK_Asiento_DocumentoTipoCliente    Script Date: 07/30/2012 17:03:22 ******/
ALTER TABLE Asiento  ADD  CONSTRAINT FK_Asiento_DocumentoTipoCliente FOREIGN KEY(doct_id_cliente)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_Asiento_DocumentoTipoCliente
;
/****** Object:  ForeignKey FK_Asiento_Usuario    Script Date: 07/30/2012 17:03:23 ******/
ALTER TABLE Asiento  ADD  CONSTRAINT FK_Asiento_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Asiento_Usuario
;
/****** Object:  ForeignKey FK_AsientoItem_Asiento    Script Date: 07/30/2012 17:03:26 ******/
ALTER TABLE AsientoItem  ADD  CONSTRAINT FK_AsientoItem_Asiento FOREIGN KEY(as_id)
REFERENCES Asiento (as_id)
;
-- FK_AsientoItem_Asiento
;
/****** Object:  ForeignKey FK_AsientoItem_CentroCosto    Script Date: 07/30/2012 17:03:26 ******/
ALTER TABLE AsientoItem  ADD  CONSTRAINT FK_AsientoItem_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_AsientoItem_CentroCosto
;
/****** Object:  ForeignKey FK_AsientoItem_Cheque    Script Date: 07/30/2012 17:03:26 ******/
ALTER TABLE AsientoItem  ADD  CONSTRAINT FK_AsientoItem_Cheque FOREIGN KEY(cheq_id)
REFERENCES Cheque (cheq_id)
;
-- FK_AsientoItem_Cheque
;
/****** Object:  ForeignKey FK_AsientoItem_Cuenta    Script Date: 07/30/2012 17:03:26 ******/
ALTER TABLE AsientoItem  ADD  CONSTRAINT FK_AsientoItem_Cuenta FOREIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_AsientoItem_Cuenta
;
/****** Object:  ForeignKey FK_AsientoItem_Moneda    Script Date: 07/30/2012 17:03:26 ******/
ALTER TABLE AsientoItem  ADD  CONSTRAINT FK_AsientoItem_Moneda FOREIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_AsientoItem_Moneda
;
/****** Object:  ForeignKey FK_AsientoItemBorradoTMP_AsientoTMP    Script Date: 07/30/2012 17:03:27 ******/
ALTER TABLE AsientoItemBorradoTMP  ADD  CONSTRAINT FK_AsientoItemBorradoTMP_AsientoTMP FOREIGN KEY(asTMP_id)
REFERENCES AsientoTMP (asTMP_id)
;
-- FK_AsientoItemBorradoTMP_AsientoTMP
;
/****** Object:  ForeignKey FK_AsientoItemTMP_AsientoTMP    Script Date: 07/30/2012 17:03:29 ******/
ALTER TABLE AsientoItemTMP  ADD  CONSTRAINT FK_AsientoItemTMP_AsientoTMP FOREIGN KEY(asTMP_id)
REFERENCES AsientoTMP (asTMP_id)
;
-- FK_AsientoItemTMP_AsientoTMP
;
/****** Object:  ForeignKey FK_AuditoriaItem_Auditoria    Script Date: 07/30/2012 17:03:35 ******/
ALTER TABLE AuditoriaItem  ADD  CONSTRAINT FK_AuditoriaItem_Auditoria FOREIGN KEY(aud_id)
REFERENCES Auditoria (aud_id)
;
-- FK_AuditoriaItem_Auditoria
;
/****** Object:  ForeignKey FK_AuditoriaItem_AuditoriaGrupo    Script Date: 07/30/2012 17:03:35 ******/
ALTER TABLE AuditoriaItem  ADD  CONSTRAINT FK_AuditoriaItem_AuditoriaGrupo FOREIGN KEY(audg_id)
REFERENCES AuditoriaGrupo (audg_id)
;
-- FK_AuditoriaItem_AuditoriaGrupo
;
/****** Object:  ForeignKey FK_AuditoriaItem_AuditoriaNivel    Script Date: 07/30/2012 17:03:35 ******/
ALTER TABLE AuditoriaItem  ADD  CONSTRAINT FK_AuditoriaItem_AuditoriaNivel FOREIGN KEY(audn_id)
REFERENCES AuditoriaNivel (audn_id)
;
-- FK_AuditoriaItem_AuditoriaNivel
;
/****** Object:  ForeignKey FK_Aula_Usuario    Script Date: 07/30/2012 17:03:37 ******/
ALTER TABLE Aula  ADD  CONSTRAINT FK_Aula_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Aula_Usuario
;
/****** Object:  ForeignKey FK_Aviso_AvisoTipo    Script Date: 07/30/2012 17:03:40 ******/
ALTER TABLE Aviso  ADD  CONSTRAINT FK_Aviso_AvisoTipo FOREIGN KEY(avt_id)
REFERENCES AvisoTipo (avt_id)
;
-- FK_Aviso_AvisoTipo
;
/****** Object:  ForeignKey FK_Aviso_Modifico    Script Date: 07/30/2012 17:03:40 ******/
ALTER TABLE Aviso  ADD  CONSTRAINT FK_Aviso_Modifico FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Aviso_Modifico
;
/****** Object:  ForeignKey FK_Aviso_Usuario    Script Date: 07/30/2012 17:03:40 ******/
ALTER TABLE Aviso  ADD  CONSTRAINT FK_Aviso_Usuario FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_Aviso_Usuario
;
/****** Object:  ForeignKey FK_Banco_Usuario    Script Date: 07/30/2012 17:03:44 ******/
ALTER TABLE Banco  ADD  CONSTRAINT FK_Banco_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Banco_Usuario
;
/****** Object:  ForeignKey FK_BancoConciliacionItem_BancoConciliacion    Script Date: 07/30/2012 17:03:51 ******/
ALTER TABLE BancoConciliacionItem  ADD  CONSTRAINT FK_BancoConciliacionItem_BancoConciliacion FOREIGN KEY(bcoc_id)
REFERENCES BancoConciliacion (bcoc_id)
;
-- FK_BancoConciliacionItem_BancoConciliacion
;
/****** Object:  ForeignKey FK_Barco_Usuario    Script Date: 07/30/2012 17:03:53 ******/
ALTER TABLE Barco  ADD  CONSTRAINT FK_Barco_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Barco_Usuario
;
/****** Object:  ForeignKey FK_Caja_Documento    Script Date: 07/30/2012 17:03:55 ******/
ALTER TABLE Caja  ADD  CONSTRAINT FK_Caja_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_Caja_Documento
;
/****** Object:  ForeignKey FK_Caja_Empresa    Script Date: 07/30/2012 17:03:56 ******/
ALTER TABLE Caja  ADD  CONSTRAINT FK_Caja_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_Caja_Empresa
;
/****** Object:  ForeignKey FK_Caja_Sucursal    Script Date: 07/30/2012 17:03:56 ******/
ALTER TABLE Caja  ADD  CONSTRAINT FK_Caja_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_Caja_Sucursal
;
/****** Object:  ForeignKey FK_Caja_Usuario    Script Date: 07/30/2012 17:03:56 ******/
ALTER TABLE Caja  ADD  CONSTRAINT FK_Caja_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Caja_Usuario
;
/****** Object:  ForeignKey FK_CajaCajero_Caja    Script Date: 07/30/2012 17:03:57 ******/
ALTER TABLE CajaCajero  ADD  CONSTRAINT FK_CajaCajero_Caja FOREIGN KEY(cj_id)
REFERENCES Caja (cj_id)
;
-- FK_CajaCajero_Caja
;
/****** Object:  ForeignKey FK_CajaCajero_Usuario    Script Date: 07/30/2012 17:03:57 ******/
ALTER TABLE CajaCajero  ADD  CONSTRAINT FK_CajaCajero_Usuario FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_CajaCajero_Usuario
;
/****** Object:  ForeignKey FK_CajaCuenta_Caja    Script Date: 07/30/2012 17:03:58 ******/
ALTER TABLE CajaCuenta  ADD  CONSTRAINT FK_CajaCuenta_Caja FOREIGN KEY(cj_id)
REFERENCES Caja (cj_id)
;
-- FK_CajaCuenta_Caja
;
/****** Object:  ForeignKey FK_CajaCuenta_CuentaFondos    Script Date: 07/30/2012 17:03:58 ******/
ALTER TABLE CajaCuenta  ADD  CONSTRAINT FK_CajaCuenta_CuentaFondos FOREIGN KEY(cue_id_fondos)
REFERENCES Cuenta (cue_id)
;
-- FK_CajaCuenta_CuentaFondos
;
/****** Object:  ForeignKey FK_CajaCuenta_CuentaTrabajo    Script Date: 07/30/2012 17:03:58 ******/
ALTER TABLE CajaCuenta  ADD  CONSTRAINT FK_CajaCuenta_CuentaTrabajo FOREIGN KEY(cue_id_trabajo)
REFERENCES Cuenta (cue_id)
;
-- FK_CajaCuenta_CuentaTrabajo
;
/****** Object:  ForeignKey FK_Calibradora_Usuario    Script Date: 07/30/2012 17:04:00 ******/
ALTER TABLE Calibradora  ADD  CONSTRAINT FK_Calibradora_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Calibradora_Usuario
;
/****** Object:  ForeignKey FK_Calidad_Usuario    Script Date: 07/30/2012 17:04:02 ******/
ALTER TABLE Calidad  ADD  CONSTRAINT FK_Calidad_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Calidad_Usuario
;
/****** Object:  ForeignKey FK_Calle_Ciudad    Script Date: 07/30/2012 17:04:04 ******/
ALTER TABLE Calle  ADD  CONSTRAINT FK_Calle_Ciudad FOREIGN KEY(ciu_id)
REFERENCES Ciudad (ciu_id)
;
-- FK_Calle_Ciudad
;
/****** Object:  ForeignKey FK_CalleAltura_Calle    Script Date: 07/30/2012 17:04:06 ******/
ALTER TABLE CalleAltura  ADD  CONSTRAINT FK_CalleAltura_Calle FOREIGN KEY(calle_id)
REFERENCES Calle (calle_id)
;
-- FK_CalleAltura_Calle
;
/****** Object:  ForeignKey FK_Camion_Chofer    Script Date: 07/30/2012 17:04:09 ******/
ALTER TABLE Camion  ADD  CONSTRAINT FK_Camion_Chofer FOREIGN KEY(chof_id)
REFERENCES Chofer (chof_id)
;
-- FK_Camion_Chofer
;
/****** Object:  ForeignKey FK_Camion_Transporte    Script Date: 07/30/2012 17:04:09 ******/
ALTER TABLE Camion  ADD  CONSTRAINT FK_Camion_Transporte FOREIGN KEY(trans_id)
REFERENCES Transporte (trans_id)
;
-- FK_Camion_Transporte
;
/****** Object:  ForeignKey FK_camion_Usuario    Script Date: 07/30/2012 17:04:09 ******/
ALTER TABLE Camion  ADD  CONSTRAINT FK_camion_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_camion_Usuario
;
/****** Object:  ForeignKey FK_CashFlowItem_CashFlow    Script Date: 07/30/2012 17:04:14 ******/
ALTER TABLE CashFlowItem  ADD  CONSTRAINT FK_CashFlowItem_CashFlow FOREIGN KEY(cf_id)
REFERENCES CashFlow (cf_id)
;
-- FK_CashFlowItem_CashFlow
;
/****** Object:  ForeignKey FK_CashFlowParam_Banco    Script Date: 07/30/2012 17:04:15 ******/
ALTER TABLE CashFlowParam  ADD  CONSTRAINT FK_CashFlowParam_Banco FOREIGN KEY(bco_id)
REFERENCES Banco (bco_id)
;
-- FK_CashFlowParam_Banco
;
/****** Object:  ForeignKey FK_CashFlowParam_CashFlow    Script Date: 07/30/2012 17:04:15 ******/
ALTER TABLE CashFlowParam  ADD  CONSTRAINT FK_CashFlowParam_CashFlow FOREIGN KEY(cf_id)
REFERENCES CashFlow (cf_id)
;
-- FK_CashFlowParam_CashFlow
;
/****** Object:  ForeignKey FK_CashFlowParam_Cliente    Script Date: 07/30/2012 17:04:15 ******/
ALTER TABLE CashFlowParam  ADD  CONSTRAINT FK_CashFlowParam_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_CashFlowParam_Cliente
;
/****** Object:  ForeignKey FK_CashFlowParam_Cuenta    Script Date: 07/30/2012 17:04:16 ******/
ALTER TABLE CashFlowParam  ADD  CONSTRAINT FK_CashFlowParam_Cuenta FOREIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_CashFlowParam_Cuenta
;
/****** Object:  ForeignKey FK_CashFlowParam_Proveedor    Script Date: 07/30/2012 17:04:16 ******/
ALTER TABLE CashFlowParam  ADD  CONSTRAINT FK_CashFlowParam_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_CashFlowParam_Proveedor
;
/****** Object:  ForeignKey FK_CatalogoWebCategoriaItem_CatalogoWebCategoria    Script Date: 07/30/2012 17:04:23 ******/
ALTER TABLE CatalogoWebCategoriaItem  ADD  CONSTRAINT FK_CatalogoWebCategoriaItem_CatalogoWebCategoria FOREIGN KEY(catwc_id)
REFERENCES CatalogoWebCategoria (catwc_id)
;
-- FK_CatalogoWebCategoriaItem_CatalogoWebCategoria
;
/****** Object:  ForeignKey FK_CatalogoWebCategoriaItem_Producto    Script Date: 07/30/2012 17:04:23 ******/
ALTER TABLE CatalogoWebCategoriaItem  ADD  CONSTRAINT FK_CatalogoWebCategoriaItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_CatalogoWebCategoriaItem_Producto
;
/****** Object:  ForeignKey FK_CatalogoWebItem_CatalogoWeb    Script Date: 07/30/2012 17:04:26 ******/
ALTER TABLE CatalogoWebItem  ADD  CONSTRAINT FK_CatalogoWebItem_CatalogoWeb FOREIGN KEY(catw_id)
REFERENCES CatalogoWeb (catw_id)
;
-- FK_CatalogoWebItem_CatalogoWeb
;
/****** Object:  ForeignKey FK_CatalogoWebItem_Producto    Script Date: 07/30/2012 17:04:26 ******/
ALTER TABLE CatalogoWebItem  ADD  CONSTRAINT FK_CatalogoWebItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_CatalogoWebItem_Producto
;
/****** Object:  ForeignKey FK_CatalogoWebProductoImage_CatalogoWeb    Script Date: 07/30/2012 17:04:27 ******/
ALTER TABLE CatalogoWebProductoImage  ADD  CONSTRAINT FK_CatalogoWebProductoImage_CatalogoWeb FOREIGN KEY(catw_id)
REFERENCES CatalogoWeb (catw_id)
;
-- FK_CatalogoWebProductoImage_CatalogoWeb
;
/****** Object:  ForeignKey FK_CatalogoWebProductoImage_ProductoWebImage    Script Date: 07/30/2012 17:04:27 ******/
ALTER TABLE CatalogoWebProductoImage  ADD  CONSTRAINT FK_CatalogoWebProductoImage_ProductoWebImage FOREIGN KEY(prwi_id)
REFERENCES ProductoWebImage (prwi_id)
;
-- FK_CatalogoWebProductoImage_ProductoWebImage
;
/****** Object:  ForeignKey FK_CatalogoWebProductoImageLink_CatalogoWeb    Script Date: 07/30/2012 17:04:28 ******/
ALTER TABLE CatalogoWebProductoImageLink  ADD  CONSTRAINT FK_CatalogoWebProductoImageLink_CatalogoWeb FOREIGN KEY(catw_id)
REFERENCES CatalogoWeb (catw_id)
;
-- FK_CatalogoWebProductoImageLink_CatalogoWeb
;
/****** Object:  ForeignKey FK_CatalogoWebProductoImageLink_ProductoWebImage    Script Date: 07/30/2012 17:04:28 ******/
ALTER TABLE CatalogoWebProductoImageLink  ADD  CONSTRAINT FK_CatalogoWebProductoImageLink_ProductoWebImage FOREIGN KEY(prwi_id)
REFERENCES ProductoWebImage (prwi_id)
;
-- FK_CatalogoWebProductoImageLink_ProductoWebImage
;
/****** Object:  ForeignKey FK_CDRomArchivo_CDRom    Script Date: 07/30/2012 17:04:35 ******/
ALTER TABLE CDRomArchivo  ADD  CONSTRAINT FK_CDRomArchivo_CDRom FOREIGN KEY(cd_id)
REFERENCES CDRom (cd_id)
;
-- FK_CDRomArchivo_CDRom
;
/****** Object:  ForeignKey FK_CDRomArchivo_CDRomCarpeta    Script Date: 07/30/2012 17:04:35 ******/
ALTER TABLE CDRomArchivo  ADD  CONSTRAINT FK_CDRomArchivo_CDRomCarpeta FOREIGN KEY(cdc_id)
REFERENCES CDRomCarpeta (cdc_id)
;
-- FK_CDRomArchivo_CDRomCarpeta
;
/****** Object:  ForeignKey FK_CDRomCarpeta_CDRom    Script Date: 07/30/2012 17:04:37 ******/
ALTER TABLE CDRomCarpeta  ADD  CONSTRAINT FK_CDRomCarpeta_CDRom FOREIGN KEY(cd_id)
REFERENCES CDRom (cd_id)
;
-- FK_CDRomCarpeta_CDRom
;
/****** Object:  ForeignKey FK_CentroCosto_CentroCosto    Script Date: 07/30/2012 17:04:40 ******/
ALTER TABLE CentroCosto  ADD  CONSTRAINT FK_CentroCosto_CentroCosto FOREIGN KEY(ccos_id_padre)
REFERENCES CentroCosto (ccos_id)
;
-- FK_CentroCosto_CentroCosto
;
/****** Object:  ForeignKey FK_Cheque_Banco    Script Date: 07/30/2012 17:04:47 ******/
ALTER TABLE Cheque  ADD  CONSTRAINT FK_Cheque_Banco FOREIGN KEY(bco_id)
REFERENCES Banco (bco_id)
;
-- FK_Cheque_Banco
;
/****** Object:  ForeignKey FK_Cheque_Chequera    Script Date: 07/30/2012 17:04:47 ******/
ALTER TABLE Cheque  ADD  CONSTRAINT FK_Cheque_Chequera FOREIGN KEY(chq_id)
REFERENCES Chequera (chq_id)
;
-- FK_Cheque_Chequera
;
/****** Object:  ForeignKey FK_Cheque_Clearing    Script Date: 07/30/2012 17:04:47 ******/
ALTER TABLE Cheque  ADD  CONSTRAINT FK_Cheque_Clearing FOREIGN KEY(cle_id)
REFERENCES Clearing (cle_id)
;
-- FK_Cheque_Clearing
;
/****** Object:  ForeignKey FK_Cheque_Cliente    Script Date: 07/30/2012 17:04:47 ******/
ALTER TABLE Cheque  ADD  CONSTRAINT FK_Cheque_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_Cheque_Cliente
;
/****** Object:  ForeignKey FK_Cheque_Cobranza    Script Date: 07/30/2012 17:04:47 ******/
ALTER TABLE Cheque  ADD  CONSTRAINT FK_Cheque_Cobranza FOREIGN KEY(cobz_id)
REFERENCES Cobranza (cobz_id)
;
-- FK_Cheque_Cobranza
;
/****** Object:  ForeignKey FK_Cheque_Cuenta    Script Date: 07/30/2012 17:04:48 ******/
ALTER TABLE Cheque  ADD  CONSTRAINT FK_Cheque_Cuenta FOREIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_Cheque_Cuenta
;
/****** Object:  ForeignKey FK_Cheque_DepositoBanco    Script Date: 07/30/2012 17:04:48 ******/
ALTER TABLE Cheque  ADD  CONSTRAINT FK_Cheque_DepositoBanco FOREIGN KEY(dbco_id)
REFERENCES DepositoBanco (dbco_id)
;
-- FK_Cheque_DepositoBanco
;
/****** Object:  ForeignKey FK_Cheque_Empresa    Script Date: 07/30/2012 17:04:48 ******/
ALTER TABLE Cheque  ADD  CONSTRAINT FK_Cheque_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_Cheque_Empresa
;
/****** Object:  ForeignKey FK_Cheque_FacturaCompraND1    Script Date: 07/30/2012 17:04:48 ******/
ALTER TABLE Cheque  ADD  CONSTRAINT FK_Cheque_FacturaCompraND1 FOREIGN KEY(fc_id_nd1)
REFERENCES FacturaCompra (fc_id)
;
-- FK_Cheque_FacturaCompraND1
;
/****** Object:  ForeignKey FK_Cheque_FacturaCompraND2    Script Date: 07/30/2012 17:04:48 ******/
ALTER TABLE Cheque  ADD  CONSTRAINT FK_Cheque_FacturaCompraND2 FOREIGN KEY(fc_id_nd2)
REFERENCES FacturaCompra (fc_id)
;
-- FK_Cheque_FacturaCompraND2
;
/****** Object:  ForeignKey FK_Cheque_FacturaVentaND    Script Date: 07/30/2012 17:04:48 ******/
ALTER TABLE Cheque  ADD  CONSTRAINT FK_Cheque_FacturaVentaND FOREIGN KEY(fv_id_nd)
REFERENCES FacturaVenta (fv_id)
;
-- FK_Cheque_FacturaVentaND
;
/****** Object:  ForeignKey FK_Cheque_Moneda    Script Date: 07/30/2012 17:04:48 ******/
ALTER TABLE Cheque  ADD  CONSTRAINT FK_Cheque_Moneda FOREIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_Cheque_Moneda
;
/****** Object:  ForeignKey FK_Cheque_MovimientoFondo    Script Date: 07/30/2012 17:04:48 ******/
ALTER TABLE Cheque  ADD  CONSTRAINT FK_Cheque_MovimientoFondo FOREIGN KEY(mf_id)
REFERENCES MovimientoFondo (mf_id)
;
-- FK_Cheque_MovimientoFondo
;
/****** Object:  ForeignKey FK_Cheque_Proveedor    Script Date: 07/30/2012 17:04:48 ******/
ALTER TABLE Cheque  ADD  CONSTRAINT FK_Cheque_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_Cheque_Proveedor
;
/****** Object:  ForeignKey FK_Chofer_Camion    Script Date: 07/30/2012 17:04:54 ******/
ALTER TABLE Chofer  ADD  CONSTRAINT FK_Chofer_Camion FOREIGN KEY(cam_id)
REFERENCES Camion (cam_id)
;
-- FK_Chofer_Camion
;
/****** Object:  ForeignKey FK_Chofer_Transporte    Script Date: 07/30/2012 17:04:54 ******/
ALTER TABLE Chofer  ADD  CONSTRAINT FK_Chofer_Transporte FOREIGN KEY(trans_id)
REFERENCES Transporte (trans_id)
;
-- FK_Chofer_Transporte
;
/****** Object:  ForeignKey FK_Chofer_Usuario    Script Date: 07/30/2012 17:04:54 ******/
ALTER TABLE Chofer  ADD  CONSTRAINT FK_Chofer_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Chofer_Usuario
;
/****** Object:  ForeignKey FK_CircuitoContable_Usuario    Script Date: 07/30/2012 17:04:57 ******/
ALTER TABLE CircuitoContable  ADD  CONSTRAINT FK_CircuitoContable_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_CircuitoContable_Usuario
;
/****** Object:  ForeignKey FK_Ciudad_Provincia1    Script Date: 07/30/2012 17:04:59 ******/
ALTER TABLE Ciudad  ADD  CONSTRAINT FK_Ciudad_Provincia1 FOREIGN KEY(pro_id)
REFERENCES Provincia (pro_id)
;
-- FK_Ciudad_Provincia1
;
/****** Object:  ForeignKey FK_Ciudad_Usuario    Script Date: 07/30/2012 17:04:59 ******/
ALTER TABLE Ciudad  ADD  CONSTRAINT FK_Ciudad_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Ciudad_Usuario
;
/****** Object:  ForeignKey FK_Cliente_Cliente    Script Date: 07/30/2012 17:05:15 ******/
ALTER TABLE Cliente  ADD  CONSTRAINT FK_Cliente_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_Cliente_Cliente
;
/****** Object:  ForeignKey FK_Cliente_ClienteContactoTipo    Script Date: 07/30/2012 17:05:15 ******/
ALTER TABLE Cliente  ADD  CONSTRAINT FK_Cliente_ClienteContactoTipo FOREIGN KEY(clict_id)
REFERENCES ClienteContactoTipo (clict_id)
;
-- FK_Cliente_ClienteContactoTipo
;
/****** Object:  ForeignKey FK_Cliente_ClienteReferido    Script Date: 07/30/2012 17:05:15 ******/
ALTER TABLE Cliente  ADD  CONSTRAINT FK_Cliente_ClienteReferido FOREIGN KEY(cli_id_referido)
REFERENCES Cliente (cli_id)
;
-- FK_Cliente_ClienteReferido
;
/****** Object:  ForeignKey FK_Cliente_CondicionPago    Script Date: 07/30/2012 17:05:15 ******/
ALTER TABLE Cliente  ADD  CONSTRAINT FK_Cliente_CondicionPago FOREIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_Cliente_CondicionPago
;
/****** Object:  ForeignKey FK_Cliente_FormaPago    Script Date: 07/30/2012 17:05:15 ******/
ALTER TABLE Cliente  ADD  CONSTRAINT FK_Cliente_FormaPago FOREIGN KEY(fp_id)
REFERENCES FormaPago (fp_id)
;
-- FK_Cliente_FormaPago
;
/****** Object:  ForeignKey FK_Cliente_ListaDescuento    Script Date: 07/30/2012 17:05:15 ******/
ALTER TABLE Cliente  ADD  CONSTRAINT FK_Cliente_ListaDescuento FOREIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_Cliente_ListaDescuento
;
/****** Object:  ForeignKey FK_Cliente_ListaPrecio    Script Date: 07/30/2012 17:05:15 ******/
ALTER TABLE Cliente  ADD  CONSTRAINT FK_Cliente_ListaPrecio FOREIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_Cliente_ListaPrecio
;
/****** Object:  ForeignKey FK_Cliente_Provincia    Script Date: 07/30/2012 17:05:15 ******/
ALTER TABLE Cliente  ADD  CONSTRAINT FK_Cliente_Provincia FOREIGN KEY(pro_id)
REFERENCES Provincia (pro_id)
;
-- FK_Cliente_Provincia
;
/****** Object:  ForeignKey FK_Cliente_Proyecto    Script Date: 07/30/2012 17:05:15 ******/
ALTER TABLE Cliente  ADD  CONSTRAINT FK_Cliente_Proyecto FOREIGN KEY(proy_id)
REFERENCES Proyecto (proy_id)
;
-- FK_Cliente_Proyecto
;
/****** Object:  ForeignKey FK_Cliente_Transporte    Script Date: 07/30/2012 17:05:15 ******/
ALTER TABLE Cliente  ADD  CONSTRAINT FK_Cliente_Transporte FOREIGN KEY(trans_id)
REFERENCES Transporte (trans_id)
;
-- FK_Cliente_Transporte
;
/****** Object:  ForeignKey FK_Cliente_Usuario    Script Date: 07/30/2012 17:05:16 ******/
ALTER TABLE Cliente  ADD  CONSTRAINT FK_Cliente_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Cliente_Usuario
;
/****** Object:  ForeignKey FK_Cliente_Usuario1    Script Date: 07/30/2012 17:05:16 ******/
ALTER TABLE Cliente  ADD  CONSTRAINT FK_Cliente_Usuario1 FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_Cliente_Usuario1
;
/****** Object:  ForeignKey FK_Cliente_Vendedor    Script Date: 07/30/2012 17:05:16 ******/
ALTER TABLE Cliente  ADD  CONSTRAINT FK_Cliente_Vendedor FOREIGN KEY(ven_id)
REFERENCES Vendedor (ven_id)
;
-- FK_Cliente_Vendedor
;
/****** Object:  ForeignKey FK_Cliente_Zona    Script Date: 07/30/2012 17:05:16 ******/
ALTER TABLE Cliente  ADD  CONSTRAINT FK_Cliente_Zona FOREIGN KEY(zon_id)
REFERENCES Zona (zon_id)
;
-- FK_Cliente_Zona
;
/****** Object:  ForeignKey FK_ClienteCacheCredito_Cliente    Script Date: 07/30/2012 17:05:17 ******/
ALTER TABLE ClienteCacheCredito  ADD  CONSTRAINT FK_ClienteCacheCredito_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_ClienteCacheCredito_Cliente
;
/****** Object:  ForeignKey FK_ClienteCacheCredito_Empresa    Script Date: 07/30/2012 17:05:17 ******/
ALTER TABLE ClienteCacheCredito  ADD  CONSTRAINT FK_ClienteCacheCredito_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_ClienteCacheCredito_Empresa
;
/****** Object:  ForeignKey FK_ClienteContactoTipo_Usuario    Script Date: 07/30/2012 17:05:19 ******/
ALTER TABLE ClienteContactoTipo  ADD  CONSTRAINT FK_ClienteContactoTipo_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ClienteContactoTipo_Usuario
;
/****** Object:  ForeignKey FK_ClienteCuentaGrupo_Cliente    Script Date: 07/30/2012 17:05:21 ******/
ALTER TABLE ClienteCuentaGrupo  ADD  CONSTRAINT FK_ClienteCuentaGrupo_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_ClienteCuentaGrupo_Cliente
;
/****** Object:  ForeignKey FK_ClienteCuentaGrupo_Cuenta    Script Date: 07/30/2012 17:05:21 ******/
ALTER TABLE ClienteCuentaGrupo  ADD  CONSTRAINT FK_ClienteCuentaGrupo_Cuenta FOREIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_ClienteCuentaGrupo_Cuenta
;
/****** Object:  ForeignKey FK_ClienteCuentaGrupo_CuentaGrupo    Script Date: 07/30/2012 17:05:21 ******/
ALTER TABLE ClienteCuentaGrupo  ADD  CONSTRAINT FK_ClienteCuentaGrupo_CuentaGrupo FOREIGN KEY(cueg_id)
REFERENCES CuentaGrupo (cueg_id)
;
-- FK_ClienteCuentaGrupo_CuentaGrupo
;
/****** Object:  ForeignKey FK_ClienteCuentaGrupo_Usuario    Script Date: 07/30/2012 17:05:21 ******/
ALTER TABLE ClienteCuentaGrupo  ADD  CONSTRAINT FK_ClienteCuentaGrupo_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ClienteCuentaGrupo_Usuario
;
/****** Object:  ForeignKey FK_ClientePercepcion_Percepcion    Script Date: 07/30/2012 17:05:23 ******/
ALTER TABLE ClientePercepcion  ADD  CONSTRAINT FK_ClientePercepcion_Percepcion FOREIGN KEY(perc_id)
REFERENCES Percepcion (perc_id)
;
-- FK_ClientePercepcion_Percepcion
;
/****** Object:  ForeignKey FK_ClienteRetencion_Cliente    Script Date: 07/30/2012 17:05:23 ******/
ALTER TABLE ClientePercepcion  ADD  CONSTRAINT FK_ClienteRetencion_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_ClienteRetencion_Cliente
;
/****** Object:  ForeignKey FK__ClienteSucursal_Usuario    Script Date: 07/30/2012 17:05:28 ******/
ALTER TABLE ClienteSucursal  ADD  CONSTRAINT FK__ClienteSucursal_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK__ClienteSucursal_Usuario
;
/****** Object:  ForeignKey FK_ClienteSucursal_Pais    Script Date: 07/30/2012 17:05:28 ******/
ALTER TABLE ClienteSucursal  ADD  CONSTRAINT FK_ClienteSucursal_Pais FOREIGN KEY(pa_id)
REFERENCES Pais (pa_id)
;
-- FK_ClienteSucursal_Pais
;
/****** Object:  ForeignKey FK_ClienteSucursal_Provincia    Script Date: 07/30/2012 17:05:29 ******/
ALTER TABLE ClienteSucursal  ADD  CONSTRAINT FK_ClienteSucursal_Provincia FOREIGN KEY(pro_id)
REFERENCES Provincia (pro_id)
;
-- FK_ClienteSucursal_Provincia
;
/****** Object:  ForeignKey FK_ClienteSucursal_Zona    Script Date: 07/30/2012 17:05:29 ******/
ALTER TABLE ClienteSucursal  ADD  CONSTRAINT FK_ClienteSucursal_Zona FOREIGN KEY(zon_id)
REFERENCES Zona (zon_id)
;
-- FK_ClienteSucursal_Zona
;
/****** Object:  ForeignKey FK_Cobrador_ReglaLiquidacion    Script Date: 07/30/2012 17:05:31 ******/
ALTER TABLE Cobrador  ADD  CONSTRAINT FK_Cobrador_ReglaLiquidacion FOREIGN KEY(rel_id)
REFERENCES ReglaLiquidacion (rel_id)
;
-- FK_Cobrador_ReglaLiquidacion
;
/****** Object:  ForeignKey FK_Cobranza_Asiento    Script Date: 07/30/2012 17:05:37 ******/
ALTER TABLE Cobranza  ADD  CONSTRAINT FK_Cobranza_Asiento FOREIGN KEY(as_id)
REFERENCES Asiento (as_id)
;
-- FK_Cobranza_Asiento
;
/****** Object:  ForeignKey FK_Cobranza_CentroCosto    Script Date: 07/30/2012 17:05:38 ******/
ALTER TABLE Cobranza  ADD  CONSTRAINT FK_Cobranza_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_Cobranza_CentroCosto
;
/****** Object:  ForeignKey FK_Cobranza_Cobrador    Script Date: 07/30/2012 17:05:38 ******/
ALTER TABLE Cobranza  ADD  CONSTRAINT FK_Cobranza_Cobrador FOREIGN KEY(cob_id)
REFERENCES Cobrador (cob_id)
;
-- FK_Cobranza_Cobrador
;
/****** Object:  ForeignKey FK_Cobranza_Legajo    Script Date: 07/30/2012 17:05:38 ******/
ALTER TABLE Cobranza  ADD  CONSTRAINT FK_Cobranza_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_Cobranza_Legajo
;
/****** Object:  ForeignKey FK_CobranzaItem_CentroCosto    Script Date: 07/30/2012 17:05:42 ******/
ALTER TABLE CobranzaItem  ADD  CONSTRAINT FK_CobranzaItem_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_CobranzaItem_CentroCosto
;
/****** Object:  ForeignKey FK_CobranzaItem_Cheque    Script Date: 07/30/2012 17:05:42 ******/
ALTER TABLE CobranzaItem  ADD  CONSTRAINT FK_CobranzaItem_Cheque FOREIGN KEY(cheq_id)
REFERENCES Cheque (cheq_id)
;
-- FK_CobranzaItem_Cheque
;
/****** Object:  ForeignKey FK_CobranzaItem_Cobranza    Script Date: 07/30/2012 17:05:43 ******/
ALTER TABLE CobranzaItem  ADD  CONSTRAINT FK_CobranzaItem_Cobranza FOREIGN KEY(cobz_id)
REFERENCES Cobranza (cobz_id)
;
-- FK_CobranzaItem_Cobranza
;
/****** Object:  ForeignKey FK_CobranzaItem_Cuenta    Script Date: 07/30/2012 17:05:43 ******/
ALTER TABLE CobranzaItem  ADD  CONSTRAINT FK_CobranzaItem_Cuenta FOREIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_CobranzaItem_Cuenta
;
/****** Object:  ForeignKey FK_CobranzaItem_Retencion    Script Date: 07/30/2012 17:05:43 ******/
ALTER TABLE CobranzaItem  ADD  CONSTRAINT FK_CobranzaItem_Retencion FOREIGN KEY(ret_id)
REFERENCES Retencion (ret_id)
;
-- FK_CobranzaItem_Retencion
;
/****** Object:  ForeignKey FK_CobranzaItem_TarjetaCreditoCupon    Script Date: 07/30/2012 17:05:43 ******/
ALTER TABLE CobranzaItem  ADD  CONSTRAINT FK_CobranzaItem_TarjetaCreditoCupon FOREIGN KEY(tjcc_id)
REFERENCES TarjetaCreditoCupon (tjcc_id)
;
-- FK_CobranzaItem_TarjetaCreditoCupon
;
/****** Object:  ForeignKey FK_CobranzaItemBorradoTMP_CobranzaTMP    Script Date: 07/30/2012 17:05:44 ******/
ALTER TABLE CobranzaItemBorradoTMP  ADD  CONSTRAINT FK_CobranzaItemBorradoTMP_CobranzaTMP FOREIGN KEY(cobzTMP_id)
REFERENCES CobranzaTMP (cobzTMP_id)
;
-- FK_CobranzaItemBorradoTMP_CobranzaTMP
;
/****** Object:  ForeignKey FK_CobranzaItemTMP_CobranzaTMP    Script Date: 07/30/2012 17:05:51 ******/
ALTER TABLE CobranzaItemTMP  ADD  CONSTRAINT FK_CobranzaItemTMP_CobranzaTMP FOREIGN KEY(cobzTMP_id)
REFERENCES CobranzaTMP (cobzTMP_id)
;
-- FK_CobranzaItemTMP_CobranzaTMP
;
/****** Object:  ForeignKey FK_CodigoPostalItem_CodigoPostal    Script Date: 07/30/2012 17:06:00 ******/
ALTER TABLE CodigoPostalItem  ADD  CONSTRAINT FK_CodigoPostalItem_CodigoPostal FOREIGN KEY(cpa_id)
REFERENCES CodigoPostal (cpa_id)
;
-- FK_CodigoPostalItem_CodigoPostal
;
/****** Object:  ForeignKey FK_CodigoPostalItem_Provincia    Script Date: 07/30/2012 17:06:00 ******/
ALTER TABLE CodigoPostalItem  ADD  CONSTRAINT FK_CodigoPostalItem_Provincia FOREIGN KEY(pro_id)
REFERENCES Provincia (pro_id)
;
-- FK_CodigoPostalItem_Provincia
;
/****** Object:  ForeignKey FK_Colmena_Usuario    Script Date: 07/30/2012 17:06:04 ******/
ALTER TABLE Colmena  ADD  CONSTRAINT FK_Colmena_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Colmena_Usuario
;
/****** Object:  ForeignKey FK_ComunidadInternet_DepositoLogico    Script Date: 07/30/2012 17:06:07 ******/
ALTER TABLE ComunidadInternet  ADD  CONSTRAINT FK_ComunidadInternet_DepositoLogico FOREIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_ComunidadInternet_DepositoLogico
;
/****** Object:  ForeignKey FK_ComunidadInternet_Documento    Script Date: 07/30/2012 17:06:07 ******/
ALTER TABLE ComunidadInternet  ADD  CONSTRAINT FK_ComunidadInternet_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_ComunidadInternet_Documento
;
/****** Object:  ForeignKey FK_ComunidadInternet_ListaDescuento    Script Date: 07/30/2012 17:06:08 ******/
ALTER TABLE ComunidadInternet  ADD  CONSTRAINT FK_ComunidadInternet_ListaDescuento FOREIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_ComunidadInternet_ListaDescuento
;
/****** Object:  ForeignKey FK_ComunidadInternet_ListaPrecio    Script Date: 07/30/2012 17:06:08 ******/
ALTER TABLE ComunidadInternet  ADD  CONSTRAINT FK_ComunidadInternet_ListaPrecio FOREIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_ComunidadInternet_ListaPrecio
;
/****** Object:  ForeignKey FK_ComunidadInternet_Producto    Script Date: 07/30/2012 17:06:08 ******/
ALTER TABLE ComunidadInternet  ADD  CONSTRAINT FK_ComunidadInternet_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ComunidadInternet_Producto
;
/****** Object:  ForeignKey FK_ComunidadInternet_Sucursal    Script Date: 07/30/2012 17:06:08 ******/
ALTER TABLE ComunidadInternet  ADD  CONSTRAINT FK_ComunidadInternet_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_ComunidadInternet_Sucursal
;
/****** Object:  ForeignKey FK_ComunidadInternet_Usuario    Script Date: 07/30/2012 17:06:08 ******/
ALTER TABLE ComunidadInternet  ADD  CONSTRAINT FK_ComunidadInternet_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ComunidadInternet_Usuario
;
/****** Object:  ForeignKey FK_ComunidadInternetAplicacion_ComunidadInternet    Script Date: 07/30/2012 17:06:10 ******/
ALTER TABLE ComunidadInternetAplicacion  ADD  CONSTRAINT FK_ComunidadInternetAplicacion_ComunidadInternet FOREIGN KEY(cmia_id)
REFERENCES ComunidadInternet (cmi_id)
;
-- FK_ComunidadInternetAplicacion_ComunidadInternet
;
/****** Object:  ForeignKey FK_ComunidadInternetAplicacion_Usuario    Script Date: 07/30/2012 17:06:10 ******/
ALTER TABLE ComunidadInternetAplicacion  ADD  CONSTRAINT FK_ComunidadInternetAplicacion_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ComunidadInternetAplicacion_Usuario
;
/****** Object:  ForeignKey FK_ComunidadInternetCobro_Cliente    Script Date: 07/30/2012 17:06:14 ******/
ALTER TABLE ComunidadInternetCobro  ADD  CONSTRAINT FK_ComunidadInternetCobro_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_ComunidadInternetCobro_Cliente
;
/****** Object:  ForeignKey FK_ComunidadInternetCobro_ComunidadInternet    Script Date: 07/30/2012 17:06:14 ******/
ALTER TABLE ComunidadInternetCobro  ADD  CONSTRAINT FK_ComunidadInternetCobro_ComunidadInternet FOREIGN KEY(cmi_id)
REFERENCES ComunidadInternet (cmi_id)
;
-- FK_ComunidadInternetCobro_ComunidadInternet
;
/****** Object:  ForeignKey FK_ComunidadInternetCobro_Producto    Script Date: 07/30/2012 17:06:14 ******/
ALTER TABLE ComunidadInternetCobro  ADD  CONSTRAINT FK_ComunidadInternetCobro_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ComunidadInternetCobro_Producto
;
/****** Object:  ForeignKey FK_ComunidadInternetEmailAccount_Usuario    Script Date: 07/30/2012 17:06:17 ******/
ALTER TABLE ComunidadInternetEmailAccount  ADD  CONSTRAINT FK_ComunidadInternetEmailAccount_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ComunidadInternetEmailAccount_Usuario
;
/****** Object:  ForeignKey FK_ComunidadInternetMail_Cliente    Script Date: 07/30/2012 17:06:21 ******/
ALTER TABLE ComunidadInternetMail  ADD  CONSTRAINT FK_ComunidadInternetMail_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_ComunidadInternetMail_Cliente
;
/****** Object:  ForeignKey FK_ComunidadInternetMail_ComunidadInternet    Script Date: 07/30/2012 17:06:21 ******/
ALTER TABLE ComunidadInternetMail  ADD  CONSTRAINT FK_ComunidadInternetMail_ComunidadInternet FOREIGN KEY(cmi_id)
REFERENCES ComunidadInternet (cmi_id)
;
-- FK_ComunidadInternetMail_ComunidadInternet
;
/****** Object:  ForeignKey FK_ComunidadInternetMail_Estado    Script Date: 07/30/2012 17:06:21 ******/
ALTER TABLE ComunidadInternetMail  ADD  CONSTRAINT FK_ComunidadInternetMail_Estado FOREIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_ComunidadInternetMail_Estado
;
/****** Object:  ForeignKey FK_ComunidadInternetMail_PedidoVenta    Script Date: 07/30/2012 17:06:21 ******/
ALTER TABLE ComunidadInternetMail  ADD  CONSTRAINT FK_ComunidadInternetMail_PedidoVenta FOREIGN KEY(pv_id)
REFERENCES PedidoVenta (pv_id)
;
-- FK_ComunidadInternetMail_PedidoVenta
;
/****** Object:  ForeignKey FK_ComunidadInternetMailItem_ComunidadInternetMail    Script Date: 07/30/2012 17:06:22 ******/
ALTER TABLE ComunidadInternetMailItem  ADD  CONSTRAINT FK_ComunidadInternetMailItem_ComunidadInternetMail FOREIGN KEY(cmie_id)
REFERENCES ComunidadInternetMail (cmie_id)
;
-- FK_ComunidadInternetMailItem_ComunidadInternetMail
;
/****** Object:  ForeignKey FK_ComunidadInternetMailItem_ComunidadInternetTexto    Script Date: 07/30/2012 17:06:22 ******/
ALTER TABLE ComunidadInternetMailItem  ADD  CONSTRAINT FK_ComunidadInternetMailItem_ComunidadInternetTexto FOREIGN KEY(cmiti_id)
REFERENCES ComunidadInternetTextoItem (cmiti_id)
;
-- FK_ComunidadInternetMailItem_ComunidadInternetTexto
;
/****** Object:  ForeignKey FK_ComunidadInternetProducto_ComunidadInternet    Script Date: 07/30/2012 17:06:29 ******/
ALTER TABLE ComunidadInternetProducto  ADD  CONSTRAINT FK_ComunidadInternetProducto_ComunidadInternet FOREIGN KEY(cmi_id)
REFERENCES ComunidadInternet (cmi_id)
;
-- FK_ComunidadInternetProducto_ComunidadInternet
;
/****** Object:  ForeignKey FK_ComunidadInternetRespuesta_ComunidadInternet    Script Date: 07/30/2012 17:06:31 ******/
ALTER TABLE ComunidadInternetRespuesta  ADD  CONSTRAINT FK_ComunidadInternetRespuesta_ComunidadInternet FOREIGN KEY(cmi_id)
REFERENCES ComunidadInternet (cmi_id)
;
-- FK_ComunidadInternetRespuesta_ComunidadInternet
;
/****** Object:  ForeignKey FK_ComunidadInternetRespuesta_ComunidadInternetAplicacion    Script Date: 07/30/2012 17:06:31 ******/
ALTER TABLE ComunidadInternetRespuesta  ADD  CONSTRAINT FK_ComunidadInternetRespuesta_ComunidadInternetAplicacion FOREIGN KEY(cmia_id)
REFERENCES ComunidadInternetAplicacion (cmia_id)
;
-- FK_ComunidadInternetRespuesta_ComunidadInternetAplicacion
;
/****** Object:  ForeignKey FK_ComunidadInternetRespuesta_ComunidadInternetMail    Script Date: 07/30/2012 17:06:31 ******/
ALTER TABLE ComunidadInternetRespuesta  ADD  CONSTRAINT FK_ComunidadInternetRespuesta_ComunidadInternetMail FOREIGN KEY(cmie_id)
REFERENCES ComunidadInternetMail (cmie_id)
;
-- FK_ComunidadInternetRespuesta_ComunidadInternetMail
;
/****** Object:  ForeignKey FK_ComunidadInternetRespuestaPlantilla_ComunidadInternet    Script Date: 07/30/2012 17:06:35 ******/
ALTER TABLE ComunidadInternetRespuestaPlantilla  ADD  CONSTRAINT FK_ComunidadInternetRespuestaPlantilla_ComunidadInternet FOREIGN KEY(cmi_id)
REFERENCES ComunidadInternet (cmi_id)
;
-- FK_ComunidadInternetRespuestaPlantilla_ComunidadInternet
;
/****** Object:  ForeignKey FK_ComunidadInternetRespuestaPlantilla_ComunidadInternetAplicacion    Script Date: 07/30/2012 17:06:35 ******/
ALTER TABLE ComunidadInternetRespuestaPlantilla  ADD  CONSTRAINT FK_ComunidadInternetRespuestaPlantilla_ComunidadInternetAplicac FOREIGN KEY(cmia_id)
REFERENCES ComunidadInternetAplicacion (cmia_id)
;
-- FK_ComunidadInternetRespuestaPlantilla_ComunidadInternetAplicacion
;
/****** Object:  ForeignKey FK_ComunidadInternetRespuestaPlantilla_Idioma    Script Date: 07/30/2012 17:06:35 ******/
ALTER TABLE ComunidadInternetRespuestaPlantilla  ADD  CONSTRAINT FK_ComunidadInternetRespuestaPlantilla_Idioma FOREIGN KEY(idm_id)
REFERENCES Idioma (idm_id)
;
-- FK_ComunidadInternetRespuestaPlantilla_Idioma
;
/****** Object:  ForeignKey FK_ComunidadInternetRespuestaPlantilla_Marca    Script Date: 07/30/2012 17:06:35 ******/
ALTER TABLE ComunidadInternetRespuestaPlantilla  ADD  CONSTRAINT FK_ComunidadInternetRespuestaPlantilla_Marca FOREIGN KEY(marc_id)
REFERENCES Marca (marc_id)
;
-- FK_ComunidadInternetRespuestaPlantilla_Marca
;
/****** Object:  ForeignKey FK_ComunidadInternetRespuestaPlantilla_Producto    Script Date: 07/30/2012 17:06:35 ******/
ALTER TABLE ComunidadInternetRespuestaPlantilla  ADD  CONSTRAINT FK_ComunidadInternetRespuestaPlantilla_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ComunidadInternetRespuestaPlantilla_Producto
;
/****** Object:  ForeignKey FK_ComunidadInternetRespuestaPlantilla_Rubro    Script Date: 07/30/2012 17:06:35 ******/
ALTER TABLE ComunidadInternetRespuestaPlantilla  ADD  CONSTRAINT FK_ComunidadInternetRespuestaPlantilla_Rubro FOREIGN KEY(rub_id)
REFERENCES Rubro (rub_id)
;
-- FK_ComunidadInternetRespuestaPlantilla_Rubro
;
/****** Object:  ForeignKey FK_ComunidadInternetRespuestaPlantilla_Usuario    Script Date: 07/30/2012 17:06:35 ******/
ALTER TABLE ComunidadInternetRespuestaPlantilla  ADD  CONSTRAINT FK_ComunidadInternetRespuestaPlantilla_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ComunidadInternetRespuestaPlantilla_Usuario
;
/****** Object:  ForeignKey FK_ComunidadInternetTexto_ComunidadInternet1    Script Date: 07/30/2012 17:06:38 ******/
ALTER TABLE ComunidadInternetTexto  ADD  CONSTRAINT FK_ComunidadInternetTexto_ComunidadInternet1 FOREIGN KEY(cmi_id)
REFERENCES ComunidadInternet (cmi_id)
;
-- FK_ComunidadInternetTexto_ComunidadInternet1
;
/****** Object:  ForeignKey FK_ComunidadInternetTexto_ComunidadInternetAplicacion1    Script Date: 07/30/2012 17:06:38 ******/
ALTER TABLE ComunidadInternetTexto  ADD  CONSTRAINT FK_ComunidadInternetTexto_ComunidadInternetAplicacion1 FOREIGN KEY(cmia_id)
REFERENCES ComunidadInternetAplicacion (cmia_id)
;
-- FK_ComunidadInternetTexto_ComunidadInternetAplicacion1
;
/****** Object:  ForeignKey FK_ComunidadInternetTexto_ComunidadInternetEmailAccount    Script Date: 07/30/2012 17:06:38 ******/
ALTER TABLE ComunidadInternetTexto  ADD  CONSTRAINT FK_ComunidadInternetTexto_ComunidadInternetEmailAccount FOREIGN KEY(cmiea_id)
REFERENCES ComunidadInternetEmailAccount (cmiea_id)
;
-- FK_ComunidadInternetTexto_ComunidadInternetEmailAccount
;
/****** Object:  ForeignKey FK_ComunidadInternetTexto_Idioma    Script Date: 07/30/2012 17:06:38 ******/
ALTER TABLE ComunidadInternetTexto  ADD  CONSTRAINT FK_ComunidadInternetTexto_Idioma FOREIGN KEY(idm_id)
REFERENCES Idioma (idm_id)
;
-- FK_ComunidadInternetTexto_Idioma
;
/****** Object:  ForeignKey FK_ComunidadInternetTexto_Padre    Script Date: 07/30/2012 17:06:41 ******/
ALTER TABLE ComunidadInternetTextoItem  ADD  CONSTRAINT FK_ComunidadInternetTexto_Padre FOREIGN KEY(cmiti_id)
REFERENCES ComunidadInternetTextoItem (cmiti_id)
;
-- FK_ComunidadInternetTexto_Padre
;
/****** Object:  ForeignKey FK_ComunidadInternetTextoItem_ComunidadInternetTexto    Script Date: 07/30/2012 17:06:41 ******/
ALTER TABLE ComunidadInternetTextoItem  ADD  CONSTRAINT FK_ComunidadInternetTextoItem_ComunidadInternetTexto FOREIGN KEY(cmit_id)
REFERENCES ComunidadInternetTexto (cmit_id)
;
-- FK_ComunidadInternetTextoItem_ComunidadInternetTexto
;
/****** Object:  ForeignKey FK_ComunidadInternetVenta_ComunidadInternet    Script Date: 07/30/2012 17:06:46 ******/
ALTER TABLE ComunidadInternetVenta  ADD  CONSTRAINT FK_ComunidadInternetVenta_ComunidadInternet FOREIGN KEY(cmi_id)
REFERENCES ComunidadInternet (cmi_id)
;
-- FK_ComunidadInternetVenta_ComunidadInternet
;
/****** Object:  ForeignKey FK_ComunidadInternetVenta_ComunidadInternetMail    Script Date: 07/30/2012 17:06:46 ******/
ALTER TABLE ComunidadInternetVenta  ADD  CONSTRAINT FK_ComunidadInternetVenta_ComunidadInternetMail FOREIGN KEY(cmie_id)
REFERENCES ComunidadInternetMail (cmie_id)
;
-- FK_ComunidadInternetVenta_ComunidadInternetMail
;
/****** Object:  ForeignKey FK_CondicionPago_CuentaGrupo    Script Date: 07/30/2012 17:06:49 ******/
ALTER TABLE CondicionPago  ADD  CONSTRAINT FK_CondicionPago_CuentaGrupo FOREIGN KEY(cueg_id)
REFERENCES CuentaGrupo (cueg_id)
;
-- FK_CondicionPago_CuentaGrupo
;
/****** Object:  ForeignKey FK_CondicionPago_Documento    Script Date: 07/30/2012 17:06:49 ******/
ALTER TABLE CondicionPago  ADD  CONSTRAINT FK_CondicionPago_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_CondicionPago_Documento
;
/****** Object:  ForeignKey FK_CondicionPago_Usuario    Script Date: 07/30/2012 17:06:49 ******/
ALTER TABLE CondicionPago  ADD  CONSTRAINT FK_CondicionPago_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_CondicionPago_Usuario
;
/****** Object:  ForeignKey FK_CondicionPagoItem_CondicionPago    Script Date: 07/30/2012 17:06:50 ******/
ALTER TABLE CondicionPagoItem  ADD  CONSTRAINT FK_CondicionPagoItem_CondicionPago FOREIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_CondicionPagoItem_CondicionPago
;
/****** Object:  ForeignKey FK_Configuracion_Empresa    Script Date: 07/30/2012 17:06:52 ******/
ALTER TABLE Configuracion  ADD  CONSTRAINT FK_Configuracion_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_Configuracion_Empresa
;
/****** Object:  ForeignKey FK_CalibradoraC_Usuario1    Script Date: 07/30/2012 17:06:54 ******/
ALTER TABLE ConfiguracionCalibradora  ADD  CONSTRAINT FK_CalibradoraC_Usuario1 FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_CalibradoraC_Usuario1
;
/****** Object:  ForeignKey FK_Contacto_Agenda    Script Date: 07/30/2012 17:07:02 ******/
ALTER TABLE Contacto  ADD  CONSTRAINT FK_Contacto_Agenda FOREIGN KEY(agn_id)
REFERENCES Agenda (agn_id)
;
-- FK_Contacto_Agenda
;
/****** Object:  ForeignKey FK_Contacto_Ciudad    Script Date: 07/30/2012 17:07:02 ******/
ALTER TABLE Contacto  ADD  CONSTRAINT FK_Contacto_Ciudad FOREIGN KEY(ciu_id)
REFERENCES Ciudad (ciu_id)
;
-- FK_Contacto_Ciudad
;
/****** Object:  ForeignKey FK_Contacto_Cliente    Script Date: 07/30/2012 17:07:02 ******/
ALTER TABLE Contacto  ADD  CONSTRAINT FK_Contacto_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_Contacto_Cliente
;
/****** Object:  ForeignKey FK_Contacto_Proveedor    Script Date: 07/30/2012 17:07:02 ******/
ALTER TABLE Contacto  ADD  CONSTRAINT FK_Contacto_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_Contacto_Proveedor
;
/****** Object:  ForeignKey FK_Contacto_Provincia    Script Date: 07/30/2012 17:07:02 ******/
ALTER TABLE Contacto  ADD  CONSTRAINT FK_Contacto_Provincia FOREIGN KEY(pro_id)
REFERENCES Provincia (pro_id)
;
-- FK_Contacto_Provincia
;
/****** Object:  ForeignKey FK_Contacto_Usuario    Script Date: 07/30/2012 17:07:02 ******/
ALTER TABLE Contacto  ADD  CONSTRAINT FK_Contacto_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Contacto_Usuario
;
/****** Object:  ForeignKey FK_Contacto_Usuario1    Script Date: 07/30/2012 17:07:02 ******/
ALTER TABLE Contacto  ADD  CONSTRAINT FK_Contacto_Usuario1 FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_Contacto_Usuario1
;
/****** Object:  ForeignKey FK_ContraMarca_Usuario    Script Date: 07/30/2012 17:07:04 ******/
ALTER TABLE ContraMarca  ADD  CONSTRAINT FK_ContraMarca_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ContraMarca_Usuario
;
/****** Object:  ForeignKey FK_CotizacionCompra_CentroCosto    Script Date: 07/30/2012 17:07:10 ******/
ALTER TABLE CotizacionCompra  ADD  CONSTRAINT FK_CotizacionCompra_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_CotizacionCompra_CentroCosto
;
/****** Object:  ForeignKey FK_CotizacionCompra_CondicionPago    Script Date: 07/30/2012 17:07:10 ******/
ALTER TABLE CotizacionCompra  ADD  CONSTRAINT FK_CotizacionCompra_CondicionPago FOREIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_CotizacionCompra_CondicionPago
;
/****** Object:  ForeignKey FK_CotizacionCompra_Documento    Script Date: 07/30/2012 17:07:10 ******/
ALTER TABLE CotizacionCompra  ADD  CONSTRAINT FK_CotizacionCompra_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_CotizacionCompra_Documento
;
/****** Object:  ForeignKey FK_CotizacionCompra_DocumentoTipo    Script Date: 07/30/2012 17:07:10 ******/
ALTER TABLE CotizacionCompra  ADD  CONSTRAINT FK_CotizacionCompra_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_CotizacionCompra_DocumentoTipo
;
/****** Object:  ForeignKey FK_CotizacionCompra_Legajo    Script Date: 07/30/2012 17:07:10 ******/
ALTER TABLE CotizacionCompra  ADD  CONSTRAINT FK_CotizacionCompra_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_CotizacionCompra_Legajo
;
/****** Object:  ForeignKey FK_CotizacionCompra_ListaPrecio    Script Date: 07/30/2012 17:07:11 ******/
ALTER TABLE CotizacionCompra  ADD  CONSTRAINT FK_CotizacionCompra_ListaPrecio FOREIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_CotizacionCompra_ListaPrecio
;
/****** Object:  ForeignKey FK_CotizacionCompra_UsSolicito    Script Date: 07/30/2012 17:07:11 ******/
ALTER TABLE CotizacionCompra  ADD  CONSTRAINT FK_CotizacionCompra_UsSolicito FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_CotizacionCompra_UsSolicito
;
/****** Object:  ForeignKey FK_CotizacionCompra_Usuario    Script Date: 07/30/2012 17:07:11 ******/
ALTER TABLE CotizacionCompra  ADD  CONSTRAINT FK_CotizacionCompra_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_CotizacionCompra_Usuario
;
/****** Object:  ForeignKey FK_CotizacionCompraItem_CentroCosto    Script Date: 07/30/2012 17:07:15 ******/
ALTER TABLE CotizacionCompraItem  ADD  CONSTRAINT FK_CotizacionCompraItem_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_CotizacionCompraItem_CentroCosto
;
/****** Object:  ForeignKey FK_CotizacionCompraItem_CotizacionCompra    Script Date: 07/30/2012 17:07:15 ******/
ALTER TABLE CotizacionCompraItem  ADD  CONSTRAINT FK_CotizacionCompraItem_CotizacionCompra FOREIGN KEY(cot_id)
REFERENCES CotizacionCompra (cot_id)
;
-- FK_CotizacionCompraItem_CotizacionCompra
;
/****** Object:  ForeignKey FK_CotizacionCompraItem_Producto    Script Date: 07/30/2012 17:07:15 ******/
ALTER TABLE CotizacionCompraItem  ADD  CONSTRAINT FK_CotizacionCompraItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_CotizacionCompraItem_Producto
;
/****** Object:  ForeignKey FK_CotizacionCompraItemBorradoTMP_CotizacionCompraTMP    Script Date: 07/30/2012 17:07:16 ******/
ALTER TABLE CotizacionCompraItemBorradoTMP  ADD  CONSTRAINT FK_CotizacionCompraItemBorradoTMP_CotizacionCompraTMP FOREIGN KEY(cotTMP_id)
REFERENCES CotizacionCompraTMP (cotTMP_id)
;
-- FK_CotizacionCompraItemBorradoTMP_CotizacionCompraTMP
;
/****** Object:  ForeignKey FK_CotizacionCompraItemTMP_CotizacionCompraTMP    Script Date: 07/30/2012 17:07:21 ******/
ALTER TABLE CotizacionCompraItemTMP  ADD  CONSTRAINT FK_CotizacionCompraItemTMP_CotizacionCompraTMP FOREIGN KEY(cotTMP_id)
REFERENCES CotizacionCompraTMP (cotTMP_id)
;
-- FK_CotizacionCompraItemTMP_CotizacionCompraTMP
;
/****** Object:  ForeignKey FK_CotizacionOrdenCompra_CotizacionCompraItem    Script Date: 07/30/2012 17:07:27 ******/
ALTER TABLE CotizacionOrdenCompra  ADD  CONSTRAINT FK_CotizacionOrdenCompra_CotizacionCompraItem FOREIGN KEY(coti_id)
REFERENCES CotizacionCompraItem (coti_id)
;
-- FK_CotizacionOrdenCompra_CotizacionCompraItem
;
/****** Object:  ForeignKey FK_CotizacionOrdenCompra_OrdenCompraItem    Script Date: 07/30/2012 17:07:27 ******/
ALTER TABLE CotizacionOrdenCompra  ADD  CONSTRAINT FK_CotizacionOrdenCompra_OrdenCompraItem FOREIGN KEY(oci_id)
REFERENCES OrdenCompraItem (oci_id)
;
-- FK_CotizacionOrdenCompra_OrdenCompraItem
;
/****** Object:  ForeignKey FK_CotizacionPresupuestoCompra_CotizacionCompraItem    Script Date: 07/30/2012 17:07:30 ******/
ALTER TABLE CotizacionPresupuestoCompra  ADD  CONSTRAINT FK_CotizacionPresupuestoCompra_CotizacionCompraItem FOREIGN KEY(coti_id)
REFERENCES CotizacionCompraItem (coti_id)
;
-- FK_CotizacionPresupuestoCompra_CotizacionCompraItem
;
/****** Object:  ForeignKey FK_CotizacionPresupuestoCompra_PresupuestoCompraItem    Script Date: 07/30/2012 17:07:30 ******/
ALTER TABLE CotizacionPresupuestoCompra  ADD  CONSTRAINT FK_CotizacionPresupuestoCompra_PresupuestoCompraItem FOREIGN KEY(prci_id)
REFERENCES PresupuestoCompraItem (prci_id)
;
-- FK_CotizacionPresupuestoCompra_PresupuestoCompraItem
;
/****** Object:  ForeignKey CuentaCategoria_Cuenta_LibroIva    Script Date: 07/30/2012 17:07:36 ******/
ALTER TABLE Cuenta  ADD  CONSTRAINT CuentaCategoria_Cuenta_LibroIva FOREIGN KEY(cuec_id_libroiva)
REFERENCES CuentaCategoria (cuec_id)
;
-- CuentaCategoria_Cuenta_LibroIva
;
/****** Object:  ForeignKey FK_Cuenta_Banco    Script Date: 07/30/2012 17:07:36 ******/
ALTER TABLE Cuenta  ADD  CONSTRAINT FK_Cuenta_Banco FOREIGN KEY(bco_id)
REFERENCES Banco (bco_id)
;
-- FK_Cuenta_Banco
;
/****** Object:  ForeignKey FK_Cuenta_CuentaCategoria    Script Date: 07/30/2012 17:07:36 ******/
ALTER TABLE Cuenta  ADD  CONSTRAINT FK_Cuenta_CuentaCategoria FOREIGN KEY(cuec_id)
REFERENCES CuentaCategoria (cuec_id)
;
-- FK_Cuenta_CuentaCategoria
;
/****** Object:  ForeignKey FK_Cuenta_Empresa    Script Date: 07/30/2012 17:07:36 ******/
ALTER TABLE Cuenta  ADD  CONSTRAINT FK_Cuenta_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_Cuenta_Empresa
;
/****** Object:  ForeignKey FK_Cuenta_Moneda    Script Date: 07/30/2012 17:07:36 ******/
ALTER TABLE Cuenta  ADD  CONSTRAINT FK_Cuenta_Moneda FOREIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_Cuenta_Moneda
;
/****** Object:  ForeignKey FK_Cuenta_Usuario    Script Date: 07/30/2012 17:07:36 ******/
ALTER TABLE Cuenta  ADD  CONSTRAINT FK_Cuenta_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Cuenta_Usuario
;
/****** Object:  ForeignKey FK_CuentaCategoria_Usuario    Script Date: 07/30/2012 17:07:38 ******/
ALTER TABLE CuentaCategoria  ADD  CONSTRAINT FK_CuentaCategoria_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_CuentaCategoria_Usuario
;
/****** Object:  ForeignKey FK_CuentaGrupo_Cuenta    Script Date: 07/30/2012 17:07:41 ******/
ALTER TABLE CuentaGrupo  ADD  CONSTRAINT FK_CuentaGrupo_Cuenta FOREIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_CuentaGrupo_Cuenta
;
/****** Object:  ForeignKey FK_CuentaGrupo_Usuario    Script Date: 07/30/2012 17:07:41 ******/
ALTER TABLE CuentaGrupo  ADD  CONSTRAINT FK_CuentaGrupo_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_CuentaGrupo_Usuario
;
/****** Object:  ForeignKey FK_Curso_Materia    Script Date: 07/30/2012 17:07:44 ******/
ALTER TABLE Curso  ADD  CONSTRAINT FK_Curso_Materia FOREIGN KEY(mat_id)
REFERENCES Materia (mat_id)
;
-- FK_Curso_Materia
;
/****** Object:  ForeignKey FK_Curso_Profesor    Script Date: 07/30/2012 17:07:44 ******/
ALTER TABLE Curso  ADD  CONSTRAINT FK_Curso_Profesor FOREIGN KEY(prof_id)
REFERENCES Profesor (prof_id)
;
-- FK_Curso_Profesor
;
/****** Object:  ForeignKey FK_Curso_ProfesorAyudante1    Script Date: 07/30/2012 17:07:45 ******/
ALTER TABLE Curso  ADD  CONSTRAINT FK_Curso_ProfesorAyudante1 FOREIGN KEY(prof_id_ayudante1)
REFERENCES Profesor (prof_id)
;
-- FK_Curso_ProfesorAyudante1
;
/****** Object:  ForeignKey FK_Curso_ProfesorAyudante2    Script Date: 07/30/2012 17:07:45 ******/
ALTER TABLE Curso  ADD  CONSTRAINT FK_Curso_ProfesorAyudante2 FOREIGN KEY(prof_id_ayudante2)
REFERENCES Profesor (prof_id)
;
-- FK_Curso_ProfesorAyudante2
;
/****** Object:  ForeignKey FK_Curso_ProfesorAyudante3    Script Date: 07/30/2012 17:07:45 ******/
ALTER TABLE Curso  ADD  CONSTRAINT FK_Curso_ProfesorAyudante3 FOREIGN KEY(prof_id_ayudante3)
REFERENCES Profesor (prof_id)
;
-- FK_Curso_ProfesorAyudante3
;
/****** Object:  ForeignKey FK_Curso_ProfesorAyudante4    Script Date: 07/30/2012 17:07:45 ******/
ALTER TABLE Curso  ADD  CONSTRAINT FK_Curso_ProfesorAyudante4 FOREIGN KEY(prof_id_ayudante4)
REFERENCES Profesor (prof_id)
;
-- FK_Curso_ProfesorAyudante4
;
/****** Object:  ForeignKey FK_Curso_ProfesorAyudante5    Script Date: 07/30/2012 17:07:45 ******/
ALTER TABLE Curso  ADD  CONSTRAINT FK_Curso_ProfesorAyudante5 FOREIGN KEY(prof_id_ayudante5)
REFERENCES Profesor (prof_id)
;
-- FK_Curso_ProfesorAyudante5
;
/****** Object:  ForeignKey FK_CursoClase_Aula    Script Date: 07/30/2012 17:07:47 ******/
ALTER TABLE CursoClase  ADD  CONSTRAINT FK_CursoClase_Aula FOREIGN KEY(aula_id)
REFERENCES Aula (aula_id)
;
-- FK_CursoClase_Aula
;
/****** Object:  ForeignKey FK_CursoClase_Curso    Script Date: 07/30/2012 17:07:47 ******/
ALTER TABLE CursoClase  ADD  CONSTRAINT FK_CursoClase_Curso FOREIGN KEY(cur_id)
REFERENCES Curso (cur_id)
;
-- FK_CursoClase_Curso
;
/****** Object:  ForeignKey FK_CursoExamen_Aula    Script Date: 07/30/2012 17:07:48 ******/
ALTER TABLE CursoExamen  ADD  CONSTRAINT FK_CursoExamen_Aula FOREIGN KEY(aula_id)
REFERENCES Aula (aula_id)
;
-- FK_CursoExamen_Aula
;
/****** Object:  ForeignKey FK_CursoExamen_Curso    Script Date: 07/30/2012 17:07:49 ******/
ALTER TABLE CursoExamen  ADD  CONSTRAINT FK_CursoExamen_Curso FOREIGN KEY(cur_id)
REFERENCES Curso (cur_id)
;
-- FK_CursoExamen_Curso
;
/****** Object:  ForeignKey FK_CursoItem_Alumno    Script Date: 07/30/2012 17:07:50 ******/
ALTER TABLE CursoItem  ADD  CONSTRAINT FK_CursoItem_Alumno FOREIGN KEY(alum_id)
REFERENCES Alumno (alum_id)
;
-- FK_CursoItem_Alumno
;
/****** Object:  ForeignKey FK_CursoItem_Curso    Script Date: 07/30/2012 17:07:50 ******/
ALTER TABLE CursoItem  ADD  CONSTRAINT FK_CursoItem_Curso FOREIGN KEY(cur_id)
REFERENCES Curso (cur_id)
;
-- FK_CursoItem_Curso
;
/****** Object:  ForeignKey FK_CursoItem_Estado    Script Date: 07/30/2012 17:07:50 ******/
ALTER TABLE CursoItem  ADD  CONSTRAINT FK_CursoItem_Estado FOREIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_CursoItem_Estado
;
/****** Object:  ForeignKey FK_CursoItem_Profesor    Script Date: 07/30/2012 17:07:50 ******/
ALTER TABLE CursoItem  ADD  CONSTRAINT FK_CursoItem_Profesor FOREIGN KEY(prof_id)
REFERENCES Profesor (prof_id)
;
-- FK_CursoItem_Profesor
;
/****** Object:  ForeignKey FK_CursoItemAsistencia_CursoClase    Script Date: 07/30/2012 17:07:51 ******/
ALTER TABLE CursoItemAsistencia  ADD  CONSTRAINT FK_CursoItemAsistencia_CursoClase FOREIGN KEY(curc_id)
REFERENCES CursoClase (curc_id)
;
-- FK_CursoItemAsistencia_CursoClase
;
/****** Object:  ForeignKey FK_CursoItemAsistencia_CursoItem    Script Date: 07/30/2012 17:07:51 ******/
ALTER TABLE CursoItemAsistencia  ADD  CONSTRAINT FK_CursoItemAsistencia_CursoItem FOREIGN KEY(curi_id)
REFERENCES CursoItem (curi_id)
;
-- FK_CursoItemAsistencia_CursoItem
;
/****** Object:  ForeignKey FK_CursoItemCalificacion_CursoExamen    Script Date: 07/30/2012 17:07:52 ******/
ALTER TABLE CursoItemCalificacion  ADD  CONSTRAINT FK_CursoItemCalificacion_CursoExamen FOREIGN KEY(cure_id)
REFERENCES CursoExamen (cure_id)
;
-- FK_CursoItemCalificacion_CursoExamen
;
/****** Object:  ForeignKey FK_CursoItemCalificacion_CursoItem    Script Date: 07/30/2012 17:07:53 ******/
ALTER TABLE CursoItemCalificacion  ADD  CONSTRAINT FK_CursoItemCalificacion_CursoItem FOREIGN KEY(curi_id)
REFERENCES CursoItem (curi_id)
;
-- FK_CursoItemCalificacion_CursoItem
;
/****** Object:  ForeignKey FK_Departamento_DepartamentoTipo    Script Date: 07/30/2012 17:07:56 ******/
ALTER TABLE Departamento  ADD  CONSTRAINT FK_Departamento_DepartamentoTipo FOREIGN KEY(dptot_id)
REFERENCES DepartamentoTipo (dptot_id)
;
-- FK_Departamento_DepartamentoTipo
;
/****** Object:  ForeignKey FK_Departamento_Empresa    Script Date: 07/30/2012 17:07:56 ******/
ALTER TABLE Departamento  ADD  CONSTRAINT FK_Departamento_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_Departamento_Empresa
;
/****** Object:  ForeignKey FK_Departamento_PrestacionAddDoc    Script Date: 07/30/2012 17:07:57 ******/
ALTER TABLE Departamento  ADD  CONSTRAINT FK_Departamento_PrestacionAddDoc FOREIGN KEY(pre_id_agregardocumentos)
REFERENCES Prestacion (pre_id)
;
-- FK_Departamento_PrestacionAddDoc
;
/****** Object:  ForeignKey FK_Departamento_Prestacionasignartareas    Script Date: 07/30/2012 17:07:57 ******/
ALTER TABLE Departamento  ADD  CONSTRAINT FK_Departamento_Prestacionasignartareas FOREIGN KEY(pre_id_asignartareas)
REFERENCES Prestacion (pre_id)
;
-- FK_Departamento_Prestacionasignartareas
;
/****** Object:  ForeignKey FK_Departamento_PrestacionDelDoc    Script Date: 07/30/2012 17:07:57 ******/
ALTER TABLE Departamento  ADD  CONSTRAINT FK_Departamento_PrestacionDelDoc FOREIGN KEY(pre_id_borrardocumentos)
REFERENCES Prestacion (pre_id)
;
-- FK_Departamento_PrestacionDelDoc
;
/****** Object:  ForeignKey FK_Departamento_Prestacioneditarnoticias    Script Date: 07/30/2012 17:07:57 ******/
ALTER TABLE Departamento  ADD  CONSTRAINT FK_Departamento_Prestacioneditarnoticias FOREIGN KEY(pre_id_editarnoticias)
REFERENCES Prestacion (pre_id)
;
-- FK_Departamento_Prestacioneditarnoticias
;
/****** Object:  ForeignKey FK_Departamento_PrestacionEditDoc    Script Date: 07/30/2012 17:07:57 ******/
ALTER TABLE Departamento  ADD  CONSTRAINT FK_Departamento_PrestacionEditDoc FOREIGN KEY(pre_id_editardocumentos)
REFERENCES Prestacion (pre_id)
;
-- FK_Departamento_PrestacionEditDoc
;
/****** Object:  ForeignKey FK_Departamento_PrestacionVerDoc    Script Date: 07/30/2012 17:07:57 ******/
ALTER TABLE Departamento  ADD  CONSTRAINT FK_Departamento_PrestacionVerDoc FOREIGN KEY(pre_id_verdocumentos)
REFERENCES Prestacion (pre_id)
;
-- FK_Departamento_PrestacionVerDoc
;
/****** Object:  ForeignKey FK_Departamento_Prestacionvernoticias    Script Date: 07/30/2012 17:07:57 ******/
ALTER TABLE Departamento  ADD  CONSTRAINT FK_Departamento_Prestacionvernoticias FOREIGN KEY(pre_id_vernoticias)
REFERENCES Prestacion (pre_id)
;
-- FK_Departamento_Prestacionvernoticias
;
/****** Object:  ForeignKey FK_Departamento_Prestacionvertareas    Script Date: 07/30/2012 17:07:57 ******/
ALTER TABLE Departamento  ADD  CONSTRAINT FK_Departamento_Prestacionvertareas FOREIGN KEY(pre_id_vertareas)
REFERENCES Prestacion (pre_id)
;
-- FK_Departamento_Prestacionvertareas
;
/****** Object:  ForeignKey FK_Departamento_Usuario    Script Date: 07/30/2012 17:07:57 ******/
ALTER TABLE Departamento  ADD  CONSTRAINT FK_Departamento_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Departamento_Usuario
;
/****** Object:  ForeignKey FK_DepartamentoCliente_Cliente    Script Date: 07/30/2012 17:07:58 ******/
ALTER TABLE DepartamentoCliente  ADD  CONSTRAINT FK_DepartamentoCliente_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_DepartamentoCliente_Cliente
;
/****** Object:  ForeignKey FK_DepartamentoCliente_Departamento    Script Date: 07/30/2012 17:07:58 ******/
ALTER TABLE DepartamentoCliente  ADD  CONSTRAINT FK_DepartamentoCliente_Departamento FOREIGN KEY(dpto_id)
REFERENCES Departamento (dpto_id)
;
-- FK_DepartamentoCliente_Departamento
;
/****** Object:  ForeignKey FK_DepartamentoProveedor_Departamento    Script Date: 07/30/2012 17:07:59 ******/
ALTER TABLE DepartamentoProveedor  ADD  CONSTRAINT FK_DepartamentoProveedor_Departamento FOREIGN KEY(dpto_id)
REFERENCES Departamento (dpto_id)
;
-- FK_DepartamentoProveedor_Departamento
;
/****** Object:  ForeignKey FK_DepartamentoProveedor_Proveedor    Script Date: 07/30/2012 17:07:59 ******/
ALTER TABLE DepartamentoProveedor  ADD  CONSTRAINT FK_DepartamentoProveedor_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_DepartamentoProveedor_Proveedor
;
/****** Object:  ForeignKey FK_DepositoBanco_Asiento    Script Date: 07/30/2012 17:08:05 ******/
ALTER TABLE DepositoBanco  ADD  CONSTRAINT FK_DepositoBanco_Asiento FOREIGN KEY(as_id)
REFERENCES Asiento (as_id)
;
-- FK_DepositoBanco_Asiento
;
/****** Object:  ForeignKey FK_DepositoBanco_Banco    Script Date: 07/30/2012 17:08:05 ******/
ALTER TABLE DepositoBanco  ADD  CONSTRAINT FK_DepositoBanco_Banco FOREIGN KEY(bco_id)
REFERENCES Banco (bco_id)
;
-- FK_DepositoBanco_Banco
;
/****** Object:  ForeignKey FK_DepositoBanco_Documento    Script Date: 07/30/2012 17:08:05 ******/
ALTER TABLE DepositoBanco  ADD  CONSTRAINT FK_DepositoBanco_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_DepositoBanco_Documento
;
/****** Object:  ForeignKey FK_DepositoBanco_DocumentoTipo    Script Date: 07/30/2012 17:08:06 ******/
ALTER TABLE DepositoBanco  ADD  CONSTRAINT FK_DepositoBanco_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_DepositoBanco_DocumentoTipo
;
/****** Object:  ForeignKey FK_DepositoBanco_Estado    Script Date: 07/30/2012 17:08:06 ******/
ALTER TABLE DepositoBanco  ADD  CONSTRAINT FK_DepositoBanco_Estado FOREIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_DepositoBanco_Estado
;
/****** Object:  ForeignKey FK_DepositoBanco_Legajo    Script Date: 07/30/2012 17:08:06 ******/
ALTER TABLE DepositoBanco  ADD  CONSTRAINT FK_DepositoBanco_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_DepositoBanco_Legajo
;
/****** Object:  ForeignKey FK_DepositoBanco_Sucursal    Script Date: 07/30/2012 17:08:06 ******/
ALTER TABLE DepositoBanco  ADD  CONSTRAINT FK_DepositoBanco_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_DepositoBanco_Sucursal
;
/****** Object:  ForeignKey FK_DepositoBancoItem_Cheque    Script Date: 07/30/2012 17:08:09 ******/
ALTER TABLE DepositoBancoItem  ADD  CONSTRAINT FK_DepositoBancoItem_Cheque FOREIGN KEY(cheq_id)
REFERENCES Cheque (cheq_id)
;
-- FK_DepositoBancoItem_Cheque
;
/****** Object:  ForeignKey FK_DepositoBancoItem_Chequera    Script Date: 07/30/2012 17:08:09 ******/
ALTER TABLE DepositoBancoItem  ADD  CONSTRAINT FK_DepositoBancoItem_Chequera FOREIGN KEY(chq_id)
REFERENCES Chequera (chq_id)
;
-- FK_DepositoBancoItem_Chequera
;
/****** Object:  ForeignKey FK_DepositoBancoItem_Cuenta    Script Date: 07/30/2012 17:08:09 ******/
ALTER TABLE DepositoBancoItem  ADD  CONSTRAINT FK_DepositoBancoItem_Cuenta FOREIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_DepositoBancoItem_Cuenta
;
/****** Object:  ForeignKey FK_DepositoBancoItem_DepositoBanco    Script Date: 07/30/2012 17:08:09 ******/
ALTER TABLE DepositoBancoItem  ADD  CONSTRAINT FK_DepositoBancoItem_DepositoBanco FOREIGN KEY(dbco_id)
REFERENCES DepositoBanco (dbco_id)
;
-- FK_DepositoBancoItem_DepositoBanco
;
/****** Object:  ForeignKey FK_DepositoBancoItemBorradoTMP_DepositoBancoTMP    Script Date: 07/30/2012 17:08:10 ******/
ALTER TABLE DepositoBancoItemBorradoTMP  ADD  CONSTRAINT FK_DepositoBancoItemBorradoTMP_DepositoBancoTMP FOREIGN KEY(dbcoTMP_id)
REFERENCES DepositoBancoTMP (dbcoTMP_id)
;
-- FK_DepositoBancoItemBorradoTMP_DepositoBancoTMP
;
/****** Object:  ForeignKey FK_DepositoBancoItemTMP_DepositoBancoTMP    Script Date: 07/30/2012 17:08:13 ******/
ALTER TABLE DepositoBancoItemTMP  ADD  CONSTRAINT FK_DepositoBancoItemTMP_DepositoBancoTMP FOREIGN KEY(dbcoTMP_id)
REFERENCES DepositoBancoTMP (dbcoTMP_id)
;
-- FK_DepositoBancoItemTMP_DepositoBancoTMP
;
/****** Object:  ForeignKey FK_DepositoCupon_Asiento    Script Date: 07/30/2012 17:08:22 ******/
ALTER TABLE DepositoCupon  ADD  CONSTRAINT FK_DepositoCupon_Asiento FOREIGN KEY(as_id)
REFERENCES Asiento (as_id)
;
-- FK_DepositoCupon_Asiento
;
/****** Object:  ForeignKey FK_DepositoCupon_Documento    Script Date: 07/30/2012 17:08:22 ******/
ALTER TABLE DepositoCupon  ADD  CONSTRAINT FK_DepositoCupon_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_DepositoCupon_Documento
;
/****** Object:  ForeignKey FK_DepositoCupon_DocumentoTipo    Script Date: 07/30/2012 17:08:22 ******/
ALTER TABLE DepositoCupon  ADD  CONSTRAINT FK_DepositoCupon_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_DepositoCupon_DocumentoTipo
;
/****** Object:  ForeignKey FK_DepositoCupon_Estado    Script Date: 07/30/2012 17:08:22 ******/
ALTER TABLE DepositoCupon  ADD  CONSTRAINT FK_DepositoCupon_Estado FOREIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_DepositoCupon_Estado
;
/****** Object:  ForeignKey FK_DepositoCupon_Legajo    Script Date: 07/30/2012 17:08:22 ******/
ALTER TABLE DepositoCupon  ADD  CONSTRAINT FK_DepositoCupon_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_DepositoCupon_Legajo
;
/****** Object:  ForeignKey FK_DepositoCupon_Sucursal    Script Date: 07/30/2012 17:08:22 ******/
ALTER TABLE DepositoCupon  ADD  CONSTRAINT FK_DepositoCupon_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_DepositoCupon_Sucursal
;
/****** Object:  ForeignKey FK_DepositoCuponItem_Cuenta    Script Date: 07/30/2012 17:08:25 ******/
ALTER TABLE DepositoCuponItem  ADD  CONSTRAINT FK_DepositoCuponItem_Cuenta FOREIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_DepositoCuponItem_Cuenta
;
/****** Object:  ForeignKey FK_DepositoCuponItem_DepositoCupon    Script Date: 07/30/2012 17:08:25 ******/
ALTER TABLE DepositoCuponItem  ADD  CONSTRAINT FK_DepositoCuponItem_DepositoCupon FOREIGN KEY(dcup_id)
REFERENCES DepositoCupon (dcup_id)
;
-- FK_DepositoCuponItem_DepositoCupon
;
/****** Object:  ForeignKey FK_DepositoCuponItem_TarjetaCreditoCupon    Script Date: 07/30/2012 17:08:25 ******/
ALTER TABLE DepositoCuponItem  ADD  CONSTRAINT FK_DepositoCuponItem_TarjetaCreditoCupon FOREIGN KEY(tjcc_id)
REFERENCES TarjetaCreditoCupon (tjcc_id)
;
-- FK_DepositoCuponItem_TarjetaCreditoCupon
;
/****** Object:  ForeignKey FK_DepositoCuponItemBorradoTMP_DepositoCuponTMP    Script Date: 07/30/2012 17:08:26 ******/
ALTER TABLE DepositoCuponItemBorradoTMP  ADD  CONSTRAINT FK_DepositoCuponItemBorradoTMP_DepositoCuponTMP FOREIGN KEY(dcupTMP_id)
REFERENCES DepositoCuponTMP (dcupTMP_id)
;
-- FK_DepositoCuponItemBorradoTMP_DepositoCuponTMP
;
/****** Object:  ForeignKey FK_DepositoCuponItemTMP_DepositoCuponTMP    Script Date: 07/30/2012 17:08:28 ******/
ALTER TABLE DepositoCuponItemTMP  ADD  CONSTRAINT FK_DepositoCuponItemTMP_DepositoCuponTMP FOREIGN KEY(dcupTMP_id)
REFERENCES DepositoCuponTMP (dcupTMP_id)
;
-- FK_DepositoCuponItemTMP_DepositoCuponTMP
;
/****** Object:  ForeignKey FK_DepositoFisico_Usuario    Script Date: 07/30/2012 17:08:34 ******/
ALTER TABLE DepositoFisico  ADD  CONSTRAINT FK_DepositoFisico_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_DepositoFisico_Usuario
;
/****** Object:  ForeignKey FK_DepositoLogico_Cliente    Script Date: 07/30/2012 17:08:37 ******/
ALTER TABLE DepositoLogico  ADD  CONSTRAINT FK_DepositoLogico_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_DepositoLogico_Cliente
;
/****** Object:  ForeignKey FK_DepositoLogico_DepositoFisico    Script Date: 07/30/2012 17:08:37 ******/
ALTER TABLE DepositoLogico  ADD  CONSTRAINT FK_DepositoLogico_DepositoFisico FOREIGN KEY(depf_id)
REFERENCES DepositoFisico (depf_id)
;
-- FK_DepositoLogico_DepositoFisico
;
/****** Object:  ForeignKey FK_DepositoLogico_Empresa    Script Date: 07/30/2012 17:08:37 ******/
ALTER TABLE DepositoLogico  ADD  CONSTRAINT FK_DepositoLogico_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_DepositoLogico_Empresa
;
/****** Object:  ForeignKey FK_DepositoLogico_Proveedor    Script Date: 07/30/2012 17:08:37 ******/
ALTER TABLE DepositoLogico  ADD  CONSTRAINT FK_DepositoLogico_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_DepositoLogico_Proveedor
;
/****** Object:  ForeignKey FK_DepositoLogico_Usuario    Script Date: 07/30/2012 17:08:37 ******/
ALTER TABLE DepositoLogico  ADD  CONSTRAINT FK_DepositoLogico_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_DepositoLogico_Usuario
;
/****** Object:  ForeignKey FK_DespachoImpCalculo_Moneda1    Script Date: 07/30/2012 17:08:42 ******/
ALTER TABLE DespachoImpCalculo  ADD  CONSTRAINT FK_DespachoImpCalculo_Moneda1 FOREIGN KEY(mon_id1)
REFERENCES Moneda (mon_id)
;
-- FK_DespachoImpCalculo_Moneda1
;
/****** Object:  ForeignKey FK_DespachoImpCalculo_Moneda2    Script Date: 07/30/2012 17:08:42 ******/
ALTER TABLE DespachoImpCalculo  ADD  CONSTRAINT FK_DespachoImpCalculo_Moneda2 FOREIGN KEY(mon_id2)
REFERENCES Moneda (mon_id)
;
-- FK_DespachoImpCalculo_Moneda2
;
/****** Object:  ForeignKey FK_DespachoImpCalculo_Usuario    Script Date: 07/30/2012 17:08:42 ******/
ALTER TABLE DespachoImpCalculo  ADD  CONSTRAINT FK_DespachoImpCalculo_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_DespachoImpCalculo_Usuario
;
/****** Object:  ForeignKey FK_DespachoImpCalculoItem_DespachoImpCalculo    Script Date: 07/30/2012 17:08:44 ******/
ALTER TABLE DespachoImpCalculoItem  ADD  CONSTRAINT FK_DespachoImpCalculoItem_DespachoImpCalculo FOREIGN KEY(dic_id)
REFERENCES DespachoImpCalculo (dic_id)
;
-- FK_DespachoImpCalculoItem_DespachoImpCalculo
;
/****** Object:  ForeignKey FK_DespachoImpPosicionArancel_DespachoImpCalculo    Script Date: 07/30/2012 17:08:46 ******/
ALTER TABLE DespachoImpCalculoPosicionArancel  ADD  CONSTRAINT FK_DespachoImpPosicionArancel_DespachoImpCalculo FOREIGN KEY(dic_id)
REFERENCES DespachoImpCalculo (dic_id)
;
-- FK_DespachoImpPosicionArancel_DespachoImpCalculo
;
/****** Object:  ForeignKey FK_Documento_CircuitoContable    Script Date: 07/30/2012 17:08:59 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_CircuitoContable FOREIGN KEY(cico_id)
REFERENCES CircuitoContable (cico_id)
;
-- FK_Documento_CircuitoContable
;
/****** Object:  ForeignKey FK_Documento_CuentaGrupo    Script Date: 07/30/2012 17:08:59 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_CuentaGrupo FOREIGN KEY(cueg_id)
REFERENCES CuentaGrupo (cueg_id)
;
-- FK_Documento_CuentaGrupo
;
/****** Object:  ForeignKey FK_Documento_DocumentoAsiento    Script Date: 07/30/2012 17:08:59 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_DocumentoAsiento FOREIGN KEY(doc_id_asiento)
REFERENCES Documento (doc_id)
;
-- FK_Documento_DocumentoAsiento
;
/****** Object:  ForeignKey FK_Documento_DocumentoRemito    Script Date: 07/30/2012 17:08:59 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_DocumentoRemito FOREIGN KEY(doc_id_remito)
REFERENCES Documento (doc_id)
;
-- FK_Documento_DocumentoRemito
;
/****** Object:  ForeignKey FK_Documento_DocumentoStock    Script Date: 07/30/2012 17:08:59 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_DocumentoStock FOREIGN KEY(doc_id_stock)
REFERENCES Documento (doc_id)
;
-- FK_Documento_DocumentoStock
;
/****** Object:  ForeignKey FK_Documento_DocumentoTipo    Script Date: 07/30/2012 17:08:59 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_Documento_DocumentoTipo
;
/****** Object:  ForeignKey FK_Documento_Empresa    Script Date: 07/30/2012 17:08:59 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_Documento_Empresa
;
/****** Object:  ForeignKey FK_Documento_FechaControlAcceso    Script Date: 07/30/2012 17:08:59 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_FechaControlAcceso FOREIGN KEY(fca_id)
REFERENCES FechaControlAcceso (fca_id)
;
-- FK_Documento_FechaControlAcceso
;
/****** Object:  ForeignKey FK_Documento_Moneda    Script Date: 07/30/2012 17:08:59 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_Moneda FOREIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_Documento_Moneda
;
/****** Object:  ForeignKey FK_Documento_Prestacion    Script Date: 07/30/2012 17:09:00 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_Prestacion FOREIGN KEY(pre_id_print)
REFERENCES Prestacion (pre_id)
;
-- FK_Documento_Prestacion
;
/****** Object:  ForeignKey FK_Documento_PrestacionAnular    Script Date: 07/30/2012 17:09:00 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_PrestacionAnular FOREIGN KEY(pre_id_anular)
REFERENCES Prestacion (pre_id)
;
-- FK_Documento_PrestacionAnular
;
/****** Object:  ForeignKey FK_Documento_PrestacionAplicar    Script Date: 07/30/2012 17:09:00 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_PrestacionAplicar FOREIGN KEY(pre_id_aplicar)
REFERENCES Prestacion (pre_id)
;
-- FK_Documento_PrestacionAplicar
;
/****** Object:  ForeignKey FK_Documento_PrestacionDelete    Script Date: 07/30/2012 17:09:00 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_PrestacionDelete FOREIGN KEY(pre_id_delete)
REFERENCES Prestacion (pre_id)
;
-- FK_Documento_PrestacionDelete
;
/****** Object:  ForeignKey FK_Documento_PrestacionDesAnular    Script Date: 07/30/2012 17:09:00 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_PrestacionDesAnular FOREIGN KEY(pre_id_desanular)
REFERENCES Prestacion (pre_id)
;
-- FK_Documento_PrestacionDesAnular
;
/****** Object:  ForeignKey FK_Documento_PrestacionEdit    Script Date: 07/30/2012 17:09:00 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_PrestacionEdit FOREIGN KEY(pre_id_edit)
REFERENCES Prestacion (pre_id)
;
-- FK_Documento_PrestacionEdit
;
/****** Object:  ForeignKey FK_Documento_PrestacionList    Script Date: 07/30/2012 17:09:00 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_PrestacionList FOREIGN KEY(pre_id_list)
REFERENCES Prestacion (pre_id)
;
-- FK_Documento_PrestacionList
;
/****** Object:  ForeignKey FK_Documento_PrestacionNew    Script Date: 07/30/2012 17:09:00 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_PrestacionNew FOREIGN KEY(pre_id_new)
REFERENCES Prestacion (pre_id)
;
-- FK_Documento_PrestacionNew
;
/****** Object:  ForeignKey FK_Documento_Talonario    Script Date: 07/30/2012 17:09:00 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_Talonario FOREIGN KEY(ta_id)
REFERENCES Talonario (ta_id)
;
-- FK_Documento_Talonario
;
/****** Object:  ForeignKey FK_Documento_Talonario1    Script Date: 07/30/2012 17:09:00 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_Talonario1 FOREIGN KEY(ta_id_inscriptom)
REFERENCES Talonario (ta_id)
;
-- FK_Documento_Talonario1
;
/****** Object:  ForeignKey FK_Documento_TalonarioExterno    Script Date: 07/30/2012 17:09:01 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_TalonarioExterno FOREIGN KEY(ta_id_externo)
REFERENCES Talonario (ta_id)
;
-- FK_Documento_TalonarioExterno
;
/****** Object:  ForeignKey FK_Documento_TalonarioFinal    Script Date: 07/30/2012 17:09:01 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_TalonarioFinal FOREIGN KEY(ta_id_final)
REFERENCES Talonario (ta_id)
;
-- FK_Documento_TalonarioFinal
;
/****** Object:  ForeignKey FK_Documento_TalonarioHaberes    Script Date: 07/30/2012 17:09:01 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_TalonarioHaberes FOREIGN KEY(ta_id_haberes)
REFERENCES Talonario (ta_id)
;
-- FK_Documento_TalonarioHaberes
;
/****** Object:  ForeignKey FK_Documento_TalonarioInscripto    Script Date: 07/30/2012 17:09:01 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_TalonarioInscripto FOREIGN KEY(ta_id_inscripto)
REFERENCES Talonario (ta_id)
;
-- FK_Documento_TalonarioInscripto
;
/****** Object:  ForeignKey FK_Documento_Usuario    Script Date: 07/30/2012 17:09:01 ******/
ALTER TABLE Documento  ADD  CONSTRAINT FK_Documento_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Documento_Usuario
;
/****** Object:  ForeignKey FK_DocumentoDigital_Usuario    Script Date: 07/30/2012 17:09:04 ******/
ALTER TABLE DocumentoDigital  ADD  CONSTRAINT FK_DocumentoDigital_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_DocumentoDigital_Usuario
;
/****** Object:  ForeignKey FK_DocumentoFirma_Documento    Script Date: 07/30/2012 17:09:06 ******/
ALTER TABLE DocumentoFirma  ADD  CONSTRAINT FK_DocumentoFirma_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_DocumentoFirma_Documento
;
/****** Object:  ForeignKey FK_DocumentoFirma_Usuario    Script Date: 07/30/2012 17:09:06 ******/
ALTER TABLE DocumentoFirma  ADD  CONSTRAINT FK_DocumentoFirma_Usuario FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_DocumentoFirma_Usuario
;
/****** Object:  ForeignKey FK_DocumentoImpresora_Documento    Script Date: 07/30/2012 17:09:10 ******/
ALTER TABLE DocumentoImpresora  ADD  CONSTRAINT FK_DocumentoImpresora_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_DocumentoImpresora_Documento
;
/****** Object:  ForeignKey FK_DocumentoImpresora_Talonario    Script Date: 07/30/2012 17:09:10 ******/
ALTER TABLE DocumentoImpresora  ADD  CONSTRAINT FK_DocumentoImpresora_Talonario FOREIGN KEY(ta_id)
REFERENCES Talonario (ta_id)
;
-- FK_DocumentoImpresora_Talonario
;
/****** Object:  ForeignKey FK_DocumentoTipo_Usuario    Script Date: 07/30/2012 17:09:12 ******/
ALTER TABLE DocumentoTipo  ADD  CONSTRAINT FK_DocumentoTipo_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_DocumentoTipo_Usuario
;
/****** Object:  ForeignKey FK_EjercicioContable_Asiento    Script Date: 07/30/2012 17:09:17 ******/
ALTER TABLE EjercicioContable  ADD  CONSTRAINT FK_EjercicioContable_Asiento FOREIGN KEY(as_id_apertura)
REFERENCES Asiento (as_id)
;
-- FK_EjercicioContable_Asiento
;
/****** Object:  ForeignKey FK_EjercicioContable_Asiento1    Script Date: 07/30/2012 17:09:17 ******/
ALTER TABLE EjercicioContable  ADD  CONSTRAINT FK_EjercicioContable_Asiento1 FOREIGN KEY(as_id_cierrepatrimonial)
REFERENCES Asiento (as_id)
;
-- FK_EjercicioContable_Asiento1
;
/****** Object:  ForeignKey FK_EjercicioContable_Asiento2    Script Date: 07/30/2012 17:09:17 ******/
ALTER TABLE EjercicioContable  ADD  CONSTRAINT FK_EjercicioContable_Asiento2 FOREIGN KEY(as_id_cierreresultados)
REFERENCES Asiento (as_id)
;
-- FK_EjercicioContable_Asiento2
;
/****** Object:  ForeignKey FK_EjercicioContable_Cuenta    Script Date: 07/30/2012 17:09:17 ******/
ALTER TABLE EjercicioContable  ADD  CONSTRAINT FK_EjercicioContable_Cuenta FOREIGN KEY(cue_id_resultado)
REFERENCES Cuenta (cue_id)
;
-- FK_EjercicioContable_Cuenta
;
/****** Object:  ForeignKey FK_EjercicioContableCircuitoContable_CircuitoContable    Script Date: 07/30/2012 17:09:18 ******/
ALTER TABLE EjercicioContableCircuitoContable  ADD  CONSTRAINT FK_EjercicioContableCircuitoContable_CircuitoContable FOREIGN KEY(cico_id)
REFERENCES CircuitoContable (cico_id)
;
-- FK_EjercicioContableCircuitoContable_CircuitoContable
;
/****** Object:  ForeignKey FK_EjercicioContableCircuitoContable_EjercicioContable    Script Date: 07/30/2012 17:09:18 ******/
ALTER TABLE EjercicioContableCircuitoContable  ADD  CONSTRAINT FK_EjercicioContableCircuitoContable_EjercicioContable FOREIGN KEY(ejc_id)
REFERENCES EjercicioContable (ejc_id)
;
-- FK_EjercicioContableCircuitoContable_EjercicioContable
;
/****** Object:  ForeignKey FK_EjercicioContableEmpresa_EjercicioContable    Script Date: 07/30/2012 17:09:18 ******/
ALTER TABLE EjercicioContableEmpresa  ADD  CONSTRAINT FK_EjercicioContableEmpresa_EjercicioContable FOREIGN KEY(ejc_id)
REFERENCES EjercicioContable (ejc_id)
;
-- FK_EjercicioContableEmpresa_EjercicioContable
;
/****** Object:  ForeignKey FK_EjercicioContableEmpresa_Empresa    Script Date: 07/30/2012 17:09:19 ******/
ALTER TABLE EjercicioContableEmpresa  ADD  CONSTRAINT FK_EjercicioContableEmpresa_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_EjercicioContableEmpresa_Empresa
;
/****** Object:  ForeignKey FK_Embalaje_Producto    Script Date: 07/30/2012 17:09:22 ******/
ALTER TABLE Embalaje  ADD  CONSTRAINT FK_Embalaje_Producto FOREIGN KEY(pr_id_stock)
REFERENCES Producto (pr_id)
;
-- FK_Embalaje_Producto
;
/****** Object:  ForeignKey FK_Embalaje_Unidad    Script Date: 07/30/2012 17:09:22 ******/
ALTER TABLE Embalaje  ADD  CONSTRAINT FK_Embalaje_Unidad FOREIGN KEY(un_id)
REFERENCES Unidad (un_id)
;
-- FK_Embalaje_Unidad
;
/****** Object:  ForeignKey FK_Embarque_Barco    Script Date: 07/30/2012 17:09:25 ******/
ALTER TABLE Embarque  ADD  CONSTRAINT FK_Embarque_Barco FOREIGN KEY(barc_id)
REFERENCES Barco (barc_id)
;
-- FK_Embarque_Barco
;
/****** Object:  ForeignKey FK_Embarque_PuertoDestino    Script Date: 07/30/2012 17:09:25 ******/
ALTER TABLE Embarque  ADD  CONSTRAINT FK_Embarque_PuertoDestino FOREIGN KEY(pue_id_destino)
REFERENCES Puerto (pue_id)
;
-- FK_Embarque_PuertoDestino
;
/****** Object:  ForeignKey FK_Embarque_PuertoOrigen    Script Date: 07/30/2012 17:09:25 ******/
ALTER TABLE Embarque  ADD  CONSTRAINT FK_Embarque_PuertoOrigen FOREIGN KEY(pue_id_origen)
REFERENCES Puerto (pue_id)
;
-- FK_Embarque_PuertoOrigen
;
/****** Object:  ForeignKey FK_Embarque_Usuario    Script Date: 07/30/2012 17:09:25 ******/
ALTER TABLE Embarque  ADD  CONSTRAINT FK_Embarque_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Embarque_Usuario
;
/****** Object:  ForeignKey FK_Empleado_Empleado    Script Date: 07/30/2012 17:09:34 ******/
ALTER TABLE Empleado  ADD  CONSTRAINT FK_Empleado_Empleado FOREIGN KEY(em_id)
REFERENCES Empleado (em_id)
;
-- FK_Empleado_Empleado
;
/****** Object:  ForeignKey FK_Empleado_EmpleadoAseguradora    Script Date: 07/30/2012 17:09:34 ******/
ALTER TABLE Empleado  ADD  CONSTRAINT FK_Empleado_EmpleadoAseguradora FOREIGN KEY(ema_id)
REFERENCES EmpleadoART (ema_id)
;
-- FK_Empleado_EmpleadoAseguradora
;
/****** Object:  ForeignKey FK_Empleado_EmpleadoEspecialidad    Script Date: 07/30/2012 17:09:34 ******/
ALTER TABLE Empleado  ADD  CONSTRAINT FK_Empleado_EmpleadoEspecialidad FOREIGN KEY(eme_id)
REFERENCES EmpleadoEspecialidad (eme_id)
;
-- FK_Empleado_EmpleadoEspecialidad
;
/****** Object:  ForeignKey FK_Empleado_EstadoCivil    Script Date: 07/30/2012 17:09:34 ******/
ALTER TABLE Empleado  ADD  CONSTRAINT FK_Empleado_EstadoCivil FOREIGN KEY(estc_id)
REFERENCES EstadoCivil (estc_id)
;
-- FK_Empleado_EstadoCivil
;
/****** Object:  ForeignKey FK_Empleado_Pais    Script Date: 07/30/2012 17:09:35 ******/
ALTER TABLE Empleado  ADD  CONSTRAINT FK_Empleado_Pais FOREIGN KEY(pa_id)
REFERENCES Pais (pa_id)
;
-- FK_Empleado_Pais
;
/****** Object:  ForeignKey FK_Empleado_Provincia    Script Date: 07/30/2012 17:09:35 ******/
ALTER TABLE Empleado  ADD  CONSTRAINT FK_Empleado_Provincia FOREIGN KEY(pro_id)
REFERENCES Provincia (pro_id)
;
-- FK_Empleado_Provincia
;
/****** Object:  ForeignKey FK_Empleado_Sindicato    Script Date: 07/30/2012 17:09:35 ******/
ALTER TABLE Empleado  ADD  CONSTRAINT FK_Empleado_Sindicato FOREIGN KEY(sind_id)
REFERENCES Sindicato (sind_id)
;
-- FK_Empleado_Sindicato
;
/****** Object:  ForeignKey FK_Empleado_SindicatoCategoria    Script Date: 07/30/2012 17:09:35 ******/
ALTER TABLE Empleado  ADD  CONSTRAINT FK_Empleado_SindicatoCategoria FOREIGN KEY(sindca_id)
REFERENCES SindicatoCategoria (sindca_id)
;
-- FK_Empleado_SindicatoCategoria
;
/****** Object:  ForeignKey FK_Empleado_SindicatoConvenio    Script Date: 07/30/2012 17:09:35 ******/
ALTER TABLE Empleado  ADD  CONSTRAINT FK_Empleado_SindicatoConvenio FOREIGN KEY(sindco_id)
REFERENCES SindicatoConvenio (sindco_id)
;
-- FK_Empleado_SindicatoConvenio
;
/****** Object:  ForeignKey FK_EmpleadoAsistencia_Usuario    Script Date: 07/30/2012 17:09:39 ******/
ALTER TABLE EmpleadoAsistenciaTipo  ADD  CONSTRAINT FK_EmpleadoAsistencia_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_EmpleadoAsistencia_Usuario
;
/****** Object:  ForeignKey FK_CentroCostoEmpleado_CentroCosto    Script Date: 07/30/2012 17:09:40 ******/
ALTER TABLE EmpleadoCentroCosto  ADD  CONSTRAINT FK_CentroCostoEmpleado_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_CentroCostoEmpleado_CentroCosto
;
/****** Object:  ForeignKey FK_CentroCostoEmpleado_Empleado    Script Date: 07/30/2012 17:09:40 ******/
ALTER TABLE EmpleadoCentroCosto  ADD  CONSTRAINT FK_CentroCostoEmpleado_Empleado FOREIGN KEY(em_id)
REFERENCES Empleado (em_id)
;
-- FK_CentroCostoEmpleado_Empleado
;
/****** Object:  ForeignKey FK_EmpleadoFamilia_Empleado    Script Date: 07/30/2012 17:09:44 ******/
ALTER TABLE EmpleadoFamilia  ADD  CONSTRAINT FK_EmpleadoFamilia_Empleado FOREIGN KEY(em_id)
REFERENCES Empleado (em_id)
;
-- FK_EmpleadoFamilia_Empleado
;
/****** Object:  ForeignKey FK_EmpleadoFamilia_EmpleadoFamiliaTipo    Script Date: 07/30/2012 17:09:44 ******/
ALTER TABLE EmpleadoFamilia  ADD  CONSTRAINT FK_EmpleadoFamilia_EmpleadoFamiliaTipo FOREIGN KEY(emft_id)
REFERENCES EmpleadoFamiliaTipo (emft_id)
;
-- FK_EmpleadoFamilia_EmpleadoFamiliaTipo
;
/****** Object:  ForeignKey FK_EmpleadoHoras_CentroCosto    Script Date: 07/30/2012 17:09:47 ******/
ALTER TABLE EmpleadoHoras  ADD  CONSTRAINT FK_EmpleadoHoras_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_EmpleadoHoras_CentroCosto
;
/****** Object:  ForeignKey FK_EmpleadoHoras_Empleado    Script Date: 07/30/2012 17:09:47 ******/
ALTER TABLE EmpleadoHoras  ADD  CONSTRAINT FK_EmpleadoHoras_Empleado FOREIGN KEY(em_id)
REFERENCES Empleado (em_id)
;
-- FK_EmpleadoHoras_Empleado
;
/****** Object:  ForeignKey FK_EmpleadoHoras_EmpleadoAsistencia    Script Date: 07/30/2012 17:09:47 ******/
ALTER TABLE EmpleadoHoras  ADD  CONSTRAINT FK_EmpleadoHoras_EmpleadoAsistencia FOREIGN KEY(east_id)
REFERENCES EmpleadoAsistenciaTipo (east_id)
;
-- FK_EmpleadoHoras_EmpleadoAsistencia
;
/****** Object:  ForeignKey FK_EmpleadoHoras_EmpleadoPeriodo    Script Date: 07/30/2012 17:09:47 ******/
ALTER TABLE EmpleadoHoras  ADD  CONSTRAINT FK_EmpleadoHoras_EmpleadoPeriodo FOREIGN KEY(empe_id)
REFERENCES EmpleadoPeriodo (empe_id)
;
-- FK_EmpleadoHoras_EmpleadoPeriodo
;
/****** Object:  ForeignKey FK_EmpleadoPeriodo_CentroCosto    Script Date: 07/30/2012 17:09:50 ******/
ALTER TABLE EmpleadoPeriodo  ADD  CONSTRAINT FK_EmpleadoPeriodo_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_EmpleadoPeriodo_CentroCosto
;
/****** Object:  ForeignKey FK_EmpleadoPeriodo_Usuario    Script Date: 07/30/2012 17:09:50 ******/
ALTER TABLE EmpleadoPeriodo  ADD  CONSTRAINT FK_EmpleadoPeriodo_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_EmpleadoPeriodo_Usuario
;
/****** Object:  ForeignKey FK_EmpleadoPresentismo_CentroCosto    Script Date: 07/30/2012 17:09:52 ******/
ALTER TABLE EmpleadoPresentismo  ADD  CONSTRAINT FK_EmpleadoPresentismo_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_EmpleadoPresentismo_CentroCosto
;
/****** Object:  ForeignKey FK_EmpleadoPresentismo_Empleado    Script Date: 07/30/2012 17:09:52 ******/
ALTER TABLE EmpleadoPresentismo  ADD  CONSTRAINT FK_EmpleadoPresentismo_Empleado FOREIGN KEY(em_id)
REFERENCES Empleado (em_id)
;
-- FK_EmpleadoPresentismo_Empleado
;
/****** Object:  ForeignKey FK_EmpleadoPresentismo_EmpleadoPeriodo    Script Date: 07/30/2012 17:09:52 ******/
ALTER TABLE EmpleadoPresentismo  ADD  CONSTRAINT FK_EmpleadoPresentismo_EmpleadoPeriodo FOREIGN KEY(empe_id)
REFERENCES EmpleadoPeriodo (empe_id)
;
-- FK_EmpleadoPresentismo_EmpleadoPeriodo
;
/****** Object:  ForeignKey FK_EmpleadoSemana_CentroCosto    Script Date: 07/30/2012 17:09:54 ******/
ALTER TABLE EmpleadoSemana  ADD  CONSTRAINT FK_EmpleadoSemana_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_EmpleadoSemana_CentroCosto
;
/****** Object:  ForeignKey FK_EmpleadoSemana_EmpleadoPeriodo    Script Date: 07/30/2012 17:09:54 ******/
ALTER TABLE EmpleadoSemana  ADD  CONSTRAINT FK_EmpleadoSemana_EmpleadoPeriodo FOREIGN KEY(empe_id)
REFERENCES EmpleadoPeriodo (empe_id)
;
-- FK_EmpleadoSemana_EmpleadoPeriodo
;
/****** Object:  ForeignKey FK_Empresa_Usuario    Script Date: 07/30/2012 17:10:00 ******/
ALTER TABLE Empresa  ADD  CONSTRAINT FK_Empresa_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Empresa_Usuario
;
/****** Object:  ForeignKey FK_EmpresaCliente_Cliente    Script Date: 07/30/2012 17:10:02 ******/
ALTER TABLE EmpresaCliente  ADD  CONSTRAINT FK_EmpresaCliente_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_EmpresaCliente_Cliente
;
/****** Object:  ForeignKey FK_EmpresaCliente_Empresa    Script Date: 07/30/2012 17:10:02 ******/
ALTER TABLE EmpresaCliente  ADD  CONSTRAINT FK_EmpresaCliente_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_EmpresaCliente_Empresa
;
/****** Object:  ForeignKey FK_EmpresaCliente_Usuario    Script Date: 07/30/2012 17:10:02 ******/
ALTER TABLE EmpresaCliente  ADD  CONSTRAINT FK_EmpresaCliente_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_EmpresaCliente_Usuario
;
/****** Object:  ForeignKey FK_EmpresaClienteDeuda_Cliente    Script Date: 07/30/2012 17:10:06 ******/
ALTER TABLE EmpresaClienteDeuda  ADD  CONSTRAINT FK_EmpresaClienteDeuda_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_EmpresaClienteDeuda_Cliente
;
/****** Object:  ForeignKey FK_EmpresaClienteDeuda_Empresa    Script Date: 07/30/2012 17:10:06 ******/
ALTER TABLE EmpresaClienteDeuda  ADD  CONSTRAINT FK_EmpresaClienteDeuda_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_EmpresaClienteDeuda_Empresa
;
/****** Object:  ForeignKey FK_EmpresaProveedor_Empresa    Script Date: 07/30/2012 17:10:08 ******/
ALTER TABLE EmpresaProveedor  ADD  CONSTRAINT FK_EmpresaProveedor_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_EmpresaProveedor_Empresa
;
/****** Object:  ForeignKey FK_EmpresaProveedor_Proveedor    Script Date: 07/30/2012 17:10:08 ******/
ALTER TABLE EmpresaProveedor  ADD  CONSTRAINT FK_EmpresaProveedor_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_EmpresaProveedor_Proveedor
;
/****** Object:  ForeignKey FK_EmpresaProveedor_Usuario    Script Date: 07/30/2012 17:10:08 ******/
ALTER TABLE EmpresaProveedor  ADD  CONSTRAINT FK_EmpresaProveedor_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_EmpresaProveedor_Usuario
;
/****** Object:  ForeignKey FK_EmpresaProveedorDeuda_Empresa    Script Date: 07/30/2012 17:10:11 ******/
ALTER TABLE EmpresaProveedorDeuda  ADD  CONSTRAINT FK_EmpresaProveedorDeuda_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_EmpresaProveedorDeuda_Empresa
;
/****** Object:  ForeignKey FK_EmpresaProveedorDeuda_Proveedor    Script Date: 07/30/2012 17:10:11 ******/
ALTER TABLE EmpresaProveedorDeuda  ADD  CONSTRAINT FK_EmpresaProveedorDeuda_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_EmpresaProveedorDeuda_Proveedor
;
/****** Object:  ForeignKey FK_EmpresaUsuario_Empresa    Script Date: 07/30/2012 17:10:12 ******/
ALTER TABLE EmpresaUsuario  ADD  CONSTRAINT FK_EmpresaUsuario_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_EmpresaUsuario_Empresa
;
/****** Object:  ForeignKey FK_EmpresaUsuario_Modifico    Script Date: 07/30/2012 17:10:12 ******/
ALTER TABLE EmpresaUsuario  ADD  CONSTRAINT FK_EmpresaUsuario_Modifico FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_EmpresaUsuario_Modifico
;
/****** Object:  ForeignKey FK_EmpresaUsuario_Usuario    Script Date: 07/30/2012 17:10:13 ******/
ALTER TABLE EmpresaUsuario  ADD  CONSTRAINT FK_EmpresaUsuario_Usuario FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_EmpresaUsuario_Usuario
;
/****** Object:  ForeignKey FK_EncuestaDepartamento_Departamento    Script Date: 07/30/2012 17:10:16 ******/
ALTER TABLE EncuestaDepartamento  ADD  CONSTRAINT FK_EncuestaDepartamento_Departamento FOREIGN KEY(dpto_id)
REFERENCES Departamento (dpto_id)
;
-- FK_EncuestaDepartamento_Departamento
;
/****** Object:  ForeignKey FK_EncuestaDepartamento_Encuesta    Script Date: 07/30/2012 17:10:16 ******/
ALTER TABLE EncuestaDepartamento  ADD  CONSTRAINT FK_EncuestaDepartamento_Encuesta FOREIGN KEY(ec_id)
REFERENCES Encuesta (ec_id)
;
-- FK_EncuestaDepartamento_Encuesta
;
/****** Object:  ForeignKey FK_EncuestaPregunta_Encuesta    Script Date: 07/30/2012 17:10:17 ******/
ALTER TABLE EncuestaPregunta  ADD  CONSTRAINT FK_EncuestaPregunta_Encuesta FOREIGN KEY(ec_id)
REFERENCES Encuesta (ec_id)
;
-- FK_EncuestaPregunta_Encuesta
;
/****** Object:  ForeignKey FK_EncuestaPreguntaItem_EncuestaPregunta    Script Date: 07/30/2012 17:10:19 ******/
ALTER TABLE EncuestaPreguntaItem  ADD  CONSTRAINT FK_EncuestaPreguntaItem_EncuestaPregunta FOREIGN KEY(ecp_id)
REFERENCES EncuestaPregunta (ecp_id)
;
-- FK_EncuestaPreguntaItem_EncuestaPregunta
;
/****** Object:  ForeignKey FK_EncuestaRespuesta_EncuestaPreguntaItem    Script Date: 07/30/2012 17:10:20 ******/
ALTER TABLE EncuestaRespuesta  ADD  CONSTRAINT FK_EncuestaRespuesta_EncuestaPreguntaItem FOREIGN KEY(ecpi_id)
REFERENCES EncuestaPreguntaItem (ecpi_id)
;
-- FK_EncuestaRespuesta_EncuestaPreguntaItem
;
/****** Object:  ForeignKey FK_EncuestaRespuesta_Usuario    Script Date: 07/30/2012 17:10:20 ******/
ALTER TABLE EncuestaRespuesta  ADD  CONSTRAINT FK_EncuestaRespuesta_Usuario FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_EncuestaRespuesta_Usuario
;
/****** Object:  ForeignKey FK_EncuestaWebSeccion_Encuesta    Script Date: 07/30/2012 17:10:21 ******/
ALTER TABLE EncuestaWebSeccion  ADD  CONSTRAINT FK_EncuestaWebSeccion_Encuesta FOREIGN KEY(ec_id)
REFERENCES Encuesta (ec_id)
;
-- FK_EncuestaWebSeccion_Encuesta
;
/****** Object:  ForeignKey FK_EncuestaWebSeccion_webSeccion    Script Date: 07/30/2012 17:10:21 ******/
ALTER TABLE EncuestaWebSeccion  ADD  CONSTRAINT FK_EncuestaWebSeccion_webSeccion FOREIGN KEY(ws_id)
REFERENCES webSeccion (ws_id)
;
-- FK_EncuestaWebSeccion_webSeccion
;
/****** Object:  ForeignKey FK_EquipoDetalleItem_EquipoDetalle    Script Date: 07/30/2012 17:10:25 ******/
ALTER TABLE EquipoDetalleItem  ADD  CONSTRAINT FK_EquipoDetalleItem_EquipoDetalle FOREIGN KEY(ed_id)
REFERENCES EquipoDetalle (ed_id)
;
-- FK_EquipoDetalleItem_EquipoDetalle
;
/****** Object:  ForeignKey FK_Especie_Usuario    Script Date: 07/30/2012 17:10:30 ******/
ALTER TABLE Especie  ADD  CONSTRAINT FK_Especie_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Especie_Usuario
;
/****** Object:  ForeignKey FK_ExpoFacturaVenta_ExpoGrupoPrecio    Script Date: 07/30/2012 17:10:36 ******/
ALTER TABLE ExpoFacturaVenta  ADD  CONSTRAINT FK_ExpoFacturaVenta_ExpoGrupoPrecio FOREIGN KEY(egp_id)
REFERENCES ExpoGrupoPrecio (egp_id)
;
-- FK_ExpoFacturaVenta_ExpoGrupoPrecio
;
/****** Object:  ForeignKey FK_ExpoFacturaVenta_FacturaVenta    Script Date: 07/30/2012 17:10:36 ******/
ALTER TABLE ExpoFacturaVenta  ADD  CONSTRAINT FK_ExpoFacturaVenta_FacturaVenta FOREIGN KEY(fv_id)
REFERENCES FacturaVenta (fv_id)
;
-- FK_ExpoFacturaVenta_FacturaVenta
;
/****** Object:  ForeignKey FK_ExpoFacturaVenta_Idioma    Script Date: 07/30/2012 17:10:36 ******/
ALTER TABLE ExpoFacturaVenta  ADD  CONSTRAINT FK_ExpoFacturaVenta_Idioma FOREIGN KEY(idm_id)
REFERENCES Idioma (idm_id)
;
-- FK_ExpoFacturaVenta_Idioma
;
/****** Object:  ForeignKey FK_ExpoFacturaVenta_Usuario    Script Date: 07/30/2012 17:10:36 ******/
ALTER TABLE ExpoFacturaVenta  ADD  CONSTRAINT FK_ExpoFacturaVenta_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ExpoFacturaVenta_Usuario
;
/****** Object:  ForeignKey FK_ExpoFamilia_Usuario    Script Date: 07/30/2012 17:10:38 ******/
ALTER TABLE ExpoFamilia  ADD  CONSTRAINT FK_ExpoFamilia_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ExpoFamilia_Usuario
;
/****** Object:  ForeignKey FK_ExpoGrupoPrecio_Usuario    Script Date: 07/30/2012 17:10:40 ******/
ALTER TABLE ExpoGrupoPrecio  ADD  CONSTRAINT FK_ExpoGrupoPrecio_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ExpoGrupoPrecio_Usuario
;
/****** Object:  ForeignKey FK_ExpoGrupoPrecioIdioma_ExpoGrupoPrecio    Script Date: 07/30/2012 17:10:41 ******/
ALTER TABLE ExpoGrupoPrecioIdioma  ADD  CONSTRAINT FK_ExpoGrupoPrecioIdioma_ExpoGrupoPrecio FOREIGN KEY(egp_id)
REFERENCES ExpoGrupoPrecio (egp_id)
;
-- FK_ExpoGrupoPrecioIdioma_ExpoGrupoPrecio
;
/****** Object:  ForeignKey FK_ExpoGrupoPrecioPosAran_ExpoGrupoPrecio    Script Date: 07/30/2012 17:10:43 ******/
ALTER TABLE ExpoGrupoPrecioPosAran  ADD  CONSTRAINT FK_ExpoGrupoPrecioPosAran_ExpoGrupoPrecio FOREIGN KEY(egp_id)
REFERENCES ExpoGrupoPrecio (egp_id)
;
-- FK_ExpoGrupoPrecioPosAran_ExpoGrupoPrecio
;
/****** Object:  ForeignKey FK_ExpoGrupoPrecioPosAran_Pais    Script Date: 07/30/2012 17:10:43 ******/
ALTER TABLE ExpoGrupoPrecioPosAran  ADD  CONSTRAINT FK_ExpoGrupoPrecioPosAran_Pais FOREIGN KEY(pa_id)
REFERENCES Pais (pa_id)
;
-- FK_ExpoGrupoPrecioPosAran_Pais
;
/****** Object:  ForeignKey FK_ExpoPackingList_ExpoGrupoPrecio    Script Date: 07/30/2012 17:10:46 ******/
ALTER TABLE ExpoPackingList  ADD  CONSTRAINT FK_ExpoPackingList_ExpoGrupoPrecio FOREIGN KEY(egp_id)
REFERENCES ExpoGrupoPrecio (egp_id)
;
-- FK_ExpoPackingList_ExpoGrupoPrecio
;
/****** Object:  ForeignKey FK_ExpoPackingList_Idioma    Script Date: 07/30/2012 17:10:46 ******/
ALTER TABLE ExpoPackingList  ADD  CONSTRAINT FK_ExpoPackingList_Idioma FOREIGN KEY(idm_id)
REFERENCES Idioma (idm_id)
;
-- FK_ExpoPackingList_Idioma
;
/****** Object:  ForeignKey FK_ExpoPackingList_PackingList    Script Date: 07/30/2012 17:10:46 ******/
ALTER TABLE ExpoPackingList  ADD  CONSTRAINT FK_ExpoPackingList_PackingList FOREIGN KEY(pklst_id)
REFERENCES PackingList (pklst_id)
;
-- FK_ExpoPackingList_PackingList
;
/****** Object:  ForeignKey FK_ExpoPackingList_Usuario    Script Date: 07/30/2012 17:10:46 ******/
ALTER TABLE ExpoPackingList  ADD  CONSTRAINT FK_ExpoPackingList_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ExpoPackingList_Usuario
;
/****** Object:  ForeignKey FK_FacturaCompra_Asiento    Script Date: 07/30/2012 17:10:57 ******/
ALTER TABLE FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_Asiento FOREIGN KEY(as_id)
REFERENCES Asiento (as_id)
;
-- FK_FacturaCompra_Asiento
;
/****** Object:  ForeignKey FK_FacturaCompra_CentroCosto    Script Date: 07/30/2012 17:10:57 ******/
ALTER TABLE FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_FacturaCompra_CentroCosto
;
/****** Object:  ForeignKey FK_FacturaCompra_CondicionPago    Script Date: 07/30/2012 17:10:57 ******/
ALTER TABLE FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_CondicionPago FOREIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_FacturaCompra_CondicionPago
;
/****** Object:  ForeignKey FK_FacturaCompra_Documento    Script Date: 07/30/2012 17:10:57 ******/
ALTER TABLE FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_FacturaCompra_Documento
;
/****** Object:  ForeignKey FK_FacturaCompra_DocumentoTipo    Script Date: 07/30/2012 17:10:57 ******/
ALTER TABLE FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_FacturaCompra_DocumentoTipo
;
/****** Object:  ForeignKey FK_FacturaCompra_Legajo    Script Date: 07/30/2012 17:10:58 ******/
ALTER TABLE FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_FacturaCompra_Legajo
;
/****** Object:  ForeignKey FK_FacturaCompra_ListaDescuento    Script Date: 07/30/2012 17:10:58 ******/
ALTER TABLE FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_ListaDescuento FOREIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_FacturaCompra_ListaDescuento
;
/****** Object:  ForeignKey FK_FacturaCompra_ListaPrecio    Script Date: 07/30/2012 17:10:58 ******/
ALTER TABLE FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_ListaPrecio FOREIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_FacturaCompra_ListaPrecio
;
/****** Object:  ForeignKey FK_FacturaCompra_Moneda    Script Date: 07/30/2012 17:10:58 ******/
ALTER TABLE FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_Moneda FOREIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_FacturaCompra_Moneda
;
/****** Object:  ForeignKey FK_FacturaCompra_OrdenPago    Script Date: 07/30/2012 17:10:58 ******/
ALTER TABLE FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_OrdenPago FOREIGN KEY(opg_id)
REFERENCES OrdenPago (opg_id)
;
-- FK_FacturaCompra_OrdenPago
;
/****** Object:  ForeignKey FK_FacturaCompra_Proveedor    Script Date: 07/30/2012 17:10:58 ******/
ALTER TABLE FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_FacturaCompra_Proveedor
;
/****** Object:  ForeignKey FK_FacturaCompra_ProvinciaDestino    Script Date: 07/30/2012 17:10:58 ******/
ALTER TABLE FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_ProvinciaDestino FOREIGN KEY(pro_id_destino)
REFERENCES Provincia (pro_id)
;
-- FK_FacturaCompra_ProvinciaDestino
;
/****** Object:  ForeignKey FK_FacturaCompra_ProvinciaOrigen    Script Date: 07/30/2012 17:10:58 ******/
ALTER TABLE FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_ProvinciaOrigen FOREIGN KEY(pro_id_origen)
REFERENCES Provincia (pro_id)
;
-- FK_FacturaCompra_ProvinciaOrigen
;
/****** Object:  ForeignKey FK_FacturaCompra_RemitoCompra    Script Date: 07/30/2012 17:10:58 ******/
ALTER TABLE FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_RemitoCompra FOREIGN KEY(rc_id)
REFERENCES RemitoCompra (rc_id)
;
-- FK_FacturaCompra_RemitoCompra
;
/****** Object:  ForeignKey FK_FacturaCompra_Stock    Script Date: 07/30/2012 17:10:58 ******/
ALTER TABLE FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_Stock FOREIGN KEY(st_id)
REFERENCES Stock (st_id)
;
-- FK_FacturaCompra_Stock
;
/****** Object:  ForeignKey FK_FacturaCompra_Usuario    Script Date: 07/30/2012 17:10:59 ******/
ALTER TABLE FacturaCompra  ADD  CONSTRAINT FK_FacturaCompra_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_FacturaCompra_Usuario
;
/****** Object:  ForeignKey FK_FacturaCompraDeuda_FacturaCompra    Script Date: 07/30/2012 17:11:01 ******/
ALTER TABLE FacturaCompraDeuda  ADD  CONSTRAINT FK_FacturaCompraDeuda_FacturaCompra FOREIGN KEY(fc_id)
REFERENCES FacturaCompra (fc_id)
;
-- FK_FacturaCompraDeuda_FacturaCompra
;
/****** Object:  ForeignKey FK_FacturaCompraItem_CentroCosto    Script Date: 07/30/2012 17:11:07 ******/
ALTER TABLE FacturaCompraItem  ADD  CONSTRAINT FK_FacturaCompraItem_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_FacturaCompraItem_CentroCosto
;
/****** Object:  ForeignKey FK_FacturaCompraItem_Cuenta    Script Date: 07/30/2012 17:11:07 ******/
ALTER TABLE FacturaCompraItem  ADD  CONSTRAINT FK_FacturaCompraItem_Cuenta FOREIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_FacturaCompraItem_Cuenta
;
/****** Object:  ForeignKey FK_FacturaCompraItem_CuentaIvaRI    Script Date: 07/30/2012 17:11:07 ******/
ALTER TABLE FacturaCompraItem  ADD  CONSTRAINT FK_FacturaCompraItem_CuentaIvaRI FOREIGN KEY(cue_id_ivari)
REFERENCES Cuenta (cue_id)
;
-- FK_FacturaCompraItem_CuentaIvaRI
;
/****** Object:  ForeignKey FK_FacturaCompraItem_CuentaIvaRNI    Script Date: 07/30/2012 17:11:07 ******/
ALTER TABLE FacturaCompraItem  ADD  CONSTRAINT FK_FacturaCompraItem_CuentaIvaRNI FOREIGN KEY(cue_id_ivarni)
REFERENCES Cuenta (cue_id)
;
-- FK_FacturaCompraItem_CuentaIvaRNI
;
/****** Object:  ForeignKey FK_FacturaCompraItem_FacturaCompra    Script Date: 07/30/2012 17:11:07 ******/
ALTER TABLE FacturaCompraItem  ADD  CONSTRAINT FK_FacturaCompraItem_FacturaCompra FOREIGN KEY(fc_id)
REFERENCES FacturaCompra (fc_id)
;
-- FK_FacturaCompraItem_FacturaCompra
;
/****** Object:  ForeignKey FK_FacturaCompraItem_Producto    Script Date: 07/30/2012 17:11:07 ******/
ALTER TABLE FacturaCompraItem  ADD  CONSTRAINT FK_FacturaCompraItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_FacturaCompraItem_Producto
;
/****** Object:  ForeignKey FK_FacturaCompraItem_StockLote    Script Date: 07/30/2012 17:11:07 ******/
ALTER TABLE FacturaCompraItem  ADD  CONSTRAINT FK_FacturaCompraItem_StockLote FOREIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_FacturaCompraItem_StockLote
;
/****** Object:  ForeignKey FK_FacturaCompraItem_TipoOperacion    Script Date: 07/30/2012 17:11:07 ******/
ALTER TABLE FacturaCompraItem  ADD  CONSTRAINT FK_FacturaCompraItem_TipoOperacion FOREIGN KEY(to_id)
REFERENCES TipoOperacion (to_id)
;
-- FK_FacturaCompraItem_TipoOperacion
;
/****** Object:  ForeignKey FK_FacturaCompraItemBorradoTMP_FacturaCompraTMP    Script Date: 07/30/2012 17:11:08 ******/
ALTER TABLE FacturaCompraItemBorradoTMP  ADD  CONSTRAINT FK_FacturaCompraItemBorradoTMP_FacturaCompraTMP FOREIGN KEY(fcTMP_id)
REFERENCES FacturaCompraTMP (fcTMP_id)
;
-- FK_FacturaCompraItemBorradoTMP_FacturaCompraTMP
;
/****** Object:  ForeignKey FK_FacturaCompraItemSerieBTMP_FacturaCompraTMP    Script Date: 07/30/2012 17:11:09 ******/
ALTER TABLE FacturaCompraItemSerieBTMP  ADD  CONSTRAINT FK_FacturaCompraItemSerieBTMP_FacturaCompraTMP FOREIGN KEY(fcTMP_id)
REFERENCES FacturaCompraTMP (fcTMP_id)
;
-- FK_FacturaCompraItemSerieBTMP_FacturaCompraTMP
;
/****** Object:  ForeignKey FK_FacturaCompraItemSerieTMP_FacturaCompraItemTMP    Script Date: 07/30/2012 17:11:12 ******/
ALTER TABLE FacturaCompraItemSerieTMP  ADD  CONSTRAINT FK_FacturaCompraItemSerieTMP_FacturaCompraItemTMP FOREIGN KEY(fciTMP_id)
REFERENCES FacturaCompraItemTMP (fciTMP_id)
;
-- FK_FacturaCompraItemSerieTMP_FacturaCompraItemTMP
;
/****** Object:  ForeignKey FK_FacturaCompraItemSerieTMP_FacturaCompraTMP    Script Date: 07/30/2012 17:11:12 ******/
ALTER TABLE FacturaCompraItemSerieTMP  ADD  CONSTRAINT FK_FacturaCompraItemSerieTMP_FacturaCompraTMP FOREIGN KEY(fcTMP_id)
REFERENCES FacturaCompraTMP (fcTMP_id)
;
-- FK_FacturaCompraItemSerieTMP_FacturaCompraTMP
;
/****** Object:  ForeignKey FK_FacturaCompraItemTMP_FacturaCompraTMP    Script Date: 07/30/2012 17:11:19 ******/
ALTER TABLE FacturaCompraItemTMP  ADD  CONSTRAINT FK_FacturaCompraItemTMP_FacturaCompraTMP FOREIGN KEY(fcTMP_id)
REFERENCES FacturaCompraTMP (fcTMP_id)
;
-- FK_FacturaCompraItemTMP_FacturaCompraTMP
;
/****** Object:  ForeignKey FK_FacturaCompraLegajo_FacturaCompra    Script Date: 07/30/2012 17:11:20 ******/
ALTER TABLE FacturaCompraLegajo  ADD  CONSTRAINT FK_FacturaCompraLegajo_FacturaCompra FOREIGN KEY(fc_id)
REFERENCES FacturaCompra (fc_id)
;
-- FK_FacturaCompraLegajo_FacturaCompra
;
/****** Object:  ForeignKey FK_FacturaCompraLegajo_Legajo    Script Date: 07/30/2012 17:11:20 ******/
ALTER TABLE FacturaCompraLegajo  ADD  CONSTRAINT FK_FacturaCompraLegajo_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_FacturaCompraLegajo_Legajo
;
/****** Object:  ForeignKey FK_FacturaCompraLegajoBorradoTMP_FacturaCompraTMP    Script Date: 07/30/2012 17:11:21 ******/
ALTER TABLE FacturaCompraLegajoBorradoTMP  ADD  CONSTRAINT FK_FacturaCompraLegajoBorradoTMP_FacturaCompraTMP FOREIGN KEY(fcTMP_id)
REFERENCES FacturaCompraTMP (fcTMP_id)
;
-- FK_FacturaCompraLegajoBorradoTMP_FacturaCompraTMP
;
/****** Object:  ForeignKey FK_FacturaCompraLegajoTMP_FacturaCompraTMP    Script Date: 07/30/2012 17:11:23 ******/
ALTER TABLE FacturaCompraLegajoTMP  ADD  CONSTRAINT FK_FacturaCompraLegajoTMP_FacturaCompraTMP FOREIGN KEY(fcTMP_id)
REFERENCES FacturaCompraTMP (fcTMP_id)
;
-- FK_FacturaCompraLegajoTMP_FacturaCompraTMP
;
/****** Object:  ForeignKey FK_FacturaCompraNotaCredito_DeudaFactura    Script Date: 07/30/2012 17:11:25 ******/
ALTER TABLE FacturaCompraNotaCredito  ADD  CONSTRAINT FK_FacturaCompraNotaCredito_DeudaFactura FOREIGN KEY(fcd_id_factura)
REFERENCES FacturaCompraDeuda (fcd_id)
;
-- FK_FacturaCompraNotaCredito_DeudaFactura
;
/****** Object:  ForeignKey FK_FacturaCompraNotaCredito_DeudaNotaCredito    Script Date: 07/30/2012 17:11:25 ******/
ALTER TABLE FacturaCompraNotaCredito  ADD  CONSTRAINT FK_FacturaCompraNotaCredito_DeudaNotaCredito FOREIGN KEY(fcd_id_notacredito)
REFERENCES FacturaCompraDeuda (fcd_id)
;
-- FK_FacturaCompraNotaCredito_DeudaNotaCredito
;
/****** Object:  ForeignKey FK_FacturaCompraNotaCredito_FacturaCompra    Script Date: 07/30/2012 17:11:25 ******/
ALTER TABLE FacturaCompraNotaCredito  ADD  CONSTRAINT FK_FacturaCompraNotaCredito_FacturaCompra FOREIGN KEY(fc_id_factura)
REFERENCES FacturaCompra (fc_id)
;
-- FK_FacturaCompraNotaCredito_FacturaCompra
;
/****** Object:  ForeignKey FK_FacturaCompraNotaCredito_NotaCredito    Script Date: 07/30/2012 17:11:26 ******/
ALTER TABLE FacturaCompraNotaCredito  ADD  CONSTRAINT FK_FacturaCompraNotaCredito_NotaCredito FOREIGN KEY(fc_id_notacredito)
REFERENCES FacturaCompra (fc_id)
;
-- FK_FacturaCompraNotaCredito_NotaCredito
;
/****** Object:  ForeignKey FK_FacturaCompraNotaCredito_PagoFactura    Script Date: 07/30/2012 17:11:26 ******/
ALTER TABLE FacturaCompraNotaCredito  ADD  CONSTRAINT FK_FacturaCompraNotaCredito_PagoFactura FOREIGN KEY(fcp_id_factura)
REFERENCES FacturaCompraPago (fcp_id)
;
-- FK_FacturaCompraNotaCredito_PagoFactura
;
/****** Object:  ForeignKey FK_FacturaCompraNotaCredito_PagoNotaCredito    Script Date: 07/30/2012 17:11:26 ******/
ALTER TABLE FacturaCompraNotaCredito  ADD  CONSTRAINT FK_FacturaCompraNotaCredito_PagoNotaCredito FOREIGN KEY(fcp_id_notacredito)
REFERENCES FacturaCompraPago (fcp_id)
;
-- FK_FacturaCompraNotaCredito_PagoNotaCredito
;
/****** Object:  ForeignKey FK_FacturaCompraOrdenPago_FacturaCompra    Script Date: 07/30/2012 17:11:30 ******/
ALTER TABLE FacturaCompraOrdenPago  ADD  CONSTRAINT FK_FacturaCompraOrdenPago_FacturaCompra FOREIGN KEY(fc_id)
REFERENCES FacturaCompra (fc_id)
;
-- FK_FacturaCompraOrdenPago_FacturaCompra
;
/****** Object:  ForeignKey FK_FacturaCompraOrdenPago_FacturaCompraDeuda    Script Date: 07/30/2012 17:11:30 ******/
ALTER TABLE FacturaCompraOrdenPago  ADD  CONSTRAINT FK_FacturaCompraOrdenPago_FacturaCompraDeuda FOREIGN KEY(fcd_id)
REFERENCES FacturaCompraDeuda (fcd_id)
;
-- FK_FacturaCompraOrdenPago_FacturaCompraDeuda
;
/****** Object:  ForeignKey FK_FacturaCompraOrdenPago_FacturaCompraPago    Script Date: 07/30/2012 17:11:30 ******/
ALTER TABLE FacturaCompraOrdenPago  ADD  CONSTRAINT FK_FacturaCompraOrdenPago_FacturaCompraPago FOREIGN KEY(fcp_id)
REFERENCES FacturaCompraPago (fcp_id)
;
-- FK_FacturaCompraOrdenPago_FacturaCompraPago
;
/****** Object:  ForeignKey FK_FacturaCompraOrdenPago_OrdenPago    Script Date: 07/30/2012 17:11:30 ******/
ALTER TABLE FacturaCompraOrdenPago  ADD  CONSTRAINT FK_FacturaCompraOrdenPago_OrdenPago FOREIGN KEY(opg_id)
REFERENCES OrdenPago (opg_id)
;
-- FK_FacturaCompraOrdenPago_OrdenPago
;
/****** Object:  ForeignKey FK_FacturaCompraOrdenPagoTMP_OrdenPagoTMP    Script Date: 07/30/2012 17:11:32 ******/
ALTER TABLE FacturaCompraOrdenPagoTMP  ADD  CONSTRAINT FK_FacturaCompraOrdenPagoTMP_OrdenPagoTMP FOREIGN KEY(opgTMP_id)
REFERENCES OrdenPagoTMP (opgTMP_id)
;
-- FK_FacturaCompraOrdenPagoTMP_OrdenPagoTMP
;
/****** Object:  ForeignKey FK_FacturaCompraOtro_CentroCosto    Script Date: 07/30/2012 17:11:34 ******/
ALTER TABLE FacturaCompraOtro  ADD  CONSTRAINT FK_FacturaCompraOtro_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_FacturaCompraOtro_CentroCosto
;
/****** Object:  ForeignKey FK_FacturaCompraOtro_Cuenta    Script Date: 07/30/2012 17:11:34 ******/
ALTER TABLE FacturaCompraOtro  ADD  CONSTRAINT FK_FacturaCompraOtro_Cuenta FOREIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_FacturaCompraOtro_Cuenta
;
/****** Object:  ForeignKey FK_FacturaCompraOtro_FacturaCompra    Script Date: 07/30/2012 17:11:34 ******/
ALTER TABLE FacturaCompraOtro  ADD  CONSTRAINT FK_FacturaCompraOtro_FacturaCompra FOREIGN KEY(fc_id)
REFERENCES FacturaCompra (fc_id)
;
-- FK_FacturaCompraOtro_FacturaCompra
;
/****** Object:  ForeignKey FK_FacturaCompraOtroBorradoTMP_FacturaCompraTMP    Script Date: 07/30/2012 17:11:35 ******/
ALTER TABLE FacturaCompraOtroBorradoTMP  ADD  CONSTRAINT FK_FacturaCompraOtroBorradoTMP_FacturaCompraTMP FOREIGN KEY(fcTMP_id)
REFERENCES FacturaCompraTMP (fcTMP_id)
;
-- FK_FacturaCompraOtroBorradoTMP_FacturaCompraTMP
;
/****** Object:  ForeignKey FK_FacturaCompraOtroTMP_FacturaCompraTMP    Script Date: 07/30/2012 17:11:38 ******/
ALTER TABLE FacturaCompraOtroTMP  ADD  CONSTRAINT FK_FacturaCompraOtroTMP_FacturaCompraTMP FOREIGN KEY(fcTMP_id)
REFERENCES FacturaCompraTMP (fcTMP_id)
;
-- FK_FacturaCompraOtroTMP_FacturaCompraTMP
;
/****** Object:  ForeignKey FK_FacturaCompraPago_FacturaCompra    Script Date: 07/30/2012 17:11:39 ******/
ALTER TABLE FacturaCompraPago  ADD  CONSTRAINT FK_FacturaCompraPago_FacturaCompra FOREIGN KEY(fc_id)
REFERENCES FacturaCompra (fc_id)
;
-- FK_FacturaCompraPago_FacturaCompra
;
/****** Object:  ForeignKey FK_FacturaCompraPercepcion_CentroCosto    Script Date: 07/30/2012 17:11:41 ******/
ALTER TABLE FacturaCompraPercepcion  ADD  CONSTRAINT FK_FacturaCompraPercepcion_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_FacturaCompraPercepcion_CentroCosto
;
/****** Object:  ForeignKey FK_FacturaCompraPercepcion_FacturaCompra    Script Date: 07/30/2012 17:11:41 ******/
ALTER TABLE FacturaCompraPercepcion  ADD  CONSTRAINT FK_FacturaCompraPercepcion_FacturaCompra FOREIGN KEY(fc_id)
REFERENCES FacturaCompra (fc_id)
;
-- FK_FacturaCompraPercepcion_FacturaCompra
;
/****** Object:  ForeignKey FK_FacturaCompraPercepcionBorradoTMP_FacturaCompraTMP    Script Date: 07/30/2012 17:11:42 ******/
ALTER TABLE FacturaCompraPercepcionBorradoTMP  ADD  CONSTRAINT FK_FacturaCompraPercepcionBorradoTMP_FacturaCompraTMP FOREIGN KEY(fcTMP_id)
REFERENCES FacturaCompraTMP (fcTMP_id)
;
-- FK_FacturaCompraPercepcionBorradoTMP_FacturaCompraTMP
;
/****** Object:  ForeignKey FK_FacturaVentaCajero_FacturaVenta    Script Date: 07/30/2012 17:12:11 ******/
ALTER TABLE FacturaVentaCajero  ADD  CONSTRAINT FK_FacturaVentaCajero_FacturaVenta FOREIGN KEY(fv_id)
REFERENCES FacturaVenta (fv_id)
;
-- FK_FacturaVentaCajero_FacturaVenta
;
/****** Object:  ForeignKey FK_FacturaVentaCobranza_Cobranza    Script Date: 07/30/2012 17:12:14 ******/
ALTER TABLE FacturaVentaCobranza  ADD  CONSTRAINT FK_FacturaVentaCobranza_Cobranza FOREIGN KEY(cobz_id)
REFERENCES Cobranza (cobz_id)
;
-- FK_FacturaVentaCobranza_Cobranza
;
/****** Object:  ForeignKey FK_FacturaVentaCobranza_FacturaVenta    Script Date: 07/30/2012 17:12:14 ******/
ALTER TABLE FacturaVentaCobranza  ADD  CONSTRAINT FK_FacturaVentaCobranza_FacturaVenta FOREIGN KEY(fv_id)
REFERENCES FacturaVenta (fv_id)
;
-- FK_FacturaVentaCobranza_FacturaVenta
;
/****** Object:  ForeignKey FK_FacturaVentaCobranza_FacturaVentaDeuda    Script Date: 07/30/2012 17:12:14 ******/
ALTER TABLE FacturaVentaCobranza  ADD  CONSTRAINT FK_FacturaVentaCobranza_FacturaVentaDeuda FOREIGN KEY(fvd_id)
REFERENCES FacturaVentaDeuda (fvd_id)
;
-- FK_FacturaVentaCobranza_FacturaVentaDeuda
;
/****** Object:  ForeignKey FK_FacturaVentaCobranza_FacturaVentaPago    Script Date: 07/30/2012 17:12:14 ******/
ALTER TABLE FacturaVentaCobranza  ADD  CONSTRAINT FK_FacturaVentaCobranza_FacturaVentaPago FOREIGN KEY(fvp_id)
REFERENCES FacturaVentaPago (fvp_id)
;
-- FK_FacturaVentaCobranza_FacturaVentaPago
;
/****** Object:  ForeignKey FK_FacturaVentaCobranzaTMP_CobranzaTMP    Script Date: 07/30/2012 17:12:16 ******/
ALTER TABLE FacturaVentaCobranzaTMP  ADD  CONSTRAINT FK_FacturaVentaCobranzaTMP_CobranzaTMP FOREIGN KEY(cobzTMP_id)
REFERENCES CobranzaTMP (cobzTMP_id)
;
-- FK_FacturaVentaCobranzaTMP_CobranzaTMP
;
/****** Object:  ForeignKey FK_FacturaVentaDeuda_FacturaVenta    Script Date: 07/30/2012 17:12:18 ******/
ALTER TABLE FacturaVentaDeuda  ADD  CONSTRAINT FK_FacturaVentaDeuda_FacturaVenta FOREIGN KEY(fv_id)
REFERENCES FacturaVenta (fv_id)
;
-- FK_FacturaVentaDeuda_FacturaVenta
;
/****** Object:  ForeignKey FK_FacturaVentaItem_CentroCosto    Script Date: 07/30/2012 17:12:24 ******/
ALTER TABLE FacturaVentaItem  ADD  CONSTRAINT FK_FacturaVentaItem_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_FacturaVentaItem_CentroCosto
;
/****** Object:  ForeignKey FK_FacturaVentaItem_Cuenta    Script Date: 07/30/2012 17:12:24 ******/
ALTER TABLE FacturaVentaItem  ADD  CONSTRAINT FK_FacturaVentaItem_Cuenta FOREIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_FacturaVentaItem_Cuenta
;
/****** Object:  ForeignKey FK_FacturaVentaItem_CuentaIvaRI    Script Date: 07/30/2012 17:12:24 ******/
ALTER TABLE FacturaVentaItem  ADD  CONSTRAINT FK_FacturaVentaItem_CuentaIvaRI FOREIGN KEY(cue_id_ivari)
REFERENCES Cuenta (cue_id)
;
-- FK_FacturaVentaItem_CuentaIvaRI
;
/****** Object:  ForeignKey FK_FacturaVentaItem_CuentaIvaRNI    Script Date: 07/30/2012 17:12:25 ******/
ALTER TABLE FacturaVentaItem  ADD  CONSTRAINT FK_FacturaVentaItem_CuentaIvaRNI FOREIGN KEY(cue_id_ivarni)
REFERENCES Cuenta (cue_id)
;
-- FK_FacturaVentaItem_CuentaIvaRNI
;
/****** Object:  ForeignKey FK_FacturaVentaItem_FacturaVenta    Script Date: 07/30/2012 17:12:25 ******/
ALTER TABLE FacturaVentaItem  ADD  CONSTRAINT FK_FacturaVentaItem_FacturaVenta FOREIGN KEY(fv_id)
REFERENCES FacturaVenta (fv_id)
;
-- FK_FacturaVentaItem_FacturaVenta
;
/****** Object:  ForeignKey FK_FacturaVentaItem_Producto    Script Date: 07/30/2012 17:12:25 ******/
ALTER TABLE FacturaVentaItem  ADD  CONSTRAINT FK_FacturaVentaItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_FacturaVentaItem_Producto
;
/****** Object:  ForeignKey FK_FacturaVentaItem_StockLote    Script Date: 07/30/2012 17:12:25 ******/
ALTER TABLE FacturaVentaItem  ADD  CONSTRAINT FK_FacturaVentaItem_StockLote FOREIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_FacturaVentaItem_StockLote
;
/****** Object:  ForeignKey FK_FacturaVentaItem_TipoOperacion    Script Date: 07/30/2012 17:12:25 ******/
ALTER TABLE FacturaVentaItem  ADD  CONSTRAINT FK_FacturaVentaItem_TipoOperacion FOREIGN KEY(to_id)
REFERENCES TipoOperacion (to_id)
;
-- FK_FacturaVentaItem_TipoOperacion
;
/****** Object:  ForeignKey FK_FacturaVentaItemBorradoTMP_FacturaVentaTMP    Script Date: 07/30/2012 17:12:26 ******/
ALTER TABLE FacturaVentaItemBorradoTMP  ADD  CONSTRAINT FK_FacturaVentaItemBorradoTMP_FacturaVentaTMP FOREIGN KEY(fvTMP_id)
REFERENCES FacturaVentaTMP (fvTMP_id)
;
-- FK_FacturaVentaItemBorradoTMP_FacturaVentaTMP
;
/****** Object:  ForeignKey FK_FacturaVentaItemSerieTMP_FacturaVentaItemTMP    Script Date: 07/30/2012 17:12:29 ******/
ALTER TABLE FacturaVentaItemSerieTMP  ADD  CONSTRAINT FK_FacturaVentaItemSerieTMP_FacturaVentaItemTMP FOREIGN KEY(fviTMP_id)
REFERENCES FacturaVentaItemTMP (fviTMP_id)
;
-- FK_FacturaVentaItemSerieTMP_FacturaVentaItemTMP
;
/****** Object:  ForeignKey FK_FacturaVentaItemSerieTMP_FacturaVentaTMP    Script Date: 07/30/2012 17:12:29 ******/
ALTER TABLE FacturaVentaItemSerieTMP  ADD  CONSTRAINT FK_FacturaVentaItemSerieTMP_FacturaVentaTMP FOREIGN KEY(fvTMP_id)
REFERENCES FacturaVentaTMP (fvTMP_id)
;
-- FK_FacturaVentaItemSerieTMP_FacturaVentaTMP
;
/****** Object:  ForeignKey FK_FacturaVentaItemTMP_FacturaVentaTMP    Script Date: 07/30/2012 17:12:35 ******/
ALTER TABLE FacturaVentaItemTMP  ADD  CONSTRAINT FK_FacturaVentaItemTMP_FacturaVentaTMP FOREIGN KEY(fvTMP_id)
REFERENCES FacturaVentaTMP (fvTMP_id)
;
-- FK_FacturaVentaItemTMP_FacturaVentaTMP
;
/****** Object:  ForeignKey FK_FacturaVentaNotaCredito_DeudaFactura    Script Date: 07/30/2012 17:12:37 ******/
ALTER TABLE FacturaVentaNotaCredito  ADD  CONSTRAINT FK_FacturaVentaNotaCredito_DeudaFactura FOREIGN KEY(fvd_id_factura)
REFERENCES FacturaVentaDeuda (fvd_id)
;
-- FK_FacturaVentaNotaCredito_DeudaFactura
;
/****** Object:  ForeignKey FK_FacturaVentaNotaCredito_DeudaNotaCredito    Script Date: 07/30/2012 17:12:37 ******/
ALTER TABLE FacturaVentaNotaCredito  ADD  CONSTRAINT FK_FacturaVentaNotaCredito_DeudaNotaCredito FOREIGN KEY(fvd_id_notacredito)
REFERENCES FacturaVentaDeuda (fvd_id)
;
-- FK_FacturaVentaNotaCredito_DeudaNotaCredito
;
/****** Object:  ForeignKey FK_FacturaVentaNotaCredito_FacturaVenta    Script Date: 07/30/2012 17:12:37 ******/
ALTER TABLE FacturaVentaNotaCredito  ADD  CONSTRAINT FK_FacturaVentaNotaCredito_FacturaVenta FOREIGN KEY(fv_id_factura)
REFERENCES FacturaVenta (fv_id)
;
-- FK_FacturaVentaNotaCredito_FacturaVenta
;
/****** Object:  ForeignKey FK_FacturaVentaNotaCredito_NotaCredito    Script Date: 07/30/2012 17:12:37 ******/
ALTER TABLE FacturaVentaNotaCredito  ADD  CONSTRAINT FK_FacturaVentaNotaCredito_NotaCredito FOREIGN KEY(fv_id_notacredito)
REFERENCES FacturaVenta (fv_id)
;
-- FK_FacturaVentaNotaCredito_NotaCredito
;
/****** Object:  ForeignKey FK_FacturaVentaNotaCredito_PagoFactura    Script Date: 07/30/2012 17:12:38 ******/
ALTER TABLE FacturaVentaNotaCredito  ADD  CONSTRAINT FK_FacturaVentaNotaCredito_PagoFactura FOREIGN KEY(fvp_id_factura)
REFERENCES FacturaVentaPago (fvp_id)
;
-- FK_FacturaVentaNotaCredito_PagoFactura
;
/****** Object:  ForeignKey FK_FacturaVentaNotaCredito_PagoNotaCredito    Script Date: 07/30/2012 17:12:38 ******/
ALTER TABLE FacturaVentaNotaCredito  ADD  CONSTRAINT FK_FacturaVentaNotaCredito_PagoNotaCredito FOREIGN KEY(fvp_id_notacredito)
REFERENCES FacturaVentaPago (fvp_id)
;
-- FK_FacturaVentaNotaCredito_PagoNotaCredito
;
/****** Object:  ForeignKey FK_FacturaVentaPago_FacturaVenta    Script Date: 07/30/2012 17:12:41 ******/
ALTER TABLE FacturaVentaPago  ADD  CONSTRAINT FK_FacturaVentaPago_FacturaVenta FOREIGN KEY(fv_id)
REFERENCES FacturaVenta (fv_id)
;
-- FK_FacturaVentaPago_FacturaVenta
;
/****** Object:  ForeignKey FK_FacturaVentaPercepcion_CentroCosto    Script Date: 07/30/2012 17:12:43 ******/
ALTER TABLE FacturaVentaPercepcion  ADD  CONSTRAINT FK_FacturaVentaPercepcion_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_FacturaVentaPercepcion_CentroCosto
;
/****** Object:  ForeignKey FK_FacturaVentaPercepcion_FacturaVenta    Script Date: 07/30/2012 17:12:43 ******/
ALTER TABLE FacturaVentaPercepcion  ADD  CONSTRAINT FK_FacturaVentaPercepcion_FacturaVenta FOREIGN KEY(fv_id)
REFERENCES FacturaVenta (fv_id)
;
-- FK_FacturaVentaPercepcion_FacturaVenta
;
/****** Object:  ForeignKey FK_FacturaVentaPercepcionBorradoTMP_FacturaVentaTMP    Script Date: 07/30/2012 17:12:44 ******/
ALTER TABLE FacturaVentaPercepcionBorradoTMP  ADD  CONSTRAINT FK_FacturaVentaPercepcionBorradoTMP_FacturaVentaTMP FOREIGN KEY(fvTMP_id)
REFERENCES FacturaVentaTMP (fvTMP_id)
;
-- FK_FacturaVentaPercepcionBorradoTMP_FacturaVentaTMP
;
/****** Object:  ForeignKey FK_Feriado_Pais    Script Date: 07/30/2012 17:13:03 ******/
ALTER TABLE Feriado  ADD  CONSTRAINT FK_Feriado_Pais FOREIGN KEY(pa_id)
REFERENCES Pais (pa_id)
;
-- FK_Feriado_Pais
;
/****** Object:  ForeignKey FK_Feriado_Provincia    Script Date: 07/30/2012 17:13:03 ******/
ALTER TABLE Feriado  ADD  CONSTRAINT FK_Feriado_Provincia FOREIGN KEY(pro_id)
REFERENCES Provincia (pro_id)
;
-- FK_Feriado_Provincia
;
/****** Object:  ForeignKey FK_FeriadoItem_Feriado    Script Date: 07/30/2012 17:13:04 ******/
ALTER TABLE FeriadoItem  ADD  CONSTRAINT FK_FeriadoItem_Feriado FOREIGN KEY(fe_id)
REFERENCES Feriado (fe_id)
;
-- FK_FeriadoItem_Feriado
;
/****** Object:  ForeignKey FK_Garantia_Moneda    Script Date: 07/30/2012 17:13:13 ******/
ALTER TABLE Garantia  ADD  CONSTRAINT FK_Garantia_Moneda FOREIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_Garantia_Moneda
;
/****** Object:  ForeignKey FK_Garantia_Proveedor    Script Date: 07/30/2012 17:13:13 ******/
ALTER TABLE Garantia  ADD  CONSTRAINT FK_Garantia_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_Garantia_Proveedor
;
/****** Object:  ForeignKey FK_Gasto_Moneda    Script Date: 07/30/2012 17:13:16 ******/
ALTER TABLE Gasto  ADD  CONSTRAINT FK_Gasto_Moneda FOREIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_Gasto_Moneda
;
/****** Object:  ForeignKey FK_Gasto_TasaImpositiva    Script Date: 07/30/2012 17:13:16 ******/
ALTER TABLE Gasto  ADD  CONSTRAINT FK_Gasto_TasaImpositiva FOREIGN KEY(ti_id)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_Gasto_TasaImpositiva
;
/****** Object:  ForeignKey FK_Gasto_Usuario    Script Date: 07/30/2012 17:13:16 ******/
ALTER TABLE Gasto  ADD  CONSTRAINT FK_Gasto_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Gasto_Usuario
;
/****** Object:  ForeignKey FK_GridView_Reporte    Script Date: 07/30/2012 17:13:18 ******/
ALTER TABLE GridView  ADD  CONSTRAINT FK_GridView_Reporte FOREIGN KEY(rpt_id)
REFERENCES Reporte (rpt_id)
;
-- FK_GridView_Reporte
;
/****** Object:  ForeignKey FK_GridView_Usuario    Script Date: 07/30/2012 17:13:18 ******/
ALTER TABLE GridView  ADD  CONSTRAINT FK_GridView_Usuario FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_GridView_Usuario
;
/****** Object:  ForeignKey FK_GridViewColumn_GridView    Script Date: 07/30/2012 17:13:20 ******/
ALTER TABLE GridViewColumn  ADD  CONSTRAINT FK_GridViewColumn_GridView FOREIGN KEY(grdv_id)
REFERENCES GridView (grdv_id)
;
-- FK_GridViewColumn_GridView
;
/****** Object:  ForeignKey FK_GridViewFiltro_GridView    Script Date: 07/30/2012 17:13:21 ******/
ALTER TABLE GridViewFiltro  ADD  CONSTRAINT FK_GridViewFiltro_GridView FOREIGN KEY(grdv_id)
REFERENCES GridView (grdv_id)
;
-- FK_GridViewFiltro_GridView
;
/****** Object:  ForeignKey FK_GridViewFormato_GridView    Script Date: 07/30/2012 17:13:23 ******/
ALTER TABLE GridViewFormato  ADD  CONSTRAINT FK_GridViewFormato_GridView FOREIGN KEY(grdv_id)
REFERENCES GridView (grdv_id)
;
-- FK_GridViewFormato_GridView
;
/****** Object:  ForeignKey FK_GridViewFormula_GridView    Script Date: 07/30/2012 17:13:24 ******/
ALTER TABLE GridViewFormula  ADD  CONSTRAINT FK_GridViewFormula_GridView FOREIGN KEY(grdv_id)
REFERENCES GridView (grdv_id)
;
-- FK_GridViewFormula_GridView
;
/****** Object:  ForeignKey FK_GridViewGrupo_GridView    Script Date: 07/30/2012 17:13:26 ******/
ALTER TABLE GridViewGrupo  ADD  CONSTRAINT FK_GridViewGrupo_GridView FOREIGN KEY(grdv_id)
REFERENCES GridView (grdv_id)
;
-- FK_GridViewGrupo_GridView
;
/****** Object:  ForeignKey FK_Historia_Tabla    Script Date: 07/30/2012 17:13:27 ******/
ALTER TABLE Historia  ADD  CONSTRAINT FK_Historia_Tabla FOREIGN KEY(tbl_id)
REFERENCES Tabla (tbl_id)
;
-- FK_Historia_Tabla
;
/****** Object:  ForeignKey FK_Historia_Usuario    Script Date: 07/30/2012 17:13:27 ******/
ALTER TABLE Historia  ADD  CONSTRAINT FK_Historia_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Historia_Usuario
;
/****** Object:  ForeignKey FK_Hoja_Arbol    Script Date: 07/30/2012 17:13:30 ******/
ALTER TABLE Hoja  ADD  CONSTRAINT FK_Hoja_Arbol FOREIGN KEY(arb_id)
REFERENCES Arbol (arb_id)
;
-- FK_Hoja_Arbol
;
/****** Object:  ForeignKey FK_Hoja_Rama    Script Date: 07/30/2012 17:13:30 ******/
ALTER TABLE Hoja  ADD  CONSTRAINT FK_Hoja_Rama FOREIGN KEY(ram_id)
REFERENCES Rama (ram_id)
;
-- FK_Hoja_Rama
;
/****** Object:  ForeignKey FK_Hoja_Usuario    Script Date: 07/30/2012 17:13:30 ******/
ALTER TABLE Hoja  ADD  CONSTRAINT FK_Hoja_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Hoja_Usuario
;
/****** Object:  ForeignKey FK_HojaRuta_Camion    Script Date: 07/30/2012 17:13:37 ******/
ALTER TABLE HojaRuta  ADD  CONSTRAINT FK_HojaRuta_Camion FOREIGN KEY(cam_id)
REFERENCES Camion (cam_id)
;
-- FK_HojaRuta_Camion
;
/****** Object:  ForeignKey FK_HojaRuta_Camion1    Script Date: 07/30/2012 17:13:37 ******/
ALTER TABLE HojaRuta  ADD  CONSTRAINT FK_HojaRuta_Camion1 FOREIGN KEY(cam_id_semi)
REFERENCES Camion (cam_id)
;
-- FK_HojaRuta_Camion1
;
/****** Object:  ForeignKey FK_HojaRuta_Chofer    Script Date: 07/30/2012 17:13:37 ******/
ALTER TABLE HojaRuta  ADD  CONSTRAINT FK_HojaRuta_Chofer FOREIGN KEY(chof_id)
REFERENCES Chofer (chof_id)
;
-- FK_HojaRuta_Chofer
;
/****** Object:  ForeignKey FK_HojaRuta_Estado    Script Date: 07/30/2012 17:13:38 ******/
ALTER TABLE HojaRuta  ADD  CONSTRAINT FK_HojaRuta_Estado FOREIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_HojaRuta_Estado
;
/****** Object:  ForeignKey FK_HojaRuta_FacturaVenta    Script Date: 07/30/2012 17:13:38 ******/
ALTER TABLE HojaRuta  ADD  CONSTRAINT FK_HojaRuta_FacturaVenta FOREIGN KEY(fv_id_faltante)
REFERENCES FacturaVenta (fv_id)
;
-- FK_HojaRuta_FacturaVenta
;
/****** Object:  ForeignKey FK_HojaRuta_MovimientoFondo    Script Date: 07/30/2012 17:13:38 ******/
ALTER TABLE HojaRuta  ADD  CONSTRAINT FK_HojaRuta_MovimientoFondo FOREIGN KEY(mf_id_tickets)
REFERENCES MovimientoFondo (mf_id)
;
-- FK_HojaRuta_MovimientoFondo
;
/****** Object:  ForeignKey FK_HojaRuta_MovimientoFondoSobrante    Script Date: 07/30/2012 17:13:38 ******/
ALTER TABLE HojaRuta  ADD  CONSTRAINT FK_HojaRuta_MovimientoFondoSobrante FOREIGN KEY(mf_id_sobrante)
REFERENCES MovimientoFondo (mf_id)
;
-- FK_HojaRuta_MovimientoFondoSobrante
;
/****** Object:  ForeignKey FK_HojaRuta_Sucursal    Script Date: 07/30/2012 17:13:38 ******/
ALTER TABLE HojaRuta  ADD  CONSTRAINT FK_HojaRuta_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_HojaRuta_Sucursal
;
/****** Object:  ForeignKey FK_HojaRutaItem_FacturaVenta    Script Date: 07/30/2012 17:13:44 ******/
ALTER TABLE HojaRutaItem  ADD  CONSTRAINT FK_HojaRutaItem_FacturaVenta FOREIGN KEY(fv_id)
REFERENCES FacturaVenta (fv_id)
;
-- FK_HojaRutaItem_FacturaVenta
;
/****** Object:  ForeignKey FK_HojaRutaItem_HojaRuta    Script Date: 07/30/2012 17:13:44 ******/
ALTER TABLE HojaRutaItem  ADD  CONSTRAINT FK_HojaRutaItem_HojaRuta FOREIGN KEY(hr_id)
REFERENCES HojaRuta (hr_id)
;
-- FK_HojaRutaItem_HojaRuta
;
/****** Object:  ForeignKey FK_HojaRutaItem_HojaRutaCobranzaTipo    Script Date: 07/30/2012 17:13:44 ******/
ALTER TABLE HojaRutaItem  ADD  CONSTRAINT FK_HojaRutaItem_HojaRutaCobranzaTipo FOREIGN KEY(hrct_id)
REFERENCES HojaRutaCobranzaTipo (hrct_id)
;
-- FK_HojaRutaItem_HojaRutaCobranzaTipo
;
/****** Object:  ForeignKey FK_HojaRutaItem_OrdenServicio    Script Date: 07/30/2012 17:13:44 ******/
ALTER TABLE HojaRutaItem  ADD  CONSTRAINT FK_HojaRutaItem_OrdenServicio FOREIGN KEY(os_id)
REFERENCES OrdenServicio (os_id)
;
-- FK_HojaRutaItem_OrdenServicio
;
/****** Object:  ForeignKey FK_HojaRutaItem_ParteDiario    Script Date: 07/30/2012 17:13:44 ******/
ALTER TABLE HojaRutaItem  ADD  CONSTRAINT FK_HojaRutaItem_ParteDiario FOREIGN KEY(ptd_id)
REFERENCES ParteDiario (ptd_id)
;
-- FK_HojaRutaItem_ParteDiario
;
/****** Object:  ForeignKey FK_HojaRutaItem_RemitoVenta    Script Date: 07/30/2012 17:13:44 ******/
ALTER TABLE HojaRutaItem  ADD  CONSTRAINT FK_HojaRutaItem_RemitoVenta FOREIGN KEY(rv_id)
REFERENCES RemitoVenta (rv_id)
;
-- FK_HojaRutaItem_RemitoVenta
;
/****** Object:  ForeignKey FK_Hora_Cliente    Script Date: 07/30/2012 17:13:48 ******/
ALTER TABLE Hora  ADD  CONSTRAINT FK_Hora_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_Hora_Cliente
;
/****** Object:  ForeignKey FK_Hora_Objetivo    Script Date: 07/30/2012 17:13:48 ******/
ALTER TABLE Hora  ADD  CONSTRAINT FK_Hora_Objetivo FOREIGN KEY(obje_id)
REFERENCES Objetivo (obje_id)
;
-- FK_Hora_Objetivo
;
/****** Object:  ForeignKey FK_Hora_Proyecto    Script Date: 07/30/2012 17:13:48 ******/
ALTER TABLE Hora  ADD  CONSTRAINT FK_Hora_Proyecto FOREIGN KEY(proy_id)
REFERENCES Proyecto (proy_id)
;
-- FK_Hora_Proyecto
;
/****** Object:  ForeignKey FK_Hora_ProyectoItem    Script Date: 07/30/2012 17:13:48 ******/
ALTER TABLE Hora  ADD  CONSTRAINT FK_Hora_ProyectoItem FOREIGN KEY(proyi_id)
REFERENCES ProyectoItem (proyi_id)
;
-- FK_Hora_ProyectoItem
;
/****** Object:  ForeignKey FK_Hora_Tarea    Script Date: 07/30/2012 17:13:48 ******/
ALTER TABLE Hora  ADD  CONSTRAINT FK_Hora_Tarea FOREIGN KEY(tar_id)
REFERENCES Tarea (tar_id)
;
-- FK_Hora_Tarea
;
/****** Object:  ForeignKey FK_Hora_Usuario    Script Date: 07/30/2012 17:13:49 ******/
ALTER TABLE Hora  ADD  CONSTRAINT FK_Hora_Usuario FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_Hora_Usuario
;
/****** Object:  ForeignKey FK_HoraFacturaVenta_FacturaVentaItem    Script Date: 07/30/2012 17:13:50 ******/
ALTER TABLE HoraFacturaVenta  ADD  CONSTRAINT FK_HoraFacturaVenta_FacturaVentaItem FOREIGN KEY(fvi_id)
REFERENCES FacturaVentaItem (fvi_id)
;
-- FK_HoraFacturaVenta_FacturaVentaItem
;
/****** Object:  ForeignKey FK_HoraFacturaVenta_Hora    Script Date: 07/30/2012 17:13:50 ******/
ALTER TABLE HoraFacturaVenta  ADD  CONSTRAINT FK_HoraFacturaVenta_Hora FOREIGN KEY(hora_id)
REFERENCES Hora (hora_id)
;
-- FK_HoraFacturaVenta_Hora
;
/****** Object:  ForeignKey FK_Idioma_Usuario    Script Date: 07/30/2012 17:13:55 ******/
ALTER TABLE Idioma  ADD  CONSTRAINT FK_Idioma_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Idioma_Usuario
;
/****** Object:  ForeignKey FK_Importacion_Usuario    Script Date: 07/30/2012 17:13:58 ******/
ALTER TABLE Importacion  ADD  CONSTRAINT FK_Importacion_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Importacion_Usuario
;
/****** Object:  ForeignKey FK_ImportacionID_ImportacionIDTipo    Script Date: 07/30/2012 17:14:00 ******/
ALTER TABLE ImportacionID  ADD  CONSTRAINT FK_ImportacionID_ImportacionIDTipo FOREIGN KEY(impidt_id)
REFERENCES ImportacionIDTipo (impidt_id)
;
-- FK_ImportacionID_ImportacionIDTipo
;
/****** Object:  ForeignKey FK_ImportacionID_Usuario    Script Date: 07/30/2012 17:14:00 ******/
ALTER TABLE ImportacionID  ADD  CONSTRAINT FK_ImportacionID_Usuario FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_ImportacionID_Usuario
;
/****** Object:  ForeignKey FK_ImportacionItem_Importacion    Script Date: 07/30/2012 17:14:02 ******/
ALTER TABLE ImportacionItem  ADD  CONSTRAINT FK_ImportacionItem_Importacion FOREIGN KEY(imp_id)
REFERENCES Importacion (imp_id)
;
-- FK_ImportacionItem_Importacion
;
/****** Object:  ForeignKey FK_ImportacionItem_Usuario    Script Date: 07/30/2012 17:14:02 ******/
ALTER TABLE ImportacionItem  ADD  CONSTRAINT FK_ImportacionItem_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ImportacionItem_Usuario
;
/****** Object:  ForeignKey FK_ImportacionLog_ImportacionProceso    Script Date: 07/30/2012 17:14:04 ******/
ALTER TABLE ImportacionLog  ADD  CONSTRAINT FK_ImportacionLog_ImportacionProceso FOREIGN KEY(impp_id)
REFERENCES ImportacionProceso (impp_id)
;
-- FK_ImportacionLog_ImportacionProceso
;
/****** Object:  ForeignKey FK_ImportacionProceso_Usuario    Script Date: 07/30/2012 17:14:06 ******/
ALTER TABLE ImportacionProceso  ADD  CONSTRAINT FK_ImportacionProceso_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ImportacionProceso_Usuario
;
/****** Object:  ForeignKey FK_ImportacionProcesoItem_ImportacionProceso    Script Date: 07/30/2012 17:14:08 ******/
ALTER TABLE ImportacionProcesoItem  ADD  CONSTRAINT FK_ImportacionProcesoItem_ImportacionProceso FOREIGN KEY(impp_id)
REFERENCES ImportacionProceso (impp_id)
;
-- FK_ImportacionProcesoItem_ImportacionProceso
;
/****** Object:  ForeignKey FK_ImportacionProcesoItem_Usuario    Script Date: 07/30/2012 17:14:08 ******/
ALTER TABLE ImportacionProcesoItem  ADD  CONSTRAINT FK_ImportacionProcesoItem_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ImportacionProcesoItem_Usuario
;
/****** Object:  ForeignKey FK_ImportacionTemp_CentroCosto    Script Date: 07/30/2012 17:14:16 ******/
ALTER TABLE ImportacionTemp  ADD  CONSTRAINT FK_ImportacionTemp_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_ImportacionTemp_CentroCosto
;
/****** Object:  ForeignKey FK_ImportacionTemp_CondicionPago    Script Date: 07/30/2012 17:14:16 ******/
ALTER TABLE ImportacionTemp  ADD  CONSTRAINT FK_ImportacionTemp_CondicionPago FOREIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_ImportacionTemp_CondicionPago
;
/****** Object:  ForeignKey FK_ImportacionTemp_Documento    Script Date: 07/30/2012 17:14:16 ******/
ALTER TABLE ImportacionTemp  ADD  CONSTRAINT FK_ImportacionTemp_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_ImportacionTemp_Documento
;
/****** Object:  ForeignKey FK_ImportacionTemp_DocumentoTipo    Script Date: 07/30/2012 17:14:16 ******/
ALTER TABLE ImportacionTemp  ADD  CONSTRAINT FK_ImportacionTemp_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_ImportacionTemp_DocumentoTipo
;
/****** Object:  ForeignKey FK_ImportacionTemp_Estado    Script Date: 07/30/2012 17:14:16 ******/
ALTER TABLE ImportacionTemp  ADD  CONSTRAINT FK_ImportacionTemp_Estado FOREIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_ImportacionTemp_Estado
;
/****** Object:  ForeignKey FK_ImportacionTemp_ListaDescuento    Script Date: 07/30/2012 17:14:16 ******/
ALTER TABLE ImportacionTemp  ADD  CONSTRAINT FK_ImportacionTemp_ListaDescuento FOREIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_ImportacionTemp_ListaDescuento
;
/****** Object:  ForeignKey FK_ImportacionTemp_ListaPrecio    Script Date: 07/30/2012 17:14:16 ******/
ALTER TABLE ImportacionTemp  ADD  CONSTRAINT FK_ImportacionTemp_ListaPrecio FOREIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_ImportacionTemp_ListaPrecio
;
/****** Object:  ForeignKey FK_ImportacionTemp_Proveedor    Script Date: 07/30/2012 17:14:16 ******/
ALTER TABLE ImportacionTemp  ADD  CONSTRAINT FK_ImportacionTemp_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_ImportacionTemp_Proveedor
;
/****** Object:  ForeignKey FK_ImportacionTemp_Stock    Script Date: 07/30/2012 17:14:16 ******/
ALTER TABLE ImportacionTemp  ADD  CONSTRAINT FK_ImportacionTemp_Stock FOREIGN KEY(st_id)
REFERENCES Stock (st_id)
;
-- FK_ImportacionTemp_Stock
;
/****** Object:  ForeignKey FK_ImportacionTemp_Sucursal    Script Date: 07/30/2012 17:14:17 ******/
ALTER TABLE ImportacionTemp  ADD  CONSTRAINT FK_ImportacionTemp_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_ImportacionTemp_Sucursal
;
/****** Object:  ForeignKey FK_ImportacionTempGarantia_Garantia    Script Date: 07/30/2012 17:14:18 ******/
ALTER TABLE ImportacionTempGarantia  ADD  CONSTRAINT FK_ImportacionTempGarantia_Garantia FOREIGN KEY(gar_id)
REFERENCES Garantia (gar_id)
;
-- FK_ImportacionTempGarantia_Garantia
;
/****** Object:  ForeignKey FK_ImportacionTempGarantia_ImportacionTemp    Script Date: 07/30/2012 17:14:18 ******/
ALTER TABLE ImportacionTempGarantia  ADD  CONSTRAINT FK_ImportacionTempGarantia_ImportacionTemp FOREIGN KEY(impt_id)
REFERENCES ImportacionTemp (impt_id)
;
-- FK_ImportacionTempGarantia_ImportacionTemp
;
/****** Object:  ForeignKey FK_ImportacionTempGarantiaTMP_ImportacionTempTMP    Script Date: 07/30/2012 17:14:19 ******/
ALTER TABLE ImportacionTempGarantiaTMP  ADD  CONSTRAINT FK_ImportacionTempGarantiaTMP_ImportacionTempTMP FOREIGN KEY(imptTMP_id)
REFERENCES ImportacionTempTMP (imptTMP_id)
;
-- FK_ImportacionTempGarantiaTMP_ImportacionTempTMP
;
/****** Object:  ForeignKey FK_ImportacionTempItem_CentroCosto    Script Date: 07/30/2012 17:14:24 ******/
ALTER TABLE ImportacionTempItem  ADD  CONSTRAINT FK_ImportacionTempItem_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_ImportacionTempItem_CentroCosto
;
/****** Object:  ForeignKey FK_ImportacionTempItem_ImportacionTemp    Script Date: 07/30/2012 17:14:24 ******/
ALTER TABLE ImportacionTempItem  ADD  CONSTRAINT FK_ImportacionTempItem_ImportacionTemp FOREIGN KEY(impt_id)
REFERENCES ImportacionTemp (impt_id)
;
-- FK_ImportacionTempItem_ImportacionTemp
;
/****** Object:  ForeignKey FK_ImportacionTempItem_Producto    Script Date: 07/30/2012 17:14:24 ******/
ALTER TABLE ImportacionTempItem  ADD  CONSTRAINT FK_ImportacionTempItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ImportacionTempItem_Producto
;
/****** Object:  ForeignKey FK_ImportacionTempItem_StockLote    Script Date: 07/30/2012 17:14:24 ******/
ALTER TABLE ImportacionTempItem  ADD  CONSTRAINT FK_ImportacionTempItem_StockLote FOREIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_ImportacionTempItem_StockLote
;
/****** Object:  ForeignKey FK_ImportacionTempItemBorradoTMP_ImportacionTempTMP    Script Date: 07/30/2012 17:14:25 ******/
ALTER TABLE ImportacionTempItemBorradoTMP  ADD  CONSTRAINT FK_ImportacionTempItemBorradoTMP_ImportacionTempTMP FOREIGN KEY(imptTMP_id)
REFERENCES ImportacionTempTMP (imptTMP_id)
;
-- FK_ImportacionTempItemBorradoTMP_ImportacionTempTMP
;
/****** Object:  ForeignKey FK_ImportacionTempItemSerieTMP_ImportacionTempItemTMP    Script Date: 07/30/2012 17:14:27 ******/
ALTER TABLE ImportacionTempItemSerieTMP  ADD  CONSTRAINT FK_ImportacionTempItemSerieTMP_ImportacionTempItemTMP FOREIGN KEY(imptiTMP_id)
REFERENCES ImportacionTempItemTMP (imptiTMP_id)
;
-- FK_ImportacionTempItemSerieTMP_ImportacionTempItemTMP
;
/****** Object:  ForeignKey FK_ImportacionTempItemSerieTMP_ImportacionTempTMP    Script Date: 07/30/2012 17:14:28 ******/
ALTER TABLE ImportacionTempItemSerieTMP  ADD  CONSTRAINT FK_ImportacionTempItemSerieTMP_ImportacionTempTMP FOREIGN KEY(imptTMP_id)
REFERENCES ImportacionTempTMP (imptTMP_id)
;
-- FK_ImportacionTempItemSerieTMP_ImportacionTempTMP
;
/****** Object:  ForeignKey FK_ImportacionTempItemTMP_ImportacionTempTMP    Script Date: 07/30/2012 17:14:32 ******/
ALTER TABLE ImportacionTempItemTMP  ADD  CONSTRAINT FK_ImportacionTempItemTMP_ImportacionTempTMP FOREIGN KEY(imptTMP_id)
REFERENCES ImportacionTempTMP (imptTMP_id)
;
-- FK_ImportacionTempItemTMP_ImportacionTempTMP
;
/****** Object:  ForeignKey FK_Informe_Prestacion    Script Date: 07/30/2012 17:14:46 ******/
ALTER TABLE Informe  ADD  CONSTRAINT FK_Informe_Prestacion FOREIGN KEY(pre_id)
REFERENCES Prestacion (pre_id)
;
-- FK_Informe_Prestacion
;
/****** Object:  ForeignKey FK_Informe_Usuario    Script Date: 07/30/2012 17:14:46 ******/
ALTER TABLE Informe  ADD  CONSTRAINT FK_Informe_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Informe_Usuario
;
/****** Object:  ForeignKey FK_InformeHiperlinks_Informe    Script Date: 07/30/2012 17:14:49 ******/
ALTER TABLE InformeHiperlinks  ADD  CONSTRAINT FK_InformeHiperlinks_Informe FOREIGN KEY(inf_id)
REFERENCES Informe (inf_id)
;
-- FK_InformeHiperlinks_Informe
;
/****** Object:  ForeignKey FK_InformeParametro_Informe    Script Date: 07/30/2012 17:14:53 ******/
ALTER TABLE InformeParametro  ADD  CONSTRAINT FK_InformeParametro_Informe FOREIGN KEY(inf_id)
REFERENCES Informe (inf_id)
;
-- FK_InformeParametro_Informe
;
/****** Object:  ForeignKey FK_InformeParametro_Usuario    Script Date: 07/30/2012 17:14:53 ******/
ALTER TABLE InformeParametro  ADD  CONSTRAINT FK_InformeParametro_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_InformeParametro_Usuario
;
/****** Object:  ForeignKey FK_InformeSumaries_Informe    Script Date: 07/30/2012 17:14:55 ******/
ALTER TABLE InformeSumaries  ADD  CONSTRAINT FK_InformeSumaries_Informe FOREIGN KEY(inf_id)
REFERENCES Informe (inf_id)
;
-- FK_InformeSumaries_Informe
;
/****** Object:  ForeignKey FK_IngresosBrutosCategoria_Usuario    Script Date: 07/30/2012 17:14:57 ******/
ALTER TABLE IngresosBrutosCategoria  ADD  CONSTRAINT FK_IngresosBrutosCategoria_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_IngresosBrutosCategoria_Usuario
;
/****** Object:  ForeignKey FK_Legajo_Barco    Script Date: 07/30/2012 17:15:04 ******/
ALTER TABLE Legajo  ADD  CONSTRAINT FK_Legajo_Barco FOREIGN KEY(barc_id)
REFERENCES Barco (barc_id)
;
-- FK_Legajo_Barco
;
/****** Object:  ForeignKey FK_Legajo_Cliente    Script Date: 07/30/2012 17:15:04 ******/
ALTER TABLE Legajo  ADD  CONSTRAINT FK_Legajo_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_Legajo_Cliente
;
/****** Object:  ForeignKey FK_Legajo_Estado    Script Date: 07/30/2012 17:15:04 ******/
ALTER TABLE Legajo  ADD  CONSTRAINT FK_Legajo_Estado FOREIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_Legajo_Estado
;
/****** Object:  ForeignKey FK_Legajo_LegajoTipo    Script Date: 07/30/2012 17:15:04 ******/
ALTER TABLE Legajo  ADD  CONSTRAINT FK_Legajo_LegajoTipo FOREIGN KEY(lgjt_id)
REFERENCES LegajoTipo (lgjt_id)
;
-- FK_Legajo_LegajoTipo
;
/****** Object:  ForeignKey FK_Legajo_Moneda    Script Date: 07/30/2012 17:15:04 ******/
ALTER TABLE Legajo  ADD  CONSTRAINT FK_Legajo_Moneda FOREIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_Legajo_Moneda
;
/****** Object:  ForeignKey FK_Legajo_Puerto    Script Date: 07/30/2012 17:15:04 ******/
ALTER TABLE Legajo  ADD  CONSTRAINT FK_Legajo_Puerto FOREIGN KEY(pue_id)
REFERENCES Puerto (pue_id)
;
-- FK_Legajo_Puerto
;
/****** Object:  ForeignKey FK_Legajo_Transporte    Script Date: 07/30/2012 17:15:04 ******/
ALTER TABLE Legajo  ADD  CONSTRAINT FK_Legajo_Transporte FOREIGN KEY(trans_id)
REFERENCES Transporte (trans_id)
;
-- FK_Legajo_Transporte
;
/****** Object:  ForeignKey FK_Legajo_Vuelo    Script Date: 07/30/2012 17:15:04 ******/
ALTER TABLE Legajo  ADD  CONSTRAINT FK_Legajo_Vuelo FOREIGN KEY(vue_id)
REFERENCES Vuelo (vue_id)
;
-- FK_Legajo_Vuelo
;
/****** Object:  ForeignKey FK_LegajoTipo_Usuario    Script Date: 07/30/2012 17:15:06 ******/
ALTER TABLE LegajoTipo  ADD  CONSTRAINT FK_LegajoTipo_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_LegajoTipo_Usuario
;
/****** Object:  ForeignKey FK_Lenguaje_Lenguaje    Script Date: 07/30/2012 17:15:08 ******/
ALTER TABLE Lenguaje  ADD  CONSTRAINT FK_Lenguaje_Lenguaje FOREIGN KEY(leng_id_padre)
REFERENCES Lenguaje (leng_id)
;
-- FK_Lenguaje_Lenguaje
;
/****** Object:  ForeignKey FK_Lenguaje_Usuario    Script Date: 07/30/2012 17:15:08 ******/
ALTER TABLE Lenguaje  ADD  CONSTRAINT FK_Lenguaje_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Lenguaje_Usuario
;
/****** Object:  ForeignKey FK_LenguajeItem_Lenguaje    Script Date: 07/30/2012 17:15:10 ******/
ALTER TABLE LenguajeItem  ADD  CONSTRAINT FK_LenguajeItem_Lenguaje FOREIGN KEY(leng_id)
REFERENCES Lenguaje (leng_id)
;
-- FK_LenguajeItem_Lenguaje
;
/****** Object:  ForeignKey FK_Leyenda_Idioma    Script Date: 07/30/2012 17:15:13 ******/
ALTER TABLE Leyenda  ADD  CONSTRAINT FK_Leyenda_Idioma FOREIGN KEY(idm_id)
REFERENCES Idioma (idm_id)
;
-- FK_Leyenda_Idioma
;
/****** Object:  ForeignKey FK_Leyenda_Usuario    Script Date: 07/30/2012 17:15:13 ******/
ALTER TABLE Leyenda  ADD  CONSTRAINT FK_Leyenda_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Leyenda_Usuario
;
/****** Object:  ForeignKey FK_Liquidacion_Asiento    Script Date: 07/30/2012 17:15:19 ******/
ALTER TABLE Liquidacion  ADD  CONSTRAINT FK_Liquidacion_Asiento FOREIGN KEY(as_id)
REFERENCES Asiento (as_id)
;
-- FK_Liquidacion_Asiento
;
/****** Object:  ForeignKey FK_Liquidacion_CentroCosto    Script Date: 07/30/2012 17:15:19 ******/
ALTER TABLE Liquidacion  ADD  CONSTRAINT FK_Liquidacion_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_Liquidacion_CentroCosto
;
/****** Object:  ForeignKey FK_Liquidacion_Documento    Script Date: 07/30/2012 17:15:19 ******/
ALTER TABLE Liquidacion  ADD  CONSTRAINT FK_Liquidacion_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_Liquidacion_Documento
;
/****** Object:  ForeignKey FK_Liquidacion_DocumentoTipo    Script Date: 07/30/2012 17:15:19 ******/
ALTER TABLE Liquidacion  ADD  CONSTRAINT FK_Liquidacion_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_Liquidacion_DocumentoTipo
;
/****** Object:  ForeignKey FK_Liquidacion_Estado    Script Date: 07/30/2012 17:15:19 ******/
ALTER TABLE Liquidacion  ADD  CONSTRAINT FK_Liquidacion_Estado FOREIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_Liquidacion_Estado
;
/****** Object:  ForeignKey FK_Liquidacion_Legajo    Script Date: 07/30/2012 17:15:20 ******/
ALTER TABLE Liquidacion  ADD  CONSTRAINT FK_Liquidacion_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_Liquidacion_Legajo
;
/****** Object:  ForeignKey FK_Liquidacion_LiquidacionPlantilla    Script Date: 07/30/2012 17:15:20 ******/
ALTER TABLE Liquidacion  ADD  CONSTRAINT FK_Liquidacion_LiquidacionPlantilla FOREIGN KEY(liqp_id)
REFERENCES LiquidacionPlantilla (liqp_id)
;
-- FK_Liquidacion_LiquidacionPlantilla
;
/****** Object:  ForeignKey FK_Liquidacion_Moneda    Script Date: 07/30/2012 17:15:20 ******/
ALTER TABLE Liquidacion  ADD  CONSTRAINT FK_Liquidacion_Moneda FOREIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_Liquidacion_Moneda
;
/****** Object:  ForeignKey FK_Liquidacion_Sucursal    Script Date: 07/30/2012 17:15:20 ******/
ALTER TABLE Liquidacion  ADD  CONSTRAINT FK_Liquidacion_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_Liquidacion_Sucursal
;
/****** Object:  ForeignKey FK_Liquidacion_Usuario    Script Date: 07/30/2012 17:15:20 ******/
ALTER TABLE Liquidacion  ADD  CONSTRAINT FK_Liquidacion_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Liquidacion_Usuario
;
/****** Object:  ForeignKey FK_LiquidacionConceptoAdm_CentroCosto    Script Date: 07/30/2012 17:15:24 ******/
ALTER TABLE LiquidacionConceptoAdm  ADD  CONSTRAINT FK_LiquidacionConceptoAdm_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_LiquidacionConceptoAdm_CentroCosto
;
/****** Object:  ForeignKey FK_LiquidacionConceptoAdm_Liquidacion    Script Date: 07/30/2012 17:15:24 ******/
ALTER TABLE LiquidacionConceptoAdm  ADD  CONSTRAINT FK_LiquidacionConceptoAdm_Liquidacion FOREIGN KEY(liq_id)
REFERENCES Liquidacion (liq_id)
;
-- FK_LiquidacionConceptoAdm_Liquidacion
;
/****** Object:  ForeignKey FK_LiquidacionConceptoAdm_LiquidacionFormulaItem    Script Date: 07/30/2012 17:15:24 ******/
ALTER TABLE LiquidacionConceptoAdm  ADD  CONSTRAINT FK_LiquidacionConceptoAdm_LiquidacionFormulaItem FOREIGN KEY(liqfi_id)
REFERENCES LiquidacionFormulaItem (liqfi_id)
;
-- FK_LiquidacionConceptoAdm_LiquidacionFormulaItem
;
/****** Object:  ForeignKey FK_LiquidacionFormula_Usuario    Script Date: 07/30/2012 17:15:33 ******/
ALTER TABLE LiquidacionFormula  ADD  CONSTRAINT FK_LiquidacionFormula_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_LiquidacionFormula_Usuario
;
/****** Object:  ForeignKey FK_LiquidacionFormulaItem_LiquidacionCodigoTipo    Script Date: 07/30/2012 17:15:35 ******/
ALTER TABLE LiquidacionFormulaItem  ADD  CONSTRAINT FK_LiquidacionFormulaItem_LiquidacionCodigoTipo FOREIGN KEY(liqct_id)
REFERENCES LiquidacionCodigoTipo (liqct_id)
;
-- FK_LiquidacionFormulaItem_LiquidacionCodigoTipo
;
/****** Object:  ForeignKey FK_LiquidacionFormulaItem_LiquidacionFormula    Script Date: 07/30/2012 17:15:35 ******/
ALTER TABLE LiquidacionFormulaItem  ADD  CONSTRAINT FK_LiquidacionFormulaItem_LiquidacionFormula FOREIGN KEY(liqf_id)
REFERENCES LiquidacionFormula (liqf_id)
;
-- FK_LiquidacionFormulaItem_LiquidacionFormula
;
/****** Object:  ForeignKey FK_LiquidacionItemCodigo_Liquidacion    Script Date: 07/30/2012 17:15:40 ******/
ALTER TABLE LiquidacionItemCodigo  ADD  CONSTRAINT FK_LiquidacionItemCodigo_Liquidacion FOREIGN KEY(liq_id)
REFERENCES Liquidacion (liq_id)
;
-- FK_LiquidacionItemCodigo_Liquidacion
;
/****** Object:  ForeignKey FK_LiquidacionItemCodigo_LiquidacionFormulaItem    Script Date: 07/30/2012 17:15:40 ******/
ALTER TABLE LiquidacionItemCodigo  ADD  CONSTRAINT FK_LiquidacionItemCodigo_LiquidacionFormulaItem FOREIGN KEY(liqfi_id)
REFERENCES LiquidacionFormulaItem (liqfi_id)
;
-- FK_LiquidacionItemCodigo_LiquidacionFormulaItem
;
/****** Object:  ForeignKey FK_LiquidacionItemCodigo_LiquidacionItem    Script Date: 07/30/2012 17:15:40 ******/
ALTER TABLE LiquidacionItemCodigo  ADD  CONSTRAINT FK_LiquidacionItemCodigo_LiquidacionItem FOREIGN KEY(liqi_id)
REFERENCES LiquidacionItem (liqi_id)
;
-- FK_LiquidacionItemCodigo_LiquidacionItem
;
/****** Object:  ForeignKey FK_PlantillaLiquidacion_Usuario    Script Date: 07/30/2012 17:15:46 ******/
ALTER TABLE LiquidacionPlantilla  ADD  CONSTRAINT FK_PlantillaLiquidacion_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_PlantillaLiquidacion_Usuario
;
/****** Object:  ForeignKey FK_LiquidacionPlantillaItem_LiquidacionPlantilla    Script Date: 07/30/2012 17:15:47 ******/
ALTER TABLE LiquidacionPlantillaItem  ADD  CONSTRAINT FK_LiquidacionPlantillaItem_LiquidacionPlantilla FOREIGN KEY(liqp_id)
REFERENCES LiquidacionPlantilla (liqp_id)
;
-- FK_LiquidacionPlantillaItem_LiquidacionPlantilla
;
/****** Object:  ForeignKey FK_ListaDescuento_ListaDescuento    Script Date: 07/30/2012 17:15:56 ******/
ALTER TABLE ListaDescuento  ADD  CONSTRAINT FK_ListaDescuento_ListaDescuento FOREIGN KEY(ld_id_padre)
REFERENCES ListaDescuento (ld_id)
;
-- FK_ListaDescuento_ListaDescuento
;
/****** Object:  ForeignKey FK_ListaDescuento_Moneda    Script Date: 07/30/2012 17:15:56 ******/
ALTER TABLE ListaDescuento  ADD  CONSTRAINT FK_ListaDescuento_Moneda FOREIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_ListaDescuento_Moneda
;
/****** Object:  ForeignKey FK_ListaDescuento_Usuario    Script Date: 07/30/2012 17:15:56 ******/
ALTER TABLE ListaDescuento  ADD  CONSTRAINT FK_ListaDescuento_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ListaDescuento_Usuario
;
/****** Object:  ForeignKey FK_ListaDescuentoCliente_Cliente    Script Date: 07/30/2012 17:15:58 ******/
ALTER TABLE ListaDescuentoCliente  ADD  CONSTRAINT FK_ListaDescuentoCliente_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_ListaDescuentoCliente_Cliente
;
/****** Object:  ForeignKey FK_ListaDescuentoCliente_ListaDescuento    Script Date: 07/30/2012 17:15:58 ******/
ALTER TABLE ListaDescuentoCliente  ADD  CONSTRAINT FK_ListaDescuentoCliente_ListaDescuento FOREIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_ListaDescuentoCliente_ListaDescuento
;
/****** Object:  ForeignKey FK_ListaDescuentoItem_ListaDescuento    Script Date: 07/30/2012 17:16:00 ******/
ALTER TABLE ListaDescuentoItem  ADD  CONSTRAINT FK_ListaDescuentoItem_ListaDescuento FOREIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_ListaDescuentoItem_ListaDescuento
;
/****** Object:  ForeignKey FK_ListaDescuentoItem_Producto    Script Date: 07/30/2012 17:16:00 ******/
ALTER TABLE ListaDescuentoItem  ADD  CONSTRAINT FK_ListaDescuentoItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ListaDescuentoItem_Producto
;
/****** Object:  ForeignKey FK_ListaDescuentoItem_Usuario    Script Date: 07/30/2012 17:16:00 ******/
ALTER TABLE ListaDescuentoItem  ADD  CONSTRAINT FK_ListaDescuentoItem_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ListaDescuentoItem_Usuario
;
/****** Object:  ForeignKey FK_ListaDescuentoProveedor_ListaDescuento    Script Date: 07/30/2012 17:16:02 ******/
ALTER TABLE ListaDescuentoProveedor  ADD  CONSTRAINT FK_ListaDescuentoProveedor_ListaDescuento FOREIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_ListaDescuentoProveedor_ListaDescuento
;
/****** Object:  ForeignKey FK_ListaDescuentoProveedor_Proveedor    Script Date: 07/30/2012 17:16:02 ******/
ALTER TABLE ListaDescuentoProveedor  ADD  CONSTRAINT FK_ListaDescuentoProveedor_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_ListaDescuentoProveedor_Proveedor
;
/****** Object:  ForeignKey FK_ListaPrecio_ListaPrecio    Script Date: 07/30/2012 17:16:08 ******/
ALTER TABLE ListaPrecio  ADD  CONSTRAINT FK_ListaPrecio_ListaPrecio FOREIGN KEY(lp_id_padre)
REFERENCES ListaPrecio (lp_id)
;
-- FK_ListaPrecio_ListaPrecio
;
/****** Object:  ForeignKey FK_ListaPrecio_Moneda    Script Date: 07/30/2012 17:16:08 ******/
ALTER TABLE ListaPrecio  ADD  CONSTRAINT FK_ListaPrecio_Moneda FOREIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_ListaPrecio_Moneda
;
/****** Object:  ForeignKey FK_ListaPrecio_Usuario    Script Date: 07/30/2012 17:16:08 ******/
ALTER TABLE ListaPrecio  ADD  CONSTRAINT FK_ListaPrecio_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ListaPrecio_Usuario
;
/****** Object:  ForeignKey FK__ListaPrec__cli_i__56F49FFA    Script Date: 07/30/2012 17:16:09 ******/
ALTER TABLE ListaPrecioCliente  ADD  CONSTRAINT FK__ListaPrec__cli_i__56F49FFA FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK__ListaPrec__cli_i__56F49FFA
;
/****** Object:  ForeignKey FK__ListaPrec__lp_id__57E8C433    Script Date: 07/30/2012 17:16:09 ******/
ALTER TABLE ListaPrecioCliente  ADD  CONSTRAINT FK__ListaPrec__lp_id__57E8C433 FOREIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK__ListaPrec__lp_id__57E8C433
;
/****** Object:  ForeignKey FK_ListaPrecioConfig_ListaPrecio    Script Date: 07/30/2012 17:16:10 ******/
ALTER TABLE ListaPrecioConfig  ADD  CONSTRAINT FK_ListaPrecioConfig_ListaPrecio FOREIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_ListaPrecioConfig_ListaPrecio
;
/****** Object:  ForeignKey FK_ListaPrecioConfig_Producto    Script Date: 07/30/2012 17:16:10 ******/
ALTER TABLE ListaPrecioConfig  ADD  CONSTRAINT FK_ListaPrecioConfig_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ListaPrecioConfig_Producto
;
/****** Object:  ForeignKey FK_ListaPrecioItem_ListaPrecio    Script Date: 07/30/2012 17:16:16 ******/
ALTER TABLE ListaPrecioItem  ADD  CONSTRAINT FK_ListaPrecioItem_ListaPrecio FOREIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_ListaPrecioItem_ListaPrecio
;
/****** Object:  ForeignKey FK_ListaPrecioItem_ListaPrecioMarcado    Script Date: 07/30/2012 17:16:16 ******/
ALTER TABLE ListaPrecioItem  ADD  CONSTRAINT FK_ListaPrecioItem_ListaPrecioMarcado FOREIGN KEY(lpm_id)
REFERENCES ListaPrecioMarcado (lpm_id)
;
-- FK_ListaPrecioItem_ListaPrecioMarcado
;
/****** Object:  ForeignKey FK_ListaPrecioItem_Producto    Script Date: 07/30/2012 17:16:16 ******/
ALTER TABLE ListaPrecioItem  ADD  CONSTRAINT FK_ListaPrecioItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ListaPrecioItem_Producto
;
/****** Object:  ForeignKey FK_ListaPrecioItem_Usuario    Script Date: 07/30/2012 17:16:16 ******/
ALTER TABLE ListaPrecioItem  ADD  CONSTRAINT FK_ListaPrecioItem_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ListaPrecioItem_Usuario
;
/****** Object:  ForeignKey FK_ListaPrecioLista_ListaPrecio    Script Date: 07/30/2012 17:16:18 ******/
ALTER TABLE ListaPrecioLista  ADD  CONSTRAINT FK_ListaPrecioLista_ListaPrecio FOREIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_ListaPrecioLista_ListaPrecio
;
/****** Object:  ForeignKey FK_ListaPrecioLista_ListaPrecioMarcado    Script Date: 07/30/2012 17:16:18 ******/
ALTER TABLE ListaPrecioLista  ADD  CONSTRAINT FK_ListaPrecioLista_ListaPrecioMarcado FOREIGN KEY(lpm_id)
REFERENCES ListaPrecioMarcado (lpm_id)
;
-- FK_ListaPrecioLista_ListaPrecioMarcado
;
/****** Object:  ForeignKey FK_ListaPrecioLista_ListaPrecioPadre    Script Date: 07/30/2012 17:16:18 ******/
ALTER TABLE ListaPrecioLista  ADD  CONSTRAINT FK_ListaPrecioLista_ListaPrecioPadre FOREIGN KEY(lp_id_padre)
REFERENCES ListaPrecio (lp_id)
;
-- FK_ListaPrecioLista_ListaPrecioPadre
;
/****** Object:  ForeignKey FK_ListaPrecioLista_Usuario    Script Date: 07/30/2012 17:16:18 ******/
ALTER TABLE ListaPrecioLista  ADD  CONSTRAINT FK_ListaPrecioLista_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ListaPrecioLista_Usuario
;
/****** Object:  ForeignKey FK__ListaPrec__lp_id__54D74D5E    Script Date: 07/30/2012 17:16:24 ******/
ALTER TABLE ListaPrecioProveedor  ADD  CONSTRAINT FK__ListaPrec__lp_id__54D74D5E FOREIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK__ListaPrec__lp_id__54D74D5E
;
/****** Object:  ForeignKey FK_ListaPrec_Proveedor    Script Date: 07/30/2012 17:16:24 ******/
ALTER TABLE ListaPrecioProveedor  ADD  CONSTRAINT FK_ListaPrec_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_ListaPrec_Proveedor
;
/****** Object:  ForeignKey FK_MailItem_Mail    Script Date: 07/30/2012 17:16:28 ******/
ALTER TABLE MailItem  ADD  CONSTRAINT FK_MailItem_Mail FOREIGN KEY(mail_id)
REFERENCES Mail (mail_id)
;
-- FK_MailItem_Mail
;
/****** Object:  ForeignKey FK_ManifiestoCarga_Barco    Script Date: 07/30/2012 17:16:34 ******/
ALTER TABLE ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_Barco FOREIGN KEY(barc_id)
REFERENCES Barco (barc_id)
;
-- FK_ManifiestoCarga_Barco
;
/****** Object:  ForeignKey FK_ManifiestoCarga_CentroCosto    Script Date: 07/30/2012 17:16:34 ******/
ALTER TABLE ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_ManifiestoCarga_CentroCosto
;
/****** Object:  ForeignKey FK_ManifiestoCarga_Chofer    Script Date: 07/30/2012 17:16:35 ******/
ALTER TABLE ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_Chofer FOREIGN KEY(chof_id)
REFERENCES Chofer (chof_id)
;
-- FK_ManifiestoCarga_Chofer
;
/****** Object:  ForeignKey FK_ManifiestoCarga_Cliente    Script Date: 07/30/2012 17:16:35 ******/
ALTER TABLE ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_ManifiestoCarga_Cliente
;
/****** Object:  ForeignKey FK_ManifiestoCarga_ContraMarca    Script Date: 07/30/2012 17:16:35 ******/
ALTER TABLE ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_ContraMarca FOREIGN KEY(cmarc_id)
REFERENCES ContraMarca (cmarc_id)
;
-- FK_ManifiestoCarga_ContraMarca
;
/****** Object:  ForeignKey FK_ManifiestoCarga_DepositoLogicoDestino    Script Date: 07/30/2012 17:16:35 ******/
ALTER TABLE ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_DepositoLogicoDestino FOREIGN KEY(depl_id_destino)
REFERENCES DepositoLogico (depl_id)
;
-- FK_ManifiestoCarga_DepositoLogicoDestino
;
/****** Object:  ForeignKey FK_ManifiestoCarga_DepositoLogicoOrigen    Script Date: 07/30/2012 17:16:35 ******/
ALTER TABLE ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_DepositoLogicoOrigen FOREIGN KEY(depl_id_origen)
REFERENCES DepositoLogico (depl_id)
;
-- FK_ManifiestoCarga_DepositoLogicoOrigen
;
/****** Object:  ForeignKey FK_ManifiestoCarga_Documento    Script Date: 07/30/2012 17:16:35 ******/
ALTER TABLE ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_ManifiestoCarga_Documento
;
/****** Object:  ForeignKey FK_ManifiestoCarga_DocumentoTipo    Script Date: 07/30/2012 17:16:35 ******/
ALTER TABLE ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_ManifiestoCarga_DocumentoTipo
;
/****** Object:  ForeignKey FK_ManifiestoCarga_Estado    Script Date: 07/30/2012 17:16:35 ******/
ALTER TABLE ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_Estado FOREIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_ManifiestoCarga_Estado
;
/****** Object:  ForeignKey FK_ManifiestoCarga_PuertoDestino    Script Date: 07/30/2012 17:16:35 ******/
ALTER TABLE ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_PuertoDestino FOREIGN KEY(pue_id_destino)
REFERENCES Puerto (pue_id)
;
-- FK_ManifiestoCarga_PuertoDestino
;
/****** Object:  ForeignKey FK_ManifiestoCarga_PuertoOrigen    Script Date: 07/30/2012 17:16:35 ******/
ALTER TABLE ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_PuertoOrigen FOREIGN KEY(pue_id_origen)
REFERENCES Puerto (pue_id)
;
-- FK_ManifiestoCarga_PuertoOrigen
;
/****** Object:  ForeignKey FK_ManifiestoCarga_Sucursal    Script Date: 07/30/2012 17:16:36 ******/
ALTER TABLE ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_ManifiestoCarga_Sucursal
;
/****** Object:  ForeignKey FK_ManifiestoCarga_Transporte    Script Date: 07/30/2012 17:16:36 ******/
ALTER TABLE ManifiestoCarga  ADD  CONSTRAINT FK_ManifiestoCarga_Transporte FOREIGN KEY(trans_id)
REFERENCES Transporte (trans_id)
;
-- FK_ManifiestoCarga_Transporte
;
/****** Object:  ForeignKey FK_ManifiestoCargaItem_CentroCosto    Script Date: 07/30/2012 17:16:40 ******/
ALTER TABLE ManifiestoCargaItem  ADD  CONSTRAINT FK_ManifiestoCargaItem_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_ManifiestoCargaItem_CentroCosto
;
/****** Object:  ForeignKey FK_ManifiestoCargaItem_ManifiestoCarga    Script Date: 07/30/2012 17:16:40 ******/
ALTER TABLE ManifiestoCargaItem  ADD  CONSTRAINT FK_ManifiestoCargaItem_ManifiestoCarga FOREIGN KEY(mfc_id)
REFERENCES ManifiestoCarga (mfc_id)
;
-- FK_ManifiestoCargaItem_ManifiestoCarga
;
/****** Object:  ForeignKey FK_ManifiestoCargaItem_Producto    Script Date: 07/30/2012 17:16:40 ******/
ALTER TABLE ManifiestoCargaItem  ADD  CONSTRAINT FK_ManifiestoCargaItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ManifiestoCargaItem_Producto
;
/****** Object:  ForeignKey FK_ManifiestoCargaItemBorradoTMP_ManifiestoCargaTMP    Script Date: 07/30/2012 17:16:41 ******/
ALTER TABLE ManifiestoCargaItemBorradoTMP  ADD  CONSTRAINT FK_ManifiestoCargaItemBorradoTMP_ManifiestoCargaTMP FOREIGN KEY(mfcTMP_id)
REFERENCES ManifiestoCargaTMP (mfcTMP_id)
;
-- FK_ManifiestoCargaItemBorradoTMP_ManifiestoCargaTMP
;
/****** Object:  ForeignKey FK_ManifiestoCargaItemTMP_ManifiestoCargaTMP    Script Date: 07/30/2012 17:16:46 ******/
ALTER TABLE ManifiestoCargaItemTMP  ADD  CONSTRAINT FK_ManifiestoCargaItemTMP_ManifiestoCargaTMP FOREIGN KEY(mfcTMP_id)
REFERENCES ManifiestoCargaTMP (mfcTMP_id)
;
-- FK_ManifiestoCargaItemTMP_ManifiestoCargaTMP
;
/****** Object:  ForeignKey FK_ManifiestoPackingList_ManifiestoCargaItem    Script Date: 07/30/2012 17:16:53 ******/
ALTER TABLE ManifiestoPackingList  ADD  CONSTRAINT FK_ManifiestoPackingList_ManifiestoCargaItem FOREIGN KEY(pklsti_id)
REFERENCES ManifiestoCargaItem (mfci_id)
;
-- FK_ManifiestoPackingList_ManifiestoCargaItem
;
/****** Object:  ForeignKey FK_ManifiestoPackingList_PackingListItem    Script Date: 07/30/2012 17:16:53 ******/
ALTER TABLE ManifiestoPackingList  ADD  CONSTRAINT FK_ManifiestoPackingList_PackingListItem FOREIGN KEY(pklsti_id)
REFERENCES PackingListItem (pklsti_id)
;
-- FK_ManifiestoPackingList_PackingListItem
;
/****** Object:  ForeignKey FK_maquina_Usuario    Script Date: 07/30/2012 17:16:57 ******/
ALTER TABLE Maquina  ADD  CONSTRAINT FK_maquina_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_maquina_Usuario
;
/****** Object:  ForeignKey FK_Marca_Usuario    Script Date: 07/30/2012 17:16:59 ******/
ALTER TABLE Marca  ADD  CONSTRAINT FK_Marca_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Marca_Usuario
;
/****** Object:  ForeignKey FK_Materia_Usuario    Script Date: 07/30/2012 17:17:01 ******/
ALTER TABLE Materia  ADD  CONSTRAINT FK_Materia_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Materia_Usuario
;
/****** Object:  ForeignKey FK_Moneda_Usuario    Script Date: 07/30/2012 17:17:04 ******/
ALTER TABLE Moneda  ADD  CONSTRAINT FK_Moneda_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Moneda_Usuario
;
/****** Object:  ForeignKey FK_MonedaItem_Moneda    Script Date: 07/30/2012 17:17:06 ******/
ALTER TABLE MonedaItem  ADD  CONSTRAINT FK_MonedaItem_Moneda FOREIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_MonedaItem_Moneda
;
/****** Object:  ForeignKey FK_MonedaItem_Usuario    Script Date: 07/30/2012 17:17:06 ******/
ALTER TABLE MonedaItem  ADD  CONSTRAINT FK_MonedaItem_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_MonedaItem_Usuario
;
/****** Object:  ForeignKey FK_MovimientoCaja_Asiento    Script Date: 07/30/2012 17:17:09 ******/
ALTER TABLE MovimientoCaja  ADD  CONSTRAINT FK_MovimientoCaja_Asiento FOREIGN KEY(as_id)
REFERENCES Asiento (as_id)
;
-- FK_MovimientoCaja_Asiento
;
/****** Object:  ForeignKey FK_MovimientoCaja_Caja    Script Date: 07/30/2012 17:17:09 ******/
ALTER TABLE MovimientoCaja  ADD  CONSTRAINT FK_MovimientoCaja_Caja FOREIGN KEY(cj_id)
REFERENCES Caja (cj_id)
;
-- FK_MovimientoCaja_Caja
;
/****** Object:  ForeignKey FK_MovimientoCaja_Usuario    Script Date: 07/30/2012 17:17:09 ******/
ALTER TABLE MovimientoCaja  ADD  CONSTRAINT FK_MovimientoCaja_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_MovimientoCaja_Usuario
;
/****** Object:  ForeignKey FK_MovimientoCaja_UsuarioCajero    Script Date: 07/30/2012 17:17:09 ******/
ALTER TABLE MovimientoCaja  ADD  CONSTRAINT FK_MovimientoCaja_UsuarioCajero FOREIGN KEY(us_id_cajero)
REFERENCES Usuario (us_id)
;
-- FK_MovimientoCaja_UsuarioCajero
;
/****** Object:  ForeignKey FK_MovimientoCajaItem_CentroCosto    Script Date: 07/30/2012 17:17:12 ******/
ALTER TABLE MovimientoCajaItem  ADD  CONSTRAINT FK_MovimientoCajaItem_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_MovimientoCajaItem_CentroCosto
;
/****** Object:  ForeignKey FK_MovimientoCajaItem_Cheque    Script Date: 07/30/2012 17:17:12 ******/
ALTER TABLE MovimientoCajaItem  ADD  CONSTRAINT FK_MovimientoCajaItem_Cheque FOREIGN KEY(cheq_id)
REFERENCES Cheque (cheq_id)
;
-- FK_MovimientoCajaItem_Cheque
;
/****** Object:  ForeignKey FK_MovimientoCajaItem_Cuenta    Script Date: 07/30/2012 17:17:12 ******/
ALTER TABLE MovimientoCajaItem  ADD  CONSTRAINT FK_MovimientoCajaItem_Cuenta FOREIGN KEY(cue_id_trabajo)
REFERENCES Cuenta (cue_id)
;
-- FK_MovimientoCajaItem_Cuenta
;
/****** Object:  ForeignKey FK_MovimientoCajaItem_Moneda    Script Date: 07/30/2012 17:17:12 ******/
ALTER TABLE MovimientoCajaItem  ADD  CONSTRAINT FK_MovimientoCajaItem_Moneda FOREIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_MovimientoCajaItem_Moneda
;
/****** Object:  ForeignKey FK_MovimientoCajaItem_MovimientoCaja    Script Date: 07/30/2012 17:17:12 ******/
ALTER TABLE MovimientoCajaItem  ADD  CONSTRAINT FK_MovimientoCajaItem_MovimientoCaja FOREIGN KEY(mcj_id)
REFERENCES MovimientoCaja (mcj_id)
;
-- FK_MovimientoCajaItem_MovimientoCaja
;
/****** Object:  ForeignKey FK_MovimientoCajaMovimiento_Asiento    Script Date: 07/30/2012 17:17:14 ******/
ALTER TABLE MovimientoCajaMovimiento  ADD  CONSTRAINT FK_MovimientoCajaMovimiento_Asiento FOREIGN KEY(as_id)
REFERENCES Asiento (as_id)
;
-- FK_MovimientoCajaMovimiento_Asiento
;
/****** Object:  ForeignKey FK_MovimientoCajaMovimiento_MovimientoCaja    Script Date: 07/30/2012 17:17:14 ******/
ALTER TABLE MovimientoCajaMovimiento  ADD  CONSTRAINT FK_MovimientoCajaMovimiento_MovimientoCaja FOREIGN KEY(mcj_id)
REFERENCES MovimientoCaja (mcj_id)
;
-- FK_MovimientoCajaMovimiento_MovimientoCaja
;
/****** Object:  ForeignKey FK_MovimientoFondo_Asiento    Script Date: 07/30/2012 17:17:20 ******/
ALTER TABLE MovimientoFondo  ADD  CONSTRAINT FK_MovimientoFondo_Asiento FOREIGN KEY(as_id)
REFERENCES Asiento (as_id)
;
-- FK_MovimientoFondo_Asiento
;
/****** Object:  ForeignKey FK_MovimientoFondo_CentroCosto    Script Date: 07/30/2012 17:17:20 ******/
ALTER TABLE MovimientoFondo  ADD  CONSTRAINT FK_MovimientoFondo_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_MovimientoFondo_CentroCosto
;
/****** Object:  ForeignKey FK_MovimientoFondo_Cliente    Script Date: 07/30/2012 17:17:20 ******/
ALTER TABLE MovimientoFondo  ADD  CONSTRAINT FK_MovimientoFondo_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_MovimientoFondo_Cliente
;
/****** Object:  ForeignKey FK_MovimientoFondo_Documento    Script Date: 07/30/2012 17:17:20 ******/
ALTER TABLE MovimientoFondo  ADD  CONSTRAINT FK_MovimientoFondo_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_MovimientoFondo_Documento
;
/****** Object:  ForeignKey FK_MovimientoFondo_DocumentoTipo    Script Date: 07/30/2012 17:17:20 ******/
ALTER TABLE MovimientoFondo  ADD  CONSTRAINT FK_MovimientoFondo_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_MovimientoFondo_DocumentoTipo
;
/****** Object:  ForeignKey FK_MovimientoFondo_Legajo    Script Date: 07/30/2012 17:17:20 ******/
ALTER TABLE MovimientoFondo  ADD  CONSTRAINT FK_MovimientoFondo_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_MovimientoFondo_Legajo
;
/****** Object:  ForeignKey FK_MovimientoFondo_Moneda    Script Date: 07/30/2012 17:17:20 ******/
ALTER TABLE MovimientoFondo  ADD  CONSTRAINT FK_MovimientoFondo_Moneda FOREIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_MovimientoFondo_Moneda
;
/****** Object:  ForeignKey FK_MovimientoFondo_UsResponsable    Script Date: 07/30/2012 17:17:20 ******/
ALTER TABLE MovimientoFondo  ADD  CONSTRAINT FK_MovimientoFondo_UsResponsable FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_MovimientoFondo_UsResponsable
;
/****** Object:  ForeignKey FK_MovimientoFondo_Usuario    Script Date: 07/30/2012 17:17:21 ******/
ALTER TABLE MovimientoFondo  ADD  CONSTRAINT FK_MovimientoFondo_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_MovimientoFondo_Usuario
;
/****** Object:  ForeignKey FK_MovimientoFondoItem_CentroCosto    Script Date: 07/30/2012 17:17:24 ******/
ALTER TABLE MovimientoFondoItem  ADD  CONSTRAINT FK_MovimientoFondoItem_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_MovimientoFondoItem_CentroCosto
;
/****** Object:  ForeignKey FK_MovimientoFondoItem_Cheque    Script Date: 07/30/2012 17:17:24 ******/
ALTER TABLE MovimientoFondoItem  ADD  CONSTRAINT FK_MovimientoFondoItem_Cheque FOREIGN KEY(cheq_id)
REFERENCES Cheque (cheq_id)
;
-- FK_MovimientoFondoItem_Cheque
;
/****** Object:  ForeignKey FK_MovimientoFondoItem_Chequera    Script Date: 07/30/2012 17:17:24 ******/
ALTER TABLE MovimientoFondoItem  ADD  CONSTRAINT FK_MovimientoFondoItem_Chequera FOREIGN KEY(chq_id)
REFERENCES Chequera (chq_id)
;
-- FK_MovimientoFondoItem_Chequera
;
/****** Object:  ForeignKey FK_MovimientoFondoItem_Clearing    Script Date: 07/30/2012 17:17:25 ******/
ALTER TABLE MovimientoFondoItem  ADD  CONSTRAINT FK_MovimientoFondoItem_Clearing FOREIGN KEY(cle_id)
REFERENCES Clearing (cle_id)
;
-- FK_MovimientoFondoItem_Clearing
;
/****** Object:  ForeignKey FK_MovimientoFondoItem_Cuenta    Script Date: 07/30/2012 17:17:25 ******/
ALTER TABLE MovimientoFondoItem  ADD  CONSTRAINT FK_MovimientoFondoItem_Cuenta FOREIGN KEY(cue_id_debe)
REFERENCES Cuenta (cue_id)
;
-- FK_MovimientoFondoItem_Cuenta
;
/****** Object:  ForeignKey FK_MovimientoFondoItem_MovimientoFondo    Script Date: 07/30/2012 17:17:25 ******/
ALTER TABLE MovimientoFondoItem  ADD  CONSTRAINT FK_MovimientoFondoItem_MovimientoFondo FOREIGN KEY(mf_id)
REFERENCES MovimientoFondo (mf_id)
;
-- FK_MovimientoFondoItem_MovimientoFondo
;
/****** Object:  ForeignKey FK_MovimientoFondoItemBorradoTMP_MovimientoFondoTMP    Script Date: 07/30/2012 17:17:26 ******/
ALTER TABLE MovimientoFondoItemBorradoTMP  ADD  CONSTRAINT FK_MovimientoFondoItemBorradoTMP_MovimientoFondoTMP FOREIGN KEY(mfTMP_id)
REFERENCES MovimientoFondoTMP (mfTMP_id)
;
-- FK_MovimientoFondoItemBorradoTMP_MovimientoFondoTMP
;
/****** Object:  ForeignKey FK_MovimientoFondoItemTMP_MovimientoFondoTMP    Script Date: 07/30/2012 17:17:30 ******/
ALTER TABLE MovimientoFondoItemTMP  ADD  CONSTRAINT FK_MovimientoFondoItemTMP_MovimientoFondoTMP FOREIGN KEY(mfTMP_id)
REFERENCES MovimientoFondoTMP (mfTMP_id)
;
-- FK_MovimientoFondoItemTMP_MovimientoFondoTMP
;
/****** Object:  ForeignKey FK_Objetivo_Proyecto    Script Date: 07/30/2012 17:17:39 ******/
ALTER TABLE Objetivo  ADD  CONSTRAINT FK_Objetivo_Proyecto FOREIGN KEY(proy_id)
REFERENCES Proyecto (proy_id)
;
-- FK_Objetivo_Proyecto
;
/****** Object:  ForeignKey FK_Objetivo_Usuario    Script Date: 07/30/2012 17:17:39 ******/
ALTER TABLE Objetivo  ADD  CONSTRAINT FK_Objetivo_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Objetivo_Usuario
;
/****** Object:  ForeignKey FK_OrdenCompraItem_OrdenCompra    Script Date: 07/30/2012 17:17:54 ******/
ALTER TABLE OrdenCompraItem  ADD  CONSTRAINT FK_OrdenCompraItem_OrdenCompra FOREIGN KEY(oc_id)
REFERENCES OrdenCompra (oc_id)
;
-- FK_OrdenCompraItem_OrdenCompra
;
/****** Object:  ForeignKey FK_OrdenCompraItem_Producto    Script Date: 07/30/2012 17:17:54 ******/
ALTER TABLE OrdenCompraItem  ADD  CONSTRAINT FK_OrdenCompraItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_OrdenCompraItem_Producto
;
/****** Object:  ForeignKey FK_OrdenCompraItemBorradoTMP_OrdenCompraTMP    Script Date: 07/30/2012 17:17:55 ******/
ALTER TABLE OrdenCompraItemBorradoTMP  ADD  CONSTRAINT FK_OrdenCompraItemBorradoTMP_OrdenCompraTMP FOREIGN KEY(ocTMP_id)
REFERENCES OrdenCompraTMP (ocTMP_id)
;
-- FK_OrdenCompraItemBorradoTMP_OrdenCompraTMP
;
/****** Object:  ForeignKey FK_OrdenCompraItemTMP_OrdenCompraTMP    Script Date: 07/30/2012 17:18:00 ******/
ALTER TABLE OrdenCompraItemTMP  ADD  CONSTRAINT FK_OrdenCompraItemTMP_OrdenCompraTMP FOREIGN KEY(ocTMP_id)
REFERENCES OrdenCompraTMP (ocTMP_id)
;
-- FK_OrdenCompraItemTMP_OrdenCompraTMP
;
/****** Object:  ForeignKey FK_OrdenDevolucionCompra_OrdenCompraItemDevolucion    Script Date: 07/30/2012 17:18:09 ******/
ALTER TABLE OrdenDevolucionCompra  ADD  CONSTRAINT FK_OrdenDevolucionCompra_OrdenCompraItemDevolucion FOREIGN KEY(oci_id_devolucion)
REFERENCES OrdenCompraItem (oci_id)
;
-- FK_OrdenDevolucionCompra_OrdenCompraItemDevolucion
;
/****** Object:  ForeignKey FK_OrdenDevolucionCompra_OrdenCompraItemOrden    Script Date: 07/30/2012 17:18:09 ******/
ALTER TABLE OrdenDevolucionCompra  ADD  CONSTRAINT FK_OrdenDevolucionCompra_OrdenCompraItemOrden FOREIGN KEY(oci_id_Orden)
REFERENCES OrdenCompraItem (oci_id)
;
-- FK_OrdenDevolucionCompra_OrdenCompraItemOrden
;
/****** Object:  ForeignKey FK_OrdenDevolucionCompraTMP_OrdenCompraTMP    Script Date: 07/30/2012 17:18:11 ******/
ALTER TABLE OrdenDevolucionCompraTMP  ADD  CONSTRAINT FK_OrdenDevolucionCompraTMP_OrdenCompraTMP FOREIGN KEY(ocTMP_id)
REFERENCES OrdenCompraTMP (ocTMP_id)
;
-- FK_OrdenDevolucionCompraTMP_OrdenCompraTMP
;
/****** Object:  ForeignKey FK_OrdenPago_Empresa    Script Date: 07/30/2012 17:18:20 ******/
ALTER TABLE OrdenPago  ADD  CONSTRAINT FK_OrdenPago_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_OrdenPago_Empresa
;
/****** Object:  ForeignKey FK_OrdenPago_FacturaCompra    Script Date: 07/30/2012 17:18:20 ******/
ALTER TABLE OrdenPago  ADD  CONSTRAINT FK_OrdenPago_FacturaCompra FOREIGN KEY(fc_id)
REFERENCES FacturaCompra (fc_id)
;
-- FK_OrdenPago_FacturaCompra
;
/****** Object:  ForeignKey FK_OrdenPago_OrdenCompra    Script Date: 07/30/2012 17:18:20 ******/
ALTER TABLE OrdenPago  ADD  CONSTRAINT FK_OrdenPago_OrdenCompra FOREIGN KEY(oc_id)
REFERENCES OrdenCompra (oc_id)
;
-- FK_OrdenPago_OrdenCompra
;
/****** Object:  ForeignKey FK_OrdenPagoItem_CentroCosto    Script Date: 07/30/2012 17:18:24 ******/
ALTER TABLE OrdenPagoItem  ADD  CONSTRAINT FK_OrdenPagoItem_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_OrdenPagoItem_CentroCosto
;
/****** Object:  ForeignKey FK_OrdenPagoItem_Cheque    Script Date: 07/30/2012 17:18:24 ******/
ALTER TABLE OrdenPagoItem  ADD  CONSTRAINT FK_OrdenPagoItem_Cheque FOREIGN KEY(cheq_id)
REFERENCES Cheque (cheq_id)
;
-- FK_OrdenPagoItem_Cheque
;
/****** Object:  ForeignKey FK_OrdenPagoItem_Chequera    Script Date: 07/30/2012 17:18:24 ******/
ALTER TABLE OrdenPagoItem  ADD  CONSTRAINT FK_OrdenPagoItem_Chequera FOREIGN KEY(chq_id)
REFERENCES Chequera (chq_id)
;
-- FK_OrdenPagoItem_Chequera
;
/****** Object:  ForeignKey FK_OrdenPagoItem_Cuenta    Script Date: 07/30/2012 17:18:25 ******/
ALTER TABLE OrdenPagoItem  ADD  CONSTRAINT FK_OrdenPagoItem_Cuenta FOREIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_OrdenPagoItem_Cuenta
;
/****** Object:  ForeignKey FK_OrdenPagoItem_OrdenPago    Script Date: 07/30/2012 17:18:25 ******/
ALTER TABLE OrdenPagoItem  ADD  CONSTRAINT FK_OrdenPagoItem_OrdenPago FOREIGN KEY(opg_id)
REFERENCES OrdenPago (opg_id)
;
-- FK_OrdenPagoItem_OrdenPago
;
/****** Object:  ForeignKey FK_OrdenPagoItem_Retencion    Script Date: 07/30/2012 17:18:25 ******/
ALTER TABLE OrdenPagoItem  ADD  CONSTRAINT FK_OrdenPagoItem_Retencion FOREIGN KEY(ret_id)
REFERENCES Retencion (ret_id)
;
-- FK_OrdenPagoItem_Retencion
;
/****** Object:  ForeignKey FK_OrdenPagoItemBorradoTMP_OrdenPagoTMP    Script Date: 07/30/2012 17:18:26 ******/
ALTER TABLE OrdenPagoItemBorradoTMP  ADD  CONSTRAINT FK_OrdenPagoItemBorradoTMP_OrdenPagoTMP FOREIGN KEY(opgTMP_id)
REFERENCES OrdenPagoTMP (opgTMP_id)
;
-- FK_OrdenPagoItemBorradoTMP_OrdenPagoTMP
;
/****** Object:  ForeignKey FK_OrdenPagoItemTMP_OrdenPagoTMP    Script Date: 07/30/2012 17:18:32 ******/
ALTER TABLE OrdenPagoItemTMP  ADD  CONSTRAINT FK_OrdenPagoItemTMP_OrdenPagoTMP FOREIGN KEY(opgTMP_id)
REFERENCES OrdenPagoTMP (opgTMP_id)
;
-- FK_OrdenPagoItemTMP_OrdenPagoTMP
;
/****** Object:  ForeignKey FK_OrdenProdKit_DepositoLogico    Script Date: 07/30/2012 17:18:40 ******/
ALTER TABLE OrdenProdKit  ADD  CONSTRAINT FK_OrdenProdKit_DepositoLogico FOREIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_OrdenProdKit_DepositoLogico
;
/****** Object:  ForeignKey FK_OrdenProdKit_Documento    Script Date: 07/30/2012 17:18:41 ******/
ALTER TABLE OrdenProdKit  ADD  CONSTRAINT FK_OrdenProdKit_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_OrdenProdKit_Documento
;
/****** Object:  ForeignKey FK_OrdenProdKit_DocumentoTipo    Script Date: 07/30/2012 17:18:41 ******/
ALTER TABLE OrdenProdKit  ADD  CONSTRAINT FK_OrdenProdKit_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_OrdenProdKit_DocumentoTipo
;
/****** Object:  ForeignKey FK_OrdenProdKit_Legajo    Script Date: 07/30/2012 17:18:41 ******/
ALTER TABLE OrdenProdKit  ADD  CONSTRAINT FK_OrdenProdKit_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_OrdenProdKit_Legajo
;
/****** Object:  ForeignKey FK_OrdenProdKit_Sucursal    Script Date: 07/30/2012 17:18:41 ******/
ALTER TABLE OrdenProdKit  ADD  CONSTRAINT FK_OrdenProdKit_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_OrdenProdKit_Sucursal
;
/****** Object:  ForeignKey FK_OrdenProdKitItem_OrdenProdKit    Script Date: 07/30/2012 17:18:43 ******/
ALTER TABLE OrdenProdKitItem  ADD  CONSTRAINT FK_OrdenProdKitItem_OrdenProdKit FOREIGN KEY(opk_id)
REFERENCES OrdenProdKit (opk_id)
;
-- FK_OrdenProdKitItem_OrdenProdKit
;
/****** Object:  ForeignKey FK_OrdenProdKitItem_Producto    Script Date: 07/30/2012 17:18:43 ******/
ALTER TABLE OrdenProdKitItem  ADD  CONSTRAINT FK_OrdenProdKitItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_OrdenProdKitItem_Producto
;
/****** Object:  ForeignKey FK_OrdenProdKitItem_ProductoFormulaKit    Script Date: 07/30/2012 17:18:43 ******/
ALTER TABLE OrdenProdKitItem  ADD  CONSTRAINT FK_OrdenProdKitItem_ProductoFormulaKit FOREIGN KEY(prfk_id)
REFERENCES ProductoFormulaKit (prfk_id)
;
-- FK_OrdenProdKitItem_ProductoFormulaKit
;
/****** Object:  ForeignKey FK_OrdenProdKitItemBorradoTMP_OrdenProdKitTMP    Script Date: 07/30/2012 17:18:44 ******/
ALTER TABLE OrdenProdKitItemBorradoTMP  ADD  CONSTRAINT FK_OrdenProdKitItemBorradoTMP_OrdenProdKitTMP FOREIGN KEY(opkTMP_id)
REFERENCES OrdenProdKitTMP (opkTMP_id)
;
-- FK_OrdenProdKitItemBorradoTMP_OrdenProdKitTMP
;
/****** Object:  ForeignKey FK_OrdenProdKitItemTMP_OrdenProdKitTMP    Script Date: 07/30/2012 17:18:46 ******/
ALTER TABLE OrdenProdKitItemTMP  ADD  CONSTRAINT FK_OrdenProdKitItemTMP_OrdenProdKitTMP FOREIGN KEY(opkTMP_id)
REFERENCES OrdenProdKitTMP (opkTMP_id)
;
-- FK_OrdenProdKitItemTMP_OrdenProdKitTMP
;
/****** Object:  ForeignKey FK_OrdenRemitoCompra_OrdenCompraItem    Script Date: 07/30/2012 17:18:50 ******/
ALTER TABLE OrdenRemitoCompra  ADD  CONSTRAINT FK_OrdenRemitoCompra_OrdenCompraItem FOREIGN KEY(oci_id)
REFERENCES OrdenCompraItem (oci_id)
;
-- FK_OrdenRemitoCompra_OrdenCompraItem
;
/****** Object:  ForeignKey FK_OrdenRemitoCompra_RemitoCompraItem    Script Date: 07/30/2012 17:18:50 ******/
ALTER TABLE OrdenRemitoCompra  ADD  CONSTRAINT FK_OrdenRemitoCompra_RemitoCompraItem FOREIGN KEY(rci_id)
REFERENCES RemitoCompraItem (rci_id)
;
-- FK_OrdenRemitoCompra_RemitoCompraItem
;
/****** Object:  ForeignKey FK_OrdenRemitoVenta_OrdenServicioItem    Script Date: 07/30/2012 17:18:53 ******/
ALTER TABLE OrdenRemitoVenta  ADD  CONSTRAINT FK_OrdenRemitoVenta_OrdenServicioItem FOREIGN KEY(osi_id)
REFERENCES OrdenServicioItem (osi_id)
;
-- FK_OrdenRemitoVenta_OrdenServicioItem
;
/****** Object:  ForeignKey FK_OrdenRemitoVenta_RemitoVentaItem    Script Date: 07/30/2012 17:18:53 ******/
ALTER TABLE OrdenRemitoVenta  ADD  CONSTRAINT FK_OrdenRemitoVenta_RemitoVentaItem FOREIGN KEY(rvi_id)
REFERENCES RemitoVentaItem (rvi_id)
;
-- FK_OrdenRemitoVenta_RemitoVentaItem
;
/****** Object:  ForeignKey FK_OrdenServicio_CentroCosto    Script Date: 07/30/2012 17:19:04 ******/
ALTER TABLE OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_OrdenServicio_CentroCosto
;
/****** Object:  ForeignKey FK_OrdenServicio_Cliente    Script Date: 07/30/2012 17:19:04 ******/
ALTER TABLE OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_OrdenServicio_Cliente
;
/****** Object:  ForeignKey FK_OrdenServicio_ClienteSucursal    Script Date: 07/30/2012 17:19:04 ******/
ALTER TABLE OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_ClienteSucursal FOREIGN KEY(clis_id)
REFERENCES ClienteSucursal (clis_id)
;
-- FK_OrdenServicio_ClienteSucursal
;
/****** Object:  ForeignKey FK_OrdenServicio_CondicionPago    Script Date: 07/30/2012 17:19:04 ******/
ALTER TABLE OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_CondicionPago FOREIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_OrdenServicio_CondicionPago
;
/****** Object:  ForeignKey FK_OrdenServicio_Contacto    Script Date: 07/30/2012 17:19:05 ******/
ALTER TABLE OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_Contacto FOREIGN KEY(cont_id)
REFERENCES Contacto (cont_id)
;
-- FK_OrdenServicio_Contacto
;
/****** Object:  ForeignKey FK_OrdenServicio_Documento    Script Date: 07/30/2012 17:19:05 ******/
ALTER TABLE OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_OrdenServicio_Documento
;
/****** Object:  ForeignKey FK_OrdenServicio_DocumentoTipo    Script Date: 07/30/2012 17:19:05 ******/
ALTER TABLE OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_OrdenServicio_DocumentoTipo
;
/****** Object:  ForeignKey FK_OrdenServicio_Empresa    Script Date: 07/30/2012 17:19:05 ******/
ALTER TABLE OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_OrdenServicio_Empresa
;
/****** Object:  ForeignKey FK_OrdenServicio_Estado    Script Date: 07/30/2012 17:19:05 ******/
ALTER TABLE OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_Estado FOREIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_OrdenServicio_Estado
;
/****** Object:  ForeignKey FK_OrdenServicio_ImportacionID    Script Date: 07/30/2012 17:19:05 ******/
ALTER TABLE OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_ImportacionID FOREIGN KEY(impid_id)
REFERENCES ImportacionID (impid_id)
;
-- FK_OrdenServicio_ImportacionID
;
/****** Object:  ForeignKey FK_OrdenServicio_IncidenteApertura    Script Date: 07/30/2012 17:19:05 ******/
ALTER TABLE OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_IncidenteApertura FOREIGN KEY(inca_id)
REFERENCES IncidenteApertura (inca_id)
;
-- FK_OrdenServicio_IncidenteApertura
;
/****** Object:  ForeignKey FK_OrdenServicio_IncidenteTipo    Script Date: 07/30/2012 17:19:05 ******/
ALTER TABLE OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_IncidenteTipo FOREIGN KEY(inct_id)
REFERENCES IncidenteTipo (inct_id)
;
-- FK_OrdenServicio_IncidenteTipo
;
/****** Object:  ForeignKey FK_OrdenServicio_ListaDescuento    Script Date: 07/30/2012 17:19:05 ******/
ALTER TABLE OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_ListaDescuento FOREIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_OrdenServicio_ListaDescuento
;
/****** Object:  ForeignKey FK_OrdenServicio_ListaPrecio    Script Date: 07/30/2012 17:19:05 ******/
ALTER TABLE OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_ListaPrecio FOREIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_OrdenServicio_ListaPrecio
;
/****** Object:  ForeignKey FK_OrdenServicio_Prioridad    Script Date: 07/30/2012 17:19:06 ******/
ALTER TABLE OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_Prioridad FOREIGN KEY(prio_id)
REFERENCES Prioridad (prio_id)
;
-- FK_OrdenServicio_Prioridad
;
/****** Object:  ForeignKey FK_OrdenServicio_Proyecto    Script Date: 07/30/2012 17:19:06 ******/
ALTER TABLE OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_Proyecto FOREIGN KEY(proy_id)
REFERENCES Proyecto (proy_id)
;
-- FK_OrdenServicio_Proyecto
;
/****** Object:  ForeignKey FK_OrdenServicio_Stock    Script Date: 07/30/2012 17:19:06 ******/
ALTER TABLE OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_Stock FOREIGN KEY(st_id)
REFERENCES Stock (st_id)
;
-- FK_OrdenServicio_Stock
;
/****** Object:  ForeignKey FK_OrdenServicio_Sucursal    Script Date: 07/30/2012 17:19:06 ******/
ALTER TABLE OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_OrdenServicio_Sucursal
;
/****** Object:  ForeignKey FK_OrdenServicio_Tarea    Script Date: 07/30/2012 17:19:06 ******/
ALTER TABLE OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_Tarea FOREIGN KEY(tar_id)
REFERENCES Tarea (tar_id)
;
-- FK_OrdenServicio_Tarea
;
/****** Object:  ForeignKey FK_OrdenServicio_Zona    Script Date: 07/30/2012 17:19:06 ******/
ALTER TABLE OrdenServicio  ADD  CONSTRAINT FK_OrdenServicio_Zona FOREIGN KEY(zon_id)
REFERENCES Zona (zon_id)
;
-- FK_OrdenServicio_Zona
;
/****** Object:  ForeignKey FK_OrdenServicioAlarmaTMP_OrdenServicioTMP    Script Date: 07/30/2012 17:19:07 ******/
ALTER TABLE OrdenServicioAlarmaTMP  ADD  CONSTRAINT FK_OrdenServicioAlarmaTMP_OrdenServicioTMP FOREIGN KEY(osTMP_id)
REFERENCES OrdenServicioTMP (osTMP_id)
;
-- FK_OrdenServicioAlarmaTMP_OrdenServicioTMP
;
/****** Object:  ForeignKey FK_OrdenServicioItem_CentroCosto    Script Date: 07/30/2012 17:19:12 ******/
ALTER TABLE OrdenServicioItem  ADD  CONSTRAINT FK_OrdenServicioItem_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_OrdenServicioItem_CentroCosto
;
/****** Object:  ForeignKey FK_OrdenServicioItem_Contacto    Script Date: 07/30/2012 17:19:12 ******/
ALTER TABLE OrdenServicioItem  ADD  CONSTRAINT FK_OrdenServicioItem_Contacto FOREIGN KEY(cont_id)
REFERENCES Contacto (cont_id)
;
-- FK_OrdenServicioItem_Contacto
;
/****** Object:  ForeignKey FK_OrdenServicioItem_EquipoTipoFalla    Script Date: 07/30/2012 17:19:12 ******/
ALTER TABLE OrdenServicioItem  ADD  CONSTRAINT FK_OrdenServicioItem_EquipoTipoFalla FOREIGN KEY(etf_id)
REFERENCES EquipoTipoFalla (etf_id)
;
-- FK_OrdenServicioItem_EquipoTipoFalla
;
/****** Object:  ForeignKey FK_OrdenServicioItem_OrdenServicio    Script Date: 07/30/2012 17:19:13 ******/
ALTER TABLE OrdenServicioItem  ADD  CONSTRAINT FK_OrdenServicioItem_OrdenServicio FOREIGN KEY(os_id)
REFERENCES OrdenServicio (os_id)
;
-- FK_OrdenServicioItem_OrdenServicio
;
/****** Object:  ForeignKey FK_OrdenServicioItem_Producto    Script Date: 07/30/2012 17:19:13 ******/
ALTER TABLE OrdenServicioItem  ADD  CONSTRAINT FK_OrdenServicioItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_OrdenServicioItem_Producto
;
/****** Object:  ForeignKey FK_OrdenServicioItem_StockLote    Script Date: 07/30/2012 17:19:13 ******/
ALTER TABLE OrdenServicioItem  ADD  CONSTRAINT FK_OrdenServicioItem_StockLote FOREIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_OrdenServicioItem_StockLote
;
/****** Object:  ForeignKey FK_OrdenServicioItem_Tarea    Script Date: 07/30/2012 17:19:13 ******/
ALTER TABLE OrdenServicioItem  ADD  CONSTRAINT FK_OrdenServicioItem_Tarea FOREIGN KEY(tar_id)
REFERENCES Tarea (tar_id)
;
-- FK_OrdenServicioItem_Tarea
;
/****** Object:  ForeignKey FK_OrdenServicioItemBorradoTMP_OrdenServicioTMP    Script Date: 07/30/2012 17:19:14 ******/
ALTER TABLE OrdenServicioItemBorradoTMP  ADD  CONSTRAINT FK_OrdenServicioItemBorradoTMP_OrdenServicioTMP FOREIGN KEY(osTMP_id)
REFERENCES OrdenServicioTMP (osTMP_id)
;
-- FK_OrdenServicioItemBorradoTMP_OrdenServicioTMP
;
/****** Object:  ForeignKey FK_OrdenServicioItemSerieBTMP_OrdenServicioTMP    Script Date: 07/30/2012 17:19:15 ******/
ALTER TABLE OrdenServicioItemSerieBTMP  ADD  CONSTRAINT FK_OrdenServicioItemSerieBTMP_OrdenServicioTMP FOREIGN KEY(osTMP_id)
REFERENCES OrdenServicioTMP (osTMP_id)
;
-- FK_OrdenServicioItemSerieBTMP_OrdenServicioTMP
;
/****** Object:  ForeignKey FK_OrdenServicioItemSerieTMP_OrdenServicioItemTMP    Script Date: 07/30/2012 17:19:18 ******/
ALTER TABLE OrdenServicioItemSerieTMP  ADD  CONSTRAINT FK_OrdenServicioItemSerieTMP_OrdenServicioItemTMP FOREIGN KEY(osiTMP_id)
REFERENCES OrdenServicioItemTMP (osiTMP_id)
;
-- FK_OrdenServicioItemSerieTMP_OrdenServicioItemTMP
;
/****** Object:  ForeignKey FK_OrdenServicioItemSerieTMP_OrdenServicioTMP    Script Date: 07/30/2012 17:19:18 ******/
ALTER TABLE OrdenServicioItemSerieTMP  ADD  CONSTRAINT FK_OrdenServicioItemSerieTMP_OrdenServicioTMP FOREIGN KEY(osTMP_id)
REFERENCES OrdenServicioTMP (osTMP_id)
;
-- FK_OrdenServicioItemSerieTMP_OrdenServicioTMP
;
/****** Object:  ForeignKey FK_OrdenServicioItemTMP_OrdenServicioTMP    Script Date: 07/30/2012 17:19:24 ******/
ALTER TABLE OrdenServicioItemTMP  ADD  CONSTRAINT FK_OrdenServicioItemTMP_OrdenServicioTMP FOREIGN KEY(osTMP_id)
REFERENCES OrdenServicioTMP (osTMP_id)
;
-- FK_OrdenServicioItemTMP_OrdenServicioTMP
;
/****** Object:  ForeignKey FK_OrdenServicioSerie_EquipoDetalleItem    Script Date: 07/30/2012 17:19:25 ******/
ALTER TABLE OrdenServicioSerie  ADD  CONSTRAINT FK_OrdenServicioSerie_EquipoDetalleItem FOREIGN KEY(edi_id)
REFERENCES EquipoDetalleItem (edi_id)
;
-- FK_OrdenServicioSerie_EquipoDetalleItem
;
/****** Object:  ForeignKey FK_OrdenServicioSerie_OrdenServicio    Script Date: 07/30/2012 17:19:25 ******/
ALTER TABLE OrdenServicioSerie  ADD  CONSTRAINT FK_OrdenServicioSerie_OrdenServicio FOREIGN KEY(os_id)
REFERENCES OrdenServicio (os_id)
;
-- FK_OrdenServicioSerie_OrdenServicio
;
/****** Object:  ForeignKey FK_OrdenServicioSerie_ProductoNumeroSerie    Script Date: 07/30/2012 17:19:25 ******/
ALTER TABLE OrdenServicioSerie  ADD  CONSTRAINT FK_OrdenServicioSerie_ProductoNumeroSerie FOREIGN KEY(prns_id)
REFERENCES ProductoNumeroSerie (prns_id)
;
-- FK_OrdenServicioSerie_ProductoNumeroSerie
;
/****** Object:  ForeignKey FK_OrdenServicioSerieTMP_OrdenServicio    Script Date: 07/30/2012 17:19:27 ******/
ALTER TABLE OrdenServicioSerieTMP  ADD  CONSTRAINT FK_OrdenServicioSerieTMP_OrdenServicio FOREIGN KEY(osTMP_id)
REFERENCES OrdenServicioTMP (osTMP_id)
;
-- FK_OrdenServicioSerieTMP_OrdenServicio
;
/****** Object:  ForeignKey FK_PackingList_Barco    Script Date: 07/30/2012 17:19:43 ******/
ALTER TABLE PackingList  ADD  CONSTRAINT FK_PackingList_Barco FOREIGN KEY(barc_id)
REFERENCES Barco (barc_id)
;
-- FK_PackingList_Barco
;
/****** Object:  ForeignKey FK_PackingList_CentroCosto    Script Date: 07/30/2012 17:19:43 ******/
ALTER TABLE PackingList  ADD  CONSTRAINT FK_PackingList_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PackingList_CentroCosto
;
/****** Object:  ForeignKey FK_PackingList_Cliente    Script Date: 07/30/2012 17:19:43 ******/
ALTER TABLE PackingList  ADD  CONSTRAINT FK_PackingList_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_PackingList_Cliente
;
/****** Object:  ForeignKey FK_PackingList_CondicionPago    Script Date: 07/30/2012 17:19:43 ******/
ALTER TABLE PackingList  ADD  CONSTRAINT FK_PackingList_CondicionPago FOREIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_PackingList_CondicionPago
;
/****** Object:  ForeignKey FK_PackingList_Documento    Script Date: 07/30/2012 17:19:43 ******/
ALTER TABLE PackingList  ADD  CONSTRAINT FK_PackingList_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_PackingList_Documento
;
/****** Object:  ForeignKey FK_PackingList_DocumentoTipo    Script Date: 07/30/2012 17:19:43 ******/
ALTER TABLE PackingList  ADD  CONSTRAINT FK_PackingList_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_PackingList_DocumentoTipo
;
/****** Object:  ForeignKey FK_PackingList_Estado    Script Date: 07/30/2012 17:19:43 ******/
ALTER TABLE PackingList  ADD  CONSTRAINT FK_PackingList_Estado FOREIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_PackingList_Estado
;
/****** Object:  ForeignKey FK_PackingList_Legajo    Script Date: 07/30/2012 17:19:44 ******/
ALTER TABLE PackingList  ADD  CONSTRAINT FK_PackingList_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_PackingList_Legajo
;
/****** Object:  ForeignKey FK_PackingList_ListaDescuento    Script Date: 07/30/2012 17:19:44 ******/
ALTER TABLE PackingList  ADD  CONSTRAINT FK_PackingList_ListaDescuento FOREIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_PackingList_ListaDescuento
;
/****** Object:  ForeignKey FK_PackingList_ListaPrecio    Script Date: 07/30/2012 17:19:44 ******/
ALTER TABLE PackingList  ADD  CONSTRAINT FK_PackingList_ListaPrecio FOREIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_PackingList_ListaPrecio
;
/****** Object:  ForeignKey FK_PackingList_PuertoDestino    Script Date: 07/30/2012 17:19:44 ******/
ALTER TABLE PackingList  ADD  CONSTRAINT FK_PackingList_PuertoDestino FOREIGN KEY(pue_id_destino)
REFERENCES Puerto (pue_id)
;
-- FK_PackingList_PuertoDestino
;
/****** Object:  ForeignKey FK_PackingList_PuertoOrigen    Script Date: 07/30/2012 17:19:44 ******/
ALTER TABLE PackingList  ADD  CONSTRAINT FK_PackingList_PuertoOrigen FOREIGN KEY(pue_id_origen)
REFERENCES Puerto (pue_id)
;
-- FK_PackingList_PuertoOrigen
;
/****** Object:  ForeignKey FK_PackingList_Sucursal    Script Date: 07/30/2012 17:19:44 ******/
ALTER TABLE PackingList  ADD  CONSTRAINT FK_PackingList_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_PackingList_Sucursal
;
/****** Object:  ForeignKey FK_PackingListDevolucion_DevolucionItem    Script Date: 07/30/2012 17:19:45 ******/
ALTER TABLE PackingListDevolucion  ADD  CONSTRAINT FK_PackingListDevolucion_DevolucionItem FOREIGN KEY(pklsti_id_devolucion)
REFERENCES PackingListItem (pklsti_id)
;
-- FK_PackingListDevolucion_DevolucionItem
;
/****** Object:  ForeignKey FK_PackingListDevolucion_PackingListItem    Script Date: 07/30/2012 17:19:45 ******/
ALTER TABLE PackingListDevolucion  ADD  CONSTRAINT FK_PackingListDevolucion_PackingListItem FOREIGN KEY(pklsti_id_pklst)
REFERENCES PackingListItem (pklsti_id)
;
-- FK_PackingListDevolucion_PackingListItem
;
/****** Object:  ForeignKey FK_PackingListDevolucionTMP_PackingListTMP    Script Date: 07/30/2012 17:19:47 ******/
ALTER TABLE PackingListDevolucionTMP  ADD  CONSTRAINT FK_PackingListDevolucionTMP_PackingListTMP FOREIGN KEY(pklstTMP_id)
REFERENCES PackingListTMP (pklstTMP_id)
;
-- FK_PackingListDevolucionTMP_PackingListTMP
;
/****** Object:  ForeignKey FK_PackingListFacturaVenta_FacturaVentaItem    Script Date: 07/30/2012 17:19:48 ******/
ALTER TABLE PackingListFacturaVenta  ADD  CONSTRAINT FK_PackingListFacturaVenta_FacturaVentaItem FOREIGN KEY(fvi_id)
REFERENCES FacturaVentaItem (fvi_id)
;
-- FK_PackingListFacturaVenta_FacturaVentaItem
;
/****** Object:  ForeignKey FK_PackingListFacturaVenta_PackingListItem    Script Date: 07/30/2012 17:19:48 ******/
ALTER TABLE PackingListFacturaVenta  ADD  CONSTRAINT FK_PackingListFacturaVenta_PackingListItem FOREIGN KEY(pklsti_id)
REFERENCES PackingListItem (pklsti_id)
;
-- FK_PackingListFacturaVenta_PackingListItem
;
/****** Object:  ForeignKey FK_PackingListFacturaVentaTMP_PackingListItem    Script Date: 07/30/2012 17:19:50 ******/
ALTER TABLE PackingListFacturaVentaTMP  ADD  CONSTRAINT FK_PackingListFacturaVentaTMP_PackingListItem FOREIGN KEY(pklsti_id)
REFERENCES PackingListItem (pklsti_id)
;
-- FK_PackingListFacturaVentaTMP_PackingListItem
;
/****** Object:  ForeignKey FK_PackingListItem_CentroCosto    Script Date: 07/30/2012 17:19:56 ******/
ALTER TABLE PackingListItem  ADD  CONSTRAINT FK_PackingListItem_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PackingListItem_CentroCosto
;
/****** Object:  ForeignKey FK_PackingListItem_PackingList    Script Date: 07/30/2012 17:19:56 ******/
ALTER TABLE PackingListItem  ADD  CONSTRAINT FK_PackingListItem_PackingList FOREIGN KEY(pklst_id)
REFERENCES PackingList (pklst_id)
;
-- FK_PackingListItem_PackingList
;
/****** Object:  ForeignKey FK_PackingListItem_Producto    Script Date: 07/30/2012 17:19:56 ******/
ALTER TABLE PackingListItem  ADD  CONSTRAINT FK_PackingListItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_PackingListItem_Producto
;
/****** Object:  ForeignKey FK_PackingListItemBorradoTMP_PackingListTMP    Script Date: 07/30/2012 17:19:57 ******/
ALTER TABLE PackingListItemBorradoTMP  ADD  CONSTRAINT FK_PackingListItemBorradoTMP_PackingListTMP FOREIGN KEY(pklstTMP_id)
REFERENCES PackingListTMP (pklstTMP_id)
;
-- FK_PackingListItemBorradoTMP_PackingListTMP
;
/****** Object:  ForeignKey FK_PackingListItemTMP_PackingListTMP    Script Date: 07/30/2012 17:20:03 ******/
ALTER TABLE PackingListItemTMP  ADD  CONSTRAINT FK_PackingListItemTMP_PackingListTMP FOREIGN KEY(pklstTMP_id)
REFERENCES PackingListTMP (pklstTMP_id)
;
-- FK_PackingListItemTMP_PackingListTMP
;
/****** Object:  ForeignKey FK_Pais_Usuario    Script Date: 07/30/2012 17:20:13 ******/
ALTER TABLE Pais  ADD  CONSTRAINT FK_Pais_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Pais_Usuario
;
/****** Object:  ForeignKey FK_ParteDiario_Alumno    Script Date: 07/30/2012 17:20:21 ******/
ALTER TABLE ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Alumno FOREIGN KEY(alum_id)
REFERENCES Alumno (alum_id)
;
-- FK_ParteDiario_Alumno
;
/****** Object:  ForeignKey FK_ParteDiario_Cliente    Script Date: 07/30/2012 17:20:21 ******/
ALTER TABLE ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_ParteDiario_Cliente
;
/****** Object:  ForeignKey FK_ParteDiario_Contacto    Script Date: 07/30/2012 17:20:21 ******/
ALTER TABLE ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Contacto FOREIGN KEY(cont_id)
REFERENCES Contacto (cont_id)
;
-- FK_ParteDiario_Contacto
;
/****** Object:  ForeignKey FK_ParteDiario_Departamento    Script Date: 07/30/2012 17:20:21 ******/
ALTER TABLE ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Departamento FOREIGN KEY(dpto_id)
REFERENCES Departamento (dpto_id)
;
-- FK_ParteDiario_Departamento
;
/****** Object:  ForeignKey FK_ParteDiario_Legajo    Script Date: 07/30/2012 17:20:21 ******/
ALTER TABLE ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_ParteDiario_Legajo
;
/****** Object:  ForeignKey FK_ParteDiario_ParteDiario    Script Date: 07/30/2012 17:20:21 ******/
ALTER TABLE ParteDiario  ADD  CONSTRAINT FK_ParteDiario_ParteDiario FOREIGN KEY(ptd_id_padre)
REFERENCES ParteDiario (ptd_id)
;
-- FK_ParteDiario_ParteDiario
;
/****** Object:  ForeignKey FK_ParteDiario_ParteDiarioTipo    Script Date: 07/30/2012 17:20:21 ******/
ALTER TABLE ParteDiario  ADD  CONSTRAINT FK_ParteDiario_ParteDiarioTipo FOREIGN KEY(ptdt_id)
REFERENCES ParteDiarioTipo (ptdt_id)
;
-- FK_ParteDiario_ParteDiarioTipo
;
/****** Object:  ForeignKey FK_ParteDiario_Prioridad    Script Date: 07/30/2012 17:20:21 ******/
ALTER TABLE ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Prioridad FOREIGN KEY(prio_id)
REFERENCES Prioridad (prio_id)
;
-- FK_ParteDiario_Prioridad
;
/****** Object:  ForeignKey FK_ParteDiario_ProductoNumeroSerie    Script Date: 07/30/2012 17:20:21 ******/
ALTER TABLE ParteDiario  ADD  CONSTRAINT FK_ParteDiario_ProductoNumeroSerie FOREIGN KEY(prns_id)
REFERENCES ProductoNumeroSerie (prns_id)
;
-- FK_ParteDiario_ProductoNumeroSerie
;
/****** Object:  ForeignKey FK_ParteDiario_Proveedor    Script Date: 07/30/2012 17:20:21 ******/
ALTER TABLE ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_ParteDiario_Proveedor
;
/****** Object:  ForeignKey FK_ParteDiario_Sucursal    Script Date: 07/30/2012 17:20:21 ******/
ALTER TABLE ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_ParteDiario_Sucursal
;
/****** Object:  ForeignKey FK_ParteDiario_TareaEstado    Script Date: 07/30/2012 17:20:22 ******/
ALTER TABLE ParteDiario  ADD  CONSTRAINT FK_ParteDiario_TareaEstado FOREIGN KEY(tarest_id)
REFERENCES TareaEstado (tarest_id)
;
-- FK_ParteDiario_TareaEstado
;
/****** Object:  ForeignKey FK_ParteDiario_Usuario    Script Date: 07/30/2012 17:20:22 ******/
ALTER TABLE ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ParteDiario_Usuario
;
/****** Object:  ForeignKey FK_ParteDiario_Usuario1    Script Date: 07/30/2012 17:20:22 ******/
ALTER TABLE ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Usuario1 FOREIGN KEY(us_id_responsable)
REFERENCES Usuario (us_id)
;
-- FK_ParteDiario_Usuario1
;
/****** Object:  ForeignKey FK_ParteDiario_Usuario2    Script Date: 07/30/2012 17:20:22 ******/
ALTER TABLE ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Usuario2 FOREIGN KEY(us_id_asignador)
REFERENCES Usuario (us_id)
;
-- FK_ParteDiario_Usuario2
;
/****** Object:  ForeignKey FK_ParteDiario_Vendedor    Script Date: 07/30/2012 17:20:22 ******/
ALTER TABLE ParteDiario  ADD  CONSTRAINT FK_ParteDiario_Vendedor FOREIGN KEY(ven_id)
REFERENCES Vendedor (ven_id)
;
-- FK_ParteDiario_Vendedor
;
/****** Object:  ForeignKey FK_ParteDiarioTipo_Usuario    Script Date: 07/30/2012 17:20:24 ******/
ALTER TABLE ParteDiarioTipo  ADD  CONSTRAINT FK_ParteDiarioTipo_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ParteDiarioTipo_Usuario
;
/****** Object:  ForeignKey FK_ParteProdKit_DepositoLogico    Script Date: 07/30/2012 17:20:28 ******/
ALTER TABLE ParteProdKit  ADD  CONSTRAINT FK_ParteProdKit_DepositoLogico FOREIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_ParteProdKit_DepositoLogico
;
/****** Object:  ForeignKey FK_ParteProdKit_Documento    Script Date: 07/30/2012 17:20:28 ******/
ALTER TABLE ParteProdKit  ADD  CONSTRAINT FK_ParteProdKit_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_ParteProdKit_Documento
;
/****** Object:  ForeignKey FK_ParteProdKit_DocumentoTipo    Script Date: 07/30/2012 17:20:28 ******/
ALTER TABLE ParteProdKit  ADD  CONSTRAINT FK_ParteProdKit_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_ParteProdKit_DocumentoTipo
;
/****** Object:  ForeignKey FK_ParteProdKit_Legajo    Script Date: 07/30/2012 17:20:28 ******/
ALTER TABLE ParteProdKit  ADD  CONSTRAINT FK_ParteProdKit_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_ParteProdKit_Legajo
;
/****** Object:  ForeignKey FK_ParteProdKit_StockIngreso    Script Date: 07/30/2012 17:20:28 ******/
ALTER TABLE ParteProdKit  ADD  CONSTRAINT FK_ParteProdKit_StockIngreso FOREIGN KEY(st_id1)
REFERENCES Stock (st_id)
;
-- FK_ParteProdKit_StockIngreso
;
/****** Object:  ForeignKey FK_ParteProdKit_StockSalida    Script Date: 07/30/2012 17:20:28 ******/
ALTER TABLE ParteProdKit  ADD  CONSTRAINT FK_ParteProdKit_StockSalida FOREIGN KEY(st_id2)
REFERENCES Stock (st_id)
;
-- FK_ParteProdKit_StockSalida
;
/****** Object:  ForeignKey FK_ParteProdKit_Sucursal    Script Date: 07/30/2012 17:20:28 ******/
ALTER TABLE ParteProdKit  ADD  CONSTRAINT FK_ParteProdKit_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_ParteProdKit_Sucursal
;
/****** Object:  ForeignKey FK_ParteProdKitItem_DepositoLogico    Script Date: 07/30/2012 17:20:30 ******/
ALTER TABLE ParteProdKitItem  ADD  CONSTRAINT FK_ParteProdKitItem_DepositoLogico FOREIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_ParteProdKitItem_DepositoLogico
;
/****** Object:  ForeignKey FK_ParteProdKitItem_ParteProdKit    Script Date: 07/30/2012 17:20:31 ******/
ALTER TABLE ParteProdKitItem  ADD  CONSTRAINT FK_ParteProdKitItem_ParteProdKit FOREIGN KEY(ppk_id)
REFERENCES ParteProdKit (ppk_id)
;
-- FK_ParteProdKitItem_ParteProdKit
;
/****** Object:  ForeignKey FK_ParteProdKitItem_Producto    Script Date: 07/30/2012 17:20:31 ******/
ALTER TABLE ParteProdKitItem  ADD  CONSTRAINT FK_ParteProdKitItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ParteProdKitItem_Producto
;
/****** Object:  ForeignKey FK_ParteProdKitItem_ProductoFormulaKit    Script Date: 07/30/2012 17:20:31 ******/
ALTER TABLE ParteProdKitItem  ADD  CONSTRAINT FK_ParteProdKitItem_ProductoFormulaKit FOREIGN KEY(prfk_id)
REFERENCES ProductoFormulaKit (prfk_id)
;
-- FK_ParteProdKitItem_ProductoFormulaKit
;
/****** Object:  ForeignKey FK_ParteProdKitItem_StockLote    Script Date: 07/30/2012 17:20:31 ******/
ALTER TABLE ParteProdKitItem  ADD  CONSTRAINT FK_ParteProdKitItem_StockLote FOREIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_ParteProdKitItem_StockLote
;
/****** Object:  ForeignKey FK_ParteProdKitItemA_ParteProdKitItem    Script Date: 07/30/2012 17:20:32 ******/
ALTER TABLE ParteProdKitItemA  ADD  CONSTRAINT FK_ParteProdKitItemA_ParteProdKitItem FOREIGN KEY(ppki_id)
REFERENCES ParteProdKitItem (ppki_id)
;
-- FK_ParteProdKitItemA_ParteProdKitItem
;
/****** Object:  ForeignKey FK_ParteProdKitItemA_Producto    Script Date: 07/30/2012 17:20:32 ******/
ALTER TABLE ParteProdKitItemA  ADD  CONSTRAINT FK_ParteProdKitItemA_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ParteProdKitItemA_Producto
;
/****** Object:  ForeignKey FK_ParteProdKitItemATMP_ParteProdKitItemTMP    Script Date: 07/30/2012 17:20:34 ******/
ALTER TABLE ParteProdKitItemATMP  ADD  CONSTRAINT FK_ParteProdKitItemATMP_ParteProdKitItemTMP FOREIGN KEY(ppkiTMP_id)
REFERENCES ParteProdKitItemTMP (ppkiTMP_id)
;
-- FK_ParteProdKitItemATMP_ParteProdKitItemTMP
;
/****** Object:  ForeignKey FK_ParteProdKitItemATMP_ParteProdKitTMP    Script Date: 07/30/2012 17:20:34 ******/
ALTER TABLE ParteProdKitItemATMP  ADD  CONSTRAINT FK_ParteProdKitItemATMP_ParteProdKitTMP FOREIGN KEY(ppkTMP_id)
REFERENCES ParteProdKitTMP (ppkTMP_id)
;
-- FK_ParteProdKitItemATMP_ParteProdKitTMP
;
/****** Object:  ForeignKey FK_ParteProdKitItemBorradoTMP_ParteProdKitTMP    Script Date: 07/30/2012 17:20:35 ******/
ALTER TABLE ParteProdKitItemBorradoTMP  ADD  CONSTRAINT FK_ParteProdKitItemBorradoTMP_ParteProdKitTMP FOREIGN KEY(ppkTMP_id)
REFERENCES ParteProdKitTMP (ppkTMP_id)
;
-- FK_ParteProdKitItemBorradoTMP_ParteProdKitTMP
;
/****** Object:  ForeignKey FK_ParteProdKitSerieTMP_ParteProdKitItemTMP    Script Date: 07/30/2012 17:20:38 ******/
ALTER TABLE ParteProdKitItemSerieTMP  ADD  CONSTRAINT FK_ParteProdKitSerieTMP_ParteProdKitItemTMP FOREIGN KEY(ppkiTMP_id)
REFERENCES ParteProdKitItemTMP (ppkiTMP_id)
;
-- FK_ParteProdKitSerieTMP_ParteProdKitItemTMP
;
/****** Object:  ForeignKey FK_ParteProdKitSerieTMP_ParteProdKitTMP    Script Date: 07/30/2012 17:20:38 ******/
ALTER TABLE ParteProdKitItemSerieTMP  ADD  CONSTRAINT FK_ParteProdKitSerieTMP_ParteProdKitTMP FOREIGN KEY(ppkTMP_id)
REFERENCES ParteProdKitTMP (ppkTMP_id)
;
-- FK_ParteProdKitSerieTMP_ParteProdKitTMP
;
/****** Object:  ForeignKey FK_ParteProdKitItemTMP_ParteProdKitTMP    Script Date: 07/30/2012 17:20:40 ******/
ALTER TABLE ParteProdKitItemTMP  ADD  CONSTRAINT FK_ParteProdKitItemTMP_ParteProdKitTMP FOREIGN KEY(ppkTMP_id)
REFERENCES ParteProdKitTMP (ppkTMP_id)
;
-- FK_ParteProdKitItemTMP_ParteProdKitTMP
;
/****** Object:  ForeignKey FK_ParteReparacion_CentroCosto    Script Date: 07/30/2012 17:20:51 ******/
ALTER TABLE ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_ParteReparacion_CentroCosto
;
/****** Object:  ForeignKey FK_ParteReparacion_Cliente    Script Date: 07/30/2012 17:20:51 ******/
ALTER TABLE ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_ParteReparacion_Cliente
;
/****** Object:  ForeignKey FK_ParteReparacion_ClienteSucursal    Script Date: 07/30/2012 17:20:51 ******/
ALTER TABLE ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_ClienteSucursal FOREIGN KEY(clis_id)
REFERENCES ClienteSucursal (clis_id)
;
-- FK_ParteReparacion_ClienteSucursal
;
/****** Object:  ForeignKey FK_ParteReparacion_CondicionPago    Script Date: 07/30/2012 17:20:51 ******/
ALTER TABLE ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_CondicionPago FOREIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_ParteReparacion_CondicionPago
;
/****** Object:  ForeignKey FK_ParteReparacion_Documento    Script Date: 07/30/2012 17:20:52 ******/
ALTER TABLE ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_ParteReparacion_Documento
;
/****** Object:  ForeignKey FK_ParteReparacion_DocumentoTipo    Script Date: 07/30/2012 17:20:52 ******/
ALTER TABLE ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_ParteReparacion_DocumentoTipo
;
/****** Object:  ForeignKey FK_ParteReparacion_Empresa    Script Date: 07/30/2012 17:20:52 ******/
ALTER TABLE ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_ParteReparacion_Empresa
;
/****** Object:  ForeignKey FK_ParteReparacion_Estado    Script Date: 07/30/2012 17:20:52 ******/
ALTER TABLE ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_Estado FOREIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_ParteReparacion_Estado
;
/****** Object:  ForeignKey FK_ParteReparacion_Legajo    Script Date: 07/30/2012 17:20:52 ******/
ALTER TABLE ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_ParteReparacion_Legajo
;
/****** Object:  ForeignKey FK_ParteReparacion_ListaDescuento    Script Date: 07/30/2012 17:20:52 ******/
ALTER TABLE ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_ListaDescuento FOREIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_ParteReparacion_ListaDescuento
;
/****** Object:  ForeignKey FK_ParteReparacion_ListaPrecio    Script Date: 07/30/2012 17:20:52 ******/
ALTER TABLE ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_ListaPrecio FOREIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_ParteReparacion_ListaPrecio
;
/****** Object:  ForeignKey FK_ParteReparacion_OrdenServicio    Script Date: 07/30/2012 17:20:52 ******/
ALTER TABLE ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_OrdenServicio FOREIGN KEY(os_id)
REFERENCES OrdenServicio (os_id)
;
-- FK_ParteReparacion_OrdenServicio
;
/****** Object:  ForeignKey FK_ParteReparacion_ProductoNumeroSerie    Script Date: 07/30/2012 17:20:52 ******/
ALTER TABLE ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_ProductoNumeroSerie FOREIGN KEY(prns_id)
REFERENCES ProductoNumeroSerie (prns_id)
;
-- FK_ParteReparacion_ProductoNumeroSerie
;
/****** Object:  ForeignKey FK_ParteReparacion_Stock    Script Date: 07/30/2012 17:20:53 ******/
ALTER TABLE ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_Stock FOREIGN KEY(st_id)
REFERENCES Stock (st_id)
;
-- FK_ParteReparacion_Stock
;
/****** Object:  ForeignKey FK_ParteReparacion_Sucursal    Script Date: 07/30/2012 17:20:53 ******/
ALTER TABLE ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_ParteReparacion_Sucursal
;
/****** Object:  ForeignKey FK_ParteReparacion_Usuario    Script Date: 07/30/2012 17:20:53 ******/
ALTER TABLE ParteReparacion  ADD  CONSTRAINT FK_ParteReparacion_Usuario FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_ParteReparacion_Usuario
;
/****** Object:  ForeignKey FK_ParteReparacionItem_CentroCosto    Script Date: 07/30/2012 17:20:57 ******/
ALTER TABLE ParteReparacionItem  ADD  CONSTRAINT FK_ParteReparacionItem_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_ParteReparacionItem_CentroCosto
;
/****** Object:  ForeignKey FK_ParteReparacionItem_ParteReparacion    Script Date: 07/30/2012 17:20:57 ******/
ALTER TABLE ParteReparacionItem  ADD  CONSTRAINT FK_ParteReparacionItem_ParteReparacion FOREIGN KEY(prp_id)
REFERENCES ParteReparacion (prp_id)
;
-- FK_ParteReparacionItem_ParteReparacion
;
/****** Object:  ForeignKey FK_ParteReparacionItem_Producto    Script Date: 07/30/2012 17:20:57 ******/
ALTER TABLE ParteReparacionItem  ADD  CONSTRAINT FK_ParteReparacionItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ParteReparacionItem_Producto
;
/****** Object:  ForeignKey FK_ParteReparacionItem_StockLote    Script Date: 07/30/2012 17:20:57 ******/
ALTER TABLE ParteReparacionItem  ADD  CONSTRAINT FK_ParteReparacionItem_StockLote FOREIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_ParteReparacionItem_StockLote
;
/****** Object:  ForeignKey FK_ParteReparacionItemBorradoTMP_ParteReparacionTMP    Script Date: 07/30/2012 17:20:58 ******/
ALTER TABLE ParteReparacionItemBorradoTMP  ADD  CONSTRAINT FK_ParteReparacionItemBorradoTMP_ParteReparacionTMP FOREIGN KEY(prpTMP_id)
REFERENCES ParteReparacionTMP (prpTMP_id)
;
-- FK_ParteReparacionItemBorradoTMP_ParteReparacionTMP
;
/****** Object:  ForeignKey FK_ParteReparacionItemSerieTMP_ParteReparacionItemTMP    Script Date: 07/30/2012 17:21:01 ******/
ALTER TABLE ParteReparacionItemSerieTMP  ADD  CONSTRAINT FK_ParteReparacionItemSerieTMP_ParteReparacionItemTMP FOREIGN KEY(prpiTMP_id)
REFERENCES ParteReparacionItemTMP (prpiTMP_id)
;
-- FK_ParteReparacionItemSerieTMP_ParteReparacionItemTMP
;
/****** Object:  ForeignKey FK_ParteReparacionItemSerieTMP_ParteReparacionTMP    Script Date: 07/30/2012 17:21:01 ******/
ALTER TABLE ParteReparacionItemSerieTMP  ADD  CONSTRAINT FK_ParteReparacionItemSerieTMP_ParteReparacionTMP FOREIGN KEY(prpTMP_id)
REFERENCES ParteReparacionTMP (prpTMP_id)
;
-- FK_ParteReparacionItemSerieTMP_ParteReparacionTMP
;
/****** Object:  ForeignKey FK_ParteReparacionItemTMP_ParteReparacionTMP    Script Date: 07/30/2012 17:21:05 ******/
ALTER TABLE ParteReparacionItemTMP  ADD  CONSTRAINT FK_ParteReparacionItemTMP_ParteReparacionTMP FOREIGN KEY(prpTMP_id)
REFERENCES ParteReparacionTMP (prpTMP_id)
;
-- FK_ParteReparacionItemTMP_ParteReparacionTMP
;
/****** Object:  ForeignKey FK_PedidoCompra_CentroCosto    Script Date: 07/30/2012 17:21:19 ******/
ALTER TABLE PedidoCompra  ADD  CONSTRAINT FK_PedidoCompra_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PedidoCompra_CentroCosto
;
/****** Object:  ForeignKey FK_PedidoCompra_Documento    Script Date: 07/30/2012 17:21:19 ******/
ALTER TABLE PedidoCompra  ADD  CONSTRAINT FK_PedidoCompra_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_PedidoCompra_Documento
;
/****** Object:  ForeignKey FK_PedidoCompra_DocumentoTipo    Script Date: 07/30/2012 17:21:19 ******/
ALTER TABLE PedidoCompra  ADD  CONSTRAINT FK_PedidoCompra_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_PedidoCompra_DocumentoTipo
;
/****** Object:  ForeignKey FK_PedidoCompra_Estado    Script Date: 07/30/2012 17:21:19 ******/
ALTER TABLE PedidoCompra  ADD  CONSTRAINT FK_PedidoCompra_Estado FOREIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_PedidoCompra_Estado
;
/****** Object:  ForeignKey FK_PedidoCompra_Legajo    Script Date: 07/30/2012 17:21:19 ******/
ALTER TABLE PedidoCompra  ADD  CONSTRAINT FK_PedidoCompra_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_PedidoCompra_Legajo
;
/****** Object:  ForeignKey FK_PedidoCompra_ListaPrecio    Script Date: 07/30/2012 17:21:19 ******/
ALTER TABLE PedidoCompra  ADD  CONSTRAINT FK_PedidoCompra_ListaPrecio FOREIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_PedidoCompra_ListaPrecio
;
/****** Object:  ForeignKey FK_PedidoCompra_Sucursal    Script Date: 07/30/2012 17:21:20 ******/
ALTER TABLE PedidoCompra  ADD  CONSTRAINT FK_PedidoCompra_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_PedidoCompra_Sucursal
;
/****** Object:  ForeignKey FK_PedidoCompra_Usuario    Script Date: 07/30/2012 17:21:20 ******/
ALTER TABLE PedidoCompra  ADD  CONSTRAINT FK_PedidoCompra_Usuario FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_PedidoCompra_Usuario
;
/****** Object:  ForeignKey FK_PedidoCompraItem_PedidoCompra    Script Date: 07/30/2012 17:21:24 ******/
ALTER TABLE PedidoCompraItem  ADD  CONSTRAINT FK_PedidoCompraItem_PedidoCompra FOREIGN KEY(pc_id)
REFERENCES PedidoCompra (pc_id)
;
-- FK_PedidoCompraItem_PedidoCompra
;
/****** Object:  ForeignKey FK_PedidoCompraItem_Producto    Script Date: 07/30/2012 17:21:24 ******/
ALTER TABLE PedidoCompraItem  ADD  CONSTRAINT FK_PedidoCompraItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_PedidoCompraItem_Producto
;
/****** Object:  ForeignKey FK_PedidoCompraItem_Usuario    Script Date: 07/30/2012 17:21:24 ******/
ALTER TABLE PedidoCompraItem  ADD  CONSTRAINT FK_PedidoCompraItem_Usuario FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_PedidoCompraItem_Usuario
;
/****** Object:  ForeignKey FK_PedidoCompraItemBorradoTMP_PedidoCompraTMP    Script Date: 07/30/2012 17:21:25 ******/
ALTER TABLE PedidoCompraItemBorradoTMP  ADD  CONSTRAINT FK_PedidoCompraItemBorradoTMP_PedidoCompraTMP FOREIGN KEY(pcTMP_id)
REFERENCES PedidoCompraTMP (pcTMP_id)
;
-- FK_PedidoCompraItemBorradoTMP_PedidoCompraTMP
;
/****** Object:  ForeignKey FK_PedidoCompraItemTMP_PedidoCompraTMP    Script Date: 07/30/2012 17:21:30 ******/
ALTER TABLE PedidoCompraItemTMP  ADD  CONSTRAINT FK_PedidoCompraItemTMP_PedidoCompraTMP FOREIGN KEY(pcTMP_id)
REFERENCES PedidoCompraTMP (pcTMP_id)
;
-- FK_PedidoCompraItemTMP_PedidoCompraTMP
;
/****** Object:  ForeignKey FK_PedidoCotizacionCompra_CotizacionCompraItem    Script Date: 07/30/2012 17:21:35 ******/
ALTER TABLE PedidoCotizacionCompra  ADD  CONSTRAINT FK_PedidoCotizacionCompra_CotizacionCompraItem FOREIGN KEY(coti_id)
REFERENCES CotizacionCompraItem (coti_id)
;
-- FK_PedidoCotizacionCompra_CotizacionCompraItem
;
/****** Object:  ForeignKey FK_PedidoCotizacionCompra_PedidoCompraItem    Script Date: 07/30/2012 17:21:35 ******/
ALTER TABLE PedidoCotizacionCompra  ADD  CONSTRAINT FK_PedidoCotizacionCompra_PedidoCompraItem FOREIGN KEY(pci_id)
REFERENCES PedidoCompraItem (pci_id)
;
-- FK_PedidoCotizacionCompra_PedidoCompraItem
;
/****** Object:  ForeignKey FK_PedidoDevolucionCompra_PedidoCompraItemDevolucion    Script Date: 07/30/2012 17:21:38 ******/
ALTER TABLE PedidoDevolucionCompra  ADD  CONSTRAINT FK_PedidoDevolucionCompra_PedidoCompraItemDevolucion FOREIGN KEY(pci_id_devolucion)
REFERENCES PedidoCompraItem (pci_id)
;
-- FK_PedidoDevolucionCompra_PedidoCompraItemDevolucion
;
/****** Object:  ForeignKey FK_PedidoDevolucionCompra_PedidoCompraItemPedido    Script Date: 07/30/2012 17:21:38 ******/
ALTER TABLE PedidoDevolucionCompra  ADD  CONSTRAINT FK_PedidoDevolucionCompra_PedidoCompraItemPedido FOREIGN KEY(pci_id_pedido)
REFERENCES PedidoCompraItem (pci_id)
;
-- FK_PedidoDevolucionCompra_PedidoCompraItemPedido
;
/****** Object:  ForeignKey FK_PedidoDevolucionCompraTMP_PedidoCompraTMP    Script Date: 07/30/2012 17:21:40 ******/
ALTER TABLE PedidoDevolucionCompraTMP  ADD  CONSTRAINT FK_PedidoDevolucionCompraTMP_PedidoCompraTMP FOREIGN KEY(pcTMP_id)
REFERENCES PedidoCompraTMP (pcTMP_id)
;
-- FK_PedidoDevolucionCompraTMP_PedidoCompraTMP
;
/****** Object:  ForeignKey FK_PedidoDevolucionVenta_PedidoVentaItemDevolucion    Script Date: 07/30/2012 17:21:41 ******/
ALTER TABLE PedidoDevolucionVenta  ADD  CONSTRAINT FK_PedidoDevolucionVenta_PedidoVentaItemDevolucion FOREIGN KEY(pvi_id_devolucion)
REFERENCES PedidoVentaItem (pvi_id)
;
-- FK_PedidoDevolucionVenta_PedidoVentaItemDevolucion
;
/****** Object:  ForeignKey FK_PedidoDevolucionVenta_PedidoVentaItemPedido    Script Date: 07/30/2012 17:21:41 ******/
ALTER TABLE PedidoDevolucionVenta  ADD  CONSTRAINT FK_PedidoDevolucionVenta_PedidoVentaItemPedido FOREIGN KEY(pvi_id_pedido)
REFERENCES PedidoVentaItem (pvi_id)
;
-- FK_PedidoDevolucionVenta_PedidoVentaItemPedido
;
/****** Object:  ForeignKey FK_PedidoFacturaVenta_FacturaVentaItem    Script Date: 07/30/2012 17:21:43 ******/
ALTER TABLE PedidoFacturaVenta  ADD  CONSTRAINT FK_PedidoFacturaVenta_FacturaVentaItem FOREIGN KEY(fvi_id)
REFERENCES FacturaVentaItem (fvi_id)
;
-- FK_PedidoFacturaVenta_FacturaVentaItem
;
/****** Object:  ForeignKey FK_PedidoFacturaVenta_PedidoVentaItem    Script Date: 07/30/2012 17:21:43 ******/
ALTER TABLE PedidoFacturaVenta  ADD  CONSTRAINT FK_PedidoFacturaVenta_PedidoVentaItem FOREIGN KEY(pvi_id)
REFERENCES PedidoVentaItem (pvi_id)
;
-- FK_PedidoFacturaVenta_PedidoVentaItem
;
/****** Object:  ForeignKey FK_PedidoOrdenCompra_OrdenCompraItem    Script Date: 07/30/2012 17:21:46 ******/
ALTER TABLE PedidoOrdenCompra  ADD  CONSTRAINT FK_PedidoOrdenCompra_OrdenCompraItem FOREIGN KEY(oci_id)
REFERENCES OrdenCompraItem (oci_id)
;
-- FK_PedidoOrdenCompra_OrdenCompraItem
;
/****** Object:  ForeignKey FK_PedidoOrdenCompra_PedidoCompraItem    Script Date: 07/30/2012 17:21:46 ******/
ALTER TABLE PedidoOrdenCompra  ADD  CONSTRAINT FK_PedidoOrdenCompra_PedidoCompraItem FOREIGN KEY(pci_id)
REFERENCES PedidoCompraItem (pci_id)
;
-- FK_PedidoOrdenCompra_PedidoCompraItem
;
/****** Object:  ForeignKey FK_PedidoPackingList_PackingListItem    Script Date: 07/30/2012 17:21:49 ******/
ALTER TABLE PedidoPackingList  ADD  CONSTRAINT FK_PedidoPackingList_PackingListItem FOREIGN KEY(pklsti_id)
REFERENCES PackingListItem (pklsti_id)
;
-- FK_PedidoPackingList_PackingListItem
;
/****** Object:  ForeignKey FK_PedidoPackingList_PedidoVentaItem    Script Date: 07/30/2012 17:21:49 ******/
ALTER TABLE PedidoPackingList  ADD  CONSTRAINT FK_PedidoPackingList_PedidoVentaItem FOREIGN KEY(pvi_id)
REFERENCES PedidoVentaItem (pvi_id)
;
-- FK_PedidoPackingList_PedidoVentaItem
;
/****** Object:  ForeignKey FK_PedidoRemitoVenta_PedidoVentaItem    Script Date: 07/30/2012 17:21:52 ******/
ALTER TABLE PedidoRemitoVenta  ADD  CONSTRAINT FK_PedidoRemitoVenta_PedidoVentaItem FOREIGN KEY(pvi_id)
REFERENCES PedidoVentaItem (pvi_id)
;
-- FK_PedidoRemitoVenta_PedidoVentaItem
;
/****** Object:  ForeignKey FK_PedidoRemitoVenta_RemitoVentaItem    Script Date: 07/30/2012 17:21:52 ******/
ALTER TABLE PedidoRemitoVenta  ADD  CONSTRAINT FK_PedidoRemitoVenta_RemitoVentaItem FOREIGN KEY(rvi_id)
REFERENCES RemitoVentaItem (rvi_id)
;
-- FK_PedidoRemitoVenta_RemitoVentaItem
;
/****** Object:  ForeignKey FK_PedidoVenta_CentroCosto    Script Date: 07/30/2012 17:22:03 ******/
ALTER TABLE PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PedidoVenta_CentroCosto
;
/****** Object:  ForeignKey FK_PedidoVenta_Cliente    Script Date: 07/30/2012 17:22:04 ******/
ALTER TABLE PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_PedidoVenta_Cliente
;
/****** Object:  ForeignKey FK_PedidoVenta_ClienteSucursal    Script Date: 07/30/2012 17:22:04 ******/
ALTER TABLE PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_ClienteSucursal FOREIGN KEY(clis_id)
REFERENCES ClienteSucursal (clis_id)
;
-- FK_PedidoVenta_ClienteSucursal
;
/****** Object:  ForeignKey FK_PedidoVenta_CondicionPago    Script Date: 07/30/2012 17:22:04 ******/
ALTER TABLE PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_CondicionPago FOREIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_PedidoVenta_CondicionPago
;
/****** Object:  ForeignKey FK_PedidoVenta_Documento    Script Date: 07/30/2012 17:22:04 ******/
ALTER TABLE PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_PedidoVenta_Documento
;
/****** Object:  ForeignKey FK_PedidoVenta_DocumentoTipo    Script Date: 07/30/2012 17:22:04 ******/
ALTER TABLE PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_PedidoVenta_DocumentoTipo
;
/****** Object:  ForeignKey FK_PedidoVenta_Empresa    Script Date: 07/30/2012 17:22:04 ******/
ALTER TABLE PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_PedidoVenta_Empresa
;
/****** Object:  ForeignKey FK_PedidoVenta_Legajo    Script Date: 07/30/2012 17:22:04 ******/
ALTER TABLE PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_PedidoVenta_Legajo
;
/****** Object:  ForeignKey FK_PedidoVenta_ListaDescuento    Script Date: 07/30/2012 17:22:04 ******/
ALTER TABLE PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_ListaDescuento FOREIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_PedidoVenta_ListaDescuento
;
/****** Object:  ForeignKey FK_PedidoVenta_ListaPrecio    Script Date: 07/30/2012 17:22:04 ******/
ALTER TABLE PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_ListaPrecio FOREIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_PedidoVenta_ListaPrecio
;
/****** Object:  ForeignKey FK_PedidoVenta_Provincia    Script Date: 07/30/2012 17:22:04 ******/
ALTER TABLE PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_Provincia FOREIGN KEY(pro_id_origen)
REFERENCES Provincia (pro_id)
;
-- FK_PedidoVenta_Provincia
;
/****** Object:  ForeignKey FK_PedidoVenta_Provincia1    Script Date: 07/30/2012 17:22:04 ******/
ALTER TABLE PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_Provincia1 FOREIGN KEY(pro_id_destino)
REFERENCES Provincia (pro_id)
;
-- FK_PedidoVenta_Provincia1
;
/****** Object:  ForeignKey FK_PedidoVenta_Transporte    Script Date: 07/30/2012 17:22:05 ******/
ALTER TABLE PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_Transporte FOREIGN KEY(trans_id)
REFERENCES Transporte (trans_id)
;
-- FK_PedidoVenta_Transporte
;
/****** Object:  ForeignKey FK_PedidoVenta_Usuario    Script Date: 07/30/2012 17:22:05 ******/
ALTER TABLE PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_PedidoVenta_Usuario
;
/****** Object:  ForeignKey FK_PedidoVenta_Vendedor    Script Date: 07/30/2012 17:22:05 ******/
ALTER TABLE PedidoVenta  ADD  CONSTRAINT FK_PedidoVenta_Vendedor FOREIGN KEY(ven_id)
REFERENCES Vendedor (ven_id)
;
-- FK_PedidoVenta_Vendedor
;
/****** Object:  ForeignKey FK_PedidoVentaItem_CentroCosto    Script Date: 07/30/2012 17:22:10 ******/
ALTER TABLE PedidoVentaItem  ADD  CONSTRAINT FK_PedidoVentaItem_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PedidoVentaItem_CentroCosto
;
/****** Object:  ForeignKey FK_PedidoVentaItem_PedidoVenta    Script Date: 07/30/2012 17:22:10 ******/
ALTER TABLE PedidoVentaItem  ADD  CONSTRAINT FK_PedidoVentaItem_PedidoVenta FOREIGN KEY(pv_id)
REFERENCES PedidoVenta (pv_id)
;
-- FK_PedidoVentaItem_PedidoVenta
;
/****** Object:  ForeignKey FK_PedidoVentaItem_Producto    Script Date: 07/30/2012 17:22:10 ******/
ALTER TABLE PedidoVentaItem  ADD  CONSTRAINT FK_PedidoVentaItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_PedidoVentaItem_Producto
;
/****** Object:  ForeignKey FK_PedidoVentaItemBorradoTMP_PedidoVentaTMP    Script Date: 07/30/2012 17:22:11 ******/
ALTER TABLE PedidoVentaItemBorradoTMP  ADD  CONSTRAINT FK_PedidoVentaItemBorradoTMP_PedidoVentaTMP FOREIGN KEY(pvTMP_id)
REFERENCES PedidoVentaTMP (pvTMP_id)
;
-- FK_PedidoVentaItemBorradoTMP_PedidoVentaTMP
;
/****** Object:  ForeignKey FK_PedidoVentaItemStock_PedidoVenta    Script Date: 07/30/2012 17:22:13 ******/
ALTER TABLE PedidoVentaItemStock  ADD  CONSTRAINT FK_PedidoVentaItemStock_PedidoVenta FOREIGN KEY(pv_id)
REFERENCES PedidoVenta (pv_id)
;
-- FK_PedidoVentaItemStock_PedidoVenta
;
/****** Object:  ForeignKey FK_PedidoVentaItemStock_Producto    Script Date: 07/30/2012 17:22:13 ******/
ALTER TABLE PedidoVentaItemStock  ADD  CONSTRAINT FK_PedidoVentaItemStock_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_PedidoVentaItemStock_Producto
;
/****** Object:  ForeignKey FK_PedidoVentaItemStock_ProductoKit    Script Date: 07/30/2012 17:22:13 ******/
ALTER TABLE PedidoVentaItemStock  ADD  CONSTRAINT FK_PedidoVentaItemStock_ProductoKit FOREIGN KEY(pr_id_kit)
REFERENCES Producto (pr_id)
;
-- FK_PedidoVentaItemStock_ProductoKit
;
/****** Object:  ForeignKey FK_PedidoVentaItemStock_ProductoKitPadre    Script Date: 07/30/2012 17:22:13 ******/
ALTER TABLE PedidoVentaItemStock  ADD  CONSTRAINT FK_PedidoVentaItemStock_ProductoKitPadre FOREIGN KEY(pr_id_kitpadre)
REFERENCES Producto (pr_id)
;
-- FK_PedidoVentaItemStock_ProductoKitPadre
;
/****** Object:  ForeignKey FK_PedidoVentaItemTMP_PedidoVentaTMP    Script Date: 07/30/2012 17:22:18 ******/
ALTER TABLE PedidoVentaItemTMP  ADD  CONSTRAINT FK_PedidoVentaItemTMP_PedidoVentaTMP FOREIGN KEY(pvTMP_id)
REFERENCES PedidoVentaTMP (pvTMP_id)
;
-- FK_PedidoVentaItemTMP_PedidoVentaTMP
;
/****** Object:  ForeignKey FK_Percepcion_PercepcionTipo    Script Date: 07/30/2012 17:22:29 ******/
ALTER TABLE Percepcion  ADD  CONSTRAINT FK_Percepcion_PercepcionTipo FOREIGN KEY(perct_id)
REFERENCES PercepcionTipo (perct_id)
;
-- FK_Percepcion_PercepcionTipo
;
/****** Object:  ForeignKey FK_Percepcion_Talonario    Script Date: 07/30/2012 17:22:29 ******/
ALTER TABLE Percepcion  ADD  CONSTRAINT FK_Percepcion_Talonario FOREIGN KEY(ta_id)
REFERENCES Talonario (ta_id)
;
-- FK_Percepcion_Talonario
;
/****** Object:  ForeignKey FK_Percepcion_Usuario    Script Date: 07/30/2012 17:22:29 ******/
ALTER TABLE Percepcion  ADD  CONSTRAINT FK_Percepcion_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Percepcion_Usuario
;
/****** Object:  ForeignKey FK_PercepcionItem_Percepcion    Script Date: 07/30/2012 17:22:33 ******/
ALTER TABLE PercepcionItem  ADD  CONSTRAINT FK_PercepcionItem_Percepcion FOREIGN KEY(perc_id)
REFERENCES Percepcion (perc_id)
;
-- FK_PercepcionItem_Percepcion
;
/****** Object:  ForeignKey FK_PercepcionTipo_Cuenta    Script Date: 07/30/2012 17:22:36 ******/
ALTER TABLE PercepcionTipo  ADD  CONSTRAINT FK_PercepcionTipo_Cuenta FOREIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_PercepcionTipo_Cuenta
;
/****** Object:  ForeignKey FK_PercepcionTipo_Usuario    Script Date: 07/30/2012 17:22:36 ******/
ALTER TABLE PercepcionTipo  ADD  CONSTRAINT FK_PercepcionTipo_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_PercepcionTipo_Usuario
;
/****** Object:  ForeignKey FK_Permiso_Permiso    Script Date: 07/30/2012 17:22:38 ******/
ALTER TABLE Permiso  ADD  CONSTRAINT FK_Permiso_Permiso FOREIGN KEY(per_id_padre)
REFERENCES Permiso (per_id)
;
-- FK_Permiso_Permiso
;
/****** Object:  ForeignKey FK_Permiso_Prestacion    Script Date: 07/30/2012 17:22:38 ******/
ALTER TABLE Permiso  ADD  CONSTRAINT FK_Permiso_Prestacion FOREIGN KEY(pre_id)
REFERENCES Prestacion (pre_id)
;
-- FK_Permiso_Prestacion
;
/****** Object:  ForeignKey FK_Permiso_Rol    Script Date: 07/30/2012 17:22:38 ******/
ALTER TABLE Permiso  ADD  CONSTRAINT FK_Permiso_Rol FOREIGN KEY(rol_id)
REFERENCES Rol (rol_id)
;
-- FK_Permiso_Rol
;
/****** Object:  ForeignKey FK_Permiso_Usuario    Script Date: 07/30/2012 17:22:39 ******/
ALTER TABLE Permiso  ADD  CONSTRAINT FK_Permiso_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Permiso_Usuario
;
/****** Object:  ForeignKey FK_PermisoEmbarque_Aduana    Script Date: 07/30/2012 17:22:44 ******/
ALTER TABLE PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_Aduana FOREIGN KEY(adu_id)
REFERENCES Aduana (adu_id)
;
-- FK_PermisoEmbarque_Aduana
;
/****** Object:  ForeignKey FK_PermisoEmbarque_Banco    Script Date: 07/30/2012 17:22:44 ******/
ALTER TABLE PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_Banco FOREIGN KEY(bco_id)
REFERENCES Banco (bco_id)
;
-- FK_PermisoEmbarque_Banco
;
/****** Object:  ForeignKey FK_PermisoEmbarque_CentroCosto    Script Date: 07/30/2012 17:22:44 ******/
ALTER TABLE PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PermisoEmbarque_CentroCosto
;
/****** Object:  ForeignKey FK_PermisoEmbarque_Documento    Script Date: 07/30/2012 17:22:44 ******/
ALTER TABLE PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_PermisoEmbarque_Documento
;
/****** Object:  ForeignKey FK_PermisoEmbarque_DocumentoTipo    Script Date: 07/30/2012 17:22:44 ******/
ALTER TABLE PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_PermisoEmbarque_DocumentoTipo
;
/****** Object:  ForeignKey FK_PermisoEmbarque_Embarque    Script Date: 07/30/2012 17:22:45 ******/
ALTER TABLE PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_Embarque FOREIGN KEY(emb_id)
REFERENCES Embarque (emb_id)
;
-- FK_PermisoEmbarque_Embarque
;
/****** Object:  ForeignKey FK_PermisoEmbarque_Estado    Script Date: 07/30/2012 17:22:45 ******/
ALTER TABLE PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_Estado FOREIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_PermisoEmbarque_Estado
;
/****** Object:  ForeignKey FK_PermisoEmbarque_Legajo    Script Date: 07/30/2012 17:22:45 ******/
ALTER TABLE PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_PermisoEmbarque_Legajo
;
/****** Object:  ForeignKey FK_PermisoEmbarque_ListaPrecio    Script Date: 07/30/2012 17:22:45 ******/
ALTER TABLE PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_ListaPrecio FOREIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_PermisoEmbarque_ListaPrecio
;
/****** Object:  ForeignKey FK_PermisoEmbarque_Moneda    Script Date: 07/30/2012 17:22:45 ******/
ALTER TABLE PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_Moneda FOREIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_PermisoEmbarque_Moneda
;
/****** Object:  ForeignKey FK_PermisoEmbarque_Sucursal    Script Date: 07/30/2012 17:22:45 ******/
ALTER TABLE PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_PermisoEmbarque_Sucursal
;
/****** Object:  ForeignKey FK_PermisoEmbarque_Usuario    Script Date: 07/30/2012 17:22:45 ******/
ALTER TABLE PermisoEmbarque  ADD  CONSTRAINT FK_PermisoEmbarque_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_PermisoEmbarque_Usuario
;
/****** Object:  ForeignKey FK_PermisoEmbarqueItem_PermisoEmbarque    Script Date: 07/30/2012 17:22:48 ******/
ALTER TABLE PermisoEmbarqueItem  ADD  CONSTRAINT FK_PermisoEmbarqueItem_PermisoEmbarque FOREIGN KEY(pemb_id)
REFERENCES PermisoEmbarque (pemb_id)
;
-- FK_PermisoEmbarqueItem_PermisoEmbarque
;
/****** Object:  ForeignKey FK_PermisoEmbarqueItem_Producto    Script Date: 07/30/2012 17:22:48 ******/
ALTER TABLE PermisoEmbarqueItem  ADD  CONSTRAINT FK_PermisoEmbarqueItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_PermisoEmbarqueItem_Producto
;
/****** Object:  ForeignKey FK_PermisoEmbarqueItemBorradoTMP_PermisoEmbarqueTMP    Script Date: 07/30/2012 17:22:49 ******/
ALTER TABLE PermisoEmbarqueItemBorradoTMP  ADD  CONSTRAINT FK_PermisoEmbarqueItemBorradoTMP_PermisoEmbarqueTMP FOREIGN KEY(pembTMP_id)
REFERENCES PermisoEmbarqueTMP (pembTMP_id)
;
-- FK_PermisoEmbarqueItemBorradoTMP_PermisoEmbarqueTMP
;
/****** Object:  ForeignKey FK_PermisoEmbarqueItemTMP_PermisoEmbarqueTMP    Script Date: 07/30/2012 17:22:51 ******/
ALTER TABLE PermisoEmbarqueItemTMP  ADD  CONSTRAINT FK_PermisoEmbarqueItemTMP_PermisoEmbarqueTMP FOREIGN KEY(pembTMP_id)
REFERENCES PermisoEmbarqueTMP (pembTMP_id)
;
-- FK_PermisoEmbarqueItemTMP_PermisoEmbarqueTMP
;
/****** Object:  ForeignKey FK_Persona_Cliente    Script Date: 07/30/2012 17:23:06 ******/
ALTER TABLE Persona  ADD  CONSTRAINT FK_Persona_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_Persona_Cliente
;
/****** Object:  ForeignKey FK_Persona_Departamento    Script Date: 07/30/2012 17:23:06 ******/
ALTER TABLE Persona  ADD  CONSTRAINT FK_Persona_Departamento FOREIGN KEY(dpto_id)
REFERENCES Departamento (dpto_id)
;
-- FK_Persona_Departamento
;
/****** Object:  ForeignKey FK_Persona_PersonaDocumentoTipo    Script Date: 07/30/2012 17:23:06 ******/
ALTER TABLE Persona  ADD  CONSTRAINT FK_Persona_PersonaDocumentoTipo FOREIGN KEY(prsdt_id)
REFERENCES PersonaDocumentoTipo (prsdt_id)
;
-- FK_Persona_PersonaDocumentoTipo
;
/****** Object:  ForeignKey FK_Persona_Proveedor    Script Date: 07/30/2012 17:23:06 ******/
ALTER TABLE Persona  ADD  CONSTRAINT FK_Persona_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_Persona_Proveedor
;
/****** Object:  ForeignKey FK_Persona_Provincia    Script Date: 07/30/2012 17:23:06 ******/
ALTER TABLE Persona  ADD  CONSTRAINT FK_Persona_Provincia FOREIGN KEY(pro_id)
REFERENCES Provincia (pro_id)
;
-- FK_Persona_Provincia
;
/****** Object:  ForeignKey FK_Persona_Sucursal    Script Date: 07/30/2012 17:23:06 ******/
ALTER TABLE Persona  ADD  CONSTRAINT FK_Persona_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_Persona_Sucursal
;
/****** Object:  ForeignKey FK_Persona_Usuario    Script Date: 07/30/2012 17:23:06 ******/
ALTER TABLE Persona  ADD  CONSTRAINT FK_Persona_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Persona_Usuario
;
/****** Object:  ForeignKey FK_PersonaDocumentoTipo_Usuario    Script Date: 07/30/2012 17:23:08 ******/
ALTER TABLE PersonaDocumentoTipo  ADD  CONSTRAINT FK_PersonaDocumentoTipo_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_PersonaDocumentoTipo_Usuario
;
/****** Object:  ForeignKey FK_PickingList_Estado    Script Date: 07/30/2012 17:23:14 ******/
ALTER TABLE PickingList  ADD  CONSTRAINT FK_PickingList_Estado FOREIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_PickingList_Estado
;
/****** Object:  ForeignKey FK_PickingList_Sucursal    Script Date: 07/30/2012 17:23:14 ******/
ALTER TABLE PickingList  ADD  CONSTRAINT FK_PickingList_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_PickingList_Sucursal
;
/****** Object:  ForeignKey FK_PickingListPedido_PedidoVenta    Script Date: 07/30/2012 17:23:15 ******/
ALTER TABLE PickingListPedido  ADD  CONSTRAINT FK_PickingListPedido_PedidoVenta FOREIGN KEY(pv_id)
REFERENCES PedidoVenta (pv_id)
;
-- FK_PickingListPedido_PedidoVenta
;
/****** Object:  ForeignKey FK_PickingListPedido_PickingList    Script Date: 07/30/2012 17:23:16 ******/
ALTER TABLE PickingListPedido  ADD  CONSTRAINT FK_PickingListPedido_PickingList FOREIGN KEY(pkl_id)
REFERENCES PickingList (pkl_id)
;
-- FK_PickingListPedido_PickingList
;
/****** Object:  ForeignKey FK_PickingListPedidoItem_PedidoVenta    Script Date: 07/30/2012 17:23:18 ******/
ALTER TABLE PickingListPedidoItem  ADD  CONSTRAINT FK_PickingListPedidoItem_PedidoVenta FOREIGN KEY(pv_id)
REFERENCES PedidoVenta (pv_id)
;
-- FK_PickingListPedidoItem_PedidoVenta
;
/****** Object:  ForeignKey FK_PickingListPedidoItem_PedidoVentaItem    Script Date: 07/30/2012 17:23:18 ******/
ALTER TABLE PickingListPedidoItem  ADD  CONSTRAINT FK_PickingListPedidoItem_PedidoVentaItem FOREIGN KEY(pvi_id)
REFERENCES PedidoVentaItem (pvi_id)
;
-- FK_PickingListPedidoItem_PedidoVentaItem
;
/****** Object:  ForeignKey FK_PickingListPedidoItem_PickingList    Script Date: 07/30/2012 17:23:18 ******/
ALTER TABLE PickingListPedidoItem  ADD  CONSTRAINT FK_PickingListPedidoItem_PickingList FOREIGN KEY(pkl_id)
REFERENCES PickingList (pkl_id)
;
-- FK_PickingListPedidoItem_PickingList
;
/****** Object:  ForeignKey FK_PickingListPedidoItem_PickingListPedido    Script Date: 07/30/2012 17:23:18 ******/
ALTER TABLE PickingListPedidoItem  ADD  CONSTRAINT FK_PickingListPedidoItem_PickingListPedido FOREIGN KEY(pklpv_id)
REFERENCES PickingListPedido (pklpv_id)
;
-- FK_PickingListPedidoItem_PickingListPedido
;
/****** Object:  ForeignKey FK_PosicionArancel_TasaImpositivaDerechos    Script Date: 07/30/2012 17:23:20 ******/
ALTER TABLE PosicionArancel  ADD  CONSTRAINT FK_PosicionArancel_TasaImpositivaDerechos FOREIGN KEY(ti_id_derechos)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_PosicionArancel_TasaImpositivaDerechos
;
/****** Object:  ForeignKey FK_PosicionArancel_TasaImpositivaEstadistica    Script Date: 07/30/2012 17:23:21 ******/
ALTER TABLE PosicionArancel  ADD  CONSTRAINT FK_PosicionArancel_TasaImpositivaEstadistica FOREIGN KEY(ti_id_estadistica)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_PosicionArancel_TasaImpositivaEstadistica
;
/****** Object:  ForeignKey FK_PosicionArancel_Usuario    Script Date: 07/30/2012 17:23:21 ******/
ALTER TABLE PosicionArancel  ADD  CONSTRAINT FK_PosicionArancel_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_PosicionArancel_Usuario
;
/****** Object:  ForeignKey FK_PresupuestoCompra_CentroCosto    Script Date: 07/30/2012 17:23:31 ******/
ALTER TABLE PresupuestoCompra  ADD  CONSTRAINT FK_PresupuestoCompra_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PresupuestoCompra_CentroCosto
;
/****** Object:  ForeignKey FK_PresupuestoCompra_CondicionPago    Script Date: 07/30/2012 17:23:31 ******/
ALTER TABLE PresupuestoCompra  ADD  CONSTRAINT FK_PresupuestoCompra_CondicionPago FOREIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_PresupuestoCompra_CondicionPago
;
/****** Object:  ForeignKey FK_PresupuestoCompra_Documento    Script Date: 07/30/2012 17:23:31 ******/
ALTER TABLE PresupuestoCompra  ADD  CONSTRAINT FK_PresupuestoCompra_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_PresupuestoCompra_Documento
;
/****** Object:  ForeignKey FK_PresupuestoCompra_DocumentoTipo    Script Date: 07/30/2012 17:23:32 ******/
ALTER TABLE PresupuestoCompra  ADD  CONSTRAINT FK_PresupuestoCompra_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_PresupuestoCompra_DocumentoTipo
;
/****** Object:  ForeignKey FK_PresupuestoCompra_Legajo    Script Date: 07/30/2012 17:23:32 ******/
ALTER TABLE PresupuestoCompra  ADD  CONSTRAINT FK_PresupuestoCompra_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_PresupuestoCompra_Legajo
;
/****** Object:  ForeignKey FK_PresupuestoCompra_ListaDescuento    Script Date: 07/30/2012 17:23:32 ******/
ALTER TABLE PresupuestoCompra  ADD  CONSTRAINT FK_PresupuestoCompra_ListaDescuento FOREIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_PresupuestoCompra_ListaDescuento
;
/****** Object:  ForeignKey FK_PresupuestoCompra_ListaPrecio    Script Date: 07/30/2012 17:23:32 ******/
ALTER TABLE PresupuestoCompra  ADD  CONSTRAINT FK_PresupuestoCompra_ListaPrecio FOREIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_PresupuestoCompra_ListaPrecio
;
/****** Object:  ForeignKey FK_PresupuestoCompra_Proveedor    Script Date: 07/30/2012 17:23:32 ******/
ALTER TABLE PresupuestoCompra  ADD  CONSTRAINT FK_PresupuestoCompra_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_PresupuestoCompra_Proveedor
;
/****** Object:  ForeignKey FK_PresupuestoCompra_UsSolicito    Script Date: 07/30/2012 17:23:32 ******/
ALTER TABLE PresupuestoCompra  ADD  CONSTRAINT FK_PresupuestoCompra_UsSolicito FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_PresupuestoCompra_UsSolicito
;
/****** Object:  ForeignKey FK_PresupuestoCompra_Usuario    Script Date: 07/30/2012 17:23:32 ******/
ALTER TABLE PresupuestoCompra  ADD  CONSTRAINT FK_PresupuestoCompra_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_PresupuestoCompra_Usuario
;
/****** Object:  ForeignKey FK_PresupuestoCompraItem_CentroCosto    Script Date: 07/30/2012 17:23:37 ******/
ALTER TABLE PresupuestoCompraItem  ADD  CONSTRAINT FK_PresupuestoCompraItem_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PresupuestoCompraItem_CentroCosto
;
/****** Object:  ForeignKey FK_PresupuestoCompraItem_PresupuestoCompra    Script Date: 07/30/2012 17:23:37 ******/
ALTER TABLE PresupuestoCompraItem  ADD  CONSTRAINT FK_PresupuestoCompraItem_PresupuestoCompra FOREIGN KEY(prc_id)
REFERENCES PresupuestoCompra (prc_id)
;
-- FK_PresupuestoCompraItem_PresupuestoCompra
;
/****** Object:  ForeignKey FK_PresupuestoCompraItem_Producto    Script Date: 07/30/2012 17:23:37 ******/
ALTER TABLE PresupuestoCompraItem  ADD  CONSTRAINT FK_PresupuestoCompraItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_PresupuestoCompraItem_Producto
;
/****** Object:  ForeignKey FK_PresupuestoCompraItemBorradoTMP_PresupuestoCompraTMP    Script Date: 07/30/2012 17:23:38 ******/
ALTER TABLE PresupuestoCompraItemBorradoTMP  ADD  CONSTRAINT FK_PresupuestoCompraItemBorradoTMP_PresupuestoCompraTMP FOREIGN KEY(prcTMP_id)
REFERENCES PresupuestoCompraTMP (prcTMP_id)
;
-- FK_PresupuestoCompraItemBorradoTMP_PresupuestoCompraTMP
;
/****** Object:  ForeignKey FK_PresupuestoCompraItemTMP_PresupuestoCompraTMP    Script Date: 07/30/2012 17:23:43 ******/
ALTER TABLE PresupuestoCompraItemTMP  ADD  CONSTRAINT FK_PresupuestoCompraItemTMP_PresupuestoCompraTMP FOREIGN KEY(prcTMP_id)
REFERENCES PresupuestoCompraTMP (prcTMP_id)
;
-- FK_PresupuestoCompraItemTMP_PresupuestoCompraTMP
;
/****** Object:  ForeignKey FK_PresupuestoDevolucionCompra_PresupuestoCompraItemDevolucion    Script Date: 07/30/2012 17:23:50 ******/
ALTER TABLE PresupuestoDevolucionCompra  ADD  CONSTRAINT FK_PresupuestoDevolucionCompra_PresupuestoCompraItemDevolucion FOREIGN KEY(prci_id_devolucion)
REFERENCES PresupuestoCompraItem (prci_id)
;
-- FK_PresupuestoDevolucionCompra_PresupuestoCompraItemDevolucion
;
/****** Object:  ForeignKey FK_PresupuestoDevolucionCompra_PresupuestoCompraItemPresupuesto    Script Date: 07/30/2012 17:23:50 ******/
ALTER TABLE PresupuestoDevolucionCompra  ADD  CONSTRAINT FK_PresupuestoDevolucionCompra_PresupuestoCompraItemPresupuesto FOREIGN KEY(prci_id_Presupuesto)
REFERENCES PresupuestoCompraItem (prci_id)
;
-- FK_PresupuestoDevolucionCompra_PresupuestoCompraItemPresupuesto
;
/****** Object:  ForeignKey FK_PresupuestoDevolucionCompraTMP_PresupuestoCompraTMP    Script Date: 07/30/2012 17:23:51 ******/
ALTER TABLE PresupuestoDevolucionCompraTMP  ADD  CONSTRAINT FK_PresupuestoDevolucionCompraTMP_PresupuestoCompraTMP FOREIGN KEY(prcTMP_id)
REFERENCES PresupuestoCompraTMP (prcTMP_id)
;
-- FK_PresupuestoDevolucionCompraTMP_PresupuestoCompraTMP
;
/****** Object:  ForeignKey FK_PresupuestoDevolucionVenta_PresupuestoVentaItemDevolucion    Script Date: 07/30/2012 17:23:53 ******/
ALTER TABLE PresupuestoDevolucionVenta  ADD  CONSTRAINT FK_PresupuestoDevolucionVenta_PresupuestoVentaItemDevolucion FOREIGN KEY(prvi_id_devolucion)
REFERENCES PresupuestoVentaItem (prvi_id)
;
-- FK_PresupuestoDevolucionVenta_PresupuestoVentaItemDevolucion
;
/****** Object:  ForeignKey FK_PresupuestoDevolucionVenta_PresupuestoVentaItemPresupuesto    Script Date: 07/30/2012 17:23:53 ******/
ALTER TABLE PresupuestoDevolucionVenta  ADD  CONSTRAINT FK_PresupuestoDevolucionVenta_PresupuestoVentaItemPresupuesto FOREIGN KEY(prvi_id_Presupuesto)
REFERENCES PresupuestoVentaItem (prvi_id)
;
-- FK_PresupuestoDevolucionVenta_PresupuestoVentaItemPresupuesto
;
/****** Object:  ForeignKey FK_PresupuestoEnvio_CentroCosto    Script Date: 07/30/2012 17:24:01 ******/
ALTER TABLE PresupuestoEnvio  ADD  CONSTRAINT FK_PresupuestoEnvio_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PresupuestoEnvio_CentroCosto
;
/****** Object:  ForeignKey FK_PresupuestoEnvio_Cliente    Script Date: 07/30/2012 17:24:01 ******/
ALTER TABLE PresupuestoEnvio  ADD  CONSTRAINT FK_PresupuestoEnvio_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_PresupuestoEnvio_Cliente
;
/****** Object:  ForeignKey FK_PresupuestoEnvio_CondicionPago    Script Date: 07/30/2012 17:24:01 ******/
ALTER TABLE PresupuestoEnvio  ADD  CONSTRAINT FK_PresupuestoEnvio_CondicionPago FOREIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_PresupuestoEnvio_CondicionPago
;
/****** Object:  ForeignKey FK_PresupuestoEnvio_Documento    Script Date: 07/30/2012 17:24:01 ******/
ALTER TABLE PresupuestoEnvio  ADD  CONSTRAINT FK_PresupuestoEnvio_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_PresupuestoEnvio_Documento
;
/****** Object:  ForeignKey FK_PresupuestoEnvio_DocumentoTipo    Script Date: 07/30/2012 17:24:01 ******/
ALTER TABLE PresupuestoEnvio  ADD  CONSTRAINT FK_PresupuestoEnvio_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_PresupuestoEnvio_DocumentoTipo
;
/****** Object:  ForeignKey FK_PresupuestoEnvio_Usuario    Script Date: 07/30/2012 17:24:01 ******/
ALTER TABLE PresupuestoEnvio  ADD  CONSTRAINT FK_PresupuestoEnvio_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_PresupuestoEnvio_Usuario
;
/****** Object:  ForeignKey FK_PresupuestoEnvio_Vendedor    Script Date: 07/30/2012 17:24:01 ******/
ALTER TABLE PresupuestoEnvio  ADD  CONSTRAINT FK_PresupuestoEnvio_Vendedor FOREIGN KEY(ven_id)
REFERENCES Vendedor (ven_id)
;
-- FK_PresupuestoEnvio_Vendedor
;
/****** Object:  ForeignKey FK_PresupuestoEnvioGasto_CentroCosto    Script Date: 07/30/2012 17:24:06 ******/
ALTER TABLE PresupuestoEnvioGasto  ADD  CONSTRAINT FK_PresupuestoEnvioGasto_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PresupuestoEnvioGasto_CentroCosto
;
/****** Object:  ForeignKey FK_PresupuestoEnvioGasto_Gasto    Script Date: 07/30/2012 17:24:06 ******/
ALTER TABLE PresupuestoEnvioGasto  ADD  CONSTRAINT FK_PresupuestoEnvioGasto_Gasto FOREIGN KEY(gto_id)
REFERENCES Gasto (gto_id)
;
-- FK_PresupuestoEnvioGasto_Gasto
;
/****** Object:  ForeignKey FK_PresupuestoEnvioGasto_PresupuestoEnvio    Script Date: 07/30/2012 17:24:06 ******/
ALTER TABLE PresupuestoEnvioGasto  ADD  CONSTRAINT FK_PresupuestoEnvioGasto_PresupuestoEnvio FOREIGN KEY(pree_id)
REFERENCES PresupuestoEnvio (pree_id)
;
-- FK_PresupuestoEnvioGasto_PresupuestoEnvio
;
/****** Object:  ForeignKey FK_PresupuestoEnvioGasto_Producto    Script Date: 07/30/2012 17:24:06 ******/
ALTER TABLE PresupuestoEnvioGasto  ADD  CONSTRAINT FK_PresupuestoEnvioGasto_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_PresupuestoEnvioGasto_Producto
;
/****** Object:  ForeignKey FK_PresupuestoEnvioGasto_TarifaGasto    Script Date: 07/30/2012 17:24:06 ******/
ALTER TABLE PresupuestoEnvioGasto  ADD  CONSTRAINT FK_PresupuestoEnvioGasto_TarifaGasto FOREIGN KEY(trfg_id)
REFERENCES TarifaGasto (trfg_id)
;
-- FK_PresupuestoEnvioGasto_TarifaGasto
;
/****** Object:  ForeignKey FK_PresupuestoEnvioGastoBorradoTMP_PresupuestoEnvioTMP    Script Date: 07/30/2012 17:24:07 ******/
ALTER TABLE PresupuestoEnvioGastoBorradoTMP  ADD  CONSTRAINT FK_PresupuestoEnvioGastoBorradoTMP_PresupuestoEnvioTMP FOREIGN KEY(preeTMP_id)
REFERENCES PresupuestoEnvioTMP (preeTMP_id)
;
-- FK_PresupuestoEnvioGastoBorradoTMP_PresupuestoEnvioTMP
;
/****** Object:  ForeignKey FK_PresupuestoEnvioGastoTMP_PresupuestoEnvioTMP    Script Date: 07/30/2012 17:24:11 ******/
ALTER TABLE PresupuestoEnvioGastoTMP  ADD  CONSTRAINT FK_PresupuestoEnvioGastoTMP_PresupuestoEnvioTMP FOREIGN KEY(preeTMP_id)
REFERENCES PresupuestoEnvioTMP (preeTMP_id)
;
-- FK_PresupuestoEnvioGastoTMP_PresupuestoEnvioTMP
;
/****** Object:  ForeignKey FK_PresupuestoEnvioItem_CentroCosto    Script Date: 07/30/2012 17:24:17 ******/
ALTER TABLE PresupuestoEnvioItem  ADD  CONSTRAINT FK_PresupuestoEnvioItem_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PresupuestoEnvioItem_CentroCosto
;
/****** Object:  ForeignKey FK_PresupuestoEnvioItem_Destino    Script Date: 07/30/2012 17:24:17 ******/
ALTER TABLE PresupuestoEnvioItem  ADD  CONSTRAINT FK_PresupuestoEnvioItem_Destino FOREIGN KEY(pue_id_destino)
REFERENCES Puerto (pue_id)
;
-- FK_PresupuestoEnvioItem_Destino
;
/****** Object:  ForeignKey FK_PresupuestoEnvioItem_Origen    Script Date: 07/30/2012 17:24:17 ******/
ALTER TABLE PresupuestoEnvioItem  ADD  CONSTRAINT FK_PresupuestoEnvioItem_Origen FOREIGN KEY(pue_id_origen)
REFERENCES Puerto (pue_id)
;
-- FK_PresupuestoEnvioItem_Origen
;
/****** Object:  ForeignKey FK_PresupuestoEnvioItem_PresupuestoEnvio    Script Date: 07/30/2012 17:24:17 ******/
ALTER TABLE PresupuestoEnvioItem  ADD  CONSTRAINT FK_PresupuestoEnvioItem_PresupuestoEnvio FOREIGN KEY(pree_id)
REFERENCES PresupuestoEnvio (pree_id)
;
-- FK_PresupuestoEnvioItem_PresupuestoEnvio
;
/****** Object:  ForeignKey FK_PresupuestoEnvioItem_Producto    Script Date: 07/30/2012 17:24:17 ******/
ALTER TABLE PresupuestoEnvioItem  ADD  CONSTRAINT FK_PresupuestoEnvioItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_PresupuestoEnvioItem_Producto
;
/****** Object:  ForeignKey FK_PresupuestoEnvioItem_TarifaItem    Script Date: 07/30/2012 17:24:17 ******/
ALTER TABLE PresupuestoEnvioItem  ADD  CONSTRAINT FK_PresupuestoEnvioItem_TarifaItem FOREIGN KEY(trfi_id)
REFERENCES TarifaItem (trfi_id)
;
-- FK_PresupuestoEnvioItem_TarifaItem
;
/****** Object:  ForeignKey FK_PresupuestoEnvioItem_Transporte    Script Date: 07/30/2012 17:24:17 ******/
ALTER TABLE PresupuestoEnvioItem  ADD  CONSTRAINT FK_PresupuestoEnvioItem_Transporte FOREIGN KEY(trans_id)
REFERENCES Transporte (trans_id)
;
-- FK_PresupuestoEnvioItem_Transporte
;
/****** Object:  ForeignKey FK_PresupuestoEnvioItemBorradoTMP_PresupuestoEnvioTMP    Script Date: 07/30/2012 17:24:18 ******/
ALTER TABLE PresupuestoEnvioItemBorradoTMP  ADD  CONSTRAINT FK_PresupuestoEnvioItemBorradoTMP_PresupuestoEnvioTMP FOREIGN KEY(preeTMP_id)
REFERENCES PresupuestoEnvioTMP (preeTMP_id)
;
-- FK_PresupuestoEnvioItemBorradoTMP_PresupuestoEnvioTMP
;
/****** Object:  ForeignKey FK_PresupuestoEnvioItemTMP_PresupuestoEnvioTMP    Script Date: 07/30/2012 17:24:24 ******/
ALTER TABLE PresupuestoEnvioItemTMP  ADD  CONSTRAINT FK_PresupuestoEnvioItemTMP_PresupuestoEnvioTMP FOREIGN KEY(preeTMP_id)
REFERENCES PresupuestoEnvioTMP (preeTMP_id)
;
-- FK_PresupuestoEnvioItemTMP_PresupuestoEnvioTMP
;
/****** Object:  ForeignKey FK_PresupuestoPedidoVenta_PedidoVentaItem    Script Date: 07/30/2012 17:24:31 ******/
ALTER TABLE PresupuestoPedidoVenta  ADD  CONSTRAINT FK_PresupuestoPedidoVenta_PedidoVentaItem FOREIGN KEY(pvi_id)
REFERENCES PedidoVentaItem (pvi_id)
;
-- FK_PresupuestoPedidoVenta_PedidoVentaItem
;
/****** Object:  ForeignKey FK_PresupuestoPedidoVenta_PresupuestoVentaItem    Script Date: 07/30/2012 17:24:31 ******/
ALTER TABLE PresupuestoPedidoVenta  ADD  CONSTRAINT FK_PresupuestoPedidoVenta_PresupuestoVentaItem FOREIGN KEY(prvi_id)
REFERENCES PresupuestoVentaItem (prvi_id)
;
-- FK_PresupuestoPedidoVenta_PresupuestoVentaItem
;
/****** Object:  ForeignKey FK_PresupuestoVenta_CentroCosto    Script Date: 07/30/2012 17:24:41 ******/
ALTER TABLE PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PresupuestoVenta_CentroCosto
;
/****** Object:  ForeignKey FK_PresupuestoVenta_Cliente    Script Date: 07/30/2012 17:24:41 ******/
ALTER TABLE PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_PresupuestoVenta_Cliente
;
/****** Object:  ForeignKey FK_PresupuestoVenta_ClienteSucursal    Script Date: 07/30/2012 17:24:41 ******/
ALTER TABLE PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_ClienteSucursal FOREIGN KEY(clis_id)
REFERENCES ClienteSucursal (clis_id)
;
-- FK_PresupuestoVenta_ClienteSucursal
;
/****** Object:  ForeignKey FK_PresupuestoVenta_CondicionPago    Script Date: 07/30/2012 17:24:41 ******/
ALTER TABLE PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_CondicionPago FOREIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_PresupuestoVenta_CondicionPago
;
/****** Object:  ForeignKey FK_PresupuestoVenta_Documento    Script Date: 07/30/2012 17:24:41 ******/
ALTER TABLE PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_PresupuestoVenta_Documento
;
/****** Object:  ForeignKey FK_PresupuestoVenta_DocumentoTipo    Script Date: 07/30/2012 17:24:41 ******/
ALTER TABLE PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_PresupuestoVenta_DocumentoTipo
;
/****** Object:  ForeignKey FK_PresupuestoVenta_Empresa    Script Date: 07/30/2012 17:24:42 ******/
ALTER TABLE PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_PresupuestoVenta_Empresa
;
/****** Object:  ForeignKey FK_PresupuestoVenta_Legajo    Script Date: 07/30/2012 17:24:42 ******/
ALTER TABLE PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_PresupuestoVenta_Legajo
;
/****** Object:  ForeignKey FK_PresupuestoVenta_ListaDescuento    Script Date: 07/30/2012 17:24:42 ******/
ALTER TABLE PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_ListaDescuento FOREIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_PresupuestoVenta_ListaDescuento
;
/****** Object:  ForeignKey FK_PresupuestoVenta_ListaPrecio    Script Date: 07/30/2012 17:24:42 ******/
ALTER TABLE PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_ListaPrecio FOREIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_PresupuestoVenta_ListaPrecio
;
/****** Object:  ForeignKey FK_PresupuestoVenta_ProvinciaDestino    Script Date: 07/30/2012 17:24:42 ******/
ALTER TABLE PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_ProvinciaDestino FOREIGN KEY(pro_id_destino)
REFERENCES Provincia (pro_id)
;
-- FK_PresupuestoVenta_ProvinciaDestino
;
/****** Object:  ForeignKey FK_PresupuestoVenta_ProvinciaOrigen    Script Date: 07/30/2012 17:24:42 ******/
ALTER TABLE PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_ProvinciaOrigen FOREIGN KEY(pro_id_origen)
REFERENCES Provincia (pro_id)
;
-- FK_PresupuestoVenta_ProvinciaOrigen
;
/****** Object:  ForeignKey FK_PresupuestoVenta_Transporte    Script Date: 07/30/2012 17:24:42 ******/
ALTER TABLE PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_Transporte FOREIGN KEY(trans_id)
REFERENCES Transporte (trans_id)
;
-- FK_PresupuestoVenta_Transporte
;
/****** Object:  ForeignKey FK_PresupuestoVenta_Usuario    Script Date: 07/30/2012 17:24:42 ******/
ALTER TABLE PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_PresupuestoVenta_Usuario
;
/****** Object:  ForeignKey FK_PresupuestoVenta_Vendedor    Script Date: 07/30/2012 17:24:42 ******/
ALTER TABLE PresupuestoVenta  ADD  CONSTRAINT FK_PresupuestoVenta_Vendedor FOREIGN KEY(ven_id)
REFERENCES Vendedor (ven_id)
;
-- FK_PresupuestoVenta_Vendedor
;
/****** Object:  ForeignKey FK_PresupuestoVentaItem_CentroCosto    Script Date: 07/30/2012 17:24:47 ******/
ALTER TABLE PresupuestoVentaItem  ADD  CONSTRAINT FK_PresupuestoVentaItem_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_PresupuestoVentaItem_CentroCosto
;
/****** Object:  ForeignKey FK_PresupuestoVentaItem_PresupuestoVenta    Script Date: 07/30/2012 17:24:47 ******/
ALTER TABLE PresupuestoVentaItem  ADD  CONSTRAINT FK_PresupuestoVentaItem_PresupuestoVenta FOREIGN KEY(prv_id)
REFERENCES PresupuestoVenta (prv_id)
;
-- FK_PresupuestoVentaItem_PresupuestoVenta
;
/****** Object:  ForeignKey FK_PresupuestoVentaItem_Producto    Script Date: 07/30/2012 17:24:47 ******/
ALTER TABLE PresupuestoVentaItem  ADD  CONSTRAINT FK_PresupuestoVentaItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_PresupuestoVentaItem_Producto
;
/****** Object:  ForeignKey FK_PresupuestoVentaItemBorradoTMP_PresupuestoVentaTMP    Script Date: 07/30/2012 17:24:48 ******/
ALTER TABLE PresupuestoVentaItemBorradoTMP  ADD  CONSTRAINT FK_PresupuestoVentaItemBorradoTMP_PresupuestoVentaTMP FOREIGN KEY(prvTMP_id)
REFERENCES PresupuestoVentaTMP (prvTMP_id)
;
-- FK_PresupuestoVentaItemBorradoTMP_PresupuestoVentaTMP
;
/****** Object:  ForeignKey FK_PresupuestoVentaItemTMP_PresupuestoVentaTMP    Script Date: 07/30/2012 17:24:53 ******/
ALTER TABLE PresupuestoVentaItemTMP  ADD  CONSTRAINT FK_PresupuestoVentaItemTMP_PresupuestoVentaTMP FOREIGN KEY(prvTMP_id)
REFERENCES PresupuestoVentaTMP (prvTMP_id)
;
-- FK_PresupuestoVentaItemTMP_PresupuestoVentaTMP
;
/****** Object:  ForeignKey FK_Prioridad_Usuario    Script Date: 07/30/2012 17:25:01 ******/
ALTER TABLE Prioridad  ADD  CONSTRAINT FK_Prioridad_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Prioridad_Usuario
;
/****** Object:  ForeignKey FK_Producto_CentroCostoCompra    Script Date: 07/30/2012 17:25:24 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_CentroCostoCompra FOREIGN KEY(ccos_id_compra)
REFERENCES CentroCosto (ccos_id)
;
-- FK_Producto_CentroCostoCompra
;
/****** Object:  ForeignKey FK_Producto_CentroCostoVenta    Script Date: 07/30/2012 17:25:24 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_CentroCostoVenta FOREIGN KEY(ccos_id_venta)
REFERENCES CentroCosto (ccos_id)
;
-- FK_Producto_CentroCostoVenta
;
/****** Object:  ForeignKey FK_Producto_CuentaGrupoCompra    Script Date: 07/30/2012 17:25:24 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_CuentaGrupoCompra FOREIGN KEY(cueg_id_compra)
REFERENCES CuentaGrupo (cueg_id)
;
-- FK_Producto_CuentaGrupoCompra
;
/****** Object:  ForeignKey FK_Producto_CuentaGrupoVenta    Script Date: 07/30/2012 17:25:24 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_CuentaGrupoVenta FOREIGN KEY(cueg_id_venta)
REFERENCES CuentaGrupo (cueg_id)
;
-- FK_Producto_CuentaGrupoVenta
;
/****** Object:  ForeignKey FK_Producto_Curso    Script Date: 07/30/2012 17:25:24 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_Curso FOREIGN KEY(cur_id)
REFERENCES Curso (cur_id)
;
-- FK_Producto_Curso
;
/****** Object:  ForeignKey FK_Producto_Embalaje    Script Date: 07/30/2012 17:25:25 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_Embalaje FOREIGN KEY(embl_id)
REFERENCES Embalaje (embl_id)
;
-- FK_Producto_Embalaje
;
/****** Object:  ForeignKey FK_Producto_ExpoFamilia    Script Date: 07/30/2012 17:25:25 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_ExpoFamilia FOREIGN KEY(efm_id)
REFERENCES ExpoFamilia (efm_id)
;
-- FK_Producto_ExpoFamilia
;
/****** Object:  ForeignKey FK_Producto_ExpoGrupoPrecio    Script Date: 07/30/2012 17:25:25 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_ExpoGrupoPrecio FOREIGN KEY(egp_id)
REFERENCES ExpoGrupoPrecio (egp_id)
;
-- FK_Producto_ExpoGrupoPrecio
;
/****** Object:  ForeignKey FK_Producto_IngresosBrutosCategoria    Script Date: 07/30/2012 17:25:25 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_IngresosBrutosCategoria FOREIGN KEY(ibc_id)
REFERENCES IngresosBrutosCategoria (ibc_id)
;
-- FK_Producto_IngresosBrutosCategoria
;
/****** Object:  ForeignKey FK_Producto_Marca    Script Date: 07/30/2012 17:25:25 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_Marca FOREIGN KEY(marc_id)
REFERENCES Marca (marc_id)
;
-- FK_Producto_Marca
;
/****** Object:  ForeignKey FK_Producto_Producto    Script Date: 07/30/2012 17:25:25 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_Producto FOREIGN KEY(pr_id_webpadre)
REFERENCES Producto (pr_id)
;
-- FK_Producto_Producto
;
/****** Object:  ForeignKey FK_Producto_ReporteNombreCompra    Script Date: 07/30/2012 17:25:25 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_ReporteNombreCompra FOREIGN KEY(rpt_id_nombrecompra)
REFERENCES Reporte (rpt_id)
;
-- FK_Producto_ReporteNombreCompra
;
/****** Object:  ForeignKey FK_Producto_ReporteNombreFactura    Script Date: 07/30/2012 17:25:25 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_ReporteNombreFactura FOREIGN KEY(rpt_id_nombrefactura)
REFERENCES Reporte (rpt_id)
;
-- FK_Producto_ReporteNombreFactura
;
/****** Object:  ForeignKey FK_Producto_ReporteNombreImg    Script Date: 07/30/2012 17:25:25 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_ReporteNombreImg FOREIGN KEY(rpt_id_nombreimg)
REFERENCES Reporte (rpt_id)
;
-- FK_Producto_ReporteNombreImg
;
/****** Object:  ForeignKey FK_Producto_ReporteNombreImgAlt    Script Date: 07/30/2012 17:25:26 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_ReporteNombreImgAlt FOREIGN KEY(rpt_id_nombreimgalt)
REFERENCES Reporte (rpt_id)
;
-- FK_Producto_ReporteNombreImgAlt
;
/****** Object:  ForeignKey FK_Producto_ReporteNombreVenta    Script Date: 07/30/2012 17:25:26 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_ReporteNombreVenta FOREIGN KEY(rpt_id_nombreventa)
REFERENCES Reporte (rpt_id)
;
-- FK_Producto_ReporteNombreVenta
;
/****** Object:  ForeignKey FK_Producto_ReporteNombreWeb    Script Date: 07/30/2012 17:25:26 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_ReporteNombreWeb FOREIGN KEY(rpt_id_nombreweb)
REFERENCES Reporte (rpt_id)
;
-- FK_Producto_ReporteNombreWeb
;
/****** Object:  ForeignKey FK_Producto_Rubro1    Script Date: 07/30/2012 17:25:26 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_Rubro1 FOREIGN KEY(rub_id)
REFERENCES Rubro (rub_id)
;
-- FK_Producto_Rubro1
;
/****** Object:  ForeignKey FK_Producto_RubroTablaItem    Script Date: 07/30/2012 17:25:26 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_RubroTablaItem FOREIGN KEY(rubti_id1)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Producto_RubroTablaItem
;
/****** Object:  ForeignKey FK_Producto_RubroTablaItem1    Script Date: 07/30/2012 17:25:26 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_RubroTablaItem1 FOREIGN KEY(rubti_id2)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Producto_RubroTablaItem1
;
/****** Object:  ForeignKey FK_Producto_RubroTablaItem2    Script Date: 07/30/2012 17:25:26 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_RubroTablaItem2 FOREIGN KEY(rubti_id3)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Producto_RubroTablaItem2
;
/****** Object:  ForeignKey FK_Producto_RubroTablaItem3    Script Date: 07/30/2012 17:25:26 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_RubroTablaItem3 FOREIGN KEY(rubti_id4)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Producto_RubroTablaItem3
;
/****** Object:  ForeignKey FK_Producto_RubroTablaItem4    Script Date: 07/30/2012 17:25:26 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_RubroTablaItem4 FOREIGN KEY(rubti_id5)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Producto_RubroTablaItem4
;
/****** Object:  ForeignKey FK_Producto_RubroTablaItem5    Script Date: 07/30/2012 17:25:27 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_RubroTablaItem5 FOREIGN KEY(rubti_id6)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Producto_RubroTablaItem5
;
/****** Object:  ForeignKey FK_Producto_RubroTablaItem6    Script Date: 07/30/2012 17:25:27 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_RubroTablaItem6 FOREIGN KEY(rubti_id7)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Producto_RubroTablaItem6
;
/****** Object:  ForeignKey FK_Producto_RubroTablaItem7    Script Date: 07/30/2012 17:25:27 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_RubroTablaItem7 FOREIGN KEY(rubti_id8)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Producto_RubroTablaItem7
;
/****** Object:  ForeignKey FK_Producto_RubroTablaItem8    Script Date: 07/30/2012 17:25:27 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_RubroTablaItem8 FOREIGN KEY(rubti_id9)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Producto_RubroTablaItem8
;
/****** Object:  ForeignKey FK_Producto_RubroTablaItem9    Script Date: 07/30/2012 17:25:27 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_RubroTablaItem9 FOREIGN KEY(rubti_id10)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Producto_RubroTablaItem9
;
/****** Object:  ForeignKey FK_Producto_Talonario_Lote    Script Date: 07/30/2012 17:25:27 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_Talonario_Lote FOREIGN KEY(ta_id_kitLote)
REFERENCES Talonario (ta_id)
;
-- FK_Producto_Talonario_Lote
;
/****** Object:  ForeignKey FK_Producto_Talonario_Serie    Script Date: 07/30/2012 17:25:27 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_Talonario_Serie FOREIGN KEY(ta_id_kitSerie)
REFERENCES Talonario (ta_id)
;
-- FK_Producto_Talonario_Serie
;
/****** Object:  ForeignKey FK_Producto_TasaImpositivaComexGanancias    Script Date: 07/30/2012 17:25:27 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_TasaImpositivaComexGanancias FOREIGN KEY(ti_id_comex_ganancias)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_Producto_TasaImpositivaComexGanancias
;
/****** Object:  ForeignKey FK_Producto_TasaImpositivaComexIGB    Script Date: 07/30/2012 17:25:27 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_TasaImpositivaComexIGB FOREIGN KEY(ti_id_comex_igb)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_Producto_TasaImpositivaComexIGB
;
/****** Object:  ForeignKey FK_Producto_TasaImpositivaInternosC    Script Date: 07/30/2012 17:25:27 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_TasaImpositivaInternosC FOREIGN KEY(ti_id_internosc)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_Producto_TasaImpositivaInternosC
;
/****** Object:  ForeignKey FK_Producto_TasaImpositivaInternosV    Script Date: 07/30/2012 17:25:27 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_TasaImpositivaInternosV FOREIGN KEY(ti_id_internosv)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_Producto_TasaImpositivaInternosV
;
/****** Object:  ForeignKey FK_Producto_TasaImpositivaIvaComex    Script Date: 07/30/2012 17:25:28 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_TasaImpositivaIvaComex FOREIGN KEY(ti_id_comex_iva)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_Producto_TasaImpositivaIvaComex
;
/****** Object:  ForeignKey FK_Producto_TasaImpositivaRICompra    Script Date: 07/30/2012 17:25:28 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_TasaImpositivaRICompra FOREIGN KEY(ti_id_ivaricompra)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_Producto_TasaImpositivaRICompra
;
/****** Object:  ForeignKey FK_Producto_TasaImpositivaRIVenta    Script Date: 07/30/2012 17:25:28 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_TasaImpositivaRIVenta FOREIGN KEY(ti_id_ivariventa)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_Producto_TasaImpositivaRIVenta
;
/****** Object:  ForeignKey FK_Producto_TasaImpositivaRNICompra    Script Date: 07/30/2012 17:25:28 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_TasaImpositivaRNICompra FOREIGN KEY(ti_id_ivarnicompra)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_Producto_TasaImpositivaRNICompra
;
/****** Object:  ForeignKey FK_Producto_TasaImpositivaRNIVenta    Script Date: 07/30/2012 17:25:28 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_TasaImpositivaRNIVenta FOREIGN KEY(ti_id_ivarniventa)
REFERENCES TasaImpositiva (ti_id)
;
-- FK_Producto_TasaImpositivaRNIVenta
;
/****** Object:  ForeignKey FK_Producto_UnCompra    Script Date: 07/30/2012 17:25:28 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_UnCompra FOREIGN KEY(un_id_compra)
REFERENCES Unidad (un_id)
;
-- FK_Producto_UnCompra
;
/****** Object:  ForeignKey FK_Producto_UnidadPeso    Script Date: 07/30/2012 17:25:28 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_UnidadPeso FOREIGN KEY(un_id_peso)
REFERENCES Unidad (un_id)
;
-- FK_Producto_UnidadPeso
;
/****** Object:  ForeignKey FK_Producto_UnStock    Script Date: 07/30/2012 17:25:28 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_UnStock FOREIGN KEY(un_id_stock)
REFERENCES Unidad (un_id)
;
-- FK_Producto_UnStock
;
/****** Object:  ForeignKey FK_Producto_UnVenta    Script Date: 07/30/2012 17:25:28 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_UnVenta FOREIGN KEY(un_id_venta)
REFERENCES Unidad (un_id)
;
-- FK_Producto_UnVenta
;
/****** Object:  ForeignKey FK_Producto_Usuario    Script Date: 07/30/2012 17:25:28 ******/
ALTER TABLE Producto  ADD  CONSTRAINT FK_Producto_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Producto_Usuario
;
/****** Object:  ForeignKey FK_ProductoBOM_Usuario    Script Date: 07/30/2012 17:25:32 ******/
ALTER TABLE ProductoBOM  ADD  CONSTRAINT FK_ProductoBOM_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ProductoBOM_Usuario
;
/****** Object:  ForeignKey FK_ProductoBOMElaborado_Producto    Script Date: 07/30/2012 17:25:34 ******/
ALTER TABLE ProductoBOMElaborado  ADD  CONSTRAINT FK_ProductoBOMElaborado_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoBOMElaborado_Producto
;
/****** Object:  ForeignKey FK_ProductoBOMElaborado_ProductoBOM    Script Date: 07/30/2012 17:25:34 ******/
ALTER TABLE ProductoBOMElaborado  ADD  CONSTRAINT FK_ProductoBOMElaborado_ProductoBOM FOREIGN KEY(pbm_id)
REFERENCES ProductoBOM (pbm_id)
;
-- FK_ProductoBOMElaborado_ProductoBOM
;
/****** Object:  ForeignKey FK_ProductoBOMItem_Producto    Script Date: 07/30/2012 17:25:37 ******/
ALTER TABLE ProductoBOMItem  ADD  CONSTRAINT FK_ProductoBOMItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoBOMItem_Producto
;
/****** Object:  ForeignKey FK_ProductoBOMItem_ProductoBOM    Script Date: 07/30/2012 17:25:37 ******/
ALTER TABLE ProductoBOMItem  ADD  CONSTRAINT FK_ProductoBOMItem_ProductoBOM FOREIGN KEY(pbm_id)
REFERENCES ProductoBOM (pbm_id)
;
-- FK_ProductoBOMItem_ProductoBOM
;
/****** Object:  ForeignKey FK_ProductoBOMItem_ProductoBOMItemTipo    Script Date: 07/30/2012 17:25:37 ******/
ALTER TABLE ProductoBOMItem  ADD  CONSTRAINT FK_ProductoBOMItem_ProductoBOMItemTipo FOREIGN KEY(pbmit_id)
REFERENCES ProductoBOMItemTipo (pbmit_id)
;
-- FK_ProductoBOMItem_ProductoBOMItemTipo
;
/****** Object:  ForeignKey FK_ProductoBOMItemA_Producto    Script Date: 07/30/2012 17:25:38 ******/
ALTER TABLE ProductoBOMItemA  ADD  CONSTRAINT FK_ProductoBOMItemA_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoBOMItemA_Producto
;
/****** Object:  ForeignKey FK_ProductoBOMItemA_ProductoBOMItem    Script Date: 07/30/2012 17:25:38 ******/
ALTER TABLE ProductoBOMItemA  ADD  CONSTRAINT FK_ProductoBOMItemA_ProductoBOMItem FOREIGN KEY(pbmi_id)
REFERENCES ProductoBOMItem (pbmi_id)
;
-- FK_ProductoBOMItemA_ProductoBOMItem
;
/****** Object:  ForeignKey FK_ProductoCliente_Cliente    Script Date: 07/30/2012 17:25:41 ******/
ALTER TABLE ProductoCliente  ADD  CONSTRAINT FK_ProductoCliente_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_ProductoCliente_Cliente
;
/****** Object:  ForeignKey FK_ProductoCliente_Producto    Script Date: 07/30/2012 17:25:41 ******/
ALTER TABLE ProductoCliente  ADD  CONSTRAINT FK_ProductoCliente_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoCliente_Producto
;
/****** Object:  ForeignKey FK_ProductoComunidadInternet_ComunidadInternet    Script Date: 07/30/2012 17:25:43 ******/
ALTER TABLE ProductoComunidadInternet  ADD  CONSTRAINT FK_ProductoComunidadInternet_ComunidadInternet FOREIGN KEY(cmi_id)
REFERENCES ComunidadInternet (cmi_id)
;
-- FK_ProductoComunidadInternet_ComunidadInternet
;
/****** Object:  ForeignKey FK_ProductoComunidadInternet_Producto    Script Date: 07/30/2012 17:25:43 ******/
ALTER TABLE ProductoComunidadInternet  ADD  CONSTRAINT FK_ProductoComunidadInternet_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoComunidadInternet_Producto
;
/****** Object:  ForeignKey FK_ProductoDepositoEntrega_DepositoLogico    Script Date: 07/30/2012 17:25:45 ******/
ALTER TABLE ProductoDepositoEntrega  ADD  CONSTRAINT FK_ProductoDepositoEntrega_DepositoLogico FOREIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_ProductoDepositoEntrega_DepositoLogico
;
/****** Object:  ForeignKey FK_ProductoDepositoEntrega_Empresa    Script Date: 07/30/2012 17:25:45 ******/
ALTER TABLE ProductoDepositoEntrega  ADD  CONSTRAINT FK_ProductoDepositoEntrega_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_ProductoDepositoEntrega_Empresa
;
/****** Object:  ForeignKey FK_ProductoDepositoEntrega_Producto    Script Date: 07/30/2012 17:25:45 ******/
ALTER TABLE ProductoDepositoEntrega  ADD  CONSTRAINT FK_ProductoDepositoEntrega_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoDepositoEntrega_Producto
;
/****** Object:  ForeignKey FK_ProductoDepositoEntrega_Sucursal    Script Date: 07/30/2012 17:25:45 ******/
ALTER TABLE ProductoDepositoEntrega  ADD  CONSTRAINT FK_ProductoDepositoEntrega_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_ProductoDepositoEntrega_Sucursal
;
/****** Object:  ForeignKey FK_ProductoDepositoFisico_DepositoFisico    Script Date: 07/30/2012 17:25:47 ******/
ALTER TABLE ProductoDepositoFisico  ADD  CONSTRAINT FK_ProductoDepositoFisico_DepositoFisico FOREIGN KEY(depf_id)
REFERENCES DepositoFisico (depf_id)
;
-- FK_ProductoDepositoFisico_DepositoFisico
;
/****** Object:  ForeignKey FK_ProductoDepositoFisico_Producto    Script Date: 07/30/2012 17:25:48 ******/
ALTER TABLE ProductoDepositoFisico  ADD  CONSTRAINT FK_ProductoDepositoFisico_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoDepositoFisico_Producto
;
/****** Object:  ForeignKey FK_ProductoDepositoLogico_DepositoLogico    Script Date: 07/30/2012 17:25:50 ******/
ALTER TABLE ProductoDepositoLogico  ADD  CONSTRAINT FK_ProductoDepositoLogico_DepositoLogico FOREIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_ProductoDepositoLogico_DepositoLogico
;
/****** Object:  ForeignKey FK_ProductoDepositoLogico_Producto    Script Date: 07/30/2012 17:25:50 ******/
ALTER TABLE ProductoDepositoLogico  ADD  CONSTRAINT FK_ProductoDepositoLogico_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoDepositoLogico_Producto
;
/****** Object:  ForeignKey FK_ProductoFormulaKit_Producto    Script Date: 07/30/2012 17:25:53 ******/
ALTER TABLE ProductoFormulaKit  ADD  CONSTRAINT FK_ProductoFormulaKit_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoFormulaKit_Producto
;
/****** Object:  ForeignKey FK_ProductoFormulaKit_ProductoLote    Script Date: 07/30/2012 17:25:53 ******/
ALTER TABLE ProductoFormulaKit  ADD  CONSTRAINT FK_ProductoFormulaKit_ProductoLote FOREIGN KEY(pr_id_lote)
REFERENCES Producto (pr_id)
;
-- FK_ProductoFormulaKit_ProductoLote
;
/****** Object:  ForeignKey FK_ProductoFormulaKit_ProductoSerie    Script Date: 07/30/2012 17:25:53 ******/
ALTER TABLE ProductoFormulaKit  ADD  CONSTRAINT FK_ProductoFormulaKit_ProductoSerie FOREIGN KEY(pr_id_serie)
REFERENCES Producto (pr_id)
;
-- FK_ProductoFormulaKit_ProductoSerie
;
/****** Object:  ForeignKey FK_ProductoKit_ProductoFormulaKit    Script Date: 07/30/2012 17:25:58 ******/
ALTER TABLE ProductoKit  ADD  CONSTRAINT FK_ProductoKit_ProductoFormulaKit FOREIGN KEY(prfk_id)
REFERENCES ProductoFormulaKit (prfk_id)
;
-- FK_ProductoKit_ProductoFormulaKit
;
/****** Object:  ForeignKey FK_ProductoKit_ProductoItem    Script Date: 07/30/2012 17:25:58 ******/
ALTER TABLE ProductoKit  ADD  CONSTRAINT FK_ProductoKit_ProductoItem FOREIGN KEY(pr_id_item)
REFERENCES Producto (pr_id)
;
-- FK_ProductoKit_ProductoItem
;
/****** Object:  ForeignKey FK_ProductoKit_Usuario    Script Date: 07/30/2012 17:25:58 ******/
ALTER TABLE ProductoKit  ADD  CONSTRAINT FK_ProductoKit_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ProductoKit_Usuario
;
/****** Object:  ForeignKey FK_ProductoKitItemA_Producto    Script Date: 07/30/2012 17:25:59 ******/
ALTER TABLE ProductoKitItemA  ADD  CONSTRAINT FK_ProductoKitItemA_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoKitItemA_Producto
;
/****** Object:  ForeignKey FK_ProductoKitItemA_ProductoKit    Script Date: 07/30/2012 17:25:59 ******/
ALTER TABLE ProductoKitItemA  ADD  CONSTRAINT FK_ProductoKitItemA_ProductoKit FOREIGN KEY(prk_id)
REFERENCES ProductoKit (prk_id)
;
-- FK_ProductoKitItemA_ProductoKit
;
/****** Object:  ForeignKey FK_ProductoLeyenda_Producto    Script Date: 07/30/2012 17:26:01 ******/
ALTER TABLE ProductoLeyenda  ADD  CONSTRAINT FK_ProductoLeyenda_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoLeyenda_Producto
;
/****** Object:  ForeignKey FK_ProductoNumeroSerie_Cliente    Script Date: 07/30/2012 17:26:06 ******/
ALTER TABLE ProductoNumeroSerie  ADD  CONSTRAINT FK_ProductoNumeroSerie_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_ProductoNumeroSerie_Cliente
;
/****** Object:  ForeignKey FK_ProductoNumeroSerie_DepositoLogico    Script Date: 07/30/2012 17:26:06 ******/
ALTER TABLE ProductoNumeroSerie  ADD  CONSTRAINT FK_ProductoNumeroSerie_DepositoLogico FOREIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_ProductoNumeroSerie_DepositoLogico
;
/****** Object:  ForeignKey FK_ProductoNumeroSerie_ParteProdKit    Script Date: 07/30/2012 17:26:07 ******/
ALTER TABLE ProductoNumeroSerie  ADD  CONSTRAINT FK_ProductoNumeroSerie_ParteProdKit FOREIGN KEY(ppk_id)
REFERENCES ParteProdKit (ppk_id)
;
-- FK_ProductoNumeroSerie_ParteProdKit
;
/****** Object:  ForeignKey FK_ProductoNumeroSerie_Producto    Script Date: 07/30/2012 17:26:07 ******/
ALTER TABLE ProductoNumeroSerie  ADD  CONSTRAINT FK_ProductoNumeroSerie_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoNumeroSerie_Producto
;
/****** Object:  ForeignKey FK_ProductoNumeroSerie_Producto1    Script Date: 07/30/2012 17:26:07 ******/
ALTER TABLE ProductoNumeroSerie  ADD  CONSTRAINT FK_ProductoNumeroSerie_Producto1 FOREIGN KEY(pr_id_kit)
REFERENCES Producto (pr_id)
;
-- FK_ProductoNumeroSerie_Producto1
;
/****** Object:  ForeignKey FK_ProductoNumeroSerie_ProductoNumeroSerie    Script Date: 07/30/2012 17:26:07 ******/
ALTER TABLE ProductoNumeroSerie  ADD  CONSTRAINT FK_ProductoNumeroSerie_ProductoNumeroSerie FOREIGN KEY(prns_id_historia)
REFERENCES ProductoNumeroSerie (prns_id)
;
-- FK_ProductoNumeroSerie_ProductoNumeroSerie
;
/****** Object:  ForeignKey FK_ProductoNumeroSerie_ProductoSerieKit    Script Date: 07/30/2012 17:26:07 ******/
ALTER TABLE ProductoNumeroSerie  ADD  CONSTRAINT FK_ProductoNumeroSerie_ProductoSerieKit FOREIGN KEY(prsk_id)
REFERENCES ProductoSerieKit (prsk_id)
;
-- FK_ProductoNumeroSerie_ProductoSerieKit
;
/****** Object:  ForeignKey FK_ProductoNumeroSerie_Proveedor    Script Date: 07/30/2012 17:26:07 ******/
ALTER TABLE ProductoNumeroSerie  ADD  CONSTRAINT FK_ProductoNumeroSerie_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_ProductoNumeroSerie_Proveedor
;
/****** Object:  ForeignKey FK_ProductoNumeroSerie_StockLote    Script Date: 07/30/2012 17:26:07 ******/
ALTER TABLE ProductoNumeroSerie  ADD  CONSTRAINT FK_ProductoNumeroSerie_StockLote FOREIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_ProductoNumeroSerie_StockLote
;
/****** Object:  ForeignKey FK_ProductoNumeroSerie_Tarea    Script Date: 07/30/2012 17:26:07 ******/
ALTER TABLE ProductoNumeroSerie  ADD  CONSTRAINT FK_ProductoNumeroSerie_Tarea FOREIGN KEY(tar_id)
REFERENCES Tarea (tar_id)
;
-- FK_ProductoNumeroSerie_Tarea
;
/****** Object:  ForeignKey FK_ProductoNumeroSerie_Usuario    Script Date: 07/30/2012 17:26:07 ******/
ALTER TABLE ProductoNumeroSerie  ADD  CONSTRAINT FK_ProductoNumeroSerie_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ProductoNumeroSerie_Usuario
;
/****** Object:  ForeignKey FK__ProductoProveedor_Pais    Script Date: 07/30/2012 17:26:19 ******/
ALTER TABLE ProductoProveedor  ADD  CONSTRAINT FK__ProductoProveedor_Pais FOREIGN KEY(pa_id)
REFERENCES Pais (pa_id)
;
-- FK__ProductoProveedor_Pais
;
/****** Object:  ForeignKey FK_ProductoProveedor_Producto    Script Date: 07/30/2012 17:26:19 ******/
ALTER TABLE ProductoProveedor  ADD  CONSTRAINT FK_ProductoProveedor_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProductoProveedor_Producto
;
/****** Object:  ForeignKey FK_ProductoProveedor_Proveedor    Script Date: 07/30/2012 17:26:19 ******/
ALTER TABLE ProductoProveedor  ADD  CONSTRAINT FK_ProductoProveedor_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_ProductoProveedor_Proveedor
;
/****** Object:  ForeignKey FK_ProductoProveedor_Usuario    Script Date: 07/30/2012 17:26:19 ******/
ALTER TABLE ProductoProveedor  ADD  CONSTRAINT FK_ProductoProveedor_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ProductoProveedor_Usuario
;
/****** Object:  ForeignKey FK_ProductoSerieKit_ParteProdKitItem    Script Date: 07/30/2012 17:26:21 ******/
ALTER TABLE ProductoSerieKit  ADD  CONSTRAINT FK_ProductoSerieKit_ParteProdKitItem FOREIGN KEY(ppki_id)
REFERENCES ParteProdKitItem (ppki_id)
;
-- FK_ProductoSerieKit_ParteProdKitItem
;
/****** Object:  ForeignKey FK_ProductoSerieKit_ParteProdKitItem1    Script Date: 07/30/2012 17:26:21 ******/
ALTER TABLE ProductoSerieKit  ADD  CONSTRAINT FK_ProductoSerieKit_ParteProdKitItem1 FOREIGN KEY(ppki_id_desarme)
REFERENCES ParteProdKitItem (ppki_id)
;
-- FK_ProductoSerieKit_ParteProdKitItem1
;
/****** Object:  ForeignKey FK_ProductoSerieKit_ProductoFormulaKit    Script Date: 07/30/2012 17:26:21 ******/
ALTER TABLE ProductoSerieKit  ADD  CONSTRAINT FK_ProductoSerieKit_ProductoFormulaKit FOREIGN KEY(prfk_id)
REFERENCES ProductoFormulaKit (prfk_id)
;
-- FK_ProductoSerieKit_ProductoFormulaKit
;
/****** Object:  ForeignKey FK_ProductoSerieKit_ProductoNumeroSerie    Script Date: 07/30/2012 17:26:21 ******/
ALTER TABLE ProductoSerieKit  ADD  CONSTRAINT FK_ProductoSerieKit_ProductoNumeroSerie FOREIGN KEY(prns_id)
REFERENCES ProductoNumeroSerie (prns_id)
;
-- FK_ProductoSerieKit_ProductoNumeroSerie
;
/****** Object:  ForeignKey FK_ProductoSerieKit_StockLote    Script Date: 07/30/2012 17:26:21 ******/
ALTER TABLE ProductoSerieKit  ADD  CONSTRAINT FK_ProductoSerieKit_StockLote FOREIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_ProductoSerieKit_StockLote
;
/****** Object:  ForeignKey FK_ProductoSerieKitBorradoTMP_ParteProdKitTMP    Script Date: 07/30/2012 17:26:22 ******/
ALTER TABLE ProductoSerieKitBorradoTMP  ADD  CONSTRAINT FK_ProductoSerieKitBorradoTMP_ParteProdKitTMP FOREIGN KEY(ppkTMP_id)
REFERENCES ParteProdKitTMP (ppkTMP_id)
;
-- FK_ProductoSerieKitBorradoTMP_ParteProdKitTMP
;
/****** Object:  ForeignKey FK_ProductoSerieKitItem_ProductoKit    Script Date: 07/30/2012 17:26:24 ******/
ALTER TABLE ProductoSerieKitItem  ADD  CONSTRAINT FK_ProductoSerieKitItem_ProductoKit FOREIGN KEY(prk_id)
REFERENCES ProductoKit (prk_id)
;
-- FK_ProductoSerieKitItem_ProductoKit
;
/****** Object:  ForeignKey FK_ProductoSerieKitItem_ProductoNumeroSerie    Script Date: 07/30/2012 17:26:24 ******/
ALTER TABLE ProductoSerieKitItem  ADD  CONSTRAINT FK_ProductoSerieKitItem_ProductoNumeroSerie FOREIGN KEY(prns_id)
REFERENCES ProductoNumeroSerie (prns_id)
;
-- FK_ProductoSerieKitItem_ProductoNumeroSerie
;
/****** Object:  ForeignKey FK_ProductoSerieKitItem_ProductoSerieKit    Script Date: 07/30/2012 17:26:24 ******/
ALTER TABLE ProductoSerieKitItem  ADD  CONSTRAINT FK_ProductoSerieKitItem_ProductoSerieKit FOREIGN KEY(prsk_id)
REFERENCES ProductoSerieKit (prsk_id)
;
-- FK_ProductoSerieKitItem_ProductoSerieKit
;
/****** Object:  ForeignKey FK_ProductoSerieKitItem_StockLote    Script Date: 07/30/2012 17:26:24 ******/
ALTER TABLE ProductoSerieKitItem  ADD  CONSTRAINT FK_ProductoSerieKitItem_StockLote FOREIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_ProductoSerieKitItem_StockLote
;
/****** Object:  ForeignKey FK_ProductoSerieKitItemTMP_ParteProdKitItemTMP    Script Date: 07/30/2012 17:26:26 ******/
ALTER TABLE ProductoSerieKitItemTMP  ADD  CONSTRAINT FK_ProductoSerieKitItemTMP_ParteProdKitItemTMP FOREIGN KEY(ppkiTMP_id)
REFERENCES ParteProdKitItemTMP (ppkiTMP_id)
;
-- FK_ProductoSerieKitItemTMP_ParteProdKitItemTMP
;
/****** Object:  ForeignKey FK_ProductoSerieKitItemTMP_ParteProdKitTMP    Script Date: 07/30/2012 17:26:26 ******/
ALTER TABLE ProductoSerieKitItemTMP  ADD  CONSTRAINT FK_ProductoSerieKitItemTMP_ParteProdKitTMP FOREIGN KEY(ppkTMP_id)
REFERENCES ParteProdKitTMP (ppkTMP_id)
;
-- FK_ProductoSerieKitItemTMP_ParteProdKitTMP
;
/****** Object:  ForeignKey FK_ProductoSerieKitItemTMP_ProductoSerieKitTMP    Script Date: 07/30/2012 17:26:26 ******/
ALTER TABLE ProductoSerieKitItemTMP  ADD  CONSTRAINT FK_ProductoSerieKitItemTMP_ProductoSerieKitTMP FOREIGN KEY(prskTMP_id)
REFERENCES ProductoSerieKitTMP (prskTMP_id)
;
-- FK_ProductoSerieKitItemTMP_ProductoSerieKitTMP
;
/****** Object:  ForeignKey FK_ProductoSerieKitTMP_ParteProdKitItemTMP    Script Date: 07/30/2012 17:26:28 ******/
ALTER TABLE ProductoSerieKitTMP  ADD  CONSTRAINT FK_ProductoSerieKitTMP_ParteProdKitItemTMP FOREIGN KEY(ppkiTMP_id)
REFERENCES ParteProdKitItemTMP (ppkiTMP_id)
;
-- FK_ProductoSerieKitTMP_ParteProdKitItemTMP
;
/****** Object:  ForeignKey FK_ProductoSerieKitTMP_ParteProdKitTMP    Script Date: 07/30/2012 17:26:29 ******/
ALTER TABLE ProductoSerieKitTMP  ADD  CONSTRAINT FK_ProductoSerieKitTMP_ParteProdKitTMP FOREIGN KEY(ppkTMP_id)
REFERENCES ParteProdKitTMP (ppkTMP_id)
;
-- FK_ProductoSerieKitTMP_ParteProdKitTMP
;
/****** Object:  ForeignKey FK_Profesor_Usuario    Script Date: 07/30/2012 17:26:36 ******/
ALTER TABLE Profesor  ADD  CONSTRAINT FK_Profesor_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Profesor_Usuario
;
/****** Object:  ForeignKey FK_Proveedor_CondicionPago    Script Date: 07/30/2012 17:26:46 ******/
ALTER TABLE Proveedor  ADD  CONSTRAINT FK_Proveedor_CondicionPago FOREIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_Proveedor_CondicionPago
;
/****** Object:  ForeignKey FK_Proveedor_ListaDescuento    Script Date: 07/30/2012 17:26:47 ******/
ALTER TABLE Proveedor  ADD  CONSTRAINT FK_Proveedor_ListaDescuento FOREIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_Proveedor_ListaDescuento
;
/****** Object:  ForeignKey FK_Proveedor_ListaPrecio    Script Date: 07/30/2012 17:26:47 ******/
ALTER TABLE Proveedor  ADD  CONSTRAINT FK_Proveedor_ListaPrecio FOREIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_Proveedor_ListaPrecio
;
/****** Object:  ForeignKey FK_Proveedor_Provincia    Script Date: 07/30/2012 17:26:47 ******/
ALTER TABLE Proveedor  ADD  CONSTRAINT FK_Proveedor_Provincia FOREIGN KEY(pro_id)
REFERENCES Provincia (pro_id)
;
-- FK_Proveedor_Provincia
;
/****** Object:  ForeignKey FK_Proveedor_Usuario    Script Date: 07/30/2012 17:26:47 ******/
ALTER TABLE Proveedor  ADD  CONSTRAINT FK_Proveedor_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Proveedor_Usuario
;
/****** Object:  ForeignKey FK_Proveedor_Usuario1    Script Date: 07/30/2012 17:26:47 ******/
ALTER TABLE Proveedor  ADD  CONSTRAINT FK_Proveedor_Usuario1 FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_Proveedor_Usuario1
;
/****** Object:  ForeignKey FK_Proveedor_Zona    Script Date: 07/30/2012 17:26:47 ******/
ALTER TABLE Proveedor  ADD  CONSTRAINT FK_Proveedor_Zona FOREIGN KEY(zon_id)
REFERENCES Zona (zon_id)
;
-- FK_Proveedor_Zona
;
/****** Object:  ForeignKey FK_ProveedorCacheCredito_Empresa    Script Date: 07/30/2012 17:26:48 ******/
ALTER TABLE ProveedorCacheCredito  ADD  CONSTRAINT FK_ProveedorCacheCredito_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_ProveedorCacheCredito_Empresa
;
/****** Object:  ForeignKey FK_ProveedorCacheCredito_Proveedor    Script Date: 07/30/2012 17:26:48 ******/
ALTER TABLE ProveedorCacheCredito  ADD  CONSTRAINT FK_ProveedorCacheCredito_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_ProveedorCacheCredito_Proveedor
;
/****** Object:  ForeignKey FK_ProveedorCAI_Proveedor    Script Date: 07/30/2012 17:26:51 ******/
ALTER TABLE ProveedorCAI  ADD  CONSTRAINT FK_ProveedorCAI_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_ProveedorCAI_Proveedor
;
/****** Object:  ForeignKey FK_ProveedorCAI_Usuario    Script Date: 07/30/2012 17:26:51 ******/
ALTER TABLE ProveedorCAI  ADD  CONSTRAINT FK_ProveedorCAI_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ProveedorCAI_Usuario
;
/****** Object:  ForeignKey FK_ProveedorCentroCosto_CentroCosto    Script Date: 07/30/2012 17:26:52 ******/
ALTER TABLE ProveedorCentroCosto  ADD  CONSTRAINT FK_ProveedorCentroCosto_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_ProveedorCentroCosto_CentroCosto
;
/****** Object:  ForeignKey FK_ProveedorCentroCosto_Producto    Script Date: 07/30/2012 17:26:52 ******/
ALTER TABLE ProveedorCentroCosto  ADD  CONSTRAINT FK_ProveedorCentroCosto_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProveedorCentroCosto_Producto
;
/****** Object:  ForeignKey FK_ProveedorCentroCosto_Proveedor    Script Date: 07/30/2012 17:26:52 ******/
ALTER TABLE ProveedorCentroCosto  ADD  CONSTRAINT FK_ProveedorCentroCosto_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_ProveedorCentroCosto_Proveedor
;
/****** Object:  ForeignKey FK_ProveedorCuentaGrupo_Cuenta    Script Date: 07/30/2012 17:26:54 ******/
ALTER TABLE ProveedorCuentaGrupo  ADD  CONSTRAINT FK_ProveedorCuentaGrupo_Cuenta FOREIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_ProveedorCuentaGrupo_Cuenta
;
/****** Object:  ForeignKey FK_ProveedorCuentaGrupo_CuentaGrupo    Script Date: 07/30/2012 17:26:54 ******/
ALTER TABLE ProveedorCuentaGrupo  ADD  CONSTRAINT FK_ProveedorCuentaGrupo_CuentaGrupo FOREIGN KEY(cueg_id)
REFERENCES CuentaGrupo (cueg_id)
;
-- FK_ProveedorCuentaGrupo_CuentaGrupo
;
/****** Object:  ForeignKey FK_ProveedorCuentaGrupo_Proveedor    Script Date: 07/30/2012 17:26:54 ******/
ALTER TABLE ProveedorCuentaGrupo  ADD  CONSTRAINT FK_ProveedorCuentaGrupo_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_ProveedorCuentaGrupo_Proveedor
;
/****** Object:  ForeignKey FK_ProveedorCuentaGrupo_Usuario    Script Date: 07/30/2012 17:26:54 ******/
ALTER TABLE ProveedorCuentaGrupo  ADD  CONSTRAINT FK_ProveedorCuentaGrupo_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ProveedorCuentaGrupo_Usuario
;
/****** Object:  ForeignKey FK_ProveedorPercepcion_Proveedor    Script Date: 07/30/2012 17:26:56 ******/
ALTER TABLE ProveedorRetencion  ADD  CONSTRAINT FK_ProveedorPercepcion_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_ProveedorPercepcion_Proveedor
;
/****** Object:  ForeignKey FK_ProveedorRetencion_Retencion    Script Date: 07/30/2012 17:26:56 ******/
ALTER TABLE ProveedorRetencion  ADD  CONSTRAINT FK_ProveedorRetencion_Retencion FOREIGN KEY(ret_id)
REFERENCES Retencion (ret_id)
;
-- FK_ProveedorRetencion_Retencion
;
/****** Object:  ForeignKey FK_Provincia_Pais    Script Date: 07/30/2012 17:26:59 ******/
ALTER TABLE Provincia  ADD  CONSTRAINT FK_Provincia_Pais FOREIGN KEY(pa_id)
REFERENCES Pais (pa_id)
;
-- FK_Provincia_Pais
;
/****** Object:  ForeignKey FK_Provincia_Usuario    Script Date: 07/30/2012 17:26:59 ******/
ALTER TABLE Provincia  ADD  CONSTRAINT FK_Provincia_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Provincia_Usuario
;
/****** Object:  ForeignKey FK_Proyecto_Cliente    Script Date: 07/30/2012 17:27:06 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_Proyecto_Cliente
;
/****** Object:  ForeignKey FK_Proyecto_PrestacionAddHora    Script Date: 07/30/2012 17:27:06 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionAddHora FOREIGN KEY(pre_id_addHora)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionAddHora
;
/****** Object:  ForeignKey FK_Proyecto_PrestacionAddTarea    Script Date: 07/30/2012 17:27:06 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionAddTarea FOREIGN KEY(pre_id_addTarea)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionAddTarea
;
/****** Object:  ForeignKey FK_Proyecto_PrestacionAprobarTarea    Script Date: 07/30/2012 17:27:06 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionAprobarTarea FOREIGN KEY(pre_id_aprobarTarea)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionAprobarTarea
;
/****** Object:  ForeignKey FK_Proyecto_PrestacionAsignarTarea    Script Date: 07/30/2012 17:27:06 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionAsignarTarea FOREIGN KEY(pre_id_asignarTarea)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionAsignarTarea
;
/****** Object:  ForeignKey FK_Proyecto_PrestacionDelHora    Script Date: 07/30/2012 17:27:07 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionDelHora FOREIGN KEY(pre_id_delHora)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionDelHora
;
/****** Object:  ForeignKey FK_Proyecto_PrestacionDelHoraP    Script Date: 07/30/2012 17:27:07 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionDelHoraP FOREIGN KEY(pre_id_delHoraP)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionDelHoraP
;
/****** Object:  ForeignKey FK_Proyecto_PrestacionDelTarea    Script Date: 07/30/2012 17:27:07 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionDelTarea FOREIGN KEY(pre_id_delTarea)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionDelTarea
;
/****** Object:  ForeignKey FK_Proyecto_PrestacionDelTareaD    Script Date: 07/30/2012 17:27:07 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionDelTareaD FOREIGN KEY(pre_id_delTareaD)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionDelTareaD
;
/****** Object:  ForeignKey FK_Proyecto_PrestacionDelTareaP    Script Date: 07/30/2012 17:27:07 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionDelTareaP FOREIGN KEY(pre_id_delTareaP)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionDelTareaP
;
/****** Object:  ForeignKey FK_Proyecto_PrestacionEditHora    Script Date: 07/30/2012 17:27:07 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionEditHora FOREIGN KEY(pre_id_editHora)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionEditHora
;
/****** Object:  ForeignKey FK_Proyecto_PrestacionEditHoraP    Script Date: 07/30/2012 17:27:07 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionEditHoraP FOREIGN KEY(pre_id_editHoraP)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionEditHoraP
;
/****** Object:  ForeignKey FK_Proyecto_PrestacionEditTarea    Script Date: 07/30/2012 17:27:07 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionEditTarea FOREIGN KEY(pre_id_editTarea)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionEditTarea
;
/****** Object:  ForeignKey FK_Proyecto_PrestacionEditTareaD    Script Date: 07/30/2012 17:27:08 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionEditTareaD FOREIGN KEY(pre_id_editTareaD)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionEditTareaD
;
/****** Object:  ForeignKey FK_Proyecto_PrestacionEditTareaP    Script Date: 07/30/2012 17:27:08 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionEditTareaP FOREIGN KEY(pre_id_editTareaP)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionEditTareaP
;
/****** Object:  ForeignKey FK_Proyecto_PrestacionListHora    Script Date: 07/30/2012 17:27:08 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionListHora FOREIGN KEY(pre_id_listHora)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionListHora
;
/****** Object:  ForeignKey FK_Proyecto_PrestacionListHoraD    Script Date: 07/30/2012 17:27:08 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionListHoraD FOREIGN KEY(pre_id_listHoraD)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionListHoraD
;
/****** Object:  ForeignKey FK_Proyecto_PrestacionListTarea    Script Date: 07/30/2012 17:27:08 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionListTarea FOREIGN KEY(pre_id_listTarea)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionListTarea
;
/****** Object:  ForeignKey FK_Proyecto_PrestacionListTareaD    Script Date: 07/30/2012 17:27:08 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionListTareaD FOREIGN KEY(pre_id_listTareaD)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionListTareaD
;
/****** Object:  ForeignKey FK_Proyecto_PrestacionTomarTarea    Script Date: 07/30/2012 17:27:08 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_PrestacionTomarTarea FOREIGN KEY(pre_id_tomarTarea)
REFERENCES Prestacion (pre_id)
;
-- FK_Proyecto_PrestacionTomarTarea
;
/****** Object:  ForeignKey FK_Proyecto_Producto    Script Date: 07/30/2012 17:27:08 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_Proyecto_Producto
;
/****** Object:  ForeignKey FK_Proyecto_Proveedor    Script Date: 07/30/2012 17:27:08 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_Proyecto_Proveedor
;
/****** Object:  ForeignKey FK_Proyecto_Proyecto    Script Date: 07/30/2012 17:27:08 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_Proyecto FOREIGN KEY(proy_id_padre)
REFERENCES Proyecto (proy_id)
;
-- FK_Proyecto_Proyecto
;
/****** Object:  ForeignKey FK_Proyecto_Talonario    Script Date: 07/30/2012 17:27:08 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_Talonario FOREIGN KEY(ta_id)
REFERENCES Talonario (ta_id)
;
-- FK_Proyecto_Talonario
;
/****** Object:  ForeignKey FK_Proyecto_Usuario    Script Date: 07/30/2012 17:27:09 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Proyecto_Usuario
;
/****** Object:  ForeignKey FK_Proyecto_Usuario1    Script Date: 07/30/2012 17:27:09 ******/
ALTER TABLE Proyecto  ADD  CONSTRAINT FK_Proyecto_Usuario1 FOREIGN KEY(us_id_alta)
REFERENCES Usuario (us_id)
;
-- FK_Proyecto_Usuario1
;
/****** Object:  ForeignKey FK_ProyectoItem_Proyecto    Script Date: 07/30/2012 17:27:11 ******/
ALTER TABLE ProyectoItem  ADD  CONSTRAINT FK_ProyectoItem_Proyecto FOREIGN KEY(proy_id)
REFERENCES Proyecto (proy_id)
;
-- FK_ProyectoItem_Proyecto
;
/****** Object:  ForeignKey FK_ProyectoItem_Usuario    Script Date: 07/30/2012 17:27:11 ******/
ALTER TABLE ProyectoItem  ADD  CONSTRAINT FK_ProyectoItem_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ProyectoItem_Usuario
;
/****** Object:  ForeignKey FK_ProyectoPrecio_Producto    Script Date: 07/30/2012 17:27:13 ******/
ALTER TABLE ProyectoPrecio  ADD  CONSTRAINT FK_ProyectoPrecio_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_ProyectoPrecio_Producto
;
/****** Object:  ForeignKey FK_ProyectoPrecio_Proyecto    Script Date: 07/30/2012 17:27:13 ******/
ALTER TABLE ProyectoPrecio  ADD  CONSTRAINT FK_ProyectoPrecio_Proyecto FOREIGN KEY(proy_id)
REFERENCES Proyecto (proy_id)
;
-- FK_ProyectoPrecio_Proyecto
;
/****** Object:  ForeignKey FK_ProyectoPrecio_Usuario    Script Date: 07/30/2012 17:27:13 ******/
ALTER TABLE ProyectoPrecio  ADD  CONSTRAINT FK_ProyectoPrecio_Usuario FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_ProyectoPrecio_Usuario
;
/****** Object:  ForeignKey FK_ProyectoPrecio_UsuarioModifico    Script Date: 07/30/2012 17:27:13 ******/
ALTER TABLE ProyectoPrecio  ADD  CONSTRAINT FK_ProyectoPrecio_UsuarioModifico FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ProyectoPrecio_UsuarioModifico
;
/****** Object:  ForeignKey FK_ProyectoTareaEstado_Proyecto    Script Date: 07/30/2012 17:27:15 ******/
ALTER TABLE ProyectoTareaEstado  ADD  CONSTRAINT FK_ProyectoTareaEstado_Proyecto FOREIGN KEY(proy_id)
REFERENCES Proyecto (proy_id)
;
-- FK_ProyectoTareaEstado_Proyecto
;
/****** Object:  ForeignKey FK_ProyectoTareaEstado_TareaEstado    Script Date: 07/30/2012 17:27:15 ******/
ALTER TABLE ProyectoTareaEstado  ADD  CONSTRAINT FK_ProyectoTareaEstado_TareaEstado FOREIGN KEY(tarest_id)
REFERENCES TareaEstado (tarest_id)
;
-- FK_ProyectoTareaEstado_TareaEstado
;
/****** Object:  ForeignKey FK_ProyectoTareaEstado_Usuario    Script Date: 07/30/2012 17:27:15 ******/
ALTER TABLE ProyectoTareaEstado  ADD  CONSTRAINT FK_ProyectoTareaEstado_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ProyectoTareaEstado_Usuario
;
/****** Object:  ForeignKey FK_Puerto_Ciudad    Script Date: 07/30/2012 17:27:17 ******/
ALTER TABLE Puerto  ADD  CONSTRAINT FK_Puerto_Ciudad FOREIGN KEY(ciu_id)
REFERENCES Ciudad (ciu_id)
;
-- FK_Puerto_Ciudad
;
/****** Object:  ForeignKey FK_Puerto_Usuario    Script Date: 07/30/2012 17:27:17 ******/
ALTER TABLE Puerto  ADD  CONSTRAINT FK_Puerto_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Puerto_Usuario
;
/****** Object:  ForeignKey FK_Rama_Arbol    Script Date: 07/30/2012 17:27:19 ******/
ALTER TABLE Rama  ADD  CONSTRAINT FK_Rama_Arbol FOREIGN KEY(arb_id)
REFERENCES Arbol (arb_id)
;
-- FK_Rama_Arbol
;
/****** Object:  ForeignKey FK_Rama_Rama    Script Date: 07/30/2012 17:27:19 ******/
ALTER TABLE Rama  ADD  CONSTRAINT FK_Rama_Rama FOREIGN KEY(ram_id_padre)
REFERENCES Rama (ram_id)
;
-- FK_Rama_Rama
;
/****** Object:  ForeignKey FK_Rama_Usuario    Script Date: 07/30/2012 17:27:19 ******/
ALTER TABLE Rama  ADD  CONSTRAINT FK_Rama_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Rama_Usuario
;
/****** Object:  ForeignKey FK_RamaVista_ArbolVista    Script Date: 07/30/2012 17:27:21 ******/
ALTER TABLE RamaVista  ADD  CONSTRAINT FK_RamaVista_ArbolVista FOREIGN KEY(arbv_id)
REFERENCES ArbolVista (arbv_id)
;
-- FK_RamaVista_ArbolVista
;
/****** Object:  ForeignKey FK_RecuentoStock_DepositoLogico    Script Date: 07/30/2012 17:27:25 ******/
ALTER TABLE RecuentoStock  ADD  CONSTRAINT FK_RecuentoStock_DepositoLogico FOREIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_RecuentoStock_DepositoLogico
;
/****** Object:  ForeignKey FK_RecuentoStock_Documento    Script Date: 07/30/2012 17:27:25 ******/
ALTER TABLE RecuentoStock  ADD  CONSTRAINT FK_RecuentoStock_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_RecuentoStock_Documento
;
/****** Object:  ForeignKey FK_RecuentoStock_DocumentoTipo    Script Date: 07/30/2012 17:27:25 ******/
ALTER TABLE RecuentoStock  ADD  CONSTRAINT FK_RecuentoStock_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_RecuentoStock_DocumentoTipo
;
/****** Object:  ForeignKey FK_RecuentoStock_Legajo    Script Date: 07/30/2012 17:27:25 ******/
ALTER TABLE RecuentoStock  ADD  CONSTRAINT FK_RecuentoStock_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_RecuentoStock_Legajo
;
/****** Object:  ForeignKey FK_RecuentoStock_StockIngreso    Script Date: 07/30/2012 17:27:25 ******/
ALTER TABLE RecuentoStock  ADD  CONSTRAINT FK_RecuentoStock_StockIngreso FOREIGN KEY(st_id1)
REFERENCES Stock (st_id)
;
-- FK_RecuentoStock_StockIngreso
;
/****** Object:  ForeignKey FK_RecuentoStock_StockSalida    Script Date: 07/30/2012 17:27:25 ******/
ALTER TABLE RecuentoStock  ADD  CONSTRAINT FK_RecuentoStock_StockSalida FOREIGN KEY(st_id2)
REFERENCES Stock (st_id)
;
-- FK_RecuentoStock_StockSalida
;
/****** Object:  ForeignKey FK_RecuentoStock_Sucursal    Script Date: 07/30/2012 17:27:26 ******/
ALTER TABLE RecuentoStock  ADD  CONSTRAINT FK_RecuentoStock_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_RecuentoStock_Sucursal
;
/****** Object:  ForeignKey FK_RecuentoStockItem_DepositoLogico    Script Date: 07/30/2012 17:27:28 ******/
ALTER TABLE RecuentoStockItem  ADD  CONSTRAINT FK_RecuentoStockItem_DepositoLogico FOREIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_RecuentoStockItem_DepositoLogico
;
/****** Object:  ForeignKey FK_RecuentoStockItem_Producto    Script Date: 07/30/2012 17:27:28 ******/
ALTER TABLE RecuentoStockItem  ADD  CONSTRAINT FK_RecuentoStockItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_RecuentoStockItem_Producto
;
/****** Object:  ForeignKey FK_RecuentoStockItem_RecuentoStock    Script Date: 07/30/2012 17:27:28 ******/
ALTER TABLE RecuentoStockItem  ADD  CONSTRAINT FK_RecuentoStockItem_RecuentoStock FOREIGN KEY(rs_id)
REFERENCES RecuentoStock (rs_id)
;
-- FK_RecuentoStockItem_RecuentoStock
;
/****** Object:  ForeignKey FK_RecuentoStockItem_StockLote    Script Date: 07/30/2012 17:27:28 ******/
ALTER TABLE RecuentoStockItem  ADD  CONSTRAINT FK_RecuentoStockItem_StockLote FOREIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_RecuentoStockItem_StockLote
;
/****** Object:  ForeignKey FK_RecuentoStockItemSerieTMP_RecuentoStockItemTMP    Script Date: 07/30/2012 17:27:31 ******/
ALTER TABLE RecuentoStockItemSerieTMP  ADD  CONSTRAINT FK_RecuentoStockItemSerieTMP_RecuentoStockItemTMP FOREIGN KEY(rsiTMP_id)
REFERENCES RecuentoStockItemTMP (rsiTMP_id)
;
-- FK_RecuentoStockItemSerieTMP_RecuentoStockItemTMP
;
/****** Object:  ForeignKey FK_RecuentoStockItemSerieTMP_RecuentoStockTMP    Script Date: 07/30/2012 17:27:31 ******/
ALTER TABLE RecuentoStockItemSerieTMP  ADD  CONSTRAINT FK_RecuentoStockItemSerieTMP_RecuentoStockTMP FOREIGN KEY(rsTMP_id)
REFERENCES RecuentoStockTMP (rsTMP_id)
;
-- FK_RecuentoStockItemSerieTMP_RecuentoStockTMP
;
/****** Object:  ForeignKey FK_RecuentoStockItemTMP_RecuentoStockTMP    Script Date: 07/30/2012 17:27:33 ******/
ALTER TABLE RecuentoStockItemTMP  ADD  CONSTRAINT FK_RecuentoStockItemTMP_RecuentoStockTMP FOREIGN KEY(rsTMP_id)
REFERENCES RecuentoStockTMP (rsTMP_id)
;
-- FK_RecuentoStockItemTMP_RecuentoStockTMP
;
/****** Object:  ForeignKey FK_Reina_Colmena    Script Date: 07/30/2012 17:27:40 ******/
ALTER TABLE Reina  ADD  CONSTRAINT FK_Reina_Colmena FOREIGN KEY(colm_id)
REFERENCES Colmena (colm_id)
;
-- FK_Reina_Colmena
;
/****** Object:  ForeignKey FK_Reina_Proveedor    Script Date: 07/30/2012 17:27:40 ******/
ALTER TABLE Reina  ADD  CONSTRAINT FK_Reina_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_Reina_Proveedor
;
/****** Object:  ForeignKey FK_Reina_Usuario    Script Date: 07/30/2012 17:27:41 ******/
ALTER TABLE Reina  ADD  CONSTRAINT FK_Reina_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Reina_Usuario
;
/****** Object:  ForeignKey FK_RemitoCompra_CentroCosto    Script Date: 07/30/2012 17:27:48 ******/
ALTER TABLE RemitoCompra  ADD  CONSTRAINT FK_RemitoCompra_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_RemitoCompra_CentroCosto
;
/****** Object:  ForeignKey FK_RemitoCompra_CondicionPago    Script Date: 07/30/2012 17:27:48 ******/
ALTER TABLE RemitoCompra  ADD  CONSTRAINT FK_RemitoCompra_CondicionPago FOREIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_RemitoCompra_CondicionPago
;
/****** Object:  ForeignKey FK_RemitoCompra_Documento    Script Date: 07/30/2012 17:27:48 ******/
ALTER TABLE RemitoCompra  ADD  CONSTRAINT FK_RemitoCompra_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_RemitoCompra_Documento
;
/****** Object:  ForeignKey FK_RemitoCompra_DocumentoTipo    Script Date: 07/30/2012 17:27:49 ******/
ALTER TABLE RemitoCompra  ADD  CONSTRAINT FK_RemitoCompra_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_RemitoCompra_DocumentoTipo
;
/****** Object:  ForeignKey FK_RemitoCompra_Estado    Script Date: 07/30/2012 17:27:49 ******/
ALTER TABLE RemitoCompra  ADD  CONSTRAINT FK_RemitoCompra_Estado FOREIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_RemitoCompra_Estado
;
/****** Object:  ForeignKey FK_RemitoCompra_ListaDescuento    Script Date: 07/30/2012 17:27:49 ******/
ALTER TABLE RemitoCompra  ADD  CONSTRAINT FK_RemitoCompra_ListaDescuento FOREIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_RemitoCompra_ListaDescuento
;
/****** Object:  ForeignKey FK_RemitoCompra_ListaPrecio    Script Date: 07/30/2012 17:27:49 ******/
ALTER TABLE RemitoCompra  ADD  CONSTRAINT FK_RemitoCompra_ListaPrecio FOREIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_RemitoCompra_ListaPrecio
;
/****** Object:  ForeignKey FK_RemitoCompra_Proveedor    Script Date: 07/30/2012 17:27:49 ******/
ALTER TABLE RemitoCompra  ADD  CONSTRAINT FK_RemitoCompra_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_RemitoCompra_Proveedor
;
/****** Object:  ForeignKey FK_RemitoCompra_Stock    Script Date: 07/30/2012 17:27:49 ******/
ALTER TABLE RemitoCompra  ADD  CONSTRAINT FK_RemitoCompra_Stock FOREIGN KEY(st_id)
REFERENCES Stock (st_id)
;
-- FK_RemitoCompra_Stock
;
/****** Object:  ForeignKey FK_RemitoCompra_Sucursal    Script Date: 07/30/2012 17:27:49 ******/
ALTER TABLE RemitoCompra  ADD  CONSTRAINT FK_RemitoCompra_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_RemitoCompra_Sucursal
;
/****** Object:  ForeignKey FK_RemitoCompraItem_CentroCosto    Script Date: 07/30/2012 17:27:54 ******/
ALTER TABLE RemitoCompraItem  ADD  CONSTRAINT FK_RemitoCompraItem_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_RemitoCompraItem_CentroCosto
;
/****** Object:  ForeignKey FK_RemitoCompraItem_Producto    Script Date: 07/30/2012 17:27:54 ******/
ALTER TABLE RemitoCompraItem  ADD  CONSTRAINT FK_RemitoCompraItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_RemitoCompraItem_Producto
;
/****** Object:  ForeignKey FK_RemitoCompraItem_RemitoCompra    Script Date: 07/30/2012 17:27:54 ******/
ALTER TABLE RemitoCompraItem  ADD  CONSTRAINT FK_RemitoCompraItem_RemitoCompra FOREIGN KEY(rc_id)
REFERENCES RemitoCompra (rc_id)
;
-- FK_RemitoCompraItem_RemitoCompra
;
/****** Object:  ForeignKey FK_RemitoCompraItem_StockLote    Script Date: 07/30/2012 17:27:54 ******/
ALTER TABLE RemitoCompraItem  ADD  CONSTRAINT FK_RemitoCompraItem_StockLote FOREIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_RemitoCompraItem_StockLote
;
/****** Object:  ForeignKey FK_RemitoCompraItemBorradoTMP_RemitoCompraTMP    Script Date: 07/30/2012 17:27:55 ******/
ALTER TABLE RemitoCompraItemBorradoTMP  ADD  CONSTRAINT FK_RemitoCompraItemBorradoTMP_RemitoCompraTMP FOREIGN KEY(rcTMP_id)
REFERENCES RemitoCompraTMP (rcTMP_id)
;
-- FK_RemitoCompraItemBorradoTMP_RemitoCompraTMP
;
/****** Object:  ForeignKey FK_RemitoCompraItemSerieTMP_RemitoCompraItemTMP    Script Date: 07/30/2012 17:27:59 ******/
ALTER TABLE RemitoCompraItemSerieTMP  ADD  CONSTRAINT FK_RemitoCompraItemSerieTMP_RemitoCompraItemTMP FOREIGN KEY(rciTMP_id)
REFERENCES RemitoCompraItemTMP (rciTMP_id)
;
-- FK_RemitoCompraItemSerieTMP_RemitoCompraItemTMP
;
/****** Object:  ForeignKey FK_RemitoCompraItemSerieTMP_RemitoCompraTMP    Script Date: 07/30/2012 17:27:59 ******/
ALTER TABLE RemitoCompraItemSerieTMP  ADD  CONSTRAINT FK_RemitoCompraItemSerieTMP_RemitoCompraTMP FOREIGN KEY(rcTMP_id)
REFERENCES RemitoCompraTMP (rcTMP_id)
;
-- FK_RemitoCompraItemSerieTMP_RemitoCompraTMP
;
/****** Object:  ForeignKey FK_RemitoCompraItemTMP_RemitoCompraTMP    Script Date: 07/30/2012 17:28:05 ******/
ALTER TABLE RemitoCompraItemTMP  ADD  CONSTRAINT FK_RemitoCompraItemTMP_RemitoCompraTMP FOREIGN KEY(rcTMP_id)
REFERENCES RemitoCompraTMP (rcTMP_id)
;
-- FK_RemitoCompraItemTMP_RemitoCompraTMP
;
/****** Object:  ForeignKey FK_RemitoDevolucionCompra_DevolucionCompraItem    Script Date: 07/30/2012 17:28:12 ******/
ALTER TABLE RemitoDevolucionCompra  ADD  CONSTRAINT FK_RemitoDevolucionCompra_DevolucionCompraItem FOREIGN KEY(rci_id_devolucion)
REFERENCES RemitoCompraItem (rci_id)
;
-- FK_RemitoDevolucionCompra_DevolucionCompraItem
;
/****** Object:  ForeignKey FK_RemitoDevolucionCompra_RemitoCompraItem    Script Date: 07/30/2012 17:28:12 ******/
ALTER TABLE RemitoDevolucionCompra  ADD  CONSTRAINT FK_RemitoDevolucionCompra_RemitoCompraItem FOREIGN KEY(rci_id_remito)
REFERENCES RemitoCompraItem (rci_id)
;
-- FK_RemitoDevolucionCompra_RemitoCompraItem
;
/****** Object:  ForeignKey FK_RemitoDevolucionCompraTMP_RemitoCompraTMP    Script Date: 07/30/2012 17:28:14 ******/
ALTER TABLE RemitoDevolucionCompraTMP  ADD  CONSTRAINT FK_RemitoDevolucionCompraTMP_RemitoCompraTMP FOREIGN KEY(rcTMP_id)
REFERENCES RemitoCompraTMP (rcTMP_id)
;
-- FK_RemitoDevolucionCompraTMP_RemitoCompraTMP
;
/****** Object:  ForeignKey FK_RemitoDevolucionVenta_DevolucionVentaItem    Script Date: 07/30/2012 17:28:15 ******/
ALTER TABLE RemitoDevolucionVenta  ADD  CONSTRAINT FK_RemitoDevolucionVenta_DevolucionVentaItem FOREIGN KEY(rvi_id_devolucion)
REFERENCES RemitoVentaItem (rvi_id)
;
-- FK_RemitoDevolucionVenta_DevolucionVentaItem
;
/****** Object:  ForeignKey FK_RemitoDevolucionVenta_RemitoVentaItem    Script Date: 07/30/2012 17:28:15 ******/
ALTER TABLE RemitoDevolucionVenta  ADD  CONSTRAINT FK_RemitoDevolucionVenta_RemitoVentaItem FOREIGN KEY(rvi_id_remito)
REFERENCES RemitoVentaItem (rvi_id)
;
-- FK_RemitoDevolucionVenta_RemitoVentaItem
;
/****** Object:  ForeignKey FK_RemitoDevolucionVentaTMP_RemitoVentaTMP    Script Date: 07/30/2012 17:28:16 ******/
ALTER TABLE RemitoDevolucionVentaTMP  ADD  CONSTRAINT FK_RemitoDevolucionVentaTMP_RemitoVentaTMP FOREIGN KEY(rvTMP_id)
REFERENCES RemitoVentaTMP (rvTMP_id)
;
-- FK_RemitoDevolucionVentaTMP_RemitoVentaTMP
;
/****** Object:  ForeignKey FK_RemitoFacturaCompra_FacturaCompraItem    Script Date: 07/30/2012 17:28:17 ******/
ALTER TABLE RemitoFacturaCompra  ADD  CONSTRAINT FK_RemitoFacturaCompra_FacturaCompraItem FOREIGN KEY(fci_id)
REFERENCES FacturaCompraItem (fci_id)
;
-- FK_RemitoFacturaCompra_FacturaCompraItem
;
/****** Object:  ForeignKey FK_RemitoFacturaCompra_RemitoCompraItem    Script Date: 07/30/2012 17:28:17 ******/
ALTER TABLE RemitoFacturaCompra  ADD  CONSTRAINT FK_RemitoFacturaCompra_RemitoCompraItem FOREIGN KEY(rci_id)
REFERENCES RemitoCompraItem (rci_id)
;
-- FK_RemitoFacturaCompra_RemitoCompraItem
;
/****** Object:  ForeignKey FK_RemitoFacturaVenta_FacturaVentaItem    Script Date: 07/30/2012 17:28:20 ******/
ALTER TABLE RemitoFacturaVenta  ADD  CONSTRAINT FK_RemitoFacturaVenta_FacturaVentaItem FOREIGN KEY(fvi_id)
REFERENCES FacturaVentaItem (fvi_id)
;
-- FK_RemitoFacturaVenta_FacturaVentaItem
;
/****** Object:  ForeignKey FK_RemitoFacturaVenta_RemitoVentaItem    Script Date: 07/30/2012 17:28:20 ******/
ALTER TABLE RemitoFacturaVenta  ADD  CONSTRAINT FK_RemitoFacturaVenta_RemitoVentaItem FOREIGN KEY(rvi_id)
REFERENCES RemitoVentaItem (rvi_id)
;
-- FK_RemitoFacturaVenta_RemitoVentaItem
;
/****** Object:  ForeignKey FK_RemitoVenta_Camion    Script Date: 07/30/2012 17:28:33 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Camion FOREIGN KEY(cam_id)
REFERENCES Camion (cam_id)
;
-- FK_RemitoVenta_Camion
;
/****** Object:  ForeignKey FK_RemitoVenta_Camion1    Script Date: 07/30/2012 17:28:33 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Camion1 FOREIGN KEY(cam_id_semi)
REFERENCES Camion (cam_id)
;
-- FK_RemitoVenta_Camion1
;
/****** Object:  ForeignKey FK_RemitoVenta_CentroCosto    Script Date: 07/30/2012 17:28:33 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_RemitoVenta_CentroCosto
;
/****** Object:  ForeignKey FK_RemitoVenta_Chofer    Script Date: 07/30/2012 17:28:33 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Chofer FOREIGN KEY(chof_id)
REFERENCES Chofer (chof_id)
;
-- FK_RemitoVenta_Chofer
;
/****** Object:  ForeignKey FK_RemitoVenta_Cliente    Script Date: 07/30/2012 17:28:33 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_RemitoVenta_Cliente
;
/****** Object:  ForeignKey FK_RemitoVenta_ClienteSucursal    Script Date: 07/30/2012 17:28:33 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_ClienteSucursal FOREIGN KEY(clis_id)
REFERENCES ClienteSucursal (clis_id)
;
-- FK_RemitoVenta_ClienteSucursal
;
/****** Object:  ForeignKey FK_RemitoVenta_CondicionPago    Script Date: 07/30/2012 17:28:33 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_CondicionPago FOREIGN KEY(cpg_id)
REFERENCES CondicionPago (cpg_id)
;
-- FK_RemitoVenta_CondicionPago
;
/****** Object:  ForeignKey FK_RemitoVenta_Documento    Script Date: 07/30/2012 17:28:33 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_RemitoVenta_Documento
;
/****** Object:  ForeignKey FK_RemitoVenta_DocumentoTipo    Script Date: 07/30/2012 17:28:34 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_RemitoVenta_DocumentoTipo
;
/****** Object:  ForeignKey FK_RemitoVenta_Empresa    Script Date: 07/30/2012 17:28:34 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_RemitoVenta_Empresa
;
/****** Object:  ForeignKey FK_RemitoVenta_Estado    Script Date: 07/30/2012 17:28:34 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Estado FOREIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_RemitoVenta_Estado
;
/****** Object:  ForeignKey FK_RemitoVenta_ImportacionID    Script Date: 07/30/2012 17:28:34 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_ImportacionID FOREIGN KEY(impid_id)
REFERENCES ImportacionID (impid_id)
;
-- FK_RemitoVenta_ImportacionID
;
/****** Object:  ForeignKey FK_RemitoVenta_Legajo    Script Date: 07/30/2012 17:28:34 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_RemitoVenta_Legajo
;
/****** Object:  ForeignKey FK_RemitoVenta_ListaDescuento    Script Date: 07/30/2012 17:28:34 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_ListaDescuento FOREIGN KEY(ld_id)
REFERENCES ListaDescuento (ld_id)
;
-- FK_RemitoVenta_ListaDescuento
;
/****** Object:  ForeignKey FK_RemitoVenta_ListaPrecio    Script Date: 07/30/2012 17:28:34 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_ListaPrecio FOREIGN KEY(lp_id)
REFERENCES ListaPrecio (lp_id)
;
-- FK_RemitoVenta_ListaPrecio
;
/****** Object:  ForeignKey FK_RemitoVenta_ProvinciaDestino    Script Date: 07/30/2012 17:28:34 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_ProvinciaDestino FOREIGN KEY(pro_id_destino)
REFERENCES Provincia (pro_id)
;
-- FK_RemitoVenta_ProvinciaDestino
;
/****** Object:  ForeignKey FK_RemitoVenta_ProvinciaOrigen    Script Date: 07/30/2012 17:28:34 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_ProvinciaOrigen FOREIGN KEY(pro_id_origen)
REFERENCES Provincia (pro_id)
;
-- FK_RemitoVenta_ProvinciaOrigen
;
/****** Object:  ForeignKey FK_RemitoVenta_Stock    Script Date: 07/30/2012 17:28:34 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Stock FOREIGN KEY(st_id)
REFERENCES Stock (st_id)
;
-- FK_RemitoVenta_Stock
;
/****** Object:  ForeignKey FK_RemitoVenta_Stock1    Script Date: 07/30/2012 17:28:35 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Stock1 FOREIGN KEY(st_id_producido)
REFERENCES Stock (st_id)
;
-- FK_RemitoVenta_Stock1
;
/****** Object:  ForeignKey FK_RemitoVenta_StockConsumo    Script Date: 07/30/2012 17:28:35 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_StockConsumo FOREIGN KEY(st_id_consumo)
REFERENCES Stock (st_id)
;
-- FK_RemitoVenta_StockConsumo
;
/****** Object:  ForeignKey FK_RemitoVenta_StockConsumoTemp    Script Date: 07/30/2012 17:28:35 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_StockConsumoTemp FOREIGN KEY(st_id_consumoTemp)
REFERENCES Stock (st_id)
;
-- FK_RemitoVenta_StockConsumoTemp
;
/****** Object:  ForeignKey FK_RemitoVenta_Sucursal    Script Date: 07/30/2012 17:28:35 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_RemitoVenta_Sucursal
;
/****** Object:  ForeignKey FK_RemitoVenta_Transporte    Script Date: 07/30/2012 17:28:35 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Transporte FOREIGN KEY(trans_id)
REFERENCES Transporte (trans_id)
;
-- FK_RemitoVenta_Transporte
;
/****** Object:  ForeignKey FK_RemitoVenta_Vendedor    Script Date: 07/30/2012 17:28:35 ******/
ALTER TABLE RemitoVenta  ADD  CONSTRAINT FK_RemitoVenta_Vendedor FOREIGN KEY(ven_id)
REFERENCES Vendedor (ven_id)
;
-- FK_RemitoVenta_Vendedor
;
/****** Object:  ForeignKey FK_RemitoVentaItem_CentroCosto    Script Date: 07/30/2012 17:28:40 ******/
ALTER TABLE RemitoVentaItem  ADD  CONSTRAINT FK_RemitoVentaItem_CentroCosto FOREIGN KEY(ccos_id)
REFERENCES CentroCosto (ccos_id)
;
-- FK_RemitoVentaItem_CentroCosto
;
/****** Object:  ForeignKey FK_RemitoVentaItem_Producto    Script Date: 07/30/2012 17:28:40 ******/
ALTER TABLE RemitoVentaItem  ADD  CONSTRAINT FK_RemitoVentaItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_RemitoVentaItem_Producto
;
/****** Object:  ForeignKey FK_RemitoVentaItem_RemitoVenta    Script Date: 07/30/2012 17:28:40 ******/
ALTER TABLE RemitoVentaItem  ADD  CONSTRAINT FK_RemitoVentaItem_RemitoVenta FOREIGN KEY(rv_id)
REFERENCES RemitoVenta (rv_id)
;
-- FK_RemitoVentaItem_RemitoVenta
;
/****** Object:  ForeignKey FK_RemitoVentaItem_StockLote    Script Date: 07/30/2012 17:28:40 ******/
ALTER TABLE RemitoVentaItem  ADD  CONSTRAINT FK_RemitoVentaItem_StockLote FOREIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_RemitoVentaItem_StockLote
;
/****** Object:  ForeignKey FK_RemitoVentaItemBorradoTMP_RemitoVentaTMP    Script Date: 07/30/2012 17:28:41 ******/
ALTER TABLE RemitoVentaItemBorradoTMP  ADD  CONSTRAINT FK_RemitoVentaItemBorradoTMP_RemitoVentaTMP FOREIGN KEY(rvTMP_id)
REFERENCES RemitoVentaTMP (rvTMP_id)
;
-- FK_RemitoVentaItemBorradoTMP_RemitoVentaTMP
;
/****** Object:  ForeignKey FK_RemitoVentaItemInsumoTMP_RemitoVentaItemTMP    Script Date: 07/30/2012 17:28:43 ******/
ALTER TABLE RemitoVentaItemInsumoTMP  ADD  CONSTRAINT FK_RemitoVentaItemInsumoTMP_RemitoVentaItemTMP FOREIGN KEY(rviTMP_id)
REFERENCES RemitoVentaItemTMP (rviTMP_id)
;
-- FK_RemitoVentaItemInsumoTMP_RemitoVentaItemTMP
;
/****** Object:  ForeignKey FK_RemitoVentaItemInsumoTMP_RemitoVentaTMP    Script Date: 07/30/2012 17:28:43 ******/
ALTER TABLE RemitoVentaItemInsumoTMP  ADD  CONSTRAINT FK_RemitoVentaItemInsumoTMP_RemitoVentaTMP FOREIGN KEY(rvTMP_id)
REFERENCES RemitoVentaTMP (rvTMP_id)
;
-- FK_RemitoVentaItemInsumoTMP_RemitoVentaTMP
;
/****** Object:  ForeignKey FK_RemitoVentaItemSerieTMP_RemitoVentaItemTMP    Script Date: 07/30/2012 17:28:46 ******/
ALTER TABLE RemitoVentaItemSerieTMP  ADD  CONSTRAINT FK_RemitoVentaItemSerieTMP_RemitoVentaItemTMP FOREIGN KEY(rviTMP_id)
REFERENCES RemitoVentaItemTMP (rviTMP_id)
;
-- FK_RemitoVentaItemSerieTMP_RemitoVentaItemTMP
;
/****** Object:  ForeignKey FK_RemitoVentaItemSerieTMP_RemitoVentaTMP    Script Date: 07/30/2012 17:28:46 ******/
ALTER TABLE RemitoVentaItemSerieTMP  ADD  CONSTRAINT FK_RemitoVentaItemSerieTMP_RemitoVentaTMP FOREIGN KEY(rvTMP_id)
REFERENCES RemitoVentaTMP (rvTMP_id)
;
-- FK_RemitoVentaItemSerieTMP_RemitoVentaTMP
;
/****** Object:  ForeignKey FK_RemitoVentaItemTMP_RemitoVentaTMP    Script Date: 07/30/2012 17:28:51 ******/
ALTER TABLE RemitoVentaItemTMP  ADD  CONSTRAINT FK_RemitoVentaItemTMP_RemitoVentaTMP FOREIGN KEY(rvTMP_id)
REFERENCES RemitoVentaTMP (rvTMP_id)
;
-- FK_RemitoVentaItemTMP_RemitoVentaTMP
;
/****** Object:  ForeignKey FK_Reporte_Informe    Script Date: 07/30/2012 17:29:02 ******/
ALTER TABLE Reporte  ADD  CONSTRAINT FK_Reporte_Informe FOREIGN KEY(inf_id)
REFERENCES Informe (inf_id)
;
-- FK_Reporte_Informe
;
/****** Object:  ForeignKey FK_Reporte_Usuario    Script Date: 07/30/2012 17:29:02 ******/
ALTER TABLE Reporte  ADD  CONSTRAINT FK_Reporte_Usuario FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_Reporte_Usuario
;
/****** Object:  ForeignKey FK_Reporte_Usuario1    Script Date: 07/30/2012 17:29:02 ******/
ALTER TABLE Reporte  ADD  CONSTRAINT FK_Reporte_Usuario1 FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Reporte_Usuario1
;
/****** Object:  ForeignKey FK_ReporteFormulario_Documento    Script Date: 07/30/2012 17:29:05 ******/
ALTER TABLE ReporteFormulario  ADD  CONSTRAINT FK_ReporteFormulario_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_ReporteFormulario_Documento
;
/****** Object:  ForeignKey FK_ReporteFormulario_Tabla    Script Date: 07/30/2012 17:29:06 ******/
ALTER TABLE ReporteFormulario  ADD  CONSTRAINT FK_ReporteFormulario_Tabla FOREIGN KEY(tbl_id)
REFERENCES Tabla (tbl_id)
;
-- FK_ReporteFormulario_Tabla
;
/****** Object:  ForeignKey FK_ReporteFormulario_Usuario    Script Date: 07/30/2012 17:29:06 ******/
ALTER TABLE ReporteFormulario  ADD  CONSTRAINT FK_ReporteFormulario_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_ReporteFormulario_Usuario
;
/****** Object:  ForeignKey FK_ReporteParametro_InformeParametro    Script Date: 07/30/2012 17:29:08 ******/
ALTER TABLE ReporteParametro  ADD  CONSTRAINT FK_ReporteParametro_InformeParametro FOREIGN KEY(infp_id)
REFERENCES InformeParametro (infp_id)
;
-- FK_ReporteParametro_InformeParametro
;
/****** Object:  ForeignKey FK_ReporteParametro_Reporte    Script Date: 07/30/2012 17:29:08 ******/
ALTER TABLE ReporteParametro  ADD  CONSTRAINT FK_ReporteParametro_Reporte FOREIGN KEY(rpt_id)
REFERENCES Reporte (rpt_id)
;
-- FK_ReporteParametro_Reporte
;
/****** Object:  ForeignKey FK_ResolucionCupon_Asiento    Script Date: 07/30/2012 17:29:12 ******/
ALTER TABLE ResolucionCupon  ADD  CONSTRAINT FK_ResolucionCupon_Asiento FOREIGN KEY(as_id)
REFERENCES Asiento (as_id)
;
-- FK_ResolucionCupon_Asiento
;
/****** Object:  ForeignKey FK_ResolucionCupon_Documento    Script Date: 07/30/2012 17:29:12 ******/
ALTER TABLE ResolucionCupon  ADD  CONSTRAINT FK_ResolucionCupon_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_ResolucionCupon_Documento
;
/****** Object:  ForeignKey FK_ResolucionCupon_DocumentoTipo    Script Date: 07/30/2012 17:29:12 ******/
ALTER TABLE ResolucionCupon  ADD  CONSTRAINT FK_ResolucionCupon_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_ResolucionCupon_DocumentoTipo
;
/****** Object:  ForeignKey FK_ResolucionCupon_Estado    Script Date: 07/30/2012 17:29:12 ******/
ALTER TABLE ResolucionCupon  ADD  CONSTRAINT FK_ResolucionCupon_Estado FOREIGN KEY(est_id)
REFERENCES Estado (est_id)
;
-- FK_ResolucionCupon_Estado
;
/****** Object:  ForeignKey FK_ResolucionCupon_Legajo    Script Date: 07/30/2012 17:29:12 ******/
ALTER TABLE ResolucionCupon  ADD  CONSTRAINT FK_ResolucionCupon_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_ResolucionCupon_Legajo
;
/****** Object:  ForeignKey FK_ResolucionCupon_Sucursal    Script Date: 07/30/2012 17:29:12 ******/
ALTER TABLE ResolucionCupon  ADD  CONSTRAINT FK_ResolucionCupon_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_ResolucionCupon_Sucursal
;
/****** Object:  ForeignKey FK_ResolucionCuponItem_Cuenta    Script Date: 07/30/2012 17:29:15 ******/
ALTER TABLE ResolucionCuponItem  ADD  CONSTRAINT FK_ResolucionCuponItem_Cuenta FOREIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_ResolucionCuponItem_Cuenta
;
/****** Object:  ForeignKey FK_ResolucionCuponItem_ResolucionCupon    Script Date: 07/30/2012 17:29:16 ******/
ALTER TABLE ResolucionCuponItem  ADD  CONSTRAINT FK_ResolucionCuponItem_ResolucionCupon FOREIGN KEY(rcup_id)
REFERENCES ResolucionCupon (rcup_id)
;
-- FK_ResolucionCuponItem_ResolucionCupon
;
/****** Object:  ForeignKey FK_ResolucionCuponItem_TarjetaCreditoCupon    Script Date: 07/30/2012 17:29:16 ******/
ALTER TABLE ResolucionCuponItem  ADD  CONSTRAINT FK_ResolucionCuponItem_TarjetaCreditoCupon FOREIGN KEY(tjcc_id)
REFERENCES TarjetaCreditoCupon (tjcc_id)
;
-- FK_ResolucionCuponItem_TarjetaCreditoCupon
;
/****** Object:  ForeignKey FK_ResolucionCuponItemBorradoTMP_ResolucionCuponTMP    Script Date: 07/30/2012 17:29:17 ******/
ALTER TABLE ResolucionCuponItemBorradoTMP  ADD  CONSTRAINT FK_ResolucionCuponItemBorradoTMP_ResolucionCuponTMP FOREIGN KEY(rcupTMP_id)
REFERENCES ResolucionCuponTMP (rcupTMP_id)
;
-- FK_ResolucionCuponItemBorradoTMP_ResolucionCuponTMP
;
/****** Object:  ForeignKey FK_ResolucionCuponItemTMP_ResolucionCuponTMP    Script Date: 07/30/2012 17:29:19 ******/
ALTER TABLE ResolucionCuponItemTMP  ADD  CONSTRAINT FK_ResolucionCuponItemTMP_ResolucionCuponTMP FOREIGN KEY(rcupTMP_id)
REFERENCES ResolucionCuponTMP (rcupTMP_id)
;
-- FK_ResolucionCuponItemTMP_ResolucionCuponTMP
;
/****** Object:  ForeignKey FK_Retencion_IngresosBrutosCategoria    Script Date: 07/30/2012 17:29:27 ******/
ALTER TABLE Retencion  ADD  CONSTRAINT FK_Retencion_IngresosBrutosCategoria FOREIGN KEY(ibc_id)
REFERENCES IngresosBrutosCategoria (ibc_id)
;
-- FK_Retencion_IngresosBrutosCategoria
;
/****** Object:  ForeignKey FK_Retencion_RetencionTipo    Script Date: 07/30/2012 17:29:27 ******/
ALTER TABLE Retencion  ADD  CONSTRAINT FK_Retencion_RetencionTipo FOREIGN KEY(rett_id)
REFERENCES RetencionTipo (rett_id)
;
-- FK_Retencion_RetencionTipo
;
/****** Object:  ForeignKey FK_Retencion_Talonario    Script Date: 07/30/2012 17:29:27 ******/
ALTER TABLE Retencion  ADD  CONSTRAINT FK_Retencion_Talonario FOREIGN KEY(ta_id)
REFERENCES Talonario (ta_id)
;
-- FK_Retencion_Talonario
;
/****** Object:  ForeignKey FK_Retencion_Usuario    Script Date: 07/30/2012 17:29:27 ******/
ALTER TABLE Retencion  ADD  CONSTRAINT FK_Retencion_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Retencion_Usuario
;
/****** Object:  ForeignKey FK_RetencionItem_Retencion    Script Date: 07/30/2012 17:29:30 ******/
ALTER TABLE RetencionItem  ADD  CONSTRAINT FK_RetencionItem_Retencion FOREIGN KEY(ret_id)
REFERENCES Retencion (ret_id)
;
-- FK_RetencionItem_Retencion
;
/****** Object:  ForeignKey FK_RetencionTipo_Cuenta    Script Date: 07/30/2012 17:29:34 ******/
ALTER TABLE RetencionTipo  ADD  CONSTRAINT FK_RetencionTipo_Cuenta FOREIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_RetencionTipo_Cuenta
;
/****** Object:  ForeignKey FK_RetencionTipo_Usuario    Script Date: 07/30/2012 17:29:34 ******/
ALTER TABLE RetencionTipo  ADD  CONSTRAINT FK_RetencionTipo_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_RetencionTipo_Usuario
;
/****** Object:  ForeignKey FK_Rol_Usuario    Script Date: 07/30/2012 17:29:35 ******/
ALTER TABLE Rol  ADD  CONSTRAINT FK_Rol_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Rol_Usuario
;
/****** Object:  ForeignKey FK_Rubro_RubroTabla    Script Date: 07/30/2012 17:29:42 ******/
ALTER TABLE Rubro  ADD  CONSTRAINT FK_Rubro_RubroTabla FOREIGN KEY(rubt_id1)
REFERENCES RubroTabla (rubt_id)
;
-- FK_Rubro_RubroTabla
;
/****** Object:  ForeignKey FK_Rubro_RubroTabla1    Script Date: 07/30/2012 17:29:42 ******/
ALTER TABLE Rubro  ADD  CONSTRAINT FK_Rubro_RubroTabla1 FOREIGN KEY(rubt_id2)
REFERENCES RubroTabla (rubt_id)
;
-- FK_Rubro_RubroTabla1
;
/****** Object:  ForeignKey FK_Rubro_RubroTabla2    Script Date: 07/30/2012 17:29:43 ******/
ALTER TABLE Rubro  ADD  CONSTRAINT FK_Rubro_RubroTabla2 FOREIGN KEY(rubt_id3)
REFERENCES RubroTabla (rubt_id)
;
-- FK_Rubro_RubroTabla2
;
/****** Object:  ForeignKey FK_Rubro_RubroTabla3    Script Date: 07/30/2012 17:29:43 ******/
ALTER TABLE Rubro  ADD  CONSTRAINT FK_Rubro_RubroTabla3 FOREIGN KEY(rubt_id4)
REFERENCES RubroTabla (rubt_id)
;
-- FK_Rubro_RubroTabla3
;
/****** Object:  ForeignKey FK_Rubro_RubroTabla4    Script Date: 07/30/2012 17:29:43 ******/
ALTER TABLE Rubro  ADD  CONSTRAINT FK_Rubro_RubroTabla4 FOREIGN KEY(rubt_id5)
REFERENCES RubroTabla (rubt_id)
;
-- FK_Rubro_RubroTabla4
;
/****** Object:  ForeignKey FK_Rubro_RubroTabla5    Script Date: 07/30/2012 17:29:43 ******/
ALTER TABLE Rubro  ADD  CONSTRAINT FK_Rubro_RubroTabla5 FOREIGN KEY(rubt_id6)
REFERENCES RubroTabla (rubt_id)
;
-- FK_Rubro_RubroTabla5
;
/****** Object:  ForeignKey FK_Rubro_RubroTabla6    Script Date: 07/30/2012 17:29:43 ******/
ALTER TABLE Rubro  ADD  CONSTRAINT FK_Rubro_RubroTabla6 FOREIGN KEY(rubt_id7)
REFERENCES RubroTabla (rubt_id)
;
-- FK_Rubro_RubroTabla6
;
/****** Object:  ForeignKey FK_Rubro_RubroTabla7    Script Date: 07/30/2012 17:29:43 ******/
ALTER TABLE Rubro  ADD  CONSTRAINT FK_Rubro_RubroTabla7 FOREIGN KEY(rubt_id8)
REFERENCES RubroTabla (rubt_id)
;
-- FK_Rubro_RubroTabla7
;
/****** Object:  ForeignKey FK_Rubro_RubroTabla8    Script Date: 07/30/2012 17:29:43 ******/
ALTER TABLE Rubro  ADD  CONSTRAINT FK_Rubro_RubroTabla8 FOREIGN KEY(rubt_id9)
REFERENCES RubroTabla (rubt_id)
;
-- FK_Rubro_RubroTabla8
;
/****** Object:  ForeignKey FK_Rubro_RubroTabla9    Script Date: 07/30/2012 17:29:43 ******/
ALTER TABLE Rubro  ADD  CONSTRAINT FK_Rubro_RubroTabla9 FOREIGN KEY(rubt_id10)
REFERENCES RubroTabla (rubt_id)
;
-- FK_Rubro_RubroTabla9
;
/****** Object:  ForeignKey FK_Rubro_RubroTablaItem    Script Date: 07/30/2012 17:29:43 ******/
ALTER TABLE Rubro  ADD  CONSTRAINT FK_Rubro_RubroTablaItem FOREIGN KEY(rubti_id1)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Rubro_RubroTablaItem
;
/****** Object:  ForeignKey FK_Rubro_RubroTablaItem1    Script Date: 07/30/2012 17:29:43 ******/
ALTER TABLE Rubro  ADD  CONSTRAINT FK_Rubro_RubroTablaItem1 FOREIGN KEY(rubti_id2)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Rubro_RubroTablaItem1
;
/****** Object:  ForeignKey FK_Rubro_RubroTablaItem2    Script Date: 07/30/2012 17:29:44 ******/
ALTER TABLE Rubro  ADD  CONSTRAINT FK_Rubro_RubroTablaItem2 FOREIGN KEY(rubti_id3)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Rubro_RubroTablaItem2
;
/****** Object:  ForeignKey FK_Rubro_RubroTablaItem3    Script Date: 07/30/2012 17:29:44 ******/
ALTER TABLE Rubro  ADD  CONSTRAINT FK_Rubro_RubroTablaItem3 FOREIGN KEY(rubti_id4)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Rubro_RubroTablaItem3
;
/****** Object:  ForeignKey FK_Rubro_RubroTablaItem4    Script Date: 07/30/2012 17:29:44 ******/
ALTER TABLE Rubro  ADD  CONSTRAINT FK_Rubro_RubroTablaItem4 FOREIGN KEY(rubti_id5)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Rubro_RubroTablaItem4
;
/****** Object:  ForeignKey FK_Rubro_RubroTablaItem5    Script Date: 07/30/2012 17:29:44 ******/
ALTER TABLE Rubro  ADD  CONSTRAINT FK_Rubro_RubroTablaItem5 FOREIGN KEY(rubti_id6)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Rubro_RubroTablaItem5
;
/****** Object:  ForeignKey FK_Rubro_RubroTablaItem6    Script Date: 07/30/2012 17:29:44 ******/
ALTER TABLE Rubro  ADD  CONSTRAINT FK_Rubro_RubroTablaItem6 FOREIGN KEY(rubti_id7)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Rubro_RubroTablaItem6
;
/****** Object:  ForeignKey FK_Rubro_RubroTablaItem7    Script Date: 07/30/2012 17:29:44 ******/
ALTER TABLE Rubro  ADD  CONSTRAINT FK_Rubro_RubroTablaItem7 FOREIGN KEY(rubti_id8)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Rubro_RubroTablaItem7
;
/****** Object:  ForeignKey FK_Rubro_RubroTablaItem8    Script Date: 07/30/2012 17:29:44 ******/
ALTER TABLE Rubro  ADD  CONSTRAINT FK_Rubro_RubroTablaItem8 FOREIGN KEY(rubti_id9)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Rubro_RubroTablaItem8
;
/****** Object:  ForeignKey FK_Rubro_RubroTablaItem9    Script Date: 07/30/2012 17:29:44 ******/
ALTER TABLE Rubro  ADD  CONSTRAINT FK_Rubro_RubroTablaItem9 FOREIGN KEY(rubti_id10)
REFERENCES RubroTablaItem (rubti_id)
;
-- FK_Rubro_RubroTablaItem9
;
/****** Object:  ForeignKey FK_Rubro_Usuario    Script Date: 07/30/2012 17:29:44 ******/
ALTER TABLE Rubro  ADD  CONSTRAINT FK_Rubro_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Rubro_Usuario
;
/****** Object:  ForeignKey FK_RubroTablaItem_RubroTabla    Script Date: 07/30/2012 17:29:48 ******/
ALTER TABLE RubroTablaItem  ADD  CONSTRAINT FK_RubroTablaItem_RubroTabla FOREIGN KEY(rubt_id)
REFERENCES RubroTabla (rubt_id)
;
-- FK_RubroTablaItem_RubroTabla
;
/****** Object:  ForeignKey FK_SindicatoCategoria_Sindicato    Script Date: 07/30/2012 17:29:52 ******/
ALTER TABLE SindicatoCategoria  ADD  CONSTRAINT FK_SindicatoCategoria_Sindicato FOREIGN KEY(sind_id)
REFERENCES Sindicato (sind_id)
;
-- FK_SindicatoCategoria_Sindicato
;
/****** Object:  ForeignKey FK_SindicatoConvenio_Sindicato    Script Date: 07/30/2012 17:29:54 ******/
ALTER TABLE SindicatoConvenio  ADD  CONSTRAINT FK_SindicatoConvenio_Sindicato FOREIGN KEY(sind_id)
REFERENCES Sindicato (sind_id)
;
-- FK_SindicatoConvenio_Sindicato
;
/****** Object:  ForeignKey FK_SindicatoConvenioCategoria_Sindicato    Script Date: 07/30/2012 17:29:56 ******/
ALTER TABLE SindicatoConvenioCategoria  ADD  CONSTRAINT FK_SindicatoConvenioCategoria_Sindicato FOREIGN KEY(sind_id)
REFERENCES Sindicato (sind_id)
;
-- FK_SindicatoConvenioCategoria_Sindicato
;
/****** Object:  ForeignKey FK_SindicatoConvenioCategoria_SindicatoCategoria    Script Date: 07/30/2012 17:29:56 ******/
ALTER TABLE SindicatoConvenioCategoria  ADD  CONSTRAINT FK_SindicatoConvenioCategoria_SindicatoCategoria FOREIGN KEY(sindca_id)
REFERENCES SindicatoCategoria (sindca_id)
;
-- FK_SindicatoConvenioCategoria_SindicatoCategoria
;
/****** Object:  ForeignKey FK_SindicatoConvenioCategoria_SindicatoConvenio    Script Date: 07/30/2012 17:29:56 ******/
ALTER TABLE SindicatoConvenioCategoria  ADD  CONSTRAINT FK_SindicatoConvenioCategoria_SindicatoConvenio FOREIGN KEY(sindco_id)
REFERENCES SindicatoConvenio (sindco_id)
;
-- FK_SindicatoConvenioCategoria_SindicatoConvenio
;
/****** Object:  ForeignKey FK_Stock_DepositoLogicoDestino    Script Date: 07/30/2012 17:30:02 ******/
ALTER TABLE Stock  ADD  CONSTRAINT FK_Stock_DepositoLogicoDestino FOREIGN KEY(depl_id_destino)
REFERENCES DepositoLogico (depl_id)
;
-- FK_Stock_DepositoLogicoDestino
;
/****** Object:  ForeignKey FK_Stock_DepositoLogicoOrigen    Script Date: 07/30/2012 17:30:02 ******/
ALTER TABLE Stock  ADD  CONSTRAINT FK_Stock_DepositoLogicoOrigen FOREIGN KEY(depl_id_origen)
REFERENCES DepositoLogico (depl_id)
;
-- FK_Stock_DepositoLogicoOrigen
;
/****** Object:  ForeignKey FK_Stock_Documento    Script Date: 07/30/2012 17:30:02 ******/
ALTER TABLE Stock  ADD  CONSTRAINT FK_Stock_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_Stock_Documento
;
/****** Object:  ForeignKey FK_Stock_DocumentoTipo    Script Date: 07/30/2012 17:30:03 ******/
ALTER TABLE Stock  ADD  CONSTRAINT FK_Stock_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_Stock_DocumentoTipo
;
/****** Object:  ForeignKey FK_Stock_Legajo    Script Date: 07/30/2012 17:30:03 ******/
ALTER TABLE Stock  ADD  CONSTRAINT FK_Stock_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_Stock_Legajo
;
/****** Object:  ForeignKey FK_Stock_Sucursal    Script Date: 07/30/2012 17:30:03 ******/
ALTER TABLE Stock  ADD  CONSTRAINT FK_Stock_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_Stock_Sucursal
;
/****** Object:  ForeignKey FK_StockCache_DepositoLogico    Script Date: 07/30/2012 17:30:04 ******/
ALTER TABLE StockCache  ADD  CONSTRAINT FK_StockCache_DepositoLogico FOREIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_StockCache_DepositoLogico
;
/****** Object:  ForeignKey FK_StockCache_Producto    Script Date: 07/30/2012 17:30:04 ******/
ALTER TABLE StockCache  ADD  CONSTRAINT FK_StockCache_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_StockCache_Producto
;
/****** Object:  ForeignKey FK_StockCache_ProductoNumeroSerie    Script Date: 07/30/2012 17:30:05 ******/
ALTER TABLE StockCache  ADD  CONSTRAINT FK_StockCache_ProductoNumeroSerie FOREIGN KEY(prns_id)
REFERENCES ProductoNumeroSerie (prns_id)
;
-- FK_StockCache_ProductoNumeroSerie
;
/****** Object:  ForeignKey FK_StockCache_StockLote    Script Date: 07/30/2012 17:30:05 ******/
ALTER TABLE StockCache  ADD  CONSTRAINT FK_StockCache_StockLote FOREIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_StockCache_StockLote
;
/****** Object:  ForeignKey FK_StockCliente_Cliente    Script Date: 07/30/2012 17:30:08 ******/
ALTER TABLE StockCliente  ADD  CONSTRAINT FK_StockCliente_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_StockCliente_Cliente
;
/****** Object:  ForeignKey FK_StockCliente_DepositoLogicoDestino    Script Date: 07/30/2012 17:30:09 ******/
ALTER TABLE StockCliente  ADD  CONSTRAINT FK_StockCliente_DepositoLogicoDestino FOREIGN KEY(depl_id_destino)
REFERENCES DepositoLogico (depl_id)
;
-- FK_StockCliente_DepositoLogicoDestino
;
/****** Object:  ForeignKey FK_StockCliente_DepositoLogicoOrigen    Script Date: 07/30/2012 17:30:09 ******/
ALTER TABLE StockCliente  ADD  CONSTRAINT FK_StockCliente_DepositoLogicoOrigen FOREIGN KEY(depl_id_origen)
REFERENCES DepositoLogico (depl_id)
;
-- FK_StockCliente_DepositoLogicoOrigen
;
/****** Object:  ForeignKey FK_StockCliente_Documento    Script Date: 07/30/2012 17:30:09 ******/
ALTER TABLE StockCliente  ADD  CONSTRAINT FK_StockCliente_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_StockCliente_Documento
;
/****** Object:  ForeignKey FK_StockCliente_DocumentoTipo    Script Date: 07/30/2012 17:30:09 ******/
ALTER TABLE StockCliente  ADD  CONSTRAINT FK_StockCliente_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_StockCliente_DocumentoTipo
;
/****** Object:  ForeignKey FK_StockCliente_Legajo    Script Date: 07/30/2012 17:30:09 ******/
ALTER TABLE StockCliente  ADD  CONSTRAINT FK_StockCliente_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_StockCliente_Legajo
;
/****** Object:  ForeignKey FK_StockCliente_Stock    Script Date: 07/30/2012 17:30:09 ******/
ALTER TABLE StockCliente  ADD  CONSTRAINT FK_StockCliente_Stock FOREIGN KEY(st_id)
REFERENCES Stock (st_id)
;
-- FK_StockCliente_Stock
;
/****** Object:  ForeignKey FK_StockCliente_Sucursal    Script Date: 07/30/2012 17:30:09 ******/
ALTER TABLE StockCliente  ADD  CONSTRAINT FK_StockCliente_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_StockCliente_Sucursal
;
/****** Object:  ForeignKey FK_StockItem_DepositoLogico    Script Date: 07/30/2012 17:30:16 ******/
ALTER TABLE StockItem  ADD  CONSTRAINT FK_StockItem_DepositoLogico FOREIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_StockItem_DepositoLogico
;
/****** Object:  ForeignKey FK_StockItem_Producto    Script Date: 07/30/2012 17:30:16 ******/
ALTER TABLE StockItem  ADD  CONSTRAINT FK_StockItem_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_StockItem_Producto
;
/****** Object:  ForeignKey FK_StockItem_ProductoKit    Script Date: 07/30/2012 17:30:16 ******/
ALTER TABLE StockItem  ADD  CONSTRAINT FK_StockItem_ProductoKit FOREIGN KEY(pr_id_kit)
REFERENCES Producto (pr_id)
;
-- FK_StockItem_ProductoKit
;
/****** Object:  ForeignKey FK_StockItem_ProductoNumeroSerie    Script Date: 07/30/2012 17:30:16 ******/
ALTER TABLE StockItem  ADD  CONSTRAINT FK_StockItem_ProductoNumeroSerie FOREIGN KEY(prns_id)
REFERENCES ProductoNumeroSerie (prns_id)
;
-- FK_StockItem_ProductoNumeroSerie
;
/****** Object:  ForeignKey FK_StockItem_ProductoSerieKit    Script Date: 07/30/2012 17:30:16 ******/
ALTER TABLE StockItem  ADD  CONSTRAINT FK_StockItem_ProductoSerieKit FOREIGN KEY(prsk_id)
REFERENCES ProductoSerieKit (prsk_id)
;
-- FK_StockItem_ProductoSerieKit
;
/****** Object:  ForeignKey FK_StockItem_Stock    Script Date: 07/30/2012 17:30:16 ******/
ALTER TABLE StockItem  ADD  CONSTRAINT FK_StockItem_Stock FOREIGN KEY(st_id)
REFERENCES Stock (st_id)
;
-- FK_StockItem_Stock
;
/****** Object:  ForeignKey FK_StockItem_StockItemKit    Script Date: 07/30/2012 17:30:16 ******/
ALTER TABLE StockItem  ADD  CONSTRAINT FK_StockItem_StockItemKit FOREIGN KEY(stik_id)
REFERENCES StockItemKit (stik_id)
;
-- FK_StockItem_StockItemKit
;
/****** Object:  ForeignKey FK_StockItem_StockLote    Script Date: 07/30/2012 17:30:16 ******/
ALTER TABLE StockItem  ADD  CONSTRAINT FK_StockItem_StockLote FOREIGN KEY(stl_id)
REFERENCES StockLote (stl_id)
;
-- FK_StockItem_StockLote
;
/****** Object:  ForeignKey FK_StockItemKit_Producto    Script Date: 07/30/2012 17:30:18 ******/
ALTER TABLE StockItemKit  ADD  CONSTRAINT FK_StockItemKit_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_StockItemKit_Producto
;
/****** Object:  ForeignKey FK_StockItemKit_Stock    Script Date: 07/30/2012 17:30:18 ******/
ALTER TABLE StockItemKit  ADD  CONSTRAINT FK_StockItemKit_Stock FOREIGN KEY(st_id)
REFERENCES Stock (st_id)
;
-- FK_StockItemKit_Stock
;
/****** Object:  ForeignKey FK_StockItemTMP_StockTMP    Script Date: 07/30/2012 17:30:21 ******/
ALTER TABLE StockItemTMP  ADD  CONSTRAINT FK_StockItemTMP_StockTMP FOREIGN KEY(stTMP_id)
REFERENCES StockTMP (stTMP_id)
;
-- FK_StockItemTMP_StockTMP
;
/****** Object:  ForeignKey FK_StockLote_Pais    Script Date: 07/30/2012 17:30:24 ******/
ALTER TABLE StockLote  ADD  CONSTRAINT FK_StockLote_Pais FOREIGN KEY(pa_id)
REFERENCES Pais (pa_id)
;
-- FK_StockLote_Pais
;
/****** Object:  ForeignKey FK_StockLote_Producto    Script Date: 07/30/2012 17:30:24 ******/
ALTER TABLE StockLote  ADD  CONSTRAINT FK_StockLote_Producto FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- FK_StockLote_Producto
;
/****** Object:  ForeignKey FK_StockLote_StockLote    Script Date: 07/30/2012 17:30:24 ******/
ALTER TABLE StockLote  ADD  CONSTRAINT FK_StockLote_StockLote FOREIGN KEY(stl_id_padre)
REFERENCES StockLote (stl_id)
;
-- FK_StockLote_StockLote
;
/****** Object:  ForeignKey FK_StockLote_Usuario    Script Date: 07/30/2012 17:30:25 ******/
ALTER TABLE StockLote  ADD  CONSTRAINT FK_StockLote_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_StockLote_Usuario
;
/****** Object:  ForeignKey FK_StockProveedor_DepositoLogicoDestino    Script Date: 07/30/2012 17:30:28 ******/
ALTER TABLE StockProveedor  ADD  CONSTRAINT FK_StockProveedor_DepositoLogicoDestino FOREIGN KEY(depl_id_destino)
REFERENCES DepositoLogico (depl_id)
;
-- FK_StockProveedor_DepositoLogicoDestino
;
/****** Object:  ForeignKey FK_StockProveedor_DepositoLogicoOrigen    Script Date: 07/30/2012 17:30:28 ******/
ALTER TABLE StockProveedor  ADD  CONSTRAINT FK_StockProveedor_DepositoLogicoOrigen FOREIGN KEY(depl_id_origen)
REFERENCES DepositoLogico (depl_id)
;
-- FK_StockProveedor_DepositoLogicoOrigen
;
/****** Object:  ForeignKey FK_StockProveedor_Documento    Script Date: 07/30/2012 17:30:29 ******/
ALTER TABLE StockProveedor  ADD  CONSTRAINT FK_StockProveedor_Documento FOREIGN KEY(doc_id)
REFERENCES Documento (doc_id)
;
-- FK_StockProveedor_Documento
;
/****** Object:  ForeignKey FK_StockProveedor_DocumentoTipo    Script Date: 07/30/2012 17:30:29 ******/
ALTER TABLE StockProveedor  ADD  CONSTRAINT FK_StockProveedor_DocumentoTipo FOREIGN KEY(doct_id)
REFERENCES DocumentoTipo (doct_id)
;
-- FK_StockProveedor_DocumentoTipo
;
/****** Object:  ForeignKey FK_StockProveedor_Legajo    Script Date: 07/30/2012 17:30:29 ******/
ALTER TABLE StockProveedor  ADD  CONSTRAINT FK_StockProveedor_Legajo FOREIGN KEY(lgj_id)
REFERENCES Legajo (lgj_id)
;
-- FK_StockProveedor_Legajo
;
/****** Object:  ForeignKey FK_StockProveedor_Proveedor    Script Date: 07/30/2012 17:30:29 ******/
ALTER TABLE StockProveedor  ADD  CONSTRAINT FK_StockProveedor_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_StockProveedor_Proveedor
;
/****** Object:  ForeignKey FK_StockProveedor_Stock    Script Date: 07/30/2012 17:30:29 ******/
ALTER TABLE StockProveedor  ADD  CONSTRAINT FK_StockProveedor_Stock FOREIGN KEY(st_id)
REFERENCES Stock (st_id)
;
-- FK_StockProveedor_Stock
;
/****** Object:  ForeignKey FK_StockProveedor_Sucursal    Script Date: 07/30/2012 17:30:29 ******/
ALTER TABLE StockProveedor  ADD  CONSTRAINT FK_StockProveedor_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_StockProveedor_Sucursal
;
/****** Object:  ForeignKey StockValorModifico_FK    Script Date: 07/30/2012 17:30:38 ******/
ALTER TABLE StockValor  ADD  CONSTRAINT StockValorModifico_FK FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- StockValorModifico_FK
;
/****** Object:  ForeignKey StockValorItem_Producto_FK    Script Date: 07/30/2012 17:30:39 ******/
ALTER TABLE StockValorItem  ADD  CONSTRAINT StockValorItem_Producto_FK FOREIGN KEY(pr_id)
REFERENCES Producto (pr_id)
;
-- StockValorItem_Producto_FK
;
/****** Object:  ForeignKey stockValorItem_StockValor_FK    Script Date: 07/30/2012 17:30:39 ******/
ALTER TABLE StockValorItem  ADD  CONSTRAINT stockValorItem_StockValor_FK FOREIGN KEY(stv_id)
REFERENCES StockValor (stv_id)
;
-- stockValorItem_StockValor_FK
;
/****** Object:  ForeignKey FK_Sucursal_Usuario    Script Date: 07/30/2012 17:30:41 ******/
ALTER TABLE Sucursal  ADD  CONSTRAINT FK_Sucursal_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Sucursal_Usuario
;
/****** Object:  ForeignKey FK_TablaItem_Tabla    Script Date: 07/30/2012 17:30:54 ******/
ALTER TABLE TablaItem  ADD  CONSTRAINT FK_TablaItem_Tabla FOREIGN KEY(tbl_id)
REFERENCES Tabla (tbl_id)
;
-- FK_TablaItem_Tabla
;
/****** Object:  ForeignKey FK_TablaItem_TablaHelp    Script Date: 07/30/2012 17:30:54 ******/
ALTER TABLE TablaItem  ADD  CONSTRAINT FK_TablaItem_TablaHelp FOREIGN KEY(tbl_id_help)
REFERENCES Tabla (tbl_id)
;
-- FK_TablaItem_TablaHelp
;
/****** Object:  ForeignKey FK_Talonario_Empresa    Script Date: 07/30/2012 17:30:58 ******/
ALTER TABLE Talonario  ADD  CONSTRAINT FK_Talonario_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_Talonario_Empresa
;
/****** Object:  ForeignKey FK_Talonario_Usuario    Script Date: 07/30/2012 17:30:58 ******/
ALTER TABLE Talonario  ADD  CONSTRAINT FK_Talonario_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Talonario_Usuario
;
/****** Object:  ForeignKey FK_Tarea_AlarmaItem    Script Date: 07/30/2012 17:31:07 ******/
ALTER TABLE Tarea  ADD  CONSTRAINT FK_Tarea_AlarmaItem FOREIGN KEY(ali_id)
REFERENCES AlarmaItem (ali_id)
;
-- FK_Tarea_AlarmaItem
;
/****** Object:  ForeignKey FK_Tarea_AlarmaItemTipo    Script Date: 07/30/2012 17:31:07 ******/
ALTER TABLE Tarea  ADD  CONSTRAINT FK_Tarea_AlarmaItemTipo FOREIGN KEY(alit_id)
REFERENCES AlarmaItemTipo (alit_id)
;
-- FK_Tarea_AlarmaItemTipo
;
/****** Object:  ForeignKey FK_Tarea_Cliente    Script Date: 07/30/2012 17:31:07 ******/
ALTER TABLE Tarea  ADD  CONSTRAINT FK_Tarea_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_Tarea_Cliente
;
/****** Object:  ForeignKey FK_Tarea_Contacto    Script Date: 07/30/2012 17:31:07 ******/
ALTER TABLE Tarea  ADD  CONSTRAINT FK_Tarea_Contacto FOREIGN KEY(cont_id)
REFERENCES Contacto (cont_id)
;
-- FK_Tarea_Contacto
;
/****** Object:  ForeignKey FK_Tarea_Departamento    Script Date: 07/30/2012 17:31:07 ******/
ALTER TABLE Tarea  ADD  CONSTRAINT FK_Tarea_Departamento FOREIGN KEY(dpto_id)
REFERENCES Departamento (dpto_id)
;
-- FK_Tarea_Departamento
;
/****** Object:  ForeignKey FK_Tarea_Objetivo    Script Date: 07/30/2012 17:31:07 ******/
ALTER TABLE Tarea  ADD  CONSTRAINT FK_Tarea_Objetivo FOREIGN KEY(obje_id)
REFERENCES Objetivo (obje_id)
;
-- FK_Tarea_Objetivo
;
/****** Object:  ForeignKey FK_Tarea_OrdenServicio    Script Date: 07/30/2012 17:31:08 ******/
ALTER TABLE Tarea  ADD  CONSTRAINT FK_Tarea_OrdenServicio FOREIGN KEY(os_id)
REFERENCES OrdenServicio (os_id)
;
-- FK_Tarea_OrdenServicio
;
/****** Object:  ForeignKey FK_Tarea_Prioridad    Script Date: 07/30/2012 17:31:08 ******/
ALTER TABLE Tarea  ADD  CONSTRAINT FK_Tarea_Prioridad FOREIGN KEY(prio_id)
REFERENCES Prioridad (prio_id)
;
-- FK_Tarea_Prioridad
;
/****** Object:  ForeignKey FK_Tarea_ProductoNumeroSerie    Script Date: 07/30/2012 17:31:08 ******/
ALTER TABLE Tarea  ADD  CONSTRAINT FK_Tarea_ProductoNumeroSerie FOREIGN KEY(prns_id)
REFERENCES ProductoNumeroSerie (prns_id)
;
-- FK_Tarea_ProductoNumeroSerie
;
/****** Object:  ForeignKey FK_Tarea_Proyecto    Script Date: 07/30/2012 17:31:08 ******/
ALTER TABLE Tarea  ADD  CONSTRAINT FK_Tarea_Proyecto FOREIGN KEY(proy_id)
REFERENCES Proyecto (proy_id)
;
-- FK_Tarea_Proyecto
;
/****** Object:  ForeignKey FK_Tarea_ProyectoItem    Script Date: 07/30/2012 17:31:08 ******/
ALTER TABLE Tarea  ADD  CONSTRAINT FK_Tarea_ProyectoItem FOREIGN KEY(proyi_id)
REFERENCES ProyectoItem (proyi_id)
;
-- FK_Tarea_ProyectoItem
;
/****** Object:  ForeignKey FK_Tarea_Rubro    Script Date: 07/30/2012 17:31:08 ******/
ALTER TABLE Tarea  ADD  CONSTRAINT FK_Tarea_Rubro FOREIGN KEY(rub_id)
REFERENCES Rubro (rub_id)
;
-- FK_Tarea_Rubro
;
/****** Object:  ForeignKey FK_Tarea_Tarea    Script Date: 07/30/2012 17:31:08 ******/
ALTER TABLE Tarea  ADD  CONSTRAINT FK_Tarea_Tarea FOREIGN KEY(tar_id_padre)
REFERENCES Tarea (tar_id)
;
-- FK_Tarea_Tarea
;
/****** Object:  ForeignKey FK_Tarea_TareaEstado    Script Date: 07/30/2012 17:31:08 ******/
ALTER TABLE Tarea  ADD  CONSTRAINT FK_Tarea_TareaEstado FOREIGN KEY(tarest_id)
REFERENCES TareaEstado (tarest_id)
;
-- FK_Tarea_TareaEstado
;
/****** Object:  ForeignKey FK_Tarea_Usuario    Script Date: 07/30/2012 17:31:08 ******/
ALTER TABLE Tarea  ADD  CONSTRAINT FK_Tarea_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Tarea_Usuario
;
/****** Object:  ForeignKey FK_Tarea_Usuario1    Script Date: 07/30/2012 17:31:08 ******/
ALTER TABLE Tarea  ADD  CONSTRAINT FK_Tarea_Usuario1 FOREIGN KEY(us_id_responsable)
REFERENCES Usuario (us_id)
;
-- FK_Tarea_Usuario1
;
/****** Object:  ForeignKey FK_Tarea_Usuario2    Script Date: 07/30/2012 17:31:09 ******/
ALTER TABLE Tarea  ADD  CONSTRAINT FK_Tarea_Usuario2 FOREIGN KEY(us_id_asignador)
REFERENCES Usuario (us_id)
;
-- FK_Tarea_Usuario2
;
/****** Object:  ForeignKey FK_Tarea_UsuarioAlta    Script Date: 07/30/2012 17:31:09 ******/
ALTER TABLE Tarea  ADD  CONSTRAINT FK_Tarea_UsuarioAlta FOREIGN KEY(us_id_alta)
REFERENCES Usuario (us_id)
;
-- FK_Tarea_UsuarioAlta
;
/****** Object:  ForeignKey FK_TareaEstado_Usuario    Script Date: 07/30/2012 17:31:11 ******/
ALTER TABLE TareaEstado  ADD  CONSTRAINT FK_TareaEstado_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_TareaEstado_Usuario
;
/****** Object:  ForeignKey FK_Tarifa_Usuario    Script Date: 07/30/2012 17:31:14 ******/
ALTER TABLE Tarifa  ADD  CONSTRAINT FK_Tarifa_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Tarifa_Usuario
;
/****** Object:  ForeignKey FK_TarifaTransporte    Script Date: 07/30/2012 17:31:14 ******/
ALTER TABLE Tarifa  ADD  CONSTRAINT FK_TarifaTransporte FOREIGN KEY(trans_id)
REFERENCES Transporte (trans_id)
;
-- FK_TarifaTransporte
;
/****** Object:  ForeignKey FK_TarifaGasto_Gasto    Script Date: 07/30/2012 17:31:16 ******/
ALTER TABLE TarifaGasto  ADD  CONSTRAINT FK_TarifaGasto_Gasto FOREIGN KEY(gto_id)
REFERENCES Gasto (gto_id)
;
-- FK_TarifaGasto_Gasto
;
/****** Object:  ForeignKey FK_TarifaGasto_Tarifa    Script Date: 07/30/2012 17:31:16 ******/
ALTER TABLE TarifaGasto  ADD  CONSTRAINT FK_TarifaGasto_Tarifa FOREIGN KEY(trf_id)
REFERENCES Tarifa (trf_id)
;
-- FK_TarifaGasto_Tarifa
;
/****** Object:  ForeignKey FK_TarifaGasto_Usuario    Script Date: 07/30/2012 17:31:16 ******/
ALTER TABLE TarifaGasto  ADD  CONSTRAINT FK_TarifaGasto_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_TarifaGasto_Usuario
;
/****** Object:  ForeignKey FK_TarifaItem_Usuario    Script Date: 07/30/2012 17:31:21 ******/
ALTER TABLE TarifaItem  ADD  CONSTRAINT FK_TarifaItem_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_TarifaItem_Usuario
;
/****** Object:  ForeignKey FK_TarifaItemPuertoDestino    Script Date: 07/30/2012 17:31:21 ******/
ALTER TABLE TarifaItem  ADD  CONSTRAINT FK_TarifaItemPuertoDestino FOREIGN KEY(pue_id_destino)
REFERENCES Puerto (pue_id)
;
-- FK_TarifaItemPuertoDestino
;
/****** Object:  ForeignKey FK_TarifaItemPuertoOrigen    Script Date: 07/30/2012 17:31:22 ******/
ALTER TABLE TarifaItem  ADD  CONSTRAINT FK_TarifaItemPuertoOrigen FOREIGN KEY(pue_id_origen)
REFERENCES Puerto (pue_id)
;
-- FK_TarifaItemPuertoOrigen
;
/****** Object:  ForeignKey FK_TarifaItemTarifa    Script Date: 07/30/2012 17:31:22 ******/
ALTER TABLE TarifaItem  ADD  CONSTRAINT FK_TarifaItemTarifa FOREIGN KEY(trf_id)
REFERENCES Tarifa (trf_id)
;
-- FK_TarifaItemTarifa
;
/****** Object:  ForeignKey FK_TarifarioAltura_Tarifario    Script Date: 07/30/2012 17:31:25 ******/
ALTER TABLE TarifarioAltura  ADD  CONSTRAINT FK_TarifarioAltura_Tarifario FOREIGN KEY(tf_id)
REFERENCES Tarifario (tf_id)
;
-- FK_TarifarioAltura_Tarifario
;
/****** Object:  ForeignKey FK_TarifarioAltura_Zona    Script Date: 07/30/2012 17:31:25 ******/
ALTER TABLE TarifarioAltura  ADD  CONSTRAINT FK_TarifarioAltura_Zona FOREIGN KEY(zon_id)
REFERENCES Zona (zon_id)
;
-- FK_TarifarioAltura_Zona
;
/****** Object:  ForeignKey FK_TarifarioCalle_Calle    Script Date: 07/30/2012 17:31:26 ******/
ALTER TABLE TarifarioCalle  ADD  CONSTRAINT FK_TarifarioCalle_Calle FOREIGN KEY(calle_id)
REFERENCES Calle (calle_id)
;
-- FK_TarifarioCalle_Calle
;
/****** Object:  ForeignKey FK_TarifarioCalle_Tarifario    Script Date: 07/30/2012 17:31:26 ******/
ALTER TABLE TarifarioCalle  ADD  CONSTRAINT FK_TarifarioCalle_Tarifario FOREIGN KEY(tf_id)
REFERENCES Tarifario (tf_id)
;
-- FK_TarifarioCalle_Tarifario
;
/****** Object:  ForeignKey FK_TarifarioParalela_Calle    Script Date: 07/30/2012 17:31:28 ******/
ALTER TABLE TarifarioParalela  ADD  CONSTRAINT FK_TarifarioParalela_Calle FOREIGN KEY(calle_id)
REFERENCES Calle (calle_id)
;
-- FK_TarifarioParalela_Calle
;
/****** Object:  ForeignKey FK_TarifarioParalela_Tarifario    Script Date: 07/30/2012 17:31:28 ******/
ALTER TABLE TarifarioParalela  ADD  CONSTRAINT FK_TarifarioParalela_Tarifario FOREIGN KEY(tf_id)
REFERENCES Tarifario (tf_id)
;
-- FK_TarifarioParalela_Tarifario
;
/****** Object:  ForeignKey FK_TarifarioParalela_TarifarioCalle    Script Date: 07/30/2012 17:31:28 ******/
ALTER TABLE TarifarioParalela  ADD  CONSTRAINT FK_TarifarioParalela_TarifarioCalle FOREIGN KEY(tfcalle_id)
REFERENCES TarifarioCalle (tfcalle_id)
;
-- FK_TarifarioParalela_TarifarioCalle
;
/****** Object:  ForeignKey FK_TarjetaCredito_CuentaBanco    Script Date: 07/30/2012 17:31:31 ******/
ALTER TABLE TarjetaCredito  ADD  CONSTRAINT FK_TarjetaCredito_CuentaBanco FOREIGN KEY(cue_id_banco)
REFERENCES Cuenta (cue_id)
;
-- FK_TarjetaCredito_CuentaBanco
;
/****** Object:  ForeignKey FK_TarjetaCredito_CuentaComision    Script Date: 07/30/2012 17:31:31 ******/
ALTER TABLE TarjetaCredito  ADD  CONSTRAINT FK_TarjetaCredito_CuentaComision FOREIGN KEY(cue_id_comision)
REFERENCES Cuenta (cue_id)
;
-- FK_TarjetaCredito_CuentaComision
;
/****** Object:  ForeignKey FK_TarjetaCredito_CuentaEnCartera    Script Date: 07/30/2012 17:31:31 ******/
ALTER TABLE TarjetaCredito  ADD  CONSTRAINT FK_TarjetaCredito_CuentaEnCartera FOREIGN KEY(cue_id_encartera)
REFERENCES Cuenta (cue_id)
;
-- FK_TarjetaCredito_CuentaEnCartera
;
/****** Object:  ForeignKey FK_TarjetaCredito_CuentaPresentado    Script Date: 07/30/2012 17:31:31 ******/
ALTER TABLE TarjetaCredito  ADD  CONSTRAINT FK_TarjetaCredito_CuentaPresentado FOREIGN KEY(cue_id_presentado)
REFERENCES Cuenta (cue_id)
;
-- FK_TarjetaCredito_CuentaPresentado
;
/****** Object:  ForeignKey FK_TarjetaCredito_CuentaRechazo    Script Date: 07/30/2012 17:31:31 ******/
ALTER TABLE TarjetaCredito  ADD  CONSTRAINT FK_TarjetaCredito_CuentaRechazo FOREIGN KEY(cue_id_rechazo)
REFERENCES Cuenta (cue_id)
;
-- FK_TarjetaCredito_CuentaRechazo
;
/****** Object:  ForeignKey FK_TarjetaCredito_Empresa    Script Date: 07/30/2012 17:31:32 ******/
ALTER TABLE TarjetaCredito  ADD  CONSTRAINT FK_TarjetaCredito_Empresa FOREIGN KEY(emp_id)
REFERENCES Empresa (emp_id)
;
-- FK_TarjetaCredito_Empresa
;
/****** Object:  ForeignKey FK_TarjetaCredito_Usuario    Script Date: 07/30/2012 17:31:32 ******/
ALTER TABLE TarjetaCredito  ADD  CONSTRAINT FK_TarjetaCredito_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_TarjetaCredito_Usuario
;
/****** Object:  ForeignKey FK_TarjetaCreditoCuota_TarjetaCredito    Script Date: 07/30/2012 17:31:33 ******/
ALTER TABLE TarjetaCreditoCuota  ADD  CONSTRAINT FK_TarjetaCreditoCuota_TarjetaCredito FOREIGN KEY(tjc_id)
REFERENCES TarjetaCredito (tjc_id)
;
-- FK_TarjetaCreditoCuota_TarjetaCredito
;
/****** Object:  ForeignKey FK_TarjetaCreditoCuota_Usuario    Script Date: 07/30/2012 17:31:34 ******/
ALTER TABLE TarjetaCreditoCuota  ADD  CONSTRAINT FK_TarjetaCreditoCuota_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_TarjetaCreditoCuota_Usuario
;
/****** Object:  ForeignKey FK_TarjetaCreditoCupon_Cliente    Script Date: 07/30/2012 17:31:37 ******/
ALTER TABLE TarjetaCreditoCupon  ADD  CONSTRAINT FK_TarjetaCreditoCupon_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_TarjetaCreditoCupon_Cliente
;
/****** Object:  ForeignKey FK_TarjetaCreditoCupon_Cobranza    Script Date: 07/30/2012 17:31:37 ******/
ALTER TABLE TarjetaCreditoCupon  ADD  CONSTRAINT FK_TarjetaCreditoCupon_Cobranza FOREIGN KEY(cobz_id)
REFERENCES Cobranza (cobz_id)
;
-- FK_TarjetaCreditoCupon_Cobranza
;
/****** Object:  ForeignKey FK_TarjetaCreditoCupon_Moneda    Script Date: 07/30/2012 17:31:38 ******/
ALTER TABLE TarjetaCreditoCupon  ADD  CONSTRAINT FK_TarjetaCreditoCupon_Moneda FOREIGN KEY(mon_id)
REFERENCES Moneda (mon_id)
;
-- FK_TarjetaCreditoCupon_Moneda
;
/****** Object:  ForeignKey FK_TarjetaCreditoCupon_TarjetaCredito    Script Date: 07/30/2012 17:31:38 ******/
ALTER TABLE TarjetaCreditoCupon  ADD  CONSTRAINT FK_TarjetaCreditoCupon_TarjetaCredito FOREIGN KEY(tjc_id)
REFERENCES TarjetaCredito (tjc_id)
;
-- FK_TarjetaCreditoCupon_TarjetaCredito
;
/****** Object:  ForeignKey FK_TarjetaCreditoCupon_TarjetaCreditoCuota    Script Date: 07/30/2012 17:31:38 ******/
ALTER TABLE TarjetaCreditoCupon  ADD  CONSTRAINT FK_TarjetaCreditoCupon_TarjetaCreditoCuota FOREIGN KEY(tjccu_id)
REFERENCES TarjetaCreditoCuota (tjccu_id)
;
-- FK_TarjetaCreditoCupon_TarjetaCreditoCuota
;
/****** Object:  ForeignKey FK_TasaImpositiva_Cuenta    Script Date: 07/30/2012 17:31:40 ******/
ALTER TABLE TasaImpositiva  ADD  CONSTRAINT FK_TasaImpositiva_Cuenta FOREIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_TasaImpositiva_Cuenta
;
/****** Object:  ForeignKey FK_TasaImpositiva_Usuario    Script Date: 07/30/2012 17:31:41 ******/
ALTER TABLE TasaImpositiva  ADD  CONSTRAINT FK_TasaImpositiva_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_TasaImpositiva_Usuario
;
/****** Object:  ForeignKey FK_TipoOperacion_Usuario    Script Date: 07/30/2012 17:31:43 ******/
ALTER TABLE TipoOperacion  ADD  CONSTRAINT FK_TipoOperacion_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_TipoOperacion_Usuario
;
/****** Object:  ForeignKey FK_TipoOperacionCuentaGrupo_Cuenta    Script Date: 07/30/2012 17:31:44 ******/
ALTER TABLE TipoOperacionCuentaGrupo  ADD  CONSTRAINT FK_TipoOperacionCuentaGrupo_Cuenta FOREIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_TipoOperacionCuentaGrupo_Cuenta
;
/****** Object:  ForeignKey FK_TipoOperacionCuentaGrupo_CuentaGrupo    Script Date: 07/30/2012 17:31:44 ******/
ALTER TABLE TipoOperacionCuentaGrupo  ADD  CONSTRAINT FK_TipoOperacionCuentaGrupo_CuentaGrupo FOREIGN KEY(cueg_id)
REFERENCES CuentaGrupo (cueg_id)
;
-- FK_TipoOperacionCuentaGrupo_CuentaGrupo
;
/****** Object:  ForeignKey FK_TipoOperacionCuentaGrupo_TipoOperacion    Script Date: 07/30/2012 17:31:45 ******/
ALTER TABLE TipoOperacionCuentaGrupo  ADD  CONSTRAINT FK_TipoOperacionCuentaGrupo_TipoOperacion FOREIGN KEY(to_id)
REFERENCES TipoOperacion (to_id)
;
-- FK_TipoOperacionCuentaGrupo_TipoOperacion
;
/****** Object:  ForeignKey FK_TipoOperacionCuentaGrupo_Usuario    Script Date: 07/30/2012 17:31:45 ******/
ALTER TABLE TipoOperacionCuentaGrupo  ADD  CONSTRAINT FK_TipoOperacionCuentaGrupo_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_TipoOperacionCuentaGrupo_Usuario
;
/****** Object:  ForeignKey FK_TrabajoImpresionItem_TrabajoImpresion    Script Date: 07/30/2012 17:31:50 ******/
ALTER TABLE TrabajoImpresionItem  ADD  CONSTRAINT FK_TrabajoImpresionItem_TrabajoImpresion FOREIGN KEY(timp_id)
REFERENCES TrabajoImpresion (timp_id)
;
-- FK_TrabajoImpresionItem_TrabajoImpresion
;
/****** Object:  ForeignKey FK_Transporte_Proveedor    Script Date: 07/30/2012 17:31:55 ******/
ALTER TABLE Transporte  ADD  CONSTRAINT FK_Transporte_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_Transporte_Proveedor
;
/****** Object:  ForeignKey FK_Transporte_Provincia    Script Date: 07/30/2012 17:31:55 ******/
ALTER TABLE Transporte  ADD  CONSTRAINT FK_Transporte_Provincia FOREIGN KEY(pro_id)
REFERENCES Provincia (pro_id)
;
-- FK_Transporte_Provincia
;
/****** Object:  ForeignKey FK_Unidad_Usuario    Script Date: 07/30/2012 17:31:57 ******/
ALTER TABLE Unidad  ADD  CONSTRAINT FK_Unidad_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Unidad_Usuario
;
/****** Object:  ForeignKey FK_Usuario_Persona    Script Date: 07/30/2012 17:32:00 ******/
ALTER TABLE Usuario  ADD  CONSTRAINT FK_Usuario_Persona FOREIGN KEY(prs_id)
REFERENCES Persona (prs_id)
;
-- FK_Usuario_Persona
;
/****** Object:  ForeignKey FK_Usuario_Sucursal    Script Date: 07/30/2012 17:32:00 ******/
ALTER TABLE Usuario  ADD  CONSTRAINT FK_Usuario_Sucursal FOREIGN KEY(suc_id)
REFERENCES Sucursal (suc_id)
;
-- FK_Usuario_Sucursal
;
/****** Object:  ForeignKey FK_Usuario_Usuario    Script Date: 07/30/2012 17:32:00 ******/
ALTER TABLE Usuario  ADD  CONSTRAINT FK_Usuario_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Usuario_Usuario
;
/****** Object:  ForeignKey FK_UsuarioDepartamento_Departamento    Script Date: 07/30/2012 17:32:02 ******/
ALTER TABLE UsuarioDepartamento  ADD  CONSTRAINT FK_UsuarioDepartamento_Departamento FOREIGN KEY(dpto_id)
REFERENCES Departamento (dpto_id)
;
-- FK_UsuarioDepartamento_Departamento
;
/****** Object:  ForeignKey FK_UsuarioDepartamento_Usuario    Script Date: 07/30/2012 17:32:02 ******/
ALTER TABLE UsuarioDepartamento  ADD  CONSTRAINT FK_UsuarioDepartamento_Usuario FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_UsuarioDepartamento_Usuario
;
/****** Object:  ForeignKey FK_UsuarioDepartamento_UsuarioModifico    Script Date: 07/30/2012 17:32:02 ******/
ALTER TABLE UsuarioDepartamento  ADD  CONSTRAINT FK_UsuarioDepartamento_UsuarioModifico FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_UsuarioDepartamento_UsuarioModifico
;
/****** Object:  ForeignKey FK_UsuarioDepositoLogico_DepositoLogico    Script Date: 07/30/2012 17:32:03 ******/
ALTER TABLE UsuarioDepositoLogico  ADD  CONSTRAINT FK_UsuarioDepositoLogico_DepositoLogico FOREIGN KEY(depl_id)
REFERENCES DepositoLogico (depl_id)
;
-- FK_UsuarioDepositoLogico_DepositoLogico
;
/****** Object:  ForeignKey FK_UsuarioDepositoLogico_Usuario    Script Date: 07/30/2012 17:32:03 ******/
ALTER TABLE UsuarioDepositoLogico  ADD  CONSTRAINT FK_UsuarioDepositoLogico_Usuario FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_UsuarioDepositoLogico_Usuario
;
/****** Object:  ForeignKey FK_UsuarioEmpresa_Cliente    Script Date: 07/30/2012 17:32:05 ******/
ALTER TABLE UsuarioEmpresa  ADD  CONSTRAINT FK_UsuarioEmpresa_Cliente FOREIGN KEY(cli_id)
REFERENCES Cliente (cli_id)
;
-- FK_UsuarioEmpresa_Cliente
;
/****** Object:  ForeignKey FK_UsuarioEmpresa_Modifico    Script Date: 07/30/2012 17:32:05 ******/
ALTER TABLE UsuarioEmpresa  ADD  CONSTRAINT FK_UsuarioEmpresa_Modifico FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_UsuarioEmpresa_Modifico
;
/****** Object:  ForeignKey FK_UsuarioEmpresa_Proveedor    Script Date: 07/30/2012 17:32:05 ******/
ALTER TABLE UsuarioEmpresa  ADD  CONSTRAINT FK_UsuarioEmpresa_Proveedor FOREIGN KEY(prov_id)
REFERENCES Proveedor (prov_id)
;
-- FK_UsuarioEmpresa_Proveedor
;
/****** Object:  ForeignKey FK_UsuarioEmpresa_Usuario    Script Date: 07/30/2012 17:32:05 ******/
ALTER TABLE UsuarioEmpresa  ADD  CONSTRAINT FK_UsuarioEmpresa_Usuario FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_UsuarioEmpresa_Usuario
;
/****** Object:  ForeignKey FK_UsuarioRol_Rol    Script Date: 07/30/2012 17:32:07 ******/
ALTER TABLE UsuarioRol  ADD  CONSTRAINT FK_UsuarioRol_Rol FOREIGN KEY(rol_id)
REFERENCES Rol (rol_id)
;
-- FK_UsuarioRol_Rol
;
/****** Object:  ForeignKey FK_UsuarioRol_Usuario    Script Date: 07/30/2012 17:32:07 ******/
ALTER TABLE UsuarioRol  ADD  CONSTRAINT FK_UsuarioRol_Usuario FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_UsuarioRol_Usuario
;
/****** Object:  ForeignKey FK_Vendedor_Modifico    Script Date: 07/30/2012 17:32:09 ******/
ALTER TABLE Vendedor  ADD  CONSTRAINT FK_Vendedor_Modifico FOREIGN KEY(modifico)
REFERENCES Usuario (us_id)
;
-- FK_Vendedor_Modifico
;
/****** Object:  ForeignKey FK_Vendedor_Usuario    Script Date: 07/30/2012 17:32:09 ******/
ALTER TABLE Vendedor  ADD  CONSTRAINT FK_Vendedor_Usuario FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_Vendedor_Usuario
;
/****** Object:  ForeignKey FK_VentaModo_Cuenta    Script Date: 07/30/2012 17:32:12 ******/
ALTER TABLE VentaModo  ADD  CONSTRAINT FK_VentaModo_Cuenta FOREIGN KEY(cue_id)
REFERENCES Cuenta (cue_id)
;
-- FK_VentaModo_Cuenta
;
/****** Object:  ForeignKey FK_webArticulo_Usuario    Script Date: 07/30/2012 17:32:18 ******/
ALTER TABLE webArticulo  ADD  CONSTRAINT FK_webArticulo_Usuario FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_webArticulo_Usuario
;
/****** Object:  ForeignKey FK_webArticulo_webArticuloEstado    Script Date: 07/30/2012 17:32:18 ******/
ALTER TABLE webArticulo  ADD  CONSTRAINT FK_webArticulo_webArticuloEstado FOREIGN KEY(warte_id)
REFERENCES webArticuloEstado (warte_id)
;
-- FK_webArticulo_webArticuloEstado
;
/****** Object:  ForeignKey FK_webArticulo_webArticuloTipo    Script Date: 07/30/2012 17:32:18 ******/
ALTER TABLE webArticulo  ADD  CONSTRAINT FK_webArticulo_webArticuloTipo FOREIGN KEY(wartt_id)
REFERENCES webArticuloTipo (wartt_id)
;
-- FK_webArticulo_webArticuloTipo
;
/****** Object:  ForeignKey FK_webArticuloUsuario_Usuario    Script Date: 07/30/2012 17:32:20 ******/
ALTER TABLE webArticuloUsuario  ADD  CONSTRAINT FK_webArticuloUsuario_Usuario FOREIGN KEY(us_id)
REFERENCES Usuario (us_id)
;
-- FK_webArticuloUsuario_Usuario
;
/****** Object:  ForeignKey FK_webArticuloUsuario_webArticulo    Script Date: 07/30/2012 17:32:20 ******/
ALTER TABLE webArticuloUsuario  ADD  CONSTRAINT FK_webArticuloUsuario_webArticulo FOREIGN KEY(wart_id)
REFERENCES webArticulo (wart_id)
;
-- FK_webArticuloUsuario_webArticulo
;

/* WARNING: Check if this script creates the sequence automaticlay because of the use of the serial type in column me_id
CREATE SEQUENCE sysmenu_me_id_seq;

    UPDATE: THIS WORKS the sequence is created automatically
*/

CREATE TABLE sysmenu
(
  me_id serial NOT NULL,
  me_text character varying(1000) NOT NULL DEFAULT ''::character varying,
  me_key character varying(100) NOT NULL DEFAULT ''::character varying,
  pre_id integer,
  me_father character varying(1000) NOT NULL DEFAULT ''::character varying,
  me_position integer,
  me_is_last smallint,
  me_is_separator smallint,
  me_have_separator smallint,
  me_is_main_menu smallint,
  me_is_popup_menu smallint,
  me_object_handler character varying(255) NOT NULL DEFAULT ''::character varying,
  me_package character varying(255) NOT NULL DEFAULT ''::character varying,
  me_file_path character varying(255) NOT NULL DEFAULT ''::character varying,
  me_id_father integer,
  me_action character varying(255) NOT NULL DEFAULT ''::character varying,
  me_path character varying(1000) NOT NULL DEFAULT ''::character varying,
  me_action2 character varying(255) NOT NULL DEFAULT ''::character varying,
  me_path2 character varying(1000) NOT NULL DEFAULT ''::character varying,
  CONSTRAINT sysmenu_pkey PRIMARY KEY (me_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE sysmenu
  OWNER TO postgres;
  
/* CREATE SEQUENCE syslanguage_sysl_id_seq; */
  
CREATE TABLE syslanguage
(
    sysl_id serial NOT NULL,
    leng_id integer NOT NULL,
    sysl_code character varying(255) NOT NULL,
    sysl_text character varying(5000) NOT NULL,
    CONSTRAINT syslanguage_pkey PRIMARY KEY (sysl_id),
    CONSTRAINT syslanguage_language_fk FOREIGN KEY (leng_id)
        REFERENCES lenguaje (leng_id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
OIDS=FALSE
);
ALTER TABLE syslanguage
OWNER TO postgres;
