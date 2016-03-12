/**
 * UIManager is a singleton class which initializes the app.
 * It is a singleton class.
 */

var UIManager = function() {
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
    // The day of week on the first of this month:
    dayOnFirst = new Date(year, month-1, 1).getDay();
    // Make sunday = 7, monday = 1
    dayOnFirst = (dayOnFirst == 0) ? 7 : dayOnFirst;

    console.log(dayOnFirst);
};
