CREATE or REPLACE FUNCTION public.if_table_exists( varchar)
RETURNS pg_catalog.bool AS
$BODY$
DECLARE

 BEGIN

     /* check the table exist in database and is visible*/
     perform n.nspname ,c.relname
     FROM pg_catalog.pg_class c
     LEFT JOIN pg_catalog.pg_namespace n
     ON n.oid = c.relnamespace
     WHERE n.nspname LIKE 'pg_temp_%' AND pg_catalog.pg_table_is_visible(c.oid)
       AND Upper(relname) = Upper($1);

     IF FOUND THEN
        RETURN TRUE;
     ELSE
        RETURN FALSE;
     END IF;

 END;
$BODY$
LANGUAGE 'plpgsql' VOLATILE