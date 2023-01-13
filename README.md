# measurements

## How to start

Create a file `.env` with the following entries:

    MARIADB_ROOT_PASSWORD=<password>
    MARIADB_USER=<user>
    MARIADB_PASSWORD=<password>
    SALT=<Hex string>
    CERT_KEY="-----BEGIN PRIVATE KEY-----
    xxxxxxxx
    -----END PRIVATE KEY-----"
    CERT_PEM="-----BEGIN CERTIFICATE-----
    xxxxx
    -----END CERTIFICATE-----"
 
Create de folder structure

    mkdir public
    mkdir mariadb-data

Install node dependencies
    
    npm -i

Install javascript dependencies

    cd web
    npm -i

Pack de javascript code

    cd web
    npm run build



