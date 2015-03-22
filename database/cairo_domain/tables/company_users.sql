-- Table: company_users

-- drop table company_users;

create table company_users
(
  cu_id serial not null,
  co_id int not null,
  us_id int not null,

  created_at timestamp with time zone not null default getdate(),
  
  CONSTRAINT company_users_pkey PRIMARY KEY (cu_id)
)
WITH (
  OIDS=FALSE
);
alter table company_users
  owner to postgres;
