<?php

/**
 * Get all events scheduled on a particular date.
 * The date is given as year, month, date.
 * Note: Month is specified as a number, where 1 corresponds to Jan.
 * Note: This script ignores the duration of events. For example, if an event
 * is so long that it continues till the next day, and that next day is
 * passed to this script, then that event will not be returned.
 *
 * It returns an array of event IDs.
 */

require 'database_connection.php';
require 'utility.php';

$year = $_GET['year'];
$month = $_GET['month'];
$date = $_GET['date'];
$timezone_offset_minutes = $_GET['timezone_offset_minutes'];

$timezone_offset_seconds = $timezone_offset_minutes * 60;

date_default_timezone_set('UTC');

switch ($month) {
    case 1:
        $month = "January";
        break;
    case 2:
        $month = "February";
        break;
    case 3:
        $month = "March";
        break;
    case 4:
        $month = "April";
        break;
    case 5:
        $month = "May";
        break;
    case 6:
        $month = "June";
        break;
    case 7:
        $month = "July";
        break;
    case 8:
        $month = "August";
        break;
    case 9:
        $month = "September";
        break;
    case 10:
        $month = "October";
        break;
    case 11:
        $month = "November";
        break;
    case 12:
        $month = "December";
        break;
    default:
        assert(false);
}

// These mark the start and end of the given day:
$epoch_start = strtotime("$date $month $year");
$epoch_end = $epoch_start + 24 * 60 * 60 - 1;

// Adjust the time values to take into account the timezone offset:
$epoch_start -= $timezone_offset_seconds;
$epoch_end -= $timezone_offset_seconds;

// Find the events:
$query = "
SELECT Event.Eid
FROM Event
WHERE Event.StartTime > $epoch_start AND Event.StartTime < $epoch_end";

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
