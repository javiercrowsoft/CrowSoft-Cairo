update tabla set tbl_camposinview = 'codigo= cli_codigo,activo=Activo,Modifico=(select us_nombre from usuario where us_id =Cliente.modifico),
Prospecto = (case cli_esprospecto when 0 then ''No'' else ''Si'' end)'
where tbl_id = 28;

update tabla set tbl_camposinview = 'Codigo=pr_codigo,
''Grupo Compra''=(select cueg_codigo from cuentagrupo where cueg_id = cueg_id_compra),
''Cuenta Compra''=(select cue_nombre from cuentagrupo cueg inner join cuenta cue on cueg.cue_id = cue.cue_id where cueg_id = cueg_id_compra),
''Grupo Venta''=(select cueg_codigo from cuentagrupo where cueg_id = cueg_id_venta),
''Cuenta Venta''=(select cue_nombre from cuentagrupo cueg inner join cuenta cue on cueg.cue_id = cue.cue_id where cueg_id = cueg_id_venta),
Marca=coalesce((select marc_nombre from marca where marc_id =Producto.marc_id),''''),
''Lleva Stock''=(case when pr_llevastock = 0 then ''No''else ''Si''end), 
Activo=Activo,
Modifico=(select us_nombre from usuario where us_id =Producto.modifico)'
where tbl_id = 30;

update tabla set tbl_camposinview = 'Codigo=ret_codigo,Activo,Modifico=(select us_nombre from usuario where us_id =Retencion.modifico),
IIBB=(case when ret_esiibb<> 0 then ''Si'' else ''No'' end),
Tipo=(case ret_tipominimo when 1 then ''No imponible'' when 2 then ''Imponible'' end)'
where tbl_id = 1014;

update tabla set tbl_camposinview = 'codigo= prfk_codigo,
activo=Activo,
Articulo=(select pr_nombrecompra from producto where pr_id =ProductoFormulaKit.pr_id),
Default=(case prfk_default when 1 then ''Si'' else '''' end),
Modifico=(select us_nombre from usuario where us_id =ProductoFormulaKit.modifico)'
where tbl_id = 1027;

update tabla set tbl_camposinview = 'codigo= inf_codigo,
tipo=(case inf_tipo when 1 then ''Informe'' else ''Proceso'' end),
activo=Activo,
Modulo=inf_modulo,
Modifico=(select us_nombre from usuario where us_id =informe.modifico)'
where tbl_id = 7001;

update tabla set tbl_camposinview = 'Codigo= prhc_tecla,
Letra=prhc_valor_codigo,
"Default Ventas"=prhc_default, 
"Default Servicio"=prhc_defaultsrv, 
"Default Parte Rep."=prhc_defaultprp, 
"Default Equipos"=prhc_defaultprns, 
Activo=Activo'
where tbl_id = 1038;

update tabla set tbl_camposinview = 'Codigo= doc_codigo,
"Tipo de Documento"=(select doct_nombre from documentotipo where doct_id =documento.doct_id),
Activo=Activo,
Modifico=(select us_nombre from usuario where us_id =documento.modifico),
Empresa=(select emp_nombre from empresa where emp_id =documento.emp_id)'
where tbl_id = 4001;


update tabla set tbl_sqlhelp = 'select pr_id, pr_nombrecompra as Nombre, pr_nombreventa as Venta, pr_codigo as Codigo, pr_descripcompra as Desc from Producto' where tbl_id = 30;

update tabla set tbl_camposinview = 'Activo=activo,
Persona=coalesce((select prs_apellido ||'', ''|| prs_nombre from persona where prs_id = usuario.prs_id),''''),
Departamento=coalesce((select dpto_nombre from persona p inner join Departamento d on p.dpto_id = d.dpto_id where prs_id = usuario.prs_id),''''),
Sucursal=coalesce((select suc_nombre from sucursal  where suc_id =usuario.suc_id),''''),
Cargo=coalesce((select prs_cargo from persona  where prs_id =usuario.prs_id),''''),
Modifico=(select us_nombre from usuario us where us_id =usuario.modifico)' where tbl_id = 3;