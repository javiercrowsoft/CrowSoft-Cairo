filter=${2-'js$|scala$|java$|sql$'}
echo "using filter: $filter"
find . -newermt $(date +%Y-%m-%d -d "$1 day ago") -type f -print | grep -E $filter | grep -v target
