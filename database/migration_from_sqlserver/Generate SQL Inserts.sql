set NOCOUNT on
GO

--PRINT 'Using Master database'
--USE master
GO

PRINT 'Checking for the existence of this procedure'
if (select OBJECT_ID('sp_generate_inserts','P')) is not null --means, the procedure already exists
	begin
		PRINT 'Procedure already exists. So, dropping it'
		drop PROC sp_generate_inserts
	end
GO

create PROC sp_generate_inserts
(
	@table_name varchar(776),  		-- The table/view for which the insert statements will be generated using the existing data
	@target_table varchar(776) = null, 	-- Use this parameter to specify a different table name into which the data will be inserted
	@include_column_list bit = 1,		-- Use this parameter to include/ommit column list in the generated insert statement
	@from varchar(800) = null, 		-- Use this parameter to filter the rows based on a filter condition (using where)
	@include_timestamp bit = 0, 		-- Specify 1 for this parameter, if you want to include the TIMESTAMP/ROWVERSION column's data in the insert statement
	@debug_mode bit = 0,			-- if @debug_mode is set to 1, the SQL statements constructed by this procedure will be printed for later examination
	@owner varchar(64) = null,		-- Use this parameter if you are not the owner of the table
	@ommit_images bit = 1,			-- Use this parameter to generate insert statements by omitting the 'image' columns
	@ommit_identity bit = 0,		-- Use this parameter to ommit the identity columns
	@top int = null,			-- Use this parameter to generate insert statements only for the TOP n rows
	@cols_to_include varchar(8000) = null,	-- List of columns to be included in the insert statement
	@cols_to_exclude varchar(8000) = null,	-- List of columns to be excluded from the insert statement
	@disable_constraints bit = 0,		-- when 1, disables foreign key constraints and enables them after the insert statements
	@ommit_computed_cols bit = 0		-- when 1, computed columns will not be included in the insert statement
	
)
as
begin

/***********************************************************************************************************
Procedure:	sp_generate_inserts  (Build 22) 
		(Copyright � 2002 Narayana Vyas Kondreddi. All rights reserved.)
                                          
Purpose:	To generate insert statements from existing data.
		These insertS can be executed to regenerate the data at some other location.
		This procedure is also useful to create a database setup, where in you can
		script your data along with your table definitions.

Written by:	Narayana Vyas Kondreddi
	        http://vyaskn.tripod.com

Acknowledgements:
		Divya Kalra	-- for beta testing
		Mark Charsley	-- for reporting a problem with scripting uniqueidentifier columns with null values
		Artur Zeygman	-- for helping me simplify a bit of code for handling non-dbo owned tables
		Joris Laperre   -- for reporting a regression bug in handling text/ntext columns

Tested on: 	SQL Server 7.0 and SQL Server 2000

Date created:	January 17th 2001 21:52 GMT

Date modified:	May 1st 2002 19:50 GMT

Email: 		vyaskn@hotmail.com

NOTE:		This procedure may not work with tables with too many columns.
		Results can be unpredictable with huge text columns or SQL Server 2000's sql_variant data types
		Whenever possible, Use @include_column_list parameter to ommit column list in the insert statement, for better results
		IMPORTANT: This procedure is not tested with internation data (Extended characters or Unicode). if needed
		you might want to convert the datatypes of character variables in this procedure to their respective unicode counterparts
		like nchar and nvarchar
		

Example 1:	To generate insert statements for table 'titles':
		
		EXEC sp_generate_inserts 'titles'

Example 2: 	To ommit the column list in the insert statement: (Column list is included by default)
		IMPORTANT: if you have too many columns, you are advised to ommit column list, as shown below,
		to avoid erroneous results
		
		EXEC sp_generate_inserts 'titles', @include_column_list = 0

Example 3:	To generate insert statements for 'titlesCopy' table from 'titles' table:

		EXEC sp_generate_inserts 'titles', 'titlesCopy'

Example 4:	To generate insert statements for 'titles' table for only those titles
		which contain the word 'Computer' in them:
		NOTE: Do not complicate the from or where clause here. It's assumed that you are good with T-SQL if you are using this parameter

		EXEC sp_generate_inserts 'titles', @from = "from titles where title like '%Computer%'"

Example 5: 	To specify that you want to include TIMESTAMP column's data as well in the insert statement:
		(By default TIMESTAMP column's data is not scripted)

		EXEC sp_generate_inserts 'titles', @include_timestamp = 1

Example 6:	To print the debug information:
  
		EXEC sp_generate_inserts 'titles', @debug_mode = 1

Example 7: 	if you are not the owner of the table, use @owner parameter to specify the owner name
		To use this option, you must have select permissions on that table

		EXEC sp_generate_inserts Nickstable, @owner = 'Nick'

Example 8: 	To generate insert statements for the rest of the columns excluding images
		When using this otion, DO not set @include_column_list parameter to 0.

		EXEC sp_generate_inserts imgtable, @ommit_images = 1

Example 9: 	To generate insert statements excluding (ommiting) IDENTITY columns:
		(By default IDENTITY columns are included in the insert statement)

		EXEC sp_generate_inserts mytable, @ommit_identity = 1

Example 10: 	To generate insert statements for the TOP 10 rows in the table:
		
		EXEC sp_generate_inserts mytable, @top = 10

Example 11: 	To generate insert statements with only those columns you want:
		
		EXEC sp_generate_inserts titles, @cols_to_include = "'title','title_id','au_id'"

Example 12: 	To generate insert statements by omitting certain columns:
		
		EXEC sp_generate_inserts titles, @cols_to_exclude = "'title','title_id','au_id'"

Example 13:	To avoid checking the foreign key constraints while loading data with insert statements:
		
		EXEC sp_generate_inserts titles, @disable_constraints = 1

Example 14: 	To exclude computed columns from the insert statement:
		EXEC sp_generate_inserts MyTable, @ommit_computed_cols = 1
***********************************************************************************************************/

