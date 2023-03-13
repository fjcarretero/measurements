const calculus = require('./calculus');
const db = require('./db');

exports.searchPatients = async function (req, res, next) {
  console.log("hola2")
  console.log(req.user)  
  const id = req.query.id_like;
    const research = req.query.studyId;

    //var query = !id ? `select patients.id_patient as id_patient, researches.name as research, DATE_FORMAT(patients.date, '%d-%m-%Y') as date_formatted from CRO.PATIENTS patients, CRO.RESEARCHES researches where patients.id_research = researches.id_research` : `select patients.id_patient as id_patient, patients.id_research, researches.name as research, DATE_FORMAT(patients.date, '%d-%m-%Y') as date_formatted from CRO.PATIENTS patients, CRO.RESEARCHES researches where patients.id_research = researches.id_research and id_patient like '${id}%'`
    var query = `select patients.id_patient as id_patient, researches.name as research, researches.id_research as id_research, DATE_FORMAT(patients.date, '%d-%m-%Y') as date_formatted from CRO.PATIENTS patients, CRO.RESEARCHES researches where patients.id_research = researches.id_research`;
    query = !id ? query : query + ` and id_patient like '${id}%'`
    query = !research ? query : query + ` and patients.id_research = '${research}'`

    let conn;
    try {
        var patients = [];
        conn = await db.pool.getConnection();
        const rows = await conn.query(query);
        for (i = 0, len = rows.length; i < len; i++) {
            patients.push({
                id: `${rows[i].id_research}-${rows[i].id_patient}`,
                patientId: rows[i].id_patient,
                study: rows[i].research,
                studyId: rows[i].id_research,
                date: rows[i].date_formatted
            })
        }
        res.json(patients);
        next()
    } catch (err) {
        next(err);
    } finally {
        if (conn) return conn.end();
        next();
    }
}

exports.getResearches = async function (req, res, next) {
    console.log("hola")
    console.log(req.user)
    let conn;
    try {
        var researches = [];
        conn = await db.pool.getConnection();
        const rows = await conn.query(`select * from CRO.RESEARCHES` );
        for (i = 0, len = rows.length; i < len; i++) {
            researches.push({
                id: rows[i].id_research,
                name: rows[i].name
            })
        }
        res.json(researches);
        next()
    } catch (err) {
      console.log(err)
      if (err.code === 'ER_DUP_ENTRY'){
        next(new Error("Duplicate entry"))
      } else {
        next(new Error("There was an error"));
      }
    } finally {
        if (conn) return conn.end();
        next();
    }
}

exports.getPatientById = async function (req, res, next) {
    var id = req.params.id;
    var split = id.split('-')
    var studyId = split[0]
    var patientId = split[1]

    let conn;
    try {
        var patient = {};

        conn = await db.pool.getConnection();
        const rows = await conn.query(`select patients.id_patient, patients.id_research, researches.name as research, DATE_FORMAT(patients.date, '%d-%m-%Y') as date_formatted from CRO.PATIENTS patients, CRO.RESEARCHES researches where patients.id_research = researches.id_research and id_patient = ?`,[patientId]);
        for (i = 0, len = rows.length; i < len; i++) {
            patient = {
                patientId: rows[i].id_patient,
                study: rows[i].research,
                studyId: rows[i].id_research,
                date: rows[i].date_formatted,
                targetLesions: [],
                nonTargetLesions: []
            };
            const lesionRows = await db.pool.query(`select id_lesion, localization, verbatim, lymphNode, basal, type from CRO.LESIONS where id_individualStudy = ?`,[id]);
            for (j = 0, lesionsLen = lesionRows.length; j < lesionsLen; j++) {
              if (lesionRows[j].type == 'TL')
                patient.targetLesions.push({
                  id: lesionRows[j].id_lesion,
                  localization: lesionRows[j].localization,
                  verbatim: lesionRows[j].verbatim,
                  lymphNode: lesionRows[j].lymphNode,
                  basal: lesionRows[j].basal,
                });
              else {
                patient.nonTargetLesions.push({
                  id: lesionRows[j].id_lesion,
                  localization: lesionRows[j].localization,
                  verbatim: lesionRows[j].verbatim,
                  lymphNode: lesionRows[j].lymphNode,
                  basal: lesionRows[j].basal,
                });
              }
            }
        }
        res.json(calculus.includeSumDiametersBasal(patient));
    } catch (err) {
      console.log(err)
      if (err.code === 'ER_DUP_ENTRY'){
        next(new Error("Duplicate entry"))
      } else {
        next(new Error("There was an error"));
      }
    } finally {
        if (conn) return conn.end();
        next();
    }
}

