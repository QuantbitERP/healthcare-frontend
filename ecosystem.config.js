module.exports = {
  apps: [{
    name: 'inventory-frontend',
    script: 'npx',
    args: 'next start -p 3003 -H 0.0.0.0',
    cwd: '/home/mipladmin/bench-demoHIMS/quantbit_hims_frontend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    error_file: '/home/mipladmin/bench-demoHIMS/quantbit_hims_frontend/logs/inventory-frontend-error.log',
    out_file: '/home/mipladmin/bench-demoHIMS/quantbit_hims_frontend/logs/inventory-frontend-out.log',
    log_file: '/home/mipladmin/bench-demoHIMS/quantbit_hims_frontend/logs/inventory-frontend-combined.log',
    time: true
  }]
};
