-- Table: system_settings

-- drop table system_settings;

create table system_settings
(
  ss_key character varying(1000) not null,
  ss_value character varying(1000) not null,
  
  created_at timestamp with time zone not null default getdate(),
  updated_at timestamp with time zone not null default getdate(),
  
  CONSTRAINT ix_system_settings_key UNIQUE (ss_key)
)
WITH (
  OIDS=FALSE
);
alter table system_settings
  owner to postgres;
