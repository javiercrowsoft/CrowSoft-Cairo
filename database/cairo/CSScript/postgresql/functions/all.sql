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
-- Function: dateadd(character varying, integer, timestamp with time zone)

-- drop function dateadd(character varying, integer, timestamp with time zone);

create or replace function dateadd(p_interval character varying, p_interval_val integer, p_date timestamp with time zone)
  returns timestamp with time zone as
$BODY$
declare
    v_ucase_interval varchar(10);
    v_date timestamp with time zone;
begin
    v_date := p_date;
    v_ucase_interval := UPPER(p_interval);
      
    if v_ucase_interval in ('YEAR', 'YY', 'YYYY')
    then
      RETURN add_months(v_date, p_interval_val * 12);
      
    ELSif v_ucase_interval in ('QUARTER', 'QQ', 'Q')
    then
      RETURN add_months(v_date, p_interval_val * 3);
      
    ELSif v_ucase_interval in ('MONTH', 'MM', 'M')
    then
      RETURN add_months(v_date, p_interval_val);
      
    ElSif v_ucase_interval in ('DAYOFYEAR', 'DY', 'Y', 'DAY', 'DD', 'D', 'WEEKDAY', 'DW', 'W')
    then
      RETURN v_date + (p_interval_val * '1 day'::interval);
      
    ElSif v_ucase_interval in ('WEEK', 'WK', 'WW')
    then
      RETURN v_date + (p_interval_val * 7 * '1 day'::interval);
      
    ElSif v_ucase_interval in ('HOUR', 'HH')
    then
      RETURN v_date + (p_interval_val * '1 hour'::interval);
      
    ElSif v_ucase_interval in ('MINUTE', 'MI', 'N')
    then
      RETURN v_date + (p_interval_val * '1 minute'::interval);
      
    ElSif v_ucase_interval in ('SECOND', 'SS', 'S')
    then
      RETURN v_date + (p_interval_val * '1 second'::interval);
      
    ElSif v_ucase_interval in ('MILLISECOND', 'MS')
    then
      RETURN v_date + (p_interval_val * '1 millisecond'::interval);
      
    else
      RETURN null;
    end if;
end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function dateadd(character varying, integer, timestamp with time zone)
  owner to postgres;

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
-- Function: getdate()

-- drop function getdate();

create or replace function getdate()
  returns timestamp with time zone as
'select now()'
  language sql STABLE
  cost 100;
alter function getdate()
  owner to postgres;
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
-- Function: isnumeric(integer)

-- drop function isnumeric(integer);

create or replace function isnumeric(param integer)
  returns smallint as
$BODY$
begin
	return -1;
end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function isnumeric(integer)
  owner to postgres;
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
-- Function: isnumeric(character varying)

-- drop function isnumeric(character varying);

create or replace function isnumeric(param character varying)
  returns smallint as
$BODY$
begin
	if (param ~ E'^[-+]?\\d*\\.?\\d+(?:[eE][-+]?\\d+)?$') then
		return -1;
	else
		return 0;
	end if;
end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function isnumeric(character varying)
  owner to postgres;

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
-- Function: sp_arbconvertid(character varying)

-- drop function sp_arbconvertid(character varying);

create or replace function sp_arbconvertid(in p_id character varying, out p_hoja_id integer, out p_ram_id integer)
  returns record as
$BODY$
declare
begin

   p_hoja_id := 0;

   p_ram_id := 0;

   if SUBSTR(p_id, 1, 1) = 'n' then-- esto significa que es un nodo
   
      p_ram_id := to_number(SUBSTR(p_id, 2, LENGTHB(p_id) - 1));

   else
      p_hoja_id := to_number(p_id);

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_arbconvertid(character varying)
  owner to postgres;
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
-- Function: sp_arbgetallhojas(integer, integer, integer)

-- drop function sp_arbgetallhojas(integer, integer, integer);

create or replace function sp_arbgetallhojas(p_ram_id integer, p_clienteid integer, p_tblidalias integer)
  returns void as
$BODY$
declare
   v_tot2 integer;
   v_tot1 integer;
   v_n integer;
