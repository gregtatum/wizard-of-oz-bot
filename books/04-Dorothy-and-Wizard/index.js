function startAfter($el) {
  return $el.get(0).tagName === "h2" && $el.text() === "CHAPTER 1."
}

module.exports = {
  startAfter
}
