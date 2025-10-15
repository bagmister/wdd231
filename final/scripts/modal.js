let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];

const vinBaseUrl = 'https://vpic.nhtsa.dot.gov/api/vehicles/';

const serviceIntervals = Array.from({ length: 40 }, (_, index) => {
    const mileage = (index + 1) * 5000;
    const tasks = ['Oil Change', 'Tire Rotation'];
    if (mileage % 10000 === 0) {
        tasks.push('Inspect Brakes', 'Inspect Windshield Wiper Blades', 'Check Tires and Brakes');
    }
    if (mileage % 20000 === 0) {
        tasks.push('Change Brake Fluid');
    }
    if (mileage % 30000 === 0) {
        tasks.push('Change Coolant', 'Change Cabin Air Filter');
    }
    if (mileage % 40000 === 0) {
        tasks.push('Change Transmission Fluid');
    }
    if (mileage % 100000 === 0) {
        tasks.push('Change Timing Chain', 'Change Spark Plugs');
    }
    return { mileage, tasks };
});

document.addEventListener('DOMContentLoaded', () => {
    vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    const vehicleForm = document.getElementById('vehicleForm');
    const vinInput = document.getElementById('vin');
    const addVehicleBtn = document.getElementById('addVehicleBtn');

    if (vehicleForm) {
        vehicleForm.addEventListener('submit', handleFormSubmit);
    }
    if (vinInput) {
        vinInput.addEventListener('input', toggleAdditionalFields);
    }
    if (addVehicleBtn) {
        addVehicleBtn.addEventListener('click', openAddVehicleModal);
    }

    if (window.location.pathname.includes('index.html')) {
        if (vehicles.length === 0) {
            openAddVehicleModal();
        }
        updateVehicleList();
    } else if (window.location.pathname.includes('schedule.html')) {
        initializeSchedulePage();
    } else if (window.location.pathname.includes('garage.html')) {
        // No additional init needed, garage.js handles display
    }
});

async function getVin(vin) {
    if (!vin || vin.length !== 17) return null;
    try {
        const response = await fetch(`${vinBaseUrl}DecodeVinValuesExtended/${vin}?format=json`);
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        if (data.Results && data.Results.length > 0 && data.Results[0].ErrorCode === '0') {
            return data.Results[0];
        } else {
            throw new Error('Invalid VIN or API error');
        }
    } catch (error) {
        console.error('VIN fetch error:', error);
        alert('Failed to fetch VIN data. Please enter details manually.');
        return null;
    }
}

function initializeSchedulePage() {
    const vehicleSelect = document.getElementById('vehicleSelect');
    if (vehicleSelect) {
        populateVehicleSelect();
        vehicleSelect.addEventListener('change', (e) => {
            updateServiceTiles(e.target.value);
            showNextServiceModal(e.target.value);
        });
    }
    // Trigger for initial select if value exists
    updateServiceTiles(vehicleSelect?.value || '');
    showNextServiceModal(vehicleSelect?.value || '');
}

function populateVehicleSelect() {
    const vehicleSelect = document.getElementById('vehicleSelect');
    if (!vehicleSelect) return;
    vehicleSelect.innerHTML = '<option value="">Select a vehicle</option>';
    vehicles.forEach(vehicle => {
        const option = document.createElement('option');
        option.value = vehicle.vin || vehicle.id;
        option.textContent = `${vehicle.Make || 'Vehicle'} ${vehicle.Model || vehicle.vin || vehicle.id} (${vehicle.mileage} miles)`;
        vehicleSelect.appendChild(option);
    });
}

function updateServiceTiles(vinOrId) {
    const serviceTiles = document.getElementById('serviceTiles');
    if (!serviceTiles) return;
    serviceTiles.innerHTML = '';

    if (!vinOrId) return;
    const vehicle = vehicles.find(v => v.vin === vinOrId || v.id.toString() === vinOrId);
    if (!vehicle) return;

    const relevantIntervals = serviceIntervals.filter(interval => interval.mileage >= vehicle.mileage);
    relevantIntervals.forEach(interval => {
        const tile = document.createElement('div');
        tile.className = 'service-tile';
        const allTasksCompleted = interval.tasks.every(task =>
            vehicle.serviceHistory.some(h => h.mileage === interval.mileage && h.task === task && h.completed)
        );
        if (allTasksCompleted) tile.classList.add('completed');

        tile.innerHTML = `
            <h3>${interval.mileage} Miles</h3>
            <ul>
                ${interval.tasks.map(task => {
                    const isCompleted = vehicle.serviceHistory.some(h => h.mileage === interval.mileage && h.task === task && h.completed);
                    return `<li>${task}${isCompleted ? ' (Done)' : ''}</li>`;
                }).join('')}
            </ul>
        `;
        tile.onclick = () => openServiceModal(vehicle.vin || vehicle.id, interval.mileage);
        serviceTiles.appendChild(tile);
    });
}

function showNextServiceModal(vinOrId) {
    if (!vinOrId) return;
    const vehicle = vehicles.find(v => v.vin === vinOrId || v.id.toString() === vinOrId);
    if (!vehicle || !vehicle.serviceHistory || vehicle.serviceHistory.length === 0) return; // Only show if serviceHistory populated

    const nextInterval = serviceIntervals.find(interval => {
        if (interval.mileage < vehicle.mileage) return false;
        return !interval.tasks.every(task =>
            vehicle.serviceHistory.some(h => h.mileage === interval.mileage && h.task === task && h.completed)
        );
    });

    if (nextInterval) {
        openServiceModal(vinOrId, nextInterval.mileage);
    }
}

