-- Function: dateadd(character varying, integer, timestamp with time zone)

-- DROP FUNCTION dateadd(character varying, integer, timestamp with time zone);

CREATE OR REPLACE FUNCTION dateadd(p_interval character varying, p_interval_val integer, p_date timestamp with time zone)
  RETURNS timestamp with time zone AS
$BODY$
DECLARE
    v_ucase_interval varchar(10);
    v_date timestamp with time zone;
BEGIN
    v_date := p_date;
    v_ucase_interval := UPPER(p_interval);
      
    IF v_ucase_interval IN ('YEAR', 'YY', 'YYYY') 
    THEN
      RETURN add_months(v_date, p_interval_val * 12);
      
    ELSIF v_ucase_interval IN ('QUARTER', 'QQ', 'Q') 
    THEN
      RETURN add_months(v_date, p_interval_val * 3);
      
    ELSIF v_ucase_interval IN ('MONTH', 'MM', 'M') 
    THEN
      RETURN add_months(v_date, p_interval_val);
      
    ElSIF v_ucase_interval IN ('DAYOFYEAR', 'DY', 'Y', 'DAY', 'DD', 'D', 'WEEKDAY', 'DW', 'W') 
    THEN
      RETURN v_date + (p_interval_val * '1 day'::interval);
      
    ElSIF v_ucase_interval IN ('WEEK', 'WK', 'WW') 
    THEN
      RETURN v_date + (p_interval_val * 7 * '1 day'::interval);
      
    ElSIF v_ucase_interval IN ('HOUR', 'HH') 
    THEN
      RETURN v_date + (p_interval_val * '1 hour'::interval);
      
    ElSIF v_ucase_interval IN ('MINUTE', 'MI', 'N') 
    THEN
      RETURN v_date + (p_interval_val * '1 minute'::interval);
      
    ElSIF v_ucase_interval IN ('SECOND', 'SS', 'S') 
    THEN
      RETURN v_date + (p_interval_val * '1 second'::interval);
      
    ElSIF v_ucase_interval IN ('MILLISECOND', 'MS') 
    THEN
      RETURN v_date + (p_interval_val * '1 millisecond'::interval);
      
    ELSE
      RETURN NULL;
    END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION dateadd(character varying, integer, timestamp with time zone)
  OWNER TO postgres;
