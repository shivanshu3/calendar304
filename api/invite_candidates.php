<?php

/**
 * Get all users who do not have access to an event
 *
 * It returns an array of user where each user object looks like this:
 * {
 *      id:
 *      name:
 * }
 */

require 'database_connection.php';
require 'utility.php';

$event_id = $_GET['event_id'];

// This will store the final result
$json_result = array();

// Find the locations:
$query = "
SELECT `User`.`Uid`, `User`.`Name` FROM `User`
WHERE NOT EXISTS (
    SELECT * FROM `Contains`
    WHERE `Contains`.`Cid` IN (
        SELECT `Calendar`.`Cid` FROM `Calendar`
        WHERE `Calendar`.`Uid` = `User`.`Uid`
    )
    AND `Contains`.`Eid` = $event_id
)
AND NOT EXISTS (
    SELECT * FROM `Invite`
    WHERE `Invite`.`Uid` = `User`.`Uid`
    AND `Invite`.`Eid` = $event_id
)";

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
}

$all_rows = $result->fetch_all();

$users = array();
$num_users = count($all_rows);
for ($i = 0; $i < $num_users; $i++) {
    $user = [];
    $user['id'] = $all_rows[$i][0];
    $user['name'] = $all_rows[$i][1];
    array_push($users, $user);
}
$json_result = $users;

output_json($json_result);

?>
