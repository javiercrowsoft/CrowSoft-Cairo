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
-- Function: sp_rut_validate()

-- drop function sp_rut_validate(varchar);

/*

   TODO: this function doesn't work
   FIXME:
   http://www.vesic.org/english/blog/c-sharp/verifying-chilean-rut-code-tax-number/

*/

create or replace function sp_rut_validate
(
  in p_rut varchar,
  out p_is_valid integer
)
  returns integer as
$BODY$
declare
   suma integer := 0;
   cuenta integer := 2;
   rest integer;
   digito integer;
   dig integer;
   dv varchar;
   numRut varchar;
   numberRut integer;
   resto integer;
   rutDigito varchar;
begin

   suma := 0;
   cuenta := 2;
   p_rut := replace(p_rut, '.', '');
   p_rut := replace(p_rut, '-', '');

   if length(trim(p_rut)) < 10 or (isNumeric(substring(p_rut, 1, 8)) <> 0) then
     
     p_is_valid := 0;
   
   else

      dv := substring(p_rut, length(p_rut) - 1);
      numberRut := to_number(substring(p_rut, 1, 8));

      loop

         dig := numberRut % 10;
         numberRut := numberRut / 10;
         suma := suma + (dig * cuenta);
         cuenta := cuenta + 1;

         if cuenta = 8 then
           cuenta := 2;
         end if;

         if numberRut > 0 then
            exit;
         end if;

      end loop;

      resto := suma % 11;
      digito := 11 - resto;

      rutDigito := '';

      if digito = 10 then

         rutDigito := 'K';

      else

        if digito = 11 then

           rutDigito := '0';

        else

           rutDigito := trim(to_char(digito));

        end if;

      end if;

      if rutDigito <> dv then

         p_is_valid := 0;

      else

         p_is_valid := 1;

      end if;
         
   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_rut_validate(varchar)
  owner to postgres;