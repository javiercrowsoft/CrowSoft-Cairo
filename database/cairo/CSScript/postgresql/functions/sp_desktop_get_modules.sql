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
-- Function: sp_desktop_get_modules(integer)

-- drop function sp_desktop_get_modules(integer);

/*
select * from sp_desktop_get_modules(1);
fetch all from rtn;
*/

create or replace function sp_desktop_get_modules
(
  in p_us_id integer,
  out rtn refcursor
)
   returns refcursor as
$BODY$
begin

   rtn := 'rtn';

   open rtn for

      select distinct pre.pre_id,
                      pre.pre_nombreesc,
                      pre.pre_grupoesc,
                      '',
                      pre.sysm_id
      from sysModuloUser u
      join Prestacion pre
       on u.us_id = p_us_id
       and u.sysm_id = pre.sysm_id_security
       and ( pre.pre_id between 16000 and 16999
          or pre.pre_id between 3000 and 3999
          or pre.pre_id between 17000 and 17999
          or pre.pre_id between 19000 and 19999
          or pre.pre_id between 18000 and 18999
          or pre.pre_id between 22000 and 22499
          or pre.pre_id between 20000 and 20999
          or pre.pre_id between 15000 and 15999
          or pre.pre_id between 32000 and 32999
          or pre.pre_id between 37000 and 37999 )

      where pre.pre_nombreesc <> ''

      order by pre.pre_grupoesc,
               pre.pre_nombreesc;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_get_editable(integer, integer, integer, integer)
  owner to postgres;