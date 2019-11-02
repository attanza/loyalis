'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class UserSeeder {
  async run() {
    await Factory.model('App/Models/User').createMany(5)
  }
}

module.exports = UserSeeder
