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
-- Function: add_months(timestamp with time zone, integer)

-- drop function add_months(timestamp with time zone, integer);

create or replace function add_months(p_date timestamp with time zone, p_interval_val integer)
  returns timestamp with time zone as
$BODY$
begin
    return (p_date + (p_interval_val * '1 month'::INTERVAL));
end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function add_months(timestamp with time zone, integer)
  owner to postgres;