begin

   create temporary table tt_t_rama
   (
     ram_id integer  not null,
     N integer  not null
   ) on commit drop;

   if p_ram_id = 0 then
      RETURN;
   end if;

   if p_clienteId = 0 then
      raise exception '@@ERROR_SP:El procedimiento almacenado sp_ArbGetAllHojas no puede ser llamado para obtener un cursor. Se debe usar sp_ArbGetAllHojasRs.';
      RETURN;
   end if;
	 
   v_tot1 := -1;

   v_tot2 := 0;

   v_n := 1;

   insert into tt_t_rama ( ram_id, N )
                  values ( p_ram_id, 0 );

   while v_tot1 < v_tot2
   loop
      begin
         v_tot1 := v_tot2;

         insert into tt_t_rama
           ( ram_id, N )
           ( select r.ram_id,
                    v_n
             from Rama r,
                  tt_t_rama t
                where r.ram_id_padre = t.ram_id
                        and t.N = v_n - 1
                        and r.ram_id <> t.ram_id );

         select COUNT(*)
         into v_tot2
         from tt_t_rama;

         v_n := v_n + 1;

      end;
   end loop;

   if p_clienteId <> 0 then
   declare
      v_tbl_id integer;
   begin
      select tbl_id
        into v_tbl_id
      from Arbol inner join Rama on Arbol.arb_id = Rama.arb_id
      where Rama.ram_id = p_ram_id;

      if p_tblIdAlias <> 0 then
         v_tbl_id := p_tblIdAlias;
      end if;

      insert into rptArbolRamaHoja
        ( rptarb_cliente, rptarb_hojaid, tbl_id, ram_id )
        ( select DISTINCT p_clienteId,
                          h.id,
                          v_tbl_id,
                          t.ram_id
          from Hoja h inner join tt_t_rama t on h.ram_id = t.ram_id );

   end;
   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_arbgetallhojas(integer, integer, integer)
  owner to postgres;
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
-- Function: sp_arbisraiz(integer)

-- drop function sp_arbisraiz(integer);

create or replace function sp_arbisraiz(in p_ram_id integer, out p_israiz smallint)
  returns smallint as
$BODY$
declare
   v_temp integer := 0;
begin

   begin
      select count(*) into v_temp
      from Rama
         where ram_id = p_ram_id
                 and ram_id_padre = 0;
   exception
      when others then
         null;
         raise info 'puto';
   end;

   -- Verifico que se trate de una raiz
   if v_temp = 1 then
      p_IsRaiz := 1::smallint;

   else
      p_IsRaiz := 0::smallint;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_arbisraiz(integer)
  owner to postgres;
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
-- Function: sp_cfg_getValor(character varying, character varying, smallint, integer)

-- drop function sp_cfg_getValor(character varying, character varying, smallint, integer);

create or replace function sp_cfg_getValor(in p_cfg_grupo character varying, in p_cfg_aspecto character varying, out p_cfg_valor character varying, in p_bshow smallint, in p_emp_id integer)
  returns character varying as
$BODY$
begin

   if p_bShow <> 0 then
    raise exception '@@ERROR_SP:El procedimiento almacenado sp_cfg_getValor no puede ser llamado para obtener un cursor. Se debe usar sp_cfg_getValorRs.';
		RETURN;
   end if;

   select cfg_valor
     into p_cfg_valor
     from Configuracion
      where cfg_grupo = p_cfg_grupo
              and cfg_aspecto = p_cfg_aspecto
              and ( emp_id = p_emp_id
              or ( emp_id is null
              and p_emp_id is null ) );
end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_cfg_getValor(character varying, character varying, smallint, integer)
  owner to postgres;
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
-- Function: sp_cfg_getValorrs(character varying, character varying, smallint, integer)

-- drop function sp_cfg_getValorrs(character varying, character varying, smallint, integer);

create or replace function sp_cfg_getValorrs(in p_cfg_grupo character varying, in p_cfg_aspecto character varying, out p_cfg_valor character varying, in p_bshow smallint, in p_emp_id integer, out rtn refcursor)
  returns record as
