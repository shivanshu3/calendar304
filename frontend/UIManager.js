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
    console.log("New Hash: " + hash);
};
