export function convert2Date(dateString) {
    let dateArray = dateString.split('-');
    return new Date(+dateArray[0], +dateArray[1]-1, +dateArray[2]);
}

export function convertDateFormat(dateString) {
    let dateArray = dateString.split('-');
    let dateStr = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
    console.log(dateStr);
    return dateStr;
}