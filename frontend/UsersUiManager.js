/**
 * UsersUiManager is a singleton class which initializes the app.
 * It is a singleton class.
 */

var UsersUiManager = function() {
};

UsersUiManager.singletonInstance = null;

/**
 * Returns the singleton instance of this class.
 */
UsersUiManager.getInstance = function() {
    if (UsersUiManager.singletonInstance == null) {
        UsersUiManager.singletonInstance = new UsersUiManager();
    }
    return UsersUiManager.singletonInstance;
};

/**
 * Runs when the app loads.
 */
UsersUiManager.prototype.init = function() {
};
