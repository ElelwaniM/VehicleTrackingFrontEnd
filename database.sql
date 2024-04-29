-- Create the database
CREATE DATABASE IF NOT EXISTS EleMTrackingSolutions;
USE EleMTrackingSolutions;

-- Create the Vehicle table
CREATE TABLE IF NOT EXISTS Vehicle (
    vehicleId VARCHAR(8) PRIMARY KEY,
    vehicleName VARCHAR(50),
    vehicleType VARCHAR(50),
    vehicleInitialLocation VARCHAR(50),
    vehicleCurrentLocation VARCHAR(50),
    registrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the Driver table
CREATE TABLE IF NOT EXISTS Driver (
    DriverID VARCHAR(12) PRIMARY KEY,
    DriverName VARCHAR(50),
    DriverContactDetails VARCHAR(50)
);

-- Create the VehicleDriver table
CREATE TABLE IF NOT EXISTS VehicleDriver (
    vehicleId VARCHAR(8),
    DriverID VARCHAR(12),
    FOREIGN KEY (vehicleId) REFERENCES Vehicle(vehicleId) ON DELETE CASCADE,
    FOREIGN KEY (DriverID) REFERENCES Driver(DriverID) ON DELETE CASCADE,
    PRIMARY KEY (vehicleId, DriverID)
);

-- Create the Transactions table
-- Create the Transactions table with auto-incrementing transactionID
CREATE TABLE IF NOT EXISTS Transactions (
    transactionID INT AUTO_INCREMENT PRIMARY KEY,
    transactionType ENUM('Fuel', 'Toll Gates', 'Weighing Station'),
    amountPaid DECIMAL(10, 2) CHECK (amountPaid >= 0),
    TransactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vehicleId VARCHAR(8),
    FOREIGN KEY (vehicleId) REFERENCES Vehicle(vehicleId) ON DELETE CASCADE
);


-- Create a trigger to display an alert when a new transaction is inserted
DELIMITER //
CREATE TRIGGER trg_new_transaction
AFTER INSERT ON Transactions
FOR EACH ROW
BEGIN
    DECLARE msg VARCHAR(255);
    SET msg = CONCAT('New transaction (ID: ', NEW.transactionID, ') added for vehicle ', NEW.vehicleId);
    SELECT msg;
END;

//
DELIMITER ;

-- Populate the tables (example data)
INSERT INTO Vehicle (vehicleId, vehicleName, vehicleType, vehicleInitialLocation, vehicleCurrentLocation)
VALUES ('VEH001', 'Car A', 'Sedan', 'Location A', 'Location B'),
       ('VEH002', 'Truck B', 'Heavy Duty', 'Location C', 'Location D');

INSERT INTO Driver (DriverID, DriverName, DriverContactDetails)
VALUES ('DRV001', 'John Doe', '123-456-7890'),
       ('DRV002', 'Jane Doe', '987-654-3210');

INSERT INTO VehicleDriver (vehicleId, DriverID)
VALUES ('VEH001', 'DRV001'),
       ('VEH002', 'DRV002');

INSERT INTO Transactions ( transactionType, amountPaid, vehicleId)
VALUES ('Fuel', 50.00, 'VEH001'),
       ('Toll Gates', 10.00, 'VEH002');

-- Script to display vehicle info
SELECT * FROM Vehicle;

-- Trigger deletion of vehicle and related records
DELIMITER //
CREATE TRIGGER trg_delete_vehicle
BEFORE DELETE ON Vehicle
FOR EACH ROW
BEGIN
    -- Delete related records from VehicleDriver table
    DELETE FROM VehicleDriver WHERE vehicleId = OLD.vehicleId;
    -- Delete related transactions
    DELETE FROM Transactions WHERE vehicleId = OLD.vehicleId;
END;
//
DELIMITER ;

