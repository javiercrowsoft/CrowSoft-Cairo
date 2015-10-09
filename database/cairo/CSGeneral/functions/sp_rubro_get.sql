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
-- Function: sp_rubro_get()

-- drop function sp_rubro_get(integer);
/*
          select * from sp_rubro_get(1);
          fetch all from rtn;
*/
create or replace function sp_rubro_get
(
  in p_rub_id integer,
  out rtn refcursor
)
  returns refcursor as
$BODY$
begin

   rtn := 'rtn';

   begin
      open rtn for
         select Rubro.*,
                rt1.rubt_nombre rubt_name1,
                rt2.rubt_nombre rubt_name2,
                rt3.rubt_nombre rubt_name3,
                rt4.rubt_nombre rubt_name4,
                rt5.rubt_nombre rubt_name5,
                rt6.rubt_nombre rubt_name6,
                rt7.rubt_nombre rubt_name7,
                rt8.rubt_nombre rubt_name8,
                rt9.rubt_nombre rubt_name9,
                rt10.rubt_nombre rubt_name10,
                rti1.rubti_nombre rubti_name1,
                rti2.rubti_nombre rubti_name2,
                rti3.rubti_nombre rubti_name3,
                rti4.rubti_nombre rubti_name4,
                rti5.rubti_nombre rubti_name5,
                rti6.rubti_nombre rubti_name6,
                rti7.rubti_nombre rubti_name7,
                rti8.rubti_nombre rubti_name8,
                rti9.rubti_nombre rubti_name9,
                rti10.rubti_nombre rubti_name10
           from Rubro
                  left join RubroTabla rt1
                   on Rubro.rubt_id1 = rt1.rubt_id
                  left join RubroTabla rt2
                   on Rubro.rubt_id2 = rt2.rubt_id
                  left join RubroTabla rt3
                   on Rubro.rubt_id3 = rt3.rubt_id
                  left join RubroTabla rt4
                   on Rubro.rubt_id4 = rt4.rubt_id
                  left join RubroTabla rt5
                   on Rubro.rubt_id5 = rt5.rubt_id
                  left join RubroTabla rt6
                   on Rubro.rubt_id6 = rt6.rubt_id
                  left join RubroTabla rt7
                   on Rubro.rubt_id7 = rt7.rubt_id
                  left join RubroTabla rt8
                   on Rubro.rubt_id8 = rt8.rubt_id
                  left join RubroTabla rt9
                   on Rubro.rubt_id9 = rt9.rubt_id
                  left join RubroTabla rt10
                   on Rubro.rubt_id10 = rt10.rubt_id
                  left join RubroTablaItem rti1
                   on Rubro.rubti_id1 = rti1.rubti_id
                  left join RubroTablaItem rti2
                   on Rubro.rubti_id2 = rti2.rubti_id
                  left join RubroTablaItem rti3
                   on Rubro.rubti_id3 = rti3.rubti_id
                  left join RubroTablaItem rti4
                   on Rubro.rubti_id4 = rti4.rubti_id
                  left join RubroTablaItem rti5
                   on Rubro.rubti_id5 = rti5.rubti_id
                  left join RubroTablaItem rti6
                   on Rubro.rubti_id6 = rti6.rubti_id
                  left join RubroTablaItem rti7
                   on Rubro.rubti_id7 = rti7.rubti_id
                  left join RubroTablaItem rti8
                   on Rubro.rubti_id8 = rti8.rubti_id
                  left join RubroTablaItem rti9
                   on Rubro.rubti_id9 = rti9.rubti_id
                  left join RubroTablaItem rti10
                   on Rubro.rubti_id10 = rti10.rubti_id
            where rub_id = p_rub_id;

   end;
end;

$BODY$
  language plpgsql volatile
  cost 100;
alter function sp_rubro_get(integer)
  owner to postgres;