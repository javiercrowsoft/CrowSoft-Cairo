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