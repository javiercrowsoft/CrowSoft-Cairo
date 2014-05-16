/*
CrowSoft-Cairo
==============

ERP application written in Java (Tomcat + GWT) and Postgresql

Copyright (C) 2012  Javier Mariano Alvarez

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
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

-- DROP FUNCTION add_months(timestamp with time zone, integer);

CREATE OR REPLACE FUNCTION add_months(p_date timestamp with time zone, p_interval_val integer)
  RETURNS timestamp with time zone AS
$BODY$
BEGIN
    return (p_date + (p_interval_val * '1 month'::INTERVAL));
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION add_months(timestamp with time zone, integer)
  OWNER TO postgres;
/*
CrowSoft-Cairo
==============

ERP application written in Java (Tomcat + GWT) and Postgresql

Copyright (C) 2012  Javier Mariano Alvarez

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
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

-- DROP FUNCTION dateadd(character varying, integer, timestamp with time zone);

CREATE OR REPLACE FUNCTION dateadd(p_interval character varying, p_interval_val integer, p_date timestamp with time zone)
  RETURNS timestamp with time zone AS
$BODY$
DECLARE
    v_ucase_interval varchar(10);
    v_date timestamp with time zone;
BEGIN
    v_date := p_date;
    v_ucase_interval := UPPER(p_interval);
      
    IF v_ucase_interval IN ('YEAR', 'YY', 'YYYY') 
    THEN
      RETURN add_months(v_date, p_interval_val * 12);
      
    ELSIF v_ucase_interval IN ('QUARTER', 'QQ', 'Q') 
    THEN
      RETURN add_months(v_date, p_interval_val * 3);
      
    ELSIF v_ucase_interval IN ('MONTH', 'MM', 'M') 
    THEN
      RETURN add_months(v_date, p_interval_val);
      
    ElSIF v_ucase_interval IN ('DAYOFYEAR', 'DY', 'Y', 'DAY', 'DD', 'D', 'WEEKDAY', 'DW', 'W') 
    THEN
      RETURN v_date + (p_interval_val * '1 day'::interval);
      
    ElSIF v_ucase_interval IN ('WEEK', 'WK', 'WW') 
    THEN
      RETURN v_date + (p_interval_val * 7 * '1 day'::interval);
      
    ElSIF v_ucase_interval IN ('HOUR', 'HH') 
    THEN
      RETURN v_date + (p_interval_val * '1 hour'::interval);
      
    ElSIF v_ucase_interval IN ('MINUTE', 'MI', 'N') 
    THEN
      RETURN v_date + (p_interval_val * '1 minute'::interval);
      
    ElSIF v_ucase_interval IN ('SECOND', 'SS', 'S') 
    THEN
      RETURN v_date + (p_interval_val * '1 second'::interval);
      
    ElSIF v_ucase_interval IN ('MILLISECOND', 'MS') 
    THEN
      RETURN v_date + (p_interval_val * '1 millisecond'::interval);
      
    ELSE
      RETURN NULL;
    END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION dateadd(character varying, integer, timestamp with time zone)
  OWNER TO postgres;

/*
CrowSoft-Cairo
==============

ERP application written in Java (Tomcat + GWT) and Postgresql

Copyright (C) 2012  Javier Mariano Alvarez

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
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

-- DROP FUNCTION getdate();

CREATE OR REPLACE FUNCTION getdate()
  RETURNS timestamp with time zone AS
'select now()'
  LANGUAGE sql STABLE
  COST 100;
ALTER FUNCTION getdate()
  OWNER TO postgres;
/*
CrowSoft-Cairo
==============

ERP application written in Java (Tomcat + GWT) and Postgresql

Copyright (C) 2012  Javier Mariano Alvarez

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
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

-- DROP FUNCTION isnumeric(integer);

CREATE OR REPLACE FUNCTION isnumeric(param integer)
  RETURNS smallint AS
$BODY$
begin
	return -1;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION isnumeric(integer)
  OWNER TO postgres;
/*
CrowSoft-Cairo
==============

ERP application written in Java (Tomcat + GWT) and Postgresql

Copyright (C) 2012  Javier Mariano Alvarez

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
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

-- DROP FUNCTION isnumeric(character varying);

CREATE OR REPLACE FUNCTION isnumeric(param character varying)
  RETURNS smallint AS
$BODY$
begin
	if (param ~ E'^[-+]?\\d*\\.?\\d+(?:[eE][-+]?\\d+)?$') then
		return -1;
	else
		return 0;
	end if;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION isnumeric(character varying)
  OWNER TO postgres;

/*
CrowSoft-Cairo
==============

ERP application written in Java (Tomcat + GWT) and Postgresql

Copyright (C) 2012  Javier Mariano Alvarez

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
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

-- DROP FUNCTION sp_arbconvertid(character varying);

CREATE OR REPLACE FUNCTION sp_arbconvertid(IN p_id character varying, OUT p_hoja_id integer, OUT p_ram_id integer)
  RETURNS record AS
$BODY$
DECLARE
BEGIN

   p_hoja_id := 0;

   p_ram_id := 0;

   IF SUBSTR(p_id, 1, 1) = 'n' THEN-- esto significa que es un nodo
   
      p_ram_id := to_number(SUBSTR(p_id, 2, LENGTHB(p_id) - 1));

   ELSE
      p_hoja_id := to_number(p_id);

   END IF;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_arbconvertid(character varying)
  OWNER TO postgres;
/*
CrowSoft-Cairo
==============

ERP application written in Java (Tomcat + GWT) and Postgresql

Copyright (C) 2012  Javier Mariano Alvarez

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
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

-- DROP FUNCTION sp_arbgetallhojas(integer, integer, integer);

CREATE OR REPLACE FUNCTION sp_arbgetallhojas(p_ram_id integer, p_clienteid integer, p_tblidalias integer)
  RETURNS void AS
$BODY$
DECLARE
   v_tot2 integer;
   v_tot1 integer;
   v_n integer;
BEGIN

   CREATE TEMPORARY TABLE tt_t_rama
   (
     ram_id integer  NOT NULL,
     N integer  NOT NULL
   ) ON COMMIT DROP;

   IF p_ram_id = 0 THEN
      RETURN;
   END IF;

   IF p_clienteId = 0 THEN
      RAISE EXCEPTION '@@ERROR_SP:El procedimiento almacenado sp_ArbGetAllHojas no puede ser llamado para obtener un cursor. Se debe usar sp_ArbGetAllHojasRs.';
      RETURN;
   END IF;
	 
   v_tot1 := -1;

   v_tot2 := 0;

   v_n := 1;

   INSERT INTO tt_t_rama ( ram_id, N )
                  VALUES ( p_ram_id, 0 );

   WHILE v_tot1 < v_tot2
   LOOP
      BEGIN
         v_tot1 := v_tot2;

         INSERT INTO tt_t_rama
           ( ram_id, N )
           ( SELECT r.ram_id,
                    v_n
             FROM Rama r,
                  tt_t_rama t
                WHERE r.ram_id_padre = t.ram_id
                        AND t.N = v_n - 1
                        AND r.ram_id <> t.ram_id );

         SELECT COUNT(*)
         INTO v_tot2
         FROM tt_t_rama;

         v_n := v_n + 1;

      END;
   END LOOP;

   IF p_clienteId <> 0 THEN
   DECLARE
      v_tbl_id integer;
   BEGIN
      SELECT tbl_id
        INTO v_tbl_id
      FROM Arbol INNER JOIN Rama ON Arbol.arb_id = Rama.arb_id
      WHERE Rama.ram_id = p_ram_id;

      IF p_tblIdAlias <> 0 THEN
         v_tbl_id := p_tblIdAlias;
      END IF;

      INSERT INTO rptArbolRamaHoja
        ( rptarb_cliente, rptarb_hojaid, tbl_id, ram_id )
        ( SELECT DISTINCT p_clienteId,
                          h.id,
                          v_tbl_id,
                          t.ram_id
          FROM Hoja h INNER JOIN tt_t_rama t ON h.ram_id = t.ram_id );

   END;
   END IF;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_arbgetallhojas(integer, integer, integer)
  OWNER TO postgres;
/*
CrowSoft-Cairo
==============

ERP application written in Java (Tomcat + GWT) and Postgresql

Copyright (C) 2012  Javier Mariano Alvarez

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
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

-- DROP FUNCTION sp_arbisraiz(integer);

CREATE OR REPLACE FUNCTION sp_arbisraiz(IN p_ram_id integer, OUT p_israiz smallint)
  RETURNS smallint AS
$BODY$
DECLARE
   v_temp integer := 0;
BEGIN

   BEGIN
      SELECT count(*) INTO v_temp
      FROM Rama
         WHERE ram_id = p_ram_id
                 AND ram_id_padre = 0;
   EXCEPTION
      WHEN OTHERS THEN
         NULL;
         raise info 'puto';
   END;

   -- Verifico que se trate de una raiz
   IF v_temp = 1 THEN
      p_IsRaiz := 1::smallint;

   ELSE
      p_IsRaiz := 0::smallint;

   END IF;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_arbisraiz(integer)
  OWNER TO postgres;
/*
CrowSoft-Cairo
==============

ERP application written in Java (Tomcat + GWT) and Postgresql

Copyright (C) 2012  Javier Mariano Alvarez

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

========================================================================

Created by Javier

http://www.crowsoft.com.ar

javier at crowsoft.com.ar
*/
-- Function: sp_cfg_getvalor(character varying, character varying, smallint, integer)

