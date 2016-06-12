# Wizard of Bot

A wizard of Oz bot that posts random passages and images from the various Oz
canon.

## Commands

#### `node actions/post-illustration`

Post an illustration and quote.

#### `node actions/post-illustration-debug [book/04-Dorothy-and-Wizard]`

Test from terminal an illustration and quote. Optionally include a book to test
the contents. Note that this script assumes iTerm2 is being used to display the
photo in terminal.

#### `node actions/compile-book book/04-Dorothy-and-Wizard`

Compile a `book.json` from an html ebook that includes images. This is used for
constructing the tweets.

## Installing

This assumes there is a config.js with the Twitter app credentials with the
following form.

```js
module.exports = {
  consumer_key: '############',
  consumer_secret: '############',
  access_token: '############',
  access_token_secret: '############'
}
```
