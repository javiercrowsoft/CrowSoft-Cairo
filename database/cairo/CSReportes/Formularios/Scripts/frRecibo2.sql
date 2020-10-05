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
-- Function: frRecibo2(integer)

-- drop function frRecibo2(integer);

/*

select max(cobz_id) from cobranza;
select * from frRecibo2(980);
fetch all from rtn;

*/
create or replace function frRecibo2
(
  in p_cobz_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
declare

begin

   rtn := 'rtn';

   open rtn for
      select 0 orden_id,
             o.cobz_id,
             1 tipo,
             cli_nombre Cliente,
             cobz_fecha Fecha,
             case
                when lgj_titulo <> '' then lgj_titulo
                else lgj_codigo
             end Legajo,
             usFirma.us_nombre Autorizado,
             usModifico.us_nombre Confeccionado,
             ccos_nombre Centro_Costo,
             null Fecha_comprobante,
             '' Tipo_comp,
             '' Nro_comp,
             o.cobz_numero COBZ_Nro,
             o.cobz_nroDoc COBZ_Comp,
             0 Aplicacion,
             cobz_descrip Aclaraciones,
             bco_nombre Banco,
             c.cue_nombre Cuenta,
             cheq_numerodoc Nro_cheque,
             cheq_fechaVto Vencimiento,
             cheq_fechaCobro Cobro,
             cobzi_descrip Detalle,
             cobzi_importe Importe,
             cobz_total Total,
             'Recib¡ de ' || cli_razonsocial || ' la cantidad de:' Recibi_de
      from Cobranza o
               join CobranzaItem oi
                on o.cobz_id = oi.cobz_id
               join Cliente p
                on o.cli_id = p.cli_id
               join Usuario usModifico
                on o.modifico = usModifico.us_id
               join Empresa emp
                on o.emp_id = emp.emp_id
               left join Cheque ch
                on oi.cheq_id = ch.cheq_id
               left join Chequera chq
                on ch.chq_id = chq.chq_id
               left join Cuenta c
                on coalesce(oi.cue_id, chq.cue_id) = c.cue_id
               left join Usuario usFirma
                on o.cobz_firmado = usFirma.us_id
               left join Cuenta chqc
                on chq.cue_id = chqc.cue_id
               left join Banco b
                on ( chqc.bco_id = b.bco_id
               or ch.bco_id = b.bco_id )
               left join Legajo l
                on o.lgj_id = l.lgj_id
               left join CentroCosto ccos
                on o.ccos_id = ccos.ccos_id
      where o.cobz_id = p_cobz_id
        and oi.cobzi_tipo <> 5-- cuenta corriente

      union
      select 1 orden_id,
             o.cobz_id,
             0 tipo,
             cli_nombre Cliente,
             cobz_fecha Fecha,
             '' Legajo,
             usFirma.us_nombre Autorizado,
             usModifico.us_nombre Confeccionado,
             ccos_nombre Centro_Costo,
             fv_fecha Fecha_comprobante,
             doc_nombre Tipo_comp,
             fv_nrodoc Nro_comp,
             o.cobz_numero COBZ_Nro,
             o.cobz_nroDoc COBZ_Comp,
             fvcobz_importe Aplicacion,
             cobz_descrip Aclaraciones,
             '' Banco,
             '' Cuenta,
             '' Nro_cheque,
             null Vencimiento,
             null Cobro,
             '' Detalle,
             0 Importe,
             cobz_total Total,
             'Recib¡ de ' || cli_razonsocial || ' la cantidad de:' Recibi_de
      from Cobranza o
               join Cliente p
                on o.cli_id = p.cli_id
               join Usuario usModifico
                on o.modifico = usModifico.us_id
               join Empresa emp
                on o.emp_id = emp.emp_id
               left join Usuario usFirma
                on o.cobz_firmado = usFirma.us_id
               left join FacturaVentaCobranza fcop
                on fcop.cobz_id = o.cobz_id
               left join FacturaVentaDeuda fcd
                on fcop.fvd_id = fcd.fvd_id
               left join FacturaVentaPago fcp
                on fcop.fvp_id = fcp.fvp_id
               left join FacturaVenta fc
                on ( fcd.fv_id = fc.fv_id
               or fcp.fv_id = fc.fv_id )
               left join Documento d
                on fc.doc_id = d.doc_id
               left join CentroCosto ccos
                on o.ccos_id = ccos.ccos_id
      where o.cobz_id = p_cobz_id
      order by orden_id,
               tipo;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function frRecibo2(integer)
  owner to postgres;
