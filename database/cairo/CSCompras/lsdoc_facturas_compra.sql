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
-- Function: sp_lsdoc_facturas_compra()

-- DROP FUNCTION sp_lsdoc_facturas_compra(integer, integer, integer, varchar, integer, integer, varchar);

CREATE OR REPLACE FUNCTION sp_lsdoc_facturas_compra
/*
select * from FacturaCompra

select * from sp_lsdoc_facturas_compra(
7,
'20030101'::date,
'20050101'::date,
'0',
'0',
'0',
'0',
'0',
'0',
'0');
fetch all from rtn;
*/
(
  IN p_us_id integer,
  IN p_Fini date,
  IN p_Ffin date,
  IN p_prov_id varchar,
  IN p_est_id varchar,
  IN p_ccos_id varchar,
  IN p_suc_id varchar,
  IN p_doc_id varchar,
  IN p_cpg_id varchar,
  IN p_emp_id varchar,
  OUT rtn refcursor
)
  RETURNS refcursor AS
$BODY$
DECLARE
/*- ///////////////////////////////////////////////////////////////////////
INICIO PRIMERA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
   v_prov_id integer;
   v_ccos_id integer;
   v_suc_id integer;
   v_est_id integer;
   v_doc_id integer;
   v_cpg_id integer;
   v_emp_id integer;
   v_ram_id_Proveedor integer;
   v_ram_id_CentroCosto integer;
   v_ram_id_Sucursal integer;
   v_ram_id_Estado integer;
   v_ram_id_Vendedor integer;
   v_ram_id_Documento integer;
   v_ram_id_CondicionPago integer;
   v_ram_id_Empresa integer;
   v_clienteID integer;
   v_IsRaiz numeric(3,0);
BEGIN

/*debug
p_us_id := 1;
p_Fini := '20000101'::date;
p_Ffin := '20150101'::date;
p_prov_id := '0';
p_est_id := '0';
p_ccos_id := '0';
p_suc_id := '0';
p_doc_id := '0';
p_cpg_id := '0';
p_emp_id := '0';
end debug*/

   rtn := 'rtn';

   select * from sp_ArbConvertId(p_prov_id) into v_prov_id, v_ram_id_Proveedor;

   select * from sp_ArbConvertId(p_ccos_id) into v_ccos_id, v_ram_id_CentroCosto;

   select * from  sp_ArbConvertId(p_suc_id) into v_suc_id, v_ram_id_Sucursal;

   select * from  sp_ArbConvertId(p_est_id) into v_est_id, v_ram_id_Estado;

   select * from  sp_ArbConvertId(p_doc_id) into v_doc_id, v_ram_id_Documento;

   select * from  sp_ArbConvertId(p_cpg_id) into v_cpg_id, v_ram_id_CondicionPago;

   select * from  sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_Empresa;

   select * from  sp_GetRptId() into v_clienteID;

   IF v_ram_id_Proveedor <> 0 THEN
   BEGIN
      --	exec sp_ArbGetGroups @ram_id_Proveedor, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Proveedor) into v_IsRaiz;

      IF v_IsRaiz = 0 THEN
      BEGIN
         perform sp_ArbGetAllHojas(v_ram_id_Proveedor,
                           v_clienteID);

      END;
      ELSE
         v_ram_id_Proveedor := 0;

      END IF;

   END;
   END IF;

   IF v_ram_id_CentroCosto <> 0 THEN
   BEGIN
      --	exec sp_ArbGetGroups @ram_id_CentroCosto, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_CentroCosto) into v_IsRaiz;

      IF v_IsRaiz = 0 THEN
      BEGIN
         perform sp_ArbGetAllHojas(v_ram_id_CentroCosto,
                           v_clienteID);

      END;
      ELSE
         v_ram_id_CentroCosto := 0;

      END IF;

   END;
   END IF;

   IF v_ram_id_Estado <> 0 THEN
   BEGIN
      --	exec sp_ArbGetGroups @ram_id_Estado, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Estado) into v_IsRaiz;

      IF v_IsRaiz = 0 THEN
      BEGIN
         perform sp_ArbGetAllHojas(v_ram_id_Estado,
                           v_clienteID);

      END;
      ELSE
         v_ram_id_Estado := 0;

      END IF;

   END;
   END IF;

   IF v_ram_id_Sucursal <> 0 THEN
   BEGIN
      --	exec sp_ArbGetGroups @ram_id_Sucursal, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Sucursal) into v_IsRaiz;

      IF v_IsRaiz = 0 THEN
      BEGIN
         perform sp_ArbGetAllHojas(v_ram_id_Sucursal,
                           v_clienteID);

      END;
      ELSE
         v_ram_id_Sucursal := 0;

      END IF;

   END;
   END IF;

   IF v_ram_id_Vendedor <> 0 THEN
   BEGIN
      --	exec sp_ArbGetGroups @ram_id_Vendedor, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Vendedor) into v_IsRaiz;

      IF v_IsRaiz = 0 THEN
      BEGIN
         perform sp_ArbGetAllHojas(v_ram_id_Vendedor,
                           v_clienteID);

      END;
      ELSE
         v_ram_id_Vendedor := 0;

      END IF;

   END;
   END IF;

   IF v_ram_id_Documento <> 0 THEN
   BEGIN
      --	exec sp_ArbGetGroups @ram_id_Documento, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Documento) into v_IsRaiz;

      IF v_IsRaiz = 0 THEN
      BEGIN
         perform sp_ArbGetAllHojas(v_ram_id_Documento,
                           v_clienteID);

      END;
      ELSE
         v_ram_id_Documento := 0;

      END IF;

   END;
   END IF;

   IF v_ram_id_CondicionPago <> 0 THEN
   BEGIN
      --	exec sp_ArbGetGroups @ram_id_CondicionPago, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_CondicionPago) into v_IsRaiz;

      IF v_IsRaiz = 0 THEN
      BEGIN
         perform sp_ArbGetAllHojas(v_ram_id_CondicionPago,
                           v_clienteID);

      END;
      ELSE
         v_ram_id_CondicionPago := 0;

      END IF;

   END;
   END IF;

   IF v_ram_id_Empresa <> 0 THEN
   BEGIN
      --	exec sp_ArbGetGroups @ram_id_Empresa, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Empresa) into v_IsRaiz;

      IF v_IsRaiz = 0 THEN
      BEGIN
         perform sp_ArbGetAllHojas(v_ram_id_Empresa,
                           v_clienteID);

      END;
      ELSE
         v_ram_id_Empresa := 0;

      END IF;

   END;
   END IF;

   OPEN rtn FOR
