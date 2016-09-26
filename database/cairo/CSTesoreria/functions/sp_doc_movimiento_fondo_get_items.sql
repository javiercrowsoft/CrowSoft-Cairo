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
-- Function: sp_doc_movimiento_fondo_get_items()

-- drop function sp_doc_movimiento_fondo_get_items(integer, integer);
/*
select * from sp_doc_movimiento_fondo_get_items(1);
fetch all from rtn;
*/
create or replace function sp_doc_movimiento_fondo_get_items
(
  in p_mf_id integer,
  in p_tipo integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_MfiTCheques smallint;
   v_MfiTEfectivo smallint;
   v_MfiTChequesT smallint;
   v_MfiTChequesI smallint;
begin

   v_MfiTCheques := 1;
   v_MfiTEfectivo := 2;
   v_MfiTChequesT := 6;
   v_MfiTChequesI := 7;

   rtn := 'rtn';

   if p_tipo = v_MfiTEfectivo then

      open rtn for
         select MovimientoFondoItem.*,
                cdebe.cue_nombre cue_debe_name,
                chaber.cue_nombre cue_haber_name,
                ccos.ccos_nombre,
                mon.mon_nombre,
                mon.mon_id
         from MovimientoFondoItem
         join Cuenta cdebe
          on MovimientoFondoItem.cue_id_debe = cdebe.cue_id
         join Cuenta chaber
          on MovimientoFondoItem.cue_id_haber = chaber.cue_id
         left join CentroCosto ccos
          on MovimientoFondoItem.ccos_id = ccos.ccos_id
         left join Moneda mon
          on cdebe.mon_id = mon.mon_id
         where mf_id = p_mf_id
           and mfi_tipo = v_MfiTEfectivo
         order by mfi_orden;

   else

      if p_tipo = v_mfiTCheques then

         open rtn for

            select MovimientoFondoItem.*,
                   cdebe.cue_nombre cue_debe_name,
                   chaber.cue_nombre cue_haber_name,
                   chq.chq_codigo,
                   cheq.cheq_numero,
                   ccos.ccos_nombre,
                   cheq.bco_id,
                   bco.bco_nombre,
                   cle.cle_nombre,
                   mon.mon_nombre,
                   mon.mon_id,
                   cheq.cheq_numerodoc,
                   bco.bco_id,
                   cle.cle_id,
                   cheq.cheq_fechavto,
                   cheq.cheq_fechacobro
            from MovimientoFondoItem
            join Cheque cheq
             on MovimientoFondoItem.cheq_id = cheq.cheq_id
            join Cuenta cdebe
             on MovimientoFondoItem.cue_id_debe = cdebe.cue_id
            join Cuenta chaber
             on MovimientoFondoItem.cue_id_haber = chaber.cue_id

            -- este Inner join filtra a los cheques de tercero ya que estos no tienen
            -- chequera
            --
            join Chequera chq
             on MovimientoFondoItem.chq_id = chq.chq_id
            left join CentroCosto ccos
             on MovimientoFondoItem.ccos_id = ccos.ccos_id
            left join Banco bco
             on cheq.bco_id = bco.bco_id
            left join Clearing cle
             on cheq.cle_id = cle.cle_id
            left join Moneda mon
             on cheq.mon_id = mon.mon_id
            where MovimientoFondoItem.mf_id = p_mf_id
              and mfi_tipo = v_mfiTCheques
            order by mfi_orden;

      else

         if p_tipo = v_mfiTChequesT then

            open rtn for
               select MovimientoFondoItem.*,
                    cdebe.cue_nombre cue_debe_name,
                    chaber.cue_nombre cue_haber_name,
                    cheq.cheq_numero,
                    ccos.ccos_nombre,
                    cheq.bco_id,
                    bco.bco_nombre,
                    cle.cle_nombre,
                    cheq.cli_id,
                    cli.cli_nombre,
                    mon.mon_nombre,
                    mon.mon_id,
                    cheq.cheq_numerodoc,
                    cheq.cheq_fechavto,
                    cheq.cheq_fechacobro
               from MovimientoFondoItem
               join Cheque cheq
                on MovimientoFondoItem.cheq_id = cheq.cheq_id
               join Cuenta cdebe
                on MovimientoFondoItem.cue_id_debe = cdebe.cue_id
               join Cuenta chaber
                on MovimientoFondoItem.cue_id_haber = chaber.cue_id
               left join Cliente cli
                on cheq.cli_id = cli.cli_id
               left join CentroCosto ccos
                on MovimientoFondoItem.ccos_id = ccos.ccos_id
               left join Banco bco
                on cheq.bco_id = bco.bco_id
               left join Clearing cle
                on cheq.cle_id = cle.cle_id
               left join Moneda mon
                on cheq.mon_id = mon.mon_id
               where MovimientoFondoItem.mf_id = p_mf_id
                 and mfi_tipo = v_mfiTChequesT
               order by mfi_orden;

         else

            if p_tipo = v_mfiTChequesI then

               open rtn for
                  select MovimientoFondoItem.*,
                         cdebe.cue_nombre cue_debe_name,
                         chaber.cue_nombre cue_haber_name,
                         cheq.cheq_numero,
                         ccos.ccos_nombre,
                         cheq.bco_id,
                         bco.bco_nombre,
                         cheq.cle_id,
                         cle.cle_nombre,
                         cheq.cli_id,
                         cli.cli_nombre,
                         mon.mon_nombre,
                         mon.mon_id,
                         cheq.cheq_numerodoc,
                         cheq.cheq_fechavto,
                         cheq.cheq_fechacobro
                  from MovimientoFondoItem
                  join Cheque cheq
                   on MovimientoFondoItem.cheq_id = cheq.cheq_id
                  join Cuenta cdebe
                   on MovimientoFondoItem.cue_id_debe = cdebe.cue_id
                  join Cuenta chaber
                   on MovimientoFondoItem.cue_id_haber = chaber.cue_id
                  left join CentroCosto ccos
                   on MovimientoFondoItem.ccos_id = ccos.ccos_id
                  left join Banco bco
                   on cheq.bco_id = bco.bco_id
                  left join Clearing cle
                   on cheq.cle_id = cle.cle_id
                  left join Moneda mon
                   on cheq.mon_id = mon.mon_id
                  left join Cliente cli
                   on cheq.cli_id = cli.cli_id
                  where MovimientoFondoItem.mf_id = p_mf_id
                    and mfi_tipo = v_mfiTChequesI
                  order by mfi_orden;

            end if;

         end if;

      end if;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_movimiento_fondo_get_items(integer, integer)
  owner to postgres;
