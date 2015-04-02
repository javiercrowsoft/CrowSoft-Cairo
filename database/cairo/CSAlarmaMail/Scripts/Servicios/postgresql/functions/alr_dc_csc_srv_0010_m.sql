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
MERCHANTABILITY or FITNESS for A PARTICULAR PURPOSE.  See the
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

-- drop function alr_dc_csc_srv_0010_m();

create or replace function alr_dc_csc_srv_0010_m(out rtn refcursor)
  returns refcursor as
$BODY$
declare
   v_alm_id integer;
   v_fecha date;
   v_offset_inicio integer;
   v_offset_alarma1 integer;
   v_offset_alarma2 integer;
   v_offset_finalizado integer;
   v_offset_vencido integer;
begin
   rtn := 'rtn';

   v_alm_id := 2;

   v_offset_inicio := 1000000;

   v_offset_alarma1 := 2000000;

   v_offset_alarma2 := 3000000;

   v_offset_finalizado := 4000000;

   v_offset_vencido := 5000000;

   v_fecha := dateadd('N', -5, now());

   open rtn for
      -- //////////////////////////////////////////////////////////////////////////////////////
      --
      -- Inicio
      --
      -- //////////////////////////////////////////////////////////////////////////////////////
      select v_offset_inicio + tar.tar_id almr_id_mail,
                 M.mail_id,
                 null maili_id,
                 mail_emailTo almr_emailto,
                 mail_emailCc almr_emailcc,
                 'Aviso de Inicio de tarea ' || tar_nombre almr_subject,
                 tar_nombre || CHR(13) || tar_descrip msg
        from Tarea tar
               join AlarmaItem ali
                on tar.ali_id = ali.ali_id
               join Mail M
                on ali.mail_id_inicio = M.mail_id
         where os_id is not null
                 and tar_fechahoraini >= v_fecha
                 and not exists ( select *
                                  from AlarmaMailResult
                                     where alm_id = v_alm_id
                                             and almr_id_mail = v_offset_inicio + tar_id )
      -- //////////////////////////////////////////////////////////////////////////////////////
      --
      -- Alarma 1
      --
      -- //////////////////////////////////////////////////////////////////////////////////////
      union all
      select v_offset_alarma1 + tar.tar_id almr_id_mail,
                 M.mail_id,
                 null maili_id,
                 mail_emailTo almr_emailto,
                 mail_emailCc almr_emailcc,
                 'Aviso de Inicio de tarea ' || tar_nombre almr_subject,
                 tar_nombre || CHR(13) || tar_descrip msg
        from Tarea tar
               join AlarmaItem ali
                on tar.ali_id = ali.ali_id
               join Mail M
                on ali.mail_id_alarma1 = M.mail_id
         where os_id is not null
                 and tar_estado1 >= v_fecha
                 and not exists ( select *
                                  from AlarmaMailResult
                                     where alm_id = v_alm_id
                                             and almr_id_mail = v_offset_alarma1 + tar_id )
      -- //////////////////////////////////////////////////////////////////////////////////////
      --
      -- Alarma 2
      --
      -- //////////////////////////////////////////////////////////////////////////////////////
      union all
      select v_offset_alarma2 + tar.tar_id almr_id_mail,
                 M.mail_id,
                 null maili_id,
                 mail_emailTo almr_emailto,
                 mail_emailCc almr_emailcc,
                 'Aviso de Inicio de tarea ' || tar_nombre almr_subject,
                 tar_nombre || CHR(13) || tar_descrip msg
        from Tarea tar
               join AlarmaItem ali
                on tar.ali_id = ali.ali_id
               join Mail M
                on ali.mail_id_alarma2 = M.mail_id
         where os_id is not null
                 and tar_estado2 >= v_fecha
                 and not exists ( select *
                                  from AlarmaMailResult
                                     where alm_id = v_alm_id
                                             and almr_id_mail = v_offset_alarma2 + tar_id )
      -- //////////////////////////////////////////////////////////////////////////////////////
      --
      -- Finalizado
      --
      -- //////////////////////////////////////////////////////////////////////////////////////
      union all
      select v_offset_finalizado + tar.tar_id almr_id_mail,
                 M.mail_id,
                 null maili_id,
                 mail_emailTo almr_emailto,
                 mail_emailCc almr_emailcc,
                 'Aviso de Inicio de tarea ' || tar_nombre almr_subject,
                 tar_nombre || CHR(13) || tar_descrip msg
        from Tarea tar
               join AlarmaItem ali
                on tar.ali_id = ali.ali_id
               join Mail M
                on ali.mail_id_finalizado = M.mail_id
         where os_id is not null
                 and tar_fechahorafin >= v_fecha
                 and not exists ( select *
                                  from AlarmaMailResult
                                     where alm_id = v_alm_id
                                             and almr_id_mail = v_offset_finalizado + tar_id )
      -- //////////////////////////////////////////////////////////////////////////////////////
      --
      -- Vencido
      --
      -- //////////////////////////////////////////////////////////////////////////////////////
      union all
      select v_offset_vencido + tar.tar_id almr_id_mail,
             M.mail_id,
             null maili_id,
             mail_emailTo almr_emailto,
             mail_emailCc almr_emailcc,
             'Aviso de Inicio de tarea ' || tar_nombre almr_subject,
             tar_nombre || CHR(13) || tar_descrip msg
        from Tarea tar
               join AlarmaItem ali
                on tar.ali_id = ali.ali_id
               join Mail M
                on ali.mail_id_vencido = M.mail_id
         where os_id is not null
                 and tar_fechahorafin >= v_fecha
                 and tar_finalizada = 0
                 and not exists ( select *
                                  from AlarmaMailResult
                                     where alm_id = v_alm_id
                                             and almr_id_mail = v_offset_vencido + tar_id );

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function alr_dc_csc_srv_0010_m()
  owner to postgres;
