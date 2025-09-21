const currentEventsData = document.querySelector("#currentEventsData")
const membersURL = "https://bagmister.github.io/wdd230/chamber/data/members.json";

document.querySelector('.call-to-action-button').addEventListener('click', function () {
    window.location.href = './join.html';
});

async function getMembers() {
    try {
        const response = await fetch(membersURL)
        if (response.ok) {
            const data = await response.json()
            const refined = filterDirectory(data)
            displayBusinesses(refined)
        } else {
            throw Error(await response.text())
        }
    } catch (error) {
        console.error(error)
    }
}


function filterDirectory(data) {
    let refinedDirectory = [];
    let iterator = 0;
    for (let business of data.businesses) {
        if ((business.membershipLevel === 'Gold' || business.membershipLevel === 'Silver') && iterator <= 2) {
            refinedDirectory.push(business)
            iterator++
        }
        if (iterator > 2) break
    }
    return refinedDirectory
}


function displayBusinesses(businesses) {
    const display = document.querySelector('#currentEventsData');
    display.innerHTML = '';

    businesses.forEach(business => {
        let card = document.createElement("section");
        let businessName = document.createElement("h2");
        let phone = document.createElement("h3");
        let address = document.createElement("h3");
        let membershiplevel = document.createElement("p");
        let startBusinessyear = document.createElement("h4");
        let businessUrl = document.createElement("a");
        let logo = document.createElement("img");

        businessName.textContent = business.name;
        phone.textContent = business.phoneNumber;
        address.textContent = business.address;
        membershiplevel.textContent = `Membership: ${business.membershipLevel}`;
        startBusinessyear.textContent = `Since: ${business.yearOpened}`;
        businessUrl.textContent = "Website";

        logo.setAttribute('src', business.image);
        logo.setAttribute('alt', `Logo of ${business.name}`);
        logo.setAttribute('loading', 'lazy');
        logo.setAttribute('width', '340');
        logo.setAttribute('height', 'auto');

        businessUrl.setAttribute('href', business.url);
        businessUrl.setAttribute('target', '_blank');

        card.appendChild(businessName);
        card.appendChild(logo);
        card.appendChild(businessUrl);
        card.appendChild(phone);
        card.appendChild(address);
        card.appendChild(membershiplevel);
        card.appendChild(startBusinessyear);

        display.appendChild(card);
    });
}

getMembers();