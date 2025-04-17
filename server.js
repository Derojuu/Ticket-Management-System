const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const session = require('express-session'); // Import the session middleware


const app = express();
const PORT = 3000;
const { insertClosedTickets } = require('./database'); // Ensure './' is present for local files

// Middleware to parse JSON requests
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors({
    origin: 'http://ticket-management-system-omega.vercel.app', 
    credentials: true   // Allow cookies and other credentials
}));

app.use(session({
    secret: 'lockout',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set secure to true in production with HTTPS
}));

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    try {
        const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
        if (users.find(user => user.username === username)) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        users.push({ username, password });
        fs.writeFileSync('users.json', JSON.stringify(users));
        res.json({ message: 'Registration successful', redirect: '/index.html' });
    } catch (error) {
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    try {
        const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            req.session.user = user; // Save user session
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

app.get('/protected-route', (req, res) => {
    if (req.session.user) {
        res.send('This is a protected route.');
    } else {
        res.status(401).send('You need to log in first.');
    }
});

app.get('/check-session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
});

app.post('/reset-password', (req, res) => {
  const { username, newPassword } = req.body;

  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send({ success: false, message: 'Error reading user data.' });
    }

    let users = JSON.parse(data);
    let user = users.find(user => user.username === username);

    if (!user) {
      return res.status(404).send({ success: false, message: 'User not found.' });
    }

    user.password = newPassword;

    fs.writeFile('users.json', JSON.stringify(users, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).send({ success: false, message: 'Error saving new password.' });
      }
      res.send({ success: true, message: 'Password reset successfully!' });
    });
  });
});

// API route to handle closing a ticket
app.post('/close-ticket', async (req, res) => {
    const ticket = req.body; // Assuming the ticket data is sent in the request body
    try {
        await insertClosedTickets(ticket); // Call the database function
        res.status(200).send('Ticket closed and stored successfully');
    } catch (err) {
        console.error('Error closing ticket:', err);
        res.status(500).send('Failed to close the ticket');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
