const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 4000;

// login.txt: login/signup
const loginFilePath = process.env.LOGIN_FILE
    ? path.resolve(process.env.LOGIN_FILE)
    : path.join(__dirname, 'public/data/login.txt');
// petsinfo.txt : giveaway
const petsInfoFilePath = process.env.PETSINFO_FILE
    ? path.resolve(process.env.PETSINFO_FILE)
    : path.join(__dirname, 'public/data/petsinfo.txt');
// pets.txt : find
const petsFilePath = process.env.PETS_FILE
    ? path.resolve(process.env.PETS_FILE)
    : path.join(__dirname, 'public/data/pets.txt');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));

// Middleware for parsing form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up session middleware
app.use(session({
    secret: 'your-secret-key', // Change this to a secure random key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use secure cookies if running over HTTPS
}));

// Define routes and other server configurations
app.get('/', (req, res) => {
    res.render('home' , { user: req.session.user });
});

app.get('/event', (req, res) => {
    res.render('event' , { user: req.session.user });
});

app.get('/find', (req, res) => {
    res.render('find' , { user: req.session.user }); 
});

app.get('/dogcare', (req, res) => {
    res.render('dogcare' , { user: req.session.user }); 
});

app.get('/catcare', (req, res) => {
    res.render('catcare' , { user: req.session.user }); 
});

app.get('/contact', (req, res) => {
    res.render('contact' , { user: req.session.user }); 
});

app.get('/terms', (req, res) => {
    res.render('terms' , { user: req.session.user }); 
});

app.get('/privacy', (req, res) => {
    res.render('privacy' , { user: req.session.user }); 
});

app.get('/form', (req, res) => {
    res.render('form', { user: req.session.user }); 
});

app.get('/signup', (req, res) => {
    res.render('signup' , { user: req.session.user }); 
});

app.get('/findResults', (req, res) => {
    res.render('findResults' , { user: req.session.user }); 
});

// Route to check if the user is authenticated
app.get('/check-auth', (req, res) => {
    if (req.session && req.session.user) {
        // User is authenticated
        res.json({ isLoggedIn: true });
    } else {
        // User is not authenticated
        res.json({ isLoggedIn: false });
    }
});


app.get('/login', (req, res) => {
    res.render('login' , { user: req.session.user }); 
});

app.get('/giveaway', (req, res) => {
    console.log('Entering /giveaway route');
    try {
        res.render('giveaway');
        console.log('Giveaway page rendered successfully');
    } catch (err) {
        console.error('Error rendering giveaway page:', err);
        res.status(500).send('Server error while rendering giveaway page.');
    }
});

function checkAuthentication(req, res, next) {
    console.log('Checking authentication...');
    console.log('Session:', req.session);

    // Check if the flag is set to skip authentication
    if (req.session.isAuthenticated) {
        console.log('User already authenticated:', req.session.user);
        return next();
    }

    if (req.session && req.session.user) {
        console.log('User authenticated:', req.session.user);

        // Set the flag to indicate authentication is valid
        req.session.isAuthenticated = true;
        return next();
    }

    console.log('Redirecting to login. Original URL:', req.originalUrl);
    req.session.redirectTo = req.originalUrl; // Save the original URL
    res.redirect('/login');
}

// POST route for handling login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log('Login attempt:', { username, password });

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }


    fs.readFile(loginFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Server error: Unable to read login.txt');
        }

        const users = data.split('\n').filter(Boolean);

        const userExists = users.some(user => {
            const [storedUsername, storedPassword] = user.split(':');
            return storedUsername.trim() === username.trim() && storedPassword.trim() === password.trim();
        });

        if (userExists) {
            req.session.user = username; // Set the session user
            req.session.authenticated = true; // Set the authenticated flag
            console.log('Login successful. Session:', req.session);
            //const redirectTo = req.session.redirectTo || '/'; // Redirect to /giveaway if no original URL is set
            req.session.redirectTo = null; // Clear redirect URL
            res.json({
                success: true,
                message: 'You have been successfully logged in.',
                redirectTo: req.session.redirectTo || '/' // Redirect to original URL or home
            });
            //res.json({ redirectTo }); // Send redirect URL in the response
        } else {
            res.status(400).send('Invalid username or password.');
        }
    });
});

