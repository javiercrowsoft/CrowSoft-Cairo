create or replace function sp_DocStockGet
/*
sp_DocStockGet 8,7
*/
(
  in p_emp_id integer,
  in p_st_id integer,
  in p_us_id integer,
  out rtn refcursor,
  cv_2 in out refcursor,
  cv_3 in out refcursor,
  cv_4 in out refcursor,
  cv_5 in out refcursor,
  cv_6 in out refcursor,
  cv_7 in out refcursor,
  cv_8 in out refcursor
)
as
   v_editable integer;
   v_edit_msg varchar(255);
   v_doc_id integer;
   v_ta_id integer;
   v_ta_mascara varchar(100);
   v_ta_propuesto smallint;
begin

   select doc_id
     into v_doc_id
     from Stock
      where st_id = p_st_id;

   sp_talonario_get_propuesto(v_doc_id,
                            v_ta_mascara,
                            v_ta_propuesto);

   sp_DocStockEditableGet(p_emp_id,
                          p_st_id,
                          p_us_id,
                          v_editable,
                          v_edit_msg,
                          rtn => rtn,
                          cv_2 => cv_2,
                          cv_3 => cv_3,
                          cv_4 => cv_4,
                          cv_5 => cv_5,
                          cv_6 => cv_6,
                          cv_7 => cv_7);

   open cv_8 for
      select st.*,
             doct.doct_nombre || ' ' || st.st_doc_cliente doc_cliente,
             origen.depl_nombre Origen,
             destino.depl_nombre Destino,
             origen.depf_id,
             case
                  when lgj.lgj_titulo <> '' then lgj.lgj_titulo
             else lgj.lgj_codigo
                end lgj_codigo,
             suc.suc_nombre,
             doct.doc_nombre,
             v_editable editable,
             v_edit_msg editMsg,
             v_ta_propuesto TaPropuesto,
             v_ta_mascara TaMascara
        from Stock st
               join Documento doc
                on st.doc_id = doc.doc_id
               join Sucursal suc
                on st.suc_id = suc.suc_id
               join DepositoLogico origen
                on st.depl_id_origen = origen.depl_id
               join DepositoLogico destino
                on st.depl_id_destino = destino.depl_id
               left join Legajo lgj
                on st.lgj_id = lgj.lgj_id
               left join DocumentoTipo doct
                on st.doct_id_cliente = doct.doct_id
         where st.st_id = p_st_id;

end;
/
/* Translation Extracted DDL For Required Objects */

/*
create global temporary table tt_KitItems_41
(
  pr_id integer  not null,
  nivel integer  not null
);
create global temporary table tt_kit_item_serie_41
(
  pr_id_kit integer ,
  cantidad decimal(18,6)  not null,
  pr_id integer  not null,
  prk_id integer  not null,
  nivel smallint
   default (0) not null
);
*/

