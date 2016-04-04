/**
 * StatsUiManager is a singleton class which initializes the app.
 * It is a singleton class.
 */

var StatsUiManager = function() {
    // Instance variables:
};

StatsUiManager.singletonInstance = null;

/**
 * Returns the singleton instance of this class.
 */
StatsUiManager.getInstance = function() {
    if (StatsUiManager.singletonInstance == null) {
        StatsUiManager.singletonInstance = new StatsUiManager();
    }
    return StatsUiManager.singletonInstance;
};

/**
 * Runs when the app loads.
 */
StatsUiManager.prototype.init = function() {
    // Register a callback for the buttons:
    $('#refresh_button').click(function() {
        window.location.reload();
    });

    this.aggregationQuery();
    this.nestedAggregationQuery();
    this.divisionQuery();
};

StatsUiManager.prototype.aggregationQuery = function() {
    var aggregationRequest = $.get('../api/events_per_user.php');

    aggregationRequest.done(function(data) {
        var resultList = $('#aggregation_div ul');
        resultList.empty();

        for (var i = 0; i < data.aggregate.length; i++) {
            var user = data.aggregate[i];
            var userItem = $('<li>' + user.uid + ': ' + user.count + '</li>');
            resultList.append(userItem);
        }
    });

    aggregationRequest.fail(function(data) {
        alert('Could not complete aggregation query');
    });
};

StatsUiManager.prototype.nestedAggregationQuery = function() {
    var nestedRequest = $.get('../api/user_with_largest_avg_event_duration.php');

    nestedRequest.done(function(data) {
        var resultField = $('#nested_result');
        resultField.text('user: ' + data.uid + ', average: ' + data.avg);
    });

    nestedRequest.fail(function(data) {
        alert('Could not complete nested aggregation query');
    });
};

StatsUiManager.prototype.divisionQuery = function() {
};

