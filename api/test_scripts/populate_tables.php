<?php

/**
 * Populates the database with some test data.
 * The database should be empty before running this script.
 */

require '../database_connection.php';

// User
// Calendar
// Location
// Event
// Reminder
// Contains
// Attends
// Reminds

printf("Inserting data...\n");

// This array will contain the MySQL queries for inserting data:
$insert_queries = array();

array_push($insert_queries,
    "INSERT INTO `User` (`Uid`, `Name`) VALUES".
    "('1', 'Imperator Furiosa'),".
    "('2', 'Luke Skywalker'),".
    "('3', 'Ellen Ripley'),".
    "('4', 'Blast Hardcheese'),".
    "('5', 'Commander Shepard')"
);

array_push($insert_queries,
    "INSERT INTO `Calendar` (`Cid`, `Name`, `Uid`) VALUES".
    "('1', 'Blast Appointments', '4'),".
    "('2', 'Company Holidays', '1'),".
    "('3', 'Alien Containment Tasks', '3'),".
    "('4', 'Productivity Meetings', '4'),".
    "('5', 'Jedi Training Schedule', '2')"
);

// Loop through all queries in $insert_queries, and run them:
$num_insert_queries = count($insert_queries);
for ($i = 0; $i < $num_insert_queries; $i++) {
    if (mysqli_query($link, $insert_queries[$i]) === TRUE) {
        printf("Insert query %d successfully executed.\n", $i);
    } else {
        printf("Insert query %d could not be executed.\n", $i);
        exit(1);
    }
}

?>
