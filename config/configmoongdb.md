db.createUser({
  user: 'torarne',
  pwd: 'Mandala1.moongodb',
  roles: [{ role: 'userAdminAnyDatabase', db: 'admin' }]
})
