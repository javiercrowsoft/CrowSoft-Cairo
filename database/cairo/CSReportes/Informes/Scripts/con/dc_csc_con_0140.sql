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
-- Function: dc_csc_con_0140()

-- drop function dc_csc_con_0140(integer, timestamp with time zone, timestamp with time zone, varchar, varchar, varchar, varchar, varchar, varchar, integer, integer, integer, integer, varchar);

/*---------------------------------------------------------------------
name: Listado de sumas y saldos
---------------------------------------------------------------------*/

/*

select * from dc_csc_con_0140 (1, '2000-05-03', '2016-05-12', '0', '0', '0', '0');
fetch all from rtn;

*/

/*
exec [dc_csc_con_0140] 1,'20010309 00:00:00','20100309 00:00:00','0','0','0','0','0',56,0,0,0,0,5
exec [dc_csc_con_0140] 1,'20010309 00:00:00','20100309 00:00:00','0','0','0','0','0',56,0,0,0,0,0
*/

create or replace function dc_csc_con_0140
(
  in p_us_id integer,
  in p_Fini timestamp with time zone,
  in p_Ffin timestamp with time zone,

  in p_cue_id varchar,
  in p_cico_id varchar,
  in p_doc_id varchar,
  in p_mon_id varchar,
  in p_emp_id varchar,
  in ip_arb_id varchar default '0',
  in p_usarCodigo integer default 0,
  in p_resumido integer default 0,
  in p_ocultardh integer default 0,
  in p_ocultarsaldo0 integer default 0,
  in ip_arbv_id varchar default '0',
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   p_arb_id integer := to_number(ip_arb_id);
   p_arbv_id integer := to_number(ip_arbv_id);
   v_cue_id integer;
   v_mon_id integer;
   v_emp_id integer;
   v_cico_id integer;
   v_doc_id integer;

   v_ram_id_cuenta integer;
   v_ram_id_moneda integer;
   v_ram_id_empresa integer;
   v_ram_id_circuitocontable integer;
   v_ram_id_documento integer;

   v_clienteID integer;
   v_clienteIDccosi integer;
   v_IsRaiz smallint;

   v_arb_nombre varchar;
   v_n integer;
   v_raiz integer;
   v_arb_id_param_cuenta integer;

begin

   create temporary table tt_dc_csc_con_0140_cuentas
   (
     nodo_id integer,
     nodo_2 integer,
     nodo_3 integer,
     nodo_4 integer,
     nodo_5 integer,
     nodo_6 integer,
     nodo_7 integer,
     nodo_8 integer,
     nodo_9 integer
   ) on commit drop;

   create temporary table tt_t_hoja
   (
     hoja_id integer,
     ram_id integer,
     ram_estado integer
   ) on commit drop;

   -- validacion de parametros
   -- si me pasan un p_arbv_id y no pasan p_abr_id
   -- tomo arb_id de p_arbv_id
   --
   if p_arb_id = 0 and p_arbv_id <> 0 then

      select arb_id
        into p_arb_id
      from ArbolVista
      where arbv_id = p_arbv_id;

   end if;

   rtn := 'rtn';

   -- valido que arb_id de p_arbv_id y arb_id de p_arb_id sean el mismo
   --
   if p_arb_id <> 0 and p_arbv_id <> 0 then

      if not exists( select 1 from ArbolVista where arbv_id = p_arbv_id and arb_id = p_arb_id ) then

         open rtn for
            select '@@ERROR_SP_RS:El arbol indicado en el parametro "Plan de Cuentas" no coincide con el indicado en el parametro "Vista".' error_in_sp_id,
                   a.arb_nombre Arbol,
                   v.arb_nombre Vista
            from ArbolVista av join Arbol v on av.arb_id = v.arb_id
                               join Arbol a on a.arb_id = p_arb_id
            where av.arbv_id = p_arbv_id;

         return;

      end if;
   end if;

   select * from sp_ArbConvertId(p_mon_id)  into v_mon_id,  v_ram_id_moneda;
   select * from sp_ArbConvertId(p_emp_id)  into v_emp_id,  v_ram_id_empresa;
   select * from sp_ArbConvertId(p_cue_id)  into v_cue_id,  v_ram_id_cuenta;
   select * from sp_ArbConvertId(p_cico_id) into v_cico_id, v_ram_id_circuitocontable;
   select * from sp_ArbConvertId(p_doc_id)  into v_doc_id,  v_ram_id_documento;

   -- valido que arb_id de arbv_id y arb_id de @@arb_id sean el mismo
   --
   if v_ram_id_cuenta <> 0 and p_arbv_id <> 0 then

      select arb_id
        into v_arb_id_param_cuenta
      from Rama
      where ram_id = v_ram_id_cuenta;

      if  not exists ( select 1
                       from ArbolVista
                       where arbv_id = p_arbv_id
                         and arb_id = v_arb_id_param_cuenta ) then
         open rtn for
            select '@@ERROR_SP_RS:El arbol al que pertenece la carpeta indicada en el parametro "Cuenta" no coincide con el indicado en el parametro "Vista".' error_in_sp_id,
                   a.arb_nombre Arbol,
                   v.arb_nombre Vista
            from ArbolVista av join Arbol v on av.arb_id = v.arb_id
                               join Arbol a on a.arb_id = v_arb_id_param_cuenta
            where av.arbv_id = p_arbv_id;

         return;

      end if;
   end if;

   select * from  sp_GetRptId() into v_clienteID;

   select * from  sp_GetRptId() into v_clienteIDccosi;

   if p_arb_id = 0 then
      select min(arb_id) into p_arb_id from Arbol where tbl_id = 17;-- cuenta
   end if;

   select arb_nombre
     into v_arb_nombre
   from Arbol
   where arb_id = p_arb_id;

   v_n := 2;

   while exists ( select *
                  from Rama r
                  where arb_id = p_arb_id
                    and not exists ( select * from tt_dc_csc_con_0140_cuentas where nodo_2 = r.ram_id )
                    and not exists ( select * from tt_dc_csc_con_0140_cuentas where nodo_3 = r.ram_id )
                    and not exists ( select * from tt_dc_csc_con_0140_cuentas where nodo_4 = r.ram_id )
                    and not exists ( select * from tt_dc_csc_con_0140_cuentas where nodo_5 = r.ram_id )
                    and not exists ( select * from tt_dc_csc_con_0140_cuentas where nodo_6 = r.ram_id )
                    and not exists ( select * from tt_dc_csc_con_0140_cuentas where nodo_7 = r.ram_id )
                    and not exists ( select * from tt_dc_csc_con_0140_cuentas where nodo_8 = r.ram_id )
                    and not exists ( select * from tt_dc_csc_con_0140_cuentas where nodo_9 = r.ram_id )
                    and v_n <= 9 )
   loop
         if v_n = 2 then
            select ram_id into v_raiz from Rama where arb_id = p_arb_id and ram_id_padre = 0;

            insert into tt_dc_csc_con_0140_cuentas ( nodo_id, nodo_2 )
              ( select ram_id, ram_id from Rama where ram_id_padre = v_raiz );

         else

            if v_n = 3 then

               insert into tt_dc_csc_con_0140_cuentas ( nodo_id, nodo_2, nodo_3 )
                 ( select r.ram_id, nodo_2, r.ram_id
                   from Rama r join tt_dc_csc_con_0140_cuentas n on r.ram_id_padre = n.nodo_2 );

            else

               if v_n = 4 then

                  insert into tt_dc_csc_con_0140_cuentas ( nodo_id, nodo_2, nodo_3, nodo_4 )
                    ( select r.ram_id, nodo_2, nodo_3, r.ram_id
                      from Rama r join tt_dc_csc_con_0140_cuentas n on r.ram_id_padre = n.nodo_3 );

               else

                  if v_n = 5 then

                     insert into tt_dc_csc_con_0140_cuentas ( nodo_id, nodo_2, nodo_3, nodo_4, nodo_5 )
                       ( select r.ram_id, nodo_2, nodo_3, nodo_4, r.ram_id
                         from Rama r join tt_dc_csc_con_0140_cuentas n on r.ram_id_padre = n.nodo_4 );
                  else

                     if v_n = 6 then

                        insert into tt_dc_csc_con_0140_cuentas ( nodo_id, nodo_2, nodo_3, nodo_4, nodo_5, nodo_6 )
                          ( select r.ram_id, nodo_2, nodo_3, nodo_4, nodo_5, r.ram_id
                            from Rama r join tt_dc_csc_con_0140_cuentas n on r.ram_id_padre = n.nodo_5 );

                     else

                        if v_n = 7 then

                           insert into tt_dc_csc_con_0140_cuentas ( nodo_id, nodo_2, nodo_3, nodo_4, nodo_5, nodo_6, nodo_7 )
                             ( select r.ram_id, nodo_2, nodo_3, nodo_4, nodo_5, nodo_6, r.ram_id
                               from Rama r join tt_dc_csc_con_0140_cuentas n on r.ram_id_padre = n.nodo_6 );

                        else

                           if v_n = 8 then

                              insert into tt_dc_csc_con_0140_cuentas ( nodo_id, nodo_2, nodo_3, nodo_4, nodo_5, nodo_6, nodo_7, nodo_8 )
                                ( select r.ram_id, nodo_2, nodo_3, nodo_4, nodo_5, nodo_6, nodo_7, r.ram_id
                                  from Rama r join tt_dc_csc_con_0140_cuentas n on r.ram_id_padre = n.nodo_7 );

                           else

                              if v_n = 9 then

                                 insert into tt_dc_csc_con_0140_cuentas ( nodo_id, nodo_2, nodo_3, nodo_4, nodo_5, nodo_6, nodo_7, nodo_8, nodo_9 )
                                   ( select r.ram_id, nodo_2, nodo_3, nodo_4, nodo_5, nodo_6, nodo_7, nodo_8, r.ram_id
                                     from Rama r join tt_dc_csc_con_0140_cuentas n on r.ram_id_padre = n.nodo_8 );

                              end if;
                           end if;
                        end if;
                     end if;
                  end if;
               end if;
            end if;
         end if;

         v_n := v_n + 1;

   end loop;

   if v_ram_id_cuenta <> 0 then

      -- exec sp_ArbGetGroups @ram_id_cuenta, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_cuenta) into v_IsRaiz;

      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_cuenta, v_clienteID);
      else
         v_ram_id_cuenta := 0;
      end if;

      perform sp_ArbGetGroups(v_clienteID, p_arbv_id, v_IsRaiz);

  else
      perform sp_ArbGetGroups(v_clienteID, p_arbv_id, 1);
  end if;

   if v_ram_id_moneda <> 0 then

      --	exec sp_ArbGetGroups @ram_id_moneda, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_moneda) into v_IsRaiz;

      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_moneda, v_clienteID);
      else
         v_ram_id_moneda := 0;
      end if;
   end if;

   if v_ram_id_empresa <> 0 then

      --	exec sp_ArbGetGroups @ram_id_empresa, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_empresa) into v_IsRaiz;

      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_empresa, v_clienteID);
      else
         v_ram_id_empresa := 0;
      end if;
   end if;

   if v_ram_id_circuitocontable <> 0 then

      --	exec sp_ArbGetGroups @ram_id_circuitocontable, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_circuitocontable) into v_IsRaiz;

      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_circuitocontable,v_clienteID);
      else
         v_ram_id_circuitocontable := 0;
      end if;
   end if;

   if v_ram_id_documento <> 0 then
   
      -- exec sp_ArbGetGroups @ram_id_circuitocontable, @clienteID, @@us_id
      select sp_ArbIsRaiz(v_ram_id_documento) into v_IsRaiz;

      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_documento, v_clienteID);
      else
         v_ram_id_documento := 0;
      end if;
   end if;

   ---------------------------------------------------------------------------
   -- Necesito tener una tabla de hojas unica para poder
   -- procesar en una sola consulta llamadas que indican arbv_id
   -- y llamadas que no lo hacen
   --
   if p_arbv_id <> 0 then
      insert into tt_t_hoja
        ( hoja_id, ram_id, ram_estado )
        ( select rptarb_hojaid,
                 min(ram_id),
                 0
          from rptArbolRamaHoja
          where rptarb_cliente = v_clienteID and tbl_id = 17
          group by rptarb_hojaid );


      update tt_t_hoja set ram_estado = r.ramv_estado
      from ramavista r
      where tt_t_hoja.ram_id = r.ram_id
        and arbv_id = p_arbv_id;

      /*
      update tt_t_hoja
         set ram_estado = ( select r.ramv_estado
                            from ramavista r
                            where ram_id = r.ram_id
                              and arbv_id = p_arbv_id
                          )
      where exists( select 1
                    from ramavista r
                    where ram_id = r.ram_id
                      and arbv_id = p_arbv_id
                  );

       */

      update tt_t_hoja set ram_estado = 1 where ram_estado = 0;

   else

      insert into tt_t_hoja
        ( hoja_id, ram_id, ram_estado )
        ( select id,
                 min(ram_id),
                 1
          from Hoja
          where arb_id = p_arb_id
          group by id );

   end if;

   open rtn for

      select cue.cue_id,
             emp.emp_nombre Empresa,
             v_arb_nombre Nivel_1,
             nodo_2.ram_nombre Nivel_2,
             nodo_3.ram_nombre Nivel_3,
             nodo_4.ram_nombre Nivel_4,
             nodo_5.ram_nombre Nivel_5,
             nodo_6.ram_nombre Nivel_6,
             nodo_7.ram_nombre Nivel_7,
             nodo_8.ram_nombre Nivel_8,
             nodo_9.ram_nombre Nivel_9,
             substr('00000' || to_char(nodo_2.ram_orden), -1, 5) || '@' || nodo_2.ram_nombre Nivelg_2,
             substr('00000' || to_char(nodo_3.ram_orden), -1, 5) || '@' || nodo_3.ram_nombre Nivelg_3,
             substr('00000' || to_char(nodo_4.ram_orden), -1, 5) || '@' || nodo_4.ram_nombre Nivelg_4,
             substr('00000' || to_char(nodo_5.ram_orden), -1, 5) || '@' || nodo_5.ram_nombre Nivelg_5,
             substr('00000' || to_char(nodo_6.ram_orden), -1, 5) || '@' || nodo_6.ram_nombre Nivelg_6,
             substr('00000' || to_char(nodo_7.ram_orden), -1, 5) || '@' || nodo_7.ram_nombre Nivelg_7,
             substr('00000' || to_char(nodo_8.ram_orden), -1, 5) || '@' || nodo_8.ram_nombre Nivelg_8,
             substr('00000' || to_char(nodo_9.ram_orden), -1, 5) || '@' || nodo_9.ram_nombre Nivelg_9,
             coalesce(h.ram_estado, 1) ram_estado,
             cuec.cuec_nombre Categoria,
             cue.cue_nombre Cuenta,
             cue.cue_codigo Codigo,
             case
                when p_usarCodigo = 0 then cue.cue_identificacionExterna
                else cue.cue_codigo
             end as "Codigo Contable",
             sum(asi.asi_debe) Debe,
             sum(asi.asi_haber) Haber,
             sum(asi.asi_debe) - sum(asi.asi_haber) Saldo

      from Asiento ast
        join AsientoItem asi on ast.as_id = asi.as_id
        join Cuenta cue on asi.cue_id = cue.cue_id
        join Documento doc on ast.doc_id = doc.doc_id
        join CuentaCategoria cuec on cue.cuec_id = cuec.cuec_id
        join Empresa emp on doc.emp_id = emp.emp_id
        left join Documento doccl on ast.doc_id_cliente = doccl.doc_id
        left join tt_t_hoja h on cue.cue_id = h.hoja_id
        left join tt_dc_csc_con_0140_cuentas nodo on h.ram_id = nodo.nodo_id
        left join Rama nodo_2 on nodo.nodo_2 = nodo_2.ram_id
        left join Rama nodo_3 on nodo.nodo_3 = nodo_3.ram_id
        left join Rama nodo_4 on nodo.nodo_4 = nodo_4.ram_id
        left join Rama nodo_5 on nodo.nodo_5 = nodo_5.ram_id
        left join Rama nodo_6 on nodo.nodo_6 = nodo_6.ram_id
        left join Rama nodo_7 on nodo.nodo_7 = nodo_7.ram_id
        left join Rama nodo_8 on nodo.nodo_8 = nodo_8.ram_id
        left join Rama nodo_9 on nodo.nodo_9 = nodo_9.ram_id

      where ast.as_fecha >= p_Fini
        and ast.as_fecha <= p_Ffin

        -- Validar usuario - empresa
        and ( exists ( select * from EmpresaUsuario where emp_id = doc.emp_id and us_id = p_us_id ) or ( p_us_id = 1 ) )

        and ( asi.cue_id = v_cue_id or v_cue_id = 0 )
        and ( asi.mon_id = v_mon_id or v_mon_id = 0 )
        and ( doc.emp_id = v_emp_id or v_emp_id = 0 )
        and ( coalesce(doccl.cico_id, doc.cico_id) = v_cico_id or v_cico_id = 0 )
        and ( ast.doc_id = v_doc_id or ast.doc_id_cliente = v_doc_id or v_doc_id = 0 )

        -- Arboles
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 17
                           and rptarb_hojaid = asi.cue_id ) )
              or ( v_ram_id_cuenta = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 12
                           and rptarb_hojaid = asi.mon_id ) )
              or ( v_ram_id_moneda = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1018
                           and rptarb_hojaid = doc.emp_id ) )
              or ( v_ram_id_empresa = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 1016
                           and rptarb_hojaid = coalesce(doccl.cico_id, doc.cico_id) ) )
              or ( v_ram_id_circuitocontable = 0 ) )
        and ( ( exists ( select rptarb_hojaid
                         from rptArbolRamaHoja
                         where rptarb_cliente = v_clienteID
                           and tbl_id = 4001
                           and ( rptarb_hojaid = ast.doc_id or rptarb_hojaid = ast.doc_id_cliente ) ) )
              or ( v_ram_id_documento = 0 ) )

      group by emp.emp_nombre,
               cuec.cuec_nombre,
               nodo_2.ram_nombre,
               nodo_3.ram_nombre,
               nodo_4.ram_nombre,
               nodo_5.ram_nombre,
               nodo_6.ram_nombre,
               nodo_7.ram_nombre,
               nodo_8.ram_nombre,
               nodo_9.ram_nombre,
               substr('00000' || to_char(nodo_2.ram_orden), -1, 5) || '@' || nodo_2.ram_nombre,
               substr('00000' || to_char(nodo_3.ram_orden), -1, 5) || '@' || nodo_3.ram_nombre,
               substr('00000' || to_char(nodo_4.ram_orden), -1, 5) || '@' || nodo_4.ram_nombre,
               substr('00000' || to_char(nodo_5.ram_orden), -1, 5) || '@' || nodo_5.ram_nombre,
               substr('00000' || to_char(nodo_6.ram_orden), -1, 5) || '@' || nodo_6.ram_nombre,
               substr('00000' || to_char(nodo_7.ram_orden), -1, 5) || '@' || nodo_7.ram_nombre,
               substr('00000' || to_char(nodo_8.ram_orden), -1, 5) || '@' || nodo_8.ram_nombre,
               substr('00000' || to_char(nodo_9.ram_orden), -1, 5) || '@' || nodo_9.ram_nombre,
               coalesce(h.ram_estado, 1),
               cue.cue_id,
               cue.cue_nombre,
               cue.cue_codigo,
               case
                  when p_usarCodigo = 0 then cue.cue_identificacionExterna
                  else cue.cue_codigo
               end
      order by Empresa,
               Nivel_1,
               Nivelg_2,
               Nivelg_3,
               Nivelg_4,
               Nivelg_5,
               Nivelg_6,
               Nivelg_7,
               Nivelg_8,
               Nivelg_9,
               case
                  when p_usarCodigo = 0 then cue.cue_identificacionExterna
                  else cue.cue_codigo
               end,
               cue.cue_codigo;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function dc_csc_con_0140(integer, timestamp with time zone, timestamp with time zone, varchar, varchar, varchar, varchar, varchar, varchar, integer, integer, integer, integer, varchar)
  owner to postgres;