import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your specific file
const filePath = path.join(__dirname, 'src/data/cleaned_facilities.json');

try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const facilities = JSON.parse(rawData);

    console.log(`Starting cleanup. Current count: ${facilities.length}`);

    // Deduplicate based on "name1"
    const uniqueMap = new Map();

    facilities.forEach(item => {
        // We use the 'name1' field as the unique key
        // .trim() handles any accidental trailing spaces
        const key = item.name1 ? item.name1.trim() : item.id; 
        
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item);
        }
    });

    const cleanData = Array.from(uniqueMap.values());

    // Write back to the same file
    fs.writeFileSync(filePath, JSON.stringify(cleanData, null, 2));

    console.log(`✅ Success! Reduced from ${facilities.length} to ${cleanData.length} unique facilities.`);
} catch (error) {
    console.error("❌ Error processing JSON:", error);
}