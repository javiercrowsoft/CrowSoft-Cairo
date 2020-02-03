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
-- Function: dc_csc_com_0040()

-- drop function dc_csc_com_0040(integer, date, date, varchar, varchar, varchar, varchar);

/*---------------------------------------------------------------------
Nombre: Compras por proveedor y articulo
---------------------------------------------------------------------*/

/*

select * from dc_csc_com_0040(1, '2000-05-03', '2016-05-12', '0', '0', '0', '0');
fetch all from rtn;

*/

create or replace function dc_csc_com_0040(

  in p_us_id    integer,
  in p_Fini     date,
  in p_Ffin     date,

  in p_cico_id  varchar,
  in p_pr_id    varchar,
  in p_prov_id  varchar,
  in p_emp_id   varchar,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare

   v_pr_id      integer;
   v_prov_id    integer;
   v_emp_id     integer;
   v_cico_id    integer;

   v_ram_id_producto         integer;
   v_ram_id_proveedor        integer;
   v_ram_id_empresa          integer;
   v_ram_id_circuitoContable integer;

   v_clienteID integer;
   v_isRaiz    smallint;

   v_arb_id      integer;
   v_arb_nombre  varchar;  
   v_n           integer := 2;
   v_raiz        integer;

begin

   create temporary table t_dc_csc_com_0040_productos (
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

   select * from sp_ArbConvertId(p_pr_id)   into v_pr_id,    v_ram_id_producto; 
   select * from sp_ArbConvertId(p_prov_id) into v_prov_id,  v_ram_id_proveedor; 
   select * from sp_ArbConvertId(p_emp_id)  into v_emp_id,   v_ram_id_empresa;
   select * from sp_ArbConvertId(p_cico_id) into v_cico_id,  v_ram_id_circuitoContable; 

   select * from sp_GetRptId() into v_clienteID;

   if v_ram_id_producto <> 0 then
      select arb_id into v_arb_id from Rama where ram_id = v_ram_id_producto;
   else
      v_arb_id := 0;
   end if;

   if v_arb_id = 0 then

     select min(arb_id) into v_arb_id from arbol where tbl_id = 30; -- producto

   end if;

   select arb_nombre into v_arb_nombre from arbol where arb_id = v_arb_id;

   while exists(select * from rama r
       where  arb_id = v_arb_id
        and not exists (select * from t_dc_csc_com_0040_productos where nodo_2 = r.ram_id)
        and not exists (select * from t_dc_csc_com_0040_productos where nodo_3 = r.ram_id)
        and not exists (select * from t_dc_csc_com_0040_productos where nodo_4 = r.ram_id)
        and not exists (select * from t_dc_csc_com_0040_productos where nodo_5 = r.ram_id)
        and not exists (select * from t_dc_csc_com_0040_productos where nodo_6 = r.ram_id)
        and not exists (select * from t_dc_csc_com_0040_productos where nodo_7 = r.ram_id)
        and not exists (select * from t_dc_csc_com_0040_productos where nodo_8 = r.ram_id)
        and not exists (select * from t_dc_csc_com_0040_productos where nodo_9 = r.ram_id)

        and v_n <= 9
      )
   loop

      if v_n = 2 then

         select ram_id into v_raiz from rama where arb_id = v_arb_id and ram_id_padre = 0;
         insert into t_dc_csc_com_0040_productos (nodo_id, nodo_2)
         select ram_id, ram_id from rama where ram_id_padre = v_raiz;

      else

         if v_n = 3 then

            insert into t_dc_csc_com_0040_productos (nodo_id, nodo_2, nodo_3)
            select ram_id, nodo_2, ram_id
            from rama r inner join t_dc_csc_com_0040_productos n on r.ram_id_padre = n.nodo_2;

         else

            if v_n = 4 then

               insert into t_dc_csc_com_0040_productos (nodo_id, nodo_2, nodo_3, nodo_4)
               select ram_id, nodo_2, nodo_3, ram_id
               from rama r inner join t_dc_csc_com_0040_productos n on r.ram_id_padre = n.nodo_3;

            else

               if v_n = 5 then

                  insert into t_dc_csc_com_0040_productos (nodo_id, nodo_2, nodo_3, nodo_4, nodo_5)
                  select ram_id, nodo_2, nodo_3, nodo_4, ram_id
                  from rama r inner join t_dc_csc_com_0040_productos n on r.ram_id_padre = n.nodo_4;

               else

                  if v_n = 6 then

                     insert into t_dc_csc_com_0040_productos (nodo_id, nodo_2, nodo_3, nodo_4, nodo_5, nodo_6)
                     select ram_id, nodo_2, nodo_3, nodo_4, nodo_5, ram_id
                     from rama r inner join t_dc_csc_com_0040_productos n on r.ram_id_padre = n.nodo_5;

                  else

                     if v_n = 7 then

                        insert into t_dc_csc_com_0040_productos (nodo_id, nodo_2, nodo_3, nodo_4, nodo_5, nodo_6, nodo_7)
                        select ram_id, nodo_2, nodo_3, nodo_4, nodo_5, nodo_6, ram_id
                        from rama r inner join t_dc_csc_com_0040_productos n on r.ram_id_padre = n.nodo_6;

                     else

                        if v_n = 8 then

                           insert into t_dc_csc_com_0040_productos (nodo_id, nodo_2, nodo_3, nodo_4, nodo_5, nodo_6, nodo_7, nodo_8)
                           select ram_id, nodo_2, nodo_3, nodo_4, nodo_5, nodo_6, nodo_7, ram_id
                           from rama r inner join t_dc_csc_com_0040_productos n on r.ram_id_padre = n.nodo_7;

                        else

                           if v_n = 9 then

                              insert into t_dc_csc_com_0040_productos (nodo_id, nodo_2, nodo_3, nodo_4, nodo_5, nodo_6, nodo_7, nodo_8, nodo_9)
                              select ram_id, nodo_2, nodo_3, nodo_4, nodo_5, nodo_6, nodo_7, nodo_8, ram_id
                              from rama r inner join t_dc_csc_com_0040_productos n on r.ram_id_padre = n.nodo_8;

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

   if v_ram_id_producto <> 0 then
      -- exec sp_ArbGetGroups v_ram_id_producto, v_clienteID, p_us_id
      select sp_ArbIsRaiz(v_ram_id_producto) into v_isRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_producto, v_clienteID);
      else
         v_ram_id_producto := 0;
      end if;
   end if;

   if v_ram_id_proveedor <> 0 then
      -- exec sp_ArbGetGroups v_ram_id_proveedor, v_clienteID, p_us_id
      select sp_ArbIsRaiz(v_ram_id_proveedor) into v_isRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_proveedor, v_clienteID);
      else
         v_ram_id_proveedor := 0;
      end if;
   end if;

   if v_ram_id_empresa <> 0 then
      -- exec sp_ArbGetGroups v_ram_id_empresa, v_clienteID, p_us_id
      select sp_ArbIsRaiz(v_ram_id_empresa) into v_isRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_empresa, v_clienteID);
      else
         v_ram_id_empresa := 0;
      end if;
   end if;

   if v_ram_id_circuitoContable <> 0 then
      -- exec sp_ArbGetGroups v_ram_id_circuitoContable, v_clienteID, p_us_id
      select sp_ArbIsRaiz(v_ram_id_circuitoContable) into v_isRaiz;
      if v_IsRaiz = 0 then
         perform sp_ArbGetAllHojas(v_ram_id_circuitoContable, v_clienteID);
      else
         v_ram_id_circuitoContable := 0;
      end if;
   end if;

   rtn := 'rtn';

   open rtn for

   select
      1                as Orden,

      v_arb_nombre     as Nivel_1,

      nodo_2.ram_nombre  as Nivel_2,
      nodo_3.ram_nombre  as Nivel_3,
      nodo_4.ram_nombre  as Nivel_4,
      nodo_5.ram_nombre  as Nivel_5,
      nodo_6.ram_nombre  as Nivel_6,
      nodo_7.ram_nombre  as Nivel_7,
      nodo_8.ram_nombre  as Nivel_8,
      nodo_9.ram_nombre  as Nivel_9,

      pr_nombrecompra    as Articulo,
      pr_codigo          as Codigo,

      sum(case doc.doct_id
           when 8  then -(fci_neto
                 - (fci_neto * fc_descuento1 / 100)
                 - (
                   (
                    fci_neto - (fci_neto * fc_descuento1 / 100)
                   ) * fc_descuento2 / 100
                  )
                )
           else          (fci_neto
                 - (fci_neto * fc_descuento1 / 100)
                 - (
                   (
                    fci_neto - (fci_neto * fc_descuento1 / 100)
                   ) * fc_descuento2 / 100
                  )
                )
         end
        )                as "compras neto",

      sum(case doc.doct_id
           when 8  then -((fci_ivari+fci_ivarni)
                 - ((fci_ivari+fci_ivarni) * fc_descuento1 / 100)
                 - (
                   (
                    (fci_ivari+fci_ivarni) - ((fci_ivari+fci_ivarni) * fc_descuento1 / 100)
                   ) * fc_descuento2 / 100
                  )
                )
           else         ((fci_ivari+fci_ivarni)
                 - ((fci_ivari+fci_ivarni) * fc_descuento1 / 100)
                 - (
                   (
                    (fci_ivari+fci_ivarni) - ((fci_ivari+fci_ivarni) * fc_descuento1 / 100)
                   ) * fc_descuento2 / 100
                  )
               )
      end
        )                as ivacompras,

      sum(case doc.doct_id
           when 8  then -(fci_importe
                 - (fci_importe * fc_descuento1 / 100)
                 - (
                   (
                    fci_importe - (fci_importe * fc_descuento1 / 100)
                   ) * fc_descuento2 / 100
                  )
                )
           else          (fci_importe
                 - (fci_importe * fc_descuento1 / 100)
                 - (
                   (
                    fci_importe - (fci_importe * fc_descuento1 / 100)
                   ) * fc_descuento2 / 100
                  )
                )
         end
        )                as compras,

       sum(case doc.doct_id
             when 8  then -(fci_cantidad)
             else          fci_cantidad
           end
        )                as "cant. compras"

   from

      Producto pr inner join FacturaCompraItem fci  on pr.pr_id   = fci.pr_id
                  inner join FacturaCompra fc       on fci.fc_id  = fc.fc_id
                  inner join Documento doc          on fc.doc_id  = doc.doc_id
                  inner join Empresa emp            on doc.emp_id = emp.emp_id

                  left  join hoja h                 on     pr.pr_id = h.id
                                                    and h.arb_id = v_arb_id

                                                    -- Esto descarta la raiz
                                                    --
                                                    and not exists(select * from rama
                                                                   where ram_id = ram_id_padre
                                                                     and arb_id = v_arb_id
                                                                     and ram_id = h.ram_id)

                                                    -- Esto descarta hojas secundarias
                                                    --
                                                    and not exists(select * from hoja h2 inner join rama r on h2.ram_id = r.ram_id
                                                                   where h2.arb_id = v_arb_id
                                                                    and h2.ram_id < h.ram_id
                                                                    and h2.ram_id <> r.ram_id_padre
                                                                    and h2.id = h.id)

                  left  join t_dc_csc_com_0040_productos nodo on h.ram_id = nodo.nodo_id

                  left  join rama nodo_2  on nodo.nodo_2 = nodo_2.ram_id
                  left  join rama nodo_3  on nodo.nodo_3 = nodo_3.ram_id
                  left  join rama nodo_4  on nodo.nodo_4 = nodo_4.ram_id
                  left  join rama nodo_5  on nodo.nodo_5 = nodo_5.ram_id
                  left  join rama nodo_6  on nodo.nodo_6 = nodo_6.ram_id
                  left  join rama nodo_7  on nodo.nodo_7 = nodo_7.ram_id
                  left  join rama nodo_8  on nodo.nodo_8 = nodo_8.ram_id
                  left  join rama nodo_9  on nodo.nodo_9 = nodo_9.ram_id

   where

          fc_fecha >= p_Fini
      and fc_fecha <= p_Ffin

      and fc.est_id <> 7 -- Todas menos anuladas

      and (
         exists(select * from EmpresaUsuario where emp_id = doc.emp_id and us_id = p_us_id) or (p_us_id = 1)
        )
   /* -///////////////////////////////////////////////////////////////////////

   INICIO SEGUNDA PARTE DE ARBOLES

   /////////////////////////////////////////////////////////////////////// */

   and   (pr.pr_id    = v_pr_id    or v_pr_id   =0)
   and   (doc.cico_id = v_cico_id  or v_cico_id =0)
   and   (emp.emp_id  = v_emp_id   or v_emp_id  =0)
   and   (fc.prov_id  = v_prov_id  or v_prov_id =0)

   -- Arboles
   and   (
           (exists(select rptarb_hojaid
                   from rptArbolRamaHoja
                   where rptarb_cliente = v_clienteID
                     and tbl_id = 30
                     and rptarb_hojaid = fci.pr_id
                )
           )
            or (v_ram_id_producto = 0)
         )

   and   (
           (exists(select rptarb_hojaid
                   from rptArbolRamaHoja
                   where rptarb_cliente = v_clienteID
                     and tbl_id = 29
                     and rptarb_hojaid = fc.prov_id
                )
           )
            or (v_ram_id_proveedor = 0)
         )

   and   (
           (exists(select rptarb_hojaid
                   from rptArbolRamaHoja
                   where rptarb_cliente = v_clienteID
                     and tbl_id = 1016
                     and rptarb_hojaid = doc.cico_id
                )
           )
            or (v_ram_id_circuitoContable = 0)
         )

   and   (
           (exists(select rptarb_hojaid
                   from rptArbolRamaHoja
                   where rptarb_cliente = v_clienteID
                     and tbl_id = 1018
                     and rptarb_hojaid = doc.emp_id
                )
           )
            or (v_ram_id_empresa = 0)
         )

   group by
        pr_nombrecompra,
        pr_codigo,
        nodo_2.ram_nombre,
        nodo_3.ram_nombre,
        nodo_4.ram_nombre,
        nodo_5.ram_nombre,
        nodo_6.ram_nombre,
        nodo_7.ram_nombre,
        nodo_8.ram_nombre,
        nodo_9.ram_nombre

   order by pr_nombrecompra, Nivel_1, Nivel_2, Nivel_3, Nivel_4, Nivel_5, Nivel_6, Nivel_7, Nivel_8, Nivel_9;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function dc_csc_com_0040(integer, date, date, varchar, varchar, varchar, varchar)
  owner to postgres;