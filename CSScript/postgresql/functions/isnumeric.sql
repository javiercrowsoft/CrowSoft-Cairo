-- Function: isnumeric(character varying)

-- DROP FUNCTION isnumeric(character varying);

CREATE OR REPLACE FUNCTION isnumeric(param character varying)
  RETURNS smallint AS
$BODY$
begin
	if (param ~ E'^[-+]?\\d*\\.?\\d+(?:[eE][-+]?\\d+)?$') then
		return -1;
	else
		return 0;
	end if;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION isnumeric(character varying)
  OWNER TO postgres;
