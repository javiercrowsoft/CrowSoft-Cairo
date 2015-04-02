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

create or replace function alr_dc_csc_stk_0010_m(out rtn refcursor)
  returns refcursor as
$BODY$
declare
   v_alm_id integer;
   v_ultimo_aviso date;
   v_offset_inicio integer;
   v_offset_inicio_e integer;
   --////////////////////////////////////////////////////////////////////////////////
   v_cfg_valor varchar(255);
   v_bStockFisico decimal(3,0);
   v_pr_id integer;
   v_reposicion decimal(18,6);
   v_depl_id integer;
   v_depf_id integer;
   v_almr_id_mail integer;
   v_depf_id_logico integer;
   v_stock decimal(18,6);
   v_cantidad_pedida decimal(18,6);
   v_body varchar;
   v_msg varchar(1000);
   -- Obtengo la direccion de email
   --
   v_mail_emailTo varchar(1000);
   v_mail_emailCc varchar(1000);
   v_mail_id integer;
   v_temp numeric(1, 0) := 0;
   
   --////////////////////////////////////////////////////////////////////////////////
   /*
		Por cada articulo con punto de reposicion > 0 voy a ver cuanto stock tiene
		y si esta por debajo del minimo lo agrego al mail de notificacion
*/
   c_productos CURSOR for
   select pr_id,
	   pr_reposicion,
	   null::integer depl_id,
	   null::integer depf_id
     from Producto
      where pr_reposicion > 0
   union
   select pr_id,
	   prdepl_reposicion,
	   depl_id,
	   null::integer depf_id
     from ProductoDepositoLogico
      where prdepl_reposicion > 0
   union
   select pr_id,
	   prdepf_reposicion,
	   null::integer depl_id,
	   depf_id
     from ProductoDepositoFisico
      where prdepf_reposicion > 0;
      
   -- Creo un cursor con todos los articulos que estan por debajo del punto de reposicion
   --
   c_items CURSOR for
   select
	      'El producto ' || pr.pr_nombrecompra || ' en ' || 
	      case
		  when depl.depl_nombre is not null then 'el deposito logico ' || depl.depl_nombre
		  when depf.depf_nombre is not null then 'el deposito fisico ' || depf.depf_nombre
	      else 'la empesa'
	      end
	      || ' posee un stock de ' 
	      || to_char(stock, '999999999D9999') || ' y el punto de resposicion es ' 
	      || to_char(reposicion, '999999999D9999') 
	      || ' y existen pedidos pendientes por ' 
	      || to_char(pedidos, '999999999D99') 
	      || ' (' || coalesce(un.un_codigo, '') || ').' msg
     from tt_t_alr_dc_csc_stk_0010_st t
     join Producto pr
      on t.pr_id = pr.pr_id
     left join DepositoLogico depl
      on t.depl_id = depl.depl_id
     left join DepositoFisico depf
      on t.depf_id = depf.depf_id
     left join Unidad un
      on pr.un_id_stock = un.un_id
      where not exists ( select *
                         from AlarmaMailResult a
                                join AlarmaMailStock almst
                                 on almst.almst_fecha > v_ultimo_aviso
                                and a.alm_id = v_alm_id
                                and a.almr_id_mail = almst.almr_id_mail
                         where t.pr_id = almst.pr_id
                                and coalesce(t.depl_id, 0) = coalesce(almst.depl_id, 0)
                                and coalesce(t.depf_id, 0) = coalesce(almst.depf_id, 0));
