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
-- Function: sp_cuentahelpcliente()

-- drop function sp_cuentahelpcliente(integer, integer, integer, varchar, integer, integer, varchar);

create or replace function sp_cuentahelpcliente
(
  in p_emp_id integer ,
  in p_us_id integer ,
  in p_bForAbm integer ,
  in p_filter varchar default '' ,
  in p_check integer default 0 ,
  in p_cue_id integer default 0 ,
  in p_filter2 varchar default '',
  out rtn refcursor
)
  returns refcursor as
$BODY$
begin
   
  

         rtn := sp_cuentaHelpCairo(p_emp_id,
                                          p_us_id,
                                          p_bForAbm,
                                          p_filter,
                                          p_check,
                                          p_cue_id,
                                          p_filter2);        
end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function sp_cuentahelpcliente(integer, integer, integer, varchar, integer, integer, varchar)
  owner to postgres;