"use strict";

const express = require("express");
const router = express.Router();
const accounts = require('./controllers/accounts.js');
const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");
const trainerDashboard = require("./controllers/trainerDashboard.js");
//const playlist = require('./controllers/playlist.js');

router.get("/dashboard", dashboard.index);
router.get("/trainerDashboard", trainerDashboard.index);
router.get("/trainerDashboard/:id", trainerDashboard.deleteMember);
router.get("/member/:id", trainerDashboard.viewMember);
router.get("/about", about.index);
//router.get('/playlist/:id', playlist.index);
//router.get('/deleteplaylist/:id', playlist.deletePlaylist);
//router.get('/playlist/:id/deletesong/:songid', playlist.deleteSong);
router.get('/', accounts.login);
router.get('/login', accounts.login);
router.get('/viewAccountDetails', accounts.accountDetails);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.get('/deleteassessment/:id', dashboard.deleteAssessment);
router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);
router.post('/addAssessment', dashboard.addAssessment);
router.post('/addGoal', dashboard.addGoal);
router.post('/editAccountName', accounts.editAccountName);
router.post('/editAccountGender', accounts.editAccountGender);
router.post('/editAccountEmail', accounts.editAccountEmail);
router.post('/editAccountPassword', accounts.editAccountPassword);
router.post('/editAccountHeight', accounts.editAccountHeight);
router.post('/editAccountWeight', accounts.editAccountWeight);
router.post('/member/:userid/:id', trainerDashboard.addComment);
router.post('/member/:userid', trainerDashboard.addGoal);


//router.post('/playlist/:id/addsong', playlist.addSong);
//router.post('/dashboard/addplaylist', dashboard.addPlaylist);

module.exports = router;
