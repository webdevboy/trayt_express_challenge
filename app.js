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
const { getPopularValue, getFilterOutMovies } = require('./utilies')
const authenticateJWT = require('./middleware/authenticateJWT')

const LISTENING_PORT = 9000
const app = express()

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

app.get('/recommendations', authenticateJWT, async (req, res) => {
  const { userId } = req
  let recommendation = await getSavedRecommendations(userId)

  if (!recommendation) {
    const ratedMovies = await getRatedMovies(userId)

    let directors = []
    let genres = []

    for (let i = 0; i < ratedMovies.length; i++) {
      if (ratedMovies[i].userRating >= 7) {
        directors.push(ratedMovies[i].director)
        genres.push(...ratedMovies[i].genres)
      }
    }
    const favDirector = await getPopularValue(directors) //get favDirector from rateMovies
    const favGenre = await getPopularValue(genres) //get favGenre from rateMovies

    let favDirectorMovies = [] // All movies by favDirector
    let favGenreMovies = [] // All movies by favGenre
    let filteredFavDirectorMovies = [] // Filter out movies in byDirector
    let filteredFavGenreMovies = [] // Filter out movies in  byGenre

    if (favDirector) {
      favDirectorMovies = await getRecommendationByDirector(favDirector)
      filteredFavDirectorMovies = await getFilterOutMovies(
        favDirectorMovies,
        ratedMovies
      )
    }
    if (favGenre) {
      favGenreMovies = await getRecommendationByGenre(favGenre)
      filteredFavGenreMovies = await getFilterOutMovies(
        favGenreMovies,
        ratedMovies
      )
    }

    recommendation = {
      favDirector,
      favGenre,
      byDirector: filteredFavDirectorMovies,
      byGenre: filteredFavGenreMovies,
    }
    await saveRecommendations(userId, recommendation)
  }

  return res.send({ recommendation })
})

const server = app.listen(LISTENING_PORT, function () {
  console.log(`Server is listening on ${LISTENING_PORT}`)
})
