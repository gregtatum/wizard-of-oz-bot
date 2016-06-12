const fs = require('fs')
const { readFileSync, writeFileSync } = fs
const cheerio = require('cheerio')
const path = require('path')
const imgcat = require("imgcat")
const {
  blobToSentences,
  pickOne,
  fileExists,
  directoryExists,
  exit
} = require('../utils')

;(function main() {
  const relativeBookPath = process.argv[2]
  const bookPath = path.resolve(__dirname, '../', relativeBookPath)
  if (!relativeBookPath) exit(
    'Error: Must provide a path to a book folder like so:\n\n' +
    'node compile-book books/04-Dorothy-and-Wizard'
  )
  if (!directoryExists(bookPath)) exit(
    `The folder "${relativeBookPath}" does not exist.`
  )
  if (!fileExists(path.resolve(bookPath, 'index.html'))) exit(
    ` "No index.html was found in ${relativeBookPath}"`
  )
  if (!fileExists(path.resolve(bookPath, 'index.html'))) exit(
    ` "No index.js was found in ${relativeBookPath}"`
  )

  compileBook(relativeBookPath)

  console.log(
    'Book was successfully compiled to:\n' +
    path.resolve(bookPath, 'book.json')
  )
})()

function compileBook (relativeBookPath) {
  const bookPath = path.resolve(__dirname, '../', relativeBookPath)
  const bookHtmlPath = path.resolve(bookPath, 'index.html')
  const bookJsonPath = path.resolve(bookPath, 'book.json')
  const bookScriptPath = path.resolve(__dirname, '../', relativeBookPath)

  const $ = cheerio.load(
    readFileSync(bookHtmlPath, 'utf8')
  )

  replaceEngravedLetters($)
  const book = buildBookJSON($, relativeBookPath, bookScriptPath)

  // debugPrintBook(book)
  writeBookJsonToFile(book, bookJsonPath)
}

function buildBookJSON ($, bookPath, bookScriptPath) {
  const book = []
  const { startAfter, selector } = require(bookScriptPath)

  let lastImages
  let previousTag = 'p'
  let isReady = false

  $(selector || 'body > *').each(function(i, elem) {

    const $el = $(this)
    const tag = $el.get(0).tagName
    isReady = isReady || startAfter($el)
    if(!isReady) return

    if (tag === 'p') {
      let previousBookLength = book.length
      handlePTag($, book, $el, lastImages)
      if (previousBookLength !== book.length) {
        previousTag = 'p'
      }
    }

    // Select all the images
    let $images = $el.find('img')
    if(tag === 'img') { $images.add(this) }

    if($images.length > 0) {
      lastImages = previousTag === 'p' ? [] : lastImages
      $images.each(function() {
        const imgSrc = handleImgTag($, book, $(this), bookPath)
        if(imgSrc) {
          lastImages.push(imgSrc)
        }
      })
      previousTag = 'img'
    }
  })

  return book
}

function handleImgTag ($, book, $el, bookPath) {
  // Resolve to a relative path by chopping off the leading '/'
  const relativePath = path.resolve('/', bookPath, $el.attr('src'))
  return relativePath.substring(1, relativePath.length)
}

function handlePTag($, book, $el, images) {
  $el.find('span').each(function() {
    const $span = $(this)
    if($span.hasClass('pagenum')) {
      $span.remove()
    }
  })

  const sentences = blobToSentences($el.text())
  sentences.forEach(words => {
    book.push({ words, images })
  })
}

function replaceEngravedLetters ($) {
  /**
   * Some chapters' first letter is a stylized image. Replace these with text.
   *
   * <div class="figleft" style="margin-top:  -0.5em;">
   *   <img src="images/i015cap.jpg" alt="" title="T" />
   * </div>
   * <p>HE train from 'Frisco was very late. It should have...</p>
   */

  $('img').each(function() {
    const $img = $(this)
    const title = $img.attr('title') || ""
    const isSingleLetterIntro = title.match(/^\w$/)

    if(isSingleLetterIntro) {
      const $p = $(this.parentNode.nextSibling)
      $p.text(title + $p.text())
      $img.remove()
    }
  })
}

function debugPrintBook (book) {
  let previousImages
  book.reduce((memo, sentence) => {
    return memo.then(() => {
      (previousImages === sentence.images
        ? Promise.resolve()
        : Promise.all(Array.from(sentence.images).map(src => {
          return imgcat(src).then(
            image => {
              console.log(image)
              console.log(src + '\n')
            },
            error => {
              console.log(error)
            })
        }))
      )
      .then(() => {
        previousImages = sentence.images
        console.log(`|${sentence.words}|`)
        console.log(`------------------------------------------`)
      })
    })
  }, Promise.resolve())
  .then(null, (error) => {console.log(error)})
}

function writeBookJsonToFile (book, path) {
  try {
    writeFileSync(path, JSON.stringify(book, null, '\t'), 'utf8')
  } catch (e) {
    console.error("Unable to write out the JSON file.", e)
  }
}
