--drop function teste(integer);
create or replace function teste(in fail integer)
RETURNS SETOF void AS  
$body$
begin


          set transaction read write;

          delete from hoja where hoja_id = -101;

          insert into hoja(hoja_id, id, ram_id, arb_id, modifico) values(-101, 1, 34949,200,1);
          

          if fail <> 0 then
                    raise exception 'error';
          end if;
          

end;
$body$
language 'plpgsql' volatile;
alter function teste(integer) owner to postgres;

select * from facturacompra where fc_id = 101;

create or replace function test_oo(in fail integer)
RETURNS SETOF void AS  
$body$
declare
   v_sys_error varchar := '';
   v_sys_error_msg varchar := '';  
begin
          begin
                    set transaction read write;

                    delete from hoja where hoja_id = -102;

                    insert into hoja(hoja_id, id, ram_id, arb_id, modifico) values(-102, 1, 34949,200,1);

                    delete from hoja where hoja_id = -102;

                    --delete from facturacompra where fc_id = 101;

                    raise notice 'hola';

                    raise exception 'test_o2 test error';

                    raise notice 'chau';

          exception
          
              when others then
                          v_sys_error := sqlstate;
                          v_sys_error_msg := sqlerrm;          
                          raise exception 'error in test_o2: %. %.', v_sys_error, v_sys_error_msg;
            end;

            if v_sys_error <> '' then
              exit;
            end if;

          return;                    

end;
$body$
language 'plpgsql' volatile;
alter function test_oo(integer) owner to postgres;

create or replace function test_o(in fail integer)
RETURNS SETOF void AS  
$body$
declare
   v_sys_error varchar := '';
   v_sys_error_msg varchar := '';  
begin

            begin

                    set transaction read write;

                    delete from hoja where hoja_id = -101;

                    insert into hoja(hoja_id, id, ram_id, arb_id, modifico) values(-101, 1, 34949,200,1);

                    select * from test_oo(1);

                    delete from hoja where hoja_id = -101;

                    --delete from facturacompra where fc_id = 101;

            exception
              when others then
                          v_sys_error := sqlstate;
                          v_sys_error_msg := sqlerrm;          
            end;

            if v_sys_error <> '' then
              raise exception 'error in test_o: %. %.', v_sys_error, v_sys_error_msg;
            end if;

end;
$body$
language 'plpgsql' volatile;
alter function test_o(integer) owner to postgres;

insert into hoja(hoja_id, id, ram_id, arb_id, modifico) values(-101, 1, 34949,200,1);
select * from test_o(1);
select * from hoja where hoja_id = -101;


begin;
delete from hoja where hoja_id = -101;
delete from hoja where hoja_id = -102;
delete from hoja where hoja_id = -103;
insert into hoja(hoja_id, id, ram_id, arb_id, modifico) values(-103, 1, 34949,200,1);
commit;
end;

begin;
         set transaction read write;

          select * from teste(0);
          insert into hoja(hoja_id, id, ram_id, arb_id, modifico) values(-102, 1, 34949,200,1);
          
          rollback;
end;

select * from hoja where hoja_id < -100;