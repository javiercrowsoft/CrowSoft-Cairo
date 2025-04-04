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
-- Function: sp_doc_cobranza_delete()

-- drop function sp_doc_cobranza_delete(integer, integer, integer);
/*
select * from cobranza where cobz_id not in (select cobz_id from facturaventacobranza);
begin;
          set transaction read write;

          select * from sp_doc_cobranza_delete(1138,1,1);

          rollback;
end;
*/

create or replace function sp_doc_cobranza_delete
(
 in p_cobz_id integer,
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

   if coalesce(p_cobz_id, 0) = 0 then
      return;
   end if;

   select * from sp_doc_cobranza_editable_get(p_emp_id, p_cobz_id, p_us_id, 0, 1) into v_editable, v_edit_msg;

   if v_editable = 0 then

      raise exception '@@ERROR_SP: %', v_edit_msg;

   end if;

   SET TRANSACTION READ WRITE;

   select as_id
     into v_as_id
   from Cobranza
   where cobz_id = p_cobz_id;

   begin

      update Cobranza set as_id = null where cobz_id = p_cobz_id;

      perform sp_doc_asiento_delete(v_as_id, p_emp_id, p_us_id, 1); -- No check access

      perform sp_doc_cobranza_set_credito(p_cobz_id, 1);

      delete from CobranzaItem where cobz_id = p_cobz_id;

      -- Borro los cheques de clientes que entraron por esta cobranza
      delete from Cheque where cobz_id = p_cobz_id;

      perform sp_doc_cobranza_cheque_set_credito(p_cobz_id, 1);

      -- Borro los cupones de tarjeta que entraron por esta cobranza
      delete from TarjetaCreditoCupon where cobz_id = p_cobz_id;

      delete from Cobranza where cobz_id = p_cobz_id;

   exception
      when others then
         raise exception 'Ha ocurrido un error al borrar la Cobranza. sp_doc_cobranza_delete. %. %.',
                          sqlstate, sqlerrm;
   end;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_cobranza_delete(integer, integer, integer)
  owner to postgres;