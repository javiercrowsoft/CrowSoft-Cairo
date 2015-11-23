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
-- Function: sp_doc_pedido_venta_stock_validate()

-- drop function sp_doc_pedido_venta_stock_validate(integer);

create or replace function sp_doc_pedido_venta_stock_validate
(
  in p_pv_id integer,
  out p_bStock integer
)
  returns integer as
$BODY$
declare
   v_pr_id integer;
   v_pvi_pendiente decimal(18,6);
   v_pr_id_kit integer;
   v_cantidad decimal(18,6);
   v_ram_id_stock varchar(255);
   v_depl_id integer;
   v_ram_id_DepositoLogico integer;
   v_clienteID integer;
   v_IsRaiz smallint;
   v_cfg_valor varchar(255);
   v_depf_id integer;
begin

   /*
     1) Voy a ver si hay stock para cada uno de los items del pedido de venta
       Lo mas complicado es la existencia de Kits, ya que estos consumen productos que
           ya estan en un kit, y productos que pueden ser utilizados para producir nuevos kits.
       Esto significa que a los kits debo descomponerlos en sus items y analizar cuanto stock
           demandan. Primero debo comprometer el stock asociado al kit y luego si no alcanza
           debo comprometer los items del kit.
       Para aquellos kits que estan compuestos por otros kits, debo desagregarlo en sus items
       solo hasta el nivel que permita controlar stock por items, ya que hay kits que llevan un
           proceso de preparacion de varios dias y por tanto no importa si existen componentes para
           producirlo.
     1.1) Los divido en dos grupos A) los que no son Kits y B) los que son Kits
       1.2) Agrupo todos los productos ambos grupos por pr_id
       1.3) Los del grupo A son los mas simples, si no hay stock para estos no analizo mas
     1.4) Con los kits tengo que descomponerlos, ver cuantos kits hay preparados, y si no alcanza
            debo descontar insumos no asociados a los kits que puedo producir rapidamente.
            Para aquellos insumos que son kits y no controlan stock por items debo tener stock de kits
            ya preparados
     1.5) La demanda de stock es la suma de todos los pendientes de :
          - productos que no son kits
                 - productos que son kits y no hay suficientes kits preparados y controlan stock por item
     1.4) Ahora recorro cada uno de los articulos del grupo B, y pido la info del kit
       1.5) Por cada componente que es kit y permite controlar stock por items voy cargando
            esos items en la tabla temporal
       1.6) Ahora analizo los items del grupo B y listo. Tengo que tener encuenta aquellos items
            que son kits y no permiten controlar stock por items ya que su preparacion es muy
            compleja y lleva varios dias.
   */

   create temporary table tt_pedido_venta_stock
   (
     pr_id integer,
     pr_id_kit integer,
     pr_id_kitpadre integer,
     pvi_pendiente decimal(18,6)
   ) on commit drop;

   -- obtengo la lista de depositos permitidos
   --
   select ram_id_stock
     into v_ram_id_stock
   from PedidoVenta
   where pv_id = p_pv_id;

   select * from  sp_GetRptId() into v_clienteID;

   select * from sp_ArbConvertId(v_ram_id_stock) into v_depl_id, v_ram_id_DepositoLogico;

   if v_ram_id_DepositoLogico <> 0 then

      select sp_ArbIsRaiz(v_ram_id_DepositoLogico) into v_IsRaiz;

      if v_IsRaiz = 0 then

         perform sp_ArbGetAllHojas(v_ram_id_DepositoLogico, v_clienteID);

      else

         v_ram_id_DepositoLogico := 0;

      end if;

   else

      -- tengo que validar segun lo que indique la configuracion de stock
      --
      select sp_cfg_getValor('Stock-General', 'Tipo Control Stock') into v_cfg_valor;

      v_cfg_valor := coalesce(v_cfg_valor, '0');

      -- csEStockFisico
      --
      if to_number(v_cfg_valor) = 4 then

         select depf_id
           into v_depf_id
         from DepositoLogico
         where depl_id = v_depl_id;

         insert into rptArbolRamaHoja( rptarb_cliente, rptarb_hojaid, tbl_id )
         ( select v_clienteID, depl_id, 11 from DepositoLogico where depf_id = v_depf_id );

         v_depl_id := 0;

      end if;

   end if;

   insert into tt_pedido_venta_stock
     ( pr_id, pr_id_kit, pr_id_kitpadre, pvi_pendiente )
     ( select i.pr_id,
              i.pr_id_kit,
              i.pr_id_kitpadre,
              sum(i.pvi_pendiente)
       from PedidoVentaItemStock i
              join PedidoVenta v
               on i.pv_id = v.pv_id
          where v.ram_id_stock = v_ram_id_stock
         group by i.pr_id,i.pr_id_kit,i.pr_id_kitpadre );

   -- para debug
   -- select p.pr_nombrecompra, s.* from #PedidoVtaStock s inner join Producto p on s.pr_id = p.pr_id

   -- somos pesismistas
   --
   p_bStock := 0;

   -- para debug
   -- i.pr_id, pr_nombrecompra, IsNull(sum(stc_cantidad),0), max(i.pvi_pendiente), i.pr_id_kit, i.pr_id_kitpadre

   if exists ( select i.pr_id
               from tt_pedido_venta_stock i
               left join StockCache S
                on i.pr_id = S.pr_id
                and ( i.pr_id_kit = S.pr_id_kit
                      or ( i.pr_id_kit is null and S.pr_id_kit is null )
                      or i.pr_id_kitpadre = S.pr_id_kit
                    )
               join Producto p
                on i.pr_id = p.pr_id
                and ( ( S.depl_id <> -1 and S.depl_id <> -2 )
                     or S.depl_id is null
                    )

               and ( S.depl_id = v_depl_id or v_depl_id = 0 or S.depl_id is null )
               and ( ( exists ( select rptarb_hojaid
                                from rptArbolRamaHoja
                                where rptarb_cliente = v_clienteID
                                  and tbl_id = 11-- tbl_id de DepositoLogico
                                  and ( rptarb_hojaid = S.depl_id or S.depl_id is null ) )
                     )
                     or ( v_ram_id_DepositoLogico = 0 )
                   )
               group by i.pr_id,p.pr_nombrecompra,i.pr_id_kit,i.pr_id_kitpadre
               having coalesce(sum(S.stc_cantidad), 0) < max(i.pvi_pendiente)
             ) then

      -- no hay stock
      return;

   end if;

   -- si llegue hasta aqui entonces hay stock suficiente
   --
   p_bStock := 1;

exception
   when others then

   raise exception 'Ha ocurrido un error al actualizar el estado del pedido de venta. sp_doc_pedido_venta_stock_validate. %. %.',
                   sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_pedido_venta_stock_validate(integer)
  owner to postgres;