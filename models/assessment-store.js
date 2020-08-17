'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const assessmentStore = {

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

  /*addSong(id, song) {
    const playlist = this.getPlaylist(id);
    playlist.songs.push(song);
    
    let duration = 0;
    
    for (let i=0; i< playlist.songs.length; i++) {
      duration = duration + Number(playlist.songs[i].duration);
    }
    
    playlist.duration = duration;
    this.store.save();
  },

  removeSong(id, songId) {
    const playlist = this.getPlaylist(id);
    const songs = playlist.songs;
    _.remove(songs, { id: songId});
    this.store.save();
  }, */
  
    getUserAssessments(userid) {
    return this.store.findBy(this.collection, { userid: userid });
  },
};

module.exports = assessmentStore;