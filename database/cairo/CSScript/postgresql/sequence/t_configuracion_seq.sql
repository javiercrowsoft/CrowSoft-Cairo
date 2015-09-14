CREATE SEQUENCE t_configuracion_seq;
ALTER TABLE configuracion ALTER cfg_id SET DEFAULT NEXTVAL('t_configuracion_seq');