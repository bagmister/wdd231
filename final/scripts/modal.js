let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];

// Service intervals (in miles) and tasks
const serviceIntervals = [
    { mileage: 5000, tasks: ['Oil Change', 'Tire Rotation'] },
    { mileage: 10000, tasks: ['Oil Change', 'Air Filter Check', 'Brake Inspection'] },
    { mileage: 30000, tasks: ['Oil Change', 'Tire Rotation', 'Brake Fluid Flush'] },
    // Add more intervals as needed
];




// Open modal
function openAddVehicleModal() {
    window.onload = function () {
        if (!localStorage.getItem('modalShown')) {
            document.getElementById('addVehicleModal').style.display = 'block';
        }
    };
    document.getElementById('addVehicleModal').style.display = 'flex';
    document.getElementById('vehicleForm').reset();
    toggleAdditionalFields();
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Toggle additional fields based on VIN input
function toggleAdditionalFields() {
    const vinInput = document.getElementById('vin').value.trim();
    const additionalFields = document.getElementById('additionalFields');
    additionalFields.style.display = vinInput ? 'none' : 'block';
    const inputs = additionalFields.querySelectorAll('input');
    inputs.forEach(input => input.required = !vinInput);
}

// Handle form submission for adding vehicle
document.getElementById('vehicleForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const mileage = document.getElementById('mileage').value;
    const vin = document.getElementById('vin').value.trim();
    const vehicle = {
        id: Date.now(), // Unique ID
        mileage: parseInt(mileage),
        vin: vin || null,
        year: vin ? null : document.getElementById('year').value,
        make: vin ? null : document.getElementById('make').value,
        model: vin ? null : document.getElementById('model').value,
        manufacturer: vin ? null : document.getElementById('manufacturer').value,
        trim: vin ? null : document.getElementById('trim').value,
        serviceHistory: [] // Store completed tasks
    };
    vehicles.push(vehicle);
    saveVehicles();
    closeModal('addVehicleModal');
    updateVehicleList();
});

// Save vehicles to localStorage
function saveVehicles() {
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
}

// Update vehicle list display
function updateVehicleList() {
    const vehicleList = document.getElementById('vehicles');
    if (!vehicleList == null) {
        vehicleList.innerHTML = '';
        vehicles.forEach(vehicle => {
            const div = document.createElement('div');
            div.className = 'vehicle-item';
            div.textContent = `${vehicle.make || 'Vehicle'} ${vehicle.model || vehicle.vin || vehicle.id} - ${vehicle.mileage} miles`;
            div.onclick = () => openServiceModal(vehicle.id);
            vehicleList.appendChild(div);
        });
    }
    else {
        localStorage.setItem('vehicle-list', [])
    }
}

// Open service modal
function openServiceModal(vehicleId) {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;
    const nextInterval = serviceIntervals.find(i => i.mileage > vehicle.mileage) || serviceIntervals[serviceIntervals.length - 1];
    const serviceDetails = document.getElementById('serviceDetails');
    serviceDetails.innerHTML = `
        <p><strong>Current Mileage:</strong> ${vehicle.mileage}</p>
        <p><strong>Next Service Interval:</strong> ${nextInterval.mileage} miles</p>
        <h3>Tasks:</h3>
        <ul>
            ${nextInterval.tasks.map(task => `
                <li>
                    <input type="checkbox" data-task="${task}" ${vehicle.serviceHistory.includes(task) ? 'checked' : ''}>
                    ${task}
                </li>
            `).join('')}
        </ul>
    `;
    document.getElementById('serviceModal').style.display = 'flex';
    document.getElementById('serviceModal').dataset.vehicleId = vehicleId;
}

// Save service checklist
function saveServiceChecklist() {
    const vehicleId = parseInt(document.getElementById('serviceModal').dataset.vehicleId);
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;
    const checkboxes = document.querySelectorAll('#serviceDetails input[type="checkbox"]');
    vehicle.serviceHistory = [];
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            vehicle.serviceHistory.push(checkbox.dataset.task);
        }
    });
    saveVehicles();
    closeModal('serviceModal');
}

// Event listener for VIN input to toggle fields
document.getElementById('vin').addEventListener('input', toggleAdditionalFields);

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("index.html")) {
        if (localStorage.getItem('vehicles') == null || !localStorage.getItem('vehicles').length > 0) {
            openAddVehicleModal();
        }
    }
});
// Initialize vehicle list on page load
updateVehicleList();