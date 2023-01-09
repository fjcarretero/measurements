const passport = require('passport');
const crypto = require('crypto'); 
const db = require('../routes/db');
const BasicStrategy = require('passport-http').BasicStrategy;
require('dotenv').config();
const salt = process.env.SALT; 

// passport.use(new DigestStrategy(
//   { qop: 'auth' },
//   function(username, callback) {

//     if (username == "mauro") {
//         return callback(null, username, "password");
//     } else {
//         return callback(null, false);
//     }
//   },
//   function(params, callback) {
//     // validate nonces as necessary
//     callback(null, true);
//   }
// ));

passport.use(new BasicStrategy(
  function(userid, password, done) {
    db.pool.getConnection()
      .then(conn => 
        conn.query(`select * from CRO.USERS where id_user=?`, [userid] )
          .then(rows => {
            if (rows.length != 1) return done(null, false);
            var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
            if (hash != rows[0].password) return done(null, false);
            return done(null, userid);
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
    }
));

exports.isAuthenticated = passport.authenticate(['basic'], { session : false });