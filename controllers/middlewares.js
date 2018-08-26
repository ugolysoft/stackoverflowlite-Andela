const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  var token = req.headers["token"];
  if (!token) {
    return res.status(403).send({ success: false, message: "No token provided." });
  }

  jwt.verify(token, "make-me-screet", (err, decoded) => {
    if (err) {
      return res.status(500).send({ success: false, message: "Failed to authenticate token." });
    }

    req.user = {
      email: decoded.email,
      id: decoded.id,
      name: decoded.name
    };

    next();
  });
};

module.exports = {
  checkAuth
};
