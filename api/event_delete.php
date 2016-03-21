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

// This contains all the sql queries:
$queries = [];

// Delete all the records from the Contains table that match event_id
$delete_event_query = "DELETE FROM Contains WHERE Eid = '$event_id'";

$result = mysqli_query($link, $delete_event_query);
if ($result === FALSE) {
    printf("query could not be executed");
    exit(1);
}

// Delete all the records from the Attends table that match event_id
$delete_event_query = "DELETE FROM Attends WHERE Eid = '$event_id'";

$result = mysqli_query($link, $delete_event_query);
if ($result === FALSE) {
    printf("query could not be executed");
    exit(1);
}

// Retrieve the Rid associated with event_id from the Reminder table
// if one exists
$query = "SELECT DISTINCT Rid FROM Reminder WHERE Eid = '$event_id'";
$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed");
    exit(1);
}

$all_rows = $result->fetch_all();

// If Rid exists, remove it from the Reminds table
if(count($all_rows) !== 0){
    $rid = $all_rows[0][0];    

    $query = "DELETE FROM Reminds WHERE Rid = '$rid'";
    $result = mysqli_query($link, $query);
    if ($result === FALSE) {
        printf("query could not be executed");
        exit(1);
    }
}

// Delete all the records from the Reminder table that match event_id
$delete_event_query = "DELETE FROM Reminder WHERE Eid = '$event_id'";

$result = mysqli_query($link, $delete_event_query);
if ($result === FALSE) {
    printf("query could not be executed");
    exit(1);
}

// Finally, delete the record from the Events table
$delete_event_query = "DELETE FROM Events WHERE Eid = '$event_id'";

$result = mysqli_query($link, $delete_event_query);
if ($result === FALSE) {
    printf("query could not be executed");
    exit(1);
}

?>
