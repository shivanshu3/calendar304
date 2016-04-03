/**
 * EventUiManager is a singleton class which initializes the app.
 * It is a singleton class.
 */

var EventUiManager = function() {
    // Instance variables:
    this.eventDetails = null;
    this.rooms = null;
};

EventUiManager.singletonInstance = null;

/**
 * Returns the singleton instance of this class.
 */
EventUiManager.getInstance = function() {
    if (EventUiManager.singletonInstance == null) {
        EventUiManager.singletonInstance = new EventUiManager();
    }
    return EventUiManager.singletonInstance;
};

/**
 * Runs when the app loads.
 */
EventUiManager.prototype.init = function() {
    var _this = this;

    // If the user is not signed in, take them back to the
    // sign in/ sign up page:
    if (!Utility.userSignedIn()) {
        Utility.redirectSignIn(true);
        return;
    }

    // If the user has not selected a calendar, take them back to the
    // calendars page:
    if (!Utility.userSelectedCalendar()) {
        Utility.redirectCalendars();
        return;
    }

    // If the user has not selected a date, take them back to the
    // calendar page:
    if (!Utility.userSelectedDate()) {
        Utility.redirectCalendar(true);
        return;
    }

    // If the user has not selected an event, take them back to the
    // events page:
    if (!Utility.userSelectedEvent()) {
        Utility.redirectEvents(true);
        return;
    }

    // Register button click callbacks:
    $('#save_changes_button').click(function() {
        _this.saveChangesButtonClicked();
    });

    $('#remove_event_button').click(function() {
        _this.removeEventButtonClicked();
    });

    $('#delete_event_button').click(function() {
        _this.deleteEventButtonClicked();
    });

    $('#invite_user_button').click(function() {
        _this.inviteUserButtonClicked();
    });

    $('#delete_reminder_button').click(function() {
        _this.deleteReminderButtonClicked();
    });
    
    $('#save_reminder_button').click(function() {
        _this.saveReminderButtonClicked();
    });

    // Populate the event and reminder details in this instance:
    this.populateEventDetails();
    this.populateInviteCandidates();
    this.populateReminderDetails();
};

/**
 * Runs when save changes button is clicked.
 */
EventUiManager.prototype.saveChangesButtonClicked = function() {
    var nameBox = $('#event_name');
    var startTimeBox = $('#event_start_time');
    var durationBox = $('#event_duration');
    var roomNoDropdown = $('#event_room');

    var name = nameBox.val();
    var startTimeString = startTimeBox.val();
    var duration = durationBox.val();
    var roomNo = roomNoDropdown.val();

    var year = window.localStorage.year;
    var month = window.localStorage.month;
    var date = window.localStorage.date;

    var hours = startTimeString.split(':')[0];
    var minutes = startTimeString.split(':')[1];
    var startTime = Math.round(new Date(year, month-1, date, hours,
        minutes, 0, 0).getTime() / 1000);

    var updateEventRequest = $.get('../api/event_edit.php', {
        event_id: window.localStorage.event_id,
        name: name,
        start_time: startTime,
        duration: duration,
        room_no: roomNo,
    });

    // Keeps track of how many queries we have completed.
    // We need to complete 2 queries (event_edit and event_attend)
    // before we can refresh the page.
    var counter = 0;
    var saveQueryComplete = function() {
        counter++;
        if (counter == 2) {
            window.location.reload();
        }
    };

    updateEventRequest.done(function(data) {
        // Nothing needs to happen here.
    });

    updateEventRequest.fail(function(data) {
        alert('Could not save changes');
    });

    updateEventRequest.always(function() {
        saveQueryComplete();
    });

    // The "attending" status is saved by a different query:
    var attending = $('input[name=attending]:checked').attr('value') == 'Yes';

    var updateAttendingRequest = $.get('../api/event_attend.php', {
        user_id: window.localStorage.user_id,
        event_id: window.localStorage.event_id,
        attending: attending
    });

    updateAttendingRequest.done(function(data) {
        // Nothing needs to happen here.
    });

    updateAttendingRequest.fail(function(data) {
        alert('Could not save changes');
    });

    updateAttendingRequest.always(function() {
        saveQueryComplete();
    });
};

/**
 * Runs when remove event button is clicked.
 */
EventUiManager.prototype.removeEventButtonClicked = function() {
    var event_id = window.localStorage.event_id;
    var calendar_id = window.localStorage.user_calendar;

    var deleteEventRequest = $.get('../api/event_remove.php', {
        event_id: event_id,
        calendar_id: calendar_id
    });

    deleteEventRequest.done(function(data) {
        Utility.redirectEvents(false);
    });

    deleteEventRequest.fail(function(data) {
        alert('Event could not be deleted.');
    });
};

