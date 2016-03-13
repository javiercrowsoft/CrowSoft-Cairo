CrowSoft Cairo documentation
============================

Why is Spanish used in this project?

Cairo is a migration from a previous system which was writen in a mix of Spanish and English. A horrible mix. I want to translate all the code to English but this task will take some time.

I am an Spanish native speaker and I love my language. That said, I believe that English is the lingua franca in programming.

Common specifications
---------------------

### Databases

Master

 This database contains the user definition (name and password) and the domain list

Domain

 This database contains the domain definition (cairo database connection settings and the list of companies and users)

Cairo

 This database contains all the business objects

## Definitions

There is only one master database

There is one domain database by email domain

There is one ore more cairo database by email domain

When a person creates a user she/he must provide an email address. The domain is used to create the domain and cairo databases.

All users who share the same domain are associated to the same domain database

The domain and cairo databases are named using the domain. For example if a person register using the email address javier@crowsoft.com.ar the domain database is named crowsoft_com_ar_domain and the cairo database is named crowsoft_com_ar_cairo.

### Users are created in two ways:

  - When a person registers at the cairo landing page (for example www.crowsoft.com.ar)

  - When a new user is created using the user dialog in cairo.

The user definition is shared between these three database. These are the tables in each database:

  - master.users
  - domain.company_users
  - cairo.usuarios

The us_id in both tables master.users and cairo.usuarios has the same value.

domain.company_users contains the relation between the domain.companies table and the cairo.usario table.

For each user in master.users there are one or more users in domain.company_users.

    +----------------+-------------------+
    |  master.users  |    cairo.usuario  |
    |----------------+-------------------+
    |  us_id         |    us_id          |
    |  us_username   |    us_nombre      |
    |  us_password   |    us_clave **    |
    +----------------+-------------------+
    
    ** this column is empty in cairo.usuario. password are saved only in users
    
    Notice: the id is defined by master database
    
    
A cairo database can contain one or more companies. Companies are defined in cairo.empresa. Users can be associated with zero or more companies. This relation is in cairo.EmpresaUsuario. This relation is replicated in domain.company_users.

Companies defined in cairo.empresa are replicated in domain.companies.

The domain.companies columns are mapped to cairo.empresa as:

    +--------------------+-------------------+
    |  domain.companies  |    cairo.empresa  |
    |--------------------+-------------------+
    |  co_company_id     |    emp_id         |
    |  co_company_name   |    emp_name       |
    +--------------------+-------------------+
    
    Notice: the id is NOT defined by domain database

For each user in cairo.usuario there can be zero or more rows in domain.company_users it depends in the amount of companies associated to the user in EmpresaUsuario.

When a user is created using the user dialog in cairo this is the creation sequence:

  - a user is created in cairo_master database

  - a user is created in cairo database

  - a user is registered in domain.company_users

The us_email is created as user name ( spaces replaced by _ ) @ domain ( extracted from cairo database name )

### User definition

The user is represented in all this three databases

![users and companies](https://cloud.githubusercontent.com/assets/1075455/13728973/7f51a700-e907-11e5-8913-5a60f3c5e79a.png)

### Server Side

User registration / activation

Login / authentication

Recover password

Emails services

Database connections

Business objects

Tree navigation

Reports

### Browser Side

Tree navigation

Wizards

Document navigation

QueryList

Grid control

Reports

JavaScript dependencies:

Marionette.js used is 1.7.0
NOTICE !!! :
  this library has been modified at line 1337
  the original code was:

        // build the args for the event
        var args = {
          view: this,
          model: this.model,
          collection: this.collection
        };

  the modified version adds a property to hold the event

        // build the args for the event
        var args = {
          view: this,
          model: this.model,
          collection: this.collection,
          event: e
        };

Datatables.net used is 1.10.0

jquery-ui-10.1.3,js
NOTICE !!! :
  this library has been modified at line 8448 and 8452: the jquery classes in the buttons close and today have been removed and the boostrap classes has been added
