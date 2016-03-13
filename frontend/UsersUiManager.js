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
    var textbox = $('#sign_in_box input');
    var user_id = textbox.val();
    console.log(user_id);

    var signInRequest = $.get('../api/user_exists.php', {id: user_id});

    signInRequest.done(function(data) {
        // User exists:
        if (data.exists) {
            // Store the user id in local storage and open up the calendar:
            window.localStorage.user_id = user_id;
            window.location.href = './calendar.html';
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
    var textbox = $('#sign_up_box input');
    var user_name = textbox.val();

    var signUpRequest = $.get('../api/user_create.php', {name: user_name});

    signUpRequest.done(function(data) {
        if (data.id == undefined) {
            alert('Sign Up Failed!');
        } else {
            // Store the user id in local storage and open up the calendar:
            window.localStorage.user_id = data.id;
            window.location.href = './calendar.html';
        }
    });

    signUpRequest.fail(function(data) {
        alert('Sign Up Failed!');
    });
};
