-- Table: companies

-- drop table companies;

create table companies
(
  co_id serial not null,
  db_id int not null,
  co_company_id int not null,
  co_company_name character varying(1000) not null,
  
  created_at timestamp with time zone not null default getdate(),
  updated_at timestamp with time zone not null default getdate(),
  
  CONSTRAINT companies_pkey PRIMARY KEY (co_id),
  CONSTRAINT ix_companies_company_name UNIQUE (co_company_name)
)
WITH (
  OIDS=FALSE
);
alter table companies
  owner to postgres;
