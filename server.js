'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    session = require('express-session'),
    api = require('./routes/api'),
    authController = require('./controllers/auth'),
    db = require('./routes/db');

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
  
passport.serializeUser(function (req, user, done) {
  done(null, user);
})

passport.deserializeUser(function (req, user, done) {
  //If using Mongoose with MongoDB; if other you will need JS specific to that schema.
  // User.findById(user.id, function (err, user) {
  //     done(err, user);
  // });
  console.log('deserializeUser')

  console.log(user)
  db.pool.getConnection()
    .then(conn => 
      conn.query(`select * from CRO.USERS where id_user=?`, [user] )
        .then(rows => {
            console.log(rows[0])
            return done(null, rows[0]);
        })      
        .then(() => 
            conn.end()
        )
        .catch(err => {
        //handle error
            done(err); 
            conn.end();
        })
      ).catch(err => {
          done(err);
      });
});

//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');
//app.use(bodyParser.json());
// app.use(express.methodOverride());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
// app.use(session({ secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { secure: true } }));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(authController.isAuthenticated);

app.use((req, res, next) => {
  res.set('x-role', req.user.role);
  next()
});

app.get('/api/individualStudies/:id', authController.isAuthenticated, api.getPatientById);
app.get('/api/individualStudies', api.searchPatients);
app.post('/api/individualStudies', authController.isAuthenticated, api.addPatient);
app.put('/api/individualStudies/:id/targetLesions/:lesionId', authController.isAuthenticated, api.modifyTargetLesion);
app.put('/api/individualStudies/:id/nonTargetLesions/:lesionId', authController.isAuthenticated, api.modifyNonTargetLesion);
app.get('/api/individualStudies/:id/measurements', authController.isAuthenticated, api.getMeasurementsByPatientId);
app.post('/api/individualStudies/:id/measurements', authController.isAuthenticated, api.addMeasurementsByPatientId);
app.put('/api/individualStudies/:id/measurements/:measurementId', authController.isAuthenticated, api.modifyMeasurementsByPatientId);
app.delete('/api/individualStudies/:id/measurements/:measurementId', authController.isAuthenticated, api.deleteMeasurementsByPatientId);
app.get('/api/studies', api.getResearches);

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