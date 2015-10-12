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
-- Function: sp_productocomprahelp()

-- drop function sp_productocomprahelp(integer, integer, integer, varchar, integer, integer, varchar, integer);

create or replace function sp_productocomprahelp
/*
          select * from sp_ProductoCompraHelp(1,1,1,'hp%',0,0); fetch all from rtn;
          select * from sp_ProductoCompraHelp(1,1,0,'Impresora Deskjet 450ci',1,26); fetch all from rtn;
*/
(
  in p_emp_id integer,
  in p_us_id integer,
  in p_bForAbm integer,
  in p_filter varchar default '',
  in p_check integer default 0,
  in p_pr_id integer default 0,
  in p_filter2 varchar default '',
  in p_prhc_id integer default 0,
  out rtn refcursor
)
  returns refcursor as
$BODY$
begin

   p_filter := lower(f_unaccent(p_filter));

   rtn := 'rtn';

   if p_check <> 0 then

      open rtn for
         select pr_id,
                pr_nombrecompra Nombre,
                pr_codigo Codigo
         from Producto
         where ( lower(f_unaccent(pr_nombrecompra)) = p_filter
                or lower(f_unaccent(pr_codigo)) = p_filter )
           and ( activo <> 0 or p_bForAbm <> 0 )
           and ( pr_id = p_pr_id or p_pr_id = 0 )
           and pr_secompra <> 0;

   else

      open rtn for
         select pr_id,
                pr_nombrecompra Nombre,
                pr_descripcompra Observaciones,
                pr_codigo Codigo
         from Producto
                  left join RubroTablaItem rti1
                   on Producto.rubti_id1 = rti1.rubti_id
                  left join RubroTablaItem rti2
                   on Producto.rubti_id2 = rti2.rubti_id
                  left join RubroTablaItem rti3
                   on Producto.rubti_id3 = rti3.rubti_id
                  left join RubroTablaItem rti4
                   on Producto.rubti_id4 = rti4.rubti_id
                  left join RubroTablaItem rti5
                   on Producto.rubti_id5 = rti5.rubti_id
                  left join RubroTablaItem rti6
                   on Producto.rubti_id6 = rti6.rubti_id
                  left join RubroTablaItem rti7
                   on Producto.rubti_id7 = rti7.rubti_id
                  left join RubroTablaItem rti8
                   on Producto.rubti_id8 = rti8.rubti_id
                  left join RubroTablaItem rti9
                   on Producto.rubti_id9 = rti9.rubti_id
                  left join RubroTablaItem rti10
                   on Producto.rubti_id10 = rti10.rubti_id
         where ( lower(f_unaccent(pr_codigo)) like '%' || p_filter || '%'
                 or lower(f_unaccent(pr_nombrecompra)) like '%' || p_filter || '%'
                 or lower(f_unaccent(pr_descripcompra)) like '%' || p_filter || '%'
                 or lower(f_unaccent(rti1.rubti_nombre)) like '%' || p_filter || '%'
                 or lower(f_unaccent(rti2.rubti_nombre)) like '%' || p_filter || '%'
                 or lower(f_unaccent(rti3.rubti_nombre)) like '%' || p_filter || '%'
                 or lower(f_unaccent(rti4.rubti_nombre)) like '%' || p_filter || '%'
                 or lower(f_unaccent(rti5.rubti_nombre)) like '%' || p_filter || '%'
                 or lower(f_unaccent(rti6.rubti_nombre)) like '%' || p_filter || '%'
                 or lower(f_unaccent(rti7.rubti_nombre)) like '%' || p_filter || '%'
                 or lower(f_unaccent(rti8.rubti_nombre)) like '%' || p_filter || '%'
                 or lower(f_unaccent(rti9.rubti_nombre)) like '%' || p_filter || '%'
                 or lower(f_unaccent(rti10.rubti_nombre)) like '%' || p_filter || '%'
                 or p_filter is null )
           and ( activo <> 0 or p_bForAbm <> 0 )
           and pr_secompra <> 0
         limit 50;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_productocomprahelp(integer, integer, integer, varchar, integer, integer, varchar, integer)
  owner to postgres;