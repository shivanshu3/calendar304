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
        Utility.redirectSignIn(true);
        return;
    }

    // Register a callback for the calendar create button:
    $('#create_calendar_div button').click(function() {
        _this.createCalendarClicked();
    });

    // Register a callback for the delete user button:
    $('#delete_user').click(function() {
        _this.deleteUserClicked();
    });

    // Register a callback for the save name button:
    $('#save_name').click(function() {
        _this.saveNameClicked();
    });

    this.populateUserDetails();
};

/**
 * Runs when the save name button is clicked.
 */
CalsUiManager.prototype.saveNameClicked = function() {
    var name = $('#user_name').val();

    var saveNameRequest = $.get('../api/user_edit.php', {
        user_id: window.localStorage.user_id,
        name: name
    });

    saveNameRequest.done(function(data) {
        window.location.reload();
    });

    saveNameRequest.fail(function(data) {
        alert('Could not save name!');
    });
};

/**
 * Runs when the delete user button is clicked.
 */
CalsUiManager.prototype.deleteUserClicked = function() {
    var _this = this;

    var deleteUserRequest = $.get('../api/user_delete.php', {
        user_id: window.localStorage.user_id
    });

    deleteUserRequest.done(function(data) {
        Utility.redirectSignIn(false);
    });

    deleteUserRequest.fail(function(data) {
        alert('Could not delete user!');
    });
};

/**
 * Runs when the create calendar button is clicked.
 */
CalsUiManager.prototype.createCalendarClicked = function() {
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
 * Populates the user's details in this instance.
 */
CalsUiManager.prototype.populateUserDetails = function() {
    var _this = this;
    var user_id = window.localStorage.user_id;

    var userDetailsRequest = $.get('../api/user_details.php', {
        id: user_id,
        cur_time: Date.now()
    });

    userDetailsRequest.done(function(data) {
        _this.userDetails = data;
        _this.showUserDetails();
    });

    userDetailsRequest.fail(function(data) {
        alert('Could not retrieve user details.');
    });
};

/**
 * Shows the user's details on the page.
 */
CalsUiManager.prototype.showUserDetails = function() {
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

    var eventsList = $('#owned_events_div ul');
    eventsList.empty();

    for (var i = 0; i < this.userDetails.events.length; i++) {
        var theEvent = this.userDetails.events[i];
        var eventBullet = $('<li> <a href = "javascript:void(0)">' +
                theEvent.name + '</a> </li>');
        // Register the click callback in a self executing anonymous
        // function because we want the calendar id to be stored in this
        // function's closure.
        (function() {
            var event_id = theEvent.id;
            eventBullet.click(function() {
                _this.eventClicked(event_id);
            });
        })();
        eventsList.append(eventBullet);
    }

    var invitesList = $('#pending_invites_div ul');
    invitesList.empty();

    for (var i = 0; i < this.userDetails.invites.length; i++) {
        var invite = this.userDetails.invites[i];
        var inviteBullet = $('<li> <a href = "javascript:void(0)">' +
                invite.name + '</a> </li>');
        // Register the click callback in a self executing anonymous
        // function because we want the event id to be stored in this
        // function's closure.
        (function() {
            var event_id = invite.id;
            inviteBullet.click(function() {
                _this.inviteClicked(event_id);
            });
        })();
        invitesList.append(inviteBullet);
    }

    var remindersList = $('#reminders_div ul');
    remindersList.empty();

    for (var i = 0; i < this.userDetails.reminders.length; i++) {
        var reminder = this.userDetails.reminders[i];
        var reminderBullet = $('<li> Reminder for <a href = "javascript:void(0)">' +
                reminder.name +'</a> activated on ' + new Date(parseInt(reminder.time)).toDateString() + '</li> ');
        // Register the click callback in a self executing anonymous
        // function because we want the event id to be stored in this
        // function's closure.
        (function() {
            var event_id = reminder.eid;
            reminderBullet.click(function() {
                _this.reminderClicked(event_id);
            });
        })();
        remindersList.append(reminderBullet);

        // If the type of the reminder is 1, display an alert
        if(reminder.type === "1"){
            window.alert("Reminder you have the following event coming up:\n\n" + reminder.name + "\n\n");
        }
    }

    // Show user's name and ID:
    $('#user_name').val(this.userDetails.name);
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

    // Redirect to the calendar page:
    Utility.redirectCalendar(false);
};

/**
 * Runs when an event item is clicked.
 */
CalsUiManager.prototype.eventClicked = function(event_id) {
    window.localStorage.event_id = event_id;
    Utility.redirectEvent(false);
};

/**
 * Runs when an invite item is clicked.
 */
CalsUiManager.prototype.inviteClicked = function(event_id) {
    window.localStorage.event_id = event_id;
    Utility.redirectInvite(false);
};

/**
 * Runs when a reminder item is clicked.
 */
CalsUiManager.prototype.reminderClicked = function(event_id) {
    window.localStorage.event_id = event_id;
    Utility.redirectEvent(false);
};

/**
 * Runs when the save name change button is pressed.
 */
CalsUiManager.prototype.saveNameChangeButtonPressed = function() {
    var _this = this;
    var name = $('#user_name').val();

    var nameChangeRequest = $.get('../api/user_edit.php', {
        user_id: window.localStorage.user_id,
        name: name
    });

    nameChangedRequest.done(function(data) {
        window.location.reload();
    });

    nameChangeRequest.fail(function(data) {
        alert('Could not edit user name');
    });
};
