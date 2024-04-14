// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13); // Set initial coordinates and zoom level

// Add a tile layer (you can use any tile provider)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add a marker for each vehicle (you can replace this with actual vehicle locations)
const vehicleMarkers = [
    L.marker([-26.2041,28.0473]).addTo(map)

];

// Update marker positions (this is just for demonstration, replace with actual data)
function updateMarkers(vehicleLocations) {
    vehicleMarkers.forEach((marker, index) => {
        marker.setLatLng(vehicleLocations[index]);
    });
}