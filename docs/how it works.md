CrowSoft Cairo documentation
============================

Why is Spanish used in this project?

Cairo is a migration from a previous system which was writen in a mix of Spanish and English. A horrible mix. I want to translate all the code to English but this task will take some time.

I am an Spanish native speaker and I love my language. That said, I believe that English is the lingua franca in programming.

Common specifications
---------------------

### Databases

Master

Domain

Cairo

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