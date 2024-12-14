const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/user');

const SECRET = 'secretkey'; 


const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin';

exports.register = (req, res) => {
    const { username, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).send('Error hashing password');
        createUser({ username, email, password: hash }, (err) => {
            if (err) return res.status(500).send('Error registering user');
            res.status(201).send('User registered');
        });
    });
};
 
exports.login = (req, res) => {
    const { email, password } = req.body;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const token = jwt.sign({ id: 0, role: 'admin' }, SECRET, { expiresIn: '1h' });
        return res.json({ token, role: 'admin' });
    }

   
    findUserByEmail(email, (err, results) => {
        if (err || results.length === 0) return res.status(401).send('Invalid credentials');
        bcrypt.compare(password, results[0].password, (err, match) => {
            if (err || !match) return res.status(401).send('Invalid credentials');
            const token = jwt.sign({ id: results[0].id, role: 'user' }, SECRET, { expiresIn: '1h' });
            res.json({ token, role: 'user' });
        });
    });
};
