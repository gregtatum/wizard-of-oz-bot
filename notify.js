const notifier = require('node-notifier')

notifier.notify({
  title: 'Title',
  message: Date.now(),
})
