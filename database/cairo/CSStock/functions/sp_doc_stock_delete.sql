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
-- Function: sp_doc_stock_delete()

-- drop function sp_doc_stock_delete(integer, integer, integer, integer);

create or replace function sp_doc_stock_delete
(
 in p_st_id integer,
 in p_emp_id integer,
 in p_us_id integer,
 in p_bNotUpdatePrns integer default 0,
 in p_bNoCheckAccess integer default 0
)
 returns void as
$BODY$
declare
   v_editable integer;
   v_edit_msg varchar(255);
   v_success smallint;
   v_message varchar(255);
begin
 
   if coalesce(p_st_id, 0) = 0 then
      return;
   end if;


   if p_bNoCheckAccess = 0 then

      select * from sp_doc_stock_editable_get(p_emp_id, p_st_id, p_us_id, 0, 1) into v_editable, v_edit_msg;

      if v_editable = 0 then

         raise exception '@@ERROR_SP: %', v_edit_msg;

      end if;

   end if;

   SET TRANSACTION READ WRITE;

   begin

      --
      -- Quito de StockCache lo que se movio con los items de este movimiento
      --
      select * from sp_doc_stock_cache_update(p_st_id, 1 /* restar */, p_bNotUpdatePrns) into v_message, v_success;

      if coalesce(v_success, 0) = 0 then
         raise exception '%', v_message;
      end if;

      select * from sp_doc_stock_validate_fisico(p_st_id) into v_message, v_success;

      if coalesce(v_success, 0) = 0 then
         raise exception '%', v_message;
      end if;

      delete from StockItem where st_id = p_st_id;
      delete from StockItemKit where st_id = p_st_id;
      delete from Stock where st_id = p_st_id;

   exception
      when others then
         raise exception 'Ha ocurrido un error al borrar el movimiento de stock. sp_doc_stock_delete.',
                          sqlstate, sqlerrm;
   end;

   return;

end;
$BODY$
 language plpgsql volatile
                  COST 100;
alter function sp_doc_stock_delete(integer, integer, integer, integer, integer)
 owner to postgres;