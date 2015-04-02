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
-- Function: sp_arbgetdecendencia()

-- drop function sp_arbgetdecendencia();

create or replace function sp_arbgetdecendencia(
        in p_ram_id integer default null ,
        in p_incluir_ram_id integer default 1 ,
        in p_incluir_ram_id_padre integer default 0 , -- este default es necesario para: SP_ArbCopiarRama, SP_ArbBorrarRama
        in p_incluir_nombre integer default 0 ,       -- este default es necesario para: SP_ArbCopiarRama, SP_ArbBorrarRama
        in p_incluir_arb_id integer default 0,
        out rtn refcursor)
  returns refcursor as
$BODY$
declare
   v_tot2 integer;
   v_tot1 integer;
   v_n integer;
   v_arb_id integer;
   v_sqlstmt varchar(512);
   v_where varchar(255);
   v_sqlArbId varchar(50);
   v_tran_id integer;
begin

        if p_ram_id = 0 then
                RETURN;
        end if;

        create TEMP table tt_t_rama2
        (
          tran_id integer not null,
          ram_id integer  not null,
          N integer  not null,
          ram_id_padre integer  not null,
          arb_id integer  not null,
          orden integer  not null
        ) on commit drop;

        v_tran_id := nextval('t_rama2_seq');

        v_tot1 := -1;

        v_tot2 := 0;

        v_n := 1;

        if p_incluir_arb_id <> 0 then
                select arb_id
                into v_arb_id
                from Rama
                where ram_id = p_ram_id;
        else
                v_arb_id := 0;
        end if;

        insert into tt_t_rama2
        (tran_id, ram_id, N, ram_id_padre, arb_id, orden)
        (select v_tran_id,
                p_ram_id,
                0,
                ram_id_padre,
                v_arb_id,
                ram_orden
        from Rama
        where ram_id = p_ram_id );

   while v_tot1 < v_tot2
   loop
      begin
         v_tot1 := v_tot2;

         insert into tt_t_rama2
           ( tran_id, ram_id, N, ram_id_padre, arb_id, orden )
           select v_tran_id,
                  r.ram_id,
                  v_n,
                  r.ram_id_padre,
                  v_arb_id,
                  r.ram_orden
             from Rama r,
                  tt_t_rama2 t
              where r.ram_id_padre = t.ram_id
                      and t.tran_id = v_tran_id
                      and t.N = v_n - 1
                      -- esto chequea que no existan referencias circulares
                      and not exists ( select *
                                       from tt_t_rama2
                                          where tt_t_rama2.ram_id = r.ram_id and tt_t_rama2.tran_id = v_tran_id )
             order by r.ram_orden;

         select COUNT(*) into v_tot2
         from tt_t_rama2 t where t.tran_id = v_tran_id;

         v_n := v_n + 1;

      end;
   end loop;

   v_where := ' where t.tran_id = ' || v_tran_id::varchar;

   if p_incluir_ram_id = 0 then
      v_where := v_where || ' and t.ram_id <> ' || to_char(p_ram_id);
   end if;

   if p_incluir_arb_id <> 0 then
      v_sqlArbId := ',t.arb_id';

   else
      v_sqlArbId := '';

   end if;

   if p_incluir_ram_id_padre <> 0 then
   begin
      if p_incluir_nombre <> 0 then
         v_sqlstmt := 'select t.ram_id,t.ram_id_padre,r.ram_nombre' || v_sqlArbId || ' from tt_t_rama2 t inner join rama r on t.ram_id = r.ram_id';

      else
         v_sqlstmt := 'select ram_id,ram_id_padre' || v_sqlArbId || ' from tt_t_rama2 t';

      end if;

   end;
   else
   begin
      if p_incluir_nombre <> 0 then
         v_sqlstmt := 'select t.ram_id,r.ram_nombre' || v_sqlArbId || ' from tt_t_rama2 t inner join rama r on t.ram_id = r.ram_id';

      else
         v_sqlstmt := 'select ram_id' || v_sqlArbId || ' from tt_t_rama2 t';

      end if;

   end;
   end if;

   v_sqlstmt := v_sqlstmt || v_where || ' order by n,orden';

   rtn := 'rtn';

   open rtn for EXECUTE v_sqlstmt;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_arbgetdecendencia(integer, integer, integer, integer, integer)
  owner to postgres;