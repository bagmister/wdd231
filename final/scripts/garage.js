const garageSection = document.querySelector('#garage-section');

async function getGarageData() {
    const data = localStorage.getItem('vehicles');
    const vehicles = JSON.parse(data) || [];
    displayGarage(vehicles);
}

function displayGarage(vehicles) {
    garageSection.innerHTML = ''; // Clear existing content
    vehicles.forEach(vehicle => {
        const card = document.createElement('section');
        card.classList.add('vehicle-card');

        const image = document.createElement('img');
        const type = vehicle.type || 'default';
        const imageSrc = setImage(type);
        image.src = imageSrc;
        image.alt = `Image for ${vehicle.Make || 'Vehicle'} ${vehicle.Model || ''}`;
        image.loading = 'lazy';
        image.width = 340;
        image.height = 420;

        const details = document.createElement('div');
        details.classList.add('vehicle-details');

        const year = document.createElement('h2');
        year.textContent = vehicle.ModelYear || 0;

        const make = document.createElement('p');
        make.textContent = `Make: ${vehicle.Make || 'Unknown'}`;

        const model = document.createElement('p');
        model.textContent = `Model: ${vehicle.Model || 'Unknown'}`;

        const trim = document.createElement('p');
        trim.textContent = `Trim: ${vehicle.Trim || 'N/A'}`;

        const vin = document.createElement('p');
        vin.textContent = `VIN: ${vehicle.vin || 'N/A'}`;

        const mileage = document.createElement('p');
        mileage.textContent = `Mileage: ${vehicle.mileage || 0} miles`;

        details.appendChild(year);
        details.appendChild(make);
        details.appendChild(model);
        details.appendChild(trim);
        details.appendChild(vin);
        details.appendChild(mileage);

        card.appendChild(image);
        card.appendChild(details);

        garageSection.appendChild(card);
    });
}

function setImage(type) {
    let imagestring = '';
    switch (type) {
        case 'suv':
            imagestring = './images/SuvStock.webp';
            break;
        case 'truck':
            imagestring = './images/TruckStock.webp';
            break;
        case 'sedan':
            imagestring = './images/SedanStock.webp';
            break;
        case 'minivan':
            imagestring = './images/MinivanStock.webp';
            break;
        case 'van':
            imagestring = './images/VanStock.webp';
            break;
        case 'sportsCar':
            imagestring = './images/SportsCarStock.webp';
            break;
        default:
            imagestring = './images/SedanStock.webp';
    }
    return imagestring;
}

getGarageData();