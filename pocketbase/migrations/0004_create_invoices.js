migrate(
  (app) => {
    const collection = new Collection({
      name: 'invoices',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'usuario_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'semana_inicio', type: 'date', required: true },
        { name: 'semana_fim', type: 'date', required: true },
        { name: 'total_pontos', type: 'number' },
        { name: 'valor_total', type: 'number' },
        { name: 'status', type: 'select', values: ['rascunho', 'gerada'], maxSelect: 1 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('invoices')
    app.delete(collection)
  },
)
