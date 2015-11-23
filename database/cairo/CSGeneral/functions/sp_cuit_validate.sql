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
-- Function: sp_cuit_validate()

-- drop function sp_cuit_validate(varchar);

create or replace function sp_cuit_validate
(
  in p_cuit varchar,
  out p_is_valid integer
)
  returns integer as
$BODY$
declare
   sum integer;
   rest integer;
   digit integer;
begin
      -- the word cuit is allowed as valid cuit
      --
      if p_cuit = 'cuit' then

         p_is_valid := 1;

      else

         if p_cuit = '' then

            p_is_valid := 0;

         else

            p_cuit := replace(p_cuit, '-', '');
            p_cuit := replace(p_cuit, '.', '');

            if length(trim(p_cuit)) <> 11 then

               p_is_valid := 0;

            else
               
               sum := to_number(substring(p_cuit, 1, 1)) * 5;
               sum := sum + to_number(substring(p_cuit, 2, 1)) * 4;
               sum := sum + to_number(substring(p_cuit, 3, 1)) * 3;
               sum := sum + to_number(substring(p_cuit, 4, 1)) * 2;
               sum := sum + to_number(substring(p_cuit, 5, 1)) * 7;
               sum := sum + to_number(substring(p_cuit, 6, 1)) * 6;
               sum := sum + to_number(substring(p_cuit, 7, 1)) * 5;
               sum := sum + to_number(substring(p_cuit, 8, 1)) * 4;
               sum := sum + to_number(substring(p_cuit, 9, 1)) * 3;
               sum := sum + to_number(substring(p_cuit, 10, 1)) * 2;
               rest := sum % 11;

               digit := 11 - rest;
               if digit = 11 then
                  digit := 0;
               end if;
               if digit = 10 then
                  digit := 1;
               end if;

               if digit <> to_number(substring(p_cuit, 11, 1)) then

                  p_is_valid := 0;

               else

                  p_is_valid := 1;

               end if;

            end if;

         end if;

      end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_cuit_validate(varchar)
  owner to postgres;