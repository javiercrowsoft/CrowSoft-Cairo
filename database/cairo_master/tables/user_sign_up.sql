-- Table: user_sign_up

-- DROP TABLE user_sign_up;

CREATE TABLE user_sign_up
(
  ussu_id integer NOT NULL,
  ussu_username character varying(1000) NOT NULL,
  ussu_password character varying(1000) NOT NULL,
  ussu_salt character varying(1000) NOT NULL,
  ussu_active smallint NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT getdate(),
  updated_at timestamp with time zone NOT NULL DEFAULT getdate()
  CONSTRAINT pk_ussu_id PRIMARY KEY (ussu_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE user_sign_up
  OWNER TO postgres;
