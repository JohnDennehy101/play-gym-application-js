"use strict";

const logger = require("../utils/logger");
const assessmentStore = require('../models/assessment-store');
const goalStore = require('../models/goal-store');
const uuid = require('uuid');
const accounts = require ('./accounts.js');
const gymUtility = require('./gymUtility.js');
const memberStats = require('../utils/member-stats');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    let assessments = assessmentStore.getUserAssessments(loggedInUser.id);
    let goals = goalStore.getUserGoals(loggedInUser.id);
    let goalBMI;
    let index = 0;
    let orderedAssessments = assessments.reverse();
     let assessmentsBeforeGoal = [];
    let match = false;
   let currentDate = new Date();
    let currentMeasurement;
    let validGoalAssessments = [];
  
    
    for (let i=0; i< orderedAssessments.length; i++) {
      
      
      if (Date.parse(orderedAssessments[i].timestamp) < Date.parse(currentDate)) {
          validGoalAssessments.push(assessmentStore.getAssessmentByDate(orderedAssessments[i].timestamp));
          }
    }
    
    
    goals.forEach((goal, index) => {
      goal.latestAssessmentForGoal = [];
        let assessmentMatch = [];
    
       console.log("Length: " + validGoalAssessments.length);
      if (validGoalAssessments.length === 0 && currentDate < Date.parse(goal.timestamp)) {
          goal.status = 'Open';
         goal.finalMeasurement = "Final measurement yet to be captured."
          }
      
      else if (validGoalAssessments.length === 0 && currentDate > Date.parse(goal.timestamp)) {
        goal.status = 'Closed';
         goal.finalMeasurement = "No assessments completed before this date.";
      }
      
      else if (validGoalAssessments.length > 0) {
      for (let i=0; i< validGoalAssessments.length; i++) {
      
        
        console.log("Length: " + validGoalAssessments.length);
       
        
        
        if (Date.parse(validGoalAssessments[i].timestamp) < Date.parse(goal.timestamp)) {
          //assessmentsBeforeGoal.push(orderedAssessments[i].timestamp); 
         console.log(validGoalAssessments[i].timestamp + " " + goal.timestamp + "Index: " + index);
        goal.latestAssessmentForGoal.push(validGoalAssessments[i]);
          console.log("Test " + goal.latestAssessmentForGoal[0]);
        
         
              assessmentMatch.push(assessmentStore.getAssessmentByDate(orderedAssessments[i].timestamp));
          
         
           if (assessmentMatch.length > 0) {
         currentMeasurement = gymUtility.calculateBMI(loggedInUser, goal.latestAssessmentForGoal[0]);
            
           }
          else {
            height = loggedInUser.height;
      
            heightSquared = height * height;
            weight = loggedInUser.startingWeight;
            bmi = weight / heightSquared;
            bmi = Math.floor(bmi * 100) / 100;
            currentMeasurement = bmi
           
          }
         
      
          
          if (goal.measurement.toLowerCase() === "bmi") {
           
            if (assessmentMatch.length > 0 && currentDate < Date.parse(goal.timestamp)) {
    
      if (Date.parse(goal.latestAssessmentForGoal[0].timestamp) < currentDate && currentDate > Date.parse(goal.timestamp) && currentMeasurement < goal.target) {
        //goals[2].status = "Achieved";
        goal.status = "Achieved";
        goal.finalMeasurement = currentMeasurement;
        assessmentMatch.splice(0);
       
        
      }
      else if (Date.parse(goal.latestAssessmentForGoal[0].timestamp) < currentDate && currentDate > Date.parse(goal.timestamp) && currentMeasurement > goal.target) {
        goal.status = "Missed";
        goal.finalMeasurement = currentMeasurement;
        assessmentMatch.splice(0);
     
        
      }
         
            else {
        goal.status = "Open";
              goal.finalMeasurement = "Final measurement yet to be captured."
              assessmentMatch.splice(0);
    
      }
              
            } else {
              goal.status = 'Closed';
         goal.finalMeasurement = "No assessments completed before this date.";
            }
    }
          
    
    else if (goal.measurement.toLowerCase() === "weight") {
     
      let weight = goal.latestAssessmentForGoal[0].weight;
     currentMeasurement = weight;
      if (Date.parse(goal.latestAssessmentForGoal[0].timestamp) < currentDate && currentDate > Date.parse(goal.timestamp) && currentMeasurement < goal.target) {
        goal.status = "Achieved";
        goal.finalMeasurement = currentMeasurement;
        assessmentMatch.splice(0);
      
      }
      else if (Date.parse(goal.latestAssessmentForGoal[0].timestamp) < currentDate && currentDate > Date.parse(goal.timestamp) && currentMeasurement > goal.target) {
        goal.status = "Missed";
        goal.finalMeasurement = currentMeasurement;
        assessmentMatch.splice(0);
        
      }
      else {
        goal.status = "Open";
        goal.finalMeasurement = "Final measurement yet to be captured."
        assessmentMatch.splice(0);
        
      }
    }
    
     else if (goal.measurement.toLowerCase() === "chest") {
    
       let chest = goal.latestAssessmentForGoal[0].chest;
          currentMeasurement = chest;
     
      if (Date.parse(goal.latestAssessmentForGoal[0].timestamp) < currentDate &&  currentDate > Date.parse(goal.timestamp) && currentMeasurement < goal.target) {
        goal.status = "Achieved";
        assessmentMatch.splice(0);
   
        goal.finalMeasurement = currentMeasurement;
      }
      else if (Date.parse(goal.latestAssessmentForGoal[0].timestamp) < currentDate &&  currentDate > Date.parse(goal.timestamp) && currentMeasurement > goal.target) {
        goal.status = "Missed";
       goal.finalMeasurement = currentMeasurement;
        assessmentMatch.splice(0);
      }
      else {
        goal.status = "Open";
        goal.finalMeasurement = "Final measurement yet to be captured."
      }
    }
    
     else if (goal.measurement.toLowerCase() === "thigh") {
    
       let thigh = goal.latestAssessmentForGoal[0].thigh;
       console.log(assessmentMatch[0].timestamp);
         currentMeasurement = thigh;
       //assessmentMatch.splice(0);
     
      if (Date.parse(goal.latestAssessmentForGoal[0].timestamp) < currentDate && currentDate > Date.parse(goal.timestamp) && currentMeasurement < goal.target) {
        goal.status = "Achieved";
         goal.finalMeasurement = currentMeasurement;
        assessmentMatch.splice(0);
    
      }
      else if (Date.parse(goal.latestAssessmentForGoal[0].timestamp) < currentDate && currentDate > Date.parse(goal.timestamp) && currentMeasurement > goal.target) {
        goal.status = "Missed";
         goal.finalMeasurement = currentMeasurement;
        assessmentMatch.splice(0);
        
      }
      else {
        goal.status = "Open";
        goal.finalMeasurement = "Final measurement yet to be captured."
      }
    }
    
    else if (goal.measurement.toLowerCase() === "upper arm") {
    
      let upperArm = goal.latestAssessmentForGoal[0].upperArm;
       currentMeasurement = upperArm;
      //assessmentMatch.splice(0);
     
      if (Date.parse(goal.latestAssessmentForGoal[0].timestamp) < currentDate && currentDate > Date.parse(goal.timestamp) && currentMeasurement < goal.target) {
        goal.status = "Achieved";
        goal.finalMeasurement = currentMeasurement;
        assessmentMatch.splice(0);
     
      }
      else if (Date.parse(goal.latestAssessmentForGoal[0].timestamp) < currentDate && currentDate > Date.parse(goal.timestamp) && currentMeasurement > goal.target) {
        goal.status = "Missed";
        goal.finalMeasurement = currentMeasurement;
        assessmentMatch.splice(0);
        
      }
      else {
        goal.status = "Open";
        goal.finalMeasurement = "Final measurement yet to be captured."
      }
    }
    
      else if (goal.measurement.toLowerCase() === "waist") {
      //let waist = assessmentMatch[0].waist;
        let waist = goal.latestAssessmentForGoal[0].waist;
         currentMeasurement = waist;
     
      if (Date.parse(goal.latestAssessmentForGoal[0].timestamp) < currentDate && currentDate > Date.parse(goal.timestamp) &&  currentMeasurement < goal.target) {
        goal.status = "Achieved";
        goal.finalMeasurement = currentMeasurement;
        assessmentMatch.splice(0);
     
      }
      else if (Date.parse(goal.latestAssessmentForGoal[0].timestamp) < currentDate &&  currentDate > Date.parse(goal.timestamp) && currentMeasurement > goal.target) {
        goal.status = "Missed";
        goal.finalMeasurement = currentMeasurement;
        assessmentMatch.splice(0);
      }
      else {
        goal.status = "Open";
        goal.finalMeasurement = "Final measurement yet to be captured."
      }
    }
    
     else if (goal.measurement.toLowerCase() === "hips") {
      //let hips = assessmentMatch[0].hips;
       let hips = goal.latestAssessmentForGoal[0].hips;
        currentMeasurement = hips;
     
      if (Date.parse(goal.latestAssessmentForGoal[0].timestamp) < currentDate && currentDate > Date.parse(goal.timestamp) &&  currentMeasurement < goal.target) {
        goal.status = "Achieved";
         goal.finalMeasurement = currentMeasurement;
        assessmentMatch.splice(0);
     
      }
      else if (Date.parse(goal.latestAssessmentForGoal[0].timestamp) < currentDate && currentDate > Date.parse(goal.timestamp) &&  currentMeasurement > goal.target) {
        goal.status = "Missed";
         goal.finalMeasurement = currentMeasurement;
        assessmentMatch.splice(0);
         
      }
      else {
        goal.status = "Open";
        goal.finalMeasurement = "Final measurement yet to be captured."
      }
    }
          
        
          
        }
        
        else {
              goal.status = 'Closed';
         goal.finalMeasurement = "No assessments completed before this date.";
            }
          
        }
       /* else {
          goal.status = "Not Applicable";
          goal.finalMeasurement = "No assessments completed before this date";
          
        } */
      }
      
      else {
          goal.status = "Not Applicable";
          goal.finalMeasurement = "No assessments completed before this date";
          
        } 
        
        
     // }
    })
    
   
     let checkAssessmentDate = orderedAssessments.filter((assessment) => {
      
    
   
    }) 
   
    let month = currentDate.getMonth();
     let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let hour = ("0" + (currentDate.getHours() + 1)).slice(-2);
