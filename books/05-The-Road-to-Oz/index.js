function startAfter($el) {
  return Boolean($el.find('#CHAP_1').get(0))
}

module.exports = {
  startAfter
}
