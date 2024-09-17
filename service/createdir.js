const fs = require('fs');
const path = require('path');

function createDirectory(dirPath) {
  try {
    if (fs.existsSync(dirPath)) {
      throw new Error(`Directory already exists: ${dirPath}`);
    }
    
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

module.exports = {createDirectory}


