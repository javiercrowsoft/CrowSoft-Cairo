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
-- Function: alr_dc_csc_stk_0010_m()

-- drop function alr_dc_csc_stk_0010_m();

create or replace function dc_csc_con_0020
(
  in p_us_id integer,
  in p_Fini date,
  in p_Ffin date,

  in p_cico_id varchar,
  in p_emp_id varchar,
  in p_verificar integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_cico_id integer;
   v_emp_id integer;
   v_ram_id_CircuitoContable integer;
   v_ram_id_Empresa integer;
   v_clienteID integer;
   v_IsRaiz smallint;

   v_emp_id_check integer;
   v_fv_id integer;
   v_fv_fecha date;
   v_letra varchar(1);
   v_sucursal varchar(4);
   v_nrodoc varchar(255);
   v_numero integer;
   v_n integer;
   v_fv_id_next integer;
   v_fv_nrodoc_next varchar(255);
   v_nrodoc_next varchar(255);
   v_numero_next integer;
   v_doct_id integer;

   v_no_date date := to_date('19900101','yyyymmdd');

   v_last_letra varchar(255);
   v_last_sucursal varchar(255);
   v_last_nrodoc varchar(255);
   v_last_fv_id integer;
   v_last_doct_id integer;

begin

   create temporary table tt_t_dc_csc_con_0020_check
   (
     emp_id integer,
     doct_id integer,
     fv_id integer,
     fv_fecha date,
     letra varchar(1),
     sucursal varchar(4),
     nrodoc varchar(255)
   ) on commit drop;

   create temporary table tt_t_dc_csc_con_0020_mal
   (
     fv_id integer  not null,
     fv_id_next integer ,
     descrip varchar(255)
   ) on commit drop;

   create temporary table tt_t_dc_csc_con_0020_fv
   (
     fv_id integer  not null
   ) on commit drop;

   create temporary table tt_t_dc_csc_con_0020
   (
     col_dummy integer
   ) on commit drop;

   select * from sp_ArbConvertId(p_cico_id) into v_cico_id, v_ram_id_CircuitoContable;
   select * from sp_ArbConvertId(p_emp_id) into v_emp_id, v_ram_id_Empresa;

   select * from  sp_GetRptId() into v_clienteID;

   if v_ram_id_CircuitoContable <> 0 then
      --	exec sp_ArbGetGroups @ram_id_CircuitoContable, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_CircuitoContable) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_CircuitoContable, v_clienteID);
      else
         v_ram_id_CircuitoContable := 0;
      end if;
   end if;

   if v_ram_id_Empresa <> 0 then
      --	exec sp_ArbGetGroups @ram_id_Empresa, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_Empresa) into v_IsRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_Empresa, v_clienteID);
      else
         v_ram_id_Empresa := 0;
      end if;
   end if;

   /*
      - Las facturas tiene una letra en el primer caracter
        y la sucursal entre el 3 y el 6 caracter

      - Dada la factura x1 no debe existir una factura xn
        con igual letra que tenga fecha > y numero menor
   */

   if p_verificar <> 0 then

      --// Ahora vamos a revisar que no existan huecos en los numeros de comprobante
      --

      insert into tt_t_dc_csc_con_0020_check
        ( emp_id, doct_id, fv_id, fv_fecha, letra, sucursal, nrodoc )
        ( select fv.emp_id,
                 fv.doct_id,
                 fv.fv_id,
                 fv.fv_fecha,
                 substr(fv.fv_nrodoc, 1, 1),
                 substr(fv.fv_nrodoc, 3, 4),
                 substr(fv.fv_nrodoc, 9, 255)
          from FacturaVenta fv
          join Documento d
            on fv.doc_id = d.doc_id
          where fv.fv_fechaiva >= p_Fini
            and fv.fv_fechaiva <= p_Ffin
            and ( exists ( select *
                           from EmpresaUsuario
                           where emp_id = fv.emp_id
                             and us_id = p_us_id )
                  or ( p_us_id = 1 ) )

            and ( d.cico_id = v_cico_id or v_cico_id = 0 )
            and ( fv.emp_id = v_emp_id or v_emp_id = 0 )
            and ( ( exists ( select rptarb_hojaid
                             from rptArbolRamaHoja
                             where rptarb_cliente = v_clienteID
                               and tbl_id = 1016
                               and rptarb_hojaid = d.cico_id ) )
                   or ( v_ram_id_CircuitoContable = 0 ) )
            and ( ( exists ( select rptarb_hojaid
                             from rptArbolRamaHoja
                             where rptarb_cliente = v_clienteID
                               and tbl_id = 1018
                               and rptarb_hojaid = fv.emp_id ) )
                   or ( v_ram_id_Empresa = 0 ) )
        );

      if exists ( select *
                  from tt_t_dc_csc_con_0020_check t1
                  inner join tt_t_dc_csc_con_0020_check t2
                      on    t1.emp_id = t2.emp_id
                        and t1.letra = t2.letra
                        and t1.sucursal = t2.sucursal
                        and t1.doct_id = t2.doct_id
                        and t1.fv_fecha < t2.fv_fecha
                        and t1.nrodoc > t2.nrodoc ) then

         for v_emp_id_check,v_fv_id,v_fv_fecha,v_letra,v_sucursal,v_nrodoc,v_doct_id in
               select distinct
                      t1.emp_id,
                      t1.fv_id,
                      t1.fv_fecha,
                      t1.letra,
                      t1.sucursal,
                      t1.nrodoc,
                      t1.doct_id
               from tt_t_dc_csc_con_0020_check t1
                    inner join tt_t_dc_csc_con_0020_check t2
                      on    t1.emp_id = t2.emp_id
                        and t1.letra = t2.letra
                        and t1.sucursal = t2.sucursal
                        and t1.doct_id = t2.doct_id
               where t1.fv_fecha < t2.fv_fecha
                 and t1.nrodoc > t2.nrodoc
         loop
               if isnumeric(v_nrodoc) = 0 then

                  insert into tt_t_dc_csc_con_0020_mal( fv_id ) values ( v_fv_id );

               else

                  v_numero := to_number(v_nrodoc);

                  v_n := 1;

                  while v_n < 3 loop

                        v_fv_nrodoc_next := null;

                        -- Proxima factura
                        --
                        select min(fv_nrodoc) into v_fv_nrodoc_next
                        from FacturaVenta
                        where emp_id = v_emp_id_check
                          and substr(fv_nrodoc, 1, 1) = v_letra
                          and substr(fv_nrodoc, 3, 4) = v_sucursal
                          and fv_fecha > v_fv_fecha
                          and fv_fechaiva >= p_Fini
                          and fv_fechaiva <= p_Ffin
                          and doct_id = v_doct_id;

                        -- Si existe una factura
                        --
                        if coalesce(v_fv_nrodoc_next, '') <> '' then

                           select fv_id,
                                  substr(fv_nrodoc, 9, 255)
                             into v_fv_id_next,
                                  v_nrodoc_next
                           from FacturaVenta
                           where emp_id = v_emp_id_check
                             and fv_nrodoc = v_fv_nrodoc_next
                             and fv_fechaiva >= p_Fini
                             and fv_fechaiva <= p_Ffin
                             and doct_id = v_doct_id;

                           -- Si la proxima es un numero
                           --
                           if isnumeric(v_nrodoc_next) <> 0 then

                              v_numero_next := to_number(v_nrodoc_next);

                              if v_numero_next < v_numero then

                                 v_n := 3;

                                 insert into tt_t_dc_csc_con_0020_mal ( fv_id, fv_id_next ) values ( v_fv_id, v_fv_id_next );

                              end if;
                           end if;
                        end if;

                        v_n := v_n + 1;

                  end loop;
               end if;
         end loop;

         open rtn for
            select '@@ERROR_SP_RS: Existen facturas que estan fuera de secuencia' error_in_sp_id,
                   fv.fv_id comp_id,
                   fv.doct_id doct_id,
                   fv.fv_fecha Fecha,
                   fv.fv_nrodoc Comprobante,
                   fv.fv_numero Numero,
                   'Esta en conflicto con ' Info,
                   fv2.fv_fecha Fecha,
                   fv2.fv_nrodoc Comprobante,
                   fv2.fv_numero Numero
            from tt_t_dc_csc_con_0020_mal t
            join FacturaVenta fv on t.fv_id = fv.fv_id
            left join FacturaVenta fv2 on t.fv_id_next = fv2.fv_id
            order by substr(fv.fv_nrodoc, 1, 1),
                     substr(fv.fv_nrodoc, 3, 4),
                     fv.fv_fecha,
                     substr(fv.fv_nrodoc, 9, 255);

         return;
      end if;

      v_last_letra := '';
      v_last_sucursal := '';
      v_last_nrodoc := '';

      for v_fv_id,v_doct_id,v_letra,v_sucursal,v_nrodoc in
            select fv_id,
                   doct_id,
                   letra,
                   sucursal,
                   nrodoc
            from tt_t_dc_csc_con_0020_check
            order by doct_id,
                   letra,
                   sucursal,
                   nrodoc
      loop

            if v_last_doct_id <> v_doct_id then

               v_last_letra := '';

            end if;

            if v_letra <> v_last_letra then

               v_last_nrodoc := '';
               v_last_sucursal := '';

            end if;

            if v_sucursal <> v_last_sucursal and v_last_sucursal <> '' then

               v_last_nrodoc := '';

            end if;

            if isnumeric(v_nrodoc) = 0 then

               insert into tt_t_dc_csc_con_0020_mal( fv_id, descrip )
               values ( v_fv_id, 'El Numero de comprobante es invalido' );

            else

               if v_last_nrodoc <> '' then

                  if isnumeric(v_last_nrodoc) <> 0 then

                     if to_number(v_nrodoc) <> to_number(v_last_nrodoc) + 1 then

                        insert into tt_t_dc_csc_con_0020_mal( fv_id, descrip, fv_id_next )
                        values ( v_fv_id, 'El comprobante anterior a esta factura es [ Faltan Numeros entre los comprobantes.', v_last_fv_id );

                     end if;
                  end if;
               end if;
            end if;

            v_last_letra := v_letra;
            v_last_sucursal := v_sucursal;
            v_last_nrodoc := v_nrodoc;
            v_last_fv_id := v_fv_id;

      end loop;

      if exists ( select * from tt_t_dc_csc_con_0020_mal  ) then

         open rtn for
            select '@@ERROR_SP_RS: Existen facturas que estan fuera de secuencia' error_in_sp_id,
                   fv.fv_id comp_id,
                   fv.doct_id doct_id,
                   fv.fv_fecha Fecha,
                   fv.fv_nrodoc Comprobante,
                   fv.fv_numero Numero,
                   replace(descrip, '', coalesce(fv2.fv_nrodoc || ' (numero interno: ' || to_char(fv2.fv_numero) || ')', '')) Info
            from tt_t_dc_csc_con_0020_mal t
            join FacturaVenta fv on t.fv_id = fv.fv_id
            left join FacturaVenta fv2 on t.fv_id_next = fv2.fv_id
            order by substr(fv.fv_nrodoc, 1, 1),
                     substr(fv.fv_nrodoc, 3, 4),
                     fv.fv_fecha,
                     substr(fv.fv_nrodoc, 9, 255);

         return;
      end if;
   end if;

   insert into tt_t_dc_csc_con_0020_fv
   ( select fv_id from FacturaVenta where fv_fechaiva between p_Fini and p_Ffin );

   --------------------------------------------------------------------------------------------------
   -- TRATAMIENTO DE PERIODOS SIN MOVIMIENTOS
   --------------------------------------------------------------------------------------------------
   if exists ( select fv.fv_id
               from FacturaVenta fv
               join Documento d
                 on fv.doc_id = d.doc_id
                and fv.fv_fechaiva >= p_Fini
                and fv.fv_fechaiva <= p_Ffin
               where ( exists ( select *
                                from EmpresaUsuario
                                where emp_id = d.emp_id
                                  and us_id = p_us_id )
                       or ( p_us_id = 1 ) )

                 and ( d.cico_id = v_cico_id or v_cico_id = 0 )
                 and ( d.emp_id = v_emp_id or v_emp_id = 0 )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                  where rptarb_cliente = v_clienteID
                                    and tbl_id = 1016
                                    and rptarb_hojaid = d.cico_id ) )
                     or ( v_ram_id_CircuitoContable = 0 ) )
                 and ( ( exists ( select rptarb_hojaid
                                  from rptArbolRamaHoja
                                  where rptarb_cliente = v_clienteID
                                    and tbl_id = 1018
                                    and rptarb_hojaid = d.emp_id ) )
                         or ( v_ram_id_Empresa = 0 ) ) ) then

      insert into tt_t_dc_csc_con_0020( col_dummy ) values ( 1 );

   end if;

   open rtn for
      select 0 comp_id,
             p_Fini Fecha,
             '' Documento,
             '' Empresa,
             '' Letra,
             '' Comprobante,
             'Mes sin movimientos' Cliente,
             '' CUIT,
             '' Tipo_de_Documento,
             '' Condicion_IVA,
             '' Condicion_IVA2,
             0 Neto,
             0 Base,
             0 Base_Iva,
             0 Tasa_Iva,
             0 Importe_Iva,
             0 Importe_interno,
             '' Concepto,
             0 Importe_concepto,
             0 Total,
             0 Orden,-- Separa Comprobantes de Totales, y tipos de totales

             1 Orden2,-- Separa tipos de renglon

             0 Orden3-- Separa Comprobantes de totales

        -- (es decir todos los totales tienen el mismo valor (1))
      from tt_t_dc_csc_con_0020

      union ALL

      select fv.fv_id comp_id,
             fv_fecha Fecha,
             case d.doct_id
                when 1 then 'FAC'
                when 7 then 'NC'
                when 9 then 'ND'
             end Documento,
             emp_nombre Empresa,
             substr(fv_nrodoc, 1, 1) Letra,
             fv_nrodoc Comprobante,
             cli_razonsocial Cliente,
             cli_cuit CUIT,
             '' Tipo_de_Documento,
             case cli_catfiscal
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
                when 11 then 'Inscripto M'
                else 'Sin categorizar'
             end Condicion_IVA,
             case cli_catfiscal
                when 1 then 'in'
                when 2 then 'EX'
                when 3 then 'NI'
                when 4 then 'CF'
                when 5 then 'EJ'
                when 6 then 'M'
                when 7 then 'EJI'
                when 8 then 'NR'
                when 9 then 'NRE'
                when 10 then 'NC'
                when 11 then 'IM'
                else 'SC'
             end Condicion_IVA2,
             case d.doct_id
                when 7 then -fv_neto
                else fv_neto
             end Neto,
             case fvi_ivariporc
                when 0 then 0
                else case d.doct_id
                        when 7 then -sum(fvi_neto - (fvi_neto * fv_descuento1 / 100)
                                                  - ((fvi_neto - (fvi_neto * fv_descuento1 / 100))
                                                      * fv_descuento2 / 100))
                        else sum(fvi_neto - (fvi_neto * fv_descuento1 / 100)
                                          - ((fvi_neto - (fvi_neto * fv_descuento1 / 100))
                                                      * fv_descuento2 / 100))
                       end
             end Base,
             case fvi_ivariporc
                when 0 then 0
                else case d.doct_id
                        when 7 then -sum(fvi_neto - (fvi_neto * fv_descuento1 / 100)
                                                  - ((fvi_neto - (fvi_neto * fv_descuento1 / 100))
                                                           * fv_descuento2 / 100))
                        else sum(fvi_neto - (fvi_neto * fv_descuento1 / 100)
                                          - ((fvi_neto - (fvi_neto * fv_descuento1 / 100))
                                                           * fv_descuento2 / 100))
                     end
             end Base_Iva,
             fvi_ivariporc Tasa_Iva,
             case fvi_ivariporc
                when 0 then 0
                else case d.doct_id
                        when 7 then -sum(fvi_ivari - (fvi_ivari * fv_descuento1 / 100)
                                                   - ((fvi_ivari - (fvi_ivari * fv_descuento1 / 100))
                                                           * fv_descuento2 / 100))
                        else sum(fvi_ivari - (fvi_ivari * fv_descuento1 / 100)
                                           - ((fvi_ivari - (fvi_ivari * fv_descuento1 / 100))
                                                           * fv_descuento2 / 100))
                     end
             end Importe_Iva,
             0 Importe_interno,
             '' Concepto,
             case fvi_ivariporc
                when 0 then
                    case d.doct_id
                       when 7 then -sum(fvi_neto - (fvi_neto * fv_descuento1 / 100)
                                                 - ((fvi_neto - (fvi_neto * fv_descuento1 / 100))
                                                           * fv_descuento2 / 100))
                       else sum(fvi_neto - (fvi_neto * fv_descuento1 / 100)
                                                 - ((fvi_neto - (fvi_neto * fv_descuento1 / 100))
                                                           * fv_descuento2 / 100))
                    end
                else 0
             end Importe_concepto,
             case d.doct_id
                when 7 then -fv_total
                else fv_total
             end Total,
             0 Orden,-- Separa Comprobantes de Totales, y tipos de totales
             1 Orden2,-- Separa tipos de renglon
             0 Orden3-- Separa Comprobantes de totales

        -- (es decir todos los totales tienen el mismo valor (1))
        from ( FacturaVenta fv join tt_t_dc_csc_con_0020_fv t on fv.fv_id = t.fv_id )
        join Documento d on fv.doc_id = d.doc_id
        join Empresa on d.emp_id = Empresa.emp_id
        join Cliente c on fv.cli_id = c.cli_id
        join FacturaVentaItem fvi on fv.fv_id = fvi.fv_id
        where fv.est_id <> 7-- Anuladas
          and ( exists ( select *
                         from EmpresaUsuario
                         where emp_id = d.emp_id
                           and us_id = p_us_id )
                 or ( p_us_id = 1 ) )
          and ( d.cico_id = v_cico_id or v_cico_id = 0 )
          and ( Empresa.emp_id = v_emp_id or v_emp_id = 0 )
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                           where rptarb_cliente = v_clienteID
                             and tbl_id = 1016
                             and rptarb_hojaid = d.cico_id ) )
                 or ( v_ram_id_CircuitoContable = 0 ) )
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                           where rptarb_cliente = v_clienteID
                             and tbl_id = 1018
                             and rptarb_hojaid = d.emp_id ) )
                 or ( v_ram_id_Empresa = 0 ) )
        group by fv.fv_id,fv_fecha,doc_codigo,d.doct_id,emp_nombre,fv_nrodoc,cli_razonsocial,cli_cuit,cli_catfiscal,fvi_ivariporc,fv_neto,fv_total

      union ALL

      --------------------------------------------------------------------------------------------------
      -- PERCEPCIONES
      --------------------------------------------------------------------------------------------------

      select fv.fv_id comp_id,
             fv_fecha Fecha,
             case d.doct_id
                when 1 then 'FAC'
                when 7 then 'NC'
                when 9 then 'ND'
             end Documento,
             emp_nombre Empresa,
             substr(fv_nrodoc, 1, 1) Letra,
             fv_nrodoc Comprobante,
             cli_razonsocial Cliente,
             cli_cuit CUIT,
             '' Tipo_de_Documento,
             case cli_catfiscal
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
                when 11 then 'Inscripto M'
                else 'Sin categorizar'
             end Condicion_IVA,
             case cli_catfiscal
                when 1 then 'in'
                when 2 then 'EX'
                when 3 then 'NI'
                when 4 then 'CF'
                when 5 then 'EJ'
                when 6 then 'M'
                when 7 then 'EJI'
                when 8 then 'NR'
                when 9 then 'NRE'
                when 10 then 'NC'
                when 11 then 'IM'
                else 'SC'
             end Condicion_IVA2,
              0 Neto,
              case d.doct_id
                 when 7 then -fvperc_base
                 else fvperc_base
              end Base,
              0 Base_Iva,
              fvperc_porcentaje Tasa_Iva,
              0 Importe_Iva,
              case d.doct_id
                 when 7 then -fvperc_importe
                 else fvperc_importe
              end Importe_interno,
              perc_nombre Concepto,
              0 Importe_concepto,
              0 Total,
              0 Orden,
              2 Orden2,
              0 Orden3 -- Separa comprobantes de totales
                       -- (es decir todos los totales tienen el mismo valor (1))
        from ( FacturaVenta fv join tt_t_dc_csc_con_0020_fv t on fv.fv_id = t.fv_id )
        join Documento d on fv.doc_id = d.doc_id
        join Empresa on d.emp_id = Empresa.emp_id
        join Cliente p on fv.cli_id = p.cli_id
        join FacturaVentaPercepcion fvp on fv.fv_id = fvp.fv_id
        join Percepcion perc on fvp.perc_id = perc.perc_id
        where fv.est_id <> 7-- Anuladas
            and ( exists ( select *
                           from EmpresaUsuario
                           where emp_id = d.emp_id
                             and us_id = p_us_id )
                 or ( p_us_id = 1 ) )
            and ( d.cico_id = v_cico_id or v_cico_id = 0 )
            and ( Empresa.emp_id = v_emp_id or v_emp_id = 0 )
            and ( ( exists ( select rptarb_hojaid
                             from rptArbolRamaHoja
                             where rptarb_cliente = v_clienteID
                               and tbl_id = 1016
                               and rptarb_hojaid = d.cico_id ) )
                    or ( v_ram_id_CircuitoContable = 0 ) )
            and ( ( exists ( select rptarb_hojaid
                             from rptArbolRamaHoja
                             where rptarb_cliente = v_clienteID
                               and tbl_id = 1018
                               and rptarb_hojaid = d.emp_id ) )
                    or ( v_ram_id_Empresa = 0 ) )
      union ALL

      --------------------------------------------------------------------------------------------------
      -- ANULADAS
      --------------------------------------------------------------------------------------------------

      select fv.fv_id comp_id,
             fv_fecha Fecha,
             case d.doct_id
                when 1 then 'FAC'
                when 7 then 'NC'
                when 9 then 'ND'
             end Documento,
             emp_nombre Empresa,
             substr(fv_nrodoc, 1, 1) Letra,
             fv_nrodoc Comprobante,
             'ANULADA' Cliente,
             '' CUIT,
             '' Tipo_de_Documento,
             '' Condicion_IVA,
             '' Condicion_IVA2,
             0 Neto,
             0 Base,
             0 Base_Iva,
             0 Tasa_Iva,
             0 Importe_Iva,
             0 Importe_interno,
             '' Concepto,
             0 Importe_concepto,
             0 Total,
             0 Orden,
             0 Orden2,
             0 Orden3 -- Separa comprobantes de totales
                      -- (es decir todos los totales tienen el mismo valor (1))
      from ( FacturaVenta fv join tt_t_dc_csc_con_0020_fv t on fv.fv_id = t.fv_id )
      join Documento d on fv.doc_id = d.doc_id
      join Empresa on d.emp_id = Empresa.emp_id
      join Cliente c on fv.cli_id = c.cli_id
      where fv.est_id = 7-- Anuladas
        and ( exists ( select *
                       from EmpresaUsuario
                       where emp_id = d.emp_id
                         and us_id = p_us_id )
              or ( p_us_id = 1 ) )
        and ( d.cico_id = v_cico_id or v_cico_id = 0 )
        and ( Empresa.emp_id = v_emp_id or v_emp_id = 0 )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1016
                           and rptarb_hojaid = d.cico_id ) )
                 or ( v_ram_id_CircuitoContable = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1018
                           and rptarb_hojaid = d.emp_id ) )
                 or ( v_ram_id_Empresa = 0 ) )

      --------------------------------------------------------------------------------------------------
      -- TOTAL TASAS IVA
      --------------------------------------------------------------------------------------------------

      union ALL
      select 0 comp_id,
             v_no_date Fecha,
             '' Documento,
             '' Empresa,
             '' Letra,
             '' Comprobante,
             '' Cliente,
             '' CUIT,
             '' Tipo_de_Documento,
             '' Condicion_IVA,
             '' Condicion_IVA2,
             0 Neto,
             sum(case d.doct_id
                    when 7 then -fvi_neto - (fvi_neto * fv_descuento1 / 100)
                                          - ((fvi_neto - (fvi_neto * fv_descuento1 / 100))
                                                   * fv_descuento2 / 100)
                    else fvi_neto - (fvi_neto * fv_descuento1 / 100)
                                  - ((fvi_neto - (fvi_neto * fv_descuento1 / 100))
                                                   * fv_descuento2 / 100)
             end) Base,
             0 Base_Iva,
             fvi_ivariporc Tasa_Iva,
             sum(case d.doct_id
                    when 7 then -fvi_ivari - (fvi_ivari * fv_descuento1 / 100)
                                           - ((fvi_ivari - (fvi_ivari * fv_descuento1 / 100))
                                                   * fv_descuento2 / 100)
                    else fvi_ivari - (fvi_ivari * fv_descuento1 / 100)
                                   - ((fvi_ivari - (fvi_ivari * fv_descuento1 / 100))
                                                   * fv_descuento2 / 100)
             end) Importe_Iva,
             0 Importe_interno,
             case
                when ti_codigodgi1 <> '' then ti_codigodgi1
                else ti_nombre
             end Concepto,
             0 Importe_concepto,
             0 Total,
             1 Orden,
             0 Orden2,
             1 Orden3 -- Separa comprobantes de totales
                      -- (es decir todos los totales tienen el mismo valor (1))
        from ( FacturaVenta fv join tt_t_dc_csc_con_0020_fv t on fv.fv_id = t.fv_id )
        join Documento d on fv.doc_id = d.doc_id
        join Empresa on d.emp_id = Empresa.emp_id
        join FacturaVentaItem fvi on fv.fv_id = fvi.fv_id
        join Producto pr on fvi.pr_id = pr.pr_id
        join TasaImpositiva ti on pr.ti_id_ivariventa = ti.ti_id
        where fv.est_id <> 7-- Anuladas
          and ( exists ( select *
                         from EmpresaUsuario
                         where emp_id = d.emp_id
                           and us_id = p_us_id )
                 or ( p_us_id = 1 ) )
          and ( d.cico_id = v_cico_id or v_cico_id = 0 )
          and ( Empresa.emp_id = v_emp_id or v_emp_id = 0 )
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                           where rptarb_cliente = v_clienteID
                             and tbl_id = 1016
                             and rptarb_hojaid = d.cico_id ) )
                 or ( v_ram_id_CircuitoContable = 0 ) )
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                           where rptarb_cliente = v_clienteID
                             and tbl_id = 1018
                             and rptarb_hojaid = d.emp_id ) )
                 or ( v_ram_id_Empresa = 0 ) )
        group by case
                    when ti_codigodgi1 <> '' then ti_codigodgi1
                    else ti_nombre
                 end,
                 fvi_ivariporc

      --------------------------------------------------------------------------------------------------
      -- TOTAL CATEGORIAS FISCALES
      --------------------------------------------------------------------------------------------------

      union ALL
      select 0 comp_id,
             v_no_date Fecha,
             '' Documento,
             '' Empresa,
             '' Letra,
             '' Comprobante,
             '' Cliente,
             '' CUIT,
             '' Tipo_de_Documento,
             case cli_catfiscal
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
                when 11 then 'Inscripto M'
                else 'Sin categorizar'
             end Condicion_IVA,
             case cli_catfiscal
                when 1 then 'in'
                when 2 then 'EX'
                when 3 then 'NI'
                when 4 then 'CF'
                when 5 then 'EJ'
                when 6 then 'M'
                when 7 then 'EJI'
                when 8 then 'NR'
                when 9 then 'NRE'
                when 10 then 'NC'
                when 11 then 'IM'
                else 'SC'
             end Condicion_IVA2,
             0 Neto,
             sum(case d.doct_id
                    when 7 then -fvi_neto - (fvi_neto * fv_descuento1 / 100) - ((fvi_neto - (fvi_neto * fv_descuento1 / 100)) * fv_descuento2 / 100)
                    else fvi_neto - (fvi_neto * fv_descuento1 / 100) - ((fvi_neto - (fvi_neto * fv_descuento1 / 100)) * fv_descuento2 / 100)
                end) Base,
             0 Base_Iva,
             fvi_ivariporc Tasa_Iva,
             sum(case d.doct_id
                    when 7 then -fvi_ivari - (fvi_ivari * fv_descuento1 / 100) - ((fvi_ivari - (fvi_ivari * fv_descuento1 / 100)) * fv_descuento2 / 100)
                    else fvi_ivari - (fvi_ivari * fv_descuento1 / 100) - ((fvi_ivari - (fvi_ivari * fv_descuento1 / 100)) * fv_descuento2 / 100)
                 end) Importe_Iva,
             0 Importe_interno,
             case
                when ti_codigodgi1 <> '' then ti_codigodgi1
                else ti_nombre
             end Concepto,
             0 Importe_concepto,
             0 Total,
             2 Orden,
             0 Orden2,
             1 Orden3 -- separa Comprobantes de totales
                      -- (es decir todos los totales tienen el mismo valor (1))
      from ( FacturaVenta fv join tt_t_dc_csc_con_0020_fv t on fv.fv_id = t.fv_id )
      join Documento d on fv.doc_id = d.doc_id
      join Empresa on d.emp_id = Empresa.emp_id
      join FacturaVentaItem fvi on fv.fv_id = fvi.fv_id
      join Producto pr on fvi.pr_id = pr.pr_id
      join TasaImpositiva ti on pr.ti_id_ivariventa = ti.ti_id
      join Cliente cli on fv.cli_id = cli.cli_id
      where fv.est_id <> 7-- Anuladas
        and ( exists ( select *
                       from EmpresaUsuario
                       where emp_id = d.emp_id
                         and us_id = p_us_id )
                  or ( p_us_id = 1 ) )
        and ( d.cico_id = v_cico_id or v_cico_id = 0 )
        and ( Empresa.emp_id = v_emp_id or v_emp_id = 0 )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1016
                           and rptarb_hojaid = d.cico_id ) )
                 or ( v_ram_id_CircuitoContable = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1018
                           and rptarb_hojaid = d.emp_id ) )
                 or ( v_ram_id_Empresa = 0 ) )
      group by case cli_catfiscal
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
                  when 11 then 'Inscripto M'
                  else 'Sin categorizar'
               end,
               case cli_catfiscal
                  when 1 then 'in'
                  when 2 then 'EX'
                  when 3 then 'NI'
                  when 4 then 'CF'
                  when 5 then 'EJ'
                  when 6 then 'M'
                  when 7 then 'EJI'
                  when 8 then 'NR'
                  when 9 then 'NRE'
                  when 10 then 'NC'
                  when 11 then 'IM'
                  else 'SC'
               end,
               case
                  when ti_codigodgi1 <> '' then ti_codigodgi1
                  else ti_nombre
               end,
               fvi_ivariporc

      --------------------------------------------------------------------------------------------------
      -- TOTAL TASAS PERCEPCIONES
      --------------------------------------------------------------------------------------------------

      union ALL

      select 0 comp_id,
             v_no_date Fecha,
             '' Documento,
             '' Empresa,
             '' Letra,
             '' Comprobante,
             '' Cliente,
             '' CUIT,
             '' Tipo_de_Documento,
             '' Condicion_IVA,
             '' Condicion_IVA2,
             0 Neto,
             sum(case d.doct_id
                    when 7 then -fvperc_base
                    else fvperc_base
                 end) Base,
             0 Base_Iva,
             fvperc_porcentaje Tasa_Iva,
             0 Importe_Iva,
             sum(case d.doct_id
                    when 7 then -fvperc_importe
                    else fvperc_importe
                 end) Importe_interno,
             perc_nombre Concepto,
             0 Importe_concepto,
             0 Total,
             4 Orden,
             0 Orden2,
             1 Orden3 -- Separa comprobantes de totales
                      -- (es decir todos los totales tienen el mismo valor (1))
      from ( FacturaVenta fv join tt_t_dc_csc_con_0020_fv t on fv.fv_id = t.fv_id )
             join Documento d on fv.doc_id = d.doc_id
             join Empresa on d.emp_id = Empresa.emp_id
             join Cliente p on fv.cli_id = p.cli_id
             join FacturaVentaPercepcion fvp on fv.fv_id = fvp.fv_id
             join Percepcion perc on fvp.perc_id = perc.perc_id
      where fv.est_id <> 7-- Anuladas
          and ( exists ( select *
                         from EmpresaUsuario
                         where emp_id = d.emp_id
                           and us_id = p_us_id )
                or ( p_us_id = 1 ) )
          and ( d.cico_id = v_cico_id or v_cico_id = 0 )
          and ( Empresa.emp_id = v_emp_id or v_emp_id = 0 )
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                           where rptarb_cliente = v_clienteID
                             and tbl_id = 1016
                             and rptarb_hojaid = d.cico_id ) )
                or ( v_ram_id_CircuitoContable = 0 ) )
          and ( ( exists ( select rptarb_hojaid
                           from rptArbolRamaHoja
                           where rptarb_cliente = v_clienteID
                             and tbl_id = 1018
                             and rptarb_hojaid = d.emp_id ) )
                or ( v_ram_id_Empresa = 0 ) )
      group by perc_nombre,fvperc_porcentaje

      union ALL

      select 0 comp_id,
             v_no_date Fecha,
             '' Documento,
             '' Empresa,
             '' Letra,
             '' Comprobante,
             '' Cliente,
             '' CUIT,
             doct_nombre Tipo_de_Documento,
             case cli_catfiscal
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
                when 11 then 'Inscripto M'
                else 'Sin categorizar'
             end Condicion_IVA,
             case cli_catfiscal
                when 1 then 'in'
                when 2 then 'EX'
                when 3 then 'NI'
                when 4 then 'CF'
                when 5 then 'EJ'
                when 6 then 'M'
                when 7 then 'EJI'
                when 8 then 'NR'
                when 9 then 'NRE'
                when 10 then 'NC'
                when 11 then 'IM'
                else 'SC'
             end Condicion_IVA2,
             0 Neto,
             sum(case d.doct_id
                    when 7 then -fvi_neto - (fvi_neto * fv_descuento1 / 100) - ((fvi_neto - (fvi_neto * fv_descuento1 / 100)) * fv_descuento2 / 100)
                    else fvi_neto - (fvi_neto * fv_descuento1 / 100) - ((fvi_neto - (fvi_neto * fv_descuento1 / 100)) * fv_descuento2 / 100)
                 end) Base,
             0 Base_Iva,
             fvi_ivariporc Tasa_Iva,
             sum(case d.doct_id
                    when 7 then -fvi_ivari - (fvi_ivari * fv_descuento1 / 100) - ((fvi_ivari - (fvi_ivari * fv_descuento1 / 100)) * fv_descuento2 / 100)
                    else fvi_ivari - (fvi_ivari * fv_descuento1 / 100) - ((fvi_ivari - (fvi_ivari * fv_descuento1 / 100)) * fv_descuento2 / 100)
                 end) Importe_Iva,
             0 Importe_interno,
             case
                when ti_codigodgi1 <> '' then ti_codigodgi1
                else ti_nombre
             end Concepto,
             0 Importe_concepto,
             0 Total,
             3 Orden,
             0 Orden2,
             1 Orden3 -- Separa comprobantes de totales
                      -- (es decir todos los totales tienen el mismo valor (1))
      from ( FacturaVenta fv join tt_t_dc_csc_con_0020_fv t on fv.fv_id = t.fv_id )
      join Documento d on fv.doc_id = d.doc_id
      join Empresa on d.emp_id = Empresa.emp_id
      join FacturaVentaItem fvi on fv.fv_id = fvi.fv_id
      join Producto pr on fvi.pr_id = pr.pr_id
      join TasaImpositiva ti on pr.ti_id_ivariventa = ti.ti_id
      join Cliente cli on fv.cli_id = cli.cli_id
      join DocumentoTipo doct on fv.doct_id = doct.doct_id
      where fv.est_id <> 7-- Anuladas
        and ( exists ( select *
                       from EmpresaUsuario
                       where emp_id = d.emp_id
                         and us_id = p_us_id )
              or ( p_us_id = 1 ) )
        and ( d.cico_id = v_cico_id or v_cico_id = 0 )
        and ( Empresa.emp_id = v_emp_id or v_emp_id = 0 )
        and ( exists ( select rptarb_hojaid
                       from rptArbolRamaHoja
                       where rptarb_cliente = v_clienteID
                         and tbl_id = 1016
                         and rptarb_hojaid = d.cico_id )
              or ( v_ram_id_CircuitoContable = 0 ) )
        and ( exists ( select rptarb_hojaid
                       from rptArbolRamaHoja
                       where rptarb_cliente = v_clienteID
                         and tbl_id = 1018
                         and rptarb_hojaid = d.emp_id )
              or ( v_ram_id_Empresa = 0 ) )
      group by case cli_catfiscal
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
                  when 11 then 'Inscripto M'
                  else 'Sin categorizar'
               end,
               case cli_catfiscal
                  when 1 then 'in'
                  when 2 then 'EX'
                  when 3 then 'NI'
                  when 4 then 'CF'
                  when 5 then 'EJ'
                  when 6 then 'M'
                  when 7 then 'EJI'
                  when 8 then 'NR'
                  when 9 then 'NRE'
                  when 10 then 'NC'
                  when 11 then 'IM'
                  else 'SC'
               end,
               doct_nombre,
               case
                  when ti_codigodgi1 <> '' then ti_codigodgi1
                  else ti_nombre
               end,
               fvi_ivariporc
      order by orden3, -- Separa comprobantes de totales
               orden,  -- Separa comprobantes de totales y tipos de totales entre si
               letra,
               Fecha,
               Comprobante,
               orden2, -- Separa tipos de renglon en las facturas (total, percepcion, otras tasas de iva, anuladas)
               Condicion_IVA;
end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function dc_csc_con_0020(integer, date, date, varchar, varchar, integer)
  owner to postgres;