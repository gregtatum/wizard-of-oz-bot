function startAfter($el) {
  return Boolean($el.find('#Chapter_I').get(0))
}

module.exports = {
  startAfter,
  selector: 'body > .main > *'
}
