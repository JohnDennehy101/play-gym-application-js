'use strict';
const conversion = {
  formatDateWithoutTime (currentDate) {
    let month = currentDate.getMonth();
     let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let hour = ("0" + (currentDate.getHours() + 1)).slice(-2);
let formattedDate = ("0" + currentDate.getDate()).slice(-2) + "-" + (months[month] + "-" +
    currentDate.getFullYear() + " "); 
    
    return formattedDate;
  },
  formatDateWithTime (currentDate) {
    let month = currentDate.getMonth();
     let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let hour = ("0" + (currentDate.getHours() + 1)).slice(-2);
let formattedDate = ("0" + currentDate.getDate()).slice(-2) + "-" + (months[month] + "-" +
    currentDate.getFullYear() + " " + hour + ":" + ("0" + currentDate.getMinutes()).slice(-2) + ":"  + ("0" + currentDate.getSeconds()).slice(-2));
    
    return formattedDate;
  },
  
  formatGoalDate (currentDate) {
    let month = currentDate.getMonth();
     let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let hour = "23";
let minutes = "59";
let seconds = "59";
let formattedDate = ("0" + currentDate.getDate()).slice(-2) + "-" + (months[month] + "-" +
    currentDate.getFullYear() + " " + hour + ":" + minutes + ":"  + seconds);
    
    return formattedDate;
  }
  
  
}

module.exports = conversion;