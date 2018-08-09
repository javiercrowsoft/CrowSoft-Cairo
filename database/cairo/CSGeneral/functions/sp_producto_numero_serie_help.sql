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
-- Function: sp_doc_factura_compra_get_items()

-- drop function sp_doc_factura_compra_get_items(integer);
/*
update tabla set tbl_sqlhelp = replace(tbl_sqlhelp, 'sp_ProductoNumeroSerieHelp', 'sp_producto_numero_serie_help') where tbl_id = 1017
*/
create or replace function sp_producto_numero_serie_help
/*
    
  select * from sp_producto_numero_serie_help(1,1,0,'300%',0,596);
  fetch all from rtn;

  select * from sp_producto_numero_serie_help( 1,1,0, 'estk7890031', 1, 0, '');
  fetch all from rtn;

  select prns_id, prns_codigo      as Codigo, prns_codigo2     as Codigo2, prns_codigo3     as Codigo3, pr_nombreCompra  as Articulo, prns_descrip	  as "Observ.",  '%' as col_aux from ProductoNumeroSerie prns inner join Producto pr on prns.pr_id = pr.pr_id where (prns_codigo like '%%%' or prns_codigo2 like '%%%' or prns_codigo3 like '%%%' or pr_nombreCompra like '%%%' or prns_descrip like '%%%' or '%' = '')   and ((prns.pr_id = 4 and prns.pr_id_kit is null and depl_id not in (-2,-3) and depl_id in (select depl_id from depositoLogico where depf_id = 5))) limit 300;
  
*/
(
  in p_emp_id integer,
  in p_us_id integer,
  in p_bForAbm integer,
  in p_filter varchar default '',
  in p_check integer default 0,
  in p_prns_id integer default 0,
  in p_filter2 varchar default '',
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_sqlstmt varchar(5000);
begin

   p_filter := lower(f_unaccent(p_filter));
   p_filter := replace(p_filter, '''', '''''');
   p_filter2 := replace(p_filter2, '(pr_id', '(prns.pr_id');
   p_filter2 := replace(p_filter2, ' pr_id', ' prns.pr_id');

   if substr(p_filter2, 1, 8) = 'pr_id = ' then

      p_filter2 := 'prns.pr_id = ' || substr(p_filter2, 9, length(p_filter2));

   end if;

   if p_check <> 0 then

      v_sqlstmt := 'select prns_id, ';
      v_sqlstmt := v_sqlstmt || 'prns_codigo     as Codigo, ';
      v_sqlstmt := v_sqlstmt || 'pr_nombreCompra as Articulo ';
      v_sqlstmt := v_sqlstmt || 'from ProductoNumeroSerie prns inner join Producto pr on prns.pr_id = pr.pr_id ';
      v_sqlstmt := v_sqlstmt || 'where (lower(f_unaccent(prns_codigo)) = ''' || p_filter || ''') ';

      if p_prns_id <> 0 then

         v_sqlstmt := v_sqlstmt || ' and (prns_id = ' || CAST(p_prns_id as varchar(20)) || ') ';

      end if;

      if p_filter2 <> '' then

         v_sqlstmt := v_sqlstmt || ' and (' || p_filter2 || ')';

      end if;

   else

      v_sqlstmt := 'select prns_id, ';
      v_sqlstmt := v_sqlstmt || 'prns_codigo      as Codigo, ';
      v_sqlstmt := v_sqlstmt || 'prns_codigo2     as Codigo2, ';
      v_sqlstmt := v_sqlstmt || 'prns_codigo3     as Codigo3, ';
      v_sqlstmt := v_sqlstmt || 'pr_nombreCompra  as Articulo, ';
      v_sqlstmt := v_sqlstmt || 'prns_descrip	  as "Observ.", ';
      v_sqlstmt := v_sqlstmt || ' ''' || p_filter || ''' as col_aux ';
      v_sqlstmt := v_sqlstmt || 'from ProductoNumeroSerie prns inner join Producto pr on prns.pr_id = pr.pr_id ';
      v_sqlstmt := v_sqlstmt || 'where ';

      if substr(p_filter, 0, 2) <> '@@' then

         v_sqlstmt := v_sqlstmt || '(prns_codigo like ''%' || p_filter || '%'' or prns_codigo2 like ''%' || p_filter || '%'' or prns_codigo3 like ''%' || p_filter || '%'' or pr_nombreCompra like ''%' || p_filter || '%'' or prns_descrip like ''%' || p_filter || '%'' or ''' || p_filter || ''' = '''') ';

      else

         v_sqlstmt := v_sqlstmt || 'prns_codigo = ''' || substr(p_filter, 3, length(p_filter)) || '''';

      end if;

      if p_filter2 <> '' then

         v_sqlstmt := v_sqlstmt || '  and (' || p_filter2 || ')';

      end if;
      
      v_sqlstmt := v_sqlstmt || ' limit 300';
      
   end if;

   rtn := 'rtn';
   open rtn for execute v_sqlstmt;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_producto_numero_serie_help(integer, integer, integer, varchar, integer, integer, varchar)
  owner to postgres;