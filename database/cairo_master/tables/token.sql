-- Table: token

-- DROP TABLE token;

CREATE TABLE token
(
  tk_id serial primary key,
  tk_token character varying(1000) NOT NULL,
  tk_expires date NOT NULL,
  tk_type character varying(255) NOT NULL,
  tk_data character varying(5000) NOT NULL,
  tk_used smallint NOT NULL DEFAULT 0,
  us_id integer,

  tk_platform character varying(255) NOT NULL,
  tk_ip_address character varying(255) NOT NULL,
  tk_user_agent character varying(255) NOT NULL,
  tk_accept_language character varying(255) NOT NULL,
  tk_is_mobile smallint NOT NULL DEFAULT 0,
  
  created_at timestamp with time zone NOT NULL DEFAULT getdate(),
  updated_at timestamp with time zone NOT NULL DEFAULT getdate(),

  CONSTRAINT ix_token_token UNIQUE (tk_token)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE token
  OWNER TO postgres;


-- Index: ix_token_type

-- DROP INDEX ix_token_type;

CREATE INDEX ix_token_type ON token (tk_type);  