function openAddVehicleModal() {
    const modal = document.getElementById('addVehicleModal');
    const form = document.getElementById('vehicleForm');
    if (modal && form) {
        modal.style.display = 'flex';
        form.reset();
        toggleAdditionalFields();
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const mileageInput = document.getElementById('mileage');
    const vin = document.getElementById('vin')?.value.trim();
    const mileage = parseInt(mileageInput?.value);

    if (isNaN(mileage) || mileage < 0) {
        alert('Please enter a valid mileage.');
        return;
    }

    let vehicleData = {
        id: Date.now(),
        mileage,
        vin: vin || null,
        serviceHistory: []
    };

    if (vin) {
        const carinfo = await getVin(vin);
        if (carinfo) {
            vehicleData.ModelYear = carinfo.ModelYear;
            vehicleData.Make = carinfo.Make;
            vehicleData.Model = carinfo.Model;
            vehicleData.Manufacturer = carinfo.Manufacturer;
            vehicleData.Trim = carinfo.Trim;

            // Map BodyClass to type
            const bodyClass = (carinfo.BodyClass || '').toLowerCase();
            if (bodyClass.includes('sport utility')) {
                vehicleData.type = 'suv';
            } else if (bodyClass.includes('truck')) {
                vehicleData.type = 'truck';
            } else if (bodyClass.includes('sedan')) {
                vehicleData.type = 'sedan';
            } else if (bodyClass.includes('minivan')) {
                vehicleData.type = 'minivan';
            } else if (bodyClass.includes('van')) {
                vehicleData.type = 'van';
            } else if (bodyClass.includes('coupe') || bodyClass.includes('convertible')) {
                vehicleData.type = 'sportsCar';
            } else {
                vehicleData.type = 'default';
            }
        }
    } else {
        vehicleData.ModelYear = document.getElementById('year')?.value;
        vehicleData.Make = document.getElementById('make')?.value;
        vehicleData.Model = document.getElementById('model')?.value;
        vehicleData.Manufacturer = document.getElementById('manufacturer')?.value;
        vehicleData.Trim = document.getElementById('trim')?.value;
        // For manual entry, type could be added via a new form field, but assuming 'default' for now
        vehicleData.type = 'default';
    }

    vehicles.push(vehicleData);
    saveVehicles();
    closeModal('addVehicleModal');
    updateVehicleList();
    populateVehicleSelect();
}

function toggleAdditionalFields() {
    const vinInput = document.getElementById('vin')?.value.trim();
    const additionalFields = document.getElementById('additionalFields');
    if (additionalFields) {
        additionalFields.style.display = vinInput ? 'none' : 'block';
        const inputs = additionalFields.querySelectorAll('input');
        inputs.forEach(input => {
            input.required = !vinInput;
        });
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function saveVehicles() {
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
}

function updateVehicleList() {
    const vehicleList = document.getElementById('vehicles');
    if (vehicleList) {
        vehicleList.innerHTML = '';
        vehicles.forEach(vehicle => {
            const div = document.createElement('div');
            div.className = 'vehicle-item';
            div.textContent = `${vehicle.Make || 'Vehicle'} ${vehicle.Model || vehicle.vin || vehicle.id} - ${vehicle.mileage} miles`;
            div.onclick = () => openServiceModal(vehicle.vin || vehicle.id, null);
            vehicleList.appendChild(div);
        });
    }
}

function openServiceModal(vinOrId, mileage) {
    const vehicle = vehicles.find(v => v.vin === vinOrId || v.id.toString() === vinOrId);
    if (!vehicle) return;

    const interval = mileage
        ? serviceIntervals.find(i => i.mileage === mileage)
        : serviceIntervals.find(i => i.mileage > vehicle.mileage) || serviceIntervals[serviceIntervals.length - 1];
    if (!interval) return;

    const serviceDetails = document.getElementById('serviceDetails');
    if (serviceDetails) {
        serviceDetails.innerHTML = `
            <p><strong>Vehicle:</strong> ${vehicle.Make || 'Vehicle'} ${vehicle.Model || vehicle.vin || vehicle.id}</p>
            <p><strong>Current Mileage:</strong> ${vehicle.mileage}</p>
            <p><strong>Service Interval:</strong> ${interval.mileage} miles</p>
            <h3>Tasks:</h3>
            <ul>
                ${interval.tasks.map(task => {
                    const isCompleted = vehicle.serviceHistory.some(h => h.mileage === interval.mileage && h.task === task && h.completed);
                    return `
                        <li>
                            <input type="checkbox" data-task="${task}" ${isCompleted ? 'checked' : ''}>
                            ${task}
                        </li>
                    `;
                }).join('')}
            </ul>
        `;
        const serviceModal = document.getElementById('serviceModal');
        if (serviceModal) {
            serviceModal.style.display = 'flex';
            serviceModal.dataset.vehicleId = vinOrId;
            serviceModal.dataset.mileage = interval.mileage;
        }
    }
}

function saveServiceChecklist() {
    const serviceModal = document.getElementById('serviceModal');
    if (!serviceModal) return;
    const vinOrId = serviceModal.dataset.vehicleId;
    const mileage = parseInt(serviceModal.dataset.mileage);
    const vehicle = vehicles.find(v => v.vin === vinOrId || v.id.toString() === vinOrId);
    if (!vehicle) return;

    const interval = serviceIntervals.find(i => i.mileage === mileage);
    if (!interval) return;

    const checkboxes = document.querySelectorAll('#serviceDetails input[type="checkbox"]');
    const currentDate = new Date().toISOString().split('T')[0];
    vehicle.serviceHistory = vehicle.serviceHistory.filter(h => h.mileage !== mileage);
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            vehicle.serviceHistory.push({
                mileage,
                task: checkbox.dataset.task,
                completed: true,
                date: currentDate
            });
        }
    });

    saveVehicles();
    closeModal('serviceModal');
    updateServiceTiles(vinOrId);
}