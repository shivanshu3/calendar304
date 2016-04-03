<?php

/*
 * Deletes an reminder
 *
 * The returned object looks like the following:
 * {
 *     success: true/false
 * }
 */

require 'database_connection.php';
require 'utility.php';

$r_id = $_GET['r_id'];
$u_id = $_GET['user_id'];

// This will store the final result:
$json_result = array();

// Delete the record from the Reminder table
$delete_reminder_query = "DELETE FROM Reminder WHERE Rid = '$r_id' AND Uid = '$u_id'";

$result = mysqli_query($link, $delete_reminder_query);
if ($result === FALSE) {
    printf("query could not be executed");
    $json_result['success'] = false;
    exit(1);
}

$json_result['success'] = true;
output_json($json_result);

?>
