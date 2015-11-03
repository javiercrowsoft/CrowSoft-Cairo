create or replace function sp_DocFacVtaStockItemSave
(
  p_sti_grupo in NUMBER default null,
  p_st_id in integer default null,
  p_sti_orden out NUMBER,
  p_fvi_cantidad in NUMBER default null,
  p_fvi_descrip in varchar default null,
  p_pr_id in integer default null,
  p_depl_id_origen in NUMBER default null,
  p_depl_id_destino in NUMBER default null,
  p_prns_id in integer default null,
  p_stik_id in integer default null,
  p_stl_id in integer default null,
  out p_success integer,
  out p_error_msg varchar
)
as
   v_sys_error varchar := '';
   v_sti_id integer;
   v_pr_id_kit integer;
begin

   sp_dbGetNewId('StockItem',
                 'sti_id',
                 v_sti_id,
                 0);

   if p_stik_id is not null then
   begin
      select pr_id
        into v_pr_id_kit
        from StockItemKit
         where stik_id = p_stik_id;

   end;
   end if;

   begin
      insert into StockItem
        ( st_id, sti_id, sti_orden, sti_ingreso, sti_salida, sti_descrip, sti_grupo, pr_id, depl_id, prns_id, stik_id, pr_id_kit, stl_id )
        values ( p_st_id, v_sti_id, p_sti_orden, 0, p_fvi_cantidad, p_fvi_descrip, p_sti_grupo, p_pr_id, p_depl_id_origen, p_prns_id, p_stik_id, v_pr_id_kit, p_stl_id );
   exception
      when others then
         v_sys_error := sqlstate;
   end;

   if v_sys_error <> '' then
      exit CONTROL_ERROR;

   end if;

   p_sti_orden := p_sti_orden + 1;

   sp_dbGetNewId('StockItem',
                 'sti_id',
                 v_sti_id,
                 0);

   begin
      insert into StockItem
        ( st_id, sti_id, sti_orden, sti_ingreso, sti_salida, sti_descrip, sti_grupo, pr_id, depl_id, prns_id, stik_id, pr_id_kit, stl_id )
        values ( p_st_id, v_sti_id, p_sti_orden, p_fvi_cantidad, 0, p_fvi_descrip, p_sti_grupo, p_pr_id, p_depl_id_destino, p_prns_id, p_stik_id, v_pr_id_kit, p_stl_id );
   exception
      when others then
         v_sys_error := sqlstate;
   end;

   if v_sys_error <> '' then
      exit CONTROL_ERROR;

   end if;

   p_sti_orden := p_sti_orden + 1;

   p_success := 1;

   return;

   <<CONTROL_ERROR>>

   p_success := 0;

   p_error_msg := 'Ha ocurrido un error al grabar el item de stock de la factura de venta. sp_DocFacVtaStockItemSavee.';

end;