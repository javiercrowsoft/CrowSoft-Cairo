select * from configuracion where cfg_aspecto like '%eng%'
update configuracion set cfg_valor = 1 where cfg_id in (644,150,517)