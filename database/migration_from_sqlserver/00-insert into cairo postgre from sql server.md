# how to migrate an small database

```
!!! very important: first read this file completely !!!
```



### 1- execute in the sql server database these script:

Generate SQL inserts.sql

### 2- open this script in sql manager and set the output to a file

Execute Generate SQL inserts.sql

#### 2.1 change the width of text output

from stackoverflow:

    Options (Query Results/SQL Server/Results to Grid Page)

    To change the options for the current queries, click Query Options on the Query menu,
    or right-click in the SQL Server Query window and select Query Options.

    ...

    Maximum Characters Retrieved
    Enter a number from 1 through 65535 to specify the maximum number of characters that will be displayed in each cell.

    Maximum is, as you see, 64k. Default is much smaller.

    BTW Results to Text has even more drastic limitation:

    Maximum number of characters displayed in each column
    This value defaults to 256. Increase this value to display larger result sets without truncation. The maximum value is 8,192.


### 3- open the file with textmate and save it as UTF8 and using LF not CRLF

Execute this file using psql

/Library/PostgreSQL/9.0/bin/psql -p 5434 -U postgres -d salmax_com_ar_cairo -a -f /Users/javier/Documents/CrowSoft/Scripts/cairoSalmax-2014-3-u8.sql

/Library/PostgreSQL/9.0/bin/psql -p 5434 -U postgres -d development_cairo -a -f /Users/javier/Documents/CrowSoft/Scripts/cairo-utf8.sql

/Library/PostgreSQL/9.0/bin/psql -p 5434 -U postgres -d olaen_com_ar_cairo -a -f /Users/javier/Documents/CrowSoft/Scripts/cairoO.sql

/Library/PostgreSQL/9.0/bin/psql -p 5434 -U postgres -d olaen_com_ar_cairo -a -f /Users/javier/Documents/CrowSoft/Scripts/cairoO-ci.sql

/Library/PostgreSQL/9.0/bin/psql -p 5434 -U postgres -d sdi_com_ar_cairo -a -f ~/Work/CrowSoft/Customers/Salmax/cairoSDI-utf8.sql > sdi_import.log

#### When working with a docker container
copy the file into the container:

```
sudo docker cp sdi_2020-09-24.sql 121ff0cbe2f1:tmp/
```

ssh into the container and run, first get container id:
```
docker ps
docker exec -it {container id} /bin/bash
```

#### The path could be different if the version is not 9.1
```
/usr/lib/postgresql/9.1/bin/psql -p 5432 -U postgres -d sdi_com_ar_cairo -a -f /tmp/sdi_2020-09-24.sql > /tmp/sdi_import.log
```

- run all functions: ( to get all_functions file you need to run a select and export to file the results in pgadmin.
read /database/postgresql.txt for details )

```
/Library/PostgreSQL/9.0/bin/psql -p 5434 -U postgres -1 -v ON_ERROR_STOP -f /Users/javier/Documents/CrowSoft/Scripts/all_functions.sql sdi_com_ar_cairo
```


**Now you should read /database/postgresql.txt**
