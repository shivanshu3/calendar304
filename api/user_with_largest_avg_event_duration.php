<?php

/*
Returns the number of events created per user

Returns:
{
    uid: <user id>
	avg: <avg duration of event by user>	
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
SELECT Uid, MAX(avg_duration)
FROM 
    (SELECT Uid, AVG(Duration) AS avg_duration
        FROM Event
        GROUP BY Uid) AS A";

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
}

$all_rows = $result->fetch_all();
$json_result['uid'] = $all_rows[0][0];
$json_result['avg_duration'] = $all_rows[0][1];

output_json($json_result);

?>