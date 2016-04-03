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
    num_invited: // int
    num_attending: // int
    num_pending: // int
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

// Find the number of users invited:
$query = '
SELECT COUNT(User.Uid)
FROM User, Calendar, Contains
WHERE User.Uid = Calendar.Uid
AND Calendar.Cid = Contains.Cid
AND Contains.Eid = '.$id;

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
} else {
    // printf("query successfully executed.\n");
}

$all_rows = $result->fetch_all();

$json_result['num_invited'] = $all_rows[0][0];

// Find the number of users attending:
$query = '
SELECT COUNT(User.Uid)
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

$json_result['num_attending'] = $all_rows[0][0];

// Find the number of pending invitations:
$query = '
SELECT COUNT(User.Uid)
FROM User, Invite
WHERE User.Uid = Invite.Uid AND Invite.Eid = '.$id;

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
} else {
    // printf("query successfully executed.\n");
}

$all_rows = $result->fetch_all();

$json_result['num_pending'] = $all_rows[0][0];

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

// Find the reminders for this event:
$query = '
SELECT Rid, Type, Time
FROM Reminder
WHERE Eid = '.$id;

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
} else {
    // printf("query successfully executed.\n");
}

$all_rows = $result->fetch_all();

$reminders = array();
$num_reminders = count($all_rows);
for ($i = 0; $i < $num_reminders; $i++) {
    $reminder = array();
    $reminder['id'] = $all_rows[$i][0];
    $reminder['type'] = $all_rows[$i][1];
    $reminder['time'] = $all_rows[$i][2];
    array_push($reminders, $reminder);
}
$json_result['reminders'] = $reminders;

output_json($json_result);

?>
