const book = require("./books/04-Dorothy-and-Wizard/book.json")

console.log(
  book.map(line => line.words).join('\n').replace(/[^a-zA-Z\d\s:]/g, "")
)
