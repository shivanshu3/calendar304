<?php

/*
Used to edit the following fields of an event:

{
    name:
    start_time: // seconds since epoch
    duration: // seconds
    location: {
        room_no:
        max_occ:
    }
}

You need to give the event id so we know which event to edit.
You need to provide new values of name, start_time, duration, and room_no.

The returned object looks like the following:

{
    success: true/false
}
*/

require 'database_connection.php';
require 'utility.php';

$event_id = $_GET['event_id'];
$name = $_GET['name'];
$start_time = $_GET['start_time'];
$duration = $_GET['duration'];
$room_no = $_GET['room_no'];

// This will store the final result:
$json_result = array();

$query = "
UPDATE Event
SET Name = '$name', StartTime = '$start_time', Duration = '$duration',
RoomNo = '$room_no'
WHERE Eid = '$event_id'";

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
}

$json_result['success'] = true;
output_json($json_result);

?>
