var Utility = {};

/**
 * Given a month string, it returns the corresponding number.
 * January corresponds to 1, February corresponds to 2, etc.
 */
Utility.monthStringToNum = function(month) {
    month = month.substring(0, 3);
    month = month.toLowerCase();

    switch (month) {
        case "jan":
            return 1;
        case "feb":
            return 2;
        case "mar":
            return 3;
        case "apr":
            return 4;
        case "may":
            return 5;
        case "jun":
            return 6;
        case "jul":
            return 7;
        case "aug":
            return 8;
        case "sep":
            return 9;
        case "oct":
            return 10;
        case "nov":
            return 11;
        case "dec":
            return 12;
        default:
            return NaN;
    }
};

/**
 * - If a year is divisible by 100 BUT it is not divisible by 400, it is
 *   not a leap year.
 * - If a year is divisible by 400 it is a leap year.
 * - If a year is divisible by 4, it is a leap year.
 */
Utility.isLeapYear = function(year) {
    if ((year % 100 == 0) && (year % 400 != 0)) {
        return false;
    }
    if (year % 400 == 0) {
        return true;
    }
    if (year % 4 == 0) {
        return true;
    }
    return false;
};

/**
 * Given a month and a year, it returns the number of days in that month.
 * The month given must be a number [1-12]
 */
Utility.numDaysInMonth = function(month, year) {
    // Do the simple cases first - exclude february
    switch (month) {
        case 1:
            return 31;
        case 2:
            break;
        case 3:
            return 31;
        case 4:
            return 30;
        case 5:
            return 31;
        case 6:
            return 30;
        case 7:
            return 31;
        case 8:
            return 31;
        case 9:
            return 30;
        case 10:
            return 31;
        case 11:
            return 30;
        case 12:
            return 31;
        default:
            return NaN;
    }

    // If we reach here, then it means the month is february.
    if (Utility.isLeapYear(year)) {
        return 29;
    } else {
        return 28;
    }
};
