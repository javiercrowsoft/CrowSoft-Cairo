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
-- Function: sp_clientehelp2()

-- drop function sp_clientehelp2(integer, integer, integer, integer, varchar, integer, integer, varchar);
/*
  select sp_clientehelp2(1,1,1,1,'%',0,0); fetch all from rtn;
*/
create or replace function sp_clientehelp2
(
  in p_emp_id integer,
  in p_us_id integer,
  in p_bForAbm integer,
  in p_bFilterType integer,
  in p_filter varchar default '',
  in p_check integer default 0,
  in p_cli_id integer default 0,
  in p_filter2 varchar default '',
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_us_EmpresaEx smallint;
   v_us_EmpXDpto smallint;
   v_filter varchar(255);
begin

   select us_empresaex,
          us_empxdpto
     into v_us_EmpresaEx,
          v_us_EmpXDpto
   from Usuario
   where us_id = p_us_id;

   v_filter := lower(f_unaccent(p_filter));

   v_filter := sp_HelpGetFilter(p_bFilterType, v_filter);

   --/////////////////////////////////////////////////////////////////////////////////////

   if v_us_EmpresaEx <> 0 then

      if p_check <> 0 then

         rtn := 'rtn';
         open rtn for
            select cli_id,
                   cli_nombre Nombre,
                   cli_codigo Codigo
            from Cliente cli
            where ( lower(f_unaccent(cli_nombre = p_filter)) or lower(f_unaccent(cli_codigo)) = p_filter )
               and ( cli_id = p_cli_id or p_cli_id = 0 )
               and ( p_bForAbm <> 0
                     or ( cli.activo <> 0
                          and ( exists ( select *
                                         from EmpresaCliente
                                         where cli_id = cli.cli_id
                                           and emp_id = p_emp_id ) )
                          and ( exists ( select *
                                         from UsuarioEmpresa
                                         where cli_id = cli.cli_id
                                          and us_id = p_us_id )
                                or p_us_id = 1 ) ) );

      else

         rtn := 'rtn';
         open rtn for
            select cli.cli_id,
                   cli.cli_nombre Nombre,
                   cli.cli_codigo Codigo,
                   cli.cli_calle || ' ' || cli.cli_callenumero || ' '
                    || cli.cli_piso || ' ' || cli.cli_depto
                    || ' - ' || cli.cli_localidad || ' - ' || cli.cli_codpostal Direccion,
                   --cli.cli_contacto Contacto,
                   --ven.ven_nombre Vendedor,
                   cli.cli_tel Telefono,
                   --cpg.cpg_nombre Cond_Pago,
                   cli.cli_razonsocial Razon_social/*,
                   cli.cli_cuit CUIT,
                   case cli.cli_catfiscal
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
                   end Categoria_Fiscal*/
            from Cliente cli
            left join CondicionPago cpg
              on cli.cpg_id = cpg.cpg_id
            left join Vendedor ven
              on cli.ven_id = ven.ven_id
            where ( lower(f_unaccent(cli.cli_codigo)) like v_filter
                    or lower(f_unaccent(cli.cli_nombre)) like v_filter
                    or lower(f_unaccent(cli.cli_razonsocial)) like v_filter
                    or cli.cli_cuit like v_filter
                    or p_filter is null
                    or lower(f_unaccent(
                          (cli.cli_calle || ' ' || cli.cli_callenumero || ' ' || cli.cli_piso || ' ' || cli.cli_depto
                          || ' - ' || cli.cli_localidad || ' - ' || cli.cli_codpostal
                          ))) like v_filter
                    or lower(f_unaccent(cli.cli_contacto)) like v_filter
                    or lower(f_unaccent(cli.cli_tel)) like v_filter
                    or lower(f_unaccent(ven.ven_nombre)) like v_filter
                  )
              and ( p_bForAbm <> 0
                    or ( ( exists ( select *
                                    from EmpresaCliente
                                    where cli_id = cli.cli_id
                                      and emp_id = p_emp_id ) )
                     and ( exists ( select *
                                    from UsuarioEmpresa
                                    where cli_id = cli.cli_id
                                      and us_id = p_us_id )
                           or p_us_id = 1 )
                     and cli.activo <> 0 ) 
                  )
              limit 150;

      end if;

   else

      if v_us_EmpXDpto <> 0 then

         if p_check <> 0 then

            rtn := 'rtn';
            open rtn for
               select cli_id,
                      cli_nombre Nombre,
                      cli_codigo Codigo
               from Cliente cli
               where ( lower(f_unaccent(cli_nombre)) = p_filter or lower(f_unaccent(cli_codigo)) = p_filter )
                 and ( cli_id = p_cli_id or p_cli_id = 0 )
                 and ( p_bForAbm <> 0
                      or ( cli.activo <> 0
                          and ( exists ( select *
                                         from EmpresaCliente
                                         where cli_id = cli.cli_id
                                           and emp_id = p_emp_id ) )
                          and ( exists ( select *
                                         from DepartamentoCliente dc
                                         join UsuarioDepartamento ud
                                           on dc.dpto_id = ud.dpto_id
                                         where dc.cli_id = cli.cli_id
                                           and ud.us_id = p_us_id )
                          or p_us_id = 1 ) )
                      );

         else

            rtn := 'rtn';
            open rtn for
               select cli.cli_id,
                      cli.cli_nombre Nombre,
                      cli.cli_codigo Codigo,
                      cli.cli_calle || ' ' || cli.cli_callenumero || ' ' || cli.cli_piso
                        || ' ' || cli.cli_depto || ' - ' || cli.cli_localidad
                        || ' - ' || cli.cli_codpostal Direccion,
                      --cli.cli_contacto Contacto,
                      --ven.ven_nombre Vendedor,
                      cli.cli_tel Telefono,
                      --cpg.cpg_nombre Cond_Pago,
                      cli.cli_razonsocial Razon_social/*,
                      cli.cli_cuit CUIT,
                      case cli.cli_catfiscal
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
                      end Categoria_Fiscal*/
               from Cliente cli
               left join CondicionPago cpg
                      on cli.cpg_id = cpg.cpg_id
               left join Vendedor ven
                      on cli.ven_id = ven.ven_id
               where ( lower(f_unaccent(cli.cli_codigo)) like v_filter
                       or lower(f_unaccent(cli.cli_nombre)) like v_filter
                       or lower(f_unaccent(cli.cli_razonsocial)) like v_filter
                       or cli.cli_cuit like v_filter
                       or p_filter is null
                       or lower(f_unaccent(
                             (cli.cli_calle || ' ' || cli.cli_callenumero || ' '
                             || cli.cli_piso || ' ' || cli.cli_depto || ' - ' || cli.cli_localidad
                             || ' - ' || cli.cli_codpostal))) like v_filter
                       or lower(f_unaccent(cli.cli_contacto)) like v_filter
                       or lower(f_unaccent(cli.cli_tel)) like v_filter
                       or lower(f_unaccent(ven.ven_nombre)) like v_filter )
                 and ( p_bForAbm <> 0
                       or ( ( exists ( select *
                                       from EmpresaCliente
                                       where cli_id = cli.cli_id
                                         and emp_id = p_emp_id ) )
                        and ( exists ( select *
                                       from DepartamentoCliente dc
                                       join UsuarioDepartamento ud
                                         on dc.dpto_id = ud.dpto_id
                                       where dc.cli_id = cli.cli_id
                                         and ud.us_id = p_us_id )
                              or p_us_id = 1 )
                       and cli.activo <> 0 )
                     )
                 limit 50;

         end if;

      else

         if p_check <> 0 then

            rtn := 'rtn';
            open rtn for
               select cli_id,
                      cli_nombre Nombre,
                      cli_codigo Codigo
               from Cliente cli
               where ( lower(f_unaccent(cli_nombre)) = p_filter or lower(f_unaccent(cli_codigo)) = p_filter )
                 and ( cli_id = p_cli_id or p_cli_id = 0 )
                 and ( p_bForAbm <> 0 or ( cli.activo <> 0
                 and exists ( select *
                              from EmpresaCliente
                              where cli_id = cli.cli_id
                                and emp_id = p_emp_id ) ) );

         else

            rtn := 'rtn';
            open rtn for
               select cli.cli_id,
                      cli.cli_nombre Nombre,
                      cli.cli_codigo Codigo,
                      cli.cli_calle || ' ' || cli.cli_callenumero || ' ' || cli.cli_piso || ' '
                        || cli.cli_depto || ' - ' || cli.cli_localidad
                        || ' - ' || cli.cli_codpostal Direccion,
                      --cli.cli_contacto Contacto,
                      --ven.ven_nombre Vendedor,
                      cli.cli_tel Telefono,
                      --cpg.cpg_nombre Cond_Pago,
                      cli.cli_razonsocial Razon_social/*,
                      cli.cli_cuit CUIT,
                      case cli.cli_catfiscal
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
                      end Categoria_Fiscal*/
                 from Cliente cli
                 left join CondicionPago cpg
                        on cli.cpg_id = cpg.cpg_id
                 left join Vendedor ven
                        on cli.ven_id = ven.ven_id
                 where ( lower(f_unaccent(cli.cli_codigo)) like v_filter
                         or lower(f_unaccent(cli.cli_nombre)) like v_filter
                         or lower(f_unaccent(cli.cli_razonsocial)) like v_filter
                         or cli.cli_cuit like v_filter
                         or p_filter is null
                         or lower(f_unaccent(
                              (cli.cli_calle || ' ' || cli.cli_callenumero || ' ' || cli.cli_piso
                               || ' ' || cli.cli_depto || ' - ' || cli.cli_localidad
                               || ' - ' || cli.cli_codpostal))) like v_filter
                         or lower(f_unaccent(cli.cli_contacto)) like v_filter
                         or lower(f_unaccent(cli.cli_tel)) like v_filter
                         or lower(f_unaccent(ven.ven_nombre)) like v_filter )
                   and ( p_bForAbm <> 0
                          or ( exists ( select *
                                        from EmpresaCliente
                                        where cli_id = cli.cli_id
                                          and emp_id = p_emp_id )
                            and cli.activo <> 0 )
                       )
                   limit 50;

         end if;

      end if;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_clientehelp2(integer, integer, integer, integer, varchar, integer, integer, varchar)
  owner to postgres;