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
-- Function: frMovimientoFondo(integer)

-- drop function frMovimientoFondo(integer);

/*

select max(opg_id) from ordenpago;
select * from frMovimientoFondo(102);
fetch all from rtn;

*/
create or replace function frMovimientoFondo
(
  in p_opg_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare
begin

   rtn := 'rtn';

   open rtn for
      select 0 orden_id,
             mf.mf_id,
             mfi.mfi_tipo tipo,
             mf.mf_fecha Fecha,
             case
                when l.lgj_titulo <> '' then l.lgj_titulo
                else l.lgj_codigo
             end Legajo,
             usFirma.us_nombre Autorizado,
             usModifico.us_nombre Confeccionado,
             mf.mf_numero Mov_Fondo_Nro,
             mf.mf_nroDoc Mov_Fondo_Comp,
             0 Aplicacion,
             mf.mf_descrip Aclaraciones,
             bco.bco_nombre Banco,
             mon.mon_nombre Moneda,
             cueh.cue_nombre Cuenta_origen,
             cued.cue_nombre Cuenta_destino,
             cheq.cheq_numerodoc Nro_cheque,
             cheq.cheq_fechaVto Vencimiento,
             cheq.cheq_fechacobro Fecha_Cobro,
             cle.cle_nombre Clearing,
             mfi.mfi_descrip Detalle,
             mfi.mfi_importe Importe,
             mf.mf_total Total,
             ccosh.ccos_nombre CentroCostoHeader,
             ccosi.ccos_nombre CentroCostoItem
      from MovimientoFondo mf
               join MovimientoFondoItem mfi
                on mf.mf_id = mfi.mf_id
               join Usuario usModifico
                on mf.modifico = usModifico.us_id
               join Documento doc
                on mf.doc_id = doc.doc_id
               join Empresa emp
                on doc.emp_id = emp.emp_id
               join Moneda mon
                on mf.mon_id = mon.mon_id
               join Cuenta cued
                on mfi.cue_id_debe = cued.cue_id
               join Cuenta cueh
                on mfi.cue_id_haber = cueh.cue_id
               left join Cheque cheq
                on mfi.cheq_id = cheq.cheq_id
               left join Clearing cle
                on cheq.cle_id = cle.cle_id
               left join Chequera chq
                on cheq.chq_id = chq.chq_id
               left join Cuenta cuechq
                on chq.cue_id = cuechq.cue_id
               left join Banco bco
                on ( cuechq.bco_id = bco.bco_id
               or cheq.bco_id = bco.bco_id )
               left join Usuario usFirma
                on mf.mf_firmado = usFirma.us_id
               left join Legajo l
                on mf.lgj_id = l.lgj_id
               left join CentroCosto ccosh
                on mf.ccos_id = ccosh.ccos_id
               left join CentroCosto ccosi
                on mfi.ccos_id = ccosi.ccos_id
      where mf.mf_id = p_mf_id
      order by orden_id,
               tipo;
end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function frMovimientoFondo(integer)
  owner to postgres;
