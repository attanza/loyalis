const Env = use('Env')
const ErrorLog = use('App/Models/ErrorLog')
const Mail = use('Mail')

module.exports = async (request, e) => {
  const NODE_ENV = Env.get('NODE_ENV')
  // if (NODE_ENV === 'production') {
  await ErrorLog.create({
    url: request.url(),
    method: request.method(),
    error: e.message,
  })
  const subject = `himommy error: ${request.method()} ${request.url()}`
  const data = { e }
  Mail.send('emails.errors_mail', data, message => {
    message
      .to('myrbx.747@gmail.com')
      .from(Env.get('MAIL_FROM'))
      .subject(subject)
  })
  // }
}
