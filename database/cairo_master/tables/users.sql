-- Table: users

-- drop table users;

create table users
(
  us_id serial primary key,
  us_username character varying(1000) not null,
  us_email character varying(1000) not null,
  us_password character varying(1000) not null,
  us_code character varying(1000) not null,
  us_active smallint not null default 1,
  us_locked smallint not null default 0,
  
  us_platform character varying(255) not null,
  us_ip_address character varying(255) not null,
  us_user_agent character varying(255) not null,
  us_accept_language character varying(255) not null,
  us_is_mobile smallint not null default 0,

  created_at timestamp with time zone not null default getdate(),
  updated_at timestamp with time zone not null default getdate(),

  CONSTRAINT ix_users_email UNIQUE (us_email),
  CONSTRAINT ix_users_username UNIQUE (us_username) 
)
WITH (
  OIDS=FALSE
);
alter table users
  owner to postgres;
