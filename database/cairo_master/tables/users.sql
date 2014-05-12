-- Table: users

-- DROP TABLE users;

CREATE TABLE users
(
  us_id serial primary key,
  us_username character varying(1000) NOT NULL,
  us_email character varying(1000) NOT NULL,
  us_password character varying(1000) NOT NULL,
  us_code character varying(1000) NOT NULL,
  us_active smallint NOT NULL DEFAULT 1,
  us_locked smallint NOT NULL DEFAULT 0,    
  
  us_platform character varying(255) NOT NULL,
  us_ip_address character varying(255) NOT NULL,
  us_user_agent character varying(255) NOT NULL,
  us_accept_language character varying(255) NOT NULL,
  us_is_mobile smallint NOT NULL DEFAULT 0,

  created_at timestamp with time zone NOT NULL DEFAULT getdate(),
  updated_at timestamp with time zone NOT NULL DEFAULT getdate(),

  CONSTRAINT ix_users_email UNIQUE (us_email),
  CONSTRAINT ix_users_username UNIQUE (us_username) 
)
WITH (
  OIDS=FALSE
);
ALTER TABLE users
  OWNER TO postgres;
