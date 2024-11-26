// start.js used in package.json scripts
require('dotenv').config();
const { execSync } = require('child_process');

const command = process.argv.slice(2).join(' ');
execSync(`expo ${command}`, { stdio: 'inherit' });
