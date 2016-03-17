/**
 * EventUiManager is a singleton class which initializes the app.
 * It is a singleton class.
 */

var EventUiManager = function() {
    // Instance variables:
    this.eventDetails = null;
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

    // Populate the event details in this instance:
    this.populateEventDetails();
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
    });

    eventDetailsRequest.fail(function(data) {
        alert('Event details could not be downloaded.');
    });
};
