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
    var _this = this;

    // Register callbacks for the 2 buttons:
    signInButton = $('#sign_in_box button');
    signInButton.click(function() {
        _this.signInButtonClicked();
    });
    signUpButton = $('#sign_up_box button');
    signUpButton.click(function() {
        _this.signUpButtonClicked();
    });
};

/**
 * Runs when sign in button is clicked.
 */
UsersUiManager.prototype.signInButtonClicked = function() {
    console.log('sign in');
};

/**
 * Runs when sign up button is clicked.
 */
UsersUiManager.prototype.signUpButtonClicked = function() {
    console.log('sign up');
};
