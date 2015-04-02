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
-- Function: sp_doc_factura_compra_get_percepciones()

-- drop function sp_doc_factura_compra_get_percepciones(integer);
/*
select * from sp_doc_factura_compra_get_percepciones(1);
fetch all from rtn;
fetch all from rtn_serie;
*/
create or replace function sp_doc_factura_compra_get_percepciones
/*
sp_DocFacCpraGetPercepcionesones 1
*/
(
  in p_fc_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
begin

   open rtn for
      select FacturaCompraPercepcion.*,
             perc_nombre,
             ccos.ccos_nombre
      from FacturaCompraPercepcion
        join Percepcion
                on FacturaCompraPercepcion.perc_id = Percepcion.perc_id
        left join CentroCosto ccos
                on FacturaCompraPercepcion.ccos_id = ccos.ccos_id
      where fc_id = p_fc_id
      order by fcperc_orden;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_factura_compra_get_percepciones(integer)
  owner to postgres;