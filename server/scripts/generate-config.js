const fs = require('fs');
const path = require('path');

const configFile = path.resolve(__dirname, '../public/config.js'); // Path to your config.js

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Access env variable


const configContent = `
window.env = window.env || {};
window.env.googleMapsApiKey = '${googleMapsApiKey}'; // Assign API key to window.env
`;

fs.writeFileSync(configFile, configContent); // Write to config.js

console.log('Config file generated successfully!');