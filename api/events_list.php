<?php

/**
 * Get all events scheduled on a particular date for the given calendar.
 * The date is given as year, month, date.
 * Note: Month is specified as a number, where 1 corresponds to Jan.
 * Note: This script ignores the duration of events. For example, if an event
 * is so long that it continues till the next day, and that next day is
 * passed to this script, then that event will not be returned.
 *
 * It also needs the user's timezone offset. This is because an event
 * scheduled at some time might fall on different days for different users
 * depending on their timezone.
 * The offset needed is: (UTC time - User's local time) in minutes.
 *
 * It returns an array of event IDs.
 */

require 'database_connection.php';
require 'utility.php';

$calendar_id = $_GET['calendar_id'];
$year = $_GET['year'];
$month = $_GET['month'];
$date = $_GET['date'];
$timezone_offset_minutes = $_GET['timezone_offset_minutes'];

$timezone_offset_seconds = $timezone_offset_minutes * 60;

date_default_timezone_set('UTC');

// These mark the start and end of the given day:
$epoch_start = mktime(0, 0, 0, $month, $date, $year);
$epoch_end = $epoch_start + 24 * 60 * 60 - 1;

// Adjust the time values to take into account the timezone offset:
$epoch_start += $timezone_offset_seconds;
$epoch_end += $timezone_offset_seconds;

// Find the events:
$query = "
SELECT Event.Eid
FROM Event, Contains
WHERE Event.Eid = Contains.Eid AND Contains.Cid = $calendar_id AND ".
"Event.StartTime >= $epoch_start AND Event.StartTime <= $epoch_end";

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
} else {
    // printf("query successfully executed.\n");
}

$all_rows = $result->fetch_all();

$events = array();
$num_events = count($all_rows);
for ($i = 0; $i < $num_events; $i++) {
    array_push($events, $all_rows[$i][0]);
}
$json_result = $events;

output_json($json_result);

?>
