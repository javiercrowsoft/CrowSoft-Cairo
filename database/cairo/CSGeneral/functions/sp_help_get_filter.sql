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
-- Function: sp_productoventahelp()

-- drop function sp_help_get_filter(integer, varchar);

create or replace function sp_help_get_filter
(
  in p_bFilterType integer,
  in p_filter varchar
)
  returns varchar as
$BODY$
begin

  /*
  HelpFilterBeginLike = 1
  HelpFilterHaveTo = 2
  HelpFilterWildcard = 3
  HelpFilterEndLike = 4
  HelpFilterIsLike = 5
  */
   case p_bFilterType 
      when 1 then p_filter := p_filter || '%';
      when 3 then p_filter := replace(p_filter, '*', '%');
      when 4 then p_filter := '%' || p_filter;
      when 5 then p_filter := p_filter;
      -- Default
      -- case 2 then '%' + @@filter + '%'
      else p_filter := '%' || p_filter || '%';
   end case;

   return p_filter;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_help_get_filter(integer, varchar)
  owner to postgres;