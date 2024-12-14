const jwt = require('jsonwebtoken');
const SECRET = 'secretkey'; 
module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }

        req.user = decoded;  
        next();  
    });
};
