export function convert2Date(dateString) {
    let dateArray = dateString.split('-');
    console.log(dateArray);
    return new Date(+dateArray[0], +dateArray[1]-1, +dateArray[2]);
}