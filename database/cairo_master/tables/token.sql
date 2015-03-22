-- Table: token

-- drop table token;

create table token
(
  tk_id serial primary key,
  tk_token character varying(1000) not null,
  tk_expires date not null,
  tk_type character varying(255) not null,
  tk_data character varying(5000) not null,
  tk_used smallint not null default 0,
  us_id integer,

  tk_platform character varying(255) not null,
  tk_ip_address character varying(255) not null,
  tk_user_agent character varying(255) not null,
  tk_accept_language character varying(255) not null,
  tk_is_mobile smallint not null default 0,
  
  created_at timestamp with time zone not null default getdate(),
  updated_at timestamp with time zone not null default getdate(),

  CONSTRAINT ix_token_token UNIQUE (tk_token)
)
WITH (
  OIDS=FALSE
);
alter table token
  owner to postgres;


-- Index: ix_token_type

-- drop INDEX ix_token_type;

create INDEX ix_token_type on token (tk_type);
