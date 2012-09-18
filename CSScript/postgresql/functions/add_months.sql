-- Function: add_months(timestamp with time zone, integer)

-- DROP FUNCTION add_months(timestamp with time zone, integer);

CREATE OR REPLACE FUNCTION add_months(p_date timestamp with time zone, p_interval_val integer)
  RETURNS timestamp with time zone AS
$BODY$
BEGIN
    return (p_date + (p_interval_val * '1 month'::INTERVAL));
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION add_months(timestamp with time zone, integer)
  OWNER TO postgres;