/**
 * Runs when delete event button is clicked.
 */
EventUiManager.prototype.deleteEventButtonClicked = function() {
    var _this = this;
    var event_id = window.localStorage.event_id;

    var deleteEventRequest = $.get('../api/event_delete.php', {id: event_id});

    deleteEventRequest.done(function(data) {
        Utility.redirectEvents(false);
    });

    deleteEventRequest.fail(function(data) {
        alert('Event could not be deleted.');
    });
};

/**
 * Runs when invite user button is clicked.
 */
EventUiManager.prototype.inviteUserButtonClicked = function() {
    var userDropdown = $('#user_select option:selected');
    var user_id = userDropdown.attr('user_id');
    var event_id = window.localStorage.event_id;

    var inviteUserRequest = $.get('../api/invite_user.php', {
        event_id: event_id,
        user_id: user_id
    });

    inviteUserRequest.done(function(data) {
        window.location.reload();
    });

    inviteUserRequest.fail(function(data) {
        alert('User could not be invited.');
    });
};

/**
 * Runs when delete reminder button is clicked.
 */
EventUiManager.prototype.deleteReminderButtonClicked = function() {
    var _this = this;

    // Its possible that reminder_id has not been set before if
    // delete reminder is pressed before save reminder. This is okay
    // as rid would be 'undefined' and since undefined is not in our
    // reminder table, the button press effectively does nothing
    var rid = window.localStorage.reminder_id;
    var uid = window.localStorage.user_id;

    var deleteReminderRequest = $.get('../api/reminder_delete.php', {r_id: rid, user_id: uid});

    deleteReminderRequest.done(function(data) {
        //Set back to undefined
        window.localStorage.reminder_id = (function(){return;})();
        window.location.reload();
    });

    deleteReminderRequest.fail(function(data) {
        alert('Reminder could not be deleted.');
    });
};

/**
 * Runs when reminder is set.
 */
EventUiManager.prototype.saveReminderButtonClicked = function() {
    var _this = this;

    var rid = window.localStorage.reminder_id;
    var uid = window.localStorage.user_id;
    var rValue = $('#reminder_date').val();
    var eid = window.localStorage.event_id;
    var setReminderRequest;
    var y = window.localStorage.year;
    var m = window.localStorage.month;
    var d = window.localStorage.date;
    var reminderDate = new Date(y,m-1,d);

    if(rValue === ""){
        return;
    }else if(rValue === "1d"){
        reminderDate.setDate(reminderDate.getDate() - 1);
    }else if(rValue === "2d") {
        reminderDate.setDate(reminderDate.getDate() - 2);
    }else if(rValue === "1w") {
        reminderDate.setDate(reminderDate.getDate() - 7);
    }else if(rValue === "1m") {
        reminderDate.setMonth(reminderDate.getMonth() - 1);
    }

    if(rid !== "undefined"){
       setReminderRequest = $.get('../api/reminder_edit.php', {
           reminder_id: rid,
           user_id: uid,
           type: 0,
           time: reminderDate.getTime()
       });
    }else{
        setReminderRequest = $.get('../api/reminder_create.php', {
            user_id: uid,
            type: 0,
            time: reminderDate.getTime(),
            event_id: eid
        });
     }

    setReminderRequest.done(function(data) {
        window.localStorage.reminder_id = data.id;
        window.location.reload();
    });

    setReminderRequest.fail(function(data) {
        alert('Reminder could not be deleted.');
    });
};

/**
 * Downloads the reminders  from the server and stores them in this
 * instance.
 */
