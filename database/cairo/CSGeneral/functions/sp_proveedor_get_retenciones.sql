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
-- Function: sp_proveedor_get_retenciones()

-- drop function sp_proveedor_get_retenciones(integer, integer, integer, date, decimal, varchar);
/*
	select * from ProveedorRetencion;
	select * from sp_proveedor_get_retenciones(1,1,1,'20160501', 105770, '91*92*93');
	fetch all from rtn;

        select * from sp_proveedor_get_retenciones(78, 1, 2533, '2020-10-22', 200000, '29638');
	fetch all from rtn;          
*/

create or replace function sp_proveedor_get_retenciones
(
  in p_us_id integer,
  in p_emp_id integer,
  in p_prov_id integer,
  in p_fecha date,
  in p_pago decimal(18,6),
  in p_facturas varchar,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
   v_ret_id integer;
   v_cue_id integer;
   v_retencion record;
   v_retenciones refcursor;
   v_fdesde date;
   v_fhasta date;
begin   

   v_fdesde := dateadd('DAY', -extract('day' from p_fecha)::int+1, p_fecha);
   v_fhasta := dateadd('DAY', -1, dateadd('MONTH', 1, v_fdesde));

   drop table if exists tt_tmp_retencion;
   create temporary table tt_tmp_retencion
    (
     ret_id integer
    ) on commit drop;

   drop table if exists tt_tmp_retencion_info;
   create temporary table tt_tmp_retencion_info
    (
     ret_id integer,
     cue_id integer,
     retencion decimal(18,6),
     porcentaje decimal(18,6),
     comprobante varchar(100),
     base decimal(18,6)
    ) on commit drop;

   rtn := 'rtn';
   
   -------------------------------------------------------------
   -- retenciones explicitas en proveedores
   --
   if exists ( select *
               from ProveedorRetencion provret
               where provret.prov_id = p_prov_id ) then

         insert into tt_tmp_retencion
           ( ret_id)
           ( select ret_id
             from ProveedorRetencion provret
             where prov_id = p_prov_id
               and p_fecha between provret_desde and provret_hasta );

   else

      -------------------------------------------------------------
      -- retenciones por configuracion general
      --
      insert into tt_tmp_retencion
        ( ret_id )
        ( select CAST(cfg_valor as integer)
          from Configuracion
          where emp_id = p_emp_id
            and cfg_grupo = 'Tesoreria-General'
            and cfg_aspecto = 'Retencion'
            and isnumeric(cfg_valor) <> 0 );

   end if;

   for v_ret_id, v_cue_id in
       select ret.ret_id, rett.cue_id
       from tt_tmp_retencion tt
       inner join retencion ret on tt.ret_id = ret.ret_id
       inner join RetencionTipo rett on ret.rett_id = rett.rett_id
   loop

      if v_cue_id is not null then

         select sp_doc_orden_pago_get_retencion(
                  p_us_id,
                  v_fdesde,
                  v_fhasta,
                  p_prov_id::varchar,
                  p_emp_id::varchar,
                  v_ret_id::varchar,
                  p_pago,
                  p_facturas,
                  1 /*p_IsForOPG*/) into v_retenciones;

         loop

            fetch v_retenciones into v_retencion;

            exit when not found;

            insert into tt_tmp_retencion_info(ret_id, cue_id, retencion, porcentaje, comprobante, base)
            values(
                   v_ret_id, v_cue_id, v_retencion.retencion,
                   v_retencion.porcentaje, v_retencion.comprobante,
                   v_retencion.base
                   );

         end loop;

         close v_retenciones;

      end if;

   end loop;

   open rtn for
      select
             tt.ret_id,
             ret_nombre,
             tt.cue_id,
             cue_nombre,
             cue.mon_id,
             retencion,
             porcentaje,
             comprobante,
             base
      from tt_tmp_retencion_info tt 
      inner join retencion ret on tt.ret_id = ret.ret_id
      inner join cuenta cue on tt.cue_id = cue.cue_id
   ;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_proveedor_get_retenciones(integer, integer, integer, date, decimal, varchar)
  owner to postgres;
