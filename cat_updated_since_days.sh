filter=${2-'sql$'}
folder=${3-''}
echo "using filter: $filter"
echo "using folder: $folder"

file="tmp/update.sql"
if [ -f $file ] ; then
    rm $file
fi

find ./$folder -newermt $(date +%Y-%m-%d -d "$1 day ago") -type f -print | grep -E $filter | grep -v "cairo_script.sql" | grep -v target

find ./$folder -newermt $(date +%Y-%m-%d -d "$1 day ago") -type f -print | grep -E $filter | grep -v "cairo_script.sql" | grep -v target | while read line; do
    cat "$line" >> $file
    printf "\n\n-- END SCRIPT\n\n" >> $file
done

#cat `find ./$folder -newermt $(date +%Y-%m-%d -d "$1 day ago") -type f -print | grep -E $filter | grep -v target` > $file

echo "usually you should have run something like:"
echo "./cat_updated_since_days.sh 2 sql database/cairo"
echo "to run use:"
echo "docker ps"
echo "sudo docker cp tmp/update.sql {{container_id}}:tmp/"
echo "docker exec -it {{container_id}} /bin/bash"
echo "/usr/lib/postgresql/9.1/bin/psql -p 5432 -U postgres -d sdi_com_ar_cairo -a -f /tmp/update.sql > /tmp/update-out.log"

cat ./tmp/update.sql | grep "create table"
echo "WARNING: if above you see create table sentences probably you should _NOT_ run update.sql"
