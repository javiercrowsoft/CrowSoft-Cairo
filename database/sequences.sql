

-- Sequence: t_configuracion_seq

-- DROP SEQUENCE t_configuracion_seq;

CREATE SEQUENCE t_configuracion_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 662
  CACHE 1;
ALTER TABLE t_configuracion_seq
  OWNER TO postgres;

-- Sequence: t_historia_seq

-- DROP SEQUENCE t_historia_seq;

CREATE SEQUENCE t_historia_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 151
  CACHE 1;
ALTER TABLE t_historia_seq
  OWNER TO postgres;

-- Sequence: t_hojaid_seq

-- DROP SEQUENCE t_hojaid_seq;

CREATE SEQUENCE t_hojaid_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 5259
  CACHE 1;
ALTER TABLE t_hojaid_seq
  OWNER TO postgres;

-- Sequence: t_producto_proveedor_seq

-- DROP SEQUENCE t_producto_proveedor_seq;

CREATE SEQUENCE t_producto_proveedor_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 927
  CACHE 1;
ALTER TABLE t_producto_proveedor_seq
  OWNER TO postgres;

-- Sequence: t_rama2_seq

-- DROP SEQUENCE t_rama2_seq;

CREATE SEQUENCE t_rama2_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 4079
  CACHE 1;
ALTER TABLE t_rama2_seq
  OWNER TO postgres;

-- Sequence: t_rama_new_seq

-- DROP SEQUENCE t_rama_new_seq;

CREATE SEQUENCE t_rama_new_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 38
  CACHE 1;
ALTER TABLE t_rama_new_seq
  OWNER TO postgres;

-- Sequence: t_ramas_a_borrar_seq

-- DROP SEQUENCE t_ramas_a_borrar_seq;

CREATE SEQUENCE t_ramas_a_borrar_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 69
  CACHE 1;
ALTER TABLE t_ramas_a_borrar_seq
  OWNER TO postgres;
