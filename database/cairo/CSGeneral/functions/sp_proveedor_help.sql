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
-- Function: sp_proveedorhelp()

-- drop function sp_proveedorhelp(integer, integer, integer, varchar, integer, integer, varchar);

create or replace function sp_proveedorhelp
/*
  select sp_proveedorhelp(1,1,1,'hp%',0,0); fetch all from rtn;
  select sp_proveedorhelp(1,1,0,?, 1, ?, ?, ?)
*/
(
  in p_emp_id integer,
  in p_us_id integer,
  in p_bForAbm integer,
  in p_filter varchar default '',
  in p_check integer default 0,
  in p_prov_id integer default 0,
  in p_filter2 varchar default '',
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_us_EmpresaEx numeric(3,0);
   v_us_EmpXDpto numeric(3,0);
begin

   select us_empresaex,
          us_empxdpto
     into v_us_EmpresaEx,
          v_us_EmpXDpto
     from Usuario
      where us_id = p_us_id;

   p_filter := lower(f_unaccent(p_filter));

   rtn := 'rtn';

   if v_us_EmpresaEx <> 0 then
   begin
      if p_check <> 0 then
      begin
         open rtn for
            select prov_id,
                   prov_nombre Nombre,
                   prov_codigo Codigo
            from Proveedor
            where ( lower(f_unaccent(prov_nombre)) = p_filter
                   or lower(f_unaccent(prov_codigo)) = p_filter )
                   and ( activo <> 0
                   or p_bForAbm <> 0 )
                   and ( prov_id = p_prov_id
                   or p_prov_id = 0 )
                   and ( p_bForAbm <> 0
                   or ( ( exists ( select *
                                   from EmpresaProveedor
                                      where prov_id = Proveedor.prov_id
                                              and emp_id = p_emp_id ) )
                   and ( exists ( select *
                                  from UsuarioEmpresa
                                     where prov_id = Proveedor.prov_id
                                             and us_id = p_us_id )
                   or p_us_id = 1 ) ) );

      end;
      else
      begin
         open rtn for
            select prov_id,
                   prov_nombre Nombre,
                   prov_razonsocial as "R. Social",
                   prov_cuit CUIT,
                   prov_codigo Codigo,
                   case prov_catfiscal
                    when 1 then 'Inscripto'
                    when 2 then 'Exento'
                    when 3 then 'No inscripto'
                    when 4 then 'Consumidor Final'
                    when 5 then 'Extranjero'
                    when 6 then 'Mono Tributo'
                    when 7 then 'Extranjero Iva'
                    when 8 then 'No responsable'
                    when 9 then 'No Responsable exento'
                    when 10 then 'No categorizado'
                    else 'Sin categorizar'
                   end as "Cat. Fiscal"
            from Proveedor
            where ( lower(f_unaccent(prov_codigo)) LIKE '%' || p_filter || '%'
                       or lower(f_unaccent(prov_nombre)) LIKE '%' || p_filter || '%'
                       or lower(f_unaccent(prov_razonsocial)) LIKE '%' || p_filter || '%'
                       or prov_cuit LIKE '%' || p_filter || '%'
                       or p_filter is null )
                       and ( p_bForAbm <> 0
                       or ( ( exists ( select *
                                       from EmpresaProveedor
                                          where prov_id = Proveedor.prov_id
                                                  and emp_id = p_emp_id ) )
                       and ( exists ( select *
                                      from UsuarioEmpresa
                                         where prov_id = Proveedor.prov_id
                                                 and us_id = p_us_id )
                       or p_us_id = 1 )
                       and activo <> 0 ) )
            LIMIT <= 50;

      end;
      end if;

   end;
   else
   begin
      if v_us_EmpXDpto <> 0 then
      begin
         if p_check <> 0 then
         begin
            open rtn for
               select prov_id,
                      prov_nombre Nombre,
                      prov_codigo Codigo
               from Proveedor
               where ( lower(f_unaccent(prov_nombre)) = p_filter
                          or lower(f_unaccent(prov_codigo)) = p_filter )
                          and ( activo <> 0
                          or p_bForAbm <> 0 )
                          and ( prov_id = p_prov_id
                          or p_prov_id = 0 )
                          and ( p_bForAbm <> 0
                          or ( ( exists ( select *
                                          from EmpresaProveedor
                                             where prov_id = Proveedor.prov_id
                                                     and emp_id = p_emp_id ) )
                          and ( exists ( select *
                                         from DepartamentoProveedor dc
                                                join UsuarioDepartamento ud
                                                 on dc.dpto_id = ud.dpto_id
                                            where dc.prov_id = Proveedor.prov_id
                                                    and ud.us_id = p_us_id )
                          or p_us_id = 1 ) ) );

         end;
         else
         begin
            open rtn for
               select prov_id,
                      prov_nombre Nombre,
                      prov_razonsocial as "R. Social",
                      prov_cuit CUIT,
                      prov_codigo Codigo,
                      case prov_catfiscal
                        when 1 then 'Inscripto'
                        when 2 then 'Exento'
                        when 3 then 'No inscripto'
                        when 4 then 'Consumidor Final'
                        when 5 then 'Extranjero'
                        when 6 then 'Mono Tributo'
                        when 7 then 'Extranjero Iva'
                        when 8 then 'No responsable'
                        when 9 then 'No Responsable exento'
                        when 10 then 'No categorizado'
                        else 'Sin categorizar'
                      end as "Cat. Fiscal"
               from Proveedor
               where ( lower(f_unaccent(prov_codigo)) LIKE '%' || p_filter || '%'
                          or lower(f_unaccent(prov_nombre)) LIKE '%' || p_filter || '%'
                          or lower(f_unaccent(prov_razonsocial)) LIKE '%' || p_filter || '%'
                          or prov_cuit LIKE '%' || p_filter || '%'
                          or p_filter is null )
                          and ( p_bForAbm <> 0
                          or ( ( exists ( select *
                                          from EmpresaProveedor
                                             where prov_id = Proveedor.prov_id
                                                     and emp_id = p_emp_id ) )
                          and ( exists ( select *
                                         from DepartamentoProveedor dc
                                                join UsuarioDepartamento ud
                                                 on dc.dpto_id = ud.dpto_id
                                            where dc.prov_id = Proveedor.prov_id
                                                    and ud.us_id = p_us_id )
                          or p_us_id = 1 )
                          and activo <> 0 ) )
               LIMIT <= 50;

         end;
         end if;

      end;
      else
      begin
         if p_check <> 0 then
         begin
            open rtn for
               select prov_id,
                      prov_nombre Nombre,
                      prov_codigo Codigo
               from Proveedor
               where ( lower(f_unaccent(prov_nombre)) = p_filter
                          or lower(f_unaccent(prov_codigo)) = p_filter )
                          and ( activo <> 0
                          or p_bForAbm <> 0 )
                          and ( prov_id = p_prov_id
                          or p_prov_id = 0 )
                          and ( p_bForAbm <> 0
                          or ( exists ( select *
                                        from EmpresaProveedor
                                           where prov_id = Proveedor.prov_id
                                                   and emp_id = p_emp_id ) ) );

         end;
         else
         begin
            open rtn for
               select prov_id,
                      prov_nombre Nombre,
                      prov_razonsocial as "R. Social",
                      prov_cuit CUIT,
                      prov_codigo Codigo,
                      case prov_catfiscal
                        when 1 then 'Inscripto'
                        when 2 then 'Exento'
                        when 3 then 'No inscripto'
                        when 4 then 'Consumidor Final'
                        when 5 then 'Extranjero'
                        when 6 then 'Mono Tributo'
                        when 7 then 'Extranjero Iva'
                        when 8 then 'No responsable'
                        when 9 then 'No Responsable exento'
                        when 10 then 'No categorizado'
                        else 'Sin categorizar'
                      end as "Cat. Fiscal"
               from Proveedor
               where ( lower(f_unaccent(prov_codigo)) LIKE '%' || p_filter || '%'
                          or lower(f_unaccent(prov_nombre)) LIKE '%' || p_filter || '%'
                          or lower(f_unaccent(prov_razonsocial)) LIKE '%' || p_filter || '%'
                          or prov_cuit LIKE '%' || p_filter || '%'
                          or p_filter is null )
                          and ( p_bForAbm <> 0
                          or ( exists ( select *
                                        from EmpresaProveedor
                                           where prov_id = Proveedor.prov_id
                                                   and emp_id = p_emp_id )
                          and activo <> 0 ) )
               LIMIT 50;

         end;
         end if;

      end;
      end if;

   end;
   end if;

end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function sp_proveedorhelp(integer, integer, integer, varchar, integer, integer, varchar)
  owner to postgres;