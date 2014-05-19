-- Table: company_users

-- DROP TABLE company_users;

CREATE TABLE company_users
(
  cu_id serial NOT NULL,
  co_id int NOT NULL,
  us_id int NOT NULL,

  created_at timestamp with time zone NOT NULL DEFAULT getdate(),
  
  CONSTRAINT company_users_pkey PRIMARY KEY (cu_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE company_users
  OWNER TO postgres;
