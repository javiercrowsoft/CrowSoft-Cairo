-- Function: to_char(integer)

-- DROP FUNCTION to_char(integer);

CREATE OR REPLACE FUNCTION to_char(param numeric)
  RETURNS character varying AS
$BODY$
begin
	return trim(to_char(param,'9999999999999.99'));
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION to_char(numeric)
  OWNER TO postgres;