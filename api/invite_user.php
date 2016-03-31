<?php

/*
 * Create an invitation for a user to an event
 *
 * The returned object looks like the following:
 * {
 *     success: true/false
 * }
 */

require 'database_connection.php';
require 'utility.php';

$user_id = $_GET['user_id'];
$event_id = $_GET['event_id'];

// This will store the final result:
$json_result = array();

$invite_user_query = "
INSERT INTO `Invite` (`Uid`, `Eid`)
VALUES ($user_id, $event_id)";

$result = mysqli_query($link, $invite_user_query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
}

$json_result['success'] = true;
output_json($json_result);

?>

