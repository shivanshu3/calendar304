<?php

/* Delete a calendar, given its calendar id
 * 
 * The returned object looks like the following:
 * 
 * {
 *     success: true/false
 * }
 */

require 'database_connection.php';
require 'utility.php';

$calendar_id = $_GET['calendar_id'];

// This will store the final result:
$json_result = array();

// Delete the record from the Calendar table
$delete_calendar_query = "DELETE FROM `Calendar` WHERE `Cid` = $calendar_id";

$result = mysqli_query($link, $delete_calendar_query);
if ($result === FALSE) {
    printf("query  could not be executed.\n");
    exit(1);
}

$json_result['success'] = true;
output_json($json_result);

?>
