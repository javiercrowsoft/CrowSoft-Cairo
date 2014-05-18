-- Table: system_settings

-- DROP TABLE system_settings;

CREATE TABLE system_settings
(
  ss_key character varying(1000) NOT NULL,
  ss_value character varying(1000) NOT NULL,
  
  created_at timestamp with time zone NOT NULL DEFAULT getdate(),
  updated_at timestamp with time zone NOT NULL DEFAULT getdate(),
  
  CONSTRAINT ix_system_settings_key UNIQUE (ss_key)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE system_settings
  OWNER TO postgres;
