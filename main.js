const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';


const app = express();
const port = 2116;//replace with own working port

// Database connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'newuser', 
  database: 'elemtrackingsolutions'
});

function authenticate(req, res, next) {
  // Get the token from the request headers or query parameters
  const token = req.headers.authorization || req.query.token;

  console.log('Token:', token);

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, secretKey);

    console.log('Decoded:', decoded);

    req.user = decoded; // Store the decoded user information in the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
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

// Endpoint for user login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Here, you would validate the username and password
  // For simplicity, I'll assume a hardcoded username and password
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

    res.status(200).json({ success: true, message: 'User Logged in ' });
  } else {
    res.status(401).send('Invalid username or password');
  }
});
// Endpoint for user logout
app.get('/logout', (req, res) => {
  // Clear the session or token to indicate that the user is logged out
  req.session.isLoggedIn = false; // Assuming you're using sessions
  res.redirect('/login.html'); // Redirect to login.html after logout
});
// Example authentication middleware

// Endpoint for deleting a vehicle
app.delete('/deleteVehicle/:vehicleId', (req, res) => {
  const vehicleId = req.params.vehicleId;

  // SQL query to delete the vehicle by ID
  const query = `DELETE FROM vehicle WHERE vehicleId = ?`;
  
  // Execute the SQL query to delete the vehicle
  connection.query(query, vehicleId, (err, result) => {
    if (err) {
      console.error('Error deleting vehicle:', err);
      res.status(500).json({ success: false, message: 'Failed to delete vehicle' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Vehicle not found' });
      return;
    }

    res.json({ success: true, message: 'Vehicle deleted successfully' });
  });
});
