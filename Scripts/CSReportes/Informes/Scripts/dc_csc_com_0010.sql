/*
CrowSoft-Cairo
==============

ERP application written in Java (Tomcat + GWT) and Postgresql

Copyright (C) 2012  Javier Mariano Alvarez

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

========================================================================

Created by Javier

http://www.crowsoft.com.ar

javier at crowsoft.com.ar
*/
-- Function: dc_csc_com_0010(integer, date, date, character varying, character varying, character varying, character varying, smallint, character varying, smallint, smallint, smallint)

-- DROP FUNCTION dc_csc_com_0010(integer, date, date, character varying, character varying, character varying, character varying, smallint, character varying, smallint, smallint, smallint);

CREATE OR REPLACE FUNCTION dc_csc_com_0010(IN p_us_id integer, IN p_fini date, IN p_ffin date, IN p_prov_id character varying, IN p_suc_id character varying, IN p_cue_id character varying, IN p_cico_id character varying, IN p_solodeudores smallint, IN p_emp_id character varying, IN p_ntipo smallint, IN p_conremito smallint, IN p_saldominimo smallint, OUT rtn refcursor)
  RETURNS refcursor AS
$BODY$
DECLARE
   v_prov_id integer;
   v_suc_id integer;
   v_cue_id integer;
   v_cico_id integer;
   v_emp_id integer;
   v_ram_id_Proveedor integer;
   v_ram_id_Sucursal integer;
   v_ram_id_Cuenta integer;
   v_ram_id_circuitocontable integer;
   v_ram_id_Empresa integer;
   v_clienteID integer;
   v_IsRaiz smallint;
   v_cta_acreedor numeric(3,0);
   v_cta_acreedoropg numeric(3,0);
BEGIN

   rtn = 'rtn';
   
        CREATE TEMPORARY TABLE tt_dc_csc_com_0010
        (
          prov_id integer  NOT NULL,
          cue_id integer  ,
          emp_id integer  NOT NULL,
          suc_id integer  NOT NULL,
          neto decimal(18,6) 
           DEFAULT (0) NOT NULL ,
          descuento decimal(18,6) 
           DEFAULT (0) NOT NULL ,
          subtotal decimal(18,6) 
           DEFAULT (0) NOT NULL ,
          iva decimal(18,6) 
           DEFAULT (0) NOT NULL ,
          total decimal(18,6) 
           DEFAULT (0) NOT NULL ,
          pago decimal(18,6) 
           DEFAULT (0) NOT NULL ,
          pendiente decimal(18,6)  NOT NULL
        ) ON COMMIT DROP;

   select sp_ArbConvertId(p_prov_id) into v_prov_id, v_ram_id_Proveedor;
