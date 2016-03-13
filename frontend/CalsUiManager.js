/**
 * CalsUiManager is a singleton class which initializes the app.
 * It is a singleton class.
 */

var CalsUiManager = function() {
    // Instance variables:
    this.userDetails = null;
};

CalsUiManager.singletonInstance = null;

/**
 * Returns the singleton instance of this class.
 */
CalsUiManager.getInstance = function() {
    if (CalsUiManager.singletonInstance == null) {
        CalsUiManager.singletonInstance = new CalsUiManager();
    }
    return CalsUiManager.singletonInstance;
};

/**
 * Runs when the app loads.
 */
CalsUiManager.prototype.init = function() {
    var _this = this;

    // If the user is not signed in, take them back to the
    // sign in/ sign up page:
    if (!Utility.userSignedIn()) {
        Utility.redirectSignIn();
        return;
    }

    // Register a callback for the calendar create button:
    $('#create_calendar_div button').click(function() {
        _this.createCalendarClicked();
    });

    this.populateUserCalendars();
};

/**
 * Runs when the create calendar button is clicked.
 */
CalsUiManager.prototype.createCalendarClicked = function() {
    console.log('button clicked.');
};

/**
 * Populates the user's calendars on the page.
 */
CalsUiManager.prototype.populateUserCalendars = function() {
    var _this = this;
    var user_id = window.localStorage.user_id;

    var userDetailsRequest = $.get('../api/user_details.php', {id: user_id});

    userDetailsRequest.done(function(data) {
        _this.userDetails = data;
    });

    userDetailsRequest.fail(function(data) {
        alert('Could not retrieve user details.');
    });
};
