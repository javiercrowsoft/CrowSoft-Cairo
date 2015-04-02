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
-- Function: sp_proveedor_get_iva()

-- drop function sp_proveedor_get_iva(integer, smallint);

create or replace function sp_proveedor_get_iva
(
  in p_prov_id integer,
  out p_bIvari smallint,
  out p_bIvarni smallint,
  in p_bselect smallint default 1
)
  returns record as
$BODY$
declare
   v_tipoIva smallint;
   v_bIva smallint;
   v_bIvaRni smallint;
   v_bSinIva smallint;
begin

   if p_bselect <> 0 then
      raise exception '@@ERROR_SP:El procedimiento almacenado SP_DBGetNewId no puede ser llamado para obtener un cursor. El codigo Java o Scala debe usar parametros out.';
	  RETURN;
   end if;

   v_bIva := -1;
   v_bIvaRni := -2;
   v_bSinIva := -3;

   select case prov_catfiscal
             when 1 then v_bIva      --'Inscripto'
             when 2 then v_bSinIva   --'Exento'
             when 3 then v_bSinIva   --'No inscripto'
             when 4 then v_bIva      --'Consumidor Final'
             when 5 then v_bSinIva   --'Extranjero'
             when 6 then v_bSinIva   --'Mono Tributo'
             when 7 then v_bIva      --'Extranjero Iva'
             when 8 then v_bIva      --'No responsable'
             when 9 then v_bIva      --'No Responsable exento'
             when 10 then v_bIvaRni  --'No categorizado'
             when 11 then v_bIva     --'Inscripto M'
             else 0                  --'Sin categorizar'
          end
     into v_tipoIva
   from Proveedor
   where prov_id = p_prov_id;

   v_tipoIva := coalesce(v_tipoIva, v_bSinIva);

   if v_tipoIva = v_bIva then
   begin
      v_bIva := 1;
      v_bIvaRni := 0;
   end;
   else
   begin
      if v_tipoIva = v_bIvaRni then
      begin
         v_bIva := 1;
         v_bIvaRni := 1;
      end;
      else
      begin
         if v_tipoIva = v_bSinIva then
         begin
            v_bIva := 0;
            v_bIvaRni := 0;
         end;
         end if;

      end;
      end if;

   end;
   end if;

   p_bIvaRi := v_bIva;
   p_bIvaRni := v_bIvaRni;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_proveedor_get_iva(integer, smallint)
  owner to postgres;