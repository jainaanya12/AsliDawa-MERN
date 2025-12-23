// backend/importData.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Medicine = require('./models/Medicine'); // Import our model
const connectDB = require('./db'); // Import our DB connection function

// Helper function to split pipe-separated values
const parsePipeSeparated = (value) => {
  if (!value) return [];
  return value.split('|').map(item => item.trim());
};

// --- NEW HELPER FUNCTION ---
// This will clean the price string and convert it to a Number
const cleanPrice = (priceStr) => {
  if (!priceStr) return null;
  
  // 1. Remove all spaces, single quotes, and double quotes
  const cleanedStr = priceStr.replace(/ /g, '').replace(/'/g, '').replace(/"/g, '');
  
  // 2. Convert to a number
  const priceNum = parseFloat(cleanedStr);
  
  // 3. If it's not a valid number (NaN), return null. Otherwise, return the number.
  return isNaN(priceNum) ? null : priceNum;
};

const importData = async () => {
  let hasLoggedRow = false; // To prevent spamming the console
  try {
    await connectDB(); // Connect to the database
    console.log('Database connected, clearing old data...');
    
    // WARNING: This deletes all existing medicines
    await Medicine.deleteMany({});
    console.log('Old data cleared. Starting import...');

    // --- IMPORTANT ---
    // Make sure this filename matches your new CSV file!
    const csvFilePath = path.join(__dirname, 'cleaned_no_duplicates.csv'); 
    // ---

    const medicinesToImport = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          
          // --- DEBUGGING ---
          if (!hasLoggedRow) {
            console.log("--- DEBUG: First row from CSV ---");
            console.log(row);
            console.log("---------------------------------");
            console.log("Original price_inr:", row.price_inr);
            console.log("Cleaned price:", cleanPrice(row.price_inr));
            hasLoggedRow = true;
          }

          const medicineData = {
            // Schema field: row.csv_header_name
            name: row.name,
            
            // --- THIS IS THE FIX ---
            price: cleanPrice(row.price_inr), 
            
            is_discontinued: row.Is_discontinued ? row.Is_discontinued.toLowerCase() === 'true' : false,
            manufacturer_name: row.manufacturer_name,
            type: row.type,
            pack_size_label: row.pack_size_label,
            short_composition1: row.short_composition1,
            short_composition2: row.short_composition2,
            uses: parsePipeSeparated(row.uses),
            side_effects: parsePipeSeparated(row.side_effects),
            substitutes: parsePipeSeparated(row.substitutes),
            chemical_class: row.chemical_class,
            habit_forming: row.habit_forming,
            therapeutic_class: row.therapeutic_class,
            action_class: row.action_class,
          };
          
          medicinesToImport.push(medicineData);
        })
        .on('end', () => {
          console.log(`Read ${medicinesToImport.length} records from CSV.`);
          resolve();
        })
        .on('error', (err) => {
          reject(err);
        });
    });

    if (medicinesToImport.length > 0) {
      console.log('Inserting data into database...');
      await Medicine.insertMany(medicinesToImport);
      console.log('Data imported successfully!');
    } else {
      console.log('No data found in CSV file.');
    }
    
    process.exit();
  } catch (err) {
    console.error('Error during data import:', err);
    process.exit(1);
  }
};

importData();