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
        Utility.redirectSignIn();
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

    $('#delete_event_button').click(function() {
        _this.deleteEventButtonClicked();
    });

    // Populate the event details in this instance:
    this.populateEventDetails();
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

    var hours = startTimeString.split(':')[0];
    var minutes = startTimeString.split(':')[1];
    var startTime = Math.round(new Date(year, month-1, date, hours,
        minutes, 0, 0).getTime() / 1000);

    var updateEventRequest = $.get('../api/event_create.php', {
        event_id: window.localStorage.event_id,
        name: name,
        start_time: startTime,
        duration: duration,
        room_no: roomNo,
    });

    updateEventRequest.done(function(data) {
        window.location.reload();
    });

    updateEventRequest.fail(function(data) {
        alert('Could not save changes');
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

    this.populateRooms();
};

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
    var roomsDropdown = $('#basic_details_div select');
    roomsDropdown.empty();

    for (var i = 0; i < this.rooms.length; i++) {
        var room = this.rooms[i];
        var roomItem = $('<option>' + room.RoomNo + '</option>');
        roomsDropdown.append(roomItem);
    }

    // Select the event room number:
    roomsDropdown.val(this.eventDetails.location.room_no);
};
