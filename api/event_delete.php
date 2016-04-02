<?php

/*
 * Deletes an event
 *
 * The returned object looks like the following:
 * {
 *     success: true/false
 * }
 */

require 'database_connection.php';
require 'utility.php';

$event_id = $_GET['id'];

// This will store the final result:
$json_result = array();

// Delete the record from the Events table
$delete_event_query = "DELETE FROM Event WHERE Eid = '$event_id'";

$result = mysqli_query($link, $delete_event_query);
if ($result === FALSE) {
    printf("query could not be executed");
    exit(1);
}

$json_result['success'] = true;
output_json($json_result);

?>
