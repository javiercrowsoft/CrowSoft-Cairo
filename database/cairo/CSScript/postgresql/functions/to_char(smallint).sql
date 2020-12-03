-- Function: to_char(integer)

-- DROP FUNCTION to_char(integer);

CREATE OR REPLACE FUNCTION to_char(param smallint)
 RETURNS character varying AS
$BODY$
begin
 return to_char(param::integer);
end;
$BODY$
 LANGUAGE plpgsql VOLATILE
                  COST 100;
ALTER FUNCTION to_char(smallint)
 OWNER TO postgres;