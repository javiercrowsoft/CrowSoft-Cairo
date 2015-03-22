/*
CrowSoft-Cairo
==============

ERP application written in Scala Play Framework and Postgresql

Copyright (C) 2012    Javier Mariano Alvarez

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS for A PARTICULAR PURPOSE.    See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

========================================================================

Created by Javier

http://www.crowsoft.com.ar

javier at crowsoft.com.ar
*/
-- Function: sp_producto_kit_lleva_serie()

-- drop function sp_producto_kit_lleva_serie(integer, smallint, integer);

create or replace function sp_producto_kit_lleva_serie
/*
          select * from Producto where pr_eskit <> 0;
          select * from sp_producto_kit_lleva_serie(45);
*/
(
    in ip_pr_id integer,
    in p_bCreateTable smallint default 1,
    in ip_prfk_id integer default null,
    out p_bResult smallint
)
    returns smallint as
$BODY$
declare
    p_prfk_id integer := ip_prfk_id;
    p_pr_id integer := ip_pr_id;
    v_nivel integer;
begin

    p_bResult := 0;

    if p_prfk_id is null then
        select prfk_id
         into p_prfk_id
        from ProductoFormulaKit
        where pr_id = p_pr_id
          and prfk_default <> 0;

    end if;

    -- Averiguo si este producto lleva numero de serie
    if exists ( select pr_id
                from Producto
                where pr_id = p_pr_id
                  and pr_llevanroserie <> 0 ) then

        p_bResult := 1;

    else

    begin
        -- Solo se crea la tabla en la primera llamada
        if p_bCreateTable <> 0 then
            create temporary table tt_KitItems
              (
                 pr_id integer    not null,
                 nivel integer    not null
              ) on commit drop;
        end if;

        -- Agrego los items de este kit
        select max(nivel)
         into v_nivel
        from tt_KitItems ;

        v_nivel := coalesce(v_nivel, 0) + 1;

        insert into tt_KitItems
         ( pr_id, nivel )
         ( select pr_id_item,
                  v_nivel
           from ProductoKit
           where prfk_id = p_prfk_id );

        loop

            if not exists ( select *
                            from tt_KitItems
                            where nivel = v_nivel ) then
              exit;
            end if;

            select min(pr_id)
             into p_pr_id
            from tt_KitItems
            where nivel = v_nivel;

            select sp_producto_kit_lleva_serie(p_pr_id, 0) into p_bResult;

            if p_bResult <> 0 then

            RETURN;

            end if;

            -- Este ya lo procese asi que lo borro
            delete from tt_KitItems where pr_id = p_pr_id;

        end loop;

    end;
    end if;

end;
$BODY$
    language plpgsql volatile
    COST 100;
alter function sp_producto_kit_lleva_serie(integer, smallint, integer)
    owner to postgres;