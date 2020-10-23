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
-- Function: sp_productoventahelp()

-- drop function sp_productoventahelp(integer, integer, integer, integer, varchar, integer, integer, varchar, integer);

create or replace function sp_productoventahelp
/*
          select * from sp_ProductoventaHelp(1,1,1,1,'hp%',0,0); fetch all from rtn;
          select * from sp_ProductoventaHelp(1,1,0,0,'Impresora Deskjet 450ci',1); fetch all from rtn;
          select * from sp_productoventahelp(1,1,0,1,'Impresora', 0); fetch all from rtn;
*/
(
  in p_emp_id integer,
  in p_us_id integer,
  in p_bForAbm integer,
  in p_filterType integer default 0,  
  in p_filter varchar default '',
  in p_check integer default 0,
  in p_pr_id integer default 0,
  in p_filter2 varchar default '',
  in p_prhc_id integer default 0,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_filter varchar(255);
   v_prhc_atributo smallint;
   v_prhc_codigo varchar(255);
   v_code bigint;
begin

   rtn := 'rtn';

   p_filter := lower(f_unaccent(p_filter));

   -- check
   --
   if p_check <> 0 then

      open rtn for
         select pr_id,
                pr_nombreventa Nombre,
                pr_codigo Codigo
         from Producto
         where ( lower(f_unaccent(pr_nombreventa)) = p_filter or lower(f_unaccent(pr_codigo)) = p_filter )
           and ( activo <> 0 or p_bForAbm <> 0 )
           and ( pr_id = p_pr_id or p_pr_id = 0 )
           and pr_sevende <> 0;

   else

      select sp_help_get_filter(p_filterType, p_filter) into v_filter;
   
      if p_prhc_id <> 0 then

         select prhc_valor_codigo,
                prhc_atributo_indice
           into v_prhc_codigo,
                v_prhc_atributo
         from ProductoHelpConfig
         where prhc_id = p_prhc_id;

         select nextval('t_tmp_string_table_seq') into v_code;

         perform sp_str_string_to_table(v_code, v_prhc_codigo, ',');

         if v_prhc_atributo = 1 then
            insert into tt_t_help_rubro
              ( select rubti.rubti_id
                from RubroTablaItem rubti
                join Rubro rub
                  on rubti.rubt_id = rub.rubt_id1
                join TmpStringToTable
                  on rubti.rubti_codigo = TmpStringToTable.tmpstr2tbl_campo
                where tmpstr2tbl_id = v_code );

         else
            if v_prhc_atributo = 2 then
               insert into tt_t_help_rubro
                 ( select rubti.rubti_id
                   from RubroTablaItem rubti
                   join Rubro rub
                     on rubti.rubt_id = rub.rubt_id2
                   join TmpStringToTable
                     on rubti.rubti_codigo = TmpStringToTable.tmpstr2tbl_campo
                   where tmpstr2tbl_id = v_code );

            else
               if v_prhc_atributo = 3 then
                  insert into tt_t_help_rubro
                    ( select rubti.rubti_id
                      from RubroTablaItem rubti
                      join Rubro rub
                        on rubti.rubt_id = rub.rubt_id3
                      join TmpStringToTable
                        on rubti.rubti_codigo = TmpStringToTable.tmpstr2tbl_campo
                      where tmpstr2tbl_id = v_code );

               else
                  if v_prhc_atributo = 4 then
                     insert into tt_t_help_rubro
                       ( select rubti.rubti_id
                         from RubroTablaItem rubti
                         join Rubro rub
                           on rubti.rubt_id = rub.rubt_id4
                         join TmpStringToTable
                           on rubti.rubti_codigo = TmpStringToTable.tmpstr2tbl_campo
                         where tmpstr2tbl_id = v_code );

                  else
                     if v_prhc_atributo = 5 then
                        insert into tt_t_help_rubro
                          ( select rubti.rubti_id
                            from RubroTablaItem rubti
                            join Rubro rub
                              on rubti.rubt_id = rub.rubt_id5
                            join TmpStringToTable
                              on rubti.rubti_codigo = TmpStringToTable.tmpstr2tbl_campo
                            where tmpstr2tbl_id = v_code );

                     else
                        if v_prhc_atributo = 6 then
                           insert into tt_t_help_rubro
                             ( select rubti.rubti_id
                               from RubroTablaItem rubti
                               join Rubro rub
                                 on rubti.rubt_id = rub.rubt_id6
                               join TmpStringToTable
                                 on rubti.rubti_codigo = TmpStringToTable.tmpstr2tbl_campo
                               where tmpstr2tbl_id = v_code );

                        else
                           if v_prhc_atributo = 7 then
                              insert into tt_t_help_rubro
                                ( select rubti.rubti_id
                                  from RubroTablaItem rubti
                                  join Rubro rub
                                    on rubti.rubt_id = rub.rubt_id7
                                  join TmpStringToTable
                                    on rubti.rubti_codigo = TmpStringToTable.tmpstr2tbl_campo
                                  where tmpstr2tbl_id = v_code );

                           else
                              if v_prhc_atributo = 8 then
                                 insert into tt_t_help_rubro
                                   ( select rubti.rubti_id
                                     from RubroTablaItem rubti
                                     join Rubro rub
                                       on rubti.rubt_id = rub.rubt_id8
                                     join TmpStringToTable
                                       on rubti.rubti_codigo = TmpStringToTable.tmpstr2tbl_campo
                                     where tmpstr2tbl_id = v_code );

                              else
                                 if v_prhc_atributo = 9 then
                                    insert into tt_t_help_rubro
                                      ( select rubti.rubti_id
                                        from RubroTablaItem rubti
                                        join Rubro rub
                                          on rubti.rubt_id = rub.rubt_id9
                                        join TmpStringToTable
                                          on rubti.rubti_codigo = TmpStringToTable.tmpstr2tbl_campo
                                        where tmpstr2tbl_id = v_code );

                                 else
                                    if v_prhc_atributo = 10 then
                                       insert into tt_t_help_rubro
                                         ( select rubti.rubti_id
                                           from RubroTablaItem rubti
                                           join Rubro rub
                                             on rubti.rubt_id = rub.rubt_id10
                                           join TmpStringToTable
                                             on rubti.rubti_codigo = TmpStringToTable.tmpstr2tbl_campo
                                           where tmpstr2tbl_id = v_code );

                                    end if;

                                 end if;

                              end if;

                           end if;

                        end if;

                     end if;

                  end if;

               end if;

            end if;

         end if;

         open rtn for
         
            select pr_id,
                   pr_nombreventa Nombre,
                   pr_descripventa Observaciones,
                   pr_codigo Codigo
            from Producto
            where ( lower(f_unaccent(pr_codigo)) like v_filter
                  or lower(f_unaccent(pr_nombreventa)) like v_filter
                  or lower(f_unaccent(pr_descripventa)) like v_filter
                  or p_filter is null )
              and ( activo <> 0 or p_bForAbm <> 0 )
              and pr_sevende <> 0
              and (   ( v_prhc_atributo = 1  and rubti_id1  in ( select rubti_id from tt_t_help_rubro  ) )
                   or ( v_prhc_atributo = 2  and rubti_id2  in ( select rubti_id from tt_t_help_rubro  ) )
                   or ( v_prhc_atributo = 3  and rubti_id3  in ( select rubti_id from tt_t_help_rubro  ) )
                   or ( v_prhc_atributo = 4  and rubti_id4  in ( select rubti_id from tt_t_help_rubro  ) )
                   or ( v_prhc_atributo = 5  and rubti_id5  in ( select rubti_id from tt_t_help_rubro  ) )
                   or ( v_prhc_atributo = 6  and rubti_id6  in ( select rubti_id from tt_t_help_rubro  ) )
                   or ( v_prhc_atributo = 7  and rubti_id7  in ( select rubti_id from tt_t_help_rubro  ) )
                   or ( v_prhc_atributo = 8  and rubti_id8  in ( select rubti_id from tt_t_help_rubro  ) )
                   or ( v_prhc_atributo = 9  and rubti_id9  in ( select rubti_id from tt_t_help_rubro  ) )
                   or ( v_prhc_atributo = 10 and rubti_id10 in ( select rubti_id from tt_t_help_rubro  ) )
                  )
              limit 50;

      else

         open rtn for
            --//////////////////////////////////////////////////////////////////
            --
            -- select COMUN
            --
            --//////////////////////////////////////////////////////////////////
            select pr_id,
                   pr_nombreventa Nombre,
                   pr_descripventa Observaciones,
                   pr_codigo Codigo
            from Producto
            where (    lower(f_unaccent(pr_codigo)) like v_filter
                    or lower(f_unaccent(pr_nombreventa)) like v_filter
                    or lower(f_unaccent(pr_descripventa)) like v_filter
                    or p_filter is null )
              and ( activo <> 0 or p_bForAbm <> 0 )
              and pr_sevende <> 0
            limit 50;

      end if;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_productoventahelp(integer, integer, integer, integer, varchar, integer, integer, varchar, integer)
  owner to postgres;