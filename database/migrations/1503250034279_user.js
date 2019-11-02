'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up() {
    this.create('users', table => {
      table.increments()
      table.uuid('uid').unique()
      table.string('name', 100)
      table.string('email').nullable()
      table.string('phone', 30).unique()
      table.string('password')
      table.boolean('is_active').default(false)
      table.string('avatar')
      table.text('alamat')
      table.string('province', 50)
      table.string('city', 50)
      table.string('district', 50)
      table.string('village', 50)
      table.string('post_code', 10)
      table.dateTime('deleted_at')
      table.timestamps()
    })
  }

  down() {
    this.drop('users')
  }
}

module.exports = UserSchema
