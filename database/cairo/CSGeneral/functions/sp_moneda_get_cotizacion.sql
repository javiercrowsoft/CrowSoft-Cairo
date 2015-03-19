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
-- Function: sp_moneda_get_cotizacion()

-- DROP FUNCTION sp_moneda_get_cotizacion(integer, date, smallint);
-- select * from monedaitem
-- select sp_moneda_get_cotizacion(3,'20041231', 0::smallint);
CREATE OR REPLACE FUNCTION sp_moneda_get_cotizacion
(
  IN p_mon_id integer,
  IN p_fecha date,
  IN p_bselect smallint,
  OUT p_cotiz decimal(18,6)
)
  RETURNS decimal AS
$BODY$
BEGIN

     IF p_bselect <> 0 THEN
       RAISE EXCEPTION '@@ERROR_SP:El procedimiento almacenado sp_moneda_get_cotizacion no puede ser llamado para obtener un cursor. El codigo Java o Scala debe usar parametros OUT.';
       RETURN;
     END IF;

   DECLARE
      v_cfg_valor varchar(5000);
   BEGIN

      IF NOT EXISTS ( SELECT mon_id
                      FROM Moneda
                      WHERE mon_id = p_mon_id
                        AND mon_legal <> 0 ) THEN

         select sp_Cfg_GetValor('General',
                        'Decimales Cotización',
                        0::smallint, null) into v_cfg_valor;

         v_cfg_valor := coalesce(v_cfg_valor, '3');

         IF isnumeric(v_cfg_valor) = 0 THEN
            v_cfg_valor := '3';
         END IF;

         SELECT *
           INTO p_cotiz
         FROM ( SELECT moni_precio
                FROM MonedaItem
                WHERE mon_id = p_mon_id
                  AND moni_fecha <= p_fecha
                ORDER BY moni_fecha DESC ) t
         LIMIT 1;

      END IF;

      p_cotiz := coalesce(p_cotiz, 0);
   END;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_moneda_get_cotizacion(integer, date, smallint)
  OWNER TO postgres;