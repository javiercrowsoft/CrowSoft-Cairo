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
-- Function: sp_cliente_get_talonario()

-- drop function sp_cliente_get_talonario(integer, smallint);

/*

          select * from documento where doct_id = 8;
          select * from cliente;
          select * from talonario where ta_id = 10;
          select * from sp_cliente_get_talonario(1, 169);

*/

create or replace function sp_cliente_get_talonario
(
  in p_cli_id integer,
  in p_doc_id integer default null,
  out p_ta_id integer
)
  returns integer as
$BODY$
declare
   v_cli_catfiscal smallint;
   v_doct_id integer;
   v_doct_id_facturavta integer;
   v_doct_id_facturacpra integer;
   v_doct_id_notadebitovta integer;
   v_doct_id_notacreditovta integer;
   v_doct_id_notadebitocpra integer;
   v_doct_id_notacreditocpra integer;
begin

   v_doct_id_facturavta := 1;
   v_doct_id_facturacpra := 2;
   v_doct_id_notadebitovta := 9;
   v_doct_id_notacreditovta := 7;
   v_doct_id_notadebitocpra := 10;
   v_doct_id_notacreditocpra := 8;

   select doct_id
     into v_doct_id
   from Documento
   where doc_id = p_doc_id;

   if v_doct_id in (
                        v_doct_id_facturavta, v_doct_id_facturacpra, v_doct_id_notadebitovta,
                        v_doct_id_notacreditovta, v_doct_id_notadebitocpra, v_doct_id_notacreditocpra ) then

        select cli_catfiscal
          into v_cli_catfiscal
        from Cliente
        where cli_id = p_cli_id;


        select
            case v_cli_catfiscal
                when 1  then ta_id_inscripto--'Inscripto'
                when 2  then ta_id_final--'Exento'
                when 3  then ta_id_final--'No inscripto'
                when 4  then ta_id_final--'Consumidor Final'
                when 5  then ta_id_externo--'Extranjero'
                when 6  then ta_id_final--'Mono Tributo'
                when 7  then ta_id_externo--'Extranjero Iva'
                when 8  then ta_id_final--'No responsable'
                when 9  then ta_id_final--'No Responsable exento'
                when 10 then ta_id_final--'No categorizado'
                when 11 then ta_id_inscriptom--'Inscripto M'
                else -1--'Sin categorizar'
            end ta_id
          into p_ta_id
        from Documento
        where doc_id = p_doc_id;

   else

        select ta_id
          into p_ta_id
        from Documento
        where doc_id = p_doc_id;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_cliente_get_talonario(integer, integer)
  owner to postgres;