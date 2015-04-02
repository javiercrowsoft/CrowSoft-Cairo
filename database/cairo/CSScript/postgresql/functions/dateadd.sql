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
-- Function: dateadd(character varying, integer, timestamp with time zone)

-- drop function dateadd(character varying, integer, timestamp with time zone);

create or replace function dateadd(p_interval character varying, p_interval_val integer, p_date timestamp with time zone)
  returns timestamp with time zone as
$BODY$
declare
    v_ucase_interval varchar(10);
    v_date timestamp with time zone;
begin
    v_date := p_date;
    v_ucase_interval := UPPER(p_interval);
      
    if v_ucase_interval in ('YEAR', 'YY', 'YYYY')
    then
      RETURN add_months(v_date, p_interval_val * 12);
      
    ELSif v_ucase_interval in ('QUARTER', 'QQ', 'Q')
    then
      RETURN add_months(v_date, p_interval_val * 3);
      
    ELSif v_ucase_interval in ('MONTH', 'MM', 'M')
    then
      RETURN add_months(v_date, p_interval_val);
      
    ElSif v_ucase_interval in ('DAYOFYEAR', 'DY', 'Y', 'DAY', 'DD', 'D', 'WEEKDAY', 'DW', 'W')
    then
      RETURN v_date + (p_interval_val * '1 day'::interval);
      
    ElSif v_ucase_interval in ('WEEK', 'WK', 'WW')
    then
      RETURN v_date + (p_interval_val * 7 * '1 day'::interval);
      
    ElSif v_ucase_interval in ('HOUR', 'HH')
    then
      RETURN v_date + (p_interval_val * '1 hour'::interval);
      
    ElSif v_ucase_interval in ('MINUTE', 'MI', 'N')
    then
      RETURN v_date + (p_interval_val * '1 minute'::interval);
      
    ElSif v_ucase_interval in ('SECOND', 'SS', 'S')
    then
      RETURN v_date + (p_interval_val * '1 second'::interval);
      
    ElSif v_ucase_interval in ('MILLISECOND', 'MS')
    then
      RETURN v_date + (p_interval_val * '1 millisecond'::interval);
      
    else
      RETURN null;
    end if;
end;
$BODY$
  language plpgsql volatile
  cost 100;
alter function dateadd(character varying, integer, timestamp with time zone)
  owner to postgres;
