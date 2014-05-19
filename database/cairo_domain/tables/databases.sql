-- Table: databases

-- DROP TABLE databases;

CREATE TABLE databases
(
  db_id serial NOT NULL,
  db_corporation character varying(1000) NOT NULL,
  db_server character varying(1000) NOT NULL,
  db_database character varying(1000) NOT NULL,
  db_username character varying(1000) NOT NULL,
  db_password character varying(1000) NOT NULL,
  
  created_at timestamp with time zone NOT NULL DEFAULT getdate(),
  updated_at timestamp with time zone NOT NULL DEFAULT getdate(),
  
  CONSTRAINT databases_pkey PRIMARY KEY (db_id),
  CONSTRAINT ix_databases_corporation UNIQUE (db_corporation)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE databases
  OWNER TO postgres;
