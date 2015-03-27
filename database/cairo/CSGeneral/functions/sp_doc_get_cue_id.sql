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
-- Function: sp_doc_get_cue_id()

-- drop function sp_doc_get_cue_id(integer, integer, integer);

create or replace
function sp_doc_get_cue_id
/*
	select * from cliente
	select * from documento
	select * from cuenta where cue_id = 129
	select * from sp_doc_get_cue_id(6, 12)
*/
(
  in p_tercero_id integer,       -- puede ser un cliente o un proveedor
  in p_doc_id integer,
  in p_to_id integer default 1, -- Tipo de operacion
  out p_cue_id integer,
  out p_mon_id integer  
)
  returns record as
$BODY$
declare
  v_doct_id integer;
  v_cue_id integer;
  v_mon_id integer;
begin


      -- Ojo: resistir la tentacion de meter esto
      --      en el select de abajo, ya que si no
      --      hay tipo de operacion, va a dejar
      --      el doct_id en null y no va a funcar
      --
      select doct_id
        into v_doct_id
      from Documento
      where doc_id = p_doc_id;

      -- Saco la cuenta del tipo de operacion
      --
      select Cuenta.cue_id,
             Cuenta.mon_id
        into v_cue_id,
             v_mon_id
      from TipoOperacionCuentaGrupo
      join Documento
        on TipoOperacionCuentaGrupo.cueg_id = Documento.cueg_id
      join Cuenta
        on TipoOperacionCuentaGrupo.cue_id = Cuenta.cue_id
      where to_id = p_to_id
        and doc_id = p_doc_id;

      if v_cue_id is null then

         if v_doct_id in ( 1,7,9,13 ) then

            -- Saco la cuenta del cliente
            --
            select Cuenta.cue_id,
                   Cuenta.mon_id
              into v_cue_id,
                   v_mon_id
            from ClienteCuentaGrupo
            join Documento
              on ClienteCuentaGrupo.cueg_id = Documento.cueg_id
            join Cuenta
              on ClienteCuentaGrupo.cue_id = Cuenta.cue_id
            where cli_id = p_tercero_id
              and doc_id = p_doc_id;

            -- Saco la cuenta de CuentaGrupo
            --
            if v_cue_id is null then

               select Cuenta.cue_id,
                      Cuenta.mon_id
                 into v_cue_id,
                      v_mon_id
               from CuentaGrupo
               join Documento
                 on CuentaGrupo.cueg_id = Documento.cueg_id
               join Cuenta
                 on CuentaGrupo.cue_id = Cuenta.cue_id
               where Documento.doc_id = p_doc_id;

            end if;

         else

            -- Saco la cuenta del cliente
            --
            select Cuenta.cue_id,
                   Cuenta.mon_id
              into v_cue_id,
                   v_mon_id
            from ProveedorCuentaGrupo
            join Documento
              on ProveedorCuentaGrupo.cueg_id = Documento.cueg_id
            join Cuenta
              on ProveedorCuentaGrupo.cue_id = Cuenta.cue_id
            where prov_id = p_tercero_id
              and doc_id = p_doc_id;

            -- Saco la cuenta de CuentaGrupo
            --
            if v_cue_id is null then

               select Cuenta.cue_id,
                      Cuenta.mon_id
                 into v_cue_id,
                      v_mon_id
               from CuentaGrupo
               join Documento
                 on CuentaGrupo.cueg_id = Documento.cueg_id
               join Cuenta
                 on CuentaGrupo.cue_id = Cuenta.cue_id
               where Documento.doc_id = p_doc_id;

            end if;
         end if;
      end if;

      p_cue_id := v_cue_id;
      p_mon_id := v_mon_id;

end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function sp_doc_get_info(integer, integer, integer)
  owner to postgres;