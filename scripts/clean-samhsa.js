import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

// --- PATH SETUP ---
// This ensures the script finds your files regardless of where you run the command from.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Targeting C:\Users\rafgib295\Desktop\TheRafWorld\Projects\Mental-Health-App\src\data
const dataDir = path.resolve(__dirname, '..', 'src', 'data');
const facilitiesFile = path.join(dataDir, 'facilities.csv');
const serviceCodesFile = path.join(dataDir, 'service_codes.csv');
const outputFile = path.join(dataDir, 'cleaned_facilities.json');

const serviceMap = {};

console.log('--- Starting Data Clean ---');

// 1. First, build the map from service_codes.csv
// This allows us to look up a code (like 'SA') and get its Name, Description, and Category.
fs.createReadStream(serviceCodesFile)
  .pipe(csv())
  .on('data', (row) => {
    const code = row.service_code?.trim();
    if (code) {
      serviceMap[code] = {
        name: row.service_name?.trim(),
        description: row.service_description?.trim(),
        category: row.category_name?.trim() // Added to support your category dropdown
      };
    }
  })
  .on('end', () => {
    console.log(`Loaded ${Object.keys(serviceMap).length} unique service codes.`);

    const results = [];

    // 2. Process the main facilities.csv
    fs.createReadStream(facilitiesFile)
      .pipe(csv())
      .on('data', (row) => {
        // CLEANING LOGIC for service_code_info:
        // We replace asterisks with spaces, then split into individual codes.
        const rawCodes = row.service_code_info || "";
        const serviceCodesArray = rawCodes
          .replace(/\*/g, ' ') 
          .split(' ')          
          .map(s => s.trim())  
          .filter(Boolean);    

        // Map those raw codes to full objects from our serviceMap
        const services = serviceCodesArray
          .map(code => serviceMap[code])
          .filter(Boolean); // Removes codes that don't exist in serviceMap

        // Build the facility object exactly as needed for the React component
        const facility = {
          id: Math.random().toString(36).substr(2, 9), // Temporary unique ID
          name1: row.name1?.trim(),
          name2: row.name2?.trim(),
          street1: row.street1?.trim(),
          street2: row.street2?.trim(),
          city: row.city?.trim(),
          state: row.state?.trim(),
          zip: row.zip?.trim(),
          phone: row.phone?.trim(),
          service_code_info: row.service_code_info, // Keeping raw string just in case
          services: services // This now includes name, description, and CATEGORY
        };

        results.push(facility);
      })
      .on('end', () => {
        // 3. Write the final cleaned JSON file
        try {
          fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
          console.log(`--- SUCCESS ---`);
          console.log(`Created: ${outputFile}`);
          console.log(`Total Facilities: ${results.length}`);
        } catch (err) {
          console.error('Error writing file:', err);
        }
      });
  })
  .on('error', (err) => {
    console.error('Error reading service codes:', err);
  });