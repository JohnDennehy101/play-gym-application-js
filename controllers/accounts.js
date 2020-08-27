'use strict';

const memberStore = require('../models/member-store');
const trainerStore = require('../models/trainer-store');
const logger = require('../utils/logger');
const uuid = require('uuid');
const assessmentStore = require('../models/assessment-store');

const accounts = {

  index(request, response) {
    const viewData = {
      title: 'Login or Signup',
    };
    response.render('index', viewData);
  },

  login(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('login', viewData);
  },
  
  loginError (request, response) {
    const viewData = {
      title: 'Login to the Service',
      error: true,
    };
    response.render('login', viewData)
  },

  logout(request, response) {
    response.cookie('member', '');
    response.redirect('/');
  },

  signup(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('signup', viewData);
  },

  register(request, response) {
    let invalidName = false;
    let invalidGender = false;
    let invalidEmail = false;
   let invalidPassword = false;
    let invalidAddress = false;
    let invalidHeight = false;
    let invalidWeight = false;
   let user = request.body;
  let nameInput;
  let genderInput;
  let emailInput;
    let passwordInput;
    let addressInput;
    let heightInput;
    let weightInput;
    
    
    nameInput = user.name;
    genderInput = user.gender;
    emailInput = user.email;
    addressInput = user.address;
    heightInput = user.height;
    weightInput = user.startingWeight;
    
    if (user.name.length > 1 && user.gender.length > 1 && (user.gender.charAt(0).toLowerCase() === 'm' || user.gender.charAt(0).toLowerCase() === 'f') && user.email.length > 1 && typeof user.email === 'string' 
        && (user.email.includes('@')) && user.password.length > 1 && user.address.length > 1 && user.height > 0.1 && user.height <= 2.2 && user.startingWeight >= 1 && user.startingWeight <= 300) {
    user.id = uuid.v1();
    memberStore.addUser(user);
    logger.info(`registering ${user.email}`);
    response.redirect('/');
    }
    if (user.name.length < 1) {
      console.log(typeof user.name);
      invalidName = true;
    }
    if (user.gender.length < 1 || (user.gender.charAt(0).toLowerCase() !== 'm' || user.gender.charAt(0).toLowerCase() !== 'f')) {
      invalidGender = true;
    }
    if (user.email.length < 1 || typeof user.email !== 'string' || (!user.email.includes('@'))) {
      invalidEmail = true;
    }
    if (user.password.length < 1) {
      invalidPassword = true;
    }
    if (user.address.length < 1) {
      invalidAddress = true;
    }
    if (user.height <= 0.1 || user.height >= 2.2) {
      invalidHeight = true;
    }
    if (user.startingWeight <= 1 || user.startingWeight >= 300) {
      invalidWeight = true;
    }
    
   
      const data = {
        invalidName: invalidName,
        invalidGender: invalidGender,
        invalidEmail: invalidEmail,
        invalidPassword: invalidPassword,
        invalidAddress: invalidAddress,
        invalidHeight: invalidHeight,
        invalidWeight: invalidWeight,
        invalidInput: true,
        name: nameInput,
        gender: genderInput,
        email: emailInput,
        address: addressInput,
        height: heightInput,
        weight: weightInput
      }
      response.render('signup', data);
    },
  
  

  authenticate(request, response) {
    const user = memberStore.getUserByEmailAndPassword(request.body.email, request.body.password);
    const trainer = trainerStore.getTrainerByEmailAndPassword(request.body.email, request.body.password);
    if (user) {
      response.cookie('member', user.email);
      logger.info(`logging in ${user.email}`);
      response.redirect('/dashboard');
    }
    
    else if (trainer) {
      response.cookie('trainer', trainer.email);
      logger.info(`logging in ${trainer.email}`);
      response.redirect('/trainerDashboard');
    }
    
    else {
      response.redirect('/loginError');
    }
  },

  getCurrentUser(request) {
    const userEmail = request.cookies.member;
    return memberStore.getUserByEmail(userEmail);
  },
  
  getCurrentTrainer(request) {
    const trainerEmail = request.cookies.trainer;
    return memberStore.getUserByEmail(trainerEmail);
  },
  
  accountDetails(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    let assessments = assessmentStore.getUserAssessments(loggedInUser.id);
    let singularCondition = false;
    
    if (assessments.length == 1) {
      singularCondition = true;
    }
    
    const viewData = {
      user: loggedInUser,
      assessments: assessments.length,
      singularCondition: singularCondition,
    };
    
    response.render('accountDetails', viewData);
    
  },
  
  editAccountName(request, response) {
     const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.name = request.body.name;
    memberStore.editUser(loggedInUser);
    response.redirect('/viewAccountDetails');
  },
    editAccountGender(request, response) {
       const loggedInUser = accounts.getCurrentUser(request);
      loggedInUser.gender = request.body.gender;
    memberStore.editUser(loggedInUser);
    response.redirect('/viewAccountDetails');
    
  },
    editAccountEmail(request, response) {
       const loggedInUser = accounts.getCurrentUser(request);
      loggedInUser.email = request.body.email;
      response.cookie('member', loggedInUser.email);
    memberStore.editUser(loggedInUser);
    response.redirect('/viewAccountDetails');
    
  },
    editAccountPassword(request, response) {
       const loggedInUser = accounts.getCurrentUser(request);
      loggedInUser.password = request.body.password;
    memberStore.editUser(loggedInUser);
    response.redirect('/viewAccountDetails');
    
  },
    editAccountHeight(request, response) {
       const loggedInUser = accounts.getCurrentUser(request);
      loggedInUser.height = request.body.height;
    memberStore.editUser(loggedInUser);
    response.redirect('/viewAccountDetails');
    
  },
    editAccountWeight(request, response) {
       const loggedInUser = accounts.getCurrentUser(request);
      loggedInUser.startingWeight = request.body.weight;
    memberStore.editUser(loggedInUser);
    response.redirect('/viewAccountDetails');
    
  },
  
};

module.exports = accounts;