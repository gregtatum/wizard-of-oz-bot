function startAfter($el) {
  return $el.get(0).tagName === "h2" && $el.text() === "The Prince of Pingaree"
}

module.exports = {
  startAfter
}
