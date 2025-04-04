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
-- Function: sp_doc_orden_pago_delete()

-- drop function sp_doc_orden_pago_delete(integer, integer, integer);
/*
select * from ordenpago where opg_id not in (select opg_id from facturacompraordenpago);
begin;
          set transaction read write; 

          select * from sp_doc_orden_pago_delete(8,1,1);
          
          rollback;
end;
*/

create or replace function sp_doc_orden_pago_delete
(
  in p_opg_id integer,
  in p_emp_id integer,
  in p_us_id integer
)
  returns void as
$BODY$
declare
   v_editable integer;
   v_edit_msg varchar(255);
   v_as_id integer;
begin

  if coalesce(p_opg_id, 0) = 0 then
     return;
  end if;

  select * from sp_doc_orden_pago_editable_get(p_emp_id, p_opg_id, p_us_id, 0, 1) into v_editable, v_edit_msg;

  if v_editable = 0 then

     raise exception '@@ERROR_SP: %', v_edit_msg;

  end if;

  SET TRANSACTION READ WRITE;

  select as_id
    into v_as_id
  from OrdenPago
  where opg_id = p_opg_id;

  begin

    update OrdenPago set as_id = null where opg_id = p_opg_id;

    perform sp_doc_asiento_delete(v_as_id, p_emp_id, p_us_id, 1);-- No check access

    perform sp_doc_orden_pago_set_credito(p_opg_id, 1);

    delete from OrdenPagoItem where opg_id = p_opg_id;

    ---------------------------------------------------------
    -- Hay tres situaciones a resolver con los cheques
    --
    -- 1- Borrar los cheques propios emitidos por esta orden
    --
    -- 2- Devolver a la cuenta mencionada en el ultimo
    --    movimiento de fondos que menciono al cheque
    --
    -- 3- Devolver a documentos en cartera los cheques
    --    ingresados por una cobranza

    -- Borro los cheques propios entregados al proveedor

    delete from Cheque
    where opg_id = p_opg_id
      and chq_id is not null-- solo los cheques propios tienen chequera (chq_id)
      and mf_id is null;-- no entraron por movimiento de fondos

    -- Devuelvo a documentos en cartera los cheques de tercero y los desvinculo de esta orden de pago

    update Cheque
       set cue_id = (select cue_id_debe
                     from MovimientoFondoitem
                     where cheq_id = Cheque.cheq_id
                       and mf_id = Cheque.mf_id),
           opg_id = null
    where exists (select cue_id_debe
                  from MovimientoFondoitem
                  where cheq_id = Cheque.cheq_id
                    and mf_id = Cheque.mf_id)
      and Cheque.opg_id = p_opg_id;

    -- Devuelvo a documentos en cartera los cheques de tercero y los desvinculo de esta orden de pago

    update Cheque
       set cue_id = (select cue_id
                     from CobranzaItem
                     where cheq_id = Cheque.cheq_id),
           opg_id = null
    where exists (select cue_id
                  from CobranzaItem
                  where cheq_id = Cheque.cheq_id)
      and Cheque.opg_id = p_opg_id
      and mf_id is null;

    perform sp_doc_orden_pago_cheque_set_credito(p_opg_id, 1);

    delete from OrdenPago where opg_id = p_opg_id;

  exception
     when others then
       raise exception 'Ha ocurrido un error al borrar la Orden de Pago. sp_doc_orden_pago_delete. %. %.',
                        sqlstate, sqlerrm;
  end;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_orden_pago_delete(integer, integer, integer)
  owner to postgres;