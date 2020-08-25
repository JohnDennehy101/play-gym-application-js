"use strict";

const logger = require("../utils/logger");
const assessmentStore = require('../models/assessment-store');
const goalStore = require('../models/goal-store');
const uuid = require('uuid');
const accounts = require ('./accounts.js');
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
       let bmi = 0;
    let height = 0;
    let heightSquared = 0;
    let weight = 0;
    let bmiCategory;
    let isIdealWeight;
    let assessmentTrend;
    let counter = 0;
    let numOfAssessments;
    let numOfGoals;
    
    //Sort Assessments by Date
    goals = memberStats.sortGoals(goals);
    
    //Remove assessments where date or numeric figure for measurement have not been provided
    goals = memberStats.filterGoals(goals);
    
    //Loop through each goal to determine the current goal status for each goal
    goals = memberStats.determineGoalsStatus(goals, orderedAssessments, loggedInUser);
 
    
    //Looping through the ordered assessments to determine the assessment trend for each assessment (positive, negative, neutral, not applicable)
    orderedAssessments = memberStats.determineAssessmentTrend(orderedAssessments, numOfAssessments);
    
    //Determining if the user has completed assessments or not
   numOfAssessments = memberStats.calculateNumberOfAssessments (orderedAssessments);
    
    //Determining if the user/trainer has set goals for the user or not
    numOfGoals = memberStats.calculateNumberOfGoals(goals);
    
    //Calculating member's BMI
    bmi = memberStats.calculateBMI(loggedInUser, orderedAssessments);
    
    //Calculating member's BMI category
    bmiCategory = memberStats.determineBMICategory(bmi);
    
    //Determining if user is at ideal weight or not
    isIdealWeight = memberStats.isIdealBodyWeight(loggedInUser, orderedAssessments);
 
   
    const viewData = {
      title: 'User Dashboard',
      assessments: orderedAssessments,
      user: loggedInUser,
      bmi: bmi,
      bmiCategory: bmiCategory,
      isIdealWeight: isIdealWeight,
      trend: assessmentTrend,
      completedAssessments: numOfAssessments,
      goalsSet: numOfGoals,
      goals: goals
    };
    //logger.info('about to render', assessmentStore.getAllAssessments());
    response.render('memberDashboard', viewData);
  },
  
    addAssessment(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    let currentDate = new Date();
      
      //Formatting current date to correct format
    let formattedDate = conversion.formatDateWithTime(currentDate);
      
     
      
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
    let userId = request.params.userid;
    let loggedInMember;
    let currentMeasurement;
    let goalStatus;
    
   let timeStamp = new Date(request.body.date + "Z");
  let currentDate = new Date();
   
    let formattedDate = conversion.formatGoalDate(timeStamp);
    
  
     let bmi;


     const newGoal = {
      id: uuid.v1(),
      userid: userId,
      timestamp: formattedDate,
      measurement: request.body.measurement,
      currentMeasurement: currentMeasurement,
      target: Number(request.body.target),
      status: goalStatus
    };
    goalStore.addGoal(newGoal);
    
    loggedInMember = accounts.getCurrentUser(request);
    
    
    if (loggedInMember !== undefined) {
      response.redirect('/dashboard');
    }
    else {
    response.redirect('/member/' + request.params.userid);
    }
  
    
    
  },
  
  deleteGoal (request, response) {
  const goalId = request.params.id;
    let goal;
    let memberId;
    let loggedInMember;
  logger.info('Assessment to be deleted = ' + goalId);
    goal = goalStore.getGoal(goalId);
    memberId = goal.userid;
  goalStore.removeGoal(goalId);
 
     loggedInMember = accounts.getCurrentUser(request);
    
    
    if (loggedInMember !== undefined) {
      response.redirect('/dashboard');
    }
    else {
    response.redirect('/member/' + memberId);
    }
  },
  
   deleteAssessment(request, response) {
 const assessmentId = request.params.id;
  logger.info('Assessment to be deleted = ' + assessmentId);
  assessmentStore.removeAssessment(assessmentId);
  response.redirect('/dashboard');
  },
  
  
};

module.exports = dashboard;