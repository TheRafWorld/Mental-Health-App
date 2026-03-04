import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const inputPath = path.join(__dirname, 'src/data/cleaned_facilities.json');
const outputSummaryPath = path.join(__dirname, 'src/data/facilities_summary.json');
const detailsDir = path.join(__dirname, 'public/facility_details');

// Ensure the details directory exists
if (!fs.existsSync(detailsDir)){
    fs.mkdirSync(detailsDir, { recursive: true });
    console.log(`Created directory: ${detailsDir}`);
}

try {
    console.log("Reading giant JSON file... please wait.");
    const rawData = fs.readFileSync(inputPath, 'utf8');
    const facilities = JSON.parse(rawData);

    const summaryList = [];

    facilities.forEach((f) => {
        // 1. Create the lightweight summary for search and sidebar
        // We exclude the 'description' field here to save massive amounts of space
        const lightweightServices = f.services?.map(s => ({
            name: s.name,
            category: s.category
        })) || [];

        summaryList.push({
            id: f.id,
            name1: f.name1,
            city: f.city,
            state: f.state,
            zip: f.zip,
            services: lightweightServices // Linked names and categories
        });

        // 2. Save the full object (including descriptions) as a detail file
        const detailPath = path.join(detailsDir, `${f.id}.json`);
        fs.writeFileSync(detailPath, JSON.stringify(f));
    });

    // 3. Save the summary list (Minified for GitHub limits)
    fs.writeFileSync(outputSummaryPath, JSON.stringify(summaryList));

    const summarySize = (fs.statSync(outputSummaryPath).size / 1024 / 1024).toFixed(2);

    console.log(`---`);
    console.log(`✅ Success! Data Split Complete.`);
    console.log(`Summary file size: ${summarySize} MB`);
    console.log(`Total facilities processed: ${summaryList.length}`);
    console.log(`Detail files created in: /public/facility_details/`);
    console.log(`---`);
    console.log(`PRO TIP: You can now push your code. GitHub will accept the ${summarySize}MB summary file!`);

} catch (error) {
    console.error("❌ Error splitting JSON:", error);
}