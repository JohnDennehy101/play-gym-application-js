"use strict";
const accounts = require ('./accounts.js');
const memberStore = require('../models/member-store');
const assessmentStore = require('../models/assessment-store');
const goalStore = require('../models/goal-store');
const uuid = require('uuid');
const memberStats = require('../utils/member-stats');
const conversion = require('../utils/conversion');

const trainerDashboard = {
  index(request, response) {
    let totalAssessments;
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    let allMembers = memberStore.getAllUsers();
    
    //Calculating the number of assessments for each member
    allMembers = memberStats.calculateTotalAssessmentsFigure(allMembers);
    
  
    const viewData = {
      members: allMembers,
    }
    
    response.render('trainerDashboard', viewData);

  },
  
  viewMember(request, response) {
    const member = memberStore.getUserById(request.params.id);
    let assessments = assessmentStore.getUserAssessments(member.id);
    let orderedAssessments = assessments.reverse();
    let bmi;
    let height;
    let heightSquared;
    let weight;
    let bmiCategory;
    let isIdealWeight;
    let assessmentTrend;
    let goals = goalStore.getUserGoals(member.id);
    let numOfAssessments;
    let numOfGoals;
    
    //Sort Assessments by Date
    goals = memberStats.sortGoals(goals);
    
    //Remove assessments where date or numeric figure for measurement have not been provided
    goals = memberStats.filterGoals(goals);
    
    //Loop through each goal to determine the current goal status for each goal
    goals = memberStats.determineGoalsStatus(goals, orderedAssessments, member);
   
    
    //Determining if the user has completed assessments or not
   numOfAssessments = memberStats.calculateNumberOfAssessments (orderedAssessments);
    
    //Determining if the user/trainer has set goals for the user or not
    numOfGoals = memberStats.calculateNumberOfGoals(goals);
    
    //Calculating member's BMI
    bmi = memberStats.calculateBMI(member, orderedAssessments);
    
    //Calculating member's BMI category
    bmiCategory = memberStats.determineBMICategory(bmi);
    
    //Determining if user is at ideal weight or not
    isIdealWeight = memberStats.isIdealBodyWeight(member, orderedAssessments);
    
   /* if (orderedAssessments.length > 0) {
      bmi = memberStats.calculateBMI(member, orderedAssessments[0]);
      bmiCategory = memberStats.determineBMICategory(bmi);
       isIdealWeight = memberStats.isIdealBodyWeight(member, orderedAssessments[0]);
    }
    else {
      height = member.height;
            heightSquared = height * height;
            weight = member.startingWeight;
            bmi = weight / heightSquared;
            bmi = Math.floor(bmi * 100) / 100;
       bmiCategory = memberStats.determineBMICategory(bmi);
      let assessment = {"weight": member.startingWeight};
      isIdealWeight = memberStats.isIdealBodyWeight(member, assessment);
    } */
    
    
    
    const viewData = {
      user: member,
      assessments: orderedAssessments,
      bmi: bmi,
      bmiCategory: bmiCategory,
      isIdealWeight: isIdealWeight,
      trend: assessmentTrend,
      goals: goals,
      completedAssessments: numOfAssessments,
      goalsSet: numOfGoals
    }
     response.render('trainerViewMember', viewData);
  },
  
  addComment(request, response) {
    const member = memberStore.getUserById(request.params.userid);
    const assessment = assessmentStore.getAssessment(request.params.id);
    assessment.comment = request.body.comment;
    assessmentStore.editAssessment(assessment);
    
    response.redirect('/member/' + request.params.userid);
  },
  
  deleteMember(request, response) {
    const memberId = request.params.id;
    memberStore.removeUser(memberId);
    response.redirect('/trainerDashboard');
  },
  
  addGoal(request, response) {
    const member = memberStore.getUserById(request.params.userid);
    let assessments = assessmentStore.getUserAssessments(member.id);
    let orderedAssessments = assessments.reverse();
    let currentMeasurement;
    let goalStatus;
     
   let timeStamp = new Date(request.body.date + "Z"); 
  let currentDate = new Date();

    //Formatting date
    let formattedDate = conversion.formatGoalDate(timeStamp);
    
    //Getting current measurements and storing relevant info in currentMeasurement variable
     let bmi;
    
    
      const newGoal = {
      id: uuid.v1(),
      userid: member.id,
      timestamp: formattedDate,
      measurement: request.body.measurement,
      currentMeasurement: currentMeasurement,
      target: Number(request.body.target),
      status: goalStatus
    };
    goalStore.addGoal(newGoal);
    response.redirect('/member/' + request.params.userid);
    
  },
  
  deleteGoal (request, response) {
    
    const goal = goalStore.getGoal(request.params.id);
    const memberId = goal.userid;
    
    goalStore.removeGoal(goal.id);
   response.redirect('/member/' + memberId);
  }
  
  
  
}

module.exports = trainerDashboard;