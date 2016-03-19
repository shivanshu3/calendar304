<?php

/*
Used to edit the following fields of an event:

{
    name:
    start_time: // seconds since epoch
    duration: // seconds
    location: {
        room_no:
        max_occ:
    }
}

You need to give the event id so we know which event to edit.
You need to provide new values of start_time, duration, and room_no.

The returned object looks like the following:

{
    success: true/false
}
*/

?>
