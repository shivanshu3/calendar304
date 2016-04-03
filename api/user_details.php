<?php

/*
Given a user id, it returns the following object:

{
    id: // the id you supplied
    name: // the full name of this user
    calendars: [
        {
            id: // id of the calendar
            name: // name of this calendar
        },
        {
            ...
        }
    ]
    events: [
        {
            id: // id of the event
            name: // name of the event
        },
        {
            ...
        }
    ]
    invites: [
        {
            id: // id of the event
            name: // name of the event
        },
        {
            ...
        }
    ]
    reminders: [
        {
            eid: // id of the event
            time: // time of the event
            name: // name of the event
        },
        {
            ...
        }
    ]
}

The returned object will be empty - with no keys if a user with the
given id does not exist.
*/

require 'database_connection.php';
require 'utility.php';

$id = $_GET['id'];

// This will store the final result
$json_result = array();

// Get the user's name:
$query = '
SELECT DISTINCT User.Name
FROM User
WHERE User.Uid = '.$id;

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
} else {
    // printf("query successfully executed.\n");
}

$all_rows = $result->fetch_all();

// User does not exist?
if (count($all_rows) == 0) {
    output_json($json_result);
    exit(0);
}

$json_result['id'] = $id;
$json_result['name'] = $all_rows[0][0];

// Get the calendars of a user:
$query = '
SELECT DISTINCT Calendar.Cid, Calendar.Name
FROM Calendar
WHERE Calendar.Uid = '.$id;

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
} else {
    // printf("query successfully executed.\n");
}

$all_rows = $result->fetch_all();

$calendars = array();
$num_rows = count($all_rows);
for ($i = 0; $i < $num_rows; $i++) {
    $calendar = array();
    $calendar['id'] = $all_rows[$i][0];
    $calendar['name'] = $all_rows[$i][1];
    array_push($calendars, $calendar);
}
$json_result['calendars'] = $calendars;

// Get the events for the user:
$query = "
SELECT DISTINCT Event.Eid, Event.Name
FROM Event
WHERE Event.Uid = $id";

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
}

$all_rows = $result->fetch_all();

$events = array();
$num_rows = count($all_rows);
for ($i = 0; $i < $num_rows; $i++) {
    $event = array();
    $event['id'] = $all_rows[$i][0];
    $event['name'] = $all_rows[$i][1];
    array_push($events, $event);
}
$json_result['events'] = $events;

// Get the invites for the user:
$query = "
SELECT DISTINCT Invite.Eid, Event.Name
FROM Invite, Event
WHERE Invite.Uid = $id
AND Invite.Eid = Event.Eid";

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
}

$all_rows = $result->fetch_all();

$invites = array();
$num_rows = count($all_rows);
for ($i = 0; $i < $num_rows; $i++) {
    $invite = array();
    $invite['id'] = $all_rows[$i][0];
    $invite['name'] = $all_rows[$i][1];
    array_push($invites, $invite);
}
$json_result['invites'] = $invites;

// Get the reminders for the user:
$query = "
SELECT DISTINCT Reminder.Eid, Reminder.Time, Event.Name
FROM  Reminder, Event
WHERE Reminder.Uid = $id AND Reminder.Eid = Event.Eid
ORDER BY Reminder.Time ASC";

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
}

$all_rows = $result->fetch_all();

$events = array();
$num_rows = count($all_rows);

for ($i = 0; $i < $num_rows; $i++) {
    $event = array();
    $event['eid'] = $all_rows[$i][0];
    $event['time'] = $all_rows[$i][1];
    $event['name'] = $all_rows[$i][2];
    array_push($events, $event);
}
$json_result['reminders'] = $events;

output_json($json_result);

?>
