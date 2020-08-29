"use strict";
const conversion = {
  //Method that formats the date and returns it without the time appended
  formatDateWithoutTime(currentDate) {
    let month = currentDate.getMonth();
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let hour = ("0" + (currentDate.getHours() + 1)).slice(-2);
    let formattedDate =
      ("0" + currentDate.getDate()).slice(-2) + "-" + (months[month] + "-" + currentDate.getFullYear() + " ");

    return formattedDate;
  },

  //Method that formats the date and returns it with the time appended
  formatDateWithTime(currentDate) {
    let month = currentDate.getMonth();
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let hour = ("0" + (currentDate.getHours() + 1)).slice(-2);
    let formattedDate =
      ("0" + currentDate.getDate()).slice(-2) +
      "-" +
      (months[month] +
        "-" +
        currentDate.getFullYear() +
        " " +
        hour +
        ":" +
        ("0" + currentDate.getMinutes()).slice(-2) +
        ":" +
        ("0" + currentDate.getSeconds()).slice(-2));

    return formattedDate;
  },
  //Method used to set the time for each goal to 23:59:59 (to enable assessments from that day to be used for goal tracking)
  formatGoalDate(currentDate) {
    let month = currentDate.getMonth();
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let hour = "23";
    let minutes = "59";
    let seconds = "59";
    let formattedDate =
      ("0" + currentDate.getDate()).slice(-2) +
      "-" +
      (months[month] + "-" + currentDate.getFullYear() + " " + hour + ":" + minutes + ":" + seconds);

    return formattedDate;
  },
};

module.exports = conversion;
