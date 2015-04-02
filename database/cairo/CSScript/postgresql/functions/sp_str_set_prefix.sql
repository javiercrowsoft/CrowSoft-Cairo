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
-- Function: sp_strSetPrefix()

-- drop function sp_strSetPrefix();

create or replace function sp_strsetprefix
(
  in p_prefix varchar,
  in p_campos varchar
)
returns varchar as
$BODY$
declare
   v_retval varchar(5000);
   v_campo varchar(5000);
   v_caracter varchar(1);
   v_i integer;
   v_j integer;
   v_z integer;
   v_q integer;
   v_r integer;
   v_t integer;
   v_p integer;
   v_work_done boolean;
begin

   v_i := 1;

   v_j := 0;

   v_p := 0;

   v_z := 0;

   v_retval := '';

   v_work_done := false;

   --------------------------------------------
   -- si no hay prefijo no toco los campos
   if p_prefix is null
     or p_prefix is null then
      RETURN '';

   end if;

   -- si no hay campos tampoco
   if p_campos is null
     or p_campos is null then
      RETURN '';

   end if;

   --------------------------------------------
   v_j := coalesce(INSTR(p_campos, ',', v_j + 1), 0);

   v_z := coalesce(INSTR(p_campos, '(', v_z + 1), 0);

   --------------------------------------------
   if v_j = 0 then
   begin
      if v_i < v_z then
      begin
         v_campo := LTRIM(p_campos);

         v_retval := v_retval || v_campo;

      end;
      else
         v_retval := sp_strGetRealName(p_prefix, p_campos);

      end if;

   end;
   else
   begin
      while v_j <> 0
      loop
         begin
            -- si hay un parentesis es por que hay un subselect, en cuyo caso no toco nada que este en
            -- el parentesis
            if v_i < v_z
              and v_z < v_j then
            begin
               --leeo caracter por caracter hasta encontrar el cierre del parentesis
               v_r := LENGTH(p_campos) + 1;

               v_t := v_z;

               while v_t < v_r
               loop
                  begin
                     v_caracter := SUBSTR(p_campos, v_t, 1);

                     -- si encuentro un parentesis abierto, incremento un contador para buscar uno cerrado
                     if v_caracter = '(' then
                        v_p := v_p + 1;

                     end if;

                     if v_caracter = ')' then
                     begin
                        v_p := v_p - 1;
                        
                        -- si encontre el cierre del primer parentesis termine con este campo
                        if v_p = 0 then
                           exit;

                        end if;

                     end;
                     end if;

                     v_t := v_t + 1;

                  end;
               end loop;

               -- ahora busco una coma a partir del ultimo parentesis
               v_j := INSTR(p_campos, ',', v_t);

               -- si la encuentro agrego el campo tal como esta a la sentencia
               if v_j > 0 then
               begin
                  v_campo := LTRIM(SUBSTR(p_campos, v_i, v_j - v_i + 1));

                  v_retval := v_retval || v_campo;

                  -- me preparo para buscar la proxima coma
                  v_i := v_j + 1;

                  v_j := INSTR(p_campos, ',', v_j + 1);

                  v_z := INSTR(p_campos, '(', v_i + 1);

               end;
               -- si no encuentro la coma es porque se terminaron los campos, asi que
               -- agrego el campo a la sentencia y termine
               else
               begin
                  v_campo := LTRIM(SUBSTR(p_campos, v_i, LENGTH(p_campos)));

                  v_retval := v_retval || v_campo;

                  -- con esto voy al final
                  v_work_done:= true;
                  exit;

               end;
               end if;

            end;
            else
            begin
               v_campo := LTRIM(SUBSTR(p_campos, v_i, v_j - v_i + 1));

               v_campo:= sp_strGetRealName(p_prefix, v_campo);

               v_retval := v_retval || v_campo;

               v_i := v_j + 1;

               v_j := INSTR(p_campos, ',', v_j + 1);

               -- busco el proximo parentesis
               v_z := INSTR(p_campos, '(', v_i + 1);

            end;
            end if;

         end;
      end loop;
      if not v_work_done then
        begin
              if v_i < v_z then
              begin
                 --leeo caracter por caracter hasta encontrar el cierre del parentesis
                 v_r := LENGTH(p_campos) + 1;

                 v_t := v_z;

                 while v_t < v_r
                 loop
                    begin
                       v_caracter := SUBSTR(p_campos, v_t, 1);

                       -- si encuentro un parentesis abierto, incremento un contador para buscar uno cerrado
                       if v_caracter = '(' then
                          v_p := v_p + 1;

                       end if;

                       if v_caracter = ')' then
                       begin
                          v_p := v_p - 1;
                          
                          -- si encontre el cierre del primer parentesis termine con este campo
                          if v_p = 0 then
                             exit;

                          end if;

                       end;
                       end if;

                       v_t := v_t + 1;

                    end;
                 end loop;

                 v_campo := LTRIM(SUBSTR(p_campos, v_i, LENGTH(p_campos)));

                 v_retval := v_retval || v_campo;

              end;
              else
              begin
                 v_campo := LTRIM(SUBSTR(p_campos, v_i, LENGTH(p_campos)));

                 v_campo:= sp_strGetRealName(p_prefix, v_campo);

                 v_retval := v_retval || v_campo;

              end;
              end if;
        end;
      end if;
   end;
   end if;

   --------------------------------------------
   RETURN sp_strReplaceEqualsWithAs(v_retval);

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_strsetprefix(varchar, varchar)
  owner to postgres;