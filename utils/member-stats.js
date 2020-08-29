'use strict';
const assessmentStore = require('../models/assessment-store');
//const accounts = require ('./accounts.js');
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
        //Logger.info("BMI value in GYM UTILITY " + bmi);
        return bmi;
    },
  
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
        //Logger.info("BMI Category value in GYM UTILITY: " + bmiCategory);
        return bmiCategory;

    },
  
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
  
  sortGoals (goals) {
    goals.sort(function (a, b) {
    if (a.timestamp > b.timestamp) {
        return -1;
    }
    if (b.timestamp > a.timestamp) {
        return 1;
    }
    return 0;
});
    
    return goals;
  },
  
  filterGoals (goals) {
    goals = goals.filter((goal) => {
      return (!goal.timestamp.includes("undefined-NaN") && goal.target !== 0);
  });
    return goals;
  },
  
  
  determineGoalsStatus (goals, orderedAssessments, user) {
    let currentDate = new Date();
    let assessments = assessmentStore.getUserAssessments(user.id);
    let currentMeasurement;
    goals.forEach((goal, index) => {
      goal.latestAssessmentForGoal = [];
        let assessmentMatch = [];
    
    
     if (orderedAssessments.length === 0 && currentDate < Date.parse(goal.timestamp)) {
          goal.status = 'Open';
         goal.finalMeasurement = "Final measurement yet to be captured."
          }
      
    
      else if (orderedAssessments.length === 0 && currentDate > Date.parse(goal.timestamp)) {
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
          
       
              assessmentMatch.push(assessmentStore.getAssessmentByDate(orderedAssessments[i].timestamp));
          
         
          if (goal.measurement.toLowerCase() === "bmi") {
         
              let bmi = memberStats.calculateBMI(user, goal.latestAssessmentForGoal);
            console.log(bmi);
              currentMeasurement = bmi;
            
    
      if (Date.parse(goal.latestAssessmentForGoal[0].timestamp) < currentDate && currentDate > Date.parse(goal.timestamp) && currentMeasurement <= goal.target) {
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
          
    
    else if (goal.measurement.toLowerCase() === "weight") {
     
      let weight = goal.latestAssessmentForGoal[0].weight;
      
     currentMeasurement = weight;
      if (Date.parse(goal.latestAssessmentForGoal[0].timestamp) < currentDate && currentDate > Date.parse(goal.timestamp) && currentMeasurement <= goal.target) {
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
     
      if (Date.parse(goal.latestAssessmentForGoal[0].timestamp) < currentDate &&  currentDate > Date.parse(goal.timestamp) && currentMeasurement <= goal.target) {
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
       //console.log(assessmentMatch[0].timestamp);
         currentMeasurement = thigh;
       //assessmentMatch.splice(0);
     
      if (Date.parse(goal.latestAssessmentForGoal[0].timestamp) < currentDate && currentDate > Date.parse(goal.timestamp) && currentMeasurement <= goal.target) {
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
     
      if (Date.parse(goal.latestAssessmentForGoal[0].timestamp) < currentDate && currentDate > Date.parse(goal.timestamp) && currentMeasurement <= goal.target) {
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
     
      if (Date.parse(goal.latestAssessmentForGoal[0].timestamp) < currentDate && currentDate > Date.parse(goal.timestamp) &&  currentMeasurement <= goal.target) {
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
     
      if (Date.parse(goal.latestAssessmentForGoal[0].timestamp) < currentDate && currentDate > Date.parse(goal.timestamp) &&  currentMeasurement <= goal.target) {
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
       
      }
      
      else {
          goal.status = "Not Applicable";
          goal.finalMeasurement = "No assessments completed before this date";
          
        } 
        
        
     
    })
    
    return goals;
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
  
  calculateNumberOfAssessments (orderedAssessments) {
     if (orderedAssessments.length > 0) {
       return true;
  }
    else {
     return false;
    }
    
  },
  
   multipleAssessments (assessments) {
     if (assessments.length > 1) {
       return true;
     }  
        else {
          return false;
        }
      },
  
  calculateTotalAssessmentsFigure (members) {
    members.forEach((member) => {
      member.totalAssessments = assessmentStore.getUserAssessments(member.id).length;
    });
    
    return members;
  },
  
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