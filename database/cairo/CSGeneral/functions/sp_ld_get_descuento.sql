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
-- Function: sp_ld_get_descuento()

-- drop function sp_ld_get_descuento(integer, integer, decimal);

create or replace function sp_ld_get_descuento
/*
    select * from listadescuento
    select * from listadescuentoitem
    select * from sp_ld_get_descuento(4,167,10)
*/
(
  in p_ld_id integer,
  in p_pr_id integer,
  inout p_precio decimal(18,6)
)
  returns decimal(18,6) as
$BODY$
declare
   v_ldi_id integer;
   v_ld_porcentaje decimal(18,6);
   v_ld_porcGlobal decimal(18,6);
   v_importe decimal(18,6);
   v_precio decimal(18,6);
   v_ld_id integer;
begin

   v_precio := p_precio;

   -- Valido si me pasaron una lista de descuento
   if p_ld_id is not null then

       if exists ( select ld_id from ListaDescuento where ld_id = p_ld_id ) then

           v_ld_id := p_ld_id;
           v_ld_porcGlobal := 0;

           select ldi_id,
                  ldi_importe,
                  ldi_porcentaje
             into v_ldi_id,
                  v_importe,
                  v_ld_porcentaje
           from ListaDescuentoItem
           where ld_id = v_ld_id
             and pr_id = p_pr_id;

           select ld_porcentaje
             into v_ld_porcGlobal
           from ListaDescuento
           where ld_id = v_ld_id;

           v_ld_porcGlobal := coalesce(v_ld_porcGlobal, 0);
           v_ld_porcentaje := coalesce(v_ld_porcentaje, 0);
           v_importe := coalesce(v_importe, 0);

           v_precio := v_precio - (v_precio * v_ld_porcGlobal / 100);
           v_precio := v_precio - v_importe;
           v_precio := v_precio - (v_precio * v_ld_porcentaje / 100);

           select ld_id_padre
             into v_ld_id
           from ListaDescuento
           where ld_id = v_ld_id;

           if v_ld_id is not null then

              select sp_ld_get_descuento(v_ld_id, p_pr_id, v_precio) into v_precio;

           end if;
       end if;
   end if;

   p_precio := v_precio;

end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function sp_ld_get_descuento(integer, integer, decimal)
  owner to postgres;