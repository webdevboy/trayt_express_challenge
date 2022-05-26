const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const _ = require('lodash')

const {
  getRatedMovies,
  getRecommendationByDirector,
  getRecommendationByGenre,
  saveRecommendations,
  getSavedRecommendations,
} = require('./helperFunctions')

const authenticateJWT = require('./middleware/authenticateJWT')

const LISTENING_PORT = 9000
const app = express()

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

app.get('/recommendations', authenticateJWT, async (req, res) => {
  const userId = '9aaec1fc-ea13-4783-81f8-a998c1e0d648'
  const ratedMovies = await getRatedMovies(userId)

  // console.log(ratedMovies)

  let directors = []
  let genre = []
  for (let i = 0; i < ratedMovies.length; i++) {
    if (ratedMovies[i].userRating >= 7) {
      directors.push(ratedMovies[i].director)
      genre.push(...ratedMovies[i].genres)
    }
  }
  const favDirector = _.head(_(directors).countBy().entries().maxBy(_.last))
  const favGenre = _.head(_(genre).countBy().entries().maxBy(_.last))
  // console.log('directors==>', favDirector)
  // console.log('genre==>', favGenre)

  const favDirectorMovies = await getRecommendationByDirector(favDirector)
  const favGenreMovies = await getRecommendationByGenre(favGenre)

  const filteredFavDirectorMovies = favDirectorMovies.filter(
    (movie1) => !ratedMovies.some((movie2) => movie1.id === movie2.id)
  )
  const filteredFavGenreMovies = favGenreMovies.filter(
    (movie1) => !ratedMovies.some((movie2) => movie1.id === movie2.id)
  )
})

const server = app.listen(LISTENING_PORT, function () {
  console.log(`Server is listening on ${LISTENING_PORT}`)
})
