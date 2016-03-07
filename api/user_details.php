<?php

/*
Given a user id, it returns the following object:

{
    id: // the id you supplied
    name: // the full name of this user
    calendars: [
        {
            id: // id of the calendar
            name: // name of this calendar
        },
        {
            ...
        }
    ]
}

The returned object will be empty - with no keys if a user with the
given id does not exist.
*/

require 'database_connection.php';

$user_id = $_GET['id'];

// This will store the final result
$json_result = array();

// Get the user's name:
$query = '
SELECT DISTINCT User.Name
FROM User
WHERE User.Uid = '.$user_id;

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
} else {
    // printf("query successfully executed.\n");
}

$all_rows = $result->fetch_all();

// User does not exist?
if (count($all_rows) == 0) {
    echo json_encode($json_result);
    exit(0);
}

$json_result['id'] = $user_id;
$json_result['name'] = $all_rows[0][0];

// Get the calendars of a user:
$query = '
SELECT DISTINCT Calendar.Cid, Calendar.Name
FROM Calendar
WHERE Calendar.Uid = '.$user_id;

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
} else {
    // printf("query successfully executed.\n");
}

$all_rows = $result->fetch_all();

$calendars = array();
$num_rows = count($all_rows);
for ($i = 0; $i < $num_rows; $i++) {
    $calendar = array();
    $calendar['id'] = $all_rows[$i][0];
    $calendar['name'] = $all_rows[$i][1];
    array_push($calendars, $calendar);
}
$json_result['calendars'] = $calendars;

$json_result = json_encode($json_result);
header('Content-Type: application/json');
echo $json_result;

?>
