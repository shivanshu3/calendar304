<?php

/*
 * Deletes a user
 *
 * The returned object looks like the following:
 *
 * {
 *     success: true/false
 * }
 */

require 'database_connection.php';
require 'utility.php';

$user_id = $_GET['user_id'];

// This will store the final result:
$json_result = array();

// Delete the record from the User table
$delete_user_query = "DELETE FROM `User` WHERE Uid = $user_id";

$result = mysqli_query($link, $delete_user_query);
if ($result === FALSE) {
    printf("query could not be executed");
    exit(1);
}

$json_result['success'] = true;
output_json($json_result);

?>
