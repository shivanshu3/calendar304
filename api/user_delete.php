<?php

/*
 * Deletes a user. Also removes all of their records in Calendar, and any
 * associated Contains records. Additionally removes all of their records
 * in  Reminds, and any associated Reminder records.
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

// Remove all records from the Contains table which were associated with this
// user's calendars.
$delete_user_query = "
DELETE FROM `Contains` WHERE `Contains`.`Cid` IN (
    SELECT DISTINCT `Calendar`.`Cid`
    FROM `Calendar`
    WHERE `Calendar`.`Uid` = $user_id
)";

$result = mysqli_query($link, $delete_user_query);
if ($result === FALSE) {
    printf("query 1 could not be executed");
    exit(1);
}

// Delete all the records from the Calendar table that match user_id
$delete_user_query = "DELETE FROM `Calendar` WHERE `Uid` = $user_id";

$result = mysqli_query($link, $delete_user_query);
if ($result === FALSE) {
    printf("query 2 could not be executed");
    exit(1);
}

// Remove all records from the Reminder table which were reminders for
// this user.
$delete_user_query = "
DELETE FROM `Reminder` WHERE `Reminder`.`Rid` IN (
    SELECT DISTINCT `Reminds`.`Rid`
    FROM `Reminds`
    WHERE `Reminds`.`Uid` = $user_id
)";

$result = mysqli_query($link, $delete_user_query);
if ($result === FALSE) {
    printf("query 3 could not be executed");
    exit(1);
}

// Delete all the records from the Reminds table that match user_id
$delete_user_query = "DELETE FROM `Reminds` WHERE Uid = $user_id";

$result = mysqli_query($link, $delete_user_query);
if ($result === FALSE) {
    printf("query 4 could not be executed");
    exit(1);
}

// Delete all the records from the Attends table that match user_id
$delete_user_query = "DELETE FROM `Attends` WHERE `Uid` = $user_id";

$result = mysqli_query($link, $delete_user_query);
if ($result === FALSE) {
    printf("query 5 could not be executed");
    exit(1);
}

// Finally, delete the record from the User table
$delete_user_query = "DELETE FROM `User` WHERE Uid = $user_id";

$result = mysqli_query($link, $delete_user_query);
if ($result === FALSE) {
    printf("query 6 could not be executed");
    exit(1);
}

$json_result['success'] = true;
output_json($json_result);

?>
