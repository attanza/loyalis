'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AuditTrailSchema extends Schema {
  up() {
    this.create('audit_trails', table => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .index()
      table
        .integer('auditable_id', 20)
        .unsigned()
        .index()
      table.string('auditable_type', 30).index()
      table.string('action', 20)
      table.text('detail')
      table.string('ip')
      table.string('browser')
      table.timestamps()
    })
  }

  down() {
    this.drop('audit_trails')
  }
}

module.exports = AuditTrailSchema
