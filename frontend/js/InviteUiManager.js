/**
 * InviteUiManager is a singleton class which initializes the app.
 * It is a singleton class.
 */

var InviteUiManager = function() {
    // Instance variables:
    this.eventDetails = null;
    this.calendars = null;
};

InviteUiManager.singletonInstance = null;

/**
 * Returns the singleton instance of this class.
 */
InviteUiManager.getInstance = function() {
    if (InviteUiManager.singletonInstance == null) {
        InviteUiManager.singletonInstance = new InviteUiManager();
    }
    return InviteUiManager.singletonInstance;
};

/**
 * Runs when the app loads.
 */
InviteUiManager.prototype.init = function() {
    var _this = this;

    // If the user is not signed in, take them back to the
    // sign in/ sign up page:
    if (!Utility.userSignedIn()) {
        Utility.redirectSignIn();
        return;
    }

    // If the user has not selected an event, take them back to the
    // events page:
    if (!Utility.userSelectedEvent()) {
        Utility.redirectEvents(true);
        return;
    }

    // Register button click callbacks:
    $('#accept_button').click(function() {
        _this.acceptButtonClicked();
    });

    $('#decline_button').click(function() {
        _this.declineButtonClicked();
    });

    // Populate the event details in this instance:
    this.populateEventDetails();
};

/**
 * Runs when accept button is clicked.
 */
InviteUiManager.prototype.acceptButtonClicked = function() {
    var calendarDropdown = $('#calendar_select');
    var calendar = calendarDropdown.val();

    var updateEventRequest = $.get('../api/event_add.php', {
        event_id: window.localStorage.event_id,
        calendar_id: calendar
    });

    updateEventRequest.done(function(data) {
        Utility.redirectCalendars(false);
    });

    updateEventRequest.fail(function(data) {
        alert('Could not save changes');
    });
};

/**
 * Runs when decline button is clicked.
 */
InviteUiManager.prototype.declineButtonClicked = function() {
    var updateEventRequest = $.get('../api/invite_delete.php', {
        event_id: window.localStorage.event_id,
        user_id: window.localStorage.user_id
    });

    updateEventRequest.done(function(data) {
        Utility.redirectCalendars(false);
    });

    updateEventRequest.fail(function(data) {
        alert('Could not save changes');
    });
};

/**
 * Downloads the event details from the server and stores them in this
 * instance.
 */
InviteUiManager.prototype.populateEventDetails = function() {
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
InviteUiManager.prototype.showEventDetails = function() {
    var nameText = $('#event_name');
    var startTimeText = $('#event_start_time');
    var durationText = $('#event_duration');
    var roomNoText = $('#event_room');

    var startTimeObject = new Date(Number(this.eventDetails.start_time * 1000));
    var startTimeHours = startTimeObject.getHours();
    var startTimeMinutes = startTimeObject.getMinutes();
    var startTimeHoursString = (startTimeHours < 10) ?
        ('0' + startTimeHours.toString()) : startTimeHours.toString();
    var startTimeMinutesString = (startTimeMinutes < 10) ?
        ('0' + startTimeMinutes.toString()) : startTimeMinutes.toString();
    var startTimeString = startTimeHoursString + ':' + startTimeMinutesString;

    nameText.text(this.eventDetails.name);
    startTimeText.text(startTimeString);
    durationText.text(this.eventDetails.duration);
    roomNoText.text(this.eventDetails.location.room_no);

    this.populateCalendars();
};

/**
 * Gets the calendar numbers from the server and stores them in this instance.
 */
InviteUiManager.prototype.populateCalendars = function() {
    var _this = this;
    var calendarsRequest = $.get('../api/user_details.php', {
        id: window.localStorage.user_id
    });

    calendarsRequest.done(function(data) {
        _this.calendars = data.calendars;
        _this.showCalendars();
    });

    calendarsRequest.fail(function(data) {
        alert('Could not download calendars');
    });
};

/**
 * Fills the calendar numbers in the dropdown
 */
InviteUiManager.prototype.showCalendars = function() {
    var calendarsDropdown = $('#basic_details_div select');
    calendarsDropdown.empty();

    for (var i = 0; i < this.calendars.length; i++) {
        var calendar = this.calendars[i];
        var calendarItem = $('<option>' + calendar.id + '</option>');
        calendarsDropdown.append(calendarItem);
    }
};
