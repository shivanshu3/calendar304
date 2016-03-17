/**
 * EventUiManager is a singleton class which initializes the app.
 * It is a singleton class.
 */

var EventUiManager = function() {
    // Instance variables:
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
};
