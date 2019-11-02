'use strict'

const Audit = use('App/Models/AuditTrail')

const actions = ['CREATE', 'UPDATE', 'DELETE']

module.exports = async (
  { request, auth },
  action,
  auditable_id,
  auditable_type,
  detail
) => {
  try {
    const headers = request.headers()
    const user = await auth.getUser()
    await Audit.create({
      user_id: user.id,
      ip: request.ip(),
      auditable_id,
      auditable_type,
      action: actions[action],
      detail,
      browser: headers['user-agent'],
    })
  } catch (e) {
    throw e
  }
}
