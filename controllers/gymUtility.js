'use strict';

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
const gymUtility = {
  calculateBMI(member, assessment) {
        height = member.height;
        heightSquared = height * height;
        weight = assessment.weight;
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
  
  isIdealBodyWeight(member, assessment) {
        idealWeight = false;
        weight = assessment.weight;
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
        //Logger.info("Ideal Body Weight or not: " + idealWeight);
        //member.setIdealWeight(idealWeight);
        return idealWeight;
    }
  
}

module.exports = gymUtility;