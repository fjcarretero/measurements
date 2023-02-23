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
            
    if (bodyJSON[0]?.individualStudyId) {
        let patientId = bodyJSON[0].individualStudyId

        let bodyJSONSorted = [...bodyJSON];

        bodyJSONSorted.sort((a, b) => this.convert2Date(a.date) - this.convert2Date(b.date));

        //let patientData = db.patients.filter(patient => patient.id == patientId)[0];
        const sumDiametersBasal = formulas.calculateSumDiametersBasal(patientData.targetLesions);
        //console.log(sumDiametersBasal);
        let sumDiameters = formulas.calculateSumDiameters(bodyJSONSorted, sumDiametersBasal);
        //console.log(sumDiameters);
        const nadir = formulas.calculateNADIR(bodyJSONSorted, sumDiameters);
        //console.log(nadir);
        const percentageFromBasal = formulas.calculatePercentageFromBasal(bodyJSONSorted, sumDiameters);
        //console.log(percentageFromBasal);
        const percentageFromNADIR = formulas.calculatePercentageFromNADIR(bodyJSONSorted, sumDiameters, nadir);
        //console.log(percentageFromNADIR);
        const targetResponse = formulas.calculateTargetResponse(bodyJSONSorted, patientData.targetLesions, sumDiameters, nadir, percentageFromBasal, percentageFromNADIR);
        //console.log(targetResponse);
        const nonTargetResponse = formulas.calculateNonTargetResponse(bodyJSONSorted);
        //console.log(nonTargetResponse);
        const overallResponse = formulas.calculateOverallResponse(bodyJSONSorted, targetResponse, nonTargetResponse);
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

exports.convert2Date = (dateString) => {
    let dateArray = dateString.split('-');

    return new Date(+dateArray[2], dateArray[1]-1, +dateArray[0]);
}