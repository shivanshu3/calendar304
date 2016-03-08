<?php

/*
Given an event id, it returns the following object:

{
    id: // the id you supplied
    name:
    start_time: // seconds since epoch
    duration: // seconds
    location: {
        room_no:
        max_occ:
    }
    users: [
        {
            id:
            name:
        },
        ...
    ]
    reminders: [
        {
            id:
            type:
            time: // seconds since epoch
        },
        ...
    ]
}

The returned object will be empty - with no keys if an event with the
given id does not exist.
*/

require 'database_connection.php';
require 'utility.php';

$id = $_GET['id'];

// This will store the final result
$json_result = array();

// Get the event details
$query = '
SELECT Name, StartTime, Duration, RoomNo
FROM Event
WHERE Event.Eid = '.$id;

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
} else {
    // printf("query successfully executed.\n");
}

$all_rows = $result->fetch_all();

// Event does not exist?
if (count($all_rows) == 0) {
    output_json($json_result);
    exit(0);
}

// Constructing the json object:
$json_result['id'] = $id;
$json_result['name'] = $all_rows[0][0];
$json_result['start_time'] = $all_rows[0][1];
$json_result['duration'] = $all_rows[0][2];

// Get the max occupants of the location:
$location_id = $all_rows[0][3];

$query = '
SELECT MaxOcc
FROM Location
WHERE RoomNo = '.$location_id;

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
} else {
    // printf("query successfully executed.\n");
}

$all_rows = $result->fetch_all();

// Continuing the json object construction for location:
$json_result['location'] = array();
$json_result['location']['room_no'] = $location_id;
$json_result['location']['max_occ'] = $all_rows[0][0];

// Find the users attending this event:
$query = '
SELECT User.Uid, User.Name
FROM User, Attends
WHERE User.Uid = Attends.Uid AND Attends.Eid = '.$id;

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
} else {
    // printf("query successfully executed.\n");
}

$all_rows = $result->fetch_all();

$users = array();
$num_rows = count($all_rows);
for ($i = 0; $i < $num_rows; $i++) {
    $user = array();
    $user['id'] = $all_rows[$i][0];
    $user['name'] = $all_rows[$i][1];
    array_push($users, $user);
}
$json_result['users'] = $users;

output_json($json_result);

?>
