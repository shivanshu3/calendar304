<?php

/*
 * Adds an event to a calendar, removes any invites to the event for the
 * calendar's owner
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

// Add a record to the Contains table
$event_add_query = "
INSERT INTO `Contains` (`Cid`, `Eid`)
VALUES ($calendar_id, $event_id)";

$result = mysqli_query($link, $event_add_query);
if ($result === FALSE) {
    printf("query 1 could not be executed.\n");
    exit(1);
}

// Remove any pending invites for this calendar's owner
$event_add_query = "
DELETE FROM `Invite` WHERE `Uid` IN (
    SELECT DISTINCT `Calendar`.`Uid`
    FROM `Calendar`
    WHERE `Calendar`.`Cid` = $calendar_id
) AND `Eid` = $event_id";

$result = mysqli_query($link, $event_add_query);
if ($result === FALSE) {
    printf("query 2 could not be executed.\n");
    exit(1);
}

$json_result['success'] = true;
output_json($json_result);

?>