/*
   select sp_ArbConvertId(p_suc_id) into v_suc_id, v_ram_id_Sucursal;

   select sp_ArbConvertId(p_cue_id) into v_cue_id, v_ram_id_Cuenta;

   select sp_ArbConvertId(p_cico_id) into v_cico_id, v_ram_id_circuitocontable;

   select sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_Empresa;

   select sp_GetRptId(v_clienteID);

   IF v_ram_id_Proveedor <> 0 THEN
   BEGIN
      --	exec sp_ArbGetGroups @ram_id_Proveedor, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Proveedor) into v_IsRaiz;

      IF v_IsRaiz = 0 THEN
      BEGIN
         select sp_ArbGetAllHojas(v_ram_id_Proveedor,
                           v_clienteID);

      END;
      ELSE
         v_ram_id_Proveedor := 0;

      END IF;

   END;
   END IF;

   IF v_ram_id_Sucursal <> 0 THEN
   BEGIN
      --	exec sp_ArbGetGroups @ram_id_Sucursal, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Sucursal) into v_IsRaiz;

      IF v_IsRaiz = 0 THEN
      BEGIN
         select sp_ArbGetAllHojas(v_ram_id_Sucursal,
                           v_clienteID);

      END;
      ELSE
         v_ram_id_Sucursal := 0;

      END IF;

   END;
   END IF;

   IF v_ram_id_Cuenta <> 0 THEN
   BEGIN
      --	exec sp_ArbGetGroups @ram_id_Cuenta, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Cuenta) into v_IsRaiz;

      IF v_IsRaiz = 0 THEN
      BEGIN
         select sp_ArbGetAllHojas(v_ram_id_Cuenta,
                           v_clienteID);

      END;
      ELSE
         v_ram_id_Cuenta := 0;

      END IF;

   END;
   END IF;

   IF v_ram_id_circuitocontable <> 0 THEN
   BEGIN
      --	exec sp_ArbGetGroups @ram_id_circuitocontable, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_circuitocontable) into v_IsRaiz;

      IF v_IsRaiz = 0 THEN
      BEGIN
         select sp_ArbGetAllHojas(v_ram_id_circuitocontable,
                           v_clienteID);

      END;
      ELSE
         v_ram_id_circuitocontable := 0;

      END IF;

   END;
   END IF;

   IF v_ram_id_Empresa <> 0 THEN
   BEGIN
      --	exec sp_ArbGetGroups @ram_id_Empresa, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Empresa) into v_IsRaiz;

      IF v_IsRaiz = 0 THEN
      BEGIN
         select sp_ArbGetAllHojas(v_ram_id_Empresa,
                           v_clienteID);

      END;
      ELSE
         v_ram_id_Empresa := 0;

      END IF;

   END;
   END IF;

   v_cta_acreedor := 2;

   v_cta_acreedoropg := 5;

   --/////////////////////////////////////////////////////////////////////////
   --
   --	Saldos Iniciales
   --
   --/////////////////////////////////////////////////////////////////////////
   

   --//////////////////////////////////////////
   -- Ordenes de Pago
   --//////////////////////////////////////////
   INSERT INTO tt_dc_csc_com_0010
     ( prov_id, cue_id, emp_id, suc_id, pago, pendiente )
     ( SELECT opg.prov_id,
              ( SELECT MIN(cue_id)
                FROM OrdenPagoItem
                   WHERE opg_id = opg.opg_id
                           AND opgi_tipo = 5 ),
              doc.emp_id,
              opg.suc_id,
              opg.opg_total,
              CASE
                   WHEN p_nTipo = 0 THEN -opg.opg_pendiente
              ELSE -opg.opg_total - coalesce(( SELECT SUM(fcopg.fcopg_importe)
                                          FROM FacturaCompraOrdenPago fcopg
                                                 JOIN FacturaCompra fc
                                                  ON fcopg.fc_id = fc.fc_id
                                                 JOIN Documento doc
                                                  ON fc.doc_id = doc.doc_id
                                             WHERE fcopg.opg_id = opg.opg_id
                                                     AND fc.est_id <> 7
                                                     AND ( doc.cico_id = v_cico_id
                                                     OR v_cico_id = 0 )
                                                     AND ( doc.emp_id = v_emp_id
                                                     OR v_emp_id = 0 )
                                                     AND ( ( fc.fc_fecha <= p_Fini
                                                     AND p_nTipo <> 3 )
                                                     OR ( fc.fc_fecha <= p_Ffin
                                                     AND p_nTipo = 3 ) ) ), 0)
                 END col
       FROM OrdenPago opg
              JOIN Documento doc
               ON opg.doc_id = doc.doc_id
          WHERE ( ( opg.opg_fecha < p_Fini
                  AND p_nTipo = 0 )
                  OR ( opg.opg_fecha <= p_Fini
                  AND p_nTipo IN ( 1,2 ) )
                  OR ( opg.opg_fecha >= p_Fini
                  AND opg.opg_fecha <= p_Ffin
                  AND p_nTipo = 3 ) )
                  AND opg.est_id <> 7
                  AND ( EXISTS ( SELECT *
                                      FROM EmpresaUsuario
                                         WHERE emp_id = doc.emp_id
                                                 AND us_id = p_us_id )
                  OR ( p_us_id = 1 ) )
/ * -///////////////////////////////////////////////////////////////////////
		
		INICIO SEGUNDA PARTE DE ARBOLES
		
/////////////////////////////////////////////////////////////////////// * /
                  AND ( opg.prov_id = v_prov_id
                  OR v_prov_id = 0 )
                  AND ( opg.suc_id = v_suc_id
                  OR v_suc_id = 0 )
                  AND ( doc.cico_id = v_cico_id
                  OR v_cico_id = 0 )
                  AND ( EXISTS ( SELECT *
                                 FROM OrdenPagoItem
                                    WHERE opg_id = opg.opg_id
                                            AND opgi_tipo = v_cta_acreedoropg
                                            AND cue_id = v_cue_id )
                  OR v_cue_id = 0 )
                  AND ( doc.emp_id = v_emp_id
                  OR v_emp_id = 0 )
                  -- Arboles
                  AND ( ( EXISTS ( SELECT rptarb_hojaid
                                   FROM rptArbolRamaHoja
                                      WHERE rptarb_cliente = v_clienteID
                                              AND tbl_id = 29
                                              AND rptarb_hojaid = opg.prov_id ) )
                  OR ( v_ram_id_Proveedor = 0 ) )
                  AND ( ( EXISTS ( SELECT rptarb_hojaid
                                   FROM rptArbolRamaHoja
                                      WHERE rptarb_cliente = v_clienteID
                                              AND tbl_id = 1007
                                              AND rptarb_hojaid = opg.suc_id ) )
                  OR ( v_ram_id_Sucursal = 0 ) )
                  AND ( ( EXISTS ( SELECT rptarb_hojaid
                                   FROM rptArbolRamaHoja
                                      WHERE rptarb_cliente = v_clienteID
                                              AND tbl_id = 17
                                              AND ( EXISTS ( SELECT *
                                                             FROM OrdenPagoItem
                                                                WHERE opg_id = opg.opg_id
                                                                        AND opgi_tipo = v_cta_acreedoropg
                                                                        AND cue_id = rptarb_hojaid ) ) ) )
                  OR ( v_ram_id_Cuenta = 0 ) )
                  AND ( ( EXISTS ( SELECT rptarb_hojaid
                                   FROM rptArbolRamaHoja
                                      WHERE rptarb_cliente = v_clienteID
                                              AND tbl_id = 1016
                                              AND rptarb_hojaid = doc.cico_id ) )
                  OR ( v_ram_id_circuitocontable = 0 ) )
                  AND ( ( EXISTS ( SELECT rptarb_hojaid
                                   FROM rptArbolRamaHoja
                                      WHERE rptarb_cliente = v_clienteID
                                              AND tbl_id = 1018
                                              AND rptarb_hojaid = doc.emp_id ) )
                  OR ( v_ram_id_Empresa = 0 ) ) );

   --//////////////////////////////////////////
   -- Facturas y Notas de Credito
   --//////////////////////////////////////////
   INSERT INTO tt_dc_csc_com_0010
     ( prov_id, cue_id, emp_id, suc_id, neto, descuento, subtotal, iva, total, pago, pendiente )
     ( SELECT fc.prov_id,
              ai.cue_id,
              doc.emp_id,
              fc.suc_id,
              CASE fc.doct_id
                             WHEN 8 THEN -fc.fc_neto
              ELSE fc.fc_neto
                 END Neto,
              CASE fc.doct_id
                             WHEN 8 THEN -coalesce(fc.fc_importedesc1, 0) + coalesce(fc.fc_importedesc2, 0)
              ELSE coalesce(fc.fc_importedesc1, 0) + coalesce(fc.fc_importedesc2, 0)
                 END Descuento,
              CASE fc.doct_id
                             WHEN 8 THEN -fc.fc_subtotal
              ELSE fc.fc_subtotal
                 END Sub_Total,
              CASE fc.doct_id
                             WHEN 8 THEN -coalesce(fc.fc_ivari, 0) + coalesce(fc.fc_ivarni, 0)
              ELSE coalesce(fc.fc_ivari, 0) + coalesce(fc.fc_ivarni, 0)
                 END Iva,
              CASE fc.doct_id
                             WHEN 8 THEN -fc.fc_total
              ELSE fc.fc_total
                 END Total,
              CASE
                   WHEN fc.fc_totalcomercial = 0
                     AND fc.fc_fechavto < CURRENT_TIMESTAMP
                     AND fc.fc_fechavto < p_Ffin
                     AND fc.doct_id = 8 THEN -fc.fc_total
                   WHEN fc.fc_totalcomercial = 0
                     AND fc.fc_fechavto < CURRENT_TIMESTAMP
                     AND fc.fc_fechavto < p_Ffin
                     AND fc.doct_id <> 8 THEN fc.fc_total
              ELSE 0
                 END Pagos,
              CASE
                   WHEN p_nTipo = 0
                     AND fc.doct_id = 8 THEN -fc.fc_pendiente
                   WHEN p_nTipo = 0 THEN fc.fc_pendiente
                   WHEN fc.doct_id = 8 THEN -fc.fc_total - coalesce(( SELECT SUM(fcnc.fcnc_importe)
                                                                 FROM FacturaCompraNotaCredito fcnc
                                                                        JOIN FacturaCompra fc2
                                                                         ON fcnc.fc_id_factura = fc2.fc_id
                                                                        JOIN Documento doc
                                                                         ON fc2.doc_id = doc.doc_id
                                                                    WHERE fcnc.fc_id_notacredito = fc.fc_id
                                                                            AND fc2.est_id <> 7
                                                                            AND ( doc.cico_id = v_cico_id
                                                                            OR v_cico_id = 0 )
                                                                            AND ( doc.emp_id = v_emp_id
                                                                            OR v_emp_id = 0 )
                                                                            AND ( ( fc2.fc_fecha <= p_Fini
                                                                            AND p_nTipo <> 3 )
                                                                            OR ( fc2.fc_fecha <= p_Ffin
                                                                            AND p_nTipo = 3 ) ) ), 0)
              ELSE (fc.fc_total - coalesce(( SELECT SUM(fcnc.fcnc_importe)
                                        FROM FacturaCompraNotaCredito fcnc
                                               JOIN FacturaCompra nc
                                                ON fcnc.fc_id_notacredito = nc.fc_id
                                               JOIN Documento doc
                                                ON nc.doc_id = doc.doc_id
                                           WHERE fcnc.fc_id_factura = fc.fc_id
                                                   AND nc.est_id <> 7
                                                   AND ( doc.cico_id = v_cico_id
                                                   OR v_cico_id = 0 )
                                                   AND ( doc.emp_id = v_emp_id
                                                   OR v_emp_id = 0 )
                                                   AND ( ( nc.fc_fecha <= p_Fini
                                                   AND p_nTipo <> 3 )
                                                   OR ( nc.fc_fecha <= p_Ffin
                                                   AND p_nTipo = 3 ) ) ), 0) - coalesce(( SELECT SUM(fcopg.fcopg_importe)
                                                                                      FROM FacturaCompraOrdenPago fcopg
                                                                                             JOIN OrdenPago opg
                                                                                              ON fcopg.opg_id = opg.opg_id
                                                                                             JOIN Documento doc
                                                                                              ON opg.doc_id = doc.doc_id
                                                                                         WHERE fcopg.fc_id = fc.fc_id
                                                                                                 AND opg.est_id <> 7
                                                                                                 AND ( doc.cico_id = v_cico_id
                                                                                                 OR v_cico_id = 0 )
                                                                                                 AND ( opg.emp_id = v_emp_id
                                                                                                 OR v_emp_id = 0 )
                                                                                                 AND ( ( opg.opg_fecha <= p_Fini
                                                                                                 AND p_nTipo <> 3 )
                                                                                                 OR ( opg.opg_fecha <= p_Ffin
                                                                                                 AND p_nTipo = 3 ) ) ), 0))
                 END Pendiente
       FROM FacturaCompra fc
              JOIN Documento doc
               ON fc.doc_id = doc.doc_id
              LEFT JOIN AsientoItem ai
               ON fc.as_id = ai.as_id
              AND ai.asi_tipo = v_cta_acreedor
          WHERE ( ( fc.fc_fecha < p_Fini
                  AND p_nTipo = 0 )
                  OR ( fc.fc_fecha <= p_Fini
                  AND p_nTipo IN ( 1,2 ) )
                  OR ( fc.fc_fecha >= p_Fini
                  AND fc.fc_fecha <= p_Ffin
                  AND p_nTipo = 3 ) )
                  AND fc.est_id <> 7
                  AND fc.fc_totalcomercial <> 0
                  AND ( EXISTS ( SELECT *
                                      FROM EmpresaUsuario
                                         WHERE emp_id = doc.emp_id
                                                 AND us_id = p_us_id )
                  OR ( p_us_id = 1 ) )
/ * -///////////////////////////////////////////////////////////////////////
		
		INICIO SEGUNDA PARTE DE ARBOLES
		
/////////////////////////////////////////////////////////////////////// * /
                  AND ( fc.prov_id = v_prov_id
                  OR v_prov_id = 0 )
                  AND ( fc.suc_id = v_suc_id
                  OR v_suc_id = 0 )
                  AND ( ai.cue_id = v_cue_id
                  OR v_cue_id = 0 )
                  AND ( doc.cico_id = v_cico_id
                  OR v_cico_id = 0 )
                  AND ( doc.emp_id = v_emp_id
                  OR v_emp_id = 0 )
                  -- Arboles
                  AND ( ( EXISTS ( SELECT rptarb_hojaid
                                   FROM rptArbolRamaHoja
                                      WHERE rptarb_cliente = v_clienteID
                                              AND tbl_id = 29
                                              AND rptarb_hojaid = fc.prov_id ) )
                  OR ( v_ram_id_Proveedor = 0 ) )
                  AND ( ( EXISTS ( SELECT rptarb_hojaid
                                   FROM rptArbolRamaHoja
                                      WHERE rptarb_cliente = v_clienteID
                                              AND tbl_id = 1007
                                              AND rptarb_hojaid = fc.suc_id ) )
                  OR ( v_ram_id_Sucursal = 0 ) )
                  AND ( ( EXISTS ( SELECT rptarb_hojaid
                                   FROM rptArbolRamaHoja
                                      WHERE rptarb_cliente = v_clienteID
                                              AND tbl_id = 17
                                              AND rptarb_hojaid = ai.cue_id ) )
                  OR ( v_ram_id_Cuenta = 0 ) )
                  AND ( ( EXISTS ( SELECT rptarb_hojaid
                                   FROM rptArbolRamaHoja
                                      WHERE rptarb_cliente = v_clienteID
                                              AND tbl_id = 1016
                                              AND rptarb_hojaid = doc.cico_id ) )
                  OR ( v_ram_id_circuitocontable = 0 ) )
                  AND ( ( EXISTS ( SELECT rptarb_hojaid
                                   FROM rptArbolRamaHoja
                                      WHERE rptarb_cliente = v_clienteID
                                              AND tbl_id = 1018
                                              AND rptarb_hojaid = doc.emp_id ) )
                  OR ( v_ram_id_Empresa = 0 ) ) );

   INSERT INTO tt_dc_csc_com_0010
     ( prov_id, cue_id, emp_id, suc_id, neto, descuento, subtotal, iva, total, pago, pendiente )
     ( SELECT fc.prov_id,
              ai.cue_id,
              doc.emp_id,
              fc.suc_id,
              CASE fc.doct_id
                             WHEN 8 THEN -fc.fc_neto
              ELSE fc.fc_neto
                 END Neto,
              CASE fc.doct_id
                             WHEN 8 THEN -coalesce(fc.fc_importedesc1, 0) + coalesce(fc.fc_importedesc2, 0)
              ELSE coalesce(fc.fc_importedesc1, 0) + coalesce(fc.fc_importedesc2, 0)
                 END Descuento,
              CASE fc.doct_id
                             WHEN 8 THEN -fc.fc_subtotal
              ELSE fc.fc_subtotal
                 END Sub_Total,
              CASE fc.doct_id
                             WHEN 8 THEN -coalesce(fc.fc_ivari, 0) + coalesce(fc.fc_ivarni, 0)
              ELSE coalesce(fc.fc_ivari, 0) + coalesce(fc.fc_ivarni, 0)
                 END Iva,
              CASE fc.doct_id
                             WHEN 8 THEN -fc.fc_total
              ELSE fc.fc_total
                 END Total,
              CASE
                   WHEN fc.fc_totalcomercial = 0
                     AND fc.fc_fechavto < CURRENT_TIMESTAMP
                     AND fc.fc_fechavto < p_Ffin
                     AND fc.doct_id = 8 THEN -fc.fc_total
                   WHEN fc.fc_totalcomercial = 0
                     AND fc.fc_fechavto < CURRENT_TIMESTAMP
                     AND fc.fc_fechavto < p_Ffin
                     AND fc.doct_id <> 8 THEN fc.fc_total
              ELSE 0
                 END Pagos,
              CASE
                   WHEN fc.fc_totalcomercial = 0
                     AND fc.fc_fechavto < CURRENT_TIMESTAMP
                     AND fc.fc_fechavto < p_Ffin THEN 0
                   WHEN fc.fc_totalcomercial = 0
                     AND ( fc.fc_fechavto >= CURRENT_TIMESTAMP
                     OR fc.fc_fechavto >= p_Ffin )
                     AND fc.doct_id = 8 THEN -fc.fc_total
                   WHEN fc.fc_totalcomercial = 0
                     AND ( fc.fc_fechavto >= CURRENT_TIMESTAMP
                     OR fc.fc_fechavto >= p_Ffin )
                     AND fc.doct_id <> 8 THEN fc.fc_total   END Pendiente
       FROM FacturaCompra fc
              JOIN Documento doc
               ON fc.doc_id = doc.doc_id
              LEFT JOIN AsientoItem ai
               ON fc.as_id = ai.as_id
              AND ai.asi_tipo = v_cta_acreedor
          WHERE ( ( fc.fc_fecha < p_Fini
                  AND p_nTipo = 0 )
                  OR ( fc.fc_fecha <= p_Fini
                  AND p_nTipo IN ( 1,2 ) )
                  OR ( fc.fc_fecha >= p_Fini
                  AND fc.fc_fecha <= p_Ffin
                  AND p_nTipo = 3 ) )
                  AND fc.est_id <> 7
                  AND fc.fc_totalcomercial = 0
                  AND (CASE
                                 WHEN fc.fc_totalcomercial = 0
                                   AND fc.fc_fechavto < CURRENT_TIMESTAMP
                                   AND fc.fc_fechavto < p_Ffin THEN 0
                                 / * aca no importa si es fc o nc, sino que sea <> 0 * /
                                 WHEN fc.fc_totalcomercial = 0
                                   AND ( fc.fc_fechavto >= CURRENT_TIMESTAMP
                                   OR fc.fc_fechavto >= p_Ffin ) THEN -fc.fc_total   END) <> 0
                  AND ( EXISTS ( SELECT *
                                      FROM EmpresaUsuario
                                         WHERE emp_id = doc.emp_id
                                                 AND us_id = p_us_id )
                  OR ( p_us_id = 1 ) )
/ * -///////////////////////////////////////////////////////////////////////
		
		INICIO SEGUNDA PARTE DE ARBOLES
		
/////////////////////////////////////////////////////////////////////// * /
                  AND ( fc.prov_id = v_prov_id
                  OR v_prov_id = 0 )
                  AND ( fc.suc_id = v_suc_id
                  OR v_suc_id = 0 )
                  AND ( ai.cue_id = v_cue_id
                  OR v_cue_id = 0 )
                  AND ( doc.cico_id = v_cico_id
                  OR v_cico_id = 0 )
                  AND ( doc.emp_id = v_emp_id
                  OR v_emp_id = 0 )
                  -- Arboles
                  AND ( ( EXISTS ( SELECT rptarb_hojaid
                                   FROM rptArbolRamaHoja
                                      WHERE rptarb_cliente = v_clienteID
                                              AND tbl_id = 29
                                              AND rptarb_hojaid = fc.prov_id ) )
                  OR ( v_ram_id_Proveedor = 0 ) )
                  AND ( ( EXISTS ( SELECT rptarb_hojaid
                                   FROM rptArbolRamaHoja
                                      WHERE rptarb_cliente = v_clienteID
                                              AND tbl_id = 1007
                                              AND rptarb_hojaid = fc.suc_id ) )
                  OR ( v_ram_id_Sucursal = 0 ) )
                  AND ( ( EXISTS ( SELECT rptarb_hojaid
                                   FROM rptArbolRamaHoja
                                      WHERE rptarb_cliente = v_clienteID
                                              AND tbl_id = 17
                                              AND rptarb_hojaid = ai.cue_id ) )
                  OR ( v_ram_id_Cuenta = 0 ) )
                  AND ( ( EXISTS ( SELECT rptarb_hojaid
                                   FROM rptArbolRamaHoja
                                      WHERE rptarb_cliente = v_clienteID
                                              AND tbl_id = 1016
                                              AND rptarb_hojaid = doc.cico_id ) )
                  OR ( v_ram_id_circuitocontable = 0 ) )
                  AND ( ( EXISTS ( SELECT rptarb_hojaid
                                   FROM rptArbolRamaHoja
                                      WHERE rptarb_cliente = v_clienteID
                                              AND tbl_id = 1018
                                              AND rptarb_hojaid = doc.emp_id ) )
                  OR ( v_ram_id_Empresa = 0 ) ) );

   IF p_conRemito <> 0 THEN
   BEGIN
      -- Remitos
      --
      INSERT INTO tt_dc_csc_com_0010
        ( prov_id, cue_id, emp_id, suc_id, neto, descuento, subtotal, iva, total, pago, pendiente )
        ( SELECT rc.prov_id,
                 NULL,
                 doc.emp_id,
                 rc.suc_id,
                 CASE rc.doct_id
                                WHEN 25 THEN -rc.rc_neto
                 ELSE rc.rc_neto
                    END Neto,
                 CASE rc.doct_id
                                WHEN 25 THEN -coalesce(rc.rc_importedesc1, 0) + coalesce(rc.rc_importedesc2, 0)
                 ELSE coalesce(rc.rc_importedesc1, 0) + coalesce(rc.rc_importedesc2, 0)
                    END Descuento,
                 CASE rc.doct_id
                                WHEN 25 THEN -rc.rc_subtotal
                 ELSE rc.rc_subtotal
                    END Sub_Total,
                 CASE rc.doct_id
                                WHEN 25 THEN -coalesce(rc.rc_ivari, 0) + coalesce(rc.rc_ivarni, 0)
                 ELSE coalesce(rc.rc_ivari, 0) + coalesce(rc.rc_ivarni, 0)
                    END Iva,
                 CASE rc.doct_id
                                WHEN 25 THEN -rc.rc_total
                 ELSE rc.rc_total
                    END Total,
                 0 Pagos,
                 CASE rc.doct_id
                                WHEN 25 THEN -rc.rc_pendiente
                 ELSE rc.rc_pendiente
                    END Pendiente
          FROM RemitoCompra rc
                 JOIN Documento doc
                  ON rc.doc_id = doc.doc_id
                 AND p_conRemito <> 0
             WHERE ( ( rc.rc_fecha < p_Fini
                     AND p_nTipo = 0 )
                     OR ( rc.rc_fecha <= p_Fini
                     AND p_nTipo IN ( 1,2 ) )
                     OR ( rc.rc_fecha >= p_Fini
                     AND rc.rc_fecha <= p_Ffin
                     AND p_nTipo = 3 ) )
                     AND rc.est_id <> 7
                     AND p_conRemito <> 0
                     AND ( EXISTS ( SELECT *
                                         FROM EmpresaUsuario
                                            WHERE emp_id = doc.emp_id
                                                    AND us_id = p_us_id )
                     OR ( p_us_id = 1 ) )
/ * -///////////////////////////////////////////////////////////////////////
			
			INICIO SEGUNDA PARTE DE ARBOLES
			
/////////////////////////////////////////////////////////////////////// * /
                     AND ( rc.prov_id = v_prov_id
                     OR v_prov_id = 0 )
                     AND ( rc.suc_id = v_suc_id
                     OR v_suc_id = 0 )
                     AND ( doc.cico_id = v_cico_id
                     OR v_cico_id = 0 )
                     AND ( doc.emp_id = v_emp_id
                     OR v_emp_id = 0 )
                     -- Arboles
                     AND ( ( EXISTS ( SELECT rptarb_hojaid
                                      FROM rptArbolRamaHoja
                                         WHERE rptarb_cliente = v_clienteID
                                                 AND tbl_id = 29
                                                 AND rptarb_hojaid = rc.prov_id ) )
                     OR ( v_ram_id_Proveedor = 0 ) )
                     AND ( ( EXISTS ( SELECT rptarb_hojaid
                                      FROM rptArbolRamaHoja
                                         WHERE rptarb_cliente = v_clienteID
                                                 AND tbl_id = 1007
                                                 AND rptarb_hojaid = rc.suc_id ) )
                     OR ( v_ram_id_Sucursal = 0 ) )
                     AND ( ( EXISTS ( SELECT rptarb_hojaid
                                      FROM rptArbolRamaHoja
                                         WHERE rptarb_cliente = v_clienteID
                                                 AND tbl_id = 1016
                                                 AND rptarb_hojaid = doc.cico_id ) )
                     OR ( v_ram_id_circuitocontable = 0 ) )
                     AND ( ( EXISTS ( SELECT rptarb_hojaid
                                      FROM rptArbolRamaHoja
                                         WHERE rptarb_cliente = v_clienteID
                                                 AND tbl_id = 1018
                                                 AND rptarb_hojaid = doc.emp_id ) )
                     OR ( v_ram_id_Empresa = 0 ) ) );

   END;
   END IF;

   --/////////////////////////////////////////////////////////////////////////
   -- Solo Saldos
   --/////////////////////////////////////////////////////////////////////////
   IF p_nTipo <> 0 THEN
   BEGIN
      IF p_nTipo = 1 THEN
      BEGIN
         OPEN rtn FOR
            --/////////////////////////////////////
            -- Saldos iniciales
            --/////////////////////////////////////
            SELECT 1 grp_total,
                         p_Fini Fecha,
                         emp.emp_nombre Empresa,
                         prov.prov_nombre || ' -RZ: ' || prov.prov_razonsocial || ' -CUIT: ' || prov.prov_cuit || ' -TE: ' || prov.prov_tel Proveedor,
                         cue.cue_nombre Cuenta,
                         suc.suc_nombre Sucursal,
                         SUM(neto) Neto,
                         SUM(descuento) Descuento,
                         SUM(subtotal) Sub_Total,
                         SUM(iva) Iva,
                         SUM(total) Total,
                         SUM(pago) Pagos,
                         SUM(pendiente) Pendiente,
                         SUM(pendiente) Vto_Pendiente
              FROM tt_dc_csc_com_0010 fc
                     JOIN Proveedor prov
                      ON fc.prov_id = prov.prov_id
                     JOIN Empresa emp
                      ON fc.emp_id = emp.emp_id
                     JOIN Sucursal suc
                      ON fc.suc_id = suc.suc_id
                     LEFT JOIN Cuenta cue
                      ON fc.cue_id = cue.cue_id
              GROUP BY fc.prov_id,prov.prov_nombre || ' -RZ: ' || prov.prov_razonsocial || ' -CUIT: ' || prov.prov_cuit || ' -TE: ' || prov.prov_tel,emp.emp_nombre,cue.cue_nombre,suc.suc_nombre

               HAVING ( ABS(SUM(sqlserver_utilities.round_(pendiente, 2))) >= p_saldominimo
              OR p_soloDeudores = 0 )
              ORDER BY Proveedor,
                       emp.emp_nombre,
                       cue.cue_nombre,
                       suc.suc_nombre;

      END;
      ELSE
      BEGIN
         OPEN rtn FOR
            --/////////////////////////////////////
            -- Saldos iniciales
            --/////////////////////////////////////
            SELECT 1 grp_total,
                         p_Fini Fecha,
                         prov.prov_nombre || ' -RZ: ' || prov.prov_razonsocial || ' -CUIT: ' || prov.prov_cuit || ' -TE: ' || prov.prov_tel Proveedor,
                         SUM(neto) Neto,
                         SUM(descuento) Descuento,
                         SUM(subtotal) Sub_Total,
                         SUM(iva) Iva,
                         SUM(total) Total,
                         SUM(pago) Pagos,
                         SUM(pendiente) Pendiente,
                         SUM(pendiente) Vto_Pendiente
              FROM tt_dc_csc_com_0010 fc
                     JOIN Proveedor prov
                      ON fc.prov_id = prov.prov_id
              GROUP BY fc.prov_id,prov.prov_nombre || ' -RZ: ' || prov.prov_razonsocial || ' -CUIT: ' || prov.prov_cuit || ' -TE: ' || prov.prov_tel

               HAVING ( ABS(SUM(sqlserver_utilities.round_(pendiente, 2))) >= p_saldominimo
              OR p_soloDeudores = 0 )
              ORDER BY Proveedor;

      END;
      END IF;

   END;
   --/////////////////////////////////////////////////////////////////////////
   -- Saldo y Periodo
   --/////////////////////////////////////////////////////////////////////////
   ELSE
   BEGIN
      OPEN rtn FOR
         --/////////////////////////////////////////////////////////////////////////
         --
         --	Facturas, Notas de Credio/Debito y Ordenes de Pago en el Periodo
         --
         --/////////////////////////////////////////////////////////////////////////
         
         --/////////////////////////////////////
         -- Saldos iniciales
         --/////////////////////////////////////
         SELECT 1 grp_total,
                      0 doct_id,
                      0 comp_id,
                      0 nOrden_id,
                      'Saldo Inicial' Documento,
                      p_Fini Fecha,
                      0 Numero,
                      'Saldo inicial' Comprobante,
                      prov_nombre || ' -RZ: ' || prov_razonsocial || ' -CUIT: ' || prov_cuit || ' -TE: ' || prov_tel Proveedor,
                      SUM(neto) Neto,
                      SUM(descuento) Descuento,
                      SUM(subtotal) Sub_Total,
                      SUM(iva) Iva,
                      SUM(total) Total,
                      SUM(pago) Pagos,
                      SUM(pendiente) Pendiente,
                      '' Moneda,
                      '' Estado,
                      cue_nombre Cuenta,
                      '' Documento,
                      emp_nombre Empresa,
                      suc_nombre Sucursal,
                      '' Cond_Pago,
                      '' Legajo,
                      '' Centro_de_Costo,
                      null Vto,
                      0 Vto_Importe,
                      SUM(pendiente) Vto_Pendiente,
                      null Observaciones
           FROM tt_dc_csc_com_0010 fc
                  JOIN Proveedor prov
                   ON fc.prov_id = prov.prov_id
                  JOIN Empresa emp
                   ON fc.emp_id = emp.emp_id
                  JOIN Sucursal suc
                   ON fc.suc_id = suc.suc_id
                  LEFT JOIN Cuenta cue
                   ON fc.cue_id = cue.cue_id
           GROUP BY fc.prov_id,prov_nombre || ' -RZ: ' || prov_razonsocial || ' -CUIT: ' || prov_cuit || ' -TE: ' || prov_tel,cue_nombre,suc_nombre,emp_nombre

            HAVING ( ABS(SUM(sqlserver_utilities.round_(pendiente, 2))) >= p_saldominimo
           OR p_soloDeudores = 0 )
         UNION ALL
         --/////////////////////////////////////
         --	Facturas, Notas de Credio/Debito
         --/////////////////////////////////////
         SELECT 1 grp_total,
                      fc.doct_id doct_id,
                      fc.fc_id comp_id,
                      1 nOrden_id,
                      doc_nombre Documento,
                      fc_fecha Fecha,
                      fc_numero Numero,
                      fc_nrodoc Comprobante,
                      prov_nombre || ' -RZ: ' || prov_razonsocial || ' -CUIT: ' || prov_cuit || ' -TE: ' || prov_tel Proveedor,
                      CASE fc.doct_id
                                     WHEN 8 THEN -fc_neto
                      ELSE fc_neto
                         END Neto,
                      CASE fc.doct_id
                                     WHEN 8 THEN -fc_importedesc1 + fc_importedesc2
                      ELSE fc_importedesc1 + fc_importedesc2
                         END Descuento,
                      CASE fc.doct_id
                                     WHEN 8 THEN -fc_subtotal
                      ELSE fc_subtotal
                         END Sub_Total,
                      CASE fc.doct_id
                                     WHEN 8 THEN -fc_ivari + fc_ivarni
                      ELSE fc_ivari + fc_ivarni
                         END Iva,
                      CASE fc.doct_id
                                     WHEN 8 THEN -fc_total
                      ELSE fc_total
                         END Total,
                      CASE
                           WHEN fc_totalcomercial = 0
                             AND fc_fechavto < CURRENT_TIMESTAMP
                             AND fc_fechavto < p_Ffin
                             AND fc.doct_id = 8 THEN -fc_total
                           WHEN fc_totalcomercial = 0
                             AND fc_fechavto < CURRENT_TIMESTAMP
                             AND fc_fechavto < p_Ffin
                             AND fc.doct_id <> 8 THEN fc_total
                      ELSE 0
                         END Pagos,
                      CASE fc.doct_id
                                     WHEN 8 THEN -fc_pendiente
                      ELSE fc_pendiente
                         END Pendiente,
                      mon_nombre Moneda,
                      est_nombre Estado,
                      cue_nombre Cuenta,
                      doc_nombre Documento,
                      emp_nombre Empresa,
                      suc_nombre Sucursal,
                      cpg_nombre Cond_Pago,
                      CASE
                           WHEN lgj_titulo <> '' THEN lgj_titulo
                      ELSE lgj_codigo
                         END Legajo,
                      ccos_nombre Centro_de_Costo,
                      CASE
                           WHEN fcd_fecha IS NOT NULL THEN fcd_fecha
                      ELSE fcp_fecha
                         END Vto,
                      CASE fc.doct_id
                                     WHEN 8 THEN -coalesce(fcd_importe, fcp_importe)
                      ELSE coalesce(fcd_importe, fcp_importe)
                         END Vto_Importe,
                      CASE
                           WHEN fc_totalcomercial = 0
                             AND fc_fechavto < CURRENT_TIMESTAMP
                             AND fc_fechavto < p_Ffin THEN 0
                           WHEN fc_totalcomercial = 0
                             AND ( fc_fechavto >= CURRENT_TIMESTAMP
                             OR fc_fechavto >= p_Ffin )
                             AND fc.doct_id = 8 THEN -fc_total
                           WHEN fc_totalcomercial = 0
                             AND ( fc_fechavto >= CURRENT_TIMESTAMP
                             OR fc_fechavto >= p_Ffin )
                             AND fc.doct_id <> 8 THEN fc_total
                           WHEN fc.doct_id = 8 THEN -coalesce(fcd_pendiente, 0)
                      ELSE coalesce(fcd_pendiente, 0)
                         END Vto_Pendiente,
                      fc_descrip Observaciones
           FROM FacturaCompra fc
                  JOIN Proveedor prov
                   ON fc.prov_id = prov.prov_id
                  LEFT JOIN FacturaCompraDeuda fcd
                   ON fc.fc_id = fcd.fc_id
                  LEFT JOIN FacturaCompraPago fcp
                   ON fc.fc_id = fcp.fc_id
                  LEFT JOIN AsientoItem ai
                   ON fc.as_id = ai.as_id
                  AND asi_tipo = v_cta_acreedor
                  LEFT JOIN Cuenta cue
                   ON ai.cue_id = cue.cue_id
                  JOIN Moneda mon
                   ON fc.mon_id = mon.mon_id
                  JOIN Estado est
                   ON fc.est_id = est.est_id
                  JOIN Documento doc
                   ON fc.doc_id = doc.doc_id
                  JOIN Empresa emp
                   ON doc.emp_id = emp.emp_id
                  JOIN Sucursal suc
                   ON fc.suc_id = suc.suc_id
                  LEFT JOIN Legajo lgj
                   ON fc.lgj_id = lgj.lgj_id
                  JOIN CondicionPago cpg
                   ON fc.cpg_id = cpg.cpg_id
                  LEFT JOIN CentroCosto ccos
                   ON fc.ccos_id = ccos.ccos_id
            WHERE fc_fecha >= p_Fini
                    AND fc_fecha <= p_Ffin
                    AND fc.est_id <> 7
                    AND ( ABS(sqlserver_utilities.round_(fc_pendiente, 2)) >= p_saldominimo
                    OR p_soloDeudores = 0 )
                    AND ( EXISTS ( SELECT *
                                         FROM EmpresaUsuario
                                            WHERE emp_id = doc.emp_id
                                                    AND us_id = p_us_id )
                    OR ( p_us_id = 1 ) )
/ * -///////////////////////////////////////////////////////////////////////
		
		INICIO SEGUNDA PARTE DE ARBOLES
		
/////////////////////////////////////////////////////////////////////// * /
                    AND ( fc.prov_id = v_prov_id
                    OR v_prov_id = 0 )
                    AND ( fc.suc_id = v_suc_id
                    OR v_suc_id = 0 )
                    AND ( ai.cue_id = v_cue_id
                    OR v_cue_id = 0 )
                    AND ( doc.cico_id = v_cico_id
                    OR v_cico_id = 0 )
                    AND ( doc.emp_id = v_emp_id
                    OR v_emp_id = 0 )
                    -- Arboles
                    AND ( ( EXISTS ( SELECT rptarb_hojaid
                                     FROM rptArbolRamaHoja
                                        WHERE rptarb_cliente = v_clienteID
                                                AND tbl_id = 29
                                                AND rptarb_hojaid = fc.prov_id ) )
                    OR ( v_ram_id_Proveedor = 0 ) )
                    AND ( ( EXISTS ( SELECT rptarb_hojaid
                                     FROM rptArbolRamaHoja
                                        WHERE rptarb_cliente = v_clienteID
                                                AND tbl_id = 1007
                                                AND rptarb_hojaid = fc.suc_id ) )
                    OR ( v_ram_id_Sucursal = 0 ) )
                    AND ( ( EXISTS ( SELECT rptarb_hojaid
                                     FROM rptArbolRamaHoja
                                        WHERE rptarb_cliente = v_clienteID
                                                AND tbl_id = 17
                                                AND rptarb_hojaid = ai.cue_id ) )
                    OR ( v_ram_id_Cuenta = 0 ) )
                    AND ( ( EXISTS ( SELECT rptarb_hojaid
                                     FROM rptArbolRamaHoja
                                        WHERE rptarb_cliente = v_clienteID
                                                AND tbl_id = 1016
                                                AND rptarb_hojaid = doc.cico_id ) )
                    OR ( v_ram_id_circuitocontable = 0 ) )
                    AND ( ( EXISTS ( SELECT rptarb_hojaid
                                     FROM rptArbolRamaHoja
                                        WHERE rptarb_cliente = v_clienteID
                                                AND tbl_id = 1018
                                                AND rptarb_hojaid = doc.emp_id ) )
                    OR ( v_ram_id_Empresa = 0 ) )
         UNION ALL
         --/////////////////////////////////////
         --	Remitos, Notas de Credio/Debito
         --/////////////////////////////////////
         SELECT 1 grp_total,
                            rc.doct_id doct_id,
                            rc.rc_id comp_id,
                            1 nOrden_id,
                            doc_nombre Documento,
                            rc_fecha Fecha,
                            rc_numero Numero,
                            rc_nrodoc Comprobante,
                            prov_nombre || ' -RZ: ' || prov_razonsocial || ' -CUIT: ' || prov_cuit || ' -TE: ' || prov_tel Proveedor,
                            CASE rc.doct_id
                                           WHEN 25 THEN -rc_neto
                            ELSE rc_neto
                               END Neto,
                            CASE rc.doct_id
                                           WHEN 25 THEN -rc_importedesc1 + rc_importedesc2
                            ELSE rc_importedesc1 + rc_importedesc2
                               END Descuento,
                            CASE rc.doct_id
                                           WHEN 25 THEN -rc_subtotal
                            ELSE rc_subtotal
                               END Sub_Total,
                            CASE rc.doct_id
                                           WHEN 25 THEN -rc_ivari + rc_ivarni
                            ELSE rc_ivari + rc_ivarni
                               END Iva,
                            CASE rc.doct_id
                                           WHEN 25 THEN -rc_total
                            ELSE rc_total
                               END Total,
                            0 Pagos,
                            CASE rc.doct_id
                                           WHEN 25 THEN -rc_pendiente
                            ELSE rc_pendiente
                               END Pendiente,
                            mon_nombre Moneda,
                            est_nombre Estado,
                            '' Cuenta,
                            doc_nombre Documento,
                            emp_nombre Empresa,
                            suc_nombre Sucursal,
                            cpg_nombre Cond_Pago,
                            CASE
                                 WHEN lgj_titulo <> '' THEN lgj_titulo
                            ELSE lgj_codigo
                               END Legajo,
                            ccos_nombre Centro_de_Costo,
                            rc_fecha Vto,
                            CASE rc.doct_id
                                           WHEN 25 THEN -rc_pendiente
                            ELSE rc_pendiente
                               END Vto_Importe,
                            CASE rc.doct_id
                                           WHEN 25 THEN -rc_pendiente
                            ELSE rc_pendiente
                               END Vto_Pendiente,
                            rc_descrip Observaciones
           FROM RemitoCompra rc
                  JOIN Proveedor prov
                   ON rc.prov_id = prov.prov_id
                  AND p_conRemito <> 0
                  LEFT JOIN Documento doc
                   ON rc.doc_id = doc.doc_id
                  LEFT JOIN Moneda mon
                   ON doc.mon_id = mon.mon_id
                  LEFT JOIN Estado est
                   ON rc.est_id = est.est_id
                  LEFT JOIN Empresa emp
                   ON doc.emp_id = emp.emp_id
                  LEFT JOIN Sucursal suc
                   ON rc.suc_id = suc.suc_id
                  LEFT JOIN Legajo lgj
                   ON rc.lgj_id = lgj.lgj_id
                  LEFT JOIN CondicionPago cpg
                   ON rc.cpg_id = cpg.cpg_id
                  LEFT JOIN CentroCosto ccos
                   ON rc.ccos_id = ccos.ccos_id
            WHERE rc_fecha >= p_Fini
                    AND rc_fecha <= p_Ffin
                    AND rc.est_id <> 7
                    AND p_conRemito <> 0
                    AND ( ABS(sqlserver_utilities.round_(rc_pendiente, 2)) >= p_saldominimo
                    OR p_soloDeudores = 0 )
                    AND ( EXISTS ( SELECT *
                                         FROM EmpresaUsuario
                                            WHERE emp_id = doc.emp_id
                                                    AND us_id = p_us_id )
                    OR ( p_us_id = 1 ) )
/ * -///////////////////////////////////////////////////////////////////////
		
		INICIO SEGUNDA PARTE DE ARBOLES
		
/////////////////////////////////////////////////////////////////////// * /
                    AND ( rc.prov_id = v_prov_id
                    OR v_prov_id = 0 )
                    AND ( rc.suc_id = v_suc_id
                    OR v_suc_id = 0 )
                    AND ( doc.cico_id = v_cico_id
                    OR v_cico_id = 0 )
                    AND ( doc.emp_id = v_emp_id
                    OR v_emp_id = 0 )
                    -- Arboles
                    AND ( ( EXISTS ( SELECT rptarb_hojaid
                                     FROM rptArbolRamaHoja
                                        WHERE rptarb_cliente = v_clienteID
                                                AND tbl_id = 29
                                                AND rptarb_hojaid = rc.prov_id ) )
                    OR ( v_ram_id_Proveedor = 0 ) )
                    AND ( ( EXISTS ( SELECT rptarb_hojaid
                                     FROM rptArbolRamaHoja
                                        WHERE rptarb_cliente = v_clienteID
                                                AND tbl_id = 1007
                                                AND rptarb_hojaid = rc.suc_id ) )
                    OR ( v_ram_id_Sucursal = 0 ) )
                    AND ( ( EXISTS ( SELECT rptarb_hojaid
                                     FROM rptArbolRamaHoja
                                        WHERE rptarb_cliente = v_clienteID
                                                AND tbl_id = 1016
                                                AND rptarb_hojaid = doc.cico_id ) )
                    OR ( v_ram_id_circuitocontable = 0 ) )
                    AND ( ( EXISTS ( SELECT rptarb_hojaid
                                     FROM rptArbolRamaHoja
                                        WHERE rptarb_cliente = v_clienteID
                                                AND tbl_id = 1018
                                                AND rptarb_hojaid = doc.emp_id ) )
                    OR ( v_ram_id_Empresa = 0 ) )
         --/////////////////////////////////////
         --	Ordenes de Pago
         --/////////////////////////////////////
         UNION ALL
         SELECT 1 grp_total,
                opg.doct_id doct_id,
                opg.opg_id comp_id,
                1 nOrden_id,
                doc_nombre Documento,
                opg_fecha Fecha,
                opg_numero Numero,
                opg_nrodoc Comprobante,
                prov_nombre || ' -RZ: ' || prov_razonsocial || ' -CUIT: ' || prov_cuit || ' -TE: ' || prov_tel Proveedor,
                0 Neto,
                0 Descuento,
                0 Sub_Total,
                0 Iva,
                0 Total,
                opg_total Pagos,
                -opg_pendiente Pendiente,
                '' Moneda,
                est_nombre Estado,
                ( SELECT MIN(cue_nombre)
                  FROM OrdenPagoItem opgi
                         JOIN Cuenta cue
                          ON opgi.cue_id = cue.cue_id
                     WHERE opg_id = opg.opg_id
                             AND opgi_tipo = 5 ) Cuenta,
                doc_nombre Documento,
                emp_nombre Empresa,
                suc_nombre Sucursal,
                '' Cond_Pago,
                CASE
                     WHEN lgj_titulo <> '' THEN lgj_titulo
                ELSE lgj_codigo
                   END Legajo,
                ccos_nombre Centro_de_Costo,
                opg_fecha Vto,
                0 Vto,
                -opg_pendiente Vto_Pendiente,
                opg_descrip Observaciones
           FROM OrdenPago opg
                  JOIN Proveedor prov
                   ON opg.prov_id = prov.prov_id
                  JOIN Estado est
                   ON opg.est_id = est.est_id
                  JOIN Documento doc
                   ON opg.doc_id = doc.doc_id
                  JOIN Empresa emp
                   ON doc.emp_id = emp.emp_id
                  JOIN Sucursal suc
                   ON opg.suc_id = suc.suc_id
                  LEFT JOIN Legajo lgj
                   ON opg.lgj_id = lgj.lgj_id
                  LEFT JOIN CentroCosto ccos
                   ON opg.ccos_id = ccos.ccos_id
            WHERE opg_fecha >= p_Fini
                    AND opg_fecha <= p_Ffin
                    AND opg.est_id <> 7
                    AND ( ABS(sqlserver_utilities.round_(opg_pendiente, 2)) >= p_saldominimo
                    OR p_soloDeudores = 0 )
                    AND ( EXISTS ( SELECT *
                                         FROM EmpresaUsuario
                                            WHERE emp_id = doc.emp_id
                                                    AND us_id = p_us_id )
                    OR ( p_us_id = 1 ) )
/ * -///////////////////////////////////////////////////////////////////////
		
		INICIO SEGUNDA PARTE DE ARBOLES
		
/////////////////////////////////////////////////////////////////////// * /
                    AND ( opg.prov_id = v_prov_id
                    OR v_prov_id = 0 )
                    AND ( opg.suc_id = v_suc_id
                    OR v_suc_id = 0 )
                    AND ( EXISTS ( SELECT *
                                   FROM OrdenPagoItem
                                      WHERE opg_id = opg.opg_id
                                              AND opgi_tipo = v_cta_acreedoropg
                                              AND cue_id = v_cue_id )
                    OR v_cue_id = 0 )
                    AND ( doc.cico_id = v_cico_id
                    OR v_cico_id = 0 )
                    AND ( doc.emp_id = v_emp_id
                    OR v_emp_id = 0 )
                    -- Arboles
                    AND ( ( EXISTS ( SELECT rptarb_hojaid
                                     FROM rptArbolRamaHoja
                                        WHERE rptarb_cliente = v_clienteID
                                                AND tbl_id = 29
                                                AND rptarb_hojaid = opg.prov_id ) )
                    OR ( v_ram_id_Proveedor = 0 ) )
                    AND ( ( EXISTS ( SELECT rptarb_hojaid
                                     FROM rptArbolRamaHoja
                                        WHERE rptarb_cliente = v_clienteID
                                                AND tbl_id = 1007
                                                AND rptarb_hojaid = opg.suc_id ) )
                    OR ( v_ram_id_Sucursal = 0 ) )
                    AND ( ( EXISTS ( SELECT rptarb_hojaid
                                     FROM rptArbolRamaHoja
                                        WHERE rptarb_cliente = v_clienteID
                                                AND tbl_id = 17
                                                AND ( EXISTS ( SELECT *
                                                               FROM OrdenPagoItem
                                                                  WHERE opg_id = opg.opg_id
                                                                          AND opgi_tipo = v_cta_acreedoropg
                                                                          AND cue_id = rptarb_hojaid ) ) ) )
                    OR ( v_ram_id_Cuenta = 0 ) )
                    AND ( ( EXISTS ( SELECT rptarb_hojaid
                                     FROM rptArbolRamaHoja
                                        WHERE rptarb_cliente = v_clienteID
                                                AND tbl_id = 1016
                                                AND rptarb_hojaid = doc.cico_id ) )
                    OR ( v_ram_id_circuitocontable = 0 ) )
                    AND ( ( EXISTS ( SELECT rptarb_hojaid
                                     FROM rptArbolRamaHoja
                                        WHERE rptarb_cliente = v_clienteID
                                                AND tbl_id = 1018
                                                AND rptarb_hojaid = doc.emp_id ) )
                    OR ( v_ram_id_Empresa = 0 ) )
           ORDER BY Proveedor,
                    Cuenta,
                    Fecha,
                    nOrden_id;

   END;
   END IF;
*/

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION dc_csc_com_0010(integer, date, date, character varying, character varying, character varying, character varying, smallint, character varying, smallint, smallint, smallint)
  OWNER TO postgres;
