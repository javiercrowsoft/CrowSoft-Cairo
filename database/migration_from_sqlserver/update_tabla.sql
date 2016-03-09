update tabla set tbl_camposinview = replace(tbl_camposinview,'+','||');
update tabla set tbl_sqlhelp = replace(tbl_sqlhelp,'+','||');
update tabla set tbl_camposinviewcliente = replace(tbl_camposinviewcliente,'+','||');
update tabla set tbl_sqlhelpcliente = replace(tbl_sqlhelpcliente,'+','||');
    
    
update tabla set tbl_camposinview = replace(tbl_camposinview,'isnull(','coalesce(');
update tabla set tbl_sqlhelp = replace(tbl_sqlhelp,'isnull(','coalesce(');
update tabla set tbl_camposinviewcliente = replace(tbl_camposinviewcliente,'isnull(','coalesce(');
update tabla set tbl_sqlhelpcliente = replace(tbl_sqlhelpcliente,'isnull(','coalesce('); 
    
update tabla set tbl_camposinview = replace(tbl_camposinview,'IsNull(','coalesce(');
update tabla set tbl_sqlhelp = replace(tbl_sqlhelp,'IsNull(','coalesce(');
update tabla set tbl_camposinviewcliente = replace(tbl_camposinviewcliente,'IsNull(','coalesce(');
update tabla set tbl_sqlhelpcliente = replace(tbl_sqlhelpcliente,'IsNull(','coalesce(');

-- list and edit by hand
select * from tabla where tbl_camposinview like '%case %' ;
select * from tabla where tbl_camposinviewcliente like '%case %' ;
select * from tabla where tbl_camposinview like '%[%' ;
select tbl_id, tbl_camposinview, tbl_camposinviewcliente from tabla where tbl_camposinview like '%case %' ;
select tbl_id, tbl_camposinview, tbl_camposinviewcliente from tabla where tbl_camposinviewcliente like '%case %' ;
update tabla 
set 
          tbl_sqlhelp = replace(tbl_sqlhelp,'@@bFilterType','@@filterType'),
          tbl_sqlhelpcliente = replace(tbl_sqlhelpcliente,'@@bFilterType','@@filterType')
;
update tabla
set tbl_sqlhelp = 'select us_id, us_nombre as Usuario, coalesce(prs_nombre &&'' ''&& prs_apellido,'''') as Nombre from usuario left join persona prs on usuario.prs_id = prs.prs_id|us_nombre:string,coalesce(prs_nombre &&'' ''&& prs_apellido#''''):string'
where tbl_id = 3;
