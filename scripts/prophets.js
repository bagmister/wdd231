const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector('#cards');


async function getProphetData() {
    const response = await fetch(url);
    const data = await response.json();
    console.table(data.prophets);
    displayProphets(data)
}

function displayProphets(prophets) {
    let prophetsRefined = prophets.prophets
    prophetsRefined.forEach(prophet => {
        let card = document.createElement("section")
        let fullName = document.createElement("h2")
        let portrait = document.createElement("img")
        let dateOfBirth = document.createElement("p")
        let birthPlace = document.createElement("p")

        fullName.textContent = `${prophet.name} ${prophet.lastname}`;
        dateOfBirth.textContent = `${prophet.birthdate}`;
        birthPlace.textContent = `${prophet.birthplace}`;

        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`);
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '420');
        // portrait.setAttribute()
        card.appendChild(fullName);
        card.appendChild(dateOfBirth)
        card.appendChild(birthPlace)
        card.appendChild(portrait);

        cards.appendChild(card)
    });
}

getProphetData()