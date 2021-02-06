# Cairo Database

## Update Cairo

read postgresql.md

## Cairo Scripts

## Common Patterns

### Replace Cursors

example

      CURSOR c_pagos is 
      select fcopg.fc_id,
             opg.opg_fecha,
             opg.opg_nrodoc,
             sum(fcopg.fcopg_importe)
      from FacturaCompraOrdenPago fcopg
        join OrdenPago opg
          on fcopg.opg_id = opg.opg_id
      group by fcopg.fc_id,opg.opg_fecha,opg.opg_nrodoc;

      open c_pagos

      fetch c_pagos into v_fc_id,v_opg_fecha,v_opg_nrodoc,v_opg_importe;
        
      while sqlserver_utilities.fetch_status(c_pagos%found) = 0
      loop
        begin


replace with

      for v_fc_id,v_opg_fecha,v_opg_nrodoc,v_opg_importe in

          select fcopg.fc_id,
                 opg.opg_fecha,
                 opg.opg_nrodoc,
                 sum(fcopg.fcopg_importe)
         from FacturaCompraOrdenPago fcopg
         join OrdenPago opg on fcopg.opg_id = opg.opg_id
         group by fcopg.fc_id,opg.opg_fecha,opg.opg_nrodoc

      loop

### Temporary Tables

        drop table if exists tt_tmp_retencion;
        create temporary table tt_tmp_retencion
        
        drop table if exists tt_tmp_retencion;
        create temporary table tt_tmp_retencion
        (
        ret_id integer
        ) on commit drop;
        
        drop table if exists tt_tmp_retencion_info;
        create temporary table tt_tmp_retencion_info
        (
        ret_id integer,
        cue_id integer,
        retencion decimal(18,6),
        porcentaje decimal(18,6),
        comprobante varchar(100),
        base decimal(18,6)
        ) on commit drop;

### Datetime Columns

    v_last_fecha date;

replace with

    v_last_fecha              timestamp with time zone;

### print messages

You mast use raise notice. Some examples:

    raise notice 'insert tbl1 done!';

    raise notice 'v_anticitpo %, v_opg_total %', v_anticipo, v_opg_total;