const jwt = require('jsonwebtoken')

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(403).send('A token is required for authentication')
    }
    return next()

    // if we have accessTokenSecret, we can use the following code

    // jwt.verify(token, accessTokenSecret, (err, user) => {
    //   if (err) {
    //     return res.sendStatus(403)
    //   }
    //   req.user = user
    //   next()
    // })
  } else {
    res.sendStatus(401)
  }
}

module.exports = authenticateJWT