-- DROP FUNCTION sp_cfg_getvalor(character varying, character varying, smallint, integer);

CREATE OR REPLACE FUNCTION sp_cfg_getvalor(IN p_cfg_grupo character varying, IN p_cfg_aspecto character varying, OUT p_cfg_valor character varying, IN p_bshow smallint, IN p_emp_id integer)
  RETURNS character varying AS
$BODY$
BEGIN

   IF p_bShow <> 0 THEN
    RAISE EXCEPTION '@@ERROR_SP:El procedimiento almacenado sp_Cfg_GetValor no puede ser llamado para obtener un cursor. Se debe usar sp_Cfg_GetValorRs.';
		RETURN;
   END IF;

   SELECT cfg_valor
     INTO p_cfg_valor
     FROM Configuracion
      WHERE cfg_grupo = p_cfg_grupo
              AND cfg_aspecto = p_cfg_aspecto
              AND ( emp_id = p_emp_id
              OR ( emp_id IS NULL
              AND p_emp_id IS NULL ) );
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_cfg_getvalor(character varying, character varying, smallint, integer)
  OWNER TO postgres;
/*
CrowSoft-Cairo
==============

ERP application written in Java (Tomcat + GWT) and Postgresql

Copyright (C) 2012  Javier Mariano Alvarez

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

========================================================================

Created by Javier

http://www.crowsoft.com.ar

javier at crowsoft.com.ar
*/
-- Function: sp_cfg_getvalorrs(character varying, character varying, smallint, integer)

