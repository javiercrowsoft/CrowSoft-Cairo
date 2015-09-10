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
-- Function: sp_helpgetfilter()

-- drop function sp_helpgetfilter();

create or replace function sp_helpgetfilter(
  in p_bFilterType integer,
  in p_filter varchar)
  returns varchar as
$BODY$
declare
   
begin

  --/////////////////////////////////////////////////////////////////////////////////////
  /*
  Public Const c_HelpFilterBeginLike = 1
  Public Const c_HelpFilterHaveTo = 2
  Public Const c_HelpFilterWildcard = 3
  Public Const c_HelpFilterEndLike = 4
  Public Const c_HelpFilterIsLike = 5
  */
  return case p_bFilterType
                 when 1 then p_filter || '%'
                 when 3 then REPLACE(p_filter, '*', '%')
                 when 4 then '%' || p_filter
                 when 5 then p_filter
                 -- Default
                 -- case 2 then '%' + @@filter + '%'
                 else '%' || p_filter || '%'
         end;
   --/////////////////////////////////////////////////////////////////////////////////////
           
end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_helpgetfilter(integer, varchar)
  owner to postgres;