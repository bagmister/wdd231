const gridbutton = document.querySelector("#grid");
const listbutton = document.querySelector("#list");
const display = document.querySelector("article");
const recentEvents = document.querySelector("#currentEvents");
const currentEventsURL = "https://bagmister.github.io/wdd230/chamber/data/currentEvents.json";

async function getEvents() {
    try {
        const response = await fetch(currentEventsURL);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            displayEvents(data);
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.error(error);
    }
}

function displayEvents(events) {
    display.innerHTML = '';
    events.events.forEach(event => {
        let card = document.createElement("section");
        let eventName = document.createElement("h2");
        let phone = document.createElement("h3")
        let address = document.createElement("h3")
        let registrationRequired = document.createElement("p")
        let startBusinessyear = document.createElement("h4")
        let eventUrl = document.createElement("a")
        let logo = document.createElement("img");

        phone.textContent = `${event.phoneNumber}`
        address.textContent = `${event.address}`
        registrationRequired.textContent = `${event.membershipLevel}`
        startBusinessyear.textContent = `${event.yearOpened}`
        eventName.textContent = `${event.name}`;
        eventUrl.textContent = "website"

        logo.setAttribute('src', event.image);
        logo.setAttribute('alt', `logo of ${event.name}`);
        logo.setAttribute('loading', 'lazy');
        logo.setAttribute('width', '340');
        logo.setAttribute('height', 'auto');

        eventUrl.setAttribute('href', `${event.url}`)

        card.appendChild(eventName);
        card.appendChild(logo);
        card.appendChild(eventUrl)
        card.appendChild(phone)
        card.appendChild(address)
        card.appendChild(registrationRequired)

        display.appendChild(card);
    });
}

getEvents();