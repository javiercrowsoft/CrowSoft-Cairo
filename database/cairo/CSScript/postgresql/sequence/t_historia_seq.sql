CREATE SEQUENCE t_historia_seq;
ALTER TABLE historia ALTER hst_id SET DEFAULT NEXTVAL('t_historia_seq');