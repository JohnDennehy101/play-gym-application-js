'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const assessmentStore = {
//Initiating the store
  store: new JsonStore('./models/assessment-store.json', { assessmentCollection: [] }),
  collection: 'assessmentCollection',

  getAllAssessments() {
    return this.store.findAll(this.collection);
  },

  getAssessment(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },
  
  getAssessmentByDate(timestamp) {
    return this.store.findOneBy(this.collection, { timestamp: timestamp });
  },

  addAssessment(assessment) {
    this.store.add(this.collection, assessment);
    this.store.save();
  },
  
  editAssessment(assessment) {
    this.store.save();
  },

  removeAssessment(id) {
    const assessment = this.getAssessment(id);
    this.store.remove(this.collection, assessment);
    this.store.save();
  },

  removeAllAssessments() {
    this.store.removeAll(this.collection);
    this.store.save();
  },

    getUserAssessments(userid) {
    return this.store.findBy(this.collection, { userid: userid });
  },
};

module.exports = assessmentStore;