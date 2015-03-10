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
-- Function: sp_doc_factura_compra_get()

-- DROP FUNCTION sp_doc_factura_compra_get(integer, integer, integer);
/*
select * from sp_doc_factura_compra_get(1,1,1);
fetch all from rtn;
*/
CREATE OR REPLACE FUNCTION sp_doc_factura_compra_get
(
  IN p_emp_id integer,
  IN p_fc_id integer,
  IN p_us_id integer,
  OUT rtn refcursor
)
  RETURNS refcursor AS
$BODY$
DECLARE
   v_bEditable numeric(3,0);
   v_editMsg varchar(255);
   v_doc_id integer;
   v_doct_id integer;
   v_ta_Mascara varchar(100);
   v_ta_Propuesto numeric(3,0);
   v_DeplNombre varchar(255);
   v_DeplId integer;
   v_bIvari numeric(3,0);
   v_bIvarni numeric(3,0);
   v_prov_id integer;

   dummyCur refcursor;
   dummyNumber integer;
BEGIN

   rtn := 'rtn';

   SELECT prov_id,
          doc_id,
          doct_id
   INTO v_prov_id,
          v_doc_id,
          v_doct_id
   FROM FacturaCompra
   WHERE fc_id = p_fc_id;

   select * from sp_talonario_get_propuesto(v_doc_id, 0, v_prov_id) into v_ta_Mascara, v_ta_Propuesto;

   select * from sp_proveedor_get_iva(v_prov_id, 0::smallint) into v_bIvari, v_bIvarni;

   select * from sp_doc_factura_compra_editable_get(p_emp_id, p_fc_id, p_us_id) into v_bEditable, v_editMsg;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                             DEPOSITO                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
    /*Factura de Compra*/
    /*Nota de Debito Compra*/
   IF v_doct_id = 2
     OR v_doct_id = 10 THEN
   BEGIN
      SELECT dDestino.depl_nombre,
             depl_id_destino
      INTO v_DeplNombre,
           v_DeplId
      FROM FacturaCompra
               JOIN Stock
                ON FacturaCompra.st_id = Stock.st_id
               LEFT JOIN DepositoLogico dDestino
                ON Stock.depl_id_destino = dDestino.depl_id
      WHERE fc_id = p_fc_id;

      v_DeplNombre := coalesce(v_DeplNombre, '');

      v_DeplId := coalesce(v_DeplId, 0);

      IF v_DeplId = 0 THEN
      BEGIN
         SELECT dDestino.depl_nombre,
                depl_id_destino
           INTO v_DeplNombre,
                v_DeplId
           FROM FacturaCompra
                  JOIN RemitoCompra
                   ON FacturaCompra.rc_id = RemitoCompra.rc_id
                  JOIN Stock
                   ON RemitoCompra.st_id = Stock.st_id
                  LEFT JOIN DepositoLogico dDestino
                   ON Stock.depl_id_destino = dDestino.depl_id
            WHERE fc_id = p_fc_id;

      END;
      END IF;

   END;
   ELSE
   BEGIN
      /*Nota de Credito Compra*/
      IF v_doct_id = 8 THEN
         SELECT dOrigen.depl_nombre,
                        depl_id_origen
           INTO v_DeplNombre,
                v_DeplId
           FROM FacturaCompra
                  JOIN Stock
                   ON FacturaCompra.st_id = Stock.st_id
                  LEFT JOIN DepositoLogico dOrigen
                   ON Stock.depl_id_origen = dOrigen.depl_id
            WHERE fc_id = p_fc_id;

      END IF;

      v_DeplNombre := coalesce(v_DeplNombre, '');

      v_DeplId := coalesce(v_DeplId, 0);

      IF v_DeplId = 0 THEN
      BEGIN
         SELECT dOrigen.depl_nombre,
                depl_id_origen
           INTO v_DeplNombre,
                v_DeplId
           FROM FacturaCompra
                  JOIN RemitoCompra
                   ON FacturaCompra.rc_id = RemitoCompra.rc_id
                  JOIN Stock
                   ON RemitoCompra.st_id = Stock.st_id
                  LEFT JOIN DepositoLogico dOrigen
                   ON Stock.depl_id_origen = dOrigen.depl_id
            WHERE fc_id = p_fc_id;

      END;
      END IF;

   END;
   END IF;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                             SELECT                                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
   OPEN rtn FOR

      SELECT FacturaCompra.*,
             prov_nombre,
             lp_nombre,
             ld_nombre,
             cpg_nombre,
             est_nombre,
             ccos_nombre,
             suc_nombre,
             doc_nombre,
             CASE
                  WHEN lgj_titulo <> '' THEN lgj_titulo
                  ELSE lgj_codigo
             END lgj_codigo,
             pOrigen.pro_nombre ProOrigen,
             pDestino.pro_nombre ProDestino,
             v_DeplId depl_id,
             v_DeplNombre depl_nombre,
             v_bIvari bIvaRi,
             v_bIvarni bIvaRni,
             v_bEditable editable,
             v_editMsg editMsg,
             v_ta_Mascara TaMascara,
             v_ta_Propuesto TaPropuesto
        FROM FacturaCompra
               JOIN Documento
                ON FacturaCompra.doc_id = Documento.doc_id
               JOIN CondicionPago
                ON FacturaCompra.cpg_id = CondicionPago.cpg_id
               JOIN Estado
                ON FacturaCompra.est_id = Estado.est_id
               JOIN Sucursal
                ON FacturaCompra.suc_id = Sucursal.suc_id
               JOIN Proveedor
                ON FacturaCompra.prov_id = Proveedor.prov_id
               LEFT JOIN CentroCosto
                ON FacturaCompra.ccos_id = CentroCosto.ccos_id
               LEFT JOIN ListaPrecio
                ON FacturaCompra.lp_id = ListaPrecio.lp_id
               LEFT JOIN ListaDescuento
                ON FacturaCompra.ld_id = ListaDescuento.ld_id
               LEFT JOIN Legajo
                ON FacturaCompra.lgj_id = Legajo.lgj_id
               LEFT JOIN Provincia pOrigen
                ON FacturaCompra.pro_id_origen = pOrigen.pro_id
               LEFT JOIN Provincia pDestino
                ON FacturaCompra.pro_id_destino = pDestino.pro_id
         WHERE fc_id = p_fc_id;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_doc_factura_compra_get(integer, integer, integer)
  OWNER TO postgres;