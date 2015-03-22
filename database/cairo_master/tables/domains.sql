-- Table: users

-- drop table domains;

create table domains
(
  dm_id serial primary key,
  dm_server character varying(1000) not null,
  dm_database character varying(1000) not null,
  dm_username character varying(1000) not null,
  dm_password character varying(1000) not null,

  dm_locked smallint not null default 0,

  created_at timestamp with time zone not null default getdate(),
  updated_at timestamp with time zone not null default getdate(),

 CONSTRAINT ix_domains_database UNIQUE (dm_database) 
)
WITH (
  OIDS=FALSE
);
alter table domains
  owner to postgres;
