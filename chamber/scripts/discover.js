// Use imported data or fetch from URL (choose one based on your setup)
import { places } from './../data/places.mjs';
console.log(places)
const cards = document.querySelector('.discoverPage');

async function getPlacesData() {
  try {
    const data = places;
    // If fetching from URL, uncomment this and comment the above line
    // const response = await fetch(url);
    // if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    // const data = await response.json();

    console.table(data); // Log for debugging
    displayPlaces(data);
  } catch (error) {
    console.error('Error fetching places data:', error);
    cards.innerHTML = '<p>Sorry, we couldn’t load the places data. Please try again later.</p>';
  }
}

function displayPlaces(places) {
  places.forEach(place => {
    let card = document.createElement('section');
    card.setAttribute('id', 'card')
    let name = document.createElement('h2');
    let image = document.createElement('img');
    let cost = document.createElement('p');
    let description = document.createElement('p');
    let address = document.createElement('p');

    name.textContent = place.name;
    cost.textContent = `Cost: ${place.cost}`; // Populate cost
    description.textContent = place.description;
    address.textContent = place.address;

    image.setAttribute('src', place.image_url);
    image.setAttribute('alt', `Image of ${place.name}`);
    image.setAttribute('loading', 'lazy');

    card.appendChild(name);
    card.appendChild(image);
    card.appendChild(cost);
    card.appendChild(description);
    card.appendChild(address);

    cards.appendChild(card);
  });
}

getPlacesData();