'use strict';
const conversion = {
  formatDate (currentDate) {
    let month = currentDate.getMonth();
     let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let hour = ("0" + (currentDate.getHours() + 1)).slice(-2);
let formattedDate = ("0" + currentDate.getDate()).slice(-2) + "-" + (months[month] + "-" +
    currentDate.getFullYear() + " "); 
    
    return formattedDate;
  }
  
  
}

module.exports = conversion;