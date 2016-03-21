<?php

/*
 * Deletes an event and removes it from the Attends, and Contains table.
 * Also removes any reminders from the Reminds and Reminder tables for
 * this event.
 * It returns nothing
 */

require 'database_connection.php';
require 'utility.php';

$event_id = $_GET['id'];

// This will store the final result:
$json_result = array();

// Delete all the records from the Contains table that match event_id
$delete_event_query = "DELETE FROM Contains WHERE Eid = '$event_id'";

$result = mysqli_query($link, $delete_event_query);
if ($result === FALSE) {
    printf("query 1 could not be executed");
    exit(1);
}

// Delete all the records from the Attends table that match event_id
$delete_event_query = "DELETE FROM Attends WHERE Eid = '$event_id'";

$result = mysqli_query($link, $delete_event_query);
if ($result === FALSE) {
    printf("query 2 could not be executed");
    exit(1);
}

// Remove all records from the Reminds table which were reminders for
// this event.
$delete_event_query = "
DELETE FROM Reminds WHERE Reminds.Rid IN (
    SELECT DISTINCT Reminder.Rid
    FROM Reminder
    WHERE Reminder.Eid = '$event_id'
)";

$result = mysqli_query($link, $delete_event_query);
if ($result === FALSE) {
    printf("query 3 could not be executed");
    exit(1);
}

// Delete all the records from the Reminder table that match event_id
$delete_event_query = "DELETE FROM Reminder WHERE Eid = '$event_id'";

$result = mysqli_query($link, $delete_event_query);
if ($result === FALSE) {
    printf("query 4 could not be executed");
    exit(1);
}

// Finally, delete the record from the Events table
$delete_event_query = "DELETE FROM Event WHERE Eid = '$event_id'";

$result = mysqli_query($link, $delete_event_query);
if ($result === FALSE) {
    printf("query 5 could not be executed");
    exit(1);
}

?>
