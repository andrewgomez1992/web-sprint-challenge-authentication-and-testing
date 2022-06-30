const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secrets/secret");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err != null) {
        // console.log(err);
        res.status(401).json({ message: 'token invalid' });
        return;
      }

      req.decodedJwt = decoded;
      console.log(decoded);
      next()
    });
  } else {
    res.status(401).json({ message: 'token required' });
  }
};


