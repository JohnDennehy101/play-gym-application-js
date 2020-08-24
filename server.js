"use strict";

const express = require("express");
const logger = require("./utils/logger");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const app = express();
app.use(cookieParser());
const exphbs = require("express-handlebars");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(fileUpload());
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
     setAssessmentText(numOfAssessments) {
       if (numOfAssessments === 1) {
         return "assessment";
       }
       else {
         return "assessments";
       }
     },
      
    setGoalBackground (status) {
      
     
      if (status.toLowerCase() === "achieved") {
        return "positive"
      }
      else if (status.toLowerCase() === "open") {
        return ""
      }
      else if (status.toLowerCase() === "closed") {
        return "warning"
      }
      else {
        return "negative"
      }
      
    },
      
      setGoalIcon (status) {
        if (status.toLowerCase() === "achieved") {
        return "icon checkmark"
      }
      else if (status.toLowerCase() === "open") {
        return ""
      }
      else if (status.toLowerCase() === "closed") {
        return "attention icon"
      }
      else {
        return "icon close"
      }
      },
      
      setAssessmentTrend (trend) {
        if (trend.toLowerCase() === "not applicable") {
          return "";
        }
        else if (trend.toLowerCase() === "positive") {
          return "ui teal tag label";
        }
         else if (trend.toLowerCase() === "negative") {
          return "ui red tag label";
        }
        else if (trend.toLowerCase() === "neutral") {
          return "ui grey tag label"
        }
    
      },
      
      formatDate (date) {
        let time = date.indexOf("23:59:59");
        date = date.substr(0, time);
        return date;
      },
      
      makeNameUppercase (name) {
        return name.toUpperCase();
      }
    }
  })
);
app.set("view engine", ".hbs");

const routes = require("./routes");
app.use("/", routes);

const listener = app.listen(process.env.PORT || 4000, function() {
  logger.info(`glitch-template-1 started on port ${listener.address().port}`);
});
