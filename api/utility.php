<?php

/**
 * Given a PHP array, it encodes it to JSON and outputs it.
 * Also sends the JSON header.
 * This must be the very first output of this program.
 * And hopefully the last one too.
 */
function output_json($php_array) {
    header('Content-Type: application/json');
    echo json_encode($php_array);
}

?>
