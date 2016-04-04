<?php

/*
Returns the list of users who are attending all events

Returns:
{
    uids: [
        {
            uid: <user id>
        },
        {
            ...
        }
    ]
}
*/

require 'database_connection.php';
require 'utility.php';

// This will store the final result
$json_result = array();

// This contains all the sql queries:
$queries = [];

// Run an aggregate query:
$query = "
SELECT Uid, Name
FROM User 
WHERE NOT Exists
    (SELECT *
        FROM Event 
            WHERE Not Exists
            (SELECT * FROM Attends
                WHERE Attends.Uid = User.Uid AND Event.Eid = Attends.Eid))";

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
}

$all_rows = $result->fetch_all();

$answers = array();
$num_rows = count($all_rows);

for ($i = 0; $i < $num_rows; $i++) {
    $answer = array();
    $answer['uid'] = $all_rows[$i][0];
    array_push($answers, $answer);
}
$json_result['uids'] = $answers;

output_json($json_result);

?>