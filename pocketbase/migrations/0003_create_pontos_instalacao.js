migrate(
  (app) => {
    const reports = app.findCollectionByNameOrId('reports')
    const collection = new Collection({
      name: 'pontos_instalacao',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'report_id',
          type: 'relation',
          required: true,
          collectionId: reports.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'numero_ponto', type: 'text', required: true },
        { name: 'coordenadas_lat', type: 'number' },
        { name: 'coordenadas_lng', type: 'number' },
        { name: 'tipo_instalacao', type: 'text' },
        { name: 'valor', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('pontos_instalacao')
    app.delete(collection)
  },
)
