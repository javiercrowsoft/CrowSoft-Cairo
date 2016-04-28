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
-- Function: sp_doc_orden_pago_get_items()

-- drop function sp_doc_orden_pago_get_items(integer, integer);
/*
select * from sp_doc_orden_pago_get_items(1);
fetch all from rtn;
fetch all from rtn_serie;
*/
create or replace function sp_doc_orden_pago_get_items
(
  in p_opg_id integer,
  in p_tipo integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_OpgiTCheques smallint;
   v_OpgiTEfectivo smallint;
   v_OpgiTOtros smallint;
   v_OpgiTCtaCte smallint;
   v_OpgiTChequesT smallint;
begin

   v_OpgiTCheques := 1;
   v_OpgiTEfectivo := 2;
   v_OpgiTOtros := 4;
   v_OpgiTCtaCte := 5;
   v_OpgiTChequesT := 6;

   rtn := 'rtn';

   if p_tipo = v_OpgiTCheques then

      open rtn for
         select OrdenPagoItem.*,
                chq.chq_codigo,
                cheq.cheq_numero,
                ccos.ccos_nombre,
                cue.cue_nombre,
                bco.bco_nombre,
                cle.cle_nombre,
                mon.mon_nombre,
                mon.mon_id,
                cheq.cheq_numerodoc,
                bco.bco_id,
                cle.cle_id,
                cheq.cheq_fechavto,
                cheq.cheq_fechacobro
         from OrdenPagoItem
         join Cheque cheq
          on OrdenPagoItem.cheq_id = cheq.cheq_id
         -- Este Inner join filtra a los cheques de tercero ya que estos no tienen
         -- chequera
         --
         join Chequera chq
          on OrdenPagoItem.chq_id = chq.chq_id
         left join CentroCosto ccos
          on OrdenPagoItem.ccos_id = ccos.ccos_id
         left join Banco bco
          on cheq.bco_id = bco.bco_id
         left join Clearing cle
          on cheq.cle_id = cle.cle_id
         left join Cuenta cue
          on OrdenPagoItem.cue_id = cue.cue_id
         left join Moneda mon
          on cheq.mon_id = mon.mon_id

         where OrdenPagoItem.opg_id = p_opg_id
           and opgi_tipo = v_OpgiTCheques

         order by opgi_orden;

   else

      if p_tipo = v_OpgiTEfectivo then

         open rtn for
            select OrdenPagoItem.*,
                   ccos.ccos_nombre,
                   cue.cue_nombre,
                   mon.mon_nombre,
                   mon.mon_id
            from OrdenPagoItem
            join Cuenta cue
             on OrdenPagoItem.cue_id = cue.cue_id
            join Moneda mon
             on cue.mon_id = mon.mon_id
            left join CentroCosto ccos
             on OrdenPagoItem.ccos_id = ccos.ccos_id

            where OrdenPagoItem.opg_id = p_opg_id
              and opgi_tipo = v_OpgiTEfectivo

            order by opgi_orden;

      else

         if p_tipo = v_OpgiTOtros then

            open rtn for
               select OrdenPagoItem.*,
                      ccos.ccos_nombre,
                      cue.cue_nombre,
                      ret.ret_nombre,
                      fc.fc_nrodoc,
                      mon.mon_nombre,
                      mon.mon_id
               from OrdenPagoItem
               left join CentroCosto ccos
                on OrdenPagoItem.ccos_id = ccos.ccos_id
               left join Cuenta cue
                on OrdenPagoItem.cue_id = cue.cue_id
               left join Moneda mon
                on cue.mon_id = mon.mon_id
               left join Retencion ret
                on OrdenPagoItem.ret_id = ret.ret_id
               left join FacturaCompra fc
                on OrdenPagoItem.fc_id_ret = fc.fc_id

               where OrdenPagoItem.opg_id = p_opg_id
                 and opgi_tipo = v_OpgiTOtros

               order by opgi_orden;

         else

            if p_tipo = v_OpgiTCtaCte then

               open rtn for
                  select OrdenPagoItem.*,
                         ccos.ccos_nombre,
                         cue.cue_nombre,
                         mon.mon_nombre,
                         mon.mon_id
                  from OrdenPagoItem
                  left join CentroCosto ccos
                   on OrdenPagoItem.ccos_id = ccos.ccos_id
                  left join Cuenta cue
                   on OrdenPagoItem.cue_id = cue.cue_id
                  left join Moneda mon
                   on cue.mon_id = mon.mon_id

                  where OrdenPagoItem.opg_id = p_opg_id
                    and opgi_tipo = v_OpgiTCtaCte

                  order by opgi_orden;

            else

               if p_tipo = v_OpgiTChequesT then

                  open rtn for
                     select OrdenPagoItem.*,
                            cheq.cheq_numero,
                            ccos.ccos_nombre,
                            cue.cue_nombre,
                            cheq.bco_id,
                            cheq.cle_id,
                            cheq.cli_id,                            
                            bco.bco_nombre,
                            cle.cle_nombre,
                            cli.cli_nombre,
                            mon.mon_nombre,
                            mon.mon_id,
                            cheq.cheq_numerodoc,
                            cheq.cheq_fechavto,
                            cheq.cheq_fechacobro
                     from OrdenPagoItem
                     join Cheque cheq
                      on OrdenPagoItem.cheq_id = cheq.cheq_id
                     left join Cliente cli
                      on cheq.cli_id = cli.cli_id
                     left join CentroCosto ccos
                      on OrdenPagoItem.ccos_id = ccos.ccos_id
                     left join Banco bco
                      on cheq.bco_id = bco.bco_id
                     left join Clearing cle
                      on cheq.cle_id = cle.cle_id
                     left join Cuenta cue
                      on OrdenPagoItem.cue_id = cue.cue_id
                     left join Moneda mon
                      on cheq.mon_id = mon.mon_id

                     where OrdenPagoItem.opg_id = p_opg_id
                       and opgi_tipo = v_OpgiTChequesT
                     order by opgi_orden;

               end if;

            end if;

         end if;

      end if;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_orden_pago_get_items(integer, integer)
  owner to postgres;