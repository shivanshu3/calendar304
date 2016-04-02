<?php

/**
 * Get details of a reminder, given the reminder id and user id.

{
    rid: // the reminder id supplied
    uid: // the user id supplied
    type: 
    time:
    eid:

}

The returned object will be empty - with no keys if an event with the
given rid and uid does not exist.
*/

require 'database_connection.php';
require 'utility.php';

$e_id = $_GET['event_id'];
$u_id = $_GET['user_id'];

// This will store the final result
$json_result = array();

$query = "
    SELECT *
    FROM Reminder
    WHERE Eid = '$e_id' AND Uid = '$u_id'";

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
}

$all_rows = $result->fetch_all();

// Event does not exist?
if (count($all_rows) == 0) {
    output_json($json_result);
    exit(0);
}

// Constructing the json object:
$json_result['rid'] = $all_rows[0][0];
$json_result['uid'] = $all_rows[0][1];
$json_result['type'] = $all_rows[0][2];
$json_result['time'] = $all_rows[0][3];
$json_result['eid'] = $all_rows[0][4];

output_json($json_result);

?>