EventUiManager.prototype.populateReminderDetails = function() {
    var _this = this;
    var eid = window.localStorage.event_id;
    var uid = window.localStorage.user_id;

    var eventDetailsRequest = $.get('../api/reminder_details.php', {
        event_id: eid,
        user_id: uid
    });

    eventDetailsRequest.done(function(data) {
        window.localStorage.reminder_id = data.rid;
        var y = window.localStorage.year;
        var m = window.localStorage.month;
        var d = window.localStorage.date;
        var currentDate = new Date(y,m-1,d);
        var reminderDate = new Date(parseInt(data.time));

        // Caclualte difference in days
        var _MS_PER_DAY = 1000 * 60 * 60 * 24;
        var utc1 = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        var utc2 = Date.UTC(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
        var diff = Math.abs(Math.floor((utc2 - utc1) / (1000*60*60*24)));

        var dateBox = $('#reminder_date');

        if(diff === 1){
            dateBox.val("1d");
        }else if(diff === 2){
            dateBox.val("2d");
        }else if(diff === 7){
            dateBox.val("1w");
        }else if(diff >= 29){
            dateBox.val("1m");
        }else{
            dateBox.val("");
        }
    });

    eventDetailsRequest.fail(function(data) {
        alert('Event details could not be downloaded.');
    });
};

/**
 * Downloads the event details from the server and stores them in this
 * instance.
 */
EventUiManager.prototype.populateEventDetails = function() {
    var _this = this;
    var event_id = window.localStorage.event_id;

    var eventDetailsRequest = $.get('../api/event_details.php', {id: event_id});

    eventDetailsRequest.done(function(data) {
        _this.eventDetails = data;
        _this.showEventDetails();
    });

    eventDetailsRequest.fail(function(data) {
        alert('Event details could not be downloaded.');
    });
};

/**
 * Shows the event details on the page. Uses the event details stored
 * in this instance.
 */
EventUiManager.prototype.showEventDetails = function() {
    var nameBox = $('#event_name');
    var startTimeBox = $('#event_start_time');
    var durationBox = $('#event_duration');
    var roomNoDropdown = $('#event_room');

    var startTimeObject = new Date(Number(this.eventDetails.start_time * 1000));
    var startTimeHours = startTimeObject.getHours();
    var startTimeMinutes = startTimeObject.getMinutes();
    var startTimeHoursString = (startTimeHours < 10) ?
        ('0' + startTimeHours.toString()) : startTimeHours.toString();
    var startTimeMinutesString = (startTimeMinutes < 10) ?
        ('0' + startTimeMinutes.toString()) : startTimeMinutes.toString();
    var startTimeString = startTimeHoursString + ':' + startTimeMinutesString;

    nameBox.val(this.eventDetails.name);
    startTimeBox.val(startTimeString);
    durationBox.val(this.eventDetails.duration);

    // Determine whether this user is attending this event:
    var attending = false;
    for (var i = 0; i < this.eventDetails.users.length; i++) {
        var user = this.eventDetails.users[i];
        if (user.id == window.localStorage.user_id) {
            attending = true;
            break;
        }
    }

    // Show the "attending" status of this user in the radio buttons:
    if (attending) {
        $('input[name=attending][value=Yes]').prop('checked', true);
    } else {
        $('input[name=attending][value=No]').prop('checked', true);
    }

    // Show the proportion of users attending versus invited
    var numAttending = $('#num_attending_invited');
    var numString = this.eventDetails.num_invited + " invited, " +
        this.eventDetails.num_attending + " attending";
    if (this.eventDetails.num_pending > 0) {
        numString = numString + ", " + this.eventDetails.num_pending +
            " pending";
    }
    numAttending.text(numString);

    // Get the attending users
    var usersList = $('#attending_users_div ul');
    usersList.empty();

    for (var i = 0; i < this.eventDetails.users.length; i++) {
        var user = this.eventDetails.users[i];
        var userBullet = $('<li>' + user.name + '</li>');
        usersList.append(userBullet);
    }

    this.populateRooms();
};

/**
 * Populates the user dropdown for invitations
 */
EventUiManager.prototype.populateInviteCandidates = function() {
    var _this = this;
    var event_id = window.localStorage.event_id;

    var candidatesRequest = $.get('../api/invite_candidates.php', {
        event_id: event_id
    });

    candidatesRequest.done(function(data) {
        var usersDropdown = $('#user_select');
        usersDropdown.empty();

        for (var i = 0; i < data.length; i++) {
            var user = data[i];
            var userItem = $('<option>');
            userItem.attr('user_id', user.id);
            userItem.text(user.id + ' - ' + user.name);
            usersDropdown.append(userItem);
        }
    });

    candidatesRequest.fail(function(data) {
        alert('Invite candidates could not be downloaded.');
    });
}

/**
 * Gets the room numbers from the server and stores them in this instance.
 */
EventUiManager.prototype.populateRooms = function() {
    var _this = this;
    var roomsRequest = $.get('../api/locations_list.php');

    roomsRequest.done(function(data) {
        _this.rooms = data;
        _this.showRooms();
    });

    roomsRequest.fail(function(data) {
        alert('Could not download rooms');
    });
};

/**
 * Fills the room numbers in the dropdown, and then selects the one
 * which is in the event.
 */
EventUiManager.prototype.showRooms = function() {
    var roomsDropdown = $('#room_div select');
    roomsDropdown.empty();

    for (var i = 0; i < this.rooms.length; i++) {
        var room = this.rooms[i];
        var roomItem = $('<option>' + room.RoomNo + '</option>');
        roomsDropdown.append(roomItem);
    }

    // Select the event room number:
    roomsDropdown.val(this.eventDetails.location.room_no);
};
