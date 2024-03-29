# calendar304
CPSC 304 - Relational Databases - Project - Online Calendar

## Documents
- [Project Proposal](https://docs.google.com/document/d/134_C790kSTVwm8omfrEveGoH1d7TNZ1RmzSnTISshe0/edit)
- [E/R Diagrams and Schemas](https://docs.google.com/document/d/1DE5_9B03xWqgZZ8FEhaIWmzn_nfFD872n8Xasdzrh84/edit#heading=h.8v8yehgkyrpk)
- [Formal Specifications](https://docs.google.com/document/d/1p-aZlfOyovD4EqRkLXe-PCVttY1Ae9KItOTfZPNnOwc/edit#)
- [Final Document](https://docs.google.com/document/d/1eNKFWwCgua_vv2uZI6O42n2Pg0EOhhYwq63BkUYAOUs/edit#)

## Installation instructions
We're using Ubuntu for this project.
- Install MySQL
- Install Apache
- Install phpmyadmin (optional, for easily looking at the database, and to test
  SQL queries)
- Install mysqlnd extension: sudo apt-get install php5-mysqlnd

## Setup instructions
- Open phpmyadmin and log in
- Go to the databases section, and create a new database called "calendar304"
- Go to the privilges section for this database and click "Add user" to create
  a new MySQL user which will have full access to this database.
- Use the following details for the new user:
    - username: calendar304
    - password: calendar304

  Leave everything else to default settings.
- Run the setup_database script under /api/test_scripts to create the tables
  and populate them with some test data. You should now be able to see the
  tables with test data in phpmyadmin.

## Code formatting
- Max line limit is 80 characters
- Use 4 spaces per tab
