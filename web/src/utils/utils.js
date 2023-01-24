export function convert2Date(dateString) {
    let dateArray = dateString.split('-');

    return new Date(+dateArray[2], dateArray[1]-1, +dateArray[0]);
}