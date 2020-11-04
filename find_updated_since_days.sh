filter=${2-'js$|scala$|java$|sql$'}
folder=${3-''}
echo "using filter: $filter"
echo "using folder: $folder"
find ./$folder -newermt $(date +%Y-%m-%d -d "$1 day ago") -type f -print | grep -E $filter | grep -v target
