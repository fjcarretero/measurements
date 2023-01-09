'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    routes = require('./routes'),
    api = require('./routes/api'),
    authController = require('./controllers/auth');

const app = module.exports = express();

function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
      res.send(500, { error: 'Something blew up!' });
    } else {
      next(err);
    }
  }
  
function errorHandler(err, req, res, next) {
  res.status(500);
  console.log(err);
  res.send('error', { error: err });
}
  
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');
//app.use(bodyParser.json());
// app.use(express.methodOverride());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(authController.isAuthenticated);
app.use(express.static(__dirname + '/public'));
// app.use(express.session({ secret: 'keyboard cat' }));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(clientErrorHandler);
app.use(errorHandler);

app.get('/api/patients/:id', authController.isAuthenticated, api.getPatientById);
app.get('/api/patients', authController.isAuthenticated, api.searchPatients);
app.post('/api/patients', authController.isAuthenticated, api.addPatient);
app.get('/api/patients/:id/measurements', authController.isAuthenticated, api.getMeasurementsByPatientId);
app.post('/api/patients/:id/measurements', authController.isAuthenticated, api.addMeasurementsByPatientId);
app.get('/api/researchs', authController.isAuthenticated, api.getResearches);

module.exports = app;