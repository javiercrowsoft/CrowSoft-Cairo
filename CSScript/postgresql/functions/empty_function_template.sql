CREATE OR REPLACE FUNCTION function_name (OUT/IN parameter_name data_type, ...)
RETURNS void/data_type AS
$BODY$
DECLARE
	var_name data_type;
BEGIN

END;
$BODY$
  LANGUAGE plpgsql
;


-- to raise an exception

RAISE EXCEPTION 'Error message';