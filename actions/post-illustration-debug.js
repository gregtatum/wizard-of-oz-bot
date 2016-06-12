const path = require('path')
const { readFileSync } = require('fs')
const twit = require('twit')
const { pickOne } = require('../utils')
const T = new twit(require('../config.js'))
const imgcat = require('imgcat')
const notifier = require('node-notifier')

const bookPaths = require('../books')
const relativeBookPath = process.argv[2]

// Use the provided path, or grab a random book
const bookPath = relativeBookPath
  ? path.resolve(
      __dirname,
      '../',
      relativeBookPath,
      "book.json"
    )
  : path.resolve(
      __dirname,
      '../books/',
      pickOne(bookPaths)
    )

const book = require(bookPath)
const sentence = pickOne(book)
const words = sentence.words
const imagePath = path.resolve(__dirname, '../', pickOne(sentence.images))

console.log('-------------------------------------------')
imgcat(imagePath).then(data => console.log(data))
console.log(words)

notifier.notify({
  title: 'Wizard of Bot',
  message: words,
  icon: imagePath
})
