-- Table: user_sign_up

-- DROP TABLE user_sign_up;

CREATE TABLE user_sign_up
(
  ussu_id serial primary key,
  ussu_username character varying(1000) NOT NULL,
  ussu_email character varying(1000) NOT NULL,
  ussu_password character varying(1000) NOT NULL,
  ussu_code character varying(1000) NOT NULL,
  ussu_active smallint NOT NULL DEFAULT 1,
  ussu_locked smallint NOT NULL DEFAULT 0,    
  
  ussu_platform character varying(255) NOT NULL,
  ussu_ip_address character varying(255) NOT NULL,
  ussu_user_agent character varying(255) NOT NULL,
  ussu_accept_language character varying(255) NOT NULL,
  ussu_is_mobile smallint NOT NULL DEFAULT 0,

  created_at timestamp with time zone NOT NULL DEFAULT getdate(),
  updated_at timestamp with time zone NOT NULL DEFAULT getdate(),

  CONSTRAINT ix_email UNIQUE (ussu_email),
  CONSTRAINT ix_username UNIQUE (ussu_username) 
)
WITH (
  OIDS=FALSE
);
ALTER TABLE user_sign_up
  OWNER TO postgres;
