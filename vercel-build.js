import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Run the regular build
console.log('Running the build process...');
execSync('npm run build', { stdio: 'inherit' });

// Verify the build output location
console.log('Verifying build output...');
const clientDistClientPath = path.resolve('./client/client/dist/client');
const clientDistServerPath = path.resolve('./client/client/dist/server');

// Check client directory
if (fs.existsSync(clientDistClientPath)) {
  console.log('✅ Client build output found at:', clientDistClientPath);
  console.log('Contents:', fs.readdirSync(clientDistClientPath));
  
  // Check for index.html
  const indexPath = path.join(clientDistClientPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('✅ index.html found at:', indexPath);
  } else {
    console.log('❌ ERROR: index.html not found at:', indexPath);
  }
} else {
  console.log('❌ ERROR: Client build output not found at:', clientDistClientPath);
}

// Check server directory
if (fs.existsSync(clientDistServerPath)) {
  console.log('✅ Server build output found at:', clientDistServerPath);
  console.log('Contents:', fs.readdirSync(clientDistServerPath));
  
  // Check for index.js
  const serverIndexPath = path.join(clientDistServerPath, 'index.js');
  if (fs.existsSync(serverIndexPath)) {
    console.log('✅ server index.js found at:', serverIndexPath);
  } else {
    console.log('❌ ERROR: server index.js not found at:', serverIndexPath);
  }
} else {
  console.log('❌ ERROR: Server build output not found at:', clientDistServerPath);
}

console.log('Build verification completed'); 