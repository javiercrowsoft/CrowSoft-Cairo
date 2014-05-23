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
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
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

-- DROP FUNCTION alr_dc_csc_stk_0010_m();

CREATE OR REPLACE FUNCTION alr_dc_csc_stk_0010_m(OUT rtn refcursor)
  RETURNS refcursor AS
$BODY$
DECLARE
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
   SELECT pr_id,
	   pr_reposicion,
	   NULL::integer depl_id,
	   NULL::integer depf_id
     FROM Producto
      WHERE pr_reposicion > 0
   UNION
   SELECT pr_id,
	   prdepl_reposicion,
	   depl_id,
	   NULL::integer depf_id
     FROM ProductoDepositoLogico
      WHERE prdepl_reposicion > 0
   UNION
   SELECT pr_id,
	   prdepf_reposicion,
	   NULL::integer depl_id,
	   depf_id
     FROM ProductoDepositoFisico
      WHERE prdepf_reposicion > 0;
      
   -- Creo un cursor con todos los articulos que estan por debajo del punto de reposicion
   --
   c_items CURSOR for 
   SELECT 
	      'El producto ' || pr.pr_nombrecompra || ' en ' || 
	      CASE
		  WHEN depl.depl_nombre IS NOT NULL THEN 'el deposito logico ' || depl.depl_nombre
		  WHEN depf.depf_nombre IS NOT NULL THEN 'el deposito fisico ' || depf.depf_nombre
	      ELSE 'la empesa'
	      END 
	      || ' posee un stock de ' 
	      || to_char(stock, '999999999D9999') || ' y el punto de resposicion es ' 
	      || to_char(reposicion, '999999999D9999') 
	      || ' y existen pedidos pendientes por ' 
	      || to_char(pedidos, '999999999D99') 
	      || ' (' || coalesce(un.un_codigo, '') || ').' msg
     FROM tt_t_alr_dc_csc_stk_0010_st t
     JOIN Producto pr
      ON t.pr_id = pr.pr_id
     LEFT JOIN DepositoLogico depl
      ON t.depl_id = depl.depl_id
     LEFT JOIN DepositoFisico depf
      ON t.depf_id = depf.depf_id
     LEFT JOIN Unidad un
      ON pr.un_id_stock = un.un_id
      WHERE NOT EXISTS ( SELECT *
                         FROM AlarmaMailResult a
                                JOIN AlarmaMailStock almst
                                 ON almst.almst_fecha > v_ultimo_aviso
                                AND a.alm_id = v_alm_id
                                AND a.almr_id_mail = almst.almr_id_mail 
                         WHERE t.pr_id = almst.pr_id
                                AND coalesce(t.depl_id, 0) = coalesce(almst.depl_id, 0)
                                AND coalesce(t.depf_id, 0) = coalesce(almst.depf_id, 0));
