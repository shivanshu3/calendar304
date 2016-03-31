<?php

/*
 * Removes an event from a calendar
 *
 * The returned object looks like the following:
 * {
 *     success: true/false
 * }
 */

require 'database_connection.php';
require 'utility.php';

$event_id = $_GET['event_id'];
$calendar_id = $_GET['calendar_id'];

// This will store the final result:
$json_result = array();

// Delete all the records from the Contains table that match event_id
$remove_event_query = "
DELETE FROM `Contains` WHERE `Eid` = $event_id AND `Cid` = $calendar_id";

$result = mysqli_query($link, $remove_event_query);
if ($result === FALSE) {
    printf("query could not be executed");
    exit(1);
}

$json_result['success'] = true;
output_json($json_result);

?>
