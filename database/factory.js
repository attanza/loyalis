'use strict'

const Factory = use('Factory')

Factory.blueprint('App/Models/User', faker => {
  return {
    name: faker.name(),
    email: faker.email(),
    phone: faker.phone(),
    password: 'password',
    is_active: 1,
    alamat: faker.address(),
    province: faker.province(),
    city: faker.city(),
    district: faker.state(),
    village: faker.state(),
    post_code: faker.zip(),
  }
})
