const _ = require('lodash')

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Get the most popular value from a String array
 *
 * @param  {Array.<string>} data
 * @return {string} By counting the most popular value
 */
async function getPopularValue(data) {
  await delay(100)
  return _.head(_(data).countBy().entries().maxBy(_.last))
}

/**
 * Compare two objects and remove duplicates objects by value
 *
 * @param  {Array<Movie>} movieArray1
 * @param  {Array<Movie>} movieArray2
 * @return {Promise<Array<Movie>>}
 */
async function getFilterOutMovies(movieArray1, movieArray2) {
  await delay(100)
  return movieArray1.filter(
    (movie1) => !movieArray2.some((movie2) => movie1.id === movie2.id)
  )
}

module.exports = {
  getPopularValue,
  getFilterOutMovies,
}
