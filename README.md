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

## To test in development

The project can be tested with only front and mock server. This way you test what is in `web/src` folder

    npm run dev

The files that control de mock server are: 
* `mock-db.js` which controls the entities defined in the application.
* `mock-routes.js` mappings for urls
* `mock-middleware.js` transformations, in our case, for the responses from the api

## For production

For production, a container is created with the data. The folder structure and the .env file must be created as the first step.

Create the container

    docker-compose build node

Start the containers

    docker-compose up -d

# Creating the database structure



