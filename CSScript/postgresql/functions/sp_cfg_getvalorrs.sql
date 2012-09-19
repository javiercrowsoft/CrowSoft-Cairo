-- Function: sp_cfg_getvalorrs(character varying, character varying, smallint, integer)

-- DROP FUNCTION sp_cfg_getvalorrs(character varying, character varying, smallint, integer);

CREATE OR REPLACE FUNCTION sp_cfg_getvalorrs(IN p_cfg_grupo character varying, IN p_cfg_aspecto character varying, OUT p_cfg_valor character varying, IN p_bshow smallint, IN p_emp_id integer, OUT rtn refcursor)
  RETURNS record AS
$BODY$
BEGIN

   SELECT cfg_valor
     INTO p_cfg_valor
     FROM Configuracion
      WHERE cfg_grupo = p_cfg_grupo
              AND cfg_aspecto = p_cfg_aspecto
              AND ( emp_id = p_emp_id
              OR ( emp_id IS NULL
              AND p_emp_id IS NULL ) );

   IF p_bShow <> 0 THEN
      OPEN rtn FOR
         SELECT p_cfg_valor
           FROM DUAL ;

   END IF;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_cfg_getvalorrs(character varying, character varying, smallint, integer)
  OWNER TO postgres;
