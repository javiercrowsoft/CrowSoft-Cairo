-- Function: getdate()

-- DROP FUNCTION getdate();

CREATE OR REPLACE FUNCTION getdate()
  RETURNS timestamp with time zone AS
'select now()'
  LANGUAGE sql STABLE
  COST 100;
ALTER FUNCTION getdate()
  OWNER TO postgres;
