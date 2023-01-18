
exports.calculateSumDiametersBasal = function (lesions) {
    let sumDiametersBasal = 0;
    lesions.map(lesion => {
            sumDiametersBasal = sumDiametersBasal + parseInt(lesion.basal);
    });
    return sumDiametersBasal;
}

exports.calculateSumDiameters = function (measurements, basal) {
    let sumDiameters = {}
    sumDiameters["basal"] = basal;
    measurements.map(measurement => {
        //console.log(measurement)
        Object.keys(measurement.data).filter(key => key.startsWith('tl')).map(tl => {
            sumDiameters[measurement.date] = (sumDiameters[measurement.date]==undefined ? 0 : sumDiameters[measurement.date]) + parseInt(measurement.data[tl]);
        }) 
    });
    return sumDiameters;
}

exports.calculateNADIR = function (measurements, sumDiameters) {
    var nadir = {};
    var previousNadir = null;
    var previousDate = null;
    measurements.map(measurement => {
            previousNadir = !previousNadir ? (!previousDate ? sumDiameters["basal"] : Math.min(sumDiameters[previousDate],sumDiameters["basal"])) : Math.min(previousNadir,sumDiameters[previousDate],sumDiameters["basal"]);
            nadir[measurement.date] = previousNadir;
            previousDate = measurement.date;
    });
    return nadir;
}

exports.calculatePercentageFromBasal = function (measurements, sumDiameters) {
    var percentageFromBasal = {};
    measurements.map(measurement =>
        percentageFromBasal[measurement.date] = ((sumDiameters[measurement.date]/sumDiameters["basal"]-1)*100).toFixed(2)
    );
    return percentageFromBasal;
}
exports.calculatePercentageFromNADIR = function (measurements, sumDiameters, nadir) {
    var percentageFromNADIR = {};
    measurements.map(measurement =>
        percentageFromNADIR[measurement.date] = ((sumDiameters[measurement.date]/nadir[measurement.date]-1)*100).toFixed(2)
    );
    return percentageFromNADIR;
}

exports.calculateNonTargetResponse = function (measurements) {
    var response = {}
    var lastDate = null;
    //Si la fecha anterior es PD, entonces devuelvo PD
    //Si todas las mediciones son ABS, entonces devuelvo CR
    //Si alguna de las mediciones es UI, entonces devuelvo PD
    //Si alguna de las mediciones es NE, entonces devuelvo NE
    //Para el resto devuelvo NoCR/NoPD
    measurements.map(measurement => {
        if (lastDate && response[lastDate] == "PD"){
            response[measurement.date] = "PD"
        } else if(Object.keys(measurement.data).filter(key => key.startsWith('ntl') && measurement.data[key] != 'ABS').length == 0 ) {
            response[measurement.date] = "CR"
        } else if (Object.keys(measurement.data).filter(key => key.startsWith('ntl') && measurement.data[key] == 'UI').length > 0 ) {
            response[measurement.date] = "PD"
        } else if (Object.keys(measurement.data).filter(key => key.startsWith('ntl') && measurement.data[key] == 'NE').length > 0 ) {
            response[measurement.date] = "NE"
        } else {
            response[measurement.date] = "NoCR/NoPD"
        }
        lastDate = measurement.date;
    });
    return response;
}

exports.calculateTargetResponse = function (measurements, lesions, sumDiameters, nadir, percentageFromBasal, percentageFromNADIR) {
    var response = {}
    var lastDate = null;
    //Si la fecha anterior es PD, entonces devuelvo PD
    //Si alguna de las mediciones es NE, entonces devuelvo NE
    //Si la suma de diametros es 0, devuelvo CR
    //Si todas las mediciones de las lesiones con "Lymph Node" "YES" y medicion menor que 10, y todas las lesiones con "Lymph Node" "NO" y medicion 0, devuelvo CR
    //Si la resta de los diametros y el nadir es mayor o igual de 5 mm y el % frente al Nadir es mayor de 20% entonces devuelvo PD
    //Si el % frente al basal es menor que el -30%, devuelvo PR
    measurements.map(measurement => {
        if (lastDate && response[lastDate] == "PD"){
            response[measurement.date] = "PD"
        } else if(sumDiameters[measurement.date] == 0) {
            response[measurement.date] = "CR"
        } else if (lesions.filter(lesion => (lesion.lymphNode=="YES" && measurement.data[lesion.id] < 10) || (lesion.lymphNode=="NO" && measurement.data[lesion.id] == 0)).length ===lesions.length) {
            response[measurement.date] = "CR"
        } else if (sumDiameters[measurement.date]-nadir[measurement.date]>=5 && percentageFromNADIR[measurement.date]>=20) {
            response[measurement.date] = "PD"
        } else if (percentageFromBasal[measurement.date]<=-30 ){
            response[measurement.date] = "PR"
        } else {
            response[measurement.date] = "SD"
        }
        lastDate = measurement.date;
    });
    return response;
}

exports.calculateOverallResponse = function (measurements, tlResponse, ntlResponse) {
    var response = {}
    //Si la fecha anterior es PD, entonces devuelvo PD
    //Si todas las mediciones son ABS, entonces devuelvo CR
    //Si alguna de las mediciones es UI, entonces devuelvo PD
    //Si alguna de las mediciones es NE, entonces devuelvo NE
    //Para el resto devuelvo NoCR/NoPD
    measurements.map(measurement => {
        if (tlResponse[measurement.date] == "PD" || ntlResponse[measurement.date] == "PD" || measurement.data.newLesions == "YES"){
            response[measurement.date] = "PD"
        } else if(tlResponse[measurement.date] == "CR" && (!ntlResponse || ntlResponse[measurement.date] == "CR") ) {
            response[measurement.date] = "CR"
        } else if(tlResponse[measurement.date] == "CR" && (ntlResponse[measurement.date] == "NoCR/NoPD") ) {
            response[measurement.date] = "PR"
        } else if(tlResponse[measurement.date] == "CR" && (ntlResponse[measurement.date] == "NE") ) {
            response[measurement.date] = "PR"
        } else if(tlResponse[measurement.date] == "PR") {
            response[measurement.date] = "PR"
        } else if(tlResponse[measurement.date] == "SD") {
            response[measurement.date] = "SD"
        } else if(tlResponse[measurement.date] == "NE") {
            response[measurement.date] = "NE"
        } 
    });
    return response;
}
