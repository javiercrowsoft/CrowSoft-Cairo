-- Function: sp_cfg_getvalor(character varying, character varying, smallint, integer)

-- DROP FUNCTION sp_cfg_getvalor(character varying, character varying, smallint, integer);

CREATE OR REPLACE FUNCTION sp_cfg_getvalor(IN p_cfg_grupo character varying, IN p_cfg_aspecto character varying, OUT p_cfg_valor character varying, IN p_bshow smallint, IN p_emp_id integer)
  RETURNS character varying AS
$BODY$
BEGIN

   IF p_bShow <> 0 THEN
    RAISE EXCEPTION '@@ERROR_SP:El procedimiento almacenado sp_Cfg_GetValor no puede ser llamado para obtener un cursor. Se debe usar sp_Cfg_GetValorRs.';
		RETURN;
   END IF;

   SELECT cfg_valor
     INTO p_cfg_valor
     FROM Configuracion
      WHERE cfg_grupo = p_cfg_grupo
              AND cfg_aspecto = p_cfg_aspecto
              AND ( emp_id = p_emp_id
              OR ( emp_id IS NULL
              AND p_emp_id IS NULL ) );
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_cfg_getvalor(character varying, character varying, smallint, integer)
  OWNER TO postgres;