begin

   rtn := 'rtn';

   create temporary table tt_t_alr_dc_csc_stk_0010_st
    (
    almr_id_mail integer  not null,
    pr_id integer  not null,
    depl_id integer  ,
    depf_id integer  ,
    reposicion decimal(18,2) default (0) not null ,
    stock decimal(18,2) default (0) not null ,
    pedidos decimal(18,2) default (0) not null
    ) on commit drop;

   v_alm_id := 3;

   v_ultimo_aviso := dateadd('D', -1, CURRENT_TIMESTAMP);

   v_offset_inicio := 10000000;

   v_offset_inicio_e := 11000000;

   -- Tengo que validar segun lo que indique la configuracion de stock
   select sp_cfg_getValor('Stock-General',
                        'Tipo Control Stock',
                        0::smallint, null) into v_cfg_valor;

   v_cfg_valor := coalesce(v_cfg_valor, '0');

   if to_number(v_cfg_valor) = 4 then
      v_bStockFisico := 1;

   else
      v_bStockFisico := 0;

   end if;

   open c_productos;

   fetch c_productos into v_pr_id,v_reposicion,v_depl_id,v_depf_id;

   while (found)
   loop
      begin
         v_cantidad_pedida := 0;

         v_stock := 0;

         if coalesce(v_depl_id, 0) <> 0 then
         begin
            -- Obtengo el stock para este producto y deposito
            if v_bStockFisico <> 0 then
            begin
               select depf_id
                 into v_depf_id_logico
                 from DepositoLogico
                  where depl_id = v_depl_id;

               select SUM(stc_cantidad)
                 into v_stock
                 from StockCache S
                  where pr_id = v_pr_id
                          and exists ( select *
                                       from DepositoLogico
                                          where depf_id = v_depf_id_logico
                                                  and depl_id = S.depl_id );

            end;
            else
            begin
               select SUM(stc_cantidad)
                 into v_stock
                 from StockCache S
                  where pr_id = v_pr_id
                          and depl_id = v_depl_id;

            end;
            end if;

         end;
         else
         begin
            if coalesce(v_depf_id, 0) <> 0 then
            begin
               select SUM(stc_cantidad)
                 into v_stock
                 from StockCache S
                  where pr_id = v_pr_id
                          and exists ( select *
                                       from DepositoLogico
                                          where depf_id = v_depf_id
                                                  and depl_id = S.depl_id );

            end;
            else
            begin
               select SUM(stc_cantidad)
                 into v_stock
                 from StockCache S
                  where pr_id = v_pr_id;

            end;
            end if;

         end;
         end if;

         select SUM(pvi_pendiente)
           into v_cantidad_pedida
           from PedidoVentaItemStock
            where pr_id = v_pr_id;

         v_cantidad_pedida := coalesce(v_cantidad_pedida, 0);

         -- Si es menor al punto de reposicion lo agrego a la tabla
         if v_stock < v_reposicion then
         begin
            if v_almr_id_mail is null then
            begin
               select SP_DBGetNewId2('AlarmaMailStock',
                                     'almr_id_mail',
                                     v_offset_inicio,
                                     v_offset_inicio_e) into v_almr_id_mail;

            end;
            end if;

            insert into tt_t_alr_dc_csc_stk_0010_st
              ( almr_id_mail, pr_id, depl_id, depf_id, stock, reposicion, pedidos )
              values ( v_almr_id_mail, v_pr_id, v_depl_id, v_depf_id, v_stock, v_reposicion, v_cantidad_pedida );

         end;
         end if;

         fetch c_productos into v_pr_id,v_reposicion,v_depl_id,v_depf_id;

      end;
   end loop;

   close c_productos;

   v_body := '';

   open c_items;

   fetch c_items into v_msg;

   while (found)
   loop
      begin
         v_body := v_body || v_msg || CHR(10) || CHR(13);

         fetch c_items into v_msg;

      end;
   end loop;

   close c_items;

   -- Registro que ya notifique estos productos
   --
   insert into alarmamailstock
     ( almr_id_mail, almst_fecha, pr_id, depl_id, depf_id )
     ( select almr_id_mail,
              CURRENT_TIMESTAMP,
              pr_id,
              depl_id,
              depf_id
       from tt_t_alr_dc_csc_stk_0010_st  );

   select alm_mails
     into v_mail_emailTo
     from AlarmaMail
      where alm_id = v_alm_id;

   begin
      select 1 into v_temp
        from DUAL
       where exists ( select *
                      from Mail
                         where mail_codigo = v_mail_emailTo );
   exception
      when others then
         null;
   end;

   if v_temp = 1 then
   begin
      select mail_emailTo,
             mail_emailCc,
             mail_id
        into v_mail_emailTo,
             v_mail_emailCc,
             v_mail_id
        from Mail
         where mail_codigo = v_mail_emailTo;

   end;
   end if;

   open rtn for
      -- Devuelvo el email
      --
      select v_almr_id_mail almr_id_mail,
                  v_mail_id mail_id,
                  null maili_id,
                  v_mail_emailTo mail_emailTo,
                  v_mail_emailCc mail_emailCc,
                  'Articulos con stock por debajo del punto de reposición' almr_subject,
                  v_body msg
      where v_almr_id_mail is not null;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function alr_dc_csc_stk_0010_m()
  owner to postgres;
