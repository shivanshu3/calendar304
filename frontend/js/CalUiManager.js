/**
 * CalUiManager is a singleton class which initializes the app.
 * It is a singleton class.
 */

var CalUiManager = function() {
    // Instance variables:
    this.month = NaN;
    this.year = NaN;
    this.user_id = NaN;
    this.events = null;
};

CalUiManager.singletonInstance = null;

/**
 * Returns the singleton instance of this class.
 */
CalUiManager.getInstance = function() {
    if (CalUiManager.singletonInstance == null) {
        CalUiManager.singletonInstance = new CalUiManager();
    }
    return CalUiManager.singletonInstance;
};

/**
 * Runs when the app loads.
 */
CalUiManager.prototype.init = function() {
    var _this = this;

    // If the user is not signed in, take them back to the
    // sign in/ sign up page:
    if (!Utility.userSignedIn()) {
        Utility.redirectSignIn();
        return;
    }
    this.user_id = Number(window.localStorage.user_id);

    // If the user has not chosen a calendar, take them back to the
    // calendars page:
    if (!Utility.userSelectedCalendar()) {
        Utility.redirectCalendars(true);
        return;
    }

    // Register a callback for when the hash changes:
    $(window).on('hashchange', function() {
        _this.hashChanged(location.hash.slice(1));
    });

    var time = new Date();
    var month = time.getMonth() + 1; // [1-12]
    var year = time.getFullYear();

    // Create a window hash if it doesn't exist already.
    if (window.location.hash == '') {
        // This should automatically trigger a calendar refresh:
        window.location.hash = Utility.monthNumToString(month) + "-" + year;
        this.month = month;
        this.year = year;
    } else {
        this.hashChanged(location.hash.slice(1));
    }

    // Initialize the month and year input boxes:
    this.initMonthYearInput();
};

/**
 * Initializes the month, year input boxes.
 */
CalUiManager.prototype.initMonthYearInput = function() {
    var monthBox = $('#month_select');
    var yearBox = $('#year_select');

    var _this = this;

    monthBox.change(function() {
        window.location.hash = monthBox.val() + "-" + _this.year;
    });

    yearBox.change(function() {
        window.location.hash = Utility.monthNumToString(_this.month) + "-" +
            yearBox.val();
    });
};

/**
 * Runs when the hash changes.
 * The argument passed to this function is the new hash.
 */
CalUiManager.prototype.hashChanged = function(hash) {
    month = hash.split('-')[0];
    year = hash.split('-')[1];

    // convert month to a number:
    monthNum = Utility.monthStringToNum(month);

    // update the month and year select text boxes
    // this does not trigger their 'change' callbacks
    var monthBox = $('#month_select');
    var yearBox = $('#year_select');
    monthBox.val(month);
    yearBox.val(year);

    this.refreshView(monthNum, year);

    // Populate and then show the color map of events:
    this.populateEvents();
};

/**
 * Given the month and year, it refreshes the calendar view.
 * The month argument is supposed to be a number. January corresponds to 1.
 */
CalUiManager.prototype.refreshView = function(month, year) {
    // update this instance:
    this.month = Number(month);
    this.year = Number(year);

    // The day of week on the first of this month:
    var dayOnFirst = new Date(year, month-1, 1).getDay();
    // Make sunday = 7, monday = 1
    dayOnFirst = (dayOnFirst == 0) ? 7 : dayOnFirst;

    var calendarTable = $('#calendar_table');
    var calRows = calendarTable.find("tr");
    calRows = calRows.toArray(); // jQuery array to normal array
    calRows.shift(); // Remove the first row because it contains days

    var counter = 0 - dayOnFirst + 2;
    var numDays = Utility.numDaysInMonth(month, year);

    var _this = this;

    // Print dates on the calendar:
    for (var i = 0; i < 6; i++) {
        var row = calRows[i];
        var dates = $(row).find('td');
        for (var j = 0; j < 7; j++) {
            $(dates[j]).unbind('click');
            if (counter <= 0) {
                dates[j].innerHTML = '';
                $(dates[j]).css('cursor', 'auto');
            } else if (counter <= numDays) {
                dates[j].innerHTML = counter;
                $(dates[j]).css('cursor', 'pointer');
                // Click callback registration is done inside an anonymous
                // function because we want the date$ to be in the closure.
                // Dark side of javascript :/
                (function() {
                    var date$ = $(dates[j]);
                    date$.click(function() {
                        var dateNumber = Number(date$[0].innerHTML)
                        _this.dateClicked(dateNumber);
                    });
                })();
            } else {
                dates[j].innerHTML = '';
                $(dates[j]).css('cursor', 'auto');
            }
            counter++;
        }
    }
};

