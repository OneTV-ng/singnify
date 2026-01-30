// ecosystem.config.js
module.exports = {
    apps : [{
      name: "Singnify v2.0 Pro",
      script: "npm",
      args: "start",
      cwd: "/var/app/singnify",
      watch: true,
      env: {
        NODE_ENV: "production",
      }
    }]
  };
