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
-- Function: sp_documento_get()

-- drop function sp_documento_get(integer);

create or replace function sp_documento_get
/*
          select * from sp_documento_get(4);
          fetch all from rtn;

          select * from documento
*/
(
  in p_doc_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
begin

      rtn := 'rtn';

      open rtn for
         select Documento.*,
                emp_nombre,
                fca_nombre,
                doct_nombre,
                cico_nombre,
                Talonario.ta_nombre,
                tInscripto.ta_nombre taInscripto,
                tFinal.ta_nombre taFinal,
                tExterno.ta_nombre taExterno,
                tInscriptoM.ta_nombre taInscriptoM,
                tHaberes.ta_nombre taHaberes,
                mon_nombre,
                cueg_nombre,
                tDocAsiento.doc_nombre docAsiento,
                tDocRemito.doc_nombre docRemito,
                tDocStock.doc_nombre docStock,
                docg.docg_nombre
         from Documento
            inner join DocumentoTipo         on Documento.doct_id = DocumentoTipo.doct_id
            left join Talonario              on Documento.ta_id = Talonario.ta_id
            left join CircuitoContable       on Documento.cico_id = CircuitoContable.cico_id
            inner join Empresa               on Documento.emp_id = Empresa.emp_id
            left join Talonario tFinal       on Documento.ta_id_final = tFinal.ta_id
            left join Talonario tInscripto   on Documento.ta_id_inscripto = tInscripto.ta_id
            left join Talonario tExterno     on Documento.ta_id_externo = tExterno.ta_id
            left join Talonario tInscriptoM  on Documento.ta_id_inscriptom = tInscriptoM.ta_id
            left join Talonario tHaberes     on Documento.ta_id_haberes = tHaberes.ta_id
            left join Moneda                 on Documento.mon_id = Moneda.mon_id
            left join FechaControlAcceso     on Documento.fca_id = FechaControlAcceso.fca_id
            left join CuentaGrupo            on Documento.cueg_id = CuentaGrupo.cueg_id
            left join Documento tDocAsiento  on Documento.doc_id_asiento = tDocAsiento.doc_id
            left join Documento tDocRemito   on Documento.doc_id_remito = tDocRemito.doc_id
            left join Documento tDocStock    on Documento.doc_id_stock = tDocStock.doc_id
            left join DocumentoGrupo docg    on Documento.docg_id = docg.docg_id

         where Documento.doc_id = p_doc_id;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_documento_get(integer)
  owner to postgres;
