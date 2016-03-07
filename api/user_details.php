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
printf("The mame ia %d\n", $user_id);

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
    printf("query successfully executed.\n");
}

$all_rows = $result->fetch_all();

// User does not exist?
if (count($all_rows) == 0) {
    echo json_encode($json_result);
    exit(0);
}

$json_result['id'] = $user_id;
$json_result['name'] = $all_rows[0][0];

echo json_encode($json_result);
exit(0);

$query = '
SELECT DISTINCT User.Name, Calendar.Cid, Calendar.Name
FROM Calendar, User
WHERE User.Uid = Calendar.Uid AND Calendar.Uid = 4
';

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
} else {
    printf("query successfully executed.\n");
}

$all_rows = $result->fetch_all();

$json_result['id'] = $user_id;
$json_result['name'] = $user_id;

print_r($all_rows);
//var_dump($all_rows);

echo $all_rows[0][0];

?>
