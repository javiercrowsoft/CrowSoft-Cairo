filter=${2-'sql$'}
echo "using filter: $filter"
file="tmp/update.sql"
if [ -f $file ] ; then
    rm $file
fi

find . -newermt $(date +%Y-%m-%d -d "$1 day ago") -type f -print | grep -E $filter | grep -v target | while read line; do
    cat "$line" >> $file
    printf "\n\n-- END SCRIPT\n\n" >> $file
done

#cat `find . -newermt $(date +%Y-%m-%d -d "$1 day ago") -type f -print | grep -E $filter | grep -v target` > $file