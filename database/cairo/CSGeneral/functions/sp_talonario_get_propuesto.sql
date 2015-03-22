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
-- Function: sp_talonario_get_propuesto()

-- drop function sp_talonario_get_propuesto(integer, integer, integer);

create or replace function sp_talonario_get_propuesto
/*
*/
(
  in p_doc_id integer,
  out p_ta_Mascara varchar,
  out p_ta_Propuesto smallint,
  in p_cli_id integer default 0,
  in p_prov_id integer default 0,
  out p_ta_id int,
  out p_ta_tipo smallint
)
  returns record as
$BODY$
declare
   v_ta_id integer;
   v_doct_id integer;
   v_cli_catfiscal integer;
   v_prov_catfiscal integer;
begin

   if coalesce(p_doc_id, 0) = 0 then
       begin
          p_ta_Mascara := '';

          p_ta_Propuesto := 0;

          p_ta_tipo := 0;

          p_ta_id := null;

       end;
   else
       begin
          select ta_id,
                 doct_id
            into v_ta_id,
                 v_doct_id
          from Documento
          where doc_id = p_doc_id;

          if v_doct_id in (
                  1   --   Factura de Venta
                  ,2  --   Factura de Compra
                  ,7  --   Nota de Credito Venta
                  ,8  --   Nota de Credito Compra
                  ,9  --   Nota de Debito Venta
                  ,10 --   Nota de Debito Compra
          ) then

          begin
             if v_doct_id in ( 1--   Factura de Venta
             ,7--   Nota de Credito Venta
             ,9 ) then--   Nota de Debito Venta

             begin
                select cli_catfiscal
                  into v_cli_catfiscal
                  from Cliente
                   where cli_id = p_cli_id;

                select case v_cli_catfiscal
                    when 1 then ta_id_inscripto--'Inscripto'

                    when 2 then ta_id_final--'Exento'

                    when 3 then ta_id_inscripto--'No inscripto'

                    when 4 then ta_id_final--'Consumidor Final'

                    when 5 then ta_id_externo--'Extranjero'

                    when 6 then ta_id_final--'Mono Tributo'

                    when 7 then ta_id_externo--'Extranjero Iva'

                    when 8 then ta_id_final--'No responsable'

                    when 9 then ta_id_final--'No Responsable exento'

                    when 10 then ta_id_final--'No categorizado'

                    when 11 then ta_id_inscripto--'Inscripto M'

                    else -1--'Sin categorizar'

                  end
                  into v_ta_id
                from Documento
                where doc_id = p_doc_id;

             end;
             else
             begin
                select prov_catfiscal
                  into v_prov_catfiscal
                from Proveedor
                where prov_id = p_prov_id;

                --2,--   Factura de Compra
                --8,--   Nota de Credito Compra
                --10--   Nota de Debito Compra
                select case v_prov_catfiscal
                     when 1 then ta_id_inscripto--'Inscripto'

                     when 2 then ta_id_final--'Exento'

                     when 3 then ta_id_final--'No inscripto'

                     when 4 then ta_id_final--'Consumidor Final'

                     when 5 then ta_id_externo--'Extranjero'

                     when 6 then ta_id_final--'Mono Tributo'

                     when 7 then ta_id_externo--'Extranjero Iva'

                     when 8 then ta_id_final--'No responsable'

                     when 9 then ta_id_final--'No Responsable exento'

                     when 10 then ta_id_final--'No categorizado'

                     when 11 then ta_id_inscriptom--'Inscripto M'

                     else -1--'Sin categorizar'

                  end
                  into v_ta_id
                from Documento
                where doc_id = p_doc_id;

             end;
             end if;

          end;
          end if;

          if coalesce(v_ta_id, 0) = 0 then
              begin
                 p_ta_Mascara := '';

                 p_ta_Propuesto := 0;

                 p_ta_tipo := 0;

                 p_ta_id := null;

              end;
          else
              begin
                 select ta_mascara,
                        ta_tipo,
                        ta_tipo
                   into p_ta_Mascara,
                        p_ta_Propuesto,
                        p_ta_tipo
                 from Talonario
                 where ta_id = v_ta_id;

                 if coalesce(p_ta_Propuesto, 0) <> 1 then
                    p_ta_Propuesto := 0;

                 else
                    p_ta_Propuesto := 1;

                 end if;

                 p_ta_Mascara := coalesce(p_ta_Mascara, '');

                 p_ta_id := v_ta_id;

              end;
          end if;

       end;
   end if;

end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function sp_talonario_get_propuesto(integer, integer, integer)
  owner to postgres;