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
-- Function: sp_doc_cobranza_get_items()

-- drop function sp_doc_cobranza_get_items(integer);
/*
select * from sp_doc_cobranza_get_items(1);
fetch all from rtn;
fetch all from rtn_serie;
*/
create or replace function sp_doc_cobranza_get_items
(
  in p_cobz_id integer,
  in p_tipo integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_CobziTCheques smallint;
   v_CobziTEfectivo smallint;
   v_CobziTTarjeta smallint;
   v_CobziTOtros smallint;
   v_CobziTCtaCte smallint;
begin

   v_CobziTCheques := 1;
   v_CobziTEfectivo := 2;
   v_CobziTTarjeta := 3;
   v_CobziTOtros := 4;
   v_CobziTCtaCte := 5;

   rtn := 'rtn';

   if p_tipo = v_CobziTCheques then

      open rtn for
         select CobranzaItem.*,
                cheq.cheq_numero,
                cheq.cheq_propio,
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
         from CobranzaItem
         join Cheque cheq
           on CobranzaItem.cheq_id = cheq.cheq_id
         left join CentroCosto ccos
           on CobranzaItem.ccos_id = ccos.ccos_id
         left join Banco bco
           on cheq.bco_id = bco.bco_id
         left join Clearing cle
           on cheq.cle_id = cle.cle_id
         left join Cuenta cue
           on CobranzaItem.cue_id = cue.cue_id
         left join Moneda mon
           on cheq.mon_id = mon.mon_id
         where CobranzaItem.cobz_id = p_cobz_id
           and cobzi_tipo = v_CobziTCheques
         order by cobzi_orden;

   else

      if p_tipo = v_CobziTEfectivo then

         open rtn for

            select CobranzaItem.*,
                   ccos.ccos_nombre,
                   cue.cue_nombre,
                   mon.mon_nombre,
                   mon.mon_id
              from CobranzaItem
              join Cuenta cue
                on CobranzaItem.cue_id = cue.cue_id
              join Moneda mon
                on cue.mon_id = mon.mon_id
              left join CentroCosto ccos
                on CobranzaItem.ccos_id = ccos.ccos_id
              where CobranzaItem.cobz_id = p_cobz_id
                and cobzi_tipo = v_CobziTEfectivo
              order by cobzi_orden;

      else

         if p_tipo = v_CobziTTarjeta then

            open rtn for
               select CobranzaItem.*,
                      ccos.ccos_nombre,
                      tjc.tjc_nombre,
                      mon.mon_nombre,
                      tjcc.tjcc_numero,
                      tjcc.tjcc_numerodoc,
                      tjcc.tjcc_descrip,
                      tjcc.tjcc_fechavto,
                      tjcc.tjcc_nroTarjeta,
                      tjcc.tjcc_nroAutorizacion,
                      tjcc.tjcc_titular,
                      tjcc.tjc_id,
                      tjccu.tjccu_id,
                      tjccu.tjccu_cantidad,
                      mon.mon_id,
                      tjc.tjc_id
               from CobranzaItem
               join TarjetaCreditoCupon tjcc
                 on CobranzaItem.tjcc_id = tjcc.tjcc_id
               left join CentroCosto ccos
                 on CobranzaItem.ccos_id = ccos.ccos_id
               left join Moneda mon
                 on tjcc.mon_id = mon.mon_id
               left join TarjetaCredito tjc
                 on tjcc.tjc_id = tjc.tjc_id
               left join TarjetaCreditoCuota tjccu
                 on tjcc.tjccu_id = tjccu.tjccu_id
               where CobranzaItem.cobz_id = p_cobz_id
                 and cobzi_tipo = v_CobziTTarjeta
               order by cobzi_orden;

         else

            if p_tipo = v_CobziTOtros then

               open rtn for
                  select CobranzaItem.*,
                         ccos.ccos_nombre,
                         cue.cue_nombre,
                         ret.ret_nombre,
                         fv.fv_nrodoc
                  from CobranzaItem
                  left join CentroCosto ccos
                         on CobranzaItem.ccos_id = ccos.ccos_id
                  left join Cuenta cue
                         on CobranzaItem.cue_id = cue.cue_id
                  left join Retencion ret
                         on CobranzaItem.ret_id = ret.ret_id
                  left join FacturaVenta fv
                         on CobranzaItem.fv_id_ret = fv.fv_id
                  where CobranzaItem.cobz_id = p_cobz_id
                    and cobzi_tipo = v_CobziTOtros
                  order by cobzi_orden;

            else

               if p_tipo = v_CobziTCtaCte then

                  open rtn for
                     select CobranzaItem.*,
                            ccos.ccos_nombre,
                            cue.cue_nombre
                     from CobranzaItem
                     left join CentroCosto ccos
                            on CobranzaItem.ccos_id = ccos.ccos_id
                     left join Cuenta cue
                            on CobranzaItem.cue_id = cue.cue_id
                     where CobranzaItem.cobz_id = p_cobz_id
                       and cobzi_tipo = v_CobziTCtaCte
                     order by cobzi_orden;

               end if;

            end if;

         end if;

      end if;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_cobranza_get_items(integer, integer)
  owner to postgres;