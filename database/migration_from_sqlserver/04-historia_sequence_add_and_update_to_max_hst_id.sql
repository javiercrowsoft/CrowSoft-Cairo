alter table historia alter column hst_id set default nextval('t_historia_seq'::regclass);
select max(hst_id) from historia;
SELECT pg_catalog.setval('t_historia_seq', ???, false);