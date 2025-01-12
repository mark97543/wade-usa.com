import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'; // Import dotenv

const config = ()=>{

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    dotenv.config({ path: path.resolve(__dirname, '../.env.local') }); // Load .env.local



    const configFile = path.resolve(__dirname, '../public/config.js');

    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;


    const configContent = `
    window.env = window.env || {};
    window.env.googleMapsApiKey = '${googleMapsApiKey}'; // Correct usage
    `;


    fs.writeFileSync(configFile, configContent);


    console.log('Config file generated successfully!');
}

export default config;