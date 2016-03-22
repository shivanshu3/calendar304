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
    var _this = this;
    var calName = $('#create_calendar_div input').val();

    var createCalendarRequest = $.get('../api/calendar_create.php', {
        name: calName,
        user_id: window.localStorage.user_id
    });

    createCalendarRequest.done(function(data) {
        window.location.reload();
    });

    createCalendarRequest.fail(function(data) {
        alert('Could not create a new calendar!');
    });
};

/**
 * Populates the user's calendars in this instance.
 */
CalsUiManager.prototype.populateUserCalendars = function() {
    var _this = this;
    var user_id = window.localStorage.user_id;

    var userDetailsRequest = $.get('../api/user_details.php', {id: user_id});

    userDetailsRequest.done(function(data) {
        _this.userDetails = data;
        _this.showUserCalendars();
    });

    userDetailsRequest.fail(function(data) {
        alert('Could not retrieve user details.');
    });
};

/**
 * Shows the user's calendars on the page.
 */
CalsUiManager.prototype.showUserCalendars = function() {
    var _this = this;
    var calsList = $('#existing_calendars_div ul');
    calsList.empty();

    for (var i = 0; i < this.userDetails.calendars.length; i++) {
        var calendar = this.userDetails.calendars[i];
        var calendarBullet = $('<li> <a href = "javascript:void(0)">' +
                calendar.name + '</a> </li>');
        // Register the click callback in a self executing anonymous
        // function because we want the calendar id to be stored in this
        // function's closure.
        (function() {
            var cal_id = calendar.id;
            calendarBullet.click(function() {
                _this.calendarClicked(cal_id);
            });
        })();
        calsList.append(calendarBullet);
    }

    // Show user's name and ID:
    $('#user_name').text(this.userDetails.name);
    $('#user_id').text(this.userDetails.id);
};

/**
 * Runs when a calendar item is clicked.
 */
CalsUiManager.prototype.calendarClicked = function(cal_id) {
    // Store the calendar id in local storage
    window.localStorage.user_calendar = cal_id;

    // Find the name of this calendar:
    var calName = '';
    for (var i = 0; i < this.userDetails.calendars.length; i++) {
        var calendar = this.userDetails.calendars[i];
        if (calendar.id == cal_id) {
            calName = calendar.name;
            break;
        }
    }

    // Store the calendar name in local storage:
    window.localStorage.calendar_name = calName;

    // Redirect to the calendar page:
    Utility.redirectCalendar(false);
};
