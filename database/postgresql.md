# Databases

### Index
- To create a database
- To update a database

## To create a database:

#### 1- create the database using pgAdmin

#### 2- before run the create tables scripts set the time zone

```
ALTER DATABASE {database name} SET timezone TO 'UTC';
```

#### 3- run the scripts in:

```
database/cairo/CSScript/postgresql/tables/cairo_script.sql
```

#### 4- run the file all_functions.sql

run all functions and sequences (yes one by one ( O O )
                                                   d
                                                  ^^^

that was a joke you don't have to do one by one :P

just run this in pgadmin and export to a file. use option "Query > Execute to a file".

```
SELECT pg_get_functiondef(f.oid)
FROM pg_catalog.pg_proc f
INNER JOIN pg_catalog.pg_namespace n ON (f.pronamespace = n.oid)
WHERE n.nspname = 'public'
```

--

**Not ready yet**: We need to change **"$function$** with **$function$;"** and then **"AS $function$;**
with AS **$function$"** (be careful with the order) and finally remove the first line 
of the file (it contains the name of the column for the select we used to create the file).

##### Changes to the file we created with all functions

now we have to run unaccent, then debugger

then open the file and serch for pldbg_ and delete all debugger functions

then at the end of the file you will find unaccent. you need to delete them too.

finally run the file we have created with pgadmin.

so

1) /database/cairo/CSScript/postgresql/postgresql_system_functions/9.0/unaccent.sql
2) /Work/CrowSoft/postgresql/scripts/debugger/pldbgapi--1.0.sql
3) run your file

##### very good explanation about time zone
http://stackoverflow.com/questions/6151084/which-timestamp-type-to-choose-in-a-postgresql-database

#### 5- run scripts from migration_from_sqlserver following the order set in their names.
only run files which starts with numbers.

## To update a database

run script find_update_since_dyas.sh at root

```
   ./find_update_since_dyas.sh 2 sql database/cairo
```

you will see the list of files to be included

then run script cat_update_since_days.sh

```
   ./cat_updated_since_days.sh 2 sql database/cairo
```

the command will print instructions to apply the patch to a database running in Docker.

### Notice
for unknown reason the command add in some places this character: ﻿

you need to replace it with an empty string.

Use IntelliJ for this.