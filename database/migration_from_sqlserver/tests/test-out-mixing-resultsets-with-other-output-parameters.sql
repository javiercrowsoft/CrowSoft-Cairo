/*
drop function testc(integer);
drop function testd(integer);
drop type row_result;


select abs(-1.3)

CREATE TYPE row_result AS (
    type    varchar,
    id      integer,
    message varchar,
    r       refcursor        
);

CREATE TYPE row_result AS (
    r       refcursor    
);
*/



/*
          select * from testd(1);
*/

create or replace function testc(
  in id integer)
RETURNS SETOF row_result AS  
$body$
declare
  rtn row_result;
  rtn2 row_result;
  rtn3 row_result;
  v_smi smallint := 0;
begin

loop

          rtn.type := 'resultset';
          open rtn.r for select 'C' union select 'C22';
          RETURN NEXT rtn;

          begin

                    rtn2.type := 'resultset';
                    rtn2.message := 'rtn2';
                    open rtn2.r for select 'C2';
                    RETURN NEXT rtn2;

                    exit;
                    
            
          end;

          rtn3.type := 'resultset';
          open rtn3.r for select 'C222';
          RETURN NEXT rtn3;
          
      exit;    
end loop;          

return;

end;
$body$
language 'plpgsql' volatile;
alter function testc(integer) owner to postgres;

/*
          drop function testd(integer)
*/


create or replace function testd(
  in id integer
  )
RETURNS SETOF row_result AS  
$body$
declare
  rtn row_result;
  rsid row_result;
  newId integer;
  my_row_var row_result;
  v_sys_error varchar := '';
  v_error_msg varchar := '';
  v_us_nombre varchar;
begin

          FOR my_row_var IN
              SELECT * FROM testc(1)
          LOOP
                    RETURN NEXT my_row_var;
          END LOOP;

          select us_nombre into v_us_nombre from usuario where us_id = -65;

          raise notice 'v_us_nombre %', v_us_nombre;

          newId:= 1;

          begin

                    newId := 1/0;

          exception
             when others then
                    v_sys_error := sqlstate;
                    v_error_msg := SQLERRM;
                    raise notice 'sqlcode %', sqlstate;
          end;

          
          raise notice 'v_sys_error % %', v_sys_error, v_error_msg;

          return query select * from result_success();
          return query select * from result_error('test error');
          return;
          
          rtn.type := 'resultset';
          open rtn.r for select 'D';
          RETURN NEXT rtn;

          rsid.type := 'fc_id';
          rsid.id := newId;
          RETURN NEXT rsid;

          

end;
$body$
language 'plpgsql' volatile;
alter function testd(integer) owner to postgres;


/*

create or replace function testb(
  in id integer,
  out newId integer,
  out rtn refcursor
)
returns setof record
as
$body$
begin

          newId := 2;
          rtn := 'rtnb';
          open rtn for select * from usuario;

end;
$body$
language 'plpgsql' volatile;
alter function testb(integer) owner to postgres;

create or replace function testa(
  in id integer,
  out newId integer,
  out rtn refcursor
)
returns setof record
as
$body$
begin

          select * from testb(id) into newId;
          rtn := 'rtna';
          open rtn for select * from rol;

end;
$body$
language 'plpgsql' volatile;
alter function testa(integer) owner to postgres;


create or replace function testd(
  in id integer
  )
RETURNS SETOF refcursor AS  
$body$
declare
  rtn refcursor;
  rsid refcursor;
  newId integer;
  my_row_var row_result;
begin

FOR my_row_var IN
    SELECT * FROM testc(1)
LOOP
          RETURN NEXT my_row_var.r;
END LOOP;
/ *
          select testc(1) into rtnC;
          RETURN NEXT rtnC;

          RETURN QUERY FETCH ALL FROM rtn2;* /
/ *
fetch childcursor into v_partid,v_partname,v_parttype;
while Found LOOP
    --Do stuff;
    --Do More Stuff;
    --Finish Doing Stuff;
    fetch childcursor into v_partid,v_partname,v_parttype;
END LOOP;          
* /
          
          newId:= 1;
          open rtn for select 'D';
          RETURN NEXT rtn;

          open rsid for select newId;
          RETURN NEXT rsid;

end;
$body$
language 'plpgsql' volatile;
alter function testd(integer) owner to postgres;
*/

