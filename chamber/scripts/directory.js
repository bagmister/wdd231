const gridbutton = document.querySelector("#grid");
const listbutton = document.querySelector("#list");
const display = document.querySelector("article");
const discover = document.querySelector("#directory");
const membersDirectoryURL = "https://bagmister.github.io/wdd230/chamber/data/members.json";

gridbutton.addEventListener("click", () => {
    display.classList.add("grid");
    display.classList.remove("list");
});

listbutton.addEventListener("click", showList);
function showList() {
    display.classList.add("list");
    display.classList.remove("grid");
}

async function getMembers() {
    try {
        const response = await fetch(membersDirectoryURL);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            displayBusinesses(data);
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.error(error);
    }
}

function displayBusinesses(businesses) {
    display.innerHTML = '';
    businesses.businesses.forEach(business => {
        let card = document.createElement("section");
        let businessName = document.createElement("h2");
        let phone = document.createElement("h3")
        let address = document.createElement("h3")
        let membershiplevel = document.createElement("p")
        let startBusinessyear = document.createElement("h4")
        let businessUrl = document.createElement("a")
        let logo = document.createElement("img");

        phone.textContent = `${business.phoneNumber}`
        address.textContent = `${business.address}`
        membershiplevel.textContent = `${business.membershipLevel}`
        startBusinessyear.textContent = `${business.yearOpened}`
        businessName.textContent = `${business.name}`;
        businessUrl.textContent = "website"

        logo.setAttribute('src', business.image);
        logo.setAttribute('alt', `logo of ${business.name}`);
        logo.setAttribute('loading', 'lazy');
        logo.setAttribute('width', '340');
        logo.setAttribute('height', 'auto');

        businessUrl.setAttribute('href', `${business.url}`)

        card.appendChild(businessName);
        card.appendChild(logo);
        card.appendChild(businessUrl)
        card.appendChild(phone)
        card.appendChild(address)
        card.appendChild(membershiplevel)

        display.appendChild(card);
    });
}

getMembers();