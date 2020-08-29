'use strict';
const assessmentStore = require('../models/assessment-store');
let bmi;
let height;
let heightSquared;
let weight;
let bmiCategory;
let idealWeight;
let heightInCentimetres;
let inches;
let feet;
let excessInches;
let inchesWeight;
let optimalMaleWeight;
let optimalFemaleWeight;
const memberStats = {
 //Method for calculating a members' BMI
  calculateBMI(member, assessments) {
    let weight;
     height = member.height;
    heightSquared = height * height;
    if (assessments.length > 0) {
        weight = assessments[0].weight;
    }
    else {
       weight = member.startingWeight; 
    }
    bmi = weight / heightSquared;
        bmi = Math.round(bmi * 100.0) / 100;
        return bmi;
    },
  //Method for determining a members' BMI category
  determineBMICategory(bmiValue) {
        if (bmiValue < 16) {
            bmiCategory = "SEVERELY UNDERWEIGHT";
        } else if (bmiValue >= 16 && bmiValue < 18.5) {
            bmiCategory = "UNDERWEIGHT";
        } else if (bmiValue >= 18.5 && bmiValue < 25) {
            bmiCategory = "NORMAL";
        } else if (bmiValue >= 25 && bmiValue < 30) {
            bmiCategory = "OVERWEIGHT";
        } else if (bmiValue >= 30 && bmiValue < 35) {
            bmiCategory = "MODERATELY OBESE";
        } else {
            bmiCategory = "SEVERELY OBESE";
        }
        return bmiCategory;

    },
  
  
  //Method for determining if the user is at the ideal weight or not (boolean)
  isIdealBodyWeight(member, assessments) {
        idealWeight = false;
     if (assessments.length > 0) {
        weight = assessments[0].weight;
    }
    else {
       weight = member.startingWeight; 
    }
        height = member.height;
        heightInCentimetres = height * 100;
        inches = heightInCentimetres * 0.393701;
        feet = inches / 12;
        excessInches = inches - 60;
        inchesWeight = excessInches * 2.3;
        optimalMaleWeight = 50 + inchesWeight;
        optimalFemaleWeight = 45.5 + inchesWeight;
    

        if (feet < 5 && member.gender.toUpperCase().charAt(0) == 'M') {
            optimalMaleWeight = 50;
        } else if (feet < 5 && member.gender.toUpperCase().charAt(0) == 'F') {
            optimalFemaleWeight = 45.5;
        }

        if (member.gender.toUpperCase().charAt(0) == 'M' && feet >= 5 && weight >= (optimalMaleWeight - 0.2) && weight <= (optimalMaleWeight + 0.2)) {

            idealWeight = true;
        } else if (member.gender.toUpperCase().charAt(0) == 'F' && feet >= 5 && weight >= (optimalFemaleWeight - 0.2) && weight <= (optimalFemaleWeight + 0.2)) {

            idealWeight = true;

        } else if (member.gender.toUpperCase().charAt(0) == 'U' && feet >= 5 && weight >= (optimalFemaleWeight - 0.2) && weight <= (optimalFemaleWeight + 0.2)) {


            if (weight >= (optimalFemaleWeight - 0.2) && weight <= (optimalFemaleWeight + 0.2)) {
                idealWeight = true;
            }
        } else if (height < 5 && member.gender.toUpperCase().charAt(0) == 'F') {
            optimalFemaleWeight = 45;
        }
    
        return idealWeight;
    },
  
  
  //Method for sorting the goals by date
  sortGoals (goals) {
    goals.sort(function (a, b) {
    if (Date.parse(a.timestamp) > Date.parse(b.timestamp)) {
        return -1;
    }
    if (Date.parse(b.timestamp) > Date.parse(a.timestamp)) {
        return 1;
    }
    return 0;
});
    
    return goals;
  },
  
  //Method for filtering goals so that goals added without a date or target are not displayed to the user
  filterGoals (goals) {
    goals = goals.filter((goal) => {
      return (!goal.timestamp.includes("undefined-NaN") && goal.target !== 0);
  });
    return goals;
  },
  
  //Method for determining the goal status of each goal and establishing the final measurement for each goal set
  determineGoalsStatus (goals, orderedAssessments, user) {
    let currentDate = new Date();
    let currentMeasurement;
    goals.forEach((goal, index) => {
      goal.latestAssessmentForGoal = [];
    
     if (orderedAssessments.length === 0 && currentDate < Date.parse(goal.timestamp)) {
       console.log(orderedAssessments.length);
          goal.status = 'Open';
         goal.finalMeasurement = "Final measurement yet to be captured."
          }
      
    
      else if (orderedAssessments.length === 0 && currentDate > Date.parse(goal.timestamp)) {
        console.log(orderedAssessments.length);
        goal.status = 'Closed';
         goal.finalMeasurement = "No assessments completed before this date.";
      }
      
  
      else if (orderedAssessments.length > 0) {
      
        for (let i=0; i< orderedAssessments.length; i++) {

       
          if (Date.parse(orderedAssessments[i].timestamp) < Date.parse(goal.timestamp)) {
       
          if (goal.latestAssessmentForGoal.length < 1) {
       
            goal.latestAssessmentForGoal.push(orderedAssessments[i]);
          }
          else {
            break;
          }
            
  
            
            if (Date.parse(goal.latestAssessmentForGoal[0].timestamp) < currentDate && currentDate > Date.parse(goal.timestamp)) {
              if (goal.measurement.toLowerCase() === "bmi") {
                 let bmi = memberStats.calculateBMI(user, goal.latestAssessmentForGoal);
               
              currentMeasurement = bmi;
               goal.status = memberStats.setGoalStatus(currentMeasurement, goal);
                goal.finalMeasurement = memberStats.setGoalFinalMeasurement(currentMeasurement);
                
              
              }
              
              else if (goal.measurement.toLowerCase() === "weight") {
                let weight = goal.latestAssessmentForGoal[0].weight;
      
     currentMeasurement = weight;
              goal.status = memberStats.setGoalStatus(currentMeasurement, goal);
                goal.finalMeasurement = memberStats.setGoalFinalMeasurement(currentMeasurement);
            
            }
              
                else if (goal.measurement.toLowerCase() === "chest") {
                let chest = goal.latestAssessmentForGoal[0].chest;
      
     currentMeasurement = chest;
              goal.status = memberStats.setGoalStatus(currentMeasurement, goal);
                goal.finalMeasurement = memberStats.setGoalFinalMeasurement(currentMeasurement);
            
            }
              
                else if (goal.measurement.toLowerCase() === "upper arm") {
                let upperArm = goal.latestAssessmentForGoal[0].upperArm;
      
     currentMeasurement = upperArm;
              goal.status = memberStats.setGoalStatus(currentMeasurement, goal);
                goal.finalMeasurement = memberStats.setGoalFinalMeasurement(currentMeasurement);
            
            }
              
                else if (goal.measurement.toLowerCase() === "thigh") {
                let thigh = goal.latestAssessmentForGoal[0].thigh;
      
     currentMeasurement = thigh;
              goal.status = memberStats.setGoalStatus(currentMeasurement, goal);
                goal.finalMeasurement = memberStats.setGoalFinalMeasurement(currentMeasurement);
            
            }
                else if (goal.measurement.toLowerCase() === "hips") {
                let hips = goal.latestAssessmentForGoal[0].hips;
      
     currentMeasurement = hips;
              goal.status = memberStats.setGoalStatus(currentMeasurement, goal);
                goal.finalMeasurement = memberStats.setGoalFinalMeasurement(currentMeasurement);
            
            }
              
                else if (goal.measurement.toLowerCase() === "waist") {
                let waist = goal.latestAssessmentForGoal[0].waist;
      
     currentMeasurement = waist;
              goal.status = memberStats.setGoalStatus(currentMeasurement, goal);
                goal.finalMeasurement = memberStats.setGoalFinalMeasurement(currentMeasurement);
            
            }
      
            }
            
            else if (currentDate < Date.parse(goal.timestamp)) {
           goal.status = "Open";
              goal.finalMeasurement = "Final measurement yet to be captured." 
          }
     
          
        }
        
      else {
              goal.status = 'Closed';
         goal.finalMeasurement = "No assessments completed before this date.";
            }  
          
        }
       
      }
      
     
     
   
    })
   
    return goals;
  },
  
  //Sets goal status to achieved or missed (used in determineGoalsStatus method for goals where the date is < current date)
  setGoalStatus (currentMeasurement, goal) {
    let goalStatus;
    
        if (currentMeasurement <= goal.target) {
               goalStatus = "Achieved";
              }
              else if (currentMeasurement > goal.target) {
                  goalStatus = "Missed";
              }
    console.log(goalStatus);
    return goalStatus;
  },
  
  setGoalFinalMeasurement (currentMeasurement) {
    let finalMeasurement;
  finalMeasurement = currentMeasurement
    return finalMeasurement;
  },
  
  determineAssessmentTrend (orderedAssessments) {
       if (orderedAssessments.length > 0) {
        //numOfAssessments = true;
        if (orderedAssessments.length === 1) {
           orderedAssessments[0].trend = "Not Applicable";
        }
        
      
    if (orderedAssessments.length >= 2) {
      
          for (let i=0; i < orderedAssessments.length; i++)  {
            
            if (orderedAssessments.length - i === 1) {
               orderedAssessments[(orderedAssessments.length - 1)].trend = "Not Applicable";
              break;
            }
            
            else if (orderedAssessments[(i)].weight < orderedAssessments[(i + 1)].weight) {
             
              orderedAssessments[i].trend = "Positive";
             
            }
            else if (orderedAssessments[i].weight > orderedAssessments[(i + 1)].weight) {
            
              orderedAssessments[i].trend = "Negative";
            
            }
            else {
              
              orderedAssessments[i].trend = "Neutral";
            }
           
          }   
      
       
    } 
        
         }
    
     else {
     
    }
    
   
    return orderedAssessments;
  },
  
  
//Method used to determine if the assessment table should be displayed on the dashboard
  calculateNumberOfAssessments (orderedAssessments) {
     if (orderedAssessments.length > 0) {
       return true;
  }
    else {
     return false;
    }
    
  },
    //Method used to determine if charts should be displayed on the dashboard
   multipleAssessments (assessments) {
     if (assessments.length > 1) {
       return true;
     }  
        else {
          return false;
        }
      },
  
  //Method used to calculated total number of assessments for each member. Used on the trainer dashboard
  calculateTotalAssessmentsFigure (members) {
    members.forEach((member) => {
      member.totalAssessments = assessmentStore.getUserAssessments(member.id).length;
    });
    
    return members;
  },
  
  //Method used to determine if the goal table should be displayed on the dashboard
  calculateNumberOfGoals (goals) {
     if (goals.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }
}

module.exports = memberStats;