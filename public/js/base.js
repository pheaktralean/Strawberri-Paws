function getOrdinalSuffix(day){
    if(day > 3 && day < 21) return 'th';
    switch(day %10){
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

function updateDateTime(){
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    let day = now.getDate();
    let suffix = getOrdinalSuffix(day);
    const dateString = now.toLocaleDateString('en-CA', options).replace(day, day + suffix);
    const timeString = now.toLocaleTimeString('en-CA');
    document.getElementById('datetime').innerText = `${dateString}, Time: ${timeString}`;
}

setInterval(updateDateTime, 1000);
window.onload = updateDateTime;