exports.addPatient = async function (req, res, next) {
   
    var patients = [];
    let conn;
    try {
        var json = req.body;
        conn = await db.pool.getConnection();
        let rows = await conn.query(`insert into CRO.PATIENTS (id_patient, id_research, date) values (?, ?, ?)`, [json.patientId, json.studyId, json.date]);
        json.targetLesions.map(async lesion => 
            rows = await conn.query(`insert into CRO.LESIONS (id_patient, id_lesion, id_individualStudy, id_research, type, localization, verbatim, lymphNode, basal) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [json.patientId, lesion.id, json.id, json.studyId, 'TL', lesion.localization, lesion.verbatim, lesion.lymphNode, lesion.basal])
        );
        json.nonTargetLesions.map(async lesion => 
            rows = await conn.query(`insert into CRO.LESIONS (id_patient, id_lesion, id_individualStudy, id_research, type, localization, verbatim, lymphNode, basal) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [json.patientId, lesion.id, json.id, json.studyId, 'NTL', lesion.localization, lesion.verbatim, lesion.lymphNode, lesion.basal])
        );
        //console.log(json);

        res.status(201).json(json);
    } catch (err) {
        console.log(err)
        if (err.code === 'ER_DUP_ENTRY'){
          next(new Error("Duplicate entry"))
        } else {
          next(new Error("There was an error"));
        }
    } finally {
        if (conn) return conn.end();
        next();
    }
}

exports.getMeasurementsByPatientId = async function (req, res, next) {
  var id = req.params.id;
  let conn;
  try {
        var measurements = [];
        conn = await db.pool.getConnection();
        const rows = await conn.query(`select id_measurement, id_individualStudy, id_patient, DATE_FORMAT(date, '%d-%m-%Y') as date_formatted, new_lesions from CRO.MEASUREMENTS where id_individualStudy = ? ORDER By date desc`, [id] );
        for (i = 0, len = rows.length; i < len; i++) {
            var measurement = {
              id: rows[i].id_measurement,
              patientId: rows[i].id_patient,
              individualStudyId: rows[i].id_individualStudy,
              date: rows[i].date_formatted,
              data: {
                newLesions: rows[i].new_lesions
              }
            };
            const lesionsRows = await conn.query(`select id_lesion, value from CRO.LESIONS_MEASUREMENTS where id_measurement = ?`, [rows[i].id_measurement]);
            for (j = 0, lesionsLen = lesionsRows.length; j < lesionsLen; j++) {
              measurement.data[lesionsRows[j].id_lesion] = lesionsRows[j].value;
            }
            measurements.push(measurement);
        }
    
      //const sum = await db.pool.query(`select sum(basal) as sumBasal from CRO.LESIONS where id_patient = ?`, [id])
      const lesionRows = await conn.query(`select id_lesion, localization, verbatim, lymphNode, basal from CRO.LESIONS where id_individualStudy = ? and type = 'TL'`,[id]);
      var patient = {
        targetLesions: []
      };
      for (j = 0, lesionsLen = lesionRows.length; j < lesionsLen; j++) {
        patient.targetLesions.push({
          id: lesionRows[j].id_lesion,
          localization: lesionRows[j].localization,
          verbatim: lesionRows[j].verbatim,
          lymphNode: lesionRows[j].lymphNode,
          basal: lesionRows[j].basal,
        });
      }
      res.json(calculus.includeCalculus(measurements, patient));
    } catch (err) {
      console.log(err)
        if (err.code === 'ER_DUP_ENTRY'){
          next(new Error("Duplicate entry"))
        } else {
          next(new Error("There was an error"));
        }
  } finally {
      if (conn) return conn.end();
      next();
  }
}

exports.addMeasurementsByPatientId = async function (req, res, next) {
    var id = req.params.id;

    var split = id.split('-')
    var studyId = split[0]
    var patientId = split[1]

    let conn;
    try {
      var json = req.body;
      var measurements = [];
      conn = await db.pool.getConnection();
      const seqQuery = await conn.query(`select NEXT VALUE FOR CRO.ID_MEASUREMENT_SEQ as val`);
      const seq = seqQuery[0].val;
      const rows = await conn.query(`insert into CRO.MEASUREMENTS (id_measurement, id_individualStudy, id_patient, date, new_lesions) values (?, ?, ?, ?, ?)`, [seq, id, patientId, json.date, json.data.newLesions] );
      Object.keys(json.data).map(key => {
        if (key.startsWith('tl') || key.startsWith('ntl')) {
          conn.query(`insert into CRO.LESIONS_MEASUREMENTS (id_measurement, id_lesion, value) values (?, ?, ?)`, [seq, key, json.data[key]])
        }
      });
      json.id = seq.toString();    
          
        //const sum = await db.pool.query(`select sum(basal) as sumBasal from CRO.LESIONS where id_patient = ?`, [id])
        const lesionRows = await conn.query(`select id_lesion, localization, verbatim, lymphNode, basal from CRO.LESIONS where id_individualStudy = ? and type = 'TL'`,[id]);
        var patient = {
          targetLesions: []
        };
        for (j = 0, lesionsLen = lesionRows.length; j < lesionsLen; j++) {
          patient.targetLesions.push({
            id: lesionRows[j].id_lesion,
            localization: lesionRows[j].localization,
            verbatim: lesionRows[j].verbatim,
            lymphNode: lesionRows[j].lymphNode,
            basal: lesionRows[j].basal,
          });
        }
        let re = calculus.includeCalculus(json, patient);
        //console.log(re);
        res.status(201).json(re);
      } catch (err) {
        console.log(err)
        if (err.code === 'ER_DUP_ENTRY'){
          next(new Error("Duplicate entry"))
        } else {
          next(new Error("There was an error"));
        }
    } finally {
        if (conn) return conn.end();
        next();
    }
}