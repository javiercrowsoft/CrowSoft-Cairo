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
-- Function: sp_doc_op_mf_cheque_save()

/*
drop function sp_doc_op_mf_cheque_save(
  integer,
  varchar,
  decimal,
  decimal,
  date,
  date,
  varchar,
  integer,
  integer,
  integer,
  integer,
  integer,
  integer,
  integer,
  integer,
  integer);
*/

create or replace function sp_doc_op_mf_cheque_save
(
  in p_tipo integer,
  in p_cheq_numerodoc varchar,
  in p_importe decimal(18,6),
  in p_importeOrigen decimal(18,6),
  in p_cheq_fechaCobro date,
  in p_cheq_fechaVto date,
  in p_descrip varchar,
  in p_chq_id integer,
  in p_opg_id integer,
  in ip_mf_id integer,
  in p_dbco_id integer,
  in p_cle_id integer,
  in p_mon_id integer,
  in p_prov_id integer,
  in ip_cue_id integer,
  inout p_cheq_id integer
)
  returns integer as
$BODY$
declare
   p_cue_id integer := ip_cue_id;
   p_mf_id integer := ip_mf_id;
   v_opgit_cheques smallint := 1;
   v_opgit_chequesT smallint := 6;
   v_cheq_propio smallint := 1;
   v_bco_id integer;
   v_cheq_numero integer;
   v_emp_id integer;
   v_cheq_fecha2 date;
begin

   -- obtengo la empresa de este cheque
   --
   if coalesce(p_opg_id, 0) <> 0 then

      select doc.emp_id
        into v_emp_id
      from OrdenPago opg
      join Documento doc
        on opg.doc_id = doc.doc_id
      where opg.opg_id = p_opg_id;

   else

      if coalesce(p_mf_id, 0) <> 0 then

         select doc.emp_id
           into v_emp_id
         from MovimientoFondo mf
         join Documento doc
           on mf.doc_id = doc.doc_id
         where mf.mf_id = p_mf_id;

      else

         if coalesce(p_dbco_id, 0) <> 0 then

            select doc.emp_id
              into v_emp_id
            from DepositoBanco dbco
            join Documento doc
              on dbco.doc_id = doc.doc_id
            where dbco.dbco_id = p_dbco_id;

         end if;
      end if;
   end if;

   -- esto es aproposito, ya que los cheques propios que se utilizan para
   -- pagar a proveedores no estan asociados a ninguna cuenta contable
   --
   if exists ( select *
               from Cheque
               where cheq_id = p_cheq_id
                 and p_opg_id is not null ) then

      p_cue_id := null;

   else

      if exists ( select *
                  from Cheque
                  where cheq_id = p_cheq_id
                    and coalesce(mf_id, 0) > coalesce(p_mf_id, 0) ) then

         select cue_id,
                mf_id
           into p_cue_id,
                p_mf_id
         from Cheque
         where cheq_id = p_cheq_id;

      end if;

   end if;

   -- si este renglon es un cheque lo doy de alta en la tabla Cheque
   --
   if p_tipo = v_opgit_cheques or p_tipo = v_opgit_chequesT then

      -- obtengo el banco
      --
      select bco_id
        into v_bco_id
      from Cuenta
      join Chequera
        on Cuenta.cue_id = Chequera.cue_id
      where chq_id = p_chq_id;

      -- si es nuevo insert
      --
      if p_cheq_id is null then

         select sp_dbGetNewId('Cheque', 'cheq_id') into p_cheq_id;
         select sp_dbGetNewId('Cheque', 'cheq_numero') into v_cheq_numero;

         select sp_doc_get_fecha2(p_cheq_fechaCobro, 1, p_cle_id) into v_cheq_fecha2;

         insert into Cheque( cheq_id, cheq_numero, cheq_numerodoc, cheq_importe, cheq_importeOrigen, cheq_tipo,
                             cheq_fechaCobro, cheq_fechaVto, cheq_fecha2, cheq_descrip, chq_id, opg_id, mf_id, dbco_id,
                             cle_id, bco_id, cue_id, mon_id, prov_id, emp_id )
         values ( p_cheq_id, v_cheq_numero, p_cheq_numerodoc, p_importe, p_importeOrigen, v_cheq_propio,
                  p_cheq_fechaCobro, p_cheq_fechaVto, v_cheq_fecha2, p_descrip, p_chq_id, p_opg_id, p_mf_id, p_dbco_id,
                  p_cle_id, v_bco_id, p_cue_id, p_mon_id, p_prov_id, v_emp_id );

         perform sp_chequera_set(p_chq_id, p_cheq_numerodoc);

      else

         -- cheque de tercero ya que no tiene chequera
         --
         if p_chq_id is null then

            update Cheque
               set opg_id = coalesce(p_opg_id, opg_id),
                   mf_id = coalesce(p_mf_id, mf_id),
                   dbco_id = coalesce(p_dbco_id, dbco_id),
                   cue_id = p_cue_id,
                   prov_id = coalesce(p_prov_id, prov_id)
            where cheq_id = p_cheq_id;

         -- cheque propio
         --
         else

            select sp_doc_get_fecha2(p_cheq_fechaCobro, 1, p_cle_id) into v_cheq_fecha2;

            -- sino update
            --
            update Cheque
               set cheq_numerodoc = p_cheq_numerodoc,
                   cheq_importe = p_importe,
                   cheq_importeOrigen = p_importeOrigen,
                   cheq_tipo = v_cheq_propio,
                   cheq_fechaCobro = p_cheq_fechaCobro,
                   cheq_fechaVto = p_cheq_fechaVto,
                   cheq_fecha2 = v_cheq_fecha2,
                   cheq_descrip = p_descrip,
                   chq_id = p_chq_id,
                   opg_id = coalesce(p_opg_id, opg_id),
                   mf_id = coalesce(p_mf_id, mf_id),
                   dbco_id = coalesce(p_dbco_id, dbco_id),
                   cle_id = p_cle_id,
                   bco_id = v_bco_id,
                   cue_id = p_cue_id,
                   mon_id = p_mon_id,
                   prov_id = coalesce(p_prov_id, prov_id)
            where cheq_id = p_cheq_id;

         end if;

      end if;

   end if;

exception
   when others then

      raise exception '%. %.', sqlstate, sqlerrm;

end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_doc_op_mf_cheque_save(
  integer,
  varchar,
  decimal,
  decimal,
  date,
  date,
  varchar,
  integer,
  integer,
  integer,
  integer,
  integer,
  integer,
  integer,
  integer,
  integer)
  owner to postgres;