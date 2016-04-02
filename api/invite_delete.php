<?php

/*
 * Deletes an invitation
 *
 * The returned object looks like the following:
 * {
 *     success: true/false
 * }
 */

require 'database_connection.php';
require 'utility.php';

$event_id = $_GET['event_id'];
$user_id = $_GET['user_id'];

// This will store the final result:
$json_result = array();

// Delete the record from the Invite table
$delete_invite_query = "
DELETE FROM `Invite`
WHERE `Eid` = $event_id AND `Uid` = $user_id";

$result = mysqli_query($link, $delete_invite_query);
if ($result === FALSE) {
    printf("query could not be executed");
    exit(1);
}

$json_result['success'] = true;
output_json($json_result);

?>
