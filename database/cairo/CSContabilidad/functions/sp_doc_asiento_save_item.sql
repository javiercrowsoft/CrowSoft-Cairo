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
-- Function: sp_doc_asiento_save_item()

-- drop function sp_doc_asiento_save_item(integer, integer, integer, integer, decimal, decimal, decimal, integer, integer, integer, integer, integer, varchar);

create or replace
function sp_doc_asiento_save_item
(
  in p_is_new integer,
  in p_asi_id integer,
  in p_as_id integer,
  in p_asi_orden integer,
  in p_asi_debe decimal(18,6),
  in p_asi_haber decimal(18,6),
  in p_asi_origen decimal(18,6),
  in p_asi_tipo integer,
  in p_mon_id integer,
  in p_cue_id integer,
  in p_ccos_id integer,
  in p_cheq_id integer,
  in p_asi_descrip varchar default ''
)
  returns void as
$BODY$
declare
   v_asi_id integer;
   v_asi_debe decimal(18,6);
   v_asi_haber decimal(18,6);
begin

   v_asi_debe := p_asi_debe;
   v_asi_haber := p_asi_haber;

   select sp_dbGetNewId('AsientoItem', 'asi_id') into v_asi_id;

   if p_asi_haber < 0 then

      v_asi_debe := abs(p_asi_haber);
      v_asi_haber := 0;

   end if;

   if p_asi_debe < 0 then

      v_asi_haber := abs(p_asi_debe);
      v_asi_debe := 0;

   end if;

   insert into AsientoItem ( as_id, asi_id, asi_orden, asi_descrip, asi_debe, asi_haber, asi_origen, asi_tipo, cue_id,
                             ccos_id, cheq_id, mon_id )
   values ( p_as_id, v_asi_id, p_asi_orden, p_asi_descrip, v_asi_debe, v_asi_haber, p_asi_origen, p_asi_tipo, p_cue_id,
            p_ccos_id, p_cheq_id, p_mon_id );

end;
$BODY$
  language plpgsql volatile
  COST 100;
alter function sp_doc_asiento_save_item(integer, integer, integer, integer, decimal, decimal, decimal, integer, integer, integer, integer, integer, varchar)
  owner to postgres;