<?php

/*
 * 
 *
 * The returned object looks like the following:
 * {
 *     success: true/false
 * }
 */

require 'database_connection.php';
require 'utility.php';

$field = $_GET['field'];

// This will store the final result:
$json_result = array();

$something_query = "$field";

$result = mysqli_query($link, $something_query);
if ($result === FALSE) {
    printf("query could not be executed.\n");
    exit(1);
}

$json_result['success'] = true;
output_json($json_result);

?>

