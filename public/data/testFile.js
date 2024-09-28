const fs = require('fs');
const path = require('path');

// Correct the path to point to the right location of login.txt
const loginFilePath = path.join(__dirname,'login.txt');

fs.readFile(loginFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
    } else {
        console.log('File contents:', data);
    }
});

fs.appendFile(loginFilePath, `testuser:testpass\n`, (err) => {
    if (err) {
        console.error('Error writing to file:', err);
    } else {
        console.log('Successfully wrote to the file');
    }
});