set NOCOUNT on

--Making sure user only uses either @cols_to_include or @cols_to_exclude
if ((@cols_to_include is not null) and (@cols_to_exclude is not null))
	begin
		RAISERROR('Use either @cols_to_include or @cols_to_exclude. Do not use both the parameters at once',16,1)
		RETURN -1 --Failure. Reason: Both @cols_to_include and @cols_to_exclude parameters are specified
	end

--Making sure the @cols_to_include and @cols_to_exclude parameters are receiving values in proper format
if ((@cols_to_include is not null) and (PATINDEX('''%''',@cols_to_include) = 0))
	begin
		RAISERROR('Invalid use of @cols_to_include property',16,1)
		PRINT 'Specify column names surrounded by single quotes and separated by commas'
		PRINT 'Eg: EXEC sp_generate_inserts titles, @cols_to_include = "''title_id'',''title''"'
		RETURN -1 --Failure. Reason: Invalid use of @cols_to_include property
	end

if ((@cols_to_exclude is not null) and (PATINDEX('''%''',@cols_to_exclude) = 0))
	begin
		RAISERROR('Invalid use of @cols_to_exclude property',16,1)
		PRINT 'Specify column names surrounded by single quotes and separated by commas'
		PRINT 'Eg: EXEC sp_generate_inserts titles, @cols_to_exclude = "''title_id'',''title''"'
		RETURN -1 --Failure. Reason: Invalid use of @cols_to_exclude property
	end


--Checking to see if the database name is specified along wih the table name
--Your database context should be local to the table for which you want to generate insert statements
--specifying the database name is not allowed
if (PARSENAME(@table_name,3)) is not null
	begin
		RAISERROR('Do not specify the database name. Be in the required database and just specify the table name.',16,1)
		RETURN -1 --Failure. Reason: Database name is specified along with the table name, which is not allowed
	end

--Checking for the existence of 'user table' or 'view'
--This procedure is not written to work on system tables
--To script the data in system tables, just create a view on the system tables and script the view instead

