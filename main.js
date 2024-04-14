const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 8090;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); // Replace with your frontend origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Define an array of cars with initial data
let cars = [
    { 
        vehicleId: 'Felix 456 GP',
        vehicleName: 'Toyota Camry',
        vehicleType: 'Mototcycle',
        vehicleLocation: 'Mamelodi',
        registrationDate: new Date().toISOString()
    },
    { 
        vehicleId: 'Mushavhi 789 L',
        vehicleName: 'Honda Accord',
        vehicleType: 'Car',
        vehicleLocation: 'Richards bay',
        registrationDate: new Date().toISOString()
    },
    { 
        vehicleId: 'Londani 458 NC',
        vehicleName: 'Ford F-150',
        vehicleType: 'Car',
        vehicleLocation: 'Pretoria',
        registrationDate: new Date().toISOString()
    }
    ,
    { 
        vehicleId: 'Rendy 045 GP',
        vehicleName: 'Ford F-150',
        vehicleType: 'Truck',
        vehicleLocation: 'Sandton',
        registrationDate: new Date().toISOString()
    }
    ,
    { 
        vehicleId: 'Thendo 478 GP',
        vehicleName: 'Ford F-150',
        vehicleType: 'Truck',
        vehicleLocation: 'Soshanguve',
        registrationDate: new Date().toISOString()
    }
];

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Endpoint for registering a new vehicle
app.post('/registerVehicle', (req, res) => {
    const { vehicleId, vehicleName, vehicleType, vehicleLocation } = req.body;

    // Here, you would handle the registration logic, such as adding the vehicle to a database    
    const registeredVehicle = {
        vehicleId,
        vehicleName,
        vehicleType,
        vehicleLocation,
        registrationDate: new Date().toISOString()
    };
    cars.push(registeredVehicle); // Add the new vehicle to the cars array

    res.json({
        success: true,
        message: 'Vehicle registered successfully',
        data: registeredVehicle
    }); // Send back the registered vehicle data
});

// Endpoint for getting the list of cars
app.get('/getCars', (req, res) => {
    // Send the array of cars as JSON response
    res.json(cars);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});