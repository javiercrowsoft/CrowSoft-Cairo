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
-- Function: sp_talonario_get_next_number()

-- drop function sp_talonario_get_next_number(intseger);

create or replace
function sp_talonario_get_next_number
/*
          select * from sp_talonario_get_next_number(2)
*/
(
  in p_ta_id integer,
  out p_ta_nrodoc varchar
)
  returns varchar as
$BODY$
declare
   v_ta_ultimoNro integer;
   v_ta_mascara varchar(100);
   v_lenmascara smallint;
begin

    select ta_ultimonro,
           ta_mascara
      into v_ta_ultimoNro,
           v_ta_mascara
    from Talonario
    where ta_id = p_ta_id;

    p_ta_nrodoc := trim(to_char(v_ta_ultimoNro + 1));

    v_lenMascara := length(v_ta_mascara) - length(p_ta_nrodoc);

    if v_lenMascara > 0 then
        p_ta_nrodoc := substr(v_ta_mascara, 1, v_lenMascara) || p_ta_nrodoc;
    end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_talonario_get_next_number(integer)
  owner to postgres;