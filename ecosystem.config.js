module.exports = {
  apps: [{
    name: 'inventory-frontend',
    script: 'npx',
    args: 'next start -p 4432 -H 0.0.0.0',
    cwd: '/home/erpadmin/bench-helthcare/apps/InventoryFrontend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    error_file: '/home/erpadmin/bench-helthcare/logs/inventory-frontend-error.log',
    out_file: '/home/erpadmin/bench-helthcare/logs/inventory-frontend-out.log',
    log_file: '/home/erpadmin/bench-helthcare/logs/inventory-frontend-combined.log',
    time: true
  }]
};
