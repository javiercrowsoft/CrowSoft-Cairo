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
-- Function: sp_doc_movimiento_fondo_item_can_delete()

-- drop function sp_doc_movimiento_fondo_item_can_delete(integer, integer, integer);

create or replace function sp_doc_movimiento_fondo_item_can_delete
(
  in p_mf_id integer,
  in p_mfTMP_id integer,
  in p_bIsDelete integer,
  out p_Message varchar,
  out p_bChequeUsado integer,
  out p_bCanDelete integer
)
  returns record as
$BODY$
declare
   v_cheque varchar(5000);
   v_cheques varchar(8000);
begin

   v_cheques := '';

   -- controlo que ningun cheque mencionado en
   -- este movimiento de fondos este utilizado
   -- por otro movimiento de fondos o por una
   -- orden de pago ya que si es asi, no puedo
   -- vincular asociar este cheque con la cuenta
   -- mencionada en la cobranza, sino que debo:
   --
   --  1-  dar un error si esta usado en una orden de pago
   --      o un deposito bancario,
   --  2-  dar un error si esta usado en un movimiento
   --      de fondo posterior
   --  3-  asociarlo al movimiento de fondos inmediato anterior
   --      al movimiento que estoy borrando
   --------------------------------------------------------------------------------------------
   --
   --  1-  dar un error si esta usado en una orden de pago
   --      o un deposito bancario,
   --
   if exists ( select cheq.cheq_id
               from Cheque cheq
               join MovimientoFondoItem mfi
                 on cheq.cheq_id = mfi.cheq_id
               where mfi.mf_id = p_mf_id
                 and cheq.opg_id is not null
                 and ( p_bIsDelete <> 0
                       or exists ( select mfi_id
                                   from MovimientoFondoItemBorradoTMP
                                   where mf_id = p_mf_id
                                     and mfTMP_id = p_mfTMP_id
                                     and mfi_id = mfi.mfi_id ) ) ) then

      for v_cheque in
         select 'Cheque: '
                || trim(to_char(cheq.cheq_numero))
                || ' - '
                || cheq.cheq_numerodoc
                || ' - '
                || 'OP: ' || emp.emp_nombre
                || ' - '
                || doc.doc_nombre
                || ' - '
                || trim(to_char(opg.opg_numero))
                || ' - '
                || opg.opg_nrodoc
                || ' - '
                || to_char(opg.opg_fecha, 'dd-mm-yyyy')
                || ' - ' || prov.prov_nombre
         from Cheque cheq
         join MovimientoFondoItem mfi
           on cheq.cheq_id = mfi.cheq_id
         join OrdenPago opg
           on cheq.opg_id = opg.opg_id
         join Documento doc
           on opg.doc_id = doc.doc_id
         join Proveedor prov
           on opg.prov_id = prov.prov_id
         join Empresa emp
           on doc.emp_id = emp.emp_id
         where mfi.mf_id = p_mf_id
           and cheq.opg_id is not null
           and ( p_bIsDelete <> 0
                 or exists ( select mfi_id
                             from MovimientoFondoItemBorradoTMP
                             where mf_id = p_mf_id
                               and mfTMP_id = p_mfTMP_id
                               and mfi_id = mfi.mfi_id ) )
      loop

            v_cheques := v_cheques || v_cheque;

      end loop;

      p_bCanDelete := 0;
      p_Message := '@@ERROR_SP:Existe uno o mas cheques en este movimiento de fondos que han sido utilizados en una orden de pago.;' || v_cheques;
      return;

   end if;

   -- busco cheques de tercero que menciona este movimiento de fondo
   -- y han sido depositados
   --
   -- cheque depositado
   --
   if exists ( select cheq.cheq_id
               from Cheque cheq
               join MovimientoFondoItem mfi
                 on cheq.cheq_id = mfi.cheq_id
               join DepositoBancoItem dbcoi
                 on cheq.cheq_id = dbcoi.cheq_id
               join DepositoBanco dbco
                 on dbcoi.dbco_id = dbco.dbco_id
               where mfi.mf_id = p_mf_id
                 and dbco.est_id <> 7 /*Anulado*/
                 and ( p_bIsDelete <> 0
                       or exists ( select mfi_id
                                   from MovimientoFondoItemBorradoTMP
                                   where mf_id = p_mf_id
                                     and mfTMP_id = p_mfTMP_id
                                     and mfi_id = mfi.mfi_id ) ) ) then

      for v_cheque in
         select 'Cheque: '
                || trim(to_char(cheq.cheq_numero))
                || ' - '
                || cheq.cheq_numerodoc
                || ' - '
                || 'DB: '
                || emp.emp_nombre
                || ' - '
                || doc.doc_nombre
                || ' - '
                || trim(to_char(dbco.dbco_numero))
                || ' - '
                || dbco.dbco_nrodoc
                || ' - '
                || to_char(dbco.dbco_fecha, 'dd-mm-yyyy')
                || ' - '
                || bco.bco_nombre
         from Cheque cheq
         join MovimientoFondoItem mfi
           on cheq.cheq_id = mfi.cheq_id
         join DepositoBancoItem dbcoi
           on cheq.cheq_id = dbcoi.cheq_id
         join DepositoBanco dbco
           on dbcoi.dbco_id = dbco.dbco_id
         join Documento doc
           on dbco.doc_id = doc.doc_id
         join Banco bco
           on dbco.bco_id = bco.bco_id
         join Empresa emp
           on doc.emp_id = emp.emp_id
         where mfi.mf_id = p_mf_id
           and dbco.est_id <> 7
           and ( p_bIsDelete <> 0
                 or exists ( select mfi_id
                             from MovimientoFondoItemBorradoTMP
                             where mf_id = p_mf_id
                               and mfTMP_id = p_mfTMP_id
                               and mfi_id = mfi.mfi_id ) )
      loop

         v_cheques := v_cheques || v_cheque;

      end loop;

      p_bCanDelete := 0;
      p_Message := '@@ERROR_SP:Existe uno o mas cheques en este movimiento de fondos que han sido depoistados.;' || v_cheques;

   end if;

   --------------------------------------------------------------------------------------------
   --
   --  2-  dar un error si esta usado en un movimiento
   --      de fondo posterior
   --
   if exists ( select cheq.cheq_id
               from Cheque cheq
               join MovimientoFondoItem mfi
                 on cheq.cheq_id = mfi.cheq_id
                 and mfi.mf_id = p_mf_id
               where coalesce(cheq.mf_id, 0) > p_mf_id
                 and ( p_bIsDelete <> 0
                       or exists ( select mfi_id
                                   from MovimientoFondoItemBorradoTMP
                                   where mf_id = p_mf_id
                                     and mfTMP_id = p_mfTMP_id
                                     and mfi_id = mfi.mfi_id ) ) ) then

      for v_cheque in

         select 'Cheque: '
                || trim(to_char(cheq.cheq_numero))
                || ' - '
                || cheq.cheq_numerodoc
                || ' - '
                || 'MF: '
                || emp.emp_nombre
                || ' - '
                || doc.doc_nombre
                || ' - '
                || trim(to_char(mf.mf_numero))
                || ' - '
                || mf.mf_nrodoc
                || ' - '
                || to_char(mf.mf_fecha, 'dd-mm-yyyy')
         from
         (
           Cheque cheq
           join MovimientoFondoItem mfi
             on cheq.cheq_id = mfi.cheq_id and mfi.mf_id = p_mf_id
          )
         join MovimientoFondo mf
           on cheq.mf_id = mf.mf_id
         join Documento doc
           on mf.doc_id = doc.doc_id
         join Empresa emp
           on doc.emp_id = emp.emp_id
         where ( p_bIsDelete <> 0
                 or exists ( select mfi_id
                             from MovimientoFondoItemBorradoTMP
                             where mf_id = p_mf_id
                               and mfTMP_id = p_mfTMP_id
                               and mfi_id = mfi.mfi_id ) )
      loop

            v_cheques := v_cheques || v_cheque;

      end loop;

      p_bCanDelete := 0;
      p_Message := '@@ERROR_SP:Existe uno o mas cheques en este movimiento que han sido utilizados en una movimiento de fondos posterior.;' || v_cheques;
      return;

   end if;

   -- uno de los cheques mencionados por este movimiento de fondos esta
   -- cambiando de cuenta en el debe, o cambie el cheque en el item y
   -- este cheque ya fue usado por un movimiento de fondos posterior
   --
   if p_bIsDelete = 0 then

      if exists ( select cheq.cheq_id
                  -- Items del movimiento que estoy modificando
                  -- los necesito para saber si cambio la cuenta
                  -- de este cheque
                  from ( MovimientoFondoItemTMP mfit
                         join MovimientoFondoItem mfi
                           on mfit.mfi_id = mfi.mfi_id
                           and mfit.mfTMP_id = p_mfTMP_id
                           and mfi.mf_id = p_mf_id
                           and ( mfit.cue_id_debe <> mfi.cue_id_debe or mfit.cheq_id = mfi.cheq_id )
                       )
                       join Cheque cheq
                         on mfi.cheq_id = cheq.cheq_id
                  where coalesce(cheq.mf_id, 0) > p_mf_id ) then

         for v_cheque in
            select 'Cheque: '
                   || trim(to_char(cheq.cheq_numero))
                   || ' - '
                   || cheq.cheq_numerodoc
                   || ' - '
                   || 'MF: '
                   || emp.emp_nombre
                   || ' - '
                   || doc.doc_nombre
                   || ' - '
                   || trim(to_char(mf.mf_numero))
                   || ' - '
                   || mf.mf_nrodoc
                   || ' - '
                   || to_char(mf.mf_fecha, 'dd-mm-yyyy')
            from
            (
              MovimientoFondoItemTMP mfit
              join MovimientoFondoItem mfi
                on mfit.mfi_id = mfi.mfi_id
                and mfit.mfTMP_id = p_mfTMP_id
                and mfi.mf_id = p_mf_id
                and ( mfit.cue_id_debe <> mfi.cue_id_debe or mfit.cheq_id = mfi.cheq_id )
            )
            join Cheque cheq
              on mfi.cheq_id = cheq.cheq_id
            join MovimientoFondo mf
              on cheq.mf_id = mf.mf_id
            join Documento doc
              on mf.doc_id = doc.doc_id
            join Empresa emp
              on doc.emp_id = emp.emp_id
            where coalesce(cheq.mf_id, 0) > p_mf_id
              and ( p_bIsDelete <> 0
                    or exists ( select mfi_id
                                from MovimientoFondoItemBorradoTMP
                                where mf_id = p_mf_id
                                  and mfTMP_id = p_mfTMP_id
                                  and mfi_id = mfi.mfi_id ) )
         loop
            v_cheques := v_cheques || v_cheque;
         end loop;

         p_bCanDelete := 0;
         p_Message := '@@ERROR_SP:Existe uno o mas cheques en este movimiento que han sido utilizados en una movimiento de fondos posterior.;' || v_cheques;
         return;

      end if;

   end if;

   --------------------------------------------------------------------------------------------
   --
   --  3-  asociarlo al movimiento de fondos inmediato anterior
   --      al movimiento que estoy borrando
   --
   if exists ( select cheq.cheq_id
               from Cheque cheq
               join MovimientoFondoItem mfi
                 on cheq.cheq_id = mfi.cheq_id
               where mfi.mf_id = p_mf_id
                 and ( p_bIsDelete <> 0
                       or exists ( select mfi_id
                                   from MovimientoFondoItemBorradoTMP
                                   where mf_id = p_mf_id
                                     and mfTMP_id = p_mfTMP_id
                                     and mfi_id = mfi.mfi_id ) )
                                     and exists ( select mfi.mfi_id
                                                  from MovimientoFondoItem mfi
                                                  join MovimientoFondo mf
                                                    on mfi.mf_id = mf.mf_id
                                                  where mfi.cheq_id = cheq.cheq_id
                                                    and mfi.mf_id <> p_mf_id
                                                    and mf.est_id <> 7 /* Anulado */ ) ) then
      p_bChequeUsado := 1;
   else
      p_bChequeUsado := 0;
   end if;

   p_bCanDelete := 1;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_movimiento_fondo_item_can_delete(integer, integer, integer)
  owner to postgres;
