/**
 * @author      Junming
 * @published   Mar 31, 2024
 * @description Library to track all the history progressing in server
 * @methods
 ** now:     Function to get current time in the format
 ** log:     Function to save running history into ...
 ** error:   Function to save error history into ...
 ** warning: Function to save warning history into ...
 */

 

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