app.post('/signup', (req, res) => {
    const { username, password, confirmPassword } = req.body;

    // Validate username
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return res.status(400).json({
            success: false,
            message: 'Username can only contain letters and digits.'
        });
    }

    // Validate password length and characters
    if (password.length < 4 || !/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/.test(password)) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 4 characters long, only letters and digits and contains at least one letter and one digit.'
        });
    }

    // Validate that passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Passwords do not match.'
        });
    }

    // Read the existing users from the login.txt file
    fs.readFile(loginFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Server error: Unable to read login.txt'
            });
        }

        const users = data.split('\n').filter(Boolean).map(line => line.split(':')[0]);

        // Check if the username already exists
        if (users.includes(username)) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists.'
            });
        }

        // Append the new user credentials to the login.txt file
        fs.appendFile(loginFilePath, `${username}:${password}\n`, (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error: Unable to write to login.txt'
                });
            }

            // On successful signup, send success message
            res.status(200).json({
                success: true,
                message: 'Signup successful! You can now log in.'
            });
        });
    });
});


app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Server error');
        }

        // Redirect to homepage after logging out
        res.redirect('/?message=logout-success');
    });
});


// POST route for handling giveaway form submission
app.post('/giveaway', checkAuthentication, (req, res) => {
    const { firstname, lastname, address, email, phonenumber, pettype, cattype, dogtype, age, petgender, friendliness, adaptability, suitability } = req.body;

    // Form validation
    if (!firstname || !lastname || !address || !email || !phonenumber || !pettype || !age || !petgender || !friendliness || !adaptability || !suitability) {
        return res.status(400).send('All fields are required.');
    }

    // Create a string to write to the file
    const petInfo = `${firstname}, ${lastname}, ${address}, ${email}, ${phonenumber}, ${pettype}, ${cattype || ''}, ${dogtype || ''}, ${age}, ${petgender}, ${friendliness}, ${adaptability}, ${suitability}\n`;

    fs.appendFile(petsInfoFilePath, petInfo, (err) => {
        if (err) {
            return res.status(500).send('Server error: Unable to write to petsinfo.txt');
        }
        res.send('Form submitted successfully!');
    });
});


app.post('/submitGiveawayForm', (req, res) => {
    const {firstname, lastname, address, email, phonenumber, pettype, cattype, dogtype, age, petgender, friendliness, adaptability, suitability, description } = req.body;

    // Assuming the username is stored in the session:
    const username = req.session.user;

    // Read the existing file to find the current maximum entry number
    fs.readFile(petsInfoFilePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading file:', err);
            return res.status(500).send('Server error');
        }

        // Determine the next entry number
        let nextEntryNumber = 1;  // Default to 1 if the file is empty
        if (data) {
            const lines = data.trim().split('\n');
            const lastLine = lines[lines.length - 1];
            const lastEntryNumber = parseInt(lastLine.split(':')[0], 10);
            nextEntryNumber = isNaN(lastEntryNumber) ? 1 : lastEntryNumber + 1;
        }

        // Format the new pet information
        const petInfo = `${nextEntryNumber}:${username}:${firstname}:${lastname}:${address}:${email}:${phonenumber}:${pettype}:${cattype}:${dogtype}:${age}:${petgender}:${friendliness}:${adaptability}:${suitability}:${description}\n`;

        // Append the formatted string to petsinfo.txt
        fs.appendFile(petsInfoFilePath, petInfo, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                return res.status(500).send('Server error');
            } else {
                res.send('Form submitted successfully');
            }
        });
    });
});


app.post('/find', (req, res) => {
    const { pettype, dogtype, cattype, petage, petgender, friendliness } = req.body;
    console.log('User Values:', { pettype, dogtype, cattype, petage, petgender, friendliness });

    //const petsFilePath = path.join(__dirname, 'public', 'data', 'pets.txt');

    fs.readFile(petsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Server error: Unable to read pets.txt');
        }

        const records = data.split('\n').filter(Boolean);

        // Debugging: Log raw records
        console.log('Raw Records:', records);

        const matches = records.filter(record => {
            try {
                const pet = JSON.parse(record);
                const { type: recordPetType, breed: recordBreed, age: recordAge, gender: recordGender, friendliness: recordFriendliness } = pet;

                console.log('Record Values:', { recordPetType, recordBreed, recordAge, recordGender, recordFriendliness });

                const matchesPetType = pettype === recordPetType.trim();
                const matchesBreed = pettype === 'dog'
                    ? dogtype === recordBreed.trim()
                    : pettype === 'cat'
                    ? cattype === recordBreed.trim()
                    : true;

                const matchesAge = 'Does Not Matter' === petage || recordAge.trim() === petage;
                const matchesGender = 'Does Not Matter' === petgender || recordGender.trim() === petgender;
                const matchesFriendliness = !friendliness || recordFriendliness.trim() === friendliness;

                return matchesPetType && matchesBreed && matchesAge && matchesGender && matchesFriendliness;
            } catch (e) {
                console.error('Error parsing JSON:', e);
                return false;
            }
        });

        console.log('Matches Array:', matches);

        res.render('findResults', { matches });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
