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
-- Function: alr_dc_csc_ven_0010_m()

-- drop function alr_dc_csc_ven_0010_m();

create or replace function alr_dc_csc_ven_0010_m(out rtn refcursor)
  returns refcursor as
$BODY$
declare
   v_alm_id integer;
   v_fecha date;
   -- Obtengo la direccion de email
   --
   v_mail_emailTo varchar(1000);
   v_mail_emailCc varchar(1000);
   v_mail_id integer;
   v_temp numeric(1, 0) := 0;
begin

   rtn := 'rtn';

   v_alm_id := 1;

   v_fecha := dateadd('D', -30, CURRENT_TIMESTAMP);

   select alm_mails
     into v_mail_emailTo
     from AlarmaMail
      where alm_id = v_alm_id;

   begin
      select 1 into v_temp
        from DUAL
       where exists ( select *
                      from Mail
                         where mail_codigo = v_mail_emailTo );
   exception
      when others then
         null;
   end;

   if v_temp = 1 then
   begin
      select mail_emailTo,
             mail_emailCc,
             mail_id
        into v_mail_emailTo,
             v_mail_emailCc,
             v_mail_id
        from Mail
         where mail_codigo = v_mail_emailTo;

   end;
   end if;

   open rtn for
      -- Facturas Vencidas por mas de 30 dias
      --
      select fvd.fvd_id almr_id_mail,
                  v_mail_id mail_id,
                  null maili_id,
                  v_mail_emailTo mail_emailTo,
                  v_mail_emailCc mail_emailCc,
                  'Facturas Vencidas por mas de 30 dias' almr_subject,
                  'La factura ' || fv.fv_nrodoc || ' del cliente ' || cli.cli_nombre 
                  || ' de fecha ' || to_char(fv.fv_fecha, 'dd/mm/yyyy') 
                  || ' y vencimiento el ' || to_char(fvd.fvd_fecha, 'dd/mm/yyyy') 
                  || ' ya posee ' 
                  || to_char(date_part('day', CURRENT_TIMESTAMP - fvd.fvd_fecha), '99')
                  || ' dias de vencida' msg
        from (FacturaVentaDeuda fvd
               join FacturaVenta fv
                on fvd.fv_id = fv.fv_id
               and fvd.fvd_fecha < v_fecha
              )
               join Cliente cli
                on fv.cli_id = cli.cli_id
         where not exists ( select *
                            from AlarmaMailResult
                               where alm_id = v_alm_id
                                       and almr_id_mail = fvd.fvd_id );

end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function alr_dc_csc_ven_0010_m()
  owner to postgres;
