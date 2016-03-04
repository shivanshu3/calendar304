<?php

// Host, username, password, database name
$link = mysqli_connect("localhost", "calendar304", "calendar304",
    "calendar304");

// Check connection:
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit(1);
}

printf("Dropping all tables...\n");

// Queries to drop all tables.
// Note that foreign key checking is disabled in the beginning and then
// we turn it back on in the end:
$drop_tables_queries = array(
'SET FOREIGN_KEY_CHECKS = 0;',
'DROP TABLE IF EXISTS Attends;',
'DROP TABLE IF EXISTS Calendar;',
'DROP TABLE IF EXISTS Contains;',
'DROP TABLE IF EXISTS Event;',
'DROP TABLE IF EXISTS Location;',
'DROP TABLE IF EXISTS Reminder;',
'DROP TABLE IF EXISTS Reminds;',
'DROP TABLE IF EXISTS User;',
'SET FOREIGN_KEY_CHECKS = 1;'
);

// Loop through all queries in $drop_tables_queries, and run them:
$num_drop_queries = count($drop_tables_queries);
for ($i = 0; $i < $num_drop_queries; $i++) {
    if (mysqli_query($link, $drop_tables_queries[$i]) === TRUE) {
        printf("Drop query %d successfully executed.\n", $i);
    } else {
        printf("Drop query %d could not be executed.\n", $i);
        exit(1);
    }
}

// This array will contain the MySQL queries for creating tables:
$table_create_queries = array();

array_push($table_create_queries, '
CREATE TABLE User
(
    Uid INT,
    Name CHAR(50),
    PRIMARY KEY (Uid)
);
');

array_push($table_create_queries, '
CREATE TABLE Calendar
(
    Cid INT,
    Name CHAR(50),
    Uid INT,
    PRIMARY KEY (Cid),
    FOREIGN KEY (Uid) REFERENCES User(Uid),
    UNIQUE (Uid, Name)
);
');

array_push($table_create_queries, '
CREATE TABLE Location
(
    RoomNo INT,
    MaxOcc INT,
    PRIMARY KEY (RoomNo)
);
');

array_push($table_create_queries, '
CREATE TABLE Event
(
    Eid INT,
    Name CHAR(50),
    StartTime INT,
    Duration INT,
    RoomNo INT,
    PRIMARY KEY (Eid),
    FOREIGN KEY (RoomNo) REFERENCES Location(RoomNo)
);
');

array_push($table_create_queries, '
CREATE TABLE Reminder
(
    Rid INT,
    Type INT,
    Time INT,
    Eid INT,
    PRIMARY KEY (Rid),
    FOREIGN KEY (Eid) REFERENCES Event(Eid),
    UNIQUE (Eid, Time, Type)
);
');

array_push($table_create_queries, '
CREATE TABLE Contains
(
    Cid INT,
    Eid INT,
    PRIMARY KEY (Cid, Eid),
    FOREIGN KEY (Cid) REFERENCES Calendar(Cid),
    FOREIGN KEY (Eid) REFERENCES Event(Eid)
);
');

array_push($table_create_queries, '
CREATE TABLE Attends
(
    Uid INT,
    Eid INT,
    PRIMARY KEY (Uid, Eid),
    FOREIGN KEY (Uid) REFERENCES User(Uid),
    FOREIGN KEY (Eid) REFERENCES Event(Eid)
);
');

array_push($table_create_queries, '
CREATE TABLE Reminds
(
    Rid INT,
    Uid INT,
    PRIMARY KEY (Rid, Uid),
    FOREIGN KEY (Rid) REFERENCES Reminder(Rid),
    FOREIGN KEY (Uid) REFERENCES User(Uid)
);
');

printf("Creating tables...\n");

// Loop through all queries in $table_create_queries, and run them:
$num_create_queries = count($table_create_queries);
for ($i = 0; $i < $num_create_queries; $i++) {
    if (mysqli_query($link, $table_create_queries[$i]) === TRUE) {
        printf("Table %d successfully created.\n", $i);
    } else {
        printf("Table %d could not be created.\n", $i);
        exit(1);
    }
}

/*

CREATE TABLE User
(
    Uid INT,
    Name CHAR(50),
    PRIMARY KEY (Uid)
);

CREATE TABLE Calendar
(
    Cid INT,
    Name CHAR(50),
    Uid INT,
    PRIMARY KEY (Cid),
    FOREIGN KEY (Uid) REFERENCES User(Uid),
    UNIQUE (Uid, Name)
);

CREATE TABLE Location
(
    RoomNo INT,
    MaxOcc INT,
    PRIMARY KEY (RoomNo)
);

CREATE TABLE Event
(
    Eid INT,
    Name CHAR(50),
    StartTime INT,
    Duration INT,
    RoomNo INT,
    PRIMARY KEY (Eid),
    FOREIGN KEY (RoomNo) REFERENCES Location(RoomNo)
);

CREATE TABLE Reminder
(
    Rid INT,
    Type INT,
    Time INT,
    Eid INT,
    PRIMARY KEY (Rid),
    FOREIGN KEY (Eid) REFERENCES Event(Eid),
    UNIQUE (Eid, Time, Type)
);

CREATE TABLE Contains
(
    Cid INT,
    Eid INT,
    PRIMARY KEY (Cid, Eid),
    FOREIGN KEY (Cid) REFERENCES Calendar(Cid),
    FOREIGN KEY (Eid) REFERENCES Event(Eid)
);

CREATE TABLE Attends
(
    Uid INT,
    Eid INT,
    PRIMARY KEY (Uid, Eid),
    FOREIGN KEY (Uid) REFERENCES User(Uid),
    FOREIGN KEY (Eid) REFERENCES Event(Eid)
);

CREATE TABLE Reminds
(
    Rid INT,
    Uid INT,
    PRIMARY KEY (Rid, Uid),
    FOREIGN KEY (Rid) REFERENCES Reminder(Rid),
    FOREIGN KEY (Uid) REFERENCES User(Uid)
);

 */

?>
