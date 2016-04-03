<?php
/*
 * Edits the time and type of a reminder
 *
 * The returned object looks like the following:
 * {
 *     success: true/false
 * }
 */

require 'database_connection.php';
require 'utility.php';

$r_id = $_GET['reminder_id'];
$u_id = $_GET['user_id'];
$type = $_GET['type'];
$time = $_GET['time'];


// This will store the final result
$json_result = array();

$reminder_edit_query = "
UPDATE Reminder
SET Type = '$type', Time = '$time'
WHERE Uid = '$u_id' AND Rid = '$r_id'";

$result = mysqli_query($link, $reminder_edit_query);
if ($result === FALSE) {
	printf("query could not be executed.\n");
	exit(1);
}

$json_result['success'] = true;
output_json($json_result);

?>
