/*
CrowSoft-Cairo
==============

ERP application written in Scala Play Framework and Postgresql

Copyright (C) 2012  Javier Mariano Alvarez

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

========================================================================

Created by Javier

http://www.crowsoft.com.ar

javier at crowsoft.com.ar
*/
-- Function: sp_proveedorhelp()

-- DROP FUNCTION sp_proveedorhelp(integer, integer, integer, varchar, integer, integer, varchar);

CREATE OR REPLACE FUNCTION sp_proveedorhelp
/*
  select sp_ProveedorHelp(1,1,1,'sp%',0,0); fetch all from rtn;
  sp_ProveedorHelp 3,'',0,0,1
  select * from usuario where us_nombre like '%ahidal%'
*/
(
  IN p_emp_id integer,
  IN p_us_id integer,
  IN p_bForAbm integer,
  IN p_filter varchar DEFAULT '',
  IN p_check integer DEFAULT 0,
  IN p_prov_id integer DEFAULT 0,
  IN p_filter2 varchar DEFAULT '',
  out rtn refcursor)
  RETURNS refcursor AS
$BODY$
DECLARE
   v_us_EmpresaEx numeric(3,0);
   v_us_EmpXDpto numeric(3,0);
BEGIN

   SELECT us_empresaex,
          us_empxdpto
     INTO v_us_EmpresaEx,
          v_us_EmpXDpto
     FROM Usuario
      WHERE us_id = p_us_id;

   p_filter := lower(f_unaccent(p_filter));

   rtn := 'rtn';

   IF v_us_EmpresaEx <> 0 THEN
   BEGIN
      IF p_check <> 0 THEN
      BEGIN
         OPEN rtn FOR
            SELECT prov_id,
                   prov_nombre Nombre,
                   prov_codigo Codigo
            FROM Proveedor
            WHERE ( lower(f_unaccent(prov_nombre)) = p_filter
                   OR lower(f_unaccent(prov_codigo)) = p_filter )
                   AND ( activo <> 0
                   OR p_bForAbm <> 0 )
                   AND ( prov_id = p_prov_id
                   OR p_prov_id = 0 )
                   AND ( p_bForAbm <> 0
                   OR ( ( EXISTS ( SELECT *
                                   FROM EmpresaProveedor
                                      WHERE prov_id = Proveedor.prov_id
                                              AND emp_id = p_emp_id ) )
                   AND ( EXISTS ( SELECT *
                                  FROM UsuarioEmpresa
                                     WHERE prov_id = Proveedor.prov_id
                                             AND us_id = p_us_id )
                   OR p_us_id = 1 ) ) );

      END;
      ELSE
      BEGIN
         OPEN rtn FOR
            SELECT prov_id,
                   prov_nombre Nombre,
                   prov_razonsocial AS "R. Social",
                   prov_cuit CUIT,
                   prov_codigo Codigo,
                   CASE prov_catfiscal
                    WHEN 1 THEN 'Inscripto'
                    WHEN 2 THEN 'Exento'
                    WHEN 3 THEN 'No inscripto'
                    WHEN 4 THEN 'Consumidor Final'
                    WHEN 5 THEN 'Extranjero'
                    WHEN 6 THEN 'Mono Tributo'
                    WHEN 7 THEN 'Extranjero Iva'
                    WHEN 8 THEN 'No responsable'
                    WHEN 9 THEN 'No Responsable exento'
                    WHEN 10 THEN 'No categorizado'
                    ELSE 'Sin categorizar'
                   END AS "Cat. Fiscal"
            FROM Proveedor
            WHERE ( lower(f_unaccent(prov_codigo)) LIKE '%' || p_filter || '%'
                       OR lower(f_unaccent(prov_nombre)) LIKE '%' || p_filter || '%'
                       OR lower(f_unaccent(prov_razonsocial)) LIKE '%' || p_filter || '%'
                       OR prov_cuit LIKE '%' || p_filter || '%'
                       OR p_filter IS NULL )
                       AND ( p_bForAbm <> 0
                       OR ( ( EXISTS ( SELECT *
                                       FROM EmpresaProveedor
                                          WHERE prov_id = Proveedor.prov_id
                                                  AND emp_id = p_emp_id ) )
                       AND ( EXISTS ( SELECT *
                                      FROM UsuarioEmpresa
                                         WHERE prov_id = Proveedor.prov_id
                                                 AND us_id = p_us_id )
                       OR p_us_id = 1 )
                       AND activo <> 0 ) )
            LIMIT <= 50;

      END;
      END IF;

   END;
   ELSE
   BEGIN
      IF v_us_EmpXDpto <> 0 THEN
      BEGIN
         IF p_check <> 0 THEN
         BEGIN
            OPEN rtn FOR
               SELECT prov_id,
                      prov_nombre Nombre,
                      prov_codigo Codigo
               FROM Proveedor
               WHERE ( lower(f_unaccent(prov_nombre)) = p_filter
                          OR lower(f_unaccent(prov_codigo)) = p_filter )
                          AND ( activo <> 0
                          OR p_bForAbm <> 0 )
                          AND ( prov_id = p_prov_id
                          OR p_prov_id = 0 )
                          AND ( p_bForAbm <> 0
                          OR ( ( EXISTS ( SELECT *
                                          FROM EmpresaProveedor
                                             WHERE prov_id = Proveedor.prov_id
                                                     AND emp_id = p_emp_id ) )
                          AND ( EXISTS ( SELECT *
                                         FROM DepartamentoProveedor dc
                                                JOIN UsuarioDepartamento ud
                                                 ON dc.dpto_id = ud.dpto_id
                                            WHERE dc.prov_id = Proveedor.prov_id
                                                    AND ud.us_id = p_us_id )
                          OR p_us_id = 1 ) ) );

         END;
         ELSE
         BEGIN
            OPEN rtn FOR
               SELECT prov_id,
                      prov_nombre Nombre,
                      prov_razonsocial AS "R. Social",
                      prov_cuit CUIT,
                      prov_codigo Codigo,
                      CASE prov_catfiscal
                        WHEN 1 THEN 'Inscripto'
                        WHEN 2 THEN 'Exento'
                        WHEN 3 THEN 'No inscripto'
                        WHEN 4 THEN 'Consumidor Final'
                        WHEN 5 THEN 'Extranjero'
                        WHEN 6 THEN 'Mono Tributo'
                        WHEN 7 THEN 'Extranjero Iva'
                        WHEN 8 THEN 'No responsable'
                        WHEN 9 THEN 'No Responsable exento'
                        WHEN 10 THEN 'No categorizado'
                        ELSE 'Sin categorizar'
                      END AS "Cat. Fiscal"
               FROM Proveedor
               WHERE ( lower(f_unaccent(prov_codigo)) LIKE '%' || p_filter || '%'
                          OR lower(f_unaccent(prov_nombre)) LIKE '%' || p_filter || '%'
                          OR lower(f_unaccent(prov_razonsocial)) LIKE '%' || p_filter || '%'
                          OR prov_cuit LIKE '%' || p_filter || '%'
                          OR p_filter IS NULL )
                          AND ( p_bForAbm <> 0
                          OR ( ( EXISTS ( SELECT *
                                          FROM EmpresaProveedor
                                             WHERE prov_id = Proveedor.prov_id
                                                     AND emp_id = p_emp_id ) )
                          AND ( EXISTS ( SELECT *
                                         FROM DepartamentoProveedor dc
                                                JOIN UsuarioDepartamento ud
                                                 ON dc.dpto_id = ud.dpto_id
                                            WHERE dc.prov_id = Proveedor.prov_id
                                                    AND ud.us_id = p_us_id )
                          OR p_us_id = 1 )
                          AND activo <> 0 ) )
               LIMIT <= 50;

         END;
         END IF;

      END;
      ELSE
      BEGIN
         IF p_check <> 0 THEN
         BEGIN
            OPEN rtn FOR
               SELECT prov_id,
                      prov_nombre Nombre,
                      prov_codigo Codigo
               FROM Proveedor
               WHERE ( lower(f_unaccent(prov_nombre)) = p_filter
                          OR lower(f_unaccent(prov_codigo)) = p_filter )
                          AND ( activo <> 0
                          OR p_bForAbm <> 0 )
                          AND ( prov_id = p_prov_id
                          OR p_prov_id = 0 )
                          AND ( p_bForAbm <> 0
                          OR ( EXISTS ( SELECT *
                                        FROM EmpresaProveedor
                                           WHERE prov_id = Proveedor.prov_id
                                                   AND emp_id = p_emp_id ) ) );

         END;
         ELSE
         BEGIN
            OPEN rtn FOR
               SELECT prov_id,
                      prov_nombre Nombre,
                      prov_razonsocial AS "R. Social",
                      prov_cuit CUIT,
                      prov_codigo Codigo,
                      CASE prov_catfiscal
                        WHEN 1 THEN 'Inscripto'
                        WHEN 2 THEN 'Exento'
                        WHEN 3 THEN 'No inscripto'
                        WHEN 4 THEN 'Consumidor Final'
                        WHEN 5 THEN 'Extranjero'
                        WHEN 6 THEN 'Mono Tributo'
                        WHEN 7 THEN 'Extranjero Iva'
                        WHEN 8 THEN 'No responsable'
                        WHEN 9 THEN 'No Responsable exento'
                        WHEN 10 THEN 'No categorizado'
                        ELSE 'Sin categorizar'
                      END AS "Cat. Fiscal"
               FROM Proveedor
               WHERE ( lower(f_unaccent(prov_codigo)) LIKE '%' || p_filter || '%'
                          OR lower(f_unaccent(prov_nombre)) LIKE '%' || p_filter || '%'
                          OR lower(f_unaccent(prov_razonsocial)) LIKE '%' || p_filter || '%'
                          OR prov_cuit LIKE '%' || p_filter || '%'
                          OR p_filter IS NULL )
                          AND ( p_bForAbm <> 0
                          OR ( EXISTS ( SELECT *
                                        FROM EmpresaProveedor
                                           WHERE prov_id = Proveedor.prov_id
                                                   AND emp_id = p_emp_id )
                          AND activo <> 0 ) )
               LIMIT 50;

         END;
         END IF;

      END;
      END IF;

   END;
   END IF;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sp_proveedorhelp(integer, integer, integer, varchar, integer, integer, varchar)
  OWNER TO postgres;