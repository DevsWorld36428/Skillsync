/**
 * Library to track all the history progressing in server
 * @published Mar 31, 2024
 * @author Junming
 * @methods
 ** now:     Function to get current time in the format
 ** log:     Function to save running history into ...
 ** error:   Function to save error history into ...
 ** warning: Function to save warning history into ...
 */

 const days = ["Sunday", "Monday", "Tuesday", "Wednedsday", "Thursday", "Friday", "Saturday"]
 const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

 /**
  * Function to get date & time-string as format
  * @param {string} text
  ** Y: Full year as 4 numbers
  ** D: Full day as 01 - 31
  ** H: Full hour as 00 - 23
  ** M: Full minute as 00 - 59
  ** m: Full month as 01 - 12
  ** S: Full second as 00 - 59
  ** d: Day: Sunday - Saturday
  ** N: Month text: January - December
  ** ms: seconds from 1970/01/01 00:00:00
  @param {date} date
  @param {number} timezone
  @returns {string} date & time-string formatted
  */
  const now = (format, date = null, UTC = false) => {
   let curDate = date ? date : new Date(),
     year = UTC ? curDate.getUTCFullYear() : curDate.getFullYear(),
     month = UTC ? (curDate.getUTCMonth() + 1) : (curDate.getMonth() + 1),
     dat = UTC ? curDate.getUTCDate() : curDate.getDate(),
     hour = UTC ? curDate.getUTCHours() : curDate.getHours(),
     min = UTC ? curDate.getUTCMinutes() : curDate.getMinutes(),
     sec = UTC ? curDate.getUTCSeconds() : curDate.getSeconds(),
     day = days[UTC ? curDate.getUTCDay() : curDate.getDay()],
     Month = months[UTC ? curDate.getUTCMonth() : curDate.getMonth()]
 
   return format
     .replace("ms", curDate.getTime())
     .replace("Y", year)
     .replace("m", month > 9 ? month : `0${month}`)
     .replace("D", dat > 9 ? dat : `0${dat}`)
     .replace("H", hour > 9 ? hour : `0${hour}`)
     .replace("M", min > 9 ? min : `0${min}`)
     .replace("S", sec > 9 ? sec : `0${sec}`)
     .replace("d", day)
     .replace("N", Month)
 }

 /**
  * Functions to display & store an action as a log, error or warning
  * @param {string} text
  */
 const log = (text) => console.log(`${text}: ${now("Y-m-D H:M:S")}`)
 const error = (text) => console.log(`ERROR ${text} : ${now("Y-m-D H:M:S")}`)
 const warning = (text) => console.log(`WARNING ${text} : ${now("Y-m-D H:M:S")}`)

 module.exports = {
  now, log, error, warning,
 }