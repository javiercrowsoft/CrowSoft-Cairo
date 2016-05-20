#Database Maintenance Tasks

-  TmpStringToTable must be deleted using this sentence

   delete from TmpStringToTable where tmpstr2tbl_id < dateadd('Month', -1, now());