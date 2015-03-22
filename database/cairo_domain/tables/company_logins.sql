-- Table: company_logins

-- drop table company_logins;

create table company_logins
(
  col_id serial primary key,
  co_id int not null,
  us_id int not null,
  col_result_code character varying(1000) not null,

  col_platform character varying(255) not null,
  col_ip_address character varying(255) not null,
  col_user_agent character varying(255) not null,
  col_accept_language character varying(255) not null,
  col_is_mobile smallint not null default 0,

  created_at timestamp with time zone not null default getdate(),
  updated_at timestamp with time zone not null default getdate()
)
WITH (
  OIDS=FALSE
);
alter table company_logins
  owner to postgres;
