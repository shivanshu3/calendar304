/**
 * EventsUiManager is a singleton class which initializes the app.
 * It is a singleton class.
 */

var EventsUiManager = function() {
    // Instance variables:
    this.events = null;
    this.rooms = null;
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
    this.populateRooms();
};

/**
 * Runs when the create event button is clicked.
 */
EventsUiManager.prototype.createEventClicked = function() {
    var nameBox = $('#event_name');
    var startTimeBox = $('#event_start_time');
    var durationBox = $('#event_duration');
    var roomNoDropdown = $('#event_room');

    var name = nameBox.val();
    var startTimeString = startTimeBox.val();
    var duration = durationBox.val();
    var roomNo = roomNoDropdown.val();

    var user_id = window.localStorage.user_id;
    var cal_id = window.localStorage.user_calendar;
    var year = window.localStorage.year;
    var month = window.localStorage.month;
    var date = window.localStorage.date;
    var hours = startTimeString.split(':')[0];
    var minutes = startTimeString.split(':')[1];

    var startTime = Math.round(new Date(year, month-1, date, hours,
        minutes, 0, 0).getTime() / 1000);

    var newEventRequest = $.get('../api/event_create.php', {
        name: name,
        start_time: startTime,
        duration: duration,
        room_no: roomNo,
        user_id: user_id,
        cal_id: cal_id
    });

    newEventRequest.done(function(data) {
        window.location.reload();
    });

    newEventRequest.fail(function(data) {
        alert('Could not create an event');
    });
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
        _this.populateEventsDetails();
    });

    getEventsRequest.fail(function(data) {
        alert('Could not download events for this day.');
    });
};

/**
 * Populates the details of all events in this instance.
 */
EventsUiManager.prototype.populateEventsDetails = function() {
    var _this = this;

    // We use this to keep track of how many event details we have downloaded.
    // Once counter reaches this.events.length, we know that we have downloaded
    // the details of all events.
    var counter = 0;

    for (var i = 0; i < this.events.length; i++) {
        var eventDetailsRequest = $.get('../api/event_details.php', {
            id: this.events[i]
        });

        // We want eventsIndex to be in this self executing function's
        // closure so that when we get the response from the server, we
        // know which index we were at:
        (function() {
            var eventsIndex = i;
            eventDetailsRequest.done(function(data) {
                _this.events[eventsIndex] = data;
            });
        })();

        eventDetailsRequest.fail(function(data) {
            alert('Could not download event details.');
        });

        eventDetailsRequest.always(function() {
            counter++;
            if (counter == _this.events.length) {
                // We are done downloading details of all the events:
                _this.showEvents();
            }
        });
    }
};

/**
 * Shows the events on the page.
 */
EventsUiManager.prototype.showEvents = function() {
    var _this = this;
    var eventsList = $('#existing_events_div ul');
    eventsList.empty();

    for (var i = 0; i < this.events.length; i++) {
        var event = this.events[i];
        eventItem = $('<li> <a href="javascript:void(0)">' + event.name +
            '</a> </li>');
        // Storing eventId in this function's closure:
        (function() {
            var eventId = event.id;
            eventItem.click(function() {
                _this.eventClicked(eventId);
            });
        })();
        eventsList.append(eventItem);
    }
};

/**
 * Gets the room numbers from the server and populates them in the dropdown.
 */
EventsUiManager.prototype.populateRooms = function() {
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
 * Shows the rooms in the dropdown.
 */
EventsUiManager.prototype.showRooms = function() {
    var roomsDropdown = $('#create_event_div select');
    roomsDropdown.empty();

    for (var i = 0; i < this.rooms.length; i++) {
        var room = this.rooms[i];
        var roomItem = $('<option>' + room.RoomNo + '</option>');
        roomsDropdown.append(roomItem);
    }
};

/**
 * Runs when an event is clicked.
 */
EventsUiManager.prototype.eventClicked = function(id) {
    console.log(id);
};