let formattedDate = ("0" + currentDate.getDate()).slice(-2) + "-" + (months[month] + "-" +
    currentDate.getFullYear() + " "); 
    
    
    
    
    let bmi = 0;
    let height = 0;
    let heightSquared = 0;
    let weight = 0;
    let bmiCategory;
    let isIdealWeight;
    let assessmentTrend;
    let counter = 0;
    let numOfAssessments;
    
    loggedInUser.name = loggedInUser.name.toUpperCase();
      if (orderedAssessments.length > 0) {
        numOfAssessments = true;
        if (orderedAssessments.length === 1) {
           orderedAssessments[0].emptyTrendLine = true;
        }
        
     
      bmi = memberStats.calculateBMI(loggedInUser);
        
    
      bmiCategory = gymUtility.determineBMICategory(bmi);
       isIdealWeight = gymUtility.isIdealBodyWeight(loggedInUser, orderedAssessments[0]);
      
    if (orderedAssessments.length >= 2) {
      
          for (let i=0; i < orderedAssessments.length; i++)  {
            
            if (orderedAssessments.length - i === 1) {
               orderedAssessments[(orderedAssessments.length - 1)].emptyTrendLine = true;
               orderedAssessments[i].assessmentTrend = false;
               orderedAssessments[i].negativeAssessmentTrend = false;
              break;
            }
            
            else if (orderedAssessments[(i)].weight < orderedAssessments[(i + 1)].weight) {
              orderedAssessments[i].assessmentTrend = true;
             
            }
            else if (orderedAssessments[i].weight > orderedAssessments[(i + 1)].weight) {
              orderedAssessments[i].negativeAssessmentTrend = true;
            
            }
            else {
              orderedAssessments[i].equalWeight = true;
            }
           
          }   
      
       
    } 
        
         }
    else {
      numOfAssessments = false;
      height = loggedInUser.height;
      
            heightSquared = height * height;
      console.log(typeof heightSquared);
            weight = loggedInUser.startingWeight;
      console.log(weight);
            bmi = weight / heightSquared;
      
            bmi = Math.floor(bmi * 100) / 100;
     
       bmiCategory = gymUtility.determineBMICategory(bmi);
      let assessment = {"weight": loggedInUser.startingWeight};
      isIdealWeight = gymUtility.isIdealBodyWeight(loggedInUser, assessment);
    }
    
  
   
    const viewData = {
      title: 'User Dashboard',
      assessments: orderedAssessments,
      user: loggedInUser,
      bmi: bmi,
      bmiCategory: bmiCategory,
      isIdealWeight: isIdealWeight,
      trend: assessmentTrend,
      completedAssessments: numOfAssessments,
      goals: goals
    };
    //logger.info('about to render', assessmentStore.getAllAssessments());
    response.render('memberDashboard', viewData);
  },
  
    addAssessment(request, response) {
      let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const loggedInUser = accounts.getCurrentUser(request);
    const date = new Date();
   let timeStamp = new Date();
      console.log(timeStamp);
let month = timeStamp.getMonth();
let hour = ("0" + (timeStamp.getHours() + 1)).slice(-2);
let formattedDate = ("0" + timeStamp.getDate()).slice(-2) + "-" + (months[month] + "-" +
    timeStamp.getFullYear() + " " + hour + ":" + ("0" + timeStamp.getMinutes()).slice(-2) + ":"  + ("0" + timeStamp.getSeconds()).slice(-2));
      
     
      
    const newAssessment = {
      id: uuid.v1(),
      userid: loggedInUser.id,
      weight: Number(request.body.weight),
      chest: Number(request.body.chest),
      thigh: Number(request.body.thigh),
      upperArm: Number(request.body.upperArm),
      waist: Number(request.body.waist),
      hips: Number(request.body.hips),
      timestamp: formattedDate,
      comment: '',
    };
    assessmentStore.addAssessment(newAssessment);
    response.redirect('/dashboard');
  },
  
  addGoal(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    let assessments = assessmentStore.getUserAssessments(loggedInUser.id);
    let orderedAssessments = assessments.reverse();
    let currentMeasurement;
    let goalStatus;
     let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
   let timeStamp = new Date(request.body.date + "Z"); //new Date('2011-04-11T10:20:30Z')
  let currentDate = new Date();
    let month = timeStamp.getMonth();
let hour = ("0" + (timeStamp.getHours() + 1)).slice(-2);
let formattedDate = ("0" + timeStamp.getDate()).slice(-2) + "-" + (months[month] + "-" +
    timeStamp.getFullYear() + " "); 
    
    //Getting current measurements and storing relevant info in currentMeasurement variable
     let bmi;

    
   
    
    
     const newGoal = {
      id: uuid.v1(),
      userid: loggedInUser.id,
      timestamp: formattedDate,
       //timestamp: request.body.date,
      measurement: request.body.measurement,
      currentMeasurement: currentMeasurement,
      target: request.body.target,
      status: goalStatus
    };
    goalStore.addGoal(newGoal);
    response.redirect('/dashboard');
    
    
  },
  
   deleteAssessment(request, response) {
 const assessmentId = request.params.id;
  logger.info('Assessment to be deleted = ' + assessmentId);
  assessmentStore.removeAssessment(assessmentId);
  response.redirect('/dashboard');
  },
  
  
};

module.exports = dashboard;