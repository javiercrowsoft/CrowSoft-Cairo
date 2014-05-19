-- Table: companies

-- DROP TABLE companies;

CREATE TABLE companies
(
  co_id serial NOT NULL,
  db_id int NOT NULL,
  co_company_id int NOT NULL,
  co_company_name character varying(1000) NOT NULL,
  
  created_at timestamp with time zone NOT NULL DEFAULT getdate(),
  updated_at timestamp with time zone NOT NULL DEFAULT getdate(),
  
  CONSTRAINT companies_pkey PRIMARY KEY (co_id),
  CONSTRAINT ix_companies_company_name UNIQUE (co_company_name)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE companies
  OWNER TO postgres;
