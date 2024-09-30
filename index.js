// Import the Express library
const express = require('express');
const bodyParser = require('body-parser');

// Create an instance of an Express application
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use((err, req, res, next) => {
console.error(err.stack);
res.status(500).json({ error: 'Something went wrong!' });
});

// Array to store user data
const users = [];

// Route to handle GET requests (with masked password)
app.get('/users', (req, res) => {
console.log('GET /users endpoint was accessed');
const maskedUsers = users.map(user => ({
name: user.name,
email: user.email,
password: '*'.repeat(user.password.length) // Mask the password

}));
res.status(200).json(maskedUsers);
});

// Function to validate email format
const isValidEmail = (email) => {
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return emailRegex.test(email);
};

// Function to check if the email is already in use
const isEmailInUse = (email) => {
return users.some(user => user.email === email);
};

// Route to handle POST requests
app.post('/register', (req, res) => {
const { name, email, password } = req.body;

if (!isValidEmail(email)) {
return res.status(400).json({ error: 'Invalid Email Format' });
}
if(password.length < 6){
    return res.status(400).json({ error: 'Password is to short' });
}

if (!name || !email || !password) {
return res.status(400).json({ error: 'All Fields Are Required' });

}

// Check if the email is already in use
if (isEmailInUse(email)) {
return res.status(400).json({ error: 'Email is already in use' });
}

// Add the user to the users array (without masking the actual stored password)
users.push({ name, email, password });

// Log the user information with masked password
console.log(`POST /users endpoint was accessed: ${JSON.stringify({
name,
email,
password: '*'.repeat(password.length) // Masked password for logging
})}`);

res.status(201).json({ message: 'User registered successfully' });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});