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
-- Function: sp_doc_fac_cpra_validate_deposito()

-- drop function sp_doc_fac_cpra_validate_deposito(integer);

/*
          select * from facturacompratmp;
          select * from sp_doc_fac_cpra_validate_deposito(45);
*/

create or replace function sp_doc_fac_cpra_validate_deposito
(
  in p_fcTMP_id integer,
  out p_success integer,
  out p_error_msg varchar
)
  returns record as
$BODY$
declare
    v_error integer;
    v_llevaStock integer;

    v_depl_nombre varchar(255);
    v_pr_nombrecompra varchar(2000);
    v_productos varchar(8000);
begin

   v_error := 0;
   p_success := 0;
   p_error_msg := '@@ERROR_SP:';

   select doc.doc_muevestock
     into v_llevaStock
   from Documento doc
   join FacturaCompraTMP fc
     on doc.doc_id = fc.doc_id
   where fc.fcTMP_id = p_fcTMP_id;

   if v_llevaStock <> 0 then

      if exists ( select 1
                  from FacturaCompraItemTMP fci
                  join FacturaCompraTMP fc
                    on fci.fcTMP_id = fc.fcTMP_id
                  join Documento doc
                    on fc.doc_id = doc.doc_id
                  where fc.fcTMP_id = p_fcTMP_id
                    and not exists ( select *
                                     from ProductoDepositoEntrega
                                     where pr_id = fci.pr_id
                                       and depl_id = fc.depl_id
                                       and suc_id = fc.suc_id
                                       and emp_id = doc.emp_id
                                       and ( prov_id is null or prov_id = fc.prov_id ) )
                    and exists ( select *
                                 from ProductoDepositoEntrega
                                 where pr_id = fci.pr_id
                                   and depl_id <> fc.depl_id
                                   and suc_id = fc.suc_id
                                   and emp_id = doc.emp_id
                                   and ( prov_id is null or prov_id = fc.prov_id ) ) ) then
         select depl.depl_nombre
           into v_depl_nombre
         from FacturaCompraTMP fc
         join DepositoLogico depl
           on fc.depl_id = depl.depl_id
         where fc.fcTMP_id = p_fcTMP_id;

         v_productos := '';

         for v_pr_nombrecompra in
            select pr.pr_nombrecompra
            from FacturaCompraItemTMP fci
            join FacturaCompraTMP fc
             on fci.fcTMP_id = fc.fcTMP_id
            join Producto pr
             on fci.pr_id = pr.pr_id
            join Documento doc
             on fc.doc_id = doc.doc_id
            where fc.fcTMP_id = p_fcTMP_id
              and not exists ( select *
                               from ProductoDepositoEntrega
                               where pr_id = fci.pr_id
                                 and depl_id = fc.depl_id
                                 and suc_id = fc.suc_id
                                 and emp_id = doc.emp_id
                                 and ( prov_id is null or prov_id = fc.prov_id ) )
              and exists ( select *
                           from ProductoDepositoEntrega
                           where pr_id = fci.pr_id
                             and depl_id <> fc.depl_id
                             and suc_id = fc.suc_id
                             and emp_id = doc.emp_id
                             and ( prov_id is null or prov_id = fc.prov_id ) )
         loop
            v_productos := v_productos || v_pr_nombrecompra || CHR(10);
         end loop;

         v_error := 1;

         p_error_msg := p_error_msg || 'Esta factura indica articulos que no estan habilitados para ingresar en el deposito:' || CHR(10) || CHR(10) || v_depl_nombre || CHR(10) || CHR(10) || 'Los articulos son:' || CHR(10) || CHR(10) || v_productos;

      end if;

   end if;

   -- No hubo errores asi que todo bien
   --
   if v_error = 0 then
      p_success := 1;
   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_fac_cpra_validate_deposito(integer)
  owner to postgres;