<?php

/**
 * Populates the database with some test data.
 * The database should be empty before running this script.
 */

require '../database_connection.php';

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

array_push($insert_queries,
    "INSERT INTO `Location` (`RoomNo`, `MaxOcc`) VALUES".
    "('1', '10'),".
    "('2', '10'),".
    "('3', '20'),".
    "('4', '30'),".
    "('5', '50')"
);

array_push($insert_queries,
    "INSERT INTO `Event` (`Eid`, `Name`, `StartTime`, `Duration`, `RoomNo`, `Uid`) ".
    "VALUES".
    "('1', 'Sprint 1 Planning', '1462363200', '900', '1', '1'),".
    "('2', 'Sprint 1 Retrospective', '1463140800', '7200', '1', '3'),".
    "('3', 'Welcoming Party', '1463227200', '7200', '5', '2'),".
    "('4', 'Release Party', '1465905600', '7200', '5', '4'),".
    "('5', 'Interview with Idris Elba', '1462276800', '3600', '2', '4')"
);

array_push($insert_queries,
    "INSERT INTO `Reminder` (`Rid`, `Uid`, `Type`, `Time`, `Eid`) ".
    "VALUES".
    "('1', '1', '0', '1456819200000', '1'),".
    "('2', '3', '0', '1456819300000', '2'),".
    "('3', '4', '1', '1456819400000', '2'),".
    "('4', '2', '0', '1456819600000', '3')"
);

array_push($insert_queries,
    "INSERT INTO `Contains` (`Cid`, `Eid`) ".
    "VALUES".
    "('2', '1'),".
    "('3', '2'),".
    "('5', '3'),".
    "('4', '4'),".
    "('1', '5'),".
    "('1', '1'),".
    "('4', '2'),".
    "('3', '3'),".
    "('5', '4'),".
    "('2', '2'),".
    "('2', '3'),".
    "('2', '4'),".
    "('2', '5')"
);

array_push($insert_queries,
    "INSERT INTO `Attends` (`Uid`, `Eid`) ".
    "VALUES".
    "('1', '1'),".
    "('3', '2'),".
    "('2', '3'),".
    "('2', '4'),".
    "('1', '2'),".
    "('1', '3'),".
    "('1', '4'),".
    "('1', '5')"
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
