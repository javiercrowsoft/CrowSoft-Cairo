/* $PostgreSQL: pgsql/contrib/unaccent/unaccent.sql.in,v 1.2 2009/11/14 18:24:32 tgl Exp $ */

-- Adjust this setting to control where the objects get created.
set search_path = public;

create or replace function unaccent(regdictionary, text)
	returns text
	as '$libdir/unaccent', 'unaccent_dict'
	language C STRICT;

create or replace function unaccent(text)
	returns text
	as '$libdir/unaccent', 'unaccent_dict'
	language C STRICT;

create or replace function unaccent_init(internal)
	returns internal
	as '$libdir/unaccent', 'unaccent_init'
	language C;

create or replace function unaccent_lexize(internal,internal,internal,internal)
	returns internal
	as '$libdir/unaccent', 'unaccent_lexize'
	language C;

create TEXT SEARCH TEMPLATE unaccent (
	INIT = unaccent_init,
	LEXIZE = unaccent_lexize
);

create TEXT SEARCH DICTIONARY unaccent (
	TEMPLATE = unaccent,
	RULES    = 'unaccent'
);
