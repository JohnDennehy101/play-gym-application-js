"use strict";

const logger = require("../utils/logger");

const about = {
  //This method is used to render the about page
  index(request, response) {
    logger.info("about rendering");
    const viewData = {
      title: "About Play Gym",
    };
    response.render("about", viewData);
  },
};

module.exports = about;
