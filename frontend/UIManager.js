/**
 * UIManager is a singleton class which initializes the app.
 * It is a singleton class.
 */

var UIManager = function() {
    // Instance variables:
    this.month = NaN;
    this.year = NaN;
};

UIManager.singletonInstance = null;

/**
 * Returns the singleton instance of this class.
 */
UIManager.getInstance = function() {
    if (UIManager.singletonInstance == null) {
        UIManager.singletonInstance = new UIManager();
    }
    return UIManager.singletonInstance;
};

/**
 * Runs when the app loads.
 */
UIManager.prototype.init = function() {
    var _this = this;
    console.log("Initializing!");

    // Register a callback for when the hash changes:
    $(window).on('hashchange', function() {
        _this.hashChanged(location.hash.slice(1));
    });
};

/**
 * Runs when the hash changes.
 * The argument passed to this function is the new hash.
 */
UIManager.prototype.hashChanged = function(hash) {
    month = hash.split('-')[0];
    year = hash.split('-')[1];

    // convert month to a number:
    month = Utility.monthStringToNum(month);

    this.refreshView(month, year);
};

/**
 * Given the month and year, it refreshes the calendar view.
 * The month argument is supposed to be a number. January corresponds to 1.
 */
UIManager.prototype.refreshView = function(month, year) {
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

    // Print dates on the calendar:
    for (var i = 0; i < 6; i++) {
        var row = calRows[i];
        var dates = $(row).find('td');
        for (var j = 0; j < 7; j++) {
            if (counter <= 0) {
                dates[j].innerHTML = '';
            } else if (counter <= numDays) {
                dates[j].innerHTML = counter;
            } else {
                dates[j].innerHTML = '';
            }
            counter++;
        }
    }

    console.log(dayOnFirst);
};
