module.exports = {
  apps: [
    {
      name: 'exito-formulario',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
