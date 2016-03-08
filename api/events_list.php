<?php

/**
 * Get all events scheduled on a particular date.
 * The date is given as year, month, date.
 * Note: Month is specified as a number, where 1 corresponds to Jan.
 */

$year = $_GET['year'];
$month = $_GET['month'];
$date = $_GET['date'];

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

echo "Start: $epoch_start\n";
echo "Start: $epoch_end\n";


?>
