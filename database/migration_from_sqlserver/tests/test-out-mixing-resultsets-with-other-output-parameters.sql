/*
drop function testc(integer);
drop function testd(integer);
drop type row_result;


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
          select * from testc(1);
          fetch all from rtn;

*/

create or replace function testc(
  in id integer)
RETURNS SETOF row_result AS  
$body$
declare
  rtn row_result;
  rtn2 row_result;
begin
          rtn.type := 2;
          open rtn.r for select 'C' union select 'C22';
          RETURN NEXT rtn;

          rtn2.type := 2;
          open rtn2.r for select 'C2';
          RETURN NEXT rtn2;

end;
$body$
language 'plpgsql' volatile;
alter function testc(integer) owner to postgres;

/*
          select * from testd(1);
          fetch all from rtn2;


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
begin

FOR my_row_var IN
    SELECT * FROM testc(1)
LOOP
          RETURN NEXT my_row_var;
END LOOP;
/*
          select testc(1) into rtnC;
          RETURN NEXT rtnC;

          RETURN QUERY FETCH ALL FROM rtn2;*/
/*
fetch childcursor into v_partid,v_partname,v_parttype;
while Found LOOP
    --Do stuff;
    --Do More Stuff;
    --Finish Doing Stuff;
    fetch childcursor into v_partid,v_partname,v_parttype;
END LOOP;          
*/
          newId:= 1;
          
          rtn.type := 2;
          open rtn.r for select 'D';
          RETURN NEXT rtn;

          rsid.type := 1;
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

