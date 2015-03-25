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
-- Function: sp_proveedor_get_info()

-- drop function sp_proveedor_get_info(integer, integer);

create or replace function sp_proveedor_get_info
/*
    select * from documento where doct_id in (2,8,10);
    select * from sp_proveedor_get_info(2,20);
    select * from sp_proveedor_get_iva(2,0::smallint);
*/
(
  in p_prov_id integer,
  in p_doc_id integer,

  out p_cpg_id integer,
  out p_cpg_name varchar,
  out p_cpg_eslibre smallint,
  out p_lp_id integer,
  out p_lp_name varchar,
  out p_ld_id integer,
  out p_ld_name varchar,
  out p_bIvari smallint,
  out p_bIvarni smallint
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
begin


      select lp_id,
             ld_id,
             cpg_id
        into v_lp_id,
             v_ld_id,
             v_cpg_id
      from Proveedor
      where prov_id = p_prov_id;

      select mon_id into v_mon_id from Documento where doc_id = p_doc_id;

      if v_lp_id is not null then

         if not exists ( select *
                         from ListaPrecio
                         where lp_id = v_lp_id
                           and mon_id = v_mon_id
                           and lp_tipo in ( 2,3 ) ) then
            v_lp_id := null;
         end if;

      end if;

      if v_lp_id is null then

         select min(lp_id)
           into v_lp_id
         from ListaPrecio
         where mon_id = v_mon_id
           and lp_tipo in ( 2,3 )
           and lp_default <> 0;

      end if;

      if v_ld_id is not null then

         if not exists ( select *
                         from ListaDescuento
                         where ld_id = v_ld_id
                           and mon_id = v_mon_id
                           and ld_tipo = 2 ) then

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

      select * from sp_proveedor_get_iva(p_prov_id, 0::smallint) into p_bIvari, p_bIvarni;

      p_lp_id := coalesce(v_lp_id, 0);
      p_lp_name := coalesce(v_lp_name, '');
      p_ld_id := coalesce(v_ld_id, 0);
      p_ld_name := coalesce(v_ld_name, '');
      p_cpg_id := coalesce(v_cpg_id, 0);
      p_cpg_name := coalesce(v_cpg_name, '');
      p_cpg_eslibre := coalesce(v_cpg_eslibre, 0);

end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function sp_proveedor_get_info(integer, integer)
  owner to postgres;