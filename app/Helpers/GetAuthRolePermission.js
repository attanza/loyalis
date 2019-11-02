'use strict'

class GetAuthRolePermission {
  async getUserId(auth) {
    const user = await this.getUser(auth)
    return user.id
  }

  async getRole(auth) {
    const user = await this.getUser(auth)
    const roles = await user.getRoles()
    return roles[0]
  }

  async getPermissions(auth) {
    const role = await this.getRole(auth)
    const permissions = await role.getPermissions()
    return permissions
  }

  async getUser(auth) {
    const user = await auth.getUser()
    return user
  }

  async getTocologistId(auth) {
    let user = await this.getUser(auth)
    await user.load('tocologists', builder => builder.select('id'))
    user = user.toJSON()
    return user.tocologists ? user.tocologists[0].id : null
  }
}

module.exports = new GetAuthRolePermission()
