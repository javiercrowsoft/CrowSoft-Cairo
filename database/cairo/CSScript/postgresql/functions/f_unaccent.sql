/*

THIS function NEEDS unaccent.sql to be run in the database

where to find that script for 9.0
locate unaccent
/Library/PostgreSQL/9.0/share/postgresql/contrib/unaccent.sql

from 9.1 and above you can use:

create EXTENSION unaccent;

from: http://stackoverflow.com/questions/11005036/does-postgresql-support-accent-insensitive-collations

unaccent is a text search dictionary that removes accents (diacritic signs) from lexemes.

Index

To use an index for that kind of query, create an index on the expression. However, Postgres only accepts
IMMUTABLE functions for functional indexes. if a function can return a different result under different
circumstances, the index could silently break.

unaccent() only STABLE not IMMUTABLE

Unfortunately, unaccent() is only STABLE, not IMMUTABLE. According to this thread on pgsql-bugs, 
this is due to three reasons:

It depends on the behavior of a dictionary.
There is no hard-wired connection to this dictionary.
It therefore also depends on the current search_path, which can change easily.
Some tutorials on the web instruct to just alter the function and declare it IMMUTABLE.
This is a brute-force method that might break under rare circumstances.

Others suggest a simple IMMUTABLE wrapper function, like I did myself in the past.

There is an ongoing debate whether to make the variant with two parameters IMMUTABLE 
which declares the used dictionary explicitly. Read here or here.

Another alternative would be this module with an IMMUTABLE unaccent() function by Musicbrainz, 
provided on Github. Haven't tested it myself. I think I have come up with a better idea:

Best for now

All of this put together I propose this mostly safe approach that is just as efficient as other 
solutions floating around, but safer: Create a simple wrapper function with the two-parameter 
variant that hard-codes the correct dictionary as well as the right search_path:

Set the search_path to the schema where you install your extensions (default is public).
Why the dangling pg_temp? To rule out temporary objects coming first. More in the manual here.
You can build a functional index using that, since it is declared IMMUTABLE.

create INDEX users_unaccent_name_idx on users(f_unaccent(name));
Adapt your query to use the index:

select *
FROM   users
WHERE  f_unaccent(name) = f_unaccent('João');

Pattern matching

if you want to use it with LIKE (and a pattern that is not left-anchored), you
can combine this with the module pg_tgrm in PostgreSQL 9.1 or later. Create a 
functional GIN or GIST index. Example for GIN:

create INDEX users_unaccent_name_trgm_idx on users
USING gin (f_unaccent(name) gin_trgm_ops);
Be aware that GIN and GIST indexes are somewhat more expensive to maintain. Would be used in a query like:

select *
FROM   users
WHERE  f_unaccent(name) LIKE ('%' || f_unaccent('João') || '%');
I have written a more detailed answer about pattern matching and performance in a recent answer on dba.SE.

pg_tgrm also provides very useful operators for "similarity" % and "distance" <->.

*/

create or replace function f_unaccent(text)
  returns text as
$func$
select unaccent('unaccent', $1)
$func$  language sql IMMUTABLE set search_path = public, pg_temp;