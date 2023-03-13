const db = require('../routes/db');

class User {
    static findById() {
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
}