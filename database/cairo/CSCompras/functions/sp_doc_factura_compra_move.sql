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
-- Function: sp_doc_factura_compra_move()

-- drop function sp_doc_factura_compra_move(integer, integer, integer);

create or replace function sp_doc_factura_compra_move
(
 in p_doct_id integer,
 in p_comp_id integer,
 in p_moveTo integer,
 out p_comp_id_to_move integer
)
 returns integer as
$BODY$
declare
 v_MSG_DOC_FIRST smallint    := 101;
 v_MSG_DOC_PREVIOUS smallint := 102;
 v_MSG_DOC_NEXT smallint     := 103;
 v_MSG_DOC_LAST smallint     := 104;

 v_currNro integer;
 v_fc_id integer;
begin

   if p_moveTo = v_MSG_DOC_FIRST then
      select fc_id into p_comp_id_to_move from FacturaCompra
      where fc_numero = ( select min(fc_numero) from FacturaCompra where doc_id = p_DocId );
   else
      if p_moveTo = v_MSG_DOC_LAST then
         select fc_id from FacturaCompra
         where fc_numero = ( select max(fc_numero) from FacturaCompra where doc_id = p_DocId );
      else
         select fc_numero into v_currNro from FacturaCompra where fc_id = p_comp_id;
         --
         -- when a document is deleted the current number is no more available, so we need to get the next or previous one
         --
         if v_currNro is null then
            select min(fc_id) into v_fc_id from FacturaCompra where fc_id > p_comp_id and doct_id = p_doct_id;
            if v_fc_id is null then
               select max(fc_id) into v_fc_id from FacturaCompra where fc_id < p_comp_id and doct_id = p_doct_id;
            end if;

            if v_fc_id is null then
               p_comp_id_to_move := 0;
               return;
            end if;

            select fc_numero into v_currNro from FacturaCompra where fc_id = v_fc_id;
         end if;

         if p_moveTo = v_MSG_DOC_PREVIOUS then
             select fc_id from FacturaCompra
             where fc_numero = ( select max(fc_numero) from FacturaCompra where doc_id = p_DocId and fc_numero < v_currNro );
         else
            if p_moveTo = v_MSG_DOC_NEXT then
               select fc_id from FacturaCompra
               where fc_numero = ( select min(fc_numero) from FacturaCompra where doc_id = p_DocId and fc_numero > v_currNro );
           end if;
        end if;
      end if;
   end if;

   p_comp_id_to_move := coalesce(p_comp_id_to_move, 0);

end;
$BODY$
 language plpgsql volatile
                  cost 100;
alter function sp_doc_factura_compra_move(integer, integer, integer)
 owner to postgres;