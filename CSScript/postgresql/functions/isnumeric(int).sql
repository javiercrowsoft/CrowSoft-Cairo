-- Function: isnumeric(integer)

-- DROP FUNCTION isnumeric(integer);

CREATE OR REPLACE FUNCTION isnumeric(param integer)
  RETURNS smallint AS
$BODY$
begin
	return -1;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION isnumeric(integer)
  OWNER TO postgres;
