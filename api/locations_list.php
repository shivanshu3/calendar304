<?php

/**
 * Get all locations in the Location table.
 *
 * It returns an array of locations where each location object looks like this:
 *
 * {
 *      RoomNo:
 *      MaxOcc:
 * }
 */

require 'database_connection.php';
require 'utility.php';

// This will store the final result
$json_result = array();

// Find the locations:
$query = "
SELECT *
FROM Location";

$result = mysqli_query($link, $query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
} else {
    // printf("query successfully executed.\n");
}

$all_rows = $result->fetch_all();

$locations = array();
$num_events = count($all_rows);
for ($i = 0; $i < $num_events; $i++) {
    $location = [];
    $location['RoomNo'] = $all_rows[$i][0];
    $location['MaxOcc'] = $all_rows[$i][1];
    array_push($locations, $location);
}
$json_result = $locations;

output_json($json_result);

?>
