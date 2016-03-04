<?php

// Host, username, password, database name
$link = mysqli_connect("localhost", "calendar304", "calendar304",
    "calendar304");

// Check connection:
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit(1);
}

?>
