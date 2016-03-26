<?php

/*
Given a calendar id, it returns the following object:

{
    id: // the id you supplied
    name: // the full name of this user
    user_id: // the id of the user who owns this calendar
}

The returned object will be empty - with no keys if a calendar with the
given id does not exist.
*/

require 'database_connection.php';
require 'utility.php';

$id = $_GET['id'];

// This will store the final result
$json_result = array();

// Get the calendar details:
$query = "
SELECT DISTINCT *
FROM Calendar
WHERE Cid = $id";

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
}

$all_rows = $result->fetch_all();

// Calendar does not exist?
if (count($all_rows) == 0) {
    output_json($json_result);
    exit(0);
}

$json_result['id'] = $id;
$json_result['name'] = $all_rows[0][1];
$json_result['user_id'] = $all_rows[0][2];

output_json($json_result);

?>
