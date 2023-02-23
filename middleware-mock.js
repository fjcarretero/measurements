module.exports = (req, res, next) => {
    const db = require('./mock-db.json');
    const calculus = require('./routes/calculus');
    var send = res.send;
    var passed = false;
    console.log("calulus");
    res.send = function (body) { // It might be a little tricky here, because send supports a variety of arguments, and you have to make sure you support all of them!
        // Do something with the body...
        console.log(req.url);
        console.log(req.method);
        if (req.url.includes("measurements") &&req.method == "GET" && !passed) {
            passed = true;
            let bodyJSON = JSON.parse(body)
            if (bodyJSON[0]?.individualStudyId) {
                let individualStudyId = bodyJSON[0].individualStudyId
                console.log(individualStudyId)
                let patientData = db.individualStudies.filter(individualStudy => individualStudy.id == individualStudyId)[0];
                console.log(patientData)
                bodyJSON = calculus.includeCalculus(bodyJSON, patientData);
            }
            //console.log("paso por aqui");
            send.call(this, bodyJSON);
        } else if (req.url.includes("individualStudies") &&req.method == "GET" && !passed) {
            passed = true;
            let bodyJSON1 = JSON.parse(body)
            let bodyJSON = calculus.includeSumDiametersBasal(bodyJSON1, db);
            //console.log("paso por aqui");
            send.call(this, bodyJSON);        
        } else {
            send.call(this, body);
        }
    };
    next();
  }

exports.includeCalculus = (body, db, formulas) => {
            
    if (bodyJSON[0]?.patientId) {
        let patientId = bodyJSON[0].patientId

        let patientData = db.patients.filter(patient => patient.id == patientId)[0];
        const sumDiametersBasal = formulas.calculateSumDiametersBasal(patientData.targetLesions);
        let sumDiameters = formulas.calculateSumDiameters(bodyJSON, sumDiametersBasal);
        const nadir = formulas.calculateNADIR(bodyJSON, sumDiameters);
        const percentageFromBasal = formulas.calculatePercentageFromBasal(bodyJSON, sumDiameters);
        const percentageFromNADIR = formulas.calculatePercentageFromNADIR(bodyJSON, sumDiameters, nadir);
        const targetResponse = formulas.calculateTargetResponse(bodyJSON, patientData.targetLesions, sumDiameters, nadir, percentageFromBasal, percentageFromNADIR);
        const nonTargetResponse = formulas.calculateNonTargetResponse(bodyJSON);
        const overallResponse = formulas.calculateOverallResponse(bodyJSON, targetResponse, nonTargetResponse);
        
        bodyJSON.sort((a,b) => { return a.date > b.date ? -1 : 0}).map(measurement => {
            measurement['calculus'] = {
                data: {
                    targetLesions: {
                        sumDiameters: sumDiameters[measurement.date],
                        nadir: nadir[measurement.date],
                        percentageFromBasal: percentageFromBasal[measurement.date],
                        percentageFromNadir: percentageFromNADIR[measurement.date],
                        response: targetResponse[measurement.date]
                    },
                    nonTargetLesions: {
                        response: nonTargetResponse[measurement.date]
                    },
                    response: overallResponse[measurement.date]
                }
            }
        })
    }
    return bodyJSON;
}

exports.includeSumDiametersBasal = (body, db, formulas) => {
            
    if (bodyJSON.targetLesions) {
    
        //console.log(patientData);
        const sumDiametersBasal = formulas.calculateSumDiametersBasal(bodyJSON.targetLesions);
        
        bodyJSON.sumDiametersBasal = sumDiametersBasal;
    }
    return bodyJSON;
}