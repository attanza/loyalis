'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

const uuidv4 = require('uuid/v4')

class User extends Model {
  static boot() {
    super.boot()

    this.addTrait('@provider:Lucid/SoftDeletes')

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
    this.addHook('beforeCreate', async userInstance => {
      userInstance.uid = uuidv4()
    })
  }

  static get traits() {
    return [
      '@provider:Adonis/Acl/HasRole',
      '@provider:Adonis/Acl/HasPermission',
    ]
  }

  tokens() {
    return this.hasMany('App/Models/Token')
  }

  static get hidden() {
    return ['password']
  }
}

module.exports = User
