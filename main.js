const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 2116;//replace with own working port

// Database connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'newuser', //replace with own username
  database: 'elemtrackingsolutions'
});

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return;
    }
    console.log('Connected to database');
  });
  

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); // Replace with your frontend origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Endpoint for registering a new vehicle
app.post('/registerVehicle', (req, res) => {
  const { vehicleId, vehicleName, vehicleType, vehicleLocation } = req.body;

  const query = `INSERT INTO vehicle (vehicleId, vehicleName, vehicleType, vehicleInitialLocation) VALUES (?, ?, ?, ?)`;
  const values = [vehicleId, vehicleName, vehicleType, vehicleLocation];

  // Execute the SQL query to insert the new vehicle
  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error registering vehicle:', err);
      res.status(500).json({ success: false, message: 'Failed to register vehicle' });
      return;
    }

    const registeredVehicle = {
      vehicleId,
      vehicleName,
      vehicleType,
      vehicleLocation,
      registrationDate: new Date().toISOString()
    };
    res.json({
      success: true,
      message: 'Vehicle registered successfully',
      data: registeredVehicle
    });
  });
});

// Endpoint for getting the list of cars
app.get('/getCars', (req, res) => {
  const query = 'SELECT * FROM elemtrackingsolutions.vehicle';

  // Execute the SQL query to fetch all cars from the database
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error getting cars:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch cars' });
      return;
    }

    res.json(results);
  });
});

app.get('/getDrivers', (req, res) => {
  const query = 'SELECT * FROM elemtrackingsolutions.driver';

  // Execute the SQL query to fetch all cars from the database
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error getting cars:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch driver' });
      return;
    }

    res.json(results);
  });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


app.post('/registerDriver', (req, res) => {
  const { driverid, drivername, DriverContactDetails } = req.body;

  const query = `INSERT INTO Driver (driverid, drivername, DriverContactDetails) VALUES (?, ?, ?)`;
  const values = [driverid, drivername, DriverContactDetails];

  // Execute the SQL query to insert the new vehicle
  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error registering vehicle:', err);
      res.status(500).json({ success: false, message: 'Failed to register driver' });
      return;
    }
    const registeredDriver = {
      driverid,
      drivername,
      DriverContactDetails      
    };
    res.json({
      success: true,
      message: 'driver registered successfully',
      data: registeredDriver
    });
  });
});