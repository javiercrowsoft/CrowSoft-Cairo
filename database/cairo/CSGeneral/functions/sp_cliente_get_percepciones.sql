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
-- Function: sp_cliente_get_percepciones()

-- drop function sp_cliente_get_percepciones(integer, integer, date);

create or replace function sp_cliente_get_percepciones
(
  in p_cli_id integer,
  in p_emp_id integer,
  in p_fecha date,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
 v_catf_id  integer;
 v_pro_id   integer;
begin

   select cli_catFiscal,
          pro_id
     into v_catf_id,
          v_pro_id
   from Cliente
   where cli_id = p_cli_id;

   rtn := 'rtn';

   open rtn for

   select perc.*,
          perci.*,
          perccatf_base
   from Percepcion perc
   inner join PercepcionItem perci
      on perc.perc_id = perci.perc_id
   inner join PercepcionCategoriaFiscal catf
      on perc.perc_id = catf.perc_id and catf_id = v_catf_id
   where (
          (    exists(select * from PercepcionProvincia where pro_id = v_pro_id and perc_id = perc.perc_id)
           and exists(select * from Configuracion
                      where cfg_grupo = 'Ventas-General'
                       and cfg_aspecto = 'Percepcion'
                       and convert(int, cfg_valor) = perc.perc_id
                     )
           and not exists(select * from ClientePercepcion where cli_id = p_cli_id and perc_id = perc.perc_id)
          )
          or exists(select * from ClientePercepcion
                    where cli_id = p_cli_id
                     and perc_id = perc.perc_id
                     and p_fecha between cliperc_desde and cliperc_hasta
                   )
         )
    and exists(select * from PercepcionEmpresa where emp_id = p_emp_id and perc_id = perc.perc_id);

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_cliente_get_percepciones(integer, integer, date)
  owner to postgres;