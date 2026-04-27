migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    const seedUser = (email, password, perfil, name) => {
      try {
        app.findAuthRecordByEmail('_pb_users_auth_', email)
      } catch (_) {
        const record = new Record(users)
        record.setEmail(email)
        record.setPassword(password)
        record.setVerified(true)
        record.set('perfil', perfil)
        record.set('name', name)
        app.save(record)
      }
    }

    seedUser('admin@krummenauer.com', 'admin123', 'admin', 'Admin Krummenauer')
    seedUser('supervisor@krummenauer.com', 'supervisor123', 'supervisor', 'Supervisor Krummenauer')
    seedUser('tecnico@krummenauer.com', 'tecnico123', 'tecnico', 'Técnico Krummenauer')
    seedUser('vinitg44@gmail.com', 'Skip@Pass', 'admin', 'Vini Admin')
  },
  (app) => {
    const emails = [
      'admin@krummenauer.com',
      'supervisor@krummenauer.com',
      'tecnico@krummenauer.com',
      'vinitg44@gmail.com',
    ]

    for (const email of emails) {
      try {
        const record = app.findAuthRecordByEmail('_pb_users_auth_', email)
        app.delete(record)
      } catch (_) {}
    }
  },
)
