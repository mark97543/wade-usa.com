
/**
 * Calculates the Years, Hours, And Minutes between now and a set date
 *
 * @param {number} a - The year (4 digit year)
 * @param {number} b - Month (no leading zeros) this is also a number between 0 and 11 where 0 is Jan and 11 is december
 * @param {number} c - Day (no leading zeros)
 * @param {number} d - The hour (no leading zeros 24 hour clock)
 * @param {number} e - The Minute (no leading zeors if bottom of hour just on zero)
 * @returns {number} The factorial of the given number.
 */

export function timeUntil(a, b, c, d, e){

    const deadline = new Date(a, b, c, d, e);
    const now = new Date();
    const oneDay = 24*60*60*1000;
    const oneHour = 60*60*1000;
    const oneMinute = 60*1000;
    var miliseconds = Math.abs(deadline - now);
    var days = Math.floor(miliseconds / oneDay );
    var hours = Math.floor((miliseconds - (days * oneDay))/oneHour);
    var minutes = Math.floor((miliseconds - (days*oneDay + hours*oneHour))/oneMinute);
    return {
        day : days,
        hour : hours,
        minute : minutes
    };
}