if @owner is null
	begin
		if ((OBJECT_ID(@table_name,'U') is null) and (OBJECT_ID(@table_name,'V') is null))
			begin
				RAISERROR('User table or view not found.',16,1)
				PRINT 'You may see this error, if you are not the owner of this table or view. In that case use @owner parameter to specify the owner name.'
				PRINT 'Make sure you have select permission on that table or view.'
				RETURN -1 --Failure. Reason: There is no user table or view with this name
			end
	end
ELSE
	begin
		if not exists (select 1 from INFORMATION_SCHEMA.TABLES where TABLE_NAME = @table_name and (TABLE_TYPE = 'BASE table' or TABLE_TYPE = 'VIEW') and TABLE_SCHEMA = @owner)
			begin
				RAISERROR('User table or view not found.',16,1)
				PRINT 'You may see this error, if you are not the owner of this table. In that case use @owner parameter to specify the owner name.'
				PRINT 'Make sure you have select permission on that table or view.'
				RETURN -1 --Failure. Reason: There is no user table or view with this name		
			end
	end

--Variable declarations
declare		@Column_ID int,
		@Column_List varchar(8000), 
		@Column_Name varchar(128), 
		@Start_insert varchar(786),
		@Data_Type varchar(128), 
		@Actual_Values varchar(8000),	--This is the string that will be finally executed to generate insert statements
    @Actual_Values2 varchar(8000),
		@IDN varchar(128)		--Will contain the IDENTITY column's name in the table

--Variable Initialization
set @IDN = ''
set @Column_ID = 0
set @Column_Name = ''
set @Column_List = ''
set @Actual_Values = ''
set @Actual_Values2 = ''

if @owner is null
	begin
		set @Start_insert = 'insert into ' + '' + RTRIM(COALESCE(@target_table,@table_name)) + ''
	end
ELSE
	begin
		set @Start_insert = 'insert ' + '' + LTRIM(RTRIM(@owner)) + '.' + '' + RTRIM(COALESCE(@target_table,@table_name)) + ''
	end


--To get the first column's ID

SELECT	@Column_ID = min(ORDINAL_POSITION)
FROM	INFORMATION_SCHEMA.COLUMNS (NOLOCK) 
WHERE 	TABLE_NAME = @table_name and
(@owner is null or TABLE_SCHEMA = @owner)

--Loop through all the columns of the table, to get the column names and their data types
WHILE @Column_ID is not null
	begin
		select 	@Column_Name = QUOTENAME(COLUMN_NAME),
		@Data_Type = DATA_TYPE 
		FROM 	INFORMATION_SCHEMA.COLUMNS (NOLOCK) 
		WHERE 	ORDINAL_POSITION = @Column_ID and
		TABLE_NAME = @table_name and
		(@owner is null or TABLE_SCHEMA = @owner)

