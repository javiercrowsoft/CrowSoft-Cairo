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
-- Function: sp_doc_movimiento_fondo_item_delete()

-- drop function sp_doc_movimiento_fondo_item_delete(integer, integer, integer, integer);

create or replace function sp_doc_movimiento_fondo_item_delete (
 in p_mf_id integer,
 in p_mfTMP_id integer,
 in p_bIsDelete integer,
 in p_bChequeUsado integer
)
  returns void as
$BODY$
declare
  v_mf_id    integer;
  v_cheq_id  integer;
begin

   create temporary table tt_t_mfi_cheque (cheq_id integer) on commit drop;

   if p_bIsDelete = 0 then
      if not exists ( select 1
                      from MovimientoFondoItemBorradoTMP
                      where mf_id    = p_mf_id
                        and mfTMP_id = p_mfTMP_id ) then
         return;
      end if;
   end if;

   --------------------------------------------------------------------------------------------
   --  3-  asociarlo al movimiento de fondos inmediato anterior
   --      al movimiento que estoy borrando
   --
   if p_bChequeUsado <> 0 then

    for v_cheq_id in
        select cheq_id
        from MovimientoFondoItem mfi
        where mf_id = p_mf_id
          and cheq_id is not null
          and ( p_bIsDelete <> 0
                or exists (select mfi_id
                           from MovimientoFondoItemBorradoTMP
                           where mf_id = p_mf_id
                             and mfTMP_id = p_mfTMP_id
                             and mfi_id = mfi.mfi_id
                  )
              )
    loop

     v_mf_id := null;

     -- busco un movimiento de fondos anterior al que estoy borrando
     -- que mencione al cheque
     --
     select max(mfi.mf_id)
       into v_mf_id
     from Cheque cheq
     inner join MovimientoFondoItem mfi on cheq.cheq_id = mfi.cheq_id
     inner join MovimientoFondo mf      on mfi.mf_id    = mf.mf_id
     where cheq.cheq_id = v_cheq_id
       and mfi.mf_id <> p_mf_id
       and mf.est_id <> 7; /* Anulado */

     -- hay un movimiento de fondos que mueve el cheque
     --
     if v_mf_id is not null then

         -- devuelvo el cheque a la cuenta indicada por el ultimo movimiento de fondos
         -- anterior al que estoy borrando y lo vinculo con dicho movimiento
         --
         update Cheque
             set cue_id = (select mfi.cue_id_debe
                           from MovimientoFondoItem mfi
                           where  Cheque.cheq_id = mfi.cheq_id
                               and mfi.mf_id     = v_mf_id
                           ),
                 mf_id = v_mf_id
         where Cheque.cheq_id = v_cheq_id;

     else

        -- si el cheque entro por una cobranza
        --
        if exists ( select 1
                    from cheque
                    where cheq_id = v_cheq_id
                      and cobz_id is not null ) then

           -- devuelvo a documentos en cartera los cheques de tercero y
           -- los desvinculo de este movimiento de fondos
           --
           update Cheque
               set cue_id = (select cobzi.cue_id
                             from CobranzaItem cobzi
                             where Cheque.cheq_id  = cobzi.cheq_id
                             ),
                   mf_id = null
           where Cheque.mf_id = p_mf_id
             and Cheque.cheq_id = v_cheq_id;

        -- si no entro por una cobranza y no hay
        -- movimientos anteriores al que estoy borrando
        -- es por que entro en este movimiento y por ende solo
        -- queda borrarlo. Esto incluye propios y de terceros.
        --
        else

           -- desvinculo el cheque del item para poder borrarlo
           update MovimientoFondoItem set cheq_id = null
           where mf_id = p_mf_id
             and cheq_id = v_cheq_id;

           -- desvinculo el cheque de cualquier AsientoItem que lo mencione
           --
           update AsientoItem set cheq_id = null where cheq_id = v_cheq_id;

           -- borro los cheques de tercero que entraron por este movimiento de fondos
           delete from Cheque where cheq_id = v_cheq_id;

        end if;

     end if;

    end loop;

   end if;

   --------------------------------------------------------------------------------------------

   insert into tt_t_mfi_cheque (cheq_id)
   select cheq_id
   from MovimientoFondoItem mfi
   where mf_id = p_mf_id
     and cheq_id is not null
     and ( p_bIsDelete <> 0
           or exists (select mfi_id
                      from MovimientoFondoItemBorradoTMP
                      where mf_id   = p_mf_id
                        and mfTMP_id  = p_mfTMP_id
                        and mfi_id   = mfi.mfi_id
                     )
         );

   --------------------------------------------------------------------------------------------

   delete from MovimientoFondoItem
   where mf_id = p_mf_id
     and ( p_bIsDelete <> 0
           or exists ( select mfi_id
                       from MovimientoFondoItemBorradoTMP
                       where mf_id   = p_mf_id
                         and mfTMP_id  = p_mfTMP_id
                         and mfi_id   = MovimientoFondoItem.mfi_id
                      )
         );

   --------------------------------------------------------------------------------------------
   --
   if p_bChequeUsado = 0 then

      -- desvinculo el cheque de cualquier AsientoItem que lo mencione
      --
      update AsientoItem set cheq_id = null
      where cheq_id in (
                          select cheq_id
                          from Cheque
                          where mf_id = p_mf_id
                            and cobz_id is null
                            and chq_id is null
                            and exists (select cheq_id from tt_t_mfi_cheque where cheq_id = Cheque.cheq_id)
                        );

      -- borro los cheques de tercero que entraron por este movimiento de fondos
      --
      delete from Cheque
      where mf_id = p_mf_id
        and cobz_id is null
        and chq_id is null
        and exists (select cheq_id from tt_t_mfi_cheque where cheq_id = Cheque.cheq_id);


      -- desvinculo el cheque de cualquier AsientoItem que lo mencione
      --
      update AsientoItem set cheq_id = null
      where cheq_id in (
                          select cheq_id
                          from Cheque
                          where mf_id = p_mf_id
                            and chq_id is not null -- solo los cheques propios tienen chequera (chq_id)
                            and exists (select cheq_id from tt_t_mfi_cheque where cheq_id = Cheque.cheq_id)
                        );


      -- borro los cheques propios utilizados por el movimiento de fondos
      --
      delete from Cheque
      where mf_id = p_mf_id
        and chq_id is not null -- solo los cheques propios tienen chequera (chq_id)
        and exists (select cheq_id from tt_t_mfi_cheque where cheq_id = Cheque.cheq_id);

      -- devuelvo a documentos en cartera los cheques de tercero y los
      -- desvinculo de este movimiento de fondos
      --
      update Cheque
          set cue_id = ( select cobzi.cue_id
                         from CobranzaItem cobzi
                         where cobzi.cheq_id = Cheque.cheq_id
                           and Cheque.mf_id = p_mf_id
                        ),
              mf_id = null
      where  Cheque.mf_id = p_mf_id
        and exists ( select cheq_id
                     from tt_t_mfi_cheque
                     where cheq_id = Cheque.cheq_id);

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_movimiento_fondo_item_delete(integer, integer, integer, integer)
  owner to postgres;