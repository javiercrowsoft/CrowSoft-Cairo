-- Table: company_logins

-- DROP TABLE company_logins;

CREATE TABLE company_logins
(
  col_id serial primary key,
  co_id int NOT NULL,
  us_id int NOT NULL,  
  col_result_code character varying(1000) NOT NULL,    

  col_platform character varying(255) NOT NULL,
  col_ip_address character varying(255) NOT NULL,
  col_company_agent character varying(255) NOT NULL,
  col_accept_language character varying(255) NOT NULL,
  col_is_mobile smallint NOT NULL DEFAULT 0,

  created_at timestamp with time zone NOT NULL DEFAULT getdate(),
  updated_at timestamp with time zone NOT NULL DEFAULT getdate()
)
WITH (
  OIDS=FALSE
);
ALTER TABLE company_logins
  OWNER TO postgres;
