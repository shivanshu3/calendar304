<?php

/*
 * Edits the name of a user, given its user id and a new name
 *
 * The returned object looks like the following:
 * {
 *     success: true/false
 * }
 */

require 'database_connection.php';
require 'utility.php';

$user_id = $_GET['user_id'];
$name = $_GET['name'];

// This will store the final result
$json_result = array();

$user_edit_query = "
UPDATE `User`
SET `Name` = '$name'
WHERE `Uid` = $user_id";

$result = mysqli_query($link, $user_edit_query);
if ($result === FALSE) {
	printf("query could not be executed.\n");
	exit(1);
}

$json_result['success'] = true;
output_json($json_result);

?>
