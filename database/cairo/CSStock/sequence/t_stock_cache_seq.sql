CREATE SEQUENCE t_stock_cache_seq;
ALTER TABLE stockcache ALTER stc_id SET DEFAULT NEXTVAL('t_stock_cache_seq');