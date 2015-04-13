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
-- Function: sp_lista_precio_save_auto()

-- drop function sp_lista_precio_save_auto(integer, integer, integer, date);

create or replace function sp_lista_precio_save_auto
(
  in p_doc_id integer,
  in p_doct_id integer,
  in p_is_new integer,
  in p_fecha date
)
  returns void as
$BODY$
declare
  v_us_id integer;
  v_lp_id integer;
  v_lpi_id integer;
  v_pr_id integer;
  v_precio decimal(18,6);
  v_cotiz decimal(18,6);
  v_doc_fecha date;
  v_mon_id_precio integer;
  v_mon_id_legal integer;
  v_mon_id_lista integer;

  c_items refcursor;
  c_listas refcursor;
begin

   if p_doct_id in ( 1,2,3,4 ) then

      if p_doct_id in ( 1,3 ) then

         open c_listas for
            select lp_id
            from ListaPrecio
            where lp_tipo = 1
              and lp_autoXcompra <> 0;

      end if;

      if p_doct_id in ( 2,4 ) then

         open c_listas for
            select lp_id
            from ListaPrecio
            where lp_tipo in ( 2,3 )
              and lp_autoXcompra <> 0;

      end if;

      if p_is_new <> 0 then

         if p_doct_id = 1 then

            select modifico
              into v_us_id
            from FacturaVenta
            where fv_id = p_doc_id;

            open c_items for
               select fvi.pr_id,
                      fvi.fvi_precio,
                      fvi.fv_cotizacion,
                      fvi.mon_id,
                      fvi.fv_fecha
               from FacturaVentaItem fvi
               join FacturaVenta fv
                 on fvi.fv_id = fv.fv_id
               where fvi.fv_id = p_doc_id
                 and round(fvi.fvi_precio, 2) <> 0;

         end if;

         if p_doct_id = 2 then

            select modifico
              into v_us_id
            from FacturaCompra
            where fc_id = p_doc_id;

            open c_items for
               select fci.pr_id,
                      fci.fci_precio,
                      fci.fc_cotizacion,
                      fci.mon_id,
                      fci.fc_fecha
               from FacturaCompraItem fci
               join FacturaCompra fc
                 on fci.fc_id = fc.fc_id
               where fci.fc_id = p_doc_id
                 and round(fci.fci_precio, 2) <> 0;

         end if;

         if p_doct_id = 3 then

            select modifico
              into v_us_id
            from RemitoVenta
            where rv_id = p_doc_id;

            open c_items for
               select rvi.pr_id,
                      rvi.rvi_precio,
                      rvi.rv_cotizacion,
                      doc.mon_id,
                      rvi.rv_fecha
               from RemitoVentaItem rvi
               join RemitoVenta rv
                 on rvi.rv_id = rv.rv_id
               join Documento doc
                 on rv.doc_id = doc.doc_id
               where rvi.rv_id = p_doc_id
                 and round(rvi.rvi_precio, 2) <> 0;

         end if;

         if p_doct_id = 4 then

            select modifico
              into v_us_id
            from RemitoCompra
            where rc_id = p_doc_id;

            open c_items for
               select rci.pr_id,
                      rci.rci_precio,
                      rci.rc_cotizacion,
                      doc.mon_id,
                      rci.rc_fecha
               from RemitoCompraItem rci
               join RemitoCompra rc
                 on rci.rc_id = rc.rc_id
               join Documento doc
                 on rc.doc_id = doc.doc_id
               where rci.rc_id = p_doc_id
                 and round(rci.rci_precio, 2) <> 0;

         end if;

      else

         if p_doct_id = 1 then

            select modifico
              into v_us_id
            from FacturaVenta
            where fv_id = p_doc_id;

            open c_items for
               select fvi2.pr_id,
                      fvi2.fvi_precio,
                      fvi2.fv_cotizacion,
                      fvi2.mon_id,
                      fvi2.fv_fecha
               from FacturaVentaItem fvi2
               join FacturaVenta fv
                 on fvi2.fv_id = fv.fv_id
               where fvi2.fv_id = p_doc_id
                 and round(fvi2.fvi_precio, 2) <> 0
                 and not exists ( select fv.fv_id
                                  from FacturaVentaItem fvi
                                  join FacturaVenta fv
                                    on fvi.fv_id = fv.fv_id
                                  where fv.fv_id <> p_doc_id
                                    and fvi.fv_fecha > p_fecha
                                    and fvi.pr_id = fvi2.pr_id );

         end if;

         if p_doct_id = 2 then

            select modifico
              into v_us_id
            from FacturaCompra
            where fc_id = p_doc_id;

            open c_items for
               select fci2.pr_id,
                      fci2.fci_precio,
                      fc.fc_cotizacion,
                      fc.mon_id,
                      fc.fc_fecha
               from FacturaCompraItem fci2
               join FacturaCompra fc
                 on fci2.fc_id = fc.fc_id
               where fci2.fc_id = p_doc_id
                 and round(fci2.fci_precio, 2) <> 0
                 and not exists ( select fc.fc_id
                                  from FacturaCompraItem fci
                                  join FacturaCompra fc
                                    on fci.fc_id = fc.fc_id
                                  where fc.fc_id <> p_doc_id
                                    and fci.fc_fecha > p_fecha
                                    and fci.pr_id = fci2.pr_id );

         end if;

         if p_doct_id = 3 then

            select modifico
              into v_us_id
            from RemitoVenta
            where rv_id = p_doc_id;

            open c_items for
               select rvi2.pr_id,
                      rvi2.rvi_precio,
                      rv.rv_cotizacion,
                      doc.mon_id,
                      rv.rv_fecha
               from RemitoVentaItem rvi2
               join RemitoVenta rv
                 on rvi2.rv_id = rv.rv_id
               join Documento doc
                 on rv.doc_id = doc.doc_id
               where rvi2.rv_id = p_doc_id
                 and round(rvi2.rvi_precio, 2) <> 0
                 and not exists ( select rv.rv_id
                                  from RemitoVentaItem rvi
                                  join RemitoVenta rv
                                    on rvi.rv_id = rv.rv_id
                                  where rv.rv_id <> p_doc_id
                                    and rvi.rv_fecha > p_fecha
                                    and rvi.pr_id = rvi2.pr_id );

         end if;

         if p_doct_id = 4 then

            select modifico
              into v_us_id
            from RemitoCompra
            where rc_id = p_doc_id;

            open c_items for
               select rci2.pr_id,
                      rci2.rci_precio,
                      rci2.rc_cotizacion,
                      doc.mon_id,
                      rci2.rc_fecha
               from RemitoCompraItem rci2
               join RemitoCompra rc
                 on rci2.rc_id = rc.rc_id
               join Documento doc
                 on rc.doc_id = doc.doc_id
               where rci2.rc_id = p_doc_id
                 and round(rci2.rci_precio, 2) <> 0
                 and not exists ( select rc.rc_id
                                  from RemitoCompraItem rci
                                  join RemitoCompra rc
                                    on rci.rc_id = rc.rc_id
                                  where rc.rc_id <> p_doc_id
                                    and rci.rc_fecha > p_fecha
                                    and rci.pr_id = rci2.pr_id );

         end if;

      end if;

      select mon_id
        into v_mon_id_legal
      from Moneda
      where mon_legal <> 0;

      loop

         fetch c_listas into v_lp_id;
         exit when c_listas%notfound;

         select mon_id
           into v_mon_id_lista
         from ListaPrecio
         where lp_id = v_lp_id;

         loop

            fetch c_items into v_pr_id,v_precio,v_cotiz,v_mon_id_precio,v_doc_fecha;
            exit when c_items%notfound;

            -- calculo el precio segun su moneda y cotizacion
            --
            if v_mon_id_precio <> v_mon_id_lista then

               if v_mon_id_lista = v_mon_id_legal then

                  v_precio := v_precio * v_cotiz;

               else

                  if v_mon_id_precio = v_mon_id_legal then

                     v_cotiz := 0;
                     select sp_moneda_get_cotizacion(v_mon_id_lista, v_doc_fecha) into v_cotiz;

                     if v_cotiz is null then
                        v_cotiz := 0;
                     end if;

                     -- precio en moneda extranjera
                     --
                     if v_cotiz = 0 then
                        v_precio := 0;
                     else
                        v_precio := v_precio / v_cotiz;
                     end if;

                  else

                     -- paso a moneda legal el precio del documento
                     --
                     v_cotiz := 0;

                     select sp_moneda_get_cotizacion(v_mon_id_precio, v_doc_fecha) into v_cotiz;

                     if v_cotiz is null then
                        v_cotiz := 0;
                     end if;

                     -- precio en moneda legal
                     --
                     v_precio := v_precio * v_cotiz;

                     -- paso a la moneda de la lista de precios el precio en moneda legal
                     --
                     v_cotiz := 0;

                     select sp_moneda_get_cotizacion(v_mon_id_lista, v_doc_fecha) into v_cotiz;

                     if v_cotiz is null then
                        v_cotiz := 0;
                     end if;

                     -- precio en moneda extranjera
                     --
                     if v_cotiz = 0 then
                        v_precio := 0;
                     else
                        v_precio := v_precio / v_cotiz;
                     end if;

                  end if;

               end if;

            end if;

            -- actualizo el precio
            --
            v_lpi_id := null;

            select lpi_id
              into v_lpi_id
            from ListaPrecioItem
            where lp_id = v_lp_id
              and pr_id = v_pr_id;

            if v_lpi_id is null then

               select sp_dbGetNewId('ListaPrecioItem', 'lpi_id') into v_lpi_id;

               insert into ListaPrecioItem ( lp_id, lpi_id, lpi_precio, pr_id, modifico )
               values ( v_lp_id, v_lpi_id, v_precio, v_pr_id, v_us_id );

            else

               update ListaPrecioItem
                  set lpi_precio = v_precio,
                      modifico = v_us_id
               where lpi_id = v_lpi_id;

            end if;

         end loop;

         close c_items;

      end loop;

      close c_listas;

   end if;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_lista_precio_save_auto(integer, integer, integer, date)
  owner to postgres;