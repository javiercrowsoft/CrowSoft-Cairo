-- Table: databases

-- drop table databases;

create table databases
(
  db_id serial not null,
  db_corporation character varying(1000) not null,
  db_server character varying(1000) not null,
  db_database character varying(1000) not null,
  db_username character varying(1000) not null,
  db_password character varying(1000) not null,
  
  created_at timestamp with time zone not null default getdate(),
  updated_at timestamp with time zone not null default getdate(),
  
  CONSTRAINT databases_pkey PRIMARY KEY (db_id),
  CONSTRAINT ix_databases_corporation UNIQUE (db_corporation)
)
WITH (
  OIDS=FALSE
);
alter table databases
  owner to postgres;
