'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    api = require('./routes/api'),
    authController = require('./controllers/auth');

const app = module.exports = express();

function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
      res.status(500).json({ error: err });
    } else {
      next(err);
    }
  }
  
function errorHandler(err, req, res, next) {
  res.status(500).json({error: err})
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

app.get('/api/individualStudies/:id', authController.isAuthenticated, api.getPatientById);
app.get('/api/individualStudies', authController.isAuthenticated, api.searchPatients);
app.post('/api/individualStudies', authController.isAuthenticated, api.addPatient);
app.get('/api/individualStudies/:id/measurements', authController.isAuthenticated, api.getMeasurementsByPatientId);
app.post('/api/individualStudies/:id/measurements', authController.isAuthenticated, api.addMeasurementsByPatientId);
app.get('/api/studies', authController.isAuthenticated, api.getResearches);

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

//app.use(clientErrorHandler);
//app.use(errorHandler);

module.exports = app;