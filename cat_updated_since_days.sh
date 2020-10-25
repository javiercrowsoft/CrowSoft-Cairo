filter=${2-'sql$'}
echo "using filter: $filter"
file="tmp/update.sql"
if [ -f $file ] ; then
    rm $file
fi

find . -newermt $(date +%Y-%m-%d -d "$1 day ago") -type f -print | grep -E $filter | grep -v "cairo_script.sql" | grep -v target

find . -newermt $(date +%Y-%m-%d -d "$1 day ago") -type f -print | grep -E $filter | grep -v "cairo_script.sql" | grep -v target | while read line; do
    cat "$line" >> $file
    printf "\n\n-- END SCRIPT\n\n" >> $file
done

#cat `find . -newermt $(date +%Y-%m-%d -d "$1 day ago") -type f -print | grep -E $filter | grep -v target` > $file

echo "to run use:"
echo "docker ps"
echo "sudo docker cp tmp/update.sql {{container_id}}:tmp/"
echo "docker exec -it {{container_id}} /bin/bash"
echo "/usr/lib/postgresql/9.1/bin/psql -p 5432 -U postgres -d sdi_com_ar_cairo -a -f /tmp/update.sql > /tmp/update-out.log"

cat ./tmp/update.sql | grep "create table"
echo "WARNING: if above you see create table sentences probably you should _NOT_ run update.sql"
