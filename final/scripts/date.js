function lastModified(){
    let lastModifiedDate = new Date(document.lastModified);
    document.getElementById("lastModified").innerHTML = lastModifiedDate.toLocaleString()
}

function currentYear() {
    const currentYearValue = new Date().getFullYear();
    document.getElementById("currentyear").innerHTML = currentYearValue;
}


window.addEventListener('load',currentYear)
window.addEventListener('load',lastModified)
