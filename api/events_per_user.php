<?php

/*
Returns the number of events created per user

Returns:
{
    aggregate: [
        {
            uid: <user id>
    		count: <number of event>	
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
SELECT Uid, COUNT(*)
FROM Event
GROUP BY Uid";

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
    $answer['count'] = $all_rows[$i][1];
    array_push($answers, $answer);
}
$json_result['aggregate'] = $answers;

output_json($json_result);

?>