/*- ///////////////////////////////////////////////////////////////////////
FIN PRIMERA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
      SELECT fc_id,
                     '' TypeTask,
                     fc_numero Numero,
                     fc_nrodoc Comprobante,
                     prov_nombre Proveedor,
                     doc_nombre Documento,
                     est_nombre Estado,
                     CASE fc_tipocomprobante
                                            WHEN 1 THEN 'Original'
                                            WHEN 2 THEN 'Fax'
                                            WHEN 3 THEN 'Fotocopia'
                                            WHEN 4 THEN 'Duplicado'   END Tipo_Comprobante,
                     fc_fecha Fecha,
                     fc_fechaentrega Fecha_de_entrega,
                     fc_fechaiva Fecha_IVA,
                     fc_neto Neto,
                     fc_ivari IVA_RI,
                     fc_ivarni IVA_RNI,
                     fc_totalotros Otros,
                     fc_subtotal Subtotal,
                     fc_total Total,
                     fc_pendiente Pendiente,
                     CASE fc_firmado
                                    WHEN 0 THEN 'No'
                     ELSE 'Si'
                        END Firmado,
                     fc_descuento1 Desc_1,
                     fc_descuento2 Desc_2,
                     fc_importedesc1 Desc_1,
                     fc_importedesc2 Desc_2,
                     lp_nombre Lista_de_Precios,
                     ld_nombre Lista_de_descuentos,
                     cpg_nombre Condicion_de_Pago,
                     ccos_nombre Centro_de_costo,
                     suc_nombre Sucursal,
                     emp_nombre Empresa,
                     FacturaCompra.creado,
                     FacturaCompra.modificado,
                     us_nombre Modifico,
                     fc_descrip Observaciones
        FROM FacturaCompra
               JOIN Documento
                ON FacturaCompra.doc_id = Documento.doc_id
               JOIN Empresa
                ON Documento.emp_id = Empresa.emp_id
               JOIN CondicionPago
                ON FacturaCompra.cpg_id = CondicionPago.cpg_id
               JOIN Estado
                ON FacturaCompra.est_id = Estado.est_id
               JOIN Sucursal
                ON FacturaCompra.suc_id = Sucursal.suc_id
               JOIN Proveedor
                ON FacturaCompra.prov_id = Proveedor.prov_id
               JOIN Usuario
                ON FacturaCompra.modifico = Usuario.us_id
               LEFT JOIN CentroCosto
                ON FacturaCompra.ccos_id = CentroCosto.ccos_id
               LEFT JOIN ListaPrecio
                ON FacturaCompra.lp_id = ListaPrecio.lp_id
               LEFT JOIN ListaDescuento
                ON FacturaCompra.ld_id = ListaDescuento.ld_id
         WHERE p_Fini <= fc_fecha
                 AND p_Ffin >= fc_fecha
/* -///////////////////////////////////////////////////////////////////////
INICIO SEGUNDA PARTE DE ARBOLES
/////////////////////////////////////////////////////////////////////// */
                 AND ( Proveedor.prov_id = v_prov_id
                 OR v_prov_id = 0 )
                 AND ( Estado.est_id = v_est_id
                 OR v_est_id = 0 )
                 AND ( Sucursal.suc_id = v_suc_id
                 OR v_suc_id = 0 )
                 AND ( Documento.doc_id = v_doc_id
                 OR v_doc_id = 0 )
                 AND ( CondicionPago.cpg_id = v_cpg_id
                 OR v_cpg_id = 0 )
                 AND ( FacturaCompra.ccos_id = v_ccos_id
                 OR v_ccos_id = 0
                 OR EXISTS ( SELECT *
                             FROM FacturaCompraItem fci
                                WHERE fci.fc_id = FacturaCompra.fc_id
                                        AND fci.ccos_id = v_ccos_id ) )
                 AND ( Empresa.emp_id = v_emp_id
                 OR v_emp_id = 0 )
                 -- Arboles
                 AND ( ( EXISTS ( SELECT rptarb_hojaid
                                  FROM rptArbolRamaHoja
                                     WHERE rptarb_cliente = v_clienteID
                                             AND tbl_id = 29
                                             AND rptarb_hojaid = Proveedor.prov_id ) )
                 OR ( v_ram_id_Proveedor = 0 ) )
                 AND ( ( EXISTS ( SELECT rptarb_hojaid
                                  FROM rptArbolRamaHoja
                                     WHERE rptarb_cliente = v_clienteID
                                             AND tbl_id = 21
                                             AND ( rptarb_hojaid = FacturaCompra.ccos_id
                                             OR EXISTS ( SELECT *
                                                         FROM FacturaCompraItem fci
                                                            WHERE fci.fc_id = FacturaCompra.fc_id
                                                                    AND fci.ccos_id = rptarb_hojaid ) ) ) )
                 OR ( v_ram_id_CentroCosto = 0 ) )
                 AND ( ( EXISTS ( SELECT rptarb_hojaid
                                  FROM rptArbolRamaHoja
                                     WHERE rptarb_cliente = v_clienteID
                                             AND tbl_id = 4005
                                             AND rptarb_hojaid = Estado.est_id ) )
                 OR ( v_ram_id_Estado = 0 ) )
                 AND ( ( EXISTS ( SELECT rptarb_hojaid
                                  FROM rptArbolRamaHoja
                                     WHERE rptarb_cliente = v_clienteID
                                             AND tbl_id = 1007
                                             AND rptarb_hojaid = Sucursal.suc_id ) )
                 OR ( v_ram_id_Sucursal = 0 ) )
                 AND ( ( EXISTS ( SELECT rptarb_hojaid
                                  FROM rptArbolRamaHoja
                                     WHERE rptarb_cliente = v_clienteID
                                             AND tbl_id = 4001
                                             AND rptarb_hojaid = Documento.doc_id ) )
                 OR ( v_ram_id_Documento = 0 ) )
                 AND ( ( EXISTS ( SELECT rptarb_hojaid
                                  FROM rptArbolRamaHoja
                                     WHERE rptarb_cliente = v_clienteID
                                             AND tbl_id = 1005
                                             AND rptarb_hojaid = CondicionPago.cpg_id ) )
                 OR ( v_ram_id_CondicionPago = 0 ) )
                 AND ( ( EXISTS ( SELECT rptarb_hojaid
                                  FROM rptArbolRamaHoja
                                     WHERE rptarb_cliente = v_clienteID
                                             AND tbl_id = 1018
                                             AND rptarb_hojaid = Empresa.emp_id ) )
                 OR ( v_ram_id_Empresa = 0 ) )
        ORDER BY fc_fecha;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_lsdoc_facturas_compra(integer, date, date, varchar, varchar, varchar, varchar, varchar, varchar, varchar)
  OWNER TO postgres;