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
-- Function: sp_talonario_get_propuesto()

-- DROP FUNCTION sp_talonario_get_propuesto(integer, integer, integer);

CREATE OR REPLACE FUNCTION sp_talonario_get_propuesto
/*
*/
(
  IN p_doc_id integer,
  OUT p_ta_Mascara varchar,
  OUT p_ta_Propuesto smallint,
  IN p_cli_id integer DEFAULT 0,
  IN p_prov_id integer DEFAULT 0,
  OUT p_ta_id int,
  OUT p_ta_tipo smallint
)
  RETURNS record AS
$BODY$
DECLARE
   v_ta_id integer;
   v_doct_id integer;
   v_cli_catfiscal integer;
   v_prov_catfiscal integer;
BEGIN

   IF coalesce(p_doc_id, 0) = 0 THEN
       BEGIN
          p_ta_Mascara := '';

          p_ta_Propuesto := 0;

          p_ta_tipo := 0;

          p_ta_id := NULL;

       END;
   ELSE
       BEGIN
          SELECT ta_id,
                 doct_id
            INTO v_ta_id,
                 v_doct_id
          FROM Documento
          WHERE doc_id = p_doc_id;

          IF v_doct_id IN (
                  1   --   Factura de Venta
                  ,2  --   Factura de Compra
                  ,7  --   Nota de Credito Venta
                  ,8  --   Nota de Credito Compra
                  ,9  --   Nota de Debito Venta
                  ,10 --   Nota de Debito Compra
          ) THEN

          BEGIN
             IF v_doct_id IN ( 1--   Factura de Venta
             ,7--   Nota de Credito Venta
             ,9 ) THEN--   Nota de Debito Venta

             BEGIN
                SELECT cli_catfiscal
                  INTO v_cli_catfiscal
                  FROM Cliente
                   WHERE cli_id = p_cli_id;

                SELECT CASE v_cli_catfiscal
                    WHEN 1 THEN ta_id_inscripto--'Inscripto'

                    WHEN 2 THEN ta_id_final--'Exento'

                    WHEN 3 THEN ta_id_inscripto--'No inscripto'

                    WHEN 4 THEN ta_id_final--'Consumidor Final'

                    WHEN 5 THEN ta_id_externo--'Extranjero'

                    WHEN 6 THEN ta_id_final--'Mono Tributo'

                    WHEN 7 THEN ta_id_externo--'Extranjero Iva'

                    WHEN 8 THEN ta_id_final--'No responsable'

                    WHEN 9 THEN ta_id_final--'No Responsable exento'

                    WHEN 10 THEN ta_id_final--'No categorizado'

                    WHEN 11 THEN ta_id_inscripto--'Inscripto M'

                    ELSE -1--'Sin categorizar'

                  END
                  INTO v_ta_id
                FROM Documento
                WHERE doc_id = p_doc_id;

             END;
             ELSE
             BEGIN
                SELECT prov_catfiscal
                  INTO v_prov_catfiscal
                FROM Proveedor
                WHERE prov_id = p_prov_id;

                --2,--   Factura de Compra
                --8,--   Nota de Credito Compra
                --10--   Nota de Debito Compra
                SELECT CASE v_prov_catfiscal
                     WHEN 1 THEN ta_id_inscripto--'Inscripto'

                     WHEN 2 THEN ta_id_final--'Exento'

                     WHEN 3 THEN ta_id_final--'No inscripto'

                     WHEN 4 THEN ta_id_final--'Consumidor Final'

                     WHEN 5 THEN ta_id_externo--'Extranjero'

                     WHEN 6 THEN ta_id_final--'Mono Tributo'

                     WHEN 7 THEN ta_id_externo--'Extranjero Iva'

                     WHEN 8 THEN ta_id_final--'No responsable'

                     WHEN 9 THEN ta_id_final--'No Responsable exento'

                     WHEN 10 THEN ta_id_final--'No categorizado'

                     WHEN 11 THEN ta_id_inscriptom--'Inscripto M'

                     ELSE -1--'Sin categorizar'

                  END
                  INTO v_ta_id
                FROM Documento
                WHERE doc_id = p_doc_id;

             END;
             END IF;

          END;
          END IF;

          IF coalesce(v_ta_id, 0) = 0 THEN
              BEGIN
                 p_ta_Mascara := '';

                 p_ta_Propuesto := 0;

                 p_ta_tipo := 0;

                 p_ta_id := NULL;

              END;
          ELSE
              BEGIN
                 SELECT ta_mascara,
                        ta_tipo,
                        ta_tipo
                   INTO p_ta_Mascara,
                        p_ta_Propuesto,
                        p_ta_tipo
                 FROM Talonario
                 WHERE ta_id = v_ta_id;

                 IF coalesce(p_ta_Propuesto, 0) <> 1 THEN
                    p_ta_Propuesto := 0;

                 ELSE
                    p_ta_Propuesto := 1;

                 END IF;

                 p_ta_Mascara := coalesce(p_ta_Mascara, '');

                 p_ta_id := v_ta_id;

              END;
          END IF;

       END;
   END IF;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_talonario_get_propuesto(integer, integer, integer)
  OWNER TO postgres;