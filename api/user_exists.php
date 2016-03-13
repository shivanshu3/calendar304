<?php

/*
Given a user id, it returns the following object based on whether
the user exists:

{
    exists: true/false
}
*/

require 'database_connection.php';
require 'utility.php';

$id = $_GET['id'];

// This will store the final result
$json_result = array();

// Get the number of users with the given ID
$query = "
SELECT COUNT(*)
FROM User
WHERE User.Uid = $id";

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
} else {
    // printf("query successfully executed.\n");
}

$all_rows = $result->fetch_all();

if ($all_rows[0][0] == 1) {
    $json_result['exists'] = true;
} else {
    $json_result['exists'] = false;
}

output_json($json_result);

?>
