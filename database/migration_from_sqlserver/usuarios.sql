select 'insert into users (us_id, us_username, us_email, us_password, us_code, us_platform, us_ip_address, us_user_agent, us_accept_language) values(' || us_id::varchar || ',''' || us_nombre ||''',''' || us_nombre ||''',''' || us_nombre ||''',''' || us_nombre ||''', '''', '''', '''', '''');' from usuario order by us_id

/*

after create the users in master we need to run this command in play console. to start play console we need to run ./start_play_console.sh

models.master.User.list.map(user => {play.api.Logger.debug(user.id.getOrElse(0).toString); models.master.User.updateCode(user.id.getOrElse(0), services.PasswordHash.createCode(user.password))})

*/