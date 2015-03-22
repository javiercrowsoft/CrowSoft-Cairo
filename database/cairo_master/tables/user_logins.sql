-- Table: user_logins

-- drop table user_logins;

create table user_logins
(
  usl_id serial primary key,
  usl_username character varying(1000) not null,
  usl_result_code character varying(1000) not null,

  usl_platform character varying(255) not null,
  usl_ip_address character varying(255) not null,
  usl_user_agent character varying(255) not null,
  usl_accept_language character varying(255) not null,
  usl_is_mobile smallint not null default 0,

  created_at timestamp with time zone not null default getdate(),
  updated_at timestamp with time zone not null default getdate()
)
WITH (
  OIDS=FALSE
);
alter table user_logins
  owner to postgres;
