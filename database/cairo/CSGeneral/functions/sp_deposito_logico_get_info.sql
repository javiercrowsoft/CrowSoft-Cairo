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
-- Function: sp_deposito_logico_get_info()

-- drop function sp_deposito_logico_get_info(integer);

create or replace function sp_deposito_logico_get_info
/*
    select * from sp_deposito_logico_get_info(2);
*/
(
  in p_depl_id integer,

  out p_depf_id integer,
  out p_ctrl_stock_type smallint
)
  returns record as
$BODY$
declare
      v_cfg_valor varchar;
begin

      select depf_id
        into p_depf_id
      from depositoLogico
      where depl_id = p_depl_id;

      select sp_cfg_getValor('Stock-General', 'Tipo Control Stock') into v_cfg_valor;

      v_cfg_valor := coalesce(v_cfg_valor, '0');

      p_ctrl_stock_type := to_number(v_cfg_valor);
end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_deposito_logico_get_info(integer)
  owner to postgres;
