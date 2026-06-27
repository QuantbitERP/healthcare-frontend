module.exports = {
  apps: [{
    name: 'healthcare-frontend',
    script: 'npx',
    args: 'next start -p 3003 -H 0.0.0.0',
    cwd: '/home/erpadmin/bench-GMCv15/apps/healthcare-frontend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    error_file: '/home/erpadmin/bench-GMCv15/apps/healthcare-frontend/logs/healthcare-frontend-error.log',
    out_file: '/home/erpadmin/bench-GMCv15/apps/healthcare-frontend/logs/healthcare-frontend-out.log',
    log_file: '/home/erpadmin/bench-GMCv15/apps/healthcare-frontend/logs/healthcare-frontend-combined.log',
    time: true
  }]
};
