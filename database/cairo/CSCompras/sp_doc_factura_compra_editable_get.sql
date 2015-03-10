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
-- Function: sp_doc_factura_compra_editable_get()

-- DROP FUNCTION sp_doc_factura_compra_editable_get(integer, integer, integer, smallint, smallint, smallint);

CREATE OR REPLACE FUNCTION sp_doc_factura_compra_editable_get
/*
sp_doc_factura_compra_editable_get 57,7,0,'',1
*/
(
  IN p_emp_id integer,
  IN p_fc_id integer,
  IN p_us_id integer,
  OUT p_bEditable smallint,
  OUT p_editMsg varchar,
  IN p_ShowMsg smallint DEFAULT 0,
  IN p_bNoAnulado smallint DEFAULT 0,
  IN p_bDelete smallint DEFAULT 0
)
  RETURNS record AS
$BODY$
DECLARE
   v_doc_id integer;
   v_fc_fecha date;
   v_estado integer;
   v_anulado integer;
   v_firmado integer;
   v_emp_id integer;
   v_emp_nombre varchar(255);
   v_impreso numeric(3,0);
   v_csPreCpraEditFactura integer;
   v_csPreCpraDeleteFactura integer;
BEGIN

   IF p_ShowMsg <> 0 THEN
      RAISE EXCEPTION '@@ERROR_SP:El procedimiento almacenado SP_DBGetNewId no puede ser llamado para obtener un cursor. El codigo Java o Scala debe usar parametros OUT.';
	  RETURN;
   END IF;

   v_anulado := 7;
   v_csPreCpraEditFactura := 17003;
   v_csPreCpraDeleteFactura := 17004;

   IF p_fc_id <> 0 THEN
       DECLARE
          v_pre_id integer;
          v_doc_nombre varchar(255);
          v_fca_id integer;
       BEGIN

          SELECT D.doc_id,
                 D.emp_id,
                 c.fc_fecha,
                 c.est_id,
                 c.impreso
            INTO v_doc_id,
                 v_emp_id,
                 v_fc_fecha,
                 v_estado,
                 v_impreso
          FROM FacturaCompra c
                   JOIN Documento D
                    ON c.doc_id = D.doc_id
          WHERE c.fc_id = p_fc_id;

          IF p_emp_id <> v_emp_id THEN
          BEGIN

             SELECT emp_nombre
               INTO v_emp_nombre
             FROM Empresa
             WHERE emp_id = v_emp_id;

             p_bEditable := 0;

             IF p_bDelete = 0 THEN
                p_editMsg := 'El comprobante pertenece a la empresa ' || v_emp_nombre || ', para editarlo debe ingresar al sistema indicando dicha empresa.';
             ELSE
                p_editMsg := 'El comprobante pertenece a la empresa ' || v_emp_nombre || ', para borrarlo debe ingresar al sistema indicando dicha empresa.';
             END IF;
             RETURN;

          END;
          END IF;

          IF v_estado = v_anulado AND p_bNoAnulado = 0 THEN
          BEGIN
             p_bEditable := 0;
             p_editMsg := 'El comprobante esta anulado';
             RETURN;

          END;
          END IF;

          IF p_bDelete = 0 THEN
             v_pre_id := v_csPreCpraEditFactura;
          ELSE
             v_pre_id := v_csPreCpraDeleteFactura;
          END IF;

          -- Tiene permiso para editar facturas de compra
          --
          IF NOT EXISTS ( SELECT per_id
                          FROM Permiso
                          WHERE pre_id = v_pre_id
                            AND ( ( us_id = p_us_id )
                                 OR EXISTS ( SELECT us_id
                                             FROM UsuarioRol
                                             WHERE us_id = p_us_id
                                               AND rol_id = Permiso.rol_id ))) THEN

             p_bEditable := 0;

             IF p_bDelete = 0 THEN
                p_editMsg := 'Usted no tiene permiso para editar facturas de compra';
             ELSE
                p_editMsg := 'Usted no tiene permiso para borrar facturas de compra';
             END IF;
             RETURN;

          END IF;

          v_pre_id := NULL;

          SELECT CASE
                   WHEN p_bDelete = 0 THEN pre_id_edit
                   ELSE pre_id_delete
                 END,
                 doc_nombre
            INTO v_pre_id,
                 v_doc_nombre
          FROM Documento
          WHERE doc_id = v_doc_id;

          IF NOT EXISTS ( SELECT per_id
                          FROM Permiso
                          WHERE pre_id = v_pre_id
                            AND ( ( us_id = p_us_id )
                                 OR EXISTS ( SELECT us_id
                                             FROM UsuarioRol
                                             WHERE us_id = p_us_id
                                               AND rol_id = Permiso.rol_id))) THEN
             p_bEditable := 0;

             IF p_bDelete = 0 THEN
                p_editMsg := 'Usted no tiene permiso para editar ' || v_doc_nombre;
             ELSE
                p_editMsg := 'Usted no tiene permiso para borrar ' || v_doc_nombre;
             END IF;
             RETURN;

          END IF;

          -- Fechas de control de Acceso
          SELECT fca_id
            INTO v_fca_id
          FROM Documento
          WHERE doc_id = v_doc_id;

          IF NOT v_fca_id IS NULL THEN

             IF NOT EXISTS ( SELECT fca_id
                             FROM FechaControlAcceso
                             WHERE fca_id = v_fca_id
                               AND v_fc_fecha BETWEEN fca_fechaDesde AND fca_fechaHasta ) THEN
                 DECLARE
                    v_fca_fechaDesde date;
                    v_fca_fechaHasta date;
                 BEGIN

                    SELECT fca_fechaDesde,
                           fca_fechaHasta
                      INTO v_fca_fechaDesde,
                           v_fca_fechaHasta
                    FROM FechaControlAcceso
                    WHERE fca_id = v_fca_id;

                    p_bEditable := 0;

                    p_editMsg := 'La fecha del comprobante esta fuera del intervalo definido por las fechas de control de acceso ('
                                    || to_char(coalesce(v_fca_fechaDesde, ''), 'dd-mm-yyyy')
                                    || ' - '
                                    || to_char(coalesce(v_fca_fechaHasta, ''), 'dd-mm-yyyy')
                                    || ')';
                    RETURN;

                 END;
             END IF;

          END IF;

          IF EXISTS ( SELECT fc_id
                      FROM FacturaCompraOrdenPago
                      WHERE fc_id = p_fc_id ) THEN

             -- Si la condicion de pago es por debito automatico
             -- la aplicacion no impide la edicion
             --
             IF NOT EXISTS ( SELECT fc.cpg_id
                             FROM FacturaCompra fc
                             JOIN CondicionPago cpg
                               ON fc.cpg_id = cpg.cpg_id
                              AND cpg.cpg_tipo IN ( 2,3 )
                             WHERE fc.fc_id = p_fc_id ) THEN
                p_bEditable := 0;
                p_editMsg := 'El comprobante esta vinculado a una orden de pago';
                RETURN;

             END IF;

          END IF;

          IF EXISTS ( SELECT fc_id_factura
                      FROM FacturaCompraNotaCredito
                      WHERE fc_id_factura = p_fc_id
                         OR fc_id_notacredito = p_fc_id ) THEN

             p_bEditable := 0;
             p_editMsg := 'El comprobante esta vinculado a una factura o nota de credito';
             RETURN;

          END IF;


          IF EXISTS ( SELECT fci.fc_id
                      FROM RemitoFacturaCompra r
                      JOIN FacturaCompraItem fci
                        ON r.fci_id = fci.fci_id
                      WHERE fci.fc_id = p_fc_id ) THEN

             p_bEditable := 0;
             p_editMsg := 'El comprobante esta vinculado a un remito';
             RETURN;

          END IF;

          IF EXISTS ( SELECT fci.fc_id
                      FROM OrdenFacturaCompra oc
                      JOIN FacturaCompraItem fci
                        ON oc.fci_id = fci.fci_id
                      WHERE fci.fc_id = p_fc_id ) THEN

             p_bEditable := 0;
             p_editMsg := 'El comprobante esta vinculado a una orden de compra';
             RETURN;

          END IF;

          IF v_impreso <> 0 AND p_bNoAnulado = 0 THEN
              DECLARE
                 v_doc_editarimpresos numeric(3,0);
              BEGIN

                 SELECT doc_editarimpresos
                   INTO v_doc_editarimpresos
                 FROM Documento
                 WHERE doc_id = v_doc_id;

                 IF v_doc_editarimpresos = 0 THEN

                    p_bEditable := 0;

                    IF p_bDelete = 0 THEN
                       p_editMsg := 'El comprobante esta impreso y la definición de su documento no permite la edición de comprobantes impresos.';
                    ELSE
                       p_editMsg := 'El comprobante esta impreso y la definición de su documento no permite eliminar comprobantes impresos.';
                    END IF;
                    RETURN;

                 END IF;

              END;
          END IF;

       END;
   END IF;

   p_bEditable := 1;
   p_editMsg := '';

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_doc_factura_compra_editable_get(integer, integer, integer, smallint, smallint, smallint)
  OWNER TO postgres;