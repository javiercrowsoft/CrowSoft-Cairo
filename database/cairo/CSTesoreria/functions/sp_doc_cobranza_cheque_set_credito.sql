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
-- Function: sp_doc_cobranza_cheque_set_credito()

-- drop function sp_doc_cobranza_cheque_set_credito(integer, integer);

/*
          select * from cobranza;
          select * from sp_doc_cobranza_cheque_set_credito(3,1);
*/

create or replace function sp_doc_cobranza_cheque_set_credito
(
  in p_cobz_id integer,
  in p_borrar integer default 0
)
  returns void as
$BODY$
declare
   v_pendiente decimal(18,6);
   v_cli_id integer;
   v_emp_id integer;

   v_doct_cobranzachq integer := 1013;

   v_old_cli_ids integer[];
   i integer;
begin

   -- si no hay documento adios
   --
   if p_cobz_id = 0 then
      return;
   end if;

   -- datos del documento
   --
   select cli_id,
          emp_id
     into v_cli_id,
          v_emp_id
   from Cobranza
   where cobz_id = p_cobz_id;

   -- borrar referencias a este documento por otro cliente
   --
   -- siempre borro cualquier mencion a este documento en el cache de cualquier
   -- cliente que no sea el indicado por el documento
   --
   if exists ( select cli_id
               from ClienteCacheCredito
               where cli_id <> v_cli_id
                 and doct_id = v_doct_cobranzachq
                 and id = p_cobz_id ) then

      select into v_old_cli_ids cli_id
      from ClienteCacheCredito
      where cli_id <> v_cli_id
        and doct_id = v_doct_cobranzachq
        and id = p_cobz_id;

      delete from ClienteCacheCredito
      where cli_id <> v_cli_id
        and doct_id = v_doct_cobranzachq
        and id = p_cobz_id;

      for i in 1 .. array_upper(v_old_cli_ids, 1)
      loop

            perform sp_cliente_update_credito(v_oldcli[i], v_emp_id);

      end loop;

   end if;

   -- borrar
   --
   if p_borrar <> 0 then

      delete from ClienteCacheCredito
      where cli_id = v_cli_id
        and doct_id = v_doct_cobranzachq
        and id = p_cobz_id;

   -- insert - update
   --
   else

      select sum(cheq_importe)
        into v_pendiente
      from Cheque
      where cobz_id = p_cobz_id
        and cheq_fechacobro > CURRENT_TIMESTAMP
        and cheq_anulado = 0
        and cheq_rechazado = 0;

      v_pendiente := round(coalesce(v_pendiente, 0), 2);

      if exists ( select id
                  from ClienteCacheCredito
                  where cli_id = v_cli_id
                    and doct_id = v_doct_cobranzachq
                    and id = p_cobz_id ) then

         if abs(v_pendiente) >= 0.01 then

            update ClienteCacheCredito
               set clicc_importe = v_pendiente
            where cli_id = v_cli_id
              and doct_id = v_doct_cobranzachq
              and id = p_cobz_id;

         -- si no hay nada pendiente lo saco del cache
         --
         else

            delete from ClienteCacheCredito
            where cli_id = v_cli_id
              and doct_id = v_doct_cobranzachq
              and id = p_cobz_id;

         end if;

      else

         -- solo si hay algo pendiente
         --
         if abs(v_pendiente) >= 0.01 then

            insert into ClienteCacheCredito ( cli_id, doct_id, id, clicc_importe, emp_id )
                                     values ( v_cli_id, v_doct_cobranzachq, p_cobz_id, v_pendiente, v_emp_id );

         end if;

      end if;

   end if;

   -- insertar - actualizar
   --
   -- deuda en cache
   --
   -- actualizo la deuda en la tabla cliente
   --
   perform sp_cliente_update_credito(v_cli_id, v_emp_id);

exception
    when others then
        raise exception 'Ha ocurrido un error al actualizar el estado de la cobranza. sp_doc_cobranza_cheque_set_credito. %. %.',
                         sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_cobranza_cheque_set_credito(integer, integer)
  owner to postgres;