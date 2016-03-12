var UIManager = function() {
};

UIManager.singletonInstance = null;

UIManager.getInstance = function() {
    if (UIManager.singletonInstance == null) {
        UIManager.singletonInstance = new UIManager();
    }
    return UIManager.singletonInstance;
}

UIManager.prototype.init = function() {
    console.log("Initializing!");
}
