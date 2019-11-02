'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hi Mommy' }
})

require('./routes/admin')
require('./routes/mobile')
