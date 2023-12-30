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

create or replace
 function sp_doc_movimiento_fondo_delete
/*
 sp_doc_movimiento_fondo_delete 93
*/
(
 in p_mf_id integer,
 in p_emp_id integer,
 in p_us_id integer
)
 returns void as
$BODY$
declare
   v_editable integer;
   v_edit_msg varchar(255);
   v_as_id integer;

   v_message varchar(8000);
   v_chequeUsado smallint;
   v_canDelete smallint;

begin

   if coalesce(p_mf_id, 0) = 0 then
         return;
   end if;

   select * from sp_doc_movimiento_fondo_editable_get(p_emp_id, p_mf_id, p_us_id) into v_editable, v_edit_msg;

   if v_editable = 0 then

      raise exception '@@ERROR_SP: %', v_edit_msg;

   end if;

   -- Controlo que ningun cheque mencionado en
   -- este movimiento de fondos este utilizado
   -- por otro movimiento de fondos o por una
   -- orden de pago ya que si es asi, no puedo
   -- vincular asociar este cheque con la cuenta
   -- mencionada en la cobranza, sino que debo:
   --
   --  1-  dar un error si esta usado en una orden de pago
   --      o un deposito bancario,
   --  2-  dar un error si esta usado en un movimiento
   --      de fondo posterior,
   --  3-  asociarlo al movimiento de fondos inmediato anterior
   --      al movimiento que estoy borrando

   select * from sp_doc_movimiento_fondo_item_can_delete(
           p_mf_id,
           null,
           1)-- bIsDelete = true
   into
      v_message,
      v_chequeUsado,
      v_canDelete;

   if v_canDelete = 0 then
      raise exception '@@ERROR_SP: %', v_message;
   end if;

   SET TRANSACTION READ WRITE;

   select as_id
     into v_as_id
   from MovimientoFondo
   where mf_id = p_mf_id;

   begin

      update MovimientoFondo
      set as_id = null
      where mf_id = p_mf_id;

      perform sp_doc_asiento_delete(v_as_id, p_emp_id, p_us_id, 1);-- No check access

      perform sp_doc_movimiento_fondo_item_delete(p_mf_id, null /* p_mfTMP_id */, 1 /* bIsDelete = False */, v_chequeUsado);

      delete from MovimientoFondo where mf_id = p_mf_id;

      return;

   exception
      when others then
        raise exception 'Ha ocurrido un error al borrar el movimiento de fondos. sp_doc_movimiento_fondo_delete. %. %.',
                         sqlstate, sqlerrm;
   end;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_movimiento_fondo_delete(integer, integer, integer)
  owner to postgres;