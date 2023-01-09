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