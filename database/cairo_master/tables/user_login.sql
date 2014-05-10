-- Table: user_login

-- DROP TABLE user_login;

CREATE TABLE user_logins
(
  usl_id serial primary key,
  usl_username character varying(1000) NOT NULL,
  usl_result_code character varying(1000) NOT NULL,    

  usl_platform character varying(255) NOT NULL,
  usl_ip_address character varying(255) NOT NULL,
  usl_user_agent character varying(255) NOT NULL,
  usl_accept_language character varying(255) NOT NULL,
  usl_is_mobile smallint NOT NULL DEFAULT 0,

  created_at timestamp with time zone NOT NULL DEFAULT getdate(),
  updated_at timestamp with time zone NOT NULL DEFAULT getdate()
)
WITH (
  OIDS=FALSE
);
ALTER TABLE user_login
  OWNER TO postgres;
