-- Function: to_number(integer)

-- DROP FUNCTION to_number(integer);

CREATE OR REPLACE FUNCTION to_number(param integer)
  RETURNS integer AS
$BODY$
begin
	return param;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION to_number(integer)
  OWNER TO postgres;
