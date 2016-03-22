<?php

/*
Used to change the "attending" status of an event for a user.

You need to give the user id and event id. You also need to give a boolean
"true"/"false" which will make the "attending" status true or false
respectively.

The returned object looks like the following:

{
    success: true/false
}
*/

require 'database_connection.php';
require 'utility.php';

$user_id = $_GET['user_id'];
$event_id = $_GET['event_id'];
$attending = $_GET['attending'];

// This will store the final result:
$json_result = array();

if ($attending == 'true') {
    $query = "
    INSERT INTO Attends (Uid, Eid)
    VALUES ('$user_id', '$event_id')";

    $result = mysqli_query($link, $query);
    if ($result === FALSE) {
        $error = mysqli_error($link);
        if (str_contains($error, 'Duplicate')) {
            // This just means that the entry already existed in
            // the table, which is fine.
        } else {
            printf("query could not be executed.\n");
            exit(1);
        }
    }
} else {
    $query = "
    DELETE FROM Attends
    WHERE Uid = '$user_id' AND Eid = '$event_id'";

    $result = mysqli_query($link, $query);
    if ($result === FALSE) {
        printf("query could not be executed.\n");
        exit(1);
    }
}

$json_result['success'] = true;
output_json($json_result);

?>

