set nocount on

select 'alter table '+ name +' disable trigger all;' from sysobjects where xtype = 'U' and name <> 'dtproperties';

select 'delete from '+ name +';' from sysobjects where xtype = 'U' and name <> 'dtproperties';

declare @name varchar(5000)
declare c_tables insensitive cursor for select name from sysobjects where xtype = 'U' and name <> 'dtproperties'
open c_tables
fetch next from c_tables into @name
while @@fetch_status = 0
begin

		EXEC sp_generate_inserts @name

		fetch next from c_tables into @name
end

close c_tables
deallocate c_tables

select 'alter table '+ name +' enable trigger all;' from sysobjects where xtype = 'U' and name <> 'dtproperties';
