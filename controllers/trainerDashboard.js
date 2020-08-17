"use strict";
const accounts = require ('./accounts.js');
const memberStore = require('../models/member-store');
const assessmentStore = require('../models/assessment-store');
const gymUtility = require('./gymUtility');
const goalStore = require('../models/goal-store');
const uuid = require('uuid');

const trainerDashboard = {
  index(request, response) {
    let totalAssessments;
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const allMembers = memberStore.getAllUsers();
    
    allMembers.forEach((member) => {
      
      //console.log(totalAssessments);
      let nameComponents = member.name.split(" ");
      let formattedNameComponents = nameComponents.map((name) => 
       name.charAt(0).toUpperCase() + name.slice(1)
      )
        if (formattedNameComponents.length === 1) {
          member.name = formattedNameComponents[0];
        }
      else {
        member.name = `${formattedNameComponents[0]} ${formattedNameComponents[1]}`;
      }
     
    
      //`${formattedNameComponents[0]} ${formattedNameComponents[1]}`;
      member.totalAssessments = assessmentStore.getUserAssessments(member.id).length;
    })
    
      //console.log(totalAssessments);
    const viewData = {
      members: allMembers,
      //totalAssessments: totalAssessments,
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
    if (orderedAssessments.length > 0) {
      bmi = gymUtility.calculateBMI(member, orderedAssessments[0]);
      bmiCategory = gymUtility.determineBMICategory(bmi);
       isIdealWeight = gymUtility.isIdealBodyWeight(member, orderedAssessments[0]);
    }
    else {
      height = member.height;
            heightSquared = height * height;
            weight = member.startingWeight;
            bmi = weight / heightSquared;
            bmi = Math.floor(bmi * 100) / 100;
       bmiCategory = gymUtility.determineBMICategory(bmi);
      let assessment = {"weight": member.startingWeight};
      isIdealWeight = gymUtility.isIdealBodyWeight(member, assessment);
    }
    
    
    
    const viewData = {
      user: member,
      assessments: orderedAssessments,
      bmi: bmi,
      bmiCategory: bmiCategory,
      isIdealWeight: isIdealWeight,
      trend: assessmentTrend,
      goals: goals
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
      userid: member.id,
      timestamp: formattedDate,
       //timestamp: request.body.date,
      measurement: request.body.measurement,
      currentMeasurement: currentMeasurement,
      target: request.body.target,
      status: goalStatus
    };
    goalStore.addGoal(newGoal);
    response.redirect('/member/' + request.params.userid);
    
  }
  
  
  
}

module.exports = trainerDashboard;