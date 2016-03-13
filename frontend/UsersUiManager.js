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
    var _this = this;
    var textbox = $('#sign_in_box input');
    var user_id = textbox.val();

    var signInRequest = $.get('../api/user_exists.php', {id: user_id});

    signInRequest.done(function(data) {
        // User exists:
        if (data.exists) {
            _this.signInUser(user_id);
        }
        // User does not exist:
        else {
            alert('User ID is invalid.');
        }
    });

    signInRequest.fail(function(data) {
        alert('Sign In Failed!');
    });
};

/**
 * Runs when sign up button is clicked.
 */
UsersUiManager.prototype.signUpButtonClicked = function() {
    var _this = this;
    var textbox = $('#sign_up_box input');
    var user_name = textbox.val();

    var signUpRequest = $.get('../api/user_create.php', {name: user_name});

    signUpRequest.done(function(data) {
        if (data.id == undefined) {
            alert('Sign Up Failed!');
        } else {
            _this.signInUser(data.id);
        }
    });

    signUpRequest.fail(function(data) {
        alert('Sign Up Failed!');
    });
};

/**
 * Given the user id, it saves the id in local storage, and redirects
 * to the user calendars page.
 */
UsersUiManager.prototype.signInUser = function(user_id) {
    window.localStorage.user_id = user_id;
    window.location.href = './calendar.html';
};