/**
 * This function is called when a date is clicked.
 * The date clicked is passed to this function.
 */
CalUiManager.prototype.dateClicked = function(date) {
    console.log("date clicked: " + date);
};

/**
 * Downloads events for all days and then populates them in this instance.
 * showColorMap() is then called afterwards to show the color map of events
 * in the calendar.
 */
CalUiManager.prototype.populateEvents = function(date) {
    var _this = this;

    var timezoneOffset = (new Date()).getTimezoneOffset();

    // Element 1 in this array will contain a list of events on the 1st
    // day of the month, element 2 will contains a list of events on the 2nd
    // day of the month, etc.
    var events = [];
    var numDays = Utility.numDaysInMonth(this.month, this.year);
    // Used to keep track of how many responses from the server we have
    // received. Once the counter reaches numDays, we'll know that we won't
    // receive any more responses from the server.
    var counter = 0;
    // i represents the day # in the month in this loop:
    for (var i = 1; i <= numDays; i++) {
        var eventsListRequest = $.get('../api/events_list.php', {
            calendar_id: window.localStorage.user_calendar,
            year: _this.year,
            month: _this.month,
            date: i,
            timezone_offset_minutes: timezoneOffset
        });

        // Using this self executing anonymous function here to store
        // the day number in its closure, so that when we get the response
        // from the server, we know which date the list of events belongs to.
        (function() {
            var dayNumber = i;
            eventsListRequest.done(function(data) {
                events[dayNumber] = data;
            });
        })();

        eventsListRequest.fail(function(data) {
            alert('Could not download events!');
        });

        eventsListRequest.always(function(data) {
            counter++;
            if (counter == numDays) {
                _this.events = events;
                _this.showColorMap();
            }
        });
    }
};

/**
 * Shows the color map of events on the calendar. Uses the events data
 * stored in this instance.
 * Right now, it colors days with no events white, and days with events
 * green. We could also make it so that it could color days with different
 * intensities of green depending on the # of events on a day.
 */
CalUiManager.prototype.showColorMap = function() {
    // The day of week on the first of this month:
    var dayOnFirst = new Date(this.year, this.month-1, 1).getDay();
    // Make sunday = 7, monday = 1
    dayOnFirst = (dayOnFirst == 0) ? 7 : dayOnFirst;

    var calendarTable = $('#calendar_table');
    var calRows = calendarTable.find("tr");
    calRows = calRows.toArray(); // jQuery array to normal array
    calRows.shift(); // Remove the first row because it contains days

    var counter = 0 - dayOnFirst + 2;
    var numDays = Utility.numDaysInMonth(this.month, this.year);

    var _this = this;

    // Color dates on the calendar:
    for (var i = 0; i < 6; i++) {
        var row = calRows[i];
        var dates = $(row).find('td');
        for (var j = 0; j < 7; j++) {
            if (counter <= 0) {
                $(dates[j]).css('background-color', 'white');
            } else if (counter <= numDays) {
                if (_this.events[counter].length > 0) {
                    $(dates[j]).css('background-color', '#7CFF7C');
                } else {
                    $(dates[j]).css('background-color', 'white');
                }
            } else {
                $(dates[j]).css('background-color', 'white');
            }
            counter++;
        }
    }
};
