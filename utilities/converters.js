function convertDuration(duration) {
    let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    let hours = (parseInt(match[1]) || 0);
    let minutes = (parseInt(match[2]) || 0);
    let seconds = (parseInt(match[3]) || 0);

    // Ensure two digits by adding leading zeros if needed
    let hoursFormatted = hours < 10 ? `0${hours}` : hours;
    let minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;
    let secondsFormatted = seconds < 10 ? `0${seconds}` : seconds;

    // Constructing HH:MM:SS format
    return `${hoursFormatted}:${minutesFormatted}:${secondsFormatted}`;
}

module.exports = { convertDuration };