const path = require('path')
const { readFileSync } = require('fs')
const twit = require('twit')
const { pickOne } = require('../utils')
const T = new twit(require('../config.js'))
const imgcat = require('imgcat')
const notifier = require('node-notifier')

// Grab a random message
const bookPaths = require('../books')
const bookPath = path.resolve(
  __dirname,
  '../books/',
  pickOne(bookPaths)
)
const book = require(bookPath)
const sentence = pickOne(book)
const words = sentence.words
const imagePath = path.resolve(__dirname, '../', pickOne(sentence.images))
const imageData = readFileSync(imagePath, { encoding: 'base64' })

function throwError(msg, err) {
  console.error(msg)
  throw err
}

// Update image to twitter
T.post('media/upload', { media_data: imageData }, function (err, data, response) {
  if (err) throwError('Unable to upload picture to Twitter.', err)
  const mediaId = data.media_id_string
  const metaData = {
    media_id: mediaId,
    alt_text: { text: words }
  }

  T.post('media/metadata/create', metaData, function (err, data, response) {
    if (err) throwError('Unable to create meta data for tweet media.', err)

    const tweet = {
      status: words,
      media_ids: [mediaId]
    }

    T.post('statuses/update', tweet, function (err, data, response) {
      if (err) throwError('Unable to create a status update.', err)
      console.log('-------------------------------------------')
      console.log('Tweeted:', words)
      imgcat(imagePath).then(data => console.log(data))

      notifier.notify({
        title: 'Wizard of Bot',
        message: words,
        icon: imagePath
      })
    })
  })
})
