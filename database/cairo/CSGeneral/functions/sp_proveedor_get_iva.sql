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
-- Function: sp_proveedor_get_iva()

-- DROP FUNCTION sp_proveedor_get_iva(integer, smallint);

CREATE OR REPLACE FUNCTION sp_proveedor_get_iva
(
  IN p_prov_id integer,
  OUT p_bIvari smallint,
  OUT p_bIvarni smallint,
  IN p_bSelect smallint DEFAULT 1
)
  RETURNS record AS
$BODY$
DECLARE
   v_tipoIva smallint;
   v_bIva smallint;
   v_bIvaRni smallint;
   v_bSinIva smallint;
BEGIN

   IF p_bSelect <> 0 THEN
      RAISE EXCEPTION '@@ERROR_SP:El procedimiento almacenado SP_DBGetNewId no puede ser llamado para obtener un cursor. El codigo Java o Scala debe usar parametros OUT.';
	  RETURN;
   END IF;

   v_bIva := -1;
   v_bIvaRni := -2;
   v_bSinIva := -3;

   SELECT CASE prov_catfiscal
             WHEN 1 THEN v_bIva      --'Inscripto'
             WHEN 2 THEN v_bSinIva   --'Exento'
             WHEN 3 THEN v_bSinIva   --'No inscripto'
             WHEN 4 THEN v_bIva      --'Consumidor Final'
             WHEN 5 THEN v_bSinIva   --'Extranjero'
             WHEN 6 THEN v_bSinIva   --'Mono Tributo'
             WHEN 7 THEN v_bIva      --'Extranjero Iva'
             WHEN 8 THEN v_bIva      --'No responsable'
             WHEN 9 THEN v_bIva      --'No Responsable exento'
             WHEN 10 THEN v_bIvaRni  --'No categorizado'
             WHEN 11 THEN v_bIva     --'Inscripto M'
             ELSE 0                  --'Sin categorizar'
          END
     INTO v_tipoIva
   FROM Proveedor
   WHERE prov_id = p_prov_id;

   v_tipoIva := coalesce(v_tipoIva, v_bSinIva);

   IF v_tipoIva = v_bIva THEN
   BEGIN
      v_bIva := 1;
      v_bIvaRni := 0;
   END;
   ELSE
   BEGIN
      IF v_tipoIva = v_bIvaRni THEN
      BEGIN
         v_bIva := 1;
         v_bIvaRni := 1;
      END;
      ELSE
      BEGIN
         IF v_tipoIva = v_bSinIva THEN
         BEGIN
            v_bIva := 0;
            v_bIvaRni := 0;
         END;
         END IF;

      END;
      END IF;

   END;
   END IF;

   p_bIvaRi := v_bIva;
   p_bIvaRni := v_bIvaRni;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_proveedor_get_iva(integer, smallint)
  OWNER TO postgres;