-- DROP FUNCTION sp_cfg_getvalorrs(character varying, character varying, smallint, integer);

CREATE OR REPLACE FUNCTION sp_cfg_getvalorrs(IN p_cfg_grupo character varying, IN p_cfg_aspecto character varying, OUT p_cfg_valor character varying, IN p_bshow smallint, IN p_emp_id integer, OUT rtn refcursor)
  RETURNS record AS
$BODY$
BEGIN

   SELECT cfg_valor
     INTO p_cfg_valor
     FROM Configuracion
      WHERE cfg_grupo = p_cfg_grupo
              AND cfg_aspecto = p_cfg_aspecto
              AND ( emp_id = p_emp_id
              OR ( emp_id IS NULL
              AND p_emp_id IS NULL ) );

   IF p_bShow <> 0 THEN
      OPEN rtn FOR
         SELECT p_cfg_valor
           FROM DUAL ;

   END IF;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_cfg_getvalorrs(character varying, character varying, smallint, integer)
  OWNER TO postgres;
/*
CrowSoft-Cairo
==============

ERP application written in Java (Tomcat + GWT) and Postgresql

Copyright (C) 2012  Javier Mariano Alvarez

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
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

-- DROP FUNCTION sp_dbgetnewid2(character varying, character varying, integer, integer, smallint);

CREATE OR REPLACE FUNCTION sp_dbgetnewid2(IN p_tabla character varying, IN p_pk character varying, IN p_min integer, IN p_max integer, OUT p_id integer, IN p_bselect smallint)
  RETURNS integer AS
$BODY$
BEGIN

   IF p_bSelect <> 0 THEN
      RAISE EXCEPTION '@@ERROR_SP:El procedimiento almacenado SP_DBGetNewId2 no puede ser llamado para obtener un cursor. Se debe usar SP_DBGetNewId2Rs.';
			RETURN;
   END IF;

   SELECT MAX(Id_NextId)
     INTO p_id
     FROM Id
      WHERE Id_Tabla = p_tabla
              AND Id_CampoId = p_pk
              AND Id_Rango = p_min;

   -- si no existe en la tabla
   IF coalesce(p_id, 0) = 0 THEN
   DECLARE
      v_sqlstmt varchar(5000);
   BEGIN
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

      SELECT MAX(Id_NextId)
        INTO p_id
        FROM Id
         WHERE Id_Tabla = p_tabla
                 AND Id_CampoId = p_pk
                 AND Id_Rango = p_min;

   END;
   END IF;

   p_id := coalesce(p_id, 0);

   IF p_id = 0 THEN
      p_id := p_min;

   END IF;

   IF p_id < p_min THEN
      p_id := p_min;

   END IF;

   IF p_id > p_max THEN
      p_id := p_max;

   END IF;

   UPDATE id
      SET Id_NextId = p_id + 1
      WHERE Id_Tabla = p_tabla
     AND Id_CampoId = p_pk
     AND Id_Rango = p_min;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_dbgetnewid2(character varying, character varying, integer, integer, smallint)
  OWNER TO postgres;
/*
CrowSoft-Cairo
==============

ERP application written in Java (Tomcat + GWT) and Postgresql

Copyright (C) 2012  Javier Mariano Alvarez

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
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

-- DROP FUNCTION sp_getrptid();

CREATE OR REPLACE FUNCTION sp_getrptid(OUT p_clienteid integer)
  RETURNS integer AS
$BODY$
DECLARE
BEGIN

   SELECT id_NextId
     INTO p_ClienteID
     FROM Id
      WHERE Id_Tabla = 'rptArbolRamaHoja'
              AND id_CampoId = 'rptarb_cliente';

   IF coalesce(p_ClienteID, 0) = 0 THEN
   BEGIN
      INSERT INTO id
        ( id_NextId, id_Tabla, id_CampoId )
        VALUES ( 0, 'rptArbolRamaHoja', 'rptarb_cliente' );

      p_ClienteID := 1;

   END;
   END IF;

   UPDATE id
      SET id_NextId = p_ClienteID + 1
      WHERE Id_Tabla = 'rptArbolRamaHoja'
     AND id_CampoId = 'rptarb_cliente';

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_getrptid()
  OWNER TO postgres;
/*
CrowSoft-Cairo
==============

ERP application written in Java (Tomcat + GWT) and Postgresql

Copyright (C) 2012  Javier Mariano Alvarez

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
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

-- DROP FUNCTION to_char(integer);

CREATE OR REPLACE FUNCTION to_char(param integer)
  RETURNS varchar AS
$BODY$
begin
	return to_char(param,'9999999999999');
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION to_char(integer)
  OWNER TO postgres;
/*
CrowSoft-Cairo
==============

ERP application written in Java (Tomcat + GWT) and Postgresql

Copyright (C) 2012  Javier Mariano Alvarez

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
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

-- DROP FUNCTION to_number(integer);

CREATE OR REPLACE FUNCTION to_number(param integer)
  RETURNS integer AS
$BODY$
begin
	return param;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION to_number(integer)
  OWNER TO postgres;
/*
CrowSoft-Cairo
==============

ERP application written in Java (Tomcat + GWT) and Postgresql

Copyright (C) 2012  Javier Mariano Alvarez

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
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

-- DROP FUNCTION to_number(character varying);

CREATE OR REPLACE FUNCTION to_number(param character varying)
  RETURNS integer AS
$BODY$
begin
	return to_number(param, '999999999');
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION to_number(character varying)
  OWNER TO postgres;
