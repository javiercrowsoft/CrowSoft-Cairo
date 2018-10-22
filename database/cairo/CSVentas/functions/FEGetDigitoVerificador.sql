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
-- Function: FEGetDigitoVerificador(character varying)

-- drop function FEGetDigitoVerificador(character varying);

-- select FEGetDigitoVerificador('01234567890')

create or replace function FEGetDigitoVerificador(
   in p_codigo_barra varchar
)
returns integer as
$BODY$
declare
	v_sumImpar integer;
	v_sumPar integer;
	v_n integer;
begin

/*
    Se considera para efectuar el cálculo el siguiente ejemplo:

    01234567890

    Etapa 1: Comenzar desde la izquierda, sumar todos los caracteres ubicados en las posiciones impares.

    0 + 2 + 4 + 6 + 8 + 0 = 20

    Etapa 2: Multiplicar la suma obtenida en la etapa 1 por el número 3.

    20 x 3 = 60

    Etapa 3: Comenzar desde la izquierda, sumar todos los caracteres que están ubicados en las posiciones pares.

    1 + 3 + 5+ 7 + 9 = 25

    Etapa 4: Sumar los resultados obtenidos en las etapas 2 y 3.

    60 + 25 = 85

    Etapa 5: Buscar el menor número que sumado al resultado obtenido en la etapa 4 dé un número múltiplo de 10. 
    Este será el valor del dígito verificador del módulo 10.

    85 + 5 = 90

    De esta manera se llega a que el número 5 es el dígito verificador módulo 10 para el código 01234567890

    Siendo el resultado final:

    012345678905
*/

   v_sumImpar := 0;
   v_sumPar := 0;

   v_n := 1;

   --Etapa 1: Comenzar desde la izquierda, sumar todos los caracteres ubicados en las posiciones impares.

   while v_n <= length(p_codigo_barra)
   loop

      v_sumImpar := v_sumImpar + to_number(substring(p_codigo_barra,v_n,1));

      v_n := v_n + 2;
   end loop;

   --Etapa 2: Multiplicar la suma obtenida en la etapa 1 por el número 3.

   v_sumImpar := v_sumImpar * 3;

   --Etapa 3: Comenzar desde la izquierda, sumar todos los caracteres que están ubicados en las posiciones pares.

   v_n := 2;

   while v_n <= length(p_codigo_barra)
   loop

      v_sumPar := v_sumPar + to_number(substring(p_codigo_barra,v_n,1));

      v_n := v_n + 2;
   end loop;

   --Etapa 4: Sumar los resultados obtenidos en las etapas 2 y 3.

   v_n := v_sumImpar + v_sumPar;

   v_n := 10 - (v_n % 10);

   --Etapa 5: Buscar el menor número que sumado al resultado obtenido en la etapa 4 dé un número múltiplo de 10. Este será el valor del dígito verificador del módulo 10.

   return v_n;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function FEGetDigitoVerificador(varchar)
  owner to postgres;
