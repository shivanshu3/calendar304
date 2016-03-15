/**
 * EventsUiManager is a singleton class which initializes the app.
 * It is a singleton class.
 */

var EventsUiManager = function() {
    // Instance variables:
    this.events = null;
};

EventsUiManager.singletonInstance = null;

/**
 * Returns the singleton instance of this class.
 */
EventsUiManager.getInstance = function() {
    if (EventsUiManager.singletonInstance == null) {
        EventsUiManager.singletonInstance = new EventsUiManager();
    }
    return EventsUiManager.singletonInstance;
};

/**
 * Runs when the app loads.
 */
EventsUiManager.prototype.init = function() {
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

    // Register a callback for the event create button:
    $('#create_event_div button').click(function() {
        _this.createEventClicked();
    });

    this.populateEvents();
};

/**
 * Runs when the create event button is clicked.
 */
EventsUiManager.prototype.createEventClicked = function() {
};

/**
 * Populates the events in this instance.
 */
EventsUiManager.prototype.populateEvents = function() {
    var _this = this;
    var timezoneOffset = (new Date()).getTimezoneOffset();

    var getEventsRequest = $.get('../api/events_list.php', {
        calendar_id: window.localStorage.user_calendar,
        year: window.localStorage.year,
        month: window.localStorage.month,
        date: window.localStorage.date,
        timezone_offset_minutes: timezoneOffset
    });

    getEventsRequest.done(function(data) {
        _this.events = data;
    });

    getEventsRequest.fail(function(data) {
        alert('Could not download events for this day.');
    });
};

/**
 * Shows the events on the page.
 */
EventsUiManager.prototype.showEvents = function() {
};

/**
 * Runs when an event is clicked.
 */
EventsUiManager.prototype.eventClicked = function(cal_id) {
};
