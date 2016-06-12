function blobToSentences (text) {
  text = text
    .replace(/\r?\n|\r/g, ' ')
    .replace('  ', ' ')
    .replace('  ', ' ')

  return splitSentences(text)
    .map(sentence => sentence.trim())
    .filter(isTweetSized)
}

function isTweetSized(text) {
  return text.length > 0 && text.length < 140
}

/**
 * Use a for loop to smartly chop blobs of text into sentences. Correctly
 * handles sentences with quotes.
 */
function splitSentences (paragraph) {
  const sentences = []
  let start = 0
  let matchedQuotes = true
  for (var end = 0; end < paragraph.length; end++) {
    if(paragraph[end].match(/["“”]/)) {
      matchedQuotes = !matchedQuotes
    }
    if(paragraph[end] === '.') {
      if(paragraph[end + 1] === '"') {
        end++
        matchedQuotes = !matchedQuotes
      }
      if(matchedQuotes) {
        sentences.push(paragraph.substring(start, end + 1))
        start = end + 1
      }
    }
  }
  return sentences
}

function pickOne(array) {
  return array[Math.floor(array.length * Math.random())]
}

function fileExists(path) {
  try  {
    return require('fs').statSync(path).isFile();
  } catch (e) {
    return false;
  }
}

function directoryExists(path) {
  try  {
    return require('fs').statSync(path).isDirectory();
  } catch (e) {
    return false;
  }
}

function exit(msg) {
  console.log(msg)
  process.exit()
}

module.exports = {
  blobToSentences,
  isTweetSized,
  splitSentences,
  pickOne,
  fileExists,
  directoryExists,
  exit
}
