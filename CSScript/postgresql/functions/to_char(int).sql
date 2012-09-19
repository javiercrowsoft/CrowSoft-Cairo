-- Function: to_char(integer)

-- DROP FUNCTION to_char(integer);

CREATE OR REPLACE FUNCTION to_char(param integer)
  RETURNS varchar AS
$BODY$
begin
	return to_char(param,'9999999999999');
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION to_char(integer)
  OWNER TO postgres;