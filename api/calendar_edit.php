<?php

/*
 * Edits the name of a calendar, given its calendar id and a new name
 *
 * The returned object looks like the following:
 * {
 *     success: true/false
 * }
 */

require 'database_connection.php';
require 'utility.php';

$calendar_id = $_GET['calendar_id'];
$name = $_GET['name'];

// This will store the final result
$json_result = array();

$calendar_edit_query = "
UPDATE `Calendar`
SET `Name` = '$name'
WHERE `Cid` = $calendar_id";

$result = mysqli_query($link, $calendar_edit_query);
if ($result === FALSE) {
	printf("query could not be executed.\n");
	exit(1);
}

$json_result['success'] = true;
output_json($json_result);

?>
