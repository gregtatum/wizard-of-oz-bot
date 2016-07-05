function startAfter($el) {
  return $el.get(0).tagName === "h2" && $el.text() === "The Girl in the Chicken Coop"
}

module.exports = {
  startAfter
}
