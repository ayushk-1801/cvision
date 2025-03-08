const fs = require('fs');
const path = require('path');

// Create upload directories
const uploadDir = path.join(process.cwd(), 'uploads');
const resumesDir = path.join(uploadDir, 'resumes');

// Create directories if they don't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log('Created uploads directory');
}

if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir);
  console.log('Created resumes directory');
}

// Add .gitkeep file to include empty folders in git
fs.writeFileSync(path.join(resumesDir, '.gitkeep'), '');

console.log('Upload directories setup complete!');
