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
-- Function: sp_arbgethojas()

-- DROP FUNCTION sp_arbgethojas();

CREATE OR REPLACE FUNCTION sp_arbgethojas(
  IN p_ram_id integer DEFAULT NULL ,
  IN p_soloColumnas integer DEFAULT 0 ,
  IN p_aBuscar varchar DEFAULT '' ,
  IN p_top integer DEFAULT 3000,
  OUT rtn refcursor
)
  RETURNS refcursor AS
$BODY$
DECLARE
   -- 1 Averiguo de que tabla se trata
   v_tabla varchar(5000);
   v_campoId varchar(5000);
   v_campoNombre varchar(255);
   v_campos varchar(5000);
   v_camposRama varchar(5000);
   v_tablasRama varchar(5000);
   v_where varchar(5000);
   v_prefix varchar(5000);
   v_sqlstmt varchar(5000);
   v_sqlstmt2 varchar(5000);
   v_sqlwhere varchar(5000);
   v_esRaiz integer;
   v_arb_id integer;
   v_tran_id integer;
BEGIN

        CREATE TEMP TABLE tt_hojaid
        (
          tran_id integer NOT NULL,
          hoja_id integer NOT NULL,
          id integer NOT NULL
        ) on commit drop;

        v_tran_id := nextval('t_hojaid_seq');
        
   --------------------------------------------------------------------
   
   SELECT ramc_valor
     INTO v_camposRama
     FROM RamaConfig
      WHERE ram_id = p_ram_id
              AND ramc_aspecto = 'Campos';

   SELECT ramc_valor
     INTO v_tablasRama
     FROM RamaConfig
      WHERE ram_id = p_ram_id
              AND ramc_aspecto = 'Tablas';

   SELECT ramc_valor
     INTO v_prefix
     FROM RamaConfig
      WHERE ram_id = p_ram_id
              AND ramc_aspecto = 'Prefix';

   SELECT ramc_valor
     INTO v_where
     FROM RamaConfig
      WHERE ram_id = p_ram_id
              AND ramc_aspecto = 'where';

   IF v_camposRama IS NULL THEN
      v_camposRama := '';

   END IF;

   IF v_tablasRama IS NULL THEN
      v_tablasRama := '';

   END IF;

   IF v_prefix IS NULL THEN
      v_prefix := '';

   END IF;

   IF v_where IS NULL THEN
      v_where := '';

   END IF;

   --------------------------------------------------------------------
   SELECT tbl_nombreFisico,
          tbl_camposInView,
          tbl_campoId,
          tbl_campoNombre
     INTO v_tabla,
          v_campos,
          v_campoId,
          v_campoNombre
     FROM Arbol ,
          Rama ,
          Tabla
      WHERE Arbol.arb_id = Rama.arb_id
              AND Tabla.tbl_id = Arbol.tbl_Id
              AND Rama.ram_id = p_ram_id;

   --------------------------------------------------------------------
   IF LTRIM(v_camposRama) <> '' THEN
      v_campos := v_camposRama;

   END IF;

   IF LTRIM(v_prefix) = '' THEN
      v_prefix := v_tabla;

   END IF;

   --------------------------------------------------------------------
   -- armo la sentencia sql
   v_sqlstmt := 'SELECT hoja_id,';

   v_sqlstmt := v_sqlstmt || v_prefix || '.' || v_campoId || ' AS ID,';

   IF INSTR(v_campoNombre, 'codigo', 1) <> 0 THEN
      v_sqlstmt := v_sqlstmt || v_prefix || '.' || v_campoNombre || ' AS Codigo';

   ELSE
      IF INSTR(v_campoNombre, 'apellido', 1) <> 0 THEN
         v_sqlstmt := v_sqlstmt || v_prefix || '.' || v_campoNombre || ' AS Apellido' ;

      ELSE
         v_sqlstmt := v_sqlstmt || v_prefix || '.' || v_campoNombre || ' AS Nombre';

      END IF;

   END IF;

   v_campos := sp_strSetPrefix(v_prefix, v_campos);

   IF LTRIM(v_campos) <> '' THEN
      v_sqlstmt := v_sqlstmt || ',' || v_campos;

   END IF;

   v_sqlstmt := v_sqlstmt || ' from ' || v_tabla || ' ' || v_prefix;

   IF LTRIM(v_tablasRama) <> '' THEN
      v_sqlstmt := v_sqlstmt || ',' || v_tablasRama;

   END IF;

   v_sqlwhere := ' where Hoja.ram_id = ' || to_char(p_ram_id) || ' and Hoja.id = ' || v_prefix || '.' || v_campoId || v_where;

   -- si solo quieren las columnas
   IF coalesce(p_soloColumnas, 0) <> 0 THEN
   BEGIN
      v_sqlstmt := v_sqlstmt || ', Hoja ' || v_sqlwhere;

      v_sqlstmt := v_sqlstmt || ' and 1=2';

   END;
   ELSE
   BEGIN
      -- si se trata de la raiz tambien entran los que no estan asignados a ninguna rama
      SELECT ram_id_padre,
             arb_id
        INTO v_esRaiz,
             v_arb_id
        FROM Rama
         WHERE ram_id = p_ram_id;

      IF v_esRaiz = 0 THEN
      BEGIN
         -- Ids de la raiz
         v_sqlstmt2 := ' insert into tt_hojaid select ' || v_tran_id::varchar || ', hoja_id,id from Hoja where ram_id = ' || to_char(p_ram_id);

         EXECUTE v_sqlstmt2;--print (@sqlstmt2)--
         

         -- Ids sin asignar
         v_sqlstmt2 := 'insert into tt_hojaid select ' || v_tran_id::varchar || ', ' || v_campoId || '*-1,' || v_campoId || ' from ' || v_tabla || ' where not exists (select hoja_id from Hoja inner join Rama on Hoja.ram_id = Rama.ram_id where Hoja.id = ' || v_tabla || '.' || v_campoId || ' and Hoja.arb_id = ' || to_char(v_arb_id) || ' and (Rama.ram_id <> ram_id_padre or Rama.ram_id = 0))';

         EXECUTE v_sqlstmt2;--print (@sqlstmt2)--
         

         -- el filtro esta en tt_hojaid
         v_sqlstmt := v_sqlstmt || ', tt_hojaid where tt_hojaid.tran_id = ' || v_tran_id::varchar || ' and tt_hojaid.id = ' || v_prefix || '.' || v_campoId || v_where;

      END;
      ELSE
         v_sqlstmt := v_sqlstmt || ', Hoja ' || v_sqlwhere;

      END IF;

   END;
   END IF;

   v_sqlstmt := v_sqlstmt || ' limit ' || p_top::varchar;

   rtn := 'rtn';

   open rtn for execute v_sqlstmt;
   --print (@sqlstmt)--
   
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_arbgethojas(integer, integer, varchar, integer)
  OWNER TO postgres;