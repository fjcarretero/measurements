const calculus = require('./calculus');
const db = require('./db');

exports.searchPatients = async function (req, res, next) {
    var id = req.query.id_like;

    var query = !id ? `select * from CRO.PATIENTS where id_patient` : `select * from CRO.PATIENTS where id_patient like '${id}%'`

    let conn;
    try {
        var patients = [];
        conn = await db.pool.getConnection();
        const rows = await conn.query(query);
        for (i = 0, len = rows.length; i < len; i++) {
            patients.push({
                id: rows[i].id_patient,
                research: rows[i].id_research,
            })
        }
        res.json(patients);
    } catch (err) {
        next(err);
    } finally {
        if (conn) return conn.end();
        next();
    }
}

exports.getResearches = async function (req, res, next) {
    let conn;
    try {
        var researches = [];
        conn = await db.pool.getConnection();
        const rows = await conn.query(`select * from CRO.RESEARCHES` );
        for (i = 0, len = rows.length; i < len; i++) {
            researches.push({
                id: rows[i].id_research,
            })
        }
        res.json(researches);
    } catch (err) {
        next(err);
    } finally {
        if (conn) return conn.end();
        next();
    }
}

exports.getPatientById = async function (req, res, next) {
    var id = req.params.id;

    let conn;
    try {
        var patient = {};

        conn = await db.pool.getConnection();
        const rows = await conn.query(`select * from CRO.PATIENTS where id_patient = ?`,[id]);
        for (i = 0, len = rows.length; i < len; i++) {
            patient = {
                id: rows[i].id_patient,
                research: rows[i].id_research,
                targetLesions: [],
                nonTargetLesions: []
            };
            const lesionRows = await db.pool.query(`select * from CRO.LESIONS where id_patient = ?`,[id]);
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
        next(err);
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
        let rows = await conn.query(`insert into CRO.PATIENTS (id_patient, id_research) values (?, ?)`, [json.id, json.research]);
        json.targetLesions.map(async lesion => 
            rows = await conn.query(`insert into CRO.LESIONS (id_patient, id_lesion, id_research, type, localization, verbatim, lymphNode, basal) values (?, ?, ?, ?, ?, ?, ?, ?)`, [json.id, lesion.id, json.research, 'TL', lesion.localization, lesion.verbatim, lesion.lymphNode, lesion.basal])
        );
        json.nonTargetLesions.map(async lesion => 
            rows = await conn.query(`insert into CRO.LESIONS (id_patient, id_lesion, id_research, type, localization, verbatim, lymphNode, basal) values (?, ?, ?, ?, ?, ?, ?, ?)`, [json.id, lesion.id, json.research, 'NTL', lesion.localization, lesion.verbatim, lesion.lymphNode, lesion.basal])
        );
        console.log(json);

        res.status(201).json(json);
    } catch (err) {
        next(err);
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
        const rows = await conn.query(`select id_measurement, id_patient, DATE_FORMAT(date, '%d-%m-%Y') as date, new_lesions from CRO.MEASUREMENTS where id_patient = ? ORDER By date`, [id] );
        for (i = 0, len = rows.length; i < len; i++) {
            var measurement = {
              id: rows[i].id_measurement,
              patientId: rows[i].id_patient,
              date: rows[i].date,
              data: {
                newLesions: rows[i].new_lesions
              }
            };
            const lesionsRows = await conn.query(`select * from CRO.LESIONS_MEASUREMENTS where id_measurement = ?`, [rows[i].id_measurement]);
            for (j = 0, lesionsLen = lesionsRows.length; j < lesionsLen; j++) {
              measurement.data[lesionsRows[j].id_lesion] = lesionsRows[j].value;
            }
            measurements.push(measurement);
        }
    
      //const sum = await db.pool.query(`select sum(basal) as sumBasal from CRO.LESIONS where id_patient = ?`, [id])
      const lesionRows = await conn.query(`select * from CRO.LESIONS where id_patient = ? and type = 'TL'`,[id]);
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
      next(err);
  } finally {
      if (conn) return conn.end();
      next();
  }
}

exports.addMeasurementsByPatientId = async function (req, res, next) {
    var id = req.params.id;
    let conn;
    try {
      var json = req.body;
      var measurements = [];
      conn = await db.pool.getConnection();
      const seqQuery = await conn.query(`select NEXT VALUE FOR CRO.ID_MEASUREMENT_SEQ as val`);
      const seq = seqQuery[0].val;
      const rows = await conn.query(`insert into CRO.MEASUREMENTS (id_measurement, id_patient, date, new_lesions) values (?, ?, ?, ?)`, [seq, id, json.date, json.data.newLesions] );
      Object.keys(json.data).map(key => {
        if (key.startsWith('tl') || key.startsWith('ntl')) {
          conn.query(`insert into CRO.LESIONS_MEASUREMENTS (id_measurement, id_lesion, value) values (?, ?, ?)`, [seq, key, json.data[key]])
        }
      });
      json.id = seq;    
          
        //const sum = await db.pool.query(`select sum(basal) as sumBasal from CRO.LESIONS where id_patient = ?`, [id])
        const lesionRows = await conn.query(`select * from CRO.LESIONS where id_patient = ? and type = 'TL'`,[id]);
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
        res.json(calculus.includeCalculus(json, patient));
      } catch (err) {
        next(err);
    } finally {
        if (conn) return conn.end();
        next();
    }
}