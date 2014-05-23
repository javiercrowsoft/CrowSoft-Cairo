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
-- Function: alr_dc_csc_srv_0010_m()

-- DROP FUNCTION alr_dc_csc_srv_0010_m();

CREATE OR REPLACE FUNCTION alr_dc_csc_srv_0010_m(OUT rtn refcursor)
  RETURNS refcursor AS
$BODY$
DECLARE
   v_alm_id integer;
   v_fecha date;
   v_offset_inicio integer;
   v_offset_alarma1 integer;
   v_offset_alarma2 integer;
   v_offset_finalizado integer;
   v_offset_vencido integer;
BEGIN
   rtn := 'rtn';

   v_alm_id := 2;

   v_offset_inicio := 1000000;

   v_offset_alarma1 := 2000000;

   v_offset_alarma2 := 3000000;

   v_offset_finalizado := 4000000;

   v_offset_vencido := 5000000;

   v_fecha := dateadd('N', -5, now());

   OPEN rtn FOR
      -- //////////////////////////////////////////////////////////////////////////////////////
      --
      -- Inicio
      --
      -- //////////////////////////////////////////////////////////////////////////////////////
      SELECT v_offset_inicio + tar.tar_id almr_id_mail,
                 M.mail_id,
                 NULL maili_id,
                 mail_emailTo almr_emailto,
                 mail_emailCc almr_emailcc,
                 'Aviso de Inicio de tarea ' || tar_nombre almr_subject,
                 tar_nombre || CHR(13) || tar_descrip msg
        FROM Tarea tar
               JOIN AlarmaItem ali
                ON tar.ali_id = ali.ali_id
               JOIN Mail M
                ON ali.mail_id_inicio = M.mail_id
         WHERE os_id IS NOT NULL
                 AND tar_fechahoraini >= v_fecha
                 AND NOT EXISTS ( SELECT *
                                  FROM AlarmaMailResult
                                     WHERE alm_id = v_alm_id
                                             AND almr_id_mail = v_offset_inicio + tar_id )
      -- //////////////////////////////////////////////////////////////////////////////////////
      --
      -- Alarma 1
      --
      -- //////////////////////////////////////////////////////////////////////////////////////
      UNION ALL
      SELECT v_offset_alarma1 + tar.tar_id almr_id_mail,
                 M.mail_id,
                 NULL maili_id,
                 mail_emailTo almr_emailto,
                 mail_emailCc almr_emailcc,
                 'Aviso de Inicio de tarea ' || tar_nombre almr_subject,
                 tar_nombre || CHR(13) || tar_descrip msg
        FROM Tarea tar
               JOIN AlarmaItem ali
                ON tar.ali_id = ali.ali_id
               JOIN Mail M
                ON ali.mail_id_alarma1 = M.mail_id
         WHERE os_id IS NOT NULL
                 AND tar_estado1 >= v_fecha
                 AND NOT EXISTS ( SELECT *
                                  FROM AlarmaMailResult
                                     WHERE alm_id = v_alm_id
                                             AND almr_id_mail = v_offset_alarma1 + tar_id )
      -- //////////////////////////////////////////////////////////////////////////////////////
      --
      -- Alarma 2
      --
      -- //////////////////////////////////////////////////////////////////////////////////////
      UNION ALL
      SELECT v_offset_alarma2 + tar.tar_id almr_id_mail,
                 M.mail_id,
                 NULL maili_id,
                 mail_emailTo almr_emailto,
                 mail_emailCc almr_emailcc,
                 'Aviso de Inicio de tarea ' || tar_nombre almr_subject,
                 tar_nombre || CHR(13) || tar_descrip msg
        FROM Tarea tar
               JOIN AlarmaItem ali
                ON tar.ali_id = ali.ali_id
               JOIN Mail M
                ON ali.mail_id_alarma2 = M.mail_id
         WHERE os_id IS NOT NULL
                 AND tar_estado2 >= v_fecha
                 AND NOT EXISTS ( SELECT *
                                  FROM AlarmaMailResult
                                     WHERE alm_id = v_alm_id
                                             AND almr_id_mail = v_offset_alarma2 + tar_id )
      -- //////////////////////////////////////////////////////////////////////////////////////
      --
      -- Finalizado
      --
      -- //////////////////////////////////////////////////////////////////////////////////////
      UNION ALL
      SELECT v_offset_finalizado + tar.tar_id almr_id_mail,
                 M.mail_id,
                 NULL maili_id,
                 mail_emailTo almr_emailto,
                 mail_emailCc almr_emailcc,
                 'Aviso de Inicio de tarea ' || tar_nombre almr_subject,
                 tar_nombre || CHR(13) || tar_descrip msg
        FROM Tarea tar
               JOIN AlarmaItem ali
                ON tar.ali_id = ali.ali_id
               JOIN Mail M
                ON ali.mail_id_finalizado = M.mail_id
         WHERE os_id IS NOT NULL
                 AND tar_fechahorafin >= v_fecha
                 AND NOT EXISTS ( SELECT *
                                  FROM AlarmaMailResult
                                     WHERE alm_id = v_alm_id
                                             AND almr_id_mail = v_offset_finalizado + tar_id )
      -- //////////////////////////////////////////////////////////////////////////////////////
      --
      -- Vencido
      --
      -- //////////////////////////////////////////////////////////////////////////////////////
      UNION ALL
      SELECT v_offset_vencido + tar.tar_id almr_id_mail,
             M.mail_id,
             NULL maili_id,
             mail_emailTo almr_emailto,
             mail_emailCc almr_emailcc,
             'Aviso de Inicio de tarea ' || tar_nombre almr_subject,
             tar_nombre || CHR(13) || tar_descrip msg
        FROM Tarea tar
               JOIN AlarmaItem ali
                ON tar.ali_id = ali.ali_id
               JOIN Mail M
                ON ali.mail_id_vencido = M.mail_id
         WHERE os_id IS NOT NULL
                 AND tar_fechahorafin >= v_fecha
                 AND tar_finalizada = 0
                 AND NOT EXISTS ( SELECT *
                                  FROM AlarmaMailResult
                                     WHERE alm_id = v_alm_id
                                             AND almr_id_mail = v_offset_vencido + tar_id );

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION alr_dc_csc_srv_0010_m()
  OWNER TO postgres;
