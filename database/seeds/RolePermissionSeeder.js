'use strict'

const Role = use('App/Models/Role')
const User = use('App/Models/User')
const Permission = use('App/Models/Permission')
const Database = use('Database')
const { Cache } = use('App/Helpers')

class RolePermissionSeeder {
  async run() {
    try {
      await Database.raw('SET FOREIGN_KEY_CHECKS=0;')
      await Role.truncate()
      await User.truncate()
      await Permission.truncate()
      await Database.table('permission_role').truncate()
      await Database.table('permission_user').truncate()
      await Database.table('role_user').truncate()
      await Database.table('audit_trails').truncate()
      await Database.table('error_logs').truncate()
      await Cache.flush()
      await Database.raw('SET FOREIGN_KEY_CHECKS=1;')

      const roles = ['Super Administrator', 'Administrator', 'Loyalis']

      const resources = ['Role', 'Permission', 'User']
      const actions = ['Read', 'Create', 'Update', 'Delete']

      // Seed Role
      let roleData = []
      roles.map(r => roleData.push({ name: r }))
      await Role.createMany(roleData)

      // Seed Permission
      let permissionData = []
      resources.map(r => {
        actions.map(a => permissionData.push({ name: `${a} ${r}` }))
      })
      await Permission.createMany(permissionData)

      // seed super administrator role
      const permissions = await Permission.query().pluck('id')
      const role = await Role.first()
      await role.permissions().attach(permissions)

      await Database.table('role_user').insert({
        user_id: 1,
        role_id: 1,
      })
    } catch (e) {
      console.log('e', e)
    }
  }
}

module.exports = RolePermissionSeeder
