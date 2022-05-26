const jwt = require('jsonwebtoken')

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(403).send('A token is required for authentication')
    }
    req.userId = '9aaec1fc-ea13-4783-81f8-a998c1e0d648'
    return next()
  } else {
    res.sendStatus(401)
  }
}

module.exports = authenticateJWT