--select @Column_Name, LEN(@Column_Name)

		if @cols_to_include is not null --Selecting only user specified columns
		begin
			if CHARINDEX( '''' + SUBSTRING(@Column_Name,2,LEN(@Column_Name)-2) + '''',@cols_to_include) = 0
			begin
				GOTO SKIP_LOOP
			end
		end

		if @cols_to_exclude is not null --Selecting only user specified columns
		begin
			if CHARINDEX( '''' + SUBSTRING(@Column_Name,2,LEN(@Column_Name)-2) + '''',@cols_to_exclude) <> 0
			begin
				GOTO SKIP_LOOP
			end
		end

		--Making sure to output set IDENTITY_insert on/OFF in case the table has an IDENTITY column
		if (select COLUMNPROPERTY( OBJECT_ID(QUOTENAME(COALESCE(@owner,USER_NAME())) + '.' + @table_name),SUBSTRING(@Column_Name,2,LEN(@Column_Name) - 2),'IsIdentity')) = 1
		begin
			if @ommit_identity = 0 --Determing whether to include or exclude the IDENTITY column
				set @IDN = @Column_Name
			ELSE
				GOTO SKIP_LOOP			
		end
		
		--Making sure whether to output computed columns or not
		if @ommit_computed_cols = 1
		begin
			if (select COLUMNPROPERTY( OBJECT_ID(QUOTENAME(COALESCE(@owner,USER_NAME())) + '.' + @table_name),SUBSTRING(@Column_Name,2,LEN(@Column_Name) - 2),'IsComputed')) = 1
			begin
				GOTO SKIP_LOOP					
			end
		end
		
		--Tables with columns of IMAGE data type are not supported for obvious reasons
		IF(@Data_Type in ('image'))
			begin
				if (@ommit_images = 0)
					begin
						RAISERROR('Tables with image columns are not supported.',16,1)
						PRINT 'Use @ommit_images = 1 parameter to generate inserts for the rest of the columns.'
						PRINT 'DO not ommit Column List in the insert statements. if you ommit column list using @include_column_list=0, the generated inserts will fail.'
						RETURN -1 --Failure. Reason: There is a column with image data type
					end
				ELSE
					begin
					GOTO SKIP_LOOP
					end
			end

		--Determining the data type of the column and depending on the data type, the values part of
		--the insert statement is generated. Care is taken to handle columns with null values. Also
		--making sure, not to lose any data from flot, real, money, smallmomey, datetime columns
--print len(@Actual_Values)
--print len(@Actual_Values2)
    if len(@Actual_Values) < 6000 begin

				set @Actual_Values = @Actual_Values  +
				CASE 
				WHEN @Data_Type in ('char','varchar','nchar','nvarchar')
						THEN 
						'COALESCE(''E'' + '''''''' + REPLACE(REPLACE(RTRIM(' + @Column_Name + '),'''''''',''''''''''''),''\'',''\\'')+'''''''',''NULL'')'
				WHEN @Data_Type in ('datetime','smalldatetime')
						THEN 
						'COALESCE('''''''' + RTRIM(CONVERT(char,' + @Column_Name + ',120))+'''''''',''NULL'')'
				WHEN @Data_Type in ('uniqueidentifier')
						THEN  
						'COALESCE('''''''' + REPLACE(CONVERT(char(255),RTRIM(' + @Column_Name + ')),'''''''','''''''''''')+'''''''',''NULL'')'
				WHEN @Data_Type in ('text','ntext')
						THEN  
						'COALESCE('''''''' + REPLACE(CONVERT(char(8000),' + @Column_Name + '),'''''''','''''''''''')+'''''''',''NULL'')'					
				WHEN @Data_Type in ('binary','varbinary')
						THEN  
						'COALESCE(RTRIM(CONVERT(char,' + 'CONVERT(int,' + @Column_Name + '))),''NULL'')'  
				WHEN @Data_Type in ('timestamp','rowversion')
						THEN  
						CASE 
								WHEN @include_timestamp = 0 
								THEN 
										'''default'''
								ELSE 
										'COALESCE(RTRIM(CONVERT(char,' + 'CONVERT(int,' + @Column_Name + '))),''NULL'')'  
						end
				WHEN @Data_Type in ('float','real','money','smallmoney')
						THEN
						'COALESCE(LTRIM(RTRIM(' + 'CONVERT(char, ' +  @Column_Name  + ',2)' + ')),''NULL'')' 
				ELSE 
						'COALESCE(LTRIM(RTRIM(' + 'CONVERT(char, ' +  @Column_Name  + ')' + ')),''NULL'')' 
				end   + '+' +  ''',''' + ' + '

		end else begin

				set @Actual_Values2 = @Actual_Values2  +
				CASE 
				WHEN @Data_Type in ('char','varchar','nchar','nvarchar')
						THEN 
						'COALESCE(''E'' + '''''''' + REPLACE(REPLACE(RTRIM(' + @Column_Name + '),'''''''',''''''''''''),''\'',''\\'')+'''''''',''NULL'')'
				WHEN @Data_Type in ('datetime','smalldatetime')
						THEN 
						'COALESCE('''''''' + RTRIM(CONVERT(char,' + @Column_Name + ',120))+'''''''',''NULL'')'
				WHEN @Data_Type in ('uniqueidentifier')
						THEN  
						'COALESCE('''''''' + REPLACE(CONVERT(char(255),RTRIM(' + @Column_Name + ')),'''''''','''''''''''')+'''''''',''NULL'')'
				WHEN @Data_Type in ('text','ntext')
						THEN  
						'COALESCE('''''''' + REPLACE(CONVERT(char(8000),' + @Column_Name + '),'''''''','''''''''''')+'''''''',''NULL'')'					
				WHEN @Data_Type in ('binary','varbinary')
						THEN  
						'COALESCE(RTRIM(CONVERT(char,' + 'CONVERT(int,' + @Column_Name + '))),''NULL'')'  
				WHEN @Data_Type in ('timestamp','rowversion')
						THEN  
						CASE 
								WHEN @include_timestamp = 0 
								THEN 
										'''default'''
								ELSE 
										'COALESCE(RTRIM(CONVERT(char,' + 'CONVERT(int,' + @Column_Name + '))),''NULL'')'  
						end
				WHEN @Data_Type in ('float','real','money','smallmoney')
						THEN
						'COALESCE(LTRIM(RTRIM(' + 'CONVERT(char, ' +  @Column_Name  + ',2)' + ')),''NULL'')' 
				ELSE 
						'COALESCE(LTRIM(RTRIM(' + 'CONVERT(char, ' +  @Column_Name  + ')' + ')),''NULL'')' 
				end   + '+' +  ''',''' + ' + '

    end
		
		--Generating the column list for the insert statement
		set @Column_List = @Column_List +  replace(replace(@Column_Name,']',''),'[','') + ','

		SKIP_LOOP: --The label used in GOTO

		select 	@Column_ID = min(ORDINAL_POSITION)
		FROM 	INFORMATION_SCHEMA.COLUMNS (NOLOCK) 
		WHERE 	TABLE_NAME = @table_name and
		ORDINAL_POSITION > @Column_ID and
		(@owner is null or TABLE_SCHEMA = @owner)


	--Loop ends here!
	end


--To get rid of the extra characters that got concatenated during the last run through the loop
set @Column_List = left(@Column_List,len(@Column_List) - 1)
if len(@Actual_Values2) = 0 set @Actual_Values = left(@Actual_Values,len(@Actual_Values) - 6)
if len(@Actual_Values2) > 0 set @Actual_Values2 = left(@Actual_Values2,len(@Actual_Values2) - 6)

if LTRIM(@Column_List) = ''
	begin
		RAISERROR('No columns to select. There should at least be one column to generate the output',16,1)
		RETURN -1 --Failure. Reason: Looks like all the columns are ommitted using the @cols_to_exclude parameter
	end

--Forming the final string that will be executed, to output the insert statements
if (@include_column_list <> 0)
	begin
		set @Actual_Values =
			'select ' +
			CASE when @top is null or @top < 0 then '' else ' TOP ' + LTRIM(STR(@top)) + ' ' end +
			'''' + RTRIM(@Start_Insert) + 
			' ''+' + '''(' + RTRIM(@Column_List) +  '''+' + ''')''' + 
			' +''values(''+ ' +  @Actual_Values

      set @Actual_Values2 = @Actual_Values2 + '+'');''' + ' ' +
			COALESCE(@from,' from ' + case when @owner is null then '' else '' + LTRIM(RTRIM(@owner)) + '.' end + '' + rtrim(@table_name) + '' + '(NOLOCK)')
	end
ELSE if (@include_column_list = 0)
	begin
		set @Actual_Values =
			'select ' +
			CASE when @top is null or @top < 0 then '' else ' TOP ' + LTRIM(STR(@top)) + ' ' end +
			'''' + RTRIM(@Start_Insert) + 
			' '' +''values(''+ ' +  @Actual_Values
      
      set @Actual_Values2 = @Actual_Values2 + '+'');''' + ' ' +
			COALESCE(@from,' from ' + case when @owner is null then '' else '' + LTRIM(RTRIM(@owner)) + '.' end + '' + rtrim(@table_name) + '' + '(NOLOCK)')
	end

--Determining whether to ouput any debug information
if @debug_mode =1
	begin
		PRINT '/*****START OF DEBUG INFORMATION*****'
		PRINT 'Beginning of the insert statement:'
		PRINT @Start_Insert
		PRINT ''
		PRINT 'The column list:'
		PRINT @Column_List
		PRINT ''
		PRINT 'The select statement executed to generate the inserts'
		PRINT @Actual_Values 
    print @Actual_Values2
		PRINT ''
		PRINT '*****end OF DEBUG INFORMATION*****/'
		PRINT ''
	end
		
--PRINT '--INSERTs generated by ''sp_generate_inserts'' stored procedure written by Vyas'
--PRINT '--Build number: 22'
--PRINT '--Problems/Suggestions? Contact Vyas @ vyaskn@hotmail.com'
--PRINT '--http://vyaskn.tripod.com'
--PRINT ''
--PRINT 'set NOCOUNT on'
PRINT ''


--Determining whether to print IDENTITY_insert or not
/*
if (@IDN <> '')
	begin
		PRINT 'set IDENTITY_insert ' + QUOTENAME(COALESCE(@owner,USER_NAME())) + '.' + QUOTENAME(@table_name) + ' on'
		PRINT 'GO'
		PRINT ''
	end
*/

if @disable_constraints = 1 and (OBJECT_ID(QUOTENAME(COALESCE(@owner,USER_NAME())) + '.' + @table_name, 'U') is not null)
	begin
		if @owner is null
			begin
				select 	'alter table ' + QUOTENAME(COALESCE(@target_table, @table_name)) + ' NOCHECK CONSTRAINT all' as '--Code to disable constraints temporarily'
			end
		ELSE
			begin
				select 	'alter table ' + QUOTENAME(@owner) + '.' + QUOTENAME(COALESCE(@target_table, @table_name)) + ' NOCHECK CONSTRAINT all' as '--Code to disable constraints temporarily'
			end

		PRINT 'GO'
	end

PRINT ''
--PRINT 'PRINT ''Inserting values into ' + '' + RTRIM(COALESCE(@target_table,@table_name)) + '' + ''''


--All the hard work pays off here!!! You'll get your insert statements, when the next line executes!
--print len(@Actual_Values)
--print len(@Actual_Values2)
--print (@Actual_Values)
--PRINT (@Actual_Values2)
EXEC (@Actual_Values+@Actual_Values2)

--PRINT 'PRINT ''Done'''
PRINT ''


if @disable_constraints = 1 and (OBJECT_ID(QUOTENAME(COALESCE(@owner,USER_NAME())) + '.' + @table_name, 'U') is not null)
	begin
		if @owner is null
			begin
				select 	'alter table ' + QUOTENAME(COALESCE(@target_table, @table_name)) + ' CHECK CONSTRAINT all'  as '--Code to enable the previously disabled constraints'
			end
		ELSE
			begin
				select 	'alter table ' + QUOTENAME(@owner) + '.' + QUOTENAME(COALESCE(@target_table, @table_name)) + ' CHECK CONSTRAINT all' as '--Code to enable the previously disabled constraints'
			end

		PRINT 'GO'
	end

PRINT ''
/*
if (@IDN <> '')
	begin
		PRINT 'set IDENTITY_insert ' + QUOTENAME(COALESCE(@owner,USER_NAME())) + '.' + QUOTENAME(@table_name) + ' OFF'
		PRINT 'GO'
	end
*/
--PRINT 'set NOCOUNT OFF'


set NOCOUNT OFF
RETURN 0 --Success. We are done!
end

GO

PRINT 'Created the procedure'
GO


PRINT 'Granting EXECUTE permission on sp_generate_inserts to all users'
GRANT EXEC on sp_generate_inserts to public

set NOCOUNT OFF
GO

PRINT 'Done'
