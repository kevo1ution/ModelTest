const express = require('express');
const path = require('path');
const PATH_FRONTEND = '/../frontend';

const setup = app => {
  app.use(express.static(path.join(__dirname + PATH_FRONTEND, 'build')));

  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + PATH_FRONTEND, 'build', 'index.html'));
  });
};

module.exports = { setup };
