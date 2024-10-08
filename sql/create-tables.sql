-- create database IF NOT EXISTS CRO;
-- use CRO;

CREATE TABLE IF NOT EXISTS RESEARCHES (
   id_research INT(11),
   name VARCHAR(250),
   CONSTRAINT RESEARCHES_PK PRIMARY KEY (id_research)
);

CREATE TABLE IF NOT EXISTS PATIENTS (
   id_patient VARCHAR(11),
   id_research INT(11),
   date DATE,
   CONSTRAINT PATIENTS_PK PRIMARY KEY (id_patient, id_research)
);

CREATE TABLE IF NOT EXISTS LESIONS (
   id_lesion VARCHAR(10),
   id_patient VARCHAR(11),
   id_individualStudy VARCHAR(11),
   id_research INT(11),
   type VARCHAR(3),
   localization VARCHAR(20),
   verbatim VARCHAR(20),
   lymphNode VARCHAR(3),
   basal VARCHAR(5),
   created_by VARCHAR(20),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   record_hash VARCHAR(100),
   CONSTRAINT LESIONS_PK PRIMARY KEY (id_individualStudy, id_lesion, created_at)
);

CREATE TABLE IF NOT EXISTS MEASUREMENTS (
   id_measurement INT(11),
   id_individualStudy VARCHAR(11),
   date DATE,
   id_patient VARCHAR(11),
   id_research INT(11),
   new_lesions VARCHAR(3),
   created_by VARCHAR(20),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   deleted INT(1) DEFAULT 0,
   record_hash VARCHAR(100),
   CONSTRAINT MEASUREMENTS_PK PRIMARY KEY (id_measurement, created_at)
);

CREATE TABLE IF NOT EXISTS LESIONS_MEASUREMENTS (
   id_measurement INT(11),
   id_lesion VARCHAR(10),
   value VARCHAR(10),
   created_by VARCHAR(20),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   record_hash VARCHAR(100),
   CONSTRAINT LESIONS_MEASUREMENTS_PK PRIMARY KEY (id_measurement, id_lesion, created_at)
);

CREATE TABLE IF NOT EXISTS USERS (
   id_user VARCHAR(20),
   role VARCHAR(10),
   password VARCHAR(150),
   CONSTRAINT USER_PK PRIMARY KEY (id_user)
);

CREATE SEQUENCE ID_MEASUREMENT_SEQ START WITH 1 INCREMENT BY 1;