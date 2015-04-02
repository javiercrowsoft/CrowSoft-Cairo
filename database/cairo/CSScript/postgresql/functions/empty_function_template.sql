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
create or replace function function_name (out/in parameter_name data_type, ...)
returns void/data_type as
$BODY$
declare
	var_name data_type;
begin

end;
$BODY$
  language plpgsql
;


-- to raise an exception

raise exception 'Error message';

-- temporary tables

...

begin

   create temporary table tt_t_rama
   (
     ram_id integer  not null,
     N integer  not null
   ) on commit drop;

...


-- to call a function from sql editor
--

select dc_csc_com_0010(
1,
(date '20000101'), -- dates can be pass ussing (date 'date value as string')
(date '20130101'),
'0', 
'0', 
'0', 
'0', 
0::smallint, -- smallint has to be explicit
'0',
0::smallint,
0::smallint,
0::smallint
);
fetch all from rtn;

-- to test regular expressions
http://www.gskinner.com/RegExr/

-- regular expression to replace calls to functions with out parameters
-- for
sp_ArbIsRaiz(v_ram_id_Sucursal, 
                                   v_IsRaiz);
-- gives
select sp_ArbIsRaiz(v_ram_id_Sucursal) into v_IsRaiz;
                                   
search: (sp_ArbIsRaiz\()([a-zA-Z0-9_]*\s*),\s*([a-zA-Z0-9_]*)\)

replace: select \1\2\) into \3

--////////

-- regular expression to replace calls to functions with out parameters
-- for
sp_ArbConvertId(p_prov_id,
			   v_prov_id,
			   v_ram_id_Proveedor);

-- gives

select sp_ArbConvertId(p_prov_id) into v_prov_id, v_ram_id_Proveedor;

search: (sp_ArbConvertId\()([a-zA-Z0-9_]*\s*),\s*([a-zA-Z0-9_]*),\s*([a-zA-Z0-9_]*)\)

replace: select \1\2\) into \3, \4