$BODY$
begin

   select cfg_valor
     into p_cfg_valor
     from Configuracion
      where cfg_grupo = p_cfg_grupo
              and cfg_aspecto = p_cfg_aspecto
              and ( emp_id = p_emp_id
              or ( emp_id is null
              and p_emp_id is null ) );

   if p_bShow <> 0 then
      open rtn for
         select p_cfg_valor
           from DUAL ;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_cfg_getValorrs(character varying, character varying, smallint, integer)
  owner to postgres;
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
-- Function: sp_dbgetnewid2(character varying, character varying, integer, integer, smallint)

-- drop function sp_dbgetnewid2(character varying, character varying, integer, integer, smallint);

create or replace function sp_dbgetnewid2(in p_tabla character varying, in p_pk character varying, in p_min integer, in p_max integer, out p_id integer, in p_bselect smallint)
  returns integer as
$BODY$
begin

   if p_bselect <> 0 then
      raise exception '@@ERROR_SP:El procedimiento almacenado SP_DBGetNewId2 no puede ser llamado para obtener un cursor. Se debe usar SP_DBGetNewId2Rs.';
			RETURN;
   end if;

   select max(Id_NextId)
     into p_id
     from Id
      where Id_Tabla = p_tabla
              and Id_CampoId = p_pk
              and Id_Rango = p_min;

   -- si no existe en la tabla
   if coalesce(p_id, 0) = 0 then
   declare
      v_sqlstmt varchar(5000);
   begin
      v_sqlstmt := 'insert into Id (Id_Tabla, Id_NextId, Id_CampoId, Id_Rango) select '''
                    || p_tabla || 
                    ''',coalesce(max(to_number(' || p_pk || ')),0)+1, ''' 
                    || p_pk || ''',' 
                    || to_char(p_min) || 
                    ' from ' || p_tabla ||
                    ' where isnumeric(' || p_pk || ')<>0 and (to_number(' || p_pk || ') >= '
                    || to_char(p_min) 
                    || ' and ' || ' to_number(' || p_pk || ') <= ' || to_char(p_max) || ')';

      EXECUTE v_sqlstmt;

      select max(Id_NextId)
        into p_id
        from Id
         where Id_Tabla = p_tabla
                 and Id_CampoId = p_pk
                 and Id_Rango = p_min;

   end;
   end if;

   p_id := coalesce(p_id, 0);

   if p_id = 0 then
      p_id := p_min;

   end if;

   if p_id < p_min then
      p_id := p_min;

   end if;

   if p_id > p_max then
      p_id := p_max;

   end if;

   update id
      set Id_NextId = p_id + 1
      where Id_Tabla = p_tabla
     and Id_CampoId = p_pk
     and Id_Rango = p_min;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_dbgetnewid2(character varying, character varying, integer, integer, smallint)
  owner to postgres;
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
-- Function: sp_getrptid()

-- drop function sp_getrptid();

create or replace function sp_getrptid(out p_clienteid integer)
  returns integer as
$BODY$
declare
begin

   select id_NextId
     into p_ClienteID
     from Id
      where Id_Tabla = 'rptArbolRamaHoja'
              and id_CampoId = 'rptarb_cliente';

   if coalesce(p_ClienteID, 0) = 0 then
   begin
      insert into id
        ( id_NextId, id_Tabla, id_CampoId )
        values ( 0, 'rptArbolRamaHoja', 'rptarb_cliente' );

      p_ClienteID := 1;

   end;
   end if;

   update id
      set id_NextId = p_ClienteID + 1
      where Id_Tabla = 'rptArbolRamaHoja'
     and id_CampoId = 'rptarb_cliente';

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_getrptid()
  owner to postgres;
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
-- Function: to_char(integer)

-- drop function to_char(integer);

create or replace function to_char(param integer)
  returns varchar as
$BODY$
begin
	return to_char(param,'9999999999999');
end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function to_char(integer)
  owner to postgres;
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

Created by Javiers

http://www.crowsoft.com.ars

javier at crowsoft.com.ar
*/
-- Function: to_number(integer)

-- drop function to_number(integer);

create or replace function to_number(param integer)
  returns integer as
$BODY$
begin
	return param;
end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function to_number(integer)
  owner to postgres;
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
-- Function: to_number(character varying)

-- drop function to_number(character varying);

create or replace function to_number(param character varying)
  returns integer as
$BODY$
begin
	return to_number(param, '999999999');
end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function to_number(character varying)
  owner to postgres;
