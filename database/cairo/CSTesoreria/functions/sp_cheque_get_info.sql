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
-- Function: sp_cheque_get_info()

-- drop function sp_cheque_get_info(integer);

create or replace function sp_cheque_get_info
/*
    select * from cheque limit 10;
    select * from sp_cheque_get_info(13689);
*/
(
  in p_cheq_id integer,

  out p_bco_name varchar,
  out p_cue_name varchar,
  out p_cli_name varchar,
  out p_cle_name varchar,
  out p_bco_id int,
  out p_cue_id int,
  out p_fechavto timestamp with time zone,
  out p_fechacobro timestamp with time zone,
  out p_importe decimal(18,6),
  out p_importeorigen decimal(18,6)
)
  returns record as
$BODY$
declare
begin

    select
       bco_nombre,
       cue_nombre,
       cli_nombre,
       cle_nombre,
       Cheque.bco_id,
       Cheque.cue_id,
       cheq_fechavto,
       cheq_fechacobro,
       cheq_importe,
       cheq_importeorigen
       into
       p_bco_name,
       p_cue_name,
       p_cli_name,
       p_cle_name,
       p_bco_id,
       p_cue_id,
       p_fechavto,
       p_fechacobro,
       p_importe,
       p_importeorigen
    from Cheque
    inner join Banco   on Cheque.bco_id = Banco.bco_id
    inner join Cuenta  on Cheque.cue_id = Cuenta.cue_id
    left join Cliente  on Cheque.cli_id = Cliente.cli_id
    left join Clearing on Cheque.cle_id = Clearing.cle_id
    where cheq_id = p_cheq_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_cheque_get_info(integer)
  owner to postgres;