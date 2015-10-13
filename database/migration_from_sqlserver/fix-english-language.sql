select * from sp_rubro_get(7);
fetch all from rtn;

select * from configuracion where cfg_aspecto like '%eng%'
update configuracion set cfg_valor = '3' where cfg_id = 517

select * from lenguajeitem where lengi_texto like '%Rubro'
select * from lenguajeitem where lengi_codigo = '2048'

select * from lenguajeitem where lengi_id = 2706;
select * from lenguajeitem where lengi_texto like '%Cash%' and leng_id = 3
update lenguajeitem set lengi_texto = 'Treasury' where lengi_id = 4730;
update lenguajeitem set lengi_texto = 'Product' where lengi_id = 2758;
update lenguajeitem set lengi_texto = 'Stock Product' where lengi_id = 2759;
update lenguajeitem set lengi_texto = 'Could not get the tax and accounting information related to product #1#' where lengi_id = 4334;

select max(lengi_codigo) from lenguajeitem

select sp_dbGetNewId('Lenguajeitem', 'lengi_id');6400
insert into LenguajeItem (lengi_id, leng_id, lengi_codigo, lengi_texto, modifico) values(6404, 3, '5139','Product', 1);


select * from sp_sys_language_update()

select ti_id_ivariventa, ti_id_ivaricompra, * from producto where pr_id = 3

select * from tasaimpositiva