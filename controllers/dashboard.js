"use strict";

const logger = require("../utils/logger");
const assessmentStore = require('../models/assessment-store');
const goalStore = require('../models/goal-store');
const uuid = require('uuid');
const accounts = require ('./accounts.js');
//const gymUtility = require('./gymUtility.js');
const memberStats = require('../utils/member-stats');
const conversion = require('../utils/conversion');

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
    //let validGoalAssessments = [];
    
    //Sort Assessments by Date
    goals = memberStats.sortGoals(goals);
    
    //Remove assessments where date or numeric figure for measurement have not been provided
    goals = memberStats.filterGoals(goals);
    
    //Loop through each goal to determine the current goal status for each goal
    goals = memberStats.determineGoalsStatus(goals, orderedAssessments, loggedInUser);
   
    
    //Formatting current date to correct format
    let formattedDate = conversion.formatDate(currentDate);
   
    
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
        
     
      bmi = memberStats.calculateBMI(loggedInUser, orderedAssessments[0]);
        
    
      bmiCategory = memberStats.determineBMICategory(bmi);
       isIdealWeight = memberStats.isIdealBodyWeight(loggedInUser, orderedAssessments[0]);
      
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
      //console.log(typeof heightSquared);
            weight = loggedInUser.startingWeight;
      //console.log(weight);
            bmi = weight / heightSquared;
      
            bmi = Math.floor(bmi * 100) / 100;
     
       bmiCategory = memberStats.determineBMICategory(bmi);
      let assessment = {"weight": loggedInUser.startingWeight};
      isIdealWeight = memberStats.isIdealBodyWeight(loggedInUser, assessment);
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
      //console.log(timeStamp);
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
      target: Number(request.body.target),
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