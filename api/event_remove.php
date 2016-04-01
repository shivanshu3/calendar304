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

// Delete all the records from the Contains table
$remove_event_query = "
DELETE FROM `Contains` WHERE `Eid` = $event_id AND `Cid` = $calendar_id";

$result = mysqli_query($link, $remove_event_query);
if ($result === FALSE) {
    printf("query 1 could not be executed");
    exit(1);
}

// Remove any Attends entries for the event if it is no longer in any of the
// user's calendars
$remove_event_query = "
DELETE FROM `Attends` WHERE `Attends`.`Eid` = $event_id AND NOT EXISTS (
    SELECT * FROM `Contains`
    WHERE `Contains`.`Eid` = $event_id AND `Contains`.`Cid` IN (
        SELECT `Calendar`.`Cid` FROM `Calendar`
        WHERE `Calendar`.`Uid` IN (
            SELECT `Calendar2`.`Uid` FROM `Calendar` `Calendar2`
            WHERE `Calendar2`.`Cid` = $calendar_id
        )
    )   
)";

$result = mysqli_query($link, $remove_event_query);
if ($result === FALSE) {
    printf("query 2 could not be executed");
    exit(1);
}

$json_result['success'] = true;
output_json($json_result);

?>
