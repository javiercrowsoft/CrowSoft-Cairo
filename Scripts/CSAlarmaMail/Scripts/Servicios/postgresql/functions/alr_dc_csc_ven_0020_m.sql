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
-- Function: alr_dc_csc_ven_0020_m()

-- DROP FUNCTION alr_dc_csc_ven_0020_m();

CREATE OR REPLACE FUNCTION alr_dc_csc_ven_0020_m(OUT rtn refcursor)
  RETURNS refcursor AS
$BODY$
DECLARE
   v_alm_id integer;
   v_fecha date;
   -- Obtengo la direccion de email
   --
   v_mail_emailTo varchar(1000);
   v_mail_emailCc varchar(1000);
   v_mail_id integer;
   v_temp numeric(1, 0) := 0;
BEGIN

   rtn := 'rtn';

   v_alm_id := 4;

   v_fecha := dateadd('D', -30, CURRENT_TIMESTAMP);

   SELECT alm_mails
     INTO v_mail_emailTo
     FROM AlarmaMail
      WHERE alm_id = v_alm_id;

   BEGIN
      SELECT 1 INTO v_temp
        FROM DUAL
       WHERE EXISTS ( SELECT *
                      FROM Mail
                         WHERE mail_codigo = v_mail_emailTo );
   EXCEPTION
      WHEN OTHERS THEN
         NULL;
   END;

   IF v_temp = 1 THEN
   BEGIN
      SELECT mail_emailTo,
             mail_emailCc,
             mail_id
        INTO v_mail_emailTo,
             v_mail_emailCc,
             v_mail_id
        FROM Mail
         WHERE mail_codigo = v_mail_emailTo;

   END;
   END IF;

   OPEN rtn FOR
      -- Facturas Vencidas por mas de 30 dias
      --
      SELECT fvd.fvd_id almr_id_mail,
                  v_mail_id mail_id,
                  NULL maili_id,
                  v_mail_emailTo mail_emailTo,
                  v_mail_emailCc mail_emailCc,
                  'Facturas Vencidas por mas de 30 dias' almr_subject,
                  'La factura ' || fv.fv_nrodoc || ' del cliente ' || cli.cli_nombre 
                  || ' de fecha ' || to_char(fv.fv_fecha, 'dd/mm/yyyy') 
                  || ' y vencimiento el ' || to_char(fvd.fvd_fecha, 'dd/mm/yyyy') 
                  || ' ya posee ' 
                  || to_char(date_part('day', CURRENT_TIMESTAMP - fvd.fvd_fecha), '99') 
                  || ' dias de vencida' msg
        FROM ( FacturaVentaDeuda fvd
               JOIN FacturaVenta fv
                ON fvd.fv_id = fv.fv_id
               AND fvd.fvd_fecha < v_fecha
                )
               JOIN Cliente cli
                ON fv.cli_id = cli.cli_id
         WHERE NOT EXISTS ( SELECT *
                            FROM AlarmaMailResult
                               WHERE alm_id = v_alm_id
                                       AND almr_id_mail = fvd.fvd_id );

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION alr_dc_csc_ven_0020_m()
  OWNER TO postgres;
