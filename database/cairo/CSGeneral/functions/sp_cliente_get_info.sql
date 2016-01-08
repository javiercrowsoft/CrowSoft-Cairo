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
-- Function: sp_cliente_get_info()

-- drop function sp_cliente_get_info(integer, integer);

create or replace function sp_cliente_get_info
/*
    select * from documento where doct_id in (2,8,10);
    select * from sp_cliente_get_info(2,20);
    select * from sp_cliente_get_iva(2,0::smallint);
*/
(
  in p_cli_id integer,
  in p_doc_id integer,

  out p_cpg_id integer,
  out p_cpg_name varchar,
  out p_cpg_eslibre smallint,
  out p_lp_id integer,
  out p_lp_name varchar,
  out p_ld_id integer,
  out p_ld_name varchar,
  out p_bIvari smallint,
  out p_bIvarni smallint,
  out p_ven_id integer,
  out p_ven_name varchar,
  out p_trans_id integer,
  out p_trans_name varchar,
  out p_pro_id integer,
  out p_pro_name varchar
)
  returns record as
$BODY$
declare
      v_cpg_id integer;
      v_cpg_name varchar;
      v_cpg_eslibre integer;
      v_lp_id integer;
      v_lp_name varchar;
      v_ld_id integer;
      v_ld_name varchar;
      v_mon_id integer;
      v_ven_id integer;
      v_ven_name varchar;
      v_trans_id integer;
      v_trans_name varchar;
      v_pro_id integer;
      v_pro_name varchar;
begin


      select lp_id,
             ld_id,
             cpg_id,
             ven_id,
             trans_id,
             pro_id
        into v_lp_id,
             v_ld_id,
             v_cpg_id,
             v_ven_id,
             v_trans_id,
             v_pro_id
      from cliente
      where cli_id = p_cli_id;

      select mon_id into v_mon_id from Documento where doc_id = p_doc_id;

      if v_lp_id is not null then

         if not exists ( select *
                         from ListaPrecio
                         where lp_id = v_lp_id
                           and mon_id = v_mon_id
                           and lp_tipo = 1 ) then
            v_lp_id := null;
         end if;

      end if;

      if v_lp_id is null then

         select min(lp_id)
           into v_lp_id
         from ListaPrecio
         where mon_id = v_mon_id
           and lp_tipo = 1
           and lp_default <> 0;

      end if;

      if v_ld_id is not null then

         if not exists ( select *
                         from ListaDescuento
                         where ld_id = v_ld_id
                           and mon_id = v_mon_id
                           and ld_tipo = 1 ) then

            v_ld_id := null;

         end if;

      end if;

      if v_lp_id is not null then
        select lp_nombre into v_lp_name from listaprecio where lp_id = v_lp_id;
      end if;

      if v_ld_id is not null then
        select ld_nombre into v_ld_name from listadescuento where ld_id = v_ld_id;
      end if;

      if v_cpg_id is not null then
        select cpg_nombre, cpg_eslibre into v_cpg_name, v_cpg_eslibre from condicionpago where cpg_id = v_cpg_id;
      end if;

      if v_ven_id is not null then
        select ven_nombre into v_ven_name from vendedor where ven_id = v_ven_id;
      end if;

      if v_trans_id is not null then
        select trans_nombre into v_trans_name from transporte where trans_id = v_trans_id;
      end if;

      if v_pro_id is not null then
        select pro_nombre into v_pro_name from provincia where pro_id = v_pro_id;
      end if;

      select * from sp_cliente_get_iva(p_cli_id) into p_bIvari, p_bIvarni;

      p_lp_id := coalesce(v_lp_id, 0);
      p_lp_name := coalesce(v_lp_name, '');
      p_ld_id := coalesce(v_ld_id, 0);
      p_ld_name := coalesce(v_ld_name, '');
      p_cpg_id := coalesce(v_cpg_id, 0);
      p_cpg_name := coalesce(v_cpg_name, '');
      p_cpg_eslibre := coalesce(v_cpg_eslibre, 0);
      p_ven_id := coalesce(v_ven_id, 0);
      p_ven_name := coalesce(v_ven_name, '');
      p_trans_id := coalesce(v_trans_id, 0);
      p_trans_name := coalesce(v_trans_name, '');
      p_pro_id := coalesce(v_pro_id, 0);
      p_pro_name := coalesce(v_pro_name, '');

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_cliente_get_info(integer, integer)
  owner to postgres;