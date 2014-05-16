-- Table: users

-- DROP TABLE domains;

CREATE TABLE domains
(
  dm_id serial primary key,
  dm_server character varying(1000) NOT NULL,
  dm_database character varying(1000) NOT NULL,
  dm_username character varying(1000) NOT NULL,
  dm_password character varying(1000) NOT NULL,

  dm_locked smallint NOT NULL DEFAULT 0,    

  created_at timestamp with time zone NOT NULL DEFAULT getdate(),
  updated_at timestamp with time zone NOT NULL DEFAULT getdate()
)
WITH (
  OIDS=FALSE
);
ALTER TABLE domains
  OWNER TO postgres;
