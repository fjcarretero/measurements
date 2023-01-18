const formulas = require('./formulas');

exports.includeSumDiametersBasal = function(bodyJSON) {
            
    if (bodyJSON.targetLesions) {
    
        //console.log("patientData");
        const sumDiametersBasal = formulas.calculateSumDiametersBasal(bodyJSON.targetLesions);
        
        bodyJSON.sumDiametersBasal = sumDiametersBasal;
    }
    return bodyJSON;
}

exports.includeCalculus = (bodyJSON, patientData) => {
            
    if (bodyJSON[0]?.patientId) {
        let patientId = bodyJSON[0].patientId

        //let patientData = db.patients.filter(patient => patient.id == patientId)[0];
        const sumDiametersBasal = formulas.calculateSumDiametersBasal(patientData.targetLesions);
        //console.log(sumDiametersBasal);
        let sumDiameters = formulas.calculateSumDiameters(bodyJSON, sumDiametersBasal);
        //console.log(sumDiameters);
        const nadir = formulas.calculateNADIR(bodyJSON, sumDiameters);
        //console.log(nadir);
        const percentageFromBasal = formulas.calculatePercentageFromBasal(bodyJSON, sumDiameters);
        //console.log(percentageFromBasal);
        const percentageFromNADIR = formulas.calculatePercentageFromNADIR(bodyJSON, sumDiameters, nadir);
        //console.log(percentageFromNADIR);
        const targetResponse = formulas.calculateTargetResponse(bodyJSON, patientData.targetLesions, sumDiameters, nadir, percentageFromBasal, percentageFromNADIR);
        //console.log(targetResponse);
        const nonTargetResponse = formulas.calculateNonTargetResponse(bodyJSON);
        //console.log(nonTargetResponse);
        const overallResponse = formulas.calculateOverallResponse(bodyJSON, targetResponse, nonTargetResponse);
        //console.log(overallResponse);

        //console.log(bodyJSON);

        bodyJSON.map(measurement => {
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
            //console.log(measurement.calculus.data);
        })
        //console.log('--');
        //console.log(bodyJSON);
    }
    return bodyJSON;
}