BEGIN

   rtn := 'rtn';

   CREATE TEMPORARY TABLE tt_t_alr_dc_csc_stk_0010_st
    (
    almr_id_mail integer  NOT NULL,
    pr_id integer  NOT NULL,
    depl_id integer  ,
    depf_id integer  ,
    reposicion decimal(18,2) DEFAULT (0) NOT NULL ,
    stock decimal(18,2) DEFAULT (0) NOT NULL ,
    pedidos decimal(18,2) DEFAULT (0) NOT NULL 
    ) ON COMMIT DROP;

   v_alm_id := 3;

   v_ultimo_aviso := dateadd('D', -1, CURRENT_TIMESTAMP);

   v_offset_inicio := 10000000;

   v_offset_inicio_e := 11000000;

   -- Tengo que validar segun lo que indique la configuracion de stock
   select sp_Cfg_GetValor('Stock-General',
                        'Tipo Control Stock',
                        0::smallint, null) into v_cfg_valor;

   v_cfg_valor := coalesce(v_cfg_valor, '0');

   IF to_number(v_cfg_valor) = 4 THEN
      v_bStockFisico := 1;

   ELSE
      v_bStockFisico := 0;

   END IF;

   OPEN c_productos;

   FETCH c_productos INTO v_pr_id,v_reposicion,v_depl_id,v_depf_id;

   WHILE (FOUND)
   LOOP
      BEGIN
         v_cantidad_pedida := 0;

         v_stock := 0;

         IF coalesce(v_depl_id, 0) <> 0 THEN
         BEGIN
            -- Obtengo el stock para este producto y deposito
            IF v_bStockFisico <> 0 THEN
            BEGIN
               SELECT depf_id
                 INTO v_depf_id_logico
                 FROM DepositoLogico
                  WHERE depl_id = v_depl_id;

               SELECT SUM(stc_cantidad)
                 INTO v_stock
                 FROM StockCache S
                  WHERE pr_id = v_pr_id
                          AND EXISTS ( SELECT *
                                       FROM DepositoLogico
                                          WHERE depf_id = v_depf_id_logico
                                                  AND depl_id = S.depl_id );

            END;
            ELSE
            BEGIN
               SELECT SUM(stc_cantidad)
                 INTO v_stock
                 FROM StockCache S
                  WHERE pr_id = v_pr_id
                          AND depl_id = v_depl_id;

            END;
            END IF;

         END;
         ELSE
         BEGIN
            IF coalesce(v_depf_id, 0) <> 0 THEN
            BEGIN
               SELECT SUM(stc_cantidad)
                 INTO v_stock
                 FROM StockCache S
                  WHERE pr_id = v_pr_id
                          AND EXISTS ( SELECT *
                                       FROM DepositoLogico
                                          WHERE depf_id = v_depf_id
                                                  AND depl_id = S.depl_id );

            END;
            ELSE
            BEGIN
               SELECT SUM(stc_cantidad)
                 INTO v_stock
                 FROM StockCache S
                  WHERE pr_id = v_pr_id;

            END;
            END IF;

         END;
         END IF;

         SELECT SUM(pvi_pendiente)
           INTO v_cantidad_pedida
           FROM PedidoVentaItemStock
            WHERE pr_id = v_pr_id;

         v_cantidad_pedida := coalesce(v_cantidad_pedida, 0);

         -- Si es menor al punto de reposicion lo agrego a la tabla
         IF v_stock < v_reposicion THEN
         BEGIN
            IF v_almr_id_mail IS NULL THEN
            BEGIN
               select SP_DBGetNewId2('AlarmaMailStock',
                              'almr_id_mail',
                              v_offset_inicio,
                              v_offset_inicio_e,
                              v_almr_id_mail,
                              0) into v_almr_id_mail;

            END;
            END IF;

            INSERT INTO tt_t_alr_dc_csc_stk_0010_st
              ( almr_id_mail, pr_id, depl_id, depf_id, stock, reposicion, pedidos )
              VALUES ( v_almr_id_mail, v_pr_id, v_depl_id, v_depf_id, v_stock, v_reposicion, v_cantidad_pedida );

         END;
         END IF;

         FETCH c_productos INTO v_pr_id,v_reposicion,v_depl_id,v_depf_id;

      END;
   END LOOP;

   CLOSE c_productos;

   v_body := '';

   OPEN c_items;

   FETCH c_items INTO v_msg;

   WHILE (FOUND)
   LOOP
      BEGIN
         v_body := v_body || v_msg || CHR(10) || CHR(13);

         FETCH c_items INTO v_msg;

      END;
   END LOOP;

   CLOSE c_items;

   -- Registro que ya notifique estos productos
   --
   INSERT INTO alarmamailstock
     ( almr_id_mail, almst_fecha, pr_id, depl_id, depf_id )
     ( SELECT almr_id_mail,
              CURRENT_TIMESTAMP,
              pr_id,
              depl_id,
              depf_id
       FROM tt_t_alr_dc_csc_stk_0010_st  );

   SELECT alm_mails
     INTO v_mail_emailTo
     FROM AlarmaMail
      WHERE alm_id = v_alm_id;

   BEGIN
      SELECT 1 INTO v_temp
        FROM DUAL
       WHERE EXISTS ( SELECT *
                      FROM Mail
                         WHERE mail_codigo = v_mail_emailTo );
   EXCEPTION
      WHEN OTHERS THEN
         NULL;
   END;

   IF v_temp = 1 THEN
   BEGIN
      SELECT mail_emailTo,
             mail_emailCc,
             mail_id
        INTO v_mail_emailTo,
             v_mail_emailCc,
             v_mail_id
        FROM Mail
         WHERE mail_codigo = v_mail_emailTo;

   END;
   END IF;

   OPEN rtn FOR
      -- Devuelvo el email
      --
      SELECT v_almr_id_mail almr_id_mail,
                  v_mail_id mail_id,
                  NULL maili_id,
                  v_mail_emailTo mail_emailTo,
                  v_mail_emailCc mail_emailCc,
                  'Articulos con stock por debajo del punto de reposición' almr_subject,
                  v_body msg
      WHERE v_almr_id_mail IS NOT NULL;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION alr_dc_csc_stk_0010_m()
  OWNER TO postgres;
