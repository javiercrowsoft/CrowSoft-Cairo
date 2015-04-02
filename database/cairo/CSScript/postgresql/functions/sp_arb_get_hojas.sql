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
-- Function: sp_arbgethojas()

-- drop function sp_arbgethojas();

create or replace function sp_arbgethojas(
  in p_ram_id integer default null ,
  in p_soloColumnas integer default 0 ,
  in p_aBuscar varchar default '' ,
  in p_top integer default 3000,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
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
begin

        create TEMP table tt_hojaid
        (
          tran_id integer not null,
          hoja_id integer not null,
          id integer not null
        ) on commit drop;

        v_tran_id := nextval('t_hojaid_seq');
        
   --------------------------------------------------------------------
   
   select ramc_valor
     into v_camposRama
     from RamaConfig
      where ram_id = p_ram_id
              and ramc_aspecto = 'Campos';

   select ramc_valor
     into v_tablasRama
     from RamaConfig
      where ram_id = p_ram_id
              and ramc_aspecto = 'Tablas';

   select ramc_valor
     into v_prefix
     from RamaConfig
      where ram_id = p_ram_id
              and ramc_aspecto = 'Prefix';

   select ramc_valor
     into v_where
     from RamaConfig
      where ram_id = p_ram_id
              and ramc_aspecto = 'where';

   if v_camposRama is null then
      v_camposRama := '';

   end if;

   if v_tablasRama is null then
      v_tablasRama := '';

   end if;

   if v_prefix is null then
      v_prefix := '';

   end if;

   if v_where is null then
      v_where := '';

   end if;

   --------------------------------------------------------------------
   select tbl_nombreFisico,
          tbl_camposInView,
          tbl_campoId,
          tbl_campoNombre
     into v_tabla,
          v_campos,
          v_campoId,
          v_campoNombre
     from Arbol ,
          Rama ,
          Tabla
      where Arbol.arb_id = Rama.arb_id
              and Tabla.tbl_id = Arbol.tbl_Id
              and Rama.ram_id = p_ram_id;

   --------------------------------------------------------------------
   if LTRIM(v_camposRama) <> '' then
      v_campos := v_camposRama;

   end if;

   if LTRIM(v_prefix) = '' then
      v_prefix := v_tabla;

   end if;

   --------------------------------------------------------------------
   -- armo la sentencia sql
   v_sqlstmt := 'select hoja_id,';

   v_sqlstmt := v_sqlstmt || v_prefix || '.' || v_campoId || ' as ID,';

   if INSTR(v_campoNombre, 'codigo', 1) <> 0 then
      v_sqlstmt := v_sqlstmt || v_prefix || '.' || v_campoNombre || ' as Codigo';

   else
      if INSTR(v_campoNombre, 'apellido', 1) <> 0 then
         v_sqlstmt := v_sqlstmt || v_prefix || '.' || v_campoNombre || ' as Apellido' ;

      else
         v_sqlstmt := v_sqlstmt || v_prefix || '.' || v_campoNombre || ' as Nombre';

      end if;

   end if;

   v_campos := sp_strSetPrefix(v_prefix, v_campos);

   if LTRIM(v_campos) <> '' then
      v_sqlstmt := v_sqlstmt || ',' || v_campos;

   end if;

   v_sqlstmt := v_sqlstmt || ' from ' || v_tabla || ' ' || v_prefix;

   if LTRIM(v_tablasRama) <> '' then
      v_sqlstmt := v_sqlstmt || ',' || v_tablasRama;

   end if;

   v_sqlwhere := ' where Hoja.ram_id = ' || to_char(p_ram_id) || ' and Hoja.id = ' || v_prefix || '.' || v_campoId || v_where;

   -- si solo quieren las columnas
   if coalesce(p_soloColumnas, 0) <> 0 then
   begin
      v_sqlstmt := v_sqlstmt || ', Hoja ' || v_sqlwhere;

      v_sqlstmt := v_sqlstmt || ' and 1=2';

   end;
   else
   begin
      -- si se trata de la raiz tambien entran los que no estan asignados a ninguna rama
      select ram_id_padre,
             arb_id
        into v_esRaiz,
             v_arb_id
        from Rama
         where ram_id = p_ram_id;

      if v_esRaiz = 0 then
      begin
         -- Ids de la raiz
         v_sqlstmt2 := ' insert into tt_hojaid select ' || v_tran_id::varchar || ', hoja_id,id from Hoja where ram_id = ' || to_char(p_ram_id);

         EXECUTE v_sqlstmt2;--print (@sqlstmt2)--
         

         -- Ids sin asignar
         v_sqlstmt2 := 'insert into tt_hojaid select ' || v_tran_id::varchar || ', ' || v_campoId || '*-1,' || v_campoId || ' from ' || v_tabla || ' where not exists (select hoja_id from Hoja inner join Rama on Hoja.ram_id = Rama.ram_id where Hoja.id = ' || v_tabla || '.' || v_campoId || ' and Hoja.arb_id = ' || to_char(v_arb_id) || ' and (Rama.ram_id <> ram_id_padre or Rama.ram_id = 0))';

         EXECUTE v_sqlstmt2;--print (@sqlstmt2)--
         

         -- el filtro esta en tt_hojaid
         v_sqlstmt := v_sqlstmt || ', tt_hojaid where tt_hojaid.tran_id = ' || v_tran_id::varchar || ' and tt_hojaid.id = ' || v_prefix || '.' || v_campoId || v_where;

      end;
      else
         v_sqlstmt := v_sqlstmt || ', Hoja ' || v_sqlwhere;

      end if;

   end;
   end if;

   v_sqlstmt := v_sqlstmt || ' limit ' || p_top::varchar;

   rtn := 'rtn';

   open rtn for EXECUTE v_sqlstmt;
   --print (@sqlstmt)--
   
end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_arbgethojas(integer, integer, varchar, integer)
  owner to postgres;